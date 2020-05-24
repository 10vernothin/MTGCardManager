import React, { Component } from 'react';
import { HomeButton, LoginButton } from '../../common/elements/CommonButtons';
import './css/DBSetup.css';
import SetupChangeForm from './elements/SetupChangeForm';
import SetupCurrentSettingsTable from './elements/SetupCurrentSettingsTable';
import CreateNewDBForm from './elements/CreateNewDBForm';
import callAPI from '../../common/functions/CallAPI';
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
            postResponse: '',
            defaultResult:'',
            reloadable: false,
            report: '',
            offline: true
        }
        this.setTopState = this.setTopState.bind(this)
    }

    render() {
        this.loadDefault()
        return (<div>{this.renderSetupPage()}</div>)
    }

    renderSetupPage = () => {
        return (
            <div>
                <div><h1>Database Setup</h1></div>
                <div>Current Settings:</div>
                <div class="setup_page_default_padding"><SetupCurrentSettingsTable
                    defaultResult={this.state.defaultResult}
                /></div>

                <div class="setup_page_default_padding">
                    {this.state.changeSetup ?
                        this.state.changeSetup === 1 ?
                            <SetupChangeForm 
                            setTopState={this.setTopState} 
                            postResponse={this.state.postResponse}
                            defaultResult={this.state.defaultResult} /> : null :
                        <button onClick={this.handleToggleChangeSetup}> Change Setup</button>}
                    {this.state.changeSetup ?
                        this.state.changeSetup === 2 ?
                            <CreateNewDBForm 
                            setTopState={this.setTopState} 
                            postResponse={this.state.postResponse} 
                            /> : null :
                        <button onClick={this.handleToggleCreateDB} disabled={this.state.offline}> Create New Database</button>}
                    {!this.state.changeSetup?
                        <button onClick={this.handleTableReload} disabled={(this.state.disableAll ^ !this.state.reloadable)||this.state.offline}>
                            Reload Database
                            </button>
                        : null
                    }
                </div>
                <div>{this.state.reloadable ? this.state.report : null}</div>
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

    handleTableReload = e => {
        e.preventDefault()
        if (window.confirm("ARE YOU SURE YOU WANT TO RELOAD TABLES? Doing this WILL override existing tables: users, collection, listing, cards and you will lose all data stored in those tables.")) {
            this.setState({ reloadable: false }, () => {
                callAPI('/api/DBSetup/recreate-all-tables', (res) => { 
                    this.setState({postResponse: res?'Successfully reloaded tables': 'Table reload failed'})
                 })
            })
        }
    }

    //Loader Methods

    loadDefault = () => {
        callAPI(
            '/api/DBSetup/get-DB-details',
            (result, err) => {
                if (!err) {
                    if (!(JSON.stringify(result) === JSON.stringify(this.state.defaultResult))) {
                        this.setState({
                            defaultResult: result,
                            reloadable: !(result.status.value === 'working'),
                            offline: (result.status.value === 'offline'),
                            report: JSON.stringify(result.report.value)
                        })
                    } else {
                        console.log(err)
                    }
                }
            }
        )
    }

    //Binder Methods

    setTopState = (newstate) => {
        this.setState(newstate)
    }

}

export default SetupPage;