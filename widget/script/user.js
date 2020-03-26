
function loginWeibo(loginUrl,callback){
	var weibo = api.require('weibo');
	weibo.auth(function(authRet,err){
	    if(authRet.status) {
	      	weibo.getUserInfo({
			  token: authRet.token,
			  userId: authRet.userId
			},function(userInfoRet,err){
			    if (userInfoRet.status) {
			    		loginToOurServer(loginUrl,authRet.userId, 3, userInfoRet.userInfo, callback);
			    }else{
			    		api.toast({
		                msg: '获取用户信息失败:' + err.code
		            });
		            callback({status: false},err);
			    }
			});
	    } else {
	    	
//	    		weibo.cancelAuth(function(ret,err){
//			    if(ret.status){
//			        loginWeibo(loginUrl,callback);
//			    }else {
//			    		api.toast({
//		                msg: '授权失败:' + err.code
//		            });
//		            callback({status: false},err);
//			    }
//			});
	    	
            api.toast({
                msg: '授权失败:' + err.code
            });
            callback({status: false},err);
        }
	});
}

//公共的JS库文件
function loginWeibo_old(loginUrl,callback) {
    var sinaWeiBo = api.require('sinaWeiBo');
    sinaWeiBo.auth(function (ret, err) {
        //alert("ret:"+JSON.stringify(ret)+JSON.stringify(err));
        if (ret.status) {
            var token = ret.accessToken;
            var userId = ret.userID;
            sinaWeiBo.getUserInfo({
                token: token,
                uid: userId
            }, function (ret, err) {
                if (ret.status) {
                    loginToOurServer(loginUrl,userId, 3, ret.userInfo, callback);
                } else {
                    api.toast({
                        msg: err.msg
                    });
                    callback({status: false},err);

                }
            });
        } else {
            api.toast({
                msg: '授权失败' + err.msg
            });
            callback({status: false},err);

        }
    });
}

function loginWeixin(loginUrl,callback) {
	var wx = api.require('wx');
	wx.auth({}, function(ret, err){
	    if(ret.status){
	    		var code = ret.code;
			wx.getToken({
			    code: code
			},function(ret, err){ 
			    if(ret.status){
			        var accessToken = ret.accessToken;
			        var dynamicToken = ret.dynamicToken;
			        var openId = ret.openId;
			        
			        wx.getUserInfo({
					    accessToken: accessToken,
					    openId: openId
					}, function(ret,err){ 
					    if(ret.status){
							//获取用户信息成功
							loginToOurServer(loginUrl,ret.openid, 1, ret, callback);
					    }else{
					        if(err.code == 1){
//					        		//accessToken过期
					        		wx.refreshToken({
								    dynamicToken: dynamicToken
								},function(ret,err){
								    if(ret.status){
								        accessToken = ret.accessToken;
			        						dynamicToken = ret.dynamicToken;
			        						openId = ret.openId;
			        						
			        						wx.getUserInfo({
										    accessToken: accessToken,
										    openId: openId
										}, function(ret,err){ 
										    if(ret.status){
												//获取用户信息成功
												loginToOurServer(loginUrl,ret.openid, 1, ret, callback);
										    }else{
										    		api.toast({
									               msg: '读取用户信息出错:' + err.code
									            });
									            callback({status: false},err);
										    }
										});
								    }else{
								        api.toast({
							               msg: '刷新TOKEN出错:' + err.code
							            });
							            callback({status: false},err);
								    }
								});
					        }else {
					        		api.toast({
					               msg: '获取用户信息出错:' + err.code
					            });
					            callback({status: false},err);
					        }
					    }
					});
			    }else{
			        api.toast({
		               msg: '获取授权accessToken出错:' + err.code
		            });
		            callback({status: false},err);
			    }
			});
	    }else{
	        api.toast({
               msg: '登录授权出错:' + err.code
            });
            callback({status: false},err);
	    }
	});
}


function loginWeixin_old(loginUrl,callback) {
    var weiXin = api.require('weiXin');
    weiXin.registerApp(
        function (ret, err) {
            if (ret.status) {
                weiXin.auth(function (ret, err) {
                    if (ret.status) {
                        weiXin.getUserInfo(function (ret, err) {
                            if (ret.status&&isNotBlack(ret.openid)) {
                                loginToOurServer(loginUrl,ret.openid, 1, ret, callback);
                            } else {
                                weiXin.refreshToken(function(ret,err){
                                    if (ret.status) {
                                        weiXin.getUserInfo(function (ret, err) {
                                            if (ret.status && isNotBlack(ret.openid)) {
                                                loginToOurServer(loginUrl,ret.openid, 1, ret, callback);
                                            }else{
                                                api.toast({
                                                    msg: err.msg
                                                });
                                                callback({status: false},err);

                                            }
                                        });
                                    }else{
                                        api.toast({
                                            msg: err.msg
                                        });
                                        callback({status: false},err);

                                    }
                                });
                            }
                        });

                    } else {
                        api.toast({
                            msg: err.msg
                        });
                        callback({status: false},err);

                    }
                });


            } else {
                api.toast({
                    msg: err.msg
                });
                callback({status: false},err);

            }
        }
    );
}




