import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { signal, effect } from "@preact/signals-react";
import { app_dark } from "../../GStore";
const position = signal(null);
const bbox = signal([]);

const Map = () => {
  const key = app_dark.value ? 'dark' : 'light';
  return (
    <MapContainer
      center={[60.1282, 18.6435]}
      zoom={50}
      key={key}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer className={`${app_dark.value ? "grayscale invert" : ""}`}
        // attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
        url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
      />
      <LocationMarker />
    </MapContainer>
  );
}

function LocationMarker() {
  const map = useMap();
  effect(() => {
    map.locate().on("locationfound", function (e) {
      position.value = e.latlng;
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      bbox.value = e.bounds.toBBoxString().split(",");
    });
  });

  return position.value === null ? null : (
    <Marker position={position.value}>
      <Popup>
        You are here. <br />
        Map bbox: <br />
        <b>Southwest lng</b>: {bbox.value[0]} <br />
        <b>Southwest lat</b>: {bbox.value[1]} <br />
        <b>Northeast lng</b>: {bbox.value[2]} <br />
        <b>Northeast lat</b>: {bbox.value[3]}
      </Popup>
    </Marker>
  );
}

export default Map;