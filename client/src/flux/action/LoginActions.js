var dispatcher = require('../dispatcher');
var constants = require('../constants').LoginConstants;

var LoginActions = {

  onSignIn: function(displayName, email, avatarUrl, authProvider, token) {
    dispatcher.handleViewAction({
      actionType: constants.LOGIN_SUCCESS,
      displayName: displayName,
      email: email,
      avatarUrl: avatarUrl,
      authProvider: authProvider,
      token: token
    });
  },

  onSignOut: function() {
    dispatcher.handleViewAction({
      actionType: constants.LOGOUT
    });
  },

  enterLoginPage: function() {
    dispatcher.handleViewAction({
      actionType: constants.ENTER_LOGIN
    });
  },

  leaveLoginPage: function() {
    dispatcher.handleViewAction({
      actionType: constants.LEAVE_LOGIN
    });
  }

};
module.exports = LoginActions;
