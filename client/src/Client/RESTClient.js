var Client = require("node-rest-client").Client;
var URL = require("url");

var client = new Client();

module.exports = {

  getVersion: function() {
    client.get(URL.resolve(window.location.href, "r/about"), function(data, response) {
      console.log("Data:" + JSON.stringify(data));
    });
  }

}
