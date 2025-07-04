const passport = require("passport");
const mongoose = require("mongoose");
require("../models/users");
const User = mongoose.model("User");

const register = async(req, res) => {
    if(!req.body.name || !req.body.email || !req.body.password || !req.body.subjectIds) {
        return res.status(400).json({message: "All fields are required."});
    }
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.type = req.body.type;
    user.subjectIds = req.body.subjectIds;
    user.setPassword(req.body.password);
    try {
        await user.save();

        res.status(200).json({ token: user.generateJwt() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = (req, res) => {
    if(!req.body.email || !req.body.password)
        return res.status(400).json({message: "All fields are required."});
    else
        passport.authenticate("local", (err, user, info) => {
            if (err) return res.status(500).json({ message: err.message });
            if (user) return res.status(200).json({ token: user.generateJwt() });
            else return res.status(401).json({ message: "Incorrect e-mail or password." });
        })(req, res);
}


module.exports = {
    register,
    login,
};