import React, {Component} from 'react';

class CardImagePanel extends Component {

  constructor(props) {
        super(props)
        this.state = {
            defaultCSS: {width:'100%', height:'100%', padding:'0', margin:'0'},
            cardImageURI: '',
            cardImageObj: '',
            imageType: ''
  }}

  render() {
        if (this.props.paramsType === 'id') {
          this.loadImageByID(this.props.id, this.props.imgType)
        } else {
          this.loadImage(this.props.cardObj, this.props.imgType)
        }
        let imagePanel =
        (this.state.cardImageObj === '' || this.state.imageType === '')?
            (this.state.cardImageURI === '')?
                  //if all fails
                  <div style={this.state.defaultCSS}></div>:
                  //if fetching image data fails
                  <img 
                    src={this.state.cardImageURI} 
                    alt={this.state.cardImageURI} 
                    style={this.state.defaultCSS}
                  />
        :
                <img
                    src={`data:img/${this.state.imageType};base64,${this.state.cardImageObj.toString('base64')}`} 
                    alt={this.state.itemName} 
                    style={this.state.defaultCSS}
                />
      return (imagePanel)
  }

  //Loader Functions
  
  loadImage = (cardObj, image_type) => {
    if (!(cardObj === undefined || cardObj === '')) {
        fetch('/api/cards/retrieve-cached-image', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                cardObj: cardObj,
                image_type: image_type})
        })
        .then((res) => {return res.json()})
        .then((result) =>{      
          if (!(this.state.cardImageURI === result.uri)) {
            this.setState( 
              {cardImageObj: result.data,
                cardImageURI: result.uri,
                imageType: result.imgType 
  })}})}}

  loadImageByID = (id, image_type) => {
    fetch('/api/collections/fetch-row', 
    { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({card_id: id})
    })
    .then((res) => {return res.json()})
    .then((result) =>{ 
      this.loadImage(result[0], image_type)
  })}

}
      

export default CardImagePanel