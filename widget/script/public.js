﻿var version = "0.10.0";
var rootWindowName="root";
var isTest = false;
var isCleanUser = false;
var falga = false;
var companyTel = '400400400';
var UNIT_TYPE_ID = localStorage.getItem('UNIT_TYPE_ID') || ''; //最新单元ID和name
var UNIT_TYPE_NAME = localStorage.getItem('UNIT_TYPE_NAME') || ''; //最新单元ID和name
var WORD_TYPE_ID = localStorage.getItem('WORD_TYPE_ID') || ''; //当前记词归类
var WORD_TYPE_NAME = localStorage.getItem('WORD_TYPE_NAME') || ''; //当前记词归类
// 订单类型 1普通订单 2拼团订单 3砍价订单 4砍价拼团订单
//
//isCleanUser = true;
rootWindowName = "cjn";
// var serverUrl = "http://192.168.1.42:8080"; //局域网
var serverUrl = 'http://qk.taiqiedu.com/tqshoop/app';
// var serverUrl = "http://192.168.1.191:8082";//服务器
var shareUrl = 'http://qk.taiqiedu.com/h5/html/';//分享链接
var chatShareUrl = 'http://www.zz1819.com/pczzw/index.html#/pages/';//聊天时发送给客服的商品链接
var uploadImageUrl = serverUrl + "/common/upload"; //图片上传地址
//imageType 1机构 2产品 3外联 4优惠产品

//登录注册
var getCodeUrl = serverUrl + '/common/sendSmsCode';// 获取验证码 userPhone inviteCode type 1注册 2登录 3修改手机号 4修改密码 7提现
var signUrl = serverUrl + '/user/registUser';//注册接口 userPhone inviteCode code
var loginUrl = serverUrl + '/user/userLogin';//登录 loginType 1密码 2验证码 code userPhone userPwd
//首页
var searchResultUrl = serverUrl + '/home/search';//首页搜索 key
var indexTypeListUrl = serverUrl + '/common/queryProductSort';//首页产品分类列表
var indexBannerUrl = serverUrl + '/home/queryCycleImageList';//首页轮播图
var getIndexPushUrl = serverUrl + '/home/queryAppPush';//获取首页推送广告
var getIndexHotClassesUrl = serverUrl + '/home/queryProductPromoteList';//获取首页热门课程
var getDetailHotClassesUrl = serverUrl + '/product/queryProductRecomList';//获取推荐产品
var getIndexHotOrgansUrl = serverUrl + '/home/queryOrgPromoteList';//获取首页热门机构
var getProductListByTypeIdUrl = serverUrl + '/home/queryProductBySortId';//根据类型获取产品列表 sortId
var getAllProductListUrl = serverUrl + '/product/queryAllProductList';//获取所有的上品  分页
var getMyLocationUrl = serverUrl + '/home/queryCityIdByCityName';//获取用户当前修改的地区  provinceName  cityName
var setMyLocationUrl = serverUrl + '/home/updateUserRegion';//更新所在位置 userId cityId
var getIndexNewsListUrl = serverUrl + '/home/queryOrgMessageDynamicList';//获取首页消息动态
var getPutongProductListUrl = serverUrl + '/product/getProductList';//获取普通课程  筛选
var getPitpong2Url = serverUrl + '/product/queryProductTeachList'
var getThreeSortListUrl = serverUrl +'/product/getProductSortListByLevel';//获取三级项目列表

