import type { Community, ListingType, Category } from '../types/index'

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
  dbBedrooms = []
}: HeroSearchProps) {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-shell">
          <p className="eyebrow">Velo Realty Pvt. Ltd.</p>
          <h1>Elevated Skyline Living Meets Accelerated Investment Discovery.</h1>
          <p className="hero-copy">
            Experience premium homes and curated communities from trusted developers, engineered for long-term value and
            a faster path to your next great investment.
          </p>
          <div className="hero-leadbar">
            <input type="email" placeholder="Enter your email for curated launches" />
            <button className="btn btn-primary" type="button">
              Get Started
            </button>
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
          <button className="btn btn-primary search-btn" type="button">
            Search
          </button>
        </div>
        <div className="hero-metrics">
          {/* {heroStats.slice(0, 3).map((stat, i) => (
            <div key={i}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))} */}
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
