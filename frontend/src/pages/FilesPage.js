import '../index.css';
import React, {useEffect} from 'react';
import Transition from '../components/transition';
import Navbar from '../components/NavBar'
import FolderList from '../components/folders';
import File from '../components/files';
import Axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import useFileDownloader from '../hooks/useFileDownloader'
import FileShow from '../components/FileShow';
import SelecingFiles from '../components/SelectingFiles';


function Collection() {
  let history = useHistory();

  const token = JSON.parse(localStorage.getItem('tokens'));

  const [showFolders, setShowFolders] = React.useState(true);
  const [foldername, setFoldername] = React.useState(useParams().foldername);
  const folderId = useParams().folderId;
  const [fileshow, setFileshow] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [rename, setRename] = React.useState(false);
  const [newFoldername, setNewFoldername] = React.useState(foldername);
  const [isfolderWarning, setFoldernameWarning] = React.useState(false);
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [isError, setIsError] = React.useState(null);
  const [newName, setNewName] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [usedSpace, setUsedSpace] = React.useState(0);
  const [showSharedModal, setShowSharedModal] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [friends, setFriends] = React.useState(null);

  const [showSuccess, setShowSuccess] = React.useState(false)

  const [file, setFile] = React.useState({
    name: null,
    file: null,
    filename: null,
    is_image: false,
    created: null
  });

  const [folder, setFolder] = React.useState({
    name: foldername,
    folder: token.id + "/" + foldername,
  });

  useEffect(() => {
    Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/directorySize/${token.id}`)
      .then(res => {
        if(res.status === 200) {
          var percentage = res.data.totalSizeBytes
          setProgress(percentage)
          setUsedSpace(res.data.totalSize)
        }
      })
  })

  const [downloadFile, donwloadfolder, downloaderComponent] = useFileDownloader();

  const download = (file) => downloadFile(file);

  const downloadfolder = (file) => downloadfolder(file);

  function  downloadFunction(name, path, filename, is_image) {
    const fileDown = {
      name: name,
      file: path,
      filename: filename,
      is_image: is_image,
    };

    download(fileDown)
  }

  function fileShowing(filePath, fileName, is_image, fileId, created) {
    const time = created.split('T')[1]
    setFileshow(!fileshow);
    setFile({
      name: fileName,
      file: filePath,
      is_image: is_image,
      fileId: fileId,
      created: created.split('T')[0] + " " + time.split('.')[0]
    })
  }

  function renameFolder(e) {
    e.preventDefault();
    Axios({method: 'POST', url: `http://${process.env.REACT_APP_HOST_IP}:3030/renamefolder/${folderId}`, data: {
      name: newFoldername,
    }}).then(async result => {
      if (result.status === 200) {
        setRename(false);
        await history.push(`/collection/folder/${result.data.name}/${folderId}`);
        window.location.reload();
      } else {
        console.error(result.data)
      }
    }).catch(err => console.log(err));

  }

  function deletefile(fileId) {
    Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/deletefile/${fileId}`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          window.location.reload();
        } else {
          console.error(res.data)
        }
      })
  }

  function deleteFolder(e) {
    e.preventDefault();
    Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/deletefolder/${folderId}`)
      .then(async res => {
        if(res.status === 200) {
          await history.push('/');
          window.location.reload();
        }
      })
  }

  function deleteSelected() {
    selected.forEach(async file => {
      const fileId = file.fileId;

      await deletefile(fileId);
      console.log('deleted');
    })
  }

  function downloadSelected() {
    selected.forEach(async file => {
      download(file)
    })
  }

  function renameFile(file) {
    console.log(file);
    setNewName(file.name)
    setShowModal({
      showModal: true,
      fileId: file.fileId,
      ext: file.ext,
    });
  }

  function submitRename(fileId) {

    const token = JSON.parse(localStorage.getItem('tokens'));
    
    const data = {
      name: newName + '.' + showModal.ext,
      foldername: foldername,
      userId: token.id,
      fileId: showModal.fileId
    }

    Axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/renamefile/${folderId}/${fileId}`, data)
      .then(response => {
        if(response.status === 200) {
          setShowModal(false);
          window.location.reload();
        } else if(response.status === 201){
          setIsError('There is a file with this name in the folder');
        } else {
          setIsError(response.data);
        }
      })

  }

  function onChange(event) {
    setSearchInput(event.target.value)

    if(event.target.value != "") {
      Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/friends/search/${token.id}/${event.target.value}`)
      .then(response => {
        if(response.status === 200) {
          setFriends(response.data)
        }
      })
    } else {
      setFriends(null)
    }
  }

  function shareFile(fileShared, friendId) {
    const data = {
      shared_file: fileShared.fileId,
      user_file: token.id,
      shared_user: friendId,
    }

    Axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/files/sharefile`, data)
      .then(response => {
        if(response.status === 200) {
          setSearchInput("");
          setShowSharedModal(false);
        }
      })
  }

  return (
    <div className='flex flex-row h-screen bg-gray-100'>

      <>
        {/* {showSuccess ? (
          <div className='fixed flex justify-center z-40 w-screen'>
            <div class="flex justify-center items-center m-1 font-medium py-2 px-4 rounded-md text-green-700 bg-green-100 border border-green-700 ">
              <div slot="avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle w-5 h-5 mx-2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
              </div>
              <div class="text-xl font-normal ml-4 max-w-full flex-initial">
                  Folder has been created!
              </div>
            </div>
          </div>
        ) : null} */}
      </>
      
      <Navbar page={"file"} />
      
      <div className='flex flex-row flex-auto bg-white'>
        <div className="w-full flex flex-col p-4">
          <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
            <div className="flex flex-row space-x-4">
              <>
              {rename ? (
                <form className="flex flex-row">
                  <input type="text" value={newFoldername} onChange={ (e) => setNewFoldername(e.target.value) } placeholder="Name..." name="name" className=" h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 block w-full sm:text-sm rounded-md shadow-sm"/>
                  <button onClick={(e) => {renameFolder(e)}} className="h-8 rounded-md border border-transparent shadow-sm px-4 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Rename
                    </button>
                </form>
              ) : (
                <>
                <a className="focus:outline-none text-cornblue-400 flex flex-row space-x-2" href="/">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  Back
                </a>
                <div className="flex flex-row items-end space-x-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input className="outline-none sm:w-96 w-5/6 p-0 text-md" type="text" placeholder="Search..." />
                </div>
                </>
              )}
              </>
            </div>
            <div className="flex flex-row space-x-2">
              {/* {isSelecting && (
                <button onClick={selectAll}>
                  Select All
                </button>
              )} */}
              <button className="focus:outline-none" onClick={() => setIsSelecting(!isSelecting)}>
                <svg class={isSelecting ? "w-6 h-6 text-cornblue-400 feather feather-check-circle" : "w-6 h-6 feather feather-check-circle"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </button>
              <button className="focus:outline-none">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </button>
              {isSelecting && (
                <button onClick={downloadSelected}>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              )}
              {isSelecting && (
                <button onClick={deleteSelected}>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              )}
              {!isSelecting && (
                <button onClick={() => donwloadfolder(folder)}>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              )}
              {!isSelecting && (
                <button onClick={() => setShowSettings(!showSettings)}>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              )}
              
            </div>
          </div>
          <h1 className="mt-4 text-xl font-bold">{foldername}</h1>    
            <div>
              {isSelecting ? (
                <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <SelecingFiles 
                  folderId={folderId}
                  setSelected={setSelected}
                />
                </div>
              ) : (
                <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  <File 
                    downloadFunction={downloadFunction} 
                    deletefile={deletefile} 
                    fileShowing={fileShowing} 
                    fileshow={fileshow} 
                    folderId={folderId}
                    IsSelecting={isSelecting}
                    renameFile={renameFile} 
                  />
                </div>
              )}
            </div>
        </div>
        <>
        {fileshow ? (     
           <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <div className="flex flex-col justify-between absolute right-0 top-0 h-screen 2xl:w-1/4 pb-4 w-96 text-cornblue-200 bg-white border-l border-r border-gray-400 overflow-y-auto">
                      <div>
                        <div className="h-16 bg-cornblue-400 flex flex-row justify-center items-center border-b">
                            <button className="absolute right-0 pr-2" onClick={() => setFileshow(false)}>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <div className="flex-none">
                                <h1 className="font-semibold">{file.name}</h1>
                            </div>
                        </div>
                        <div className="w-full flex flex-col p-2 space-y-4 justify-center text-black items-center">
                            <div className="border-b pb-4">
                            {file.is_image ? <img src={'http://localhost:3030' + file.file} /> : <h1>No preview to see</h1>}
                            </div>
                            <div className="-mt-4 w-full border-b pb-4 px-4 flex flex-col items-start space-y-4">
                              <p>Created on: {file.created}</p>
                              <p>Type file: {file.is_image ? 'Image' : 'Document'}</p>
                            </div>
                            <div className="w-full flex xl:flex-row flex-col justify-center items-center xl:space-x-4 space-x-4 xl:space-y-0 space-y-4 ">
                              <button type="button" onClick={() => setShowSharedModal(true)} className="xl:w-full w-72 inline-flex justify-center rounded-md px-4 py-2 bg-cornblue-400 font-medium text-cornblue-200 hover:bg-cornblue-600 sm:ml-3 text-sm">
                                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                  <p className="ml-2">Share with friend</p>
                              </button>
                              <button type="button" onClick={() => renameFile(file)} className="xl:w-full w-72 inline-flex justify-center rounded-md px-4 py-2 bg-cornblue-400 font-medium text-cornblue-200 hover:bg-cornblue-600 sm:ml-3 text-sm">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                  <p className="ml-2">Rename file</p>
                              </button>
                            </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row justify-center items-center">
                        <button onClick={() => deletefile(file.fileId)} className="flex flex-col space-y-1 items-center text-red-400 font-medium">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          <p>Delete</p>
                        </button>
                      </div>
                  </div>
              </div>
          </div>
        ) : null}
        </>
        <>
          {downloaderComponent}
        </>
      </div>

      <>
        {showSettings ? (
          <div className="absolute flex flex-col justify-center w-52 h-32 bg-gray-100 rounded-md right-2 top-20">
          <button className="block border-b border-t cursor-pointer" onClick={()=> { setRename(true); setShowSettings(false) }}>
            <div className="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
              <div className="flex flex-row items-center space-x-2">
                  <strong className="flex-grow font-normal">Rename</strong>
              </div>
            </div>
          </button>
          <button className="block border-b cursor-pointer" onClick={()=> { setFoldernameWarning(true)}}>
            <div className="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                <div className="flex flex-row items-center space-x-2">
                    <strong className="flex-grow font-normal text-red-500">Delete</strong>
                </div>
            </div>
          </button>
        </div>
        ) : null}
      </>

      <>
        {isfolderWarning ? (
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
                            <p>Are you sure you want to delete this folder?</p>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="flex flew-row bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" onClick={(e)=> deleteFolder(e)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                      Delete
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                      Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
          </div>
        ) : null}
      </>

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
                            Rename file
                          </h3>
                          <div className="mt-2">

                            { isError && <p>Please fill foldername in!</p> }
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name..." name="name" className=" h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 block w-full sm:text-sm rounded-md shadow-xl"/>
                          
                          </div>
                      </div>
                  </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onClick={() => submitRename(showModal.fileId)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Add
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                  </div>
              </div>
            </form>
          </div>
          </div>
      ): null}
      </>
      <>
      {showSharedModal ? (
          <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <form>
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block rounded-xl text-left overflow-hidden bg-white shadow-xl transform align-middle sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                  <div className="pb-2 sm:pb-4">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-center items-center h-11 bg-cornblue-400 rounded-t-lg shadow-xl">
                          <h3 className="text-lg leading-6 font-medium text-cornblue-200" id="modal-headline">Share with friends!</h3>
                          <button onClick={() => setShowSharedModal(false)} className="absolute right-2 text-cornblue-200 focus:outline-none">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                          <div className="p-2">
                            <div className="mt-2 pb-2 border-b">
                              {/* { isError && <p>Please fill foldername in!</p> } */}
                              <div class="pt-2 relative text-gray-800">
                                <input class="border w-full border-gray-500 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                    type="text" name="search" value={searchInput} onChange={(e) => onChange(e)} placeholder="Search for friend..." />
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="max-h-36 overflow-y-auto space-y-2">
                                <>
                                {friends !== null ? (
                                  <>
                                  {friends.map(friend => (
                                    <a className="block cursor-pointer" onClick={()=> shareFile(file, friend.id)}>
                                    <div className="border border-gray-500 hover:border-cornblue-600 hover:bg-cornblue-200 hover:text-white p-2 space-y-4 rounded-lg shadow-md">
                                        <div className="flex flex-row items-center justify-between">
                                            <div className="flex flex-row space-x-2 items-center justify-center">
                                                {friend.profile_pic !== null ? (
                                                    <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + friend.profile_pic} className="object-cover w-8 h-8 rounded-full" />
                                                ) : ( 
                                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                )}
                                                <strong className="font-semibold text-sm">{friend.firstname} {friend.lastname}</strong>
                                            </div>
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                        </div>
                                    </div>
                                  </a>
                                  ))}
                                  </>
                                  ) : null}  
                                  </>
                              </div>
                            </div>
                          </div>
                      </div>
                  </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onClick={() => setShowSharedModal(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Done
                    </button>
                    <button type="button" onClick={() => setShowSharedModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                  </div>
              </form>
              </div>
          </div>
      ): null}
      </>
    </div>
  );
}

const styles = {
  selecting: "px-2 py-1 rounded-md border-2 border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 font-semibold transition duration-300 outline-none focus:outline-none",
  default: "px-2 py-1 rounded-md border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold transition duration-300 outline-none focus:outline-none",
}

export default Collection;
