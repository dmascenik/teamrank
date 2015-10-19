var React = require("react");
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import TeamRankApp from './flux/component/TeamRankApp.jsx';
//import ComboBox from './common/ComboBox.jsx';

//React.render(<ComboBox width="200px"/>,              document.getElementById("combobox"));
React.render(<TeamRankApp style={{width: "50%"}}/> ,  document.body);
