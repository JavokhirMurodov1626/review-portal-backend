const express = require("express");
const { passport } = require("../passport");

const {
  register,
  login,
  createToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),

  (req, res) => {
    res.redirect(
      `${process.env.API_URL}/auth/success?user=${JSON.stringify(req.user)}`
    );
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    console.log(req.user)
    res.redirect(
      `${process.env.API_URL}/auth/success?user=${JSON.stringify(req.user)}`
    );
  }
);

module.exports = router;
