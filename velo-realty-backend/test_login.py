import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import models
from main import verify_password, get_password_hash

# Use the hosted DB URL
SQLALCHEMY_DATABASE_URL = "postgresql://paramjoga:hYD1A2xTlN3UNGHyD1BnRdS9AJGQEqSz@dpg-d7sqdu0k1i2s73a0hpbg-a.oregon-postgres.render.com/velo_reality"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def test_login():
    db = Session(engine)
    username = "superadmin"
    password = "VeloRealty@2026"
    
    print(f"Testing login for {username}...")
    user = db.query(models.AdminUser).filter(models.AdminUser.username == username).first()
    
    if not user:
        print("User not found in DB")
        return
        
    print(f"User found: {user.username}")
    print(f"Hashed password in DB: {user.hashed_password}")
    
    try:
        is_valid = verify_password(password, user.hashed_password)
        print(f"Password valid: {is_valid}")
    except Exception as e:
        print(f"Error during password verification: {e}")
    
    db.close()

if __name__ == "__main__":
    test_login()
