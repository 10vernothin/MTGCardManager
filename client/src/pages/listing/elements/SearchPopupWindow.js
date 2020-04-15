import React, {Component} from 'react'
import '../css/SearchPopup.css'
import SearchPopupBody from './SearchPopupBody'


class SearchPopupWindow extends Component {

    render() {
        return(
            <div class='popup_outer'>
                <div class='popup_body'>
                    <div class='popup_main_panel'>
                        <div class='popup_result_panel'>
                            <SearchPopupBody 
                            setPreviewThenTogglePopup={this.props.setPreviewThenTogglePopup}/>
                        </div>
                    <button onClick={this.props.closePopup}>Back</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default SearchPopupWindow