
$(function () {
    //点击确认按钮 获取数据并校验
    $(".mui-btn-primary").on("tap",function () {
        //serialize获取表单的序列化数据，必须要有name属性以及form表单标签
        // console.log($("#form").serialize());
        //前台验证
        var dataObj=LT.strObj($("#form").serialize());
        // console.log(dataObj);
        if(!dataObj.username){
            mui.toast("请输入用户名");
            return false;
        }
        if(!dataObj.password){
            mui.toast("请输入密码");
            return false;
        }

        //后台验证
        $.ajax({
            url:"/user/login",
            type:"post",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (data,e) {
                // console.log(data);
                if(data.success==true){
                        location.href="index.html"
                }else if(data.error==403){
                    //提示用户
                    mui.toast(data.message)
                }
            }
        })

    })
})















