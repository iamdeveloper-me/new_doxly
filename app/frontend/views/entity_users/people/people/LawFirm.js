import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Heading from "../components/heading";

export default class LawFirm extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render(){
		return(
			<div>
			<Heading />
			<div id="deal-entity-users-list">
			   <div className="deal-entity-user-group toggle expanded" id="entity-connection-1000">
			      <div className="deal-entity-user-group__header">
			         <div className="title toggle-trigger">
			            <div className="expand-toggle"></div>
			            Doxly
			         </div>
			         <div className="action pull-right">
			            <a data-remote="true" href="/entities/1000/entity_users/new?type=law_firm">Add User</a>
			         </div>
			      </div>
			      <div className="children">
			        <div className="deal-entity-user">
			            <a href="/entities/1000/entity_users/6">
			               <div className="user-role">
			                  <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_7_72">
			                     <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                        <div className="no-photo blue">MB</div>
			                     </div>
			                     <div className="details">
			                        <div className="name">
			                           Maggie Bingham <i></i>
			                        </div>
			                        <div className="subtitle">maggie@doxly.com</div>
			                     </div>
			                  </div>
			               </div>
			            </a>
			            <div className="tooltip_templates">
			               <span id="tooltip_content_7_72" className="tooltip_content">
			                  <div className="tooltip-user">
			                     <div className="tooltip-header">
			                        <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                           <div className="no-photo blue">MB</div>
			                        </div>
			                        <div className="tooltip-details">
			                           <div className="tooltip-name">
			                              Maggie Bingham <i></i>
			                           </div>
			                           <div className="tooltip-entity">
			                              Doxly
			                           </div>
			                        </div>
			                     </div>
			                     <div className="tooltip-contact">
			                        <div className="tooltip-email">
			                           <i className="fa fa-envelope" aria-hidden="true"></i>
			                           <a href="mailto:maggie@doxly.com" target="_blank">maggie@doxly.com</a>
			                        </div>
			                     </div>
			                  </div>
			               </span>
			            </div>
			            <div className="deal-entity-user__actions">
			               <a className="fa fa-envelope-o left" href="/entities/1000/entity_users/6/resend_invitation?type=law_firm"></a>
			               <a className="fa fa-pencil left" data-remote="true" href="/entities/1000/entity_users/6/edit?type=law_firm"></a>
			            </div>
			        </div>
			        <div className="deal-entity-user">
			            <a href="/entities/1000/entity_users/7">
			               <div className="user-role">
			                  <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_8_82">
			                     <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                        <div className="no-photo grey">BW</div>
			                     </div>
			                     <div className="details">
			                        <div className="name">
			                           Ben Wencke <i></i>
			                        </div>
			                        <div className="subtitle">ben@doxly.com</div>
			                     </div>
			                  </div>
			               </div>
			            </a>
			            <div className="tooltip_templates">
			               <span id="tooltip_content_8_82" className="tooltip_content">
			                  <div className="tooltip-user">
			                     <div className="tooltip-header">
			                        <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                           <div className="no-photo grey">BW</div>
			                        </div>
			                        <div className="tooltip-details">
			                           <div className="tooltip-name">
			                              Ben Wencke <i></i>
			                           </div>
			                           <div className="tooltip-entity">
			                              Doxly
			                           </div>
			                        </div>
			                     </div>
			                     <div className="tooltip-contact">
			                        <div className="tooltip-email">
			                           <i className="fa fa-envelope" aria-hidden="true"></i>
			                           <a href="mailto:ben@doxly.com" target="_blank">ben@doxly.com</a>
			                        </div>
			                     </div>
			                     <div>
			                        Last login: 11/05/2018 at  9:49 PM
			                     </div>
			                  </div>
			               </span>
			            </div>
			            <div className="deal-entity-user__actions">
			            </div>
			        </div>
			      </div>
			   </div>
			   <div className="deal-entity-user-group toggle" id="entity-connection-52">
			      <div className="deal-entity-user-group__header">
			         <div className="title toggle-trigger">
			            <div className="expand-toggle"></div>
			            saurabh
			         </div>
			         <div className="action pull-right">
			            <a data-remote="true" href="/entity_connections/105/edit?type=law_firm">Edit</a> 
			            <a data-remote="true" href="/entities/52/entity_users/new?type=law_firm">Add User</a>
			         </div>
			      </div>
			      <div className="children">
			         <div className="deal-entity-user">
			            <a href="/entities/52/entity_users/135">
			               <div className="user-role">
			                  <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_1746_97">
			                     <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                        <div className="no-photo orange">SJ</div>
			                     </div>
			                     <div className="details">
			                        <div className="name">
			                           Saurabh Jain <i></i>
			                        </div>
			                        <div className="subtitle">aryanssaurabh777@gmail.com</div>
			                     </div>
			                  </div>
			               </div>
			            </a>
			            <div className="tooltip_templates">
			               <span id="tooltip_content_1746_97" className="tooltip_content">
			                  <div className="tooltip-user">
			                     <div className="tooltip-header">
			                        <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                           <div className="no-photo orange">SJ</div>
			                        </div>
			                        <div className="tooltip-details">
			                           <div className="tooltip-name">
			                              Saurabh Jain <i></i>
			                           </div>
			                           <div className="tooltip-entity">
			                              saurabh
			                           </div>
			                        </div>
			                     </div>
			                     <div className="tooltip-contact">
			                        <div className="tooltip-email">
			                           <i className="fa fa-envelope" aria-hidden="true"></i>
			                           <a href="mailto:aryanssaurabh777@gmail.com" target="_blank">aryanssaurabh777@gmail.com</a>
			                        </div>
			                     </div>
			                  </div>
			               </span>
			            </div>
			            <div className="deal-entity-user__actions">
			               <a className="fa fa-envelope-o left" href="/entities/52/entity_users/135/resend_invitation?type=law_firm"></a>
			               <a className="fa fa-pencil left"  data-remote="true" href="/entities/52/entity_users/135/edit?type=law_firm"></a>
			            </div>
			         </div>
			         <div className="deal-entity-user">
			            <a href="/entities/52/entity_users/140">
			               <div className="user-role">
			                  <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_1875_84">
			                     <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                        <div className="no-photo orange">JS</div>
			                     </div>
			                     <div className="details">
			                        <div className="name">
			                           jk sir <i></i>
			                        </div>
			                        <div className="subtitle">jk@gmail.com</div>
			                     </div>
			                  </div>
			               </div>
			            </a>
			            <div className="tooltip_templates">
			               <span id="tooltip_content_1875_84" className="tooltip_content">
			                  <div className="tooltip-user">
			                     <div className="tooltip-header">
			                        <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
			                           <div className="no-photo orange">JS</div>
			                        </div>
			                        <div className="tooltip-details">
			                           <div className="tooltip-name">
			                              jk sir <i></i>
			                           </div>
			                           <div className="tooltip-entity">
			                              saurabh
			                           </div>
			                        </div>
			                     </div>
			                     <div className="tooltip-contact">
			                        <div className="tooltip-email">
			                           <i className="fa fa-envelope" aria-hidden="true"></i>
			                           <a href="mailto:jk@gmail.com" target="_blank">jk@gmail.com</a>
			                        </div>
			                     </div>
			                  </div>
			               </span>
			            </div>
			            <div className="deal-entity-user__actions">
			               <a className="fa fa-envelope-o left" href="/entities/52/entity_users/140/resend_invitation?type=law_firm"></a>
			               <a className="fa fa-pencil left"  data-remote="true" href="/entities/52/entity_users/140/edit?type=law_firm"></a>
			            </div>
			         </div>
			      </div>
			   </div>
			</div>
		</div>
		)
	};
}