var getGroupProductListUrl = serverUrl + '/home/queryGroupProductList';//获取拼团 优惠列表
var getCutProductListUrl = serverUrl + '/home/queryCutProductList';//获取砍价优惠列表
var getCommissionListUrl = serverUrl + '/home/queryCommissionProductList';//获取返佣优惠列表
var getSpecialListUrl = serverUrl + '/product/queryProductSpecialList';//获取特价产品列表
var getSpecialDetailUrl = serverUrl + '/product/queryProductSpecialInfo';//获取特价产品详情 productSid
var getIndexTenListUrl = serverUrl + '/home/queryRollingMessageList';//获取首页信息轮播列表
//机构
var getOrganListUrl = serverUrl + '/org/queryOrgList';//tab机构页列表  firstSortId sortId
var getOrganDetailUrl = serverUrl + '/org/queryOrgInfo';//获取机构详情 orgId
var getOrganClassUrl = serverUrl + '/org/queryOrgProduct';//获取机构课程列表 orgId
var getOrganTeacherListUrl = serverUrl + '/org/queryOrgTeacher';//获取机构老师
var getOrganCommentsUrl = serverUrl + '/org/queryOrgEvaluation';//获取机构评论
var getOrganCampusUrl = serverUrl + '/org/queryOrgCampus';//获取机构校区
var getTeacherDetailUrl = serverUrl + '/org/queryOrgTeacherInfo';//获取教师详情 teacherId
var getOrganTypeUrl = serverUrl + '/org/queryProductSort';//获取分类列表
var getOrganCityUrl = serverUrl + '/org/queryRegionList';//获取城市列表 cityName
var getPriceListUrl = serverUrl + '/product/queryProductRange';//获取价格列表
var getCouponListByOrgUrl = serverUrl + '/org/queryOrgCouponList';//获取优惠券列表
var getProductWithCouponUrl = serverUrl + '/product/queryUseCouponProductList';
//产品
var getProductDetailUrl = serverUrl + '/org/queryOrgProductInfo';//获取产品详情 productId
var getStageListUrl = serverUrl + '/product/getProductStageList';//获取阶段列表 productId productType subjectId
var getVideosListUrl = serverUrl + '/product/getProductVideoList';//获取课时列表 productId productType subjectId stageId
var saveVideoIndexUrl = serverUrl + '/user/saveProductVideoRecord';//保存当前学习课时 productType productId videoId
var buyProductUrl = serverUrl + '/order/createProductOrder';//购买正常产品 userId orgId productId ruleId productNum
var createGroupOrderUrl = serverUrl + '/order/createCutGroupOrder';//创建团购产品订单 productAid userId groupId
var buyProductByAllPriceUrl = serverUrl + '/order/createOriginalOrder';//productAid userID 全家购买
var createCutOrderUrl = serverUrl + '/order/createCutOrder';//创建砍价订单 productAid userId
var getCutHistoryUrl = serverUrl + '/order/friendCutHistory';//获取砍价历史 cutId
var getActiveGoodsDetailUrl = serverUrl + '/org/queryProductActivityInfo';//获取优惠产品 productAid
var collectionProductUrl = serverUrl + '/org/favoriteProduct';//收藏产品 productAid
var payOrderUrl = serverUrl + '/pay';//支付订单
var orderSpecialUrl = serverUrl + '/order/createProductSpecialOrder';//创建特价产品订单 userId productSid
var getCanUseCouponListUrl = serverUrl + '/user/queryUnUseCouponList';//支付时获取可使用的优惠券列表 orgId
var getHistoryCouponListUrl = serverUrl + '/user/queryCouponHis';//获取优惠券历史
var commentOrderUrl = serverUrl + '/order/evaluateOrder';//评论订单  orderId  userDesc envGrade effectGrade facultyGrade serviceGrade imageIdList
var getCouponUrl = serverUrl + '/user/getCoupon';//领取优惠券 userId couponId
var orderCoinNumUrl = serverUrl + '/updateOrderStatus';//产品下单 orderId coinNum;
var getOrderDetailNoPayUrl = serverUrl + '/order/queryOtherOrderInfo';//获取不支付的订单 orderId
var getNoPayOrderListUrl = serverUrl + '/user/queryNoPayUserOrder';//获取未支付的订单
var getPayOrderListUrl = serverUrl + '/user/queryPayUserOrder';//获取已支付的订单
var sendOrderToOrgUrl = serverUrl + '/order/orderForwardOrg';//转发给机构 orderId
var getCoinUrl = serverUrl + '/common/gainCoin';//获取太奇币 浏览  appUserId coinSource 1机构 2产品 3优惠产品 sourceId
var getRatioUrl = serverUrl + '/product/queryProductRatio';//获取返佣比例
//我的
var getMainDetailUrl = serverUrl + '/user/queryUserInfo';//获取个人信息 userId token
var getMyOrderListUrl = serverUrl + '/user/queryUserOrder';//获取我的订单列表 userId 分页
var deleteOrderUrl= serverUrl + '/order/deleteOrder';//删除订单 orderList []
var getOrderDetailUrl = serverUrl + '/order/queryOrderInfo';//订单详情 orderId
var getMyCollectionUrl = serverUrl + '/user/queryUserFavoriteProductList';//获取收藏课程 userId 分页
var getMyCommentsUrl = serverUrl + '/user/queryUserEvaluationList';//获取评论列表 userId 分页
var changeMainUrl = serverUrl + '/user/updateUserInfo';//修改个人信息 userName imageId sex 1男 2女 mail
var changePassUrl = serverUrl + '/user/updateUserPwd';//修改密码
var changePhoneUrl = serverUrl + '/user/updateUserPhone';//修改手机号
var bindPhoneUrl = serverUrl + '/user/updateGCSUserPhone';//绑定手机号
var getCoinHistoryListUrl = serverUrl + '/user/queryUserCoinHistory';//获取太奇币获取记录
var getMyMoneyHistoryListUrl = serverUrl + '/user/queryUserCommissionHistory';//获取佣金获取记录
var guessYouLikeUrl = serverUrl + '/user/queryLikeList';//猜你喜欢
var getMySawListUrl = serverUrl + '/user/queryBroweHistory';//获取浏览记录
var clearHistoryUrl = serverUrl + '/user/clearBroweList';//清除浏览记录
var getMyTaskUrl = serverUrl + '/user/queryTaskList';//获取我的任务
var signUserUrl = serverUrl + '/user/userSignIn';//用户签到
var shareGetCoinUrl = serverUrl + '/common/gainShareCoin';//分享获取太奇币 userId
var saleShareUrl = serverUrl + '/product/saveShareProductHistory';//productId productType shareType 1app 2后台
var getMoneyUrl = serverUrl + '/userlyWithDrawal';//提现申请



