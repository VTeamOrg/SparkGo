/* global it describe */

process.env.NODE_ENV = "test";

const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app.js");
const expect = chai.expect;
const database = require("../../db/database.js"); // Import your database functions

chai.should();
chai.use(chaiHttp);

describe("Server Connection Behavior", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        // Stub the database functions
        sandbox.stub(database, "openDb").resolves({}); // Stub the openDb function
        sandbox.stub(database, "query").resolves({
            /* mock data */
        }); // Stub the query function
        sandbox.stub(database, "closeDb").resolves(); // Stub the closeDb function
    });

    after(() => {
        sandbox.restore();
    });

    it("should return a 200 status code when connecting to the server", (done) => {
        chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

 
    // Test Case 4: Test an endpoint from the "vehicles" route
    it("should return a 200 status code when accessing an endpoint from the 'vehicles' route", (done) => {
        chai.request(app)
            .get("/v1/vehicles")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 5: Test an endpoint from the "cities" route
    it("should return a 200 status code when accessing an endpoint from the 'cities' route", (done) => {
        chai.request(app)
            .get("/v1/cities")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 6: Test an endpoint from the "stations" route
    it("should return a 200 status code when accessing an endpoint from the 'stations' route", (done) => {
        chai.request(app)
            .get("/v1/stations")
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
