// intructor.js

var ROSTERDATA = null;
var ROSTERCALLTIME = 10000;
var ROSTERINTERVALOBJ;
var CLASSUSERDETAILSJSON = [];
var GENERAL = {
	"c_s_DIST_DDL_LABEL": "Select Organization",
	"c_s_PROD_TYPE_MYELD": "myeld",
	"c_s_PROD_TYPE_ILIT": "ilit",
	"c_s_PROD_TYPE_WTW": "wtw"
}

$(window).resize(function() {
	resize();
	resizeExpandImage();
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
	bindClassSelectBtn();
});

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
	var localStorageUserRole = (getLocalStorageItem('userRole') == null) ? null : $.trim(getLocalStorageItem('userRole').toLowerCase());
	var localStorageAdminLoginFlag = getLocalStorageItem('adminLogin');
	if(localStorageUserRole != null && $.inArray(localStorageUserRole,ADMINROLE) != -1 && localStorageAdminLoginFlag !== null) {
		setSessionStorageItem("userID", $.trim(getLocalStorageItem('userID')));
		setSessionStorageItem("userName", $.trim(getLocalStorageItem('userName')));
		setSessionStorageItem("userRole", $.trim(getLocalStorageItem('userRole').toLowerCase()));
		setSessionStorageItem("districtID", $.trim(getLocalStorageItem('districtID')));
		setSessionStorageItem("rumbaUserID", $.trim(getLocalStorageItem('rumbaUserID')));
		setSessionStorageItem('currentTabIndex', $.trim(getLocalStorageItem('currentTabIndex')));
		setSessionStorageItem('eventType', 'LRS');
		setSessionStorageItem("classID", $.trim(getLocalStorageItem('classID')));
		setSessionStorageItem("productCode", $.trim(getLocalStorageItem('productCode')));
		setSessionStorageItem("productGradeID", $.trim(getLocalStorageItem('productGradeID')));
		setSessionStorageItem('className', $.trim(getLocalStorageItem('className')));
		setSessionStorageItem("deploymentOptionNumber", "A");
		setSessionStorageItem('loginDone', true);
		$('#btnLogout').prop('disabled', true);
		removeLocalStorageItem('adminLogin');
		afterLoginDone();
	} else {
		var loginDone = getSessionStorageItem('loginDone');
		var userRole = getSessionStorageItem('userRole');
		if($.inArray(userRole,ADMINROLE) == -1) {
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
						$("body").addClass("instructor");
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
		} else {
			$('#btnLogout').prop('disabled', true);
			afterLoginDone();
		}
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

function init() {
	$('.loader').show();
	//initAudioRecorder();
	PRODGRDID = getSessionStorageItem('productGradeID');
	USERID = getSessionStorageItem('userID');
	CLASSID = getSessionStorageItem('classID');
	CACHEDSTATUSINSTRUCTORKEYNAME = 'UAI_CACHE_STATUS_I_' + CLASSID + '_' + USERID;
	if(_Browser.isSafari) {
		INDEXEDDBSUPPORT = false;
	}
	//initAudioPlayingObject();
	/*==== iLit 20 Change ====*/
	$('#button-container').css('visibility', 'hidden');
	$('#broadcastStatus').hide();
	/*== End iLit 20 Change ==*/
	initInfoStorage();
	resize();
	resizeExpandImage();
	getClassUserDetails();
}	

function initInfoStorage()
{
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					ProductGradeID : PRODGRDID,
                    CallerClassID : CLASSID,
                    CallerUserID : USERID

				};
	var url = SERVICEBASEURL + "GetGradeInfoInDetail";
	AjaxCall(url, "POST", postObj, GetGradeInfoInDetailCallBack);
	return false;
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
			var gradeItemsInfoJsPath = contentBaseURL + PRODUCTCODE + '/curriculum/' + gradeCode + '/grade_items_info.js';
			var libraryBookPath = contentBaseURL + libraryMidPath + '/';			
			var libraryPath = (
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
			setSessionStorageItem('gradeItemsInfoJsPath', gradeItemsInfoJsPath);
			setSessionStorageItem('assignmentPath', assignmentPath);
			setSessionStorageItem('libraryBookPath', libraryBookPath);
			setSessionStorageItem('libraryPath', libraryPath);
			setSessionStorageItem('totalUnits', totalUnits);
			setSessionStorageItem('totalWeeksWithInGrade', totalWeeksWithInGrade);
			setSessionStorageItem('totalLessonsWithInGrade', totalLessonsWithInGrade);
			setSessionStorageItem('unitsWeeksDetails', data.Content.UnitsWeeksDetails);
			
			afterInfoStorage();
			
		} else {
			alert(data.Error.ErrorUserDescription);
		}
	}
	return false;
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
	
	return false;
}

