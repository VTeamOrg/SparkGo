import { Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { PiScooterFill } from "react-icons/pi";
import VehicleMsgContainer from "./VehicleMsgContainer";
import { useSignal, useSignalEffect } from "@preact/signals-react";
import { loadedVehicles, msgBoxData } from "../../GStore";
import { useEffect, useMemo, useState  } from "react";

const VehicleMarkers = ({ mapRef, viewport }) => {
    const [vehicleCoordinates, setVehicleCoordinates] = useState([]);

    const createPoints = (vehicles) => {
        return vehicles.map(createPoint);
    }

    const createPoint = (item) => {
        const { lon, lat } = item;

        return {
            type: 'Feature',
            properties: { cluster: false, item },
            geometry: {
                type: 'Point',
                coordinates: [lon, lat],
            },
        }
    }

    const vehicles = useMemo(() => createPoints(loadedVehicles.value), [loadedVehicles.value]);

    const clickedVehicle = useSignal(null);
    const { clusters, supercluster } = useSupercluster({
        points: vehicleCoordinates,
        bounds: mapRef.value ? mapRef.value.getMap().getBounds().toArray().flat() : null,
        zoom: viewport.value.zoom ?? 12,
        options: { radius: 75, maxZoom: 15 },
    });

    const handleVehicleClick = (e, vehicle) => {
        e.preventDefault();

        clickedVehicle.value = vehicle.item.id;
        msgBoxData.value = { timeout: null, content: <VehicleMsgContainer vehicleId={vehicle.item.id} batteryLevel={vehicle.item.battery} cost={3.00} unlockFee={2.00} currency="sek" />, onClose: () => clickedVehicle.value = null };
    }

    useEffect(() => {
        const animation = window.requestAnimationFrame(() => {
            const updatedCoordinates = vehicles.map((vehicle) => {
                const currVehicle = vehicle;
                const newLon = parseFloat(currVehicle.lon);
                const newLat = parseFloat(currVehicle.lat);
    
                if (!newLon || !newLat) return vehicle;
    
                const currentLon = parseFloat(vehicle.lon) || newLon;
                const currentLat = parseFloat(vehicle.lat) || newLat;
    
                const interpolatedLon = currentLon + (newLon - currentLon) * 0.5;
                const interpolatedLat = currentLat + (newLat - currentLat) * 0.5;

                const point = {
                    type: 'Feature',
                    properties: {
                        cluster: false,
                        id: vehicle.id,
                        battery: vehicle.battery,
                        currentSpeed: vehicle.currentSpeed,
                        maxSpeed: vehicle.maxSpeed
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [interpolatedLon, interpolatedLat],
                    },
                };
    
                return point;
            });
            setVehicleCoordinates(updatedCoordinates);
        });
    
        return () => window.cancelAnimationFrame(animation);
    }, [vehicles]);

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
                                    20
                                );

                                viewport.value = {
                                    ...viewport.value,
                                    latitude,
                                    longitude,
                                    zoom: expansionZoom,
                                    transitionInterpolator: mapRef.value.flyTo({
                                        zoom: expansionZoom,
                                        center: [longitude, latitude],
                                        duration: 500
                                    }),
                                    transitionDuration: "auto"
                                }
                            }}
                        >
                            <div
                                className="text-white bg-accent-1 rounded-full p-3 flex justify-center items-center"
                                style={{
                                    width: `${10 + (pointCount / loadedVehicles.value.length) * 20}px`,
                                    height: `${10 + (pointCount / loadedVehicles.value.length) * 20}px`
                                }}
                            >
                                {pointCount}
                            </div>
                        </Marker>
                    );
                }

                // single vehicle
                return (
                    <Marker
                        key={`${cluster.properties.item.id}`}
                        latitude={latitude}
                        longitude={longitude}
                    >
                        <PiScooterFill className={`${clickedVehicle.value === cluster.properties.id && msgBoxData.value.content && "bg-blue-300 rounded-full"} text-4xl text-accent-1`} onClick={(e) => handleVehicleClick(e, cluster.properties)} />
                    </Marker>
                );
            })}

        </>
    );
}

export default VehicleMarkers;