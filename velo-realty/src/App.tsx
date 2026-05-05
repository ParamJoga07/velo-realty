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
import { DeveloperModal } from './components/DeveloperModal'
import type { ListingType, Property, Developer, Community, Guide, Category, Zone } from './types'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLogin } from './components/AdminLogin'
import API_BASE_URL from './config'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('velo-theme')
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  })
  const [tab, setTab] = useState<ListingType>('Pre-Launch')
  const [location, setLocation] = useState('All Locations')
  const [zone, setZone] = useState('All Zones')
  const [category, setCategory] = useState('All Categories')
  const [propertyType, setPropertyType] = useState('Any Type')
  const [bedrooms, setBedrooms] = useState('Any')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'handover'>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [properties, setProperties] = useState<Property[]>([])
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [partners, setPartners] = useState<string[]>([])
  const [aboutStats, setAboutStats] = useState<any[]>([])
  const [areaRates, setAreaRates] = useState<any[]>([])
  const [dbCategories, setDbCategories] = useState<Category[]>([])
  const [dbZones, setDbZones] = useState<Zone[]>([])

  // Admin States
  const [adminToken, setAdminToken] = useState<string | null>(() => window.localStorage.getItem('velo-admin-token'))
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  
  // Developer Modal State
  const [selectedDeveloperName, setSelectedDeveloperName] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, devRes, corrRes, guideRes, partRes, statRes, areaRes, catRes, zoneRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/properties`),
          fetch(`${API_BASE_URL}/api/developers`),
          fetch(`${API_BASE_URL}/api/corridors`),
          fetch(`${API_BASE_URL}/api/guides`),
          fetch(`${API_BASE_URL}/api/partners`),
          fetch(`${API_BASE_URL}/api/stats`),
          fetch(`${API_BASE_URL}/api/area-rates`),
          fetch(`${API_BASE_URL}/api/categories`),
          fetch(`${API_BASE_URL}/api/zones`)
        ]);
        setProperties(await propRes.json());
        setDevelopers(await devRes.json());
        const corridorsData = await corrRes.json();
        setCommunities(Array.isArray(corridorsData) ? corridorsData : []);
        setGuides(await guideRes.json());
        setPartners(await partRes.json());
        setAboutStats(await statRes.json());
        setAreaRates(await areaRes.json());
        setDbCategories(await catRes.json());
        setDbZones(await zoneRes.json());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000) // Small delay for animation
      }
    };
    fetchData();
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

  const handleLogin = (token: string) => {
    setAdminToken(token)
    window.localStorage.setItem('velo-admin-token', token)
    setShowAdminLogin(false)
  }

  const handleLogout = () => {
    setAdminToken(null)
    window.localStorage.removeItem('velo-admin-token')
  }

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
      // Since PropertyModel doesn't have many-to-many populated in this view yet, we stick to basic filters
      // but the UI will show these for the discovery module later
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
  }, [tab, location, propertyType, bedrooms, sortBy, properties])

  if (adminToken) {
    return <AdminDashboard token={adminToken} onLogout={handleLogout} />
  }

  return (
    <div className="page" data-theme={theme}>
      <div className="theme-sweep" />
      {isLoading && <LoadingScreen />}
      {showAdminLogin && (
        <AdminLogin onLogin={handleLogin} onCancel={() => setShowAdminLogin(false)} />
      )}
      <PriceTicker areaRates={areaRates} />
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
        zone={zone}
        setZone={setZone}
        category={category}
        setCategory={setCategory}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        communities={communities}
        zones={dbZones}
        categories={dbCategories}
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
          onDeveloperClick={setSelectedDeveloperName}
        />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer onSignInClick={() => setShowAdminLogin(true)} />
      <BackToTop visible={showBackToTop} />

      {selectedDeveloperName && (
        <DeveloperModal 
          developerName={selectedDeveloperName}
          onClose={() => setSelectedDeveloperName(null)}
        />
      )}
    </div>
  )
}

export default App
