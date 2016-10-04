/**
 * Instructor View Connect JS
 * @class ConnectView
 * @module Connect
 * @constructor
 */
var ConnectView = function () {	
	this.model = null;
	this.viewType = null;	
};

/**
 * Initialize Connect Model
 * @method init
 * @param {object} model
 * @return 
 */
ConnectView.init = function (model) {
	var oSelf = this;
    oSelf.model = model;
	
	if (oSelf.model.ConnectData == 'poll') {
		oSelf.viewType = new PollView(model);
		oSelf.viewType.init();
	}else{
		oSelf.viewType = new BuzzView(model);
		oSelf.viewType.init();
	}
};

/**
 * CloseWebView function called
 * @method closeConnectWindow
 * @return 
 */
ConnectView.closeConnectWindow = function (oSelf) {
	HideNativeBottomBar(false);
	if (oPlatform.isDevice()) {
		CloseWebView();
	}
	else {
		CloseConnectWindow();
	}
}


/**
 * View Type Poll
 * @class PollView
 * @module PollView
 * @constructor
 */
var PollView = function (model) {	
	this.model = model;
	this.sendPollView = null;
	this.bNextBttnEnabled = false;
};
PollView.prototype = new ISeriesBase();
/**
 * Initialize PollView
 * @method init 
 * @return 
 */
PollView.prototype.init = function () {
	var oSelf = this;

	/*== delete instance if any ==*/	
	if (oSelf.sendPollView != null) {
		oSelf.sendPollView = null;
		delete oSelf.sendPollView;
	}
	oSelf.bNextBttnEnabled = false;
	
	oSelf.getPollList();
}

/**
 * GetPollList Service Call PollView
 * @method getPollList
 * @return 
 */
PollView.prototype.getPollList = function () {
	var oSelf = this,
		oLoaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
	
	objPollListData = null; // reset		
	
	/*== show loader ==*/
	$('body').css('background-color','#FFFFFF');
	Application.mainContainer.css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(oLoaderImg);
				
	$.nativeCall({
		'method':			'GetPollList',
		'globalResource':	'objPollListData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			/*== hide loader ==*/
			Application.mainContainer.removeAttr('style');
			Application.mainContainer.html(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
			$('body').css('background-color','#E0E1E1');
					
			oSelf.render();
			oSelf.bindEvents();
		}
	});	
	
}

/**
 * Render PollView
 * @method render 
 * @return 
 */
PollView.prototype.render = function () {
	var oSelf = this,
		oFormData = {
			"pollID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		};
	
	/*== render main template ==*/
	Application.mainContainer.html(_.template($("#pollMainTemplate").html()));
	
	/*== render header ==*/
	$("#headerpanel").html(
		_.template($("#pollHeaderTemplate").html())
	);
	
	/*== render poll list ==*/
	$("#pollList").html(
		_.template($("#pollListTemplate").html(),{
			data : objPollListData.Content
		})
	);
	
	/*== render poll form ==*/
	$("#pollForm").html(
		_.template($("#pollFormTemplate").html(),{
			data : oFormData
		})
	);
	
	setTimeout(function () {
		oSelf.resize();
	}, 100);
		
}

/**
 * Bind Events PollView
 * @method bindEvents 
 * @return 
 */
PollView.prototype.bindEvents = function () {
	var oSelf = this,
		sInputVal = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;

	$("#bttnCloseConnect").off("click tap").on("click tap", function () {
		ConnectView.closeConnectWindow();
	});
	
	$("#cancelBttn").off("click tap").on("click tap", function () {
		oSelf.cancelEdit.call(this, oSelf);
	});
	
	$("#questionBox").off("keyup input").on("keyup input", oSelf.submitEnable);
	
	$("input.poll-option").off("keyup input").on("keyup input", oSelf.submitEnable);
	
	$(".addInputBox").off("click tap").on("click tap", function () {
		oSelf.appendInputBox.call(this, oSelf, sInputVal); 
	});
	
	$(".removeInputBox").off("click tap").on("click tap", function () {
		oSelf.appendInputBox.call(this, oSelf, sInputVal); 
	});
	
	$(".poll-name").off("click tap").on("click tap", function () {
		oSelf.getPollInfo.call(this, oSelf); 
	});
	
	$(".delete_icon").off("click tap").on("click tap", function () {
		var oElem = this
		oSelf._confirm({		
			'title':	'Are you sure?',
			'divId':	'dialog-message',
			'message':	CONNECT.c_s_CONFIRM_DELETE_MSG,
			'yes': function(){
				oSelf.deletePollInfo.call(oElem, oSelf);
			}
		});		 
	});
	
	/*== Next Button Click ==*/
	$("#nextBttn").off('click').on('click', function () {
		oSelf.submitPoll.call(this, oSelf);
	});
}

/**
 * DeletePollInfo Service Call PollView
 * @method deletePollInfo
 * @return 
 */
PollView.prototype.deletePollInfo = function (oSelf) {
	var oElem = this,
		sPollId = $(oElem).attr('data-id'), 
		sTitle = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK, 
		sQuestion = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK, 
		sAnswers = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK, 
		bDeletePoll = 1;
	
	objUpdatePollResponse = null; // reset	
				
	$.nativeCall({
		'method':			'UpdatePoll',
		'inputParams':		[sPollId, sTitle, sQuestion, sAnswers, bDeletePoll],
		'globalResource':	'objUpdatePollResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			if ($("#pollID").val() == sPollId)	{
				oSelf.clearForm();
			}
			$(oElem).closest(".poll-list-cont").remove();
		}
	});	
}

/**
 * GetPollInfo Service Call PollView
 * @method getPollInfo
 * @return 
 */
