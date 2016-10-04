// TEACHER_LOGIN.JS

USERROLE = 'i'; // USERROLE OF INSTRUCTOR
var  lastDistrict = '';
var  lastUser = '';
var sDistrictPrefix = '';

// FUNCTION BIND LOGIN BUTTON
function bindLoginContinue()
{
	$(".continue_button").unbind('click').bind('click', function (e) {
		e.preventDefault();
		// TO LOG DATA FOR LOGIN
		loginCurrEventTimeStamp = getCurrentTimestamp();
		startTime = getTimeInMs();
		
		// check if district selected
		if(checkSelectedDistrict()){
			$('.continue_button .loader.login').show();
			loginValidation();
		}else{
			alert("Please Select Organization");
		}
	});
}

/* start for district dropdown */
function checkSelectedDistrict(){
	if($('#districtDDL option:selected').val().trim().length == 0){
		return false;
	}
	return true;
}
/* end for district dropdown */
		
// FUNCTION TO VALIDATE LOGIN DETAILS OF THE INSTRUCTOR
function loginValidation()
{
	var uname = $.trim($("#txt_UserName").val());
	var pwd = $.trim($("#txt_Password").val());
	var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
	
	//for district dropdown
	
	 sDistrictPrefix = ($('#districtDDL option:selected').attr("data-distSuffix").length != 0) ? "@"+$('#districtDDL option:selected').attr("data-distSuffix") : ''; 
	
	
	if(uname != '' && pwd != '' && uname != 'Username' && pwd != 'Password')
	{
		/*== suffix logic ==*/
		var finalUname = '';
			if(uname.indexOf("@") != -1){
				var afinalUname = uname.split("@");
				var sUserSuffix = afinalUname[afinalUname.length -1];
				
				//check if district suffix matches with the user entered suffix
				if(sUserSuffix == sDistrictPrefix.split("@")[1]){
					finalUname = uname;
				}
				else{
					finalUname = uname+sDistrictPrefix;
					/*== checks for various cases ==*/
					/*if(afinalUname.length>2){
						afinalUname.pop();
						afinalUname.push(sDistrictPrefix.split("@")[1]);
						finalUname = afinalUname.join('@'); 
					}
					else{
						if(sUserSuffix.indexOf(".") != -1){
							finalUname = uname+sDistrictPrefix;
						}
						else{
							afinalUname.pop();
							afinalUname.push(sDistrictPrefix);
							finalUname = afinalUname.join(''); 
						}
					}*/
				}
			}
			else{
				finalUname = uname+sDistrictPrefix;
			}
			
		/*== end suffix logic ==*/
		
		lastDistrict = $('#districtDDL option:selected').attr("value");
		lastUser = finalUname;
		
		var postObj = {
			TokenID: TOKENID,
			DeviceTimeStamp: getCurrentTimestamp(),
			UserName: finalUname,
			Password: pwd,
			IsCallerProjectionApp: 'n',
			CallerAppType: APPTYPE,
			CurrentAppVersionNo: APPVERNUM,
			CurrentAppZipRevisionNo: AppZipVerNum,
			MasterProductType:PRODTYPE
		};
		var url = SERVICEBASEURL + "ValidateLoginForInstructor";
		AjaxCall(url, "POST", postObj, loginValidationCallBack);
		checkInternetConnection();
	}
	else
	{
		alert('Please enter user name and password');
		$('.continue_button .loader.login').hide();
	}
}

