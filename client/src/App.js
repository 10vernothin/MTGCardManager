import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter} from 'react-router-dom';
import './App.css';


//Importing pages
import HomePage from './pages/home/HomePage';
import UserListingPage from './pages/home/UserListingPage';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/login/SignupPage';
import ListingsMainPage from './pages/listing/ListingsMainPage';
import CreateCollectionPage from './pages/listing/CreateCollectionPage';
import EditCollectionPage from './pages/listing/EditCollectionPage';
import DownloadPage from './pages/download/DownloadPage';
import CollectionPage from './pages/collection/CollectionPage';
import SetupPage from './pages/DBsetup/SetupPage';

//importing required common tools
import SessionInfo from './common/cached_data/SessionInfo';
import readCurrURLParamsAsJSON from './common/functions/ReadCurrURLParamsAsJSON';

//import { createBrowserHistory } from "history";
//const customHistory = createBrowserHistory()

class App extends Component {

	constructor(props) {
		super(props)
		SessionInfo.initializeSession();
	}

	componentDidCatch(err) {
		alert("App Error" + err)
	}

	render() {
		const App = () => (
			<div>
				<Router>
					<Switch>
						<Route exact path='/home' component={HomePage} />
						<Route path='/userlist' component={UserListingPage} />
						<Route path='/login'>
							{!SessionInfo.getSessionStatus()? withRouter(LoginPage): <Redirect push to='/collections'/>}
						</Route>
						<Route path='/signup' component={SignupPage} />
						<Route path='/setup' component={SetupPage} />
						{/*collections pages will redirect to login page if logged out*/}
						<Route path='/collections' component={()=> {
								if (!SessionInfo.getSessionStatus()) {
									return (<Redirect push to='/login'/>);
								} else {
									switch (readCurrURLParamsAsJSON().page) {
										case "default":				
											return (<Route path= '/collections' component = {ListingsMainPage}/>);
										case "create-new-collection":
											return (<Route path= '/collections' component = {CreateCollectionPage}/>);
										case "selected":
											return (<Route path= '/collections' component = {CollectionPage}/>)
										case "edit":
											return (<Route path= '/collections' component = {EditCollectionPage}/>)
										default:	
											return (<Route path= '/collections' component = {ListingsMainPage}/>);
										}
								}
							}
						}/>
						<Route path='/downloads' render={
							() => {
								switch (readCurrURLParamsAsJSON().func) {
									//subrouting
									case '':
										return (<Redirect push to='/'/>)
									default:
										return (<Route path='/downloads' component={DownloadPage} />)
								}
							}
						} />
						<Route path="*" component={() => { return (<Redirect to='/home' />) }} />
					</Switch>
				</Router>
			</div>
		)
		return (
			<Router>
				<Switch>
					<App />
				</Switch>
			</Router>
		);
	}
}
export default App;