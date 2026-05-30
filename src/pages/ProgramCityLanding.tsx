import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, BookOpen, Star, HelpCircle, MapPin, CheckCircle, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { optimizeImage } from '../lib/utils';
import MetaSEO from '../components/MetaSEO';

// Supported cities list
export const CITIES = [
  { id: 'jakarta', name: 'Jakarta', province: 'DKI Jakarta' },
  { id: 'bandung', name: 'Bandung', province: 'Jawa Barat' },
  { id: 'surabaya', name: 'Surabaya', province: 'Jawa Timur' },
  { id: 'yogyakarta', name: 'Yogyakarta', province: 'DI Yogyakarta' },
  { id: 'medan', name: 'Medan', province: 'Sumatera Utara' },
  { id: 'makassar', name: 'Makassar', province: 'Sulawesi Selatan' },
  { id: 'semarang', name: 'Semarang', province: 'Jawa Tengah' },
  { id: 'palembang', name: 'Palembang', province: 'Sumatera Selatan' },
  { id: 'malang', name: 'Malang', province: 'Jawa Timur' },
  { id: 'depok', name: 'Depok', province: 'Jawa Barat' },
  { id: 'tangerang', name: 'Tangerang', province: 'Banten' },
  { id: 'bekasi', name: 'Bekasi', province: 'Jawa Barat' },
  { id: 'bogor', name: 'Bogor', province: 'Jawa Barat' },
  { id: 'solo', name: 'Solo', province: 'Jawa Tengah' },
  { id: 'denpasar', name: 'Denpasar', province: 'Bali' }
];

