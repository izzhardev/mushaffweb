import Hero from '../components/Hero';
import LatestActivities from '../components/LatestActivities';
import NewsSection from '../components/NewsSection';
import PhotoGallerySection from '../components/PhotoGallerySection';
import DonationCampaigns from '../components/DonationCampaigns';
import AboutSection from '../components/AboutSection';
import BeneficiariesSection from '../components/BeneficiariesSection';
import ContactSection from '../components/ContactSection';
import { motion } from 'motion/react';
import MetaSEO from '../components/MetaSEO';

export default function Home() {
  const homeFaqs = [
    {
      q: 'Apa itu gerakan Mushaff Indonesia?',
      q_id: 'faq_1',
      a: 'Mushaff Indonesia adalah lembaga filantropi sosial-keagamaan yang fokus pada pemberantasan buta huruf Al-Qur’an, penyediaan guru ngaji gratis, pembinaan akhlaq mulia dhuafa, serta distribusi merata wakaf mushaf Al-Qur’an hingga daerah terpencil di Indonesia.'
    },
    {
      q: 'Bagaimana cara mendaftar belajar mengaji gratis?',
      q_id: 'faq_2',
      a: 'Kami menyelenggarakan program belajar mengaji dasar gratis (Iqro hingga tajwid) baik online maupun offline di berbagai Rumah Qur’an binaan. Anda dapat mengakses informasi pendaftaran di halaman Program atau menghubungi Admin kami.'
    },
    {
      q: 'Apakah donasi dan wakaf dikelola secara transparan?',
      q_id: 'faq_3',
      a: 'Ya, seluruh dana donasi kemanusiaan, infaq, shodaqoh, dan wakaf mushaf Al-Qur’an dicatat dan dilaporkan secara periodik. Kami juga menyertakan dokumentasi penyerahan barang langsung di website & media sosial kami.'
    }
  ];

  return (
    <main id="home_main_container" className="overflow-hidden">
      <MetaSEO 
        title="Gerakan Membangun Akhlaq Qurani & Berantas Buta Huruf Al-Quran" 
        description="Mushaff Indonesia — Gerakan membangun akhlaq Qurani, pemberantasan buta huruf Al-Qur’an, sedekah Al-Qur’an, wakaf mushaf, pendidikan Islam, dhuafa, dan program amal sosial Islami terpercaya di Indonesia."
        keywords={[
          'yayasan amal quran', 'yayasan sosial islam', 'sedekah al quran', 'wakaf quran', 'donasi quran',
          'gerakan cinta quran', 'belajar al quran gratis', 'pemberantasan buta huruf quran', 'pendidikan qurani',
          'amal jariyah quran', 'rumah quran indonesia', 'gerakan mengaji indonesia', 'donasi pendidikan islam'
        ]}
        schemaTypes={['Organization', 'FAQ']}
        faqList={homeFaqs}
      />
      <Hero />
      
      <DonationCampaigns />
      
      <LatestActivities />
      
      <PhotoGallerySection />
      
      <NewsSection />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <AboutSection />
        <BeneficiariesSection />
        <ContactSection />
      </motion.div>
    </main>
  );
}
