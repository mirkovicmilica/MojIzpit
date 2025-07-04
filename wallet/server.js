const express = require("express");
require("dotenv").config();
const path = require("path");
const apiRouter = require("./api/routers/api");
const bodyParser = require("body-parser");
const passport = require("passport");

const mongoose = require("mongoose");
require("./api/models/users");


require("./api/models/db")
require("./api/config/passport");

const port = process.env.PORT || 4000;
const app = express();

const cors = require("cors");
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.options('*', cors());


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));



app.use('', express.static(path.join(__dirname, "angular", "build")));

app.use("/api", apiRouter);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

app.use((err, req, res, next) => {
    if(err.name === "UnauthorizedError")
        res.status(401).json({ message: err.message });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
})
