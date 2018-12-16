
var bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.registerEmployee = registerEmployee;
exports.authenticateEmployee = authenticateEmployee;
exports.getAllEmployees = getAllEmployees;
exports.getEmployeeNotifications = getEmployeeNotifications;
exports.getNotificationsByProductId=getNotificationsByProductId;

// Register Employee
function registerEmployee(req, res) {
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
            address: req.address,
            position: req.position,
            dob: req.dob,
            mobile: req.mobile,
            image: req.image,
            joining_date: req.joining_date,
            passport_no: req.passport_no,
            loginDetails: [
                {
                    email: req.email,
                    password: encryptedPassword,
                    userID: req.userID
                }
            ]
        }
        db.collection('Employee').insertOne(insertData, function (error, result) {
            if (error) {
                res.send(error);
            } else {
                res.send(result.ops);
            }
        })
    });

}

// Authenticate Employee(Login Admin)
function authenticateEmployee(req, res,callback) {
    var req = req.body;
    var password = req.password;
    var findData = {
        loginDetails: {
            $elemMatch: {
                email: req.email
            }
        }
    }

    db.collection('Employee').findOne(findData, function (error, result) {
        if (error) {
            res.send(error);
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

function getAllEmployees(req, res,callback) {

    db.collection('Employee').find({}).toArray(function (err, result) {
        if (err) {
            return null;
        } else {
            callback(result);
        }
    })
}

function getEmployeeNotifications(req, res,callback) {
    var response = {};
    req.body.id=req.session.user._id;
    var findData = {
        E_id: req.body.id
    }

    var notifications=[];

    db.collection('Prod_Cust').find(findData).toArray(function (err, responseBody) {
        if (err) {
            res.send(err);
        } else {
            if (responseBody != null) {
                callback(responseBody);
             } else {
                res.send("No notifications")
            }

        }
    })
}

function getNotificationsByProductId(productId,callback) {
    var ObjectId = require('mongodb').ObjectID;
    db.collection('Products').find({ "_id": new ObjectId(productId) }).toArray(function (err, responseBody) {
        if (err) {
            res.send(err);
        } else {
            if (responseBody == null) {
                res.send("No Service Found");
            } else {
                callback(responseBody);

            }
        }
    })

}
