var client = require('./RESTClient');
var api = require('./TeamRankAPI');

client.registerMethod("getConfig", api.urlOf('config'), "GET");

module.exports = {

  getConfig: function(pending, onSuccess, onFailure) {
    doCall("getConfig",{},pending,onSuccess,onFailure);
  }

}


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
function doCall(name, args, pending, onSuccess, onFailure) {
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

