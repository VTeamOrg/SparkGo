import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import './MapView.css';

function MapView() {
  const mapRef = useRef(null);
  const citiesCoordinates = useRef(new Map());
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const handleClearMarkers = () => {
      setMarkers([]);
    };

    window.addEventListener('stationsDataLoaded', handleStationsDataLoaded);
    window.addEventListener('clearMarkers', handleClearMarkers);
    window.addEventListener('citiesDataLoaded', handleCitiesDataLoaded);

    function handleCitiesDataLoaded(data) {
      if (data && data.detail && Array.isArray(data.detail)) {
        const cityData = data.detail;
        setMarkers([]);

        cityData.forEach((city) => {
          const { name } = city;
          const coordinates = citiesCoordinates.current.get(name);

          if (coordinates) {
            const { lat, lng } = coordinates;
            setMarkers((prevMarkers) => [
              ...prevMarkers,
              <Marker key={name} position={[lat, lng]}>
                <Popup>{name}</Popup>
              </Marker>
            ]);

            // Use mapRef to access the map instance and set the zoom level
            // Center on Sweden and set zoom to 6
            if (mapRef.current) {
              mapRef.current.setView([60.1282, 15.5829], 6); 
            }
          }
        });
      } else {
        console.log('Invalid cities data format:', data);
      }
    }

    function handleStationsDataLoaded(event) {
      const markersData = event.detail.map((marker, index) => {
        const { lat, lng, infoText, id } = marker;
        return (
          <Marker key={id || index} position={[lat, lng]}>
            <Popup>{infoText}</Popup>
          </Marker>
        );
      });

      setMarkers(markersData);

      // Use mapRef to access the map instance and set the zoom level
      // Center on Karlskoga and set zoom to 6
      if (mapRef.current) {
        mapRef.current.setView([56.1608, 15.5861], 13); 
      }
    }

    return () => {
      window.removeEventListener('stationsDataLoaded', handleStationsDataLoaded);
      window.removeEventListener('clearMarkers', handleClearMarkers);
    };
  }, []);

  /* Load city coordinates from CSV when component mounts */
  useEffect(() => {
    fetch('/swedish_cities.csv')
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          delimiter: ',',
          header: false,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (Array.isArray(result.data)) {
              result.data.forEach((row) => {
                const [swedishName, internationalName, lat, lng] = row;
                citiesCoordinates.current.set(swedishName, { lat, lng });
                citiesCoordinates.current.set(internationalName, { lat, lng });
              });
            }
          },
        });
      });
  }, []);

  return (
    <div id="leaflet-map" style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        ref={mapRef} // Assign the ref to the MapContainer
        center={[56.1697, 15.5829]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        dragging={true}
        minZoom={3}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers}
      </MapContainer>
    </div>
  );
}

export default MapView;
