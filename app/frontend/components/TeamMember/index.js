import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import Heading from "./Heading";
import $ from "jquery";
import SearchCreate from "./Team/SearchCreate";
import EntitiesList from "./Team/EntitiesList";
import Params from 'helpers/Params'
import Api from 'helpers/Api'
import Routes from 'helpers/Routes'


export default class TeamMember extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			entity_users_list:[],
			entityUserList:{},
			features:{},
			status:0,
		}
	}

	componentWillMount(){
		const params = Params.fetch()
		Api.get(Routes.entityUsersList(params.entities, ['deal_entity.deal.dms_deal_storage_details']))
		.then((entityUserList) => {
			this.setState({
				entity_users_list:entityUserList,
			})
		})
	}
	render(){
		console.log(this.props);
		console.log(this.state.status);
		return(
		<div>
		   <Heading />
		   <div className="content">
		      <div className="padded-content">
		         <div className="container-fluid">
		            <SearchCreate status={this.state.status} />
		            <div className="row">
		                <div className="content-single">
		                    <div className="list" id="team-members-list">
		                     	<EntitiesList entity_users_list={this.state.entity_users_list}/>
		                    </div>
		                </div>
		            </div>
		         </div>
		      </div>
		   </div>
		</div>
		);
	}
}
