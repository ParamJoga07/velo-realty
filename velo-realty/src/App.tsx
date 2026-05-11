import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import { ServicesHub } from './components/ServicesHub'
import { DeveloperModal } from './components/DeveloperModal'
import type { ListingType, Property, Developer, Community, Guide, Category, Zone } from './types'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLogin } from './components/AdminLogin'
import { IdentityModal } from './components/IdentityModal'
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
  // --- Data Queries ---
  const { data: properties = [], isLoading: isLoadingProps } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetch(`${API_BASE_URL}/api/properties`).then(res => res.json())
  })

  const { data: developers = [], isLoading: isLoadingDevs } = useQuery<Developer[]>({
    queryKey: ['developers'],
    queryFn: () => fetch(`${API_BASE_URL}/api/developers`).then(res => res.json())
  })

  const { data: corridorsRaw = [], isLoading: isLoadingCorr } = useQuery({
    queryKey: ['corridors'],
    queryFn: () => fetch(`${API_BASE_URL}/api/corridors`).then(res => res.json())
  })
  const communities = useMemo(() => Array.isArray(corridorsRaw) ? corridorsRaw : [], [corridorsRaw]);

  const { data: guides = [] } = useQuery<Guide[]>({
    queryKey: ['guides'],
    queryFn: () => fetch(`${API_BASE_URL}/api/guides`).then(res => res.json())
  })

  const { data: partners = [] } = useQuery<string[]>({
    queryKey: ['partners'],
    queryFn: () => fetch(`${API_BASE_URL}/api/partners`).then(res => res.json())
  })

  const { data: aboutStats = [] } = useQuery<any[]>({
    queryKey: ['stats'],
    queryFn: () => fetch(`${API_BASE_URL}/api/stats`).then(res => res.json())
  })

  const { data: areaRates = [] } = useQuery<any[]>({
    queryKey: ['area-rates'],
    queryFn: () => fetch(`${API_BASE_URL}/api/area-rates`).then(res => res.json())
  })

  const { data: dbCategories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch(`${API_BASE_URL}/api/categories`).then(res => res.json())
  })

  const { data: dbZones = [] } = useQuery<Zone[]>({
    queryKey: ['zones'],
    queryFn: () => fetch(`${API_BASE_URL}/api/zones`).then(res => res.json())
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoadingProps && !isLoadingDevs && !isLoadingCorr) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingProps, isLoadingDevs, isLoadingCorr]);

  // Admin States
  const [adminToken, setAdminToken] = useState<string | null>(() => window.localStorage.getItem('velo-admin-token'))
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  
  // Developer Modal State
  const [selectedDeveloperName, setSelectedDeveloperName] = useState<string | null>(null)

  // User Identity State
  const [user, setUser] = useState<{ name: string; email: string; phone: string } | null>(() => {
    const savedUser = window.localStorage.getItem('velo-user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showIdentityModal, setShowIdentityModal] = useState(false)
  const [pendingPropertyToSave, setPendingPropertyToSave] = useState<number | null>(null)


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
    if (user?.email) {
      fetch(`${API_BASE_URL}/api/saved-properties/${user.email}`)
        .then(res => res.json())
        .then(data => setFavorites(new Set(data)))
        .catch(err => console.error("Failed to sync favorites:", err))
    }
  }, [user])

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

  // Global Scroll Lock for Modals
  useEffect(() => {
    const isModalOpen = !!selectedDeveloperName || !!showAdminLogin || !!showIdentityModal || !!selectedProperty;
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [selectedDeveloperName, showAdminLogin, showIdentityModal, selectedProperty]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, [isLoading]);

  const toggleFavorite = async (propertyId: number) => {
    if (!user) {
      setPendingPropertyToSave(propertyId)
      setShowIdentityModal(true)
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/save-property`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: user.email, property_id: propertyId })
      })
      const data = await res.json()
      
      setFavorites((current) => {
        const updated = new Set(current)
        if (data.status === 'removed') {
          updated.delete(propertyId)
        } else {
          updated.add(propertyId)
        }
        return updated
      })
    } catch (err) {
      console.error("Failed to save property:", err)
    }
  }

  const handleIdentitySubmit = async (userData: { name: string; email: string; phone: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/identify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const dbUser = await res.json()
      setUser(dbUser)
      window.localStorage.setItem('velo-user', JSON.stringify(dbUser))
      setShowIdentityModal(false)
      
      if (pendingPropertyToSave !== null) {
        toggleFavorite(pendingPropertyToSave)
        setPendingPropertyToSave(null)
      }
    } catch (err) {
      console.error("Failed to identify user:", err)
    }
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
    return <AdminDashboard token={adminToken} onLogout={handleLogout} theme={theme} />
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
        <div className="reveal-section">
          <PropertyShowcase
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            onDeveloperClick={setSelectedDeveloperName}
          />
        </div>
        <div className="reveal-section">
          <Sections
            developers={developers}
            communities={communities}
            guides={guides}
            partners={partners}
            aboutStats={aboutStats}
            onDeveloperClick={setSelectedDeveloperName}
          />
        </div>
        <div className="reveal-section">
          <ServicesHub />
        </div>
        <div className="reveal-section">
          <TeamSection />
        </div>
        <div className="reveal-section">
          <ContactSection />
        </div>
      </main>
      <Footer onSignInClick={() => setShowAdminLogin(true)} />
      <BackToTop visible={showBackToTop} />

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
                <p>
                  <span 
                    onClick={() => setSelectedDeveloperName(selectedProperty.location)}
                    style={{color: 'var(--accent-orange)', cursor: 'pointer', fontWeight: 600}}
                  >
                    {selectedProperty.location} Corridor
                  </span>
                  · {selectedProperty.community}
                </p>
              </div>
              <div className="modal-meta meta">
                <span>{selectedProperty.beds} Beds</span>
                <span>{selectedProperty.baths} Baths</span>
                <span>{selectedProperty.area} sq.ft</span>
              </div>
              <div className="modal-details">
                <p>
                  <strong>Developer:</strong> 
                  <span 
                    onClick={() => setSelectedDeveloperName(selectedProperty.developer)}
                    style={{color: 'var(--accent-orange)', cursor: 'pointer', marginLeft: '5px', fontWeight: 700}}
                  >
                    {selectedProperty.developer} (View Portfolio)
                  </span>
                </p>
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
                  onClick={() => toggleFavorite(selectedProperty.id)}
                >
                  {favorites.has(selectedProperty.id) ? '♥ Saved' : '♡ Save Property'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDeveloperName && (
        <DeveloperModal 
          developerName={selectedDeveloperName}
          onClose={() => setSelectedDeveloperName(null)}
          theme={theme}
        />
      )}

      {showIdentityModal && (
        <IdentityModal 
          onClose={() => {
            setShowIdentityModal(false)
            setPendingPropertyToSave(null)
          }}
          onSubmit={handleIdentitySubmit}
        />
      )}
    </div>
  )
}

export default App
