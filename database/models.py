from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # e.g., 2025ug1007
    name = Column(String)
    password = Column(String)
    contact_number = Column(String, default="")
    role = Column(String, default="student") # student or admin
    
    issues = relationship("Issue", back_populates="user")

class Worker(Base):
    __tablename__ = "workers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    contact_info = Column(String)
    profession = Column(String)
    is_available = Column(Boolean, default=True)

class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Issue(Base):
    __tablename__ = "issues"
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)
    description = Column(Text)
    image_url = Column(String, nullable=True)
    priority = Column(String, default="Low") # Low, Medium, High
    status = Column(String, default="Submitted") # Submitted, Assigned, Resolved, Deleted
    assigned_worker_id = Column(Integer, ForeignKey("workers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="issues")
    assigned_worker = relationship("Worker")
    review = relationship("Review", back_populates="issue", uselist=False)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    rating = Column(Integer) # 1 to 5
    comment = Column(String, nullable=True)
    
    issue = relationship("Issue", back_populates="review")
