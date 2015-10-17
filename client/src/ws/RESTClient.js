var Client = require("node-rest-client").Client;
var keymirror = require("keymirror");
var client = new Client();

var validMethods = keymirror({
  GET: null,
  POST: null,
  DELETE: null
});

/**
 * This is a simple wrapper around a raw REST client providing some basic validation, and
 * making it easier to mock the service in tests. It also wraps each call in a promise
 * for asynchronous handling.
 */
module.exports = {

  /**
   * Registers a web service method to be called later.
   *
   * @param name The name of the method
   * @param url The service endpoint URL - e.g. http://localhost:8080/user/${id}
   * @param method The HTTP method - e.g. GET, POST, etc.
   */
  registerMethod: function(name, url, method) {
    if (!validMethods[method]) {
      throw "Unsupported HTTP method ("+method+") when registering web service endpoint";
    }
    if (this._getWSMethod(name)) {
      throw "REST endpoint already registered for name: "+name;
    }
    client.registerMethod(name, url, method);
  },

  /**
   * Makes an asynchronous web service call via a promise.
   *
   * @param name The registered name of the method
   * @param args See documentation at https://www.npmjs.com/package/node-rest-client
   * @param pending (optional) No-arg function to call synchronously
   * @param onSuccess Single-arg function to call with the REST service payload
                 if a 200 status code is returned
   * @param onFailure (optional) No-arg function to call if a non-200 status code is returned
   */
  doCall: function(name, args, pending, onSuccess, onFailure) {
    var wsMethod = this._getWSMethod(name);
    if (!wsMethod) {
      throw "Web service method is not registered: "+name;
    }
    if (pending) {
      pending();    
    }
    new Promise(function(resolve,reject) {
      wsMethod(args, function(data, response) {
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
  },

  /**
   * Clears all the registered methods.
   */
  unregisterAll: function() {
    client.methods = {};
  },

  /**
   * Exposing this as a separate function enables mock-injection when unit testing.
   */
  _getWSMethod: function(name) {
    return client.methods[name];
  }

}