const express = require("express");
const router = express.Router();
const AuthenticationController = require("../apis/AuthenticationApi");

router.post("/auth/sign-in", AuthenticationController.signIn);
router.post("/auth/sign-up", AuthenticationController.signUp);
router.post("/auth/verify-otp", AuthenticationController.verifyOTP);

module.exports = router;
