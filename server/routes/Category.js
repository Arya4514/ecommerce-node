const express = require("express");
const router = express.Router();
const CategoryController = require("../apis/CategoryApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/category", authorize([Role.SUPER_ADMIN]), CategoryController.createCategory);

router.get("/category/get-category", CategoryController.getCategory);
router.get("/category/get-category-by-id/:id", CategoryController.getCategoryById);

router.put("/category/edit-category", authorize([Role.SUPER_ADMIN]), CategoryController.editCategory);

router.put("/category/update-category-status", authorize([Role.SUPER_ADMIN]), CategoryController.updateCategoryStatus);

module.exports = router;
