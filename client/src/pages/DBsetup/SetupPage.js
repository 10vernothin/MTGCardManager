import React, { Component } from 'react';
import { HomeButton, LoginButton } from '../../common/elements/CommonButtons';
import callAPI from '../../common/functions/CallAPI';
import './css/DBSetup.css'

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
            formControls: { host: { value: '' }, port: { value: '' }, database: { value: '' }, user: { value: '' }, password: { value: '' }, status: { value: '' } },
            currentSetting: '',
            changeSetup: false,
            postResponse: '',
            testResponse: '',
            passwordType: "password",
            correctBoxCSS: "untested"
        }
    }

    componentDidMount() {
        this.loadDefault()
    }

    render() {
        return (
            <div>
                <div><h1>Setup Database</h1></div>
                <div>Current Settings:</div>
                {this.renderCurrentSettingsTable()}
                <div class="setup_page_default_padding">
                    {this.state.changeSetup ?
                        this.renderSetupDBForm() :
                        <button onClick={this.handleToggleChangeSetup}> Change Setup</button>}
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

    //Render functions


    renderCurrentSettingsTable = () => {
        let table = (
            <div>
                <div id="setup_current_settings_table">
                    <div class="title_cell">HOST</div>
                    <div class="title_cell">PORT</div>
                    <div class="title_cell">DB</div>
                    <div class="title_cell">USERNAME</div>
                    <div class="title_cell">STATUS</div>
                    <div class="cell">{this.state.currentSetting.HOST}</div>
                    <div class="cell">{this.state.currentSetting.PORT}</div>
                    <div class="cell">{this.state.currentSetting.DB}</div>
                    <div class="cell">{this.state.currentSetting.USER}</div>
                    <div class={`cell ${this.state.currentSetting.STATUS ? "font_green" : "font_red"} bold`}>
                        {this.state.currentSetting.STATUS ? "WORKING" : "NOT WORKING"}
                    </div>
                </div>
            </div>
        )
        return table

    }
    renderSetupDBForm = () => {
        const form =
            <div class="setup_page_default_padding">
                <div class="setup_page_default_padding">--- Change Setup ---</div>
                <form method="post" onSubmit={this.handleSubmit} class={`change_setup_border_${this.state.correctBoxCSS}`}>
                    <div class="setup_page_default_padding">
                        <button onClick={this.handleTestConnection}>Test Database Connection</button>
                        {this.state.testResponse}
                    </div>
                    <title>Database Details</title>
                    <div class="setup_page_default_padding">Host/Port:
                    <input type="text"
                            name="host"
                            value={this.state.formControls.host.value}
                            onChange={this.handleChange}
                        />
                    :
                    <input type="number"
                            name="port"
                            value={this.state.formControls.port.value}
                            onChange={this.handleChange}
                            min="0"
                            max="65535"
                        />
                    </div>
                    <div class="setup_page_default_padding">Database:
                    <input type="text"
                            name="database"
                            value={this.state.formControls.database.value}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div class="setup_page_default_padding">User:
                    <input type="text"
                            name="user"
                            value={this.state.formControls.user.value}
                            onChange={this.handleChange}
                        />
                    Password:
                    <input type={this.state.passwordType}
                            name="password"
                            value={this.state.formControls.password.value}
                            onChange={this.handleChange}
                        />
                        <button
                            onMouseDown={this.handleShowPassword}
                            onMouseUp={this.handleHidePassword}
                            onClick={e => { e.preventDefault() }}
                        >
                            Show Password
                        </button>
                    </div>
                    <div class="setup_page_default_padding">
                        <button type="submit" disabled={this.state.correctBoxCSS === "success" ? false : true}>
                            {!(this.state.correctBoxCSS === "success") ? "Please Test Connection..." : "Submit"}
                        </button>
                        <button onClick={this.handleToggleChangeSetup}>Cancel</button>
                    </div>
                    <div class="setup_page_default_padding" />
                </form>
            </div>
        return (form);
    }

    //Loader Methods

    loadDefault = () => {
        callAPI(
            '/api/DBSetup/get-DB-details',
            (result, err) => {
                if (!err) {
                    let newcurrentSetting = {
                        HOST: result.host.value,
                        PORT: result.port.value,
                        DB: result.database.value,
                        USER: result.user.value,
                        STATUS: result.status.value
                    }
                    if (
                        !(JSON.stringify(result) === JSON.stringify(this.state.formControls)) ||
                        !(JSON.stringify(newcurrentSetting) === JSON.stringify(this.state.currentSetting))
                    ) {
                        this.setState({
                            formControls: result,
                            currentSetting: newcurrentSetting
                        })
                    }
                } else {
                    console.log(err)
                }
            }
        )
    }

    //Handler Methods

    handleChange = e => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            },
            correctBoxCSS: "untested",
            testResponse: '',
        })
    }

    handleToggleChangeSetup = e => {
        e.preventDefault()
        this.setState({ changeSetup: !this.state.changeSetup })
    }

    handleTestConnection = e => {
        e.preventDefault()
        callAPI(
            '/api/DBSetup/test-connection',
            (data, err) => {
                if (!err) {
                    if (data) {
                        this.setState({ correctBoxCSS: "success", testResponse: "Test Success!" })
                    } else {
                        this.setState({ correctBoxCSS: "failed", testResponse: "Test Failure." })
                    }
                } else {
                    alert(err)
                }
            },
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            }
        )
    }

    handleSubmit = e => {
        e.preventDefault()
        callAPI(
            '/api/DBSetup/update-db-info',
            (data, err) => {
                if (!err) {
                    let postResp;
                    if (data) {
                        postResp = 'Success! Database changed.';
                    } else {
                        postResp = 'Setup Failed. Please try again.';
                    }
                    this.setState({
                        postResponse: postResp,
                        testResponse: '',
                        correctBoxCSS: "untested"
                    }, this.loadDefault())
                } else {
                    alert(err)
                }
            },
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            }
        )
    }

    handleShowPassword = e => {
        e.preventDefault()
        this.setState({ passwordType: "text" })
    }

    handleHidePassword = e => {
        e.preventDefault()
        this.setState({ passwordType: "password" })
    }
}

export default SetupPage;