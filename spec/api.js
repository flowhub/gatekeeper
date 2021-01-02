
const server = require('../server');
const config = require('../config.json');

const chai = require('chai');
const nock = require('nock');

const fetch = require('node-fetch');

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

const mockGithubAccessTokenValid = (client, returnToken='mockedToke') => {

  const clientConfig = config.clients[client];

  const host = config.oauth_host;
  const mockUrl = `https://${host}`;

  return nock(mockUrl)
    .post(config.oauth_path, () => true)
    .reply(200, {
        access_token: returnToken,
        token_type: 'bearer',
    });
}


describe('OAuth token exchange', () => {
  var port = 3335
  var server = null

  const authenticateApi = "http://localhost:"+port+'/authenticate';

  before(() =>
    startServer(port).then((app) => {
      server = app
    })
  )
  after(() => {
    return Promise.resolve(null);
  })

  afterEach(() => {
    nock.cleanAll();
  });

  describe('unknown client', () => {
    it('should give 404', () => {
        const code = 'irrelevant';
        return fetch(authenticateApi+'/unknown_client/'+code).then((res) => {
            chai.expect(res.status).to.equal(404);
        })
    })
  })

  // No mocking, hits real Github API
  describe('valid client with invalid code', () => {
    it('should give 402', () => {
        const code = 'invalid';
        return fetch(authenticateApi+'/default/'+code).then((res) => {
            chai.expect(res.status).to.equal(402);
        })
    })
  })

  describe('valid client with valid code', () => {
    var mock = null;
    before(() => {
      mock = mockGithubAccessTokenValid('default', 'returnedToken');
    })

    it('should give 200', () => {
        const code = 'valid';
        return fetch(authenticateApi+'/default/'+code).then((res) => {
            chai.expect(res.status).to.equal(200);
            chai.expect(mock.isDone()).to.be.true;
            return res;
        })
        .then(res => res.json())
        .then(json => {
            chai.expect(json.token).to.be.a('string');
            chai.expect(json.token).to.equal('returnedToken');
        })
    })
  })


})
