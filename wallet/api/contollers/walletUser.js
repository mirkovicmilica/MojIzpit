const mongoose = require("mongoose");
require("../models/users");
const WalletUser = mongoose.model("WalletUser");
const axios = require('axios');

const walletUserCreate = async (req, res) => {

    try {
        if(!req.body.username ||

            !req.body.studentId) {
            res.status(400).json({
                message: "Missing required body parameters.",
            });
        } else {
            let walletUser = await WalletUser.findOne({username: req.body.username, studentId: req.body.studentId}).exec();
            if (!walletUser)
                res.status(404).json({
                    message: `Student not found.`,
                });
            else {

                walletUser.wallet_id = req.body.wallet_id;
		        await walletUser.save();

            	res.status(201).json({
                	message: "Wallet user created"
            	});
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const walletUserReadOne = async (req, res) => {
    try {
        if(!req.body.username || !req.body.wallet_id) {
            res.status(400).json({
                message: "Missing required body parameters.",
            });
        } else {
            let walletUser = await WalletUser.findOne({username: req.body.username, wallet_id: req.body.wallet_id})
                .exec();
            if (!walletUser)
                res.status(404).json({
                    message: `Student not found.`,
                });
            else {
                if(walletUser.wallet_id == req.body.wallet_id) {
                    res.status(200).json({message: "Student found."});
                } else {
                    res.status(400).json({
                        message: "Error.",
                    });
                }
            }
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


const VALID_API_KEY = process.env.ADMIN_API_KEY;


const studentsAdministrationAddAll = async (req, res) => {
    try {
	const apiKey = req.header('x-api-key');


        if (apiKey !== VALID_API_KEY) {
                res.status(401).json({ message: 'Unauthorized' });
        } else {
        const administration = req.body;

        try {

            await WalletUser.insertMany(administration);

            res.status(200).json({
                message: `Data inserted successfully.`,
            });
        } catch (error) {
            try { await WalletUser.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }
            res.status(500).json({
                message: `Server error.`,
            });
        }}
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const studentsAdministrationDeleteAll = async (req, res) => {
    try {
	const apiKey = req.header('x-api-key');
        if (apiKey !== VALID_API_KEY) {
                res.status(401).json({ message: 'Unauthorized' });
        } else {
        try {
            await WalletUser.deleteMany();
            res.status(200).json({
                message: `Data deleted successfully.`,
            });
        } catch (error) {
            res.status(500).json({
                message: `Server error.`,
            });
        }}
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    walletUserCreate,
    walletUserReadOne,
    studentsAdministrationAddAll,
    studentsAdministrationDeleteAll
};
