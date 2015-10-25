var React = require("react");
var mui = require('material-ui');

/**
 * This component integrates with Google Sign-In for Websites (part of the Google Identity Platform).
 * More on how this works can be found at https://developers.google.com/identity/sign-in/web/
 *
 * Using this component requires the following to be added to the <head> of your application's 
 * entry point HTML file:
 * 
 *    <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
 *    <script src="https://apis.google.com/js/platform.js"></script>
 *
 */
class GoogleSignOutButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  render() {
    return <mui.FlatButton label="Sign Out" onClick={this.signOut} />
  }

}
export default GoogleSignOutButton;