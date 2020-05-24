import React, {Component} from 'react'

class CollectionPageNavPanel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            lastDisabled:true,
            nextDisabled:true
        }
    }
    
    render() {
        this.loadDisabled()
        return(this.renderNavPanel())
    }

    //Render Methods

    renderNavPanel = () => {
        return(
            <div class='collection_title'>
                <div style={{width: '10%'}} class='nav_panel_elements'>
                    <button onClick={this.props.handleLastPage} disabled={this.state.lastDisabled}>Previous Page</button>
                </div>
                <div style={{width: '80%'}} class='nav_panel_elements'>
                    <div>Page</div>
                    <div>{this.props.currPage}</div>
                    <div>/{Math.ceil(Math.max(1, this.props.totalElems/this.props.elemPerPage))}</div>
                </div>
                <div style={{width: '10%'}} class='nav_panel_elements'>
                    <button onClick={this.props.handleNextPage} disabled={this.state.nextDisabled}>Next Page</button>
                </div>
            </div>)
    }

    renderPageNavigator = () => {
        return(
            <input
                type="range"
                min = "1"
                name="desc"
                value={this.props.currPage}
                onChange={this.handleChange}
                max = {Math.max(1, this.props.totalElems/this.props.elemPerPage)}
            />
        )

    }
    //Loader Methods

    loadDisabled = () => {
        let last = (this.props.currPage === 1)? true: false
        let next = (this.props.currPage < Math.ceil(this.props.totalElems/this.props.elemPerPage))? false: true
        if (!(next === this.state.nextDisabled && last === this.state.lastDisabled)) {
            this.setState({
                nextDisabled: next,
                lastDisabled: last
            })
        }
    }

}

export default CollectionPageNavPanel