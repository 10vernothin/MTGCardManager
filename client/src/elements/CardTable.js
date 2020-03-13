import React, { Component } from 'react';
import SessionInfo from '../tools/ContentData.js';

class CardTable extends Component {
  
  // Retrieves the list of items from the Express app

  constructor(props) {
    super(props);
    this.state = {
        collectionList: [],
        username: SessionInfo.getSessionUser(),
        userID: SessionInfo.getSessionUserID(),
        postresponse: 'Fetching Data...'
        }
    }

    componentDidMount() {
        this.fetchTable();
    }

    fetchTable = () => {
        fetch('/api/collections/fetch-collection', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(list => {if (list.length === 0) {
          this.setState({postresponse: 'You have no cards in collection.'})
        } else { this.setState({ collectionList: list, postresponse: '' })}
        })
      }

    render(){
        const list = this.state.collectionList;
        return (
        <div>
        {list.length ? (
              <table>
                <tr>
                  <td>Name</td>
                  <td>Amount</td>
                  <td>Price</td>
                </tr>
              {/* Render the list of items */}
              {this.state.collectionList.map((item) => {
                if (!(item.name === '')){
                return(
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
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
        <h2>{this.state.postresponse}</h2>
        </div>
        )
    }


}

export default CardTable;