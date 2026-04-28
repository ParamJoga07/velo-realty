import type { Community, Developer, Guide } from '../types'

type SectionsProps = {
  developers: Developer[]
  communities: Community[]
  guides: Guide[]
  partners: string[]
  aboutStats: Array<{ value: string; label: string }>
}

export function Sections({ developers, communities, guides, partners, aboutStats }: SectionsProps) {
  const marqueeItems = [...partners, ...partners]

  return (
    <>
      <section className="section partners">
        <div className="container">
          <div className="section-head center">
            <div>
              <h2>Our Partners</h2>
            </div>
          </div>
        </div>
        <div className="partner-track-wrap">
          <div className="partner-track">
            {marqueeItems.map((item, index) => (
              <div className="partner-chip" key={`${item}-${index}`}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="partner-track-wrap">
          <div className="partner-track">
            {marqueeItems.map((item, index) => (
              <div className="partner-chip" key={`${item}-${index}`}>
                {item}
              </div>
            ))}
          </div>
        </div></section>

      <section className="section about-panel">
        <div className="container about-grid">
          <article className="about-content">
            <p className="eyebrow">About VELO</p>
            <h2>Investment-led advisory for modern real-estate buyers.</h2>
            <p>
              VELO combines curated inventory, data-backed guidance, and rapid response advisory to simplify premium
              property decisions across growth communities.
            </p>
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
            <div className="about-visual-badge">Explore More</div>
            <p>Your gateway to premium city investments.</p>
          </aside>
        </div>
      </section>

      <section className="section parallax-section">
        <div className="container">
          <article className="parallax-card">
            <div className="parallax-layer back" aria-hidden="true" />
            <div className="parallax-layer mid" aria-hidden="true" />
            <div className="parallax-layer front" aria-hidden="true" />
            <div className="parallax-content">
              <p className="eyebrow">Skyline Perspective</p>
              <h2>Experience city-scale opportunities with immersive project discovery.</h2>
              <p>
                Scroll to feel layered depth inspired by modern skyline visuals, built to create a premium browsing
                experience for real-estate buyers.
              </p>
              <a className="btn btn-primary" href="#properties">
                Explore skyline projects
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="developers" className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Top Developers</h2>
              <p className="section-subtitle">Work directly with trusted names in the UAE market.</p>
            </div>
            <a href="#contact">Partner with VELO</a>
          </div>
          <div className="developer-grid">
            {developers.map((item) => (
              <article key={item.name} className="developer-card image-card">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="card-content-overlay">
                  <h3>{item.name}</h3>
                  <p>{item.projects} active projects</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="communities" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Popular Communities</h2>
              <p className="section-subtitle">Browse communities with strong demand and lifestyle value.</p>
            </div>
            <a href="#properties">View properties by community</a>
          </div>
          <div className="community-grid">
            {communities.map((item) => (
              <a key={item.name} className="community-card image-card" href="#properties">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="card-content-overlay">
                  <span>{item.name}</span>
                  <small>Luxury inventory available</small>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Why VELO</h2>
              <p className="section-subtitle">We blend technology, design, and market expertise.</p>
            </div>
          </div>
          <div className="service-grid">
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <h3>Verified Listings</h3>
              <p>Curated projects with clear pricing, availability, and handover updates.</p>
            </article>
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3>Investment Advisory</h3>
              <p>Data-backed guidance for off-plan, rental yield, and long-term appreciation.</p>
            </article>
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h3>Fast Response</h3>
              <p>Immediate WhatsApp and callback workflows for high-intent enquiries.</p>
            </article>
            <article className="service-card premium-card">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <h3>Developer Network</h3>
              <p>Direct access to premium UAE developers and pre-launch opportunities.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="blogs" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Latest Guides</h2>
              <p className="section-subtitle">Research-driven insights for smarter property decisions.</p>
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
                  <span className="read-link">Read guide <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
