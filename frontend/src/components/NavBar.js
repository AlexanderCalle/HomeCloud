import React, { useState, useEffect } from 'react';
import '../index.css';
import { useAuth } from '../context/auth';
import { Redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import ProgressRing from './CircleProgress';
import useFileUpload from '../hooks/useFileUpload';

let chunkSize = 1024*1024; // 1MB

function Navbar(props) {

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/directorySize/${token.id}`)
          .then(res => {
            if(res.status === 200) {
              var percentage = res.data.totalSizeBytes
              setProgressSpace(percentage)
              setUsedSpace(res.data.totalSize)
            }
          })
      }, [])

    const { setAuthTokens } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [foldername, setFoldername] = useState("");
    const [isError, setIsError ] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")
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
    const [progressSpace, setProgressSpace] = React.useState(0);
    const [usedSpace, setUsedSpace] = React.useState(0);
    const [showModalRequest, setShowModalRequest] = React.useState(false);
    const [usersRequesting, setUsersRequesting] = React.useState([]);
    const [isSuccess, setIsSuccess] = React.useState(null);
    const [succesMessage, setSuccesMessage] = React.useState(null);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const totalCapacity = 26843545600;

    function logOut() {
        setAuthTokens(null);
        return <Redirect to="/login" />
    }

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/friendrequests/${token.id}`)
            .then((response) => {
                if (response.status === 200) {
                    setUsersRequesting(response.data);
                    setUsersRequestingTotal(response.data.length)
                }
            })
        
    }, [])

    function handleUpdateRequest(e, status, FriendsId) {
        e.preventDefault()
        let data;
        if(status === "accept") {
            data = {Status: 1}
        } else {
            data = {Status: 2}
        }
        axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/users/updateRequest/${FriendsId}`, data)
            .then(response => {
                if(response.status === 200) {
                    setShowModalRequest(false);
                    window.location.reload();
                }
            })
    }

    // useEffect(() => {
    //     if(isSucces != null){
        
    //     }
    // }, [])

    // function showMessage(message, isSuccesMessage) {
    //     if(isSuccesMessage) {
    //         setTimeout(() => {
    //             setIsSuccess(true);
    //             setSuccesMessage(message);
    //         }, 2000);
    //     }

    //     if(!isSuccesMessage) {
    //         setTimeout(() => {
    //             setIsSuccess(false);
    //             setSuccesMessage(message);
    //         }, 2000);
    //     }
    // }

    function postItem(e) {
        setIsError(false);
        setErrorMsg("")
        e.preventDefault();
        axios({method: "POST", url:`http://${process.env.REACT_APP_HOST_IP}:3030/folders/addfolder/${token.id}`, data: {
            name: foldername,
        }}).then(result => {
            if(result.status === 200) {
                setShowModal(false);
                //this.props.setShowSuccess(true);
                window.location.reload()
                // showMessage("Folder added successfully", true);
            } else {
                setIsError(true)
            }
        }).catch(e => {
            if(e.response.status === 400) {
                setErrorMsg("Foldername already exists");
                setIsError(true);
            } else {
                setErrorMsg("Please give a name!");
                setIsError(true);
            }
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
        //52428800 == 50 MBs
        if(totalSize + files[numb].size >= totalCapacity) {
            setMsg('You have not enough space for this file: ' + files[numb].name);
            setWarningDialog(true)
        } else {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/openStream/${token.id}/${folderName}/${files[numb].name}`, {
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
        
        if(totalSize + files[numb].size >= totalCapacity) {
            setMsg('You have not enough space for this file');
            setWarningDialog(true)
        } else {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/openStream/${token.id}/${folderName}/${files[numb].name}`, {
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
    }, [])

    const fileUpload = () => {
        setCounter(counter + 1);
        if (counter <= chunkCount) {
          var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
          uploadChunk(chunk)
        }
      }

      const uploadChunk = async (chunk) => {
          
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/files/UploadChunks`, chunk, {
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

        const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/files/addfiles/${token.id}/${folderName}/${files[numb].name}`, {
            cancelToken: source.token
        });
        if (response.status === 200) {
            setProgress(100);
            if(files.length == 1) {
                setTimeout(() => {
                    resetChunkProperties();
                    setShowModal(false);
                    setFileUploading(null);
                    window.location.reload()
                    // showMessage("File added successfully", true);
                }, 1000);
            } else {
                if(files.length - 1 === fileOnSelected) {
                    setTimeout(() => {
                        resetChunkProperties();
                        setShowModal(false);
                        setFileUploading(null);
                        // showMessage("Files added successfully", true);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        getFileContext();
                    }, 1000);
                }
            }
        }
      }
    
    return (

      <>
        <div className='flex flex-col flex-none relative xl:w-72 w-16 z-10 justify-between bg-cornblue-400'>
            {/* { isSuccess != null && <Message succesMessage={succesMessage} isError={isSuccess} />} */}
            <div className='flex flex-col xl:p-4 p-2 space-y-12'>
                <a className='mt-6 flex xl:flex-row items-center xl:space-x-4' href="/">
                    <svg className="xl:relative absolute w-11 h-11 text-cornblue-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd"></path></svg>
                    <h1 className="text-white font-bold text-2xl xl:visible invisible">HomeCloud</h1>
                </a>
                <div className="flex flex-col space-y-1 pb-6 border-b border-cornblue-200">
                    <a className='flex flex-row items-end space-x-3 p-1 h-11 hover:bg-cornblue-600 rounded-md' href='/'>
                        <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Home</p>
                    </a>
                    <a className='flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' href="/friends">
                        <div className="flex flex-row items-end space-x-3">
                            <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Friends</p>
                        </div>
                        {usersRequestingTotal != 0 ? (
                            <div class="flex h-4 w-8 my-1 rounded-full bg-cornblue-200 items-center justify-center z-2 xl:visible lg:invisible">
                                <p className="text-cornblue-400 font-medium text-xs xl:visible invisible">{usersRequestingTotal}</p>
                            </div>
                        ) : null}
                    </a >
                    <a className='flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' href="/chat">
                        <div className="flex flex-row items-end space-x-3">
                        <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                            <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Chats</p>
                        </div>
                        {/* {usersRequestingTotal != 0 ? (
                            <div class="flex h-4 w-8 my-1 rounded-full bg-cornblue-200 items-center justify-center z-2 xl:visible lg:invisible">
                                <p className="text-cornblue-400 font-medium text-xs xl:visible lg:invisible">{usersRequestingTotal}</p>
                            </div>
                        ) : null} */}
                    </a >
                    <a className='flex flex-row items-end space-x-3 p-1 h-11 hover:bg-cornblue-600 rounded-md' href='/shared'>
                        <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                        <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Shared</p>
                    </a>
                </div>
                <div>
                    {props.page === "friends" && (
                        <a className='cursor-pointer -mt-8 flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' onClick={() => setShowModalRequest(true)}>
                            <div className="flex flex-row items-end space-x-3">
                                <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Friends Requests</p>
                            </div>
                            {usersRequestingTotal != 0 ? (
                                <div class="flex h-4 w-8 my-1 rounded-full bg-cornblue-200 items-center justify-center z-2 xl:visible lg:invisible">
                                    <p className="text-cornblue-400 font-medium text-xs xl:visible invisible">{usersRequestingTotal}</p>
                                </div>
                            ) : null}
                        </a >
                    )}
                    {props.page === "folder" && (
                        <a className='cursor-pointer -mt-8 flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' onClick={() => setShowModal({
                            showModal: true,
                            name: 'Add folder',
                            add_folder: true,
                        })}>
                            <div className="flex flex-row items-end space-x-3">
                                <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                                <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Add folder</p>
                            </div>
                        </a >
                    )}
                    {props.page === "file" && (
                    <>       
                        <a className='cursor-pointer -mt-8 flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' onClick={() => setShowModal({
                            showModal: true,
                            name: 'Add file(s)',
                            add_files: true,
                        })}>
                            <div className="flex flex-row items-end space-x-3">
                                <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Add file(s)</p>
                            </div>
                        </a >
                        <a className='cursor-pointer mt-2 flex flex-row items-end justify-between p-1 h-11 hover:bg-cornblue-600 rounded-md' onClick={() => setShowModal({
                            showModal: true,
                            name: 'Upload folder',
                            upload_folder: true,
                        })}>
                            <div className="flex flex-row items-end space-x-3">
                            <svg class="xl:relative absolute w-9 h-9 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                                <p className="text-cornblue-200 font-bold text-xl xl:visible invisible">Upload folder</p>
                            </div>
                        </a >
                    </>
                    )}
                </div>
            </div>
            <div className="flex flex-col space-y-4">
                <div className="w-full xl:p-4 lg:p-2 xl:visible invisible">
                    <div className="flex flex-col pt-6 border-t border-cornblue-200">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cornblue-600 bg-cornblue-200">
                                        Available Space
                                    </span>
                                </div>
                                <div className="flex flex-row items-center space-x-2 text-right">
                                    <span className="text-xs font-bold inline-block text-cornblue-200">
                                        { progressSpace > 0 && usedSpace + '/25 GB' }
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-cornblue-200">
                                <div style={{ width: progressSpace + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cornblue-600"></div>
                            </div>
                    </div>
                </div>
                <div className='flex xl:flex-row flex-col xl:p-4 p-2 py-6 justify-between items-center bg-cornblue-600'>
                    <a className='absolute visible xl:invisible' href="/myprofile">
                        {token.profile_pic != null && <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + token.profile_pic} className="object-cover w-11 h-11 rounded-full hover:opacity-50" />}
                        {token.profile_pic == null && <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    </a>
                    <div className='flex flex-row items-center space-x-3 xl:visible invisible'>
                        <div>
                            {token.profile_pic != null && <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + token.profile_pic} className="object-cover w-11 h-11 rounded-full" />}
                            {token.profile_pic == null && <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        </div>
                        <div className="flex flex-col space-y-0 ">
                            <p className="text-cornblue-200 text-sm font-bold">{token.name}</p>
                            <a className="text-cornblue-200 text-xs" href="/myprofile">View profile</a>
                        </div>
                    </div>
                    <button onClick={logOut}>
                        <svg className="w-8 h-8 text-cornblue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </div>
        </div>
        <>
        {showModalRequest ? (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <form>
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block rounded-xl text-left overflow-hidden bg-white shadow-xl transform align-middle sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="pb-2 sm:pb-4">
                            <div className="w-full min-h-down">
                            <div className="flex items-center justify-center h-9 bg-cornblue-400">
                                <h3 className="text-lg leading-6 font-medium text-cornblue-200" id="modal-headline">
                                    Friend Request(s)
                                </h3>
                                <button onClick={() => setShowModalRequest(false)} className="absolute right-2 text-cornblue-200 focus:outline-none">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="mt-2 overflow-y-auto">
                                {usersRequesting.map(user => (
                                    <>
                                    {token.id != user.id ? (
                                        <div className="block p-2">
                                        <div className={styles.default}>
                                            <div className="flex flex-row items-center justify-between">
                                                <div className="flex flex-row space-x-2">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <strong className="flex-grow font-normal">{user.firstname} {user.lastname}</strong>
                                                </div>
                                                <div className="space-x-2">
                                                    <button onClick={(e) =>  handleUpdateRequest(e, "accept", user.FriendsId)}>
                                                        <svg class="w-6 h-6 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </button>
                                                    <button onClick={(e) =>  handleUpdateRequest(e, "decline", user.FriendsId)}>
                                                        <svg class="w-6 h-6 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ): null}
                                    </>
                                ))}
                            </div>
                        </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        ) : null}
        </>
        <>
        {showModal ? (
            <div className="fixed z-20 inset-0 overflow-y-auto">
            <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block rounded-xl text-left overflow-hidden bg-white shadow-xl transform align-middle sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                    <div className="pb-2 sm:pb-4">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row justify-center items-center h-11 bg-cornblue-400 rounded-t-lg shadow-xl">
                                <h3 className="text-lg leading-6 font-medium text-cornblue-200" id="modal-headline">{showModal.name}</h3>
                                <button onClick={() => setShowModal(false)} className="absolute right-2 text-cornblue-200 focus:outline-none">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <div className="mt-4 px-4">
                                {showModal.add_folder && (
                                    <>
                                        { isError ? (
                                            <>
                                                {errorMsg}
                                            </>
                                        ) : null}
                                        <form onSubmit={(e)=> { e.preventDefault(); postItem(e)}}>
                                            <input type="text" value={foldername} onChange={ (e) => setFoldername(e.target.value) } placeholder="Name..." name="name" className=" h-8 p-2 focus:outline-none border border-gray-500 block w-full text-md rounded-md"/>
                                            <input type="submit" hidden/>
                                        </form>
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
                                            <label className="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-cornblue-200 text-cornblue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-cornblue-400 hover:text-cornblue-200">
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
                                            <label className="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-cornblue-200 text-cornblue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-cornblue-400 hover:text-cornblue-200">
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
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <>

                    {showModal.add_folder ? (
                        <button type="submit" onClick={(e)=> postItem(e)} className="sm:w-28 w-full inline-flex justify-center rounded-lg shadow-sm px-6 py-2 bg-cornblue-400 font-medium text-cornblue-200 hover:bg-cornblue-600 focus:outline-none sm:ml-3 text-sm">
                            Add
                        </button>
                    ) : (
                        <>
                        {folderName == undefined ? null : (
                            <button type="button" onClick={() => firstGetFileContext()} className="sm:w-28 w-full inline-flex justify-center rounded-lg shadow-sm px-6 py-2 bg-cornblue-400 font-medium text-cornblue-200 hover:bg-cornblue-600 focus:outline-none sm:ml-3 text-sm">
                                Add
                            </button>
                        )}
                        </>
                    )}
                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 sm:mt-0 sm:w-28 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-cornblue-200 font-medium text-cornblue-600 focus:outline-none sm:ml-3 text-sm">
                        Cancel
                    </button>
                    </>
                    </div>
                </div>
            </div>
            </div>
        ): null}
        <>
        {WarningDialog ? (
            <div className="fixed z-20 inset-0 overflow-y-auto">
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

const styles = {
    default: "border border-gray-500 p-3 space-y-4 rounded-lg shadow-md",
    selected: "border-l-2 border-blue-500 bg-blue-100 p-3 space-y-4"
}

export default Navbar;
