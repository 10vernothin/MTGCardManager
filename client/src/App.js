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
import Downloads from './pages/Downloads';
import SelectedCollection from './pages/SelectedCollection';
import readCurrURLParamsAsJSON from './tools/ParamsReader';
//import replaceManaCostWithSVG from './tools/ManaCostSVGReplacer'

/*Initializing local cache*/
SessionInfo.initializeSession();
//replaceManaCostWithSVG('{1}{U/B}{U/B}').then((res)=>{alert(JSON.stringify(res))});

class App extends Component {

	render() {
		const App = () => (
		<div>
		<Router>
			<Switch>
				<Route exact path='/' component={Home}/>
				<Route path='/list' component={List}/>

				{/*login page will redirect to collections page if logged in*/}
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
				{/*collections pages will redirect to login page if logged out*/}	
				<Route path='/collections' render = {
					() => {	
						if (!SessionInfo.getSessionStatus()){
							//alert("LOGIN");
							return (<Redirect to='/login'/>)
						}else {
								//subrouting
								switch (readCurrURLParamsAsJSON().page) {
								case "default":
									
									return (<Route path= '/collections' component = {Collection}/>);
								case "create-new-collection":
				
									return (<Route path= '/collections' component = {CreateCollection}/>);
								case "selected":
									
									return (<Route path= '/collections' component = {SelectedCollection}/>)
								default:
									
									return (<Route path= '/collections' component = {Collection}/>);
								}
						}
					}		
				}/>
				<Route path='/downloads' render = {
					() => {
						switch (readCurrURLParamsAsJSON().func) {
							//subrouting
							case '':
								return (<Route exact path='/' component= {Home}/>)
							default:
								return (<Route path='/downloads' component= {Downloads}/>)
						}
					}
				}/>

				{/*Default route goes Home/or ERROR page if it gets to that*/}
				<Route path="*" render= {() => {return (<Redirect to='/'/>)}}/>

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