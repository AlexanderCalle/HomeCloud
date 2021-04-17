import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {socket} from '../App';
import useFileUpload from '../hooks/useFileUpload'


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

    useEffect(()=> {
        axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/seenmessages/${chatId}/${token.id}`)
            .then(response => {
                if(response.status === 200) {

                }
            })
    }, [chatId]);
    
    useEffect(() => { 
        socket.on('message', message => {
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
                message: inputMessage,
                isImage: 0
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

    const [ firstGetFileContext ] = useFileUpload();

    function sendImage(e) {
        if(e.target.files.length != 0){
            firstGetFileContext('chat', e.target.files, chatId, friendId);
        }
    }

    return (
        <div className="justify-between flex flex-col h-full">
            <div className="flex flex-col p-4 space-y-4 items-start overflow-y-auto" ref={messageEl}>
                 {messages.map(message => (
                     <>
                     {message.chatId == chatId && (
                         <div className={message.fromUser === token.id ? style.sender : style.friend}>
                            {message.isImage == 0 ? message.message : (
                                <img src={'http://' + process.env.REACT_APP_HOST_IP + ':3030' + message.message} />
                            )}
                        </div>
                     )}
                    </>
                ))}
            </div>          
            <div class="mt-2 border-gray-200 pt-4 mb-1 sm:mb-0">
                <form onSubmit={(e)=> sendMessage(e)}>
                    <div class="relative flex flex-row items-center justify-between border p-1 border-black rounded-2xl">
                        <input type="text" value={inputMessage} onChange={(e)=> setInputMessage(e.target.value)} placeholder="Write Something" class="w-full focus:outline-none h-8 focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 py-2" />
                        <div class="items-center inset-y-0 flex">
                            <div className="cursor-pointer">
                                <label for="file-input" className="cursor-pointer">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </label>
                                <input type="file" id="file-input" hidden="true" onChange={(e) => sendImage(e)} multiple />
                            </div>
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
	sender: "max-w-lg inline-block px-4 self-end py-2 bg-blue-500 rounded-t-xl rounded-bl-xl text-white",
	friend: "max-w-lg inline-block px-4 py-2 bg-gray-200 rounded-t-xl rounded-br-xl"
}