PollView.prototype.getPollInfo = function (oSelf) {
	var oElem = this,
		sPollId = $(oElem).attr('id');
	
	objPollInfoData = null; // reset	
				
	$.nativeCall({
		'method':			'GetPollInfo',
		'inputParams':		[sPollId],
		'globalResource':	'objPollInfoData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'beforeSend':		function () {
			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="loading" />',
				'background-color': 'none',
				'click-to-hide': false,
				'opacity': 0.5
			});
		},
		'onComplete':		function () {
			oUtility.hideLoader();
			oSelf.clearForm();
			oSelf.populateForm();
		}
	});	
}

/**
 * Populate Poll Form with Data PollView
 * @method populateForm
 * @return 
 */
PollView.prototype.populateForm = function () {
	var oSelf = this,
		oData = objPollInfoData.Content,
		oChoices = JSON.parse(decodeURIComponent(oData.PollChoices));		
	
	$(".pollview-form h2").text(CONNECT.c_s_EDIT_POLL_TITLE);
	$("#cancelBttn").show();
	$("#pollID").val(oData.PollID);
	$("#questionBox").val(CodeToSpecialChar(decodeURIComponent(oData.PollQuestion)));
	
	$.each(oChoices, function (k, choice) {
		if ($(".poll-option:eq("+k+")").length) {
			$(".poll-option:eq("+k+")").val(CodeToSpecialChar(choice));
		}
		else {
			oSelf.appendInputBox(oSelf, CodeToSpecialChar(choice));
		}
	});
	oSelf.submitEnable();
	oSelf.resize();
}

/**
 * Cancel Edit PollView
 * @method cancelEdit
 * @param oSelf 
 * @return 
 */
PollView.prototype.cancelEdit = function (oSelf) {
	var oElem = this;
	
	$(oElem).hide();
	oSelf.clearForm();
}

/**
 * Clear Form PollView
 * @method clearForm 
 * @return 
 */
PollView.prototype.clearForm = function () {
	var oSelf = this,
		oFormData = {
			"pollID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		};
		
	/*== render poll form ==*/
	$("#pollForm").html(
		_.template($("#pollFormTemplate").html(),{
			data : oFormData
		})
	);
	oSelf.bindEvents();
	oSelf.resize();
	oSelf.bNextBttnEnabled = false;
}

/**
 * Append/Remove Input Box PollView
 * @method appendInputBox 
 * @return 
 */
PollView.prototype.appendInputBox = function (oSelf, sInputVal) {
	var oElem = this,
		oInputBox = $(".poll-option"),
		oForm = $(".pollview-form"),
		oNewInputBox = null,
		oBoxCont = null,
		oDiv = null,
		oNewAddBttn = null,
		oNewRemoveBttn = null,
		oNewRemoveBttnTxt = null;
		
	if ($(oElem).hasClass('addInputBox') && oInputBox.length == CONNECT.c_s_MAX_INPUT) {
		return;
	}
	
	if ($(oElem).hasClass('addInputBox') || sInputVal) {
		oBoxCont = document.createElement("div");
		oBoxCont.setAttribute("class","input-box-cont");
		
		oDiv = document.createElement("div");
		oDiv.setAttribute("class","text_box_area text_box_area_ct");
			
		/*== Delete Button ==*/
		oNewRemoveBttn = document.createElement("div");
		oNewRemoveBttn.setAttribute("class","right removeInputBox");
		oNewRemoveBttnTxt = document.createTextNode("-");		
		oNewRemoveBttn.appendChild(oNewRemoveBttnTxt);		
		oBoxCont.appendChild(oNewRemoveBttn);
		
		/*== Add Button ==*/
		if (oInputBox.length < 3) {
			oNewAddBttn = document.createElement("div");
			oNewAddBttn.setAttribute("class","right addInputBox");
			oNewAddBttnTxt = document.createTextNode("+");		
			oNewAddBttn.appendChild(oNewAddBttnTxt);
			oBoxCont.appendChild(oNewAddBttn);
		}
		
		oNewInputBox = document.createElement("input");
		oNewInputBox.setAttribute("class","poll-option");
		oNewInputBox.setAttribute("autocomplete","off");
		oNewInputBox.setAttribute("autocorrect","off");
		oNewInputBox.setAttribute("autocapitalize","off");
		oNewInputBox.setAttribute("spellcheck","off");
		oNewInputBox.setAttribute("value",sInputVal);
		oDiv.appendChild(oNewInputBox);
		oBoxCont.appendChild(oDiv);
		
		oForm.append(oBoxCont);
		oSelf.bindEvents();
	}	
	else if ($(oElem).hasClass('removeInputBox')) {
		$(oElem).closest('.input-box-cont').remove();
	}
}

/**
 * Render PollView
 * @method resize 
 * @return 
 */
PollView.prototype.resize = function () {
	var fWindowHeight = $(window).height(),
		fHeaderHeight = $(".top_navbar").outerHeight(),
		fGappingHeight = (parseInt($(".view_assignment").css('padding-top')) * 2) + parseInt($(".view_assignment_container_part").css('margin-top')),
		fBottomBarHeight = $(".bottom_button_area").outerHeight(),
		oPollForm = $(".pollview-form"),
		fPaddingHeight = parseInt(oPollForm.css('padding-top')) * 2,
		fReadingHeaderHeight = $(".outside_reading_heading").outerHeight(),
		fPollListHeight = fWindowHeight - (fHeaderHeight + fGappingHeight + fReadingHeaderHeight + 10);		
	
	$("body").css("overflow","hidden");
	$(".content_space").height(fWindowHeight - (fHeaderHeight + fGappingHeight + 10));
	oPollForm.css('height',fWindowHeight - (fHeaderHeight + fGappingHeight + fBottomBarHeight + fPaddingHeight + 10));
	$(".outside_reading_cont_inner4poll").height(fPollListHeight);
	$(".outside_reading_cont_inner4poll").css({"max-height": fPollListHeight, "overflow-y": "auto"});
}

/**
 * PollView Enable Next Button
 * @method bindEvents 
 * @return 
 */
PollView.prototype.submitEnable = function () {
	var oSelf = this,
		iOptionsCnt = 0;

	$("input.poll-option").each(function () {
		if ($.trim($(this).val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
			iOptionsCnt++;
		}
	});
	
	if ($.trim($("#questionBox").val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK && 
		iOptionsCnt >= 2) {
		$("#nextBttn").removeClass('btndisabled disabled');
		oSelf.bNextBttnEnabled = true;
	}
	else {
		$("#nextBttn").addClass('btndisabled disabled');
		oSelf.bNextBttnEnabled = false;
	}
}

/**
 * PollView Submit
 * @method bindEvents 
 * @return 
 */
PollView.prototype.submitPoll = function (oSelf) {
	var oElem = this,
		oData = {},
		sQuestionTxt = $.trim($("#questionBox").val()), 
		sQuestionEncoded = SpecialCharToCode(encodeURIComponent(sQuestionTxt)),
		sAnswersEndoded = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oAnswers = {},
		oQuestion = {},
		sTitle = sQuestionTxt.substr(0,15),
		sPollId = $("#pollID").val(),
		bDeletePoll = 0;		

	if ($(oElem).hasClass('btndisabled') && !oSelf.bNextBttnEnabled) {
		return;
	}
	
	$(".poll-option").each(function(k,val){		
		oAnswers[k] = $.trim($(this).val());		
	});	
	sAnswersEndoded = SpecialCharToCode(encodeURIComponent(JSON.stringify(oAnswers)));
	
	oData = {			
		"question":	sQuestionEncoded,
		"answers":	sAnswersEndoded,
		"pollID": sPollId
	};
	
	sTitle += (sQuestionTxt.length > 15) ? "..." : "";	
	
	$.nativeCall({
		'method':			'UpdatePoll',
		'inputParams':		[sPollId, SpecialCharToCode(encodeURIComponent(sTitle)), sQuestionEncoded, sAnswersEndoded, bDeletePoll],
		'globalResource':	'objUpdatePollResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'beforeSend':		function () {
			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="loading" />',
				'background-color': 'none',
				'click-to-hide': false,
				'opacity': 0.5
			});
		},
		'onComplete':		function () {
			oUtility.hideLoader();
			oData.pollID = objUpdatePollResponse.Content.PollID;
			
			oSelf.sendPollView = new PollSendView(oData);	
			oSelf.sendPollView.init();			
		}
	});	
}

