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
            {/* Sidebar */}
            <div className={
                `fixed top-0 left-0 z-40 h-full w-4/5 max-w-sm transform transition-transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:w-1/3 lg:w-1/4 md:translate-x-0
                flex flex-col p-4 bg-gray-50 overflow-y-auto space-y-6`
            }>
                <div className="flex justify-end items-center md:hidden">
                    <button onClick={() => setIsOpen(false)} className="text-2xl font-bold text-gray-800">&times;</button>
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