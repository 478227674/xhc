var chatWsUrl = 'ws://push.taiqiedu.com:7272', // WebSocket URL(不可更改)
    chatApiUrl = 'http://push.taiqiedu.com/yuanru/consult/'; // chat API数据接口URL前缀(不可更改)

var ws = null, //WebSocket对象
    reconnect = 0, //重连次数
    client_id = '', //即时通讯 client_id（全局惟一，每次连接成功后均不一样）
    client_user = '', //当前用户名（用于与client_id绑定）
    chat_id = '', // 座席商家id，统一分配
    chat_token = '', // 座席商家认证token，接口获取
    chat_user = '', // 座席用户
    productInfo = null, //当前商品信息
    offilneTipsData = null,
    page = 0, //历史记录分页页码,初始值必须为0
    limit = 20, //分页每页记录数，建议设为20及以上
    record_start = 0, //开始记录，用于分页
    isEnd = false, //历史记录全部加载完成
    canSubmit = false, //是否可以提交
    avatar_client_user = "../../image/chat/user.png", //当前用户头像(按需更换)
    avatar_chat_user = "../../image/chat/logo-chat.png", //商家头像(按需更换)
    last_datetime = '', //上一条记录的发送时间
    isOnline = 0, //自己的接口返回的是否在线
    chat_source = ''; //消息来源 index为首页 否则为机构或产品
apiready = function() {
    api.parseTapmode();
    alert(JSON.stringify(api.pageParam.link))
    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
    +
    + 1、以下系统分配的参数可由商品页传参或自定义API方式获取
    +
    ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
    //获取到机构对应的聊天的ID chat_id chat_user 客服ID
    chat_source = api.pageParam.chat_source || 'index';
    chat_id = api.pageParam.chat_id;//'191101000001'; // 座席商家id，统一分配，联系管理员获取
    chat_user = api.pageParam.chat_user;//'taiyuan001'; // 座席用户，统一分配，联系管理员获取
    client_user = api.pageParam.client_user;//'13800138000'; //用户（任意字符，用于座席聀天时显示以区分用户，尽可能用惟一值）
    chat_token = api.pageParam.chat_token;//'asdfhasdfjhasdkjhfkasdjhsk'; //商家安全认证token，正式版只能由server访问专用接口获取，设计版为任意字符串
    isOnline = api.pageParam.isOnline || 0;
    if(chat_source == 'product'){
        var obj = {
            id:api.pageParam.id, //商品ID,
            img:api.pageParam.img,//商品图片
            intro:api.pageParam.intro, //商品简介
            price:'￥'+api.pageParam.price,//商品价格
            link:api.pageParam.link
        }
        productInfo = JSON.stringify(obj); // 自定义商品信息数据
        // '{"id": 123,"img": "http://www.qikao.net/uploadfiles/packageImg/2018/03/2018_03_22_1521682527436157.jpg","intro": "2019太奇专硕提前面试精品课程","price": "¥499","link": "http://www.qikao.net/generalize/sourcePackagezgt.jsp?sp_id=211"}'
    }
    offilneTipsData = [{
        "content": "您好！工作人员当前不在线，我们咨询服务工作时间为周一至五晚6点至10点，节假日早8点至10点。您可以给我们发送留言消息，我们收到后将及时给您回复！谢谢您的理解！",
        "content_types": "tips"
    }]; // 自定义离线消息，固定格式，

    loadData.init(); //初始化，应在参数全部获取正确后执行
}


/**
 * [pageEvents 页面事件及方法]
 * @type {Object}
 */