//记词模块
var getAllLevelListUrl = serverUrl + '/word/queryGradeList';//获取所有年级列表
var getWordsListUrl = serverUrl + '/word/course/list';//获取所有单词块列表
var getListByDanciIdUrl = serverUrl + '/word/getLessonList';//courseId 获取单词块下边的列表
var getListByDanciIdUrl1 = serverUrl + '/word/getPagingList';//courseId 获取kaoyan块下边的列表
var checkActivePlanUrl = serverUrl + '/word/checkCurrentPlanInfo';//点击单元时 检测当前单元和当前计划是否为同一个词汇 gradeId courseId

var getListByFourItemurl = serverUrl + '/word/words/list/paging';//考研 高考 中考 小学词汇列表 传coreId
var getWorsListByClassIdUrl = serverUrl + '/word/words/flashWord/list';//根据课程ID获取单词列表 lessonId

var getFullTestListUrl = serverUrl + '/word/brainMemoryWord';//获取全脑记单词列表\
var getPreFullTestUrl = serverUrl + '/word/preBrainMemoryWord';//获取上一单词 传当前单词ID
var setRememberWordsUrl = serverUrl + '/word/brainMemorySubmit';//在全脑记做完一个单词 需要记住做到哪里 wordId
var setWrongWordsUrl = serverUrl + '/word/words/BrainMemory/error';//在全脑记做完一个单词 错误的话传id wordId
var getSynTestListUrl = serverUrl + '/word/synchroList';//获取同步考单词list lessonId
var submitSynTestWrongListUrl = serverUrl +'/word/words/synchro/error/submit';//同步考提交时提交错误的答案 lessonId单元id errorids 错误的单词id数组 lessonName单元名 testType 1etoc 2ctoe 3write  (暂时不用)
var submitSynTestListUrl = serverUrl + '/word/words/synchro/hisotry';//提交同步考 synchroId
var getSynTestHistoryListUrl = serverUrl + '/word/words/BrainMemory/submit/list';//获取同步考历史记录
var getWrongWordsListUrl = serverUrl + '/word/words/BrainMemory/error/list';//获取错词本列表
var getWrongWordsCountUrl = serverUrl + '/word/words/error/count';
var getCoinByTestUrl = serverUrl + '/word/words/gainCoin';//奖励太奇币 lessonId全脑记不传     coinType 1闪形记 2全脑记 3同步考
var removeWrongWordUrl = serverUrl + '/word/words/BrainMemory/error/list/remove';//移除错词 wordId
var getWrongWordDetailUrl = serverUrl + '/word/words/BrainMemory/error/queryById';//获取错词详情 错题的 wordId
var getWrongLevelListUrl = serverUrl + '/word/words/error/grade/list';//查找我的错词本年级列表
var getWrongUnitListUrl = serverUrl + '/word/words/error/lesson/list';//查找我的错词本课件列表
var getWrongWrongListUrl = serverUrl + '/word/words/error/word/list';//查找我的错词本单词列表


