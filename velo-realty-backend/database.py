import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Fetch DATABASE_URL from environment variable (Render, Heroku, etc.)
# Fallback to hosted Render DB
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://paramjoga:hYD1A2xTlN3UNGHyD1BnRdS9AJGQEqSz@dpg-d7sqdu0k1i2s73a0hpbg-a.oregon-postgres.render.com/velo_reality"
)

# Fix for SQLAlchemy not supporting "postgres://" prefix (common in Render/Heroku)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        print("Successfully connected to the database!")
except Exception as e:
    print(f"DATABASE CONNECTION ERROR: {e}")
    # Fallback to local for safety if hosted fails
    SQLALCHEMY_DATABASE_URL = "postgresql://localhost/velo_reality"
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f"DB Session Error: {e}")
        raise
    finally:
        db.close()
 