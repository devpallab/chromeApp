/**
 * Assignments View
 * @class AssignmentsView
 * @module Assignment
 * @return {undefined}
 */
function AssignmentsView () {}

/**
 * Assignments View Properties
 */
AssignmentsView.prev = null;
AssignmentsView.next = null;
AssignmentsView.audio = null;
AssignmentsView.header = null;
AssignmentsView.slideHeaderTitle = null;
AssignmentsView.userType = ASSIGNMENTS.c_s_USER_TYPE_INSTRUCTOR;
AssignmentsView.slideDataValue = null;
AssignmentsView.reassignCount = null;
AssignmentsView.iLoadTOCScreen = 0;
// Flag for checking which section user is viewing currently
AssignmentsView.isUserOnTOC = true;
AssignmentsView.sTOCSection = null;
AssignmentsView.sTOCAssignment = null;
AssignmentsView.ASSIGNMENT_CATEGORY = ASSIGNMENT_CATEGORY;


/**
 * Initialize Assignment Model
 * @method init
 * @param {object} model
 * @return {undefined} 
 */
AssignmentsView.init = function (model) {
	AssignmentsView.prev = $("#" + ASSIGNMENTS.c_s_PREV);
    AssignmentsView.next = $("#" + ASSIGNMENTS.c_s_NEXT);
    AssignmentsView.audio = $("#" + ASSIGNMENTS.c_s_AUDIO);
    AssignmentsView.header = $("#" + ASSIGNMENTS.c_s_HEADER);
	AssignmentsView.bookicon = $("#" + ASSIGNMENTS.c_s_BOOK_ICON);
};

/**
 * Resize Assignment View 
 * @method resize
 * @return {undefined}
 */
AssignmentsView.resize = function () {
	if ($('#' + ASSIGNMENTS.c_s_TOC_CONTAINER).css('display') == 'block') {
		AssignmentsTOCView.resize();
	}
	else {
		var window_height = $(window).height(),
			header = $("header").outerHeight();
			
        if (aMatches = navigator.userAgent.match(/iPad;.*CPU.*OS ([0-9]+)_\d/i)) {            
            AssignmentsView.iOSVersion = parseInt(aMatches[1]);
            if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {
                $('html').addClass('ipad ios' + AssignmentsView.iOSVersion);
                if (AssignmentsView.iOSVersion < 8) {
                    window_height = screen.availWidth;
                }
                HideNativeBottomBar(true);
            }
            else {
                $('html').removeClass('ipad ios' + AssignmentsView.iOSVersion);
            } 
        }
		var actual_height = window_height - header;			
		
		if (
			AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH || 
			AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY
		) {
			/***** left box height and margin top ******/
			var left_box_height = actual_height - 60; // margin top bottom 30px			
			var left_box_inner_height = left_box_height - 12; // border deducted
			
			// add minimum height so text area is visible
			if (left_box_inner_height < 400) {
				left_box_inner_height = 400;
				left_box_height = 412;
				$('.text_box_area textarea').css('min-height','0');
			}
			
			$(".slider_swiper_inner.without_sliding_top .continent_box_space").css("height",left_box_height+'px');
			$(".continent_box_inner").css("height",left_box_inner_height);	
			
			var top_bottom_gap =  actual_height - $(".slider_swiper_inner.without_sliding_top .continent_box_space").height();
			var margin_top = top_bottom_gap/2;		
			$('.slider_swiper_inner').css('margin-top',margin_top+'px');
			
			/***** right box height and margin top *****/			
			var right_box_height = left_box_height - 50; // margin top bottom 25px and border 6px
			
			$(".continent_edit_box").css("height",right_box_height+'px');
			$(".continent_edit_box.new_tab_space.left_conts_place.summary_right_box .right_conts_element").css("height",right_box_height+'px');						 			
				
			var right_margin_top = ($(".slider_swiper_inner.without_sliding_top .continent_box_space").height() - $(".continent_edit_box").height())/2 - 6; // border deducted
			$(".continent_edit_box").css('margin-top', right_margin_top + 'px');

			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH) {
				ParagraphView.resize();
			}
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY) {
				EssayView.resize();
			}
		}
		else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT) {
			var left_box_height = actual_height - 60, // margin top bottom 30px			
				left_box_inner_height = left_box_height - 12; // border deducted
			
			// add minimum height so text area is visible
			if (left_box_inner_height < 400) {
				left_box_inner_height = 400;
				left_box_height = 412;
			}
			
			$(".daily_assignment_content").css("height",left_box_height+'px');			
			
			var top_bottom_gap =  actual_height - left_box_height;
			var margin_top = top_bottom_gap/2;		
			//$('.dailyassignment_container').parent().css('margin-top',margin_top+'px'); 
			$('.daily_assignment_content').css('margin-top',margin_top+'px');
			
			NewTypeInView.resize();
		}
		else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT) {     // Non scoreable assignment
            var left_box_height = actual_height - 60, // margin top bottom 30px            
                left_box_inner_height = left_box_height - 12; // border deducted
            
            // add minimum height so text area is visible
            if (left_box_inner_height < 400) {
                left_box_inner_height = 400;
                left_box_height = 412;
            }
            
            $(".daily_assignment_content").css("height",left_box_height+'px');            
            
            var top_bottom_gap =  actual_height - left_box_height;
            var margin_top = top_bottom_gap/2;        
            $('.dailyassignment_container').parent().css('margin-top',margin_top+'px'); 
            
            $('.da_container_box').css({'border':'4px solid #1a2b96','border-bottom':'0px'});
            $('.edit_box_title').css({'border':'4px solid #1a2b96','border-top':'0px'});
            var margin_right = ($('.edit_box_title').width()/2) - $('.button7').width() +40;
            $('.button7').css('margin-right',margin_right+'px');
            
            NonScoreAbleView.resize();
        }
		else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_ROTATING_LISTS) {
			var phonicstext_direction_height = $('.phonicstext_content').height() 
										+ parseInt($('.phonicstext_content').css('padding-top')) 
										+ parseInt($('.phonicstext_content').css('padding-bottom'));
									
			var left_box_height = actual_height - phonicstext_direction_height - 60;// margin top bottom 30px	
			
			$(".WordSlam_container").css("height",left_box_height+'px');			
			
			var top_bottom_gap =  actual_height - phonicstext_direction_height - $(".WordSlam_container").height();
			var margin_top = top_bottom_gap / 2;		
			$('.WordSlam_container').css('margin-top', margin_top + 'px');
			
			RotatingView.resize();
		}
		
		$('#' + ASSIGNMENTS.c_s_TOC_CONTAINER + ':visible').height(window_height);
		$('#' + ASSIGNMENTS.c_s_SLIDE_CONTAINER + ':visible').height(actual_height);
		
		if (AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_ASSESSMENT) {
			$("section.container_space:visible").height(
				actual_height - (
					parseInt($("section.container_space").css("padding-top")) +
					parseInt($("section.container_space").css("padding-bottom")) +
					parseInt($('.bookBoxWrap').css("padding-bottom")) +
					parseInt($('.bookBoxWrap').css("padding-top"))
				)
			);
		}
		
		if ((AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE && $('.swiper-nested1').length) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC && $('.swiper-nested1').length)) {			
			PhonicTextBasedView.swiperFirstInit();
		}
	}
};

/**
 *  scheduleCheckLoadJsSource : Used for checking whether js files have been loaded
 *  @param {String} sAssignmentType specify the type: assignment/assessment
 *  @param {String} sAssignmentSubType : specify the sub-type iwt/studyplan/fillableworksheet etc. 
 *  @param {String} sAssignmentId
 *  @param {String} sSlideHeader : specify the slide title.
 *  @param {Number} iReassignCount : holds the reassign count to ascertain if the assignment was reassigned.
 *  @param {String} sComment
 *  @param {String} sTargetGradeCode
 *  @return {undefined}
 */
AssignmentsView.scheduleCheckLoadJsSource = function (
	sAssignmentType,
	sAssignmentSubType,
	sAssignmentId,
	sSlideHeader,
	iReassignCount,
	sComment,
	sTargetGradeCode
) {
	AssignmentsView.header.text(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
	if (objAssignmentSlidesJsonData != null) {
		loadJS(objAssignmentSlidesJsonData.jsPath, function () {
			AssignmentsView.isJSContentLoaded(
				sAssignmentType,
				sAssignmentSubType,
				sAssignmentId,
				sSlideHeader,
				iReassignCount,
				sComment,
				sTargetGradeCode
			);
		});
	}
	else {
		setTimeout(function () {
			AssignmentsView.scheduleCheckLoadJsSource(
				sAssignmentType,
				sAssignmentSubType,
				sAssignmentId,
				sSlideHeader,
				iReassignCount,
				sComment,
				sTargetGradeCode
			);
		}, 500);
	}
}

/**
 *  isJSContentLoaded : Used for checking whether particular js variable i.e. JSON has been loaded
 *  @param {String} sAssignmentType specify the type: assignment/assessment
 *  @param {String} sAssignmentSubType : specify the sub-type iwt/studyplan/fillableworksheet etc. 
 *  @param {String} sAssignmentId
 *  @param {String} sSlideHeader : specify the slide title.
 *  @param {Number} iReassignCount : holds the reassign count to ascertain if the assignment was reassigned.
 *  @param {String} sComment
 *  @param {String} sTargetGradeCode.
 *  @return {undefined}
 */
AssignmentsView.isJSContentLoaded = function (
	sAssignmentType,
	sAssignmentSubType,
	sAssignmentId,
	sSlideHeader,
	iReassignCount,
	sComment,
	sTargetGradeCode
) {
	if (sAssignmentType == ASSIGNMENTS.c_s_ASSIGNMENT) {
		objAssignmentSlidesJsonData['content'] = objAssignmentData;	
		objAssignmentData = null;
	}
	else {
		if (sAssignmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE) {
			sAssignmentType = ASSIGNMENTS.c_s_ASSESSMENT;
		}
		objAssignmentSlidesJsonData['content'] = objAssessmentData;
		objAssessmentData = null;
		// AssignmentsView.gradeScoreJSPath = objAssignmentSlidesJsonData.gradeScoreJSPath;
		var sGradeCode = fetchGradeCode(objAssignmentSlidesJsonData.gradeId);
		if (sGradeCode.length === 0) {
			sGradeCode = fetchGradeCode(sTargetGradeCode);
			objAssignmentSlidesJsonData.gradeId = sGradeCode;
		}
		AssignmentsView.gradeScoreJSPath = oUtility.printf('js/grade-assessment-score/grade_assessment_score_%s.js', sGradeCode);
	}
	if (objAssignmentSlidesJsonData['content'] != null) {
		if (
			sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS ||
			sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE ||
			sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE ||
			sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE
		) {
			sAssignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS;
			if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS) {
				sAssignmentSubType = (
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_STUDYPLAN_SUB_TYPE)?
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_STUDYPLAN_SUB_TYPE):
					ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE
				);
			}
		}
		AssignmentsView.productCode = objAssignmentSlidesJsonData.productCode;
		AssignmentsView.slideDataValue = sAssignmentType + '___' + sAssignmentId + '___' + sAssignmentSubType;
		AssignmentsView.reassignCount = iReassignCount;
		AssignmentsView.slideHeaderTitle = ASCII2SpecialChar(decodeURIComponent(sSlideHeader));
		/* Application.viewType = VIEWTYPE.c_s_ASSIGNMENT_SLIDES;
		Application.view = AssigmentSlides;
		Application.callView(); */
		AssigmentSlides.init(objAssignmentSlidesJsonData, sComment);

		$('.wrapper').animate({'opacity' : '1'}, 800);
	}
	else {
		setTimeout(function () {
			AssignmentsView.isJSContentLoaded(
				sAssignmentType,
				sAssignmentSubType,
				sAssignmentId,
				sSlideHeader,
				iReassignCount,
				sComment,
				sTargetGradeCode
			);
		}, 100);
	}
};

/**
 * hideMainLoader : Hide the loader 
 * @method hideMainLoader
 * @return {undefined}
 */
AssignmentsView.hideMainLoader = function () {
	$("#loaderContainer").hide();
	$('body').css({'background-color': '#E0E1E1'});
	$('.wrapper').show();
};

/**
 * TOC View
 * @method AssignmentsTOCView
 * @return {undefined}
 */
function AssignmentsTOCView () {}

/**
 * Type In View Properties
 */
AssignmentsTOCView.model = null;

/**
 * Initialize Model for Assignment TOC
 * @method init
 * @param {Object} model
 * @return {undefined}
 */
AssignmentsTOCView.init = function (model) {
	//Initialize Properties
    AssignmentsTOCView.model = model;
    AssignmentsTOCView.template = _.template($("#" + ASSIGNMENTS.c_s_ASSIGN_TEMPLATE_TOC).html());
    AssignmentsView.init();
	AssignmentsView.userType = ASSIGNMENTS.c_s_USER_TYPE_STUDENT;
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_CONTAINER).hide();
	$("#" + ASSIGNMENTS.c_s_TOC_CONTAINER).show();
	
    AssignmentsTOCView.render();
}

AssignmentsTOCView.isAssignmentView = function () {	
	var sAssignmentId = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_ID);
	
	/* needed for passing data to eBook */
	AssigmentSlides.oAssignmentKeyData = (
		(AssignmentsView.iLoadTOCScreen == 0)?
		{
			"assignmentId" : $_GET('assignment-id'),
			"itemAttemptId" : $_GET('item-attempt-id'),
			"assignmentType" : $_GET('assignment-type'),
			"assignmentSubType" : $_GET('assignment-sub-type'),
			"headerTitle" : decodeURIComponent($_GET('header-title')),
			'reassignCount' : $_GET('reassignCount')
		}:
		{}
	);	
	
	return (AssignmentsView.iLoadTOCScreen == 0)? sAssignmentId: '';	
}

/**
 * Render Assignment TOC View 
 * @method render
 * @return {undefined}
 */
AssignmentsTOCView.render = function () {
	$("header").hide();
	var TOChtml = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		dataTemp = AssignmentsTOCView.model,
		aCategoryHtml = [],
		oAssignmentCatg = {},
		iAssignmentCount = 0,
		sActiveClass = '',
		sDisplayBlock = '',
		sStyle = '',
		aDataTemp = [],
		bItemCommentExists = false;
	
	try {	 
		$.each(dataTemp, function(k,v){
			if (v[ASSIGNMENTS.c_s_TOC_ITEM_ASSIGNED_DATE]) {
				v[ASSIGNMENTS.c_s_TOC_ITEM_ASSIGNED_DATE] = Date.parse(v[ASSIGNMENTS.c_s_TOC_ITEM_ASSIGNED_DATE]);
			}
			aDataTemp.push(v);
		});	 
		 
		dataTemp = inSort(aDataTemp, [ASSIGNMENTS.c_s_TOC_ITEM_ASSIGNED_DATE,ASSIGNMENTS.c_s_TOC_ITEM_NAME]);	 
	}
	catch (oException) {		
		dataTemp = inSort(dataTemp, [ASSIGNMENTS.c_s_TOC_ITEM_NAME]);
	}

	/* Assignment Category for iLit20 */
	if ((AssignmentsView.productCode || '').startsWith("ilit20")) {
		AssignmentsView.ASSIGNMENT_CATEGORY = ASSIGNMENT_CATEGORY_20;
	}
	 
	/*==== ASSIGNMENT CATEGORY / SECTION HTML STRUCTURE =======*/
	$.each(AssignmentsView.ASSIGNMENT_CATEGORY, function(key, oCatg) {
		sActiveClass = (AssignmentsView.sTOCSection == 'sectionLi_'+key) ? 'active' : '';		
		sDisplayBlock = (AssignmentsView.sTOCSection == 'sectionLi_'+key) ? 'style="display:block"' : '';		
		// Array of sections/category
		aCategoryHtml[oCatg.c_s_CATEGORY] = '<li class="actionshowview sectionLi ENABLE-DISABLE-CLASS '+sActiveClass+'" STYLE-PLACEHOLDER id="sectionLi_'+key+'">\
												<div class="actionshowview_inner">\
												<span class="ar_rt right sprite"></span>\
												<span class="assignment-count right COLOR-PLACEHOLDER">ASSIGNMENT-COUNT-PLACEHOLDER</span>\
												<div class="middle">'+oCatg.c_s_DISPLAY_NAME+'</div>\
													<div class="clear"></div>\
												</div>\
												<ul class="sub_menu_parent" '+sDisplayBlock+'>';
	});
	/*==== ASSIGNMENT SECTION HTML STRUCTURE ENDS ====*/
		
	if (
		typeof dataTemp != "undefined" && 
		dataTemp != null
	) {		
		$.each(dataTemp, function (idx, item) {
			bItemCommentExists = (
				'ItemComment' in item &&
				item['ItemComment'] != null &&
				item['ItemComment'] != 'null' &&
				item['ItemComment'].trim().length != 0
			);
			
			if (item.ItemSubType == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS) {		
				var subType = '',
					oRegex = /[0-9]+\/[0-9]+/g;
					
				if (item.ItemProgressSummary != null) {
					var sItemProgressSummary = $.trim(decodeURIComponent(item.ItemProgressSummary)),
						itemProgress = sItemProgressSummary.replace(/^\{+|\}+$/g, ''),
						oItemProgressSummary = {};
						
					if (itemProgress.length == 0) {					
						subType = ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE;
					}
					else {
						subType = ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE;
						
						try {
							if (oItemProgressSummary = JSON.parse(sItemProgressSummary)) {
								if (typeof oItemProgressSummary[GENERAL.c_s_TXT_SCORESUMMARY] != 'undefined') {
									itemProgress = oItemProgressSummary[GENERAL.c_s_TXT_SCORESUMMARY];
								}
							}
						}
						catch (oException) {
							
						}
						
						if (itemProgress.match(oRegex)) {
							subType = ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE;
						}
					}
				}
				else {					
					subType = ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE;
				}				
				
				// LOOK FOR THE CATEGORY / SECTION THIS ASSIGNMENT BELONGS TO 
				oAssignmentCatg = searchValue(AssignmentsView.ASSIGNMENT_CATEGORY, item.ItemSubType, "c_s_ALIAS");
				
				/*===== PUSH ASSIGNMENT UNDER ITS CATEGORY =======*/
				if (_.size(oAssignmentCatg)) {
					if (aCategoryHtml[oAssignmentCatg.c_s_CATEGORY]) {
						sActiveClass = (AssignmentsView.sTOCAssignment == 'assignmentLi_'+$.trim(item.ItemID)) ? 'active' : '';		
						sDisplayBlock = (AssignmentsView.sTOCAssignment == 'assignmentLi_'+$.trim(item.ItemID)) ? 'style="display:block"' : '';
					
						aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] += '<li ' +
							'data-value="' + item.ItemType + '___' + $.trim(item.ItemID) + '___' + item.ItemSubType + '" ' +
							'slide-header="' + item.ItemName + '" ' +
							'data-item-attempt-id="' + item.ItemAttemptID + '" ' +
							'class="actionshowview assignmentLi ' + sActiveClass + '" ' +
							'id="assignmentLi_' + $.trim(item.ItemID) + '" ' +
							'data-reassign-count="' + item.ReassignCount + '"' +
						'>\
							<div class="actionshowview_inner sub1 ' + sActiveClass + '">\
								<span class="ar_rt right sprite"></span>' +
								(
									bItemCommentExists === true?
									'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
									''
								) +
								'<div class="middle">' + item.ItemName + '</div>' +
								'<div class="clear"></div>\
							</div>' +
							(
								bItemCommentExists === true?
								'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
								''
							) +
							'<ul class="sub_menu" ' + sDisplayBlock + '>';
					
						if (subType == ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE) {
							aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] +=  '<li ' +
								'data-value="studyplan___' + $.trim(item.ItemID) + '___' + ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE + '" ' +
								'slide-header="' + item.ItemName + '" ' +
								'class="studyPlanButton"' +
							'>' +
								(
									bItemCommentExists === true?
									'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
									''
								) + '\
								<div class="middle">' + $.trim(ASSIGNMENTS.c_s_ASSIGNMENT_PRE_BTTN) + '</div>\
								' + (
									bItemCommentExists === true?
									'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
									''
								) + '\
							</li>';
						}
						else if (
							subType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE ||
							subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE
						) {
							aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] +=  '<li ' +
								'data-value="studyplan___' + $.trim(item.ItemID) + '___' + ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE + '" ' +
								'slide-header="' + item.ItemName + '" ' +
								'class="studyPlanButton disabled" ' +
							'>\
								<span class="tick right sprite"></span>\
								<div class="middle">' + $.trim(ASSIGNMENTS.c_s_ASSIGNMENT_PRE_BTTN) + '</div>\
							</li>';
									
							aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] +=  '<li ' +
								'data-value="studyplan___' + $.trim(item.ItemID) + '___' + ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE + '" ' +
								'slide-header="' + item.ItemName + '" ' +
								'class="studyPlanButton"' +
							'>' + 
								(
									bItemCommentExists === true?
									'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
									''
								) +
								(
									(subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE)?
									'<span class="tick right sprite"></span>':
									''
								) + 
								'<div class="middle">' + $.trim(ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_BTTN) + '</div>' +
								(
									bItemCommentExists === true?
									'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
									''
								) +
							'</li>';
								
							if (subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
								aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] +=  '<li ' +
									'data-value="studyplan___' + $.trim(item.ItemID) + '___' + ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE + '" ' +
									'slide-header="' + item.ItemName + '" ' +
									'class="studyPlanButton"' +
								'>' + (
									bItemCommentExists === true?
									'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
									''
								) +
									'<div class="middle">' + $.trim(ASSIGNMENTS.c_s_ASSIGNMENT_POST_BTTN) + '</div>' +
								(
									bItemCommentExists === true?
									'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
									''
								) +
								'</li>';
							}
						}
						aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] +=  '</ul>\
						</li>';
					
					}
				}
				/*===== PUSH ASSIGNMENT UNDER ITS CATEGORY ENDS =======*/	
			}
			else {			
				// LOOK FOR THE CATEGORY / SECTION THIS ASSIGNMENT BELONGS TO
				oAssignmentCatg = searchValue(AssignmentsView.ASSIGNMENT_CATEGORY, item.ItemSubType, "c_s_ALIAS");
				
				/*===== PUSH ASSIGNMENT UNDER ITS CATEGORY =======*/
				if (_.size(oAssignmentCatg)) {
					if (aCategoryHtml[oAssignmentCatg.c_s_CATEGORY]) {
						aCategoryHtml[oAssignmentCatg.c_s_CATEGORY] += '<li ' +
							'data-value="' + item.ItemType + '___' + $.trim(item.ItemID) + '___' + item.ItemSubType + '" ' +
							'slide-header="' + item.ItemName + '" ' +
							'data-item-attempt-id="' + item.ItemAttemptID + '" ' +
							'class="actionshowview assignmentLi" ' +
							'data-reassign-count="' + item.ReassignCount + '"' +
							(
								(
									item["ItemSubType"] === 'grade' &&
									item["TargetGradeCode"] !== undefined &&
									item["TargetGradeCode"] !== null
								)?
								' data-target-grade-code="' + (item["TargetGradeCode"] || '') + '"':
								''
							) + 
						'>\
							<div class="actionshowview_inner sub1">\
								' + (
									bItemCommentExists === true?
									'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
									''
								) + '\
								<div class="middle">' + item.ItemName + '</div>\
								' + '\
								<div class="clear"></div>\
							</div>' +
							(
								bItemCommentExists === true?
								'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
								''
							) +
						'</li>';
					}
				}				
				else {
					// if category not found then push it under Vocabulary and Word Study
					aCategoryHtml[ASSIGNMENTS.c_s_DEFAULT_ASSIGNMENT_CATEGORY] += '<li ' +
						'data-value="' + item.ItemType + '___' + $.trim(item.ItemID) + '___' + item.ItemSubType + '" ' +
						'slide-header="' + item.ItemName + '" ' +
						'data-item-attempt-id="' + item.ItemAttemptID + '" ' +
						'class="actionshowview assignmentLi" ' +
						'data-reassign-count="' + item.ReassignCount + '"' +
					'>\
						<div class="actionshowview_inner sub1">\
							' + (
								bItemCommentExists === true?
								'<span class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' right sprite"></span>':
								''
							) + '\
							<div class="middle">' + item.ItemName + '</div>\
							<div class="clear"></div>\
						</div>' +
						(
							bItemCommentExists === true?
							'<comment style="display:none; visibility:hidden;">' + item['ItemComment'] + '</comment>':
							''
						) +
					'</li>';
				}
				/*===== PUSH ASSIGNMENT UNDER ITS CATEGORY ENDS =======*/
				
			}
		});				
		
		/*===== CONCATENATE ALL CATEGORIES HTML TO PREPARE TOC HTML ============*/
		TOChtml = "<ul>";
		$.each(AssignmentsView.ASSIGNMENT_CATEGORY, function(key, oCatg) {			
			aCategoryHtml[oCatg.c_s_CATEGORY] += "</ul></li>";
			// Get assignments count for each category
			iAssignmentCount = $('<div/>').html(aCategoryHtml[oCatg.c_s_CATEGORY]).find('.sectionLi > ul > li').length;
			sEnableDisableClass = iAssignmentCount == 0 ? 'disable-action' : '';
			sColor = iAssignmentCount == 0 ? 'green' : 'red';
			sStyle = iAssignmentCount == 0 ? 'style="cursor:default"' : '';
			aCategoryHtml[oCatg.c_s_CATEGORY] = aCategoryHtml[oCatg.c_s_CATEGORY].replace('ASSIGNMENT-COUNT-PLACEHOLDER', iAssignmentCount)
												.replace('ENABLE-DISABLE-CLASS', sEnableDisableClass)
												.replace('COLOR-PLACEHOLDER', sColor)
												.replace('STYLE-PLACEHOLDER', sStyle);
			TOChtml += aCategoryHtml[oCatg.c_s_CATEGORY];
		});
		TOChtml += "</ul>";
		/*===== CONCATENATE ALL CATEGORIES HTML TO PREPARE TOC HTML ENDS =======*/
	}	
	
	$("#" + ASSIGNMENTS.c_s_TOC_INNER_CONTAINER).html(AssignmentsTOCView.template({data : TOChtml}));
	
    
	/**
	* Set Header Items
	*/
    AssignmentsView.prev.hide();
    AssignmentsView.next.hide();
    AssignmentsView.audio.hide();
    AssignmentsView.header.text(ASSIGNMENTS.c_s_TOC_TITLE);
    
    AssignmentsTOCView.resize();
    
    AssignmentsTOCView.bindEvents();
};

/**
 * Resize Assignment TOC View 
 * @method resize
 * @return {undefined}
 */
AssignmentsTOCView.resize = function () {
	var window_height = $(window).height();        
	var header = $("header").outerHeight();
	var actual_height = window_height - header;
	$('#' + ASSIGNMENTS.c_s_TOC_CONTAINER).height(window_height);
	var assignment_title_height = $(".assignment_title").outerHeight();
	var assignments_wrapper_margin = parseInt($('.assignments_wrapper').css('margin-top')) + parseInt($('.assignments_wrapper').css('margin-bottom'));
	
	var assignments_container_actual_height = actual_height-assignment_title_height-assignments_wrapper_margin;
	$('.assignments_container').height(assignments_container_actual_height);
};

/**
 * Redirects to TOC Page
 * @method loadAssignmentList
 * @return {undefined}
 */
AssignmentsView.loadAssignmentList = function () {	
	var fCallback = function () {	
		$.nativeCall({
			'method':				'GetAssignmentTOCInfo',
			'globalResource':		'objAssignmentTOCJsonData',
			'beforeSend':			function () {
				objAssignmentSlidesJsonData = null;
				AssignmentsView.isUserOnTOC = true;
				
				oUtility.showLoader({
					'message': '<img src="media/loader.gif" alt="" />',
					'background-color': 'FFFFFF',
					'click-to-hide': false,
					'opacity': 1
				});
			},
			'onComplete':			function (poGetTOCInfoResponse) {
				oUtility.hideLoader();
				$('body').css({'background-color': '#E0E1E1'});
				$('.wrapper').show();				
				Application.init(VIEWTYPE.c_s_ASSIGNMENT_TOC);
				$('.wrapper').animate({'opacity' : '1'}, 800);
				if (!onPageLoadCompleteStatus) {
					onPageLoadCompleteStatus = true;
					onPageLoadComplete(GENERAL.c_s_PAGE_TYPE_ASSIGNMENT);
				}
			},
			'onError':				function (poGetTOCInfoResponse) {
				oUtility.hideLoader();
				if (objAssignmentTOCJsonData.Error.ErrorCode == 'U1019') {
					/*==== Accomodate Changes in Services ====*/
					objAssignmentTOCJsonData.Content = [];
					/*== End Accomodate Changes in Services ==*/
					
					$("#loaderContainer").hide();
					$('body').css({'background-color': '#E0E1E1'});
					$('.wrapper').show();
					Application.init(VIEWTYPE.c_s_ASSIGNMENT_TOC);
					$('.wrapper').animate({'opacity' : '1'}, 800);
					if (!onPageLoadCompleteStatus) {
						onPageLoadCompleteStatus = true;
						onPageLoadComplete(GENERAL.c_s_PAGE_TYPE_ASSIGNMENT);
					}
				}
			}
		});
	}
	
	// check if GetAppProductDetailsInfo is defined for backward compatibility
	if (typeof GetAppProductDetailsInfo == 'function') {
		// get unit details
		$.nativeCall({
			'method':			'GetAppProductDetailsInfo',
			'globalResource':	'objProductDetailJsonData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'checkSuccess':		function (poServiceResponse) {
				return poServiceResponse.productCode != undefined;
			},
			'onComplete':		function () {
				AssignmentsView.productCode = objProductDetailJsonData.productCode;
				fCallback();			
			}
		});
	}
	else {
		fCallback();
	}
};

/**
 * Retrieve current RATA book IDs 
 * @return {undefined}
 */
AssignmentsView.loadCurrentBook = function () {
	
	if (typeof objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_NATIVE_VERSION] === 'undefined' || 
		objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_NATIVE_VERSION] == '') {
			
		return false;
	}	
	// check for current reading
	GetCurrentBookForStudent();
	setTimeout(function(){
		AssignmentsView.CheckForCurrentBook();
	}, 500);
};

/**
 * Get library JSON file path 
 * @return {undefined}
 */
AssignmentsView.CheckForCurrentBook = function(){	
	if (objCurrentBookForStudent != null) {		
		if (parseInt(objCurrentBookForStudent.Status) == 200) {
			//GetLibraryInfo();			
			setTimeout(function(){
				AssignmentsView.CheckLibraryDetails();
			}, 500);
		}
		else {
			//alert(objCurrentBookForStudent.Error.ErrorUserDescription);
		}
	} 
	else {
		setTimeout(function() {
			AssignmentsView.CheckForCurrentBook();
		}, 500);
	}
};

/**
 * Load library JSON file to retrieve detail of current RATA books
 * @return {undefined}
 */
AssignmentsView.CheckLibraryDetails = function() {	
	if (objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH] != null) {		
		loadJS(objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH], AssignmentsView.isLibraryLoaded);
	}
	else {
		setTimeout(AssignmentsView.CheckLibraryDetails, 500);
	}
};

/**
 * Check if library JSON file is loaded
 * @return {undefined}
 */
AssignmentsView.isLibraryLoaded = function() {
    var oSelf = this;
	if (typeof objBookList != "undefined" && objBookList != null) {
		$("#" + ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).append(
		_.template(
				$("#" + ASSIGNMENTS.c_s_BOOK_TOOLTIP_TEMPLATE).html(),
				{'objCurrentBook' : objCurrentBookForStudent,"objBookList" : objBookList  }
			)
		);
		
		if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH) {
			ParagraphView.bindEvents();
		}
		else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY) {
			EssayView.bindEvents();
		}
		else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT) {
			NewTypeInView.bindEvents();
		}
	}
	else {
		setTimeout(AssignmentsView.isLibraryLoaded, 100);
	}
 }
 /* 
 GetClassSettings
 */

AssignmentsView.getClassSettings = function(fCallback){
	 $.nativeCall({
			'method':			'GetClassSettings',
			'globalResource':	'objSettingsData',
			'onComplete':		function (objSettingsData) {
				fCallback();				
			},
			'onError':			function (poException) {
			}
		});
 }
/**
 * Load Selected Assignment
 * @method loadAssignment
 * @param {String} sAssignmentType 
 * @param {String} sAssignmentSubType
 * @param {String} sAssignmentId 
 * @param {String} sSlideHeader
 * @param {Number} iReassignCount
 * @param {String} sComment
 * @param {String} sTargetGradeCode
 * @return {undefined}
 */
AssignmentsView.loadAssignment = function (
	sAssignmentType,
	sAssignmentSubType,
	sAssignmentId,
	sItemAttemptId,
	sSlideHeader,
	iReassignCount,
	sComment,
	sTargetGradeCode
) {
	objAssignmentTOCJsonData = null;
	AssignmentsView.isUserOnTOC = false;
	AssignmentsView.sTOCSection = null;
	AssignmentsView.sTOCAssignment = null;
	AssigmentSlides.resetDataParams();
	AssigmentSlides.itemAttemptId = sItemAttemptId;	
	
	//callback defined tohandle native call getClassSettings response
	var fCallBack = function(){
		GetAssignmentSlidesInfo(sAssignmentId, sAssignmentType);
					
		var clickedLiObj = $(this);
		
		// Loader Image       
		var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
		$('body').css({'background-color': '#FFF'});
		$('.wrapper').hide();
		$("#loaderContainer").show();
		$("#loaderContainer").css({'background-color': '#FFF', 'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(loaderImg);
		
		setTimeout(function () {
			AssignmentsView.scheduleCheckLoadJsSource(
				sAssignmentType,
				sAssignmentSubType,
				sAssignmentId,
				sSlideHeader,
				iReassignCount,
				sComment,
				sTargetGradeCode
			);
		}, 300);
	}
	if (oPlatform.isWindows() && 
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
		HideNativeBottomBar(true); // done for windows
	}
	
	//call get GetClassSettings
	if ((AssignmentsView.productCode || '').startsWith("ilit20")) {
		AssignmentsView.getClassSettings(fCallBack);
	}
	else {
		fCallBack();
	}
	
};

/**
 * Bind Events for Assignment TOC 
 * @method bindEvents
 * @return {undefined}
 */
AssignmentsTOCView.bindEvents = function () {
	setTimeout(function () {
		if (AssignmentsView.isUserOnTOC) {
			GetAssignmentTOCInfo();
			setTimeout(scheduleCheck, 2000);
		}
	}, 10000);
	
	$(".sectionLi").off("click tap").on("click tap", function (event) {
		if ($(this).hasClass('disable-action')) {
			return false;
		}
		
		if ($(this).hasClass('active')) {
			$(this).find('ul.sub_menu_parent').slideUp('fast', function () {
				$(this).parent().removeClass('active');	
				AssignmentsView.sTOCSection = null;
			});
		}
		else {
			$('ul.sub_menu_parent').slideUp('fast'); // close other section
			$(".sectionLi").removeClass('active');
			$('ul.sub_menu').slideUp('fast'); // close other list
			$(".assignmentLi").removeClass('active');
			$('.sub1').removeClass('active');
			AssignmentsView.sTOCAssignment = null;
			
			$(this).find('ul.sub_menu_parent').slideDown('fast', function () {				
				$(this).parent().addClass('active');
				AssignmentsView.sTOCSection = $(this).parent().attr('id');
			});
		}		
	});
	
	$(".assignmentLi").off("click " + sWindowsEventType).on("click " + sWindowsEventType, function (event) {
		var event = event || window.event,
			dataValue = $(this).data('value'),
			dataValueArray = dataValue.split("___"),
			sSlideHeader = $(this).attr('slide-header'),
			iReassignCount = $(this).data('reassign-count'),
			sAssignmentType = dataValueArray[0],
			sAssignmentSubType = dataValueArray[2],
			sAssignmentId = dataValueArray[1],
			sItemAttemptId = $(this).data('item-attempt-id'),
			sComment = $.trim($(this).find('comment').text()),
			sTargetGradeCode = $.trim($(this).data('targetGradeCode'));
			
		if (event.stopPropagation) {
			event.stopPropagation();
		}
		else {
			event.cancelBubble = true;
		}
			
		AssigmentSlides.oAssignmentKeyData = {
			"assignmentId":			sAssignmentId,
			"itemAttemptId":		sItemAttemptId,
			"assignmentType":		sAssignmentType,
			"assignmentSubType":	sAssignmentSubType,
			"targetGradeCode":		sTargetGradeCode,
			"headerTitle":			decodeURIComponent(sSlideHeader),
			'reassignCount':		iReassignCount
		};
		
		if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS) {
			/*==== IPP-391 ====*/
			if ($(this).hasClass('active')) {
				$(this).find('ul.sub_menu').slideUp('fast', function () {
					$(this).parent().removeClass('active');
					$(this).siblings('.sub1').removeClass('active');
					$(this).removeAttr('style');
					AssignmentsView.sTOCAssignment = null;
				});
				return false;
			}
			else {				
				$('ul.sub_menu').slideUp('fast'); // close other list
				$(".assignmentLi").removeClass('active');
				$('.sub1').removeClass('active');
				$(this).find('ul.sub_menu').slideDown('fast', function () {
					$(this).parent().addClass('active');
					$(this).siblings('.sub1').addClass('active');
					AssignmentsView.sTOCAssignment = $(this).parent().attr('id');					
				});
			}
			/*== End IPP-391 ==*/			
			
			$('.studyPlanButton')
				.not('.disabled')
					.off("click " + sWindowsEventType)
					.on("click " + sWindowsEventType, function () {
						var oSelf = $(this);
						objAssignmentTOCJsonData = null;
						AssignmentsView.isUserOnTOC = false;						
						
						$.nativeCall({
							'method':			'GetAssignmentSlidesInfo',
							'inputParams': 		[dataValueArray[1], dataValueArray[0]],
							'globalResource':	'objAssignmentSlidesJsonData',
							'interval':			500,
							'breakAfter':		125000,
							'debug':			false,
							'checkSuccess':		function (poServiceResponse) {
								return poServiceResponse.rootFolderPath ? true : false;
							},
							'onComplete':		function () {
								// process data	
								var clickedLiObj = oSelf,
									sComment = $.trim(clickedLiObj.find('comment').text());
									
								AssignmentsView.productCode = objAssignmentSlidesJsonData.productCode;
								
								// Loader Image       
								var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
								$('body').css({'background-color': '#FFF'});
								$('.wrapper').hide();
								$("#loaderContainer").show();
								$("#loaderContainer")
									.css({
										'background-color': '#FFF',
										'text-align':'center',
										'top' : '45%',
										'left': '50%',
										'position' : 'absolute'
									})
									.html(loaderImg);
								sAssignmentSubType = oSelf.data('value').split('___').last();
								setTimeout(function () {
									AssignmentsView.loadAssignment(
										sAssignmentType,
										sAssignmentSubType,
										sAssignmentId,
										sItemAttemptId,
										sSlideHeader,
										iReassignCount,
										sComment
									);
								}, 300);
							}
						});
					});
			$('.studyPlanButton')
				.filter('.disabled')
					.on('click tap', function (oEvent) {
						oEvent.stopPropagation();
					});
		}
		else {
			AssignmentsView.loadAssignment(
				sAssignmentType,
				sAssignmentSubType,
				sAssignmentId,
				sItemAttemptId,
				sSlideHeader,
				iReassignCount,
				sComment,
				sTargetGradeCode
			);
		}
    });
};


/**
 * Assignment Slides Object
 * @method AssigmentSlides
 * @return {undefined}
 */
function AssigmentSlides () {}

/*
 * Slide Properties	
 */
AssigmentSlides.model = null;
AssigmentSlides.mediaPath = null;
AssigmentSlides.videoPath = null;
AssigmentSlides.introVideo = null;
AssigmentSlides.referenceKey = null;
AssigmentSlides.assignmentType = null;
AssigmentSlides.headerTitle = null;
AssigmentSlides.slidingEngineType = null;
AssigmentSlides.slidingEngine = null;
AssigmentSlides.getAttemptDataForGradeableItem = null;
AssigmentSlides.studentAttemptData = null;
AssigmentSlides.studentAttemptSummary = {};
AssigmentSlides.systemScore = null;
AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
AssigmentSlides.itemComplete = null;
AssigmentSlides.parallelexEngine = null;
AssigmentSlides.commonSubmitButtonClass = 'slideCommonSubmitButton';
AssigmentSlides.audioFiles = null;
AssigmentSlides.allowSwipeStart = true;
AssigmentSlides.bAudioExists = false;
AssigmentSlides.bAudioSaved = true;
AssigmentSlides.bAudioPaused = false;
AssigmentSlides.oAssignmentKeyData = {};

AssigmentSlides._alert = ISeriesBase.prototype._alert;
AssigmentSlides._confirm = ISeriesBase.prototype._confirm;

/**
 * Reset Data of Assignment Slides Object
 * @method resetDataParams
 * @return {undefined}
 */
AssigmentSlides.resetDataParams = function () {
	var oSelf = this;
	
	oSelf.getAttemptDataForGradeableItem = null;
	oSelf.studentAttemptData = null;
	oSelf.studentAttemptSummary = {};
	oSelf.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	oSelf.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	oSelf.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
};
/*== End Introduced on 29-July-2014 ==*/

/**
 * Initialize Assignment Slides Model
 * @method init
 * @param {Object} model
 * @param {String} sComment
 * @return {undefined}
 */
AssigmentSlides.init = function (model, sComment) {
	$('#' + ASSIGNMENTS.c_s_TOC_CONTAINER).hide();
	$('#' + ASSIGNMENTS.c_s_SLIDE_CONTAINER).show();
	$('#' + ASSIGNMENTS.c_s_SLIDE_CONTAINER).empty();	
	$('header').show();
	
	var dataValue = AssignmentsView.slideDataValue,
		dataValueArray = dataValue.split("___"),
		sAssignmentType = dataValueArray[0],
		sAssignmentSubType = dataValueArray[2],
		sAssignmentId = dataValueArray[1];
	AssigmentSlides.mediaPath = model.mediaPath;
	AssigmentSlides.videoPath = model.videoPath;
	AssigmentSlides.questionId = '';
	$GLOBALS.unset('AssignmentSlidesInfo');
	$GLOBALS.set('AssignmentSlidesInfo', model);
	
	// Daily type assignment
	if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT) {				
		AssigmentSlides.questionId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_QUESTION_ID_KEY];
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = true;
	}
	// Non Score-able type  assignment
	else if(sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT ) {				
		AssigmentSlides.questionId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_QUESTION_ID_KEY];
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	// Daily type assignment Updated
	else if(sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT_UPDATED){		
		AssigmentSlides.questionId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_QUESTION_ID_KEY];
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT_UPDATED;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = true;
	}
	// IWT type Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {
	
		
		/*== start code to modify the model if CR is off , product code is ilit20 ==*/
		var oModel = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY],
			iCount = _.size(oModel);
		if (
			((AssignmentsView.productCode || '').startsWith("ilit20")) && 
			objSettingsData.Content.ShowCriticalResponse == '0' && 
			(oModel[iCount].type == ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE) 			
		) {
			delete model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY][iCount];
		}
		
		
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		/*== End code to modify the model if CR is off ==*/
		
		AssigmentSlides.introVideo = model.content.intro_animation;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_IWTS;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_PARALLELEX_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	// Paragraph type assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH) {
		if (typeof model.content.type == "undefined") {
			model.content.type = model.content.assignmentType
		}
		var tempArr = [];		
		tempArr[0] = model.content;
		AssigmentSlides.model = tempArr;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = true;
	}
	// Essay type assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY) {
		if (typeof model.content.type == "undefined") {
			model.content.type = model.content.assignmentType
		}
		var tempArr = [];		
		tempArr[0] = model.content;
		AssigmentSlides.model = tempArr;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = true;
	}
	// Study Plan type assignment
	else if (sAssignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS) {
		var tempArr = [];
		if (typeof model.content.type == "undefined") {
			model.content.type = model.content.assignmentType
		}
		tempArr[0] = model.content;
		AssigmentSlides.model = tempArr;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		
		if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
			AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE;
		}
		else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE) {
			AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE;
		}
		else {
			AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE;
		}
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	// Word Slam type assignment   
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_WORD_SLAM) {
		model.content.type = ASSIGNMENTS.c_s_ASSIGNMENT_WORD_SLAM;
		AssigmentSlides.model = [model.content];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSIGNMENT_DAYS;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Assessment   
	else if (sAssignmentType == ASSIGNMENTS.c_s_ASSESSMENT) {
		var tempArr = [];
		model.content.type = sAssignmentType;
		tempArr[0] = model.content;
		AssigmentSlides.model = tempArr;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_ASSESSMENT;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Text Based Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE) {
		AssigmentSlides.questionId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_QUESTION_ID_KEY];
		AssigmentSlides.oralFluencyPromptId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_PROMPT_ID_KEY];
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		
		/* ILIT-1007 */
		
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		/* ILIT-1007 */
		
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	// Extended Phonic Text Based Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC) {
		AssigmentSlides.questionId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_QUESTION_ID_KEY];
		AssigmentSlides.oralFluencyPromptId = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_PROMPT_ID_KEY];
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.extendedPhonicBookId = model.content[ASSIGNMENTS.c_s_EXTENDED_PHONIC_BOOK_KEY];
		AssigmentSlides.extendedPhonicBookName = model.content[ASSIGNMENTS.c_s_EXTENDED_PHONIC_BOOK_NAME];
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Plural Nouns Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Digraphs Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Word Families Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Syllables Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Word Sort Assignment
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{ 
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Phonic Word Based Rotating Lists Assignment	
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS) {
		AssigmentSlides.model = model.content[ASSIGNMENTS.c_s_ASSIGNMENT_SLIDES_KEY];
		AssigmentSlides.introVideo = null;
		if(typeof model.content.intro_animation_exclusive_ilit20 != "undefined"){
			if(model.content.intro_animation_exclusive_ilit20 == false){
				AssigmentSlides.introVideo = model.content.intro_animation;
			}else{
				if((AssignmentsView.productCode || '').startsWith("ilit20")){
					AssigmentSlides.introVideo = model.content.intro_animation;
				}
			}
		}
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS;
		AssigmentSlides.slidingEngineType = (AssigmentSlides.introVideo) ? ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING : null;
		AssigmentSlides.showBookIcon = false;
	}
	// Foundational Reading Skills
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		AssigmentSlides.model = [(
			(model.content[ASSIGNMENTS.c_s_ASSIGNMENT_PARTS_KEY] || model.content[ASSIGNMENTS.c_s_ASSIGNMENT_PARTS_KEY_S]) || {}
		)];
		AssigmentSlides.model.first().type = ASSIGNMENTS.c_s_TYPE_TPL_FRS;
		AssigmentSlides.introVideo = null;
		AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
		AssigmentSlides.assignmentType = ASSIGNMENTS.c_s_TYPE_TPL_FRS;
		AssigmentSlides.slidingEngineType = ASSIGNMENTS.c_s_ASSIGNMENT_IDANGEROUS_SLLIDING;
		AssigmentSlides.showBookIcon = false;
	}
	else {
		AssigmentSlides.showBookIcon = false;
	}
	if (oPlatform.isIOS()) {
		AssignmentsView.prev.css({
			'background-origin':	'content-box',
			'left': 				0,
			'padding':				'5px 50px 47px 5px',
			'position':				'absolute',
			'top':					0,
			'z-index':				5000
		});
		AssignmentsView.prev.parent().css({
			'padding-bottom':	'10px'
		});
		
		// for view note icon in DA
		$(".notesIcon").css({
			'background-origin':	'content-box',
			'left': 				'60px',
			'padding':				'5px 50px 47px 5px',
			'position':				'absolute',
			'top':					'8px',
			'z-index':				5000
		});
	}
	AssigmentSlides.getAttemptData(sAssignmentId, sComment);
};

/**
 * Retrieve StudentAttemptData From JSON returned by Service
 * @method getStudentAttemptForGradableItem
 * @param {String} sAssignmentId 
 * @return {Object} oStudentAttemptData
 */
AssigmentSlides.getStudentAttemptForGradableItem = function (sAssignmentId) {
	var oSelf = this,
		sAttemptDataKey = 'StudentAttemptData',
		mixStudentAttemptData = '';
		oStudentAttemptData = null;
		
	if (typeof sAssignmentId == 'undefined' || [null, false, ''].indexOf(sAssignmentId) > -1) {
		sAssignmentId = AssignmentsView.slideDataValue.split('___').fetch(1);
	}
	
	if (
		'getAttemptDataForGradeableItem' in oSelf && 
		oSelf.getAttemptDataForGradeableItem != null && 
			'Content' in oSelf.getAttemptDataForGradeableItem && 
			oSelf.getAttemptDataForGradeableItem['Content'] instanceof Array &&
			oSelf.getAttemptDataForGradeableItem.Content.length > 0 &&
				(
					(
						'StudentAttemptData' in oSelf.getAttemptDataForGradeableItem.Content[0] && 
						oSelf.getAttemptDataForGradeableItem.Content[0].StudentAttemptData != null && 
						oSelf.getAttemptDataForGradeableItem.Content[0].StudentAttemptData.length > 0 &&
						oSelf.getAttemptDataForGradeableItem.Content[0].StudentAttemptData != 'null'
					) ||
					(
						'studentAttemptData' in oSelf.getAttemptDataForGradeableItem.Content[0] && 
						oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData != null && 
						oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData.length > 0 &&
						oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData != 'null'
					)
				)
	) {
		if (
			'studentAttemptData' in oSelf.getAttemptDataForGradeableItem.Content[0] && 
			oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData != null && 
			oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData.length > 0 &&
			oSelf.getAttemptDataForGradeableItem.Content[0].studentAttemptData != 'null'
		) {
			sAttemptDataKey = 'studentAttemptData';
		}
		
		mixStudentAttemptData = SpecialCharToCode(oSelf.getAttemptDataForGradeableItem.Content[0][sAttemptDataKey]);
		if (typeof mixStudentAttemptData === 'string' && mixStudentAttemptData.match(/itemSlides/g) !== null) {
			oStudentAttemptData = mixStudentAttemptData.trim('"').toJSObject();
		}
		
		if (isObjectEmpty(oStudentAttemptData)) {
			oStudentAttemptData = null;
		}
		else if (typeof oStudentAttemptData['itemId'] == 'undefined') {
			oStudentAttemptData = null;
		}
		else if (oStudentAttemptData['itemId'] != sAssignmentId) {
			oStudentAttemptData = null;
		}
	}
	
	return oStudentAttemptData;
};

/**
 * Store StudentAttemptData in getAttemptDataForGradeableItem Object
 * @method getAttemptData
 * @param {String} itemId
 * @param {String} sComment
 * @return {undefined}
 */
AssigmentSlides.getAttemptData = function (itemId, sComment) {
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY) {
		AssigmentSlides.getAttemptDataForGradeableItem = {
			'Status':'200',
			'Error':null,
			'Content': [
				{'StudentAttemptData':''}
			]
		};
		AssignmentsView.init();
		AssigmentSlides.render(sComment);
		return;
	}
	window.studentAttemptData = null;
	$.monitor({
		'if':		function () {
			return (studentAttemptData != null);
		},
		'beforeStart':	function () {
			window.studentAttemptData = null;
			if (sStudentId = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID)) {
				GetAttemptDataForGradeableItem(itemId, sStudentId, AssigmentSlides.itemAttemptId);
			}
			else {
				sStudentId = '';
				GetAttemptDataForGradeableItem(itemId, sStudentId, AssigmentSlides.itemAttemptId);
			}
		},
		'interval':	2000,
		'then':		function () {
			try {
				switch (studentAttemptData.Status) {
				 	case '200':
				 		AssigmentSlides.getAttemptDataForGradeableItem = studentAttemptData;
						if (
							studentAttemptData.Content.length == 0 ||
								typeof studentAttemptData.Content[0].StudentAttemptData == 'undefined' ||
								studentAttemptData.Content[0].StudentAttemptData == null ||
								studentAttemptData.Content[0].StudentAttemptData == 'null' ||
									studentAttemptData.Content[0].StudentAttemptData.length == 0
						) {
							AssigmentSlides.getAttemptDataForGradeableItem = {
								Content:[{
									StudentAttemptData: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
								}]
							};
							AssigmentSlides.studentAttemptSummary = {};
						}
						else {
							AssigmentSlides.studentAttemptSummary = $.trim(
								decodeURIComponent(
									AssigmentSlides.getAttemptDataForGradeableItem.Content[0].StudentAttemptSummary
								)
							).replace(/^\"+|\"+$/g, '').replace(/^\{+|\}+$/g, '');
							if (AssigmentSlides.studentAttemptSummary.length == 0) {
								AssigmentSlides.studentAttemptSummary = {};
							}
							else {
								try {
									AssigmentSlides.studentAttemptSummary = JSON.parse(AssigmentSlides.studentAttemptSummary);
								}
								catch (oException) {
									if (typeof AssigmentSlides.studentAttemptSummary != 'string') {
										AssigmentSlides.studentAttemptSummary = {};
									}
								}
							}
						}
						AssignmentsView.init();
						/*==== IPP-3067 ====*/
						if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
							if (AssignmentsView.slideDataValue.split('___').first() == ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS) {
								var sSPSubType = fGetSPSubType(AssigmentSlides.getStudentAttemptForGradableItem());
								
								AssigmentSlides.assignmentType = sSPSubType;
								AssignmentsView.slideDataValue = ASSIGNMENTS.c_s_ASSIGNMENT_STUDY_PLANS + '___' + itemId + '___' + sSPSubType;
								AssigmentSlides.referenceKey = AssignmentsView.slideDataValue;
							}
						}
						/*== End IPP-3067 ==*/
						AssigmentSlides.render(sComment);
						break;
				 	case '500':
				 		if ('Error' in studentAttemptData) {
				 			if (studentAttemptData.Error.ErrorCode == 'U1019') {
				 				AssigmentSlides.getAttemptDataForGradeableItem = {
				 					Content:[{
				 						StudentAttemptData: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
				 					}]
				 				};
								AssignmentsView.init();
								AssigmentSlides.render(sComment);
								break;
				 			}
				 		}
				 		
				 	default:
				 		throw(studentAttemptData.Error);
				}
			}
			catch (oException) { // Exception at Response of GetAttemptDataForGradeableItem
				AssigmentSlides._alert({
					divId:		'dialog-message',
					title:		'Alert!',
					message:	(oException.ErrorUserDescription || oException)
				}, function () {
					AssigmentSlides.getAttemptData(itemId, sComment);
				});
			}
		}
	});
}

/**
 * Send StudentAttemptData to Native
 * @method setAttemptData
 * @param {Number} isReturnToTOC | (0, 1)
 * @param {Function} pfCallback 
 * @return {Boolean}
 */
AssigmentSlides.setAttemptData = function (isReturnToTOC, pfCallback) {
	if (typeof isReturnToTOC == 'undefined') { isReturnToTOC = 0; }
	if (typeof pfCallback !== 'function') { pfCallback = $.noop; }
	
	var itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]),
		studentAttemptData = AssigmentSlides.studentAttemptData,
		studentAttemptSummary = AssigmentSlides.studentAttemptSummary,
		systemScore = (parseFloat(AssigmentSlides.systemScore) || 0),
		finalScore = AssigmentSlides.finalScore,
		itemComplete = AssigmentSlides.itemComplete,
		isStudentScored =  AssigmentSlides.IsStudentScored || '0',
		maxScore = AssigmentSlides.MaxScore || '',
		oralFluencyData = AssigmentSlides.OralFluencyData || '',
		pComment = "", 
		pStudentiD = "";
	itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	studentAttemptData = AssigmentSlides.studentAttemptData;
	studentAttemptSummary = AssigmentSlides.studentAttemptSummary;
	systemScore = (parseFloat(AssigmentSlides.systemScore) || 0);
	finalScore = AssigmentSlides.finalScore;
	itemComplete = AssigmentSlides.itemComplete;
	itemAttemptId = AssigmentSlides.itemAttemptId;
	
	
	studentAttemptSummary = encodeURIComponent(JSON.stringify(studentAttemptSummary).replace(/(\\r|\\n|\s*)/g, ''));
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		/*==== IPP-365 ====*/
		var oKnownErrors = AssigmentSlides.getKnownErrors4SaveAttempt();
		/*== End IPP-365 ==*/
		$.nativeCall({
			'method':			'SetAttemptData',
			'globalResource':	'objStudentAttemptDataResponse',
			'inputParams':		[itemID, studentAttemptData, studentAttemptSummary, systemScore, finalScore, itemComplete, itemAttemptId, pComment, pStudentiD, isStudentScored, maxScore, oralFluencyData],
			'emptyValue':		0,
			'interval':			500,
			'data':				{
				'isReturnToTOC':	isReturnToTOC
			},
			'beforeSend':		function () {
				oUtility.showLoader({
					'message': '<img src="media/loader.gif" alt="" />',
					'background-color': 'none',
					'click-to-hide': false,
					'opacity': 0.5
				});
			},
			'onComplete':		function (poSaveAttemptDataResponse, poData) {
				if ((AssignmentsView.productCode || '').startsWith("ilit20")) {
					if (
						AssigmentSlides.itemComplete == ASSIGNMENTS.c_s_COMPLETED_STATUS &&
						!isNaN(parseFloat(AssigmentSlides.finalScore))
					) {
						/* $.nativeCall({
							'method':			'CheckAndAssignGradeableItems',
							'globalResource':	'objCheckAndAssignGradeableItemsResponse',
							'breakAfter':		5000,
							'interval':			500,
							'checkSuccess':		function (poServiceResponse) {
								return ((parseInt(poServiceResponse.Status) || 0) === 200);
							},
							'onComplete':		function (poServiceResponse) {
								alert('CheckAndAssignGradeableItems => Success'); */
								oUtility.hideLoader();
								pfCallback(poSaveAttemptDataResponse, poData);
								if (poData.isReturnToTOC == 1) {
									AssignmentsView.loadAssignmentList();
								}
							/* },
							'onError':			function (poServiceResponse, poException) {
								alert('CheckAndAssignGradeableItems => \n' + (JSON.stringify(poServiceResponse) + '<br />' + poException.toString()));
								oSelf._alert(
									{
										divId:		'dialog-message',
										title:		'Alert!',
										message:	(JSON.stringify(poServiceResponse) + '<br />' + poException.toString())
									}, function() {
										oUtility.hideLoader();
										pfCallback(poSaveAttemptDataResponse, poData);
										if (poData.isReturnToTOC == 1) {
											AssignmentsView.loadAssignmentList();
										}
									}
								);
							}
						}); */
						return;
					}
				}
				oUtility.hideLoader();
				pfCallback(poSaveAttemptDataResponse, poData);
				if (poData.isReturnToTOC == 1) {
					AssignmentsView.loadAssignmentList();
				}
			},
			'onError':			function (poSaveAttemptDataResponse, poException, poData) {
				oUtility.hideLoader();
				
				AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
				AssigmentSlides.studentAttemptSummary = {};
				
				var oResponseError = ((poSaveAttemptDataResponse || {}).Error || {}),
					poException = (poException || {}),
					sErrorCode = (oResponseError.ErrorCode || ''),
					sErrorDescription = (
						((oKnownErrors[sErrorCode] || {}).ErrorUserDescription) ||
						(
							(oResponseError.ErrorUserDescription) ||
							(
								$.isEmptyObject(poException) !== true?
								(
									(typeof poException.toString === 'function')?
									poException.toString():
									ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
								):
								ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
							)
						)
					);
				
				AssigmentSlides._alert(
					{
						divId:		'dialog-message',
						title:		'Alert!',
						message:	sErrorDescription
					},
					function () {
						if (typeof oKnownErrors[sErrorCode] === 'object') {
							if (typeof oKnownErrors[sErrorCode]['Action'] === 'function') {
								oKnownErrors[sErrorCode].Action(poSaveAttemptDataResponse);
							}
						}
					}
				);
			}
		});
	}
	
	if (isReturnToTOC) {
		// AssigmentSlides.setAttemptData (isReturnToTOC);
	}
	else {
		return true;
	}
}

/**
 * Render Assignment Slides View 
 * @method render
 * @param {String} sComment
 * @return {undefined}
 */
AssigmentSlides.render = function (sComment) { 
	var	sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		aAssignments2ReAssign = [
		ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET,
		ASSIGNMENTS.c_s_ASSIGNMENT_IWTS,
		ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH,
		ASSIGNMENTS.c_s_TYPE_TPL_ESSAY
	];
	AssignmentsView.prev.show();
	(
		AssigmentSlides.showBookIcon === true && 
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY &&
		(
			typeof objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_NATIVE_VERSION] !== 'undefined' &&
			objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_NATIVE_VERSION] != ''
		)
	)? AssignmentsView.bookicon.show(): AssignmentsView.bookicon.hide();
	$('#' + ASSIGNMENTS.c_s_SHOW_COMMENT).remove();
	AssignmentsView.header.text(AssignmentsView.slideHeaderTitle);
	$("#" + ASSIGNMENTS.c_s_SLIDE_CONTAINER).empty();
	
	if (AssigmentSlides.introVideo && 
		(
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM) ||
			(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE) //ILIT-1007
		)) {
		$("#" + ASSIGNMENTS.c_s_SLIDE_CONTAINER).html('<div class="slider_pager_content_outer">\
						<button id="prevPagingBtn" class="slider_pager_left sprite" type="button"></button>\
						<button id="nextPagingBtn" class="slider_pager_right sprite" type="button"></button>\
						<div class="slider_pager_content" style="width:auto;">\
							<div class="swiper-container" style="height:100%; overflow:hidden;">\
								<div id="slide_inner_container" class="swiper-wrapper slider_pager_sl\
								</div>\
							</div>\
							<div class="pagination"></div>\
						</div>\
						<div class="clear"></div>\
					</div>');
	}else{
		 $("#" + ASSIGNMENTS.c_s_SLIDE_CONTAINER).html('<div class="swiper-container" style="height:100%; overflow:hidden;">\
		<div id="slide_inner_container" class="swiper-wrapper"></div>\
	</div>\
	<div class="main_pagination pagination"></div>');
	}
   
	
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {
		AssigmentSlides.audioFiles = new Array;
		if (AssigmentSlides.introVideo != "") {
			if 	(AssigmentSlides.getStudentAttemptForGradableItem() === null) {
				IWTIntroVideo.init(AssigmentSlides.introVideo);
			}
			else {
				AssigmentSlides.introVideo = null;
			}
		}
		else {
			AssigmentSlides.introVideo = null;
		}
		if (
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY
		) {
			SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_OPENED_VERBID, sItemId);
		}
	}
	AssignmentsView.prev.removeClass(ASSIGNMENTS.c_s_DONE_CLASS);
	$(".header_inner .txtHelpFeature").hide(); // hide text help icons from header
	
	$.each (AssigmentSlides.model, function(idx, val) {
		switch (val.type) {
			case ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET:
				if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT) {
					NonScoreAbleView.init(idx, val);
				}
				else {
					NewTypeInView.init(idx, val);
				}
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
				AssigmentSlides.audioFiles[idx-1] = val.interactive_text_audio;
				IwtsSummaryView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH:
				ParagraphView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_ESSAY:
				EssayView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_ASSIGNMENT_STUDYPLAN:
				
				StudyPlanMasterView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
				AssigmentSlides.audioFiles[idx-1] = val.static_text_audio;
				IWTTextAnswerSlide.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
				AssigmentSlides.audioFiles[idx-1] = val.interactive_text_audio;
				IWTHighlightSlide.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
				AssigmentSlides.audioFiles[idx-1] = val.interactive_text_audio;
				IWTDndSlide.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_ASSESSMENT:
				Assessment.init(val.parts);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE:
			case ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC:
				PhonicTextBasedView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS:				
				PluralNounsView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS:
				DigraphView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES:
				WordFamiliesView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES:
				SyllablesView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT:
				WordSortView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM:
				WordSlamView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS:
				RotatingView.init(idx, val);
				break;
			case ASSIGNMENTS.c_s_TYPE_TPL_FRS:
				$GLOBALS.set('FoundationalRS', new FoundationalRS()).init(idx, val);
				break;
			default:
				break;
		}
	}); 

	/*==== IPP-5155 ====*/
	AssignmentsView.prev[
		(
			(AssigmentSlides.oAssignmentKeyData['assignmentSubType'] === ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE)?
			'add':
			'remove'
		) + 'Class'
	](ASSIGNMENTS.c_s_SAVE_AND_EXIT_CLASS + (isIOS()? ' ios': ''));
	AssignmentsView.prev
		.html(' <span class="sprite"></span> ')
			.filter('.ios')
				.append(
					(
						AssignmentsView.prev.hasClass(ASSIGNMENTS.c_s_DONE_CLASS)?
						'Exit'.pad('&nbsp;', 5, -1):
						'Save &amp; Exit'.pad('&nbsp;', 5, -1)
					)
				);
	/*== End IPP-5155 ==*/
	
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
	
	if (aMatches = navigator.userAgent.match(/iPad;.*CPU.*OS ([0-9]+)_\d/i)) {
		$('html').addClass('ipad ios' + aMatches[1]);
	}
	
    AssignmentsView.resize();
	if (
		sComment !== undefined &&
		sComment !== null &&
		typeof sComment == 'string' &&
			sComment.length !== 0
	) {
		AssigmentSlides.initComment(sComment);
	}
	AssigmentSlides.bindEvents(sComment);
};

/**
 * To choose which sliding method we need to use i.e. Idangerous/Parallelex
 * @method slidingMethod
 * @return {undefined}
 */
AssigmentSlides.slidingMethod = function() {
	if (
		typeof AssigmentSlides.slidingEngineType == 'undefined' ||
		AssigmentSlides.slidingEngineType == null
	) {
		return;
	}
	if (AssigmentSlides.slidingEngineType == ASSIGNMENTS.c_s_ASSIGNMENT_PARALLELEX_SLLIDING) {
		AssigmentSlides.slidingParallelexEngine();
	}
	else {
		try { AssigmentSlides.slidingEngine.destroy(); AssigmentSlides.slidingEngine = null; } catch (e) {};
		AssigmentSlides.slidingIdangerousEngine();
	}
}

/**
 * Initialize Idangerous Slide Engine
 * @method slidingIdangerousEngine
 * @return {undefined}
 */
AssigmentSlides.slidingIdangerousEngine = function () {
	AssigmentSlides.slidingEngine = $('.swiper-container').swiper({
		height:				'100%',
		scrollbar:			{
			container: '.swiper-scrollbar',
			draggable: true,
			hide: true
		},
		pagination: (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) ? '.frs-main-pagination' : '',
		paginationClickable: (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) ? true : false,
		onFirstInit:		function (swiper) {
			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE) {
				StudyPlanPracticeView.sLastSkillId = '';
				$.monitor({
					'if':	function () {
						return (
							typeof AssigmentSlides.slidingEngine != 'undefined' &&
							AssigmentSlides.slidingEngine != null &&
							typeof AssigmentSlides.slidingEngine.slides != 'undefined'
						);
					},
					'then':	function () {
						StudyPlanPracticeView.sLastSkillId4Slider = $(AssigmentSlides.slidingEngine.slides[0]).data("skill-id");
						$('.tabs_number').eq(0).addClass('active').siblings().removeClass('active');
					}
				});
			}
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
				$.monitor({
					'if':	function () {
						return (AssigmentSlides.slidingEngine != null && typeof AssigmentSlides.slidingEngine.params != 'undefined');
					},
					'then':	function () {
						AssigmentSlides.slidingEngine.params.noSwiping = true;
						AssigmentSlides.slidingEngine.params.noSwipingClass = 'swiper-no-swiping';
						
						var oCurSlide = AssigmentSlides.slidingEngine.slides[0],
							sPageTitle = $(oCurSlide).attr("page-title");
							
						$('#prevPagingBtn').hide();
						$('#nextPagingBtn').show();
						
						$("#frs_page_title").html(sPageTitle);
						$('.video-js').each(function(){
							var video_id = $(this).attr('id');  
							videojs(video_id).ready(function(){
								myplayer=this;
								myplayer.pause(); 
							});
						});
					}
				});
			}
			else if (AssigmentSlides.introVideo && 
					(
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE) //ILIT-1007
					))  {
				$.monitor({
					'if':	function () {
						return (AssigmentSlides.slidingEngine != null && typeof AssigmentSlides.slidingEngine.params != 'undefined');
						//ILIT-34 resolution - type checking on params
					},
					'then':	function () {
						AssigmentSlides.slidingEngine.params.noSwiping = true;
						AssigmentSlides.slidingEngine.params.noSwipingClass = 'swiper-no-swiping';
						$('#prevPagingBtn').hide();
						$('#nextPagingBtn').show();
						
						$('.video-js').each(function(){
							var video_id = $(this).attr('id');  
							videojs(video_id).ready(function(){
								myplayer=this;
								myplayer.pause(); 
							});
						});
					}
				});
			}
		},
		onInit:				function (swiper) {
			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSESSMENT) {
				$(".part_tabs:first").addClass('active');
				$('#prevPagingBtn').hide();
				
				$('.part_tabs').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, function() {
				
					var slideIndex = parseInt($(this).attr('id').replace('btn_slide_index_', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK));
					AssigmentSlides.slidingEngine.swipeTo(slideIndex);
				});
			}
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE) {
				$('#prevPagingBtn').hide();
				var page_title = $(swiper.slides[0]).attr("page-title");
				var skill_id = $(swiper.slides[0]).attr("data-skill-id");				
				$("#practice_assessment_page_title").html(page_title);
				if (!$("#" + skill_id + ' .no_text').hasClass(ASSIGNMENTS.c_s_DONE_CLASS)) {
					$("#" + skill_id).addClass("active");
				}
				StudyPlanPracticeView.sLastSkillId = '';
			}
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
				// $('#prevPagingBtn').hide();				
				var oCurSlide = swiper.slides[0],
					sSlideId = oCurSlide.id,
					oCurrentSlide = ($GLOBALS.get('FoundationalRS').getSlideByDomID(sSlideId) || {}),
					sPageTitle = $(oCurSlide).attr("data-page-title"),
					sMainSlideId = null,
					iMainSlideIndex = null;
				
				$("#frs_page_title").html(sPageTitle);
				
				if (typeof oCurrentSlide.setVisited == 'function') {
					oCurrentSlide.setVisited();
				}
				
				/*== highlight pagination dots of rejected OF ==*/
				$('.main_swiper_slide').each(function () {					
					if ($(this).find(".swiper-nested1 .phonic_oralfluency_conts").attr("data-rejected") == 'true') {
						sMainSlideId = $(this).attr('id');						
						iMainSlideIndex = $('#slide_inner_container > .swiper-slide').index($('#'+sMainSlideId));						
						$('.frs-main-pagination .swiper-pagination-switch:eq('+iMainSlideIndex+')').css({'background':'yellow', 'border':'1px solid yellow'});						
					}
				});
			} 
		},
		onSlideChangeEnd:	function (swiper) {
			
			//ILIT-915
			GradeIntroAnimationView.stopIntroVideo();
			
			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSESSMENT) {
				var iActiveSlideIndex = swiper.activeIndex,
					iPrevSlideIndex = swiper.previousIndex;
				
				/*== fix for IPP-6450 ==*/
					$(".playPauseButton ").each(function(){
						//if($(this).hasClass("playing")){
							var audioPlayer = $(this).siblings("audio");
							audioPlayer.trigger("pause");
							audioPlayer[0].currentTime = 0;
							$(this).removeClass("playing");
						//}
					})
				/*== end fix for IPP-6450 ==*/
				
				/*== fix for IPP-6464 ==*/
				GradeIntroAnimationView.stopIntroVideo();
				/*== end fix for IPP-6464 ==*/
				
				/*==== IPP-5207 ====*/
				if (AssigmentSlides.oAssignmentKeyData['assignmentSubType'] === ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE) {
					if (Assessment.isTabDirty(iPrevSlideIndex) === true) {
						Assessment.saveGRADEData(function () {
							$('.part_tabs').removeClass("active");
							$('#btn_slide_index_' + iActiveSlideIndex).addClass('active');

							if (iActiveSlideIndex == 0) {
								$('#prevPagingBtn').hide();
								$('#nextPagingBtn').show();
							}
							else if (iActiveSlideIndex == ($('.part_tabs').length - 1)) {
								$('#nextPagingBtn').hide();
								$('#prevPagingBtn').show();
							}
							else {
								$('#prevPagingBtn').show();
								$('#nextPagingBtn').show();
							}
							
							/*==== Adjustment for Tab-head ====*/
							var oCurrentTabHead = jQuery('.assessment-header-slider .part_btn').eq(iActiveSlideIndex),
								dSlideWidth = oCurrentTabHead.width(),
								aCSSProps = [
									'padding-left', 'padding-right',
									'margin-right', 'margin-left',
									'border-right-width', 'border-left-width'
								];
							
							for (var iProp = 0; iProp < aCSSProps.length; iProp++) {
								if (iPropVal = oCurrentTabHead.css(aCSSProps[iProp]).replace('px', '')) {
									dSlideWidth = dSlideWidth + parseInt(iPropVal);
								}
							}
							if (iActiveSlideIndex > Assessment.iLastVisibleTabHead) {
								$('.assessment-header-slider').animate({
									'margin-left':	'-=' + dSlideWidth + 'px'
								});
								Assessment.iLastVisibleTabHead++;
								Assessment.iFirstVisibleTabHead++;
							}
							else if (iActiveSlideIndex < Assessment.iFirstVisibleTabHead) {
								$('.assessment-header-slider').animate({
									'margin-left':	'+=' + dSlideWidth + 'px'
								});
								Assessment.iLastVisibleTabHead--;
								Assessment.iFirstVisibleTabHead--;
							}
							
							/*== End Adjustment for Tab-head ==*/
						});
						return;
					}
				}
				/*== End IPP-5207 ==*/
				
				$('.part_tabs').removeClass("active");
				$('#btn_slide_index_' + iActiveSlideIndex).addClass('active');

				if (iActiveSlideIndex == 0) {
					$('#prevPagingBtn').hide();
					$('#nextPagingBtn').show();
				}
				else if (iActiveSlideIndex == ($('.part_tabs').length - 1)) {
					$('#nextPagingBtn').hide();
					$('#prevPagingBtn').show();
				}
				else {
					$('#prevPagingBtn').show();
					$('#nextPagingBtn').show();
				}
				
				/*==== Adjustment for Tab-head ====*/
				var oCurrentTabHead = jQuery('.assessment-header-slider .part_btn').eq(iActiveSlideIndex),
					dSlideWidth = oCurrentTabHead.width(),
					aCSSProps = [
						'padding-left', 'padding-right',
						'margin-right', 'margin-left',
						'border-right-width', 'border-left-width'
					];
				
				for (var iProp = 0; iProp < aCSSProps.length; iProp++) {
					if (iPropVal = oCurrentTabHead.css(aCSSProps[iProp]).replace('px', '')) {
						dSlideWidth = dSlideWidth + parseInt(iPropVal);
					}
				}
				if (iActiveSlideIndex > Assessment.iLastVisibleTabHead) {
					$('.assessment-header-slider').animate({
						'margin-left':	'-=' + dSlideWidth + 'px'
					});
					Assessment.iLastVisibleTabHead++;
					Assessment.iFirstVisibleTabHead++;
					Assessment.aMargins.push(dSlideWidth);
				}
				else if (iActiveSlideIndex < Assessment.iFirstVisibleTabHead) {
					$('.assessment-header-slider').animate({
						'margin-left':	'+=' + Assessment.aMargins.pop() + 'px'
					});
					Assessment.iLastVisibleTabHead--;
					Assessment.iFirstVisibleTabHead--;
				}
				/*== End Adjustment for Tab-head ==*/
            }
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurrentSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length,
					aTabHeads = $('.tabs_number'),
					sPageTitle = $(oCurrentSlide).attr("page-title");
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				$("#practice_assessment_page_title").html(sPageTitle);
					
				for (iActiveTabHeadIndex = 0; iActiveTabHeadIndex < aTabHeads.length; iActiveTabHeadIndex++) {
					if (iActiveSlideIndex < (iActiveTabHeadIndex + 1) * 6) {
						break;
					}
				}
				
				aTabHeads.removeClass('active');
				aTabHeads.eq(iActiveTabHeadIndex).addClass("active");
				
				$('.video-js').each(function(){
					var video_id = $(this).attr('id');  
					videojs(video_id).ready(function(){
						myplayer=this;
						myplayer.pause(); 
					});
				});
            }
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length,
					aTabHeads = $('.tabs_number'),
					sPageTitle = $(oCurSlide).attr("data-page-title"),
					sMainSlideId = null,
					iMainSlideIndex = null;
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				
				/*== highlight pagination dots of rejected OF ==*/
				$('.main_swiper_slide').each(function () {					
					if ($(this).find(".swiper-nested1 .phonic_oralfluency_conts").attr("data-rejected") == 'true') {
						sMainSlideId = $(this).attr('id');						
						iMainSlideIndex = $('#slide_inner_container > .swiper-slide').index($('#'+sMainSlideId));						
						$('.frs-main-pagination .swiper-pagination-switch:eq('+iMainSlideIndex+')').css({'background':'yellow', 'border':'1px solid yellow'});						
					}
				});
				
				$("#frs_page_title").html(sPageTitle);
				
				$('.video-js').each(function(){
					var video_id = $(this).attr('id');  
					videojs(video_id).ready(function(){
						myplayer=this;
						myplayer.pause(); 
					});
				});
				
				var sSlideId = $(oCurSlide).attr('id'),
					oCurrentSlide = $GLOBALS.get('FoundationalRS').getSlideByDomID(sSlideId),
					bSlideComplete = (
						(
							typeof oCurrentSlide == 'object' &&
							oCurrentSlide != null &&
								typeof oCurrentSlide.getIsComplete == 'function'
						)?
						oCurrentSlide.getIsComplete():
						false
					);
					
				if (oCurrentSlide == null) {
					bSlideComplete = true;
				}
				
				oCurSlide.setAttribute('data-allow-swipe-next', bSlideComplete);
				oCurrentSlide.setVisited();
				
				if (
					($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) ||
					(bSlideComplete === true)
				) {
					AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_FRS);
				}
            }
			else if (AssigmentSlides.introVideo && 
					(
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM) || 
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE) //ILIT-1007
					)){
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length;
					//aTabHeads = $('.tabs_number'),
					//sPageTitle = $(oCurSlide).attr("data-page-title"),
					sMainSlideId = null,
					iMainSlideIndex = null;
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				
				
            }
			AssigmentSlides.initAudio(AssigmentSlides.slidingEngine.activeIndex);
			AssignmentsView.resize();
		},
		onTouchEnd:			function (swiper) {
            if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSESSMENT) {
                var activeSlideIndex = swiper.activeIndex;
                $('.part_tabs').removeClass("active");
                $('#btn_slide_index_' + activeSlideIndex).addClass('active');

                if (activeSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if (activeSlideIndex == ($('.part_tabs').length - 1)) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
            }
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurrentSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length,
					aTabHeads = $('.tabs_number'),
					sPageTitle = $(oCurrentSlide).attr("page-title");
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				$("#practice_assessment_page_title").html(sPageTitle);
					
				for (iActiveTabHeadIndex = 0; iActiveTabHeadIndex < aTabHeads.length; iActiveTabHeadIndex++) {
					if (iActiveSlideIndex < (iActiveTabHeadIndex + 1) * 6) {
						break;
					}
				}
				
				aTabHeads.removeClass('active');
				aTabHeads.eq(iActiveTabHeadIndex).addClass("active");
				
				$('.video-js').each(function(){
					var video_id = $(this).attr('id');  
					videojs(video_id).ready(function(){
						myplayer=this;
						myplayer.pause(); 
					});
				});
            }
			else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurrentSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length,
					aTabHeads = $('.tabs_number'),
					sPageTitle = $(oCurrentSlide).attr("page-title");
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				$("#frs_page_title").html(sPageTitle);
					
				$('.video-js').each(function () {
					var video_id = $(this).attr('id');  
					videojs(video_id).ready(function(){
						myplayer=this;
						myplayer.pause(); 
					});
				});
            }
			else if (AssigmentSlides.introVideo && 
					(
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS) ||
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM) || 
						(AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE) // ILIT-1007
					)) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurrentSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iActiveTabHeadIndex = 0,
					iNumSlides = AssigmentSlides.slidingEngine.slides.length;
					//aTabHeads = $('.tabs_number'),
					//sPageTitle = $(oCurrentSlide).attr("page-title");
					
				if (iActiveSlideIndex == 0) {
                    $('#prevPagingBtn').hide();
                    $('#nextPagingBtn').show();
                }
                else if ((iActiveSlideIndex + 1) == AssigmentSlides.slidingEngine.slides.length) {
                    $('#nextPagingBtn').hide();
                    $('#prevPagingBtn').show();
                }
                else {
                    $('#prevPagingBtn').show();
                    $('#nextPagingBtn').show();
                }
				/* $("#frs_page_title").html(sPageTitle);*/
					
				$('.video-js').each(function () {
					var video_id = $(this).attr('id');  
					videojs(video_id).ready(function(){
						myplayer=this;
						myplayer.pause(); 
					});
				}); 
            }
			else {
				// none
			}
			AssigmentSlides.initAudio(AssigmentSlides.slidingEngine.activeIndex);
        }
	});
	$(".swiper-wrapper").height("100%");
	$(".swiper-wrapper").children().height("100%"); 
    
	// Swiper Sliding locked for Single slide
	var slideRecords = $("div.swiper-wrapper:visible div.swiper-slide").length;
	if (slideRecords == 1) {
		AssigmentSlides.slidingEngine.params.noSwiping = true;
		$('.swiper-slide').addClass('swiper-no-swiping');
		if (AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_ASSESSMENT) {
			$('.pagination').hide();
		}
	}
	else if ($("div.swiper-wrapper:visible div.main_swiper_slide").length == 1) {
		AssigmentSlides.slidingEngine.params.noSwiping = true;
		if (AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
			$('.swiper-slide').addClass('swiper-no-swiping');
		}
	}
};

/**
 * Initialize Parallelex Slide Engine
 * @method slidingParallelexEngine
 * @return {undefined}
 */
AssigmentSlides.slidingParallelexEngine = function() {
	var swiperWrapper, bInitializing = false;
	swiperWrapper = $(".swiper-container:first").get(0);
	AssigmentSlides.slidingEngine = new Swipe(swiperWrapper, {
		continuous:					false,
		speed:						1200,
		pagination: 				'.pagination',
		noScrollClass:				'continent_box_inner',
		onInit:						function () {
			/*==== Set Freeze Position ====*/
			var aSlides = AssigmentSlides.slidingEngine.getAllSlides(),
				iSlideIndex = 0,
				iLastVisitedSlideIndex = oPrivate.getLastVisitedSlideIndex(aSlides),
				oStudentAttemptData = null;
				
			/**
			 If previously attempted answer is present load it,
			 save the current state otherwise
			 */
			if ((oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) != null) {
				AssigmentSlides.studentAttemptData = oStudentAttemptData;
			}
			
			for (iSlideIndex = 0; iSlideIndex <= iLastVisitedSlideIndex; iSlideIndex++) {
				var oCurrentSlide = $(aSlides[iSlideIndex]),
					aSlideIdChunks = oCurrentSlide.attr('id').split('___'),
					iSlideId = aSlideIdChunks.last(),
					oStatus = {},
					aSlideInfo = [],
					sSlideType = oCurrentSlide.data('slide-type');
					
				if (oStudentAttemptData !== null) {
					if ((aSlideInfo = _.where(oStudentAttemptData.itemSlides, {'slideID': iSlideId})).length > 0) {
						oStatus = aSlideInfo.first().slideInputData;
					}
				}
				
				if (isObjectEmpty(oStatus)) {
					oStatus = {
						'visited':	true
					}
				}
				
				switch (sSlideType) {
					case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
						IWTDndSlide.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, oStatus);
						break;
						
					case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
						bIsComplete = true;
						if (IWTTextAnswerSlide.controls[iSlideId].submitButton) { // Read Critically Screen
							bIsComplete = (typeof oStatus['isComplete'] != 'boolean'? false: oStatus['isComplete']);
						}
						oStatus['isComplete'] = bIsComplete;
						IWTTextAnswerSlide.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, oStatus);
						break;
						
					case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:					
						IWTHighlightSlide.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, oStatus);
						break;
						
					case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
						IwtsSummaryView.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, oStatus);
						break;
						
					default:
						break;
				}
			}
			var iFreezePoint = oPrivate.getFreezePosition(0, aSlides, Math.max(iLastVisitedSlideIndex + 1, aSlides.length - 1)),
				iSlidePosition = Math.min(iLastVisitedSlideIndex, iFreezePoint);
			
			/*==== IPP-1658 | IPP-1915 ====*/
			if (
				(
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_STUDENT &&
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS
				) ||
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR
			) {
				iSlidePosition = 0;
				iFreezePoint = aSlides.length - 1;
			}
			/*== End IPP-1658 | IPP-1915 ==*/
			
			AssigmentSlides.slidingEngine.setPos(iSlidePosition);
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
				AssigmentSlides.prepare4View($(aSlides[iSlidePosition]));
			}
			AssigmentSlides.slidingEngine.freezeAtSlide(iFreezePoint);
			/*== End Set Freeze Position ==*/
			
			/*==== Retrieve & Save State for Slides ====*/
			$(aSlides[iSlidePosition]).siblings().removeClass('swiper-slide-visible');
			$(aSlides[iSlidePosition]).addClass('swiper-slide-visible');
			AssigmentSlides.retrieve();
			/*== End Retrieve & Save State for Slides ==*/
			
			/*==== Update Attempt Data to Show In Progress for IWT ====*/
			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {
				AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
				AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
				AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
				AssigmentSlides.studentAttemptSummary = {};
				
				AssigmentSlides.setAttemptData();
			}
			/*== End Update Attempt Data to Show In Progress for IWT ==*/
			
			setTimeout(function () {
				bInitializing = false;
			}, 2 * (parseInt(AssigmentSlides.slidingEngine.getSlideSpeed()) + 20));
		},
		onSlideChangeStart:			function (oEvent, iSlideIndex, oSlide, iDirection) {
			if (AssigmentSlides.allowSwipeStart === false) {
				return false;
			}
			
			/* hide keypad */
			if (!oPlatform.isIOS() && $('.swiper-slide-visible textarea').length) {
				$('.swiper-slide-visible textarea').blur();
			}
			
			var sDirection = ((iDirection > 0)? 'right': 'left');
			if (sDirection == 'right') {
				var aSlides = AssigmentSlides.slidingEngine.getAllSlides(),
					iFreezePoint = oPrivate.getFreezePosition(0, aSlides, Math.max(iSlideIndex + 1, aSlides.length - 1));
				AssigmentSlides.slidingEngine.freezeAtSlide(iFreezePoint);
			}
		},
		onSlideChangeEnd:			function (oEvent, iSlideIndex, oSlide, iDirection) {
			var aSlides = AssigmentSlides.slidingEngine.getAllSlides(),
				oCurrentSlide = $(aSlides[iSlideIndex]),
				iSlideId = oCurrentSlide.attr('id').split('___').last(),
				sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
				
			$(".swiper-slide-visible").removeClass("swiper-slide-visible");
			if (!oCurrentSlide.hasClass(".swiper-slide-visible")) {
				oCurrentSlide.addClass("swiper-slide-visible");
			}
			
			if ($('.swiper-slide-visible textarea').length) {
				$('.swiper-slide-visible textarea').prop('disabled',false);
				$('.swiper-slide:not(".swiper-slide-visible") textarea').prop('disabled',true);
			}
			
			/* hide keypad */
			if (oPlatform.isIOS()) {
				$('.swiper-slide:not(".swiper-slide-visible") textarea').blur(); 
			}
			AssigmentSlides.initAudio(iSlideIndex);
			/*==== Retrieve & Save State for Slides ====*/
			AssigmentSlides.retrieve();
			/*== End Retrieve & Save State for Slides ==*/
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
				AssigmentSlides.prepare4View(oCurrentSlide);
			}
			
			if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS && 
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				
				var sDirection = ((iDirection > 0)? 'right': 'left');
				if (sDirection == 'right') {				
					SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SWIPE_FORWARD_VERBID, sItemId);
				}
				else {
					SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SWIPE_BACKWARD_VERBID, sItemId);
				}
			}
			
			// AssignmentsView.resize();
			switch (oCurrentSlide.data('slide-type')) {
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
					var bIsComplete = false;
					if (oCurrentStatus = IwtsSummaryView.slideStatuses[iSlideId].getStatus()) {
						if (oCurrentStatus.isComplete) {
							bIsComplete = true;
						}
					}
					
					if ((oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) !== null) {
						var aSlideInfo = _.where(
							oStudentAttemptData.itemSlides,
							{
								'slideID':		iSlideId,
								'slideType':	ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE
							}
						);
						if (aSlideInfo.length) {
							if (
								aSlideInfo.first().slideInputData &&
									typeof aSlideInfo.first().slideInputData.isComplete == 'boolean' &&
									aSlideInfo.first().slideInputData.isComplete === true
							) {
								bIsComplete = true;
							}
						}
					}
					
					IwtsSummaryView.slideStatuses[iSlideId].updateByData({'visited': true, 'isComplete': bIsComplete});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
					var oCurrentStatus = IWTTextAnswerSlide.slideStatuses[iSlideId].getStatus(),
						bIsComplete = true;
						 
					if (IWTTextAnswerSlide.controls[iSlideId].submitButton) { // Read Critically Screen
						bIsComplete = (typeof oCurrentStatus.isComplete != 'boolean'? false: oCurrentStatus.isComplete);
					}
					
					IWTTextAnswerSlide.slideStatuses[iSlideId].updateByData({'visited': true, 'isComplete': bIsComplete});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
					IWTHighlightSlide.slideStatuses[iSlideId].updateByData(oCurrentSlide, {'visited': true});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
					/*==== To solve height issue of right area ====*/
					var oLeftContainer = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_box_inner'),
						oLeftActionArea = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_box_inner .draggable_area'),
						dHeight = (
							parseFloat(oLeftContainer.height()) -
							parseFloat(oLeftContainer.css('padding-top').replace('px', '')) -
							parseFloat(oLeftContainer.css('padding-bottom').replace('px', '')) -
							parseFloat(oLeftContainer.css('margin-top').replace('px', '')) -
							parseFloat(oLeftContainer.css('margin-bottom').replace('px', ''))
						);
						
					oLeftActionArea.css('height', dHeight + 'px');
					/*== End To solve height issue of right area ==*/
					
					IWTDndSlide.slideStatuses[iSlideId].updateByData({'visited': true});
					break;
			}
		
				
			if (
				iSlideIndex > 0 &&
				$(aSlides[iSlideIndex - 1]).data('slide-type') == ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE
			) {
				AssigmentSlides.allowSwipeStart = true;
			}
			
			if (bInitializing === false) {
				var iFreezePoint = oPrivate.getFreezePosition(iSlideIndex, aSlides, Math.max(iSlideIndex + 1, aSlides.length - 1));
				AssigmentSlides.slidingEngine.freezeAtSlide(iFreezePoint);
			}
		},
		onPaginationButtonClick:	function(iPaginationButtonIndex, iSlideIndex, aSlides) {
			var bCanMoveToThePage = false,
				iFreezePosition = iSlideIndex,
				oCurrentSlide = $(aSlides[iSlideIndex]);
				iSlideId = oCurrentSlide.attr('id').split('___').last();
			
			iPaginationButtonIndex = parseInt(iPaginationButtonIndex);
			iSlideIndex = parseInt(iSlideIndex);
			if (iPaginationButtonIndex > iSlideIndex) {
				iFreezePosition = oPrivate.getFreezePosition(iSlideIndex, aSlides, iPaginationButtonIndex);
				var oFrozenSlide = iFreezePosition? jQuery(aSlides[iFreezePosition]): jQuery(aSlides[iPaginationButtonIndex]),
					iFrozenSlideId = oFrozenSlide.attr('id').split('___').last(),
					sFrozenSlideType = oFrozenSlide.data('slide-type');
				
				if (
					bCanMoveToThePage = (
						(iFreezePosition == null) ||
						(iPaginationButtonIndex <= iFreezePosition)
					)
				) {
					AssigmentSlides.slidingEngine.freezeAtSlide(iFreezePosition);
				}
			}
			else {
				bCanMoveToThePage = true;
			}
			
			/*==== Retrieve & Save State for Slides ====*/
			AssigmentSlides.retrieve();
			/*== End Retrieve & Save State for Slides ==*/
			
			switch (oCurrentSlide.data('slide-type')) {
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
					IwtsSummaryView.slideStatuses[iSlideId].updateByData({'visited': true});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
					IWTTextAnswerSlide.slideStatuses[iSlideId].updateByData({'visited': true});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
					IWTHighlightSlide.slideStatuses[iSlideId].updateByData(oCurrentSlide, {'visited': true});
					break;
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
					/*==== To solve height issue of right area ====*/
					var oLeftContainer = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_box_inner'),
						oLeftActionArea = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_box_inner .draggable_area'),
						dHeight = (
							parseFloat(oLeftContainer.height()) -
							parseFloat(oLeftContainer.css('padding-top').replace('px', '')) -
							parseFloat(oLeftContainer.css('padding-bottom').replace('px', '')) -
							parseFloat(oLeftContainer.css('margin-top').replace('px', '')) -
							parseFloat(oLeftContainer.css('margin-bottom').replace('px', ''))
						);
						
					oLeftActionArea.css('height', dHeight + 'px');
					/*== End To solve height issue of right area ==*/
					
					IWTDndSlide.slideStatuses[iSlideId].updateByData({'visited': true});
					break;
			}
			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
				if (bCanMoveToThePage) {
					var oCurrentSlide = $(aSlides[iPaginationButtonIndex]);
					AssigmentSlides.prepare4View(oCurrentSlide);
				}
			}
			return bCanMoveToThePage;
		}
	});
	
	var oPrivate = new (function () {
		this.getLastVisitedSlideIndex = function (aSlides) {
			var iLastVisitedSlideIndex = 0,
				oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem();
			
			for (var iSldIdx = 0; iSldIdx < aSlides.length; iLastVisitedSlideIndex = iSldIdx, iSldIdx++) {
				var oCurrentSlide = jQuery(aSlides[iSldIdx]),
					iSlideId = oCurrentSlide.attr('id').split('___').last(),
					sSlideType = oCurrentSlide.data('slide-type'),
					aItemSlides = [],
					oCurrentObject = AssigmentSlides.getResponsibleObject(sSlideType);
					
				oExistingStatus = (
					(oStudentAttemptData !== null)?
					(
						(aItemSlides = _.where(oStudentAttemptData.itemSlides, {'slideID': iSlideId})).length > 0?
						aItemSlides.first().slideInputData:
						{}
					):
					{}
				);
				
				if (
					oCurrentObject.slideStatuses &&
					oCurrentObject.slideStatuses[iSlideId] &&
					oCurrentObject.slideStatuses[iSlideId].getIsRetrieved &&
					oCurrentObject.slideStatuses[iSlideId].getIsRetrieved()
				) {
					oExistingStatus = oCurrentObject.slideStatuses[iSlideId].getStatus();
				}
				
				if (oExistingStatus.visited !== true) {
					return iLastVisitedSlideIndex;
				}
			}
			return iLastVisitedSlideIndex;
		};
		this.getFreezePosition = function (
			iSlideIndex,
			aSlides,
			iPaginationButtonIndex
		) {
			var oExistingStatus = {},
				iFreezePosition = iSlideIndex,
				oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem();
			
			iPaginationButtonIndex = parseInt(iPaginationButtonIndex) || -1;
			if (typeof iPaginationButtonIndex == 'number') {
				iPaginationButtonIndex = aSlides.length - 1;
			}
			
			if (iPaginationButtonIndex < iFreezePosition) {
				return iFreezePosition;
			}
			
			for (
				var iSldIdx = iSlideIndex;
				iSldIdx <= iPaginationButtonIndex &&
				iSldIdx < aSlides.length;
				iSldIdx++
			) {
				var oCurrentSlide = jQuery(aSlides[iSldIdx]),
					iSlideId = oCurrentSlide.attr('id').split('___').last(),
					sSlideType = oCurrentSlide.data('slide-type'),
					oCurrentObject = AssigmentSlides.getResponsibleObject(sSlideType);
				
				oExistingStatus = (
					(oStudentAttemptData !== null)?
					(
						(aItemSlides = _.where(oStudentAttemptData.itemSlides, {'slideID': iSlideId})).length > 0?
						aItemSlides.first().slideInputData:
						{}
					):
					{}
				);
				
				if (
					oCurrentObject.slideStatuses &&
					oCurrentObject.slideStatuses[iSlideId] &&
					oCurrentObject.slideStatuses[iSlideId].getIsRetrieved &&
					oCurrentObject.slideStatuses[iSlideId].getIsRetrieved()
				) {
					oExistingStatus = oCurrentObject.slideStatuses[iSlideId].getStatus();
				}
				
				if (oExistingStatus.isComplete) {
					iFreezePosition += ((iSldIdx + 1 < aSlides.length)? 1: 0);
				}
				else {
					return iFreezePosition;
				}
			}
			return iFreezePosition;
		};
	})();
	
	
	AssigmentSlides.slidingEngine.setPos(0);
	
	window.swiperWrapper = swiperWrapper;
	
	$(".swiper-slide").css("height",$("#slide_container").height()+'px');
	$(".swiper-container").css("height",$("#slide_container").height()+'px');
	$(".swiper-wrapper").css("height",$("#slide_container").height()+'px');
    
	
	// Swiper Sliding locked for Single slide
	var slideRecords = $("div.swiper-wrapper:visible div.swiper-slide").length;
	if (slideRecords == 1) {
		AssigmentSlides.slidingEngine.freezeNextSlides();
		$('.pagination').hide();
	}
};

AssigmentSlides.getCurrentActiveSlide = function(){
	return $('.main_swiper_slide').length ? $('div.main_swiper_slide.swiper-slide-visible') : $('div.swiper-slide-visible');
};
/*==== IPP-2817 ====*/
/* If submission fails for IR from critical response screen then resubmit it on "Done" button click */
AssigmentSlides.submitAttemptData = function (pfCallback) {
	var itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]),
		studentAttemptData = AssigmentSlides.studentAttemptData,
		studentAttemptSummary = AssigmentSlides.studentAttemptSummary,
		systemScore = (
			(
				typeof AssigmentSlides.systemScore != 'undefined' &&
				AssigmentSlides.systemScore != null
			)?
			AssigmentSlides.systemScore:
			0
		),
		finalScore = AssigmentSlides.finalScore,
		itemComplete = AssigmentSlides.itemComplete;
		
	if (typeof pfCallback !== 'function') { pfCallback = $.noop(); }
	
	/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
	var sStudentAttemptSummary = JSON.stringify(AssigmentSlides.studentAttemptSummary),
		oSlideInfo = {},
		oTemplate = {};
		
	AssigmentSlides.studentAttemptSummary = {};
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = sStudentAttemptSummary;
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	
	for (var iIndex = 0; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		var oSlideInfo = AssigmentSlides.studentAttemptData['itemSlides'][iIndex];
		
		if (
			typeof oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined' ||
			$.trim(oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length == 0 ||
			isNaN(parseFloat(oSlideInfo['slideScore']))
		) {
			continue;
		}
		
		oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
		oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = parseFloat(oSlideInfo['slideScore']);
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
		
		oTemplate = {};
	}
		/*== Handle the case of Critical Response ==*/
	var oCRSlideInfo = (
			_.find(
				AssigmentSlides.studentAttemptData['itemSlides'],
				function (oSlideData) {
					return (
						oSlideData.slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE &&
						typeof oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] != 'undefined' &&
						$.trim(oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length != 0
					);
				}
			) ||
			null
		),
		oSummarySlideInfo = (
			_.find(
				AssigmentSlides.studentAttemptData['itemSlides'],
				function (oSlideData) {
					return (
						oSlideData.slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE &&
						typeof oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] != 'undefined' &&
						$.trim(oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length != 0
					);
				}
			) ||
			null
		);
		
	if (oSummarySlideInfo != null) {
		oTemplate = {};
		oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSummarySlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
		oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = parseFloat(((oSummarySlideInfo['slideScore'] || {}).summaryScore || {}).overallScore || 0);
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
	}	
	if (oCRSlideInfo != null) {
		oTemplate = {};
		oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oCRSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
		oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = 0;
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
	}
		/* End Handle the case of Critical Response */
	/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
	itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	studentAttemptData = AssigmentSlides.studentAttemptData;
	studentAttemptSummary = AssigmentSlides.studentAttemptSummary;
	systemScore = (parseInt(AssigmentSlides.systemScore) || 0);
	finalScore = AssigmentSlides.finalScore;
	itemComplete = AssigmentSlides.itemComplete;
	sItemAttemptId = AssigmentSlides.itemAttemptId;
		
	studentAttemptSummary = encodeURIComponent(JSON.stringify(studentAttemptSummary).replace(/(\\r|\\n|\s*)/g, ''));
	
	/*==== IPP-365 ====*/
	var oKnownErrors = AssigmentSlides.getKnownErrors4SaveAttempt();
	/*== End IPP-365 ==*/
	
	$.nativeCall({
		'method':			'SetAttemptData',
		'inputParams':		[itemID, studentAttemptData, studentAttemptSummary, systemScore, finalScore, itemComplete, itemAttemptId],
		'globalResource':	'objStudentAttemptDataResponse',
		'emptyValue':		0,
		'interval':			500,
		'beforeSend':		function () {
			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="" />',
				'background-color': 'none',
				'click-to-hide': false,
				'opacity': 0.5
			});
		},
		'onComplete':		function (poSaveAttemptDataResponse, poData) {
			oUtility.hideLoader();
			pfCallback(poSaveAttemptDataResponse, poData);
		},
		'onError':			function (poSaveAttemptDataResponse, poException, poData) {
			oUtility.hideLoader();
			var oResponseError = ((poSaveAttemptDataResponse || {}).Error || {}),
				poException = (poException || {}),
				sErrorCode = (oResponseError.ErrorCode || ''),
				sErrorDescription = (
					((oKnownErrors[sErrorCode] || {}).ErrorUserDescription) ||
					(
						(oResponseError.ErrorUserDescription) ||
						(
							$.isEmptyObject(poException) !== true?
							(
								(typeof poException.toString === 'function')?
								poException.toString():
								ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
							):
							ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
						)
					)
				);
			
			AssigmentSlides._alert(
				{
					divId:		'dialog-message',
					title:		'Alert!',
					message:	sErrorDescription
				},
				function () {
					if (typeof oKnownErrors[sErrorCode] === 'object') {
						if (typeof oKnownErrors[sErrorCode]['Action'] === 'function') {
							oKnownErrors[sErrorCode].Action(poSaveAttemptDataResponse);
						}
					}
				}
			);
		}
	});
};

AssigmentSlides.prepare4Submit = function () {
	var dSystemScore = 0.0,
		dReadingCheckPointScore = 0.0,
		dReadingCheckPointMaxScore = 2.0,
		dReadingCheckPointTotalScore = 0.0,
		iTotalRCAssignments = 0,
		dSummaryScore = 0.0;
		/*==== Student Attempt Summary ====*/
	AssigmentSlides.studentAttemptSummary = {};
	AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE] = {};
	AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_READING_CHECKPOINT] = 0.0;
	AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_SUMMARY] = 0.0;
		/*== End Student Attempt Summary ==*/
	for (
		var iSlideIndex = 0, aItemSlides = AssigmentSlides.studentAttemptData.itemSlides;
		iSlideIndex < aItemSlides.length;
		iSlideIndex++
	) {
		var oItemSlide = aItemSlides[iSlideIndex],
			dSlideScore = 0;
		if (
			'slideScore' in oItemSlide &&
			oItemSlide['slideScore'] != null &&
			oItemSlide['slideScore'] != '' &&
			!isNaN(oItemSlide['slideScore'])
		) {
			dSlideScore = parseFloat(oItemSlide['slideScore']);
			dSystemScore += dSlideScore;
			/*==== Populate Student Attempt Summary ====*/
			if (typeof AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] == 'undefined') {
				AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] = {};
			}
			AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']][oItemSlide['slideID']] = dSlideScore;
			/*== End Populate Student Attempt Summary ==*/
		}
		else if (
			typeof oItemSlide['slideScore'] == 'object' &&
			oItemSlide['slideScore'] != null
		) {
			if (
				'summaryScore' in oItemSlide['slideScore'] &&
				typeof oItemSlide['slideScore']['summaryScore'] != 'undefined' &&
				oItemSlide['slideScore']['summaryScore'] != null
			) {
				if (
					'overallScore' in oItemSlide['slideScore']['summaryScore'] &&
					typeof oItemSlide['slideScore']['summaryScore']['overallScore'] != 'undefined' &&
					oItemSlide['slideScore']['summaryScore']['overallScore'] != null &&
					oItemSlide['slideScore']['summaryScore']['overallScore'] != '' &&
					!isNaN(oItemSlide['slideScore']['summaryScore']['overallScore'])
				) {
					dSlideScore = parseFloat(oItemSlide['slideScore']['summaryScore']['overallScore']);
					dSystemScore += (dSlideScore * IwtsSummaryView.iMultiplyingFactor);
					/*==== Populate Student Attempt Summary ====*/
					if (typeof AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] == 'undefined') {
						AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] = {};
					}
					AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']][oItemSlide['slideID']] = dSlideScore * IwtsSummaryView.iMultiplyingFactor;
					/*== End Populate Student Attempt Summary ==*/
				}
			}
		}
		switch (oItemSlide['slideType']) {
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
				dReadingCheckPointScore += dSlideScore;
				dReadingCheckPointTotalScore += dReadingCheckPointMaxScore;
				break;
			
			case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
				dSummaryScore += dSlideScore;
				break;
		}
	}
	AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_READING_CHECKPOINT] = (
		(dReadingCheckPointScore / dReadingCheckPointTotalScore) * 100
	).toFixed(2);
	
	/**
	 *
	 *
		4-point rubric
			4 = A = 100
			3 = B = 88
			2 = C = 75
			1 = D = 60
			0 = E = 55
	 *
	 */
	var o4PointRubric = {
		'0':	55,
		'1':	60,
		'2':	75,
		'3':	88,
		'4':	100
	};
	
	AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_SUMMARY] = o4PointRubric[Math.round(dSummaryScore).toString()];
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	if (!isNaN(dSystemScore)) {
		AssigmentSlides.systemScore = dSystemScore;
	}
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
};
/*==== IPP-2817 ====*/

/**
 * Impose events on slide elements
 * @method bindEvents
 * @param {String} sComment
 * @return {undefined}
 */
AssigmentSlides.bindEvents = function (sComment) {
	var oSelf = this;
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {
		var iShowCommentDelay = null;
		if (AssigmentSlides.introVideo) {
			var preloadMode = "auto";
			if (oPlatform.isDevice() && oPlatform.isWindows()) {
				preloadMode = 'none';
			}
			var myPlayer = videojs("video___0", {"controls": false, "autoplay": true, "preload": preloadMode}, function(){});
			myPlayer.on("ended", function(){ 
				$(".videocontent").remove();
				this.dispose();
				AssigmentSlides.slidingMethod();
				iShowCommentDelay = parseInt(AssigmentSlides.slidingEngine.getSlideSpeed());
				setTimeout("AssigmentSlides.showComment(" + JSON.stringify(sComment) + ");", iShowCommentDelay);
				setTimeout("AssigmentSlides.initAudio(0);", iShowCommentDelay);
				AssignmentsView.resize();
			});
		}
		else {
			AssigmentSlides.slidingMethod();
			iShowCommentDelay = parseInt(AssigmentSlides.slidingEngine.getSlideSpeed());
			setTimeout("AssigmentSlides.showComment(" + JSON.stringify(sComment) + ");", iShowCommentDelay);
			setTimeout("AssigmentSlides.initAudio(0);", iShowCommentDelay);
			AssignmentsView.resize();
		}
	}
	else {
		AssigmentSlides.slidingMethod();
		AssigmentSlides.showComment(sComment);
		AssigmentSlides.initAudio(0);
	}
	
	// Back Button - Assignment details to Assignment TOC
	AssignmentsView.prev.off().on("click " + sWindowsEventType, function (event) {
		
		/*== fix for IPP-6464 ==*/
		GradeIntroAnimationView.stopIntroVideo();
		/*== end fix for IPP-6464 ==*/
		
		/*== Check if Writing Assignments Exceeding Max Limit ==*/
		if (AssigmentSlides.checkMaxCharLimit()) {			
			return;
		}
		
		/*== Stop Audio if Playing  ===*/
		if (AssigmentSlides.bAudioExists == true && AssigmentSlides.bAudioPaused == false) {
			$.nativeCall({
				'method':			'PlayPauseAudio',
				'inputParams':		['Pause'],
				'globalResource':	'objPlayPauseAudioResponse',
				'interval':			500,
				'breakAfter':		5000,
				'debug':			false
			});
		}
		
		/*== Cechk if Audio not Saved for Oral Fluency ===*/
		if (AssigmentSlides.bAudioExists == true && AssigmentSlides.bAudioSaved == false) {
			AssigmentSlides._confirm({
				'title':	'Are you sure?',
				'divId':	'dialog-message',
				'message':	ASSIGNMENTS.c_s_CONFIRM_AUDIO_SAVED_MSG,
				'yes':		function () {
					try {
						var sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],						
							sQuestionId = $(".main_swiper_slide.swiper-slide-visible .swiper-nested1 .swiper-slide-visible .phonic_oralfluency_conts").attr("data-question-id"),						
							sAction = "Stop";
							
						RecordStopAudio(sAction, sAssignmentId, sQuestionId);
					}
					catch (e) {
						throw e;
					}					
					AssigmentSlides.bAudioExists = false;
					AssigmentSlides.setAttemptDataOnBackClick.call(this);					
				}
			});	
		}
		else {
			AssigmentSlides.setAttemptDataOnBackClick.call(this);
		}				
		
    });
    
    
	$('.' + ASSIGNMENTS.c_s_ASSIGN_READ_CHKPNT_BTN_SELECTOR).off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, AssigmentSlides.inputAnswer);
    
	/* resize for each slide */
    /* box height & width */
    $('.swiper-slide').each(function() {
        var swiper_id = $(this).attr('id');        
        var cont_height = parseInt($('#' + swiper_id + ' .continent_box_inner').height());
        var bttn_box_height = 0;

        if ($('#' + swiper_id + ' .edit_box_title').is(':visible')) {
            bttn_box_height = (
				$('#' + swiper_id + ' .edit_box_title').height() +
				parseInt($('#' + swiper_id + ' .edit_box_title').css('padding-top')) +
				parseInt($('#' + swiper_id + ' .edit_box_title').css('padding-bottom'))
			);
        }
		
        var actual_height = cont_height - (
			bttn_box_height +
			parseInt($('#' + swiper_id + ' .continent_content_inner').css('padding-top')) +
			parseInt($('#' + swiper_id + ' .continent_content_inner').css('padding-bottom')) +
			parseInt($('#' + swiper_id + ' .scroll_padding').css('padding-bottom')) +
			parseInt($('#' + swiper_id + ' .scroll_padding').css('padding-top')) + 2
		);
		
		if (actual_height < $('#' + swiper_id + ' .continent_box_inner').height() - 10) {
			$('#'+swiper_id+' .continent_content_inner').css('max-height',actual_height+'px');
		}
    })
    /* resize for each slide ends */
	
	/*==== Bind Event to show comment ====*/
	if (oSelf['showCommentBtn']) {
		oSelf['showCommentBtn']
			.off('click')
			.on('click', function () {
				var sComment = $.trim($(this).find('comment').text());
				oSelf.showComment(sComment);
			});
	}
	/*== End Bind Event to show comment ==*/
	
	AssigmentSlides.playAudio();	
	
	onPageLoadComplete(GENERAL.c_s_ASSIGNMENT_SLIDE_LOADED);	
	
	/* ILIT-936 */
	if(
		!(AssignmentsView.productCode || '').startsWith("ilit20") &&
		navigator.userAgent.toLowerCase().search("android") > -1
	){
		$(".swiper-wrapper").addClass("swiper-wrapper_45CC");
	}
	/* End ILIT-936 */
	
};

AssigmentSlides.setAttemptDataOnBackClick = function () {
	var sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	/*== End Button converted to done button ==*/		
	IWTHighlightSlide.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	if (AssigmentSlides.audioFiles != null) {
		AssigmentSlides.audioFiles = null;
		$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0].pause();
	}
	var sMode = '';
	
	if (sMode = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE)) {
		if (oPlatform.isDevice()) {
			HideNativeBottomBar($_GET(POPUP_VIEW.c_s_QUERY_PARAM_OPENED_FROM) == GENERAL.c_s_PAGE_TYPE_NOTEBOOK);
			CloseWebView();
		}
		return;
	}
	
	/* Hide eBook tooltip if displayed */		
	if ($('#' + ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).is(':visible')) {
		$('#' + ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
	}
	/* Should load TOC screen */
	AssignmentsView.iLoadTOCScreen = 1;
	
	/*==== Button converted to done button ====*/
	if (!$(this).hasClass(ASSIGNMENTS.c_s_DONE_CLASS)) {
		// passing value 1 i.e. return to TOC
		AssigmentSlides.setAttemptData(1);
		
		if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS && 
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
			SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_CLOSED_VERBID, sItemId);
		}
	}
	else {
		/*==== IPP-2817 ====*/
		if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) { // Applies only to IWT
			if (
				typeof AssigmentSlides.studentAttemptData['itemSlides'] != 'undefined' &&
				AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array
			) {
				/*=== Iterate through Slide Input Data ===*/
				var iSlideIdx = 0,
					oSlideInputData = {},
					bIsSlideComplete = false;
				for (iSlideIdx = 0; iSlideIdx < AssigmentSlides.studentAttemptData['itemSlides'].length; iSlideIdx++) {
					if (oSlideInputData = AssigmentSlides.studentAttemptData['itemSlides'][iSlideIdx]['slideInputData']) {
						bIsSlideComplete = oSlideInputData['isComplete'] || false;
						if (bIsSlideComplete !== true) {
							break;
						}
					}
					else {
						break;
					}
				}
				if (iSlideIdx == AssigmentSlides.studentAttemptData['itemSlides'].length) { // All the slides are complete
					if (
						isNaN(parseFloat(AssigmentSlides.systemScore)) &&
						AssigmentSlides.itemComplete === ASSIGNMENTS.c_s_INCOMPLETED_STATUS &&
						(
							typeof AssigmentSlides.studentAttemptSummary == 'object' &&
							AssigmentSlides.studentAttemptSummary != null &&
							isObjectEmpty(AssigmentSlides.studentAttemptSummary)
						)
					) {
						AssigmentSlides.prepare4Submit();
						AssigmentSlides.submitAttemptData(function () {
							oUtility.hideLoader();
							setTimeout(function () {
								AssignmentsView.loadAssignmentList();
							}, 400);
						});
						return;
					}
					
				}
				/*= End Iterate through Slide Input Data =*/
			}
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_CLOSED_VERBID, sItemId);
			}
		}
		/*== End IPP-2817 ==*/
		AssignmentsView.loadAssignmentList();
	}
}

AssigmentSlides.checkMaxCharLimit = function () {
	
	var boxId = 0,
		sMessage = GENERAL.c_s_MAX_SIZE_EXCEED_MSSG;
	
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_IWTS) {		
		
		if ((IwtsSummaryView['controls'][IwtsSummaryView.slideIdx].typeareaText != null && 
			IwtsSummaryView['controls'][IwtsSummaryView.slideIdx].typeareaText.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) || 			
			(IWTTextAnswerSlide['controls'][IWTTextAnswerSlide.slideIdx].textArea != null && 
			IWTTextAnswerSlide['controls'][IWTTextAnswerSlide.slideIdx].textArea.val().length > GENERAL.c_i_READ_CRITICALLY_CHAR_LIMIT)) {
			
			AssigmentSlides._alert({
							divId:		'dialog-message',
							title:		'Alert!',
							message:	sMessage
						});
			return 1;
		}			
	}
	else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH) {
	
		if (ParagraphView['controls'].typeareaText.val().length > GENERAL.c_i_PARA_CHAR_LIMIT) {
			AssigmentSlides._alert({
							divId:		'dialog-message',
							title:		'Alert!',
							message:	sMessage
						});
			return 1;
		}
	}
	else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY) {

		if ((EssayView['controls'].typeareaTextIntro.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) || 
			(EssayView['controls'].typeareaTextBody.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) || 
			(EssayView['controls'].typeareaTextConclusion.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT)) {
			
			if (EssayView['controls'].typeareaTextIntro.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) {
				sMessage =  GENERAL.c_s_MAX_SIZE_EXCEED_MSSG_INTRO;
			}
			else if (EssayView['controls'].typeareaTextBody.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) {
				sMessage =  GENERAL.c_s_MAX_SIZE_EXCEED_MSSG_BODY;
			}
			else {
				sMessage =  GENERAL.c_s_MAX_SIZE_EXCEED_MSSG_CONCLUSION;
			}
			
			AssigmentSlides._alert({
							divId:		'dialog-message',
							title:		'Alert!',
							message:	sMessage
						});
			return 1;
		}
	}
	else if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT) {		
		$.each(NewTypeInView['controls'].typeareaText, function(i,obj){
			if (obj.val().length > GENERAL.c_i_ESSAY_CHAR_LIMIT) {
				boxId = i+1;
			}
		});	
		if (boxId > 0) {
			AssigmentSlides._alert({
					divId:		'dialog-message',
					title:		'Alert!',
					message:	sMessage
				});
			return 1;
		}
	}
	else {
		return 0;
	}
};

AssigmentSlides.showComment = function (sComment) {
	var oSelf = this;
	if ($('div.swiper-slide-visible').length == 0) {
		return false;
	}
	
	/*==== Stop showing comment while instructor is viewing ====*/
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR) {
		return false;
	}
	/*== End Stop showing comment while instructor is viewing ==*/
	
	if (!_.isEmpty(sComment)) {
		oSelf._alert({
			divId:		'dialog-message',
			title:		'Comment',
			message:	decodeURIComponent(sComment)
		});
	}
};

/**
 * Check if we need to show comment
 * @method initComment
 * @param {String} sComment
 * @return {undefined}
 */
AssigmentSlides.initComment = function (sComment) {
	var oSelf = this;
	/*==== Stop showing comment while instructor is viewing ====*/
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR) {
		return false;
	}
	/*== End Stop showing comment while instructor is viewing ==*/
	/*==== Show Comment Icon ====*/
	AssignmentsView.prev.next('.' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS).remove();
	
	if (
		sComment !== undefined &&
		sComment !== null &&
			typeof sComment === 'string' &&
			sComment.length !== 0
	) {	
		AssignmentsView.prev.after(
			'<button ' +
				'type="button" ' +
				'class="' + ASSIGNMENTS.c_s_COMMENT_BUTTON_CLASS + ' sprite left" ' +
				'id="' + ASSIGNMENTS.c_s_SHOW_COMMENT + '"' +
			'>' +
				'<comment style="display:none; visibility:hidden;">' + sComment + '</comment>' +
			'</button>'
		);
		oSelf.showCommentBtn = $('#' + ASSIGNMENTS.c_s_SHOW_COMMENT);
	}
	/*== End Show Comment Icon ==*/
};

AssigmentSlides.initAudio = function (arrIdx) {
	var oSelf = this,
		audioBtn = AssignmentsView.audio;
		
	if (oSelf.audioFiles != null && oSelf.audioFiles[arrIdx] != null) {
		audioBtn.addClass(ASSIGNMENTS.c_s_AUDIO_PLAY_BTN_CLASS).removeClass(ASSIGNMENTS.c_s_AUDIO_PAUSE_BTN_CLASS);
		$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID).attr('src', oSelf.mediaPath + oSelf.audioFiles[arrIdx]);
		$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0].pause();
		audioBtn.show();
	}
	else {
		if ($('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID).length > 0) {
			if ('pause' in $('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0]) {
				$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0].pause();
			}
		}
		audioBtn.hide();
	}
};

AssigmentSlides.playAudio = function () {
	var oSelf = this,
		audioBtn = AssignmentsView.audio,
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;

	audioBtn.off("click").on("click", function () {
		// for pause button
		if (audioBtn.hasClass(ASSIGNMENTS.c_s_AUDIO_PAUSE_BTN_CLASS)) {	
			$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0].pause();
			audioBtn.addClass(ASSIGNMENTS.c_s_AUDIO_PLAY_BTN_CLASS).removeClass(ASSIGNMENTS.c_s_AUDIO_PAUSE_BTN_CLASS);
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_AUDIO_STOP_VERBID, sItemId);
			}
		} 
		// for play button
		else {
			audioBtn.addClass(ASSIGNMENTS.c_s_AUDIO_PAUSE_BTN_CLASS).removeClass(ASSIGNMENTS.c_s_AUDIO_PLAY_BTN_CLASS);
			$('#' + ASSIGNMENTS.c_s_AUDIO_PLAYER_ID)[0].play();
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_AUDIO_START_VERBID, sItemId);
			}
		}
	});
};

AssigmentSlides.retrieve = function () {
	var oSelf = this;
	
	var oCurrentSlide = oSelf.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last(),
		oStatus = {};
		
	switch (oCurrentSlide.data('slide-type')) {
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
			oStatus = IWTDndSlide.slideStatuses[iSlideId].getStatus();
			if (IWTDndSlide.slideStatuses[iSlideId].getIsRetrieved() == true) {
				IWTDndSlide.retrieveStatus4mData(oStatus);
			}
			else {
				IWTDndSlide.retrieveStatus();
			}
			IWTDndSlide.slideStatuses[iSlideId].update();
			IWTDndSlide.slideStatuses[iSlideId].updateByData({
				'visited':	true
			});
			break;
			
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
			oStatus = IWTTextAnswerSlide.slideStatuses[iSlideId].getStatus();
			if (IWTTextAnswerSlide.slideStatuses[iSlideId].getIsRetrieved() == true) {
				IWTTextAnswerSlide.retrieveStatus4mData(oStatus);
			}
			else {
				IWTTextAnswerSlide.retrieveStatus();
			}
			IWTTextAnswerSlide.slideStatuses[iSlideId].update();
			IWTTextAnswerSlide.slideStatuses[iSlideId].updateByData({
				'visited':	true
			});
			break;
			
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
			oStatus = IWTHighlightSlide.slideStatuses[iSlideId].getStatus();
			
			if (IWTHighlightSlide.slideStatuses[iSlideId].getIsRetrieved() == true) {
				IWTHighlightSlide.retrieveStatus4mData(oStatus);
			}
			else {
				IWTHighlightSlide.retrieveStatus();
			}
			IWTHighlightSlide.slideStatuses[iSlideId].update(oCurrentSlide);
			IWTHighlightSlide.slideStatuses[iSlideId].updateByData(oCurrentSlide, {
				'visited':	true
			});
			break;
			
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
			IwtsSummaryView.slideStatuses[iSlideId].setIsRetrieved(true);
			break;
			
		default:
			break;
	}
};

AssigmentSlides.inputAnswer = function () {
	var nowSlide = AssigmentSlides.getCurrentActiveSlide(),
		contentInnerHeight = nowSlide.find('.continent_content_inner').height(),
		editBoxTitleHeight = nowSlide.find('.edit_box_title').height(),
		editBoxPaddingTop = parseInt(nowSlide.find('.edit_box_title').css('padding-top')),
		editBoxPaddingBottom = parseInt(nowSlide.find('.edit_box_title').css('padding-bottom')),
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		height = contentInnerHeight + editBoxTitleHeight + editBoxPaddingTop  + editBoxPaddingBottom,
		oInuptBttn = $(this).parent();
	
	if (height < nowSlide.find('.continent_box_inner').height() - 10) {		
		nowSlide.find('.continent_content_inner').animate({'max-height':height+'px'});
	}
	oInuptBttn.fadeOut('slow');

	if (nowSlide.find(".input_type_text_slide_left_container > .text_box_area > .input_type_text_slide_left_txtarea").length > 0) {
		nowSlide.find(".input_type_text_slide_left_container > .text_box_area > .input_type_text_slide_left_txtarea").attr("readonly", "readonly");
	}
	var iSlideId = parseInt(nowSlide.attr("reference-key").split("___").pop());
	switch (nowSlide.data('slide-type')) {
		case ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE:
		case ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC:
			nowSlide.find('.continent_edit_box').css('left', '-200px');
			nowSlide.find('.continent_edit_box').animate({'opacity': '1', 'left': '0'});
			nowSlide.find('.swiper-nested1 .swiper-slide-visible').addClass('visited');
			PhonicTextBasedView.updateAttemptData();			
			$.monitor({
				'if':	function () {
					return (oInuptBttn.css('display') == 'none');
				},				
				'interval':	200,
				'then':	function () {
					PhonicTextBasedView.resize();
					PhonicTextBasedView.initIScroll();
				}
			});	
		break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
			//if DND template, enable draggable
			IWTDndSlide.makeTextDraggable();
			nowSlide.find('.continent_edit_box').css('left', '-200px');
			nowSlide.find('.continent_edit_box').animate({'opacity': '1', 'left': '0'}, GENERAL.c_s_DEFAULT_ANIMATE_TIME, function () {
				var oDraggableArea = nowSlide.find('.continent_box_inner .draggable_area');
				oDraggableArea.css(
					'height',
					(
						parseFloat(nowSlide.find('.continent_box_inner').css('height').replace('px', '')) -
						(
							parseFloat(nowSlide.find('.continent_box_inner').css('padding-top').replace('px', '')) +
							parseFloat(nowSlide.find('.continent_box_inner').css('padding-bottom').replace('px', '')) +
							parseFloat(nowSlide.find('.continent_box_inner').css('border-top-width').replace('px', '')) +
							parseFloat(nowSlide.find('.continent_box_inner').css('border-bottom-width').replace('px', ''))
						) -
						(
							parseFloat(oDraggableArea.css('padding-top').replace('px', '')) +
							parseFloat(oDraggableArea.css('padding-bottom').replace('px', '')) -
							5
						)
					)
				);
				
				var oActivityArea = nowSlide.find('.continent_edit_box'),
					dBottomBarHeight = (
						oActivityArea.find('.edit_box_title').is(':visible')?
						parseFloat(oActivityArea.find('.edit_box_title').css('height').replace('px', '')):
						0
					),
					dDragTextAreaHeight = (
						(
							parseFloat(oActivityArea.css('height').replace('px', '')) +
							parseFloat(oActivityArea.css('padding-top').replace('px', '')) +
							parseFloat(oActivityArea.css('padding-bottom').replace('px', ''))
						) - dBottomBarHeight - 27 // Found by inspection
					);
					
				nowSlide.find('.drag_text_area_container').css('height', dDragTextAreaHeight + 'px');
				IWTDndSlide.slideStatuses[iSlideId].update();
			});
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_READING_CHECK_ACCESS_VERBID, sItemId);
			}
		break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
			nowSlide.find('.continent_edit_box').css('left','-200px');
			nowSlide.find('.continent_edit_box').animate({'opacity':'1', 'left':'0'}, GENERAL.c_s_DEFAULT_ANIMATE_TIME, function () {
				IWTHighlightSlide.slideStatuses[iSlideId].update(nowSlide);
			});
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_READING_CHECK_ACCESS_VERBID, sItemId);
			}
		break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
			
		break;
		default:
			nowSlide.find('.continent_edit_box').css('left', '-200px');
			nowSlide.find('.continent_edit_box').animate({'opacity': '1', 'left': '0'});
		break;
	}
};

AssigmentSlides.getResponsibleObject = function (sSlideType) {
	switch (sSlideType) {
			/*==== Interactive Reading ====*/
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
			return IwtsSummaryView;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
			return IWTTextAnswerSlide;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
			return IWTHighlightSlide;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
			return IWTDndSlide;
			/*== End Interactive Reading ==*/
		case ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH:
			return ParagraphView;
		case ASSIGNMENTS.c_s_TYPE_TPL_ESSAY:
			return EssayView;
		case ASSIGNMENTS.c_s_ASSESSMENT:
			return Assessment;
		case ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM:
			return WordSlamView;
		case ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE:				
			return PhonicTextBasedView;
			/*==== Phonic: Word Based ====*/
		case ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS:				
			return PluralNounsView;
		case ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS:
			return DigraphView;
		case ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES:
			return WordFamiliesView;
		case ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES:
			return SyllablesView;
		case ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT:
			return WordSortView;
		case ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS:
			return RotatingView;
		case ASSIGNMENTS.c_s_TYPE_TPL_FRS:
			return $GLOBALS.get('FoundationalRS');
			/*== End Phonic: Word Based ==*/
	}
	return null;
};

AssigmentSlides.prepare4View = function (mixSlide) {
	var oSelf = this,
		sSlideType = '',
		iSlideId = 0;
		
	if (typeof mixSlide == 'string') {	
		sSlideType = mixSlide;
	}
	else {
		oSlide = mixSlide;
		sSlideType = mixSlide.data('slide-type');
	}

	switch (sSlideType) {
		case ASSIGNMENTS.c_s_TYPE_TPL_ESSAY:
		case ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH:
		case ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET:
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
		case ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS:
		case ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE:
		case ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC:
			if (ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE == sSlideType) {
				iSlideId = oSlide.attr('id').split('___').last();
			}
			var oControls = (
				ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH == sSlideType?
				ParagraphView.controls:
				(
					ASSIGNMENTS.c_s_TYPE_TPL_ESSAY == sSlideType?
					EssayView.controls:
					(
						ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE == sSlideType?
						IwtsSummaryView.controls[iSlideId]:
						(
							ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS == sSlideType?
							RotatingView.controls:
							(
								(ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE == sSlideType || 
								ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC == sSlideType)?
								PhonicTextBasedView.controls:
								(
									AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT?
									NonScoreAbleView.controls : NewTypeInView.controls
								)
							)							
						)						
					)
				)
			);
			
			for (var sControl in oControls) {
				if (sControl.endsWith('Btn')) {
					oControls[sControl]
						.attr('disabled', 'disabled')
						.addClass('btndisabled')
						.addClass('disabled');
				}
				else if (sControl.startsWith('typearea')) {
					if (oControls[sControl] instanceof Array) {
						for (var iCIdx = 0; iCIdx < oControls[sControl].length; iCIdx++) {
							oControls[sControl][iCIdx].attr('disabled', 'disabled');
						}
					}
					else {
						oControls[sControl].attr('disabled', 'disabled');
					}
				}
			}
			if (
				ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE == sSlideType ||
				ASSIGNMENTS.c_s_TYPE_TPL_ESSAY == sSlideType
			) {
				/*==== Addition Task to Prevent viewing Drill-Down Information ====*/
				oControls.feedbackContent.find('.disable-controls').removeClass('disable-controls');
				oControls.feedbackContent.find('.catagory_row').addClass('disable-buttons');
				$('.disable-buttons img').off('click tap');
				/*== End Addition Task to Prevent viewing Drill-Down Information ==*/
			}
			break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE:
			iSlideId = oSlide.attr('id').split('___').last();
			
			if (!IWTTextAnswerSlide.slideStatuses[iSlideId].getIsComplete()) {
				if (IWTTextAnswerSlide['controls'][iSlideId].submitButton) {
					IWTTextAnswerSlide['controls'][iSlideId].submitButton.addClass('btndisabled');
					IWTTextAnswerSlide['controls'][iSlideId].submitButton.addClass('disabled');
					IWTTextAnswerSlide['controls'][iSlideId].submitButton.prop('disabled', true);
				}
				if (IWTTextAnswerSlide['controls'][iSlideId].textArea) {
					IWTTextAnswerSlide['controls'][iSlideId].textArea.prop('disabled', true);
				}
			}
			break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
			iSlideId = oSlide.attr('id').split('___').last();
			if (!IWTHighlightSlide.slideStatuses[iSlideId].getIsComplete()) {
				for (var sControl in IWTHighlightSlide.controls[iSlideId]) {
					if (sControl.match(/(submit|readingCheckPoint)Btn/)) {
						IWTHighlightSlide.controls[iSlideId][sControl]
							.attr('disabled', 'disabled')
							.addClass('btndisabled')
							.addClass('disabled');
					}
					else if (sControl.match(/(yellow|red)MarkarBtn/)) {
						IWTHighlightSlide.controls[iSlideId][sControl].parent().addClass('disable_tools');
					}
					else if (sControl == 'eraser') {
						IWTHighlightSlide.controls[iSlideId][sControl].parent().addClass('disable_tools');
					}
				}
			}
			break;
		case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
			iSlideId = oSlide.attr('id').split('___').last();
			if (!IWTDndSlide.slideStatuses[iSlideId].getIsComplete()) {
				for (var sControl in IWTDndSlide.controls[iSlideId]) {
					if (sControl.match(/(submit|inputAnswer)Button/)) {
						IWTDndSlide.controls[iSlideId][sControl]
							.attr('disabled', 'disabled')
							.addClass('btndisabled')
							.addClass('disabled');
					}
					else if (sControl == 'draggable') {
						try {
							IWTDndSlide['controls'][iSlideId].draggable.draggable("destroy");
						}
						catch (oException) {
						}
					}
				}
			}
			break;
		case ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE:
		case ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE:
			var oCurrentObject = StudyPlanView;
			if (sSlideType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
				oCurrentObject = StudyPlanView;
			}
			$(oCurrentObject.container + ' ' + oCurrentObject.submitButton)
				.removeClass('disabled')
				.removeAttr('disabled')
				.trigger('click');
		case ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE:
			$(StudyPlanPracticeView.submitButton)
				.removeClass('disabled')
				.removeAttr('disabled')
				.trigger('click');
			break;
		default:
			var oCurrentObject = null;
			if (oCurrentObject = oSelf.getResponsibleObject(sSlideType)) {
				if (typeof oCurrentObject.prepare4View == 'function') {
					oCurrentObject.prepare4View.call(oCurrentObject);
				}
			}
			break;
	}
	return false;
};

AssigmentSlides.setStatusToINPROGRESS = function (sAssignmentId, bReloadData) {
	var oSelf = this;
	if (
		typeof sAssignmentId == 'undefined' ||
		sAssignmentId == null ||
		sAssignmentId.length == 0
	) {
		sAssignmentId = AssignmentsView.slideDataValue.split('___').fetch(1);
	}
	
	if (typeof bReloadData != 'boolean') {
		bReloadData = false;
	}
	
	/*==== Back the data up ====*/
	var oStudentAttemptData = oSelf.studentAttemptData,
		dSystemScore = oSelf.systemScore,
		dFinalScore = oSelf.finalScore,
		iItemComplete = oSelf.itemComplete;
	/*== End Back the data up ==*/
	if (bReloadData === true) {
		oSelf.studentAttemptData = oSelf.getStudentAttemptForGradableItem(sAssignmentId);
	}
	oSelf.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	oSelf.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	oSelf.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;

	/*==== iOS cannot save null value ====*/
	if (oSelf.studentAttemptData == null) {
		oSelf.studentAttemptData = '';
	}
	/*== End iOS cannot save null value ==*/
	
	oSelf.setAttemptData();
	
	/*==== Put the existing data back ====*/
	if (bReloadData === true) {
		oSelf.studentAttemptData = oStudentAttemptData;
	}
	oSelf.systemScore = dSystemScore;
	oSelf.finalScore = dFinalScore;
	oSelf.itemComplete = iItemComplete;
	/*== End Put the existing data back ==*/
};

AssigmentSlides.getKnownErrors4SaveAttempt = function () {
	var sAssignmentType = (AssignmentsView.slideDataValue.split('___') || []).first();
	if (sAssignmentType !== ASSIGNMENTS.c_s_ASSESSMENT) { sAssignmentType = ASSIGNMENTS.c_s_ASSIGNMENT; }
	return {
		"U1026": {
			ErrorTechDescription:	"No record found in USER_ATTEMPT_ITEM",
			Action:					function () { AssignmentsView.loadAssignmentList(); }
		},
		"U1065": {
			ErrorTechDescription:	"Token Id is not valid active token Id for the current user.",
			Action:					function () { /* do nothing; */ }
		},
		"U1083": {
			ErrorTechDescription:	"Max Size Exceeded. Maximum 10000 characters allowed.",
			Action:					function () { /* do nothing; */ }
		},
		"U1084": {
			ErrorTechDescription:	"Invalid QuestionIds. Check Content object for list of invalid Question Ids.",
			Action:					function () { /* do nothing; */ }
		},
		"U1087": {
			ErrorTechDescription:	"The gradable item which you are trying to submit does not have question and its score.",
			Action:					function () { /* itemComplete => 1, finalScore => <non-zero>, studentAttemptSummary => <BLANK>/Broken */ }
		},
		"U1092": {
			ErrorTechDescription:	"Invalid AttemptId. Attempt is either withdrawn or does not exist in the database.",
			ErrorUserDescription:	oUtility.printf('Your teacher has withdrawn this %s.', sAssignmentType),
			Action:					function () { AssignmentsView.loadAssignmentList(); }
		}
	};
};

/**
 * Description
 * @method getNoteList
 * @return {undefined}
 */
AssigmentSlides.getNoteList = function (sJournal, sRefId) {
	objNoteBookData = null;
	oUtility.showLoader({
	  'message': '<img src="media/loader.gif" alt="" />',
	  'background-color': 'none',
	  'click-to-hide': false,
	  'opacity': 0.5
	});
	$.nativeCall({
		'method':			'GetNotelist',
		'globalResource':	'objNoteBookData',
		'inputParams': 		[sJournal, sRefId],
		'interval':			500,			
		'debug':			false,
		'onComplete':		function () {
			oUtility.hideLoader();			
		}
	});
}

/**
 * Native Call Wrapper
 * @method nativeCallWrapper
 * @param {Object} oRequest that contains following
 * @param {Array} aServiceNames 
 * @param {Array} aParams
 * @param {Object} oResponse
 * @param {Function} fCallback
 * @return 
 */
AssigmentSlides.nativeCallWrapper = function (oRequest) {
	var oSelf = this;
	
	$.nativeCall({
		'method':			oRequest[0]['serviceName'],
		'inputParams':		oRequest[0]['params'],
		'globalResource':	oRequest[0]['response'],
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'checkSuccess':		oRequest[0]['checkSuccess'],
		'onComplete':		function () {
			if (oRequest[0]['serviceName'] == "GetNoteInfo") {
				AssigmentSlides.iNoteCnt++;
				AssigmentSlides.sNoteText += '<p><b>'+AssigmentSlides.iNoteCnt + '.</b> ' + decodeURIComponent(objNoteInfoData.Content.NoteText) + '</p>';
			}
			
			if (oRequest[0]['callback'] == null) {
				// prepare for next service call
				AssigmentSlides.nativeCallWrapper(oRequest.slice(1,oRequest.length));
			}
			else {
				oRequest[0]['callback'].call(this, oSelf);
			}
		}
	});
}

function IWTIntroVideo () {}

IWTIntroVideo.model = null;

IWTIntroVideo.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf);
}

IWTIntroVideo.render = function (oSelf) {
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(_.template($("#iwt_video_intro_slide").html(),{
		"data":IWTIntroVideo.model,
		// "mediaPath":AssigmentSlides.mediaPath,
		"mediaPath":AssigmentSlides.videoPath,
		"referenceKey": AssigmentSlides.referenceKey + "___introVideo",
	}));
	
	oSelf.resize();
};

IWTIntroVideo.bindEvents = function () {};

IWTIntroVideo.resize = function () {
	var window_height = $(window).height();
	var window_width = $(window).width();
	var header_height = $("header").outerHeight();
	var actual_height = window_height - header_height;
	var actual_width = (actual_height * 4)/3;
	$(".videocontent").height(actual_height);
};


function Assessment() {
}

Assessment.model = null;
Assessment.weightPerQuestion = 1;
Assessment.itemSlides = [];
Assessment._alert = ISeriesBase.prototype._alert;

Assessment.prepare4View = function () {
	var oSelf = this;
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true); // bIsSubmitted = true
	}
	$('ul.multiple_choice_ul > li').off('click tap ' + sWindowsEventType);
	$("#" + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID)
		.off('click ' + sWindowsEventType)
		.addClass('disabled btndisabled')
		.attr('disabled', true);
};

Assessment.init = function(model) {
	var oSelf = this,
		sAssessmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oItemSlides = {},
		oStudentAttemptData = {};
	
    oSelf.model = model;
	
    oSelf.render();
	AssigmentSlides.studentAttemptData = ((oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) != null? oStudentAttemptData: {});
	AssigmentSlides.studentAttemptData['itemId'] = sAssessmentId;
	AssigmentSlides.studentAttemptData['submitStatus'] = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
	AssigmentSlides.studentAttemptData['reAssignedStatus'] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.studentAttemptData['itemType'] = ASSIGNMENTS.c_s_ASSESSMENT;
	
	AssigmentSlides.studentAttemptSummary = {};
	
	if (typeof AssigmentSlides.studentAttemptData['itemSlides'] == 'undefined') {
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': 'none',
			'click-to-hide': false,
			'opacity': 0.5
		});
		setTimeout(function () {
			for (iSlideIndex in oSelf.model) {
				if (
					(
						oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE &&
						typeof oSelf.model[iSlideIndex].questions != 'undefined' &&
						oSelf.model[iSlideIndex].questions != null
					) ||
					(
						oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE &&
						typeof oSelf.model[iSlideIndex].multi_slide.questions != 'undefined' &&
						oSelf.model[iSlideIndex].multi_slide.questions != null
					)
				) {
					var questions = null,
						oItemSlideData = {
							'slideID': oSelf.model[iSlideIndex]._id,
							'slideType': oSelf.model[iSlideIndex].type,
							'slideAttempt': 1,
							'slideIsCorrect': GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
							'slideScore': 0,
							'slideInputData': {}
						},
						oSlide = $('.swiper-slide').eq(iSlideIndex - 1);
					
					if (oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE) {
						questions = oSelf.model[iSlideIndex].questions;
					}
					else {
						questions = oSelf.model[iSlideIndex].multi_slide.questions;
					}

					for (qIndex in questions) {
						var iAnswerIndex = -1,
							aSuppliedAnswers = questions[qIndex].answers,
							sQuestionId = questions[qIndex]['question_id'],
							bCorrectness = false;
							
						bCorrectness = false;
						iAnswerIndex = -1;
						for (var iAIndex = 0; iAIndex < aSuppliedAnswers.length; iAIndex++) {
							if ($('#' + sQuestionId + '-' + iAIndex).hasClass('active')) {
								bCorrectness = $('#' + sQuestionId + '-' + iAIndex).data('is-correct') === true;
								iAnswerIndex = iAIndex;
								break;
							}
						}
							
						oItemSlideData['slideInputData'][sQuestionId] = {
							'answerIndex': iAnswerIndex,
							'correctness': bCorrectness
						};
						
						if (oItemSlideData['slideInputData'][sQuestionId]['correctness'] === true) {
							oItemSlideData['slideScore']++;
						}
					}
					oItemSlides[iSlideIndex] = oItemSlideData;
				}
			}
			AssigmentSlides.studentAttemptData['itemSlides'] = oItemSlides;
			oUtility.hideLoader();
			AssigmentSlides.setStatusToINPROGRESS(sAssessmentId); // To set in progress state
		}, 2000);
	}
	else {
		AssigmentSlides.setStatusToINPROGRESS(sAssessmentId); // To set in progress state
	}
	
    oSelf.bindEvents();
    oSelf.resize();
    
    /*==== Sprint 6 => Assessment should have Back button ====*/
    // $('#' + ASSIGNMENTS.c_s_PREV).hide();
	/*== End Sprint 6 => Assessment should have Back button ==*/
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_ASSESSMENT);
	}
};

/*== check slide visibility ==*/
Assessment.displayAssessmentSlide = function(exclusiveToIlit20){
		if(exclusiveToIlit20){
			if((AssignmentsView.productCode || '').startsWith("ilit20") ){
				return true;
			}	
			return false;
		}
		return true;	
};

/*== function to handle audio player ==*/
Assessment.audioPlayerHandler = function(obj, elem, restrictPlay){

	var iCurSlideIdx = elem.attr("data-slide-idx"),
			oElemPlayer = elem.siblings("#player_"+iCurSlideIdx),
			iPlayCounter = 0;
		
		if(elem.hasClass("playing")){
			oElemPlayer.trigger("pause");
			
		}
		else{
			//fix for IPP-6449 
			$(".playPauseButton.playing").each(function(){
				
				var audioPlayer = $(this).siblings("audio");
				audioPlayer.trigger("pause");
				//audioPlayer[0].currentTime = 0;
				$(this).removeClass("playing");
				
			})  
			//end
			oElemPlayer.trigger("play");
			
		}
		elem.toggleClass('playing');
	
		oElemPlayer.on("ended", function(){
		
			oElemPlayer.currentTime = 0;
			iPlayCounter++;
			obj.playCounter[iCurSlideIdx] = iPlayCounter;
			if(obj.playCounter[iCurSlideIdx] == obj.maxPlayCount){
				//do something when max play count is reached.
				
				if(restrictPlay){
					$(this).siblings(".playPauseButton").hide();
				}
				//$(this).hide();
			}
			$(this).siblings(".playPauseButton").removeClass('playing');
		})
};


Assessment.render = function() {
	var oSelf = this,
		cnt = 1,
		sAssessmentType = AssignmentsView.slideDataValue.split('___').last(),
		sAddlClasses = (
			(
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE ||
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_UNITBENCHMARK || 
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_WRC
			)?
			' btndisabled disabled':
			''
		),
		sAddlProp = (
			(
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE ||
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_UNITBENCHMARK || 
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_WRC
			)?
			' disabled="disabled"':
			''
		),
		paginationHtml = (AssignmentsView.productCode || '').startsWith("ilit20") && objAssignmentSlidesJsonData["isAutoCompleteGradeAssessment"] == 1 ? 
			'<div class="pagination_footer pagination_footer_part assign_teacherview" style="text-align:right;">\
			' + ASSIGNMENTS.c_s_ENTER_CORRECT_ANSWER_TXT + '\
			<input id="inputCorrectAnswers" type="number" min="0" style="width:50px;height:25px;font-size:18px;color:#111;"></input>\
			' + ASSIGNMENTS.c_s_OUT_OF_SCORE +'<span class="out-of-score"></span>&nbsp;' +			
			'<button id="' + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID + '" class="button7 btn right' + sAddlClasses + '"' + sAddlProp + '>\
				' + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN + '\
			</button>\
			<button id="submitCorrectAns" class="button7 btn right">Submit</button>\
			<div class="clear"></div>\
			</div>' : 
			'<div class="pagination_footer pagination_footer_part assign_teacherview">'+						
			'<button id="' + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID + '" class="button7 btn right' + sAddlClasses + '"' + sAddlProp + '>\
				' + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN + 
			'</button>' +			
			'<div class="clear"></div>\
			</div>',
		headerTabHtml = '<div class="table_tabs middle">\
			<button class="left_arrow sprite btn" id="prevPagingBtn" ></button>\
			<button class="right_arrow sprite btn" id="nextPagingBtn"></button>\
			<div class="table_tabs_middlearea">\
				<div class="assessment-header-slider">';
			
	$(".swiper-container").prepend('<div class="assessment_bench_mark"></div>');
	var iQuestionIndex = 1;
	$GLOBALS.unset('QuestionIndex');
	
	$GLOBALS.set('QuestionIndex', iQuestionIndex);
	
	/*== start Grade intro animation tab ==*/
	
	 if(
		oSelf.displayAssessmentSlide((typeof AssigmentSlides.model[0].intro_animation_exclusive_ilit20 != 'undefined') ? AssigmentSlides.model[0].intro_animation_exclusive_ilit20 : false) && 
		AssigmentSlides.model[0].intro_animation &&
	    objAssignmentSlidesJsonData.content.assignmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE
	){	
		var sIntroTab = '<div title="Intro animation" id="btn_slide_index_' + (cnt - 1) + '" class="part_btn part_tabs ellipsis' + ((cnt == 1)? ' active first_tab': '') + '"> Intro \
		</div>';
		headerTabHtml += sIntroTab;
		try{
			GradeIntroAnimationView.init(cnt, AssigmentSlides.model);
		}
		catch(oException){
		
		}
		cnt++;
	}
	
	/*== end Grade intro animation tab ==*/
	
	var iPartID = 1;
	$.each(oSelf.model, function(idx, val) {
		
		if (typeof val.metadata == 'undefined') {
			
			var tabTitle = (typeof val.page_title != 'undefined' &&(val.page_title)) ? val.page_title : ASSIGNMENTS.c_s_ASSESSMENT_PART + ' ' + iPartID;
			
			if(oSelf.displayAssessmentSlide((typeof val.exclusive_to_ilit20 != 'undefined') ? val.exclusive_to_ilit20 : false)){
				headerTabHtml += '<div title="'+tabTitle+'" id="btn_slide_index_' + (cnt - 1) + '" class="part_btn part_tabs ellipsis' + ((cnt == 1)? ' active first_tab': '') + '">\
					' + tabTitle + '\
				</div>';
				
			}
			switch (val.type) {
				case ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE:
					if(oSelf.displayAssessmentSlide((typeof val.exclusive_to_ilit20 != 'undefined') ? val.exclusive_to_ilit20 : false)){
						try {
							MultipleChoiceView.init(idx, val);
						}
						/*
						catch (oException if oException instanceof TypeError) {
							
						}
						*/
						catch (oException) {
							
						}
					}
					break;
					
				case ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE:
					if(oSelf.displayAssessmentSlide((typeof val.exclusive_to_ilit20 != 'undefined') ? val.exclusive_to_ilit20 : false)){
						try {
							MultiChoicePassagesView.init(idx, val);
						}
						/*
						catch (oException if oException instanceof TypeError) {
							
						}
						*/
						catch (oException) {
							
						}
					}
					break;
					
				default:
					break;
			}
			
		}
		else{
			var page_title_chk = _.where(val.metadata, {key: "page_title"}),
				page_title = (page_title_chk.length)?page_title_chk[0].keyValue:'',
				tabTitle = (page_title != '') ? page_title : ASSIGNMENTS.c_s_ASSESSMENT_PART + ' ' + iPartID;
		
			if(oSelf.displayAssessmentSlide(val.exclusive_to_ilit20)){
			
				headerTabHtml += '<div title="'+tabTitle+'" id="btn_slide_index_' + (cnt - 1) + '" class="part_btn part_tabs ellipsis' + ((cnt == 1)? ' active first_tab': '') + '">\
					' + tabTitle + '\
				</div>';
				
			}
			switch(_.where(val.metadata, {key: "type"})[0].keyValue){
				
				case ASSIGNMENTS.c_s_TYPE_TPL_PROJECTOR_SLIDE:
	
					if(oSelf.displayAssessmentSlide((typeof val.exclusive_to_ilit20 != 'undefined') ? val.exclusive_to_ilit20 : false)){
						try {
							ProjectorSlideView.init(idx, val);
						}
						catch (oException) {
							
						}
					}
					break;
				
				case ASSIGNMENTS.c_s_TYPE_TPL_TEXT_SLIDE:
				
					if(oSelf.displayAssessmentSlide((typeof val.exclusive_to_ilit20 != 'undefined') ? val.exclusive_to_ilit20 : false)){
						try {
							TextSlideView.init(idx, val);
						}
						catch (oException) {
							
						}
					}
					break;
				
				default:
					break;
			}
		}
		cnt++;
		iPartID++;
    });

    headerTabHtml += '</div>\
			</div>\
		</div>\
		<div class="clear"></div>';
    $('.pagination').addClass('assessment_pagination');
	$('.assessment_bench_mark').html(headerTabHtml);
    $('.pagination').html(paginationHtml);
	
	if (
		sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE ||
		sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_UNITBENCHMARK || 
		sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_WRC		
	) {
		if (oStudentAttempt = AssigmentSlides.getStudentAttemptForGradableItem()) {
			if (
				typeof oStudentAttempt['itemSlides'] == 'object' &&
				oStudentAttempt['itemSlides'] != null
			) {
				var iAnsweredQuestions = 0;
				for (var iSlideId in oStudentAttempt['itemSlides']) {
					if (
						typeof oStudentAttempt['itemSlides'][iSlideId]['slideInputData'] == 'object' &&
						oStudentAttempt['itemSlides'][iSlideId]['slideInputData'] != null
					) {
						for (var sQuestionId in oStudentAttempt['itemSlides'][iSlideId]['slideInputData']) {
							if (
								typeof oStudentAttempt['itemSlides'][iSlideId]['slideInputData'][sQuestionId]['answerIndex'] == 'number' &&
								!isNaN(oStudentAttempt['itemSlides'][iSlideId]['slideInputData'][sQuestionId]['answerIndex']) &&
								oStudentAttempt['itemSlides'][iSlideId]['slideInputData'][sQuestionId]['answerIndex'] > -1
							) {
								iAnsweredQuestions++;
							}
						}
					}
				}
				if (iAnsweredQuestions == $('ul.multiple_choice_ul > li').filterByData('is-correct', true).length) {
					$('#' + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID).removeClass('btndisabled disabled').attr('disabled', false);
				}
			}
		}
	}
	
	jQuery('#prevPagingBtn').hide();
	if (jQuery('[id^="btn_slide_index_"]').length < 2) {
		jQuery('#nextPagingBtn').hide();
	}
	
	if (
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
	) {
		/*==== IPP-2455 ====*/
		var sButtonHtml = '<button id="' + ASSIGNMENTS.c_s_VIEW_ASSESSMENT_SKILLS_BTTN_ID + '" type="button" class="button9 right" style="display:none;">\
			View Skills\
		</button>\
		<button id="' + ASSIGNMENTS.c_s_VIEW_ASSESSMENT_ANSWERS_BTTN_ID + '" type="button" class="button9 right">\
			View Answers\
		</button>';
		/*== End IPP-2455 ==*/
		AssignmentsView.prev.after(sButtonHtml);
	}
	// Assessment.iTotalCorrectAnswers = $('ul.multiple_choice_ul > li').filterByData('is-correct', true).length;
	/*==== IPP-2724 ====*/
	Assessment.iTotalCorrectAnswers = $('ul.multiple_choice_ul').length;
	$(".out-of-score").text(Assessment.iTotalCorrectAnswers);
	/*== End IPP-2724 ==*/
	AssignmentsView.hideMainLoader();
};
Assessment.selectAll = function (bIsSubmitted) {
	$('#slide_container').find('li').filterByData('is-correct', true).addClass('active');
};
Assessment.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sAssessmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oItemSlides = {},
		iDOMSlideId = 0,
		iDOMQuestionId = 0,
		iCorrectAnswers = 0,
		iTotalScore = 0,
		bAttemptedAll = true,
		iScoreObtained = 0,
		fOnSaveCompleteCallback = function () {
			/*==== Manage Controls ====*/
			$('ul.multiple_choice_ul > li').off('click tap ' + sWindowsEventType);
			$("#" + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID)
				.off('click tap ' + sWindowsEventType)
				.attr('disabled', true)
				.addClass('disabled btndisabled');
			
			AssignmentsView.prev
				.addClass(ASSIGNMENTS.c_s_DONE_CLASS)
					.filter('.ios')
						.html(' <span class="sprite"></span>' + 'Exit'.pad('&nbsp;', 5, -1));
			
			$('[class*="correct"]').filterByData('to-show', true).show();
			$('.new_assignment_title')
				.filterByData('to-swell', true)
					.css({ 'padding':	'10px 50px 0 10px' });
			/*== End Manage Controls ==*/
			
			/*==== Display Score ====*/
			$('.assessment_pagination')
				.css({'text-align': 'left'})
				.html(
					'<div class="score_text_container">\
						<strong>\
							' + $('#' + ASSIGNMENTS.c_s_HEADER).text() + ': ' + iScoreObtained + ASSIGNMENTS.c_s_OUT_OF_TXT + iTotalScore + '\
						</strong>\
						<br />\
						<small>' + ASSIGNMENTS.c_s_ASSESSMENT_COMPLETED_STATUS + '</small>\
					</div>\
					<div class="clear"></div>'
				)
				.addClass('show_score');
			/*== End Display Score ==*/
		};
		
	if (typeof bIsSubmitted == 'undefined' || bIsSubmitted == null) {
		bIsSubmitted = false;
	}
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		if ((AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem(sAssessmentId)) == null) {
			AssigmentSlides.studentAttemptData = {};
		}
	}
		
	for (var iSlideIndex in oSelf.model) {
		oSlide = $('#' + AssigmentSlides.referenceKey + '___' + iSlideIndex);
		if (
			(
				oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE &&
				typeof oSelf.model[iSlideIndex].questions != 'undefined' &&
				oSelf.model[iSlideIndex].questions != null
			) ||
			(
				oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE &&
				typeof oSelf.model[iSlideIndex].multi_slide.questions != 'undefined' &&
				oSelf.model[iSlideIndex].multi_slide.questions != null
			)
		) {

            var questions = null;
            if (oSelf.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE) {
                questions = oSelf.model[iSlideIndex].questions;
            }
			else {
                questions = oSelf.model[iSlideIndex].multi_slide.questions;
            }
            var oItemSlideData = {
				"slideID": iSlideIndex,
				"slideType": oSelf.model[iSlideIndex].type,
				"slideAttempt": 1,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": 0,
				"slideInputData": {}
			}
            
			iDOMQuestionId = 0;
            for (qIndex in questions) {
                var oMultipleChoiceSlide = oSlide.find('.multiple_choice_ul').eq(iDOMQuestionId++),
					oQuestionHeader = oMultipleChoiceSlide.find('li').parent().parent().prev('.new_assignment_title'),
					iAnswerIndex = oMultipleChoiceSlide.find('li').index(oMultipleChoiceSlide.find('li.active')),
					aSuppliedAnswers = questions[qIndex].answers,
					sQuestionId = questions[qIndex]['question_id'],
					bCorrectness = false;
					
				bCorrectness = false;
				iAnswerIndex = -1;
				for (var iAIndex = 0; iAIndex < aSuppliedAnswers.length; iAIndex++) {
					if ($('#' + sQuestionId + '-' + iAIndex).hasClass('active')) {
						bCorrectness = $('#' + sQuestionId + '-' + iAIndex).data('is-correct') === true;
						iAnswerIndex = iAIndex;
						break;
					}
				}
					
				if (bCorrectness !== true) {
					bCorrectness = false;
					if (iAnswerIndex == -1) {
						bAttemptedAll = false;
					}
				}
				else {
					oItemSlideData['slideScore']++;
					iCorrectAnswers++;
				}
				
				oItemSlideData.slideInputData[questions[qIndex].question_id] = {
					'answerIndex': iAnswerIndex,
					'correctness': bCorrectness
				};
				
				if (bIsSubmitted === true) { // Submit button clicked
					oQuestionHeader.find('[class*="correct"]').hide();
					oQuestionHeader.find('.' + (bCorrectness !== true? 'in': '') + 'correct').data('to-show', true);
					oQuestionHeader.data('to-swell', true);
				}
				iTotalScore += oSelf.weightPerQuestion;
            }
			oItemSlides[iSlideIndex] = oItemSlideData;
        }
    }
	if (typeof AssigmentSlides.studentAttemptData['itemSlides'] == 'undefined') {
		AssigmentSlides.studentAttemptData['itemSlides'] = {};
	}
	
	AssigmentSlides.studentAttemptData['itemId'] = sAssessmentId;
	AssigmentSlides.studentAttemptData['itemSlides'] = oItemSlides;
	AssigmentSlides.studentAttemptData['submitStatus'] = ASSIGNMENTS['c_s_' + ((bIsSubmitted === true)? '': 'IN') + 'COMPLETED_STATUS'];
	AssigmentSlides.studentAttemptData['reAssignedStatus'] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.studentAttemptData['itemType'] = ASSIGNMENTS.c_s_ASSESSMENT;
	
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = ASSIGNMENTS['c_s_INCOMPLETED_STATUS'];
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		$('[class*="correct"]').filterByData('to-show', true).show();
		$('.new_assignment_title')
			.filterByData('to-swell', true)
				.css({ 'padding':	'10px 50px 0 10px' });
		/*== End Manage Controls ==*/
		
		/*==== Display Score ====*/
		$('.assessment_pagination')
			.css({'text-align': 'left'})
			.html(
				'<div class="score_text_container">\
					<strong>\
						' + $('#' + ASSIGNMENTS.c_s_HEADER).text() + ': ' + AssigmentSlides.systemScore + ASSIGNMENTS.c_s_OUT_OF_TXT + iTotalScore + '\
					</strong>\
					<br />\
					<small>' + ASSIGNMENTS.c_s_ASSESSMENT_COMPLETED_STATUS_FOR_VIEW + '</small>\
				</div>\
				<div class="clear"></div>'
			)
			.addClass('show_score');
		/*== End Display Score ==*/
		
		AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS); // IPP-5155
		return;
	}
	
	if (bIsSubmitted === true) { // Submit button clicked
		var sConfirmTitle = 'Are you sure?'
			sConfirmBody = 'Are you sure you want to submit?';  // ILIT-759
		
		if (bAttemptedAll === false) {
			sConfirmTitle = ASSIGNMENTS.c_s_ASSESSMENT_NOTATTEMPTEDALL_TITLE;
			sConfirmBody = ASSIGNMENTS.c_s_ASSESSMENT_NOTATTEMPTEDALL_BODY;
		}
		/*==== IPP-526 ====*/
		oSelf._confirm({
			'title':	sConfirmTitle,
			'divId':	'dialog-message',
			'message':	sConfirmBody,
			'yes':		function () {
				AssigmentSlides.finalScore = AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
				AssigmentSlides.itemComplete = ASSIGNMENTS['c_s_COMPLETED_STATUS'];
				iScoreObtained = AssigmentSlides.finalScore;
				
				if (AssignmentsView.slideDataValue.split('___').last() == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE) {
					oSelf.computeGradeScore(fOnSaveCompleteCallback);
				}
				else {
					/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
					AssigmentSlides.studentAttemptSummary = {};
					AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
					AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
					
					for (var iSlideIndex in AssigmentSlides.studentAttemptData['itemSlides']) {
						var oSlideInputData = AssigmentSlides.studentAttemptData['itemSlides'][iSlideIndex].slideInputData;
						
						for (var sQuestionId in oSlideInputData) {
							var oQuestionInfo = oSlideInputData[sQuestionId];
							AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
								JSON.parse('{\
									"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
									"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + ((oQuestionInfo.correctness == true)? parseFloat(oSelf.weightPerQuestion): 0) + '\
								}')
							);
						}
					}
					/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
					AssigmentSlides.setAttemptData(0, fOnSaveCompleteCallback);
				}
			}
		});
		/*== End IPP-526 ==*/
		
		/*== fix for IPP-6464 ==*/
		GradeIntroAnimationView.stopIntroVideo();
		/*== end fix for IPP-6464 ==*/
	}
};

Assessment.attemptCorrectAnswers = function (oSelf) {
	var oLi = $("#slide_inner_container li[data-is-correct='true']"),
		oLiAll = $("#slide_inner_container li"),
		i = 0,
		iNum = $("#inputCorrectAnswers").val();	

	if ($(this).hasClass("disabled")) {
		return;
	}
	
	oLiAll.removeClass("active");
	
	oLi.each(function () {
		if (i < iNum) {
			$(this).addClass("active");
		}
		else {
			$(this).prev().length ? $(this).prev().addClass("active") : $(this).next().addClass("active");
		}
		i++;
	});
	//$("#submitCorrectAns").addClass("disabled");
	$("#submit_assessment").removeClass("btndisabled disabled").removeAttr("disabled");
	
	oSelf.updateAttemptData();
}

Assessment._confirm = ISeriesBase.prototype._confirm;
Assessment.bindEvents = function() {
	var oSelf = this;
    $('ul.multiple_choice_ul > li')
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function() {
			var sAssessmentType = AssignmentsView.slideDataValue.split('___').last();
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			/*==== Submit button should be disabled while any question remains unanswered ====*/
			if (
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE ||
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_UNITBENCHMARK ||
				sAssessmentType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_WRC
			) {
				var bAnsweredAll = (
						Assessment.iTotalCorrectAnswers == $('ul.multiple_choice_ul > li').filter('.active').length
					),
					sAction = (bAnsweredAll === false? 'add': 'remove') + 'Class',
					aDisabledClasses = ['btndisabled', 'disabled'];
				
				$("#" + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID)[sAction](aDisabledClasses.join(' '));
				$("#" + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID).attr('disabled', (bAnsweredAll === false));
			}
			/*== End Submit button should be disabled while any question remains unanswered ==*/
			oSelf.updateAttemptData();
		});

    $("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
    
    $("#" + ASSIGNMENTS.c_s_SUBMIT_TEST_BTTN_ID).off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
		oSelf.updateAttemptData(true); // bIsSubmitted = true
    });
	
	$("#inputCorrectAnswers").off('keyup input').on('keyup input', function() {
		$("#submit_assessment").addClass("btndisabled disabled").attr("disabled",true);
    });
	
	$("#submitCorrectAns").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
		oSelf.attemptCorrectAnswers.call(this, oSelf);
    });
    
    /*==== Tab Heads should be clickable ====*/
	$('[id^="btn_slide_index_"]')
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
		
			var aSlides = $('[id^="' + AssigmentSlides.referenceKey + '"]'),
				aTabHeads = $('[id^="btn_slide_index_"]'),
				oCurrentSlide = $(this),
				oActiveSlide = aSlides.filter('.swiper-slide-visible'),
				iActiveSlideIndex = aSlides.index(oActiveSlide),
				iCurrentSlideIndex = aTabHeads.index(oCurrentSlide);
			
			if (iCurrentSlideIndex != iActiveSlideIndex) {
				AssigmentSlides.slidingEngine.swipeTo(iCurrentSlideIndex);
			}
		});
	/*== End Tab Heads should be clickable ==*/
	
	/*==== IPP-2455 ====*/
	$('#' + ASSIGNMENTS.c_s_VIEW_ASSESSMENT_ANSWERS_BTTN_ID)
		.off('click tap')
		.on('click tap', function () {
			var bIsActive = $(this).hasClass('active');
			$(this).toggleClass('active');
			if (oPlatform.isIOS() || oPlatform.isAndroid()) {
				if (bIsActive === true) {
					$(this).css({
						'background':	'none',
						'color':		'#FFFFFF'
					});
				}
				else {
					$(this).css({
						'background':	'#FFFFFF',
						'color':		'#000000'
					});
				}
			}
			$('[id^="' + AssignmentsView.slideDataValue + '"] li').filterByData('is-correct', true).find('.correct')[(bIsActive === true)? 'hide': 'show']();
		});
	/*== End IPP-2455 ==*/
	
	/*==== IPP-2456 ====*/
	$('#' + ASSIGNMENTS.c_s_VIEW_ASSESSMENT_SKILLS_BTTN_ID)
		.off('click tap')
		.on('click tap', function () {
			if ($(this).hasClass('active')) {
				$('[id^="' + AssignmentsView.slideDataValue + '"]').find('li').filterByData('is-correct', true).find('.correct').hide();
				$('.assignment_report_box').hide();
				$(this).removeClass('active');
				if (oPlatform.isIOS() || oPlatform.isAndroid()) {
					$(this).css({
						'background':	'none',
						'color':		'#FFFFFF'
					});
				}
			}
			else {
				$('[id^="' + AssignmentsView.slideDataValue + '"]').find('li').filterByData('is-correct', true).find('.correct').show();
				$('.assignment_report_box').show();
				$(this).addClass('active');
				if (oPlatform.isIOS() || oPlatform.isAndroid()) {
					$(this).css({
						'background':	'#FFFFFF',
						'color':		'#000000'
					});
				}
			}
		});
	/*== End IPP-2456 ==*/
};

Assessment.resize = function() {
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	
	var slide_container_height = window_height - header;
	$('#slide_container').height(slide_container_height);
	
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var swiper_container_height = slide_container_height - assessment_footer;
	$('.swiper-container').height(swiper_container_height);
	
	//var assessment_tab_header_height = $('.assessment_bench_mark').outerHeight();
	/*== adjustment made to discard the extra height that is coming from half loaded assessment_bench_mark ==*/
	var adjustment = 55;
	var assessment_tab_header_height = $('.part_tabs').eq(0).outerHeight()+parseInt($('.assessment_bench_mark').css("padding-top")) + adjustment; 
	
	var slide_inner_container_height = swiper_container_height - assessment_tab_header_height;
	
	
	// Start - Resize for multiple-choice-type
	$('#slide_inner_container').height(slide_inner_container_height);
	
	//for resize grade intro animation video
	//$(".grade_animation_video_wrapper").css("padding-top",$(".study_plain_title").outerHeight()+"px" );
	var video_container_height = slide_inner_container_height - (
		parseInt($(".question_box_space").css("padding-top")) +
		parseInt($(".question_box_space").css("padding-bottom")) +
		parseInt($(".new_assignment_irr").css("padding-top")) +
		parseInt($(".new_assignment_irr").css("padding-bottom")) +
		parseInt($(".grade_animation_video_wrapper").css("padding-top"))
	)
	$(".video_container").height(video_container_height - parseInt($(".grade_animation_video_wrapper").css("padding-top")));
	$(".video_container").css("width", "100%");
	$("#slide_inner_container .swiper-slide").css({width:"1360px"});
	//end for resize grade intro animation video
	
	var study_plain_title_height = $('.study_plain_title').outerHeight();
	var multiple_choice_questions_container_padding_margin = parseInt($('.multiple_choice_questions_container').css("padding-top")) + parseInt($('.multiple_choice_questions_container').css("padding-bottom")) + parseInt($('.multiple_choice_questions_container').css("margin-top")) + parseInt($('.multiple_choice_questions_container').css("margin-bottom"));
	
	var multiple_choice_questions_container_height = slide_inner_container_height - (study_plain_title_height + multiple_choice_questions_container_padding_margin);
	$('.multiple_choice_questions_container').height(multiple_choice_questions_container_height);
    $('.multiple_choice_questions_container').find('.natural_box_space:first').removeClass('margin_top');
    $('.multiple_choice_questions_container').find('.natural_box_space:last').css('margin-bottom', '-10px');
	// End - Resize for multiple-choice-type
	
	// Start - Resize for multiple-passages-choice-type
	$('.multiple_choice_questions').height(slide_inner_container_height);
	$('.multiple_choice_questions > .slider_swiper_inner').height(slide_inner_container_height);
	
	var passage_slide_padding_padding = parseInt($('.passage_slide_padding').css("padding-top")) + parseInt($('.passage_slide_padding').css("padding-bottom"));
	var passage_slide_padding_height = slide_inner_container_height - (study_plain_title_height + passage_slide_padding_padding)
	$('.passage_slide_padding').height(passage_slide_padding_height);
	$('.vocabillery_view_page').height(passage_slide_padding_height);
	
	var vocabillery_view_page_content_padding = parseInt($('.vocabillery_view_page_content').css("padding-top")) + parseInt($('.vocabillery_view_page_content').css("padding-bottom")) + parseInt($('.vocabillery_view_page_content').css("margin-bottom"));
	var vocabillery_view_page_content_height = passage_slide_padding_height - vocabillery_view_page_content_padding;
	$('.vocabillery_view_page_content').height(vocabillery_view_page_content_height);
	
	var study_plan_practice_ques_container_margin  = parseInt($('.study_plan_practice_ques_container').css("margin-bottom"));
	var study_plan_practice_ques_container_height  = vocabillery_view_page_content_height - study_plan_practice_ques_container_margin;
	$('.study_plan_practice_ques_container').height(study_plan_practice_ques_container_height);
	
	var natural_box_space_right_group_margin = parseInt($('.natural_box_space_right_group').css("margin-bottom"));
	var natural_box_space_right_group_height = passage_slide_padding_height - natural_box_space_right_group_margin;
	$('.natural_box_space_right_group').height(natural_box_space_right_group_height);
	$('.natural_box_space_right_group').find('.question_box_space:last').css('margin-bottom', '0px');
	// End - Resize for multiple-passages-choice-type
	
	
	/*==== Adjust Tab-head width ====*/
	var dTabHeadWidth = 0,
		dTabHeadVisibleWidth = 0,
		dTabContainerWidth = jQuery(window).width() - 40 - 40 - 8; //(8px adjustment)
		
	oSelf.iFirstVisibleTabHead = 0;
	oSelf.iLastVisibleTabHead = 0;
	oSelf.aMargins = [];
	
	$('.assignment_slider_wrapper .assessment-header-slider > .part_tabs').each(function (iTabHeadIdx) {
		var dWidth = jQuery(this).width(),
			aCSSProps = [
				'padding-left', 'padding-right',
				'margin-right', 'margin-left',
				'border-right-width', 'border-left-width'
			];
		
		for (var iProp = 0; iProp < aCSSProps.length; iProp++) {
			if (iPropVal = jQuery(this).css(aCSSProps[iProp]).replace('px', '')) {
				dWidth = dWidth + parseInt(iPropVal);
			}
		}
		dTabHeadWidth += dWidth;
		if (dTabHeadWidth < dTabContainerWidth) {
			oSelf.iLastVisibleTabHead = iTabHeadIdx;
			dTabHeadVisibleWidth += dWidth;
		}
	});
	$('.assignment_slider_wrapper .assessment-header-slider').width(dTabHeadWidth);
	$('.table_tabs_middlearea').css({
		'width':	dTabHeadVisibleWidth + 'px',
		'margin':	'0 auto'
	});
	/*== End Adjust Tab-head width ==*/
}

Assessment.submitAnswer = function() {
    /**
     * assessments submit answers:
     *   -> to check whether an user missed one question
     *   -> if checked all -> show what's wrong and what's right
     *   -> else -> Ask to answer all unanswered questions
     *           -> Slide to the first unanswered question
     */
    
    var iCorrectAnswers = 0,
		iTotalQuestions = 0,
		bAttemptedAll = true,
		iDOMSlideId = 0,
		iDOMQuestionId = 0,
		sAssessmentId = AssigmentSlides.referenceKey.split('___').fetch(1);
		
	if (
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		AssigmentSlides.studentAttemptData == null
	) {
		AssigmentSlides.studentAttemptData['itemId'] = sAssessmentId;
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
		AssigmentSlides.studentAttemptData['submitStatus'] = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
		AssigmentSlides.studentAttemptData['reAssignedStatus'] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptData['itemType'] = ASSIGNMENTS.c_s_ASSESSMENT;
	}
		
    for (iSlideIndex in Assessment.model) {
        slide = $('.swiper-slide').eq(iDOMSlideId++);
        if (
			(
				Assessment.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE &&
				typeof Assessment.model[iSlideIndex].questions != 'undefined' &&
				Assessment.model[iSlideIndex].questions != null
			) ||
			(
				Assessment.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE &&
				typeof Assessment.model[iSlideIndex].multi_slide.questions != 'undefined' &&
				Assessment.model[iSlideIndex].multi_slide.questions != null
			)
		) {

            var questions = null;
            if (Assessment.model[iSlideIndex].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE) {
                questions = Assessment.model[iSlideIndex].questions;
            }
			else {
                questions = Assessment.model[iSlideIndex].multi_slide.questions;
            }
			
			try {
				AssigmentSlides.studentAttemptData.itemSlides[iDOMSlideId].slideScore = 0;
			}
			catch (oException) {
			}
            
			iDOMQuestionId = 0;
            for (sQIndex in questions) {
                var multipleChoice = slide.find('.multiple_choice_ul').eq(iDOMQuestionId++);
                if (multipleChoice.find('li.active').data('is-correct')) {
                    iCorrectAnswers += 1;
                    try {
						AssigmentSlides.studentAttemptData.itemSlides[iDOMSlideId].slideScore += 1;
					}
					catch (oException) {
					}
                }
                
                var iAnswerIndex = multipleChoice.find('li').index(multipleChoice.find('li.active'));
				/*==== Give student warning on submitting incomplete form ====*/
				if (iAnswerIndex == -1) {
					bAttemptedAll = false;
				}
				/*==== Give student warning on submitting incomplete form ====*/
				iTotalQuestions++;
            }
        }
    }
    if (bAttemptedAll === false) {
		this._confirm({
			'title':	'Are you sure?',
			'divId':	'dialog-message',
			'message':	'You&rsquo;ve not attempted all the questions.<br />Are you sure to submit?',
			'yes':		function () {
				jQuery('.assessment_pagination')
					.css({'text-align': 'left'})
					.html(
						'<div class="score_text_container">\
							<strong>\
								' + jQuery('#' + ASSIGNMENTS.c_s_HEADER).text() + ': ' + iCorrectAnswers + ASSIGNMENTS.c_s_OUT_OF_TXT + iTotalQuestions + '\
							</strong>\
							<br />\
							<small>' + ASSIGNMENTS.c_s_ASSESSMENT_COMPLETED_STATUS + '</small>\
						</div>\
						<div class="clear"></div>'
					)
					.addClass('show_score');
				$('ul.multiple_choice_ul > li').off('click ' + sWindowsEventType);
				$('#' + ASSIGNMENTS.c_s_PREV).addClass(ASSIGNMENTS.c_s_DONE_CLASS).show();
			}
		});
		return false;
	}
	
	AssigmentSlides.studentAttemptData['submitStatus'] = ASSIGNMENTS.c_s_COMPLETED_STATUS;
    $('.assessment_pagination')
		.css({'text-align': 'left'})
		.html(
			'<div class="score_text_container">\
				<strong>\
					' + jQuery('#' + ASSIGNMENTS.c_s_HEADER).text() + ': ' + iCorrectAnswers + ASSIGNMENTS.c_s_OUT_OF_TXT + iTotalQuestions + '\
				</strong>\
				<br />\
				<small>' + ASSIGNMENTS.c_s_ASSESSMENT_COMPLETED_STATUS + '</small>\
			</div>\
			<div class="clear"></div>'
		)
		.addClass('show_score');
    $('ul.multiple_choice_ul > li').off('click ' + sWindowsEventType);
    
    // to show the done button on left top corner
    $('#' + ASSIGNMENTS.c_s_PREV).addClass(ASSIGNMENTS.c_s_DONE_CLASS).show();
};

Assessment.computeGradeScore = function (pfCallback) {
	var oSelf = this,
		getScoreRecord = function () {
			return eval('({' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_STANINE + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_PERCENTILE + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_STANDARD_SCORE + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_NORMAL_CURVE_EQUIVALENT + '": 0,' +
				'"' + ASSIGNMENTS.c_s_ASSESSMENT_GROWTH_SCALE_VALUE + '": 0,' +
			'})');
		},
		sGradeAssessmentPrefix = 'grade-assessment-',
		oStudentAttemptSummary = {};
		
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_SENTENCE_COMPREHENSION] = getScoreRecord();
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_PASSAGE_COMPREHENSION] = getScoreRecord();
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_COMPREHENSION_COMPOSITE] = getScoreRecord();
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_VOCABULARY] = getScoreRecord();
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST] = getScoreRecord();
	oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_LISTENING_COMPREHENSION] = getScoreRecord();
	if (typeof pfCallback !== 'function') { pfCallback = $.noop; }
	
	for (var iSlideId  in oSelf.model) {
		var oSlide = $('#' + AssignmentsView.slideDataValue + '___' + iSlideId),
			oPart = oSelf.model[iSlideId];
			
		if (typeof oPart['metadata'] !== 'undefined') { continue; }
		var sSubset = oPart.sub_type ? oPart.sub_type.replace('_','-') : oPart.page_title.replace(/[^A-Za-z0-9]/, '-').replace(/-+/, '-').toLowerCase();
	
		if (
			(
				oSelf.model[iSlideId].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE &&
				typeof oSelf.model[iSlideId].questions != 'undefined' &&
				oSelf.model[iSlideId].questions != null
			) ||
			(
				oSelf.model[iSlideId].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE &&
				typeof oSelf.model[iSlideId].multi_slide.questions != 'undefined' &&
				oSelf.model[iSlideId].multi_slide.questions != null
			)
		) {
			var oQuestions = oSelf.model[iSlideId].questions;
			if (
				oSelf.model[iSlideId].type == ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE &&
				typeof oSelf.model[iSlideId].multi_slide.questions != 'undefined' &&
				oSelf.model[iSlideId].multi_slide.questions != null
			) {
				oQuestions = oSelf.model[iSlideId].multi_slide.questions;
			}
			var oQuestion = null,
				sQuestionId = '',
				aAnswerOptions = [],
				bIsAnswerCorrect = false;
				
			for (var iQuestionId in oQuestions) {
				oQuestion = oQuestions[iQuestionId];
				
				sQuestionId = oQuestion['question_id'];
				aAnswerOptions = oSlide.find('.question_part').filterByData('question-id', sQuestionId).find('li');
				bIsAnswerCorrect = (
					(aAnswerOptions.length > 0) &&
					(aAnswerOptions.index(aAnswerOptions.filter('.active')) > -1) &&
					(aAnswerOptions.filter('.active').data('is-correct') === true)
				);
				
				switch (sGradeAssessmentPrefix + sSubset) {
					case ASSIGNMENTS.c_s_ASSESSMENT_SENTENCE_COMPREHENSION:
						if (bIsAnswerCorrect === true) {
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_SENTENCE_COMPREHENSION][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_COMPREHENSION_COMPOSITE][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
						}
						break;
					case ASSIGNMENTS.c_s_ASSESSMENT_VOCABULARY:
						if (bIsAnswerCorrect === true) {
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_VOCABULARY][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
						}
						break;
					case ASSIGNMENTS.c_s_ASSESSMENT_LISTENING_COMPREHENSION:
						if (bIsAnswerCorrect === true) {
							oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_LISTENING_COMPREHENSION][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
						}
						break;
					default:
						if (sSubset.startsWith(ASSIGNMENTS.c_s_ASSESSMENT_PASSAGE_COMPREHENSION.replace(sGradeAssessmentPrefix, ''))) {
							if (bIsAnswerCorrect === true) {
								oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_PASSAGE_COMPREHENSION][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
								oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_COMPREHENSION_COMPOSITE][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
								oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE]++;
							}
						}
				}
			}
		}
	}
	/*==== Compute Score from Raw Score ====*/
	loadJS(AssignmentsView.gradeScoreJSPath, function () {
		var sGradeAssessmentPrefix = 'grade-assessment-',
			sForm = ASSIGNMENTS.c_s_ASSESSMENT_FORM_A,
			sSubSession = ASSIGNMENTS.c_s_ASSESSMENT_SESSION_SPRING,
			sScore2Save = 0,
			sStanineScore2Save = 0,
			dRawScore = 0,
			sScoringParamKey = '',
			fGetGRADEType = function (psItemTypeKey) {
				var oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content || {},
					sAssessmentTitle = oAssignmentSlidesInfo['displayText'],
					oItemTypes = {
						'Beginning':	'BOY',
						'Mid':			'MOY',
						'End':			'EOY'
					},
					oRegex = null,
					aMatches = [];
				
				if (psItemTypeKey === undefined) {
					psItemTypeKey = 'assignmentType';
				}
				
				if (oAssignmentSlidesInfo[psItemTypeKey] === undefined) {
					for (var sItemType in oItemTypes) {
						oRegex = new RegExp('Grade\\s+[0-9]+[—\\s]*' + sItemType + '\\s*(of|-|—)*\\s*Year\\s*$', 'gi');
						
						if (aMatches = sAssessmentTitle.match(oRegex)) {
							return oItemTypes[sItemType];
						}
					}
					
					return '';
				}
				
				return oAssignmentSlidesInfo[psItemTypeKey];
			},
			sItemTypeKey = 'assignmentType',
			sGRADEType = '';
		
		sGRADEType = fGetGRADEType(sItemTypeKey);
		
		if (['BOY', 'MOY'].indexOf(sGRADEType) != -1) {
			sForm = ASSIGNMENTS.c_s_ASSESSMENT_FORM_A;
			sSubSession = ASSIGNMENTS.c_s_ASSESSMENT_SESSION_FALL;
			
			if (sGRADEType === 'MOY') {
				sSubSession = ASSIGNMENTS.c_s_ASSESSMENT_SESSION_SPRING;
			}
		}
		else { // Assumed to be EOY
			sForm = ASSIGNMENTS.c_s_ASSESSMENT_FORM_B;
			sSubSession = ASSIGNMENTS.c_s_ASSESSMENT_SESSION_SPRING;
		}
		oScoreMasterData = objGradeAssessmentScoreData[sSubSession][sForm];
		
		for (var sSubset in oStudentAttemptSummary) {
			var sJSONKey = sSubset.replace(sGradeAssessmentPrefix, '');
			switch (sSubset) {
				case ASSIGNMENTS.c_s_ASSESSMENT_SENTENCE_COMPREHENSION:
				case ASSIGNMENTS.c_s_ASSESSMENT_PASSAGE_COMPREHENSION:
				case ASSIGNMENTS.c_s_ASSESSMENT_LISTENING_COMPREHENSION:
					sScoringParamKey = ASSIGNMENTS.c_s_ASSESSMENT_STANINE.replace(sGradeAssessmentPrefix, '');
					sScore2Save = 0;
					dRawScore = oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE];
					for (var sScore in oScoreMasterData[sScoringParamKey][sJSONKey]) {
						if (
							dRawScore >= oScoreMasterData[sScoringParamKey][sJSONKey][sScore].min &&
							dRawScore <= oScoreMasterData[sScoringParamKey][sJSONKey][sScore].max
						) {
							sScore2Save = sScore;
							break;
						}
					}
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_STANINE] = sScore2Save;
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_PERCENTILE] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_STANDARD_SCORE] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_NORMAL_CURVE_EQUIVALENT] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_GROWTH_SCALE_VALUE] = ' - ';
					break;
					
				case ASSIGNMENTS.c_s_ASSESSMENT_COMPREHENSION_COMPOSITE:
				case ASSIGNMENTS.c_s_ASSESSMENT_VOCABULARY:
				case ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST:
					var aScoringParams = [
						ASSIGNMENTS.c_s_ASSESSMENT_STANINE,
						ASSIGNMENTS.c_s_ASSESSMENT_PERCENTILE,
						ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT,
						ASSIGNMENTS.c_s_ASSESSMENT_STANDARD_SCORE,
						ASSIGNMENTS.c_s_ASSESSMENT_NORMAL_CURVE_EQUIVALENT,
						ASSIGNMENTS.c_s_ASSESSMENT_GROWTH_SCALE_VALUE
					];
					/*==== Clear scoring parameters ====*/
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_STANINE] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_PERCENTILE] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_STANDARD_SCORE] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_NORMAL_CURVE_EQUIVALENT] = ' - ';
					oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_GROWTH_SCALE_VALUE] = ' - ';
					/*== End Clear scoring parameters ==*/
					for (var iIdx = 0; iIdx < aScoringParams.length; iIdx++) {
						sScoringParamKey = aScoringParams[iIdx].replace(sGradeAssessmentPrefix, '');
						sScore2Save = '0';
						dRawScore = oStudentAttemptSummary[sSubset][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE];
						if (
							typeof oScoreMasterData != 'undefined' &&
								typeof oScoreMasterData[sScoringParamKey] != 'undefined' &&
								typeof oScoreMasterData[sScoringParamKey] == 'object'
						) {
							for (var sScore in oScoreMasterData[sScoringParamKey][sJSONKey]) {
								if (
									dRawScore >= oScoreMasterData[sScoringParamKey][sJSONKey][sScore].min &&
									dRawScore <= oScoreMasterData[sScoringParamKey][sJSONKey][sScore].max
								) {
									sScore2Save = sScore;
									break;
								}
							}
							oStudentAttemptSummary[sSubset][aScoringParams[iIdx]] = sScore2Save;
						}
					}
					
					break;
			}
		}
		oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_VERSION] = ASSIGNMENTS.c_s_ASSESSMENT_CURRENT_VERSION;
		
		AssigmentSlides.studentAttemptSummary = oStudentAttemptSummary;
		var mixSystemScore = oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT];
		mixSystemScore = oStudentAttemptSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_RAW_SCORE];
		AssigmentSlides.finalScore = AssigmentSlides.systemScore = parseFloat(mixSystemScore);
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = JSON.stringify(oStudentAttemptSummary);
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		for (var iSlideIndex in AssigmentSlides.studentAttemptData['itemSlides']) {
			var oSlideInputData = AssigmentSlides.studentAttemptData['itemSlides'][iSlideIndex].slideInputData;
			
			for (var sQuestionId in oSlideInputData) {
				var oQuestionInfo = oSlideInputData[sQuestionId];
				AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
					JSON.parse('{\
						"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
						"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + ((oQuestionInfo.correctness == true)? parseFloat(oSelf.weightPerQuestion): 0) + '\
					}')
				);
			}
		}
		
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		AssigmentSlides.setAttemptData(0, pfCallback);
	});
	/*== End Compute Score from Raw Score ==*/
};
Assessment.isTabDirty = function (piTabID) {
	var oSelf = this,
		sAssessmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem() || {
			'itemId':			sAssessmentId,
			'itemSlides':		{},
			'submitStatus':		ASSIGNMENTS['c_s_INCOMPLETED_STATUS'],
			'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType':			ASSIGNMENTS.c_s_ASSESSMENT
		},
		iTabID = parseInt(piTabID) || 0,
		aAllowedTabIndices = [],
		sTabHeadIDPrefix = 'btn_slide_index_',
		sTabBodyIDPrefix = AssigmentSlides.referenceKey + '___',
		iPartID = -1,
		oTabHead = null,
		oCurTabData = {},
		aQuestions = null,
		iSelectedIndex = -1,
		aAnswers = null,
		oSelectedAnswer = null,
		sQuestionID = '',
		oSlideInputData = {};
		
	if ([POPUP_VIEW.c_s_ACTION_VIEW, POPUP_VIEW.c_s_ACTION_PLAY].indexOf($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION)) !== -1) { return false; }
	if (AssigmentSlides.itemComplete === ASSIGNMENTS['c_s_COMPLETED_STATUS']) { return false; }
	if ((oTabHead = $('#' + sTabHeadIDPrefix + iTabID)).length === 0) { throw new Exception('Invalid Tab ID...'); }
	iPartID = parseInt(oTabHead.text().trim().replace(ASSIGNMENTS.c_s_ASSESSMENT_PART + ' ', '')) || -1;
	if (iPartID != -1) { 
		//throw new Exception('Cannot perform Dirty chech on given ' + ASSIGNMENTS.c_s_ASSESSMENT_PART + '...'); 
		//throw 'Cannot perform Dirty chech on given ' + ASSIGNMENTS.c_s_ASSESSMENT_PART + '...';
		oSlideInputData = (oStudentAttemptData['itemSlides']['' + iPartID] || {}).slideInputData || {};
		aQuestions = $('#' + sTabBodyIDPrefix + iPartID).find('ul.question_part');
		for (var iI = 0; iI < aQuestions.length; iI++) {
			aAnswers = $(aQuestions[iI]).find('li');
			oSelectedAnswer = aAnswers.filter('.active');
			iSelectedIndex = -1;
			sQuestionID = $(aQuestions[iI]).data('question-id');
			if (oSelectedAnswer.length === 1) { iSelectedIndex = aAnswers.index(oSelectedAnswer); }
			oCurTabData[sQuestionID] = iSelectedIndex;
		}
		
		if (typeof oStudentAttemptData['itemSlides']['' + iPartID] === 'object') {
			for (sQuestionID in oCurTabData) {
				iSelectedIndex = (oSlideInputData[sQuestionID] || {}).answerIndex;
				if (iSelectedIndex !== oCurTabData[sQuestionID]) {
					return true;
				}
			}
			return false;
		}
		
		for (sQuestionID in oCurTabData) {
			if (-1 !== oCurTabData[sQuestionID]) {
				return true;
			}
		}
		return false;
	}
	
};
Assessment.saveGRADEData = function (pfOnComplete) {
	if (typeof pfOnComplete !== 'function') { pfOnComplete = $.noop; }
	if (
		AssigmentSlides.oAssignmentKeyData['assignmentSubType'] !== ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE ||
		[POPUP_VIEW.c_s_ACTION_VIEW, POPUP_VIEW.c_s_ACTION_PLAY].indexOf($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION)) !== -1 ||
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) === POPUP_VIEW.c_s_MODE_INSTRUCTOR
	) {
		pfOnComplete();
		return;
	}
	
	var oSelf = this,
		itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]),
		studentAttemptData = AssigmentSlides.studentAttemptData,
		studentAttemptSummary = encodeURIComponent('{}'),
		systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS,
		itemAttemptId = AssigmentSlides.itemAttemptId,
		itemID = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	$.nativeCall({
		'method':			'SetAttemptData',
		'inputParams':		[itemID, studentAttemptData, studentAttemptSummary, systemScore, finalScore, itemComplete, itemAttemptId],
		'globalResource':	'objStudentAttemptDataResponse',
		'emptyValue':		0,
		'interval':			500,
		'beforeSend':		function () {
			oUtility.showLoader({
				'message':			'<img src="media/loader.gif" alt="" />',
				'background-color':	'none',
				'click-to-hide':	false,
				'opacity':			0.5
			});
		},
		'onComplete':		function (poSaveAttemptDataResponse) {
			oUtility.hideLoader();
			AssigmentSlides.getAttemptDataForGradeableItem.Content[0].StudentAttemptData = JSON.stringify(studentAttemptData);
			pfOnComplete();
		},
		'onError':			function (poSaveAttemptDataResponse, poException) {
			oUtility.hideLoader();
			var oKnownErrors = AssigmentSlides.getKnownErrors4SaveAttempt(),
				oResponseError = ((poSaveAttemptDataResponse || {}).Error || {}),
				poException = (poException || {}),
				sErrorCode = (oResponseError.ErrorCode || ''),
				sErrorDescription = (
					((oKnownErrors[sErrorCode] || {}).ErrorUserDescription) ||
					(
						(oResponseError.ErrorUserDescription) ||
						(
							$.isEmptyObject(poException) !== true?
							(
								(typeof poException.toString === 'function')?
								poException.toString():
								ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
							):
							ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT
						)
					)
				);
			
			AssigmentSlides._alert(
				{
					divId:		'dialog-message',
					title:		'Alert!',
					message:	sErrorDescription
				},
				function () {
					if (typeof oKnownErrors[sErrorCode] === 'object') {
						if (typeof oKnownErrors[sErrorCode]['Action'] === 'function') {
							oKnownErrors[sErrorCode].Action(poSaveAttemptDataResponse);
						}
					}
				}
			);
		}
	});
};

/*== Start Intro Animation code ==*/
function GradeIntroAnimationView () {}

GradeIntroAnimationView.model = null;

GradeIntroAnimationView.init = function (slideIdx, model) {
	/* var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf); */
	GradeIntroAnimationView.slideIdx = slideIdx;
	GradeIntroAnimationView.model = model;
	GradeIntroAnimationView.render();
	
}

GradeIntroAnimationView.render = function () {
	
	var oSelf = this,
		intro_animation = (typeof AssigmentSlides.model[0].intro_animation != 'undefined') ? AssigmentSlides.model[0].intro_animation : 'null';
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#grade_animation_intro_slide").html(),
			{
				'data':			oSelf.model,
				'mediaPath':	AssigmentSlides.videoPath,
				'video':		intro_animation,
				'partIdx':		oSelf.slideIdx,
				'referenceKey':	AssigmentSlides.referenceKey + "___" + oSelf.slideIdx
			}
		)
	);
	
	setTimeout(function(){
		$('.video-js').each(function () {
			try{
				var video_id = $(this).attr('id');  
				videojs(video_id).ready(function(){
					myplayer=this;
					myplayer.pause(); 
				});
			}
			catch(oException){
			
			}
		});
		oSelf.resize();
		oSelf.bindEvents();
		
	},500);
	
};

GradeIntroAnimationView.resize = function () {
	//resize media_content
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var assessment_bench_mark = $(".assessment_bench_mark").height()+
								parseInt($(".assessment_bench_mark").css("padding-top"));
	var study_plain_title = $(".study_plain_title").height() +
							parseInt($(".study_plain_title").css("padding-top")) +
							parseInt($(".study_plain_title").css("padding-bottom"));
						
	$(".page_container_video").css("max-height", window_height - (study_plain_title+header+assessment_footer+assessment_bench_mark)+"px" );
};

GradeIntroAnimationView.bindEvents = function () {

	
};

// stop Intro Video
GradeIntroAnimationView.stopIntroVideo = function(){
	$("video").each(function(){
		if($(this).length){
			var gradeIntroVideo = $(this);
			if(gradeIntroVideo.is("video")){
				if(!gradeIntroVideo[0].paused){
					gradeIntroVideo.trigger("pause");
					gradeIntroVideo[0].currentTime = 0;
				}
			}
		}
	})
	
};

/*== End Intro Animation code ==*/

/*== Start text slide template ==*/
function TextSlideView () {}

TextSlideView.model = null;

TextSlideView.init = function (slideIdx, model) {
	/* var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf); */
	TextSlideView.slideIdx = slideIdx;
	TextSlideView.model = model;
	TextSlideView.render();
}

TextSlideView.render = function () {
	var oSelf = this,
	oSlideInputData = {},
	oSavedData = {},
	oStudentAttemptData = {},
	sAudio = "",
	sImage = "";
	//console.log(oSelf.model);
	
	var textHtml_chk = _.where(oSelf.model.metadata, {key: "text_html"}),
		textHtml = (textHtml_chk.length)?textHtml_chk[0].keyValue:'';
		
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_TEXT_SLIDE).html(),
			{
				"data":			oSelf.model,
				'mediaPath':	AssigmentSlides.mediaPath,
				"partIdx":		oSelf.slideIdx,
				"referenceKey": AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				"textHtml" : textHtml,
				"audio" : sAudio,
				"image" : sImage
			}
		)
	);
	
	setTimeout(function(){
		oSelf.resize();
	}, 500);
	
};

TextSlideView.resize = function () {
	//resize media_content
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var assessment_bench_mark = $(".assessment_bench_mark").height()+
								parseInt($(".assessment_bench_mark").css("padding-top"));
	var study_plain_title = $(".study_plain_title").height() +
							parseInt($(".study_plain_title").css("padding-top")) +
							parseInt($(".study_plain_title").css("padding-bottom"));
					
	$(".textslide.media_content").css("height", window_height - (study_plain_title+header+assessment_footer+assessment_bench_mark)+"px" );

};

TextSlideView.bindEvents = function () {

	var oSelf = this;
	$(".textslide .playPauseButton").off("click").on("click", function(){
			Assessment.audioPlayerHandler(oSelf, $(this));
	});
};
/*== End text slide template ==*/

/*== Start projector slide template ==*/
function ProjectorSlideView () {}

ProjectorSlideView.model = null;

ProjectorSlideView.init = function (slideIdx, model) {
	/* var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf); */
	ProjectorSlideView.slideIdx = slideIdx;
	ProjectorSlideView.model = model;
	ProjectorSlideView.render();
	ProjectorSlideView.playCounter = [];
	ProjectorSlideView.maxPlayCount = 2;
	
};

ProjectorSlideView.render = function () {
var oSelf = this,
	oSlideInputData = {},
	oSavedData = {},
	oStudentAttemptData = {},
	sAudio = "",
	sImage = "",
	sVideo = "";
	
	var audio_exclusive_val = _.where(oSelf.model.metadata, {key: "audio_exclusive_to_ilit20"}),
		is_audio_exclusive_val = (audio_exclusive_val.length)?audio_exclusive_val[0].keyValue:false,
		
		audio_val_chk = _.where(oSelf.model.metadata, {key: "audio"}),
		audio_val = (audio_val_chk.length)?audio_val_chk[0].keyValue:'',
		
		image_val_chk = _.where(oSelf.model.metadata, {key: "image"}),
		image_val = (image_val_chk.length)?image_val_chk[0].keyValue:'';
		
		video_val_chk = _.where(oSelf.model.metadata, {key: "video"}),
		video_val = (video_val_chk.length)?video_val_chk[0].keyValue:'';
		
   
    if(audio_val){
		sAudio =  (Assessment.displayAssessmentSlide(is_audio_exclusive_val)) ? audio_val : '';
	}
  
	if(image_val){
		sImage =  image_val;
	}
    
	if(video_val){
		sVideo =  video_val;
	}
  
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_PROJECTOR_SLIDE).html(),
			{
				"data":			oSelf.model,
				"partIdx":		oSelf.slideIdx,
				'mediaPath':	AssigmentSlides.videoPath,
				"referenceKey": AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				"audio" : sAudio,
				"image" : sImage,
				"video" : sVideo
			}
		)
	);
	setTimeout(function(){
		$('.video-js').each(function () {
			try{
				var video_id = $(this).attr('id');  
				videojs(video_id).ready(function(){
					myplayer=this;
					myplayer.pause(); 
				});
			}
			catch(oException){
			
			}
		});
		oSelf.resize();
		oSelf.bindEvents();
	}, 1000);
	
};

ProjectorSlideView.resize = function () {
	//resize media_content
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var assessment_bench_mark = $(".assessment_bench_mark").height()+
								parseInt($(".assessment_bench_mark").css("padding-top"));
	var study_plain_title = $(".study_plain_title").height() +
							parseInt($(".study_plain_title").css("padding-top")) +
							parseInt($(".study_plain_title").css("padding-bottom"));
							
	$(".projectorslide.media_content").css("height", window_height - (study_plain_title+header+assessment_footer+assessment_bench_mark)+"px" );
	
	
};

ProjectorSlideView.bindEvents = function () {

	var oSelf = this;
	
	$(".projectorslide .playPauseButton").off("click").on("click", function(){
		Assessment.audioPlayerHandler(oSelf, $(this));
	})
	
};
/*== End projector slide template ==*/


function MultipleChoiceView () {};
MultipleChoiceView.slideIdx = null;

MultipleChoiceView.model = null;

MultipleChoiceView.init = function (slideIdx, model) {
	MultipleChoiceView.slideIdx = slideIdx;
	MultipleChoiceView.model = model;
	MultipleChoiceView.render();
	MultipleChoiceView.playCounter = [];
	MultipleChoiceView.maxPlayCount = 2;
};

MultipleChoiceView.render = function () {
	var oSelf = this,
		oSlideInputData = {},
		oSavedData = {};
		
		
	if (oItemSlides = AssigmentSlides.getStudentAttemptForGradableItem()) {
		oSlideInputData = oItemSlides.itemSlides;
	}
	
	oSavedData = (
		(
			typeof oSlideInputData[oSelf.slideIdx] != 'undefined' &&
				typeof oSlideInputData[oSelf.slideIdx].slideInputData != 'undefined'
		)?
		oSlideInputData[oSelf.slideIdx].slideInputData:
		{}
	);
	
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_MULTIPLE_CHOICE_SLIDE).html(),
			{
				'data':			oSelf.model,
				'partIdx':		oSelf.slideIdx,
				'referenceKey':	AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'savedData':	oSavedData,
				'mediaPath':	AssigmentSlides.mediaPath,
				'isIlit20' : (AssignmentsView.productCode || '').startsWith("ilit20")
			}
		)
	);
	oSelf.resize();
	oSelf.bindEvents();
}

MultipleChoiceView.resize = function () {
	//resize media_content
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var assessment_bench_mark = $(".assessment_bench_mark").height()+
								parseInt($(".assessment_bench_mark").css("padding-top"));
	var study_plain_title = $(".study_plain_title").height() +
							parseInt($(".study_plain_title").css("padding-top")) +
							parseInt($(".study_plain_title").css("padding-bottom"));
							
	$(".multiplechoiceslide.media_content").css("max-height", window_height - (study_plain_title+header+assessment_footer+assessment_bench_mark)+"px" );
};

MultipleChoiceView.bindEvents = function () {
	
	var oSelf = this;
	
	$(".multiplechoiceslide .playPauseButton").off("click").on("click", function(){
		Assessment.audioPlayerHandler(oSelf, $(this));

	})
	
	$(".multiplechoiceslide.inner .playPauseButton").off("click").on("click", function(){
		Assessment.audioPlayerHandler(oSelf, $(this), true);
	})
};

function MultiChoicePassagesView () {};

MultiChoicePassagesView.slideIdx = null;
MultiChoicePassagesView.model = null;

MultiChoicePassagesView.init = function (slideIdx, model) {
	MultiChoicePassagesView.slideIdx = slideIdx;
	MultiChoicePassagesView.model = model;
	MultiChoicePassagesView.render();
	MultiChoicePassagesView.playCounter = [];
	MultiChoicePassagesView.maxPlayCount = 2;
};

MultiChoicePassagesView.render = function () {
	var oSelf = this,
		oSlideInputData = {},
		oSavedData = {},
		oStudentAttemptData = {},
		sInstructional_audio = "";
	
	if ((oStudentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) == null) {
		oStudentAttemptData = {};
	}
	else {
		oSlideInputData = oStudentAttemptData['itemSlides'];
	}
	
	oSavedData = (
		(
			typeof oSlideInputData[oSelf.slideIdx] != 'undefined' &&
				typeof oSlideInputData[oSelf.slideIdx].slideInputData != 'undefined'
		)?
		oSlideInputData[oSelf.slideIdx].slideInputData:
		{}
	);
	
	if (!isObjectEmpty(oSavedData)) {
		if (AssigmentSlides.studentAttemptData == null) {
			AssigmentSlides.studentAttemptData = {};
		}
		AssigmentSlides.studentAttemptData[oSelf.slideIdx] = oSavedData;
	}
	

	
	if(
		oSelf.model.instructional_audio 
	){
		sInstructional_audio = (Assessment.displayAssessmentSlide((typeof oSelf.model.instructional_audio_exclusive_to_ilit20!= 'undefined')? oSelf.model.instructional_audio_exclusive_to_ilit20 :false)) ? oSelf.model.instructional_audio : '';
	}
	
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_MULTI_CHOICE_PASSAGES_SLIDE).html(),
			{
				"data":			oSelf.model,
				"partIdx":		oSelf.slideIdx,
				"referenceKey": AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'savedData':	oSavedData,
				'mediaPath':	AssigmentSlides.mediaPath,
				"instructional_audio" : sInstructional_audio,
				'isIlit20' : (AssignmentsView.productCode || '').startsWith("ilit20")
				
			}
		)
	);
	oSelf.resize();
	oSelf.bindEvents();
}

MultiChoicePassagesView.resize = function () {
	//resize media_content
	var oSelf = this;
    var window_height = $(window).height();
	var header = $("header").outerHeight();
	var assessment_footer = $('.assessment_pagination').outerHeight();
	var assessment_bench_mark = $(".assessment_bench_mark").height()+
								parseInt($(".assessment_bench_mark").css("padding-top"));
	var study_plain_title = $(".study_plain_title").height() +
							parseInt($(".study_plain_title").css("padding-top")) +
							parseInt($(".study_plain_title").css("padding-bottom"));
							
	$(".multichoicepassageslide.media_content").css("max-height", window_height - (study_plain_title+header+assessment_footer+assessment_bench_mark)+"px" );
};

MultiChoicePassagesView.bindEvents = function () {
	var oSelf = this;
	
	$(".multichoicepassageslide .playPauseButton").off("click").on("click", function(){
		Assessment.audioPlayerHandler(oSelf, $(this));
	})
	
	$(".multichoicepassageslide.inner .playPauseButton").off("click").on("click", function(){
		Assessment.audioPlayerHandler(oSelf, $(this), true);
	})
};

function IwtsSummaryView () {}

/**
 * Summary View Properties
 */
IwtsSummaryView.slideIdx = null;
IwtsSummaryView.model = null;
IwtsSummaryView.inputBtn = null;
IwtsSummaryView.printBtn = null;
IwtsSummaryView.typeareaText = null;
IwtsSummaryView.instructionTab = null;
IwtsSummaryView.feedbackTab = null;
IwtsSummaryView.feedbackData = null;
IwtsSummaryView.checkWorkData = null;
IwtsSummaryView.prompt_id = null;
IwtsSummaryView.studentAttemptDataObj = null;
IwtsSummaryView.iMultiplyingFactor = 3;
// IwtsSummaryView.iMultiplyingFactor = 4; // Changed for translation table
IwtsSummaryView._confirm = ISeriesBase.prototype._confirm;
IwtsSummaryView._alert = ISeriesBase.prototype._alert;
IwtsSummaryView.savedDataLoaded = false;
IwtsSummaryView.smmaryScored = false;
IwtsSummaryView.feedbackInfo = null;
IwtsSummaryView.isSummarySubmitted = false;
IwtsSummaryView.slideAttempted = 0;

IwtsSummaryView.init = function (slideIdx, model) {
	var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
	oSelf.model = model;
	oSelf.prompt_id = null;
	oSelf.studentAttemptDataObj = null;
	oSelf.feedbackData = null;
	oSelf.savedDataLoaded = false;
	oSelf.smmaryScored = false;
	oSelf.feedbackInfo = null;
	oSelf.isSummarySubmitted = false;
	oSelf.slideAttempted = 0;
	/*==== 10-April-2014 ====*/
	oSelf.controls = {};
	oSelf['slideStatuses'] = {};
	/*== End 10-April-2014 ==*/
    oSelf.render();
}

IwtsSummaryView.loadControls = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx;
	
	oSelf['controls'][iSlideId] = {};
	
	oSelf['controls'][iSlideId].emailBtn = $("#" + ASSIGNMENTS.c_s_ASSIGN_SUMMARY_EMAIL_BTN_ID);
	oSelf['controls'][iSlideId].printBtn = $("#" + ASSIGNMENTS.c_s_ASSIGN_SUMMARY_PRINT_BTN_ID);
	oSelf['controls'][iSlideId].getFeedbackBtn = $('#getFeedback');
	oSelf['controls'][iSlideId].submitSummaryBtn = $('#btnsubmit_summary');
	oSelf['controls'][iSlideId].backButton = $('#'+ASSIGNMENTS.c_s_PREV);
	
    oSelf['controls'][iSlideId].typeareaText = $("#" + ASSIGNMENTS.c_s_ASSIGN_SUMMARY_ELEM_TYPEAREA);
    oSelf['controls'][iSlideId].instructionTab = $("#" + ASSIGNMENTS.c_s_INSTRUCTION_TABID);
    oSelf['controls'][iSlideId].feedbackTab = $("#" + ASSIGNMENTS.c_s_FEEDBACK_TABID);
	
	oSelf['controls'][iSlideId].instructionContent = $("#" + ASSIGNMENTS.c_s_INSTRUCTION_TABID.replace('_tab', '_content'));
    oSelf['controls'][iSlideId].feedbackContent = $("#" + ASSIGNMENTS.c_s_FEEDBACK_TABID.replace('_tab', '_content'));
	
	oSelf['slideStatuses'][iSlideId] = new (function (iSlideId) {
		var oStatus = {
				'visited':		false,
				'isComplete':	(IwtsSummaryView.isSummarySubmitted === true) ? true :false
			},
			bRetrieved = false;
		this.update = function () {
			var summary = jQuery('<div/>').html($("#txtSummary").val()).text().trim();
			oStatus['summary'] = encodeURIComponent(summary);
			if (!('visited' in oStatus)) {
				oStatus['visited'] = false;
			}
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
		this.updateByData = function (oData) {
			oStatus = $.extend(true, oStatus, oData);
		};
		this.updateStatusByData = function (oCurrentSlide, oData) {
			oStatus = $.extend(true, oStatus, oData);
			oSelf.updateAttemptData4Slide(oCurrentSlide);
		};
		this.getIsComplete = function () {
			return (oStatus['isComplete'] == true);
		};
		this.getIsRetrieved = function () {
			return bRetrieved;
		};
		this.setIsRetrieved = function (bRetrieveStatus) {
			bRetrieved = bRetrieveStatus;
		};
	})(iSlideId);
};

IwtsSummaryView.render = function () {
	var innerContent = IwtsSummaryView.model, data;
	
	if (data = AssigmentSlides.getStudentAttemptForGradableItem()) {
		IwtsSummaryView.studentAttemptDataObj = data;
	}
	else {
		IwtsSummaryView.studentAttemptDataObj = {};
	}
	
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE).html(),
			{
				"data":					innerContent,
				"mediaPath":			AssigmentSlides.mediaPath,
				"referenceKey": 		AssigmentSlides.referenceKey + "___" + IwtsSummaryView.slideIdx,
				"studentAttemptData":	IwtsSummaryView.studentAttemptDataObj,
				"slideType":			ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE, // 10-April-2014
				"enableSubmit":			((dScore = IwtsSummaryView.getScore()) !== false && dScore['summaryScore']['overallScore'] > 0)
			}
		)
	);
	
	AssignmentsView.hideMainLoader();
	
	/**
     * Set Header Items
     */
    IwtsSummaryView.loadControls();
	
	/**
     * Unfreeze swipe when already attempted
     */
	var slideId = IwtsSummaryView.slideIdx,
		summaryObj = {};
	
	if (
		typeof IwtsSummaryView['studentAttemptDataObj'] != 'undefined' &&
		IwtsSummaryView['studentAttemptDataObj'] != null &&
		IwtsSummaryView['studentAttemptDataObj'] != 'null' &&
			typeof IwtsSummaryView.studentAttemptDataObj.itemSlides != 'undefined' &&
			IwtsSummaryView.studentAttemptDataObj.itemSlides instanceof Array
	) {
		summaryObj = _.where(IwtsSummaryView.studentAttemptDataObj.itemSlides, {"slideID": slideId});
		if (summaryObj.length) {			
			var slideAttempt = summaryObj[0].slideAttempt;
			IwtsSummaryView.slideAttempted = slideAttempt;			
			if (slideAttempt >= 1) {
				$('#btnsubmit_summary').addClass("btndisabled disabled").removeClass(AssigmentSlides.commonSubmitButtonClass); 
				$('#getFeedback').addClass("btndisabled disabled"); 
				$("#txtSummary").attr("readonly","readonly");
			}
		}
	}
	
	IwtsSummaryView.updateAttemptData();    
    IwtsSummaryView.resize();
    IwtsSummaryView.bindEvents();
    IwtsSummaryView.retrieveScore();
};

IwtsSummaryView.getScore = function () {
	var oSelf = this,
		oSlideScore = {};		
	if (
		typeof oSelf.studentAttemptDataObj != 'undefined' &&
		oSelf.studentAttemptDataObj != null &&
			'itemSlides' in oSelf.studentAttemptDataObj &&
			typeof oSelf.studentAttemptDataObj['itemSlides'] != 'undefined' &&
			oSelf.studentAttemptDataObj['itemSlides'] instanceof Array
	) {		
		var objSummarySlide = _.where(oSelf.studentAttemptDataObj['itemSlides'], {"slideType": "iwtsummaryslide"});
		
		if (
			_.size(objSummarySlide) &&
			typeof objSummarySlide[0].slideScore != 'undefined' &&
			objSummarySlide[0].slideScore != null 
		) {			
			oSlideScore = objSummarySlide[0].slideScore;
		}		
	}
	if (
		typeof oSlideScore != 'undefined' &&
		typeof oSlideScore == 'object' &&
		oSlideScore != null &&
			'summaryScore' in oSlideScore &&
			typeof oSlideScore['summaryScore'] != 'undefined' &&
			oSlideScore['summaryScore'] != null &&
			oSlideScore['summaryScore'] != 'null' &&
			'overallScore' in oSlideScore['summaryScore'] &&
				typeof oSlideScore['summaryScore']['overallScore'] != 'undefined' &&
				oSlideScore['summaryScore']['overallScore'] != null &&
				!isNaN(oSlideScore['summaryScore']['overallScore'])
	) {
		return decodePKTSlideScore(oSlideScore);
	}
	return false;
};

IwtsSummaryView.retrieveScore = function () {
	var oSelf = this,
		mixSlideScore = false;
	
	if (mixSlideScore = oSelf.getScore()) {
		IwtsSummaryView.savedDataLoaded = true;
		oSelf.feedbackData = mixSlideScore;
		
		oSelf.setFeedbackVal();
		$('#feedback_tab').addClass('active');
		$('#feedback_tab').siblings().removeClass('active');		
		$('.disable-controls').off('click tap');
	}
};

IwtsSummaryView.updateAttemptData4Slide = function (oCurrentSlide, iIsSubmitted) {
	var iSlideId = oCurrentSlide.attr('id').split('___').last(),
		slideId = iSlideId,
		wholeData = IwtsSummaryView.slideStatuses[iSlideId].getStatus();
	if (typeof iIsSubmitted == 'undefined') {
		iIsSubmitted = '0';
	}
		
	if (IwtsSummaryView.studentAttemptDataObj != null) {
		var summaryObj = _.where(IwtsSummaryView.studentAttemptDataObj.itemSlides, {"slideID": slideId});
		if (summaryObj.length) {
			
			var slideAttempt = (IwtsSummaryView.isSummarySubmitted === true)? summaryObj[0].slideAttempt + 1: summaryObj[0].slideAttempt;
		}
		else {			
			var slideAttempt = (IwtsSummaryView.isSummarySubmitted === true)? 1: 0;
		}
	}
	else {		
		var slideAttempt = 0;
	}
		/*==== Encode unwanted characters @ PKT Response ====*/
	var slideScore = (IwtsSummaryView.feedbackData != null)? encodePKTSlideScore(IwtsSummaryView.feedbackData): GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		/*== End Encode unwanted characters @ PKT Response ==*/
		systemScore = (
			(IwtsSummaryView.feedbackData != null && typeof IwtsSummaryView.feedbackData.summaryScore != 'undefined')?
			IwtsSummaryView.feedbackData.summaryScore.overallScore:
			0
		),
		itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]),
		oSlideData = {
			"slideID": slideId,
			"slideType": ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE,
			"slideAttempt": slideAttempt,
			"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"slideScore": slideScore,
			"slideInputData": wholeData
		};
		
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	if (typeof oSlideData['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined') {
		if (typeof AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS] != 'undefined') {
			oSlideData['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS];
		}
		else if (typeof AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')] != 'undefined') {
			oSlideData['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')];
		}
	}
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		typeof AssigmentSlides.studentAttemptData != 'object' ||
		AssigmentSlides.studentAttemptData == null ||
		!('itemId' in AssigmentSlides.studentAttemptData) ||
		AssigmentSlides.studentAttemptData.itemId != itemId
	) {
		AssigmentSlides.studentAttemptData = {
			"itemId": itemId,
			"itemSlides": [
				oSlideData
			],
			"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_IWTS
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == slideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = oSlideData;
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push(oSlideData);
	}
	AssigmentSlides.studentAttemptData['itemSlides'] = _.sortBy(
		AssigmentSlides.studentAttemptData['itemSlides'],
		function (oSlideInfo) {
			return parseInt(oSlideInfo.slideID);
		}
	);
	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
};

IwtsSummaryView.updateAttemptData = function (iIsSubmitted) {
	/*==== Get Current Slide Status ====*/
	if (oCurrentSlide = AssigmentSlides.getCurrentActiveSlide()) {
		if (oCurrentSlide.data('slide-type') != ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE) {
			var oSlide = $('#' + AssigmentSlides.referenceKey + "___" + IwtsSummaryView.slideIdx);
			IwtsSummaryView.updateAttemptData4Slide(oSlide);
			return true;
		}
		var iSlideId = oCurrentSlide.attr('id').split('___').last(),
			summary = $('<div/>').html(IwtsSummaryView.controls[iSlideId].typeareaText.val()).text().trim(),
			wholeData = {
				'summary':	encodeURIComponent(summary)
			};
			
		try {
			var sContainerId = oCurrentSlide.attr('id'),
				aSlideIdChunks = sContainerId.split('___'),
				iSlideId = aSlideIdChunks.last();
				
			if (IwtsSummaryView.slideStatuses[iSlideId]) {
				var oStatus = IwtsSummaryView.slideStatuses[iSlideId].getStatus();
				wholeData = $.extend(true, oStatus, wholeData);
				IwtsSummaryView.slideStatuses[iSlideId].updateByData(wholeData);
			}
			
			IwtsSummaryView.updateAttemptData4Slide(oCurrentSlide, iIsSubmitted);
		}
		catch (oException) {
			
		}
	}
	/*== End Get Current Slide Status ==*/
};

IwtsSummaryView.bindEvents = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx;
		
	$('#btnemail_summary').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, IwtsSummaryView.email);
	$('#btnprint_summary').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, IwtsSummaryView.print);
	$("#txtSummary").off("keyup input").on("keyup input", IwtsSummaryView.submitEnable);	
	$("#txtSummary").off("blur change").on("blur change", IwtsSummaryView.updateAttemptData);
	if (oPlatform.isIOS()) {
		if (typeof AssignmentsView.iOSVersion == 'undefined') {
			aMatches = navigator.userAgent.match(/iPad;.*CPU.*OS ([0-9]+)_\d/i);
			AssignmentsView.iOSVersion = parseInt(aMatches[1]);
		}
		if (AssignmentsView.iOSVersion >= 8) {
			$("#txtSummary").on("blur", function () {
				AssignmentsView.resize();
			});
		}
	}
	$('#btnsubmit_summary').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, IwtsSummaryView.submitSummary);
	
	//instruction tab
	oSelf['controls'][iSlideId].instructionTab.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, function () {
		oSelf.loadInstruction.call(this, oSelf);
	});

	//feedback tab
	oSelf['controls'][iSlideId].feedbackTab.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, IwtsSummaryView.loadFeedback);

	$('#getFeedback').off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType,IwtsSummaryView.getFeedbackCall);
	$('#instructionText a').off("click tap").on("click tap",function (oEvent) {
		oSelf.linksCall.call(this, oEvent, oSelf);
	});
	
	// back to instruction tab
	$('.backtoinst').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function () {
		oSelf.loadInstruction.call(this, oSelf);
	});
}

IwtsSummaryView.submitSummary = function(e) {
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last(),
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
	if ($('#btnsubmit_summary').hasClass("btndisabled")) {
		return false;
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}	
	
	IwtsSummaryView._confirm({
		'title':	'Are you sure?',
		'divId':	'dialog-message',
		'message':	ASSIGNMENTS.c_s_CONFIRM_SUBMIT_MSG,
		'yes': function() {
			AssigmentSlides.allowSwipeStart = false;
			IwtsSummaryView.slideStatuses[iSlideId].updateByData({
				'isComplete':	true
			});
			var aSlides = AssigmentSlides.slidingEngine.getAllSlides();
			iFreezePosition = $(aSlides).index(oCurrentSlide) + 1;
			AssigmentSlides.slidingEngine.freezeAtSlide(iFreezePosition); //Enables dragging
			AssigmentSlides.slidingEngine.unFreezeNextSlides();
			IwtsSummaryView.isSummarySubmitted = true;
			
			IwtsSummaryView.updateAttemptData('1');
			
			$('#btnsubmit_summary').addClass("btndisabled disabled").removeClass(AssigmentSlides.commonSubmitButtonClass); 
			$('#getFeedback').addClass("btndisabled disabled"); 
			$("#txtSummary").attr("readonly","readonly");
			
			IwtsSummaryView.smmaryScored = true;			
			
			$("#feedback_tab").addClass('active');
			$("#instruction_tab").removeClass('active');			
			$('.new_tab_space_title_tab .back_bttn').hide();
			$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
			$("#feedback_content").empty().html(_.template($("#iwtsummaryinstruction").html(),{"data":ASSIGNMENTS.c_s_SUMMARY_SCORED_MSG}));
			$('#getFeedback').hide();
			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_SUBMITTED_VERBID, sItemId);
			}
			
			/*== Start if CR off and product ilit20 call the submit code ==*/
			if (
				((AssignmentsView.productCode || '').startsWith("ilit20")) && 
				objSettingsData.Content.ShowCriticalResponse == '0'				
			){
				submitIWTAssignment();
				
			}
			/*== End if CR off and product ilit20 call the submit code ==*/
		}
	});
	
};


IwtsSummaryView.focusSelection = function(e){
    e.stopPropagation();
    $("#txtSummary").focus();
}

IwtsSummaryView.getFeedbackCall = function () {
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last(),
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
	if ($('#getFeedback').hasClass("btndisabled")) {
		return false;
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}	
	
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': 'none',
		'click-to-hide': false,
		'opacity': 0.5
	});
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
		SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_GETFEEDBACK_BTTN_VERBID, sItemId);
	}
	
	IwtsSummaryView.feedbackInfo = null;
	IwtsSummaryView.savedDataLoaded = false;
	$('#txtSummary').blur();	
	$(this).focus();
	//$('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE+' .summaryLoader').show();
	$('.new_tab_space_title_tab .back_bttn').hide();	
	$("#feedback_tab").addClass('active');
	$("#instruction_tab").removeClass('active');
	$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
	IwtsSummaryView.feedbackData = 0;
	
	var slide_obj_key = aSlideIdChunks.fetch(3);		
		
	IwtsSummaryView.prompt_id = AssigmentSlides.model[slide_obj_key].prompt_id;
	
	var summaryText = IwtsSummaryView.controls[iSlideId].typeareaText.val();
	if (oPlatform.isIOS()) {
		summaryText = summaryText.replace(/"/g, "&#34;").replace(/“/g, "&#34;").replace(/”/g, "&#34;");
	}
	else {
		summaryText = summaryText.replace(/"/g,"\\\""); 
	}
	//IwtsSummaryView.summaryPKTCallback('{"summaryScore":{"scored":true,"prologue":{"status":"success","transactionId":"c17a43e1-46a6-11e1-a0cd-c82a1416fe11"},"overallScore":1,"sections":[{"hints":["What is the purpose of SPARX?","What are some concerns that adults have about video games?"],"sectionId":"iLit_G8U1W3_IR_3_s1","score":1},{"hints":["What are spatial skills? What do studies show about action games and spatial skills?","What kinds of video games are more popular than SPARX? Why do these kinds of games concern parents?","Aside from improving your spatial skills, how else can action games help you?"],"sectionId":"iLit_G8U1W3_IR_3_s2","score":1},{"hints":["What do many scientists think about gaming? What are some other benefits of gaming?","According to Dr. Richard Falzone, how does playing video games with friends help teens?","Why do some parents still worry about video games?"],"sectionId":"iLit_G8U1W3_IR_3_s3","score":1}]}}'); 
	
	setProcessPKT("summaryScore" , summaryText, IwtsSummaryView.prompt_id); 
}

IwtsSummaryView.summaryPKTCallback = function (data) {
	var sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	data = data.replace(/\n/g, '\\n');
	oUtility.hideLoader();
	
	try {
		IwtsSummaryView.feedbackData = $.parseJSON(data);
		
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
			SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_RECEIVED_VERBID, sItemId);
		}
	}
	catch (e) {		
		IwtsSummaryView.feedbackData = {
			"summaryScore": {
				"prologue": {
					"contentError": data
				}
			}
		};
	}	
	
   IwtsSummaryView.updateAttemptData();
   AssigmentSlides.setAttemptData();

   IwtsSummaryView.validateJson('summaryScore');
   
};

IwtsSummaryView.validateJson = function (method) {
	if (method == 'summaryScore' && typeof IwtsSummaryView.feedbackData.summaryScore != 'undefined') {
		var prologue = IwtsSummaryView.feedbackData.summaryScore.prologue;
	}
	else if (method == 'summaryFeedback' && typeof IwtsSummaryView.checkWorkData.summaryFeedback != 'undefined') {
		var prologue = IwtsSummaryView.checkWorkData.summaryFeedback.prologue;
	}
	
	var feedbackTxt = '';
	if (method == 'summaryFeedback' && typeof IwtsSummaryView.checkWorkData.summaryFeedback == 'undefined') {				
		
		feedbackTxt = (typeof IwtsSummaryView.checkWorkData.Message != 'undefined')?IwtsSummaryView.checkWorkData.Message: ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT;				
	}
	else if (method == 'summaryScore' && typeof IwtsSummaryView.feedbackData.summaryScore == 'undefined') {				
		
		feedbackTxt = (typeof IwtsSummaryView.feedbackData.Message != 'undefined')?IwtsSummaryView.feedbackData.Message: ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT;				
	}
	else if (prologue.contentError || prologue.requestErrorMessage) {		
		var error = (typeof prologue.contentError != 'undefined') ? prologue.contentError : prologue.requestErrorMessage;
		
		if (error == "contentTextTooLong") {			
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_LONG;			
		}
		else if (error == "contentTextTooShort") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_SHORT;			
		}
		else if (error == "contentTextRepetitious") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_REPEAT;			
		}
		else if (error == "contentTextCapitals") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_CAPITAL;			
		}
		else if (error == "contentTextUnique") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNIQUE;			
		}
		else if (error == "contentTextUnusual") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNUSUAL;			
		}
		else {
			feedbackTxt = error;			
		}
		
	}
	else {
		if(method == 'summaryScore') {
			var oCurrentSlide = oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
				sContainerId = oCurrentSlide.attr('id'),
				aSlideIdChunks = sContainerId.split('___'),
				iSlideId = aSlideIdChunks.last();
				
			var summaryText = IwtsSummaryView.controls[iSlideId].typeareaText.val();
			if (oPlatform.isIOS()) {
				summaryText = summaryText.replace(/"/g, "&#34;").replace(/“/g, "&#34;").replace(/”/g, "&#34;");
			}
			else {			
				summaryText = summaryText.replace(/"/g, "\\\"");
			}
			//IwtsSummaryView.SummaryFeedbackPKTCallback('{"summaryFeedback":{"prologue":{"status":"success","transactionId":"a838c99e-46a6-11e1-a9a8-c82a1416fe11"},"irrelevancyFeedback":{"irrelevantSentences":["s0","s1","s2","s3"],"status":"success"},"copyingFeedback":{"copiedPhrases":[],"status":"success"},"summary":"The quick brown fox jumps teh over lazy grey dog. The dog looks up. The fox darts away. And the dog looks up.","spellingFeedback":{"status":"success","misspelledWords":[{"word":"teh","positions":[{"startIndex":26,"sentenceRefId":"s0","endIndex":28}]}]},"redundancyFeedback":{"status":"success","redundantSentences":[["s1","s3"]]},"sentences":[{"text":"The quick brown fox jumps teh over lazy grey dog.","position":{"startIndex":0,"endIndex":48},"id":"s0"},{"text":"The dog looks up.","position":{"startIndex":50,"endIndex":66},"id":"s1"},{"text":"The fox darts away.","position":{"startIndex":68,"endIndex":86},"id":"s2"},{"text":"And the dog looks up.","position":{"startIndex":88,"endIndex":108},"id":"s3"}]}}');
	   
			setProcessPKT("SummaryFeedbackRequest" , summaryText, IwtsSummaryView.prompt_id);
		}
		else if (method == 'summaryFeedback') {
			IwtsSummaryView.setFeedbackVal();
			
			if (IwtsSummaryView.feedbackData.summaryScore.overallScore > 0) {
				$('#btnsubmit_summary').removeClass("btndisabled disabled");
			}
			else
			{
				$('#btnsubmit_summary').addClass("btndisabled disabled");
			}
		}
	}
	
	if (feedbackTxt != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		if ($('#instructionText').length > 0) {
			$('#instructionText').empty().html(feedbackTxt);
		}
		else {
			$("#feedback_content").empty().html(_.template($("#iwtsummaryinstruction").html(),{"data":feedbackTxt}));
		}			
		
		$('#btnsubmit_summary').addClass("btndisabled disabled");
		IwtsSummaryView.feedbackInfo = feedbackTxt;	
	}
}

IwtsSummaryView.SummaryFeedbackPKTCallback = function (data) {
	data = data.replace(/\n/g, '\\n');
	oUtility.hideLoader();	
	
	try {
		IwtsSummaryView.checkWorkData = $.parseJSON(data);
	} catch (e) {		
		IwtsSummaryView.checkWorkData = {"summaryFeedback" : {
										"prologue" : {
												"contentError" : data
											}
										} };
	}
	
	IwtsSummaryView.validateJson('summaryFeedback');
}

IwtsSummaryView.setFeedbackVal = function () {
	if (IwtsSummaryView.savedDataLoaded == true) {
		var checkData = {};
	}
	else {
		var checkData = IwtsSummaryView.checkWorkData.summaryFeedback;
	}
	
    $("#feedback_content").html(
		_.template(
			$("#iwtsummaryfeedback").html(),
			{
				"data":			IwtsSummaryView.feedbackData,
				"checkData":	checkData
			}
		)
	);
	
	IwtsSummaryView.bindFeedbackEvents();
};

IwtsSummaryView.bindFeedbackEvents = function () {
	var sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	
	$(".section_drill")
		.parent()
			.parent()
				.parent()
					.off("click tap " + sWindowsEventType)
					.on("click tap " + sWindowsEventType, function () {
						var oChild = $(this).find('.section_drill');
						var section_id = oChild.data('val');
						$('.new_tab_space_title_tab h3').text(oChild.data('title'));
						$("#score_container").hide();
						$('#drill_container'+section_id).show();		
						
						//var drill_text = _.where(AssigmentSlides.model, {"type" : "iwttextanswerslide"});
						var drill_text = AssigmentSlides.model;
						var static_text = '';
						var secId = section_id + 1;
						if (typeof drill_text[secId] != 'undefined') {
							static_text = (drill_text[secId].interactive_text != '')?drill_text[secId].interactive_text:drill_text[secId].static_text;
						}
						
						$('#drill_text'+section_id).html(static_text);		
						$('.backtofeedbck').show();
						//IwtsSummaryView.bindDrilledEvents();
						IwtsSummaryView.resize();
						
						if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
							SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_DRILLED_VERBID, sItemId);
						}						
					});
	
	$(".redundancy_drill")
		.parent()
			.parent()
				.parent()
					.off("click tap " + sWindowsEventType)
					.on("click tap " + sWindowsEventType, function () {
						
						var obj = IwtsSummaryView.checkWorkData.summaryFeedback;
						var highlight_txt = obj.redundancyFeedback.redundantSentences;
						var sentences = obj.sentences;		
						var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
						
						var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
						sContainerId = oCurrentSlide.attr('id'),
						aSlideIdChunks = sContainerId.split('___'),
						iSlideId = aSlideIdChunks.last();
						var summaryText = IwtsSummaryView.controls[iSlideId].typeareaText.val();
						
						$.each(sentences, function(key,val){
							var highlight = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
							$.each(highlight_txt, function(k,sentence_arr)
							{							
								if($.inArray(val.id,sentence_arr) != -1)
								{
									highlight = 'style="background-color:'+ASSIGNMENTS.c_a_HIGHLIGHT_COLOR[k]+'"';
								}
							});
							
							drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
							brtxt = appendBrTag(summaryText, val.text);			
							drill_text += brtxt;
						});
						
						// For \n to br replacement
						drill_text = drill_text.replace(/\n/g, '<br />');
						
						/* hint text*/
						var current_slide = AssigmentSlides.getCurrentActiveSlide();
						var current_slide_reference_key = current_slide.attr('reference-key').split('___');
						var slide_obj_key = current_slide_reference_key[3];		
						var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.text;
						IwtsSummaryView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.links;		
						
						$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT);
						$("#score_container").hide();
						$('.check_work_drill_container').show();
						$('#chckwrk_drill_text').html('<p>'+drill_text+'</p>');
						$('#chckwrk_drill_hint_txt').html(hint_text);
						$('.backtofeedbck').show();
						IwtsSummaryView.bindDrilledEvents();
						IwtsSummaryView.resize();
						
						if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
							SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_DRILLED_VERBID, sItemId);
						}
					});
	
	$(".irrelevant_drill")
		.parent()
			.parent()
				.parent()
					.off("click tap " + sWindowsEventType)
					.on("click tap " + sWindowsEventType, function () {
								
						var obj = IwtsSummaryView.checkWorkData.summaryFeedback;
						var highlight_topics = obj.irrelevancyFeedback.irrelevantSentences;
						var sentences = obj.sentences;
						var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
						
						var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
						sContainerId = oCurrentSlide.attr('id'),
						aSlideIdChunks = sContainerId.split('___'),
						iSlideId = aSlideIdChunks.last();
						var summaryText = IwtsSummaryView.controls[iSlideId].typeareaText.val();
						
						$.each(sentences, function(key,val){			
							var highlight = ($.inArray(val.id,highlight_topics) != -1)?'style="background-color:yellow"':GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
							
							drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
							brtxt = appendBrTag(summaryText, val.text);			
							drill_text += brtxt;
						});
						
						// For \n to br replacement
						drill_text = drill_text.replace(/\n/g, '<br />');
						
						/* hint text*/
						var current_slide = AssigmentSlides.getCurrentActiveSlide();
						var current_slide_reference_key = current_slide.attr('reference-key').split('___');
						var slide_obj_key = current_slide_reference_key[3];		
						var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.irrelevancyFeedback.text;
						IwtsSummaryView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.irrelevancyFeedback.links;
						
						$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_UNRELATED_IDEAS_TXT);
						$("#score_container").hide();
						$('.check_work_drill_container').show();
						$('#chckwrk_drill_text').html('<p>'+drill_text+'</p>');
						$('#chckwrk_drill_hint_txt').html(hint_text);
						$('.backtofeedbck').show();
						IwtsSummaryView.bindDrilledEvents();
						IwtsSummaryView.resize();
						
						if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
							SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_DRILLED_VERBID, sItemId);
						}
						
					});
	
	$(".copying_drill")
		.parent()
			.parent()
				.parent()
					.off("click tap " + sWindowsEventType)
					.on("click tap " + sWindowsEventType, function () {
							
						var obj = IwtsSummaryView.checkWorkData.summaryFeedback;						
						var sentences = obj.sentences;
						var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
						
						var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
						sContainerId = oCurrentSlide.attr('id'),
						aSlideIdChunks = sContainerId.split('___'),
						iSlideId = aSlideIdChunks.last();
						var summaryText = IwtsSummaryView.controls[iSlideId].typeareaText.val();						
						
						var highlight_words = obj.copyingFeedback.copiedPhrases;
					
						var pos_arr = new Array();
						var j = 0;
						$.each(highlight_words, function(k,word_id) {							
							var prependStr = '<span style="background-color:yellow">';
							var appendStr = '</span>';
							$.each(word_id.positions, function(key,pos) {
								pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
								j++;
							});
						});	
												
						summaryText = highlightWords(summaryText,pos_arr);
						
						// For \n to br replacement
						summaryText = summaryText.replace(/\n/g, '<br />');
						
						/*hint text*/
						var current_slide = AssigmentSlides.getCurrentActiveSlide();
						var current_slide_reference_key = current_slide.attr('reference-key').split('___');
						var slide_obj_key = current_slide_reference_key[3];		
						var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.copyingFeedback.text;
						IwtsSummaryView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.copyingFeedback.links;
						
						$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_COPYING_TXT);
						$("#score_container").hide();
						$('.check_work_drill_container').show();
						$('#chckwrk_drill_text').html('<p>'+summaryText+'</p>');
						$('#chckwrk_drill_hint_txt').html(hint_text);
						$('.backtofeedbck').show();
						IwtsSummaryView.bindDrilledEvents();
						IwtsSummaryView.resize();
						
						if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
							SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_DRILLED_VERBID, sItemId);
						}						
					});
	
	$(".spell_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = IwtsSummaryView.checkWorkData.summaryFeedback;
		//var summary = CodeToSpecialChar(obj.summary);
		var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last();
		var summary = IwtsSummaryView.controls[iSlideId].typeareaText.val();
		var highlight_words = obj.spellingFeedback.misspelledWords;
					
		var pos_arr = new Array();
		var j = 0;
		$.each(highlight_words, function(k,word_id) {
			var highlight_txt = word_id.word;
			var prependStr = '<span style="background-color:yellow">';
			var appendStr = '</span>';
			$.each(word_id.positions, function(key,pos) {
				pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
				j++;
			});
		});	
		summary = highlightWords(summary,pos_arr);
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');

		/* hint text */		
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.text;
		IwtsSummaryView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.links;
		
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_SPELLING_TXT);
		$("#score_container").hide();
		$('.check_work_drill_container').show();
		$('#chckwrk_drill_text').html('<p>'+summary+'</p>');
		$('#chckwrk_drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();	
		IwtsSummaryView.bindDrilledEvents();
		IwtsSummaryView.resize();
		
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_SUMMARY_FEEDBACK_DRILLED_VERBID, sItemId);
		}
	});
	
	$('.backtofeedbck').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE);
		$("#score_container").show();
		$('.drill_container').hide();		
		$('.backtofeedbck').hide();
		IwtsSummaryView.resize();
	});
};

IwtsSummaryView.bindDrilledEvents = function () {
	$('#chckwrk_drill_hint_txt a').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(e){
		e.preventDefault();
		var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		var linkText = _.pluck([IwtsSummaryView.drilledlinks], linkTxt );
		IwtsSummaryView.feedbackHead = $('.new_tab_space_title_tab h3').text();
		$('.new_tab_space_title_tab h3').text(linkText[0].title);
		$('.hint_tab_space_inner').hide();
		$('#chckwrk_drill_text').hide();
		$('#link_text').html('<p>'+linkText[0].text+'</p>').show();
		$('.back_bttn').hide();
		$('.backtodrill').show();
		IwtsSummaryView.resize();
	});
	
	$('.backtodrill').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(IwtsSummaryView.feedbackHead);
		$(".hint_tab_space_inner").show();
		$('#chckwrk_drill_text').show();
		$('#link_text').hide();	
		$('.back_bttn').hide();		
		$('.backtofeedbck').show();
		IwtsSummaryView.resize();
	});
}

IwtsSummaryView.loadInstruction = function (oSelf) { 
	
    $(this).addClass('active');
    
	$("#feedback_tab").removeClass('active');
	$('.new_tab_space_title_tab .back_bttn').hide();
	$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_INSTRUCTION_TAB_TITLE));
	$("#feedback_content").empty().html(_.template($("#iwtsummaryinstruction").html(),{"data":oSelf.model.text.text}));
    
    setTimeout(function(){
        $('#instructionText a').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, function (oEvent) {
			oSelf.linksCall.call(this, oEvent, oSelf);
		});
    },200);
}

IwtsSummaryView.loadFeedback = function () {
    $(this).addClass('active');
    $("#instruction_tab").removeClass('active');
    
    $('.new_tab_space_title_tab .back_bttn').hide();

    $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));     
	
	if (IwtsSummaryView.smmaryScored == true) {
		$('#instructionText').empty().html('<p>'+ASSIGNMENTS.c_s_SUMMARY_SCORED_MSG+'</p>');
		return false;
	}
	else if (IwtsSummaryView.feedbackInfo != null) {
		$('#instructionText').empty().html(IwtsSummaryView.feedbackInfo);
	}
    else if ($("#getFeedback").hasClass('active') && 
			typeof IwtsSummaryView.checkWorkData != 'undefined' && 
			IwtsSummaryView.checkWorkData != null) {        
        IwtsSummaryView.setFeedbackVal();
    }
    else {
        var feedbackTxt = ASSIGNMENTS.c_s_FEEDBACK_TXT_BEFORE_TAB;
        $('#instructionText').empty().html(feedbackTxt);
    }
	
	if(IwtsSummaryView.savedDataLoaded == true)
	{
		IwtsSummaryView.retrieveScore();
	}
    
}

IwtsSummaryView.linksCall = function (e, oSelf) {
    e.preventDefault(); 
    
    $('.backtoinst').show();
    
    var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);   
    var linkText = _.pluck([oSelf.model.text.links], linkTxt);        
    
    $(".summary_right_box .new_tab_space_title_tab h3").html(linkText[0].title);
    
    $("#instructionText").html(linkText[0].text); 
}

IwtsSummaryView.submitEnable = function () {    
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last(),
		attr = IwtsSummaryView.controls[iSlideId].typeareaText.attr('readonly');
	
	if (typeof attr !== 'undefined' && attr !== false) {
		return false;
	}
	
	if ($.trim(IwtsSummaryView.controls[iSlideId].typeareaText.val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		$("#getFeedback").removeClass('btndisabled disabled').addClass('active');
	}
	else {
		$("#getFeedback").addClass('btndisabled disabled').removeClass('active');
	}
	$('#btnsubmit_summary').addClass("btndisabled disabled");
};

IwtsSummaryView.print = function () {};

IwtsSummaryView.email = function () {};

IwtsSummaryView.resize = function () {	
	var window_height = $(window).height(),
		header = $("header").outerHeight(),
		actual_height = window_height - header;	
	
	$('.pagination').css("bottom","10px");
	
	var slide_id = AssigmentSlides.referenceKey + "___" + IwtsSummaryView.slideIdx;
	/***** left box height and margin top ******/	
					
	var top_gap = 70;
	var continent_box_space = $("#"+slide_id+" .continent_box_space");
	
	var left_box_height = actual_height - top_gap; // margin top bottom 50px			
	var left_box_inner_height = left_box_height - 12; // border deducted
	
	continent_box_space.css("height",left_box_height+'px');
	$("#"+slide_id+" .continent_box_inner").css("height",left_box_inner_height);	
	
	var top_bottom_gap =  actual_height - continent_box_space.height();
	var margin_top = top_bottom_gap/2;	
	
	$('#'+slide_id+' .slider_swiper_inner').css('margin-top',margin_top+'px');
	
	/***** right box height and margin top *****/			
	var right_box_height = left_box_height - 50; // margin top bottom 25px and border 6px
	
	$("#"+slide_id+" .continent_edit_box").css("height",right_box_height+'px');		
	
	$("#"+slide_id+" .continent_edit_box.new_tab_space.left_conts_place.summary_right_box .right_conts_element").css("height",right_box_height+'px');			
		
	var right_margin_top = (continent_box_space.height() - $("#"+slide_id+" .continent_edit_box").height())/2 - 6; // border deducted
	$("#"+slide_id+" .continent_edit_box").css('margin-top',right_margin_top+'px');			
	

	/******************************************/
    
    var cont_height = parseInt($('#'+slide_id+' .continent_box_inner').height());

    var bttn_box_height = 0;
    if ($('#'+slide_id+' .edit_box_title').length) {
		bttn_box_height = $('#'+slide_id+' .edit_box_title').height();
    }
	
	if ($('#'+slide_id+' .get_feedback').length) {
		bttn_box_height = bttn_box_height + parseInt($('#'+slide_id+' .get_feedback').css('margin-top')) + parseInt($('#'+slide_id+' .get_feedback').css('margin-bottom')) +  parseInt($('#'+slide_id+' .get_feedback').css('padding-top')) +  parseInt($('#'+slide_id+' .get_feedback').css('padding-bottom'));
	}
	
	if ($('#'+slide_id+' .text_container').length) {
		bttn_box_height = bttn_box_height + $('#'+slide_id+' .text_container').height();
	}
	
    var txt_box_height = cont_height - bttn_box_height - 120;
	$('#'+slide_id+' .continent_content_inner .text_box_area').css('height',txt_box_height+'px');
	
	setTimeout(function(){
		var feedback_content_height = $("#"+slide_id+" .continent_conts").height() - $('#'+slide_id+' .new_tab_space_title').height() - $('#'+slide_id+' .new_tab_space_title_tab').height() - 25;	
		$('#'+slide_id).find("#feedback_content").css("height",feedback_content_height);
		
		$('#'+slide_id).find('#instructionText').css("max-height",(feedback_content_height - 50)+'px');
		
		if($('.drill_container .new_tab_space_inner .scroller_panel').length && $('.drill_container .new_tab_space_inner .scroller_panel').is(":visible"))
		{			
			var drill_height = feedback_content_height - $('.drill_container .hint_tab_space_inner:visible').height() - parseInt($('.drill_container').css('padding-top')) - parseInt($('.drill_container').css('padding-bottom')) - parseInt($('.drill_container .hint_tab_space_inner').css('margin-bottom')) - parseInt($('.new_tab_space_inner').css('padding-top')) - parseInt($('.new_tab_space_inner').css('padding-bottom')) - 30;
			
			$('.drill_container .new_tab_space_inner .scroller_panel').css('height',drill_height);
		}
	}, 100);	
};

function IWTHighlightSlide () {}

IWTHighlightSlide.slideIdx = null;
IWTHighlightSlide.model = null;
IWTHighlightSlide.submitBtn = null;
IWTHighlightSlide.yellowMarkarBtn = null;
IWTHighlightSlide.redMarkarBtn = null;
IWTHighlightSlide.typeareaText = null;
IWTHighlightSlide.eraser = null;
IWTHighlightSlide.currentColor = null;
IWTHighlightSlide.highlighter = null;
IWTHighlightSlide.myTimeout = 0;
IWTHighlightSlide.aSlideInfo = [];
IWTHighlightSlide.maximumTry = 2;


IWTHighlightSlide.updateAttemptData4Slide = function (oCurrentSlide) {
	var oSelf = this,
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sItemId = aSlideIdChunks[1],
		iSlideId = aSlideIdChunks.last(),
		oStatus = oSelf.slideStatuses[iSlideId].getStatus(),
		iAttemptCount = (('attemptCount' in oStatus)? (oStatus['attemptCount']? oStatus['attemptCount']: '0'): '0'),
		oScoreIdx = {
			'1': 'FIRST',
			'2': 'SECOND'
		},
		dSlideScore = (
			(iAttemptCount == '0')?
			GENERAL.c_s_CHARACTER_ZERO:
			(
				(oStatus['success'])?
				ASSIGNMENTS['c_s_HIGHLIGHT_' + oScoreIdx[iAttemptCount] + '_TRIAL_SCORE']:
				GENERAL.c_s_CHARACTER_ZERO
			)
		),
		oSlideInfo = {
			"slideID": iSlideId,
			"slideType": ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE,
			"slideAttempt": iAttemptCount,
			"slideIsCorrect": (
				(oStatus['success'])?
				oStatus['success']:
				GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
			),
			"slideScore": dSlideScore,
			"slideInputData": oStatus
		};
		
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	if (typeof oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined') {
		if (typeof AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS];
		}
		else if (typeof oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')];
		}
	}
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	if (typeof bIsSubmitted == 'undefined' || bIsSubmitted == null) {
		bIsSubmitted = false;
	}
	if (
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		AssigmentSlides.studentAttemptData == null
	) {
		AssigmentSlides.studentAttemptData = {
			"itemId": sItemId,
			"itemSlides": new Array (),
			"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_IWTS
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = new Array ();
	}
	/*==== Gather Slide Info ====*/	
	var iSlideNumber = 0;
	for (; iSlideNumber < AssigmentSlides.studentAttemptData.itemSlides.length; iSlideNumber++) {		
		if (
			AssigmentSlides.studentAttemptData.itemSlides[iSlideNumber].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE &&
			AssigmentSlides.studentAttemptData.itemSlides[iSlideNumber].slideID == iSlideId
		) {
			AssigmentSlides.studentAttemptData.itemSlides[iSlideNumber] = oSlideInfo;
			break;
		}
	}
	if (iSlideNumber == AssigmentSlides.studentAttemptData.itemSlides.length) {
		AssigmentSlides.studentAttemptData.itemSlides.push(oSlideInfo);
	}
	/*== End Gather Slide Info ==*/
	AssigmentSlides.studentAttemptData['itemSlides'] = _.sortBy(
		AssigmentSlides.studentAttemptData['itemSlides'],
		function (oSlideInfo) {
			return parseInt(oSlideInfo.slideID);
		}
	)
};

IWTHighlightSlide.updateAttemptData = function (oCurrentSlide, bIsSubmitted) {
	var oSelf = this;
	
	oSelf.updateAttemptData4Slide(oCurrentSlide);
	if (bIsSubmitted) {
		AssigmentSlides.setAttemptData();
	}
	return true;
};

IWTHighlightSlide.init = function (slideIdx, model) {
	var oSelf = this;
	//Initialize Properties
    oSelf.slideIdx = slideIdx;
	oSelf.model = model;
	if (
		!('controls' in oSelf) ||
		typeof oSelf.controls == 'undefined' ||
		typeof oSelf.controls != 'object' ||
		oSelf.controls == null
	) {
		oSelf.controls = {};
	}
	if (
		!('slideStatuses' in oSelf) ||
		typeof oSelf.slideStatuses == 'undefined' ||
		typeof oSelf.slideStatuses != 'object' ||
		oSelf.slideStatuses == null
	) {
		oSelf.slideStatuses = {};
	}
	
    oSelf.render();
	oSelf.loadControls();
	oSelf.bindEvents();
};

IWTHighlightSlide.loadControls = function () {
	var oSelf = this,
		iSlideIndex = oSelf.slideIdx,
		sContainerId = AssigmentSlides.referenceKey + "___" + iSlideIndex,
		aContainerIdChunks = sContainerId.split('___');
	
	oSelf['controls'][iSlideIndex] = {};
	
	oSelf['controls'][iSlideIndex].submitBtn = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_HIGHLIGHT_SUBMIT_BTN_SELECTOR);
	oSelf['controls'][iSlideIndex].readingCheckPointBtn = $("#" + aContainerIdChunks[1] + '-' + ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE + '-' + iSlideIndex + '-reading-checkpoint');
	oSelf['controls'][iSlideIndex].submitBtn.data("tryCount", 0);
	oSelf['controls'][iSlideIndex].yellowMarkarBtn = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_RANGY_YELLOWMARKAR);
	oSelf['controls'][iSlideIndex].redMarkarBtn = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_RANGY_REDMARKAR);
	
	oSelf['controls'][iSlideIndex].typeareaText = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_RANGY_SELECTION_BOX);
	oSelf['controls'][iSlideIndex].eraser = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_RANGY_ERASER);
	
	oSelf['controls'][iSlideIndex].failAgainText = $('#' + sContainerId + ' .highlight_fail_again_text');
	oSelf['controls'][iSlideIndex].failText = $('#' + sContainerId + ' .highlight_fail_text');
	oSelf['controls'][iSlideIndex].passText = $('#' + sContainerId + ' .highlight_pass_text');
	oSelf['controls'][iSlideIndex].instructorText = $('#' + sContainerId + ' .highlight_instrction');
	oSelf['controls'][iSlideIndex].leftContent = $('#' + sContainerId + ' .continent_content_inner');
	oSelf['controls'][iSlideIndex].editBoxTitle = $('#' + sContainerId + ' .edit_box_title');
	
	oSelf.slideStatuses[iSlideIndex] = new (function () {
		var oStatus = {
				'visited':		false,
				'isComplete':	false
			},
			bRetrieved = false;
		
		this.update = function (oCurrentSlide) {
			var sContainerId = oCurrentSlide.attr('id'),
				iSlideId = sContainerId.split('___').last(),
				oAnswerSheet = $('#' + sContainerId + ' .box_outer_space').find('.continent_edit_box');
			
			oStatus['answerSheetVisible'] = (oAnswerSheet.css('opacity') == '1');
			oStatus['penEnabled'] = {
				'yellow':	[],
				'red':		[]
			};
			oSelf['controls'][iSlideId].yellowMarkarBtn.each(function () {
				oStatus['penEnabled']['yellow'].push(
					(
						$(this).hasClass('active') &&
						!$(this).hasClass('disabled') &&
						!$(this).parent().hasClass('disable_tools')
					)
				);
			});
			oSelf['controls'][iSlideId].redMarkarBtn.each(function () {
				oStatus['penEnabled']['red'].push(
					(
						$(this).hasClass('active') &&
						!$(this).hasClass('disabled') &&
						!$(this).parent().hasClass('disable_tools')
					)
				);
			});
			oStatus['eraserEnabled'] = (
				oSelf['controls'][iSlideId].eraser.hasClass('active') &&
				!oSelf['controls'][iSlideId].eraser.hasClass('disabled') &&
				!oSelf['controls'][iSlideId].eraser.parent().hasClass('disable_tools')
			);
			
			oSelf.updateAttemptData(oCurrentSlide);
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
		this.updateByData = function (oCurrentSlide, oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData(oCurrentSlide);
		};
		this.updateStatusByData = function (oCurrentSlide, oData) {
			// oStatus = jQuery.extend(true, oStatus, oData);
			for (var sKey in oData) {
				if (typeof oStatus[sKey] != 'undefined') {
					delete oStatus[sKey];
				}
				if (typeof oData[sKey] == 'object') {
					if (oData[sKey] instanceof Array) {
						oStatus[sKey] = new Array ();
						for (var iIdx = 0; iIdx < oData[sKey].length; iIdx++) {
							oStatus[sKey].push(oData[sKey][iIdx]);
						}
						continue;
					}
					oStatus[sKey] = {};
					for (var sIdx in oData[sKey]) {
						oStatus[sKey][sIdx] = oData[sKey][sIdx];
					}
					continue;
				}
				oStatus[sKey] = oData[sKey];
			}
			oSelf.updateAttemptData4Slide(oCurrentSlide);
		};
		this.getIsComplete = function () {
			return (oStatus['isComplete'] == true);
		};
		this.getIsRetrieved = function () {
			return bRetrieved;
		};
		this.setIsRetrieved = function (bRetrieveStatus) {
			bRetrieved = bRetrieveStatus;
		};
	});
	oSelf.setControls();
};

IWTHighlightSlide.setControls = function () {
	var oSelf = this,
		iSlideIndex = oSelf.slideIdx;
	
	oSelf['controls'][iSlideIndex].failAgainText.hide();
	oSelf['controls'][iSlideIndex].failText.hide();
	oSelf['controls'][iSlideIndex].passText.hide();
	oSelf['controls'][iSlideIndex].instructorText.show();
};

IWTHighlightSlide.render = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx,
		iSlideIndex = iSlideId;

	var innerContent = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		aContainerIdChunks = AssigmentSlides.referenceKey.split('___'),
		oVar = {
			'data':							oSelf.model,
			'mediaPath':					AssigmentSlides.mediaPath,
			'referenceKey': 				AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
			'readingCheckPointButtonId': 	aContainerIdChunks[1] + '-' + ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE + '-' + iSlideId + '-reading-checkpoint',
			'slideType':					ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE
		};
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE).html(),
			oVar
		)
	);
	
	/*==== Update Master Data-Store ====*/
	var sContainerId = AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
		aSlideIdChunks = sContainerId.split('___'),
		sItemId = aSlideIdChunks[1],
		sSlideType = ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE,
		iSlideAttempt = 0,
		sSlideIsCorrect = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSlideScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSubmitStatus = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sReAssignStatus = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sItemType = aSlideIdChunks[2],
		iSlideId = aSlideIdChunks.last(),
		oSlideInputData = {},
		oSlideData = {
			'slideID':			iSlideId,
			'slideType': 		sSlideType,
			'slideAttempt':		iSlideAttempt,
			'slideIsCorrect':	sSlideIsCorrect,
			'slideScore':		sSlideScore,
			'slideInputData':	oSlideInputData
		};
	
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		typeof AssigmentSlides.studentAttemptData != 'object' ||
		AssigmentSlides.studentAttemptData == null ||
		!('itemId' in AssigmentSlides.studentAttemptData) ||
		AssigmentSlides.studentAttemptData.itemId != sItemId
	) {
		AssigmentSlides.studentAttemptData = {
			'itemId': 			sItemId,
			'itemSlides':		[],
			'submitStatus': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType': 		ASSIGNMENTS.c_s_ASSIGNMENT_IWTS
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == iSlideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = oSlideData;
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push(oSlideData);
	}
	/*== End Update Master Data-Store ==*/
	
	IWTHighlightSlide.resize();
}

IWTHighlightSlide.resize = function () {
	var oSelf = this,
		sContainerId = AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
		oLayout = new HeightManager([
			{
				selector:	'#' + sContainerId + ' .box_outer_space',
				formula:	'90%',
				kids:[
					{
						selector:	'.continent_box_space',
						formula:	'100%',
						kids:	[
							{
								selector:	'.continent_box_inner',
								formula:	'100%',
								kids:		[
									{
										selector:	'.continent_content_inner',
										formula:	function (oElement, dBaseHeight) {
											var dSubtrahend = 0;
											for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
												dSubtrahend += (
													$(oElement).siblings().eq(iIdx).height() +
													parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
													parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
													parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
													parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
												);
											}
											$(oElement).css({
												'overflow-x':	'hidden',
												'overflow-y':	'auto'
											});
											return (dBaseHeight - dSubtrahend);
										}
									}
								]
							}
						]
					},
					{
						selector:	'.continent_edit_box',
						formula:	function (oElement, dBaseHeight) {
							$(oElement).css({'margin-top': '25px'});
							return (dBaseHeight - 50);
						},
						kids:		[
							{
								selector:	'.continent_wrap_box',
								formula:	function (oElement, dBaseHeight) {
									$(oElement).css({
										'overflow-x':	'hidden',
										'overflow-y':	'auto'
									});
									return '83%';
								}
							}
						]
					}
				]
			}
		]),
		dTopGap = 50, // Found from CSS
		dHeight = ($(window).height() - $("header").outerHeight() - dTopGap * 2);
	
	if (oPlatform.isIOS()) {
		if (typeof AssignmentsView.iOSVersion == 'undefined') {
			aMatches = navigator.userAgent.match(/iPad;.*CPU.*OS ([0-9]+)_\d/i);
			AssignmentsView.iOSVersion = parseInt(aMatches[1]);
		}
		if (AssignmentsView.iOSVersion < 8) {
			dHeight = (screen.availWidth - $("header").outerHeight() - dTopGap * 2);
		}
	}
	
	oLayout.setBaseHeight(dHeight);
	oLayout.setHeight();
};

IWTHighlightSlide.retrieveStatus4mData = function (oSlideInfo) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sItemId = aSlideIdChunks.fetch(1),
		iSlideId = aSlideIdChunks.last(),
		sSlideType = oCurrentSlide.data('slide-type');
		
	if (oCurrentSlide.data('slide-type') != ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE) {
		return;
	}
	
	oSelf['controls'][iSlideId].yellowMarkarBtn.each(function (iIndex) {
		if ('penEnabled' in oSlideInfo && oSlideInfo['penEnabled'] != null) {
			if ('yellow' in oSlideInfo['penEnabled'] && oSlideInfo['penEnabled']['yellow'] != null) {
				if (oSlideInfo['penEnabled']['yellow'][iIndex]) {
					jQuery(this).addClass('active');
					oSelf.currentColor = 'y';
				}
			}
		}
	});
			
	oSelf['controls'][iSlideId].redMarkarBtn.each(function (iIndex) {
		if ('penEnabled' in oSlideInfo && oSlideInfo['penEnabled'] != null) {
			if ('red' in oSlideInfo['penEnabled'] && oSlideInfo['penEnabled']['red'] != null) {
				if (oSlideInfo['penEnabled']['red'][iIndex]) {
					jQuery(this).addClass('active');
					oSelf.currentColor = 'r';
				}
			}
		}
	});
	if ('eraserEnabled' in oSlideInfo && oSlideInfo['eraserEnabled'] != null) {
		if (oSlideInfo['eraserEnabled']) {
			oSelf['controls'][iSlideId].eraser.addClass('active');
			oSelf.currentColor = 'null';
		}
	}		
	if ('answerSheetVisible' in oSlideInfo && oSlideInfo['answerSheetVisible'] != null) {
		if (oSlideInfo['answerSheetVisible'] == true) {
			$('#' + sContainerId + ' .continent_edit_box').css({'opacity':'1', 'left':'0'});
			
			/*==== Hide Input Answer Button & Show Full Left Content ====*/
			var dContentInnerHeight = oSelf['controls'][iSlideId].leftContent.height(),
				dEditBoxTitleHeight = oSelf['controls'][iSlideId].editBoxTitle.height(),
				dEditBoxPaddingTop = parseInt(oSelf['controls'][iSlideId].editBoxTitle.css('padding-top')),
				dEditBoxPaddingBottom = parseInt(oSelf['controls'][iSlideId].editBoxTitle.css('padding-bottom')),
				dHeight = dContentInnerHeight + (dEditBoxTitleHeight + dEditBoxPaddingTop  + dEditBoxPaddingBottom);
			if (oSelf['controls'][iSlideId].readingCheckPointBtn.parent().is(':visible')) {
				oSelf['controls'][iSlideId].leftContent.animate({ 'max-height':	dHeight + 'px' });
				oSelf['controls'][iSlideId].readingCheckPointBtn.parent().hide();
			}
			/*==== Hide Input Answer Button & Show Full Left Content ====*/
		}
		var oClass = {
			'y':	'Yellow',
			'r':	'Red'
		};
		
		switch (oSlideInfo.attemptCount) {
			case oSelf.maximumTry:
				oSelf.showCorrectAns();
				
				oSelf['controls'][iSlideId].failText.hide();
				oSelf['controls'][iSlideId].instructorText.hide();
				oSelf['controls'][iSlideId].failAgainText.hide();
				oSelf['controls'][iSlideId].passText.hide();
				
				if (oSlideInfo['success']) {
					oSelf['controls'][iSlideId].passText.show();
				}
				else {
					oSelf['controls'][iSlideId].failAgainText.show();
				}
				
				oSelf['controls'][iSlideId].submitBtn.hide();
				oSelf['controls'][iSlideId].submitBtn.next('div')
					.addClass('disable_tools')
					.find('button')
						.removeClass('active')
						.addClass('disabled');
						
				AssigmentSlides.slidingEngine.unFreezeNextSlides();
				break;
			case '1':
			case 1:
				oSelf['controls'][iSlideId].submitBtn.data("tryCount", "1");
				
				oSelf['controls'][iSlideId].failText.hide();
				oSelf['controls'][iSlideId].instructorText.hide();
				oSelf['controls'][iSlideId].failAgainText.hide();
				oSelf['controls'][iSlideId].passText.hide();
				
				if (oSlideInfo.success) {
					oSelf.showCorrectAns();
				
					oSelf['controls'][iSlideId].passText.show();
					oSelf['controls'][iSlideId].submitBtn.hide();
					oSelf['controls'][iSlideId].submitBtn.next('div')
						.addClass('disable_tools')
						.find('button')
							.removeClass('active')
							.addClass('disabled');
							
					AssigmentSlides.slidingEngine.unFreezeNextSlides();
				}
				else {
					/*==== Regain Previous Highlight ====*/					
					if ('selectionSequence' in oSlideInfo) {
						for (var sColour in oSlideInfo['selectionSequence']) {
							for (var iColIdx = 0; iColIdx < oSlideInfo['selectionSequence'][sColour].length; iColIdx++) {
								var sSelectionClass = 'seqClass' + oSlideInfo['selectionSequence'][sColour][iColIdx];
								jQuery('#' + sContainerId + ' .' + sSelectionClass).addClass('highlight' + oClass[sColour]);
							}
						}
					}
					/*== End Regain Previous Highlight ==*/
					
					oSelf['controls'][iSlideId].failText.show();
				}
				break;
				
			case '0':
			case 0:
			default:
				/*==== Regain Previous Highlight ====*/
				if ('selectionSequence' in oSlideInfo) {
					for (var sColour in oSlideInfo['selectionSequence']) {
						for (var iColIdx = 0; iColIdx < oSlideInfo['selectionSequence'][sColour].length; iColIdx++) {
							var sSelectionClass = 'seqClass' + oSlideInfo['selectionSequence'][sColour][iColIdx];
							jQuery('#' + sContainerId + ' .' + sSelectionClass).addClass('highlight' + oClass[sColour]);
						}
					}
				}
				/*== End Regain Previous Highlight ==*/
				break;
		}
	}
	
	if (oSelf.slideStatuses[iSlideId]) {
		oSelf.slideStatuses[iSlideId].update(oCurrentSlide);
		oSelf.slideStatuses[iSlideId].updateByData(oCurrentSlide, oSlideInfo);
	}
	oSelf.resize();
};

IWTHighlightSlide.retrieveStatus = function () {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sAssignmentId = aSlideIdChunks.fetch(1),
		iSlideId = aSlideIdChunks.last(),
		oSlideInfo = {},
		aItemSlides = [];
		
	if ((oSlideInfo = AssigmentSlides.getStudentAttemptForGradableItem(sAssignmentId)) == null) {
		oSlideInfo = {};
	}
	else if ((aItemSlides = _.where(oSlideInfo.itemSlides, {'slideID': iSlideId})).length > 0) {
		oSlideInfo = aItemSlides.first()['slideInputData'];
	}
	else {
		oSlideInfo = {};
	}
	
	oSelf.retrieveStatus4mData(oSlideInfo);
	
	/*==== Update Status to Retrieved: true ====*/
	if (oSelf.slideStatuses[iSlideId]) {
		oSelf.slideStatuses[iSlideId].setIsRetrieved(true);
	}
	/*== End Update Status to Retrieved: true ==*/
};

IWTHighlightSlide.bindEvents = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx;
	
	oSelf['controls'][iSlideId].yellowMarkarBtn.off("click " + sWindowsEventType).on("click " + sWindowsEventType, function () {
		oSelf.selectYellowColor.call(this, oSelf);
	});
	oSelf['controls'][iSlideId].redMarkarBtn.off("click " + sWindowsEventType).on("click " + sWindowsEventType, function () {
		oSelf.selectRedColor.call(this, oSelf);
	});
	oSelf['controls'][iSlideId].eraser.off("click " + sWindowsEventType).on("click " + sWindowsEventType, function () {
		oSelf.eraseColor.call(this, oSelf);
	});
	/*==== IPP-945 ====*/
	//rangy.init();
	//oSelf['controls'][iSlideId].highlighter = rangy.createHighlighter();
	/*== End IPP-945 ==*/
	oSelf['controls'][iSlideId].submitBtn.off("click " + sWindowsEventType).on("click " + sWindowsEventType, function () {
		oSelf.submitAnswer.call(this, oSelf);
	});
}

IWTHighlightSlide.selectYellowColor = function (oSelf) {
    if ($(this).parent().hasClass('disable_tools')) { 
		return false;
	}
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		iSlideId = oCurrentSlide.attr("reference-key").split("___").pop();
    oSelf['controls'][iSlideId].redMarkarBtn.removeClass('active');
    oSelf['controls'][iSlideId].eraser.removeClass('active');
	
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
		oSelf.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	}
	else {
		$(this).addClass('active')
		oSelf.currentColor = 'y';
	}
	
	/*==== Update Slide Status ====*/
	oSelf.slideStatuses[iSlideId].update(oCurrentSlide);
	/*== End Update Slide Status ==*/
}

IWTHighlightSlide.selectRedColor = function (oSelf) {
    if ($(this).parent().hasClass('disable_tools')) {
		return false;
	}
    var	oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		iSlideId = oCurrentSlide.attr("reference-key").split("___").pop();
    oSelf['controls'][iSlideId].yellowMarkarBtn.removeClass('active');
    oSelf['controls'][iSlideId].eraser.removeClass('active');

	if ($(this).hasClass('active') == false) {
		$(this).addClass('active')
		oSelf.currentColor = 'r';
	}
	else{
		$(this).removeClass('active');
		oSelf.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	}
	
	/*==== Update Slide Status ====*/
	oSelf.slideStatuses[iSlideId].update(oCurrentSlide);
	/*== End Update Slide Status ==*/
};

IWTHighlightSlide.clearSelection = function(){
	var htmlContent = $('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE+' .rangySelection').html();	
	$('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE+' .rangySelection').html(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
	setTimeout(function(){$('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE+' .rangySelection').html(htmlContent);	},100);
};

IWTHighlightSlide.startSelection = function (val) {   
    var currentHighlight;
    if (IWTHighlightSlide.currentColor == "r") {
        currentHighlight = "highlightRed";        
    }
	else if(IWTHighlightSlide.currentColor == "y") {
        currentHighlight = "highlightYellow";       
    }
    if ($(val).hasClass('.' + currentHighlight)) {
        //$(val).removeClass("."+currentHighlight)
    }
	else {
        $(val).addClass(currentHighlight);
    }

    if (IWTHighlightSlide.currentColor == "null") {
        $(val).removeClass("highlightRed").removeClass("highlightYellow");
    }        
    return false;
}

IWTHighlightSlide.startSentenceSelection = function (oElement) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sCurrentSlideId = oCurrentSlide.attr('id'),
		aSlideIdChunks = oCurrentSlide.attr("reference-key").split("___"),
		iSlideId = aSlideIdChunks.last(),
		oHighlightClasses = {
			'y':	'highlightYellow',
			'r':	'highlightRed'
		},
		sCurrentHighlight = ((oSelf.currentColor in oHighlightClasses)? oHighlightClasses[oSelf.currentColor]: ''),
		sClassNames = oElement.className,
		aMatches = sClassNames.match(/seqClass([0-9]{1,})/),
		bButtonsDiabled = oCurrentSlide.find('.edit_icon_space').hasClass('disable_tools'),
		aRemoveHighlightsFrom = [],
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
	/*==== Ascertain if buttons are disabled ====*/
	if (bButtonsDiabled === false) {
		for (var sControlName in oSelf.controls[iSlideId]) {
			if (sControlName.endsWith('MarkarBtn') || (sControlName == 'eraser')) {
				if (oSelf.controls[iSlideId][sControlName].hasClass('active')) {
					bButtonsDiabled = false;
					break;
				}
				else {
					bButtonsDiabled = true;
				}
			}
		}
	}
	/*== End Ascertain if buttons are disabled ==*/
	
	if (bButtonsDiabled === true) {
		return false;
	}
		
	if (
		aMatches != null &&
		aMatches instanceof Array &&
		aMatches.length > 1
	) {
		var iSelectionSequence = aMatches.fetch(1),
			aHighlightClasses = [];
		
		for (sColour in oHighlightClasses) {
			aHighlightClasses.push(oHighlightClasses[sColour]);
		}
		
		if (sCurrentHighlight.length > 0) { // Add highlight
			$('#' + sCurrentSlideId + ' .seqClass' + iSelectionSequence).removeClass(aHighlightClasses.join(' ')).addClass(sCurrentHighlight);
			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_HIGHLIGHT_ANS_SELECTED_VERBID, sItemId);
			}
		}
		else { // Remove highlight
			var oRegex = new RegExp('(' + aHighlightClasses.join('|') + ')', 'g'),
				sClassNames = $('#' + sCurrentSlideId + ' .seqClass' + iSelectionSequence).attr('class').replace(oRegex, '');
			
			$('#' + sCurrentSlideId + ' .seqClass' + iSelectionSequence).attr('class', sClassNames);
			
			if (aRemoveHighlightsFrom.indexOf(iSelectionSequence) == -1) {
				aRemoveHighlightsFrom.push(iSelectionSequence);
			}
		}
		
		/*==== Update Attempt Data ====*/
		var oSelectionSequence = {};
		for (var sColour in oHighlightClasses) {
			var sHighlightClass = oHighlightClasses[sColour];
			oSelectionSequence[sColour] = new Array ();
			
			for (var iIndex = 0; iIndex < $('#' + sCurrentSlideId + ' .' + sHighlightClass).length; iIndex++) {
				var oElement = $('#' + sCurrentSlideId + ' .' + sHighlightClass).get(iIndex),
					aMatches = [];
				if (aMatches = oElement.className.match(/seqClass([0-9]{1,})/)) {
					var iSequenceNumber = aMatches.fetch(1);
					if (aRemoveHighlightsFrom.indexOf(iSequenceNumber) == -1) {
						if (oSelectionSequence[sColour].indexOf(iSequenceNumber) == -1) {
							oSelectionSequence[sColour].push(iSequenceNumber);
						}
					}
				}
			}
		}
		oSelf['slideStatuses'][iSlideId].updateStatusByData(oCurrentSlide, {'selectionSequence': oSelectionSequence});
		/*== End Update Attempt Data ==*/
	}
};

IWTHighlightSlide.eraseColor = function (oSelf) {
    if ($(this).parent().hasClass('disable_tools')) {
		return false;
	}
	
	var	oCurrentSlide = AssigmentSlides.getCurrentActiveSlide();
		iSlideId = oCurrentSlide.attr("reference-key").split("___").last();
	
    oSelf['controls'][iSlideId].yellowMarkarBtn.removeClass('active');
    oSelf['controls'][iSlideId].redMarkarBtn.removeClass('active');
	if ($(this).hasClass('active') == false) {
		$(this).addClass('active')
		oSelf.currentColor = "null";
	}
	else {
		$(this).removeClass('active');
		oSelf.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	}
	
	/*==== Update Slide Status ====*/
	oSelf.slideStatuses[iSlideId].update(oCurrentSlide);
	/*== End Update Slide Status ==*/
}

IWTHighlightSlide.submitAnswer = function (oSelf) {
	if (typeof $(this).data('disallow') != "undefined") { return false; }
	
	var answerIndexesY, answerIndexesR, trimedText, redText = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		maximumTry = 2, rightAnswerY, rightAnswerR, currentMarkerY, currentMarkerR,
		failText, failAgainText, passText, instructorText,
		results = {y:false ,r:false}, success = false,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		iSlideId = oCurrentSlide.attr('reference-key').split('___').last(),
		iTryCount = parseInt($(this).data('tryCount')),
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]) || GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
	iTryCount++;
	$(this).data('tryCount', iTryCount);
	
	failAgainText = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find(".highlight_fail_again_text");
	failText = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find(".highlight_fail_text");
	passText = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find(".highlight_pass_text");
	instructorText = $('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find(".highlight_instrction");
        
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space button').removeClass('active');        
	
	failAgainText.hide();
	failText.hide();
	passText.hide();
	
	currentMarkerY = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.' + ASSIGNMENTS.c_s_RANGY_YELLOWMARKAR);
	currentMarkerR = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.' + ASSIGNMENTS.c_s_RANGY_REDMARKAR);
	
	var aRedElements = $('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.highlightRed'),
		aRedTextEntries = [];
	for (var iIdx = 0; iIdx < aRedElements.length; iIdx++) {
		aRedTextEntries.push($.trim(aRedElements.eq(iIdx).text()));
	}
	redText = aRedTextEntries.join(' ');
	
	var yellowText = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	var aYellowElements = $('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.highlightYellow'),
		aYellowTextEntries = [];
	for (var iIdx = 0; iIdx < aYellowElements.length; iIdx++) {
		aYellowTextEntries.push($.trim(aYellowElements.eq(iIdx).text()));
	}
	yellowText = aYellowTextEntries.join(' ');
	
	var completeText = AssigmentSlides.model[iSlideId].interactive_text,
		plainText = $('<div/>').html(completeText).text();
	
	answerIndexesY = String(currentMarkerY.attr('correct-answer')).split("-");

	if (answerIndexesY.length != 1) {
		trimedText = $.trim($.trim($('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.rangySelection').text()).split("  ").join(" "));
        trimedText = trimedText.replace(/\s{2,}/g, ' ');
        rightAnswerY = getParticularString(plainText,answerIndexesY[1],answerIndexesY[2]);
		if (rightAnswerY.split(" ").join(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK)==($.trim(yellowText)).split(" ").join(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK)) {
			results.y = true;
		}
	}
	else {
		results.y = true;
	}
	
	answerIndexesR = String(currentMarkerR.attr('correct-answer')).split("-");
	if (answerIndexesR.length != 1) {
		trimedText = $.trim($('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.rangySelection').text());
		rightAnswerR = getParticularString(plainText, answerIndexesR[1], answerIndexesR[2]);
		if (rightAnswerR.split(" ").join(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) == ($.trim(redText)).split(" ").join(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK)) {
			results.r = true;
		}
	}
	else {
		results.r = true;	
	}
	
	(results.r && results.y) ? success=true : success=false;
	instructorText.hide();
	
	if (!success) {
		oSelf.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		failText.show();
		if (iTryCount == maximumTry) {
			oSelf.eraseColor.call(oSelf['controls'][iSlideId].eraser.get(0), oSelf);
			failText.hide();			
			failAgainText.show();
			
			currentMarkerR.removeClass('active');
			currentMarkerY.removeClass('active');
			$(this).data('disallow', 'true');
			$(this).hide();
                        
			oSelf.showCorrectAns();
			oSelf.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, {
				'success':		false,
				'attemptCount':	iTryCount,
				'isComplete':	true
			});
			AssigmentSlides.slidingEngine.unFreezeNextSlides();
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_HIGHLIGHT_ANS_SUBMITTED_VERBID, sItemId);
			}
			
			return;
		}
		oSelf.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, {
			'success':		false,
			'attemptCount':	iTryCount,
			'isComplete':	false
		});
		return;
	}
	
	oSelf.eraseColor.call(oSelf['controls'][iSlideId].eraser.get(0), oSelf);
	oSelf.currentColor = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	
	currentMarkerY.removeClass('active');
	currentMarkerR.removeClass('active');
	
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space').find("button").addClass('disabled');
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space').addClass('disable_tools');                
	passText.show();
	$(this).hide();
	
	oSelf.slideStatuses[iSlideId].updateStatusByData(oCurrentSlide, {
		'success':		true,
		'attemptCount':	iTryCount,
		'isComplete':	true
	});
	AssigmentSlides.slidingEngine.unFreezeNextSlides();
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
		SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_HIGHLIGHT_ANS_SUBMITTED_VERBID, sItemId);
	}
};

IWTHighlightSlide.showCorrectAns = function () {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		aSlideIdChunks = oCurrentSlide.attr("reference-key").split("___"),
		iSlideNumber = aSlideIdChunks.fetch(3),
		sCompleteText = AssigmentSlides.model[iSlideNumber].interactive_text,
		sPlainText = $('<div/>').html(sCompleteText).text(),
		aMarkers = [
			{
				'marker':	'.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_RANGY_YELLOWMARKAR,
				'class':	'Yellow'
			}, {
				'marker':	'.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_RANGY_REDMARKAR,
				'class':	'Red'
			}
		],
		fPutCorrectAnswer = function (psHtml, psFind, psReplace) {
			var oDiv = $('<div/>'), aChildren, sChildrenHtml = '';
			
			oDiv.html(psHtml);
			aChildren = oDiv.children();
			
			if (aChildren.length == 0) {
				oDiv.html(oDiv.html().replace(psFind, psReplace));
			}
			else {
				for (var i = 0; i < aChildren.length; i++) {
					sChildrenHtml += aChildren.eq(i).html();
				}
				var sDivTextContent = oDiv.html().replace(sChildrenHtml, '');
				if (sDivTextContent.indexOf(psFind) > -1) {
					oDiv.html(oDiv.html().replace(psFind, psReplace));
					return oDiv.html();
				}
			}
			
			for (var i = 0; i < aChildren.length; i++) {
				var sChildHtml = aChildren.eq(i).html(),
					sUpdatedHtml = fPutCorrectAnswer(sChildHtml, psFind, psReplace);
				
				aChildren.eq(i).html(sUpdatedHtml);
			}
			
			return oDiv.html();
		};
	
	for (var iIndex = 0; iIndex < aMarkers.length; iIndex++) {
		oCurrentMarker = $('' + aMarkers[iIndex].marker);
		if (oCurrentMarker.length > 0) {
			var aAnswerIndices = String(oCurrentMarker.attr('correct-answer')).split('-'),
				sCorrectText = String(
					sPlainText.substring(
						parseInt(aAnswerIndices[1]),
						(
							parseInt(aAnswerIndices[2]) +
							parseInt(aAnswerIndices[1])
						)
					)
				);
				
			sCompleteText = fPutCorrectAnswer(
				sCompleteText,
				sCorrectText,
				'<span class="highlight' + aMarkers[iIndex].class + '">' + sCorrectText.htmlEntities() + '</span>'
			);
		}
	}
	
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space').find("button").addClass('disabled');
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space').addClass('disable_tools');
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .edit_icon_space button').removeClass('active');
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .rangySelection').html(sCompleteText);
};

IWTHighlightSlide.insertHighlight = function (sCompleteText, sCorrectText, sHighlightClass) {
	var sCompletePlainText = $('<div/>').html(sCompleteText).text(),
		sCorrectPlainText = $('<div/>').html(sCorrectText).text(),
		iMatchFoundAt = -1,
		iMatchIndex = -1, iLastMatchIndex = -1,
		iIndex = 0, iJ = 0;
		
	if (typeof sHighlightClass != 'string' || sHighlightClass.length == 0) {
		sHighlightClass = 'highlightYellow';
	}
		
	if ((iMatchFoundAt = sCompletePlainText.indexOf(sCorrectPlainText)) == -1) {
		return sCompleteText;
	}
	
	for (var iIndex = 0; iIndex < sCompleteText.length; iIndex++) {
		iMatchIndex = iIndex;
		while (sCompleteText.charAt(iMatchIndex) == '<') {
			do {
				iMatchIndex++;
			} while (sCompleteText.charAt(iMatchIndex) != '>');
			iMatchIndex++;
		}
		for (iJ = iMatchIndex, iLastMatchIndex = iMatchIndex; iJ < sCorrectText.length; iJ++, iMatchIndex++) {
			while (sCompleteText.charAt(iMatchIndex) == '<') {
				do {
					iMatchIndex++;
				} while (sCompleteText.charAt(iMatchIndex) != '>');
				iMatchIndex++;
			}
			if (sCorrectText.charAt(iJ).toLowerCase() != sCompleteText.charAt(iMatchIndex).toLowerCase()) {
				iMatchIndex = iLastMatchIndex;
				break;
			}
		}
		if (iJ == sCorrectText.length) {
			var iCharToRight = sCompleteText.length - iLastMatchIndex - 1;
			sCompleteText = sCompleteText.substr(0, iLastMatchIndex + 1) + '<span class="' + sHighlightClass + '">' + sCompleteText.substr(iLastMatchIndex + 1);
			sCompleteText = sCompleteText.substr(0, sCompleteText.length - iCharToRight) + '</span>' + sCompleteText.substr(iCharToRight);
			break;
		}
	}
	return sCompleteText;
};

IWTHighlightSlide.print = function () {
    //window.print();
	/*Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);*/
	//AssignmentsView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
}

function IWTTextAnswerSlide () {}

IWTTextAnswerSlide.slideIdx = null;
IWTTextAnswerSlide.model = null;
IWTTextAnswerSlide._alert = ISeriesBase.prototype._alert;

IWTTextAnswerSlide.init = function (slideIdx, model) {
    var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	if (
		!('controls' in oSelf) ||
		typeof oSelf.controls == 'undefined' ||
		typeof oSelf.controls != 'object' ||
		oSelf.controls == null
	) {
		oSelf.controls = {};
	}
	if (
		!('slideStatuses' in oSelf) ||
		typeof oSelf.slideStatuses == 'undefined' ||
		typeof oSelf.slideStatuses != 'object' ||
		oSelf.slideStatuses == null
	) {
		oSelf.slideStatuses = {};
	}
	
	oSelf.render();
    oSelf.loadControls();
	oSelf.bindEvents();
};

IWTTextAnswerSlide.updateAttemptData4Slide = function (oCurrentSlide) {
	var oSelf = this,
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sAssignmentId = aSlideIdChunks[1],
		iSlideId = aSlideIdChunks.last(),
		sAssignmentType = aSlideIdChunks.first(),
		sSlideType = oCurrentSlide.data('slide-type'),
		iSlideAttempt = 1,
		oSlideStatus = oSelf.slideStatuses[iSlideId].getStatus(),
		oSlideInfo = {
			'slideID':			iSlideId,
			'slideType':		sSlideType,
			'slideAttempt': 	iSlideAttempt,
			'slideIsCorrect': 	true,
			'slideScore':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'slideInputData': 	oSlideStatus
		};
		
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	if (typeof oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined') {
		if (typeof AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS];
		}
		else if (typeof oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')];
		}
	}
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
		
	if (
		typeof bIsSubmitted == 'undefined' ||
		bIsSubmitted == null
	) {
		bIsSubmitted = false;
	}
	
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		AssigmentSlides.studentAttemptData == null ||
		!('itemId' in AssigmentSlides.studentAttemptData) ||
		AssigmentSlides.studentAttemptData['itemId'] != sAssignmentId
	) {
		AssigmentSlides.studentAttemptData = {
			'itemId': 			sAssignmentId,
			'itemSlides': 		[],
			'submitStatus': 	bIsSubmitted,
			'reAssignedStatus': GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType': 		sAssignmentType
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == iSlideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == sSlideType
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = oSlideInfo;
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push(oSlideInfo);
	}
	AssigmentSlides.studentAttemptData['itemSlides'] = _.sortBy(
		AssigmentSlides.studentAttemptData['itemSlides'],
		function (oSlideInfo) {
			return parseInt(oSlideInfo.slideID);
		}
	)
};

var submitIWTAssignment = function () {
	
	/*==== Compute Score: 21-March-2014 ====*/
		var dSystemScore = 0.0,
			dReadingCheckPointScore = 0.0,
			dReadingCheckPointMaxScore = 2.0,
			dReadingCheckPointTotalScore = 0.0,
			iTotalRCAssignments = 0,
			dSummaryScore = 0.0,
			dMaxScore = 0.0,
			dSummaryMaxScore = 4;
			/*==== Student Attempt Summary ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE] = {};
		AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_READING_CHECKPOINT] = 0.0;
		AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_SUMMARY] = 0.0;
			/*== End Student Attempt Summary ==*/
		for (
			var iSlideIndex = 0, aItemSlides = AssigmentSlides.studentAttemptData.itemSlides;
			iSlideIndex < aItemSlides.length;
			iSlideIndex++
		) {
			var oItemSlide = aItemSlides[iSlideIndex],
				dSlideScore = 0;
			if (
				'slideScore' in oItemSlide &&
				oItemSlide['slideScore'] != null &&
				oItemSlide['slideScore'] != '' &&
				!isNaN(oItemSlide['slideScore'])
			) {
				dSlideScore = parseFloat(oItemSlide['slideScore']);
				dSystemScore += dSlideScore;
				/*==== Populate Student Attempt Summary ====*/
				if (typeof AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] == 'undefined') {
					AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] = {};
				}
				AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']][oItemSlide['slideID']] = dSlideScore;
				/*== End Populate Student Attempt Summary ==*/
			}
			else if (
				typeof oItemSlide['slideScore'] == 'object' &&
				oItemSlide['slideScore'] != null
			) {
				if (
					'summaryScore' in oItemSlide['slideScore'] &&
					typeof oItemSlide['slideScore']['summaryScore'] != 'undefined' &&
					oItemSlide['slideScore']['summaryScore'] != null
				) {
					if (
						'overallScore' in oItemSlide['slideScore']['summaryScore'] &&
						typeof oItemSlide['slideScore']['summaryScore']['overallScore'] != 'undefined' &&
						oItemSlide['slideScore']['summaryScore']['overallScore'] != null &&
						oItemSlide['slideScore']['summaryScore']['overallScore'] != '' &&
						!isNaN(oItemSlide['slideScore']['summaryScore']['overallScore'])
					) {
						dSlideScore = parseFloat(oItemSlide['slideScore']['summaryScore']['overallScore']);
						dSystemScore += (dSlideScore * IwtsSummaryView.iMultiplyingFactor);
						/*==== Populate Student Attempt Summary ====*/
						if (typeof AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] == 'undefined') {
							AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']] = {};
						}
						AssigmentSlides.studentAttemptSummary[oItemSlide['slideType']][oItemSlide['slideID']] = dSlideScore * IwtsSummaryView.iMultiplyingFactor;
						/*== End Populate Student Attempt Summary ==*/
					}
				}
			}
			switch (oItemSlide['slideType']) {
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTHIGHLIGHTSLIDE:
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE:
					dReadingCheckPointScore += dSlideScore;
					dReadingCheckPointTotalScore += dReadingCheckPointMaxScore;
					dMaxScore = dMaxScore + dReadingCheckPointMaxScore;
					break;
				
				case ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE:
					dSummaryScore += dSlideScore;
					dMaxScore = dMaxScore + (dSummaryMaxScore * IwtsSummaryView.iMultiplyingFactor);
					break;
			}
		}
		AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_READING_CHECKPOINT] = (
			(dReadingCheckPointScore / dReadingCheckPointTotalScore) * 100
		).toFixed(2);
		
		/**
		 *
		 *
			4-point rubric
				4 = A = 100
				3 = B = 88
				2 = C = 75
				1 = D = 60
				0 = E = 55
		 *
		 */
		var o4PointRubric = {
			'0':	55,
			'1':	60,
			'2':	75,
			'3':	88,
			'4':	100
		};
		
		AssigmentSlides.studentAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_SUMMARY] = o4PointRubric[Math.round(dSummaryScore).toString()];
		/*== End Compute Score: 21-March-2014 ==*/
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		var sStudentAttemptSummary = JSON.stringify(AssigmentSlides.studentAttemptSummary),
			oSlideInfo = {},
			oTemplate = {};
			
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = sStudentAttemptSummary;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		for (var iIndex = 0; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
			var oSlideInfo = AssigmentSlides.studentAttemptData['itemSlides'][iIndex];
			
			if (
				typeof oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined' ||
				$.trim(oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length == 0 ||
				isNaN(parseFloat(oSlideInfo['slideScore']))
			) {
				continue;
			}
			
			oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
			oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = parseFloat(oSlideInfo['slideScore']);
			
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
			
			oTemplate = {};
		}
			/*== Handle the case of Critical Response ==*/
		var oCRSlideInfo = (
				_.find(
					AssigmentSlides.studentAttemptData['itemSlides'],
					function (oSlideData) {
						return (
							oSlideData.slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE &&
							typeof oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] != 'undefined' &&
							$.trim(oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length != 0
						);
					}
				) ||
				null
			),
			oSummarySlideInfo = (
				_.find(
					AssigmentSlides.studentAttemptData['itemSlides'],
					function (oSlideData) {
						return (
							oSlideData.slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTSUMMARYSLIDE &&
							typeof oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] != 'undefined' &&
							$.trim(oSlideData.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID]).length != 0
						);
					}
				) ||
				null
			);
			
		if (oSummarySlideInfo != null) {
			oTemplate = {};
			oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSummarySlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
			oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = parseFloat(((oSummarySlideInfo['slideScore'] || {}).summaryScore || {}).overallScore || 0);
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
		}	
		if (oCRSlideInfo != null) {
			oTemplate = {};
			oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oCRSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID];
			oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = 0;
			
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
		}
			/* End Handle the case of Critical Response */
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
	
		AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		if (!isNaN(dSystemScore)) {
			AssigmentSlides.systemScore = dSystemScore;
		}
		AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		AssigmentSlides.IsStudentScored = '';
		AssigmentSlides.MaxScore = '';
		/* 
			for ilit20 only: send Max Score ONLY if Critical Reponse scoring is OFF 
			for ilit20 only: set to "true" if  Critical Reponse scoring is OFF
		*/
		if ((AssignmentsView.productCode || '').startsWith("ilit20")) {
			AssigmentSlides.IsStudentScored = (
				objSettingsData.Content.ShowCriticalResponse == '0'
				)?"1":"0";
				
			AssigmentSlides.MaxScore = (objSettingsData.Content.ShowCriticalResponse == '0') ? dMaxScore : '';
		}
		
		$.monitor({
			'if':			function () {
				return (
					(
						typeof objStudentAttemptDataResponse != 'undefined' && 
						objStudentAttemptDataResponse != null && 
						objStudentAttemptDataResponse != 0
					) ||
					(
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
					)
				);
			},
			'beforeStart':	function () {
				objStudentAttemptDataResponse = 0;
				AssigmentSlides.setAttemptData();
			},
			'interval':		500,
			'then':			function () {
				if (
					typeof objStudentAttemptDataResponse.Error == 'undefined' || 
					objStudentAttemptDataResponse.Error == null
				) {
					if ( !((AssignmentsView.productCode || '').startsWith("ilit20")) || objSettingsData.Content.ShowCriticalResponse == '1'){
					
						/*==== IPP-3900 ====*/
						var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
							iSlideId = oCurrentSlide.attr('id').split('___').last(),
							oBtnSubmit = IWTTextAnswerSlide.controls[iSlideId].submitButton;
						
						oCurrentSlide.find('.continent_edit_box').css('left', '-200px');
						oCurrentSlide.find('.continent_edit_box').animate(
							{ 'opacity': '1', 'left': '0' },
							GENERAL.c_s_DEFAULT_ANIMATE_TIME,
							function () {
								//IWTTextAnswerSlide['controls'][iSlideId].backButton.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
								var oSubmitButton = oBtnSubmit,
									oJParent = oSubmitButton.parent(),
									dButtonContainerHeight;
								
								if (dButtonContainerHeight = oJParent.height()) {
									oJParent.animate({
										'height':	'-=' + dButtonContainerHeight
									}, GENERAL.c_s_CHARACTER_ZERO, function () {
										oJParent.css('padding', '0px');
										var oJQAContainer = oJParent.prev('div.continent_content_inner'),
											dQAContainerHeight = Math.round(oJQAContainer.height()),
											oJAnswerContainer = oJQAContainer.find('.text_box_area');
										oJQAContainer.css('height',	dQAContainerHeight + dButtonContainerHeight + 'px');
										var dCurAnswerHeight = oJAnswerContainer.height();
										oJAnswerContainer.css('height', (dCurAnswerHeight + Math.round(dButtonContainerHeight) + 20) + 'px');
										// 20px: found by inspection
										
										// turn back button into done button
										IWTTextAnswerSlide['controls'][iSlideId].backButton.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
									});
								}
							}
						);
						/*== End IPP-3900 ==*/
					}
					else {
						var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
							iSlideId = oCurrentSlide.attr('id').split('___').last();
							// turn back button into done button
							IwtsSummaryView['controls'][iSlideId].backButton.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
					}
				}
				else {
					AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
					AssigmentSlides.studentAttemptSummary = {};
					IWTTextAnswerSlide['slideStatuses'][iSlideId].updateStatusByData({'isComplete': false});
				}
			}
		});
}

IWTTextAnswerSlide.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide();
	
	oSelf.updateAttemptData4Slide(oCurrentSlide);
	if (bIsSubmitted) {
		submitIWTAssignment();
	}
};

IWTTextAnswerSlide.loadControls = function () {
	var oSelf  = this,
		iSlideId = oSelf.slideIdx,
		sContainerId = AssigmentSlides.referenceKey + '___' + oSelf.slideIdx,
		bIsComplete = true;
		
	oSelf['controls'][iSlideId] = {};	
	oSelf['controls'][iSlideId].container = jQuery('#' + sContainerId);
	oSelf['controls'][iSlideId].submitButton = null;
	oSelf['controls'][iSlideId].resultSheet = null;
	oSelf['controls'][iSlideId].backButton = AssignmentsView.prev;
	oSelf['controls'][iSlideId].textArea = null;
	
	if (jQuery('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_ASSIGN_IWT_TXT_ANSWER_SUBMIT_BTN_SELECTOR).length > 0) {
		oSelf['controls'][iSlideId].submitButton = jQuery(
			'#' + sContainerId + ' .' + ASSIGNMENTS.c_s_ASSIGN_IWT_TXT_ANSWER_SUBMIT_BTN_SELECTOR
		);
		bIsComplete = false;
	}
	if (jQuery('#' + sContainerId + ' .input_type_text_slide_left_txtarea').length > 0) {
		oSelf['controls'][iSlideId].textArea = jQuery('#' + sContainerId + ' .input_type_text_slide_left_txtarea');
	}
	if (jQuery('#' + sContainerId + ' .continent_edit_box').length > 0) {
		oSelf['controls'][iSlideId].resultSheet = jQuery('#' + sContainerId + ' .continent_edit_box');
	}
	
	oSelf['slideStatuses'][iSlideId] = new (function (iSlideId) {
		var oStatus = {
				'visited':		false,
				'isComplete':	false
			},
			bRetrieved = false;
		this.update = function (bIsSubmitted) {
			if (oSelf['controls'][iSlideId].resultSheet != null) {
				oStatus['resultSheetVisible'] = (oSelf['controls'][iSlideId].resultSheet.css('opacity') == '1');
			}
			if (oSelf['controls'][iSlideId].textArea != null) {
				var answer = $.trim(jQuery('<div/>').html(oSelf['controls'][iSlideId].textArea.val()).text());				
			
				oStatus['answer'] = encodeURIComponent(answer);
			}
			if (!('visited' in oStatus)) {
				oStatus['visited'] = false;
			}
			oSelf.updateAttemptData(bIsSubmitted);
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
		this.updateByData = function (oData, bIsSubmitted) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData(bIsSubmitted);
		};
		this.updateStatusByData = function (oCurrentSlide, oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData4Slide(oCurrentSlide);
		};
		this.getIsComplete = function () {
			return (oStatus['isComplete'] == true);
		};
		this.getIsRetrieved = function () {
			return bRetrieved;
		};
		this.setIsRetrieved = function (bRetrieveStatus) {
			bRetrieved = bRetrieveStatus;
		};
	})(iSlideId);
};

IWTTextAnswerSlide.render = function () {
	var oSelf = this;
		
    $('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE).html(),
			{
				'data':			oSelf.model,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'slideType':	oSelf.model.type
			}
		)
	);
	/*==== Update Master Data-Store ====*/
	var iSlideId = oSelf.slideIdx,
		sContainerId = AssigmentSlides.referenceKey + '___' + oSelf.slideIdx,
		aSlideIdChunks = sContainerId.split('___')
		sAssignmentType = aSlideIdChunks.first(),
		sAssignmentId = aSlideIdChunks.fetch(1),
		oSlideInputData = {
			'visited':	false
		};
		
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		AssigmentSlides.studentAttemptData == null ||
			!('itemId' in AssigmentSlides.studentAttemptData) ||
			AssigmentSlides.studentAttemptData['itemId'] != sAssignmentId
	) {
		AssigmentSlides.studentAttemptData = {
			'itemId': 			sAssignmentId,
			'itemSlides': 		[
				{
					'slideID':			iSlideId,
					'slideType':		ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE,
					'slideAttempt': 	0,
					'slideIsCorrect': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					'slideScore':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					'slideInputData': 	oSlideInputData
				}
			],
			'submitStatus': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'reAssignedStatus': GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType': 		sAssignmentType
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == iSlideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = {
				'slideID':			iSlideId,
				'slideType':		ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE,
				'slideAttempt': 	0,
				'slideIsCorrect': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				'slideScore':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				'slideInputData': 	oSlideInputData
			};
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push({
			'slideID':			iSlideId,
			'slideType':		ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE,
			'slideAttempt': 	0,
			'slideIsCorrect': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'slideScore':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'slideInputData': 	oSlideInputData
		});
	}
	/*== End Update Master Data-Store ==*/
	
	oSelf.resize();
};

IWTTextAnswerSlide.resize = function () {	
	var window_height = $(window).height(),
		header = $("header").outerHeight(),
		actual_height = window_height - header;	

	var slide_id = AssigmentSlides.referenceKey + "___" + IWTTextAnswerSlide.slideIdx;	
	
	$('.pagination').css("bottom","10px");	
	
	/***** left box height and margin top ******/
	if(IWTTextAnswerSlide.model.static_text == '')
	{		
		var top_gap = 60;
		var continent_box_space = $("#"+slide_id+" .continent_box_space");
	}
	else
	{				
		var top_gap = 100;
		var continent_box_space = $("#"+slide_id+" .continent_box_space");
	}	
	
	var left_box_height = actual_height - top_gap; // margin top bottom 50px			
	var left_box_inner_height = left_box_height - 12; // border deducted

	continent_box_space.css("height",left_box_height+'px');
	$("#"+slide_id+" .continent_box_inner").css("height",left_box_inner_height);	

	var top_bottom_gap =  actual_height - continent_box_space.height();
	var margin_top = top_bottom_gap/2;	

	$('#'+slide_id+' .slider_swiper_inner').css('margin-top',margin_top+'px');

	/***** right box height and margin top *****/			
	var right_box_height = left_box_height - 50; // margin top bottom 25px and border 6px

	$("#"+slide_id+" .continent_edit_box").css("height",right_box_height+'px');

	$('#'+slide_id+' .slider_swiper_inner').hasClass("summary_div_conts")
	{
		$("#"+slide_id+" .continent_edit_box.new_tab_space.left_conts_place.summary_right_box .right_conts_element").css("height",right_box_height+'px');
		$("#"+slide_id).find("#feedback_content").css("height","100%");
		$("#"+slide_id).find("#feedback_content .new_tab_space_inner").css("height","100%");
	}
		
	var right_margin_top = (continent_box_space.height() - $("#"+slide_id+" .continent_edit_box").height())/2 - 6; // border deducted
	$("#"+slide_id+" .continent_edit_box").css('margin-top',right_margin_top+'px');	

	if($('#'+slide_id+' .text_box_area textarea').length)
	{
		$('#'+slide_id+' .continent_content_inner').css('max-height','none');
		var cont_height = parseInt($('#'+slide_id+' .continent_box_inner').height());
		var bttn_box_height = 0;
		if($('#'+slide_id+' .edit_box_title').length){
			bttn_box_height = $('#'+slide_id+' .edit_box_title').height();
		}
		var txt_height = $('#'+slide_id+' .question_area_div').height();
		
		var txt_box_height = cont_height - bttn_box_height - txt_height - 100; 		
		$('#'+slide_id+' .text_box_area').css('height',txt_box_height+'px');    
	}
	
}

IWTTextAnswerSlide.retrieveStatus4mData = function (oStatus) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last();
		
	if (
		'resultSheetVisible' in oStatus
		&& oStatus['resultSheetVisible'] && 
			AssignmentsView.reassignCount == 0
	) {
		/*==== Make Result Sheet Visible ====*/
		oSelf['controls'][iSlideId].resultSheet.css({'opacity': '1', 'left': '0'});
		/*== End Make Result Sheet Visible ==*/
	}
	if (oSelf['controls'][iSlideId].submitButton) {
		oSelf['controls'][iSlideId].submitButton.addClass('btndisabled disabled');
	}
	/*==== Populate Textarea with Answer ====*/
	if (
		'answer' in oStatus &&
		oStatus['answer'] != null &&
		oStatus['answer'].length != 0
	) {
		oSelf['controls'][iSlideId].textArea.val(decodeURIComponent(oStatus['answer']));
		
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
			oSelf['controls'][iSlideId].textArea.prop('disabled', true);
			oCurrentSlide.find('.continent_edit_box').animate({
				'opacity': '1', 'left': '0'
			}, GENERAL.c_s_CHARACTER_ZERO/* c_s_DEFAULT_ANIMATE_TIME */, function () {
				var oSubmitButton = oSelf.controls[iSlideId].submitButton,
					oJParent = oSubmitButton.parent(),
					dButtonContainerHeight;
					
				if (dButtonContainerHeight = oJParent.height()) {
					oJParent.animate({
						'height':	'-=' + dButtonContainerHeight
					}, GENERAL.c_s_CHARACTER_ZERO, function () {
						oJParent.hide();
						var oJQAContainer = oJParent.prev('div.continent_content_inner'),
							dQAContainerHeight = Math.round(oJQAContainer.height()),
							oJAnswerContainer = oJQAContainer.find('.text_box_area');
						oJQAContainer.css({
							'height':	dQAContainerHeight + dButtonContainerHeight + 'px'
						});
						var dCurAnswerHeight = oJAnswerContainer.height();
						oJAnswerContainer.css('height', (dCurAnswerHeight + Math.round(dButtonContainerHeight)) + 'px');
					});
				}
			});
		}
		else {
			oSelf['controls'][iSlideId].submitButton.removeClass('btndisabled disabled');
			if (
				typeof oStatus['isComplete'] != 'undefined' &&
				oStatus['isComplete'] == true &&
				AssignmentsView.reassignCount == 0
			) {
				oCurrentSlide.find('.continent_edit_box').animate({
					'opacity': '1', 'left': '0'
				}, GENERAL.c_s_CHARACTER_ZERO/* c_s_DEFAULT_ANIMATE_TIME */, function () {
					oSelf['controls'][iSlideId].backButton.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
					var oSubmitButton = oSelf.controls[iSlideId].submitButton
					var oJParent = oSubmitButton.parent(),
						dButtonContainerHeight;
					if (dButtonContainerHeight = oJParent.height()) {
						oJParent.animate({
							'height':	'-=' + dButtonContainerHeight
						}, GENERAL.c_s_CHARACTER_ZERO, function () {
							oJParent.hide();
							var oJQAContainer = oJParent.prev('div.continent_content_inner'),
								dQAContainerHeight = Math.round(oJQAContainer.height()),
								oJAnswerContainer = oJQAContainer.find('.text_box_area');
							oJQAContainer.css({
								'height':	dQAContainerHeight + dButtonContainerHeight + 'px'
							});
							var dCurAnswerHeight = oJAnswerContainer.height();
							oJAnswerContainer.css('height', (dCurAnswerHeight + Math.round(dButtonContainerHeight)) + 'px');
						});
					}
				});
			}
		}
	}
	/*== End Populate Textarea with Answer ==*/
	
	/*==== Update Slide Attempt ====*/
	for (var i = 0; i < AssigmentSlides.studentAttemptData.itemSlides.length; i++) {
		if (
			AssigmentSlides.studentAttemptData.itemSlides[i].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE &&
			AssigmentSlides.studentAttemptData.itemSlides[i].slideID == iSlideId
		) {	
			AssigmentSlides.studentAttemptData.itemSlides[i].slideAttempt = '1';
			break;
		}
	}
	/*== End Update Slide Attempt ==*/
	oSelf.resize();
};

IWTTextAnswerSlide.retrieveStatus = function () {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		iSlideIndex = $(AssigmentSlides.slidingEngine.getAllSlides()).index(oCurrentSlide),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sAssignmentId = aSlideIdChunks.fetch(1);
		iSlideId = aSlideIdChunks.last();
	
	if ((oStatus = AssigmentSlides.getStudentAttemptForGradableItem(sAssignmentId)) == null) {
		oStatus = {};
	}
	else {
		oSlideInfo = _.where(oStatus['itemSlides'], { slideID: iSlideId });
		if (oSlideInfo instanceof Array && oSlideInfo.length == 1) {
			oStatus = oSlideInfo.first().slideInputData;
		}
		else {
			oStatus = {};
		}
	}
	oSelf.retrieveStatus4mData(oStatus);
	/*==== Update Status to Retrieved: true ====*/
	if (oSelf.slideStatuses[iSlideId]) {
		oSelf.slideStatuses[iSlideId].setIsRetrieved(true);
	}
	/*== End Update Status to Retrieved: true ==*/
};

IWTTextAnswerSlide.bindEvents = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx,
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	if (oSelf['controls'][iSlideId].submitButton != null) {
		oSelf['controls'][iSlideId].submitButton
			.off('click tap ' + sWindowsEventType)
			.on('click tap ' + sWindowsEventType, function () {
				if (
					$(this).hasClass('btndisabled') ||
					$(this).hasClass('disabled')
				) {
					return false;
				}

				/*== Check if Writing Exceeding Max Limit ==*/
				if (AssigmentSlides.checkMaxCharLimit()) {			
					return;
				}
				/*==== IPP-3900 ====*/
				// AssigmentSlides.inputAnswer.call(this);
				IWTTextAnswerSlide.slideStatuses[iSlideId].update();
				IWTTextAnswerSlide.slideStatuses[iSlideId].updateByData({'isComplete': true}, true);
				/*== End IPP-3900 ==*/
				if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
					SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_READ_CRITICALLY_SUBMITTED_VERBID, sItemId);
				}
			});
	}
		
	if (oSelf['controls'][iSlideId].textArea != null) {
		oSelf['controls'][iSlideId].textArea
			.off('keyup input')
			.on('keyup input', function () {			
				var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
					sContainerId = oCurrentSlide.attr('id'),
					aSlideIdChunks = sContainerId.split('___'),
					iSlideId = aSlideIdChunks.last();
					
				if (oSelf['controls'][iSlideId].submitButton) {
					if (jQuery(this).val().trim().length > 0) {
						oSelf['controls'][iSlideId].submitButton.removeClass('btndisabled disabled');
					}
					else {
						oSelf['controls'][iSlideId].submitButton.addClass('btndisabled disabled');
					}
				}
			})
			.off('blur')
			.on('blur', function () {
				var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
					sContainerId = oCurrentSlide.attr('id'),
					aSlideIdChunks = sContainerId.split('___'),
					iSlideId = aSlideIdChunks.last();
					
				if (oCurrentSlide.data('slide-type') != ASSIGNMENTS.c_s_TYPE_TPL_IWTTEXTANSWERSLIDE) {
					return;
				}
					
				if (oSelf['controls'][iSlideId].submitButton) {
					if (jQuery(this).val().trim().length > 0) {
						oSelf['controls'][iSlideId].submitButton.removeClass('btndisabled disabled');
					}
					else {
						oSelf['controls'][iSlideId].submitButton.addClass('btndisabled disabled');
					}
				}
				
				oSelf.slideStatuses[iSlideId].updateByData({
					'answer':	encodeURIComponent($.trim($('<div/>').html(jQuery(this).val().trim()).text()))
				});
				
				if (oPlatform.isIOS()) {
					if (typeof AssignmentsView.iOSVersion == 'undefined') {
						aMatches = navigator.userAgent.match(/iPad;.*CPU.*OS ([0-9]+)_\d/i);
						AssignmentsView.iOSVersion = parseInt(aMatches[1]);
					}
					if (AssignmentsView.iOSVersion >= 8) {
						AssignmentsView.resize();
					}
				}
			});
	}
}

function IWTDndSlide () {}

IWTDndSlide.slideIdx = null;
IWTDndSlide.model = null;
IWTDndSlide.submitButton = null;
IWTDndSlide.maximumTry = 2;

IWTDndSlide.init = function (slideIdx, model) {
    var oSelf = this;
    //Initialize Properties
    oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	if (
		!('controls' in oSelf) ||
		typeof oSelf.controls == 'undefined' ||
		typeof oSelf.controls != 'object' ||
		oSelf.controls == null
	) {
		oSelf.controls = {};
	}
	if (
		!('slideStatuses' in oSelf) ||
		typeof oSelf.slideStatuses == 'undefined' ||
		typeof oSelf.slideStatuses != 'object' ||
		oSelf.slideStatuses == null
	) {
		oSelf.slideStatuses = {};
	}
	
	oSelf.render();
	oSelf.loadControls();
	oSelf.bindEvents();
};

IWTDndSlide.loadControls = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx,
		sContainerId = AssigmentSlides.referenceKey + '___' + oSelf.slideIdx;
		
	oSelf['controls'][iSlideId] = {};
	oSelf['controls'][iSlideId].container = jQuery('#' + sContainerId);
	oSelf['controls'][iSlideId].inputAnswerButton = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_ASSIGN_READ_CHKPNT_BTN_SELECTOR);
	oSelf['controls'][iSlideId].submitButton = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_SUBMIT_BTN);
	oSelf['controls'][iSlideId].answerSheet = $('#' + sContainerId + ' .box_outer_space').find('.continent_edit_box');
	oSelf['controls'][iSlideId].draggable = $('#' + sContainerId + ' .draggable_word');
	oSelf['controls'][iSlideId].droppable = $('#' + sContainerId + ' .dropbox');
	oSelf['controls'][iSlideId].failTextAgainContainer = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_AGAIN_TXT);
	oSelf['controls'][iSlideId].failTextContainer = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_TXT);
	oSelf['controls'][iSlideId].passTextContainer = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_PASS_TXT);
	oSelf['controls'][iSlideId].dropboxInstructionContainer = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_INSTRUCTION_TXT);
	oSelf['controls'][iSlideId].dropboxContainer = $('#' + sContainerId + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER);
	oSelf['controls'][iSlideId].leftSection = $('#' + sContainerId + ' .continent_box_space');
	
	oSelf['slideStatuses'][iSlideId] = new (function () {
		var oStatus = {
				'visited':		false,
				'isComplete':	false
			},
			bRetrieved = false;
		this.update = function () {
			var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
				aSlideIdChunks = oCurrentSlide.attr('id').split('___'),
				iSlideId = aSlideIdChunks.last(),
				oAnswerSheet = oCurrentSlide.find('.box_outer_space').find('.continent_edit_box');
			oStatus['answerSheetVisible'] = (oAnswerSheet.css('opacity') == '1');
			oStatus['trial'] = (
				(iButtonClicks = oSelf['controls'][iSlideId].submitButton.attr(ASSIGNMENTS.c_s_SLIDE_SUBMIT_BTN_CNT_CHK_ATTR))?
				iButtonClicks:
				ASSIGNMENTS.c_s_DND_SUBMIT_COUNTER_CHECK
			);
			oStatus['selectedWord'] = (
				((sDroppedWord = oSelf['controls'][iSlideId].droppable.text().trim()) == ASSIGNMENTS.c_s_DND_DROPPABLE_DEFAULT_TEXT)?
				GENERAL.c_s_SPECIAL_CHARACTERS_BLANK:
				sDroppedWord
			);
			oSelf.updateAttemptData();
		};
		this.updateByData = function (oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData();
		};
		this.updateStatusByData = function (oCurrentSlide, oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData4Slide(oCurrentSlide);
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
		this.getIsComplete = function () {
			return (oStatus['isComplete'] == true);
		};
		this.getIsRetrieved = function () {
			return bRetrieved;
		};
		this.setIsRetrieved = function (bRetrieveStatus) {
			bRetrieved = bRetrieveStatus;
		};
	})();
};

IWTDndSlide.retrieveStatus4mData = function (oStatus) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last();

	if ('answerSheetVisible' in oStatus && oStatus['answerSheetVisible']) {
		var dContentInnerHeight = oSelf['controls'][iSlideId].leftSection.height(),
			dEditBoxTitleHeight = oCurrentSlide.find('.edit_box_title').height(),
			dEditBoxPaddingTop = parseInt(oSelf['controls'][iSlideId].leftSection.find('.edit_box_title').css('padding-top')),
			dEditBoxPaddingBottom = parseInt(oSelf['controls'][iSlideId].leftSection.find('.edit_box_title').css('padding-bottom')),
			dHeight = dContentInnerHeight + dEditBoxTitleHeight + dEditBoxPaddingTop  + dEditBoxPaddingBottom;
		
		
		/*== Show Droppable ==*/
		oSelf['controls'][iSlideId].answerSheet.css({'opacity': '1', 'left': '0'});
		setTimeout(function () {
			/*== Hide Button ==*/
			oSelf['controls'][iSlideId].leftSection.css({'max-height': dHeight + 'px'});
			oSelf['controls'][iSlideId].inputAnswerButton.parent().hide();
			/* End Hide Button */
		}, 100);
		/* End Show Droppable */
	}
	
	if ('selectedWord' in oStatus) {
		var sDroppableText = ASSIGNMENTS.c_s_DND_DROPPABLE_DEFAULT_TEXT;
		if (
			typeof oStatus['selectedWord'] != 'undefined' &&
			oStatus['selectedWord'] != null &&
			oStatus['selectedWord'].length > 0
		) {
			sDroppableText = oStatus['selectedWord'];
		}
		oSelf['controls'][iSlideId].droppable.text(sDroppableText);
	}
	
	var dSlideScore = 0,
		aAllowedScores = ['0', ASSIGNMENTS.c_s_DND_SECOND_TRIAL_SCORE, ASSIGNMENTS.c_s_DND_FIRST_TRIAL_SCORE];
	if ('slideScore' in oStatus) {
		if ($.inArray(oStatus['slideScore'], aAllowedScores)) {
			dSlideScore = parseFloat(oStatus['slideScore']);
		}
	}
	
	if ('trial' in oStatus) {
		IWTDndSlide.makeTextDraggable();
		var iTrial = '0', aTrialValues = ['0', '1', '2'];
		if (jQuery.inArray(oStatus['trial'] + '', aTrialValues) != -1) {
			iTrial = oStatus['trial'];
		}
		oSelf['controls'][iSlideId].submitButton.attr('submit-counter-check', iTrial);
		switch (parseInt(iTrial)) {
			case oSelf.maximumTry:
				var dSubmitBtnHeight = oSelf['controls'][iSlideId].submitButton.parent().outerHeight(),
					dContainerMaxHeight = parseInt(
						$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css("max-height")
					) + dSubmitBtnHeight,
					sCorrectAnswer = oSelf.getCorrectAnswer(oSelf['controls'][iSlideId].submitButton.attr(ASSIGNMENTS.c_s_SLIDE_SUBMIT_BTN_CORRECT_ANS_IDX));
				
				oSelf['controls'][iSlideId].submitButton.parent().hide();
				setTimeout(function () {
					var dAdjustment = -20;
					dContainerMaxHeight = oSelf['controls'][iSlideId].answerSheet.height() + dAdjustment;
					$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css({
						"max-height":dContainerMaxHeight
					});
				}, GENERAL.c_s_DEFAULT_ANIMATE_TIME);
				
				if (dSlideScore > 0) {
					oSelf['controls'][iSlideId].failTextAgainContainer.hide();
					oSelf['controls'][iSlideId].failTextContainer.hide();
					oSelf['controls'][iSlideId].passTextContainer.show();
					oSelf['controls'][iSlideId].dropboxInstructionContainer.hide();
					oSelf['controls'][iSlideId].dropboxContainer.hide();
				}
				else {
					oSelf['controls'][iSlideId].failTextAgainContainer.show();
					oSelf['controls'][iSlideId].failTextContainer.hide();
					oSelf['controls'][iSlideId].passTextContainer.hide();
					oSelf['controls'][iSlideId].dropboxInstructionContainer.show();
					oSelf['controls'][iSlideId].dropboxContainer.show();
					
					oSelf['controls'][iSlideId].dropboxContainer.empty().text(sCorrectAnswer);
				}
		
				try {
					oSelf['controls'][iSlideId].draggable.draggable("destroy");
				}
				catch (oException) {}
				oStatus['isComplete'] = true;
				AssigmentSlides.slidingEngine.unFreezeNextSlides();
				
				break;
			case 1:
				if (dSlideScore > 0) {
					oSelf['controls'][iSlideId].submitButton.parent().hide();
					
					oSelf['controls'][iSlideId].failTextAgainContainer.hide();
					oSelf['controls'][iSlideId].failTextContainer.hide();
					oSelf['controls'][iSlideId].passTextContainer.show();
					oSelf['controls'][iSlideId].dropboxInstructionContainer.hide();
					oSelf['controls'][iSlideId].dropboxContainer.hide();
					try {
						oSelf['controls'][iSlideId].draggable.draggable("destroy");
					}
					catch (oException) {}
					oStatus['isComplete'] = true;
					AssigmentSlides.slidingEngine.unFreezeNextSlides();
				}
				else {
					oSelf['controls'][iSlideId].submitButton.parent().show();
			
					oSelf['controls'][iSlideId].failTextAgainContainer.hide();
					oSelf['controls'][iSlideId].failTextContainer.show();
					oSelf['controls'][iSlideId].passTextContainer.hide();
					oSelf['controls'][iSlideId].dropboxInstructionContainer.show();
					oSelf['controls'][iSlideId].dropboxContainer.show();
					
					oStatus['isComplete'] = false;
				}
				break;
		}
	}
	
	if (oSelf.slideStatuses[iSlideId]) {
		oSelf.slideStatuses[iSlideId].update();
		oSelf.slideStatuses[iSlideId].updateByData(oStatus);
	}
	
	oSelf.resize();
};

IWTDndSlide.retrieveStatus = function () {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last();
	
	if (oSlideInfo = AssigmentSlides.getStudentAttemptForGradableItem()) {
		if (
			'itemSlides' in oSlideInfo ||
			oSlideInfo['itemSlides'] != null
		) {
			oSlideInfo = _.where(oSlideInfo['itemSlides'], { slideID: iSlideId });
			if (oSlideInfo.length) {
				oSlideInfo = oSlideInfo.first();
			}
			if (
				'slideInputData' in oSlideInfo ||
				oSlideInfo['slideInputData'] != null
			) {
				oSlideInfo = oSlideInfo['slideInputData'];
			}
			else {
				oSlideInfo = {};
			}
		}
		else {
			oSlideInfo = {};
		}
	}
	else {
		oSlideInfo = {};
	}
	
	var oStatus = oSlideInfo;
	
	oSelf.retrieveStatus4mData(oStatus);
	/*==== Update Status to Retrieved: true ====*/
	if (oSelf.slideStatuses[iSlideId]) {
		oSelf.slideStatuses[iSlideId].setIsRetrieved(true);
	}
	/*== End Update Status to Retrieved: true ==*/
};

IWTDndSlide.updateAttemptData4Slide = function (oCurrentSlide) {
	var oSelf = this,
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		sAssignmentId = aSlideIdChunks[1],
		iSlideId = aSlideIdChunks.last(),
		sAssignmentType = aSlideIdChunks.first(),
		sSlideType = oCurrentSlide.data('slide-type'),
		oSlideStatus = oSelf.slideStatuses[iSlideId].getStatus(),
		iSlideAttempt = oSlideStatus['trial'],
		bSlideIsCorrect = oSlideStatus['isCorrect'],
		dSlideScore = oSlideStatus['slideScore'],
		oSlideInfo = {
			'slideID':			iSlideId,
			'slideType':		sSlideType,
			'slideAttempt': 	iSlideAttempt,
			'slideIsCorrect': 	bSlideIsCorrect,
			'slideScore':		dSlideScore,
			'slideInputData': 	oSlideStatus
		};
		
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	if (typeof oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] == 'undefined') {
		if (typeof AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.model[iSlideId][ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS];
		}
		else if (typeof oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')] != 'undefined') {
			oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_KEY_QUESTION_ID] = oSelf.model[ASSIGNMENTS.c_s_KEY_QUESTION_ID_4M_CMS.replace('question', '')];
		}
	}
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
		
	if (
		typeof bIsSubmitted == 'undefined' ||
		bIsSubmitted == null
	) {
		bIsSubmitted = false;
	}
	
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		AssigmentSlides.studentAttemptData == null ||
		!('itemId' in AssigmentSlides.studentAttemptData) ||
		AssigmentSlides.studentAttemptData['itemId'] != sAssignmentId
	) {
		AssigmentSlides.studentAttemptData = {
			'itemId': 			sAssignmentId,
			'itemSlides': 		[
				oSlideInfo
			],
			'submitStatus': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'reAssignedStatus': GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType': 		sAssignmentType
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == iSlideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == sSlideType
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = oSlideInfo;
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push(oSlideInfo);
	}
	AssigmentSlides.studentAttemptData['itemSlides'] = _.sortBy(
		AssigmentSlides.studentAttemptData['itemSlides'],
		function (oSlideInfo) {
			return parseInt(oSlideInfo.slideID);
		}
	)
};

IWTDndSlide.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide();
		
	oSelf.updateAttemptData4Slide(oCurrentSlide);
	
	if (bIsSubmitted) {
		AssigmentSlides.setAttemptData();
	}
};

IWTDndSlide.render = function () {
	var oSelf = this;
	
	var innerContent = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE).html(),
			{
				'data':			oSelf.model,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey': AssigmentSlides.referenceKey + '___' + oSelf.slideIdx,
				'slideType':	oSelf.model.type
			}
		)
	);
	
	oSelf.wrapText();
	/*==== Update Master Data-Store ====*/
	var sContainerId = AssigmentSlides.referenceKey + '___' + oSelf.slideIdx,
		aSlideIdChunks = sContainerId.split('___'),
		sItemId = aSlideIdChunks[1],
		sSlideType = ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE,
		iSlideAttempt = 0,
		sSlideIsCorrect = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSlideScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sSubmitStatus = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sReAssignStatus = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		sItemType = aSlideIdChunks[2],
		iSlideId = aSlideIdChunks.last(),
		oSlideInputData = {},
		oSlideData = {
			'slideID':			iSlideId,
			'slideType': 		sSlideType,
			'slideAttempt':		iSlideAttempt,
			'slideIsCorrect':	sSlideIsCorrect,
			'slideScore':		sSlideScore,
			'slideInputData':	oSlideInputData
		};
	
	if (
		!('studentAttemptData' in AssigmentSlides) ||
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		typeof AssigmentSlides.studentAttemptData != 'object' ||
		AssigmentSlides.studentAttemptData == null ||
		!('itemId' in AssigmentSlides.studentAttemptData) ||
		AssigmentSlides.studentAttemptData.itemId != sItemId
	) {
		AssigmentSlides.studentAttemptData = {
			'itemId': 			sItemId,
			'itemSlides':		[],
			'submitStatus': 	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType': 		ASSIGNMENTS.c_s_ASSIGNMENT_IWTS
		};
	}
	else if (
		!('itemSlides' in AssigmentSlides.studentAttemptData) ||
		!(AssigmentSlides.studentAttemptData['itemSlides'] instanceof Array)
	) {
		AssigmentSlides.studentAttemptData['itemSlides'] = [];
	}
	var iIndex = 0;
	for (; iIndex < AssigmentSlides.studentAttemptData['itemSlides'].length; iIndex++) {
		if (
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideID == iSlideId &&
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex].slideType == ASSIGNMENTS.c_s_TYPE_TPL_IWTDNDSLIDE
		) {
			AssigmentSlides.studentAttemptData['itemSlides'][iIndex] = oSlideData;
			break;
		}
	}
	if (iIndex == AssigmentSlides.studentAttemptData['itemSlides'].length) {
		AssigmentSlides.studentAttemptData['itemSlides'].push(oSlideData);
	}
	/*== End Update Master Data-Store ==*/
	
	IWTDndSlide.resize();
};

IWTDndSlide.resize = function () {
	var window_height = $(window).height(),
		header = $('header').outerHeight(),
		actual_height = window_height - header;
		
	$('.pagination').css('bottom', '10px');
	var slide_id = AssigmentSlides.referenceKey + '___' + IWTDndSlide.slideIdx;
	/***** left box height and margin top ******/
	var top_gap = 100,
		continent_box_space = $('#' + slide_id + ' .continent_box_space'),
		left_box_height = actual_height - top_gap, // margin top bottom 50px
		left_box_inner_height = left_box_height - 12; // border deducted
	
	continent_box_space.css('height', left_box_height + 'px');
	$('#' + slide_id + ' .continent_box_inner').css({
		'height':		left_box_inner_height + 'px',
		'overflow-y':	'hidden'
	});
	
	var oRCButtonContainer = $('#' + slide_id + ' .continent_box_inner .edit_box_title'),
		oDragArea = $('#' + slide_id + ' .continent_box_inner .draggable_area'),
		dRCButtonContHeight = Math.max(60, // 60: Found from CSS
			parseFloat(oRCButtonContainer.css('height').replace('px', '')) +
			(
				parseFloat(oRCButtonContainer.css('padding-top').replace('px', '')) + 
				parseFloat(oRCButtonContainer.css('padding-bottom').replace('px', '')) +
				parseFloat(oRCButtonContainer.css('border-top-width').replace('px', '')) + 
				parseFloat(oRCButtonContainer.css('border-bottom-width').replace('px', ''))
			)
		);
	
	$('#' + slide_id + ' .continent_box_inner .draggable_area').css(
		'height', (
			parseFloat($('#' + slide_id + ' .continent_box_inner').css('height').replace('px', '')) -
			dRCButtonContHeight -
			(
				parseFloat(oDragArea.css('padding-top').replace('px', '')) + 
				parseFloat(oDragArea.css('padding-bottom').replace('px', '')) +
				parseFloat(oDragArea.css('border-top-width').replace('px', '')) + 
				parseFloat(oDragArea.css('border-bottom-width').replace('px', ''))
			)
		)
	);
	
	var top_bottom_gap =  actual_height - continent_box_space.height();
	var margin_top = top_bottom_gap / 2;	
	
	$('#' + slide_id + ' .slider_swiper_inner').css('margin-top', margin_top + 'px');
	
	/***** right box height and margin top *****/			
	var right_box_height = left_box_height - 50; // margin top bottom 25px and border 6px
	
	$('#' + slide_id + ' .continent_edit_box').css('height', right_box_height + 'px');
	
		
	var right_margin_top = (continent_box_space.height() - $('#'+slide_id+' .continent_edit_box').height()) / 2 - 6; // border deducted
	$('#' + slide_id + ' .continent_edit_box').css('margin-top', right_margin_top + 'px');		

	var bottom_bar_height = (
			$('#' + slide_id + ' .continent_edit_box .edit_box_title').is(':visible')?
			parseInt($('#' + slide_id + ' .continent_edit_box .edit_box_title').css('height')):
			0
		),
		drag_area_height = right_box_height - bottom_bar_height - 22;

	$('#' + slide_id + ' .drag_text_area_container').css('height', drag_area_height + 'px');
};

IWTDndSlide.wrapText = function () {
	var oSelf = this,
		sDragAreaSelector = AssigmentSlides.referenceKey + '___' + oSelf.slideIdx + ' .draggable_area',
		txt = $('#' + sDragAreaSelector).html(),
		new_txt = returnDraggableTxt(txt);
		
	$('#' + sDragAreaSelector).html(new_txt);
};
        
IWTDndSlide.makeTextDraggable = function () {        
	// setting options of the drag event
	var oSelf = this,
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sDragBoxSelector = oCurrentSlide.attr('id') + ' .draggable_word',
		dragOpts = {
			appendTo : "body",
			/*containment : '.drag_forms_box_container',*/
			revertDuration : 100,
			refreshPositions : true,
			revert : 'invalid',
			zIndex : 9999,
			scroll : true,
			cursor : 'move',
			helper : function() {
				$copy = $(this).clone(true);
				return $copy;
			}
		};
	
	$('#' + sDragBoxSelector).draggable(dragOpts);
	
	IWTDndSlide.makeDroppable();
}
        
IWTDndSlide.makeDroppable = function () {
	var oSelf = this,
		sSlideId = AssigmentSlides.getCurrentActiveSlide().attr('id'),
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	$('#' + sSlideId + ' .dropbox').droppable({
		accept : ".draggable_word",
		drop : function(event, ui) {
			var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
				iSlideId = oCurrentSlide.attr('id').split('___').last();
		
			$(this).empty(); 
			
			if ($(this).find('.draggable_word').length > 0) {                        
				$(this).empty();
			}
			
			// appending the draggable element to the droppable area
			var original_word = ui.draggable.text();
			var trimed_word = oSelf.trimWord(original_word);
			
			var clone_obj = ui.draggable.clone();
			clone_obj.text(trimed_word);                        
			clone_obj.appendTo(event.target);
			
			oSelf.slideStatuses[iSlideId].update();
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_DND_ANS_SELECTED_VERBID, sItemId);
			}
		}
	});
}

IWTDndSlide.trimWord = function (s) {
	// Start: for special type character like characters are coming from word type editor.
	s = encodeURIComponent(s);
	$.each(GENERAL.c_a_SPECIAL_CHARACTERS_URI_ENCODE, function(idx, val) {
		s = s.replace(new RegExp(val, 'gi'), GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
	});
	s = decodeURIComponent(s);
	// End: for special type character like characters are coming from word type editor.
	
	if ($.inArray(s, GENERAL.c_a_SPECIAL_WORDS) > -1) {
		return s; 
    }
	else {
        var l = 0,
			r = s.length - 1;
        while (l < s.length && $.inArray(s[l], GENERAL.c_a_SPECIAL_CHARACTERS) > -1){
			l++;
		}
        while (r > l && $.inArray(s[r], GENERAL.c_a_SPECIAL_CHARACTERS) > -1) {
			r -= 1;
		}
        return s.substring(l, r + 1);
    }
}

IWTDndSlide.bindEvents = function () {
	var oSelf = this,
		iSlideId = oSelf.slideIdx;
	oSelf['controls'][iSlideId].submitButton
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
			oSelf.submitAnswerCheck.call(this, oSelf);
		});
};

IWTDndSlide.submitAnswerCheck = function (oSelf) {
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		sContainerId = oCurrentSlide.attr('id'),
		aSlideIdChunks = sContainerId.split('___'),
		iSlideId = aSlideIdChunks.last(),
		iBtnClickCount = parseInt($(this).attr(ASSIGNMENTS.c_s_SLIDE_SUBMIT_BTN_CNT_CHK_ATTR)),
		bIsCorrect = false,
		correctAnswer = oSelf.getCorrectAnswer($(this).attr(ASSIGNMENTS.c_s_SLIDE_SUBMIT_BTN_CORRECT_ANS_IDX)),
		userAnswer = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER).text().toLowerCase(),
		bIsComplete = false,
		sItemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	iBtnClickCount++;
	/*==== Hide All Suggestive & Result Text ====*/
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_AGAIN_TXT).hide();
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_TXT).hide();
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_PASS_TXT).hide();
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_INSTRUCTION_TXT).hide();
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER).hide();
	/*== End Hide All Suggestive & Result Text ==*/
	
	$(this).parent().hide();
	
	if (iBtnClickCount == 1) {
		if (bIsCorrect = (correctAnswer.toLowerCase() == userAnswer)) { // Correct Answer @ first shot
			var submit_btn_height = $(this).parent().outerHeight(),
				container_max_height = parseInt(
					$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css("max-height")
				) + submit_btn_height;
				
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css({
				"max-height":container_max_height
			});
			
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_PASS_TXT).show();
			
			bIsComplete = true;
		}
		else { // Incorrect Answer @ first shot
			$(this).parent().show();
			
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_TXT).show();
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_INSTRUCTION_TXT).show();
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER).show();
			
			/*==== 14-August-2014 ====*/
			var oRightContainer = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_edit_box'),
				oRightActionArea = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_wrap_box .drag_text_area_container'),
				dMaxHeight = (
					parseFloat(oRightContainer.height()) -
					parseFloat(oRightContainer.css('padding-top').replace('px', '')) -
					parseFloat(oRightContainer.css('padding-bottom').replace('px', '')) -
					parseFloat(oRightContainer.css('margin-top').replace('px', '')) -
					parseFloat(oRightContainer.css('margin-bottom').replace('px', ''))
				);
				
			oRightActionArea
				.css('max-height', dMaxHeight + 'px')
				.animate({
					'scrollTop': parseFloat(oRightActionArea.children().filter('.overflow-auto').height()) * 3
				});
			/*== End 14-August-2014 ==*/
		}
	}
	else if (iBtnClickCount == 2) {
		var submit_btn_height = $(this).parent().outerHeight(),
			container_max_height = parseInt(
				$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css("max-height")
			) + submit_btn_height;
		
		$('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).css({
			'max-height':	container_max_height
		});
		
		if (bIsCorrect = (correctAnswer.toLowerCase() == userAnswer)) { // Correct Answer @ second shot
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_PASS_TXT).show();
		}
		else { // Incorrect Answer @ second shot
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_FAIL_AGAIN_TXT).show();
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_INSTRUCTION_TXT).show();
			$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER).show();
			
			$('.'+ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).find('.' + ASSIGNMENTS.c_s_DND_DROP_BOX_CONTAINER).empty().text(correctAnswer);
			
			/*==== 14-August-2014 ====*/
			var oRightContainer = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_edit_box'),
				oRightActionArea = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .continent_wrap_box .drag_text_area_container'),
				dMaxHeight = (
					parseFloat(oRightContainer.css('height').replace('px', '')) -
					parseFloat(oRightContainer.css('padding-top').replace('px', '')) -
					parseFloat(oRightContainer.css('padding-bottom').replace('px', '')) -
					parseFloat(oRightContainer.css('margin-top').replace('px', '')) -
					parseFloat(oRightContainer.css('margin-bottom').replace('px', ''))
				);
				
			oRightActionArea
				.css({
					'max-height':	dMaxHeight + 'px',
					'height':		dMaxHeight + 'px' // Manage height of right area
				})
				.animate({
					'scrollTop': parseFloat(oRightActionArea.children().filter('.overflow-auto').height()) * 3
				});
			/*== End 14-August-2014 ==*/
		}
		bIsComplete = true;
	}
	else {
		$(this).parent().show();
		bIsComplete = false;
	}
	
	$(this).attr(ASSIGNMENTS.c_s_SLIDE_SUBMIT_BTN_CNT_CHK_ATTR, iBtnClickCount);
	if (bIsComplete === true) {
		$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .draggable_word').draggable().draggable("destroy");
		$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .' + ASSIGNMENTS.c_s_DND_DRAG_TXT_AREA_CONTAINER).scrollTop(0);
		AssigmentSlides.slidingEngine.unFreezeNextSlides();
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
			SetGoogleAnalytic(ASSIGNMENTS.c_s_IR_DND_ANS_SUBMITTED_VERBID, sItemId);
		}
	}
	
	// IWTDndSlide.resize();
	var oScoreIdx = {
		'1': 'FIRST',
		'2': 'SECOND'
	}, dScore = (bIsCorrect? ASSIGNMENTS['c_s_DND_' + oScoreIdx[iBtnClickCount] + '_TRIAL_SCORE']: '0');
	
	oSelf.slideStatuses[iSlideId].update();
	oSelf.slideStatuses[iSlideId].updateByData({
		'isCorrect':	bIsCorrect,
		'isComplete':	bIsComplete,
		'trial':		iBtnClickCount,
		'slideScore':	dScore
	});
	return false;
};

IWTDndSlide.getCorrectAnswer = function(sCorrectAnswerIdx){
	var aAnswerIndex = sCorrectAnswerIdx.split("|"),
		oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		iSlideId = oCurrentSlide.attr('id').split('___').last(),
		sInteractiveText = AssigmentSlides.model[iSlideId].interactive_text;
	
	return getParticularString($.trim($('<div/>').html(sInteractiveText).text()), aAnswerIndex[0], aAnswerIndex[1]);
};



function ParagraphView () {}

ParagraphView.slideIdx = null;
ParagraphView.model = null;
ParagraphView.studentAttemptDataObj = null;
ParagraphView.feedbackHead = '';
ParagraphView._confirm = ISeriesBase.prototype._confirm;
ParagraphView._alert = ISeriesBase.prototype._alert;
ParagraphView.paraScored = false;

ParagraphView.init = function (slideIdx, model) {
	var oSelf = this;
    //Initialize Properties
    oSelf.slideIdx = slideIdx;
	oSelf.model = model;
	oSelf.controls = {};
	oSelf.feedbackHead = '';
	oSelf.feedbackData = {};
	oSelf.paraScored = false;
	
	/*==== Added to facilitate save status ====*/
	oSelf.slideStatus = new (function () {
		var oStatus = {
			'isComplete':			false,
			'submitButtonEnabled':	false
		};
		this.update = function () {
			var para = $.trim(jQuery('<div/>').html(oSelf['controls'].typeareaText.val()).text());
			
			oStatus['para'] = encodeURIComponent(para);
			oStatus['getFeedbackButtonEnabled'] = (oStatus['para'].length > 0);
            oStatus['questionId'] = ParagraphView.model.question_id;
		};
		this.updateByData = function (oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
	})();
	/*== End Added to facilitate save status ==*/
	
    oSelf.render();
}

ParagraphView.render = function () {
	var oSelf = this,
		tempData = AssigmentSlides.getAttemptDataForGradeableItem.Content[0].StudentAttemptData;
	
	if (tempData != null && tempData.match(/itemSlides/g) != null) {
		var data = tempData;
		oSelf.studentAttemptDataObj = data.toJSObject();
	}
	else {
		oSelf.studentAttemptDataObj = null;
	}
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH_SLIDE).html(),
			{
				'data':					oSelf.model,
				'mediaPath':			AssigmentSlides.mediaPath,
				'referenceKey': 		AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'studentAttemptData':	oSelf.studentAttemptDataObj,
				'slideType':			ASSIGNMENTS.c_s_TYPE_TPL_PARAGRAPH
			}
		)
	);
	
	/* load library json & current book info */
	AssignmentsView.loadCurrentBook();	
	AssignmentsView.hideMainLoader();
	/**
     * Set Header Items
     */
	oSelf.loadControls();
    
	if (mixSlideScore = oSelf.getScore()) {
		oSelf.feedbackData = mixSlideScore;
	}
	oSelf.updateAttemptData();
	oSelf.saveAttemptData();
    oSelf.resize();
	
    oSelf.bindEvents();
	oSelf.retrieveScore();
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		var oCurrentSlide = jQuery('#' + AssigmentSlides.referenceKey + "___" + oSelf.slideIdx);
		AssigmentSlides.prepare4View(oCurrentSlide);
	}
};

ParagraphView.loadControls = function () {
	var oSelf = this;
	
	oSelf['controls'].printBtn = $("#btnprint_paragraph");
	oSelf['controls'].emailBtn = $("#btnemail_paragraph");
    oSelf['controls'].typeareaText = $("#txtParagraph"); 
    oSelf['controls'].instructionTab = $("#" + ASSIGNMENTS.c_s_INSTRUCTION_TABID);
    oSelf['controls'].feedbackTab = $("#" + ASSIGNMENTS.c_s_FEEDBACK_TABID);
	oSelf['controls'].submitBtn = $("#btnsubmit_paragraph");
	oSelf['controls'].getFeedbackBtn = $('#getFeedback');
};

ParagraphView.getScore = function () {
	var oSelf = this,
		oSlideScore = {};
		
	if (
		typeof oSelf.studentAttemptDataObj != 'undefined' &&
		oSelf.studentAttemptDataObj != null &&
			'itemSlides' in oSelf.studentAttemptDataObj &&
			typeof oSelf.studentAttemptDataObj['itemSlides'] != 'undefined' &&
			oSelf.studentAttemptDataObj['itemSlides'] instanceof Array &&
				'slideScore' in oSelf.studentAttemptDataObj['itemSlides'].first() &&
				typeof oSelf.studentAttemptDataObj['itemSlides'].first().slideScore != 'undefined' &&
				oSelf.studentAttemptDataObj['itemSlides'].first().slideScore != null &&
				AssignmentsView.reassignCount == 0
	) {
		oSlideScore = oSelf.studentAttemptDataObj['itemSlides'].first().slideScore;
	}
	if (
		typeof oSlideScore != 'undefined' &&
		typeof oSlideScore == 'object' &&
		oSlideScore != null &&
			'paragraphFeedback' in oSlideScore &&
			typeof oSlideScore['paragraphFeedback'] != 'undefined' &&
			oSlideScore['paragraphFeedback'] != null &&
			oSlideScore['paragraphFeedback'] != 'null' &&
				'score' in oSlideScore['paragraphFeedback'] &&
				typeof oSlideScore['paragraphFeedback']['score'] != 'undefined' &&
				oSlideScore['paragraphFeedback']['score'] != null &&
				!isNaN(oSlideScore['paragraphFeedback']['score'])
	) {
		return decodePKTSlideScore(oSlideScore);
	}
	return false;
};

ParagraphView.retrieveScore = function () {
	var oSelf = this,
		mixSlideScore = false;
	/*==== If already scored, show score ====*/
	if (mixSlideScore = oSelf.getScore()) {
		oSelf.feedbackData = mixSlideScore;
		oSelf.setFeedbackVal(true); // Disable Controls => true
		$('#feedback_tab').addClass('active');
		$('#feedback_tab').siblings().removeClass('active');
		$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
		/*==== Disable Button Clicks ====*/
		$('.disable-controls img').off('click tap ' + sWindowsEventType);
		/*== End Disable Button Clicks ==*/
	}
	/*== End If already scored, show score ==*/
}

ParagraphView.updateAttemptData = function () {
	var oSelf = this, 
		para = $.trim(jQuery('<div/>').html(ParagraphView['controls'].typeareaText.val()).text());
	para = encodeURIComponent(para);	
	
	var wholeData = $.extend(true, oSelf.slideStatus.getStatus(), {"para": para, "questionId" : ParagraphView.model.question_id});
	
	if (ParagraphView.studentAttemptDataObj != null) {	
		var slideAttempt = ParagraphView.studentAttemptDataObj.itemSlides[0].slideAttempt + 1;
	}
	else {
		var slideAttempt = 1;
	}
	/*==== IPP-935 ====*/
	var systemScore = (
		(
			typeof ParagraphView.feedbackData != 'undefined' &&
			typeof ParagraphView.feedbackData.paragraphFeedback != 'undefined' &&
			typeof ParagraphView.feedbackData.paragraphFeedback.score != 'undefined'
		)?
		ParagraphView.feedbackData.paragraphFeedback.score:
		0
	);
	/*== End IPP-935 ==*/
	var itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
		
	var oFilteredScoreData = {};
	if (ParagraphView.feedbackData != null && typeof ParagraphView.feedbackData.paragraphFeedback != "undefined") {
		$.each(ParagraphView.feedbackData.paragraphFeedback, function (key,val) {
			
			if ($.inArray(key, ASSIGNMENTS.c_a_PARAGRAPH_FEEDBACK_ARRAY) == -1) {
				oFilteredScoreData[key] = val;
			}
			else {
				oFilteredScoreData[key] = {"0":""};
			} 
		});	 
	}	
	
	var slideScore = (ParagraphView.feedbackData != null && typeof ParagraphView.feedbackData.paragraphFeedback != "undefined") ? encodePKTSlideScore({"paragraphFeedback" : oFilteredScoreData}): GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	//var slideScore = (ParagraphView.feedbackData != null)? encodePKTSlideScore(ParagraphView.feedbackData): GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
	
	AssigmentSlides.studentAttemptData = {
		"itemId": itemId,
		"itemSlides": [
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH,
				"slideAttempt": slideAttempt,
				"slideIsCorrect": null,
				"slideScore":slideScore,
				"slideInputData": wholeData
			}
		],
		"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH
	};
    
    AssigmentSlides.studentAttemptSummary = {};	
	
	AssigmentSlides.systemScore = systemScore;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
	
	oSelf.slideStatus.update();
	oSelf.slideStatus.updateByData({
		attemptCount: slideAttempt
	});
};

ParagraphView.saveAttemptData = function () {
	AssigmentSlides.setAttemptData();
};

ParagraphView.bindEvents = function () {
	var oSelf = this;
    oSelf['controls'].emailBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, oSelf.email);
    oSelf['controls'].printBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, oSelf.print);
    oSelf['controls'].typeareaText.off("keyup input").on("keyup input", oSelf.submitEnable);
	oSelf['controls'].typeareaText.on("blur", function () {
		oSelf.updateAttemptData();
	});
    //oSelf.typeareaText.on("touchstart", oSelf.focusSelection);
	oSelf['controls'].submitBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, oSelf.submit_gradeable);
    
    //instruction tab
    oSelf['controls'].instructionTab.off("click " + sWindowsEventType).on("click " + sWindowsEventType, oSelf.loadInstruction);
    
    //feedback tab
    oSelf['controls'].feedbackTab.off("click " + sWindowsEventType).on("click " + sWindowsEventType, oSelf.loadFeedback);
    
    oSelf['controls'].getFeedbackBtn.off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType, oSelf.getFeedbackCall);
    $('#instructionText a').off("click " + sWindowsEventType).on("click " + sWindowsEventType, oSelf.linksCall);
    $('.backtoinst').off("click " + sWindowsEventType).on("click " + sWindowsEventType, oSelf.loadInstruction);
	
	$(".prompt_text_heading").off("click " + sWindowsEventType).on("click " + sWindowsEventType, function(oEvent){
		var elem = $(".prompt_text_container");
		//oEvent.stopPropagation();
		if (elem.hasClass('active')) {
			elem.removeClass("active");
			$('.paragraph_prompt_slide > .scroll_padding > .continent_content_inner > .text_box_area').addClass('accordin_slide_close').removeClass('accordin_slide_open');
			$('.prompt_text_heading > .arrow_pd').addClass('arrow_lr').removeClass('arrow_pd');
			elem.slideUp(500);
		}
		else {
			$('.paragraph_prompt_slide > .scroll_padding > .continent_content_inner > .text_box_area').addClass('accordin_slide_open').removeClass('accordin_slide_close');
		
			$('.prompt_text_heading > .arrow_lr').addClass('arrow_pd').removeClass('arrow_lr');
			elem.addClass("active");
			elem.slideDown(500);
		}
	});
	
	// Book Icon - Show Current Book	
	$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap").on("click tap", function(){		
		$("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).toggle();
	});
    
    // Book Icon - Hide Current Book	
	$(".wrapper").off("click tap").on("click tap", function(event){        
        if (event.target.id != ASSIGNMENTS.c_s_BOOK_ICON && $("#"+ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).has(event.target).length == 0) {
		  $("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
        }
	});		
	
	// Bind view current reading and notebook link	
	$('[id^='+ASSIGNMENTS.c_s_ASSIGNMENT_VIEW_CURRENTREADING+'_]').off("click tap").on("click tap", function(){
	
		/*== Check if Writing Exceeding Max Limit ==*/
		if (AssigmentSlides.checkMaxCharLimit()) {			
			return;
		}
		
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': 'none',
			'click-to-hide': false,
			'opacity': 0.5
		});

		var bookId = $(this).attr('book_id'),
            BookType   =   $(this).attr('book_type'),
            wordCount  =   $(this).attr('word_count'),
            bookTitle  =   $(this).attr('book_title'),
			fileType   =   $(this).attr('file_type'),
			iBookNumPage  = $(this).attr('bookNumPage');
		
		// save data before leaving page
		ParagraphView.updateAttemptData();
		$.when(ParagraphView.saveAttemptData()).done(function (){
			AssignmentsView.iLoadTOCScreen = 0;
			if(fileType == 'pdf'){
				GetPDFInfo(bookId, bookTitle, BookType, wordCount, iBookNumPage, 'assignment');
				return false;
			}else{		
				var sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
					sItemAttemptId = AssigmentSlides.oAssignmentKeyData['itemAttemptId'],
					sHeaderTitle = AssigmentSlides.oAssignmentKeyData['headerTitle'], 
					sAssignmentType = AssigmentSlides.oAssignmentKeyData['assignmentType'], 
					sAssignmentSubType = AssigmentSlides.oAssignmentKeyData['assignmentSubType'];
					sReassignCount = AssigmentSlides.oAssignmentKeyData['reassignCount'];
				
				var returnUrl = 'assignment.html' +
					'?assignment-id=' + sAssignmentId +
					'&item-attempt-id=' + sItemAttemptId +
					'&header-title=' + encodeURIComponent(sHeaderTitle) +
					'&assignment-type=' + sAssignmentType +
					'&assignment-sub-type=' + sAssignmentSubType +
					'&study-plan-sub-type=' +
					'&reassignCount=' + sReassignCount +
					'&comment=' + $.trim($('#' + ASSIGNMENTS.c_s_SHOW_COMMENT + ' > comment').text());
			
				sIframeUrl = LIBRARY.c_s_PLAYER_URL + bookId + "|||" + bookTitle + "|||" + BookType + "|||" + wordCount+ "|||" + "assignment" + "|||"+fileType+"|||"+iBookNumPage+"|||context=" + returnUrl;				
				
				setTimeout(function(){			
					location.href = sIframeUrl;
				}, 1000);
				return false;			
			 }
		});
	});
	
	//oSelf['controls'].instructionTab.click();
};

ParagraphView.submit_gradeable = function(){
	if (ParagraphView['controls'].submitBtn.hasClass("btndisabled")) {
		return false;
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}
	
	ParagraphView._confirm({
		'title':	'Are you sure?',
		'divId':	'dialog-message',
		'message':	ASSIGNMENTS.c_s_CONFIRM_SUBMIT_MSG,
		'yes': function(){
			var oTemplate = {};
			AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;			
			AssigmentSlides.studentAttemptSummary = {};
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
			oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = ParagraphView.model.question_id;
			oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = 0;			
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
			
			/* if auto score set isStudentScore = true */
			/*== start - if iLit20 and Accept Library Response Score is OFF ==*/
			if (
				((AssignmentsView.productCode || '').startsWith("ilit20")) && 
				(objSettingsData.Content.AcceptLibraryResponseScore == '0') &&
				(objAssignmentSlidesJsonData['content'].category == ASSIGNMENTS.c_s_ASSIGNMENT_CATEGORY_LIBRESP)
				
			) 
			{
				AssigmentSlides.IsStudentScored = "1";
			}
			else{
				AssigmentSlides.IsStudentScored = "0";
			}
			/*== end - if iLit20 and Accept Library Response Score is OFF ==*/
			
			objStudentAttemptDataResponse = 0;
			ParagraphView.saveAttemptData();						
			
			$.monitor({
				'if':			function () {					
					return (
						(
							typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0
						) ||
						(
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
						)
					);
				},
				'beforeStart':	function () {
				},
				'interval':		500,
				'then':			function () {
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {
						ParagraphView['controls'].submitBtn.addClass("btndisabled disabled"); 
						ParagraphView['controls'].getFeedbackBtn.addClass("btndisabled disabled"); 
						ParagraphView['controls'].typeareaText.attr("readonly","readonly");
						ParagraphView['controls'].printBtn.addClass("btndisabled disabled"); 
						ParagraphView['controls'].emailBtn.addClass("btndisabled disabled");
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
						
						ParagraphView.slideStatus.updateByData({
							'submitButtonEnabled':	false,
							'isComplete':			true
						});
						
						ParagraphView.paraScored = true;			
						
						$("#feedback_tab").addClass('active');
						$("#instruction_tab").removeClass('active');
						$('.new_tab_space_title_tab .back_bttn').hide();
						$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
						$("#feedback_content").empty().html(_.template($("#paragraphinstruction").html(),{"data":ASSIGNMENTS.c_s_PARA_SCORED_MSG}));
						ParagraphView['controls'].getFeedbackBtn.hide();
						
						$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap");		
						$("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
					   
						setTimeout(function(){
							ParagraphView.AttemptGradeableItemCallback();
						}, 2000);
					}
					else {
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});			
			
		}
	});
		
}

ParagraphView.AttemptGradeableItemCallback = function () {
	var oControls = ParagraphView.controls;
	
	for (var sControl in oControls) {
		if (sControl.endsWith('Btn')) {
			oControls[sControl]
				.attr('disabled', 'disabled')
				.addClass('btndisabled')
				.addClass('disabled');
		}
		else if (sControl.startsWith('typearea')) {
			if (oControls[sControl] instanceof Array) {
				for (var iCIdx = 0; iCIdx < oControls[sControl].length; iCIdx++) {
					oControls[sControl][iCIdx].attr('disabled', 'disabled');
				}
			}
			else {
				oControls[sControl].attr('disabled', 'disabled');
			}
		}
	}
	/* setTimeout(function(){
       AssignmentsView.prev.trigger('click');
	}, 3000); */
}

ParagraphView.focusSelection = function(e){
	e.stopPropagation();
	ParagraphView['controls'].typeareaText.focus();
}

ParagraphView.getFeedbackCall = function () {
	if (ParagraphView['controls'].getFeedbackBtn.hasClass("btndisabled")) {
		return;   
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}
	
	ParagraphView['controls'].typeareaText.blur();
	oUtility.showLoader({
	  'message': '<img src="media/loader.gif" alt="" />',
	  'background-color': 'none',
	  'click-to-hide': false,
	  'opacity': 0.5
	});
	//ParagraphView['controls'].getFeedbackBtn.addClass("btndisabled");
	$(this).focus();
	$('.new_tab_space_title_tab .back_bttn').hide();
	$("#feedback_tab").addClass('active');
	$("#instruction_tab").removeClass('active');
	$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
	ParagraphView.feedbackData = 0;
	var oCurrentSlide = AssigmentSlides.getCurrentActiveSlide(),
		aSlideReferenceKeyChunks = oCurrentSlide.attr('reference-key').split('___'),
		sSlideObjKey = aSlideReferenceKeyChunks.fetch(3);
		
	ParagraphView.prompt_id = AssigmentSlides.model[sSlideObjKey].prompt_id;
	var paragraphText = ParagraphView['controls'].typeareaText.val();
	if (oPlatform.isIOS()) {
		paragraphText = paragraphText.replace(/"/g, "&#34;").replace(/“/g, "&#34;").replace(/”/g, "&#34;");
	}
	else {
		paragraphText = paragraphText.replace(/"/g,"\\\"");
	}
	
	//ParagraphView.paragraphPKTCallback('{"paragraphFeedback":{"pronounsFeedback":{"words":[{"positions":[{"sentenceRefId":"s16","endIndex":977,"startIndex":974}],"word":"they"},{"positions":[{"sentenceRefId":"s14","endIndex":883,"startIndex":882}],"word":"it"},{"positions":[{"sentenceRefId":"s7","endIndex":495,"startIndex":494},{"sentenceRefId":"s20","endIndex":1324,"startIndex":1323},{"sentenceRefId":"s20","endIndex":1389,"startIndex":1388}],"word":"me"},{"positions":[{"sentenceRefId":"s3","endIndex":249,"startIndex":246},{"sentenceRefId":"s19","endIndex":1212,"startIndex":1209}],"word":"them"},{"positions":[{"sentenceRefId":"s2","endIndex":109,"startIndex":108},{"sentenceRefId":"s9","endIndex":586,"startIndex":585},{"sentenceRefId":"s20","endIndex":1284,"startIndex":1283}],"word":"my"},{"positions":[{"sentenceRefId":"s19","endIndex":1175,"startIndex":1170}],"word":"itself"},{"positions":[{"sentenceRefId":"s1","endIndex":17,"startIndex":17},{"sentenceRefId":"s1","endIndex":33,"startIndex":33},{"sentenceRefId":"s2","endIndex":74,"startIndex":74},{"sentenceRefId":"s3","endIndex":152,"startIndex":152},{"sentenceRefId":"s3","endIndex":169,"startIndex":169},{"sentenceRefId":"s3","endIndex":208,"startIndex":208},{"sentenceRefId":"s3","endIndex":235,"startIndex":235},{"sentenceRefId":"s4","endIndex":271,"startIndex":271},{"sentenceRefId":"s4","endIndex":308,"startIndex":308},{"sentenceRefId":"s5","endIndex":362,"startIndex":362},{"sentenceRefId":"s6","endIndex":395,"startIndex":395},{"sentenceRefId":"s6","endIndex":434,"startIndex":434},{"sentenceRefId":"s7","endIndex":502,"startIndex":502},{"sentenceRefId":"s8","endIndex":519,"startIndex":519},{"sentenceRefId":"s10","endIndex":648,"startIndex":648},{"sentenceRefId":"s13","endIndex":696,"startIndex":696},{"sentenceRefId":"s13","endIndex":751,"startIndex":751},{"sentenceRefId":"s14","endIndex":795,"startIndex":795},{"sentenceRefId":"s15","endIndex":919,"startIndex":919},{"sentenceRefId":"s17","endIndex":1072,"startIndex":1072},{"sentenceRefId":"s17","endIndex":1086,"startIndex":1086},{"sentenceRefId":"s18","endIndex":1089,"startIndex":1089},{"sentenceRefId":"s18","endIndex":1117,"startIndex":1117},{"sentenceRefId":"s22","endIndex":1419,"startIndex":1419},{"sentenceRefId":"s22","endIndex":1449,"startIndex":1449}],"word":"i"}],"status":"success"},"paragraph":"&#34;Good question!&#34; I thought, when I was first asked this a few years back. I spent a good half hour scanning my life, looking at all the highs and lows. I have to admit, I had a good number of regrets, things I would do differently, if I could do them all over again. And I also had a lot of experiences that I treasured and  wouldn&#39;t change a bit. But something I had never done before? What if I had 6 months left to live, what have I always wanted to do, but haven&#39;t done yet? This intrigued me, yet I came up blank. I couldn&#39;t think of anything at all. This question rumbled around my mind, off and on, for quite some time. Then out of the blue I got the answer. Go to a tropical island! Yes! I have never been to a tropical island and that&#39;s what I want to do! Then, a funny thing happened, I quickly forgot about this whole little process that had been going on and never gave it another thought. Soon after that, I had a series of eight past life regression\/healings. They were all very interesting and healing and varied greatly in content. The last one was a life I had on Kaua&#39;i. I never had an inkling that I had any connection with Hawaii at all. The session itself was incredible; the clearest of them all, very much like watching a movie. At the end of the session, all my Aumakua (Hawaiian ancestors) came to me anrd there were huge colored waves of healing running through me. The love was awesome! When I came out of the regression, I was even craving Hawaiian food!","spellingFeedback":{"misspelledWords":[{"positions":[{"sentenceRefId":"s15","endIndex":971,"startIndex":964}],"word":"healings"},{"positions":[{"sentenceRefId":"s17","endIndex":1086,"startIndex":1081}],"word":"Kaua&#39;i"},{"positions":[{"sentenceRefId":"s20","endIndex":1292,"startIndex":1286}],"word":"Aumakua"},{"positions":[{"sentenceRefId":"s20","endIndex":1329,"startIndex":1326}],"word":"anrd"}],"status":"success"},"prologue":{"status":"success","transactionId":"c17a43e1-46a6-11e1-a0cd-c82a1416fe11"},"score":2,"sentences":[{"id":"s0","position":{"endIndex":15,"startIndex":0},"text":"&#34;Good question!&#34;"},{"id":"s1","position":{"endIndex":72,"startIndex":17},"text":"I thought, when I was first asked this a few years back."},{"id":"s2","position":{"endIndex":150,"startIndex":74},"text":"I spent a good half hour scanning my life, looking at all the highs and lows."},{"id":"s3","position":{"endIndex":265,"startIndex":152},"text":"I have to admit, I had a good number of regrets, things I would do differently, if I could do them all over again."},{"id":"s4","position":{"endIndex":346,"startIndex":267},"text":"And I also had a lot of experiences that I treasured and  wouldn&#39;t change a bit."},{"id":"s5","position":{"endIndex":385,"startIndex":348},"text":"But something I had never done before?"},{"id":"s6","position":{"endIndex":477,"startIndex":387},"text":"What if I had 6 months left to live, what have I always wanted to do, but haven&#39;t done yet?"},{"id":"s7","position":{"endIndex":517,"startIndex":479},"text":"This intrigued me, yet I came up blank."},{"id":"s8","position":{"endIndex":554,"startIndex":519},"text":"I couldn&#39;t think of anything at all."},{"id":"s9","position":{"endIndex":625,"startIndex":556},"text":"This question rumbled around my mind, off and on, for quite some time."},{"id":"s10","position":{"endIndex":664,"startIndex":627},"text":"Then out of the blue I got the answer."},{"id":"s11","position":{"endIndex":689,"startIndex":666},"text":"Go to a tropical island!"},{"id":"s12","position":{"endIndex":694,"startIndex":691},"text":"Yes!"},{"id":"s13","position":{"endIndex":763,"startIndex":696},"text":"I have never been to a tropical island and that&#39;s what I want to do!"},{"id":"s14","position":{"endIndex":900,"startIndex":765},"text":"Then, a funny thing happened, I quickly forgot about this whole little process that had been going on and never gave it another thought."},{"id":"s15","position":{"endIndex":972,"startIndex":902},"text":"Soon after that, I had a series of eight past life regression\/healings."},{"id":"s16","position":{"endIndex":1046,"startIndex":974},"text":"They were all very interesting and healing and varied greatly in content."},{"id":"s17","position":{"endIndex":1087,"startIndex":1048},"text":"The last one was a life I had on Kaua&#39;i."},{"id":"s18","position":{"endIndex":1156,"startIndex":1089},"text":"I never had an inkling that I had any connection with Hawaii at all."},{"id":"s19","position":{"endIndex":1250,"startIndex":1158},"text":"The session itself was incredible; the clearest of them all, very much like watching a movie."},{"id":"s20","position":{"endIndex":1390,"startIndex":1252},"text":"At the end of the session, all my Aumakua (Hawaiian ancestors) came to me anrd there were huge colored waves of healing running through me."},{"id":"s21","position":{"endIndex":1412,"startIndex":1392},"text":"The love was awesome!"},{"id":"s22","position":{"endIndex":1481,"startIndex":1414},"text":"When I came out of the regression, I was even craving Hawaiian food!"}],"vagueAdjectivesFeedback":{"words":[{"positions":[{"sentenceRefId":"s0","endIndex":4,"startIndex":1},{"sentenceRefId":"s2","endIndex":87,"startIndex":84},{"sentenceRefId":"s3","endIndex":180,"startIndex":177}],"word":"good"},{"positions":[{"sentenceRefId":"s16","endIndex":1003,"startIndex":993}],"word":"interesting"},{"positions":[{"sentenceRefId":"s16","endIndex":991,"startIndex":988},{"sentenceRefId":"s19","endIndex":1222,"startIndex":1219}],"word":"very"}],"status":"success"},"sentenceStructureFeedback":{"tooSimilar":[],"status":"success","rating":"goodVariety"},"grammarFeedback":{"status":"success","grammarErrors":[{"position":{"sentenceRefId":"s0","endIndex":15,"startIndex":"0"},"errorText":"&#34;Good question!&#34;","description":"Sentence may be incomplete or is a sentence fragment."},{"position":{"sentenceRefId":"s6","endIndex":401,"startIndex":"401"},"errorText":"6","description":"The number 6 should be spelled out as a single digit."},{"position":{"sentenceRefId":"s12","endIndex":694,"startIndex":"691"},"errorText":"Yes!","description":"Sentence may be incomplete or is a sentence fragment."},{"position":{"sentenceRefId":"s13","endIndex":742,"startIndex":"717"},"errorText":"a tropical island and that","description":"Comma may be missing before conjunction separating independent clauses."},{"position":{"sentenceRefId":"s14","endIndex":842,"startIndex":"818"},"errorText":"this whole little process","description":"Try to use a more accurate verb than &#34;process&#34;"},{"position":{"sentenceRefId":"s17","endIndex":1086,"startIndex":"1086"},"errorText":"i","description":"This error may be resolved by fixing spelling: Capitalize the pronoun &#34;I&#34;."}]},"supportForTopicFeedback":{"status":"success","rating":"fair","doNotSupportTopic":["s12","s21"]},"transitionsFeedback":{"words":[{"positions":[{"sentenceRefId":"s1","endIndex":31,"startIndex":28},{"sentenceRefId":"s22","endIndex":1417,"startIndex":1414}],"word":"when"},{"positions":[{"sentenceRefId":"s5","endIndex":350,"startIndex":348},{"sentenceRefId":"s6","endIndex":459,"startIndex":457}],"word":"but"},{"positions":[{"sentenceRefId":"s10","endIndex":630,"startIndex":627},{"sentenceRefId":"s14","endIndex":768,"startIndex":765}],"word":"then"}],"status":"success"},"repeatedWordsFeedback":{"words":[{"positions":[{"sentenceRefId":"s0","endIndex":4,"startIndex":1},{"sentenceRefId":"s2","endIndex":87,"startIndex":84},{"sentenceRefId":"s3","endIndex":180,"startIndex":177}],"word":"good"},{"positions":[{"sentenceRefId":"s7","endIndex":507,"startIndex":504},{"sentenceRefId":"s20","endIndex":1318,"startIndex":1315},{"sentenceRefId":"s22","endIndex":1424,"startIndex":1421}],"word":"came"},{"positions":[{"sentenceRefId":"s5","endIndex":372,"startIndex":368},{"sentenceRefId":"s13","endIndex":707,"startIndex":703},{"sentenceRefId":"s14","endIndex":875,"startIndex":871},{"sentenceRefId":"s18","endIndex":1095,"startIndex":1091}],"word":"never"},{"positions":[{"sentenceRefId":"s2","endIndex":114,"startIndex":111},{"sentenceRefId":"s15","endIndex":951,"startIndex":948},{"sentenceRefId":"s17","endIndex":1070,"startIndex":1067}],"word":"life"}],"status":"success"},"redundancyFeedback":{"status":"success","redundantSentences":[]},"ideasFeedback":{"status":"success","rating":"tooManyIdeas","haveTooManyIdeas":["s14"]},"sentenceBeginningsFeedback":{"words":[{"position":{"sentenceRefId":"s0","endIndex":4,"startIndex":1},"word":"Good"},{"position":{"sentenceRefId":"s1","endIndex":17,"startIndex":17},"word":"I"},{"position":{"sentenceRefId":"s2","endIndex":74,"startIndex":74},"word":"I"},{"position":{"sentenceRefId":"s3","endIndex":152,"startIndex":152},"word":"I"},{"position":{"sentenceRefId":"s4","endIndex":269,"startIndex":267},"word":"And"},{"position":{"sentenceRefId":"s5","endIndex":350,"startIndex":348},"word":"But"},{"position":{"sentenceRefId":"s6","endIndex":390,"startIndex":387},"word":"What"},{"position":{"sentenceRefId":"s7","endIndex":482,"startIndex":479},"word":"This"},{"position":{"sentenceRefId":"s8","endIndex":519,"startIndex":519},"word":"I"},{"position":{"sentenceRefId":"s9","endIndex":559,"startIndex":556},"word":"This"},{"position":{"sentenceRefId":"s10","endIndex":630,"startIndex":627},"word":"Then"},{"position":{"sentenceRefId":"s11","endIndex":667,"startIndex":666},"word":"Go"},{"position":{"sentenceRefId":"s12","endIndex":693,"startIndex":691},"word":"Yes"},{"position":{"sentenceRefId":"s13","endIndex":696,"startIndex":696},"word":"I"},{"position":{"sentenceRefId":"s14","endIndex":768,"startIndex":765},"word":"Then"},{"position":{"sentenceRefId":"s15","endIndex":905,"startIndex":902},"word":"Soon"},{"position":{"sentenceRefId":"s16","endIndex":977,"startIndex":974},"word":"They"},{"position":{"sentenceRefId":"s17","endIndex":1050,"startIndex":1048},"word":"The"},{"position":{"sentenceRefId":"s18","endIndex":1089,"startIndex":1089},"word":"I"},{"position":{"sentenceRefId":"s19","endIndex":1160,"startIndex":1158},"word":"The"},{"position":{"sentenceRefId":"s20","endIndex":1253,"startIndex":1252},"word":"At"},{"position":{"sentenceRefId":"s21","endIndex":1394,"startIndex":1392},"word":"The"},{"position":{"sentenceRefId":"s22","endIndex":1417,"startIndex":1414},"word":"When"}],"status":"success","rating":"poorVariety"},"sentenceLengthFeedback":{"outliers":{"tooLong":[],"tooShort":["s0","s11","s12","s21"]},"status":"success","histogram":{"long":["s3","s4","s6","s14","s20"],"short":["s0","s5","s7","s8","s10","s11","s12","s21"],"medium":["s1","s2","s9","s13","s15","s16","s17","s18","s19","s22"],"rating":"goodVariety"}}}}');   
	
	setProcessPKT("paragraph" , paragraphText, ParagraphView.prompt_id);
};

ParagraphView.paragraphPKTCallback = function (data) {
	oUtility.hideLoader();
	data = data.replace(/\n/g, '\\n');
	
	try {
		ParagraphView.feedbackData = $.parseJSON(data);		
	} catch (e) {
		ParagraphView.feedbackData = {"paragraphFeedback" : {
										"prologue" : {
												"contentError" : data
											}
										} };
	}
	ParagraphView.updateAttemptData();
	AssigmentSlides.setAttemptData();
	
	ParagraphView.validateJson();
}

ParagraphView.validateJson = function () {

	var feedbackTxt = '';	
	if (typeof ParagraphView.feedbackData.paragraphFeedback == 'undefined') {		
		feedbackTxt = (typeof ParagraphView.feedbackData.Message != 'undefined')?ParagraphView.feedbackData.Message: ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT;
	}
	else if (ParagraphView.feedbackData.paragraphFeedback.prologue.contentError) {		
		var error = ParagraphView.feedbackData.paragraphFeedback.prologue.contentError;
		
		if (error == "contentTextTooLong") {			
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_LONG;			
		}
		else if (error == "contentTextTooShort") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_SHORT;			
		}
		else if (error == "contentTextRepetitious") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_REPEAT;			
		}
		else if (error == "contentTextCapitals") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_CAPITAL;			
		}
		else if (error == "contentTextUnique") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNIQUE;			
		}
		else if (error == "contentTextUnusual") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNUSUAL;			
		}
		else {
			feedbackTxt = "Unknown Error : " + error;			
		}
	}	
	else {
		/* Enable submit button if score found */
		if (ParagraphView.feedbackData.paragraphFeedback.score > 0) {
			ParagraphView['controls'].submitBtn.removeClass("btndisabled disabled");
			ParagraphView.slideStatus.updateByData({
				'submitButtonEnabled':	true
			});
		}
		else {
			ParagraphView['controls'].submitBtn.addClass("btndisabled disabled");
			ParagraphView.slideStatus.updateByData({
				'submitButtonEnabled':	false
			});
		}			
		/* plot feedback */
		ParagraphView.setFeedbackVal();
	}
	
	if (feedbackTxt != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		if ($('#instructionText').length > 0) {
			$('#instructionText').empty().html(feedbackTxt);
		}
		else {
			$("#feedback_content").empty().html(_.template($("#paragraphinstruction").html(),{"data":feedbackTxt}));
		}
		
		ParagraphView['controls'].submitBtn.addClass("btndisabled disabled");
		ParagraphView.slideStatus.updateByData({
			'submitButtonEnabled':	false
		});
	}
};

ParagraphView.setFeedbackVal = function (bDisableControls) {
	if (
		typeof bDisableControls == 'undefined' ||
		bDisableControls == null
	) {
		bDisableControls = false;
	}
    $("#feedback_content").html(_.template($("#paragraphfeedback").html(),{"data":ParagraphView.feedbackData}));
    
	var obj = ParagraphView.feedbackData,
		rating;
		
	if (_.size(obj.paragraphFeedback.supportForTopicFeedback) > 0) {
		rating = (typeof obj.paragraphFeedback.supportForTopicFeedback.rating != 'undefined') ? obj.paragraphFeedback.supportForTopicFeedback.rating : 0;
		
		$("#topic_focus").html(
			_.template(
				$("#paragraphfeedbackScore").html(),
				{
					"data":obj.paragraphFeedback.supportForTopicFeedback,
					"rating":rating,
					"title":ASSIGNMENTS.c_s_TOPIC_FOCUS_TXT,
					"drill_class":'topic_focus_drill',
					"limit": 3,
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.ideasFeedback) > 0) {
		rating = (typeof obj.paragraphFeedback.ideasFeedback.rating != 'undefined') ? obj.paragraphFeedback.ideasFeedback.rating : 0;
		
		$("#topic_development").html(
			_.template(
				$("#paragraphfeedbackScore").html(),
				{
					"data":obj.paragraphFeedback.ideasFeedback,
					"rating":rating,
					"title":ASSIGNMENTS.c_s_TOPIC_DEV_TXT,
					"drill_class":'topic_dev_drill',
					"limit": 3,
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.transitionsFeedback) > 0) {
		$("#organization").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.transitionsFeedback,		
					"title":ASSIGNMENTS.c_s_FEEDBACK_ORGANIZATION,
					"drill_class":'organization_drill',
					"last": "last",
					"msg": ASSIGNMENTS.c_s_CHECK_WORK_TXT
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.sentenceLengthFeedback) > 0) {
		rating = (typeof obj.paragraphFeedback.sentenceLengthFeedback.histogram != 'undefined') ? obj.paragraphFeedback.sentenceLengthFeedback.histogram.rating : 0;
		
		$("#length_div").html(
			_.template(
				$("#paragraphfeedbackScore").html(),
				{
					"data":obj.paragraphFeedback.sentenceLengthFeedback,
					"rating":rating,
					"title":ASSIGNMENTS.c_s_LENGTH_TXT,
					"drill_class":'length_drill',
					"limit": 2,
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.sentenceBeginningsFeedback) > 0) {	
		rating = (typeof obj.paragraphFeedback.sentenceBeginningsFeedback.rating != 'undefined') ? obj.paragraphFeedback.sentenceBeginningsFeedback.rating : 0;
		
		$("#beginnings").html(
			_.template(
				$("#paragraphfeedbackScore").html(),
				{
					"data":obj.paragraphFeedback.sentenceBeginningsFeedback,
					"rating":rating,
					"title":ASSIGNMENTS.c_s_BEGINNING_TXT,
					"drill_class":'beginning_drill',
					"limit": 2,
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.sentenceStructureFeedback) > 0) {
		rating = (typeof obj.paragraphFeedback.sentenceStructureFeedback.rating != 'undefined') ? obj.paragraphFeedback.sentenceStructureFeedback.rating : 0;
		
		$("#structure").html(
			_.template(
				$("#paragraphfeedbackScore").html(),
				{
					"data":obj.paragraphFeedback.sentenceStructureFeedback,
					"rating":rating,
					"title":ASSIGNMENTS.c_s_STRUCTURE_TXT,
					"drill_class":'structure_drill',
					"limit": 2,
					"last": "last"
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.vagueAdjectivesFeedback) > 0) {
		if(_.size(obj.paragraphFeedback.vagueAdjectivesFeedback.words) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#vague_adj").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.vagueAdjectivesFeedback,		
					"title":ASSIGNMENTS.c_s_VAGUE_ADJECTIVE,
					"drill_class":'vague_drill',
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					"msg": show_txt
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.repeatedWordsFeedback) > 0) {
		if(_.size(obj.paragraphFeedback.repeatedWordsFeedback.words) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		$("#repeated_words").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.repeatedWordsFeedback,		
					"title":ASSIGNMENTS.c_s_REPEATED_WORDS,
					"drill_class":'repeated_drill',
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					"msg": show_txt
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.pronounsFeedback) > 0) {
		if(_.size(obj.paragraphFeedback.pronounsFeedback.words) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#pronounce").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.pronounsFeedback,
					"title":ASSIGNMENTS.c_s_PRONOUNS,
					"drill_class":'pronounce_drill',
					"last": "last",
					"msg": show_txt
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.spellingFeedback) > 0) {
		if (_.size(obj.paragraphFeedback.spellingFeedback.misspelledWords) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#spelling").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.spellingFeedback,		
					"title":ASSIGNMENTS.c_s_SPELLING_TXT,
					"drill_class":'spelling_drill',
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					"msg": show_txt
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.grammarFeedback) > 0) {
		if(_.size(obj.paragraphFeedback.grammarFeedback.grammarErrors) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#grammar").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),
				{
					"data":obj.paragraphFeedback.grammarFeedback,		
					"title":ASSIGNMENTS.c_s_GRAMMAR_TXT,
					"drill_class":'grammar_drill',
					"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
					"msg": show_txt
				}
			)
		);
	}
	
	if (_.size(obj.paragraphFeedback.redundancyFeedback) > 0) {
		if(_.size(obj.paragraphFeedback.redundancyFeedback.redundantSentences) > 0) {
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else {
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#repeated_ideas").html(
			_.template(
				$("#paragraphfeedbackCheck").html(),{
					"data":obj.paragraphFeedback.redundancyFeedback,		
					"title":ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT,
					"drill_class":'repeated_ideas_drill',
					"last": "last",
					"msg": show_txt
				}
			)
		);
	}
	
	ParagraphView.bindFeedbackEvents();
	if (bDisableControls !== false) {
		$('#paragraph-score-container').addClass('disable-controls');
	}
}

ParagraphView.bindFeedbackEvents = function() {	
	
	$(".topic_focus_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		var highlight_topics = obj.supportForTopicFeedback.doNotSupportTopic;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var paragraphText = ParagraphView['controls'].typeareaText.val();		
		
		$.each(sentences, function(key,val){			
			var highlight = ($.inArray(val.id,highlight_topics) != -1)?'style="background-color:yellow"':GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';			
			brtxt = appendBrTag(paragraphText, val.text);			
			drill_text += brtxt;
			
		});		
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.good.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.good.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FAIR)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.fair.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.fair.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.poor.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.poor.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.tooFewSentences.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = '';
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_TOPIC_FOCUS_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');		
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();	
	});
	
	$(".topic_dev_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var paragraphText = ParagraphView['controls'].typeareaText.val();
		
		$.each(sentences, function(key,val){
			drill_text += '<span id="'+val.id+'">'+val.text+'</span>';
			brtxt = appendBrTag(paragraphText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooFewIdeas.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooFewIdeas.links;
		}
		else if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_MANY_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooManyIdeas.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooManyIdeas.links;
		}
		else if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_RIGHT_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.rightNumberOfIdeas.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.rightNumberOfIdeas.links;
		}
		else
		{
			var hint_text = '';
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_TOPIC_DEV_TXT);	
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();	
	});
	
	$(".organization_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		
		var highlight_words = obj.transitionsFeedback.words;			
					
		var pos_arr = new Array();
		var j = 0;
		$.each(highlight_words, function(k,word_id) {							
			var prependStr = '<span style="background-color:yellow">';
			var appendStr = '</span>';
			$.each(word_id.positions, function(key,pos) {
				pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
				j++;
			});
		});	
												
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback)
		{
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback.text;	
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback.links;
		}
		else
		{
			var hint_text = '';
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_FEEDBACK_ORGANIZATION);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();	
	});
	
	$(".length_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		var sentences = obj.sentences;
		var highlight_short = obj.sentenceLengthFeedback.histogram.short;
		var highlight_long = obj.sentenceLengthFeedback.histogram.long;
		var highlight_medium = obj.sentenceLengthFeedback.histogram.medium;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var paragraphText = ParagraphView['controls'].typeareaText.val();
		
		$.each(sentences, function(key,val){
			if(($.inArray(val.id,highlight_short) != -1))
			{
				var highlight = 'style="background-color:yellow"';
			}
			else if(($.inArray(val.id,highlight_medium) != -1))
			{
				var highlight = 'style="background-color:red"';
			}
			else if(($.inArray(val.id,highlight_long) != -1))
			{
				var highlight = 'style="background-color:green"';
			}
			else
			{
				var highlight = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			}			
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(paragraphText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.goodVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.goodVariety.links;
		}
		else if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.poorVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.poorVariety.links;
		}
		else if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.tooFewSentences.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_LENGTH_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();	
	});
	
	$(".beginning_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.sentenceBeginningsFeedback.words;
				
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';
													
						pos_arr[j] = {"startIndex" : word_id.position.startIndex, "endIndex" : word_id.position.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
						j++;
																		
					});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');

		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.goodVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.goodVariety.links;
		}
		else if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.poorVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.poorVariety.links;
		}
		else if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.tooFewSentences.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		}		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_BEGINNING_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".structure_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		var highlight_txt = obj.sentenceStructureFeedback.tooSimilar;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var paragraphText = ParagraphView['controls'].typeareaText.val();
		
		$.each(sentences, function(key,val){			
			var highlight = ($.inArray(val.id,highlight_txt) != -1)?'style="background-color:yellow"':GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(paragraphText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.goodVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.goodVariety.links;
		}
		else if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.poorVariety.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.poorVariety.links;
		}
		else if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.tooFewSentences.text;
			ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		}		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_STRUCTURE_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".vague_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.vagueAdjectivesFeedback.words;
		
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.vagueAdjectivesFeedback.text;	
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.vagueAdjectivesFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_VAGUE_ADJECTIVE);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".repeated_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.repeatedWordsFeedback.words;
		
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.repeatedWordsFeedback.text;
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.repeatedWordsFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_REPEATED_WORDS);		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".pronounce_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.pronounsFeedback.words;		
					
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.pronounsFeedback.text;
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.pronounsFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_PRONOUNS);		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".spelling_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.spellingFeedback.misspelledWords;		
		
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.text;
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_SPELLING_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".grammar_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.paragraph);
		var summary = ParagraphView['controls'].typeareaText.val();
		var highlight_words = obj.grammarFeedback.grammarErrors;
		var pos_arr = new Array();
		$.each(highlight_words, function(k,word_id){
						
			var highlight_txt = word_id.errorText;
			var link_txt = word_id.description;
			link_txt = link_txt.replace("'", "\'").replace('"', '\"');
			
			var prependStr = '<span style="background-color:yellow" class="linkto" data-linktxt="'+link_txt+'">';
			var appendStr = '</span>';
			
			pos_arr[k] = {"startIndex" : word_id.position.startIndex, "endIndex" : word_id.position.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
			
			/*var re = new RegExp('(\\s|,|!|\\\\?)'+highlight_txt+'(\\s|.|,|!|\\\\?)', 'g');
			var rep = ' <span style="background-color:yellow;" class="linkto" data-linktxt="'+link_txt+'">'+highlight_txt+'</span> ';

			summary = summary.replace(re, rep);	*/					
			
		});	
		
		summary = highlightWords(summary,pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.grammarFeedback.text;	
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.grammarFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_GRAMMAR_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$(".repeated_ideas_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = ParagraphView.feedbackData.paragraphFeedback;
		var highlight_txt = obj.redundancyFeedback.redundantSentences;		
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var paragraphText = ParagraphView['controls'].typeareaText.val();
		
		$.each(sentences, function(key,val){
			var highlight = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			$.each(highlight_txt, function(k,sentence_arr)
			{							
				if($.inArray(val.id,sentence_arr) != -1)
				{
					highlight = 'style="background-color:'+ASSIGNMENTS.c_a_HIGHLIGHT_COLOR[k]+'"';
				}
			});
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(paragraphText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.text;
		ParagraphView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT);
		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		ParagraphView.bindDrilledEvents();
		ParagraphView.resize();
	});
	
	$('.backtofeedbck').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE);
		$("#score_container").show();
		$('.drill_container').hide();		
		$('.backtofeedbck').hide();
		ParagraphView.resize();
	});
	
}

ParagraphView.bindDrilledEvents = function () {
	$('#drill_hint_txt a').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(e){
		e.preventDefault();
		var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		var linkText = _.pluck([ParagraphView.drilledlinks], linkTxt );
		ParagraphView.feedbackHead = $('.new_tab_space_title_tab h3').text();
		$('.new_tab_space_title_tab h3').text(linkText[0].title);
		$('.hint_tab_space_inner').hide();
		$('#drill_text').hide();
		$('#link_text').html('<p>'+linkText[0].text+'</p>').show();
		$('.back_bttn').hide();
		$('.backtodrill').show();
		ParagraphView.resize();
	});
	
	$('.drill_container .linkto').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		var linkTxt = $(this).data('linktxt');
		ParagraphView.feedbackHead = $('.new_tab_space_title_tab h3').text();
		$('.new_tab_space_title_tab h3').text($(this).text());
		$('.hint_tab_space_inner').hide();
		$('#drill_text').hide();
		$('#link_text').html('<p>'+linkTxt+'</p>').show();
		$('.back_bttn').hide();
		$('.backtodrill').show();
		ParagraphView.resize();
	});
	
	$('.backtodrill').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(ParagraphView.feedbackHead);
		$(".hint_tab_space_inner").show();
		$('#drill_text').show();
		$('#link_text').hide();	
		$('.back_bttn').hide();		
		$('.backtofeedbck').show();
		ParagraphView.resize();
	});
}

ParagraphView.loadInstruction = function () {
    
	$(this).addClass('active');
    $("#feedback_tab").removeClass('active');
    $('.new_tab_space_title_tab .back_bttn').hide();
    $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_INSTRUCTION_TAB_TITLE)); 
    $("#feedback_content").empty().html(_.template($("#paragraphinstruction").html(),{"data":ParagraphView.model.text}));
    ParagraphView.resize();
	setTimeout(function(){
		$('#instructionText a').off("click " + sWindowsEventType).on("click " + sWindowsEventType,ParagraphView.linksCall);
    },200);
}

ParagraphView.loadFeedback = function () {
    $(this).addClass('active');
    $("#instruction_tab").removeClass('active');
    $('.new_tab_space_title_tab .back_bttn').hide();
    $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
	
	if(ParagraphView.paraScored == true) {
		$('#instructionText').empty().html('<p>'+ASSIGNMENTS.c_s_PARA_SCORED_MSG+'</p>');
		return false;
	}
    else if (ParagraphView['controls'].getFeedbackBtn.hasClass('active') && 
			typeof ParagraphView.feedbackData != 'undefined' && 
			ParagraphView.feedbackData != null
			) {
		ParagraphView.validateJson();
    }
	else {
        var feedbackTxt = ASSIGNMENTS.c_s_PARAGRAPF_FEEDBACK_TXT;
        $('#instructionText').empty().html(feedbackTxt);
		ParagraphView.resize();
    }
	ParagraphView.retrieveScore();
}

ParagraphView.linksCall = function (e) {
    e.preventDefault();
    $('.backtoinst').show();
    var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
    var linkText = _.pluck([ParagraphView.model.links], linkTxt );
	$(".summary_right_box .new_tab_space_title_tab h3").html(linkText[0].title);
    $("#instructionText").html(linkText[0].text);
	ParagraphView.resize();	
}

ParagraphView.submitEnable = function () {
	var attr = ParagraphView['controls'].typeareaText.attr('readonly');
	
	if (typeof attr !== 'undefined' && attr !== false) { return false;}
	
	if($.trim(ParagraphView['controls'].typeareaText.val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK){
		ParagraphView['controls'].getFeedbackBtn.removeClass('btndisabled disabled').addClass('active');
	}else{
		ParagraphView['controls'].getFeedbackBtn.addClass('btndisabled disabled').removeClass('active');
	}
	ParagraphView['controls'].submitBtn.addClass("btndisabled disabled");
}

ParagraphView.print = function () {
    //window.print();
	/*Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);*/
	//AssignmentsView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
}

ParagraphView.email = function () {
    //window.print();
	/*Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);*/
	//AssignmentsView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
}

ParagraphView.resize = function () {
    var cont_height = parseInt($('.continent_box_inner').height());
    var bttn_box_height = 0;
    if($('.edit_box_title').length){
        bttn_box_height = $('.edit_box_title').height();
    }
    var actual_height = cont_height - bttn_box_height;    
    
    var bttnHeight = parseInt($('.get_feedback').css('padding-top')) + parseInt($('.get_feedback').css('padding-bottom'))
	+ parseInt($('.get_feedback').css('margin-top')) + parseInt($('.get_feedback').css('margin-bottom')); 
	
	var prompt_height = $('.prompt_container').height();
	
    var txt_box_height = actual_height - bttnHeight - prompt_height - 105;
    $('.text_box_area').height(txt_box_height+'px');	
	
	setTimeout(function(){
		var feedback_content_height = $(".continent_conts").height() - $('.new_tab_space_title').height() - $('.new_tab_space_title_tab').height() - 25;	
		$("#feedback_content").css("height",feedback_content_height);
		
		$('#instructionText.paragraph_instructionText').css("max-height",(feedback_content_height - 50)+'px');		
		
		if($('.drill_container .new_tab_space_inner .scroller_panel').length && $('.drill_container .new_tab_space_inner .scroller_panel').is(":visible"))
		{			
			var drill_height = feedback_content_height - $('.drill_container .hint_tab_space_inner').height() - parseInt($('.drill_container').css('padding-top')) - parseInt($('.drill_container').css('padding-bottom')) - parseInt($('.drill_container .hint_tab_space_inner').css('margin-bottom')) - parseInt($('.new_tab_space_inner').css('padding-top')) - parseInt($('.new_tab_space_inner').css('padding-bottom')) - 30;
			
			$('.drill_container .new_tab_space_inner .scroller_panel').css('height',drill_height);
		}
	},100);	
}

/********************************************************************************************************/

function EssayView () {}

EssayView.slideIdx = null;
EssayView.model = null;
EssayView.Instructionlinks = {};
EssayView.viewType = "partEssay";
EssayView.serviceCall = "essayFeedback";
EssayView.feedbackDataClear = true;
EssayView.studentAttemptDataObj = null;
EssayView.feedbackHead = '';
EssayView.drilledlinks = {};
EssayView.savedDataLoaded = false;
EssayView._confirm = ISeriesBase.prototype._confirm;
EssayView._alert = ISeriesBase.prototype._alert;
EssayView.essayScored = false;

EssayView.init = function (slideIdx, model) {	
    //Initialize Properties
	EssayView.slideIdx = slideIdx;
	EssayView.model = model;
	EssayView.controls = {};
	
	EssayView.resetProperties();		
	EssayView.render();
};

EssayView.resetProperties = function () {
	EssayView.Instructionlinks = {};
	EssayView.viewType = "partEssay";
	EssayView.serviceCall = "essayFeedback";
	EssayView.feedbackDataClear = true;
	EssayView.studentAttemptDataObj = null;
	EssayView.feedbackHead = '';
	EssayView.drilledlinks = {};
	EssayView.savedDataLoaded = false;
	EssayView.essayScored = false;
};

EssayView.render = function () {
	
	var tempData = AssigmentSlides.getAttemptDataForGradeableItem.Content[0].StudentAttemptData;	
	if (tempData != null && tempData.match(/itemSlides/g) != null) {				
		EssayView.studentAttemptDataObj = JSON.parse(tempData);		
	}
    
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_ESSAY_SLIDE).html(),
			{
				"data":					EssayView.model,
				"mediaPath":			AssigmentSlides.mediaPath,
				"referenceKey":			AssigmentSlides.referenceKey + "___" + EssayView.slideIdx,
				"studentAttemptData":	EssayView.studentAttemptDataObj,
				'slideType': 			ASSIGNMENTS.c_s_TYPE_TPL_ESSAY
			}
		)
	);
    
	$('#essay_tabs').tabs({
		activate: function(event, ui){
			EssayView.feedbackDataClear = true;
			if (ui.newPanel.selector == "#tabs-4") {
				EssayView.renderWhole();
				EssayView.viewType = "wholeEssay";
			}
			else {
				EssayView.viewType = "partEssay";
			}
			
			if ($("#feedback_tab").hasClass('active')) {			
				EssayView.loadFeedback();
			}
			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
				var oCurrentSlide = jQuery('#' + AssigmentSlides.referenceKey + "___" + EssayView.slideIdx);
				AssigmentSlides.prepare4View(oCurrentSlide);
			}
		}
	});
	
	/* load library json & current book info */
	AssignmentsView.loadCurrentBook();	
	AssignmentsView.hideMainLoader();
	
	/**
     * Set Header Items
     */       
    EssayView.loadControls();
	
	EssayView.updateAttemptData();
	EssayView.saveAttemptData();
    EssayView.resize();	
		
    EssayView.bindEvents();
	EssayView.retrieveScore();
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		var oCurrentSlide = EssayView['controls'].container;
		AssigmentSlides.prepare4View(oCurrentSlide);
	}
};

EssayView.loadControls = function () {
	var oSelf = this;
	
	oSelf['controls'].container = $('#' + AssigmentSlides.referenceKey + "___" + oSelf.slideIdx);
	
	oSelf['controls'].printBtn = $("#btnprint_essay");
	oSelf['controls'].emailBtn = $("#btnemail_essay");
	oSelf['controls'].submitBtn = $("#btnsubmit_essay");
    oSelf['controls'].typeareaTextIntro = $("#txtEssayIntro");
	oSelf['controls'].typeareaTextBody = $("#txtEssayBody"); 
	oSelf['controls'].typeareaTextConclusion = $("#txtEssayConclusion"); 
	oSelf['controls'].typeareaTextWhole = $("#txtEssayWhole"); 
	oSelf['controls'].tabIntro = $("#tabs-1");
	oSelf['controls'].tabBody = $("#tabs-2"); 
	oSelf['controls'].tabConclusion = $("#tabs-3"); 
	oSelf['controls'].tabWhole = $("#tabs-4");
    oSelf['controls'].instructionTab = $("#" + ASSIGNMENTS.c_s_INSTRUCTION_TABID);
    oSelf['controls'].feedbackTab = $("#" + ASSIGNMENTS.c_s_FEEDBACK_TABID);
	oSelf['controls'].getFeedbackIntroBtn = $("#getFeedbackIntro");
	oSelf['controls'].getFeedbackBodyBtn = $("#getFeedbackBody");
	oSelf['controls'].getFeedbackConclusionBtn = $("#getFeedbackConclusion");
	oSelf['controls'].getFeedbackWholeBtn = $("#getFeedbackWhole");
	
	oSelf['controls'].feedbackContent = $("#" + ASSIGNMENTS.c_s_FEEDBACK_TABID.replace('_tab', '_content'));
};

EssayView.getScore = function () {
	var oSelf = this,
		oSlideScore = {};
		
	if (
		typeof oSelf.studentAttemptDataObj != 'undefined' &&
		oSelf.studentAttemptDataObj != null &&
			'itemSlides' in oSelf.studentAttemptDataObj &&
			typeof oSelf.studentAttemptDataObj['itemSlides'] != 'undefined' &&
			oSelf.studentAttemptDataObj['itemSlides'] instanceof Array &&
				'slideScore' in oSelf.studentAttemptDataObj['itemSlides'].first() &&
				typeof oSelf.studentAttemptDataObj['itemSlides'].first().slideScore != 'undefined' &&
				oSelf.studentAttemptDataObj['itemSlides'].first().slideScore != null &&
			AssignmentsView.reassignCount == 0
	) {
		oSlideScore = oSelf.studentAttemptDataObj['itemSlides'].first().slideScore;
	}
	if (
		typeof oSlideScore != 'undefined' &&
		typeof oSlideScore == 'object' &&
		oSlideScore != null &&
			'essayScore' in oSlideScore &&
			typeof oSlideScore['essayScore'] != 'undefined' &&
			oSlideScore['essayScore'] != null &&
			oSlideScore['essayScore'] != 'null' &&
				'overallScore' in oSlideScore['essayScore'] &&
				typeof oSlideScore['essayScore']['overallScore'] != 'undefined' &&
				oSlideScore['essayScore']['overallScore'] != null &&
				!isNaN(oSlideScore['essayScore']['overallScore'])
	) {
		return decodePKTSlideScore(oSlideScore);
	}
	return false;
};

EssayView.retrieveScore = function () {
	var oSelf = this,
		mixSlideScore = false;
	/*==== If already scored, show score ====*/
	if (mixSlideScore = oSelf.getScore()) {	
		EssayView.savedDataLoaded = true;
		oSelf.feedbackData = null;
		oSelf.feedbackScoreData = mixSlideScore;
		EssayView.viewType = "wholeEssay";
		
		$('li[aria-controls="tabs-4"] a').trigger('click');
		EssayView.renderWhole();
		$(".summary_right_box .new_tab_space_title_tab h3").html(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE);
		oSelf.setFeedbackVal();
		$('#feedback_tab').addClass('active');
		$('#feedback_tab').siblings().removeClass('active');
		$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
		
		/*==== Disable Button Clicks ====*/
		$('.disable-controls img').off('click tap ' + sWindowsEventType);
		/*== End Disable Button Clicks ==*/
	}
	else {
		EssayView.loadInstruction();
	}
	/*== End If already scored, show score ==*/
};

EssayView.updateAttemptData = function () {
	EssayView.savedDataLoaded = false;
	
	var intro = encodeURIComponent(jQuery('<div/>').html(EssayView['controls'].typeareaTextIntro.val()).text().trim());	
	var body = encodeURIComponent(jQuery('<div/>').html(EssayView['controls'].typeareaTextBody.val()).text().trim());	
	var conclusion = encodeURIComponent(jQuery('<div/>').html(EssayView['controls'].typeareaTextConclusion.val()).text().trim());	
	
	var wholeData = {
		"intro":		intro,
		"body":			body,
		"conclusion":	conclusion,
        "questionId" : EssayView.model.question_id
	};
	
	if (EssayView.studentAttemptDataObj != null) {
		var slideAttempt = EssayView.studentAttemptDataObj.itemSlides[0].slideAttempt + 1;
	}
	else{
		var slideAttempt = 1;
	}
	var slideScore = (EssayView.feedbackScoreData != null)? encodePKTSlideScore(EssayView.feedbackScoreData): GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	var systemScore = (EssayView.feedbackScoreData != null)? EssayView.feedbackScoreData.essayScore.overallScore: 0;
	var itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);

	AssigmentSlides.studentAttemptData = {
		"itemId": itemId, 
		"itemSlides": [{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK, 
				"slideType": ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY,
				"slideAttempt": slideAttempt,
				"slideIsCorrect": null,
				"slideScore": slideScore,
				"slideInputData": wholeData
			}
		],
		"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY
	};
    
    AssigmentSlides.studentAttemptSummary = {};

	AssigmentSlides.systemScore = systemScore;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
};

EssayView.saveAttemptData = function () {
	AssigmentSlides.setAttemptData();
}

EssayView.bindEvents = function () {  
    EssayView['controls'].emailBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.email);
    EssayView['controls'].printBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.print);
    EssayView['controls'].typeareaTextIntro.off("keyup input").on("keyup input", EssayView.submitEnableIntro);
	EssayView['controls'].typeareaTextIntro.on("blur", EssayView.updateAttemptData);
	EssayView['controls'].typeareaTextBody.off("keyup input").on("keyup input", EssayView.submitEnableBody);
	EssayView['controls'].typeareaTextBody.on("blur", EssayView.updateAttemptData);
	EssayView['controls'].typeareaTextConclusion.off("keyup input").on("keyup input", EssayView.submitEnableConclusion);
	EssayView['controls'].typeareaTextConclusion.on("blur", EssayView.updateAttemptData);	
    //$("#essay_tabs textarea").on("touchstart", EssayView.focusSelection);
	EssayView['controls'].submitBtn.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.submit_gradeable);
	
    //instruction tab
    EssayView['controls'].instructionTab.off("click " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.loadInstruction);
    
    //feedback tab
    EssayView['controls'].feedbackTab.off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.loadFeedback);
    
    EssayView['controls'].getFeedbackIntroBtn.off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType,EssayView.getFeedbackCall);
	EssayView['controls'].getFeedbackBodyBtn.off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType,EssayView.getFeedbackCall);
	EssayView['controls'].getFeedbackConclusionBtn.off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType,EssayView.getFeedbackCall);
	EssayView['controls'].getFeedbackWholeBtn.off("click tap touchstart " + sWindowsEventType).on("click tap touchstart " + sWindowsEventType,EssayView.getFeedbackCall);
	
    $('#instructionText a').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,EssayView.linksCall);
    $('.backtoinst').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,EssayView.loadInstruction);
	$('.backtodetail').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,EssayView.loadInstructionDetail);
	
	$(".prompt_text_heading").off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, function(e) {
		var  elem = $(".prompt_text_container");
		//e.stopPropagation();
		if (elem.hasClass('active')) {
			elem.removeClass("active");
			$('.paragraph_prompt_slide > .scroll_padding > .continent_content_inner > .text_box_area').addClass('accordin_slide_close').removeClass('accordin_slide_open');
			$('.prompt_text_heading > .arrow_pd').addClass('arrow_lr').removeClass('arrow_pd');
			elem.slideUp(500);
		}
		else {
			$('.paragraph_prompt_slide > .scroll_padding > .continent_content_inner > .text_box_area').addClass('accordin_slide_open').removeClass('accordin_slide_close');
			
			$('.prompt_text_heading > .arrow_lr').addClass('arrow_pd').removeClass('arrow_lr');
			elem.addClass("active");
			elem.slideDown(500);
		}
	});	
	
	// Book Icon - Show Current Book	
	$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap").on("click tap", function(){		
		$("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).toggle();
	});
    
    // Book Icon - Hide Current Book	
	$(".wrapper").off("click tap").on("click tap", function(event){        
        if (event.target.id != ASSIGNMENTS.c_s_BOOK_ICON && $("#"+ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).has(event.target).length == 0) {
		  $("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
        }
	});	
	
	// Bind view current reading and notebook link	
	$('[id^='+ASSIGNMENTS.c_s_ASSIGNMENT_VIEW_CURRENTREADING+'_]').off("click tap").on("click tap", function(){
	
		/*== Check if Writing Exceeding Max Limit ==*/
		if (AssigmentSlides.checkMaxCharLimit()) {			
			return;
		}
		
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': 'none',
			'click-to-hide': false,
			'opacity': 0.5
		});		
		
		var bookId = $(this).attr('book_id'),
            BookType   =   $(this).attr('book_type'),
            wordCount  =   $(this).attr('word_count'),
            bookTitle  =   $(this).attr('book_title'),
			fileType   =   $(this).attr('file_type'),
			iBookNumPage  = $(this).attr('bookNumPage');
		
		// save data before leaving page
		EssayView.updateAttemptData();		
		$.when(EssayView.saveAttemptData()).done(function (){		
			AssignmentsView.iLoadTOCScreen = 0;
			if(fileType == 'pdf'){				
				GetPDFInfo(bookId, bookTitle, BookType, wordCount, iBookNumPage, 'assignment');
				return false;
			}else{		
				var sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
					sItemAttemptId = AssigmentSlides.oAssignmentKeyData['itemAttemptId'],
					sHeaderTitle = AssigmentSlides.oAssignmentKeyData['headerTitle'], 
					sAssignmentType = AssigmentSlides.oAssignmentKeyData['assignmentType'], 
					sAssignmentSubType = AssigmentSlides.oAssignmentKeyData['assignmentSubType'];
					sReassignCount = AssigmentSlides.oAssignmentKeyData['reassignCount'];
				
				var returnUrl = 'assignment.html' +
					'?assignment-id=' + sAssignmentId +
					'&item-attempt-id=' + sItemAttemptId +
					'&header-title=' + encodeURIComponent(sHeaderTitle) +
					'&assignment-type=' + sAssignmentType +
					'&assignment-sub-type=' + sAssignmentSubType +
					'&study-plan-sub-type=' +
					'&reassignCount=' + sReassignCount +
					'&comment=' + $.trim($('#' + ASSIGNMENTS.c_s_SHOW_COMMENT + ' > comment').text());
			
				sIframeUrl = LIBRARY.c_s_PLAYER_URL + bookId + "|||" + bookTitle + "|||" + BookType + "|||" + wordCount+ "|||" + "assignment" + "|||"+fileType+"|||"+iBookNumPage+"|||context=" + returnUrl;	
					
				setTimeout(function(){			
					location.href = sIframeUrl;
				}, 1000);
				return false;			
			 }	
		});
	});
};

EssayView.submitEnableIntro = function () {    
	if ($.trim(EssayView['controls'].typeareaTextIntro.val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		EssayView['controls'].getFeedbackIntroBtn.removeClass('btndisabled disabled').addClass('active');
	}
	else {
		EssayView['controls'].getFeedbackIntroBtn.addClass('btndisabled disabled').removeClass('active');
	}
	EssayView['controls'].submitBtn.addClass("btndisabled disabled");
}

EssayView.submitEnableBody = function () {
	if ($.trim(EssayView['controls'].typeareaTextBody.val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		EssayView['controls'].getFeedbackBodyBtn.removeClass('btndisabled disabled').addClass('active');
	}
	else {
		EssayView['controls'].getFeedbackBodyBtn.addClass('btndisabled disabled').removeClass('active');
	}
	EssayView['controls'].submitBtn.addClass("btndisabled disabled");
}

EssayView.submitEnableConclusion = function () {    
	if ($.trim(EssayView['controls'].typeareaTextConclusion.val()) != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		EssayView['controls'].getFeedbackConclusionBtn.removeClass('btndisabled disabled').addClass('active');
	}
	else {
		EssayView['controls'].getFeedbackConclusionBtn.addClass('btndisabled disabled').removeClass('active');
	}
	EssayView['controls'].submitBtn.addClass("btndisabled disabled");
}

EssayView.submit_gradeable = function () {
	if (EssayView['controls'].submitBtn.hasClass("btndisabled")) {
		return false;
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}
	
	EssayView._confirm({
		'title':	'Are you sure?',
		'divId':	'dialog-message',
		'message':	ASSIGNMENTS.c_s_CONFIRM_SUBMIT_MSG,
		'yes': function(){
			var oTemplate = {};
			var assignment_id = (AssignmentsView.slideDataValue).split('___');	
			
			var paraText = EssayView['controls'].typeareaTextWhole.text();
			paraText = paraText.replace(/"/g,"\\\"");
			AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
			
			/* if auto score set isStudentScore = true */
			/*== start - if iLit20 and Narrative Essay is OFF ==*/
			if (
				((AssignmentsView.productCode || '').startsWith("ilit20")) && 
				(objSettingsData.Content.AcceptNarrativeEssayResponseScore == '0') 
			) 
			{
				AssigmentSlides.IsStudentScored = "1";
			}
			else{
				AssigmentSlides.IsStudentScored = "0";
			}
			/*== end - if iLit20 and Narrative Essay is OFF ==*/
	
			
			AssigmentSlides.studentAttemptSummary = {};
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
			oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = EssayView.model.question_id;
			oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = 0;			
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
				
			objStudentAttemptDataResponse = 0;
			EssayView.saveAttemptData();
			
			$.monitor({
				'if':			function () {					
					return (
						(
							typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0
						) ||
						(
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
						)
					);
				},
				'beforeStart':	function () {
				},
				'interval':		500,
				'then':			function () {					
					if (
						typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null
					) {
						EssayView['controls'].submitBtn.addClass("btndisabled disabled"); 
						EssayView['controls'].getFeedbackWholeBtn.addClass("btndisabled disabled");
						EssayView['controls'].emailBtn.addClass("btndisabled disabled"); 
						EssayView['controls'].printBtn.addClass("btndisabled disabled");
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
						
						EssayView.essayScored = true;			
						
						$("#feedback_tab").addClass('active');
						$("#instruction_tab").removeClass('active');			
						$("#feedback_content").empty().html(_.template($("#essayinstruction").html(),{'data':null}));
						$("#instructionList").hide();
						$('.new_tab_space_title_tab .back_bttn').hide();
						$('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
						$("#instructionText").empty().html('<p>' + ASSIGNMENTS.c_s_ESSAY_SCORED_MSG + '</p>').show();
						EssayView['controls'].getFeedbackWholeBtn.hide();

						$('#' + ASSIGNMENTS.c_s_BOOK_ICON).off("click tap");
						$('#' + ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
						$('#' + ASSIGNMENTS.c_s_SHOW_COMMENT).remove();
						
						setTimeout(function () {
							EssayView.AttemptGradeableItemCallback();
						}, 500);
					}
					else {
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});			
		}
	});
};

EssayView.AttemptGradeableItemCallback = function () {
	var oControls = EssayView.controls;
	
	for (var sControl in oControls) {
		if (sControl.endsWith('Btn')) {
			oControls[sControl]
				.attr('disabled', 'disabled')
				.addClass('btndisabled')
				.addClass('disabled');
		}
		else if (sControl.startsWith('typearea')) {
			if (oControls[sControl] instanceof Array) {
				for (var iCIdx = 0; iCIdx < oControls[sControl].length; iCIdx++) {
					oControls[sControl][iCIdx].attr('disabled', 'disabled');
				}
			}
			else {
				oControls[sControl].attr('disabled', 'disabled');
			}
		}
	}
	/* setTimeout(function(){
		AssignmentsView.prev.trigger('click');
	}, 1000); */
};

EssayView.renderWhole = function() {	
	
	var intro = jQuery('<div/>').html(EssayView['controls'].typeareaTextIntro.val()).text().trim().replace(/\n/g,'<br />');
	var body = jQuery('<div/>').html(EssayView['controls'].typeareaTextBody.val()).text().trim().replace(/\n/g,'<br />');
	var conclusion = jQuery('<div/>').html(EssayView['controls'].typeareaTextConclusion.val()).text().trim().replace(/\n/g,'<br />');	
	
	EssayView['controls'].typeareaTextWhole.html(intro +"<br />"+ body +"<br />"+ conclusion);
	
	if(intro == '' && body == '' && conclusion == '') {
		EssayView['controls'].getFeedbackWholeBtn.addClass("btndisabled disabled");
	}
	else {
		EssayView['controls'].getFeedbackWholeBtn.removeClass("btndisabled disabled");
	}
}

EssayView.loadInstruction = function () {    
	$(this).addClass('active');
    $("#feedback_tab").removeClass('active');
    $('.new_tab_space_title_tab .back_bttn').hide();
    $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_INSTRUCTION_TAB_TITLE)); 
    $("#feedback_content").empty().html(_.template($("#essayinstruction").html(),{"data":EssayView.model.writing_stages}));
    
	setTimeout(function(){
		$("#instructionList li").off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType, EssayView.InstructionBrief);
    }, 200);
	EssayView.resize();
}

EssayView.loadInstructionDetail = function () {	
	$('.new_tab_space_title_tab .back_bttn').hide();
	$('.backtoinst').show();   
	$(".summary_right_box .new_tab_space_title_tab h3").html(EssayView.feedbackHead);	
    $("#instructionDetail").hide();
	$("#instructionText").show(); 	
	EssayView.resize();
};

EssayView.loadFeedback = function () {	
    $(this).addClass('active');
    $("#instruction_tab").removeClass('active');
    $('.new_tab_space_title_tab .back_bttn').hide();
    $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
	
	var getFeedbackBttn = $("div[aria-expanded='true']").find('.get_feedback');
	
	if(EssayView.essayScored == true)
	{
		$('#feedback_content').empty().html(_.template($("#essayinstruction").html(),{"data":null}));
		$("#instructionList").hide();
		$("#instructionText").empty().html('<p>'+ASSIGNMENTS.c_s_ESSAY_SCORED_MSG+'</p>').show();				
		return false;
	}
    else if (
		getFeedbackBttn.hasClass('active clicked') &&
		EssayView.feedbackDataClear == false
	) {
		EssayView.validateJson();		
    }
	else {
        var feedbackTxt = ASSIGNMENTS.c_s_PARAGRAPF_FEEDBACK_TXT;		
		$("#feedback_content").empty().html(_.template($("#essayinstruction").html(),{"data":EssayView.model.writing_stages}));
		$("#instructionList").hide();
		$("#instructionText").empty().html(feedbackTxt).show();
		EssayView.resize();
    }
	if (EssayView.viewType == "wholeEssay" && EssayView.savedDataLoaded == true) {
		EssayView.retrieveScore();
	}
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		var oCurrentSlide = EssayView['controls'].container;
		AssigmentSlides.prepare4View(oCurrentSlide);
	}
}

EssayView.linksCall = function (e) {	
    e.preventDefault();
	$('.new_tab_space_title_tab .back_bttn').hide();
    $('.backtodetail').show();
    var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);	
    var linkText = _.pluck([EssayView.Instructionlinks], linkTxt );
	EssayView.feedbackHead = $(".summary_right_box .new_tab_space_title_tab h3").text();
	$(".summary_right_box .new_tab_space_title_tab h3").html(linkText[0].title);
	$("#instructionText").hide();
    $("#instructionDetail").html(linkText[0].text).show(); 
	EssayView.resize();
}

EssayView.InstructionBrief = function () {	
    $('.backtoinst').show();
    var label = $(this).data('label');
    var Text = $(this).data('text');
	$(".summary_right_box .new_tab_space_title_tab h3").html(label);
	$("#instructionList").hide();
    $("#instructionText").html(unescape(Text)).show();
	
	/*setTimeout(function(){*/		
		var obj = _.where(EssayView.model.writing_stages,{'label':label});		
		EssayView.Instructionlinks = obj[0].links;		
		$('#instructionText a').off("click " + sWindowsEventType).on("click " + sWindowsEventType, EssayView.linksCall);		
    /*},200);*/
	EssayView.resize();
}

EssayView.focusSelection = function(e){
	e.stopPropagation();
	$("#essay_tabs textarea").focus();
}

EssayView.getFeedbackCall = function () {   
   if ($(this).hasClass("btndisabled")) return; 
	
	$(this).addClass('clicked');
	EssayView.feedbackDataClear = false;	
	
   var id = $(this).attr('id');   
   if(id == "getFeedbackIntro")
   {
		var txtArea = EssayView['controls'].typeareaTextIntro;
		var essayTxt = txtArea.val();
		var method = "essayFeedback";
		var contentType = "introduction";
   }
   else if(id == "getFeedbackBody")
   {
		var txtArea = EssayView['controls'].typeareaTextBody;
		var essayTxt = txtArea.val();
		var method = "essayFeedback";
		var contentType = "body";
   }
   else if(id == "getFeedbackConclusion")
   {
		var txtArea = EssayView['controls'].typeareaTextConclusion;
		var essayTxt = txtArea.val();
		var method = "essayFeedback";
		var contentType = "conclusion";
   }
   else if(id == "getFeedbackWhole")
   {
		var txtArea = EssayView['controls'].typeareaTextWhole;
		var essayTxt = CodeToSpecialChar(String(txtArea.html()));
		var method = "essayScore";
		var contentType = "";		
   }
   
   if ((id != "getFeedbackWhole" && essayTxt.length > GENERAL.c_i_ESSAY_CHAR_LIMIT) || 
		(id == "getFeedbackWhole" && essayTxt.length > GENERAL.c_i_ESSAY_WHOLE_CHAR_LIMIT)) {
		EssayView._alert({
						divId:		'dialog-message',
						title:		'Alert!',
						message:	GENERAL.c_s_MAX_SIZE_EXCEED_MSSG
					}, function(){
						return;
					});
		return;
	}
	
	/*== Check if Writing Exceeding Max Limit in Intro, Body, Conc ==*/
	if (id == "getFeedbackWhole") {		
		if (AssigmentSlides.checkMaxCharLimit()) {			
			return;
		}
	}
	
	oUtility.showLoader({
	  'message': '<img src="media/loader.gif" alt="" />',
	  'background-color': 'none',
	  'click-to-hide': false,
	  'opacity': 0.5
	});
   
   
   EssayView.serviceCall = method;
   
   txtArea.blur();   
   $(this).focus();
   
   $('.new_tab_space_title_tab .back_bttn').hide();
	
   $("#feedback_tab").addClass('active');
   $("#instruction_tab").removeClass('active');

   $('.new_tab_space_title_tab h3').text($.trim(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE));
   
   EssayView.feedbackData = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
   
   var current_slide = AssigmentSlides.getCurrentActiveSlide();
	var current_slide_reference_key = current_slide.attr('reference-key').split('___');
	var slide_obj_key = current_slide_reference_key[3];		
	EssayView.prompt_id = AssigmentSlides.model[slide_obj_key].prompt_id;
	
	if (oPlatform.isIOS()) {
		essayTxt = essayTxt.replace(/"/g, "&#34;").replace(/“/g, "&#34;").replace(/”/g, "&#34;");
	}
	else {
		essayTxt = essayTxt.replace(/"/g,"\\\"");
	}
   
	var PKTmethod = (method == 'essayFeedback') ? 'paragraph' : method;	
	setProcessPKT(PKTmethod , essayTxt, EssayView.prompt_id, contentType); 
   
}

EssayView.essayPKTCallback = function (data) {
	data = data.replace(/\n/g, '\\n');
	oUtility.hideLoader();
	
	try {
		EssayView.feedbackData = $.parseJSON(data);
	} catch (e) {		
		EssayView.feedbackData = {"paragraphFeedback" : {
										"prologue" : {
												"contentError" : data
											}
										} };
	}
	EssayView.serviceCall = "essayFeedback";
	
	EssayView.updateAttemptData();	
	AssigmentSlides.setAttemptData();
	
	EssayView.validateJson();   
};

EssayView.essayScorePKTCallback = function (data) {     
	data = data.replace(/\n/g, '\\n');
	oUtility.hideLoader();
	
	try {
		EssayView.feedbackScoreData = $.parseJSON(data);
	} catch (e) {		
		EssayView.feedbackScoreData = {"essayScore" : {
										"prologue" : {
												"contentError" : data
											}
										} };
	}
	EssayView.serviceCall = "essayScore";   
   
	EssayView.updateAttemptData();	
	AssigmentSlides.setAttemptData();
	
	EssayView.validateJson();   
};

EssayView.validateJson = function () {
		
	if (EssayView.serviceCall == "essayScore" && typeof EssayView.feedbackScoreData.essayScore != 'undefined') {
		var jsonFeedback = EssayView.feedbackScoreData.essayScore;
	}	
	else if (typeof EssayView.feedbackData.paragraphFeedback != 'undefined') {
		var jsonFeedback = EssayView.feedbackData.paragraphFeedback;
	}	
	
	var feedbackTxt = '';
	if (EssayView.serviceCall != "essayScore" && typeof EssayView.feedbackData.paragraphFeedback == 'undefined') {			
		
		feedbackTxt = (typeof EssayView.feedbackData.Message != 'undefined')?EssayView.feedbackData.Message: ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT;				
	}	
	else if (EssayView.serviceCall == "essayScore" && typeof EssayView.feedbackScoreData.essayScore == 'undefined') {		
		
		feedbackTxt = (typeof EssayView.feedbackScoreData.Message != 'undefined')?EssayView.feedbackScoreData.Message: ASSIGNMENTS.c_s_SERVICE_ERROR_TEXT;				
	}	
	else if (jsonFeedback.prologue.contentError) {		
		var error = jsonFeedback.prologue.contentError; 
		if (error == "contentTextTooLong") {			
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_LONG;			
		}
		else if (error == "contentTextTooShort") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_SHORT;			
		}
		else if (error == "contentTextRepetitious") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_REPEAT;			
		}
		else if (error == "contentTextCapitals") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_CAPITAL;			
		}
		else if (error == "contentTextUnique") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNIQUE;			
		}
		else if (error == "contentTextUnusual") {
			feedbackTxt = ASSIGNMENTS.c_s_CONTENT_TEXT_UNUSUAL;			
		}
		else {
			feedbackTxt = "Unknown Error : "+error;
		}
		
	}
	else if (jsonFeedback.prologue.status && jsonFeedback.prologue.status == ASSIGNMENTS.c_s_SERVICE_UNAVAILABLE) {
		feedbackTxt = ASSIGNMENTS.c_s_SERVICE_UNAVAILABLE_MSG;
	}
	else {
		if (EssayView.serviceCall == "essayScore") {
			EssayView.serviceCall = "essayFeedback";			
			var essayTxt = CodeToSpecialChar(String(EssayView['controls'].typeareaTextWhole.html()));
			if (oPlatform.isIOS()) {
				essayTxt = essayTxt.replace(/"/g, "&#34;").replace(/“/g, "&#34;").replace(/”/g, "&#34;");
			}
			else {
				essayTxt = essayTxt.replace(/"/g,"\\\"");
			}
			
			var contentType = "introduction";			
			setProcessPKT("paragraph" , essayTxt, EssayView.prompt_id, contentType); 
		}
		else {
			/* Enable submit button if score found */
			if (
				EssayView.viewType == "wholeEssay" &&
				EssayView.feedbackScoreData.essayScore.scored == true &&
				EssayView.feedbackScoreData.essayScore.overallScore > 0
			) {
				$('#btnsubmit_essay').removeClass("btndisabled disabled");
			}
			else if (EssayView.viewType == "wholeEssay") {
				$('#btnsubmit_essay').addClass("btndisabled disabled");
			}
			/* plot feedback */
			EssayView.setFeedbackVal();
		}
	}
	
	if (feedbackTxt != GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		$("#feedback_content").empty().html(_.template($("#essayinstruction").html(),{"data":EssayView.model.writing_stages}));
		$("#instructionList").hide();
		$("#instructionText").empty().html(feedbackTxt).show();
		
		$('#btnsubmit_essay').addClass("btndisabled disabled");
		if (EssayView.viewType == "wholeEssay") {
			//ALERT(ASSIGNMENTS.c_s_TRY_AGAIN_ALERT);
		}
	}
};

EssayView.setFeedbackVal = function () {
	
    $("#feedback_content").html(_.template($("#essayfeedback").html(),{"data":EssayView.feedbackData,"scoreData":EssayView.feedbackScoreData}));
	
	var objData = (EssayView.feedbackData != null)?EssayView.feedbackData.paragraphFeedback:{};	
	
	if(_.size(objData.supportForTopicFeedback) > 0)
	{
		$("#topic_focus").html(_.template($("#essayfeedbackScore").html(),{
			"data":objData.supportForTopicFeedback,
			"rating":objData.supportForTopicFeedback.rating,
			"title":ASSIGNMENTS.c_s_TOPIC_FOCUS_TXT,
			"drill_class":'topic_focus_drill',
			"limit": 3,
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		}));
	}
	
	if(_.size(objData.ideasFeedback) > 0)
	{
		$("#topic_development").html(_.template($("#essayfeedbackScore").html(),{
			"data":objData.ideasFeedback,
			"rating":objData.ideasFeedback.rating,
			"title":ASSIGNMENTS.c_s_TOPIC_DEV_TXT,
			"drill_class":'topic_dev_drill',
			"limit": 3,
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		}));
	}
	
	if(_.size(objData.transitionsFeedback) > 0)
	{
		$("#organization").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.transitionsFeedback,		
			"title":ASSIGNMENTS.c_s_FEEDBACK_ORGANIZATION,
			"drill_class":'organization_drill',
			"last": "last",
			"msg": ASSIGNMENTS.c_s_CHECK_WORK_TXT
		}));
	}
	
	if(_.size(objData.sentenceLengthFeedback) > 0)
	{
		$("#length_div").html(_.template($("#essayfeedbackScore").html(),{
			"data":objData.sentenceLengthFeedback,
			"rating":objData.sentenceLengthFeedback.histogram.rating,
			"title":ASSIGNMENTS.c_s_LENGTH_TXT,
			"drill_class":'length_drill',
			"limit": 2,
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		}));
	}
	
	if(_.size(objData.sentenceBeginningsFeedback) > 0)
	{	
		$("#beginnings").html(_.template($("#essayfeedbackScore").html(),{
			"data":objData.sentenceBeginningsFeedback,
			"rating":objData.sentenceBeginningsFeedback.rating,
			"title":ASSIGNMENTS.c_s_BEGINNING_TXT,
			"drill_class":'beginning_drill',
			"limit": 2,
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		}));
	}
	
	if(_.size(objData.sentenceStructureFeedback) > 0)
	{
		$("#structure").html(_.template($("#essayfeedbackScore").html(),{
			"data":objData.sentenceStructureFeedback,
			"rating":objData.sentenceStructureFeedback.rating,
			"title":ASSIGNMENTS.c_s_STRUCTURE_TXT,
			"drill_class":'structure_drill',
			"limit": 2,
			"last": "last"
		}));
	}
	
	if(_.size(objData.vagueAdjectivesFeedback) > 0)
	{
		if(_.size(objData.vagueAdjectivesFeedback.words) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#vague_adj").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.vagueAdjectivesFeedback,		
			"title":ASSIGNMENTS.c_s_VAGUE_ADJECTIVE,
			"drill_class":'vague_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#vague_adj").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_VAGUE_ADJECTIVE,
			"drill_class":'vague_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	if(_.size(objData.repeatedWordsFeedback) > 0)
	{
		if(_.size(objData.repeatedWordsFeedback.words) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#repeated_words").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.repeatedWordsFeedback,		
			"title":ASSIGNMENTS.c_s_REPEATED_WORDS,
			"drill_class":'repeated_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#repeated_words").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_REPEATED_WORDS,
			"drill_class":'repeated_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	if(_.size(objData.pronounsFeedback) > 0)
	{
		if(_.size(objData.pronounsFeedback.words) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#pronounce").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.pronounsFeedback,		
			"title":ASSIGNMENTS.c_s_PRONOUNS,
			"drill_class":'pronounce_drill',
			"last": "last",
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#pronounce").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_PRONOUNS,
			"drill_class":'pronounce_drill',
			"last": "last",
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	if(_.size(objData.spellingFeedback) > 0)
	{
		if(_.size(objData.spellingFeedback.misspelledWords) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#spelling").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.spellingFeedback,		
			"title":ASSIGNMENTS.c_s_SPELLING_TXT,
			"drill_class":'spelling_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#spelling").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_SPELLING_TXT,
			"drill_class":'spelling_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	if(_.size(objData.grammarFeedback) > 0)
	{
		if(_.size(objData.grammarFeedback.grammarErrors) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#grammar").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.grammarFeedback,		
			"title":ASSIGNMENTS.c_s_GRAMMAR_TXT,
			"drill_class":'grammar_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#grammar").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_GRAMMAR_TXT,
			"drill_class":'grammar_drill',
			"last": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	if(_.size(objData.redundancyFeedback) > 0)
	{
		if(_.size(objData.redundancyFeedback.redundantSentences) > 0)
		{
			var show_txt = '<span class="span_red">'+ASSIGNMENTS.c_s_CHECK_WORK_TXT+'</span>';
		}
		else
		{
			var show_txt = '<span class="span_green">'+ASSIGNMENTS.c_s_NO_MISTAKES_TXT+'</span>';
		}
		
		$("#repeated_ideas").html(_.template($("#essayfeedbackCheck").html(),{
			"data":objData.redundancyFeedback,		
			"title":ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT,
			"drill_class":'repeated_ideas_drill',
			"last": "last",
			"msg": show_txt
		}));
	}
	else if(EssayView.savedDataLoaded == true)
	{
		$("#repeated_ideas").html(_.template($("#essayfeedbackCheck").html(),{
			"data":{"0":"0"},		
			"title":ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT,
			"drill_class":'repeated_ideas_drill',
			"last": "last",
			"msg": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK
		})).addClass("disable-controls");
	}
	
	
	EssayView.bindFeedbackEvents();
}

EssayView.bindFeedbackEvents = function(){	

	$("#feedback_content").find( ".catagory_section" ).each(function(){
		$(this).find('.catagory_row').last().addClass("last");
	});
	
	$(".topic_focus_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		var highlight_topics = obj.supportForTopicFeedback.doNotSupportTopic;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var essayText = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());	
		
		$.each(sentences, function(key,val){			
			var highlight = ($.inArray(val.id,highlight_topics) != -1)?'style="background-color:yellow"':GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(essayText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.good.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.good.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FAIR)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.fair.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.fair.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.poor.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.poor.links;
		}
		else if(obj.supportForTopicFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.tooFewSentences.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.supportForTopicFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_TOPIC_FOCUS_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');		
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".topic_dev_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var essayText = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
				
		$.each(sentences, function(key,val){
			drill_text += '<span id="'+val.id+'">'+val.text+'</span>';
			brtxt = appendBrTag(essayText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooFewIdeas.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooFewIdeas.links;
		}
		else if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_MANY_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooManyIdeas.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.tooManyIdeas.links;
		}
		else if(obj.ideasFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_RIGHT_IDEAS)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.rightNumberOfIdeas.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.ideasFeedback.rightNumberOfIdeas.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_TOPIC_DEV_TXT);	
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();	
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".organization_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());		
		var highlight_words = obj.transitionsFeedback.words;		
		
		var pos_arr = new Array();
		var j = 0;
		$.each(highlight_words, function(k,word_id) {							
			var prependStr = '<span style="background-color:yellow">';
			var appendStr = '</span>';
			$.each(word_id.positions, function(key,pos) {
				pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
				j++;
			});
		});	
												
		summary = highlightWords(summary,pos_arr); 
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback)
		{
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.transitionsFeedback.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_FEEDBACK_ORGANIZATION);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".length_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		var sentences = obj.sentences;
		var highlight_short = obj.sentenceLengthFeedback.histogram.short;
		var highlight_long = obj.sentenceLengthFeedback.histogram.long;
		var highlight_medium = obj.sentenceLengthFeedback.histogram.medium;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var essayText = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());	
		
		$.each(sentences, function(key,val){
			if(($.inArray(val.id,highlight_short) != -1))
			{
				var highlight = 'style="background-color:yellow"';
			}
			else if(($.inArray(val.id,highlight_medium) != -1))
			{
				var highlight = 'style="background-color:red"';
			}
			else if(($.inArray(val.id,highlight_long) != -1))
			{
				var highlight = 'style="background-color:green"';
			}
			else
			{
				var highlight = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			}			
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(essayText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.goodVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.goodVariety.links;
		}
		else if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.poorVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.poorVariety.links;
		}
		else if(obj.sentenceLengthFeedback.histogram.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.tooFewSentences.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceLengthFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_LENGTH_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();	
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".beginning_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);		
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.sentenceBeginningsFeedback.words;		
					
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';
													
						pos_arr[j] = {"startIndex" : word_id.position.startIndex, "endIndex" : word_id.position.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
						j++;
																		
					});	
		
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);
					
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');

		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.goodVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.goodVariety.links;
		}
		else if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.poorVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.poorVariety.links;
		}
		else if(obj.sentenceBeginningsFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.tooFewSentences.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceBeginningsFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_BEGINNING_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".structure_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		var highlight_txt = obj.sentenceStructureFeedback.tooSimilar;
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var essayText = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
			
		$.each(sentences, function(key,val){			
			var highlight = ($.inArray(val.id,highlight_txt) != -1)?'style="background-color:yellow"':GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(essayText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
				
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_GOOD_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.goodVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.goodVariety.links;
		}
		else if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_POOR_VARIETY)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.poorVariety.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.poorVariety.links;
		}
		else if(obj.sentenceStructureFeedback.rating == ASSIGNMENTS.c_s_FEEDBACK_FEW_SENTENCES)
		{			
			var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.tooFewSentences.text;
			EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.sentenceStructureFeedback.tooFewSentences.links;
		}
		else
		{
			var hint_text = '';
			EssayView.drilledlinks = {};
		}
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_STRUCTURE_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();	
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".vague_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.vagueAdjectivesFeedback.words;		
					
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);
					
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');

		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.vagueAdjectivesFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.vagueAdjectivesFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_VAGUE_ADJECTIVE);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".repeated_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.repeatedWordsFeedback.words;
				
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});
		
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);

		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
					
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.repeatedWordsFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.repeatedWordsFeedback.links;		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_REPEATED_WORDS);		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".pronounce_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.pronounsFeedback.words;		
					
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);

		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.pronounsFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.pronounsFeedback.links;		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_PRONOUNS);		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".spelling_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.spellingFeedback.misspelledWords;
					
		var pos_arr = new Array();
		var j=0;
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.word;						
						
						var prependStr = '<span style="background-color:yellow">';
						var appendStr = '</span>';						
						
						$.each(word_id.positions, function(key,pos){							
							pos_arr[j] = {"startIndex" : pos.startIndex, "endIndex" : pos.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};
							j++;
						});												
					});	
		
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);
					
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');

		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.spellingFeedback.links;		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_SPELLING_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".grammar_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		//var summary = CodeToSpecialChar(obj.essay);
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var summary = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		var highlight_words = obj.grammarFeedback.grammarErrors;
		
		var pos_arr = new Array();
		$.each(highlight_words, function(k,word_id){
						
						var highlight_txt = word_id.errorText;
						var link_txt = word_id.description;
						link_txt = link_txt.replace("'", "\'").replace('"', '\"');
						
						var prependStr = '<span style="background-color:yellow" class="linkto" data-linktxt="'+link_txt+'">';
						var appendStr = '</span>';
						
						pos_arr[k] = {"startIndex" : word_id.position.startIndex, "endIndex" : word_id.position.endIndex, "prependStr" : prependStr, "appendStr" : appendStr};						
					});	
		summary = highlightWords(summary.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n"),pos_arr);
		
		// For \n to br replacement
		summary = summary.replace(/\n/g, '<br />');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.grammarFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.grammarFeedback.links;
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_GRAMMAR_TXT);
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+summary+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
			
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".repeated_ideas_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var obj = EssayView.feedbackData.paragraphFeedback;
		var highlight_txt = obj.redundancyFeedback.redundantSentences;		
		var sentences = obj.sentences;
		var drill_text = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		var txtarea = $('.ui-tabs-panel[aria-hidden="false"] textarea');
		var essayText = (txtarea.length) ? txtarea.val() : String($('.ui-tabs-panel[aria-hidden="false"] .txtarea').html());
		
		$.each(sentences, function(key,val){
			var highlight = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			$.each(highlight_txt, function(k,sentence_arr)
			{							
				if($.inArray(val.id,sentence_arr) != -1)
				{
					highlight = 'style="background-color:'+ASSIGNMENTS.c_a_HIGHLIGHT_COLOR[k]+'"';
				}
			});
			
			drill_text += '<span id="'+val.id+'" '+highlight+'>'+val.text+'</span>';
			brtxt = appendBrTag(essayText, val.text);			
			drill_text += brtxt;
		});
		
		// For \n to br replacement
		drill_text = drill_text.replace(/\n/g, '<br />');
			
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];
		
		var hint_text = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tip.tips.redundancyFeedback.links;		
				
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_REPEATED_IDEAS_TXT);
		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});
	
	$(".trait_drill").parent().parent().parent()
	.off("click tap " + sWindowsEventType)
	.on("click tap " + sWindowsEventType,function(){
		
		var score = $(this).find('.trait_drill').data('score');
		var drill_text = EssayView['controls'].typeareaTextWhole.html();
		var heading = $(this).find('.trait_drill').data('heading');
		
		/* hint text */
		var current_slide = AssigmentSlides.getCurrentActiveSlide();
		var current_slide_reference_key = current_slide.attr('reference-key').split('___');
		var slide_obj_key = current_slide_reference_key[3];		
		var objName = _.where(ASSIGNMENT_ESSAY_TRAITS, {"c_s_CODE": $(this).find('.trait_drill').data('code')});		
		var c_s_name = (objName[0].c_s_NAME == 'Fluency')?'Sentence Fluency':objName[0].c_s_NAME;
		var tips = AssigmentSlides.model[slide_obj_key].tips;		
		
		var re = new RegExp(c_s_name+' '+score, "g"),
			sMatchKey = null,
			oLink = {},
			hint_text = '';
			
		$.each(tips, function(key, val){			
			sMatchKey = key.match(re);
			if (sMatchKey != null) {
				oLink = val.links;
				hint_text = (_.size(oLink) != 0) ? val.text : '';
				EssayView.drilledlinks = (_.size(oLink) != 0) ? val.links[score] : '';				
				if (_.size(oLink) != 0) {
					return false;
				}
			}
		});		
		
		/* var hint_text = AssigmentSlides.model[slide_obj_key].tips[c_s_name+' '+score].text;
		EssayView.drilledlinks = AssigmentSlides.model[slide_obj_key].tips[c_s_name+' '+score].links[score]; */		
				
		$('.new_tab_space_title_tab h3').text(heading);
		
		$("#score_container").hide();
		$('.drill_container').show();
		$('#drill_text').html('<p>'+drill_text+'</p>');
		$('#drill_hint_txt').html(hint_text);
		$('.backtofeedbck').show();
		EssayView.bindDrilledEvents();
		EssayView.resize();
	});	
	
	
	$('.backtofeedbck').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(ASSIGNMENTS.c_s_FEEDBACK_TAB_TITLE);
		$("#score_container").show();
		$('.drill_container').hide();		
		$('.backtofeedbck').hide();
		EssayView.resize();
	});
}

EssayView.bindDrilledEvents = function () {
	$('#drill_hint_txt a').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(e){
		e.preventDefault();
		var linkTxt = $(this).attr('href').replace('#', GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		if(linkTxt == "Sub-Level-tip")
		{			
			var title = $(this).attr('title');
			var txt = EssayView.drilledlinks.text;
		}
		else
		{
			var linkText = _.pluck([EssayView.drilledlinks], linkTxt );
			var title = (typeof linkText[0] != 'undefined')?linkText[0].title:'';
			var txt = (typeof linkText[0] != 'undefined')?linkText[0].text:'';
		}
		
		EssayView.feedbackHead = $('.new_tab_space_title_tab h3').text();
		$('.new_tab_space_title_tab h3').text(title);
		$('.hint_tab_space_inner').hide();
		$('#drill_text').hide();
		$('#link_text').html('<p>'+txt+'</p>').show();
		$('.back_bttn').hide();
		$('.backtodrill').show();
		EssayView.resize();
	});
	
	$('.drill_container .linkto').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		var linkTxt = $(this).data('linktxt');
		EssayView.feedbackHead = $('.new_tab_space_title_tab h3').text();
		$('.new_tab_space_title_tab h3').text($(this).text());
		$('.hint_tab_space_inner').hide();
		$('#drill_text').hide();
		$('#link_text').html('<p>'+linkTxt+'</p>').show();
		$('.back_bttn').hide();
		$('.backtodrill').show();		
		EssayView.resize();
	});
	
	$('.backtodrill').off("click tap " + sWindowsEventType).on("click tap " + sWindowsEventType,function(){
		$('.new_tab_space_title_tab h3').text(EssayView.feedbackHead);
		$(".hint_tab_space_inner").show();
		$('#drill_text').show();
		$('#link_text').hide();	
		$('.back_bttn').hide();		
		$('.backtofeedbck').show();
		
		//EssayView.drilledlinks = {};
		EssayView.feedbackHead = '';		
		EssayView.resize();
	});
}

EssayView.print = function () {
    //window.print();
	/*Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);*/
	//AssignmentsView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
}

EssayView.email = function () {
    //window.print();
	/*Message.write("Under Construction", Message.c_s_MESSAGE_TYPE_ALERT);*/
	//AssignmentsView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
}

EssayView.resize = function () {	
    var cont_height = $('.continent_box_inner').height();	
    var bttn_box_height = 0;
    if($('.edit_box_title').length){
        bttn_box_height = $('.edit_box_title').height();
    }	
    var actual_height = cont_height - bttn_box_height;    
    
    var bttnHeight = parseInt($('.get_feedback').css('padding-top')) + parseInt($('.get_feedback').css('padding-bottom'))
	+ parseInt($('.get_feedback').css('margin-top')) + parseInt($('.get_feedback').css('margin-bottom')); 
	
	var prompt_height = $('.prompt_container').height();
	
	var tabs_height = $('.ui-tabs-nav').height();
	
	var txt_box_height = actual_height - bttnHeight - prompt_height - tabs_height - 100;
    $('.text_box_area').height(txt_box_height+'px');	
	
	setTimeout(function(){
		var feedback_content_height = $(".continent_conts").height() - $('.new_tab_space_title').height() - $('.new_tab_space_title_tab').height() - 25;	
		$("#feedback_content").css("height",feedback_content_height);		
		$('#instructionText.paragraph_instructionText').css("max-height",(feedback_content_height - 50)+'px');
		
		if($('.drill_container .new_tab_space_inner .scroller_panel').length && $('.drill_container .new_tab_space_inner .scroller_panel').is(":visible"))
		{
			var drill_height = feedback_content_height - $('.drill_container .hint_tab_space_inner').height() - parseInt($('.drill_container').css('padding-top')) - parseInt($('.drill_container').css('padding-bottom')) - parseInt($('.drill_container .hint_tab_space_inner').css('margin-bottom')) - parseInt($('.new_tab_space_inner').css('padding-top')) - parseInt($('.new_tab_space_inner').css('padding-bottom')) - 30;
			
			$('.drill_container .new_tab_space_inner .scroller_panel').css('height',drill_height);
		}
		
	},100);
}

function StudyPlanMasterView () {};

StudyPlanMasterView.slideIdx = null;
StudyPlanMasterView.model = null;

StudyPlanMasterView.init = function (slideIdx, model) {
	StudyPlanMasterView.slideIdx = slideIdx;
	StudyPlanMasterView.model = model;
	
	var dataValue = AssignmentsView.slideDataValue,
		dataValueArray = dataValue.split("___"),
		sAssignmentType = dataValueArray[0],
		sAssignmentSubType = dataValueArray[2],
		sAssignmentId = dataValueArray[1]
		tempModel = StudyPlanMasterView.model[sAssignmentSubType];
		
	// Pre Type
	if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE){
		StudyPlanView.init(tempModel, sAssignmentSubType);
	}
	// Post Type
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE){
		StudyPlanView.init(tempModel, sAssignmentSubType);
	}
	// Practice Type
	else if (sAssignmentSubType == ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE){
		StudyPlanPracticeView.init(tempModel);
	}
	else {
		
	}
}

StudyPlanMasterView.render = function () {}

StudyPlanMasterView.bindEvents = function () {}

StudyPlanView = {
	subType:				'',
	weightPerQuestion: 		'1',
	
	correctClass:			'correct',
	incorrectClass:			'incorrect',
	lockedClass: 			'locked',
	buttonDisabledClass: 	'disabled',
	activeClass: 			'active',
	doneClass: 				ASSIGNMENTS.c_s_DONE_CLASS,
	showScoreClass: 		'show_score',
	scoreIndicator: 		'.sprite',
	
	submitButton: 			'#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID,
	backButton: 			'#' + ASSIGNMENTS.c_s_PREV,
	
	parentContainer:		'#slide_inner_container',
	testTitleContainer:		'#' + ASSIGNMENTS.c_s_HEADER,
		container: 			GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			statusBar: 				'#' + ASSIGNMENTS.c_s_DIV_STUDY_PLAN_SHOW_SCORE_ID,
			skillTitleContainer:	'.study_plain_title',
				questionContainer: 		'.question_box_space',
				questionTextContainer:	'.study_question_title p',
					optionContainer: 		'li',
	bSubmitted:				false
};

StudyPlanView.model = null;

StudyPlanView.init = function (model, sAssignmentSubType) {
	var oSelf = this;
	
	if (typeof sAssignmentSubType == 'undefined') {
		sAssignmentSubType = ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE;
	}
	
	oSelf.subType = sAssignmentSubType;
	
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		oSelf.oSavedData = AssigmentSlides.studentAttemptData;
		oSelf.oStudentAttemptData = oSelf.oSavedData.itemSlides.first().slideInputData[oSelf.subType];
	}
	else {
		oSelf.oStudentAttemptData = {};
	}
	
	oSelf.container = '#' + AssigmentSlides.referenceKey;
	oSelf.model = model;
	
	oSelf.layout = new HeightManager([
		{
			selector:	'#slide_container .swiper-container',
			formula:	'100%',
			kids:	[
				{
					selector:	'#slide_inner_container',
					formula:	'100%',
					kids:		[
						{
							selector:	'#' + AssigmentSlides.referenceKey,
							formula:	'100%',
							kids:		[
								{
									selector:	'.study_plain_container',
									formula:	function (oElement, dBaseHeight) {
										var dSubtrahend = 0;
										for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
											dSubtrahend += (
												$(oElement).siblings().eq(iIdx).height() +
												parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
											);
										}
										$(oElement).css({
											'overflow-x':	'hidden',
											'overflow-y':	'auto'
										});
										return (dBaseHeight - dSubtrahend);
									}
								}
							]
						}
					]
				}
			]
		}
	]);
	
	oSelf.render();
	oSelf.resize();
}

StudyPlanView.render = function () {
	var oSelf = this;
	$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRE_POST_SLIDE).html(),
			{
				'data':					StudyPlanView.model,
				'referenceKey':			AssigmentSlides.referenceKey,
				'oStudentAttemptData':	oSelf.oStudentAttemptData,
				'slideType':			oSelf.subType
			}
		)
	);
	$(oSelf.container + ' ' + oSelf.submitButton).addClass(oSelf.buttonDisabledClass);
	
	/*==== Whether to Enable Submit Button ====*/
	var bEnableSubmit = !isObjectEmpty(oSelf.oStudentAttemptData),
		sQuestionId;
		
	for (var sSkillId in oSelf.oStudentAttemptData) {
		/*==== Old School ====*/
		if (['completed', 'finished'].indexOf(sSkillId.toLowerCase()) != -1) {
			continue;
		}
		/*== End Old School ==*/
		for (var sKey in oSelf.oStudentAttemptData[sSkillId]) {
			if (['totalscore', 'score', 'done'].indexOf(sKey.toLowerCase()) != -1) {
				continue;
			}
			sQuestionId = sKey;
			if (
				typeof oSelf.oStudentAttemptData[sSkillId][sQuestionId] == 'undefined' ||
				oSelf.oStudentAttemptData[sSkillId][sQuestionId] == null ||
					!('answerIndex' in oSelf.oStudentAttemptData[sSkillId][sQuestionId]) ||
					typeof oSelf.oStudentAttemptData[sSkillId][sQuestionId]['answerIndex'] == 'undefined' ||
					oSelf.oStudentAttemptData[sSkillId][sQuestionId]['answerIndex'] == null ||
					isNaN(parseInt(oSelf.oStudentAttemptData[sSkillId][sQuestionId]['answerIndex'])) ||
					oSelf.oStudentAttemptData[sSkillId][sQuestionId]['answerIndex'] == -1
			) {
				bEnableSubmit = false;
				break;
			}
		}
	}
	/*== End Whether to Enable Submit Button ==*/
	
	if (bEnableSubmit == true) {
		$(oSelf.container + ' ' + oSelf.submitButton).removeClass(oSelf.buttonDisabledClass);
	}
	
	oSelf.updateAttemptData(false);
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	oSelf.bindEvents();
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View($('' + oSelf.container));
	}
	AssignmentsView.hideMainLoader();
 };

StudyPlanView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		aAssignmentIdChunks = oSelf.container.substr(1).split('___'),
		sAssignmentId = aAssignmentIdChunks[1],
		bCompleted = true,
		oTestAttemptData = {};
	
	if (typeof bIsSubmitted == 'undefined') {
		bIsSubmitted = false;
	}
	
	$(oSelf.container + ' ' + oSelf.skillTitleContainer).each(function () { //Loop through Skills
		var sSkillId = $(this).data('skill-id'),
			iPartId = $(this).data('part-id'),
			aQuestionsUnderSkill = $(oSelf.container + ' ' + oSelf.questionContainer).filterByData('skill-id', sSkillId),
			aQuestionsUnderPart = $(oSelf.container + ' ' + oSelf.questionContainer).filterByData('part-id', iPartId),
			iCorrectAnswers = 0,
			dTotalScore = 0.0;
			
		if (typeof oTestAttemptData[sSkillId] == 'undefined') {
			oTestAttemptData[sSkillId] = {
				'totalScore':	aQuestionsUnderSkill.length * parseFloat(oSelf.weightPerQuestion),
				'score':		0,
				'done':			{}
			};
		}
		
		if (typeof oTestAttemptData[sSkillId]['done'][iPartId] == 'undefined') {
			oTestAttemptData[sSkillId]['done'][iPartId] = true;
		}
		oTestAttemptData[sSkillId]['done'][iPartId] = true;
		for (var iIndex = 0; iIndex < aQuestionsUnderPart.length; iIndex++) {
			var aOptions = $(aQuestionsUnderPart[iIndex]).find('li'),
				sQuestionId = $(aQuestionsUnderPart[iIndex]).data('question-id'),
				iAnswerIndex = aOptions.index(aOptions.filter('.' + oSelf.activeClass));
				
			oTestAttemptData[sSkillId][sQuestionId] = {
				'answerIndex':	iAnswerIndex,
				'correctness':	(aOptions.filter('.' + oSelf.activeClass).filterByData('correct', true).length != 0)
			};
			
			if (oTestAttemptData[sSkillId][sQuestionId]['correctness'] == true) {
				oTestAttemptData[sSkillId]['score']++;
			}
			else {
				oTestAttemptData[sSkillId]['done'][iPartId] = false;
			}
		}
		oTestAttemptData[sSkillId]['score'] *= parseFloat(oSelf.weightPerQuestion);;
	});
	
	if ((AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) == null) {
		AssigmentSlides.studentAttemptData = {
			"itemId": sAssignmentId,
			"itemSlides": [
				{
					"slideID": sAssignmentId,
					"slideType": ASSIGNMENTS.c_s_ASSIGNMENT_STUDYPLAN,
					"slideAttempt": 1,
					"slideIsCorrect": false,
					"slideScore": 0,
					"slideInputData": {}
				}
			],
			"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_STUDYPLAN
		};
	}
	
	AssigmentSlides.studentAttemptData.itemSlides[0].slideInputData[oSelf.subType] = oTestAttemptData;
	var oSlideInputData = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData;
	
	var dSystemScore = (
		$(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass + ' .' + oSelf.correctClass).length *
		parseFloat(oSelf.weightPerQuestion)
	)
	
	if (bIsSubmitted == false) {
		AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
		AssigmentSlides.studentAttemptSummary = {};
		if (oSelf.subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
			var oPracticeData = oSlideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] || {},
				iAttemptedQuestions = 0;
			
			for (var sSkillId in oPracticeData) {
				if (typeof oPracticeData[sSkillId] == 'object' && oPracticeData[sSkillId] != null) {
					for (var mixKey in oPracticeData[sSkillId]) {
						if (isNaN(parseInt(mixKey))) { // mixKey === sQuentionId
							if (oPracticeData[sSkillId][mixKey] == true) {
								iAttemptedQuestions++;
							}
						}
						else { // mixKey !== iPartId
							iAttemptedQuestions += 5; // 5 questions per skill
						}
					}
				}
			}
			
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = dSystemScore.toString() + '/' + iAttemptedQuestions;
		}
	}
	else {
		var oSlideInputData = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData,
			oPracticeData = oSlideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] || {},
			oPosttestData = oSlideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE] || {},
			oPretestData = oSlideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE];
			
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		
		if (oSelf.subType == ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE) {
			for (var sSkillId in oPretestData) {
				if (typeof oPretestData[sSkillId] != 'object') {
					continue;
				}
				if ('done' in oPretestData[sSkillId]) {
					if (oPretestData[sSkillId]['done'] !== true) {
						if (typeof oPretestData[sSkillId]['done'] == 'object') {
							for (var iPartId in oPretestData[sSkillId]['done']) {
								if (oPretestData[sSkillId]['done'][iPartId] == false) {
									if (typeof oPracticeData[sSkillId] == 'undefined') {
										oPracticeData[sSkillId] = {};
									}
									oPracticeData[sSkillId][iPartId] = false;
								}
							}
						}
						else {
							oPracticeData[sSkillId] = false;
						}
					}
				}
				else {
					oPracticeData[sSkillId] = false;
				}
			}
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = dSystemScore.toString();
		}
		else if (oSelf.subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		}
		
		AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE] = oPretestData;
		AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] = oPracticeData;
		AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE] = oPosttestData;
		
		/*==== Code to Compute Score & Facilitate Skill-Based Reporting ====*/
		dTotalScore = $(oSelf.container + ' ' + oSelf.questionContainer).length * parseFloat(oSelf.weightPerQuestion);

		AssigmentSlides.studentAttemptData.itemSlides[0].slideScore = dSystemScore;
		
		AssigmentSlides.systemScore = dSystemScore;
		AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.itemComplete = ASSIGNMENTS['c_s_INCOMPLETED_STATUS'];
		
		oTestAttemptData = oPretestData;
		if (oSelf.subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE) {
			oTestAttemptData = oPosttestData;
		}
		
		if (
			dSystemScore == dTotalScore ||
			oSelf.subType == ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE
		) {
			var oTemplate = {},
				sQuestionId;
			
			AssigmentSlides.finalScore = dSystemScore;
			AssigmentSlides.systemScore = dSystemScore;
			AssigmentSlides.itemComplete = ASSIGNMENTS['c_s_COMPLETED_STATUS'];
			
			for (var sSkillId in oTestAttemptData) {
				if (typeof oTestAttemptData[sSkillId] != 'object') {
					continue;
				}
				
				for (var sKey in oTestAttemptData[sSkillId]) {
					if (['totalscore', 'score', 'done'].indexOf(sKey.toLowerCase()) != -1) {
						continue;
					}
					sQuestionId = sKey;
					oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
					oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = (
						(oTestAttemptData[sSkillId][sQuestionId]['correctness'] == true)?
						parseFloat(oSelf.weightPerQuestion):
						0
					);
					AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(oTemplate);
					oTemplate = {};
				}
			}
		}
		/*== End Code to Compute Score & Facilitate Skill-Based Reporting ==*/
	}
};

StudyPlanView.resize = function () {
	var oSelf = this,
		dHeight = Math.min(parseFloat(window.outerHeight), parseFloat($(window).height())) - parseFloat($(".header_inner").height());
	
	oSelf.layout.setBaseHeight(dHeight);
	oSelf.layout.setHeight();
	$('body').css('overflow-y', 'hidden');
};

StudyPlanView.bindEvents = function () {
	var oSelf = this;
	$(oSelf.container + ' .question_part li')
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
			if ($(this).hasClass(oSelf.lockedClass)) {
				return false;
			}
			
			$(this).siblings().removeClass(oSelf.activeClass);
			$(this).addClass(oSelf.activeClass);
			if (
				$(oSelf.container + ' ' + oSelf.questionContainer).length >
				$(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass).length
			) {
				if (!$(oSelf.container + ' ' + oSelf.submitButton).hasClass(oSelf.buttonDisabledClass)) {
					$(oSelf.container + ' ' + oSelf.submitButton).addClass(oSelf.buttonDisabledClass);
				}
			}
			else {
				$(oSelf.container + ' ' + oSelf.submitButton).removeClass(oSelf.buttonDisabledClass);
			}
			oSelf.updateAttemptData(false);
		});
	
	$(oSelf.container + ' ' + oSelf.submitButton)
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
			if ($(this).hasClass(oSelf.buttonDisabledClass)) {
				return false;
			}
			
			oSelf.bSubmitted = true;
			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW) {
				$(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass).each(function () {
					$(this).find('' + oSelf.scoreIndicator).addClass(oSelf[($(this).data('correct') == true? GENERAL.c_s_SPECIAL_CHARACTERS_BLANK: 'in') + 'correctClass']);
				});
				oSelf.updateAttemptData(true); // bIsSubmitted = true
				AssigmentSlides.setAttemptData(0, function () {
					$(oSelf.container + ' ' + oSelf.questionContainer + ' ' + oSelf.optionContainer).addClass(oSelf.lockedClass);
					var dScore = (
							$(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass + ' .' + oSelf.correctClass).length *
							parseFloat(oSelf.weightPerQuestion)
						),
						dTotalScore = $(oSelf.container + ' ' + oSelf.questionContainer).length * parseFloat(oSelf.weightPerQuestion);
					
					$(oSelf.container + ' ' + oSelf.statusBar)
						.css({'text-align': 'left'})
						.html('<strong>' + $(oSelf.testTitleContainer).text() + ': ' + dScore + ASSIGNMENTS.c_s_OUT_OF_TXT + dTotalScore + '</strong><br /><small>' + ASSIGNMENTS['c_s_' + oSelf.subType.toUpperCase() + '_COMPLETED_STATUS'] + '</small>')
							.parent()
								.addClass(oSelf.showScoreClass);
					$(oSelf.backButton).addClass(oSelf.doneClass);
				});
			}
			else {
				if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
					$(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass).each(function () {
						$(this).find(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK + oSelf.scoreIndicator).addClass(oSelf[($(this).data('correct') == true? GENERAL.c_s_SPECIAL_CHARACTERS_BLANK: 'in') + 'correctClass']);
					});
					$(oSelf.container + ' ' + oSelf.questionContainer + ' ' + oSelf.optionContainer).addClass(oSelf.lockedClass);
					var dScore = $(oSelf.container + ' ' + oSelf.questionContainer + ' .' + oSelf.activeClass + ' .' + oSelf.correctClass).length * parseFloat(oSelf.weightPerQuestion);
					var dTotalScore = $(oSelf.container + ' ' + oSelf.questionContainer).length * parseFloat(oSelf.weightPerQuestion);
					$(oSelf.container + ' ' + oSelf.statusBar)
						.css({'text-align': 'left'})
						.html('<strong>' + $(oSelf.testTitleContainer).text() + ': ' + dScore + ASSIGNMENTS.c_s_OUT_OF_TXT + dTotalScore + '</strong><br /><small>' + ASSIGNMENTS['c_s_' + oSelf.subType.toUpperCase() + '_COMPLETED_STATUS'] + '</small>')
							.parent()
								.addClass(oSelf.showScoreClass);
				}
				$(this).addClass('disabled btndisabled').attr('disabled', true);
				$(oSelf.container + ' .question_part li').off('click tap ' + sWindowsEventType);
				if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR) {
					$(oSelf.container + ' .question_part li').removeClass(oSelf.activeClass);
				}
			}
		});
};

StudyPlanView._alert = ISeriesBase.prototype._alert;

/**
* Study Plan Practice Type Template
*/
var StudyPlanPracticeView = {
	weightPerQuestion: 		'1',
	
	correctClass:			'correct',
	incorrectClass:			'incorrect',
	lockedClass: 			'locked',
	buttonDisabledClass: 	'disabled',
	activeClass: 			'active',
	doneClass: 				'done',
	showScoreClass: 		'show_score',
	scoreIndicator: 		'.sprite',
	
	submitButton: 			'#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID,
	backButton: 			'#' + ASSIGNMENTS.c_s_PREV,
	
	parentContainer:		'#slide_inner_container',
	testTitleContainer:		'#' + ASSIGNMENTS.c_s_HEADER,
		container: 		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			statusBar: 				'#' + ASSIGNMENTS.c_s_DIV_STUDY_PLAN_SHOW_SCORE_ID,
			skillTitleContainer:	'.study_plain_title',
				questionContainer: 		'.question_box_space',
				questionTextContainer:	'.study_question_title p',
					optionContainer: 		'li'
};

StudyPlanPracticeView.model = null;
 
StudyPlanPracticeView.init = function (oModel) {
	var oSelf = this;
	oSelf.iErrorCount = 0;
	oSelf.sLastSkillId = '';
	oSelf.sLastSkillId4Slider = '';
	
	if ((AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) == null) {
		oSelf.oStudentAttemptData = {};
		oSelf.oSavedWholeData = {};
		oSelf.oSavedData = {};
	}
	else {
		oSelf.oSavedData = AssigmentSlides.studentAttemptData;
		oSelf.oSavedWholeData = oSelf.oSavedData.itemSlides.first();
		oSelf.oSavedWholeData.slideScore = oSelf.oSavedWholeData.slideScore.toString();
		oSelf.oSavedData = oSelf.oSavedWholeData.slideInputData;
		oSelf.oStudentAttemptData = oSelf.oSavedData.practice;
	}
	
	/*==== Fallback situation ====*/
	if (isObjectEmpty(oSelf.oStudentAttemptData)) {
		for (var idx in oModel) {
			oSelf.oStudentAttemptData[oModel[idx].subskill] = false;
		}
	}
	/*== End Fallback situation ==*/
	
	oSelf.container = '#' + AssigmentSlides.referenceKey;
	oSelf.model = oModel;
	oSelf.render();
};

StudyPlanPracticeView.render = function () {
	var oSelf = this,
		pageTitle = '',
		sSelectedSkillId = '',
		bIsFirstSkill = true,
		oStudentAttempt = {},
		oRegex = /^(Skill|skill)\s*(\d+):.*/;
		
	if ((oStudentAttempt = AssigmentSlides.getStudentAttemptForGradableItem()) == null) {
		oStudentAttempt = {};
	}
	else {
		oStudentAttempt = ((((oStudentAttempt.itemSlides || []).first()).slideInputData || {}) || {})[ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] || {};
	}
	
	if (!isObjectEmpty(oStudentAttempt)) {
		var iMinPartId = -1;
		for (sSkillId in oStudentAttempt) {
			for (var iPartId in oStudentAttempt[sSkillId]) {
				for (var idx in oSelf.model) {
					oSkill = oSelf.model[idx];
					sPageTitle = oSkill.header;
					iPartId4mModel = oSkill.skill_sequence || (
						((aMatches = sPageTitle.match(oRegex)) != null)?
						aMatches.fetch(2) || '':
						''
					);
					
					if (
						oSkill.subskill == sSkillId &&
						iPartId4mModel == iPartId
					) {
						if (iMinPartId == -1) {
							iMinPartId = iPartId;
							pageTitle = sPageTitle;
						}
						else if (iMinPartId > iPartId) {
							iMinPartId = iPartId;
							pageTitle = sPageTitle;
						}
						break;
					}
				}
			}
		}
	}
	else {
		var iMinPartId = -1;
		for (var idx in oSelf.model) {
			oSkill = oSelf.model[idx];
			sPageTitle = oSkill.header;
			
			if (oSkill.skill_sequence || (aMatches = sPageTitle.match(oRegex)) != null) {
				iPartId = parseInt(oSkill.skill_sequence) || parseInt(aMatches.fetch(2));
				
				if (iMinPartId == -1) {
					iMinPartId = iPartId;
					pageTitle = sPageTitle;
				}
				else if (iMinPartId > iPartId) {
					iMinPartId = iPartId;
					pageTitle = sPageTitle;
				}
			}
		}
	}
	
	
	$("#" + ASSIGNMENTS.c_s_SLIDE_CONTAINER).empty().html(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_MASTER).html(), {
				'pageTitle':		pageTitle
			}
		)
	);
	
	AssignmentsView.hideMainLoader();
	var aHeaderContent = [],
		oQuestionSet = {},
		aQuestionSet = [],
		iTotalQuestions = 0,
		iPartId = 1,
		sSkillId = '',
		aOrigPartIds = new Array (),
		bAllSkillsCompleted = false;
	
	if (!isObjectEmpty(oStudentAttempt)) {
		for (sSkillId in oStudentAttempt) {
			var aPartIds = _.keys(oStudentAttempt[sSkillId]);
			for (var iIdx = 0; iIdx < aPartIds.length; iIdx++) {
				aOrigPartIds.push(aPartIds[iIdx]);
			}
		}
		
		var iPartSequence = 1;
		
		for (sSkillId in oStudentAttempt) {
			for (var iPart4mAttempt in oStudentAttempt[sSkillId]) {
				iTotalQuestions = 0;
				
				for (var iIndex in oSelf.model) {
					aMatches = null;
					var oAssessmentNode = oSelf.model[iIndex].assessments.first();
					var sPageTitle = oSelf.model[iIndex].header || oAssessmentNode.page_title,
						iPart4mModel = parseInt(oAssessmentNode.skill_sequence) || parseInt(
							((aMatches = sPageTitle.match(oRegex)) != null)?
							aMatches.fetch(2):
							0
						);	
									
					
					if (iPart4mModel == iPart4mAttempt || (sPageTitle == '' && sSkillId == oAssessmentNode.subskill) ) {					
						iPartId = iPart4mAttempt;
						var iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId),
							bSkillCompleted = (oStudentAttempt[sSkillId] || {})[iOrigPartId] || false,
							sPageTitle = oSelf.model[iIndex].header;
							
						if (oAssessmentNode.skill_sequence || (aMatches = sPageTitle.match(oRegex)) != null) {
							if (oAssessmentNode.skill_sequence) {
								iPartId = parseInt(oAssessmentNode.skill_sequence);
								iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId)
							}
							else if (!isNaN(parseInt(aMatches.fetch(2)))) {
								iPartId = parseInt(aMatches.fetch(2));
								iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId)
							}
						}
						var iJ = 0;
						for (; iJ < aHeaderContent.length; iJ++) {
							if (iPartId < aHeaderContent[iJ].partId) {
								break;
							}
						}
						
						aHeaderContent.splice(iJ, 0, {
							'partId':		iPartId,
							'skillId':		sSkillId,
							'selected':		(iPartId == 1),
							'origPartId':	iOrigPartId,
							'completed':	bSkillCompleted
						});
						
						bAllSkillsCompleted = bAllSkillsCompleted || bSkillCompleted;
						
						var aQuestions = new Array ();
						
						for (var iQIdx in oAssessmentNode.questions) {
							aQuestions.push(oAssessmentNode.questions[iQIdx]);
						}
						
						for (iJ = 0; iJ < aQuestionSet.length; iJ++) {
							if (iPartId < aQuestionSet[iJ].partId) {
								break;
							}
						}
						
						aQuestionSet.splice(iJ, 0, {
							'questions':			aQuestions,
							'instructionalText':	oAssessmentNode.instructional_text,
							'partId':				iPartId++,
							'skillId':				sSkillId,
							'pageTitle':			oAssessmentNode.page_title,
							'video':				(((oSelf.model[iIndex].tutorial || []).first() || {}).video || null)
						});
					}
				}
			}
		}
	}
	else {
		for (var iIndex in oSelf.model) {
			//sKillId = oSelf.model[iIndex].assessments.first().subskill;
			sSkillId = oSelf.model[iIndex].assessments.first().subskill; //ILIT-1100 , sKillId is never being used, instead we will use sSkillId 
			
			if (true || (iTotalQuestions > 0)) {
				var iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId),
					bSkillCompleted = false,
					sPageTitle = oSelf.model[iIndex].header || oSelf.model[iIndex].assessments.first().page_title;
					
				if (oSelf.model[iIndex].assessments.first().skill_sequence || (aMatches = sPageTitle.match(oRegex)) != null) {
					if (oSelf.model[iIndex].assessments.first().skill_sequence) {
						iPartId = parseInt(oSelf.model[iIndex].assessments.first().skill_sequence);
						iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId)
					}
					else if (!isNaN(parseInt(aMatches.fetch(2)))) {
						iPartId = parseInt(aMatches.fetch(2));
						iOrigPartId = (aOrigPartIds[iPartId - 1] || iPartId)
					}
				}
				var iJ = 0;
				for (; iJ < aHeaderContent.length; iJ++) {
					if (iPartId < aHeaderContent[iJ].partId) {
						break;
					}
				}
				
				aHeaderContent.splice(iJ, 0, {
					'partId':		iPartId,
					'skillId':		sSkillId,
					'selected':		(iPartId == 1),
					'origPartId':	iOrigPartId,
					'completed':	bSkillCompleted
				});
				
				bAllSkillsCompleted = bAllSkillsCompleted || bSkillCompleted;
				
				var aQuestions = new Array ();
				
				for (var iQIdx in oSelf.model[iIndex].assessments.first().questions) {
					aQuestions.push(oSelf.model[iIndex].assessments.first().questions[iQIdx]);
				}
				
				for (iJ = 0; iJ < aQuestionSet.length; iJ++) {
					if (iPartId < aQuestionSet[iJ].partId) {
						break;
					}
				}
				
				aQuestionSet.splice(iJ, 0, {
					'questions':			aQuestions,
					'instructionalText':	oSelf.model[iIndex].assessments.first().instructional_text,
					'partId':				iPartId++,
					'skillId':				sSkillId,
					'pageTitle':			oSelf.model[iIndex].assessments.first().page_title,
					'video':				(((oSelf.model[iIndex].tutorial || []).first() || {}).video || null)
				});
			}
		}
	}
		
	aQuestionSet.last()['showSubmitButton'] = true;
	aQuestionSet.last()['enableSubmitButton'] = bAllSkillsCompleted || false;
	
	for (var iIndex = 0; iIndex < aQuestionSet.length; iIndex++) {
		var oSkillInfo = aQuestionSet[iIndex],
			sContextClueRef = oSkillInfo.partId + '___' +
				ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_EXAMPLE_TXT + '___' +
				oSkillInfo.skillId;
		
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
			_.template(
				$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_VIDEO).html(), {
					'video':			oSkillInfo.video,
					'header': 			oSkillInfo.pageTitle,
					'skillId': 			oSkillInfo.skillId,
					'partId':			oSkillInfo.partId,
					'contextClueRef':	sContextClueRef,
					// 'mediaPath': 		AssigmentSlides.mediaPath,
					'mediaPath': 		AssigmentSlides.videoPath,
					'referenceKey': 	AssigmentSlides.referenceKey
				}
			)
		);
		
		for (var iJ = 0; iJ < oSkillInfo.questions.length; iJ++) {
			$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_MCQ_QUESTION).html(), {
						'question': 			oSkillInfo.questions[iJ],
						'instructionalText':	oSkillInfo.instructionalText,
						'skillId': 				oSkillInfo.skillId,
						'partId': 				oSkillInfo.partId,
						'contextClueRef':		sContextClueRef,
						'pageTitle':			oSkillInfo.pageTitle,
						'referenceKey': 		AssigmentSlides.referenceKey,
						'includeSubmitButton':	(
							(iJ == (oSkillInfo.questions.length - 1))?
							oSkillInfo.showSubmitButton || false:
							false
						),
						'enableSubmitButton':	(
							(iJ == (oSkillInfo.questions.length - 1))?
							oSkillInfo.enableSubmitButton || false:
							false
						)
					}
				)
			);
		}
	}
	
	/*==== Make the slide acquire full avaialable width ====*/
	var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
		dButtonWidth = 0;
		
	$('.slider_pager_content_outer').find('button').each(function () {
		dButtonWidth += $(this).width();
	});
	
	var dUsableWidth = dAvailableWidth - dButtonWidth;
		
	$('.slider_pager_content')
		.width(dUsableWidth)
		.css({
			'max-width':	dUsableWidth + 'px'
		});
	/*== End Make the slide acquire full avaialable width ==*/
	
	// header HTML
	$("#" + ASSIGNMENTS.c_s_TYPE_CONTAINER_STUDY_PLAN_PRACTICE_HEADER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_HEADER).html(), {
				'aHeaderContent':	aHeaderContent
			}
		)
	);
	
	if (aHeaderContent.length == 1) {
		$("#" + ASSIGNMENTS.c_s_TYPE_CONTAINER_STUDY_PLAN_PRACTICE_HEADER).css({ 'background-image': 'none' });
		$("#" + ASSIGNMENTS.c_s_TYPE_CONTAINER_STUDY_PLAN_PRACTICE_HEADER + ' .tabs_number').css({ 'margin-right': '25px' });
	}
	
	$('#prevPagingBtn').hide();
	$(oSelf.container + ' ' + oSelf.submitButton).addClass(oSelf.buttonDisabledClass);
	
	var oPracticeData = {};
	if (
		typeof oStudentAttempt['itemSlides'] &&
		oStudentAttempt['itemSlides'] instanceof Array &&
			oStudentAttempt['itemSlides'].length > 0
	) {
		var oSlideInputData = (oStudentAttempt['itemSlides'].first().slideInputData || {})[ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE] || {},
			mixDone = false,
			iPartIndex = 1;
			
		for (var sSkillId in oSlideInputData) {
			if (typeof oPracticeData[sSkillId] == 'undefined') {
				oPracticeData[sSkillId] = {};
			}
			if (mixDone = oSlideInputData[sSkillId]['done'] || false) {
				if (typeof mixDone == 'object') {
					for (var iPartId in mixDone) {
						if (typeof oPracticeData[sSkillId][iPartId] == 'undefined') {
							oPracticeData[sSkillId][iPartId] = mixDone[iPartId];
						}
					}
				}
				else if (typeof mixDone == 'boolean') {
					if (typeof oPracticeData[sSkillId][iPartIndex] == 'undefined') {
						oPracticeData[sSkillId][iPartIndex] = mixDone;
					}
				}
			}
			iPartIndex++;
		}
	}
	
	oSelf.resize();
	
	/*==== To maintain the INPROGRESS state ====*/
	var sAttemptSummary = decodeURIComponent(AssigmentSlides.getAttemptDataForGradeableItem['Content'].first().StudentAttemptSummary),
		itemSummary = sAttemptSummary.trim('"');
		
	try {
		var mixItemSummary = JSON.parse(sAttemptSummary);
		if (typeof mixItemSummary == 'object') {
			AssigmentSlides.studentAttemptSummary = mixItemSummary;
		}
		else if (typeof parseInt(mixItemSummary) == 'number') {
			AssigmentSlides.studentAttemptSummary = {};
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = itemSummary;
			AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		}
		itemSummary = mixItemSummary[GENERAL.c_s_TXT_SCORESUMMARY];
	}
	catch (oException) {
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = itemSummary;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	}
	
	if (!isObjectEmpty(oStudentAttempt)) {
		AssigmentSlides.setAttemptData();
	}
	/*== End To maintain the INPROGRESS state ==*/
	
	oSelf.bindEvents();
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE);
	}
};

StudyPlanPracticeView.resize = function () {
	var window_height = $(window).height(),
		header = $("header").outerHeight(),
		actual_height = window_height - header,
		ui_slide_tabs_height = $(".ui_slide_tabs").outerHeight(),
		study_plain_container_contents_height = (
			actual_height - (
				ui_slide_tabs_height + parseInt($(".study_plain_container_slide").css("padding-bottom"))
			)
		),
		study_plain_heading_height = $(".study_plain_heading").outerHeight(),
		slider_pager_content_outer_height = study_plain_container_contents_height - study_plain_heading_height,
		slide_inner_container_padding = (
			parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
		);
		
	$(".study_plain_container").height(actual_height);
	$(".study_plain_container_contents").height(study_plain_container_contents_height);
	$(".slider_pager_content_outer").height(slider_pager_content_outer_height);
	$(".slider_pager_content").css("max-height",slider_pager_content_outer_height+"px");
	$(".swiper-container").height(slider_pager_content_outer_height);
	
	$("#slide_inner_container").height(slider_pager_content_outer_height - slide_inner_container_padding);
	
	$(".studyPlan_practice_mcq_wrapper").height(slider_pager_content_outer_height - slide_inner_container_padding);
	$(".studyPlan_practice_video_wrapper").height(slider_pager_content_outer_height - slide_inner_container_padding);
	
	var study_question_title_padding = parseInt($(".study_question_title").css("padding-bottom")) + parseInt($(".study_question_title").css("padding-top"));
	var study_question_mcq_content_padding = parseInt($(".study_question_mcq_content").css("padding-bottom")) + parseInt($(".study_question_mcq_content").css("padding-top"));
	
	var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
	
	var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
	$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
	$('.page_container_video').height(new_assignment_irr_sp_video_height);
	
	$(".studyPlan_practice_mcq_wrapper").find(".new_assignment_irr_sp_mcq").each(function(){
		var h = (slider_pager_content_outer_height - slide_inner_container_padding) - ($(this).parent().find(".study_question_title").outerHeight() + $(this).parent().find(".study_question_mcq_content").outerHeight() + 1 + new_assignment_irr_padding);
		$(this).height(h);
	});
}

StudyPlanPracticeView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sContainerId = AssigmentSlides.referenceKey,
		aContainerIdChunks = sContainerId.split('___'),
		sItemId = aContainerIdChunks.fetch(1),
		oPracticeInfo = {},
		oSlideInfo = {
			"slideID": sItemId,
			"slideType": aContainerIdChunks.last(),
			"slideAttempt": 1,
			"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			"slideScore": 0,
			"slideInputData": {}
		},
		iAttemptedQuestions = 0,
		iTotalQuestions = 0;
		
	if ((oStudentAttempt = AssigmentSlides.getStudentAttemptForGradableItem()) == null) {
		oStudentAttempt = {};
	}
	
	if (typeof bIsSubmitted == 'undefined') {
		bIsSubmitted = false;
	}
	
	var oPracticeInfo = (
		(
			(oStudentAttempt['itemSlides'] || []).first().slideInputData || {}
		)[ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] || {}
	);
	
	$('.tabs_number').each(function () {
		var sSkillId = $(this).data('skill-id'),
			iPartId = $(this).data('part-id'),
			aQuestions = $('#slide_inner_container .question_box_space').filterByData('skill-id', sSkillId).filterByData('part-id', iPartId);
			
		if (typeof oPracticeInfo[sSkillId] == 'undefined') {
			oPracticeInfo[sSkillId] = {};
		}
		
		oPracticeInfo[sSkillId][iPartId] = $(this).find('.no_text').hasClass(oSelf.doneClass);
		
		iTotalQuestions += aQuestions.length;
		iAttemptedQuestions += aQuestions.find('ul.' + oSelf.lockedClass).length;
	});
	
	oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE] = (
		(
			(oStudentAttempt['itemSlides'] || []).first().slideInputData || {}
		)[ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE] || {}
	);
	
	
	
	oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE] = oPracticeInfo;
	oSlideInfo['slideInputData'][ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE] = {};
	
	oSlideInfo['slideScore'] = (
		(oStudentAttempt['itemSlides'] || [{'slideScore': 0}]).first().slideScore || 0
	);
	
	AssigmentSlides.studentAttemptData = {
		"itemId": sItemId,
		"itemSlides": [
			oSlideInfo
		],
		"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": ASSIGNMENTS.c_s_ASSIGNMENT_STUDYPLAN
	};
	
	dSystemScore = oSlideInfo['slideScore'];
	
	AssigmentSlides.systemScore = dSystemScore;	
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
	
	if (iAttemptedQuestions == iTotalQuestions) {
		$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID)
			.removeClass('disabled btndisabled')
			.attr('disabled', false);
	}
	else {
		if (!$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID).hasClass('disabled')) {
			$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID).addClass('disabled');
		}
		if (!$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID).hasClass('btndisabled')) {
			$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID).addClass('btndisabled');
		}
	}
	if (bIsSubmitted) {
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = dSystemScore.toString() + '/' + iAttemptedQuestions;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		AssigmentSlides.setAttemptData(0, function () {
			AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
		});
	}
};

StudyPlanPracticeView.bindEvents = function () {
	var oSelf = this;
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
	
	$("ul.question_part > li")
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			var oLi = $(this);
			if (oLi.parent().hasClass(oSelf.lockedClass)) {
				return false;
			}
			
			var oQuestionContainer = oLi.parent().parent().parent().parent(),
				sCurrentSkillId = oQuestionContainer.data('skill-id'),
				iCurrentPartId = oQuestionContainer.data('part-id'),
				aQuestionsUnderCurrentSkill = $('.question_box_space').filterByData('skill-id', sCurrentSkillId).filterByData('part-id', iCurrentPartId);
			
			oLi.siblings().removeClass("active");
			oLi.addClass("active");
			
			if (oLi.data("correct") === false) {
				oLi.find(".incorrect").show();
				oLi.siblings().filterByData('correct', true).children(".correct").show();
				/*==== Show Incorrect Pop Up ====*/
				var iIndex = aQuestionsUnderCurrentSkill.index(oQuestionContainer);
				if (oSelf.sLastSkillId != sCurrentSkillId) {
					oSelf.sLastSkillId = sCurrentSkillId;
					oSelf.iErrorCount = 0;
				}
				oSelf.iErrorCount++;
				if (oSelf.iErrorCount % 2 == 0) {
					setTimeout(function () {
						$(".help_notification").click();
					}, 100);
					oSelf.iErrorCount = 0;
				}
				/*== End Show Incorrect Pop Up ==*/
			}
			else {
				oLi.find(".correct").show();				
			}
			oLi.parent().addClass(oSelf.lockedClass);
			/*==== Put "DONE" Class At Skill Button Selected ====*/
			if (aQuestionsUnderCurrentSkill.find('ul.' + oSelf.lockedClass).length == aQuestionsUnderCurrentSkill.length) {
				var iActiveSlideIndex = AssigmentSlides.slidingEngine.activeIndex,
					oCurrentSlide = AssigmentSlides.slidingEngine.slides[iActiveSlideIndex],
					iCurrentPartId = $(oCurrentSlide).data('part-id'),
					iActiveTabHeadIndex = 0,
					aTabHeads = $('.tabs_number');
					
				for (iActiveTabHeadIndex = 0; iActiveTabHeadIndex < aTabHeads.length; iActiveTabHeadIndex++) {
					if (iActiveSlideIndex < (iActiveTabHeadIndex + 1) * 6) {
						break;
					}
				}
				
				aTabHeads.eq(iActiveTabHeadIndex).find('.no_text').addClass(oSelf.doneClass);
			}
			/*== End Put "DONE" Class At Skill Button Selected ==*/
			oSelf.updateAttemptData();
			$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID)[(($('.tabs_number').find('.no_text').filter('.' + oSelf.doneClass).length == $('.tabs_number').length)? 'remove': 'add') + 'Class']('btndisabled disabled');
		});
	
	$(".help_notification").off("click " + sWindowsEventType).on("click " + sWindowsEventType, function () {
		var subSkillId = $('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE).data('skill-id');
		StudyPlanPracticePopupView.init(subSkillId);
	});
	
	$('#' + ASSIGNMENTS.c_s_BTN_STUDY_PLAN_SUBMIT_ANSWER_ID)
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
			if (
				$(this).hasClass('btndisabled') ||
				$(this).hasClass('disabled') ||
				AssignmentsView.prev.hasClass(ASSIGNMENTS.c_s_DONE_CLASS)
			) {
				return false;
			}
			oSelf.updateAttemptData(true);
		});
		
	/*==== Tab Heads should be clickable ====*/
	$('#studyPlan_practice_header_container .tabs_number')
		.off('click tap ' + sWindowsEventType)
		.on('click tap ' + sWindowsEventType, function () {
			var oCurrentTabHead = $(this);
			if (oCurrentTabHead.hasClass('active')) {
				return false;
			}
			
			var aSlides = $('#slide_inner_container > div'),
				aTabHeads = $('#studyPlan_practice_header_container > div'),
				oActiveSlide = aSlides.filter('.swiper-slide-visible'),
				iActiveSlideIndex = aSlides.index(oActiveSlide),
				iCurrentTabHeadIndex = aTabHeads.index(oCurrentTabHead),
				iCurrentSlideIndex = iCurrentTabHeadIndex * 6; // Video slide + 5 question slides
				
			if (iCurrentSlideIndex != iActiveSlideIndex) {
				AssigmentSlides.slidingEngine.swipeTo(iCurrentSlideIndex);
			}
		});
	/*== End Tab Heads should be clickable ==*/
};

function StudyPlanPracticePopupView () {	
}

StudyPlanPracticePopupView.model = null;
StudyPlanPracticePopupView.subSkillId = null;
StudyPlanPracticePopupView.lockedClass = 'locked';

StudyPlanPracticePopupView.init = function (subSkillId) {	
	oSelf = this;
	oSelf.subSkillId = subSkillId;
	
	var StudyPlanPracticeObj = _.where(StudyPlanPracticeView.model, {'subskill' : oSelf.subSkillId});
	
	if (typeof StudyPlanPracticeObj[0] != "undefined") {
		oSelf.model = StudyPlanPracticeObj[0].examples;
		oSelf.render();
	}
}

StudyPlanPracticePopupView.render = function() {
	var oSelf = this;
	$("body").append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_STUDY_PLAN_PRACTICE_POPUP).html(),
			{ 'data': oSelf.model }
		)
	);
	
	oSelf.bindEvents();
}
StudyPlanPracticePopupView.bindEvents = function() {
	$('.light_box_close')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function() {
			$('body .overley').remove();
			$(this).parent().remove();
		});
	
	$(".light_box_content ul.question_part > li")
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function() {
			var oLi = $(this);
			if (oLi.parent().hasClass(oSelf.lockedClass)) {
				return false;
			}
			oLi.siblings().removeClass("active");
			oLi.addClass('active');
			
			if (oLi.data("correct") === false) {
				oLi.find(".incorrect").show();				
				oLi.siblings().filterByData('correct', true).children(".correct").show();
			}
			else {
				oLi.find(".correct").show();
			}
			oLi.parent().addClass(oSelf.lockedClass);
			var ques_id = oLi.parent().attr('id').replace('ques_part_', '');
			$('#additional_txt_' + ques_id).show();
		});
}


function PhonicTextBasedView () {}

PhonicTextBasedView.slideIdx = null;
PhonicTextBasedView.model = null;
PhonicTextBasedView.lockedClass = 'locked';
PhonicTextBasedView.correctAnswers = {};
PhonicTextBasedView.maxScore = {};
PhonicTextBasedView.score = 0;
PhonicTextBasedView.totMaxScore = 0;
PhonicTextBasedView.finalSubmit = false;
PhonicTextBasedView.studentAttemptDataObj = null;
PhonicTextBasedView.studentAttemptSlideData = null;
PhonicTextBasedView.saveDataInitially = false;
PhonicTextBasedView.weightPerQuestion = 1;
PhonicTextBasedView.mySwiper = null;
PhonicTextBasedView._confirm = ISeriesBase.prototype._confirm;
PhonicTextBasedView._alert = ISeriesBase.prototype._alert;
PhonicTextBasedView.oralFluencyData = [];
PhonicTextBasedView.PKTOralFluencyScore = [];
PhonicTextBasedView.bCheckMicStatus = false;
PhonicTextBasedView.myScroll = new ScrollBars();

PhonicTextBasedView.resetClass = function () {
	var oSelf = this;
	
	oSelf.updateAttemptData = PhonicTextBasedView.updateAttemptDataFunction;
	oSelf.oralSubmit = PhonicTextBasedView.oralSubmitFunction;
	oSelf.oralfluencyReservationCall = PhonicTextBasedView.oralfluencyReservationCallFunction;
	oSelf.oralfluencySubmitScoreRequestCall = PhonicTextBasedView.oralfluencySubmitScoreRequestCallFunction;
}

PhonicTextBasedView.init = function (slideIdx, model) {
	var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf.correctAnswers = {};
	oSelf.maxScore = {};
	oSelf.score = 0;
	oSelf.totMaxScore = 0;
	oSelf.finalSubmit = false;
	oSelf.studentAttemptDataObj = null;
	oSelf.studentAttemptSlideData = null;
	oSelf.saveDataInitially = false;
	oSelf.weightPerQuestion = 1;
	oSelf.controls = {};
	oSelf.mySwiper = null;
	oSelf.oralFluencyData = [];
	oSelf.PKTOralFluencyScore = [];	
	AssigmentSlides.bAudioExists = false;
	AssigmentSlides.bAudioSaved = true;
	AssigmentSlides.bAudioPaused = false;
	oSelf._alert = ISeriesBase.prototype._alert;
	oSelf.myScroll = new ScrollBars();
	oSelf.bCheckMicStatus = false;
	
	if (AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		oSelf.resetClass();
	}
	
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC) {
		
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
			
			oSelf.studentAttemptSlideData = oSelf.fetchAttemptData();			
			
			if (oSelf.studentAttemptSlideData == null) {
				oSelf.renderExtendedPhonic();
				return;
			}
		}
		else if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				!oPlatform.isDevice()){				
			HideNativeBottomBar(false); // so even if it returns from eBook, bottom bar will not hide			
			oSelf.resize();
		}
		
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY) {
			AssignmentsView.bookicon.hide();
		}
		else {
			AssignmentsView.bookicon.show();
		}
	}	
	
	oSelf.render();
    oSelf.bindEvents();
};

/**
 * Phonic Text Based - Fetch Attempt Data
 * @method fetchAttemptData
 * @return {undefined}
 */
PhonicTextBasedView.fetchAttemptData = function () {
	var oSelf = this,
		oSlideInputData = null;
		
	oSelf.studentAttemptDataObj = {
		itemSlides:	[]
	};
	
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		oSelf.studentAttemptDataObj = AssigmentSlides.studentAttemptData;
		oSlideInputData = (AssigmentSlides.studentAttemptData.itemSlides || []).first().slideInputData || null;
	}
	
	try {
		oSelf.PKTOralFluencyScore = (AssigmentSlides.getAttemptDataForGradeableItem.Content[0].PKTOralFluencyScore) ? 
								JSON.parse(decodeURIComponent(AssigmentSlides.getAttemptDataForGradeableItem.Content[0].PKTOralFluencyScore)) :
								[];	
	}
	catch (e) {
		oSelf.PKTOralFluencyScore = [];
	}
	
	return oSlideInputData;
};

PhonicTextBasedView.renderExtendedPhonic = function () {	
	var oSelf = this,
		sSlideDomId = oSelf.getSlideDomId(),
		oBookInfo = {},
		sBookTitle = '',
		sBookType = '',
		iWordCount = 0,
		sFileType = '',
		iBookNumPage = 0,
		sTemplate = '';
		
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
			_.template(
				$('#' + ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC).html(),
				{						
					'mediaPath': AssigmentSlides.mediaPath,
					'referenceKey':	oSelf.getSlideDomId(),
					'slideType': oSelf.model.type					
				}
			)
		);
		
	AssignmentsView.hideMainLoader();
		
	$.monitor({
		'if':			function () {					
			return ((typeof objBookList != "undefined" && objBookList != null) || 
					objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH] == null);
		},
		'beforeStart':	function () {
			if (objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH] != null) {		
				loadJS(objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH]);
				
				oUtility.showLoader({
				  'message': '<img src="media/loader.gif" alt="" />',
				  'background-color': 'none',
				  'click-to-hide': false,
				  'opacity': 0.5
				});
			}
		},
		'interval':		500,
		'then':			function () { 
			
			oBookInfo = _.where(
				objBookList.bookset[0], {
					book_id: AssigmentSlides.extendedPhonicBookId
				}
			);	
			
			if(oBookInfo.length > 0) {
				sBookTitle = oBookInfo[0].book_title,
				sBookType = (oBookInfo[0]["book_type"] == "R") ? "rata" : "time_to_read",
				iWordCount = (
					(
						oBookInfo[0]["word_count"] == null ||
						typeof oBookInfo[0]["word_count"] == "undefined"
					)?
					0:
					oBookInfo[0]["word_count"]
				),
				sFileType = oBookInfo[0]["file_type"],
				iBookNumPage = (
					(
						oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == '' || oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == null ||
						typeof oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == "undefined"
					)?
					0:
					oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE]
				);
			}			
			
			/*<img src="AssigmentSlides.mediaPath" data-bookid="<%= bookId %>">*/
			
			sTemplate = '<img class="book_cover_image" src="'+ AssigmentSlides.mediaPath + AssigmentSlides.extendedPhonicBookName+'" book_id="'+AssigmentSlides.extendedPhonicBookId+'" book_type="'+sBookType+'" bookNumPage="'+iBookNumPage+'" word_count="'+iWordCount+'" book_title="'+sBookTitle+'" file_type="'+sFileType+'" width="50%">';	 		
		
			$('#book_image_cont').append(
				_.template(sTemplate)
			);
			
			oUtility.hideLoader();
			oSelf.bindEventsExtendedPhonic();
		 }
	}); 	
			
	oSelf.resize();
}

PhonicTextBasedView.bindEventsExtendedPhonic = function () {	
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
		
	/* Book Tap */	
	$('#'+slide_id+' .book_cover_image')
		.off("click tap ")
		.on("click tap ", function () {				
			
			var bookId = $(this).attr('book_id'),
				BookType   =   $(this).attr('book_type'),
				wordCount  =   $(this).attr('word_count'),
				bookTitle  =   $(this).attr('book_title'),
				fileType   =   $(this).attr('file_type'),
				iBookNumPage  = $(this).attr('bookNumPage'),
				sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
				sItemAttemptId = AssigmentSlides.oAssignmentKeyData['itemAttemptId'],
				sHeaderTitle = AssigmentSlides.oAssignmentKeyData['headerTitle'], 						
				sAssignmentType = AssigmentSlides.oAssignmentKeyData['assignmentType'], 
				sAssignmentSubType = AssigmentSlides.oAssignmentKeyData['assignmentSubType'];
				sReassignCount = AssigmentSlides.oAssignmentKeyData['reassignCount'],
				returnUrl = '';				
			
			$.monitor({
				'if':	function () {					
					return (
						(
							typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0
						) ||
						(
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
						)
					);
				},
				'beforeStart':	function () {
					oSelf.updateAttemptData4ExtendedPhonic();
					objStudentAttemptDataResponse = 0;					
					AssigmentSlides.setAttemptData();	
				},
				'interval':		500,
				'then':			function () {				
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {					
						
						AssignmentsView.iLoadTOCScreen = 0;
						if (fileType == 'pdf') {				
							GetPDFInfo(bookId, bookTitle, BookType, wordCount, iBookNumPage, 'assignment');
							return false;
						}
						else {					
							returnUrl = "assignment.html?assignment-id="+sAssignmentId+"&item-attempt-id="+sItemAttemptId+"&header-title="+encodeURIComponent(sHeaderTitle)+"&assignment-type="+sAssignmentType+"&assignment-sub-type="+sAssignmentSubType+"&study-plan-sub-type=&reassignCount="+sReassignCount+"&loadTOCScreen="+AssignmentsView.iLoadTOCScreen+"&"+ASSIGNMENTS.c_s_RETURNED_FROM_EBOOK+"=1";
							
							sIframeUrl = LIBRARY.c_s_PLAYER_URL + bookId + "|||" + bookTitle + "|||" + BookType + "|||" + wordCount+ "|||" + "assignment" + "|||"+fileType+"|||"+iBookNumPage+"|||context=" + returnUrl;				
										
							location.href = sIframeUrl;							
							return false;			
						}
					}							
				}
			});
		});	
}

PhonicTextBasedView.render = function () {	
	var oSelf = this,
		sSlideDomId = oSelf.getSlideDomId(),
		bVisted = false,
		sSwipeToSlide = null,
		bDisableIcons = false,
		bRejected = false,
		aOralFluencyData = [];	
	
	oSelf.studentAttemptSlideData = oSelf.fetchAttemptData();
	
     //ILIT-1007
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey,
						'phonixVideoWrapper':	true
					}
				)
			);
	}
	/* video template render */
     //ILIT-1007	
	
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_PHONICTEXTBASEDSLIDE).html(),
			{
				'data':	oSelf.model,
				'mediaPath': AssigmentSlides.mediaPath,
				'referenceKey':	oSelf.getSlideDomId(),
				'slideType': oSelf.model.type
			}
		)
	);
	AssignmentsView.hideMainLoader();

	/* put the slider template in the main template container */
    $("#" + sSlideDomId + " #phonic_slides").empty().html(_.template($("#phonic_slider_template").html(),{"slides" : oSelf.model.questions}));
		
	$('#' + sSlideDomId + ' #phonic_slides').find(".swiper-slide").each(function () {
		var slide_id = $(this).attr('id').replace('slide_',''),		
			slides = oSelf.model.questions[slide_id],
			tempSlidesData = oSelf.studentAttemptSlideData,
			bDisplayScore = false,
			subSlideData = (
				(
					tempSlidesData != null &&
					tempSlidesData.subSlides
				)?
				tempSlidesData.subSlides[slide_id]:
				''
			);
		
		
		if (subSlideData.isVisited && sSwipeToSlide == null) { 
			$(this).addClass('visited');
			bVisted = true;
			sSwipeToSlide = $(this).index();
		}
		
		if (subSlideData.subSlideType == "oralfluency" &&
			oSelf.PKTOralFluencyScore.length > 0 && 
			typeof oSelf.PKTOralFluencyScore[0]["AC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["AC"] == -1 &&
			typeof oSelf.PKTOralFluencyScore[0]["WCPM"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WCPM"] == -1 &&
			typeof oSelf.PKTOralFluencyScore[0]["WC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WC"] == -1 &&
			typeof oSelf.PKTOralFluencyScore[0]["EX"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["EX"] == -1 
			) {
			$(this).addClass('visited');
			bVisted = true;
			sSwipeToSlide = $(this).index();
		}
		
		 if (slides.type == ASSIGNMENTS.c_s_SLIDE_TYPE_COMPREHENSION) {
			$(this).empty().html(
				_.template(
					$("#phonic_comprehension_template").html(),
					{
						"data":					slides,
						"studentAttemptData":	subSlideData,
						'buttonLabel':			ASSIGNMENTS.c_s_SUBMIT_BTTN
					}
				)
			);
		}
		else if (slides.type == ASSIGNMENTS.c_s_SLIDE_TYPE_PRACTICE) {
			var correctAnsArr = [];
			var oInteractiveText = oSelf.model.interactive_text || {};
			var sNewInteractiveText = '';
			
			if (typeof oInteractiveText == 'object') {
				$.each(oInteractiveText, function(k,oCont){
					sNewInteractiveText += (oCont.content_type == 'text') ? oCont.content : '<br><img src="media/'+oCont.content+'"><br>';
				});
			}
			else {
				sNewInteractiveText = oInteractiveText
			}
			
			$.each(slides.answers, function(k,ans){
				var correctAns = stripHtmlTagsFromString(sNewInteractiveText);				
				correctAns = correctAns.substr(ans.index, ans.length);
				correctAnsArr.push(correctAns);
			});
			
			oSelf.correctAnswers[slide_id] = correctAnsArr;
			oSelf.maxScore[slide_id] = slides.max_score;
			oSelf.totMaxScore += slides.max_score;
			
			$(this)
				.empty()
				.html(
					_.template(
						$("#phonic_practice_template").html(),
						{
							"data":					slides,
							"studentAttemptData":	subSlideData,
							"slideId":				slide_id,
							"frsSlideId":			null,
							'oSelf':				oSelf,
							'buttonLabel':			ASSIGNMENTS.c_s_SUBMIT_BTTN
						}
					)
				);
		}
		else if (slides.type == ASSIGNMENTS.c_s_SLIDE_TYPE_ORALFLUENCY) {
			oSelf.bCheckMicStatus = true;			
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY) {
				bDisableIcons = true;					
			}
			else {				
				if (
					oSelf.PKTOralFluencyScore.length > 0 && 
					typeof oSelf.PKTOralFluencyScore[0]["AC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["AC"] == -1 &&
					typeof oSelf.PKTOralFluencyScore[0]["WCPM"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WCPM"] == -1 &&
					typeof oSelf.PKTOralFluencyScore[0]["WC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WC"] == -1 &&
					typeof oSelf.PKTOralFluencyScore[0]["EX"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["EX"] == -1 
					) {
					bRejected = true;
				}
			}
			
			if (oSelf.PKTOralFluencyScore.length > 0 && 
				($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY)
				) {
				bDisplayScore = true;				
			}
			
			try {
				aOralFluencyData = (AssigmentSlides.studentAttemptData && AssigmentSlides.studentAttemptData.oralFluencyData) ? 
									_.where(JSON.parse(decodeURIComponent(AssigmentSlides.studentAttemptData.oralFluencyData)), {'question_id' : slides.question_id}) :
									[];
			}
			catch (e) {
				aOralFluencyData = (AssigmentSlides.studentAttemptData && AssigmentSlides.studentAttemptData.oralFluencyData) ? 
									AssigmentSlides.studentAttemptData.oralFluencyData :
									[];                                           
			}
			
			$(this)
				.empty()
				.html(
					_.template(
						$("#phonic_oralfluency_template").html(),
						{
							"data" : 				slides,
							"studentAttemptData": 	subSlideData,
							"slideId" : 			slide_id,
							"frsSlideId" : 			null,
							"bDisableIcons" : 		bDisableIcons,
							"bRejected" : 			bRejected,
							"buttonLabel" :			ASSIGNMENTS.c_s_SUBMIT_BTTN,
							"oralFluencyPromptId" :	AssigmentSlides.oralFluencyPromptId,
							"bDisplayScore" :		bDisplayScore,
							"objScore":				_.where(oSelf.PKTOralFluencyScore, {'QID' : slides.question_id}),
							"aOralFluencyData":		aOralFluencyData	
						}
					)
				);
		}
	});
	
	if (oSelf.bCheckMicStatus && 
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
		$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
		
		$.monitor({
			'if':	function () {					
				return (objMicStatusResponse != null);
			},
			'beforeStart':	function () {
				CheckMicStatus()
			},
			'interval':		500,
			'then':	function () {					
				/* if mic disabled */				
				if (objMicStatusResponse.micstatus == "denied") {
					oSelf._alert = ISeriesBase.prototype._alert;
					oSelf._alert({
						divId:		'dialog-message',
						title:		'Alert!',
						message:	(oPlatform.isIOS()) ? ASSIGNMENTS.c_s_RECORDING_DENIED_MSG_IPAD : ASSIGNMENTS.c_s_RECORDING_DENIED_MSG_BROWSER
					}, function () {
						AssignmentsView.loadAssignmentList();
					});
				}
				else if (objMicStatusResponse.micstatus == "notsupported") {
					oSelf._alert = ISeriesBase.prototype._alert;
					oSelf._alert({
						divId:		'dialog-message',
						title:		'Alert!',
						message:	ASSIGNMENTS.c_s_RECORDING_NOTSUPPORTED_MSG_BROWSER
					}, function () {
						AssignmentsView.loadAssignmentList();
					});
				}
			}
		});	
	}
					
	PhonicTextBasedView.wrapText();
	
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC && $('#bookicon').length > 0) {
		oSelf.attachBookInfo();
	}
	
	if (bVisted) {
		$('#' + sSlideDomId + ' .continent_edit_box').css({
			'opacity': '1',
			'left': '0'
		});
		
		/*==== Hide 'Input Answer' Button ====*/
		var contentInnerHeight = $('#' + sSlideDomId).find('.continent_content_inner_iscroll').height();
		var editBoxTitleHeight = $('#' + sSlideDomId).find('.edit_box_title').height();
		var editBoxPaddingTop = parseInt($('#' + sSlideDomId).find('.edit_box_title').css('padding-top'));
		var editBoxPaddingBottom = parseInt($('#' + sSlideDomId).find('.edit_box_title').css('padding-bottom'));

		var height = contentInnerHeight + editBoxTitleHeight + editBoxPaddingTop  + editBoxPaddingBottom;
		
		/* if (height < $('#' + sSlideDomId + ' .continent_box_inner').height() - 10) {		
			$('#' + sSlideDomId + ' .continent_content_inner_iscroll').css({'max-height':height+'px'});
		} */
		$('#' + sSlideDomId + ' #' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_INPUTBTNID).parent().hide();
		/*== End Hide 'Input Answer' Button ==*/
	}	
	
	oSelf.resize();
	oSelf.initSwiper();
	oSelf.loadControls();	
	oSelf.saveDataInitially = true;
	oSelf.updateAttemptData();
		
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		var oCurrentSlide = $('#' + oSelf.getSlideDomId());
		AssigmentSlides.prepare4View(oCurrentSlide);
	}
	
	if (sSwipeToSlide != null) {
		oSelf.mySwiper.swipeTo(sSwipeToSlide);
	}
	
	setTimeout(function(){
		oSelf.swiperFirstInit();
		oSelf.resize();
		oSelf.initIScroll();
	}, 100);
}

/**
 * Extended Phonic Text Based - append book details in html  
 * @method attachBookInfo
 * @return {undefined}
 */
PhonicTextBasedView.attachBookInfo = function () {	
	var oSelf = this,		
		oBookInfo = {},
		sBookTitle = '',
		sBookType = '',
		iWordCount = 0,
		sFileType = '',
		iBookNumPage = 0,
		sTemplate = '';	
		
	$.monitor({
		'if':			function () {					
			return ((typeof objBookList != "undefined" && objBookList != null) || 
					objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH] == null);
		},
		'beforeStart':	function () {
			if (objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH] != null) {		
				loadJS(objAssignmentSlidesJsonData[ASSIGNMENTS.c_s_LIBRARY_JS_PATH]);
			}
		},
		'interval':		500,
		'then':			function () { 
			
			oBookInfo = _.where(
				objBookList.bookset[0], {
					book_id: AssigmentSlides.extendedPhonicBookId
				}
			);	
			
			if(oBookInfo.length > 0) {
				sBookTitle = oBookInfo[0].book_title,
				sBookType = (oBookInfo[0]["book_type"] == "R") ? "rata" : "time_to_read",
				iWordCount = (
					(
						oBookInfo[0]["word_count"] == null ||
						typeof oBookInfo[0]["word_count"] == "undefined"
					)?
					0:
					oBookInfo[0]["word_count"]
				),
				sFileType = oBookInfo[0]["file_type"],
				iBookNumPage = (
					(
						oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == '' || oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == null ||
						typeof oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE] == "undefined"
					)?
					0:
					oBookInfo[0][LIBRARY.c_s_BOOK_LIST_JSON_KEY.NUM_PAGE]
				);
			}				 		
		
			$('#bookicon').attr({
				"book_id" : AssigmentSlides.extendedPhonicBookId,
				"book_type" : sBookType,
				"bookNumPage" : iBookNumPage,
				"word_count" : iWordCount,
				"book_title" : sBookTitle,
				"file_type" : sFileType
			});
			
		 }
	});	
	
}

/**
 * Phonic Text Based - Store Elements in an Array 
 * @method loadControls
 * @return {undefined}
 */
PhonicTextBasedView.loadControls = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	
	oSelf['controls'].compSubmitBtn = $('#' + sSlideId + ' .comprehension_submit');
	oSelf['controls'].pracSubmitBtn = $('#' + sSlideId + ' .practice_submit');	
	oSelf['controls'].feedbackSubmitBtn = $('#' + sSlideId + ' .microphone_feedback_submit');
	oSelf['controls'].microphoneBtn = $('#' + sSlideId + ' .microphone');
	/* oSelf['controls'].speakerBtn = $('#' + sSlideId + ' .speaker'); */
};


PhonicTextBasedView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

PhonicTextBasedView.resize = function () {
	var oSelf = this,
		window_height = $(window).height(),
		header = $("header").outerHeight(),
		frs_heading_height = ($(".study_plain_heading").length) ? $(".study_plain_heading").outerHeight(): 0,
		frs_ui_tabs_height = ($(".ui_slide_tabs").length) ? $(".ui_slide_tabs").outerHeight() : 0,
		iPaginationHeight = ($(".frs-main-pagination").length) ? 30 : 0,
		actual_height = window_height - (header + frs_heading_height + frs_ui_tabs_height + iPaginationHeight),
		slide_id = oSelf.getSlideDomId(),
		oContinentContInner = $('#' + slide_id + ' .continent_content_inner_iscroll'),
		oContinentEditBox = $("#"+slide_id+" .continent_edit_box"),
		oContinentEditBoxTitle = $("#"+slide_id+" .edit_box_title"),
		oContinentEditBoxTitleHeight = (oContinentEditBoxTitle).is(':visible') ? oContinentEditBoxTitle.outerHeight(): 0;	
		
	/* Width Calculation */
	if (AssigmentSlides.introVideo) {
		/*==== Make the slide acquire full avaialable width ====*/
		  var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
		   dButtonWidth = 0;
		   
		  $('.slider_pager_content_outer').find('.slider_pager_left').each(function () {
		   dButtonWidth += $(this).width();
		  });
		  $('.slider_pager_content_outer').find('.slider_pager_right').each(function () {
		   dButtonWidth += $(this).width();
		  });
		  
		  var dUsableWidth = dAvailableWidth - dButtonWidth;
		  
		  $('.slider_pager_content')
		   .width(dUsableWidth)
		   .css({
			'max-width': dUsableWidth + 'px'
		   });
		  /*== End Make the slide acquire full avaialable width ==*/		 
	}
 
	/***** left box height and margin top ******/
	if(oSelf.model.static_text == '')
	{		
		var top_gap = 60;
		var continent_box_space = $("#"+slide_id+" .continent_box_space");
	}
	else
	{				
		var top_gap = 100;
		var continent_box_space = $("#"+slide_id+" .continent_box_space");
	}	
	
	var left_box_height = actual_height - top_gap; // margin top bottom 50px			
	var left_box_inner_height = left_box_height - 12; // border deducted

	continent_box_space.css("height",left_box_height+'px');
	$("#"+slide_id+" .continent_box_inner").css("height",left_box_inner_height);
		
	oContinentContInner.css({'height':(left_box_inner_height - oContinentEditBoxTitleHeight - 40)+'px', 'overflow':'hidden'}); // padding
	
	var top_bottom_gap =  actual_height - continent_box_space.height();
	var margin_top = top_bottom_gap/2;

	$('#'+slide_id+' .slider_swiper_inner').css('margin-top',margin_top+'px');

	/***** right box height and margin top *****/			
	var right_box_height = left_box_height - 50; // margin top bottom 25px and border 6px

	oContinentEditBox.css("height",right_box_height+'px');

	$('#'+slide_id+' .slider_swiper_inner').hasClass("summary_div_conts")
	{
		$("#"+slide_id+" .continent_edit_box.new_tab_space.left_conts_place.summary_right_box .right_conts_element").css("height",right_box_height+'px');
		$("#"+slide_id).find("#feedback_content").css("height","100%");
		$("#"+slide_id).find("#feedback_content .new_tab_space_inner").css("height","100%");
	}
		
	var right_margin_top = (continent_box_space.height() - oContinentEditBox.height())/2 - 6; // border deducted
	oContinentEditBox.css('margin-top',right_margin_top+'px');	
	
	/****** right box content resize ************/
	$("#"+slide_id+" .swiper-nested1 .swiper-slide").each(function(){
		var subslide_id = $(this).attr('id');
		var contHeight = oContinentEditBox.innerHeight();		
		var textContHeight = $(this).find(".text_content:eq( 0 )").outerHeight() + $(this).find(".text_content:eq( 1 )").outerHeight();
		var btnContHeight = $(this).find(".button_cont").outerHeight();
		var paginationHeight = 70;
		
		var phinicsHeight = contHeight - (textContHeight + btnContHeight + paginationHeight);
		$(this).find('.Phinics_question').css({'height':phinicsHeight+'px'});		
		//$(this).find('.swiper-padding-right').css({'height':(contHeight+50)+'px','overflow-y':'auto'});
		
		var dropBoxHeight = $(this).find('.phonic_practice_conts').innerHeight() - 
							$(this).find('.textbox_heading_content').outerHeight() - 
							btnContHeight - textContHeight - 65;							
							
							
		dropBoxHeight = (dropBoxHeight < 150) ? 150 : dropBoxHeight;							
		$(this).find('.practice_drag_drop').css({'height':dropBoxHeight+'px'});
	});
	
	
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			var page_container_video_height = new_assignment_irr_sp_video_height -new_assignment_irr_padding;
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(page_container_video_height);
			
			if (oPlatform.isIOS()) {
			 $(".question_box_space").height(new_assignment_irr_sp_video_height);
			}
			/* browser/ipad specific */
			//var mq = window.matchMedia( "(min-device-width: 768px) and (max-device-width: 1024px) and (orientation:landscape)" );
			if (!oPlatform.isIOS()) {
			  $(".video_container.page_container_video").css("height", "100%");
			}
			$(".slider_swiper_inner.slide_with_bg_image").css("margin-left", "-425px");
		}, 520);
	}
	
	
};

PhonicTextBasedView.initIScroll = function () {
	var oSelf = this,		
		slide_id = oSelf.getSlideDomId();
	
	/* if (oSelf.myScroll != null) {
		oSelf.myScroll.refresh();
	}
	else {
		setTimeout(function(){
		oSelf.myScroll = new IScroll('#' + slide_id + ' .continent_content_inner_iscroll', {		
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,				
				fadeScrollbars: true
			});
		}, 500);
	}	 */
	oSelf.myScroll.push('#' + slide_id + ' .continent_content_inner_iscroll');
	setTimeout(function() {
		var aScrollBars = oSelf.myScroll.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.myScroll.setInstance(aScrollBars[iI]);
		}
	}, 500);
};

PhonicTextBasedView.bindEvents = function () {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();

	/* Select Answer */
	$("#"+slide_id+" .Phinics_question ul.question_part > li")
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function() {
			var oLi = $(this);
			if (oLi.parent().hasClass(oSelf.lockedClass)) {
				return false;
			}
			oLi.siblings().removeClass("active");
			oLi.addClass('active');
			
			oSelf.updateAttemptData();
		});
	
	/* Comprehension Submit */	
	$('#'+slide_id+' .swiper-nested1 .swiper-slide-visible .comprehension_submit')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			oSelf.comprehensionSubmit();
		});
	
	/* Practice Submit */	
	$('#'+slide_id+' .swiper-nested1 .swiper-slide-visible .practice_submit')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			oSelf.practiceSubmit();
		});
	
	/* makeTextDraggable */
	if (
		$('#'+slide_id+' .swiper-nested1 .swiper-slide-visible').find('.phonic_dropbox').length && 
		!$('#'+slide_id+' .swiper-nested1 .swiper-slide-visible').find('.phonic_dropbox').hasClass('locked')
	) {
		oSelf.makeTextDraggable();
	}
	
	/* oral fluency record audio */
	$('#'+slide_id+' .microphone')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			oSelf.startRecording.call(this, oSelf);
		});
		
	/* oral fluency listen audio */
	$('#'+slide_id+' .speaker')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			oSelf.listenRecording.call(this, oSelf);
		});
	
	/* oral fluency submit */
	$('#'+slide_id+' .microphone_grading_submit')
		.off("click tap " + sWindowsEventType)
		.on("click tap " + sWindowsEventType, function () {
			if (AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
				oSelf.oralSubmit.call(this, oSelf);
			}
			else {
				oSelf.oralSubmit(this);
			}
		});
		
	// Bind view eBook link	for Extended Phonic
	$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap").on("click tap", function(){
		if (typeof $(this).attr("book_id") == 'undefined') {
			return;
		}
		oSelf.eBookOpen.call(this, oSelf);
	});
	
	// ILIT-1007
	// bind previous next button
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
	// ILIT-1007
}

/**
 * Extended Phonic Text Based - Action On Book Icon Click 
 * @method eBookOpen
 * @return {undefined}
 */
PhonicTextBasedView.eBookOpen = function(oSelf) {	
	var oElem = this;
	
	/*== Stop Audio if Playing ===*/
	if (AssigmentSlides.bAudioExists == true && AssigmentSlides.bAudioPaused == false) {
		$.nativeCall({
			'method':			'PlayPauseAudio',
			'inputParams':		['Pause'],
			'globalResource':	'objPlayPauseAudioResponse',
			'interval':			500,
			'breakAfter':		5000,
			'debug':			false
		});
	}
	/*== Cechk if Audio not Saved for Oral Fluency ===*/
	if (AssigmentSlides.bAudioExists == true && AssigmentSlides.bAudioSaved == false) {
		AssigmentSlides._confirm({
			'title':	'Are you sure?',
			'divId':	'dialog-message',
			'message':	ASSIGNMENTS.c_s_CONFIRM_AUDIO_SAVED_MSG,
			'yes':		function () {
				try {
					var sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],						
						sQuestionId = $(".main_swiper_slide.swiper-slide-visible .swiper-nested1 .swiper-slide-visible .phonic_oralfluency_conts").attr("data-question-id"),						
						sAction = "Stop";
						
					RecordStopAudio(sAction, sAssignmentId, sQuestionId);
				}
				catch (e) {
					throw e;
				}	
				AssigmentSlides.bAudioExists = false;
				oSelf.eBookOpenOnConfirm.call(oElem, oSelf);				
			}
		});	
	}
	else {
		oSelf.eBookOpenOnConfirm.call(oElem, oSelf);
	}	
}

/**
 * Extended Phonic Text Based - Action On Book Icon Click 
 * @method eBookOpen
 * @return {undefined}
 */
PhonicTextBasedView.eBookOpenOnConfirm = function(oSelf) {
	var bookId = $(this).attr('book_id'),
		BookType   =   $(this).attr('book_type'),
		wordCount  =   $(this).attr('word_count'),
		bookTitle  =   $(this).attr('book_title'),
		fileType   =   $(this).attr('file_type'),
		iBookNumPage  = $(this).attr('bookNumPage'),
		sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
		sItemAttemptId = AssigmentSlides.oAssignmentKeyData['itemAttemptId'],
		sHeaderTitle = AssigmentSlides.oAssignmentKeyData['headerTitle'], 						
		sAssignmentType = AssigmentSlides.oAssignmentKeyData['assignmentType'], 
		sAssignmentSubType = AssigmentSlides.oAssignmentKeyData['assignmentSubType'];
		sReassignCount = AssigmentSlides.oAssignmentKeyData['reassignCount'],
		returnUrl = '',
		sAction = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION),
		sMode = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE),
		sStudId = $_GET(POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID);

		
	$.monitor({
		'if':	function () {					
			return ((typeof objStudentAttemptDataResponse != 'undefined' && 
					objStudentAttemptDataResponse != null && 
					objStudentAttemptDataResponse != 0)  || 
					($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY));
		},
		'beforeStart':	function () {
			if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_VIEW &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) != POPUP_VIEW.c_s_MODE_INSTRUCTOR &&
				$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) != POPUP_VIEW.c_s_ACTION_PLAY) {
				
				oSelf.updateAttemptData();
				objStudentAttemptDataResponse = 0;					
				AssigmentSlides.setAttemptData();
			}
		},
		'interval':		500,
		'then':	function () {				
			if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
				objStudentAttemptDataResponse.Error == null) {					
				
				AssignmentsView.iLoadTOCScreen = 0;
				if (fileType == 'pdf') {				
					GetPDFInfo(bookId, bookTitle, BookType, wordCount, iBookNumPage, 'assignment');
					return false;
				}
				else {					
					returnUrl = "assignment.html?assignment-id="+sAssignmentId+"&item-attempt-id="+sItemAttemptId+"&header-title="+encodeURIComponent(sHeaderTitle)+"&assignment-type="+sAssignmentType+"&assignment-sub-type="+sAssignmentSubType+"&study-plan-sub-type=&reassignCount="+sReassignCount+"&loadTOCScreen="+AssignmentsView.iLoadTOCScreen+"&"+POPUP_VIEW.c_s_QUERY_PARAM_ACTION+"="+sAction+"&"+POPUP_VIEW.c_s_QUERY_PARAM_MODE+"="+sMode+"&"+POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID+"="+sStudId;
					
					sIframeUrl = LIBRARY.c_s_PLAYER_URL + bookId + "|||" + bookTitle + "|||" + BookType + "|||" + wordCount+ "|||" + "assignment" + "|||"+fileType+"|||"+iBookNumPage+"|||context=" + returnUrl;			
					
					location.href = sIframeUrl;							
					return false;			
				}
			}							
		}
	});
}

/**
 * Phonic Text Based - Action On Start Recording
 * @method startRecording
 * @return {undefined}
 */
PhonicTextBasedView.startRecording = function(oSelf) {	
	var sAction = '',
		oElem = this,		
		slide_id = oSelf.getSlideDomId(),
		sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],		
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oSpeaker = $(oSwiperVisible).find(".speaker"),
		oSubmitGradingBtn = $(oSwiperVisible).find(".microphone_grading_submit"),
		oDiv = $(oSwiperVisible).find(".phonic_oralfluency_conts"),
		sQuestionId = $(oDiv).attr('data-question-id'),
		sAutoStopMsg = '',
		fStartRecord = function() {			
			$(oElem).removeClass("microphone-start").addClass("microphone-stop");
			$(oSpeaker).addClass('inactive');
			
			$.monitor({
				'if':	function () {
					return (objRecordAudioDataResponse != null);
				},
				'beforeStart':	function () {
					RecordStopAudio(sAction, sAssignmentId, sQuestionId);
					AssigmentSlides.bAudioExists = true;
					AssigmentSlides.bAudioSaved = false;
				},
				'interval':		500,
				'then':	function () {			
					/* if recording stopped automatically */
					if (objRecordAudioDataResponse.recordingStatus == "stopped" || objRecordAudioDataResponse.recordingStatus == "autostopped") {
						$(oElem).removeClass("microphone-stop").addClass("microphone-start");
						$("#"+ slide_id +" .speaker").removeClass('inactive');
						$("#"+ slide_id +" .speaker").attr('data-audio','');						
						AssigmentSlides.bAudioExists = true;
						if (objRecordAudioDataResponse.recordingStatus == "autostopped") {
							if (oPlatform.isDevice()) {
								sAutoStopMsg = ASSIGNMENTS.c_s_CONFIRM_AUTOMATIC_STOP_MSG;
							}
							else {
								sAutoStopMsg = ASSIGNMENTS.c_s_CONFIRM_AUTOMATIC_STOP_MSG_EARLY;
							}
							
							oSelf._alert({
								divId:		'dialog-message',
								title:		'Alert!',
								message:	sAutoStopMsg
							});
							$(oSubmitGradingBtn).removeClass('disabled btndisabled')
								.attr('disabled', false);
						}
					}
					else if (objRecordAudioDataResponse.recordingStatus == "denied") {
						if (oPlatform.isIOS()) {
							oSelf._alert({
									divId:		'dialog-message',
									title:		'Alert!',
									message:	ASSIGNMENTS.c_s_RECORDING_DENIED_MSG_IPAD
								}, function() {
									$(oElem).removeClass("microphone-stop").addClass("microphone-start");
								});	
						}
						else if (oPlatform.isBrowser()) {
							oSelf._alert({
								divId:		'dialog-message',
								title:		'Alert!',
								message:	ASSIGNMENTS.c_s_RECORDING_DENIED_MSG_IPAD
							}, function() {
									$(oElem).removeClass("microphone-stop").addClass("microphone-start");
							});
						}
					}		
				}
			});			
			
		},
		fStopRecord = function() {
			
			$.monitor({
				'if':	function () {
					return (objRecordAudioDataResponse != null);
				},
				'beforeStart':	function () {
					oUtility.showLoader({
					  'message': '<img src="media/loader.gif" alt="" />',
					  'background-color': 'none',
					  'click-to-hide': false,
					  'opacity': 0.5
					});	
					RecordStopAudio(sAction, sAssignmentId, sQuestionId);
					AssigmentSlides.bAudioExists = true;
					AssigmentSlides.bAudioSaved = false;
				},
				'interval':		500,
				'then':	function () {
					oUtility.hideLoader();
					$(oElem).removeClass("microphone-stop").addClass("microphone-start");					
					$(oSpeaker).removeClass('inactive');						
					$(oSubmitGradingBtn).removeClass('disabled btndisabled')
						.attr('disabled', false);
				}
			});	
		};	
	

	if ($(oElem).hasClass('inactive') || oDiv.hasClass('locked')) {
		return;
	}
	
	if ($(oElem).hasClass("microphone-start")) {
		sAction = 'Start';
		if (AssigmentSlides.bAudioExists && !$(oSubmitGradingBtn).hasClass('disabled')) {
			oSelf._confirm({		
				'title':	'Are you sure?',
				'divId':	'dialog-message',
				'message':	ASSIGNMENTS.c_s_CONFIRM_RECORD_MSG,
				'yes': function(){
					fStartRecord();
				}
			});
		}
		else {
			fStartRecord();
		}		
	} 
	else {
		sAction = 'Stop';
		fStopRecord();
	}		
}

/**
 * Phonic Text Based - Action On Listen Recording
 * @method listenRecording
 * @return {undefined}
 */
PhonicTextBasedView.listenRecording = function(oSelf) {
	var oElem = this,
		sAction = '',
		slide_id = oSelf.getSlideDomId(),
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oMicrophone = $(oSwiperVisible).find(".microphone"),
		oDiv = $(oSwiperVisible).find(".phonic_oralfluency_conts"),
		sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
		sQuestionId = $(oDiv).attr('data-question-id');
	
	if ($(oElem).hasClass('inactive') /* || 
			(	oDiv.hasClass('locked') &&
				!(
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
				) && 
				$(oElem).attr("data-audio") == ''
			) */
		) {		
			return;				
	}
	
	/*== if view mode ==*/
	if (
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY ||
			$(oElem).attr("data-audio") != ''
		) {
		
		if($(oElem).hasClass("speaker-off")) {
			$('#audioPlayer')[0].pause();
			$(oElem).removeClass("speaker-off").addClass("speaker-on");
		}
		else {
			$('#audioPlayer')[0].pause();
			$(oElem).removeClass("speaker-on").addClass("speaker-off");			
			$('#audioPlayer').attr('src', $(oElem).attr("data-audio"));			
			$('#audioPlayer')[0].play();
		}
		
		$('#audioPlayer').on('ended', function() {
			$(oElem).removeClass("speaker-off").addClass("speaker-on");			
		});
	}
	else {
		if ($(oElem).hasClass("speaker-on")) {
			AssigmentSlides.bAudioPaused = false;
			sAction = "Play";
			$(oElem).removeClass("speaker-on").addClass("speaker-off");
			$(oMicrophone).addClass('inactive');		
			$.nativeCall({
				'method':			'PlayPauseAudio',
				'inputParams':		[sAction, sAssignmentId, sQuestionId],
				'globalResource':	'objPlayPauseAudioResponse',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,
				'onComplete':		function () {
					if (objPlayPauseAudioResponse.playingStatus == "finished") {
						$(oElem).removeClass("speaker-off").addClass("speaker-on");
						/* if submit button clicked before the playPause callback returns then it should not enable microphone */
						if (!oDiv.hasClass('locked')) {
							$(oMicrophone).removeClass('inactive');
						}
						AssigmentSlides.bAudioPaused = true;
					}
				}
			});
		}
		else {
			sAction = "Pause";
			$(oElem).removeClass("speaker-off").addClass("speaker-on");
			if (!oDiv.hasClass('locked')) {
				$(oMicrophone).removeClass('inactive');
			}
			AssigmentSlides.bAudioPaused = true;
			PlayPauseAudio(sAction, sAssignmentId, sQuestionId);
		}
	}
	
}

/**
 * Phonic Text Based - Action On Oral Fluency Submit
 * @method oralSubmit
 * @return {undefined}
 */
PhonicTextBasedView.oralSubmitFunction = function(oSelf) {	
	var oElem = this,
		slide_id = oSelf.getSlideDomId(),
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oDiv = $(oSwiperVisible).find(".phonic_oralfluency_conts"),
		sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'],
		sQuestionId = $(oDiv).attr('data-question-id'),
		sPromptId = $(oDiv).attr('data-prompt-id'),		
		sAudioPath = null,
		sTestInstanceId = -1;	
	
	if($(oElem).hasClass('btndisabled') || oDiv.hasClass('locked')) {				
		return;
	}
	
	var score = 0;	
	$(oDiv).addClass(oSelf.lockedClass);
	$('#' + slide_id + ' .microphone').addClass('inactive');
	//$('#' + slide_id + ' .speaker').removeClass("speaker-off").addClass("speaker-on inactive");
	$(oElem).addClass('disabled btndisabled').prop('disabled', true);
	$(oSwiperVisible).find(".Phinics_question").attr('data-score',score);
	AssigmentSlides.bAudioPaused = true;
	
	if (
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
		) {
		
		oSelf.updateAttemptData();
		if (
			oSelf.finalSubmit == true && 
			AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS			
		) {		
			oSelf.setAttemptDataCall();
		}
	}	
	else {
		$.monitor({
			'if':	function () {
				return (objSaveAudioResponse != null);
			},
			'beforeStart':	function () {				
				oUtility.showLoader({
				  'message': '<img src="media/loader.gif" alt="" />',
				  'background-color': 'none',
				  'click-to-hide': false,
				  'opacity': 0.5
				});			
				SaveAudio(sAssignmentId, sQuestionId);
			},
			'interval':		500,
			'then':	function () {			
				switch (objSaveAudioResponse.Status) {
					case '200':
						sAudioPath = objSaveAudioResponse.Content;					
						sAudioFileName = sAudioPath.split('/').last();
						AssigmentSlides.bAudioSaved = true;						
						if (sPromptId == ASSIGNMENTS.c_s_ASSIGNMENT_PROMPT_ID_NO_SCORE) {							
							oSelf.setOFDataNSave(sQuestionId, sAudioPath, sPromptId, sTestInstanceId);							
						}
						else {
							oSelf.oralfluencyReservationCall(sPromptId, sAudioFileName, sAudioPath);
						}
						break;					
					default:
						throw (objSaveAudioResponse.Error);
				}			
			}
		});	
	}
}

/**
 * Phonic Text Based - oralfluencyReservation service call
 * @method oralfluencyReservationCall
 * @return {undefined}
 */
PhonicTextBasedView.oralfluencyReservationCallFunction = function(sPromptId, sAudioFileName, sAudioPath) {	
	var oSelf = this,
		sTestInstanceId = '';
	
	$.monitor({
		'if':	function () {
			return (objOralfluencyReservationResponse != null);
		},
		'beforeStart':	function () {
			OralfluencyReservation();
		},
		'interval':		500,
		'then':	function () {			
			switch (objOralfluencyReservationResponse.responseHeader.status) {
				case 'SUCCESS':
					sTestInstanceId = objOralfluencyReservationResponse.testInstanceId;					
					oSelf.oralfluencySubmitScoreRequestCall(sPromptId, sAudioFileName, sAudioPath, sTestInstanceId);					
					break;					
				default:
					throw (objOralfluencyReservationResponse.Error);
			}			
		}
	});	
	
}

/**
 * Phonic Text Based - oralfluencyReservation service call
 * @method oralfluencySubmitScoreRequestCallFunction
 * @return {undefined}
 */
PhonicTextBasedView.oralfluencySubmitScoreRequestCallFunction = function(sPromptId, sAudioFileName, sAudioPath, sTestInstanceId) {	
	var oSelf = this,
		slide_id = oSelf.getSlideDomId(),
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oDiv = $(oSwiperVisible).find(".phonic_oralfluency_conts"),		
		sQuestionId = $(oDiv).attr('data-question-id');
	
	$.monitor({
		'if':	function () {
			return (objOralfluencySubmitScoreResponse != null);
		},
		'beforeStart':	function () {			
			OralfluencySubmitScoreRequest(sPromptId, sAudioFileName, sAudioPath, sTestInstanceId);
		},
		'interval':		500,
		'then':	function () {			
			switch (objOralfluencySubmitScoreResponse.responseHeader.status) {
				case 'SUCCESS':
						oSelf.setOFDataNSave(sQuestionId, sAudioPath, sPromptId, sTestInstanceId);				
					break;					
				default:
					throw (objStudentAttemptDataResponse.Error);
			}			
		}
	});
	
}

PhonicTextBasedView.setOFDataNSave = function(sQuestionId, sAudioPath, sPromptId, sTestInstanceId) {
	var oSelf = this;
	
	oSelf.oralFluencyData = [{
		"question_id": sQuestionId,
		"audiopath": sAudioPath,
		"promptid": sPromptId,
		"testInstanceId": sTestInstanceId,
		"parts": "",
		"displayText": ""
	}];
	oSelf.updateAttemptData();
	
	if (oSelf.finalSubmit == true && AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		oSelf.setAttemptDataCall();
	}
	else {
		oUtility.hideLoader();
	}
}

/**
 * Phonic Text Based - setAttemptData() to be called 
 * @method setAttemptDataCall
 * @return {undefined}
 */
PhonicTextBasedView.setAttemptDataCall = function() {
	var oSelf = this;
	
	AssigmentSlides.setAttemptData(0, function () {
		AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
		
		$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap");
		
		var sHeaderTitle = jQuery('#' + ASSIGNMENTS.c_s_HEADER).text();
		var iTotalDropBoxes = oSelf.totMaxScore;
		var sResultHtml = '<div class="msg_content">\
			<div class="correct sprite"></div>\
			<strong>\
				' + sHeaderTitle + ': ' + (oSelf.score * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
			</strong><br />\
			' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
		</div>';
	});
}

/**
 * Phonic Text Based - Action On Practice Submit 
 * @method practiceSubmit
 * @return {undefined}
 */
PhonicTextBasedView.practiceSubmit = function() {	
	var oSelf = this,
		slide_id = oSelf.getSlideDomId(),
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oUl = $(oSwiperVisible).find(".phonic_dropbox"),
		oLi = $(oUl).find(".text_search");	
	
	if (oLi.length == 0 || oUl.hasClass('locked')) {				
		return false;
	}
	var slideId  = $('#'+ slide_id +' .swiper-nested1 .swiper-slide-visible').attr('id').replace('slide_','');
	var score = 0;
	oLi.each(function (){
		var Li = $(this);
		var word = Li.data("text");
		
		if ($.inArray($.trim(word), oSelf.correctAnswers[slideId]) != -1) {
			Li.addClass('okey');
			score++;			
		}
		else {
			Li.addClass('wrong');				
		}
		
		$(oSelf.correctAnswers[slideId]).each(function (k, val) {
			$( '#'+ slide_id +' .draggable_area .draggable_word' ).filter(function () {								
				var sTrimedWord = oSelf.trimWord($(this).text());				
				sTrimedWord = sTrimedWord.toLowerCase();				
				return (sTrimedWord.indexOf(val.toLowerCase()) === 0 && sTrimedWord.length == val.length);
			}).css( "color", "#2AC243" );
		});
		
		Li.find(".cross_icon").show();
		Li.find(".delete_icon").remove();
	});
	oLi.parent().addClass(oSelf.lockedClass);
	$(oSwiperVisible).find(".practice_submit")
		.addClass('disabled btndisabled')
		.prop('disabled', true);
		
	score = (score > oSelf.maxScore[slideId]) ? oSelf.maxScore[slideId] : score;
	
	$(oSwiperVisible).find(".Phinics_question").attr('data-score',score);	
	$('#'+ slide_id +' .draggable_word').draggable('destroy');
	
	oSelf.updateAttemptData();
	
	if (oSelf.finalSubmit == true && AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		$.monitor({
			'if':			function () {					
				return (
					(
						typeof objStudentAttemptDataResponse != 'undefined' && 
						objStudentAttemptDataResponse != null && 
						objStudentAttemptDataResponse != 0
					) ||
					(
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
					)
				);
			},
			'beforeStart':	function () {
				objStudentAttemptDataResponse = 0;
				AssigmentSlides.setAttemptData();	
			},
			'interval':		500,
			'then':			function () {				
				if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
					objStudentAttemptDataResponse.Error == null) {					
					AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
					
					$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap");
					
					var sHeaderTitle = jQuery('#' + ASSIGNMENTS.c_s_HEADER).text();
					var iTotalDropBoxes = oSelf.totMaxScore;
					var sResultHtml = '<div class="msg_content">\
						<div class="correct sprite"></div>\
						<strong>\
							' + sHeaderTitle + ': ' + (oSelf.score * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
						</strong><br />\
						' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
					</div>';
				}
				else {
					AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
					AssigmentSlides.studentAttemptSummary = {};
				}			
			}
		});
	}
};

PhonicTextBasedView.comprehensionSubmit = function() {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId(),
		oSwiperVisible = $("#"+ slide_id +" #phonic_slides .swiper-slide-visible"),
		oLi = $(oSwiperVisible).find("ul.question_part > li.active"),
		oUl = $(oSwiperVisible).find("ul.question_part");
	
	if(oLi.length == 0 || oUl.hasClass('locked')) {				
		return false;
	}
	
	var score = 0;
	if (oLi.data("correct") === false) {
		oLi.find(".incorrect").show();				
		oLi.siblings().filterByData('correct', true).children(".correct").show();
	}
	else {
		oLi.find(".correct").show();
		score++;
	}
	oLi.parent().addClass(oSelf.lockedClass);
	$(oSwiperVisible).find(".comprehension_submit")
		.addClass('disabled btndisabled')
		.prop('disabled', true);
	$(oSwiperVisible).find(".Phinics_question").attr('data-score',score);
	
	oSelf.updateAttemptData();
	
	if (oSelf.finalSubmit == true && AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		AssigmentSlides.setAttemptData(0, function () {
			AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
				
			$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap");
			
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text();
			var iTotalDropBoxes = (oSelf.totMaxScore) ? oSelf.totMaxScore : 0;
			var sResultHtml = '<div class="msg_content">\
				<div class="correct sprite"></div>\
				<strong>\
					' + sHeaderTitle + ': ' + (oSelf.score * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
				</strong><br />\
				' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
			</div>';
		});
	}
};

PhonicTextBasedView.initSwiper = function(){
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	
	oSelf.mySwiper = new Swiper('#' + slide_id + ' .swiper-nested1',{
		speed: 100,
		pagination: "#"+slide_id+" .pagination",
		paginationClickable: true,		
		onTouchMove: function () {},
		onTouchEnd: function () {},
		onSlideChangeStart: function () {
			var oSlideVisible = $('#'+ slide_id +' .swiper-nested1 .swiper-slide-visible');
			$('.draggable_word').removeAttr('style');
			if (oSlideVisible.find('.phonic_dropbox').hasClass('locked')){
				var slideId  = oSlideVisible.attr('id').replace('slide_','');
				$(oSelf.correctAnswers[slideId]).each(function(k,val){					
					$( '#'+ slide_id +' .draggable_area .draggable_word' ).filter(function () {
						var sTrimedWord = oSelf.trimWord($(this).text());	
						return (sTrimedWord.indexOf(val) === 0 && sTrimedWord.length == val.length);
					}).css( "color", "#2AC243" );
				});
			}			
		},
		onSlideChangeEnd: function () {	
			var oSlideVisible = $('#'+ slide_id +' .swiper-nested1 .swiper-slide-visible');
			if (!oSlideVisible.find('.phonic_dropbox').length) {
				try {
					$('#'+ slide_id +' .draggable_word').draggable('destroy');
					$('#'+ slide_id +' .swiper-nested1:not(.swiper-slide-visible) .phonic_dropbox').droppable('destroy');
				}
				catch (e) {
					//console.log(e);
				}
			}
			
			$('#'+ slide_id +' .swiper-nested1 .swiper-slide').removeClass('visited');			
			oSlideVisible.addClass('visited');			
			oSelf.updateAttemptData();
			oSelf.bindEvents();
		},
		onFirstInit: function () {
			oSelf.swiperFirstInit();
		}
	});
}

PhonicTextBasedView.swiperFirstInit = function () {	
	var _iWindowHeight   = parseInt($('.continent_edit_box').height(), 10);	
	var _iWindowHeight2   = $(window).height() - $("header").outerHeight();			
	var _iTotPadding = parseInt($('.continent_wrap_box').css('padding-top')) + parseInt($('.continent_wrap_box').css('padding-bottom')) ;			
	var _iRestrictedHeight   = _iWindowHeight - _iTotPadding;                
	
	$('.swiper-wrapper').css('height' , _iWindowHeight2 + 'px');
	$('.swiper-slide').css('height' , _iWindowHeight2 + 'px');
	
	$('.swiper-nested1 .swiper-wrapper').css('height' , _iRestrictedHeight + 'px');
	$('.swiper-nested1 .swiper-slide').css('height' , _iRestrictedHeight + 'px');
};

PhonicTextBasedView.wrapText = function () {
	var oSelf = this;
	var slide_id = oSelf.getSlideDomId();
	var txt = $('#'+ slide_id +' .draggable_area').html();
	var new_txt = returnDraggableTxt(txt);        
	$('#'+ slide_id +' .draggable_area').html(new_txt);
}

PhonicTextBasedView.makeTextDraggable = function () {        
	// setting options of the drag event
	var sSlideId = this.getSlideDomId(),
		dragOpts = {
			appendTo : "body",
			/* containment : '.drag_forms_box_container', */
			revertDuration : 100,
			refreshPositions : true,
			revert : 'invalid',
			zIndex : 9999,
			scroll : true,
			cursor : 'move',
			start : function() {
				/* oSelf.myScroll.disable(); */
				var aScrollBars = oSelf.myScroll.getScrollBars();
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.myScroll.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
				}
			},
			stop : function() {
				if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
					$('#' + sSlideId + '.main_swiper_slide.swiper-slide-visible').removeClass('swiper-no-swiping');
				}
				// oSelf.myScroll.enable();
				var aScrollBars = oSelf.myScroll.getScrollBars();
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.myScroll.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
				}
			},
			helper : function() {
				$copy = $(this).clone(true);
				$copy.addClass('ui-dragging');
				return $copy;
			}
		},
		oSelf = this;
	
	$('.draggable_word').draggable(dragOpts);
	
	oSelf.makeDroppable();
};

PhonicTextBasedView.makeDroppable = function () {	
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
		
	$("#"+ slide_id +" .swiper-nested1 .swiper-slide-visible .phonic_dropbox").droppable({
		accept : ".draggable_word",
		drop : function(event, ui) {			
			// appending the draggable element to the droppable area
			var original_word = ui.draggable.text();
			var trimed_word = IWTDndSlide.trimWord(original_word);	

			if($(this).find(".text_search[data-text='"+trimed_word+"']").length > 0)
			{
				return false;
			}
			
			var div_obj = '<div class="text_search" data-text="'+trimed_word+'"><div class="cross_icon sprite" style="display:none;"></div><div class="delete_icon sprite"></div><div class="txt_dropped">'+trimed_word+'</div></div><div class="clear"></div>';
			
			$(this).append(div_obj);			
			
			oSelf.bindDroppableEvents();
			oSelf.updateAttemptData();
			//oSelf.myScroll.enable();
		}
	});
}

PhonicTextBasedView.trimWord = function (s) {
	// Start: for special type character like characters are coming from word type editor.
	s = encodeURIComponent(s);
	$.each(GENERAL.c_a_SPECIAL_CHARACTERS_URI_ENCODE, function(idx, val) {
		s = s.replace(new RegExp(val, 'g'), GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
	});
	s = decodeURIComponent(s);
	// End: for special type character like characters are coming from word type editor.
	
	if ($.inArray(s, GENERAL.c_a_SPECIAL_WORDS) > -1) {
		return s; 
    }
	else {
        var l = 0,
			r = s.length - 1;
        while (l < s.length && $.inArray(s[l], GENERAL.c_a_SPECIAL_CHARACTERS) > -1){
			l++;
		}
        while (r > l && $.inArray(s[r], GENERAL.c_a_SPECIAL_CHARACTERS) > -1) {
			r -= 1;
		}
        return s.substring(l, r + 1);
    }
};

PhonicTextBasedView.bindDroppableEvents = function () {
		
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	
	$('#'+ slide_id +' .delete_icon').off('click tap').on('click tap', function(){
		$(this).parent().remove();
		var dropbox_html = $('#'+ slide_id +' .swiper-nested1 .swiper-slide-visible .phonic_dropbox').html();
		$('#'+ slide_id +' .swiper-nested1 .swiper-slide-visible .phonic_dropbox').html(dropbox_html);
		oSelf.bindDroppableEvents();
		oSelf.updateAttemptData();
	});
};

PhonicTextBasedView.collectAttemptData = function () {
	var oSelf = this,
		subSlides = [],		
		attemptCount = 0,
		slideDomId = oSelf.getSlideDomId(),		
		bSubmitted = false,
		slide_id = '',
		slide_type = '',
		ans_selected = null,
		ans_dropped = [],
		slide_score = 0,
		isVisited = false,
		objData = {},
		oSwiperVisible = $("#"+ slideDomId +" #phonic_slides .swiper-slide-visible"),
		oDiv = $(oSwiperVisible).find(".phonic_oralfluency_conts"),
		isRejectedAttempted = null;
	
	oSelf.score = 0;
	/* iterate each slide */
	$("#" + slideDomId + " #phonic_slides").find(".swiper-slide").each(function(){		
		
		slide_id = $(this).attr('id').replace('slide_','');	
		slide_type = $(this).find('.Phinics_question').data('type');
		ans_selected = null;
		ans_dropped = [];
		slide_score = parseInt($(this).find('.Phinics_question').attr('data-score'));
		isVisited = $(this).hasClass('visited') ? true : false;		
		
		oSelf.score = oSelf.score + slide_score;
		
		if (slide_type == ASSIGNMENTS.c_s_SLIDE_TYPE_COMPREHENSION) {
			ans_selected = $(this).find('.question_part li.active > .answer_key').text();
			bSubmitted = ($(this).find("ul.question_part").hasClass('locked')) ? true : false;
			isRejectedAttempted = null;
		}
		else if (slide_type == ASSIGNMENTS.c_s_SLIDE_TYPE_PRACTICE) {				
			$(this).find('.text_search').each(function(){
				ans_dropped.push($(this).data('text'));
			});
			bSubmitted = ($(this).find(".phonic_dropbox").hasClass('locked')) ? true : false;
			isRejectedAttempted = null;
		}
		else {
			bSubmitted = ($(this).find(".phonic_oralfluency_conts").hasClass('locked')) ? true : false;
			slide_score = 1; // for Oral Fluency
			isRejectedAttempted = (typeof oDiv.attr('data-rejected-attempted') != 'undefined' && oDiv.attr('data-rejected-attempted') == "true") ? 
									true : false;
		}
		
		objData = {
					"subSlideID": slide_id,
					"subSlideType": slide_type,				
					"subSlideSelectedAnswer": ans_selected,
					"subSlideDroppedAnswer": ans_dropped,
					"subSlideSubmitted": bSubmitted,
					"subSlideScore": slide_score,
					"isVisited": isVisited
				};
		
		if (isRejectedAttempted != null) {
			objData['isRejectedAttempted'] = isRejectedAttempted;
		}
					
		subSlides.push(objData);			
		attemptCount += (bSubmitted == true) ? 1 : 0;			
	});
	
	// if attempted all questions then set final submit true
	oSelf.finalSubmit = ($("#" + slideDomId + " #phonic_slides").find(".swiper-slide").length == attemptCount)?true:false;	
	var subSlideData = {"subSlides" : subSlides};
	
	return subSlideData;	
};

PhonicTextBasedView.updateAttemptDataFunction = function () {	
	var oSelf = this,
		oScoreSumary = {},	
		subSlideData = oSelf.collectAttemptData(),
		slideAttempt = 1,
		itemId = null,
		oTemplate = {},
		bRejected = false;	
	
	if (oSelf.studentAttemptDataObj != null && typeof oSelf.studentAttemptDataObj.itemSlides != 'undefined') {	
		slideAttempt = parseInt((((oSelf.studentAttemptDataObj || {}).itemSlides || [])[0] || {}).slideAttempt || 0) + 1;		
	}	
	itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	subSlideData = $.extend(true, subSlideData, {"questionId" : AssigmentSlides.questionId});
	AssigmentSlides.studentAttemptData = {
		"itemId": itemId,
		"itemSlides": [
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": AssigmentSlides.assignmentType,
				"slideAttempt": slideAttempt,
				"slideIsCorrect": null,
				"slideScore":GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": subSlideData
			}
		],
		"submitStatus": ((oSelf.finalSubmit === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": AssigmentSlides.assignmentType
	};	
	
	
	
	if (
		oSelf.PKTOralFluencyScore.length > 0 && 
		typeof oSelf.PKTOralFluencyScore[0]["AC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["AC"] == -1 &&
		typeof oSelf.PKTOralFluencyScore[0]["WCPM"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WCPM"] == -1 &&
		typeof oSelf.PKTOralFluencyScore[0]["WC"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["WC"] == -1 &&
		typeof oSelf.PKTOralFluencyScore[0]["EX"] != 'undefined' && oSelf.PKTOralFluencyScore[0]["EX"] == -1 
		) {
		bRejected = true;
	}
	
	if (oSelf.studentAttemptDataObj.oralFluencyData && oSelf.studentAttemptDataObj.oralFluencyData.length > 0 && !bRejected) {
		AssigmentSlides.studentAttemptData.oralFluencyData = oSelf.studentAttemptDataObj.oralFluencyData;
		AssigmentSlides.bAudioExists = true;
	}
	else if (oSelf.oralFluencyData.length > 0) {
		AssigmentSlides.studentAttemptData.oralFluencyData = encodeURIComponent(JSON.stringify(oSelf.oralFluencyData));
	}
	
	AssigmentSlides.studentAttemptData.itemSlides[0].slideScore = oSelf.score;
	AssigmentSlides.systemScore = (oSelf.finalSubmit == true)?oSelf.score:GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = (oSelf.finalSubmit == true && !AssigmentSlides.bAudioExists)?oSelf.score:GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = (oSelf.finalSubmit == true)?ASSIGNMENTS.c_s_COMPLETED_STATUS:ASSIGNMENTS.c_s_INCOMPLETED_STATUS;		
	
	/*== start - if iLit20 and Oral fluency is Off ==*/
	if (
		((AssignmentsView.productCode || '').startsWith("ilit20")) && 
		(objSettingsData.Content.AcceptOralFluencyScore == '0') && 
		oSelf.finalSubmit == true
	) 
	{
	  AssigmentSlides.OralFluencyData = AssigmentSlides.studentAttemptData.oralFluencyData;   
	  //AssigmentSlides.MaxScore = oSelf.totMaxScore;   
	  AssigmentSlides.IsStudentScored = "1";
	 }
	 else{
		AssigmentSlides.IsStudentScored = "0";
	 }
	/*== end - if iLit20 and Oral fluency is Off ==*/
	
	oScoreSumary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
	oScoreSumary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.questionId;
	oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = oSelf.score;			
	oScoreSumary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
	
	AssigmentSlides.studentAttemptSummary = (oSelf.finalSubmit == true) ? oScoreSumary : {};	
		
	if (oSelf.saveDataInitially === true) {		
		oSelf.saveDataInitially = false;
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;
		AssigmentSlides.setAttemptData();		
	}
};

PhonicTextBasedView.updateAttemptData4ExtendedPhonic = function () {
	var oSelf = this,
		oScoreSumary = {},	
		subSlideData = {},
		slideAttempt = 0,
		itemId = null,
		oTemplate = {};	
	
	if (oSelf.studentAttemptDataObj != null && typeof oSelf.studentAttemptDataObj.itemSlides != 'undefined') {
		slideAttempt = parseInt((((oSelf.studentAttemptDataObj || {}).itemSlides || [])[0] || {}).slideAttempt || 0) + 1;		
	}	
	itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);	
	
	AssigmentSlides.studentAttemptData = {
		"itemId": itemId,
		"itemSlides": [
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC,
				"slideAttempt": slideAttempt,
				"slideIsCorrect": null,
				"slideScore":GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": subSlideData
			}
		],
		"submitStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": ASSIGNMENTS.c_s_TYPE_TPL_EXTENDEDPHONIC
	};
	
	AssigmentSlides.studentAttemptData.itemSlides[0].slideScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	AssigmentSlides.studentAttemptSummary = {};
	
};

PhonicTextBasedView.prepare4View = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
		
	$('#' + sSlideId + ' button')
		.addClass('disabled btndisabled')
		.prop('disabled', true);
		
	$('#' + sSlideId + ' .continent_edit_box').css({
		'opacity': '1',
		'left': '0'
	});
	
	/*==== Hide 'Input Answer' Button ====*/
	var contentInnerHeight = $('#' + sSlideId).find('.continent_content_inner_iscroll').height();
	var editBoxTitleHeight = $('#' + sSlideId).find('.edit_box_title').height();
	var editBoxPaddingTop = parseInt($('#' + sSlideId).find('.edit_box_title').css('padding-top'));
	var editBoxPaddingBottom = parseInt($('#' + sSlideId).find('.edit_box_title').css('padding-bottom'));

	var height = contentInnerHeight + editBoxTitleHeight + editBoxPaddingTop  + editBoxPaddingBottom;
	
	/* if (height < $('#' + sSlideId + ' .continent_box_inner').height() - 10) {		
		$('#' + sSlideId + ' .continent_content_inner_iscroll').css({'max-height':height+'px'});
	} */
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_INPUTBTNID).parent().hide();
	/*== End Hide 'Input Answer' Button ==*/
};
/*****************************************************/

function HeightManager (aHeightConfig) {
	var aLayout = aHeightConfig,
		dDefaultBaseHeight = 0;
	this.setHeight = function (aElements, sBaseSelector, dBaseHeight) {
		if (typeof dBaseHeight != 'number') {
			var dScreenHeight = document.documentElement.clientHeight,
				dHeaderHeight = (
					$('header').height() +
					parseFloat($('header').css('padding-top').replace('px', '')) +
					parseFloat($('header').css('padding-bottom').replace('px', ''))
				),
				dDirectionBarHeight = (
					$('.phonicstext_content').length > 0?
					(
						$('.phonicstext_content').height() +
						parseFloat($('.phonicstext_content').css('padding-top').replace('px', '')) +
						parseFloat($('.phonicstext_content').css('padding-bottom').replace('px', '')) +
						parseFloat($('.phonicstext_content').css('border-top-width').replace('px', '')) +
						parseFloat($('.phonicstext_content').css('border-bottom-width').replace('px', ''))
					):
					0
				);
			dBaseHeight = dScreenHeight - dHeaderHeight - dDirectionBarHeight;
			if (dDefaultBaseHeight > 0) {
				dBaseHeight = dDefaultBaseHeight;
			}
		}
		if (typeof aElements == 'undefined') {
			aElements = aLayout;
		}
		if (typeof sBaseSelector == 'undefined') {
			sBaseSelector = '';
		}
		else {
			sBaseSelector += ' ';
		}
		
		for (var iIndex = 0; iIndex < aElements.length; iIndex++) {
			var oItem = aElements[iIndex],
				sElementSelector = '' + sBaseSelector + oItem.selector,
				oElement = $(sElementSelector).eq(0),
				mixFormula = (
					(typeof oItem.formula == 'function')?
					oItem.formula(oElement.get(0), dBaseHeight, sElementSelector):
					oItem.formula
				),
				dHeight = 0,
				aMatches = null,
				dSubtrahend = 0;
				
			if (typeof mixFormula == 'number') {
				dHeight = mixFormula;
				dSubtrahend = 0;
			}
			else if (typeof mixFormula == 'string') {
				if (aMatches = mixFormula.match(/(.*)%$/)) {
					if (aMatches.length == 2) {
						dHeightPercent = parseFloat(aMatches[1]);
						dHeight = parseFloat((dBaseHeight * dHeightPercent / 100).toFixed(2));
						if ($('' + sBaseSelector.trim()).length > 0) {
							dSubtrahend = (
								parseFloat($('' + sBaseSelector.trim()).css('padding-top').replace('px', '')) +
								parseFloat($('' + sBaseSelector.trim()).css('padding-bottom').replace('px', ''))
							);
						}
						dSubtrahend += (
							parseFloat(oElement.css('padding-top').replace('px')) +
							parseFloat(oElement.css('padding-bottom').replace('px')) +
							parseFloat(oElement.css('margin-top').replace('px')) +
							parseFloat(oElement.css('margin-bottom').replace('px'))
						);
						if (!oElement.parent().is('' + sBaseSelector.trim())) {
							dSubtrahend += (
								parseFloat(oElement.parent().css('padding-top').replace('px')) +
								parseFloat(oElement.parent().css('padding-bottom').replace('px'))
							);
						}
					}
				}
				else if (aMatches = mixFormula.match(/(.*)px$/)) {
					if (aMatches.length == 2) {
						dHeight = parseFloat(aMatches[1]);
						dSubtrahend = 0;
					}
				}
			}
			
			if (dHeight) {
				var dHeight2Apply = (dHeight - dSubtrahend).toFixed(2);
				dHeight = dHeight2Apply;
				oElement.css('height', dHeight2Apply + 'px');
			}
			else {
				dHeight = dBaseHeight;
			}
			if (
				typeof oItem.kids != 'undefined' &&
				oItem.kids instanceof Array
			) {
				this.setHeight(oItem.kids, sBaseSelector + oItem.selector, parseFloat(dHeight));
			}
		}
	};
	
	this.setBaseHeight = function (dBaseHeight) {
		if (typeof dBaseHeight != 'number') {
			return false;
		}
		else if (dBaseHeight <= 0) {
			return false;
		}
		dDefaultBaseHeight = dBaseHeight;
	};
}
 
 
function PluralNounsView () {}

PluralNounsView.slideIdx = null;
PluralNounsView.model = null;
PluralNounsView.weightPerQuestion = 1;
PluralNounsView.lockedClass = 'locked';
PluralNounsView.correctAnswers = {};
PluralNounsView.scrollBars = null;

PluralNounsView.init = function (slideIdx, model) {
    var oSelf = this,
		sSlideId = '';
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	sSlideId = oSelf.getSlideDomId();
	oSelf.scrollBars = new ScrollBars();
	/*==== Added to facilitate resize ====*/
	oSelf.layout = new HeightManager([
		{
			selector:	'#slide_inner_container #' + sSlideId + ' .phonics_game_container .WordSlam_container',
			formula:	'100%',
			kids:	[
				{
					selector:	'.container2',
					formula:	'95%',
					kids:		[
						{
							selector:	'.container1',
							formula:	'100%',
							kids:		[
								{
									selector:	'.col1_left',
									formula:	'100%',
									kids:		[
										{
											selector:	'.matching_container_content',
											formula:	function (oElement, dBaseHeight, sSelector) {
												oSelf.scrollBars.push(sSelector);
												return '92%';
											}
										}
									]
								}, {
									selector:	'.col1_right',
									formula:	'100%',
									kids:		[
										{
											selector:	'.word_matching_area',
											formula:	function (oElement, dBaseHeight, sSelector) {
												var dSubtrahend = 0;
												for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
													dSubtrahend += (
														$(oElement).siblings().eq(iIdx).height() +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
													);
												}
												oSelf.scrollBars.push(sSelector);
												return (dBaseHeight - dSubtrahend);
											},
											kids:		[
												{
													selector:	'.plural-nouns-drop-area',
													formula:	function (oElement, dBaseHeight, sSelector) {
														oSelf.scrollBars.push(sSelector);
														return '100%';
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	/*== End Added to facilitate resize ==*/
	
	oSelf.render();
	oSelf.bindEvents();
	
	oSelf.resize();
	
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS);
	}
};

PluralNounsView.getConstantsRef = function () {
	return ASSIGNMENTS;
};

PluralNounsView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

PluralNounsView.retrieveStatus = function (oSavedData) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	
	if (typeof oSavedData == 'undefined' || oSavedData == null) {
		oSavedData = oSelf.fetchAttemptData();
	}
	
	if (!isObjectEmpty(oSavedData)) {
		var sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
		for (var iKey in oSavedData) {
			$('' + sDropBoxSelector).filterByData('index', iKey).parent().addClass('draggable_box');
		}
	}
};

PluralNounsView.fetchAttemptData = function () {
	var oSelf = this,
		oSavedData = {};
		
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		for (var mixKey in AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData) {
			/*==== Handle Question ID in Slide Input Data ====*/
			if (mixKey == ASSIGNMENTS.c_s_KEY_QUESTION_ID) {
				continue;
			}
			/*== End Handle Question ID in Slide Input Data ==*/
			var iKey = mixKey;
			oSavedData[iKey] = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[iKey].answer;
		}
	}
	
	return oSavedData;
};

PluralNounsView.render = function () {
	var oSelf = this,
		oSavedData = {},
		sSlideId = oSelf.getSlideDomId();
		
	/*==== Fetch Attempt Data ====*/
	oSavedData = oSelf.fetchAttemptData();
	/*== End Fetch Attempt Data ==*/
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
    $('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS).html(),
			{
				'data':			oSelf.model.questions,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	sSlideId,
				'slideType':	oSelf.model.type,
				'savedData':	oSavedData,
				'CONSTANTS':	oSelf.getConstantsRef()
			}
		)
	);
	oSelf.retrieveStatus(oSavedData);
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	
	AssignmentsView.hideMainLoader();
};

PluralNounsView.prepare4View = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
		
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true); // bIsSubmitted = true
	}
	
	oDragAndDrop.removeDraggable(sDragBoxSelector);
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
		.off('click tap')
		.attr('disabled', true)
		.addClass('btndisabled disabled');
};

PluralNounsView.resize = function () {
	var oSelf = this;
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + oSelf.getSlideDomId()).css('width', '100%');
	/*== End ???? ==*/
	
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	
	/*==== Enable Custom Scrollbar ====*/
	setTimeout(function () {
		var aScrollBars = oSelf.scrollBars.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.scrollBars.setInstance(aScrollBars[iI]);
		}
	}, 500);
	/*== End Enable Custom Scrollbar ==*/
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
};

PluralNounsView.bindEvents = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();	
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			oSelf.updateAttemptData(true); // bIsSubmitted = true			
			
			$.monitor({
				'if':			function () {					
					return ((typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0)  || 
						($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY));
				},
				'beforeStart':	function () {
				},
				'interval':		500,
				'then':			function () {
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {						
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);						
					}
					else {						
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});	
		});
		
	/*==== Remove Used Tiles ====*/
	oDragAndDrop.imposeDroppable(
		'#' + sSlideId + ' #plural-nouns-word-bank',
		{
			accept:		'#' + sSlideId + ' .col1_right .draggable_box',
			hoverClass:	'ui-state-hover'
		},
		function (oEvent, oUi) {
			oUi.draggable
				.removeClass('drop draggable_box')
				.addClass('blank')
				.find('.myButtoninner')
					.text(ASSIGNMENTS.c_s_DROP_LABEL);
					
			oUi.draggable.parent().next().find('.final-answer').empty();
			
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			setTimeout(function () {
				oDragAndDrop.removeDraggable(oUi.draggable);
			}, 0);
			
			oSelf.updateAttemptData();
		}
	);
	/*== End Remove Used Tiles ==*/	
		
	oSelf.makeBoxDraggable();
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });	
};
	
PluralNounsView.makeBoxDraggable = function () {
	// setting options of the drag event
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
		
	$('#' + sSlideId + ' .draggable_box').css('touch-action', 'none');
	
	oDragAndDrop.imposeDraggable(
		'#' + sSlideId + ' .draggable_box',
		{
			helper:	function () {
				var oClone = $(this).clone(true);
				oClone.css({
					'margin-top': '2%',
					'margin-left': '8px'
				});
				return oClone;
			},
			start:	function (poEvent, poUI) {
				var aScrollBars = oSelf.scrollBars.getScrollBars();
				
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
				}
			},
			containment:	'#' + sSlideId + ' .container2'
		},
		function () {
			var aScrollBars = oSelf.scrollBars.getScrollBars();
			
			for (var iI = 0; iI < aScrollBars.length; iI++) {
				oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
			}
		}
	);
	oSelf.makeDroppable();
};

PluralNounsView.enableDisableSubmit = function () {
	var oSelf = this,
		bAllowSubmit = true,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
			
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		if ($('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase() == ASSIGNMENTS.c_s_PLURAL_NOUN_DROP_LABEL.toLowerCase()) {
			bAllowSubmit = false;
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
				.prop('disabled', true)
				.addClass('disabled')
				.addClass('btndisabled');
			break;
		}
	}
	
	if (bAllowSubmit === true) {
		$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
			.prop('disabled', false)
			.removeClass('disabled')
			.removeClass('btndisabled');
	}
};
        
PluralNounsView.makeDroppable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box',
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
		
	oDragAndDrop.imposeDroppable(
		sDropBoxSelector,
		{},
		function(oEvent, oUi) {
			var oDragBox = oUi.draggable,
				sSuffix = oDragBox.text().trim(),
				oDropBox = $(this);
				sWord = oDropBox.parent().parent().prev().text().trim(),
				sPlural = sWord,
				sTextAtDropBox = oDropBox.text().trim(),
				bRemoveDraggableFromDragBox = false;
				
			oDropBox.text(sSuffix);
			oDropBox.parent().addClass('draggable_box');
			switch (sSuffix) {
				case 'es':
				case 's':
					sPlural += sSuffix;
					break;
				case 'ies':
					sPlural = (	
						(sPlural.charAt(sPlural.length - 1).toLowerCase() == 'y')?
						sPlural.substring(0, sPlural.length - 1):
						sPlural
					) + sSuffix;
					break;
			}
			oDropBox.parent().parent().next().find('.wordtext_inner').text(sPlural);
			oDropBox.parent().removeClass('blank').addClass('drop');
			
			/*==== If Dragged Element belongs to Droppable Area ====*/
			if ($.contains($('#' + sSlideId + ' .col1_right').get(0), oDragBox.get(0))) {
				oDragBox.find('.myButtoninner').text(sTextAtDropBox);
				
				if (sTextAtDropBox.toLowerCase() == ASSIGNMENTS.c_s_PLURAL_NOUN_DROP_LABEL.toLowerCase()) {
					oDragBox.addClass('blank');
					bRemoveDraggableFromDragBox = true;
					oDragBox.parent().next().find('.wordtext_answer').empty();
					oDragBox.parent().next().find('[class^="answer_"]').hide();
				}
				else {
					sPlural = oDragBox.parent().prev().text().trim();
					switch (sTextAtDropBox) {
						case 'es':
						case 's':
							sPlural += sTextAtDropBox;
							break;
						case 'ies':
							sPlural = (	
								(sPlural.charAt(sPlural.length - 1).toLowerCase() == 'y')?
								sPlural.substring(0, sPlural.length - 1):
								sPlural
							) + sTextAtDropBox;
							break;
					}
					oDragBox.parent().next().find('.wordtext_answer').text(sPlural);
				}
			}
			/*== End If Dragged Element belongs to Droppable Area ==*/
			
			oDragAndDrop.removeDroppable(sDropBoxSelector);
			setTimeout(function () {
				oDragAndDrop.removeDraggable(sDragBoxSelector);
				/*==== If Dragged Element belongs to Droppable Area ====*/
				if (bRemoveDraggableFromDragBox) {
					oDragBox.removeClass('draggable_box');
				}
				/*== End If Dragged Element belongs to Droppable Area ==*/
				oSelf.makeBoxDraggable();
			}, 0);
			oSelf.enableDisableSubmit();
			oSelf.updateAttemptData();
		}
	);
};

PluralNounsView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0;
	
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iIndex = 0; iIndex < $('#' + sSlideId + ' .matching_container_answer .dropbox').length; iIndex++) {
		var oDropBox = $('#' + sSlideId + ' .matching_container_answer .dropbox').eq(iIndex),
			iTotalDropBoxes = $('#' + sSlideId + ' .matching_container_answer .dropbox').length,
			sSelectedAnswer = oDropBox.text().trim();
		if (sSelectedAnswer == ASSIGNMENTS.c_s_DROP_LABEL) {
			continue;
		}
		var bCorrectness = (
			oDropBox.parent().next().find('.wordtext_inner').text().trim().toLowerCase() == oDropBox.parent().prev().text().trim().pluralize().toLowerCase()
		);
		oSlideInputData[iIndex.toString()] = {
			'answer':		sSelectedAnswer,
			'correctness':	bCorrectness
		};
		if (bIsSubmitted === true) {
			oDropBox.parent().next().find('.word_text').find('[class^="answer_"]').hide();
			oDropBox.parent().next().find('.word_text').find('.answer_' + ((bCorrectness === true)? 'rt': 'wg')).show();
			if (bCorrectness) {
				iCorrectAnswers++;
			}
			else {
				var sCorrectAnswer = oDropBox.parent().prev().text().trim().pluralize(),
					sSelectedAnswer = oDropBox.parent().next().find('.wordtext_inner').text().trim();
				oDropBox.parent().next().find('.word_text').find('.wordtext_answer').html('<span class="wrg_ans">\
					' + sSelectedAnswer + '\
				</span>' + sCorrectAnswer);
			}
		}
	}
	
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	oSlideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	AssigmentSlides.studentAttemptData = {
		"itemId": 		sAssignmentId,
		"itemSlides": 	[
			{
				"slideID": sSlideId,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSlideInputData
			}
		],
		'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_PLURALNOUNS
	};
	

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	if (bIsSubmitted === true) {
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		AssigmentSlides.finalScore = iCorrectAnswers * oSelf.weightPerQuestion;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
			
		try { $('#' + sSlideId + ' .draggable_box').draggable('destroy') } catch (oException) {};
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(AssigmentSlides.finalScore) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="position:absolute; width:83%; margin:0 0 0 2%; bottom:5px;">\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + (iCorrectAnswers * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_PLURAL_NOUNS_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_PLURAL_NOUN_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
				
			$('#' + sSlideId + ' .plural-nouns-drop-area').eq(0).parent().parent().css('position', 'relative').append(sResultHtml);
		});
	}
};

function DigraphView () {}

DigraphView.slideIdx = null;
DigraphView.model = null;
DigraphView.lockedClass = 'locked';
DigraphView.weightPerQuestion = 1;
DigraphView.correctAnswers = [];
DigraphView.scrollBars = null;

DigraphView.init = function (slideIdx, model) {
    var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	oSelf.correctAnswers = [];
	oSelf.scrollBars = new ScrollBars();
	/*==== Added to facilitate resize ====*/
	oSelf.layout = new HeightManager([
		{
			selector:	'#' + oSelf.getSlideDomId() + ' .phonics_game_container .WordSlam_container',
			formula:	'95%',
			kids:	[
				{
					selector:	'.container1',
					formula:	'100%',
					kids:		[
						{
							selector:	'.col1_left',
							formula:	'100%',
							kids:		[
								{
									selector:	'.matching_container_content',
									formula:	function (oElement, dBaseHeight, sSelector) {
										oSelf.scrollBars.push(sSelector);
										return '100%';
									}
								}
							]
						}, {
							selector:	'.col1_right',
							formula:	'100%',
							kids:		[
								{
									selector:	'.word_matching_area',
									formula:	function (oElement, dBaseHeight) {
										var dSubtrahend = 0;
										for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
											dSubtrahend += (
												$(oElement).siblings().eq(iIdx).height() +
												parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
												parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
											);
										}
										return (dBaseHeight - dSubtrahend);
									},
									kids:		[
										{
											selector:	'.matching_container_answer',
											formula:	function (oElement, dBaseHeight, sSelector) {
												var dSubtrahend = 0;
												oSelf.scrollBars.push(sSelector);
												for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
													dSubtrahend += (
														$(oElement).siblings().eq(iIdx).height() +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
													);
												}
												return (dBaseHeight - dSubtrahend);
											}
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	/*== End Added to facilitate resize ==*/
	
	/*==== Gather Correct Answers ====*/
	for (var iQIndex in oSelf.model.questions) {
		var oQuestion = oSelf.model.questions[iQIndex];
		for (var iDropIndex = 0; iDropIndex < oQuestion['drop_options'].length; iDropIndex++) {
			var oDropOption = oQuestion['drop_options'][iDropIndex];
			oSelf.correctAnswers.push(oDropOption.answer);
		}
	}
	/*== End Gather Correct Answers ==*/
	
	oSelf.render();
	oSelf.bindEvents();
	
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS);
	}
};

DigraphView.getConstantsRef = function () {
	return ASSIGNMENTS;
};

DigraphView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

DigraphView.fetchAttemptData = function () {
	var oSelf = this,
		oSavedData = {};
		
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		for (var mixKey in AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData) {
			/*==== Handle Question ID in Slide Input Data ====*/
			if (mixKey == ASSIGNMENTS.c_s_KEY_QUESTION_ID) {
				continue;
			}
			/*== End Handle Question ID in Slide Input Data ==*/
			var iKey = mixKey;
			oSavedData[iKey] = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[iKey].answer;
		}
	}
	
	return oSavedData;
};

DigraphView.retrieveStatus = function (oSavedData) {
	var oSelf = this;
	if (typeof oSavedData == 'undefined' || oSavedData == null) {
		oSavedData = oSelf.fetchAttemptData();
	}
	
	if (!isObjectEmpty(oSavedData)) {
		var sDropBoxSelector = '#' + oSelf.getSlideDomId() + ' .dropbox .myButtoninner';
		for (var iKey in oSavedData) {
			$('' + sDropBoxSelector).filterByData('index', iKey).parent().addClass('draggable_box');
		}
	}
}

DigraphView.render = function () {
	var oSelf = this,
		oSavedData = oSelf.fetchAttemptData(),
		iTotalAnswers = 0,
		iTotalSelectedAnswers = 0;
	
	/*==== Fetch Attempt Data ====*/
	for (var iKey in oSavedData) {
		iTotalSelectedAnswers++;
	}
	/*== End Fetch Attempt Data ==*/
	
	for (var iQIndex in oSelf.model.questions) {
		var oQuestion = oSelf.model.questions[iQIndex];
		for (var iDropIndex = 0; iDropIndex < oQuestion['drop_options'].length; iDropIndex++) {
			iTotalAnswers++;
		}
	}
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS).html(),
			{
				'data':			oSelf.model.questions,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	oSelf.getSlideDomId(),
				'slideType':	oSelf.model.type,
				'savedData':	oSavedData,
				'enableButton':	(iTotalAnswers == iTotalSelectedAnswers),
				'CONSTANTS':	oSelf.getConstantsRef()
			}
		)
	);
	AssignmentsView.hideMainLoader();
	oSelf.retrieveStatus(oSavedData);
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	oSelf.resize();
};

DigraphView.prepare4View = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
		
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true); // bIsSubmitted = true
	}
	
	oDragAndDrop.removeDraggable(sDragBoxSelector);
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
		.off('click tap')
		.attr('disabled', true)
		.addClass('btndisabled disabled');
};

DigraphView.resize = function () {
	var oSelf = this;
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + oSelf.getSlideDomId()).css('width', '100%');
	/*== End ???? ==*/
	
	/*==== Enable Custom Scrollbar ====*/
	setTimeout(function () {
		var aScrollBars = oSelf.scrollBars.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.scrollBars.setInstance(aScrollBars[iI]);
		}
	}, 500);
	/*== End Enable Custom Scrollbar ==*/
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
	
};

DigraphView.bindEvents = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();	
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			$.monitor({
				'if':			function () {					
					return (
						(
							typeof objStudentAttemptDataResponse != 'undefined' &&
							objStudentAttemptDataResponse != null &&
							objStudentAttemptDataResponse != 0
						)  ||
						(
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
						)
					);
				},
				'beforeStart':	function () {
					objStudentAttemptDataResponse = 0;
					oSelf.updateAttemptData(true); // bIsSubmitted = true
				},
				'interval':		500,
				'then':			function () {					
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {						
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);						
					}
					else {						
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});	
			
		});
	
	oSelf.makeBoxDraggable();
	
	/*==== Remove Used Tiles ====*/
	oDragAndDrop.imposeDroppable(
		'#' + sSlideId + ' #digraphs-word-bank',
		{
			accept:		'#' + sSlideId + ' .col1_right .draggable_box',
			hoverClass:	'ui-state-hover'
		},
		function (oEvent, oUi) {
			oUi.draggable
				.removeClass('drop draggable_box')
				.addClass('blank')
				.find('.myButtoninner')
					.text(ASSIGNMENTS.c_s_DIGRAPH_DROP_LABEL);
					
			oUi.draggable.parent().next().next().find('.wordtext_answer').empty();
			
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			setTimeout(function () {
				oDragAndDrop.removeDraggable(oUi.draggable);
				oSelf.updateAttemptData();
			}, 0);
		}
	);
	/*== End Remove Used Tiles ==*/
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
};
	
DigraphView.makeBoxDraggable = function () {
	// setting options of the drag event
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
		
	$(sDragBoxSelector).css('touch-action', 'none');
	
	oDragAndDrop.imposeDraggable(
		sDragBoxSelector,
		{
			helper:			function () {
				var oClone = $(this).clone(true);
				oClone.css({
					'margin-top': '2%',
					'margin-left': '8px'
				});
				return oClone;
			},
			start:			function () {
				var aScrollBars = oSelf.scrollBars.getScrollBars();
				
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
				}
			},
			containment:	'#' + sSlideId + ' .container2'
		},
		function () {
			var aScrollBars = oSelf.scrollBars.getScrollBars();
			
			for (var iI = 0; iI < aScrollBars.length; iI++) {
				oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
			}
		}
	);
	oSelf.makeDroppable();
};
        
DigraphView.enableDisableSubmit = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner',
		bAllowSubmit = true;
			
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		if ($('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase() == ASSIGNMENTS.c_s_DIGRAPH_DROP_LABEL.toLowerCase()) {
			bAllowSubmit = false;
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
				.prop('disabled', true)
				.addClass('disabled')
				.addClass('btndisabled');
			return;
		}
	}
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
		.prop('disabled', false)
		.removeClass('disabled')
		.removeClass('btndisabled');
};

DigraphView.makeDroppable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
	
	oDragAndDrop.imposeDroppable(
		sDropBoxSelector,
		{},
		function(oEvent, oUi) {
			var oDragBox = oUi.draggable,
				sPortion = oSelf.model.questions['0'].drag_options[oDragBox.data('answer-index')].text,
				oDropBox = $(this),
				oDropBoxParent = oDropBox.parent(),
				oDropBoxGrandParent = oDropBoxParent.parent();
				iDropIndex = oDropBoxGrandParent.parent().data('drop-index');
				sPrefix = oSelf.model.questions['0'].drop_options[iDropIndex].prefix,
				sSuffix = oSelf.model.questions['0'].drop_options[iDropIndex].suffix,
				sPhrase = sPrefix + sPortion + sSuffix,
				sTextAtDropBox = oDropBox.text().trim(),
				bRemoveDraggableFromDragBox = false;
			
			oDropBox.text(sPortion);
			oDropBoxGrandParent.next().next().find('.wordtext_inner').text(sPhrase);
			oDropBoxParent.removeClass('blank');
			
			oDropBoxParent.addClass('draggable_box');
			oDropBoxParent.addClass('swiper-no-swiping');
			oDropBoxParent.data('answer-index', oDragBox.data('answer-index'));
			oDragAndDrop.imposeDraggable(
				oDropBoxParent,
				{
					helper:	function () {
						var oClone = $(this).clone(true);
						oClone.css({
							'margin-top': '2%',
							'margin-left': '8px'
						});
						return oClone;
					},
					containment:	'#' + sSlideId + ' .container2'
				}
			);
			
			/*==== If Dragged Element belongs to Droppable Area ====*/
			if ($.contains($('#' + oSelf.getSlideDomId() + ' .col1_right').get(0), oDragBox.get(0))) {
				oDragBox.find('.myButtoninner').text(sTextAtDropBox);
				
				if (sTextAtDropBox.toLowerCase() == ASSIGNMENTS.c_s_DIGRAPH_DROP_LABEL.toLowerCase()) {
					oDragBox.addClass('blank');
					oDragBox.removeData('answer-index');
					bRemoveDraggableFromDragBox = true;
					oDragBox.parent().next().next().find('.wordtext_answer').empty();
					oDragBox.parent().next().next().find('[class^="answer_"]').hide();
					setTimeout(function () {
						oDragAndDrop.removeDraggable(oDragBox);
					}, 0);
				}
				else {
					sPrefix = oDragBox.parent().prev().text().trim();
					sSuffix = oDragBox.parent().next().text().trim();
					sPhrase = sPrefix + oDragBox.text().trim() + sSuffix;
					oDragBox.parent().next().next().find('.wordtext_answer').text(sPhrase);
				}
			}
			/*== End If Dragged Element belongs to Droppable Area ==*/
			
			oSelf.enableDisableSubmit();
			oSelf.updateAttemptData();
		}
	);
};

DigraphView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner',
		iTotalDropBoxes = $('' + sDropBoxSelector).length;
		
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		var oDropBox = $('' + sDropBoxSelector).eq(iIndex),
			iDropIndex = oDropBox.parent().parent().parent().data('drop-index'),
			sSelectedAnswer = oDropBox.text().trim(),
			sPrefix = oSelf.model.questions['0'].drop_options[iDropIndex].prefix,
			sSuffix = oSelf.model.questions['0'].drop_options[iDropIndex].suffix,
			sCorrectAnswer = '';
			
		try {
			sCorrectAnswer = oSelf.correctAnswers[iIndex];
		}
		catch (oException) {
			
		}

		if (
			sSelectedAnswer == ASSIGNMENTS.c_s_DIGRAPH_DROP_LABEL ||
			sCorrectAnswer.length == 0
		) {
			continue;
		}
		var bCorrectness = (
			oDropBox.text().trim().toLowerCase() == sCorrectAnswer.toLowerCase()
		);
		oSlideInputData[iIndex.toString()] = {
			'answer':		sSelectedAnswer,
			'correctness':	bCorrectness
		};
		if (bIsSubmitted === true) {
			oDropBox.parent().parent().next().next().find('[class^="answer_"]').hide();
			oDropBox.parent().parent().next().next().find('.answer_' + ((bCorrectness === true)? 'rt': 'wg')).show();
			if (bCorrectness) {
				iCorrectAnswers++;
			}
			else {
				var sCorrectPhrase = sPrefix + sCorrectAnswer + sSuffix,
					sSelectedPhrase = sPrefix + sSelectedAnswer + sSuffix;
				
				oDropBox.parent().parent().next().next().find('.wordtext_answer').html('<span class="wrg_ans">\
					' + sSelectedPhrase + '\
				</span>' + sCorrectPhrase);
			}
		}
	}
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		var dScore = (iCorrectAnswers * oSelf.weightPerQuestion);
		
		var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
			sResultHtml = '<div class="msg_content" style="bottom:54px; min-height:50px; position:absolute; right:11px; width:450px;">\
				<div class="correct sprite"></div>\
				<strong>\
					' + sHeaderTitle + ': ' + dScore + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
				</strong><br />\
				' + oUtility.printf(ASSIGNMENTS.c_s_DIGRAPH_COMPLETED_STATUS, sHeaderTitle) + '\
			</div>';
		$('#' + sSlideId + ' .digraph-drop-area').eq(0).after(sResultHtml);
		$('#' + sSlideId + ' .digraph-drop-area').eq(0).parent().css({ postion: 'relative' });
		$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
			.addClass('disabled btndisabled')
			.attr('disabled', true);
			
		return;
	}
	
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	oSlideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	AssigmentSlides.studentAttemptData = {
		"itemId": 		sAssignmentId,
		"itemSlides": 	[
			{
				"slideID": sSlideId,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSlideInputData
			}
		],
		'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_DIGRAPHS
	};

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	if (bIsSubmitted === true) {
		var dScore = (iCorrectAnswers * oSelf.weightPerQuestion);
		
		AssigmentSlides.systemScore = dScore;
		AssigmentSlides.finalScore = dScore;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(AssigmentSlides.finalScore) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="bottom:54px; min-height:50px; position:absolute; right:11px; width:450px;">\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + dScore + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_DIGRAPH_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			$('#' + sSlideId + ' .digraph-drop-area').eq(0).after(sResultHtml);
			$('#' + sSlideId + ' .digraph-drop-area').eq(0).parent().css({ postion: 'relative' });
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_DIGRAPH_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			try { $('#' + sSlideId + ' .draggable_box').draggable('destroy') } catch (oException) {};
		});
	}
};

function WordFamiliesView () {}

WordFamiliesView.slideIdx = null;
WordFamiliesView.model = null;
WordFamiliesView.weightPerQuestion = 1;
WordFamiliesView.lockedClass = 'locked';
WordFamiliesView.correctAnswers = {};
WordFamiliesView.scrollBars = null;

WordFamiliesView.init = function (slideIdx, model) {
    var oSelf = this,
		sSlideId = '';
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	oSelf.correctAnswers = {};
	oSelf.scrollBars = new ScrollBars();
	
	sSlideId = oSelf.getSlideDomId();
	/*==== Added to facilitate resize ====*/
	oSelf.layout = new HeightManager([
		{
			selector:	'#slide_inner_container #' + sSlideId + ' .phonics_game_container .WordSlam_container',
			formula:	'100%',
			kids:		[
				{
					selector:	'.container2',
					formula:	'95%',
					kids:		[
						{
							selector:	'.container1',
							formula:	'100%',
							kids:		[
								{
									selector:	'.col1_left',
									formula:	'95%',
									kids:		[
										{
											selector:	'.matching_container_content',
											formula:	function (oElement, dBaseHeight, sSelector) {
												oSelf.scrollBars.push(sSelector);
												return '92%';
											}
										}
									]
								}, {
									selector:	'.col1_right',
									formula:	function (oElement, dBaseHeight) {
										return Math.round(dBaseHeight);
									},
									kids:		[
										{
											selector:	'.word_matching_area',
											formula:	function (oElement, dBaseHeight) {
												var dSubtrahend = 0;
												for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
													dSubtrahend += (
														$(oElement).siblings().eq(iIdx).height() +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
													);
												}
												return (dBaseHeight - dSubtrahend);
											},
											kids:		[
												{
													selector:	'.word-families',
													formula:	function (oElement, dBaseHeight, sSelector) {
														oSelf.scrollBars.push(sSelector);
														var dSubtrahend = 0;
														for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
															dSubtrahend += (
																$(oElement).siblings().eq(iIdx).height() +
																parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
															);
														}
														dSubtrahend += 4; // Found by inspection
														return (dBaseHeight - dSubtrahend).toFixed(2) + 'px';
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	/*== End Added to facilitate resize ==*/
	
	/*==== Gather Correct Answers ====*/
	oSelf.correctAnswers = _.groupBy(
		oSelf.model.questions['0'].drop_options,
		function (oDropOption) {
			return oDropOption['family'];
		}
	);
	for (var sFamily in oSelf.correctAnswers) {
		oSelf.correctAnswers[sFamily] = _.pluck(oSelf.correctAnswers[sFamily], 'answer');
	}
	/*== End Gather Correct Answers ==*/
	
	oSelf.render();
	oSelf.bindEvents();
	oSelf.resize();
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES);
	}
};

WordFamiliesView.getConstantsRef = function () {
	return ASSIGNMENTS;
};

WordFamiliesView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

WordFamiliesView.retrieveStatus = function (oSavedData) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	
	if (typeof oSavedData == 'undefined' || oSavedData == null) {
		oSavedData = oSelf.fetchAttemptData();
	}
	
	if (!isObjectEmpty(oSavedData)) {
		var sDropBoxSelector = '#' + sSlideId + ' .dropbox .myButtoninner';
		for (var iKey in oSavedData) {
			$('' + sDropBoxSelector).filterByData('index', iKey).parent().addClass('draggable_box');
		}
	}
};

WordFamiliesView.fetchAttemptData = function () {
	var oSelf = this,
		oSavedData = {};
	
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		for (var mixKey in AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData) {
			/*==== Handle Question ID in Slide Input Data ====*/
			if (mixKey == ASSIGNMENTS.c_s_KEY_QUESTION_ID) {
				continue;
			}
			/*== End Handle Question ID in Slide Input Data ==*/
			var iKey = mixKey;
			oSavedData[iKey] = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[iKey].answer;
		}
	}
	return oSavedData;
};

WordFamiliesView.render = function () {
	var oSelf = this,
		oSavedData = {},
		sSlideId = oSelf.getSlideDomId();
	
	/*==== Fetch Attempt Data ====*/
	oSavedData = oSelf.fetchAttemptData();
	/*== End Fetch Attempt Data ==*/
	
	/*==== Sort Questions by Family ====*/
	var aFamilies = _.uniq(_.pluck(oSelf.model.questions['0'].drop_options, 'family'));
	oSelf.model.questions['0'].drop_options = _.sortBy(
		oSelf.model.questions['0'].drop_options,
		function (oDropOption) {
			return $.inArray(oDropOption.family, aFamilies);
		}
	);
	aQuestions = oSelf.model.questions;
	/*== End Sort Questions by Family ==*/
	
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES).html(),
			{
				'data':			aQuestions,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	sSlideId,
				'slideType':	oSelf.model.type,
				'savedData':	oSavedData,
				'CONSTANTS':	oSelf.getConstantsRef()
			}
		)
	);
	oSelf.retrieveStatus();
	AssignmentsView.hideMainLoader();
};

WordFamiliesView.resize = function () {
	var oSelf = this;
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + oSelf.getSlideDomId()).css('width', '100%');
	/*== End ???? ==*/
	
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	
	/*==== Enable Custom Scrollbar ====*/
	setTimeout(function () {
		var aScrollBars = oSelf.scrollBars.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.scrollBars.setInstance(aScrollBars[iI]);
		}
	}, 500);
	/*== End Enable Custom Scrollbar ==*/
	
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
};

WordFamiliesView.bindEvents = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_FAMILIES_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			oSelf.updateAttemptData(true); // bIsSubmitted = true			
			
			$.monitor({
				'if':			function () {					
					return ((typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0)  || 
						($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY));
				},
				'beforeStart':	function () {
				},
				'interval':		500,
				'then':			function () {
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {							
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);						
					}
					else {							
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});
		});
		
	oSelf.makeBoxDraggable();

	/*==== Remove Used Tiles ====*/
	oDragAndDrop.imposeDroppable(
		'#' + sSlideId + ' #word-families-word-bank',
		{
			accept:		'#' + sSlideId + ' .col1_right .draggable_box',
			hoverClass:	'ui-state-hover'
		},
		function (oEvent, oUi) {
			oUi.draggable
				.removeClass('drop draggable_box')
				.addClass('blank')
				.find('.myButtoninner')
					.text(ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL);
			
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_FAMILIES_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			setTimeout(function () {
				oDragAndDrop.removeDraggable(oUi.draggable);
			}, 0);
			
			oSelf.updateAttemptData();
		}
	);
	/*== End Remove Used Tiles ==*/
	
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
};
	
WordFamiliesView.makeBoxDraggable = function () {
	var oSelf = this,
		oDraggableBox = '#' + oSelf.getSlideDomId() + ' .draggable_box';
	
	$(oDraggableBox).css('touch-action', 'none');
	
	oDragAndDrop.imposeDraggable(
		oDraggableBox,
		{
			helper:	function () {
				var oClone = $(this).clone(true);
				oClone.css({
					'margin-top': '2%',
					'margin-left': '8px'
				});
				return oClone;
			},
			start:	function () {
				var aScrollBars = oSelf.scrollBars.getScrollBars();
				
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
				}
			},
			containment:	'#' + sSlideId + ' .container2'
		},
		function () {
			var aScrollBars = oSelf.scrollBars.getScrollBars();
			
			for (var iI = 0; iI < aScrollBars.length; iI++) {
				oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
			}
		}
	);
	
	WordFamiliesView.makeDroppable();
};
        
WordFamiliesView.enableDisableButton = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
		
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		if ($('' + sDropBoxSelector).eq(iIndex).text().trim() == ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL) {
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_FAMILIES_SUBMIT_ANSWER_ID)
				.prop('disabled', true)
				.addClass('disabled')
				.addClass('btndisabled');
			return;
		}
	}
	
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_FAMILIES_SUBMIT_ANSWER_ID)
		.prop('disabled', false)
		.removeClass('disabled')
		.removeClass('btndisabled');
};

WordFamiliesView.makeDroppable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .dropbox .myButtoninner',
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box',
		sDropCallback = function(oEvent, oUi) {
			var oDropBox = $(this),
				oDragBox = oUi.draggable,
				sDraggedText = oDragBox.text().trim(),
				sTextAtDropBox = oDropBox.text().trim(),
				bRemoveDraggableFromDragBox = false,
				sCurrentFamily = $('#' + sSlideId + ' #result-' + oDropBox.data('index') + ' .wordtext_answer').text().trim(),
				bIsDragBox4mRight = $.contains($('#' + sSlideId + ' .col1_right').get(0), oDragBox.get(0));
				
			/*==== Stop repitition of same word ====*/
			if (!bIsDragBox4mRight) { // Source: Left
				var aDropBoxes = $('' + sDropBoxSelector).filterByData('family', sCurrentFamily),
					aExistingTiles = [];
				for (var iIndex = 0; iIndex < aDropBoxes.length; iIndex++) {
					var sTile = aDropBoxes.eq(iIndex).text().trim();
					if (sTile.toLowerCase() == ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL.toLowerCase()) {
						continue;
					}
					aExistingTiles.push(sTile.toLowerCase());
				}
				if ($.inArray(sDraggedText.toLowerCase(), aExistingTiles) > -1) { // Drop family contains tile
					return false;
				}
			}
			else { // Source: Right
				if (sCurrentFamily.toLowerCase() != oDragBox.find('.myButtoninner').data('family').toLowerCase()) {
					var aDropBoxes = $('' + sDropBoxSelector).filterByData('family', sCurrentFamily),
						aExistingTiles = [];
					for (var iIndex = 0; iIndex < aDropBoxes.length; iIndex++) {
						var sTile = aDropBoxes.eq(iIndex).text().trim();
						if (sTile.toLowerCase() == ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL.toLowerCase()) {
							continue;
						}
						aExistingTiles.push(sTile.toLowerCase());
					}
					if ($.inArray(sDraggedText.toLowerCase(), aExistingTiles) > -1) { // Drop family contains tile
						return false;
					}
				}
			}
			/*== End Stop repitition of same word ==*/
			
			oDropBox.text(sDraggedText);
			oDropBox.parent().removeClass('blank').addClass('draggable_box');
			
			/*==== If Dragged Element belongs to Droppable Area ====*/
			if (bIsDragBox4mRight === true) {
				oDragBox.find('.myButtoninner').text(sTextAtDropBox);
				if (sTextAtDropBox.toLowerCase() == ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL.toLowerCase()) {
					oDragBox.addClass('blank');
					bRemoveDraggableFromDragBox = true;
				}
			}
			/*== End If Dragged Element belongs to Droppable Area ==*/
			
			oDragAndDrop.removeDroppable(sDropBoxSelector);
			setTimeout(function () {
				oDragAndDrop.removeDraggable(sDragBoxSelector);				
				/*==== If Dragged Element belongs to Droppable Area ====*/
				if (bRemoveDraggableFromDragBox === true) {
					oDragBox.removeClass('draggable_box');
				}
				/*== End If Dragged Element belongs to Droppable Area ==*/
				oSelf.makeBoxDraggable();
			}, 0);
			oSelf.enableDisableButton();
			oSelf.updateAttemptData();
		};
		
	oDragAndDrop.imposeDroppable(sDropBoxSelector, {}, sDropCallback);
};

WordFamiliesView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0,
		sDropBoxSelector = '#' + sSlideId + ' .col1_right .dropbox .myButtoninner',
		iTotalDropBoxes = $('' + sDropBoxSelector).length,
		oCorrectedAnswers = {},
		oSelectedAnswers = {};
		
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		var oDropBox = $('' + sDropBoxSelector).eq(iIndex),
			sSelectedAnswer = oDropBox.text().trim(),
			iAnswerIndex = oDropBox.data('index'),
			sFamily = $('#' + sSlideId + ' #result-' + iAnswerIndex + ' .wordtext_answer').text().trim(),
			aCorrectAnswers = oSelf.correctAnswers[sFamily];
			
		if (sSelectedAnswer.toLowerCase() == ASSIGNMENTS.c_s_WORD_FAMILIES_DROP_LABEL.toLowerCase()) {
			continue;
		}
		
		var sWord = oDropBox.text().trim().toLowerCase() + sFamily.toLowerCase(),
			bCorrectness = (jQuery.inArray(sWord, aCorrectAnswers) > -1);
			
		oSlideInputData[iIndex.toString()] = {
			'answer':		sSelectedAnswer,
			'correctness':	bCorrectness
		};
		if (bIsSubmitted === true) {
			$('#' + sSlideId + ' #result-' + iAnswerIndex).find('[class^="answer_"]').hide();
			$('#' + sSlideId + ' #result-' + iAnswerIndex).find('.answer_' + ((bCorrectness === true)? 'rt': 'wg')).show();
			if (bCorrectness) {
				iCorrectAnswers++;
			}
			/*==== Populate Selected Answers ====*/
			if (
				typeof oSelectedAnswers[sFamily] == 'undefined' ||
				!(oSelectedAnswers[sFamily] instanceof Array)
			) {
				oSelectedAnswers[sFamily] = new Array ();
			}
			oSelectedAnswers[sFamily].push(oDropBox.text().trim().toLowerCase() + sFamily.toLowerCase());
			/*== End Populate Selected Answers ==*/
		}
	}
	
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	oSlideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	AssigmentSlides.studentAttemptData = {
		"itemId": 		sAssignmentId,
		"itemSlides": 	[
			{
				"slideID": sSlideId,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSlideInputData
			}
		],
		'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_WORD_FAMILIES
	};

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	if (bIsSubmitted === true) {
		for (var sFamily in oSelectedAnswers) {
			var aCorrectAnswers = oSelf.correctAnswers[sFamily],
				aSelectedAnswers = oSelectedAnswers[sFamily],
				iCAIndex = 0;
				
			for (var iIndex = 0; iIndex < aSelectedAnswers.length; iIndex++) {
				sSelectedAnswer = aSelectedAnswers[iIndex].toLowerCase();
				if ($.inArray(sSelectedAnswer, aCorrectAnswers) == -1) { // Not found in the list of correct answers
					/*==== Populate Corrected Answers ====*/
					if (
						typeof oCorrectedAnswers[sFamily] == 'undefined' ||
						!(oCorrectedAnswers[sFamily] instanceof Array)
					) {
						oCorrectedAnswers[sFamily] = [];
					}
					
					for (; iCAIndex < aCorrectAnswers.length; iCAIndex++) {
						sCorrectAnswer = aCorrectAnswers[iCAIndex];
						if ($.inArray(sCorrectAnswer, aSelectedAnswers) == -1) {
							oCorrectedAnswers[sFamily].push(sCorrectAnswer);
							iCAIndex++;
							break;
						}
					}
					/*== End Populate Corrected Answers ==*/
				}
			}
		}
		
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		AssigmentSlides.finalScore = iCorrectAnswers * oSelf.weightPerQuestion;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		
		if (!isObjectEmpty(oCorrectedAnswers)) {
			for (var sFamily in oCorrectedAnswers) {
				var aDropBoxes = $('' + sDropBoxSelector).filterByData('family', sFamily),
					aCorrectAnswers = oCorrectedAnswers[sFamily],
					iCorrectAnswerIndex = 0;
				for (var iIndex = 0; iIndex < aDropBoxes.length; iIndex++) {
					var oDropBox = aDropBoxes.eq(iIndex),
						iAnswerIndex = oDropBox.data('index');
						
					if ($('#' + sSlideId + ' #result-' + iAnswerIndex + ' .answer_wg').is(':visible')) {
						var sCorrectAnswer = aCorrectAnswers[iCorrectAnswerIndex++],
							sFamily = $('#' + sSlideId + ' #result-' + iAnswerIndex + ' .wordtext_answer').text().trim(),
							sWord = oDropBox.text().trim() + sFamily;
						$('#' + sSlideId + ' #result-' + iAnswerIndex + ' .wordtext_answer').html('<span class="wrg_ans">' + sWord + '</span>' + sCorrectAnswer);
					}
				}
			}
		}
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(AssigmentSlides.finalScore) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="bottom:60px; min-height:50px; position:absolute; right:15px; width:450px;>\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + (iCorrectAnswers * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			$('#' + sSlideId + ' .word-families').eq(0).after(sResultHtml);
			$('#' + sSlideId + ' .word-families').eq(0).parent().css({ position: 'relative' });
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_FAMILIES_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			try {
				var sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
				oDragAndDrop.removeDroppable(sDropBoxSelector);
				oDragAndDrop.removeDraggable(sDragBoxSelector);
			}
			catch (oException) {};
		});
	}
};

function SyllablesView () {}

SyllablesView.slideIdx = null;
SyllablesView.model = null;
SyllablesView.weightPerQuestion = 1;
SyllablesView.lockedClass = 'locked';
SyllablesView.correctAnswers = {};
SyllablesView.scrollBars = null;

SyllablesView.init = function (slideIdx, model) {
	var oSelf = this,
		sSlideId = '';
	oSelf.slideIdx = slideIdx;
    //Initialize Properties
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	oSelf.correctAnswers = {};
	oSelf.scrollBars = new ScrollBars();
	
	sSlideId = oSelf.getSlideDomId();
	/*==== Added to facilitate resize ====*/
	oSelf.layout = new HeightManager([
		{
			selector:	'#slide_inner_container #' + sSlideId + ' .phonics_game_container .WordSlam_container',
			formula:	'100%',
			kids:		[
				{
					selector:	'.container2',
					formula:	'100%',
					kids:		[
						{
							selector:	'.overflow-scroll',
							formula:	function (oElement, dBaseHeight, sSelector) {
								$(oElement)
									.css({
										'width':		'98%',
										'padding':		'0 1% 1%',
									});
								oSelf.scrollBars.push(sSelector);
								var dSubtrahend = 11; // To accommodate margin
								for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
									dSubtrahend += (
										$(oElement).siblings().eq(iIdx).height() +
										parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
										parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
										parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
										parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
									);
								}
								return (dBaseHeight - dSubtrahend).toFixed(2) + 'px';
							}
						}
					]
				}
			]
		}
	]);
	/*== End Added to facilitate resize ==*/
	
	/*==== Gather Correct Answers ====*/
	oSelf.correctAnswers = _.pluck(oSelf.model.questions['0'].drop_options, 'answer');
	/*== End Gather Correct Answers ==*/
	oSelf.render();
	oSelf.bindEvents();
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES);
	}
};

SyllablesView.getConstantsRef = function () {
	return ASSIGNMENTS;
};

SyllablesView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

SyllablesView.render = function () {
	var oSelf = this,
		oSavedData = {},
		sSlideId = oSelf.getSlideDomId();
	
	/*==== Fetch Attempt Data ====*/
	oSavedData = oSelf.fetchAttemptData();
	/*== End Fetch Attempt Data ==*/
	
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES).html(),
			{
				'data':			oSelf.model.questions,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	sSlideId,
				'slideType':	oSelf.model.type,
				'savedData':	oSavedData,
				'CONSTANTS':	oSelf.getConstantsRef()
			}
		)
	);
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	AssignmentsView.hideMainLoader();
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	oSelf.resize();
};

SyllablesView.fetchAttemptData = function () {
	var oSavedData = {},
		oSlideInputData = {};
		
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		oSavedData = {};
		oSlideInputData = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData;
		
		for (var mixKey in oSlideInputData) {
			/*==== Handle Question ID in Slide Input Data ====*/
			if (mixKey == ASSIGNMENTS.c_s_KEY_QUESTION_ID) {
				continue;
			}
			/*== End Handle Question ID in Slide Input Data ==*/
			var iKey = mixKey;
			oSavedData[iKey] = [];
			for (var iIdx = 0; iIdx < oSlideInputData[iKey].answer.length; iIdx++) {
				oSavedData[iKey].push(oSlideInputData[iKey].answer[iIdx]);
			}
		}
	}
	return oSavedData;
};

SyllablesView.resize = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + sSlideId).css('width', '100%');
	/*== End ???? ==*/
	$('#' + sSlideId + ' [id^="syllables-drop-area-"]').each(function (iIndex) {
		var dSubtrahend = (
				parseFloat($(this).css('padding-top').replace('px', '')) +
				parseFloat($(this).css('padding-bottom').replace('px', ''))
			),
			dAddend = (
				parseFloat($('#' + sSlideId + ' #syllable-bank-' + iIndex).css('padding-top').replace('px', '')) +
				parseFloat($('#' + sSlideId + ' #syllable-bank-' + iIndex).css('padding-bottom').replace('px', ''))
			),
			dHeight = parseFloat($('#' + sSlideId + ' #syllable-bank-' + iIndex).css('height').replace('px', '')) + dAddend - dSubtrahend,
			dMinHeight = 140; // Found by inspection
			
		if (dHeight < dMinHeight) {
			$('#' + sSlideId + ' #syllable-bank-' + iIndex).css('height', (dMinHeight - dAddend).toFixed(2) + 'px');
			dHeight = dMinHeight + dAddend - dSubtrahend;
		}
		$(this).css('height', dHeight.toFixed(2) + 'px');
		if ((iIndex + 1) == $('#' + sSlideId + ' [id^="syllables-drop-area-"]').length) {
			$('#' + sSlideId + ' #syllable-bank-' + iIndex).css('height', (dHeight - dAddend).toFixed(2) + 'px');
		}
	});
	
	/*==== Enable Custom Scrollbar ====*/
	setTimeout(function () {
		var aScrollBars = oSelf.scrollBars.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.scrollBars.setInstance(aScrollBars[iI]);
		}
	}, 500);
	/*== End Enable Custom Scrollbar ==*/
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
};

SyllablesView.bindEvents = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();	
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			var bAllowSubmit = true,
				sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
			
			for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
				if ($('' + sDropBoxSelector).eq(iIndex).text().trim() == ASSIGNMENTS.c_s_SYLLABLES_DROP_LABEL) {
					bAllowSubmit = false;
					break;
				}
			}
			/*=== Ad-hoc Statement ===*/
			bAllowSubmit = true;
			/*= End Ad-hoc Statement =*/
			if (bAllowSubmit) {
				$.monitor({
					'if':			function () {					
						return (
							(
								typeof objStudentAttemptDataResponse != 'undefined' &&
								objStudentAttemptDataResponse != null &&
								objStudentAttemptDataResponse != 0
							) ||
							(
								$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
								$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
								$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
							)
						);
					},
					'beforeStart':	function () {
						oSelf.updateAttemptData(true); // bIsSubmitted = true
					},
					'interval':		500,
					'then':			function () {
						if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
							objStudentAttemptDataResponse.Error == null) {							
							AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);						
						}
						else {							
							AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
							AssigmentSlides.studentAttemptSummary = {};
						}
					}
				});
			}
			else {
				oSelf._confirm({
					'title':	'Are you sure?',
					'divId':	'dialog-message',
					'message':	'You&rsquo;ve not attempted all the questions.<br />Are you sure to submit?',
					'yes':		function () {
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
						oSelf.updateAttemptData(true); // bIsSubmitted = true
					}
				});
			}
		});
		
	oSelf.makeBoxDraggable();
	for (var iIdx = 0; iIdx < $('#' + sSlideId + ' [id^="syllable-bank-"]').length; iIdx++) {
		oDragAndDrop.imposeDroppable(
			$('#' + sSlideId + ' #syllable-bank-' + iIdx),
			{
				accept:	'#' + sSlideId + ' #syllables-drop-area-' + iIdx + ' .draggable_box'
			},
			function (oEvent, oUi) {
				var oDraggedElement = oUi.draggable;
				oDraggedElement.find('.myButtoninner').text(ASSIGNMENTS.c_s_SYLLABLES_DROP_LABEL);
				oDraggedElement.removeClass('draggable_box').addClass('blank');
				$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
					.attr('disabled', 'disabled')
					.addClass('disabled btndisabled');
				oSelf.updateAttemptData();
				setTimeout(function () {
					oDragAndDrop.removeDraggable(oDraggedElement);
				}, 0);
			}
		);
	}
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
};
	
SyllablesView.makeBoxDraggable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
		
	$('#' + sSlideId + ' .draggable_box').css('touch-action', 'none');
	
	oDragAndDrop.imposeDraggable(
		'#' + sSlideId + ' .draggable_box',
		{
			helper:	function () {
				var oClone = $(this).clone(true);
				oClone.css({
					'margin-top': '2%',
					'margin-left': '8px'
				});
				return oClone;
			},
			start:	function (poEvent, poUI) {
				var aScrollBars = oSelf.scrollBars.getScrollBars();
				
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
				}
			},
			containment:	'#' + sSlideId + ' .container2'
		},
		function () {
			var aScrollBars = oSelf.scrollBars.getScrollBars();
			
			for (var iI = 0; iI < aScrollBars.length; iI++) {
				oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
			}
		}
	);
	
	oSelf.makeDroppable();
};
        
SyllablesView.enableDisableButton = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
		
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		if ($('' + sDropBoxSelector).eq(iIndex).text().trim() == ASSIGNMENTS.c_s_SYLLABLES_DROP_LABEL) {
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
				.prop('disabled', true)
				.addClass('disabled')
				.addClass('btndisabled');
			return;
		}
	}
	
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
		.prop('disabled', false)
		.removeClass('disabled')
		.removeClass('btndisabled');
};

SyllablesView.makeDroppable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .dropbox .myButtoninner',
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box',
		sDropCallback = function(oEvent, oUi) {
			var oSelectedAnswers = {},
				oDropBox = $(this),
				oDragBox = oUi.draggable,
				sDraggedText = oDragBox.text(),
				sTextAtDropBox = oDropBox.text(),
				bRemoveDraggableFromDragBox = false,
				bIsDragBox4mRight = $.contains($('#' + sSlideId + ' .col1_right').get(0), oDragBox.get(0));
				
			oDropBox.text(sDraggedText);
			oDropBox.parent().removeClass('blank').addClass('draggable_box');
			
			/*==== If Dragged Element belongs to Droppable Area ====*/
			if (bIsDragBox4mRight === true) {
				oDragBox.find('.myButtoninner').text(sTextAtDropBox);
				if (sTextAtDropBox.trim().toLowerCase() == ASSIGNMENTS.c_s_SYLLABLES_DROP_LABEL.toLowerCase()) {
					oDragBox.addClass('blank');
					bRemoveDraggableFromDragBox = true;
				}
			}
			/*== End If Dragged Element belongs to Droppable Area ==*/
			
			oDragAndDrop.removeDroppable(sDropBoxSelector);
			setTimeout(function () {
				oDragAndDrop.removeDraggable(sDragBoxSelector);				
				/*==== If Dragged Element belongs to Droppable Area ====*/
				if (bRemoveDraggableFromDragBox === true) {
					oDragBox.removeClass('draggable_box');
				}
				/*== End If Dragged Element belongs to Droppable Area ==*/
				oSelf.makeBoxDraggable();
			}, 0);
			oSelf.enableDisableButton();
			oSelf.updateAttemptData();
		};
	for (var iIndex in oSelf.model.questions) {
		for (var iJ = 0; iJ < oSelf.model.questions[iIndex].drop_options.length; iJ++) {
			(function (iDataIndex) {
				var sDropBoxSelector = '#' + sSlideId + ' #syllables-drop-area-' + iDataIndex + ' .myButtoninner';
				oDragAndDrop.imposeDroppable(
					sDropBoxSelector,
					{
						accept:	function (oDraggable) {
							return (oDraggable.data('index') == iDataIndex);
						}
					},
					sDropCallback
				);
			})(iJ);
		}
	}
};

SyllablesView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .col1_right .dropbox .myButtoninner',
		iTotalQuestions = $('#' + sSlideId + ' [id^="syllables-drop-area-"]').length,
		oCorrectedAnswers = {},
		oSelectedAnswers = {};
		
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iQIndex in oSelf.model.questions) {
		for (var iIndex = 0; iIndex < oSelf.model.questions[iQIndex].drop_options.length; iIndex++) {
			var aSelectedAnswer = new Array (),
				bCorrectness = true,
				iAnswerIndex = iIndex,
				aCorrectAnswers = new Array ();
			
			/*==== Compute Correctness ====*/
			for (var iJ = 0; iJ < oSelf.model.questions[iQIndex].drop_options[iIndex].answer.length; iJ++) {
				var sSelectedAnswer = $('#' + sSlideId + ' #syllables-drop-area-' + iIndex + ' .myButtoninner').eq(iJ).text().trim();
				/*==== Gather Selected Answers ====*/
				if (sSelectedAnswer.toLowerCase() === ASSIGNMENTS.c_s_SYLLABLES_DROP_LABEL.toLowerCase()) {
					sSelectedAnswer = '';
				}
				aSelectedAnswer.push(sSelectedAnswer);
				/*== End Gather Selected Answers ==*/
				
				/*==== Gather Correct Answers ====*/
				aCorrectAnswers.push(oSelf.model.questions[iQIndex].drop_options[iIndex].answer[iJ]);
				/*== End Gather Correct Answers ==*/
				
				if (sSelectedAnswer.toLowerCase() != oSelf.model.questions[iQIndex].drop_options[iIndex].answer[iJ].toLowerCase()) {
					if (bCorrectness === true) {
						bCorrectness = false;
					}
				}
			}
			/*== End Compute Correctness ==*/
			
			oSlideInputData[iIndex.toString()] = {
				'answer':		aSelectedAnswer,
				'correctness':	bCorrectness
			};
			
			if (bIsSubmitted === true) {
				$('#' + sSlideId + ' #result-' + iAnswerIndex).find('[class^="answer_"]').hide();
				$('#' + sSlideId + ' #result-' + iAnswerIndex).find('.answer_' + ((bCorrectness === true)? 'rt': 'wg')).show();
				if (bCorrectness) {
					iCorrectAnswers++;
				}
				else {
					$('#' + sSlideId + ' #result-' + iAnswerIndex + ' .wordtext_answer').html('<span class="wrg_ans">\
							' + aSelectedAnswer.join('/') + '\
						</span>\
						' + aCorrectAnswers.join('/')
					);
				}
			}
		}
	}
	
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	oSlideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	AssigmentSlides.studentAttemptData = {
		"itemId": 		sAssignmentId,
		"itemSlides": 	[
			{
				"slideID": sSlideId,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSlideInputData
			}
		],
		'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_SYLLABLES
	};

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	if (bIsSubmitted === true) {
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		AssigmentSlides.finalScore = iCorrectAnswers * oSelf.weightPerQuestion;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(iCorrectAnswers * oSelf.weightPerQuestion) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="bottom:60px; min-height:50px; position:absolute; right:15px; width:450px;">\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + (iCorrectAnswers * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalQuestions * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_SYLLABLES_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			
			$('#' + sSlideId + ' .overflow-scroll').eq(0).after(sResultHtml);
			$('#' + sSlideId + ' .container2').eq(0).css({ position: 'relative' });
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			
			try {
				var sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
				oDragAndDrop.removeDroppable(sDropBoxSelector);
				oDragAndDrop.removeDraggable(sDragBoxSelector);
			}
			catch (oException) {};
		});
	}
};

SyllablesView.prepare4View = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	/*==== IPP-2144 ====*/
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true);
	}
	/*== End IPP-2144 ==*/
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_SYLLABLES_SUBMIT_ANSWER_ID)
		.off('click tap')
		.addClass('btndisabled disabled')
		.attr('disabled', true);
		
	oDragAndDrop.removeDraggable('#' + sSlideId + ' .draggable_box');
};

function WordSortView () {}

WordSortView.slideIdx = null;
WordSortView.model = null;
WordSortView.weightPerQuestion = 1;
WordSortView.lockedClass = 'locked';
WordSortView.correctAnswers = {};
WordSortView.scrollBars = null;

WordSortView.init = function (slideIdx, model) {
	var oSelf = this,
		sSlideId = '';
    // Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	oSelf.correctAnswers = {};
	oSelf.scrollBars = new ScrollBars();
	
	sSlideId = oSelf.getSlideDomId();
	/*==== Added to facilitate resize ====*/
	oSelf.layout = new HeightManager([
		{
			selector:	'#slide_inner_container #' + sSlideId + ' .phonics_game_container .WordSlam_container',
			formula:	'100%',
			kids:		[
				{
					selector:	'.container2',
					formula:	'95%',
					kids:		[
						{
							selector:	'.container1',
							formula:	'100%',
							kids:		[
								{
									selector:	'.col1_left',
									formula:	'95%',
									kids:		[
										{
											selector:	'.matching_container_content',
											formula:	function (oElement, dBaseHeight, sSelector) {
												oSelf.scrollBars.push(sSelector);
												return '92%';
											}
										}
									]
								}, {
									selector:	'.col1_right',
									formula:	'100%',
									kids:		[
										{
											selector:	'.word_matching_area',
											formula:	function (oElement, dBaseHeight) {
												var dSubtrahend = 0;
												for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
													dSubtrahend += (
														$(oElement).siblings().eq(iIdx).height() +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
														parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
													);
												}
												return (dBaseHeight - dSubtrahend).toFixed(2) + 'px';
											},
											kids:		[
												{
													selector:	'.word-sort',
													formula:	function (oElement, dBaseHeight, sSelector) {
														oSelf.scrollBars.push(sSelector);
														var dSubtrahend = 0;
														for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
															dSubtrahend += (
																$(oElement).siblings().eq(iIdx).height() +
																parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
																parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
															);
														}
														return (dBaseHeight - dSubtrahend).toFixed(2) + 'px';
													}
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]);
	/*== End Added to facilitate resize ==*/
	
	/*==== Gather Correct Answers ====*/
	oSelf.correctAnswers = _.groupBy(
		oSelf.model.questions['0'].drop_options,
		function (oDropOption) {
			return oDropOption['family'];
		}
	);
	for (var sFamily in oSelf.correctAnswers) {
		oSelf.correctAnswers[sFamily] = _.pluck(oSelf.correctAnswers[sFamily], 'answer');
		for (var iI = 0; iI < oSelf.correctAnswers[sFamily].length; iI++) {
			oSelf.correctAnswers[sFamily][iI] = oSelf.correctAnswers[sFamily][iI].toLowerCase();
		}
	}
	/*== End Gather Correct Answers ==*/
	
	oSelf.render();
	oSelf.bindEvents();
	oSelf.resize();
	
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT);
	}
};

WordSortView.getConstantsRef = function () {
	return ASSIGNMENTS;
};

WordSortView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

WordSortView.fetchAttemptData = function () {
	var oSelf = this,
		oSavedData = {};
	
	if ((AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) != null) {
		for (var mixKey in AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData) {
			/*==== Handle Question ID in Slide Input Data ====*/
			if (mixKey == ASSIGNMENTS.c_s_KEY_QUESTION_ID) {
				continue;
			}
			/*== End Handle Question ID in Slide Input Data ==*/
			var iKey = mixKey;
			oSavedData[iKey] = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData[iKey].answer;
		}
	}
		
	return oSavedData;
};

WordSortView.render = function () {
	var oSelf = this,
		oSavedData = oSelf.fetchAttemptData(),
		aUsedWords = [];
	
	/*==== Sort Questions by Family ====*/
	var aFamilies = _.uniq(_.pluck(oSelf.model.questions['0'].drop_options, 'family'));
	
	oSelf.model.questions['0'].drop_options = _.sortBy(
		oSelf.model.questions['0'].drop_options,
		function (oDropOption) {
			return $.inArray(oDropOption.family, aFamilies);
		}
	);
	
	aQuestions = oSelf.model.questions;
	/*== End Sort Questions by Family ==*/
	
	for (var iQIndex in oSavedData) {
		aUsedWords.push(oSavedData[iQIndex].toLowerCase());
	}
	
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT).html(),
			{
				'data':			aQuestions,
				'mediaPath':	AssigmentSlides.mediaPath,
				'referenceKey':	oSelf.getSlideDomId(),
				'slideType':	oSelf.model.type,
				'savedData':	oSavedData,
				'usedWords':	aUsedWords,
				'CONSTANTS':	oSelf.getConstantsRef()
			}
		)
	);
	oSelf.retrieveStatus();
	
	AssignmentsView.hideMainLoader();
};

WordSortView.prepare4View = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
		
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true); // bIsSubmitted = true
	}
	
	oDragAndDrop.removeDraggable(sDragBoxSelector);
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_SORT_SUBMIT_ANSWER_ID)
		.off('click tap')
		.attr('disabled', true)
		.addClass('btndisabled disabled');
};

WordSortView.resize = function () {
	var oSelf = this;
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + oSelf.getSlideDomId()).css('width', '100%');
	/*== End ???? ==*/
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	/*==== Enable Custom Scrollbar ====*/
	setTimeout(function () {
		var aScrollBars = oSelf.scrollBars.getScrollBars();
		for (var iI = 0; iI < aScrollBars.length; iI++) {
			oSelf.scrollBars.setInstance(aScrollBars[iI]);
		}
	}, 500);
	/*== End Enable Custom Scrollbar ==*/
	
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
	
	// Set Column Widths
	var fRightContWidth = $(".WordSlam_container .col1_right").innerWidth(),
		fPaddingHead = parseInt($(".WordSlam_container .header_word_wrap .f-right").css("padding")) * 4,
		fPaddingBody = parseInt($(".WordSlam_container .word_matching_area .f-right").css("padding-left")) * 2,
		fWidthHead = Math.ceil((fRightContWidth - fPaddingHead)/2 - 5),
		fWidthBody = Math.ceil((fRightContWidth - fPaddingBody)/2 - 10);
	
	$(".WordSlam_container .header_word_wrap .f-left").css({"width": fWidthHead + 'px'});	
	$(".WordSlam_container .header_word_wrap .f-right").css({"width": fWidthHead + 'px'});	
	$(".WordSlam_container .word_matching_area .f-left").css({"width": fWidthBody + 'px'});	
	$(".WordSlam_container .word_matching_area .f-right").css({"width": fWidthBody + 'px'});	
};

WordSortView.prepareWordBankHtml = function (aWords, aUsedWords) {
	var oSelf = this,
		sWordBankHtml = '';
	if (
		typeof aUsedWords == 'undefined' ||
		!(aUsedWords instanceof Array)
	) {
		aUsedWords = [];
	}
	for (var iIndex = 0; iIndex < aWords.length; iIndex++) {
		if ($.inArray(aWords[iIndex].toLowerCase(), aUsedWords) > -1) {
			continue;
		}
		sWordBankHtml += '<div class="myButton draggable_box">\
			<div class="myButtoninner">\
				' + aWords[iIndex] + '\
			</div>\
		</div>';
	}
	
	return sWordBankHtml;
};

WordSortView.bindEvents = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();	
		
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_SORT_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			oSelf.updateAttemptData(true); // bIsSubmitted = true			
			
			$.monitor({
				'if':			function () {					
					return (
						(
							typeof objStudentAttemptDataResponse != 'undefined' && 
							objStudentAttemptDataResponse != null && 
							objStudentAttemptDataResponse != 0
						) ||
						(
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
							$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
						)
					);
				},
				'beforeStart':	function () {
				},
				'interval':		500,
				'then':			function () {					
					if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
						objStudentAttemptDataResponse.Error == null) {						
						AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);						
					}
					else {						
						AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
						AssigmentSlides.studentAttemptSummary = {};
					}
				}
			});	
		});
		
	oSelf.makeBoxDraggable();
	oDragAndDrop.imposeDroppable(
		'#' + sSlideId + ' #word-bank',
		{
			accept:		'#' + sSlideId + ' .col1_right .draggable_box',
			hoverClass:	'ui-state-hover'
		},
		function (oEvent, oUi) {
			var oWordBank = $(this),
				oDragBox = oUi.draggable,
				sDraggedText = oDragBox.text().trim(),
				iSkipWords = 0,
				iWordIndex,
				aWords = _.uniq(_.pluck(oSelf.model.questions['0'].drag_options, 'word')),
				aCurrentWordBank = [],
				sWordBankHtml = '',
				aUsedWords = [],
				sDropBoxSelector = '#' + sSlideId + ' .col1_right .dropbox .myButtoninner';
				
			for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
				var sUsedWord = $('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase();
				if (
					sUsedWord != ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL.toLowerCase() &&
					sUsedWord != sDraggedText.toLowerCase()
				) {
					aUsedWords.push(sUsedWord);
				}
			}
			
			sWordBankHtml = oSelf.prepareWordBankHtml(aWords, aUsedWords);
			
			if (sWordBankHtml.length > 0) {
				oDragAndDrop.removeDroppable(sDropBoxSelector);
				setTimeout(function () {
					oDragAndDrop.removeDraggable('#' + sSlideId + ' .draggable_box');
					
					oWordBank.html(sWordBankHtml);
					
					oDragBox.removeClass('draggable_box drop').addClass('blank');
					oDragBox.find('.myButtoninner').text(ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL);
					oDragBox.find('.myButtoninner').removeData('index');
					oDragBox.find('.myButtoninner').removeData('family');
					
					oSelf.enableDisableButton();
					oSelf.makeBoxDraggable();
					
					oSelf.updateAttemptData();
				}, 0);
			}
		}
	);
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
};
	
WordSortView.makeBoxDraggable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();	
	
	$('#' + sSlideId + ' .draggable_box').css('touch-action', 'none');
	
	oDragAndDrop.imposeDraggable(
		'#' + sSlideId + ' .draggable_box',
		{
			helper:	function () {
				var oClone = $(this).clone(true);
				oClone.css({
					'margin-top': '2%',
					'margin-left': '8px'
				});
				return oClone;
			},
			start:	function () {
				var aScrollBars = oSelf.scrollBars.getScrollBars();
				
				for (var iI = 0; iI < aScrollBars.length; iI++) {
					try {
						oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('disable');
					}
					catch (e) {
						//console.log(e);						
					}
				}
			},
			containment:	'#' + sSlideId + ' .container2'
		},
		function () {
			var aScrollBars = oSelf.scrollBars.getScrollBars();
				
			for (var iI = 0; iI < aScrollBars.length; iI++) {
				oSelf.scrollBars.getInstance(aScrollBars[iI]).mCustomScrollbar('update');
			}
		}
	);
	
	oSelf.makeDroppable();
};
        
WordSortView.enableDisableButton = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .matching_container_answer .dropbox .myButtoninner';
		
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		if ($('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase() == ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL.toLowerCase()) {
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_SORT_SUBMIT_ANSWER_ID)
				.prop('disabled', true)
				.addClass('disabled')
				.addClass('btndisabled');
			return;
		}
	}
	
	$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_SORT_SUBMIT_ANSWER_ID)
		.prop('disabled', false)
		.removeClass('disabled')
		.removeClass('btndisabled');
};

WordSortView.retrieveStatus = function (oSavedData) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
	if (
		typeof oSavedData == 'undefined' ||
		oSavedData == null
	) {
		/*==== Fetch Attempt Data ====*/
		oSavedData = oSelf.fetchAttemptData();
		/*== End Fetch Attempt Data ==*/
	}
	
	if (!isObjectEmpty(oSavedData)) {
		var sDropBoxSelector = '#' + sSlideId + ' .dropbox .myButtoninner';
		for (var iQIndex in oSavedData) {
			$('' + sDropBoxSelector).filterByData('index', iQIndex).parent().addClass('draggable_box');
		}
	}
};

WordSortView.makeDroppable = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sDropBoxSelector = '#' + sSlideId + ' .dropbox .myButtoninner',
		sDragBoxSelector = '#' + sSlideId + ' .draggable_box',
		sDropCallback = function(oEvent, oUi) {
			var oDragBox = oUi.draggable,
				sText = oDragBox.text().trim(),
				oDropBox = $(this),
				sTextAtDropBox = oDropBox.text().trim(),
				sDragBoxText = sTextAtDropBox,
				bRemoveDraggableFromDragBox = false,
				bIsDragBox4mWordBank = true;
				
			oDropBox.text(sText);
			oDropBox.parent().removeClass('blank').addClass('drop draggable_box');
			
			/*==== If Dragged Element belongs to Droppable Area ====*/
			if ($.contains($('#' + sSlideId + ' .col1_right').get(0), oDragBox.get(0))) {
				oDragBox
					.addClass('dropbox')
						.find('.myButtoninner')
							.text(sDragBoxText);
				if (sTextAtDropBox.toLowerCase() == ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL.toLowerCase()) {
					oDragBox.addClass('blank');
					bRemoveDraggableFromDragBox = true;
				}
				bIsDragBox4mWordBank = false;
				oDragAndDrop.removeDroppable(sDropBoxSelector);
			}
			/*== End If Dragged Element belongs to Droppable Area ==*/
			else if (sTextAtDropBox.toLowerCase() != ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL.toLowerCase()) {
				/*==== We'll have to send the existing tile back to Word Bank ====*/
				var aUsedWords = [],
					sWordBankHtml = '',
					aWords = _.uniq(_.pluck(oSelf.model.questions['0'].drag_options, 'word')),
					oWordBank = $('#' + sSlideId + ' #word-bank');
					
				for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
					var sUsedWord = $('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase();
					if (
						sUsedWord != ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL.toLowerCase() &&
						sUsedWord != sDragBoxText.toLowerCase()
					) {
						aUsedWords.push(sUsedWord);
					}
				}
					
				sWordBankHtml = oSelf.prepareWordBankHtml(aWords, aUsedWords);
					
				if (sWordBankHtml.length > 0) {
					oDragAndDrop.removeDroppable(sDropBoxSelector);
					setTimeout(function () {
						oWordBank.html(sWordBankHtml);
						oSelf.enableDisableButton();
					}, 0);
				}
				else {
					oDragAndDrop.removeDroppable(sDropBoxSelector);
				}
				/*== End We'll have to send the existing tile back to Word Bank ==*/
			}
			
			setTimeout(function () {
				oDragAndDrop.removeDraggable(sDragBoxSelector);
				if (bIsDragBox4mWordBank === true) {
					oDragBox.hide();
				}
				else if (bRemoveDraggableFromDragBox === true) {
					oDragBox.removeClass('draggable_box');
				}
				oSelf.makeBoxDraggable();
			}, 0);
			
			/*==== Enable/ Disable Submit Button ====*/
			oSelf.enableDisableButton();
			/*== End Enable/ Disable Submit Button ==*/
			oSelf.updateAttemptData();
		};
		
	oDragAndDrop.imposeDroppable(
		sDropBoxSelector,
		{},
		sDropCallback
	);
};

WordSortView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId(),
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0,
		sDropBoxSelector = '#' + sSlideId + ' .col1_right .dropbox .myButtoninner',
		iTotalDropBoxes = $('' + sDropBoxSelector).length,
		oCorrectedAnswers = {},
		oSelectedAnswers = {};
		
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
		var oDropBox = $('' + sDropBoxSelector).eq(iIndex),
			sSelectedAnswer = oDropBox.text().trim(),
			iAnswerIndex = oDropBox.data('index'),
			sFamily = oDropBox.data('family').trim(),
			aCorrectAnswers = oSelf.correctAnswers[sFamily];
			
		if (sSelectedAnswer == ASSIGNMENTS.c_s_WORD_SORT_DROP_LABEL) {
			continue;
		}
		
		var sWord = oDropBox.text().trim().toLowerCase(),
			bCorrectness = (aCorrectAnswers.indexOf(sWord) > -1);
			
		oSlideInputData[iIndex.toString()] = {
			'answer':		sSelectedAnswer,
			'correctness':	bCorrectness
		};
		if (bIsSubmitted === true) {
			$('#' + sSlideId + ' #result-' + iAnswerIndex).find('[class^="answer_"]').hide();
			$('#' + sSlideId + ' #result-' + iAnswerIndex).find('.answer_' + ((bCorrectness === true)? 'rt': 'wg')).show();
			if (bCorrectness) {
				iCorrectAnswers++;
			}
			/*==== Populate Selected Answers ====*/
			if (
				typeof oSelectedAnswers[sFamily] == 'undefined' ||
				!(oSelectedAnswers[sFamily] instanceof Array)
			) {
				oSelectedAnswers[sFamily] = new Array ();
			}
			oSelectedAnswers[sFamily].push(oDropBox.text().trim().toLowerCase());
			/*== End Populate Selected Answers ==*/
		}
	}
	
	/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
	oSlideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
	/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
	
	AssigmentSlides.studentAttemptData = {
		"itemId": 		sAssignmentId,
		"itemSlides": 	[
			{
				"slideID": sSlideId,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSlideInputData
			}
		],
		'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_WORD_SORT
	};

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
	
	if (bIsSubmitted === true) {
		for (var sFamily in oSelectedAnswers) {
			var aCorrectAnswers = oSelf.correctAnswers[sFamily],
				aSelectedAnswers = oSelectedAnswers[sFamily],
				iCAIndex = 0;
				
			for (var iIndex = 0; iIndex < aSelectedAnswers.length; iIndex++) {
				sSelectedAnswer = aSelectedAnswers[iIndex].toLowerCase();
				if (jQuery.inArray(sSelectedAnswer, aCorrectAnswers) == -1) { // Not found in the list of correct answers
					/*==== Populate Corrected Answers ====*/
					if (
						typeof oCorrectedAnswers[sFamily] == 'undefined' ||
						!(oCorrectedAnswers[sFamily] instanceof Array)
					) {
						oCorrectedAnswers[sFamily] = [];
					}
					
					for (; iCAIndex < aCorrectAnswers.length; iCAIndex++) {
						sCorrectAnswer = aCorrectAnswers[iCAIndex];
						if ($.inArray(sCorrectAnswer, aSelectedAnswers) == -1) {
							oCorrectedAnswers[sFamily].push(sCorrectAnswer);
							iCAIndex++;
							break;
						}
					}
					/*== End Populate Corrected Answers ==*/
				}
			}
		}
		
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		AssigmentSlides.finalScore = iCorrectAnswers * oSelf.weightPerQuestion;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(AssigmentSlides.finalScore) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		if (!isObjectEmpty(oCorrectedAnswers)) {
			for (var sFamily in oCorrectedAnswers) {
				var aDropBoxes = $('' + sDropBoxSelector).filterByData('family', sFamily),
					aCorrectAnswers = oCorrectedAnswers[sFamily],
					iCorrectAnswerIndex = 0;
				for (var iIndex = 0; iIndex < aDropBoxes.length; iIndex++) {
					var oDropBox = aDropBoxes.eq(iIndex),
						iAnswerIndex = oDropBox.data('index');
						
					if ($('#' + sSlideId + ' #result-' + iAnswerIndex + ' .answer_wg').is(':visible')) {
						$('#' + sSlideId + ' #result-' + iAnswerIndex + ' .wordtext_answer').text(aCorrectAnswers[iCorrectAnswerIndex++])
					}
				}
			}
		}
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="bottom:60px; min-height:50px; position:absolute; right:15px; width:450px;">\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + (iCorrectAnswers * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			$('#' + sSlideId + ' .word-sort').eq(0).after(sResultHtml);
			$('#' + sSlideId + ' .word-sort').eq(0).parent().css({ position: 'relative' });
			$('#' + sSlideId + ' #' + ASSIGNMENTS.c_s_BTN_WORD_SORT_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			$('#' + sSlideId + ' .word-sort').eq(0).animate({
				'scrollTop':	($('.word-sort').eq(0).height() * 3).toString() + 'px'
			}, 500);

			try {
				var sDragBoxSelector = '#' + sSlideId + ' .draggable_box';
				oDragAndDrop.removeDroppable(sDropBoxSelector);
				oDragAndDrop.removeDraggable(sDragBoxSelector);
			}
			catch (oException) {};
		});
	}
};


/*==== PHONIC ROTATING LISTS TEMPLATE ====*/
/**
 * Phonic Rotating Lists Template
 * @method RotatingView
 * @return {undefined}
 */
function RotatingView () {}

/**
 * Phonic Rotating Lists Properties
 */
RotatingView.slideIdx = null;
RotatingView.model = null;
RotatingView.currentSelectedArr = [];
RotatingView.score = 0;
RotatingView.finalSubmit = false;
RotatingView.StudentAttemptData = {};
RotatingView.saveDataInitially = false;
RotatingView.myScroll = null;
RotatingView.weightPerQuestion = 1;

RotatingView.getSlideDomId = function () {
	var oSelf = this;
	return AssigmentSlides.referenceKey + "___" + oSelf.slideIdx;
};

/**
 * Phonic Rotating Lists - Initialize Model
 * @method init
 * @param {Number} slideIdx 
 * @param {Object} model
 * @return {undefined}
 */
RotatingView.init = function (slideIdx, model) {	
    var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;	
	oSelf.score = 0;
	oSelf.finalSubmit = false;
	oSelf.saveDataInitially = false;
	oSelf.myScroll = null;
	oSelf.weightPerQuestion = 1;
	oSelf.controls = {};
	
	oSelf._confirm = ISeriesBase.prototype._confirm;		
	oSelf.render();		
	setTimeout(function(){
		oSelf.bindEvents();
	}, 100);
		
};

RotatingView.fetchAttemptData = function () {
	var oSelf = this,
		oSavedData = null;
		
	oSelf.studentAttemptDataObj = {
		itemSlides:	[]
	};
	
	if (AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem()) {
		oSelf.studentAttemptDataObj = AssigmentSlides.studentAttemptData;
		oSavedData = AssigmentSlides.studentAttemptData.itemSlides.first().slideInputData;
	}	
	return oSavedData;
};

/**
 * Phonic Rotating Lists - Render View 
 * @method render
 * @return {undefined}
 */
RotatingView.render = function () {
	var oSelf = this,
		oSavedData = {},
		sSlideId = oSelf.getSlideDomId();
	
	oSelf.studentAttemptSlideData = oSelf.fetchAttemptData();
	
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS).html(),
			{
				'data':					oSelf.model,
				'mediaPath':			AssigmentSlides.mediaPath,
				'referenceKey':			sSlideId,
				'slideType':			oSelf.model.type,
				'studentAttemptData':	oSelf.studentAttemptSlideData
			}
		)
	);
	AssignmentsView.hideMainLoader();
	oSelf.initSwiperMobile();
	oSelf.loadControls();
	oSelf.saveDataInitially = true;
	oSelf.updateAttemptData();	
	oSelf.resize();
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		var oCurrentSlide = $('#' + sSlideId);
		AssigmentSlides.prepare4View(oCurrentSlide);
	}
};

/**
 * Phonic Rotating Lists - Store Element in Array 
 * @method loadControls
 * @return {undefined}
 */
RotatingView.loadControls = function () {
	var oSelf = this,
		sSlideId = oSelf.getSlideDomId();
		
	oSelf['controls'].submitBtn = $('#' + sSlideId + ' #btnRotatingSubmit');
};

/**
 * Phonic Rotating Lists - Resize View 
 * @method resize
 * @return 
 */	
RotatingView.resize = function () {
	
	var oSelf = this,
			sSlideId = oSelf.getSlideDomId(),
			window_height = $(window).height(),
			header = $("header").outerHeight(),
			actual_height = window_height - header;	
			
	if (AssigmentSlides.assignmentType == ASSIGNMENTS.c_s_TYPE_TPL_FRS) {		
		var phonicstext_direction_height = $('#'+ sSlideId +' .phonicstext_content').outerHeight();
		var frs_heading_height = ($(".study_plain_heading").length) ? $(".study_plain_heading").outerHeight() : 0;
		var frs_ui_tabs_height = ($(".ui_slide_tabs").length) ? $(".ui_slide_tabs").outerHeight() : 0;
				
		var left_box_height = actual_height - (phonicstext_direction_height + frs_heading_height + frs_ui_tabs_height + 60); // margin top bottom 30px
		
		$('#'+ sSlideId +' .WordSlam_container').css("height",left_box_height+'px');			
		
		var top_bottom_gap =  65;
		var margin_top = top_bottom_gap / 2;		
		$('#'+ sSlideId +' .WordSlam_container').css('margin-top', margin_top + 'px');
	}
	
	
	var continent_box_height = $('#'+ sSlideId +' .WordSlam_container').height() - (parseInt($('#'+ sSlideId +' .demo-phone').css('padding-top')) + parseInt($('#'+ sSlideId +' .demo-phone').css('padding-bottom')));
	
	var footer_height = $('#'+ sSlideId +' .WordSlam_container .studyplan_footer').height();	
	
	$('#'+ sSlideId +' .demo-phone .demo-phone-screen').css('height',continent_box_height - footer_height).css('overflow','hidden');
		
	if (RotatingView.myScroll != null) {
		RotatingView.myScroll.refresh();
	}
	else {	
		RotatingView.myScroll = new IScroll('#'+ sSlideId +' .demo-phone-screen', {		
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,				
				fadeScrollbars: true
			});
		
		// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	}
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
	
};

/**
 * Phonic Rotating Lists - Initialize Swiper Mobile 
 * @method initSwiperMobile
 * @return {undefined}
 */
RotatingView.initSwiperMobile = function () {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	
	var swiperTransformStatus = (oSelf.studentAttemptSlideData)?oSelf.studentAttemptSlideData.swiperTransformStatus:[];
	
	$('#'+ slide_id +' .demo-phone .swiper').each(function(){
		// note: $(this) as first parameter will not work in Swiper_mobile()
		Swiper_mobile(document.getElementById($(this).attr('id')),{currentIndex:0}); 		
		
		// render saved data
		var transformArr = _.where(swiperTransformStatus, { 'swiperID' : $(this).attr('id') }),
			swiper_matrix = ((transformArr.length > 0) ? transformArr[0].swiperTransform : ''),
			swiper_pos = swiper_matrix;		
		
		if (swiper_pos != '') {
			$(this).find('.swiper-wrapper').css('transform','translateY('+swiper_pos+'px)');
			$(this).find('.swiper-wrapper').css('-webkit-transform','translateY('+swiper_pos+'px)');			
		}
	});
	
};

/**
 * Phonic Rotating Lists - Bind Events For Elements
 * @method bindEvents
 * @return {undefined}
 */
RotatingView.bindEvents = function () {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	
	$('#'+ slide_id +' #'+ASSIGNMENTS.c_s_BTN_ROTATING_SUBMIT_ANSWER_ID)
		.off("click tap")
		.on("click tap", function () {
			oSelf.submitAnswer();
		});
	
	$('#'+ slide_id +' .demo-phone-screen .swiper-wrapper div')
		.off("touchend mouseout")
		.on("touchend mouseout", function () {
			oSelf.updateAttemptData();
		});
		
	$('#'+ slide_id +' .demo-phone-screen .swiper')
		.off("touchstart mousedown")
		.on("touchstart mousedown", function () {		
			RotatingView.myScroll.disable();
		});
	
	$('#'+ slide_id +' .demo-phone-screen').on("touchstart mousedown", function () {		
		RotatingView.myScroll.enable();
	});

	if (oSelf.studentAttemptSlideData && oSelf.studentAttemptSlideData.SlideSubmitted == 'true') {		
		$('#'+ASSIGNMENTS.c_s_BTN_ROTATING_SUBMIT_ANSWER_ID).trigger("click");
	}
	
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
	
	 // ILIT-915
	 $(document).on('click ' + sWindowsEventType, '.vjs-control-bar .vjs-play-control', function() { 
		if($(this).hasClass('vjs-playing')){
			$("video").each(function(){
				$(this).trigger("pause");
			})
		}
	 });

};

/**
 * Phonic Rotating Lists - Action on Assignment Submit
 * @method submitAnswer
 * @return {undefined}
 */
RotatingView.submitAnswer = function () {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	
	if ($('#'+ slide_id +' #'+ASSIGNMENTS.c_s_BTN_ROTATING_SUBMIT_ANSWER_ID).hasClass(oSelf.disabledClass)) {
		return false;
	}
	$('#'+ slide_id +' .demo-phone-screen .swiper .swiper-wrapper div').removeAttr('style');
	$('#'+ slide_id +' .demo-phone').addClass('locked');
	oSelf.getCurrentSelected();
	
	$('#'+ slide_id +' .demo-phone-screen .correct_answer').show();
	 
	$('#'+ slide_id +' #'+ASSIGNMENTS.c_s_BTN_ROTATING_SUBMIT_ANSWER_ID).addClass(oSelf.disabledClass+" disabled");
	 
	oSelf.updateAttemptData();
	
	if (oSelf.finalSubmit == true && AssigmentSlides.assignmentType != ASSIGNMENTS.c_s_TYPE_TPL_FRS) {
		AssigmentSlides.setAttemptData(0, function () {
			AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
				
			var sHeaderTitle = jQuery('#' + ASSIGNMENTS.c_s_HEADER).text();
			var iTotalDropBoxes = $('.demo-phone-screen .demo-phone-question').length;	
			var sResultHtml = '<div class="msg_content">\
				<div class="correct sprite"></div>\
				<strong>\
					' + sHeaderTitle + ': ' + (oSelf.score * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalDropBoxes * oSelf.weightPerQuestion) + '\
				</strong><br />\
				' + oUtility.printf(ASSIGNMENTS.c_s_WORD_FAMILIES_COMPLETED_STATUS, sHeaderTitle) + '\
			</div>';
					
			$('.demo-phone-screen table').append('<tr><td colspan="3">'+sResultHtml+'</td></tr>');	
			RotatingView.myScroll.enable();
			RotatingView.myScroll.refresh();
			
			RotatingView.myScroll.scrollToElement('.demo-phone-screen .msg_content', 100);
		});
	}
}

/**
 * Phonic Rotating Lists - Fetch Options Selected By User & Evaluate Score
 * @method getCurrentSelected
 * @return {undefined}
 */
RotatingView.getCurrentSelected = function () {
	var oSelf = this,
		slide_id = oSelf.getSlideDomId();
	var swiper_elem_height = parseInt($('#'+ slide_id +' .demo-phone .swiper-wrapper > div').height());	
	
	$('#'+ slide_id +' .demo-phone-screen tr').each(function(){		
		var scored = true;
		$(this).find('.swiper-wrapper').each(function() {
			var swiper_count = $(this).find('div').length;			
			var swiper_matrix = $(this).css('-webkit-transform');
			if (typeof swiper_matrix == 'undefined')
			{
				swiper_matrix = $(this).css('transform');
			}
			var swiper_pos = swiper_matrix.match(/-?[0-9\.]+/g);
			
			if (swiper_pos[5] < 0) {
				var current_selected = 2 - Math.floor(swiper_pos[5]/swiper_elem_height);
			}
			else if (swiper_pos[5] > 0) {
				var current_selected = 2 - Math.floor(swiper_pos[5]/swiper_elem_height);
			}
			else {
				var current_selected = 2;
			}
			
			oSelf.currentSelectedArr[$(this).parent().attr('id')] = current_selected;
			
			var current_elem = $(this).find('div[data-key="'+current_selected+'"]');
			var color = (current_elem.data('correct') == true)?"green":"red";		
			current_elem.css('color',color);
		
			var optscore = (current_elem.data('correct') == true)? 1 : 0;
			if (optscore == 0) {
				scored = false;
			}
		});
		var score = (scored == true)? 1 : 0;
		oSelf.score =  oSelf.score + score;
	});
};

/**
 * Phonic Rotating Lists - Collect Status of Slide & Store in objData Object
 * @method collectAttemptData
 * @return objData
 */
RotatingView.collectAttemptData = function () {	
	var oSelf = this;
	var slide_id = oSelf.getSlideDomId();
	var subSlides = [];	
	var attemptCount = 0;
	var swipertransform = [];
	
	/* iterate each row */
	$("#"+ slide_id +" .demo-phone-screen tr").each(function(){	
		
		$(this).find('.swiper-wrapper').each(function() {
			var swiper_matrix = $(this).css('-webkit-transform');
			if (typeof swiper_matrix == 'undefined')
			{
				swiper_matrix = $(this).css('transform');
			}
			var swiper_pos = swiper_matrix.match(/-?[0-9\.]+/g);
			
			var swiper_pos_elem = (swiper_pos != null && swiper_pos.length > 0 && swiper_pos[5]) ? swiper_pos[5] : 68;
			transformObj = { "swiperID" : $(this).parent().attr('id'), "swiperTransform" : swiper_pos_elem};		
			swipertransform.push(transformObj);	
		});
		
	});
	
	var submitted = ($('#'+ slide_id +' .demo-phone').hasClass('locked'))?'true':'false';
	oSelf.finalSubmit = ($('#'+ slide_id +' .demo-phone').hasClass('locked'))?true:false;
	
	var objData = {											
					"swiperTransformStatus": swipertransform,						
					"SlideSubmitted": submitted						
				};	
	
	return objData;
};

/**
 * Phonic Rotating Lists - Update studentAttemptData Object
 * @method updateAttemptData
 * @return {undefined}
 */
RotatingView.updateAttemptData = function () {	
	var oSelf = RotatingView,	
		subSlideData = oSelf.collectAttemptData(),
		slideAttempt = 1,
		itemId = null,
		oScoreSumary = {},
		oTemplate = {};	
	
	if (oSelf.studentAttemptDataObj != null) {	
		slideAttempt = (typeof oSelf.studentAttemptDataObj.itemSlides[0] != 'undefined') ? oSelf.studentAttemptDataObj.itemSlides[0].slideAttempt + 1 : 1;
	}
	
	itemId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);	
	subSlideData = $.extend(true, subSlideData, {"questionId" : itemId});
	AssigmentSlides.studentAttemptData = {
		"itemId": itemId,
		"itemSlides": [
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS,
				"slideAttempt": slideAttempt,
				"slideIsCorrect": null,
				"slideScore":oSelf.score,
				"slideInputData": subSlideData
			}
		],
		"submitStatus": ((oSelf.finalSubmit === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
		"reAssignedStatus": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		"itemType": ASSIGNMENTS.c_s_TYPE_TPL_ROTATING_LISTS
	};
	
	AssigmentSlides.systemScore = (oSelf.finalSubmit == true)?oSelf.score:GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = (oSelf.finalSubmit == true)?oSelf.score:GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.itemComplete = (oSelf.finalSubmit == true)?ASSIGNMENTS.c_s_COMPLETED_STATUS:ASSIGNMENTS.c_s_INCOMPLETED_STATUS;		
	
	oScoreSumary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
	oScoreSumary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = itemId;
	oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = oSelf.score;			
	oScoreSumary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));
	
	AssigmentSlides.studentAttemptSummary = (oSelf.finalSubmit == true) ? oScoreSumary : {};
	
	if (RotatingView.myScroll != null) { 
		// RotatingView.myScroll.enable() 
	};
	
	if (oSelf.saveDataInitially === true) {		
		oSelf.saveDataInitially = false;		
		AssigmentSlides.setAttemptData();		
	}
};

/* 
 * New Type In View Template
 */
NewTypeInView = {
	/**
	 * Type In View Properties
	 */
	'slideIdx' : null,
	'model' : null,
	'submitBtn' : null,
	'printBtn' : null,
	'typeareaText' : null,
	'disabledClass' : 'btndisabled',
	'saveDataInitially' : false,
	'dblClick' : false,
	'_alert' : ISeriesBase.prototype._alert,
	'iPosTop' : 55
};

/**
 * Type In View Methods
 * @method init
 * @param {Number} slideIdx
 * @param {Object} model
 * @return {undefined}
 */
NewTypeInView.init = function (slideIdx, model) {	
	var oSelf = this;
    //Initialize Properties	
	oSelf.slideIdx = slideIdx;
	oSelf.model = model;	
	/*==== Added to facilitate save status ====*/
	oSelf.slideStatus = new (function () {
		var oStatus = {
			'isComplete': false,
			'questionId': AssigmentSlides.questionId
		};
		this.update = function () {
			oStatus['answer'] = {};
			var qId = 0;
			var ques = '';
			var ans = '';
			
			$.each(oSelf['controls'].typeareaText, function(i,obj){
				qId = i+1;
				ques = jQuery('#da_question'+qId).text().trim();
				ans = jQuery('<div/>').html(obj.val()).text().trim();
				
				oStatus['answer'][i] = {
									"ques" : encodeURIComponent(ques),
									"ans" : encodeURIComponent(ans)
									};
			});			
			oStatus['submitButtonEnabled'] = (_.size(oStatus['answer']) > 0);
			oSelf.updateAttemptData();
		};
		this.updateByData = function (oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData();
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
	})();
	/*== End Added to facilitate save status ==*/
	
	AssigmentSlides.sNoteText = '';
	AssigmentSlides.iNoteCnt = 0;
	
	// services call for populating notes & fetching current unit for saving notes under	
	AssigmentSlides.getNoteList('journal', $.trim(AssigmentSlides.referenceKey.split('___')[1]));
	GetUnitWeekDetails();
	
	// Initiate Text Help Feature
	TexthelpSpeechStream.addToolbar("Tablet", "1");
	
	oSelf.controls = {};
    oSelf.render();    
}

/**
 * Description
 * @method render
 * @return {undefined}
 */
NewTypeInView.render = function () {
	var oSelf = this;
	if (AssignmentsView.userType == ASSIGNMENTS.c_s_USER_TYPE_STUDENT) {
		var innerContent = oSelf.model.student_text;
	}
	else {
		var innerContent = oSelf.model.teacher_text;
	}
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET).html(),
			{
				"data":			innerContent,
				"mediaPath":	AssigmentSlides.mediaPath,
				"referenceKey": AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'slideType':	ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET
			}
		)
	);
	
	/* ILIT-1053 : Text Help */
	$("#textHelpDiv").append(
		_.template($("#txtHelpSelectedContentTpl").html())
	);
	$("#" +  ASSIGNMENTS.c_s_SLIDE_CONTAINER).append(
		_.template($("#txtHelpMenuTpl").html(), {
			"oSelf": oSelf
		})
	);
	
	/* Show Text Help Icons */
	$(".header_inner .txtHelpFeature").show();	
	$("header").css({"z-index":"5000"});
	
	/* wrap text to enable text help */
	oSelf.wrapText();
	
	/* load library json & current book info */
	AssignmentsView.loadCurrentBook();
	AssignmentsView.hideMainLoader();
	   
    oSelf.loadControls();
	
	oSelf.bindEvents();	
	
	oSelf.saveDataInitially = true;
	/*==== Regain Previous Status ====*/
	oSelf.retrieveState();	
	/*== End Regain Previous Status ==*/	
	
	//oSelf.resize();
}

/**
 * Wrap text to identify sentence & words
 * @method wrapText
 * @return {undefined}
 */
NewTypeInView.wrapText = function () {
	var oSelf = this;	
	var txt = $('.da_container_box').html();
	
	// break into sentence or para
	txt = returnSentenceSelectionTxt(txt, "sentenceSpan");
	txt = txt.replace(/<z class="sentenceSpan">\s*<\/z>/g,''); 		
	
	// break into words
	var new_txt = returnDraggableTxt(txt, "wordSpan");
	new_txt = new_txt.replace(/<z class="wordSpan"><\/z>/g,'');
	
	$('.da_container_box').html(new_txt);
}

/**
 * Description
 * @method loadControls
 * @return {undefined}
 */
NewTypeInView.loadControls = function () {
	var oSelf = this;
	
	oSelf['controls'].container = $('#' + AssigmentSlides.referenceKey + "___" + oSelf.slideIdx);
	
	oSelf['controls'].submitBtn = $('#' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_SUBMITBTNID);
    oSelf['controls'].printBtn = $('#' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_PRINTBTNID);
	oSelf['controls'].typeareaText = [];
	var i = 0;	
	$('.question_textarea').each(function(){		
		oSelf['controls'].typeareaText[i] = $('#' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_TYPEAREA + (i + 1));
		i++;
	});
	
	oSelf['controls'].inputAnswerBtn = $('#' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_INPUTBTNID);	
};

/**
 * Description
 * @method resize
 * @return {undefined}
 */
NewTypeInView.resize = function () {
	
	var continent_box_height = $('.daily_assignment_content').height();
	var title_height = $('.daily_assignment_title').height();
	var bottom_bar_height = $('.edit_box_title').outerHeight(true);

	var mid_height = continent_box_height - bottom_bar_height - 12;		
	
	$('.da_container_box').css({'height': mid_height+'px','overflow-y':'auto'});
	
}

/**
 * Description
 * @method bindEvents
 * @return {undefined}
 */
NewTypeInView.bindEvents = function () {
	var oSelf = this;
    oSelf['controls'].submitBtn.off("click").on("click", function () {		
		oSelf.submitAnswer(this);
	});
    oSelf['controls'].printBtn.on("click " + sWindowsEventType, function () {
		oSelf.print();
	});
    $('.question_textarea').on("keyup input", function () {
		oSelf.submitEnable();
	});
    $('.question_textarea').on("touchstart", function () {
		oSelf.focusSelection();
	});

	// Book Icon - Show Current Book	
	$("#" +ASSIGNMENTS.c_s_BOOK_ICON).off("click tap").on("click tap", function(){		
		$("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).toggle();
	});	
    
    // Book Icon - Hide Current Book	
	$(".wrapper").off("click tap").on("click tap", function(event){        
        if (event.target.id != ASSIGNMENTS.c_s_BOOK_ICON && $("#"+ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).has(event.target).length == 0) {
		  $("#" +ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
        }
	});	
	
	// Bind view current reading and notebook link	
	$('[id^=' + ASSIGNMENTS.c_s_ASSIGNMENT_VIEW_CURRENTREADING + '_]')
		.off("click tap")
		.on("click tap", function () {
			/*== Check if Writing Exceeding Max Limit ==*/
			if (AssigmentSlides.checkMaxCharLimit()) {
				return;
			}

			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="" />',
				'background-color': 'none',
				'click-to-hide': false,
				'opacity': 0.5
			});
			
			var bookId = $(this).attr('book_id'),
				BookType   =   $(this).attr('book_type'),
				wordCount  =   $(this).attr('word_count'),
				bookTitle  =   $(this).attr('book_title'),
				fileType   =   $(this).attr('file_type'),
				iBookNumPage  = $(this).attr('bookNumPage');
			
			// save data before leaving page
			NewTypeInView.updateAttemptData();
			$.when(AssigmentSlides.setAttemptData()).done(function () {
				AssignmentsView.iLoadTOCScreen = 0;
				
				if (fileType == 'pdf') {
					GetPDFInfo(bookId, bookTitle, BookType, wordCount, iBookNumPage, 'assignment');
					return false;
				}
				
				var sAssignmentId = AssigmentSlides.oAssignmentKeyData['assignmentId'], 
					sItemAttemptId = AssigmentSlides.oAssignmentKeyData['itemAttemptId'], 
					sHeaderTitle = AssigmentSlides.oAssignmentKeyData['headerTitle'], 
					sAssignmentType = AssigmentSlides.oAssignmentKeyData['assignmentType'], 
					sAssignmentSubType = AssigmentSlides.oAssignmentKeyData['assignmentSubType'];
					sReassignCount = AssigmentSlides.oAssignmentKeyData['reassignCount'];
				
				var returnUrl = 'assignment.html' +
					'?assignment-id=' + sAssignmentId +
					'&item-attempt-id=' + sItemAttemptId +
					'&header-title=' + encodeURIComponent(sHeaderTitle) +
					'&assignment-type=' + sAssignmentType +
					'&assignment-sub-type=' + sAssignmentSubType +
					'&study-plan-sub-type=' +
					'&reassignCount=' + sReassignCount +
					'&comment=' + encodeURIComponent($.trim($('#' + ASSIGNMENTS.c_s_SHOW_COMMENT + ' > comment').text()));
					
				sIframeUrl = LIBRARY.c_s_PLAYER_URL +
					bookId + "|||" +
					bookTitle + "|||" +
					BookType + "|||" +
					wordCount + "|||" +
					"assignment|||" +
					fileType + "|||" +
					iBookNumPage + "|||" +
					"context=" + returnUrl;					
							
				setTimeout(function () {
					location.href = sIframeUrl;
				}, 1000);
				
				return false;
			});
		});

	// Bind Text Help Transate Button	
	$('#btnLanguage').off('click').on('click',function(event){
		if ($('#menuLanguage').is(":visible")){
			$("#menuLanguage").hide();
			$(this).removeClass('active');
		} else {
			$("#menuLanguage").show();
			$(this).addClass('active');
		}
		$("#menuFontResize").hide();
		$('#btnFontResize').removeClass('active');
		event.stopPropagation();
	});

	// Bind Text Help Language Selection
	$('.tooltip_wrap_language li').off('click').on('click', function(){
		$('.tooltip_wrap_language li.active').removeClass('active');
		$(this).addClass('active');
		var sLanguage = $(this).attr('lang');
		$rw_setTranslateTarget(sLanguage);
	});
		
	// Bind Text Help Font Button
	$('#btnFontResize').off('click').on('click',function(event){
		if ($('#menuFontResize').is(":visible")) {
			$("#menuFontResize").hide();
			$(this).removeClass('active');
		} else {
			$("#menuFontResize").show();
			$(this).addClass('active');
		}

		$("#menuLanguage").hide();
		$('#btnLanguage').removeClass('active');
		event.stopPropagation();
	});

	// Bind Text Help Font Size
	$('.zooms').off('click').on('click',function(){
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': 'FFFFFF',
			'click-to-hide': false,
			'opacity': 0.5
		});
		$('#btnFontResize').trigger('click');
		try { $rw_stopSpeech(); } catch (e) {};
		$('.zooms.active').removeClass('active');
		$(this).addClass('active');
		setTimeout(function(){
			$('body').attr('class', $('.zooms.active').attr('cssPath'));
			oUtility.hideLoader();
		},500);
	});
	
	// Bind Text Help Word Selection
	$(".da_container_box .wordSpan").off("click").on("click", function(event) {
		event.preventDefault();
		event.stopPropagation();
		
		setTimeout(function(){
			if (!NewTypeInView.dblClick) {
				oSelf.toggleTextHelp.call(this, $(event.target), 'w'); // word selection
			}			
		}, 300);
		return false;
	});	
	
	// Bind Text Help View Note
	$('#imgNotes').off('click').on('click', function(){
		textHelpListNotes();
	});
	
	// Bind Text Help Sentence Selection
	Hammer($(".da_container_box")).off("doubletap").on("doubletap", function(event) {
		event.preventDefault();
		event.stopPropagation();		
		
		NewTypeInView.dblClick = true;
		if ($(event.target).parents("p").length) {
			oSelf.toggleTextHelp.call(this, $(event.target).parents("p"), 'p'); // para selection
		}
		else if ($(event.target).parents(".daily_assignment_title").length) {
			oSelf.toggleTextHelp.call(this, $(event.target).parents(".daily_assignment_title"), 'p');
		}
		else {
			oSelf.toggleTextHelp.call(this, $(event.target).parent(".sentenceSpan"), 's');
		}
		return false;
	});
	
	Hammer($("#textToHelpMenu")).off("tap").on("tap", function(event) {
		NewTypeInView.iPosTop = 55;
	});
	
	$(document).off('click tap').on('click tap', function (event) {	
		// Hide text help tooltip
		if (
			$(event.target).hasClass("wordSpan") || 
			$(event.target).hasClass("textToHelpMenuButtons") || 
			$(event.target).hasClass("sep")
		) {
			event.stopPropagation();
		}
		else {
			$("#textToHelpMenu").hide();			
		}
		
		// Hide language tooltip
		if (
			$(event.target).hasClass("translate-btn")
		) {
			event.stopPropagation();
		}
		else {
			$("#menuLanguage").hide();			
		}
    });
};

/**
 * Bind Text Help
 * @method toggleTextHelp
 * @param {Object} oEvent
 */
NewTypeInView.toggleTextHelp = function (oEventTarget, selectionType) {
	$('.da_container_box .highlight').removeClass('highlight');
	
	oEventTarget.addClass('highlight');	
	
	if ($('#msTextHelp').length == 0) {
		$("#textHelpDiv").append(
			_.template($("#txtHelpSelectedContentTpl").html())
		);
	}

	$('#msTextHelp').html($('.da_container_box .highlight').text());
	$('#msTextHelp').selectText();
	oEventTarget.addClass('highlight');		
	
	$('#textToHelpMenu .textToHelpMenuButtons,#textToHelpMenu .sep').show();
	$('#textToHelpMenu').css('left',0).css('top',0).show();
	
	if (selectionType == 'w') {
		$('#textToHelpMenu .forWord').show();
	}
	else {
		$('#textToHelpMenu .forWord').hide();
	}
	
	try {
		var offset = oEventTarget.offset();
		//offset.top -= NewTypeInView.iPosTop; // for some position issue
		offset.top = offset.top < 0 ? 0 : offset.top;
		var objWid = oEventTarget.width();	
				
		setPosTextHelp(offset,objWid);
	}
	catch (e){ /* console.log(e); */ }
	
	setTimeout(function () { NewTypeInView.dblClick = false; }, 500);
};

/**
 * Description
 * @method focusSelection
 * @param {JavaScript Event Object} oEvent
 * @return {undefined}
 */
NewTypeInView.focusSelection = function (oEvent) {
	var oSelf = this;
	oEvent.stopPropagation();
	oSelf['controls'].typeareaText.focus();
};

/**
 * Description
 * @method submitAnswer
 * @param {HTMLButtonElement} oBttn
 * @return {undefined}
 */
NewTypeInView.submitAnswer = function (oBttn) {
	var oTemplate = {},
		oSelf = this,
		assignmentIdChunks = null,
		assignmentId = null,
		boxId = 0;

    if (oSelf['controls'].submitBtn.hasClass(oSelf.disabledClass)) {
		return false;
	}
	
	/*== Check if Writing Exceeding Max Limit ==*/
	if (AssigmentSlides.checkMaxCharLimit()) {			
		return;
	}
	
	assignmentIdChunks = (AssignmentsView.slideDataValue).split('___');
	assignmentId = assignmentIdChunks[1];
	
	oSelf.slideStatus.update();
	oSelf.slideStatus.updateByData({
		'isComplete':	true
	});
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
	
	AssigmentSlides.studentAttemptSummary = {};
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	oTemplate[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = AssigmentSlides.questionId;
	oTemplate[ASSIGNMENTS.c_s_KEY_SCORE] = 0;			
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push($.extend({}, oTemplate));	
	
	objStudentAttemptDataResponse = 0;	
	AssigmentSlides.setAttemptData();
	
	$.monitor({
		'if':			function () {					
			return (
				(
					typeof objStudentAttemptDataResponse != 'undefined' && 
					objStudentAttemptDataResponse != null && 
					objStudentAttemptDataResponse != 0
				) ||
				(
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
					$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY
				)
			);
		},
		'beforeStart':	function () {
		},
		'interval':		500,
		'then':			function () {
			if ([undefined, null].indexOf(objStudentAttemptDataResponse.Error) !== -1) {
				oSelf['controls'].submitBtn.addClass(oSelf.disabledClass + ' disabled'); 
				oSelf['controls'].printBtn.addClass(oSelf.disabledClass + ' disabled');
				$('.question_textarea').attr('readonly', 'readonly');
				AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
				
				$('#' + ASSIGNMENTS.c_s_BOOK_ICON).off('click tap');		
				$('#' + ASSIGNMENTS.c_s_ASSIGNMENT_CURRENTBOOK_TOOLTIP).hide();
				
				oSelf.AttemptGradeableItemCallback();
			}
			else {
				AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
				AssigmentSlides.studentAttemptSummary = {};
			}
		}
	});
};

/**
 * Description
 * @method updateAttemptData
 * @return {undefined}
 */
NewTypeInView.updateAttemptData = function () {
	var oSelf = this;
	var assignmentIdChunks = (AssignmentsView.slideDataValue).split('___'),
		assignmentId = assignmentIdChunks[1],
		sItemId = assignmentId,
		iSlideAttempt = 1;

	AssigmentSlides.studentAttemptData = {
		"itemId": 		sItemId,
		"itemSlides": 	[
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSelf.slideStatus.getStatus()
			}
		],
		'submitStatus':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_ASSIGNMENT_DAILY_ASSIGNMENT
	};
	AssigmentSlides.studentAttemptSummary = {};	
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;

	if (oSelf.saveDataInitially === true) {
		oSelf.saveDataInitially = false;		
		AssigmentSlides.setAttemptData();		
	}
};

/**
 * Description
 * @method retrieveStatus
 * @return oSlideInfo
 */
NewTypeInView.retrieveStatus = function () {
	var oSelf = this,
		oSlideInfo = {};
		
	if (oSelf.studentAttemptDataObj = AssigmentSlides.getStudentAttemptForGradableItem()) {
		;
	}
	else {		
		oSelf.studentAttemptDataObj = {
			itemSlides:	[]
		};
	}
	
	
	if (oSlideInfo = oSelf.studentAttemptDataObj.itemSlides.length) {		
		oSlideInfo = oSelf.studentAttemptDataObj.itemSlides.first();
		
		if (!('slideInputData' in oSlideInfo)) {
			oSlideInfo = {};
		}
		else {
			oSlideInfo['slideInputData']['isComplete'] = (
				(typeof oSlideInfo['slideInputData']['isComplete'] != 'boolean')?
				(
					typeof oSlideInfo['slideAttempt'] != 'undefined' &&
					oSlideInfo['slideAttempt'] == '1'
				):
				oSlideInfo['slideInputData']['isComplete']
			);
			oSlideInfo = oSlideInfo['slideInputData'];
		}
	}
	else {		
		oSlideInfo = {};
	}	
	return oSlideInfo;
};

/**
 * Description
 * @method retrieveState
 * @return Literal
 */
NewTypeInView.retrieveState = function () {
	var oSelf = this,
		oSlideInfo = oSelf.retrieveStatus();
	
	if (isObjectEmpty(oSlideInfo)) {
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
			var oCurrentSlide = oSelf['controls'].container;
			AssigmentSlides.prepare4View(oCurrentSlide);
		}
		else {
			oSelf.slideStatus.update();
		}		
		return false;
	}
		
	setTimeout(function () {		
		var ans = '';
		$.each(oSelf['controls'].typeareaText, function(i,obj){
			if (typeof oSlideInfo['answer'] != 'undefined') {
				ans =  decodeURIComponent(oSlideInfo['answer'][i].ans);				
				obj.val(jQuery('<div/>').html(ans).text());
			}
		});			
		
		oSelf['controls'].submitBtn.attr('disabled', !oSlideInfo['submitButtonEnabled']);
		if (oSlideInfo['submitButtonEnabled']) {
			oSelf['controls'].submitBtn.removeClass(oSelf.disabledClass);
		}
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
			var oCurrentSlide = oSelf['controls'].container;
			AssigmentSlides.prepare4View(oCurrentSlide);
		}
		AssignmentsView.resize();
		oSelf.slideStatus.updateByData(oSlideInfo);
	}, 100);
	return false;	
	
	oSelf.slideStatus.update();
};

/**
 * Description
 * @method AttemptGradeableItemCallback
 * @return {undefined}
 */
NewTypeInView.AttemptGradeableItemCallback = function () {
	var oSelf = this;
	
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .daily_assignment_ans').append('<div class="msg_content">\
		<div  class="correct sprite"></div>\
		' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_SUCCESS_MSG + '\
	</div>');
	
	// $('.da_container_box').scrollTo(".msg_content",{duration: 500,easing: 'linear'});
	$('.da_container_box').eq(0).animate({
		'scrollTop':	($('.da_container_box').eq(0).height() * 3).toString() + 'px'
	}, 500);
	
};

/**
 * Description
 * @method submitEnable
 * @return {undefined}
 */
NewTypeInView.submitEnable = function () {
	var oSelf = this;
	var val = '';
	$('.question_textarea').each(function(){
		val += $.trim($(this).val());
	});
	
    if (val != '') {
		oSelf['controls'].submitBtn.removeClass(oSelf.disabledClass).removeAttr('disabled');
	}
	else {
		oSelf['controls'].submitBtn.addClass(oSelf.disabledClass).attr('disabled', 'disabled');
	}
	oSelf.slideStatus.update();
};

/**
 * Description
 * @method print
 * @return {undefined}
 */
NewTypeInView.print = function () {};

function WordSlamView () {}

WordSlamView.slideIdx = null;
WordSlamView.model = null;
WordSlamView.weightPerQuestion = 1;
WordSlamView.maxAllowedTiles = 18;
WordSlamView.multiplier = 3;
WordSlamView.minimumNumberOfTilesToBeLeft = 2;
WordSlamView.lockedClass = 'locked';
WordSlamView.correctAnswers = {};
WordSlamView.mySwiper = null;

WordSlamView.init = function (slideIdx, model) {
    var oSelf = this;
    //Initialize Properties
	oSelf.slideIdx = slideIdx;
    oSelf.model = model;
	oSelf._confirm = ISeriesBase.prototype._confirm;
	oSelf.correctAnswers = {};
	
	/*==== Prepare Slides ====*/
	var aSlides = [],
		oSlideInfo = {
			'word-bank':	[],
			'questions':	[],
			'instruction':	oSelf.model.instructions
		},
		aTiles = oSelf.model.tiles,
		aQuestions = oSelf.model.questions,
		iQuestionsInCurrentSlide = 0;
	
	/**
	 *	Rules:
	 *		1)	At most three questions per slide
	 *		2)	Tile bank should consist of the correct answer chunks supplied with the questions
	 *		3)	Number of tiles in tile bank should be multiple of three
	 *		4)	If the number of tiles supplied in form of correct chunks does not make it to be a multiple of three
	 *			the tiles should be accompanied by suggestions.
	 *		5)	At least two tiles should be left after using all the required tiles.
	 */
	for (var iIndex = 0; iIndex < aQuestions.length; iIndex++) {
		var oQuestion = aQuestions[iIndex],
			aAnswers = oQuestion.answer.split(','),
			iNumberOfTilesAtBank = oSlideInfo['word-bank'].length,
			bReachedMaxTiles = ((iNumberOfTilesAtBank + aAnswers.length) > oSelf.maxAllowedTiles);
			
		if (bReachedMaxTiles === false) {
			oSlideInfo['questions'].push(oQuestion);
			for (var iAIndex = 0; iAIndex < aAnswers.length; iAIndex++) {
				oSlideInfo['word-bank'].push(aAnswers[iAIndex]);
			}
			iQuestionsInCurrentSlide++;
		}
		
		if (
			bReachedMaxTiles === true || // Got to a question the answer options of which will spill out of word bank
			iQuestionsInCurrentSlide % oSelf.multiplier == 0 || // Got to a question the number of which a multiple of three
			iIndex == (aQuestions.length - 1) // Got to the last question
		) {
			var iTileIndex = 1,
				iCurrentNumberOfTiles = oSlideInfo['word-bank'].length,
				iRemainingTiles = oSelf.multiplier,
				sTile = '';
				
			if (iCurrentNumberOfTiles % oSelf.multiplier != 0) { // Need more tiles to make the number of tiles multiple of three
				iRemainingTiles = (oSelf.multiplier * Math.ceil(iCurrentNumberOfTiles / oSelf.multiplier)) - iCurrentNumberOfTiles;
			}
			
			while (
				iRemainingTiles < oSelf.minimumNumberOfTilesToBeLeft ||
				(iCurrentNumberOfTiles + iRemainingTiles) % 3 != 0
			) {
				iRemainingTiles++;
			}
			
			for (iTileIndex = 1; iTileIndex <= iRemainingTiles; iTileIndex++) {
				do {
					var iRandomTileIndex = oUtility.getRandomNumberBetween(0, aTiles.length - 1);
					sTile = aTiles[iRandomTileIndex];
				} while (oSlideInfo['word-bank'].indexOf(sTile) > -1);
				oSlideInfo['word-bank'].push(sTile);
			}
			
			oSlideInfo['word-bank'] = oSlideInfo['word-bank'].randomize();
			aSlides.push(oSlideInfo);
			oSlideInfo = {
				'word-bank':	[],
				'questions':	[],
				'instruction':	oSelf.model.instructions
			};
			if (bReachedMaxTiles === true) {
				oSlideInfo['questions'].push(oQuestion);
				for (var iAIndex = 0; iAIndex < aAnswers.length; iAIndex++) {
					oSlideInfo['word-bank'].push(aAnswers[iAIndex]);
				}
			}
		}
	}
	oSelf.slides = aSlides;
	/*== End Prepare Slides ==*/
	
	oSelf.render();
	oSelf.bindEvents();
	
	AssigmentSlides.setStatusToINPROGRESS(); // To set in progress state
};

WordSlamView.initHint = function () {
	var oSelf = this;
		
	try {
		$('#' + ASSIGNMENTS.c_s_SHOW_HINT).parent().remove();
		var sHintHtml = '<div class="toc_toolls_2 right toc_panel_icons" id="' + ASSIGNMENTS.c_s_DIV_WORD_SLAM_SHOW_HINT_CONTAINER_ID + '">\
			<button type="button" class="' + ASSIGNMENTS.c_s_HINT_BUTTON_CLASS + ' sprite right" id="' + ASSIGNMENTS.c_s_SHOW_HINT + '"></button>\
			<div class="toc_tooltip" id="' + ASSIGNMENTS.c_s_DIV_WORD_SLAM_SHOW_HINT_ID + '" style="display:none; width:250px;">\
				<div class="page_arrow sprite"></div>\
				<div class="table_name" style="height:0px; box-shadow:none;">&nbsp;</div>\
				<div class="toc_tooltip_middle" style="max-height:195px; overflow-x:hidden; overflow-y:auto; padding-bottom:1px; z-index:5001;">';
		
		var aHints = [];
		for (var iSlideIndex = 0; iSlideIndex < oSelf.slides.length; iSlideIndex++) {
			for (var iQIndex = 0; iQIndex < oSelf.slides[iSlideIndex].questions.length; iQIndex++) {
				aHints.push(oSelf.slides[iSlideIndex].questions[iQIndex].answer.replace(/[\s,]/g, ''));
			}
		}
			
		/*==== IPP-1570 ====*/
		// aHints = aHints.randomize();
		for (var i = 0; i < aHints.length; i++) {
			var j = i,
				sWord = '';
			sWord = aHints[i];
			for (j = i; j > 0; j--) {
				if (sWord > aHints[j - 1]) {
					break;
				}
				aHints[j] = aHints[j - 1];
			}
			aHints[j] = sWord;
		}
		/*== End IPP-1570 ==*/
			
		for (var iHIndex = 0; iHIndex < aHints.length; iHIndex++) {
			sHintHtml += '<p' + ((iHIndex + 1 == aHints.length)? ' class="last"': '') + '>' + aHints[iHIndex] + '</p>';
		}
		sHintHtml += '</div>\
				<p style="border-radius:0 0 8px 8px; height:0;"> &nbsp; </p>\
			</div>\
		</div>';
		
		if (isIOS(8)) {
			$('.header_inner').css({
				'position':	'fixed',
				'width':	'100%'
			});
			$('.header_inner > .header_innerin').css('position', 'relative');
		}
			
		AssignmentsView.prev.after(sHintHtml);
		$('#' + ASSIGNMENTS.c_s_SHOW_HINT)
			.on('click tap', function () {
				oSelf.showHint(this);
			});
		
		$('#' + ASSIGNMENTS.c_s_DIV_WORD_SLAM_SHOW_HINT_CONTAINER_ID)
			.off('mousedown')
			.on('mousedown', function (oEvent) {
				oEvent.stopPropagation();
			});
	}
	catch (oException) {
		if ($('#' + ASSIGNMENTS.c_s_SHOW_HINT).length > 0) {
			$('#' + ASSIGNMENTS.c_s_SHOW_HINT).off('click tap');
			$('#' + ASSIGNMENTS.c_s_SHOW_HINT).parent().remove();
		}
	}
};

WordSlamView.showHint = function (oButton) {
	var oSelf = this,
		oHintDiv = $(oButton).next('div');
	
	if (oHintDiv.is(':visible') == false) {
		oHintDiv.slideDown('fast', function () {
			$(oButton).addClass('active');
		});
	}
	else {
		oHintDiv.slideUp('fast', function () {
			$(oButton).removeClass('active');
		});
	}
};

WordSlamView.render = function () {
	var oSelf = this,
		oSavedData = {},
		oUsedTiles = {},
		oOccurrences = {};
	
	for (var iSlideId = 0; iSlideId < oSelf.slides.length; iSlideId++) {
		var aTiles = oSelf.slides[iSlideId]['word-bank'];
		
		oOccurrences[iSlideId + 1] = {};
		oUsedTiles[iSlideId + 1] = [];
		
		for (var iIndex = 0; iIndex < aTiles.length; iIndex++) {
			var sTile = aTiles[iIndex];
			
			if (typeof oOccurrences[iSlideId + 1][sTile] == 'undefined') {
				oOccurrences[iSlideId + 1][sTile] = 1;
				continue;
			}
			oOccurrences[iSlideId + 1][sTile]++;
		}
	}
	
	/*==== Fetch Attempt Data ====*/
	AssigmentSlides.studentAttemptData = AssigmentSlides.getStudentAttemptForGradableItem();
	if (AssigmentSlides.studentAttemptData != null) {
		var aSavedData = AssigmentSlides.studentAttemptData.itemSlides;
		for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
			var mixSlideInfo = {};
			oUsedTiles[iSlideId] = [];
			
			if (mixSlideInfo = aSavedData.fetch(iSlideId - 1)) {
				/*==== Handle Question ID in Slide Input Data ====*/
				if (typeof mixSlideInfo.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] != 'undefined') {
					delete mixSlideInfo.slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID];
				}
				/*== End Handle Question ID in Slide Input Data ==*/
				oSavedData[iSlideId] = mixSlideInfo.slideInputData;
				for (var iQIndex in oSavedData[iSlideId]) {
					var aAnswers = oSavedData[iSlideId][iQIndex].answer;
					for (var iAIndex = 0; iAIndex < aAnswers.length; iAIndex++) {
						oUsedTiles[iSlideId].push(aAnswers[iAIndex]);
					}
				}
			}
		}	
	}
	/*== End Fetch Attempt Data ==*/
	
	var oTileBankHtmls = {},
		aUsedTiles = [],
		iFAt = -1;
	
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		aUsedTiles = [];
		oTileBankHtmls[iSlideId] = '';
		
		/*==== Clone Used Tiles for Current Slide ====*/
		for (var iIndex = 0; iIndex < oUsedTiles[iSlideId].length; iIndex++) {
			if (oUsedTiles[iSlideId][iIndex].length > 0) {
				aUsedTiles.push(oUsedTiles[iSlideId][iIndex]);
			}
		}
		/*== End Clone Used Tiles for Current Slide ==*/
		
		for (var iIndex = 0; iIndex < oSelf.slides[iSlideId - 1]['word-bank'].length; iIndex++) {
			var sTile = oSelf.slides[iSlideId - 1]['word-bank'][iIndex];
			
			if (oOccurrences[iSlideId][sTile] == 0) {
				continue;
			}
			
			iOccurCnt = 0;
			iOccurPos = -1;
			
			for (var iJ = 0; iJ < aUsedTiles.length; iJ++) {
				if (aUsedTiles[iJ].toLowerCase() == sTile.toLowerCase()) {
					iOccurCnt++;
					if (iOccurPos == -1) {
						iOccurPos = iJ;
					}
				}
			}
			
			if (iOccurCnt > 0) {
				oOccurrences[iSlideId][sTile]--;
				aUsedTiles.splice(iOccurPos, 1);
				continue;
			}
			
			oTileBankHtmls[iSlideId] += '<div class="myButton draggable_box swiper-no-swiping" id="tile-' + iSlideId + '-' + iIndex + '" data-slide-id="' + iSlideId + '">\
				<div class="myButtoninner">\
					' +  sTile + '\
				</div>\
			</div>';
		}
	}
	
	/* video template render */
	if(AssigmentSlides.introVideo){
		$("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
				_.template(
					$("#" + ASSIGNMENTS.c_s_TYPE_TPL_WORD_STUDY_PRACTICE_VIDEO).html(), {
						'video':			AssigmentSlides.introVideo,
						'mediaPath': 		AssigmentSlides.videoPath,
						'referenceKey': 	AssigmentSlides.referenceKey
					}
				)
			);
	}
	/* video template render */
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$('#' + ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM).html(),
			{
				'data':				oSelf.slides,
				'mediaPath':		AssigmentSlides.mediaPath,
				'referenceKey':		AssigmentSlides.referenceKey,
				'slideType':		oSelf.model.type,
				'instruction':		oSelf.model.instructions,
				'savedData':		oSavedData,
				'usedTiles':		oUsedTiles,
				'wordBankHtmls':	oTileBankHtmls
			}
		)
	);
	
	AssignmentsView.hideMainLoader();
	$('#' + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).parent().addClass('word-slam-slides');
	
	/*==== Added to facilitate resize ====*/
	var aResizeConfig = [];
	
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		(function (iSlideId) {
			aResizeConfig.push({
				selector:	'#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .phonics_game_container .WordSlam_container',
				formula:	'100%',
				kids:		[
					{
						selector:	'.container2',
						formula:	'100%',
						kids:		[
							{
								selector:	'.container1',
								formula:	'100%',
								kids:		[
									{
										selector:	'.col1_left',
										formula:	'100%',
										kids:		[
											{
												selector:	'.matching_container_content',
												formula:	function (oElement, dBaseHeight) {
													$(oElement).css({
														'overflow-x':	'hidden',
														'overflow-y':	'auto',
														'width':		'250px',
														'padding':		'0px 25px 0 45px'
													});
													return '100%';
												}
											}
										]
									}, {
										selector:	'.col1_right',
										formula:	'100%',
										kids:		[
											{
												selector:	'.word_matching_area',
												formula:	'100%',
												kids:		[
													{
														selector:	'.word-slam',
														formula:	function (oElement, dBaseHeight) {
															$(oElement).css({
																'overflow-x':	'hidden',
																'overflow-y':	'auto',
																'margin':		'3% 0',
																'width':		'95%',
																'padding-left':	'5%'
															});
															var dSubtrahend = 0;
															for (var iIdx = 0; iIdx < $(oElement).siblings().length; iIdx++) {
																dSubtrahend += (
																	$(oElement).siblings().eq(iIdx).height() +
																	parseFloat($(oElement).siblings().eq(iIdx).css('padding-top').replace('px', '')) +
																	parseFloat($(oElement).siblings().eq(iIdx).css('padding-bottom').replace('px', '')) +
																	parseFloat($(oElement).siblings().eq(iIdx).css('border-top-width').replace('px', '')) +
																	parseFloat($(oElement).siblings().eq(iIdx).css('border-bottom-width').replace('px', ''))
																);
															}
															dSubtrahend += 30; // Found by inspection
															return (dBaseHeight - dSubtrahend).toFixed(2) + 'px';
														}
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			});
		})(iSlideId);
	}
	
	oSelf.layout = new HeightManager(aResizeConfig);
	/*== End Added to facilitate resize ==*/
	
	if(AssigmentSlides.introVideo) {
			/*==== Make the slide acquire full avaialable width ====*/
		var dAvailableWidth = $('.slider_pager_content_outer').outerWidth(),
			dButtonWidth = 0;
			
		$('.slider_pager_content_outer').find('button').each(function () {
			dButtonWidth += $(this).width();
		});
		
		var dUsableWidth = dAvailableWidth - dButtonWidth;
			
		$('.slider_pager_content')
			.width(dUsableWidth)
			.css({
				'max-width':	dUsableWidth + 'px'
			});
		/*== End Make the slide acquire full avaialable width ==*/
	
	}
	oSelf.resize();
	
	setTimeout(function () {
		oSelf.initSwiper();
	}, 500);
};

WordSlamView.resize = function () {
	var oSelf = this;
	oSelf.layout.setHeight();
	/*==== ???? ====*/
	$('#' + AssigmentSlides.referenceKey).css('width', '100%');
	/*== End ???? ==*/
	if (AssigmentSlides.introVideo) {
		setTimeout(function () {
			slider_pager_content_outer_height =  $(window).height() - $("header").outerHeight();
			$(".slider_pager_content_outer").css("height",slider_pager_content_outer_height+"px");
			$('.slider_pager_content').css({
					'max-height':	slider_pager_content_outer_height + 'px'
				});
			$(".slider_pager_content").css("height",slider_pager_content_outer_height+"px");
			$(".swiper-container").css("height",slider_pager_content_outer_height+"px");
			slide_inner_container_padding = (
					parseInt($("#slide_inner_container").css("padding-bottom")) + parseInt($("#slide_inner_container").css("padding-top"))
			);
			var new_assignment_irr_padding = parseInt($(".new_assignment_irr").css("padding-bottom")) + parseInt($(".new_assignment_irr").css("padding-top"));
			var new_assignment_irr_sp_video_height = slider_pager_content_outer_height - (slide_inner_container_padding  + new_assignment_irr_padding + 1);
			$(".new_assignment_irr_sp_video").height(new_assignment_irr_sp_video_height);
			$('.page_container_video').height(new_assignment_irr_sp_video_height);
		
		}, 520);
	}
};

WordSlamView.prepare4View = function () {
	var oSelf = this;
	/*==== IPP-2101 ====*/
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS) === ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
		oSelf.updateAttemptData(true);
	}
	/*== End IPP-2101 ==*/
	$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
		.off('click tap')
		.addClass('btndisabled disabled')
		.attr('disabled', true);
		
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		var sWordBank = '#word-bank-' + iSlideId,
			sDraggable4mWordBank = sWordBank + ' .draggable_box',
			sDropArea = '#word-slam-drop-area-' + iSlideId,
			sDraggable4mDropArea = sDropArea + ' .draggable_box',
			sDroppable4mDropArea = sDropArea + ' .myButtoninner';
		
		oDragAndDrop.removeDraggable('' + sDraggable4mWordBank);
		oDragAndDrop.removeDraggable('' + sDraggable4mDropArea);
		
		/*==== Though not necessary, just to be on the safer side ====*/
		oDragAndDrop.removeDroppable('' + sWordBank);
		oDragAndDrop.removeDroppable('' + sDroppable4mDropArea);
		/*== End Though not necessary, just to be on the safer side ==*/
	}
};

WordSlamView.bindEvents = function () {
	var oSelf = this;	
		
	$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
		.off('click tap')
		.on('click tap', function () {
			oSelf.updateAttemptData(true); // bIsSubmitted = true
		});
		
	oSelf.makeBoxDraggable();
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		(function (iSlideId) {
			var sDropSelector = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .col1_right .draggable_box',
				aWordBank = oSelf.slides[iSlideId - 1]['word-bank'],
				sTileIdPrefix = 'tile-' + iSlideId + '-',
				sWordBankId = '#word-bank-' + iSlideId,
				sDragSelector = '#word-bank-' + iSlideId + ' .draggable_box',
				sContainmentSelector = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .WordSlam_container';

			oDragAndDrop.imposeDroppable(
				sWordBankId,
				{
					accept:		sDropSelector,
					hoverClass:	'ui-state-hover'
				},
				function (oEvent, oUi) {
					var aUsedTiles = [],
						sWordBankHtml = '',
						oDragBox = oUi.draggable,
						sDraggedWord = oDragBox.text().trim();
						
					for (var iIndex = 0; iIndex < $('' + sDropSelector).length; iIndex++) {
						var oDropBox = $('' + sDropSelector).eq(iIndex),
							sTextAtDropBox = oDropBox.text().trim();
						if (
							sTextAtDropBox.toLowerCase() != ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase() &&
							sTextAtDropBox.toLowerCase() != sDraggedWord.toLowerCase()
						) {
							aUsedTiles.push(sTextAtDropBox.toLowerCase());
						}
					}
					
					for (var iIndex = 0; iIndex < aWordBank.length; iIndex++) {
						var sWord = aWordBank[iIndex];
						if ($.inArray(sWord.toLowerCase(), aUsedTiles) > -1) {
							continue;
						}
						sWordBankHtml += '<div class="myButton draggable_box swiper-no-swiping" id="' + sTileIdPrefix + (iIndex + 1) + '">\
							<div class="myButtoninner">\
								' + sWord + '\
							</div>\
						</div>'
					}
					
					if (sWordBankHtml.length > 0) {
						$('' + sWordBankId).html(sWordBankHtml);
						
						oDragBox.find('.myButtoninner').text(ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL);
						oDragBox.removeClass('drop').addClass('blank');
						setTimeout(function () {
							oDragAndDrop.removeDraggable(oDragBox);
							oDragAndDrop.imposeDraggable(
								sDragSelector,
								{
									containment: sContainmentSelector,
									helper:	function () {
										var oClone = $(this).clone(true);
										oClone.css({
											'margin-top':	'2%',
											'margin-left':	'8px'
										});
										return oClone;
									}
								}
							);
						}, 0);
					}
					
					$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
						.attr('disabled', true)
						.addClass('disabled btndisabled');
						
					oSelf.updateAttemptData();
				}
			);
		})(iSlideId);
	}
	
	$(document).on('mousedown', function () {
		$('#' + ASSIGNMENTS.c_s_DIV_WORD_SLAM_SHOW_HINT_ID).fadeOut('fast', function () {
			$(this).prev('button').removeClass('active');
		});
	});
	
	setTimeout(function () {
		AssignmentsView.prev.on('click tap', function () {
			$('#' + ASSIGNMENTS.c_s_SHOW_HINT).off('click tap');
			$('#' + ASSIGNMENTS.c_s_DIV_WORD_SLAM_SHOW_HINT_CONTAINER_ID).remove();
			
			if (isIOS(8)) {
				$('.header_inner').css({
					'position':	'static'
				});
				$('.header_inner > .header_innerin').css('position', 'static');
			}
		});
	}, 500);
	
	$("#prevPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipePrev();
    });
    $("#nextPagingBtn").off('click ' + sWindowsEventType).on('click ' + sWindowsEventType, function() {
        AssigmentSlides.slidingEngine.swipeNext();
    });
};

WordSlamView.initSwiper = function() {
	var oSelf = this;
	oSelf.mySwiper = new Swiper('#word-slam-swiper', {
		pagination:				'.pagination',
		paginationClickable:	true,
		noSwiping:				true,
		onInit: 			function () {
		},
		onFirstInit: 			function () {
			$('[id^="' + AssigmentSlides.referenceKey + '"]').css('height', 'auto');
			/*==== Word Slam: Content getting cut ====*/
			$('#word-slam-swiper-slide-container')
				.css({
					'height':		'auto',
					'min-height':	$('[id^="' + AssigmentSlides.referenceKey + '"]').first().height()
				})
				.after('<br clear="all" />');
			/*== End Word Slam: Content getting cut ==*/
			$.monitor({
				'if':	function () {
					return (oSelf.mySwiper instanceof Swiper);
				},
				'then':	function () {
					oSelf.initHint();
				}
			});
		}
	});
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
		AssigmentSlides.prepare4View(ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM);
	}
};
	
WordSlamView.makeBoxDraggable = function () {
	var oSelf = this;
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		$('#word-bank-' + iSlideId + ' .draggable_box').css('touch-action', 'none');
		
		oDragAndDrop.imposeDraggable(
			'#word-bank-' + iSlideId + ' .draggable_box',
			{
				containment: '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .WordSlam_container',
				helper:	function () {
					var oClone = $(this).clone(true);
					oClone.css({
						'margin-top': '2%',
						'margin-left': '8px'
					});
					return oClone;
				}
			}
		);
			
		oDragAndDrop.imposeDraggable(
			'#word-slam-drop-area-' + iSlideId + ' .draggable_box',
			{
				containment: '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .WordSlam_container',
				helper:	function () {
					var oClone = $(this).clone(true);
					oClone.css({
						'margin-top': '2%',
						'margin-left': '8px'
					});
					return oClone;
				}
			}
		);
	}
	
	oSelf.makeDroppable();
};
        
WordSlamView.enableDisableButton = function () {
	var oSelf = this;
	
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		var sDropBoxSelector = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .myButtoninner';
		for (var iIndex = 0; iIndex < $('' + sDropBoxSelector).length; iIndex++) {
			if ($('' + sDropBoxSelector).eq(iIndex).text().trim().toLowerCase() == ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase()) {
				$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
					.prop('disabled', true)
					.addClass('disabled')
					.addClass('btndisabled');
				return;
			}
		}
	}
	
	$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
		.prop('disabled', false)
		.removeClass('disabled')
		.removeClass('btndisabled');
};

WordSlamView.makeDroppable = function () {
	var oSelf = this,
		sDropBoxSelector = '',
		sDragBoxSelector = '',
		sRightContainer = '',
		sWordBankId = '';
	
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		(function (iSlideId) {
			sDropBoxSelector = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .col1_right .myButton .myButtoninner';
			sDragBoxSelector = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .draggable_box';
			sRightContainer = '#' + AssigmentSlides.referenceKey + '___' + iSlideId + ' .col1_right';
			
			oDragAndDrop.imposeDroppable(
				sDropBoxSelector,
				{},
				function(oEvent, oUi) {
					var oDragBox = oUi.draggable,
						sText = oDragBox.text().trim(),
						oDropBox = $(this),
						sTextAtDropBox = oDropBox.text().trim(),
						sDragBoxText = sTextAtDropBox,
						bRemoveDraggableFromDragBox = false,
						bIsDragBox4mWordBank = true;
						
					oDropBox.text(sText);
					oDropBox.parent().removeClass('blank').addClass('drop draggable_box swiper-no-swiping');
					
					/*==== If Dragged Element belongs to Droppable Area ====*/
					if ($.contains($('#word-slam-drop-area-' + iSlideId).get(0), oDragBox.get(0))) {
						oDragBox.find('.myButtoninner').text(sDragBoxText);
						if (sTextAtDropBox.toLowerCase() == ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase()) {
							oDragBox.addClass('blank');
							bRemoveDraggableFromDragBox = true;
						}
						bIsDragBox4mWordBank = false;
					}
					/*== End If Dragged Element belongs to Droppable Area ==*/
					else {
						if (sTextAtDropBox.toLowerCase() != ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase()) {
							oDragBox.find('.myButtoninner').text(sDragBoxText);
							bIsDragBox4mWordBank = false;
						}
					}
					
					oDragAndDrop.removeDroppable(sDropBoxSelector);
					
					setTimeout(function () {
						oDragAndDrop.removeDraggable(sDragBoxSelector);
						if (bIsDragBox4mWordBank === true) {
							oDragBox.remove();
						}
						else if (bRemoveDraggableFromDragBox === true) {
							oDragBox.removeClass('draggable_box');
						}
						oSelf.makeBoxDraggable();
					}, 0);
					
					/*==== Enable/ Disable Submit Button ====*/
					oSelf.enableDisableButton();
					/*== End Enable/ Disable Submit Button ==*/
					oSelf.updateAttemptData();
				}
			);
		})(iSlideId);
	}
};

WordSlamView.prepareWordBank = function (fAfterCallback) {
	var aUsedTiles = [],
		sWordBankHtml = '',
		oDragBox = oUi.draggable,
		sDraggedWord = oDragBox.text().trim();
		
	for (var iIndex = 0; iIndex < $('' + sDropSelector).length; iIndex++) {
		var oDropBox = $('' + sDropSelector).eq(iIndex),
			sTextAtDropBox = oDropBox.text().trim();
		if (
			sTextAtDropBox.toLowerCase() != ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase() &&
			sTextAtDropBox.toLowerCase() != sDraggedWord.toLowerCase()
		) {
			aUsedTiles.push(sTextAtDropBox.toLowerCase());
		}
	}
	
	for (var iIndex = 0; iIndex < aWordBank.length; iIndex++) {
		var sWord = aWordBank[iIndex];
		if ($.inArray(sWord.toLowerCase(), aUsedTiles) > -1) {
			continue;
		}
		sWordBankHtml += '<div class="myButton draggable_box swiper-no-swiping" id="' + sTileIdPrefix + (iIndex + 1) + '">\
			<div class="myButtoninner">\
				' + sWord + '\
			</div>\
		</div>'
	}
	
	if (sWordBankHtml.length > 0) {
		$('' + sWordBankId).html(sWordBankHtml);
		
		oDragBox.find('.myButtoninner').text(ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL);
		oDragBox.removeClass('drop').addClass('blank');
		setTimeout(function () {
			oDragAndDrop.removeDraggable(oDragBox);
			oDragAndDrop.imposeDraggable(
				sDragSelector,
				{
					helper:	function () {
						var oClone = $(this).clone(true);
						oClone.css({
							'margin-top':	'2%',
							'margin-left':	'8px'
						});
						return oClone;
					}
				}
			);
		}, 0);
	}
	
	$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
		.attr('disabled', true)
		.addClass('disabled btndisabled');

};

WordSlamView.updateAttemptData = function (bIsSubmitted) {
	var oSelf = this,
		sAssignmentId = AssigmentSlides.referenceKey.split('___').fetch(1),
		oAssignmentSlidesInfo = $GLOBALS.get('AssignmentSlidesInfo').content,
		sQuestionId = (
			(
				(oAssignmentSlidesInfo[ASSIGNMENTS.c_s_KEY_QUESTION_ID] || oAssignmentSlidesInfo['assignmentID']) ||
				oAssignmentSlidesInfo['_id']
			) || sAssignmentId
		),
		iSlideAttempt = 1,
		oSlideInputData = {},
		iCorrectAnswers = 0,
		iTotalQuestions = 0,
		oSlideInfo = {};
		
	if	(
		typeof AssigmentSlides.studentAttemptData == 'undefined' ||
		AssigmentSlides.studentAttemptData == null ||
			typeof AssigmentSlides.studentAttemptData.itemId == 'undefined' ||
			AssigmentSlides.studentAttemptData.itemId != sAssignmentId
	) {
		AssigmentSlides.studentAttemptData = {
			"itemId": 			sAssignmentId,
			"itemSlides": 		[],
			'submitStatus':		((bIsSubmitted === true)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
			'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			'itemType':			ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM
		};
	}

	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;	
		
	if (typeof bIsSubmitted != 'boolean') {
		bIsSubmitted = false;
	}
	
	for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
		var aDropBoxes = $('#word-slam-drop-area-' + iSlideId + ' .myButton'),
			sWord = '',
			iTotalQuestionsInSlide = 0,
			iCorrectAnswersInSlide = 0;
		
		for (var iQIndex = 1; iQIndex <= oSelf.slides[iSlideId - 1].questions.length; iQIndex++) {
			var aAnswerOptions = aDropBoxes.filterByData('index', iQIndex),
				aSelectedAnswers = [],
				sCorrectAnswer = oSelf.slides[iSlideId - 1].questions[iQIndex - 1]['answer'].replace(/[,\s]/g, '');
				
			sWord = '';
			aSelectedAnswers = [];
			for (var iAIndex = 0; iAIndex < aAnswerOptions.length; iAIndex++) {
				var sTile = $(aAnswerOptions[iAIndex]).text().trim();
				if (sTile.toLowerCase() == ASSIGNMENTS.c_s_WORD_SLAM_DROP_LABEL.toLowerCase()) {
					sTile = '';
				}
				sWord += sTile;
				aSelectedAnswers.push(sTile);
			}
			oSlideInputData[iQIndex.toString()] = {
				'answer':		aSelectedAnswers,
				'correctness':	false
			};
			if (aSelectedAnswers.length > 0) {
				/*==== Compute Correctness ====*/
				var bCorrectness = (sWord.toLowerCase() == sCorrectAnswer.toLowerCase());
				if (bCorrectness === true) {
					iCorrectAnswers++;
					iCorrectAnswersInSlide++;
				}
				/*== End Compute Correctness ==*/
				oSlideInputData[iQIndex.toString()] = {
					'answer':		aSelectedAnswers,
					'correctness':	bCorrectness
				};
				if (bIsSubmitted === true) {
					$('#result-' + iSlideId + '-' + iQIndex).find('[class^="answer_"]').hide();
					if (bCorrectness === true) {
						$('#result-' + iSlideId + '-' + iQIndex).find('.answer_rt').show();
					}
					else {
						$('#result-' + iSlideId + '-' + iQIndex).find('.answer_wg').show();
						$('#result-' + iSlideId + '-' + iQIndex).find('.wordtext_inner').html('<span class="wrg_ans">\
							' + sWord + '\
						</span>' + sCorrectAnswer);
					}
				}
			}
			iTotalQuestions++;
			iTotalQuestionsInSlide++;
		}
		/*==== Compute Slide Attempt ====*/
		try {
			var aExistingSlideInfo = _.where(AssigmentSlides.studentAttemptData.itemSlides, {'slideID': iSlideId});
			if (aExistingSlideInfo.length > 0) {
				if (bIsSubmitted === true) {
					iSlideAttempt = (parseInt(aExistingSlideInfo.first().slideAttempt) + 1);
				}
			}
		}
		catch (oException) {
			iSlideAttempt = 1;
		}
		if (typeof iSlideAttempt != 'number' || isNaN(iSlideAttempt)) {
			iSlideAttempt = 1;
		}
		/*== End Compute Slide Attempt ==*/
		oSlideInfo = {
			"slideID":			iSlideId,
			"slideType":		ASSIGNMENTS.c_s_TYPE_TPL_WORD_SLAM,
			"slideAttempt":		iSlideAttempt,
			"slideIsCorrect":	((iCorrectAnswersInSlide == iTotalQuestionsInSlide)? true: GENERAL.c_s_SPECIAL_CHARACTERS_BLANK),
			"slideScore":		iCorrectAnswersInSlide * oSelf.weightPerQuestion,
			"slideInputData":	oSlideInputData
		};
		var iSADSlideIndex = 0;
		/*==== Look for existing Slide Data ====*/
		for (; iSADSlideIndex < AssigmentSlides.studentAttemptData.itemSlides.length; iSADSlideIndex++) {
			var oSlideData = AssigmentSlides.studentAttemptData.itemSlides[iSADSlideIndex];
			if (oSlideData.slideID == iSlideId) {
				AssigmentSlides.studentAttemptData.itemSlides[iSADSlideIndex] = oSlideInfo;
				break;
			}
		}
		/*== End Look for existing Slide Data ==*/
		if (iSADSlideIndex == AssigmentSlides.studentAttemptData.itemSlides.length) {
			AssigmentSlides.studentAttemptData.itemSlides.push(oSlideInfo);
		}
		oSlideInfo = {};
		oSlideInputData = {};
	}
	
	if (bIsSubmitted === true) {
		AssigmentSlides.systemScore = iCorrectAnswers * oSelf.weightPerQuestion;
		AssigmentSlides.finalScore = iCorrectAnswers * oSelf.weightPerQuestion;	
		AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
		
		/*==== Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ====*/
		AssigmentSlides.studentAttemptSummary = {};
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
		
		AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
			JSON.parse('{\
				"' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + sQuestionId + '",\
				"' + ASSIGNMENTS.c_s_KEY_SCORE + '": ' + parseFloat(AssigmentSlides.finalScore) + '\
			}')
		);
		/*== End Alter ITEM_ATTEMPT_SUMMARY to Facilitate Skill-Based Reporting ==*/
		
		
		/*==== Put Question ID to Facilitate Skill-Based Reporting ====*/
		for (var iIndex = 0; iIndex < AssigmentSlides.studentAttemptData.itemSlides.length; iIndex++) {
			AssigmentSlides.studentAttemptData.itemSlides[iIndex].slideInputData[ASSIGNMENTS.c_s_KEY_QUESTION_ID] = sQuestionId;
		}
		/*== End Put Question ID to Facilitate Skill-Based Reporting ==*/
		
		AssigmentSlides.setAttemptData(0, function () {
			var sHeaderTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
				sResultHtml = '<div class="msg_content" style="bottom:-10px;">\
					<div class="correct sprite"></div>\
					<strong>\
						' + sHeaderTitle + ': ' + (iCorrectAnswers * oSelf.weightPerQuestion) + ASSIGNMENTS.c_s_OUT_OF_TXT + (iTotalQuestions * oSelf.weightPerQuestion) + '\
					</strong><br />\
					' + oUtility.printf(ASSIGNMENTS.c_s_WORD_SLAM_COMPLETED_STATUS, sHeaderTitle) + '\
				</div>';
			$('#word-slam-drop-area-' + oSelf.slides.length)
				.css({
					'margin-bottom':	'0px',
					'padding-bottom':	'3%'
				})
				.append(sResultHtml);
			$('#' + ASSIGNMENTS.c_s_BTN_WORD_SLAM_SUBMIT_ANSWER_ID)
				.addClass('disabled btndisabled')
				.attr('disabled', true);
			$('#word-slam-drop-area-' + oSelf.slides.length).animate({
				'scrollTop':	($('#word-slam-drop-area-' + oSelf.slides.length).height() * 3).toString() + 'px'
			}, 500);
		
			try {
				for (var iSlideId = 1; iSlideId <= oSelf.slides.length; iSlideId++) {
					var sDragBoxSelector = '#word-bank-' + iSlideId + ' .draggable_box',
						sDropBoxSelector = '#word-slam-drop-area-' + iSlideId + ' .myButtoninner',
						sRightDragBoxSelector = '#word-slam-drop-area-' + iSlideId + ' .draggable_box',
						sWordBankId = '#word-bank-' + iSlideId;
					
					oDragAndDrop.removeDroppable(sDropBoxSelector);
					oDragAndDrop.removeDroppable(sWordBankId);
					
					oDragAndDrop.removeDraggable(sDragBoxSelector);
					oDragAndDrop.removeDraggable(sRightDragBoxSelector);
				}
			}
			catch (oException) {};
			
			AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
		});
	}
};

/* 
 * Non Score Able View Template
 */
NonScoreAbleView = {
	/**
	 * Non Score Able View Properties
	 */
	'slideIdx' : null,
	'model' : null,
	'submitBtn' : null,
	'printBtn' : null,
	'typeareaText' : null,
	'disabledClass' : 'btndisabled',
	'saveDataInitially' : false,
	'_alert' : ISeriesBase.prototype._alert
};

/**
 * Non Score Able View Methods
 * @method init
 * @param {Number} slideIdx
 * @param {Object} model
 * @return {undefined}
 */
NonScoreAbleView.init = function (slideIdx, model) {	
	var oSelf = this;
	
    //Initialize Properties	
	oSelf.slideIdx = slideIdx;
	oSelf.model = model;
	
	// Added to facilitate save status 
	oSelf.slideStatus = new (function () {
		var oStatus = {
			'isComplete': false,
			'questionId': AssigmentSlides.questionId
		};
		this.update = function () {
			oStatus['answer'] = {};
			var qId = 0,
				ques = '',
				ans = '';
				
			oStatus['submitButtonEnabled'] = true;
			oSelf.updateAttemptData();
		};
		this.updateByData = function (oData) {
			oStatus = jQuery.extend(true, oStatus, oData);
			oSelf.updateAttemptData();
		};
		this.getStatus = function () {
			return oStatus;
		};
		this.getStatusAsString = function () {
			return JSON.stringify(oStatus);
		};
	})();
	// End Added to facilitate save status
	
	oSelf.controls = {};
    oSelf.render();
};

/**
 * Description
 * @method render
 * @return {undefined}
 */
NonScoreAbleView.render = function () {
	var oSelf = this;
	if (AssignmentsView.userType == ASSIGNMENTS.c_s_USER_TYPE_STUDENT) {
		var innerContent = oSelf.model.student_text;
	}
	else {
		var innerContent = oSelf.model.teacher_text;
	}
    $("#" + ASSIGNMENTS.c_s_SLIDE_INNER_CONTAINER).append(
		_.template(
			$("#" + ASSIGNMENTS.c_s_TYPE_TPL_NSA_FILLABLEWORKSHEET).html(),
			{
				"data":			innerContent,
				"mediaPath":	AssigmentSlides.mediaPath,
				"referenceKey": AssigmentSlides.referenceKey + "___" + oSelf.slideIdx,
				'slideType':	ASSIGNMENTS.c_s_TYPE_TPL_FILLABLEWORKSHEET
			}
		)
	);
	
	AssignmentsView.hideMainLoader();
	
    oSelf.loadControls();
	oSelf.bindEvents();	
	oSelf.saveDataInitially = true;
	
	// Regain Previous Status
	oSelf.retrieveState();	
	// End Regain Previous Status
	
	//oSelf.resize();
};

/**
 * Description
 * @method loadControls
 * @return {undefined}
 */
NonScoreAbleView.loadControls = function () {
	var oSelf = this;
	
	oSelf['controls'].container = $('#' + AssigmentSlides.referenceKey + "___" + oSelf.slideIdx);
	oSelf['controls'].submitBtn = $('#' + ASSIGNMENTS.c_s_ASSIGN_TYPEIN_ELEM_FINISHBTNID);	
};

/**
 * Description
 * @method resize
 * @return {undefined}
 */
NonScoreAbleView.resize = function () {
	var continent_box_height = $('.daily_assignment_content').height(),
		title_height = $('.daily_assignment_title').height(),
		bottom_bar_height = $('.edit_box_title').outerHeight(true),
		mid_height = continent_box_height - bottom_bar_height - 12;
	
	$('.da_container_box').css({'height': mid_height+'px','overflow-y':'auto'});
};

/**
 * Description
 * @method bindEvents
 * @return {undefined}
 */
NonScoreAbleView.bindEvents = function () {
	var oSelf = this;
    oSelf['controls'].submitBtn.off("click").on("click", function () {		
		oSelf.submitAnswer(this);
	});
};

/**
 * Description
 * @method submitAnswer
 * @param {HTMLButtonElement} oBttn
 * @return {undefined}
 */
NonScoreAbleView.submitAnswer = function (oBttn) {	
	var oTemplate = {},
		oSelf = this,
		assignmentIdChunks = null,
		assignmentId = null,
		boxId = 0;

    if (oSelf['controls'].submitBtn.hasClass(oSelf.disabledClass)) {
		return false;
	}
	
	assignmentIdChunks = (AssignmentsView.slideDataValue).split('___');
	assignmentId = assignmentIdChunks[1];
	
	oSelf.slideStatus.update();
	oSelf.slideStatus.updateByData({
		'isComplete':	true
	});
	
	AssigmentSlides.systemScore = 1;
	AssigmentSlides.finalScore = 1;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_COMPLETED_STATUS;
	
	
	AssigmentSlides.studentAttemptSummary = {};
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCORESUMMARY] = "";
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS] = [];
	
	AssigmentSlides.studentAttemptSummary[GENERAL.c_s_TXT_SCOREDETAILS].push(
         JSON.parse('{\
          "' + ASSIGNMENTS.c_s_KEY_QUESTION_ID + '": "' + AssigmentSlides.questionId + '",\
          "' + ASSIGNMENTS.c_s_KEY_SCORE + '":  1 \
		  }')
        );
	
	
	objStudentAttemptDataResponse = 0;	
	AssigmentSlides.setAttemptData();
	
	$.monitor({
			'if':			function () {					
				return ((typeof objStudentAttemptDataResponse != 'undefined' && 
						objStudentAttemptDataResponse != null && 
						objStudentAttemptDataResponse != 0) || 
						($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_MODE) == POPUP_VIEW.c_s_MODE_INSTRUCTOR ||
						$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_PLAY));
			},
			'beforeStart':	function () {
			},
			'interval':		500,
			'then':			function () {					
				if (typeof objStudentAttemptDataResponse.Error == 'undefined' || 
					objStudentAttemptDataResponse.Error == null) {
					oSelf['controls'].submitBtn.addClass(oSelf.disabledClass+" disabled");
					AssignmentsView.prev.addClass(ASSIGNMENTS.c_s_DONE_CLASS);
					oSelf.AttemptGradeableItemCallback ();
				}
				else {
					AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;			
					AssigmentSlides.studentAttemptSummary = {};
				}
			}
		});
	
	
};

/**
 * Description
 * @method updateAttemptData
 * @return {undefined}
 */
NonScoreAbleView.updateAttemptData = function () {
	var oSelf = this;
	var assignmentIdChunks = (AssignmentsView.slideDataValue).split('___'),
		assignmentId = assignmentIdChunks[1],
		sItemId = assignmentId,
		iSlideAttempt = 1;

	AssigmentSlides.studentAttemptData = {
		"itemId": 		sItemId,
		"itemSlides": 	[
			{
				"slideID": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideType": ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT,
				"slideAttempt": iSlideAttempt,
				"slideIsCorrect": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideScore": GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
				"slideInputData": oSelf.slideStatus.getStatus()
			}
		],
		'submitStatus':		GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'reAssignedStatus':	GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
		'itemType':			ASSIGNMENTS.c_s_ASSIGNMENT_NS_ASSIGNMENT
	};
	AssigmentSlides.studentAttemptSummary = {};	
	AssigmentSlides.systemScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	AssigmentSlides.finalScore = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;	
	AssigmentSlides.itemComplete = ASSIGNMENTS.c_s_INCOMPLETED_STATUS;

	if (oSelf.saveDataInitially === true) {		
		oSelf.saveDataInitially = false;		
		AssigmentSlides.setAttemptData();		
	}
};

/**
 * Description
 * @method retrieveStatus
 * @return oSlideInfo
 */
NonScoreAbleView.retrieveStatus = function () {
	var oSelf = this,
		oSlideInfo = {};
		
	if (oSelf.studentAttemptDataObj = AssigmentSlides.getStudentAttemptForGradableItem()) {
		;
	}
	else {		
		oSelf.studentAttemptDataObj = {
			itemSlides:	[]
		};
	}
	
	if (oSlideInfo = oSelf.studentAttemptDataObj.itemSlides.length) {
		oSlideInfo = oSelf.studentAttemptDataObj.itemSlides.first();
		
		if (!('slideInputData' in oSlideInfo)) {
			oSlideInfo = {};
		}
		else {
			oSlideInfo['slideInputData']['isComplete'] = (
				(typeof oSlideInfo['slideInputData']['isComplete'] != 'boolean')?
				(
					typeof oSlideInfo['slideAttempt'] != 'undefined' &&
					oSlideInfo['slideAttempt'] == '1'
				):
				oSlideInfo['slideInputData']['isComplete']
			);
			oSlideInfo = oSlideInfo['slideInputData'];
		}
	}
	else {		
		oSlideInfo = {};
	}	
	return oSlideInfo;
};

/**
 * Description
 * @method retrieveState
 * @return Literal
 */
NonScoreAbleView.retrieveState = function () {
	var oSelf = this,
		oSlideInfo = oSelf.retrieveStatus();
	
	if (isObjectEmpty(oSlideInfo)) {
		if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW) {
			var oCurrentSlide = oSelf['controls'].container;
			AssigmentSlides.prepare4View(oCurrentSlide);
		}
		else {
			oSelf.slideStatus.update();
		}		
		return false;
	}
		
	setTimeout(function () {		
		oSelf['controls'].submitBtn.attr('disabled', !oSlideInfo['submitButtonEnabled']);
		if (
			oSlideInfo['submitButtonEnabled']
		) {
			oSelf['controls'].submitBtn.removeClass(oSelf.disabledClass);
		}
		if (
			$_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == POPUP_VIEW.c_s_ACTION_VIEW
		) {
			var oCurrentSlide = oSelf['controls'].container;
			AssigmentSlides.prepare4View(oCurrentSlide);
		}
		AssignmentsView.resize();
		oSelf.slideStatus.updateByData(oSlideInfo);
	}, 100);
	return false;
};

NonScoreAbleView.AttemptGradeableItemCallback = function () {
	var oSelf = this;
	
	$('.' + ASSIGNMENTS.c_s_ASSIGNMENT_ACTIVE_SLIDE + ' .daily_assignment_ans').append('<div class="msg_content">\
		<div  class="correct sprite"></div>\
		' + ASSIGNMENTS.c_s_ASSIGN_NSA_SUCCESS_MSG + '\
	</div>');
	
	// $('.da_container_box').scrollTo(".msg_content",{duration: 500,easing: 'linear'});
	$('.da_container_box').eq(0).animate({
		'scrollTop':	($('.da_container_box').eq(0).height() * 3).toString() + 'px'
	}, 500);
};

// Text Help Speak
var playText = function () {
    $('#tempID').removeAttr('id') ;
	$('.assignment_slider_wrapper .highlight').attr('id', 'tempID');
    try {
		$rw_speakById('tempID');
		$('#textToHelpMenu').hide();
	}
	catch (e) { /* console.log(e); */ }
}
// Text Help Dictionary
var eventDic = function () {
	if (typeof $rw_event_dict == 'undefined') {
		$('.da_container_box .highlight').removeClass('highlight');
		$('#textToHelpMenu').hide(); 
		return; 
	}
	
    try {
		$('#msTextHelp').selectText();
		$rw_event_dict();
		$('#textToHelpMenu').hide();
	}
	catch (e) { /* console.log(e); */ }
}
// // Text Help Picture Dictionary
var eventPicDic = function () {  
	if (typeof $rw_event_picturedictionary == 'undefined') {
		$('.da_container_box .highlight').removeClass('highlight');
		$('#textToHelpMenu').hide(); 
		return; 
	}
	
    try {
		$('#msTextHelp').selectText();
		$rw_event_picturedictionary();
		$('#textToHelpMenu').hide();
	}
	catch (e) { /* console.log(e); */ }
}
// Text Help Translater
var eventTrans = function () {  
	if (typeof $rw_event_trans == 'undefined') {
		$('.da_container_box .highlight').removeClass('highlight');
		$('#textToHelpMenu').hide(); 
		return; 
	}
	
    try {
		$('#msTextHelp').selectText();
		$rw_event_trans();
		$('#textToHelpMenu').hide();
	}
	catch (e) { /* console.log(e); */ }
}

// Text Help Create Note
var textHelpCreateNote = function (e){
	e.preventDefault();	
	$("body").append(
		_.template($("#AddNoteTemplate").html())
	);	
	$('#txtAreaCreateNote').show();
	$('#txtAreaListNote').hide();
	$('#btnSaveNote').show();
	$('#txtAreaCreateNote').attr("autofocus","autofocus").focus().val($('.da_container_box .highlight').text());
	$('#textToHelpMenu').hide();
	
	// bind event to note buttons	
	$("#txtAreaCreateNote").off("keyup input").on("keyup input", function() {		
		if ($(this).val().trim() == '') {
			$("#btnSaveNote").addClass("btndisabled disabled").attr("disabled",true);
		}
		else {
			$("#btnSaveNote").removeClass("btndisabled disabled").removeAttr("disabled",true);
		}
	});
}

// HIDE NOTEST TEMPLATE
var hideAddNotes = function () {
	$('.overley, #notesModal').remove();
}

//FUNCTION TO SAVE NOTES
var saveNewNotes = function () {
	if ($(this).hasClass("disabled") && $("#txtAreaCreateNote").val().trim() == "") { return; }
	
	var oNotes = '{\\"chapNo\\":0,\\"sentNo\\":0}',
		iCurrentUnit = objCurrentUnitDetails ? objCurrentUnitDetails.currentUnit || 1 : 1,
		sNoteText = $('#txtAreaCreateNote').val().replace(/\n/gi, "<br>"),
		sShortNoteText = sNoteText.substr(0, 50),
		sNoteTitle = $('#' + ASSIGNMENTS.c_s_HEADER).text(),
		sRefId = $.trim(AssigmentSlides.referenceKey.split('___')[1]);
	
	$('.overley, #notesModal').remove(); 
	
	if ($_GET(POPUP_VIEW.c_s_QUERY_PARAM_ACTION) == GENERAL.c_s_SPECIAL_CHARACTERS_BLANK) {
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': 'FFFFFF',
			'click-to-hide': false,
			'opacity': 0.5
		}); 	
		
		// save notes
		$.nativeCall({
			'method':			'SaveNote',
			'globalResource':	'objNotesJsonData',
			'inputParams': 		["", 'journal', encodeURIComponent(sNoteTitle), sNoteText, sRefId, iCurrentUnit, "", oNotes, sShortNoteText],
			'interval':			500,			
			'debug':			false,
			'onComplete':		function () {
				oUtility.hideLoader();
				AssigmentSlides.getNoteList('journal',sRefId) // service call				
			}
		});
	}
}

//LIST NOTES
var textHelpListNotes = function (){	
	try {
		AssigmentSlides.sNoteText = '';
		AssigmentSlides.iNoteCnt = 0;
		var aNativeRequest = [],
			aNoteList = _.sortBy(
			objNoteBookData.Content.Data,
			function (oNoteInfo) {
				return parseInt(oNoteInfo.NoteID);
			}
		);
		
		if (aNoteList.length == 0) {
			AssigmentSlides._alert({
				divId:		'dialog-message',
				title:		'Alert!',
				message:	(ASSIGNMENTS.c_s_ASSIGN_NO_NOTES_MSG)
			});
		}
		else {
			oUtility.showLoader({
				'message': '<img src="media/loader.gif" alt="" />',
				'background-color': 'FFFFFF',
				'click-to-hide': false,
				'opacity': 0.5
			});
		}

		for (var i=0; i < aNoteList.length; i++) {	
			// get data from GetNoteList for all NoteIDs
			aNativeRequest.push({
				'serviceName': 'GetNoteInfo', 
				'params': [aNoteList[i].NoteID], 
				'response': 'objNoteInfoData',
				'checkSuccess': null,
				'callback': (i == aNoteList.length - 1) ? showNotesText : null
			});	
		}		
		AssigmentSlides.nativeCallWrapper(aNativeRequest);		
		
	}
	catch (e) {};
}

//FUNCTION CALLED FROM GetNoteInfo SERVICE CALLBACK
var showNotesText = function (){
	var tempStr = AssigmentSlides.sNoteText;	
	if (tempStr == null) { return } // to avoid null or blank data	
	
	$("body").append(
		_.template($("#AddNoteTemplate").html())
	);
	$('#txtAreaCreateNote').hide();
	$('#txtAreaListNote').html(tempStr).show();
	$('#btnSaveNote').hide();
	$('.overley, #notesModal').show();
	oUtility.hideLoader();
}

//FUNCTION TO SAVE TEXT TO CLIPBOARD
var copyText = function (){
	SaveData('clipboardText', $('.da_container_box .highlight').text());
	$('#textToHelpMenu').hide();
}	

//CALLBACK ON START OF READ OF TEXT HELP 
var textRead_speechStartedCallback = function () {
	var objID = '#txtAudioStop';	
	//$(objID).css('visibility', 'visible');
}

//CALLBACK ON STOP OF READ OF TEXT HELP 
var textRead_completedCallback = function () {
	//$('.audio_block').css('visibility', 'hidden');
}