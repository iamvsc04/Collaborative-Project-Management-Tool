const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const crypto = require("crypto");

// Generate secure random password for OAuth users
const generateSecurePassword = () => {
  return crypto.randomBytes(32).toString("hex");
};

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
      callbackURL: "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth Profile:", profile); // For debugging

        if (!profile.emails || !profile.emails[0]) {
          return done(new Error("No email provided by Google"), null);
        }

        const email = profile.emails[0].value;

        // Check if user already exists
        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (user) {
          // Update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
          role: "solo_creator",
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        console.error("Google OAuth Error:", err);
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
      callbackURL: `${process.env.API_URL}/api/auth/github/callback`,
      scope: ["user:email"],
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
          role: "solo_creator",
          password: generateSecurePassword(),
          oauthProvider: "github",
          oauthId: profile.id,
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
