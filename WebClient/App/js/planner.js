/* 
* Instructor View Planner JS
*/
/********************************************************************/
/************************* PLANNER VIEW *****************************/
/********************************************************************/ 
function PlannerView () {} 

PlannerView.model = null;
PlannerView.showAlertMessageFlag = false;
PlannerView.showAlertMessageCount = 0;
PlannerView.filterMsgData = null;
PlannerView.loadedInitially = true;
PlannerView._alert = ISeriesBase.prototype._alert;

PlannerView.init = function (model) {
	PlannerView.model = model;
	PlannerView.render();
}
 
PlannerView.render = function () {
	var oSelf = this;
	
	oSelf.appVersion = new (function () {
		this.isGreater = function (aAppCurVer, aMsgVer) {
			var bFound = false,
				sAppVer = new String(),
				sMsgVer = new String(),
				iLoopCounter = (aMsgVer.length > aAppCurVer.length) ? aMsgVer.length : aAppCurVer.length;
			
			for (var iCnt = 0; iCnt < iLoopCounter; iCnt++) {
				sAppVer += (isNaN(parseInt(aAppCurVer[iCnt])) && (typeof aAppCurVer[iCnt] == "undefined")) ? '0' : aAppCurVer[iCnt].toString();
				sMsgVer += (isNaN(parseInt(aMsgVer[iCnt])) && (typeof aMsgVer[iCnt] == "undefined")) ? '0' : aMsgVer[iCnt].toString();
			}
			
			if(parseInt(sMsgVer) > parseInt(sAppVer)) {
				bFound= true;
			}
			
			return bFound;
		};
	});
	
	var sAppCurVersion = oSelf.model.currentVersion,
		aAppCurVersion = sAppCurVersion.split(".");
	
	if (
		!oSelf.showAlertMessageFlag && 
		oSelf.model.messageData != null && 
		oSelf.model.messageData.length > 0
	) {
		oSelf.filterMsgData  = _.sortBy(
									_.filter(oSelf.model.messageData, 
										function(msg) {
											var sMsgVersion = (typeof msg.AppVersion != "undefined") ? msg.AppVersion : "" ,
												aMsgVersion = sMsgVersion.split(".");
											// AppUpdate will not be shown in web client
											if (oSelf.model.appPlatform != MESSAGE_INSTRUCTOR.c_s_MESSAGE_WEBCLIENT_TYPE) {
												return (
													(
														msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE && 
														(
															// for getting AppUpdate messages
															oSelf.appVersion.isGreater(aAppCurVersion, aMsgVersion) || 
															(
																// following code for only where GetMessageList does not return AppVersion key [Occurs only on windows 3.1.3 & 3.1.4 build. IPP - 2658 and IPP - 2560]
																(sAppCurVersion.length == 0) && (sMsgVersion.length == 0)
															)
														)
													) || 
													// for filtering DidYouKnow messages
													msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE
												);
											}
											// for WebClient: only DidYouKnow messages will show
											else {
												return (msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE);
											}
										}
									), 
									function(msg){
										return msg.MessageType
									}
								);
	}
	
	if(oSelf.filterMsgData != null){
		// checking if AppUpdate messages are available
		if(
			_.find(oSelf.filterMsgData, function(rec) {
					return rec.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE;
				}
			)
		){
			// rejecting DidYouKnow messages when AppUpdate messages are present
			oSelf.filterMsgData = _.reject(oSelf.filterMsgData, function(rec){ return rec.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE});
		}
		else{
			// After suffling only pick one DidYouKnow message when showing only DidYouKnow alert
			var oSuffledMsg = _.shuffle(oSelf.filterMsgData);
			oSelf.filterMsgData = new Object;
			for (var oVal in oSuffledMsg) {
				if (oSuffledMsg.hasOwnProperty(oVal) && typeof(oVal) !== 'function') {
					oSelf.filterMsgData[oVal] = oSuffledMsg[oVal];
					break;
				}
			}
		}
	}
	
	$('#btnUnit').html(PLANNER.c_s_UNIT_BTTN);
	$('#btnWeek').html(PLANNER.c_s_LESSON_BTTN);
	
	$("#gradeAssessmentlist").html(_.template($("#gradeAssessmentlistTemplate").html(), {
		"data" : oSelf.model.assessmentData		
	}));
	
	if (objMessageJsonData.canShow === true) {
		oSelf.showAlertMessage ();
	}
	
	oSelf.bindEvent();
	oSelf.setIndexPositionWithButtonActive();
	oSelf.resize();
} 


