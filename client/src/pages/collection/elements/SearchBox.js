import React, { Component } from 'react';
import SearchResultElement from './SearchResultElement'
import callAPI from './../../../common/functions/CallAPI'
import "./../css/Collection.css"


/*CardSearchBox*/
class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            formControls: { cardName: { value: '' } },
            searchResultsList: [],

        }
    }

    componentDidCatch(error, info) {
        alert("SearchBox " + error + info)
    }

    changeHandler = e => {
        e.preventDefault()
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            }
        },
            () => {
                callAPI(
                    '/api/cards/query-card',
                    (resp, err) => {
                        if (err) {
                            alert(err)
                        } else {
                            if (!(JSON.stringify(resp) === JSON.stringify(this.state.searchResultsList))) {
                                this.setState({ searchResultsList: resp });
                            }
                        }
                    },

                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.state)
                    }
                )
                    .catch((err) => {
                        alert(err);
                    })
            });
    }

    renderSearchBox = () => {
        return (
            <div>
                <div style={{ backgroundColor: 'gray' }}>
                    <div>
                        {"Search Card:  "}
                        <input type="text"
                            name="cardName"
                            value={this.state.formControls.cardName.value}
                            onChange={this.changeHandler}
                            style={{ width: '70%', right: 0 }}
                        />
                    </div>
                </div>
                <div style={{ backgroundColor: 'gray', height: '2px' }} />
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderSearchBox()}
                <div class='searchbox_dropdown'>
                    {this.state.searchResultsList.map((item) => {
                        return (<SearchResultElement item={item} updateTopmostState={this.props.updateState} />)
                    })}
                </div>
            </div>
        );
    }
}





export default SearchBox;