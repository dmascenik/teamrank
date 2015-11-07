var React = require("react");

// Components
var mui = require('material-ui');
var GoogleSignInButton = require('../../../common/GoogleSignInButton.jsx');

var LoginActions = require('../../action/LoginActions');
var LoginStore = require('../../store/LoginStore');
var history = require('../../../history.js');

// Style management
var Radium = require("radium");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onLoginPage: LoginStore.isOnLoginPage(),
      hideButton: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  /**
   * The router triggers enterLoginPage() when it redirects here, but if the
   * user clicks refresh, we need to trigger manually.
   */
  componentWillMount() {
    LoginActions.enterLoginPage();
  }

  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ onLoginPage: LoginStore.isOnLoginPage() });
  }

  /**
   * Dispatches the login action and redirects the user to the URL originally
   * requested.
   */
  onSignIn(name, email, imageUrl, authProvider, token) {

    // Trigger a re-render that hides the sign-in button(s) immediately so that
    // the Header can render it
    this.setState({ hideButton: true });

    // Dispatch the sign-in actoin
    LoginActions.onSignIn(name,email,imageUrl,authProvider,token);

    // Dispatch that we're leavin the login page
    LoginActions.leaveLoginPage();

    // Redirect to the original URL, or / if none is known
    const { location } = this.props
    if (location.state && location.state.nextPathname) {
      history.replaceState(null, location.state.nextPathname)
    } else {
      history.replaceState(null, '/')
    }
  }

  render() {
    var googleSignInButton = null;
    if (this.state.onLoginPage && !this.state.hideButton) {
      googleSignInButton = <GoogleSignInButton
                  onSignIn={this.onSignIn}
                  onSignOut={LoginActions.onSignOut}
                  width={200}
                  height={50}
                  theme="dark" />
    }

    return <div>
              <mui.CardTitle title="Please Log In" />
              {googleSignInButton}
           </div>
  }

}
Login = Radium(Login);
export default Login;