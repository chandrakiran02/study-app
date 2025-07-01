import React, { useState } from 'react';
import Timer from './Timer';
import axios from 'axios';

function SelectTime() {
    
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [groupID, setGroupID] = useState(null); // pass this into Groups
    const [selectedGroup, setSelectedGroup] = useState(0);
    const [timeInSeconds, setTimeInSeconds] = useState(0); // For Timer component to take.

    // Handle input changes to states
    const handleHoursChange = (e) => {
        setHours(e.target.value);
    };

    const handleMinutesChange = (e) => {
        setMinutes(e.target.value)
    };
    const updSetSelectedGroup = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleSecondsChange = (e) => {
        setSeconds(e.target.value)
    };
    const handleSubmit = () => {
        // e.preventDefault(); // 
        const totalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60) + Number(seconds);
        setTimeInSeconds(totalSeconds);
        setShowTimer(true);
    };


    // If want to goto form again: 
    const handleBackToForm = () => {
        setShowTimer(false);
        // reset states.
        setHours(0); 
        setMinutes(0);
        setSeconds(0);
    };


    async function check(grpid) { // For checking id im in a group or not.
        try {
            let resp = await axios.get(`http://localhost:5000/groups/${grpid}/membership`, {withCredentials: true});
            if(resp.data.ok == true) {
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            console.log("ERROR in check");
        }
    }
    async function selectThisGroup() {
        let ok = await check(selectedGroup);
        if(selectedGroup < 0) {
            alert("Not valid group ID");
            return;
        }
        else if(!ok) {
            alert("You are not there in this group.");
            return;
        }
        // localStorage.setItem('selectedGroupID', selectedGroup);
        setGroupID(selectedGroup);
        alert("Group Selected");
    }


    return (
        <div style={{color:'white'}}>
            {!showTimer ? ( // Show iff showTimer.
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
                    <div>
                        <label>Enter GroupID : </label>
                        <input type='number' min={0} value={selectedGroup} onChange={updSetSelectedGroup}></input>
                        <button type="button" onClick={selectThisGroup}>select</button>
                    </div>
                    <button onClick={handleSubmit}>Start Timer</button>
                </form>
            ) : ( // else if wanna show: 
                // return this.
                <div>
                    <Timer timeInSeconds={timeInSeconds} groupID={groupID} /> 
                    <button onClick={handleBackToForm}>Set New Time</button>
                </div>
            )}
        </div>
    );
}

export default SelectTime;