var dispatcher = require('../dispatcher');
var constants = require('../constants').ConfigConstants;
var ws = require('../../ws');

var ConfigActions = {

  loadConfig: function() {
    ws.getConfig(pending, onSuccess, onFailed);
  }

};
module.exports = ConfigActions;

/**
 * Some "private" functions, separated for clarity above and to avoid repetition
 */

function pending() {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_PENDING
  });
}

function onSuccess(config) {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_SUCCESS,
    config: config
  });
}

function onFailed() {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_FAILED
  });
}

