import React, { Component } from 'react';

class SwitchToListViewButton extends Component {
    render() {
        return (<button onClick={this.props.onClick}>Switch to List View</button>)
    }
}

class SwitchToFullViewButton extends Component {
    render() {
        return (<button onClick={this.props.onClick}>Switch to Detailed View</button>)
    }
}

export {
    SwitchToListViewButton,
    SwitchToFullViewButton
}