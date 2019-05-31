var q = require('q');
var db = require('../common/database');
var conn  = db.getConnection();

function getAllPosts(){
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts', function (error, results, fields) {
        if (error) {
            defer.reject(error)
        }else{
            defer.resolve(results)
        }
        
        });
    return defer.promise;
}
function addPost(post){
    if(post){
        var defer = q.defer();
        var query = conn.query('INSERT INTO posts SET ?', post, function (error, results, fields) {
            if (error) {
                defer.reject(error)
            }else{
                defer.resolve(results)
            }
            
          });
        return defer.promise;
    }
    return false;
}

function getPostById(id){
    var defer = q.defer();
    var query = conn.query('SELECT * FROM posts WHERE ?',{id: id}, function (error, results, fields) {
        if (error) {
            defer.reject(error)
        }else{
            defer.resolve(results)
        }
        
        });
    return defer.promise;
}

function updatePost(params){
    if(params){
        var defer = q.defer();
        var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?', [params.title,params.content,params.author,params.id], function (error, results, fields) {
            if (error) {
                defer.reject(error)
            }else{
                defer.resolve(results)
            }
            
          });
        return defer.promise;
    }
    return false;
}

function deletePost(id){
    if(id){
        var defer = q.defer();
        var query = conn.query('DELETE FROM  posts WHERE id = ?', [id], function (error, results, fields) {
            if (error) {
                defer.reject(error)
            }else{
                defer.resolve(results)
            }
            
          });
        return defer.promise;
    }
    return false;
}

module.exports = {
    getAllPosts : getAllPosts,
    addPost : addPost,
    getPostById: getPostById,
    updatePost:updatePost,
    deletePost : deletePost
}