// FUNCTION TO GET TOC ITEMS OF SERVICES DB AND MAP TO GRADE_ITEMS.JS DATA
function getTOCItemsAndMap() {
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		ProductGradeID : PRODGRDID,
		CallerClassID : CLASSID,
		CallerUserID : USERID

	};
	var url = SERVICEBASEURL + "GetTOCItems";
	AjaxCall(url, "POST", postObj, getTOCItemsAndMapCallBack);
	return false;
}

// CALLBACK FUNCTION FOR GetTOCItems SERVICEBASEURL
function getTOCItemsAndMapCallBack(response) {
	ASSIGNMENTITEMARR = []; // Clears assignment (assessment) list while switching class
	if(response != null ) {
		var resp = JSON.parse(response);
		if(resp.Status == '200') {
			var mapContent = resp.Content;
			if(mapContent.length > 0) {
				for(var i = 0 ; i < mapContent.length; i++) {
					CMSIDsTOSERVCIDsMAPPING[mapContent[i].CMSItemID] = mapContent[i].ItemID;
					SERVCIDsTOCMSIDsMAPPING[mapContent[i].ItemID] = mapContent[i].CMSItemID;
				}
				mapCMSIDsToTOCIDs(CMSIDsTOSERVCIDsMAPPING);
				createAssignmentArray();
				fetchCurrentLessonForClass();
			} else {
				alert('Oops, something is not right with how this class has been setup. Please contact the administrator.');
			}
		} else {
			alert('Oops, something is not right with how this class has been setup. Please contact the administrator.');
		}
	} else {
		alert('Mapping data not available. Please check.');
	}
}

function fetchCurrentLessonForClass() {
	var classID = getSessionStorageItem("classID");
	var userID = getSessionStorageItem("userID");
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		CallerUserID: userID,
		CallerClassID: classID
	};
	var url = SERVICEBASEURL + "GetCurrentLessonForClass";
	AjaxCall(url, "POST", postObj, sp_GetCurrentLessonForClass);
}

function sp_GetCurrentLessonForClass(data) {
	if(data != null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			if(data.Content != null) {
				var itemID = SERVCIDsTOCMSIDsMAPPING[data.Content.ItemID.trim()];
				var rataBookId = (data.Content.RATA_ItemID.trim() == '')? '': SERVCIDsTOCMSIDsMAPPING[data.Content.RATA_ItemID.trim()];
				if(itemID !== undefined) {
					setSessionStorageItem(
						"lessonInfoData",
						'{' +
							'"method":"LaunchGradeItem",' +
							'"unitNumber":"' + data.Content.UNIT_NUMBER + '",' +
							'"weekNumber":"' + data.Content.WEEK_NUMBER + '",' +
							'"itemId":"' + itemID + '",' +
							'"itemType":"lesson",' +
							'"previewLesson":"0",' +
							'"rataBookId":"' + rataBookId + '",' +
							'"lessonType" : "lesson"' +
						'}'
					);
				}
			}
			getFooterButton();
			checkLessonButton();
			bindFooterButton();
			checkCurrentTab();
			bindExpandBackBtn();
			changeIndicatorStatus('connect');
			changeIndicatorStatus('project');
			changeIndicatorStatus('broadcast');
			$('.loader').hide();
		} else {
			alert(data.Error.ErrorUserDescription);
		}
	}
	return false;
}

function getFooterButton () {
	var sProductCode = getSessionStorageItem('productCode') || '';
	$('#button-container').html(
		_.template(
			$('#footer-buttons').html(),
			{
				'productCode':	sProductCode
			}
		)
	).css('visibility', 'visible');
	
	$('#broadcastStatus')[(strStartsWith(sProductCode, ILIT20PREFIX, true)? 'hide': 'show')]();
}

