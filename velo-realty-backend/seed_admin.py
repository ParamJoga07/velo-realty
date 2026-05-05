from database import SessionLocal
import models
from main import get_password_hash

def seed_admin():
    db = SessionLocal()
    # Check if admin already exists
    admin = db.query(models.AdminUser).filter(models.AdminUser.username == "superadmin").first()
    if not admin:
        new_admin = models.AdminUser(
            username="superadmin",
            hashed_password=get_password_hash("VeloRealty@2026") # Secure password
        )
        db.add(new_admin)
        db.commit()
        print("Superadmin user created successfully!")
    else:
        print("Superadmin already exists.")
    db.close()

if __name__ == "__main__":
    seed_admin()
