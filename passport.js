const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy: FacebookStrategy } = require("passport-facebook");
const { prisma } = require("./prismaClient");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

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
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { providerId: profile.id, provider: "FACEBOOK" },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              providerId: profile.id,
              provider: "FACEBOOK",
              email: profile.emails[0].value,
              name: `${profile.name.givenName} ${profile.name.familyName}`,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
