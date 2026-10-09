import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Listing } from '../models/Listing';

const IMG = (slug: string, n: number, alt: string) => ({
  url: `/images/listings/${slug}/${n}.png`,
  alt,
});

const guides = [
  {
    slug: 'abebe-addis-history-coffee-guide',
    title: 'Abebe — Addis History & Coffee Guide',
    shortDescription:
      'Licensed Addis guide specializing in history, coffee culture, and markets.',
    description:
      'Abebe has guided travelers through Addis Ababa for 12 years. He is a licensed tour guide and coffee enthusiast — he knows every roastery, Merkato alley, and historical site in the capital. His tours cover the National Museum (Lucy), Holy Trinity Cathedral, Merkato market, and a traditional coffee ceremony.',
    type: 'guide' as const,
    category: 'culture' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    priceFrom: { amount: 3200, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('addis-ababa-coffee-ceremony-tour', 1, 'Abebe guiding'),
      IMG('addis-ababa-coffee-ceremony-tour', 2, 'Coffee ceremony'),
      IMG('entoto-park-adis-view-hike', 3, 'Entoto view'),
      IMG('addis-ababa-coffee-ceremony-tour', 4, 'Merkato market'),
    ],
    languages: ['en', 'am', 'fr'],
    rating: { avg: 4.9, count: 212 },
    highlights: [
      'Licensed tour guide with 12 years experience',
      'Coffee ceremony specialist',
      'Knows every hidden gem in Addis',
      'Speaks English, Amharic, French',
    ],
    included: ['Guiding', 'Coffee ceremony', 'Bottled water'],
    notIncluded: ['Museum entry fees', 'Lunch', 'Transport'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['History', 'Coffee culture', 'Markets', 'City walks'],
      yearsExperience: 12,
      regions: ['Addis Ababa', 'Entoto'],
      certifications: ['Licensed tour guide (Ethiopia)', 'First aid'],
      dayRate: 3200,
      maxGroupSize: 8,
      mode: 'full-day' as const,
    },
  },
  {
    slug: 'fatuma-harar-culture-guide',
    title: 'Fatuma — Harar Culture & Hyena Guide',
    shortDescription:
      'Female Harar guide specializing in Islamic history, markets, and hyena feeding.',
    description:
      'Fatuma is a Harar-born cultural guide who has been leading walking tours of the walled city for 8 years. She specializes in Harar\'s unique Islamic heritage, its 82 mosques, Rimbaud House, spice markets, and the nightly hyena feeding ritual. A safe, friendly female guide for solo and group travelers.',
    type: 'guide' as const,
    category: 'culture' as const,
    city: 'Harar',
    region: 'Harari',
    priceFrom: { amount: 2800, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('harar-walled-city-hyena-feeding', 1, 'Fatuma guiding'),
      IMG('harar-walled-city-hyena-feeding', 2, 'Walled city'),
      IMG('harar-walled-city-hyena-feeding', 3, 'Hyena feeding'),
      IMG('harar-walled-city-hyena-feeding', 4, 'Harar market'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.9, count: 156 },
    highlights: [
      'Female guide — popular with solo travelers',
      'Islamic history & architecture specialist',
      'Arranges hyena feeding access',
    ],
    included: ['Guiding', 'Hyena feeding fee', 'Bottled water'],
    notIncluded: ['Meals', 'Transport'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['Culture', 'Islamic history', 'Markets', 'Hyena feeding'],
      yearsExperience: 8,
      regions: ['Harar', 'Dire Dawa'],
      certifications: ['Licensed tour guide (Ethiopia)'],
      dayRate: 2800,
      maxGroupSize: 6,
      mode: 'half-day' as const,
    },
  },
  {
    slug: 'dawit-simien-trekking-guide',
    title: 'Dawit — Simien Mountains Trekking Guide',
    shortDescription:
      'Certified mountain guide for Simien treks, Ras Dashen, and Gelada baboon tours.',
    description:
      'Dawit is a certified mountain guide who has led over 500 treks in the Simien Mountains National Park. He specializes in multi-day treks to Ras Dashen, Gelada baboon tracking, and Walia ibex spotting. He works with local scouts and mule handlers to ensure safe, well-supported treks.',
    type: 'guide' as const,
    category: 'trek' as const,
    city: 'Gondar',
    region: 'Amhara',
    priceFrom: { amount: 4500, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('simien-mountains-3-day-trek', 1, 'Dawit on trek'),
      IMG('simien-mountains-3-day-trek', 2, 'Mountain ridge'),
      IMG('simien-mountains-3-day-trek', 3, 'Gelada baboon'),
      IMG('simien-mountains-3-day-trek', 4, 'Camp in Simien'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 5.0, count: 178 },
    highlights: [
      '500+ Simien treks led',
      'Ras Dashen summit specialist',
      'Gelada & Walia ibex tracking',
      'Works with local scouts & mules',
    ],
    included: ['Guiding', 'Park coordination', 'First aid'],
    notIncluded: ['Park entry fees', 'Camping gear', 'Meals', 'Mules'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['Trekking', 'Wildlife', 'Mountains', 'Camping'],
      yearsExperience: 15,
      regions: ['Simien Mountains', 'Gondar', 'Ras Dashen'],
      certifications: [
        'Certified mountain guide',
        'Wilderness first responder',
      ],
      dayRate: 4500,
      maxGroupSize: 10,
      mode: 'multi-day' as const,
    },
  },
  {
    slug: 'mulu-omo-valley-ethnography-guide',
    title: 'Mulu — Omo Valley Ethnography Guide',
    shortDescription:
      'Specialist guide for Mursi, Hamar, Karo, and Dassanech cultural visits.',
    description:
      'Mulu has studied the cultures of the Omo Valley for 10 years and speaks basic Mursi, Hamar, and Karo greetings. He leads respectful, non-exploitative visits to villages, explaining the traditions, body art, and rituals of each community. Ideal for photographers and anthropology enthusiasts.',
    type: 'guide' as const,
    category: 'culture' as const,
    city: 'Jinka',
    region: 'SNNPR',
    priceFrom: { amount: 4200, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('omo-valley-tribal-culture-5-day', 1, 'Omo Valley'),
      IMG('omo-valley-tribal-culture-5-day', 2, 'Village visit'),
      IMG('omo-valley-tribal-culture-5-day', 3, 'Tribal ceremony'),
      IMG('omo-valley-tribal-culture-5-day', 4, 'Landscape'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 4.8, count: 92 },
    highlights: [
      'Speaks basic Mursi, Hamar, Karo greetings',
      'Respectful, non-exploitative access',
      'Specialist for photographers & anthropologists',
    ],
    included: ['Guiding', 'Village coordination', 'Cultural briefing'],
    notIncluded: ['Village entry fees', 'Transport', 'Meals'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['Ethnography', 'Tribal cultures', 'Photography', 'Anthropology'],
      yearsExperience: 10,
      regions: ['Omo Valley', 'Jinka', 'Turmi', 'Kibish'],
      certifications: ['Licensed tour guide (Ethiopia)'],
      dayRate: 4200,
      maxGroupSize: 6,
      mode: 'multi-day' as const,
    },
  },
  {
    slug: 'yohannes-lalibela-church-historian',
    title: 'Yohannes — Lalibela Church History Guide',
    shortDescription:
      'Deacon and church historian guiding the rock-hewn churches of Lalibela.',
    description:
      'Yohannes is a deacon of the Ethiopian Orthodox Church and has guided pilgrims and travelers through Lalibela\'s 11 rock-hewn churches for 15 years. He explains the theology, symbolism, and history of each church in depth. Access to special ceremonies can be arranged.',
    type: 'guide' as const,
    category: 'culture' as const,
    city: 'Lalibela',
    region: 'Amhara',
    priceFrom: { amount: 3000, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('lalibela-rock-hewn-churches-day-tour', 1, 'Lalibela churches'),
      IMG('lalibela-rock-hewn-churches-day-tour', 2, 'Priest at church'),
      IMG('lalibela-rock-hewn-churches-day-tour', 3, 'St. George Church'),
      IMG('lalibela-rock-hewn-churches-day-tour', 4, 'Ancient tunnels'),
    ],
    languages: ['en', 'am', 'it'],
    rating: { avg: 4.9, count: 224 },
    highlights: [
      'Deacon of the Ethiopian Orthodox Church',
      '15 years guiding pilgrims',
      'Theology, symbolism & history',
      'Access to special ceremonies',
    ],
    included: ['Guiding', 'Church orientation', 'Bottled water'],
    notIncluded: ['Church entry fees', 'Meals', 'Transport'],
    cancellationPolicy: '24h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['Church history', 'Theology', 'Pilgrimage', 'Religious art'],
      yearsExperience: 15,
      regions: ['Lalibela', 'Northern historic circuit'],
      certifications: ['Ethiopian Orthodox deacon', 'Licensed tour guide'],
      dayRate: 3000,
      maxGroupSize: 12,
      mode: 'full-day' as const,
    },
  },
  {
    slug: 'sara-ethiopia-birdwatching-guide',
    title: 'Sara — Ethiopia Birdwatching Guide',
    shortDescription:
      'Ornithologist guiding birdwatching tours across the Rift Valley and highlands.',
    description:
      'Sara is an ornithologist and licensed birdwatching guide. She has recorded over 500 of Ethiopia\'s 850+ bird species, including 20+ endemics like the Ethiopian wolf, Wattled ibis, and Blue-winged goose. Tours cover the Rift Valley lakes, Bale Mountains, and Awash National Park.',
    type: 'guide' as const,
    category: 'wildlife' as const,
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    priceFrom: { amount: 4000, currency: 'ETB' as const },
    priceUnit: 'day' as const,
    images: [
      IMG('entoto-park-adis-view-hike', 1, 'Birdwatching'),
      IMG('entoto-park-adis-view-hike', 2, 'Rift Valley'),
      IMG('bahir-dar-blue-nile-falls-monasteries', 3, 'Lake Tana birds'),
      IMG('entoto-park-adis-view-hike', 4, 'Highland trail'),
    ],
    languages: ['en', 'am'],
    rating: { avg: 5.0, count: 84 },
    highlights: [
      'Ornithologist — 500+ species recorded',
      'Ethiopian endemics specialist',
      'Rift Valley, Bale, Awash tours',
      'Binoculars available on request',
    ],
    included: ['Guiding', 'Bird checklist', 'Bottled water'],
    notIncluded: ['Transport', 'Park entry fees', 'Meals'],
    cancellationPolicy: '48h-free' as const,
    isOriginal: true,
    status: 'published' as const,
    guide: {
      specialties: ['Birdwatching', 'Wildlife', 'Endemics', 'Photography'],
      yearsExperience: 9,
      regions: ['Rift Valley', 'Bale Mountains', 'Awash', 'Addis Ababa'],
      certifications: ['Licensed birdwatching guide', 'Ornithology certification'],
      dayRate: 4000,
      maxGroupSize: 6,
      mode: 'full-day' as const,
    },
  },
];

async function seedGuides() {
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

  for (const guide of guides) {
    const exists = await Listing.findOne({ slug: guide.slug });
    if (exists) {
      skipped++;
      continue;
    }
    await Listing.create({ ...guide, vendorId: vendor._id });
    created++;
  }

  console.log(`✅ Created ${created} guides (${skipped} already existed)`);
  await mongoose.disconnect();
  console.log('👋 Done');
}

seedGuides().catch((e) => {
  console.error('❌ Seed failed', e);
  process.exit(1);
});