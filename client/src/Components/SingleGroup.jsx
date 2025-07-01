import React, { useState } from 'react';
import axios from 'axios';

export default function SingleGroup({GroupName, GroupID, onLeave}) {

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    
    const [userID, setUserID] = useState(null);

    React.useEffect(() => {
        const fetchUserID = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/auth/check',  {withCredentials: true});
                if (resp.data.success) {
                    setUserID(resp.data.userID);
                }
            } catch (error) {
                setUserID(null);
            }
        };
        fetchUserID();
    }, []);
    
    async function leaveGroup() {
        const response = await axios.post(`http://localhost:5000/groups/${GroupID}/leave`, {}, {withCredentials: true});
        if(response.data.success){
            setShowLeaderboard(false);
            onLeave();
            alert("Left Group");
        }
        else{
            alert(response.data.message);
        }
    }
    function getTime(seconds){
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondss = seconds % 60;
        return (
            <span style={{color:'white'}}>
                {hours}:{minutes}:{secondss} 
            </span>
        );
    }
    async function fetchLeaderboard() {
        const response = await axios.get(`http://localhost:5000/groups/${GroupID}/leaderboard`, {withCredentials: true});
        setLeaderboardData(response.data); // set the array to response data
        setShowLeaderboard(true);
    }
    return (
        <div>
            <h1>{GroupName} : {GroupID}</h1>
            <button onClick={leaveGroup}>Leave</button>
            <button onClick={fetchLeaderboard}>Leaderboard</button>
            
            {showLeaderboard && (
                <div style={{color:'white'}}>
                    <h2>Leaderboard</h2>
                    <button onClick={() => setShowLeaderboard(false)}>Close</button> {/* for closing lb*/ }
                    {leaderboardData.map((entry, index) => (
                        <div key={index}>
                            <div>{entry.userid} --- {getTime(entry.timestudied)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}