// Defined primary program templates
export const PROGRAMS_SEO = [
  {
    slug: 'wakaf-quran',
    keyword: 'wakaf quran',
    titleTemplate: 'Wakaf Mushaf Al-Qur’an Terbaik di [City]',
    h1Template: 'Gerakan Wakaf Al-Qur’an Pelosok [City]: Alirkan Pahala Jariyah Abadi',
    description: 'Bantu berantas buta huruf Al-Qur’an di area [City] & sekitarnya dengan sedekah mushaf berkualitas untuk santri tahfidz dan masyarakat pelosok.',
    intro: 'Program Wakaf Mushaf Al-Qur’an dari Yayasan Mushaff Indonesia hadir secara khusus di kota [City] untuk memfasilitasi kebutuhan umat Muslim akan mushaf layak baca. Masih banyak santri, masjid, dan majelis taklim di pelosok [City] yang belum memiliki mushaf Al-Qur’an yang memadai untuk belajar hafalan sehari-hari.',
    image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128996/wdjzpyfchxojtmjzhmmp.png',
    benefits: [
      'Mushaf Al-Qur’an Tajwid Warna standar Kemenag RI',
      'Distribusi langsung ke pelosok, binaan, & rumah tahfidz di [City]',
      'Laporan pendistribusian transparan untuk para pewakaf (wakif)',
      'Bonus pembinaan guru ngaji Al-Qur’an di wilayah terkait'
    ],
    faqs: [
      {
        q: 'Bagaimana cara berpartisipasi dalam program wakaf Quran di [City]?',
        a: 'Anda dapat berdonasi secara online melalui platform kami atau transfer bank resmi. Pilih program wakaf lalu masukkan nominal donasi terbaik Anda.'
      },
      {
        q: 'Apakah saya akan menerima dokumentasi penyaluran wakaf di [City]?',
        a: 'Ya, tim lapangan kami di [City] selalu melakukan dokumentasi foto dan video, serta mengirimkan laporan berkala kepada seluruh donatur.'
      },
      {
        q: 'Apakah mushaf Al-Qur’an yang diwakafkan ditujukan khusus untuk anak-anak?',
        a: 'Kami mendistribusikan mushaf kepada anak-anak santri tahfidz, mualaf, lansia, serta jamaah masjid binaan di pelosok [City] yang membutuhkan.'
      }
    ]
  },
  {
    slug: 'rumah-quran',
    keyword: 'rumah quran',
    titleTemplate: 'Rumah Al-Qur’an Indonesia Gratis di [City]',
    h1Template: 'Rumah Qur’an [City]: Pusat Pembibitan Penghafal Al-Qur’an & Akhlaq',
    description: 'Rumah Qur’an binaan di wilayah [City] memfasilitasi bimbingan, hafalan madrasah, dan dakwah Islam ramah anak tanpa biaya.',
    intro: 'Pendidikan Al-Qur’an berkarakter adalah pilar utama pembentukan akhlaq qurani. Melalui Rumah Qur’an kami di kota [City], kami mendidik ratusan santri dhuafa dan yatim secara gratis agar mereka tumbuh menjadi generasi emas yang mencintai dan mengamalkan nilai-nilai Al-Qur’an.',
    image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128969/rlpavfc3oqiii20wks9g.png',
    benefits: [
      'Asrama dan ruang kelas belajar Al-Qur’an yang kondusif',
      'Kurikulum hafalan tahfidz bersertifikasi & bersanad',
      'Pengajar lulusan universitas Islam terkemuka dan mumpuni',
      'Bantuan beasiswa hidup dan fasilitas gratis untuk santri yatim dhuafa'
    ],
    faqs: [
      {
        q: 'Apakah pendaftaran Rumah Qur’an di [City] dipungut biaya?',
        a: 'Sama sekali tidak. Seluruh program belajar, menghafal, dan mukim untuk dhuafa dan yatim di Rumah Qur’an [City] dibiayai 100% oleh program dana kemanusiaan kami.'
      },
      {
        q: 'Bagaimana cara berkunjung atau menjadi sukarelawan di Rumah Qur’an [City]?',
        a: 'Anda dapat menghubungi kontak WhatsApp admin kami untuk menjadwalkan kunjungan silaturahmi atau mendaftar sebagai pengajar relawan.'
      }
    ]
  },
  {
    slug: 'donasi-quran',
    keyword: 'donasi quran',
    titleTemplate: 'Donasidan Sedekah Mushaf Al-Qur’an [City]',
    h1Template: 'Gerakan Donasi & Sedekah Al-Qur’an Rutin di [City]',
    description: 'Salurkan sedekah jariyah terbaik Anda melalui program penyediaan dan pendistribusian kitab suci Al-Qur’an di kawasan regional [City].',
    intro: 'Investasi akhirat terbaik adalah amal jariyah yang pahalanya terus mengalir tak terputus. Melalui gerakan Donasi Al-Qur’an di [City], setiap huruf yang dibaca dan dihapalkan oleh santri binaan akan menjadi aliran pahala abadi untuk Anda dan keluarga tercinta.',
    image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1777128283/k0w7glbsayvpubhxkd5q.png',
    benefits: [
      'Kemudahan sistem pembayaran / sedekah online otomatis',
      'Alokasi dana donasi tepat sasaran, efektif, dan amanah',
      'Pembagian mushaf untuk masjid yang kekurangan kitab Al-Qur’an di [City]',
      'Mendukung program pemberatasan buta huruf Al-Qur’an secara nasional'
    ],
    faqs: [
      {
        q: 'Berapakah minimal donasi Al-Qur’an di [City]?',
        a: 'Tidak ada batas minimal dalam beramal shalih. Namun, Anda dapat mengikutsertakan donasi senilai kelipatan harga mushaf (mulai Rp 75.000) untuk mempermudah penyediaan fisik Al-Qur’an.'
      },
      {
        q: 'Apakah bisa menyalurkan donasi atas nama orang tua yang sudah wafat?',
        a: 'Sangat bisa. Niatkan sedekah Al-Qur’an ini sebagai hadiah pahala jariyah terbaik untuk kedua orang tua Anda.'
      }
    ]
  },
  {
    slug: 'belajar-mengaji',
    keyword: 'belajar mengaji gratis',
    titleTemplate: 'Bimbingan Belajar Mengaji Islam Gratis di [City]',
    h1Template: 'Program Belajar Mengaji Gratis [City]: Berantas Buta Huruf Al-Qur’an',
    description: 'Ikuti bimbingan belajar mengaji Al-Qur’an dasar metode cepat untuk anak-anak, remaja, dan lansia tanpa pungutan biaya di [City].',
    intro: 'Buta huruf Al-Qur’an masih menjadi tantangan besar di Indonesia. Kami menghadirkan program Belajar Mengaji Qur’an Gratis di [City] bagi semua kalangan umur yang ingin mahir makhraj, tajwid, dan membaca Al-Qur’an dengan fasih demi masa depan umat yang religius.',
    image: 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1776780950/cycwu4porqzodhuyf9zo.png',
    benefits: [
      'Metode belajar mengaji yang menyenangkan, mudah dipahami & interaktif',
      'Tersedia kelas bimbingan online dan offline tatap muka langsung di [City]',
      'Kelas khusus bagi lansia dan pemula mualaf yang belajar dari nol',
      'Disediakan materi pembelajaran, buku Iqro, dan mushaf tajwid gratis'
    ],
    faqs: [
      {
        q: 'Siapa saja yang boleh mendaftar gratis belajar mengaji di [City]?',
        a: 'Terbuka untuk umum: mulai dari anak usia dini, usia madrasah, remaja, dewasa mualaf, hingga kalangan lansia di seluruh penjuru kota [City].'
      },
      {
        q: 'Dimana lokasi tempat mengaji tatap muka di [City]?',
        a: 'Ketika mendaftar, admin kami akan mengarahkan lokasi masjid binaan terdekat atau jejaring majelis taklim terdekat di daerah [City].'
      }
    ]
  }
];

