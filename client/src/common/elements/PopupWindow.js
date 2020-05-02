import React, {Component} from 'react'
import '../css/PopupWindow.css'



class PopupWindow extends Component {

    render() {
        return(
            <div class='popup_outer'>
                <div class='popup_body'>
                    <div class='popup_main_panel'>
                        <div class='popup_result_panel'>
                            {this.props.content}
                        </div>
                    <button onClick={this.props.closePopup}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default PopupWindow