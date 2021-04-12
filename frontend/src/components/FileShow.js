import React from 'react';

function FileShow(props) {

    return (
        <div className="w-1/3 bg-white rounded-tl-xl rounded-bl-xl border-l border-r border-gray-400 shadow-2xl p-2">
            <div className="h-16 bg-white flex flex-row justify-center items-center border-b">
                <button className="absolute right-0 pr-2" onClick={() => props.setFileshow(false)}>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="flex-none">
                    <h1 className="font-semibold">File Info</h1>
                </div>
            </div>
            <div className="flex flex-col p-2 space-y-8 justify-center items-center">
                <>
                {props.file.is_image ? <img src={'http://'+ process.env.REACT_APP_HOST_IP +':3030' + props.file.file} /> : <h1>No preview to see</h1>}
                </>
                {props.showShareDialog != undefined ? (
                <button type="button" onClick={() => props.showShareDialog(true)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    <p className="ml-2">Share with friend</p>
                </button>
                ) : null}
            </div>
        </div>
    )

}

export default FileShow;