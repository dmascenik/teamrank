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
 * making it easier to mock the service in tests.
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
      throw "Invalid HTTP method ("+method+") when registering web service endpoint";
    }
    if (client.methods[name]) {
      throw "REST endpoint already registered for name: "+name;
    }
    client.registerMethod(name, url, method);
  },

  /**
   * Calls the named web service with the specified args.
   * 
   * @param name The name of the method
   * @param args See documentation at https://www.npmjs.com/package/node-rest-client
   * @param onResponse A function that takes two arguments - the first is populated with
   *             the response payload, the second with the entire raw response.
   */
  doCall: function(name, args, onResponse) {
    if (!client.methods[name]) {
      throw "Web service method is not registered: "+name;
    }
    client.methods[name](args,onResponse); 
  },

  unregisterAll: function() {
    client.methods = {};
  }

}