var getWordStartDateUrl = serverUrl + '/word/words/queryMemory';//获取开始时间
var changeClassByCoinUrl = serverUrl + '/word/words/coinConvertTime';//兑换课程
var getMyWordsListHistoryUrl = serverUrl  + '/word/words/queryMemory';//获取我的单词记忆
var synTestAnwserSubmitUrl = serverUrl + '/word/words/synchro/word/submit';//提交同步考答案 一题一提交
var getLearnCointUrl = serverUrl + '/word/getPlanCoin';//小班学习计划 领取太奇币
// {
//     "synchroId":23, 列表Id
//     "wordId":76747,
//     "wordName":"year",
//     "wordName1":"wordName1",
//     "wordName2":"wordName2",
//     "wordName3":"wordName3",
//     "wordName4":"wordName4",
//     "currentChoice":"wordName3",
//     "isError":1, 0正确 1错误
//     "gradeId":3,
//     "lessonId":1000,
//     "gradeName":"三阶",
//     "lessonName":"上册"
// }
// {
//     "userId":4,
//     "userPhone":13661250406,
//     "code":139103,
//     "applyAmount":5.21,
//     "applyType":1,
//     "applyAccount":13661250406
// }

var sendOpinionUrl = serverUrl + '/user/saveOpinion';//意见反馈 opinionContent
var getMessageListUrl = serverUrl + '/message/queryUnReadMsgList';//获取用户通知
var getMessageDetailUrl = serverUrl + '/message/queryMessageInfo';//获取通知详情 pushId
var deleteMessageUrl = serverUrl + '/message/deleteMessage';//删除通知 pushId

//chat 聊天接口
var getSystemChatDataUrl = serverUrl + '/home/getServiceInfo';//获取系统的聊天
var getOrganChatDataUrl = serverUrl + '/home/getOrgServiceInfo';//获取机构的聊天数据 orgId

//新增AI测试类接口
var getKnowledgeListUrl = serverUrl + '/al/queryKnowledgeList';//获取知识点 level 1 2 3 parentId 0或者一二级Id
var getAiSubjectListUrl =  serverUrl + '/al/querySubjectList';//获取学科列表
var getSubjectListByProductUrl = serverUrl + '/product/querySubjectListByProduct';//根据课程获取当前学科列表 productType productId
var getAiKnowledgeListUrl = serverUrl + '/al/queryKnowledgeList';//获取知识点列表 subjectId
var getAiTestListUrl = serverUrl + '/al/queryQuestionList';//获取题库列表 knowledgeMain
var submitTestUrl = serverUrl + '/al/submitQuestionList';//提交知识点测评 useTime knowledgeId records[] {"questionId":1,"answer":"1","userAnswer":"1","isRight":1},
var getTestReportUrl = serverUrl + '/al/getUserReport';//获取诊断报告 knowledgeId
var getTestKnowledgeInfoUrl = serverUrl + '/al/queryKnowledgeInfo';//获取知识点详情 knowledgeId
var getTestTeacherVideoUrl = serverUrl + '/al/queryKnowledgeVideo';//获取名是讲解 knowledgeId
var getTestAiPushListUrl = serverUrl + '/al/getRecomQuesList';//获取智能推练题库
var getReportHistoryListUrl = serverUrl + '/al/queryDiagnosisRecordList';//获取诊断记录

