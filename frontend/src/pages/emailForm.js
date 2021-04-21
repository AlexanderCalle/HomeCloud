import React, { useState, useEffect }from 'react';
import axios from 'axios';

function EmailForm() {

    const [email, setEmail] = useState("");
    const [isError, setIsError] = useState(false);
    const [code, setCode] = useState("")

    function submitEmail() {
        if(email !== "") {
            axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/forgot/sendcode/${email}`)
                .then(response => {
                    if(response.status === 200) {
                        // window.location.href = `http://${process.env.REACT_APP_HOST_IP}:3000/digitCode/${email}`
                        // get code from backend and show on page for users
                        setCode(response.data.code);
                    }
                }).catch(err => {
                    setIsError(true)
                })
        }
    }

    return (
        <div class="fixed z-10 inset-0 overflow-y-auto shadow-2xl bg-white">
            <div className="flex items-center justify-center h-screen w-screen min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="space-y-5 text-center lg:w-1/4 w-80">
                    {code === "" ? (
                        <>
                            <div className="flex flex-col items-center space-y-4">
                                <svg class="w-20 h-20 text-cornblue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                                <h1 className="text-cornblue-400 text-3xl font-bold">HomeCloud</h1>
                                <h2 className="text-xl font-bold text-gray-800">Email user to change password</h2>
                                <p className="text-gray-500">This emails password will be changed!</p>
                            </div>
                            { isError && <p className="text-red-500">Email does not exist</p>}
                            <form className="w-full mt-6 flex flex-col space-y-0" onSubmit={(e)=> {e.preventDefault(); submitEmail()}}>
                                <input type="text" value={email} onChange={ (e) => setEmail(e.target.value) } placeholder="Email..." class="h-8 p-2 block w-full text-md border border-gray-500 rounded-md focus:outline-none"/>
                                <input type="submit" class="hidden" />
                            </form>
                            <div className="mt-6 flex flex-col space-y-4">
                                <div className="w-full flex flex-col space-y-2">
                                    <button type="button" onClick={submitEmail} className="w-full inline-flex justify-center rounded-lg shadow-sm py-2 bg-cornblue-400 text-cornblue-200 font-medium hover:bg-cornblue-600 focus:outline-none sm:w-auto text-md">
                                        Send email
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        // showing code here
                        <div className="flex flex-col items-center space-y-4">
                            <svg class="w-20 h-20 text-cornblue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                            <h1 className="text-cornblue-400 text-3xl font-bold">HomeCloud</h1>
                            <h2 className="text-lg font-bold text-gray-800">This is your code:</h2>
                            <p className="mt-4 text-gray-500 text-2xl">{code}</p>
                            <button className="bg-cornblue-400 text-cornblue-200 py-1 rounded-md flex flex-row items-center justify-center w-64" onClick={()=> window.location.href = `http://${process.env.REACT_APP_HOST_IP}:3000/digitCode/${email}`}>
                                continue
                                <svg class="w-6 h-6 right-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}

export default EmailForm;