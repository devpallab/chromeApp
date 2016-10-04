// JavaScript
/**
 * Parent Organizer
 * @returns void
 */
function Organizer (poConfig) {
	this.CONSTANTS = {
		"c_s_STUDENTS_LIST_TAB_LBL": "Students",
		"c_s_STUDENT_GROUPS_TAB_LBL": "Student Groups",
		"c_s_ASSIGNMENTS_SEARCH_TAB_LBL": "Smart Search",
		"c_s_ADD_ASSIGNMENTS_TAB_LBL": "&plus; Assignments",
		"c_s_ADD_ASSIGNMENTS_LBL": "&plus; Assignments",
		"c_s_ASSIGNMENTS_ASSIGNED_TAB_LBL": "Assignments",
		"c_s_ASSIGNMENTS_GRADE_TAB_LBL": "GRADE",
		"c_s_ASSIGNMENTS_ASSIGNED_SAVE_BTN_LBL": "Assignments",
		"c_s_ORGANIZER_GLOBAL_RESET_BTN_LBL": "Reset",
		"c_s_ORGANIZER_GLOBAL_SAVE_BTN_LBL": "Save",
		"c_s_ORGANIZER_GLOBAL_SEND_BTN_LBL": "Send",
		"c_s_ORGANIZER_LOADING_TXT": "Loading...",
		"c_s_STATUS_SENT": "SENT",
		"c_s_STATUS_SCORED": "SCORED",
		"c_s_STATUS_CORE_ASSIGNMENT_ALERT": "ALL STUDENTS must be selected in order to send core assignments for a week.",
		"c_s_STATUS_GRADE_ALERT": "ALL STUDENTS must be selected in order to send GRADE assessment.",
		"c_s_ALL_GRADES_SENT_ALERT": "ALL STUDENTS have received all GRADE assessments.",
		"c_s_BOY_GRADE_NOT_SCORED_ALERT": "ALL STUDENTS have not completed BOY GRADE assessment yet.",
		"c_s_ASSIGNMENTS_ALREADY_SENT_ALERT": "ALL assignments have been sent for week \"%d\".",
		"c_s_PREVIOUS_ASSIGNMENTS_NOT_SENT_ALERT": "Core assignments for week \"%d\" have not been sent yet.",
		"c_s_SEND_GRADE_POPUP_TITLE": "Send GRADE first?",
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
		"c_s_SEND_GRADE_POPUP_MANUAL_CONF_TITLE": "Set Manual Mode ?",
		"c_s_SEND_GRADE_POPUP_MANUAL_CONF_CONTENT": (
			"You are sending assignments in <br />" +
			"Manual Mode. Once sent you can not <br />" +
			"switch to Automatic Mode <br /><br />" +
			"You can <strong>Cancel</strong> and change the mode <br />" +
			"on the Settings tab or <strong>Continue</strong> with <br />" +
			"sending assignments manually."
		),
		"c_s_SEND_GRADE_POPUP_LBL_CANCEL": "Cancel",
		"c_s_SEND_GRADE_POPUP_LBL_CONTINUE": "Continue",
		"c_s_STATUS_WAIT": "WAIT",
		"c_s_DEFAULT_READING_LEVEL": "5",
		"c_s_COLOR_TAB_LEN": 7,
		"c_s_WEEK_TAB_LEN": 30,
		"c_s_DEFAULT_READING_LEVEL": "5",
		"c_s_ASSIGNMENTS_STATUS_LBL_ASSIGNED" : "assigned",
		"c_s_GRADE_TYPE_BOY": "BOY",
		"c_s_DRAGGABLE_ITEM": ".draggable",
		"c_s_DROPPABLE_ITEM": ".dropaable",
		"c_s_DRAGGABLE_LIST": "#extra-assignment-list",
		"c_s_STATUS_AUTO": "AUTO",
		"c_s_STATUS_BLANK": "",
		"c_s_STUDENT_RESET_BTN" : "btn_students_list_reset",
		"c_s_EXTRA_ASSIGNMENTS_RESET_BTN" : "btn_assignments_reset",
		"c_s_ASSIGNMENTS_RESET_BTN" : "btn_assignments_assigned_reset",
		"c_s_ASSIGNMENTS_SEND_BTN" : "btn_assignments_assigned_send",
		"c_s_SEND_GRADE_SECTION_CONTENT": (
			"We recommend sending GRADE to the students before sending assignments. Sending GRADE will ensure that the assignments are properly leveled. Otherwise, default assignment levels will be sent."
		),
		"c_s_EXTRA_ASSIGNMENTS_SEND_MSG" : "This Assignment already been sent to the selected student(s)",
		"c_s_PARENT_SEARCH_LIST" : "parentSearchList",
		"c_i_UNIT_NO" : 1,
		"c_s_INFO_POPUP_LBL_PREVIEW": "Preview",
		"c_s_BTN_PREVIEW" : "btnPreviewPopUp",
		"c_s_ASSIGNMENT_PRETEST_TYPE": "pretest",
		"c_s_ASSIGNMENT_PRACTICE_TYPE": "practice",
		"c_s_ASSIGNMENT_POSTTEST_TYPE": "posttest",
		"c_s_ASSIGNMENTS_STATUS_LBL_WITHDRAWL": "deleted"
	};
	/* this.AssignmentCategories = {
		'frs':					'Word Reader',
		'iwt':					'Interactive Reader',
		'wrc':					'Reading Checks',
		'phonictextbasedslide':	'Word Study Readers',
		'pluralnouns':			'Word Study Practice',
		'digraphs':				'Word Study Practice',
		'word_families':		'Word Study Practice',
		'syllables':			'Word Study Practice',
		'word_sort':			'Word Study Practice',
		'rotatinglists':		'Word Study Practice',
		'grade':				'GRADE',
		'paragraph' :           'Library Response Prompt'
	}; */
	this.AssignmentCategories = {
		'wordreading':		    'Word Reader',
		'iwt':					'Interactive Reader',
		'wrc':					'Reading Checks',
		'wordstudyreader':	    'Word Study Readers',
		'wordstudypractice':    'Word Study Practice',
		'libraryresponseprompt' :'Library Response Prompt',
		'grade':				'GRADE'
	};
	this.MandatoryAssignments = [
		'WORD READER', 'INTERACTIVE READER',
		'READING CHECKS', 'WORD STUDY READERS',
		'WORD STUDY PRACTICE'
	];
	this.aStudentIDs = [];
	this.currentWeek = null;
	this.currentTab = 'Assignment';
	this.AssignmentList = [];
	this.GradeDetails = [];
	this.ExtraAssignmentList = {};
	this.SkillMappingData = {};
	this.assignmentSendingMode = 0; // 0 for manual mode
	this.weekSetting = {};
	this.objInstructorState = {};
	this.totalWeeks = 0;
	this.studExlist = {};
	this.isExAssignmentsent = 0;
	this.currentExAssignments = [];
	this.oAttemptInfo = null;
	this.isFirstTimeLoad = 1;
	this.gradeItemInfoJsPath = null;
	this.gradeItemInfoJsData = null;
	PageTemplate.call(this, poConfig);
};
Organizer.prototype = new ISeriesBase();
Organizer.prototype = Object.create(PageTemplate.prototype);
/**
 * Bind Events to Elements
 * @method bindEvents 
 * @return 
 */
