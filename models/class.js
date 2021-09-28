var pool =require('./pool')


class ClassModel{
    constructor(){}
    getListData(callback){
        pool.getConnection(function(err,connection){
            if(err) throw err;
            connection.query("select * from class",function(err,results){
                callback(results)
                //释放连接
                connection.release()
            })
        })
    }
      getDeClass(params,callback){
        var {classID} = params;
        classID*=1;  //把字符串 =》数字
        pool.getConnection(function(err,connection){
            if(err) throw err;
            //部分字段查询
            var sqlStr = "select * from declass"//"select * from product"
            if(classID){
                //想要按照分类搜索
                var sqlStr =sqlStr+" where class_id="+classID
            }
            
            connection.query(sqlStr,function(err,results){
                callback(results)
                //释放连接
                connection.release()
            })
        })
    }
}

module.exports = ClassModel