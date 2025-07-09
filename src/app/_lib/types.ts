export interface RestaurantWithDetails {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    created_at: string;
    average_rating: number;
    review_count: number;
    dominant_style: 'fountain' | 'can' | 'plastic_bottle' | 'glass_bottle' | 'coke_freestyle' | null;
} 