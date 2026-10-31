import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import AuthService from "../../module/auth/auth.service.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await AuthService.googleLogin(profile);
        return done(null, result);
      } catch (error) {
        return done(error?.message, null);
      }
    },
  ),
);
