const express = require("express");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRouter");
const userAccountRoutes = require("./routes/userAccountRoutes");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./passport");

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(passport.initialize());

app.use("/", authRoutes);
app.use("/review", reviewRoutes);
app.use("/users/:id/account",userAccountRoutes)

app.get("/", (req, res) => {
  res.send("This is a homepage!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
