// Import Internal files
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
var path = require("path")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var session = require('express-session');
app.use(session({ secret: 'ssshhhhh',saveUninitialized: false,
    resave: false }));

// Intializing Server
app.listen(3000);

// Declaring Global variable
global.app = app;



require('./config');
var admin = require('./routes/admin');
var user = require('./routes/user');
var employee = require('./routes/employee');
var comment = require('./routes/comment');
var product = require('./routes/products');
var product_customer = require('./routes/prod_cust');
var customerMail = require('./routes/customer_mail');



const exphbars = require('express-handlebars');

app.set("views", path.join(__dirname, "views"));  // "views" folder name
app.engine("handlebars", exphbars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.use('/assets', express.static('public'))
app.use(express.static('public'))

// API's directed to router.js file

// Register Admin
app.post('/admin_registration', admin.registerAdmin);

// Register Users
app.post('/user_registration', user.registerUser)

// Register Employee
app.post('/employee_registration', employee.registerEmployee);

// Authentication of Admin
app.post('/admin_login', admin.authenticateAdmin);

// Authentication of Users
app.post('/user_login', user.authenticateUser);

// Authentication of Employee
app.post('/employee_login', employee.authenticateEmployee);

// Add Comments
app.post('/add_comment', async function(req,res){
  try{
    console.log(req.body);
    var req = req.body;
    var insertData = {
        email: req.email,
        name: req.name,
        services: req.services,
        comments: req.comments
    }
  var commentobj = comment.addComment(insertData);
  res.redirect('/comment');
  }catch(e){
res.status(500).redirect('/');  }

});


app.get('/comment',requiresLogin,async function (req, res) {

  let co = await comment.getAllComments();
  console.log(co);
    res.render("comment", {com: co,user:true,user: req.session.user}
  );

});

// Add Product_Customer
app.post('/add_prod_Cust', product_customer.addProd_Cust);

// Mail Sending Api
app.post('/mail_to_customer', customerMail.sentMailToCustomers);


// Get Notifications for Admin from Products collection
app.get('/get_admin_notifications', admin.getAllNotifications);

// Get All Employee List
app.get('/get_all_employee', employee.getAllEmployees);

// Get notifications for employee
app.get('/get_employee_notifications', employee.getEmployeeNotifications);

// update status for notification
app.post('/update_status', product.updateProduct);


app.get('/', function (req, res) {

    res.render("home");

});


app.get('/login', function (req, res) {

    res.render("login");

});

app.get('/loggedinhome',requiresLogin, function (req, res) {

    res.render("loggedinhome", {
        user: req.session.user
    });

});

app.get('/logcontactus', requiresLogin,function (req, res) {

    res.render("logcontactus", {
        user: req.session.user
    });

});
app.get('/logaboutus', requiresLogin,function (req, res) {

    res.render("logaboutus", {
        user: req.session.user
    });

});


app.get('/logservices', requiresLogin, function (req, res) {

    res.render("logservices", {
        user: req.session.user
    });

});

app.get('/loggedinhomeadmin',requiresLogin, function (req, res) {

    res.render("loggedinhomeadmin");

});

app.get('/commentadmin',requiresLogin,async function (req, res) {

  let co = await comment.getAllComments();
  console.log(co);
    res.render("commentadmin", {com: co,user:true,user: req.session.user}
  );

});

app.get('/logcontactusadmin', requiresLogin,function (req, res) {

    res.render("logcontactusadmin");

});
app.get('/logaboutusadmin', requiresLogin,function (req, res) {

    res.render("logaboutusadmin");

});


app.get('/logservicesadmin', requiresLogin, function (req, res) {

    res.render("logservicesadmin");

});



app.get('/register', function (req, res) {

    res.render("register");

});

app.get('/aboutus', function(req,res) {
    res.render("aboutus");

});

app.get('/contactus', function(req,res) {
    res.render("contactus");
});

app.get('/services', function(req,res) {
    res.render("services");
});

app.get('/task_detail', requiresLogin, function (req, res) {

    if (req.query.id != undefined) {
        if (req.query.id == 1) {
            res.render("taskDetail", {
                taskTitle: "Line Stander",
                taskId: req.query.id,
                user: req.session.user
            });
        }
        else if (req.query.id == 2) {
            res.render("taskDetail", {
                taskTitle: "Pickup / Drop",
                taskId: req.query.id,
                user: req.session.user
            });
        }
        else if (req.query.id == 3) {
            res.render("taskDetail", {
                taskTitle: "Household Activity",
                taskId: req.query.id,
                user: req.session.user
            });
        }
        else if (req.query.id == 4) {
            res.render("taskDetail", {
                taskTitle: "To-Do List",
                taskId: req.query.id,
                user: req.session.user
            });
        }
        else {
            res.redirect("/user_dashboard");
        }


    }
    else {
        res.redirect("/user_dashboard");
    }

});


// Add Products
app.post('/add_product', requiresLogin, function (req, res) {
    product.addProducts(req, res, function (response) {

        if (response != "") {
            res.render("userDashboard", {
                successMSG: response,
                user: req.session.user
            });
        } else {
            res.render("userDashboard", {
                errorMSG: "Request Failed",
                user: req.session.user
            });
        }
    });

});

app.post('/login', function (req, res) {
    var body = req.body;
    var role = body.role;
    var username = body.email;
    var password = body.password;
    if (role == 0) {
        res.render("login", {
            errorMSG: "Please Select Role"
        });
    } else {
        var returnedUser;
        if (role == 1) {
            returnedUser = user.authenticateUser(req, res, function (response) {
                if (response == null) {
                    res.render("login", {
                        errorMSG: "Invald Crentials"
                    })
                }
                else {
                    req.session.user = response;
                    res.redirect("/user_dashboard")
                }

            });
        }
        else if (role == 2) {
            returnedUser = employee.authenticateEmployee(req, res, function (response) {
                if (response == null) {
                    res.render("login", {
                        errorMSG: "Invald Crentials"
                    })
                }
                else {
                    req.session.user = response;
                    res.redirect("/emp_dashboard")
                }

            });
        }
        else {
            returnedUser = admin.authenticateAdmin(req, res, function (response) {
                if (response == null) {
                    res.render("login", {
                        errorMSG: "Invald Crentials"
                    })
                }
                else {
                    req.session.user = response;
                    res.redirect("/admin_dashboard")
                }

            });
        }
    }
});

app.get('/user_dashboard', requiresLogin, function (req, res) {


    res.render("userdashboard", {
        user: req.session.user
    });
});

app.get('/admin_dashboard', requiresLogin, function (req, res) {
    var notificationArray = [];
    var empArray = [];
    admin.getAllNotifications(req, res, function (result) {
        result.forEach(function (element) {
            //if(element.status)
            notificationArray.push(element);

        }, this);

    });

    employee.getAllEmployees(req, res, function (result) {
        result.forEach(function (element) {
            empArray.push(element);
        }, this);

    });
    if (req.query.errorMSG != undefined && req.query.errorMSG != '') {
        res.render("adminDashboard", {
            notifications: notificationArray,
            employees: empArray,
            errorMSG: req.query.errorMSG,
            user: req.session.user
        });
    }
    else if (req.query.successMSG != undefined && req.query.successMSG != '') {
        res.render("adminDashboard", {
            notifications: notificationArray,
            employees: empArray,
            successMSG: req.query.successMSG,
            user: req.session.user
        });
    }

    else {
        res.render("adminDashboard", {
            notifications: notificationArray,
            employees: empArray,
            user: req.session.user
        });
    }


});

app.post('/assign_task', requiresLogin, function (req, res) {

    if (req.body.product_id == undefined) {
        res.redirect("admin_dashboard?errorMSG=Please Select any Task");
    }
    else if (req.body.employee_id == '') {
        res.redirect("admin_dashboard?errorMSG=Please Select Employee");
    } else {
        product_customer.addProd_Cust(req, res);
        product.updateProduct(req, res);
        res.redirect("admin_dashboard?successMSG=Task Assigned Successfully");
    }



});


app.get('/emp_dashboard', requiresLogin, function (req, res) {

    var notificationArray = [];
    employee.getEmployeeNotifications(req, res, function (result) {
        result.forEach(function (element) {
            employee.getNotificationsByProductId(element.P_id, function (responseBody) {
                responseBody.forEach(function (not) {
                    notificationArray.push(not);
                }, this);
            });
        }, this);
        res.render("empDashboard", {
            notifications: notificationArray,
            user: req.session.user
        });
    });

});


app.get('/my_request', requiresLogin, function (req, res) {
    var notificationArray = [];

    user.getAllNotifications(req, res, function (result) {
        result.forEach(function (element) {
            notificationArray.push(element);

        }, this);

    });

    res.render("userRequest", {
        notifications: notificationArray,
        user: req.session.user
    });



});


function requiresLogin(req, res, next) {
    console.log("User Logged : " + JSON.stringify(req.session.user));
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect("/login");


}

app.get("/logout", function (req, res) {
console.log("Before logout " + JSON.stringify(req.session.user));

req.session.destroy();
res.redirect("/");
//console.log("After logout : " + JSON.stringify(req.session.user));
});
