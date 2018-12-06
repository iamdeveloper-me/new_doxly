import React from "react";
import { Link } from 'react-router-dom'



export default class Heading extends React.Component {

    render() {
    	console.log(">>>>>>>>>>>cdcd");
        return (
            <div>
                <ul className="nav nav-tabs deal-tabs" role="tablist">
			      <li role="presentation" className=" deal-tab"><Link to="/entities/1000/entity_users" >Team Members</Link></li>
			      <li role="presentation" className=" deal-tab"><Link to="/entities" >Law Firms</Link></li>
			      <li role="presentation" className="deal-tab"><Link to="/entities/#3333" >Parties</Link></li>
			   </ul>
            </div>
        );
    }
    
}