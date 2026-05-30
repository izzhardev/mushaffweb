import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaSEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  schemaTypes?: ('Organization' | 'Article' | 'FAQ' | 'Breadcrumb' | 'DonateAction')[];
  faqList?: { q: string; a: string }[];
  articleMeta?: {
    authorName?: string;
    datePublished?: string;
    dateModified?: string;
    category?: string;
  };
  breadcrumbList?: { name: string; path: string }[];
  donateMeta?: {
    campaignName?: string;
    targetAmount?: number;
    currentAmount?: number;
    currency?: string;
    donateUrl?: string;
  };
}

export default function MetaSEO({
  title,
  description,
  image,
  type = 'website',
  keywords = [],
  schemaTypes = [],
  faqList = [],
  articleMeta,
  breadcrumbList = [],
  donateMeta
}: MetaSEOProps) {
  const location = useLocation();

  const defaultTitle = 'Mushaff Indonesia';
  const defaultDesc = 'Mushaff Indonesia — Gerakan Membangun Akhlaq Qurani, Memberantas Buta Huruf Al-Qur’an, Sedekah dan Wakaf Qur’an Indonesia.';
  const defaultImage = 'https://res.cloudinary.com/dgezrzjnb/image/upload/v1776780950/cycwu4porqzodhuyf9zo.png';
  const defaultKeywords = [
    'yayasan amal quran', 'yayasan sosial islam', 'sedekah al quran', 'wakaf quran', 'donasi quran',
    'gerakan cinta quran', 'belajar al quran gratis', 'pemberantasan buta huruf quran', 'pendidikan qurani',
    'wakaf mushaf al quran', 'amal jariyah quran', 'rumah quran indonesia', 'gerakan mengaji indonesia',
    'donasi pendidikan islam', 'sedekah jariyah terbaik', 'yayasan dakwah quran', 'program sosial islami',
    'komunitas quran indonesia', 'gerakan akhlaq qurani', 'donasi mushaf quran'
  ];

  const currentTitle = title ? `${title} | ${defaultTitle}` : `${defaultTitle} — Pemberantas Buta Huruf Al-Quran & Sosial`;
  const currentDesc = description || defaultDesc;
  const currentImage = image || defaultImage;
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';
  const currentKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');

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
    updateOrCreateMeta('name', 'keywords', currentKeywords);

    // Update Open Graph (OG) Metas
    updateOrCreateMeta('property', 'og:title', currentTitle);
    updateOrCreateMeta('property', 'og:description', currentDesc);
    updateOrCreateMeta('property', 'og:image', currentImage);
    updateOrCreateMeta('property', 'og:url', currentUrl);
    updateOrCreateMeta('property', 'og:type', type);
    updateOrCreateMeta('property', 'og:site_name', defaultTitle);

    // Update Twitter Card Metas
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', currentTitle);
    updateOrCreateMeta('name', 'twitter:description', currentDesc);
    updateOrCreateMeta('name', 'twitter:image', currentImage);

    // Auto canonical url
    updateOrCreateCanonical(currentUrl);

    // 2. Clear old JSON-LD script tags
    const oldScripts = document.head.querySelectorAll('script[type="application/ld+json"][data-seo="mushaff"]');
    oldScripts.forEach(s => s.remove());

    // Generate and inject multiple Schema.org structures
    schemaTypes.forEach((schemaType) => {
      let schemaPayload: any = null;

      if (schemaType === 'Organization') {
        schemaPayload = {
          '@context': 'https://schema.org',
          '@type': 'NGO',
          'name': 'Mushaff Indonesia',
          'alternateName': 'Yayasan Mushaff Indonesia',
          'url': window.location.origin,
          'logo': defaultImage,
          'sameAs': [
            'https://www.instagram.com/mushaff.indonesia',
            'https://www.youtube.com/@mushaff.indonesia'
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+62-812-3456-7890',
            'contactType': 'donation & customer support',
            'areaServed': 'ID',
            'availableLanguage': 'Indonesian'
          },
          'description': 'Yayasan sosial keagamaan yang fokus pada pemberantasan buta huruf Al-Qur’an, penyaluran wakaf mushaf Al-Qur’an, sedekah jariyah, serta dakwah di pelosok Indonesia.'
        };
      }

      if (schemaType === 'Article' && articleMeta) {
        schemaPayload = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': title || currentTitle,
          'image': [currentImage],
          'datePublished': articleMeta.datePublished || new Date().toISOString(),
          'dateModified': articleMeta.dateModified || articleMeta.datePublished || new Date().toISOString(),
          'author': {
            '@type': 'Person',
            'name': articleMeta.authorName || 'Tim Redaksi Mushaff'
          },
          'publisher': {
            '@type': 'NGO',
            'name': 'Mushaff Indonesia',
            'logo': {
              '@type': 'ImageObject',
              'url': defaultImage
            }
          },
          'description': currentDesc,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': currentUrl
          }
        };
      }

      if (schemaType === 'FAQ' && faqList.length > 0) {
        schemaPayload = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqList.map(faq => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.a
            }
          }))
        };
      }

      if (schemaType === 'Breadcrumb' && breadcrumbList.length > 0) {
        schemaPayload = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': breadcrumbList.map((crumb, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'name': crumb.name,
            'item': window.location.origin + crumb.path
          }))
        };
      }

      if (schemaType === 'DonateAction' && donateMeta) {
        schemaPayload = {
          '@context': 'https://schema.org',
          '@type': 'DonateAction',
          'name': `Sedekah Ke ${donateMeta.campaignName || defaultTitle}`,
          'agent': {
            '@type': 'Person',
            'name': 'Masyarakat Indonesia'
          },
          'recipient': {
            '@type': 'NGO',
            'name': 'Mushaff Indonesia',
            'url': window.location.origin
          },
          'target': donateMeta.donateUrl || currentUrl,
          'priceSpecification': {
            '@type': 'PriceSpecification',
            'priceCurrency': donateMeta.currency || 'IDR',
            'price': donateMeta.targetAmount || 10000
          }
        };
      }

      if (schemaPayload) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', 'mushaff');
        script.text = JSON.stringify(schemaPayload);
        document.head.appendChild(script);
      }
    });

  }, [currentTitle, currentDesc, currentImage, currentUrl, type, currentKeywords, schemaTypes, faqList, articleMeta, breadcrumbList, donateMeta]);

  return null;
}

