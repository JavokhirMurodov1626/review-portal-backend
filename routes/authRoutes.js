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
    const token = createToken(req.user);
    req.user.token = token;
    res.redirect(
      `${process.env.API_URL}/auth/success?user=${JSON.stringify(req.user)}`
    );
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] },)
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false,}),
  (req, res) => {
    const token = createToken(req.user);
    req.user.token = token;
    res.redirect(
      `${process.env.API_URL}/auth/success?user=${JSON.stringify(req.user)}`
    );
  }
);

module.exports = router;
