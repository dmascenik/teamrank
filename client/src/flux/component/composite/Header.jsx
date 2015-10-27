var React = require("react");
var Radium = require("radium");

var Login = require('../../store').LoginStore;

var mui = require('material-ui');

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var extraProps = {};
    if (Login.getDisplayName()) extraProps.displayName = Login.getDisplayName();
    if (Login.getEmail()) extraProps.email = Login.getEmail();
    if (Login.getAuthProvider()) extraProps.authProvider = Login.getAuthProvider();
    if (Login.getAvatarUrl()) extraProps.avatarUrl = Login.getAvatarUrl();    

    var loginInfo = <LoginInfo onSignIn={LoginAction.onSignIn} 
                           onSignOut={LoginAction.onSignOut} 
//                           isSignedIn={this.props.isSignedIn}
                           style={style.login}
                           {...extraProps} />;

    return <mui.AppBar title="TeamRank"
              style={style.title}
              showMenuIconButton={false}
              iconElementRight={loginInfo}
              zDepth={1} />;
  }

}
Header = Radium(Header);
export default Header;