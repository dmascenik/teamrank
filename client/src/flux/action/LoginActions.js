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

  /**
   * The Google sign-in button (and maybe others) expect to render one and only
   * one button on the page. Therefore, when entering the login page, we need
   * to update the view state to turn off the login widget in the header bar.
   */
  enterLoginPage: function() {
    dispatcher.handleViewAction({
      actionType: constants.ENTER_LOGIN
    });
  },

  /**
   * Reactivate the login widget in the header bar when leaving the login page.
   */
  leaveLoginPage: function() {
    dispatcher.handleViewAction({
      actionType: constants.LEAVE_LOGIN
    });
  }

};
module.exports = LoginActions;
