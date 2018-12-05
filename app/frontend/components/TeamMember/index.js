import React from 'react'
import ReactDOM from 'react-dom'
import dateFormat from 'dateformat'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Heading from "../components/heading";
import $ from "jquery";
import Params from 'helpers/Params'
import Cookies from 'js-cookie'


export default class TeamMember extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			value:'',
			first_name:'',
			last_name:'',
			email:'',
			selectValue:'',
			is_enabled:'',
			entity_users_list:[],
			title:'',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
        
        this.setState({
      [name]: value
    });
     }

  onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChange(e){
    console.log(e.target.value);
    this.setState({
      selectValue:e.target.value
    });
  }

    onSubmit(e) {
    	const params = Params.fetch()

        // e.preventDefault();
        var user = {
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              email: this.state.email,
              selectValue: this.state.selectValue,
              is_enabled: this.state.is_enabled,
          }
        var entity_user = {
          	title: "esese rdr r"
          }
        var data1 = {user, entity_user}
        console.log(JSON.stringify(data1));
        console.log("http://api.localhost.com:3000/v1/entities/"+params.entities+"/entity_users");
        $.ajax({
            url: "http://api.localhost.com:3000/v1/entities/"+params.entities+"/entity_users",
				    type:"POST",
				    contentType: "application/json",
				    beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', 'organization.admin@doxly.com'); xhr.setRequestHeader('X-User-Token', 'sdJAd9pyz5PVBTmzxHGG'); xhr.setRequestHeader('X-Entity-User-Id', '5000');},
				    data: JSON.stringify(data1),
				    success: (data) => {
				      console.log('--------- ',data);
				    }
				});
    }

	handleChange1(event) {
		console.log(event.target.value)
	  // this.setState({value: event.target.value});

		$.ajax({
	    url: "http://api.localhost.com:3000/v1/entities/refresh_list?new_deal=''",
	    beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', 'organization.admin@doxly.com'); xhr.setRequestHeader('X-User-Token', 'sdJAd9pyz5PVBTmzxHGG '); xhr.setRequestHeader('X-Entity-User-Id', '5000');},
	    data: {'search':event.target.value},
	    success: function(data){
	      console.log(data);
	    }
		});

	}
	componentWillMount(){
		const params = Params.fetch()

		console.log(">>>>>>>>>>>>>>>>>>>>>>>123- ",params.entities);
		$.ajax({
		    url: "http://api.localhost.com:3000/v1/entities/:entity_id/entity_users",
		    type:"GET",
		    beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', 'organization.admin@doxly.com'); xhr.setRequestHeader('X-User-Token', 'sdJAd9pyz5PVBTmzxHGG'); xhr.setRequestHeader('X-Entity-User-Id', '5000');},
		    success: (data) => {
		    	console.log(">>>>>>>>>>>>>>>>>>>>>>> ", data);
		      this.setState({entity_users_list:data.data})
		    }
		});

	}

	render(){
  console.log(Cookies.getJSON('authentication'))
		return(
			<div>
			   <Heading />
			   <div className="content">
			      <div className="padded-content">
			         <div className="container-fluid">
			            <div className="row">
			               <div className="toolbar-box category">
			                  <div className="search-input-box team-members">
			                     <div className="form-group">
			                        <input value={this.state.value} onChange={this.handleChange1} name="search_str" id="team-members-search" className="input-search form-control" placeholder="Search Team Members" / >
			                     </div>
			                     <a className="disabled"><i className="icon-icon-search"></i></a>
			                  </div>

			                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                          Create Team Member
                        </button>

                        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                                <h5 className="modal-title" id="exampleModalLongTitle">Create Team Member</h5>
                              </div>
                              <div className="modal-body">
											            <div>
											              <form onSubmit={this.onSubmit.bind(this)} method="post">
											                <div className="form-group ">
											                   <label for="first_name" > First Nane </label>
											                   <br/>
											                   <input className="form-control" type="first_name" name="first_name" value={this.state.first_name} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="form-group ">
											                   <label> Last Name </label>
											                   <br/>
											                   <input className="form-control" type="last_name"  name="last_name" value={this.state.last_name} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="form-group ">
											                   <label> Email </label>
											                   <br/>
											                   <input className="form-control" type="email" name="email" value={this.state.email} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="form-group ">
											                   <label>Title Within Organization</label>
											                   <br/>
											                   <input className="form-control" type="title"  name="title" value={this.state.title} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="form-group">
											                   <label> User Role </label>
											                    <select className="selectpicker show-tick select-border-radius form-control"
											                      value={this.state.selectValue} 
											                      onChange={this.handleChange.bind(this)} 
											                    >
											                     <option value="Read Only">Read Only</option>
											                      <option value="Standard User">Standard User</option>
											                      <option value="Entity Admin">Entity Admin</option>
											                    </select>
											                </div>
											                <br/>
											                <div className="checkbox form-group margin-bottom-10 margin-top-15">
										                        <label>
										                          <input
										                            name="is_enabled"
										                            type="checkbox"
										                            checked={this.state.is_enabled}
										                            onChange={this.handleInputChange} />
										                            <b>Send the sign up invitation email</b>
										                        </label>
											                    </div>
											                <div className="modal-footer">
											                   <input type="submit" className="btn btn-primary submit-form" value="Save" />
											                   <button type="button" className="btn btn-default pull-left cancel-form" data-dismiss="modal" path="">Cancel</button>
											                </div>
											             </form>
															</div>
                            </div>
                          </div>
                        </div>
                      </div>
			               </div>
			            </div>
			            <div className="row">
								   <div className="content-single">
								      <div className="list" id="team-members-list">
								         <div className="team-list">
								         	{this.state.entity_users_list.map((item)=>
								            <div className="team-list-item">
								         		
								               <div className="team">
								                  <a href={`/entities/${item.entity_id}/entity_users/${item.id}`}>
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
								                  </a>
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