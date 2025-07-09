'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { isPointInNYC } from '@/lib/utils';

const ManualAddSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  address: z.string().min(5, { message: "A full address is required." }),
});

export async function manualAddRestaurant(prevState: any, formData: FormData) {
  const validatedFields = ManualAddSchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
  });

  if (!validatedFields.success) {
    return { message: validatedFields.error.errors.map(e => e.message).join(', ') };
  }

  const { name, address } = validatedFields.data;
  const fullAddressQuery = `${address}, New York, NY`;

  // 1. Geocode the address
  let lat, lng;
  try {
    const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddressQuery)}&format=json&limit=1`, {
        headers: {
            'User-Agent': 'DCNYC/1.0 (dev.dcyour.tech)'
        }
    });
    
    if (!geocodeResponse.ok) {
        console.error('Geocoding API responded with an error:', geocodeResponse.status, geocodeResponse.statusText);
        return { message: `Error from geocoding service: ${geocodeResponse.statusText}. Please try again later.` };
    }

    const geocodeResult = await geocodeResponse.json();

    if (geocodeResult.length === 0) {
        return { message: "Could not find coordinates for that address. Please be more specific." };
    }
    
    lat = geocodeResult[0].lat;
    lng = geocodeResult[0].lon;

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        return { message: `A network error occurred: ${error.message}` };
    }
    return { message: 'An unexpected error occurred during geocoding.' };
  }

  // Check if the location is in NYC
  if (!isPointInNYC(parseFloat(lat), parseFloat(lng))) {
    return { message: "Sorry, we're only accepting reviews for locations within the 5 boroughs of New York City." };
  }

  const supabase = createClient();

  // 2. Check if restaurant already exists
  let { data: existingRestaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('name', name)
    .eq('address', address)
    .single();
    
  if (existingRestaurant) {
    redirect(`/restaurants/${existingRestaurant.id}`);
  }

  // 3. If not, create it
  const { data: newRestaurant, error } = await supabase
    .from('restaurants')
    .insert({ name, address, lat: parseFloat(lat), lng: parseFloat(lng) })
    .select('id')
    .single();

  if (error || !newRestaurant) {
      console.error(error);
      return { message: 'Database Error: Failed to create restaurant.' };
  }

  revalidatePath('/');
  redirect(`/restaurants/${newRestaurant.id}`);
} 