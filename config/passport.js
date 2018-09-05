const passport = require("passport");
const passportJWT = require('passport-jwt');
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
                User.findOne({ email: profile.emails[0].value })
                    .then(existingUser => {
                        if (existingUser) {
                            console.log("user found");
                            return done(null, existingUser);
                        }

                        new User({
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            'github.githubID': profile.id
                        })
                            .generateAuthToken()
                            .then(newUser => {
                                console.log("created new user", newUser);
                                done(null, newUser);
                            })
                    })
                    .catch(err => console.log(err));
            });
        }
    )
);


const ExtractJwt = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const JwtStrategy = new JWTStrategy(options, (payload, next) => {
    console.log('payload received', payload);
    const id = payload.id;
    User.findOne({ _id: id }).then(user => {
        console.log('user', user);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
});

module.exports = {
  JwtStrategy
};