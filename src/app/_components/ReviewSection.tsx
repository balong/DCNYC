'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import AddReviewForm from './AddReviewForm';
import { type Review } from '../_lib/types';

interface ReviewSectionProps {
    restaurantId: string;
    initialReviews: Review[];
}

export default function ReviewSection({ restaurantId, initialReviews }: ReviewSectionProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel(`reviews-for-${restaurantId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'reviews',
                filter: `restaurant_id=eq.${restaurantId}`
            }, (payload) => {
                setReviews(currentReviews => [payload.new as Review, ...currentReviews]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, restaurantId]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white shadow-md rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xl font-semibold text-gray-900">Rating: {Number(review.rating).toFixed(1)}/5</p>
                                <p className="text-md capitalize text-gray-800">{review.style}</p>
                            </div>
                            <p className="text-gray-800">{review.notes || 'No notes for this review.'}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Reviewed on {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No reviews for this restaurant yet.</p>
                )}
            </div>
            <div>
                <AddReviewForm restaurantId={restaurantId} />
            </div>
        </div>
    );
} 