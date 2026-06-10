import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react'
import './SmartPropertyCare.css'

type SmartPropertyCareProps = {
  onConsultationClick: () => void
}

export function SmartPropertyCare({ onConsultationClick }: SmartPropertyCareProps) {
  const images = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="property-care" className="property-care-section">
      <div className="container care-container">
        <div className="care-grid">
          
          {/* TEXT SIDE */}
          <div className="care-text-side">
            <span className="care-badge">
              <Sparkles size={14} className="sparkle-icon" /> Exclusive Asset Management
            </span>
            <h2 className="care-title">Smart Property Care</h2>
            <p className="care-subtitle">
              We protect, maintain, and optimize your luxury residential assets in Hyderabad while you reap the passive rewards. From tenant vetting to automated rent collection and premium maintenance, our tech-enabled team handles it all.
            </p>

            <div className="care-features-list">
              <div className="care-feat-item">
                <div className="care-feat-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="care-feat-details">
                  <h4>Vetted Elite Tenants</h4>
                  <p>Comprehensive background and credit checks for high-caliber occupants.</p>
                </div>
              </div>

              <div className="care-feat-item">
                <div className="care-feat-icon">
                  <Clock size={20} />
                </div>
                <div className="care-feat-details">
                  <h4>24/7 On-Demand Maintenance</h4>
                  <p>Dedicated engineers on call to handle repairs with premium materials.</p>
                </div>
              </div>
            </div>

            <div className="care-actions">
              <button 
                type="button" 
                className="btn btn-care-primary" 
                onClick={onConsultationClick}
              >
                Get Free Consultation <ArrowRight size={18} />
              </button>
              <a href="#services-ecosystem" className="btn-care-secondary">
                Discover More Services
              </a>
            </div>
          </div>

          {/* IMAGE SLIDER SIDE */}
          <div className="care-graphic-side">
            <div className="care-slider-frame">
              <div className="care-slider-slides">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`care-slider-slide ${idx === activeSlide ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Asset Management ${idx + 1}`} className="care-slider-image" />
                    <div className="care-slider-overlay"></div>
                  </div>
                ))}
              </div>

              {/* Floating metrics badge over slider */}
              <div className="care-floating-badge top-right">
                <div className="badge-pulse"></div>
                <div className="badge-info">
                  <span>99.4%</span>
                  <p>Occupancy Rate</p>
                </div>
              </div>

              <div className="care-floating-badge bottom-left">
                <div className="badge-pulse blue"></div>
                <div className="badge-info">
                  <span>&lt; 2 hrs</span>
                  <p>Response Time</p>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="care-slider-dots">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`care-slider-dot ${idx === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
