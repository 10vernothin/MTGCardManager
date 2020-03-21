
import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/session-info';
import replaceManaCostWithSVG from '../../../common/functions/replace-mana-with-symbol'

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

const ImgNotAvailableCSS = {
    padding: '0',
    height: 'auto',
    border: '1px black solid',
    flex: 3
}

/*This component renders a search box element*/
class CollectionTableElement extends Component {

  constructor(props) {
    super(props);
    this.state = {
        item: [],
        cardImageURI: undefined,
        id_key: this.props.id_key,
        svgList: []
        }
    }

    /*
    This function fetches the row data,
    then calls fetchImage to retrieve the cached image url from the callback,
    and finally sets the whole state*/
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
                this.fetchImage(list, {type:"normal"}, (uri, svgList) => {this.setState({cardImageURI: uri, svgList:svgList, item: list,id_key: this.props.id_key})})
          }
      })
    }

    /*
    This function lazy fetches an image, then updates the URI
    Sends the URI through the callback
    */
    fetchImage = (cardObjList, image_type, callback) => {
            let cardObj = cardObjList[0];
            if (!(cardObj === undefined)) {
                fetch('/api/cards/retrieve-cached-image', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({set: cardObj.set, set_id: cardObj.set_id, image_uris: cardObj.image_uris, image_type: image_type})
                }).then(
                    (res) => {return res.json()}
                ).then((result) =>{
                    if (!(result.uri === this.state.cardImageURI)) {
                        this.updateManaCost(cardObj, (svgList)=>{callback(result.uri, svgList);})
                    }
                })
        }
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

    updateManaCost = (cardObj, callback) => {
        replaceManaCostWithSVG(cardObj.mana_cost).then((listURL) =>
        {
            let listofSVGs=[]
            let listFileName = listURL.map((url) => {
                return url.split(/(\\|\/)/g).pop()
            })
            let listSVGFiles = this.props.svgPack.keys().map((url) => {
                return url.split(/(\\|\/)/g).pop()
            })
            listFileName.forEach((path) =>{
                if (listSVGFiles.includes(path))
                {
                    let i = this.props.svgPack(this.props.svgPack.keys().filter((key) =>key.includes(path))[0])
                    listofSVGs.push(i)
                }
            })
            callback(listofSVGs)
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
        if (!(JSON.stringify(this.state.item) === '[]') && !(this.state.cardImageURI === undefined)) {
            let cardObj = this.state.item[0]
            return(
            <div>
            <div style={this.props.resBoxCSS}>
                {this.state.cardImageURI === ''? 
                 <div style={ImgNotAvailableCSS}> IMAGE NOT AVAILABLE </div>:
                <img src={cardObj.image_uris.normal} style={ImageCSS} alt={cardObj.name}/>
                }
                <div style={{flex: 1}}>{this.state.id_key}</div>
                <div style={{flex: 2}} >{cardObj.name}</div>
                <div style={{flex: 2}}>
                    <div style={{display: 'flex', justifyContent: 'center', 'flex-wrap':'wrap'}}>
                        {this.state.svgList.map((item) => {
                            return this.renderManaSymbol(item)
                        })}
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

    renderRow() {
        this.fetchTableRow()
        return(this.createRow())
    }

    render(){   
        return(this.renderRow())
    }
}

export default CollectionTableElement