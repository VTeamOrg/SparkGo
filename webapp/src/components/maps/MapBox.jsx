import ReactMapGL, { GeolocateControl, Layer, Source } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import CitiesGeoJson from "../../../testData/cities_geo.json";
import noGoZoneSVG from "../../assets/no_go_zone.svg";
import charginStationSVG from "../../assets/charging_station.svg";
import noParkingSVG from "../../assets/no_parking.svg";
import slowZoneSVG from "../../assets/slow_zone.svg";
import AreaMsgContainer from "./AreaMsgContainer";
import generateScooters from "../../../testData/generateScooters";
import VehicleMarkers from "./VehicleMarkers";
import { computed, useSignal } from "@preact/signals-react";
import { curr_theme, msgBoxData } from "../../GStore";

/**
 * Represents a map component with features like geolocation, area markers, and vehicle markers.
 * @returns {JSX.Element} - Returns the JSX for the MapBox component.
 */

const MapBox = () => {
  const mapStyle = computed(()=> curr_theme.value === "dark" ? "mapbox://styles/mapbox/navigation-night-v1" : "mapbox://styles/mapbox/navigation-day-v1");
  const mapRef = useSignal(null);
  const geoControlRef = useSignal(null);
  const viewport = useSignal({
    width: '100%',
    height: 400,
    latitude: 0,
    longitude: 0,
    zoom: 12,
  });

  const scooters = useSignal(generateScooters(50, 15.5869, 56.1612));

  /**
 * Handles the click event for different map features and displays corresponding information.
 * @param {string} featureType - The type of feature clicked on the map.
 * @returns {void}
 */
  const handleFeatureClick = (featureType) => {
    const featureData = {
      slow: { icon: slowZoneSVG, title: "Slow", text: "Your vehicle will automatically slow down in this area" },
      no_go: { icon: noGoZoneSVG, title: "No Go Zone", text: "Your vehicle will slow down and may stop completely. You can't end your ride here." },
      restrictid: { icon: noGoZoneSVG, title: "Restricted Area", text: "You risk a fine if you end your ride here" },
      charging_station: { icon: charginStationSVG, title: "Charging Station", text: "Charge your ride here! Park your scooter and plug in for a powered-up journey ahead." },
      no_parking: { icon: noParkingSVG, title: "No Parking Zone", text: "Please avoid parking scooters in this area." },
    };

    const selectedData = featureData[featureType];

    if (!selectedData) {
      return msgBoxData.value = {
        ...msgBoxData.value,
        timeout: 0,
      };
    }

    msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={selectedData.icon} title={selectedData.title} text={selectedData.text} /> };
  };

  /**
   * Handles the click event on the map and triggers the display of information about the clicked feature.
   * @param {object} e - The event object containing information about the click.
   * @returns {void}
   */
  const handleMapClick = (e) => {
    if (e.originalEvent.srcElement.tagName !== "CANVAS") return;

    const map = mapRef.value?.getMap();
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    const selectedFeatures = map.queryRenderedFeatures(bbox);
    const featureType = selectedFeatures.map((feature) => feature.properties.type);

    handleFeatureClick(featureType[0]);
  };

  /**
   * Handles the change in user location and logs a message.
   * @returns {void}
   */
  const handleLocationChange = () => {
    console.log("User moved");
  }

  return (
    <ReactMapGL
      ref={(ref) => mapRef.value = ref}
      className="h-full w-full"
      onMove={({ viewState }) => {
        viewport.value = { ...viewport, longitude: viewState.longitude, latitude: viewState.latitude, zoom: viewState.zoom };
      }}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_KEY}
      initialViewState={{
        longitude: 15.5869,
        latitude: 56.1612,
        zoom: 12
      }}
      mapStyle={mapStyle.value}
      onClick={handleMapClick}
      onLoad={() => {
        geoControlRef.value?.trigger();
      }}
    >
      <>
        <GeolocateControl
          ref={(ref) => geoControlRef.value = ref}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
          onGeolocate={handleLocationChange}
        />

        <Source id="allowedCities" type="geojson" data={CitiesGeoJson}>
          <Layer
            id="cities-layer"
            type='fill'
            paint={{
              'fill-opacity': 0.5,
              'fill-color': [
                'match',
                ['get', 'type'],
                'slow', '#ff8a00',
                'restrictid', 'blue',
                'no_go', 'red',
                'no_parking', 'red',
                'charging_station', '#00d5ae',
                'black' // Default color if type doesn't match
              ]
            }}
          />
        </Source>

        <VehicleMarkers mapRef={mapRef} scooters={scooters} viewport={viewport} />


      </>
    </ReactMapGL>
  )
}

export default MapBox;
