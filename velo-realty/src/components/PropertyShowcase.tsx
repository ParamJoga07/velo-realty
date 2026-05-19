import type { Property } from '../types'

type ViewMode = 'grid' | 'list'
type SortBy = 'featured' | 'price-asc' | 'price-desc' | 'handover'

type PropertyShowcaseProps = {
  properties: Property[]
  favorites: Set<number>
  onToggleFavorite: (propertyId: number) => void
  viewMode: ViewMode
  setViewMode: (value: ViewMode) => void
  sortBy: SortBy
  setSortBy: (value: SortBy) => void
  setSelectedProperty: (prop: Property | null) => void;
  onDeveloperClick: (name: string) => void;
  emptyStateMessage?: string;
}

export function PropertyShowcase({
  properties,
  favorites,
  onToggleFavorite,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  setSelectedProperty,
  onDeveloperClick,
  emptyStateMessage,
}: PropertyShowcaseProps) {

  return (
    <section id="properties" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Featured Projects</h2>
            <p className="section-subtitle">Discover high-intent opportunities selected by our advisors.</p>
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
        <p className="result-count">{properties.length} curated properties</p>
        <div className={viewMode === 'grid' ? 'property-grid' : 'property-grid list'}>
          {properties.length === 0 && <p className="empty-state">{emptyStateMessage || 'No properties match this filter yet.'}</p>}
          {properties.map((item) => (
            <article key={item.id} className="property-card interactive-card" onClick={() => setSelectedProperty(item)}>
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

    </section>
  )
}
