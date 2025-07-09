'use client';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useEffect, ReactNode } from 'react';

interface MarkerClusterGroupProps {
  children: ReactNode;
}

const MarkerClusterGroup = ({ children }: MarkerClusterGroupProps) => {
  const map = useMap();

  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup();
    map.addLayer(markerClusterGroup);

    // This is a bit of a hack to add the children to the cluster group
    // React-Leaflet v3 doesn't directly support MarkerClusterGroup anymore
    const markers = L.layerGroup();
    (children as any[]).forEach(child => {
        if (child.props.position) {
            const marker = L.marker(child.props.position, {
                icon: child.props.icon // Use the icon from the child prop
            })
            .bindPopup(child.props.children.props.children); // Another hack to get popup content
            
            if (child.props.eventHandlers) {
                marker.on(child.props.eventHandlers);
            }

            markers.addLayer(marker);
        }
    });

    markerClusterGroup.addLayer(markers);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [children, map]);

  return null;
};

export default MarkerClusterGroup; 