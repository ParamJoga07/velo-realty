import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Menu, X, Search, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../config';

type Community = { name: string; };

type NavbarProps = {
  favoritesCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onFilterSelect?: (label: string) => void;
  dbCorridors?: Community[];
  properties?: any[];
  onDeveloperClick?: (name: string) => void;
  setSelectedProperty?: (prop: any | null) => void;
  setLocation?: (value: string) => void;
  onCompareClick?: () => void;
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
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              role="menuitem"
              onClick={(e) => {
                if (item.isExternal) {
                  setOpen(false);
                  onClose();
                  return;
                }
                e.preventDefault();
                setOpen(false);
                onClose();
                if (onFilterSelect && (item.href === '#properties' || item.href === '#our-properties')) {
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

export function Navbar({ 
  favoritesCount, 
  theme, 
  onThemeToggle, 
  onFilterSelect, 
  dbCorridors = [],
  properties = [],
  onDeveloperClick,
  setSelectedProperty,
  setLocation,
  onCompareClick
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroupLabel, setActiveGroupLabel] = useState<string | null>(null);

  // Mobile search overlay states
  const [searchOpen, setSearchOpen] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!mobileOpen) {
      setActiveGroupLabel(null);
    }
  }, [mobileOpen]);

  // Autocomplete fetch for mobile search
  useEffect(() => {
    if (!typedQuery || typedQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(() => {
      setSearching(true);
      fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(typedQuery)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Search failed');
          return res.json();
        })
        .then((data) => {
          setSearchResults(data);
          setSearching(false);
        })
        .catch((err) => {
          console.error(err);
          setSearching(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [typedQuery]);

  const handleSuggestionClick = (type: 'developer' | 'project' | 'property' | 'corridor', item: any) => {
    setSearchOpen(false);
    setTypedQuery('');
    setSearchResults(null);
    
    if (type === 'developer') {
      if (onDeveloperClick) onDeveloperClick(item.name);
    } else if (type === 'project' || type === 'property') {
      const matched = properties.find(p => p.id === item.id);
      if (matched && setSelectedProperty) {
        setSelectedProperty(matched);
      }
    } else if (type === 'corridor') {
      if (setLocation) setLocation(item.name);
      const el = document.getElementById('our-properties');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleItemClick = (item: NavItem) => {
    if (onFilterSelect && (item.href === '#properties' || item.href === '#our-properties')) {
      onFilterSelect(item.label);
    }
    scrollToSection(item.href);
    setMobileOpen(false);
  };

  const NAV_GROUPS: NavGroup[] = [
    {
      label: 'Properties',
      href: '#our-properties',
      items: [
        { label: 'Ready to Move in', href: '#our-properties' },
        { label: 'Under Construction', href: '#our-properties' },
        { label: 'Plot or Land', href: '#our-properties' },
        { label: 'Commercial', href: '#our-properties' },
        { label: 'Rentals', href: '#our-properties' },
        { label: 'Resale', href: '#our-properties' },
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
      items: dbCorridors.length > 0 ? dbCorridors.map(c => ({ label: c.name, href: '#our-properties' })) : [
        { label: 'North Corridor', href: '#our-properties' },
        { label: 'South Corridor', href: '#our-properties' },
        { label: 'East Corridor', href: '#our-properties' },
        { label: 'West Corridor', href: '#our-properties' },
      ],
    },
    {
      label: 'About Us',
      href: '#about',
      items: [
        { label: 'Our Story', href: '?view=about-story', isExternal: true },
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
            <button 
              type="button" 
              className="nav-compare-btn"
              onClick={onCompareClick}
            >
              Compare Projects
            </button>
          </nav>

          <style>{`
            .nav-compare-btn {
              background: none;
              border: none;
              color: var(--teal-500);
              font-weight: 700;
              font-size: 15px;
              cursor: pointer;
              display: flex;
              align-items: center;
              padding: 0.5rem 0.75rem;
              border-radius: 8px;
              transition: all 0.2s ease;
              border: 1px dashed rgba(0, 168, 150, 0.3);
            }
            .nav-compare-btn:hover {
              background: rgba(0, 168, 150, 0.08);
              border-color: var(--teal-500);
              transform: translateY(-1px);
            }
            .nav-mobile-compare-btn {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              padding: 1.25rem 2rem;
              background: none;
              border: none;
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              color: var(--teal-500) !important;
              font-weight: 700 !important;
              font-size: 1.1rem;
              text-align: left;
              cursor: pointer;
            }
            [data-theme='light'] .nav-mobile-compare-btn {
              border-bottom-color: rgba(0, 0, 0, 0.05);
            }
          `}</style>

          {/* ACTIONS */}
          <div className="nav-actions">
            <button
              className="btn icon-btn nav-search-btn"
              onClick={() => setSearchOpen(true)}
              type="button"
              aria-label="Search properties"
            >
              <Search size={18} />
            </button>

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
            {activeGroupLabel === null ? (
              // Level 1: Top-level groups
              <div className="nav-mobile-menu-list">
                {NAV_GROUPS.map((group) => (
                  <button
                    key={group.label}
                    type="button"
                    className="nav-mobile-menu-group-btn"
                    onClick={() => setActiveGroupLabel(group.label)}
                  >
                    <span>{group.label}</span>
                    <span className="nav-mobile-arrow">→</span>
                  </button>
                ))}

                <button
                  type="button"
                  className="nav-mobile-compare-btn"
                  onClick={() => {
                    closeMobile();
                    if (onCompareClick) onCompareClick();
                  }}
                >
                  <span>Compare Projects</span>
                  <span className="nav-mobile-arrow">→</span>
                </button>
                
                {/* Contact Us button inside the menu */}
                <div className="nav-mobile-contact-container">
                  <a
                    className="btn btn-primary nav-mobile-contact-btn"
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      closeMobile();
                      scrollToSection('#contact');
                    }}
                  >
                    Contact Us
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '8px' }}>
                      <path d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              // Level 2: Sub-items
              <div className="nav-mobile-menu-list">
                <button
                  type="button"
                  className="nav-mobile-back-btn"
                  onClick={() => setActiveGroupLabel(null)}
                >
                  ← Back to Menu
                </button>
                
                <h3 className="nav-mobile-group-title">{activeGroupLabel}</h3>
                
                <div className="nav-mobile-subitems">
                  {NAV_GROUPS.find(g => g.label === activeGroupLabel)?.items.map((item) => (
                    <a
                      key={item.label}
                      className="nav-mobile-item"
                      href={item.href}
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (item.isExternal) {
                          setMobileOpen(false);
                          return;
                        }
                        e.preventDefault();
                        handleItemClick(item);
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <span className="shortlist-pill floating" aria-live="polite">
          Shortlist {favoritesCount}
        </span>

        {/* Mobile Autocomplete Search Overlay */}
        {searchOpen && (
          <div className="mobile-search-overlay" onClick={() => setSearchOpen(false)}>
            <div className="mobile-search-card" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-search-header">
                <button 
                  className="mobile-search-close-btn" 
                  onClick={() => {
                    setSearchOpen(false);
                    setTypedQuery('');
                    setSearchResults(null);
                  }}
                  type="button"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="mobile-search-input-wrap">
                  <input
                    type="text"
                    placeholder="Search developers, projects, locations..."
                    value={typedQuery}
                    onChange={(e) => setTypedQuery(e.target.value)}
                    autoFocus
                  />
                  {typedQuery && (
                    <button 
                      className="mobile-search-clear" 
                      onClick={() => setTypedQuery('')}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="mobile-search-body">
                {searching && (
                  <div className="mobile-search-loading">Searching...</div>
                )}
                
                {searchResults && (
                  <div className="mobile-search-suggestions">
                    {/* Developers Group */}
                    {searchResults.developers && searchResults.developers.length > 0 && (
                      <div className="mobile-suggestions-group">
                        <div className="mobile-group-title">Developers</div>
                        {searchResults.developers.map((d: any) => (
                          <button
                            key={`ms-dev-${d.id}`}
                            className="mobile-suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('developer', d)}
                          >
                            <span className="item-title">{d.name}</span>
                            <span className="item-action">Portfolio →</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Projects Group */}
                    {searchResults.projects && searchResults.projects.length > 0 && (
                      <div className="mobile-suggestions-group">
                        <div className="mobile-group-title">Projects</div>
                        {searchResults.projects.map((p: any) => (
                          <button
                            key={`ms-proj-${p.id}`}
                            className="mobile-suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('project', p)}
                          >
                            <span className="item-title">{p.name}</span>
                            {p.price && <span className="item-price">{p.price}</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Properties Group */}
                    {searchResults.properties && searchResults.properties.length > 0 && (
                      <div className="mobile-suggestions-group">
                        <div className="mobile-group-title">Properties</div>
                        {searchResults.properties.map((p: any) => (
                          <button
                            key={`ms-prop-${p.id}`}
                            className="mobile-suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('property', p)}
                          >
                            <span className="item-title">{p.title}</span>
                            {p.price && <span className="item-price">{p.price}</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Corridors Group */}
                    {searchResults.corridors && searchResults.corridors.length > 0 && (
                      <div className="mobile-suggestions-group">
                        <div className="mobile-group-title">Corridors</div>
                        {searchResults.corridors.map((c: any) => (
                          <button
                            key={`ms-corr-${c.id}`}
                            className="mobile-suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('corridor', c)}
                          >
                            <span className="item-title">{c.name}</span>
                            <span className="item-action">Filter →</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {(!searchResults.developers || searchResults.developers.length === 0) &&
                     (!searchResults.projects || searchResults.projects.length === 0) &&
                     (!searchResults.properties || searchResults.properties.length === 0) &&
                     (!searchResults.corridors || searchResults.corridors.length === 0) && (
                      <div className="mobile-search-no-results">
                        No results found for "{typedQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
