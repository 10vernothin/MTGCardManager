import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo';
import CollectionPageNavPanel from './CollectionPageNavPanel'

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
      currIndex: 'Name',
      disableAll: false,
      list: []
    }
    this.sortIndices = ['Name', 'Type', 'CMC', 'Colors', 'Set', 'Price', 'Amount']
    this.sortIndexKeys = ['name', 'type_line', 'cmc', 'colors', 'set', 'prices', 'amt']
  }

  componentDidCatch(error, info) {
    alert("CollectionTableListForm " + error + JSON.stringify(info))
  }

  render() {
    this.loadList()
    return (
      <div>
        {this.renderNavigationPanel()}
        {this.renderDropdownPanel()}
        {this.renderTable()}

      </div>
    )
  }

  //Render Methods

  renderNavigationPanel = () => {
    return (
      <CollectionPageNavPanel
        handleChangeAnyPage={this.handleChangeAnyPage.bind(this)}
        currPage={this.state.page}
        elemPerPage={this.state.elemPerPage}
        totalElems={this.props.collectionList.length}
        disableAll={this.state.disableAll}

      />)
  }
  renderTable = () => {
    return (
      <div>
        {
          (this.state.list.length === 0) ?
            null:
            <div>
              {this.renderListPanel()}
              {this.renderNavigationPanel()}
            </div>
        }
      </div>)
  }

  renderListPanel = () => {
    let list = this.loadDefaultSortedList()
    switch (this.state.currIndex) {
      case 'CMC':
        return (this.renderListByCMC(list))
      case 'Colors':
        return (this.renderListByColors(list))
      case 'Set':
        return (this.renderListBySet(list))
      case 'Price':
        return (this.renderListByPrice(list))
      default:
        return (this.renderListDefaultSort(list))
    }
  }

  renderListElement = (info, showprice = false) => {
    info = JSON.parse(JSON.stringify(info.valueOf()))
    let f = info.is_foil ? '*FOIL*' : ''
    let price = info.is_foil ? info.prices['usd_foil'] : info.prices['usd']
    let priceStr =
      showprice ?
        ((price === null) ?
          ' N/A> '
          : (info.amt > 1 ?
            ` $${Number.parseFloat(price * info.amt).toFixed(2)} (${info.amt}x $${Number.parseFloat(price).toFixed(2)})> `
            : ` $${Number.parseFloat(price).toFixed(2)}> `))
        : ''
    return (
      <div >
        <div style={{ fontWeight: 'bold', display: 'inline-block' }}>{`${priceStr}`}</div>
        <div style={{ display: 'inline-block' }}>{`${info.amt}x ${info.name} [${info.set.toUpperCase()}] ${f}`}</div>
      </div>
    )
  }

  renderDropdownPanel = () => {
    return (
      <div id='list_sort_panel'>
        <div id='sortby_position'>{`Sort By: `}</div>
        <select id="sort"
          style={{ display: 'inline-block', width: '200px' }}
          onChange={this.handleSortMethodChange}
          value={this.state.currIndex}>
          {this.sortIndices.map((item) => {
            return (<option value={item}>{`${item}`}</option>)
          })
          }
        </select>
      </div>
    )
  }

  renderListByPrice = (list) => {
    let newlist = JSON.stringify(list).valueOf()
    newlist = JSON.parse(newlist)
    newlist.sort((a, b) => {
      let a_price = a.is_foil ? a.prices['usd_foil'] : a.prices['usd']
      let b_price = b.is_foil ? b.prices['usd_foil'] : b.prices['usd']
      return (b_price * b.amt - a_price * a.amt)
    })
    return (this.renderListDefaultSort(newlist, true))
  }

  renderListDefaultSort = (list, showprice = false) => {
    let newlist = JSON.stringify(list).valueOf()
    newlist = JSON.parse(newlist)
    return (
      newlist.map((info, index) => {
        if ((index < this.state.page * this.state.elemPerPage) && (index >= (this.state.page - 1) * this.state.elemPerPage)) {
          return (<div>{this.renderListElement(info, showprice)}</div>)
        } else { return (null) }
      }))
  }

  renderListByType = (list) => {

  }

  renderListBySet = (list) => {
    let newlist = JSON.stringify(list).valueOf()
    newlist = JSON.parse(newlist)
    newlist.sort((a, b) => { return (a.set.localeCompare(b.set)) })
    return (this.renderListDefaultSort(newlist))
  }

  renderListByCMC = (list) => {
    list = JSON.stringify(list).valueOf()
    list = JSON.parse(list)
    list.sort((a, b) => { return (b.cmc - a.cmc) })
    let prevCMC = -1
    return (
      list.map((info, index) => {
        if ((index < this.state.page * this.state.elemPerPage) && (index >= (this.state.page - 1) * this.state.elemPerPage)) {
          if (!(prevCMC === info.cmc)) {
            prevCMC = info.cmc
            return (
              <div>
                <div><h3>{`CMC: ${info.cmc}`}</h3></div>
                <div>{this.renderListElement(info)}</div>
              </div>
            )
          } else { return (<div>{this.renderListElement(info)}</div>) }
        } else { return (null) }
      }))
  }

  renderListByColors = (list) => {
    list = JSON.stringify(list).valueOf()
    list = JSON.parse(list)
    let multiList = list.filter((item) => item.colors.length > 1)
    let colorlessList = list.filter((item) => item.colors.length === 0)
    let monoList = list.filter((item) => item.colors.length === 1)
    monoList.sort((a, b) => { return a.colors[0].localeCompare(b.colors[0] || a.name.localeCompare(b.name) || a.set.localeCompare(b.set) || a.is_foil - b.is_foil) })
    let ind = { index: 0 }
    return (
      <div>
        {this.renderMulticolorSublist(multiList, ind)}
        {this.renderMonocolorSublist(monoList, ind)}
        {this.renderColorlessSublist(colorlessList, ind)}
      </div>
    )
  }

  renderMulticolorSublist = (multiList, ind) => {
    let newPageTrigger = false
    return (multiList.map((info, index) => {
      if ((ind.index < this.state.page * this.state.elemPerPage) && (ind.index >= (this.state.page - 1) * this.state.elemPerPage)) {
        ind.index += 1;
        if (index === 0 || !newPageTrigger) {
          newPageTrigger = true
          return (
            <div>
              <div><h3>{`Multicolored`}</h3></div>
              <div>{this.renderListElement(info)}</div>
            </div>
          )
        } else { return (<div>{this.renderListElement(info)}</div>) }
      } else { ind.index += 1; return (null) }
    }))
  }

  renderMonocolorSublist = (monoList, ind) => {
    let newPageTrigger = false
    let prevColor = ''
    let colorKeys = { "W": 'White', "U": 'Blue', "B": 'Black', "R": 'Red', "G": 'Green' }
    return (monoList.map((info) => {
      if ((ind.index < this.state.page * this.state.elemPerPage) && (ind.index >= (this.state.page - 1) * this.state.elemPerPage)) {
        ind.index += 1;
        if (!(info.colors[0] === prevColor) || !newPageTrigger) {
          prevColor = info.colors[0]
          newPageTrigger = true
          return (
            <div>
              <div><h3>{colorKeys[info.colors[0]]}</h3></div>
              <div>{this.renderListElement(info)}</div>
            </div>
          )
        } else { return (<div>{this.renderListElement(info)}</div>) }
      } else { ind.index += 1; return (null) }
    }))
  }

  renderColorlessSublist = (colorlessList, ind) => {
    let newPageTrigger = false
    return (colorlessList.map((info, index) => {
      if ((ind.index < this.state.page * this.state.elemPerPage) && (ind.index >= (this.state.page - 1) * this.state.elemPerPage)) {
        ind.index += 1;
        if (index === 0 || !newPageTrigger) {
          newPageTrigger = true
          return (
            <div>
              <div><h3>{`Colorless`}</h3></div>
              <div>{this.renderListElement(info)}</div>
            </div>
          )
        } else { return (<div>{this.renderListElement(info)}</div>) }
      } else { ind.index += 1; return (null) }
    }))
  }

  //Loader Methods

  loadList = () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lstOfIds: n, is_foil: f, amt: amt, opts: this.sortIndexKeys })
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

  loadDefaultSortedList = () => {
    let list = JSON.stringify(this.state.list).valueOf()
    list = JSON.parse(list)
    list.sort((a, b) => { return (a.name.localeCompare(b.name) || a.set.localeCompare(b.set) || a.is_foil - b.is_foil) })
    return list
  }

  //Handler Methods

  handleSortMethodChange = e => {
    e.preventDefault()
    this.setState({
      currIndex: e.target.value
    })
  }

  //Binded Methods

  handleChangeAnyPage = (pageNumber) => {
    this.setState({
      page: pageNumber
    })
  }

}

export default CollectionTableListForm;