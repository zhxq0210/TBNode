var pool =require('./pool')


class Admin{
    constructor(){}
    login({admins,password},callback){
        pool.getConnection(function(err,connection){
            if(err) throw err
            connection.query(`select * from admin where admins="${admins}"`,function(err,results){
                console.log(results)
                if(err) throw err
                if(results.length){
                    var adminData = results[0]
                    //有当前用户
                    if(adminData.password==password){
                        //如果密码也一致
                        callback(1,adminData)
                    }else{
                        //密码错误
                        callback(2)
                    }
                }else{
                    //用户名不存在
                    callback(0)
                }
                connection.release()

            })
        })
    }
    getAdminList(params,callback){
        var {pageNum,pageSize} = params;
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //部分字段查询
            var sqlStr = "select * from admin"
            
            if(pageNum){
                pageSize = pageSize||10
                var startNum = pageSize * (pageNum-1)
              
                sqlStr+=` limit ${startNum},${pageSize}`
            }
            console.log("页数"+pageNum,sqlStr)
            
            connection.query(sqlStr,function(err,adminData){
                //释放连接
                //
                connection.query("select count(*) as total from admin",function(err,results){
                    console.log(results[0].total)
                        callback({
                        adminData,
                        count:results[0].total
                        })
                    connection.release()
                })
                
            })
        })
    }
}

module.exports = Admin