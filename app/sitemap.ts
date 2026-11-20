import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/guide', '/guide/letter', '/guide/howto', '/guide/class', '/terms', '/privacy', '/contact'].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly', priority: p ? 0.6 : 1 }));
}