// 
function loginValidationCallBack(dataJson) {
	internetCheckIntervalStart = true;
	window.clearTimeout(internetCheckInterval);
	var jsonObj = JSON.parse(dataJson);
	if(jsonObj.Content == null && jsonObj.Error != null)
	{
		alert(jsonObj.Error.ErrorUserDescription);
		$('.continue_button .loader.login').hide();
	}
	else if(jsonObj.Content != null && jsonObj.Error == null)
	{
		if($.trim(jsonObj.Content.UserRole.toLowerCase()) == USERROLE)
		{
			setLocalStorageItem("AppZipRevisionNo", jsonObj.Content.AppZipRevisionNo);
			endTime = getTimeInMs();
			// TIME DIFFERENCE BETWEEN SUCCESSFUL LOGIN AND DISPLAY OF GRADE POP-UP
			loginVerbVal = endTime-startTime;
			if(jsonObj.Content.ClassInfo != null) {
				if(jsonObj.Content.ClassInfo.length > 0) {
					USERID = $.trim(jsonObj.Content.UserID);
					setSessionStorageItem("userID", USERID);
					setSessionStorageItem("userName", $.trim(jsonObj.Content.UserFullName));
					setSessionStorageItem("userRole", $.trim(jsonObj.Content.UserRole.toLowerCase()));
					setSessionStorageItem("districtID", $.trim(jsonObj.Content.DistrictID));
					setSessionStorageItem("rumbaUserID", $.trim(jsonObj.Content.RumbaUserID));
					setSessionStorageItem('currentTabIndex', '0');					
					setSessionStorageItem('eventType', 'LRS');
					setSessionStorageItem('ClassInfo', JSON.stringify(jsonObj.Content.ClassInfo));					
					
					setSessionStorageItem("IsAutoReadBook", $.trim(jsonObj.Content.IsAutoReadBook));
					setSessionStorageItem("IsAutoCompleteGradeAssessment", $.trim(jsonObj.Content.IsAutoCompleteGradeAssessment));
					$('.continue_button .loader.login').hide();
					loadGrade(jsonObj);
					/*== set last district and User ==*/
					var lastUserLessSuffix = '';
					//var lastUserLessSuffix = (lastUser.indexOf('@') != -1) ? lastUser.split('@') : lastUser;
					if(sDistrictPrefix.length == 0){
						lastUserLessSuffix = lastUser;
						
					}
					else{
						if(lastUser.indexOf('@') != -1){
							var arr = lastUser.split('@');
							arr.pop();
							lastUserLessSuffix =  arr.join('@'); 
						}
						else{
							lastUserLessSuffix = lastUser;
						}
						
					}
					var oLastLoginDetails = {
							'lastDistrictID' : lastDistrict,
							'lastUser' : lastUserLessSuffix
						}	
					setLocalStorageItem("lastLoginDetailsForTeach", JSON.stringify(oLastLoginDetails));
					/*== end set last district and User ==*/
					
					//set product type
					setSessionStorageItem('productType', PRODTYPE);
				}
				else {
					alert('No class is assigned, please contact system administrator.');
					$('.continue_button .loader.login').hide();
				}
			} else {
				alert('No class is assigned, please contact system administrator.');
				$('.continue_button .loader.login').hide();
			}
		}
		else
		{
			alert('Invalid Username / Password.');
			$('.continue_button .loader.login').hide();
		}
	}
}

