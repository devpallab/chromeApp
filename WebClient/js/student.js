// student.js

var STATUSINTERVALOBJ;
var STATUSCALLTIME = 5000;
var CLASSSTATUSOBJ = {};
var surveyQuesID = '';
var surveyQuesInfo = '';
var surveyQuesAction = 'Attempt';
var broadcastImage = '', broadcastEbookID = '';
var broadcastVisible = false, broadcastEbookVisible = false;
var selectedOptionAlphabetHexStart = 97;
var currEventTimeStamp,loginVerbVal, startTime, endTime;
var bookInfoPDFBroadcastObj = {};
var sameCurrentPDFBroadcastPDF = false;
var GENERAL = {
	"c_s_DIST_DDL_LABEL": "Select Organization",
	"c_s_PROD_TYPE_MYELD": "myeld",
	"c_s_PROD_TYPE_ILIT": "ilit",
	"c_s_PROD_TYPE_WTW": "wtw"
};

$(window).resize(function() {
	resize();
	if($('.broadcastOverlay').is(':visible')) {
		resizeBroadcastFrame();
	}
});

$(window).ready(function() {
	var loginDone = getSessionStorageItem('loginDone');
	if(getLocalStorageItem('TOKENID') != null) {
		TOKENID = getLocalStorageItem('TOKENID');
		//afterTokenCallBack();
	}
	if(loginDone == null) {
		var postObj = {
					AppType: APPTYPE,
					AppVersionNumber: APPVERNUM,
					PassCode: '1234',
					LastTokenID: TOKENID
				};
		var url = SERVICEBASEURL + "GetServiceTokenID";
		AjaxCall(url, "POST", postObj, sp_GetServiceTokenID);
		checkInternetConnection();
	} else {
		afterTokenCallBack();
	}
	//$('.footer_container .verNo').html('Ver. '+APPVERNUM);
});

function getFooterButton() {
	var sProductCode = getSessionStorageItem('productCode') || '';
	$('#footer-btn-cont').html(
		_.template(
			$('#footer-buttons-student').html(),
			{
				'productCode':	sProductCode
			}
		)
	).css('visibility', 'visible');
};

function sp_GetServiceTokenID(data) {
	internetCheckIntervalStart = true;
	window.clearTimeout(internetCheckInterval);
	if(data != null) {
		var jsonObj = JSON.parse(data);
		if(jsonObj.Status == '200') {
			TOKENID = $.trim(jsonObj.Content.TokenID);
			setLocalStorageItem('TOKENID', TOKENID);
			setLocalStorageItem('LASTTOKENACCESSDATE', getTimeInMs());
			afterTokenCallBack();
		} else {
			alert(jsonObj.Error.ErrorUserDescription);
		}
	}
}

function afterTokenCallBack() {
	var loginDone = getSessionStorageItem('loginDone');
	var userRole = getSessionStorageItem('userRole');
	if(loginDone == null || userRole != USERROLE) {
		clearSessionStorage();
		//load login template based on product
		switch(PRODTYPE){
			case PRODTYPE_CONSTANT.c_s_PROD_TYPE_ILIT:
			case PRODTYPE_CONSTANT.c_s_PROD_TYPE_MYELD:
				$(".wrapper").prepend(_.template($("#tplLoginWrapper").html()));
			break;
			
			case PRODTYPE_CONSTANT.c_s_PROD_TYPE_WTW:
				$(".wrapper").prepend(_.template($("#tplLoginWrapperWTW").html()));
				$("body").addClass("student");
			break;
		}
		
		//set version number
		$('.footer_container .verNo').html('Ver. '+APPVERNUM);
				
		$('.afterLoginWrapper').hide();
		bindLoginContinue();
		/*== start for district dropdown ==*/
		getDistrictList();
		/*== end for district dropdown ==*/
	} else if(loginDone != null) {
		$('.loginWrapper, .gradeSelect').remove();
		$('.afterLoginWrapper').show();
		init();
	}
}

/*== start for district dropdown ==*/
//fetch district list
function getDistrictList(){	
	//show loader
	$('.loader.districtList').show();
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),	
					ProductType:PRODTYPE
				};
	var url = SERVICEBASEURL + "GetDistrictList";
	AjaxCall(url, "POST", postObj, getDistrictListCallBack);
}

/*== ref : https://jqueryui.com/autocomplete/#combobox ==*/
function searchableComboInit(pOElemSelect){

	//auto select last district 
	selectLastDistrictAndUser();
	
    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );
 
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "",
		  label = this.element.children().eq(0).html().trim(); // for dropdown placeholder text
 
        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
		  .attr("placeholder",label)
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            tooltipClass: "ui-state-highlight"
          });
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid"
        });
      },
 
      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;
 
        $( "<a>" )
          .attr( "tabIndex", -1 )
          /* .attr( "title", "Show All Items" )
          .tooltip() */
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .mousedown(function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .click(function() {
            input.focus();
 
            // Close if already visible
            if ( wasOpen ) {
              return;
            }
 
            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },
 
      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text().trim(); // trim() to fix for extra space in input 
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },
 
      _removeIfInvalid: function( event, ui ) {
 
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
        // Remove invalid value
        this.input
          .val( "" )
         /* .attr( "title", value + " didn't match any item" )
          .tooltip( "open" ); */
        this.element.val( "" );
       /* this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 ); */
       /* this.input.autocomplete( "instance" ).term = ""; */
	   
	    /* rectified above line in order to fix error - no such method 'instance' for autocomplete widget instance 
		ref : https://forum.jquery.com/topic/issue-with-jquery-ui-selectmenu-no-such-method-instance */
		this.input.data( "ui-autocomplete" ).term = ""; 
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
  
    pOElemSelect.combobox();
    $( "#toggle" ).click(function() {
      pOElemSelect.toggle();
    });  
}

function getDistrictListCallBack(data){
	if (data != null) {
		$('.loader.districtList').hide();
		data = JSON.parse(data);
		if(data.Status == '200') {
			$("#districtList").html(_.template($("#districtListTpl").html(), {"districtList" : data.Content}));
			searchableComboInit($("#districtDDL"));
			bindDistrictEvents();
		}else {
			alert(data.Error.ErrorUserDescription+" Fetchng District List ");
			getDistrictList();
		}
	}
}
/*== end for district dropdown ==*/

/* function to execute initial function */
function init() {
	$('.loader').show();
	//initAudioRecorder();
	USERID = getSessionStorageItem('userID');
	CLASSID = getSessionStorageItem('classID');
	CACHEDSTATUSSTUDENTKEYNAME = 'UAI_CACHE_STATUS_S_' + CLASSID + '_' + USERID;
	if(_Browser.isSafari) {
		INDEXEDDBSUPPORT = false;
	}
	initAudioPlayingObject();
	initInfoStorage();
	resize();
	checkClassStatus();
}

function initInfoStorage() {
	var classID = getSessionStorageItem("classID");
	var userID = getSessionStorageItem("userID");
	var productGradeID = getSessionStorageItem("productGradeID");
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					ProductGradeID : productGradeID,
                    CallerClassID : classID,
                    CallerUserID : userID

				};
	var url = SERVICEBASEURL + "GetGradeInfoInDetail";
	AjaxCall(url, "POST", postObj, GetGradeInfoInDetailCallBack);
}

