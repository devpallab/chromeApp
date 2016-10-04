// JavaScript
function SetUp () {
	this.model = null;
	this.sMode = SETUP.c_s_ASM_MANUAL;
	this.sSelectedTitlePriorChange = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	this.currentWeek = 0;
	this.init();
	this.CONSTANTS = {
		"c_s_GRADE_POPUP_TITLE":"Send GRADE first ?",
		"c_s_SEND_GRADE_POPUP_CONTENT": (
			"We recommend sending GRADE<br />" +
			"to the students before sending<br />" +
			"assignments. Sending GRADE will<br />" +
			"ensure that the assignments are<br />" +
			"properly leveled. Otherwise, default<br />" +
			"assignment levels will be sent.<br /><br />" +
			"<strong>Would you like to continue sending<br />" +
			"the assignments or cancel and<br />" +
			"send GRADE?</strong>"
		),
		"c_s_SEND_GRADE_POPUP_LBL_SENDBOYGRADE": "SEND BOY GRADE",
		"c_s_SEND_GRADE_POPUP_LBL_CONTINUE": "CONTINUE",
		"c_s_SEND_GRADE_POPUP_LBL_CANCEL": "CANCEL",
		"c_i_UNIT_NO": 1
	};
	this.bGradePopupSave = false;
}
SetUp.prototype = new ISeriesBase();

SetUp.prototype.init = function () {
	var oSelf = this,
		oLoaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>',
		bLoadMainTemplate = true;
		
	/*== show loader ==*/
	$('body').css('background-color','#FFFFFF');
	$("#main_container").css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(oLoaderImg);
	
	oSelf.getSettings(bLoadMainTemplate);
}

