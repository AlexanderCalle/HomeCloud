import React, { Component } from 'react';
import Axios from 'axios';

class File extends Component {
    
    constructor(props) {
        super(props);
        this.folderId = props.folderId;
        this.fileshowing = props.fileShowing;
        this.state = {
            files: [],
        }

    }
    componentDidMount() {
        Axios({method: 'GET', url:'http://localhost:3030/folders/folder/' + this.folderId})
          .then(res => {
            if(res.status === 200) {
              if(res.data != "no data") {
                const files = res.data;
                this.setState({ files });
              } 
            }
        })
    }


    render() {
        return (
            <div>
            {this.state.files.map((file => (
                <a className="block border-b cursor-pointer" onClick={ () => this.fileshowing(file.path)}>
                    <div className="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                        <div className="flex flex-row items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            <strong className="flex-grow text-sm font-normal">{file.name}</strong>
                        </div>
                    </div>
                </a>
            )))}
            
            </div>
        )
    }
}

export default File;