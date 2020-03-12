import React, { Component } from 'react';
//import SessionInfo from '../tools/ContentData'


/*Inline CSS Constants*/
const Dropdown = {
    'overflow-y': 'scroll',
    'overflow-x': 'hidden'
}


/*CardSearchBox*/
class CardSearchBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            formControls: { cardName: { value: '' }},
            postResponse: []
        }
    }
  
    handleSubmit = e => {
      e.preventDefault();
    }
  
    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            formControls: {
              ...this.state.formControls,
              [name]: {
              ...this.state.formControls[name],
              value
        }}}, () => {
            fetch('/api/cards/query-card', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        }).then((res) => {
            return res.json();
        }).then((postResponse) => {
                if (!(postResponse === this.postResponse)){
                    this.setState({postResponse});
                }
        }).catch((err) => {
            alert(err.message);
        })});
        
        
    }

    componentDidMount() {
    }

    render(){
        
        return(
            <div>
            <div>
            <form method="post" onSubmit={this.handleSubmit}>
                    {"Add Card:  "}
                    <input type="text" 
                            name="cardName" 
                            value={this.state.formControls.cardName.value} 
                            onChange={this.changeHandler} 
                    />
                    <button type="submit">Submit</button>
            </form>
            </div>
            <div style={Dropdown}>
                
                {this.state.postResponse.map((item, index) => {
                    return (
                        <ul>
                        <div>
                        {item}
                        </div>
                        </ul>
                )})}
                
            </div>
            </div>
            
        );
    }
}




export default CardSearchBox;