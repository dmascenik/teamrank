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
    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    gapi.signin2.render('g-signin2', {
        'scope': 'profile email',
        'width': this.props.width,
        'height': this.props.height,
        'longtitle': false,
        'theme': 'dark',
        'onsuccess': this.onSignIn
      });
  }

  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    this.props.onSignIn(profile.getName(), profile.getEmail(), profile.getImageUrl(), "google", googleUser.getAuthResponse().id_token);
  }

  render() {
    return <div id="g-signin2" data-onsuccess={this.onSignIn} />
  }

}
export default GoogleSignInButton;