var pageEvents = {
    // 内容是否为空（不允许提交仅空格、仅回车换行无其它内容的空内容）
    isEmpty: function(str) {
        if (str != null) {
            str = str.replace(/&nbsp;/g, '');
            str = str.replace(/<br>/g, '');
            str = str.replace(/<div><\/div>/g, '');
            str = str.trim();
            if (str.length > 0) {
                return false;
            } else {
                return true;
            }
        }
    },
    // 内容过滤替换
    strReplace: function(str) {
        //替换连续换行
        str = str.replace(/<div><br><\/div><div><br><\/div>/g, '<div><br></div>');
        str = str.replace(/<div><br><\/div>/g, '<br>');
        str = str.replace(/<br><br>/g, '<br>');
        str = str.replace(/<\/div><br>/g, '</div>');
        return str;
    },
    // 表情打开与关闭
    bindEmoji: function() {
        $('.chat-emoji-container').toggle();
        $('.icon-emoticon-smile').toggleClass('ext-color-blue');

        chatRender.scroll(); //聊天内容滚动到页底
    },
    // 表情点击
    bindEmojiClick: function(el) {
        var _this = el;
        $('#send-editor').html($('#send-editor').html() + $(_this).html());
        pageEvents.resetRange('send-editor'); //重定位光标
    },
    //发送图片
    bindImage: function() {
        api.actionSheet({
            buttons: ['拍照', '相册选取']
        }, function(ret, err) {
            var sourceType = null;
            if (ret.buttonIndex == 1) {
                sourceType = 'camera';
            } else if (ret.buttonIndex == 2) {
                sourceType = 'library';
            } else {
                return;
            }

            /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
            +
            + 2、需增加“相机”、“相册”访问权限判断
            + 如果是拍照考虑增加图片裁剪功能
            + 需增加自增加图片上传功能，chat不提供图片上传接口，chat内容只接收/发送字符串内容
            +
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            api.getPicture({
                sourceType: sourceType,
                allowEdit: true, //是否可以选择图片后进行编辑，支持iOS及部分安卓手机
                saveToPhotoAlbum: false,
                targetWidth: 800 //压缩后的图片宽度，图片会按比例适配此宽度
            }, function(ret, err) {
                if (ret && ret.data) {
                    var src = ret.data;
                    // 如果是拍照增加图片裁剪功能
                    // 执行图片上传……
                    // …………………………………………
                    // 当前模拟为加载固定的演示的远程图片
                    api.alert({
                        msg: '演示版，不论选择任何图片，将只加载固定远程图片',
                    }, function(ret, err) {
                        if (ret) {
                            funWs.sendMessage('http://cdn.hgznedu.com/hgznedu_topic/promotion/images19/img_012.png', 'pic'); //发送消息
                        }
                    });
                } else {
                    api.toast({
                        msg: '获取图片失败！'
                    });

                }
            });


        });
    },
    // 内容输入
    contentInputEvent: function() {
        $('#send-editor').on('input', function(e) {
            var content = $('#send-editor').html(); //获取提交的内容
            if (pageEvents.isEmpty(content)) {
                canSubmit = false;
                $('.submit-icon').removeClass('ext-color-blue');
            } else {
                canSubmit = true;
                $('.submit-icon').removeClass('ext-color-blue').addClass('ext-color-blue');
            }

            chatRender.scroll(); //聊天内容滚动到页底

        });
    },
    // 内容提交
    bindSubmit: function() {
        var content = $('#send-editor').html(); //获取提交的内容

        if (funWs.isConnected) { // ws网络通讯正常
            if (!pageEvents.isEmpty(content)) {
                content = pageEvents.strReplace(content); //内容过滤替换
                // 清除输入框内容
                $('#send-editor').html('');
                $('.submit-icon').removeClass('ext-color-blue');

                // 表情若已打开，则收起
                if ($('.icon-emoticon-smile').hasClass('ext-color-blue')) {
                    $('.chat-emoji-container').toggle();
                    $('.icon-emoticon-smile').toggleClass('ext-color-blue');
                }

                chatRender.scroll(); //聊天内容滚动到页底

                funWs.sendMessage(content, 'msg'); //发送消息
            } else {
                api.toast({
                    msg: '消息内容不可为空！'
                });
            }
        } else { // ws网络通讯异常
            api.toast({
                msg: '网络异常，发送失败！'
            });
        }


    },
    // 重定位光标
    resetRange: function(elid) {
        var obj = document.getElementById(elid);
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
    },
    // 回车提交（备用，当前未启用）
    sendByEnter: function() {
        $('#send-editor').keydown(function(e) {
            var content = $('#send-editor').html(); //获取提交的内容
            var keyNum = window.event ? e.keyCode : e.which;
            if (keyNum == '13') {
                e.preventDefault(); //阻止enter默认事件
                if (!pageEvents.isEmpty(content)) {
                    chatRender.bindSubmit();
                }
            }
        });
    },
    // 查看上传的图片
    bindContentImageView: function(el) {
        var _this = el,
            param = {
                "numbers": false,
                "images": [$(_this).attr('src')]
            };
        openWin('imageview', '../imageview/', '', param); //独立窗口查看图片
    },
    // 产品链接
    bindProduct: function(el) {

        api.closeWin();
        return;
        /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
        +
        + 3、当前UI为在webview中打开一个页面，
        + APP正式版中，应该为openWin至产品对应介绍页，
        + 对应渲染模板及方法需同步修改
        +
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        var _this = el;
        var url = $(_this).data('url');
        var browser = api.require('webBrowser');
        browser.open({
            url: url
        });
    },
    //其它监听事件（下拉、右划等）
    listenerEvents: function() {

        // 右划：阻止ios右划退出
        api.addEventListener({
            name: 'swiperight'
        }, function(ret, err) {
            // 阻止ios右划退出
        });

        // 分页加载历史记录方式式1：下划
        // 此方式加载效果有点生硬，但不会带动底部输入框
        api.addEventListener({
            name: 'swipedown'
        }, function(ret, err) {
            if ($('#content-history').offset().top < 15) {
                $('#load-history-tips').show();
                if (isEnd) {
                    $('#load-history-tips').html('<span class="ext-color-red">系统只保留最多20天内的记录！暂无更多！</span>');
                } else {
                    loadData.loadHistoryRecord(); // 加载历史聊天记录
                    $('#load-history-tips').html('<img src="../../image/loading_more.gif">数据加载中…');
                }

                setTimeout(function() {
                    $('#load-history-tips').hide();
                }, 1000);

            }
        });

        // 分页加载历史记录方式式2：使用下拉刷新组件
        // 此方式加载动态效果较好，但会带动底部输入框上下跳动
        // api.setRefreshHeaderInfo({
        //     bgColor: '#ccc',
        //     textColor: '#fff',
        //     textDown: '更多记录...',
        //     textUp: '加载更多...'
        // }, function(ret, err) {
        //     if (!isEnd) {
        //         api.toast({
        //             msg: '系统只保留最多20天内的记录！',
        //             location: 'top'
        //         });
        //     } else {
        //         loadData.loadHistoryRecord(); // 加载历史聊天记录
        //     }
        //     api.refreshHeaderLoadDone();
        // });
    }
};


