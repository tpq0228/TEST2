$(function () {
/*
* 1.初始化3级联动，点击地址框，弹出城市选择列表
* 2.判断地址栏又没有传参  传参了就是修改地址  否则就是新增地址
* 3.点击确认，获取一系列的值 效验后提交后台 跳转到收货地址
*
* */




    //1.1 初始化3级联动，点击地址框，弹出城市选择列表
    //1.2 通过new mui.PopPicker 初始化
    var picker = new mui.PopPicker({
        //显示的列数
        layer:3
    });
    //1.3 之后给picker加数据 setData()支持数据格式为:数组
    picker.setData(cityData);

    //1.3 点击地址框 显示城市列表
    $(".address").on("tap",function () {
        picker.show(function (items) {

            if (items[0].text==items[1].text){
                items[0].text="";
            }
            $(".address").val(items[0].text+items[1].text+items[2].text)
        })
    })

    //2.判断地址栏又没有传参  传参了就是修改地址  否则就是新增地址
    // var addressId=LT.getParmas().addressId;
    var addressId=location.search;
    addressId=addressId&&addressId.split('=');
    addressId=addressId&&addressId[1];

    if (addressId){
        $(".lt_header h3").html("修改收货地址");
        getAddressData(function (data) {
            // console.log(data)
            var obj={};
            data.forEach(function (item) {
                if (item.id==addressId){
                    obj=item;
                }
            })
            $("[name=\"recipients\"]").val(obj.recipients);
            $("[name=\"postcode\"]").val(obj.postCode);
            $("[name=\"address\"]").val(obj.address);
            $("[name=\"addressDetail\"]").val(obj.addressDetail);

        })

    }else {
        $(".lt_header h3").html("添加收货地址");
    }

    //3.点击确认，获取一系列的值 效验后提交后台 跳转到收货地址
    $(".btn_register").on("tap",function () {
        var str=decodeURI($("form").serialize());
        var data=LT.strObj(str);
        // console.log(data);
        if(!data.recipients) return mui.toast("请输入用户名");
        if(!data.postcode) return mui.toast("请输入邮政编码");
        if(!data.address) return mui.toast("请输入省/市/区");
        if(!data.addressDetail) return mui.toast("请输入详细地址");

        var myUrl="/address/addAddress";
        var tip="添加"
        
        //addressId存在，意味着用户修改地址
        if (addressId){
            myUrl="/address/updateAddress";
            parmas.id=addressId;
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


function getAddressData(callback) {
    LT.loginAjax({
        url:"/address/queryAddress",
        type:"get",
        data:"",
        dataType:"json",
        success:function (data) {
            callback&&callback(data)
        }

    })
}

function editAddressData(editUrl,parmas,callback) {
    LT.loginAjax({
        url:editUrl,
        type:"post",
        data:parmas,
        dataType:"json",
        success:function (data) {
            callback&&callback(data)
        }

    })
}