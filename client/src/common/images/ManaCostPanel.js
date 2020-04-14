import React, {Component} from 'react'
import ManaCostWebkit from '../cached_data/ManaCostWebkit'
import replaceManaCostWithSVGSymbol from '../functions/ReplaceManaCostWithSVGSymbol'

class ManaCostPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listofSVGs:[]
        }
        this.listofManaSymbols = ManaCostWebkit.retrieveWebkit()
    }

    updateManaCost = () => {
        let cardObj = this.props.cardObj
        let mana_cost;
        if (cardObj.layout === "transform") {
            mana_cost = cardObj.card_faces.map((obj)=>{
                return(obj.mana_cost)
            }).join('')
        } else if (cardObj.layout === "adventure") {
            mana_cost = cardObj.card_faces.map((obj) => {
                return(obj.mana_cost)
            }).join('//')
        } else {
            mana_cost = cardObj.mana_cost
        }
        mana_cost = mana_cost.split('//').join('{//}')
        if (!(mana_cost === '')) {
            replaceManaCostWithSVGSymbol(mana_cost).then((listURL) =>
            {
                let list=[]
                let listFileName = listURL.map((url) => {
                    if (url === '{//}') {
                        return '//'
                    } else {
                        return url.split(/(\\|\/)/g).slice(-1)[0].trim()
                    }
                })
                let listSVGFiles = this.listofManaSymbols.keys().map((url) => {
                    return url.split(/(\\|\/)/g).slice(-1)[0].trim()
                })
                listFileName.forEach((p) =>{
                    if (p === '//') {
                        list.push('//')
                    } else if (listSVGFiles.includes(p))
                    {
                        let i = this.listofManaSymbols(this.listofManaSymbols.keys().filter((key)=> key.includes(p)))
                        list.push(i)
                    }
                })
                if (!(JSON.stringify(list) === JSON.stringify(this.state.listofSVGs))) {
                    this.setState({
                        listofSVGs: list
                    })
                }
            }).catch((err) => {
                alert(err.message)
            })
        }
    }

    renderManaSymbol = (item) => {
        return (
            <div>
                <object data={item} type="image/svg+xml" style={this.props.size}>
                    <img src={item} alt="imgSym" style={this.props.size}></img>
                </object>
            </div>
        )
    }
    
    render() {
        this.updateManaCost()
        if (this.state.listofSVGs === []) {
            return (null)
        } else {
            return(
                this.state.listofSVGs.map((item) => {
                    if (item === '//') {
                        return <div>{`//`}</div>
                }else {
                    return this.renderManaSymbol(item)
                }}
                )
            )
        }

    }


}

export default ManaCostPanel