import React from 'react';
import Navbar from '../components/NavBar';
import Profile from '../components/profile';

function MyProfile() {
    return (
        <div className='flex flex-row h-screen '>
            <Navbar />
            <div className='flex flex-row flex-auto bg-gray-100 items-center justify-center'>
                <div className=' flex flex-col space-y-4 bg-white p-5 shadow-lg rounded-lg h-3/5 w-2/5 justify-center'>
                    <Profile />
                </div>
            </div>
        </div>
    )
}

export default MyProfile;