SetUp.prototype.getSettings = function (bLoadMainTemplate) {
	var oSelf = this,
		fScheduleCheck = function () {
			if (
				objSettingsData && 
				objCurrentWeekJsonData
			) {				
				oSelf.prepareToRender(bLoadMainTemplate);
			}
			else {
				setTimeout(fScheduleCheck, 100);
			}
		};
	
	// get current week
	$.nativeCall({
		'method':			'GetCurrentWeekForClass',
		'globalResource':	'objCurrentWeekJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {		
			// process data				
		}
	});
	
	//get class settings 
	$.nativeCall({
		'method':			'GetClassSettings',
		'globalResource':	'objSettingsData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			//process data
		}
	});
	
	fScheduleCheck();
}
SetUp.prototype.prepareToRender = function (bLoadMainTemplate) {
	var oSelf = this;
	oSelf.model = objSettingsData.Content || {};	
	oSelf.currentWeek = objCurrentWeekJsonData.Content.WeekNo || 0;
	/*== hide loader ==*/
	if (bLoadMainTemplate) {
		$("#main_container").removeAttr('style');
		$("#main_container").html(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		$('body').css('background-color','#E0E1E1');
		
		oSelf.render();
	}
	else {
		oSelf.renderCalendar();
	}								
	
	setTimeout(function () {
		oSelf.resize();	
	}, 100);
}

SetUp.prototype.render = function () {
	var oSelf = this,
		oData = oSelf.model;			
			
	oSelf.sMode = oData.AssignmentSendingMode ? SETUP.c_s_ASM_AUTO : SETUP.c_s_ASM_MANUAL;
	
	$("#main_container").html(
		_.template($("#mainTemplate").html())
	);
	
	$("#configContainer").html(
		_.template($("#configTemplate").html(),{"data": oData})
	);

	oSelf.renderCalendar();	

	//for auto save - save settings upon first time launch
	if(oData.DefaultValues == 'Y'){
		oSelf.submitSettings(oSelf);	
	}
	
	//disable mode and CR if assignments sent
	if(oSelf.currentWeek > 0){
		$("button.asm-manual, button.asm-auto").prop("disabled", true).removeClass("active");
		//disable CR switch IPP-6125/IPP-6132. This is in case of manual
		$("#crSwitch").prop("disabled", true);
	}

}

SetUp.prototype.renderCalendar = function () {
	var oSelf = this,
		oData = oSelf.model;
	
	$("#calendarContainer").html(
		_.template($("#calendarTemplate").html(),{"data": oData})
	);	
	
	oSelf.bindEvents();	
}

SetUp.prototype.resize = function() {
	var fWindowHeight = $(window).height(),
		fRightHeaderHeight = $(".aca-sett-heading").outerHeight(),
		oCalendarMainDiv = $(".academic-calender-container"),
		oLeftPanelMainDiv = $(".academic-block-wrapper");			
	
	$("body").css("overflow","hidden");
	oCalendarMainDiv.height(fWindowHeight - (fRightHeaderHeight + parseInt(oCalendarMainDiv.css('padding-top')) * 2)).css({"overflow-y": "auto"});
	oLeftPanelMainDiv.height(fWindowHeight - (fRightHeaderHeight + parseInt(oLeftPanelMainDiv.css('padding-top')) * 2)).css({"overflow-y": "auto"});	
}

// to set text attribute for automation testing IPP-
SetUp.prototype.setTextAttribute = function(elem){
	if(elem.parents(".onoffswitch").find("input").is(":checked")){
		elem.attr("text","On");
	}
	else{
		elem.attr("text","Off");
	} 
}

SetUp.prototype.bindEvents = function () {
	var oSelf = this;
	
	$(".app-configuration-settings input").off("change").on("change", function() {
		$("#saveBtn").removeClass("disabled");
	});
	
	$(".asm button").off("click").on("click", function() {
		oSelf.setMode.call(this, oSelf);
		$(".onoffswitch-inner").each(function(){
			oSelf.setTextAttribute($(this));
		})
	});
	
	$(".asm-manual").off("click").on("click", function() {
		oSelf.setMode.call(this, oSelf);
		$(".onoffswitch-inner").each(function(){
			oSelf.setTextAttribute($(this));
		})
	});
	
	$("#saveBtn").off("click").on("click", function() {
		oSelf.submitSettings.call(this, oSelf);
	});	
	
	$("#saveGlobalBtn").off("click").on("click", function() {
		oSelf.submitSettings.call(this, oSelf);
	});

	$(".blk-arrow").off("click").on("click", function() {
		oSelf.showHideInfo.call(this);
	});
	
	// if mode auto then freeze OF switch
	$("#ofSwitch").off("click").on("click", function() {
		if (oSelf.sMode == SETUP.c_s_ASM_AUTO) {
			$("#ofSwitch").removeAttr("checked");
		}
		oSelf.setTextAttribute($(this).parent().find(".onoffswitch-inner"));
		
	});
	
	// if mode auto OR if mode manual and assignments already sent then freeze CR switch 
	$("#crSwitch").off("click").on("click", function() {
		if (oSelf.sMode == SETUP.c_s_ASM_AUTO || (oSelf.sMode == SETUP.c_s_ASM_MANUAL && (oSelf.currentWeek > 0))) {
			$("#crSwitch").removeAttr("checked");
		}
		oSelf.setTextAttribute($(this).parent().find(".onoffswitch-inner"));
	});	
	
	// if mode auto then freeze Library response and Essay writing switch
	$("#lrSwitch").off("click").on("click", function() {
		if (oSelf.sMode == SETUP.c_s_ASM_AUTO) {
			$("#lrSwitch").removeAttr("checked");
		}
		oSelf.setTextAttribute($(this).parent().find(".onoffswitch-inner"));
		
	});
	$("#ewSwitch").off("click").on("click", function() {
		if (oSelf.sMode == SETUP.c_s_ASM_AUTO) {
			$("#ewSwitch").removeAttr("checked");
		}
		oSelf.setTextAttribute($(this).parent().find(".onoffswitch-inner"));
		
	});
	
	
	$("#projection-switch").off("click").on("click", function() {
		
		oSelf.setTextAttribute($(this).parent().find(".onoffswitch-inner"));
	});	
	
	$(".week-period").off("click").on("click", function() {
		oSelf.setPeriod.call(this, oSelf);
	});
	
	$(".week-no").off("click").on("click", function() {
		oSelf.setWeek.call(this, oSelf);
	});

	/* $(".ainput-field").off("keyup input").on("keyup input", function() {
		oSelf.setPeriodTitle.call(this, oSelf);
	}); */
	
	$(".week-period-no").off("blur").on("blur", function() {
	
		oSelf.validatePeriodTitle.call(this, oSelf);
	});
	
	$("#saveCalendarBtn").off("click").on("click", function() {
		oSelf.submitCalendarSettings.call(this, oSelf);
	});
	
	$("#saveCalendarGlobalBtn").off("click").on("click", function() {
		oSelf.submitCalendarSettings.call(this, oSelf);
	});
	
	$("#ResetBtn").off("click").on("click", function() {
		var oElem = this,
			oSelectedTab = $(".academic-right-selecter .iperiod");
		
		if ($(oElem).hasClass("disabled")) {
			return;
		}		
		if (oSelectedTab.length == 0) {
			oSelf._alert({
				divId:		'dialog-message',
				message:	SETUP.c_s_SELECT_TAB_MSSG
			});
			return;
		}
		
		oSelf._confirm({
				divId:	'dialog-message',
				message:	SETUP.c_s_RESET_CONFIRM_TXT,
				yes:		function () {
					oSelf.resetCalendarSettings.call(oElem, oSelf);
				}
	    });		
	});
}

SetUp.prototype.setPeriodTitle = function(oSelf) {
	var sTitle = $(this).val(),
		oSelectedTab = $(".academic-right-selecter .iperiod"),
		oColorClass = oSelectedTab.length ? oSelectedTab.attr("class").match(/color\d/)[0] : GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oSelectedWeeks = oColorClass ? $(".academic-left-selecter ."+oColorClass) : [];	
	
	// set title to tab
	oSelectedTab.find(".week-period-no").html(sTitle);
	
	// enable save button on editing title
	if (sTitle != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK && oSelectedTab.length && oSelectedWeeks.length) {
		$("#saveCalendarBtn").removeClass("disabled"); $("#saveCalendarGlobalBtn").removeClass("disabled");		
	}
}

SetUp.prototype.validatePeriodTitle = function(oSelf) {
	var sTitle = $(this).html().trim(),
		oSelectedTab = $(".academic-right-selecter .iperiod"),
		oColorClass = oSelectedTab.length ? oSelectedTab.attr("class").match(/color\d/)[0] : GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oSelectedWeeks = oColorClass ? $(".academic-left-selecter ."+oColorClass) : [];
	
	// if title is blank then de select tab and week if any
	if (sTitle == GENERAL.c_s_SPECIAL_CHARACTERS_BLANK && oSelectedTab.length) {	
		oSelectedTab.removeClass("iperiod");		
		$(".academic-left-selecter ."+oColorClass).each(function() {
			$(this).removeClass("selected "+oColorClass).removeClass("active");
		});
		$(this).prop("contenteditable",false);
	}
}

/**
 * On Period Tab Click
 * @method setPeriod 
 * @return 
 */
SetUp.prototype.setPeriod = function(oSelf) {

	var sSelectedColor = $(this).attr("class").match(/color\d/)[0];
	// if previous tab not yet finished then return
	if ($(this).prev().length && $(this).prev().find(".week-period-no").text().trim() == GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		return;
	}
	// if no week selected for previous tab then return
	if ($(this).prev().length) {
		var sColorClass = $(this).prev().attr("class").match(/color\d/)[0];
		if (sColorClass && !$(".academic-left-selecter ."+sColorClass).length) {
			return;
		}
	}	
	
	// if already selected then deselect
	if ($(this).hasClass("iperiod")) {		
		// deselect all related week tiles
		$(".academic-left-selecter .week-no").removeClass("active");
		
		$(this).removeClass("iperiod");
		/* $(".ainput-field").val(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK).blur();
		$(".ainput-field").attr("readonly","true"); */
		$(this).find(".week-period-no").prop("contenteditable",false).blur();
		return;
	}	
	
	// highlight that tab & fill textbox with that title & set focus
	oSelf.sSelectedTitlePriorChange = $(this).find(".week-period-no").text();
	$(".week-period").removeClass("iperiod");
	//readonly all other tabs
	$(".week-period").find(".week-period-no").prop("contenteditable",false).blur();
	$(this).addClass("iperiod");
	//make the current selected tab editable
	$(this).find(".week-period-no").prop("contenteditable",true).focus();
	
	
	
	//$(".ainput-field").removeAttr("readonly").focus().val(oSelf.sSelectedTitlePriorChange);
	
	// enable reset button
	if (oSelf.sSelectedTitlePriorChange != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		$("#ResetBtn").removeClass("disabled");
	}
	else {
		$("#ResetBtn").addClass("disabled");
	}
	
	// highlight all related week tiles
	$(".academic-left-selecter .week-no").removeClass("active");
	if (sSelectedColor && $(".academic-left-selecter ."+sSelectedColor).length) {
		$(".academic-left-selecter ."+sSelectedColor).addClass("active");
	}
	
	// if middle tab is selected then disable title edit option
	if ($(this).next().length && $(this).next().find(".week-period-no").text().trim() != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		//$(".ainput-field").attr("readonly","true");
		$(this).find(".week-period-no").prop("contenteditable",false);
	}
	else {
		//$(".ainput-field").removeAttr("readonly");
		$(this).find(".week-period-no").prop("contenteditable",true);
	}
}

SetUp.prototype.setWeek = function(oSelf) {
	var sColorClass = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oSelectedTab = $(".academic-right-selecter .iperiod"),
		iTabIndex = oSelectedTab.index() + 1,
		oNextTab = $(".academic-right-selecter .week-period:eq("+iTabIndex+")");	
	
	// if already selected then de select consecutively
	if ($(this).hasClass("selected") && oSelectedTab.length && ($(this).next().length === 0 || !$(this).next().hasClass("selected"))) {
		sColorClass = $(this).attr("class").match(/color\d/)[0];
		
		// can be changed only if responsible tab is selected
		if (sColorClass == oSelectedTab.attr("class").match(/color\d/)[0]) {
			$(this).removeClass("selected "+sColorClass).removeClass("active");
			$("#saveCalendarBtn").removeClass("disabled"); $("#saveCalendarGlobalBtn").removeClass("disabled");
			$("#ResetBtn").removeClass("disabled");
		}
		return;
	}
	
	// check if selected tab is not the latest one then return
	if (oNextTab.length && oNextTab.find(".week-period-no").text() != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		return;
	}
		
	/* if (!$(this).hasClass("selected") && oSelectedTab.length && $(".ainput-field").val().trim() != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK)  */
	if (!$(this).hasClass("selected") && oSelectedTab.length) {		
		sColorClass = oSelectedTab.attr("class").match(/color\d/)[0];		
		if ($(this).prev().length === 0 || $(this).prev().hasClass("selected")) {
			$(this).addClass("selected "+sColorClass);
			$("#saveCalendarBtn").removeClass("disabled"); $("#saveCalendarGlobalBtn").removeClass("disabled");
			$("#ResetBtn").removeClass("disabled");
		}
	}		
}

SetUp.prototype.resetCalendarSettings = function(oSelf) {
	var oResetBtn = this,
		sColorClass = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oSelectedTab = $(".academic-right-selecter .iperiod"),
		iLastElem = $(".academic-left-selecter .week-no").length,
		iTabIndex = oSelectedTab.index() + 1,
		oElem = null;		
	
	if (oSelectedTab.length) {
		sColorClass = oSelectedTab.attr("class").match(/color\d/)[0];
		
		// remove title for that period
		oSelectedTab.find(".week-period-no").text(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		$(".week-period").removeClass("iperiod");		
		//$(".ainput-field").val(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		//$(".ainput-field").attr("readonly","true");
		
		// remove title for following period
		for (var i = iTabIndex; i <= $(".academic-right-selecter .week-period").length; i++) {
			$(".academic-right-selecter .week-period:eq("+i+")").find(".week-period-no").text(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		}
		
		// de-select weeks for that period
		$(".academic-left-selecter ."+sColorClass).each(function() {
			$(this).removeClass("selected "+sColorClass).removeClass("active");
			iLastElem = $(this).index() + 1;
		});
		
		// de-select weeks for following periods
		for (var i = iLastElem; i <= $(".academic-left-selecter .week-no").length; i++) {
			oElem = $(".academic-left-selecter .week-no:eq("+i+")");
			if (oElem.hasClass("selected")) {
				sColorClass = oElem.attr("class").match(/color\d/)[0];
				oElem.removeClass("selected "+sColorClass).removeClass("active");	
			}
		}
		
		// let user save after reset
		$("#saveCalendarBtn").removeClass("disabled"); $("#saveCalendarGlobalBtn").removeClass("disabled");
		$("#ResetBtn").addClass("disabled");
	}	
	
}

SetUp.prototype.showHideInfo = function() {
	var id = $(this).attr("id"),
		oParentDiv = $(this).closest(".academic-block-acc");
		iInitialHeight = oParentDiv.height(); // save the academic-block-acc height 
		
	if (oParentDiv.hasClass("active")) {
		//$(".academic-cont").slideUp(500);
		$(".academic-cont").removeClass("slided");
		//hide overlay
		$(".academic-calender-container").find("#academic-calender-container-overlay").hide();
		oParentDiv.removeClass("active");
	
	}
	else {
		//only one popup active at a time, hide all others
		$(".academic-cont").hide().removeClass("slided");
		
		//show overlay
		$(".academic-calender-container").find("#academic-calender-container-overlay").show();
		
		$(".academic-block-acc").removeClass("active");
		oParentDiv.addClass("active");
		
		//reset the academic-block-acc height - prevent height expanded after click
		oParentDiv.height(iInitialHeight);
		
		//make the popup appear from same vertical position as its container academic-block-acc
		$(".academic-cont").css({top:oParentDiv.position().top});
		
		//$(".academic-cont."+id).slideDown(500);
		$(".academic-cont").addClass("slided");
		
		//set content
		var oElemActiveId = oParentDiv.find(".blk-arrow").attr("id");
		
		switch(oElemActiveId){
			case "row1":
			$(".academic-cont p").html(SETUP.c_s_ASM_INFO);
			break;
			
			case "row2":
			$(".academic-cont p").html(SETUP.c_s_AOFS_INFO);
			break;
			
			case "row3":
			$(".academic-cont p").html(SETUP.c_s_SCR_INFO);
			break;
			
			case "row4":
			$(".academic-cont p").html(SETUP.c_s_CGN_INFO);
			break;
			
			case "row5":
			$(".academic-cont p").html(SETUP.c_s_SDS_INFO);
			break;
			
			case "row6":
			$(".academic-cont p").html(SETUP.c_s_PS_INFO);
			break;
			
		}
	}
}

SetUp.prototype.setMode = function(oSelf) {
	if ($(this).hasClass("active")) {
		return;
	}
	
	$("#saveBtn").removeClass("disabled");
	
	if ($(this).hasClass("asm-auto")) {
		oSelf.sMode = SETUP.c_s_ASM_AUTO;
		$(".asm-manual").removeClass("active").addClass("disabled");
		$(this).addClass("active").removeClass("disabled");
		$("#ofSwitch").removeAttr("checked").addClass("inactive");		
		$("#crSwitch").removeAttr("checked").addClass("inactive");		
		//for library response and essay writing
		$("#lrSwitch").removeAttr("checked").addClass("inactive");		
		$("#ewSwitch").removeAttr("checked").addClass("inactive");		
	}
	else {
		oSelf.sMode = SETUP.c_s_ASM_MANUAL;
		$(".asm-auto").removeClass("active").addClass("disabled");
		$(this).addClass("active").removeClass("disabled");
		$("#ofSwitch").removeClass("inactive");
		$("#crSwitch").removeClass("inactive");
		//for library response and essay writing
		$("#lrSwitch").removeClass("inactive");
		$("#ewSwitch").removeClass("inactive");
	}
}

SetUp.prototype.submitSettings = function (oSelf, bSaveAutoMode, checkAssignAutoScoreGradeableItemsCallback) {

	var	bSaveOnPageLaunch = (this == oSelf),
		sASM = (oSelf.sMode == SETUP.c_s_ASM_MANUAL) ? "0" : "1",
		sAOFS = $("#ofSwitch").is(":checked") ? "1" : "0",
		sSCR = $("#crSwitch").is(":checked") ? "1" : "0",
		/* sCGN = $("input[name='graph-op']:checked").val(), */
		sCGN = "0", // only '0' (the default which used to exist earlier - 'class only' value) to be sent
		sSDS = $("input[name='stud-data-op']:checked").val() || "0",
		/* sPS = $("#projection-switch").is(":checked") ? "1" : "0", */
		sPS = "0",
		sALRS = $("#lrSwitch").is(":checked") ? "1" : "0",
		sANERS = $("#ewSwitch").is(":checked") ? "1" : "0",
		sSaveGlobally = (!bSaveOnPageLaunch) ? $(this).attr("data-save-global") : "n";
		//for auto save
		if(!bSaveOnPageLaunch){
			if ($(this).hasClass("disabled")) {
				return;
			}
		}
	/*== IPP-6235/ IPP-6290 ==*/
	if ((oSelf.sMode == SETUP.c_s_ASM_AUTO) && !oSelf.bGradePopupSave && !bSaveAutoMode && (oSelf.currentWeek == '0')) {		
		oSelf.showGradePopup();
		return false;
	}  
	
	$.nativeCall({
		'method':			'SaveClassSettings',
		'inputParams': 		[sASM, sAOFS, sSCR, sCGN, sSDS, sPS, sALRS, sANERS, sSaveGlobally],
		'globalResource':	'objSaveClassSettingsResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {	
			//for auto save - prevent dialog
			if(!bSaveOnPageLaunch){
				oSelf._alert({
					divId:		'dialog-message',
					message:	SETUP.c_s_SAVED_SETTINGS_MSG
				});
				$("#saveBtn").addClass("disabled");
			}
			
			//if save called through popup
			if(bSaveAutoMode){
				checkAssignAutoScoreGradeableItemsCallback();
				/*== IPP-6235/ IPP-6290 ==*/
				oSelf.bGradePopupSave = true; 
			}
		},
		'onError': function(){
			if(objSaveClassSettingsResponse.Error.ErrorCode == "U1117"){
				//for auto save - prevent dialog
				if(!bSaveOnPageLaunch){
					oSelf._alert({
						divId:		'dialog-message',
						message:	objSaveClassSettingsResponse.Error.ErrorUserDescription
					});
				}
			}
		}
	});
};

	
//getAssignmentListInfo
SetUp.prototype.getAssignmentListInfo = function(callback){
	var oSelf = this;
	$.nativeCall({
		'method':			'GetAssignmentListInfo',
		'inputParams': 		[oSelf.CONSTANTS.c_i_UNIT_NO],
		'globalResource':	'objAssignmentListJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			//process data - filter by  "ItemSubject": "boy"
			var oAssignmentListInfoData = [];
			for(iI=0; iI<objAssignmentListJsonData.Content.length; iI++){
				if(objAssignmentListJsonData.Content[iI].ItemSubject == "boy"){
					oAssignmentListInfoData.push({
						"ItemID":objAssignmentListJsonData.Content[iI].ItemID,
						"StudentIDs":'',
						"AssignToWholeClass":"true"
						
						});
				}
			}
			callback(oAssignmentListInfoData);
		}
	});
};

//assignGradeableItem
SetUp.prototype.assignGradeableItem = function(poAssignmentListInfoData, callback){
	var oSelf = this,
		oAssignmentObj = poAssignmentListInfoData,
		assignObj = {"studentItems": oAssignmentObj},
		data  = (JSON.stringify(assignObj)).replace(/"/g, '\\"');
		
	$.nativeCall({
		'method':			'AssignGradeableItem',
		'inputParams': 		[data],
		'globalResource':	'objAssignGradeableItemResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {	
			callback();
		},
		'onError': function(){
			if(objSaveClassSettingsResponse.Error.ErrorCode == "U1117"){
				
			}
		}
	}); 
};
 
//CheckAssignAutoScoreGradeableItems
SetUp.prototype.checkAssignAutoScoreGradeableItems = function(){
	//var oAssignmentObj = {};
	var oSelf = this;
	$.nativeCall({
		'method':			'CheckAssignAutoScoreGradeableItems',
		'globalResource':	'objCheckAssignAutoScoreGradeableItemsResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			//close popup
			oUtility.unblockElement({ 'section': '#main_container' });
			//disable mode 
			$("button.asm-manual, button.asm-auto").prop("disabled", true).removeClass("active");
			//IPP-6246 
			$("#saveBtn").addClass("disabled");
		},
		'onError': function(){
			if(objCheckAssignAutoScoreGradeableItemsResponse.Error.ErrorCode == "U1117"){
				
			}
		}
	}); 
};

