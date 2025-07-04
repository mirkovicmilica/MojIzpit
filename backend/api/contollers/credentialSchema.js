const mongoose = require("mongoose");
require("../models/students")
const CredentialSchema = mongoose.model("CredentialSchema");
const SchemaAttribute = mongoose.model("SchemaAttribute");
const Exam = mongoose.model("Exam");


// hint: Use examID, not _id
const credentialSchemaReadOne = async (req, res) => {
    try {
        let credentialSchema = await CredentialSchema.findOne({credentialSchemaName: req.params.credentialSchemaName})
            .select("-id")
            .exec();
        if(!credentialSchema)
            res.status(404).json({
                message: `Credential schema with id '${req.params.credentialSchemaName}' not found.`,
            });
        else {
            res.status(200).json(credentialSchema);
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const credentialSchemaCreate = async (req, res) => {
    try {
        if(!req.body.credentialSchemaName || !req.body.attributes ||
            !req.params.examId) {
            res.status(400).json({
                message: "Missing required parameters.",
            });
        } else {
            let existingExam = await Exam.findOne({ examId: req.params.examId })
            if(!existingExam) {
                res.status(400).json({
                    message: "Exam not found.",
                });
            } else {
                CredentialSchema.create({
                    credentialSchemaName: req.body.credentialSchemaName,
                    attributes: req.body.attributes

                });
                existingExam.rulesDefined = true;
                await existingExam.save();
                res.status(201).json({
                    message: "Rules defined"
                });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    credentialSchemaReadOne,
    credentialSchemaCreate
}