PlannerView.showAlertMessage = function () {
	var oSelf = this,
		filterMsgData = null;

	if(oSelf.filterMsgData != null){
		$.each(oSelf.filterMsgData, function (idx, val) {
			if(oSelf.showAlertMessageCount == idx){
				filterMsgData = val;
			}
		});
		
		if (filterMsgData != null) {
			$("#messagePopUp").html(
				_.template(
					$("#messagePopUpTemplate").html(), {
						'msgdata':filterMsgData
					}
				)
			);
			$("#messagePopUp").show();
			$("#innerContentArea").css({"overflow":"hidden"});
			oSelf.showAlertMessageFlag = true;
			oSelf.showAlertMessageCount++;
			oSelf.bindEvent4PopUpCloseBtn();
		}
	}
}

PlannerView.bindEvent4PopUpCloseBtn = function () {
	var oSelf = this;
	$("#messagePopUpCloseBtn").off("click").on("click", function () {
		$("#messagePopUp").empty();
		$("#messagePopUp").hide();
		$("#innerContentArea").css({"overflow":"auto"});
		oSelf.showAlertMessage();
	});
}

PlannerView.bindEvent = function () {
	mySwiper = $('.swiper-container').swiper({height: 'auto', noSwiping: true});
	mySwiper.swipeTo(parseInt(Application.stageItem.get(Application.viewType)), 200);
	$(".swiper-wrapper").height("auto");
	$(".swiper-wrapper").children().height("auto");
	PlannerView.pagingButtonShowHide(mySwiper.activeIndex, mySwiper.slides.length);
	
	$('#btnUnit').off('click').on('click', function(){
        if($(this).hasClass("active")){
			return false;
		}else{
			$(this).addClass("active");
			$('#btnWeek').removeClass("active");
			Application.viewType = VIEWTYPE.c_s_PLANNER_UNIT;
			Application.view = PlannerUnitView;
			Application.callView(Application.stageItem.get(Application.viewType));
                        
		}
    });

    $('#btnWeek').off('click').on('click', function() {
        if($(this).hasClass("active")){
			return false;
		}else{
			$(this).addClass("active");
			$('#btnUnit').removeClass("active");
			Application.viewType = VIEWTYPE.c_s_PLANNER_WEEK;
			Application.view = PlannerWeekView;
			Application.callView(Application.stageItem.get(Application.viewType));
            //console.log(Application.model);
		}
    });
		
	$("#prevPagingBtn").off('click').on('click', function () {
		var fetchIdx = parseInt(Application.stageItem.get(Application.viewType)) - 1;
		if(fetchIdx < 0){
			return false;
		}else{
			Application.stageItem.set(Application.viewType, fetchIdx);
			Application.view.activeIdx = 0;
			Application.view.renderInnerContents();
			mySwiper.swipePrev();
			var sliderLength = mySwiper.slides.length;
			var currentIdx = mySwiper.activeIndex;
			PlannerView.pagingButtonShowHide(currentIdx, sliderLength);
			PlannerView.setIndexPositionWithButtonActive();
		}
	});
	
	$("#nextPagingBtn").off('click').on('click', function () {
		var fetchIdx = parseInt(Application.stageItem.get(Application.viewType)) + 1;
		
		if(Application.viewType == VIEWTYPE.c_s_PLANNER_UNIT) {
			modeldata = PlannerView.model.plannerData;
		} else {
		
			var currentUnit = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT);
			var sortedUnitArray = _.sortBy(PlannerView.model.plannerData, "unitOrderNumber");
			modeldata = sortedUnitArray[currentUnit].week;
		}
				
		if(fetchIdx >= modeldata.length){
			return false;
		}else{
			Application.stageItem.set(Application.viewType, fetchIdx);
			Application.view.activeIdx = 0;
			Application.view.renderInnerContents();
			mySwiper.swipeNext();
			var sliderLength = mySwiper.slides.length;
			var currentIdx = mySwiper.activeIndex;
			PlannerView.pagingButtonShowHide(currentIdx, sliderLength);
			PlannerView.setIndexPositionWithButtonActive();
		}
	});
	
	$("#plannerdropdown").off("click tap").on("click tap", function (e) {
		var  elem = $(this).parent();
		e.stopPropagation();
		if (elem.hasClass('active')) {
			elem.removeClass("active");
			$(this).siblings(".lesson_tooltip").hide({
				duration: 500,
				easing: "easeOutBounce"
			});
		} else {
			elem.addClass("active");
			$(this).siblings(".lesson_tooltip").show({
				duration: 500,
				easing: "easeOutBounce"
			});
		}
	});
	
	$("#plannerHeader").off("click tap").on("click tap", function (e) {
		var  elem = $("#plannerdropdown").parent();
		e.stopPropagation();
		if (elem.hasClass('active')) {
			elem.removeClass("active");
			$("#plannerdropdown").siblings(".lesson_tooltip").hide({
				duration: 500,
				easing: "easeOutBounce"
			});
		} else {
			elem.addClass("active");
			$("#plannerdropdown").siblings(".lesson_tooltip").show({
				duration: 500,
				easing: "easeOutBounce"
			});
		}
	});
	
	$("#btnGrade").off("click tap").on("click tap", function (e) {
		var  elem = $(this).parent();
		e.stopPropagation();
		if (elem.hasClass('active')) {
			elem.removeClass("active");
			$(this).siblings(".lesson_tooltip").hide({
				duration: 500,
				easing: "easeOutBounce"
			});
		} else {
			elem.addClass("active");
			$(this).siblings(".lesson_tooltip").show({
				duration: 500,
				easing: "easeOutBounce"
			});
		}
	});
		
	PlannerView.bindTooltip();
}

