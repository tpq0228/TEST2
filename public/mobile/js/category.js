$(function () {
    getFirstData(function (data) {
        //渲染页面
        //使用模板引擎
        //console.log(data);
        var firstHtml=template("first",data);
        $(".cate_left ul").html(firstHtml);

        var categoryId= $(".cate_left ul").find("a").attr("data-id");
        // console.log(categoryId);
        getSecondData({id:categoryId},function (data) {
            $(".cate_right ul").html(template("second",data));
        })
    });
});
var getFirstData=function(callback){
    //获取后台数据
    $.ajax({
        url:"/category/queryTopCategory",
        type:"get",
        dataType:"json",
        success:function (data) {
            callback&&callback(data)
        }
    })
};
var getSecondData=function(id,callback){
    //获取后台数据
    $.ajax({
        url:"/category/querySecondCategory",
        type:"get",
        data:id,
        dataType:"json",
        success:function (data) {
            //console.log(data);
            callback&&callback(data)
        }
    })
};

/*点击一级分类对应的去渲染二级分类*/
$(".cate_left").on('tap',"a",function () {
    var categoryId= $(this).attr("data-id");

    if($(this).parent().hasClass("now")) return;

    $(".cate_left li").removeClass("now");
    $(this).parent().addClass("now");

    getSecondData({id:categoryId},function (data) {
        $(".cate_right ul").html(template("second",data));
    })
})