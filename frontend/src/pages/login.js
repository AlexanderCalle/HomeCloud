import '../index.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

function Login() {

  const [ isLoggedIn, setLoggedIn ] = useState(false); 
  const [ isError, setIsError ] = useState(null); 
  const [ emailUser, setEmail ] = useState(""); 
  const [ password, setPassword ] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    console.log('logging in');
    axios({method: "POST", url:`http://${process.env.REACT_APP_HOST_IP}:3030/login`, data: {
      email: emailUser,
      password: password
    }}).then(result => {
      if(result.status === 200) {
        console.log(result.data);
        setAuthTokens({
          email: result.data.email,
          id: result.data.id,
          profile_pic: result.data.profile_pic,
          name: result.data.name,
        });
        setLoggedIn(true)
      }
    }).catch(e => {
      console.log(e.response);
      if(e.response.status === 403) {
        switch(e.response.data) {
          case "email": 
            setIsError("Email does not exist!");
            break;
          case "password": 
            setIsError("Password is incorrect!");
            break;
          case "fields": 
            setIsError("Everything has to be filled in!");
            break;
          default:
            setIsError(e.response.data);
            break;
        }
      }
    });
  }

  if(isLoggedIn) {
    return <Redirect to="/" />
  }

    return (
        <div class="fixed z-10 inset-0 overflow-y-auto shadow-2xl bg-gray-100">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div class="w-full bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="min-w-0 sm:flex sm:items-start">
                    <div class="w-full mt-3 text-center sm:mt-0 sm:ml-1 sm:text-left">
                      <h3 class="text-2xl leading-1 font-medium text-blue-500" id="modal-headline">
                        Login
                      </h3>
                      { isError !== null && <p className="text-red-500">{isError}</p>}
                      <form class="w-full mt-4 flex flex-col space-y-4" onSubmit={(e)=> { e.preventDefault(); postLogin()}}>
                          <input type="text" value={emailUser} onChange={ (e) => setEmail(e.target.value) } placeholder="Email..." class="h-8 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-blue-500 rounded-md"/>
                          <input type="password" value={password} onChange={ (e) => setPassword(e.target.value) } placeholder="Password..." class="h-8 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-blue-500 rounded-md"/>
                          <input type="submit" class="hidden" />
                      </form>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" onClick={postLogin} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Login
                  </button>
                  <a href="/register">
                  <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Register
                  </button>
                  </a>
                </div>
              </div>
          </div>
        </div>
    )
}

export default Login;
