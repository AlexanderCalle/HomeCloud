import React from 'react';
import '../index.css';
import axios from 'axios';
import NavBar from '../components/NavBar';
import FolderList from '../components/folders';

function Home() {

    const [isfolderWarning, setFoldernameWarning] = React.useState(false);
    const [folderId, setFolderId] = React.useState("");
    const [searchValue, setSearchValue] = React.useState("");
    const token = JSON.parse(localStorage.getItem('tokens'));
    const [foldersFound, setFoldersFound] = React.useState([]);
    const [filesFound, setFilesFound] = React.useState([]);
    const [fileshow, setFileshow] = React.useState(false);
    const [grid, setGrid] = React.useState(true);

    const [file, setFile] = React.useState({
        name: null,
        file: null,
        filename: null,
        is_image: false,
        created: null
      });    

    function deleteFolder(e) {
        e.preventDefault();
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/folders/deletefolder/${folderId}`)
          .then(async res => {
            if(res.status === 200) {
              window.location.reload();
            }
          })
      }

    function onChange(e) {
        console.log(e.target.value);
        setSearchValue(e.target.value);
        if(e.target.value !== '') {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/search/find/file/folders/${token.id}/${e.target.value}`)
            .then(response => {
                if(response.status === 200) {
                    setFoldersFound(response.data.folders);
                    setFilesFound(response.data.files);
                }
            })
        } else {
            setFoldersFound([]);
            setFilesFound([])
        }
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

    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <NavBar page={"folder"} />
            <div className='flex-auto bg-white'>
                <div className="w-full flex flex-col p-6 space-y-4">
                    <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                        <div className="flex flex-row items-end space-x-4">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input className="outline-none sm:w-96 w-5/6 p-0 text-md" value={searchValue} onChange={(e) => onChange(e)} type="text" placeholder="Search..." />
                        </div>
                        <div className="flex flex-row items-end space-x-2">
                            <button className="focus:outline-none" onClick={()=> setGrid(!grid)}>
                                {!grid ? 
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                :
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                }
                            </button>
                            <button className="focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>   
                            </button>
                        </div>
                    </div>
                    {filesFound.length === 0 && foldersFound.length === 0 ? (
                        <>
                            <h1 className="mt-4 text-xl font-bold">My folders</h1>
                            {
                                grid ? (
                                    <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                                        <FolderList setFoldernameWarning={setFoldernameWarning} setFolderId={setFolderId} />
                                    </div>
                                ): (
                                    <div className="mt-4 flex-auto overflow-y-auto flex flex-col w-full space-y-4">
                                        <FolderList setFoldernameWarning={setFoldernameWarning} setFolderId={setFolderId} />
                                    </div>
                                )
                            }
                        </>
                    ) : (
                        <>
                        <h1 className="mt-4 text-xl font-bold">Items Found</h1>
                        <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                            {foldersFound.map(folder => (
                                <a className="block cursor-pointer border border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white" href={`/collection/folder/${folder.name}/${folder.folder_id}`}>
                                        <div className="p-3 space-y-4">
                                        <div className="flex flex-row items-center space-x-2 overflow-hidden">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                            <strong className="flex-grow font-normal">{folder.name}</strong>
                                        </div>
                                    </div>
                                </a> 
                            ))}
                            {filesFound.map((file => {
                                return (
                                    <div className="block cursor-pointer border border-gray-400 rounded-md shadow-md hover:border-cornblue-400 hover:bg-cornblue-200 hover:text-white overflow-hidden">
                                        <div className="flex flex-row items-center">
                                            <a className="flex-auto cursor-pointer" onClick={() => fileShowing(file.path, file.name, file.is_image, file.file_id, file.created_at)}>
                                                <div className="p-3 space-y-4">
                                                    <div className="flex flex-row items-center space-x-2 overflow-hidden">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                        <strong className="flex-grow text-sm font-normal">{file.name}</strong>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )
                            }))}
                        </div>
                        </>
                    )}
                </div>
            </div>
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
                                {file.is_image ? <img src={'http://' + process.env.REACT_APP_HOST_IP + ':3030' + file.file} /> : <h1>No preview to see</h1>}
                                </div>
                                <div className="-mt-4 w-full border-b pb-4 px-4 flex flex-col items-start space-y-4">
                                <p>Created on: {file.created}</p>
                                <p>Type file: {file.is_image ? 'Image' : 'Document'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) : null}
            </>
            {/* <div className='flex flex-row flex-auto bg-white items-center justify-center'>
                <div className=' flex flex-col space-y-4 bg-white p-5 shadow-lg rounded-lg h-64 w-1/3 justify-center'>
                    <h1 className='font-bold text-xl text-center'>Open a folder!</h1>
                    <div className='overflow-y-auto'>
                        <FolderList />
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Home;