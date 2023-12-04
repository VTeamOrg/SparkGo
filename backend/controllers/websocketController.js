const WebSocket = require("ws");

const handleConnection = (ws) => {
    console.log(ws);
};

// todo
// describe how the request would looklike
// create seperate files for each topic ex (vehicles, cities ...)
const handleMessage = (ws, message) => {
    console.log('Received message:', message.toString());
    if (ws.readyState === WebSocket.OPEN) {
        ws.send("Server Hello")
    }
};

const handleClose = (ws) => {
    console.log('WebSocket closed');
};

module.exports = { handleConnection, handleMessage, handleClose };
