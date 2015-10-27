var React = require("react");
var GoogleSignInButton = require('./GoogleSignInButton');
var mui = require('material-ui');

var Radium = require("radium");
var styles = {
    container: { whiteSpace: "nowrap" },
    base:      { display: "inline-block", verticalAlign: "middle", padding: "5px" }
};

/**
 * This is a composite component that renders the sign-in, sign-out, and current user information.
 * It requires the following props:
 * 
 * isSignedIn - a boolean indicating whether the user is signed in
 *
 * onSignIn - called following successful authentication with the following args:
 *            1) User's display name
 *            2) User's email address
 *            3) User's avatar URL
 *            4) The authentication provider; e.g. "google", "linkedin", etc.
 *            5) An authentication token
 *
 * onSignOut - called after the user signs out
 * 
 * The following props must be provided if the user is signed in:
 *
 * displayName - the user's display name
 *
 * email - the user's email address
 *
 * authProvider - The authentication provider; e.g. "google", "linkedin", etc.
 *
 * avatarUrl (optional) - a URL for the user's avatar image. If none is provided, a "letter avatar" based
 *                        on the user's display name will be used.
 */
class LoginInfo extends React.Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  /**
   * Calls an auth-specific signOut function, then the provided callback
   */
  signOut() {
    if (this.props.authProvider === "google") {
      GoogleSignInButton.signOut();
    }
    this.props.onSignOut();
  }

  render() {
    //
    // Some conditional validation of the properties
    //
    if (this.props.isSignedIn) {
      if (!this.props.displayName) throw "LoginInfo requires displayName when isSignedIn=true";
      if (!this.props.email) throw "LoginInfo requires email when isSignedIn=true";
      if (!this.props.authProvider) throw "LoginInfo requires authProvider when isSignedIn=true";
    }

    //
    // Swap a "letter avatar" if no avatarUrl is provided
    //
    var avatar;
    if (this.props.isSignedIn && !this.props.avatarUrl) {
      var initial = this.props.displayName.substring(0,1).toUpperCase();
      avatar = <mui.Avatar>{initial}</mui.Avatar>;
    } else if (this.props.isSignedIn && this.props.avatarUrl) {
      avatar = <mui.Avatar src={this.props.avatarUrl} />;
    }

    return <div style={styles.container}>
              <div style={[this.props.style && this.props.style, styles.base, !this.props.isSignedIn && {display: "none"}]}>
                {this.props.displayName}
              </div>
              <div style={[styles.base, !this.props.isSignedIn && {display: "none"}]}>
                {avatar}
              </div>
              <div style={[styles.base, !this.props.isSignedIn && {display: "none"}]}>
                <mui.FlatButton label="Sign Out" onClick={this.signOut} />
              </div>
              <div style={[styles.base, this.props.isSignedIn && {display: "none"}]}>
                <GoogleSignInButton 
                  width={135} height={45} 
                  onSignIn={this.props.onSignIn}
                  onSignOut={this.props.onSignOut} />
              </div>
           </div>;
  }

}
LoginInfo.propTypes = {
  isSignedIn:   React.PropTypes.bool.isRequired,
  onSignIn:     React.PropTypes.func.isRequired,
  onSignOut:    React.PropTypes.func.isRequired,
  displayName:  React.PropTypes.string,
  email:        React.PropTypes.string,
  authProvider: React.PropTypes.string,
  avatarUrl:    React.PropTypes.string,
  style:        React.PropTypes.object
};
LoginInfo = Radium(LoginInfo);
export default LoginInfo;