/**
 * View Type SendPoll Screen
 * @class PollSendView
 * @module PollSendView
 * @constructor
 */
var PollSendView = function (model) {	
	this.model = model;	
};

/**
 * Initialize PollSendView
 * @method init 
 * @return 
 */
PollSendView.prototype.init = function () {
	var oSelf = this;
	
	HideNativeBottomBar(true);
	oSelf.render();
	oSelf.bindEvents();
	oSelf.resize();
}

/**
 * Render PollSendView
 * @method render 
 * @return 
 */
PollSendView.prototype.render = function () {
	var oSelf = this;
	
	/*== render main template ==*/
	Application.mainContainer.html(_.template($("#pollslideTemplate").html(), {
		"data" : oSelf.model
	}));
	
	/*== render header ==*/
	$("#headerpanel").html(
		_.template($("#sendPollHeaderTemplate").html())
	);
}

/**
 * Bind Events PollSendView
 * @method bindEvents 
 * @return 
 */
PollSendView.prototype.bindEvents = function () {
	var oSelf = this;
	
	$("#BtnBackToList").off("click tap").on("click tap", function () {
		oSelf.backToPollList.call(this, oSelf);
	});
	
	$("#BtnBackToLesson").off("click tap").on("click tap", function () {
		oSelf.closeConnect.call(this, oSelf);
	});
	
    $('#projectPoll').off("click tap").on("click tap",function(){
		oSelf.projectPoll.call(this, oSelf);		      
    });
	
	$('#sendPoll').off("click tap").on("click tap",function(){
		oSelf.sendPoll.call(this, oSelf);		      
    });
}

/**
 * Stop Project & Broadcast PollSendView
 * @method stopProjectNBroadcast 
 * @return 
 */
PollSendView.prototype.stopProjectNBroadcast = function () {
	var oSelf = this,
		oData = oSelf.model;
		sAction = LESSON.c_s_PROJECT_STOP,
		sContent = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sID = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSurveyType = CONNECT.c_s_SURVEY_TYPE;
	
	if ($(".start_project").hasClass("active")) {
		SetProjectSlide(sSurveyType, sAction, oData.pollID, sContent);	
	}
	if ($(".start_survey").hasClass("active")) {
		SetSurvey(sID, oData.pollID, sAction, sContent, sSurveyType);
	}
}

/**
 * Close Connect PollSendView
 * @method closeConnect 
 * @return 
 */
PollSendView.prototype.closeConnect = function (oSelf) {
	oSelf.stopProjectNBroadcast();	
	ConnectView.closeConnectWindow();
}

/**
 * Project Poll PollSendView
 * @method projectPoll 
 * @return 
 */
PollSendView.prototype.projectPoll = function (oSelf) {
	var oElem = this,
		oData = oSelf.model,
		sAction = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oChoices = JSON.parse(decodeURIComponent(oData.answers))
		oJsonData = {},
		aChoicesArray = {},
		oKeyVal = {};
		
	if ($(oElem).text() == CONNECT.c_s_STOP_PROJECT_TXT) {
		sAction = LESSON.c_s_PROJECT_STOP;
		$(this).text(CONNECT.c_s_PROJECT_TXT).removeClass('active');
	}
	else {
		sAction = LESSON.c_s_PROJECT_START;
		$(this).text(CONNECT.c_s_STOP_PROJECT_TXT).addClass('active');	
	}	
	
	$.each(oChoices, function(k, choice){		
		aChoicesArray[k] = choice;		
	});	
	
	oJsonData = {
		"poll": {
			"question": decodeURIComponent(oData.question),
			"choices": aChoicesArray,
			"poll-id": oData.pollID
		}
	};	
	SetProjectSlide(CONNECT.c_s_SURVEY_TYPE, sAction, oData.pollID, encodeURIComponent(JSON.stringify(oJsonData)));  
}

