require(["config"],function(){
    require(["jquery","fnBase","Swiper"],function(jquery,fnBase,Swiper){
        var $addCart = $(".add-cart")
        var pid = fnBase.getQueryData("pid")||1
        console.log(fnBase.getQueryData("number"))
        var $wrapper = $(".swiper-wrapper");
        var $desc = $(".desc")
        var detailPage = {
            init(){
                this.getDetailData()
                this.bindEvent()
            },
            getDetailData(){
                //pid 从哪来？ 列表页 == pi => 详情页
                $.get(fnBase.baseUrl+"/product/getDetailData",{pid:pid},function(data){
                    console.log(data)
                    var imgList = JSON.parse(data.img_list)
                    var sildeStr = "";
                    imgList.forEach(ele=>{
                        
                        var imgUrl = ele //ele默认是 图片的src
                        //判断 ele是不是对象，如果是对象就获取bigpath属性
                        if(typeof ele==="object"){
                           imgUrl =  ele.bigpath
                        }
                        sildeStr+=`<div class="swiper-slide">
                                    <img src="${imgUrl}" alt="">
                                </div>`
                    })
                    $wrapper.html(sildeStr)
                    $desc.html(data.desc)
                    //应为一开始没有图片，应该等获取到图片以后，再启动swiper
                    var mySwiper = new Swiper(".swiper-container",{
                        loop:true,
                        pagination: '.swiper-pagination'
                    })

                },"json")
            },
            bindEvent(){
                // "uid=16; clientid=c9c63151cb064f58b475b4e9fe3edd29_www; Hm_lvt_01a63d97e20ae495f99ac7e53b572d1b=1505880231; _ga=GA1.1.39102980.1508402374; _gid=GA1.1.1090853678.1509507003"
                var cookieArr  = document.cookie.split("; ");
                var uid ;
                cookieArr.forEach(ele=>{
                    var param = ele.split("=")
                    if(param[0]=="uid"){ //["uid",16]
                        uid= param[1]
                    }
                })
                $addCart.on("click",function(){
                    $.get(fnBase.baseUrl+"/cart/add",{pid,uid},function(data){
                        console.log(data)
                    })
                })
            }
        }
        detailPage.init()
    })
})