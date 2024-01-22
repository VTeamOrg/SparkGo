const chai = require('chai');
const expect = chai.expect;
const WebSocket = require('ws');
const app = require('../../app');

describe('WebSocket Connection', () => {
    let ws;
    let server;
    const wsUrl = 'ws://localhost:1337';

    before((done) => {
        server = app.appServer;

        if (!server.listening) {
            server.listen(1337, () => {
                console.log('WebSocket server is listening on port 1337');
                ws = new WebSocket(wsUrl);
                ws.on('open', () => {
                    console.log('WebSocket connection opened');
                    done();
                });
            });
        } else {
            ws = new WebSocket(wsUrl);
            ws.on('open', () => {
                console.log('WebSocket connection opened');
                done();
            });
        }
    });

    after(() => {
        if (ws) {
            ws.close();
            console.log('WebSocket connection closed');
        }
        if (server.listening) {
            server.close(() => {
                console.log('WebSocket server closed');
            });
        }
    });

    it('should connect to WebSocket server', (done) => {
        console.log('WebSocket state:', ws.readyState);
        expect(ws.readyState).to.equal(WebSocket.OPEN);
        done();
    });
});