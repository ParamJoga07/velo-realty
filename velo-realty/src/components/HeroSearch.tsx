import type { Community, ListingType, PropertyType } from '../types'

type HeroSearchProps = {
  tab: ListingType
  setTab: (value: ListingType) => void
  location: string
  setLocation: (value: string) => void
  propertyType: string
  setPropertyType: (value: string) => void
  bedrooms: string
  setBedrooms: (value: string) => void
  communities: Community[]
}

const listingTypes: ListingType[] = ['Buy', 'Rent', 'Off-plan', 'Ready']
const propertyTypes: Array<PropertyType | 'Any Type'> = ['Any Type', 'Apartment', 'Villa', 'Townhouse']

export function HeroSearch({
  tab,
  setTab,
  location,
  setLocation,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  communities,
}: HeroSearchProps) {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-shell">
          <p className="eyebrow">Luxury Real Estate Platform</p>
          <h1>Discover skyline homes built for elevated living and long-term value.</h1>
          <p className="hero-copy">
            Explore premium properties, curated communities, and trusted developers with a faster investment discovery
            experience.
          </p>
          <div className="hero-leadbar">
            <input type="email" placeholder="Enter your email for curated launches" />
            <button className="btn btn-primary" type="button">
              See a demo
            </button>
          </div>
        </div>
        <div className="tabs" role="tablist" aria-label="Property intent tabs">
          {listingTypes.map((type) => (
            <button key={type} className={type === tab ? 'tab active' : 'tab'} onClick={() => setTab(type)} type="button">
              {type}
            </button>
          ))}
        </div>
        <div className="search-grid">
          <label>
            Location
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option>All Locations</option>
              {communities.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
          <label>
            Property Type
            <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
              {propertyTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Bedrooms
            <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
              <option>Any</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </label>
          <button className="btn btn-primary search-btn" type="button">
            Search
          </button>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>250+</strong>
            <span>Premium listings</span>
          </div>
          <div>
            <strong>35+</strong>
            <span>Developer partners</span>
          </div>
          <div>
            <strong>&lt; 2 min</strong>
            <span>Average response time</span>
          </div>
        </div>
        <p className="search-note">Featured in Marina, Downtown, Palm Jumeirah, Dubai Hills</p>
      </div>
    </section>
  )
}
