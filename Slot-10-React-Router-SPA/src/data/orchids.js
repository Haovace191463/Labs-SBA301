/**
 * Orchid Dataset for Orchid Router SPA
 * Student: Võ Anh Hào (CE191463)
 * Subject: SBA301 - Slot 10 (React Router & SPA)
 * 
 * Includes 10 diverse orchid species across 4 distinct categories.
 */

export const ORCHID_CATEGORIES = [
  'All',
  'Phalaenopsis',
  'Cattleya',
  'Dendrobium',
  'Vanda'
];

export const ORCHIDS = [
  {
    id: 'phalaenopsis-amabilis',
    name: 'Phalaenopsis Amabilis (Moon Orchid)',
    category: 'Phalaenopsis',
    description: 'Known as the Moon Orchid, this species features pristine white petals with a delicate yellow and red-tinted lip. Highly popular for home interiors due to long-lasting blooms.',
    origin: 'Southeast Asia & Northern Australia',
    careLevel: 'Easy',
    watering: 'Once a week, allow bark to dry slightly',
    light: 'Bright, indirect sunlight',
    bloomingSeason: 'Spring to Early Summer',
    rating: 4.9,
    featured: true,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'phalaenopsis-schilleriana',
    name: 'Phalaenopsis Schilleriana',
    category: 'Phalaenopsis',
    description: 'Remarkable for its fragrant rose-pink flowers and beautifully mottled silver-and-green foliage. It can produce up to 200 blossoms on mature branched inflorescences.',
    origin: 'Philippines (Luzon)',
    careLevel: 'Moderate',
    watering: 'Every 5 to 7 days',
    light: 'Medium indirect light',
    bloomingSeason: 'Late Winter to Spring',
    rating: 4.8,
    featured: true,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cattleya-labiata',
    name: 'Cattleya Labiata (Ruby of the Forest)',
    category: 'Cattleya',
    description: 'The archetype corsage orchid with large, vibrant lilac-mauve petals and an ornate crimson lip with gold veins. Celebrated for its intense sweet perfume.',
    origin: 'Northeastern Brazil',
    careLevel: 'Moderate',
    watering: 'Allow potting mix to dry between waterings',
    light: 'High indirect light, 2000-3000 foot-candles',
    bloomingSeason: 'Autumn',
    rating: 4.7,
    featured: true,
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cattleya-mossiae',
    name: 'Cattleya Mossiae (Easter Orchid)',
    category: 'Cattleya',
    description: 'The national flower of Venezuela. Known for gigantic pastel pink flowers with an elaborately ruffled lip adorned with golden yellow streaks.',
    origin: 'Venezuela (Coastal Mountain Range)',
    careLevel: 'Moderate',
    watering: 'Twice a week in summer, once weekly in winter',
    light: 'Bright morning light with partial afternoon shade',
    bloomingSeason: 'Spring (around Easter)',
    rating: 4.9,
    featured: false,
    image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dendrobium-nobile',
    name: 'Dendrobium Nobile',
    category: 'Dendrobium',
    description: 'A resilient epiphytic orchid producing dense clusters of waxy flowers along leafy pseudobulbs. Petals range from white to lavender tips with a dark velvety eye.',
    origin: 'Himalayas, Indochina, and Southern China',
    careLevel: 'Easy',
    watering: 'Generous in summer, dry cool rest in winter',
    light: 'Very bright light, can tolerate gentle morning sun',
    bloomingSeason: 'Late Winter to Spring',
    rating: 4.6,
    featured: true,
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dendrobium-chrysotoxum',
    name: 'Dendrobium Chrysotoxum (Fried Egg Orchid)',
    category: 'Dendrobium',
    description: 'Produces arching racemes carrying up to 20 honey-scented, glossy golden-yellow blooms with an orange-fringed lip. Sturdy club-shaped pseudobulbs.',
    origin: 'Southeast Asia, Myanmar, Thailand',
    careLevel: 'Easy',
    watering: 'Moderate during growth, reduce in winter',
    light: 'Bright filtered sunlight',
    bloomingSeason: 'Spring',
    rating: 4.5,
    featured: false,
    image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vanda-coerulea',
    name: 'Vanda Coerulea (Blue Orchid)',
    category: 'Vanda',
    description: 'One of the few genuine blue-flowering orchids in the world. Displays tessellated pale blue to deep violet blooms. Typically grown bare-root in wooden slat baskets.',
    origin: 'Northeast India, Northern Thailand, Burma',
    careLevel: 'Challenging',
    watering: 'Daily misting or soaking root systems',
    light: 'High light intensity and high humidity',
    bloomingSeason: 'Autumn to Early Winter',
    rating: 4.9,
    featured: true,
    image: 'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'vanda-sanderiana',
    name: 'Vanda Sanderiana (Waling-Waling)',
    category: 'Vanda',
    description: 'Hailed as the Queen of Philippine Flowers. Possesses massive, flat blossoms with pale pink upper petals and heavily tessellated chocolate-brown lower sepals.',
    origin: 'Mindanao, Philippines',
    careLevel: 'Challenging',
    watering: 'Frequent watering with rapid air circulation',
    light: 'Direct morning sun and filtered afternoon light',
    bloomingSeason: 'July to October',
    rating: 4.8,
    featured: false,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'phalaenopsis-bellina',
    name: 'Phalaenopsis Bellina',
    category: 'Phalaenopsis',
    description: 'A prized miniature species renowned for its intoxicating citrus scent and star-shaped flowers patterned in electric magenta, chartreuse, and white.',
    origin: 'Borneo',
    careLevel: 'Moderate',
    watering: 'Keep evenly moist, never dry out completely',
    light: 'Low to medium shade',
    bloomingSeason: 'Summer to Early Fall',
    rating: 4.7,
    featured: false,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cattleya-walkeriana',
    name: 'Cattleya Walkeriana (Noble Cattleya)',
    category: 'Cattleya',
    description: 'A compact Brazilian species that flowers directly from rhizomes rather than the apex of pseudobulbs. Flowers are intensely fragrant, wax-like rose-purple.',
    origin: 'Minas Gerais, Brazil',
    careLevel: 'Moderate',
    watering: 'Allow roots to dry thoroughly between waterings',
    light: 'Bright indirect to direct filtered morning sun',
    bloomingSeason: 'Late Fall to Winter',
    rating: 4.6,
    featured: false,
    image: 'https://images.unsplash.com/photo-1524355865-8b3687353f86?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Helper to retrieve an orchid by ID.
 * Supports string or numeric matching.
 */
export function getOrchidById(id) {
  if (!id) return null;
  const normalizedId = String(id).trim().toLowerCase();
  return ORCHIDS.find(orchid => orchid.id.toLowerCase() === normalizedId) || null;
}

/**
 * Helper to retrieve orchids by category.
 */
export function getOrchidsByCategory(category) {
  if (!category || category === 'All') {
    return ORCHIDS;
  }
  return ORCHIDS.filter(
    orchid => orchid.category.toLowerCase() === category.toLowerCase()
  );
}
