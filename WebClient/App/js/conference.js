/* 
 * Student Conferencing and Remarks JS
 */
 
function LessonConferenceView () {}
 
LessonConferenceView.model = null;
LessonConferenceView.LessonNo = null;
LessonConferenceView.UnitNo = null;
LessonConferenceView.WeekNo = null;
notelist = [];
 // init
LessonConferenceView.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf);
};

// render templates
LessonConferenceView.render = function (oSelf) {
	HideNativeBottomBar(true);
	oSelf.renderHeaderPanel();
	if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE) { 
		oSelf.bindEvents4Slider();
	}
	else if (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE) {
		oSelf.bindEvents4ParticipationSlider();
	}
	oSelf.bindEvents(oSelf);
	oSelf.resize();
	
};

/**
 * renderHeaderPanel: method for generating Conference Header Panel HTML
**/
LessonConferenceView.renderHeaderPanel = function(){
    var oSelf = this,
		studentName = decodeURIComponent($_GET(LESSON.c_s_POPUP_STUDENT_NAME)),
		studentId = $_GET(LESSON.c_s_POPUP_STUDENT_ID),
		itemDisplayName = decodeURIComponent($_GET(LESSON.c_s_POPUP_ITEMDISPLAY_NAME)),
		lessonId = $_GET(LESSON.c_s_POPUP_LESSON_ID);
		if(typeof currentLessonId == 'undefined'){
			currentLessonId = lessonId;
		}
		if(typeof isCurrent == 'undefined'){
			isCurrent = false,
			curitemId = '';
			curunitNo = '' ;
			curlessonNo	= '' ;
			curweekNo =	'';
		}else{
			curitemId = curitemId;
			curunitNo = curunitNo;
			curlessonNo = curlessonNo;
			curweekNo = curweekNo;
		}
	$("#" +	LESSON.c_s_CONFERENCE_HEADER_PANEL).empty().html(
		_.template(
			$("#headertemplate").html(),{
				'studentName': studentName,
				'itemDisplayName' : itemDisplayName,
				'data': oSelf.model,
				'currentLessonId' : currentLessonId
			}
		)
	);
	if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE){  // time_to_read
		SetGoogleAnalytic(CONFERENCE.c_s_TTR_CONFERENCING_VERBID, currentLessonId);
	    $("#" + LESSON.c_s_CLASS_CONFERENCE).show();
		$("#" + LESSON.c_s_CLASS_ROOM_CONFERENCE).hide();
		$("#" + LESSON.c_s_GROUP_CONFERENCE).hide();
		oSelf.renderComprehensionPanel();
	}
	else if (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE) {		
		$("#" + LESSON.c_s_CLASS_CONFERENCE).hide();
		$("#" + LESSON.c_s_CLASS_ROOM_CONFERENCE).show();
		$("#" + LESSON.c_s_GROUP_CONFERENCE).hide();
		oSelf.renderClassRoomParticipationPanel();
	}
	else{
		SetGoogleAnalytic(CONFERENCE.c_s_WT_CONFERENCING_VERBID, currentLessonId);
		$("#" + LESSON.c_s_CLASS_CONFERENCE).hide();
		$("#" + LESSON.c_s_CLASS_ROOM_CONFERENCE).hide();
		$("#" + LESSON.c_s_GROUP_CONFERENCE).show();
		oSelf.renderStudentTodoListPanel();
	}
};

/**
* renderComprehensionPanel: method for generating Slider (Comprehension) Panel HTML
*/
LessonConferenceView.renderComprehensionPanel = function(){
	var oSelf = this;
	oSelf.filterConferenceData(oSelf);
	
	$("#" + LESSON.c_s_OUSIDE_READING_PANEL).empty().html(
		_.template($("#outsidereadingtemplate").html(),
			{
				'data': oSelf.model,'confdata' : currentStudentData
			}
		)
	);
	
	$("#" + LESSON.c_s_COMPREHENSION_PANEL).empty().html(
		_.template($("#comprehenstiontemplate").html(),
			{
				'data': oSelf.model
			}
		)
	);
	
	oSelf.renderInstructorInputNotesPanel();
};

/**
* renderInstructorInputNotesPanel: method for generating bottom input panel HTML
*/
LessonConferenceView.renderInstructorInputNotesPanel = function(){
	var oSelf = this;
	$("#" + LESSON.c_s_INSTRUCTOR_INPUT_PANEL).empty().html(
		_.template($("#instructorinputtemplate").html(),
			{
				'data': oSelf.model,
				'confdata' : currentStudentData
			}
		)
	);
	
	$("#" +LESSON.c_s_NOTE_POPUP_AREA).empty().html(
		_.template($("#notestemplate").html(),
			{
				'data': oSelf.model,
			'confdata' : currentStudentData
			}
		)
	);
	
};

/**
* renderClassRoomParticipationPanel: method for generating Slider (Class Room Comprehension) Panel HTML
*/
LessonConferenceView.renderClassRoomParticipationPanel = function(){
	var oSelf = this;
	oSelf.filterConferenceData(oSelf);
	
	$("#" + LESSON.c_s_STUDENT_FEEDBACK_PANEL).empty().html(
		_.template($("#studentfeedbacktemplate").html())
	);	
	
	$("#" + LESSON.c_s_CLASS_ROOM_PARTICIPATION_PANEL).empty().html(
		_.template($("#participationtemplate").html(),
			{
				'data': oSelf.model
			}
		)
	);	
	oSelf.renderClassRoomInputNotesPanel();
};

/**
* renderClassRoomInputNotesPanel: method for generating bottom input panel HTML
*/
LessonConferenceView.renderClassRoomInputNotesPanel = function(){
	var oSelf = this;
	$("#" + LESSON.c_s_CLASS_ROOM_INPUT_PANEL).empty().html(
		_.template($("#classroominputtemplate").html(),
			{
				'data': oSelf.model,
				'confdata' : currentStudentData
			}
		)
	);
	
	$("#" +LESSON.c_s_SPEAKING_POPUP_AREA).empty().html(
		_.template($("#speakingnotestemplate").html(),
			{
				'data': oSelf.model,
				'confdata' : currentStudentData
			}
		)
	);
	
	$("#" +LESSON.c_s_LISTENING_POPUP_AREA).empty().html(
		_.template($("#listeningnotestemplate").html(),
			{
				'data': oSelf.model,
				'confdata' : currentStudentData
			}
		)
	);
	
};

