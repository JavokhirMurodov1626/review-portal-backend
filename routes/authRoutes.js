const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  googleCallback,
  facebookCallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failed" }),
  googleCallback
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failed" }),
  facebookCallback
);

module.exports = router;
