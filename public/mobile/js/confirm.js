require(['config'],function(){
    require(['jquery','fnBase'],function($,fnBase){

        var $adsInfo = $(".ads-info");
        var $orderList = $(".order-list")
        var $totalPrice = $(".total-price")
        var $totalNumber = $(".total-number");
        var $submitBtn = $("#submit-btn");

        //需要的参数
        var uid = fnBase.getUserId();
        var ids = fnBase.getQueryData("ids");
        var ads_id,total_sum,  order_pids,order_numbers; 
        order_pids = order_numbers = ""
        //order_pids:订单里面的商品ids    ( "1,4,6"  )
        //order_numbers:订单里面每一个商品的数量numbers("2,2,2")
        var confirmPage = {
            init(){
               this.getConfirmData()
               this.bindEvent()
            },
            getConfirmData(){
                //ids
                //uid
                $.get(fnBase.baseUrl+"/order/getConfirmData",{uid,ids},function(data){
                    console.log(data)
                    if(data.msgCode==1){
                        var adsInfo = data.adsInfo[0]
                        ads_id = adsInfo.ads_id  //收货地址id
                        $adsInfo.html(` <p>
                            用户 ${adsInfo.ads_name}：  <span>${adsInfo.mobile}</span>
                        </p>
                        <p> ${adsInfo.detail}</p>`);

                        var str = "";
                        var totalPirce = 0;
                        var totalNumber = 0
                        data.orderData.forEach((ele,index)=>{
                            str+=` <li class="order-item">
                                <img src="${ele.img_url}" alt="">
                                <div class="info">
                                    <p>${ele.p_name}</p>
                                    <p>单价:${ele.price}</p>
                                </div>
                                <p class="nubmer">数量：${ele.number}</p>
                            </li>`;
                            totalNumber+= ele.number*1
                            totalPirce+=ele.price*ele.number
                            order_pids+=(index?",":"")+ele.pid; //拼接pid
                            order_numbers+=(index?",":"")+ele.number //拼接数量
                            
                        })
                        $orderList.html(str)
                        $totalPrice.text(totalPirce);
                        $totalNumber.text(totalNumber)
                        total_sum = totalPirce //总金额
                    }
                })
            },
            bindEvent(){
                $submitBtn.on("click",function(){
                    var params = {uid,ads_id,ids,order_pids,total_sum,order_numbers}
                    console.log(params)
                    $.post(fnBase.baseUrl+"/order/submitOrder",params,function(data){
                        console.log(data)
                        if(data.msgCode==1){
                            window.location.href="order.html"
                        }
                    })
                })
            }
        }
        confirmPage.init();
        //20171102113920
    })
})