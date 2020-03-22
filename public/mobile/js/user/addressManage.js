$(function () {
    /*
    * 1.初始化三级联动，点击地址框，弹出城市选择列表
    * 2.判断地址栏有没有传参 传参了就修改地址 否则就是新增地址
    * 3.点击确认，获取一系列的值 校验后提交后台 跳转到收货地址
    * */
    var picker=new mui.PopPicker({
        //显示的列数
        layer:3
    });
    //1.2之后给picker加数据
    picker.setData(cityData);

    //1.3点击地址框 显示城市列表
    $(".address").on("tap",function () {
        picker.show(function (items) {
            // console.log(items);
            if(items[0].text==items[1].text){
                items[0].text="";
            }
            $(".address").val(items[0].text+items[1].text+items[2].text)
        });
    })

    //2.判断地址栏有没有传参 传参了就修改地址 否则就是新增地址
    // console.log(LT.getParmas().addressId);

    var addressId = location.search;
    addressId = addressId && addressId.split('=');
    addressId = addressId && addressId[1];

    if(addressId){
        $(".lt_header h3").html("修改收货地址");
        getAddressData(function (data) {
            console.log(data);
            var obj={};
            data.forEach(function (item) {
                console.log(item);
                if(item.id==addressId){
                    obj=item;
                }
            });
            console.log(obj);
            $("[ name=\"recipients\"]").val(obj.recipients);
            $("[ name=\"postCode\"]").val(obj.postCode);
            $("[ name=\"address\"]").val(obj.address);
            $("[ name=\"addressDetail\"]").val(obj.addressDetail);
        })
    }else{
        $(".lt_header h3").html("添加收货地址");
    }
    //3.点击确认，获取一系列的值 校验后提交后台 跳转到收货地址
    $(".btn_register").on("tap",function () {
        console.log(decodeURI($("form").serialize()));
        var str=decodeURI($("form").serialize());
        var data=LT.strObj(str);
        console.log(data);
        //前端校验
        if(data.recipients=="") return mui.toast("请输入用户名");
        if(data.postcode=="") return mui.toast("请输入邮政编码");
        if(data.address=="") return mui.toast("请输入省市区");
        if(data.addressDetail=="") return mui.toast("请输入详细地址");

        var myUrl="/address/addAddress";
        var tip="添加";
        //addressId存在 意味着用户在修改地址
        if(addressId){
            myUrl="/address/updateAddress";
            data.id=addressId;
            tip:"修改";
        }
        editAddressData(myUrl,data,function (data) {
            mui.toast(tip+"成功");
            setTimeout(function () {
                location.href="address.html"
            },1000)

        })



    })

})


function getAddressData(callback){
    LT.loginAjax({
        url:"/address/queryAddress",
        type:"get",
        data:"",
        dataType:"json",
        success:function (data) {
            callback&&callback(data);
        }
    })
}

function editAddressData(editUrl,parmas,callback){
    LT.loginAjax({
        url:editUrl,
        type:"post",
        data:parmas,
        dataType:"json",
        success:function (data) {
            callback&&callback(data);
        }
    })
}