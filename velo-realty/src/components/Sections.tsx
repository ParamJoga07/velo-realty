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

export function TestimonialsSection({ testimonials: apiTestimonials = [] }: { testimonials: any[] }) {
  const googleMapsUrl = "https://maps.app.goo.gl/bDpzQ6pqBaaJNW99A?g_st=iwb";

  // Format real client testimonials as Google Review card structures
  const googleReviews = apiTestimonials.map((t, idx) => {
    // Attempt to format a friendly date if created_at exists
    let displayDate = "Verified Client Review";
    if (t.created_at) {
      try {
        const d = new Date(t.created_at);
        if (!isNaN(d.getTime())) {
          displayDate = d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
      } catch (err) {
        // Fallback
      }
    }

    return {
      id: t.id || `api-${idx}`,
      name: t.name,
      role: t.role || "Verified Investor",
      content: t.content,
      rating: t.rating || 5,
      relative_date: displayDate,
      avatar: t.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      verified: true
    };
  });

  return (
    <section id="testimonials" className="section alt google-reviews-section">
      {/* ─── PREMIUM SCOPED STYLE BLOCK FOR PERFECT LIGHT/DARK STYLING ─── */}
      <style>{`
        .google-reviews-section {
          padding: 8rem 0;
          position: relative;
          background: #061118;
          overflow: hidden;
        }
        .page[data-theme='light'] .google-reviews-section {
          background: #f8fafc;
        }
        .google-reviews-grid-container {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 3.5rem;
          margin-top: 3.5rem;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .google-reviews-grid-container {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        /* Google rating card summary */
        .google-brand-summary-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 28px;
          padding: 2.5rem 2rem;
          text-align: center;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: sticky;
          top: 100px;
        }
        .page[data-theme='light'] .google-brand-summary-card {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
        }
        .google-brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .page[data-theme='light'] .google-brand-title {
          color: #0f172a;
        }
        .google-brand-logo-g {
          font-weight: 800;
          font-family: 'Product Sans', sans-serif;
          letter-spacing: -0.05em;
        }
        .google-score-large {
          font-size: 4rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .page[data-theme='light'] .google-score-large {
          color: #0f172a;
        }
        .google-rating-subtext {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }
        .page[data-theme='light'] .google-rating-subtext {
          color: #64748b;
        }
        .google-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          margin-top: 0.5rem;
        }
        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.9rem 1.5rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          width: 100%;
          text-decoration: none !important;
        }
        .google-btn-primary {
          background: linear-gradient(90deg, #f97316, #ea580c);
          color: #ffffff !important;
          border: none;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.25);
        }
        .google-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
        }
        .google-btn-outline {
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .page[data-theme='light'] .google-btn-outline {
          background: #f8fafc;
          color: #0f172a !important;
          border-color: #cbd5e1;
        }
        .google-btn-outline:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .page[data-theme='light'] .google-btn-outline:hover {
          background: #f1f5f9;
        }
        /* Review Grid items */
        .google-reviews-grid-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .google-review-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
        }
        .page[data-theme='light'] .google-review-card {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .google-review-card:hover {
          transform: translateY(-5px);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        .page[data-theme='light'] .google-review-card:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
        }
        .google-card-header-badge {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          opacity: 0.7;
        }
        .google-review-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .google-user-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(249, 115, 22, 0.3);
        }
        .google-user-info-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .google-user-name {
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 1.05rem;
        }
        .page[data-theme='light'] .google-user-name {
          color: #0f172a;
        }
        .google-verified-check {
          color: #14b8a6;
          display: flex;
          align-items: center;
        }
        .google-user-role {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
        }
        .page[data-theme='light'] .google-user-role {
          color: #64748b;
        }
        .google-stars-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .google-rating-time {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          margin-left: 0.5rem;
          font-weight: 500;
        }
        .page[data-theme='light'] .google-rating-time {
          color: #94a3b8;
        }
        .google-review-body {
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
          flex-grow: 1;
        }
        .page[data-theme='light'] .google-review-body {
          color: #334155;
        }
        .google-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.01);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          gap: 1.25rem;
          width: 100%;
        }
        .page[data-theme='light'] .google-empty-state {
          background: #ffffff;
          border-color: #cbd5e1;
        }
        .google-empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }
        .page[data-theme='light'] .google-empty-title {
          color: #0f172a;
        }
        .google-empty-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.5);
          max-width: 480px;
          line-height: 1.6;
        }
        .page[data-theme='light'] .google-empty-text {
          color: #64748b;
        }
      `}</style>

      <div className="container">
        <div className="section-head center">
          <div>
            <p className="eyebrow">Reputation &amp; Trust</p>
            <h2>Verified Client Experiences</h2>
            <p className="section-subtitle">Real feedback from esteemed property investors on Google Reviews.</p>
          </div>
        </div>

        <div className="google-reviews-grid-container">
          {/* ─── GOOGLE BRAND & SCORE SUMMARY ─── */}
          <div className="google-brand-summary-card">
            <div className="google-brand-title">
              <span className="google-brand-logo-g">
                <span style={{ color: '#4285F4' }}>G</span>
                <span style={{ color: '#EA4335' }}>o</span>
                <span style={{ color: '#FBBC05' }}>o</span>
                <span style={{ color: '#4285F4' }}>g</span>
                <span style={{ color: '#34A853' }}>l</span>
                <span style={{ color: '#EA4335' }}>e</span>
              </span>
              <span>Reviews</span>
            </div>

            <div className="google-score-large">5.0</div>

            <div className="google-stars-row">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#FBBC05" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>

            <p className="google-rating-subtext">
              Based on verified client transactions &amp; advisory experiences.
            </p>

            <div className="google-action-buttons">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="google-btn google-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                Write a Review
              </a>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="google-btn google-btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                View on Google Maps
              </a>
            </div>
          </div>

          {/* ─── GOOGLE REVIEWS LIST GRID ─── */}
          <div className="google-reviews-grid-items">
            {googleReviews.length > 0 ? (
              googleReviews.map((r) => (
                <div key={r.id} className="google-review-card">
                  {/* Small G Logo decoration in corner */}
                  <div className="google-card-header-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.65-1.93-.65-4.13 0-6.06z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>

                  <div className="google-review-user">
                    <img 
                      src={r.avatar} 
                      alt={r.name} 
                      className="google-user-avatar"
                    />
                    <div className="google-user-info-text">
                      <div className="google-user-name">
                        {r.name}
                        {r.verified && (
                          <span className="google-verified-check" title="Verified Customer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="google-user-role">{r.role}</div>
                    </div>
                  </div>

                  <div className="google-stars-row">
                    <div style={{ display: 'flex', gap: '0.15rem' }}>
                      {[...Array(r.rating)].map((_, i) => (
                        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#FBBC05" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                    <span className="google-rating-time">{r.relative_date}</span>
                  </div>

                  <p className="google-review-body">
                    &quot;{r.content}&quot;
                  </p>
                </div>
              ))
            ) : (
              <div className="google-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent-orange, #f97316)' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <div className="google-empty-title">Be the first to share your experience</div>
                <p className="google-empty-text">
                  No verified client reviews have been published yet. If you have transacted with Velo Realty, please write a review on our Google Maps business listing to share your feedback!
                </p>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="google-btn google-btn-primary" style={{ width: 'auto', padding: '0.8rem 2rem' }}>
                  Write a Google Review
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
