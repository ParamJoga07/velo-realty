import os
from sqlalchemy import create_engine, text

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://paramjoga:hYD1A2xTlN3UNGHyD1BnRdS9AJGQEqSz@dpg-d7sqdu0k1i2s73a0hpbg-a.oregon-postgres.render.com/velo_reality"
)

if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE team_members ADD COLUMN \"order\" INTEGER DEFAULT 0;"))
        conn.commit()
    print("Successfully patched team_members table")
except Exception as e:
    print(f"DATABASE CONNECTION ERROR: {e}")
