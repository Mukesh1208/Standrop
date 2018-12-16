

exports.addProd_Cust = addProd_Cust;

function addProd_Cust(req, res) {
    var body = req.body;
    var flag = 0;
    for (var i = 0; i < body.product_id.length; i++) {
        var insertData = {
            E_id: body.employee_id.split("-")[0],
            P_id: body.product_id[i],
            C_id: body.C_id,
            P_name:body.employee_id.split("-")[1]
        }


        db.collection('Prod_Cust').insertOne(insertData, function (error, result) {
            if (error) {
                
            } else {
                
                flag = 1;
            }
        })
        
    }



}