function GetGradeInfoInDetailCallBack(data) {
	if (data != null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			PRODUCTCODE = getSessionStorageItem('productCode');
			var contentBaseURL = data.Content.ContentBaseURL.trim();
			var gradeCode = data.Content.GradeCode.trim();
			var assignmentPath = contentBaseURL + data.Content.assignmentPath.trim() + '/' + gradeCode + '/';
			var libraryMidPath = data.Content.libraryPath.trim();
			var gradePath = contentBaseURL + PRODUCTCODE + '/curriculum/' + gradeCode + '/';
			var libraryBookPath = contentBaseURL + libraryMidPath + '/';
			//var libraryBookPath = contentBaseURL + (PRODUCTCODE + '/curriculum/' + gradeCode) + '/',
			var	libraryPath = (
					(isiLit20() === true)?
					contentBaseURL + (PRODUCTCODE + '/curriculum/' + gradeCode) + '/':
					contentBaseURL + (PRODUCTCODE + '/curriculum/' + gradeCode) + '/'
				);
			var totalUnits = data.Content.TotalUnits.trim();
			var totalWeeksWithInGrade = data.Content.TotalWeeksWithInGrade.trim();
			var totalLessonsWithInGrade = data.Content.TotalLessonsWithInGrade.trim();
			setSessionStorageItem('contentBaseURL', contentBaseURL);
			setSessionStorageItem('gradeDisplayName', data.Content.GradeDisplayName.trim());
			setSessionStorageItem('revisionNumber', data.Content.RevisionNumber.trim());
			setSessionStorageItem('gradeCode', gradeCode);
			setSessionStorageItem('gradePath', gradePath);
			setSessionStorageItem('assignmentPath', assignmentPath);
			setSessionStorageItem('libraryBookPath', libraryBookPath);
			setSessionStorageItem('libraryPath', libraryPath);
			setSessionStorageItem('totalUnits', totalUnits);
			setSessionStorageItem('totalWeeksWithInGrade', totalWeeksWithInGrade);
			setSessionStorageItem('totalLessonsWithInGrade', totalLessonsWithInGrade);
			setSessionStorageItem('unitsWeeksDetails', data.Content.UnitsWeeksDetails);
			
			afterInfoStorage();
			getFooterButton();
		} else {
			alert(data.Error.ErrorUserDescription);
		}
	}
}

function afterInfoStorage() {
	var gradePath = getSessionStorageItem('gradePath');
	var timeStmpCacheFlag = new Date().toUTCString().replace(/ /g, '').split(':')[0];
	var gradeItemPath = gradePath + 'grade_items.js?_='+timeStmpCacheFlag;
	$.ajax({
		url: gradeItemPath,
		dataType: "script",
		cache: true,
		success: function( data ) {
			getTOCItemsAndMap();
		}
	});
	setInfoBubbleDetails();
	bindHTML();
	bindPDFReaderBackBtn();
	trackCSLog();
}

// FUNCTION TO GET TOC ITEMS OF SERVICES DB AND MAP TO GRADE_ITEMS.JS DATA
function getTOCItemsAndMap() {
	var classID = getSessionStorageItem("classID");
	var userID = getSessionStorageItem("userID");
	var productGradeID = getSessionStorageItem("productGradeID");
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		ProductGradeID : productGradeID,
		CallerClassID : classID,
		CallerUserID : userID

	};
	var url = SERVICEBASEURL + "GetTOCItems";
	AjaxCall(url, "POST", postObj, getTOCItemsAndMapCallBack);
	return false;
}

// CALLBACK FUNCTION FOR GetTOCItems SERVICEBASEURL
function getTOCItemsAndMapCallBack(response) {
	if(response != null ) {
		var resp = JSON.parse(response);
		if(resp.Status == '200') {
			var mapContent = resp.Content;
			for(var i = 0 ; i < mapContent.length; i++) {
				CMSIDsTOSERVCIDsMAPPING[mapContent[i].CMSItemID] = mapContent[i].ItemID;
				SERVCIDsTOCMSIDsMAPPING[mapContent[i].ItemID] = mapContent[i].CMSItemID;
			}
			mapCMSIDsToTOCIDs(CMSIDsTOSERVCIDsMAPPING);
			createAssignmentArray();
			bindFooterButton();
			checkCurrentTab();
			changeConnectStatus();
			$('.loader').hide();
		} else {
			alert(resp.Error.ErrorUserDescription);
		}
	} else {
		alert('Mapping data not available. Please check.');
	}
}

// for logging class started data
function trackCSLog() {

	// for creating log of classStarted event
	endTime = getTimeInMs();
	var verbVal = endTime- getSessionStorageItem("eventStartTime");
	eventTimeStamp = getSessionStorageItem("eventTimeStamp");
	createLog(getSessionStorageItem("verbID"), verbVal, eventTimeStamp);
}

function checkCurrentTab()
{
	var tabIndex = getSessionStorageItem('currentTabIndex');
	$('.footer_in button').eq(parseInt(tabIndex)).trigger('click');
}

/* function to resize iframe according to browser window */
function resize()
{
	var winH = $(window).height();
	var topBarH = $('.footer_inner').height();
	var iFrameH = parseInt(winH - topBarH - 5);
	
	$('.iframeWrap').animate({ 'height' : iFrameH + 'px' }, 50);
	$('#wrapperFrame').animate({ 'height' : iFrameH + 'px' }, 50);
	
}

