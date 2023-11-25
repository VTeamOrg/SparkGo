import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

/* geocoder package */
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const geocoder = L.Control.Geocoder.nominatim();

function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {

    const handleClearMarkers = () => {
      if (mapRef.current) {
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            layer.remove();
          }
        });
      }
    };

    /* Check if the map is already initialized */
    if (!mapRef.current) {

      const map = L.map('leaflet-map').setView([56.1697, 15.5829], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      /* Disable tap handler */
      mapRef.current.tap = false;

      // Add a test marker for debugging
      // L.marker([56.1697, 15.5829]).addTo(mapRef.current);
    } 

    /* Listen for events */
    window.addEventListener('stationsDataLoaded', handleStationsDataLoaded);
    window.addEventListener('clearMarkers', handleClearMarkers);
    window.addEventListener('citiesDataLoaded', handleCitiesDataLoaded);

    function handleCitiesDataLoaded(data) {
      if (data && data.detail && Array.isArray(data.detail)) {

        const cityNames = data.detail.map((city) => city.name);
    
        const map = mapRef.current;
    
        /* Set the map's view to show most of Sweden */
        map.setView([60.1282, 15.5829], 6); 
    
        /* Get all existing markers on the map */
        const existingMarkers = [];
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            existingMarkers.push(layer);
          }
        });
    
        /* Perform geocoding for each city and add new markers if not already present */
        cityNames.forEach((cityName) => {
    
          /* Check if there's an existing marker for this city */
          const existingMarker = existingMarkers.find(
            (marker) => marker.getPopup().getContent() === cityName
          );
    
          if (existingMarker) {
            existingMarkers.splice(existingMarkers.indexOf(existingMarker), 1); 
          } else {
            geocoder.geocode(cityName, (results) => {
    
              if (results && results.length > 0) {
                const result = results[0];
                const coordinates = [result.center.lat, result.center.lng];
    
                /* Create a new marker and add it to the map as a new layer */
                const marker = L.marker(coordinates).addTo(map);
                marker.bindPopup(cityName);
              } else {
                console.log(`No results found for ${cityName}`);
              }
            });
          }
        });
    
        /* Remove markers for cities that are no longer in the data set */
        existingMarkers.forEach((marker) => map.removeLayer(marker));
      } else {
        console.log('Invalid cities data format:', data);
      }
    }
    
    
    
    
    
    
    
  
    

    /**
     * Handle the 'stationsDataLoaded' event and call fetchStations with the map as an argument.
     * @param {Event} event - The event containing marker data.
     */
    function handleStationsDataLoaded(event) {
      const markers = event.detail;
      console.log('stations data');

      /* Call fetchStations with the map as an argument */
      fetchStations(mapRef.current, markers);
    }

    return () => {
      /* Remove the event listeners when component unmounts */
      window.removeEventListener('stationsDataLoaded', handleStationsDataLoaded);
      window.removeEventListener('clearMarkers', handleClearMarkers);
    };
  }, []);

  /**
   * Function to add markers to the map.
   * @param {Object} map - The Leaflet map instance.
   * @param {Array} markers - An array of marker data.
   */
  function fetchStations(map, markers) {
    if (map && markers && markers.length > 0) {
      /* Clear existing markers before adding new ones */
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.remove();
        }
      });

      markers.forEach((marker) => {
        const { lat, lng, infoText, id } = marker;
        L.marker([lat, lng])
          .bindPopup(infoText)
          .addTo(map)
          .on('click', () => {
            console.log(`Clicked marker with id: ${id}`);
          });
      });
    }
  }

  return <div id="leaflet-map" style={{ height: '100vh', width: '100%' }}></div>;
}

export default MapView;
