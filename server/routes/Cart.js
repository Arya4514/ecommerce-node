const express = require("express");
const router = express.Router();
const CartController = require("../apis/CartApi");
const authorize = require("../helpers/authorize");
const Role = require("../helpers/role");

router.post("/cart", authorize([Role.SUPER_ADMIN, Role.USER]), CartController.createCart);

router.get("/cart/get-user-cart", authorize([Role.USER]), CartController.getCartByUserId);

router.put("/cart/edit-cart", authorize([Role.SUPER_ADMIN, Role.USER]), CartController.editCart);


module.exports = router;
