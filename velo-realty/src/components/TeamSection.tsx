import React from 'react';
import './TeamSection.css';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function TeamSection() {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [activeMember, setActiveMember] = React.useState(0);

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/team')
      .then(res => res.json())
      .then(data => setTeamMembers(data))
      .catch(err => console.error("Error fetching team members:", err));
  }, []);

  if (teamMembers.length === 0) return null;

  return (
    <section id="team" className="section team-innovative">
      <div className="container">
        <div className="section-head center">
          <div>
            <p className="eyebrow">The Collective</p>
            <h2>Strategic Command</h2>
          </div>
        </div>

        <div className="team-display-container">
          <div className="team-active-showcase">
            <div className="active-portrait-wrap">
              <div className="portrait-glitch-layer"></div>
              <img 
                key={teamMembers[activeMember].name}
                src={teamMembers[activeMember].image} 
                alt={teamMembers[activeMember].name} 
                className="active-portrait"
              />
              <div className="portrait-hologram-glow"></div>
            </div>
            
            <div className="active-bio-panel">
              <div className="bio-content-inner">
                <span className="member-rank">Rank: {teamMembers[activeMember].role}</span>
                <h3 className="member-name">{teamMembers[activeMember].name}</h3>
                <p className="member-bio-text">{teamMembers[activeMember].bio}</p>
                <div className="bio-stats-visual">
                  <div className="bio-stat">
                    <span>Precision</span>
                    <div className="stat-bar"><div className="stat-fill" style={{width: '95%'}}></div></div>
                  </div>
                  <div className="bio-stat">
                    <span>Velocity</span>
                    <div className="stat-bar"><div className="stat-fill" style={{width: '98%'}}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="team-selection-reel">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className={`selection-chip ${activeMember === index ? 'active' : ''}`}
                onClick={() => setActiveMember(index)}
                onMouseEnter={() => setActiveMember(index)}
              >
                <img src={member.image} alt={member.name} />
                <div className="chip-indicator"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
