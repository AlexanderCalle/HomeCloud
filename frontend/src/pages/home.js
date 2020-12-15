import React from 'react';
import '../index.css';
import NavBar from '../components/NavBar';
import FolderList from '../components/folders';

function Home() {
    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <NavBar />
            <div className='flex flex-row flex-auto bg-white items-center justify-center'>
                <div className=' flex flex-col space-y-4 bg-gray-100 p-5 shadow-lg rounded-lg h-64 w-3/5 justify-center'>
                    <h1 className='font-bold text-xl text-center'>Open a folder!</h1>
                    <div className='overflow-y-auto'>
                        <FolderList />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;