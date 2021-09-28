var pool =require('./pool')


class Address{
    constructor(){}
    //获取默认收货地址
     getAdsData({uid},callback){
        pool.getConnection(function(err,connection){
            if(err) throw err
            connection.query(`select * from address where uid=${uid}`,function(err,results){
                if(err) throw err
                callback(results)
                connection.release()  //释放
            })
        })
    }
    addAdsData(params,callback){
        var {uid,ads_name,mobile,details} = params
        console.log(params)
        pool.getConnection(function(err,connection){
            console.log(1)
            if(err) throw err
            connection.query(`insert into address(uid,ads_name,mobile,detail,first) values(${uid},'${ads_name}','${mobile}','${details}',1)`,(err)=>{
                callback(err)
                connection.release()
            })
        })
    }
}

module.exports = Address