function resizeBroadcastFrame()
{
	var topBarH = 0;
	var winH = $(window).height();
	if($('.broadcastOverlay .topBar').is(':visible')) {
		topBarH = $('.broadcastOverlay .topBar').height();
	}
	$('.broadcastWrapper').animate({ 'height' : (winH - topBarH) + 'px' }, 50);
	$('#broadcastFrame').animate({ 'height' : (winH - topBarH) + 'px' }, 50);
	return false;
}

function bindHTML()
{
	$('body').bind('click', function(e) {
		try {
			var targetElem = $(e.target);
			//console.log(targetElem.attr('class'));
			var targetClass = targetElem.attr('class');
			if(targetClass.indexOf('logout_setting') == -1 && targetClass.indexOf('lesson_tooltip') == -1) {
				if($('#infoToolTip').is(':visible')) {
					$('#infoToolTip').fadeOut(100);
					$('.footer_inner button.logout_setting').removeClass('active');
				}
			}
		}
		catch(e) {}
		
	});
}

/* function to bind native button on the bottom */
function bindFooterButton()
{
	$('.footer_in button').off('click').on('click', function(e) {
		e.preventDefault();
		var htmlFileName = '';
		var buttonName = $.trim($(this).attr('class').toLowerCase());
		var tabIndex = $('.footer_in button').index($(this));
		setSessionStorageItem('currentTabIndex', tabIndex);
		$('.footer_in button').removeClass('active');
		$(this).addClass('active');
		var cacheFreeValue = getTimeInMs();
		switch(true)
		{
			case (buttonName.indexOf('review') > -1):
				//$('#wrapperFrame').attr('src','App/book_review.html?_=' + cacheFreeValue);
				openPage({});
				setSessionStorageItem("currentTab", getSessionStorageItem("currentTab")); 
				//setSessionStorageItem("verbID", "S-LBTO"); // to log data
				break;
			case (buttonName.indexOf('library') > -1):
				$('#wrapperFrame').attr('src','App/library.html?_=' + cacheFreeValue);
				setSessionStorageItem("currentTab", "library"); 
				//setSessionStorageItem("verbID", "S-LBTO"); // to log data
				break;
			case (buttonName.indexOf('assignments') > -1):
				setSessionStorageItem("currentTab", "assignments");
				setSessionStorageItem("verbID", "S-ATO"); //to log data
				$('#wrapperFrame').attr('src','App/assignment.html?_=' + cacheFreeValue);
				break;
			case (buttonName.indexOf('notebooks') > -1):
				$('#wrapperFrame').attr('src','App/notebook.html?_=' + cacheFreeValue);
				setSessionStorageItem("currentTab", "notebooks");
				setSessionStorageItem("verbID", "S-NTO"); //to log data
				window.top.sendGoogleEvents('Student - Notebook (tab)','Viewed Notebook','UserID:'+getSessionStorageItem("UserID"));
				break;
			case (buttonName.indexOf('connect') > -1):
				$('#wrapperFrame').attr('src','App/student-connect.html?_=' + cacheFreeValue);
				setSessionStorageItem("currentTab", "connect");
				/* setSessionStorageItem("verbID", "S-NTO"); //to log data
				window.top.sendGoogleEvents('Student - Notebook (tab)','Viewed Notebook','UserID:'+getSessionStorageItem("UserID")); */
				break;
			case (buttonName.indexOf('dashboard') > -1):
				setSessionStorageItem("currentTab", "dashboard");
				setSessionStorageItem("verbID", "S-ATO"); //to log data
				$('#wrapperFrame').attr('src','App/student_dashboard.html?_=' + cacheFreeValue);
				break;
			default:
				alert('No Method Found!');
				break;
		}
		
		currEventTimeStamp = getCurrentTimestamp();
		setSessionStorageItem("eventStartTime", getTimeInMs());
		setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
	});
	
	$('.footer_inner button.logout_setting').unbind('click').bind('click', function(e) {
		$('#infoToolTip').fadeToggle(100);
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}
	});
}

/* function to check class status after student login */
function checkClassStatus()
{
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
	var url = SERVICEBASEURL + "GetClassStatus";
	AjaxCall(url, "POST", postObj, checkClassStatusCallBack, "GetClassStatus"); checkInternetConnection(); // 1st call
	window.clearInterval(STATUSINTERVALOBJ);
}

