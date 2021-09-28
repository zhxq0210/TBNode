require(['config'],function(){
    require(['jquery','fnBase'],function($,fnBase){
        //获取需要的参数
        var uid = fnBase.getUserId(); 
        //获取dom
        var $orderContainer = $(".order-container");
        var $tabBar = $(".tab-bar");

        var OrderPage = {
            init(){
               this.getListData()
               this.bindEvent()
            },
            getListData(state){
                //获取订单数据    需要提供uid  ，订单在状态state
               $.get(fnBase.baseUrl+"/order/getListData",{uid,state},function(data){
                   console.log(data) //data.results =>[订单，订单，订单]
                   var orderStr = ""
                   //循环拼接订单的数据
                   data.results.forEach(order=>{
                       var productInfo = order.productInfo;
                       var proStr = ""
                       //productInfo [{pid:1,p_name:"xxx"},{pid:1,p_name:"xxx"}]
                       //循环拼接商品的数据
                       productInfo.forEach(pro=>{
                            proStr+=`<li class="order-item">
                                    <img src="${pro.img_url}" alt="">
                                    <div class="info">
                                        <p>${pro.p_name}</p>
                                        <p>单价:${pro.price}</p>
                                    </div>
                                    <p class="nubmer">数量：${pro.number}</p>
                                </li>`
                       })
                       //订单按钮

                       var btns = ""
                       if(order.state==1){
                           btns= ` <a href="javasript:;" data-id="${order.order_id}" class="order-btn pay-btn">支付</a>`
                       }else if(order.state==2){
                            btns= `<a href="javasript:;" class="order-btn">收货</a>`
                       }
                       //order 每一个订单信息
                       orderStr+=`<div class="order-section">
                            <div class="item-header">
                                订单编号:${order.order_num}
                            </div>
                            <ul class="order-list">
                                ${proStr}
                            </ul>
                            <div class="item-footer">
                                <span>订单合计:</span>
                                <span>总金额<em>${order.total_sum}</em></a>
                            </div>
                            <div class="item-footer">
                                <em>订单状态:${order.state==1?'未付款':'已付款'}</em>
                               <p>
                                ${btns}
                               </p>
                            </div>

                        </div>`
                   })
                   //把数据放到容器里面
                   $orderContainer.html(orderStr)

               })
            },
            bindEvent(){
                var that = this
                $tabBar.on("click","li",function(){
                    if($(this).hasClass("active")){
                        return 
                    }else{
                        $(this).addClass("active").siblings().removeClass("active");
                        that.getListData($(this).index())
                    }
                })
                $orderContainer.on("click",".pay-btn",function(){
                    var order_id = $(this).attr("data-id")
                    $.post(fnBase.baseUrl+"/order/pay",{uid,order_id},function(data){
                        if(data.msgCode==1){
                            alert("支付成功")
                            window.location.reload()
                        }else{

                        }
                    })
                })
            }
        }
        OrderPage.init();
        //20171102113920
    })
})