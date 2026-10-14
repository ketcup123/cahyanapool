
export const brand = {
  name: 'CahyanaPool',
  tagline: 'Ruang air, ruang tumbuh.',
  since: '1993',
};

// Informasi alamat dan Google Maps
const address =
  import.meta.env.VITE_CONTACT_ADDRESS ||
  'Jalan Masjid Al-akhyar No.45E RT.40/RW.02';

const mapsSearch = `https://maps.app.goo.gl/YvGD3LqGpQKimVbL7?g_st=aw${encodeURIComponent(
  address
)}`;

// Informasi kontak CahyanaPool
export const contacts = {
  mainWhatsApp: import.meta.env.VITE_WHATSAPP_MAIN || '6281213200055',
  poolWhatsApp: import.meta.env.VITE_WHATSAPP_POOL || '6285880350010',
  fishWhatsApp: import.meta.env.VITE_WHATSAPP_FISH || '62857754011850',
  gardenWhatsApp: import.meta.env.VITE_WHATSAPP_GARDEN || '6285880350010',

  email:
    import.meta.env.VITE_CONTACT_EMAIL ||
    'cahyanapool@gmail.com',

  address,

instagram:
    import.meta.env.VITE_INSTAGRAM_URL ||
    'https://instagram.com/cahyanapool?xtok=MWw2NHFoNmpoM21tbg%3D%3D',

  tiktok:
    import.meta.env.VITE_TIKTOK_URL ||
    'https://www.tiktok.com/@inialosha',

  maps: import.meta.env.VITE_GOOGLE_MAPS_URL || mapsSearch,
};

// Kategori portofolio
export const categories = [
  { id: 'kolam-renang', label: 'Kolam Renang' },
  { id: 'kolam-ikan', label: 'Kolam Ikan' },
  { id: 'taman', label: 'Taman' },
  { id: 'renovasi', label: 'Renovasi' },
];

// Layanan CahyanaPool
export const services = [
  {
    title: 'Pembuatan kolam',
    description:
      'Merancang ruang air yang menyatu dengan karakter rumah dan lanskap.',
    category: 'kolam-renang',
    icon: 'pool',
  },
  {
    title: 'Perawatan kolam',
    description:
      'Menjaga kolam tetap nyaman dipandang dan digunakan.',
    category: 'perawatan',
    icon: 'leaf',
  },
  {
    title: 'Renovasi kolam',
    description:
      'Pembaruan kolam untuk kebutuhan dan tampilan yang berubah.',
    category: 'renovasi',
    icon: 'refresh',
  },
  {
    title: 'Pembuatan taman pojok',
    description:
      'Menghidupkan sudut ruang dengan sentuhan hijau.',
    category: 'taman',
    icon: 'sprout',
  },
  {
    title: 'Kolam sekaligus taman',
    description:
      'Menggabungkan elemen air dan tanaman dalam satu lanskap.',
    category: 'kolam-renang',
    icon: 'trees',
  },
];