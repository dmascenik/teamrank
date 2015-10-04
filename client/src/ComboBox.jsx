var React = require("react");
var Radium = require("radium");
var URL = require("url");

// HACK HACK HACK
var Client = require("node-rest-client").Client;
var client = new Client();
client.get(URL.resolve(window.location.href, "r/about"), function(data, response){
  // parsed response body as js object 
  console.log("Data: " + JSON.stringify(data));
  // raw response 
  console.log("Response: " + JSON.stringify(response));
});



var style = {
  base: {
    width: "50px", // default width if none set
    margin: "0",
    padding: "0",
    position: "relative"
  },
  dropdown: {
    width: "50px", // must match base value
    overflow: "hidden",
    position: "absolute",
    textAlign: "left",
    border: '1px solid black',
    display: 'none'
  },
  element: {
    background: "#fff",
    ':hover': {
      background: "#ddf"
    }
  }
}

class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      inputString: "",
      dropdownHidden: true,
      selection: ""
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.setSelection = this.setSelection.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
  }

  setSelection(value) {
    this.setState({selection: value});
  }

  inputChanged(event) {
    let raw = ["babbage","cabbage","baggage","bags","barge","gasbag","forage","carrier","barrier","barbell","argument","scary"];    
    let matches = [];
    var str = event.target.value;
    for (var i = 0; (str.length > 0 && i < raw.length); i++) {
      if (raw[i].indexOf(str) != -1) {
        matches.push(raw[i]);
      }
    }
    this.setState({ selection: str, inputString: str, options: matches });
  }

  activate() {
    this.setState({dropdownHidden: false});
  }

  deactivate() {
    this.setState({dropdownHidden: true});
  }

  render() {
    let textInput = <input type="text" 
                       style={[style.base, this.props.width && {width: this.props.width}]}
                       onChange={this.inputChanged} 
                       value={this.state.selection} />;
    return (
      <div 
          style={[style.base, this.props.width && {width: this.props.width}]}
          onFocus={this.activate}
          onBlur={this.deactivate}>
      {textInput}
        <ComboBoxDropdown 
            elements={this.state.options} 
            inputString={this.state.inputString} 
            width={this.props.width} 
            dropdownHidden={this.state.dropdownHidden}
            select={this.setSelection} />
      </div>
    );
  };

}
ComboBox = Radium(ComboBox);

class ComboBoxDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  select(index) {
    this.props.select(this.props.elements[index]);
  }

  render() {
    let dropdownElements = [];
    let display;
    for (var index = 0; (index < this.props.elements.length && index < 10); index++) {
      dropdownElements.push(
        <ComboBoxDropdownElement
            value={this.props.elements[index]}
            substring={this.props.inputString}
            select={this.select.bind(this, index)}
            key={index}/>
      );
    }
    if (dropdownElements.length > 0) {
      display = "block";
    }
    if (dropdownElements.length === 1 && this.props.elements[0].length === this.props.inputString.length) {
      display = "none";
    }
    if (this.props.dropdownHidden) {
      display = "none";
    }
    return (
      <div style={[style.dropdown, this.props.width && {width: this.props.width}, display && {display: display}]}>
        {dropdownElements}
      </div>
    );
  }
}
ComboBoxDropdown = Radium(ComboBoxDropdown);

class ComboBoxDropdownElement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
      let str = this.props.value;
      let substr = this.props.substring;
      let first, last = "";
      first = str.substring(0,str.indexOf(substr));
      last = str.substring(str.indexOf(substr)+substr.length);
      return (
        <div
           style={[style.element]} 
           key={this.props.key}
           onClick={this.props.select}>
          {first}<b>{substr}</b>{last}
        </div>
      );
  }
}
ComboBoxDropdownElement = Radium(ComboBoxDropdownElement);

export default ComboBox;