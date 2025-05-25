import React, { useState } from 'react';
import axios from 'axios';

export default function SingleGroup({GroupName, GroupID, onLeave}) {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    let userID = localStorage.getItem('userID');
    async function leaveGroup() {
        const response = await axios.post('http://localhost:5000/groups/leave', {userID: userID, groupID: GroupID});
        if(response.data.success){
            setShowLeaderboard(false);
            onLeave();
            alert("Left Group");
        }
        else{
            alert(response.data.message);
        }
    }

    async function fetchLeaderboard() {
        const response = await axios.post('http://localhost:5000/groups/leaderboard', {groupID: GroupID, userID: userID});
        setLeaderboardData(response.data);
        
        setShowLeaderboard(true);

    }

    return (
        <div>
            <h1>{GroupName} : {GroupID}</h1>
            <button onClick={leaveGroup}>Leave</button>
            <button onClick={fetchLeaderboard}>Leaderboard</button>

            {showLeaderboard && (
                <div>
                    <h2>Leaderboard</h2>
                    <button onClick={() => setShowLeaderboard(false)}>Close</button>
                    {leaderboardData.map((entry, index) => (
                        <div key={index}>
                            <span>{index + 1}. {entry.userid}   </span>
                            <span>{entry.timestudied}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}