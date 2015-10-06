var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher');
var MemberConstants = require('../constants').MemberConstants;

var CHANGE_EVENT = 'memberChange';

//
// Local cache and WS calling functions here...
//



var MemberStore = assign({}, EventEmitter.prototype, {

  //
  // Store access functions here
  //

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
    // var text;

    switch(action.actionType) {
      case MemberConstants.MEMBER_CREATE:
        // text = action.text.trim();
        // if (text !== '') {
        //   create(text);
        //   TodoStore.emitChange();
        // }
        break;

      case MemberConstants.MEMBER_DELETE:
        //destroy(action.id);
        MemberStore.emitChange();
        break;

      // add more cases for other actionTypes
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = MemberStore;