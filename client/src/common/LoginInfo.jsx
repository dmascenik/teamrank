var React = require("react");
var Radium = require("radium");
var GoogleSignInButton = require('./GoogleSignInButton');
var GoogleSignOutButton = require('./GoogleSignOutButton');
var mui = require('material-ui');

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

var styles = {
  container: {
    whiteSpace: "nowrap"
  },
  base: {
    display: "inline-block",
    verticalAlign: "middle",
    padding: "5px"
  }
};

class LoginInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   };
  }

  render() {
    var avatar;
    if (this.props.isSignedIn && !this.props.avatarUrl) {
      var initial = this.props.displayName.substring(0,1).toUpperCase();
      avatar = <mui.Avatar>{initial}</mui.Avatar>;
    } else if (this.props.isSignedIn && this.props.avatarUrl) {
      avatar = <mui.Avatar src={this.props.avatarUrl} />;
    }

    return <div style={styles.container}>
              <div style={[styles.base, !this.props.isSignedIn && {display: "none"}]}>
                {this.props.displayName}
              </div>
              <div style={[styles.base, !this.props.isSignedIn && {display: "none"}]}>
                {avatar}
              </div>
              <div style={[styles.base, !this.props.isSignedIn && {display: "none"}]}>
                <GoogleSignOutButton onSignOut={this.props.onSignOut} />
              </div>
              <div style={[styles.base, this.props.isSignedIn && {display: "none"}]}>
                <GoogleSignInButton width="135" height="45" onSignIn={this.props.onSignIn} />
              </div>
           </div>;
  }

}
LoginInfo = Radium(LoginInfo);
export default LoginInfo;