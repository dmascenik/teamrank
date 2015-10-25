var React = require("react");
var mui = require('material-ui');
var Radium = require("radium");
var Config = require('../store').ConfigStore;
var Login = require('../store').LoginStore;
var ConfigAction = require('../action').ConfigActions;

var style = {
  title: {
    textAlign: 'left',
    position: 'fixed'
  }
}

class TeamRankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "unknown",
      username: "unknown"
    }
    this.onChange = this.onChange.bind(this);
    this.showAbout = this.showAbout.bind(this);
  }

  componentDidMount() {
    Config.addChangeListener(this.onChange);
    ConfigAction.loadConfig();
  }

  componentWillUnmount() {
    Config.removeChangeListener(this.onChange);
  }

  onChange() {
    if (Config.isConfigLoaded()) {
      this.setState({
        version: Config.getConfig().version
      });
    }
    if (Login.isLoggedIn()) {
      this.setState({
        // update the username
      });
    } else {
      this.setState({username: "Guest"});
    }
  }

  showAbout() {
    this.refs.about.show();
  }

  hideAbout () {
    this.refs.about.dismiss();
  }

  render() {

    // var customAction = <mui.RaisedButton
    //                 primary={true}
    //                 onTouchTap={this.hideAbout}>OK</mui.RaisedButton>

// <mui.CardMedia overlay={<mui.CardTitle title="Title" subtitle="Subtitle"/>}>
//     <img src="http://lorempixel.com/600/337/nature/"/>
//   </mui.CardMedia>

    var titleText = "TeamRank - "+this.state.username;

    return <div><mui.AppBar title={titleText}
              style={style.title}
              showMenuIconButton={false}
              iconClassNameRight="fa fa-cogs"
              onRightIconButtonTouchTap={this.showAbout}
              zDepth={1}
           /><center>
              <mui.Card 
                  style={{width: "50%", paddingTop: "70px"}}
                >
                <mui.CardTitle title="TeamRank" subtitle="Makes ranking stuff better"/>
                <mui.CardText>
                  Lorem ipsum dolor sit amet, vim ne legimus consequat, duis harum 
                  molestiae duo ut. In duo nihil latine incorrupte. Eum ut esse eius 
                  constituto, admodum mentitum no his. Utroque epicurei expetenda eu 
                  cum, at his quando volumus scriptorem, eos nisl inermis ei. In qui 
                  brute intellegat, per te quando legere.
                </mui.CardText>
              </mui.Card>
           </center>
           <mui.Dialog
              title="About TeamRank"
                // actions={[{customAction}]}
                ref="about"
                modal={false}>
                        Version: {this.state.version}
            </mui.Dialog></div>
  };

}
TeamRankApp = Radium(TeamRankApp);

export default TeamRankApp;