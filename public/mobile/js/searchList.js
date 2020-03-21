mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false
});
/*
1.进入搜索页面，关键字显示在搜索框里
2.页面初始化完成之后，更具关键字显示的对应的商品，显示4条
3.点击当前的页面的搜索根据关键字重新渲染页面
4.点击排序 根据排序的选项重新进行排序，可以选中的时候默认是升序 再点击就是降序
5.上拉页面的时候刷新
6.下拉页面的时候加载下一页，没有数据的时候要提醒用户
*/

//http://localhost:3366/mobile/searchList.html?key=1


window.page = 1;
//1.进入搜索页面，关键字显示在搜索框里
//console.log(LT.getParmas().key);
var inputKey = LT.getParmas().key;
$(".search_input").val(inputKey);

//2.页面初始化完成之后，更具关键字显示的对应的商品，显示4条
// getListData({
//     proName:LT.getParmas().key,
//     page:1,
//     pageSize:4
// },function (data) {
//     //console.log(data);
//     $("#product_box").html(template("list",data));
// });

//3.点击当前的页面的搜索根据关键字重新渲染页面
$(".search_btn").on("tap",function () {
    //console.log(111);
    var key = $.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    getListData({
        proName: key,
        page:1,
        pageSize:4
    },function (data) {
        $("#product_box").html(template("list",data));
    });
    // $(".mui-scroll .exercise a").removeClass("now").find("span").removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
    // $(".mui-scroll .exercise a:nth-child(1)").addClass("now");

    //点击触发下拉刷新效果
    mui("#refreshContainer").pullRefresh().pulldownLoading();
})

//4.点击排序 根据排序的选项重新进行排序，可以选中的时候默认是升序 再点击就是降序
$(".mui-scroll .exercise a").on("tap",function () {
    //改变now的样式 箭头的方向
    if($(this).hasClass("now")){
        var arrow = $(this).find("span");
        if(arrow.hasClass("mui-icon-arrowdown")){
            arrow.removeClass("mui-icon-arrowdown").addClass("mui-icon-arrowup");
        }else {
            arrow.removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
        }
    }else {
        //给当前添加now，其他删除class
        $(this).addClass("now").siblings().removeClass("now").find("span").removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
    }

    /*通过自定的属性拿到对应的数据*/
    var type = $(this).attr("data-type");
    //console.log(type);
    //根据箭头判断到底是升序还是降序
    var value = $(this).find("span").hasClass("mui-icon-arrowup")?2:1;
    //重新渲染页面
    var key = $.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    var obj ={
        proName: key,
        page:window.page,
        pageSize:4
    };
    obj[type]=value;
    getListData(obj,function (data) {
        $("#product_box").html(template("list",data));
    });
})

mui.init({
    pullRefresh : {
        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        //5.下拉刷新
        down : {
            //style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
            auto: true,//可选,默认false.首次加载自动上拉刷新一次
            callback :function(){
                var _this = this;
                var key = $.trim($(".search_input").val());
                if(!key){
                    mui.toast("请输入关键字");
                    _this.endPulldownToRefresh();
                    //结束刷新
                    return false;
                }
                getListData({
                    proName: key,
                    page:1,
                    pageSize:4
                },function (data) {
                    //延迟1秒刷新
                    setTimeout(function () {
                        //排序列表按钮回到默认状态
                        $(".mui-scroll .exercise a").removeClass("now").find("span").removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
                        $(".mui-scroll .exercise a:nth-child(1)").addClass("now");
                        //下拉刷新之后不再显示当前的搜索内容  显示所有的商品
                        $("#product_box").html(template("list",data));
                        //数据渲染结束之后停止刷新
                        _this.endPulldownToRefresh();
                        //重置上拉加载
                        _this.refresh(true);
                    },1000);
                });
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        //5.上拉加载
        up : {
            callback :function () {
                window.page++;
                var _this = this;
                /*通过自定的属性拿到对应的数据*/
                var type = $(this).attr("data-type");
                //console.log(type);
                //根据箭头判断到底是升序还是降序
                var value = $(this).find("span").hasClass("mui-icon-arrowup")? 2 : 1;

                //重新渲染页面
                var key = $.trim($(".search_input").val());
                if(!key){
                    mui.toast("请输入关键字");
                    return false;
                }
                var obj ={
                    proName: key,
                    page:window.page,
                    pageSize:4
                };
                obj[type]=value;
                getListData(obj,function (data) {
                    setTimeout(function () {
                        $("#product_box").append(template("list",data));
                        if(data.data.length>0){
                            _this.endPullupToRefresh();
                        }else {
                            //数据渲染结束之后停止刷新
                            _this.endPullupToRefresh(true);
                        }
                    },1000)
                });
            }
        }
    }
});
//封装获取数据
function getListData(parmas,callback) {
    $.ajax({
        url:"/product/queryProduct",
        type:"get",
        data: parmas,
        dataType:"json",
        success:function (data) {
            callback&&callback(data)
        }
    })
}

