export type Restaurant = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  created_at: string;
};

export type Review = {
  id: string;
  restaurant_id: string;
  rating: number;
  style: string;
  notes: string | null;
  created_at: string;
} 