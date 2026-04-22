import Hero from '../components/Hero';
import LatestActivities from '../components/LatestActivities';
import NewsSection from '../components/NewsSection';
import PhotoGallerySection from '../components/PhotoGallerySection';
import DonationCampaigns from '../components/DonationCampaigns';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <main className="overflow-hidden">
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
        <ContactSection />
      </motion.div>
    </main>
  );
}
