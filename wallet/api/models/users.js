const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {json} = require("express");

const gitUserSchema = mongoose.Schema({ // NO INIT DATA NEEDED
    username: {type: String},
    hash: {type: String, required: [true, "Hash is required!"]},
    salt: {type: String, required: [true, "Salt is required!"]},
    email: {type: String, unique: true, required: [true, "Email is required!"]}
});

const walletUserSchema = mongoose.Schema({
    username: {type: String},
    wallet_id: {type: String, required: false },
    studentId: {type: String, unique: true}
});

mongoose.model("WalletUser", walletUserSchema, "WalletUsers");

gitUserSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            exp: parseInt(expiry.getTime() / 1000)
        },
        process.env.JWT_SECRET
    )
}
gitUserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
}

gitUserSchema.methods.validPassword = function(password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

mongoose.model("GitUser", gitUserSchema, "GitUsers");

