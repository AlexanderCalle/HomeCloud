import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

import Home from './pages/home';
import Collection from './pages/collection';
import Login from './pages/login';
import Register from './pages/register';
import MyProfile from './pages/myProfile';
import ChatsPage from './pages/ChatsPage';
import FriendsPage from './pages/FriendsPage';
import SharedPage from './pages/shared';
import socketIOClient from "socket.io-client";

export const socket = socketIOClient(`http://${process.env.REACT_APP_HOST_IP}:3030`, {transports: ['websocket']});

function App() {

  socket.on('connection', function() {
    console.log('connection');
  })

  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [ authTokens, setAuthTokens ] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          <Switch>
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/' component={Home} />
            <PrivateRoute exact path='/collection/folder/:foldername/:folderId' component={Collection} />
            <PrivateRoute exact path='/myprofile' component={MyProfile} />
            <PrivateRoute exact path='/friends' component={FriendsPage} />
            <PrivateRoute exact path='/chat' component={ChatsPage} />
            <PrivateRoute exact path='/shared' component={SharedPage} />
            <Route exact path='/register' component={Register} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
