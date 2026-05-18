import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import './App.css'
import { BackToTop } from './components/BackToTop'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { HeroSearch } from './components/HeroSearch'
import { LoadingScreen } from './components/LoadingScreen'
import { Navbar } from './components/Navbar'
import { PriceTicker } from './components/PriceTicker'
import { PropertyShowcase } from './components/PropertyShowcase'
import { Sections, TestimonialsSection } from './components/Sections'
import { TeamSection } from './components/TeamSection'
import { ServicesHub } from './components/ServicesHub'
import { DeveloperModal } from './components/DeveloperModal'
import type { ListingType, Property, Developer, Guide, Category, Zone } from './types'
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
  const queryOptions = {
    retry: 1, // Only retry once for initial load to avoid long hangs
    staleTime: 60000,
  };

  const { data: properties = [], isLoading: isLoadingProps, isError: isErrorProps } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => fetch(`${API_BASE_URL}/api/properties`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch properties');
      return res.json();
    }),
    ...queryOptions
  })

  const { data: developers = [], isLoading: isLoadingDevs, isError: isErrorDevs } = useQuery<Developer[]>({
    queryKey: ['developers'],
    queryFn: () => fetch(`${API_BASE_URL}/api/developers`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch developers');
      return res.json();
    }),
    ...queryOptions
  })

  const { data: corridorsRaw = [], isLoading: isLoadingCorr, isError: isErrorCorr } = useQuery({
    queryKey: ['corridors'],
    queryFn: () => fetch(`${API_BASE_URL}/api/corridors`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch corridors');
      return res.json();
    }),
    ...queryOptions
  })
  const communities = useMemo(() => Array.isArray(corridorsRaw) ? corridorsRaw : [], [corridorsRaw]);

  const { data: guides = [] } = useQuery<Guide[]>({
    queryKey: ['guides'],
    queryFn: () => fetch(`${API_BASE_URL}/api/guides`).then(res => res.json()),
    ...queryOptions
  })

  const { data: partners = [] } = useQuery<string[]>({
    queryKey: ['partners'],
    queryFn: () => fetch(`${API_BASE_URL}/api/partners`).then(res => res.json()),
    ...queryOptions
  })

  const { data: allProjects = [], isLoading: isLoadingProjects } = useQuery<any[]>({
    queryKey: ['all-projects'],
    queryFn: () => fetch(`${API_BASE_URL}/api/projects`).then(res => res.json()),
    ...queryOptions
  })

  const { data: aboutStats = [] } = useQuery<any[]>({
    queryKey: ['stats'],
    queryFn: () => fetch(`${API_BASE_URL}/api/stats`).then(res => res.json()),
    ...queryOptions
  })

  const { data: areaRates = [] } = useQuery<any[]>({
    queryKey: ['area-rates'],
    queryFn: () => fetch(`${API_BASE_URL}/api/area-rates`).then(res => res.json()),
    ...queryOptions
  })

  const { data: dbCategories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch(`${API_BASE_URL}/api/categories`).then(res => res.json()),
    ...queryOptions
  })

  const { data: dbZones = [] } = useQuery<Zone[]>({
    queryKey: ['zones'],
    queryFn: () => fetch(`${API_BASE_URL}/api/zones`).then(res => res.json()),
    ...queryOptions
  })

  const { data: testimonials = [] } = useQuery<any[]>({
    queryKey: ['testimonials'],
    queryFn: () => fetch(`${API_BASE_URL}/api/testimonials`).then(res => res.json()),
    ...queryOptions
  })

  const [isLoading, setIsLoading] = useState(true)

  // Derive dynamic counts and filters
  const projectStats = useMemo(() => {
    const devCounts: Record<number, number> = {};
    const corrCounts: Record<number, number> = {};
    
    allProjects.forEach(p => {
      if (p.developer_id) {
        devCounts[p.developer_id] = (devCounts[p.developer_id] || 0) + 1;
      }
      if (p.corridor_id) {
        corrCounts[p.corridor_id] = (corrCounts[p.corridor_id] || 0) + 1;
      }
    });

    return { devCounts, corrCounts };
  }, [allProjects]);

  // Derive dynamic filter options from properties
  const dbPropertyTypes = useMemo(() => {
    const types = new Set<string>(['Any Type']);
    properties.forEach(p => {
      if (p.type) types.add(p.type);
    });
    return Array.from(types);
  }, [properties]);

  const dbBedrooms = useMemo(() => {
    const beds = new Set<string>(['Any']);
    properties.forEach(p => {
      if (p.beds) beds.add(p.beds.toString());
    });
    return Array.from(beds).sort();
  }, [properties]);

  useEffect(() => {
    // Safety timeout: Hide loader after 10s regardless of state
    const safetyTimer = setTimeout(() => setIsLoading(false), 10000);

    const stillLoading = isLoadingProps || isLoadingDevs || isLoadingCorr || isLoadingProjects;
    const hasError = isErrorProps || isErrorDevs || isErrorCorr;

    if (!stillLoading || hasError) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(safetyTimer);
      };
    }
    return () => clearTimeout(safetyTimer);
  }, [isLoadingProps, isLoadingDevs, isLoadingCorr, isLoadingProjects, isErrorProps, isErrorDevs, isErrorCorr]);

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
  const handleFilterSelect = (filterLabel: string) => {
    // Check if it is a corridor selection
    const isCorridor = communities.some(c => c.name.toLowerCase() === filterLabel.toLowerCase()) || 
                       ['north corridor', 'south corridor', 'east corridor', 'west corridor'].includes(filterLabel.toLowerCase());
    
    if (isCorridor) {
      setSelectedDeveloperName(filterLabel);
      return;
    }

    // Reset basic filters to show matching results
    setLocation('All Locations');
    setBedrooms('Any');

    switch (filterLabel) {
      case 'Pre-launch':
      case 'Pre-Launch':
        setTab('Pre-Launch');
        setPropertyType('Any Type');
        break;
      case 'Under Construction':
        setTab('Off-Plan');
        setPropertyType('Any Type');
        break;
      case 'Ready to Move in':
        setTab('Ready');
        setPropertyType('Any Type');
        break;
      case 'Commercial':
      case 'Commercial Spaces':
        setTab('Pre-Launch'); // Keep tab but show commercial regardless of tab
        setPropertyType('Commercial Space');
        break;
      case 'Plot or Land':
      case 'Plots and Land':
        setTab('Pre-Launch'); 
        setPropertyType('Plot or Land');
        break;
      case 'Rentals':
        setTab('Rentals');
        setPropertyType('Any Type');
        break;
      case 'Resale':
        setTab('Resale');
        setPropertyType('Any Type');
        break;
      default:
        break;
    }
  };

  const filteredProperties = useMemo(() => {
    // Map all database projects from project_details table to the high-fidelity showcase Property cards
    const mappedProperties: Property[] = allProjects.map((p) => {
      // Find developer and corridor names with perfect formatting and fallback mapping
      const devObj = developers.find(d => d.id === p.developer_id);
      const devName = devObj ? devObj.name : (p.developer_slug ? p.developer_slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : "Velo Partner");
      const corrObj = communities.find(c => c.id === p.corridor_id);
      const corrName = corrObj ? corrObj.name : "Hyderabad Growth";

      // Map project type to PropertyType
      let pType: Property['type'] = 'Apartment';
      const typeStr = (p.project_type || '').toLowerCase();
      if (typeStr.includes('villa')) {
        pType = 'Villa';
      } else if (typeStr.includes('commercial') || typeStr.includes('retail') || typeStr.includes('office') || typeStr.includes('township')) {
        pType = 'Commercial Space';
      } else if (typeStr.includes('plot') || typeStr.includes('land')) {
        pType = 'Plot or Land';
      }

      // Map status to ListingType including support for new Rentals and Resale
      let pListingType: string = 'Off-Plan'; 
      const statusStr = (p.status || '').toLowerCase();
      if (statusStr.includes('pre-launch') || statusStr.includes('launch')) {
        pListingType = 'Pre-Launch';
      } else if (statusStr.includes('ready') || statusStr.includes('delivered') || statusStr.includes('completed')) {
        pListingType = 'Ready';
      } else if (statusStr.includes('rent')) {
        pListingType = 'Rentals';
      } else if (statusStr.includes('resale')) {
        pListingType = 'Resale';
      }

      // Map priceValue
      const priceVal = p.price_start || 0;

      // Extract configurations and beds/baths
      let beds = 3;
      const configStr = (p.configurations || '').toLowerCase();
      if (configStr.includes('2')) beds = 2;
      if (configStr.includes('4')) beds = 4;
      if (configStr.includes('5')) beds = 5;

      // Default high-quality placeholder image if no images uploaded
      let imgUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
      if (Array.isArray(p.images) && p.images.length > 0) {
        const firstImg = p.images[0];
        if (typeof firstImg === 'string') {
          imgUrl = firstImg;
        } else if (firstImg && typeof firstImg === 'object' && firstImg.image_url) {
          imgUrl = firstImg.image_url;
        }
      } else if (p.primary_image) {
        imgUrl = p.primary_image;
      }

      return {
        id: p.id,
        title: p.name || 'Premium Property',
        location: corrName.replace(/ corridor/gi, ''),
        community: p.sub_location || p.location || 'Premium Location',
        developer: devName,
        type: pType,
        listingType: pListingType as any,
        price: p.price_range || 'Price on Request',
        priceValue: priceVal,
        beds: beds,
        baths: beds, // Match baths to beds
        area: 1800,
        handover: p.possession || '2028',
        status: (p.status === 'Ready to Move' ? 'Ready' : p.status) as Property['status'],
        image: imgUrl,
        description: p.description || 'Premium residential gated community with luxury amenities.'
      };
    });

    const combined = [...mappedProperties];

    const filtered = combined.filter((item) => {
      // Allow Rentals and Resale tabs or Commercial/Plots to match directly bypassing strict tab restrictions
      const isSpecialType = ['Plot or Land', 'Commercial Space'].includes(propertyType) || ['Rentals', 'Resale'].includes(tab);
      const tabMatch = isSpecialType || item.listingType === tab;
      
      const locationMatch = location === 'All Locations' || location === 'All Corridors' || item.location === location;
      const typeMatch = propertyType === 'Any Type' || item.type === propertyType;
      const bedMatch = bedrooms === 'Any' || String(item.beds) === bedrooms;
      
      return tabMatch && locationMatch && typeMatch && bedMatch;
    });

    const rankByStatus: Record<string, number> = {
      Featured: 0,
      'New Launch': 1,
      Ready: 2,
      'Sold Out': 3,
    };

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.priceValue - b.priceValue;
      }
      if (sortBy === 'price-desc') {
        return b.priceValue - a.priceValue;
      }
      if (sortBy === 'handover') {
        return a.handover.localeCompare(b.handover);
      }
      const rankA = rankByStatus[a.status] !== undefined ? rankByStatus[a.status] : 99;
      const rankB = rankByStatus[b.status] !== undefined ? rankByStatus[b.status] : 99;
      return rankA - rankB;
    });
  }, [tab, location, propertyType, bedrooms, sortBy, allProjects, developers, communities]);

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
        onFilterSelect={handleFilterSelect}
        dbCorridors={communities}
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
        heroStats={aboutStats}
        dbTypes={dbPropertyTypes}
        dbBedrooms={dbBedrooms}
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
          setSelectedProperty={setSelectedProperty}
          onDeveloperClick={setSelectedDeveloperName}
        />
        <Sections
          developers={developers}
          communities={communities}
          guides={guides}
          partners={partners}
          aboutStats={aboutStats}
          onDeveloperClick={setSelectedDeveloperName}
          projectStats={projectStats}
        />
        <ServicesHub />
        <TeamSection />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection properties={allProjects} />
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
