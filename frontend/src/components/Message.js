import React, { Component } from 'react';

class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "Simple message",
            isError: false,
        }
    }

    closeMessage = (i) => {
        if(i == "succesMessage"){
            document.getElementById('succesMessage').style.visibility = "hidden";
        }

        if(i == "errorMessage"){
            document.getElementById('errorMessage').style.visibility = "hidden";
        }
    }

    render() {
        return (
            <div className="fixed w-full flex items-center mt-2">
                {this.state.isError ? (
                    <div id="errorMessage" class="z-20 flex justify-center items-center m-auto font-medium py-1 px-2 rounded-md text-red-700 bg-red-100 border border-red-300">
                        <div slot="avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-octagon w-5 h-5 mx-2">
                                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div class="text-xl font-normal  max-w-full flex-initial"> {this.state.message} </div>
                        <div class="flex flex-auto flex-row-reverse">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-5 h-5 ml-2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div id="succesMessage" class="z-20 flex justify-center items-center m-auto font-medium py-1 px-2 rounded-md text-green-700 bg-green-100 border border-green-300 ">
                        <div slot="avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle w-5 h-5 mx-2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div class="text-xl font-normal  max-w-full flex-initial"> {this.state.message} </div>
                        <button class="flex flex-auto flex-row-reverse" onClick={()=> this.closeMessage("succesMessage")}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x cursor-pointer hover:text-green-400 rounded-full w-5 h-5 ml-2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        )
    }

}

export default Message;