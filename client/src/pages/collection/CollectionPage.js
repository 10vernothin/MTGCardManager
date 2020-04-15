import React, { Component } from 'react';
import SessionInfo from '../../common/cached_data/SessionInfo';
import readCurrURLParamsAsJSONString from '../../common/functions/ReadCurrURLParamsAsJSON'
import SearchBox from './elements/SearchBox'
import CollectionTable from './elements/CollectionTable'
import CollectionTableListForm from './elements/CollectionTableListForm'
import {CollectionListButton} from '../../common/elements/CommonButtons'
import {SwitchToFullViewButton, SwitchToListViewButton} from './elements/Buttons'
import './css/Collection.css'


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
            asList: true
        }
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
        this.updateState = this.updateState.bind(this)
    };

    componentDidCatch(error, info) {
        alert("CollectionPage " + error)
    }

    render() {
        this.loadTable();
        return (<div>
            {this.renderToolbar()}
            {this.renderSearchBar()}
            {this.renderCollectionBar()}
        </div>);
    }

    //Render Methods

    renderToolbar = () => {
        return(
            <div class='toolbar_buttons'>
                <div style={{display: 'inline-block'}}><CollectionListButton/></div>
                <div style={{display: 'inline-block'}}>{
                        !(this.state.asList)? 
                        <SwitchToListViewButton onClick={this.handleViewSwitch}/>: 
                        <SwitchToFullViewButton onClick={this.handleViewSwitch}/>
                    }
                </div>
            </div>
        )
    }

    renderSearchBar = () => {
        return(<div class='search_bar_main'><SearchBox updateState={this.updateState}/></div>)
    }

    renderCollectionBar = () => {
        return(
            <div class='collection_bar_main'>
                    <div class='collection_title'>
                        <h1>{this.state.collectionName}</h1>
                        <p>{this.state.cardTableProps.collectionList[0] ? this.state.cardTableProps.collectionList[0].description: null}</p>
                    </div>
                    <p>{/*JSON.stringify(this.state.cardTableProps.collectionList)*/}</p>
                    {this.state.cardTable}
            </div>
    )}

    //Loader Methods

    loadTable = () => {
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

    //Handler Methods
    
    handleViewSwitch = e => {
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

    // Binded Methods

    updateState = () => {this.setState({...this.state})}

}

export default CollectionPage;