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
  'text-align': 'center',
  padding: '0'
}

const cardResflexboxCSS = [{
  margin: '0 auto',
  width: '100%',
  display: 'flex',
  'text-align': 'center', 
  backgroundColor: 'gray', 
  padding: '0'
  },
  {
  display:'flex', 
  'text-align': 'center', 
  margin: '0',
  width: '100%', 
  backgroundColor: 'white', 
  padding: '0'
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

  render(){
        if (!(this.props.collectionList.length === 0)) {
          
          /*deep copying the prop and sorting it (use fast data-loss copy since everything is JSON)*/
          let list = JSON.stringify(this.props.collectionList).valueOf()
          list = JSON.parse(list)
          list.sort((a,b) => {return (a.name.localeCompare(b.name) || a.set.localeCompare(b.set) || a.is_foil-b.is_foil)})
          
          let CSSIter = 0
          
          return (
            <div>
              <div style={tableCSS}>
                  <div style={{width:'150px'}}></div>
                  <div style={{flex: 2}}>CARD NAME</div>
                  <div style={{flex: 1}}>MANA COST</div>
                  <div style={{flex: 1}}>RARITY</div>
                  <div style={{flex: 3}}>TYPE</div>
                  <div style={{flex: 3}}>SET</div>
                  <div style={{flex: 1}}>SET NO.</div>
                  <div style={{flex: 1}}>FOIL</div>
                  <div style={{flex: 1}}>PRICE</div>
                  <div style={{flex: 1}}>AMT</div>
                  <div style={{flex: 1}}></div>
                  <div style={{flex: 1}}></div>
              </div>
              {
              list.map((info) => {
                CSSIter === 1? CSSIter = 0: CSSIter = 1
                return (<CardTableResultBox 
                  cardInfo={info}
                  resBoxCSS={cardResflexboxCSS[CSSIter]} 
                  updateTopmostState={this.props.updateState}/>)})}
            </div>
            )
        } else {
          return(<div>You have no cards in collection.</div>)
        }
    }


}

export default CardTable;