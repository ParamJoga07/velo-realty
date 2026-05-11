
from sqlalchemy import text
from database import engine

print("Attempting to clear database connections...")
try:
    with engine.connect() as conn:
        # Get the database name from the engine URL
        db_name = engine.url.database
        print(f"Database: {db_name}")
        
        # This query kills other sessions. 
        # Note: In some hosted environments, you might not have permission to do this.
        result = conn.execute(text(f"""
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = '{db_name}'
              AND pid <> pg_backend_pid();
        """))
        print(f"Terminated connections: {result.rowcount}")
        conn.commit()
    print("Cleanup complete!")
except Exception as e:
    print(f"Cleanup failed: {e}")