//综合测试
var getQuestionListUrl = serverUrl + '/al/getRandomQuestionList';//抽题 subjectId simpleNum middleNum difficultyNum
var submitTrainTestUrl = serverUrl + '/al/submitTestResult';//提交综合测试 subjectId useTime
var getTrainHistoryListUrl = serverUrl + '/al/getTestResultList';//综合测试历史列表
var getTrainDetailUrl = serverUrl + '/al/getTestResult';//获取综合测试详情 testId
var getTrainWrongListUrl = serverUrl + '/al/getErrorBookList';//获取综合测试错题本列表
var getTrainWrongDetailUrl = serverUrl + '/al/getErrorBookInfo';//获取综合测试错题详情
var deleteTrainListUrl = serverUrl + '/al/deleteTestResultList';//删除训练记录 testIds []
var deleteAiWrongWordUrl = serverUrl + '/al/deleteErrorBook';//删除训练错词 bookIds []


//获取视频连接
var getVideoUrl = serverUrl + '/al/getVideoInfo';//获取视频链接 fileId
var getLastLearnVideoUrl = serverUrl + '/user/queryProductVideoRecord';//获取学习记录 课时的 productId productType


//小班相关
var getMyClassUrl = serverUrl + '/word/getLearnClassList';//获取我的小班
var getMyClassDetailUrl = serverUrl + '/word/getLearnClassInfo';//获取我的小班详情 classId
var joinClassUrl = serverUrl + '/word/joinLearnClass';//加入小班 inviteCode
var getCreatePlanParamsUrl = serverUrl + '/word/getPlanParam';//获取创建学习计划的参数
var createPlanUrl = serverUrl + '/word/createPlanInfo';//创建计划 gradeId gradeName wordCount dailyTask
var getWordLearnPlanUrl = serverUrl + '/word/getPlanInfo';//获取单词学习计划
var createLittleClassUrl = serverUrl + '/word/learn/class/create';//创建小班 classPic  className classIntro
var createDefultPlanUrl = serverUrl + '/word/dealChoiceWord';//创建默认计划  gradeId courseId gradeType  年级1 考研等是2
var setLearnUnitUrl = serverUrl + '/word/dealChoiceLesson';//给计划记录学习单元 planId lessonId
var getClassPlanListUrl = serverUrl + '/word/getLearnClassPlanList ';//获取小班今日计划列表  classId
var getClassRankListUrl = serverUrl + '/word/getLearnClassRanking';//获取小班排名 classId
var getRecomClassUrl = serverUrl + '/word/getLearnClassRecom';//获取推荐
var saveClassNoticeUrl = serverUrl + '/word/updateLearnClassNotice';//保存公告 classId classNotice
var getLearnUserCoinUrl = serverUrl + '/word/getLearnClassUserCoin';//获取学生领取太奇币列表 classId
var getLearnHistoryUrl = serverUrl + '/word/getBeforePlanList';//查找我以往的计划
var checkPlanUrl = serverUrl + '/word/checkPlanInfo';//检查是否创建过计划 gradeId courseId
var useThisPlanUrl = serverUrl + '/word/convertPlanInfo';//替换当前计划 gradeId courseId gradeType

//直播订单等接口
var getClassVideoListUrl = serverUrl + '/product/getProductVideoList';//获取我买的课程下的视频列表 productId productType
var getIndexLiveListUrl = serverUrl + '/product/getLiveProductList';//获取首页直播课程
var getSortListUrl = serverUrl + '/order/querySortIdByOrder';//获取项目列表
var getMyClassBySoutIdUrl = serverUrl + '/order/queryOrderListByAlClassId';//获取我的视频课程 根据项目ID
var getMyFtofListUrl = serverUrl + '/order/queryOrderSchemePageList';//获取面授课

var getLiveListUrl = serverUrl + '/product/getProductLiveList';//获取直播课列表
var getFreeListUrl = serverUrl + '/product/getProductIsTryList';//获取免费课列表
var getActiveUrl = serverUrl + '/product/getProductActivityList';//获取优惠课程列表
var getAuditionUrl = serverUrl + '/product/getProductFreeIsTryList';//获取试听可曾列表
var getIndexLiveUrl = serverUrl + '/product/getHomeProductLiveList';//获取首页热门直播
var getIndexFreeUrl = serverUrl + '/product/getHomeProductIsTryList';//获取首页免费试听
var getIndexActiveUrl = serverUrl + '/product/getHomeProductActivityList';//获取首页限时优惠

