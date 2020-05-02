import React, {Component} from 'react'
import '../css/Listing.css'

class FileUploadPopupBody extends Component {

    constructor(props){
        super(props);
        this.state = {
            filename: '',
            file: null,
            fileContent: null,
            submittable: false
        }
    }

    componentDidCatch(error, info) {
        alert("FileUploadPopupBody " + error+ info)
    }

    render() {
        return(
            <div>
                {this.renderSearchBox()}
                {this.renderResults()}      
            </div>
        );
    }
    
    //Render methods

    renderSearchBox = () => {
        return(
            <div>
            <div style={{backgroundColor: 'gray'}}>
                        <div style={{display:'inline'}}>
                            {"Upload List:  "}
                            <input  type="file" 
                                    name="filelist" 
                                    value={this.state.filename} 
                                    accept=".txt,.csv,.json"
                                    onChange={this.handleChange} 
                                    style= {{width: '70%', right: 0}}
                            />
                        </div>
                        <div style={{display:'inline'}}>
                            <button onClick={this.handleSubmit} disabled={!this.state.submittable}>Submit</button>
                        </div>
            </div>
            <div style={{backgroundColor: 'gray', height: '2px'}}/>
            </div>
        )
    }

    renderResults = () => {
        return(
            <div class='popup_search_dropdown'>
                {this.state.fileContent}
            </div> 
        )
    }

    //Loader Methods

    loadFileContent = () => {
        let reader = new FileReader()
        reader.onload = (e) => {
            this.setState({ 
                fileContent: reader.result
            }); 
        }
        if (this.state.file) {
            reader.readAsText(this.state.file);
        }
    }

    //Handler methods

    handleChange = event => {
        event.preventDefault()
        const value = event.target.files[0];
        const filename = event.target.value;
        
        this.setState({
            filename: filename,
            file: value,
            submittable: true
        }, this.loadFileContent);  
    }

    handleSubmit = event => {
        event.preventDefault()
        this.props.setFileUploadThenTogglePopup(this.state.file)
    }

    //Binded methods

}


export default FileUploadPopupBody;