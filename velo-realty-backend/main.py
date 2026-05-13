from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from database import get_db, engine
import models
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from imagekitio import ImageKit
import uuid

# Initialize DB Tables
models.Base.metadata.create_all(bind=engine)

# Auth Settings
SECRET_KEY = "velo-realty-super-secret-key-change-in-prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login")

# ImageKit Configuration (Replace with your actual keys)
# The user can update these in their .env or directly here
imagekit = ImageKit(
    public_key='public_p+Zs79z/CFpE8ecWc4QWKDNcWqE=',
    private_key='private_HJwTJ2e+s9gJiMUk8uI59XqieYI=',
    url_endpoint='https://ik.imagekit.io/zpj7zrcs73'
)

# Pydantic Models for Admin & CRUD
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PropertyCreate(BaseModel):
    title: str
    location: str
    community: str
    developer: Optional[str] = None
    type: str
    listingType: str
    price: str
    priceValue: float
    beds: int
    baths: int
    area: float
    handover: str
    status: str
    image: str
    description: str
    developer_id: Optional[int] = None
    corridor_id: Optional[int] = None
    gallery: Optional[List[str]] = []

class ProjectCreate(BaseModel):
    developer_id: int
    corridor_id: Optional[int] = None
    name: str
    slug: str
    location: str
    sub_location: Optional[str] = None
    project_type: str
    land_area: Optional[str] = None
    structure: Optional[str] = None
    total_units: Optional[str] = None
    configurations: Optional[str] = None
    size_range: Optional[str] = None
    price_range: Optional[str] = None
    price_start: Optional[float] = None
    open_space: Optional[str] = None
    possession: Optional[str] = None
    status: Optional[str] = None
    clubhouse_size: Optional[str] = None
    amenities: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[str] = None
    connectivity: Optional[str] = None
    images: Optional[List[str]] = []

class CorridorCreate(BaseModel):
    name: str
    slug: str
    location: str
    description: str
    image: str

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image: str
    bio: str

class ContactRequestCreate(BaseModel):
    name: str
    email: str
    phone: str
    property_id: Optional[int] = None
    message: str

class DeveloperCreate(BaseModel):
    name: str
    slug: str
    about: str
    founded_year: Optional[int] = None
    headquarters: Optional[str] = None
    logo_url: Optional[str] = None
    project_count: int = 0

class AreaRateCreate(BaseModel):
    area: str
    price: str
    cagr: str

class ReferralCreate(BaseModel):
    referrer_name: str
    referrer_email: str
    friend_name: str
    friend_contact: str
    investment_intent: Optional[str] = None

class UserIdentityCreate(BaseModel):
    name: str
    email: str
    phone: str

class PropertySaveRequest(BaseModel):
    user_email: str
    property_id: int

app = FastAPI(title="Velo Realty API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/")
def root():
    return {"message": "Velo Realty Backend API is running."}

@app.get("/api/properties")
def get_properties(db: Session = Depends(get_db)):
    return db.query(models.PropertyModel).order_by(models.PropertyModel.id.asc()).all()

@app.get("/api/developers")
def get_developers(page: int = 1, limit: int = 20, db: Session = Depends(get_db)):
    # Calculate offset
    offset = (page - 1) * limit
    
    # Return developer profiles mapped to the legacy Developer structure
    # We remove joinedload here to speed up the main grid view
    devs = db.query(models.DeveloperProfileModel)\
             .order_by(models.DeveloperProfileModel.id.asc())\
             .offset(offset).limit(limit).all()
             
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
            "id": d.id,
            "name": d.name,
            "slug": d.slug,
            "about": d.about,
            "founded_year": d.founded_year,
            "headquarters": d.headquarters,
            "logo_url": d.logo_url,
            "project_count": d.project_count,
            "image": d.logo_url or placeholders[i % len(placeholders)],
            # Note: project_items is now empty in the list view for speed. 
            # The DeveloperModal will fetch details separately.
            "project_items": [] 
        })
    return result