PlannerView.bindTooltip = function() {
	
	$("#lessontoolslist > li > a").off('click').on('click', function(){
		if($(this).hasClass("active")){
			return false;
		}else{
			var tempArr = $(this).attr('id');
			var fetchIdx = tempArr.split("_");
			
			if(Application.viewType == VIEWTYPE.c_s_PLANNER_UNIT){
				if(PlannerUnitView.model[fetchIdx[1]].week == null){
					return false;
				}else{
					Application.stageItem.set(Application.viewType, fetchIdx[1]);
					Application.view.activeIdx = 0;
					Application.view.renderInnerContents();
					mySwiper.swipeTo(parseInt(Application.stageItem.get(Application.viewType)), 200);
					var sliderLength = mySwiper.slides.length;
					var currentIdx = mySwiper.activeIndex;
					PlannerView.pagingButtonShowHide(currentIdx, sliderLength);
					PlannerView.setIndexPositionWithButtonActive(); /**/
				}
			}else{
				Application.stageItem.set(Application.viewType, fetchIdx[1]);
				Application.view.activeIdx = 0;
				Application.view.renderInnerContents();
				mySwiper.swipeTo(parseInt(Application.stageItem.get(Application.viewType)), 200);
				var sliderLength = mySwiper.slides.length;
				var currentIdx = mySwiper.activeIndex;
				PlannerView.pagingButtonShowHide(currentIdx, sliderLength);
				PlannerView.setIndexPositionWithButtonActive(); /**/
			}
		}
	});
	
	$("#gradeAssessmentlist > li > a").off('click').on('click', function(){
		if($(this).hasClass("active")){
			return false;
		}else{
			$("#gradeAssessmentlist > li").removeClass("active");
			$(this).parent().addClass("active");
			var tempArr = $(this).attr('id');
			var fetchIdx = tempArr.split("_");			
			
			if ($(this).attr('data-lessonID') != '') {
			
				var currentUnitNumber = $(this).attr('data-unitNumber');
				var currentWeekNumber = $(this).attr('data-weekNumber');
				var currentItemId = $(this).attr('data-lessonID');
				var previewFlag = 0;
				var rataBookId = $(this).attr('data-lessonratabookitemID');
				
				LaunchGradeItem(currentUnitNumber,currentWeekNumber,currentItemId,"lesson",previewFlag,rataBookId);
			}
			else if ($(this).attr('data-introText') != '') {
			
				var introText = unescape($(this).attr('data-introText'));
				$("#normalPopUp").html(
					_.template(
						$("#normalPopUpTemplate").html(),
						{
							'msgdata':introText
						}
					)
				);
				$("#normalPopUp").show();
				$("#innerContentArea").css({"overflow":"hidden"});
				PlannerView.bindNormalPoupup();				
			}
			
		}
	});
}

