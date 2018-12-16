

exports.addProducts = addProducts;
exports.updateProduct = updateProduct;

function addProducts(req, res,callback) {

    var body = req.body;

    var insertData = {
        service_name: body.service_name,
        user_id: body.user_id,
        task_time: body.task_time,
        location: body.location,
        task_detail: body.task_detail,
        user_name:body.user_name,
        user_number:body.user_number,
        status: false
    }

    db.collection('Products').insertOne(insertData, function (error, result) {
        if (error) {
            callback("")
           
        } else {
            callback("Request Submitted")
           
        }
    })
}

function updateProduct(req, res) {
    var body    =   req.body;
    var empName=body.employee_id.split("-")[1];
    var ObjectId = require('mongodb').ObjectID;
    var flag = 0;
    for(var i=0;i<body.product_id.length;i++){
      
    db.collection('Products').update({ "_id": new ObjectId(body.product_id[i]) }, { $set: { "status": true ,"employee":empName} }, function (error, result) {
        if (error) {
            return 0;
        } else {
            flag= 1;
        }
    })
}

return flag;

}