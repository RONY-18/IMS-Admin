var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
var multer=require('multer');
var fileUpload=require('express-fileupload');

router.get('/', function(req, res, next) {   
    if(!req.session.adm)
    {
        res.render('admin/index',{msg:""}); 
    }   
    else
    {
        res.redirect('/admin/profile'); 
    } 
      
});
router.post('/login', function(req, res, next) {   
    let s1=req.body.adminid;
    let s2=req.body.password;
    q1="select count(*) as count2 from `admin` where `adminid`='"+s1+"' and `password`='"+s2+"'";
    dbConn.query(q1,function(err,result){
        
            if(result[0].count2>0)
            {
                //res.render('admin/index',{msg:"valid login details"});
                req.session.adm=s1;//create session
                res.redirect('/admin/profile'); 
            }
            else
            {
                res.render('admin/index',{msg:"invalid login details"}); 
            }
        
    });   
});
router.get('/profile', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        q1="select count(*) as count2 from `student`";
        dbConn.query(q1,function(err,result1){
            q2="select count(*) as count2 from `course`";
            dbConn.query(q2,function(err,result2){
                q3="select SUM(pfee) as count2 from `myorder`";
                dbConn.query(q3,function(err,result3){
                    var timestamp = new Date();
                    q4="SELECT SUM(pfee) AS count2 FROM `myorder` WHERE `created_at` = '"+timestamp+"'";
                    dbConn.query(q4,function(err,result4){
                        res.render('admin/profile',{nm:req.session.adm,count1:result1[0].count2,count2:result2[0].count2,count3:result3[0].count2,count4:result4[0].count2});  
                    });  
                });  
            });   
        }); 
    }
});
router.get('/addstudent', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
    res.render('admin/addstudent',{nm:req.session.adm,msg:""});   
    }
});
router.post('/storestudent', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
//upload image,name extract,path extract,destination,unique name
//upload
var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
var random = ("" + Math.random()).substring(2, 8); 
var random_number = timestamp+random; 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/student/')
    },
    filename: function (req, file, cb) {
      cb(null, random_number+'.jpg')
    }
  });
  var upload = multer({ storage: storage }).single('image');
  upload(req,res,function(err){
      if(err)
      {
        res.render('admin/addstudent',{nm:req.session.adm,msg:"something went wrong"}); 
      }
      else
      {
        let name=req.body.name;
        let email=req.body.email;
        let phone=req.body.phone;
        let password=req.body.password;
        let gender=req.body.gender;
        let nationality=req.body.nationality;
        let image=random_number+'.jpg';
        q2="select count(*) as count2 from `student` where `email`='"+email+"' or `phone`='"+phone+"'";
        dbConn.query(q2,function(err,result){
            
                if(result[0].count2>0)
                {
                    //res.render('admin/index',{msg:"valid login details"});
                    res.render('admin/addstudent',{nm:req.session.adm,msg:"email or phone number already exist"}); 
                }
                else
                {
                    let q1="INSERT INTO `student`(`name`, `email`, `phone`, `password`, `image`, `gender`, `nationality`, `status`) VALUES ('"+name+"','"+email+"','"+phone+"','"+password+"','"+image+"','"+gender+"','"+nationality+"','1')";
                    dbConn.query(q1,function(err,result){
                        res.render('admin/addstudent',{nm:req.session.adm,msg:"inserted successfully done"}); 
                    }); 
                }
            
        });   

        
          
      }
    });
    }
});
router.get('/allstudent', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let q1="select * from `student` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/allstudent',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/viewstudent/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `student` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/viewstudent',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/deletestudent/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `student` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/deletestudent',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/deletestudent1/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `student` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="delete from `student` where `id`='"+v1+"'";
                    dbConn.query(q2,function(error,result2){
                        res.redirect('/admin/allstudent');
                    }); 
            }
        });
    
     
    }
});
router.get('/editstudent/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `student` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/editstudent',{nm:req.session.adm,result:result,msg:""}); 
            }
        });
    
     
    }
});
router.post('/editstudent', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let id=req.body.id;
        let name=req.body.name;
        let email=req.body.email;
        let phone=req.body.phone;
        let password=req.body.password;
        let gender=req.body.gender;
        let nationality=req.body.nationality;

        q3="select count(*) as count2 from `student` where (`email`='"+email+"' or `phone`='"+phone+"') and `id`!='"+id+"'";
        dbConn.query(q3,function(err,result3){
            if(result3[0].count2>0)
                {
                    let q2="select * from `student` where `id`='"+id+"'";
                    dbConn.query(q2,function(error,result2){
                    res.render('admin/editstudent',{nm:req.session.adm,result:result2,msg:"email or phone number already exist"}); 
                    });
                }
                else
                {
        let q1="update `student` set `name`='"+name+"',`email`='"+email+"',`phone`='"+phone+"',`password`='"+password+"',`gender`='"+gender+"',`nationality`='"+nationality+"' where `id`='"+id+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `student` where `id`='"+id+"'";
                dbConn.query(q2,function(error,result2){
                res.render('admin/editstudent',{nm:req.session.adm,result:result2,msg:"updated successfully done"}); 
                });
            }
        });
    
    }
});
    }
});


