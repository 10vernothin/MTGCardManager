import React, { Component } from 'react';
import SessionInfo from '../../common/cached_data/SessionInfo';
import readCurrURLParamsAsJSONString from '../../common/functions/read-url-params'
import SearchBox from './elements/SearchBox'
import CollectionTable from './elements/CollectionTable'
import CollectionTableListForm from './elements/CollectionTableListForm'
import {CollectionListButton} from '../../common/elements/CommonButtons'
import {SwitchToFullViewButton, SwitchToListViewButton} from './elements/Buttons'

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
            cardTable: '',
            asList: false
        }
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
        this.updateState = this.updateState.bind(this)
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
            let newCardTableProps = {...this.state.cardTableProps}
            if (list.length === 0) {
                newCardTableProps.postResponse = 'You have no cards in collection.'
            }
            else {
                newCardTableProps.postResponse = ''
            }
            newCardTableProps.collectionList = list
            if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.cardTableProps.collectionList))){
                (!this.state.asList)?
                this.setState({
                    cardTableProps: newCardTableProps,
                    cardTable: <CollectionTable 
                                    updateState={this.updateState} 
                                    collectionList={newCardTableProps.collectionList} 
                                    postResponse={this.state.cardTableProps.postResponse}
                                />
                }):
                this.setState({
                    cardTableProps: newCardTableProps,
                    cardTable: <CollectionTableListForm 
                                    updateState={this.updateState} 
                                    collectionList={newCardTableProps.collectionList} 
                                    postResponse={this.state.cardTableProps.postResponse}
                                />
                })
            }
        })
      }


    /*Binding a listener to this element*/
    updateState = () => { this.setState({ userName: SessionInfo.getSessionUser()})}
   
    switchView = e => {
        e.preventDefault()
        this.setState( {
            asList: !this.state.asList,
            cardTable: (this.state.asList)? <CollectionTable 
                updateState={this.updateState} 
                collectionList={this.state.cardTableProps.collectionList} 
                postResponse={this.state.postResponse}
            />: <CollectionTableListForm 
                updateState={this.updateState} 
                collectionList={this.state.cardTableProps.collectionList} 
                postResponse={this.state.postResponse}/>
        })
    }

    render() {
        this.fetchTable();
        return (
        <div>
            <div>
                <div style={ExitButtonCSS}>
                <div style={{display: 'inline-block'}}><CollectionListButton/></div>
                <div style={{display: 'inline-block'}}>{
                    !(this.state.asList)? 
                    <SwitchToListViewButton onClick={this.switchView}/>: 
                    <SwitchToFullViewButton onClick={this.switchView}/>
                }
                </div>
                </div>
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