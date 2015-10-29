var React = require("react");

// Components
var ComboBox = require('../../common').ComboBox;
var mui = require('material-ui');
var tr = require('./composite');

// Flux parts
var Config = require('../store').ConfigStore;
var ConfigAction = require('../action').ConfigActions;

var Radium = require("radium");

/**
 * This is the outermost view-controller of the TeamRank web application.
 */
class TeamRankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "unknown"
    }
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Adds listeners to the relevant stores and loads the application configuration.
   */
  componentDidMount() {
    Config.addChangeListener(this.onChange);
    ConfigAction.loadConfig();
  }

  componentWillUnmount() {
    Config.removeChangeListener(this.onChange);
  }

  onChange() {
    if (Config.isConfigLoaded()) {
      this.setState({ version: Config.getConfig().version });
    }
  }

  render() {
    // A lot may break if the config hasn't loaded yet
    if (!Config.isConfigLoaded()) {
      return <div />
    }

    return <div><tr.Header />
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