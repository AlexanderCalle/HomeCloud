import '../index.css';
import React from 'react';
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

  const [file, setFile] = React.useState({
    name: null,
    file: null,
    filename: null,
    is_image: false,
  });

  const [folder, setFolder] = React.useState({
    name: foldername,
    folder: token.id + "/" + foldername,
  })

  const [downloadFile, donwloadfolder, downloaderComponent] = useFileDownloader();

  const download = (file) => downloadFile(file);

  const downloadfolder = (file) => downloadfolder(file);

  function  downloadFunction(name, path, filename, is_image) {
    const fileDown = {
      name: name,
      file: path,
      filename: filename,
      is_image: is_image
    };

    download(fileDown)
  }

  function fileShowing(filePath, fileName, is_image, fileId) {
    setFileshow(!fileshow);
    setFile({
      name: fileName,
      file: filePath,
      is_image: is_image,
      fileId: fileId
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

  return (
    <div className='flex flex-row h-screen bg-gray-100'>
      
      <Navbar />

      <Transition
        show={showFolders}
        enter="transition-all duration-500"
        enterFrom="-ml-64"
        enterTo="ml-0"
        leave="transition-all duration-500"
        leaveTo="-ml-64">
        <div className='w-64 flex-none bg-gray-100 p-4 flex flex-col space-y-4'>
            <div className="flex flex-row flex-none p-4 border-b justify-between items-center mb-6">
              <h1 className="font-semibold text-2xl">Folders</h1>
              <svg class="w-8 h-8 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex-auto overflow-y-auto flex flex-col">
              <FolderList selectedName={foldername} />
            </div>
        </div>
      </Transition>
      
      <div className='flex flex-row flex-auto bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-xl'>
        <div className="w-full flex flex-col p-4">
          <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
            <div className="flex flex-row space-x-2">
            <button onClick={() => setShowFolders(!showFolders)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path></svg>
            </button>
            <>
             {rename ? (
               <form className="flex flex-row">
                 <input type="text" value={newFoldername} onChange={ (e) => setNewFoldername(e.target.value) } placeholder="Name..." name="name" className=" h-8 p-2 focus:ring-blue-500 focus:border-blue-500 border border-blue-500 block w-full sm:text-sm rounded-md shadow-sm"/>
                 <button onClick={(e) => {renameFolder(e)}} className="h-8 rounded-md border border-transparent shadow-sm px-4 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                   Rename
                  </button>
               </form>
             ) : <h1 className="font-bold">{foldername}</h1>}
            </>
            </div>
            <div className="flex flex-row space-x-4">
              <button className={!isSelecting ? styles.default : styles.selecting} onClick={() => setIsSelecting(!isSelecting)}>Select</button>
              {isSelecting && (
                <button onClick={downloadSelected}>
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              )}
              {isSelecting && (
                <button onClick={deleteSelected}>
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              )}
              {!isSelecting && (
                <button onClick={() => donwloadfolder(folder)}>
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              )}
              {!isSelecting && (
                <button onClick={() => setShowSettings(!showSettings)}>
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              )}
              
            </div>
          </div>
          <div className="flex-auto overflow-y-auto">
            <div>
              {isSelecting ? (
                <SelecingFiles 
                  folderId={folderId}
                  setSelected={setSelected}
                />
              ) : (
                <File 
                  downloadFunction={downloadFunction} 
                  deletefile={deletefile} 
                  fileShowing={fileShowing} 
                  fileshow={fileshow} 
                  folderId={folderId}
                  IsSelecting={isSelecting}
                  renameFile={renameFile} 
                />
              )}
            </div>
          </div>
        </div>
        <>
        {fileshow ? (     
          <FileShow setFileshow={setFileshow} file={file} />
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

    </div>
  );
}

const styles = {
  selecting: "px-2 py-1 rounded-md border-2 border-blue-500 bg-blue-500 text-white hover:bg-white hover:text-blue-500 font-semibold transition duration-300 outline-none focus:outline-none",
  default: "px-2 py-1 rounded-md border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold transition duration-300 outline-none focus:outline-none",
}

export default Collection;
