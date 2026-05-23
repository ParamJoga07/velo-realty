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
  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () =>
      fetch(`${API_BASE_URL}/api/team`).then((res) =>
        res.json().then((data) =>
          Array.isArray(data)
            ? [...data].sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
            : []
        )
      ),
  });

  const ceo = teamMembers[0];
  const others = teamMembers.slice(1);

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

          {/* ── CONTINUOUS SCROLL TRACK ── */}
          {others.length > 0 && (
            <div className="carousel-slot ticker-mode">
              <div className="carousel-view">
                <div 
                  className="carousel-track continuous-scroll" 
                >
                  {/* Triple the items for a perfectly seamless loop */}
                  {[...others, ...others, ...others].map((member, idx) => (
                    <div key={`${member.id}-${idx}`} className="carousel-item">
                      <div className="team-card-v3 rotating-card">
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
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
