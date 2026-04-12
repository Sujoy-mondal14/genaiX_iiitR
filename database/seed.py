from .database import engine, SessionLocal, Base
from .models import User, Worker, Notice, Issue, Review
import os

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if not db.query(User).first():
        # Pre-uploaded users
        admin = User(user_id="admin", name="Administrator", password="@admin123", role="admin")
        student1 = User(user_id="2025ug1007", name="John Doe", password="@1234", role="student")
        db.add_all([admin, student1])
        
        # Pre-uploaded workers
        w1 = Worker(name="Ramesh Singh", contact_info="9876543210", profession="Plumber")
        w2 = Worker(name="Sita Devi", contact_info="9876543211", profession="Cleaner")
        w3 = Worker(name="Abdul Khan", contact_info="9876543212", profession="Electrician")
        db.add_all([w1, w2, w3])
        
        db.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    seed_db()
