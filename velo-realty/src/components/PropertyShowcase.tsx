import { useState } from 'react'
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
}

export function PropertyShowcase({
  properties,
  favorites,
  onToggleFavorite,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}: PropertyShowcaseProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

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
          {properties.length === 0 && <p className="empty-state">No properties match this filter yet.</p>}
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
                      <p className="card-luxury-loc">{item.location} Corridor</p>
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

      {/* 3D Flipping Modal */}
      {selectedProperty && (
        <div className="property-modal-overlay" onClick={() => setSelectedProperty(null)}>
          <div className="property-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProperty(null)} aria-label="Close modal">✕</button>
            <div className="modal-image-container">
              <img src={selectedProperty.image} alt={selectedProperty.title} />
              <span className="badge">{selectedProperty.status}</span>
              <span className="price-chip">{selectedProperty.price}</span>
            </div>
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedProperty.title}</h2>
                <p>{selectedProperty.location} · {selectedProperty.community}</p>
              </div>
              <div className="modal-meta meta">
                <span>{selectedProperty.beds} Beds</span>
                <span>{selectedProperty.baths} Baths</span>
                <span>{selectedProperty.area} sq.ft</span>
              </div>
              <div className="modal-details">
                <p><strong>Developer:</strong> {selectedProperty.developer}</p>
                <p><strong>Type:</strong> {selectedProperty.type}</p>
                <p><strong>Handover:</strong> {selectedProperty.handover}</p>
                <p><strong>Listing:</strong> {selectedProperty.listingType}</p>
              </div>
              <div className="modal-description">
                <p>{selectedProperty.description}</p>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" type="button">Contact Agent</button>
                <button 
                  className="btn btn-ghost" 
                  type="button" 
                  onClick={() => onToggleFavorite(selectedProperty.id)}
                >
                  {favorites.has(selectedProperty.id) ? '♥ Saved' : '♡ Save Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
