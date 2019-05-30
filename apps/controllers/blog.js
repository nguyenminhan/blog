var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    res.json({"Message": "This is a page blog"})
});

module.exports = router;