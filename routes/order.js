var express = require('express');
var async = require("async");
var router = express.Router();
var Cart = require("../models/cart")
var User = require("../models/user")
var Order = require("../models/order")
var myCart = new Cart()
var myUser = new User()
var myOrder = new Order()
/* GET product api. */

router.get('/getOrderData', function(req, res, next) {

  //console.log(req.query)  {classID:1/2/3/4/5}  传递给后端的参数
  myOrder.getOrderData(req.query,function(orderData){
    res.send(JSON.stringify(orderData))
  })
  
});


router.get('/getListData', function(req, res, next) {
    myOrder.getListData(req.query,(err,results)=>{
      if(err) {
        res.send({ msgCode:2 })
        throw err
      }else{
         res.send({
          msgCode:1,
          results
        })
      }
    })
});



router.get('/getConfirmData', function(req, res, next) {
  // 需要 默认的收货地址信息  ， 从购物车获取过来即将生成的订单信息
  //user , cart
  var {uid,ids} = req.query; //{uid,ids}
  //并行无关联
  async.parallel([
    function(callback){
      //获取默认的收货地址
       myUser.getDefaultAds({uid},function(err,adsInfo){
         callback(err,adsInfo)
       })
    },
    function(callback){
        //获取需要提交的商品
      myCart.getConfirmData({ids},function(err,orderData){
        callback(err,orderData)
      })
      
    }
  ],function(err,results){
    //results[adsInfo,orderData]
    console.log(err,results)
    if(err){
      res.send({ msgCode:2 })
      throw err
    }else{
      //把 数据发送给前端
      res.send({
        msgCode:1,
        adsInfo:results[0],
        orderData:results[1]
      })
    }
  })
});










//201731888
//20171111111111
function toDouble(num){
  if(num<10){
    num="0"+num
  }
  return num+""
}
//打乱id to  3位
function mixinId(uid){
  var id = String(uid);
  var str=(id[2]||"0")+(id[1]||"0")+id[0]
  return str
}


//提交订单
router.post('/submitOrder', function(req, res, next) {
  var oDate = new Date()
  //生成订单号
  var order_num = ""
   order_num+= oDate.getFullYear()+toDouble(oDate.getMonth()+1)+toDouble(oDate.getDate())+toDouble(oDate.getHours())+toDouble(oDate.getMinutes())+toDouble(oDate.getSeconds())+mixinId(1);

  //{...req.body,order_num}
   var param = req.body;//前端传递的数据
   param.order_num = order_num //追加 order_num 参数
   console.log(param)
   myOrder.submitOrder(param,function(err){
      if(err){
        res.send({msgCode:0})
      }else{
        res.send({msgCode:1})
      }
   })
});

router.post('/pay', function(req, res, next) {
  myOrder.pay(req.body,(err)=>{
    if(err){
      res.send({msgCode:2})
      throw err
    }else{
      res.send({msgCode:1})
    }
  })
});


module.exports = router;


//201711020001
//201711020002
//201711025202

//20171 10217 5720  +  001
//时间 + 用户id（需要打乱）