function checkClassStatusCallBack(jsonData) {
	STATUSINTERVALOBJ = window.setInterval(function() { checkClassStatus(); }, STATUSCALLTIME);
	if (jsonData != "Error") {
		internetCheckIntervalStart = true;
	}
	
	if(jsonData != null && jsonData != "Error") {
		var jsonObj = JSON.parse(jsonData);
		if(jsonObj.Status == '200' && jsonObj.Content != null && jsonObj.Error == null) {
			CLASSSTATUSOBJ = jsonData;
			var curRATABookID = jsonObj.Content.ClassCurrentActivities == null ? '' : JSON.stringify({ currentRATABookID : (jsonObj.Content.ClassCurrentActivities.CurrentRATABookID == '') ? '' : SERVCIDsTOCMSIDsMAPPING[jsonObj.Content.ClassCurrentActivities.CurrentRATABookID] });
			try { window.frames["wrapperFrame"].GetCurrentRATACallback(curRATABookID); } catch(e) {}
			if (
				jsonObj.Content.CurrentAction != null &&
				(
					jsonObj.Content.CurrentAction.toLowerCase().trim() == 'S'.toLowerCase() ||
					jsonObj.Content.CurrentAction.toLowerCase().trim() == 'AP'.toLowerCase()
				)
			) {
				broadcastEbookVisible = false; //temp
				broadcastEbookID = ''; //temp
				retainEbookBroadcast();
				var surveyON = true;
				closeBroadcast(surveyON);
				var currentActionData = JSON.parse(jsonObj.Content.CurrentActionData);
				var surveyJSON = JSON.parse(decodeURIComponent(currentActionData.QuestionInfo));
				var surveyType = "LessonSurvey";
				if (jsonObj.Content.CurrentAction.toLowerCase().trim() == 'AP'.toLowerCase()) {
					surveyType = "AdHocPoll";
				}
				if(surveyQuesID != surveyJSON.survey.question_id) {
					try { window.frames["wrapperFrame"].stopTextHelpSpeak(); } catch(e) {}
					$('.submitSurveyMsg').hide();
					$('.surveyOverlay .question_box_space #btnSurveySubmit').show();
					showSurvey(surveyJSON.survey, surveyType);
					$('.surveyOverlay').slideDown(300);					
					bindSurveyScreen(surveyType);
					surveyQuesID = surveyJSON.survey.question_id;
					//var tmpSurveyObj = { "survey": JSON.stringify(surveyJSON.survey)  };
					surveyQuesInfo = JSON.stringify(currentActionData.QuestionInfo);
				}
			} else if(jsonObj.Content.CurrentAction == null) {
				closeSurvey();
				closeBroadcast();
				closeBuzz();
			} else if(jsonObj.Content.CurrentAction != null && jsonObj.Content.CurrentAction.toLowerCase().trim() == 'P'.toLowerCase()) {
				closeSurvey();
				closeBroadcast();
				closeBuzz();
			} else if(jsonObj.Content.CurrentAction != null && (jsonObj.Content.CurrentAction.toLowerCase().trim() == 'B'.toLowerCase())) {
				var currentActionData = JSON.parse(jsonObj.Content.CurrentActionData);
				if(currentActionData.MediaType.toLowerCase() == 'ebook') {
					var fullURLArr = currentActionData.MediaFullURL.split('|||');
					var bookFormat = fullURLArr[5];
					if(bookFormat.toLowerCase() == 'pdf') {
						if(bookInfoPDFObj.bookID != undefined && bookInfoPDFObj.bookID == currentActionData.MediaID.trim()) {
							if($('.pdfReaderOverlay').is(':visible')) {
								$('#pdfReaderBackBtn').prop('disabled', true);
								broadcastEbookVisible = true, sameCurrentPDFBroadcastPDF = true;
							}
						} else {
							if(broadcastEbookID != currentActionData.MediaID.trim()) {
								try { window.frames["wrapperFrame"].stopTextHelpSpeak(); } catch(e) {}
								var bookName = fullURLArr[1];
								var bookType = fullURLArr[2];
								var wordCount = (isNaN(parseInt(fullURLArr[3]))) ? 0 : parseInt(fullURLArr[3]);
								var bookNumPage = (isNaN(parseInt(fullURLArr[6]))) ? 0 : parseInt(fullURLArr[6]);
								var classStatusJson = JSON.parse(CLASSSTATUSOBJ);
								var currentUnit = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonUnit;
								var currentWeek = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonWeek;
								currentRataBookId = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : ((classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID == '') ? '' : SERVCIDsTOCMSIDsMAPPING[classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID]);
								var bookID = currentActionData.MediaID.trim();
								var libraryPath = getSessionStorageItem("libraryPath");
								var libraryBookPath = getSessionStorageItem("libraryBookPath");
								var bookPath = libraryBookPath + bookID + '/' + bookID + '.pdf';
								var jsonStr = '{ "bookID" : "' + bookID + '", "bookPath" : "' + bookPath + '", "bookName" : "' + bookName + '", "bookType" : "' + bookType + '", "wordCount" : "' + wordCount + '", "bookNumPage" : "' + bookNumPage + '", "currentUnit" : "' + currentUnit + '", "currentWeek" : "' + currentWeek + '", "currentRataBookId" : "' + currentRataBookId + '" }';
								bookInfoPDFBroadcastObj = JSON.parse(jsonStr);
								$('.broadcastOverlay .topBar').show();
								$('.broadcastOverlay .topBar #broadcastBackBtn').prop('disabled',true);
								$('.broadcastOverlay .topBar .middle').html(bookName);
								closeSurvey();
								closeBuzz();
								retainPdfBroadcast(jsonData);
								broadcastEbookVisible = true;
								$('.broadcastOverlay #broadcastFrame').attr('src' , '');
								if($('.pdfReaderOverlay').is(':visible')) {
									$('#pdfReaderBackBtn').trigger('click');
								}
								setSessionStorageItem('BookID', bookID);
								setTimeout(function() { 
									$('.broadcastOverlay').slideDown(300, function() {
										resizeBroadcastFrame();
										$('.broadcastOverlay #broadcastFrame').attr('src' , bookPath);
										setPDFReaderVariables(bookInfoPDFBroadcastObj);
									});
								}, 200);
								var currEventTimeStamp = getCurrentTimestamp();
								createLog('IL', 0, currEventTimeStamp);
							} else {
								if(!$('.broadcastOverlay .topBar #broadcastBackBtn').is(':disabled')) {
									$('.broadcastOverlay .topBar #broadcastBackBtn').prop('disabled',true);
								}
							}	
						}
						broadcastEbookID = currentActionData.MediaID.trim();
					} else {
						$('.broadcastOverlay .topBar').hide();
						if(broadcastEbookID != currentActionData.MediaID.trim()) {
							try { window.frames["wrapperFrame"].stopTextHelpSpeak(); } catch(e) {}
							closeSurvey();
							closeBuzz();
							resizeBroadcastFrame();
							broadcastEbookVisible = true;
							var ebookFullURL = currentActionData.MediaFullURL.trim();
							currEventTimeStamp = getCurrentTimestamp();
							setSessionStorageItem("eventStartTime", getTimeInMs());
							setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
							setSessionStorageItem("verbID", "IL");
							setTimeout(function() { 
								$('.broadcastOverlay').slideDown(300, function() {
									$('.broadcastOverlay #broadcastFrame').attr('src' , 'App/ebookplayer/'+ebookFullURL);
								});
							}, 200);
							broadcastEbookID = currentActionData.MediaID.trim();
						} else {
							try { window.frames["broadcastFrame"].onBroadcastStart(); } catch(e) {}
						}
					}
				} else {
					if(broadcastImage != currentActionData.MediaFullURL.trim()) {
						$('.broadcastOverlay .topBar').hide();
						try { window.frames["wrapperFrame"].stopTextHelpSpeak(); } catch(e) {}
						closeSurvey();
						closeBuzz();
						broadcastEbookID = '';
						broadcastEbookVisible = false;
						resizeBroadcastFrame();
						$('.broadcastOverlay').slideDown(300, function() {							
							retainEbookBroadcast();						
							$('.broadcastOverlay #broadcastFrame').attr('src', 'App/broadcast.html').load(function() {
								broadcastVisible = true;
								var jsonBroadcast = jsonObj;
								var broadcastCurrentActionData = JSON.parse(jsonBroadcast.Content.CurrentActionData);
								var imgName = broadcastCurrentActionData.MediaFullURL.trim();
								jsonBroadcast.MediaFullUrl = getSessionStorageItem("gradePath").trim() + 'projection/' + imgName;
								jsonBroadcast.currentVersion = APPVERNUM;
								jsonBroadcast.appPlatform = APPTYPE;
								try { window.frames["broadcastFrame"].GetBroadcastInfoCallback(JSON.stringify(jsonBroadcast)); } catch(e) {}
								$(this).unbind();
							});
						});
						broadcastImage = currentActionData.MediaFullURL.trim();
					}
					if(broadcastVisible) {
						var jsonBroadcastV = jsonObj;
						var broadcastCurrentActionDataV = JSON.parse(jsonBroadcastV.Content.CurrentActionData);
						var imgName = broadcastCurrentActionDataV.MediaFullURL.trim();
						jsonBroadcastV.MediaFullUrl = getSessionStorageItem("gradePath").trim() + 'projection/' + imgName;
						jsonBroadcastV.currentVersion = APPVERNUM;
						jsonBroadcastV.appPlatform = APPTYPE;
						try { window.frames["broadcastFrame"].GetBroadcastInfoCallback(JSON.stringify(jsonBroadcastV)); } catch(e) {}
					}
				}
			}
			else if (jsonObj.Content.CurrentAction.toLowerCase().trim() == 'bz') { // IPP-4099
				try {
					var oCurrentActionData = JSON.parse(jsonObj.Content.CurrentActionData),
						oQuestionInfo = JSON.parse(decodeURIComponent(oCurrentActionData.QuestionInfo || '{}')),
						aStudentIds = [],
						iBuzzId = parseInt(oQuestionInfo.buzzId) || -1,
						iStarCount = parseInt(oQuestionInfo.startCount) || 0,
						sCommentText = '',
						sStarHtml = ''
						iExistingBuzzId = (parseInt(localStorage.getItem('buzzId')) || parseInt($('#btnCloseBuzz').data('buzz-id'))) || 0,
						oClosedBuzzList = JSON.parse(localStorage.getItem('closedBuzzList') || '{}'),
						iStudentId = parseInt(getSessionStorageItem("userID")),
						iMaxStarCount = 3,
						dStartContWidth = (iMaxStarCount * 48 + 195),
						sRightOffset = ((435 - dStartContWidth) / 2).toFixed(2),
						oCommentInfo = {},
						sResetMessage = 'I have reset the stars for the class. Let\'s start again. Good luck.';
						
					try {
						oCommentInfo = JSON.parse(oQuestionInfo.comment);
						aStudentIds = oCommentInfo.studentIDs || [];
					}
					catch (oException) {
						
					}
					
					if (iBuzzId === -1) {
						objUtility.hidePopUp();
						return;
					}
					if (oClosedBuzzList[iStudentId] === iBuzzId) {
						objUtility.hidePopUp();
						return;
					}
					if (aStudentIds.length > 0 && aStudentIds.indexOf(iStudentId.toString()) === -1) {
						objUtility.hidePopUp();
						return;
					}
					if (typeof oCommentInfo.comments === 'string') { // Reset Class
						if (oCommentInfo.comments == sResetMessage) {
							objUtility.hidePopUp();
							return;
						}
					}
					if (iExistingBuzzId !== iBuzzId) {
						objUtility.hidePopUp();
					}
				
					if (!$.isEmptyObject(oCommentInfo)) {
						if (oCommentInfo.comments instanceof Array) {
							for (var iI = 0; iI < oCommentInfo.comments.length; iI++) {
								if (oCommentInfo.comments[iI] !== undefined) {
									sCommentText += (sCommentText.length > 0? '<br />': '') + oCommentInfo.comments[iI];
								}
							}
						}
						
						if (typeof oCommentInfo.personalComments === 'string') {
							sCommentText += (sCommentText.length > 0? '<br />': '') + oCommentInfo.personalComments;
						}
					}
					
					for (var iI = 1; iI <= iStarCount; iI++) {
						if (iI === 1) {
							sStarHtml = '<ul style="list-style:none; width:' + dStartContWidth + 'px; position:absolute; right:' + sRightOffset + 'px; bottom:10px;">' +
							'\n\t<li style="float:left; padding:4px; font-size:21px; height:40px; line-height:40px;"> You have received: </li>';
							// 40: width of star + 8: padding
						}
						sStarHtml += '\n\t<li style="float:left; padding:4px;"> <img src="media/star-on.png" alt="" width="40" /> </li>';
						if (iI === iStarCount) {
							for (var iJ = iStarCount + 1; iJ <= iMaxStarCount; iJ++) {
								sStarHtml += '\n\t<li style="float:left; padding:4px;"> <img src="media/star-off.png" alt="" width="40" /> </li>';
							}
							sStarHtml += '\n</ul>';
						}
					}
					
					objUtility.showPopUp({
						'click-to-hide': 	false,
						'message':    		'<div class="popup_yellow_content">\
							<div class="popup_yellow_inner">\
								<div onclick="closeBuzz(' + iBuzzId + ');" class="close_yew sprite-buzz" id="btnCloseBuzz" data-buzz-id="' + iBuzzId + '">\
								</div>\
								<div class="pop_title"><div class="pop_title_inn">BUZZ<em>!</em></div></div>\
								<div class="popup_content_yellow">\
									' + sCommentText + '\
									<br clear="all" />\
									' + sStarHtml + '\
								</div>\
							</div>\
						</div>',
						'foreground-color':	'none',
						'background-color':	'#FFFFFF',
						'after-load':		function () {
							localStorage.setItem('buzzId', iBuzzId + '');
						},
						'opacity':			0.3,
						'box-style':		{
							'height':			'300px',
							'width':			'475px',
							'line-height':		'25px',
							'opacity':			1,
							'user-select':		'none',
							'-moz-user-select':	'none'
						}
					});
					delete oClosedBuzzList[iStudentId];
					localStorage.setItem('closedBuzzList', JSON.stringify(oClosedBuzzList));
				}
				catch (oException) {
					
				}
			}
		} else if(jsonObj.Status != '200' && jsonObj.Content == null && jsonObj.Error != null) {
			alert(jsonObj.Error.ErrorUserDescription);
		}
	}
}

