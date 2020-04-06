
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

const ImageCSS = {
    padding: '0',
    height: 'auto',
    width: '150px',
    border: '1px black solid',
    flex: 3
}

/*This component renders a search box element*/
class CollectionTableElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
        item: [],
        id_key: this.props.id_key,
        }
    }

    componentDidCatch(error, info) {
        alert("CollectionTableElement " + error)
    }

    render(){  
        this.fetchTableRow() 
        return(this.createRow())
    }

    /*
    This function fetches the row data,
    then calls fetchImage to retrieve the cached image url from the callback,
    and finally sets the whole state
    */
    fetchTableRow = () => {
      fetch('/api/collections/fetch-row', 
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
        ).then(() => {
            this.props.updateTopmostState()
        }).catch((err) => {
            alert(err.message)
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

    renderManaSymbol = (item) => {
        return (
            <div>
                <object data={item} type="image/svg+xml" style={{width:'20px', height:'auto'}}>
                    <img src={item} alt="imgSym" style={{width:'20px', height:'auto'}}></img>
                </object>
            </div>
        )
    }

    /*This function contains the logic that creates the JSX*/
    createRow = () => {
        if (!(JSON.stringify(this.state.item) === '[]')) {
            let cardObj = this.state.item[0]
            return(
            <div>
            <div style={this.props.resBoxCSS}>
                <div style={ImageCSS}>
                <CardImagePanel 
                    cardObj = {cardObj}
                    imgType = {{type: "normal"}}
                />
                </div>
                <div style={{flex: 1}}>{this.state.id_key}</div>
                <div style={{flex: 2}} >{cardObj.name}</div>
                <div style={{flex: 2}}>
                    <div style={{display: 'flex', justifyContent: 'center', 'flex-wrap':'wrap'}}>
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

    
}

export default CollectionTableElement