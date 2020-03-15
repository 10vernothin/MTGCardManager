
import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData';


/*This component renders a search box element*/
class CardTableResultBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
        item: []
        }
    }

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
            res.json()
        }).then(() => {
            this.props.updateTopmostState()
        })
    }

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
            res.json()
        }).then(() => {
            this.props.updateTopmostState()
        })
    }

    createRow = () => {
        this.fetchTableRow()
        if (!(JSON.stringify(this.state.item) === '[]')) {
            let item = this.state.item[0]
            return(
            <div style={this.props.resBoxCSS}>
                <div style={{flex: 2}}>{item.name}</div>
                <div style={{flex: 1}}>{item.mana_cost}</div>
                <div style={{flex: 1}}>{item.rarity.substring(0,1).toUpperCase()}</div>
                <div style={{flex: 3}}>{item.type_line}</div>
                <div style={{flex: 3}}>{`${item.set_name} [${item.set.toUpperCase()}]`}</div>
                <div style={{flex: 1}}>{item.set_id.toUpperCase()}</div>
                <div style={{flex: 1}}>{this.props.cardInfo.is_foil ? <b>Yes</b> : "No"}</div>
                <div style={{flex: 1}}>{this.props.cardInfo.is_foil ? 
                    (item.prices.usd_foil === null ? 'N/A':`$${item.prices.usd_foil}`)
                    :(item.prices.usd === null ? 'N/A':`$${item.prices.usd}`)}
                </div>
                <div style={{flex: 1}}>{this.props.cardInfo.amt}</div>
                <div style={{flex: 1}}>
                    <button onClick={this.addCard}>+</button>
                    <button onClick={this.removeCard}>-</button>
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