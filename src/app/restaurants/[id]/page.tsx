import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReviewSection from '@/app/_components/ReviewSection';
import { type Review } from '@/app/_lib/types';

// Define the type for the props, acknowledging params is a Promise in Next.js 15+
type RestaurantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage(props: RestaurantPageProps) {
  // Await the params promise to get the actual values
  const { id } = await props.params;
  
  const supabase = createClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();

  if (!restaurant) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', id)
    .order('created_at', { ascending: false });

  return (
    <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-4 lg:p-12 relative">
            <Link href="/" className="absolute top-4 right-4 text-2xl font-bold text-gray-800 hover:text-black">&times;</Link>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{restaurant.name}</h1>
            <p className="text-lg text-gray-900 mb-8">{restaurant.address}</p>

            <ReviewSection restaurantId={restaurant.id} initialReviews={reviews as Review[] ?? []} />
        </div>
    </main>
  );
} 