router.get('/addcourse', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
    res.render('admin/addcourse',{nm:req.session.adm,msg:""});   
    }
});
router.post('/storecourse', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
//upload image,name extract,path extract,destination,unique name
//upload
var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
var random = ("" + Math.random()).substring(2, 8); 
var random_number = timestamp+random; 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/course/')
    },
    filename: function (req, file, cb) {
      cb(null, random_number+'.jpg')
    }
  });
  var upload = multer({ storage: storage }).single('image');
  upload(req,res,function(err){
      if(err)
      {
        res.render('admin/addcourse',{nm:req.session.adm,msg:"something went wrong"}); 
      }
      else
      {
        let name=req.body.name;
        let details=req.body.details;
        let tfee=req.body.tfee;
        let dfee=req.body.dfee;
        let image=random_number+'.jpg';
        q2="select count(*) as count2 from `course` where `name`='"+name+"'";
        dbConn.query(q2,function(err,result){
            
                if(result[0].count2>0)
                {
                    //res.render('admin/index',{msg:"valid login details"});
                    res.render('admin/addcourse',{nm:req.session.adm,msg:"course already exist"}); 
                }
                else
                {
                    let q1="INSERT INTO `course`(`name`, `details`, `tfee`, `dfee`, `image`) VALUES ('"+name+"','"+details+"','"+tfee+"','"+dfee+"','"+image+"')";
                    dbConn.query(q1,function(err,result){
                        res.render('admin/addcourse',{nm:req.session.adm,msg:"inserted successfully done"}); 
                    }); 
                }
            
        });   

        
          
      }
    });
    }
});
router.get('/allcourse', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let q1="select * from `course` order by `name` asc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/allcourse',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/viewcourse/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `course` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/viewcourse',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/deletecourse/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `course` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/deletecourse',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/deletecourse1/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `course` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="delete from `course` where `id`='"+v1+"'";
                    dbConn.query(q2,function(error,result2){
                        if(error)
                          {
                console.log(error);
                          }
                          else
                          {
                        res.redirect('/admin/allcourse');
                          }
                    }); 
            }
        });
    
     
    }
});
router.get('/editcourse/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `course` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/editcourse',{nm:req.session.adm,result:result,msg:""}); 
            }
        });
    
     
    }
});
router.post('/editcourse', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let id=req.body.id;
        let name=req.body.name;
        let details=req.body.details;
        let tfee=req.body.tfee;
        let dfee=req.body.dfee;

        q3="select count(*) as count2 from `course` where (`name`='"+name+"') and `id`!='"+id+"'";
        dbConn.query(q3,function(err,result3){
            if(result3[0].count2>0)
                {
                    let q2="select * from `course` where `id`='"+id+"'";
                    dbConn.query(q2,function(error,result2){
                    res.render('admin/editcourse',{nm:req.session.adm,result:result2,msg:"course name already exist"}); 
                    });
                }
                else
                {
        let q1="update `course` set `name`='"+name+"',`details`='"+details+"',`tfee`='"+tfee+"',`dfee`='"+dfee+"' where `id`='"+id+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `course` where `id`='"+id+"'";
                dbConn.query(q2,function(error,result2){
                res.render('admin/editcourse',{nm:req.session.adm,result:result2,msg:"updated successfully done"}); 
                });
            }
        });
    
    }
});
    }
});



