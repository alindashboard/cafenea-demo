export const SITE_CONFIG = {
  url: 'https://cafenea-demo.vercel.app',
  business: {
    name: 'Brew & Bean',
    legalName: 'BREW AND BEAN COFFEE SRL',
    cui: 'RO11223344',
    phone: '+40743000000',
    phoneDisplay: '+40 743 000 000',
    whatsapp: 'https://wa.me/40743000000',
    address: 'Piața Centrală 7, Bistrița',
    fullAddress: 'Piața Centrală 7, Bistrița, România',
    city: 'Bistrița',
    region: 'Bistrița-Năsăud',
    country: 'RO',
    description:
      'Cafea de specialitate în inima Bistriței. Din boabe selectate manual, prăjite local, preparate cu pasiune.',
    email: 'hello@brewandbean.ro',
    instagram: 'https://www.instagram.com/brewandbean.ro',
    schedule: {
      weekdays: 'Luni – Vineri: 07:30 – 21:00',
      saturday: 'Sâmbătă: 09:00 – 22:00',
      sunday: 'Duminică: 09:00 – 20:00',
    },
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2699.0!2d24.4993!3d47.1353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPia%C8%9Ba+Central%C4%83+7%2C+Bistri%C8%9Ba!5e0!3m2!1sro!2sro!4v1700000000000',
    mapUrl: 'https://maps.google.com/?q=47.1353,24.5003',
  },
  branding: {
    primaryColor: '#2C1810',
    accentColor: '#D4956A',
    bgWarm: '#FDF6EE',
    bgCard: '#FFF9F0',
    textDark: '#1A0F0A',
    logo: '/pictures/logo.png',
  },
  features: {
    reservations: false, // TODO: PREMIUM FEATURE — rezervări masă online
    contactForm: true,
    gallery: true,
    whatsapp: false,
    loyaltySystem: false, // TODO: PREMIUM FEATURE — loyalty points & rewards
    onlineOrder: false,   // TODO: PREMIUM FEATURE — comandă online + QR ridicare
  },
  itemLabel: {
    singular: 'produs',
    plural: 'produse',
    priceUnit: 'bucată',
  },
  seo: {
    keywords: [
      'cafea specialitate Bistrița',
      'specialty coffee Bistrița',
      'cafenea Bistrița',
      'Brew and Bean',
      'meniu cafea',
      'flat white Bistrița',
      'cold brew Bistrița',
    ] as string[],
    schemaType: 'CafeOrCoffeeShop',
  },
} as const
