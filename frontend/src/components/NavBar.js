import React, { useState, useEffect } from 'react';
import '../index.css';
import { useAuth } from '../context/auth';
import { Redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import WarningDialog from './warningDialog';
import ProgressRing from './CircleProgress';

let chunkSize = 1024*1024; // 1MB

function Navbar() {

    const { setAuthTokens } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [foldername, setFoldername] = useState("");
    const [isError, setIsError ] = useState(false); 
    const [files, setFiles] = React.useState(null);
    const [fileUploading, setFileUploading] = React.useState(null);
    const [folderName, setFolderName] = useState(useParams().foldername);
    const [counter, setCounter] = useState(1)
    const [fileToBeUpload, setFileToBeUpload] = useState({})
    const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
    const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
    const [progress, setProgress] = useState(0)
    const [fileSize, setFileSize] = useState(0)
    const [chunkCount, setChunkCount] = useState(0);
    const [filename, setFilename] = useState("");
    const [fileOnSelected, setFileOnSelected] = useState(0);
    const [totalSize, setTotalSize] = React.useState(0);
    const [WarningDialog, setWarningDialog] = useState(false);
    const [msg, setMsg] = useState("");
    const [usersRequestingTotal, setUsersRequestingTotal] = useState(0);
    const token = JSON.parse(localStorage.getItem('tokens'));

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    function logOut() {
        setAuthTokens(null);
        return <Redirect to="/login" />
    }

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/friendrequests/${token.id}`)
            .then((response) => {
                if (response.status === 200) {
                    setUsersRequestingTotal(response.data.length)
                }
            })
    }, [])

    function postItem() {

        axios({method: "POST", url:`http://${process.env.REACT_APP_HOST_IP}:3030/addfolder/${token.id}`, data: {
            name: foldername,
        }}).then(result => {
            if(result.status === 200) {
                setShowModal(false);
            } else {
                setIsError(true)
            }
        }).catch(e => {
            setIsError(true);
        });
    }

    function handleChange(event) {
        if(event.target.files.length > 1) {
            setFileUploading(`${event.target.files.length} selected`);
            setFiles(event.target.files);
        } else {
            setFileUploading(event.target.files[0].name);
            setFiles(event.target.files);
        }
    }

    const firstGetFileContext = () => {
        resetChunkProperties();
        setCounter(1);

        let numb = fileOnSelected;

        if(files[numb].size > 104857600) {
            chunkSize = 10 * 1024 * 1024;
        }

        const token = JSON.parse(localStorage.getItem('tokens'));
        //5368709120 == 5 GB
        //52428800 == 50 MB
        if(totalSize + files[numb].size >= 5368709120 ) {
            setMsg('You have not enough space for this file: ' + files[numb].name);
            setWarningDialog(true)
        } else {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/openStream/${token.id}/${folderName}/${files[numb].name}`, {
                cancelToken: source.token
            })
                .then(async response => {
                    if(response.status === 200) {
                        setFileSize(files[numb].size);

                        const _totalCount = files[numb].size % chunkSize == 0 ? files[numb].size / chunkSize : Math.floor(files[numb].size / chunkSize) + 1;
                        setChunkCount(_totalCount);

                        setFileToBeUpload(files[numb]);
                        setFilename(files[numb].name);
                        //setFileOnSelected(fileOnSelected + 1);
                    }
                });
        }
    }

    const getFileContext = () => {
        resetChunkProperties();
        setCounter(1);

        let numb = fileOnSelected + 1;

        if(files[numb].size > 104857600) {
            chunkSize = 10 * 1024 * 1024;
        }
    
        const token = JSON.parse(localStorage.getItem('tokens'));
        
        if(totalSize + files[numb].size >= 5368709120) {
            setMsg('You have not enough space for this file');
            setWarningDialog(true)
        } else {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/openStream/${token.id}/${folderName}/${files[numb].name}`, {
                cancelToken: source.token
            })
                .then(async response => {
                    if(response.status === 200) {
                        setFileSize(files[numb].size);

                        const _totalCount = files[numb].size % chunkSize == 0 ? files[numb].size / chunkSize : Math.floor(files[numb].size / chunkSize) + 1;
                        setChunkCount(_totalCount);

                        setFileToBeUpload(files[numb]);
                        setFilename(files[numb].name);

                        setFileOnSelected(fileOnSelected + 1);
                    }
                });
        }
    }

    const resetChunkProperties = () => {
        setProgress(0);
        setCounter(1);
        setBeginingOfTheChunk(0);
        setEndOfTheChunk(chunkSize);
        setFileSize(0);
        setChunkCount(0);
        setFileToBeUpload({});
    }

    useEffect(() => {
        if (fileSize > 0) {
            fileUpload(counter);
        }
    }, [fileToBeUpload, progress]);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/directorySize/${token.id}`)
        .then(res => {
            if(res.status === 200) {
                setTotalSize(res.data.total)
            }
      } )
    })

    const fileUpload = () => {
        setCounter(counter + 1);
        if (counter <= chunkCount) {
          var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
          uploadChunk(chunk)
        }
      }

      const uploadChunk = async (chunk) => {
          
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/UploadChunks`, chunk, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                cancelToken: source.token
            });

            const data = response.data;

            if (response.status === 200) {
                let numb = fileOnSelected;
                if(files[numb].size > 104857600) {
                    chunkSize = 10 * 1024 * 1024;
                }

                setBeginingOfTheChunk(endOfTheChunk);
                setEndOfTheChunk(endOfTheChunk + chunkSize);

                if(counter == chunkCount) {
                    console.log('Process is complete, counter', counter)
                    await uploadCompleted();
                } else {
                    var percentage = Math.floor((counter / chunkCount) * 100);
                    setProgress(percentage);
                }
            } else {
                console.log('Error Occurred:', data)
            }
        } catch (error) {
            console.log('error', error)
        }
      }

      const uploadCompleted = async () => {
        if(files.length > 1) {
            setFileOnSelected(fileOnSelected + 1);
        }

        const token = JSON.parse(localStorage.getItem('tokens'));

        let numb = 0;

        if(files.length > 1) {
            numb = fileOnSelected;
        }

        const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/addfiles/${token.id}/${folderName}/${files[numb].name}`, {
            cancelToken: source.token
        });
        if (response.status === 200) {
          setProgress(100);
          if(files.length == 1) {
              setTimeout(() => {
                  resetChunkProperties();
                  setShowModal(false);
                  setFileUploading(null);
                  window.location.reload();
              }, 1000);
          } else {
            if(files.length - 1 === fileOnSelected) {
                setTimeout(() => {
                    resetChunkProperties();
                    setShowModal(false);
                    setFileUploading(null);
                    window.location.reload();
                }, 1000);
            } else {
                setTimeout(() => {
                    getFileContext();
                }, 1000);
            }
          }
        }
      }

    // function cancelHandler() {
    //     resetChunkProperties();
    //     setFiles({});
    //     setFileOnSelected(0);

    //     source.cancel();
    //     window.location.reload();
    // }
    
    return (

      <>
        <div className='flex flex-col flex-none relative w-16 justify-between items-center p-4 bg-gray-100'>
            <div className='flex flex-col items-center space-y-6'>
                <a href="/">
                    <svg className="w-12 h-12" fill="#4299e1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd"></path></svg>
                </a>
                <a className='tooltip' href='/'>
                    <span className='tooltiptext shadow-lg font-semibold'>Collection</span>
                    <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </a>
                <a className='tooltip cursor-pointer' style={{ transition: "all .15s ease" }} onClick={() => setShowModal({
                    showModal: true,
                    name: 'Add Folder',
                    add_folder: true,
                    upload_folder: false,
                    add_files: false
                })}>
                    <span className='tooltiptext shadow-lg font-semibold'>Add Folder</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                </a>
                <botton className="tooltip cursor-pointer" style={{ transition: "all .15s ease" }} onClick={()=> setShowModal({
                    showModal: true,
                    name: 'Add file(s)',
                    add_folder: false,
                    upload_folder: false,
                    add_files: true
                })}>
                     <span className='tooltiptext shadow-lg font-semibold'>Add File(s)</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </botton>
                <botton className="tooltip cursor-pointer" style={{ transition: "all .15s ease" }} onClick={()=> setShowModal({
                    showModal: true,
                    name: 'Upload Folder',
                    add_folder: false,
                    upload_folder: true,
                    add_files: false
                })}>
                     <span className='tooltiptext shadow-lg font-semibold'>Upload Folder</span>
                     <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </botton>
                <a className='tooltip' href="/friendspage">
                    <span className='tooltiptext shadow-lg font-semibold'>Friends</span>
                    <div className="relative w-8 h-8">
                        <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        {usersRequestingTotal != 0 ? (
                            <div class="absolute flex top-0 right-0 h-4 w-4 my-1 border-2 border-gray-100 rounded-full bg-red-400 items-center justify-center z-2">
                                <p className="text-white font-medium text-xs">{usersRequestingTotal}</p>
                            </div>
                        ) : null}
                    </div>
                </a >
                <a className='tooltip' href='/shared'>
                    <span className='tooltiptext shadow-lg font-semibold'>Shared File(s)</span>
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                </a>
                <a className='tooltip' href="/myprofile" >
                    <span className='tooltiptext shadow-lg font-semibold'>My Profile</span>
                    {token.profile_pic != null && <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + token.profile_pic} className="object-cover w-11 h-11 rounded-full hover:opacity-70" />}
                    {token.profile_pic == null && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                </a>
            </div>

            <div className='flex flex-col pb-3 space-y-6'>
                <button className='tooltip' onClick={logOut}>
                    <span className='tooltiptext shadow-lg font-semibold'>Logout</span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </div>
        <>
        {showModal ? (
            <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <form>
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div className="bg-white px-4 pt-5 pb-2 sm:p-1 sm:pt-6 sm:pb-4">
                    <div className="min-w-0 sm:flex sm:items-start">
                        <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-blue-500" id="modal-headline">
                                {showModal.name}
                            </h3>
                            <div className="mt-2">
                                {showModal.add_folder && (
                                    <>
                                        { isError && <p>Please fill foldername in!</p> }
                                        <input type="text" value={foldername} onChange={ (e) => setFoldername(e.target.value) } placeholder="Name..." name="name" className=" h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 block w-full sm:text-sm rounded-md shadow-xl"/>
                                    </>
                                )}
                                {showModal.add_files && (
                                    <>
                                    {progress > 0 && (
                                        <div>
                                            <ProgressBar 
                                                filename={filename}
                                                progress={progress}
                                            />
                                            <div className="mt-2 flex flex-row justify-between">
                                                <p>Completed: {fileOnSelected}/{files == null ? "0" : files.length}</p>
                                                <ProgressRing
                                                     strokeWidth="3"
                                                     sqSize="25"
                                                     percentage={files == null ? 0 : (fileOnSelected/files.length) * 100}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {progress === 0 && (
                                        <>
                                        {folderName == undefined ? (
                                            <p>No Folder Selected</p>
                                        ) : (
                                            <label className="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                                                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                                </svg>
                                                <span className="text-base leading-normal">{ 
                                                    fileUploading != null ? fileUploading : 'Select File(s)'
                                                }</span>
                                                <input type='file' className="hidden" onChange={handleChange} multiple />
                                            </label>
                                        )}
                                        </>
                                    )}
                                    </>
                                )}
                                {showModal.upload_folder && (
                                    <>
                                    {progress > 0 && (
                                        <div>
                                            <ProgressBar 
                                                filename={filename}
                                                progress={progress}
                                            />
                                            <div className="mt-2 flex flex-row justify-between">
                                                <p>Completed: {fileOnSelected}/{files == null ? "0" : files.length}</p>
                                                <ProgressRing
                                                     strokeWidth="3"
                                                     sqSize="25"
                                                     percentage={files == null ? "0" : (fileOnSelected / files.length) * 100}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {progress === 0 && (
                                        <>
                                        {folderName == undefined ? (
                                            <p>No Folder Selected</p>
                                        ) : (
                                            <label className="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                                                <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                                </svg>
                                                <span className="text-base leading-normal">{ 
                                                    fileUploading != null ? fileUploading : 'Select File(s)'
                                                }</span>
                                                <input type='file' className="hidden" onChange={handleChange} multiple webkitdirectory="" directory="" />
                                            </label>
                                        )}
                                        </>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <>

                    {showModal.add_folder ? (
                        <button type="submit" onClick={postItem} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Add
                        </button>
                    ) : (
                        <>
                        {folderName == undefined ? null : (
                            <button type="button" onClick={() => firstGetFileContext()} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Add
                            </button>
                        )}
                        </>
                    )}
                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                    </>
                    </div>
                </div>
                </form>
            </div>
            </div>
        ): null}
        <>
        {WarningDialog ? (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <form>
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-2 sm:p-1 sm:pt-6 sm:pb-4">
                        <div className="min-w-0 sm:flex sm:items-start">
                            <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-red-500" id="modal-headline">
                                Warning!
                            </h3>
                            <div className="mt-2">
                                <p>{msg}</p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="flex flew-row bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" onClick={()=> {
                            setWarningDialog(false)
                            window.location.reload();
                        }} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        ) : null}
        </>
        </>
      </>
    )
}

export default Navbar;