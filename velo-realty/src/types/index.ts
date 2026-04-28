export type ListingType = 'Buy' | 'Rent' | 'Off-plan' | 'Ready'

export type PropertyStatus = 'Featured' | 'New Launch' | 'Ready' | 'Sold Out'

export type PropertyType = 'Apartment' | 'Villa' | 'Townhouse'

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
  image: string
}

export type Guide = {
  title: string
  description: string
}
