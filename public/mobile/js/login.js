require(["config"],function(){
    require(["jquery","fnBase"],function($,fnBase){
 
        var $loginBtn = $(".login-btn");
        var $user = $(".username");
        var $password = $(".password");
       


        var loginPage = {
           
            init(){
                this.bindEvent()
            },
            bindEvent(){
                var that = this
              $loginBtn.on("click",function(){
                  //前端验证
                  var username = $user.val();
                  var password = $password.val()
                  if(!username||!password){
                      alert("用户名和密码不能你为空")
                      return 
                  }
                  //如果出错三次，会有图像验证码，验证
                  //正则验证
                  $.post(fnBase.baseUrl+"/user/login",{username,password},function(data){
                    console.log(data)
                    if(data.msgCode==1){
                        document.cookie = "uid="+data.userInfo.uid;
                        window.location.href ="list.html"
                    }
                  },"json")

              })
            }
        }

        loginPage.init()
    })
})