PlannerView.bindNormalPoupup = function () {
	$("#normalPopUpCloseBtn").off("click").on("click", function () {
			$("#normalPopUp").empty();
			$("#normalPopUp").hide();
			$("#innerContentArea").css({"overflow":"auto"});
		});
}
	
PlannerView.pagingButtonShowHide = function (currentIdx, sliderLength) {
	var counter = parseInt(currentIdx)+1;
	if(counter >= sliderLength){ 
		$('#nextPagingBtn').hide();
		$('#prevPagingBtn').show();
		
	}else if(counter == 1){
		$('#prevPagingBtn').hide();
		$('#nextPagingBtn').show();
		
	}else{ 
		$('#prevPagingBtn').show();
		$('#nextPagingBtn').show();
	}
	PlannerView.resize();
}

PlannerView.setIndexPositionWithButtonActive = function (){
	if(Application.viewType == VIEWTYPE.c_s_PLANNER_UNIT){
		var fetchUnitIdx = Application.stageItem.get(Application.viewType);
		var fetchWeekIdx = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);
		var btnObj = $("#week_"+fetchUnitIdx+"_"+fetchWeekIdx);
		$("a[id^='week_']").removeClass("active");
	}else{
		var fetchWeekIdx = Application.stageItem.get(Application.viewType);
		var fetchLessonIdx = Application.stageItem.get(VIEWTYPE.c_s_LESSON);
		var btnObj = $("#lesson_"+fetchWeekIdx+"_"+fetchLessonIdx);
		$("a[id^='lesson_']").removeClass("active");
	}
	var pos = btnObj.position().left + 10 + parseInt(btnObj.css("margin-right")) + (btnObj.width()  + parseInt(btnObj.css("padding-left")) + parseInt(btnObj.css("padding-right")))/2;
	btnObj.addClass("active");
	$(".dash_lesson_container .page_arrow").animate({"left" : pos + "px"}, 300);
}

PlannerView.alertPopUp = function (htmlCont) {
	$( "#dialog-message" ).html(htmlCont);
	$( "#dialog-message" ).dialog({
		resizable: true,
		modal: true,
		draggable: false,
		beforeClose: function(event, ui) {
			$('#innerContentArea:visible').removeClass('stop_scrollbar');
			$('#weekviewLeftInnerContent:visible').removeClass('stop_scrollbar');
			$('#weekviewMiddleContent:visible').removeClass('stop_scrollbar');
		}
	});
	var isOpen = $( "#dialog-message" ).dialog( "isOpen" );
	if(isOpen){		
		$('#innerContentArea:visible').addClass('stop_scrollbar');
		$('#weekviewLeftInnerContent:visible').addClass('stop_scrollbar');
		$('#weekviewMiddleContent:visible').addClass('stop_scrollbar');
	}
}

