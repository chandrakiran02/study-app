import React, { useState } from 'react';
import Timer from './Timer';

function SelectTime() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [timeInSeconds, setTimeInSeconds] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
        setTimeInSeconds(totalSeconds);
        setShowTimer(true);
    };

    const handleHoursChange = (e) => {
        setHours(e.target.value === '' ? '' : Number(e.target.value));
    };

    const handleMinutesChange = (e) => {
        setMinutes(e.target.value === '' ? '' : Math.min(59, Number(e.target.value)));
    };

    const handleSecondsChange = (e) => {
        setSeconds(e.target.value === '' ? '' : Math.min(59, Number(e.target.value)));
    };

    const handleBackToForm = () => {
        setShowTimer(false);
    };

    return (
        <div>
            {!showTimer ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="hours">Hours: </label>
                        <input 
                            id="hours"
                            type="number" 
                            min="0" 
                            value={hours} 
                            onChange={handleHoursChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="minutes">Minutes: </label>
                        <input 
                            id="minutes"
                            type="number" 
                            min="0" 
                            max="59" 
                            value={minutes} 
                            onChange={handleMinutesChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="seconds">Seconds: </label>
                        <input 
                            id="seconds"
                            type="number" 
                            min="0" 
                            max="59" 
                            value={seconds} 
                            onChange={handleSecondsChange} 
                        />
                    </div>
                    <button type="submit">Start Timer</button>
                </form>
            ) : (
                <div>
                    <Timer timeInSeconds={timeInSeconds} Visible={true} />
                    <button onClick={handleBackToForm}>Set New Time</button>
                </div>
            )}
        </div>
    );
}

export default SelectTime;