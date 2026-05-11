
from sqlalchemy import text
from database import engine

print("Updating properties table...")
try:
    with engine.connect() as conn:
        # Check if columns exist first (for databases that don't support ADD COLUMN IF NOT EXISTS)
        # PostgreSQL supports it, but SQLite doesn't for ADD COLUMN.
        # This app uses PostgreSQL (Render) or SQLite (local).
        
        # We'll use a safer approach for both.
        for column, table in [("developer_id", "developer_profiles"), ("corridor_id", "corridors")]:
            try:
                conn.execute(text(f"ALTER TABLE properties ADD COLUMN {column} INTEGER REFERENCES {table}(id)"))
                print(f"Added column {column}")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                    print(f"Column {column} already exists")
                else:
                    print(f"Error adding {column}: {e}")
        
        conn.commit()
    print("Patching complete!")
except Exception as e:
    print(f"Failed to connect or commit: {e}")