router.get('/addorder', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {

        let q1="select * from `student` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `course` order by `name` asc";
                dbConn.query(q2,function(error,result2){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        res.render('admin/addorder',{nm:req.session.adm,msg:"",result:result,result2:result2}); 
                    }
                });
                
            }
        });


        
       
    }
});
router.post('/storeorder', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {

        let sid=req.body.sid;
        let cid=req.body.cid;

        q4="select count(*) as count2 from `myorder` where `sid`='"+sid+"' and `cid`='"+cid+"'";
        dbConn.query(q4,function(err,result4){
            
                if(result4[0].count2>0)
                {
                    let q1="select * from `student` order by `id` desc";
                    dbConn.query(q1,function(error,result){
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            let q2="select * from `course` order by `name` asc";
                            dbConn.query(q2,function(error,result2){
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    res.render('admin/addorder',{nm:req.session.adm,msg:"student already enroll in this course",result:result,result2:result2}); 
                                }
                            });
                            
                        }
                    });
                    //res.render('admin/index',{msg:"valid login details"});
                    
                }
                else
                {
                    let sid=req.body.sid;
                    let cid=req.body.cid;
                    let tfee=req.body.tfee;
                    let pfee=req.body.pfee;
                    console.log(sid+" "+cid+" "+tfee+" "+pfee);
                    let q3="INSERT INTO `myorder`(`sid`, `cid`, `tfee`, `pfee`) VALUES ('"+sid+"','"+cid+"','"+tfee+"','"+pfee+"')";
                    dbConn.query(q3,function(err,result3){
                        let q6="select * from `myorder` where `sid`='"+sid+"' and `cid`='"+cid+"'";
                        dbConn.query(q6,function(err,result6){
                        let q5="INSERT INTO `partpayment`(`oid`, `sid`, `amount`) VALUES ('"+result6[0].id+"','"+sid+"','"+pfee+"')";
                        dbConn.query(q5,function(err,result5){

                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                    let q1="select * from `student` order by `id` desc";
                    dbConn.query(q1,function(error,result){
                        if(error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            let q2="select * from `course` order by `name` asc";
                            dbConn.query(q2,function(error,result2){
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    res.render('admin/addorder',{nm:req.session.adm,msg:"student successfully enroll in course",result:result,result2:result2}); 
                                }
                            });
                            
                        }
                    });
                }
                 });
                });
                    }); 
                }
            
        });
}		
});
router.get('/allorder', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let q1="select * from `student` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `course` order by `name` asc";
                dbConn.query(q2,function(error,result2){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        let q3="select * from `myorder`";
                        dbConn.query(q3,function(error,result3){
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                res.render('admin/allorder',{nm:req.session.adm,msg:"",result:result,result2:result2,result3:result3}); 
                            }
                        });   
                    }
                });
                
            }
        });


        
    
     
    }
});

router.get('/editorder/(:v1)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let q1="select * from `myorder` where `id`='"+v1+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/editorder',{nm:req.session.adm,result:result,msg:""}); 
            }
        });
    
     
    }
});
router.post('/editorder', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let id=req.body.id;
        let name=req.body.name;
        let details=req.body.details;
        let tfee=req.body.tfee;
        let dfee=req.body.dfee;

        q3="select count(*) as count2 from `myorder` where (`name`='"+name+"') and `id`!='"+id+"'";
        dbConn.query(q3,function(err,result3){
            if(result3[0].count2>0)
                {
                    let q2="select * from `myorder` where `id`='"+id+"'";
                    dbConn.query(q2,function(error,result2){
                    res.render('admin/editmyorder',{nm:req.session.adm,result:result2,msg:"myorder name already exist"}); 
                    });
                }
                else
                {
        let q1="update `myorder` set `name`='"+name+"',`details`='"+details+"',`tfee`='"+tfee+"',`dfee`='"+dfee+"' where `id`='"+id+"'";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                let q2="select * from `myorder` where `id`='"+id+"'";
                dbConn.query(q2,function(error,result2){
                res.render('admin/editorder',{nm:req.session.adm,result:result2,msg:"updated successfully done"}); 
                });
            }
        });
    
    }
});
    }
});

router.get('/addamount/(:v1)/(:v2)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let v2=req.params.v2;
        res.render('admin/addamount',{nm:req.session.adm,msg:"",v1:v1,v2:v2}); 
    }                      
 }); 
 router.post('/storeamount', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let sid=req.body.sid;
        let oid=req.body.oid;
        let amount=req.body.amount;
        let q5="INSERT INTO `partpayment`(`oid`, `sid`, `amount`) VALUES ('"+oid+"','"+sid+"','"+amount+"')";
        dbConn.query(q5,function(err,result5){
            let q2="select * from `myorder` where `id`='"+oid+"'";
            dbConn.query(q2,function(error,result2){
               let total=  parseInt(result2[0].pfee)+parseInt(amount);   
               let q1="update `myorder` set `pfee`='"+total+"' where `id`='"+oid+"'";
               dbConn.query(q1,function(error,result){
                    res.render('admin/addamount',{nm:req.session.adm,msg:"updated",v1:sid,v2:oid}); 
           });
            });
            
    });
}                      
 }); 
 router.get('/viewamount/(:v1)/(:v2)', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let v1=req.params.v1;
        let v2=req.params.v2;
        let q2="select * from `partpayment` where `sid`='"+v1+"' and `oid`='"+v2+"'";
        dbConn.query(q2,function(error,result2){
        res.render('admin/viewamount',{nm:req.session.adm,result:result2,msg:""}); 
        });
        
    }                      
 }); 





