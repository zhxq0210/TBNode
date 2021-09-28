require(['config'],()=>{
    require(['jquery','fnBase'],function($,fnBase){
        var $cartList = $(".cart-list")
        var $toConfirm =   $(".to-confirm");
        var uid = fnBase.getUserId()
        var cartPage = {
            init(){
                this.getCartData()
                this.bindEvent()
            },
            getCartData(){
                //通过公用的方法获取 uid
                $.get(fnBase.baseUrl+"/cart/getListData",{uid},function(data){

                    console.log(data)
                    if(data.msgCode==0){
                        alert("请先登录")
                    }else{
                        var str = ''
                        data.cartData.forEach(ele=>{
                            str+=`<li class="item" data-id="${ele.cart_id}">
                                <img src="${ele.img_url}">
                                <div class="item-cont">
                                    <p class="item-name ovfl-ellipsis2">${ele.p_name}</p>
                                    <p class="item-price">￥${ele.price}</p>
                                    <div class="calc-num">
                                        <span>数量：</span>
                                        <button class="button min">-</button>
                                        <input type="text" class="item-num" value="${ele.number}" readonly="">
                                        <button class="button plus">+</button>
                                    </div>
                                </div>
                                <button class="item-delete iconfont">X</button>
                            </li>`
                        })
                        $cartList.html(str)
                    }
                },"json")
            },
            bindEvent(){
                //把所有按钮的事件都委托给list
                 $cartList.on("click","button",function(){
                    //无论点击谁，都需要找到 li 
                    var oLi = $(this).parents(".item")
                    var cart_id = oLi.attr("data-id"); //购物车id
                    var oItemNum = oLi.find(".item-num"); //数量的input
                    var number = oItemNum.val()*1 //数量
                    console.log(cart_id);
                    
                    if($(this).hasClass("min")){
                         console.log("-")
                         oItemNum.val(number-1)
                         //数据交互
                         $.post(fnBase.baseUrl+"/cart/changeNumber",
                         {cart_id,uid,number:number-1},
                         function(data){
                             console.log(data)
                         })
                    }else if($(this).hasClass("plus")){
                         console.log("+")
                         oItemNum.val(number+1)
                         //数据交互
                         $.post(fnBase.baseUrl+"/cart/changeNumber",
                         {cart_id,uid,number:number+1},
                         function(data){
                             console.log(data)
                         })
                    }else {
                         console.log("x")
                         oLi.remove()
                         //数据交互
                         $.post(fnBase.baseUrl+"/cart/removeItem",{cart_id,uid},function(data){
                             console.log(data)
                         })
                         
                    }
                    //差统计（自己想办法）
                 })
                 $toConfirm.on("click",function(){
                     //获取一下当前 需要提交的购物车信息的  id
                     var ids =""
                     $cartList.find(".item").each(function(index){
                        ids=ids+(index?",":"")+$(this).attr("data-id")
                     })
                     console.log(ids)
                     window.location.href="confirm.html?ids="+ids
                 })
               
            }
        }

        cartPage.init()
    })
})