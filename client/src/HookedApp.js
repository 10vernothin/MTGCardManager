import React, { useRoutes, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
import HookedSetupPage from './pages/home/HookedSetupPage';
import HookedLoginPage from './pages/login/HookedLoginPage';

//importing required common tools
import SessionInfo from './common/cached_data/SessionInfo';
import readCurrURLParamsAsJSON from './common/functions/ReadCurrURLParamsAsJSON';


const routes = {
	"/": () => <HomePage />,
	"/userList": () => <UserListingPage />
};

export default function HookedApp() {

	const routeResult = useRoutes(routes);

	useEffect(() => { SessionInfo.initializeSession() }, [])

	const App = () => (
		<div>
			{/*
			<Router>
				<Switch>
					<Route exact path='/' component={HomePage} />
					<Route path='/userlist' component={UserListingPage} />

					{/*login page will redirect to collections page if logged in}

					<Route path='/login' render={HookedLoginPage()} />
					<Route path='/signup' component={SignupPage} />
					<Route path='/setup' render={HookedSetupPage()} />
					{/*collections pages will redirect to login page if logged out}
					<Route path='/collections' render={
						() => {
							if (!SessionInfo.getSessionStatus()) {
								return (<Redirect to='/login' />)
							} else {
								//subrouting
								switch (readCurrURLParamsAsJSON().page) {
									case "default":
										return (<Route path='/collections' component={ListingsMainPage} />);
									case "create-new-collection":
										return (<Route path='/collections' component={CreateCollectionPage} />);
									case "selected":
										return (<Route path='/collections' component={CollectionPage} />)
									case "edit":
										return (<Route path='/collections' component={EditCollectionPage} />)
									default:
										return (<Route path='/collections' component={ListingsMainPage} />);
								}
							}
						}
					} />
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

					{/*Default route goes Home/or ERROR page if it gets to that}
					<Route path="*" render={() => { return (<Redirect to='/' />) }} />

				</Switch>
			</Router>
				*/}
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