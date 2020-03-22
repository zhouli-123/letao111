
$(function () {
    console.log(LT.getParmas());
    var id=LT.getParmas().productID;


    getProductData(id,function (data) {
        $(".mui-scroll").html(template('productTpl',{model:data}));
        mui('.mui-slider').slider({
            interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
        });
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators:false,
        });

        //1.尺码2.数量3.加入购物车
        $(".btn_size").on("tap",function () {
            $(this).addClass("now").siblings().removeClass("now")
        })
        //2.数量的选择
        $(".p_number span").on("tap",function () {
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
        //3.加入购物车
        $(".btn_addCart").on("tap",function () {
            //校验数据
            var $size=$(".btn_size.now");
            if(!$size.length){
                mui.toast('请选择尺码');
                return false;
            }
            //数量的校验
            var num=$(".p_number input").val();
            if(num==0){
                mui.toast('请选择数量');
                return false;
            }


            //提交数据
            LT.loginAjax({
                url:"/cart/addCart",
                type:"post",
                data:{
                    productId:id,
                    size:$(".btn_size.now").html(),
                    num:num
                },
                success:function (data) {
                    // console.log(data);
                    if(data.error==400){
                        //跳转登录页面，把当前地址传入登录页面，登录后按照改地址返回页面
                        // location.href="/mobile/user/register.html"
                    }
                    if(data.success==true){
                        var btnArray = ['是', '否'];
                        mui.confirm('添加成功去购物车看看？', '温馨提示', btnArray, function(e) {
                            if (e.index == 0) {
                                //跳转到购物车页面
                                location.href='./user/shoppingCart.html';
                            } else {
                                //
                            }
                        })
                    }
                }
            })
        })
    })
})
var getProductData=function (productId,callback) {
    $.ajax({
        type:'get',
        url:'/product/queryProductDetail',
        data:{id:productId},
        dataType:'json',
        success:function (data) {
            console.log(data);
            callback&&callback(data)
        },

    })
}



