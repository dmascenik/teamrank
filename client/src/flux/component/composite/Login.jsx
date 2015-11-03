var React = require("react");

// Components
var mui = require('material-ui');
var GoogleSignInButton = require('../../../common/GoogleSignInButton.jsx');

var LoginActions = require('../../action/LoginActions');
var LoginStore = require('../../store/LoginStore');

// Style management
var Radium = require("radium");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // need this to trigger rendering of the Google sign-in button
      onLoginPage: false
    };
    this.onChange = this.onChange.bind(this);
  }

  /**
   * The router triggers enterLoginPage() when it redirects here, but if the
   * user clicks refresh, we need to trigger here.
   */
  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
    LoginActions.enterLoginPage();
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ onLoginPage: LoginStore.isOnLoginPage() });
  }

  render() {
    console.log("Rendering - onLoginPage: "+this.state.onLoginPage);
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