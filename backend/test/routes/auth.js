const chai = require("chai");
const sinon = require("sinon");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../../app.js'); // Import your Express app
const tokenModel = require("../../models/tokenModel.js");
const userModel = require("../../models/userModel.js");

describe("Admin Access Tests", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
        // Mock the token and user model functions
        sandbox.stub(tokenModel, 'validateAuthTokenAndUserId').callsFake((token, userId) => {
            return Promise.resolve(token === "validToken" && userId === "adminUserId");
        });
        sandbox.stub(userModel, 'getUserById').callsFake((userId) => {
            if (userId === "adminUserId") {
                return Promise.resolve({ role: 'admin' });
            }
            return Promise.resolve({ role: 'user' });
        });
    });

    after(() => {
        sandbox.restore();
    });

    // Test Case: Access as Non-Admin
    it("should deny access to a non-admin user on the /users route", (done) => {
        chai.request(app)
            .get("/v1/users")
            .set('Cookie', ['userId=regularUserId', 'authToken=validToken']) // Mocking non-admin user cookies
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });
});