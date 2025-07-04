const passport = require("passport");
const mongoose = require("mongoose");
require("../models/users");

const GitUser = mongoose.model("GitUser");

const registerStudent = async(req, res) => {
    try {

    if(!req.body.name || !req.body.email || !req.body.password || !req.body.wallet_id) {
        return res.status(400).json({message: "All fields are required."});
    }


    let user = await GitUser.findOne({ username: req.body.name });

    let newUser = new GitUser();
        newUser.username = req.body.name;
        newUser.email = req.body.email;
        newUser.setPassword(req.body.password);

        await newUser.save();
        res.status(200).json({ token: newUser.generateJwt() });
    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

const loginStudent = (req, res) => {
    if(!req.body.email || !req.body.password)
        return res.status(400).json({message: "All fields are required."});
    else
        passport.authenticate("local", (err, user, info) => {
            if (err) return res.status(500).json({ message: err.message });
            if (user) return res.status(200).json({ token: user.generateJwt() });
            else return res.status(401).json({ message: info.message });
        })(req, res);
}


module.exports = {
    registerStudent,
    loginStudent,
};
