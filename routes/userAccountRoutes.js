const express = require("express");
const { protect } = require("../controllers/authController");
const { getUserReviews } = require("../controllers/getUserReviews");
const { deleteUserReview } = require("../controllers/deleteUserReview");
const { editReview } = require("../controllers/editReviewController");

const router = express.Router();

router.post("/", getUserReviews);
router.post("/reviews/:id/delete", protect, deleteUserReview);
router.post("/reviews/:id/edit", protect, editReview);

module.exports = router; 
