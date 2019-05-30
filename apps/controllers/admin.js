var express = require('express');

var router = express.Router();

var user_md = require('../models/user');
var helper = require('../helpers/helper')

router.get("/",function(req,res){
    res.json({"Message": "This is a page admin"})
});



//register
router.get("/signup",function(req,res){
    res.render('signup',{data :{}});
});

router.post("/signup",function(req,res){
    var user = req.body;
    if(user.email.trim().length == 0){
        res.redirect("admin/signin");
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
    console.log(params);
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
                    res.redirect("/admin/");
                }
            })
        }else{
            res.render('signin',{data :{error : "User not exits"}});
        }
    }
    // if(params.passwd.trim().length == 0){
    //     res.render('signin',{data :{error : "Email is required"}});
    // }
    
    // insert db
});

module.exports = router;