Organizer.prototype.bindEvents = function () {
	var oSelf = this;
		/*==== Week Slider related events ====*/
		var iCurrentWeek = parseInt(((oSelf.getModel('header') || {}).GetCurrentWeekForClass || {}).WeekNo) || 1,
		iSwipeIndex = (oSelf.assignmentSendingMode == 0) ?  iCurrentWeek : oSelf.currentWeek;
		oSelf.bindHeaderSlider("swiper-slide", oSelf.totalWeeks, iSwipeIndex,"left_arrow","right_arrow","week-no", oSelf.showWeekInfo );
	
	/*== End Week Slider related events ==*/
	
	$('#btn_students_list_reset')
		.off('click tap')
		.on('click tap', function () {
			$(".students_list li").removeClass("selected").find(".sprite").removeClass("uicheck_icon").promise().done(function(){
				oSelf.createStudentList();
				oSelf.studentWiseAssignmentList();
			});
		});
	
	$("#select_all_students").off("click tap").on("click tap",function(){
		var oSelectedStudents = $("#student_list_tab_content #sList").find("li.selected").length;
		var allStudents = $("#student_list_tab_content #sList").find("li").length;
		(oSelectedStudents ==  allStudents) ? 
		$(".students_list li").removeClass("selected").find(".sprite").removeClass("uicheck_icon").promise().done(function(){
				oSelf.createStudentList();
				oSelf.studentWiseAssignmentList();
			}):
		$(".students_list li").addClass("selected").find(".sprite").addClass("uicheck_icon").promise().done(function(){
				oSelf.createStudentList(true);
				oSelf.studentWiseAssignmentList();
			});
		
	}); 
	
	
	$("#sList")
		.off('click')
		.on('click', 'li', function () {
			$(this).toggleClass("selected").find(".sprite").toggleClass("uicheck_icon");
			oSelf.createStudentList();
			oSelf.studentWiseAssignmentList();
		});
	
	// click event for send assignments/assessments
	$("#btn_assignments_assigned_send")
		.off('click tap')
		.on('click tap',function () { 
			if(oSelf.currentTab == "Assignment"){
				//IPP-6355
				if(oSelf.assignmentSendingMode == 1){
					oSelf.checkAndAssignGradableItem();	
					return;
				}
				//IPP-5786
				if (oSelf.isGradeSent()){ 
					oSelf.checkAndAssignGradableItem();	
					return;
				}
			}else{
					oSelf.checkAndAssignGradableItem();	
					return;
			}
			
			if($('[id^="week_no_"]').filter('.weekselected').data('weekid') == 1){ //IPP-5959
				oSelf.confSendGrade();
			}else{
				oSelf.checkAndAssignGradableItem();
			}
		});
	
	$('#assignments').find('a')
		.off('click')
		.on('click', function () {
			$(this).parent()
				.addClass('active')
				.siblings().removeClass('active');
				
			$('#' + $(this).data('tab-content'))
				.show()
				.siblings().hide();
			
			//for disable grade tab send button when there is no data in grade tab
			switch ($(this).parent().attr("id")) {
				case "grade_tab":
					oSelf.currentTab = 'Grade';
					$("#btn_assignments_assigned_send").prop("disabled",($("#grade-list").children("li").length == 0 || $("#grade-list").html() == null || $("#sList").children("li").length == 0 || $("#sList").html() == null));
					$("#grade_tab_content").parent().removeClass("outside_tab_Notes").addClass("grade_content");
					$("#students_assigned").parent(".outside_reading_cont_inner").hide();
					oSelf.resize();
				break;
				
				case "assignments_tab":
					oSelf.currentTab = 'Assignment';
					$("#btn_assignments_assigned_send").prop("disabled",($("#student-list").children("li").length == 0 || $("#student-list").html() == null || $("#sList").children("li").length == 0 || $("#sList").html() == null || oSelf.assignmentSendingMode == 1));
					//IPP-6355
					if($("#student-list").find(".draggable").length > 0){
						$("#btn_assignments_assigned_send").prop("disabled", false);
					}
					
					$("#assignments_tab_content").parent().removeClass("grade_content").addClass("outside_tab_Notes");
					$("#students_assigned").parent(".outside_reading_cont_inner").show();
					oSelf.resize();
				break;
			}
			
			return false;
		});

	//for dynamic change in grade tab
	$("#grade-list").on("DOMNodeRemoved DOMNodeInserted ",function(event){
		if($("#grade_tab").hasClass("active")){
			if (
				$("#grade-list").children("li").length == 0 ||
				$("#grade-list").html() == null
			) {
				$("#btn_assignments_assigned_send").prop("disabled", true);
				return false;
			}
			$("#btn_assignments_assigned_send").prop("disabled", false);
		}
	});
			
	$('#grade-list')
		.off('click')
		.on('click', 'li', function () {
			if ($(this).hasClass('disabled')) {
				return false;
			}
			$(this).siblings().not('.disabled').removeClass('active');
			$(this).addClass('active');
		});
	// smart search
	$('#tab_smart_search').find('a')
		.off('click')
		.on('click', function () {
			$(this).parent()
				.addClass('active')
				.siblings().removeClass('active');
				$("#extraAssignmentBlock").hide();	
			$("#smartSearchBlock").show();	
			
		});		
	// extra assignments
	$('#tab_add_assignments').find('a')
		.off('click')
		.on('click', function () {
			$(this).parent()
				.addClass('active')
				.siblings().removeClass('active');
				$("#smartSearchBlock").hide();	
				$("#extraAssignmentBlock").show();	
		});	
	/* show/hide skill and sub skills */
	$(".skilllist").off('click')
		.on('click', function () {
			var oSkillCont = $(this),
				oSubSkillCont = oSkillCont.next(".subsmart-search-list");
			$(".skilllist").not(oSkillCont).removeClass("active");
			$(this).toggleClass("active");
			$(".subsmart-search-list").not(oSubSkillCont).slideUp();
			oSubSkillCont.slideToggle(400);
			$("#extraAssignmentsSearchResult").empty();
			$("#smartSearchBlock3").empty();
			$("#btn_assignments_reset").prop("disabled", true);
		});
		// click event for showing extra assignments
	$(".subsmart-search-list").find("li").off('click')
		.on('click', function () {
			var oSubSkillCont = $(this);
			$(".skilllist").removeClass("active");
			$(".subsmart-search-list").find("li").not(oSubSkillCont).removeClass("active");
			$(this).toggleClass("active");
			var sSubSkillIds = $(this).data("subskill-id"),
				subskillIds = JSON.parse($(this).data("subskill-id").replace(/\'/g, '"')),
				skillMappingData = oSelf.getModel('content')['GetItemSkillMapping'] || {},
				extraAssignmentIds = []; // push all matching into this array
				
				extraAssignmentList = oSelf.AssignmentList.ExtraAssignments || {},
				filterExtraAsssignmentList = [];
				for(smId in skillMappingData){
					 for(var iI=0; iI< subskillIds.length; iI++){
						if(subskillIds[iI] == smId){
							extraAssignmentIds = skillMappingData[smId];
						}
					 }
				}
				/* for() */
				for(var iI =0; iI < extraAssignmentIds.length ; iI++){
					for(exAssignmentId in extraAssignmentList){
						if(extraAssignmentIds[iI] == exAssignmentId){
							if(typeof filterExtraAsssignmentList[exAssignmentId] == "undefined") {
								filterExtraAsssignmentList[exAssignmentId] = [];
							}
							filterExtraAsssignmentList[exAssignmentId].push(extraAssignmentList[exAssignmentId]);
						}
					}
				}
				
				$('#extraAssignmentsSearchResult').html(_.template($("#extraAssignmentList").html(),
				{	
					'extraAssignmentsList' : filterExtraAsssignmentList,
					'subSkillIds' : sSubSkillIds
				}));
				$('#smartSearchBlock3').html(_.template($("#extraAssignmentList").html(),
				{	
					'extraAssignmentsList' : filterExtraAsssignmentList,
					'subSkillIds' : sSubSkillIds
				}));
				if(Object.keys(filterExtraAsssignmentList).length > 0){
					$("#btn_assignments_reset").prop("disabled", false);
				}else{
					$("#btn_assignments_reset").prop("disabled", true);
				}
				$("#extraAssignmentsSearchResult").find('.smart-search-list').height($('#extraAssignmentsSearchResult').height());	
				$("#smartSearchBlock3").find('.smart-search-list').height($('#smartSearchBlock3').height());	
				oSelf.dragNDrop();
				$(".information-icon").off('click')
					.on('click', function (e) {
						var itemId = $(this).parent('li').data('itemid'),
							itemTitle = $(this).next(".middle").html()
							itemSubtype =$(this).parent('li').data("issubtype");
							e.stopPropagation();
							aPopupConfig = ({
							'title':			oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_TITLE,
							'content':			oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_CONTENT,
							'btnPreview':		oSelf.CONSTANTS.c_s_INFo_POPUP_LBL_PREVIEW,
							'height':			'400px',
							'width':			'275px',
							'confManualMode':	false
						});
						
					oSelf.showinformationPopup(aPopupConfig,itemId, itemTitle, itemSubtype);
				});
		});
		//click event for extra assignments reset
		$("#btn_assignments_reset").off('click')
		.on('click', function () {
			$(".subsmart-search-list").find("li").removeClass("active");
			$("#extraAssignmentsSearchResult").empty();
			$("#smartSearchBlock3").empty();
			$("#btn_assignments_reset").prop("disabled", true);
			$(".subsmart-search-list").slideUp();
		});
		$("#btn_assignments_assigned_reset").off('click')
		.on('click', function () {
			$(".subsmart-search-list").find("li").removeClass("active");
			$("#extraAssignmentsSearchResult").empty();
			$("#smartSearchBlock3").empty();
			$("#btn_assignments_reset").prop("disabled", true);
			$("#student-list").find(".draggable").remove();
			$(this).prop("disabled", true);
			$(".subsmart-search-list").slideUp();
			if(oSelf.assignmentSendingMode == 1){
				$("#btn_assignments_assigned_send").prop('disabled',true);
			}
		});
		
		oSelf.dragNDrop();
};

/**
 * drag and drop extra assignments to Core Assignment(s) list
 * @method dragNDrop 
 * @return 
 */
Organizer.prototype.dragNDrop = function () {
		var oSelf = this,
			dragged = 0;
		oSelf.resize();
		$(".draggable").css('-ms-touch-action', 'none');
		$(".draggable").draggable({
			appendTo: 'body', 
			helper: 'clone', 
			zIndex: 300,
			start: function(event, ui) {
				dragged = 1; // for seperating drag event and information click event of i popup
			},
			stop: function(event, ui) {
				dragged = 0; // for seperating drag event and information click event of i popup
			}
		});
			
		$("#student-list").droppable({
			/* tolerance: "touch", */
			/* over: function(event, ui) {
			$(this).css('z-index', 1);
				ui.helper.css('z-index',-1);
			}, */
			
			accept: function(ui,e) {
				if(dragged) {  // for seperating drag event and information click event of i popup
					var dragElementId = $(ui).attr('data-itemId'),
						canbe_sent = 0;
						isDroppable = true;
						$(".drag-extra-assignment").each(function(){
							if(dragElementId == $(this).attr('data-itemid')){
								isDroppable = false;
								return false;
							}
						});
						$("#student-list").find('.draggable').each(function(){
							if(dragElementId == $(this).attr('data-itemid')){
								isDroppable = false;
								return false;
							}
						});
						/** check for all student **/
						
						$.each(oSelf.aStudentIDs,function(idx,valx){
							$.each(oSelf.studExlist.sWiseExAssmt,function(id,val) {
								if((valx.id == id) && $.inArray( dragElementId, val ) != -1 ){
									canbe_sent++;
								}
							});
						});
						
						if(canbe_sent > 0 && (canbe_sent == oSelf.aStudentIDs.length)){
							oSelf._alert(oSelf.CONSTANTS.c_s_EXTRA_ASSIGNMENTS_SEND_MSG);
							isDroppable = false;
						}
						/** check for all student **/
						
						return isDroppable;
					}
			},	
			drop: function( event, ui ) {
				var html = "",
					subSkillIds =  $.trim($(ui.draggable).attr('data-subskill-id'));
					html += "<li class='draggable ui-draggable' data-subskill-id ="+subSkillIds+" data-issubtype ='"+$.trim($(ui.draggable).attr('data-issubtype'))+"' data-itemId ='"+$.trim($(ui.draggable).attr('data-itemId'))+"'>"+$.trim($(ui.draggable).text())+"</li>";
					
					//ui.draggable.detach().appendTo($(this));
					ui.draggable.detach();
					//ui.draggable.draggable('option', 'revert', true);
					$(this).append(html);
					$(".draggable-list").find("li[data-itemid='"+$.trim($(ui.draggable).attr('data-itemId'))+"']").remove();
					oSelf.dragNDrop();
					$("#btn_assignments_assigned_reset").prop('disabled',false);
					if(oSelf.assignmentSendingMode == 1){
						$("#btn_assignments_assigned_send").prop('disabled',false);
					}
		  }
		});
		$( ".draggable-list" ).droppable({
			 /* tolerance: "touch", */
			 accept: function(ui) { 
				var currentActiveMenuIds = $.trim($(".subsmart-search-list li.active").data("subskill-id")),
					subSkillIds =  $.trim($(ui).attr('data-subskill-id')),
					itemId =  $.trim($(ui).attr('data-itemid')),
					draggbleList = $(".draggable-list").find("[data-itemid='"+itemId+"']"),
					isAccept = true;
					
					if(draggbleList.length > 0){
						isAccept = false
					}else if(currentActiveMenuIds === subSkillIds){
						isAccept = true;
					}else{
						isAccept = false;
					}
				return isAccept;	
			},	 
			  drop: function( event, ui ) {
				
				var html = "",
					targetElementId  = $(event.target).parent().attr('id');
					subSkillIds =  $.trim($(ui.draggable).attr('data-subskill-id'));
					html += "<li class='draggable ui-draggable' data-subskill-id ="+subSkillIds+" data-issubtype ='"+$.trim($(ui.draggable).attr('data-issubtype'))+"' data-itemId ='"+$.trim($(ui.draggable).attr('data-itemId'))+"'>";
					html += '<div class="information-icon sprite right"></div> ';
					html += '<div class="middle">'+$.trim($(ui.draggable).text())+'</div>';
					html += '<div class="clear"></div>';
					html += "</li>";
					ui.draggable.detach();
					//ui.draggable.draggable('option', 'revert', true);
					$(this).append(html);
					if(typeof targetElementId !== "undefined"){
						if(targetElementId === "extraAssignmentsSearchResult"){
							$("#smartSearchBlock3").find("ul").append(html);
						}else{
							$("#extraAssignmentsSearchResult").find("ul").append(html);
						}						
					}
					if($("#student-list").find(".draggable").length > 1){
						$("#btn_assignments_assigned_reset").prop('disabled',false);
						if(oSelf.assignmentSendingMode == 1){
							$("#btn_assignments_assigned_send").prop('disabled',false);
						}
					}else{
						$("#btn_assignments_assigned_reset").prop('disabled',true);
						if(oSelf.assignmentSendingMode == 1){
							$("#btn_assignments_assigned_send").prop('disabled',true);
						}
					}
					oSelf.dragNDrop();
			  }
		});
};
Organizer.prototype.confSendGrade = function () {
	var oSelf = this,
		aPopupConfig = ({
			'title':			oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_TITLE,
			'content':			oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_CONTENT,
			'btnCancel':		oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CANCEL,
			'btnContinue':		oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CONTINUE,
			'height':			'306px',
			'width':			'275px',
			'confManualMode':	true
		});
	oSelf.showPopup(aPopupConfig);
};
Organizer.prototype.showPopup = function (poPopupConfig) {
	var oSelf = this;
	
	poPopupConfig = poPopupConfig || {};
	oUtility.blockElement({
		'section':			'#rightPart',
		'click-to-hide': 	false,
		'message':    		_.template(
			$('#error-pop-up').html(),
			{
				'title':		poPopupConfig.title || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_TITLE,
				'content':		poPopupConfig.content || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_CONTENT,
				'btnCancel':	poPopupConfig.btnCancel || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CANCEL,
				'btnContinue':	poPopupConfig.btnContinue || oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_LBL_CONTINUE
			}
		),
		'after-load':		function () {
			$('#btnCancelPopUp, #btnClosePopUp')
				.off('click')
				.on('click', function () {
					oUtility.unblockElement({ 'section': '#rightPart' });
				});
			$('#btnContinuePopUp')
				.off('click')
				.on('click', function () {
					if(poPopupConfig.confManualMode){
						oSelf.showPopup({
							'title':		oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_MANUAL_CONF_TITLE,
							'content':		oSelf.CONSTANTS.c_s_SEND_GRADE_POPUP_MANUAL_CONF_CONTENT,
							'height':		'306px',
						});
						return;
					}
					oSelf.checkAndAssignGradableItem();	
					oUtility.unblockElement({ 'section': '#rightPart' });
				});
		},
		'foreground-color':	'none',
		'background-color':	'#030303',
		'opacity':			0.5,
		'box-style':		{
			'height':			poPopupConfig.height || '306px',
			'width':			poPopupConfig.width || '275px',
			'line-height':		'15px',
			'opacity':			1,
			'user-select':		'none',
			'-moz-user-select':	'none'
		}
	});		
};

Organizer.prototype.showinformationPopup = function (poPopupConfig,itemId, itemTitle, itemSubtype) {
	var oSelf = this;
	
	//ILIT-551 
	itemTitle = (itemTitle.length > 32) ? 
	itemTitle.substring(0,32).substring(0, Math.min(itemTitle.length, itemTitle.lastIndexOf(" ")))+"..." :
	itemTitle;
	
	if(typeof objGradeItemsInfoData == "undefined") { objGradeItemsInfoData = {}; } //{
	poPopupConfig = poPopupConfig || {};
	//var extraAssignmentInfo = objGradeItemsInfoData['ac510fd7c8ed41978b11cb1217020053'];
	var extraAssignmentInfo = objGradeItemsInfoData.hasOwnProperty('item') ? objGradeItemsInfoData.item[itemId]  : {};
	oUtility.blockElement({
		'section':			'#rightPart',
		'click-to-hide': 	false,
		'message':    		_.template(
			$('#information-pop-up').html(),
			{
				'title':		itemTitle,
				'content':		extraAssignmentInfo,
				'btnPreview':	poPopupConfig.btnPreview || oSelf.CONSTANTS.c_s_INFO_POPUP_LBL_PREVIEW,
				'itemId' : itemId,
				'itemSubtype' : itemSubtype
			}
		),
		'after-load':		function () {
			$('#btnIClosePopUp')
				.off('click')
				.on('click', function () {
					oUtility.unblockElement({ 'section': '#rightPart' });
				});
			$("."+ oSelf.CONSTANTS.c_s_BTN_PREVIEW).off('click')
				.on('click', function () {
					oSelf.previewAssignment($(this).data());
				});				
			
		},
		'foreground-color':	'none',
		'background-color':	'#030303',
		'opacity':			0.5,
		'box-style':		{
			'height':			poPopupConfig.height || '306px',
			'width':			poPopupConfig.width || '275px',
			'line-height':		'15px',
			'opacity':			1,
			'user-select':		'none',
			'-moz-user-select':	'none'
		}
	});
	//}
	
};

Organizer.prototype.isGradeSent = function () {
	var oSelf = this,
		sCurrentSection = oSelf.getCurrentSection(),
		sStatus = '', sType = '';
	
	/*==== Check if BOY GRADE is sent ====*/
	for (var iI = 0, oGRADEMatrix = oSelf.getUserData('AssignmentMatrix')['GRADE']; iI < oGRADEMatrix.length; iI++) {
		sStatus = oGRADEMatrix[iI].STATUS.trim();
		sType = oGRADEMatrix[iI].TYPE.trim();
		if (sType === oSelf.CONSTANTS.c_s_GRADE_TYPE_BOY && sStatus.length !== 0) {
			return true;
		}
	}
	/*== End Check if BOY GRADE is sent ==*/
	//return ($('#grade-list').find('li.active[data-grade-type="BOY"]').not('.disabled').data('item-id') !== null);
	//IPP-6165
	return ($('#grade-list').find('li[data-grade-type="BOY"]').find("span").hasClass("grade_sent_btn"));
};
Organizer.prototype.isSendAllowed = function (piWeekNo) {
	var oSelf = this,
		sCurrentSection = oSelf.getCurrentSection(),
		iWeekNumber = parseInt(piWeekNo) || oSelf.getCurrentWeek(),
		oAssignmentMatrix = oSelf.getUserData('AssignmentMatrix'),
		oAssignmentList = oAssignmentMatrix[sCurrentSection],
		oCurrentAssignmentList = (
			(sCurrentSection === 'GRADE')?
			oAssignmentList:
			oAssignmentList[iWeekNumber]
		),
		oPreviousAssignmentList = (
			(iWeekNumber > 1)?
			oAssignmentList[iWeekNumber - 1]:
			{}
		);
	
	if (sCurrentSection === 'GRADE') {
		for (var iI = 0; iI < oCurrentAssignmentList.length; iI++) {
			if (oCurrentAssignmentList[iI].STATUS.trim().length === 0) {
				return true;
			}
		}
		return oSelf.CONSTANTS.c_s_ALL_GRADES_SENT_ALERT;
	}
	
	/*==== Check if BOY GRADE is completed ====*/
	for (
		var iI = 0, oGRADEMatrix = oAssignmentMatrix['GRADE'];
		iI < oGRADEMatrix.length;
		iI++
	) {
		var sStatus = oGRADEMatrix[iI].STATUS.trim();
		if (oGRADEMatrix[iI].TYPE === oSelf.CONSTANTS.c_s_ASSIGNMENTS_GRADE_TAB_LBL) {
			if (
				sStatus !== '' &&
				sStatus !== oSelf.CONSTANTS.c_s_STATUS_SCORED
			) {
				return oSelf.CONSTANTS.c_s_BOY_GRADE_NOT_SCORED_ALERT;
			}
		}
	}
	/*== End Check if BOY GRADE is completed ==*/
	
	/*== check if we are sending extra assignments or not ******/
		if($("#student-list").find('.draggable').length > 0){
			return true;
		}
	/*== check if we are sending extra assignments or not ******/
	
	/*== Check if selected week is smaller than current week ==*/
     if(oSelf.getCurrentWeek() < oSelf.currentWeek){
			return oUtility.printf(oSelf.CONSTANTS.c_s_ASSIGNMENTS_ALREADY_SENT_ALERT, iWeekNumber);
		
	 }
	/*== End check if selected week is smaller than current week ==*/
	
	/*==== Check for Assignments Sent for Current Week ====*/
	for (var sCategory in oCurrentAssignmentList) {
		for (var iI = 0; iI < oCurrentAssignmentList[sCategory].length; iI++) {
			if (oCurrentAssignmentList[sCategory][iI].STATUS.trim().length > 0) {
				if (oSelf.MandatoryAssignments.indexOf(sCategory.toUpperCase()) !== -1) {
					return oUtility.printf(oSelf.CONSTANTS.c_s_ASSIGNMENTS_ALREADY_SENT_ALERT, iWeekNumber);
				}
			}
		}
	} 
	/*== End Check for Assignments Sent for Current Week ==*/

	/*==== Check for Assignments Sent for Previous Week ====*/
	for (var sCategory in oPreviousAssignmentList) {
		for (var iI = 0; iI < oPreviousAssignmentList[sCategory].length; iI++) {
			if (oPreviousAssignmentList[sCategory][iI].STATUS.trim().length > 0) {
				if (oSelf.MandatoryAssignments.indexOf(sCategory.toUpperCase()) !== -1) {
					return true;
				}
			}
		}
	}
	/*== End Check for Assignments Sent for Previous Week ==*/
	
	return (
		(iWeekNumber === 1)?
		true:
		oUtility.printf(oSelf.CONSTANTS.c_s_PREVIOUS_ASSIGNMENTS_NOT_SENT_ALERT, (iWeekNumber - 1))
	);
};
Organizer.prototype.getCurrentSection = function () {
	return ($('#assignments').find('li.active').data('section') || 'Assignments');
};
Organizer.prototype.studentWiseAssignmentList = function () {
	var oSelf = this,
		weekNumber = parseInt($('[id^="week_no_"]').filter('.weekselected').data('weekid')) || 1,
		applicableAssignments = [],
		weekWiseAssignments = oSelf.getUserData('AssignmentMatrix')['Assignments'][weekNumber],
		/* extraAssignments = oSelf.getUserData('AssignmentMatrix')['ExtraAssignments'], */
		extraAssignments = oSelf.ExtraAssignmentList,
		grades = oSelf.getUserData('AssignmentMatrix')['GRADE'],
		studentWiseAssignments = {
			'Assignments' : {},
			'GRADE' : [],
			'ExtraAssignments' : {}
		},
		uniqGradeIds = [],
		oSelectedStudents = $("#student_list_tab_content #sList").find("li.selected"),
		selectedStudents = [];
		for (var iI = 0; iI < oSelectedStudents.length; iI++) {
			selectedStudents.push(oSelectedStudents.eq(iI).data('student-id'));
		}
		allStudents = $("#student_list_tab_content #sList").find("li").length;
		//console.log(studentWiseAssignments);
		//console.log("COPIED 1", JSON.stringify(studentWiseAssignments));
		for(var iI=0; iI < selectedStudents.length; iI++){
				for (scat in weekWiseAssignments) {
					if (typeof studentWiseAssignments['Assignments'][weekNumber] === 'undefined') { studentWiseAssignments['Assignments'][weekNumber] = {}; }
					if (typeof studentWiseAssignments['Assignments'][weekNumber][scat] === 'undefined') { studentWiseAssignments['Assignments'][weekNumber][scat] = []; }
					for (var iJ=0; iJ < weekWiseAssignments[scat].length; iJ++) {
						if (selectedStudents[iI] == weekWiseAssignments[scat][iJ].SID) {
							studentWiseAssignments['Assignments'][weekNumber][scat].push(weekWiseAssignments[scat][iJ]);
					}
				}
			}
			// for extra assignment
			 if(
				selectedStudents.length == 1 ||
				selectedStudents.length == allStudents
			 ) {   
					for (sExItemId in extraAssignments) {
						if (typeof studentWiseAssignments['ExtraAssignments'] === 'undefined') { studentWiseAssignments['ExtraAssignments'] = {}; }
						if (typeof studentWiseAssignments['ExtraAssignments'][sExItemId] === 'undefined') {
						studentWiseAssignments['ExtraAssignments'][sExItemId] = {
							'TITLE':	extraAssignments[sExItemId]['TITLE'],
							'STUDENTS':	[]
						};
					}
					for (var iJ=0; iJ < extraAssignments[sExItemId]['STUDENTS'].length; iJ++) {
								if (selectedStudents[iI] == extraAssignments[sExItemId]['STUDENTS'][iJ].SID && 
									extraAssignments[sExItemId]['STUDENTS'][iJ]['STATUS'] != ""
								) {
									studentWiseAssignments['ExtraAssignments'][sExItemId]['STUDENTS'].push({
										'SID':		extraAssignments[sExItemId]['STUDENTS'][iJ]['SID'],
										'STATUS':	extraAssignments[sExItemId]['STUDENTS'][iJ]['STATUS'],
										'WEEK'  :   extraAssignments[sExItemId]['STUDENTS'][iJ]['WEEK']
									});
									
							}
						}
					} 
			} else{
				studentWiseAssignments['ExtraAssignments'] = {};
			}
		}
		
		for(var iI=0; iI < selectedStudents.length; iI++){
			for (var iJ=0;iJ < grades.length; iJ++) {
					if (selectedStudents[iI]['id'] == grades[iJ].SID) {
						studentWiseAssignments['GRADE'].push(grades[iJ]);
				}
			}
		
		}
		if(selectedStudents.length == 0){ 
			for (scat in weekWiseAssignments) { 
				if (typeof studentWiseAssignments['Assignments'][weekNumber] === 'undefined') { studentWiseAssignments['Assignments'][weekNumber] = {}; }
				if (typeof studentWiseAssignments['Assignments'][weekNumber][scat] === 'undefined') { studentWiseAssignments['Assignments'][weekNumber][scat] = []; }
				studentWiseAssignments['Assignments'][weekNumber][scat].push({
					'SID':			"",
					'ARL':			"",
					'IID':			"",
					'STATUS':		""
				});
			
			}
			
			for(var iI=0; iI < grades.length; iI++){
				if(uniqGradeIds.indexOf(grades[iI].IID) === -1){
						uniqGradeIds.push(grades[iI].IID);
						studentWiseAssignments['GRADE'].push({
							'SID':			"",
							'IID':			grades[iI].IID,
							'TITLE':		grades[iI].TITLE,
							'STATUS':		"",
							'TYPE':			grades[iI].TYPE
						});
						continue;
					}
			}
		}
		// for auto mode
		if(oSelf.assignmentSendingMode == 1){
		
			var studentWiseAutoAssignments = $.extend(true,{}, studentWiseAssignments);
			for(var iI=0; iI < selectedStudents.length; iI++){
				for(category in studentWiseAutoAssignments['Assignments'][weekNumber]){
					for (var iJ=0; iJ < studentWiseAutoAssignments['Assignments'][weekNumber][category].length; iJ++) {
						if (selectedStudents[iI] == studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ].SID) {
							studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ]["ISSINGLE"] = "";
							if(	studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ].STATUS == "AUTO"){
								if(selectedStudents.length == allStudents || (selectedStudents.length < allStudents && selectedStudents.length >1)){
										studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ]['STATUS'] = "AUTO";
									}else{
										studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ]['STATUS'] = "";
									}
								}else{
									if(selectedStudents.length == 1){
										studentWiseAutoAssignments['Assignments'][weekNumber][category][iJ]["ISSINGLE"] = "Y";
									}
								}
						}
					}
				}
			}
				oSelf.populateAssignmentList(weekNumber, studentWiseAutoAssignments,"assignments");
		}else{
				oSelf.populateAssignmentList(weekNumber, studentWiseAssignments,"assignments");
		}
		//oSelf.populateAssignmentList(weekNumber, studentWiseAssignments,'grade');
	
};
Organizer.prototype.populateAssignmentList = function (piWeekNumber, pAssignmentMatrix, psSection) {
	var oSelf = this,
		iWeekNumber = String(parseInt(piWeekNumber) || oSelf.getCurrentWeek()),
		oAssignmentMatrix = {},
		sSection = (psSection || oSelf.getCurrentSection()).toString().toLowerCase(),
		oTemplateConfig = {
			'assignments':	'assignment-category',
			'grade':		'tpl-grade',
			'container':	'#' + sSection + '_tab_content'
		},
		oTplData = {},
		sColor = $('[id^="week_no_"]').filter('.weekselected').css("color");
	
	if (['assignments', 'grade'].indexOf(sSection) === -1) { sSection = 'assignments'; }
	if (sSection === 'assignments') {
		oAssignmentMatrix = (
			(
				(pAssignmentMatrix || {})['Assignments'] ||
				{}
			)[iWeekNumber] ||
			{}
		);
		oTemplateConfig['container'] = '#' + sSection + '_tab_content';
	}
	else {
		oAssignmentMatrix = (
			(pAssignmentMatrix || {})['GRADE'] ||
			{}
		);
		oTemplateConfig['container'] = '#' + sSection + '-list';
	}
	oTplData = $.extend(
		{ "CONSTANTS": oSelf.CONSTANTS },
		(
			(sSection === 'assignments')?
			{ "AssignmentMatrix": oAssignmentMatrix,
			 "ExtraAssignmentMatrix" : (pAssignmentMatrix || {})['ExtraAssignments'] ||
				{},
				"currentWeek" : iWeekNumber
			}:
			{ "GRADEList": oAssignmentMatrix }
		)
	);
	$(oTemplateConfig['container']).html(
		_.template($('#' + oTemplateConfig[sSection] + '-list').html(), oTplData)
	);

	if (sSection === 'assignments') {
		$("#btn_assignments_assigned_send").prop("disabled", ($("#student-list").children("li").length == 0 || $("#student-list").html() == null || $("#sList").children("li").length == 0 || $("#sList").html() == null || oSelf.assignmentSendingMode == 1));
	}
	else { 
		$("#btn_assignments_assigned_send").prop("disabled", ($("#grade-list").children("li").length == 0 || $("#grade-list").html() == null || $("#sList").children("li").length == 0 || $("#sList").html() == null));
	}
	oSelf.dragNDrop();
	
	$(".view_organize_carausal").css("border-bottom-color",sColor);
};
Organizer.prototype.createStudentList = function(isAll){
	var oSelf = this;
	oSelf.aStudentIDs = [];
	var oSelectedStudents = $("#student_list_tab_content #sList").find("li.selected");
	var allStudents = $("#student_list_tab_content #sList").find("li").length;
	for (var iI = 0; iI < oSelectedStudents.length; iI++) {
		oSelf.aStudentIDs.push({
			id:oSelectedStudents.eq(iI).data('student-id'),
			display_name:oSelectedStudents.eq(iI).data('student-name')
		});
	}
	//oSelf.studentWiseAssignmentList(oSelf.aStudentIDs);
	oSelf.createStudentListAssigned(isAll, allStudents, oSelectedStudents.length);
};
Organizer.prototype.pagingButtonShowHide = function (currentIdx, sliderLength) {
	var oSelf = this,
		counter = parseInt(currentIdx) + 1;
	
	if (sliderLength == 1) {
		$('#prevPagingBtn').hide();
		$('#nextPagingBtn').hide();
	}
	else{
		if(counter == 1){
			$('#prevPagingBtn').hide();
			$('#nextPagingBtn').show();
		}
		else if(counter >= sliderLength){ 
			$('#nextPagingBtn').hide();
			$('#prevPagingBtn').show();
		}
		else{ 
			$('#prevPagingBtn').show();
			$('#nextPagingBtn').show();
		}
	}
};
//sets the students list at organizer-right 
Organizer.prototype.createStudentListAssigned = function (isAll, allStudents, studentsSelected) {
	var oSelf = this;
	
	if(oSelf.aStudentIDs.length == 0) {
		$("#students_assigned").html("No student selected");
		return false;
	}
	if(isAll || (allStudents == studentsSelected)){
		$("#students_assigned").html("All students selected");
		return false;
	}
	
	var strStudentsAssignedInner = [];
	for(var iC = 0; iC < oSelf.aStudentIDs.length; iC++) {
		strStudentsAssignedInner.push(oSelf.aStudentIDs[iC]["display_name"]);
	}	
	$("#students_assigned").html("").append(strStudentsAssignedInner.join(', '));
};
//resize code
Organizer.prototype.resize = function () {
	var oSelf = this,
		window_height = oSelf.getWindowHeight(),
		header_height = 140/* (
			// $(".view_organize_carausal").height() +
			$(".view_organize_carausal").height() +
			parseInt($(".carausal-container").css("padding-bottom")) +
			parseInt($(".carausal-container").css("padding-top"))
		) */,
		container_height = window_height - header_height,
		outside_reading_cont_height = container_height - $(".outside_organize_heading").height(),
		// left column resize calculation
		oLeftPart = $("#leftPart"),
		left_reset_btn = oLeftPart.find(".btn-wrrrp"), 
		left_outside_reading_cont_inner = oLeftPart.find(".outside_reading_cont_inner"),
		left_student_list_tab_content = $("#student_list_tab_content"),
		
		student_list_tab_content_height	= (
			outside_reading_cont_height - (
				left_reset_btn.height() +
				parseInt(left_reset_btn.css("padding-bottom")) +
				parseInt(left_outside_reading_cont_inner.css("padding-top")) +
				parseInt(left_outside_reading_cont_inner.css("padding-bottom")) +
				parseInt(left_student_list_tab_content.css("padding-bottom"))  +
				parseInt(left_student_list_tab_content.css("padding-top"))
			)
		);
	
	left_student_list_tab_content.height(student_list_tab_content_height);
	
	
	//middle column resize calculation
	var oMiddlePart = $("#middlePart"),
		mid_reset_btn = oMiddlePart.find(".btn-wrrrp"),
		mid_outside_organize_notes2 = oMiddlePart.find(".outside_organize_notes2"),
		mid_h3 = oMiddlePart.find(".outside_organize_notes2 h3"),
		mid_smartSearchBlock1 =  $('#smartSearchBlock1 ').find('.outside_organize_notes'),
		mid_smartSearchBlock2 = $('#smartSearchBlock2').find('.outside_organize_notes'),
		extra_assignment_tab_content = $("#extraAssignmentBlock").find('.outside_organize_notes'),
		middle_assignment_list_height = (
			outside_reading_cont_height - (
				parseInt(mid_reset_btn.height()) +
				parseInt(mid_reset_btn.css("padding-bottom")) + 
				parseInt(mid_outside_organize_notes2.css("padding-top")) + 
				parseInt(mid_outside_organize_notes2.css("padding-bottom")) +
				parseInt(mid_h3.height()) +
				parseInt(mid_h3.css("padding-top")) +
				parseInt(mid_h3.css("padding-bottom")) +
				parseInt(mid_h3.css("margin-top"))+
				parseInt(mid_h3.css("margin-bottom"))+
				parseInt((mid_smartSearchBlock1.css("border-top") == "") ? 0 : mid_smartSearchBlock1.css("border-top"))+
				parseInt((mid_smartSearchBlock1.css("border-bottom") == "") ? 0 : mid_smartSearchBlock1.css("border-bottom"))+ 
				parseInt((mid_smartSearchBlock1.css("padding-top") == "") ? 0 : mid_smartSearchBlock1.css("padding-top") )+
				parseInt((mid_smartSearchBlock1.css("padding-bottom") == "") ? 0 : mid_smartSearchBlock1.css("padding-bottom"))+
				parseInt((mid_smartSearchBlock2.css("padding-top") == "") ? 0 : mid_smartSearchBlock2.css("padding-top"))+
				parseInt((mid_smartSearchBlock2.css("padding-bottom") == "") ? 0 : mid_smartSearchBlock2.css("padding-bottom"))
			)
		);
	
	mid_smartSearchBlock1.height(3 / 5 * middle_assignment_list_height); 
	mid_smartSearchBlock2.height(2 / 5 * middle_assignment_list_height);
	extra_assignment_tab_content.height(student_list_tab_content_height);
	
	// right column resize calculation
	var oRightPart = $("#rightPart"),
		right_reset_btn = oRightPart.find(".btn-wrrrp"),
		right_outside_reading_cont_inner = oRightPart.find(".outside_reading_cont_inner"),
		right_outside_tab_Notes = oRightPart.find(".outside_tab_Notes"),
		right_assignment_list_height = (
			outside_reading_cont_height - (
				right_reset_btn.height() + 
				parseInt(right_reset_btn.css("padding-bottom")) + 
				parseInt(right_outside_reading_cont_inner.css("padding-top")) + 
				parseInt(right_outside_reading_cont_inner.css("padding-bottom")) +
				parseInt(right_outside_reading_cont_inner.height()) + 
				parseInt(right_outside_reading_cont_inner.css("padding-top")) + 
				parseInt(right_outside_reading_cont_inner.css("padding-bottom")) + 
				parseInt(oRightPart.find(".outside_tab_Notes").css("padding-top")) + 
				parseInt(right_outside_tab_Notes.css("padding-bottom"))
			)
		);
	right_outside_tab_Notes.height(right_assignment_list_height);
	$("#assignments_tab_content").height(right_assignment_list_height);
	$("#student-list").height(right_assignment_list_height);
	//$(".grade_content").height();
	if(oSelf.currentTab == "Grade"){
		$(".grade_content").height($("#student_list_tab_content").height());
	}
};
Organizer.prototype.checkAndProcessAssignmentList = function (model) {
	
	var oSelf = this,
		aStudentList = oSelf.getModel('left'),
		aStudentAssignmentList = [],
		assignmentTile = [],
		oModel = {
			'Assignments':	{},
			'GRADE':		[],
			'ExtraAssignments' : {}
		},
		iWeekNumber = -1, sCategory = '', sReadingLevel = '', sItemSubType = '', iStudentID = -1,
		iCurrentWeek = parseInt(((oSelf.getModel('header') || {}).GetCurrentWeekForClass || {}).WeekNo) || 1;
	oModel['currentWeek'] = (oSelf.assignmentSendingMode == 0 ) ? iCurrentWeek.toString() : oSelf.currentWeek,
	sGradeListOrderKey = "",
	sCaListOrderKey = "";
	
	// ILIT-530
	// instructor can send re-send extra assignment
	
	if(model['GetGradebookAttemptData'].length > 0 ){
		
		model['GetGradebookAttemptData'] = _.reject(model['GetGradebookAttemptData'], function(obj){ return obj.ICS  == oSelf.CONSTANTS.c_s_ASSIGNMENTS_STATUS_LBL_WITHDRAWL; });
	}
	
	
	for (var iI = 0; iI < model['GetAssignmentListInfo'].length; iI++) {
		iWeekNumber = parseInt(model['GetAssignmentListInfo'][iI].WeekNumber).toString();
		sItemID = model['GetAssignmentListInfo'][iI].ItemID;
		sItemSubType = model['GetAssignmentListInfo'][iI].ItemSubType,
		sItemName = model['GetAssignmentListInfo'][iI].ItemName;
		if(model['GetAssignmentListInfo'][iI].ExtraPractice == "No"){
			sCategory = (
				(
					model['GetAssignmentListInfo'][iI].Category ||
					oSelf.AssignmentCategories[sItemSubType]
				) ||
				'-- Category --'
			),
			sStatus = "";
			gradeWeek = "";
			sReadingLevel = parseInt(model['GetAssignmentListInfo'][iI].ReadingLevel) || '';
			if(sCategory != 'Assignment') {
				if (typeof oModel['Assignments'][iWeekNumber] === 'undefined') { oModel['Assignments'][iWeekNumber] = {}; }
				if (typeof oModel['Assignments'][iWeekNumber][sCategory] === 'undefined') { oModel['Assignments'][iWeekNumber][sCategory] = []; }
				if(aStudentList.length == 0){
					aStudentList = [{"UserID" : "-1" }];
				}
				switch(model['GetAssignmentListInfo'][iI].ItemCategory)
					{
						case 'iwt' :
							sCaListOrderKey = "1";
							break;
						case 'wrc' :
							sCaListOrderKey = "2";
							break;
						case 'wordstudypractice' :
							sCaListOrderKey = "3";
							break;
						case 'wordstudyreader' :
							sCaListOrderKey = "4";
							break;
						case 'libraryresponseprompt' :
							sCaListOrderKey = "5";
							break;
						case 'wordreading' :
							sCaListOrderKey = "6";
							break;
						default :
							sCaListOrderKey = "";
					}
				for (var iJ = 0; iJ < aStudentList.length; iJ++) {
					sStatus = "";
					gradeWeek = "";
					iStudentID = aStudentList[iJ].UserID;
					
						if (['grade'].indexOf(sItemSubType) === -1) {
							oModel['Assignments'][iWeekNumber][sCategory].push({
								'SID':			iStudentID,
								'ARL':			sReadingLevel,
								'IID':			sItemID,
								'STATUS':		(oSelf.assignmentSendingMode == 0) ? "" : oSelf.CONSTANTS.c_s_STATUS_AUTO ,
								'ISUBTYPE' : 	sItemSubType,
								'ISVISIBLE' :   (sCategory == 'Word Reader') ? "n" : "y",
								'ISSINGLE' :   "",
								'CATEGORY' : 	model['GetAssignmentListInfo'][iI].ItemCategory,
								'ORDERKEY' :    sCaListOrderKey,
								'CATEGORY_NAME' :    sCategory
							});
							continue;
						}
						
						/* oModel['Assignments'][iWeekNumber] = _.sortBy(oModel['Assignments'][iWeekNumber], function(obj){ console.log(obj); }); */
					/*==== Get Status for GRADE Assessments ====*/
					for (var iK = 0; iK < model['GetGradebookAttemptData'].length; iK++) {
						if (
							(model['GetGradebookAttemptData'][iK].SID == iStudentID) &&
							(model['GetGradebookAttemptData'][iK].IID == sItemID)
						) {
							sStatus = model['GetGradebookAttemptData'][iK].ICS;
							gradeWeek = model['GetGradebookAttemptData'][iK].WN;
							break;
						}
					}
					/*== End Get Status for GRADE Assessments ==*/
					switch ((model['GetAssignmentListInfo'][iI].ItemSubject || '').toUpperCase())
					{
						case 'BOY' :
							sGradeListOrderKey = "1";
							break;
						case 'MOY' :
							sGradeListOrderKey = "2";
							break;
						case 'EOY' :
							sGradeListOrderKey = "3";
							break;
						default :
							sGradeListOrderKey = "1";	
					}
					oModel['GRADE'].push({
						'SID':			iStudentID,
						'IID':			sItemID,
						'TITLE':		sItemName,
						'STATUS':		sStatus,
						'TYPE':			(model['GetAssignmentListInfo'][iI].ItemSubject || '').toUpperCase(),
						'WEEK' :        gradeWeek,
						'ORDERKEY' : 	sGradeListOrderKey
					});
				}
				oModel['GRADE'] = _.sortBy(oModel['GRADE'],'ORDERKEY');
				oSelf.GradeDetails = oModel['GRADE'];
				
			}
		}else {
			// Extra Assignments
			if (typeof oModel['ExtraAssignments'] === 'undefined') { oModel['ExtraAssignments'] = {}; }
			if (typeof oModel['ExtraAssignments'][sItemID] === 'undefined') {
				oModel['ExtraAssignments'][sItemID] = {
					'TITLE':	sItemName,
					'STUDENTS':	[],
					'ISUBTYPE' : sItemSubType  // adding for preview functionality
				};
			}
			
			for (var iJ = 0; iJ < aStudentList.length; iJ++) {
				/*==== Find the Status for GetGradebookAttemptData ====*/
				sStatus = "";
				/*== End Find the Status for GetGradebookAttemptData ==*/
				iStudentID = aStudentList[iJ].UserID;
				if (['grade'].indexOf(sItemSubType) === -1) {
					oModel['ExtraAssignments'][sItemID]['STUDENTS'].push({
						'SID':		iStudentID,
						'STATUS':	"",
						'WEEK' : ""
					});
				}
			}
		}
	}
	
	for (var iI in oModel['Assignments']) {
		var oAssignmentMatrix =  oModel['Assignments'][iI];
		if (iI <= iCurrentWeek) {  
			for (var sCategory in oAssignmentMatrix) { 
				for (var iJ = 0; iJ < oAssignmentMatrix[sCategory].length; iJ++) {
					iStudentID = oAssignmentMatrix[sCategory][iJ].SID;
					sItemID = oAssignmentMatrix[sCategory][iJ].IID;
					iItemRL = oAssignmentMatrix[sCategory][iJ].ARL;
					iStudentRL = ((
						_.findWhere(
							(oSelf.getModel('left') ||{}),
							{ "UserID": iStudentID.toString() }
						) || {}
					).UserCurrentReadingLevel || oSelf.CONSTANTS.c_s_DEFAULT_READING_LEVEL);
					
					for (var iK = 0; iK < model['GetGradebookAttemptData'].length; iK++) {
						if (
							model['GetGradebookAttemptData'][iK].SID == iStudentID && 
							model['GetGradebookAttemptData'][iK].IID == sItemID
						) {
							
							/* comment out due to development*/
							/* oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.CONSTANTS.c_s_STATUS_SENT;  */
							
							 oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.checkAndAssignStatus(oAssignmentMatrix[sCategory][iJ].CATEGORY, iStudentID);
							
							//oModel['Assignments'][iI][sCategory][iJ].STATUS = "";
							if(oAssignmentMatrix[sCategory][iJ].ISUBTYPE === 'frs'){
								oModel['Assignments'][iI][sCategory][iJ].ISVISIBLE = "y";
							}
							break;
						}
					}
					
					if (true/* Check for Mandatory Assignments && */) {
						if (iK === model['GetGradebookAttemptData'].length) {
							if (iItemRL && iItemRL == iStudentRL) {
								if(iI > 1){ //IPP-5741
									
									if( 
										sCategory == "Interactive Reader"  ||
										sCategory == "Reading Checks" 
									){  
										/* comment out due to development*/
										oModel['Assignments'][iI][sCategory][iJ].STATUS  = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_WAIT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
										//oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.checkAndAssignStatus(oAssignmentMatrix[//sCategory][iJ].ISUBTYPE, iStudentID);
										
									}
								}
							}/* 
							else {
								oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.CONSTANTS.c_s_STATUS_WAIT;
							} */
						}
					}
					
					/*IPP-5782 */
						if((oSelf.getBoyGradeStatus(oModel['GRADE'],iStudentID) != "scored") &&
							(oSelf.getBoyGradeStatus(oModel['GRADE'],iStudentID) != "")
						){
							if (iItemRL && iItemRL == iStudentRL) {
								if(iI == parseInt(((oSelf.getModel('header') || {}).GetCurrentWeekForClass || {}).WeekNo)){
									/* comment out due to development*/
									/* oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.CONSTANTS.c_s_STATUS_WAIT; */
									/* oModel['Assignments'][iI][sCategory][iJ].STATUS = ""; */
									oModel['Assignments'][iI][sCategory][iJ].STATUS = oSelf.checkAndAssignStatus(oAssignmentMatrix[sCategory][iJ].CATEGORY, iStudentID);
								}
							}
						}
					/*iPP-5782 */
				}
			}
		}
	}
	var sExlist =  {'sWiseExAssmt' : {}};
	
	for (var iJ = 0; iJ < aStudentList.length; iJ++) {
		if (typeof sExlist['sWiseExAssmt'][aStudentList[iJ].UserID] === 'undefined') {
				sExlist['sWiseExAssmt'][aStudentList[iJ].UserID] = [];
		}
	} 

	
	for (var iI in oModel['ExtraAssignments']) {
		var sItemID = iI;
		for (var iK = 0; iK < model['GetGradebookAttemptData'].length; iK++) {
			for(var iJ = 0; iJ < oModel['ExtraAssignments'][iI]['STUDENTS'].length; iJ++){
				var iStudentID =oModel['ExtraAssignments'][iI]['STUDENTS'][iJ].SID;
			if ( model['GetGradebookAttemptData'][iK].SID == iStudentID && 
					model['GetGradebookAttemptData'][iK].IID == sItemID
				) {
					oModel['ExtraAssignments'][iI]['STUDENTS'][iJ]['STATUS'] = oSelf.CONSTANTS.c_s_STATUS_SENT;
					oModel['ExtraAssignments'][iI]['STUDENTS'][iJ]['WEEK'] = model['GetGradebookAttemptData'][iK].WN;
					sExlist['sWiseExAssmt'][iStudentID].push(sItemID);
					
 					break;
				}
			}
		}
	}
	oSelf.studExlist = sExlist;
	oSelf.ExtraAssignmentList = oModel['ExtraAssignments'];
	//oModel['ExtraAssignments'] = {};
	oSelf.AssignmentList = $.extend(true, {}, oModel);
	return oSelf.AssignmentList;
};
Organizer.prototype.checkAndAssignGradableItem = function () {
	var oSelf = this,
		sSection = oSelf.getCurrentSection(),
		oStudentList = $('#sList').find('li'),
		oSelectedStudents = oStudentList.filter('.selected'),
		oStudentInfo = {},
		iCurrentWeek = oSelf.getCurrentWeek(),
		oModel = this.getUserData('AssignmentMatrix'),
		oAssignmentList = (
			(sSection !== 'GRADE')?
			((oModel || {})[sSection] || {})[iCurrentWeek]:
			((oModel || {})[sSection] || [])
		),
		mixIsSendAllowed = true,
		aAssignItemJSON = [],
		oAssignItemJSON = {},
		oElement = null,
		sItemID = '',
		iStudentID = -1,
		iReadingLevel = -1,
		oUpdatedAssignmentList = $.extend(true, {}, oModel),
		fSendCoreAssignment = function(psSection, paStudentItemsJsonArray, poUpdatedAssignmentList, pbBlockUI) {
			$.nativeCall({ 
					'method':			'CheckAssignAutoScoreGradeableItems',
					'globalResource':	'objCheckAssignAutoScoreGradeableItemsResponse',
					'beforeSend':		function () {
						if (pbBlockUI === true) { oSelf.showLoader(0.5);} 
					},
					'onComplete':		function (poServiceResponse) {
						oSelf.setUserData({
							'AssignmentMatrix': poUpdatedAssignmentList
						});
						
						oSelf.populateAssignmentList(oSelf.currentWeek, oSelf.getUserData('AssignmentMatrix'));
						oSelf.hideLoader();
					},
					'onError':			function (poServiceResponse, poException, poData) {
						oSelf._alert(JSON.stringify(poServiceResponse) + '<br />' + poException.toString());
						oSelf.hideLoader();
					}
				});
			}
		fCheckAndAssign = function (psSection, paStudentItemsJsonArray, poUpdatedAssignmentList, pbBlockUI) {
			if (typeof pbBlockUI !== 'boolean') { pbBlockUI = false; }
			if (psSection === 'Assignments') {
				// sent extra assignments
				if($("#student-list").find(".draggable").length > 0) {
					var assignObj = {},
						sStudentIds	=	"",
						studItems = new Array(),
						AssignToWholeClass = false,
						oSelectedStudents = $("#student_list_tab_content #sList").find("li.selected"),
						allStudents = $("#student_list_tab_content #sList").find("li").length,
						dragItemId = "",
						data = "";
						for (var iI = 0; iI < oSelectedStudents.length; iI++) {
							sStudentIds+=	$.trim(oSelectedStudents.eq(iI).data('student-id')) + ',';
							$("#student-list").find(".draggable").each(function(){
								var sItemID = $(this).attr('data-itemId');
									oSelf.studExlist['sWiseExAssmt'][$.trim(oSelectedStudents.eq(iI).data('student-id'))].push(sItemID);
							});
						}
						if(oSelectedStudents.length ==  allStudents){
								sStudentIds = "";
								AssignToWholeClass =  true;
						}
						
						sStudentIds	=	(sStudentIds == '') ? '' : sStudentIds.substring(0, sStudentIds.length-1);
						oSelf.currentExAssignments.length = 0;
						$("#student-list").find(".draggable").each(function(){
							dragItemId = $(this).attr('data-itemId');
							oSelf.currentExAssignments.push(dragItemId);
							studItems.push({"ItemID" : dragItemId, "StudentIDs" : sStudentIds, "WeekNo" : oSelf.getCurrentWeek(),AssignToWholeClass:AssignToWholeClass});
							 
						});
						assignObj = {"studentItems": studItems};
						data  = (JSON.stringify(assignObj)).replace(/"/g, '\\"');
					$.nativeCall({
						'method':			'AssignGradeableItem',
						'globalResource':	'objAssignGradeableItemResponse',
						'inputParams':		[data],
						'beforeSend':		function () {
							oSelf.showLoader(0.5);
						},
						'onComplete':		function (poServiceResponse) {
							oSelf.isExAssignmentsent = 1;
							if( 
								$("#student-list").find(".btn-normal").length > 0 || 
								oSelf.assignmentSendingMode == 1
								) { // check if core assignments are already sent or not/ auto mode
								oSelf.setUserData({
									'AssignmentMatrix': poUpdatedAssignmentList
								});
								
								oSelf.populateAssignmentList(oSelf.getCurrentWeek(),oSelf.getUserData('AssignmentMatrix'));
								oSelf.hideLoader();
							}else{
								fSendCoreAssignment(psSection, paStudentItemsJsonArray, poUpdatedAssignmentList, pbBlockUI);
							}
						},
						'onError':			function (poServiceResponse, poException, poData) {
							oSelf.hideLoader();
						}
					});
				}else{
					fSendCoreAssignment(psSection, paStudentItemsJsonArray, poUpdatedAssignmentList, pbBlockUI);
				}
				return;
			}
			$.nativeCall({
				'method':			'AssignGradeableItem',
				'globalResource':	'objAssignGradeableItemResponse',
				'inputParams':		[JSON.stringify({ 'studentItems': paStudentItemsJsonArray }).replace(/"/g, '\\"')],
				'beforeSend':		function () {
					oSelf.showLoader(0.5);
				},
				'onComplete':		function (poServiceResponse) {
					oSelf.setUserData({
						'AssignmentMatrix': poUpdatedAssignmentList
					});
					oSelf.populateAssignmentList(oSelf.currentWeek,oSelf.getUserData('AssignmentMatrix'), 'grade');
					oSelf.hideLoader();
				},
				'onError':			function (poServiceResponse, poException, poData) {
					oSelf.hideLoader();
				}
			});
		};
	
	if ((mixIsSendAllowed = oSelf.isSendAllowed(iCurrentWeek)) !== true) {
		oSelf._alert(mixIsSendAllowed);
		return;
	}
	if (oStudentList.length !== oSelectedStudents.length) {
		if(sSection === 'Assignments') {
			if($("#student-list").find(".btn-normal").length == 0){
				oSelf._alert(oSelf.CONSTANTS.c_s_STATUS_CORE_ASSIGNMENT_ALERT);
				return;
			}
		}else{
			oSelf._alert(oSelf.CONSTANTS.c_s_STATUS_GRADE_ALERT);
			return;
		}
		/* (sSection === 'Assignments') ?
		oSelf._alert(oSelf.CONSTANTS.c_s_STATUS_CORE_ASSIGNMENT_ALERT) : 
		oSelf._alert(oSelf.CONSTANTS.c_s_STATUS_GRADE_ALERT);
		return; */
	}
	
	for (var iI = 0; iI < oSelectedStudents.length; iI++) {
		oElement = $(oSelectedStudents[iI]);
		oStudentInfo[oElement.data('student-id')] = oElement.data('reading-level');
	}
	
	if (sSection === 'Assignments') {
		var previousWeek = iCurrentWeek - 1,
			previousWeekData = ((((oModel || {})["Assignments"] || {})[previousWeek] || {})['Interactive Reader'] || []),
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
		if(typeof previousWeekData === "undefined") {
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
		}else{
			for (var iI = 0; iI < previousWeekData.length; iI++) {
					if(oSelf.assignmentSendingMode == 0){
						if (	previousWeekData[iI]["STATUS"] == "" || 
								previousWeekData[iI]["STATUS"] == oSelf.CONSTANTS.c_s_STATUS_WAIT) {
								sStatus = oSelf.CONSTANTS.c_s_STATUS_WAIT;
								break;
							}
					}else{
						if (	previousWeekData[iI]["STATUS"] == "" ) {
								sStatus = oSelf.CONSTANTS.c_s_STATUS_BLANK;
								break;
							}
					}
			}
		}
		
		for (var sCategory in oAssignmentList) {
			aAssignmentList = oAssignmentList[sCategory];
			for (iI = 0; iI < aAssignmentList.length; iI++) {
				sItemID = aAssignmentList[iI].IID;
				iStudentID = aAssignmentList[iI].SID;
				iReadingLevel = parseInt(aAssignmentList[iI].ARL) || -1;
				
				oAssignItemJSON = {
					'ItemID':				sItemID,
					'StudentIDs':			[],
					'AssignToWholeClass':	false
				};
				for (var iJ = 0; iJ < aAssignItemJSON.length; iJ++) {
					if (sItemID === aAssignItemJSON[iJ].ItemID) {
						oAssignItemJSON = aAssignItemJSON[iJ];
						oAssignItemJSON['StudentIDs'] = oAssignItemJSON['StudentIDs'].split(',');
						break;
					}
				}
				if (iReadingLevel > 0) {
					if (iReadingLevel == oStudentInfo[iStudentID]) {
						oAssignItemJSON['StudentIDs'].push(iStudentID); 
						/*IPP-5782*/
						if(oSelf.assignmentSendingMode == 0){  // for manual mode only 
							if(sStatus == oSelf.CONSTANTS.c_s_STATUS_WAIT){
								oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = 
								sStatus;
							}else{
								oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = 
								oSelf.checkAndAssignStatus(aAssignmentList[iI].CATEGORY, iStudentID);
							}
						}
						/* if(
							(oSelf.getBoyGradeStatus(oSelf.getUserData('AssignmentMatrix')['GRADE'],iStudentID) != "scored")
						&&
							(oSelf.getBoyGradeStatus(oSelf.getUserData('AssignmentMatrix')['GRADE'],iStudentID) != "")
						){
							oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = oSelf.CONSTANTS.c_s_STATUS_WAIT;
						}else{
							oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = sStatus;
						} */
						/*IPP-5782*/	
						
					}
				}
				else {
					oAssignItemJSON['StudentIDs'].push(iStudentID);
					/* oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = oSelf.CONSTANTS.c_s_STATUS_SENT; */
					if(oSelf.assignmentSendingMode == 0){  // for manual mode only 
						oUpdatedAssignmentList[sSection][iCurrentWeek][sCategory][iI]['STATUS'] = 
							oSelf.checkAndAssignStatus(aAssignmentList[iI].CATEGORY,iStudentID);
					}
					
				}
				
				if (oAssignItemJSON['StudentIDs'].length > 0) {
					if ((oAssignItemJSON['AssignToWholeClass'] = (oAssignItemJSON['StudentIDs'].length === oStudentList.length)) === true) {
						oAssignItemJSON['StudentIDs'] = '';
					}
					oAssignItemJSON['StudentIDs'] = oAssignItemJSON['StudentIDs'].toString();
					aAssignItemJSON[iJ] = oAssignItemJSON;
				}
			}
		}
		
	}
	else {
		var sSelecteItemID = $('#grade-list').find('li.active').not('.disabled').data('item-id');
		if (sSelecteItemID === null) {
			oSelf._alert("Please select a GRADE Assessment to send&hellip;");
			return;
		}
		for (var iI = 0; iI < oAssignmentList.length; iI++) {
			sItemID = oAssignmentList[iI].IID;
			iStudentID = oAssignmentList[iI].SID;
			
			if (sSelecteItemID !== sItemID) { continue; }
			
			oAssignItemJSON = {
				'ItemID':				sItemID,
				'StudentIDs':			[],
				'AssignToWholeClass':	false
			};
			for (var iJ = 0; iJ < aAssignItemJSON.length; iJ++) {
				if (sItemID === aAssignItemJSON[iJ].ItemID) {
					oAssignItemJSON = aAssignItemJSON[iJ];
					oAssignItemJSON['StudentIDs'] = oAssignItemJSON['StudentIDs'].split(',');
					break;
				}
			}
			oAssignItemJSON['StudentIDs'].push(iStudentID);
			oUpdatedAssignmentList[sSection][iI]['STATUS'] = oSelf.CONSTANTS.c_s_STATUS_SENT;
			oSelf.GradeDetails[iI]['STATUS'] = oSelf.CONSTANTS.c_s_STATUS_SENT;
			oSelf.GradeDetails[iI]['WEEK'] = oSelf.getCurrentWeek(); 
			if (oAssignItemJSON['StudentIDs'].length > 0) {
				if ((oAssignItemJSON['AssignToWholeClass'] = (oAssignItemJSON['StudentIDs'].length === oStudentList.length)) === true) {
					oAssignItemJSON['StudentIDs'] = '';
				}
				oAssignItemJSON['StudentIDs'] = oAssignItemJSON['StudentIDs'].toString();
				aAssignItemJSON[iJ] = oAssignItemJSON;
			}
		}
	}
	switch (sSection) {
		case 'Assignments':
			if (oSelf.currentWeek != iCurrentWeek) {
				//fCheckAndAssign('Assignments', aAssignItemJSON, oUpdatedAssignmentList);
				$.nativeCall({
					'method':			'SetCurrentWeekForClass',
					'globalResource':	'objSetCurrentWeekForClassResponse',
					'inputParams': 		[iCurrentWeek],
					'beforeSend':		function () {
						oSelf.showLoader(0.5);
					},
					'onComplete':		function (poServiceResponse) {
						oSelf.currentWeek = iCurrentWeek;
						oSelf.processExtraAssignments(oUpdatedAssignmentList);
						fCheckAndAssign('Assignments', aAssignItemJSON, oUpdatedAssignmentList);
					},
					'onError':			function (poServiceResponse, poException, poData) {
						if (((poServiceResponse || {}).Error || {}).ErrorCode === 'U1111') {
							oSelf.processExtraAssignments(oUpdatedAssignmentList);
							fCheckAndAssign('Assignments',aAssignItemJSON ,oUpdatedAssignmentList);
						}
						oSelf.hideLoader();
					}
				});
			}
			else {
				oSelf.processExtraAssignments(oUpdatedAssignmentList);
				fCheckAndAssign('Assignments', aAssignItemJSON, oUpdatedAssignmentList, true);
			}
		break;
		case 'GRADE':
			fCheckAndAssign('GRADE', aAssignItemJSON, oUpdatedAssignmentList);
		break;
	}
};
Organizer.prototype.processExtraAssignments = function(oUpdatedAssignmentList){
	var oSelf = this;
	if($("#student-list").find(".draggable").length > 0) {
		$("#student-list").find(".draggable").each(function(id){
			
			var extraAssignments = oUpdatedAssignmentList.ExtraAssignments || {},
				dragItemId = $(this).attr('data-itemId');
				for(exAssignmentId in extraAssignments){
					if(exAssignmentId == dragItemId){
						for(var iI=0; iI < extraAssignments[exAssignmentId].STUDENTS.length; iI++){
							oUpdatedAssignmentList.ExtraAssignments[exAssignmentId].STUDENTS[iI].STATUS = oSelf.CONSTANTS.c_s_STATUS_SENT;
							oUpdatedAssignmentList.ExtraAssignments[exAssignmentId].STUDENTS[iI].WEEK = oSelf.getCurrentWeek();
						}
					}
				}
		});
		oSelf.ExtraAssignmentList = oUpdatedAssignmentList.ExtraAssignments;
	}
};
Organizer.prototype.checkPreviousWeekAssignmentStatus = function(sItype) {
	var oSelf = this,
		iCurrentWeek = oSelf.currentWeek,
		previousWeek = iCurrentWeek - 1,
		previousWeekData = ((((oSelf.getUserData('AssignmentMatrix') || {})["Assignments"] || {})[previousWeek] || {})[sItype] || []),
		sStatus = oSelf.CONSTANTS.c_s_STATUS_SENT;
		
		if(typeof previousWeekData === "undefined") {
				sStatus = oSelf.CONSTANTS.c_s_STATUS_SENT;
		}else{
			for (var iI = 0; iI < previousWeekData.length; iI++) {
				if (	previousWeekData[iI]["STATUS"] == "" || 
						previousWeekData[iI]["STATUS"] == oSelf.CONSTANTS.c_s_STATUS_WAIT) {
						sStatus = oSelf.CONSTANTS.c_s_STATUS_WAIT;
						break;
					}
				}
			}
	return 	sStatus;	
};
Organizer.prototype.checkAndAssignStatus = function (sItemType, iStudentID) {
	
	var oSelf = this,
		sStatus = ""; 
	switch (sItemType){ 
		case 'iwt' :
			if( 
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "scored")
			&&
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "")
			){
					sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_WAIT : oSelf.CONSTANTS.c_s_STATUS_SENT;
			}else{	
					sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
			} 
			
		break;
		case 'grade' :
			sStatus = oSelf.CONSTANTS.c_s_STATUS_SENT;
		break;
		case 'pluralnouns' :
		case 'digraphs' :
		case 'word_families' :
		//case 'syllables' :
		case 'word_sort' :
		case 'rotatinglists' :
			if( 
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "scored")
			&&
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "")
			){
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_WAIT : oSelf.CONSTANTS.c_s_STATUS_BLANK;
			}else{ 
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
			} 
			
		break;
		case 'phonictextbasedslide' :
			if( 
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "scored")
			&&
				(oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != "")
			){
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_WAIT : oSelf.CONSTANTS.c_s_STATUS_BLANK;
			}else{ 
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
			} 
		break;
		case 'frs' :
			if( oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != ""){
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_BLANK;
			}else{ 
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_BLANK : oSelf.CONSTANTS.c_s_STATUS_AUTO;
			}
			if(_.isEmpty(oSelf.getUserData('AssignmentMatrix')) == false){
				if (((oSelf.getUserData('AssignmentMatrix') || {})["Assignments"] || {})[1]["Word Reader"][0]["STATUS"] == "" && 
					(sStatus == oSelf.CONSTANTS.c_s_STATUS_SENT)){
						sStatus = oSelf.CONSTANTS.c_s_STATUS_BLANK;
					}
			}	
		break;
		case 'wordreading' :
			if( oSelf.getBoyGradeStatus(oSelf.GradeDetails,iStudentID) != ""){
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_BLANK;
			}else{ 
				sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_BLANK : oSelf.CONSTANTS.c_s_STATUS_AUTO;
			}
			if(_.isEmpty(oSelf.getUserData('AssignmentMatrix')) == false){
				if (((oSelf.getUserData('AssignmentMatrix') || {})["Assignments"] || {})[1]["Word Reader"][0]["STATUS"] == "" && 
					(sStatus == oSelf.CONSTANTS.c_s_STATUS_SENT)){
						sStatus = oSelf.CONSTANTS.c_s_STATUS_BLANK;
					}
			}	
		break;
		case 'paragraph' :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
			
		break;
		case 'libraryresponseprompt' :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
			
		break;
		case 'wrc' :
		//IPP-6396
			//sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
		break;
		case 'syllables' :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
		break;
		case 'wordstudypractice' :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
		break;
		case 'wordstudyreader' :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_SENT;
		break;
		default :
			sStatus = (oSelf.assignmentSendingMode == 0 ) ? oSelf.CONSTANTS.c_s_STATUS_SENT : oSelf.CONSTANTS.c_s_STATUS_AUTO;
		break;
	}
	return sStatus;
};
Organizer.prototype.hideLoader = function () { oUtility.hideLoader(); };
Organizer.prototype.showLoader = function (pdOpacity) {
	var dOpacity = parseFloat(pdOpacity) || 1;
	
	if (!(dOpacity >= 0 && dOpacity <= 1)) { dOpacity = 1; }
	oUtility.showLoader({
		'click-to-hide': 	false,
		'message':    		'<img src="media/loader.gif" alt="' + this.CONSTANTS.c_s_ORGANIZER_LOADING_TXT + '" />\
<p style="font-size:13px; margin-top:-8px; color:#555555;">' + this.CONSTANTS.c_s_ORGANIZER_LOADING_TXT + '</p>',
		'foreground-color':	'none',
		'background-color':	'#FFFFFF',
		'opacity':			dOpacity,
		'box-style':		{
			'height':			'80px',
			'width':			'80px',
			'line-height':		'25px',
			'opacity':			dOpacity,
			'user-select':		'none',
			'-moz-user-select':	'none'
		}
	});
};
Organizer.prototype.getCurrentWeek = function () {
	var iCurrentWeek = parseInt($('[id^="week_no_"]').filter('.weekselected').data('weekid')) || 1;
	return iCurrentWeek;
};
Organizer.prototype.getBoyGradeStatus = function (oGradeModel,iStudentID) {
	if (oGradeModel.length == 0) return false;
	var oSelf = this,
		aBoyAssessmentInfo = _.filter(oGradeModel,function(obj){
		return (obj.TYPE == "BOY" && obj.SID == iStudentID);
	});
	if (aBoyAssessmentInfo.length == 0) return false;
	return aBoyAssessmentInfo[0].STATUS;
};
Organizer.prototype.showWeekInfo = function(oSelf){
	$(".students_list li").addClass("selected").find(".sprite").addClass("uicheck_icon").promise().done(function(){
			oSelf.createStudentList(true);
			oSelf.studentWiseAssignmentList();
		});
		oSelf.populateAssignmentList((this+1), oSelf.getUserData('AssignmentMatrix'));
		//IPP-5797
		$("#btn_assignments_assigned_send").prop("disabled", ($("#sList").children("li").length == 0 || $("#sList").html() == null || (oSelf.assignmentSendingMode == 1 && oSelf.currentTab == "Assignment")));
		oSelf.dragNDrop();
		
		// save Instructor data
		if(oSelf.assignmentSendingMode == 1){
				oSelf.objInstructorState['ORT']['POS']['ASGMT']['W'] = (this+1);
				$.nativeCall({
				'method':			'SaveUserSettings',
				'inputParams': 		[encodeURIComponent(JSON.stringify(oSelf.objInstructorState))],
				'globalResource':	'objSaveUserSettingsResponse',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,
				'onComplete':		function () {
				}
			});
		}
		
};
/**
	* grade item info js load
	* @returns void
*/
Organizer.prototype.gradeItemInfoJsLoad =  function () { 
	var oSelf = this;
	loadJS(oSelf.gradeItemInfoJSPath, oSelf.gradeItemInfoJsLoaded);
};
/**
	* Check grade Item Info Js Content loaded or not 
	* @returns void
*/
Organizer.prototype.gradeItemInfoJsLoaded =  function () {
	var oSelf = this;
	if (objGradeItemsInfoData  != null) {
		oSelf.gradeItemInfoJsData = objGradeItemsInfoData;
		return true;
	}
	else {
		setTimeout(function() {
			oSelf.gradeItemInfoJsLoad();
		}, 500);
	}
};
/**
 * Preview Assignment
 * @param {String} oData
 * @returns {undefined}
 */
