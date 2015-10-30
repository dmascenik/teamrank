var React = require("react");

import { Link } from 'react-router';

// Components
var mui = require('material-ui');

// Flux parts
var LoginStore = require('../../store').LoginStore;
var LoginAction = require('../../action').LoginActions;

// Style management
var Radium = require("radium");

class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
                <mui.CardTitle title="This is the splash page" />
                <mui.CardText>
                  Lorem ipsum dolor sit amet, vim ne legimus consequat, duis harum 
                  molestiae duo ut. In duo nihil latine incorrupte. Eum ut esse eius 
                  constituto, admodum mentitum no his. Utroque epicurei expetenda eu 
                  cum, at his quando volumus scriptorem, eos nisl inermis ei. In qui 
                  brute intellegat, per te quando legere.
                  <br/><br/>
                  <Link to="/one">PAGE ONE</Link>
                </mui.CardText>
           </div>
  }

}
Splash = Radium(Splash);
export default Splash;