/* 
  * ILIT-657
  * save previous frame  
*/
function retainEbookBroadcast() {	
	if (
		$('.broadcastOverlay #broadcastFrame').attr('src').indexOf('ebookplayer') > -1		 
	){
		sessionStorage.removeItem('PdfBroadcastJson');
		if(typeof document.getElementById('broadcastFrame').contentWindow.setLibraryProgress == 'function'){
			setSessionStorageItem('EBookPlayerSrc', $('.broadcastOverlay #broadcastFrame').attr('src'));
			try { window.frames["broadcastFrame"].setLibraryProgress(); } catch(e) { console.log(e); }
		}
	}
}

/* 
  * ILIT-657
  * save previous frame for pdf
*/
function retainPdfBroadcast(oPdfBroadcast) {
	try {
		var currentActionData = JSON.parse((JSON.parse(oPdfBroadcast)).Content.CurrentActionData),
			fullURLArr = currentActionData.MediaFullURL.split('|||'),
			bookFormat = fullURLArr[5];
		
		if (bookFormat.toLowerCase() == 'pdf') {
			sessionStorage.removeItem('EBookPlayerSrc');
			setSessionStorageItem('PdfBroadcastJson', oPdfBroadcast);	
		}
	} catch (e) { console.log(e); }
}

/* function to show survey question */
function showSurvey(json, surveyType)
{
	$('.surveyOverlay .question_box_space .question_part').html('');
	var actionDataJson = json;
	var alphabetHex = 65;
	
	$('.surveyOverlay .question_box_space .new_assignment_title').html(actionDataJson.content.trim()); // Question
	$('.surveyOverlay .surveyInner .surveyHeader').text('Survey');
	if (surveyType == "AdHocPoll") {
		$('.surveyOverlay .surveyInner .surveyHeader').text('Poll');
	}
	
	for(var j = 0; j < actionDataJson.answers.length; j++)
	{
		var answersJson = actionDataJson.answers[j];
		var ansHTML = '<li isCorrect="' + answersJson.is_correct + '">';
			ansHTML+= '<div class="check_box_view sprite left"></div>';
			ansHTML+= '<div class="answer_key left">&#' + alphabetHex + ';</div>';
			ansHTML+= '<div class="middle">' + answersJson.answer_text_html + '</div>';
			ansHTML+= '<div class="clear"></div>';
			ansHTML+= '</li>';
			
			$('.surveyOverlay .question_box_space .question_part').append(ansHTML);
			alphabetHex++;
	}
}

