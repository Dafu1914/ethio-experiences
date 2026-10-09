import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Listing } from '../models/Listing';

const IMG = (slug: string, n: number, alt: string) => ({
  url: `/images/listings/${slug}/${n}.png`,
  alt,
});

const drivers = [
  {
    slug: 'tesfaye-4x4-driver-addis',
    title: 'Tesfaye — 4x4 Driver with Land Cruiser',
    shortDescription:
      'Experienced English-speaking driver with a Toyota Land Cruiser for highland and desert trips.',
    description:
      'Tesfaye has driven Ethiopia\'s toughest routes for 15 years — Simien Mountains, Danakil Depression, Omo Valley, and everything in between. His Land Cruiser is fully equipped for off-road travel, with AC, spare tires, and a roof rack. He speaks fluent English and knows the best local lunch spots along every route.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    priceFrom: { amount: 6500, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('danakil-depression-4-day-expedition', 1, 'Land Cruiser 4x4'),
      IMG('simien-mountains-3-day-trek', 2, 'Off-road driving'),
      IMG('omo-valley-tribal-culture-5-day', 3, 'Driver on the road'),
      IMG('addis-ababa-coffee-ceremony-tour', 4, 'Addis streets'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.9, count: 187 },
    highlights: [
      '15 years of Ethiopian driving experience',
      'Fluent English-speaking',
      'Fully equipped Land Cruiser for off-road',
      'Knows every region of Ethiopia',
    ],
    included: ['Driver', 'Fuel', 'Vehicle', 'Basic insurance', "Driver's meals"],
    notIncluded: ['Accommodation', 'Your meals', 'Park entry fees'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Land Cruiser 4x4',
      seats: 6,
      yearMade: 2018,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Addis Ababa',
      speaksEnglish: true,
      dailyRate: 6500,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
  {
    slug: 'abebe-minibus-driver-addis',
    title: 'Abebe — Group Minibus Driver',
    shortDescription:
      'Comfortable 12-seat minibus with experienced driver for group tours.',
    description:
      'Abebe drives a well-maintained 12-seat Toyota Hiace minibus, perfect for group tours, family trips, or corporate travel across Ethiopia. He has 10 years of experience driving between Addis, Lalibela, Gondar, and Bahir Dar.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    priceFrom: { amount: 5500, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('bahir-dar-blue-nile-falls-monasteries', 1, 'Minibus'),
      IMG('lalibela-rock-hewn-churches-day-tour', 2, 'Group on the road'),
      IMG('gondar-castles-half-day-tour', 3, 'Historic route'),
      IMG('addis-ababa-coffee-ceremony-tour', 4, 'City driving'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.7, count: 94 },
    highlights: [
      '12-seat Toyota Hiace',
      '10 years of group tour experience',
      'Comfortable for long drives',
    ],
    included: ['Driver', 'Fuel', 'Vehicle', 'Basic insurance'],
    notIncluded: ['Accommodation', 'Meals', 'Park fees'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: false,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Hiace Minibus',
      seats: 12,
      yearMade: 2020,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Addis Ababa',
      speaksEnglish: true,
      dailyRate: 5500,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
  {
    slug: 'yohannes-gondar-driver',
    title: 'Yohannes — Gondar & Simien Mountains Driver',
    shortDescription:
      'Local Gondar driver specialized in Simien Mountains treks and castle tours.',
    description:
      'Yohannes grew up in Gondar and knows every road, viewpoint, and hidden gem in the Simien Mountains. He drives a 4x4 Toyota with roof racks for trekking gear, and works closely with the mountain guides and lodges. Perfect for trekkers.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Gondar',
    region: 'Amhara',
    priceFrom: { amount: 5800, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('simien-mountains-3-day-trek', 1, 'Simien roads'),
      IMG('gondar-castles-half-day-tour', 2, 'Gondar castles'),
      IMG('simien-mountains-3-day-trek', 3, 'Mountain driving'),
      IMG('gondar-castles-half-day-tour', 4, 'Fasilides Bath'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.8, count: 112 },
    highlights: [
      'Local Gondar driver & Simien expert',
      'Roof racks for trekking gear',
      'Works with mountain guides',
    ],
    included: ['Driver', 'Fuel', '4x4 vehicle', 'Roof racks'],
    notIncluded: ['Accommodation', 'Meals', 'Park entry fees'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Land Cruiser',
      seats: 5,
      yearMade: 2017,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Gondar',
      speaksEnglish: true,
      dailyRate: 5800,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
  {
    slug: 'dawit-harar-driver',
    title: 'Dawit — Harar & Eastern Ethiopia Driver',
    shortDescription:
      'Harar-based driver with a comfortable sedan for eastern Ethiopia routes.',
    description:
      'Dawit drives a comfortable Toyota Corolla sedan for the Addis–Harar–Dire Dawa route. He knows every coffee shop, market, and hyena spot in Harar, and arranges the famous nightly hyena feeding for travelers.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Harar',
    region: 'Harari',
    priceFrom: { amount: 4800, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('harar-walled-city-hyena-feeding', 1, 'Harar streets'),
      IMG('harar-walled-city-hyena-feeding', 2, 'Walled city'),
      IMG('harar-walled-city-hyena-feeding', 3, 'Hyena spot'),
      IMG('harar-walled-city-hyena-feeding', 4, 'Old town gate'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.6, count: 78 },
    highlights: [
      'Harar local — knows every hidden gem',
      'Sedan for comfortable long drives',
      'Arranges hyena feeding',
    ],
    included: ['Driver', 'Fuel', 'Vehicle', 'Basic insurance'],
    notIncluded: ['Accommodation', 'Meals'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: false,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Corolla Sedan',
      seats: 4,
      yearMade: 2019,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Harar',
      speaksEnglish: true,
      dailyRate: 4800,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
  {
    slug: 'girma-lalibela-driver',
    title: 'Girma — Lalibela & Northern Route Driver',
    shortDescription:
      'Lalibela-based driver specializing in historic church tours.',
    description:
      'Girma has driven the northern historic circuit — Lalibela, Gondar, Axum, Bahir Dar — for 12 years. He speaks English and knows the best times to visit each church to avoid crowds. Comfortable 4x4 for the mountain roads.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Lalibela',
    region: 'Amhara',
    priceFrom: { amount: 5200, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('lalibela-rock-hewn-churches-day-tour', 1, 'Lalibela roads'),
      IMG('axum-obelisks-st-mary-zion-tour', 2, 'Axum'),
      IMG('lalibela-rock-hewn-churches-day-tour', 3, 'Churches'),
      IMG('gondar-castles-half-day-tour', 4, 'Gondar'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.8, count: 143 },
    highlights: [
      '12 years on the historic circuit',
      'Knows the best times to visit churches',
      'Comfortable 4x4 for mountain roads',
    ],
    included: ['Driver', 'Fuel', '4x4 vehicle', 'Basic insurance'],
    notIncluded: ['Accommodation', 'Meals', 'Church entry fees'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Land Cruiser',
      seats: 5,
      yearMade: 2018,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Lalibela',
      speaksEnglish: true,
      dailyRate: 5200,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
  {
    slug: 'mulu-omo-valley-driver',
    title: 'Mulu — Omo Valley 4x4 Driver & Guide',
    shortDescription:
      'Southern Ethiopia expert driver with deep knowledge of Omo Valley cultures.',
    description:
      'Mulu is a Jinka-based driver with 10 years of experience in the Omo Valley. He knows the Mursi, Hamar, Karo, and Dassanech communities, speaks their local greetings, and helps travelers respectfully engage with each group. Roof tent available on request.',
    type: 'driver' as const,
    category: 'transport' as const,
    city: 'Jinka',
    region: 'SNNPR',
    priceFrom: { amount: 6200, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('omo-valley-tribal-culture-5-day', 1, 'Omo Valley roads'),
      IMG('omo-valley-tribal-culture-5-day', 2, 'Village visit'),
      IMG('omo-valley-tribal-culture-5-day', 3, 'Landscape'),
      IMG('omo-valley-tribal-culture-5-day', 4, 'Camp'),
    ],
    languages: ['en'],
    rating: { avg: 4.9, count: 96 },
    highlights: [
      '10 years in Omo Valley',
      'Speaks local greetings',
      'Respectful cultural access',
      'Roof tent available',
    ],
    included: ['Driver', 'Fuel', '4x4 vehicle', 'Basic insurance'],
    notIncluded: ['Village entry fees', 'Accommodation', 'Meals'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    driver: {
      vehicleType: 'Toyota Land Cruiser 4x4',
      seats: 6,
      yearMade: 2019,
      hasAC: true,
      hasWifi: false,
      baseCity: 'Jinka',
      speaksEnglish: true,
      dailyRate: 6200,
      perDayIncluded: ['8 hours driving', 'Fuel', 'Driver'],
    },
  },
];

async function seedDrivers() {
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

  for (const driver of drivers) {
    const exists = await Listing.findOne({ slug: driver.slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Listing.create({ ...driver, vendorId: vendor._id });
    created++;
  }

  console.log(`✅ Created ${created} drivers (${skipped} already existed)`);
  await mongoose.disconnect();
  console.log('👋 Done');
}

seedDrivers().catch((e) => {
  console.error('❌ Seed failed', e);
  process.exit(1);
});