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
  
    /*
      This function fetches the row data,
      then calls fetchImage to retrieve the cached image url from the callback,
      and finally sets the whole state
    */
    recordChange = () => {
      if (!(JSON.stringify(this.state.item) === JSON.stringify(this.props.item))) {
          if (this.props.item.showcase_card_id === 0) {
            this.setState({item: this.props.item})
          } else {
            this.fetchCardObj(this.props.item.showcase_card_id, (obj) => {
                this.setState({
                item: this.props.item, 
                cardObj: obj})
              })
          }
      }
    }

    fetchCardObj = (id, callback) => {
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

    downloadJSON = () => {
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

    downloadCSV = () => {
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

    render(){
      this.recordChange();
      let item = this.state.item;
      if (!(item.name === '')){
        return(
          <div style={this.props.currCSS}>
              <div style={{flex: 2, width: '150px', height: '110px', border: '1px black solid', padding:'0', margin:'0'}}>
                <CardImagePanel
                  cardObj={this.state.cardObj}
                  imgType={{type:'art_crop'}}
                />
              </div>
              <div style={{flex: 2}}>{item.name}</div>
              <div style={{flex: 7}}>{item.description}</div>
              <div style={{flex: 1}}>${item.sum}</div>
              <div style={{flex: 2}}>
                    <SelectCollectionButton link_url={this.props.link_url}/>
                    <EditCollectionButton link_url={this.props.edit_url}/>
                    <DeleteCollectionButton col_id={item.id} updateTopmostState={this.props.updateTopmostState}/>
              </div>
              <div style={{flex: 1}}>
                <button onClick={this.downloadJSON}>As JSON</button>
                </div>
              <div style={{flex: 1}}>
                <button onClick={this.downloadCSV}>As CSV</button>
              </div>
          </div>
        )
        } else {
          return(null);
      }
    }
}

export default ListingsTableElement;
