import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {socket} from '../App';


export const ChatPage = ({friendId, chatId}) => {


    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const token = JSON.parse(localStorage.getItem('tokens'));
    const messageEl = useRef(null);

    useEffect(()=> {

        if(chatId != null) {
            axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/getMessages/${chatId}`)
                .then(response => {
                    if (response.status === 200) {
                        setMessages(response.data);
                    }
                })
        }
        
    }, [chatId]);
    
    useEffect(() => { 
        socket.on('message', message => {
            console.log(message);
            setMessages(messages => [ ...messages, message ]);
          });

        if(messageEl) {
          messageEl.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

    function sendMessage(e) {
        e.preventDefault();
        if(inputMessage != "") {
            const data = {
                chatId: chatId,
                fromUser: token.id,
                toUser: friendId,
                message: inputMessage
            };

            const userId = token.id;
            socket.emit('sendMessage', {data, chatId, friendId});
            socket.emit('sendMelding', {userId, friendId});
            
            axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/sendmessage`, data)
                .then(response => {
                    if(response.status === 200) {
                        setInputMessage('');
                    };
            });
        };
    };

    return (
        <div className="justify-between flex flex-col h-full">
            <div className="flex flex-col p-4 space-y-4 items-start overflow-y-auto" ref={messageEl}>
                 {messages.map(message => (
                     <>
                     {message.chatId == chatId && (
                         <div className={message.fromUser === token.id ? style.sender : style.friend}>
                            {message.message}
                        </div>
                     )}
                    </>
                ))}
            </div>          
            <div class="mt-2 border-t border-gray-200 pt-4 mb-1 sm:mb-0">
                <form onSubmit={(e)=> sendMessage(e)}>
                <div class="relative flex">
                        <input type="text" value={inputMessage} onChange={(e)=> setInputMessage(e.target.value)} placeholder="Write Something" class="w-full focus:outline-none border border-black focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 rounded-full py-2" />
                        <div class="absolute right-2 items-center inset-y-0 hidden sm:flex">
                            <button type="submit" onClick={(e)=> sendMessage(e)} class="inline-flex items-center justify-center rounded-full h-9 w-9 text-black focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                </div>
                </form>
            </div>
        </div>
    )
}

const style = {
	sender: "max-w-lg inline-block px-4 self-end py-2 bg-blue-500 rounded-t-lg rounded-bl-lg text-white",
	friend: "max-w-lg inline-block px-4 py-2 bg-gray-200 rounded-t-lg rounded-br-lg"
}