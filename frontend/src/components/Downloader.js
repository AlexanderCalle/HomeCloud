import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const Downloader = ({ files = [], remove }) => {
    return (
        <div className="fixed bg-white w-96 min-h-down right-2 bottom-2 max-h-60 overflow-y-auto border rounded-md shadow-xl">
            <div>
                <div className="bg-gray-100 p-2">File Downloader</div>
                <ul className="max-h-48 p-4 overflow-hidden overflow-y-auto">
                    {files.map((file, idx) => {
                        if(file.is_folder) {
                            return (<DonwloadFolder 
                                key={idx}
                                removeFile={()=> remove(file.downloadId)}
                                name={file.name}
                                folder={file.folder}
                            />)
                        } else {
                            return(<DownloadItem
                                key={idx}
                                removeFile={() => remove(file.downloadId)}
                                {...file}
                            />)
                        }
                    })}
                </ul>
            </div>
        </div>
    )
}

const DownloadItem = ({ name, file, filename, removeFile }) => {
    const CancelToken = Axios.CancelToken;
    const source = CancelToken.source();

    const [downloadInfo, setDownloadInfo] = useState({
        progress: 0,
        completed: false,
        total: 0,
        loaded: 0
    });

    useEffect(() => {
        const options = {
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;

                setDownloadInfo({
                    progress: Math.floor((loaded * 100) / total),
                    loaded,
                    total,
                    completed: false,
                })
            }
        }

        Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030` + file, {
                responseType: "blob",
                ...options,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                },
                cancelToken: source.token
            }).then(function (response) {
        
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                type: response.headers["content-type"],
                })
            );
        
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
        
            setDownloadInfo((info) => ({
                ...info,
                completed: true,
            }));
        
            setTimeout(() => {
                removeFile();
            }, 4000);
        });
    }, []);

    return (
        <li className="w-full h-16 border-b ">
            <div>
            <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            {name}
                        </span>
                    </div>
                    <div className="flex flex-row items-center space-x-2 text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            { downloadInfo.loaded > 0 && downloadInfo.progress + '%'}
                            { downloadInfo.loaded === 0 && 'Initializing...'}
                        </span>
                        <button onClick={async ()=> {
                            await removeFile()
                            source.cancel();
                        }}>
                            <svg class="w-6 h-6" fill="none" stroke="rgba(37, 99, 235)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div style={{ width: downloadInfo.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
                </div>
            </div>
        </li>
    )
}

const DonwloadFolder = ({name, folder, removeFile}) => {
    const CancelToken = Axios.CancelToken;
    const source = CancelToken.source();

    const [downloadInfo, setDownloadInfo] = useState({
        progress: 0,
        completed: false,
        total: 0,
        loaded: 0
    });

    useEffect(() => {
        const options = {
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;

                setDownloadInfo({
                    progress: Math.floor((loaded * 100) / total),
                    loaded,
                    total,
                    completed: false,
                })
            }
        }

        Axios.get(`http://${process.env.REACT_APP_HOST_IP}:3030/getfolder/` + folder, {
                responseType: "blob",
                ...options,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                },
                cancelToken: source.token
            }).then(function (response) {
            console.log(response);
        
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                type: response.headers["content-type"],
                })
            );
        
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
        
            setDownloadInfo((info) => ({
                ...info,
                completed: true,
            }));
        
            setTimeout(() => {
                removeFile();
            }, 4000);
        });
    }, []);

    return (
        <li className="w-full h-16 border-b ">
            <div>
            <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                            {name}
                        </span>
                    </div>
                    <div className="flex flex-row items-center space-x-2 text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                            { downloadInfo.loaded > 0 && downloadInfo.progress + '%'}
                            { downloadInfo.loaded === 0 && 'Initializing...'}
                        </span>
                        <button onClick={async ()=> {
                            await removeFile()
                            source.cancel();
                        }}>
                            <svg class="w-6 h-6" fill="none" stroke="rgba(37, 99, 235)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div style={{ width: downloadInfo.progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
                </div>
            </div>
        </li>
    )
}

export default Downloader;