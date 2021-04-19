import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {socket} from '../App';
import useFileUpload from '../hooks/useFileUpload'


export const ChatPage = ({friendId, chatId}) => {

    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const [image, setImage] = useState(null);

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

    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
          setShowImage(false);
        }
      });

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

    function scaleImage(path) {
        setShowImage(true);
        setImage(path);
    }

    return (
        <div className="justify-between flex flex-col h-full">
            <div className="flex flex-col p-4 space-y-4 items-start overflow-y-auto" ref={messageEl}>
                 {messages.map(message => (
                     <>
                     {message.chatId == chatId && (
                         <>
                         {message.isImage == 0 ? (
                            <div className={message.fromUser === token.id ? style.sender : style.friend}>
                                {message.message}
                            </div>
                         ) : (
                            <img onClick={() => scaleImage(message.message)} className={message.fromUser === token.id ? style.senderImage : style.friendImage} src={'http://' + process.env.REACT_APP_HOST_IP + ':3030' + message.message} />
                        )}
                        </>
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

            {showImage && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="block items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-80"></div>
                        </div>
                        <span  className="inline-block align-middle h-screen" aria-hidden="true">&#8203;</span>
                        <span onClick={() => setShowImage(false)} className="cursor-pointer focus:outline-none absolute flex flex-row justify-center items-center top-2 right-2 h-9 w-9 text-white rounded-full bg-black opacity-50">&#10005;</span>
                        <div className="inline-block overflow-hidden shadow-xl transform align-middle lg:max-w-2xl md:max-w-lg sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <img className="w-full h-full" src={'http://' + process.env.REACT_APP_HOST_IP + ':3030' + image} />
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

const style = {
	sender: "max-w-lg inline-block px-4 self-end py-2 bg-blue-500 rounded-t-xl rounded-bl-xl text-white",
	friend: "max-w-lg inline-block px-4 py-2 bg-gray-200 rounded-t-xl rounded-br-xl",
    senderImage: "lg:max-w-lg md:max-w-md sm:max-w-sm max-w-xs inline-block self-end rounded-t-xl rounded-bl-xl cursor-pointer",
    friendImage: "lg:max-w-lg md:max-w-md sm:max-w-sm max-w-xs inline-block rounded-t-xl rounded-br-xl cursor-pointer",
}