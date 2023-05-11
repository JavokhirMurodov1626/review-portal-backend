const express = require("express");
const { protect } = require("../controllers/authController");
const { getUserReviews } = require("../controllers/getUserReviews");


const router = express.Router();

router.post("/", getUserReviews);


module.exports = router;
