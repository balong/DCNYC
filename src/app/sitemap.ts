import { createClient } from '@/lib/supabase/server';
import { type MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  
  const { data: restaurants } = await supabase.from('restaurants').select('id');

  const restaurantUrls = restaurants?.map(({ id }) => ({
    url: `https://dnyc.co/restaurants/${id}`,
    lastModified: new Date(),
  })) ?? [];

  return [
    {
      url: 'https://dnyc.co',
      lastModified: new Date(),
    },
    {
      url: 'https://dnyc.co/about',
      lastModified: new Date(),
    },
    ...restaurantUrls,
  ];
} 