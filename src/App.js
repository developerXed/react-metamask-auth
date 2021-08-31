import './App.css';
import ConnectWallet from "./components/ConnectWallet"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import React from 'react';
import Deposit from './components/Deposit';
import PrivateRoute from './utils/PrivateRoute'
import 'bootstrap/dist/css/bootstrap.css';
import TradingView from './components/TradingView';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/about" >Connect</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/deposit">Deposit</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/trading-view">Trading View</Link>
                </li>
              </ul>
            </div>
          </nav>
        </nav>
        {}
        <Switch>
          <Route path="/about" component={ConnectWallet}>
          </Route>
          <PrivateRoute path="/deposit" component={Deposit} />
          <PrivateRoute path="/trading-view" component={TradingView} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
