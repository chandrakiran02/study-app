import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Timer({ timeInSeconds, Visible , onComplete}) {
    const [time, setTime] = useState(timeInSeconds);
    const [paused, setPaused] = useState(false);
    const [reset, setReset] = useState(false);
    const [complete, setComplete] = useState(false);
    const userID = localStorage.getItem('userID');
    const groupID = localStorage.getItem('selectedGroupID');
    // update that time when timeInSeconds prop changes lil pookie
    useEffect(() => {
        setTime(timeInSeconds);
        setComplete(false);
    }, [timeInSeconds]);

    function pauseMech() {
        setPaused(!paused);
    }

    function resetMech() {
        setTime(timeInSeconds);
        setReset(true);
        setComplete(false);
        setTimeout(() => setReset(false), 0);
    }

    useEffect(() => {
        if (paused || reset) {
            return;
        }
        
        if (time <= 0) {
            setComplete(true);
            const logTime = async () => {
                try {
                    
                    const response = await axios.post('http://localhost:5000/api/logthis', { TimeInSeconds: timeInSeconds , userID: userID, groupID: groupID});
                    onComplete();
                    if (response.status === 200) {
                        console.log('Response successful');
                    }
                } catch (error) {
                    console.error('Error logging time:', error);
                }
            };
            
            logTime();
            return;
        }

        const timer = setTimeout(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [time, paused, reset, timeInSeconds]);

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return (
        Visible && (
            <div>
                <h1>{String(hours).padStart(2, '0')} : {String(minutes).padStart(2, '0')} : {String(seconds).padStart(2, '0')}</h1>
                {complete ? (
                    <div>Timer complete!</div>
                ) : (
                    <>
                        <button onClick={pauseMech}>{paused ? "Resume" : "Pause"}</button>
                        <button onClick={resetMech}>Reset</button>
                    </>
                )}
            </div>
        )
    );
}

export default Timer;