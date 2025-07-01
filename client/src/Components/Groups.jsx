import React from 'react';
import { useState , useEffect } from 'react';
import axios from 'axios';
import SingleGroup from './SingleGroup';



export default function Groups() {

    const [joined, setJoined] = useState(false); // When i join a group, for triggering a rerender.

    const [createGroupName, setCreateGroupName] = useState('');
    function putCreateGroupName(e) {
        setCreateGroupName(e.target.value);
    }
    
    const [groups, setGroups] = useState([]);
    
    const [joingrpval, setjoingrpval] = useState(0);
    function setjoinGrpval(e) {
        setjoingrpval(e.target.value);
    }

    const [userID, setUserID] = useState(null);
    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/auth/check', {withCredentials: true});
                if (resp.success) {
                    setUserID(resp.userID);
                } else {
                    setUserID(null);
                }
            } catch (error) {
                setUserID(null);
            }
        };
        fetchUserID();
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [userID]);



    async function createGroup({groupName}) { // API CALL FUNCTION
        const response = await axios.post('http://localhost:5000/groups', {groupName: groupName}, {withCredentials: true});
        if(response.data.success){
            alert("Group Created");
            fetchGroups(); // refresh list so newly created group appears immediately
        }
        else{
            alert(response.data.message);
        }
    }

    const fetchGroups = async () => { // API CALL FUNCTION
        try {
            const response = await axios.get(`http://localhost:5000/groups`, {withCredentials: true});
            setGroups(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    async function joinGroup({groupID}) { // API CALL FUNCTION
        try{
            const response = await axios.post(`http://localhost:5000/groups/${groupID}/join`, {}, {withCredentials: true});
            if(response.data.success){
                alert("Joined Group");
                fetchGroups(); // Fetch updated groups list after joining
                // Trigger Rerender.  
                setJoined(true);
                setJoined(false);
            }
            else if(!response.data.success){
                alert(response.data.message);
            }
        }catch(error){
            console.log(error);
        }
    }


    return (
        <div style={{color:'white'}}>

            {/*Groups you are In
                ikkada add cards that has a button to leave/ show leaderboard / show members
            */}
            <h1>Groups you are In : </h1>
            {
            /*
                When React renders this, it:
                Takes the array of components
                Renders each component in order
                Places them in the DOM where you put the map expression
                So if you were to look at the rendered HTML, you would see something like:
                two divs. inside the divs, we have Single group components
            */
            }

            {groups && groups.map((group) => (
                <SingleGroup 
                    key={group.groupid} 
                    GroupName={group.groupname} 
                    GroupID={group.groupid}
                    onLeave={fetchGroups} // for
                />
            ))}

            {/* Join Group */}
            <input type="number" placeholder="groupID" value={joingrpval} onChange={setjoinGrpval}></input>
            <button onClick={() => joinGroup({ groupID: joingrpval })}>Join Group</button>

            {/*Create Group*/}

            <input type="text" placeholder="name your group" onChange={putCreateGroupName} value={createGroupName}></input>
            <button onClick={() => createGroup({ groupName: createGroupName })}>Create Group</button>

        </div>    
    )
};