const express = require("express");
const router = express.Router();
const User = require("./Users");
const Country = require("./Country");
const State = require("./State");
const City = require("./City");
const Authentication = require("./Authentication");
const Dashboard = require("./Dashboard");
const ActivityLog = require('./ActivityLog');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');



router.get("/", function (req, res, next) {
    res.send('Express Server is Running...')
});

router.use(
    "/",
    Authentication,
    User,
    Country,
    State,
    City,
    Dashboard,
    ActivityLog,
    Product,
    Category,
    Cart
);

module.exports = router;
