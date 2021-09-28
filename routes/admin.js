var express = require('express');
var router = express.Router();
var Admin = require("../models/admin");
var myAdmin = new Admin()
/* GET product api. */


//提交数据
router.post("/login",function(req,res,next){
  console.log(req.body) //post方式提交的数据

  //登录 =》req.body.username 是否存在,password是否匹配
  myAdmin.login(req.body,function(stateCode,adminData){
    res.send({adminData:adminData})
  })
})
//注销
router.get("/logout",function(req,res,next){
  req.session.user = null;
  res.send(JSON.stringify({msgCode:1})) 
})

router.get('/getAdminList', function(req, res, next) {
  myAdmin.getAdminList(req.query,function(adminData){
    res.send(JSON.stringify(adminData))
  })
  
});

module.exports = router;
