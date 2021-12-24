const express = require("express");
const router = express.Router();
const ProductController = require("../apis/ProductApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/add-product", authorize([Role.ADMIN]), ProductController.createProduct);

router.get("/get-products", ProductController.getProduct);
router.get("/get-product-by-id/:id", ProductController.getProductById);

router.put("/edit-product", authorize([Role.ADMIN]), ProductController.editProduct);

router.put("/updateproduct-status", authorize([Role.ADMIN]), ProductController.updateProductStatus);

module.exports = router;
