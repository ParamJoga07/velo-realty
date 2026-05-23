import { useState } from 'react'
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
          <div className="mobile-swipe-wrap" style={{ marginBottom: '4rem' }}>
            <div className={viewMode === 'grid' ? 'property-grid mobile-swipe-grid' : 'property-grid list mobile-swipe-grid'}>
            {featuredProjects.map((item) => (
              <article key={`feat-${item.id}`} className="property-card interactive-card" onClick={() => setSelectedProperty(item)}>
                <div className="card-image">
                  <img src={item.image} alt={item.title} className="property-bg-image" loading="lazy" />
                  <div className="card-luxury-overlay">
                    <div className="card-luxury-header">
                      <span className="badge-premium">{item.status || 'Featured'}</span>
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
        )}

        {/* SECTION 2: FILTERED / ALL LISTINGS */}
        <div className="section-head" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3rem' }}>
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
