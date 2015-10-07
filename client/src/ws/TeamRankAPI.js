var URL = require('url');
var mirror = require('keymirror');
var system = require('../system');

/**
 * Specific endpoint URLs handled by the TeamRank REST service. These are
 * all kept in one place for easy maintenance.
 */
var endpoints = {
  version:     "r/about",
  member:      "r/member/{id}",
  memberEmail: "r/member/email",
  memberVote:  "r/member/{from}/vote/{to}"
}
var endpointKeys = mirror(endpoints);

module.exports = {

  /**
   * Provides the full URL of the service endpoint including URL template
   * placeholders.
   *
   * @param endpointKey 
   */
  urlOf: function(endpointKey) {
    if (!endpointKeys[endpointKey]) {
      throw "No endpoint for key: " + endpointKey;
    }
    return URL.resolve(system.getWindow().location.href,endpoints[endpointKey]);
  }

}
