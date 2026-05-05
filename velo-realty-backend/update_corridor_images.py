from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import models

# Use the hosted DB URL
SQLALCHEMY_DATABASE_URL = "postgresql://paramjoga:hYD1A2xTlN3UNGHyD1BnRdS9AJGQEqSz@dpg-d7sqdu0k1i2s73a0hpbg-a.oregon-postgres.render.com/velo_reality"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def update_corridors():
    db = Session(engine)
    
    updates = {
        "north-corridor": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1200&auto=format&fit=crop",
        "south-corridor": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
        "east-corridor": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        "west-corridor": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop"
    }

    print("Updating growth corridor images with ultra-stable URLs...")
    for slug, img_url in updates.items():
        corridor = db.query(models.CorridorModel).filter(models.CorridorModel.slug == slug).first()
        if corridor:
            corridor.image = img_url
            print(f"Updated {corridor.name}")
        else:
            print(f"Corridor {slug} not found")
    
    db.commit()
    db.close()
    print("Update complete!")

if __name__ == "__main__":
    update_corridors()