//靶向学习新接口
var getUserTestTimesUrl = serverUrl +'/al/getUserAlTestIsTryCount';//获取用户试听次数
var getSalePackageUrl = serverUrl + '/al/getAlSalePackageList';//获取销售包列表 subjectId
var buySalePackageUrl = serverUrl + '/al/wxPay';//购买销售包 alSaleId ruleId
var getSalePackagePriceUrl = serverUrl + '/al/getAlSalePackagePrice';//获取销售包价格 alSaleId

//资讯接口
var getNewsListUrl = serverUrl + '/org/queryOrgMessageDyanmicList';//获取咨询列表
var getNewsDetailUrl = serverUrl + '/org/queryOrgMessageDyanmicInfo';//获取咨询详情 messageId


//资料
var getFileTypeListUrl = serverUrl + '/org/queryDatumTypeList';//获取类型列表
var getFileListBySearchUrl = serverUrl + '/org/queryDatumPageList';//搜搜 datumName typeId
var saveLoadFileStatusUrl = serverUrl + '/org/saveDatumRecord';//记录下载记录 datumId

//全面扫描
var getScanQuesListUrl = serverUrl + '/al/queryScanQuestionList';//获取全秒扫描题列表
var submitScanDataUrl = serverUrl + '/al/submitScanQuestionList';//提交做题 subjectId useTime scanQuestions [{questionId,difficultyLevel,,answer,userAnswer,isRight}]
var getScanDetailUrl = serverUrl + '/al/queryScanReport';//获取测试报告 subjectId
var getScanPushUrl = serverUrl + '/al/queryRecomScanQues';//获取扫描推练 recordId
var getScanHistoryUrl = serverUrl + '/al/queryScanRecordPageList';//获取扫描记录
var getScanHistoryDetailUrl = serverUrl + '/al/queryScanRecordInfo';//获取扫描详情
var deleteScanHistoryUrl = serverUrl + '/al/deleteScanRecord';//删除 recordIds
var getSummaryUrl = serverUrl+'/al/getScanSummary';//获取扫描总结
var getPushListUrl = serverUrl + '/al/getScanRecomQues';//获取针对训练列表
function getCoinByBrower (source,id) {

    var obj = {
        coinSource:source,
        sourceId:id
    }
    var user = getUserInfo();
    if(user){
        obj.appUserId = user.userId;
    }else{
        return;
    }
    ajaxGetVistor(getCoinUrl,obj,function (ret,err) {
        if(ret && ret.code == 0){
            toast('恭喜您，获取10个太奇币')
        }
    })

}


//==========================================获取url参数===================
function GetRequest() {
    var url = location.search;
    url = decodeURIComponent(url);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
        }
    }
    return theRequest
}

function al(data) {
    if(falga){
        alert(JSON.stringify(data))
    }else{

    }
}


//双击退出
var backButtonPress = 0;
function closeOnKeyBack() {
    backButtonPress++;
    if (backButtonPress > 1) {
        closeApp();
    } else {
        api.toast({msg: '再按一次退出应用'});
    }
    setTimeout(function () {
        backButtonPress = 0;
    }, 1000);
}
function closeApp(){
    api.closeWidget({
        retData: {name:'closeWidget'},
        silent: true,
        animation: {
            type: 'none',
            subType: 'from_bottom',
            duration: 500
        }
    });
}
function falgAlert(data){
    if(alertFlag){
        alert(JSON.stringify(data))
    }
}
function rightButtonPosition(){
    titleHeight = api.safeArea.top + 10;
    var rt = document.getElementById('rightButton');
    rt.style.top = titleHeight+5 + "px"
}


var selectData = [{value: '2',
    text: '无'
},{value: '1',
    text: '有'
}];