PlannerView.resize = function () {
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
		$('html').addClass('ipad ios7');
		var window_height = $("body").height();
	}else{
		var window_height = $(window).height();
	}
	
	var header = $("header").outerHeight();
	var footer = $("footer").outerHeight();
	var section_padding = parseInt($("#main_container").css("padding-top")) + parseInt($("#main_container").css("padding-bottom"));
	var navButtonArea_height = $("#navButtonArea").outerHeight() + parseInt($("#navButtonArea").css("margin-bottom"));
	var teachButton_height = ($("#teachButton:visible").outerHeight() == null) ? 0 : $("#teachButton:visible").outerHeight();
	
	var dash_lesson_container_padding = parseInt($(".dash_lesson_container").css("padding-top")) + parseInt($(".dash_lesson_container").css("padding-bottom"));
	var innerContentArea_padding = parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom"));
	var actual_height = window_height - (header + footer + section_padding + teachButton_height + navButtonArea_height + dash_lesson_container_padding + innerContentArea_padding + 5);
	$('.main-bg-images').height(window_height);
	
	if(Application.viewType == VIEWTYPE.c_s_PLANNER_UNIT){
		$("#innerContentArea").height(actual_height);
	}else{
		$("#innerContentArea").css({"height":"auto"});
		var actual_right_inner_height = actual_height - (parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom")))  + parseInt($("#weekviewLeftContent").css("margin-bottom"));
		
		$("#weekviewMiddleContent").height(actual_right_inner_height);
		
		var actual_left_inner_height = actual_height - (parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom")) + $("#weekviewLeftContent").children("h3").outerHeight()+ parseInt($("#weekviewLeftContent").children("h3").css("margin-bottom"))+$("#weekviewLeftButtonContent").outerHeight()) - parseInt($("#weekviewLeftContent").css("margin-bottom")) - 5;		
		
		$("#weekviewLeftInnerContent").height(actual_left_inner_height);
	}

	/* var btnObj = $('button.button5').filter('.active');
	//btnObj.addClass("active");
	var pos = btnObj.position().left + (btnObj.width()/2)  + parseInt(btnObj.css("padding-left")) + parseInt(btnObj.css("margin-right"))+ 5;
	$(".dash_lesson_container .page_arrow").animate({"left" : pos + "px"}, 20); */
	$(".ui-dialog:visible").position({
		my: "center",
		at: "center",
		of: window	
	});
}

/********************************************************************/
/*********************** PLANNER UNIT VIEW **************************/
/********************************************************************/
function PlannerUnitView () {}

//Properties
PlannerUnitView.model = null;
PlannerUnitView.activeIdx = 0;

PlannerUnitView.init = function (model) {
	PlannerUnitView.model = _.sortBy(model.plannerData, "unitOrderNumber");
	
	PlannerUnitView.activeIdx = (Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK) != 0) ? Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK) : 0;
	
	PlannerUnitView.render();
	PlannerView.init(model);
}

PlannerUnitView.render = function () {
	PlannerUnitView.renderNavButtons();
	PlannerUnitView.renderInnerContents();
	$("#teachButton").hide();
	$("#main_container").addClass("without_tech_button");
}

PlannerUnitView.renderNavButtons = function () {
	$("#navButtonArea").html(_.template($("#navButtonAreaTemplate").html(), {
		"data" : PlannerUnitView.model,
		"currentUnit": Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT),
		"currentWeek": PlannerUnitView.activeIdx,
		"plannerType": VIEWTYPE.c_s_PLANNER_UNIT
	}));
}

PlannerUnitView.renderInnerContents = function () {
	var currentUnit = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT);
	$("#plannerHeader").html(PlannerUnitView.model[currentUnit].unitName);
	//Added
	$("#lessontoolslist").html(_.template($("#lessontoolslistTemplate").html(), {
		"data" : PlannerUnitView.model,
		"currentUnit": Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT),
		"currentWeek": PlannerUnitView.activeIdx,
		"plannerType": VIEWTYPE.c_s_PLANNER_UNIT
	}));
	$("#innerContentArea").html(_.template($("#innerContentAreaTemplate").html(), {
		"data" : PlannerUnitView.model,
		"currentUnit": Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT),
		"currentWeek": PlannerUnitView.activeIdx,
		"plannerType": VIEWTYPE.c_s_PLANNER_UNIT
	}));
	$("#innerContentArea").scrollTop(0);
	Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK, PlannerUnitView.activeIdx);
	PlannerUnitView.bindEvent();
	PlannerView.bindTooltip();
}

