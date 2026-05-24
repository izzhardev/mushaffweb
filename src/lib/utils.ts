import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  crop?: string;
}

/**
 * Optimizes an image URL, particularly targeting Cloudinary URLs by inserting
 * auto-format, auto-quality, and resizing parameters.
 * 
 * @param url The original image URL
 * @param options Optimization options (width, height, quality, crop, etc.)
 */
export function optimizeImage(
  url: string | undefined | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url) return '';

  // Only transform Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    // Escape if URL already contains a transformation block (f_auto, q_auto, or similar)
    if (url.includes('/f_auto') || url.includes('/q_auto') || url.includes(',w_') || url.includes(',h_')) {
      return url;
    }

    // Cloudinary URL pattern: https://res.cloudinary.com/<cloud_name>/image/upload/...
    const parts = url.split('/image/upload/');
    if (parts.length === 2) {
      const [base, path] = parts;
      
      const transformParams: string[] = ['f_auto', 'q_auto'];
      
      if (options.width) {
        transformParams.push(`w_${options.width}`);
      }
      if (options.height) {
        transformParams.push(`h_${options.height}`);
      }
      if (options.crop) {
        transformParams.push(`c_${options.crop}`);
      } else if (options.width || options.height) {
        // Use fit or fill
        if (options.width && options.height) {
          transformParams.push('c_fill');
        } else {
          transformParams.push('c_limit');
        }
      }
      
      const transformString = transformParams.join(',');
      
      return `${base}/image/upload/${transformString}/${path}`;
    }
  }

  // Fallback for Unsplash or Picsum or other placeholders
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      if (options.width) urlObj.searchParams.set('w', options.width.toString());
      if (options.height) urlObj.searchParams.set('h', options.height.toString());
      urlObj.searchParams.set('auto', 'format,compress');
      urlObj.searchParams.set('q', (options.quality || 80).toString());
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  return url;
}
