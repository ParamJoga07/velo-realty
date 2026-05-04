from database import engine, SessionLocal, Base
import models
from main import (
    PROPERTIES, DEVELOPERS, COMMUNITIES, GUIDES,
    PARTNERS, STATS, AREA_RATES, TEAM_MEMBERS
)
from seed_data import DEVELOPERS_DATA
from seed_projects_1 import PROJECTS_BATCH_1
from seed_projects_2 import P2
from seed_projects_3 import P3
from seed_projects_4 import P4

ALL_PROJECTS = PROJECTS_BATCH_1 + P2 + P3 + P4

# Reset database schema
Base.metadata.drop_all(bind=engine)
# Create tables with new schema
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.PropertyModel).first():
            print("Database already seeded.")
            return

        print("Seeding Properties...")
        for p in PROPERTIES:
            db_item = models.PropertyModel(**p)
            db.add(db_item)

        print("Seeding Developers...")
        for d in DEVELOPERS:
            db_item = models.DeveloperModel(**d)
            db.add(db_item)

        print("Seeding Communities...")
        for c in COMMUNITIES:
            db_item = models.CommunityModel(**c)
            db.add(db_item)

        print("Seeding Guides...")
        for g in GUIDES:
            db_item = models.GuideModel(**g)
            db.add(db_item)

        print("Seeding Partners...")
        for p in PARTNERS:
            db_item = models.PartnerModel(name=p)
            db.add(db_item)

        print("Seeding Stats...")
        for s in STATS:
            db_item = models.StatModel(**s)
            db.add(db_item)

        print("Seeding Area Rates...")
        for a in AREA_RATES:
            db_item = models.AreaRateModel(**a)
            db.add(db_item)

        print("Seeding Team Members...")
        for t in TEAM_MEMBERS:
            db_item = models.TeamMemberModel(**t)
            db.add(db_item)

        # --- NEW: Seed Developer Profiles & Projects ---
        print("\nSeeding Developer Profiles...")
        dev_map = {}  # slug -> DeveloperProfileModel id
        for d in DEVELOPERS_DATA:
            dev = models.DeveloperProfileModel(
                name=d["name"],
                slug=d["slug"],
                about=d["about"],
                founded_year=d.get("founded_year"),
                headquarters=d.get("headquarters"),
                logo_url=d.get("logo_url"),
                total_projects=d.get("total_projects", 0),
            )
            db.add(dev)
            db.flush()  # Get the id
            dev_map[d["slug"]] = dev.id
            print(f"  Added developer: {d['name']}")

        print(f"\nSeeding {len(ALL_PROJECTS)} Projects...")
        for p in ALL_PROJECTS:
            dev_slug = p.pop("developer_slug")
            images_data = p.pop("images")
            developer_id = dev_map.get(dev_slug)
            if not developer_id:
                print(f"  WARNING: Developer '{dev_slug}' not found, skipping project '{p['name']}'")
                continue

            project = models.ProjectModel(developer_id=developer_id, **p)
            db.add(project)
            db.flush()  # Get the project id

            for img in images_data:
                db_img = models.ProjectImageModel(project_id=project.id, **img)
                db.add(db_img)

            print(f"  Added project: {p['name']} ({len(images_data)} images)")

        db.commit()
        print(f"\nDatabase successfully seeded!")
        print(f"  Developers: {len(DEVELOPERS_DATA)}")
        print(f"  Projects: {len(ALL_PROJECTS)}")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
