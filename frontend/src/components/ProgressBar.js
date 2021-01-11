import React from 'react';

const ProgressBar = ({filename, progress}) => {
    return (
        <div className="w-full h-16 border-b ">
            <div>
                <div className="relative pt-2">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                {filename}
                            </span>
                        </div>
                        <div className="flex flex-row items-center space-x-2 text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                { progress > 0 && progress + '%'}
                            </span>
                            <button>
                                <svg class="w-6 h-6" fill="none" stroke="rgba(37, 99, 235)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                        <div style={{ width: progress + '%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 shim-blue"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar