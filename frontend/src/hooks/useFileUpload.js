import React, { useState, useEffect, useParams } from 'react';
import axios from 'axios';
import {socket} from '../App';

let chunkSize = 1024*1024;

const useFileUpload = () => {

    const [folderName, setFolderName] = useState(null);
    const [files, setFiles] = useState({});
    const [counter, setCounter] = useState(1)
    const [fileToBeUpload, setFileToBeUpload] = useState({})
    const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
    const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
    const [progress, setProgress] = useState(0)
    const [fileSize, setFileSize] = useState(0)
    const [chunkCount, setChunkCount] = useState(0);
    const [fileOnSelected, setFileOnSelected] = useState(0);
    const [chatId, setChatId] = useState(null);
    const [toUser, setToUser] = useState(null);
    // const token = JSON.parse(localStorage.getItem('tokens'));

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    // const totalCapacity = 26843545600;

    const firstGetFileContext = (foldername, files, chatId, toUser) => {

        setFolderName(foldername);
        setFiles(files);
        setChatId( chatId );
        setToUser( toUser );

        console.log(foldername);

        resetChunkProperties();
        setCounter(1);

        let numb = fileOnSelected;

        if(files[numb].size > 104857600) {
            chunkSize = 10 * 1024 * 1024;
        }

        const token = JSON.parse(localStorage.getItem('tokens'));
        //5368709120 == 5 GB
        //52428800 == 50 MB
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/openStream/${token.id}/${foldername}/${files[numb].name}`, {
            cancelToken: source.token
        })
            .then(async response => {
                if(response.status === 200) {
                    setFileSize(files[numb].size);

                    const _totalCount = files[numb].size % chunkSize == 0 ? files[numb].size / chunkSize : Math.floor(files[numb].size / chunkSize) + 1;
                    setChunkCount(_totalCount);

                    setFileToBeUpload(files[numb]);
                }
            });
    }

    const getFileContext = () => {
        resetChunkProperties();
        setCounter(1);

        let numb = fileOnSelected + 1;

        if(files[numb].size > 104857600) {
            chunkSize = 10 * 1024 * 1024;
        }
    
        const token = JSON.parse(localStorage.getItem('tokens'));
        
        
        axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/files/openStream/${token.id}/${folderName}/${files[numb].name}`, {
            cancelToken: source.token
        })
            .then(async response => {
                if(response.status === 200) {
                    setFileSize(files[numb].size);

                    const _totalCount = files[numb].size % chunkSize == 0 ? files[numb].size / chunkSize : Math.floor(files[numb].size / chunkSize) + 1;
                    setChunkCount(_totalCount);

                    setFileToBeUpload(files[numb]);

                    setFileOnSelected(fileOnSelected + 1);
                }
            });
    }

    const resetChunkProperties = () => {
        setProgress(0);
        setCounter(1);
        setBeginingOfTheChunk(0);
        setEndOfTheChunk(chunkSize);
        setFileSize(0);
        setChunkCount(0);
        setFileToBeUpload({});
    }

    useEffect(() => {
        if (fileSize > 0) {
            fileUpload(counter);
        }
    }, [fileToBeUpload, progress]);

    const fileUpload = () => {
        setCounter(counter + 1);
        if (counter <= chunkCount) {
          var chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
          uploadChunk(chunk)
        }
    }

    const uploadChunk = async (chunk) => {
        try {
            const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/files/UploadChunks`, chunk, {
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                cancelToken: source.token
            });

            const data = response.data;

            if (response.status === 200) {
                let numb = fileOnSelected;
                if(files[numb].size > 104857600) {
                    chunkSize = 10 * 1024 * 1024;
                }

                setBeginingOfTheChunk(endOfTheChunk);
                setEndOfTheChunk(endOfTheChunk + chunkSize);

                if(counter == chunkCount) {
                    console.log('Process is complete, counter', counter)
                    await uploadCompleted();
                } else {
                    var percentage = Math.floor((counter / chunkCount) * 100);
                    setProgress(percentage);
                }
            } else {
                console.log('Error Occurred:', data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const uploadCompleted = async () => {
        if(files.length > 1) {
            setFileOnSelected(fileOnSelected + 1);
        }

        const token = JSON.parse(localStorage.getItem('tokens'));

        let numb = 0;

        if(files.length > 1) {
            numb = fileOnSelected;
        }

        const response = await axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/files/addfiles/${token.id}/${folderName}/${files[numb].name}`, {
            cancelToken: source.token
        });

        if (response.status === 200) {

            const userId = token.id;
            const friendId = toUser;

            const data = {
                chatId: chatId,
                fromUser: token.id,
                toUser: friendId,
                message: `/${token.id}/${folderName}/${files[numb].name}`
            };

            socket.emit('sendMessage', {data, chatId, friendId});
            socket.emit('sendMelding', {userId, friendId});

            // send message to chat
            axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/chat/sendimage`, {
                chatId: chatId,
                fromUser: token.id,
                toUser: toUser,
                message: `/${token.id}/${folderName}/${files[numb].name}`
            }).then(resp => {
                if(resp.status === 200) {
                    setProgress(100);
                    if(files.length == 1) {
                        setTimeout(() => {
                            resetChunkProperties();
                        }, 1000);
                    } else {
                        if(files.length - 1 === fileOnSelected) {
                            setTimeout(() => {
                                resetChunkProperties();
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                getFileContext();
                            }, 1000);
                        }
                    }
                }
            })
        }
    }

    return [
        (foldername, files, chatId, toUser) => firstGetFileContext(foldername, files, chatId, toUser)
    ]
}

export default useFileUpload;