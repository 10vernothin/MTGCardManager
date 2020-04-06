import React, {Component} from 'react';
import {HomeButton, CollectionListButton} from '../../common/elements/CommonButtons'
import SessionInfo from '../../common/cached_data/SessionInfo'
import readCurrURLParamsAsJSON from '../../common/functions/ReadCurrURLParamsAsJSON'

class EditCollectionPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userID: SessionInfo.getSessionUserID(),
            collectionID: readCurrURLParamsAsJSON().id,
            formControls: {
                name: {value: ''},
                desc: {value: ''}
            },
            postResponse: ''
        }
    }

    componentDidMount() {
        this.defaultValue()
    }

    defaultValue = () => {
        fetch('/api/collections/getList',
        { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(this.state)
        }
        ).then((res) =>
            {return res.json();})
        .then((json) => {
            let obj = json.filter((item) =>item.id.toString() === this.state.collectionID)[0]
            let newFormControls = {...this.state.formControls}
            newFormControls.name.value = obj.name;
            newFormControls.desc.value = obj.description;
            this.setState({
                formControls: newFormControls
            })
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        fetch('/api/collections/edit-collection',
            { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            }
        ).then((resp) => {return resp.json()}).then((res) => {
            if (res === -2) {
                this.setState({postResponse: 'Collection not editted.'})
            } else if (res === -1) {
                this.setState({postResponse: 'Name cannot be empty.'})
            } else if (res === -3) {
                this.setState({postResponse: 'Collection not editted. Please go back to your collections, or login and try again.'})
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
        event.preventDefault()
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
        <title>Edit Collection</title>
        <div>Edit Collection</div>
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
}



export default EditCollectionPage;