/* function to bind submit button on survey screen */
function bindSurveyScreen(surveyType)
{
	$('.surveyOverlay .question_box_space .question_part li').unbind('click').bind('click', function() {
		$('.surveyOverlay .question_box_space #btnSurveySubmit').removeClass('inactive');
		$('.surveyOverlay .question_box_space .question_part li').removeClass('active');
		$(this).addClass('active');
	});
	$('.surveyOverlay .question_box_space #btnSurveySubmit').addClass('inactive');
	$('.surveyOverlay .question_box_space #btnSurveySubmit').unbind('click').bind('click', function() {
		if($(this).hasClass('inactive')) {
			alert('Please select at least one option');	
		} else {
			var checkBoxIndex = parseInt($('.surveyOverlay .question_box_space .question_part li').index($('.surveyOverlay .question_box_space .question_part li.active')));
			var selectedOption = String.fromCharCode(parseInt(selectedOptionAlphabetHexStart + checkBoxIndex));
			$('.surveyOverlay .question_box_space .question_part li').unbind('click');
			$('.surveyOverlay .question_box_space #btnSurveySubmit').unbind('click');
			try { window.frames["wrapperFrame"].SetSurveyForStudent(surveyQuesID,surveyQuesAction,surveyQuesInfo,selectedOption,surveyType); } catch(e) { console.log(e); }
			$('.surveyOverlay .question_box_space #btnSurveySubmit').hide();
			$('.submitSurveyMsg').show();
		}
	});
}

/* function to close survey question */
function closeSurvey()
{
	surveyQuesID = '';
	surveyQuesInfo = '';
	$('.surveyOverlay').slideUp(300);
}

function closeBuzz (piBuzzId) { // IPP-4099
	var iBuzzId = (parseInt(piBuzzId) || parseInt(localStorage.getItem('buzzId'))) || 0,
		iStudentId = getSessionStorageItem("userID"),
		oClosedBuzzList = JSON.parse(localStorage.getItem('closedBuzzList') || '{}');
	
	if (iBuzzId > 0) {
		if (oClosedBuzzList[iStudentId] === undefined) {
			oClosedBuzzList[iStudentId] = iBuzzId;
		}
		localStorage.setItem('closedBuzzList', JSON.stringify(oClosedBuzzList));
	}
	
	objUtility.hidePopUp();
}

function closeBroadcast(bNonEbookOn)
{
	var bNonEbookOn = bNonEbookOn ? bNonEbookOn : false;
	
	if(!broadcastEbookVisible) {
		broadcastVisible = false;
		
		/* ILIT-657 reload previous ebookplayer or pdf */		 
		var eBookPlayerSrc = getSessionStorageItem('EBookPlayerSrc');
		var oPdfBroadcastJson = getSessionStorageItem('PdfBroadcastJson');
		
		// empty frame
		$('.broadcastOverlay').slideUp(300, function() {
			$('.broadcastOverlay #broadcastFrame').attr('src' , '');
			broadcastImage = '';
		});
		
		// if eBook was open then reload it
		if (eBookPlayerSrc && !bNonEbookOn) {
			broadcastEbookVisible = true;
			$('.broadcastOverlay').slideDown(300, function() {
				$('.broadcastOverlay #broadcastFrame').attr('src' , eBookPlayerSrc).on('load',function(){
					if ($('#broadcastFrame').contents().find(".sld_lft").length > 0){
						$("#broadcastFrame .sld_lft").removeClass('disabled');
					}
				})
				broadcastImage = '';
			});
			
		}
		else if (oPdfBroadcastJson && !bNonEbookOn) {	
			broadcastEbookVisible = true;
			// if pdf was open then reload it
			checkClassStatusCallBack(oPdfBroadcastJson);			
		}
		
	} else {
		if($('#pdfReaderBackBtn').prop('disabled')) {
			$('#pdfReaderBackBtn').prop('disabled', false);
		}
		if($('.broadcastOverlay .topBar').is(':visible')) {
			$('.broadcastOverlay .topBar #broadcastBackBtn').prop('disabled',false);
		} else {
			try {
				window.frames["broadcastFrame"].onBroadcastEnd();
			} catch(e) {}
		}
	}
}

