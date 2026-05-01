import React from 'react';
import './TeamSection.css';

const teamMembers = [
  {
    name: 'Vikram Reddy',
    role: 'Founder & CEO',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxm4x8UVMEnLMBDlTCN2iFVCgLgJSQ6kjU6A&s',
    bio: 'Visionary leader with 15+ years in Hyderabad real estate.',
  },
  {
    name: 'Ananya Sharma',
    role: 'Head of Growth Corridors',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgTetWRyvPAWDHtX-MCel3C3oVx4WfCozCGb8HLq1h&s',
    bio: 'Expert in local luxury investments and portfolio growth across Hyderabad.',
  },
  {
    name: 'Siddharth Rao',
    role: 'Chief Investment Officer',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeXSvNvTy7Zowoep7o-MPuZVScrlVoZJQkwg&s',
    bio: 'Data-driven strategist specializing in growth corridor analysis.',
  },
  {
    name: 'Priya Kapoor',
    role: 'Director of Client Relations',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS2M7ysn8HgsZcigyJhvNGAdAGB6c62NNV6g&s',
    bio: 'Ensuring seamless transaction velocity for global investors.',
  },
];

export function TeamSection() {
  const [activeMember, setActiveMember] = React.useState(0);

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
