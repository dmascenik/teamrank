var client = require('./RESTClient');
var URL = require('url');
var system = require('../system');

/**
 * The config URL is the only REST endpoint the client needs to know. It returns
 * a configuration object that includes the list of resources the server supports
 * and all their supported REST endpoints.
 */
var configUrl = URL.resolve(system.getWindow().location.href, "r/config");

// Register the config endpoint just like any other REST endpoint.
client.registerMethod("getConfig", configUrl, "GET");

module.exports = {

  getConfig: function(pending, onSuccess, onFailure) {
    client.doCall("getConfig",{},pending,onSuccess,onFailure);
  },

  registerMethods: function(config) {
    var resources = config.resources;
    for (var resourceName in resources) {
      if (resources.hasOwnProperty(resourceName)) {
        var resource = resources[resourceName];
        for (var restMethod in resource) {
          var restMethodConfig = resource[restMethod];
          var httpMethod = restMethodConfig.method;
          var uri = restMethodConfig.URI;

          // The service URL is relative to the config URL
          var endpointUrl = URL.resolve(configUrl, uri);
          client.registerMethod(restMethod, endpointUrl, httpMethod);
        }
      }
    }
  }

}
