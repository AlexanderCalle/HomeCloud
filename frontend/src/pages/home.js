import '../index.css';
import React from 'react';
import Transition from '../components/transition'
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

function Home() {
  const { setAuthTokens } = useAuth();

  const [showModal, setShowModal] = React.useState(false);
  const [showFolders, setShowFolders] = React.useState(true);

  function logOut() {
    setAuthTokens(null);
    return <Redirect to="/login" />
  }

  return (
    <div className='flex flex-row h-screen bg-gray-100'>
      <div className='flex flex-col flex-none relative w-16 justify-between items-center flex-none p-4 bg-gray-100'>

        <div className='flex flex-col items-center space-y-6'>
          <a href="/">
          <svg class="w-12 h-12" fill="#4299e1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clip-rule="evenodd"></path></svg>
          </a>
          <a className='tooltip' href="#">
            <span className='tooltiptext shadow-lg font-semibold'>Collection</span>
          <svg class="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </a>
          <a className='tooltip' href="#" style={{ transition: "all .15s ease" }} onClick={() => setShowModal({
            showModal: true,
            name: "Add file(s)"
          })}>
          <span className='tooltiptext shadow-lg font-semibold'>Add File(s)</span>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </a>
          <a className='tooltip' href="#" style={{ transition: "all .15s ease" }} onClick={() => setShowModal({
            showModal: true,
            name: 'Add Folder',
            add_folder: true
          })}>
          <span className='tooltiptext shadow-lg font-semibold'>Add Folder</span>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
          </a>
        </div>

        <div className='flex flex-col space-y-6'>
          <a className='tooltip' href="#">
          <span className='tooltiptext shadow-lg font-semibold'>Friends</span>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </a >
          <a className='tooltip' href="#">
          <span className='tooltiptext shadow-lg font-semibold'>My Profile</span>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </a>
          <button className='tooltip' onClick={logOut}>
          <span className='tooltiptext shadow-lg font-semibold'>Logout</span>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>

      </div>

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
                    <a class="block border-b" href="#">
                        <div class="border-l-2 border-blue-500 bg-blue-100 hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                        <div class="flex flex-row items-center space-x-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path></svg>
                            <strong class="flex-grow font-normal">Folder 1</strong>
                        </div>
                        </div>
                    </a>
                    <a class="block border-b" href="#">
                        <div class="border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
                            <div class="flex flex-row items-center space-x-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                <strong class="flex-grow font-normal">Folder 1</strong>
                            </div>
                        </div>
                    </a>
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
              <div class="border-l-2 border-blue-500 bg-blue-100 hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4">
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
      <>
      {showModal ? (
        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <form>
              <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="bg-white px-4 pt-5 pb-2 sm:p-1 sm:pt-6 sm:pb-4">
                  <div class="min-w-0 sm:flex sm:items-start">
                    <div class="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-blue-500" id="modal-headline">
                        {showModal.name}
                      </h3>
                      <div class="mt-2">
                        {showModal.add_folder ? (
                          <div>
                            <input type="text" placeholder="Name..." name="name" class="w-full h-8 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-200 rounded-md shadow-xl"/>
                          </div>
                        ): (
                          <label class="w-full h-10 flex flex-row items-center space-x-4 px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                            <svg class="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span class="text-base leading-normal">Select a file</span>
                            <input type='file' class="hidden" />
                        </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" onClick={() => setShowModal(false)} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Add
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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

export default Home;
