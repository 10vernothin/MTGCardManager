import React, { Component } from 'react';
import callAPI from '../../../common/functions/CallAPI'
/*
{
    "host": ,
    "port": ,
    "database": ,
    "user": ,
    "password": 
}
*/


class SetupCurrentSettingsTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSetting: ''
        }
    }

    render() {
        this.loadDefault()
        return (
            <div>{this.renderCurrentSettingsTable()}</div>
        );
    }

    //Render functions


    renderCurrentSettingsTable = () => {
        let table = (
            <div>
                <div id="setup_current_settings_table">
                    <div class="title_cell">HOST</div>
                    <div class="title_cell">PORT</div>
                    <div class="title_cell">DB</div>
                    <div class="title_cell">USERNAME</div>
                    <div class="title_cell">STATUS</div>
                    <div class="cell">{this.state.currentSetting.HOST}</div>
                    <div class="cell">{this.state.currentSetting.PORT}</div>
                    <div class="cell">{this.state.currentSetting.DB}</div>
                    <div class="cell">{this.state.currentSetting.USER}</div>
                    <div class={`cell ${this.state.currentSetting.STATUS? "font_green" : "font_red"} bold`}>
                        {this.state.currentSetting.STATUS ? "WORKING" : "NOT WORKING"}
                    </div>
                </div>
            </div>
        )
        return table

    }

    //Loader Methods

    loadDefault = () => {
        callAPI(
            '/api/DBSetup/get-DB-details',
            (result, err) => {
                if (!err) {
                    let newcurrentSetting = {
                        HOST: result.host.value,
                        PORT: result.port.value,
                        DB: result.database.value,
                        USER: result.user.value,
                        STATUS: result.status.value
                    }
                    if (!(JSON.stringify(newcurrentSetting) === JSON.stringify(this.state.currentSetting))) {
                        this.setState({
                            currentSetting: newcurrentSetting
                        })
                    }
                } else {
                    console.log(err)
                }
            }
        )
    }

    //Handler Methods

}

export default SetupCurrentSettingsTable;