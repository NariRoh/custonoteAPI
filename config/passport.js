const passport = require('passport');
const passportJWT = require('passport-jwt');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');

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

passport.use(
    new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/auth/github/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                findOrCreatUser(profile, done, 'github');
            });
        }
    )
);

passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                findOrCreatUser(profile, done, 'google');
            });
        }
    )
);

const findOrCreatUser = (profile, done, provider) => {
    User.findOne({ email: profile.emails[0].value })
        .then(user => {
            if (user) {
                console.log('user found');
                done(null, user);
            } else {
                new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    [`${provider}.${provider}ID`]: profile.id,
                    [`${provider}.thumbnail`]: profile.photos[0].value
                })
                    .generateAuthToken()
                    .then(newUser => {
                        console.log('created new user', newUser);
                        done(null, newUser);
                    });
            }
        })
        .catch(err => done(err));
};