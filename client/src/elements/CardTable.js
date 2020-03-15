import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';
import CardTableResultBox from '../elements/CardTableResultBox';

const tableCSS = {
  border: '1px black solid',
  margin: '0 auto',
  width: '95%',
  display: 'flex',
  flex: 1,
  'text-align': 'center'
}

const flexBoxContainer = {
  border: '1px black solid',
  margin: '0 auto',
  padding: '0',
  width: '95%',
}

const cardResflexboxCSS = [{
  display:'flex', 'text-align': 'center', margin: '0 auto',
  width: '100%', backgroundColor: 'gray', padding: '0'
}, {
  display:'flex', 'text-align': 'center', margin: '0 auto',
  width: '100%', backgroundColor: 'white', padding: '0'
}]


class CardTable extends Component {
  
  // Retrieves the list of items from the Express app

  constructor(props) {
    super(props);
    this.state = {
        username: SessionInfo.getSessionUser(),
        userID: SessionInfo.getSessionUserID(),
        collectionID: SessionInfo.getCollectionID(),
        collectionName: SessionInfo.getCollectionName()
        }
    }

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
              </div>
              <div style={flexBoxContainer}>
                {this.renderResultBoxes(list)}
              </div>
            </div>
            )
        } else {
          return(<div>You have no cards in collection.</div>)
        }
    }


}

export default CardTable;