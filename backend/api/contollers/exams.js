const mongoose = require("mongoose");
require("../models/students")
const Exam = mongoose.model("Exam");
const jwt = require("jsonwebtoken");

// hint: Use examID, not _id
const examsReadOne = async (req, res) => {
    try {
        let exam = await Exam.findOne({"examId": req.params.examId})
            .select("-id")
            .exec();
        if(!exam)
            res.status(404).json({
                message: `Exam with id '${req.params.examId}' not found.`,
            });
	else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
	    if(exam.guardians.includes(authenticatedUser.email))
            	res.status(200).json(exam);
	    else {res.status(401).json({message: 'Unauthorized.'});}
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const examsAddAll = async (req, res) => {
    try {
        const exams = req.body;
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
	    	const token = authHeader.split(' ')[1];
            	const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
            	if(authenticatedUser.type == "admin") {
            		await Exam.insertMany(exams);
            		res.status(200).json({
                		message: `Data inserted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            try { await Exam.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }
            res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const examsDeleteAll = async (req, res) => {
    try {
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await Exam.deleteMany();
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


const examUpdateOne = async (req, res) => {
    if(!req.params.examId || !req.body.credentialSchemaNames)
        res.status(400).json({
            message: "All parameters are required.",
        });
    else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
    else {
        try {
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
            let exam = await Exam.findOne({examId: req.params.examId}).select("-id").exec();
            if(!exam)
                res.status(404).json({
                    message: "Exam with ID '" + req.params.examId + "' not found.",
                });
	    else if(!exam.guardians.includes(authenticatedUser.email))
		res.status(401).json({message: 'Unauthorized.'});
            else {
                exam.credentialSchemaNames.push(req.body.credentialSchemaNames);
                exam.schemaDefined = true;
                await exam.save();
                res.status(200).json({
                    message: "Exam changed.",
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

const examUpdateOneRestrictions = async (req, res) => {
    if(!req.params.examId || !req.body)
        res.status(400).json({
            message: "All parameters are required.",
        });
    else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
    else {
        try {
            let exam = await Exam.findOne({examId: req.params.examId}).select("-id").exec();
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
            if(!exam)
                res.status(404).json({
                    message: "Exam with ID '" + req.params.examId + "' not found.",
                });
	    else if(!exam.guardians.includes(authenticatedUser.email))
		res.status(401).json({message: 'Unauthorized.'});
            else {

                exam.schemaAttributes = req.body.schemaAttributes;
                exam.schemaAttributesValues = req.body.schemaAttributesValues;
                exam.credentialDefinitionsId = req.body.credentialDefinitionsId;
                exam.relations = req.body.relations;
                exam.rulesDefined = true;
                await exam.save();
                res.status(200).json({
                    message: "Exam changed.",
                });
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

const examReadCredentials = async (req, res) => {
    try {
        let exam = await Exam.findOne({"examId": req.params.examId})
            .select("-id")
            .exec();
        if(!exam)
            res.status(404).json({
                message: `Exam with id '${req.params.examId}' not found.`,
            });
	else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
	    const token = req.headers.authorization.split(' ')[1];
            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
	    if(exam.guardians.includes(authenticatedUser.email))
        	    res.status(200).json(exam.credentialSchemaNames);
	    else
		res.status(401).json({message: 'Unauthorized.'});
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const examReadBySubjectId = async (req, res) => {
    try {
	if(!req.params.subjectId || !req.headers.authorization) {
		res.status(401).json({message: 'Unauthorized.'});
	} else {
		const token = req.headers.authorization.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
		if(authenticatedUser.subjectIds.includes(req.params.subjectId)){
        		let exams = await Exam.find({subjectId: req.params.subjectId})
        		    .exec();
        		if(!exams)
        		    res.status(404).json({
        		        message: `Exams not found.`,
        		    });
        		else {
        		    res.status(200).json(exams);
        		}
		} else {res.status(401).json({message: 'Unauthorized.'});}
	}
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    examsReadOne,
    examsAddAll,
    examsDeleteAll,
    examUpdateOne,
    examReadCredentials,
    examReadBySubjectId,
    examUpdateOneRestrictions
}
