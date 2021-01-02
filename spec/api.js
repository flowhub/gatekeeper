
const server = require('../server');

const chai = require('chai');
const nock = require('nock');

//const fetch = require('node-fetch');

const startServer = (port) => {
  return new Promise((resolve, reject) => {
    app = server.app;
    app.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(app);
      }
    });
  })
}

// TODO: implement mocking of Github API
// https://github.com/prose/gatekeeper/blob/development/tests/server.test.js
// has some tests now. Using nock, supertest, tape
// nock is fine, can reuse those.
// Want to keep mocha and chai for the rest

describe('OAuth token exchange', () => {
  var port = 3335
  var server = null

  before(() =>
    startServer(port).then((app) => {
      server = app
    })
  )
  after(() => {
    return Promise.resolve(null);
  })

  describe('unknown client', () => {

    it('should fail', (done) => {
        chai.expect(null).to.equal(1);
        return done(null)
    })
  })

  /*     it 'invalid OAuth code should fail', (done) ->

 */
})



