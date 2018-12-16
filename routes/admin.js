var bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.registerAdmin = registerAdmin;
exports.authenticateAdmin = authenticateAdmin;
exports.getAllNotifications = getAllNotifications;

// Register Admin
function registerAdmin(req, res) {
    var req = req.body;
    var password = req.password;

    // Password encryption
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            res.send(err);
        }
        var encryptedPassword = hash;
        var insertData = {
            name: req.name,
            image: req.image,
            joining_date: req.joiningDate,
            loginDetails: [
                {
                    email: req.email,
                    password: encryptedPassword
                }
            ]
        }
        db.collection('Admin').insertOne(insertData, function (error, result) {
            if (error) {
                res.send(error);
            } else {
                res.send(result.ops);
            }
        })
    });
}

// Authenticate Admin(Login Admin)
function authenticateAdmin(req, res,callback) {
    var req = req.body;
    var password = req.password;
    var findData = {
        loginDetails: {
            $elemMatch: {
                email: req.email
                // userID: req.userID
            }
        }
    }

    db.collection('Admin').findOne(findData, function (error, result) {
        if (error) {
            //res.send(error);
            throw new Error(error);
        } else {
            if (result != null) {

                var encryptedPassword = result.loginDetails[0].password;

                bcrypt.compare(password, encryptedPassword, function (error, rs) {
                    if (rs == true) {
                        callback(result);
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);

            }
        }

    })
}

function getAllNotifications(req, res,callback){
    
    db.collection('Products').find({}).toArray(function(err, result) {
        if (err) {
           return null;
        } else {
            callback(result);
        }
    })

}

