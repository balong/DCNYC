'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FormSchema = z.object({
  restaurantId: z.string().uuid(),
  rating: z.coerce.number().min(0).max(5),
  style: z.enum(['fountain', 'can', 'plastic_bottle', 'glass_bottle', 'coke_freestyle']),
  notes: z.string().optional(),
  glass_with_ice: z.coerce.boolean().default(false),
  lemon_wedge: z.coerce.boolean().default(false),
  lime_wedge: z.coerce.boolean().default(false),
  free_refills: z.coerce.boolean().default(false),
});

export async function addReview(prevState: any, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    restaurantId: formData.get('restaurantId'),
    rating: formData.get('rating'),
    style: formData.get('style'),
    notes: formData.get('notes'),
    glass_with_ice: formData.get('glass_with_ice'),
    lemon_wedge: formData.get('lemon_wedge'),
    lime_wedge: formData.get('lime_wedge'),
    free_refills: formData.get('free_refills'),
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return { message: 'Invalid form data. Please check your inputs.' };
  }

  const { restaurantId, rating, style, notes, glass_with_ice, lemon_wedge, lime_wedge, free_refills } = validatedFields.data;
  const supabase = createClient();

  try {
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({ restaurant_id: restaurantId, rating, style, notes, glass_with_ice, lemon_wedge, lime_wedge, free_refills });

    if (reviewError) throw reviewError;

    revalidatePath(`/restaurants/${restaurantId}`);
    revalidatePath('/'); // also revalidate the homepage map
    return { message: 'Review submitted successfully!' };
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to submit review.' };
  }
} 