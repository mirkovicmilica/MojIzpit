const mongoose = require("mongoose");
require("../models/students")
const StudentAchievements = mongoose.model("StudentAchievements");
const jwt = require("jsonwebtoken");

const achievementsBySubject = async (req, res) => {
    try {
    if (!req.params.predmetId)
        res.status(400).json({
            message: "Parameter 'predmetId' is required."
        })
    else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
    else {
        let achievements = await StudentAchievements.find({predmetId: req.params.predmetId})
            .exec();
	const token = req.headers.authorization.split(' ')[1];
        const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!achievements || !authenticatedUser.subjectIds.includes(req.params.predmetId))
            res.status(404).json({
                message: `Student achievements for subject ID '${req.params.predmetId}' not found.`,
            });
        else
            res.status(200).json(achievements);
    }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const achievementsUpdateSpecific = async (req, res) => {
    if (!req.params.id)
        res.status(400).json({
            message: "Parameter 'id' is required."
        })
    if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
    else {
        let requestOk = true;
        let achievements = await StudentAchievements.findById(req.params.id).select("-id")
            .exec();
	const token = req.headers.authorization.split(' ')[1];
        const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
        if(!achievements || !authenticatedUser.subjectIds.includes(achievements.predmetId))
            res.status(404).json({
                message: `Specified student achivements not found.`,
            });
        else {
            try {
                if (req.body.preverjanjaZnanja) {
                    req.body.preverjanjaZnanja.forEach((pz) => {
                        if (!pz.index || !pz.value)
                            requestOk = false;
                        else {
                            achievements.preverjanjaZnanja[pz.index]= pz.value;
                        }
                    })

                }
                if (req.body.vaje) {
                    req.body.vaje.forEach((v) => {
                        if (!v.index || !v.value)
                            requestOk = false;
                        else {
                            achievements.vaje[v.index] = v.value;
                        }
                    })

                }
                if (req.body.seminarji) {
                    req.body.seminarji.forEach((s) => {
                        if (!s.index || !s.value)
                            requestOk = false;
                        else {
                            achievements.seminarji[s.index] = s.value;
                        }
                    })

                }
                if (req.body.sprotnoDelo) {
                    req.body.sprotnoDelo.forEach((sd) => {
                        if (!sd.index || !sd.value)
                            requestOk = false;
                        else {
                            achievements.sprotnoDelo[sd.index] = sd.value;
                        }
                    })

                }
                if (req.body.domaceNaloge) {
                    req.body.domaceNaloge.forEach((dn) => {
                        if (!dn.index || !dn.value)
                            requestOk = false;
                        else {
                            achievements.domaceNaloge[dn.index] = dn.value;
                        }
                    })
                }
                if(requestOk) {
                    await achievements.save();
                    res.status(200).json({
                        message: "Achievements changed.",
                    });
                } else {
                    res.status(400).json({
                        message: "Parameters index and value are required."
                    })
                }

            } catch(err) {
                res.status(500).json({ message: err.message });
            }
        }
    }
}

const studentAchievementsAddAll = async (req, res) => {
    try {
        const achievements = req.body;
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await StudentAchievements.insertMany(achievements);
            		res.status(200).json({
            	   		message: `Data inserted successfully.`,
            		});
		} else {res.status(401).json({message: 'Unauthorized.'});}
	    }
        } catch (error) {
            try { await StudentAchievements.deleteMany(); }
            catch (error2) { res.status(500).json({ message: `Database error.` }) }
            res.status(500).json({
                message: `Server error.`,
            });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const studentAchievementsDeleteAll = async (req, res) => {
    try {
	const authHeader = req.headers.authorization;
        try {
	    if (!authHeader) res.status(401).json({message: 'Unauthorized.'});
	    else {
		const token = authHeader.split(' ')[1];
                const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
                if(authenticatedUser.type == "admin") {
            		await StudentAchievements.deleteMany();
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

const achievementsUpdateConnection = async (req, res) => {
    if (!req.params.id)
        res.status(400).json({
            message: "Parameter 'id' is required."
        })
    else if (!req.headers.authorization) res.status(401).json({message: 'Unauthorized.'});
    else {
        let achievements = await StudentAchievements.findById(req.params.id).select("-id")
            .exec();
	const token = req.headers.authorization.split(' ')[1];
        const authenticatedUser = jwt.verify(token, process.env.JWT_SECRET);
        if(!achievements || !authenticatedUser.subjectIds.includes(achievements.predmetId))
            res.status(404).json({
                message: `Specified student achievements not found.`,
            });
        else {
            try {
                achievements.connection_id = req.body.connection_id;
                await achievements.save();
                res.status(200).json({
                    message: "Achievements changed.",
                });

            } catch(err) {
                res.status(500).json({ message: err.message });
            }
        }
    }
}

module.exports = {
    achievementsBySubject,
    achievementsUpdateSpecific,
    studentAchievementsAddAll,
    studentAchievementsDeleteAll,
    achievementsUpdateConnection,
}
