import React from 'react'
import ReactDOM from 'react-dom'
import { IndexRoute } from 'react-router';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Page from 'views/Page.jsx'
import People from './people/people.jsx'
import LawFirm from './people/LawFirm.js'
import userDetails from 'components/TeamMember/Team/userDetails.js'

App.React.EntityUsersController.renderPeople = required => {
	ReactDOM.render(
		<Page>
			<Router >
				<div>
					<Route exact path="/entities/1000/entity_users" component={People} />
					<Route exact path="/entities/:entity_id/entity_users/:id" component={userDetails} />
					<Route exact path="/entities" component={LawFirm} />
				</div>
				
			</Router>
		</Page>
		,
		document.getElementById('root')
	)
}
	