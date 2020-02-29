import React, { Component } from 'react';
import {HomeButton, SignupButton} from '../elements/Buttons.js';
import SessionInfo from '../tools/ContentData.js';

class Login extends Component {

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
        SessionInfo.isAuth = true;
        SessionInfo.LoginUser = body;
        this.props.history.push('./collections');
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

export default Login;

