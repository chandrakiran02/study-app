import React from 'react';
import { useState , useEffect } from 'react';
import axios from 'axios';
import SingleGroup from './SingleGroup';



export default function Groups() {


    const [joined, setJoined] = useState(false);
    const [createGroupName, setCreateGroupName] = useState('');

    function putCreateGroupName(e) {
        setCreateGroupName(e.target.value);
    }
    let userID = localStorage.getItem('userID');
    async function createGroup({groupName}) {
        const response = await axios.post('http://localhost:5000/groups/create', {groupName: groupName, userID: userID});
        if(response.data.success){
            alert("Group Created");
        }
        else{
            alert(response.data.message);
        }
    }

    const [groups, setGroups] = useState([]);

    const fetchGroups = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/groups/`, {userID: userID});
            setGroups(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [userID]);

    async function joinGroup({groupID}){
        try{
            const response = await axios.post('http://localhost:5000/groups/join', {userID: userID, groupID: groupID});
            if(response.data.success){
                alert("Joined Group");
                fetchGroups(); // Fetch updated groups list after joining
                setJoined(true);
            }
            else if(!response.data.success){
                alert(response.data.message);
            }
            if(joined) {
                setJoined(false);
            }
        }catch(error){
            console.log(error);
        }
    }

    const [joingrpval, setJoinGrpval] = useState(0);
    function setjoingrpval(e) {
        setJoinGrpval(e.target.value);
    }

    const [selectedGroup, setSelectedGroup] = useState(0);

    function selectGroup(e) {
        setSelectedGroup(e.target.value);
    }

    function selectThisGroup() {
        localStorage.setItem('selectedGroupID', selectedGroup);
        alert("Group Selected");
    }

    return (
        <div>
            {/*Select Group to Study In*/}
            <h1>Select Group to Study In: </h1>
            <input type="number" placeholder="Enter GroupID Here." onChange={selectGroup} value={selectedGroup}></input>
            <button onClick={selectThisGroup}>Select This Group</button>

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

            two divs. inside the divs, we have Single group components.

            */
            }

            {groups && groups.map((group) => (
                <SingleGroup 
                    key={group.groupid} 
                    GroupName={group.groupname} 
                    GroupID={group.groupid}
                    onLeave={fetchGroups} 
                />
            ))}

            {/* Join Group */}
            <input type="number" placeholder="groupID" value={joingrpval} onChange={setjoingrpval}></input>
            <button onClick={() => joinGroup({ groupID: joingrpval })}>Join Group</button>

            {/*Create Group*/}

            <input type="text" placeholder="name your group" onChange={putCreateGroupName} value={createGroupName}></input>
            <button onClick={() => createGroup({ groupName: createGroupName })}>Create Group</button>

        </div>    
    )
};