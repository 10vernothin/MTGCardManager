import React, { useReducer, useEffect } from 'react';
import { HomeButton } from '../../common/elements/CommonButtons'
import './css/Home.css'
import callAPI from '../../common/functions/CallAPI'

/*
{
    "host": ,
    "port": ,
    "database": ,
    "user": ,
    "password": 
}
*/

/*
Implementing Hook Structure instead of Class Structure
*/

export default function HookedSetupPage() {

    //Initialize initial states
    const initState = {
        formControls: {
            host: { value: '' },
            port: { value: '' },
            database: { value: '' },
            user: { value: '' },
            password: { value: '' }
        },
        currentSettings: '',
        postResponse: ''
    }

    //Hook Functions

    const [state, setState] = useReducer((state, newState) => ({ ...state, ...newState }), initState)

    //ComponentDidMount
    useEffect(() => {
        loadDefault()
    }, [])

    //Render Functions
    const renderSetupDBForm = () => {
        const form =
            <div>
                <form method="post" onSubmit={handleSubmit}>
                    <title>Database Details</title>
                    <div>Current Settings: {state.currentSettings}</div>
                    <div>Change Setup</div>
                    <div>Host:
                <input type="text"
                            name="host"
                            value={state.formControls.host.value}
                            onChange={handleFormChange}
                        />
                :
                <input type="number"
                            name="port"
                            value={state.formControls.port.value}
                            onChange={handleFormChange}
                            min="0"
                            max="65535"
                        />
                    </div>
                    <div>Database:
                <input type="text"
                            name="database"
                            value={state.formControls.database.value}
                            onChange={handleFormChange}
                        />
                    </div>
                    <div>User:
                <input type="text"
                            name="user"
                            value={state.formControls.user.value}
                            onChange={handleFormChange}
                        />
                Password:
                <input type="password"
                            name="password"
                            value={state.formControls.password.value}
                            onChange={handleFormChange}
                        />
                        <button>Show Password</button>
                    </div>
                </form>
            </div>
        return (form);
    }

    //Handler Function

    const handleFormChange = e => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        return setState({
            formControls: {
                ...state.formControls,
                [name]: {
                    ...state.formControls[name],
                    value
                }
            }
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
    }

    //Loader Functions 
    const loadDefault = () => {
        callAPI('/api/getDBDetails', (data, err) => {
            if (err) {
                alert(err)
            } else {
                setState({
                    currentSettings: `{HOST = '${data.host.value}', PORT = ${data.port.value}, DB = '${data.database.value}', USER = '${data.user.value}'}`,
                    formControls: data
                })
            }
           
        })
    }

    //Page Construction
    const Page = () => {
        return (
            <div>
                <div><h1>Setup Database</h1></div>
                <div>{renderSetupDBForm()}</div>
                <div>
                    <button type="submit">Submit</button>
                    <HomeButton />
                    <button>Test Connection</button>
                </div>
                <div>
                    {state.postResponse}
                </div>
            </div>
        )
    }
    return (Page)
}
