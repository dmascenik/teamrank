var dispatcher = require('../dispatcher');
var constants = require('../constants').AboutConstants;
var client = require('../../ws');

var AboutActions = {

  getVersion: function() {
    client.getVersion(
        dispatchAboutPending,
        dispatchAboutSuccess,
        dispatchAboutFailed
      );
  }

};
module.exports = AboutActions;

/**
 * Some "private" functions, separated for clarity above and to avoid repetition
 */

function dispatchAboutPending() {
  dispatcher.handleViewAction({
    actionType: constants.ABOUT_PENDING
  });
}

function dispatchAboutSuccess(version) {
  dispatcher.handleViewAction({
    actionType: constants.ABOUT_SUCCESS,
    version: version
  });
}

function dispatchAboutFailed() {
  dispatcher.handleViewAction({
    actionType: constants.ABOUT_FAILED
  });
}

