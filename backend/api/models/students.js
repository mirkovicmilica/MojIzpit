const mongoose = require("mongoose");
const {json} = require("express");

const studentSchema = mongoose.Schema({
    studentId: {type: String, required: [true, "Student ID is required!"]},
    surname: {type: String, required: [true, "Surname is required!"], $regex: /^\D+$/},
    name: {type: String, required: [true, "Name is required!"], $regex: /^\D+$/},
})

mongoose.model("Student", studentSchema, "Students");

const subjectSchema = mongoose.Schema({
    predmetId: {type: String, unique: true, required: [true, "Subject ID is required!"], $regex: /^\d{6}$/},
    predmetNaziv: {type: String, required: [true, "Title is required!"], $regex: /^\D+$/},
    predmetSolskoLeto: {type: String, required: [true, "School year is required!"], $regex: /^20\d{2}-20\d{2}$/},
    preverjanjaZnanja: {type: Boolean, required: true, default: false },
    steviloPreverjanjZnanja: {type: Number, required: () => this.preverjanjaZnanja, default: 2},
    vaje: {type: Boolean, required: true, default: false },
    seminarji: {type: Boolean, required: true, default: false },
    steviloSeminarjev: {type: Number, required: () => this.seminar, default: 2},
    sprotnoDelo: {type: Boolean, required: true, default: false },
    domaceNaloge: {type: Boolean, required: true, default: false },
    steviloDomacihNalog: {type: Number, required: () => this.domaceNaloge, default: 2},
    defined: {type: Boolean, required: true, default: false},
    students: { type: [studentSchema], required: false }
})

 mongoose.model("Subject", subjectSchema, "Subjects");


const studentAchievementsSchema = mongoose.Schema({
    studentId: {type: String, unique: false, required: [true, "Student ID is required!"]},
    predmetId: {type: String, unique: false, required: [true, "Subject ID is required!"], $regex: /^\d{6}$/},
    preverjanjaZnanja: {type: [String]},
    vaje: {type: [String]},
    seminarji: {type: [String]},
    sprotnoDelo: {type: [String]},
    domaceNaloge: {type: [String]},
    connection_id: {type: String, default: ""} // WILL BE DEFINED WHLIE APP IS BEEING USED
})

studentAchievementsSchema.index({ studentId: 1, predmetId: 1 }, { unique: true });

mongoose.model("StudentAchievements", studentAchievementsSchema, "StudentAchievements");


const schemaAttributeSchema = mongoose.Schema({
    attributeName: {type: String, required: true},
    attributeIndex: {type: Number, required: true, min: 0 },
    relation: {type: String},
    value: {type: String}
})

mongoose.model("SchemaAttribute", schemaAttributeSchema, "SchemaAttributes");

const credentialSchemaSchema = mongoose.Schema({
    credentialSchemaName: {type: String, unique: true, required: [true, "Credential schema name is required!"]},
    attributes: {type: [schemaAttributeSchema]}
})

mongoose.model("CredentialSchema", credentialSchemaSchema, "CredentialSchemas");

const examSchema = mongoose.Schema({
    examId: {type: String, unique: true, required: [true, "Exam ID is required!"]},
    subjectId: {type: String, required: [true, "Subject ID is required!"] },
    beginning: {type: Date},
    ending: {type: Date},
    credentialSchemaNames: {type: [String]},
    guardians: {type: [String]},
    schemaDefined: {type: Boolean, default: false},
    rulesDefined: {type: Boolean, required: [true, "Rules defined required!"], default: false}
})

mongoose.model("Exam", examSchema, "Exams");

const studentAdministrationSchema = mongoose.Schema({
    studentId: {type: String, unique: true, required: [true, "Student ID is required!"]},
    username: {type: String, unique: false, required: [true, "Username is required!"]},
    registered: {type: Boolean, required: [true], default: false},
    surname: {type: String, required: [true, "Surname is required!"], $regex: /^\D+$/},
    name: {type: String, required: [true, "Name is required!"], $regex: /^\D+$/}
})

mongoose.model("StudentAdministration", studentAdministrationSchema, "StudentAdministration");
