const mongoose = require("mongoose");
require("../models/students")
const StudentAdministration = mongoose.model("StudentAdministration");
const jwt = require("jsonwebtoken");

const studentsAdministration = async (req, res) => {

    try {
        let students = await StudentAdministration.find().exec();
        if(!students)
            res.status(500).json({
                message: `Server error.`,
            });
	else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
	    if(authenticatedUser.type == "pedagoski_delavec") {
            	res.status(200).json(students);
	    } else res.status(401).json({message: 'Unauthorized.'});
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const studentAdministrationReadOne = async (req, res) => {
    try {
        let student = await StudentAdministration.find({studentId: req.params.studentId})

            .exec();
        if(!student)
            res.status(404).json({
                message: `Student with id '${req.params.studentId}' not found.`,
            });
	else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
	    if(authenticatedUser.type == "pedagoski_delavec") {
            	res.status(200).json(student);
	    } else {res.status(401).json({message: 'Unauthorized.'});}
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


const studentsAdministrationPutByUsername = async (req, res) => {
    try {
        if (!req.body.username)
            res.status(400).json({
                message: "Parameter 'username' is required."
            })
	else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
            let administration = await StudentAdministration.findOne({username: req.body.username, studentId: req.body.studentId})
                .exec();
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
            if (!administration || !authenticatedUser.type == "pedagoski_delavec")
                res.status(404).json({
                    message: `Student information for student username '${req.body.username}' not found.`,
                });
            else if(administration.registered) {
                res.status(400).json({
                    message: `Student already registered.`,
                });
            } else {
                administration.registered = true;
                await administration.save();
                res.status(200).json({
                    message: "Student successfully registered.",
                });
            }
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}


const studentsAdministrationFindByUsername = async (req, res) => {
    try {
        if (!req.params.username)
            res.status(400).json({
                message: "Parameter 'username' is required."
            })

        else {
            let administration = await StudentAdministration.findOne({username: req.params.username, studentId: req.body.studentId})
                .exec();
            if (!administration)
                res.status(404).json({
                    message: `Student information for student username '${req.params.username}' not found.`,
                });
            else if(!administration.registered) {
                if(administration.studentId == req.body.studentId) {
                    administration.registered = true;
                    await administration.save();
                    res.status(200).json({
                        message: `Student is not registered.`,
                    });
                } else {
                    res.status(200).json({
                        message: `Student ID not ok.`,
                    });
                }
            } else {
                if(administration.image) {
                    res.status(200).json({
                        message: "Student registered.",
                    });
                } else {
                    res.status(200).json({
                        message: "Student registered, no image.",
                    });
                }
            }
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const pako = require('pako');

const axios = require('axios');


const studentsAdministrationAddAll = async (req, res) => {
    try {
        const administration = req.body;
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await StudentAdministration.insertMany(administration);
            		res.status(200).json({
                		message: `Data inserted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            try { await StudentAdministration.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }
            res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const studentsAdministrationDeleteAll = async (req, res) => {
    try {
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await StudentAdministration.deleteMany();
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
    studentsAdministration,
    studentAdministrationReadOne,
    studentsAdministrationPutByUsername,
    studentsAdministrationFindByUsername,
    studentsAdministrationAddAll,
    studentsAdministrationDeleteAll,
}