/**
* renderStudentTodoListPanel: method for generating Student's ToDo List
*/
LessonConferenceView.renderStudentTodoListPanel = function(){
	var oSelf = this;
	oSelf.prepareStudentTodoList();

	$("#"+LESSON.c_s_STUDENT_NOTELIST_PANEL).empty().html(
		_.template($("#studenttodolisttemplate").html(),
			{
				'todolistdata': aMasterDataReverse
			}
		)
	);
	oSelf.renderStudentNotePanel();			
};

/**
* renderStudentNotePanel: method for generating Student's Note Panel
*/
LessonConferenceView.renderStudentNotePanel = function() {
	var oSelf = this;
	oSelf.filterConferenceData(oSelf);
	$("#"+LESSON.c_s_STUDENT_NOTES_PANEL).empty().html(
		_.template($("#studentnotetemplate").html(),
			{
				'data': oSelf.model,
				'confdata' : currentStudentData
			}
		)
	);
};

/**
* resize: method for resizing the window.
*/
LessonConferenceView.resize = function () { 
	
   //$('.viewConferencePopupArea').addClass("viewconferencewrapper");
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
		$('html').addClass('ipad ios7');
		var window_height = $("body").height();
	}else{
		var window_height = $(window).height();
	}
	//var window_height = $(window).height(),
	var	headerPanel = $('#headerpanel').outerHeight(),
		comprehensionPanel = (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE) ? 
							$('#comprehensionpanel').outerHeight() : 0,		
		padding = parseInt($(".view_assignment").css("padding-top")) + parseInt($(".view_assignment").css("padding-bottom")),
		exactareaheight = (window_height -headerPanel)-padding,
		classroomparticipationpanel = (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE) ? 
								$("#classroomparticipationpanel").outerHeight() : 0,
		instructorinputPanel = exactareaheight - comprehensionPanel - classroomparticipationpanel - 15,
		innerareaheight = instructorinputPanel - $('.outside_reading_heading').outerHeight();
		
		$('.view_assignment').css('height',exactareaheight+'px');
		
	$("#" +LESSON.c_s_INSTRUCTOR_INPUT_PANEL).height(instructorinputPanel);	
	
	var outsideReadingHeight = $(".outside_reading_heading").outerHeight();
	
	if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE){
	
		$('#additionalNotesDiv').height(instructorinputPanel);
		$('#processEngagementDiv').height(instructorinputPanel);
		$('#guideQuestionDiv').height(instructorinputPanel);
	
		$("#processEngagementDiv .outside_reading_cont").height(instructorinputPanel - outsideReadingHeight);
		$("#additionalNotesDiv .outside_reading_cont").height(instructorinputPanel - outsideReadingHeight - $(".drow_heading").height());
		$("#guideQuestionDiv .outside_reading_cont").height(instructorinputPanel - outsideReadingHeight - $(".drow_heading").height());
		
		//$(".outside_reading_cont.first_box_wrap").height(instructorinputPanel - parseInt($(".view_assignment").css("padding-bottom")) - outsideReadingHeight);
		$('.outside_reading__Notes2').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		$('.outside_reading__Notes2').css('min-height','0px');
		$('.outside_reading_cont_inner').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		//$('.outside_reading__Notes').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		$('.outside_reading__Notes').css('min-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		$("#guideQuestionDiv").find('p').css('bottom','3px');
	}
	else if (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE) {		
		$("#" +LESSON.c_s_CLASS_ROOM_INPUT_PANEL).height(instructorinputPanel);
		
		$('#additionalNotesDiv').height(instructorinputPanel);
		$('#speakingNotesDiv').height(instructorinputPanel);
		$('#listeningNotesDiv').height(instructorinputPanel);
	
		$(".outside_reading_cont").height(instructorinputPanel - outsideReadingHeight - $(".drow_heading").height());
		$(".outside_reading_cont.first_box_wrap").height(instructorinputPanel - parseInt($(".view_assignment").css("padding-bottom")) - outsideReadingHeight);
		$('.outside_reading__Notes2').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		$('.outside_reading__Notes2').css('min-height','0px');
		$('.outside_reading_cont_inner').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		//$('.outside_reading__Notes').css('max-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
		$('.outside_reading__Notes').css('min-height',$(".outside_reading_cont.first_box_wrap").height()+'px');
	}
	else{ 
		$(".view_assignment_container_part").css("margin","2px 0 0");
		$("#studentnotespanel").height($(".view_assignment").height()+ parseInt($(".view_assignment").css("padding-bottom"))-2);
		$("#studenttodolistpanel").height($("#studentnotespanel").height());
		var bottomMargin = (($("#studentnotespanel").height()) * (4/100));
		//alert(outsideReadingHeight);
		$("#studentToDoListDiv").css('max-height',($("#studenttodolistpanel").height() - $(".outside_reading_heading").outerHeight() - bottomMargin)+'px');
		$("#studentToDoListDiv").css('overflow','auto');
		
		$(".outside_reading__Notes2").css('min-height','0px');
		
		$('.outside_reading_wrapinn').height((($("#studentnotespanel").height()/2) - bottomMargin));
		
		//$("#inputAdditionaltxt").height($('.outside_reading_wrapinn').height()-$(".drow_heading").height());
		$("#inputAdditionaltxt").css('min-height',$('.outside_reading_wrapinn').height()-$(".drow_heading").height() -outsideReadingHeight+'px');
		$(".outside_reading_cont_inner").css('min-height',$('.outside_reading_wrapinn').height()-$(".drow_heading").height() -outsideReadingHeight+'px');
		//$("#inputAdditionaltxt").css('max-height',$('.outside_reading_wrapinn').height()-$(".drow_heading").height()+'px');
		
		$("#worktimeAssignmentProcess").height($('.outside_reading_wrapinn').height()-$(".drow_heading").height());
		$("#worktimeAssignmentProcess").css('min-height',($('.outside_reading_wrapinn').height()-outsideReadingHeight)+'px');
		$("#worktimeAssignmentProcess").css('min-height',($('.outside_reading_wrapinn').height()-outsideReadingHeight)+'px');
		$("#process_engagement_notes").css('min-height',($('.outside_reading_wrapinn').height()-outsideReadingHeight)+'px');
		
		$("#studentToDoList").height($("#studenttodolistpanel").height() - bottomMargin);
		if ( oPlatform.isDevice()) {
			$(".Conferencing_part_rgt_panel .outside_reading_wrap").css('margin-bottom',"6%");
		}
		//$("#worktimeAdditionalnotes").height($('.outside_reading_wrapinn').height()+3);
		//var notePanelHeight = $("#studentnotespanel").height() * (4/100);
		//alert(notePanelHeight - bottomMargin);
		//$(".outside_reading__Notes2").height(notePanelHeight - bottomMargin);
		//console.log($(".main_wrapper").height() - ($(".main_wrapper").height()*(4/100)));
		/* $(".outside_reading_cont_inner").css('min-height','0px');
		$("#inputAdditionaltxt").css('min-height','0px');
		$(".outside_reading_wrap").height($("#studentnotespanel").height()/2); */
		
	}	
	
	$("#" + LESSON.c_s_INPUT_ADDITIONAL_TXT).height(innerareaheight);
	$("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES).height(innerareaheight);
	$('.outside_reading__Notes').height(innerareaheight);
};




