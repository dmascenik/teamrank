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
class LoginInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {   };
  }

  render() {   
    console.log("isSignedIn: "+this.props.isSignedIn());
    return <div style={{whiteSpace: "nowrap"}}>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><mui.Avatar>A</mui.Avatar></div>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><GoogleSignInButton width="135" height="45" onSignIn={this.props.onSignIn} /></div>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><GoogleSignOutButton onSignOut={this.props.onSignOut} /></div>
           </div>;
  }

}
LoginInfo = Radium(LoginInfo);
export default LoginInfo;