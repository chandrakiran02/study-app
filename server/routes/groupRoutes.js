const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
const isLoggedIn = require('../middleware/auth');

// Protect all subsequent routes
router.use(isLoggedIn);

router.get('/', groupController.getUserGroups);
router.post('/', groupController.createGroup);
router.post('/:groupID/join', groupController.joinGroup);
router.post('/:groupID/leave', groupController.leaveGroup);
router.get('/:groupID/leaderboard', groupController.getLeaderboard);
router.post('/:groupID/log', groupController.logStudyTime);
router.get('/:groupID/membership', groupController.checkMembership);

module.exports = router; 