'use client';

import { Dispatch, SetStateAction } from 'react';

export const styles = ['fountain', 'can', 'plastic_bottle', 'glass_bottle', 'coke_freestyle'] as const;
export type Style = typeof styles[number];

export const styleColors: Record<Style, string> = {
    fountain: '#ef4444', // red-500
    can: '#3b82f6', // blue-500
    plastic_bottle: '#22c55e', // green-500
    glass_bottle: '#8b5cf6', // violet-500
    coke_freestyle: '#f97316', // orange-500
};

interface FilterControlsProps {
    setStyleFilter: Dispatch<SetStateAction<Style | 'all'>>;
    setRatingFilter: Dispatch<SetStateAction<number>>;
}

export function FilterControls({ setStyleFilter, setRatingFilter }: FilterControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div>
                <label htmlFor="style-filter" className="block text-sm font-medium text-gray-900">
                    Filter by Style
                </label>
                <select
                    id="style-filter"
                    name="style-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
                    defaultValue="all"
                    onChange={(e) => setStyleFilter(e.target.value as Style | 'all')}
                >
                    <option value="all">All Styles</option>
                    {styles.map(style => (
                        <option key={style} value={style}>{style.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-900">
                    Min Rating
                </label>
                <select
                    id="rating-filter"
                    name="rating-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
                    defaultValue="0"
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                >
                    <option value="0">Any</option>
                    {Array.from({ length: 9 }, (_, i) => 5 - i * 0.5).map(score => (
                        <option key={score} value={score}>{score.toFixed(1)}+</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export function Legend() {
    return (
        <div className="p-2 bg-white bg-opacity-80 rounded-md shadow-md">
            <h4 className="font-bold text-sm mb-1 text-gray-900">Legend</h4>
            <div className="flex flex-col gap-1">
                {styles.map(style => (
                    <div key={style} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: styleColors[style] }}></div>
                        <span className="text-xs capitalize text-gray-800">{style.replace('_', ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    )
} 