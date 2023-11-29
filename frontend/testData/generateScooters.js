function generateNearbyScooters(total, lon, lat) {
    const features = [];
    for (let i = 0; i < total; i++) {
        const id = `sc-${i}`;
        const batteryLevel = `${Math.floor(Math.random() * 100)}%`;
        const range = `${Math.floor(Math.random() * 40) + 20}km`;

        // Generate random offsets for latitude and longitude
        const lonOffset = Math.random() * 0.008 - 0.010; 
        const latOffset = Math.random() * 0.010 - 0.005;

        const coordinates = [
            (lon + lonOffset).toFixed(6),
            (lat + latOffset).toFixed(6)
        ];

        const feature = {
            type: "Feature",
            properties: {
                cluster: false,
                id,
                battery_level: batteryLevel,
                range
            },
            geometry: {
                type: "Point",
                coordinates
            }
        };
        features.push(feature);
    }

    return features;
}
export default generateNearbyScooters;

