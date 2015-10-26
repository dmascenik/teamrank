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

  /**
   * Note that the onSuccess callback needs to be registered when the component is mounted.
   */
  componentDidMount() {
    gapi.signin2.render('g-signin2', {
        'scope': 'profile email',
        'width': this.props.width,
        'height': this.props.height,
        'longtitle': false,
        'theme': this.props.theme,
        'onsuccess': this.onSignIn
      });
  }

  /**
   * Calls the onSignIn function prop. In a Flux-based architecture, this would be some
   * action creator function.
   */
  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    this.props.onSignIn(
      profile.getName(), 
      profile.getEmail(), 
      profile.getImageUrl(), 
      "google", 
      googleUser.getAuthResponse().id_token
    );
  }

  /**
   * Injects a div with the ID expected by the Google API.
   */
  render() {
    return <div id="g-signin2" data-onsuccess={this.onSignIn} />
  }

}
GoogleSignInButton.propTypes = {
  onSignIn:     React.PropTypes.func.isRequired,
  width:        React.PropTypes.number,
  height:       React.PropTypes.number,
  theme:        React.PropTypes.string
};
GoogleSignInButton.defaultProps = {
  theme:        "dark"
};
export default GoogleSignInButton;