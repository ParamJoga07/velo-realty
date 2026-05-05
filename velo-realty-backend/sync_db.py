from sqlalchemy import text
from database import engine
import models

print("Dropping old tables and recreating...")
with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS communities CASCADE"))
    conn.commit()

models.Base.metadata.create_all(bind=engine)
print("Database synchronized!")
