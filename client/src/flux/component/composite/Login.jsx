var React = require("react");

// Components
var mui = require('material-ui');
var GoogleSignInButton = require('../../../common/GoogleSignInButton.jsx');

var LoginActions = require('../../action/LoginActions');

// Style management
var Radium = require("radium");

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    LoginActions.enterLoginPage();
  }

  componentWillUnmount() {
    LoginActions.leaveLoginPage();
  }

  render() {
    return <div>
                <mui.CardTitle title="Please Log In" />
                <GoogleSignInButton
                  onSignIn={LoginActions.onSignIn}
                  onSignOut={LoginActions.onSignOut}
                  width={200}
                  height={50}
                  theme="dark"
                />
           </div>
  }

}
Login = Radium(Login);
export default Login;