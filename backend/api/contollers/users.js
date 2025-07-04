const mongoose = require("mongoose");
require("../models/users")
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");

const usersAddAll = async (req, res) => {
    try {
        const users = req.body;
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) {res.status(401).json({message: 'Unauthorized.'});}
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await User.insertMany(users);
            		res.status(200).json({
            		    message: `Data inserted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            try { await User.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }

	    res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {

        res.status(500).json({ message: err.message });
    }
}

const usersDeleteAll = async (req, res) => {
    try {
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await User.deleteMany();
            		res.status(200).json({
            		    message: `Data deleted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    usersAddAll,
    usersDeleteAll,
}
