import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import SelectTime from './SelectTime';
import Groups from './Groups';
import Silk from './Silk';
import axios from 'axios';


function HomePage({ updateLoggedIn }) {

    async function logOut() {
        try {
            let resp = await axios.post('/auth/logout', {}, { withCredentials: true });
            updateLoggedIn(); // Update state
        } catch (error) {
            
        }
    }

    return (
        <div style={{color:'white'}}>
            <SelectTime />
            <button onClick={logOut}>Log Out</button>
            <Groups />
        </div>
    );
}

export default HomePage;