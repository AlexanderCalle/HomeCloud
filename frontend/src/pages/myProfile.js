import React, { useState} from 'react';
import Navbar from '../components/NavBar';
import Profile from '../components/profile';

function MyProfile() {

    const [isUpdating, setIsUpdating] = useState(false)

    return (
        <div className='flex flex-row h-screen '>
            <Navbar page={"profile"} />
            <div className='flex flex-row flex-auto  items-center justify-center'>
                    <Profile isUpdating={isUpdating} setIsUpdating={setIsUpdating} />
            </div>
        </div>
    )
}

export default MyProfile;