function CheckUnitDetails() {
	if (objUnitDetails != null) {		
		/* ILIT-985: get BOY score data from GetAssignmentListInfo for all units */	
		var sUnitIDs = '';
		for (var i=1; i <= objUnitDetails.totalUnits; i++) {
			sUnitIDs += sUnitIDs ? ','+i : i;			
		}	
		
		$.nativeCall({
			'method':			'GetAssignmentListInfo',
			'globalResource':	'objAssignmentListJsonData',
			'inputParams':		[sUnitIDs],
			'interval':			500,
			'onComplete':		function () {
				oBOYGradeList = objAssignmentListJsonData ? _.where(objAssignmentListJsonData.Content, {ItemType: 'assessment', ItemSubType: 'grade', ExtraPractice: "No", ItemSubject: GENERAL.c_s_GRADE_BOY}) : oBOYGradeList || [];
				
				objAssignmentListJsonData = null;
				
				if (
					'userSettingEnabled' in objUnitDetails && 
					objUnitDetails['userSettingEnabled'] === "1"
				){
					GetUserSettings();
				}
				else{
					keyvalData = null;
					var instructorLoadingState = 'instructorLoadingState';
					GetData(instructorLoadingState);
				}
				setTimeout(checkInstructorSettings, 200);
			}		
		});		
	}
	else {
		setTimeout(CheckUnitDetails, 100);
	}
}

var checkInstructorSettings =function () {
	if(
		'userSettingEnabled' in objUnitDetails && 
		objUnitDetails['userSettingEnabled'] === "1"
	){
		var sResponse = (objGetUserSettingsResponse !== null) ? (
							(objGetUserSettingsResponse.Content !== null) ? objGetUserSettingsResponse.Content.PersonalSettings : '' 
						) : null;
	}
	else{
		var sResponse = keyvalData;
	}
	
	if (sResponse !== null) {
		if (sResponse !== '') {
			oInstructorSettingsData = JSON.parse(decodeURIComponent(sResponse));
			
			//IPP-5511
			oInstructorSettingsData['ADB']['POS']['ASGMT']['U'] = (
				objUnitDetails.totalUnits >= oInstructorSettingsData['ADB']['POS']['ASGMT']['U']
				) ? oInstructorSettingsData['ADB']['POS']['ASGMT']['U'] : 1;
			
			oInstructorSettingsData['ADB']['POS']['AST']['U'] = (
				objUnitDetails.totalUnits >= oInstructorSettingsData['ADB']['POS']['AST']['U']
				) ? oInstructorSettingsData['ADB']['POS']['AST']['U'] : 1;
			
			oInstructorSettingsData['ADB']['POS']['GRA']['U'] = (
				objUnitDetails.totalUnits >= oInstructorSettingsData['ADB']['POS']['GRA']['U']
				) ? oInstructorSettingsData['ADB']['POS']['GRA']['U'] : 1;
			
			var aSortedUnitWeek = getSortedUnitWeekDetails(JSON.parse(objUnitDetails.unitsWeeksDetails)),
				sSelectedWeek = aSortedUnitWeek[oInstructorSettingsData['ADB']['POS']['ASGMT']['U'] + ""] || 5;
			
			oInstructorSettingsData['ADB']['POS']['ASGMT']['L'] = (
				sSelectedWeek >= oInstructorSettingsData['ADB']['POS']['ASGMT']['L']
				) ? oInstructorSettingsData['ADB']['POS']['ASGMT']['L'] : 1;
		}
		
		if (
			sResponse === '' || 
			!('ADB' in oInstructorSettingsData)
		){
			objInstructorState = {
				"ADB": {
					"POS": {
						"ASGMT": {
							"U": 1,
							"L": 1
						},
						"AST": {
							"U": 1
						},
						"GRA": {
							"U": 1
						}
					},
					"ACTTAB": "assignment"
				}
			};
		} 
		else {
			objInstructorState  =  oInstructorSettingsData;
			AssignmentInstructorView.ActiveTab = objInstructorState["ADB"]["ACTTAB"];
		}
		GetStudentListInfo();
		setTimeout(scheduleCheck, 200);
	}
	else {
		setTimeout(checkInstructorSettings, 100);
	}
};
/* function callGetData () {
	keyvalData = null;
	var instructorLoadingState = 'instructorLoadingState';
	GetData(instructorLoadingState);
	getInstructorState();
}

function getInstructorState () {
	if (keyvalData != null) {
		objInstructorState  =  (keyvalData == '') ? null : JSON.parse(decodeURIComponent(keyvalData));
		GetStudentListInfo();
		setTimeout(scheduleCheck, 200);
	}
	else {
		setTimeout(getInstructorState, 100);
	}
}
 */
