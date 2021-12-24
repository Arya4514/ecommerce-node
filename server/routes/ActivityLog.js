const express = require('express');
const router = express.Router();
const ActivityController = require('../apis/ActivityLogsApi');
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role')

router.get("/get-all-activity", authorize([Role.ADMIN]), ActivityController.getAllActivityLogs);
router.get("/get-activity-by-id/:id", authorize([Role.ADMIN]), ActivityController.getActivityById)

module.exports = router;