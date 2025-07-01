import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Color } from 'three/src/Three.Core.js';


function Timer({ timeInSeconds, groupID }) { 

    /*
        Notes : 
            Mounting is the initial phase when React renders your component for the first time.
            After mounting, the component can be updated (re-rendered with new props or state) 
            or unmounted (removed from the page).


        The initial state (useState(timeInSeconds)) only sets the timer once, when the component first mounts.
        If the parent changes timeInSeconds later (for example, user selects a new timer duration), 
        the state will not update automatically.
        This useEffect listens for changes to timeInSeconds and updates the timer accordingly.  

    */
    // States
    const [time, setTime] = useState(timeInSeconds);
    const [paused, setPaused] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [userID, setUserID] = useState(null);

    // Fetch userID from /check on mount
    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/auth/check', {withCredentials: true});
                if (resp.data.success) {
                    setUserID(resp.data.userID);
                }
            } catch (error) {
                setUserID(null);
            }
        };
        fetchUserID();
    }, []);

    // Update timer when timeInSeconds changes
    useEffect(() => {
        setTime(timeInSeconds);
        setCompleted(false);
    }, [timeInSeconds]);

    const logTime = async (howMuch) => {
        if (!userID || !groupID) return;
        try {
            const response = await axios.post(`http://localhost:5000/groups/${groupID}/log`, 
                { timeInSeconds: howMuch },
                {withCredentials: true}
            );
            if (response.status === 200) {
                console.log('Logged successfully.');
            }
        } catch (error) {
            console.error('Error logging time:', error);
        }
    }; 

    function pauseMech() {
        setPaused(!paused);
    }

    function resetMech() {
        logTime(timeInSeconds - time);
        setPaused(true);
        setTime(timeInSeconds);
    }

    // Function for logging time
                
    useEffect(
        () => {
            if (paused) {
                return; // if paused, dont update the log.
            }
            if (time == 0) {
                logTime(timeInSeconds); // Log the time.
                setCompleted(true); // This is for showing the "Completed" message.
                return;
            }

            const timer = setTimeout(() => {setTime(prevTime => prevTime - 1);}, 1000); // do this every second.
            // React re renders the html, when there is a state change, when setTime is called.
            return () => clearTimeout(timer);
        }, 
    
        [time, paused, timeInSeconds]
    
    );

    // Convert the time(seconds) to HH::MM:SS
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return (
         ( // <- Show only when Visible.
            <div>
                <h1 style={{color:'white'}}>{String(hours).padStart(2, '0')} : {String(minutes).padStart(2, '0')} : {String(seconds).padStart(2, '0')}</h1>
                {completed ? (
                    <div style={{color:'white'}}>Timer complete!</div>
                    ) : ( // else 
                        <>
                            <Button onClick={pauseMech}>{paused ? "Resume" : "Pause"}</Button>
                            <Button style={{color:'white'}} onClick={resetMech}>Reset</Button>
                        </>
                    )
                }
            </div>
        )
    );
}

export default Timer;