var sexData = [{value: '1',
    text: '男'
},{value: '2',
    text: '女'
}];
var ageData = [{"text":1,"value":1},{"text":2,"value":2},{"text":3,"value":3},{"text":4,"value":4},{"text":5,"value":5},{"text":6,"value":6},{"text":7,"value":7},{"text":8,"value":8},{"text":9,"value":9},{"text":10,"value":10},{"text":11,"value":11},{"text":12,"value":12},{"text":13,"value":13},{"text":14,"value":14},{"text":15,"value":15},{"text":16,"value":16},{"text":17,"value":17},{"text":18,"value":18},{"text":19,"value":19},{"text":20,"value":20},{"text":21,"value":21},{"text":22,"value":22},{"text":23,"value":23},{"text":24,"value":24},{"text":25,"value":25},{"text":26,"value":26},{"text":27,"value":27},{"text":28,"value":28},{"text":29,"value":29},{"text":30,"value":30},{"text":31,"value":31},{"text":32,"value":32},{"text":33,"value":33},{"text":34,"value":34},{"text":35,"value":35},{"text":36,"value":36},{"text":37,"value":37},{"text":38,"value":38},{"text":39,"value":39},{"text":40,"value":40},{"text":41,"value":41},{"text":42,"value":42},{"text":43,"value":43},{"text":44,"value":44},{"text":45,"value":45},{"text":46,"value":46},{"text":47,"value":47},{"text":48,"value":48},{"text":49,"value":49},{"text":50,"value":50},{"text":51,"value":51},{"text":52,"value":52},{"text":53,"value":53},{"text":54,"value":54},{"text":55,"value":55},{"text":56,"value":56},{"text":57,"value":57},{"text":58,"value":58},{"text":59,"value":59},{"text":60,"value":60},{"text":61,"value":61},{"text":62,"value":62},{"text":63,"value":63},{"text":64,"value":64},{"text":65,"value":65},{"text":66,"value":66},{"text":67,"value":67},{"text":68,"value":68},{"text":69,"value":69},{"text":70,"value":70},{"text":71,"value":71},{"text":72,"value":72},{"text":73,"value":73},{"text":74,"value":74},{"text":75,"value":75},{"text":76,"value":76},{"text":77,"value":77},{"text":78,"value":78},{"text":79,"value":79},{"text":80,"value":80},{"text":81,"value":81},{"text":82,"value":82},{"text":83,"value":83},{"text":84,"value":84},{"text":85,"value":85},{"text":86,"value":86},{"text":87,"value":87},{"text":88,"value":88},{"text":89,"value":89},{"text":90,"value":90},{"text":91,"value":91},{"text":92,"value":92},{"text":93,"value":93},{"text":94,"value":94},{"text":95,"value":95},{"text":96,"value":96},{"text":97,"value":97},{"text":98,"value":98},{"text":99,"value":99},{"text":100,"value":100}]

function isNotBlack(data) {
    return (data == "" || typeof(data)  == "undefined"|| data == null || isNullJson(data)) ? false : true;
}

function isNullJson(obj) {
    return isJson(obj) && JSON.stringify(obj) == '{}';
}

function isJson(obj) {
    return typeof(obj) == "object" &&
        Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
}


function isBlack(data) {
    return (data == "" || typeof(data)  == "undefined" || data == null || isNullJson(data)) ? true : false;
}


//检查是否是数字
function isNum(num){
    if(!(/^\d*$/.test(num))){
        return false;
    }
    return true;
}


function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function isFunction(func) {
    if (typeof(func) == "function") {
        return true;
    }
    return false;
}



function checkPhone(phone) {
    var reg = /^1[3456789]{1}[0-9]{9}$/;
    if(!reg.test(phone)){
        return false;
    }
    return true;
}

//添加 电话号码数字禁止拨打
function addPhoneMetaLabel() {
    var oMeta = document.createElement('meta');
    oMeta.name = "format-detection";
    oMeta.content = "telphone=no, email=no";
    document.getElementsByTagName('head')[0].appendChild(oMeta);
}

function MillisecondToDate(mss) {
    mss = mss - new Date().getTime();
    if(mss<=0){
        return  "0天" + "0小时" + "0分钟" + "0秒";
    }
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    days = days < 10 ? '0' + days : days
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    hours = hours < 10 ? '0' + hours : hours
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    minutes = minutes < 10 ? '0' + minutes : minutes
    var seconds = parseInt((mss % (1000 * 60)) / 1000);
    seconds = seconds < 10 ? '0' + seconds : seconds
    var obj = {
        d:days,
        h:hours,
        m:minutes,
        s:seconds
    }
    return obj
    // return days + "天" + hours + ":" + minutes + ":" + seconds;
}
//补零


