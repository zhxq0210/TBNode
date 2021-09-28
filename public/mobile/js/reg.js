require(["config"],function(){
    require(["jquery","fnBase"],function($,fnBase){
        var $getCode = $(".get-code");
        var $regBtn = $(".reg-btn");
        var $user = $(".username");
        var $mobileCode = $(".mobile-code");
        var $password = $(".password");
        var $rPassword = $(".r-password");


        var regPage = {
            mobileCode:"",
            init(){
                this.bindEvent()
            },
            bindEvent(){
                var that = this
                 $getCode.on("click",function(){
                     //获取验证码
                     //验证手机格式
                     if($user.val().length!=11){
                         alert("手机号格式不正确")
                         return 
                     }
                     var code = String(Math.random())
                     //console.log(code)
                     that.mobileCode = code.substr(2,4)
                     console.log(that.mobileCode)
                     
                 });
                 //注册
                 $regBtn.on("click",function(){
                     
                     ///手机验证
                    if($mobileCode.val()!=that.mobileCode){
                        alert("手机验证码错误")
                        return
                    }
                      ///手机验证
                    if($password.val()!=$rPassword.val()){
                        alert("两次输入的密码不一致")
                        return
                    }

                    //注册请求
                    $.post(fnBase.baseUrl+"/user/reg",{
                        username:$user.val(),
                        password:$password.val(),
                        mobileCode:$mobileCode.val()
                    },function(data){
                        //注册回调
                        console.log(data)
                        if(data.msgCode==1){
                            window.location.href="login.html"
                        }else{
                            alert("注册失败")
                        }
                    })
                 }) 
            }
        }

        regPage.init()
    })
})
