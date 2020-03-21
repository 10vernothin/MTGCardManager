import React, { Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

//Importing pages
import HomePage from './pages/home/home-page';
import UserListingPage from './pages/home/user-listing-page';
import LoginPage from './pages/login/login-page';
import SignupPage from './pages/login/signup-page';
import CollectionListPage from './pages/listing/collection-list-page';
import CreateCollectionPage from './pages/listing/create-collection-page';
import EditCollectionPage from './pages/listing/edit-collection-page';
import DownloadPage from './pages/download/download-page';
import CollectionPage from './pages/collection/collection-page';

//importing required common tools
import SessionInfo from './common/cached_data/session-info';
import readCurrURLParamsAsJSON from './common/functions/read-url-params';

/*Initializing local cache*/
SessionInfo.initializeSession();

class App extends Component {

	render() {
		const App = () => (
		<div>
		<Router>
			<Switch>
				<Route exact path='/' component={HomePage}/>
				<Route path='/userlist' component={UserListingPage}/>

				{/*login page will redirect to collections page if logged in*/}
				<Route path='/login' render = {() =>{
						if (SessionInfo.getSessionStatus()) {
							//alert("collections");
							return(<Redirect to='/collections'/>);
						} else {
							//alert("login");
							return(<Route path= '/login' component = {LoginPage}/>);
						}
					}
				}/>
				<Route path='/signup' component={SignupPage}/>	
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
									return (<Route path= '/collections' component = {CollectionListPage}/>);
								case "create-new-collection":
									return (<Route path= '/collections' component = {CreateCollectionPage}/>);
								case "selected":
									return (<Route path= '/collections' component = {CollectionPage}/>)
								case "edit":
									return (<Route path= '/collections' component = {EditCollectionPage}/>)
								default:	
									return (<Route path= '/collections' component = {CollectionListPage}/>);
								}
						}
					}		
				}/>
				<Route path='/downloads' render = {
					() => {
						switch (readCurrURLParamsAsJSON().func) {
							//subrouting
							case '':
								return (<Route exact path='/' component= {HomePage}/>)
							default:
								return (<Route path='/downloads' component= {DownloadPage}/>)
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