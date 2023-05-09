const express = require("express");
const { createReview } = require("../controllers/createReview.js");
const { addComment } = require("../controllers/commentController");
const { protect } = require("../controllers/authController");
const { addRating } = require("../controllers/ratingController");
const { editReview } = require("../controllers/editReviewController");
const { deleteReview } = require("../controllers/deleteReviewController");
const {getLastReviews}=require('../controllers/getLastReviews.js')

const router = express.Router();

router.get("/",getLastReviews );
router.post("/create", protect, createReview);
router.post("/:id/comments", protect, addComment);
router.post("/:id/rating", protect, addRating);
router.post("/:id/edit", protect, editReview);
router.post("/:id/delete", protect, deleteReview);

module.exports = router;
