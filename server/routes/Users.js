const express = require("express");
const router = express.Router();
const UsersController = require("../apis/UsersApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role")

router.post("/create-user", authorize([Role.SUPER_ADMIN]), UsersController.createUser);
router.post("/create-seller", authorize([Role.SUPER_ADMIN]), UsersController.createSeller);
router.post("/forgot-password-by-username", UsersController.forgotPasswordByUsername);
router.post("/resent-confirmation-mail", UsersController.resentconfirmationmail);
router.post('/upload-profile', authorize([Role.SUPER_ADMIN, Role.USER]), UsersController.uploadImage);

router.put("/confirm-email", UsersController.confirmEmail);
router.put("/forgotpassword-sendemail", UsersController.forgotPasswordEmail);
router.put("/forgot-password", UsersController.forgotPassword);
router.put("/edit-profile", authorize([Role.USER]), UsersController.editProfile);
router.put("/edit-user", authorize([Role.SUPER_ADMIN]), UsersController.editUser);
router.put("/reset-password", authorize([Role.SUPER_ADMIN, Role.USER]), UsersController.resetPassword);
router.put("/update-user-status", authorize([Role.SUPER_ADMIN]), UsersController.updateUserStatus);
router.put("/forgot-personal-pin", UsersController.forgotPersonalPin);

router.get("/get-user-by-id/:id", authorize([Role.SUPER_ADMIN, Role.USER]), UsersController.getUserByID);
router.get("/get-users", authorize([Role.SUPER_ADMIN]), UsersController.getUsers);
router.get("/get-users-by-station-id", authorize([Role.SUPER_ADMIN]), UsersController.getUsersByStationID);

module.exports = router;
