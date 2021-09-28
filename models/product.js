var pool =require('./pool')


class Product{
    constructor(){}
    getProductData(params,callback){
        var {pageNum,pageSize} = params
        pool.getConnection(function(err,connection){
            if(err) throw err
            var sqlStr = "select * from product,declass,shop where product.declass_id = declass.declass_id and product.shop_id=shop.shop_id"
             if(pageNum){
                pageSize = pageSize||10
                var startNum = pageSize * (pageNum-1)
                sqlStr+=` limit ${startNum},${pageSize}`
            }
            
            connection.query(sqlStr,function(err,productData){
                connection.query("select count(*) as total from product",function(err,results){
                    callback({
                        productData,
                        count:results[0].total
                    })
                    connection.release()
                })
            })
        })
    }
    getdeClassData(params,callback){
        var {pageNum,pageSize} = params
        pool.getConnection(function(err,connection){
            if(err) throw err
            connection.query('select * from declass',function(err,deCalssData){
                callback({
                    deCalssData
                })
                connection.release()
            })
        })
    }
    getListData(params,callback){
        var {classID} = params;
        classID*=1;  //把字符串 =》数字
        console.log(classID)
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //部分字段查询
            var sqlStr = "select p_name,pid,price,seller_number,img_url from product"//"select * from product"
            if(classID){
                //想要按照分类搜索
                var sqlStr =sqlStr+" where declass_id="+classID
            }
            
            connection.query(sqlStr,function(err,results){
                callback(results)
                //释放连接
                connection.release()
            })
        })
    }
    removeProduct({pid},callback){
        pool.getConnection(function(err, connection){
            connection.query(`delete from product where pid=${pid}`,function(err,detProData){
                callback({
                    detProData
                })
                connection.release()
            })
        })
    }
    getDetailData({pid},callback){
        pool.getConnection((err,connection)=>{
             if(err) throw err;
             connection.query(`select * from product where pid=${pid}`,function(err,results){
                 if(err) throw err;
                 callback(results[0])
                 //释放连接
                 connection.release()
             })
        })
    }
    updatedProduct(params,callback){
        var {p_name,seller_number,total_number,price,declass_id,img_url,img_list,pid,declass_name} = params
        img_list = JSON.stringify(img_list)
        console.log(img_url)
        pool.getConnection((err,connection)=>{
            if(err) throw err; 
            var sqlStr = `update product set p_name = '${p_name}',seller_number = ${seller_number},total_number=${total_number},price=${price},img_url='${img_url}',declass_id=${declass_id} where pid=${pid}`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,results){
                if(err) throw err;
                callback(results[0])
                connection.release()
            })
        })
    }
    addProduct({p_name,total_number,price,declass_id,shop_id,img_url},callback){
        pool.getConnection((err,connection)=>{
            if(err) throw err;
            var sqlStr = `insert into product(p_name,total_number,price,declass_id,shop_id,img_url) values('${p_name}','${total_number}','${price}','${declass_id}','${shop_id}','${img_url}')`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,results){
                if(err) throw err;
                callback(results[0])
                //释放连接
                connection.release()
            })
        })
    }
}

module.exports = Product