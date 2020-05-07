import React, { Component } from 'react';
import { HomeButton } from '../../common/elements/CommonButtons';
import './css/Home.css'

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
            formControls: { host: { value: '' }, port: { value: '' }, database: { value: '' }, user: { value: '' }, password: { value: '' } },
            currentSetting: '',
            postResponse: ''
        }
    }

    componentDidMount() {
        this.loadDefault()
    }

    render() {
        return (
            <div>
                <div><h1>Setup Database</h1></div>
                <div>{this.renderSetupDBForm()}</div>
                <div>
                    <button type="submit">Submit</button>
                    <HomeButton />
                    <button>Test Connection</button>
                </div>
                <div>
                    {this.state.postResponse}
                </div>

            </div>
        );
    }

    //Render functions

    renderSetupDBForm() {
        const form =
            <div>
                <form method="post" onSubmit={this.handleSubmit}>
                    <title>Database Details</title>
                    <div>Current Settings: {this.state.currentSetting}</div>
                    <div>Change Setup</div>
                    <div>Host:
                    <input type="text"
                            name="name"
                            value={this.state.formControls.host.value}
                            onChange={this.handleChange}
                        />
                    :
                    <input type="number"
                            name="port"
                            value={this.state.formControls.port.value}
                            onChange={this.handleChange}
                            min = "0"
                            max = "65535"
                        />
                    </div>
                    <div>Database:
                    <input type="text"
                            name="database"
                            value={this.state.formControls.database.value}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div>User:
                    <input type="text"
                            name="user"
                            value={this.state.formControls.user.value}
                            onChange={this.handleChange}
                        />
                    Password:
                    <input type="password"
                            name="password"
                            value={this.state.formControls.password.value}
                            onChange={this.handleChange}
                    />
                    <button>Show Password</button>
                    </div>
                </form>
            </div>
        return (form);
    }

    //Loader Methods

    loadDefault = () => {
        fetch('/api/getDBDetails').then((res)=>{return res.json()}).then((result)=>{
            if (!(JSON.stringify(result) === JSON.stringify(this.state.formControls))) {
                this.setState( {
                    formControls: result,
                    currentSetting: `{HOST = '${result.host.value}',
                                    PORT = ${result.port.value},
                                     DB = '${result.database.value}',
                                     USER = '${result.user.value}'}`
                })
            }
        })
    }

    //Handler Methods

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
          formControls: {
              ...this.state.formControls,
              [name]: {
              ...this.state.formControls[name],
              value
    }}})}
}

export default SetupPage;