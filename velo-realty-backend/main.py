from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from database import get_db
import models

app = FastAPI(title="Velo Realty API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data ---

PROPERTIES = [
  {
    "id": 1,
    "title": "The Skyline Residency",
    "location": "Financial District",
    "community": "West Corridor",
    "developer": "Raghava",
    "type": "Apartment",
    "listingType": "Off-Plan",
    "price": "₹2.1 Cr",
    "priceValue": 21000000,
    "beds": 3,
    "baths": 3,
    "area": 1180,
    "handover": "Q4 2027",
    "status": "Featured",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG",
    "description": "A luxurious apartment offering panoramic views of the Financial District skyline.",
  },
  {
    "id": 2,
    "title": "Palm Crest Villas",
    "location": "Kokapet",
    "community": "West Corridor",
    "developer": "Prestige",
    "type": "Villa",
    "listingType": "Ready",
    "price": "₹8.9 Cr",
    "priceValue": 89000000,
    "beds": 4,
    "baths": 5,
    "area": 5300,
    "handover": "Ready",
    "status": "Featured",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg",
    "description": "An exclusive villa situated in the premium Kokapet area.",
  },
  {
    "id": 3,
    "title": "Harbor Point Commercial",
    "location": "Uppal",
    "community": "East Corridor",
    "developer": "ASBL",
    "type": "Commercial Space",
    "listingType": "Pre-Launch",
    "price": "₹95 Lakhs",
    "priceValue": 9500000,
    "beds": 0,
    "baths": 2,
    "area": 760,
    "handover": "Q2 2028",
    "status": "New Launch",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg",
    "description": "A modern, high-yield commercial investment property.",
  },
  {
    "id": 4,
    "title": "Serene Plots",
    "location": "Shadnagar",
    "community": "South Corridor",
    "developer": "Ramky",
    "type": "Plot or Land",
    "listingType": "Ready",
    "price": "₹28 Lakhs",
    "priceValue": 2800000,
    "beds": 0,
    "baths": 0,
    "area": 2450,
    "handover": "Ready",
    "status": "Featured",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg",
    "description": "A beautifully developed plot in the green corridors.",
  },
  {
    "id": 5,
    "title": "The Hallmark Sky",
    "location": "Tellapur",
    "community": "West Corridor",
    "developer": "Hallmark",
    "type": "Apartment",
    "listingType": "Pre-Launch",
    "price": "₹1.15 Cr",
    "priceValue": 11500000,
    "beds": 3,
    "baths": 3,
    "area": 1850,
    "handover": "Q3 2028",
    "status": "New Launch",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shanghai_skyline_from_the_bund.jpg/800px-Shanghai_skyline_from_the_bund.jpg",
    "description": "Modern high-rise living with sustainable design features.",
  },
  {
    "id": 6,
    "title": "Casagrand Cloud 9",
    "location": "Narsingi",
    "community": "West Corridor",
    "developer": "Casagrand",
    "type": "Apartment",
    "listingType": "Off-Plan",
    "price": "₹1.8 Cr",
    "priceValue": 18000000,
    "beds": 3,
    "baths": 3,
    "area": 2100,
    "handover": "Q1 2027",
    "status": "Featured",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Singapore_skyline_from_Marina_Bay.jpg/800px-Singapore_skyline_from_Marina_Bay.jpg",
    "description": "Ultra-luxury sky homes with infinite city views.",
  },
  {
    "id": 7,
    "title": "Godrej Woodside",
    "location": "Kolluru",
    "community": "West Corridor",
    "developer": "Godrej",
    "type": "Villa",
    "listingType": "Pre-Launch",
    "price": "₹4.5 Cr",
    "priceValue": 45000000,
    "beds": 4,
    "baths": 4,
    "area": 3200,
    "handover": "Q4 2029",
    "status": "New Launch",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG",
    "description": "Bespoke garden villas nestled in nature.",
  },
  {
    "id": 8,
    "title": "Cybercity Marina",
    "location": "Kukatpally",
    "community": "West Corridor",
    "developer": "Cybercity",
    "type": "Apartment",
    "listingType": "Ready",
    "price": "₹1.65 Cr",
    "priceValue": 16500000,
    "beds": 3,
    "baths": 3,
    "area": 1950,
    "handover": "Ready",
    "status": "Ready",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg",
    "description": "Premium ready-to-move-in apartments in a vibrant community.",
  },
  {
    "id": 9,
    "title": "Lansum Oxygen",
    "location": "Nallagandla",
    "community": "West Corridor",
    "developer": "Lansum",
    "type": "Apartment",
    "listingType": "Off-Plan",
    "price": "₹1.25 Cr",
    "priceValue": 12500000,
    "beds": 2,
    "baths": 2,
    "area": 1450,
    "handover": "Q2 2027",
    "status": "Featured",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg",
    "description": "Eco-conscious living spaces with smart home integration.",
  },
  {
    "id": 10,
    "title": "Trilight Horizon",
    "location": "Kokapet",
    "community": "West Corridor",
    "developer": "Trilight",
    "type": "Apartment",
    "listingType": "Pre-Launch",
    "price": "₹2.4 Cr",
    "priceValue": 24000000,
    "beds": 3,
    "baths": 3,
    "area": 2800,
    "handover": "Q1 2029",
    "status": "New Launch",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg",
    "description": "Modern sky-villas at the peak of Hyderabad architecture.",
  },
]

DEVELOPERS = [
  { "name": "Raghava", "projects": 12, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG" },
  { "name": "MSN", "projects": 8, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg" },
  { "name": "Sattava", "projects": 15, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg" },
  { "name": "Trilight", "projects": 5, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg" },
  { "name": "Casagrand", "projects": 22, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shanghai_skyline_from_the_bund.jpg/800px-Shanghai_skyline_from_the_bund.jpg" },
  { "name": "Hallmark", "projects": 10, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Singapore_skyline_from_Marina_Bay.jpg/800px-Singapore_skyline_from_Marina_Bay.jpg" },
  { "name": "Godrej", "projects": 31, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG" },
  { "name": "Anvitha", "projects": 7, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg" },
  { "name": "Om Shree", "projects": 9, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg" },
  { "name": "Rajapushpa", "projects": 18, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg" },
  { "name": "Candeur", "projects": 11, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shanghai_skyline_from_the_bund.jpg/800px-Shanghai_skyline_from_the_bund.jpg" },
  { "name": "ASBL", "projects": 14, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Singapore_skyline_from_Marina_Bay.jpg/800px-Singapore_skyline_from_Marina_Bay.jpg" },
  { "name": "Ramky", "projects": 26, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG" },
  { "name": "Jain Developers", "projects": 13, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg" },
  { "name": "Lansum", "projects": 6, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg" },
  { "name": "Cybercity", "projects": 17, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg" },
  { "name": "Brigade", "projects": 28, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Shanghai_skyline_from_the_bund.jpg/800px-Shanghai_skyline_from_the_bund.jpg" },
  { "name": "Prestige", "projects": 43, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Singapore_skyline_from_Marina_Bay.jpg/800px-Singapore_skyline_from_Marina_Bay.jpg" },
  { "name": "EAPL", "projects": 4, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG" },
  { "name": "Life 4 Spaces", "projects": 3, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg" },
  { "name": "Tridasa", "projects": 5, "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg" },
]

COMMUNITIES = [
  { "name": "North Corridor", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tokyo_Sky_Tree_2012.JPG/800px-Tokyo_Sky_Tree_2012.JPG" },
  { "name": "South Corridor", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg" },
  { "name": "East Corridor", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/One_World_Trade_Center_from_base.jpg/800px-One_World_Trade_Center_from_base.jpg" },
  { "name": "West Corridor", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg/800px-A_View_of_Downtown_Dubai_and_Burj_Khalifa.jpg" },
]

GUIDES = [
  {
    "title": "Investment yields in Financial District",
    "description": "Breakdown of rental growth and capital appreciation in West Hyderabad.",
  },
  {
    "title": "Top pre-launches in Kokapet Neopolis",
    "description": "Upcoming high-rise projects with detailed handover timelines.",
  },
  {
    "title": "Off-plan vs Ready property strategy",
    "description": "Which model fits your capital horizon and risk tolerance in today's market.",
  },
]

PARTNERS = [
  "Raghava", "MSN", "Sattava", "Trilight", "Casagrand", "Hallmark",
  "Godrej", "Anvitha", "Om Shree", "Rajapushpa", "Candeur", "ASBL",
  "Ramky", "Jain Developers", "Lansum", "Cybercity", "Brigade",
  "Prestige", "EAPL", "Life 4 Spaces", "Tridasa"
]

STATS = [
  { "value": "₹4.2k+", "label": "Cr Properties Managed" },
  { "value": "250+", "label": "Transactions Closed" },
  { "value": "15+", "label": "Strategic Corridors" },
  { "value": "100%", "label": "Capital Protection" },
]

AREA_RATES = [
  { "area": "Neopolis", "cagr": "18%", "price": "₹12,500" },
  { "area": "Financial District", "cagr": "15%", "price": "₹10,500" },
  { "area": "Tellapur", "cagr": "22%", "price": "₹8,500" },
  { "area": "Kokapet", "cagr": "16%", "price": "₹11,000" },
  { "area": "Narsingi", "cagr": "14%", "price": "₹9,500" },
  { "area": "Kollur", "cagr": "25%", "price": "₹6,500" },
]

TEAM_MEMBERS = [
  {
    "name": "Vikram Reddy",
    "role": "Founder & CEO",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxm4x8UVMEnLMBDlTCN2iFVCgLgJSQ6kjU6A&s",
    "bio": "Visionary leader with 15+ years in Hyderabad real estate.",
  },
  {
    "name": "Ananya Sharma",
    "role": "Head of Growth Corridors",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgTetWRyvPAWDHtX-MCel3C3oVx4WfCozCGb8HLq1h&s",
    "bio": "Expert in local luxury investments and portfolio growth across Hyderabad.",
  },
  {
    "name": "Siddharth Rao",
    "role": "Chief Investment Officer",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeXSvNvTy7Zowoep7o-MPuZVScrlVoZJQkwg&s",
    "bio": "Data-driven strategist specializing in growth corridor analysis.",
  },
  {
    "name": "Priya Kapoor",
    "role": "Director of Client Relations",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS2M7ysn8HgsZcigyJhvNGAdAGB6c62NNV6g&s",
    "bio": "Ensuring seamless transaction velocity for global investors.",
  },
]

# --- API Endpoints ---

@app.get("/")
def root():
    return {"message": "Velo Realty Backend API is running."}

@app.get("/api/properties")
def get_properties(db: Session = Depends(get_db)):
    return db.query(models.PropertyModel).all()

@app.get("/api/developers")
def get_developers(db: Session = Depends(get_db)):
    return db.query(models.DeveloperModel).all()

@app.get("/api/communities")
def get_communities(db: Session = Depends(get_db)):
    return db.query(models.CommunityModel).all()

@app.get("/api/guides")
def get_guides(db: Session = Depends(get_db)):
    return db.query(models.GuideModel).all()

@app.get("/api/partners")
def get_partners(db: Session = Depends(get_db)):
    partners = db.query(models.PartnerModel).all()
    return [p.name for p in partners]

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    return db.query(models.StatModel).all()

@app.get("/api/area-rates")
def get_area_rates(db: Session = Depends(get_db)):
    return db.query(models.AreaRateModel).all()

@app.get("/api/team")
def get_team_members(db: Session = Depends(get_db)):
    return db.query(models.TeamMemberModel).all()

# --- NEW: Developer Profile & Project Endpoints ---

@app.get("/api/developer-profiles/search")
def search_developer_profile(name: str, db: Session = Depends(get_db)):
    """Search developer by name (partial match) and return profile with projects"""
    # Try exact match first, then partial match (ILIKE)
    dev = db.query(models.DeveloperProfileModel).filter(
        models.DeveloperProfileModel.name == name
    ).first()
    if not dev:
        dev = db.query(models.DeveloperProfileModel).filter(
            models.DeveloperProfileModel.name.ilike(f"%{name}%")
        ).first()
    if not dev:
        return {"error": "Developer not found", "name": name}
    
    projects = []
    for p in dev.project_list:
        primary_img = None
        for img in p.images:
            if img.is_primary:
                primary_img = img.image_url
                break
        projects.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "location": p.location,
            "sub_location": p.sub_location,
            "project_type": p.project_type,
            "land_area": p.land_area,
            "total_units": p.total_units,
            "configurations": p.configurations,
            "size_range": p.size_range,
            "price_range": p.price_range,
            "possession": p.possession,
            "status": p.status,
            "highlights": p.highlights,
            "primary_image": primary_img,
        })
    
    return {
        "id": dev.id,
        "name": dev.name,
        "slug": dev.slug,
        "about": dev.about,
        "founded_year": dev.founded_year,
        "headquarters": dev.headquarters,
        "logo_url": dev.logo_url,
        "total_projects": dev.total_projects,
        "projects": projects,
    }

@app.get("/api/developer-profiles")
def get_developer_profiles(db: Session = Depends(get_db)):
    """Get all developer profiles with project count"""
    devs = db.query(models.DeveloperProfileModel).all()
    result = []
    for d in devs:
        primary_images = {}
        for p in d.project_list:
            for img in p.images:
                if img.is_primary:
                    primary_images[p.id] = img.image_url
                    break
        result.append({
            "id": d.id,
            "name": d.name,
            "slug": d.slug,
            "about": d.about,
            "founded_year": d.founded_year,
            "headquarters": d.headquarters,
            "logo_url": d.logo_url,
            "total_projects": d.total_projects,
            "projects": [{
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "location": p.location,
                "project_type": p.project_type,
                "price_range": p.price_range,
                "status": p.status,
                "configurations": p.configurations,
                "primary_image": primary_images.get(p.id),
            } for p in d.project_list]
        })
    return result

@app.get("/api/developer-profiles/{slug}")
def get_developer_profile(slug: str, db: Session = Depends(get_db)):
    """Get a single developer profile with all projects"""
    dev = db.query(models.DeveloperProfileModel).filter(
        models.DeveloperProfileModel.slug == slug
    ).first()
    if not dev:
        return {"error": "Developer not found"}
    
    projects = []
    for p in dev.project_list:
        primary_img = None
        for img in p.images:
            if img.is_primary:
                primary_img = img.image_url
                break
        projects.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "location": p.location,
            "sub_location": p.sub_location,
            "project_type": p.project_type,
            "land_area": p.land_area,
            "total_units": p.total_units,
            "configurations": p.configurations,
            "size_range": p.size_range,
            "price_range": p.price_range,
            "possession": p.possession,
            "status": p.status,
            "highlights": p.highlights,
            "primary_image": primary_img,
        })
    
    return {
        "id": dev.id,
        "name": dev.name,
        "slug": dev.slug,
        "about": dev.about,
        "founded_year": dev.founded_year,
        "headquarters": dev.headquarters,
        "logo_url": dev.logo_url,
        "total_projects": dev.total_projects,
        "projects": projects,
    }

@app.get("/api/projects/{slug}")
def get_project_detail(slug: str, db: Session = Depends(get_db)):
    """Get full project details with all images"""
    project = db.query(models.ProjectModel).filter(
        models.ProjectModel.slug == slug
    ).first()
    if not project:
        return {"error": "Project not found"}
    
    return {
        "id": project.id,
        "name": project.name,
        "slug": project.slug,
        "developer_name": project.developer.name if project.developer else None,
        "developer_slug": project.developer.slug if project.developer else None,
        "location": project.location,
        "sub_location": project.sub_location,
        "project_type": project.project_type,
        "land_area": project.land_area,
        "structure": project.structure,
        "total_units": project.total_units,
        "configurations": project.configurations,
        "size_range": project.size_range,
        "price_range": project.price_range,
        "open_space": project.open_space,
        "possession": project.possession,
        "status": project.status,
        "clubhouse_size": project.clubhouse_size,
        "description": project.description,
        "highlights": project.highlights,
        "connectivity": project.connectivity,
        "images": [{
            "id": img.id,
            "image_url": img.image_url,
            "caption": img.caption,
            "is_primary": img.is_primary,
        } for img in project.images],
    }
