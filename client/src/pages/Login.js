import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Login extends Component {

  constructor(props){
      super(props);
      this.state = {
          formControls: {
              name: {
                value: ''
              },
              password: {
                value: ''
              }
          },
      postResponse: '',
      }
  }
      
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/login/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
	  body: JSON.stringify(this.state)
    });
    const body = await response.text();
    if (body === "Username or Password incorrect.") {
      this.setState({ postResponse: body});
    } else {
        this.props.history.push("/collections");
    }
    
  };
  
  changeHandler = event => {
      
      const name = event.target.name;
      const value = event.target.value;
    
      this.setState({
        formControls: {
            ...this.state.formControls,
            [name]: {
            ...this.state.formControls[name],
            value
          }
        }
      });
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
                <Link to={'./signup'}><button type= "button">Create New Account</button></Link>
                <Link to={'./'}><button type= "button">Home</button></Link>
              </div>
          <p>{this.state.postResponse}</p>
          </form>   
      );
  }

}

export default Login;

