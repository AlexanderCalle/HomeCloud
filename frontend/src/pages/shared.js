import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';

function SharedPage() {

    const token = JSON.parse(localStorage.getItem('tokens'));
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/getshared/${token.id}`)
            .then((response) => {
                if(response.status === 200) {
                    setFiles(response.data);
                }
            })
    }, [])

    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <Navbar />
            <div className='flex flex-row flex-auto space-y-4 bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-xl'>
                <div className="w-full flex flex-col p-4">
                    <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                        <h1 className="font-bold">Shared File(s)</h1>
                    </div>
                    <div className="flex-auto overflow-y-auto">
                        {files.length > 0 && (
                         <>
                         {files.map(file => (
                             <div className="border-b">
                                <div className="flex flex-row items-center border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100">
                                    <a className="flex-auto cursor-pointer ">
                                        <div className="p-3 space-y-4">
                                            <div className="flex flex-row items-center space-x-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                <strong className="text-sm font-normal">{file.name}</strong>
                                                <p className="text-xs font-light">(By {file.firstname} {file.lastname})</p>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="flex-none flex flex-row space-x-2 mr-2">
                                        <button>
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                         ))}
                         </>   
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default SharedPage;