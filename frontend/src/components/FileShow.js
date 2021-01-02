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
                {props.file.is_image ? <img src={'http://localhost:3030' + props.file.file} /> : <h1>{props.file.filename}</h1>}
                </>
            </div>
        </div>
    )

}

export default FileShow;