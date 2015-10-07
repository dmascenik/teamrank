var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var AboutConstants = require('../constants').AboutConstants;

var CHANGE_EVENT = 'aboutChange';

var version;

var AboutStore = assign({}, EventEmitter.prototype, {

  getVersion: function() {
    return version;
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
        AboutStore.emitChange();
        break;

      case AboutConstants.ABOUT_SUCCESS:
        version = action.version;
        AboutStore.emitChange();
        break;

      case AboutConstants.ABOUT_FAILED:
        version = "FAILED";
        AboutStore.emitChange();
        break;

    }
    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = AboutStore;