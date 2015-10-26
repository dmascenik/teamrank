var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import TeamRankApp from './flux/component/TeamRankApp.jsx';

React.render(<TeamRankApp style={{width: "50%"}}/> ,  document.body);
