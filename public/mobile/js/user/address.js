$(function () {
    //1.获取地址列表 渲染页面
    getAddressData(function (data) {
        //console.log(data);
        $(".mui-table-view").html(template("addressList",{list:data}));
    });

    //2.删除对应的数据
    $(".mui-table-view").on("tap",".mui-btn-red",function () {
        var id=$(this).attr("data-id");
        deleteAddressData({id:id},function (data) {
            console.log(data);
            if(data.success){
                //重新渲染页面
                getAddressData(function (data) {
                    $(".mui-table-view").html(template("addressList",{list:data}));
                })
            }
        })


    })













    function getAddressData(callback) {
        LT.loginAjax({
            url:"/address/queryAddress",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                callback&&callback(data);
            }
        });
    }
    function deleteAddressData(parmas,callback) {
        LT.loginAjax({
            url:"/address/deleteAddress",
            type:"post",
            data:parmas,
            dataType:"json",
            success:function (data) {
                callback&&callback(data);
            }
        });
    }


})








