import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo';

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
          currIndex: 'Name',
          list: []        
          }
        this.sortIndices = ['Name', 'Type', 'CMC', 'Colors', 'Set', 'Price']
        this.sortIndexKeys = ['name', 'type_line', 'cmc', 'colors', 'set', 'prices']
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
  
    handleSortChange = e => {
      e.preventDefault()
      this.setState({
        currIndex: e.target.value
      })
    }

    fetchList = () => {
      let n = this.props.collectionList.map((item) => {
        return item.card_id;
      })
      let f = this.props.collectionList.map((item) => {
        return item.is_foil;
      })
      let amt = this.props.collectionList.map((item) => {
        return item.amt;
      })
      fetch('/api/cards/fetch-card-attribute',
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({lstOfIds: n, is_foil: f, amt: amt, opts:this.sortIndexKeys})
        }
      ).then((res) => {
        return res.json()
      }).then((json) => {
          if (!(JSON.stringify(this.state.list) === JSON.stringify(json))) {
            this.setState({
                list: json
            })
          }
      })
    }

    renderDropdown = () => {
      return(
        <div>
        <p style={{display:'inline-block'}}>{`Sort By:`}</p>
        <select id="sort" style={{display:'inline-block'}} onChange={this.handleSortChange} value={this.state.currIndex}>
          {this.sortIndices.map((item) => {
            return (<option value={item}>{`${item}`}</option>)
          })
          }
        </select>
        </div>
      )
    }
    
    renderListByName = (list, CSSIter) => {
      return(
        list.map((info, index) => {
          CSSIter === 1? CSSIter = 0: CSSIter = 1
          if ((index < this.state.page*this.state.elemPerPage) && (index >= (this.state.page-1)*this.state.elemPerPage)) {
            //alert(JSON.stringify(info));
            let f = info.is_foil ? '*FOIL*': ''
            return (<div>{`${info.amt}x ${info.name} [${info.set.toUpperCase()}] ${f}`}</div>)
            } else {
            return (null)
          }
        })
      )
    } 

    renderListByCMC = (list, CSSIter) => {
      list.sort((a,b) => {return (b.cmc - a.cmc)})
      return (
      list.map((info, index) => {
        CSSIter === 1? CSSIter = 0: CSSIter = 1
        if ((index < this.state.page*this.state.elemPerPage) && (index >= (this.state.page-1)*this.state.elemPerPage)) {
            let f = info.is_foil? '*FOIL*': ''
            return (<div>{`${info.amt}x ${info.name} [${info.set.toUpperCase()}] ${f} (cmc:${info.cmc})`}</div>)
          } else {
            return (null)
          }
        })
      )
    } 

    renderList = () => {
      this.fetchList()
      /*deep copying the prop and sorting it (use fast data-loss copy since everything is JSON)*/
      let list = JSON.stringify(this.state.list).valueOf()
      list = JSON.parse(list)
      list.sort((a,b) => {return (a.name.localeCompare(b.name) || a.set.localeCompare(b.set) || a.is_foil-b.is_foil)})
      let CSSIter = 0
      switch (this.state.currIndex) {
        case 'CMC':
          return(this.renderListByCMC(list,CSSIter))
        default:
          return(this.renderListByName(list,CSSIter))
      }
    }
  
  
    renderTable = () => {
      let nextLastDisabled = false;
      let nextNextDisabled = false;
      this.props.collectionList.length > (this.state.page)*(this.state.elemPerPage)? nextNextDisabled = false: nextNextDisabled = true;
      this.state.page > 1? nextLastDisabled = false: nextLastDisabled = true;
      if (!(this.state.list === 0)) {
        if (this.state.lastDisabled === nextLastDisabled && this.state.nextDisabled === nextNextDisabled) {
            return (
              <div>
                <div>{this.renderPageNav()}</div>
                <div>{ this.renderDropdown()}</div>
                <div>{ this.renderList()}</div>
              </div>
            )
        } else {
          this.setState({
            lastDisabled: nextLastDisabled,
            nextDisabled: nextNextDisabled
          })
          return null;
        }
      } else {
        return(<div>You have no cards in collection.</div>)
      }
    }
  
    
    render(){
      return(this.renderTable())
    }
  
  }
  
  export default CollectionTableListForm;