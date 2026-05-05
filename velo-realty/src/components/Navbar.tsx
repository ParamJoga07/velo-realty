import { Sun, Moon } from 'lucide-react';

type NavbarProps = {
  favoritesCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onSignInClick: () => void;
};

export function Navbar({ favoritesCount, theme, onThemeToggle, onSignInClick }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="container nav-wrap">
          
        <div className="nav-pill">
          <a className="logo-link" href="#" aria-label="Velo Realty home">
            <img className="logo-mark" src="/Velo Logo Single.png" alt="Velo Realty" />
          </a>
          <nav>
            <a href="#corridors">Corridors</a>
            <a href="#developers">Developers</a>
            <a href="#about">About</a>
          </nav>
        
          <div className="nav-actions">
            <button className="btn theme-toggle-btn icon-btn" onClick={onThemeToggle} type="button" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="btn btn-primary nav-demo" href="#contact">
              Contact Us
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="nav-demo-arrow"
              >
                <path
                  d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
        <span className="shortlist-pill floating" aria-live="polite">
          Shortlist {favoritesCount}
        </span>
      </div>
    </header>
  )
}
