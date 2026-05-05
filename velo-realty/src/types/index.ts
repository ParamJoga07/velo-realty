export type ListingType = 'Pre-Launch' | 'Off-Plan' | 'Ready'

export type PropertyStatus = 'Featured' | 'New Launch' | 'Ready' | 'Sold Out'

export type PropertyType = 'Apartment' | 'Villa' | 'Commercial Space' | 'Plot or Land'

export type Property = {
  id: number
  title: string
  location: string
  community: string
  developer: string
  type: PropertyType
  listingType: ListingType
  price: string
  priceValue: number
  beds: number
  baths: number
  area: number
  handover: string
  status: PropertyStatus
  image: string
  description: string
}

export type Developer = {
  name: string
  projects: number
  image: string
}

export type Community = {
  name: string
  slug: string
  image: string
}

export type Guide = {
  title: string
  description: string
}

export type AreaRate = {
  area: string
  price: string
  cagr: string
}

// --- NEW: Rich Developer & Project Types ---

export type ProjectImage = {
  id: number
  image_url: string
  caption: string | null
  is_primary: boolean
}

export type Category = {
  id: number
  name: string
  slug: string
}

export type Zone = {
  id: number
  name: string
  slug: string
}

export type ProjectSummary = {
  id: number
  name: string
  slug: string
  location: string
  project_type: string
  price_range: string | null
  status: string | null
  configurations: string | null
  categories?: string[]
  zones?: string[]
  primary_image: string | null
}

export type DeveloperProfile = {
  id: number
  name: string
  slug: string
  about: string
  type: string | null
  founded_year: number | null
  headquarters: string | null
  logo_url: string | null
  total_projects: number
  projects: ProjectSummary[]
}

export type ProjectDetail = {
  id: number
  name: string
  slug: string
  developer_name: string | null
  developer_slug: string | null
  location: string
  sub_location: string | null
  project_type: string
  land_area: string | null
  structure: string | null
  total_units: string | null
  configurations: string | null
  size_range: string | null
  price_range: string | null
  open_space: string | null
  possession: string | null
  status: string | null
  clubhouse_size: string | null
  description: string | null
  highlights: string | null
  connectivity: string | null
  images: ProjectImage[]
}
