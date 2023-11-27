import { Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { PiScooterFill } from "react-icons/pi";
import { msgBoxData } from "../msgBox/MsgBox";
import VehicleMsgContainer from "./VehicleMsgContainer";
import { useState } from "react";

const VehicleMarkers = ({mapRef, scooters, viewport, setViewport}) => {
    const [clickedVehicle, setClickedVehicle] = useState(null);
    const { clusters, supercluster } = useSupercluster({
        points: scooters,
        bounds: mapRef ? mapRef.getMap().getBounds().toArray().flat() : null,
        zoom: viewport.zoom,
        options: { radius: 75, maxZoom: 20 }
    });

    const handleScooterClick = (e, scooter) => {
        e.preventDefault();
        setClickedVehicle(scooter.id);
        msgBoxData.value = { timeout: null, content: <VehicleMsgContainer />, onClose: ()=>setClickedVehicle(null) };
    }
    return (
        <>
            {clusters.map(cluster => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates;
                const {
                    cluster: isCluster,
                    point_count: pointCount
                } = cluster.properties;

                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            latitude={latitude}
                            longitude={longitude}
                            onClick={() => {
                                const expansionZoom = Math.min(
                                    supercluster.getClusterExpansionZoom(cluster.id),
                                    50
                                );

                                setViewport({
                                    ...viewport,
                                    latitude,
                                    longitude,
                                    zoom: expansionZoom,
                                    transitionInterpolator: mapRef.flyTo({
                                        zoom: expansionZoom,
                                        center: [longitude, latitude],
                                        duration: 500
                                    }),
                                    transitionDuration: "auto"
                                })
                            }}
                        >
                            <div
                                className="text-white bg-primary rounded-full p-3 flex justify-center items-center"
                                style={{
                                    width: `${10 + (pointCount / scooters.length) * 20}px`,
                                    height: `${10 + (pointCount / scooters.length) * 20}px`
                                }}
                            >
                                {pointCount}
                            </div>
                        </Marker>
                    );
                }

                // single scooter
                return (
                    <Marker
                        key={`${cluster.properties.id}`}
                        latitude={latitude}
                        longitude={longitude}
                    >
                        <PiScooterFill className={`${clickedVehicle === cluster.properties.id && msgBoxData.value.content && "bg-blue-300 rounded-full"} text-4xl text-primary`} onClick={(e) => handleScooterClick(e, cluster.properties)} />

                    </Marker>
                );
            })}

        </>
    );
}

export default VehicleMarkers;