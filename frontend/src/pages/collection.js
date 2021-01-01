import '../index.css';
import React from 'react';
import Transition from '../components/transition';
import Navbar from '../components/NavBar'
import FolderList from '../components/folders';
import File from '../components/files';
import Axios from 'axios';
import { useParams, Redirect } from 'react-router-dom';
import useFileDownloader from '../hooks/useFileDownloader'

function Collection() {
  const token = JSON.parse(localStorage.getItem('tokens'));

  const [showFolders, setShowFolders] = React.useState(true);
  const [foldername, setFoldername] = React.useState(useParams().foldername);
  const folderId = useParams().folderId;
  const [fileshow, setFileshow] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [rename, setRename] = React.useState(false);
  const [newFoldername, setNewFoldername] = React.useState(foldername);
  const [isfolderWarning, setFoldernameWarning] = React.useState(false);

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

  async function  downloadFunction(name, path, filename, is_image) {
    await setFile({
      name: name,
      file: path,
      filename: filename,
      is_image: is_image
    });

    download(file)
  }

  function fileShowing(filePath, fileName, is_image, fileId) {
    setFileshow(!fileshow);
  }

  function renameFolder(e) {
    Axios({method: 'POST', url: `http://localhost:3030/renamefolder/${folderId}`, data: {
      name: newFoldername,
    }}).then(result => {
      if (result.status === 200) {
        setRename(false);
        setFoldername(result.data.name);
      } else {
        console.error(result.data)
      }
    }).catch(err => console.log(err));

  }

  function deletefile(fileId) {
    Axios.get(`http://localhost:3030/deletefile/${fileId}`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          window.location.reload();
        } else {
          console.error(res.data)
        }
      })
  }

  function deleteFolder() {
    Axios.get(`http://localhost:3030/deletefolder/${folderId}`)
      .then(res => {
        if(res.status === 200) {
           <Redirect to="/" />
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
          leaveTo="-ml-64"
        >
            <div className='w-64 flex-none bg-gray-100 p-4 flex flex-col space-y-4'>

                <div className="flex flex-row flex-none p-4 border-b justify-between items-center mb-6">
                  <h1 className="font-semibold text-2xl">Folders</h1>
                  <svg className="flex-none w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                <div className="flex-auto overflow-y-auto flex flex-col">
                  <FolderList />
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
            <div className="flex flex-row space-x-2">
              <button onClick={() => donwloadfolder(folder)}>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
              <button onClick={() => setShowSettings(!showSettings)}>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
              </button>
            </div>
          </div>
          <div className="flex-auto overflow-y-auto">
            <div>
               <File downloadFunction={downloadFunction} deletefile={deletefile} fileShowing={fileShowing} fileshow={fileshow} folderId={folderId} />
            </div>
          </div>
        </div>
        <>
        {fileshow ? (     
          <div className="w-1/3 border-l border-r border-blue-500 bg-blue-100 flex flex-col shadow-2xl ">
            <button className="absolute p-2 right-0" onClick={() => setFileshow(false)}>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex-none h-16 bg-white flex flex-row justify-center items-center p-5 border-blue-500 border-b">
              <h1 className="text-blue-500 font-semibold">Filename</h1>
            </div>
            <div className="flex flex-col p-2 space-y-8 justify-center items-center">
              <>
                {file.is_image ? <img src={'http://localhost:3030' + file.file} /> : <h1>{file.filename}</h1>}
              </>
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
                    <button type="submit" onClick={deleteFolder} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Delete
                    </button>
                    <button type="button" onClick={() => setFoldernameWarning(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                    </div>
                </div>
                </form>
            </div>
            </div>
          ) : null}
        </>

    </div>
  );
}

export default Collection;
