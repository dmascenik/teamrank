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
    this.doCall("getConfig",{},pending,onSuccess,onFailure);
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
          client.registerMethod(restMethod+resourceName, endpointUrl, httpMethod);
        }
      }
    }
  },

  /**
   * Wraps a web service call in a promise.
   *
   * @param name See RESTClient
   * @param args See RESTClient
   * @param pending (optional) No-arg function to call synchronously
   * @param onSuccess Single-arg function to call with the REST service payload
                 if a 200 status code is returned
   * @param onFailure (optional) No-arg function to call if a non-200 status code is returned
   */
  doCall: function(name, args, pending, onSuccess, onFailure) {
    if (pending) {
      pending();    
    }
    new Promise(function(resolve,reject) {
      client.doCall(name, args, function(data, response) {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject();
        }
      });
    }).then(
      function(data) {onSuccess(data); }
    ).catch(
      function() { 
        if (onFailure) {
          onFailure(); 
        }
      }
    ); 
  }

}
