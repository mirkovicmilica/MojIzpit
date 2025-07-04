const mongoose = require("mongoose");
require("../models/invitations");
const Invitation = mongoose.model("Invitation");
require("../models/users");
const WalletUser = mongoose.model("WalletUser");
const jwt = require("jsonwebtoken");



const VALID_API_KEY = process.env.ADMIN_API_KEY;

const invitationCreate = async (req, res) => {
    try {
        const apiKey = req.header('x-api-key');
  	if (apiKey !== VALID_API_KEY) {
    		res.status(401).json({ message: 'Unauthorized' });
  	} else if(!req.body.studentId || !req.body.invitation) {
            res.status(400).json({
                message: "Missing required body parameters.",
            });
        } else {
            let walletUser = await WalletUser.findOne({studentId: req.body.studentId})
                .exec();
            if (!walletUser)
                res.status(404).json({
                    message: `Student information for student ID not found.`,
                });
            else {
                Invitation.create({
                    username: walletUser.username,
                    invitation: req.body.invitation,
                    description: req.body.description,
                    accepted: req.body.accepted
                });
                res.status(201).json({
                    message: "Invitation created."
                });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const invitationsByStudent = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
        else if (!req.params.username)
            res.status(400).json({
                message: "Parameter 'username' is required."
            })
        else {
            const token = authHeader.split(' ')[1];
            const username = jwt.verify(token, process.env.JWT_SECRET);

            if(username.username == req.params.username) {

            	let invitations = await Invitation.find({username: req.params.username})
                	.exec();
            	if (!invitations)
                	res.status(200).json({
                	    message: `No invitations found.`,
                	});
            	else
                	res.status(200).json(invitations);
            } else {res.status(401).json({message: 'Unauthorized.'});}
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const invitationsDeleteOne = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	else {
        	try {
			const token = authHeader.split(' ')[1];
            		const username = jwt.verify(token, process.env.JWT_SECRET);

            		let invitation = await Invitation.findOne({_id: req.params.id});
			if(username.username == invitation.username) {
				await Invitation.deleteOne({_id: req.params.id});
            			res.status(200).json({
                			message: `Data deleted successfully.`,
            			});
			} else res.status(401).json({message: 'Unauthorized.'});
        	} catch (error) {
            		res.status(500).json({
                		message: `Server error.`,
            		});
        	}
	}
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    invitationCreate,
    invitationsByStudent,
    invitationsDeleteOne
}
