import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaSEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export default function MetaSEO({
  title,
  description,
  image,
  type = 'website'
}: MetaSEOProps) {
  const location = useLocation();
  const defaultTitle = 'Mushaff Indonesia';
  const defaultDesc = 'Platform pemberdayaan umat yang fokus pada pemberantasan buta huruf Al-Quran.';
  const defaultImage = 'https://picsum.photos/seed/mushaff-logo/100/100';

  const currentTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const currentDesc = description || defaultDesc;
  const currentImage = image || defaultImage;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    // 1. Set document title
    document.title = currentTitle;

    // Helper to safely set or create meta key
    const updateOrCreateMeta = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.head.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update canonical link
    const updateOrCreateCanonical = (url: string) => {
      let element = document.head.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    // Update basic SEO metas
    updateOrCreateMeta('name', 'description', currentDesc);

    // Update Open Graph (OG) Metas
    updateOrCreateMeta('property', 'og:title', currentTitle);
    updateOrCreateMeta('property', 'og:description', currentDesc);
    updateOrCreateMeta('property', 'og:image', currentImage);
    updateOrCreateMeta('property', 'og:url', currentUrl);
    updateOrCreateMeta('property', 'og:type', type);

    // Update Twitter Card Metas
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', currentTitle);
    updateOrCreateMeta('name', 'twitter:description', currentDesc);
    updateOrCreateMeta('name', 'twitter:image', currentImage);

    // Auto canonical url
    updateOrCreateCanonical(currentUrl);
  }, [currentTitle, currentDesc, currentImage, currentUrl, type]);

  return null;
}
