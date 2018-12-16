const MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017';

MongoClient.connect(url, (err, database) => {
    if (err) {
        console.log("Error While connecting with database."+err);
        return err;
    } else {
        console.log("Connected with Database.");
        global.db = database.db('standrop');
    }
})