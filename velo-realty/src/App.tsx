import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BackToTop } from './components/BackToTop'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { HeroSearch } from './components/HeroSearch'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { PriceTicker } from './components/PriceTicker'
import { PropertyShowcase } from './components/PropertyShowcase'
import { Sections } from './components/Sections'
import { TeamSection } from './components/TeamSection'
import { aboutStats, communities, developers, guides, partners, properties } from './data/siteData'
import type { ListingType, Property } from './types'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('velo-theme')
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  })
  const [tab, setTab] = useState<ListingType>('Pre-Launch')
  const [location, setLocation] = useState('All Locations')
  const [propertyType, setPropertyType] = useState('Any Type')
  const [bedrooms, setBedrooms] = useState('Any')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'handover'>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500) // 2.5s to showcase the new high-end animation
    return () => clearTimeout(timer)
  }, [])

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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Trigger transition animation
    const container = document.querySelector('.page')
    if (container) {
      container.classList.add('theme-transitioning')
      setTimeout(() => {
        container.classList.remove('theme-transitioning')
      }, 1000)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
      const tabMatch = item.listingType === tab
      const locationMatch = location === 'All Locations' || location === 'All Corridors' || item.location === location
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
      <div className="theme-sweep" />
      {isLoading && <LoadingScreen />}
      <PriceTicker />
      <Navbar
        favoritesCount={favorites.size}
        theme={theme}
        onThemeToggle={toggleTheme}
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
          allProperties={properties}
        />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop visible={showBackToTop} />
    </div>
  )
}

export default App
