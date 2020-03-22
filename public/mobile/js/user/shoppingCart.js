$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators:false,
    });

    //1.初始化页面 自动下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {
                    var _this=this;
                        setTimeout(function () {
                            getCartData(function (data) {
                                console.log(data);
                                $(".mui-table-view").html(template("cart",{list:data}))
                                _this.endPulldownToRefresh();
                            })
                        },200)
                }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
        }
    });

    //2.刷新页面
    $(".fa-refresh").on("tap",function () {
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    })

    //3.点击删除
    $(".mui-table-view").on("tap",".mui-btn-red",function () {
        var id=$(this).attr("data-id");
        var $that=this;
        mui.confirm('您确定要删除吗？', '商品删除',['是', '否'], function(e) {
            if (e.index == 0) {
                //调接口 删数据库对应的数据 删除页面当前数据
                LT.loginAjax({
                    url:"/cart/deleteCart",
                    type:"get",
                    data:{
                        id:id
                    },
                    dataType:"json",
                    success:function (data) {
                        if(data.success==true){
                            $($that).parent().parent().remove()
                            getPrice();
                        }
                    }
                })
            } else {
                // console.log($($that).parent().parent()[0]);
                mui.swipeoutClose($($that).parent().parent()[0])
            }
        })
    })

    //4.编辑
    $(".mui-table-view").on("tap",".mui-btn-blue",function (){
        var id=$(this).attr("data-id");
        var $that=this;
        var $li=$(this).parent().parent();
        //获取所有自定义的属性
        // console.log(this.dataset);
        var html=template("edit",this.dataset)
        // console.log(html);
        mui.confirm(html.replace(/\n/g,""), '编辑商品',['是', '否'], function(e) {
            if (e.index == 0) {
                var size=$(".btn_size.now").html();
                var num=$(".p_number input").val();
                LT.loginAjax({
                    url:"/cart/updateCart",
                    type:"post",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:"json",
                    success:function (data) {
                        if(data.success==true){//后台修改成功
                            //前端渲染
                            $li.find(".number").html(num+"双");
                            $li.find(".size").html(size);
                            $li.find("input").attr("data-num",num);
                            getPrice();
                            mui.swipeoutClose($($that).parent().parent()[0])
                        }
                    }
                })
            } else {
                // console.log($($that).parent().parent()[0]);
                mui.swipeoutClose($($that).parent().parent()[0])
            }
        })
    })
    //1.尺码2.数量3.加入购物车
    $("body").on("tap",".btn_size",function () {
        $(this).addClass("now").siblings().removeClass("now")
    })
    //2.数量的选择
    $("body").on("tap",".p_number span",function () {
        //获取input值
        var num=parseInt($(this).siblings("input").val());
        //获取库存值
        // console.log(num);
        var max=parseInt($(this).siblings("input").attr("data-max"))
        // console.log(max);
        if($(this).hasClass("jian")){
            if(num==0){
                mui.toast('该商品数量只能是正整数');
                return false;
            }
            num--;
        }else{
            if(num>=max){
                setTimeout(function () {
                    mui.toast('该商品的库存不足');
                },200)
                return false;
            }
            num++;
        }
        $(this).siblings("input").val(num)
    })


    //计算价格
    $(".mui-table-view").on("change",'[type="checkbox"]',function () {
        getPrice()
    });


    //封装计算总价的函数
    function getPrice(){
        var $checkBox=$("[type=\"checkbox\"]:checked");
        var total=0;
        $checkBox.each(function (index,item) {
            var num=$(this).attr("data-num");
            var price=$(this).attr("data-price");
            total+=num*price;
        })
        total=total.toFixed(2);
        $("#cartAmount").html(total);
    }
    function getCartData(callback) {
        LT.loginAjax({
            url:"/cart/queryCart",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                callback&&callback(data)
            }
        })
    }

})