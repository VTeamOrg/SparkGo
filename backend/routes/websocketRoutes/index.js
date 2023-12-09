const websocketController = require('../../controllers/websocketController');

module.exports = (wss) => {
    wss.on('connection', (ws) => {
        websocketController.handleConnection(ws);

        ws.on('message', (message) => {
            websocketController.handleMessage(ws, message);
        });

        ws.on('close', () => {
            websocketController.handleClose(ws);
        });
    });
};
