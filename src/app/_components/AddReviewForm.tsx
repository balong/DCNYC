'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addReview } from '../_actions/addReview';
import { useState } from 'react';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
    >
      {pending ? 'Submitting...' : 'Submit Review'}
    </button>
  );
}

interface AddReviewFormProps {
    restaurantId: string;
}

export default function AddReviewForm({ restaurantId }: AddReviewFormProps) {
  const [state, formAction] = useFormState(addReview, initialState);
  const [selectedStyle, setSelectedStyle] = useState('');

  return (
    <form action={formAction} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
          Rating (0-5)
        </label>
        <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rating"
            name="rating"
            required
            defaultValue=""
        >
            <option value="" disabled>Select a rating</option>
            {Array.from({ length: 11 }, (_, i) => 5 - i * 0.5).map(score => (
                <option key={score} value={score}>{score.toFixed(1)}</option>
            ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="style">
          Style
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="style"
          name="style"
          required
          defaultValue=""
          onChange={(e) => setSelectedStyle(e.target.value)}
        >
          <option value="" disabled>Select a style</option>
          <option value="fountain">Fountain</option>
          <option value="can">Can</option>
          <option value="plastic_bottle">Plastic Bottle</option>
          <option value="glass_bottle">Glass Bottle</option>
          <option value="coke_freestyle">Coke Freestyle Machine</option>
        </select>
      </div>
      {['can', 'plastic_bottle', 'glass_bottle'].includes(selectedStyle) && (
        <div className="mb-4">
            <label className="flex items-center">
                <input type="checkbox" name="glass_with_ice" value="true" className="mr-2" />
                <span className="text-gray-700 text-sm font-bold">Served with a glass of ice?</span>
            </label>
        </div>
      )}
      <div className="mb-4 flex flex-col gap-2">
        <label className="flex items-center">
            <input type="checkbox" name="lemon_wedge" value="true" className="mr-2" />
            <span className="text-gray-700 text-sm font-bold">Lemon Wedge?</span>
        </label>
        <label className="flex items-center">
            <input type="checkbox" name="lime_wedge" value="true" className="mr-2" />
            <span className="text-gray-700 text-sm font-bold">Lime Wedge?</span>
        </label>
        <label className="flex items-center">
            <input type="checkbox" name="free_refills" value="true" className="mr-2" />
            <span className="text-gray-700 text-sm font-bold">Free refills?</span>
        </label>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
          Notes (optional)
        </label>
        <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            name="notes"
            rows={3}
            placeholder="e.g. Tasted a bit flat, but the ice was perfect."
        />
      </div>
      <div className="flex items-center justify-between">
        <SubmitButton />
      </div>
      {state?.message && <p className="text-green-500 text-xs italic mt-4">{state.message}</p>}
    </form>
  );
} 