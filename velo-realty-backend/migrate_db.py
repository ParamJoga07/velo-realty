from database import engine
from sqlalchemy import text
with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE project_details ADD COLUMN is_featured BOOLEAN DEFAULT false;"))
        print("Column added successfully")
    except Exception as e:
        print("Error or already exists:", e)
