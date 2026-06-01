import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Property } from '../types'

type ViewMode = 'grid' | 'list'
type SortBy = 'featured' | 'price-asc' | 'price-desc' | 'handover'

type PropertyShowcaseProps = {
  properties: Property[]
  featuredProjects: Property[] // directly from starred DB projects
  favorites: Set<number>
  onToggleFavorite: (propertyId: number) => void
  viewMode: ViewMode
  setViewMode: (value: ViewMode) => void
  sortBy: SortBy
  setSortBy: (value: SortBy) => void
  setSelectedProperty: (prop: Property | null) => void;
  onDeveloperClick: (name: string) => void;
  navFilter: string | null;
  emptyStateMessage?: string;
}

export function PropertyShowcase({
  properties,
  featuredProjects,
  favorites,
  onToggleFavorite,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  setSelectedProperty,
  onDeveloperClick,
  navFilter,
  emptyStateMessage,
}: PropertyShowcaseProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const maxIndex = featuredProjects.length - 1;

  // Auto-play sliding: every 3s is a sweet spot for cinematic rotation
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  // Reset index if featuredProjects length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [featuredProjects.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Set the default visible limit to 6 (2 rows of 3 on desktop)
  const visibleLimit = 6;
  const showButton = properties.length > visibleLimit;
  const visibleProperties = expanded ? properties : properties.slice(0, visibleLimit);

  return (
    <section id="properties" className="section" style={{ paddingTop: '5rem' }}>
      <div className="container">
        
        {/* SECTION 1: FEATURED PROJECTS (Always directly from starred DB projects) */}
        <div className="section-head" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: '"EB Garamond Custom", serif', fontWeight: 800 }}>Featured Projects</h2>
            <p className="section-subtitle">Discover high-intent opportunities selected by our advisors.</p>
          </div>
        </div>

        {featuredProjects.length === 0 ? (
          <p className="empty-state" style={{ marginBottom: '4rem' }}>No featured projects currently starred.</p>
        ) : (
          <div 
            className="featured-cinematic-carousel"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <style>{`
              .featured-cinematic-carousel {
                position: relative;
                width: 100%;
                height: 480px;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                margin-bottom: 4rem;
                background: #0a1824;
                border: 1px solid rgba(255, 255, 255, 0.08);
              }
              [data-theme='light'] .featured-cinematic-carousel {
                box-shadow: 0 20px 40px rgba(31, 57, 80, 0.12);
                border-color: rgba(0, 0, 0, 0.05);
              }
              .featured-slides-container {
                position: relative;
                width: 100%;
                height: 100%;
              }
              .featured-slide {
                position: absolute;
                inset: 0;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
                cursor: pointer;
              }
              .featured-slide.active {
                opacity: 1;
                visibility: visible;
              }
              .featured-slide-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 6s ease-out;
              }
              .featured-slide.active .featured-slide-img {
                transform: scale(1.08);
              }
              .featured-slide-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                  90deg,
                  rgba(10, 24, 36, 0.95) 0%,
                  rgba(10, 24, 36, 0.65) 50%,
                  transparent 100%
                );
                display: flex;
                align-items: center;
                padding: 3rem;
              }
              @media (max-width: 768px) {
                .featured-slide-overlay {
                  background: linear-gradient(
                    0deg,
                    rgba(10, 24, 36, 0.95) 0%,
                    rgba(10, 24, 36, 0.75) 70%,
                    transparent 100%
                  );
                  align-items: flex-end;
                  padding: 1.5rem;
                }
              }
              .featured-slide-content {
                max-width: 540px;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                z-index: 5;
              }
              .featured-badge {
                display: inline-flex;
                align-self: flex-start;
                background: var(--teal-500);
                color: #ffffff;
                padding: 0.4rem 1rem;
                border-radius: 50px;
                font-size: 0.75rem;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                box-shadow: 0 4px 12px rgba(0, 168, 150, 0.3);
              }
              .featured-title {
                color: #ffffff;
                font-family: 'EB Garamond Custom', serif;
                font-size: 2.5rem;
                font-weight: 800;
                line-height: 1.15;
                margin: 0;
              }
              .featured-desc {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1rem;
                line-height: 1.5;
                margin: 0;
              }
              .featured-meta-row {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                align-items: center;
                margin-top: 0.25rem;
              }
              .featured-meta-item {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.85rem;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.08);
                padding: 0.25rem 0.75rem;
                border-radius: 6px;
              }
              .featured-price-cta {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                margin-top: 0.5rem;
              }
              .featured-price {
                font-size: 1.8rem;
                font-weight: 700;
                color: #ffffff;
                font-family: 'Inter', sans-serif;
              }
              .featured-cta-btn {
                background: transparent;
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0.7rem 1.5rem;
                border-radius: 12px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
              }
              .featured-cta-btn:hover {
                background: #ffffff;
                color: var(--navy-900);
                border-color: #ffffff;
                box-shadow: 0 8px 24px rgba(255, 255, 255, 0.25);
              }
              .feat-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(10, 24, 36, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
                backdrop-filter: blur(4px);
                opacity: 0;
              }
              .featured-cinematic-carousel:hover .feat-arrow {
                opacity: 1;
              }
              .feat-arrow:hover {
                background: var(--teal-500);
                border-color: var(--teal-500);
                box-shadow: 0 8px 20px rgba(0, 168, 150, 0.3);
              }
              .feat-arrow.prev {
                left: 1.5rem;
              }
              .feat-arrow.next {
                right: 1.5rem;
              }
              .feat-dots {
                position: absolute;
                bottom: 1.5rem;
                right: 3rem;
                display: flex;
                gap: 0.5rem;
                z-index: 10;
              }
              .feat-dot {
                width: 20px;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
              }
              .feat-dot.active {
                background: var(--teal-500);
                width: 36px;
              }
              @media (max-width: 768px) {
                .featured-cinematic-carousel {
                  height: 380px;
                }
                .featured-desc {
                  display: none;
                }
                .feat-arrow {
                  display: none;
                }
                .feat-dots {
                  right: 50%;
                  transform: translateX(50%);
                  bottom: 1rem;
                }
              }
            `}</style>

            <div className="featured-slides-container">
              {featuredProjects.map((item, idx) => (
                <div 
                  key={`feat-${item.id}`} 
                  className={`featured-slide ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedProperty(item)}
                >
                  <img src={item.image} alt={item.title} className="featured-slide-img" />
                  <div className="featured-slide-overlay">
                    <div className="featured-slide-content">
                      <span className="featured-badge">{item.status || 'Featured'}</span>
                      <h3 className="featured-title">{item.title}</h3>
                      <p className="featured-desc">{item.description}</p>
                      
                      <div className="featured-meta-row">
                        <span className="featured-meta-item">{item.beds} BHK</span>
                        <span className="featured-meta-item">{item.area} SQFT</span>
                        <span className="featured-meta-item">{item.location} Corridor</span>
                        <span className="featured-meta-item">By {item.developer}</span>
                      </div>

                      <div className="featured-price-cta">
                        <span className="featured-price">{item.price}</span>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button className="featured-cta-btn" type="button">
                            Explore Details
                          </button>
                          <button
                            type="button"
                            className={favorites.has(item.id) ? 'feat-fav-btn active' : 'feat-fav-btn'}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(item.id);
                            }}
                            style={{
                              background: favorites.has(item.id) ? 'var(--teal-500)' : 'rgba(255, 255, 255, 0.1)',
                              border: 'none',
                              color: '#ffffff',
                              width: '44px',
                              height: '44px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '1.2rem',
                              lineHeight: 1
                            }}
                          >
                            {favorites.has(item.id) ? '♥' : '♡'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {featuredProjects.length > 1 && (
              <>
                <button 
                  className="feat-arrow prev" 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  aria-label="Previous Slide"
                  type="button"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  className="feat-arrow next" 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  aria-label="Next Slide"
                  type="button"
                >
                  <ChevronRight size={22} />
                </button>

                <div className="feat-dots">
                  {featuredProjects.map((_, idx) => (
                    <button
                      key={`feat-dot-${idx}`}
                      className={`feat-dot ${currentIndex === idx ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                      aria-label={`Go to slide ${idx + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* SECTION 2: FILTERED / ALL LISTINGS */}
        <div id="our-properties" className="section-head" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontFamily: '"EB Garamond Custom", serif', fontWeight: 800 }}>
              {navFilter ? `${navFilter} Listings` : 'Our Properties'}
            </h2>
            <p className="section-subtitle">
              {navFilter ? `Showing matching results for "${navFilter}"` : 'Browse our comprehensive real estate portfolio.'}
            </p>
          </div>
          <div className="listing-actions">
            <label>
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="handover">Handover: Soonest</option>
              </select>
            </label>
            <div className="view-toggle" role="group" aria-label="Listing view mode">
              <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                Grid
              </button>
              <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                List
              </button>
            </div>
          </div>
        </div>

        <p className="result-count">{properties.length} properties found</p>

        <div className="mobile-swipe-wrap">
          <div className={viewMode === 'grid' ? 'property-grid mobile-swipe-grid' : 'property-grid list mobile-swipe-grid'}>
          {properties.length === 0 && <p className="empty-state">{emptyStateMessage || 'No properties match this filter yet.'}</p>}
          {visibleProperties.map((item) => (
            <article key={`list-${item.id}`} className="property-card interactive-card" onClick={() => setSelectedProperty(item)}>
              <div className="card-image">
                <img src={item.image} alt={item.title} className="property-bg-image" loading="lazy" />
                <div className="card-luxury-overlay">
                  <div className="card-luxury-header">
                    <span className="badge-premium">{item.status}</span>
                    <button
                      type="button"
                      className={favorites.has(item.id) ? 'fav-btn active' : 'fav-btn'}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(item.id)
                      }}
                    >
                      {favorites.has(item.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  
                  <div className="card-luxury-content">
                    <div className="card-luxury-main">
                      <h3>{item.title}</h3>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px'}}>
                        <button 
                          className="corridor-link" 
                          onClick={(e) => { e.stopPropagation(); onDeveloperClick(item.location); }}
                        >
                          {item.location} Corridor →
                        </button>
                        <button 
                          className="developer-link" 
                          onClick={(e) => { e.stopPropagation(); onDeveloperClick(item.developer); }}
                        >
                          By {item.developer} →
                        </button>
                      </div>
                    </div>
                    <div className="card-luxury-footer">
                      <div className="luxury-meta-strip">
                        <span>{item.beds}B</span>
                        <span>{item.baths}B</span>
                        <span>{item.area}FT²</span>
                      </div>
                      <div className="luxury-price-tag">{item.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>

        {/* SHOW MORE / SHOW LESS BUTTONS */}
        {showButton && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setExpanded(!expanded)}
              style={{
                padding: '0.65rem 2rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '999px',
                background: 'var(--teal-500)',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(0, 168, 150, 0.25)',
                transition: 'all 0.25s ease'
              }}
            >
              {expanded ? 'Show Less ↑' : 'Show More ↓'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
