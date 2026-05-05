
import os
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def slugify(text):
    return text.lower().replace("’", "").replace("'", "").replace(" ", "-").replace("(", "").replace(")", "").replace(".", "").strip("-")

def seed_categories_and_zones():
    db = SessionLocal()
    try:
        # 1. Define Categories and Zones
        categories_data = [
            "Commercial", "Villas", "Ready to Move", "Off-Plan", "Open Plot"
        ]
        zones_data = [
            "West Zone", "South Zone", "North Zone", "East Zone", "Central Zone"
        ]

        # 2. Create Categories
        cats = {}
        for cat_name in categories_data:
            cat = db.query(models.CategoryModel).filter(models.CategoryModel.name == cat_name).first()
            if not cat:
                cat = models.CategoryModel(name=cat_name, slug=slugify(cat_name))
                db.add(cat)
                db.commit()
                db.refresh(cat)
            cats[cat_name] = cat

        # 3. Create Zones
        zones = {}
        for zone_name in zones_data:
            zone = db.query(models.ZoneModel).filter(models.ZoneModel.name == zone_name).first()
            if not zone:
                zone = models.ZoneModel(name=zone_name, slug=slugify(zone_name))
                db.add(zone)
                db.commit()
                db.refresh(zone)
            zones[zone_name] = zone

        # 4. Map Data from User Request
        data = {
            "Commercial": [
                "Brigade Gateway", "The Opus (Cybercity)", "Hallmark 4drive", "Hallmark Affare", 
                "Sattva Image Tower", "Sattva Signature Tower", "RNK Capital Park by Jain’s", 
                "Jain’s Balaji Big Town", "RR Mall", "Makuta Prime", "Makuta Aruna Arcade", "Makuta Mall"
            ],
            "Villas": [
                "Casagrand Belair", "Casagrand Vyve", "Candeur Skyline", "Casagrand Sierra", 
                "Casagrand Crestwood", "Casagrand Monaco Villas", "Casagrand Windsor Court", 
                "Sage by Raghava", "Anvitha High 9 Villas", "Vertex Kingston Park", 
                "Makuta Green Woods", "Muppa Indraprastha", "Aero Villas", "Mayfair Sunrises", 
                "Srivari Meadows", "Vajras AAVAAS Sahita Villas", "CyberCity Villa Verde", 
                "Hallmark 5a", "Hallmark Floresta Plots"
            ],
            "Open Plot": [
                "Vertex by the Lake", "Elite Future County", "SGD EON City", "SGD Elite", 
                "Happy Homes", "Sri Sai Ram Enclave", "Riddhi Raghunath County"
            ],
            "Ready to Move": [
                "Brigade Citadale", "Rajpushpa Pristinia", "Rajpushpa Regalia", "Asbl Loft", 
                "Casagrand Evon", "Om shree Galaxy", "Om Shree Sky Park", "Om Shree Heights", 
                "Sage by Raghava", "Wave by Raghava", "Nova by Raghava", "Anvitha High 9", 
                "Sukhi Sree Sumera", "Drizzle", "Ozone Heights", "Anuhar Towers", "Aira", 
                "GHR Callisto", "Niharika Skyline", "Hallmark Vesta"
            ],
            "Off-Plan": [
                "Prestige Golden Groove", "Prestige City", "Godrej Madison Avenue", "Godrej Kukatpally", 
                "Brigade Gateway", "Brigade Enclave", "Brigade Manor", "Ramky One Odyssey", 
                "Ramky One Symphony", "Ramky One Astra", "Ramky one Genext", "Rajapushpa Provincia", 
                "Rajapushpa Imperia", "Rajapushpa Infina", "Rajapushpa Sierra", "Rajapushpa Atria", 
                "Rajapushpa Skyra", "Asbl landmark", "Asbl Legacy", "Asbl Broadway", "Asbl Spire", 
                "Lansum El palacio", "Lansum El dorado", "Lansum Encanto", "Candeur Crescent", 
                "Candeur Landscape", "Candeur Twin", "Candeur Eternia", "Casagrand Mandarin", 
                "Casagrand Gs Infinity", "CyberCity WestBrook", "CyberCity Stone Ridge", 
                "CyberCity Oriana", "CyberCity Shreeja Meadows", "CyberCity Rainbow Heights", 
                "HallMark Altus", "Hallmark Treasor", "Hallmark Skyrena", "Hallmark Sunnyside", 
                "Hallmark Pinnacle", "Hallmark Nature Nest", "Hallmark Oakshir", "Jain Central Park East", 
                "Jain Fairmount the ARC", "Jain’s Radhakrishna Bliss", "Jain Prmukh Samriddhi Towers", 
                "Jain Fairmount SriRam Garden 2", "EAPL Sri Tirumala Fortune", "EAPL Sri Tirumala Millennium", 
                "The Trilight Beyond Experience", "The Trilight Rise With 9", "CNIQ by Raghava", 
                "MSN One Realty", "Sukhi UBUNTU", "Anandha Homes Legacy", "Vertex Virat", 
                "Vertex West 33", "Gautami Heights", "CSR Ashvattha", "Ark kushak", "Ark Samyak", 
                "Ark Sky Edge", "Ark Florence", "Ark Ardha", "Ark Aryama", "Ark Bodhi", 
                "Rubrick Sriven Tripura", "Rubrick Tulip", "Makuta Horizon", "Makuta Nirvana", 
                "Makuta Taranga", "Makuta My Space 2", "Makuta My Space", "Nyla", "Arka", 
                "The Cascades Neopolis", "GHR Trivana", "GHR Titania", "Tridasa The Rise", 
                "A2A Homeland", "Saket Bhusatva – Veda", "Saket Bhusatva – Bhuvika", "Saket Pranamam", 
                "Qualitas Nestilo", "Qualitas Golden Enclave", "Riddhi Laxman County", 
                "Riddhi Pramukh Elegance", "Riddhi Taranto", "Riddhi orchid", "Riddhi Blooming Buds", 
                "AR Homes Rise", "Pranthi’s Kiara", "Pranthi’s Yuktha", "Vijay and Rvs Sai Vanamali Phase 2", 
                "Vibhuman", "Amaranthine", "Niharika Lakefront", "Niharika Landmark", 
                "The Vue Residences", "GreenSpace Marvel", "GreenSpace Celestial", "Bhavyas Evora", 
                "Vajra Nest", "Vajra the Royal Park"
            ]
        }

        zones_mapping = {
            "West Zone": [
                "Prestige Golden Groove", "Godrej Madison Avenue", "Brigade Gate", "Brigade Manor", 
                "Rajapushpa Provincia", "Rajapushpa Imperia", "Rajapushpa Pristinia", "Rajapushpa Infina", 
                "Rajapushpa Sierra", "Rajapushpa Atria", "Rajapushpa Skyra", "Rajapushpa Regalia", 
                "Asbl Loft", "Asbl Broadway", "Asbl Spire", "Lansum El palacio", "Lansum El dorado", 
                "Lansum Encanto", "Candeur Crescent", "Candeur Landscape", "Candeur Twin", 
                "Candeur Skyline", "Casagrand Evon", "Casagrand Vyve", "Casagrand Mandarin", 
                "Casagrand Gs Infinity", "CyberCity WestBrook", "CyberCity Stone Ridge", 
                "CyberCity Villa Verde", "CyberCity Oriana", "CyberCity Shreeja Meadows", 
                "CyberCity Rainbow Heights", "The Opus", "HallMark Altus", "Hallmark Treasor", 
                "Hallmark Skyrena", "Hallmark Sunnyside", "Hallmark Pinnacle", "Hallmark Nature Nest", 
                "Hallmark Floresta", "Hallmark Oakshir", "Hallmark 5a", "Hallmark 4drive", 
                "Hallmark affare", "Hallmark Vesta", "Sattva Lake Ridge", "Sattva Image Tower", 
                "Sattva Signature Tower", "The Trilight Beyond Experience", "The Trilight Rise With 9", 
                "CNIQ by Raghava", "Sage by Raghava", "Wave by Raghava", "Nova by Raghava", 
                "Anvitha Ivana", "Anvitha High 9", "MSN One Realty", "Sukhi UBUNTU", "Drizzle", 
                "Legacy", "Ozone Heights", "Vertex Virat", "Vertex West 33", "Vertex Kingston Park", 
                "Anuhar Towers", "Gautami Heights", "RR Mall", "Makuta Nirvana", "Makuta Aruna Arcade", 
                "GHR Callisto", "The Cascades Neopolis", "GHR Titania", "Tridasa The Rise", 
                "Srivari Meadows", "Qualitas Nestilo", "Qualitas Golden Enclave", "Riddhi Taranto", 
                "Riddhi Blooming Buds", "Riddhi Raghunath County", "AR Homes Rise", "Muppa Melody", 
                "Muppa Indraprastha", "Pranthi’s Kiara", "Pranthi’s Yuktha", "Vibhuman"
            ],
            "South Zone": [
                "Prestige City", "Godrej Regal Pavillon", "Casagrand Windsor Court", 
                "EAPL Sri Tirumala Fortune", "Vertex by the Lake", "Ark Florence", "Ark Ardha", 
                "Ark Aryama", "Rubrick Tulip", "Elite Future County", "SGD EON City", 
                "SGD Elite", "Happy Homes", "Riddhi Laxman County", "Riddhi orchid"
            ],
            "North Zone": [
                "Brigade Enclave", "Asbl landmark", "Asbl Legacy", "Candeur Eternia", 
                "Casagrand Belair", "Casagrand Crestwood", "Casagrand Monaco Villas", 
                "Jain Fairmount the ARC", "Jain’s Radhakrishna Bliss", "Jain Prmukh Samriddhi Towers", 
                "Jain Fairmount SriRam Garden 2", "Om shree Galaxy", "Om Shree Sky Park", 
                "Om Shree Heights", "Ark Samyak", "Ark Sky Edge", "Rubrick Sriven Tripura", 
                "Makuta Horizon", "Makuta Green Woods", "Makuta Taranga", "Makuta Prime", 
                "Makuta My Space 2", "Makuta My Space", "Makuta Mall", "Aira", "Nyla", "Arka", 
                "GHR Trivanan", "A2A Homeland", "Saket Bhusatva – Veda", "Saket Bhusatva – Bhuvika", 
                "Saket Pranamam", "Sri Sai Ram Enclave", "Riddhi Pramukh Elegance", 
                "Vijay and Rvs Sai Vanamali"
            ],
            "East Zone": [
                "Godrej Kukatpally", "Ramky One Odyssey", "Ramky One Symphony", "Ramky One Astra", 
                "Ramky one Genext", "Jain Central Park East", "RNK Capital Park by Jain’s", 
                "Jain’s Balaji Big Town", "EAPL Sri Tirumala Millennium", "Sukhi Sree Sumera", 
                "CSR Ashvattha", "Ark kushak", "Ark Bodhi"
            ],
            "Central Zone": [
                "Brigade Citadale"
            ]
        }

        # 5. Insert / Update Projects
        # Helper to get developer from name part
        def find_developer(name):
            # Try to match existing developers
            devs = db.query(models.DeveloperProfileModel).all()
            for d in devs:
                if d.name.lower() in name.lower():
                    return d
            return None

        all_project_names = set()
        for cat_list in data.values():
            for p in cat_list: all_project_names.add(p)
        for zone_list in zones_mapping.values():
            for p in zone_list: all_project_names.add(p)

        print(f"Total unique projects found: {len(all_project_names)}")

        for p_name in all_project_names:
            p_slug = slugify(p_name)
            project = db.query(models.ProjectModel).filter(models.ProjectModel.name == p_name).first()
            if not project:
                project = db.query(models.ProjectModel).filter(models.ProjectModel.slug == p_slug).first()
            
            if not project:
                # Create skeleton project
                dev = find_developer(p_name)
                # If no developer found, use a default or handle
                if not dev:
                    # Maybe it's a known developer like Sattva, Casagrand etc.
                    known_devs = {
                        "Brigade": "Brigade Group",
                        "Sattva": "Sattva Group",
                        "Hallmark": "Hallmark Builders",
                        "Casagrand": "Casagrand",
                        "Vertex": "Vertex",
                        "Rajpushpa": "Rajapushpa Properties",
                        "Rajapushpa": "Rajapushpa Properties",
                        "Asbl": "ASBL",
                        "Prestige": "Prestige Group",
                        "Godrej": "Godrej Properties",
                        "Ramky": "Ramky",
                        "Lansum": "Lansum Properties",
                        "Candeur": "Candeur Developers",
                        "CyberCity": "Cybercity Builders",
                        "Jain": "Jain Constructions",
                        "EAPL": "EAPL",
                        "Trilight": "Trilight Developers",
                        "Om Sree": "Om Sree",
                        "Raghava": "Raghava Projects",
                        "Anvitha": "Anvita",
                        "MSN": "MSN Realty",
                        "Sukhi": "Sukhi",
                        "Ark": "Ark",
                        "Makuta": "Makuta",
                        "GHR": "GHR",
                        "Saket": "Saket",
                        "Riddhi": "Riddhi",
                        "Qualitas": "Qualitas",
                        "Rubrick": "Rubrick"
                    }
                    dev_name = "Independent"
                    for k, v in known_devs.items():
                        if k.lower() in p_name.lower():
                            dev_name = v
                            break
                    
                    dev = db.query(models.DeveloperProfileModel).filter(models.DeveloperProfileModel.name == dev_name).first()
                    if not dev:
                        dev = models.DeveloperProfileModel(name=dev_name, slug=slugify(dev_name), about="Strategic developer partner.")
                        db.add(dev)
                        db.commit()
                        db.refresh(dev)

                project = models.ProjectModel(
                    name=p_name,
                    slug=p_slug,
                    developer_id=dev.id,
                    location="Hyderabad",
                    project_type="Residential",
                    status="Active"
                )
                db.add(project)
                db.commit()
                db.refresh(project)

            # Link Categories
            project.categories = [] # Clear if updating, or just append
            for cat_name, p_list in data.items():
                if p_name in p_list:
                    project.categories.append(cats[cat_name])

            # Link Zones
            project.zones = []
            for zone_name, p_list in zones_mapping.items():
                if p_name in p_list:
                    project.zones.append(zones[zone_name])
            
            db.commit()

        print("Seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories_and_zones()
