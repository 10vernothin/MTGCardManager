import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';


const tableCSS = {
  border: '1px black solid',
  margin: '0 auto',
  width: '90%'
}

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

    render(){
        const list = this.props.collectionList
        return (
        <div>
        {list.length ? (
              <table style={tableCSS}>
                <tr>
                  <th>MANA COST</th>
                  <th>CARD NAME</th>
                  <th>SET</th>
                  <th>TYPE</th>
                  <th>RARITY</th>
                  <th>AMOUNT</th>
                  <th>FOIL</th>
                  <th>PRICE</th>
                  <th>OPTIONS</th>
                </tr>
              {/* Render the list of items */}
              {list.map((item) => {
                if (!(item.card_data.name === '')){
                return(
                    <tr>
                      <td>{item.card_data.mana_cost}</td>
                      <td>{item.card_data.name}</td>
                      <td>{item.card_data.set_name}</td>
                      <td>{item.card_data.type_line}</td>
                      <td>{item.card_data.rarity.substring(0,1).toUpperCase()}</td>
                      <td>{item.amt}</td>
                      <td>{item.is_foil ? "Yes" : "No"}</td>
                      <td>{item.is_foil ? 
                             (item.card_data.prices.usd_foil === null ? 'N/A':`$${item.card_data.prices.usd_foil}`)
                            :(item.card_data.prices.usd === null ? 'N/A':`$${item.card_data.prices.usd}`)}
                      </td>
                      <td>
                          {/*buttons go here*/}
                      </td>
                    </tr>
                );
                } else {
                  return null;
                }
              })}
              </table>
          ) :(
            <div></div>
          )
        }
        <h2>{this.state.postResponse}</h2>
        </div>
        )
    }


}

export default CardTable;