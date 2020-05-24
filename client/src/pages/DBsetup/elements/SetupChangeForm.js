import React, { Component } from 'react';
import callAPI from '../../../common/functions/CallAPI';

class SetupChangeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formControls: {
                host: { value: '' },
                port: { value: '' },
                database: { value: '' },
                user: { value: '' },
                password: { value: '' },
                status: { value: '' }
            },
            testResponse: '',
            passwordType: "password",
            correctBoxCSS: "untested",
            disableAll: false
        }
    }

    componentDidMount() {
        this.loadDefault()
    }

    render() {
        return (<div>{this.renderSetupDBForm()}</div>);
    }

    //Render functions

    renderSetupDBForm = () => {
        const form =
            <div class="setup_page_default_padding">
                <div class="setup_page_default_padding">--- Change Database Setup ---</div>
                <div class="setup_page_default_padding"></div>
                <form method="post" onSubmit={this.handleSubmit} class={`change_setup_border_${this.state.correctBoxCSS}`}>
                    <div class="setup_page_default_padding">
                        <button onClick={this.handleTestConnection} disabled={this.state.disableAll}>Test Database Connection</button>
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
                        <button type="submit" disabled={(!(this.state.correctBoxCSS === "success")) || this.state.disableAll}>
                            {!(this.state.correctBoxCSS === "success") ? "Please Test Connection..." : "Submit"}
                        </button>
                        <button onClick={this.handleCancel}>Cancel</button>
                    </div>
                    <div class="setup_page_default_padding" />
                </form>
            </div>
        return (form);
    }

    //Loader Methods

    loadDefault = () => {
        if (
            !(JSON.stringify(this.state.formControls) === JSON.stringify(this.props.defaultResult))) {
            this.setState({
                formControls: this.props.defaultResult
            })
        }
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
        }, (this.props.postResponse === '') ? undefined : this.props.setTopState({ postResponse: '' }))
    }

    handleCancel = e => {
        e.preventDefault()
        this.props.setTopState({ changeSetup: false, postResponse: '' })
    }

    handleTestConnection = e => {
        e.preventDefault()
        this.setState({ disableAll: true },
            () => {
                callAPI(
                    '/api/DBSetup/test-connection',
                    (data, err) => {
                        if (!err) {
                            if (data) {
                                this.setState({ correctBoxCSS: "success", testResponse: "Test Success!", disableAll: false })
                            } else {
                                this.setState({ correctBoxCSS: "failed", testResponse: "Test Failure.", disableAll: false })
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
                        testResponse: '',
                        correctBoxCSS: "untested"
                    }, this.props.setTopState({
                        postResponse: postResp
                    }))
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

export default SetupChangeForm;