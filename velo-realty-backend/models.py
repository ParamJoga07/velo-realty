from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# Association Tables for Many-to-Many Relationships
project_categories = Table(
    "project_categories_map",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("project_details.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True)
)

project_zones = Table(
    "project_zones_map",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("project_details.id"), primary_key=True),
    Column("zone_id", Integer, ForeignKey("zones.id"), primary_key=True)
)

property_categories = Table(
    "property_categories_map",
    Base.metadata,
    Column("property_id", Integer, ForeignKey("properties.id"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id"), primary_key=True)
)

property_zones = Table(
    "property_zones_map",
    Base.metadata,
    Column("property_id", Integer, ForeignKey("properties.id"), primary_key=True),
    Column("zone_id", Integer, ForeignKey("zones.id"), primary_key=True)
)

class CategoryModel(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    projects = relationship("ProjectModel", secondary=project_categories, back_populates="categories")
    properties = relationship("PropertyModel", secondary=property_categories, back_populates="categories")

class ZoneModel(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    projects = relationship("ProjectModel", secondary=project_zones, back_populates="zones")
    properties = relationship("PropertyModel", secondary=property_zones, back_populates="zones")

class PropertyModel(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    location = Column(String)
    community = Column(String)
    developer = Column(String)
    type = Column(String)
    listingType = Column(String)
    price = Column(String)
    priceValue = Column(Float)
    beds = Column(Integer)
    baths = Column(Integer)
    area = Column(Float)
    handover = Column(String)
    status = Column(String)
    image = Column(String)
    description = Column(String)
    
    # Relationships
    developer_id = Column(Integer, ForeignKey("developer_profiles.id"), nullable=True)
    corridor_id = Column(Integer, ForeignKey("corridors.id"), nullable=True)
    
    # Relationships
    developer_rel = relationship("DeveloperProfileModel", back_populates="property_list")
    corridor_rel = relationship("CorridorModel", back_populates="property_list")
    categories = relationship("CategoryModel", secondary=property_categories, back_populates="properties")
    zones = relationship("ZoneModel", secondary=property_zones, back_populates="properties")
    
    gallery = relationship("PropertyImageModel", back_populates="property", cascade="all, delete-orphan")
    saved_by_users = relationship("SavedPropertyModel", back_populates="property", cascade="all, delete-orphan")
    contact_requests = relationship("ContactRequestModel", back_populates="property_rel", cascade="all, delete-orphan")

class PropertyImageModel(Base):
    __tablename__ = "property_images"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    image_url = Column(String, nullable=False)
    property = relationship("PropertyModel", back_populates="gallery")

class DeveloperModel(Base):
    __tablename__ = "developers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    projects = Column(Integer)
    image = Column(String)

class DeveloperProfileModel(Base):
    __tablename__ = "developer_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    about = Column(Text)
    founded_year = Column(Integer, nullable=True)
    headquarters = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    project_count = Column(Integer, default=0)
    project_list = relationship("ProjectModel", back_populates="developer", cascade="all, delete-orphan")
    property_list = relationship("PropertyModel", back_populates="developer_rel", cascade="all, delete-orphan")

class ProjectModel(Base):
    __tablename__ = "project_details"
    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey("developer_profiles.id"), nullable=False)
    corridor_id = Column(Integer, ForeignKey("corridors.id"), nullable=True) # Linked to Corridor
    name = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    location = Column(String)
    sub_location = Column(String, nullable=True)
    project_type = Column(String)
    land_area = Column(String, nullable=True)
    structure = Column(String, nullable=True)
    total_units = Column(String, nullable=True)
    configurations = Column(String, nullable=True)
    size_range = Column(String, nullable=True)
    price_range = Column(String, nullable=True)
    price_start = Column(Float, nullable=True)
    open_space = Column(String, nullable=True)
    possession = Column(String, nullable=True)
    status = Column(String, nullable=True)
    
    # Relationships
    categories = relationship("CategoryModel", secondary=project_categories, back_populates="projects")
    zones = relationship("ZoneModel", secondary=project_zones, back_populates="projects")
    
    clubhouse_size = Column(String, nullable=True)
    amenities = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    highlights = Column(Text, nullable=True)
    connectivity = Column(Text, nullable=True)

    developer = relationship("DeveloperProfileModel", back_populates="project_list")
    corridor = relationship("CorridorModel", back_populates="project_list")
    images = relationship("ProjectImageModel", back_populates="project", cascade="all, delete-orphan", order_by="ProjectImageModel.sort_order")

class ProjectImageModel(Base):
    __tablename__ = "project_images"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("project_details.id"), nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    project = relationship("ProjectModel", back_populates="images")

class CorridorModel(Base):
    __tablename__ = "corridors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String, unique=True)
    location = Column(String)
    description = Column(Text)
    image = Column(String)
    
    project_list = relationship("ProjectModel", back_populates="corridor", cascade="all, delete-orphan")
    property_list = relationship("PropertyModel", back_populates="corridor_rel", cascade="all, delete-orphan")

class ContactRequestModel(Base):
    __tablename__ = "contact_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=True)
    message = Column(Text)
    status = Column(String, default="Pending")
    property_rel = relationship("PropertyModel", back_populates="contact_requests")
    created_at = Column(String, default=lambda: datetime.now().isoformat())

class TeamMemberModel(Base):
    __tablename__ = "team_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    image = Column(String)
    bio = Column(Text)

class GuideModel(Base):
    __tablename__ = "guides"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)

class PartnerModel(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class StatModel(Base):
    __tablename__ = "stats"
    id = Column(Integer, primary_key=True, index=True)
    value = Column(String)
    label = Column(String)

class AreaRateModel(Base):
    __tablename__ = "area_rates"
    id = Column(Integer, primary_key=True, index=True)
    area = Column(String, unique=True, index=True)
    price = Column(String)
    cagr = Column(String)

class TestimonialModel(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=True) # e.g. "CEO, Tech Corp" or "Homeowner"
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    rating = Column(Integer, default=5)
    created_at = Column(String, default=lambda: datetime.now().isoformat())

class AdminUser(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class ReferralModel(Base):
    __tablename__ = "referrals"
    id = Column(Integer, primary_key=True, index=True)
    referrer_name = Column(String, nullable=False)
    referrer_email = Column(String, nullable=False)
    friend_name = Column(String, nullable=False)
    friend_contact = Column(String, nullable=False)
    investment_intent = Column(String, nullable=True)
    status = Column(String, default="Active") # Active, Converted, Rewarded
    created_at = Column(String, default=lambda: datetime.now().isoformat())
class UserIdentityModel(Base):
    __tablename__ = "user_identities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, index=True, nullable=False)
    created_at = Column(String, default=lambda: datetime.now().isoformat())
    saved_properties = relationship("SavedPropertyModel", back_populates="user", cascade="all, delete-orphan")

class SavedPropertyModel(Base):
    __tablename__ = "saved_properties"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_identities.id", ondelete="CASCADE"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(String, default=lambda: datetime.now().isoformat())
    user = relationship("UserIdentityModel", back_populates="saved_properties")
    property = relationship("PropertyModel", back_populates="saved_by_users")
