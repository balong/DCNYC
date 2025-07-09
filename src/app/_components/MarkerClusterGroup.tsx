'use client';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useEffect, ReactNode, Children, isValidElement, ReactElement } from 'react';

interface MarkerClusterGroupProps {
  children: ReactNode;
}

const MarkerClusterGroup = ({ children }: MarkerClusterGroupProps) => {
  const map = useMap();

  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup();
    map.addLayer(markerClusterGroup);

    const markers = L.layerGroup();
    
    Children.forEach(children, (child) => {
        if (isValidElement<{ position: L.LatLngExpression, icon: L.Icon | L.DivIcon, eventHandlers?: L.LeafletEventHandlerFnMap, children: ReactElement }>(child)) {
            let popupContent = '';
            const popupChild = child.props.children;
            if(isValidElement<{children: string}>(popupChild)) {
                popupContent = popupChild.props.children;
            }

            const marker = L.marker(child.props.position, {
                icon: child.props.icon
            }).bindPopup(popupContent);

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