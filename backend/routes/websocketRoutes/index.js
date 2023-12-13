const websocketController = require('../../controllers/websocketController');

module.exports = (wss) => {
    const connectedClients = {
        vehicles: [],
        users: [],
        admins: [],
    };
    let connectionId = 0;
    wss.on('connection', (ws, req) => {
        const deviceType = req.url.split('=')[1];
        connectionId += 1;
        websocketController.handleConnection(ws, req, connectedClients, connectionId, deviceType);

        ws.on('message', (message) => {
            websocketController.handleMessage(ws, message);
        });

        ws.on('close', () => {
            websocketController.handleClose(connectedClients, connectionId, deviceType);
        });
    });
};
