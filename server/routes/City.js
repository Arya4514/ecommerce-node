const express = require("express");
const router = express.Router();
const CityController = require("../apis/CityApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/city", authorize([Role.ADMIN]), CityController.createCity);

router.get("/get-city", CityController.getCity);
router.get("/get-city-by-id/:id", CityController.getCityById);
router.get("/get-city-by-state/:id", authorize([Role.ADMIN]), CityController.getCityByState);

router.put("/edit-city", authorize([Role.ADMIN]), CityController.editCity);

router.put("/update-city-status", authorize([Role.ADMIN]), CityController.updateCityStatus);

module.exports = router;
