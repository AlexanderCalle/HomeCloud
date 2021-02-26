import React from 'react';
import '../index.css';
import NavBar from '../components/NavBar';
import FolderList from '../components/folders';

function Home() {
    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <NavBar page={"folder"} />
            <div className='flex-auto bg-white'>
                <div className="w-full flex flex-col p-6 space-y-4">
                    <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                        <div className="flex flex-row items-end space-x-4">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input className="outline-none sm:w-96 w-5/6 p-0 text-md" type="text" placeholder="Search..." />
                        </div>
                        <div className="flex flex-row items-end space-x-2">
                            <button className="focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            </button>
                            <button className="focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>   
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 text-xl font-bold">My folders</h1>
                    <div className="mt-4 flex-auto overflow-y-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                        <FolderList />
                    </div>
                </div>
            </div>
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