PlannerUnitView.bindEvent = function(){
	$('#btnUnit').addClass("active");
	$('#btnWeek').removeClass("active");
	
	$("a[id^='week_']").off('click').on('click', function(event){
            
		 var dataValue = $(this).attr('id');
		var tempArr = dataValue.split("_");
		
		if($(this).hasClass("active")){
			if($(this).hasClass("noLessonClass")){
				PlannerView.alertPopUp("<p>"+PLANNER.c_s_LESSON_NOT_FOUND_TXT+"</p>");
			}else{
				//Application.stageItem.set(VIEWTYPE.c_s_PLANNER_UNIT,tempArr[1]);
				//Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK,tempArr[2]);
				Application.stageItem.set(VIEWTYPE.c_s_LESSON, 0);
				$('#btnWeek').addClass("active");
				$('#btnUnit').removeClass("active");
				Application.init(VIEWTYPE.c_s_PLANNER_WEEK);
			}
		}else{
			$("a[id^='week_']").removeClass("active");
			$(this).addClass("active");
			PlannerUnitView.activeIdx = tempArr[2];
			PlannerUnitView.renderInnerContents();
			var pos = $(this).position().left  + 10 + parseInt($(this).css("margin-right")) + ($(this).width()  + parseInt($(this).css("padding-right"))  + parseInt($(this).css("padding-left")))/2;
			
			$(".dash_lesson_container .page_arrow").animate({"left" : pos + "px"}, 300);
			PlannerView.resize();
		}
	});
}

/********************************************************************/
/*********************** PLANNER WEEK VIEW **************************/
/********************************************************************/
function PlannerWeekView () {}

PlannerWeekView.model = null;

PlannerWeekView.activeIdx = 0;
PlannerWeekView.unitNumber = '';
PlannerWeekView.weekNumber = '';
PlannerWeekView.itemID = '';
PlannerWeekView.gradeItemsData = {};

PlannerWeekView.init = function (model) {
	PlannerWeekView.unitNumber = model.unitNumber;
	PlannerWeekView.weekNumber = model.weekNumber;
	PlannerWeekView.itemID = model.itemID;
	PlannerWeekView.gradeItemsData = model.gradeItemsData;
	
	if (PlannerView.loadedInitially == true 
		&& PlannerWeekView.itemID != '' 
		&& PlannerWeekView.unitNumber != '' 
		&& PlannerWeekView.weekNumber != '') {
		
		var curUnit = _.where(model.plannerData, {'unitNumber':PlannerWeekView.unitNumber});		
		if (curUnit.length) {
			var currentUnit = curUnit[0].unitOrderNumber - 1;
		}
		else {
			var currentUnit = 0;
		}
		var sortedUnitArray = _.sortBy(model.plannerData, "unitOrderNumber");
		PlannerWeekView.model = sortedUnitArray[currentUnit];
		
		var curWeek = _.where(PlannerWeekView.model.week, {"weekNumber": PlannerWeekView.weekNumber});
		if (curWeek.length) {
			var curWeekOrderNum = curWeek[0].weekOrderNumber - 1;
			var curItem = _.where(curWeek[0].item, {"itemID": PlannerWeekView.itemID});
		
			if (curItem.length) {
				PlannerWeekView.activeIdx = curItem[0].itemNumber - 1;
			}
			else {
				PlannerWeekView.activeIdx = 0;
			}
		}
		else {
			var curWeekOrderNum = 0;
			PlannerWeekView.activeIdx = 0;
		}		
		var currentWeek = curWeekOrderNum;		
		Application.stageItem.set(VIEWTYPE.c_s_PLANNER_UNIT, currentUnit);
		Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK, currentWeek);		
	}
	else {
		var currentUnit = (Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT) != 0)?Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT):0;
		
		var sortedUnitArray = _.sortBy(model.plannerData, "unitOrderNumber");
		PlannerWeekView.model = sortedUnitArray[currentUnit];
		
		PlannerWeekView.activeIdx = (Application.stageItem.get(VIEWTYPE.c_s_LESSON) != 0)?Application.stageItem.get(VIEWTYPE.c_s_LESSON):0;
		
		var currentWeek = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);
	}
	
	PlannerView.loadedInitially = false;
		
	var checkLessonExist = PlannerWeekView.checkLessonExist(currentWeek, false);
	if(checkLessonExist){
		PlannerWeekView.render();
		//PlannerView.init(PlannerWeekView.model.week);
		PlannerView.init(model);
	}else{
		//Message.write("Lesson not found", Message.c_s_MESSAGE_TYPE_ALERT);
		PlannerView.alertPopUp("<p>"+PLANNER.c_s_LESSON_NOT_FOUND_TXT+"</p>");
		Application.viewType = VIEWTYPE.c_s_PLANNER_UNIT;
		Application.view = PlannerUnitView;
		Application.callView(Application.stageItem.get(Application.viewType));
	}
}

