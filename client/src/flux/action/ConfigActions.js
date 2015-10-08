var dispatcher = require('../dispatcher');
var constants = require('../constants').ConfigConstants;
var client = require('../../ws');

var ConfigActions = {

  getConfig: function() {
    client.getConfig(
        dispatchConfigPending,
        dispatchConfigSuccess,
        dispatchConfigFailed
      );
  }

};
module.exports = ConfigActions;

/**
 * Some "private" functions, separated for clarity above and to avoid repetition
 */

function dispatchConfigPending() {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_PENDING
  });
}

function dispatchConfigSuccess(config) {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_SUCCESS,
    config: config
  });
}

function dispatchConfigFailed() {
  dispatcher.handleViewAction({
    actionType: constants.CONFIG_FAILED
  });
}

