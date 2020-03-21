$(function () {
    //点击确认按钮    获取数据并效验
    $(".mui-btn-primary").on("tap", function () {

        //serialize()获取表单序列化的数据 必要有form表单标签 必须要有name名
        //console.log($("#form").serialize());username=333&password=3333

        //前台验证
        var dataObj = LT.strObj($("#form").serialize());
        //console.log(dataObj);
        if(!dataObj.username){
            mui.toast("请输入用户名");
            return false;
        }
        if(!dataObj.password){
            mui.toast("请输入密码");
            return false;
        }

        //itcast  111111 正确用户名密码
        //后台验证
        $.ajax({
            url:"/user/login",
            type:"post",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (data,e) {
                if(data.success==true){
                    //获取传过来的地址  再跳回去
                    var returnUrl = location.search.replace("?returnURL=","");
                    //console.log(returnUrl);
                    if(returnUrl){
                        location.href=returnUrl;
                        //阻止默认事件
                        e.preventDefault();
                    }else {
                        location.href="./index.html";
                    }
                }else if(data.error==403){
                    //将后台返回来的错误信息提示用户
                    mui.toast(data.message)
                }else {
                    location.href
                }
            }

        })
    })
})