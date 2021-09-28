var express = require('express');
var router = express.Router();

var ClassModel= require("../models/class");
var myClass = new ClassModel()

//商品列表
router.get('/getListData', function(req, res, next) {
  myClass.getListData(function(listData){
    res.send(JSON.stringify(listData))
  })
  
});
router.get('/getDeClass', function(req, res, next) {

  console.log(req.query) // {classID:1/2/3/4/5}  传递给后端的参数
  myClass.getDeClass(req.query,function(declassData){
    res.send(JSON.stringify(declassData))
  })
  
});


module.exports = router;
