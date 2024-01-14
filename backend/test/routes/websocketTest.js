const chai = require('chai');
const expect = chai.expect;
const WebSocket = require('ws');
const app = require('../../app');

describe('WebSocket Connection', () => {
    let ws;
    let server;
    const wsUrl = 'ws://localhost:3000';

    before((done) => {
        server = app.appServer;

        // Start the server only if it's not already listening
        if (!server.listening) {
            server.listen(1337, () => {
                ws = new WebSocket(wsUrl); // Change the URL as needed
                ws.on('open', () => {
                    done();
                });
            });
        } else {
            ws = new WebSocket(wsUrl);
            ws.on('open', () => {
                done();
            });
        }
    });

    after(() => {
        // Close WebSocket connection if it exists and server after tests
        if (ws) {
            ws.close();
        }
        if (server.listening) {
            server.close();
        }
    });

    it('should connect to WebSocket server', (done) => {
        expect(ws.readyState).to.equal(WebSocket.OPEN);
        done();
    });
    it('should connect to WebSocket server', (done) => {
        expect(ws.readyState).to.equal(WebSocket.OPEN);
        done();
    });
});