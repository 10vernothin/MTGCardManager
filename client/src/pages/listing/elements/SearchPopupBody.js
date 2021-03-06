import React, {Component} from 'react'
import '../css/Listing.css'

class SearchPopupBody extends Component {

    constructor(props){
        super(props);
        this.state = {
            formControls: { cardName: { value: '' }},
            postResponse: [],
            submittable: false,
            cardID: ''
        }
    }

    componentDidCatch(error, info) {
        alert("SearchPopupBody " + error+ info)
    }

    render() {
        return(
            <div>
                {this.renderSearchBox()}
                {this.renderResults()}      
            </div>
        );
    }
    
    //Render methods

    renderSearchBox = () => {
        return(
            <div>
            <div style={{backgroundColor: 'gray'}}>
                        <div style={{display:'inline'}}>
                            {"Search Card:  "}
                            <input  type="text" 
                                    name="cardName" 
                                    value={this.state.formControls.cardName.value} 
                                    onChange={this.changeHandler} 
                                    style= {{width: '70%', right: 0}}
                            />
                            <input  type="text" 
                                    name="cardID" 
                                    value={this.state.cardID} 
                                    disabled="true"
                                    style= {{width: '6%', right: 0}}
                            />
                        </div>
                        <div style={{display:'inline'}}>
                            <button onClick={this.handleSubmit} disabled={!this.state.submittable}>Submit</button>
                        </div>
            </div>
            <div style={{backgroundColor: 'gray', height: '2px'}}/>
            </div>
        )
    }

    renderResults = () => {
        return(
            <div class='popup_search_dropdown'>
                {this.state.postResponse.map((item) => {
                    return(
                    <SearchPopupElement 
                        setChosenCard={this.setChosenCard.bind(this)}
                        item = {item}
                    />)
                })}
            </div> 
        )
    }

    //Handler methods

    changeHandler = event => {
        event.preventDefault()
        const name = event.target.name;
        const value = event.target.value;
        let id = this.state.cardID;
        if (!(this.state.cardID === '')) {
            id = '' 
        }
        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                ...this.state.formControls[name],
                value
                }
            }, 
            cardID: id, 
            submittable: false
        }, () => {
            fetch('/api/cards/query-card', 
            { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            })
            .then((res) => {return res.text();})
            .then((postResponse) => {
                postResponse = JSON.parse(postResponse)
                if (!(postResponse === this.state.postResponse)){
                    this.setState({postResponse});
            }})
            .catch((err) => {
                alert(err);
        })});  
    }

    handleSubmit = event => {
        event.preventDefault()
        this.props.setPreviewThenTogglePopup(this.state.cardID, this.state.formControls.cardName.value)
    }

    //Binded methods

    setChosenCard = (name, id) => {
        this.setState({
            formControls: {
              cardName: {value: name}
             },
            cardID: id,
            submittable: true
        }, () => {
            fetch('/api/cards/query-card', 
            { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
            })
            .then((res) => {return res.text();})
            .then((postResponse) => {
                postResponse = JSON.parse(postResponse)
                if (!(postResponse === this.state.postResponse)){
                    this.setState({postResponse});
            }})
            .catch((err) => {
                alert(err);
        })});  
    }

}

//Subclass

class SearchPopupElement extends Component {
    
    handleSelect = e => {
        this.props.setChosenCard(this.props.item.name, this.props.item.card_id)
    }

    render() {
        return (
            <div class='popup_result_hoverable' onClick={this.handleSelect}>
                {`ID: ${this.props.item.card_id} -- ${this.props.item.name} [${this.props.item.set.toUpperCase()}]` }
            </div>
        ) 
    }

}




export default SearchPopupBody;