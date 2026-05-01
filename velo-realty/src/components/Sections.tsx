import { useState } from 'react'
import type { Community, Developer, Guide, Property } from '../types'
import { DeveloperModal } from './DeveloperModal'

type SectionsProps = {
  developers: Developer[]
  communities: Community[]
  guides: Guide[]
  partners: string[]
  aboutStats: Array<{ value: string; label: string }>
  allProperties: Property[]
}

export function Sections({ developers, communities, guides, partners, aboutStats, allProperties }: SectionsProps) {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [showAllPartners, setShowAllPartners] = useState(false);

  const developerProjects = allProperties.filter(p => p.developer === selectedDeveloper);
  const communityProjects = allProperties.filter(p => p.community === selectedCommunity);

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
                onClick={() => setSelectedDeveloper(dev.name)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="card-image-wrap">
                  <img src={dev.image} alt={dev.name} />
                  <div className="card-glass-layer"></div>
                </div>
                <div className="card-content">
                  <div className="partner-status">Strategic Partner</div>
                  <h3>{dev.name}</h3>
                  <div className="partner-projects-count">{dev.projects}+ Landmark Projects</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {selectedDeveloper && (
          <DeveloperModal 
            developerName={selectedDeveloper}
            projects={allProperties.filter(p => p.developer === selectedDeveloper)}
            onClose={() => setSelectedDeveloper(null)}
          />
        )}
      </div>
    );
  }

  const mainPartners = partners.slice(0, 6);

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
            {[...mainPartners, ...mainPartners, ...mainPartners, ...mainPartners].map((item, index) => (
              <div 
                className="ribbon-item" 
                key={`upper-${item}-${index}`}
                onClick={() => setSelectedDeveloper(item)}
              >
                <div className="ribbon-item-inner">
                  <div className="ribbon-glow"></div>
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ribbon-3d track-lower">
            {[...mainPartners, ...mainPartners, ...mainPartners, ...mainPartners].reverse().map((item, index) => (
              <div 
                className="ribbon-item" 
                key={`lower-${item}-${index}`}
                onClick={() => setSelectedDeveloper(item)}
              >
                <div className="ribbon-item-inner">
                  <div className="ribbon-glow"></div>
                  <span>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="center-action-wrap">
          <button className="btn-premium-action" onClick={() => setShowAllPartners(true)}>
            Discover All {partners.length} Strategic Partners
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
            <div className="about-visual-badge">The Skyline Era</div>
            <p>Empowering the next generation of real estate investors.</p>
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
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Local Market Mastery</h3>
              <p>Expert navigation through the luxury landscapes of Hyderabad's growth corridors.</p>
            </article>
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3>Data-Driven Curation</h3>
              <p>We analyze long-term appreciation potential to protect your capital, not just list properties.</p>
            </article>
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Seamless Acquisition</h3>
              <p>Handling all transaction complexities from discovery to final handover.</p>
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
            {communities.map((item) => (
              <div 
                key={item.name} 
                className="corridor-impact-card"
                onClick={() => setSelectedCommunity(item.name)}
              >
                <div className="corridor-visual">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="corridor-blueprint-overlay"></div>
                </div>
                <div className="corridor-content">
                  <span className="corridor-tag">Strategic Corridor</span>
                  <h3>{item.name}</h3>
                  <div className="corridor-stats">
                    <span>Active Projects: 15+</span>
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
            {developers.slice(0, 6).map((item) => (
              <article 
                key={item.name} 
                className="developer-card-3d"
                onClick={() => setSelectedDeveloper(item.name)}
              >
                <div className="dev-card-visual">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="dev-card-info">
                    <h3>{item.name}</h3>
                    <p>{item.projects} Projects</p>
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
      {selectedDeveloper && (
        <DeveloperModal 
          developerName={selectedDeveloper}
          projects={developerProjects}
          onClose={() => setSelectedDeveloper(null)}
        />
      )}
      {selectedCommunity && (
        <DeveloperModal 
          developerName={selectedCommunity}
          projects={communityProjects}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
    </>
  )
}
