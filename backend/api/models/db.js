const mongoose = require("mongoose");

const dbURI = "mongodb://ssi-mongo-db/Ssi-develop";
mongoose.connect(dbURI);

const Subject = mongoose.model("Subject");
const Student = mongoose.model("Student");


mongoose.connection.on("connected", async () => {
    console.log(`Mongoose connected to ${dbURI}.`);

});
mongoose.connection.on("error", (err) =>
    console.log(`Mongoose connection error: ${err}.`)
);
mongoose.connection.on("disconnected", () =>
    console.log("Mongoose disconnected")
);

const gracefulShutdown = async (msg, callback) => {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${msg}.`);
    callback();
};
process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () =>
        process.kill(process.pid, "SIGUSR2")
    );
});
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => process.exit(0));
});
process.on("SIGTERM", () => {
    gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
});

require("./users");
require("./students");