function checkCurrentTab()
{
	var tabIndex = getSessionStorageItem('currentTabIndex');
	$('.footer_in button').eq(parseInt(tabIndex)).trigger('click');
	return false;
}

function resize()
{
	/*--- below code to adjust iframe height according to the browser window ---*/
	var winH = $(window).height();
	var topBarH = $('.footer_inner').height();
	var iFrameH = parseInt(winH - topBarH - 5);
	
	$('#wrapperFrame').animate({ 'height' : iFrameH + 'px' }, 10);
	$('.iframeWrap').animate({ 'height' : iFrameH + 'px' }, 10);
	
	return false;
}

function resizeExpandImage()
{
	/*--- below code to adjust expand screen's image parent div  ---*/
	var expOverlayW = $('.expandOverlay').width();
	var expOverlayH = $('.expandOverlay').height();
	var topBarH = $('.expandOverlay .topBar').height();
	var imgParDivH = parseInt(expOverlayH - topBarH);
	
	$('.expandOverlay .expandImgWrapper').animate({ 'width' : expOverlayW + 'px', 'height' : imgParDivH + 'px', 'max-width' : expOverlayW + 'px', 'max-height' : imgParDivH + 'px' }, 1);
	
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
			if(targetClass.indexOf('avatar') == -1 && targetClass.indexOf('toc_profile') == -1) {
				if($('#studentConnectPopup').is(':visible')) {
					$('#studentConnectPopup').fadeOut(100);
					$('.footer_inner .avatar').removeClass('active');
					$('.avatar_inner img').attr('src', 'media/avtar.png');
				}
			}
			/*==== IPP-4099 ====*/
			if (targetElem.attr('id') !== 'btnConnectStatus') {
				if ($('#connect-options-cont').is(':visible')) {
					$('#connect-options-cont').fadeOut(100);
				}
			}
			/*== End IPP-4099 ==*/
		}
		catch(e) {}
		
	});
}

function bindIframeEvent() {
	$('#wrapperFrame').load(function(){
	// Get a reference to the iframe document
	var iframeDoc = $('#wrapperFrame').contents().get(0);
	
	// Bind event to iframe document on load
		$(iframeDoc).unbind('click').bind('click', function( event ) {
			if($('#infoToolTip').is(':visible')) {
				$('#infoToolTip').fadeOut(100);
				$('.footer_inner button.logout_setting').removeClass('active');
			}
			if($('#studentConnectPopup').is(':visible')) {
				$('#studentConnectPopup').fadeOut(100);
				$('.footer_inner .avatar').removeClass('active');
				$('.avatar_inner img').attr('src', 'media/avtar.png');
			}
			/*==== IPP-4099 ====*/
			if ($('#connect-options-cont').is(':visible')) {
				$('#connect-options-cont').fadeOut(100);
			}
			/*== End IPP-4099 ==*/
		});
	});
}

