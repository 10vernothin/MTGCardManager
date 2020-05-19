import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

//Importing pages
import HomePage from './pages/home/HomePage';
import UserListingPage from './pages/home/UserListingPage';
import SignupPage from './pages/login/SignupPage';
import ListingsMainPage from './pages/listing/ListingsMainPage';
import CreateCollectionPage from './pages/listing/CreateCollectionPage';
import EditCollectionPage from './pages/listing/EditCollectionPage';
import DownloadPage from './pages/download/DownloadPage';
import CollectionPage from './pages/collection/CollectionPage';
import HookedSetupPage from './pages/home/HookedSetupPage';
import HookedLoginPage from './pages/login/HookedLoginPage';

//importing required common tools
import SessionInfo from './common/cached_data/SessionInfo';
import readCurrURLParamsAsJSON from './common/functions/ReadCurrURLParamsAsJSON';


export default function HookedApp() {

	const chooseCollection = () => {
		if (!SessionInfo.getSessionStatus()) {
			return <Redirect to='/login'/>
		} else {
			switch (readCurrURLParamsAsJSON().page) {
				case "default":
					return (<ListingsMainPage/>);
				case "create-new-collection":
					return (<CreateCollectionPage />);
				case "selected":
					return (<CollectionPage />)
				case "edit":
					return (<EditCollectionPage />)
				default:
					return (<ListingsMainPage />);
			}
		}
	}

	const loginRedir = () => {return !SessionInfo.getSessionStatus()? HookedLoginPage():<Redirect to='/collections'/>}

	const App = () => (
		<div>
			<Router>
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route path='/userlist' component={UserListingPage} />

					{/*login page will redirect to collections page if logged in*/}

					<Route path='/login'>
						{loginRedir()}
					</Route>
					<Route path='/signup'>
						<SignupPage/>
					</Route>
					<Route path='/setup' render={<HookedSetupPage/>} />
					{/*collections pages will redirect to login page if logged out*/}
					<Route path='/collections'>
						{chooseCollection()}
					</Route>
					<Route path='/downloads' render={
						() => {
							switch (readCurrURLParamsAsJSON().func) {
								//subrouting
								case '':
									return (<Route exact path='/' component={HomePage} />)
								default:
									return (<Route path='/downloads' component={DownloadPage} />)
							}
						}
					} />

					{/*Default route goes Home/or ERROR page if it gets to that*/}
					<Route path="*" render={() => { return (<Redirect to='/' />) }} />

				</Switch>
			</Router>
		</div>)

	return (
		<Router>
			<Switch>
				<App/>
			</Switch>
		</Router>
	);
}