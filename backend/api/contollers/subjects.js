const mongoose = require("mongoose");
require("../models/students")
const Subject = mongoose.model("Subject");
const jwt = require("jsonwebtoken");

const subjectsAddAll = async (req, res) => {
    try {
        const subjects = req.body;
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
            	const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
            	if(authenticatedUser.type == "admin") {
            		await Subject.insertMany(subjects);
            		res.status(200).json({
            	    		message: `Data inserted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            try { await Subject.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }
            res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const subjectsDeleteAll = async (req, res) => {
    try {
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
            	const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
			await Subject.deleteMany();
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

const subjectReadOne = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
    else {
	    try {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
	        let subject = await Subject.findOne({predmetId : req.params.subjectId})
	            .exec();
	        if(!subject || !authenticatedUser.subjectIds.includes(subject.predmetId))
	            res.status(404).json({
	                message: `Subject with id '${req.params.subjectId}' not found.`,
	            });
	        else {
	            res.status(200).json(subject);
	        }
	    } catch(err) {
	        res.status(500).json({ message: err.message });
	    }
    }
}


const subjectUpdateOne = async (req, res) => {
    try {
        if(!req.params.subjectId) {
            res.status(400).json({
                message: "Parameter 'subjectId' is required.",
            });
	} else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
        else {
            let subject = await Subject.findById(req.params.subjectId).select("-id").exec();
	    const token = req.headers.authorization.split(' ')[1];

            const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);

            if(!subject || !authenticatedUser.subjectIds.includes(subject.predmetId)) {

                res.status(404).json({
                    message: "Subject with ID '" + req.params.studentId + "' not found.",
                });
            } else {
                if(req.body.preverjanjaZnanja) {

                    subject.preverjanjaZnanja = true;
                } else {

                    subject.preverjanjaZnanja = false;
                }
                if(req.body.steviloPreverjanjZnanja && req.body.preverjanjaZnanja) {
                    if(subject.preverjanjaZnanja) {
                        subject.steviloPreverjanjZnanja = req.body.steviloPreverjanjZnanja;
                    } else {
			conosle.log("here2");
                        res.status(400).json({
                            message: "Ponastavi preverjanje znanja.",
                        });
                    }
                }
                if(req.body.vaje) subject.vaje = true;
                else subject.vaje = false;
                if(req.body.seminarji) {
                    subject.seminarji = req.body.seminarji;
                } else {
                    subject.seminarji = false;
                }
                if(req.body.steviloSeminarjev && req.body.seminarji) {
                    if(subject.seminarji) {
                        subject.steviloSeminarjev = req.body.steviloSeminarjev;
                    } else {

                        res.status(400).json({
                            message: "Ponastavi seminar.",
                        });
                    }
                }
                if(req.body.sprotnoDelo) {
                    subject.sprotnoDelo = true;
                } else {
                    subject.sprotnoDelo = false;
                }
                if(req.body.domaceNaloge) {
                    subject.domaceNaloge = req.body.domaceNaloge;
                }
                if(req.body.steviloDomacihNalog && req.body.domaceNaloge) {
                    if(subject.domaceNaloge) {
                        subject.steviloDomacihNalog = req.body.steviloDomacihNalog;
                    } else {

                        res.status(400).json({
                            message: "Ponastavi domace naloge.",
                        });
                    }
                }
                subject.defined = true;
                await subject.save();

                res.status(200).json({
                    message: "Subject changed.",
                });
            }
        }
    } catch (err) {

        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    subjectReadOne,
    subjectUpdateOne,
    subjectsAddAll,
    subjectsDeleteAll,
}