//send BOY
SetUp.prototype.sendBOYGrade = function () {
	var oSelf = this,
		oParams = {}; // psUnitNumber, psWeekNumber
		
	//call getAssignmentListInfo and pass the data to assignBOY
	oSelf.getAssignmentListInfo(function(oAssignmentListInfoData){
		oSelf.assignGradeableItem(oAssignmentListInfoData, function(){
			oSelf.submitSettings(oSelf, true, oSelf.checkAssignAutoScoreGradeableItems);
		});
	});
	
};

SetUp.prototype.showGradePopup = function (poPopupConfig) {
	var oSelf = this,
		poPopupConfig = poPopupConfig || {};
		
	oUtility.blockElement({
		'section':			'#main_container',
		'click-to-hide': 	false,
		'message':    		_.template(
			$('#dialog-message-auto').html(),
			{ 
				'title':		poPopupConfig.title || oSelf.CONSTANTS.c_s_GRADE_POPUP_TITLE,
				'content':		poPopupConfig.content ||  oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_CONTENT,
				'btnSendBOY':	poPopupConfig.btnSendBOY || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_SENDBOYGRADE,
				'btnContinue':	poPopupConfig.btnContinue || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CONTINUE,
				'btnCancel':	poPopupConfig.btnCancel || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CANCEL
				
			}
		),
		'after-load':		function () {
			$('#btnSendBOY')
				.off('click')
				.on('click', function () {
					//call AssignGradeableItem, CheckAssignAutoScoreGradeableItems
					oSelf.sendBOYGrade();
					
				});
			$('#btnContinuePopUp')
				.off('click')
				.on('click', function () {
					// call checkAssignAutoScoreGradeableItems
					oSelf.submitSettings(oSelf, true, oSelf.checkAssignAutoScoreGradeableItems);
					
				});
			$('#btnCancelPopUp, #btnClosePopUp')
				.off('click')
				.on('click', function () {
					oUtility.unblockElement({ 'section': '#main_container' });
				});
		},
		'foreground-color':	'none',
		'background-color':	'#030303',
		'opacity':			0.5,
		'box-style':		{
			'height':			poPopupConfig.height || '306px',
			'width':			poPopupConfig.width || '375px',
			'line-height':		'15px',
			'opacity':			1,
			'user-select':		'none',
			'-moz-user-select':	'none'
		}
	});	
}

