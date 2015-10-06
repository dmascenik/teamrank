var assert = require('assert');
var sinon = require('sinon');
var system = require('../../src/system');

var FAKE_HREF = "http://fake_host:8080/index.html";

/**
 * Note the use of a mock (Sinon) to deal with the fact that "window" is undefined
 * in the testing context.
 */
describe('TeamRankAPI', function() {
  var TeamRankAPI = require('../../src/ws/TeamRankAPI.js');
  var mockSystem;

  it('uses the system-provided base URL', function () {
    var url = TeamRankAPI.urlOf("version");
    assert(url.indexOf("fake_host")); // hostname from the mock
  });

  it('gets URL for valid key', function () {
    var url = TeamRankAPI.urlOf("version");
    assert(url.indexOf("about"));
  });

  /**
   * Using URL.resolve(...) today, but what if we change to a different
   * library? Adding a test while I'm thinking about it...
   * 
   * NOTE: I had 100% test coverage without this. Just goes to show that 100% coverage
   *       is not the same as 100% reliable.
   */
  it('does not break the URL template notation', function() {
    var url = TeamRankAPI.urlOf("member");
    assert(url.indexOf("{id}"));
  });

  /**
   * Negative tests are important, too
   */
  it('fails on an invalid endpoint key', function () {
    assert.throws(function() {
      TeamRankAPI.urlOf("__INVALID_KEY");
    }, /__INVALID_KEY/ ); // invalid keyname in the error message
  });

  /**
   * Sets up the mock before each test
   */ 
  beforeEach(function() {
    mockSystem = sinon.mock(system);
    mockSystem.expects("getWindow").once().returns({
      location:{href: FAKE_HREF}
    });
  });

  /**
   * Restores the original "getWindow" function when the test is done
   */
  afterEach(function() {
    system.getWindow.restore();
  });

});
