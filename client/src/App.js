import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Silk from './Components/Silk';

function App() {
  const [loggedIn, setLoggedIn] = useState(null); // null = loading, false = not logged in, true = logged in

  useEffect(() => {
    const checkLogin = async () => {
      try {
        let resp = await axios.get('http://localhost:5000/auth/check', { withCredentials: true });
        if (resp.data.success) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  function updateLoggedIn() {
    setLoggedIn(!loggedIn);
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Silk as fixed background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none', // allows clicks to pass through
        }}
      >
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      {/* Main content on top */}

      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {loggedIn ? (
          <HomePage updateLoggedIn={updateLoggedIn} />
        ) : (
          <Login updateLoggedIn={updateLoggedIn} />
        )}
      </div>
    </div>
  );
}

export default App;
