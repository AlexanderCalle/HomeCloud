import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavBar';
import '../index.css';
import Transition from '../components/transition';
import axios from 'axios';
import { ChatPage } from '../components/ChatPage';
import {socket} from '../App';

function ChatsPage() {

    const [showFriends, setShowFriends] = useState(true);
    const [friends, setFriends] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [searhed, setSearched] = useState(false);
    const [usersRequesting, setUsersRequesting] = useState(null);
    const [usersRequestingTotal, setUsersRequestingTotal] = useState(0);
    const [showModalRequest, setShowModalRequest] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [latestMessages, setLatestMessages] = useState([]);
    const [showFriendInfo, setShowFriendInfo] = useState(false);

    const token = JSON.parse(localStorage.getItem('tokens'));

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/friendrequests/${token.id}`)
            .then((response) => {
                if (response.status === 200) {
                    setUsersRequesting(response.data);
                    setUsersRequestingTotal(response.data.length)
                }
            })

        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/friends/${token.id}`)
            .then(response => {
                if(response.status === 200) {
                    setFriends(response.data);
                    setSelectedFriend(null)
                }
            })
    }, [token.id]);

    // friend Page
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/getlatestmessages/${token.id}`)
            .then(response => {
                if(response.status === 200) {
                    setLatestMessages(response.data);
                }
            })
    }, [chatId]) // not sure yet

    useEffect(() => {
        socket.on('latest', () => {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/getlatestmessages/${token.id}`)
            .then(response => {
                if(response.status === 200) {
                    setLatestMessages(response.data);
                }
            })
        })
    }, [])

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

    // function handleRemoveFriend(e, FriendsId) {
    //     axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/deleteFriend/${FriendsId}`)
    //         .then((response) => {
    //             if(response.status === 200) {
    //                 window.location.reload();
    //             }
    //         })
    // }

    function handleChat(friend) {
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/getchat/${token.id}/${friend.id}`)
            .then(response => {

            if(response.status === 200) {
                setChatId(response.data.chatId)

                let chatId = response.data.chatId
                let userId = token.id

                socket.emit('joinchat', {chatId, userId})
            } else if(response.status === 201) {
    
                const data = {
                    userOne: token.id,
                    userTwo: friend.id
                }
    
                axios.post('http://localhost:3030/chat/makechat', data)
                    .then(response => {
                        if(response.status === 200) {
                            setChatId(response.data.insertId)
                            socket.emit('joinchat', response.data.insertId)
                        }
                })
            }
        })
    }

    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <Navbar />

            <Transition
                show={showFriends}
                enter="transition-all duration-500"
                enterFrom="-ml-80"
                enterTo="ml-0"
                leave="transition-all duration-500"
                leaveTo="-ml-80">
                <div className='w-80 flex-none bg-gray-100 p-4'>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-row flex-none p-4 border-b justify-between items-center mb-6">
                            {showSearchBar ? (
                                <div className="flex flex-row items-center justify-between space-x-2">
                                    <div class="pt-2 relative text-gray-800">
                                        <input class="border w-64 text-gray-800 border-gray-500 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                            type="search" name="search" value={searchValue} placeholder="Search..." onChange={(e)=> handleChange(e)} />
                                        <button type="submit" class="absolute right-0 top-0 mt-5 mr-4">
                                            <svg class="text-gray-800 h-4 w-4 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                    <div className="mt-2">
                                        <button onClick={() => {
                                            setShowSearchBar(false)
                                            setSearched(false)
                                            setSearchValue("")
                                        }}>
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="font-semibold text-2xl">Friends</h1>
                                    <div className="space-x-2">
                                        <button onClick={() => setShowSearchBar(true)}>
                                            <svg class="w-8 h-8 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </button>
                                        <button onClick={() => setShowModalRequest(true)}>
                                            <div className="relative w-8 h-8">
                                                <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                {usersRequestingTotal !== 0 ? (
                                                    <div class="absolute flex top-0 right-0 h-4 w-4 my-1 border-2 border-gray-100 rounded-full bg-red-400 items-center justify-center z-2">
                                                        <p className="text-white font-medium text-xs">{usersRequestingTotal}</p>
                                                    </div>
                                                ) : null}
                                            </div> 
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex-auto overflow-y-auto flex flex-col">
                                {!searhed ? (
                                    <>
                                    {friends !== null ? (
                                        friends.map(friend => (
                                            <>
                                            {friend.id !== token.id ? (
                                                <a className="block border-b cursor-pointer" onClick={()=> {
                                                    setSelectedFriend(friend);
                                                    handleChat(friend);
                                                }}>
                                                    <div className={ selectedFriend !== null ? ( selectedFriend.id == friend.id ? styles.selected : styles.default ) : styles.default}>
                                                        <div className="flex flex-row items-center justify-between">
                                                            <div className="flex flex-row space-x-2">
                                                                    {friend.profile_pic !== null ? (
                                                                        <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + friend.profile_pic} className="object-cover w-12 h-12 rounded-full" />
                                                                    ) : ( 
                                                                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                    )}
                                                                <div className="flex flex-col space-x-2">
                                                                    <strong className="font-semibold">{friend.firstname} {friend.lastname}</strong>
                                                                    {latestMessages.map((message) => (
                                                                        <>
                                                                        {message.fromUser == friend.id && <p className={message.Status == 0 ? "font-bold" : "font-normal"}>{message.message}</p>}
                                                                        {message.toUser == friend.id && <p>you: {message.message}</p>}
                                                                        </>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ) : null}
                                            </>
                                        ))
                                    ): (
                                        <p>No Friends yet, send some invites</p>
                                    )}  
                                    </> 
                                ) : (
                                    <>
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
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </Transition>

            <div className='h-screen flex flex-row flex-auto bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-xl'>
                <div className="w-full flex flex-col p-4">
                    {selectedFriend !== undefined && (
                    <>
                    <div className="flex-none h-16 flex flex-row justify-between items-center border-b">
                        <div className="flex flex-row space-x-4 items-center">
                            <button onClick={() => setShowFriends(!showFriends)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path></svg>
                            </button>
                            <h1 className="font-bold">{ selectedFriend !== null && (`${selectedFriend.firstname} ${selectedFriend.lastname}`) }</h1>
                        </div>
                        <div>
                            <button onClick={()=> setShowFriendInfo(true)}>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                            {/* <button onClick={(e) => handleRemoveFriend(e, selectedFriend.FriendsId)}>
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path></svg>
                            </button> */}
                        </div>
                    </div>
                    <div className="flex-auto h-4/5">
                       { selectedFriend !== null ? (<ChatPage chatId={chatId} friendId={selectedFriend.id} />):null}
                    </div>
                    </>
                    )}
                </div>
                <>
                {selectedFriend !== null && (
                    <>
                    {showFriendInfo ? (
                        <div className="flex flex-col mt-2 w-1/3 bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-2xl p-2">
                            <div className="h-16 bg-white flex flex-row justify-center items-center border-b">
                                <button className="absolute right-0 pr-2" onClick={() => setShowFriendInfo(false)}>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                <div className="flex-none">
                                    <h1 className="font-semibold">{selectedFriend.firstname} {selectedFriend.lastname}</h1>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col items-center space-y-6 justify-center">
                                <img src={"http://" + process.env.REACT_APP_HOST_IP + ":3030" + selectedFriend.profile_pic} className="object-cover w-32 h-32 rounded-full" />
                                <div className="flex flex-col items-center space-y-2">
                                    <p className="font-bold text-lg">{selectedFriend.firstname} {selectedFriend.lastname}</p>
                                    <p className="text-md">{selectedFriend.email}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    </>
                )}
                </>
            </div>

            <>
            {showModalRequest ? (
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
                                    Friend Request(s)
                                </h3>
                                <div className="mt-2 overflow-y-auto">
                                    {usersRequesting.map(user => (
                                        <>
                                        {token.id != user.id ? (
                                            <div className="block border-b">
                                            <div className={styles.default}>
                                                <div className="flex flex-row items-center justify-between">
                                                    <div className="flex flex-row space-x-2">
                                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        <strong className="flex-grow font-normal">{user.firstname} {user.lastname}</strong>
                                                    </div>
                                                    <div className="space-x-2">
                                                        <button onClick={(e) =>  handleUpdateRequest(e, "accept", user.FriendsId)}>
                                                            <svg class="w-6 h-6 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                        </button>
                                                        <button onClick={(e) =>  handleUpdateRequest(e, "decline", user.FriendsId)}>
                                                            <svg class="w-6 h-6 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ): null}
                                        </>
                                    ))}
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="flex flew-row bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button onClick={()=> {
                                setShowModalRequest(false)
                            }} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                Close
                            </button>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            ) : null}
            </>

        </div>
    )
}

const styles = {
    default: "border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4",
    selected: "border-l-2 border-blue-500 bg-blue-100 p-3 space-y-4"
}

export default ChatsPage;