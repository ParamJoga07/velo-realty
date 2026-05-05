from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

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
    gallery = relationship("PropertyImageModel", back_populates="property", cascade="all, delete-orphan")

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
    total_projects = Column(Integer, default=0)
    project_list = relationship("ProjectModel", back_populates="developer", cascade="all, delete-orphan")

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
    zone = Column(String, nullable=True)
    category = Column(String, nullable=True)
    clubhouse_size = Column(String, nullable=True)
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
    
    project_list = relationship("ProjectModel", back_populates="corridor")

class ContactRequestModel(Base):
    __tablename__ = "contact_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    message = Column(Text)
    status = Column(String, default="Pending")
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

class AdminUser(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
