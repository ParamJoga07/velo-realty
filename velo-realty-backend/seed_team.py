from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import models

# Use the hosted DB URL
SQLALCHEMY_DATABASE_URL = "postgresql://paramjoga:hYD1A2xTlN3UNGHyD1BnRdS9AJGQEqSz@dpg-d7sqdu0k1i2s73a0hpbg-a.oregon-postgres.render.com/velo_reality"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

def seed_team():
    db = Session(engine)
    print("Clearing existing team...")
    db.query(models.TeamMemberModel).delete()
    
    team = [
        {
            "name": "Ravi Teja Nagineni",
            "role": "CEO and Founder",
            "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Visionary leader with 15+ years of experience in real estate strategy and urban development. Driving the future of premium living in Hyderabad."
        },
        {
            "name": "Vinay Kumar Golla",
            "role": "Head of HR & Operations",
            "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Operations maestro ensuring seamless organizational growth and human capital excellence. Architect of Velo's high-performance culture."
        },
        {
            "name": "Boda Sri Lalitha",
            "role": "Talent & Client Acquisition Specialist",
            "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Specializing in high-value network building and premium talent identification. Bridging the gap between elite clients and luxury opportunities."
        },
        {
            "name": "Anand sai pratap Pandaraboinä",
            "role": "Senior Property Consultant",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Strategic consultant with deep expertise in Hyderabad's North and South growth corridors. Expert in portfolio diversification."
        },
        {
            "name": "Vathara Elizabeth",
            "role": "Property Consultant",
            "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Client-focused advisor specializing in ready-to-move luxury apartments and gated communities. Committed to finding your perfect home."
        },
        {
            "name": "Gottumukkala Tara sai sambhavi",
            "role": "Senior Property Consultant",
            "image": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Investment specialist with a focus on high-yield commercial spaces and emerging residential hubs. Expert navigator of market trends."
        },
        {
            "name": "Bhavish kumar",
            "role": "Property Consultant",
            "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Dedicated consultant helping families discover the best plot and villa options in the West Hyderabad corridor."
        },
        {
            "name": "Nanak Kumar Pramanik",
            "role": "Senior Property Consultant",
            "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Analytical expert focused on off-plan projects and long-term capital appreciation strategies for HNI clients."
        },
        {
            "name": "Dinesh Kumar Sunnapu",
            "role": "Senior Property Consultant",
            "image": "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?q=80&w=400&h=500&auto=format&fit=crop",
            "bio": "Market veteran with an unmatched track record in large-scale residential acquisitions and developer relations."
        }
    ]

    for m in team:
        db_member = models.TeamMemberModel(**m)
        db.add(db_member)
    
    db.commit()
    print(f"Successfully seeded {len(team)} team members.")
    db.close()

if __name__ == "__main__":
    seed_team()
