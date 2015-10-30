import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import { LoginStore } from './flux/store';

var TeamRankApp = require('./flux/component/TeamRankApp.jsx');
var Splash = require('./flux/component/composite/Splash.jsx');
var LoggedIn1 = require('./flux/component/composite/LoggedIn1.jsx');
var injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();
// ReactDOM.render(<TeamRankApp /> ,  document.getElementById("app"));

function requireAuth(nextState, replaceState) {
  if (!LoginStore.isLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/');
  }
}

ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route path="/" component={TeamRankApp}>
      <IndexRoute component={Splash}/>
      <Route path="one" component={LoggedIn1} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById("app"));