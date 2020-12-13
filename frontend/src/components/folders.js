import React from 'react';
import axios from 'axios';

class FolderList extends React.Component {
    state = {
        folders: []
    }
    
    componentDidMount() {
    const token = JSON.parse(localStorage.getItem('tokens'));
    axios({method: 'GET', url:`http://192.168.1.50:3030/folders/${token.id}`})
        .then(res => {
        const folders = res.data;
        this.setState({ folders });
        })
    }

    render() {
        return (
        <>
            {this.state.folders.map(folder => (
                <a class="block border-b" href="#">
                    <div class="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                        <div class="flex flex-row items-center space-x-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            <strong class="flex-grow font-normal">{folder.name}</strong>
                        </div>
                    </div>
                </a>
            ))}
        </>
        )
    }
}

export default FolderList;