import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collection from './pages/Collection';
import SessionInfo from './tools/ContentData';
import CreateCollection from './pages/CreateCollection';

SessionInfo.initializeSession();

class App extends Component {

	readCurrURLParamsAsJSONString() {
		var params = '';
		params = (window.location.href).split('?').slice(1).map((item) =>
		{
			var items;
			items = item.split('=');
			params = params.concat(',"' + items[0] + '":"' + items[1] + '"');
			return params;
		}
	);
		params = params.toString().substring(1);
		params = '{'+ params + '}';
		return params
	}

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
								//alert(JSON.parse(this.readCurrURLParamsAsJSONString()).page === 'default');
								switch (JSON.parse(this.readCurrURLParamsAsJSONString()).page) {
								case "default":
									return (<Route path= '/collections' component = {Collection}/>);
								case "create-new-collection":
									return (<Route path= '/collections' component = {CreateCollection}/>);
								default:
									return (<Route path= '/collections' component = {Collection}/>);
								}
						}
					}		
				}/>
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