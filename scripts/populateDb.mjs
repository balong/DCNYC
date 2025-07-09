import * as dotenv from 'dotenv';
import fs from 'fs';

const envPath = '.env.local';

if (fs.existsSync(envPath)) {
  console.log('.env.local file found. Attempting to load...');
  dotenv.config({ path: envPath });
} else {
  console.error('.env.local file not found in the root directory. Please ensure it exists and the script is run from the project root.');
  process.exit(1);
}

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const BATCH_SIZE = 1000;

async function getPlacesFromOverpass() {
  const amenitiesQuery = `
    [out:json][timeout:180];
    (
      node["amenity"~"restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|biergarten"](40.477399,-74.25909,40.917577,-73.700272);
      way["amenity"~"restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|biergarten"](40.477399,-74.25909,40.917577,-73.700272);
      relation["amenity"~"restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|biergarten"](40.477399,-74.25909,40.917577,-73.700272);
    );
    out center;
  `;
  const shopsQuery = `
    [out:json][timeout:180];
    (
      node["shop"~"convenience|deli|supermarket"](40.477399,-74.25909,40.917577,-73.700272);
      way["shop"~"convenience|deli|supermarket"](40.477399,-74.25909,40.917577,-73.700272);
      relation["shop"~"convenience|deli|supermarket"](40.477399,-74.25909,40.917577,-73.700272);
    );
    out center;
  `;

  console.log('Fetching places from Overpass API...');

  const [amenitiesResponse, shopsResponse] = await Promise.all([
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(amenitiesQuery)}`, {
      headers: { 'User-Agent': 'DCNYC/1.0 (dev.dcyour.tech)' },
    }),
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(shopsQuery)}`, {
        headers: { 'User-Agent': 'DCNYC/1.0 (dev.dcyour.tech)' },
    })
  ]);

  const amenitiesData = await amenitiesResponse.json();
  const shopsData = await shopsResponse.json();
  
  const allElements = [...amenitiesData.elements, ...shopsData.elements];
  console.log(`Found ${allElements.length} potential places.`);

  return allElements
    .filter(element => element.tags && element.tags.name)
    .map(element => {
        const name = element.tags.name;
        // Attempt to build a simple address from tags
        const street = element.tags['addr:street'] || '';
        const housenumber = element.tags['addr:housenumber'] || '';
        const postcode = element.tags['addr:postcode'] || '';
        const city = element.tags['addr:city'] || '';
        let address = [housenumber, street, city, postcode].filter(Boolean).join(', ');
        if (!address) {
            address = 'Address not available';
        }

        return {
            name,
            address,
            lat: element.center?.lat || element.lat,
            lng: element.center?.lon || element.lon,
        };
    });
}

async function populateDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is not defined in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const restaurants = await getPlacesFromOverpass();
  console.log(`Processing ${restaurants.length} places with names.`);

  for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
    const batch = restaurants.slice(i, i + BATCH_SIZE);
    console.log(`Inserting batch ${i / BATCH_SIZE + 1}...`);

    const { error } = await supabase.from('restaurants').insert(batch);
    if (error) {
      console.error('Error inserting batch:', error);
    } else {
      console.log(`Successfully inserted batch of ${batch.length} restaurants.`);
    }
  }

  console.log('Database population complete.');
}

populateDatabase(); 