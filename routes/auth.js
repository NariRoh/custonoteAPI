const _ = require("lodash");
const passport = require('passport');

const User = require("../models/user");

module.exports = express => {
    const router = express.Router();

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

    router.get( "/github",
        // passport.authenticate("github", { scope: ["profile"] }
        (req, res) => {
            res.send('login with github')
        }
    );

    router.get(
        "/github/redirect",
        passport.authenticate("github", { failureRedirect: "/login" }),
        (req, res) => {
            // When success, redirect to home
            res.redirect("/");
        }
    );

    return router;
};