/**
 * [chatRender 页面渲染]
 * @type {Object}
 */
var chatRender = {
    // 表情模板渲染
    emoji: function() {
        api.ajax({
            url: chatApiUrl + 'getEmoji',
            method: 'post',
            data: {},
            headers: {}
        }, function(ret, err) {
            if (ret) {
                if (ret.code == 0) {
                    var tpl = $('#dot-template-emoji').text();
                    var tempFn = doT.template(tpl);
                    $('#emoji-items').html(tempFn(ret.data)); // 模板渲染
                }
            }
        });
    },
    // 对数据中的日期格式化
    dataMoment: function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].content_types == 'product') {
                data[i].content = JSON.parse(data[i].content); //格式化 product，字符串转对象
            }

            /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
            +
            + 4、日期显示格式化，若要更复杂显示，请自行修改
            +
            ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
            if (i == 0) {
                data[i].showtime = moment(data[i].datetime).format('YYYY年M月D日 H:m');
            } else {
                // 与前一记录是同一天
                if (moment(data[i].datetime).format('YYYYMD') == moment(data[i - 1].datetime).format('YYYYMD')) {
                    var timesDiff = moment(data[i].datetime).diff(moment(data[i - 1].datetime), 'minutes') // 返回分钟差
                    if (timesDiff > 3) {
                        data[i].showtime = moment(data[i].datetime).format('H:m');
                    }
                } else {
                    data[i].showtime = moment(data[i].datetime).format('YYYY年M月D日 H:m');
                }
            }
        }
        return data;
    },

    // 消息模板渲染
    message: function(data) {
        // 模板渲染
        var tpl = $('#dot-template-chat').text();
        var tempFn = doT.template(tpl);
        $('#content-placeholder').before(tempFn(data)); //追加数据

        chatRender.scroll(); //聊天内容滚动到页底
    },
    // 历史消息模板渲染
    messageHistoryRecord: function(data) {
        // 模板渲染
        var tpl = $('#dot-template-chat').text();
        var tempFn = doT.template(tpl);
        $('#content-history').after(tempFn(data)); //追加数据
    },
    //聊天内容滚动到页底
    scroll: function() {
        $('#content-placeholder').css('height', $('.chat-footer').height()); //重置点位域高度
        setTimeout(function() {
            window.scrollTo(0, document.body.scrollHeight);
        }, 200);
    }

};

/**
 * [funWs 即时通讯]
 * @type {Object}
 */
