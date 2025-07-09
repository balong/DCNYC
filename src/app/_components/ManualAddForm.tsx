'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { manualAddRestaurant } from '../_actions/manualAddRestaurant';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        >
            {pending ? 'Adding...' : 'Add Restaurant'}
        </button>
    );
}

export default function ManualAddForm() {
    const [state, formAction] = useFormState(manualAddRestaurant, { message: '' });

    return (
        <form action={formAction}>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Add Manually</h3>
            <div className="mb-4">
                <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="name">
                    Restaurant Name
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    name="name"
                    type="text"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="address">
                    Full Address
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                    id="address"
                    name="address"
                    type="text"
                    placeholder="e.g. 123 Main St, New York, NY 10001"
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <SubmitButton />
            </div>
            {state?.message && <p className="text-red-500 text-xs italic mt-4">{state.message}</p>}
        </form>
    );
} 