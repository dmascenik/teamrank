var React = require("react");

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
class GoogleSignInButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   };
    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    gapi.signin2.render('g-signin2', {
        'scope': 'profile email',
        'width': 200,
        'height': 64,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onSignIn
      });
  }

  onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
  }

  render() {
    return <div id="g-signin2" data-onsuccess={this.onSignIn} />
  }

}
export default GoogleSignInButton;