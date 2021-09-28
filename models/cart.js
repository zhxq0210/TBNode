var pool = require("./pool");

//商品的类，提供商品数据服务
class Cart {
    constructor(){}
    add({pid,uid},callback){
        pool.getConnection((err,connection)=>{
            if(err) throw err
            // 先看看  表里面  有没有添加过 当前的商品
            connection.query(`select * from cart where uid=${uid} and pid=${pid}`,(err,results)=>{
                if(err) throw err
                //results =>[] 空没有当前商品   ;  [{pid,card_id...}]有
                if(results.length){
                    //数量累加
                    var newNumber = results[0].number+1
                    connection.query(`update cart set number=${newNumber} where uid=${uid} and pid=${pid}`,(err)=>{
                        callback(err)
                        connection.release() //再回调里面 释放连接
                    })
                }else{
                    connection.query(`insert into cart(uid,pid,number) values(${uid},${pid},1)`,(err)=>{
                        callback(err)
                        connection.release() //再回调里面 释放连接
                    })
                }
               
            })
        })
    }
    getListData({uid},callback){
        pool.getConnection(function(err,connection){
            if(err) throw err
            connection.query(`select * from cart,product,shop where uid=${uid} and product.pid=cart.pid and product.shop_id = shop.shop_id`,function(err,results){
                if(err) throw err
                callback(results)
                connection.release()  //释放
            })
        })
    }
    changeNumber({cart_id,number},callback){
        //修改数量
        pool.getConnection(function(err,connection){
            //number 的临界值  number>=1   & number<=total_number
            connection.query(`update cart set number=${number} where cart_id=${cart_id}`,function(err){
                callback(err)
                connection.release()
            })
        })
    }
    removeItem({cart_id},callback){
        pool.getConnection(function(err, connection){
            connection.query(`delete from cart where cart_id=${cart_id}`,function(err){
                callback(err)
                connection.release()
            })
        })
    }
    getConfirmData({ids},callback){
       //ids : "29,33,55"  29
       //方案2：通过uid获取到所有购物车数据,  然后通过ids刷选出需要提交的数据
       pool.getConnection(function(err,connection){
            var idsArr = ids.split(",")
            var sqlStr = "select * from cart,product where "
            idsArr.forEach((ele,index)=>{
                sqlStr+=(index?" or ":" ")+`cart_id=${ele} and product.pid=cart.pid`
            })
           connection.query(sqlStr,function(err,results){
                callback(err,results)
                connection.release()
           })
       })
    }
}

module.exports = Cart