export default function ProgramCityLanding() {
  const { programSlug, citySlug } = useParams<{ programSlug: string; citySlug: string }>();

  // Find the program template
  const currentProgram = PROGRAMS_SEO.find(p => p.slug === programSlug) || PROGRAMS_SEO[0];
  // Find current city
  const currentCity = CITIES.find(c => c.id === citySlug) || CITIES[0];

  const cityTitle = currentProgram.titleTemplate.replace('[City]', currentCity.name);
  const cityH1 = currentProgram.h1Template.replace('[City]', currentCity.name);
  const cityDesc = currentProgram.description.replace('[City]', currentCity.name);
  const cityIntro = currentProgram.intro.replace('[City]', currentCity.name);

  // Format FAQs with city name
  const formattedFaqs = currentProgram.faqs.map(faq => ({
    q: faq.q.replace('[City]', currentCity.name),
    a: faq.a.replace('[City]', currentCity.name)
  }));

  // Dynamic values for Schema
  const seoBreadcrumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Donasi', path: '/donate' },
    { name: `${currentProgram.keyword} ${currentCity.name}`, path: `/program/${currentProgram.slug}/${currentCity.id}` }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <MetaSEO
        title={cityTitle}
        description={cityDesc}
        image={currentProgram.image}
        keywords={[
          `${currentProgram.keyword} ${currentCity.name}`,
          `${currentProgram.keyword} di ${currentCity.name}`,
          `${currentProgram.keyword} terbaik ${currentCity.name}`,
          `yayasan sosial islam ${currentCity.name}`,
          `wakaf quran ${currentCity.name}`,
          `belajar mengaji gratis ${currentCity.name}`,
          `mushaff indonesia`
        ]}
        schemaTypes={['Organization', 'FAQ', 'Breadcrumb', 'DonateAction']}
        faqList={formattedFaqs}
        breadcrumbList={seoBreadcrumbs}
        donateMeta={{
          campaignName: `${currentProgram.keyword} kawasan ${currentCity.name}`,
          targetAmount: 50000000,
          currency: 'IDR',
          donateUrl: `${window.location.origin}/program/${currentProgram.slug}/${currentCity.id}`
        }}
      />

      {/* HERO SECTION */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 flex flex-col items-start space-y-6">
            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm shadow-inner">
              PROGRAM KEAGAMAAN REGIONAL {currentCity.name.toUpperCase()}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {cityH1}
            </h1>
            <p className="text-lg text-slate-200 font-medium max-w-xl">
              {cityDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/donate"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Infaq Sekarang <Heart className="ml-2 w-5 h-5 fill-white text-white" />
              </Link>
              <a
                href={`https://wa.me/6281234567890?text=Assalamualaikum%20Mushaff%20Indonesia,%20saya%20tertarik%20dengan%20program%20${encodeURIComponent(currentProgram.keyword)}%20di%20${encodeURIComponent(currentCity.name)}`}
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-sm border border-white/10 transition-all duration-200"
                target="_blank"
                rel="noreferrer"
              >
                Hubungi Admin Hub <Phone className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 relative">
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-3xl blur-2xl" />
            <img
              src={optimizeImage(currentProgram.image, { width: 600, height: 450, crop: 'fill' })}
              alt={`${currentProgram.keyword} di ${currentCity.name}`}
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[300px] sm:h-[400px]"
            />
          </div>

        </div>
      </section>

      {/* ABOUT PROGRAM REGIONAL */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gerakan Edukasi & Dakwah di Pelosok {currentCity.name}
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg">
            <p>{cityIntro}</p>
            <p>
              Hingga hari ini, Yayasan Mushaff Indonesia telah berkolaborasi dengan tokoh masyarakat setempat, 
              guru madrasah, dan pimpinan pesantren tahfidz di {currentCity.name}, {currentCity.province} untuk memastikan program berjalan kondusif, transparan, dan berkelanjutan. Penyaluran donasi dijamin 100% tepat sasaran demi menciptakan dampak positif jangka panjang bagi peningkatan baca tulis Al-Quran anak-anak Indonesia.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {currentProgram.benefits.map((benefit, idx) => (
              <div key={idx} className="flex space-x-3 items-start bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-800 font-semibold text-sm sm:text-base">
                  {benefit.replace('[City]', currentCity.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGIONAL STATISTCS */}
      <section className="py-16 bg-emerald-950 text-white relative">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Statistik Dampak Sosial Program di {currentCity.name}
            </h2>
            <p className="text-emerald-300">Data penerima manfaat terupdate bulan ini</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400">1,250+</span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2 block font-medium">Mushaf Tersalurkan</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400">8+</span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2 block font-medium">Rumah Qur'an Aktif</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400">420+</span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2 block font-medium">Santri Binaan</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</span>
              <span className="text-xs sm:text-sm text-slate-300 mt-2 block font-medium">Pendidikan Gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INQUIRY / CONTACT CTA FORM */}
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Daftar / Konsultasi Online</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                Hubungi Pengurus Al-Quran Cabang {currentCity.name}
              </h3>
              <p className="text-slate-500 text-sm">
                Isi formulir singkat untuk berkonsultasi, berdonasi langsung, atau mendaftarkan anak mengaji di {currentCity.name}.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Terima kasih atas pesan Anda! Tim kami di ' + currentCity.name + ' akan segera menghubungi Anda melalui WhatsApp.');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input required type="text" placeholder="Masukkan nama Anda..." className="w-full px-4 py-3 bg-white border border-slate-300/80 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                <input required type="tel" placeholder="Contoh: 081234567xxx" className="w-full px-4 py-3 bg-white border border-slate-300/80 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Pesan / Minat Program</label>
                <textarea required rows={3} placeholder={`Tulis pesan Anda seputar ${currentProgram.keyword} di ${currentCity.name}...`} className="w-full px-4 py-3 bg-white border border-slate-300/80 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 transition-all text-sm" />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Kirim Pembagian Program
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SCHEMAS & FAQ SECTION */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-slate-500 text-sm">Semua hal yang perlu Anda ketahui mengenai program Qur'an di kota ini</p>
          </div>

          <div className="space-y-6">
            {formattedFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-start space-x-2 text-base sm:text-lg">
                  <HelpCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-slate-600 pl-7 text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMATIC SEO INTERNAL LINKING MAPS */}
      <section className="py-16 bg-emerald-900 text-white border-t border-emerald-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold block mb-2">Lokasi Cakupan Regional Lainnya:</h3>
            <p className="text-emerald-200 text-sm block">Yayasan Mushaff Indonesia mencakup seluruh kota besar untuk pemerataan dan pengentasan buta huruf Al-Qur’an di tanah air.</p>
          </div>

          <div className="space-y-8">
            {PROGRAMS_SEO.map((prog) => (
              <div key={prog.slug} className="space-y-3 bg-emerald-950/40 p-6 rounded-2xl border border-emerald-800/40">
                <span className="text-xs tracking-wider uppercase font-extrabold text-emerald-400 block border-b border-emerald-800/40 pb-2">
                  Gerakan {prog.keyword.toUpperCase()}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CITIES.map((city) => (
                    <Link
                      key={city.id}
                      to={`/program/${prog.slug}/${city.id}`}
                      className={`text-xs p-2 rounded-lg bg-emerald-950 hover:bg-emerald-500/30 transition-all font-medium text-slate-200 flex items-center space-x-1.5 ${
                        city.id === currentCity.id && prog.slug === currentProgram.slug
                          ? 'ring-1 ring-emerald-400 text-white font-bold bg-emerald-800'
                          : ''
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-emerald-300" />
                      <span>{prog.keyword} {city.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center border-t border-emerald-800/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left space-y-1">
              <span className="font-extrabold text-sm block">Ingin memperluas wilayah di kota Anda?</span>
              <span className="text-xs text-slate-300 block">Jadilah mitra pengelola Rumah Al-Qur'an Indonesia di kota baru!</span>
            </div>
            <a
              href="https://wa.me/6281234567890"
              className="inline-flex items-center px-6 py-3 bg-white text-emerald-900 font-extrabold rounded-xl hover:bg-emerald-50 transition-all text-sm shadow-xl"
              target="_blank"
              rel="noreferrer"
            >
              Ajukan Kemitraan Wilayah <ArrowRight className="ml-2 w-4 h-4 text-emerald-900" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
