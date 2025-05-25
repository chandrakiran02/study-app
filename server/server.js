const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require("pg");
require('dotenv').config();
const app = express();


app.use(express.json());
app.use(cors());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

let connect = async () => {
  try {
    await db.connect();
    console.log("Database connected successfully");
  }
  catch (error) {
    console.error('Database connection error:', error);
  }
}
connect();


app.get('/groups', async (req, res) => {
  let userID = req.body.userID;
  try {
    let response = await db.query("SELECT groupid, groupname from (groupmembers NATURAL JOIN groups) where userid = $1", [userID]);
    res.json(response.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/groups', async (req, res) => {
  let userID = req.body.userID; // is text value. not Integer.
  try {
    let response = await db.query("SELECT groupid, groupname from (groupmembers NATURAL JOIN groups) where userid = $1", [userID]);
    res.json(response.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/groups/join', async (req, res) => {
  let userID = req.body.userID; // idi text value. not Integer.
  let groupID = req.body.groupID; // idi int value
  try {
    let resp1 = await db.query("SELECT * from groups where groupid = $1", [groupID]);
    let resp2 = await db.query("SELECT * from groupmembers where userid = $1 and groupid = $2", [userID, groupID]);
    if (resp1.rows.length == 0) {
      res.json({ success: false, message: "Group does not exist" });
    }
    else if (resp2.rows.length > 0) {
      res.json({ success: false, message: "You are already in this group" });
    }
    else {
      await db.query("INSERT INTO groupmembers VALUES ($2, $1)", [userID, groupID]);
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/groups/create', async (req, res) => {
  let groupName = req.body.groupName;
  let userID = req.body.userID;
  try {
    // first get the group table size. size + 1 this will be the groupid.
    let resp = await db.query("SELECT COUNT(*) FROM groups");

    let groupidthis = parseInt(resp.rows[0].count) + 1;

    await db.query("INSERT INTO groups VALUES ($1, $2)", [groupidthis, groupName]);
    await axios.post('http://localhost:5000/groups/join', { groupID: groupidthis, userID: userID });
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    let user = req.body.username;
    let pass = req.body.password;

    const result = await db.query(
      "SELECT username FROM users WHERE username = $1 AND password = $2",
      [user, pass]
    );

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/signup', async (req, res) => {
  let user = req.body.username;
  let pass = req.body.password;
  try {
    const result = await db.query("SELECT username FROM users WHERE username = $1", [user]);
    if (result.rows.length > 0) {
      res.json({ success: false, message: "Username already exists" });
    }
    else {
      await db.query("INSERT INTO users VALUES ($1, $2)", [user, pass]);
      res.json({ success: true });
    }
  }
  catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add the missing logthis endpoint
app.post('/api/logthis', async (req, res) => {
  try {
    const timeInSeconds = req.body.TimeInSeconds;
    let userID = req.body.userID;
    let groupID = req.body.groupID;
    let res = await db.query('UPDATE groupmembers SET timestudied = timestudied + $1 WHERE userid = $2 and groupid = $3', [timeInSeconds, userID, groupID]);
    
    console.log(`Study session logged: ${timeInSeconds} seconds`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging time:', error);
    res.status(500).json({ success: false });
  }
});

app.post('/groups/leave', async (req, res)=> {
  let userID = req.body.userID;
  let groupID = req.body.groupID;
  try {
    await db.query('DELETE FROM groupmembers WHERE userid = $1 and groupid = $2', [userID, groupID]);
    res.json({ success: true });
  } catch(error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post('/groups/leaderboard', async (req, res) => {
  const groupID = req.body.groupID;
  try {
    const result = await db.query('SELECT userid, timestudied from groupmembers where groupid = $1', [groupID]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const port = 5000;
//listen to the port 5000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});