@app.get("/api/corridors")
def get_corridors(db: Session = Depends(get_db)):
    corridors = db.query(models.CorridorModel)\
                  .options(joinedload(models.CorridorModel.property_list))\
                  .order_by(models.CorridorModel.id.asc()).all()
    result = []
    for c in corridors:
        result.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "location": c.location,
            "description": c.description,
            "image": c.image,
            "properties": [{
                "id": p.id,
                "title": p.title,
                "location": p.location,
                "price": p.price,
                "image": p.image
            } for p in c.property_list]
        })
    return result

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
    return db.query(models.AreaRateModel).order_by(models.AreaRateModel.id.asc()).all()

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.CategoryModel).all()

@app.get("/api/zones")
def get_zones(db: Session = Depends(get_db)):
    return db.query(models.ZoneModel).all()


@app.get("/api/team")
def get_team_members(db: Session = Depends(get_db)):
    return db.query(models.TeamMemberModel).all()

# --- NEW: Developer Profile & Project Endpoints ---

@app.get("/api/developer-profiles/search")
def search_developer_profile(name: str, db: Session = Depends(get_db)):
    """Search developer OR corridor by name and return profile with projects"""
    # 1. Try Developer Search
    dev = db.query(models.DeveloperProfileModel).filter(
        models.DeveloperProfileModel.name == name
    ).first()
    if not dev:
        dev = db.query(models.DeveloperProfileModel).filter(
            models.DeveloperProfileModel.name.ilike(f"%{name}%")
        ).first()
    
    if dev:
        return {
            "id": dev.id,
            "name": dev.name,
            "about": dev.about,
            "type": "Developer",
            "founded_year": dev.founded_year,
            "headquarters": dev.headquarters,
            "project_count": dev.project_count,
            "project_items": [{
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "location": p.location,
                "project_type": p.project_type,
                "price_range": p.price_range,
                "status": p.status,
                "configurations": p.configurations,
                "zones": [z.name for z in p.zones],
                "primary_image": next((img.image_url for img in p.images if img.is_primary), None),
            } for p in dev.project_list]
        }

    # 2. Try Corridor Search
    corridor = db.query(models.CorridorModel).filter(
        models.CorridorModel.name == name
    ).first()
    if not corridor:
        corridor = db.query(models.CorridorModel).filter(
            models.CorridorModel.name.ilike(f"%{name}%")
        ).first()

    if corridor:
        return {
            "id": corridor.id,
            "name": corridor.name,
            "about": corridor.description,
            "type": "Growth Corridor",
            "headquarters": corridor.location,
            "slug": corridor.slug,
            "project_items": [{
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "location": p.location,
                "project_type": p.project_type,
                "price_range": p.price_range,
                "status": p.status,
                "configurations": p.configurations,
                "primary_image": next((img.image_url for img in p.images if img.is_primary), None),
            } for p in corridor.project_list]
        }

    return {"error": "Portfolio not found", "name": name}

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
            "project_count": d.project_count,
            "project_items": [{
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
    """Get a single developer profile with all projects"""
    dev = db.query(models.DeveloperProfileModel).filter(
        models.DeveloperProfileModel.id == dev_id
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
        "project_count": dev.project_count,
        "project_items": projects
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
        "project_count": dev.project_count,
        "project_items": projects
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

# --- Auth Utilities ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = db.query(models.AdminUser).filter(models.AdminUser.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

@app.get("/api/imagekit/auth")
def get_imagekit_auth(admin: models.AdminUser = Depends(get_current_admin)):
    """
    Returns authentication parameters for ImageKit client-side upload.
    This endpoint is protected and only accessible by logged-in admins.
    """
    return imagekit.get_authentication_parameters()

@app.post("/api/contact-requests")
def submit_contact(req: ContactRequestCreate, db: Session = Depends(get_db)):
    db_req = models.ContactRequestModel(**req.dict())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return {"message": "Inquiry submitted successfully"}

@app.get("/api/admin/contact-requests")
def get_contact_requests(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    return db.query(models.ContactRequestModel).order_by(models.ContactRequestModel.id.asc()).all()

@app.delete("/api/admin/contact-requests/{req_id}")
def delete_contact_request(req_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_req = db.query(models.ContactRequestModel).filter(models.ContactRequestModel.id == req_id).first()
    if not db_req:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(db_req)
    db.commit()
    return {"message": "Inquiry deleted"}

@app.get("/api/admin/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    # Basic counts
    props_count = db.query(models.PropertyModel).count()
    devs_count = db.query(models.DeveloperProfileModel).count()
    projs_count = db.query(models.ProjectModel).count()
    
    # Chart Data: Properties by Type
    prop_types = db.query(models.PropertyModel.type).all()
    type_dist = {}
    for (t,) in prop_types:
        type_dist[t] = type_dist.get(t, 0) + 1
    type_chart = [{"name": k or "Unspecified", "value": v} for k, v in type_dist.items()]
    
    # Chart Data: Projects by Type
    proj_types = db.query(models.ProjectModel.project_type).all()
    proj_dist = {}
    for (t,) in proj_types:
        proj_dist[t] = proj_dist.get(t, 0) + 1
    proj_chart = [{"name": k or "Unspecified", "value": v} for k, v in proj_dist.items()]

    # Captured Leads (Contact Requests + User Identities)
    contact_requests = db.query(models.ContactRequestModel).count()
    user_identities = db.query(models.UserIdentityModel).count()
    total_leads = contact_requests + user_identities

    # Time-series Chart: Leads Generated (Daily for last 7 days)
    leads_chart = []
    for i in range(6, -1, -1):
        d = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        # Search for leads created on this day
        daily_leads = db.query(models.UserIdentityModel).filter(models.UserIdentityModel.created_at.like(f"{d}%")).count()
        # Add some variation with contact requests
        daily_contacts = db.query(models.ContactRequestModel).filter(models.ContactRequestModel.created_at.like(f"{d}%")).count()
        leads_chart.append({"date": d, "value": daily_leads + daily_contacts})

    # Traffic Chart (Mocked based on leads)
    traffic_chart = []
    import random
    for i in range(13, -1, -1):
        d = (datetime.now() - timedelta(days=i)).strftime("%d %b")
        # Mock traffic: 50-200 users, slightly growing
        traffic_chart.append({"date": d, "value": random.randint(150, 300) + (14-i)*5})

    return {
        "properties": props_count,
        "developers": devs_count,
        "projects": projs_count,
        "corridors": db.query(models.CorridorModel).count(),
        "team": db.query(models.TeamMemberModel).count(),
        "leads": total_leads,
        "type_chart": type_chart,
        "proj_chart": proj_chart,
        "leads_chart": leads_chart,
        "traffic_chart": traffic_chart
    }


@app.get("/api/admin/user-leads")
def get_user_leads(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    users = db.query(models.UserIdentityModel).all()
    return [{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "phone": u.phone,
        "created_at": u.created_at,
        "saved_count": len(u.saved_properties)
    } for u in users]


@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.ProjectModel).order_by(models.ProjectModel.id.asc()).all()

@app.get("/api/team")
def get_team(db: Session = Depends(get_db)):
    return db.query(models.TeamMemberModel).order_by(models.TeamMemberModel.id.asc()).all()

# --- Admin Auth Endpoints ---
@app.post("/api/admin/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/admin/me")
async def read_admin_me(current_admin: models.AdminUser = Depends(get_current_admin)):
    return {"username": current_admin.username}

# --- Admin CRUD Endpoints ---

# Properties
@app.post("/api/admin/properties", status_code=status.HTTP_201_CREATED)
def create_property(prop: PropertyCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    prop_data = prop.dict()
    if prop_data.get("developer_id") == 0: prop_data["developer_id"] = None
    if prop_data.get("corridor_id") == 0: prop_data["corridor_id"] = None
    gallery_data = prop_data.pop("gallery", [])
    db_prop = models.PropertyModel(**prop_data)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    
    # Add gallery images
    for img_url in gallery_data:
        db_img = models.PropertyImageModel(property_id=db_prop.id, image_url=img_url)
        db.add(db_img)
    db.commit()
    return db_prop

# Projects (Detailed Developer Projects)
@app.post("/api/admin/projects", status_code=status.HTTP_201_CREATED)
def create_project(proj: ProjectCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    proj_data = proj.dict()
    if proj_data.get("developer_id") == 0: proj_data["developer_id"] = None
    if proj_data.get("corridor_id") == 0: proj_data["corridor_id"] = None
    images_data = proj_data.pop("images", [])
    db_proj = models.ProjectModel(**proj_data)
    db.add(db_proj)
    db.commit()
    db.refresh(db_proj)
    
    for img_url in images_data:
        db_img = models.ProjectImageModel(project_id=db_proj.id, image_url=img_url, is_primary=False)
        db.add(db_img)
    db.commit()
    return db_proj

@app.put("/api/admin/projects/{proj_id}")
def update_project(proj_id: int, proj: ProjectCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_proj = db.query(models.ProjectModel).filter(models.ProjectModel.id == proj_id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    proj_data = proj.dict()
    images_data = proj_data.pop("images", [])
    for key, value in proj_data.items():
        setattr(db_proj, key, value)
    
    # Update images: simple approach - clear and re-add
    db.query(models.ProjectImageModel).filter(models.ProjectImageModel.project_id == proj_id).delete()
    for img_url in images_data:
        db_img = models.ProjectImageModel(project_id=db_proj.id, image_url=img_url, is_primary=False)
        db.add(db_img)
        
    db.commit()
    db.refresh(db_proj)
    return db_proj

@app.delete("/api/admin/projects/{proj_id}")
def delete_project(proj_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_proj = db.query(models.ProjectModel).filter(models.ProjectModel.id == proj_id).first()
    if not db_proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_proj)
    db.commit()
    return {"message": "Project deleted"}

@app.delete("/api/admin/projects/all/bulk")
def delete_all_projects(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db.query(models.ProjectModel).delete()
    db.commit()
    return {"message": "All projects deleted"}

# Team
@app.post("/api/admin/team", status_code=status.HTTP_201_CREATED)
def create_team_member(member: TeamMemberCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_member = models.TeamMemberModel(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.put("/api/admin/team/{member_id}")
def update_team_member(member_id: int, member: TeamMemberCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_member = db.query(models.TeamMemberModel).filter(models.TeamMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    for key, value in member.dict().items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.delete("/api/admin/team/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_member = db.query(models.TeamMemberModel).filter(models.TeamMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(db_member)
    db.commit()
    return {"message": "Team member deleted"}

@app.put("/api/admin/properties/{prop_id}")
def update_property(prop_id: int, prop: PropertyCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_prop = db.query(models.PropertyModel).filter(models.PropertyModel.id == prop_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    prop_data = prop.dict()
    if prop_data.get("developer_id") == 0: prop_data["developer_id"] = None
    if prop_data.get("corridor_id") == 0: prop_data["corridor_id"] = None
    gallery_data = prop_data.pop("gallery", [])
    
    for key, value in prop_data.items():
        setattr(db_prop, key, value)
    
    # Update gallery
    db.query(models.PropertyImageModel).filter(models.PropertyImageModel.property_id == prop_id).delete()
    for img_url in gallery_data:
        db_img = models.PropertyImageModel(property_id=db_prop.id, image_url=img_url)
        db.add(db_img)
        
    db.commit()
    db.refresh(db_prop)
    return db_prop

@app.delete("/api/admin/properties/{prop_id}")
def delete_property(prop_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_prop = db.query(models.PropertyModel).filter(models.PropertyModel.id == prop_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(db_prop)
    db.commit()
    return {"message": "Property deleted"}

@app.delete("/api/admin/properties/all/bulk")
def delete_all_properties(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db.query(models.PropertyModel).delete()
    db.commit()
    return {"message": "All properties deleted"}

# Developers
@app.post("/api/admin/developers", status_code=status.HTTP_201_CREATED)
def create_developer(dev: DeveloperCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_dev = models.DeveloperProfileModel(**dev.dict())
    db.add(db_dev)
    db.commit()
    db.refresh(db_dev)
    return db_dev

@app.put("/api/admin/developers/{dev_id}")
def update_developer(dev_id: int, dev: DeveloperCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_dev = db.query(models.DeveloperProfileModel).filter(models.DeveloperProfileModel.id == dev_id).first()
    if not db_dev:
        raise HTTPException(status_code=404, detail="Developer not found")
    for key, value in dev.dict().items():
        setattr(db_dev, key, value)
    db.commit()
    db.refresh(db_dev)
    return db_dev

@app.delete("/api/admin/developers/{dev_id}")
def delete_developer(dev_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_dev = db.query(models.DeveloperProfileModel).filter(models.DeveloperProfileModel.id == dev_id).first()
    if not db_dev:
        raise HTTPException(status_code=404, detail="Developer not found")
    db.delete(db_dev)
    db.commit()
    return {"message": "Developer deleted"}

# Area Rates
@app.post("/api/admin/area-rates", status_code=status.HTTP_201_CREATED)
def create_area_rate(rate: AreaRateCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_rate = models.AreaRateModel(**rate.dict())
    db.add(db_rate)
    db.commit()
    db.refresh(db_rate)
    return db_rate

@app.put("/api/admin/area-rates/{rate_id}")
def update_area_rate(rate_id: int, rate: AreaRateCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_rate = db.query(models.AreaRateModel).filter(models.AreaRateModel.id == rate_id).first()
    if not db_rate:
        raise HTTPException(status_code=404, detail="Area rate not found")
    for key, value in rate.dict().items():
        setattr(db_rate, key, value)
    db.commit()
    db.refresh(db_rate)
    return db_rate

@app.delete("/api/admin/area-rates/{rate_id}")
def delete_area_rate(rate_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_rate = db.query(models.AreaRateModel).filter(models.AreaRateModel.id == rate_id).first()
    if not db_rate:
        raise HTTPException(status_code=404, detail="Area rate not found")
    db.delete(db_rate)
    db.commit()
    return {"message": "Area rate deleted"}

# Corridors
@app.post("/api/admin/corridors", status_code=status.HTTP_201_CREATED)
def create_corridor(corridor: CorridorCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_corridor = models.CorridorModel(**corridor.dict())
    db.add(db_corridor)
    db.commit()
    db.refresh(db_corridor)
    return db_corridor

@app.put("/api/admin/corridors/{corridor_id}")
def update_corridor(corridor_id: int, corridor: CorridorCreate, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_corridor = db.query(models.CorridorModel).filter(models.CorridorModel.id == corridor_id).first()
    if not db_corridor:
        raise HTTPException(status_code=404, detail="Corridor not found")
    for key, value in corridor.dict().items():
        setattr(db_corridor, key, value)
    db.commit()
    db.refresh(db_corridor)
    return db_corridor

@app.delete("/api/admin/corridors/{corridor_id}")
def delete_corridor(corridor_id: int, db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    db_corridor = db.query(models.CorridorModel).filter(models.CorridorModel.id == corridor_id).first()
    if not db_corridor:
        raise HTTPException(status_code=404, detail="Corridor not found")
    db.delete(db_corridor)
    db.commit()
    return {"message": "Corridor deleted"}

@app.post("/api/referrals")
def submit_referral(req: ReferralCreate, db: Session = Depends(get_db)):
    db_ref = models.ReferralModel(**req.dict())
    db.add(db_ref)
    db.commit()
    db.refresh(db_ref)
    return {"message": "Referral submitted. Our concierge will reach out to your peer soon."}

@app.get("/api/admin/referrals")
def get_referrals(db: Session = Depends(get_db), admin: models.AdminUser = Depends(get_current_admin)):
    return db.query(models.ReferralModel).all()

# --- USER IDENTITY & SAVED PROPERTIES ---

@app.post("/api/identify-user")
def identify_user(user: UserIdentityCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserIdentityModel).filter(models.UserIdentityModel.email == user.email).first()
    if not db_user:
        db_user = models.UserIdentityModel(name=user.name, email=user.email, phone=user.phone)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    else:
        # Update name/phone if they changed
        db_user.name = user.name
        db_user.phone = user.phone
        db.commit()
        db.refresh(db_user)
    return db_user

@app.post("/api/save-property")
def save_property(req: PropertySaveRequest, db: Session = Depends(get_db)):
    user = db.query(models.UserIdentityModel).filter(models.UserIdentityModel.email == req.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not identified")
    
    # Check if already saved
    existing = db.query(models.SavedPropertyModel).filter(
        models.SavedPropertyModel.user_id == user.id,
        models.SavedPropertyModel.property_id == req.property_id
    ).first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed"}
    
    saved = models.SavedPropertyModel(user_id=user.id, property_id=req.property_id)
    db.add(saved)
    db.commit()
    return {"status": "saved"}

@app.get("/api/saved-properties/{email}")
def get_saved_properties(email: str, db: Session = Depends(get_db)):
    user = db.query(models.UserIdentityModel).filter(models.UserIdentityModel.email == email).first()
    if not user:
        return []
    return [sp.property_id for sp in user.saved_properties]

