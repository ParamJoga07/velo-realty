import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heart, FileText, CheckCircle } from 'lucide-react'
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
import { SocialSidebar } from './components/SocialSidebar'
import { CtaSidebar } from './components/CtaSidebar'
import { CompareModal } from './components/CompareModal'
import { SiteVisitModal } from './components/SiteVisitModal'
import { BlogDetailPage, AboutStoryPage, ContactAgentPage } from './components/SubPages'
import { DirectCompare } from './components/DirectCompare'
import API_BASE_URL from './config'

const DEFAULT_PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
];

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = window.localStorage.getItem('velo-theme')
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  })
  
  const [currentView] = useState<'main' | 'blog' | 'about-story' | 'contact-agent'>(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'blog') return 'blog';
    if (view === 'about-story') return 'about-story';
    if (view === 'contact-agent') return 'contact-agent';
    return 'main';
  });

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
  const [compareIds, setCompareIds] = useState<number[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false)
  const siteVisitTriggerRef = useRef<HTMLButtonElement | null>(null)
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

  const { data: allProjects = [], isLoading: isLoadingProjects, isError: isErrorProjects } = useQuery<any[]>({
    queryKey: ['all-projects'],
    queryFn: () => fetch(`${API_BASE_URL}/api/projects`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    }),
    ...queryOptions
  })

  const { data: featuredProjects = [] } = useQuery<any[]>({
    queryKey: ['featured-projects'],
    queryFn: () => fetch(`${API_BASE_URL}/api/projects/featured`).then(res => {
      if (!res.ok) throw new Error('Failed to fetch featured projects');
      return res.json();
    }),
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

  // Loading screen will only finish when data is fully loaded and onComplete is triggered

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

  // Contact Agent Form State
  const [contactProperty, setContactProperty] = useState<Property | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [brochureProperty, setBrochureProperty] = useState<Property | null>(null)
  const [brochureName, setBrochureName] = useState('')
  const [brochureEmail, setBrochureEmail] = useState('')
  const [brochurePhone, setBrochurePhone] = useState('')
  const [brochureStatus, setBrochureStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactProperty) return
    setContactStatus('submitting')
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: `Inquiry for "${contactProperty.title}" developed by "${contactProperty.developer}" in "${contactProperty.location}". User submitted form via Contact Agent modal.`,
          property_id: null
        })
      })

      if (res.ok) {
        setContactStatus('success')
        setContactName('')
        setContactEmail('')
        setContactPhone('')
        setTimeout(() => {
          setContactProperty(null)
          setSelectedProperty(null)
          setContactStatus('idle')
        }, 1500)
      } else {
        setContactStatus('error')
      }
    } catch (err) {
      console.error(err)
      setContactStatus('error')
    }
  }

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brochureProperty) return
    setBrochureStatus('submitting')
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brochureName,
          email: brochureEmail,
          phone: brochurePhone,
          message: `Brochure request for "${brochureProperty.title}" by "${brochureProperty.developer}". Please send the brochure to the provided contact details.`,
          property_id: null
        })
      })
      if (res.ok) {
        setBrochureStatus('success')
        setBrochureName('')
        setBrochureEmail('')
        setBrochurePhone('')
        setTimeout(() => { setBrochureProperty(null); setBrochureStatus('idle') }, 2000)
      } else {
        setBrochureStatus('error')
      }
    } catch (err) {
      console.error(err)
      setBrochureStatus('error')
    }
  }


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

  const [navFilter, setNavFilter] = useState<string | null>(null)

  const mapDbProjectToProperty = (p: any): Property => {
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
    let imgUrl = DEFAULT_PROJECT_IMAGES[(p.id || 0) % DEFAULT_PROJECT_IMAGES.length];
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
      description: p.description || 'Premium residential gated community with luxury amenities.',
      amenities: p.amenities,
      highlights: p.highlights,
      categories: p.categories || [],
      zones: p.zones || []
    };
  };

  const mappedFeaturedProperties = useMemo(() => {
    if (!Array.isArray(featuredProjects)) return [];
    return featuredProjects.map(mapDbProjectToProperty);
  }, [featuredProjects, developers, communities]);

  const allMappedProperties = useMemo(() => {
    if (!Array.isArray(allProjects)) return [];
    return allProjects.map(mapDbProjectToProperty);
  }, [allProjects, developers, communities]);

  const comparedProperties = useMemo(() => {
    return allMappedProperties.filter(p => compareIds.includes(p.id));
  }, [allMappedProperties, compareIds]);

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 properties.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const addToCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) {
        alert('You can compare up to 3 properties.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: number) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  };

  const filteredProperties = useMemo(() => {
    const combined = allMappedProperties;

    const filtered = combined.filter((item) => {
      // Force empty state for Coming Soon tabs
      if (['Ready', 'Resale', 'Rentals'].includes(tab)) {
        return false;
      }

      // Allow Commercial/Plots to match directly bypassing strict tab restrictions
      const isSpecialType = ['Plot or Land', 'Commercial Space'].includes(propertyType);
      const tabMatch = isSpecialType || item.listingType === tab;
      
      const normalizeLocation = (loc: string) => loc.replace(/ corridor/gi, '').trim().toLowerCase();
      const locationMatch = location === 'All Locations' || location === 'All Corridors' || normalizeLocation(item.location) === normalizeLocation(location);
      
      const typeMatch = propertyType === 'Any Type' || item.type === propertyType;
      const bedMatch = bedrooms === 'Any' || String(item.beds) === bedrooms;
      const zoneMatch = zone === 'All Zones' || (item.zones && item.zones.includes(zone));
      const categoryMatch = category === 'All Categories' || (item.categories && item.categories.includes(category));
      
      const queryMatch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.community.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return tabMatch && locationMatch && typeMatch && bedMatch && zoneMatch && categoryMatch && queryMatch;
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
  }, [tab, location, zone, category, propertyType, bedrooms, sortBy, allMappedProperties, searchQuery]);

  if (adminToken) {
    return <AdminDashboard token={adminToken} onLogout={handleLogout} theme={theme} />
  }

  if (currentView === 'blog') {
    return <BlogDetailPage theme={theme} onThemeToggle={toggleTheme} />;
  }

  if (currentView === 'about-story') {
    return <AboutStoryPage theme={theme} onThemeToggle={toggleTheme} />;
  }

  if (currentView === 'contact-agent') {
    return <ContactAgentPage theme={theme} onThemeToggle={toggleTheme} properties={allMappedProperties} />;
  }

  return (
    <div className="page" data-theme={theme}>
      <div className="theme-sweep" />
      {isLoading && (
        <LoadingScreen 
          theme={theme}
          dataLoaded={
            (!isLoadingProps && !isLoadingDevs && !isLoadingCorr && !isLoadingProjects && 
             properties.length > 0 && developers.length > 0 && allProjects.length > 0) || 
            isErrorProps || isErrorDevs || isErrorCorr || isErrorProjects
          } 
          onComplete={() => setIsLoading(false)} 
        />
      )}
      {showAdminLogin && (
        <AdminLogin onLogin={handleLogin} onCancel={() => setShowAdminLogin(false)} />
      )}
      <PriceTicker areaRates={areaRates} />
      <SocialSidebar />
      <CtaSidebar
        onScheduleClick={(ref) => {
          siteVisitTriggerRef.current = ref.current
          setShowSiteVisitModal(true)
        }}
      />
      <Navbar
        favoritesCount={favorites.size}
        theme={theme}
        onThemeToggle={toggleTheme}
        onFilterSelect={handleFilterSelect}
        dbCorridors={communities}
        properties={allMappedProperties}
        onDeveloperClick={setSelectedDeveloperName}
        setSelectedProperty={setSelectedProperty}
        setLocation={setLocation}
      />
      <HeroSearch
        tab={tab}
        setTab={(val) => { setTab(val); setNavFilter(null); }}
        location={location}
        setLocation={(val) => { setLocation(val); setNavFilter(null); }}
        zone={zone}
        setZone={(val) => { setZone(val); setNavFilter(null); }}
        category={category}
        setCategory={(val) => { setCategory(val); setNavFilter(null); }}
        propertyType={propertyType}
        setPropertyType={(val) => { setPropertyType(val); setNavFilter(null); }}
        bedrooms={bedrooms}
        setBedrooms={(val) => { setBedrooms(val); setNavFilter(null); }}
        communities={communities}
        zones={dbZones}
        categories={dbCategories}
        heroStats={aboutStats}
        dbTypes={dbPropertyTypes}
        dbBedrooms={dbBedrooms}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        properties={allMappedProperties}
        onDeveloperClick={setSelectedDeveloperName}
        setSelectedProperty={setSelectedProperty}
      />
      <main>
        <PropertyShowcase
          properties={filteredProperties}
          featuredProjects={mappedFeaturedProperties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSelectedProperty={setSelectedProperty}
          onDeveloperClick={setSelectedDeveloperName}
          navFilter={navFilter}
          emptyStateMessage={['Ready', 'Resale', 'Rentals'].includes(tab) ? 'We are coming soon or launching soon' : undefined}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
        />
        <DirectCompare 
          developers={developers}
          properties={allMappedProperties}
          onCompare={(id1, id2) => {
            setCompareIds([id1, id2])
            setShowCompareModal(true)
          }}
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
                <h4>About this property</h4>
                <p>{selectedProperty.description}</p>
                
                {selectedProperty.highlights && (
                  <>
                    <h4 style={{marginTop: '1.5rem'}}>Key Highlights</h4>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {selectedProperty.highlights.split('\n').filter(Boolean).map((h, i) => (
                        <li key={i} style={{ color: 'var(--text-800)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                          {h.replace(/^[-\*•]\s*/, '').trim()}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {selectedProperty.amenities && (
                  <>
                    <h4 style={{marginTop: '1.5rem'}}>Amenities</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {selectedProperty.amenities.split(',').map((a, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--body-color)' }}>
                          {a.trim()}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-primary" 
                  type="button"
                  onClick={() => setContactProperty(selectedProperty)}
                >
                  Contact Agent
                </button>
                <button 
                  className="btn btn-ghost" 
                  type="button" 
                  onClick={() => setBrochureProperty(selectedProperty)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={16} /> Download Brochure
                </button>
                <button 
                  className="btn btn-ghost" 
                  type="button" 
                  onClick={() => toggleFavorite(selectedProperty.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Heart 
                    size={16} 
                    fill={favorites.has(selectedProperty.id) ? "var(--teal-500)" : "none"}
                    stroke={favorites.has(selectedProperty.id) ? "var(--teal-500)" : "currentColor"}
                  />
                  {favorites.has(selectedProperty.id) ? 'Saved' : 'Save Property'}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Sticky Scrolling CTA Button */}
          <div className="mobile-sticky-cta-bar" onClick={(e) => e.stopPropagation()}>
            <a 
              href={`?view=contact-agent&property_id=${selectedProperty.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary sticky-cta-btn"
            >
              Contact Velo Agent Now
            </a>
          </div>
        </div>
      )}

      {contactProperty && (
        <div className="contact-agent-modal-overlay" onClick={() => setContactProperty(null)}>
          <div className="contact-agent-card" onClick={e => e.stopPropagation()}>
            <div className="contact-agent-header">
              <h3>Contact Representative</h3>
              <div className="contact-agent-project-tag">
                {contactProperty.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {contactProperty.developer} · {contactProperty.location} Corridor
              </div>
            </div>
            
            <form onSubmit={handleContactSubmit} className="contact-agent-body">
              {contactStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--teal-500)', marginBottom: '1rem' }}>✓</div>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: "'EB Garamond Custom', serif" }}>Inquiry Submitted!</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>An expert advisor will reach out to you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="contact-agent-field">
                    <label htmlFor="modal-lead-name">Full Name</label>
                    <input
                      id="modal-lead-name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                    />
                  </div>
                  
                  <div className="contact-agent-field">
                    <label htmlFor="modal-lead-email">Email Address</label>
                    <input
                      id="modal-lead-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="contact-agent-field">
                    <label htmlFor="modal-lead-phone">Contact Number</label>
                    <input
                      id="modal-lead-phone"
                      type="tel"
                      placeholder="+91 Contact Number"
                      required
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                    />
                  </div>
                  
                  {contactStatus === 'error' && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      Failed to submit inquiry. Please try again.
                    </div>
                  )}
                  
                  <div className="contact-agent-actions">
                    <button 
                      className="btn btn-ghost" 
                      type="button" 
                      onClick={() => setContactProperty(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      type="submit"
                      disabled={contactStatus === 'submitting'}
                    >
                      {contactStatus === 'submitting' ? 'Submitting...' : 'Send Inquiry'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {selectedDeveloperName && (
        <DeveloperModal 
          developerName={selectedDeveloperName}
          onClose={() => setSelectedDeveloperName(null)}
          theme={theme}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
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

      {brochureProperty && (
        <div className="contact-agent-modal-overlay" onClick={() => setBrochureProperty(null)}>
          <div className="contact-agent-card" onClick={e => e.stopPropagation()}>
            <div className="contact-agent-header">
              <h3><FileText size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Download Brochure</h3>
              <div className="contact-agent-project-tag">{brochureProperty.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {brochureProperty.developer} · {brochureProperty.location} Corridor
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', opacity: 0.8 }}>
                Fill in your details and our team will send the brochure to you.
              </div>
            </div>
            <form onSubmit={handleBrochureSubmit} className="contact-agent-body">
              {brochureStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CheckCircle size={48} style={{ color: 'var(--teal-500)' }} />
                  </div>
                  <h4 style={{ color: 'var(--heading-color)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Request Sent!</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>We'll send the brochure to your email shortly.</p>
                </div>
              ) : (
                <>
                  <div className="contact-agent-field">
                    <label htmlFor="brochure-name">Full Name</label>
                    <input id="brochure-name" type="text" placeholder="Your name" required value={brochureName} onChange={e => setBrochureName(e.target.value)} />
                  </div>
                  <div className="contact-agent-field">
                    <label htmlFor="brochure-email">Email Address</label>
                    <input id="brochure-email" type="email" placeholder="you@example.com" required value={brochureEmail} onChange={e => setBrochureEmail(e.target.value)} />
                  </div>
                  <div className="contact-agent-field">
                    <label htmlFor="brochure-phone">Phone Number</label>
                    <input id="brochure-phone" type="tel" placeholder="+91 XXXXXXXXXX" required value={brochurePhone} onChange={e => setBrochurePhone(e.target.value)} />
                  </div>
                  {brochureStatus === 'error' && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>Failed to submit. Please try again.</div>
                  )}
                  <div className="contact-agent-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => setBrochureProperty(null)}>Cancel</button>
                    <button className="btn btn-primary" type="submit" disabled={brochureStatus === 'submitting'}>
                      {brochureStatus === 'submitting' ? 'Sending...' : 'Request Brochure'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      {compareIds.length > 0 && !showCompareModal && (
        <div className="compare-floating-bar">
          <div className="compare-bar-items-list">
            {comparedProperties.map((p) => (
              <div key={`bar-${p.id}`} className="compare-bar-item">
                <img src={p.image} alt={p.title} />
                <button 
                  className="compare-bar-remove-item" 
                  onClick={() => removeFromCompare(p.id)}
                  title="Remove"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
            {compareIds.length < 3 && (
              <div 
                className="compare-bar-item" 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1.5px dashed rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '18px',
                  fontWeight: 600
                }}
              >
                +
              </div>
            )}
          </div>
          <div className="compare-bar-actions">
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              {compareIds.length}/3 selected
            </span>
            <button 
              className="compare-bar-btn-primary"
              onClick={() => setShowCompareModal(true)}
              type="button"
            >
              Compare Now
            </button>
            <button 
              className="compare-bar-clear-btn"
              onClick={() => setCompareIds([])}
              type="button"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          compareIds={compareIds}
          onClose={() => setShowCompareModal(false)}
          onRemove={removeFromCompare}
          onAdd={addToCompare}
          properties={allMappedProperties}
        />
      )}

      {/* Site Visit Modal */}
      <SiteVisitModal
        isOpen={showSiteVisitModal}
        onClose={() => setShowSiteVisitModal(false)}
        triggerRef={siteVisitTriggerRef}
      />
    </div>
  )
}

export default App
