const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"],
});


module.exports = router;
const ctrlAuthentication = require("../contollers/authentication");
const ctrlWalletUser = require("../contollers/walletUser");

router.post("/registerStudent", ctrlAuthentication.registerStudent);
router.post("/login", ctrlAuthentication.loginStudent);
router.post("/wallet", ctrlWalletUser.walletUserCreate);
router.put("/wallet", auth, ctrlWalletUser.walletUserReadOne);


const ctrlAgent = require("../contollers/agent");
const ctrlInvitations = require("../contollers/invitation");

router.post("/multitenancy/wallet/:wallet_id/token", auth, ctrlAgent.logInWallet);


router.post("/invitations", ctrlInvitations.invitationCreate);
router.get("/invitations/:username", auth, ctrlInvitations.invitationsByStudent);
router.delete("/invitations/:id", auth, ctrlInvitations.invitationsDeleteOne);


router.post("/studentsAdministrationAddAll", ctrlWalletUser.studentsAdministrationAddAll);
router.delete("/studentsAdministrationDeleteAll", ctrlWalletUser.studentsAdministrationDeleteAll);
