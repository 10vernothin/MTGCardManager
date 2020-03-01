import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collection from './pages/Collection';
import SessionInfo from './tools/ContentData';

SessionInfo.initializeSession();

class App extends Component {

	render() {
		const App = () => (
		<div>
		<Router>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/list' component={List}/>
				<Route path='/login' render = {() =>{
						if (SessionInfo.getSessionStatus()) {
							//alert("collections");
							return(<Redirect to='/collections'/>);
						} else {
							//alert("login");
							return(<Route path= '/login' component = {Login}/>);
						}
					}
				}/>
				<Route path='/signup' component={Signup}/>		
				<Route path='/collections' render = {
					() => {	
						if (!SessionInfo.getSessionStatus()){
							//alert("LOGIN");
							return (<Redirect to='/login'/>)
						}else {
							//alert("COLLECTIONS");
							return (<Route path= '/collections' component = {Collection}/>);
						}}		
				}
				/>
					  
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
export default App;