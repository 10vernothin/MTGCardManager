import React, { Component } from 'react';
import { HomeButton, CollectionListButton } from '../../common/elements/CommonButtons'
import SessionInfo from '../../common/cached_data/SessionInfo'
import CardImagePanel from '../../common/images/CardImagePanel'
import PopupWindow from '../../common/elements/PopupWindow'
import SearchPopupBody from './elements/SearchPopupBody'
import FileUploadPopupBody from './elements/FileUploadPopupBody'
import './css/Listing.css'

class CreateCollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formControls: { name: { value: '' }, desc: { value: '' }, preview: { value: 0 } },
      postResponse: '',
      userID: SessionInfo.getSessionUserID(),
      showPopup: false,
      file: null
    }
  }

  componentDidCatch(error, info) {
    alert("CreateCollectionPage " + error + info)
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderPopup()}
      </div>
    )
  }

  //Render Methods

  renderForm() {
    return (
      <form method="post" onSubmit={this.handleSubmit}>
        <title>Create Collection</title>
        <h1>Create a New Collection</h1>
        <div>Name:</div>
        <input type="text"
          name="name"
          cols= "35"
          value={this.state.formControls.name.value}
          onChange={this.handleChange}
        />
        <div>Description (Optional):</div>
        <textarea type="text"
          name="desc"
          value={this.state.formControls.desc.value}
          onChange={this.handleChange}
          cols="35"
          wrap="soft"
        />
        <div>
          Upload Custom List (Optional):
        </div>
        <div>
          <i>{this.state.file? this.state.file.name: null}</i>
        </div>
        <div>
          {!this.state.file? 
            <button onClick={this.handleFileUpload}>Upload File</button>: 
            <button onClick={this.handleFileUpload}>Change File</button>}
          {this.state.file? <button onClick={this.handleClearFile}>Clear File</button>: null}
        </div>
        <div> Add Preview Card (Optional): </div>
        <div>
        <button onClick={this.handleCardSearch}>Search Card</button>
        </div>
        <div>
          {`ID: ${this.state.formControls.preview.value}`}
         
        </div>
        <div class='preview_panel'>
          <CardImagePanel id={this.state.formControls.preview.value} paramsType="id" imgType={{ type: 'art_crop' }} />
        </div>
        
        <div>
          <button type="submit">Submit</button>
          <HomeButton />
          <CollectionListButton />
        </div>
        {this.state.postResponse}
      </form>
    );
  }

  renderPopup = () => {
    var Popup;
    switch (this.state.showPopup) {
      case 1:
        Popup = <PopupWindow
          closePopup={this.togglePopup.bind(this)}
          content={<SearchPopupBody
            setPreviewThenTogglePopup={this.setPreviewThenTogglePopup.bind(this)}
            defaultPreview={this.state.formControls.preview} />}
        />
        break;
      case 2:
        Popup = <PopupWindow
          closePopup={this.togglePopup.bind(this)}
          content={<FileUploadPopupBody
                      setFileUploadThenTogglePopup={this.setFileUploadThenTogglePopup.bind(this)}/>}
        />
        break;
      default:
        Popup = null
    }
    return (Popup)
  }

  //Handler Methods

  handleSubmit = e => {
    e.preventDefault();
    fetch('/api/collections/submit-creation-form',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      }
    )
      .then((res) => { return res.json(); })
      .then((res) => {
        if (res === -2) {
          this.setState({ postResponse: 'Collection not created.' })
        } else if (res === -1) {
          this.setState({ postResponse: 'Name cannot be empty.' })
        } else if (res === -3) {
          this.setState({ postResponse: 'Something wrong happened. Please relog in and try again.' })
        } else {
          this.props.history.push({
            pathname: '/collections',
            search: '?page=default',
            state: { page: "default" }
          })
        }
      })
  }

  handleChange = event => {
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
    })
  }

  handleCardSearch = e => {
    e.preventDefault()
    this.togglePopup(1)
  }

  handleFileUpload = e => {
    e.preventDefault()
    this.togglePopup(2)
  }

  handleClearFile = e => {
    e.preventDefault()
    this.setState({
      file: null
    });
  }

  //Binded Methods

  togglePopup = (flag = false) => {
    this.setState({
      showPopup: flag
    })
  }

  setPreviewThenTogglePopup = (id, previewCardName) => {
    let newformControls = { ...this.state.formControls }
    newformControls.preview.value = id
    this.setState({
      showPopup: false,
      formControls: newformControls,
      previewCardName: previewCardName
    })
  }

  setFileUploadThenTogglePopup= (file) => {
    this.setState({
      file: file,
      showPopup: false
    })
  }

};

export default CreateCollectionPage;