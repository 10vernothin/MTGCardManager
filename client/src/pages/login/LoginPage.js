import React, { Component } from 'react';
import { HomeButton } from '../../common/elements/CommonButtons';
import SessionInfo from '../../common/cached_data/SessionInfo';
import { SignupButton } from './elements/Buttons';
import callAPI from '../../common/functions/CallAPI';

class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formControls: { name: { value: '' }, password: { value: '' } },
      postResponse: ''
    }
  }

  componentDidCatch(error) {
    alert("LoginPage " + error)
  }

  render() {
    return (this.renderLoginForm())
  }

  //Render Methods

  renderLoginForm = () => {
    return (
      <form method="post" onSubmit={this.handleSubmit}>
        <title>Login Form</title>
        <div>Login</div>
        <div>Name:</div>
        <input type="text"
          name="name"
          value={this.state.formControls.name.value}
          onChange={this.handleChange}
        />
        <div>Password:</div>
        <input type="password"
          name="password"
          value={this.state.formControls.password.value}
          onChange={this.handleChange}
        />
        <div>
          <button type="submit">Submit</button>
          <HomeButton />
          <SignupButton />
        </div>
        {this.state.postResponse}
      </form>
    );
  }

  //Handler Methods

  handleSubmit = e => {
    e.preventDefault();
    callAPI('/api/login/submit-form',
      (res, err) => {
        if (err) {
          this.setState({ postResponse: "Login Failed." })
        } else {
          const parsedbody = res;
          SessionInfo.setSessionState(true);
          SessionInfo.setLoginUser(parsedbody.username);
          SessionInfo.setLoginUserID(parsedbody.id);
          this.props.history.push({
            pathname: '/collections',
            search: '?page=default',
            state: { page: "default" }
          })
        }
      },
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      }
    )
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      formControls: {
        ...this.state.formControls,
        [name]: {
          ...this.state.formControls[name],
          value
        }
      }
    })
  }
}

export default LoginPage;