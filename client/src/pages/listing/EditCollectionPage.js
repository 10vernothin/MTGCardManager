import React, { Component } from 'react';
import { HomeButton, CollectionListButton } from '../../common/elements/CommonButtons'
import SessionInfo from '../../common/cached_data/SessionInfo'
import readCurrURLParamsAsJSON from '../../common/functions/ReadCurrURLParamsAsJSON'
import PopupWindow from '../../common/elements/PopupWindow'
import CardImagePanel from './../../common/images/CardImagePanel'
import SearchPopupBody from './elements/SearchPopupBody'
import { PopupButton } from './elements/Buttons'
import './css/Listing.css'
import callAPI from '../../common/functions/CallAPI';

class EditCollectionPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userID: SessionInfo.getSessionUserID(),
            collectionID: readCurrURLParamsAsJSON().id,
            formControls: {
                name: { value: '' },
                desc: { value: '' },
                preview: { value: '' }
            },
            previewCardName: 'NONE',
            postResponse: '',
            showPopup: false
        }
    }

    componentDidCatch(error) {
        alert("EditCollectionPage " + error)
    }

    componentDidMount() {
        this.loadDefaultValue()
    }

    render() {
        return (
            <div>
                {this.renderForm()}
                {this.renderPopupWindow()}
            </div>
        );
    }

    //Render Methods

    renderForm = () => {
        return (
            <div>
                <form method="post" onSubmit={this.handleSubmit}>
                    <title>Edit Collection</title>
                    <div>Edit Collection</div>
                    <div> Name: </div>
                    <input type="text"
                        name="name"
                        value={this.state.formControls.name.value}
                        onChange={this.handleChange}
                    />
                    <div> Description: </div>
                    <textarea type="text"
                        name="desc"
                        value={this.state.formControls.desc.value}
                        onChange={this.handleChange}
                        cols="35"
                        wrap="soft"
                    />
                    <div> Add Preview Card: </div>
                    <div>{`ID: ${this.state.formControls.preview.value}`}</div>
                    <div class='preview_panel'>
                        <CardImagePanel id={this.state.formControls.preview.value} paramsType="id" imgType={{ type: 'art_crop' }} />
                    </div>
                    <PopupButton
                        popup={this.handleCardSearch.bind(this)}
                        text="Search Card" />
                    <div>
                        <button type="submit">Submit</button>
                        <HomeButton />
                        <CollectionListButton />
                    </div>
                    {this.state.postResponse}
                </form>
            </div>
        )
    }

    renderPopupWindow = () => {
        var Popup;
        switch (this.state.showPopup) {
            case 1:
                Popup = <PopupWindow
                    closePopup={this.togglePopup.bind(this)}
                    content={<SearchPopupBody
                        defaultPreview={this.state.formControls.preview}
                        setPreviewThenTogglePopup={this.setPreviewThenTogglePopup.bind(this)}
                    />}
                />
                break;
            default:
                Popup = null
        }
        return (Popup)
    }

    //Loader Methods

    loadDefaultValue = () => {
        callAPI('/api/collections/get-list',
            (json, err) => {
                if (!err) {
                    let obj = json.filter((item) => item.id.toString() === this.state.collectionID)[0]
                    let newFormControls = { ...this.state.formControls }
                    newFormControls.name.value = obj.collection_name;
                    newFormControls.desc.value = obj.description;
                    newFormControls.preview.value = obj.showcase_card_id;
                    this.setState({
                        formControls: newFormControls
                    })
                } else {
                    alert(err)
                }
            },
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            }
        )
    }

    //Handler Methods

    handleSubmit = e => {
        e.preventDefault()
        if (this.state.formControls.name.value.replace(/^\s+$/, '').length === 0) {
            this.setState({ postResponse: "Name cannot be empty!" });
            return null
        }
        callAPI('/api/collections/edit-collection',
            (resp, err) => {
                if (!err) {
                    this.props.history.push({
                        pathname: '/collections',
                        search: '?page=default',
                        state: { page: "default" }
                    });
                } else {
                    this.setState({ postResponse: 'Collection not editted. Please try again, or go back to your collections, or login again.' })
                }
            }
            ,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.state)
            }
        )
    }

    handleChange = event => {
        event.preventDefault()
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            formControls: {
                ...this.state.formControls,
                [name]: {
                    ...this.state.formControls[name],
                    value
                }
            }
        });
    }

    handleCardSearch = e => {
        e.preventDefault()
        this.togglePopup(1)
    }

    // Binded Methods

    togglePopup = (flag = false) => {
        this.setState({
            showPopup: flag
        });
    }

    setPreviewThenTogglePopup = (id, previewCardName) => {
        let newformControls = { ...this.state.formControls }
        newformControls.preview.value = id
        this.setState({
            showPopup: !this.state.showPopup,
            formControls: newformControls,
            previewCardName: previewCardName
        })
    }

}



export default EditCollectionPage;