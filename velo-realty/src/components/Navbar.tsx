type NavbarProps = {
  favoritesCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
};

export function Navbar({ favoritesCount, theme, onThemeToggle }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="container nav-wrap">
        <div className="nav-pill">
          <nav>
            <a className="nav-link-with-caret" href="#products">
              Products
              <span aria-hidden="true">⌄</span>
            </a>
            <a className="nav-link-with-caret" href="#customers">
              Customers
              <span aria-hidden="true">⌄</span>
            </a>
            <a href="#careers">Careers</a>
          </nav>
          <a className="logo-link" href="#" aria-label="VELO Realty home">
            <img
              className="logo-mark"
              src="/Image%20(3).svg"
              alt="VELO Realty"
            />
          </a>
          <div className="nav-actions">
            <button className="btn theme-toggle-btn" onClick={onThemeToggle} type="button" aria-label="Toggle theme">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a className="btn btn-ghost" href="#contact">
              Sign in
            </a>
            <a className="btn btn-primary nav-demo" href="#contact">
              See a demo
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
  );
}
