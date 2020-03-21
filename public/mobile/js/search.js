$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });
    //1.根据已有的历史记录去渲染记录
    var historyList=getHistory();
    // console.log(historyList);

    //渲染
    $(".lt_history").html(template("history",{list:historyList}));

    //2.点击添加历史记录 跳转到搜索列表
    $(".search_btn").on("tap",function () {
        //console.log(11);
        //获取用户输入的信息
        var key=$(".search_input").val();
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }

        //优化1 如果有相同记录 删除相同的数据的那一条
        $(historyList).each(function (index,itme){
            if(itme==key){
                historyList.splice(index,1)
            }
        });

        //优化2 如果超过10条 删除最早的记录
        if(historyList.length>=10){
            historyList.shift();
        }
        //存
        //1.1 存数组
        historyList.push(key);
        //1.2 存localStorage
        localStorage.setItem("lt_history",JSON.stringify(historyList));
        //跳转
        location.href = "searchList.html?key="+key;


        $(".lt_history").html(template("history",{list:historyList}));

        $(".search_input").val("");
        //
    });

    //点击删除的
    $(".lt_history").on("tap",".close",function () {
        var index=$(this).attr("data-index");
        historyList.splice(index,1);
        localStorage.setItem("lt_history",JSON.stringify(historyList));
        $(".lt_history").html(template("history",{list:historyList}));
    });

    //点击清空
    $(".lt_history").on("tap",".fa-trash",function () {
        historyList=[];
        localStorage.setItem("lt_history",JSON.stringify(historyList));
        $(".lt_history").html(template("history",{list:historyList}));
    });

    //获取数据
    function getHistory() {
        // 预设一个key 储存的数据是json格式的字符串
        var str=localStorage.getItem("lt_history")||"[]";
        //将字符串转换成json格式的对象
        var obj=JSON.parse(str);
        return obj;
    }
});