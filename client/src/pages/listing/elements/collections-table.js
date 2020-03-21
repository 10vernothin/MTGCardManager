import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/session-info'
import {EditCollectionButton, SelectCollectionButton, DeleteCollectionButton} from './collection-list-buttons'

const collectionTitleCSS = {
  width: '90%',
  display: 'flex',
  margin: '0 auto',
  'border-bottom': '1px solid black',
  'text-align': 'left',
  'font-weight': 'bold'
}

const collectionCSS = {
  width: '90%',
  display: 'flex',
  margin: '0 auto',
  'text-align': 'left'
}

class CollectionsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionList: [],
            username: SessionInfo.getSessionUser(),
            userID: SessionInfo.getSessionUserID(),
            postresponse: 'Fetching Data...'
        }
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
      } else { 
        if (!(JSON.stringify(this.state.collectionList) === JSON.stringify(list))) {
          this.setState({ collectionList: list, postresponse: '' })}
        }
      })
    }

    render(){
        this.getList();
        const list = this.state.collectionList;
        return (
        <div>
        {list.length ? (
          <div>
              <div style={collectionTitleCSS}>
                  <div style={{flex: 2}}>Name</div>
                  <div style={{flex: 7}}>Description</div>
                  <div style={{flex: 1}}>Price</div>
                  <div style={{flex: 2}}>Options</div>
                  <div style={{flex: 2}}>Download Collection</div>
              </div>
              {/* Render the list of items */}
              {this.state.collectionList.map((item) => {
                if (!(item.name === '')){
                return(
                  <div style={collectionCSS}>
                      <div style={{flex: 2}}>{item.name}</div>
                      <div style={{flex: 7}}>{item.description}</div>
                      <div style={{flex: 1}}>${item.sum}</div>
                      <div style={{flex: 2}}>
                            <SelectCollectionButton link_url={`/collections?page=selected&id=${item.id}&name=${encodeURIComponent(item.name)}`}/>
                            <EditCollectionButton link_url={`/collections?page=edit&id=${item.id}&name=${encodeURIComponent(item.name)}`}/>
                            <DeleteCollectionButton col_id={item.id} updateState={this.props.updateState}/>
                      </div>
                      <div style={{flex: 2}}></div>
                  </div>)
                } else {
                  return(null);
                }
              })}
          </div>
          ) :(
            <div></div>
          )
        }
        <h2>{this.state.postresponse}</h2>
        </div>
        )
    }
}

export default CollectionsTable;