function loadGrade(data, bReturnHtml)
{
	var jsonObj = data,
		classLen = jsonObj.Content.ClassInfo.length,
		sClassListHtml = '',
		sCurrentClass = getSessionStorageItem("classID");
	
	if ([undefined, null].indexOf(bReturnHtml) !== -1) {
		bReturnHtml = false;
	}
	
	$('#classListUL').html('');
	if (classLen > 1)
	{
		for (var i = 0; i < classLen; i++)
		{
			sClassListHtml += '<li' + (
				sCurrentClass == jsonObj.Content.ClassInfo[i].ClassID?
				' class="disabled"':
				' onClick="selectClass(this);" class=""'
			) + '>' +
				'<div ' +
					'class="middle classList " ' +
					'productgradeid="' + jsonObj.Content.ClassInfo[i].ProductGradeID + '" ' +
					'productcode="' + jsonObj.Content.ClassInfo[i].ProductCode + '" ' +
					'productdisplaycode="' + (jsonObj.Content.ClassInfo[i].ProductDisplayCode || 'null') + '" ' +
					'classid="' + jsonObj.Content.ClassInfo[i].ClassID + '"' +
					'classstartdate="' + jsonObj.Content.ClassInfo[i].ClassStartDate + '"' +
					'targetgradecode="' + jsonObj.Content.ClassInfo[i].TargetGradeCode + '"' +
				'>' +
					jsonObj.Content.ClassInfo[i].ClassName +
				'</div>' +
				'<div class="clear"></div>' +
			'</li>';
		}
		
		if (bReturnHtml === true) {
			return sClassListHtml;
		}
		
		$('#classListUL').append(sClassListHtml);
		$('.gradeSelect').show();
		return sClassListHtml;
	}
	
	//to log data
	startTime = getTimeInMs();
	CLASSID = $.trim(jsonObj.Content.ClassInfo[0].ClassID);
	PRODGRDID = $.trim(jsonObj.Content.ClassInfo[0].ProductGradeID);
	setSessionStorageItem("classID", CLASSID);
	setSessionStorageItem("productGradeID", PRODGRDID);
	setSessionStorageItem('className', jsonObj.Content.ClassInfo[0].ClassName);
	setSessionStorageItem("targetGradeCode", jsonObj.Content.ClassInfo[0].TargetGradeCode);
	var sProductCode = $.trim(jsonObj.Content.ClassInfo[0].ProductCode).toLowerCase();
	setSessionStorageItem("productCode", sProductCode);
	setSessionStorageItem('currentTabIndex', (isiLit20()? '2': '0'));
	setSessionStorageItem("deploymentOptionNumber", $.trim(jsonObj.Content.ClassInfo[0].DeploymentOptionNumber));
	setSessionStorageItem("ClassStartDate", $.trim(jsonObj.Content.ClassInfo[0].ClassStartDate));
	
	currEventTimeStamp = getCurrentTimestamp();
	
	setSessionStorageItem("eventStartTime", startTime);
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
	setSessionStorageItem("verbID", "CS");
	
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		CallerUserID: USERID,
		CallerClassID: CLASSID,
		SessionState: 'Start'
	};
	var url = SERVICEBASEURL + "SetSession";
	AjaxCall(url, "POST", postObj, sp_SetSessionInfo);
	
	var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
	var _screenLabel = "iSeriesAppVersion:"+APPVERNUM+"["+deploymentServer+"]"
						+",iSeriesAppZipVersion:"+AppZipVerNum
						+",iSeriesAppType:"+APPTYPE
						+",iSeriesProductType:TeachiLit"
						+",UserID:"+USERID
						+",RumbaUserID:"+getSessionStorageItem("rumbaUserID");
					
	sendGoogleEvents('Login','Login',_screenLabel);
	ga('send', 'pageview', { 'dimension1': getSessionStorageItem("districtID") });
	ga('send', 'pageview', { 'dimension2': getSessionStorageItem("className") });
	ga('send', 'pageview', { 'dimension3': getSessionStorageItem("userID") });
	ga('send', 'pageview', { 'dimension4': getSessionStorageItem("userRole") });
}

function selectClass(thisClassSelectObj) {
	$('#classListUL li').removeClass('active');
	$(thisClassSelectObj).addClass('active');
}

function bindClassSelectBtn() {
	$('#btnClassSelect').unbind('click').bind('click', function(e) {
		var thisObj = $('#classListUL li.active');
		getGradeInfo(thisObj);
	});
	
	$('#btnCancelClassSelect').unbind('click').bind('click', function(e) {
		$('.gradeSelect').hide();
		$('#classListUL').html();
	});
}

