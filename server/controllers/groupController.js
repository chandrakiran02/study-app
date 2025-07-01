const db = require('../config/db');

/**
 * GET /groups
 * Return all groups for the logged-in user.
 */
exports.getUserGroups = async (req, res) => {
  const userID = req.userID;

  try {
    const { rows } = await db.query(
      'SELECT groupid, groupname FROM (groupmembers NATURAL JOIN groups) WHERE userid = $1',
      [userID]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /groups
 * Create a new group and automatically add the creator as a member.
 */
exports.createGroup = async (req, res) => {
  const { groupName } = req.body;
  const userID = req.userID;

  try {
    const resp = await db.query('SELECT COUNT(*) FROM groups');
    const groupID = parseInt(resp.rows[0].count) + 1;

    await db.query('INSERT INTO groups VALUES ($1, $2)', [groupID, groupName]);
    await db.query('INSERT INTO groupmembers (userid, groupid, timestudied) VALUES ($1, $2, 0)', [userID, groupID]);
    
    return res.json({ success: true, groupID });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /groups/:groupID/join
 */
exports.joinGroup = async (req, res) => {
  const userID = req.userID;
  const { groupID } = req.params;

  try {
    const resp1 = await db.query('SELECT * FROM groups WHERE groupid = $1', [groupID]);
    const resp2 = await db.query('SELECT * FROM groupmembers WHERE userid = $1 AND groupid = $2', [userID, groupID]);

    if (resp1.rows.length === 0) {
      return res.json({ success: false, message: 'Group does not exist' });
    }

    if (resp2.rows.length > 0) {
      return res.json({ success: false, message: 'You are already in this group' });
    }

    await db.query('INSERT INTO groupmembers (userid, groupid, timestudied) VALUES ($1, $2, 0)', [userID, groupID]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /groups/:groupID/leave
 */
exports.leaveGroup = async (req, res) => {
  const userID = req.userID;
  const { groupID } = req.params;

  try {
    await db.query('DELETE FROM groupmembers WHERE userid = $1 AND groupid = $2', [userID, groupID]);
    return res.json({ success: true });
  } catch (error) {
    console.error('Error leaving group:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /groups/:groupID/leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  const { groupID } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT userid, timestudied FROM groupmembers WHERE groupid = $1',
      [groupID]
    );
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /groups/:groupID/log
 * Log study time in seconds for the current user.
 */
exports.logStudyTime = async (req, res) => {
  const { groupID } = req.params;
  const { timeInSeconds } = req.body; // camelCase for request body
  const userID = req.userID;
  
  try {
    await db.query(
      'UPDATE groupmembers SET timestudied = timestudied + $1 WHERE userid = $2 AND groupid = $3',
      [timeInSeconds, userID, groupID]
    );
    return res.json({ success: true });
  } catch (error) {
    console.error('Error logging time:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /groups/:groupID/membership
 * Check if current user is a member of a group.
 */
exports.checkMembership = async (req, res) => {
  const { groupID } = req.params;
  const userID = req.userID;

  try {
    const { rows } = await db.query(
      'SELECT 1 FROM groupmembers WHERE groupid = $1 AND userid = $2',
      [groupID, userID]
    );
    return res.json({ ok: rows.length > 0 });
  } catch (error) {
    console.error('Error checking membership:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 