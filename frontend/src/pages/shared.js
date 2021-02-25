import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import FileShow from '../components/FileShow';
import useFileDownloader from '../hooks/useFileDownloader';
import SelecingFiles from '../components/sharedFileSlecting';

function SharedPage() {

    const token = JSON.parse(localStorage.getItem('tokens'));
    const [files, setFiles] = useState([]);
    const [selected, setSelected] = useState({
        name: null,
        file: null,
        filename: null,
        is_image: false,
      });
    const [fileshow, setFileshow] = useState(false);
    const [selectingFiles, setSelectingFiles] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [downloadFile, donwloadfolder,downloaderComponent] = useFileDownloader();

    const download = (file) => downloadFile(file);


    function  downloadFunction(name, path, filename, is_image) {
        const fileDown = {
        name: name,
        file: path,
        filename: filename,
        is_image: is_image
        };

        download(fileDown)
    }

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/getshared/${token.id}`)
            .then((response) => {
                if(response.status === 200) {
                    setFiles(response.data);
                }
            })
    }, []);

    function fileShowing(filePath, fileName, is_image, fileId) {
        setFileshow(!fileshow);
        setSelected({
          name: fileName,
          file: filePath,
          is_image: is_image,
          fileId: fileId
        })
      }

    function downloadSelected() {
        selectedFiles.forEach(async file => {
          download(file)
        })
    }

    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <Navbar page={"shared"} />
            <div className='flex-auto bg-white'>
                <div className="w-full flex flex-col p-6">
                    <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                        <div className="flex flex-row items-end space-x-4">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input className="outline-none sm:w-96 w-5/6 p-0 text-md" type="text" placeholder="Search..." />
                        </div>
                        <div className="flex flex-row items-end space-x-2">
                            {selectingFiles ? (
                                    <button className="focus:outline-none" onClick={downloadSelected}>
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    </button>
                            ):null}
                            <button className="focus:outline-none" onClick={()=> setSelectingFiles(!selectingFiles)}>
                                <svg class={selectingFiles ? "w-6 h-6 text-cornblue-400 feather feather-check-circle" : "w-6 h-6 feather feather-check-circle"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </button>
                            <button className="focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            </button>
                            <button className="focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>   
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 text-xl font-bold">Shared with me</h1>
                    <>
                    
                        {!selectingFiles ? (
                            <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                            {files.length > 0 && (
                                <>
                                {files.map(file => (
                                    <div className="border border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white" >
                                        <div className="flex flex-row items-center">
                                            <a className="flex-auto cursor-pointer" onClick={()=> fileShowing(file.path, file.name, file.is_image, file.file_id)}>
                                                <div className="p-3 space-y-4">
                                                    <div className="flex flex-row items-center space-x-2">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                        <strong className="text-sm font-normal">{file.name}</strong>
                                                    </div>
                                                </div>
                                            </a>
                                            <div className="flex-none flex flex-row space-x-2 mr-2">
                                                <button className="focus:outline-none" onClick={() => downloadFunction(file.name, file.path, file.name, file.is_image)}>
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </>   
                                )}
                            </div>
                        ): (
                            <SelecingFiles setSelected={setSelectedFiles} />
                        )}
                    </>
                </div>
                {fileshow ? (     
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <div className="absolute right-0 top-0 h-screen 2xl:w-1/4 w-96  text-cornblue-200 bg-white border-l border-r border-gray-400 overflow-y-auto">
                                <div className="h-16 bg-cornblue-400 flex flex-row justify-center items-center border-b">
                                    <button className="absolute right-0 pr-2" onClick={() => setFileshow(false)}>
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                    <div className="flex-none">
                                        <h1 className="font-semibold">{selected.name}</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col p-2 space-y-8 justify-center items-center">
                                    <>
                                    {selected.is_image ? <img src={'http://localhost:3030' + selected.file} /> : <h1>No preview to see</h1>}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                {downloaderComponent}
            </div>
        </div>
    )
} 

export default SharedPage;