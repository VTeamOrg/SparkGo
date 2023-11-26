import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import L from 'leaflet';


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

    if (!mapRef.current) {
      mapRef.current = L.map('leaflet-map').setView([56.1697, 15.5829], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      mapRef.current.tap = false;
    }

    window.addEventListener('stationsDataLoaded', handleStationsDataLoaded);
    window.addEventListener('clearMarkers', handleClearMarkers);
    window.addEventListener('citiesDataLoaded', handleCitiesDataLoaded);

    function handleCitiesDataLoaded(data) {
      if (data && data.detail && Array.isArray(data.detail)) {
        const cityNames = data.detail.map((city) => city.name);
        const map = mapRef.current;

        map.setView([60.1282, 15.5829], 6);

        const existingMarkers = [];
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            existingMarkers.push(layer);
          }
        });

        cityNames.forEach((cityName) => {
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
                const marker = L.marker(coordinates).addTo(map);
                marker.bindPopup(cityName);
              } else {
                console.log(`No results found for ${cityName}`);
              }
            });
          }
        });

        existingMarkers.forEach((marker) => map.removeLayer(marker));
      } else {
        console.log('Invalid cities data format:', data);
      }
    }

    function handleStationsDataLoaded(event) {
      const markers = event.detail;
      console.log('mapview stations data');
      fetchStations(mapRef.current, markers);
    }

    return () => {
      window.removeEventListener('stationsDataLoaded', handleStationsDataLoaded);
      window.removeEventListener('clearMarkers', handleClearMarkers);
    };
  }, []);

  function fetchStations(map, markers) {
    if (map && markers && markers.length > 0) {
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

  return (
    <div id="leaflet-map" style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[56.1697, 15.5829]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
}

export default MapView;
