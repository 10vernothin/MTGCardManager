import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';
import CardTableResultBox from '../elements/CardTableResultBox';

/* These constants define the inline CSS properties of elements in this component*/
const tableCSS = {
  'border-bottom': '1px black solid',
  'border-top': '1px black solid',
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  flex: 1,
  'text-align': 'center'
}

const cardResflexboxCSS = [{
  display:'flex', 'text-align': 'center', margin: '0',
  width: '100%', backgroundColor: 'gray', padding: '0'
}, {
  display:'flex', 'text-align': 'center', margin: '0'
}]

/*
CardTable renders a table that contains all the cards in a user's collection
*/
class CardTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username: SessionInfo.getSessionUser(),
        userID: SessionInfo.getSessionUserID(),
        collectionID: SessionInfo.getCollectionID(),
        collectionName: SessionInfo.getCollectionName()
        }
    }

  /*
  This function renders the Child result rows
  */
  renderResultBoxes = (list) => {
    let CSSIter = 0;
    return (
      list.map((info,index) => {
          CSSIter === 1? CSSIter = 0: CSSIter = 1
          return <CardTableResultBox 
            key={index}
            cardInfo={info}
            resBoxCSS={cardResflexboxCSS[CSSIter]} 
            updateTopmostState={this.props.updateState}/>
      })
    )
  }

  render(){
        if (!(this.props.collectionList.length === 0)) {
          
          /*deep copying the prop and sorting it*/
          const list = this.props.collectionList.slice()
          .sort((a,b) => {return (a.name.localeCompare(b.name))})
          .sort((a,b) => {return (a.set.localeCompare(b.set))})
          .sort((a,b) => {return (a.is_foil===b.is_foil? 0: (a.is_foil? 1:-1))})

          return (
            <div>
              <div style={tableCSS}>
                  <div style={{flex: 2}}>CARD NAME</div>
                  <div style={{flex: 1}}>MANA COST</div>
                  <div style={{flex: 1}}>RARITY</div>
                  <div style={{flex: 3}}>TYPE</div>
                  <div style={{flex: 3}}>SET</div>
                  <div style={{flex: 1}}>COLLECTOR NO.</div>
                  <div style={{flex: 1}}>FOIL</div>
                  <div style={{flex: 1}}>PRICE</div>
                  <div style={{flex: 1}}>AMOUNT</div>
                  <div style={{flex: 1}}></div>
                  <div style={{flex: 1}}></div>
              </div>
              {this.renderResultBoxes(list)}
            </div>
            )
        } else {
          return(<div>You have no cards in collection.</div>)
        }
    }


}

export default CardTable;