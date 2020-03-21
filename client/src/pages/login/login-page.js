import React, { Component } from 'react';
import {HomeButton} from './../../common/elements/common-buttons';
import SessionInfo from '../../common/cached_data/session-info';
import {SignupButton} from './elements/login-buttons';

class LoginPage extends Component {

  constructor(props){
      super(props);
      this.state = {
          formControls: { name: { value: '' },password: { value: ''}},
          postResponse: ''
      }
  }

  handleSubmit = e => {
    e.preventDefault();
    fetch('/api/login/submit-form', 
            { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify(this.state)
            }
          )
    .then((res) =>
    {
      return res.text();
    })
    .then((body) => {
      if (body === "Username or Password incorrect.")
      {
        this.setState({ postResponse: body});    
      } else {
        const parsedbody = JSON.parse(body);
        SessionInfo.setSessionState(true);
        SessionInfo.setLoginUser(parsedbody.username);
        SessionInfo.setLoginUserID(parsedbody.id);
        this.props.history.push({
          pathname: '/collections',
          search: '?page=default',
          state: {page: "default"}
        });
      }});
  }

  changeHandler = event => {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({
        formControls: {
            ...this.state.formControls,
            [name]: {
            ...this.state.formControls[name],
            value
      }}});
  }

  render() {
      return (
		  <form method="post" onSubmit={this.handleSubmit}>
              <title>Login</title>
				<div>Login
				</div>
              <div>
                Name:
              </div>
              <input type="text" 
                     name="name" 
                     value={this.state.formControls.name.value} 
                     onChange={this.changeHandler} 
              />
              <div>
                Password:
              </div>
              <input type="password" 
                     name="password" 
                     value={this.state.formControls.password.value} 
                     onChange={this.changeHandler} 
              />
              <div>
                <button type="submit">Submit</button>
                <HomeButton/>
                <SignupButton/>
              </div>
          {this.state.postResponse}
          </form>   
      );
  }

}

export default LoginPage;