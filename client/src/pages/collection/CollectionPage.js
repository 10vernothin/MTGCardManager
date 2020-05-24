import React, { Component } from 'react';
import SessionInfo from '../../common/cached_data/SessionInfo';
import { CollectionListButton } from '../../common/elements/CommonButtons';
import readCurrURLParamsAsJSONString from '../../common/functions/ReadCurrURLParamsAsJSON';
import './css/Collection.css';
import { SwitchToFullViewButton, SwitchToListViewButton } from './elements/Buttons';
import CollectionTable from './elements/CollectionTable';
import CollectionTableListForm from './elements/CollectionTableListForm';
import SearchBox from './elements/SearchBox';
import callAPI from '../../common/functions/CallAPI'

class CollectionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userID: SessionInfo.getSessionUserID(),
            userName: SessionInfo.getSessionUser(),
            collectionID: readCurrURLParamsAsJSONString().id,
            collectionName: '',
            description: '',
            cardTableProps: {
                collectionList: [],
                postResponse: 'Fetching data...'
            },
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
            {this.renderButtonMenu()}
            {this.renderSearchBar()}
            {this.renderCollectionBar()}
        </div>);
    }

    //Render Methods

    renderButtonMenu = () => {
        return (
            <div class='toolbar_buttons'>
                <div style={{ display: 'inline-block' }}><CollectionListButton /></div>
                <div style={{ display: 'inline-block' }}>{
                    !(this.state.asList) ?
                        <SwitchToListViewButton onClick={this.handleViewSwitch} /> :
                        <SwitchToFullViewButton onClick={this.handleViewSwitch} />
                }
                </div>
            </div>
        )
    }

    renderSearchBar = () => {
        return (<div class='search_bar_main'><SearchBox updateState={this.updateState} /></div>)
    }

    renderCollectionBar = () => {
        return (
            <div class='collection_bar_main'>
                <div class='collection_title'>
                    <h1>{this.state.collectionName}</h1>
                    <p>{this.state.description}</p>
                </div>
                {this.renderCardTable()}
            </div>
        )
    }

    renderCardTable = () => {
        return (
            <div>
                {!this.state.asList ?
                    <CollectionTable
                        updateState={this.updateState}
                        collectionList={this.state.cardTableProps.collectionList}
                        postResponse={this.state.postResponse}
                    /> :
                    <CollectionTableListForm
                        updateState={this.updateState}
                        collectionList={this.state.cardTableProps.collectionList}
                        postResponse={this.state.postResponse}
                    />
                }
            </div>)
    }

    //Loader Methods

    loadTable = () => {
        callAPI('/api/collections/fetch-collection-by-id',
            (response, err) => {
                if (err) {
                    alert(err)
                } else {
                    let newCardTableProps = {
                        ...this.state.cardTableProps,
                        postResponse: (response.list.length === 0) ? 'You have no cards in collection.' : '',
                        collectionList: response.list
                    }
                    if ((!(JSON.stringify(response.list) === JSON.stringify(this.state.cardTableProps.collectionList))
                        || this.state.collectionName === '')) {
                        this.setState({
                            cardTableProps: newCardTableProps,
                            collectionName: response.name,
                            description: response.description,
                        })
                    }
                }
            },
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            })
    }

    //Handler Methods

    handleViewSwitch = e => {
        e.preventDefault()
        this.setState({
            asList: !this.state.asList
        })
    }

    //
    // Binded Methods
    updateState = () => { this.setState({ ...this.state }) }

}

export default CollectionPage;