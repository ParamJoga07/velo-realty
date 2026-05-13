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
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/team`).then((res) =>
        res.json().then((data) =>
          Array.isArray(data) ? [...data].sort((a, b) => a.id - b.id) : []
        )
      ),
  });

  const ceo = teamMembers[0];
  const others = teamMembers.slice(1);

  useEffect(() => {
    if (others.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % others.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [others.length]);

  const handleDotClick = (i: number) => {
    if (isAnimating || i === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(i);
    setTimeout(() => setIsAnimating(false), 800);
  };

  if (teamMembers.length === 0) return null;

  // We use a 4-face cube (90° per step). Map members to faces 0-3
  const faceCount = 4;
  const faceAngle = 360 / faceCount; // 90°
  const cubeRotation = -activeIndex * faceAngle;

  return (
    <section id="team" className="section team-innovative">
      <div className="container">
        <div className="section-head center">
          <div>
            <p className="eyebrow">The Collective</p>
            <h2>Strategic Command</h2>
          </div>
        </div>

        <div className="team-stage">
          {/* ── STATIC CEO CARD ── */}
          {ceo && (
            <div className="ceo-slot">
              <div className="team-card-v3 ceo-card">
                <div className="card-image-wrap">
                  <img src={ceo.image} alt={ceo.name} className="card-image" />
                  <div className="card-tag">
                    <span className="card-role">{ceo.role}</span>
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-name">{ceo.name}</h3>
                  <p className="card-bio">{ceo.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── 3D CUBE CAROUSEL ── */}
          {others.length > 0 && (
            <div className="cube-slot">
              <div className="cube-scene">
                <div
                  className="cube-track"
                  style={{ transform: `translateZ(-180px) rotateY(${cubeRotation}deg)` }}
                >
                  {/* Render up to 4 faces of the cube */}
                  {Array.from({ length: faceCount }).map((_, faceIdx) => {
                    const member = others[faceIdx % others.length];
                    return (
                      <div
                        key={faceIdx}
                        className="cube-face"
                        style={{ transform: `rotateY(${faceIdx * faceAngle}deg) translateZ(180px)` }}
                      >
                        <div className={`team-card-v3 rotating-card ${faceIdx === 0 ? 'face-front' : ''}`}>
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination dots */}
              {others.length > 1 && (
                <div className="team-pagination">
                  {others.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Team member ${i + 1}`}
                      className={`pagination-dot ${activeIndex === i ? 'active' : ''}`}
                      onClick={() => handleDotClick(i)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
