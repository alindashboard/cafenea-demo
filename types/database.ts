export interface MenuCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  sort_order: number
  visible: boolean
  created_at: string
}

export interface MenuItemSize {
  name: string
  ml?: number
  price: number
}

export interface MenuItem {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  price_unit: string | null
  image_url: string | null
  available: boolean
  is_popular: boolean
  features: string[] | null
  allergens: string[] | null
  sizes: MenuItemSize[] | null
  created_at: string
  menu_categories?: MenuCategory | null
}

// Alias for compatibility with shared components
export type Item = MenuItem

export interface GalleryImage {
  id: string
  url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface Reservation {
  id: string
  item_id: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  start_date: string
  end_date: string | null
  guests: number | null
  total_price: number | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  notes: string | null
  created_at: string
}

export interface ContactRequest {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  resolved: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: unknown
  updated_at: string
}
