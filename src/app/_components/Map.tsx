'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import MarkerClusterGroup from './MarkerClusterGroup';
import { useEffect, useRef } from 'react';
import { RestaurantWithDetails } from '../_lib/types';
import { useRouter } from 'next/navigation';
import { styleColors } from './FilterControls';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  restaurants: RestaurantWithDetails[] | null;
  searchResults?: RestaurantWithDetails[] | null;
}

export default function Map({ restaurants, searchResults }: MapProps) {
    const mapRef = useRef<L.Map>(null);
    const router = useRouter();

    useEffect(() => {
        if (mapRef.current && searchResults && searchResults.length > 0) {
            const L = require('leaflet'); // needed for L.latLngBounds
            const bounds = L.latLngBounds(searchResults.map(r => [r.lat, r.lng]));
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [searchResults]);

    if (!restaurants) {
        return <p>Loading map...</p>
    }

  return (
    <MapContainer
      ref={mapRef}
      center={[40.7128, -74.0060]} // NYC coordinates
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {restaurants.map((restaurant) => {
          
          if (restaurant.review_count === 0) {
            // Render a default marker if there are no reviews
            return (
                <Marker
                    key={restaurant.id}
                    position={[restaurant.lat, restaurant.lng]}
                    icon={new L.Icon.Default()}
                    eventHandlers={{
                        mouseover: (e) => e.target.openPopup(),
                        mouseout: (e) => e.target.closePopup(),
                        click: () => {
                            router.push(`/restaurants/${restaurant.id}`)
                        }
                    }}
                >
                    <Popup>{restaurant.name}</Popup>
                </Marker>
            )
          }

          const bgColor = restaurant.dominant_style ? styleColors[restaurant.dominant_style] : '#6b7280'; // gray-500 for null

          const scoreIcon = L.divIcon({
            html: `<div style="background-color: ${bgColor}; color: white; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.875rem;">${restaurant.average_rating.toFixed(1)}</div>`,
            className: 'score-marker', // an empty class name is required
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          return (
            <Marker
              key={restaurant.id}
              position={[restaurant.lat, restaurant.lng]}
              icon={scoreIcon}
              eventHandlers={{
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                  click: () => {
                      router.push(`/restaurants/${restaurant.id}`)
                  }
              }}
            >
              <Popup>{restaurant.name}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
} 