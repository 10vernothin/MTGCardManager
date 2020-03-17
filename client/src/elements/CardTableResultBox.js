
import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData';


const AddRemoveButtonCSS = {
    display: 'block',
    padding:'auto auto',
    margin:'auto auto',
    height: '100%',
    width: '100%',
    font: '15px black',
    'font-weight': 'bold',
}

const ImageCSS = {
    padding: '0',
    height: 'auto',
    width: '150px',
    flex: 2
}


/*This component renders a search box element*/
class CardTableResultBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
        item: [],
        imagePopup: ImageCSS
        }
    }
    /*Fetching the row data*/
    fetchTableRow = () => {
      fetch('/api/collections/fetch-row', 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({card_id: this.props.cardInfo.card_id})
      })
      .then(res => res.json())
      .then(list => {
        if (list.length === 0) {
      } else {
          //alert(JSON.stringify(this.state.item))
          //alert(JSON.stringify(list)) 
          if(!(JSON.stringify(this.state.item) === JSON.stringify(list))){
                this.setState({item: list})
          }
      }
      })
    }

    /*Handle Add card button */
    addCard = e => {
        e.preventDefault()
        let item = this.state.item[0]
        fetch('/api/collections/add-card-to-collection', 
            { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({chosenIsFoil: this.props.cardInfo.is_foil, set: item.set, set_id: item.set_id, collectionID: SessionInfo.getCollectionID()})
            }
        ).then((res) => {
            this.props.updateTopmostState()
        })
    }

    /*Handle remove card button */
    removeCard = e => {
        e.preventDefault()
        let item = this.state.item[0]
        fetch('/api/collections/remove-card-from-collection', 
            { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({chosenIsFoil: this.props.cardInfo.is_foil, set: item.set, set_id: item.set_id, collectionID: SessionInfo.getCollectionID()})
            }
        ).then((res) => {
            this.props.updateTopmostState()
        })
    }

    createRow = () => {
        this.fetchTableRow()
        if (!(JSON.stringify(this.state.item) === '[]')) {
            let cardObj = this.state.item[0]
            return(
            <div>
            <div style={this.props.resBoxCSS}>
                <img src={cardObj.image_uris.normal} style={this.state.imagePopup} alt={cardObj.name}/>
                <div style={{flex: 2}} >{cardObj.name}</div>
                <div style={{flex: 1}}>{cardObj.mana_cost}</div>
                <div style={{flex: 1}}>{cardObj.rarity.substring(0,1).toUpperCase()}</div>
                <div style={{flex: 3}}>{cardObj.type_line}</div>
                <div style={{flex: 3}}>{`${cardObj.set_name} [${cardObj.set.toUpperCase()}]`}</div>
                <div style={{flex: 1}}>{cardObj.set_id.toUpperCase()}</div>
                <div style={{flex: 1}}>{this.props.cardInfo.is_foil ? <b>Yes</b> : "No"}</div>
                <div style={{flex: 1}}>{this.props.cardInfo.is_foil ? 
                    (cardObj.prices.usd_foil === null ? 'N/A':`$${cardObj.prices.usd_foil}`)
                    :(cardObj.prices.usd === null ? 'N/A':`$${cardObj.prices.usd}`)}
                </div>
                <div style={{flex: 1}}>{this.props.cardInfo.amt}</div>
                <div style={{flex: 1, 'text-align': 'center'}}>
                    <button style={AddRemoveButtonCSS} onClick={this.addCard}>
                                <div>Add Card</div>
                        </button>
                </div>
                <div style={{flex: 1, 'text-align': 'center'}}>
                            <button style={AddRemoveButtonCSS} onClick={this.removeCard}>
                                <div>Remove Card</div>
                            </button>
                </div>
            </div>
            </div>
            );
        } else {
            return null;
        }
        
    }


    render(){
        return (<div>{this.createRow()}</div>)
    }
}

export default CardTableResultBox