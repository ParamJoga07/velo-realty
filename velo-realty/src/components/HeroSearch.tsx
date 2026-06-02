import { useState, useEffect, useRef } from 'react'
import type { Community, ListingType, Category, Property, SearchResponse } from '../types'
import API_BASE_URL from '../config'

type HeroSearchProps = {
  tab: ListingType
  setTab: (value: ListingType) => void
  location: string
  setLocation: (value: string) => void
  zone: string
  setZone: (value: string) => void
  category: string
  setCategory: (value: string) => void
  propertyType: string
  setPropertyType: (value: string) => void
  bedrooms: string
  setBedrooms: (value: string) => void
  communities: Community[]
  zones: Category[] // Reusing Category type for Zone simplicity in props
  categories: Category[]
  heroStats?: Array<{ value: string; label: string }>
  dbTypes?: string[]
  dbBedrooms?: string[]
  searchQuery: string
  setSearchQuery: (value: string) => void
  properties: Property[]
  onDeveloperClick: (name: string) => void
  setSelectedProperty: (prop: Property | null) => void
}

const listingTypes: ListingType[] = ['Pre-Launch', 'Off-Plan', 'Ready']

export function HeroSearch({
  tab,
  setTab,
  location,
  setLocation,
  zone,
  setZone,
  category,
  setCategory,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  communities,
  zones,
  categories,
  heroStats = [],
  dbTypes = [],
  dbBedrooms = [],
  setSearchQuery,
  properties,
  onDeveloperClick,
  setSelectedProperty
}: HeroSearchProps) {
  // Local autocomplete search states
  const [typedQuery, setTypedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch search results from API as user types
  useEffect(() => {
    if (!typedQuery || typedQuery.trim().length < 2) {
      setSearchResults(null)
      return
    }

    const timer = setTimeout(() => {
      setSearching(true)
      fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(typedQuery)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Search request failed')
          return res.json()
        })
        .then((data: SearchResponse) => {
          setSearchResults(data)
          setSearching(false)
        })
        .catch((err) => {
          console.error(err)
          setSearching(false)
        })
    }, 250) // Debounce API calls by 250ms

    return () => clearTimeout(timer)
  }, [typedQuery])

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSearchQuery(typedQuery)
    setShowSuggestions(false)
    
    // Scroll smoothly to properties showcase section
    const el = document.getElementById('properties')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSuggestionClick = (type: 'developer' | 'project' | 'property' | 'corridor', item: any) => {
    setShowSuggestions(false)
    setTypedQuery('')
    
    if (type === 'developer') {
      onDeveloperClick(item.name)
    } else if (type === 'project' || type === 'property') {
      // Find property from mapped properties list and select it to open details modal
      const matched = properties.find(p => p.id === item.id)
      if (matched) {
        setSelectedProperty(matched)
      }
    } else if (type === 'corridor') {
      // Filter list by corridor
      setLocation(item.name)
      const el = document.getElementById('properties')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-shell">
          <p className="eyebrow">Velo Realty Pvt. Ltd.</p>
          <h1>Discover Premium Properties in Hyderabad</h1>
          <p className="hero-copy">
            Explore verified villas, apartments, and investment opportunities across Hyderabad’s fastest-growing locations.
          </p>

          {/* Autocomplete Search Bar */}
          <div className="autocomplete-search-wrapper" ref={dropdownRef} style={{ width: 'min(620px, 100%)', margin: '1rem auto 0' }}>
            <form onSubmit={handleSearchSubmit}>
            <div className="hero-leadbar" style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search developers, projects, locations..." 
                value={typedQuery}
                onChange={(e) => {
                  setTypedQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>

            {/* Suggestions panel */}
            {showSuggestions && typedQuery.trim().length >= 2 && (
              <div className="search-suggestions-panel" style={{ width: '100%' }}>
                {searching && (
                  <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    Searching...
                  </div>
                )}
                
                {searchResults && (
                  <>
                    {/* Developers Group */}
                    {searchResults.developers && searchResults.developers.length > 0 && (
                      <div className="suggestions-group">
                        <div className="suggestions-group-title">Developers</div>
                        {searchResults.developers.map((d) => (
                          <button
                            key={`s-dev-${d.id}`}
                            className="suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('developer', d)}
                          >
                            <span className="suggestion-item-left">
                              <strong>{d.name}</strong>
                              <span className="suggestion-item-subtitle">Real Estate Developer</span>
                            </span>
                            <span className="suggestion-item-right">Portfolio →</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Projects Group */}
                    {searchResults.projects && searchResults.projects.length > 0 && (
                      <div className="suggestions-group">
                        <div className="suggestions-group-title">Projects</div>
                        {searchResults.projects.map((p) => (
                          <button
                            key={`s-proj-${p.id}`}
                            className="suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('project', p)}
                          >
                            <span className="suggestion-item-left">
                              <strong>{p.name}</strong>
                              <span className="suggestion-item-subtitle">{p.location || 'Hyderabad'}</span>
                            </span>
                            {p.price && <span className="suggestion-item-right">{p.price}</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Properties Group */}
                    {searchResults.properties && searchResults.properties.length > 0 && (
                      <div className="suggestions-group">
                        <div className="suggestions-group-title">Properties</div>
                        {searchResults.properties.map((p) => (
                          <button
                            key={`s-prop-${p.id}`}
                            className="suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('property', p)}
                          >
                            <span className="suggestion-item-left">
                              <strong>{p.title}</strong>
                              <span className="suggestion-item-subtitle">{p.location || 'Hyderabad'}</span>
                            </span>
                            {p.price && <span className="suggestion-item-right">{p.price}</span>}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Corridors Group */}
                    {searchResults.corridors && searchResults.corridors.length > 0 && (
                      <div className="suggestions-group">
                        <div className="suggestions-group-title">Corridors</div>
                        {searchResults.corridors.map((c) => (
                          <button
                            key={`s-corr-${c.id}`}
                            className="suggestion-item"
                            type="button"
                            onClick={() => handleSuggestionClick('corridor', c)}
                          >
                            <span className="suggestion-item-left">
                              <strong>{c.name}</strong>
                              <span className="suggestion-item-subtitle">Growth Corridor</span>
                            </span>
                            <span className="suggestion-item-right">Filter →</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results state */}
                    {(!searchResults.developers || searchResults.developers.length === 0) &&
                     (!searchResults.projects || searchResults.projects.length === 0) &&
                     (!searchResults.properties || searchResults.properties.length === 0) &&
                     (!searchResults.corridors || searchResults.corridors.length === 0) && (
                      <div className="search-no-results">No results found for "{typedQuery}"</div>
                    )}
                  </>
                )}
              </div>
            )}
            </form>
          </div>
        </div>
        <div className="tabs" role="tablist" aria-label="Property intent tabs">
          {listingTypes.map((type) => (
            <button
              key={type}
              className={type === tab ? 'tab active' : 'tab'}
              onClick={() => setTab(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
        <div className="search-grid advanced-search">
          <label>
            Corridor
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option>All Corridors</option>
              {Array.isArray(communities) && communities.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Zone
            <select value={zone} onChange={(event) => setZone(event.target.value)}>
              <option>All Zones</option>
              {Array.isArray(zones) && zones.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All Categories</option>
              {Array.isArray(categories) && categories.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Property Type
            <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
              {dbTypes.length > 0 ? (
                dbTypes.map((item) => <option key={item}>{item}</option>)
              ) : (
                <>
                  <option>Any Type</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Commercial Space</option>
                </>
              )}
            </select>
          </label>
          <label>
            Bedrooms
            <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
              {dbBedrooms.length > 0 ? (
                dbBedrooms.map((item) => <option key={item}>{item}</option>)
              ) : (
                <>
                  <option>Any</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </>
              )}
            </select>
          </label>
          <button className="btn btn-primary search-btn" type="button" onClick={() => handleSearchSubmit()}>
            Search
          </button>
        </div>
        <div className="hero-metrics">
          {heroStats.length === 0 && (
            <>
              <div>
                <strong>500+</strong>
                <span>Curated Units</span>
              </div>
              <div>
                <strong>15+</strong>
                <span>A-List Developers</span>
              </div>
              <div>
                <strong>&lt; 24h</strong>
                <span>Transaction Velocity</span>
              </div>
            </>
          )}
        </div>
        <p className="search-note">Active in North, South, East, and West Growth Corridors</p>
      </div>
    </section>
  )
}
