import ReactMapGL, { GeolocateControl, Layer, Source } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import CitiesGeoJson from "../../../testData/cities_geo.json";
import { useCallback, useEffect, useRef, useState } from "react";
import noGoZoneSVG from "../../assets/no_go_zone.svg";
import charginStationSVG from "../../assets/charging_station.svg";
import noParkingSVG from "../../assets/no_parking.svg";
import slowZoneSVG from "../../assets/slow_zone.svg";
import { msgBoxData } from "../msgBox/MsgBox";
import AreaMsgContainer from "./AreaMsgContainer";
import generateScooters from "../../../testData/generateScooters";
import VehicleMarkers from "./VehicleMarkers";

const MapBox = () => {
  const [mapRef, setMapRef] = useState(null);
  const geoControlRef = useRef();
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: 0,
    longitude: 0,
    zoom: 20,
  });

  const [scooters, setScooters] = useState([]);

  const onFeatureClick = (featureType) => {
    switch (featureType) {
      case "slow":
        msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={slowZoneSVG} title="Slow" text="Your vehicle will automatically slow down in this area" /> };
        break;
      case "no_go":
        msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={noGoZoneSVG} title="No Go Zone" text="Your vehicle will slow down and may stop completely. You can't end your ride here." /> };
        break;
      case "restrictid":
        msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={noGoZoneSVG} title="Restrictid Area" text="You risk a fine if you end your ride here" /> };
        break;
      case "charging_station":
        msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={charginStationSVG} title="Charging Station" text="Charge your ride here! Park your scooter and plug in for a powered-up journey ahead." /> };
        break;
      case "no_parking":
        msgBoxData.value = { timeout: 5000, content: <AreaMsgContainer svgIcon={noParkingSVG} title="No Parking Zone" text="Please avoid parking scooters in this area." /> };
        break;

      default:
        msgBoxData.value = {
          timeout: null,
          content: null
        };
        break;
    }
  };

  const handleMapClick = (e) => {
    if (e.originalEvent.srcElement.tagName !== "CANVAS") return;
    const map = mapRef.getMap();
    const bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5],
    ];

    const selectedFeatures = map.queryRenderedFeatures(bbox);

    const featureType = selectedFeatures.map((feature) => feature.properties.type);

    onFeatureClick(featureType[0]);
  };

  const handleLocationChange = () => {
    console.log("User moved");
  }

  const onMove = useCallback(({ viewState }) => {
    setViewport({ ...viewport, longitude: viewState.longitude, latitude: viewState.latitude, zoom: viewState.zoom });
  }, [])

  useEffect(() => {
    setScooters(generateScooters(200, 15.5869, 56.1612))
  }, [])

  return (
    <ReactMapGL
      ref={(ref) => setMapRef(ref)}
      className="h-full w-full"
      onMove={onMove}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_KEY}
      initialViewState={{
        longitude: 15.5869,
        latitude: 56.1612,
        zoom: 14
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onClick={handleMapClick}
      onLoad={() => {
        geoControlRef.current?.trigger();
      }}
    >
      <>
        <GeolocateControl
          ref={geoControlRef}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
          onGeolocate={handleLocationChange}
          onTrackUserLocationStart={(e) => console.log(e)}

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

        <VehicleMarkers mapRef={mapRef} scooters={scooters} viewport={viewport} setViewport={setViewport} />


      </>
    </ReactMapGL>
  )
}

export default MapBox;
