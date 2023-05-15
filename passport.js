const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { prisma } = require("./prismaClient");
const jwt = require("jsonwebtoken");
const { createToken } = require("./controllers/authController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              name: profile.displayName,
              image: profile.photos[0].value,
              provider: profile.provider,
              providerId: profile.id,
            },
          });
        }

        const token = createToken(user);

        const currentUser = {
          userId: user.id,
          name: user.name,
          image: user.image,
          token: token,
          expiresIn: 3600,
        };

        return done(null, currentUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {

      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              providerId: profile.id,
              provider: "GITHUB",
              image: profile.photos[0].value,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          });
        }

        const token = createToken(user);

        const currentUser = {
          userId: user.id,
          name: user.name,
          image: user.image,
          token: token,
          expiresIn: 3600,
        };

        return done(null, currentUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = { passport };
