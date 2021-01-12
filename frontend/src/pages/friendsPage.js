import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavBar';
import '../index.css';
import Transition from '../components/transition';
import axios from 'axios';

function FriendsPage() {

    const [showFriends, setShowFriends] = useState(true);
    const [friends, setFriends] = useState(null);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [searhed, setSearched] = useState(false);
    const [usersRequesting, setUsersRequesting] = useState(null);
    const [usersRequestingTotal, setUsersRequestingTotal] = useState(0);

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
                if(response.status == 200) {
                    setFriends(response.data);
                    console.log(response.data);
                }
            })
    }, [])


    function handleChange(e) {
        setSearchValue(e.target.value);

        if(e.target.value != "") {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/users/search/${e.target.value}`)
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

        axios({method: 'POST', url:`http://localhost:3030/users/addFriend`, data:data})
        .then((res) => {
            if(res.status === 200) {
                setShowSearchBar(false)
                setSearched(false)
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
                                <div className="flex flex-row space-x-2">
                                    <div class="pt-2 relative mx-auto text-gray-600">
                                        <input class="border-2 text-gray-600 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                                            type="search" name="search" value={searchValue} placeholder="Search" onChange={(e)=> handleChange(e)} />
                                        <button type="submit" class="absolute right-0 top-0 mt-5 mr-4">
                                            <svg class="text-gray-600 h-4 w-4 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                    <button onClick={() => {
                                        setShowSearchBar(false)
                                        setSearched(false)
                                    }}>
                                        <svg class="w-4 h-4 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="font-semibold text-2xl">Friends</h1>
                                    <div className="space-x-2">
                                        <button onClick={() => setShowSearchBar(true)}>
                                            <svg class="w-8 h-8 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </button>
                                        <button>
                                            <div className="relative w-8 h-8">
                                            <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                {usersRequestingTotal != 0 ? (
                                                    <div class="absolute flex top-0 right-0 h-4 w-4 my-1 border-2 border-white rounded-full bg-red-400 items-center justify-center z-2">
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
                                    {friends != null ? (
                                        friends.map(friend => (
                                            <>
                                            {friend.id != token.id ? (
                                                <a className="block border-b cursor-pointer" href="#">
                                                    <div className={styles.default}>
                                                        <div className="flex flex-row items-center justify-between">
                                                            <div className="flex flex-row space-x-2">
                                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                                <strong className="flex-grow font-normal">{friend.firstname} {friend.lastname}</strong>
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
                                    {searchedUsers.length != 0 ? (
                                        searchedUsers.map(user => (
                                            <>
                                            {token.id != user.id ? (
                                                <div className="block border-b">
                                                <div className={styles.default}>
                                                    <div className="flex flex-row items-center justify-between">
                                                        <div className="flex flex-row space-x-2">
                                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            <strong className="flex-grow font-normal">{user.firstname} {user.lastname}</strong>
                                                        </div>
                                                        <button onClick={()=> sendFriendRequest(user.id)}>
                                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                                        </button>
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

            <div className='flex flex-row flex-auto bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-xl'>
                <div className="w-full flex flex-col p-4">
                    <div className="flex-none h-16 flex flex-row space-x-4 items-center border-b">
                        <button onClick={() => setShowFriends(!showFriends)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path></svg>
                        </button>
                        <h1 className="font-bold">Firstname Lastname</h1>
                    </div>
                    <div className="flex-auto flex flex-col justify-center items-center space-y-16">
                        {/* <div>
                            <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="flex flex-col space-y-4 items-center">
                            <p>name: Firstname Lastname</p>        
                            <p>email: firstname@example.com</p>
                        </div> */}
                        <p>Comming Soon...</p>
                    </div>
                </div>
            </div>
        </div>
    )

}

const styles = {
    default: "border-l-2 border-transparent hover:border-blue-500 hover:bg-blue-100 p-3 space-y-4",
    selected: "border-l-2 border-blue-500 bg-blue-100 p-3 space-y-4"
}

export default FriendsPage;