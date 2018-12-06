import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import $ from "jquery";
import Params from 'helpers/Params'
import Api from 'helpers/Api'
import Routes from 'helpers/Routes'
import Cookies from 'js-cookie'


export default class SearchCreate extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value:'',
            first_name:'',
            last_name:'',
            email:'',
            selectValue:'',
            is_enabled:'',
            title:'',
            status:0,
        }
        this.UserRole = this.UserRole.bind(this);
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
    inputFieldData(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    searchTeamMember(event) {
        console.log(event.target.value)
        const authCookie = Cookies.getJSON('authentication');
        // this.setState({value:event.target.value})
        $.ajax({
            url: "http://api.localhost.com:3000/v1/entities/refresh_list?new_deal=Doxly&filter_text="+event.target.value,
            type:"GET",
            beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', authCookie.email ); xhr.setRequestHeader('X-User-Token', authCookie.token); xhr.setRequestHeader('X-Entity-User-Id', authCookie.entity_user_id );},
            data: {'search':event.target.value},
            success: function(data){
                console.log(data);
            }
        });
    }

    createEntityUser(e) {
        const params = Params.fetch()
        var user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            selectValue: this.state.selectValue,
            is_enabled: this.state.is_enabled,
        }
        var entity_user = {
            title: this.state.title
        }
        var data1 = {user, entity_user}
        console.log(JSON.stringify(data1));
        // console.log("http://api.localhost.com:3000/v1/entities/"+params.entities+"/entity_users");
        const url = "/entities/"+params.entities+"/entity_users";
        // const url = Routes.createTeammMembers(params.entities ['attachment.latest_version.uploader.user']);
        console.log(Api._baseUrl)
        const authCookie = Cookies.getJSON('authentication');
        /*fetch(`${Api._baseUrl}${url}`, {
            type: 'POST',
            contentType: "application/json",
            headers: new Headers({
                'X-User-Token': authCookie.token, // TODO: can do `data instanceof FormData` to move this to Api helper
                'X-User-Email': authCookie.email,
                'X-Entity-User-Id': authCookie.entity_user_id
            }),
            data: JSON.stringify(data1),
        })
        .then(response => {
            console.log("MMMMMMMMMMMMMMMMMMMMMMMM ",response);
        })
        .catch(error => {
            console.log("EEEEEEEEEEEEEEEEEEE ",error);
        })*/
        $.ajax({
            url: "http://api.localhost.com:3000/v1/entities/"+params.entities+"/entity_users",
            type:"POST",
            contentType: "application/json",
            beforeSend: function(xhr){xhr.setRequestHeader('X-User-Email', authCookie.email ); xhr.setRequestHeader('X-User-Token', authCookie.token); xhr.setRequestHeader('X-Entity-User-Id', authCookie.entity_user_id );},
            data: JSON.stringify(data1),
            success: (data) => {
                if (data.status == 200) {
                    this.setState(status:data.status)
                }
            }
        });
    }
    UserRole(e){
        console.log(e.target.value);
        this.setState({
            selectValue:e.target.value
        });
    }
   render(){
      return(
         <div className="row">
            <div className="toolbar-box category">
               <div className="search-input-box team-members">
                  <div className="form-group">
                     <input value={this.state.value} onChange={this.searchTeamMember} name="search_str" id="team-members-search" className="input-search form-control" placeholder="Search Team Members" / >
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
                              <form onSubmit={this.createEntityUser.bind(this)} method="post">
                                 <div className="form-group ">
                                    <label for="first_name" > First Nane </label>
                                    <br/>
                                    <input className="form-control" type="first_name" name="first_name" value={this.state.first_name} onChange={this.inputFieldData.bind(this)} />
                                 </div>
                                 <div className="form-group ">
                                    <label> Last Name </label>
                                    <br/>
                                    <input className="form-control" type="last_name"  name="last_name" value={this.state.last_name} onChange={this.inputFieldData.bind(this)} />
                                 </div>
                                 <div className="form-group ">
                                    <label> Email </label>
                                    <br/>
                                    <input className="form-control" type="email" name="email" value={this.state.email} onChange={this.inputFieldData.bind(this)} />
                                 </div>
                                 <div className="form-group ">
                                    <label>Title Within Organization</label>
                                    <br/>
                                    <input className="form-control" type="title"  name="title" value={this.state.title} onChange={this.inputFieldData.bind(this)} />
                                 </div>
                                 <div className="form-group">
                                    <label> User Role </label>
                                    <select className="selectpicker show-tick select-border-radius form-control"
                                       value={this.state.selectValue} 
                                       onChange={this.UserRole.bind(this)} 
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

      );
   }
}





