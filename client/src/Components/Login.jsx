import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ updateLoggedIn }) {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    function changeUsername(input) {
        setUsername(input.target.value);
    }
    
    function changePassword(input) {
        setPassword(input.target.value);
    }

    async function login(e) {
        e.preventDefault(); // Prevent form submission
        try {

            const response = await axios.post('http://localhost:5000/login', {
                username: username,
                password: password
            });

            if(response.data.success) {
                updateLoggedIn(); 
                localStorage.setItem('userID', username);
            } else {
                alert('Login failed: ' + "Invalid username or password");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    async function signUp(e) {
        e.preventDefault(); // Prevent form submission
        try {
            const response = await axios.post('http://localhost:5000/signup', {username: username, password: password});
            if(response.data.success) {
                alert("Signup successful");
            }
            else {
                alert("Signup failed: " + response.data.message);
            }
        }
        catch(error) {
            alert('Signup failed. Please try again.');
        }
        
    }

    async function logOut() {
        localStorage.setItem('userID', null);
        
    }
    
    return (
        <div>
            <form onSubmit={login}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={changeUsername}
                    placeholder="Username"
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={changePassword}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
                <button type="button" onClick={signUp}>Sign Up</button>
            </form>
        </div>
    );
}