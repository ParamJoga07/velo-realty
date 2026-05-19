import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Menu, X } from 'lucide-react';

type Community = { name: string; };

type NavbarProps = {
  favoritesCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onFilterSelect?: (label: string) => void;
  dbCorridors?: Community[];
};

type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

type NavGroup = {
  label: string;
  href?: string;
  items: NavItem[];
};

function scrollToSection(href: string) {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function DropdownGroup({ group, onClose, onFilterSelect }: { group: NavGroup; onClose: () => void; onFilterSelect?: (filter: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="nav-dropdown-group" ref={ref}>
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {group.label}
        <ChevronDown size={14} className={`nav-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="nav-dropdown-panel" role="menu">
          {group.items.map((item) => (
            <a
              key={item.label}
              className="nav-dropdown-item"
              href={item.href}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                onClose();
                if (onFilterSelect && item.href === '#properties') {
                  onFilterSelect(item.label);
                }
                scrollToSection(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar({ favoritesCount, theme, onThemeToggle, onFilterSelect, dbCorridors = [] }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (item: NavItem) => {
    if (onFilterSelect && item.href === '#properties') {
      onFilterSelect(item.label);
    }
    scrollToSection(item.href);
    setMobileOpen(false);
  };

  const NAV_GROUPS: NavGroup[] = [
    {
      label: 'Properties',
      href: '#properties',
      items: [
        { label: 'Ready to Move in', href: '#properties' },
        { label: 'Under Construction', href: '#properties' },
        { label: 'Plot or Land', href: '#properties' },
        { label: 'Commercial', href: '#properties' },
        { label: 'Rentals', href: '#properties' },
        { label: 'Resale', href: '#properties' },
      ],
    },
    {
      label: 'Services',
      href: '#services',
      items: [
        { label: 'EMI Calculator', href: '#services-ecosystem' },
        { label: 'Property Valuation', href: '#services' },
        { label: 'Refer & Earn', href: '#refer-earn' },
        { label: 'Home Loans', href: '#services' },
        { label: 'Interior Designing', href: '#services' },
      ],
    },
    {
      label: 'Corridors',
      href: '#corridors',
      items: dbCorridors.length > 0 ? dbCorridors.map(c => ({ label: c.name, href: '#properties' })) : [
        { label: 'North Corridor', href: '#properties' },
        { label: 'South Corridor', href: '#properties' },
        { label: 'East Corridor', href: '#properties' },
        { label: 'West Corridor', href: '#properties' },
      ],
    },
    {
      label: 'About Us',
      href: '#about',
      items: [
        { label: 'Our Story', href: '#about' },
        { label: 'The Team', href: '#team' },
        { label: 'Strategic Network', href: '#developers' },
        { label: 'Contact Us', href: '#contact' },
      ],
    },
  ];

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-wrap">
        <div className="nav-pill">
          {/* LOGO */}
          <a className="logo-link" href="#" aria-label="Velo Realty home">
            <img className="logo-mark" src="/Velo Logo Single.png" alt="Velo Realty" />
          </a>

          {/* DESKTOP NAV */}
          <nav className="nav-desktop" aria-label="Main navigation">
            {NAV_GROUPS.map((group) => (
              <DropdownGroup key={group.label} group={group} onClose={closeMobile} onFilterSelect={onFilterSelect} />
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="nav-actions">
            <button
              className="btn theme-toggle-btn icon-btn"
              onClick={onThemeToggle}
              type="button"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a className="btn btn-primary nav-demo" href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}>
              Contact Us
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="nav-demo-arrow">
                <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* HAMBURGER */}
            <button
              type="button"
              className="btn icon-btn nav-hamburger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div className="nav-mobile-panel">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="nav-mobile-group">
                <p className="nav-mobile-heading">{group.label}</p>
                {group.items.map((item) => (
                  <a
                    key={item.label}
                    className="nav-mobile-item"
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
            <div className="nav-mobile-footer">
              <a
                className="btn btn-primary"
                href="#contact"
                onClick={(e) => { e.preventDefault(); closeMobile(); scrollToSection('#contact'); }}
              >
                Contact Us →
              </a>
            </div>
          </div>
        )}

        <span className="shortlist-pill floating" aria-live="polite">
          Shortlist {favoritesCount}
        </span>
      </div>
    </header>
  );
}
