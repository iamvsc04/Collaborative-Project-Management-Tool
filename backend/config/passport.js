const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: "solo_creator", // Default role for OAuth users
          password: "oauth", // Placeholder password
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get email from GitHub profile
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName || profile.username,
          email,
          role: "solo_creator", // Default role for OAuth users
          password: "oauth", // Placeholder password
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
