var express = require('express');
var router = express.Router();
var Cart = require("../models/cart");
var myCart = new Cart()
/* GET product api. */


//列表
router.get('/getListData', function(req, res, next) {
  if(req.session.user||req.query.uid){ //先判断 用户权限（鉴权）
     var uid =  req.query.uid || req.session.user.uid //获取uid

     myCart.getListData({uid},function(cartData){
        res.send({
          msgCode:1,
          cartData
        })
     })
  }else{
     res.send({
       msgCode:0,
       cartData:[]
     })
  }
  
  
});

//添加
router.get('/add', function(req, res, next) {
  //需要 uid
  console.log(req.session)
  
  if(req.session.user||req.query.uid){ //通过两种方式识别用户身份 session/ 主动传递uid (token在计算机身份认证中是令牌（临时）的意思)
     var uid =  req.query.uid || req.session.user.uid
     var pid = req.query.pid
     myCart.add({pid,uid},function(err){
       
        if(!err){
           res.send({msgCode:1})
        }else{
           console.log(err)
           res.send({msgCode:2})
        }
     })
    
  }else{
     res.send({msgCode:0})
  }
  
});

//修改数量
router.post('/changeNumber', function(req, res, next) {
   if(req.session.user||req.body.uid){ 
     //req.body 前端传递的数据 {cart_id,number}
     myCart.changeNumber(req.body,function(err){
       if(err){
          res.send({msgCode:2}) 
          throw err
       }else{
          res.send({msgCode:1})
       }
     })
   }else{
     res.send({msgCode:0}) 
   }
  
});

//删除
router.post('/removeItem', function(req, res, next) {
   if(req.session.user||req.body.uid){ 
       //req.body 前端传递的数据 {cart_id}
       myCart.removeItem(req.body,function(err){
       if(err){
          res.send({msgCode:2}) 
          throw err
       }else{
          res.send({msgCode:1})
       }
     })
   }else{
     res.send({msgCode:0}) 
   }
});



module.exports = router;
