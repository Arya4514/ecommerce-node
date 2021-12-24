const express = require("express");
const router = express.Router();
const UsersController = require("../apis/UsersApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role")

router.post("/create-user", authorize([Role.ADMIN]), UsersController.createUser);
router.post("/forgot-password-by-username", UsersController.forgotPasswordByUsername);
router.post("/resent-confirmation-mail", UsersController.resentconfirmationmail);
router.post('/upload-profile', authorize([Role.ADMIN, Role.USER]), UsersController.uploadImage);

router.put("/confirm-email", UsersController.confirmEmail);
router.put("/forgot-password", UsersController.forgotPassword);
router.put("/edit-profile", authorize([Role.USER]), UsersController.editProfile);
router.put("/edit-user", authorize([Role.ADMIN]), UsersController.editUser);
router.put("/reset-password", authorize([Role.ADMIN, Role.USER]), UsersController.resetPassword);
router.put("/update-user-status", authorize([Role.ADMIN]), UsersController.updateUserStatus);
router.put("/forgot-personal-pin", UsersController.forgotPersonalPin);

router.get("/get-user-by-id/:id", authorize([Role.ADMIN, Role.USER]), UsersController.getUserByID);
router.get("/get-users", authorize([Role.ADMIN]), UsersController.getUsers);
router.get("/get-users-by-station-id", authorize([Role.ADMIN]), UsersController.getUsersByStationID);

module.exports = router;
