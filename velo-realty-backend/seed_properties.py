
import os
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

PROPERTIES = [
  {
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

def seed_properties():
    db = SessionLocal()
    try:
        # Create tables if not exist (updates schema)
        models.Base.metadata.create_all(bind=engine)
        
        # Clear existing properties to avoid duplicates during seeding
        db.query(models.PropertyModel).delete()
        
        for p in PROPERTIES:
            # 1. Find Developer
            dev_name = p["developer"]
            dev = db.query(models.DeveloperProfileModel).filter(
                models.DeveloperProfileModel.name.ilike(f"%{dev_name}%")
            ).first()
            
            # 2. Find Corridor
            corr_name = p["community"]
            corr = db.query(models.CorridorModel).filter(
                models.CorridorModel.name.ilike(f"%{corr_name}%")
            ).first()
            
            # 3. Create Property
            p_data = p.copy()
            if "community" in p_data: del p_data["community"]
            if "developer" in p_data: del p_data["developer"]
            
            db_prop = models.PropertyModel(**p_data)
            if dev: 
                db_prop.developer_id = dev.id
                db_prop.developer = dev.name # Store name for compat
            else:
                db_prop.developer = p["developer"]

            if corr: 
                db_prop.corridor_id = corr.id
                db_prop.community = corr.name # Store name for compat
            else:
                db_prop.community = p["community"]
            
            db.add(db_prop)
        
        db.commit()
        print(f"Successfully seeded {len(PROPERTIES)} properties!")
    except Exception as e:
        print(f"Error seeding properties: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_properties()
