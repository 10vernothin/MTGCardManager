import React, { Component } from 'react';
import SessionInfo from '../../common/cached_data/session-info';
import readCurrURLParamsAsJSONString from '../../common/functions/read-url-params'
import SearchBox from './elements/search-box'
import CollectionTable from './elements/collection-table'
import {CollectionListButton} from '../../common/elements/common-buttons'

const InlineLeft = {
    border: '1px black solid',
    display: 'inline-block',
    right: '75%',
    position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    padding: '0',
    margin: '0',
    'z-index': '1'
};
const InlineRight = {
    overflow: 'auto',
    border: '1px black solid',
    display: 'inline-block',
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '25%',
    padding: '0',
    margin: '0',
    'z-index': '1'
};

const ExitButtonCSS = {
    position: 'fixed',
    right: '20px',
    'z-index': '3'
}

class CollectionPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userID : SessionInfo.getSessionUserID(),
            userName: SessionInfo.getSessionUser(),
            collectionID: readCurrURLParamsAsJSONString().id,
            collectionName: readCurrURLParamsAsJSONString().name,
            cardTableProps: {
                collectionList: [],
                postResponse: 'Fetching data...'
            },
            cardTable: ''
        }
        this.updateState = this.updateState.bind(this)
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
    };


    fetchTable = () => {
        fetch('/api/collections/fetch-collection-id', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(list => {
            if (list.length === 0) {
                let newCardTableProps = {...this.state.cardTableProps}
                newCardTableProps.postResponse = 'You have no cards in collection.'
                newCardTableProps.collectionList = list
                if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.cardTableProps.collectionList))){
                    this.setState({
                        cardTableProps: newCardTableProps,
                        cardTable: <CollectionTable updateState={this.updateState} collectionList={newCardTableProps.collectionList} postResponse={this.state.cardTableProps.postResponse}/>
                    })
                }
            }  else { 
                let newCardTableProps = {...this.state.cardTableProps}
                newCardTableProps.postResponse = ''
                newCardTableProps.collectionList = list
                if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.cardTableProps.collectionList))){
                    this.setState({
                        cardTableProps: newCardTableProps,
                        cardTable: <CollectionTable updateState={this.updateState} collectionList={newCardTableProps.collectionList} postResponse={this.state.cardTableProps.postResponse}/>
                    })
                }
        }
        })
      }

      /*Binding a listener for the child component*/
      updateState = () => {
            //alert("Updating top")
            this.setState({
                userName: SessionInfo.getSessionUser()
            })
      }
   

    render() {
        this.fetchTable();
        return (
        <div>
            <div>
                <div style={ExitButtonCSS}><CollectionListButton/></div>
                <div style={InlineLeft}>
                    <SearchBox updateState={this.updateState}/>
                </div>
                <div style={InlineRight}>
                    <div style={{margin: '0 auto', width: '100%', 'text-align': 'center'}}>
                        <h1>{this.state.collectionName}</h1>
                        <p>{this.state.cardTableProps.collectionList[0] ? this.state.cardTableProps.collectionList[0].description: null}</p>
                        </div>
                    <p>{/*JSON.stringify(this.state.cardTableProps.collectionList)*/}</p>
                    {this.state.cardTable}
                </div>
            </div>  
        </div>);
    }

}

export default CollectionPage;