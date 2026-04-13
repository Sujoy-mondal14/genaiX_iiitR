from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import models, database
from backend.agent import classify_issue
from pydantic import BaseModel

models.Base.metadata.create_all(bind=database.engine)

# Auto-seed the initial admin account
db = database.SessionLocal()
if not db.query(models.User).filter(models.User.role == "admin").first():
    admin_user = models.User(
        user_id="admin",
        name="System Admin",
        password="adminpassword",
        contact_number="0000000000",
        role="admin"
    )
    db.add(admin_user)
    db.commit()
db.close()

app = FastAPI(title="Campus Problem Solver API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, use front-end origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import Optional

class IssueCreate(BaseModel):
    user_id: str
    description: str
    type_override: Optional[str] = None
    image_url: Optional[str] = None

class LoginRequest(BaseModel):
    user_id: str
    password: str

class NoticeCreate(BaseModel):
    content: str

class WorkerCreate(BaseModel):
    name: str
    profession: str
    contact_info: str

class UserCreate(BaseModel):
    user_id: str
    name: str
    password: str
    contact_number: str

class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class UserCreate(BaseModel):
    user_id: str
    name: str
    password: str
    contact_number: str

@app.post("/login")
def login(req: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.user_id == req.user_id).first()
    if not user or user.password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.user_id, "name": user.name, "role": user.role, "id": user.id}

@app.get("/notices")
def get_notices(db: Session = Depends(database.get_db)):
    notices = db.query(models.Notice).order_by(models.Notice.created_at.desc()).all()
    return notices

@app.post("/notices")
def create_notice(notice: NoticeCreate, db: Session = Depends(database.get_db)):
    new_notice = models.Notice(content=notice.content)
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice

@app.delete("/notices/{notice_id}")
def delete_notice(notice_id: int, db: Session = Depends(database.get_db)):
    notice = db.query(models.Notice).filter(models.Notice.id == notice_id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"message": "Notice deleted"}

@app.post("/issues")
def create_issue(issue: IssueCreate, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.user_id == issue.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 48h duplicate check
    forty_eight_hours_ago = datetime.utcnow() - timedelta(hours=48)
    recent_issues = db.query(models.Issue).filter(
        models.Issue.user_id == user.id,
        models.Issue.created_at >= forty_eight_hours_ago
    ).all()

    # Call AI agent
    ai_result = classify_issue(issue.description)
    if not ai_result.get("is_valid"):
        raise HTTPException(status_code=400, detail="Invalid issue description (detected as gibberish).")

    proposed_category = issue.type_override if issue.type_override and issue.type_override != 'Other' else ai_result.get("category")
    priority = ai_result.get("priority", "Low")

    for past_issue in recent_issues:
        if past_issue.type == proposed_category and past_issue.status != "Resolved":
            # Just bump priority instead of creating new
            past_issue.priority = "High"
            db.commit()
            return {"message": "Existing issue within 48h found. Priority increased.", "tracking_id": past_issue.tracking_id}

    tracking_id = str(uuid.uuid4())[:8].upper()
    
    new_issue = models.Issue(
        tracking_id=tracking_id,
        user_id=user.id,
        type=proposed_category,
        description=issue.description,
        image_url=issue.image_url,
        priority=priority,
        status="Submitted",
    )
    db.add(new_issue)
    db.commit()
    return {"message": "Issue created", "tracking_id": tracking_id, "category": proposed_category}

@app.get("/issues/my/{user_id}")
def my_issues(user_id: str, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    issues = db.query(models.Issue).filter(models.Issue.user_id == user.id).all()
    # include worker details if assigned
    result = []
    for issue in issues:
        assigned_worker_name = issue.assigned_worker.name if issue.assigned_worker else None
        result.append({
            "id": issue.id,
            "tracking_id": issue.tracking_id,
            "type": issue.type,
            "description": issue.description,
            "status": issue.status,
            "priority": issue.priority,
            "assigned_worker": assigned_worker_name,
            "created_at": issue.created_at,
            "resolved_at": issue.resolved_at,
            "review": {"rating": issue.review.rating, "comment": issue.review.comment} if issue.review else None
        })
    return result

@app.get("/issues/pending")
def pending_issues(db: Session = Depends(database.get_db)):
    issues = db.query(models.Issue).filter(models.Issue.status != "Resolved", models.Issue.status != "Deleted").order_by(
        models.Issue.priority.desc() # High, Medium, Low (alphabetical sorting is wrong H,M,L.. we should handle logic in frontend or mapping)
    ).all()
    
    # Custom sort
    priority_map = {"High": 3, "Medium": 2, "Low": 1}
    issues.sort(key=lambda x: priority_map.get(x.priority, 0), reverse=True)

    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "tracking_id": issue.tracking_id,
            "type": issue.type,
            "description": issue.description,
            "status": issue.status,
            "priority": issue.priority,
            "user": issue.user.name,
            "assigned_worker_id": issue.assigned_worker_id,
            "image_url": issue.image_url,
            "created_at": issue.created_at,
            "resolved_at": issue.resolved_at,
            "review": {"rating": issue.review.rating, "comment": issue.review.comment} if issue.review else None
        })
    return result

