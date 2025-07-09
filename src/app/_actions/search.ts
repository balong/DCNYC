'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { RestaurantWithDetails } from '../_lib/types';

export interface Place {
    osm_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const SearchSchema = z.object({
  query: z.string().min(3),
});

interface SearchResult {
    message: string;
    localResults: RestaurantWithDetails[];
    externalResults: Place[];
}

export async function search(prevState: any, formData: FormData): Promise<SearchResult> {
  const validatedFields = SearchSchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return { message: 'Search query must be at least 3 characters.', localResults: [], externalResults: [] };
  }

  const { query } = validatedFields.data;
  const supabase = createClient();

  // 1. Search local database first
  const { data: localResults, error: localError } = await supabase
    .from('restaurants_with_style_and_rating')
    .select('*')
    .ilike('name', `%${query}%`);

  if (localError) {
    console.error(localError);
    return { message: 'Database Error: Could not perform search.', localResults: [], externalResults: [] };
  }

  if (localResults && localResults.length > 0) {
    return { message: `Found ${localResults.length} locations in our database.`, localResults, externalResults: [] };
  }

  // 2. If no local results, search external API
  try {
    const searchQuery = `${query}, New York City`;
    const searchResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&featuretype=restaurant&limit=10`, {
        headers: {
            'User-Agent': 'DCNYC/1.0 (dev.dcyour.tech)'
        }
      });
    
    const externalResults: Place[] = await searchResponse.json();

    if (externalResults.length === 0) {
        return { message: 'No results found in our database or on OpenStreetMap.', localResults: [], externalResults: [] };
    }

    return { message: 'Found results on OpenStreetMap. Add one to our database!', localResults: [], externalResults };

  } catch (error) {
    console.error(error);
    return { message: 'API Error: Could not perform external search.', localResults: [], externalResults: [] };
  }
} 