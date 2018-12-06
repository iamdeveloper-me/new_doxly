import React from "react";
import { Link } from 'react-router-dom'
import Params from 'helpers/Params'
import Api from 'helpers/Api'
import Routes from 'helpers/Routes'
import Cookies from 'js-cookie'


export default class userDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entity_user_detail:[],
        }
    }
    componentWillMount(){
        const params = Params.fetch()
        console.log('>>>>>>>>>>>>>>>>>>>>>: ',params)
        Api.get(Routes.entityUserDetails(params.entities, params.entity_users, ['deal_entity.deal.dms_deal_storage_details']))
        .then((entityUserDetail) => {
            console.log(entityUserDetail.user)
            this.setState({
                entity_user_detail:entityUserDetail.user,
            })
        })
    }

    render() {
    	const params = Params.fetch();
        console.log("3########################### ", params);
        console.log("/entities/"+params.entities+"/entity_users/"+params.entity_users);

        return (
        <div className="content">
           <div className="container-fluid">
              <div className="row">
                 <div className="content-single">
                    <div className="panel panel-list">
                       <div className="inner">
                          <div className="team-list-item">
                             <div className="team">
                                <Link to={`/entities/${params.entities}/entity_users/${params.entity_users}`}>
                                   <div className="user-role">
                                      <div className="user has-user-tooltip  tooltipstered" data-tooltip-content="#tooltip_content_3_83">
                                         <div className="avatar large" data-current-user="false" data-assigned-by-current-user="">
                                            <div className="no-photo orange">AS</div>
                                         </div>
                                         <div className="details">
                                            <div className="name">
                                               {this.state.entity_user_detail.first_name} <i></i>
                                            </div>
                                            <div className="subtitle">{this.state.entity_user_detail.email}</div>
                                         </div>
                                      </div>
                                   </div>
                                </Link>
                                <div className="tooltip_templates">
                                </div>
                             </div>
                             <div className="stat">
                                <div className="team-stat-item">
                                </div>
                             </div>
                             <div className="actions">
                                <a href="/entities/1000/entity_users/2/edit"><i className="fa fa-pencil"></i></a>
                                <a className="btn-edit" href="/entities/1000/entity_users/2/resend_invitation"><i className="fa fa-envelope-o"></i></a>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="row">
                 <div className="content-single">
                    <div className="panel panel-deals-full">
                       <div className="deals-full-group">
                          <div className="deals-full-group__header">
                             Active Deals
                          </div>
                          <div className="padding-10">
                             <div className="no-results">
                                <div className="header">There aren't any deals to show.</div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="panel panel-deals-full">
                       <div className="deals-full-group">
                          <div className="deals-full-group__header">
                             Completed Deals
                          </div>
                          <div className="padding-10">
                             <div className="no-results">
                                <div className="header">There aren't any deals to show.</div>
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