function bindFooterButton()
{
	var bIsILIT20 = isiLit20();
	$('.footer_in button.footerTab').unbind('click').bind('click', function(e) {
		e.preventDefault();
		var htmlFileName = '';
		var buttonName = $.trim($(this).attr('class').toLowerCase());
		var tabIndex = $('.footer_in button.footerTab').index($(this));
		if(buttonName.indexOf('lessons') == -1) {
			if(getSessionStorageItem('lessonBackupInfoData') != null && getSessionStorageItem('lessonInfoData') != null) {
				setSessionStorageItem('lessonInfoData', getSessionStorageItem('lessonBackupInfoData'));
				if(getSessionStorageItem('lessonBackupInfoData') == "null") {
					removeSessionStorageItem('lessonInfoData');
					//removeSessionStorageItem('enableLesson');
				}
				removeSessionStorageItem('lessonBackupInfoData');
			}
		}
		setSessionStorageItem('currentTabIndex', tabIndex);
		$('.footer_in button.footerTab').removeClass('active');
		$(this).addClass('active');
		var cacheFreeValue = getTimeInMs();
		switch(true)
		{
			case (buttonName.indexOf('snapshot') > -1):
				$('#wrapperFrame').attr('src','App/snapshot.html?_=' + cacheFreeValue);
				setSessionStorageItem("verbID", "T-PTO"); //to log data
				setSessionStorageItem("currentTab", "snapshot");
				break;
			case (buttonName.indexOf('planner') > -1):
				$('#wrapperFrame').attr('src','App/planner.html?_=' + cacheFreeValue);
				setSessionStorageItem("verbID", "T-PTO"); //to log data
				setSessionStorageItem("currentTab", "planner");
				break;
			case (buttonName.indexOf('lessons') > -1):
				$('#wrapperFrame').attr('src','App/' + (bIsILIT20 === true? 'organizer': 'lesson') + '.html?_=' + cacheFreeValue);
				break;
			case (buttonName.indexOf('assignments') > -1):
				setSessionStorageItem("verbID", "T-ATO"); //to log data
				setSessionStorageItem("currentTab", "assignments");
				$('#wrapperFrame').attr('src','App/assignment_instructor' + (bIsILIT20 === true? '_20': '') + '.html?_=' + cacheFreeValue);
				break;
			case (buttonName.indexOf('performance') > -1):
				$('#wrapperFrame').attr('src','App/performance' + (bIsILIT20 === true? '_20': '') + '.html?_=' + cacheFreeValue);
				setSessionStorageItem("verbID", "T-PRTO"); //to log data
				setSessionStorageItem("currentTab", "performance");
				break;
			case (buttonName.indexOf('library') > -1):
				$('#wrapperFrame').attr('src','App/library.html?_=' + cacheFreeValue);
				//setSessionStorageItem("verbID", "T-LBTO"); //to log data
				setSessionStorageItem("currentTab", "library");
				break;
			case (buttonName.indexOf('messages') > -1):
				$('#wrapperFrame').attr('src','App/instructor_message.html?_=' + cacheFreeValue);
				setSessionStorageItem("verbID", "T-MTO"); //to log data
				setSessionStorageItem("currentTab", "messages");
				break;
			case (buttonName.indexOf('settings') > -1):
				$('#wrapperFrame').attr('src','App/settings.html?_=' + cacheFreeValue);
				setSessionStorageItem("verbID", "T-PTO"); //to log data
				setSessionStorageItem("currentTab", "settings");
				break;
			default:
				alert('No Method Found!');
				break;
		}
		
		//to log data
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
	
	bindIframeEvent();
	
	$('.footer_inner .avatar').unbind('click').bind('click', function(e) {
		if($('#infoToolTip').is(':visible')) {
			$('#infoToolTip').fadeOut(100);
			$('.footer_inner button.logout_setting').removeClass('active');
		}
		if($(this).hasClass('active')) {
			$('#studentConnectPopup').fadeOut(100);
			$(this).removeClass('active');
			$('.avatar_inner img', this).attr('src', 'media/avtar.png');
		} else {
			$(this).addClass('active');
			$('.avatar_inner img', this).attr('src', 'media/avtar_hover.png');
			$('#studentConnectPopup ul').html('<li class="student">Loading.......</li>');
			$('#studentConnectPopup').fadeIn(100);
			checkRosterForClassCallBack(ROSTERDATA);
		}
	});
	
	$('#pdfReaderBackBtn').unbind('click').bind('click', function(e) {
		bookInfoPDFObj.isBroadCast = false;
		saveLibProgress(bookInfoPDFObj);
		if(bookInfoPDFObj.context == '') {
			$('.footer_in button').eq(4).trigger('click');
		}
		$('.pdfReaderOverlay').hide();
		$('.pdfReaderOverlay .pdfReaderWrapper #pdfReaderFrame').attr('src' , '');
		$('.pdfReaderOverlay .topBar .middle').html('');
		bookInfoPDFObj = {};
	});
	/*==== IPP-4099 ====*/
	$('#btnConnectStatus')
		.unbind('click')
		.bind('click', function () {
			if ($('#connect-options-cont').is(':visible')) {
				$('#connect-options-cont').fadeOut('fast', function () {
					$(this).remove();
				});
				return false;
			}
			if ($('#connect-options-cont').length === 0) {
				var sHtml = _.template(
					$('#connect-options').html(),
					{
						connectOptions:	[
							{
								'dataAttribs':	[ { 'prop':	'param', 'value': 'poll' } ],
								'handler':		'openPage',
								'label':		'Poll'
							},
							{
								'dataAttribs':	[ { 'prop':	'param', 'value': 'buzz' } ],
								'handler':		'openPage',
								'label':		'Buzz'
							}
						]
					}
				);
				
				$('body').append(sHtml);
			}
			var dRight = (parseFloat($(window).width()) - parseFloat($(this).position().left) - 85); // 85: Found by inspection
			$('#connect-options-cont')
				.css({
					'right':	dRight + 'px',
					'bottom':	(parseFloat($(this).height()) + 20) + 'px' // 20: Found by inspection
				})
				.show();
		});
	/*== End IPP-4099 ==*/
}

function getClassUserDetails() {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
	var url = SERVICEBASEURL + "GetClassUserDetails";
	AjaxCall(url, "POST", postObj, getClassUserDetailsCallBack); checkInternetConnection(); // 1st call
}

function getClassUserDetailsCallBack(data) {
	internetCheckIntervalStart = true;
	if(data != null) {
		var jsonData = JSON.parse(data);
		if(jsonData.Status == '200') {
			CLASSUSERDETAILSJSON = jsonData.Content;
			if(CLASSUSERDETAILSJSON.length == 0) {
				window.clearInterval(ROSTERINTERVALOBJ);
			}
			checkRosterForClass();
		} else {
			alert(jsonData.Error.ErrorUserDescription);
			getClassUserDetails();
		}
	}
}

/* function to check roster of the class after login */
function checkRosterForClass()
{
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
	var url = SERVICEBASEURL + "GetRosterForClass";
	AjaxCall(url, "POST", postObj, checkRosterForClassCallBack, "GetRosterForClass"); checkInternetConnection(); // 1st call
	window.clearInterval(ROSTERINTERVALOBJ);
}

function checkRosterForClassCallBack(data) {	
	ROSTERINTERVALOBJ = window.setInterval(function() { checkRosterForClass(); }, ROSTERCALLTIME);
	if (data != 'Error') {
		internetCheckIntervalStart = true;
	}
	if(data != null && data != 'Error') {
		var jsonData = JSON.parse(data);
		if(parseInt(jsonData.Status) == 200) {
			if(CLASSUSERDETAILSJSON.length === jsonData.Content.length) {
				for(var i = 0; i < jsonData.Content.length; i++) {
					var userID = jsonData.Content[i].UserID;
					for(var j=0; j < CLASSUSERDETAILSJSON.length; j++) {
						var innerUserID = CLASSUSERDETAILSJSON[j].UserID;
						if(userID===innerUserID) {
							jsonData.Content[i].UserDisplayName = CLASSUSERDETAILSJSON[j].UserDisplayName;
							break;
						}
					}
				}
			} else {
				alert("UserDetails mismatch. Please re-login!");
				return false;
			}
			ROSTERDATA = JSON.stringify(jsonData);
			if($('#studentConnectPopup').is(':visible')) {
				var content = jsonData.Content;
				var onlStudCount = 0, offlStudCount = 0, onlineArr = [], offlineArr = [];
				for(var i = 0; i < content.length; i++) {
					if(content[i].UserRole.toString().toLowerCase().trim() == 'S'.toLowerCase()) {
						if(content[i].UserInLiveSession.toString().toLowerCase().trim() == 'true'.toLowerCase()) {
							onlineArr[onlStudCount] = content[i].UserDisplayName.toString().trim();
							onlStudCount++;
						} else if(content[i].UserInLiveSession.toString().toLowerCase().trim() == 'false'.toLowerCase()) {
							offlineArr[offlStudCount] = content[i].UserDisplayName.toString().trim();
							offlStudCount++;
						}
					}
				}
				onlineArr.sort();
				offlineArr.sort();
				$('#studentConnectPopup ul').html('');
				for(var i = 0; i < onlineArr.length; i++) {
					$('#studentConnectPopup ul').append('<li class="student"><div class="online"></div><div class="table_inner_box_img left"><img src="media/student_img3.png" alt=""> </div><div class="middle">' + onlineArr[i] + '</div> <div class="clear"></div></li>');
				}
				for(var i = 0; i < offlineArr.length; i++) {
					$('#studentConnectPopup ul').append('<li class="student"><div class="offline"></div><div class="table_inner_box_img left"><img src="media/student_img3.png" alt=""> </div><div class="middle">' + offlineArr[i] + '</div> <div class="clear"></div></li>');
				}
				if(onlStudCount == 0 && offlStudCount == 0) {
					$('#studentConnectPopup ul').html('<div class="poll_container"><div class="poll sprite"></div><div class="no_polls">No Students in this Roster</div></div>');
				}
			}
		} else {
			alert(jsonData.Error.ErrorUserDescription);
		}
	}
}

function setRosterVariableForClientNativeJS(){
	return ROSTERDATA;
}

function bindExpandBackBtn()
{
	$('.expandOverlay .btnBack').unbind('click').bind('click', function(e) {
		$('.expandOverlay').slideUp(500);
	});
}

function showExpandOverlay(imgUrl)
{
	$('.expandOverlay .expandImgWrapper img').attr('src', imgUrl);
	$('.expandOverlay').slideDown(500, function() {
		resizeExpandImage();
	});
}

function checkLogout() {
	var checkLogout = window.confirm('Do you want to logout?');
	if(checkLogout)	{
		$('.loader').show();	
		if(INDEXEDDBSUPPORT) {
			clearCachedData(INSTRDBNAME,callLogout);
		} else {
			callLogout();
		}
	}
}

function callLogout() {
	//to log data
	currEventTimeStamp = getCurrentTimestamp();
	setSessionStorageItem("eventStartTime", getTimeInMs());
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
	setSessionStorageItem("verbID", "LO");
	
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	
	if(getSessionStorageItem("verbID")!= null && getSessionStorageItem("eventStartTime")!= null )
	{
		var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					SessionState: 'Stop'
				};
		var url = SERVICEBASEURL + "SetSession";
		AjaxCall(url, "POST", postObj, sp_SetSession);
	}
}

function sp_SetSession(data)
{
	var jsonObj = JSON.parse(data);
	if(jsonObj.Content != null && jsonObj.Error == null)
	{
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
	else if(jsonObj.Content == null && jsonObj.Error != null)
	{
		if(jsonObj.Error.ErrorCode.toLowerCase() == 'U1005'.toLowerCase()) {
		}
		alert(jsonObj.Error.ErrorUserDescription);
	}
}

function sp_callLogout(data)
{
	var jsonObj = JSON.parse(data);
	if(jsonObj.Content != null && jsonObj.Error == null)
	{
		// for sending log 
		var endTime = getTimeInMs();
		var verbVal = endTime- getSessionStorageItem("eventStartTime");
		var eventTimeStamp = getSessionStorageItem("eventTimeStamp");
		var verbID = getSessionStorageItem("verbID");
		createLog(verbID, verbVal, eventTimeStamp);
		clearSessionStorage();
		window.location.reload(true);
	}
	else if(jsonObj.Content == null && jsonObj.Error != null)
	{
		alert(jsonObj.Error.ErrorUserDescription);
	}
}

function activateLessonTab()
{
	$('.footer_in button').removeClass('active');
	$('.footer_in #btnLesson').addClass('active');
	var tabIndex = $('.footer_in button').index($('#btnLesson'));
	setSessionStorageItem('currentTabIndex', tabIndex);
	
	//to log data
	setSessionStorageItem("verbID", "IL");
	currEventTimeStamp = getCurrentTimestamp();
	setSessionStorageItem("eventStartTime", getTimeInMs());
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);

}


function checkLessonButton()
{
	var bIsILIT20 = isiLit20();
	if(getSessionStorageItem("lessonInfoData") != null)
	{
		$('#btnLesson').prop('disabled', false);
	}
	else
	{
		$('#btnLesson').prop('disabled', true);
	}
	if (bIsILIT20 === true) { $('#btnLesson').prop('disabled', false); }
}

function changeIndicatorStatus(indicatorType)
{
	if(indicatorType.toLowerCase() == 'connect'.toLowerCase())
	{
		if(getSessionStorageItem('connectStatus') != null)
		{
			if(getSessionStorageItem("connectStatus") == 'true')
			{
				$('#connectStatus').addClass('active');
			}
			else
			{
				$('#connectStatus').removeClass('active');
			}
		}
	}
	else if(indicatorType.toLowerCase() == 'project'.toLowerCase())
	{
		if(getSessionStorageItem('projectionStatus') != null)
		{
			if(getSessionStorageItem('projectionStatus').toLowerCase() == 'Start'.toLowerCase())
			{
				$('#projectStatus').addClass('active');
				var dataJSON = getSessionStorageItem("projectedData");
				if(dataJSON != null) {
					var dataJsonObj = JSON.parse(dataJSON);
					if(dataJsonObj.type.toLowerCase() != 'TextNAudio'.toLowerCase()) {
						$('#projectStatus.active').unbind('click').bind('click', function() {
							var data = getSessionStorageItem("projectedData");
							if(data != null) {
								var jsonObj = JSON.parse(data);
								jsonObj.action = 'Stop';
								window.frames["wrapperFrame"].SetProjectSlide(jsonObj.type, jsonObj.action, jsonObj.mediaid, "");
								window.frames["wrapperFrame"].resetPBCaption(indicatorType);
							}
						});
					}
				}
			}
			else
			{
				$('#projectStatus.active').unbind('click');
				$('#projectStatus').removeClass('active');
			}
		}
	}
	else if(indicatorType.toLowerCase() == 'broadcast'.toLowerCase())
	{
		if(getSessionStorageItem('broadcastStatus') != null)
		{
			if(getSessionStorageItem('broadcastStatus').toLowerCase() == 'Start'.toLowerCase())
			{
				$('#broadcastStatus').addClass('active');
				var dataJSON = getSessionStorageItem("broadcastData");
				if(dataJSON != null) {
					var dataJsonObj = JSON.parse(dataJSON);
					if(dataJsonObj.type.toLowerCase() != 'eBook'.toLowerCase()) {
						$('#broadcastStatus.active').unbind('click').bind('click', function() {
							var data = getSessionStorageItem("broadcastData");
							if(data != null) {
								var jsonObj = JSON.parse(data);
								jsonObj.action = 'Stop';
								window.frames["wrapperFrame"].SetBroadcastSlide(jsonObj.type, jsonObj.action, jsonObj.mediaid);
								window.frames["wrapperFrame"].resetPBCaption(indicatorType);
							}
						});
					}
				}
			}
			else
			{
				$('#broadcastStatus.active').unbind('click');
				$('#broadcastStatus').removeClass('active');
			}
		}
	}
}
/*==== IPP-4099 ====*/
function openPage (poElement) {
	var $this = $(poElement),
		sParam = $this.data('param'),
		dWindowHeight = $(window).height() - 5; // 5: Found by inspection
	
	$this.parent().parent().hide();
	
	/*==== Show Loader ====*/
	$('.wrapper').hide();
	$('.connectWrapper').css({
		'width':	'100%',
		'height':	dWindowHeight
	});
	$('.connectWrapper .loader')
		.css({
			'width':		'100%',
			'height':		dWindowHeight,
			'line-height':	dWindowHeight + 'px',
			'text-align':	'center',
			'background':	'none',
			'display':		'block'
		})
		.html('<img src="media/ajax_loader_gray_512.gif" width="64" alt="" />');
	$('.connectWrapper').show();
	/*== End Show Loader ==*/
	$('#connectFrame')
		.css({
			'width':		'100%',
			'height':		dWindowHeight,
			'display':		'none'
		})
		.attr('src', 'App/connect.html?screentype=' + sParam)
		.load(function () {
			$('.connectWrapper .loader').removeAttr('style');
			$(this).show();
			// Resize IFrame
		});
}
/*==== IPP-4099 ====*/

function bindDistrictEvents(){
	$(".help").off("click tap").on("click tap", function(){
		$(".tooltiptext").toggle();
	})
}

function selectLastDistrictAndUser(){
	var oLastLoginDetailsForTeach = JSON.parse(getLocalStorageItem("lastLoginDetailsForTeach"));
	if(oLastLoginDetailsForTeach !== null){
		$("#districtDDL option").each(function(){
			if($(this).attr("value") == oLastLoginDetailsForTeach.lastDistrictID){
				$(this).prop("selected", true).html($(this).text().trim());
			}
		})
		$("#txt_UserName").attr("value", oLastLoginDetailsForTeach.lastUser);
	}
}