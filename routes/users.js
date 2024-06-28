var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) { 
    let q1="select * from `logo` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `slider` order by `id` desc";
                dbConn.query(q2,function(error,result2){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        res.render('users/index',{result:result,result2:result2}); 
                    }
                });
                 
            }
        });     
      
});

module.exports = router;