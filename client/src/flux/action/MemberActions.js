var AppDispatcher = require('../dispatcher/AppDispatcher');
var MemberConstants = require('../constants/MemberConstants');

var MemberActions = {

  /**
   * @param  {string} name
   * @param  {email} email
   */
  create: function(name, email) {
    AppDispatcher.handleViewAction({
      actionType: MemberConstants.MEMBER_CREATE_PENDING
    });

    new Promise(function(resolve,reject) {
      // client.get(url, function(data, response) {
      // if response is a 200
      //   resolve(data);
      // else
      //   reject();
      //});
    }).then( 
      function(data) {
        AppDispatcher.handleViewAction({
          actionType: TodoConstants.MEMBER_CREATE_SUCCESS
          // more stuff...
        });
      }
    ).catch(
      function() {
        AppDispatcher.handleViewAction({
          actionType: TodoConstants.MEMBER_CREATE_FAILED
          // more stuff...
        });
      }
    );

    AppDispatcher.handleViewAction({
      actionType: TodoConstants.MEMBER_CREATE_DONE
    });
  },

};

module.exports = MemberActions;