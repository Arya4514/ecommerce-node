const express = require("express");
const router = express.Router();
const StateController = require("../apis/StateApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/State", authorize([Role.ADMIN]), StateController.createState);

router.get("/get-state", StateController.getState);
router.get("/get-state-by-id/:id", StateController.getStateById);
router.get("/get-state-by-Country/:id", StateController.getStateByCountry);

router.put("/edit-state", authorize([Role.ADMIN]), StateController.editState);

router.put("/update-state-status", authorize([Role.ADMIN]), StateController.updateStateStatus);

module.exports = router;
