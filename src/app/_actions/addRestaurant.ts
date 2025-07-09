'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Place } from './search';
import { revalidatePath } from 'next/cache';
import { isPointInNYC } from '@/lib/utils';

export async function addRestaurant(place: Place) {
  const { display_name: address, lat, lon: lng } = place;

  if (!isPointInNYC(parseFloat(lat), parseFloat(lng))) {
    // This should ideally return a message to the user,
    // but for now, we'll just prevent the redirect and addition.
    // In a real app, you'd want to handle this state on the client.
    console.log(`Attempted to add a restaurant outside of NYC: ${address}`);
    return;
  }

  const name = address.split(',')[0];
  const supabase = createClient();

  // First, check if this restaurant already exists
  let { data: existingRestaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('name', name)
    .eq('address', address)
    .single();

  if (existingRestaurant) {
    redirect(`/restaurants/${existingRestaurant.id}`);
  }

  // If not, create it
  const { data: newRestaurant, error } = await supabase
    .from('restaurants')
    .insert({ name, address, lat: parseFloat(lat), lng: parseFloat(lng) })
    .select('id')
    .single();

  if (error || !newRestaurant) {
    // This should be handled more gracefully in a real app
    throw new Error('Failed to create restaurant');
  }

  revalidatePath('/'); // Revalidate the homepage to show the new marker
  redirect(`/restaurants/${newRestaurant.id}`);
} 