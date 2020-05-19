import React, {Component} from 'react';

/*
This class handles general download fetch requests
*/
class DownloadPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: 'Downloading Data...'
        }
    }
    
    componentDidMount() {
        //read params and reconstructs it as API uri
        let params = this.readURLAsJSONAPIString();
        let fetchpath = '/api/'.concat(JSON.parse(params).func);

        //fetch download (needs more work)
        fetch(fetchpath).then((res) => {
            return res.json();
        }).then((res) =>
            {
                alert(res);
            }
        );

        //automatically pushes back into homepage (will be goback() if that is implementable)
        this.props.history.goBack();      
    }

    readURLAsJSONAPIString() {
		var params = '';
		params = (window.location.href).split('?').slice(1).map((item) =>
		{
			var items;
            items = item.replace('%2F', '/').split('=');
			params = params.concat(',"' + items[0] + '":"' + items[1] + '"');
			return params;
		}
	);
		params = params.toString().substring(1);
		params = '{'+ params + '}';
		return params
    }
    
    render() {
        return(
            <div>{this.state.redirect}</div>
        );
    }


}

export default DownloadPage;