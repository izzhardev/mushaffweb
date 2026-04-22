import { Program, NewsItem } from "./types";

export const PROGRAMS: Program[] = [
  {
    id: '1',
    title: 'Program Dakwah',
    description: 'Pemberdayaan dana zakat di bidang dakwah untuk menyebarkan nilai-nilai Al-Quran.',
    icon: 'BookOpen',
    category: 'Dakwah',
    image: 'https://picsum.photos/seed/dakwah/800/600'
  },
  {
    id: '2',
    title: 'Program Ekonomi',
    description: 'Pemberdayaan dana zakat untuk kemandirian ekonomi umat.',
    icon: 'TrendingUp',
    category: 'Ekonomi',
    image: 'https://picsum.photos/seed/ekonomi/800/600'
  },
  {
    id: '3',
    title: 'Program Kesehatan',
    description: 'Layanan kesehatan gratis bagi mustahik dan masyarakat kurang mampu.',
    icon: 'HeartPulse',
    category: 'Kesehatan',
    image: 'https://picsum.photos/seed/kesehatan/800/600'
  },
  {
    id: '4',
    title: 'Program Pendidikan',
    description: 'Beasiswa dan fasilitas pendidikan untuk memberantas buta huruf Al-Quran.',
    icon: 'GraduationCap',
    category: 'Pendidikan',
    image: 'https://picsum.photos/seed/pendidikan/800/600'
  },
  {
    id: '5',
    title: 'Program Sosial',
    description: 'Bantuan sosial darurat dan pemberdayaan masyarakat.',
    icon: 'Users',
    category: 'Sosial',
    image: 'https://picsum.photos/seed/sosial/800/600'
  }
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Zakat Perindustrian: Pengertian, Jenis, Nishab, dan Cara Perhitungannya',
    excerpt: 'Pelajari lebih dalam mengenai zakat perindustrian dan bagaimana dampaknya bagi ekonomi umat.',
    author: 'Syamil Abyan',
    date: '15 January 2026',
    image: 'https://picsum.photos/seed/zakat/800/600'
  },
  {
    id: '2',
    title: 'Tebar Mushaf di Pelosok Negeri',
    excerpt: 'Mushaff Indonesia menyalurkan ribuan Al-Quran ke daerah terpencil untuk memberantas buta huruf.',
    author: 'Admin Mushaff',
    date: '10 February 2026',
    image: 'https://picsum.photos/seed/quran/800/600'
  }
];
