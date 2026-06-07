import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, ArrowLeft, Search } from 'lucide-react'
import type { Property, CompareProjectMeta, CompareResponse } from '../types'
import API_BASE_URL from '../config'
import './CompareModal.css'

type CompareModalProps = {
  compareIds: number[]
  onClose: () => void
  onRemove: (id: number) => void
  onAdd: (id: number) => void
  properties: Property[] // all available properties to search and add
}

export function CompareModal({
  compareIds,
  onClose,
  onRemove,
  onAdd,
  properties
}: CompareModalProps) {
  const [data, setData] = useState<CompareResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track selected configurations/sizes for each project to calculate dynamic pricing
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})
  
  // Accordion open/collapse states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Pricing': true,
    'Overview': true,
    'General': false,
    'Location': false,
    'Material Specifications': false,
    'Amenities': false,
    'Configurations': false
  })

  // Selected tab highlights
  const [activeTab, setActiveTab] = useState<string>('Pricing')

  // Search inside empty comparison slots
  const [showSearchDropdown, setShowSearchDropdown] = useState<number | null>(null) // index of empty column slot (1, 2, or 3)
  const [searchQuery, setSearchQuery] = useState('')

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Fetch comparison data when comparison list changes
  useEffect(() => {
    if (compareIds.length === 0) {
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`${API_BASE_URL}/api/compare?ids=${compareIds.join(',')}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch comparison details')
        return res.json()
      })
      .then((payload: CompareResponse) => {
        setData(payload)
        
        // Initialize default sizes for each project
        const initialSizes: Record<number, string> = { ...selectedSizes }
        payload.projects.forEach((proj) => {
          if (!initialSizes[proj.id] && proj.sizes && proj.sizes.length > 0) {
            initialSizes[proj.id] = proj.sizes[0]
          }
        })
        setSelectedSizes(initialSizes)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Failed to load comparison data. Please try again.')
        setLoading(false)
      })
  }, [compareIds])

  // Scroll to selected category ref
  const scrollToCategory = (categoryName: string) => {
    setActiveTab(categoryName)
    // Expand category if it's collapsed
    setExpandedCategories((prev) => ({ ...prev, [categoryName]: true }))
    
    const element = categoryRefs.current[categoryName]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Toggle accordion expand/collapse
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }

  // Filter properties to display inside slot search input
  const searchedProperties = properties.filter((prop) => {
    if (compareIds.includes(prop.id)) return false // already in comparison
    const q = searchQuery.toLowerCase()
    return (
      prop.title.toLowerCase().includes(q) ||
      prop.developer.toLowerCase().includes(q) ||
      prop.location.toLowerCase().includes(q)
    )
  })

  // Dynamic price calculation based on selected sft size
  const calculateDynamicPrice = (proj: CompareProjectMeta): string => {
    const selectedSize = selectedSizes[proj.id]
    if (!selectedSize) return proj.price_range

    // Try to extract sft number, e.g. "1969 sft" -> 1969
    const sizeMatch = selectedSize.match(/(\d+)/)
    if (!sizeMatch) return proj.price_range

    const sizeNum = parseInt(sizeMatch[1])
    
    // Find base price value. We calculated it deterministic on the backend: 6000 + (id % 5) * 800
    // Or if price_start is present: price_start / 1800 sft
    let baseRate = 6000 + (proj.id % 5) * 800
    // Try to parse rate from prices return
    if (data) {
      const pricingCat = data.comparisons.find((c) => c.category === 'Pricing')
      if (pricingCat) {
        const basePriceRow = pricingCat.fields.find((f) => f.label === 'Base Price')
        if (basePriceRow) {
          const index = data.projects.findIndex((p) => p.id === proj.id)
          if (index !== -1) {
            const rawRate = basePriceRow.values[index]
            const rateMatch = rawRate.match(/(\d+)/)
            if (rateMatch) {
              baseRate = parseInt(rateMatch[1])
            }
          }
        }
      }
    }

    const calculatedValue = sizeNum * baseRate
    
    // Convert to Crores or Lakhs: e.g. 15752000 -> 1.58 Cr
    if (calculatedValue >= 10000000) {
      return `₹${(calculatedValue / 10000000).toFixed(2)} Cr`
    } else {
      return `₹${(calculatedValue / 100000).toFixed(0)} Lakh`
    }
  }

  // Categories list
  const categories = [
    'Pricing',
    'Overview',
    'General',
    'Location',
    'Material Specifications',
    'Amenities',
    'Configurations'
  ]

  // Render project header columns (up to 3 columns, fill empty ones with search/add slots)
  const renderHeaderColumns = () => {
    const cols = []
    const projectsCount = data ? data.projects.length : 0

    // Render actual projects
    if (data) {
      data.projects.forEach((proj) => {
        cols.push(
          <div key={`header-p-${proj.id}`} className={`compare-header-card ${proj.is_sponsored ? 'sponsored' : ''}`}>
            <div className="compare-header-card-top">
              {proj.is_sponsored && <span className="compare-sponsored-badge">Sponsored</span>}
              <button 
                className="compare-remove-card-btn" 
                onClick={() => onRemove(proj.id)}
                title="Remove from comparison"
              >
                <X size={16} />
              </button>
            </div>
            
            {proj.primary_image && (
              <div className="compare-card-image-wrap">
                <img src={proj.primary_image} alt={proj.name} className="compare-card-image" />
              </div>
            )}
            
            <div className="compare-card-dev-info">
              {proj.developer_logo ? (
                <div className="compare-card-logo-wrap">
                  <img src={proj.developer_logo} alt={proj.developer_name} className="compare-card-logo" />
                </div>
              ) : (
                <div className="compare-card-logo-wrap" style={{ background: '#1e293b', color: '#64748b', fontSize: '10px', fontWeight: 700 }}>
                  VELO
                </div>
              )}
              <div className="compare-card-dev-meta">
                <span className="compare-card-dev-name">{proj.developer_name}</span>
              </div>
            </div>

            <h3 className="compare-card-title" title={proj.name}>{proj.name}</h3>
            
            {/* Dynamic Price */}
            <div className="compare-card-price">
              {calculateDynamicPrice(proj)}
            </div>

            {/* Sizes selector dropdown */}
            {proj.sizes && proj.sizes.length > 0 && (
              <div className="compare-size-select-wrap">
                <select 
                  className="compare-size-select"
                  value={selectedSizes[proj.id] || proj.sizes[0]}
                  onChange={(e) => setSelectedSizes({ ...selectedSizes, [proj.id]: e.target.value })}
                >
                  {proj.sizes.map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="compare-select-chevron" />
              </div>
            )}
          </div>
        )
      })
    }

    // Fill remaining columns with empty slots (max 3 columns total)
    const emptySlotsNeeded = 3 - projectsCount
    for (let i = 0; i < emptySlotsNeeded; i++) {
      const slotIndex = projectsCount + i
      cols.push(
        <div key={`empty-slot-${slotIndex}`} className="autocomplete-search-wrapper">
          {showSearchDropdown === slotIndex ? (
            <div 
              className="compare-header-card" 
              style={{ 
                height: '100%', 
                minHeight: '160px', 
                justifyContent: 'flex-start',
                padding: '0.75rem',
                zIndex: 99
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem', width: '100%' }}>
                <Search size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="text" 
                  placeholder="Type to search property..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#fff',
                    padding: '0.2rem',
                    fontSize: '0.8rem',
                    width: '100%',
                    minHeight: 'auto'
                  }}
                />
                <button 
                  className="compare-remove-card-btn" 
                  onClick={() => { setShowSearchDropdown(null); setSearchQuery(''); }}
                  style={{ padding: 0 }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Autocomplete Suggestion List */}
              <div 
                style={{ 
                  overflowY: 'auto', 
                  maxHeight: '130px', 
                  width: '100%',
                  marginTop: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {searchedProperties.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '0.5rem 0' }}>No matching properties</span>
                ) : (
                  searchedProperties.map((p) => (
                    <button
                      key={`slot-search-${p.id}`}
                      type="button"
                      onClick={() => {
                        onAdd(p.id)
                        setShowSearchDropdown(null)
                        setSearchQuery('')
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        textAlign: 'left',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.78rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'background 0.2s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{p.title}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--teal-500)' }}>{p.developer} · {p.location}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <button 
              className="compare-empty-card-slot" 
              type="button"
              style={{ width: '100%', height: '100%', minHeight: '160px' }}
              onClick={() => setShowSearchDropdown(slotIndex)}
            >
              <span className="compare-empty-add-icon">+</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Add Property</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>to compare side-by-side</span>
            </button>
          )}
        </div>
      )
    }

    return cols
  }

  // Render accordion detailed comparison values
  const renderComparisonValue = (rowLabel: string, colIndex: number) => {
    if (!data || colIndex >= data.projects.length) {
      return <span className="compare-row-value empty-val">-</span>
    }

    const proj = data.projects[colIndex]

    // Intercept Price sft changes to show the dynamic calculated price inside the table as well
    if (rowLabel === 'Price') {
      return <span className="compare-row-value" style={{ fontWeight: 700 }}>{calculateDynamicPrice(proj)}</span>
    }

    // Intercept Base Price sft changes to update if they selected custom sizes
    if (rowLabel === 'Base Price' && selectedSizes[proj.id]) {
      const selectedSize = selectedSizes[proj.id]
      const sizeMatch = selectedSize.match(/(\d+)/)
      if (sizeMatch) {
        // Calculate dynamic base price (which is technically constant, but let's list it clearly)
        let baseRate = 6000 + (proj.id % 5) * 800
        const pricingCat = data.comparisons.find((c) => c.category === 'Pricing')
        if (pricingCat) {
          const basePriceRow = pricingCat.fields.find((f) => f.label === 'Base Price')
          if (basePriceRow) {
            const rawRate = basePriceRow.values[colIndex]
            const rateMatch = rawRate.match(/(\d+)/)
            if (rateMatch) baseRate = parseInt(rateMatch[1])
          }
        }
        return <span className="compare-row-value">₹{baseRate} / sft.</span>
      }
    }

    // Fetch cell value from data payload
    let cellValue = '-'
    data.comparisons.forEach((catGroup) => {
      catGroup.fields.forEach((field) => {
        if (field.label === rowLabel) {
          cellValue = field.values[colIndex] || '-'
        }
      })
    })

    return <span className="compare-row-value">{cellValue}</span>
  }

  return (
    <div className="compare-modal-overlay">
      <div className="compare-modal-container">
        
        {/* Back and Title Row */}
        <div className="compare-header-row">
          <button className="compare-back-btn" onClick={onClose} aria-label="Go back to listings" type="button">
            <ArrowLeft size={20} />
          </button>
          <div className="compare-title-section">
            <h1>Project Comparison</h1>
            <p>Compare specifications, pricing, amenities, and location details.</p>
          </div>
        </div>

        {/* 2. Scroll Category tabs list */}
        <div className="compare-tabs-list-wrap">
          <div className="compare-tabs-list">
            {categories.map((cat) => (
              <button
                key={`tab-${cat}`}
                className={activeTab === cat ? 'compare-tab-btn active' : 'compare-tab-btn'}
                onClick={() => scrollToCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Detailed Specifications Scroll container */}
        <div className="compare-scroll-body" ref={scrollContainerRef}>
          {/* Horizontal scroll container (especially on mobile) */}
          <div className="compare-horizontal-scroll-wrap">
            <div className="compare-grid-content-width">
              
              {/* Columns cards list */}
              <div className="compare-grid-header">
                <div className="compare-intro-col">
                  <h3>Parameters</h3>
                  <p>Select properties to analyze parameters side-by-side.</p>
                </div>
                {renderHeaderColumns()}
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem' }}>
                  <div style={{ border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--teal-500)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: 'var(--body-color)', fontSize: '0.9rem' }}>Loading comparison details...</span>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#ef4444' }}>{error}</div>
              ) : !data ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--body-color)' }}>Select properties to begin comparison.</div>
              ) : (
                data.comparisons.map((catGroup) => (
                  <div 
                    key={`group-${catGroup.category}`} 
                    className="compare-accordion-group"
                    ref={(el) => { categoryRefs.current[catGroup.category] = el }}
                  >
                    {/* Accordion header trigger */}
                    <button 
                      className="compare-accordion-header"
                      onClick={() => toggleCategory(catGroup.category)}
                      type="button"
                    >
                      <h2>{catGroup.category}</h2>
                      <ChevronDown 
                        size={18} 
                        className={`compare-accordion-chevron ${expandedCategories[catGroup.category] ? 'expanded' : ''}`} 
                      />
                    </button>

                    {/* Accordion body comparisons */}
                    {expandedCategories[catGroup.category] && (
                      <div className="compare-accordion-content">
                        {catGroup.fields.map((field) => (
                          <div key={`row-${field.label}`} className="compare-table-row">
                            <div className="compare-row-label">{field.label}</div>
                            <div className="compare-cell-wrap">{renderComparisonValue(field.label, 0)}</div>
                            <div className="compare-cell-wrap">{renderComparisonValue(field.label, 1)}</div>
                            <div className="compare-cell-wrap">{renderComparisonValue(field.label, 2)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
