import { Shield } from 'lucide-react';

export function Footer({ onSignInClick }: { onSignInClick: () => void }) {
  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-watermark" aria-hidden="true">
          <img src="/Image%20(3).svg" alt="" />
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <img className="footer-logo" src="/Image%20(3).svg" alt="VELO Realty" />
            <p>Luxury. Speed. Trust.</p>
          </div>

          <div className="footer-links">
            <div>
              <a href="#contact">Contact Us</a>
              <a href="#blogs">Market Insights</a>
              <a href="#services">Investment Advisory</a>
            </div>
            <div>
              <a href="#properties">Buy Properties</a>
              <a href="#properties">Rent Properties</a>
              <a href="#properties">New Launches</a>
            </div>
            <div>
              <a href="#developers">Developers</a>
              <a href="#communities">Communities</a>
              <a href="#contact">WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-meta">
            <p>© Velo Realty Pvt Ltd 2026</p>
            <p>Info@velorealty.com · +91 7207214848</p>
          </div>
          <p className="footer-address">Divya Diamonds Buildings, 1st Floor, Kavuri Hills, Madhapur, Hyderabad, 500081</p>
          <button className="superadmin-link" onClick={onSignInClick} title="Security portal">
            <Shield size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

