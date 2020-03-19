import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';
import readCurrURLParamsAsJSONString from '../tools/ParamsReader'
import CardTable from '../elements/CardTable'
import CardSearchBox from '../elements/CardSearchBox'
import {CollectionButton} from '../elements/Buttons'

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

class SelectedCollection extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userID : SessionInfo.getSessionUserID(),
            userName: SessionInfo.getSessionUser(),
            collectionID: readCurrURLParamsAsJSONString().id,
            collectionName: readCurrURLParamsAsJSONString().name,
            CardTableProps: {
                collectionList: [],
                postResponse: 'Fetching data...'
            },
            CardTable: ''
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
                let newCardTableProps = {...this.state.CardTableProps}
                newCardTableProps.postResponse = 'You have no cards in collection.'
                newCardTableProps.collectionList = list
                if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.CardTableProps.collectionList))){
                    this.setState({
                        CardTableProps: newCardTableProps,
                        CardTable: <CardTable updateState={this.updateState} collectionList={newCardTableProps.collectionList} postResponse={this.state.CardTableProps.postResponse}/>
                    })
                }
            }  else { 
                let newCardTableProps = {...this.state.CardTableProps}
                newCardTableProps.postResponse = ''
                newCardTableProps.collectionList = list
                if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.CardTableProps.collectionList))){
                    this.setState({
                        CardTableProps: newCardTableProps,
                        CardTable: <CardTable updateState={this.updateState} collectionList={newCardTableProps.collectionList} postResponse={this.state.CardTableProps.postResponse}/>
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
                <div style={ExitButtonCSS}><CollectionButton></CollectionButton></div>
                <div style={InlineLeft}>
                    <CardSearchBox updateState={this.updateState}/>
                </div>
                <div style={InlineRight}>
                    <div style={{margin: '0 auto', width: '100%', 'text-align': 'center'}}>
                        <h1>{this.state.collectionName}</h1>
                        <p>{this.state.CardTableProps.collectionList[0] ? this.state.CardTableProps.collectionList[0].description: null}</p>
                        </div>
                    <p>{/*JSON.stringify(this.state.CardTableProps.collectionList)*/}</p>
                    {this.state.CardTable}
                </div>
            </div>  
        </div>);
    }

}

export default SelectedCollection;