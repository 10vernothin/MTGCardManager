import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collection from './pages/Collection';
import SessionInfo from './tools/ContentData';


class App extends Component {

	render() {
		const App = () => (
		<div>
		<Router>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route exact path='/list' component={List}/>
				<Route exact path='/login' render = {() =>{
						if (SessionInfo.isAuth) {
							return(<Redirect to='/collections'/>);
						} else {
							alert("login");
							return(<Route path= '/login' component = {Login}/>);
						}
					}
				}/>
				<Route exact path='/signup' component={Signup}/>		
				<Route exact path='/collections' render = {
					() => {	
						if (!SessionInfo.isAuth){
							return (<Redirect to='/login'/>)
						}else {
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