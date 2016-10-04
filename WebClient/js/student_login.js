// STUDENT_LOGIN.JS

USERROLE = 's'; // USERROLE OF STUDENT

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

// FUNCTION TO VALIDATE LOGIN DETAILS OF THE STUDENT
function loginValidation()
{
	var uname = $.trim($("#txt_UserName").val());
	var pwd = $.trim($("#txt_Password").val());
	var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
	
	//for district dropdown
	var sDistrictPrefix = ($('#districtDDL option:selected').attr("data-distSuffix").length != 0) ? "@"+$('#districtDDL option:selected').attr("data-distSuffix") : '';
	
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
		var url = SERVICEBASEURL + "ValidateLoginForStudent";
		AjaxCall(url, "POST", postObj, loginValidationCallBack);
		checkInternetConnection();
	}
	else
	{
		alert('Please enter user name and password');
		$('.continue_button .loader.login').hide();
	}
}

// CALLBACK FUNCTION FOR LOGIN VALIDATION SERVICE CALL
function loginValidationCallBack(data) {
	internetCheckIntervalStart = true;
	window.clearTimeout(internetCheckInterval);
	var jsonObj = JSON.parse(data);
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
			// TIME DIFFERENCE BETWEEN SUCCESSFUL LOGIN AND DISPLAY OF GRADE POPUP
			loginVerbVal = endTime-startTime;
			if(jsonObj.Content.ClassInfo != null) {
				if(jsonObj.Content.ClassInfo.length > 0) {
					// TO LOG DATA FOR CLASS STARTED
					startTime = getTimeInMs();
					
					CLASSID = $.trim(jsonObj.Content.ClassInfo[0].ClassID);
					setSessionStorageItem("classID", CLASSID);
					if(jsonObj.Content.ClassInfo[0].ClassName != undefined) {
						setSessionStorageItem('className', $.trim(jsonObj.Content.ClassInfo[0].ClassName));
					} else {
						setSessionStorageItem('className', 'Class Name');
					}
					setSessionStorageItem("productGradeID", $.trim(jsonObj.Content.ClassInfo[0].ProductGradeID));
					//PRODUCTCODE = $.trim(jsonObj.Content.ClassInfo[0].ProductCode).toLowerCase();
					setSessionStorageItem("productCode", $.trim(jsonObj.Content.ClassInfo[0].ProductCode).toLowerCase());
					setSessionStorageItem("productDisplayCode", $.trim(jsonObj.Content.ClassInfo[0].ProductDisplayCode || 'null'));
					setSessionStorageItem("targetGradeCode", jsonObj.Content.ClassInfo[0].TargetGradeCode);
					USERID = $.trim(jsonObj.Content.UserID);
					setSessionStorageItem("userID", USERID);
					setSessionStorageItem("userName", $.trim(jsonObj.Content.UserFullName));
					setSessionStorageItem("userRole", $.trim(jsonObj.Content.UserRole.toLowerCase()));
					setSessionStorageItem("districtID", $.trim(jsonObj.Content.DistrictID));
					setSessionStorageItem("rumbaUserID", $.trim(jsonObj.Content.RumbaUserID));
					setSessionStorageItem("deploymentOptionNumber", $.trim(jsonObj.Content.ClassInfo[0].DeploymentOptionNumber));
					
					setSessionStorageItem("IsAutoReadBook", $.trim(jsonObj.Content.IsAutoReadBook));
					setSessionStorageItem("IsAutoCompleteGradeAssessment", $.trim(jsonObj.Content.IsAutoCompleteGradeAssessment));
					
					// class start date
					setSessionStorageItem("ClassStartDate", $.trim(jsonObj.Content.ClassInfo[0].ClassStartDate));
					
					/*== set last district and User ==*/
					//var lastUserLessSuffix = (lastUser.indexOf('@') != -1) ? lastUser.split('@')[0] : lastUser;
					var oLastLoginDetails = {
						'lastDistrictID' : lastDistrict
					}
					setLocalStorageItem("lastLoginDetailsForStud", JSON.stringify(oLastLoginDetails));
					/*== end set last district and User ==*/
					
					//set product type
					setSessionStorageItem('productType', PRODTYPE);
					
					/* setSessionStorageItem(
						'currentTabIndex',
						(
							isiLit20()?
							'1':
							'0'
						)
					); */
					setSessionStorageItem('currentTabIndex','1');
					setSessionStorageItem('loginDone', true);
					
					setSessionStorageItem('eventType', 'LRS');
					
					// TO LOG DATA
					currEventTimeStamp = getCurrentTimestamp();

					setSessionStorageItem("eventStartTime", startTime);
					setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
					setSessionStorageItem("verbID", "CS");
					
					// TO SEND LOGIN EVENT TO GOOGLE ANALYTICS
					var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
					var _screenLabel = "iSeriesAppVersion:"+APPVERNUM+"["+deploymentServer+"]"
										+",iSeriesAppZipVersion:"+AppZipVerNum
										+",iSeriesAppType:"+APPTYPE
										+",iSeriesProductType:LearniLit"
										+",UserID:"+USERID
										+",RumbaUserID:"+getSessionStorageItem("rumbaUserID");
					
					sendGoogleEvents('Login','Login',_screenLabel);
					ga('send', 'pageview', { 'dimension1': getSessionStorageItem("districtID") });
					ga('send', 'pageview', { 'dimension2': getSessionStorageItem("className") });
					ga('send', 'pageview', { 'dimension3': getSessionStorageItem("userID") });
					ga('send', 'pageview', { 'dimension4': getSessionStorageItem("userRole") });
					
					$('.continue_button .loader.login').hide();
					$(".continue_button").remove();
					$('.gradeSelect').remove();
					$('.loginWrapper').width($(window).width()).animate({ 'margin-left' : '-100%'}, 1000, function() {
						$(this).remove();
						$("body").css('background-image' , 'none');
						$('.afterLoginWrapper').fadeIn(700, function() {
							$('.loader').show();
							setSessionStorageItem("connectStatus", "true");
							CACHEDSTATUSSTUDENTKEYNAME = 'UAI_CACHE_STATUS_S_' + CLASSID + '_' + USERID;
							if(_Browser.isSafari) {
								INDEXEDDBSUPPORT = false;
							}
							createIndexedDB();
							init();
						});
					});
					
					//ILIT-1094 
					setSessionStorageItem("deploymentServer", deploymentServer);
					
				} else {
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