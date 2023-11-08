/* global it describe */

process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const HTMLparser = require("node-html-parser");
const app = require("../../backend-mongodb/app.js"); // Import the 'app' variable from your main application file
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe("Server Connection Behavior", () => {
    let server; // Declare a variable to hold the server instance
    const testPort = 3000; // Choose a port for your test environment (e.g., 3000)
    let allTestsPassed = true; // Variable to track test status

    // Before running the tests, start the server on the selected port
    before((done) => {
        server = app.listen(testPort, () => {
            console.log(`Test server is running on port ${testPort}`);
            done();
        });
    });

    // After running the tests, close the server to release the port
    after(() => {
        server.close();
        if (allTestsPassed) {
            // This code will run if all tests passed
            console.log("All tests passed! Performing post-pass actions...");
            // Add your post-pass actions here
        }
    });

    // This is just an example test. Replace it with your actual test cases.
    it("should return a 200 status code when connecting to the server", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 3: Test a GET request to an endpoint from the "delayed" route
    it("should handle a GET request and return a 200 status code for an endpoint from the 'delayed' route", (done) => {
        chai.request(app)
            .get("/delayed")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 4: Test an endpoint from the "codes" route
    it("should return a 200 status code when accessing an endpoint from the 'codes' route", (done) => {
        chai.request(app)
            .get("/codes")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 5: Test an endpoint from the "tickets" route
    it("should return a 200 status code when accessing an endpoint from the 'tickets' route", (done) => {
        chai.request(app)
            .get("/tickets")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 6: Test an endpoint from the "stations" route
    it("should return a 200 status code when accessing an endpoint from the 'stations' route", (done) => {
        chai.request(app)
            .get("/stations")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 7: Test an endpoint from the "delayedFilter" route
    it("should return a 200 status code when accessing an endpoint from the 'delayedFilter' route", (done) => {
        chai.request(app)
            .get("/delayedFilter")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Add more test cases to cover other routes and behaviors of your application

    // After running each test, update the test status
    afterEach(function () {
        if (this.currentTest.state === "failed") {
            allTestsPassed = false;
        }
    });
});
