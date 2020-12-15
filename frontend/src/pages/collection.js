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
              <botton className="cursor-pointer">
                <svg className="flex-none w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
    </div>
  );
}

export default Collection;
