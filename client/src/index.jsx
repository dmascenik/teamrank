var React = require("react");

import FillerText from './FillerText.jsx';
import ComboBox from './ComboBox.jsx';

React.render(<ComboBox width="200px" />,            document.getElementById("content"));
React.render(<FillerText style={{width: "50%"}}/>,	document.getElementById("filler"));
