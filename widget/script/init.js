//======================系统初始化（开始）=============================
function systemInit(callBack){
    initDb(function (ret, err) {
        if (ret.status) {
            initFs(function (ret) {
                //alert(JSON.stringify(ret))
                if (ret.status || ret.exist) {
                    //判断是否第一次打开
                    initShowGuide(function () {
                    });
                } else {
                    api.alert({msg: "无法建立本地文件夹"});
                }
            });
        } else {
            api.alert({msg: "数据库加载错误:" + JSON.stringify(err)});
        }
    });
}

var callbackMethod;
function initShowGuide(callback){
    //判断是否第一次打开
    var showGuide = $api.getStorage(isShowGuide);
    if (!showGuide || isTest) {
       callbackMethod = callback;
       openFrame('guide','./html/guide/guide.html',{},0,0);
    } else {
       callback();
    }
    callback();
}
function runCallback(){
    if(callbackMethod){
        callbackMethod();
    }
}

function initUser(callback){
    var user = getUserInfo();
    if(isCleanUser == true){
        user = null;
    }
    if (isBlack(user)) {
        getVisitor(function () {
            callback();
        });
    }else {
        callback();
    }
}

function initSystemInfo(callBack){
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '系统初始化中...',
        modal: true
    });
    api.hideProgress();
    callBack();

}
function _initSystemInfo(callback){
    ajaxGet(getOneAndTwoAreaIdUrl,{},function(reuslt,err) {
        if (isNotBlack(reuslt) && reuslt.success) {
            var ret = reuslt.data;

        }else{
            toast(ret.msg)
        }
    })
}


function createCityJson(cityList,callback){
    var jsonCity = {};
    jsonCity.citys = [];

    for (var i = 0; i < cityList.length; i++) {
        if(cityList[i].name == "长沙"){
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id,pinyin:'changsha'});
        }else if(cityList[i].name == "长春"){
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id,pinyin:'changchun'});
        }else if(cityList[i].name == "长治"){
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id,pinyin:'changzhi'});
        }else if(cityList[i].name == "重庆"){
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id,pinyin:'chongqing'});
        }else if(cityList[i].name == "厦门"){
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id,pinyin:'xiamen'});
        }
        else {
            jsonCity.citys.push({city: cityList[i].name, id: cityList[i].id});
        }
    }
    var cityJSON = jsonCity;
    $api.setStorage("cityTypes",cityJSON);
    //把城市数据写入index页面
    var fs = api.require('fs');
    fs.remove({
        path: path_shopCity
    }, function (ret, err) {
        fs.createFile({
            path: path_shopCity
        }, function (ret, err) {
            if (ret.status) {
                fs.open({
                    path: path_shopCity,
                    flags: 'read_write'
                }, function (ret, err) {
                    if (ret.status && ret.fd) {
                        var fd = ret.fd;
                        fs.write({
                            fd: fd,
                            data: JSON.stringify(cityJSON),
                            offset: 0
                        }, function (ret, err) {
                            fs.close({
                                fd: fd
                            }, function (ret, err) {
                            });
                        });
                    }
                });
            }
        });
    });
    if(callback()){
        callback();
    }
}
function ajax(url,data,sync,dataType,callback,err){
    if(isBlack(url)){
        alert('你没有传url');
        return;
    }
    data = data || {};

    $.ajax({
        url:url,
        type:"post",
        async:sync,
        data:data,
        dataType:"json",
        success:function(data){
            if(data || data ==0){
                if(isFunction(callback)){
                    callback(data);
                }
            }else {
                if(isFunction(err)){
                    err();
                }else{
                    alert('当前网络不给力');
                }
            }
        },
        error:function(){
            if(isFunction(err)){
                err();
            }else{
                alert('当前网络不给力');
            }
        }
    })
}

function getVisitor(callback){
    api.ajax({
        url: loginVisitorUrl,
        method: 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Accept-Encoding": "gzip",
            "version" : version,
            "type" :   1
        },
        data: {}
    }, function (ret, err) {
        if(isNotBlack(ret) && ret.token){
         //   alert(JSON.stringify(ret));
            setUserInfo(ret);
            callback();
        }else{
            api.confirm({
                title: '当前网络或服务有问题',
                msg: '是否重试？',
                buttons:['确定', '取消']
            },function(ret,err){
                if(ret.buttonIndex == 1){
                    getVisitor(callback);
                }else{
                    closeApp();
                }
            });
        }
    });
}






//======================系统初始化（结束）=============================





//======================下方tab栏目切换（开始）=============================

var prevPid;//上一个tab
var curPid;//当前tab
var frameArr = [];//打开的列表
//各个栏目


//点击切换tab标签
function openTab(type) {

    if (!type) {
        return;
    }
    if ( type == 'main' || type == "message") {
        var isCheck = checkUserLogin('./html/login/login.html');
        if(!isCheck){
            return;
        }
    }
    if(type == 'main'){
        api.execScript({
            name:'root',
            frameName:"main",
            script:"reloadMain()"
        })
    }

    //切换样式
    var header = $api.dom('#header2 .active');//对应头部的样式
    $api.removeCls(header, 'active');
    var thisHeader = $api.dom('#header2 .' + type);
    $api.addCls(thisHeader, 'active');
    var actTab = $api.dom('#nav .active');//对应底部的样式
    $api.removeCls(actTab, 'active');
    var thisTab = $api.dom('#nav .' + type);
    thisTab = thisTab.parentNode;
    $api.addCls(thisTab, 'active');


    //record page id
    prevPid = curPid;
    curPid = type;


    if (prevPid != curPid) {
        if (isOpened(type)) {
            //打开已经打开过的页面
            if (tabs[type].isGroup) {
                api.setFrameGroupAttr({
                    name: type,
                    hidden: false
                });
            } else {
                api.setFrameAttr({
                    name: type,
                    hidden: false
                });
            }

        } else {
            //打开新页面
            if (tabs[type].isGroup) {
                api.openFrameGroup(tabs[type].group, function (ret, err) {
                    tabs[type].groupCallBack(ret);
                });
            } else {
                api.openFrame(tabs[type].frame);
            }
            frameArr.push(type);
        }

        if (prevPid) {
            //关闭前一个页面
            if (tabs[prevPid].isGroup) {
                api.setFrameGroupAttr({
                    name: prevPid,
                    hidden: true
                });
            } else {
                api.setFrameAttr({
                    name: prevPid,
                    hidden: true
                });
            }
        }
    }
};


//是否打开过
function isOpened(frmName) {
    var i = 0, len = frameArr.length;
    for (i; i < len; i++) {
        if (frameArr[i] == frmName) {
            return true;
        }
    }
    return false;
}


//======================下方tab栏目切换（结束）=============================

