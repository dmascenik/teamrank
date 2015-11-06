/**
 * History is used for routing between views. It's externalized from
 * index.jsx so it can be accessible from Login.jsx for redirecting
 * following a successful login.
 */
import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();
export default history;