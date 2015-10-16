var React = require("react");

import TeamRankApp from './flux/component/TeamRankApp.jsx';
//import ComboBox from './common/ComboBox.jsx';

//React.render(<ComboBox width="200px"/>,              document.getElementById("combobox"));
React.render(<TeamRankApp style={{width: "50%"}}/> ,  document.getElementById("app"));
