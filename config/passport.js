const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require('../models/user');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
    new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        console.log("logged in with github");
    })
);