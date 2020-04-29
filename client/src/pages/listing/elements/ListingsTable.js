import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo'
import ListingsTableElem from './ListingsTableElem';


class ListingsTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
        collectionList: [],
        username: SessionInfo.getSessionUser(),
        userID: SessionInfo.getSessionUserID(),
        postresponse: 'Fetching Data...'
  }}

  componentDidCatch(error) {
    alert("ListingsTable " + error)
  }

  render(){
      this.loadList();
      const list = this.state.collectionList;
      return (
      <div>
        {list.length ? 
        (<div>
              {this.renderListingTitle()}
              {this.renderListingItems()}
        </div>)
        :(<div></div>)}
        <h2>{this.state.postresponse}</h2>
      </div>
      )
  }

  //Render Methods

  renderListingTitle = () => {
    return(
    <div class='listing_title'>
      <div style={{flex: 2}}/>
      <div style={{flex: 2}}>Name</div>
      <div style={{flex: 7}}>Description</div>
      <div style={{flex: 1}}>Cards</div>
      <div style={{flex: 1}}>Price</div>
      <div style={{flex: 2}}>Options</div>
      <div style={{flex: 2}}>Download Collection</div>
    </div>
  )}

  renderListingItems = () => {
    let currCSS = 'listing_elem_gray'
    return(
      this.state.collectionList.map((item) => {
        currCSS = (currCSS === 'listing_elem_gray')? 'listing_elem_white': 'listing_elem_gray'
        if (!(item.name === '')){
        return(
          <ListingsTableElem 
            link_url={`/collections?page=selected&id=${item.id}&name=${encodeURIComponent(item.name)}`}
            edit_url={`/collections?page=edit&id=${item.id}&name=${encodeURIComponent(item.name)}`}
            item = {item}
            id_key = {item.id}
            currCSS = {currCSS}
            updateTopmostState={this.props.updateState}/>
          )
        } else {
          return(null);
        }
  }))}
    

  //Loader Methods
  
  loadList = () => {
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
  }})}

}

export default ListingsTable;
