var pool =require('./pool')


class User{
    constructor(){}
   
    reg(params,callback){
   
        var {username,password} = params
        pool.getConnection(function(err,connection){
            if(err) { throw err}
            //注册1、查询 username是否被占用
            connection.query("select * from user where username='"+username+"'",function(err,results){
                 if(err) { throw err}
                 //results 是数组，如果为空表示 username没有被占用
                 if(results.length){
                    //占用了
                    callback(0)
                    //释放连接
                    connection.release()
                 }else{
                    //可以 注册
                    connection.query("insert into user(username,password) values('"+username+"','"+password+"')",function(err){
                        if(err) {throw err}
                        //注册成功
                        callback(1)
                        //释放连接
                        connection.release()
                    })
                 }
            })
        })

    }
    login({username,password},callback){
        pool.getConnection(function(err,connection){
            if(err) throw err
            connection.query(`select * from user where username=${username}`,function(err,results){
                if(err) throw err
                if(results.length){
                    var userInfo = results[0]
                    //有当前用户
                    if(userInfo.password==password){
                        //如果密码也一致
                        callback(1,userInfo)
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
    //获取默认收货地址
    getDefaultAds({uid},callback){
       // uid = 1
        pool.getConnection(function(err,connection){
            connection.query(`select * from address where uid=${uid} and first=1`,function(err,results){
                callback(err,results)
                connection.release()
            })
        })
    }

    getUserList(params,callback){
        var {pageNum,pageSize} = params;
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //部分字段查询
            var sqlStr = "select * from user,address where user.uid = address.uid"
            
            if(pageNum){
                pageSize = pageSize||10
                var startNum = pageSize * (pageNum-1)
              
                sqlStr+=` limit ${startNum},${pageSize}`
            }
            console.log("页数"+pageNum,sqlStr)
            
            connection.query(sqlStr,function(err,listData){
                //释放连接
                //
                connection.query("select count(*) as total from user",function(err,results){
                    console.log(results[0].total)
                        callback({
                        listData,
                        count:results[0].total
                        })
                    connection.release()
                })
                
            })
        })
    }
    removeUser({uid},callback){
        pool.getConnection(function(err, connection){
            var sqlStr = `delete user,address from user left join address on user.uid = address.uid where user.uid=${uid}`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,detUserData){
                callback({
                    detUserData
                })
               
                console.log(detUserData)
                connection.release()
            })
        })
    }
    updatedUser(params,callback){
        var {uid,username,ads_name,detail} = params
       
      
        pool.getConnection((err,connection)=>{
            if(err) throw err; 
            var sqlStr = `update user,address set username = '${username}',ads_name='${ads_name}',detail='${detail}' where user.uid=${uid} and address.uid=${uid}`
            console.log(sqlStr)
            connection.query(sqlStr,function(err,results){
                if(err) throw err;
                callback(results[0])
                connection.release()
            })
        })
    }
}

module.exports = User