import { useState, useEffect } from 'react'
import type { Community, Developer, Guide } from '../types'
import { Building2 } from 'lucide-react'
import { CORRIDOR_MAPS } from './maps/CorridorMaps'

type SectionsProps = {
  developers: Developer[]
  communities: Community[]
  guides: Guide[]
  partners: string[]
  aboutStats: Array<{ value: string; label: string }>
  onDeveloperClick: (name: string) => void
  projectStats: { devCounts: Record<number, number>, corrCounts: Record<number, number> }
}

const SKYLINE_IMAGES = [
  "/images-1.jpeg",
  "/IMAGE2.jpg",
  "/IMAGE3.jpg",
  "/IMAGE4.jpg"
];

export function Sections({ 
  developers, 
  communities, 
  guides, 
  partners, 
  aboutStats: _aboutStats, 
  onDeveloperClick,
  projectStats
}: SectionsProps) {
  const [showAllPartners, setShowAllPartners] = useState(false);
  const [currentSkyline, setCurrentSkyline] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSkyline((prev) => (prev + 1) % SKYLINE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Inline expansion logic will be applied at the developer section below.

  // Prepare partner names from both developers and explicit partners
  const allPartnerNames = Array.from(new Set([
    ...developers.map(d => d.name),
    ...partners
  ]));

  return (
    <>
      <section className="section partners isometric-perspective">
        <div className="container">
          <div className="section-head center">
            <div>
              <p className="eyebrow">Investment Network</p>
              <h2>Our A-List Partners</h2>
            </div>
          </div>
        </div>
        <div className="isometric-container ribbon-3d-wrap">
          <div className="ribbon-3d track-upper">
            {[...allPartnerNames, ...allPartnerNames].map((item, index) => {
              const dev = developers.find(d => d.name === item);
              const logoUrl = dev ? dev.image : null;
              return (
                <div 
                  className="ribbon-item" 
                  key={`upper-${item}-${index}`}
                  onClick={() => onDeveloperClick(item)}
                >
                  <div className="ribbon-item-inner">
                    {logoUrl ? (
                      <div className="partner-logo-box" style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: 2,
                        flexShrink: 0
                      }}>
                        <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <Building2 size={18} />
                    )}
                    <span>{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ribbon-3d track-lower">
            {[...allPartnerNames, ...allPartnerNames].reverse().map((item, index) => {
              const dev = developers.find(d => d.name === item);
              const logoUrl = dev ? dev.image : null;
              return (
                <div 
                  className="ribbon-item" 
                  key={`lower-${item}-${index}`}
                  onClick={() => onDeveloperClick(item)}
                >
                  <div className="ribbon-item-inner">
                    {logoUrl ? (
                      <div className="partner-logo-box" style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: 2,
                        flexShrink: 0
                      }}>
                        <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <Building2 size={18} />
                    )}
                    <span>{item}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="center-action-wrap">
          <button className="btn-premium-action" onClick={() => setShowAllPartners(true)}>
            Discover All {allPartnerNames.length} Strategic Partners
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div> */}
      </section>

      <section id="about" className="section about-panel">
        <div className="container about-grid">
          <article className="about-content">
            <p className="eyebrow">About Velo Realty Pvt. Ltd.</p>
            <h2>Where Speed Meets Realty</h2>
            <div className="about-description">
              <div className="mission-vision">
                <div className="mv-card">
                  <h3>Vision</h3>
                  <p>
                    To redefine the pace of global real estate by bridging the gap between local expertise and
                    international investment opportunities.
                  </p>
                </div>
                <div className="mv-card">
                  <h3>Mission</h3>
                  <p>
                    To empower investors with data-driven insights and seamless transaction speeds, ensuring every move
                    in the Hyderabad market is a step toward generational wealth.
                  </p>
                </div>
              </div>
              <div className="core-objectives">
                <h3>Core Objectives</h3>
                <div className="objectives-grid">
                  <div className="objective">
                    <strong>Velocity</strong>
                    <span>Executing transactions with unmatched efficiency and transparent precision.</span>
                  </div>
                  <div className="objective">
                    <strong>Excellence</strong>
                    <span>Curating a portfolio of high-yield, premium properties that set new standards.</span>
                  </div>
                  <div className="objective">
                    <strong>Longevity</strong>
                    <span>Focusing on strategic capital appreciation to build enduring wealth.</span>
                  </div>
                  <div className="objective">
                    <strong>Omnipresence</strong>
                    <span>Creating a seamless investment bridge across Hyderabad's premium corridors.</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="about-stats">
              {aboutStats.map((stat) => (
                <div className="about-stat" key={stat.value}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div> */}
          </article>
          <aside className="about-visual" aria-label="City skyline preview">
            {SKYLINE_IMAGES.map((img, i) => (
              <div 
                key={i}
                className={`skyline-slide ${i === currentSkyline ? 'active' : ''}`}
                style={{ backgroundImage: `linear-gradient(to top, rgba(10, 24, 36, 0.95), transparent), url(${img})` }}
              ></div>
            ))}
            <div className="about-visual-content">
              <div className="about-visual-badge">The Skyline Era</div>
              <p>Empowering the next generation of real estate investors.</p>
              <div className="carousel-indicators">
                {SKYLINE_IMAGES.map((_, i) => (
                  <div key={i} className={`indicator ${i === currentSkyline ? 'active' : ''}`}></div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="why-velo" className="section alt why-velo">
        <div className="container">
          <div className="section-head center">
            <div>
              <p className="eyebrow">Why Velo Realty?</p>
              <h2>The Velocity Advantage</h2>
              <p className="section-subtitle">
                In a market that never sleeps, timing is everything. We combine rapid market intelligence with a
                "human-first" approach to ensure you never miss a high-value opportunity.
              </p>
            </div>
          </div>
          <div className="service-grid">
            <article className="service-card premium-card visual-card">
              <div className="card-media">
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop" alt="Luxury Hyderabad Skyline" />
                <div className="card-media-overlay"></div>
              </div>
              <div className="card-body">
                
                <h3>Local Market Mastery</h3>
                <p>Expert navigation through the luxury landscapes of Hyderabad's growth corridors.</p>
              </div>
            </article>

            <article className="service-card premium-card visual-card">
              <div className="card-media">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop" alt="Data Analytics" />
                <div className="card-media-overlay"></div>
              </div>
              <div className="card-body">
                
                <h3>Data-Driven Curation</h3>
                <p>We analyze long-term appreciation potential to protect your capital, not just list properties.</p>
              </div>
            </article>

            <article className="service-card premium-card visual-card">
              <div className="card-media">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop" alt="Premium Interior" />
                <div className="card-media-overlay"></div>
              </div>
              <div className="card-body">
                
                <h3>Seamless Acquisition</h3>
                <p>Handling all transaction complexities from discovery to final handover.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="corridors" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Hyderabad’s Growth Corridors</h2>
              <p className="section-subtitle">Strategically positioned investment hubs across the city.</p>
            </div>
            <a href="#properties">Explore Corridor Projects</a>
          </div>
          <div className="corridor-impact-grid">
            {Array.isArray(communities) && communities.map((item) => (
              <div 
                key={item.name} 
                className="corridor-impact-card"
                onClick={() => onDeveloperClick(item.name)}
              >
                <div className="corridor-visual">
                  {CORRIDOR_MAPS[item.slug] || CORRIDOR_MAPS[item.name.toLowerCase().replace(/\s+/g, '-')] || (
                    <img src={item.image} alt={item.name} loading="lazy" />
                  )}
                  <div className="corridor-blueprint-overlay"></div>
                </div>
                <div className="corridor-content">
                  <span className="corridor-tag">Strategic Corridor</span>
                  <h3>{item.name}</h3>
                  <div className="corridor-stats">
                    <span>Active Projects: {projectStats.corrCounts[item.id] || 0}</span>
                    <span className="stat-divider">|</span>
                    <span>Growth: High</span>
                  </div>
                  <div className="corridor-action">
                    View Pipeline 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="developers" className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Top Developers</h2>
              <p className="section-subtitle">Collaborating with the industry's most trusted names.</p>
            </div>
            <a href="#contact">Partner with Velo</a>
          </div>
          <div className={`developer-grid-wrapper ${showAllPartners ? 'expanded' : ''}`}>
            <div className="developer-grid-3d">
              {developers.map((item) => (
                <article 
                  key={item.name} 
                  className="developer-card-3d"
                  onClick={() => onDeveloperClick(item.name)}
                >
                  <div className="dev-card-visual">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <div className="dev-card-info">
                      <h3>{item.name}</h3>
                      <p>{projectStats.devCounts[item.id] || 0} Projects</p>
                    </div>
                  </div>
                  <div className="dev-card-glare"></div>
                </article>
              ))}
            </div>
            {!showAllPartners && <div className="developer-mask"></div>}
          </div>
          <div className="center-action-wrap" style={{ marginTop: '3rem' }}>
            <button className="btn-premium-action" onClick={() => setShowAllPartners(!showAllPartners)}>
              {showAllPartners ? 'Show Less Developers' : `Explore All ${developers.length} Developers`}
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: showAllPartners ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section id="blogs" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Latest Insights</h2>
              <p className="section-subtitle">Research-driven intelligence for the modern investor.</p>
            </div>
          </div>
          <div className="blog-grid">
            {guides.map((item) => (
              <a href="#guides" className="blog-card premium-card" key={item.title}>
                <div className="card-inner">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="card-footer">
                  <span className="read-link">
                    Read guide{' '}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section alt">
      <div className="container">
        <div className="section-head center">
          <h2>Client Experiences</h2>
          <p className="section-subtitle">What modern investors say about Velo Realty.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem'}}>
          {testimonials.map((t) => (
            <div key={t.id} className="premium-card" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 24}}>
              <div style={{display: 'flex', gap: '0.2rem'}}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < t.rating ? "var(--accent-orange, #f97316)" : "var(--border-color)"} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <p style={{fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--body-color)', lineHeight: 1.6}}>&quot;{t.content}&quot;</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)'}}>
                <img 
                  src={t.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'} 
                  alt={t.name} 
                  style={{width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-orange, #f97316)'}} 
                />
                <div>
                  <div style={{fontWeight: 700, color: 'var(--heading-color)'}}>{t.name}</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--accent-orange, #f97316)'}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
