const express = require("express");
const router = express.Router();
const CountryController = require("../apis/CountryApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/country", authorize([Role.ADMIN]), CountryController.createCountry);

router.get("/get-country", CountryController.getCountry);
router.get("/get-country-by-id/:id", CountryController.getCountryById);

router.put("/edit-country", authorize([Role.ADMIN]), CountryController.editCountry);
router.put("/update-country-status", authorize([Role.ADMIN]), CountryController.updateCountryStatus);

module.exports = router;
