var nodemailer = require('nodemailer');

function sentMailToCustomers(req, res, cb){
    var req = req.body;

    if(req.email && req.password){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: '*************@gmail.com',
          clientId: '*******************************************',
          clientSecret: '********************',
          refreshToken: '**************************************************',
          accessToken: '****',
          expires: 3600
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      var mailOptions = {
        from: 'admin@standrop.com',
        to: req.email,
        subject: 'Registration',
        text: 'Hello,Welcome to our website.Signup and get help today.'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            cb(error);
        } else {
            cb(null, 'Email sent: ' + info.response)
        }
      });
    } else {
      cb("Please provide valid details.")
    }

}

exports.sentMailToCustomers  = sentMailToCustomers;
