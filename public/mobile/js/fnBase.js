define([], function() {
    return {
        baseUrl:"http://localhost:3000/api",
        formatTime(time){
            var oDate = time
            if(typeof time !=="object"){
                oDate = new Date(time)
            }
            return "2017-10-31"
        },
        getQueryData(key){
            var query = window.location.href.split("?")[1]; //参数numer=2&pid=4&type=3
            console.log(query)
            var value = ""
            if(query){
                var queryArr = query.split("&") //["numer=2","pid=4","type=3"]
                queryArr.forEach(function(ele){
                    var param = ele.split("="); //["pid",4]             ["numer","2"]
                    if(param[0]==key){//["pid",4] 
                         console.log(param[1])
                         value =  param[1] //pid = 4
                    }
                })
            }
            return value
        },
        getUserId(){
            var cookieArr  = document.cookie.split("; ");
            var uid;
            cookieArr.forEach(ele=>{
                var param = ele.split("=")
                if(param[0]=="uid"){ //["uid",16]
                    uid= param[1]
                }
            })
            return uid
        }
        ,
         //乘法计算
    accMul:function(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {}

        try {
            m += s2.split(".")[1].length
        } catch (e) {}

        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)

    },
    //加法计算
    accAdd:function (arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }

        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }

        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2))
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m
    }
    }
    
});