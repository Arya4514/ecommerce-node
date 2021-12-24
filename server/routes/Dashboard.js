const express = require("express");
const router = express.Router();
const DashboardController = require("../apis/DashboardApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.get("/total-station", authorize([Role.ADMIN]), DashboardController.totalStation);
router.get("/total-gasoline-entry-reports", authorize([Role.ADMIN, Role.USER]), DashboardController.totalGasolineEntryReports);
router.get("/total-pending-gasoline-entry-reports", authorize([Role.ADMIN, Role.USER]), DashboardController.totalPendingGasolineEntryReports);
router.get("/total-verified-gasoline-entry-reports", authorize([Role.ADMIN, Role.USER]), DashboardController.totalVerifiedGasolineEntryReports);
router.get("/total-rejected-gasoline-entry-reports", authorize([Role.ADMIN, Role.USER]), DashboardController.totalRejectededGasolineEntryReports);
router.get("/total-users", authorize([Role.ADMIN]), DashboardController.totalUsers);
router.get("/get-last-entered-gasoline-entry-dashboard", DashboardController.getLastEnteredGasolineData);

module.exports = router;
