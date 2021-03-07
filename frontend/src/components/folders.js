import React from 'react';
import axios from 'axios';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import '../styles/react-contextmenu.css'
import '../styles/custom.css'

const attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
}

class FolderList extends React.Component {
    state = {
        folders: []
    }

    constructor(props) {
        super(props);
        this.getFiles = this.props.getFiles;
    }
    
    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('tokens'));
        axios({method: 'GET', url:`http://${process.env.REACT_APP_HOST_IP}:3030/folders/${token.id}`})
            .then(res => {
            const folders = res.data;
            this.setState({ folders });
        })
    }

    render() {
        return (
        <>
            {this.state.folders.map(folder => (
                <>
                <ContextMenuTrigger id={folder.folder_id} >
                    <a className="block cursor-pointer border p-4 border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white" href={`/collection/folder/${folder.name}/${folder.folder_id}`}>
                        <div className="flex flex-row items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            <strong className="flex-grow font-normal">{folder.name}</strong>
                        </div>
                    </a>
                </ContextMenuTrigger>
                <ContextMenu id={folder.folder_id}>
                    <MenuItem
                        data={{ action: 'paste' }}
                        onClick={() => {
                            this.props.setFoldernameWarning(true)
                            this.props.setFolderId(folder.folder_id)
                        }}
                        attributes={attributes}
                    >
                    Delete
                    </MenuItem>
                </ContextMenu>
                </>
            ))}
        </>
        )
    }
}

const styles = {
    default: "border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4",
    selected: "border-l-2 border-blue-500 bg-blue-100 p-3 space-y-4"
}

export default FolderList;