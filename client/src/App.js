import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collection from './pages/Collection';
import {LoggedInContext} from './tools/LoggedIn';

class App extends Component {
	
	constructor(props) {
		super(props);
		this.requestSession =  async () => {
			let response =  await fetch('/api/request-session');
			let body =  await response.text();
			if (!(JSON.stringify(body).Logged ==null)) {
				return true;
			} else {
				return false;
			}
		}
	}

	

	render() {
		const App = () => (
		<div>
		<Router>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/list' component={List}/>
				<Route path='/login' component={Login}/>
				<Route path='/signup' component={Signup}/>
				<Route path='/collections' render = {() => {
					 this.requestSession().then( (res) => {
					 if (res === true) { return (<Collection/>) } else { return (<Redirect to="/login"/>)}})}}/>	  
			</Switch>
		</Router>
		</div>
		)
		return (
		<Router>
		<Switch>
			<App/>
		</Switch>
		</Router>
		);
	}
}
App.contextType = LoggedInContext;
export default App;