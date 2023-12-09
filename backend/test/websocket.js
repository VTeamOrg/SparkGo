const chai = require('chai');
const expect = chai.expect;
const WebSocket = require('ws');
const app = require('../app');

describe('WebSocket Connection', () => {
    let ws;
    let server;

    before((done) => {
        // Start server before running tests
        server = app.appServer;

        server.listen(1337, () => {
            // Connect to WebSocket server
            ws = new WebSocket('ws://localhost:1337'); // Change the URL as needed
            ws.on('open', () => {
                done();
            });
        });
    });

    after(() => {
        // Close the WebSocket connection and server after tests
        ws.close();
        server.close();
    });

    it('should connect to WebSocket server', (done) => {
        // Test WebSocket connection
        expect(ws.readyState).to.equal(1); // WebSocket.OPEN (1) means connection is open
        done();
    });
});
