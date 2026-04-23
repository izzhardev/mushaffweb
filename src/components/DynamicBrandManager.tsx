import React from 'react';
import { useAppDatabase } from '../hooks/useAppDatabase';

export default function DynamicBrandManager() {
  const { settings } = useAppDatabase();

  React.useEffect(() => {
    const siteSettings = settings.find(s => s.id === 'general');
    if (!siteSettings) return;

    // Update Title
    if (siteSettings.site_name) {
      document.title = siteSettings.site_name;
    }

    // Update Favicon
    if (siteSettings.site_logo) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = siteSettings.site_logo;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteSettings.site_logo;
        document.head.appendChild(newLink);
      }
    }
  }, [settings]);

  return null;
}
