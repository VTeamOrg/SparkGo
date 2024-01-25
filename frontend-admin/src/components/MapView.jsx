import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse';
import './MapView.css';
import { fetchData } from './support/FetchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChargingStation, faParking } from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';

function MapView() {
  const mapRef = useRef(null);
  const citiesCoordinates = useRef(new Map());
  const [markers, setMarkers] = useState([]);
  const [mapEnabled, setMapEnabled] = useState(true);
  const [parking, setParking] = useState([]);
  const [stationMarkers, setStationMarkers] = useState([]);
  const [vehicleMarkers, setVehicleMarkers] = useState([]);
  
  useEffect(() => {


    const handleDisableMap = () => {
      setMapEnabled(false);
    };
  
    const handleEnableMap = () => {
      setMapEnabled(true);
    };

    const handleClearMarkers = () => {
      setMarkers([]);
      setStationMarkers([]);
      setVehicleMarkers([]);

    };

    window.addEventListener('stationsDataLoaded', handleStationsDataLoaded);
    window.addEventListener('clearMarkers', handleClearMarkers);
    window.addEventListener('citiesDataLoaded', handleCitiesDataLoaded);
    window.addEventListener('disableMap', handleDisableMap);
    window.addEventListener('enableMap', handleEnableMap);
    window.addEventListener('vehiclesDataLoaded', handleVehiclesDataLoaded);

    function handleCitiesDataLoaded(data) {
      console.log("cities loaded");
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
      fetchData('parkingZones', (parkingData) => {
        setParking(parkingData);
        console.log("parkingZones, ", parkingData);
    
        console.log("stations loaded");
    
        const stationMarkers = event.detail.map((marker, index) => {
          const { lat, lng, infoText, station_id } = marker;
    
          console.log("stations", marker);
    
          const iconHtml = ReactDOMServer.renderToString(
            <FontAwesomeIcon icon={faChargingStation} />
          );
    
          /* Parking area around the station with a 20-meter radius */
          const circle = (
            <Circle
              key={`circle-${station_id || index}`}
              center={[lat, lng]}
              radius={15} 
              color="green" 
              fillColor="green" 
              fillOpacity={0.2} 
            />
          );
    
          /* Station marker */
          const stationMarker = (
            <Marker
              key={station_id || index}
              position={[lat, lng]}
              icon={L.divIcon({
                className: 'station-marker-icon',
                html: iconHtml,
                iconSize: [24, 24],
              })}
            >
              <Popup>{infoText}</Popup>
            </Marker>
          );
    
          return [circle, stationMarker];
        });
    
        const parkingMarkers = parkingData.map((parkingZone, index) => {
          const { coords_lat, coords_long, name, id } = parkingZone;
    
          const parkingIconHtml = ReactDOMServer.renderToString(
            <FontAwesomeIcon icon={faParking} />
          );
    
          /* Parking area around the parking zone */
          const circle = (
            <Circle
              key={`circle-parking-${id || index}`}
              center={[coords_lat, coords_long]}
              radius={15} 
              color="green" 
              fillColor="green" 
              fillOpacity={0.2} 
            />
          );
    
          /* Marker for the parking zone */
          const parkingMarker = (
            <Marker
              key={`parking-${id || index}`}
              position={[coords_lat, coords_long]}
              icon={L.divIcon({
                className: 'parking-marker-icon',
                html: parkingIconHtml,
                iconSize: [24, 24],
              })}
            >
              <Popup>{name}</Popup>
            </Marker>
          );
    
          return [circle, parkingMarker];
        });
    
        const allMarkers = [...stationMarkers, ...parkingMarkers];
    
        setStationMarkers(allMarkers);
    
        if (mapRef.current) {
          mapRef.current.setView([56.1608, 15.5861], 13);
        }
      });
    }
    

    function handleVehiclesDataLoaded(event) {
      console.log("vehicles loaded");
      const vehicleMarkers = event.detail.map((vehicle, index) => {

        const { lat, lng, infoText, id, cityName, status, battery, currentSpeed, maxSpeed, isStarted, rentedBy } = vehicle;
        console.log("vehicleMarkers", vehicle);

        return (
          <Marker key={id || index} position={[lat, lng]}>
            <Popup>
              <div>
                <h4>{infoText}</h4>
                <p>ID: {id}</p>
                <p>City: {cityName}</p>
                <p>Status: {status}</p>
                <p>Battery: {battery}</p>
                <p>Current Speed: {currentSpeed}</p>
                <p>Max Speed: {maxSpeed}</p>
                <p>Started: {isStarted ? 'Yes' : 'No'}</p>
                <p>Rented By: {rentedBy === -1 ? 'Red Cross' : rentedBy}</p>
              </div>
            </Popup>
          </Marker>
        );
      });
    
      setVehicleMarkers(vehicleMarkers);
    
      // Use mapRef to access the map instance and set the zoom level
      // Center on the first vehicle's position and set zoom to your desired value
      if (mapRef.current && event.detail.length > 0) {
        const firstVehicle = event.detail[0];
        mapRef.current.setView([firstVehicle.lat, firstVehicle.lng], 13);
      }
    }

    return () => {
      window.removeEventListener('stationsDataLoaded', handleStationsDataLoaded);
      window.removeEventListener('clearMarkers', handleClearMarkers);
      window.removeEventListener('disableMap', handleDisableMap);
      window.removeEventListener('enableMap', handleEnableMap);
      window.removeEventListener('vehiclesDataLoaded', handleVehiclesDataLoaded);
      window.removeEventListener('citiesDataLoaded', handleCitiesDataLoaded);
  
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
      {mapEnabled ? (
        <MapContainer
          ref={mapRef}
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
          {/* Render both stationMarkers and vehicleMarkers */}
          {stationMarkers}
          {vehicleMarkers}
          {markers}
        </MapContainer>
      ) : (
        <div className="map-disabled-message">Map is disabled for this view</div>
      )}
    </div>
  );
}

export default MapView;
