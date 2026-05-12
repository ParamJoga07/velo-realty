import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import API_BASE_URL from '../config';
import './TeamSection.css';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => fetch(`${API_BASE_URL}/api/team`).then(res => res.json().then(data => 
      Array.isArray(data) ? [...data].sort((a, b) => a.id - b.id) : []
    ))
  });

  const ceo = teamMembers[0];
  const others = teamMembers.slice(1);

  useEffect(() => {
    if (others.length <= 2) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % others.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [others.length]);

  if (teamMembers.length === 0) return null;

  // Static CEO card + 2 rotating cards
  const displayedMembers = [
    ceo,
    others[activeIndex],
    others[(activeIndex + 1) % others.length]
  ].filter(Boolean);

  return (
    <section id="team" className="section team-innovative">
      <div className="container">
        <div className="section-head center">
          <div>
            <p className="eyebrow">The Collective</p>
            <h2>Strategic Command</h2>
          </div>
        </div>

        <div className="team-slider-wrap">
          <div className="team-grid-v3">
            {displayedMembers.map((member, idx) => (
              <div key={`${member.id}-${idx}`} className={`team-card-v3 ${idx === 0 ? 'ceo-card' : 'rotating-card'} vteam-member`}>
                <div className="card-image-wrap">
                  <img src={member.image} alt={member.name} className="card-image" />
                  <div className="card-tag">
                    <span className="card-role">{member.role}</span>
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-name">{member.name}</h3>
                  <p className="card-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {others.length > 2 && (
          <div className="team-pagination">
            {others.map((_, i) => (
              <div 
                key={i} 
                className={`pagination-dot ${activeIndex === i ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
