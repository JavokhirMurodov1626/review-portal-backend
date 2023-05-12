const express = require("express");
const { createReview } = require("../controllers/createReview.js");
const { protect } = require("../controllers/authController");
const { addRating } = require("../controllers/ratingController");
const { getLastReviews } = require("../controllers/getLastReviews.js");
const { getReview } = require("../controllers/getReview.js");
const { sendComment } = require("../controllers/sendComment.js");
const { likeReview } = require("../controllers/likeReviewController.js");
const { unlikeReview } = require("../controllers/unlikeReview.js");

const router = express.Router();

router.get("/", getLastReviews);
router.post("/create", protect, createReview);
router.post("/:id", getReview);
router.post("/:id/like", protect, likeReview);
router.post("/:id/unlike", protect, unlikeReview);
router.post("/:id/comment", protect, sendComment);
router.post("/:id/rating", protect, addRating);

module.exports = router;
