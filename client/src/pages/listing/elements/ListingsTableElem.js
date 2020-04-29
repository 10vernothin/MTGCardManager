import React, { Component } from 'react';
import {EditCollectionButton, SelectCollectionButton, DeleteCollectionButton} from './Buttons'
import CardImagePanel from '../../../common/images/CardImagePanel';


class ListingsTableElement extends Component {

    constructor(props) {
      super(props);
      this.state = { 
        item: '', 
        id_key: this.props.id_key,
        cardObj: '',
      }
    }
  
    render() {
      this.loadChanges();
      return(this.renderTableElem())
    }

    //Render Methods
    
    renderTableElem = () => {
      let item = this.state.item;
      if (!(item.name === '')){
        return(
          <div class={this.props.currCSS}>
              <div style={{flex: 2}} class='shrunk_preview_panel'>
                <CardImagePanel
                  cardObj={this.state.cardObj}
                  imgType={{type:'art_crop'}}
                />
              </div>
              <div style={{flex: 2}}>{item.name}</div>
              <div style={{flex: 7}}>{item.description}</div>
              <div style={{flex: 1}}>{item.card_count}</div>
              <div style={{flex: 1}}>${item.sum}</div>
              <div style={{flex: 2}}>
                    <SelectCollectionButton link_url={this.props.link_url}/>
                    <EditCollectionButton link_url={this.props.edit_url}/>
                    <DeleteCollectionButton col_id={item.id} updateTopmostState={this.props.updateTopmostState}/>
              </div>
              <div style={{flex: 1}}>
                <button onClick={this.handleJSONDownload}>As JSON</button>
                </div>
              <div style={{flex: 1}}>
                <button onClick={this.handleCSVDownload}>As CSV</button>
              </div>
          </div>
        )
        } else {
          return(null);
      }
    }

    //Loader Methods

    loadChanges = () => {
      if (!(JSON.stringify(this.state.item) === JSON.stringify(this.props.item))) {
          if (this.props.item.showcase_card_id === 0) {
            this.setState({item: this.props.item})
          } else {
            this.loadCardObj(this.props.item.showcase_card_id, (obj) => {
                this.setState({
                item: this.props.item, 
                cardObj: obj})
              })
          }
      }
    }

    loadCardObj = (id, callback) => {
      fetch('/api/collections/fetch-row', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({card_id: id})
      })
      .then((res) => {return res.json()})
      .then((cardObj) => {
        cardObj = cardObj[0]
        if (!(cardObj === undefined)) {
              callback(cardObj);
        } else {
              callback('')
        }
      })
    }

    //Handler Methods

    handleJSONDownload = () => {
      fetch('/api/collections/fetch-collection-as-JSON', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: this.state.id_key})
      })
      .then((res) => {
        //this snippet of code downloads the file
        res.blob().then((blob) => {
          let url  = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = `${this.state.item.name}.json`;
          a.click();
          })
      })
    }

    handleCSVDownload = () => {
      fetch('/api/collections/fetch-collection-as-CSV', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: this.state.id_key})
      })
      .then((res) => {
        //this snippet of code downloads the file
        res.blob().then((blob) => {
          let url  = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = `${this.state.item.name}.csv`;
          a.click();
          })
      })
    }
    
}

export default ListingsTableElement;
