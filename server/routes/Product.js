const express = require("express");
const router = express.Router();
const ProductController = require("../apis/ProductApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/product/add-product", authorize([Role.SUPER_ADMIN]), ProductController.createProduct);

router.get("/product/get-products", ProductController.getProduct);
router.get("/product/get-products-paging", ProductController.getProductByPage);
router.get("/product/get-products-category", ProductController.getProductByCategory);

router.get("/product/get-product-by-id/:id", ProductController.getProductById);
router.get("/product/get-product-by-slug/:slug", ProductController.getProductBySlug);


router.put("/product/edit-product", authorize([Role.SUPER_ADMIN]), ProductController.editProduct);

router.put("/product/updateproduct-status", authorize([Role.SUPER_ADMIN]), ProductController.updateProductStatus);

module.exports = router;
