import re
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from seed_raw_data import RAW_PROJECT_LIST

# Mapping of keywords to developer names
DEV_MAPPING = {
    "Prestige": "Prestige Group",
    "Godrej": "Godrej Properties",
    "Brigade": "Brigade Group",
    "Ramky": "Ramky",
    "Rajapushpa": "Rajapushpa Properties",
    "Rajpushpa": "Rajapushpa Properties",
    "ASBL": "ASBL",
    "Lansum": "Lansum Properties",
    "Candeur": "Candeur Developers",
    "Casagrand": "Casagrand",
    "Cybercity": "Cybercity Builders",
    "Hallmark": "Hallmark Builders",
    "Sattva": "Sattva Group",
    "Jain": "Jain Constructions",
    "EAPL": "EAPL",
    "Trilight": "Trilight Developers",
    "Om Shree": "Om Sree",
    "Om shree": "Om Sree",
    "Raghava": "Raghava Projects",
    "Anvitha": "Anvita",
    "MSN": "MSN Realty",
    "Sukhi": "Sukhi",
    "Anandha": "Anandha Homes",
    "Vertex": "Vertex",
    "Anuhar": "Anuhar Homes",
    "Makuta": "Makuta",
    "Muppa": "Muppa",
    "Vajra": "Vajra",
    "GHR": "GHR",
    "Ark ": "Ark",
    "Rubrick": "Rubrick",
    "Saket": "Saket",
    "Qualitas": "Qualitas",
    "Riddhi": "Riddhi",
    "CSR": "CSR",
    "A2A": "A2A",
    "Gautami": "Gautami",
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def parse_data(raw_text):
    sections = {}
    current_section = None
    
    lines = raw_text.split('\n')
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Check if it's a section header (e.g., "Commericals", "West Zone")
        if re.match(r'^[A-Za-z\s–\-]+$', line) and not re.match(r'^\d+[\)\.]', line):
            current_section = line.replace('Off – Plan', 'Off-Plan').strip()
            if current_section not in sections:
                sections[current_section] = []
        elif current_section and re.match(r'^\d+[\)\.]', line):
            # It's a project line like "1) Brigade Gateway"
            project_name = re.sub(r'^\d+[\)\.]\s*', '', line).strip()
            # Clean up suffixes like "(Commercial)"
            project_name = re.sub(r'\s*\(.*?\)', '', project_name).strip()
            if project_name not in sections[current_section]:
                sections[current_section].append(project_name)
                
    return sections

def seed_bulk():
    db = SessionLocal()
    parsed = parse_data(RAW_PROJECT_LIST)
    
    # Track projects to avoid duplicates
    all_projects = {} # name -> data dict
    
    # Categories and Zones keys
    categories_list = ["Commericals", "Villas", "Plots", "Ready to Move", "Off-Plan"]
    zones_list = ["West Zone", "South Zone", "North Zone", "East Zone", "Central Zone"]
    
    for section_name, projects in parsed.items():
        category = section_name if section_name in categories_list else None
        zone = section_name.replace(" Zone", "") if section_name in zones_list else None
        
        for p_name in projects:
            if p_name not in all_projects:
                # Infer developer
                developer_name = "Other"
                for key, full_name in DEV_MAPPING.items():
                    if key.lower() in p_name.lower():
                        developer_name = full_name
                        break
                
                all_projects[p_name] = {
                    "name": p_name,
                    "developer": developer_name,
                    "category": category,
                    "zone": zone,
                    "status": "Active"
                }
            else:
                # Update existing project with category/zone if found in this section
                if category: all_projects[p_name]["category"] = category
                if zone: all_projects[p_name]["zone"] = zone
                
    # Normalize categories
    for p_name, data in all_projects.items():
        if data["category"] == "Commericals": data["category"] = "Commercial"
        if not data["category"]: data["category"] = "Apartment" # Default
        
        # Ensure developer exists
        dev_name = data["developer"]
        dev = db.query(models.DeveloperProfileModel).filter(models.DeveloperProfileModel.name == dev_name).first()
        if not dev:
            # Create a basic developer profile if missing
            dev = models.DeveloperProfileModel(
                name=dev_name,
                slug=slugify(dev_name),
                about=f"{dev_name} is a leading real estate developer in Hyderabad.",
                total_projects=0
            )
            db.add(dev)
            db.commit()
            db.refresh(dev)
            
        # Check if project already exists in DB
        existing_p = db.query(models.ProjectModel).filter(models.ProjectModel.name == p_name).first()
        if not existing_p:
            p_slug = slugify(p_name)
            # Handle slug collisions
            count = 1
            original_slug = p_slug
            while db.query(models.ProjectModel).filter(models.ProjectModel.slug == p_slug).first():
                p_slug = f"{original_slug}-{count}"
                count += 1
                
            project = models.ProjectModel(
                developer_id=dev.id,
                name=p_name,
                slug=p_slug,
                location="Hyderabad",
                project_type=data["category"],
                status=data.get("status", "Active"),
                zone=data.get("zone"),
                category=data.get("category"),
                description=f"Premium real estate project {p_name} in {data.get('zone', 'Hyderabad')} zone.",
                price_range="Price on Request",
                possession="TBA"
            )
            db.add(project)
            db.commit()
            db.refresh(project)
            
            # Add a placeholder image from a variety of options
            import random
            PROJECT_IMAGES = [
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800"
            ]
            img = models.ProjectImageModel(
                project_id=project.id,
                image_url=random.choice(PROJECT_IMAGES),
                is_primary=True,
                sort_order=0
            )
            db.add(img)
            
            # Increment dev project count
            dev.total_projects += 1
            db.commit()
        else:
            # Update existing project with zone and category
            existing_p.zone = data.get("zone") or existing_p.zone
            existing_p.category = data.get("category") or existing_p.category
            if not existing_p.project_type:
                existing_p.project_type = data.get("category")
            db.commit()
            
    print(f"Seeded {len(all_projects)} projects successfully.")
    db.close()

if __name__ == "__main__":
    seed_bulk()