/**
 * Broadcast Poll PollSendView
 * @method sendPoll 
 * @return 
 */
PollSendView.prototype.sendPoll = function (oSelf) {
	var oElem = this,
		oData = oSelf.model,
		sAction = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		oChoices = JSON.parse(decodeURIComponent(oData.answers))
		oJsonData = {},
		aChoicesArray = [],
		oKeyVal = {},
		sID = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSurveyType = CONNECT.c_s_SURVEY_TYPE;
		
	if ($(oElem).text() == CONNECT.c_s_END_POLL_TXT) {
		sAction = LESSON.c_s_PROJECT_STOP;
		$(this).text(CONNECT.c_s_SEND_POLL_TXT).removeClass('active');
		$(".survey_box .no_box").hide();
		$(".survey_box .bar-graph-cont div").css("width","0");
	}
	else {
		sAction = LESSON.c_s_PROJECT_START;
		$(this).text(CONNECT.c_s_END_POLL_TXT).addClass('active');	
	}	
	
	$.each(oChoices, function(k, choice){		
		aChoicesArray.push({"answer_text_html": choice});		
	});
	
	/* json structor kept same as survey */
	oJsonData = {
		"survey": {
			"content": decodeURIComponent(oData.question),
			"answers": aChoicesArray,
			"question_id": oData.pollID
		}
	};	
	
	SetSurvey(sID, oData.pollID, sAction, encodeURIComponent(JSON.stringify(oJsonData)), sSurveyType);
	if (sAction == LESSON.c_s_PROJECT_START) {
		/* note: SetGoogleAnalytic() param - VERBID */
		SetGoogleAnalytic(CONNECT.c_s_POLL_SENT_VERBID, GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
	}
}

/**
 * Back To Poll List
 * @method backToPollList 
 * @return 
 */
PollSendView.prototype.backToPollList = function (oSelf) {
	var oPollView = ConnectView.viewType;
	
	oSelf.stopProjectNBroadcast();
	oPollView.init();
}

/**
 * Reflect Graph on Poll Screen 
 * @method updateResponse
 * @param {Object} myval
 * @return 
 */
PollSendView.prototype.updateResponse = function(){    
    
    var arrOptions = ['a', 'b', 'c', 'd' ,'e', 'f', 'g', 'h' ,'i', 'j', 'k', 'l'],
		sChar = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,		
		oJsonData = JSON.parse(objPollSurveyResponse).Content,
		aResult = [],
		oResult = {},
		fPercent = 0,
		fMaxVal = 0;
    
    for (key in arrOptions) {        
		if (parseInt(key) >=0 && parseInt(key) <= (arrOptions.length - 1)) {
			sChar = (arrOptions[key]).toUpperCase();
			//var val = $('#response_'+sChar).text();
			
			oResult   =   _.where(oJsonData, {UserResponseItemNo: arrOptions[key]});
			aResult.push({'val' : oResult.length, 'id' : 'response_'+sChar});   
			
			$('.survey_box').find('#response_'+sChar).text(oResult.length).show();   
		}
    }	
	fMaxVal = _.max(_.pluck(aResult, 'val'));
	
	if(fMaxVal > 0)
	{
		$.each(aResult, function(id,obj){
			
			if(obj.val == fMaxVal)
			{
				 $('.survey_box').find('#bar_'+obj.id).animate({'width':"100%"},100);
				 $('.survey_box .message').html('<div class="message_content">'+unescape($('.survey_box').find('#info_'+obj.id).val())+'</div>').addClass('message_active');
			}
			else
			{
				fPercent = obj.val/fMaxVal * 100;
				$('.survey_box').find('#bar_'+obj.id).animate({'width':fPercent+"%"},100);
			}
		}); 
	}
    
}

/**
 * Resize PollSendView
 * @method resize 
 * @return 
 */
PollSendView.prototype.resize = function () {
	var fWindowHeight = $(window).height(),
		fHeaderHeight = $(".top_navbar").outerHeight();		
		
	$(".content_space").height(fWindowHeight - fHeaderHeight - 53);
	//oPollForm.css('max-height',fWindowHeight - fHeaderHeight + fGappingHeight + fBottomBarHeight));
}

/**
 * View Type Buzz
 * @class BuzzView
 * @module BuzzView
 * @constructor
 */
var BuzzView = function (model) {
	this.model = model;
};
BuzzView.prototype = new ISeriesBase();
/**
 * Initialize BuzzView
 * @method init 
 * @return 
 */
BuzzView.prototype.init = function () {
	var oSelf = this;
	HideNativeBottomBar(true);
	oSelf.model.StudentData = objStudentListJsonData.Content;
	oSelf.model.BuzzCommentsnote = objBuzzCommentData;
	oSelf.render();
	oSelf.bindEvents();
}

/**
 * render BuzzView
 * @method render 
 * @return 
 */
BuzzView.prototype.render = function (){
	var oSelf = this;
	
	// render main template
	$("#main_container").empty().html(
		_.template($("#buzzMainTemplate").html(),
			{
				
			}
		)
	);
	// render buzz header
	$("#renderBuzzHeaderArea").empty().html(
		_.template($("#buzzheaderTemplate").html(),
			{
				
			}
		)
	);
	oSelf.renderStudentList();
	// render comment area
	$("#renderCommentsArea").empty().html(
		_.template($("#commentsTemplate").html(),
			{
				
			}
		)
	);	
	// render personal comment area
	$("#renderPersonalCommentsArea").empty().html(
		_.template($("#personalCommentsTemplate").html(),
			{
				
			}
		)
	);
	// render buzz area and star rating
	$("#renderBuzzArea").empty().html(
		_.template($("#buzzTemplate").html(),
			{
				
			}
		)
	);
	$('#score-callback').raty({
		number: 3,
		hints : ['','',''],
		score: function() {
		return $(this).attr('data-score');
		}
	});
	// render comments popup area
	$("#" +CONNECT.c_s_COMMENTS_POPUP_AREA).empty().html(
		_.template($("#commentsNotestemplate").html(),
			{
				'data' : oSelf.model.BuzzCommentsnote
			}
		)
	);
	
	//IPP-4724
	if($(oSelf.model.StudentData).length == 1){
		$("#" +CONNECT.c_s_BUZZ_BTN).addClass("disabledBtn");
		$("#" +CONNECT.c_s_PRJBTN).addClass("disabledBtn");
	}
	
	oSelf.resize();
}

/**
* @method: bindEvents
* @uses: for binding events to the dom elements
* @return void;
*/

BuzzView.prototype.bindEvents = function (){
	var oSelf = this;
	isCommentForClass = 1;
	selectedstudentId = "";
	resetCommentforClass = 0;
	topstarStudentIDs = [];
	allStudentIDs = [];
	
	/* $(".student_shorting").find('li:gt(0)').each(function(i){
			allStudentIDs.push($(this).attr("data-student-id"));
	}); */
		
	$("#" +CONNECT.c_s_COMMENT_BTN).off("click tap").on("click tap", function(e){ 
		$("#" +CONNECT.c_s_COMMENT_LIST).css({
				top: e.pageY-40,
				left: e.pageX+160
		}).toggle();
		e.stopPropagation();
	});
	
	$("#" +CONNECT.c_s_BUZZ_BTN).off("click tap").on("click tap", function(){
		if($(oSelf.model.StudentData).length > 1){
			if(allStudentIDs.length == 0){
				oSelf._alert({
					divId:		'dialog-message',
					message:	CONNECT.c_s_SELECT_STUDENT_ALERT
					});
					return false;
			}
			resetCommentforClass = 0;
			//alert(isCommentForClass);
			var ratingScore = ($('[name="score"]').val() == "") ? 0 : $('[name="score"]').val();
			
			if(
			
					((( $.trim($("#" + CONNECT.c_s_COMMENT_AREA ).html().toString()).length == 0 ) && 
			
					($.trim($("#" + CONNECT.c_s_PERSONAL_COMMENT_AREA).val()).length == 0)
					) && 
					
					(ratingScore == 0))
				
			   ){
					oSelf._alert({
					divId:		'dialog-message',
					message:	CONNECT.c_s_EMPTY_COMMENT_ALERT
					});
					return false;
				
				}
			var buzzCommentData = {};
			buzzCommentData.comments = notelist;
			buzzCommentData.personalComments = $("#"+CONNECT.c_s_PERSONAL_COMMENT_AREA).val();
			buzzCommentData.studentIDs = allStudentIDs;
			
			buzzCommentData = JSON.stringify(buzzCommentData);
			
			 if(notelist.length >0 && notelist.length > 3) {
					
					oSelf._alert({
					divId:		'dialog-message',
					message:	CONNECT.c_s_PREAUTHORED_COMMNET_RESTICTION
					});
					return false;
				}
				
				
			if(( $.trim($("#" + CONNECT.c_s_COMMENT_AREA ).html().toString()).length> 0 ) && ($.trim($("#" + CONNECT.c_s_PERSONAL_COMMENT_AREA).val()).length>0)){
			   
				oSelf._alert({
					divId:		'dialog-message',
					message:	CONNECT.c_s_WRONG_COMMENT_ALERT
				});

			}else{
				//console.log(buzzCommentData);
				oSelf.saveBuzzData(resetCommentforClass,isCommentForClass,selectedstudentId,ratingScore,buzzCommentData);
			}
		}
	});
	
	// send buzz event
	
	$("#" +CONNECT.c_s_RESET_BUZZ_BTN).off("click tap").on("click tap", function(){
		resetCommentforClass = 1;
		isCommentForClass = 1;
		selectedstudentId = 0;
		var ratingScore = 0;
		buzzCommentData = {};
		
		allStudentIDs.length = 0;
		
		$(".student_shorting").find('li:gt(0)').each(function(i){
			allStudentIDs.push($(this).attr("data-student-id"));
		});
		
		buzzCommentData.comments = CONNECT.c_s_BUZZ_DATA_RESET_TXT;
		buzzCommentData.studentIDs = allStudentIDs;
		buzzCommentData = JSON.stringify(buzzCommentData);
		
		/* oSelf._alert({
				divId:		'dialog-message',
				message:	CONNECT.c_s_BUZZ_SAVE_RECORD_ALERT
		}); */
		
		oSelf._confirm({
				divId:	'dialog-message',
				message:	CONNECT.c_s_RESET_STARS_CONFIRM_TXT,
				yes:		function () {
					oSelf.saveBuzzData(resetCommentforClass,isCommentForClass,selectedstudentId,ratingScore,buzzCommentData);
				}
	    });
	});
	
	$("#" +CONNECT.c_s_DONE_BUZZ_BTN).off("click tap").on("click tap", function(){
		HideNativeBottomBar(false);
		if ( oPlatform.isDevice()) {
			CloseWebView();
		}else{
			CloseConnectWindow();
		}
	});
	
	
	// add default comment notes
	
	notelist = [];
	$(".notelist").off("click tap").on("click tap", function(){
		
	   if(($.inArray( $(this).text(), notelist)) == -1 && notelist.length < 3 ){
			//notelist.push($(this).attr('note_id'));
			notelist.push($(this).text());
			$("#" + CONNECT.c_s_COMMENT_AREA).append("<p><span class='text_remove sprite' id='noteid_"+$(this).attr('note_id')+"'></span>"+$(this).html()+"</p>");
			$(this).append('<div class="buzzcmtnotecheck sprite"></div>');
		}
		// remove  default comment notes
		$("#" + CONNECT.c_s_COMMENT_AREA + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
                $("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				var itemIndex    = notelist.indexOf($(this).parent().text());
				//alert(itemIndex);
				//alert($(this).parent().text());
				//notelist.splice($.inArray(itemtoRemove[1], notelist),1);
				notelist.splice(itemIndex,1);
				$(this).parent('p').remove();
				$(".notelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.buzzcmtnotecheck').remove();
					}
				});
			});
	
		});
		
		// bind events for Select All lnik
		$("#" + CONNECT.c_s_ID_LINK_SELECT_ALL).off("click").on("click", function () {
			$(".student_shorting").find('li').addClass("active");
			isCommentForClass = 1;
			selectedstudentId = "";
			allStudentIDs.length = 0;
			$(".student_shorting").find('li:gt(0)').each(function(i){
				allStudentIDs.push($(this).attr("data-student-id"));
			});
		});
		
		// bind events for particular student lnik
		$(".student_shorting").find('li:gt(0)').off("click").on("click", function () {
			$(".student_shorting").find('li').removeClass("active");
			$(this).addClass("active");
			isCommentForClass = 0;
			selectedstudentId = $(this).attr("data-student-id");
			allStudentIDs.length = 0;
			allStudentIDs.push($(this).attr("data-student-id"));
		});
		
		// bind project top stars
		$("#"+CONNECT.c_s_PRJBTN).off("click").on("click", function () {
			if($(oSelf.model.StudentData).length > 1){
				$("#projectTopStrPopup").show();
				oSelf.middleAlignPopup("projectTopStrPopup");
			}
		});
		
		// close top star close button
		
		$("#topstarPopUpCloseBtn").off("click").on("click", function () {
			$("#projectTopStrPopup").hide();
			
			// IPP-4714
			$(".topstarstudent_shorting").find('li:gt(0)').each(function (i) {
				$(this).removeClass("active");
				
			});
			$("#"+CONNECT.c_s_STOP_PROJECTION).hide();
			$("#"+CONNECT.c_s_SEND_PROJECTION).show();
			var MediaType = 'Buzz',
					ActionType = 'Stop',
					MediaID = '',
					QuestionInformation = encodeURIComponent(
						JSON.stringify({
							'studentInfos':		topstarStudentIDs
						})
					),
					MediaFullURL = '',
					MediaActionType = '';
				
				SetProjectSlide(MediaType, ActionType, MediaID, QuestionInformation, MediaFullURL, MediaActionType);
		});
		
		// bind events for particular top star student lnik
		$(".topstarstudent_shorting").find('li:gt(0)').off("click").on("click", function () {
			
			//IPP-4725
			
			if($("#"+CONNECT.c_s_STOP_PROJECTION).is(':visible')){
				return false;
			}
			$(this).toggleClass("active");
			/*//var sid = $(this).attr("data-student-id");
			
			var rtopstarStudentIDs = $.grep(topstarStudentIDs, function(e){ return e.sId == sid; });
			 				if($(this).hasClass("active")){
					if(rtopstarStudentIDs.length == 0){
						//alert(1);
						topstarStudentIDs.push(
							{
								"sId"     : $(this).attr("data-student-id"),
								"sName"   : $(this).attr("data-student-name"),	
								//"sRating" : $(this).attr("data-student-rating")
								"sRating" :$(this).find(".right").text()
							});
						}
					}else{
						$.each(topstarStudentIDs, function(i){
						if(topstarStudentIDs[i].sId === sid) {
							topstarStudentIDs.splice(i,1);
							return false;
						}
					});
						
					}
 */				
			if($(".topstarstudent_shorting").find('li.active').length > 10){
				
				$("#"+CONNECT.c_s_SEND_PROJECTION).hide();
				$("#"+CONNECT.c_s_STOP_PROJECTION).hide();
				return false;
			}	
				
			if($(".topstarstudent_shorting").find('li').hasClass('active') == false){ 
				$("#"+CONNECT.c_s_SEND_PROJECTION).hide();
				$("#"+CONNECT.c_s_STOP_PROJECTION).hide();
			}else{
				$("#"+CONNECT.c_s_SEND_PROJECTION).show();
				$("#"+CONNECT.c_s_STOP_PROJECTION).hide();
			} 
			
		});
		
		// send projection
		
		$("#"+CONNECT.c_s_SEND_PROJECTION).off("click").on("click", function () {
				oSelf.filterTopStarsData ();
				$(this).hide();
				$("#"+CONNECT.c_s_STOP_PROJECTION).show();
				var MediaType = 'Buzz',
					ActionType = 'Start',
					MediaID = '',
					QuestionInformation = encodeURIComponent(
						JSON.stringify({
							'studentInfos':		topstarStudentIDs
						})
					),
					MediaFullURL = '',
					MediaActionType = '';
				
				//console.log(QuestionInformation);
				//console.log(topstarStudentIDs);
		
				SetProjectSlide(MediaType, ActionType, MediaID, QuestionInformation, MediaFullURL, MediaActionType);
		});
		
		// stop projection
		$("#"+CONNECT.c_s_STOP_PROJECTION).off("click").on("click", function () {
				oSelf.filterTopStarsData ();
				$(this).hide();
				$("#"+CONNECT.c_s_SEND_PROJECTION).show();
				
				var MediaType = 'Buzz',
					ActionType = 'Stop',
					MediaID = '',
					QuestionInformation = encodeURIComponent(
						JSON.stringify({
							'studentInfos':		topstarStudentIDs
						})
					),
					MediaFullURL = '',
					MediaActionType = '';
				
				//console.log(QuestionInformation);
		
				SetProjectSlide(MediaType, ActionType, MediaID, QuestionInformation, MediaFullURL, MediaActionType);
		});
		
		// bind user to 250 charecters
		
		/* $("#" + CONNECT.c_s_PERSONAL_COMMENT_AREA)
			.on('keypress', function (poEvent) {
				var iMaxLength = $(this).data('maxlength');
				return ($(this).text().length <= iMaxLength);
			})
			.on('input', function () {
				var iMaxLength = $(this).data('maxlength');
				if ($(this).text().length > iMaxLength) {
					$(this).text($(this).text().substring(0, iMaxLength));
					// $(this).get(0).setSelectionRange(iMaxLength * 2, iMaxLength * 2);
					$(this).text($(this).text());
					return false;
				}
			})
			.on('focus', function () {
				this.selectionStart = this.selectionEnd = $(this).text().length;
			}); */
		//$("#"+CONNECT.c_s_PERSONAL_COMMENT_AREA).keyup(oSelf.validateMaxLength);
		
		
		// hide pre-defined Comments list
		
		$(document.body).off("click tap").on("click tap", function(e){ 
			if(e.target.className !== "notelist"){
				$("#" +CONNECT.c_s_COMMENT_LIST).hide();
			}
		});
		

		
}
/**
* @method: resize
* @uses: for resizing
* @return void;
*/
BuzzView.prototype.resize = function (){
	
	$("#connectFrame", parent.document).css("overflow", "hidden");
	$(".connectWrapper", parent.document).css("overflow", "hidden");
	
}


