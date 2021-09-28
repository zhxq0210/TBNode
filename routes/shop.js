var express = require('express');
var router = express.Router();
var Shop = require("../models/shop");
var myshop = new Shop()
/* GET product api. */
//获取商铺列表
router.get('/getShopList', function(req, res, next) {

  //console.log(req.query)  {classID:1/2/3/4/5}  传递给后端的参数
  myshop.getShopList(req.query,function(shopData){
    res.send(JSON.stringify(shopData))
  })
  
});

//移除商铺
router.get('/removeShop', function(req, res, next) {
 // console.log(req.query)
     //req.body 前端传递的数据 {cart_id,number}
     myshop.removeShop(req.query,function(removeItemData){
       res.send(JSON.stringify(removeItemData))
     })
  
});


//添加商铺
router.get('/addShopData', function(req, res, next) {
  //console.log(req.query)
     //req.body 前端传递的数据 {cart_id,number}
     myshop.addShopData(req.query,function(addShopData){
       res.send(JSON.stringify(addShopData))
     })
  
});

//修改商铺
router.get('/editShopData', function(req, res, next) {
  console.log(req.query)
     //req.body 前端传递的数据 {cart_id,number}
     myshop.editShopData(req.query,function(editShopData){
       res.send(JSON.stringify(editShopData))
     })
  
});

//添加商铺商品
module.exports = router;
