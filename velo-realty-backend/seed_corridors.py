from sqlalchemy.orm import Session
from database import engine
import models

def seed_corridors():
    db = Session(engine)
    
    corridors_data = [
        {
            "name": "North Corridor",
            "slug": "north-corridor",
            "location": "North Hyderabad",
            "description": "Strategic development zone encompassing Kompally, Medchal, and Gundlapochampally. Known for its balanced residential-industrial growth.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG"
        },
        {
            "name": "South Corridor",
            "slug": "south-corridor",
            "location": "South Hyderabad",
            "description": "Primarily focused around the Airport and Fab City. Features high-value residential plots and connectivity via the Outer Ring Road.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg"
        },
        {
            "name": "East Corridor",
            "slug": "east-corridor",
            "location": "East Hyderabad",
            "description": "The IT hub expansion zone including Uppal and Pocharam. Home to major tech parks and affordable luxury high-rises.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg"
        },
        {
            "name": "West Corridor",
            "slug": "west-corridor",
            "location": "West Hyderabad",
            "description": "The peak of Hyderabad's real estate, featuring the Financial District, Kokapet, and Tellapur. High-velocity investment discovery zone.",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg"
        }
    ]

    print("Seeding growth corridors...")
    for c_data in corridors_data:
        existing = db.query(models.CorridorModel).filter(models.CorridorModel.slug == c_data["slug"]).first()
        if not existing:
            corridor = models.CorridorModel(**c_data)
            db.add(corridor)
            print(f"Added {c_data['name']}")
        else:
            print(f"Skipping {c_data['name']} (already exists)")
    
    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_corridors()
