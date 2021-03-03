import React, { useState, useEffect }from 'react';
import Navbar from '../components/NavBar';
import '../index.css';
import axios from 'axios';

function FriendsPage() {

    const token = JSON.parse(localStorage.getItem('tokens'));
    const [friends, setFriends] = useState([]);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [searhed, setSearched] = useState(false);
    const [usersRequesting, setUsersRequesting] = useState(null);
    const [usersRequestingTotal, setUsersRequestingTotal] = useState(0);
    const [showModalRequest, setShowModalRequest] = useState(false);


    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/allfriends/${token.id}`)
            .then((response) => {
                if (response.status === 200) {
                    setFriends(response.data);
                }
            })
    }, []);

    function handleChange(e) {
        setSearchValue(e.target.value);

        if(e.target.value !== "") {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/search/${token.id}/${e.target.value}`)
            .then((response) => {
                if (response.status === 200) {
                    setSearchedUsers(response.data);
                    setSearched(true)
                }
            })
        } else {
            setSearched(false)
        }
    }

    function sendFriendRequest(friendId) {
        const data = {
            userId: token.id,
            friendId: friendId,
        }

        axios({method: 'POST', url:`http://${process.env.REACT_APP_HOST_IP}:3030/users/addFriend`, data:data})
        .then((res) => {
            if(res.status === 200) {
                setShowSearchBar(false)
                setSearched(false)
                setSearchValue('')
            }
        })
    }

    function handleUpdateRequest(e, status, FriendsId) {
        e.preventDefault()
        let data;
        if(status === "accept") {
            data = {Status: 1}
        } else {
            data = {Status: 2}
        }
        axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/users/updateRequest/${FriendsId}`, data)
            .then(response => {
                if(response.status === 200) {
                    setShowModalRequest(false);
                    window.location.reload();
                }
            })
    }

    return ( 
        <div className='flex flex-row h-screen bg-gray-100'>
            <Navbar page={'friends'}/>

            <div className='flex-auto bg-white'>
                <div className="w-full flex flex-col p-6 space-y-4">
                    <div className="flex flex-col">
                        <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                            <div className="flex flex-row items-end space-x-4">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <input className="outline-none sm:w-96 w-5/6 p-0 text-md" value={searchValue} onChange={(e) => handleChange(e)} type="text" placeholder="Search..." />
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
                                {searhed && (
                                    <div className="bg-gray-200 p-2 relative w-full z-20 space-y-2">
                                    {searchedUsers.length !== 0 ? (
                                        searchedUsers.map(user => (
                                            <>
                                            {token.id !== user.id ? (
                                                <div className="block border-b">
                                                <div className={styles.default}>
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div className="flex flex-row space-x-2">
                                                            {user.profile_pic !== null ? (
                                                                <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + user.profile_pic} className="object-cover w-7 h-7 rounded-full" />
                                                            ) : ( 
                                                                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            )}
                                                            <strong className="flex-grow font-normal">{user.firstname} {user.lastname}</strong>
                                                        </div>
                                                        {user.Status === null || user.Status === 2 ? (
                                                            <button onClick={()=> sendFriendRequest(user.id)}>
                                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                                            </button>
                                                        ) : null}
                                                        {user.Status === 0 && <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>}
                                                        {user.Status === 1 && <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>}
                                                    </div>
                                                </div>
                                            </div>
                                            ): null}
                                            </>
                                        ))
                                    ) : (
                                        <p>Nothing has been found</p>
                                    )} 
                                    </div>
                                ) }
                        </div>
                    <h1 className=" text-xl font-bold z-0">My Friends</h1>
                    <div className=" z-0 flex-auto overflow-y-auto grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
                        {friends.map(friend => (
                            <div className="border border-gray-400 rounded-md shadow-md p-4">
                                <div className="flex flex-row items-center space-x-2">
                                    {friend.profile_pic !== null ? (
                                        <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + friend.profile_pic} className="object-cover w-16 h-16 rounded-full" />
                                    ) : ( 
                                        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    )}
                                    <div className="flex flex-col space-y-0">
                                        <strong className="text-lg font-medium">{friend.firstname} {friend.lastname}</strong>
                                        <p className="text-sm font-normal text-gray-500">{friend.created}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

const styles = {
    default: "border bg-white border-gray-400 hover:bg-gray-200 rounded-md p-3 space-y-4 shadow-md",
    selected: "border rounded-md border-gray-400 bg-gray-200 p-3 space-y-4"
}

export default FriendsPage;