import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {} from '../elements/Buttons';

class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>MTG Card Manager</h1>
      {/* Link to List.js */}
      <Link to={'./list'}>
        <button variant="raised">
            Users
        </button>
      </Link>
	  <Link to={'./login'}>
        <button variant="raised">
            Login
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;