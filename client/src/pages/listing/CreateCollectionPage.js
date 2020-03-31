import React, { Component } from 'react';
import {HomeButton, CollectionListButton} from '../../common/elements/CommonButtons'
import SessionInfo from '../../common/cached_data/SessionInfo';

 class CreateCollectionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formControls: { name: { value: '' },desc: { value: ''}},
            postResponse: '',
            userID: SessionInfo.getSessionUserID()
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        fetch('/api/collections/submit-creation-form', 
                { 
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json'},
                  body: JSON.stringify(this.state)
                }
              )
        .then((res) =>
        {
          return res.json();
        }).then ((res) =>
        {
            if (res === -2) {
                this.setState({postResponse: 'Collection not created.'})
            } else if (res === -1) {
                this.setState({postResponse: 'Name cannot be empty.'})
            } else if (res === -3) {
                this.setState({postResponse: 'Something wrong happened. Please relog in and try again.'})
            } else {
                this.props.history.push({
                    pathname: '/collections',
                    search: '?page=default',
                    state: {page: "default"}
                });
            }
        })
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
        return (<form method="post" onSubmit={this.handleSubmit}>
        <title>Create Collection</title>
          <div>Create a New Collection
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
          Description:
        </div>
        <textarea type="text" 
                name="desc" 
                value={this.state.formControls.desc.value} 
                onChange={this.changeHandler} 
                cols="35" 
                wrap="soft"
        />
        <div>
          <button type="submit">Submit</button>
          <HomeButton/>
          <CollectionListButton/>
        </div>
    {this.state.postResponse}
    </form>   );
    }
 };

export default CreateCollectionPage;