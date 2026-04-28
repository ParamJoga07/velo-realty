import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BackToTop } from './components/BackToTop'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { HeroSearch } from './components/HeroSearch'
import { Navbar } from './components/Navbar'
import { PropertyShowcase } from './components/PropertyShowcase'
import { Sections } from './components/Sections'
import { aboutStats, communities, developers, guides, partners, properties } from './data/siteData'
import type { ListingType, Property } from './types'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('velo-theme')
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  })
  const [tab, setTab] = useState<ListingType>('Buy')
  const [location, setLocation] = useState('All Locations')
  const [propertyType, setPropertyType] = useState('Any Type')
  const [bedrooms, setBedrooms] = useState('Any')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'handover'>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 420)
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('velo-theme', theme)
  }, [theme])

  const toggleFavorite = (propertyId: number) => {
    setFavorites((current) => {
      const updated = new Set(current)
      if (updated.has(propertyId)) {
        updated.delete(propertyId)
      } else {
        updated.add(propertyId)
      }
      return updated
    })
  }

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((item) => {
      const tabMatch = tab === 'Buy' ? item.listingType === 'Buy' || item.listingType === 'Ready' : item.listingType === tab
      const locationMatch = location === 'All Locations' || item.location === location
      const typeMatch = propertyType === 'Any Type' || item.type === propertyType
      const bedMatch = bedrooms === 'Any' || String(item.beds) === bedrooms
      return tabMatch && locationMatch && typeMatch && bedMatch
    })

    const rankByStatus: Record<Property['status'], number> = {
      Featured: 0,
      'New Launch': 1,
      Ready: 2,
      'Sold Out': 3,
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.priceValue - b.priceValue
      }
      if (sortBy === 'price-desc') {
        return b.priceValue - a.priceValue
      }
      if (sortBy === 'handover') {
        return a.handover.localeCompare(b.handover)
      }
      return rankByStatus[a.status] - rankByStatus[b.status]
    })
  }, [tab, location, propertyType, bedrooms, sortBy])

  return (
    <div className="page" data-theme={theme}>
      <Navbar
        favoritesCount={favorites.size}
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <HeroSearch
        tab={tab}
        setTab={setTab}
        location={location}
        setLocation={setLocation}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        communities={communities}
      />

      <main>
        <PropertyShowcase
          properties={filteredProperties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <Sections
          developers={developers}
          communities={communities}
          guides={guides}
          partners={partners}
          aboutStats={aboutStats}
        />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop visible={showBackToTop} />
    </div>
  )
}

export default App
