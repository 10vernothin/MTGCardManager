import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/session-info';

class CollectionTableListForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
          username: SessionInfo.getSessionUser(),
          userID: SessionInfo.getSessionUserID(),
          collectionID: SessionInfo.getCollectionID(),
          collectionName: SessionInfo.getCollectionName(),
          page: 1,
          elemPerPage: 50,
          lastDisabled: true,
          nextDisabled: true,
          currIndex: 'Name'
          }
        this.sortIndices = ['Name', 'Type', 'CMC', 'Color', 'Price']
    }
  
    handleNextPage = e => {
      e.preventDefault()
      let nextPage = this.state.page+1;
      let nextLastDisabled, nextNextDisabled = false;
      this.props.collectionList.length > (nextPage)*(this.state.elemPerPage)? nextNextDisabled = false: nextNextDisabled = true;
      nextPage > 1? nextLastDisabled = false: nextLastDisabled = true;
      this.setState({
        page: nextPage,
        lastDisabled: nextLastDisabled,
        nextDisabled: nextNextDisabled
      })
    }
  
    handleLastPage = e => {
      e.preventDefault()
      let nextPage = this.state.page-1;
      let nextLastDisabled, nextNextDisabled = false;
      this.props.collectionList.length > (nextPage)*(this.state.elemPerPage)? nextNextDisabled = false: nextNextDisabled = true;
      nextPage > 1? nextLastDisabled = false: nextLastDisabled = true;
      this.setState({
        page: nextPage,
        lastDisabled: nextLastDisabled,
        nextDisabled: nextNextDisabled
      })
    }
  
    renderPageNav = () => {
      return(
        <div style={{margin:'0 auto', width: '100%', 'text-align': 'center'}}>
          <div style={{display: 'inline-block', width: '10%', margin: 'auto 0'}}>
            <button onClick={this.handleLastPage} disabled={this.state.lastDisabled}>Previous Page</button>
          </div>
        <div style={{display: 'inline-block', width: '80%', margin: 'auto 0'}}>
          <p>Page {this.state.page}/{Math.ceil(this.props.collectionList.length/this.state.elemPerPage)}</p>
        </div>
        <div style={{display: 'inline-block', width: '10%', margin: 'auto 0'}}>
          <button onClick={this.handleNextPage} disabled={this.state.nextDisabled}>Next Page</button>
        </div>
      </div>
      )
    }
  

    renderSortByDropDown = () => {
        
    }
    renderTable = () => {
      if (!(this.props.collectionList.length === 0)) {
        /*deep copying the prop and sorting it (use fast data-loss copy since everything is JSON)*/
        let list = JSON.stringify(this.props.collectionList).valueOf()
        list = JSON.parse(list)
        list.sort((a,b) => {return (a.name.localeCompare(b.name) || a.set.localeCompare(b.set) || a.is_foil-b.is_foil)})
        let CSSIter = 0

        return (
          <div>
            {this.renderPageNav()}
            {this.renderSortByDropDown()}
            {
            list.map((info, index) => {
              CSSIter === 1? CSSIter = 0: CSSIter = 1
              if ((index < this.state.page*this.state.elemPerPage) && (index >= (this.state.page-1)*this.state.elemPerPage)) {
                //alert(JSON.stringify(info));
                return (<div>{`${info.amt}x ${info.name}[${info.set.toUpperCase()}]`}</div>)
                } else {
                return (null)
              }
            })
            }
          </div>
          )
      } else {
        return(<div>You have no cards in collection.</div>)
      }
    }
  
  
    renderTableAfterCheck() {
      let nextLastDisabled = false;
      let nextNextDisabled = false;
      this.props.collectionList.length > (this.state.page)*(this.state.elemPerPage)? nextNextDisabled = false: nextNextDisabled = true;
      this.state.page > 1? nextLastDisabled = false: nextLastDisabled = true;
      if (this.state.lastDisabled === nextLastDisabled && this.state.nextDisabled === nextNextDisabled) {
          return this.renderTable()
      } else {
        this.setState({
          lastDisabled: nextLastDisabled,
          nextDisabled: nextNextDisabled
        })
        return null;
      }
    }
  
    
    render(){
      return(this.renderTableAfterCheck())
    }
  
  }
  
  export default CollectionTableListForm;