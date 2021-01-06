import React, { Component } from 'react';
import Axios from 'axios';

class File extends Component {
    
    constructor(props) {
        super(props);
        this.folderId = props.folderId;
        this.fileshowing = props.fileShowing;
        this.state = {
            files: [],
            file: null,
        }
    }

    componentDidMount() {
        Axios({method: 'GET', url:`http://${process.env.REACT_APP_HOST_IP}:3030/folders/folder/` + this.folderId})
          .then(res => {
            if(res.status === 200) {
              if(res.data !== "no data") {
                const files = res.data;
                this.setState({ files });
              } 
            }
        });
    }
       
    render() {

        return (
            <div>
            {this.state.files.map((file => {
                return (
                    <div className="border-b">
                        <div className="flex flex-row items-center border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100">
                            <a className="flex-auto cursor-pointer " onClick={() => {
                                this.fileshowing(file.path, file.name, file.is_image, file.file_id);
                            }}>
                                <div className="p-3 space-y-4">
                                    <div className="flex flex-row items-center space-x-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <strong className="flex-grow text-sm font-normal">{file.name}</strong>
                                    </div>
                                </div>
                            </a>
                            <div className="flex-none flex flex-row space-x-2 mr-2">
                                <button onClick={() => {
                                    this.props.downloadFunction(file.name, file.path, file.name, file.is_image)
                                }}>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </button>
                                <button onClick={()=>this.props.deletefile(file.file_id)}>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }))}
            
            </div>
        )
    }
}

export default File;