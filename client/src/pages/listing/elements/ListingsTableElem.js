import React, { Component } from 'react';
import {EditCollectionButton, SelectCollectionButton, DeleteCollectionButton} from './Buttons'

const collectionCSS = {
  width: '90%',
  display: 'flex',
  margin: '0 auto',
  'text-align': 'left'
}

class ListingsTableElement extends Component {

    constructor(props) {
      super(props);
      this.state = { 
        item: '', 
        cardImageURI: '', 
        id_key: this.props.id_key,
        cardImageObj: '',
        imageType: ''
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
            this.fetchImage(this.props.item.showcase_card_id, {type:'art_crop'}, (uri, 
              data, ext) => {
                if (ext === 'jpg') {
                  ext = 'jpeg'
                }
                this.setState({
                cardImageURI:uri, 
                item: this.props.item, 
                cardImageObj: data, 
                imageType: ext})})
          }
      }
    }

    fetchImage = (id, image_type, callback) => {
      fetch('/api/collections/fetch-row', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({card_id: id})
      })
      .then((res) => {
        return res.json()})
      .then((cardObj) => {
        cardObj = cardObj[0]
        if (!(cardObj === undefined)) {
            fetch('/api/cards/retrieve-cached-image', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                  set: cardObj.set, 
                  set_id: cardObj.set_id, 
                  image_uris: cardObj.image_uris, 
                  image_type: image_type})
            }).then(
                (res) => {return res.json()}
            ).then((result) => {
              callback(result.uri, result.data, result.imgType);
            }).catch((err) =>{
              alert(err.message)
            })
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


    renderImage = () => {
      let imagePanel =
        (this.state.cardImageObj === '' || this.state.imageType === '')?
            (this.state.cardImageURI === '')?
                  <div style={{width: '150px', height: '100px', border: '1px black solid'}}>IMAGE NOT AVAILABLE</div>:
                  <img 
                    src={
                      this.state.cardImageURI 
                    } 
                    alt={"Showcase URI Img"} 
                    style={{width: '150px', height: '100px', border: '1px black solid'}}
                  />
        :
                <img 
                    src={
                      `data:img/${this.state.imageType};base64,${this.state.cardImageObj.toString('base64')}` 
                    } 
                    alt={"Showcase Img"} 
                    style={{width: '150px', height: '100px', border: '1px black solid'}}
                />
      return (imagePanel)
    }

    render(){
      this.recordChange();
      let item = this.state.item;
      if (!(item.name === '')){
        return(
          <div style={collectionCSS}>
              <div style={{flex:2}}>
              {this.renderImage()
              }
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