/**
* Get Student List
* @returns Void
*/
function scheduleCheck () {  
	if(objStudentListJsonData != null) {
		if(objStudentListJsonData.Status == "200") {	
			var unitNum =   (typeof dataFilter == "undefined" ? (objInstructorState == null ? 1 : objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['U']) : dataFilter.UnitNumber);
			
			GetAssignmentListInfo(unitNum);
			setTimeout(function () {
				assignmentListCheck(true);
			}, 200);
		} else {
			if(objAssignmentListJsonData.ErrorCode != 'U1065') {
				alert(objAssignmentListJsonData.Error.ErrorUserDescription);
			}
		}						
	} else {
		setTimeout(scheduleCheck, 100);
	}
}

/**
 * Get Assignment List
 * @returns {undefined}
 */
function assignmentListCheck (pbStatus, dataFilter) {
	if (objAssignmentListJsonData != null) {
		if(objAssignmentListJsonData.Status == "200") {
			var unitNum = (
				typeof dataFilter == "undefined"?
				(
					objInstructorState == null?
					1:
					objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['U']
				):
				dataFilter.UnitNumber
			);
			
			if (!pbStatus && typeof dataFilter == "undefined") {							
				unitNum = 1;
			}						
			
			if (
				(
					typeof objUnitDetails.serviceVersion != "undefined" &&
					objUnitDetails.serviceVersion != null
				) ||
				objPlatform.isBrowser() == true
			) {	//	VERSION V2							
				GetGradebookForInstructorV2("Unit", unitNum, false, null);
				if (pbStatus) {
					setTimeout(gradeBookV2Check, 200);
				}
			}
			else {	//	PRE V2 VERSION							
				GetGradeBookInfo("Unit", unitNum, false, null);
				if(pbStatus) {                            
					setTimeout(gradeBookCheck, 200);
				}
			}			
		}
		else {
			if (objAssignmentListJsonData.ErrorCode != 'U1065') {
				alert(objAssignmentListJsonData.Error.ErrorUserDescription);
			}
		}						
	}
	else {
		setTimeout(function () {
			assignmentListCheck(pbStatus, dataFilter);
		}, 500);
	}
}

/**
 *
 * Get GetGradebookForInstructorV2 Data For The First Time
 */
function gradeBookV2Check () {
	if (objGradeBookV2JsonData != 0) {
		// Do Things Here
		//var aItemAttemptIds = _.pluck(objGradeBookV2JsonData.Content, 'IAID');
		var aItemAttemptIds = _.map(objGradeBookV2JsonData.Content.GradeBookData, function (obj) {
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});
		oAttemptInfo = aItemAttemptIds;
		GetGradebookAttemptData(aItemAttemptIds);
		setTimeout(gradeBookCheck, 0);
	}
	else {
		// Keep Checking until data come
		setTimeout(gradeBookV2Check, 100);
	}
}

/**
 * Get Each Cell Content
 * @returns Void
 */
function gradeBookCheck() {
	if (objGradeBookJsonData != 0) {
		$("#loaderContainer").hide();
		$('.wrapper').show();
		Application.init(VIEWTYPE.c_s_ASSIGNMENT_INSTRUCTOR);
		var unitNum = objInstructorState == null ? 1 : objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['U'];
		unitNum = parseInt(unitNum) - 1;
		$(".dp_select_option:eq(" + unitNum + ")").trigger("click");
		$('.wrapper').animate({'opacity': '1'}, 800);
		setTimeout(function () {
			onPageLoadComplete(GENERAL.c_s_PAGE_TYPE_ASSIGNMENT_INSTRUCTOR);
		}, 400);
	}
	else {
		setTimeout(gradeBookCheck, 100);
	}
}

/* ****************************************************** */

