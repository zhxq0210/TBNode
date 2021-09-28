var express = require('express');
var router = express.Router();
var multiparty =  require("multiparty")
var Product = require("../models/product");
var myPro = new Product()
/* GET product api. */
router.get('/', function(req, res, next) {
  res.send("商品的接口")
});

//商品列表
router.get('/getListData', function(req, res, next) {

  console.log(req.query) // {classID:1/2/3/4/5}  传递给后端的参数
  myPro.getListData(req.query,function(listData){
    res.send(JSON.stringify(listData))
  })
  
});

//商品分类
router.get('/getdeClassData',function(req,res,next){
  myPro.getdeClassData(req.query,function(deClassData){
    res.send(JSON.stringify(deClassData))
  })
})

//商品分页（管理系统）
router.get('/getProductData', function(req, res, next) {

  console.log(req.query) // {classID:1/2/3/4/5}  传递给后端的参数
  myPro.getProductData(req.query,function(productData){
    res.send(JSON.stringify(productData))
  })
  
});


//商品详情
router.get('/getDetailData', function(req, res, next) {
  console.log(req.query)
  myPro.getDetailData(req.query,function(detailDate){
    console.log("success")
    res.send(detailDate)
  })
  
});

//首页商品
router.get('/getHomeData', function(req, res, next) {
  var listData = [
    {
      name:1
      
    },
    {
      name:2
    }
  ]
  res.send(JSON.stringify(listData))
});

router.get('/removeProduct', function(req, res, next) {
       //req.body 前端传递的数据 {cart_id}
       console.log(req.query)
       myPro.removeProduct(req.query,function(detProData){
        console.log("success")
        res.send(detProData)
      })
});

//修改商品
 router.post('/updateProduct',function(req,res,next){
   myPro.updatedProduct(req.body,function(err){
     res.send({
       err
     })
   })
 })

 //添加商品
 router.get('/addProduct',function(req,res,next){
      console.log(req.query)
    myPro.addProduct(req.query,function(addProData){
      console.log("success")
      res.send(addProData)
    })
 })

//图片上传
router.post('/uploadImg',function(req,res){
  console.log(22222)
  var form = new multiparty.Form({uploadDir:'public/images/files'});
  console.log(form)
  form.parse(req,function(err,fields,files){
    console.log(err)
   if(err){
      console.log('parse error: ' + err);
    } else {
      console.log(files);
      if(files.roompic){
         res.send(JSON.stringify({"imgSrc":files.roompic[0].path.replace(/\\/g,"/")})) //将路径中的\\转换成/
      }else{
        res.send({
          msgInfo:"请设置input的那么为 roompic",
          imgSrc:""
        })
      }
     
      console.log('rename ok');
    }
  });
})
module.exports = router;
