import React, { Component } from 'react';
import SessionInfo from '../../../common/cached_data/SessionInfo';

const ImageCSS = {
    display: 'block',
    position: 'absolute',
    padding: '0',
    top:'50',
    left: '50',
    height: 'auto',
    width: '200px',
    'z-index': '10',
}

const HiddenImageCSS = {
    display: 'none',
}

class SearchResultElement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            boxStyle: {
                border: '1px orange solid',
                position: 'relative',
                display: 'flex',
                left: '0',
                right:'0',
                margin: '0 0 0 0',
                backgroundColor: 'white',
                color: 'black'
            },
            titleBox:  {
                position: 'relative',
                left: '0',
                height: '100%',
                width: '70%'
            },
            selectBox:  {
                position: 'relative',
                right: '0',
                height: '100%',
                width: '30%',
            },
            nonfoilBox: {
                border: '1px black dotted',
                position: 'relative',
                width: '100%',
                margin: '0'

            },
            foilBox: {
                border: '1px black dotted',
                position: 'relative',
                width: '100%',
                margin: '0'
                
            },
            imageCSS: HiddenImageCSS,
            collectionID: SessionInfo.getCollectionID()
        }
    }

    handleMouseEnter = e => {
        e.preventDefault()
        let newBoxStyle = {...this.state.boxStyle}
        newBoxStyle.backgroundColor = 'blue'
        newBoxStyle.color = 'white'
        this.setState({
            boxStyle: newBoxStyle
        })
        this.showImage()
    }

    handleMouseLeave = e => {
        e.preventDefault()
        let newBoxStyle = {...this.state.boxStyle}
        newBoxStyle.backgroundColor = 'white'
        newBoxStyle.color = 'black'
        this.setState({
            boxStyle: newBoxStyle
        })
        this.hideImage()
    }
    handleCardMouseDown = e => {
        e.preventDefault()
        let newBoxStyle = {...this.state.nonfoilBox}
        newBoxStyle.backgroundColor = 'grey'
        newBoxStyle.color = 'white'
        this.setState({
            nonfoilBox: newBoxStyle,
        })
    }

    handleFoilMouseDown = e => {
        e.preventDefault()
        let newBoxStyle = {...this.state.foilBox}
        newBoxStyle.backgroundColor = 'grey'
        newBoxStyle.color = 'white'
        this.setState({
            foilBox: newBoxStyle,
        })
    }

    handleCardMouseUp = e => {
        e.preventDefault()
        let newBoxStyle = {...this.state.nonfoilBox}
        let newFoilBoxStyle = {...this.state.foilBox}
        newBoxStyle.backgroundColor = undefined
        newBoxStyle.color = undefined
        newFoilBoxStyle.backgroundColor = undefined
        newFoilBoxStyle.color = undefined
        this.setState({
            nonfoilBox: newBoxStyle,
            foilBox: newFoilBoxStyle
        })
    }
    selectFoil = e => {
        e.preventDefault()
        fetch('/api/collections/add-card-to-collection', 
            { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({chosenIsFoil: true, set: this.props.item.set, set_id: this.props.item.set_id, collectionID: this.state.collectionID})
            }
        ).then((res) => {
            this.props.updateTopmostState()
        })
    }
    
    selectCard = e => {
        e.preventDefault()
        fetch('/api/collections/add-card-to-collection', 
        { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({chosenIsFoil: false, set: this.props.item.set, set_id: this.props.item.set_id, collectionID: this.state.collectionID})
        }).then((res) => {
            return res.json();
        }).then((body) =>{
            this.props.updateTopmostState()
        })

    }

    showImage = () => {
        this.setState({
            imageCSS: ImageCSS
        })
    }

    hideImage = () => {
        this.setState({
            imageCSS: HiddenImageCSS
        })
    }

    render() {
        return (     
                <div style={this.state.boxStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                        {this.props.item.image_uris?
                                <img src={this.props.item.image_uris.border_crop} alt={this.props.item.name} style={this.state.imageCSS}></img>:
                                null
                        }
                        <div style={this.state.titleBox}>
                            <div style={{width:'100%', height: '100%'}}>{`${this.props.item.name} (${this.props.item.set_name})`}</div>
                        </div>
                        <div style={this.state.selectBox} onMouseEnter={this.hideImage} onMouseLeave={this.showImage}>
                            {this.props.item.nonfoil ? (
                                <div type= "button" 
                                        style={this.state.nonfoilBox} 
                                        onMouseDown={this.handleCardMouseDown}
                                        onMouseUp={this.handleCardMouseUp}
                                        onClick={this.selectCard}>
                                            Add Card {this.props.item.prices.usd === null ? 
                                                    "(Price Unavailable)":`(USD$${this.props.item.prices.usd})`}
                                </div>
                            ) :null}
                            
                            {this.props.item.foil ? (
                                <div type= "button" 
                                        style={this.state.foilBox}
                                        onMouseDown={this.handleFoilMouseDown}
                                        onMouseUp={this.handleCardMouseUp}
                                        onClick={this.selectFoil}>
                                            Add Foil Card {this.props.item.prices.usd_foil === null ? 
                                                            "(Price Unavailable)": `(USD$${this.props.item.prices.usd_foil})`}
                                </div>
                            ): null}
                        </div>
                </div>
        )
    }
} 

export default SearchResultElement;