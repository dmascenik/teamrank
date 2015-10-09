var assert = require('assert');

describe('RESTClient', function() {
  var RESTClient = require('../../src/ws/RESTClient.js');

  it('fails to register with a bad HTTP method', function() {
    assert.throws(function() {
      RESTClient.registerMethod('test','myUrl','FOO');
    }, /Invalid/ );
  });

  it('calls a registered web service method', function() {
    RESTClient.registerMethod('test','http://localhost:1234/test','GET');
    RESTClient.doCall('test',{},function(data,response) {});
    // should not throw an error
  });

  it('fails on a duplicate web service endpoint name', function() {
    RESTClient.registerMethod('test','http://localhost:1234/test','GET');
    assert.throws(function () {
      RESTClient.registerMethod('test','http://localhost:1234/test','GET');
    });
  });

  it('fails on an unregistered web service method', function() {
    assert.throws(function() {
      RESTClient.doCall('NOT_REGISTERED',{},function(data,response) {});
    });
  });

  /**
   * Sets up the mock before each test
   */ 
  beforeEach(function() {
    RESTClient.unregisterAll();
  });

});