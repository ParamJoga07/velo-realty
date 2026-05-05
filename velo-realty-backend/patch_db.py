from sqlalchemy import text
from database import engine

print("Updating project_details table...")
with engine.connect() as conn:
    conn.execute(text("ALTER TABLE project_details ADD COLUMN IF NOT EXISTS corridor_id INTEGER REFERENCES corridors(id)"))
    conn.commit()
print("Success!")