function showLoader (psMessage) {
	if (typeof psMessage !== 'string') {
		psMessage = ASSIGNMENT_INSTRUCTOR.c_s_LOADING_TXT;
	}
	oUtil.showLoader({
		'click-to-hide': 	false,
		'message':    		'<img src="media/loader.gif" alt="' + psMessage + '" />\
<p style="font-size:13px; margin-top:-8px; color:#555555; text-transform:uppercase;">' + psMessage + '</p>',
		'foreground-color':	'none',
		'background-color':	'#FFFFFF',
		'opacity':			0.5,
		'box-style':		{
			'height':			'80px',
			'width':			'80px',
			'line-height':		'25px',
			'opacity':			0.5,
			'user-select':		'none',
			'-moz-user-select':	'none'
		}
	});
}

function hideLoader () {
	oUtil.hideLoader();
}



/**
 * Gets Unit and Week Details
 * @method getSortedUnitWeekDetails
 * @param {Array} paUnitWeekDetails (The actual response from the Services) [[3,5],[1,5],[4,5],[2,7],[8,11],[5,5],[6,10],[7,1]]
 * @return {Object} 
 */
function getSortedUnitWeekDetails (paUnitWeekDetails) {
	var oUnitWeekDetails = {},
		aUWDetails = [],
		oCurElem = {};
	
	if (
		!(paUnitWeekDetails instanceof Array) ||
		paUnitWeekDetails.length == 0
	) {
		return oUnitWeekDetails;
	}
	for (var iI = 0; iI < paUnitWeekDetails.length; iI++) {
		oCurElem = {
			'Unit':	parseInt(paUnitWeekDetails[iI][0]),
			'Week':	parseInt(paUnitWeekDetails[iI][1])
		};
		// aUWDetails.push(oCurElem);
		for (var iJ = aUWDetails.length - 1; iJ > -1; iJ--) {
			if (oCurElem.Unit >= aUWDetails[iJ].Unit) {
				break;
			}
		}
		
		if (iJ == -1) {
			iJ = 0;
		}
		
		aUWDetails.splice(iJ, 0, oCurElem);
	}
	
	for (iI = 0; iI < aUWDetails.length; iI++) {
		oUnitWeekDetails[aUWDetails[iI]['Unit']] = aUWDetails[iI]['Week'];
	}
	
	return oUnitWeekDetails;
}

/**
 * Turns values from GRADE Assessment Score JSON into ones suitable for Class Average calculation
 * @method getActualValue
 * @param {String} psEntry
 * @return {Number} 
 */
function getActualValue (psEntry) {
	if (typeof psEntry !== 'string') {
		if (typeof psEntry !== 'number') {
			return NaN;
		}
		psEntry = psEntry + '';
	}
	var aMatches = null;
	if ((aMatches = psEntry.match(/^(<|>)*([A-Z0-9]+)\.{0,1}([0-9]*)$/i)) === null) { return NaN; }
	if (aMatches.length !== 4) { return NaN; }
	
	var sSymbol = aMatches[1] || '',
		iWholeNumber = parseInt(aMatches[2]) || -1,
		iDecimal = (parseInt(aMatches[3]) || 0);
	
	if (iWholeNumber < 0) { return 0; }
	return parseFloat(iWholeNumber + '.' + iDecimal);
}

/**
 * Displays jQuery UI Confirm Box
 * @method ShowConfirm
 * @param {String} psTitle
 * @param {String} psMessage
 * @param {Function} pfYesCallback
 * @param {Function} pfNoCallback
 * @return {undefined} 
 */
function ShowConfirm (psTitle, psMessage, pfYesCallback, pfNoCallback) {
	if (typeof psTitle !== 'string') { psTitle = $.trim($('title').text()) + ' asks:'; }
	if (typeof psMessage !== 'string') { psMessage = 'Are you sure?'; }
	if (typeof pfYesCallback !== 'function') { pfYesCallback = $.noop; }
	if (typeof pfNoCallback !== 'function') { pfNoCallback = $.noop; }
	
	$('<div/>')
		.attr('title', psTitle)
		.html(psMessage)
		.dialog({
			autoOpen:	true,
			resizable: 	false,
			draggable:	true,
			height: 275,
			width: 450,
			modal: true,
			buttons: [
				{
					text:	'Cancel',
					class:	'gray',
					click:	function () {
						$(this).dialog('destroy').remove();
						try { pfNoCallback(); }
						catch (oException) {}
					}
				},
				{
					text:	'Confirm',
					click:	function () {
						$(this).dialog('destroy').remove();
						try { pfYesCallback(); }
						catch (oException) {}
					}
				}
			],
            open: function () { $('.ui-dialog').addClass('Ilit_alert_box'); }
		});
}
