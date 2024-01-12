// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../../app.js');
// const expect = chai.expect;

// chai.use(chaiHttp);

// describe('API Rate Limiting', () => {
//     it('should enforce rate limits on the "/v1/users" endpoint', async function () {
//         this.timeout(30000); // Set timeout to 10 seconds, adjust as needed
//         const requestsCount = 1001; // Assuming limit is 100 requests per 15 minutes
//         let lastResponse;

//         for (let i = 0; i < requestsCount; i++) {
//             try {
//                 lastResponse = await chai.request(app).get('/v1/users');
//             } catch (err) {
//                 lastResponse = err.response;
//             }
//         }

//         expect(lastResponse).to.have.status(429);
//         expect(lastResponse.text).to.equal("Too many requests from this IP, please try again after 15 minutes");
//     });
// });