var React = require("react");

// Components
var mui = require('material-ui');

// Flux parts
var LoginStore = require('../../store').LoginStore;
var LoginAction = require('../../action').LoginActions;

// Style management
var Radium = require("radium");

class LoggedIn2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
                <mui.CardTitle title="PAGE TWO" />
                <mui.CardText>
                  Lorem ipsum dolor sit amet, vim ne legimus consequat, duis harum 
                  molestiae duo ut. In duo nihil latine incorrupte. Eum ut esse eius 
                  constituto, admodum mentitum no his. Utroque epicurei expetenda eu 
                  cum, at his quando volumus scriptorem, eos nisl inermis ei. In qui 
                  brute intellegat, per te quando legere.
                </mui.CardText>
           </div>
  }

}
LoggedIn2 = Radium(LoggedIn2);
export default LoggedIn2;