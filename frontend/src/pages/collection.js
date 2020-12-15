import '../index.css';
import React from 'react';
import Transition from '../components/transition';
import Navbar from '../components/NavBar'
import FolderList from '../components/folders';
import File from '../components/files';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/auth';
// import useBreakpoint from '../context/useBreakpoint';

function Collection() {
  // const isStatic = useBreakpoint('md');

  const [showFolders, setShowFolders] = React.useState(true);
  const [foldername, setFoldername] = React.useState(useParams().foldername)
  const [folderId, setFolderId] = React.useState(useParams().folderId);
  const [showAddFilesDialog, setShowAddFilesDialog] = React.useState(false);
  const [fileUploading, setFileUploading] = React.useState(null);
  const [files, setFiles] = React.useState(null);
  const [progress, setProgess] = React.useState(null);

  function handleChange(event) {
    if(event.target.files.length > 1) {
        setFileUploading(`${event.target.files.length} selected`);
        setFiles(event.target.files[0]);
    } else {
        setFileUploading(event.target.files[0].name);
        setFiles(event.target.files);
    }
  }

  function fileUpload(e) {
    const data  = new FormData();
    data.append('file', files[0]);

    const token = JSON.parse(localStorage.getItem('tokens'));

    Axios.post(`http://localhost:3030/addfiles/${token.id}/${foldername}`, data, {
      onUploadProgress: (ProgressEvent) => {
        console.log(ProgressEvent.loaded);
        let progress = Math.round(
        ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
        setProgess(progress);
      }
  })
      .then((res) => {
        if(res.status === 200) {
          console.log(res.data)
          setProgess(null);
          setFileUploading(null);
          setFiles(null);
          setShowAddFilesDialog(false);
        } else {
          console.log(res.data);
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
            <h1 className="font-bold">{foldername}</h1>
            </div>
            <div className="flex flex-row space-x-4">
              <botton className="cursor-pointer" style={{ transition: "all .15s ease" }} onClick={()=> setShowAddFilesDialog(true)}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </botton>
            </div>
          </div>
          <div className="flex-auto overflow-y-auto">
            <div>
               <File folderId={folderId} />
            </div>
          </div>
        </div>
        {/* <div className="w-1/3 border-l border-r border-blue-500 bg-blue-100 flex flex-col shadow-2xl ">
          <div className="flex-none h-16 bg-white flex flex-row justify-center items-center p-5 border-blue-500 border-b">
            <h1 className="text-blue-500 font-semibold">Filename</h1>
          </div>
        </div> */}
      </div>
      <>
        {showAddFilesDialog ? (
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
                              Add File
                          </h3>
                          <div className="mt-2">
                              <label className="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                                  <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                  </svg>
                                  <span className="text-base leading-normal">{ 
                                      fileUploading != null ? fileUploading : 'Select File(s)'
                                  }</span>
                                  <input type='file' className="hidden" onChange={handleChange}/>
                              </label>
                          </div>
                        </div>
                    </div>
                    </div>
                    <div className="flex flew-row bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" onClick={(e)=> {fileUpload(e)}} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                        {progress == null ? 'Add': (
                          <>
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                          </>
                        ) }
                    </button>
                    <button type="button" onClick={() => setShowAddFilesDialog(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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

export default Collection;
