import { Marker, Popup, useMap } from "react-leaflet";
import { signal, effect, computed } from "@preact/signals-react";
import karlskronaPolygen from "../../../testData/Karlskrona.json";
import { isUserInsideAnyPolygon } from './geospatialUtils.js';
import * as turf from '@turf/turf';


// const isInside = computed(() => turf.booleanPointInPolygon(turf.point([position.value]), turf.polygon(karlskronaPolygen.features[0].geometry)));
const position = signal(null);
const bbox = signal([]);

function LocationMarker() {
    const polygon = turf.polygon([
        [
          0, 0,
          10, 0,
          10, 10,
          0, 10,
          0, 0
        ]
      ]);
    const map = useMap();
    effect(() => {
        map.locate().on("locationfound", function (e) {
            // console.log(turf.polygon(karlskronaPolygen.features[0].geometry));
            // const isInside = turf.booleanPointInPolygon(turf.point([e.latlng.lat, e.latlng.lng]), polygon);
            console.log(isUserInsideAnyPolygon([e.latlng.lng, e.latlng.lat], karlskronaPolygen.features));

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

export default LocationMarker;
