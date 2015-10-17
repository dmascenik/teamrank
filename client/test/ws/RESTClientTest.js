var assert = require('assert');
var sinon = require('sinon');

describe('RESTClient', function() {
  var RESTClient = require('../../src/ws/RESTClient.js');
  var sandbox;
  var wsMethodStub;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    wsMethodStub = sandbox.stub();
    sandbox.stub(RESTClient, "_getWSMethod", sandbox.stub().returns(wsMethodStub));
  });

  afterEach(function() {
    RESTClient.unregisterAll();
    sandbox.restore();
  });

  /**
   * Here are a couple examples of testing asynchronous function calls using the "done" function. 
   * Note that done() is always called last in the asynchronous callbacks used by RESTClient.doCall(...)
   */ 
  it('runs onSuccess function when status code 200 is returned', function(done) {
    wsMethodStub.yields(null, {statusCode: 200});
    var pendingSpy = sandbox.spy();
    RESTClient.doCall('test',{},
      pendingSpy,
      function() { assert(pendingSpy.calledOnce); done(); },
      function() { done(new Error("Should not have called onFailure")); }
    );
  });

  it('runs onFailure function when a non-200 status code is returned', function(done) {
    wsMethodStub.yields(null, {statusCode: 404});
    var pendingSpy = sandbox.spy();
    RESTClient.doCall('test',{},
      pendingSpy,
      function() { done(new Error("Should not have called onSuccess")); },
      function() { assert(pendingSpy.calledOnce); done(); }
    );
  });

  /**
   * Cover the branches where optional arguments are not passed
   */
  it('skips a null pending function', function(done) {
    wsMethodStub.yields(null, {statusCode: 200});
    RESTClient.doCall('test',{},
      null, // no pending function
      function() { done(); }, // still runs onSuccess
      function() { done(new Error("Should not have called onFailure")); }
    );
  });

  /**
   * Cover the branches where optional arguments are not passed
   */
  it('skips a null onFailure function', function(done) {
    wsMethodStub.yields(null, {statusCode: 404});
    var pendingSpy = sandbox.spy();
    RESTClient.doCall('test',{},
      pendingSpy,
      function() { done(new Error("Should not have called onSuccess")); },
      null
    );
    assert(pendingSpy.calledOnce);
    done();
  });

  /**
   * Negative tests are important, too! The following tests exercise the input validation code.
   */
  it('fails to register with a bad HTTP method', function() {
    assert.throws(function() {
      RESTClient.registerMethod('test','myUrl','FOO');
    }, /Unsupported/ );
  });

  it('fails on a duplicate web service endpoint name', function() {
    sandbox.restore(); // don't want mocks for this one    
    RESTClient.registerMethod('test','http://localhost:1234/test','GET');
    assert.throws(function () {
      RESTClient.registerMethod('test','http://localhost:1234/test','GET');
    });
  });

  it('fails on an unregistered web service method', function() {
    sandbox.restore(); // don't want mocks for this one    
    assert.throws(function() {
      RESTClient.doCall('NOT_REGISTERED',{},function(data,response) {});
    });
  });

});