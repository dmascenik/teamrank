var Client = require("node-rest-client").Client;
var api = require('./TeamRankAPI');
var client = new Client();

module.exports = {

  getConfig: function(callFirst, onSuccess, onFailure) {
    callFirst();
    var promise = new Promise(function(resolve,reject) {
      client.get(api.urlOf('config'), function(data, response) {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject();
        }
      });
    }).then(
      function(config) { onSuccess(config); }
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
