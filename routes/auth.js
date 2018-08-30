const router = require('express').Router();
const _ = require("lodash");
const passport = require('passport');

const User = require("../models/user");

router.post("/login", (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);

    User.findByCredentials(body.email, body.password)
        .then(user => {
            res.header("x-auth", user.token).send();
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github/redirect",
    passport.authenticate("github", { 
        // 👇 uncomment when we have those routes
        // failureRedirect: "/login", 
        // successRedirect: "/",
        session: false 
    }),
    (req, res) => {
        res.send('Logged in with github')
        console.log("accessToken: ", req.user.token);
    }
);

module.exports = router;