import React, { Component } from 'react';
import PWimage from '../../../common/images/image_src/208_pwSymbol_01.jpg';

class PlaneswalkerSymbol extends Component {
    //Container for the Planeswalker image
    render() {
        return (<img src={PWimage} alt="PW Symbol"/>)
    }
}

export default PlaneswalkerSymbol;