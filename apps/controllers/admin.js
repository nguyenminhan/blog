var express = require('express');

var router = express.Router();

var user_md = require('../models/user');
var post_md = require('../models/post');
var helper = require('../helpers/helper')

router.get("/",function(req,res){
    if(req.session.user){
        var data = post_md.getAllPosts();
        data.then(function(posts){
            var data = {
                posts : posts,
                error : false
            }
            res.render("admin/dashboard",{data: data});
        }).catch(function(err){
            res.render("admin/dashboard",{data: {error : "Get post data is error"}});
        })
    }else{
        res.redirect("admin/signin");
    }
  
    
});



//register
router.get("/signup",function(req,res){
    res.render('signup',{data :{}});
});

router.post("/signup",function(req,res){
   
    var user = req.body;
    if(user.email.trim().length == 0){
        res.redirect("admin/signin",{data :{error : "email is required"}});
    }
    if(user.passwd.trim().length == 0){
        res.render('signup',{data :{error : "password is required"}});
    }
    var password = helper.hash_password(user.passwd);
    // insert db
    user = {
        email : user.email,
        password : password,
        first_name : user.firstname,
        last_name : user.lastname
    }

    var result = user_md.addUser(user);

    result.then(function(data){
        res.json({"message" : "Insert successfully"});
    }).catch(function(err){
        res.render('signup',{data :{error : err}});
    })
});

//login

router.get("/signin",function(req,res){
    res.render('signin',{data :{}});
});

router.post("/signin",function(req,res){
    var params = req.body;
    if(params.email.trim().length == 0){
        res.render('signin',{data :{error : "Email is required"}});
    }else{
        var data = user_md.getUserByEmail(params.email);
        if(data){
            data.then(function(users){
                var user = users[0];
                var status = helper.compare_password(params.passwd, user.password);
                if(!status){
                    res.render('signin',{data :{error : "Password Wrong"}});
                }else{
                    req.session.user = user
                    res.redirect("/admin/");
                }
            })
        }else{
            res.render('signin',{data :{error : "User not exits"}});
        }
    }

});

// post
router.get("/post/new",function(req,res){
    if(req.session.user){
        res.render('admin/post/new',{data :{}});
    }else{
        res.redirect("/admin");
    }
});
router.post("/post/new",function(req,res){
    var post = req.body;
    if(post.title.trim().length == 0){
        res.render("admin/post/new",{data :{error : "title is required"}});
    }else if(post.content.trim().length == 0){
        res.render('admin/post/new',{data :{error : "content is required"}});
    }else if(post.author.trim().length == 0){
        res.render('admin/post/new',{data :{error : "author is required"}});
    }else{
        var data = post_md.addPost(post);
        data.then(function(data){
            res.redirect("/admin");
        }).catch(function(err){
            res.render('admin/post/new',{data :{error : err}});
        })
    }

  
});


router.get("/post/edit/:id",function(req,res){
    if(req.session.user){
        var params = req.params;
        var id = params.id;
        var data = post_md.getPostById(id);

        if(data){
            data.then(function(posts){
                var post = posts[0];
                var data = {
                    post : post,
                    error : false
                }
                res.render("admin/post/edit",{data: data });
            }).catch(function(err){
                var data = {
                    error : "Could not get post data by id"
                }
                res.render("admin/post/edit",{data: data });
            })
        }else{
            var data = {
                error : "Could not get post data by id"
            }
            res.render("admin/post/edit",{data: data });
        }
    }else{
        res.redirect("/admin/signin")
    }
    
});

router.put("/post/edit",function(req,res){
    var params = req.body;
    data = post_md.updatePost(params);
    console.log(data);
    if(!data){
        res.json({status_code:500});
        
    }else{
        data.then(function(res){
            res.json({status_code:200});
        }).catch(function(err){
            console.log(err);
            res.json({status_code:500});
        })
        
    }
});

router.delete("/post/delete",function(req,res){
    var post_id = req.body.id;
    var data = post_md.deletePost(post_id);
    if(!data){
        res.json({status_code : 500});
    }else{
        data.then(function(result){
            res.json({status_code: 200});
        }).catch(function(err){
            res.json({status_code : 500});
        })
    }
});

router.get("/post",function(req,res){
    if(req.session.user){
        res.redirect('/admin');
    }else{
        res.redirect("/admin/signin")
    }
});

router.get("/user",function(req,res){
    if(req.session.user){
        var data = user_md.getAllUsers();
        data.then(function(users){
            var data = {
                users : users,
                error : false
            }
            res.render("admin/user",{data: data});
        }).catch(function(err){
            res.render("admin/user",{data: {error : "Get user data is error"}});
        })
    }else{
        res.redirect("/admin/signin")
    }
})


module.exports = router;