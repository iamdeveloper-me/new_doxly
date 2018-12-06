import React from 'react'
import ReactDOM from 'react-dom'
import dateFormat from 'dateformat'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Heading from "../components/heading";
import $ from "jquery";
import Params from 'helpers/Params'
import TeamMember from 'components/TeamMember/index.js'


export default class People extends React.Component{
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	render(){
		return(
			<TeamMember />
		);
	}
}