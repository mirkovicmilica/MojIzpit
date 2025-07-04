const mongoose = require("mongoose");
const {json} = require("express");
const { Schema } = mongoose;

const serviceSchema = mongoose.Schema({
    id: {type: String},
    type: {type: String},
    recipientKeys: {type: [String]},
    serviceEndpoint: {type: String}
})

mongoose.model("Service", serviceSchema, "Services");

const invitationInfoSchema = mongoose.Schema({
    "@type": {type: String},
    "@id": {type: String},
    label: {type: String},
    handshake_protocols: {type: [String]},
    services: {type: [serviceSchema]}
})

mongoose.model("InvitationInfo", invitationInfoSchema, "InvitationInfos");


const invitationSchema = mongoose.Schema({
    username: {type: String, required: [true, "Student ID is required!"]},
    invitation: {type: invitationInfoSchema, required: true},
    description: {type: String},
    accepted: {type: Boolean, required: true}
})

mongoose.model("Invitation", invitationSchema, "Invitations");

const indySchema = mongoose.Schema({
    name: {type: String},
    version: {type: String},
    requested_attributes: {type: Schema.Types.Mixed}
})

mongoose.model("Indy", indySchema, "Indys");

const filterSchema = mongoose.Schema({
    indy: {type: indySchema}
})

mongoose.model("Filter", filterSchema, "Filters");

const credential_previewAttributesSchema = mongoose.Schema({
    name: {type: String},
    version: {type: String}
})

mongoose.model("CredentialPreviewAttributes", credential_previewAttributesSchema, "CredentialPreviewAttributes");

const credential_previewSchema = mongoose.Schema({
    indy: {type: indySchema}
})

mongoose.model("CredentialPreview", credential_previewSchema, "CredentialPreviews");

