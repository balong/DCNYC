'use client';

import React from 'react';
import SearchControl from './SearchControl';
import { FilterControls, Legend, Style } from './FilterControls';
import { RestaurantWithDetails } from '../_lib/types';
import { Dispatch, SetStateAction } from 'react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onLocalResults: (results: RestaurantWithDetails[]) => void;
    setStyleFilter: Dispatch<SetStateAction<Style | 'all'>>;
    setRatingFilter: Dispatch<SetStateAction<number>>;
}

export default function Sidebar({ isOpen, setIsOpen, onLocalResults, setStyleFilter, setRatingFilter }: SidebarProps) {
    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-40 h-full w-4/5 max-w-sm transform transition-transform md:relative md:translate-x-0 md:col-span-1 lg:col-span-1 md:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col p-4 bg-gray-50 h-full overflow-y-auto space-y-6`}>
                <div className="flex justify-between items-center md:hidden">
                    <h2 className="text-lg font-bold">Controls</h2>
                    <button onClick={() => setIsOpen(false)}>&times;</button>
                </div>
                <SearchControl onLocalResults={onLocalResults} />
                <div className="space-y-4">
                    <FilterControls setStyleFilter={setStyleFilter} setRatingFilter={setRatingFilter} />
                    <Legend />
                </div>
            </div>
        </>
    )
} 