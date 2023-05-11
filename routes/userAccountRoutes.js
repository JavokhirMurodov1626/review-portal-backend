const express = require("express");
const { protect } = require("../controllers/authController");
const { getUserReviews } = require("../controllers/getUserReviews");
const { deleteUserReview } = require("../controllers/deleteUserReview");


const router = express.Router();

router.post("/", getUserReviews);
router.post("/reviews/:id/delete", deleteUserReview);


module.exports = router;
