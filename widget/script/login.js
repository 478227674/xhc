    var sendFlag = true;

//初始化页面的时候，从本地内存获取验证码时间
function initSmsTime(){
    var lastSmsTime = $api.getStorage(Storage_Sms_Time);
    if(isNotBlack(lastSmsTime)){
        var now = new Date().getTime();
        if((now - lastSmsTime) < 120000){
            flag=false;
            setTime(Math.ceil(120 - ((now - lastSmsTime) / 1000)));
        }
    }
}


//发送验证码
function sms(){
    if(!sendFlag){
        return;
    }
    sendFlag = false;
    var tel = $api.byId('tel').value;
    if(!checkMobileNum(tel)){
        sendFlag = true;
        toast("手机号码不正确");
        return;
    }
    var url = getCodeUrl;
    ajaxGetRegister(url,{
        phone : tel
    },function(ret){
        if(ret && ret.success){
            toast('获取成功，请注意查收！')
            setTimeToCode();
            $api.setStorage(Storage_Sms_Time,new Date().getTime());
        } else {
            sendFlag = true;
            var errorMsg="请稍后重新获取验证码";
            if(ret&&ret.errorMessage){
                errorMsg=ret.msg;
            }
            api.toast({
                msg : errorMsg
            });

        }
    });
}
/***************验证码倒计时***************************/
function setTimeToCode(time){
    var code = document.getElementById('sms')||document.getElementById('yzm');
    code.style.backgroundColor = '#fff';
    time=time||120;
    code.innerHTML ="剩余"+ time+"s";
    var codeInterval =  setInterval(function(){
        if(time > 0){
            time--;
            code.innerHTML ="剩余"+time+"s";
        }else{
            code.style.backgroundColor = "#fff";
            code.innerHTML = "获取验证码";
            sendFlag = true;
            $api.rmStorage(Storage_Sms_Time);
            clearInterval(codeInterval);
        }
    },1000)
}