function loginQQ(loginUrl,callback) {
    var qq = api.require('qq');
    qq.login(function (ret, err) {
        if (ret.status) {
            var token = ret.accessToken;
            var userId = ret.openId;
            qq.getUserInfo(function (ret, err) {
                if (ret.status) {
                    loginToOurServer(loginUrl,userId, 2, ret.info, callback);
                } else {
                    api.toast({
                        msg: err.msg
                    });
                }
            });
        } else {
            api.toast({
                msg: err.msg
            });
            callback({status: false},err);

        }
    });

}

//登陆和注册我们自己的服务器
function loginToOurServer(loginUrl,thirdId, thirdType, userInfo, callback) {
    var name = userInfo.nickname || userInfo.name;
    var icon = userInfo.headimgurl || userInfo.figureurl_qq_1 || userInfo.profile_image_url;
    var user = getUserInfo();
    var postData = {
        thirdId: thirdId,
        thirdType: thirdType,
        name: name,
        thirdInfo: JSON.stringify(userInfo),
        icon: icon,
        token : user.token
    };
    api.ajax({
    		headers: {
	    		"Accept-Encoding": "gzip",
	        "version" : version,
	        "type" :  1
	    },
        url: loginUrl,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        returnAll: false,
        data: {
            values: postData
        }
    }, function (ret, err) {
        if (ret) {
            var clientUser = ret;
            if (isBlack(clientUser) || isBlack(clientUser.token)) {
                callback({status: false});
            } else {
                //写入到磁盘
                var user = {};
				user = clientUser;
                $api.setStorage("userInfo",user);
                callback({status: true});
            }

        } else {
            api.toast({
                msg: '获取信息失败'
            });
            callback({status: false},err);

        }
    });
}



function setUserInfo(user){
	$api.setStorage("userInfo", user);
}

function getUserInfo() {
	return $api.getStorage("userInfo");
}

function checkUserLogin(url) {
	if(url == undefined){
		url = 'widget://html/login/login.html';
	}
	var user = getUserInfo();
	if(!user || !user.userId){
		openNewWindow('login',url,{});
		return false;
	}
    return true;
}

//注销用户
function deleteUser(){
//  $api.clearStorage();
	$api.rmStorage("userInfo");
}


function shareMessageToThird(sheetTitle,title,description,thumbLoaclUrl,thumbUrl,contentUrl,callBack){
//	buttons: ['分享到微信朋友圈','分享给微信好友','分享给QQ好友','分享到微博']
	
	if(!sheetTitle || sheetTitle.length == 0){
		sheetTitle = '分享';
	}
	
    title = html_decode(title);
    description=html_decode(description);
    api.actionSheet({
        title: sheetTitle,
        cancelTitle: '取消',
        buttons: ['分享到微信朋友圈','分享给微信好友','分享到QQ空间','分享给QQ好友','分享到微博']
    },function(ret,err){
        var index = ret.buttonIndex;
        if(index > 5){
        		return;
        }
        if(index == 1 || index == 2 || index == 5){
            if(isBlack(thumbLoaclUrl)&&isNotBlack(thumbUrl)){
                api.imageCache({
                    url: thumbUrl
                },function(ret,err){
                    if (ret && ret.status == true) {
                        shareMessage(index,title,description,ret.url,thumbUrl,contentUrl,callBack);
                    }else{
                        api.toast({msg:'分享失败'});
                    }
                });
            }else{
                shareMessage(index,title,description,thumbLoaclUrl,thumbUrl,contentUrl,callBack);
            }
        }else{
            shareMessage(index,title,description,thumbLoaclUrl,thumbUrl,contentUrl,callBack);
        }
    });
}

