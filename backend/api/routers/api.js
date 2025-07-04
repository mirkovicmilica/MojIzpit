const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"],
});

const QRCode = require('qrcode');

module.exports = router;
const ctrlAuthentication = require("../contollers/authentication");
const ctrlSubjects = require("../contollers/subjects");
const ctrlStudentAchievements = require("../contollers/studentAchievements");
const ctrlStudentsAdministration = require("../contollers/studentsAdministration2");
const ctrlExams = require("../contollers/exams");
const ctrlUsers = require("../contollers/users");
const ctrlCredentialSchemas = require("../contollers/credentialSchema");

router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);

router.get("/subjects/:subjectId", auth, ctrlSubjects.subjectReadOne);
router.post("/subjectsAddAll", auth, ctrlSubjects.subjectsAddAll);
router.delete("/subjectsDeleteAll", auth, ctrlSubjects.subjectsDeleteAll);
router.put("/subjects/:subjectId", auth, ctrlSubjects.subjectUpdateOne);

router.get("/studentAchievements/:predmetId", auth, ctrlStudentAchievements.achievementsBySubject);
router.put("/studentAchievements/:id", auth, ctrlStudentAchievements.achievementsUpdateSpecific);
router.put("/studentAchievements/connection/:id", auth, ctrlStudentAchievements.achievementsUpdateConnection);
router.post("/studentAchievementsAddAll", auth, ctrlStudentAchievements.studentAchievementsAddAll);
router.delete("/studentAchievementsDeleteAll", auth, ctrlStudentAchievements.studentAchievementsDeleteAll);

router.get("/studentsAdministration", auth, ctrlStudentsAdministration.studentsAdministration);
router.get("/studentsAdministration/:studentId", auth, ctrlStudentsAdministration.studentAdministrationReadOne);
router.put("/studentsAdministration/username", auth, ctrlStudentsAdministration.studentsAdministrationPutByUsername);
router.put("/studentsAdministration/username/:username", ctrlStudentsAdministration.studentsAdministrationFindByUsername);
router.post("/studentsAdministrationAddAll", auth, ctrlStudentsAdministration.studentsAdministrationAddAll);
router.delete("/studentsAdministrationDeleteAll", auth, ctrlStudentsAdministration.studentsAdministrationDeleteAll);


router.get("/exams/:examId", auth, ctrlExams.examsReadOne);
router.get("/exams/subjects/:subjectId", auth, ctrlExams.examReadBySubjectId);
router.post("/examsAddAll", auth, ctrlExams.examsAddAll);
router.delete("/examsDeleteAll", auth, ctrlExams.examsDeleteAll);
router.put("/exams/:examId", auth, ctrlExams.examUpdateOne);
router.put("/exams/restrictions/:examId", auth, ctrlExams.examUpdateOneRestrictions);
router.get("/exams/:examId/credentials", auth, ctrlExams.examReadCredentials);

router.get("/credentialSchemas/:credentialSchemaName", auth, ctrlCredentialSchemas.credentialSchemaReadOne);
router.post("/credentialSchemas/:examId", auth, ctrlCredentialSchemas.credentialSchemaCreate);

router.post("/usersAddAll", ctrlUsers.usersAddAll);
router.delete("/usersDeleteAll", auth, ctrlUsers.usersDeleteAll);


router.post('/generateQR', async (req, res) => {
    try {

        if(!req.body.url) {
            res.status(400).send('URL is required.')
        } else {
            const url = req.body.url;
            const qrCodeImage = await QRCode.toDataURL(url);
            res.send({"img": qrCodeImage});
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});
