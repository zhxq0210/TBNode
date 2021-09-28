var pool =require('./pool')


class Shop{
    constructor(){}
    getShopList(params,callback){
        var {pageNum,pageSize} = params;
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //部分字段查询
            var sqlStr = "select * from shop"
            
            if(pageNum){
                pageSize = pageSize||10
                var startNum = pageSize * (pageNum-1)
              
                sqlStr+=` limit ${startNum},${pageSize}`
            }
            connection.query(sqlStr,function(err,shopData){
                //释放连接
                //
                connection.query("select count(*) as total from shop",function(err,results){
                    console.log(results)
                        callback({
                        shopData,
                        shopCount:results[0].total
                        })
                    connection.release()
                })
                
            })
        })
    }
    addShopData({shop_id,shop_name,shop_add,shop_detail,shop_tel},callback){
        pool.getConnection((err,connection)=>{
            if(err) throw err;
            var sqlStr = `insert into shop(shop_id,shop_name,shop_add,shop_detail,shop_tel) values('${shop_id}','${shop_name}','${shop_add}','${shop_detail}','${shop_tel}')`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,results){
                if(err) throw err;
                callback(results[0])
                //释放连接
                connection.release()
            })
        })
    }
    //修改
    editShopData({shop_id,shop_name,shop_add,shop_detail,shop_tel},callback){
        pool.getConnection((err,connection)=>{
            if(err) throw err;
            var sqlStr = `update shop set shop_name='${shop_name}',shop_add='${shop_add}',shop_detail='${shop_detail}',shop_tel='${shop_add}' where shop_id=${shop_id}`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,results){
                if(err) throw err;
                callback(results[0])
                //释放连接
                connection.release()
            })
        })
    }
    removeShop({shop_id},callback){
            console.log({shop_id})
             console.log(111)
            pool.getConnection((err,connection)=>{
                var sqlStr = `delete from shop where shop_id=${shop_id}`
               
                console.log(sqlStr)
                connection.query(sqlStr,function(err){
                    if(err) throw err;
                    callback(err);
                    connection.release();
                })
            })
        }

    
}

module.exports = Shop