const mongoose = require('mongoose');
const fs = require('fs');


require("./api/models/users")
const Admin = mongoose.model("Admin");

mongoose.connect('mongodb://ssi-mongo-db/Ssi-develop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');


    fs.readFile('./testData/json/admin.json', 'utf8', async (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            return;
        }


        const users = JSON.parse(data);

        let usersInsert = [];

        users.forEach(u => {
            let newUser = new Admin();

            newUser.name = u.name;
            newUser.email = u.email;

            newUser.hash = u.hash;
            newUser.salt = u.salt;

            usersInsert.push(newUser);
        })



        try {
            await Admin.insertMany(usersInsert);
            console.log('Data inserted successfully');
        } catch (error) {
            console.log('Error inserting data:', error);
        } finally {
            mongoose.connection.close();
        }
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});