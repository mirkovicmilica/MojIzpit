const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {json} = require("express");

const userSchema = mongoose.Schema({
    email: {type: String, unique: true, required: [true, "Email is required!"], $regex: /.+@fri.uni-lj.si$/},
    name: {type: String, required: [true, "Name is required!"], $regex: /^\D+$/},
    type: {type: String, enum: ["pedagoski_delavec", "referat", "administrator"], required: [true, "User type is required!"], default: "pedagoski_delavec"},
    hash: {type: String, required: [true, "Hash is required!"]},
    salt: {type: String, required: [true, "Salt is required!"]},
    subjectIds: {type: [String]}
});


userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
}

userSchema.methods.validPassword = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            admin_api_key: process.env.ADMIN_API_KEY,
            email: this.email,
            type: this.type,
            subjectIds: this.subjectIds,
            exp: parseInt(expiry.getTime() / 1000)
        },
        process.env.JWT_SECRET
    )
}

mongoose.model("User", userSchema, "Users");

const adminSchema = mongoose.Schema({
    email: {type: String, unique: true, required: [true, "Email is required!"], $regex: /.+@fri.uni-lj.si$/},
    name: {type: String, required: [true, "Name is required!"], $regex: /^\D+$/},
    type: {type: String, required: [true, "User type is required!"], default: "admin"},
    hash: {type: String, required: [true, "Hash is required!"]},
    salt: {type: String, required: [true, "Salt is required!"]}
});


adminSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
}

adminSchema.methods.validPassword = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

adminSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            admin_api_key: process.env.ADMIN_API_KEY,
            email: this.email,
            type: this.type,
            exp: parseInt(expiry.getTime() / 1000)
        },
        process.env.JWT_SECRET
    )
}

mongoose.model("Admin", adminSchema, "Admins");
