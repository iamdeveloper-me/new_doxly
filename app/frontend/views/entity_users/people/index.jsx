import React from 'react'
import ReactDOM from 'react-dom'
import { IndexRoute } from 'react-router';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from "./components/layout";
import Homepage from "./components/HomeView";

import Page from 'views/Page.jsx'
import People from './people/people.jsx'
import LawFirm from './people/LawFirm.js'

App.React.EntityUsersController.renderPeople = required => {
	ReactDOM.render(
		<Page>
			<Router >
				<div>
					<Route path="/entities/1000/entity_users" component={People} />
					<Route exact path="/entities" component={LawFirm} />
				</div>
				
			</Router>
		</Page>
		,
		document.getElementById('root')
	)
}
	