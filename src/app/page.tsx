import { createClient } from '@/lib/supabase/server';
import HomePageClient from './_components/HomePageClient';
import Link from 'next/link';

export default async function Home() {
  const supabase = createClient();
  const { data: restaurants } = await supabase.from('restaurants_with_style_and_rating').select();

  return (
    <main className="h-screen flex flex-col">
      <header className="p-4 lg:p-6 w-full flex justify-center items-center bg-white shadow-md z-10 shrink-0 relative">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-serif text-gray-900">DCNYC</h1>
            <p className="text-sm text-gray-900 font-sans">New York Diet Coke Reviews</p>
        </div>
        <Link href="/about" className="absolute top-1/2 right-4 lg:right-6 -translate-y-1/2 text-sm text-gray-900 hover:text-black font-sans">
          About
        </Link>
      </header>
      <div className="flex-grow h-0">
        <HomePageClient allRestaurants={restaurants} />
      </div>
    </main>
  );
}
