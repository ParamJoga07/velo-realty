import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

NEW_GUIDES = [
    {
        "title": "Best Areas to Invest in Hyderabad",
        "description": "Discover Hyderabad's fastest-growing residential and investment corridors, featuring Kokapet, Tellapur, and Gachibowli."
    },
    {
        "title": "Upcoming Luxury Projects",
        "description": "An exclusive look into the most anticipated premium gated villas and ultra-luxury high-rise launches in 2026."
    },
    {
        "title": "Real Estate Investment Tips",
        "description": "Expert advice on structural appreciation, capital protection, and navigating pre-launch pricing advantages."
    },
    {
        "title": "Villa vs Apartment",
        "description": "A comprehensive comparison of luxury villas versus high-rise apartments, focusing on security, lifestyle, and resale value."
    }
]

def patch_guides():
    db = SessionLocal()
    try:
        # Create table if not exists
        models.Base.metadata.create_all(bind=engine)
        
        # Clear existing guides
        db.query(models.GuideModel).delete()
        
        # Insert new guides
        for g in NEW_GUIDES:
            guide = models.GuideModel(title=g["title"], description=g["description"])
            db.add(guide)
            print(f"Added guide: {g['title']}")
            
        db.commit()
        print("Successfully patched guides in database!")
    except Exception as e:
        print(f"Error patching guides: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    patch_guides()
