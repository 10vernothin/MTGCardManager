import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';
import readCurrURLParamsAsJSONString from '../tools/readCurrURLParamsAsJSONString'
import CardTable from '../elements/CardTable'
import CardSearchBox from '../elements/CardSearchBox'

const InlineLeft = {
    border: '1px black solid',
    display: 'inline-block',
    right: '75%',
    position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    padding: '0',
    margin: '0'
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
    margin: '0'
};

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
            }
        }
        this.updateState = this.updateState.bind(this)
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
    };

    componentDidMount() {
        this.fetchTable();
    }

    componentDidUpdate() {
        this.fetchTable();
    }

    fetchTable = () => {
        fetch('/api/collections/fetch-collection-id', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(list => {if (list.length === 0) {
            let newCardTableProps = {...this.state.CardTableProps}
            newCardTableProps.postResponse = 'You have no cards in collection.'
            newCardTableProps.collectionList = list
            if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.CardTableProps.collectionList))){
                this.setState({CardTableProps: newCardTableProps})
            }
        } else { 
            let newCardTableProps = {...this.state.CardTableProps}
            newCardTableProps.postResponse = ''
            newCardTableProps.collectionList = list
            if(!(JSON.stringify(newCardTableProps.collectionList) === JSON.stringify(this.state.CardTableProps.collectionList))){
                this.setState({CardTableProps: newCardTableProps})
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
        return (
        <div>
            <div>
                <div style={InlineLeft}>
                    <CardSearchBox updateState={this.updateState}/>
                </div>
                <div style={InlineRight}>
                    <div style={{margin: '0 auto', width: '100%', 'text-align': 'center'}}>
                        <h1>{this.state.collectionName}</h1>
                        </div>
                    <p>{/*JSON.stringify(this.state.CardTableProps.collectionList)*/}</p>
                    <CardTable updateState={this.updateState} collectionList={this.state.CardTableProps.collectionList} postResponse={this.state.CardTableProps.postResponse}/>
                </div>
            </div>  
        </div>);
    }

}

export default SelectedCollection;