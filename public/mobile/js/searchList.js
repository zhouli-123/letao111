mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators:false
});

window.page=1;

console.log(LT.getParmas().key);
var inputKey=LT.getParmas().key;
$(".search_input").val(inputKey);


// getListData({
//     proName:LT.getParmas().key,
//     page:1,
//     pageSize:4
// },function (data) {
//     $("#product_box").html(template("list",data));
// });



//3.
$(".search_btn").on("tap",function () {
    var key=$.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    getListData({
        proName:key,
        page:1,
        pageSize:4
    },function (data) {
        $("#product_box").html(template("list",data));
    })
})


//4.
$(".lt_order a").on("tap",function () {
    if($(this).hasClass("now")){
        var arrow=$(this).find("span");
        if(arrow.hasClass("fa-angle-down")){
            arrow.removeClass("fa-angle-down").addClass("fa-angle-up")
        }else{
            arrow.removeClass("fa-angle-up").addClass("fa-angle-down")
        }
    }else{
        $(this).addClass("now").siblings().removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }

    var type=$(this).attr("data-type");
    var value=$(this).find("span").hasClass("fa-angle-down")?1:2;
    //重新渲染
    var key=$.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    var obj={
        proName:key,
        page:1,
        pageSize:4
    };
    obj[type]=value;
    getListData(obj,function (data) {
        $("#product_box").html(template("list",data));
    })

})




function getListData(parmas,callback) {
    $.ajax({
        url:"/product/queryProduct",
        type:"get",
        data:parmas,
        dataType:"json",
        success:function (data) {
            callback&&callback(data);
        }

    })
}
//下啦
mui.init({
    pullRefresh : {
        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down : {
            style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
            auto: true,//可选,默认false.首次加载自动上拉刷新一次
            callback :function () {
                var key=$.trim($(".search_input").val());
                if(!key){
                    mui.toast("请输入关键字");
                    return false;
                }
                var _this=this;
                getListData({
                    proName:key,
                    page:1,
                    pageSize:4
                },function (data) {
                    setTimeout(function () {
                        //排序列表按钮全部恢复默认状态
                        $(".lt_order a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");
                        $(".lt_order a:first-child").addClass("now");
                        $("#product_box").html(template("list",data));
                        _this.endPulldownToRefresh();

                        //重置上拉加载
                        _this.refresh(true);
                    },1000)

                })

            }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        //上拉加载
        up : {
            callback :function () {
                window.page++;
                var _this=this;
                var type=$(this).attr("data-type");
                var value=$(this).find("span").hasClass("fa-angle-down")?1:2;
                //重新渲染
                var key=$.trim($(".search_input").val());
                if(!key){
                    mui.toast("请输入关键字");
                    return false;
                }
                var obj={
                    proName:key,
                    page:1,
                    pageSize:4
                };
                obj[type]=value;
                getListData(obj,function (data) {
                    setTimeout(function () {
                        $("#product_box").append(template("list",data));
                        if(data.data.length){
                            _this.endPullupToRefresh();
                        }else{
                            _this.endPullupToRefresh(true);
                        }
                    },1000)
                })
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
    }
});