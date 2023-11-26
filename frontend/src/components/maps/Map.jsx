import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { signal, effect } from "@preact/signals-react";
import { app_dark } from "../../GStore";
import LocationMarker from "./LocationMarker";
import 'leaflet.snogylop';
import karlskronaPolygen from "../../../testData/Karlskrona.json";
const position = signal(null);
const bbox = signal([]);

const highlightedStyle = {
  weight: 2,
};

const multiPolygon = karlskronaPolygen;
console.log(multiPolygon);

const Map = () => {
  const key = app_dark.value ? 'dark' : 'light';
  return (
    <MapContainer
      center={[56.1612, 15.5869]}
      zoom={50}
      key={key}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer className={` ${app_dark.value ? "grayscale invert" : ""}`}
        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
      />
      <LocationMarker />
      <GeoJSON invert="true" key='my-geojson' data={karlskronaPolygen} style={highlightedStyle} />
    </MapContainer>
  );
}

export default Map;