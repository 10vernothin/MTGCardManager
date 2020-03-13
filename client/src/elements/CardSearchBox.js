import React, { Component } from 'react';
import SearchResultBox from '../elements/SearchResultBox'


/*Inline CSS Constants*/
const Dropdown = {
    overflow: 'auto',
    display: 'fixed',
    position: 'absolute',
    height: '100%',
    left: '0',
    right:'0',
    padding: '0',
    margin: '0',
    'z-index': '1'
}

/*CardSearchBox*/
class CardSearchBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            formControls: { cardName: { value: '' }},
            postResponse: [],
        }
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
                if (!(postResponse === this.state.postResponse)){
                    this.setState({postResponse});
                }
        }).catch((err) => {
            alert(err.message);
        })});  
    }

    render(){
        return(
            <div>
                    <div style={{backgroundColor: 'gray'}}>
                        <div>
                            {"Search Card:  "}
                            <input  type="text" 
                                    name="cardName" 
                                    value={this.state.formControls.cardName.value} 
                                    onChange={this.changeHandler} 
                                    style= {{width: '70%', right: 0}}
                            />
                        </div>   
                    </div>
                    <div style={{backgroundColor: 'gray', height: '2px'}}/>
                    <div>
                        <div style={Dropdown}>
                            {this.state.postResponse.map((item) => {
                                return (<SearchResultBox item = {item}/>) 
                            })}
                        </div> 
                    </div>
            </div>
    );}
}





export default CardSearchBox;