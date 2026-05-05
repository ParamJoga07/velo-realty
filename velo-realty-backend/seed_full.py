from sqlalchemy.orm import Session
from database import engine
import models

def seed_data():
    db = Session(engine)
    
    # 1. Seed Developers
    devs = [
        {"name": "Raghava Projects", "slug": "raghava", "about": "Luxury high-rise specialists.", "total_projects": 12},
        {"name": "Prestige Group", "slug": "prestige", "about": "National leaders in premium residential.", "total_projects": 43},
        {"name": "ASBL", "slug": "asbl", "about": "Innovators in tech-enabled living.", "total_projects": 14},
        {"name": "Ramky Estates", "slug": "ramky", "about": "Pioneers in gated communities.", "total_projects": 26}
    ]
    
    dev_models = []
    print("Seeding developers...")
    for d in devs:
        existing = db.query(models.DeveloperProfileModel).filter(models.DeveloperProfileModel.slug == d["slug"]).first()
        if not existing:
            dev = models.DeveloperProfileModel(**d)
            db.add(dev)
            dev_models.append(dev)
        else:
            dev_models.append(existing)
    
    db.commit()

    # 2. Seed Projects linked to Corridors
    corridors = db.query(models.CorridorModel).all()
    if corridors and dev_models:
        print("Seeding projects...")
        projects = [
            {"name": "Skyline Heights", "slug": "skyline-heights", "developer_id": dev_models[0].id, "corridor_id": corridors[3].id, "project_type": "Apartment", "location": "Kokapet"},
            {"name": "Crest Valley", "slug": "crest-valley", "developer_id": dev_models[1].id, "corridor_id": corridors[3].id, "project_type": "Villa", "location": "Tellapur"},
            {"name": "East Gate", "slug": "east-gate", "developer_id": dev_models[2].id, "corridor_id": corridors[2].id, "project_type": "Commercial", "location": "Uppal"},
            {"name": "North Woods", "slug": "north-woods", "developer_id": dev_models[3].id, "corridor_id": corridors[0].id, "project_type": "Plot", "location": "Kompally"}
        ]
        for p in projects:
            if not db.query(models.ProjectModel).filter(models.ProjectModel.slug == p["slug"]).first():
                db.add(models.ProjectModel(**p))
    
    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