function getGradeInfo(thisObj)
{   
	//to log data
	startTime = getTimeInMs();
	CLASSID = $.trim($('.classList', thisObj).attr('classid'));
	PRODGRDID = $.trim($('.classList', thisObj).attr('productgradeid'));
	setSessionStorageItem("classID", CLASSID);
	setSessionStorageItem("targetGradeCode", $.trim($('.classList', thisObj).attr('targetgradecode')));
	setSessionStorageItem("productGradeID", PRODGRDID);
	sProductCode = $.trim($('.classList', thisObj).attr('productcode')).toLowerCase();
	
	setSessionStorageItem('className', $('.classList', thisObj).text());
	setSessionStorageItem('productDisplayCode', $('.classList', thisObj).attr('productdisplaycode')); // IPP-4466
	setSessionStorageItem("productCode", sProductCode);
	setSessionStorageItem('currentTabIndex', (isiLit20()? '2': '0'));
	
	setSessionStorageItem("ClassStartDate", $.trim($('.classList', thisObj).attr('classstartdate')));
	
	//setSessionStorageItem("ClassStartDate", $.trim(jsonObj.Content.ClassInfo[0].ClassStartDate));
	
	currEventTimeStamp = getCurrentTimestamp();
	
	setSessionStorageItem("eventStartTime", startTime);
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
	setSessionStorageItem("verbID", "CS");
	
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		CallerUserID: USERID,
		CallerClassID: CLASSID,
		SessionState: 'Start'
	};
	var url = SERVICEBASEURL + "SetSession";
	AjaxCall(url, "POST", postObj, sp_SetSessionInfo);
		
	// TO SEND LOGIN EVENT TO GOOGLE ANALYTICS
	var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
	var _screenLabel = "iSeriesAppVersion:"+APPVERNUM+"["+deploymentServer+"]"
						+",iSeriesAppZipVersion:"+AppZipVerNum
						+",iSeriesAppType:"+APPTYPE
						+",iSeriesProductType:TeachiLit"
						+",UserID:"+USERID
						+",RumbaUserID:"+getSessionStorageItem("rumbaUserID");
	
	sendGoogleEvents('Login','Login',_screenLabel);
	ga('send', 'pageview', { 'dimension1': getSessionStorageItem("districtID") });
	ga('send', 'pageview', { 'dimension2': getSessionStorageItem("className") });
	ga('send', 'pageview', { 'dimension3': getSessionStorageItem("userID") });
	ga('send', 'pageview', { 'dimension4': getSessionStorageItem("userRole") });
}

function sp_SetSessionInfo(data) {
	if (data != null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			setSessionStorageItem('loginDone', true);
			
			/*==== IPP-5716 ====*/
			if (isiLit20() === true) {
				AjaxCall(
					SERVICEBASEURL + "GetClassSettings",
					"POST",
					{
						TokenID: TOKENID,
						DeviceTimeStamp: getCurrentTimestamp(),
						CallerUserID: getSessionStorageItem("userID"),
						CallerClassID: getSessionStorageItem("classID")
					},
					function (psClassSettingsData) {
						var oClassSettings = {},
							bIsDefaultMode = true;
						
						try {
							var oClassSettings = ((JSON.parse(psClassSettingsData) || {}).Content || {});
							setSessionStorageItem('classSettings', JSON.stringify(oClassSettings));
							bIsDefaultMode = (oClassSettings["DefaultValues"] === "Y");
						}
						catch (oException) {}
						// #TABINDEX : store settings tab index
						setSessionStorageItem(
							'currentTabIndex',
							(
								bIsDefaultMode?
								'4':
								'0'
							)
						);
						// for creating log of classStarted event
						endTime = getTimeInMs();
						var verbVal = endTime- getSessionStorageItem("eventStartTime");
						eventTimeStamp = getSessionStorageItem("eventTimeStamp");
						createLog(getSessionStorageItem("verbID"), verbVal, eventTimeStamp);
						$('.login_box').hide();
						afterLoginDone();
					}
				);
				
				/*=== IPP-6127 ===*/
				var postObj = {};
				var userID = getSessionStorageItem("userID").trim(),
					classID = getSessionStorageItem("classID").trim();
				
				postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: window.top.getCurrentTimestamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};				
				var url = SERVICEBASEURL + "CheckAssignAutoScoreGradeableItems";
				AjaxCall(
					url, 
					"POST", 
					postObj, 
					function (pobjCheckAssignAutoScoreGradeableItemsResponse) {
						/* objCheckAssignAutoScoreGradeableItemsResponse = JSON.parse(pobjCheckAssignAutoScoreGradeableItemsResponse); */
					}
				);
				
				return;
			}
			/*== End IPP-5716 ==*/
			
			// for creating log of classStarted event
			endTime = getTimeInMs();
			var verbVal = endTime- getSessionStorageItem("eventStartTime");
			eventTimeStamp = getSessionStorageItem("eventTimeStamp");
			createLog(getSessionStorageItem("verbID"), verbVal, eventTimeStamp);
			$('.login_box').hide();
			afterLoginDone();
		}
		else
		{
			alert(data.Error.ErrorUserDescription);
			return false;
		}
	}
	return false;
}

