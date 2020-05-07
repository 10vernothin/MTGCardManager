import React, { useReducer } from 'react';
import { Redirect } from 'react-dom';
import { HomeButton } from '../../common/elements/CommonButtons';
import SessionInfo from '../../common/cached_data/SessionInfo';
import { SignupButton } from './elements/Buttons';
import callAPI from './../../common/functions/CallAPI';

export default function HookedLoginPage() {

  const initState = {
    formControls: { name: { value: '' }, password: { value: '' } },
    postResponse: '',
    redirect: false
  }
  const [state, setState] = useReducer((state, newstate) => ({ ...state, ...newstate }), initState)

  //Render Methods

  const renderLoginForm = () => {
    return (
      <form method="post" onSubmit={handleSubmit}>

        <title>Login Form</title>
        <div>Login</div>
        <div>Name:</div>
        <input type="text"
          name="name"
          value={state.formControls.name.value}
          onChange={handleFormChange}
        />
        <div>Password:</div>
        <input type="password"
          name="password"
          value={state.formControls.password.value}
          onChange={handleFormChange}
        />
        <div>
          <button type="submit">Submit</button>
          <HomeButton />
          <SignupButton />
        </div>
        {state.postResponse}
      </form>
    );
  }

  //Handler Methods

  const handleSubmit = e => {
    e.preventDefault();
    callAPI('/api/login/submit-form',
      loginThenRedirect,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      })
  }


  const handleFormChange = e => {
    e.preventDefault()
    const name = e.target.name;
    const value = e.target.value;
    setState({
      formControls: {
        ...state.formControls,
        [name]: {
          ...state.formControls[name],
          value
        }
      }
    })
  }

  const loginThenRedirect = (data, err) => {
    if (err) {
      setState({ postResponse: "Username or Password incorrect." });
    } else {
      SessionInfo.setSessionState(true);
      SessionInfo.setLoginUser(data.username);
      SessionInfo.setLoginUserID(data.id);
      setState({ redirect: true });
    }
  }

  const Page = () => {
    return (renderLoginForm())
  }

  if (state.redirect) {
    return (<Redirect to='/collections?page=default'/>)
  } else {
    return (Page)
  }
}
