'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { search } from '../_actions/search';
import { addRestaurant } from '../_actions/addRestaurant';
import { useTransition, useState, useEffect } from 'react';
import { Place } from '../_actions/search';
import ManualAddForm from './ManualAddForm';
import { RestaurantWithDetails } from '../_lib/types';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        >
            {pending ? 'Searching...' : 'Search'}
        </button>
    );
}

interface SearchControlProps {
    onLocalResults: (results: RestaurantWithDetails[]) => void;
}

export default function SearchControl({ onLocalResults }: SearchControlProps) {
    const [searchState, searchAction] = useFormState(search, { message: '', localResults: [], externalResults: [] });
    const [isPending, startTransition] = useTransition();
    const [showManualForm, setShowManualForm] = useState(false);

    const handleAddClick = (place: Place) => {
        startTransition(() => addRestaurant(place));
    };

    // Effect to determine if we should show the manual add form
    useEffect(() => {
        const { message } = searchState;
        // The form should appear if a search has been completed
        if (message) {
            setShowManualForm(true);
        } else {
            setShowManualForm(false);
        }
    }, [searchState]);

    // This effect will run when local results are found, calling the parent callback
    // This is how we can communicate from the search component back to the map
    useEffect(() => {
        if (searchState.localResults.length > 0) {
            onLocalResults(searchState.localResults);
        }
    }, [searchState.localResults, onLocalResults]);


    return (
        <div>
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add a Review</h2>
                <form action={searchAction}>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">
                        Find a restaurant
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="query"
                            name="query"
                            type="text"
                            placeholder="e.g. Joe's Pizza"
                            required
                        />
                        <SubmitButton />
                    </div>
                </form>
                {searchState.message && <p className="text-sm text-gray-800 mt-2">{searchState.message}</p>}
                
                {searchState.externalResults.length > 0 && (
                     <ul className="mt-4 space-y-2">
                        {searchState.externalResults.map((place) => (
                            <li key={place.osm_id} className="border-b last:border-b-0 py-2 flex justify-between items-center text-sm">
                                <span className="text-gray-800">{place.display_name}</span>
                                <button
                                    onClick={() => handleAddClick(place)}
                                    disabled={isPending}
                                    className="text-xs bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                                >
                                    {isPending ? 'Adding...' : 'Add'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {showManualForm && (
                    <div className="mt-6 pt-4 border-t">
                         <h3 className="text-lg font-semibold mb-2 text-gray-800">Can&apos;t find it?</h3>
                        <ManualAddForm />
                    </div>
                )}
            </div>
        </div>
    )
} 