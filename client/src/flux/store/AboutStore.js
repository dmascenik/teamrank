var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var AboutConstants = require('../constants').AboutConstants;

var CHANGE_EVENT = 'aboutChange';

var version;
var status;

var AboutStore = assign({}, EventEmitter.prototype, {

  getVersion: function() {
    return version;
  },

  getStatus: function() {
    return status;
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
      case AboutConstants.ABOUT_PENDING:
        version = "checking...";
        status = "pending";
        AboutStore.emitChange();
        break;

      case AboutConstants.ABOUT_SUCCESS:
        version = action.version;
        status = "success";
        AboutStore.emitChange();
        break;

      case AboutConstants.ABOUT_FAILED:
        version = "FAILED";
        status = "failed";
        AboutStore.emitChange();
        break;

    }
    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = AboutStore;