var funWs = {
    // 建立连接
    connect: function() {
        // 判断是否支持 WebSocket 协议
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        if (!window.WebSocket) { // 检测浏览器支持
            api.alert({
                msg: '您的手机不支持本功能！'
            }, function(ret, err) {
                api.closeWin();
            });
            return;
        }
        // 建立连接
        ws = new WebSocket(chatWsUrl);
        // 消息接收与发送
        ws.onmessage = funWs.onmessage;
        ws.onclose = function() {
            ++reconnect;
            if (reconnect < 60) {
                setTimeout(function() {
                    funWs.connect(); // 重连60次，间隔0.5秒
                }, 500);
            } else {
                ws.close();
            }

            api.toast({
                msg: '网络连接已断开！'
            });

        };

        ws.onerror = function(e) {
            api.toast({
                msg: '网络通讯失败！'
            });
        };
    },
    // 客户端接收通讯服务端（WebSocket）数据时事件(事件类型type为固定参数，不得更改)
    onmessage: function(e) {
        var data = JSON.parse(e.data);
        switch (data.type) {
            case 'init': // 与通讯服务端连接正常，返回client_id，不得删除
                /*
                 与通讯服务端一旦建立完连接后，通讯服务端将自动发送给当前客户端以下数据
                 data = {'type':'init','client_id': 'xxxxxxx'}
                 client_id为服务端分配的一个全局唯一的20个字符的字符串，用于标识用户，每次连接成功后均不一样
                 */
                client_id = data.client_id;

                funWs.bindUser(); //执行用户绑定
                break;

            case 'ping': // 发送心跳，维持连接，不得删除
                ws.send('{"type":"pong"}');
                break;

            case 'push': // 收到ws推送的消息，不得删除
                /*
                 data = {"type":"push","data":[{"vendor":xxx,"sender":"xxx","receiver":"xxx","content":"xxx","content_types":"xxx","datetime":"xxx","remark":"xxx"}]}
                 */

                if (chat_user == data.data[0].sender || chat_user == data.data[0].receiver) {
                    // 若当前聊天对象与消息发送者或接收者相同，直接渲染聊天内容
                    if (data.data[0].content_types == 'product') {
                        data.data[0].content = JSON.parse(data.data[0].content); //格式化 product，字符串转对象
                    }

                    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    +
                    + 5、日期显示格式化，若要更复杂显示，请自行修改
                    +
                    ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                    var content_datetime = data.data[0].datetime; //当前消息的时间
                    if (last_datetime == '') {
                        data.data[0].showtime = moment(content_datetime).format('YYYY年M月D日 H:m');
                    } else {
                        // 日期显示格式化，若要更复杂显示，请自行修改
                        if (moment(content_datetime).format('YYYYMD') == moment(last_datetime).format('YYYYMD')) {
                            var timesDiff = moment(content_datetime).diff(moment(last_datetime), 'minutes') // 返回分钟差
                            if (timesDiff > 3) {
                                data.data[0].showtime = moment(content_datetime).format('H:m');
                            }
                        } else {
                            data.data[0].showtime = moment(content_datetime).format('YYYY年M月D日 H:m');
                        }
                    }
                    last_datetime = content_datetime;

                    chatRender.message(data.data); //渲染接收到的数据
                } else {
                    // 若不同，且发送者不是当前用户，则存储收到的消息数量
                    if (data.data[0].sender != client_user) {
                      /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
                      +
                      + 6、本地存储其它商家发送的记录数，然后按需调用
                      + 此处略过，请自行按需处理
                      +
                      ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                    }
                }


                break;
        }
    },
    // ws连接是否能正常通讯
    isConnected: function() {
        if (!ws && ws.readyState == 1) {
            return true;
        } else {
            return false;
        }
    },
    // client_id 与用户绑定（用户必须全局惟一）
    bindUser: function() {
        api.ajax({
            url: chatApiUrl + 'bindUserWithClient', //chat接口，执行将用户与client_id与用户绑定
            method: 'post',
            data: {
                values: {
                    client_id: client_id, // 客户端ID
                    client_user: client_user, // 客户用户
                    chat_id: chat_id, // 座席商家id，统一分配
                    chat_token: chat_token, // 座席商家认证token，接口获取
                    chat_user: chat_user, // 座席用户
                }
            }
        }, function(ret, err) {
            if (ret) {
                if (ret.code == 0) {
                  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
                  +
                  + 7、此处预留了一个返回数据：
                  + "newMessage": [{"vendor":xxx,"new":xxx},{"vendor":yyy,"new":yyy}]
                  + 所有商家发送给当前用户的未阅离线消息数量
                  + 若需要在单独的“消息”栏，列表显示所有商家发过来的未阅消息数，可使用此返回数据
                  +
                  ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                    loadData.loadHistoryRecord(); //用户绑定成功后加载历史聊天记录
                } else {
                    // 获取数据失败
                    api.toast({
                        msg: ret.msg
                    });
                }
            } else {
                networkMsg.err('网络错误，请稍后重试！'); // 网络错误
            }
        });

    },
    // 发送消息，content及type均为自定义
    sendMessage: function(content, type) {
        api.ajax({
            url: chatApiUrl + 'sendMessageToUser', //chat接口，发送信息
            method: 'post',
            data: {
                values: {
                    client_id: client_id, // 客户端ID
                    client_user: client_user, // 客户用户
                    chat_id: chat_id, // 座席商家id，统一分配
                    chat_token: chat_token, // 座席商家认证token，接口获取
                    chat_user: chat_user, // 座席用户
                    content: content, //消息内容
                    type: type, //消息类型（自定义，并自解析）
                    remark: '', //预留自定义内容字段
                }
            }
        }, function(ret, err) {
            if (ret) {

                // 接口收到数据后，会自动入库及转发，无需接收返回数据
            } else {
                networkMsg.err('网络错误，请稍后重试！'); // 网络错误
            }
        });

    },
    // 主动断开连接
    closeConnect: function() {
        api.ajax({
            url: chatApiUrl + 'closeClientConnect', //chat接口，发送信息
            method: 'post',
            data: {
                values: {
                    client_id: client_id, // 客户端ID
                    client_user: client_user, // 客户用户
                    chat_id: chat_id, // 座席商家id，统一分配
                    chat_token: chat_token, // 座席商家认证token，接口获取
                    chat_user: chat_user, // 座席用户
                }
            }
        }, function(ret, err) {
            //无需接收返回
        });
    }

}

