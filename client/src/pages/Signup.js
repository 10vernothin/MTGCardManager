import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {HomeButton} from '../elements/Buttons'


class Signup extends Component {
  
  constructor(props){
      super(props);
      this.state = {
          formControls: {
              name: {
                value: ''
              },
              password: {
                value: ''
              },
              email: {
                value: ''
              }
          },
		  postResponse: ''
      }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/create-new-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
	  body: JSON.stringify(this.state)
    });
    const body = await response.text();
    this.setState({ postResponse: body});
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
              <title>Signup</title>
				<div>
                    Sign Up Today!
				</div>
                <div>
                Email:
                </div>
                <input  type="text" 
                        name="email" 
                        value={this.state.formControls.email.value} 
                        onChange={this.changeHandler} 
                />
              <div></div>
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
                <Link to={'./login'}><button type= "button">Back</button></Link>
              </div>
          <p>{this.state.postResponse}</p>
          </form>      
      );
  }

}

export default Signup;

