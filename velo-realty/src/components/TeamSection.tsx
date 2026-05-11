import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (teamMembers.length <= 2) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 2) % teamMembers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  if (teamMembers.length === 0) return null;

  // Calculate the members to show (3 at a time)
  const displayedMembers = [
    teamMembers[activeIndex],
    teamMembers[(activeIndex + 1) % teamMembers.length],
    teamMembers[(activeIndex + 2) % teamMembers.length]
  ];

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
              <div key={`${member.id}-${idx}`} className="team-card-v3">
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

        <div className="team-pagination">
          {Array.from({ length: Math.ceil(teamMembers.length / 3) }).map((_, i) => (
            <div 
              key={i} 
              className={`pagination-dot ${Math.floor(activeIndex / 3) === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i * 3)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
