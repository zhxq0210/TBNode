var pool =require('./pool')
var async = require('async')

class Order{
    constructor(){}
    //1\获取连接
    //2\通过state 去查订单信息 (需要商品数据，有pids)
    //3\通过pids 获取每一个订单的商品数据（需要标注购买量）
    //4\把 添加了商品的信息的数据给前端
    //串行有关联
    getOrderData({pageNum,pageSize},callback){  
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //var sqlStr = "select * from `order`,shop,address,user where shop.shop_id=`order`.shop_id and address.uid = `order`.uid and user.uid=`order`.uid"
            //and `order`.uid=address.ads_id and `order`.order_pids=product.pid and product.shop_id=shop.shop_id
            var sqlStr = "select * from `order`,user,address,product,shop where `order`.uid=user.uid and `order`.uid=address.ads_id and `order`.order_pids=product.pid and product.shop_id = shop.shop_id"
            if(pageNum){
                pageSize = pageSize||5
                var startNum = pageSize * (pageNum-1)
                sqlStr +=` limit ${startNum},${pageSize}`
            }
            console.log("数据库语句："+sqlStr)
            connection.query(sqlStr,function(err,orderData){
                connection.query("select count(*) as total from `order`",function(err,results){
                    callback({
                        orderData,
                        count:results[0].total
                    })
                    console.log(results)
                    connection.release()
                    
                })
            })
        })
    }
    getListData({uid,state},callback){
        state*=1
        //串行有关联
        async.waterfall([
            (cb)=> pool.getConnection(cb), //1、先获取连接
            (conn,cb)=> { //2、拿到连接 通过state进行查询
                var sqlStr =   "select * from `order` where uid="+ uid
                if(state){
                    var sqlStr =sqlStr+ ` and state=${state}`
                }
                conn.query(sqlStr,(err,orderData)=>{
                    
                    cb(err,conn,orderData)//订单查询成功，调用回调
                })
            },
            (conn,orderData,cb)=>{ //拿到订单中的order_pids 去查询商品信息
                var len = orderData.length;
                //如果有订单数据，循环订单信息，查询每一个订单的商品信息
                len?orderData.forEach((order,index)=>{
                    var numbersArr = order.order_numbers.split(",");
                    var pidsArr = order.order_pids.split(",");

                    //数据库部分 查询商品数据
                    var sqlStr = "select p_name,img_url,price from product where"
                    pidsArr.forEach((id,index)=>{
                        sqlStr+=(index?" or ":" ")+"pid="+id
                    })
                    conn.query(sqlStr,(err,productData)=>{
                        if(err){
                            cb(err); //出错执行回调
                            return
                        }
                        //为每一条商品信息添加购买数量 （order_numbers）
                        productData.forEach((pro,index)=>{
                            pro.number = numbersArr[index]
                        })
                        //为订单添加productInfo属性
                        order.productInfo = productData

                        if(len==index+1){ //如果最后一个订单商品数据查询完成，
                            conn.release()
                            cb(null,orderData)//执行回调 传人数据
                        }
                    }) 
                }):cb(null,orderData) //如果没有订单数据，直接回调
            }
        ],function(err,results){
            callback(err,results)
        }) //可以直接传人路由的回调
       
       
    }
    pay({uid,price,order_id},callback){
        //支付,=》把订单状态修改 待收货
          async.waterfall([
             cb=> pool.getConnection(cb),
            (conn,cb)=> {
                var sqlStr =   "update `order` set state=2 where order_id="+order_id
                conn.query(sqlStr,(err,results)=>{
                    conn.release()
                    cb(err)
                })
            }],callback)
    }
    submitOrder({uid,ads_id,ids,order_pids,total_sum,order_numbers,order_num},callback){
        //
        //提交订单
        //1、去除购物车里面的数据
        //2、生成新的订单数据

        pool.getConnection(function(err,connection){
            if(err){  throw err}
            //开启数据库事务
            connection.beginTransaction(function(err){
                if(err) throw err
                async.parallel([
                    //购物车
                    function(cb){
                        //ids
                        var sqlStr = "delete from cart where "
                        var idsArr =ids.split(","); //[4,5,6]
                        //" cart_id=4" +" or cart_id=5"++" or cart_id=6"
                        idsArr.forEach((ele,index)=>{
                            sqlStr+=(index?" or ":" ")+`cart_id=${ele}`
                        })
                        console.log(sqlStr)
                        connection.query(sqlStr,function(err){
                            cb(err)
                        })
                    //生成订单
                    },
                    function(cb){
                        var sqlStr = "insert into `order`(uid,ads_id,order_pids,total_sum,order_numbers,order_num) "
                        sqlStr+=`values(${uid},${ads_id},'${order_pids}',${total_sum},'${order_numbers}',${order_num})`
                        console.log(sqlStr)
                        connection.query(sqlStr,function(err){
                            cb(err)
                        })
                    }
                ],function(err,results){
                    //err 可以收到 所有异步操作的错误信息
                    if(err){
                        connection.rollback(function(){
                            callback(err) //给路由反馈的结果
                            throw err
                        });
                    }else{
                        //都执行成功会提交
                        connection.commit(function(err){
                            if(err){ //提交异常，也需要回滚
                                connection.rollback(function(){
                                    callback(err)//给路由反馈的结果
                                    throw err
                                });
                            }else{
                                console.log("success")
                                callback(err)//给路由反馈的结果
                                connection.release() //释放连接
                            }
                        })
                    }

                })
            })



        })
    }
}

module.exports = Order

