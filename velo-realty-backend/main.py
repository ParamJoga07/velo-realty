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
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
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
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    "description": "Modern sky-villas at the peak of Hyderabad architecture.",
  },
]

DEVELOPERS = [
  { "name": "Prestige Group", "projects": 43, "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" },
  { "name": "Godrej Properties", "projects": 31, "image": "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=800" },
  { "name": "Brigade Group", "projects": 28, "image": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800" },
  { "name": "Ramky", "projects": 26, "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
  { "name": "Rajapushpa Properties", "projects": 18, "image": "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800" },
  { "name": "ASBL", "projects": 14, "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800" },
  { "name": "Lansum Properties", "projects": 6, "image": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" },
  { "name": "Candeur Developers", "projects": 11, "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" },
  { "name": "Casagrand", "projects": 22, "image": "https://images.unsplash.com/photo-1462826303086-329426d1aef5?auto=format&fit=crop&q=80&w=800" },
  { "name": "Cybercity Builders", "projects": 17, "image": "https://images.unsplash.com/photo-1448630360428-65456659e864?auto=format&fit=crop&q=80&w=800" },
  { "name": "Hallmark Builders", "projects": 10, "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
  { "name": "Sattva Group", "projects": 15, "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800" },
  { "name": "Jain Constructions", "projects": 13, "image": "https://images.unsplash.com/photo-1600566753086-00f18f6b8e5d?auto=format&fit=crop&q=80&w=800" },
  { "name": "EAPL", "projects": 4, "image": "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80&w=800" },
  { "name": "Trilight Developers", "projects": 5, "image": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800" },
  { "name": "Om Sree", "projects": 9, "image": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800" },
  { "name": "Raghava Projects", "projects": 12, "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
  { "name": "Anvita", "projects": 7, "image": "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=800" },
  { "name": "MSN Realty", "projects": 8, "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" },
  { "name": "Sukhi", "projects": 6, "image": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800" },
  { "name": "Anandha Homes", "projects": 12, "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800" },
  { "name": "Vertex", "projects": 20, "image": "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=800" },
  { "name": "Anuhar Homes", "projects": 9, "image": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800" },
]

COMMUNITIES = [
  { "name": "North Corridor", "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200" },
  { "name": "South Corridor", "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200" },
  { "name": "East Corridor", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" },
  { "name": "West Corridor", "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" },
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
  "Prestige Group", "Godrej Properties", "Brigade Group", "Ramky", "Rajapushpa Properties",
  "ASBL", "Lansum Properties", "Candeur Developers", "Casagrand", "Cybercity Builders",
  "Hallmark Builders", "Sattva Group", "Jain Constructions", "EAPL", "Trilight Developers",
  "Om Sree", "Raghava Projects", "Anvita", "MSN Realty", "Sukhi", "Anandha Homes",
  "Vertex", "Anuhar Homes"
]

STATS = [
  { "value": "₹4.2k+", "label": "Cr Properties Managed" },
  { "value": "250+", "label": "Transactions Closed" },
  { "value": "15+", "label": "Strategic Corridors" },
  { "value": "100%", "label": "Capital Protection" },
]

AREA_RATES = [
  { "area": "Tellapur", "price": "₹8,250", "cagr": "13.6%" },
  { "area": "Manikonda", "price": "₹7,325", "cagr": "11%" },
  { "area": "Tukkuguda and Adibatla", "price": "₹6,800", "cagr": "8.7%" },
  { "area": "Neopolis (Kokapet)", "price": "₹13,500", "cagr": "18%" },
  { "area": "Rajendranagar & Budvel", "price": "₹10,200", "cagr": "12%" },
  { "area": "Shamirpet & Medchal", "price": "₹6,500", "cagr": "10%" },
  { "area": "Kolluru", "price": "₹6,700", "cagr": "10.8%" },
  { "area": "Patanchervu", "price": "₹5,400", "cagr": "7.4%" },
  { "area": "Nallagandla", "price": "₹9,500", "cagr": "11% - 13%" },
  { "area": "Shadnagar", "price": "₹3,400", "cagr": "8% - 10%" },
  { "area": "Kokapet", "price": "₹11,800", "cagr": "18% - 20%" },
  { "area": "Kondapur", "price": "₹10,000", "cagr": "10% - 12%" },
  { "area": "Uppal", "price": "₹6,750", "cagr": "9% - 11%" },
  { "area": "Pocharam", "price": "₹5,800", "cagr": "8% - 10%" },
  { "area": "Narsingi", "price": "₹8,699", "cagr": "14% - 16%" },
  { "area": "Gachibowli", "price": "₹11,200", "cagr": "15.6%" },
  { "area": "Ameenpur", "price": "₹6,289", "cagr": "11.2%" },
  { "area": "Osman Sagar", "price": "₹7,500", "cagr": "8%" },
  { "area": "Kukatpally", "price": "₹8,000", "cagr": "7%" },
  { "area": "Bachupally", "price": "₹7,000", "cagr": "5%" },
  { "area": "Miyapur", "price": "₹7,000", "cagr": "6% - 8.5%" },
  { "area": "Chandanagar", "price": "₹7,500", "cagr": "5% - 7%" },
  { "area": "Financial District", "price": "₹10,350", "cagr": "18.1%" },
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
    # Return developer profiles mapped to the legacy Developer structure
    devs = db.query(models.DeveloperProfileModel).all()
    # High-quality real estate placeholders for the main grid
    placeholders = [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800"
    ]
    result = []
    for i, d in enumerate(devs):
        result.append({
            "name": d.name,
            "projects": d.total_projects,
            "image": placeholders[i % len(placeholders)]
        })
    return result

@app.get("/api/communities")
def get_communities(db: Session = Depends(get_db)):
    return db.query(models.CommunityModel).all()

@app.get("/api/guides")
def get_guides(db: Session = Depends(get_db)):
    return db.query(models.GuideModel).all()

@app.get("/api/partners")
def get_partners(db: Session = Depends(get_db)):
    devs = db.query(models.DeveloperProfileModel).all()
    return [d.name for d in devs]

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

@app.get("/api/developer-profiles/{dev_id}")
def get_developer_profile_by_id(dev_id: int, db: Session = Depends(get_db)):
    """Get a single developer profile by ID with all projects"""
    dev = db.query(models.DeveloperProfileModel).filter(
        models.DeveloperProfileModel.id == dev_id
    ).first()
    if not dev:
        return {"error": "Developer not found", "id": dev_id}
    
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

@app.get("/api/developer-profiles/slug/{slug}")
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
