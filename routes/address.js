var express = require('express');
var router = express.Router();
var Address = require("../models/address");
var myAddress= new Address()
/* GET product api. */


router.get('/getAdsData', function(req, res, next) {
  if(req.session.user||req.query.uid){ //先判断 用户权限（鉴权）
     var uid =  req.query.uid || req.session.user.uid //获取uid

     myAddress.getAdsData({uid},function(AdsData){
        res.send({
          msgCode:1,
          AdsData
        })
     })
  }else{
     res.send({
       msgCode:0,
       AdsData:[]
     })
  } 
});

router.post('/addAdsData', function(req, res, next) {
  //req.body 前端用post方式传递的数据
  console.log(req.body)
  myAddress.addAdsData(req.body,function(msgCode){
    console.log(msgCode)
    res.send({msgCode})
  })

});
module.exports = router;
