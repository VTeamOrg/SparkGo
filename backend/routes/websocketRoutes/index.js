const websocketController = require('../../controllers/websocketController');

function wsUrlParser(wsUrlString) {
    const urlParts = wsUrlString.split("?");
    const params = {};
  
    if (urlParts.length > 1) {
      const queryString = urlParts[1];
      const queryParams = new URLSearchParams(queryString);
  
      for (const [param, value] of queryParams) {
        const paramName = param.startsWith('/') ? param.slice(1) : param;
        params[paramName] = value;
      }
    }
  
    return params;
  }

const loadWebsocket = (wss) => {
    wss.on('connection', (ws, req) => {
        const params = wsUrlParser(req.url);
        console.log(params);
        const type = params.type;
        console.log('params', params);
        const id = parseInt(params.id);
        websocketController.handleConnection(ws, req, id, type);

        ws.on('message', (message) => {
            websocketController.handleMessage(ws, message);
        });

        ws.on('close', () => {
            websocketController.handleClose(id, type);
        });
    });
};


module.exports = loadWebsocket;
