var Client = require("node-rest-client").Client;
var api = require('./TeamRankAPI');
var client = new Client();

module.exports = {

  getVersion: function(callFirst, onSuccess, onFailure) {
    callFirst();
    var promise = new Promise(function(resolve,reject) {
      client.get(api.urlOf('version'), function(data, response) {
        if (response.statusCode === 200) {
          resolve(data.version);
        } else {
          reject();
        }
      });
    }).then(
      function(version) { onSuccess(version); }
    ).catch(
      function() { onFailure(); }
    );
  }

}

function doCall() {
  new Promise(function(resolve,reject) {

  }).then(

  ).catch(

  );
}
