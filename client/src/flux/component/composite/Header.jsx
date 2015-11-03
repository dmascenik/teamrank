var React = require("react");

// Components
var mui = require('material-ui');
var LoginInfo = require('../../../common').LoginInfo;

// Flux parts
var LoginStore = require('../../store').LoginStore;
var LoginAction = require('../../action').LoginActions;

// Style management
var Radium = require("radium");
var style = {
  title: { textAlign: 'left', position: 'fixed' },
  login: { color: 'white', fontWeight: '600' }
}

/**
 * This is a composite view-controller for the bar the shows up at the top of all the
 * application views. Notice that it only listens for whether the user is authenicated
 * or not.
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      onLoginPage: false
    }
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Adds listeners to the relevant stores and loads the application configuration.
   */
  componentDidMount() {
    LoginStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({ 
      isLoggedIn: LoginStore.isLoggedIn(),
      onLoginPage: LoginStore.isOnLoginPage()
    });
  }

  render() {

    // Don't render LoginInfo on login page
    var loginInfo = null;
    if (!this.state.onLoginPage) {
      var extraProps = {};
      if (LoginStore.getDisplayName()) extraProps.displayName = LoginStore.getDisplayName();
      if (LoginStore.getEmail()) extraProps.email = LoginStore.getEmail();
      if (LoginStore.getAuthProvider()) extraProps.authProvider = LoginStore.getAuthProvider();
      if (LoginStore.getAvatarUrl()) extraProps.avatarUrl = LoginStore.getAvatarUrl();    

      loginInfo = <LoginInfo onSignIn={LoginAction.onSignIn} 
                           onSignOut={LoginAction.onSignOut} 
                           isSignedIn={this.state.isLoggedIn}
                           style={style.login}
                           {...extraProps} />;
    }

    return <mui.AppBar title="TeamRank"
              style={style.title}
              showMenuIconButton={false}
              iconElementRight={loginInfo}
              zDepth={1} />;
  }

}
Header = Radium(Header);
export default Header;