SetUp.prototype.sendAssignments = function () {	
	/* TODO */
}

SetUp.prototype.submitCalendarSettings = function (oSelf) {
	var	oElem = $(this),
		oCalendar = {},
		aWeek = [],
		aPeriods = [],		
		sColorClass = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sPeriodTitle = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,				
		sACJ = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSaveGlobally = oElem.attr("data-save-global"),
		bResetBtn = (oElem.attr("id") == "ResetBtn"),		
		bBlankPeriod = 0,
		oLatestPeriod = null,
		bLoadMainTemplate = false,
		fSaveCallback = function () {
			sACJ = encodeURIComponent(JSON.stringify(aPeriods));
			
			// if there is any blank period then remove it
			if (oLatestPeriod != null) {
				/* if ($(".ainput-field").val() == oLatestPeriod.find(".week-period-no").text()) {
					$(".ainput-field").val(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
				} */
				oLatestPeriod.find(".week-period-no").text(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
				oLatestPeriod.removeClass("iperiod");				
			}
	
			$.nativeCall({
				'method':			'SaveClassCalendarSettings',
				'inputParams': 		[sACJ, sSaveGlobally],
				'globalResource':	'objSaveClassCalendarSettingsResponse',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,
				'onComplete':		function () {					
					oSelf._alert({
						divId:		'dialog-message',
						message:	bResetBtn ? SETUP.c_s_RESET_CALENDAR_SETTINGS_MSG : SETUP.c_s_SAVED_CALENDAR_SETTINGS_MSG
					});
					// render with updated data
					oSelf.getSettings(bLoadMainTemplate);
				}
			});
		};

	if (oElem.hasClass("disabled")) {
		return;
	}
	oElem.addClass("disabled");
		
	$(".week-period-no").each(function() {
		sPeriodTitle = $(this).text().trim();		
		if (sPeriodTitle == GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
			return;
		}
		
		aWeek = [];
		sColorClass = $(this).closest(".week-period").attr("class").match(/color\d/)[0];
		
		$(".academic-left-selecter").find("."+sColorClass).each(function(){
			aWeek.push(parseInt($(this).find(".weekend-no").text().trim()));
		})
		
		if (aWeek.length) {
			oCalendar = {
				"t" : encodeURIComponent(sPeriodTitle),
				"wr" : aWeek
			};
			aPeriods.push(oCalendar);
		}
		else {
			bBlankPeriod = 1;
			oLatestPeriod = $(this).parent();
		}		
	});

	if (bBlankPeriod) {
		 var sToReplace = "%d";
		 var oElemWeekPeriodNoText = $(".week-period-no").not(":empty").last().text().trim();
		 if(oElemWeekPeriodNoText == ""){ 
			oElemWeekPeriodNoText = "period";
			sToReplace = "\"%d\"";
		}
		 var sMsg = SETUP.c_s_BLANK_PERIOD_CONFIRM_TXT.replace(new RegExp(sToReplace, 'g'), oElemWeekPeriodNoText);	
		 oSelf._confirm({
				divId:	'dialog-message',
				message:	sMsg,
				yesLabel: "CONTINUE",
				noLabel : "CANCEL",
				yes:		function () {
					fSaveCallback();
				},
				no:			function () {
					oElem.removeClass("disabled");
					$(".week-period-no").not(":empty").last().parent().trigger("click");
				}
	    }); 
	}
	else {
		fSaveCallback();
	}	
}