LessonConferenceView.bindEvents = function (oSelf) {
	
	oSelf.filterConferenceData(oSelf);
	
	$("#" +LESSON.c_s_ADD_OUTSIDEREADING_DONE_BTN).off("click tap").on("click tap", function(){
		
		if ($(this).text() == "Close") {
			oSelf.openHistoryForm.call(this, oSelf, $_GET(LESSON.c_s_POPUP_LESSON_ID));
			return;
		}
		
		var studentId      = $_GET(LESSON.c_s_POPUP_STUDENT_ID),
			itemId         = $_GET(LESSON.c_s_POPUP_LESSON_ID),
			finalScore     = 0,
			conferenceType = '',
			oconferenceData = '',
			conferenceTitle = $("#unitLessonId").text(),
			conferenceTypeData = {};
			if(typeof confLlistId != 'undefined'){
				itemId = confLlistId;
			}
			if($("#unitLessonId").html().indexOf(",") != -1){
				UnitLessonNo = $("#unitLessonId").html().split(", ");
				UnitNo = UnitLessonNo[0].split(LESSON.c_s_TXT_UNIT);
				LessonNo = UnitLessonNo[1].split(LESSON.c_s_TXT_LESSON+" ");
				LessonConferenceView.UnitNo = $.trim(UnitNo[1]);
				LessonConferenceView.LessonNo = $.trim(LessonNo[1]);
			}else{
				UnitLessonNo = $("#unitLessonId").html().split(" Lesson ");
				unitno = UnitLessonNo[0].split(LESSON.c_s_TXT_UNIT);
				LessonConferenceView.UnitNo =  unitno[1];
				LessonConferenceView.LessonNo = UnitLessonNo[1];
			}
			LessonConferenceView.WeekNo = $_GET(LESSON.c_s_POPUP_WEEK_NO);
			
			conferenceType = decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE));
			oconferenceData = {};
		
		if((typeof(oSelf.model.conferenceStudentData.Content) == 'undefined') 
			|| (oSelf.model.conferenceStudentData.Content.ConferenceData == null)  
			|| (oSelf.model.conferenceStudentData.Content.ConferenceData == "null")
			|| (oSelf.model.conferenceStudentData.Content.ConferenceData == "")
			){
				conferenceTypeData['time_to_read'] = {};
				conferenceTypeData['assignment'] = {};
				conferenceTypeData['strategy'] = {};
				conferenceTypeData['individuals'] = {};
				conferenceTypeData['classroom_conversations'] = {};
		}else{  
				data = JSON.parse(oSelf.model.conferenceStudentData.Content.ConferenceData);
				if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) != LESSON_TAB_VIEW[0].c_s_TABTYPE){ 
					if(!(_.isEmpty(data.time_to_read)))
					{
						finalScore = oSelf.model.conferenceStudentData.Content.FinalScore;
					}
				}
				conferenceTypeData['time_to_read'] = data.time_to_read;
				
				conferenceTypeData['assignment'] = data.assignment;
				conferenceTypeData['strategy'] = data.strategy;
				conferenceTypeData['individuals'] = data.individuals;
				conferenceTypeData['classroom_conversations'] = data.classroom_conversations;
				
				if(typeof conferenceTypeData['time_to_read'] == 'undefined'){
					conferenceTypeData['time_to_read'] = {};
				}
				if(typeof conferenceTypeData['assignment'] == 'undefined'){
					conferenceTypeData['assignment'] = {};
				}
				if(typeof conferenceTypeData['strategy'] == 'undefined'){
					conferenceTypeData['strategy'] = {};
				}
				if(typeof conferenceTypeData['individuals'] == 'undefined'){
					conferenceTypeData['individuals'] = {};
				}
				if(typeof conferenceTypeData['classroom_conversations'] == 'undefined'){
					conferenceTypeData['classroom_conversations'] = {};
				}
		}
		
		oconferenceData.unitNo =   LessonConferenceView.UnitNo;
		oconferenceData.lessonNo = LessonConferenceView.LessonNo;
		oconferenceData.weekNumber = LessonConferenceView.WeekNo;
		oconferenceData.studentId = $_GET(LESSON.c_s_POPUP_STUDENT_ID);
		oconferenceData.ProcessNotes = notelist;
		oconferenceData.AdditionalNotes = encodeURIComponent($.trim($("#" +LESSON.c_s_INPUT_ADDITIONAL_TXT).html()));		
		
		if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE){
			// Time to read
			finalScore     = $("#" + LESSON.c_s_SLIDER).slider("value") -1;
			totalCount     = parseInt($("#" + LESSON.c_s_ADD_OUTSIDEREADING_WORDS_PERPAGES_INPUT).val()) * parseInt($("#" + LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).val());
			oconferenceData.BookTitle = encodeURIComponent($("#" + LESSON.c_s_ADD_OUTSIDEREADING_BOOKTITLE_INPUT).val());
			oconferenceData.NoOfPages = $("#" + LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).val();
			oconferenceData.WordsPerPage = $("#" + LESSON.c_s_ADD_OUTSIDEREADING_WORDS_PERPAGES_INPUT).val();
			oconferenceData.totalCount = totalCount;
			oconferenceData.BookComplete = $("#" +LESSON.c_s_ADD_OUTSIDEREADING_COMPLETEBOOK_INPUT).is(':checked');
			conferenceTypeData[conferenceType] = oconferenceData;
		}		
		else if (decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE) {
			// Classroom conversation
			oconferenceData.ParticipationScore = $("#" + LESSON.c_s_SLIDER).slider("value") -1;
			oconferenceData.SpeakingNotes = speakingnotelist;
			oconferenceData.ListeningNotes = listeningnotelist;
			conferenceTypeData[conferenceType] = oconferenceData;
		}
		else{			
			conferenceTypeData[CONFERENCE.c_s_ASSIGNMENT_TYPE] = oconferenceData;
			conferenceTypeData[CONFERENCE.c_s_STRATEGY_TYPE] = oconferenceData;
			conferenceTypeData[CONFERENCE.c_s_INDIVIDUAL_TYPE] = oconferenceData;
		}
		conferenceTypeData[conferenceType] = oconferenceData;
		
		//jdataStr = '{"Status":"200","Error":null,"Content":{"ItemID":"b105b9e975e94772afbd370d8a2503bf"}}';
		
		var conferenceData = JSON.stringify(conferenceTypeData);	
		if(decodeURI($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE || 
			decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE){
			
			if((decodeURI($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE && finalScore == 0) || 
				(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE && oconferenceData.ParticipationScore == 0)){
				LessonConferenceView._confirm({
					divId:		'dialog-message',
					message:	LESSON.c_s_COMPREHENTION_ALERT_TXT,
					yesLabel: "Score",
					noLabel : "Don't Score",
					'yes':		function () {
						
					},
					'no':		function () {
					    HideNativeBottomBar(false);
						if ( oPlatform.isDevice()) {
							CloseWebView();
						}else{
							window.parent.document.getElementById(LESSON.c_s_VIEW_CONFERENCE_AREA).style.display='none';
							window.parent.document.getElementsByClassName("bs_example_tabs")[0].style.display='block';
							window.parent.document.getElementsByClassName("container_space")[0].style.display='block';
							window.parent.document.getElementById("resize-button").click();							
						}
					}
				});
			}else{      
						//LessonConferenceView.saveConferenceDataCallback(jdataStr);
						LessonConferenceView.saveConferenceData(studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle);
					
			}
		}else{    
				//finalScore = 0;
				if(( $.trim($("#" + LESSON.c_s_INPUT_ADDITIONAL_TXT ).html().toString()).length==0 ) || ($.trim($("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES).html().toString()).length==0)){
					LessonConferenceView._confirm({
					divId:		'dialog-message',
					message:	LESSON.c_s_CONFERENCE_ALERT_TXT,
					yesLabel: "Save",
					noLabel : "Don't Save",
					'yes':		function () { 
						//LessonConferenceView.saveConferenceDataCallback(jdataStr);
						LessonConferenceView.saveConferenceData(studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle);
					},
					'no':		function () {
						HideNativeBottomBar(false);
						if ( oPlatform.isDevice()) {
							CloseWebView();
						}else{
							window.parent.document.getElementById(LESSON.c_s_VIEW_CONFERENCE_AREA).style.display='none';
							window.parent.document.getElementsByClassName("bs_example_tabs")[0].style.display='block';
							window.parent.document.getElementsByClassName("container_space")[0].style.display='block';
							window.parent.document.getElementById("resize-button").click();
						}
					}
				});
				}else{
					//LessonConferenceView.saveConferenceDataCallback(jdataStr);
					LessonConferenceView.saveConferenceData(studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle);
					
				}
		}
	});
	
	$("#" +LESSON.c_s_SUBMIT_BTN).off("click tap").on("click tap", function(){
		var studentId      = $_GET(LESSON.c_s_POPUP_STUDENT_ID),
			itemId         = $_GET(LESSON.c_s_POPUP_LESSON_ID),
			progressData   = $("#" + LESSON.c_s_ADD_OUTSIDEREADING_BOOKTITLE_INPUT).val(),
			numberOfWordsRead = $("#" +LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).val();
		//jdataStr = '{"Status":"200","Error":null,"Content":{"ItemID":"b105b9e975e94772afbd370d8a2503bf"}}';
		//LessonConferenceView.saveLibraryDataCallback(jdataStr);
		LessonConferenceView.saveLibraryData(studentId,itemId,progressData,numberOfWordsRead);
	});
	
	$("#" +LESSON.c_s_PROCESS_ADD_BTN).off("click tap").on("click tap", function(e){
		if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[0].c_s_TABTYPE){
			$("#" +LESSON.c_s_PROCESS_ENGMENT_LIST).css({
				top: e.pageY-40,
				left: e.pageX+160
			}).toggle();
		}else{
			$("#" +LESSON.c_s_PROCESS_ENGMENT_LIST).toggle();
		}
		e.stopPropagation();
	});
	
	$("#" +LESSON.c_s_PROCESS_ENGMENT_LIST).off("click tap").on("click tap", function(e){
        e.stopPropagation();
   });
	
	// Add speaking notes
	$("#" +LESSON.c_s_SPEAK_ADD_BTN).off("click tap").on("click tap", function(e){
		$("#" +LESSON.c_s_LISTENING_LIST).hide();
		if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE){			
			$("#" +LESSON.c_s_SPEAKING_LIST).css({
				top: e.pageY-40,
				left: e.pageX+160
			}).toggle();
		}else{
			$("#" +LESSON.c_s_SPEAKING_LIST).toggle();
		}
		e.stopPropagation();
	});
	
	$("#" +LESSON.c_s_SPEAKING_LIST).off("click tap").on("click tap", function(e){
        e.stopPropagation();
   });
   
   // Add listening notes
	$("#" +LESSON.c_s_LISTEN_ADD_BTN).off("click tap").on("click tap", function(e){
		$("#" +LESSON.c_s_SPEAKING_LIST).hide();
		if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) == LESSON_TAB_VIEW[3].c_s_TABTYPE){			
			$("#" +LESSON.c_s_LISTENING_LIST).css({
				top: e.pageY-40,
				left: e.pageX+160
			}).toggle();
		}else{
			$("#" +LESSON.c_s_LISTENING_LIST).toggle();
		}
		e.stopPropagation();
	});
	
	$("#" +LESSON.c_s_LISTENING_LIST).off("click tap").on("click tap", function(e){
        e.stopPropagation();
   });
   
   
	$("#" +LESSON.c_s_ADD_OUTSIDEREADING_HISTORY_BTN).off("click tap").on("click tap", function(e){	
		$("#" +LESSON.c_s_CONFERENCE_HISTORY_LIST).toggle();
		e.stopPropagation();
	});
	
	$("#" +LESSON.c_s_CONFERENCE_HISTORY_LIST).off("click tap").on("click tap", function(e){
        e.stopPropagation();
   });
	/* $(document.body).off("click tap").on("click tap", function(e){
        $("#" +LESSON.c_s_PROCESS_ENGMENT_LIST).hide();
		$("#" +LESSON.c_s_CONFERENCE_HISTORY_LIST).hide();
		$("#" +LESSON.c_s_SPEAKING_LIST).hide();
		$("#" +LESSON.c_s_LISTENING_LIST).hide();
    }); */
	
	$("#" +LESSON.c_s_BTN_ADDIONAL_TXT).off("click tap").on("click tap", function(){
		$("#" +LESSON.c_s_INPUT_ADDITIONAL_TXT).attr('contenteditable',true);
	});
	
	$("." +LESSON.c_s_STUDENT_BOOK_COVER).off("click tap").on("click tap", function(){
		
		if(Object.keys(oSelf.model.libraryProgressData).length  > 0){
			$('#' + LESSON.c_s_CONFERENCE_VIEW_BOOKS_AREA).toggle();
			if((oSelf.model.libraryProgressData.Content.length) > 8){
				$(".container_book_grid_view").css("overflow-x","auto");
			}
		}
	});
	
	// edited on 05.08.2014
	notelist = [];
	speakingnotelist = [];
	listeningnotelist = [];
	
	// check for exsiting notes
	if(!(_.isEmpty(currentStudentData))){	
		var ProcessNotes = currentStudentData.ProcessNotes,
			SpeakingNotes = currentStudentData.SpeakingNotes || [],
			ListeningNotes = currentStudentData.ListeningNotes || [];
			
		$.each(ProcessNotes,function(i,val){
			notelist.push(val);
		});
		$.each(SpeakingNotes,function(i,val){
			speakingnotelist.push(val);
		});		
		$.each(ListeningNotes,function(i,val){
			listeningnotelist.push(val);
		});		
	}	
	
	$(".notelist").off("click tap").on("click tap", function(){
	   if(($.inArray( $(this).attr('note_id'), notelist)) == -1){ 
			notelist.push($(this).attr('note_id'));
			$("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES).append("<p><span class='text_remove sprite' id='noteid_"+$(this).attr('note_id')+"'></span>"+$(this).html()+"</p>");
			$(this).append('<div class="check sprite"></div>');
			
		}
		// remove  notes
		$("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
                $("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				notelist.splice($.inArray(itemtoRemove[1], notelist),1);
				$(this).parent('p').remove();
				$(".notelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
	});
	$("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
				$("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				notelist.splice($.inArray(itemtoRemove[1], notelist),1);
				$(this).parent('p').remove();
				$(".notelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
		
	
	// Speaking note list Tap
	$(".speakingnotelist").off("click tap").on("click tap", function(){
	   if(($.inArray( $(this).attr('note_id'), speakingnotelist)) == -1){ 
			speakingnotelist.push($(this).attr('note_id'));
			$("#" + LESSON.c_s_SPEAKING_NOTES).append("<p><span class='text_remove sprite' id='noteid_"+$(this).attr('note_id')+"'></span>"+$(this).html()+"</p>");
			$(this).append('<div class="check sprite"></div>');
			
		}
		// remove  notes
		$("#" + LESSON.c_s_SPEAKING_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
                $("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				speakingnotelist.splice($.inArray(itemtoRemove[1], speakingnotelist),1);
				$(this).parent('p').remove();
				$(".speakingnotelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
	});
	$("#" + LESSON.c_s_SPEAKING_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
				$("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				speakingnotelist.splice($.inArray(itemtoRemove[1], speakingnotelist),1);
				$(this).parent('p').remove();
				$(".speakingnotelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
		
	// Listening note list Tap
	$(".listeningnotelist").off("click tap").on("click tap", function(){
	   if(($.inArray( $(this).attr('note_id'), listeningnotelist)) == -1){ 
			listeningnotelist.push($(this).attr('note_id'));
			$("#" + LESSON.c_s_LISTENING_NOTES).append("<p><span class='text_remove sprite' id='noteid_"+$(this).attr('note_id')+"'></span>"+$(this).html()+"</p>");
			$(this).append('<div class="check sprite"></div>');
			
		}
		// remove  notes
		$("#" + LESSON.c_s_LISTENING_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
                $("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				listeningnotelist.splice($.inArray(itemtoRemove[1], listeningnotelist),1);
				$(this).parent('p').remove();
				$(".listeningnotelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
	});
	$("#" + LESSON.c_s_LISTENING_NOTES + " .text_remove").off("click tap").on("click tap", function(){ 
				document.activeElement.blur();
				$("input").blur();
				var itemtoRemove = $(this).attr('id').split("_");
				listeningnotelist.splice($.inArray(itemtoRemove[1], listeningnotelist),1);
				$(this).parent('p').remove();
				$(".listeningnotelist").each(function(i){
					if($(this).attr('note_id') == itemtoRemove[1]){
						$(this).find('.check').remove();
					}
				});
		});
	
	// bind only numeric value to No of pages field
	$("#" + LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).keyup(function(e)
		{
		if (/\D/g.test(this.value))
		{
		// Filter non-digits from input value.
		this.value = this.value.replace(/\D/g, '');
		}
	});
	
	// bind booklist previous next button
	$("#" +LESSON.c_s_BOOKLIST_PREVIOUS_LINK).off("click tap").on("click tap", function(){
		//alert(1);
		var scrollDivWidth = $(".container_book_grid_view").width();
		//alert(scrollDivWidth);
	});
	$("#" +LESSON.c_s_BOOKLIST_NEXT_LINK).off("click tap").on("click tap", function(){
		var scrollDivWidth = $(".container_book_grid_view").width();
		//alert(scrollDivWidth);
		//$(".container_book_grid_view").scrollTo(300,0);
	});
	
	// bind conferenceList
	
	$('[id^=confItemId_]').off("click tap").on("click tap", function(){		
		var itemID = $(this).attr('data_value');		
		oSelf.openHistoryForm.call(this, oSelf, itemID);
	});	
}

LessonConferenceView.openHistoryForm = function (oSelf, itemID) {
	//var currentStudentConfData	=	_.where(oSelf.model.conferenceListStudentData.Content, {ItemID :$(this).attr('data_value')});		
	
	var oElem = this,
		sLessonName = "";
	$.monitor({
		'if':			function () {					
			return (objconferenceStudentData != null && objconferenceStudentData.Content && objconferenceStudentData.Content.ItemID == itemID || 
					(oSelf.model.conferencedItemId == null && $(oElem).text() == 'Close' && objconferenceStudentData.Content.ItemID == null));
		},
		'beforeStart':	function () {				
			GetConferenceStudentData(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)), $_GET(LESSON.c_s_POPUP_STUDENT_ID),itemID);
		},
		'interval':		500,
		'then':			function () {			
			oSelf.model.conferenceStudentData.Content = objconferenceStudentData.Content;
			
			//currentLessonId = $(this).attr('data_value');
			currentLessonId = itemID;
			if(isCurrent == false) {
				if(_.isEmpty(currentStudentData) == true){
					isCurrent = true;
					curitemId = $_GET(LESSON.c_s_POPUP_LESSON_ID);
					UnitLessonNo = $("#unitLessonId").html().split(", ");
					UnitNo = UnitLessonNo[0].split(LESSON.c_s_TXT_UNIT);
					LessonNo = UnitLessonNo[1].split(LESSON.c_s_TXT_LESSON+" ");
					curunitNo = $.trim(UnitNo[1]) ;
					curlessonNo	=  $.trim(LessonNo[1]) ;
					curweekNo =	$_GET(LESSON.c_s_POPUP_WEEK_NO);
					
					tempCompLevel    = $("#" + LESSON.c_s_SLIDER).slider("value");
					tempreadingTitle = ($("#" + LESSON.c_s_ADD_OUTSIDEREADING_BOOKTITLE_INPUT).val());
					tempnoOfPages    = $("#" + LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).val();
					tempwordsPerPage = $("#" + LESSON.c_s_ADD_OUTSIDEREADING_WORDS_PERPAGES_INPUT).val();
					tempBookComplete = ($("#" +LESSON.c_s_ADD_OUTSIDEREADING_COMPLETEBOOK_INPUT).is(':checked') == true) ? "true" : "false" ;
					additionaltext   = $("#" +LESSON.c_s_INPUT_ADDITIONAL_TXT).html();
					
					tempnotelist = [];
					tempnotelist = notelist;
					
					
				}else{
					isCurrent = false;
				}
			}
			oSelf.init(oSelf.model);
			confLlistId = itemID;
			sLessonName = (oSelf.model.conferenceStudentData.Content.ConferenceLessonName == null) ? 
				decodeURIComponent($_GET(LESSON.c_s_POPUP_ITEMDISPLAY_NAME)) : 
				oSelf.model.conferenceStudentData.Content.ConferenceLessonName; 
			
			$("#unitLessonId").html(sLessonName);
			
			if (($_GET(LESSON.c_s_POPUP_LESSON_ID) != oSelf.model.conferenceStudentData.Content.ItemID) && 
				!(oSelf.model.conferencedItemId == null && oSelf.model.conferenceStudentData.Content.ItemID == null)) {
				$("#BtnAddOutDone").text('Close');
			}
			else {
				$("#BtnAddOutDone").text('Done');
			}
		}
	});
	
	
	//oSelf.model.conferenceStudentData.Content = (currentStudentConfData[0]);
}

/**
* bindEvents4Slider method
* bind events for header Slider
* @return void;
*/
LessonConferenceView.bindEvents4Slider = function () {
	var oSelf = this;
	try{
	if(oSelf.model.conferenceStudentData.Content.FinalScore != null){
		var initialValue = oSelf.model.conferenceStudentData.Content.FinalScore+1;
	}else{
		var initialValue = 0;
	}
	}catch(e){
	    // for current lesson editing
		var initialValue = tempCompLevel;
		$("#" + LESSON.c_s_ADD_OUTSIDEREADING_BOOKTITLE_INPUT).val(tempreadingTitle);
        $("#" + LESSON.c_s_ADD_OUTSIDEREADING_NOOFPAGES_INPUT).val(tempnoOfPages);
		$("#" + LESSON.c_s_ADD_OUTSIDEREADING_WORDS_PERPAGES_INPUT).val(tempwordsPerPage);
		if(tempBookComplete == "true"){
			 $("#" +LESSON.c_s_ADD_OUTSIDEREADING_COMPLETEBOOK_INPUT).attr('checked',true);
		}
		$("#" +LESSON.c_s_INPUT_ADDITIONAL_TXT).html(additionaltext);
		$(".notelist").each(function(){
			$(this).find('.check').remove();
		});
		notelist = [];
		$(".notelist").each(function(){
			if($.inArray( $(this).attr('note_id'), tempnotelist) != -1){
				/* notelist.push($(this).attr('note_id'));
				$("#" + LESSON.c_s_PROCESS_ENGAGEMENT_NOTES).append("<p><span class='text_remove sprite' id='noteid_"+$(this).attr('note_id')+"'></span>"+$(this).html()+"</p>");
				$(this).append('<div class="check sprite"></div>'); */
				
			}
		});
		
	}
	
	var total = 5;
	$("#" + LESSON.c_s_SLIDER).slider({
		range: "min",
		min: 1,
		max: total,
		value: initialValue,
		step: 0.50,
		slide: function( event, ui ) {
			if(ui.value> 3){
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
				}else{ 
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
				}
		},
		stop: function(event,ui) {
			
		},
		change : function(event,ui) { 
				if(ui.value> 3){
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
				}else{ 
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
				}
			} 	
	});
	if(initialValue> 3){
		$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
	}else{ 
		$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
	}	
}

/**
* bindEvents4ParticipationSlider method
* bind events for header Slider
* @return void;
*/
LessonConferenceView.bindEvents4ParticipationSlider = function () {	
	var oSelf = this,
		data = {},
		initialValue = 0;
		
	try {
		data = (oSelf.model.conferenceStudentData.Content.ConferenceData != '') ? JSON.parse(oSelf.model.conferenceStudentData.Content.ConferenceData) : '';
		
		if (data && data.classroom_conversations.ParticipationScore != null) {
			initialValue = data.classroom_conversations.ParticipationScore + 1;
		}
		else {
			initialValue = 0;
		}
	}
	catch (e) {		
	    // for current lesson editing
		var initialValue = (typeof tempCompLevel != 'undefined') ? tempCompLevel : 0;		
		additionaltext = (typeof additionaltext != 'undefined') ? additionaltext : '';
		$("#" +LESSON.c_s_INPUT_ADDITIONAL_TXT).html(additionaltext);
		
		$(".speakingnotelist").each(function() {
			$(this).find('.check').remove();
		});
		$(".listeningnotelist").each(function() {
			$(this).find('.check').remove();
		});
		
	}
	
	var total = 5;
	$("#" + LESSON.c_s_SLIDER).slider({
		range: "min",
		min: 1,
		max: total,
		value: initialValue,
		step: 0.50,
		slide: function( event, ui ) {
			if(ui.value> 3){
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
				}else{ 
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
				}
		},
		stop: function(event,ui) {
			
		},
		change : function(event,ui) { 
				if(ui.value> 3){
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
				}else{ 
					$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
				}
			} 	
	});
	if(initialValue> 3){
		$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-headerlow").addClass("ui-widget-header");
	}else{ 
		$( "#" + LESSON.c_s_SLIDER+" .ui-slider-range" ).removeClass("ui-widget-header").addClass("ui-widget-headerlow");
	}
}

/**
* prepareStudentTodoList  method
* 
*/
LessonConferenceView.prepareStudentTodoList = function() {
	var oSelf = this,
		oItem = {},
		aAttemptData = [],
		oData = {},
		aMasterDataNew = [],
		objData = {};
		
	aMasterData = [];
	aMasterDataReverse = [];
	
	/*********** for v2 service ***********/
	if($_GET(LESSON.c_s_POPUP_SERVICE_VERSION) == "v2"){ 
		aMasterDataV2 = [];
		
		$.each(objGradeBookJsonData.Content, function (key, oItem) {						
			oData = {
				'StudentID':	oItem['SID'],
				'ItemID':		oItem['IID'],
				'ItemDisplayName':		oItem['IDN'],
				'ItemSubject':		null,
				'ItemUnitNumber':		oItem['IUN'],
				'ItemWeekNumber':		oItem['IWN'],
				'ItemLessonNumber':		oItem['ILN'],
				'ItemCompletionStatus':		oItem['ICS'],
				'ItemAttemptDataSummary':		oItem['IADS'],
				'FinalScore':		oItem['FS'],
				'SystemScore':		oItem['SS'],
				'InstructorScoreData':		oItem['IS'],
				'ItemMaxScore':		oItem['IMS'],
				'ReAssignCount':		oItem['RAC'],
				'Comment':		oItem['Cmt'],
				'ItemType':		oItem['IT'],
				'ItemSubType':		oItem['IST']				
			};
			aMasterDataV2.push(oData);			
		});		
		
		oSelf.model.gradeBookData = aMasterDataV2;
	}	
	
	/*********** for v2 service ***********/
	curStudentData = _.where(oSelf.model.gradeBookData, {StudentID: $_GET(LESSON.c_s_POPUP_STUDENT_ID)});
	
	if(oSelf.model.gradeBookData != null){		
		$.each(curStudentData, function (key, oItem) {		
			aAssignmentData = _.where(oSelf.model.assignmentListData, {ItemID: oItem['ItemID']});

			oData = {       
				'StudentId' :   oItem['StudentID'],
				'ItemID':		oItem['ItemID'],
				'ItemType':		oItem['ItemType'],
				'FinalScore':	oItem['FinalScore'],
				'ItemMaxScore':	oItem['ItemMaxScore'],
				'ItemCompletionStatus' : oItem['ItemCompletionStatus']
			};
				
			if (aAssignmentData.length) {				
				oAssignmentData = aAssignmentData.first();
				oData['ItemName'] =		oAssignmentData['ItemName'];
				oData['ItemSubject'] =	oAssignmentData['ItemSubject'];
				oData['ItemSubType'] =	oAssignmentData['ItemSubType'];
				objData = _.where(objAssignmentCategory.content[0], {alias: oData['ItemSubType']});
				if(objData.length > 0){ 
					oData['ItemSubType'] =	objData[0].name;
				}			 
				oData['UnitNumber'] =	oAssignmentData['UnitNumber'];
				oData['WeekNumber'] =	oAssignmentData['WeekNumber'];
				aMasterData.push(oData);				
			}
		});		
		
		aMasterData = _.groupBy(aMasterData, function(obj){ return obj.UnitNumber; });
				
		$.each(aMasterData, function (key,oVal) {
			aMasterDataNew.push(oVal);
		});		
		
		for (var i=_.size(aMasterDataNew); i >=0; i--) {
			if (typeof aMasterDataNew[i] != 'undefined') {
				aMasterDataReverse.push(aMasterDataNew[i]);
			}
		}				
	}
}
/**
* saveConferenceData  method
* 
*/
LessonConferenceView.saveConferenceData = function (studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle) {	
	SaveConferenceStudentData(studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle);
	setTimeout(function(){
		LessonConferenceView.saveConferenceDataCallback();
	}, 200);
	
}
/**
* saveLibraryData  method
* 
*/
LessonConferenceView.saveLibraryData = function (studentId,itemId,progressData,numberOfWordsRead){
	
	SaveLibraryProgress(studentId,itemId,progressData,numberOfWordsRead);
}

/**
* saveConferenceDataCallback  method
* 
*/
LessonConferenceView.saveConferenceDataCallback = function(){
	setTimeout(function(){
		/* if ( oPlatform.isDevice()) {
		  // nothing for device
		}else{
			objconferenceStudentData = parent.objlibraryProgressData;
		} */
		if(objconferenceStudentData != null) {
			jData = objconferenceStudentData;
			try {
				$("#loaderContainer").hide();
				$('body').css({'background-color': '#E0E1E1'});
				$('.wrapper').show();
				if(parseInt(jData.Status) == 200){
				
					LessonConferenceView._alert({
							divId:		'dialog-message',
							message:	LESSON.c_s_CONFERENCE_SAVE_RECORD_ALERT
						},
						function(){
							HideNativeBottomBar(false);
							if ( oPlatform.isDevice()) {
								CloseWebView();
							}else{
								parent.document.getElementById(LESSON.c_s_VIEW_CONFERENCE_AREA).style.display='none';
								parent.document.getElementsByClassName("bs_example_tabs")[0].style.display='block';
								parent.document.getElementsByClassName("container_space")[0].style.display='block';
								window.parent.document.getElementById("resize-button").click();	
							}
						}
					);
					
				} 
				else{
					//throw(jData.Error.ErrorUserDescription);
					LessonConferenceView._alert({
						divId:		'dialog-message',
						
						message:	jData.Error.ErrorUserDescription
					},
					function(){
						HideNativeBottomBar(false);
						if ( oPlatform.isDevice()) {
							CloseWebView();
						}else{
							parent.document.getElementById(LESSON.c_s_VIEW_CONFERENCE_AREA).style.display='none';
							parent.document.getElementsByClassName("bs_example_tabs")[0].style.display='block';
							parent.document.getElementsByClassName("container_space")[0].style.display='block';
							window.parent.document.getElementById("resize-button").click();
						}
					});
				}
			}
				catch(exp){
				if (exp.ErrorCode != "U1065") {
				LessonConferenceView._alert({
						divId:		'dialog-message',
						message:	exp.ErrorUserDescription
					},
					function(){
					    HideNativeBottomBar(false);
						if ( oPlatform.isDevice()) {
							CloseWebView();
						}else{
							parent.document.getElementById(LESSON.c_s_VIEW_CONFERENCE_AREA).style.display='none';
							parent.document.getElementsByClassName("bs_example_tabs")[0].style.display='block';
							parent.document.getElementsByClassName("container_space")[0].style.display='block';
							window.parent.document.getElementById("resize-button").click();
						}
					});
				}
			}
		}else{
			LessonConferenceView.saveConferenceDataCallback();
		} 
	}, 200);

}

/**
* saveConferenceDataCallback  method
* 
*/
LessonConferenceView.saveLibraryDataCallback = function(jDatastr){
	setTimeout(function(){
		var jData=JSON.parse(jDatastr);
		if(jData != null) {
			try {
				$("#loaderContainer").hide();
				$('body').css({'background-color': '#E0E1E1'});
				$('.wrapper').show();
				if(parseInt(jData.Status) == 200){
				
					LessonConferenceView._alert({
						divId:		'dialog-message',
						message:	LESSON.c_s_LIBRARY_SAVE_RECORD_ALERT
					},
					function(){
						
					}
					);
					
				} 
				else{
					//throw(jData.Error.ErrorUserDescription);
					LessonConferenceView._alert({
						divId:		'dialog-message',
						
						message:	jData.Error.ErrorUserDescription
					},
					function(){
						
					});
				}
			}
				catch(exp){
				if (exp.ErrorCode != "U1065") {
					LessonConferenceView._alert({
							divId:		'dialog-message',
							message:	exp.ErrorUserDescription
						},
						function(){
							
						});
				}
			}
		}else{
			LessonConferenceView.saveLibraryDataCallback(jDatastr);
		} 
	}, 2000);

}
// filter Comference Data
LessonConferenceView.filterConferenceData = function(oSelf){
	 	try{	
		 if((oSelf.model.conferenceStudentData.Content.ConferenceData != null) && (oSelf.model.conferenceStudentData.Content.ConferenceData != "null")){
			try{
					var data = JSON.parse(oSelf.model.conferenceStudentData.Content.ConferenceData);
					
					currentStudentData = (data[decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE))]);
					
					// have to show show same data for three types					
					if(decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) != LESSON_TAB_VIEW[0].c_s_TABTYPE && 
						decodeURIComponent($_GET(LESSON.c_s_POPUP_CONFERENCE_TYPE)) != LESSON_TAB_VIEW[3].c_s_TABTYPE){
							// find assignment data 
							 assignmentStudentData = data['assignment'];
							// find strategy data
							strategyStudentData = data['strategy'];
							//find individuals data
							individualsStudentData = data['individuals'];
							
							if(!(_.isEmpty(assignmentStudentData))){
								currentStudentData = assignmentStudentData;
							}else if(!(_.isEmpty(strategyStudentData))){
								currentStudentData = strategyStudentData;
							}else{
								currentStudentData = individualsStudentData;
							}
					}
					
				}catch(e){
					currentStudentData ={};
			}	
		}else{ 
			currentStudentData ={};
		 }
	}catch(e){ // for current lesson editing
		currentStudentData ={};
	}		
}

LessonConferenceView._alert   =  ISeriesBase.prototype._alert ;
LessonConferenceView._confirm =  ISeriesBase.prototype._confirm ;
