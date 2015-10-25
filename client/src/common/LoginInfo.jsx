var React = require("react");
var Radium = require("radium");
var GoogleSignInButton = require('./GoogleSignInButton');
var mui = require('material-ui');

class LoginInfo extends React.Component {
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
    return <div style={{whiteSpace: "nowrap"}}>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><mui.Avatar>A</mui.Avatar></div>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><GoogleSignInButton /></div>
              <div style={{display: "inline-block", verticalAlign: "middle"}}><mui.FlatButton label="Sign Out" onClick={this.signOut} /></div>
           </div>;
  }

}
LoginInfo = Radium(LoginInfo);
export default LoginInfo;