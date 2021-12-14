import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';

import AnalysisPage from './pages/AnalysisPage';
import TrendsPage from './pages/TrendsPage';
import RecsPage from './pages/RecsPage';


import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import MatchesPage from './pages/MatchesPage';


ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
		<Route exact
							path="/analysis"
							render={() => (
								<AnalysisPage />
							)}/>
		<Route exact
							path="/trends"
							render={() => (
								<TrendsPage />
							)} />
		<Route exact
							path="/recs"
							render={() => (
								<RecsPage />
							)} />
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

