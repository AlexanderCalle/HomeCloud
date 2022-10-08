import '../index.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

function Login() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(null);
  const [emailUser, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    console.log('logging in');
    axios.post(`http://${process.env.REACT_APP_HOST_IP}:3030/login`, {
      email: emailUser,
      password: password
    }).then(result => {
      if (result.status === 200) {
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
      if (e.response.status === 403) {
        switch (e.response.data) {
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

  if (isLoggedIn) {
    return <Redirect to="/" />
  }

  return (
    <div class="fixed z-10 inset-0 overflow-y-auto shadow-2xl bg-white">
      <div className="flex items-center justify-center h-screen w-screen min-h-screen pt-4 px-4 pb-20 text-center">
        {isError !== null && (
          <div className="text-red-500 absolute top-3 border border-red-500 bg-red-50 px-4 py-2 rounded-md flex flex-row space-x-2">
            <p>{isError}</p>
            <span onClick={() => setIsError(null)} className="hover:bg-red-100 px-2 right-1 rounded-sm cursor-pointer">&#10005;</span>
          </div>
        )}
        <div className="space-y-5 text-center lg:w-1/4 w-80">
          <div className="flex flex-col items-center space-y-4">
            <svg class="w-20 h-20 text-cornblue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            <h1 className="text-cornblue-400 text-3xl font-bold">HomeCloud</h1>
            <h2 className="text-xl font-bold text-gray-800">Sign in to your account</h2>
          </div>
          <form className="w-full mt-6" onSubmit={(e) => { e.preventDefault(); postLogin() }}>
            <div className="flex flex-col space-y-0">
              <input type="text" value={emailUser} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." class="h-8 p-2 block w-full text-md border border-gray-500 rounded-t-md focus:outline-none" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." class="h-8 p-2 block w-full text-md border-l border-r border-b border-gray-500 rounded-b-md focus:outline-none" />
            </div>
            <div className="mt-4 flex flex-col space-y-4">
              <div className="flex xl:flex-row flex-col items-start justify-between">
                <label class="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox border border-gray-200 h-5 w-5 text-cornblue-400 rounded-sm" /><span class="ml-2 text-gray-700">Remember me</span>
                </label>
                <a href="/forgot" className="text-cornblue-400 font-medium xl:mt-0 mt-2">Forgot password?</a>
              </div>
              <div className="w-full flex flex-col space-y-2">
                <button type="submit" onClick={postLogin} className="w-full inline-flex justify-center rounded-lg shadow-sm py-2 bg-cornblue-400 text-cornblue-200 font-medium hover:bg-cornblue-600 focus:outline-none sm:w-auto text-md">
                  Sign in
                </button>
                <a className="w-full" href="/register">
                  <button type="button" class="w-full inline-flex justify-center rounded-lg shadow-sm py-2 bg-cornblue-200 text-base font-medium text-cornblue-400 text-md">
                    Sign up
                  </button>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
