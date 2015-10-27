var React = require("react");

// Components
var ComboBox = require('../../common').ComboBox;
var LoginInfo = require('../../common').LoginInfo;
var mui = require('material-ui');
var tr = require('./composite');

// Flux parts
var Config = require('../store').ConfigStore;
var Login = require('../store').LoginStore;
var ConfigAction = require('../action').ConfigActions;
var LoginAction = require('../action').LoginActions;

var Radium = require("radium");
var style = {
  title: { textAlign: 'left', position: 'fixed' },
  login: { color: 'white', fontWeight: '600' }
}

/**
 * This is the outermost view-controller of the TeamRank web application.
 */
class TeamRankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "unknown",
      isLoggedIn: false
    }
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Adds listeners to the relevant stores and loads the application configuration.
   */
  componentDidMount() {
    Config.addChangeListener(this.onChange);
    Login.addChangeListener(this.onChange);
    ConfigAction.loadConfig();
  }

  componentWillUnmount() {
    Config.removeChangeListener(this.onChange);
    Login.removeChangeListener(this.onChange);
  }

  onChange() {
    if (Config.isConfigLoaded()) {
      this.setState({ version: Config.getConfig().version });
    }
    if (Login.isLoggedIn() != this.state.isLoggedIn) {
      this.setState({ isLoggedIn: Login.isLoggedIn() });
    }
  }

  render() {
    // A lot may break if the config hasn't loaded yet
    if (!Config.isConfigLoaded()) {
      return <div />
    }

    var extraProps = {};
    if (Login.getDisplayName()) extraProps.displayName = Login.getDisplayName();
    if (Login.getEmail()) extraProps.email = Login.getEmail();
    if (Login.getAuthProvider()) extraProps.authProvider = Login.getAuthProvider();
    if (Login.getAvatarUrl()) extraProps.avatarUrl = Login.getAvatarUrl();    

    return <div><mui.AppBar title="TeamRank"
              style={style.title}
              showMenuIconButton={false}
              iconElementRight={
                <LoginInfo onSignIn={LoginAction.onSignIn} 
                           onSignOut={LoginAction.onSignOut} 
                           isSignedIn={this.state.isLoggedIn}
                           style={style.login}
                           {...extraProps} />
              }
              zDepth={1} />
          <center>
              <mui.Card style={{width: "50%", paddingTop: "70px"}}>
                <mui.CardTitle title="TeamRank" subtitle="Makes ranking stuff better"/>
                <mui.CardText>
                  <ComboBox width="200px"/>
                  Lorem ipsum dolor sit amet, vim ne legimus consequat, duis harum 
                  molestiae duo ut. In duo nihil latine incorrupte. Eum ut esse eius 
                  constituto, admodum mentitum no his. Utroque epicurei expetenda eu 
                  cum, at his quando volumus scriptorem, eos nisl inermis ei. In qui 
                  brute intellegat, per te quando legere.
                </mui.CardText>
              </mui.Card>
          </center>
        </div>
  };

}
TeamRankApp = Radium(TeamRankApp);

export default TeamRankApp;