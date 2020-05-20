import React, { Component } from 'react';
import { HomeButton, LoginButton } from '../../common/elements/CommonButtons';
import './css/DBSetup.css';
import SetupChangeForm from './elements/SetupChangeForm';
import SetupCurrentSettingsTable from './elements/SetupCurrentSettingsTable';
import CreateNewDBForm from './elements/CreateNewDBForm';
/*
{
    "host": ,
    "port": ,
    "database": ,
    "user": ,
    "password": 
}
*/


class SetupPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changeSetup: false,
            postResponse: ''
        }
        this.setTopState = this.setTopState.bind(this)
    }

    render() {
        return(<div>{this.renderSetupPage()}</div>)
    }

    renderSetupPage = () => {
        return (
            <div>
                <div><h1>Setup Database</h1></div>
                <div>Current Settings:</div>
                <SetupCurrentSettingsTable/>
                <div class="setup_page_default_padding">
                    {this.state.changeSetup ?
                    this.state.changeSetup === 1 ?
                       <SetupChangeForm setTopState={this.setTopState} postResponse={this.state.postResponse}/> : null:
                        <button onClick={this.handleToggleChangeSetup}> Change Setup</button>}
                    {this.state.changeSetup ?
                        this.state.changeSetup === 2 ?
                       <CreateNewDBForm setTopState={this.setTopState} postResponse={this.state.postResponse}/> : null:
                        <button onClick={this.handleToggleCreateDB}> Create New Database</button>}
                </div>
                <div class="setup_page_default_padding">
                    <HomeButton />
                    <LoginButton />
                </div>
                <div class="setup_page_default_padding">
                    {this.state.postResponse}
                </div>

            </div>
        );
    }

    //Handler Methods

    handleToggleChangeSetup = e => {
        e.preventDefault()
        this.setState({ changeSetup: 1 })
    }

    handleToggleCreateDB = e => {
        e.preventDefault()
        this.setState({ changeSetup: 2 })
    }

    //Binder Methods

    setTopState = (newstate) => {
        this.setState(newstate)
    }

}

export default SetupPage;