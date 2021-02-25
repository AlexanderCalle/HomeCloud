import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavBar';
import '../index.css';
import Transition from '../components/transition';
import axios from 'axios';
import { ChatPage } from '../components/ChatPage';
import {socket} from '../App';
import { useMediaQuery } from 'react-responsive'

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

    const isStatic = useBreakpoint('1024px');

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

    function useBreakpoint(breakpoint) {
        return useMediaQuery({
          query: `(min-width: ${breakpoint})`,
        });
    }

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
        console.log(isStatic);
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
        <div className='flex flex-row h-screen bg-white'>
            <Navbar page={"chat"} />

            <Transition
                show={isStatic && showFriends || !showFriends && !isStatic}
                enter="transition-all duration-500"
                enterFrom="md:-ml-80 -ml-96"
                enterTo="md:ml-0"
                leave="transition-all duration-500"
                leaveTo="md:-ml-80 -ml-96">
                <div className='pl-20 md:pl-4 absolute md:relative h-screen w-full md:w-80 flex-none bg-white p-4'>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-row flex-none p-4 border-b justify-between items-center mb-6">
                            {!isStatic && (
                                <button onClick={() => setShowFriends(!showFriends)}>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                            <h1 className="font-semibold text-xl">Chat with friends</h1>
                            <div className="space-x-2">
                                <button onClick={() => setShowSearchBar(true)}>
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-auto overflow-y-auto flex flex-col space-y-3">
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
                                                                <div className="flex flex-col items-start max-h-12 overflow-hidden space-y-0">
                                                                    <strong className="font-semibold">{friend.firstname} {friend.lastname}</strong>
                                                                    {latestMessages.map((message) => (
                                                                        <>
                                                                        {message.fromUser == friend.id && <p className={message.Status == 0 ? "font-bold text-gray-500" : "font-normal text-gray-500"}>{message.message}</p>}
                                                                        {message.toUser == friend.id && <p className="text-gray-500">you: {message.message}</p>}
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

            <div className='h-screen flex flex-row flex-auto bg-white border-l border-r border-gray-400'>
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
        </div>
    )
}

const styles = {
    default: "border border-gray-400 hover:bg-gray-200 rounded-md  p-3 space-y-4 shadow-md",
    selected: "border rounded-md border-gray-400 bg-gray-200 p-3 space-y-4"
}

export default ChatsPage;