function shareMessage(index,title,description,thumbLoaclUrl,thumbUrl,contentUrl,callBack){
    if(index==1){
        var weiXin_f = api.require('wx');
        weiXin_f.shareWebpage({
            scene:'timeline',
            title:title,
            description:description,
            thumb:thumbLoaclUrl,
            contentUrl: contentUrl
        },function(ret,err){
            callBack(ret,err);
        });
    }else if(index==2){
        var weiXin = api.require('wx');
        weiXin.shareWebpage({
            scene:'session',
            title:title,
            description:description,
            thumb:thumbLoaclUrl,
            contentUrl: contentUrl
        },function(ret,err){
            callBack(ret,err);
        });
    }else if(index==3){
        var obj = api.require('qq');
        obj.shareNews({
            url:contentUrl,
            title:title,
            description:description,
            imgUrl:thumbUrl,
            type : 'QZone'
        },function(ret,err){
            callBack(ret,err);
        });
    } else if(index == 4) {
    		var obj = api.require('qq');
        obj.shareNews({
            url:contentUrl,
            title:title,
            description:description,
            imgUrl:thumbUrl,
            type : 'QFriend'
        },function(ret,err){
            callBack(ret,err);
        });
    } else if(index==5){
		var weibo = api.require('weibo');
		weibo.shareWebPage({
			text : title,
		    title: title,
		    description: description,
		    thumb: thumbLoaclUrl,
		    contentUrl: contentUrl
		},function(ret,err){
		    callBack(ret,err);
		});
    }
}


function shareMessageToOther(index,user,callBack){
    var message ={
        title:"快洁洗衣",
        description:"快洁洗衣服务平台提供：APP订单下达，快洁上门取件，自助送取洗衣。",
        thumbLocalUrl:"http://img2.imgtn.bdimg.com/it/u=412183673,4069198603&fm=21&gp=0.jpg",
        contentUrl:"http://www.baidu.com",
        thumb:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png',
        url:"http://v6.rabbitpre.com/m/6AYfaMYnb",
        imgUrl:"http://img2.imgtn.bdimg.com/it/u=412183673,4069198603&fm=21&gp=0.jpg",
    };
    if(index==1){
        var weiXin_f = api.require('wx');
        message.scene = 'timeline';
        weiXin_f.shareWebpage(message,function(ret,err){
            callBack(ret,err);
        });
    }else if(index==2){
        var weiXin = api.require('wx');
        message.scene = 'session';
        weiXin.shareWebpage(message,function(ret,err){
            callBack(ret,err);
        });
    }else if(index==3){
        var obj = api.require('qq');
        message.type = 'QZone';
        obj.shareNews(
            message,function(ret,err){
            callBack(ret,err);
        });
    } else if(index == 4) {
        var obj = api.require('qq');
        message.type = 'QFriend';
        obj.shareNews(message,function(ret,err){
            callBack(ret,err);
        });
    } else if(index==5){
        // var weibo = api.require('weibo');
        // weibo.shareText({
        //     text: '拍房网-这里包含所有优质房源！',
        // }, function(ret, err) {
        //     if (ret.status) {
        //         alert('分享文本内容成功');
        //     }
        //     alert(JSON.stringify(err))
        // });
        // var weibo = api.require('weibo');
        // // message.text = "kkkkkkk";
        // weibo.shareWebPage(message,function(ret,err){
        //     alert(JSON.stringify(ret))
        //     callBack(ret,err);
        // });
        // var weibo = api.require('weibo');
        // weibo.shareText({
        //     text: '这里是测试的内容',
        // }, function(ret, err) {
        //     if (ret.status) {
        //         //alert('分享文本内容成功');
        //     }
        // });
    }
}
function shareWebApp(type) {
    var user = getUserInfo();
    if(user.id){
        user.id = user.id;
    }else{
        user.id = 0;
    }
    //type timeline朋友圈 session聊天
    var wx = api.require('wx');
    wx.shareWebpage({
        apiKey: 'wxf113971130fb9357',
        scene: type,
        title: '【快洁洗衣】首单0元洗衣，送99元大礼包！',
        description: '注册就送大红包！！！',
        thumb:'widget://icon/aboutbg.png',
        contentUrl: 'http://share.chinakuaijie.com/' + '?uid=' + user.id
    }, function(ret, err) {
        if (ret.status) {
            toast('分享成功');
        } else {
            toast(err.code);
        }
    });
}
function shareQqFriends() {
    var user = getUserInfo();
    if(user.id){
        user.id = user.id;
    }else{
        user.id = 0;
    }
    var qq = api.require('qq');
    qq.shareNews({
        url:  'http://share.chinakuaijie.com/' + '?uid=' + user.id,
        title: '【快洁洗衣】首单0元洗衣，送99元大礼包！',
        description: '注册就送大红包！！！',
        imgUrl: 'https://oivkbuqoc.qnssl.com/2a3a78f0b39299ea85c22f583fe697377ba92de1?t=1501642702.4154766',
        type:'QFriend'
    },function (ret,err) {
        if(ret.success ==true){
            toast('分享成功');
        }
    });
}
function gotoLogin(){
    api.closeToWin({
        name: 'login',
        animation: {
            type: 'flip',
            subType: 'from_bottom',
            duration: 500
        }
    });
}