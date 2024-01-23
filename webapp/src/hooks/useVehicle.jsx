import { useState, useEffect } from 'react';
import websocketService from '../services/websocketService';
import { msgBoxData, userDataStore, vehicleStore } from '../GStore';

const useVehicle = (vehicleId) => {
    const socket = websocketService.socket;

    // Function to send actions to the server
    const sendAction = (action) => {
        const message = JSON.stringify({ action, payload: { vehicleId } });
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }

        // Get the response from the server
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.action === "success") {
                if (data.message === "rentVehicleAccepted" && data.data.vehicleId === vehicleId) {
                    msgBoxData.value = {
                        content: "Vehicle rented successfully!",
                        timeout: 3000,
                    };
                    userDataStore.value = { ...userDataStore.value, rentedVehicle: vehicleId };
                }
                if (data.message === "returnVehicleAccepted" && data.data.vehicleId === vehicleId) {
                    msgBoxData.value = {
                        content: "Vehicle returned successfully!",
                        timeout: 3000,
                    };
                    userDataStore.value = { ...userDataStore.value, rentedVehicle: null };
                }

                if (data.message === "startVehicleAccepted" && data.data.vehicleId === vehicleId) {
                    const updatedVehicle = vehicleStore.value.find(vehicle => vehicle.id === vehicleId);
                    updatedVehicle.isStarted = true;
                    vehicleStore.value = [...vehicleStore.value.filter(vehicle => vehicle.id !== vehicleId)]
                    vehicleStore.value = [...vehicleStore.value, updatedVehicle];
                    msgBoxData.value = {
                        content: "Ride resumed successfully!",
                        timeout: 3000,
                    };
                }

                if (data.message === "stopVehicleAccepted" && data.data.vehicleId === vehicleId) {
                    const updatedVehicle = vehicleStore.value.find(vehicle => vehicle.id === vehicleId);
                    updatedVehicle.isStarted = false;
                    vehicleStore.value = [...vehicleStore.value.filter(vehicle => vehicle.id !== vehicleId)]
                    vehicleStore.value = [...vehicleStore.value, updatedVehicle];

                    msgBoxData.value = {
                        content: "Ride paused successfully!",
                        timeout: 3000,
                    };
                }

            } else if (data.action === "error") {
                msgBoxData.value = {
                    content: data.message,
                    timeout: 3000,
                };
            }
        };
    };

    // Functions for specific vehicle actions
    const rentVehicle = async () => {
        sendAction('rentVehicle');
    };

    const resumeRide = () => {
        sendAction('startVehicle');
    };

    const pauseRide = () => {
        sendAction('stopVehicle');
    };

    const returnVehicle = () => {
        sendAction('returnVehicle');
    };

    return {
        rentVehicle,
        resumeRide,
        pauseRide,
        returnVehicle,
    };
};

export default useVehicle;
