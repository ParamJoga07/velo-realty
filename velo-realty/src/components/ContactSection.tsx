import React, { useState } from 'react';
import API_BASE_URL from '../config';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact error:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section cta">
      <div className="container cta-wrap">
        <div>
          <p className="eyebrow">Talk to an advisor</p>
          <h2>Book your consultation</h2>
          <p>Tell us your goal and we will match you with a specialist consultant.</p>
          {status === 'success' && <div className="success-msg">Thank you! Your enquiry has been received.</div>}
          {status === 'error' && <div className="error-msg">Something went wrong. Please try again.</div>}
        </div>
        <form className="lead-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input 
              type="text" 
              placeholder="Your name" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </label>
          <label>
            Phone
            <input 
              type="tel" 
              placeholder="+91" 
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </label>
          <label>
            Email
            <input 
              type="email" 
              placeholder="you@example.com" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </label>
          <label>
            Message
            <textarea 
              placeholder="Investment preference, community, budget..." 
              required
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </label>
          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Submitting...' : 'Submit enquiry'}
          </button>
        </form>
      </div>
    </section>
  )
}
