import React, { Component } from 'react';
import {HomeButton, CollectionListButton} from '../../common/elements/CommonButtons'
import SessionInfo from '../../common/cached_data/SessionInfo'
import CardImagePanel from '../../common/images/CardImagePanel'
import SearchPopupWindow from './elements/SearchPopupWindow'
import './css/Listing.css'

class CreateCollectionPage extends Component {

  constructor(props) {
      super(props);
      this.state = {
        formControls: { name: { value: '' },desc: { value: ''}, preview:{ value: 0}},
        postResponse: '',
        userID: SessionInfo.getSessionUserID(),
        showPopup: false
  }}

  componentDidCatch(error, info) {
    alert("CreateCollectionPage " + error + info)
  }

  render() {
    return(
      <div>
      {this.renderForm()}
      {this.state.showPopup ? 
        <SearchPopupWindow 
                closePopup={this.togglePopup.bind(this)}
                defaultPreview={this.state.formControls.preview}
                setPreviewThenTogglePopup={this.setPreviewThenTogglePopup.bind(this)}
        />
        : null
      }
      </div>
  )}

  //Render Methods

  renderForm() {
    return (
      <form method="post" onSubmit={this.handleSubmit}>
        <title>Create Collection</title>
        <div>Create a New Collection</div>
        <div>Name:</div>
        <input type="text" 
          name="name" 
          value={this.state.formControls.name.value} 
          onChange={this.handleChange} 
        />
        <div>Description:</div>
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
          <CardImagePanel id={this.state.formControls.preview.value} paramsType="id" imgType={{type:'art_crop'}}/>
        </div>
        <button onClick={this.handleCardSearch}>Search Card</button>
        <div>
          <button type="submit">Submit</button>
          <HomeButton/>
          <CollectionListButton/>
        </div>
    {this.state.postResponse}
  </form>   
  );}

  //Handler Methods

  handleSubmit = e => {
      e.preventDefault();
      fetch('/api/collections/submit-creation-form', 
              { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(this.state)
              }
            )
      .then((res) =>{return res.json();})
      .then((res) =>{
          if (res === -2) {
              this.setState({postResponse: 'Collection not created.'})
          } else if (res === -1) {
              this.setState({postResponse: 'Name cannot be empty.'})
          } else if (res === -3) {
              this.setState({postResponse: 'Something wrong happened. Please relog in and try again.'})
          } else {
              this.props.history.push({
                  pathname: '/collections',
                  search: '?page=default',
                  state: {page: "default"}
  })}})}

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      formControls: {
          ...this.state.formControls,
          [name]: {
          ...this.state.formControls[name],
          value
  }}})}
    
  handleCardSearch = e =>{
      e.preventDefault()
      this.togglePopup()
  }

  //Binded Methods

  togglePopup = () => {
      this.setState({
        showPopup: !this.state.showPopup
  });}

  setPreviewThenTogglePopup = (id, previewCardName) =>{
      let newformControls = {...this.state.formControls}
      newformControls.preview.value = id
      this.setState({
              showPopup: !this.state.showPopup,
              formControls: newformControls,
              previewCardName: previewCardName
  })}
  
 };

export default CreateCollectionPage;