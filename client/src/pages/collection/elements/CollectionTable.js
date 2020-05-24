import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo';
import CollectionTableElement from './CollectionTableElement';
import CollectionPageNavPanel from './CollectionPageNavPanel'

/*
CollectionTable renders a table that contains all the cards in a user's collection
*/
class CollectionTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: SessionInfo.getSessionUser(),
        userID: SessionInfo.getSessionUserID(),
        collectionID: SessionInfo.getCollectionID(),
        collectionName: SessionInfo.getCollectionName(),
        page: 1,
        elemPerPage: 10,
        disableAll: false
        }
  }

  componentDidCatch(error, info) {
    alert("CollectionTable " + error + " " + JSON.stringify(info))
  }
 
  render() {
    return(
      <div>
        {this.renderNavPanel()}
        {this.renderTableTitle()}
        {this.renderTableBody()}
      </div>
    )
  }

  //Render Methods

  renderNavPanel = () => {
    return(<div>
      <CollectionPageNavPanel 
        handleChangeAnyPage = {this.handleChangeAnyPage.bind(this)}
        currPage={this.state.page}
        elemPerPage={this.state.elemPerPage}
        totalElems={this.props.collectionList.length}
        disableAll= {this.state.disableAll}

      />
      </div>
      )
  } 

  renderTableTitle = () => {
    return(
    <div class='collection_table_title'>
      <div style={{flex: 3}}></div>
      <div style={{flex: 1}}>NO.</div>
      <div style={{flex: 2}}>CARD NAME</div>
      <div style={{flex: 2}}>MANA</div>
      <div style={{flex: 1}}>RARITY</div>
      <div style={{flex: 3}}>TYPE</div>
      <div style={{flex: 3}}>SET</div>
      <div style={{flex: 1}}>ID</div>
      <div style={{flex: 1}}>FOIL</div>
      <div style={{flex: 1}}>PRICE</div>
      <div style={{flex: 1}}>AMT</div>
      <div style={{flex: 1}}></div>
      <div style={{flex: 1}}></div>
    </div>
  )}

  renderTableBody = () => {
    if (!(this.props.collectionList.length === 0)) {
      /*deep copying the prop and sorting it (use fast data-loss copy since everything is JSON)*/
      var list = this.loadSortedList()

      return (
        <div>
          {this.renderTableElems(list)}
          {this.renderNavPanel()}
        </div>
        )
    } else {
      return(<div>You have no cards in collection.</div>)
    }
  }

  renderTableElems = (list) => {
    var currCSS = 'collection_result_gray'
    return(
        list.map((info, index) => {
          currCSS = (currCSS === 'collection_result_gray')? 'collection_result_white': 'collection_result_gray'
          if ((index < this.state.page*this.state.elemPerPage) && (index >= (this.state.page-1)*this.state.elemPerPage)) {
            return (
            <CollectionTableElement 
              id_key={index+1}
              cardInfo={info}
              resBoxCSS={currCSS} 
              updateTopmostState={this.props.updateState}/>
            )
          } else {
            return (null)
          }
        })
  )}

  //Loader Methods

  loadSortedList = () => {
    var list = JSON.stringify(this.props.collectionList).valueOf()
    list = JSON.parse(list)
    list.sort((a,b) => {return (a.card_name.localeCompare(b.card_name) || a.set_code.localeCompare(b.set_code) || a.is_foil-b.is_foil)})
    return list
  }

  //Binded Methods

  handleChangeAnyPage = (pageNumber) => {
    this.setState({
      page: pageNumber
    })
  }

}

export default CollectionTable;