router.get('/addvideo', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {

        
                let q2="select * from `course` order by `name` asc";
                dbConn.query(q2,function(error,result2){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        res.render('admin/addvideo',{nm:req.session.adm,msg:"",result2:result2}); 
                    }
                });
                
            


        
       
    }
});
router.post('/storevideo', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
                    let cid=req.body.cid;
                    let title=req.body.title;
                    let link=req.body.link;
					let details=req.body.details;
                   
                    let q3="INSERT INTO `video`(`cid`, `title`, `link`, `details`) VALUES ('"+cid+"','"+title+"','"+link+"','"+details+"')";
                    dbConn.query(q3,function(err,result3){
                       
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let q2="select * from `course` order by `name` asc";
                            dbConn.query(q2,function(error,result2){
                                if(error)
                                {
                                    console.log(error);
                                }
                                else
                                {
                                    res.render('admin/addvideo',{nm:req.session.adm,msg:"student successfully enroll in course",result2:result2}); 
                                }
                            });
                            
                        }
						});
	}
});
router.get('/allvideo', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
                let q2="select * from `course` order by `name` asc";
                dbConn.query(q2,function(error,result2){
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        let q3="select * from `video`";
                        dbConn.query(q3,function(error,result3){
                            if(error)
                            {
                                console.log(error);
                            }
                            else
                            {
                                res.render('admin/allvideo',{nm:req.session.adm,msg:"",result2:result2,result3:result3}); 
                            }
                        });   
                    }
                });
                
            }
});


router.get('/addlogo', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
    res.render('admin/addlogo',{nm:req.session.adm,msg:""});   
    }
});
router.post('/storelogo', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
//upload image,name extract,path extract,destination,unique name
//upload
var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
var random = ("" + Math.random()).substring(2, 8); 
var random_number = timestamp+random; 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/logo/')
    },
    filename: function (req, file, cb) {
      cb(null, random_number+'.jpg')
    }
  });
  var upload = multer({ storage: storage }).single('image');
  upload(req,res,function(err){
      if(err)
      {
        res.render('admin/addlogo',{nm:req.session.adm,msg:"something went wrong"}); 
      }
      else
      {
        let image=random_number+'.jpg';
        let theme_color=req.body.theme_color;
                    let q1="INSERT INTO `logo`(`image`,`status`,`theme_color`) VALUES ('"+image+"','1','"+theme_color+"')";
                    dbConn.query(q1,function(err,result){
                        res.render('admin/addlogo',{nm:req.session.adm,msg:"inserted successfully done"}); 
                    }); 
      }
    });
    }
});

router.get('/addslider', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
    res.render('admin/addslider',{nm:req.session.adm,msg:""});   
    }
});
router.post('/storeslider', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
//upload image,name extract,path extract,destination,unique name
//upload
var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
var random = ("" + Math.random()).substring(2, 8); 
var random_number = timestamp+random; 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/slider/')
    },
    filename: function (req, file, cb) {
      cb(null, random_number+'.jpg')
    }
  });
  var upload = multer({ storage: storage }).single('image');
  upload(req,res,function(err){
      if(err)
      {
        res.render('admin/addslider',{nm:req.session.adm,msg:"something went wrong"}); 
      }
      else
      {
	    let serial=req.body.serial;
        let image=random_number+'.jpg';
        
                    let q1="INSERT INTO `slider`(`image`,`status`,`serial`) VALUES ('"+image+"','1','"+serial+"')";
                    dbConn.query(q1,function(err,result){
                        res.render('admin/addslider',{nm:req.session.adm,msg:"inserted successfully done"}); 
                    }); 
      }
    });
    }
});
router.get('/allslider', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let q1="select * from `slider` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/allslider',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});

router.get('/allcontact', function(req, res, next) {      
    if(!req.session.adm)
    {
        res.redirect('/admin');
    } 
    else
    {
        let q1="select * from `contact` order by `id` desc";
        dbConn.query(q1,function(error,result){
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render('admin/allcontact',{nm:req.session.adm,result:result}); 
            }
        });
    
     
    }
});
router.get('/logout', function(req, res, next) {    
    // render to add.ejs
    if(!req.session.adm)
    {
        res.redirect('/admin');
    }  
    else
    {
        req.session.destroy();
        res.redirect('/admin');
        //res.render('admin/index',{msg:"sucessfully logout"});
    }
});


module.exports = router;