Organizer.prototype.previewAssignment  =   function (oData) { 
	
    var oSelf = this;
		//sType = psType;
		var sCompletionStatus = '',
			sAssignmentType = 'assignment',
			sAssignmentSubType =oData['isubtype'],
			sItemName = oData['title'],
			sSubTypeMode = '',
			dFinalScore = (parseFloat(oData['finalscore']) || 0),			
			sKeyMaxScore = 'IMS',
			sKeyItemId = 'IID',
			sKeyStudentId = 'SID',
			sKeyCompletionStatus = 'ICS',
			sTargetGradeCode = oData['targetGradeCode'] || "";
		sItemName = encodeURIComponent(sItemName.specialChar2ASCII());
       
		if (sAssignmentSubType == 'studyplan') {
			var objStudyPlanTypes = {
				"Pre": oSelf.CONSTANTS.c_s_ASSIGNMENT_PRETEST_TYPE,
				"Practice": oSelf.CONSTANTS.c_s_ASSIGNMENT_PRACTICE_TYPE,
				"Post": oSelf.CONSTANTS.c_s_ASSIGNMENT_POSTTEST_TYPE
			};
			sSubTypeMode = objStudyPlanTypes[oData['section']];
			//sSubTypeMode = objStudyPlanTypes['Pre'];
		}
		var sURL = 'assignment.html?' + POPUP_VIEW.c_s_QUERY_PARAM_MODE + '=' + POPUP_VIEW.c_s_MODE_INSTRUCTOR +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_ID + '=' + $.trim(oData['item']) +/* 
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ITEM_ATTEMPT_ID + '=' + $.trim(oData.itemattemptid) + */
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_HEADER_TITLE + '=' + sItemName +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_TYPE + '=' + $.trim(sAssignmentType) +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_SUB_TYPE + '=' + $.trim(sAssignmentSubType) +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_TARGET_GRADE_CODE + '=' + $.trim(sTargetGradeCode);
		               
            sURL += '&' + POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_PLAY +
					'&' + POPUP_VIEW.c_s_QUERY_PARAM_STUDYPLAN_SUB_TYPE + '=' + sSubTypeMode;                        
		
       
		if (objPlatform.isDevice()) { //  If Device           
            HideNativeBottomBar(true);
            ShowWebView(sURL);       
			return false;
		}
		//  For Webclient            
		var $html = _.template($("#viewAssignment").html());
		oUtility.unblockElement({ 'section': '#rightPart' });	
		$(".main_wrapper").hide();
		$(".organize-bg").hide();
		$("#dialog-message").hide();	
		setTimeout(function(){
			$("#scorePopupArea").css({'width': '100%', 'height': $(window).height()+'px', 'overflow' : 'hidden'});		
			$("#scorePopupArea").show().html($html);
			$("#viewAssignmentFrame").attr('src', sURL).load(function () {
				oSelf.manageIFrame();
			});
		}, 1000);
};

