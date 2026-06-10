import { useState } from 'react';
import { getBlogContent } from './SubPages';
import API_BASE_URL from '../config';
import './BlogModal.css';

type BlogModalProps = {
  blog: {
    title: string;
    description: string;
  };
  onClose: () => void;
  theme: 'light' | 'dark';
};

export function BlogModal({ blog, onClose, theme }: BlogModalProps) {
  const { title, description } = blog;
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
          message: `User submitted contact request from the blog modal: "${title}"`,
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

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-window-shell" onClick={(e) => e.stopPropagation()} data-theme={theme}>
        <button className="blog-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        
        <div className="blog-modal-scroll-area">
          <article className="blog-article-wrap">
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
                        <label htmlFor="modal-blog-lead-name">Name</label>
                        <input
                          id="modal-blog-lead-name"
                          type="text"
                          placeholder="Your full name"
                          required
                          value={leadName}
                          onChange={e => setLeadName(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="modal-blog-lead-email">Email</label>
                        <input
                          id="modal-blog-lead-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={leadEmail}
                          onChange={e => setLeadEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label htmlFor="modal-blog-lead-phone">Contact Number</label>
                        <input
                          id="modal-blog-lead-phone"
                          type="tel"
                          placeholder="Phone number"
                          required
                          value={leadPhone}
                          onChange={e => setLeadPhone(e.target.value)}
                        />
                      </div>
                      {submitStatus === 'error' && (
                        <p className="error-text" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>Failed to submit. Please try again.</p>
                      )}
                      <button className="btn btn-primary sidebar-btn" type="submit" disabled={submitStatus === 'submitting'}>
                        {submitStatus === 'submitting' ? 'Submitting...' : 'Request Consultation'}
                      </button>
                    </form>
                  )}
                </div>
              </aside>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