PlannerWeekView.checkLessonExist = function (currentWeek, flag){
	if(currentWeek < 0){
		flag = false;
	}else {
		flag = true;
		var sortedWeekArray = _.sortBy(PlannerWeekView.model.week, "weekOrderNumber");
		if (_.reject(sortedWeekArray[currentWeek].item, function(num){ return num.itemType == "assignment"; }).length > 0) {
			Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK, currentWeek);
		} else {
			currentWeek = currentWeek-1;
			PlannerWeekView.checkLessonExist(currentWeek, flag);
		}
    }
	return flag;
}

PlannerWeekView.render = function () {
	PlannerWeekView.renderNavButtons();
	PlannerWeekView.renderInnerContents();
	$("#btnTech").html(PLANNER.c_s_TEACH_BTTN);
	$("#teachButton").show();
	$("#main_container").removeClass("without_tech_button");
	
	
}

PlannerWeekView.renderNavButtons = function () {
	var currentUnit = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT);
	var currentWeek = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);
	var sortedWeekArray = _.sortBy(PlannerWeekView.model.week, "weekOrderNumber");              
	
	$("#navButtonArea").html(_.template($("#navButtonAreaTemplate").html(), {
		"data" : sortedWeekArray,
		"unitNumber": PlannerWeekView.model.unitNumber,
		"currentUnit": currentUnit,
		"currentWeek": currentWeek,
		"currentLesson": PlannerWeekView.activeIdx,                
		"plannerType": VIEWTYPE.c_s_PLANNER_WEEK
	}));
}

PlannerWeekView.renderInnerContents = function () {
	var currentUnit = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_UNIT);
	var currentWeek = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);
	var sortedWeekArray = _.sortBy(PlannerWeekView.model.week, "weekOrderNumber");
	
	var itemNumberArr = _.sortBy(_.reject(sortedWeekArray[currentWeek].item, function(num){ return num.itemType == "assignment"; }), "itemNumber");
	var lessonDesc = "";

	if(itemNumberArr.length > 0){
		var firstItemNumber = _.first(itemNumberArr);
		var lastItemNumber = _.last(itemNumberArr);
		
		lessonDesc = PLANNER.c_s_LESSON_TXT+": "+PlannerWeekView.model.unitNumber + "." + (((parseInt(sortedWeekArray[currentWeek].weekNumber)-1)*5)+parseInt(firstItemNumber.itemNumber)) + " - " + PlannerWeekView.model.unitNumber + "." + (((parseInt(sortedWeekArray[currentWeek].weekNumber)-1)*5)+parseInt(lastItemNumber.itemNumber));
	}
			
	$("#plannerHeader").html(lessonDesc);
	//Added
	$("#lessontoolslist").html(_.template($("#lessontoolslistTemplate").html(), {
		"data" : PlannerWeekView.model,
		"currentUnit": currentUnit,
		"currentWeek": currentWeek,
		"currentLesson": PlannerWeekView.activeIdx,                
		"plannerType": VIEWTYPE.c_s_PLANNER_WEEK
	}));
	
	$("#innerContentArea").html(_.template($("#innerContentAreaTemplate").html(), {
		"data" : itemNumberArr[PlannerWeekView.activeIdx].metadata,
		"currentUnit": currentUnit,
		"currentWeek": currentWeek,
		"currentLesson": PlannerWeekView.activeIdx,
		"plannerType": VIEWTYPE.c_s_PLANNER_WEEK
	}));
	
	Application.stageItem.set(VIEWTYPE.c_s_LESSON, PlannerWeekView.activeIdx);
	PlannerWeekView.bindEvent();
	PlannerView.bindTooltip();
}

