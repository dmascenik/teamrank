var React = require("react");
var mui = require('material-ui');
var Radium = require("radium");
var Config = require('../store').ConfigStore;
var ConfigAction = require('../action').ConfigActions;

var style = {
  title: {
    textAlign: 'left'
  }
}

class TeamRankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "unknown"
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
  }

  showAbout() {
    this.refs.about.show();
  }

  hideAbout () {
    this.refs.about.dismiss();
  }

  render() {

    var customAction = <mui.RaisedButton
                    label="OK"
                    primary={true}
                    onTouchTap={this.hideAbout} />;

// <mui.CardMedia overlay={<mui.CardTitle title="Title" subtitle="Subtitle"/>}>
//     <img src="http://lorempixel.com/600/337/nature/"/>
//   </mui.CardMedia>


    return <div><mui.AppBar title="TeamRank" 
              style={style.title}
              showMenuIconButton={false}
              iconClassNameRight="fa fa-cogs"
              onRightIconButtonTouchTap={this.showAbout}
           /><center>
              <mui.Card 
                  style={{width: "50%"}}>
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
                actions={customAction}
                ref="about"
                modal={false}>
                        Version: {this.state.version}
            </mui.Dialog></div>
  };

}
TeamRankApp = Radium(TeamRankApp);

export default TeamRankApp;