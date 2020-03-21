$(function () {
    // console.log(LT.getParmas().productId);
    var productId = LT.getParmas().productId;
    getProductData({id: productId}, function (data) {
        //console.log(data);
        $(".lt_search").html(template("product", data));

        //初始化轮播图
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
        });
        //1尺码选择
        $(".btn_size").on("tap", function () {
            $(this).addClass("now").siblings().removeClass("now")
        })
        //2.数量的选择
        $(".drade_num span").on("tap", function () {
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
        //3.加入购物车
        $(".drade_join").on('tap', function () {
            //校验数据
            var $size = $('.btn_size.now');
            //console.log(size);
            if (!$size.length) {
                mui.toast("请选择尺码");
                return false;
            }
            //数量
            var num = $(".drade_num input").val();
            if (num <= 0) {
                mui.toast("请选择数量");
                return false;
            }

            //提交数据
            LT.loginAjax({
                url: "/cart/addCart",
                type: "post",
                data: {
                    productId: productId,
                    size: $('.btn_size.now').html(),
                    num: num
                },
                success: function (data) {
                    console.log(data);
                    if (data.success == true) {
                        //跳转到登陆界面，把当前的地址传到登录页面，登录后按照这个地址返回到对应的页面
                        //location.href="/mobile/user/login.html"
                        var btnArray = ['是', '否'];
                        mui.confirm('添加成功去购物车看看', 'Hello MUI', btnArray, function(e) {
                            if (e.index == 0) {
                                //跳转到购物车
                                location.href='./user/shoppingCart.html'
                            } else {

                            }
                        })


                    }
                    if (data.success == true) {
                        console.log("登陆成功");
                    }
                }
            })


        })
    });
});

mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false
});

//封装获取数据
function getProductData(id, callback) {
    $.ajax({
        url: "/product/queryProductDetail",
        type: "get",
        data: id,
        dataType: "json",
        success: function (data) {
            callback && callback(data)
        }
    })
};





