function afterLoginDone() {
	$(".continue_button").remove();
	$('.gradeSelect').remove();
	
	if ($('.loginWrapper').length == 0) {
		setSessionStorageItem("connectStatus", "true");
		setSessionStorageItem("showPopup", "true");
		changeIndicatorStatus('connect');
		CACHEDSTATUSINSTRUCTORKEYNAME = 'UAI_CACHE_STATUS_I_' + CLASSID + '_' + USERID;
		if (_Browser.isSafari) {
			INDEXEDDBSUPPORT = false;
		}
		createIndexedDB();
		init();
		return;
	}
	
	$('.loginWrapper').width($(window).width()).animate({ 'margin-left' : '-100%'}, 1000, function() {
		$(this).remove();
		$("body").css('background-image' , 'none');
		$('.afterLoginWrapper').fadeIn(700, function() {
			$('.loader').show();
			setSessionStorageItem("connectStatus", "true");
			setSessionStorageItem("showPopup", "true");
			changeIndicatorStatus('connect');
			CACHEDSTATUSINSTRUCTORKEYNAME = 'UAI_CACHE_STATUS_I_' + CLASSID + '_' + USERID;
			if(_Browser.isSafari) {
				INDEXEDDBSUPPORT = false;
			}
			createIndexedDB();
			init();
		});
	});
}

function switchClass () {
	var aClassInfo = JSON.parse(getSessionStorageItem('ClassInfo')),
		sClassesHtml = '';
	
	if (
		aClassInfo instanceof Array &&
		aClassInfo.length > 1
	) {
		sClassesHtml = loadGrade({
			Content: {
				ClassInfo: aClassInfo
			}
		}, true);
		
		$('body > .gradeSelect').remove();
		$('body').append(
			_.template(
				$('#class-switcher').html(),
				{
					'classSwitcherHtml':	sClassesHtml
				}
			)
		);
		$('body > .gradeSelect').show();
		$('#btnClassSelect')
			.unbind('click')
			.bind('click', function () {
				var thisObj = $('#classListUL li.active');
				if (thisObj.length == 0) {
					alert('Please select a class.');
					return false;
				}
				/*==== Manage Bottom Bar ====*/
					// Unbind Event-handlers from Project & Broadcast buttons
				$('button[id$="Status"]')
					.removeClass('active')
					.unbind('click');
				
					// Remove Projection and Broadcast-related Data from Session Storage
				removeSessionStorageItem('broadcastData');
				removeSessionStorageItem('broadcastStatus');
				
				removeSessionStorageItem('projectedData');
				removeSessionStorageItem('projectionStatus');
				
				removeSessionStorageItem("lessonInfoData");
				
				clearInterval(ROSTERINTERVALOBJ);
				
					// Unbind Event-handlers from Module buttons at the centre	
				var aModules = ['Planner', 'Lessons', 'Assignments', 'Performance', 'Library', 'Messages'];
				for (var iIndex = 0; iIndex < aModules.length; iIndex++) {
					$('.' + aModules[iIndex] + '.footerTab')
						.removeClass('active')
						.unbind('click');
				}
					// Empty the iframe content
				$('#wrapperFrame').attr('src', 'about:blank');
					// Unbind Event-handlers from three dots & human face icon
				$('.footer_inner .avatar')
					.removeClass('active')
					.unbind('click');
				$('.footer_inner button.logout_setting')
					.removeClass('active')
					.unbind('click');
				/*== End Manage Bottom Bar ==*/
				callLogout4SwitchClass(function () {
					getGradeInfo(thisObj);
				});
			});
		
		$('#btnCancelClassSelect')
			.unbind('click')
			.bind('click', function() {
				$('.gradeSelect').fadeOut('slow', function () {
					$(this).remove();
				});
			});
	}
}

function callLogout4SwitchClass (pfPostStopSessionCallback) {
	//to log data
	currEventTimeStamp = getCurrentTimestamp();
	setSessionStorageItem("eventStartTime", getTimeInMs());
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
	setSessionStorageItem("verbID", "LO");
	
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	
	if (getSessionStorageItem("verbID") != null && getSessionStorageItem("eventStartTime") != null) {
		var postObj = {
			TokenID: TOKENID,
			DeviceTimeStamp: getCurrentTimestamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			SessionState: 'Stop'
		};
		var url = SERVICEBASEURL + "SetSession";
		AjaxCall(url, "POST", postObj, pfPostStopSessionCallback);
	}
}