function bindPDFReaderBackBtn() {	
	$('#broadcastBackBtn').unbind('click').bind('click', function(e) {
		var bookPDFInfo = (getSessionStorageItem('bookInfoPDFObj') == null) ? '' : getSessionStorageItem('bookInfoPDFObj');
		setSessionStorageItem('BookID', bookInfoPDFBroadcastObj.bookID);
		bookInfoPDFBroadcastObj.isBroadCast = true;
		saveLibProgress(bookInfoPDFBroadcastObj);
		launchPDFReader(bookPDFInfo);
		$('.broadcastOverlay').slideUp(300, function() {
			broadcastEbookID = '';
			broadcastEbookVisible = false;
			$('.broadcastOverlay #broadcastFrame').attr('src' , '');
			$('.broadcastOverlay .topBar .middle').html('');
			bookInfoPDFBroadcastObj = {};
		});
	});
	
	$('#pdfReaderBackBtn').unbind('click').bind('click', function(e) {
		bookInfoPDFObj.isBroadCast = false;
		saveLibProgress(bookInfoPDFObj);
		if(bookInfoPDFObj.context == '') {
			/* (isiLit20() === true)?
			$('.footer_in button').eq(1).trigger('click'):
			$('.footer_in button').eq(0).trigger('click'); */
			$('.footer_in button').eq(1).trigger('click');
		}
		$('.pdfReaderOverlay').hide();
		$('.pdfReaderOverlay .pdfReaderWrapper #pdfReaderFrame').attr('src' , '');
		$('.pdfReaderOverlay .topBar .middle').html('');
		removeSessionStorageItem('bookInfoPDFObj');
		if(broadcastEbookVisible && !sameCurrentPDFBroadcastPDF) {
			setSessionStorageItem('bookInfoPDFObj', JSON.stringify(bookInfoPDFObj));
		}
		if(sameCurrentPDFBroadcastPDF) {
			removeSessionStorageItem('bookInfoPDFObj');
			broadcastEbookID = '';
			broadcastEbookVisible = false, sameCurrentPDFBroadcastPDF = false;
		}
		bookInfoPDFObj = {};
	});
}

function checkLogout() {
	var checkLgout = window.confirm('Do you want to logout?');
	if(checkLgout)	{
		$('.loader').show();	
		if(INDEXEDDBSUPPORT) {
			clearCachedData(STUDNTDBNAME,callLogout);
		} else {
			callLogout();
		}
	}
}

function callLogout(){
	var classID = getSessionStorageItem("classID");
	var userID = getSessionStorageItem("userID");
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
	var url = SERVICEBASEURL + "Logout";
	AjaxCall(url, "POST", postObj, sp_callLogout);
}

function sp_callLogout(data)
{
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == 200)
	{
		//to log data
		currEventTimeStamp = getCurrentTimestamp();
		setSessionStorageItem("eventStartTime", getTimeInMs());
		setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
		setSessionStorageItem("verbID", "LO");
		
		//setSessionStorageItem("connectStatus", "false");
		//changeConnectStatus();
		// for sending log 
		var endTime = getTimeInMs();
		var verbVal = endTime- getSessionStorageItem("eventStartTime");
		var eventTimeStamp = getSessionStorageItem("eventTimeStamp");
		var verbID = getSessionStorageItem("verbID");
		createLog(verbID, verbVal, eventTimeStamp);
		
		clearSessionStorage();
		window.location.reload(true);
	}
	else
	{
		alert(jsonObj.Error.ErrorUserDescription);
	}
	   
}

function changeConnectStatus() {
	if(sessionStorage.getItem("connectStatus") == 'true') {
		$('#connectStatus').addClass('active');
	} else {
		$('#connectStatus').removeClass('active');
	}
}

