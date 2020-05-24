import React, {Component} from 'react'

class CollectionPageNavPanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            lastDisabled:true,
            nextDisabled:true,
            maxPages: Math.ceil(Math.max(1, this.props.totalElems/this.props.elemPerPage)),
            navPage: this.props.currPage
        }
    }
    
    render() {
        this.loadDisabled()
        return(this.renderNavPanel())
    }

    //Render Methods

    renderNavPanel = () => {
        return(
            <div class='nav_panel_wrapper'>
            {this.props.totalElems === 0 ? null:
                <div style={{width: '98.3%'}} class='nav_panel_elements'>
                    <div class='nav_inline nav_horizontal_padding'>Page:</div>
                    <div class='nav_inline nav_horizontal_padding'>{this.renderPageNavigator()}</div>
                    <div class='nav_inline'>{`/  ${this.state.maxPages}`}</div>
                </div>
            }
            </div>)
    }

    renderPageNavigator = () => {
        return(
            <select
                value={this.props.currPage}
                onChange={this.handleAnyPage}
                class = 'page_nav_text_input'
            >
            {(new Array(this.state.maxPages)).fill(0).map((_v,index) =>{
                return (<option value={index+1}>{index+1}</option>)
            })
            }
            </select>
        )

    }
    //Loader Methods

    loadDisabled = () => {
        var last = (this.props.currPage === 1)? true: false
        var next = (this.props.currPage < Math.ceil(this.props.totalElems/this.props.elemPerPage))? false: true
        if (!(next === this.state.nextDisabled && last === this.state.lastDisabled)) {
            this.setState({
                nextDisabled: next,
                lastDisabled: last
            })
        }
    }

    //Handler Methods

    handlePrevPage = e => {
        e.preventDefault()
        if (this.props.currPage-1 >= 1 && this.props.currPage-1 <= this.state.maxPages) {
            this.props.handleChangeAnyPage(this.props.currPage-1)
        }
    }

    handleAnyPage = e => {
        e.preventDefault()
        const page = parseInt(e.target.value)? parseInt(e.target.value): ''
        this.props.handleChangeAnyPage(page)
    }

    handleNextPage = e => {
        e.preventDefault()
        if (this.props.currPage+1 >= 1 && this.props.currPage+1 <= this.state.maxPages) {
            this.props.handleChangeAnyPage(this.props.currPage+1)
        }
    }

}

export default CollectionPageNavPanel