PlannerWeekView.bindEvent = function(){
	
	$("a[id^='lesson_']").off('click').on('click', function(event){
            
		var dataValue = $(this).attr('id');
		var tempArr = dataValue.split("_");
		if($(this).hasClass("active")){
			//Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK,tempArr[1]);
			//Application.stageItem.set(VIEWTYPE.c_s_PLANNER_WEEK,tempArr[2]);
			
			//$('#btnWeek').addClass("active");
			//$('#btnUnit').removeClass("active");
			//Application.init(VIEWTYPE.c_s_PLANNER_WEEK);
			//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
		}else{
			$("a[id^='lesson_']").removeClass("active");
			$(this).addClass("active");                        
			PlannerWeekView.activeIdx = tempArr[2];
			PlannerWeekView.renderInnerContents();
			PlannerView.resize();
			var pos = $(this).position().left + 10  + parseInt($(this).css("margin-right")) + ($(this).width() + parseInt($(this).css("padding-left")) + parseInt($(this).css("padding-right")))/2;
			$(".dash_lesson_container .page_arrow").animate({"left" : pos + "px"}, 300);
		}
	});
	
	$("#btnTech").off("click").on("click", function(){
		//Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);
		//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
                var currentWeek = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);				
                var sortedWeekArray = _.sortBy(PlannerWeekView.model.week, "weekOrderNumber");
				
                var itemNumberArr = _.sortBy(_.reject(sortedWeekArray[currentWeek].item, function(num){ return num.itemType == "assignment"; }), "itemNumber");
				
                var currentItemId = itemNumberArr[PlannerWeekView.activeIdx].itemID;
				var currentUnitNumber = PlannerWeekView.model.unitNumber;
				var currentWeekNumber = sortedWeekArray[currentWeek].weekNumber;
				var rataBookObj = _.where(PlannerWeekView.gradeItemsData.item, {"itemID": currentItemId});
				var rataBookId = rataBookObj[0].lessonratabookitemID;
				
                LaunchGradeItem(currentUnitNumber,currentWeekNumber,currentItemId,"lesson",0,rataBookId);
                
	});
	$("#btnPreview").off("click").on("click", function(){
				var currentWeek = Application.stageItem.get(VIEWTYPE.c_s_PLANNER_WEEK);
                var sortedWeekArray = _.sortBy(PlannerWeekView.model.week, "weekOrderNumber");
                var itemNumberArr = _.sortBy(_.reject(sortedWeekArray[currentWeek].item, function(num){ return num.itemType == "assignment"; }), "itemNumber");
                var currentItemId = itemNumberArr[PlannerWeekView.activeIdx].itemID;				
				var currentUnitNumber = PlannerWeekView.model.unitNumber;
				var currentWeekNumber = sortedWeekArray[currentWeek].weekNumber;
				var rataBookId = '';
                LaunchGradeItem(currentUnitNumber,currentWeekNumber,currentItemId,"lesson",1,rataBookId);
	});
	$("#btnEmail").off("click").on("click", function(){
		//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
	});
	$("#btnPrint").off("click").on("click", function(){
		//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
	});
}