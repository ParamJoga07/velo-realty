import { useState, useEffect } from 'react'
import type { Community, Developer, Guide } from '../types'
import { Building2 } from 'lucide-react'
import { CORRIDOR_MAPS } from './maps/CorridorMaps'
import { getOptimizedImage } from '../config'

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
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1449156001931-82d16bca4700?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop"
];

export function Sections({ 
  developers, 
  communities, 
  guides, 
  partners, 
  aboutStats, 
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

  if (showAllPartners) {
    return (
      <div className="all-partners-view animate-in">
        <header className="view-header">
          <div className="container">
            <button className="back-nav-btn" onClick={() => setShowAllPartners(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Portfolio
            </button>
            <div className="view-title">
              <p className="eyebrow">Strategic Network</p>
              <h1>Elite Developer Ecosystem</h1>
            </div>
          </div>
        </header>

        <main className="view-content container">
          <div className="partner-universe-grid">
            {developers.map((dev, index) => (
              <div 
                key={`${dev.name}-${index}`} 
                className="partner-universe-card"
                onClick={() => onDeveloperClick(dev.name)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="card-image-wrap">
                  <img src={getOptimizedImage(dev.image)} alt={dev.name} />
                  <div className="card-overlay"></div>
                </div>
                <div className="card-content">
                  <div className="partner-status">Strategic Partner</div>
                  <h3>{dev.name}</h3>
                  <div className="partner-projects-count">
                    {projectStats.devCounts[dev.id] || 0} Landmark Projects
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

      </div>
    );
  }

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
            {[...allPartnerNames, ...allPartnerNames].map((item, index) => (
              <div 
                className="ribbon-item" 
                key={`upper-${item}-${index}`}
                onClick={() => onDeveloperClick(item)}
              >
                <div className="ribbon-item-inner">
                  <Building2 size={18} />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ribbon-3d track-lower">
            {[...allPartnerNames, ...allPartnerNames].reverse().map((item, index) => (
              <div 
                className="ribbon-item" 
                key={`lower-${item}-${index}`}
                onClick={() => onDeveloperClick(item)}
              >
                <div className="ribbon-item-inner">
                  <Building2 size={18} />
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="center-action-wrap">
          <button className="btn-premium-action" onClick={() => setShowAllPartners(true)}>
            Discover All {allPartnerNames.length} Strategic Partners
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
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
            <div className="about-stats">
              {aboutStats.map((stat) => (
                <div className="about-stat" key={stat.value}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
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
          <div className="center-action-wrap" style={{ marginTop: '3rem' }}>
            <button className="btn-premium-action" onClick={() => setShowAllPartners(true)}>
              Explore All {developers.length} Developers
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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
