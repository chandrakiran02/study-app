import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import SelectTime from './SelectTime';
import Groups from './Groups';


function HomePage({ updateLoggedIn }) {

    function logOut() {
        localStorage.setItem('userID', null);
        updateLoggedIn();
    }

    return (
        <div>
            <SelectTime />
            <button onClick={logOut}>Log Out</button>
            <Groups />
        </div>
    );
}

export default HomePage;