/**
 * Manage Iframe Features And Resize
 * @method manageIFrame
 * @returns {undefined}
 */

Organizer.prototype.manageIFrame = function () {
    var objIframe   =   $('#viewAssignmentFrame').contents();    
    objIframe.find("#assignmentPrev").off('click').on('click', function (event) {
       event.preventDefault();
       $("#viewAssignmentFrame").attr('src', '');
       $("#scorePopupArea").css({'width': '', 'height': '', 'overflow' : ''});
       $(".main_wrapper").show();
		$(".organize-bg").show();
       $("#scorePopupArea").html('').hide();       
	   oSelf.resize ();
       return false;
    });
};

var $organizer;
$(document).ready(function () {
	objPlatform = oPlatform;
	var counter = 0;
	$organizer = new Organizer({
		'container':			'#main-container',
		'template':				'#container-organizer',
		'title':				'Organizer',
		'demo-image':			'organizer-new.png',
		'layout':				'3-columns',
		'template-config':		{
			'header':	'organizer-header',
			'footer':	'organizer-footer',
			'content':	'organizer-content',
			'left':		'organizer-left',
			'right':	'organizer-right'
		},
		'onInit':				function () {
			this.showLoader();
			
		},
		'onPageLoadComplete':	function () {
			/* IPP-6127 */
			onPageLoadComplete(GENERAL.c_s_PAGE_TYPE_ORGANIZER);
			
			/* ILIT-600 */
			setTimeout(function(){ //ILIT-871
			$organizer.hideLoader();
			$("#" +$organizer.CONSTANTS.c_s_PARENT_SEARCH_LIST).show();
			},1200);
			/* ILIT-600 */
			
			//IPP-6474 IPP-6476
			/* setTimeout(function(){
					$organizer.hideLoader();
					$("#" +$organizer.CONSTANTS.c_s_PARENT_SEARCH_LIST).show();
				},100); */
			
			//IPP-5797
			$("#btn_students_list_reset").prop("disabled", ($("#sList").children("li").length == 0 || $("#sList").html() == null));
			$("#btn_assignments_assigned_send").prop("disabled", ($("#sList").children("li").length == 0 || $("#sList").html() == null || this.assignmentSendingMode == 1));
			
		},
		'pre-load':		[
			{
				'method':			'GetUnitDetails',
				'globalResource':	'objUnitDetails',
				'checkSuccess':		function (poServiceResponse) {
					$organizer.totalWeeks = parseInt(poServiceResponse.totalWeeks) || 0;
					return ((parseInt(poServiceResponse.totalUnits) || -1) !== -1);
				}
			},
			{
				'method':			'GetClassSettings',
				'globalResource':	'objSettingsData',
				'key':				'Content',
				'checkSuccess':		function (poGetClassSettingsResponse) {
					$organizer.weekSetting = poGetClassSettingsResponse.Content;
					$organizer.assignmentSendingMode = poGetClassSettingsResponse.Content.AssignmentSendingMode;
					
					// for development 
					//$organizer.assignmentSendingMode = 1;
				}
			},
			{
				'method':			'GetUserSettings',
				'globalResource':	'objGetUserSettingsResponse',
				'checkSuccess':		function (poServiceResponse) {
					var sResponse = (poServiceResponse !== null) ? (
							(poServiceResponse.Content !== null) ? poServiceResponse.Content.PersonalSettings : '' 
						) : null;
					
					if (sResponse !== null) {
						if (sResponse !== '') {
							oInstructorSettingsData = JSON.parse(decodeURIComponent(sResponse));
						}
		
						if (
							sResponse === '' || 
							!('ADB' in oInstructorSettingsData)
						){
							$organizer.objInstructorState = {
								"ORT" : {
									"POS": {
										"ASGMT": {
											"U": 1,
											"W": 1
										},
										"AST": {
											"U": 1,
											"W": 1
										},
										"GRA": {
											"U": 1,
											"W": 1
										}
									},
									"ACTTAB": "assignment"
								},
								"ADB": {
									"POS": {
										"ASGMT": {
											"U": 1,
											"W": 1
										},
										"AST": {
											"U": 1,
											"W": 1
										},
										"GRA": {
											"U": 1,
											"W": 1
										},
										"CONF": {
											"U": 1,
											"W": 1
										},
										"GRADP": {
											"U": 1,
											"W": 1
										},
										"SUMM": {
											"U": 1,
											"W": 1
										}
									},
									"ACTTAB": "assignment"
								}
							};
						} 
						else {
							$organizer.objInstructorState  =  oInstructorSettingsData;
							//AssignmentInstructorView.ActiveTab = objInstructorState["ADB"]["ACTTAB"];
						}
					}
					
				}
			},
			{
				'source':			function (poGetUnitDetailsResponse) {
					//sgradeItemInfoJsPath = "https://ilit20dev.s3.amazonaws.com/content/ilit/ilit20cc/curriculum/gbm/grade_items_info.js";
					//sgradeItemInfoJsPath = "js/buttonInfo_json.js";
					$organizer.gradeItemInfoJSPath = poGetUnitDetailsResponse.gradeItemsInfoJSPath;
					$organizer.gradeItemInfoJsLoad();
					/* if($organizer.gradeItemInfoJsData!=null){ */
					return oUtility.printf(
						'js/extraAssignments_info.js',
						fetchGradeCode(poGetUnitDetailsResponse['gradeCode'])
					);
					/* } */					
				},
				'globalResource':	'objPerformanceInfoData',
				'depends':			'GetUnitDetails',
				'key':				'skillInfo',
				'load':				function (poPerformanceInfoData) {
					return ((poPerformanceInfoData['skill'] || {})['groups'] || {});
				}
			}
		],
		'model-config':	[
			{
				'methods':	[
					{
						'method':			'GetCurrentWeekForClass',
						'globalResource':	'objCurrentWeekJsonData',
						'key':				'Content'
					}
				],
				'preProcess':		function (poModel) {
					if($organizer.assignmentSendingMode == 0){
						this.currentWeek = poModel['GetCurrentWeekForClass']['WeekNo'];
						return poModel;
					}else{
						this.currentWeek = $organizer.objInstructorState["ORT"]["POS"]["ASGMT"]["W"];
						return poModel;
					}
				},
				'part':				'header'
			}, {
				'part':				'left',
				'method':			'GetStudentListInfo',
				'globalResource':	'objStudentListJsonData',
				'key':				'Content',
				'filter':			{ 'UserRole': 'S' },
				'preProcess':		{
					'DisplayName':	function (psUserInfo) {
						var aUserDisplayNameParts = psUserInfo['UserDisplayName'].split(' '),
							sSurname = aUserDisplayNameParts.last();
						
						aUserDisplayNameParts.splice(aUserDisplayNameParts.length - 1, 1);
						return sSurname + ', ' + aUserDisplayNameParts.join(' ');
					}
				}
			}, {
				'methods':	[
					{
						'method':			'GetAssignmentListInfo',
						'globalResource':	'objAssignmentListJsonData',
						'inputParams':		'1',
						/* 'debug':			true, */
						'key':				'Content',
						'filter':			{
							'UnitNumber':	'1'
						},
						'preProcess':		{
							'Category':	function (poAssignmentRecord) {
								//return (this.AssignmentCategories[poAssignmentRecord['ItemSubType']] || 'Assignment');
								return (this.AssignmentCategories[poAssignmentRecord['ItemCategory']] || 'Assignment');
							}
						}
					}, {
						'method':			'GetGradebookForInstructorV2',
						'globalResource':	'objGradeBookV2JsonData',
						'key':				'Content',
						/* 'debug':			true */
					}, {
						'method':			'GetGradebookAttemptData',
						'globalResource':	'objGradeBookJsonData',
						'key':				'Content',
						/* 'debug':			true, */
						'inputParams':		function (poModel) {
							var aItemAttemptIDs = _.map(poModel['GetGradebookForInstructorV2']['GradeBookData'] || [], function (obj) {
								return {
									IAID: obj.IAID,
									ARID: obj.ARID
								};
							});
							return aItemAttemptIDs;
						}
					}
				],
				'part':				'right',
				'preProcess':		function (poModel) {
					counter++;
					if(counter == 1) {
						this.setUserData({
							'AssignmentMatrix': this.checkAndProcessAssignmentList(poModel)
						});
						
						return this.getUserData('AssignmentMatrix');
					}
				}
			}, {
				'part':				'content',
				'methods':			[
					{
						'method':			'GetItemSkillMapping',
						'globalResource':	'objGetItemSkillMappingData',
						'key':				'Content',
						'debug': 			true
					}
				],
				'preProcess':		function (poModel) {
					var oSkillMappingData = {},
						aAssocSkillIDs = [],
						sAssignmentID = '',
						sAssocSkillIDs = '';
					
					for (var iI = 0; iI < poModel['GetItemSkillMapping'].length; iI++) {
						sAssocSkillIDs = poModel['GetItemSkillMapping'][iI].CSV_CMS_SkillID.trim();
						aAssocSkillIDs = (
							sAssocSkillIDs.length > 0?
							sAssocSkillIDs.split(','):
							[]
						);
						sAssignmentID = poModel['GetItemSkillMapping'][iI].ItemID.trim();
						for (var iJ = 0; iJ < aAssocSkillIDs.length; iJ++) {
							if (typeof oSkillMappingData[aAssocSkillIDs[iJ]] !== 'object') {
								oSkillMappingData[aAssocSkillIDs[iJ]] = [];
							}
							
							oSkillMappingData[aAssocSkillIDs[iJ]].push(sAssignmentID);
						}
					}
					poModel['GetItemSkillMapping'] = oSkillMappingData;
					this.SkillMappingData = poModel['GetItemSkillMapping'];
					return poModel;
				}
			}
		],
		'resize-config': []
	});
});