var formatTimeToDate = function(time){
    return new Date(time).format("yyyy-MM-dd hh:mm");
};
var formatTimeToDay = function(time){
    return new Date(time).format("yyyy-MM-dd");
};

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

function shareToWx(imageFilter,wx,type1,title,desc,thumb,url,callback,id,type) {
    var fsImgUrl =  'fs://share'+new Date().getTime() +'.png';
    var rand = ''; // 生成文件名
    for (var i = 0; i < 10; i++) {
        rand += Math.floor(Math.random() * 10);
    }
    if(getUserInfo()){
        url+='uid='+getUserInfo().userId
    }
    api.showProgress();
    api.download({
        url:thumb,
        savePath:fsImgUrl,
        report: true,
        cache: true,
        allowResume: true
    }, function(ret, err) {
        if (ret.state == 1) {
            api.hideProgress();
            setTimeout(function () {
                imageFilter.compress({
                    img: fsImgUrl,
                    quality: 0.9,
                    size:{
                        w:100,
                        h:100
                    },
                    save:{
                        imgPath:'fs://share/',
                        imgName:rand+'.png'
                    }
                },function( ret, err ){
                    if( ret.status ){
                        wx.shareWebpage({
                            apiKey: '',
                            scene: type1,
                            title: title,
                            description: desc,
                            thumb: 'fs://share/'+rand+'.png',
                            contentUrl: url
                        }, function(ret, err){
                            if (ret.status) {
                                var user = getUserInfo();
                                if(user){
                                    url+='&mainid='+user.userId +'&sourceType=1';
                                    ajaxGet(shareGetCoinUrl,{userId:user.userId},function (ret,err) {

                                    })
                                    ajaxGet(saleShareUrl,{productId:id,productType:type,shareType:1,userId:user.userId},function (ret,err) {

                                    })
                                }
                                if(callback){
                                    callback(ret);
                                }
                            } else {
                                alert(JSON.stringify(err))
                                toast('分享失败')
                            }
                        });
                    }else{
                        console.log( JSON.stringify( err ));
                    }
                });
            })

        }
        if(err){
            api.hideProgress();
        }
    });







}

//收藏
function collectionProductFn(id,imageType) {
    ajaxGet(collectionProductUrl,{productId:id,imageType:imageType},function (ret,err) {
        if(ret && ret.code == 0){
            toast('已收藏')
        }
    })
}


function previewPhoto(UIPhotoViewer,imgArr,index) {
    UIPhotoViewer.open({
        images: imgArr,
        activeIndex:index,
//                    placeholderImg: 'widget://icon/organicon.png',
        bgColor: '#000',
        gestureClose:true,
    }, function(ret, err) {
        if (ret) {
            if(ret.eventType == 'click'){
                UIPhotoViewer.close()
            }
        } else {
        }
    });
}

//随机数组
function shuffle(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }
    return arr;
}

//记词获取太奇币
function getCoinByTest(type,id) {
    var obj = {};
    if(type == 1 || type == 3){
        obj.lessonId = id;
    }else{
        obj.wordId = id;
    }
    obj.coinType = type;
    ajaxGet(getCoinByTestUrl,obj,function (ret,err) {
        if(ret && ret.code == 0){
            if(type == 2){
                toast('已获取10个太奇币')
            }else if(type == 3){
                toast('已获取100个太奇币')
            }else if(type == 1){
                toast('已获取'+ret.data+'个太奇币')
            }
        }
    })
}
//播放正确和错误音频 传入dom和blea
function playRightAndError(audio,type) {
    if(type){
        audio.src = '../../../feature/correct.mp3';
        audio.play();
    }else{
        audio.src = '../../../feature/error.mp3';
        audio.play();

    }
}

/**
 * [bindConsult 咨询点击]
 * @return {[type]} [description]
 */
function bindConsult(data) {
    api.openWin({
        name: 'chat_win',
        url: './chat/chat_win.html',
        reload: true,
        delay: 300,
        pageParam:data,
        animation: {
            type: 'none'
        }
    });
}
