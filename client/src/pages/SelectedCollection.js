import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';
import readCurrURLParamsAsJSONString from '../tools/readCurrURLParamsAsJSONString'
import CardTable from '../elements/CardTable'
import CardSearchBox from '../elements/CardSearchBox'

const Inline = {
    border: '5px black solid',
    padding: '10px'
  };

class SelectedCollection extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            userID : SessionInfo.getSessionUserID(),
            userName: SessionInfo.getSessionUser(),
            collectionID : readCurrURLParamsAsJSONString().id,
            collectionName: readCurrURLParamsAsJSONString().name,
        }
    };

    componentDidMount() {
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
    }


    render() {
        return (<div>
            <p>{this.state.collectionName}</p>
            <div style={Inline}>
                <CardSearchBox/>
            </div>
            <div style={Inline}>
                <CardTable/>
            </div>
           
           
            </div>);
    }

}

export default SelectedCollection;
