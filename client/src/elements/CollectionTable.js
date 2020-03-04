import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData'
import {SelectCollectionButton, EditCollectionButton, DeleteCollectionButton} from '../elements/Buttons'


class CollectionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionList: [],
            username: SessionInfo.getSessionUser(),
            userID: SessionInfo.getSessionUserID(),
            postresponse: 'Fetching Data...'
        }
    }

    componentDidMount() {
        this.getList();
      }
    
      // Retrieves the list of items from the Express app
      getList = () => {
        fetch('/api/collections/getList', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(list => {if (list.length === 0) {
          this.setState({postresponse: 'You have no collections. =('})
        } else { this.setState({ collectionList: list, postresponse: '' })}
        })
      }

    render(){
        const list = this.state.collectionList;
        return (
        <div>
        {list.length ? (
              <table>
                <tr>
                  <td>Name</td>
                  <td>Description</td>
                  <td>Options</td>
                </tr>
              {/* Render the list of items */}
              {this.state.collectionList.map((item) => {
                if (!(item.name === '')){
                return(
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>
                          <SelectCollectionButton onclick = {() => this.CollectionSelected()}/>
                          <EditCollectionButton/>
                          <DeleteCollectionButton/>
                      </td>
                    </tr>
                );
                } else {
                  return null;
                }
              })}
              </table>
          ) :(
            <div></div>
          )
        }
        <h2>{this.state.postresponse}</h2>
        </div>
        )
    }
}

export default CollectionTable;
