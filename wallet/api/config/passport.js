const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const GitUser = mongoose.model("GitUser");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (username, password, cbDone) => {
            try {
                let user = await GitUser.findOne({email: username});
                if (!user) return cbDone(null, false, {message: "Incorrect username."});
                else if (!user.validPassword(password)) return cbDone(null, false, {message: "Incorrect password."});
                else return cbDone(null, user);
            } catch (err) {
                return cbDone(err);
            }
        }
    )
)