var loadData = {
    // 初始化
    init: function() {
        funWs.connect(); // 建立 WebSocket 连接，必须在UI渲染前执行
        chatRender.emoji(); //加载表情
        chatRender.scroll(); //聊天内容滚动到页底
        pageEvents.contentInputEvent(); //内容输入事件监听

        pageEvents.listenerEvents(); //其它监听事件（下拉、右划等）
    },
    // 加载历史聊天记录
    loadHistoryRecord: function() {
        api.ajax({
            url: chatApiUrl + 'getHistoryRecord', //chat接口，获取历史记录
            method: 'post',
            data: {
                values: {
                    client_id: client_id, // 客户端ID
                    client_user: client_user, // 客户用户
                    chat_id: chat_id, // 座席商家id，统一分配
                    chat_token: chat_token, // 座席商家认证token，接口获取
                    chat_user: chat_user, // 座席用户
                    page: page, //记录页数
                    limit: limit, //分页每页记录数
                    record_start: record_start
                }
            }
        }, function(ret, err) {
            if (ret) {
                if (ret.code == 0) {
                    if (ret.data.length > 0) {
                        if (page < 1) {
                            record_start = ret.data[0].id; //起始记录(只在第一次获取历史记录数据时获取并重赋值)
                            last_datetime = ret.data[ret.data.length - 1].datetime; //取最后一条记录的时间

                            chatRender.message(chatRender.dataMoment(ret.data)); //渲染历史记录
                        } else {
                            chatRender.messageHistoryRecord(chatRender.dataMoment(ret.data)); //渲染分页历史记录
                        }
                    } else {
                        isEnd = true;
                    }

                    /*++++++++++++++++++++++++++++++++++++++++++++++++++++++
                    +
                    + 8、以下可按需确定是否需要调整
                    +
                    ++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
                    if (page == 0) {
                        // 座席是否在线
                        if (isOnline==1) { // 在线
                            // 可按需决定是否将商品信息发送给商家
                            //此处需要判断来源 首页进来不需要发送商品信息
                            if(chat_source == 'product'){
                                funWs.sendMessage(productInfo, 'product'); //发送消息
                            }
                        } else { // 不在线
                            // 发送自定义的提示信息，提示信息建议只在本地渲染，无需发送给商家
                            chatRender.message(offilneTipsData);
                        }
                    }

                    page++; //page自加1

                } else {
                    // 获取数据失败
                    api.toast({
                        msg: ret.msg
                    });
                }
            } else {
                networkMsg.err('网络错误，请稍后重试！'); // 网络错误
            }
        });
    }
};

var networkMsg = {
    // 网络错误
    err: function(msg) {
        api.alert({
            msg: msg,
        }, function(ret, err) {
            api.closeWin();
        });
    }
};
