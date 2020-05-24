import React, { Component } from 'react';
import callAPI from '../../../common/functions/CallAPI';

class CreateNewDBForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formControls: {
                database: { value: '' }
            },
            testResponse: '',
            correctBoxCSS: "untested",
            disableAll: false
        }
    }

    render() {
        return (<div>{this.renderCreateDBForm()}</div>);
    }

    //Render functions

    renderCreateDBForm = () => {
        const form =
            <div class="setup_page_default_padding">
                <div class="setup_page_default_padding">--- Create New Database ---</div>
                <div class="setup_page_default_padding"></div>
                <form method="post" onSubmit={this.handleSubmit} class={`change_setup_border_${this.state.correctBoxCSS}`}>
                    <div class="setup_page_default_padding">
                        <button onClick={this.handleTestConnection} disabled={this.state.disableAll}>
                            Test Name Availability
                        </button>
                        {this.state.testResponse}
                    </div>
                    <div class="setup_page_default_padding">New Database Name:
                    <input type="text"
                            name="database"
                            value={this.state.formControls.database.value}
                            onChange={this.handleChange}
                            disabled={this.state.disableAll}
                            placeholder="Insert name here." />
                    </div>
                    <div class="setup_page_default_padding">
                        <button type="submit" disabled={!(this.state.correctBoxCSS === "success") || this.state.disableAll}>
                            {!(this.state.correctBoxCSS === "success") ?
                                "Please Test Availabilty..." : "Submit (Database will be changed on Success)"}
                        </button>
                        <button onClick={this.handleCancel}>Cancel</button>
                    </div>
                    <div class="setup_page_default_padding" />
                </form>
            </div>
        return (form);
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
        this.setState({ disableAll: true }, () => {
            if (!this.state.formControls.database.value.match(/^[A-Za-z0-9_-]{5,}$/)) {
                this.setState({
                    correctBoxCSS: "failed",
                    testResponse: `Name Not Valid. 
                                (The name must be consisting of at least 5 alphanumeric characters, 
                                underscores and dashes.)`,
                    disableAll: false
                })
                return null
            }
            callAPI(
                '/api/DBSetup/test-db-availability',
                (data, err) => {
                    if (!err) {
                        if (data) {
                            this.setState({ correctBoxCSS: "success", testResponse: "Database Name Available!", disableAll: false })
                        } else {
                            this.setState({ correctBoxCSS: "failed", testResponse: "Database Name Taken.", disableAll: false })
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
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        let postResp;
        this.setState({ disableAll: true }, () => {
            callAPI(
                '/api/DBSetup/create-database',
                (data, err) => {
                    if (!err) {
                        if (data) {
                            postResp = 'Success! Database created.';
                        } else {
                            postResp = 'Setup Failed. Please try again.';
                        }
                        this.setState({
                            testResponse: '',
                            correctBoxCSS: "untested",
                            disableAll: false
                        }, this.props.setTopState({
                            postResponse: postResp
                        }))
                    } else {
                        alert(err)
                        postResp = 'Setup Failed. Please try again.';
                        this.setState({
                            testResponse: '',
                            correctBoxCSS: "failed",
                            disableAll: false
                        }, this.props.setTopState({
                            postResponse: postResp
                        }))
                    }
                },
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.state)
                }
            )
        })
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

export default CreateNewDBForm;