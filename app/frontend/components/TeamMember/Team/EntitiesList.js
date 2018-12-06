import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'


export default class EntitiesList extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			entity_users_list:this.props.entity_users_list,
		}
	}
	
	render(){
		return(
			<div className="team-list">
			{this.props.entity_users_list.map((item)=>
	            <div className="team-list-item" key={item.id}>
	               <div className="team">
	                  <Link to={`/entities/${item.entity_id}/entity_users/${item.id}`}>
	                     <div className="user-role">
	                        <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_1670_57">
	                           <div className="avatar large" data-current-user="true" data-assigned-by-current-user="">
	                              <div className="no-photo grey">SJ</div>
	                           </div>
	                           <div className="details">
	                              <div className="name">
	                                 {item.name} <i></i>
	                              </div>
	                              <div className="subtitle">{item.email}</div>
	                           </div>
	                        </div>
	                     </div>
	                  </Link>
	                  <div className="tooltip_templates">
	                     <span id="tooltip_content_1670_57" className="tooltip_content">
	                        <div className="tooltip-user">
	                           <div className="tooltip-header">
	                              <div className="avatar large" data-current-user="true" data-assigned-by-current-user="">
	                                 <div className="no-photo grey">SJ</div>
	                              </div>
	                              <div className="tooltip-details">
	                                 <div className="tooltip-name">
	                                    {item.name} <i></i>
	                                 </div>
	                                 <div className="tooltip-entity">
	                                    {item.title}
	                                 </div>
	                              </div>
	                           </div>
	                           <div className="tooltip-contact">
	                              <div className="tooltip-email">
	                                 <i className="fa fa-envelope" aria-hidden="true"></i>
	                                 <a href="mailto:{item.email}" target="_blank">{item.email}</a>
	                              </div>
	                           </div>
	                           <div>
	                              Last login: {item.updated_at.toString()}
	                           </div>
	                        </div>
	                     </span>
	                  </div>
	               </div>
	               <div className="stat">
	                  <div className="team-stat-item">
	                     <b>0</b> Active Deals
	                  </div>
	                  <div className="team-stat-item">
	                     <b>0</b> Complete Deals
	                  </div>
	               </div>
	               <div className="actions">
	                  <a className="fa fa-gear" href="#"></a>
	               </div>
	            </div>
	        )}
	        </div>
		);
	}
}