var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var c = require('../constants').LoginConstants;
var ws = require('../../ws');

var CHANGE_EVENT = 'userChange';
var user = null; // The current user

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
      case c.LOGIN_PENDING:
        LoginStore.emitChange();
        break;

      case c.LOGIN_SUCCESS:
        user = action.user;
        LoginStore.emitChange();
        break;

      case c.LOGIN_FAILED:
        LoginStore.emitChange();
        break;

      case c.LOGOUT:
        user = null;
        LoginStore.emitChange();
        break;

    }

    // needed for the promise in the dispatcher to indicate no errors
    return true;
  })

});
module.exports = LoginStore;

