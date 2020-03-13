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
            collectionID : readCurrURLParamsAsJSONString().id,
            collectionName: readCurrURLParamsAsJSONString().name,
        }
    };

    componentDidMount() {
        SessionInfo.setCollectionName(this.state.collection);
        SessionInfo.setCollectionID(this.state.collectionID);
    }


    render() {
        return (
        <div>
            <div>
                <div style={InlineLeft}>
                    <CardSearchBox/>
                </div>
                <div style={InlineRight}>
                    <p>{this.state.collectionName}</p>
                    <CardTable/>
                </div>
            </div>  
        </div>);
    }

}

export default SelectedCollection;
