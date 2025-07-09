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

export type Review = {
    id: string;
    restaurant_id: string;
    rating: number;
    style: 'fountain' | 'can' | 'plastic_bottle' | 'glass_bottle' | 'coke_freestyle';
    notes: string | null;
    created_at: string;
    glass_with_ice: boolean;
    lemon_wedge: boolean;
    lime_wedge: boolean;
    free_refills: boolean;
}; 