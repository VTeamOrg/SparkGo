const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');

const expect = chai.expect;
chai.use(chaiHttp);

// Describe the test suite
describe('Vehicle API', () => {
  // Test the GET /vehicles endpoint
  it('should get a list of vehicles from the API', (done) => {
    chai.request('http://localhost:3000') // Replace with your API base URL
      .get('/vehicles')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        // Add more assertions based on the expected response structure

        done();
      });
  });

  // Add more tests for other API endpoints or functionalities related to vehicles
});