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
  return (
    <main className="overflow-hidden">
      <MetaSEO 
        title="Beranda" 
        description="Platform pemberdayaan umat yang berfokus pada pemberantasan buta huruf Al-Quran, penggalangan dana kemanusiaan, dan gerakan dakwah."
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
