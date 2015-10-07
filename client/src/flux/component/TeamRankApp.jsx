var React = require("react");
var Radium = require("radium");
var AboutStore = require('../store').AboutStore;
var AboutAction = require('../action').AboutActions;

var style = {
  base: {
    textAlign: 'left'
  }
}

class TeamRankApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "unknown"
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    AboutStore.addChangeListener(this.onChange);
    AboutAction.getVersion();
  }

  componentWillUnmount() {
    AboutStore.removeChangeListener(this.onChange);
  }

  onChange() {
    console.log("Change event received: version="+AboutStore.getVersion());
    this.setState({
      version: AboutStore.getVersion()
    });
  }

  render() {
    return <div style={[style.base, this.props.style]}>
      <span>
      Version: {this.state.version}
      <br/><br/>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sit amet orci ullamcorper 
      nunc consectetur eleifend. Sed dictum non tortor vel sagittis. Mauris venenatis congue nunc. 
      Integer ac tellus vitae urna mattis iaculis vehicula vel risus. Pellentesque non faucibus velit, 
      vel volutpat justo. Nulla sagittis molestie dolor, eget tincidunt metus ullamcorper finibus. 
      Suspendisse imperdiet mollis rutrum.
      <br/><br/>
      Duis dignissim dui id risus egestas semper. Integer finibus ultrices risus quis malesuada. Donec 
      vitae quam vulputate arcu cursus egestas vitae sit amet nibh. Pellentesque quis sapien dignissim, 
      lobortis dui vitae, varius neque. Duis auctor purus sit amet sapien ultricies, ut semper nunc 
      mattis. Nam mi nulla, dictum in nunc non, dignissim tristique lacus. In id tortor nisi. Aenean 
      maximus dapibus sem. Nam molestie, metus id feugiat tempor, ante neque suscipit orci, vel 
      venenatis odio enim eu magna. Nunc volutpat auctor lectus, eget pharetra ante ultricies nec. Nunc 
      porta faucibus dolor at interdum. Mauris fermentum, est convallis finibus fermentum, mi orci 
      faucibus lacus, vitae rutrum leo lectus nec velit. Phasellus eget pretium dolor. Integer cursus, 
      orci at scelerisque mattis, tellus eros venenatis mauris, ut consectetur nulla quam et purus.
      <br/><br/>
      Nam at fermentum ipsum, in hendrerit ex. Nulla facilisi. Morbi a tincidunt lacus. Aenean volutpat 
      aliquam metus vel vehicula. Maecenas lobortis tempus magna quis iaculis. Nulla facilisi. Vivamus 
      risus ipsum, tristique in urna vel, semper tempor dui. Sed vitae metus volutpat mi rutrum ornare. 
      Nunc venenatis quis mauris nec dignissim. Vestibulum ante ipsum primis in faucibus orci luctus et 
      ultrices posuere cubilia Curae;
      <br/><br/>
      Sed libero arcu, viverra id tincidunt eget, auctor sit amet eros. Ut libero nibh, pretium sit 
      amet gravida ac, ullamcorper at lacus. Sed id sollicitudin turpis. Maecenas aliquet metus et 
      semper aliquet. Mauris et elit elit. Fusce ac ornare augue, facilisis malesuada est. Ut consequat, 
      ipsum vel mattis vulputate, tellus elit placerat diam, quis lobortis sem tellus eu lacus. 
      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent 
      sit amet urna egestas, ultricies felis eget, gravida mi. Nulla purus diam, maximus ac magna et, 
      feugiat finibus sapien. Maecenas vitae euismod elit. Pellentesque rutrum nisi lacus, et ornare arcu 
      mollis non. Etiam mollis massa at sapien cursus, at sagittis urna lobortis.
      </span>
    </div>
  };

}
TeamRankApp = Radium(TeamRankApp);

export default TeamRankApp;