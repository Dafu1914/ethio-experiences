import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Listing } from '../models/Listing';

const IMG = (slug: string, n: number, alt: string) => ({
  url: `/images/listings/${slug}/${n}.png`,
  alt,
});

const stays = [
  {
    slug: 'simien-lodge-gondar',
    title: 'Simien Lodge — Highest Lodge in Africa',
    shortDescription:
      'Stay at 3,260m, the highest lodge in Africa, at the edge of the Simien Mountains.',
    description:
      'Simien Lodge offers comfortable rooms with panoramic mountain views, a warm restaurant, and easy access to the Simien Mountains National Park. The perfect base for treks to Ras Dashen and Gelada baboon sightings.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Gondar',
    region: 'Amhara',
    priceFrom: { amount: 4200, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('simien-mountains-3-day-trek', 1, 'Simien Lodge'),
      IMG('simien-mountains-3-day-trek', 2, 'Mountain view'),
      IMG('simien-mountains-3-day-trek', 3, 'Room'),
      IMG('simien-mountains-3-day-trek', 4, 'Restaurant'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.7, count: 132 },
    highlights: [
      'Highest lodge in Africa at 3,260m',
      'Panoramic views of the Simien Mountains',
      'Warm restaurant with local cuisine',
    ],
    included: ['Breakfast', 'WiFi in common areas', 'Mountain views'],
    notIncluded: ['Park entry fees', 'Guided treks'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    stay: {
      propertyType: 'lodge' as const,
      roomTypes: [
        { name: 'Standard Double', pricePerNight: 4200, capacity: 2 },
        { name: 'Deluxe Twin', pricePerNight: 5600, capacity: 2 },
        { name: 'Family Room', pricePerNight: 7800, capacity: 4 },
      ],
      amenities: ['Restaurant', 'Bar', 'Fireplace', 'WiFi', 'Mountain view', 'Free parking'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
  {
    slug: 'gheralta-lodge-hawzien',
    title: 'Gheralta Lodge — Boutique Stay near Rock Churches',
    shortDescription:
      'Hand-crafted stone lodge in the Gheralta Mountains, gateway to Tigray rock churches.',
    description:
      'Gheralta Lodge combines traditional Tigrayan architecture with modern comfort. Stone bungalows, a panoramic terrace, and a restaurant serving local cuisine. Perfect base for exploring the nearby rock-hewn churches of Tigray.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Hawzien',
    region: 'Tigray',
    priceFrom: { amount: 3800, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('danakil-depression-4-day-expedition', 1, 'Gheralta Lodge'),
      IMG('danakil-depression-4-day-expedition', 2, 'Gheralta view'),
      IMG('axum-obelisks-st-mary-zion-tour', 1, 'Stone bungalow'),
      IMG('axum-obelisks-st-mary-zion-tour', 2, 'Terrace view'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.6, count: 89 },
    highlights: [
      'Stone bungalows in Tigrayan style',
      'Panoramic terrace over Gheralta',
      'Restaurant with local and Italian cuisine',
    ],
    included: ['Breakfast', 'WiFi', 'Guided church tours (on request)'],
    notIncluded: ['Lunch', 'Dinner', 'Church entry fees'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    stay: {
      propertyType: 'lodge' as const,
      roomTypes: [
        { name: 'Standard Stone Room', pricePerNight: 3800, capacity: 2 },
        { name: 'Gheralta View Room', pricePerNight: 4900, capacity: 2 },
        { name: 'Family Bungalow', pricePerNight: 6800, capacity: 4 },
      ],
      amenities: ['Restaurant', 'Terrace', 'WiFi', 'Bar', 'Free parking', 'Airport shuttle'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
  {
    slug: 'harar-ras-hotel',
    title: 'Ras Hotel Harar — Inside the Walled City',
    shortDescription:
      'Historic hotel inside Harar Jugol, walking distance to hyena feeding and markets.',
    description:
      'Built in 1911, Ras Hotel sits inside the walled city of Harar (UNESCO World Heritage). Simple comfortable rooms, a leafy courtyard, and easy walking to Rimbaud House, spice markets, and the nightly hyena feeding.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Harar',
    region: 'Harari',
    priceFrom: { amount: 2400, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('harar-walled-city-hyena-feeding', 1, 'Ras Hotel Harar'),
      IMG('harar-walled-city-hyena-feeding', 2, 'Courtyard'),
      IMG('harar-walled-city-hyena-feeding', 3, 'Historic facade'),
      IMG('harar-walled-city-hyena-feeding', 4, 'Room'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.3, count: 74 },
    highlights: [
      'Inside the walled city of Harar',
      '1911 historic building',
      'Walking distance to hyena feeding',
    ],
    included: ['Breakfast', 'WiFi in lobby'],
    notIncluded: ['Dinner', 'Airport shuttle'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: false,
    status: 'published' as const,
    stay: {
      propertyType: 'hotel' as const,
      roomTypes: [
        { name: 'Standard Single', pricePerNight: 2400, capacity: 1 },
        { name: 'Standard Double', pricePerNight: 3200, capacity: 2 },
        { name: 'Deluxe Double', pricePerNight: 4400, capacity: 2 },
      ],
      amenities: ['Restaurant', 'Courtyard', 'WiFi', 'Laundry', 'Tour desk'],
      checkInTime: '13:00',
      checkOutTime: '11:00',
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
  {
    slug: 'addis-sheraton-hotel',
    title: 'Sheraton Addis — Luxury in the Capital',
    shortDescription:
      'Five-star luxury in Addis Ababa with pool, spa, and multiple restaurants.',
    description:
      'The Sheraton Addis is Ethiopia\'s most iconic luxury hotel. Set in lush gardens near the National Palace, it offers five restaurants, a spa, an outdoor pool, and elegant rooms with mountain or city views.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    priceFrom: { amount: 9800, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('addis-ababa-coffee-ceremony-tour', 1, 'Sheraton Addis'),
      IMG('addis-ababa-coffee-ceremony-tour', 2, 'Lobby'),
      IMG('addis-ababa-coffee-ceremony-tour', 3, 'Room'),
      IMG('addis-ababa-coffee-ceremony-tour', 4, 'Restaurant'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.8, count: 402 },
    highlights: [
      'Five-star luxury in the capital',
      'Heated outdoor pool & spa',
      'Five restaurants on-site',
    ],
    included: ['Breakfast', 'WiFi', 'Pool & gym access', 'Airport pickup'],
    notIncluded: ['Spa treatments', 'Dinner'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: false,
    status: 'published' as const,
    stay: {
      propertyType: 'hotel' as const,
      roomTypes: [
        { name: 'Deluxe King', pricePerNight: 9800, capacity: 2 },
        { name: 'Executive Suite', pricePerNight: 16500, capacity: 2 },
        { name: 'Family Suite', pricePerNight: 22000, capacity: 4 },
      ],
      amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'WiFi', 'Airport shuttle', 'Room service'],
      checkInTime: '15:00',
      checkOutTime: '12:00',
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
    },
  },
  {
    slug: 'lalibela-tukul-village',
    title: 'Lalibela Tukul Village — Traditional Round Huts',
    shortDescription:
      'Sleep in a traditional Ethiopian tukul with modern comforts, minutes from the rock churches.',
    description:
      'Tukul Village offers traditional round huts (tukuls) with modern plumbing and comfortable beds, built in local stone and thatch. Minutes from the 12th-century rock-hewn churches of Lalibela, with a restaurant serving local food.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Lalibela',
    region: 'Amhara',
    priceFrom: { amount: 3200, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('lalibela-rock-hewn-churches-day-tour', 1, 'Tukul Village'),
      IMG('lalibela-rock-hewn-churches-day-tour', 2, 'Tukul hut'),
      IMG('lalibela-rock-hewn-churches-day-tour', 3, 'Interior'),
      IMG('lalibela-rock-hewn-churches-day-tour', 4, 'Restaurant'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.5, count: 168 },
    highlights: [
      'Authentic Ethiopian tukul huts',
      '5 minutes from rock churches',
      'Local cuisine restaurant',
    ],
    included: ['Breakfast', 'WiFi in common areas', 'Church tours on request'],
    notIncluded: ['Church entry fees', 'Lunch', 'Dinner'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    stay: {
      propertyType: 'lodge' as const,
      roomTypes: [
        { name: 'Tukul Double', pricePerNight: 3200, capacity: 2 },
        { name: 'Tukul Twin', pricePerNight: 3600, capacity: 2 },
        { name: 'Family Tukul', pricePerNight: 5200, capacity: 4 },
      ],
      amenities: ['Restaurant', 'Bar', 'WiFi', 'Garden', 'Church tours'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
  {
    slug: 'bahir-dar-homestay',
    title: 'Bahir Dar Lakeview Homestay',
    shortDescription:
      'Family homestay overlooking Lake Tana with traditional meals and boat trips.',
    description:
      'Stay with a local Ethiopian family overlooking Lake Tana. Home-cooked meals, traditional coffee ceremonies, and easy access to the Blue Nile Falls and island monasteries. A genuine cultural experience.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Bahir Dar',
    region: 'Amhara',
    priceFrom: { amount: 1800, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('bahir-dar-blue-nile-falls-monasteries', 1, 'Lakeview Homestay'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 2, 'Lake Tana view'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 3, 'Family dinner'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 4, 'Garden'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.9, count: 214 },
    highlights: [
      'Lake Tana views',
      'Home-cooked Ethiopian meals',
      'Traditional coffee ceremony',
    ],
    included: ['Breakfast', 'Dinner', 'WiFi', 'Boat trips on request'],
    notIncluded: ['Lunch', 'Blue Nile Falls entry'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    stay: {
      propertyType: 'homestay' as const,
      roomTypes: [
        { name: 'Private Room', pricePerNight: 1800, capacity: 2 },
        { name: 'Family Room', pricePerNight: 2800, capacity: 4 },
      ],
      amenities: ['Home meals', 'WiFi', 'Garden', 'Boat trips', 'Coffee ceremony'],
      checkInTime: '15:00',
      checkOutTime: '10:00',
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
  {
    slug: 'danakil-desert-camp',
    title: 'Danakil Desert Camp — Erta Ale Base Camp',
    shortDescription:
      'Overnight desert camp near Erta Ale volcano with sleeping mats and hot meals.',
    description:
      'Basic but comfortable desert camp near the base of Erta Ale volcano. Sleeping mats on open-air platforms, hot meals prepared by Afar scouts, and unforgettable nights under desert stars. Toilets and basic washing facilities available.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Mekelle',
    region: 'Tigray',
    priceFrom: { amount: 2200, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('danakil-depression-4-day-expedition', 1, 'Danakil Camp'),
      IMG('danakil-depression-4-day-expedition', 2, 'Erta Ale at night'),
      IMG('danakil-depression-4-day-expedition', 3, 'Desert sunset'),
      IMG('danakil-depression-4-day-expedition', 4, 'Camp under stars'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.4, count: 58 },
    highlights: [
      'Sleep under desert stars',
      'Hot meals prepared by Afar scouts',
      'Erta Ale volcano base camp',
    ],
    included: ['Dinner', 'Breakfast', 'Sleeping mats', 'All permits'],
    notIncluded: ['Transport to camp', 'Tips'],
    cancellationPolicy: 'non-refundable' as const,
    isOriginal: false,
    status: 'published' as const,
    stay: {
      propertyType: 'camp' as const,
      roomTypes: [
        { name: 'Open-Air Platform (per person)', pricePerNight: 2200, capacity: 1 },
        { name: 'Private Tent', pricePerNight: 3800, capacity: 2 },
      ],
      amenities: ['Meals', 'Sleeping mats', 'Shared bathrooms', 'Afar guides'],
      checkInTime: '17:00',
      checkOutTime: '06:00',
      maxGuests: 2,
      bedrooms: 0,
      bathrooms: 1,
    },
  },
  {
    slug: 'omo-valley-lodge-jinka',
    title: 'Omo Valley Eco Lodge — Jinka',
    shortDescription:
      'Eco lodge in Jinka, base for exploring Omo Valley tribal cultures.',
    description:
      'Simple eco lodge in Jinka, the gateway to the Omo Valley. Comfortable rooms, a garden restaurant serving local dishes, and easy access to Mursi, Hamar, and Karo villages. Guides can be arranged on arrival.',
    type: 'stay' as const,
    category: 'stay' as const,
    city: 'Jinka',
    region: 'SNNPR',
    priceFrom: { amount: 2800, currency: 'ETB' as const },
    priceUnit: 'night' as const,
    images: [
      IMG('omo-valley-tribal-culture-5-day', 1, 'Omo Valley Lodge'),
      IMG('omo-valley-tribal-culture-5-day', 2, 'Garden'),
      IMG('omo-valley-tribal-culture-5-day', 3, 'Room'),
      IMG('omo-valley-tribal-culture-5-day', 4, 'Restaurant'),
    ],
    languages: ['en'],
    rating: { avg: 4.5, count: 96 },
    highlights: [
      'Gateway to the Omo Valley',
      'Garden restaurant with local dishes',
      'Guides available on request',
    ],
    included: ['Breakfast', 'WiFi in lobby'],
    notIncluded: ['Village entry fees', 'Guided tours'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: false,
    status: 'published' as const,
    stay: {
      propertyType: 'lodge' as const,
      roomTypes: [
        { name: 'Standard Double', pricePerNight: 2800, capacity: 2 },
        { name: 'Deluxe Room', pricePerNight: 4200, capacity: 2 },
        { name: 'Family Room', pricePerNight: 5600, capacity: 4 },
      ],
      amenities: ['Restaurant', 'Garden', 'WiFi', 'Bar', 'Free parking'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
    },
  },
];

async function seedStays() {
  await mongoose.connect(env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let vendor = await User.findOne({ email: 'vendor@ethio.local' });
  if (!vendor) {
    console.error('❌ vendor@ethio.local not found. Run `npm run seed` first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const stay of stays) {
    const exists = await Listing.findOne({ slug: stay.slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Listing.create({ ...stay, vendorId: vendor._id });
    created++;
  }

  console.log(`✅ Created ${created} stays (${skipped} already existed)`);
  await mongoose.disconnect();
  console.log('👋 Done');
}

seedStays().catch((e) => {
  console.error('❌ Seed failed', e);
  process.exit(1);
});