/**
* @method: renderStudentList
* @uses: for listing student list
* @return void;
*/
BuzzView.prototype.renderStudentList = function (){
	
	// render student list
	var oSelf = this,
		topStudents = [],
		studentList = oSelf.generateUserLastName(oSelf.model.StudentData);
		
	$("#renderStudentsArea").empty().html(
		_.template($("#studentListTemplate").html(),
			{
				'studentList' : studentList
			}
		)
	);
	oSelf.renderTopStars();
}

/**
* @method: renderTopStars
* @uses: for listing top star student list
* @return void;
*/
BuzzView.prototype.renderTopStars = function (){
	var oSelf = this;
	topStudents = _.sortBy(oSelf.model.StudentData, 'UserStarCount');
	topStudents = topStudents.reverse();
	$("#projectTopStrPopup").empty().html(
		_.template($("#projectTopstarTemplate").html(),
			{
				'studentList' : topStudents
			}
		)
	);
}

/**
* @method: saveBuzzData
* @params : {String} resetCommentforClass
* @params : {String} isCommentForClass
* @params : {String} selectedstudentId
* @params : {Ineger} ratingScore
* @params : {Ineger} buzzCommentData 
* @uses: for saving buzz data
* @return void;
*/

BuzzView.prototype.saveBuzzData = function (resetCommentforClass,isCommentForClass,selectedstudentId,ratingScore,buzzCommentData) {
	var oSelf = this;	
	$.nativeCall({
		'method':			'SetBuzzComment',
		'inputParams':		[resetCommentforClass, isCommentForClass, selectedstudentId, ratingScore, buzzCommentData],
		'globalResource':	'objBuzzData',
		'interval':			500,
		'breakAfter':		2500,
		'beforeSend':		function () {
			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="loading" />',
				'background-color': 'none',
				'click-to-hide': false,
				'opacity': 0.5
			});
		},
		'onComplete':		function (poSetBuzzCommentResponse) {
			
			// update rating of selected students
			$(".student_shorting").find('li:gt(0)').each(function(i){
				if (resetCommentforClass == 1) {
						$(this).find(".right").text("0");
				}else{	
					if($(this).hasClass("active")){
						var cRating = parseInt($(this).find(".right").text()) ;
						$(this).find(".right").text(cRating + parseInt(ratingScore));
						}
				}
			});
			for(var i=0; i<= allStudentIDs.length - 1;i++){
				var cRating = parseInt($("#star_"+allStudentIDs[i]).text()) ;
				if (resetCommentforClass == 1) {
						$("[id^=star_]").text("0");
						//$("#star_"+allStudentIDs[i]).text("0");
				}else{
					$("#star_"+allStudentIDs[i]).text(cRating + parseInt(ratingScore));
				}
				
			}
			var oSortStudents = {},
				aSortStudents = [];
				$(oSelf.model.StudentData).each(function(i,v){
						oSortStudents = {};
						oSortStudents['UserCurrentLexileLevel'] = v.UserCurrentLexileLevel;
						oSortStudents['UserCurrentReadingBookID'] = v.UserCurrentReadingBookID;
						oSortStudents['UserCurrentReadingLevel'] = v.UserCurrentReadingLevel;
						oSortStudents['UserDisplayName'] = v.UserDisplayName;
						oSortStudents['UserID'] = v.UserID;
						oSortStudents['UserInLiveSession'] = v.UserInLiveSession;
						oSortStudents['UserRole'] = v.UserRole;
						oSortStudents['UserStarCount'] = v.UserStarCount;
						if (resetCommentforClass == 1) {
							oSortStudents['UserStarCount'] = 0;
						}else{
							for(var j=0; j<= allStudentIDs.length - 1;j++){
								if(v.UserID == allStudentIDs[j]){
									oSortStudents['UserStarCount'] = v.UserStarCount + parseInt(ratingScore);
								}
							}
						}	
						//console.log(v.UserCurrentLexileLevel);
					aSortStudents.push(oSortStudents);
				});
			oSelf.model.StudentData = aSortStudents;	
			oSelf.renderTopStars();
			oSelf.bindEvents();
			$(".student_shorting").find('li').removeClass("active");
			
			oUtility.hideLoader();
			if (resetCommentforClass == 1) {
					oSelf.resetBuzzDataCallback();
			}
			else {
					oSelf.saveBuzzDataCallback();
			}
			var MediaType = 'Buzz',
				ActionType = 'Start',
				MediaID = '',
				QuestionInformation = encodeURIComponent(
					JSON.stringify({
						'buzzId'	: poSetBuzzCommentResponse.Content.BuzzId,
						'startCount':	ratingScore,
						'comment':		buzzCommentData
					})
				),
				MediaFullURL = '',
				MediaActionType = '';
		
			SetBroadcastSlide(MediaType, ActionType, MediaID, QuestionInformation, MediaFullURL, MediaActionType);
			
			notelist.length  = 0;
			$("#"+CONNECT.c_s_COMMENT_AREA).empty();
			$("#"+CONNECT.c_s_PERSONAL_COMMENT_AREA).val("");
			$('[name="score"]').val(0);

			$('#score-callback').raty({
				number: 3,
				hints : ['','',''],
				score: function() {
				return $(this).attr('data-score');
			}
			});
			allStudentIDs.length = 0;
			selectedstudentId = 0;
			isCommentForClass = 1;
			resetCommentforClass = 1;
			$(".notelist div").remove();
			/* resetCommentforClass = 1;
			isCommentForClass = 1;
			selectedstudentId = 0;
			var ratingScore = 0;
			buzzCommentData = {};

			allStudentIDs.length = 0;	 */
			},
		'onError':			function (poSetBuzzCommentResponse, poException) {
			oUtility.hideLoader();
			oSelf._alert({
				divId:		'dialog-message',
				message:	((poSetBuzzCommentResponse.Error || {}).ErrorUserDescription || (poException + ''))
			});
		}
		
	});

}

