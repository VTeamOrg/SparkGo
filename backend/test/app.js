/* global it describe */

process.env.NODE_ENV = "test";

const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../backend/app.js");
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe("Server Connection Behavior", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    after(() => {
        sandbox.restore();
    });

    it("should return a 200 status code when connecting to the server", (done) => {
        // Mock the database call or any other relevant setup

        chai.request(app)
            .get("/")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 3: Test a GET request to an endpoint from the "users" route
    it("should handle a GET request and return a 200 status code for an endpoint from the 'users' route", (done) => {
        chai.request(app)
            .get("/users")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 4: Test an endpoint from the "vehicles" route
    it("should return a 200 status code when accessing an endpoint from the 'vehicles' route", (done) => {
        chai.request(app)
            .get("/vehicles")
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test Case 5: Test an endpoint from the "cities" route
    it("should return a 200 status code when accessing an endpoint from the 'cities' route", (done) => {
        chai.request(app)
            .get("/cities")
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

    // Add more test cases to cover other routes and behaviors of your application

    // After running each test, update the test status
    afterEach(function () {
        if (this.currentTest.state === "failed") {
            allTestsPassed = false;
        }
    });
});
