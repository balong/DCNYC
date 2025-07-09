import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AddReviewForm from '@/app/_components/AddReviewForm';
import Link from 'next/link';

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!restaurant) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <main className="container mx-auto p-4 lg:p-12 relative">
        <Link href="/" className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800">&times;</Link>
      <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{restaurant.address}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
                <div key={review.id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xl font-semibold">Rating: {Number(review.rating).toFixed(1)}/5</p>
                    <p className="text-md capitalize text-gray-700">{review.style}</p>
                </div>
                <p className="text-gray-600">{review.notes || 'No notes for this review.'}</p>
                <p className="text-xs text-gray-400 mt-2">
                    Reviewed on {new Date(review.created_at).toLocaleDateString()}
                </p>
                </div>
            ))
            ) : (
            <p>No reviews for this restaurant yet.</p>
            )}
        </div>
        <div>
            <AddReviewForm restaurantId={restaurant.id} />
        </div>
      </div>
    </main>
  );
} 