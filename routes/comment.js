exports.addComment = addComment;
exports.getAllComments= getAllComments;

function addComment(insertData){
var l_objComment =  db.collection('Comment').insertOne(insertData, function (error, result) {
      if (error) {
          throw error;
      } else {
          return l_objComment;
      }
  })
}
function getAllComments(){
  const mukesh = db.collection('Comment').find({}).toArray();
  return mukesh;
}
