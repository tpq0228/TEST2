window.LT = {};

LT.getParmas = function () {
    //1.获取问号后面的内容   由于中文会乱码 解码decodeURI
    var search =  decodeURI(location.search);
    if(search){
        search = search.replace("?","");
        //console.log(search);
        var arr = search.split("&");
        //console.log(arr);
        var parmas = {};
        arr.forEach(function (item,index) {
            var newArr = item.split("=");
            parmas[newArr[0]]=newArr[1];
        })
        //console.log(parmas);
        return parmas;
    }
};

LT.loginAjax = function (obj) {
    $.ajax({
        url: obj.url||"#",
        type:obj.type||"get",
        data:obj.data||"",
        dataType:obj.dataType||"json",
        success:function (data) {
            if(data.error===400){


                location.href="/mobile/user/login.html?returnURL="+location.href;
                return false
            }else{
                obj.success&&obj.success(data);
            }
        }
    })
}

LT.strObj = function (str) {
    var obj = {};
    if(str){
        var arr = str.split("&");
        arr.forEach(function (item,index) {
            var newArr = item.split("=");
            obj[newArr[0]]=newArr[1];
        });
        return obj;
    }
}



