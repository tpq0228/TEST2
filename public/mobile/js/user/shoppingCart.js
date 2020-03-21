$(function () {
    //1.初始化下拉刷新
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback: function () {
                    var _this = this;
                    setTimeout(function () {
                        getCartData(function (data) {
                            $(".mui-table-view").html(template("cart", {list: data}));
                            //数据渲染后停止刷新
                            _this.endPulldownToRefresh();
                        });
                    })
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    //2.刷新页面
    $(".fa-refresh").on("tap", function () {
        mui("#refreshContainer").pullRefresh().pulldownLoading();
    })

    //3.点击删除
    $(".mui-table-view").on("tap", ".mui-btn-red", function () {
        var id = $(this).attr("data-id");
        var $that = $(this);
        mui.confirm("请确定要删除吗?", "商品删除", ["是", "否"], function (e) {
            //console.log(e);
            if (e.index == 0) {
                //调接口 删数据对应的数据 删除页面当前数据
                LT.loginAjax({
                    url: "/cart/deleteCart",
                    type: "get",
                    data: {
                        id: id
                    },
                    dataType: "json",
                    success: function (data) {
                        //console.log(data);
                        if (data.success == true) {
                            $that.parent().parent().remove();
                            getPrice();
                        }
                    }
                })
            } else {
                /*mui.swipeoutClose(js对象)*/
                mui.swipeoutClose($that.parent().parent()[0]);
            }
        });
    })

    //4.编辑
    $(".mui-table-view").on("tap", ".mui-btn-blue", function () {

        var id = $(this).attr("data-id");
        var $size = $(this).attr("data-size");
        var $that = $(this);

        var $li = $(this).parent().parent();
        //获取所有的自定义属性
        //console.log(this.dataset);
        var html = template("edit", this.dataset);
        //console.log(html);
        mui.confirm(html.replace(/\n/g, ""), "编辑商品", ["是", "否"], function (e) {
            //console.log(e);
            if (e.index == 0) {
                var size = $(".btn_size.now").html();
                var num = $(".drade_num input").val();
                //console.log(num,size);
                LT.loginAjax({
                    url: "/cart/updateCart",
                    type: "post",
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data.success == true) {//后台修改成功
                            //前台页面渲染
                            //console.log($li);
                            $li.find(".number").html("x"+num);
                            $li.find(".size").html("鞋码:"+ size);
                            $li.find("input").attr("data-num",num);
                            getPrice();
                            mui.swipeoutClose($that.parent().parent()[0]);

                        }
                    }
                })


            } else {
                /!*mui.swipeoutClose(js对象)*!/
                mui.swipeoutClose($that.parent().parent()[0]);
            }
        });
    });
    //4.1尺码选择
    $("body").on("tap", ".btn_size", function () {
        $(this).addClass("now").siblings().removeClass("now")
    })
    //4.2.数量的选择
    $("body").on("tap", ".drade_num span", function () {
        //获取input框中的值
        var num = $(this).siblings("input").val();
        //console.log(num);
        //获取库存值
        var max = parseInt($(this).siblings("input").attr("data-max"));
        if ($(this).hasClass("jian")) {
            if (num == 0) {
                mui.toast("该商品的数量只能是正整数");
                return false;
            }
            num--;
        } else {
            if (num >= max) {
                setTimeout(function () {
                    mui.toast("该商品库存不足");
                }, 200);
                return false;
            }
            num++;
        }
        //赋值
        $(this).siblings("input").val(num);
    })

    //5.计算价格
    $(".mui-table-view").on("change","[type='checkbox']",function () {
        getPrice();
    });
    //封装计算总价的函数
    function getPrice() {
        var $checkBox=$("[type='\checkbox']:checked");
        //console.log($checkBox);
        var total = 0;
        $checkBox.each(function (index,item) {
            var num =($(this).attr("data-num"));
            var price =$(this).attr("data-price");
            console.log(num);
            console.log(price);
            total += num*price;
        });
        total = total.toFixed(2);
        $("#cartAmount").html(total);
    }



    function getCartData(callback) {
        LT.loginAjax({
            url: "/cart/queryCart",
            type: "get",
            data: "",
            dataType: "json",
            success: function (data) {
                //console.log(data);
                callback && callback(data);
            }
        })
    }
})

mui('.lt_content').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false, //是否显示滚动条
});


/*
vpclub*/