/**
* @method: saveBuzzDataCallback
* @uses: for saving buzz data alert box
* @return void;
*/
BuzzView.prototype.saveBuzzDataCallback = function(){
	var oSelf = this;
	/* oSelf._alert({
		divId:		'dialog-message',
		message:	CONNECT.c_s_BUZZ_SAVE_RECORD_ALERT
	}); */
}

/**
* @method: resetBuzzDataCallback
* @uses: for saving buzz data alert box
* @return void;
*/
BuzzView.prototype.resetBuzzDataCallback = function(){
	var oSelf = this;
	oSelf._alert({
		divId:		'dialog-message',
		message:	CONNECT.c_s_BUZZ_RESET_RECORD_ALERT
	});
};

/**
* @method: middleAlignPopup
* @uses: for middle align top project popup
*/
BuzzView.prototype.middleAlignPopup = function(modalID) {
        var marginTop = ($(window).height() - $('#' + modalID).find(".popup_yellow_content").height()) / 2;
        $('#' + modalID).css('margin-top', marginTop + 'px');
}

/**
* @method: validateMaxLength
* @uses: for validate max input length of personal comment
*/
BuzzView.prototype.validateMaxLength = function (e)
{
        
var text = $(this).html();
        var maxlength = CONNECT.c_s_PERSONALCMT_CHAR_LIMIT;

        if(maxlength > 0)  
        {
                $(this).html(text.substr(0, maxlength)); 
        }
}
/**
* @method: filterTopStarsData
* @uses: for filter top star data
*/
BuzzView.prototype.filterTopStarsData = function ()
{
		topstarStudentIDs.length = 0;
		$(".topstarstudent_shorting").find("li").each(function(i) {
		if(i> 0){
			var sid = $(this).attr("data-student-id");
			var rtopstarStudentIDs = $.grep(topstarStudentIDs, function(e){ return e.sId == sid; });
			if($(this).hasClass("active")){
			if(rtopstarStudentIDs.length == 0){
				//alert(1);
			topstarStudentIDs.push(
				{
					"sId"     : $(this).attr("data-student-id"),
					"sName"   : $(this).attr("data-student-name"),	
					//"sRating" : $(this).attr("data-student-rating")
					"sRating" :$(this).find(".right").text()
				});
				}
			}else{
				$.each(topstarStudentIDs, function(i){
					if(topstarStudentIDs[i].sId === sid) {
						topstarStudentIDs.splice(i,1);
						return false;
					}
				});
			}
		}

		});	
	
	//console.log(topstarStudentIDs);	
}