@app.get("/workers")
def get_all_workers(db: Session = Depends(database.get_db)):
    return db.query(models.Worker).all()

@app.get("/workers/available")
def get_available_workers(db: Session = Depends(database.get_db)):
    return db.query(models.Worker).filter(models.Worker.is_available == True).all()

@app.post("/workers")
def create_worker(worker: WorkerCreate, db: Session = Depends(database.get_db)):
    new_worker = models.Worker(name=worker.name, profession=worker.profession, contact_info=worker.contact_info)
    db.add(new_worker)
    db.commit()
    return new_worker

@app.get("/users")
def get_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).filter(models.User.role != "admin").all()

@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(database.get_db)):
    new_user = models.User(user_id=user.user_id, name=user.name, password=user.password, contact_number=user.contact_number)
    db.add(new_user)
    db.commit()
    return new_user

@app.post("/issues/{issue_id}/assign")
def assign_worker(issue_id: int, worker_id: int, db: Session = Depends(database.get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    
    if not issue or not worker:
        raise HTTPException(status_code=404, detail="Not found")
    if not worker.is_available:
        raise HTTPException(status_code=400, detail="Worker is not available")
        
    issue.assigned_worker_id = worker.id
    issue.status = "Assigned"
    worker.is_available = False # Mark worker unavailable when assigned
    db.commit()
    return {"message": "Assigned successfully"}

@app.post("/issues/{issue_id}/status")
def update_status(issue_id: int, status: str, db: Session = Depends(database.get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Not found")
    issue.status = status
    if status == "Resolved":
        issue.resolved_at = datetime.utcnow()
    if status in ["Resolved", "Deleted"]:
        # Free up the worker
        if issue.assigned_worker:
            issue.assigned_worker.is_available = True
    db.commit()
    return {"message": f"Status updated to {status}"}

@app.post("/issues/{issue_id}/review")
def create_review(issue_id: int, review: ReviewCreate, db: Session = Depends(database.get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if issue.review:
        raise HTTPException(status_code=400, detail="Review already exists")
    
    new_review = models.Review(issue_id=issue.id, rating=review.rating, comment=review.comment)
    db.add(new_review)
    db.commit()
    return new_review

@app.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    raised = db.query(models.Issue).filter(models.Issue.created_at >= twenty_four_hours_ago).count()
    resolved = db.query(models.Issue).filter(models.Issue.resolved_at >= twenty_four_hours_ago).count()
    success_rate = (resolved / raised * 100) if raised > 0 else 100 if resolved > 0 else 0
    return {
        "raised_24h": raised,
        "resolved_24h": resolved,
        "success_rate": round(success_rate, 1)
    }

@app.get("/issues/resolved")
def resolved_issues(db: Session = Depends(database.get_db)):
    issues = db.query(models.Issue).filter(models.Issue.status == "Resolved").order_by(models.Issue.resolved_at.desc()).all()
    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "tracking_id": issue.tracking_id,
            "type": issue.type,
            "description": issue.description,
            "status": issue.status,
            "user": issue.user.name,
            "resolved_at": issue.resolved_at,
            "review": {"rating": issue.review.rating, "comment": issue.review.comment} if issue.review else None
        })
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port)
