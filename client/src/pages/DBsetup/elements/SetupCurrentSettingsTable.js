import React, { Component } from 'react';
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
            currentSetting: '',
            report: ''
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
                    <div
                        class={
                            `cell ${this.state.currentSetting.STATUS === 'working' ?
                                "font_green" : this.state.currentSetting.STATUS === 'not working' ?
                                    'font_orange' : "font_red"} bold`}
                    >
                        {this.state.currentSetting.STATUS === 'working' ?
                            "ONLINE, WORKING" : this.state.currentSetting.STATUS === 'not working' ?
                                "ONLINE, FAILED TABLE INTEGRITY TEST" : "OFFLINE"}
                    </div>
                </div>
            </div>
        )
        return table

    }

    //Loader Methods

    loadDefault = () => {
        if (this.props.defaultResult) {
            let newcurrentSetting = {
                HOST: this.props.defaultResult.host.value,
                PORT: this.props.defaultResult.port.value,
                DB: this.props.defaultResult.database.value,
                USER: this.props.defaultResult.user.value,
                STATUS: this.props.defaultResult.status.value
            }
            if (!(JSON.stringify(newcurrentSetting) === JSON.stringify(this.state.currentSetting))) {
                this.setState({
                    currentSetting: newcurrentSetting,
                    report: this.props.defaultResult.report.value
                })
            }
        }
    }

    //Handler Methods

}

export default SetupCurrentSettingsTable;