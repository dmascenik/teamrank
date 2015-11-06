var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var c = require('../constants').LoginConstants;
var ws = require('../../ws');

var CHANGE_EVENT = 'userChange';
var user = null; // The current user
var isOnLoginPage = false;

/**
 * Contains all the information about the currently authenticated user.
 */
var LoginStore = assign({}, EventEmitter.prototype, {

  /**
   * @returns true if there is an authenticated user
   */
  isLoggedIn: function() {
    return !!user;
  },

  isOnLoginPage: function() {
    return isOnLoginPage;
  },

  getDisplayName: function() {
    return this.isLoggedIn() && user.displayName;
  },

  getEmail: function() {
    return this.isLoggedIn() && user.email;
  },

  getAuthProvider: function() {
    return this.isLoggedIn() && user.authProvider;
  },

  getAvatarUrl: function() {
    return this.isLoggedIn() && user.avatarUrl;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case c.LOGIN_SUCCESS:
        user = {
          displayName: action.displayName,
          email: action.email,
          avatarUrl: action.avatarUrl,
          authProvider: action.authProvider,
          token: action.token
        }
        console.log("Emitting login success");
        LoginStore.emitChange();
        break;

      case c.LOGOUT:
        user = null;
        console.log("Emitting logout success");
        LoginStore.emitChange();
        break;

      case c.ENTER_LOGIN:
        isOnLoginPage = true;
        console.log("Emitting enter login");
        LoginStore.emitChange();
        break;

      case c.LEAVE_LOGIN:
        isOnLoginPage = false;
        console.log("Emitting leave login");
        LoginStore.emitChange();
        break;

    }

    // needed for the promise in the dispatcher to indicate no errors
    return true;
  })

});
module.exports = LoginStore;

