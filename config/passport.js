const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                
                // 👇 from here to the end, will modify with new User model
                User.findOne({ email: profile.emails[0].value })
                    .then(existingUser => {
                        if (existingUser) {
                            console.log("user found");
                            return done(null, existingUser);
                        }

                        new User({
                            githubId: profile.id,
                            email: profile.emails[0].value,
                            username: profile.displayName,
                            token: accessToken,
                            password: "123asd"
                        })
                            .save()
                            .then(newUser => {
                                console.log("created new user", newUser);
                                done(null, newUser);
                            });
                    })
                    .catch(err => console.log(err));
            });
        }
    )
);
