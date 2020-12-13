import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

function App() {

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
            <Route exact path='/register' component={Register} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App;
