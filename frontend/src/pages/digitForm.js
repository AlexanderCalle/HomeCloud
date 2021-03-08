import React, { useState, useEffect} from 'react';
import axios from 'axios';

function DigitForm(props) {

    const [code, setCode] = useState('');
    const [isError, setIsError] = useState(false);
    const { email } = props.match.params;

    function submitDigit() {
        if(code !== '') {
            axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/forgot/checkcode/${email}/${code}`)
                .then(response => {
                    if(response.status === 200) {
                        window.location.href = `http://${process.env.REACT_APP_HOST_IP}:3000/newPassword/${email}/${code}`;
                    }
                }).catch(err => {
                    
                })
        }
    }

    return (
        <div class="fixed z-10 inset-0 overflow-y-auto shadow-2xl bg-white">
            <div className="flex items-center justify-center h-screen w-screen min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="space-y-5 text-center lg:w-1/4 w-80">
                    <div className="flex flex-col items-center space-y-4">
                    <svg class="w-20 h-20 text-cornblue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                    <h1 className="text-cornblue-400 text-3xl font-bold">HomeCloud</h1>
                    <h2 className="text-xl font-bold text-gray-800">Check your code for validation</h2>
                    </div>
                    { isError && <p className="text-red-500">Code isn't right or outdated</p>}
                    <form className="w-full mt-6 flex flex-col space-y-0" onSubmit={(e)=> { e.preventDefault(); submitDigit()}}>
                        <input type="text" value={code} onChange={ (e) => setCode(e.target.value) } placeholder="Digit code here..." class="h-8 p-2 block w-full text-md border border-gray-500 rounded-md focus:outline-none"/>
                        <input type="submit" class="hidden" />
                    </form>
                    <div className="mt-6 flex flex-col space-y-4">
                        <div className="w-full flex flex-col space-y-2">
                            <button type="button" type="button" onClick={submitDigit} className="w-full inline-flex justify-center rounded-lg shadow-sm py-2 bg-cornblue-400 text-cornblue-200 font-medium hover:bg-cornblue-600 focus:outline-none sm:w-auto text-md">
                                Check code
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DigitForm;