var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var cc = require('../constants').ConfigConstants;

var CHANGE_EVENT = 'configChange';
var config = null; // The configuration object loaded from the server
var isLoaded = false;

/**
 * This store contains all the configuration information provided by the server. It is expected to
 * be loaded once when the app is loaded. The structure of the config object should allow the app
 * to discover what capabilities the server provides, allowing for some amount of version skew 
 * between the client and the server. While this may not be relevant to a web client, being served
 * from the same server as the backend service, it is very useful for mobile clients that need to
 * support some degree of forward- and backward-compatibility.
 */
var ConfigStore = assign({}, EventEmitter.prototype, {

  /**
   * @returns the configuration object from the server
   */
  getConfig: function() {
    return config;
  },

  /**
   * @returns true if the configuration object was loaded, false if not or if loading failed
   */
  isConfigLoaded: function() {
    return isLoaded;
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
      case cc.CONFIG_PENDING:
        ConfigStore.emitChange();
        break;

      case cc.CONFIG_SUCCESS:
        config = action.config;
        isLoaded = true;
        ConfigStore.emitChange();
        break;

      case cc.CONFIG_FAILED:
        config = null;
        isLoaded = false;
        ConfigStore.emitChange();
        break;
    }

    // needed for the promise in the dispatcher to indicate no errors
    return true;
  })

});
module.exports = ConfigStore;