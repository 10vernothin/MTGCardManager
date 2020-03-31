import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class DownloadBulkDataButton extends Component {
  //Button that downloads Scryfall data. Should only be accessed at most once per day, and will be disabled otherwise

  /*Constructor*/
  constructor(props) {
    super(props);
    this.state = {
      disabled: true
    }
  }

  //Checks if the data needs updating. The button will be enabled only if it does needs updating.
  componentDidMount() {
    fetch('/api/fetch-card/check-updateable')
    .then((res) =>{return res.json()})
    .then((ress) => 
      {if (ress === -1) { 
        this.setState({disabled: false});
      } else {
        this.setState({disabled: true});
      }});
  }

  //Changes the button text to reflect status of data
  ButtonTextChange = () => {
    if (!(this.state.disabled)) {
      return "Update Scryfall Data";
    } else {
      return "Data Up to Date"
    }
  }

  render (){
    return (<Link to={'./downloads?func=fetch-card%2Fdownload-bulk-data'}><button type= "button" disabled= {this.state.disabled} >{this.ButtonTextChange()}{this.state.disabled}</button></Link>);
  }
}

export {  
  DownloadBulkDataButton
};