import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Listing } from '../models/Listing';

// Local images live in: apps/web/public/images/listings/<slug>/1.png ...
const IMG = (slug: string, n: number, alt: string) => ({
  url: `/images/listings/${slug}/${n}.png`,
  alt,
});

const listings = [
  {
    slug: 'lalibela-rock-hewn-churches-day-tour',
    title: 'Lalibela: Rock-Hewn Churches Full-Day Tour',
    shortDescription: 'Explore the 12th-century rock-hewn churches of Lalibela with a local guide.',
    description:
      'Discover the UNESCO-listed rock-hewn churches of Lalibela — Ethiopia\'s "New Jerusalem." Visit all 11 medieval monolithic churches carved from solid rock in the 12th century. Your local guide shares the history, legends, and religious traditions still alive today.',
    category: 'culture' as const,
    city: 'Lalibela',
    region: 'Amhara',
    images: [
      IMG('lalibela-rock-hewn-churches-day-tour', 1, 'Lalibela rock church'),
      IMG('lalibela-rock-hewn-churches-day-tour', 2, 'Priest at Lalibela'),
      IMG('lalibela-rock-hewn-churches-day-tour', 3, 'Stone carved church'),
      IMG('lalibela-rock-hewn-churches-day-tour', 4, 'Lalibela pilgrims'),
    ],
    durationMinutes: 480,
    groupSize: 10,
    languages: ['en', 'am'],
    priceFrom: { amount: 2400, currency: 'ETB' as const },
    rating: { avg: 4.9, count: 412 },
    highlights: [
      'Visit all 11 rock-hewn churches',
      'Learn from a certified local guide',
      'See the famous St. George Church',
      'Walk through ancient tunnels and trenches',
    ],
    included: ['Professional guide', 'Entrance fees', 'Bottled water', 'Hotel pickup'],
    notIncluded: ['Lunch', 'Tips', 'Personal expenses'],
    meetingPoint: { name: 'Lalibela Main Gate', address: 'Lalibela, Amhara' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    urgencyBadge: 'Likely to sell out',
    status: 'published' as const,
  },
  {
    slug: 'simien-mountains-3-day-trek',
    title: 'Simien Mountains: 3-Day Guided Trek to Ras Dashen',
    shortDescription: 'Trek Ethiopia\'s dramatic highlands and spot Gelada baboons and Walia ibex.',
    description:
      'A three-day trek through the Simien Mountains National Park — a UNESCO World Heritage Site. Hike past dramatic escarpments, spot endemic Gelada baboons and Walia ibex, and camp under the stars near Ethiopia\'s highest peak, Ras Dashen.',
    category: 'trek' as const,
    city: 'Gondar',
    region: 'Amhara',
    images: [
      IMG('simien-mountains-3-day-trek', 1, 'Simien Mountains'),
      IMG('simien-mountains-3-day-trek', 2, 'Mountain ridge'),
      IMG('simien-mountains-3-day-trek', 3, 'Gelada baboon'),
      IMG('simien-mountains-3-day-trek', 4, 'Camp under stars'),
    ],
    durationMinutes: 4320,
    groupSize: 8,
    languages: ['en'],
    priceFrom: { amount: 12500, currency: 'ETB' as const },
    rating: { avg: 4.8, count: 187 },
    highlights: [
      'See Gelada baboons and Walia ibex',
      'Camp under African stars',
      'Summit viewpoint near Ras Dashen',
      'Expert mountain guide and scouts',
    ],
    included: ['Mountain guide', 'Park fees', 'Camping gear', 'All meals', 'Mule support'],
    notIncluded: ['Alcoholic drinks', 'Tips', 'Travel insurance'],
    meetingPoint: { name: 'Gondar Bus Station', address: 'Gondar, Amhara' },
    cancellationPolicy: '48h-free' as const,
    isOriginal: false,
    urgencyBadge: 'Small group',
    status: 'published' as const,
  },
  {
    slug: 'danakil-depression-4-day-expedition',
    title: 'Danakil Depression: 4-Day Expedition to Erta Ale & Dallol',
    shortDescription: 'Visit the hottest place on Earth — lava lakes, salt flats, and acid springs.',
    description:
      'The Danakil Depression is one of the most extreme places on Earth. Walk on the colorful sulfur springs of Dallol, watch the lava lake of Erta Ale volcano at night, and meet Afar salt miners still working as they have for centuries.',
    category: 'trek' as const,
    city: 'Mekelle',
    region: 'Tigray',
    images: [
      IMG('danakil-depression-4-day-expedition', 1, 'Dallol springs'),
      IMG('danakil-depression-4-day-expedition', 2, 'Erta Ale volcano'),
      IMG('danakil-depression-4-day-expedition', 3, 'Salt flats'),
      IMG('danakil-depression-4-day-expedition', 4, 'Desert sunset'),
    ],
    durationMinutes: 5760,
    groupSize: 12,
    languages: ['en', 'am'],
    priceFrom: { amount: 22000, currency: 'ETB' as const },
    rating: { avg: 4.7, count: 96 },
    highlights: [
      'Watch Erta Ale lava lake at night',
      'Explore Dallol sulfur springs',
      'Meet Afar salt miners',
      'Camp in the Danakil desert',
    ],
    included: ['4x4 transport', 'Afar guide + scouts', 'All meals', 'Camping gear', 'Permits'],
    notIncluded: ['Flights', 'Tips', 'Insurance'],
    meetingPoint: { name: 'Mekelle Airport', address: 'Mekelle, Tigray' },
    cancellationPolicy: 'non-refundable' as const,
    isOriginal: false,
    urgencyBadge: 'Adventure',
    status: 'published' as const,
  },
  {
    slug: 'addis-ababa-coffee-ceremony-tour',
    title: 'Addis Ababa: Coffee Ceremony & Merkato Walking Tour',
    shortDescription: 'Discover the birthplace of coffee with a traditional ceremony and market walk.',
    description:
      'Ethiopia is the birthplace of coffee. Experience a traditional jebena coffee ceremony with roasting, brewing, and incense; then explore Merkato — one of Africa\'s largest open-air markets — with a local guide.',
    category: 'culture' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    images: [
      IMG('addis-ababa-coffee-ceremony-tour', 1, 'Coffee ceremony'),
      IMG('addis-ababa-coffee-ceremony-tour', 2, 'Coffee beans'),
      IMG('addis-ababa-coffee-ceremony-tour', 3, 'Market'),
      IMG('addis-ababa-coffee-ceremony-tour', 4, 'Addis street'),
    ],
    durationMinutes: 300,
    groupSize: 12,
    languages: ['en', 'am'],
    priceFrom: { amount: 1800, currency: 'ETB' as const },
    rating: { avg: 4.8, count: 623 },
    highlights: [
      'Traditional jebena coffee ceremony',
      'Walk through Merkato market',
      'Taste Ethiopian snacks',
      'Local guide & small group',
    ],
    included: ['Guide', 'Coffee & snacks', 'Hotel pickup within Addis'],
    notIncluded: ['Lunch', 'Tips'],
    meetingPoint: { name: 'Meskel Square', address: 'Addis Ababa' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    urgencyBadge: 'Top rated',
    status: 'published' as const,
  },
  {
    slug: 'gondar-castles-half-day-tour',
    title: 'Gondar: Royal Enclosure & Castles Half-Day Tour',
    shortDescription: 'Explore the "Camelot of Africa" — 17th-century castles and churches.',
    description:
      'Visit the Royal Enclosure of Gondar, home to a stunning complex of 17th-century castles built by Emperor Fasilides and his successors. Also see Fasilides\' Bath and the beautifully painted Debre Berhan Selassie Church.',
    category: 'culture' as const,
    city: 'Gondar',
    region: 'Amhara',
    images: [
      IMG('gondar-castles-half-day-tour', 1, 'Gondar castle'),
      IMG('gondar-castles-half-day-tour', 2, 'Ethiopian church'),
      IMG('gondar-castles-half-day-tour', 3, 'Stone walls'),
      IMG('gondar-castles-half-day-tour', 4, 'Historic architecture'),
    ],
    durationMinutes: 240,
    groupSize: 15,
    languages: ['en', 'am'],
    priceFrom: { amount: 1600, currency: 'ETB' as const },
    rating: { avg: 4.6, count: 288 },
    highlights: [
      'UNESCO World Heritage castles',
      'Debre Berhan Selassie Church frescoes',
      'Fasilides\' Bath',
      'Expert local guide',
    ],
    included: ['Guide', 'Entrance fees', 'Bottled water'],
    notIncluded: ['Lunch', 'Tips'],
    meetingPoint: { name: 'Gondar Royal Enclosure', address: 'Gondar, Amhara' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: false,
    status: 'published' as const,
  },
  {
    slug: 'axum-obelisks-st-mary-zion-tour',
    title: 'Axum: Ancient Obelisks & St. Mary of Zion Tour',
    shortDescription: 'Discover the ancient capital of the Aksumite Empire — obelisks and the Ark\'s reputed home.',
    description:
      'Axum was the capital of the powerful Aksumite Empire. See giant stelae, the underground tombs of ancient kings, the Queen of Sheba\'s Bath, and St. Mary of Zion — reputed home of the Ark of the Covenant.',
    category: 'culture' as const,
    city: 'Axum',
    region: 'Tigray',
    images: [
      IMG('axum-obelisks-st-mary-zion-tour', 1, 'Axum obelisk'),
      IMG('axum-obelisks-st-mary-zion-tour', 2, 'Ancient ruins'),
      IMG('axum-obelisks-st-mary-zion-tour', 3, 'Stone monolith'),
      IMG('axum-obelisks-st-mary-zion-tour', 4, 'Historic site'),
    ],
    durationMinutes: 300,
    groupSize: 12,
    languages: ['en', 'am'],
    priceFrom: { amount: 1900, currency: 'ETB' as const },
    rating: { avg: 4.7, count: 176 },
    highlights: [
      'Giant Aksumite obelisks',
      'Underground royal tombs',
      'St. Mary of Zion church',
      'Queen of Sheba\'s Bath',
    ],
    included: ['Guide', 'Entrance fees', 'Bottled water'],
    notIncluded: ['Lunch', 'Tips'],
    meetingPoint: { name: 'Axum Obelisk Park', address: 'Axum, Tigray' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: false,
    status: 'published' as const,
  },
  {
    slug: 'harar-walled-city-hyena-feeding',
    title: 'Harar: Walled City Tour & Hyena Feeding Experience',
    shortDescription: 'Walk the ancient walls of Harar and watch the famous nightly hyena feeding.',
    description:
      'Harar is a UNESCO World Heritage walled city with 82 mosques and a unique culture. Wander the colorful alleys of Jugol, visit Arthur Rimbaud\'s house, and at dusk watch the famous "hyena men" feed wild spotted hyenas by hand.',
    category: 'culture' as const,
    city: 'Harar',
    region: 'Harari',
    images: [
      IMG('harar-walled-city-hyena-feeding', 1, 'Harar old town'),
      IMG('harar-walled-city-hyena-feeding', 2, 'Colorful walls'),
      IMG('harar-walled-city-hyena-feeding', 3, 'Hyena at dusk'),
      IMG('harar-walled-city-hyena-feeding', 4, 'Ancient gate'),
    ],
    durationMinutes: 300,
    groupSize: 10,
    languages: ['en', 'am'],
    priceFrom: { amount: 1700, currency: 'ETB' as const },
    rating: { avg: 4.8, count: 342 },
    highlights: [
      'UNESCO-listed Jugol walled city',
      'Nightly hyena feeding',
      'Arthur Rimbaud House',
      'Colorful Harari markets',
    ],
    included: ['Guide', 'Entrance fees', 'Hyena feeding fee'],
    notIncluded: ['Dinner', 'Tips'],
    meetingPoint: { name: 'Harar Old Town Gate', address: 'Harar, Harari' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    urgencyBadge: 'Top rated',
    status: 'published' as const,
  },
  {
    slug: 'bahir-dar-blue-nile-falls-monasteries',
    title: 'Bahir Dar: Blue Nile Falls & Lake Tana Monasteries',
    shortDescription: 'Boat to ancient island monasteries and hike to the Blue Nile Falls.',
    description:
      'Explore Lake Tana\'s ancient island monasteries with their vivid wall paintings, then drive to the Blue Nile Falls — known locally as "Tis Abay" (smoking water). Full-day tour from Bahir Dar with boat and hiking.',
    category: 'tour' as const,
    city: 'Bahir Dar',
    region: 'Amhara',
    images: [
      IMG('bahir-dar-blue-nile-falls-monasteries', 1, 'Blue Nile Falls'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 2, 'Lake Tana boat'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 3, 'Island monastery'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 4, 'Ethiopian countryside'),
    ],
    durationMinutes: 480,
    groupSize: 12,
    languages: ['en', 'am'],
    priceFrom: { amount: 2600, currency: 'ETB' as const },
    rating: { avg: 4.7, count: 208 },
    highlights: [
      'Boat trip on Lake Tana',
      'Visit Ura Kidane Mehret monastery',
      'Hike to Blue Nile Falls',
      'Local coffee stop',
    ],
    included: ['Guide', 'Boat', 'Entrance fees', 'Hotel pickup'],
    notIncluded: ['Lunch', 'Tips'],
    meetingPoint: { name: 'Bahir Dar Pier', address: 'Bahir Dar, Amhara' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: false,
    status: 'published' as const,
  },
  {
    slug: 'omo-valley-tribal-culture-5-day',
    title: 'Omo Valley: 5-Day Tribal Culture Immersion',
    shortDescription: 'Meet the Mursi, Hamar, and Karo peoples in Ethiopia\'s deep south.',
    description:
      'A five-day journey through the Omo Valley, home to some of Africa\'s most distinctive cultures. Meet Mursi, Hamar, Karo, and Dassanech communities respectfully with a local guide, and see the famous Hamar bull-jumping ceremony (seasonal).',
    category: 'culture' as const,
    city: 'Jinka',
    region: 'SNNPR',
    images: [
      IMG('omo-valley-tribal-culture-5-day', 1, 'Omo Valley village'),
      IMG('omo-valley-tribal-culture-5-day', 2, 'Tribal ceremony'),
      IMG('omo-valley-tribal-culture-5-day', 3, 'African landscape'),
      IMG('omo-valley-tribal-culture-5-day', 4, 'Camp'),
    ],
    durationMinutes: 7200,
    groupSize: 8,
    languages: ['en'],
    priceFrom: { amount: 18500, currency: 'ETB' as const },
    rating: { avg: 4.6, count: 74 },
    highlights: [
      'Meet Mursi & Hamar communities',
      'Karo village by the Omo River',
      'Local market visits',
      'Respectful cultural immersion',
    ],
    included: ['4x4 transport', 'Driver-guide', 'All meals', 'Lodging', 'Village fees'],
    notIncluded: ['Flights to Jinka', 'Tips', 'Insurance'],
    meetingPoint: { name: 'Jinka Airport', address: 'Jinka, SNNPR' },
    cancellationPolicy: '48h-free' as const,
    isOriginal: false,
    urgencyBadge: 'Small group',
    status: 'published' as const,
  },
  {
    slug: 'entoto-park-adis-view-hike',
    title: 'Addis Ababa: Entoto Park Hike & City Viewpoint',
    shortDescription: 'Half-day hike above Addis with panoramic views and a coffee stop.',
    description:
      'Escape the city for a half-day hike in the Entoto hills above Addis Ababa. Enjoy panoramic views over the capital, visit the Entoto Maryam church, and finish with a traditional coffee ceremony.',
    category: 'tour' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    images: [
      IMG('entoto-park-adis-view-hike', 1, 'Entoto hills'),
      IMG('entoto-park-adis-view-hike', 2, 'Hiking trail'),
      IMG('entoto-park-adis-view-hike', 3, 'Viewpoint'),
      IMG('entoto-park-adis-view-hike', 4, 'Coffee'),
    ],
    durationMinutes: 240,
    groupSize: 14,
    languages: ['en', 'am'],
    priceFrom: { amount: 1400, currency: 'ETB' as const },
    rating: { avg: 4.7, count: 396 },
    highlights: [
      'Panoramic views of Addis',
      'Entoto Maryam church',
      'Eucalyptus forest trail',
      'Traditional coffee finish',
    ],
    included: ['Guide', 'Snacks', 'Coffee', 'Hotel pickup'],
    notIncluded: ['Lunch', 'Tips'],
    meetingPoint: { name: 'Entoto Park Entrance', address: 'Addis Ababa' },
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
  },
];

async function seed() {
  await mongoose.connect(env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let vendor = await User.findOne({ email: 'vendor@ethio.local' });
  if (!vendor) {
    const bcrypt = (await import('bcryptjs')).default;
    vendor = await User.create({
      name: 'Ethio Demo Vendor',
      email: 'vendor@ethio.local',
      passwordHash: await bcrypt.hash('vendor123', 12),
      role: 'vendor',
      emailVerified: true,
    });
    console.log('👤 Created demo vendor: vendor@ethio.local / vendor123');
  }

  await Listing.deleteMany({});
  console.log('🗑️  Cleared existing listings');

  const withVendor = listings.map((l) => ({ ...l, vendorId: vendor!._id }));
  await Listing.insertMany(withVendor);
  console.log(`✅ Seeded ${withVendor.length} listings`);

  await mongoose.disconnect();
  console.log('👋 Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});