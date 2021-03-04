import React, { Component } from 'react';
import Axios from 'axios';
import { render } from 'react-dom'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import '../styles/react-contextmenu.css'
import '../styles/custom.css'

const attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
}

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
            <>
            {this.state.files.map((file => {
                return (
                    <>
                    <ContextMenuTrigger id={file.file_id}>
                        <div className="block cursor-pointer border border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white overflow-hidden">
                            <div className="flex flex-row items-center">
                                <a className="flex-auto cursor-pointer" onClick={() => {
                                    this.fileshowing(file.path, file.name, file.is_image, file.file_id, file.created_at);
                                }}>
                                    <div className="p-3 space-y-4">
                                        <div className="flex flex-row items-center space-x-2 overflow-hidden">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                            <strong className="flex-grow text-sm font-normal">{file.name}</strong>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenu id={file.file_id}>
                        <MenuItem
                            data={{ action: 'copy' }}
                            onClick={() => this.props.renameFile(file)}
                            attributes={attributes}
                        >
                        Rename
                        </MenuItem>
                        <MenuItem
                            data={{ action: 'paste' }}
                            onClick={() => this.props.setShowSharedModal(true)}
                            attributes={attributes}
                        >
                        Share file
                        </MenuItem>
                        <MenuItem
                            data={{ action: 'paste' }}
                            onClick={() => this.props.downloadFunction(file.name, file.path, file.name, file.is_image)}
                            attributes={attributes}
                        >
                        Download
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem
                            data={{ action: 'delete' }}
                            onClick={() => this.props.deletefile(file.file_id)}
                            attributes={attributes}
                        >
                        Delete
                        </MenuItem>
                  </ContextMenu>
                  </>
                )
            }))}
            
            </>
        )
    }
}

export default File;