'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { RestaurantWithDetails } from '../_lib/types';
import { Style } from './FilterControls';
import Sidebar from './Sidebar';

export default function HomePageClient({ allRestaurants }: { allRestaurants: RestaurantWithDetails[] | null }) {
    const [searchResults, setSearchResults] = useState<RestaurantWithDetails[] | null>(null);
    const [styleFilter, setStyleFilter] = useState<Style | 'all'>('all');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // This complex memo hook is now the heart of our filtering logic
    const filteredRestaurants = useMemo(() => {
        if (!allRestaurants) return null;
        
        // Start with all reviewed restaurants
        let restaurants = allRestaurants.filter(r => r.review_count > 0);

        // Apply style filter
        if (styleFilter !== 'all') {
            restaurants = restaurants.filter(r => r.dominant_style === styleFilter);
        }

        // Apply rating filter
        if (ratingFilter > 0) {
            restaurants = restaurants.filter(r => r.average_rating >= ratingFilter);
        }

        return restaurants;
    }, [allRestaurants, styleFilter, ratingFilter]);

    const Map = useMemo(() => dynamic(() => import('@/app/_components/Map'), { 
        loading: () => <p>A map is loading</p>,
        ssr: false 
    }), []);

    const handleLocalResults = (results: RestaurantWithDetails[]) => {
        setSearchResults(results);
    };
    
    // If there are search results, show them. Otherwise, show the filtered list.
    const restaurantsToShow = searchResults && searchResults.length > 0 ? searchResults : filteredRestaurants;

    return (
        <div className="h-full">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden absolute top-4 left-4 z-[1000] bg-white p-2 rounded-md shadow-lg"
                aria-label="Open sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            <Sidebar 
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLocalResults={handleLocalResults} 
                setStyleFilter={setStyleFilter}
                setRatingFilter={setRatingFilter}
            />

            <div className="h-full md:pl-[33.333333%] lg:pl-[25%]">
                <Map restaurants={restaurantsToShow} searchResults={searchResults} />
            </div>
        </div>
    )
} 