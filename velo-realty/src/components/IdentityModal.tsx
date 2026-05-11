import React, { useState } from 'react';
import { X, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import './IdentityModal.css';

interface IdentityModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export function IdentityModal({ onClose, onSubmit }: IdentityModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation of slight delay for premium feel
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      // Auto close after showing success for a brief moment
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="identity-modal-overlay" onClick={onClose}>
      <div className={`identity-modal-content ${isSuccess ? 'success-mode' : ''}`} onClick={e => e.stopPropagation()}>
        {!isSuccess ? (
          <>
            <button className="id-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>

            <div className="id-modal-header">
              <div className="id-icon-badge">
                <ShieldCheck size={32} />
              </div>
              <h2>Secure Identification</h2>
              <p>Please identify yourself to save this property and receive exclusive corridor intelligence.</p>
            </div>

            <form className="id-form" onSubmit={handleSubmit}>
              <div className="id-input-group">
                <label htmlFor="name">Full Name</label>
                <div className="id-input-wrapper">
                  <User size={18} className="id-input-icon" />
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="id-input-group">
                <label htmlFor="email">Professional Email</label>
                <div className="id-input-wrapper">
                  <Mail size={18} className="id-input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. john@example.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="id-input-group">
                <label htmlFor="phone">Contact Number</label>
                <div className="id-input-wrapper">
                  <Phone size={18} className="id-input-icon" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="id-disclaimer">
                <p>Your privacy is absolute. We only use this to sync your portfolio across devices.</p>
              </div>

              <button type="submit" className="id-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Confirm Identity'}
              </button>
            </form>
          </>
        ) : (
          <div className="id-success-view">
            <div className="id-success-icon">
              <svg viewBox="0 0 52 52">
                <circle className="id-success-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="id-success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3>Identity Verified</h3>
            <p>Your session is now secure. Property saved to your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
