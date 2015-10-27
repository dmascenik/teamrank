var React = require("react");
var ReactDOM = require("react-dom");

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import TeamRankApp from './flux/component/TeamRankApp.jsx';

ReactDOM.render(<TeamRankApp style={{width: "50%"}}/> ,  document.getElementById("app"));
