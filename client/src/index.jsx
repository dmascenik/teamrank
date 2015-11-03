import React from 'react';
import ReactDOM from 'react-dom';

/*
 * Routing configuration makes single-page apps behave like multi-page apps in
 * a browser by mapping URLs to view components. This allows users to navigate 
 * the app using the browser's forward and back buttons, and also to bookmark
 * a specific location in the app.
 */
import { Router, IndexRoute, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Routing often needs to know if the user is authenticated
import { LoginStore } from './flux/store';
import { LoginActions } from './flux/action';

// The core view-controller of the application
import TeamRankApp from './flux/component/TeamRankApp.jsx';

/*
 * All other view-controllers configured in the router. The router determines
 * which of these will be displayed as a child of the primary view-controller.
 */
import Splash from './flux/component/composite/Splash.jsx';
import Login from './flux/component/composite/Login.jsx';
import LoggedIn1 from './flux/component/composite/LoggedIn1.jsx';

// Makes tap events work in Material UI for React pre-1.0
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/**
 * Redirect the user to the login page if a route requires authentication. The
 * originally requested URL is stored in location.state.nextPathname.
 */
function requireAuth(nextState, replaceState) {
  if (!LoginStore.isLoggedIn()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

function enterLoginPage() {
  LoginActions.enterLoginPage();
}

function leaveLoginPage() {
  LoginActions.leaveLoginPage();
}

/***************************************************************************
 *
 * APPLICATION ROUTE CONFIGURATION
 * 
 * Note the use of createBrowserHistory(). This prevents the use of #'s in 
 * the URL, but is not compatible with older versions of IE.
 *
 * Also note that the server must be configured to serve our index.html
 * from any URL configured below in case the user hits the refresh button.
 *
 **************************************************************************/
ReactDOM.render((
  <Router history={createBrowserHistory()}>
    <Route path="/" component={TeamRankApp}>
      <IndexRoute component={Splash}/>
      <Route path="login" component={Login} onEnter={enterLoginPage} onLeave={leaveLoginPage} />
      <Route path="one" component={LoggedIn1} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById("app")); // <-- See index.html