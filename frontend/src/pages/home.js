import '../index.css';
import React, { Component }from 'react';
import Transition from '../components/transition';
import Navbar from '../components/NavBar'
import { useAuth } from '../context/auth';
import FolderList from '../components/folders';

function Home() {

  const [showFolders, setShowFolders] = React.useState(true);
  const [folders, setFolders] = React.useState({});

  return (
    <div className='flex flex-row h-screen bg-gray-100'>
      
      <Navbar />

      <Transition
        show={showFolders || null}
        enter="transition-all duration-500"
        enterFrom="-ml-64"
        enterTo="ml-0"
        leave="transition-all duration-500"
        leaveTo="-ml-64"
        >
            <div className='w-64 flex-none bg-gray-100 p-4 flex flex-col space-y-4'>

                <div class="flex flex-row flex-none p-4 border-b justify-between items-center mb-6">
                    <h1 class="font-semibold text-2xl">Folders</h1>
                    <svg class="flex-none w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <div class="flex-auto overflow-y-auto flex flex-col">
                    
                    <FolderList />
                    
                </div>

            </div>
      </Transition>
      
      <div className='flex flex-row flex-auto bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-xl'>
        <div className="w-full flex flex-col p-4">
          <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
            <div className="flex flex-row space-x-2">
            <button onClick={() => setShowFolders(!showFolders)}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path></svg>
            </button>
            <h1 className="font-bold">Folder name</h1>
            </div>
            <div className="flex flex-row space-x-4">
              <form>
                <input type="text" placeholder="Search..." className="border-b w-64 border-gray-900 focus:outline-none "/>
              </form>
              <botton className="cursor-pointer">
                <svg class="flex-none w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </botton>
            </div>
          </div>
          <div class="flex-auto overflow-y-auto">
            <a class="block border-b">
              <div class="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                <div class="flex flex-row items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <strong class="flex-grow text-sm font-normal">Doc 1</strong>
                </div>
              </div>
            </a>
            <a class="block border-b">
              <div class="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                <div class="flex flex-row items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <strong class="flex-grow text-sm font-normal">Doc 1</strong>
                </div>
              </div>
            </a>
            <a class="block border-b">
              <div class="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                <div class="flex flex-row items-center space-x-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <strong class="flex-grow text-sm font-normal">Doc 1</strong>
                </div>
              </div>
            </a>
          </div>
        </div>
        {/* <div class="w-1/3 border-l border-r border-blue-500 bg-blue-100 flex flex-col shadow-2xl ">
          <div class="flex-none h-16 bg-white flex flex-row justify-center items-center p-5 border-blue-500 border-b">
            <h1 class="text-blue-500 font-semibold">Filename</h1>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
