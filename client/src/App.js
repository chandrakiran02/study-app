import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

import HomePage from './Components/HomePage';
import Login from './Components/Login';

function App() {
  useEffect(() => {
    // initialize userID in localStorage if it doesn't exist
    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', null);
    }

    if(!localStorage.getItem('selectedGroupID')){
      localStorage.setItem('selectedGroupID', null);
    }

  }, []);


  let userID = localStorage.getItem('userID');
  const LOGSTATE = (userID === 'null') ? false : true;
  let [loggedIn, setLoggedIn] = useState(LOGSTATE);

  function updateLoggedIn() {
    setLoggedIn(!loggedIn);
  }
  
  return (
    <div>
      {loggedIn ? <HomePage updateLoggedIn={updateLoggedIn} /> : <Login updateLoggedIn={updateLoggedIn} />}
    </div>
  );
}

export default App;
