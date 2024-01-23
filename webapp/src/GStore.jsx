import { signal } from "@preact/signals-react";

/**
 * A global signal holding data for the message box, including content, timeout(timer), and onClose function.
 * This can be used to display data in the MsgBox component
 */
export const msgBoxData = signal({
    timeout: null,
    content: null,
    onClose: null
});

export const appSettingsStore = signal({
    style: "dark",
});
export const vehicleStore = signal([]);

export const userDataStore = signal({
    rentedVehicle: null,
});


// export const vehicleStore = {
//     add: (vehicles) => {
//         // remove duplicates
//         const newVehicles = vehicles.filter(vehicle => !loadedVehicles.value.some(v => v.id === vehicle.id));
//         loadedVehicles.value = [...loadedVehicles.value, ...newVehicles];
//     },
//     remove: (vehicleId) => {
//         loadedVehicles.value = loadedVehicles.value.filter(vehicle => vehicle.id !== vehicleId);
//     },
//     update: (vehicleId, data) => {
//         loadedVehicles.value = loadedVehicles.value.map(vehicle => {
//             if (vehicle.id === vehicleId) {
//                 return { ...vehicle, ...data };
//             }
//             return vehicle;
//         });
//     },
//     get: (vehicleId) => {
//         return loadedVehicles.value.find(vehicle => vehicle.id === vehicleId);
//     },
//     getAll: () => {
//         return loadedVehicles.value;
//     },
//     clear: () => {
//         loadedVehicles.value = [];
//     }
// }