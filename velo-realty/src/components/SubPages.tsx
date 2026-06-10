import { useEffect, useState } from 'react';
import { Sun, Moon, ArrowLeft, Award, Compass, Shield } from 'lucide-react';
import API_BASE_URL from '../config';
import './SubPages.css';

type PageProps = {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
};

// Simplified subpage header
function SubPageHeader({ theme, onThemeToggle }: PageProps) {
  return (
    <header className="subpage-header">
      <div className="container subheader-wrap">
        <a href="/" className="logo-link">
          <img className="logo-mark" src="/Velo Logo Single.png" alt="Velo Realty" style={{ height: '36px' }} />
          <span className="logo-text">VELO REALTY</span>
        </a>
        <div className="subheader-actions">
          <a href="/" className="btn btn-ghost subpage-back-home">
            <ArrowLeft size={16} /> Back to Home
          </a>
          <button
            className="btn theme-toggle-btn icon-btn"
            onClick={onThemeToggle}
            type="button"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

// Helper to get real content from Website Changesss.docx for the 4 blogs
export function getBlogContent(title: string) {
  const normTitle = title.toLowerCase();
  
  if (normTitle.includes('areas to invest') || normTitle.includes('best areas')) {
    return (
      <div className="article-rich-text">
        <p style={{ fontSize: '1.15rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Hyderabad continues to be one of India's fastest-growing real estate markets, attracting homebuyers and investors from across the country. With strong infrastructure development, expanding IT corridors, and increasing demand for quality housing, the city offers several high-potential investment destinations.
        </p>
        <h2>Kokapet — The Premium Hotspot</h2>
        <p>
          Kokapet has emerged as a premium real estate hotspot due to its proximity to the Financial District, Outer Ring Road, and major commercial hubs. The area is witnessing significant luxury residential development, making it a preferred choice for investors seeking long-term appreciation.
        </p>
        <h2>Tellapur — Planned Infrastructure & Growth</h2>
        <p>
          Tellapur has gained attention for its planned infrastructure, excellent connectivity, and growing residential demand. The area offers a balanced mix of affordability and future growth potential, making it suitable for both end-users and investors.
        </p>
        <h2>Gachibowli — The Established IT Hub</h2>
        <p>
          Gachibowli remains one of Hyderabad's most established locations, supported by major IT companies, educational institutions, and social infrastructure. Properties in this area continue to generate strong rental demand and capital appreciation.
        </p>
        <h2>Financial District & Narsingi</h2>
        <p>
          Financial District and Narsingi are also experiencing rapid growth due to corporate expansion, premium residential projects, and improved connectivity.
        </p>
        <blockquote>
          "Choosing locations backed by infrastructure growth, employment opportunities, and reputed developers remains the key to long-term success."
        </blockquote>
      </div>
    );
  }

  if (normTitle.includes('upcoming luxury') || normTitle.includes('luxury projects')) {
    return (
      <div className="article-rich-text">
        <p style={{ fontSize: '1.15rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Hyderabad's luxury real estate segment is entering an exciting phase with several premium residential developments scheduled for launch in 2026. The growing demand from high-net-worth individuals, NRIs, and professionals has encouraged leading developers to introduce world-class communities featuring modern architecture and lifestyle amenities.
        </p>
        <h2>Luxury Gated Villa Communities</h2>
        <p>
          Luxury villa communities in areas such as Tellapur, Mokila, Kollur, and Shankarpally are attracting significant interest due to their spacious layouts, privacy, and premium lifestyle offerings. These projects often include clubhouses, landscaped gardens, sports facilities, wellness centers, and advanced security systems.
        </p>
        <h2>High-Rise Ultra-Luxury Developments</h2>
        <p>
          High-rise luxury developments in Kokapet, Financial District, and Gachibowli are redefining urban living by offering breathtaking views, smart home features, concierge services, and premium amenities designed for modern lifestyles.
        </p>
        <h2>Pre-Launch Investment Benefits</h2>
        <p>
          Investing during the pre-launch stage can provide several advantages, including preferential pricing, flexible payment plans, and higher appreciation potential before project completion.
        </p>
        <blockquote>
          "As Hyderabad continues to attract global businesses and investments, luxury residential projects are expected to remain one of the most sought-after segments. Buyers who enter early benefit from both lifestyle advantages and value appreciation."
        </blockquote>
      </div>
    );
  }

  if (normTitle.includes('investment tips') || normTitle.includes('tips for modern')) {
    return (
      <div className="article-rich-text">
        <p style={{ fontSize: '1.15rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Real estate remains one of the most reliable wealth-building assets when approached with the right strategy. Successful investors focus not only on current market conditions but also on long-term growth potential and risk management.
        </p>
        <h2>1. Strategic Location Selection</h2>
        <p>
          The first step is choosing the right location. Areas with strong infrastructure development, employment opportunities, and future government investments typically experience higher appreciation over time.
        </p>
        <h2>2. Developer Credibility & Quality</h2>
        <p>
          Investors should also evaluate the credibility of the developer. Projects developed by reputed builders often offer better construction quality, timely delivery, and stronger resale value.
        </p>
        <h2>3. Optimal Buying Stage</h2>
        <p>
          Another important factor is purchasing at the right stage. Pre-launch and early-stage projects frequently offer attractive pricing and significant appreciation potential before possession.
        </p>
        <h2>4. Portfolio Diversification</h2>
        <p>
          Diversification is equally important. Investors should consider balancing their portfolio between residential properties, luxury developments, and income-generating assets based on their financial goals.
        </p>
        <h2>5. Connectivity & Rental Demand</h2>
        <p>
          It is also advisable to assess rental demand, connectivity, social infrastructure, and future growth plans before making a purchase decision.
        </p>
        <blockquote>
          "Focus on long-term wealth creation rather than short-term market fluctuations. A well-researched property in a high-growth location can generate substantial returns while providing asset security."
        </blockquote>
      </div>
    );
  }

  if (normTitle.includes('villa vs apartment') || normTitle.includes('which is the better')) {
    return (
      <div className="article-rich-text">
        <p style={{ fontSize: '1.15rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          One of the most common questions among homebuyers is whether to invest in a villa or an apartment. Both options offer unique advantages, and the right choice depends on lifestyle preferences, budget, and long-term objectives.
        </p>
        <h2>Villas: Privacy, Space & Independence</h2>
        <p>
          Villas provide greater privacy, larger living spaces, independent ownership, and exclusive outdoor areas. They are particularly attractive for families seeking a premium lifestyle and long-term appreciation. Villas often offer better land value appreciation, as land remains a limited and valuable asset.
        </p>
        <h2>Apartments: Convenience, Security & Amenities</h2>
        <p>
          Apartments, on the other hand, provide convenience, security, and easier maintenance. Modern apartment communities feature amenities such as clubhouses, swimming pools, fitness centers, and dedicated maintenance teams, making them ideal for busy professionals and urban lifestyles.
        </p>
        <h2>Rental Demand & Budget Considerations</h2>
        <p>
          From an investment perspective, apartments generally generate stronger rental demand due to their affordability and accessibility. Villas typically appeal to buyers focused on luxury living and long-term capital appreciation. Budget also plays a significant role. Apartments require lower initial investment compared to luxury villas, making them suitable for first-time homebuyers.
        </p>
        <blockquote>
          "Ultimately, the decision depends on individual priorities. Buyers seeking privacy, exclusivity, and spacious living may prefer villas, while those prioritizing convenience, community living, and ease of maintenance may find apartments a better fit."
        </blockquote>
      </div>
    );
  }

  // Fallback
  return (
    <div className="article-rich-text">
      <h2>1. Executive Summary & Market Drivers</h2>
      <p>
        Hyderabad's real estate ecosystem has observed a record-setting surge in capital inflows, particularly driven by rapid commercial expansion in the West Corridor (Neopolis, Kokapet, and Financial District). Investors are increasingly targeting structured pre-launch and off-plan high-rises to lock in pricing buffers prior to occupancy.
      </p>
    </div>
  );
}

// Standalone Blog Detail Page
export function BlogDetailPage({ theme, onThemeToggle }: PageProps) {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title') || 'Real Estate Market Insights';
  const description = params.get('desc') || 'Research-driven intelligence for the modern investor.';

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          message: `User submitted contact request from the dedicated blog page: "${title}"`,
          property_id: null
        })
      });

      if (res.ok) {
        setSubmitStatus('success');
        setLeadName('');
        setLeadEmail('');
        setLeadPhone('');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page subpage-container" data-theme={theme}>
      <SubPageHeader theme={theme} onThemeToggle={onThemeToggle} />
      <main className="subpage-main-content">
        <article className="blog-article-wrap">
          <div className="container">
            <header className="article-header">
              <span className="article-tag">Market Advisory & Guides</span>
              <h1>{title}</h1>
              <p className="article-lead">{description}</p>
              <div className="article-meta">
                <span>By <strong>Velo Realty Advisory Desk</strong></span>
                <span className="meta-divider">•</span>
                <span>Updated June 2026</span>
              </div>
            </header>

            <div className="article-grid">
              <div className="article-body-column">
                <div className="article-cover-wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200" 
                    alt="Premium Real Estate Developments" 
                    className="article-cover-img"
                  />
                </div>

                {getBlogContent(title)}
              </div>

              <aside className="article-sidebar">
                <div className="advisory-card-widget">
                  <h3>Get Expert Advisory</h3>
                  <p>Discuss your investment objectives and receive a curated portfolio matching your criteria.</p>
                  
                  {submitStatus === 'success' ? (
                    <div className="sidebar-success">
                      <div className="success-icon">✓</div>
                      <h4>Request Submitted!</h4>
                      <p>A Senior Advisor will reach out to you shortly via phone or email.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="sidebar-form">
                      <div className="form-field">
                        <label htmlFor="lead-name">Name</label>
                        <input
                          id="lead-name"
                          type="text"
                          placeholder="Your full name"
                          required
                          value={leadName}
                          onChange={e => setLeadName(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="lead-email">Email</label>
                        <input
                          id="lead-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={leadEmail}
                          onChange={e => setLeadEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="lead-phone">Contact Number</label>
                        <input
                          id="lead-phone"
                          type="tel"
                          placeholder="Phone number"
                          required
                          value={leadPhone}
                          onChange={e => setLeadPhone(e.target.value)}
                        />
                      </div>
                      {submitStatus === 'error' && (
                        <p className="error-text">Failed to submit. Please try again.</p>
                      )}
                      <button className="btn btn-primary sidebar-btn" type="submit" disabled={submitStatus === 'submitting'}>
                        {submitStatus === 'submitting' ? 'Submitting...' : 'Request Consultation'}
                      </button>
                    </form>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>
      <footer className="subpage-footer">
        <div className="container">
          <p>© Velo Realty Pvt Ltd 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Standalone "Our Story" Page
export function AboutStoryPage({ theme, onThemeToggle }: PageProps) {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch team members from API
    fetch(`${API_BASE_URL}/api/team`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeamMembers([...data].sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id)));
        }
      })
      .catch((err) => console.error("Failed to load team inside subpage:", err));
  }, []);

  const ceo = teamMembers[0];
  const advisoryTeam = teamMembers.slice(1);

  return (
    <div className="page subpage-container" data-theme={theme}>
      <SubPageHeader theme={theme} onThemeToggle={onThemeToggle} />
      
      <main className="subpage-main-content">
        {/* Section 1: About the Company */}
        <section className="story-hero-section">
          <div className="container">
            <span className="eyebrow">CORPORATE ANATOMY</span>
            <h1>Our Story</h1>
            <p className="story-intro-text">
              Velo Realty was established with a singular focus: to accelerate the pace of institutional-grade real estate transactions in Hyderabad while introducing absolute transparency and data-backed intelligence.
            </p>
            
            <div className="story-pillars-grid">
              <div className="pillar-card">
                <Award className="pillar-icon" />
                <h3>Elite Quality</h3>
                <p>We curate only premium properties from trusted, A-list developers to secure capital appreciate potential.</p>
              </div>
              <div className="pillar-card">
                <Compass className="pillar-icon" />
                <h3>Strategic Placement</h3>
                <p>Specializing in the West, East, North, and South growth corridors where future value is concentrated.</p>
              </div>
              <div className="pillar-card">
                <Shield className="pillar-icon" />
                <h3>Absolute Trust</h3>
                <p>Verified listings, legal checklists, and personalized transactional support throughout the client journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: CEO Message */}
        <section className="ceo-message-section alt-bg">
          <div className="container message-grid">
            <div className="message-image-wrapper">
              <img 
                src={ceo?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600"} 
                alt={ceo?.name || "CEO of Velo Realty"} 
                className="ceo-photo"
              />
              <div className="ceo-badge">FOUNDER & CEO</div>
            </div>
            <div className="message-content-wrapper">
              <span className="message-eyebrow">LEADERSHIP STATEMENT</span>
              <h2>Message from the CEO</h2>
              <div className="message-quote">
                <p>
                  "At Velo Realty, we recognize that acquiring real estate is more than a transaction—it is the creation of generational wealth. Our mission is to bridge the intelligence gap in the Hyderabad market, providing our clients with the tools, advice, and transaction speeds necessary to make sound, high-yield moves in real estate."
                </p>
              </div>
              <div className="ceo-signature">
                <h4>{ceo?.name || "Param Joga"}</h4>
                <p>{ceo?.role || "Founder & Managing Director"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: About the Team */}
        <section className="story-team-section">
          <div className="container">
            <div className="section-head center">
              <div>
                <p className="eyebrow">THE ADVISORY FORCE</p>
                <h2>Meet the Advisory Team</h2>
                <p className="section-subtitle">A collective of professionals committed to transparency and wealth curation.</p>
              </div>
            </div>

            <div className="story-team-grid">
              {advisoryTeam.map((member) => (
                <div key={member.id} className="team-card-v3 static-card">
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
        </section>
      </main>

      <footer className="subpage-footer">
        <div className="container">
          <p>© Velo Realty Pvt Ltd 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Standalone Contact Agent Page
export function ContactAgentPage({ theme, onThemeToggle, properties }: PageProps & { properties: any[] }) {
  const params = new URLSearchParams(window.location.search);
  const propertyId = params.get('property_id') ? parseInt(params.get('property_id') || '') : null;
  const selectedProj = propertyId !== null ? properties.find(p => p.id === propertyId) : null;

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail || 'no-email@velo.com',
          phone: leadPhone,
          message: `Inquiry via standalone Contact Agent page for project: "${selectedProj ? selectedProj.title : 'General Inquiry'}" developed by "${selectedProj ? selectedProj.developer : 'Velo Partner'}"`,
          property_id: propertyId
        })
      });

      if (res.ok) {
        setSubmitStatus('success');
        setLeadName('');
        setLeadEmail('');
        setLeadPhone('');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page subpage-container" data-theme={theme}>
      <SubPageHeader theme={theme} onThemeToggle={onThemeToggle} />
      <main className="subpage-main-content contact-agent-subpage">
        <div className="container compact-container" style={{ maxWidth: '640px', marginInline: 'auto' }}>
          <div className="contact-card-glass">
            
            {/* If a property details are present, show a premium card at the top */}
            {selectedProj ? (
              <div className="contact-property-banner">
                <img src={selectedProj.image} alt={selectedProj.title} className="banner-img" />
                <div className="banner-overlay">
                  <span className="banner-dev">{selectedProj.developer}</span>
                  <h2>{selectedProj.title}</h2>
                  <p>{selectedProj.location} Corridor · {selectedProj.community}</p>
                </div>
              </div>
            ) : (
              <div className="contact-general-banner">
                <h2>Contact Velo Agent</h2>
                <p>Discuss your investment objectives with our senior advisory desk.</p>
              </div>
            )}

            <div className="contact-form-wrapper" style={{ padding: '2rem' }}>
              {submitStatus === 'success' ? (
                <div className="form-success-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div className="success-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✓</div>
                  <h3 style={{ fontFamily: "'EB Garamond Custom', serif", fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>Request Submitted!</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.5' }}>A senior advisor will contact you shortly to share configuration pricing and brochures.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="premium-subpage-form">
                  <div className="subpage-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <label htmlFor="agent-lead-name" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>Full Name</label>
                    <input
                      id="agent-lead-name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div className="subpage-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <label htmlFor="agent-lead-phone" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>Contact Number</label>
                    <input
                      id="agent-lead-phone"
                      type="tel"
                      placeholder="+91 Contact Number"
                      required
                      value={leadPhone}
                      onChange={e => setLeadPhone(e.target.value)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div className="subpage-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <label htmlFor="agent-lead-email" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>Email Address</label>
                    <input
                      id="agent-lead-email"
                      type="email"
                      placeholder="name@domain.com"
                      required
                      value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="error-message" style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>Failed to submit request. Please try again.</p>
                  )}

                  <button className="btn btn-primary submit-btn" type="submit" disabled={submitStatus === 'submitting'} style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                    {submitStatus === 'submitting' ? 'Connecting to Agent...' : 'Contact Velo Agent Now'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
      <footer className="subpage-footer">
        <div className="container">
          <p>© Velo Realty Pvt Ltd 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
