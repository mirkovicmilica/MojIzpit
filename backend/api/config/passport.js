const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Admin = mongoose.model("Admin");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (username, password, cbDone) => {
            try {
                let user = await User.findOne({email: username});
                if (!user) {
                    let admin = await Admin.findOne({email: username});
                    if (!admin) return cbDone(null, false, {message: "Incorrect username."});
                    else if (!admin.validPassword(password)) return cbDone(null, false, {message: "Incorrect password."});
                    else return cbDone(null, admin);
                } else if (!user.validPassword(password)) return cbDone(null, false, {message: "Incorrect password."});
                else return cbDone(null, user);
            } catch (err) {
                return cbDone(err);
            }
        }
    )
)