import './SocialSidebar.css';

export function SocialSidebar() {
  return (
    <div className="social-sidebar">
      <div className="social-sidebar-line top-line"></div>
      
      <a href="https://www.instagram.com/velorealty?igsh=b2xkZDNmYmdyeWpk" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
        <div className="social-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <span className="social-tooltip">Instagram</span>
      </a>

      <a href="mailto:contact@velorealty.com" className="social-link" aria-label="Gmail">
        <div className="social-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <span className="social-tooltip">Email</span>
      </a>

      <a href="#" onClick={(e) => e.preventDefault()} className="social-link" aria-label="Twitter">
        <div className="social-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        </div>
        <span className="social-tooltip">Coming Soon</span>
      </a>

      <div className="social-sidebar-line bottom-line"></div>
    </div>
  );
}
