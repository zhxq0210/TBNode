/**
 * Created by hasee on 2017/7/12.
 */
require(["config"],function () { //先加载配置
    //加载完配置以后，再加载配置里面 的模块
    require(["jquery"],function ($) {
       
       var $productList = $(".product-list"); //商品列表
       var $classList = $(".class-list"); //分类列表

       var listPage = {
           init(){
               //获取数据 （商品，分类数据）
               this.getProductData(0) //0代表默认数据
               this.getClassData()
               //绑定事件
               this.bindEvent()
           },
           getProductData(classID){
              
               $.get("http://localhost:3000/api/product/getListData",{classID:classID},function(data){
                    var str ='';
                    console.log(data)
                    data&&data.forEach(ele=>{
                        str+=`<li class="product-item">
                            <a href="detail.html?pid=${ele.pid}">
                                <img src="${ele.img_url}" alt="">
                                <p>${ele.p_name}</p>
                                <p>
                                    <span>
                                        价格:<em>￥${ele.price}</em>
                                    </span>
                                    <span>
                                        销量:${ele.seller_number}
                                    </span>
                                </p>
                            </a>
                        </li>`
                    })
                    $productList.html(str)
               },"json")
               
           },
           getClassData(){
               //http://datainfo.duapp.com/shopdata/getclass.php
               $.get("http://localhost:3000/api/class/getListData",function(data){
                    console.log(data)

                     var str ='';
                    data.forEach(ele=>{
                        str+=`<li data-id="${ele.class_id}">${ele.class_name}</li>`
                    })
                   
                    $classList.html(str)
                },"json")
               
           },
           bindEvent(){
               //jq事件委托
               var that = this;
               $classList.on("click","li",function(){
                    console.log($(this).attr("data-id"))
                    var classID = $(this).attr("data-id")//分类id
                    that.getProductData(classID) 
               })
           }
       }
       listPage.init()
    });
});


