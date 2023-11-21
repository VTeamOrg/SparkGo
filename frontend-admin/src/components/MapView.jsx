import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/**
 * Component to display a map using Leaflet and add markers dynamically.
 */
function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    /**
     * Initialize the map when the component mounts.
     */
    const initializeMap = () => {
      console.log('MapView component mounted');

      const existingMapInstance = L.DomUtil.get('leaflet-map');
      if (existingMapInstance) {
        existingMapInstance._leaflet_id = null;
      }

      console.log('Initializing map');

      // Create a map centered on Karlskrona, Sweden
      const map = L.map('leaflet-map').setView([56.1697, 15.5829], 13);

      // Add a tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      // Listen for the 'stationsDataLoaded' event
      window.addEventListener('stationsDataLoaded', handleStationsDataLoaded);
    };

    initializeMap();

    return () => {
      // Cleanup the event listener when the component unmounts
      window.removeEventListener('stationsDataLoaded', handleStationsDataLoaded);
    };
  }, []);

  /**
   * Handle the 'stationsDataLoaded' event and add markers to the map.
   * @param {Event} event - The event containing marker data.
   */
  const handleStationsDataLoaded = (event) => {
    // Handle the event and use the data to add markers to the map
    const markers = event.detail;

    if (mapRef.current && markers && markers.length > 0) {
      // Clear existing markers before adding new ones
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      markers.forEach(marker => {
        const { lat, lng, infoText, id } = marker;
        L.marker([lat, lng])
          .bindPopup(infoText)
          .addTo(mapRef.current)
          .on('click', () => {
            console.log(`Clicked marker with id: ${id}`);
          });
      });
    }
  };

  console.log('Rendering MapView component');
  return <div id="leaflet-map" style={{ height: '100vh' }}></div>;
}

export default MapView;
