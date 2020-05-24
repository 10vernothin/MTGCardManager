
import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo';
import CardImagePanel from '../../../common/images/CardImagePanel'
import ManaCostPanel from '../../../common/images/ManaCostPanel';

const AddRemoveButtonCSS = {
    display: 'block',
    padding:'auto auto',
    margin:'auto auto',
    height: '100%',
    width: '100%',
    font: '15px black',
    'font-weight': 'bold',
}

/*This component renders a Collection Table element*/
class CollectionTableElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            id_key: this.props.id_key,
        }
    }

    componentDidCatch(error) {
        alert("CollectionTableElement " + error)
    }

    render(){  
        this.loadRowObjs() 
        return(this.renderRowElement())
    }

    //Render Methods

    renderRowElement = () => {
        if (!(JSON.stringify(this.state.item) === '[]')) {
            let cardObj = this.state.item[0]
            return(
            <div>
            <div class={this.props.resBoxCSS}>
                <div class='collection_elem_image_panel'>
                <CardImagePanel 
                    cardObj = {cardObj}
                    imgType = {{type: "normal"}}
                />
                </div>
                <div style={{flex: 1}}>{this.state.id_key}</div>
                <div style={{flex: 2}} >{cardObj.name}</div>
                <div style={{flex: 2}}>
                    <div class='collection_table_mana_cost'>
                        <ManaCostPanel cardObj = {cardObj} size={{width:'20px', height:'auto'}}/>
                    </div>
                </div>
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
                    <button style={AddRemoveButtonCSS} onClick={this.handleAddCard}>
                                <div>Add Card</div>
                        </button>
                </div>
                <div style={{flex: 1, 'text-align': 'center'}}>
                            <button style={AddRemoveButtonCSS} onClick={this.handleRemoveCard}>
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
    
    //Loader Methods

    loadRowObjs = () => {
      fetch('/api/collections/fetch-card-object', 
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({card_id: this.props.cardInfo.card_id})
      })
      .then(res => res.json())
      .then(list => {
        if (!(list.length === 0) && !(JSON.stringify(this.state.item) === JSON.stringify(list))) {
                    this.setState({
                        item: list,
                        id_key: this.props.id_key})}
      }).catch((err) => {
        alert(err.message)
        })
    }

    //Handler Methods

    handleAddCard = e => {
        e.preventDefault()
        let item = this.state.item[0]
        fetch('/api/collections/add-card-to-collection', 
            { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({chosenIsFoil: this.props.cardInfo.is_foil, set: item.set, set_id: item.set_id, collectionID: SessionInfo.getCollectionID()})
            }
        ).then(() => {
            this.props.updateTopmostState()
        }).catch((err) => {
            alert(err.message)
        })
    }
    
    handleRemoveCard = e => {
        e.preventDefault()
        let item = this.state.item[0]
        fetch('/api/collections/remove-card-from-collection', 
            { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                chosenIsFoil: this.props.cardInfo.is_foil, 
                set: item.set, 
                set_id: item.set_id, 
                collectionID: SessionInfo.getCollectionID()})
            }
        ).then((res) => {
            this.props.updateTopmostState()
        }).catch((err) => {
            alert(err.message)
        })
    }
}

export default CollectionTableElement