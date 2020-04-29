import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class CreateCollectionButton extends Component {
    //Button that links to the Create New Collection page
    render() {
      return (<Link to={'./collections?page=create-new-collection'}><button type= "button">Create New Collection</button></Link>);
    }
}

class SelectCollectionButton extends Component {
    //Button that accesses the chosen Collection
    render() {
        return(
            <Link to={this.props.link_url}>
                <button type= "button">Select</button>
            </Link>
        );
    }
}

class EditCollectionButton extends Component {
  
    //Button that accesses the chosen Collection for deletion
    render() {
        return (
            <Link to={this.props.link_url}>
                <button type= "button">Edit</button>
            </Link>
        );
    }
}

class PopupButton extends Component {
  render() {
    let button = <button type= "button" onClick={this.props.popup}>{this.props.text}</button>
    return (button);
  }
}

class DeleteCollectionButton extends Component {
    //Button that deletes the chosen collection 
    constructor(props) {
      super(props)
      this.state = {
        id: this.props.col_id
      }
    }
    

    deleteCollection = e => {
      e.preventDefault()
      fetch('/api/collections/delete-collection',
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({collectionID: this.state.id})
      }
      ).then(
        ()=> {
          this.props.updateTopmostState()
        }
      )
    }
  
    render() {
      if (!(this.state.id === this.props.col_id)) {
        this.setState({id: this.props.col_id})
        return (null)
      } else {
        return (<button type= "button" onClick={this.deleteCollection}>Delete</button>);
      }
      
    }
}

export {
    CreateCollectionButton,
    PopupButton,
    SelectCollectionButton,
    DeleteCollectionButton,
    EditCollectionButton
};