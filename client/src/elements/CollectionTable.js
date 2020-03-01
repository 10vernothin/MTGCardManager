import React, { Component } from 'react';


class AddButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activated: true
        }
    }
    render() {
        return(
            <button disabled = {this.activated}>+</button>
        );
    }
}


class CollectionTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionList: []
        }
    }

    componentDidMount() {
        this.getList();
      }
    
      // Retrieves the list of items from the Express app
      getList = () => {
        fetch('/api/collections/getList')
        .then(res => res.json())
        .then(list => this.setState({ collectionList: list }))
      }

    render(){
        const list = this.state.collectionList;
        return (
        <div>
        {list.length ? (
            <div>
              {/* Render the list of items */}
              {this.state.collectionList.map((item) => {
                return(
                  <div>
                    {item}
                    <AddButton/>
                  </div>
                );
              })}
            </div>
          ) :(
            <div>
              <h2>You have no collections right now. =(</h2>
            </div>
          )
        }
        </div>);
    }
}

export default CollectionTable;
