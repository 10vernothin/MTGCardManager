import React, {Component} from 'react'
import '../css/SearchPopup.css'
import SearchPopupBody from './SearchPopupBody'


class SearchPopupWindow extends Component {

    render() {
        return(
            <div class='popup_outer'>
                <div class='popup_body'>
                    <div class='main_panel'>
                        <div class='result_panel'>
                            <SearchPopupBody 
                            submitPreviewCardIntoDatabase={this.props.submitPreviewCardIntoDatabase}
                            togglePopup={this.props.togglePopup}/>
                        </div>
                    <button onClick={this.props.closePopup}>Back</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default SearchPopupWindow