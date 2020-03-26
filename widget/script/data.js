function ajaxGet(url, getData, callBack,isload) {
    if(!isload){
        api.showProgress({
            title: '系统加载中',
            text: '请稍等...',
            modal: false
        });
    }

    var user = getUserInfo();
    if(!user){
        openRegister('login','widget://html/login/login.html',{})
        api.hideProgress();
        return;
    }
    getData.userId = user.userId;
    getData.token = user.token;
    api.ajax({
        url: url,
        method: 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Content-Type":"application/json",
            "Token":user.token
        },
        data: {
            body: JSON.stringify(getData)
        }
    }, function (ret, err) {
        if(ret){
            api.hideProgress();
            if(ret.code == 1){
                if(ret.msg == 401){
                    toast('登录信息超时，请重新登录')
                    $api.rmStorage('userInfo')
                    setTimeout(function () {
                        openRegister('login','widget://html/login/login.html',{})
                    },1000)
                    return;
                }else{
                    toast(ret.msg)
                    return;
                }

            }
            callBack(ret, err);
        }else{
            api.hideProgress();
            toast('网络出错，请稍候再试')
            callBack(ret, err);
        }
    });
}

function ajaxGetVistor(url, getData, callBack) {
    api.showProgress();
    api.ajax({
        url: url,
        method: 'post',
        timeout: 10,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Content-Type":"application/json",
        },
        data: {
            body: JSON.stringify(getData)
        }
    }, function (ret, err) {
        if(ret){
            api.hideProgress();
            if(ret.code == 1){
                toast(ret.msg)
                return;
            }
            callBack(ret, err);
        }else{
            api.hideProgress();
            toast('网络出错，请稍候再试')
            callBack(ret, err);
        }

    });
}
function ajaxGetWithProgress(url, getData , getType , callBack) {
	api.showProgress({});
	ajaxGet(url, getData, getType ,function(ret,err){
		callBack(ret, err);
		api.hideProgress();
	});
}

function uploadImageToServer(url,getData,callBack) {
    api.showProgress({});
    api.ajax({
        url: url,
        method: 'post',
        timeout: 60,
        dataType: 'json',
        returnAll: false,
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
        },
        data: {
            values:getData
        }
    }, function (ret, err) {
        if(ret){
            api.hideProgress();
            if(ret.code == 1){
                toast(ret.msg)
                return;
            }
            callBack(ret, err);
        }else{
            api.hideProgress();
            toast('网络出错，请稍候再试')
            callBack(ret, err);
        }

    });
}

