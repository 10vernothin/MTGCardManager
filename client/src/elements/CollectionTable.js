import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddButton extends Component {
    constructor(props) {
        super(pros);
        this.state = {
            activated: false
        }
    }
    render() {
        return(
            <Button disabled = {activated}>+</Button>
        );
    }
}

class CollectionTable extends Component {
    render(){
        return(<AddButton/>);
    }

}

export default CollectionTable;