var objUtility = new (function () {
	var oSelf = this,
		sLoaderId = null,
		bLoaderShown = false;
	this.getRandomNumberBetween = function (iNumberFrom, iNumberTo) {
		return Math.floor(Math.random() * (iNumberTo - iNumberFrom + 1) + iNumberFrom);
	};
	this.getRandomNumber = function (iDigits) {
		var iRandom = 0;
		if (
			typeof iDigits == 'undefined' ||
			iDigits == null
		) {
			iDigits = 1;
		}
		do {
			iRandom = Math.round(Math.random() * Math.pow(10, iDigits));
		} while (iRandom < Math.pow(10, iDigits - 1));
		return iRandom;
	};
	this.showPopUp = function (oConfig) {
		if (bLoaderShown) {
			return false;
		}
		if (
			typeof sLoaderId == 'undefined' ||
			sLoaderId == null
		) {
			sLoaderId = 'custom-loader-' + this.getRandomNumber(4);
		}
		var oStyleInfo = {
				'height':		jQuery(window).height() + 'px',
				'width':		jQuery(window).width() + 'px',
				'position':		'fixed',
				'z-index':		99999,
				'display':		'none',
				'left':			'0px',
				'top':			'0px',
				'text-align':	'center'
			},
			sStyle = '',
			dHeight = 150,
			dWidth = 350,
			dTop = Math.ceil(($(window).height() - dHeight) / 2),
			dLeft = Math.ceil(($(window).width() - dWidth) / 2),
			sBoxStyle = '';
			
		if (
			typeof oConfig	== 'undefined' ||
			oConfig == null
		) {
			oConfig = {
				'message': 			'Loading. Please wait&hellip;',
				'background-color':	'CDCDCD',
				'foreground-color':	'CDCDCD',
				'click-to-hide':	true
			};
		}
		else {
			if (
				typeof oConfig['message'] == 'undefined' ||
				oConfig['message'] == null
			) {
				oConfig['message'] = 'Loading. Please wait&hellip;';
			}
			if (
				typeof oConfig['background-color'] == 'undefined' ||
				oConfig['background-color'] == null
			) {
				oConfig['background-color'] = 'CDCDCD';
			}
			else {
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6})$/;
				if (!sRegex.test(oConfig['background-color']) && oConfig['background-color'] != 'none') {
					oConfig['background-color'] = 'CDCDCD';
				}
			}
			
			if (
				typeof oConfig['foreground-color'] == 'undefined' ||
				oConfig['foreground-color'] == null
			) {
				oConfig['foreground-color'] = oConfig['background-color'];
			}
			else {
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6}|none|transparent)$/;
				if (!sRegex.test(oConfig['foreground-color'])) {
					oConfig['foreground-color'] = oConfig['background-color'];
				}
			}
			
			if (typeof oConfig['click-to-hide'] != 'boolean') {
				oConfig['click-to-hide'] = true;
			}
			if (typeof oConfig['opacity'] != 'number') {
				oConfig['opacity'] = 0.3;
			}
			else if (parseFloat(oConfig['opacity']) < 0 || parseFloat(oConfig['opacity']) > 1) {
				oConfig['opacity'] = 0.3;
			}
		}
		
		if (typeof oConfig['box-style'] == 'object') {
			for (var sProp in oConfig['box-style']) {
				if (sProp == 'height') {
					dHeight = oConfig['box-style'][sProp].replace('px', '');
					dTop = Math.ceil(($(window).height() - parseFloat(dHeight)) / 2);
					continue;
				}
				if (sProp == 'width') {
					dWidth = oConfig['box-style'][sProp].replace('px', '');
					dLeft = Math.ceil(($(window).width() - parseFloat(dWidth)) / 2);
					continue;
				}
				sBoxStyle = sBoxStyle + (sBoxStyle.length > 0? ' ': '') + sProp + ':' + oConfig['box-style'][sProp] + ';'
			}
			if (typeof oConfig['box-style']['background'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + ';';
			}
			if (typeof oConfig['box-style']['border-radius'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' border-radius:20px;';
			}
		}
		else {
			sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + '; border-radius:20px;';
		}
		
		oConfig['background-color'] = oConfig['background-color'].replace('#', '');
		
		jQuery('.custom-loader').remove();
		for (var sProp in oStyleInfo) {
			sStyle = (sStyle.length? ' ': '') + sStyle + sProp + ':' + oStyleInfo[sProp] + ';';
		}
		sStyle = sStyle + ' opacity:' + oConfig['opacity'] + '; filter:alpha(opacity=' + (oConfig['opacity'] * 100) + ');';
		jQuery('body').append(
			'<div class="custom-loader" id="' + sLoaderId + '" style="background-color:#' + oConfig['background-color'] + '; ' + sStyle + '"></div>\
			<div style="text-align:center; color:#000; z-index:' + (oStyleInfo['z-index'] + 1) + '; position:fixed; left:' + dLeft + 'px; top:' + dTop + 'px; width:' + dWidth + 'px; height:' + dHeight + 'px; line-height:' + dHeight + 'px;' + sBoxStyle + '" id="' + sLoaderId + '-content">\
				' + oConfig['message'] + '\
			</div>'
		);
		jQuery('#' + sLoaderId).show();
		if (typeof oConfig['after-load'] == 'function') {
			oConfig['after-load'].call(oSelf);
		}
		bLoaderShown = true;
		if (oConfig['click-to-hide']) {
			jQuery('#' + sLoaderId)
				.off('click tap')
				.on('click tap', function () {
					oSelf.hidePopUp();
				})
		}
		return false;
	};
	this.isLoaderShown = function () {
		return bLoaderShown;
	};
	this.hidePopUp = function () {
		if (jQuery('#' + sLoaderId).length > 0) {
			jQuery('#' + sLoaderId).fadeOut('fast', function () {
				jQuery(this).remove();
				jQuery('#' + sLoaderId + '-content').remove();
			});
			bLoaderShown = false;
		}
	};
})();

// for book review
function openPage (poElement) {
	//var $this = $(poElement),
		//sParam = $this.data('param'),
		var dWindowHeight = $(window).height() - 5; // 5: Found by inspection
	
	//$this.parent().parent().hide();
	
	/*==== Show Loader ====*/
	$('.wrapper').hide();
	$('.bookReviewWrapper').css({
		'width':	'100%',
		'height':	dWindowHeight
	});
	$('.bookReviewWrapper .loader')
		.css({
			'width':		'100%',
			'height':		dWindowHeight,
			'line-height':	dWindowHeight + 'px',
			'text-align':	'center',
			'background':	'none',
			'display':		'block'
		})
		.html('<img src="media/ajax_loader_gray_512.gif" width="64" alt="" />');
	$('.bookReviewWrapper').show();
	/*== End Show Loader ==*/
	$('#bookReviewFrame')
		.css({
			'width':		'100%',
			'height':		dWindowHeight,
			'display':		'none'
		})
		.attr('src', 'App/book_review.html')
		.load(function () {
			$('.bookReviewWrapper .loader').removeAttr('style');
			$(this).show();
			
			// Resize IFrame
		});
		//add active class	
		var sCurTab = getSessionStorageItem("currentTab");
		$("#footer-btn-cont").find("."+sCurTab.charAt(0).toUpperCase() + sCurTab.slice(1)).addClass("active").trigger("click");
		$("#footer-btn-cont .Review").removeClass("active");
}

function bindDistrictEvents(){
	$(".help").off("click tap").on("click tap", function(){
		$(".tooltiptext").toggle();
	})
}

function selectLastDistrictAndUser(){
	var oLastLoginDetailsForStud = JSON.parse(getLocalStorageItem("lastLoginDetailsForStud"));
	if(oLastLoginDetailsForStud !== null){
		$("#districtDDL option").each(function(){
			if($(this).attr("value") == oLastLoginDetailsForStud.lastDistrictID){
				$(this).prop("selected", true).html($(this).text().trim());
			}
		})
		//ILIT-373
		//$("#txt_UserName").attr("value", oLastLoginDetailsForStud.lastUser);
	}
}