/**
* @method: generateUserLastName
* @uses: for generate last name from student display name
*/
BuzzView.prototype.generateUserLastName = function(oUserList){
	
	var oSelf = this,
		aUserList = [];
	$.each(oUserList,function(idx,valx){
		oUser = {};
		oUser.UserCurrentLexileLevel = valx.UserCurrentLexileLevel;
		oUser.UserCurrentReadingBookID = valx.UserCurrentReadingBookID;
		oUser.UserCurrentReadingLevel = valx.UserCurrentReadingLevel;
		oUser.UserDisplayName =valx.UserDisplayName;
		oUser.UserID = valx.UserID;
		oUser.UserInLiveSession = valx.UserInLiveSession;
		oUser.UserRole = valx.UserRole;
		oUser.UserStarCount =valx.UserStarCount;
		
		var fullName = valx.UserDisplayName.split(' ');
			lastName = fullName[fullName.length - 1];
			oUser.firstName = fullName[0];
			oUser.lastName = lastName;
			aUserList.push(oUser);
	});
	//console.log(aUserList);
	aUserList.sort(oSelf.compareUserLastName);
	return aUserList;
}

/**
* @method: compareUserLastName
* @uses: for sorting user list
*/

BuzzView.prototype.compareUserLastName = function(a,b) {
  if (a.lastName < b.lastName)
     return -1;
  if (a.lastName > b.lastName)
    return 1;
  return 0;
}

