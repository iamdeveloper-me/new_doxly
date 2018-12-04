import React from 'react'
import ReactDOM from 'react-dom'
import dateFormat from 'dateformat'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Heading from "../components/heading";


export default class People extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			value:'',
			first_name:'',
			last_name:'',
			email:'',
			selectValue:'',
			isGoing:'',
			entity_users_list:[],
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
        // e.preventDefault();
        var user = {
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              email: this.state.email,
              selectValue: this.state.selectValue,
              isGoing: this.state.isGoing
          }
        console.log(user);
        $.ajax({
            url: "http://app.localhost.com:3000/v1/entities/1000/entity_users",
				    type:"POST",
				    data: user,
				    success: function(data){
				      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
				      console.log('--------- ',data);
				    }
				});

        /*axios.post('https://spendin-api.herokuapp.com/api/v1/users',
            {
                data: {
                    user: {
                        first_name: this.state.first_name,
                        last_name: this.state.last_name,
                        email: this.state.email,
                        selectValue: this.state.selectValue,
                        isGoing: this.state.isGoing
                    }
                }
            }
        );*/
    }

	handleChange1(event) {
		console.log(event.target.value)
	  // this.setState({value: event.target.value});

		$.ajax({
	    url: "http://api.localhost.com:3000/v1/entities/refresh_list?est=ere",
	    beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', 'organization.admin@doxly.com'); xhr.setRequestHeader('X-User-Token', 'UvansyD1FJJLysyKcVDN'); xhr.setRequestHeader('X-Entity-User-Id', '5000');},
	    data: {'search':event.target.value},
	    success: function(data){
	      console.log(data);
	    }
		});

	}
	componentWillMount(){
		console.log(">>>>>>>>>>>>>>>>>>>>>>> ");
		$.ajax({
		    url: "http://api.localhost.com:3000/v1/entities/1000/entity_users",
		    type:"GET",
		    beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', 'organization.admin@doxly.com'); xhr.setRequestHeader('X-User-Token', 'UvansyD1FJJLysyKcVDN'); xhr.setRequestHeader('X-Entity-User-Id', '5000');},
		    success: (data) => {
		    	console.log(">>>>>>>>>>>>>>>>>>>>>>> ", data);
		      this.setState({entity_users_list:data.data})
		    }
		});

	}

	render(){
				console.log(this.state.entity_users_list);

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
                                <h5 className="modal-title" id="exampleModalLongTitle">Create Team Member</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div className="modal-body">
											            <div>
											              <form onSubmit={this.onSubmit.bind(this)}>
											                <div className="modal-body">
											                   <label> First Nane </label>
											                   <br/>
											                   <input type="first_name" name="first_name" value={this.state.first_name} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="modal-body">
											                   <label> Last Name </label>
											                   <br/>
											                   <input type="last_name"  name="last_name" value={this.state.last_name} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="modal-body">
											                   <label> Email </label>
											                   <br/>
											                   <input type="email" name="email" value={this.state.email} onChange={this.onChange.bind(this)} />
											                </div>
											                <div className="form-group">
											                   <label> User Role </label>
											                    <select 
											                      value={this.state.selectValue} 
											                      onChange={this.handleChange.bind(this)} 
											                    >
											                     <option value="Read Only">Read Only</option>
											                      <option value="Standard User">Standard User</option>
											                      <option value="Entity Admin">Entity Admin</option>
											                    </select>
											                </div>
											                <br/>
											                <div className="form-group">
											                        <label>
											                          Send the sign up invitation email:
											                          <input
											                            name="isGoing"
											                            type="checkbox"
											                            checked={this.state.isGoing}
											                            onChange={this.handleInputChange} />
											                        </label>
											                    </div>
											                <div className="modal-body">
											                   <input type="submit" value="Signup" />
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
								                                 <a href="mailto:saurabh@thoughtwin.com" target="_blank">{item.email}</a>
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