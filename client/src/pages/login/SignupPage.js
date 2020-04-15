import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {HomeButton} from '../../common/elements/CommonButtons'


class SignupPage extends Component {
  
  constructor(props){
    super(props);
    this.state = {
        formControls: { name: {value: ''}, password: {value: ''}, email: {value: ''}},
        postResponse: ''
  }}

  render() {
    return(this.renderSignupForm())
  }

  //Render Methods

  renderSignupForm = () => {
    return (
		  <form method="post" onSubmit={this.handleSubmit}>
        <title>Signup Form</title>
				<div>Sign Up Today!</div>
        <div>Email:</div>
        <input  type="text" 
                name="email" 
                value={this.state.formControls.email.value} 
                onChange={this.handleChange} 
        />
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
          <HomeButton/>
          <Link to={'./login'}><button type= "button">Back</button></Link>
        </div>
        <p>{this.state.postResponse}</p>
      </form>      
  );}

  //Handler Methods
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/create-new-user', 
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.state)
    });
    const body = await response.text();
    this.setState({ postResponse: body});
  };
  
  handleChange = e => { 
      const name = e.target.name;
      const value = e.target.value;
      this.setState({
        formControls: {
            ...this.state.formControls,
            [name]: {
            ...this.state.formControls[name],
            value
  }}});}

}

export default SignupPage;

