/**
 * View Type Conference
 * @class ConferenceView
 * @module ConferenceView
 * @constructor
 */
var ConferenceView = function (model, sUnitsWeeksDetails) {	
	this.model = model;
	this.sUnitsWeeksDetails = sUnitsWeeksDetails;
	this.itemDisplayName = model.LessonData.itemDisplayName;
	this.currentWeek = parseInt(objLessonJsonData.weekNumber);
	this.currentUnit = objLessonJsonData.unitNumber;
	this.sConferenceType = LessonView.sConferenceType;
	this.sSlideId = LessonView.sSlideId;
	this.sLessonId = LessonView.lessonId;
	this.oAttemptInfo = null;
	this.agradebookData = [];	
	this.aMasterScoredData = [];	
	this.aMasterInprogressData = [];	
	this.filterStudentList = [];
	this.filterReadingStragyStudentList = [];
	this.filtersmallGroupStudentList = [];
	this.filterIndividualStudentList = [];
	this.conferenceLessons = [];
	this.iNumOfStudents = 5;
	this.iMaxStudents = 10;
	this.allConferencedStudentList = [];	
};

/**
 * Initialize ConferenceView
 * @method init 
 * @return 
 */
ConferenceView.prototype.init = function () {
	var oSelf = this;
	
	oSelf.getStudentList();
}

/**
 * Call Service GetStudentListInfo
 * @method getStudentList 
 * @return 
 */
ConferenceView.prototype.getStudentList = function () {
	var oSelf = this,
		fScheduleCheck = function () {
			if (
				objStudentListJsonData && 
				objconferenceListStudentData && 
				objAssignmentListJsonData && 
				objGradeBookV2JsonData && 
				objGradeBookJsonData
			) {
				oSelf.loadPerformance();
			}
			else {
				setTimeout(fScheduleCheck, 100);
			}
		};
	
	// reset before next call
	objStudentListJsonData = null; 
	objconferenceListStudentData = null; 
	objAssignmentListJsonData = null; 
	objGradeBookV2JsonData = 0; 
	objGradeBookJsonData = 0;
	
	$.nativeCall({
		'method':			'GetStudentListInfo',
		'globalResource':	'objStudentListJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			//oSelf.getConferenceList();							
		}
	});

	$.nativeCall({
		'method':			'GetListOfConferenceStudentData',
		'inputParams':		[oSelf.sConferenceType],
		'globalResource':	'objconferenceListStudentData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			//oSelf.getAssignmentList();					
		}
	});

	$.nativeCall({
		'method':			'GetAssignmentListInfo',
		'inputParams':		[oSelf.currentUnit],
		'globalResource':	'objAssignmentListJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			//oSelf.getGradeBookData();			
		}
	});
	
	$.nativeCall({
		'method':			'GetGradebookForInstructorV2',
		'inputParams':		["Unit", objLessonJsonData.unitNumber, false, null],
		'globalResource':	'objGradeBookV2JsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			if(oSelf.oAttemptInfo ==  null){
				oSelf.checkForAlldAttemptIds(objGradeBookV2JsonData.Content);				
			}else{
				oSelf.checkForUpdatedAttemptIds(objGradeBookV2JsonData.Content);	
			} 
		}
	});
	
	fScheduleCheck();
}

/**
 * get Details of All Attempt Data
 * @method checkForAlldAttemptIds 
 * @return 
 */
ConferenceView.prototype.checkForAlldAttemptIds = function (oData) {
	var oSelf = this,	
		aItemAttemptIds = [];
	
	aItemAttemptIds = _.map(oData.GradeBookData, function (obj) {			
		return {
			IAID: obj.IAID,
			ARID: obj.ARID
		};
	});
	
	oSelf.oAttemptInfo = aItemAttemptIds;
	oSelf.getGradebookAttemptData(aItemAttemptIds);	
}

/**
 * get Details of Updated Attempt Data
 * @method checkForUpdatedAttemptIds 
 * @return 
 */
ConferenceView.prototype.checkForUpdatedAttemptIds = function (oData) {
	var oSelf = this,	
		aItemAttemptIds = [],
		aFilteredAttemptIds	= [],
		aRevId = [],
		revId = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
	
	aItemAttemptIds = _.map(oData.GradeBookData, function (obj) {			
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});		 
	
	
	for(var i = 0; i < aItemAttemptIds.length; i++) {		
			
		aRevId	=	_.where(oSelf.oAttemptInfo, {IAID: aItemAttemptIds[i].IAID});				
		revId	=	(aRevId.length == 0) ? '' : aRevId[0].ARID;
		
		if(revId === '') {	//	New Entry					
			oSelf.oAttemptInfo.push(aItemAttemptIds[i]);
			if (typeof aItemAttemptIds[i] != 'undefined' && aItemAttemptIds[i] != '' && _.size(aItemAttemptIds[i]) != 0) {
				aFilteredAttemptIds.push(aItemAttemptIds[i]);
			}
		} else if(revId != aItemAttemptIds[i].ARID) {	//	Exists but Updated					
			if (typeof aItemAttemptIds[i] != 'undefined' && aItemAttemptIds[i] != '' && _.size(aItemAttemptIds[i]) != 0) {
				aFilteredAttemptIds.push(aItemAttemptIds[i]);	
			}
			oSelf.oAttemptInfo = _.reject(oSelf.oAttemptInfo, function(obj){ return obj.IAID == aItemAttemptIds[i].IAID; });					
			oSelf.oAttemptInfo.push(aItemAttemptIds[i]);					
		}
	}	
	
	oSelf.getGradebookAttemptData(aFilteredAttemptIds);
}

/**
 * Call Service GetGradebookAttemptData
 * @method getGradebookAttemptData 
 * @return 
 */
ConferenceView.prototype.getGradebookAttemptData = function (aItemAttemptIds) {
	var oSelf = this;
	
	$.nativeCall({
		'method':			'GetGradebookAttemptData',
		'inputParams':		[aItemAttemptIds],
		'globalResource':	'objGradeBookJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {			
			//oSelf.loadPerformance();			
		}
	});	
}

/**
 * Load Performance Info file
 * @method loadPerformance 
 * @return 
 */
ConferenceView.prototype.loadPerformance = function () {
	var oSelf = this,
		performanceInfoJsLoaded = function () {
			var performanceGroupData = {};
			
			 if (objPerformanceInfoData != null) {				
				oSelf.model.StudentData = objStudentListJsonData.Content;
				oSelf.model.conferenceListStudentData = objconferenceListStudentData;
				oSelf.model.assignmentListData = objAssignmentListJsonData.Content;		
				oSelf.model.gradeBookData = (objGradeBookJsonData.Content.length == 0) ? 0: objGradeBookJsonData.Content;		
				oSelf.model.performanceInfoData =  objPerformanceInfoData;
				oSelf.model.LibraryData = objBookList;				
				
				writingBenchmarkIndex = "";
				iwtBenchmarkIndex = "";
			
				if (
					oSelf.sConferenceType == CONFERENCE_TYPES.c_s_ASSIGNMENT ||
					oSelf.sConferenceType == CONFERENCE_TYPES.c_s_STRATEGY || 
					oSelf.sConferenceType == CONFERENCE_TYPES.c_s_INDIVIDUALS
				) {
					oSelf.filterScoredData();
				}
				
				if (oSelf.model.performanceInfoData.groups != null && oSelf.model.performanceInfoData.groups != undefined) {
					performanceGroupData = _.sortBy(oSelf.model.performanceInfoData.groups, "displayOrder");
					$.each(performanceGroupData, function(idx, val) {					
						if(val.type == "writing"){
							writingBenchmarkIndex = idx;
						}
						if(val.type == "reading_comp"){
							if(val.subgroup != undefined ){
							var firstChildArr = _.sortBy(val.subgroup, "displayOrder");
							$.each(firstChildArr, function(idx_sub, val_sub) {
							if(idx_sub == 1){
								iwtBenchmarkIndex= idx+"_"+idx_sub;
							}
						});
						}
						}
					});
				}
				oSelf.prepareStudentList();
			} 
		};
	
	loadJS("js/"+fetchGradeCode(objLessonJsonData.gradeId)+"_performance_info.js", performanceInfoJsLoaded);	
}

/**
 * Prepare scored data 
 * @method filterScoredData
 * @return 
 */
ConferenceView.prototype.filterScoredData = function () {
	var oSelf = this,
		oItem = {},
		aStudentList = [],
		oData = {};		
	
	$.each(oSelf.model.gradeBookData, function (key, oItem) {	
		if (oItem['ICS'] == LESSON.c_i_SCORED_STATUS) {	
			aStudentList = _.where(oSelf.model.StudentData, {"UserID" : oItem['SID']});			
			if (aStudentList.length) {				
				oData = {
					'StudentId':	oItem['SID'],
					'ItemID':		oItem['IID'],
					'FinalScore':	oItem['FS'],
					'ItemMaxScore':	oItem['IMS']
				},
				aAssignmentData = _.where(oSelf.model['assignmentListData'], {ItemID: oItem['IID']});
					
				if (aAssignmentData.length > 0) {
					oAssignmentData = aAssignmentData.first();
					oData['UnitNumber'] =	oAssignmentData['UnitNumber'];
					oData['WeekNumber'] =	oAssignmentData['WeekNumber'];
					oData['ItemType'] 	=	oAssignmentData['ItemType'];					
					oData['ItemSubType']=	oAssignmentData['ItemSubType'];
					oSelf.aMasterScoredData.push(oData);
				}
			}
		}
		else if ((oItem['ICS'] == LESSON.c_i_ASSIGN_STATUS) || (oItem['ICS'] == LESSON.c_i_PROGRESS_STATUS)) {
			aStudentList = _.where(oSelf.model.StudentData, {"UserID" : oItem['SID']});			
			if (aStudentList.length) {				
				oData = {
					'StudentId':	oItem['SID'],
					'ItemID':		oItem['IID'],
					'FinalScore':	oItem['FS'],
					'ItemMaxScore':	oItem['IMS']
				},
				aAssignmentData = _.where(oSelf.model['assignmentListData'], {ItemID: oItem['IID']});
					
				if (aAssignmentData.length > 0) {
					oAssignmentData = aAssignmentData.first();
					oData['UnitNumber'] =	oAssignmentData['UnitNumber'];
					oData['WeekNumber'] =	oAssignmentData['WeekNumber'];
					oData['ItemType'] 	=	oAssignmentData['ItemType'];					
					oData['ItemSubType']=	oAssignmentData['ItemSubType'];
					oSelf.aMasterInprogressData.push(oData);
				}
			}
		}
	});		
}

/**
 * Prepare Student List & Render
 * @method prepareStudentList
 * @return 
 */
ConferenceView.prototype.prepareStudentList = function () {
	try {
		var oSelf = this,	
			oStudentData = oSelf.model.StudentData,
			oElem = $('#'+oSelf.sSlideId+' .studentlist'),		
			sConferenceType = oSelf.sConferenceType,
			oConferenceList = oSelf.model.conferenceListStudentData.Content,			
			oStudentListToDisplay = {},
			oNativeRequest = {},
			bNoLimit = false,
			fRenderStudentList = function () {				
				var data = { 
						'slide_id' : oElem.attr('slide_id'),
						'conference_type': sConferenceType,
						'lessonId' : oElem.attr('lessonId'),
						'itemDisplayName' : oElem.attr('itemdisplayname'),
						'iLimit' : bNoLimit ? oSelf.iMaxStudents : oSelf.iNumOfStudents
					};
				
				// if tab has been changed mean while then do not render
				if (oElem.length && oElem.attr('conference_type') != oSelf.sConferenceType) {
					return;
				} 
				
				oElem.css({'text-align':'', 'top' : '', 'left': ''});			
				oElem.empty().html(_.template($("#studentlistTemplate").html(),
					{
						"StudentData" : oStudentListToDisplay,
						'data' : data
					}
				));			
				
				$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_REFRESH_BTN+'_]').removeAttr("disabled");				
				oSelf.bindStudentListEvents(data);
				
				// initiate conference for next slide
				if (LessonView.aConferenceTypes.length > 1) {
					LessonView.aConferenceTypes = LessonView.aConferenceTypes.slice(1,LessonView.aConferenceTypes.length);					
					/* LessonView.aConferenceTypes = LessonView.aConferenceTypes.length == 1 ? [{"slideId":"slide_7","conferenceType":"individuals"}] : LessonView.aConferenceTypes; */
					LessonView.initConference();
				}
			};
	}
	catch (e) {
	}
	
	// pick online students from StudentListInfo
	oStudentData = _.where(oStudentData, {"UserInLiveSession" : true, "UserRole" : "S"});
	
	try {
		// If Conferencing for the first time
		if (oConferenceList == null || oConferenceList.length == 0) {
			if (sConferenceType == CONFERENCE_TYPES.c_s_TTR) {
				oStudentListToDisplay = _.sortBy(oStudentData, "UserDisplayName");
				fRenderStudentList();
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION) {
				// Try for students which have not been picked for TTR conferencing
				var fFilterStudent4Classroom = function () {
					var aConferenceListOfIds = [],
						aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						oData = {};
			
					aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");
					aStudentListOfIds = _.pluck(oStudentData, "UserID");
					aRejectedIds = _.intersection(aConferenceListOfIds, aStudentListOfIds);
					
					// reject TTR students
					oTTRExcludedData = _.reject(oStudentData, function(obj){ return ($.inArray(obj.UserID, aConferenceListOfIds) > -1); });
					iCount = _.size(oTTRExcludedData);
					
					// if count is less then include TTR students to match the count											
					for (var i=0; i < (oSelf.iNumOfStudents - iCount); i++) {
						oData = aRejectedIds[i] ? (_.where(oStudentData, {"UserID" : aRejectedIds[i]}))[0] : 0;
						if (oData) {
							oTTRExcludedData.push(oData);
						}							
					}
					
					oStudentListToDisplay = _.sortBy(oTTRExcludedData, "UserDisplayName");
					fRenderStudentList();
				}
				
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterStudent4Classroom
				}];			
				
				oSelf.nativeCallWrapper(oNativeRequest);					
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_ASSIGNMENT) {
				// Try for students which have not been picked for other conferencing for that day (lesson)
				var fFilterStudent4Assignment = function () {
					var aConferenceListOfIds = [],
						aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						oFilteredData = {},
						oData = {};
			
					if (oSelf.allConferencedStudentList.length > 0) {										
						oSelf.allConferencedStudentList = _.where(oSelf.allConferencedStudentList, {"ItemID" : oSelf.sLessonId});
						aConferenceListOfIds = _.pluck(oSelf.allConferencedStudentList, "StudentID");
						aStudentListOfIds = _.pluck(oStudentData, "UserID");
						aRejectedIds = _.intersection(aConferenceListOfIds, aStudentListOfIds);
					
						// reject other Conference students
						oFilteredData = _.reject(oStudentData, function(obj){ return ($.inArray(obj.UserID, aConferenceListOfIds) > -1); });
						iCount = _.size(oFilteredData);
					
						// if count is less then include other Conference students to match the count						
						for (var i=0; i < (oSelf.iNumOfStudents - iCount); i++) {
							oData = aRejectedIds[i] ? (_.where(oStudentData, {"UserID" : aRejectedIds[i]}))[0] : 0;
							if (oData) {
								oFilteredData.push(oData);
							}							
						}
					}
					else {
						oFilteredData = oStudentData;
					}
					oStudentListToDisplay = _.sortBy(oFilteredData, "UserDisplayName");
					fRenderStudentList();
				}			
				
				// get list of all conference data except assignment
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_STRATEGY], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_INDIVIDUALS], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterStudent4Assignment
				}];
				
				oSelf.allConferencedStudentList = [];
				oSelf.nativeCallWrapper(oNativeRequest);
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_STRATEGY || sConferenceType == CONFERENCE_TYPES.c_s_INDIVIDUALS) {
				// Try for students which have not been picked for conferencing for that day (lesson)
				var filterStudent4Strategy = function () {
					var aConferenceListOfIds = [],
						aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						oFilteredData = {},
						oData = {};
			
					if (oSelf.allConferencedStudentList.length > 0) {
						oSelf.allConferencedStudentList = _.where(oSelf.allConferencedStudentList, {"ItemID" : oSelf.sLessonId});
						aConferenceListOfIds = _.pluck(oSelf.allConferencedStudentList, "StudentID");
						aStudentListOfIds = _.pluck(oStudentData, "UserID");
						aRejectedIds = _.intersection(aConferenceListOfIds, aStudentListOfIds);
						
						// reject other Conference students
						oFilteredData = _.reject(oStudentData, function(obj){ return ($.inArray(obj.UserID, aConferenceListOfIds) > -1); });
						iCount = _.size(oFilteredData);
						
						// if count is less then include other Conference students to match the count						
						for (var i=0; i < (oSelf.iNumOfStudents - iCount); i++) {
							oData = aRejectedIds[i] ? (_.where(oStudentData, {"UserID" : aRejectedIds[i]}))[0] : 0;
							if (oData) {
								oFilteredData.push(oData);
							}							
						}
					}
					else {
						oFilteredData = oStudentData;
					}
					oStudentListToDisplay = _.sortBy(oFilteredData, "UserDisplayName");
					fRenderStudentList();
				}			
				
				// get list of all conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_ASSIGNMENT], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_STRATEGY], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_INDIVIDUALS], 
					'response': 'objconferenceListStudentData',
					'callback': filterStudent4Strategy
				}];
				
				oSelf.allConferencedStudentList = [];
				oSelf.nativeCallWrapper(oNativeRequest);
			}
		}	
		else {
			if (sConferenceType == CONFERENCE_TYPES.c_s_TTR) {
				// Try for students which have not been picked for TTR conferencing
				var fFilterStudent4TTR = function () {
					var aConferenceListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						aCountInstance = [],
						aCountArr = [],					
						aLeastConferenced = [],					
						oData = {},
						aStudentsToRetain = [],
						iMaxNum = 0,
						oTTRIncludedData = [],
						oTTRExcludedData = [];
					
					aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");
					
					// pick students who conferenced TTR in current day
					aStudentsToRetain = _.pluck(_.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId}), "StudentID");
					aRejectedIds = _.uniq(_.difference(aConferenceListOfIds, aStudentsToRetain));
					
					oTTRIncludedData = _.filter(oSelf.model.StudentData, function(obj){ 
						return ($.inArray(obj.UserID, aStudentsToRetain) > -1); 
					});
					
					// remaining no. of students to add
					iMaxNum = oSelf.iNumOfStudents - _.size(oTTRIncludedData);
					
					// if count is less than 5 then add more students following the algorithm
					if (iMaxNum > 0) {
						// reject TTR students of the other lesson
						oTTRExcludedData = _.reject(oStudentData, function(obj){ 
							return ($.inArray(obj.UserID, aConferenceListOfIds) > -1); 
						});
						iCount = _.size(oTTRExcludedData);
						
						// if count is less then include TTR students to match the count
						if (iCount < iMaxNum) {
							// count no. of times student has been conferenced for TTR
							_.each(aRejectedIds, function (sStudId, key) {						
								aCountInstance = _.countBy(aConferenceListOfIds, function(num) {
									if (num == sStudId) {
										return num;
									}
								});						
								_.each(aCountInstance, function (iCnt, sId) {
									if (sId != "undefined") {
										aCountArr.push({"Count" : iCnt, "StudId" : sId});
									}
								});
							});					
							aLeastConferenced = _.sortBy(aCountArr, "Count");
							
							// include the students with least TTR conference first						
							for (var i=0; i < aLeastConferenced.length; i++) {
								oData = aLeastConferenced[i] ? (_.where(oStudentData, {"UserID" : aLeastConferenced[i].StudId}))[0] : 0;
								if (oData) {
									oTTRExcludedData.push(oData);
								}
								if (oTTRExcludedData.length == iMaxNum) {
									break;
								}
							}
						}
					}
					else {
						bNoLimit = true;
					}
					oStudentListToDisplay = oTTRIncludedData;
					
					for (var i=0; i < oTTRExcludedData.length; i++) {
						oStudentListToDisplay.push(oTTRExcludedData[i]);
					}
					oStudentListToDisplay = _.sortBy(oStudentListToDisplay, "UserDisplayName");					
					fRenderStudentList();
				}
				
				// get list of TTR conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterStudent4TTR
				}];			
				
				oSelf.nativeCallWrapper(oNativeRequest);
			}
			if (sConferenceType == CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION) {
				/* i) Try to pick students who have been conferenced with the least for Classroom Conversation
				ii) Try for students which have not been picked for TTR conferencing for that day (if there are no other students only then pick the same students as TTR) */
				var fFilterStudent4CC = function () {
					var aConferenceListOfIds = [],
						aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						aCountInstance = [],
						aCountArr = [],					
						aLeastConferenced = [],					
						oData = {},
						aStudentsToRetain = [],
						iMaxNum = 0,
						oTTRIncludedData = [],
						oTTRExcludedData = [],
						fPrepareListToRender = function () {
							oStudentListToDisplay = oTTRIncludedData;
					
							for (var i=0; i < oTTRExcludedData.length; i++) {
								oStudentListToDisplay.push(oTTRExcludedData[i]);
							}
							oStudentListToDisplay = _.sortBy(oStudentListToDisplay, "UserDisplayName");										
							fRenderStudentList();
						};
						
					aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");
					
					// pick students who conferenced CC in current day
					aStudentsToRetain = _.pluck(_.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId}), "StudentID");
					aRejectedIds = _.uniq(_.difference(aConferenceListOfIds, aStudentsToRetain));				
					
					oTTRIncludedData = _.filter(oSelf.model.StudentData, function(obj){ 
						return ($.inArray(obj.UserID, aStudentsToRetain) > -1); 
					});
					
					// remaining no. of students to add
					iMaxNum = oSelf.iNumOfStudents - _.size(oTTRIncludedData);
					
					// if count is less than 5 then add more students following the algorithm
					if (iMaxNum > 0) {
						// reject CC students of the other lesson					
						oTTRExcludedData = _.reject(oStudentData, function(obj){ 
							return ($.inArray(obj.UserID, aConferenceListOfIds) > -1); 
						});
						iCount = _.size(oTTRExcludedData);
						
						// if count is less then include classroom conference to match the count
						if (iCount < iMaxNum) {
							// count no. of times student has been conferenced for CC
							_.each(aRejectedIds, function (sStudId, key) {						
								aCountInstance = _.countBy(aConferenceListOfIds, function(num) {
									if (num == sStudId) {
										return num;
									}
								});						
								_.each(aCountInstance, function (iCnt, sId) {
									if (sId != "undefined") {
										aCountArr.push({"Count" : iCnt, "StudId" : sId});
									}
								});
							});
													
							aLeastConferenced = _.sortBy(aCountArr, "Count");
							
							// include the students with least classroom conference first
							for (var i=0; i < aLeastConferenced.length; i++) {							
								oData = aLeastConferenced[i] ? (_.where(oStudentData, {"UserID" : aLeastConferenced[i].StudId}))[0] : 0;
								if (oData) {
									oTTRExcludedData.push(oData);
								}
								if (iMaxNum == _.size(oTTRExcludedData)) {
									break;
								}
							}
							
							fPrepareListToRender();
						}
						else if (iCount > iMaxNum) {
							// if count is more then reject TTR conference students of current day if any
							objconferenceListStudentData = null;
							$.nativeCall({
								'method':			'GetListOfConferenceStudentData',
								'inputParams':		[CONFERENCE_TYPES.c_s_TTR],
								'globalResource':	'objconferenceListStudentData',
								'interval':			500,
								'breakAfter':		125000,
								'debug':			false,
								'onComplete':		function () {
									aConferenceListOfIds = _.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId});
									aStudentListOfIds = _.pluck(aConferenceListOfIds, "StudentID");					
									
									// if count is more, then reject TTR conferenced data								
									if (_.size(oTTRExcludedData) > iMaxNum) {									
										for (var i=0; i < aStudentListOfIds.length; i++) {							
											oTTRExcludedData = _.reject(oTTRExcludedData, function(obj) { 
												return (obj.UserID == aStudentListOfIds[i]); 
											});
											if (iMaxNum == _.size(oTTRExcludedData)) {
												break;
											}							
										}
									}									
									fPrepareListToRender();
								}
							});
						}
						else {
							fPrepareListToRender();
						}
					}
					else {						
						bNoLimit = true;					
						fPrepareListToRender();
					}
				}
				
				// get list of classroom conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterStudent4CC
				}];
				
				oSelf.nativeCallWrapper(oNativeRequest);
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_ASSIGNMENT) {
				/* 	i) Pick students with low writing  score from last week. If no scores are available in the last week then consider current week
					ii) The student that has not been conferenced within the current week need to be picked */
				var fFilterSubsequentStud4Assignment = function () {
					var aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,						
						oFilteredData = {},
						iDayNumber = null,
						iWeekNumber = null,
						dStudentPercentage = 0,
						iDataBenchmark = null,
						aLowScoredStudentData = [],
						iLastWeek = null,
						aMasterScoredDataLastWeek = [],
						oData = {},
						aWeekRange = [],
						aRejectedIdsOtherWeek = [],
						aStudentsToRetain = [],
						aConferenceListOfIds = [],
						oCCIncludedData = [],
						oStudentDataFiltered = {};
					
					// pick students who conferenced Assignment in current day
					objconferenceListStudentData = null;
					$.nativeCall({
						'method':			'GetListOfConferenceStudentData',
						'inputParams':		[CONFERENCE_TYPES.c_s_ASSIGNMENT],
						'globalResource':	'objconferenceListStudentData',
						'interval':			500,
						'breakAfter':		125000,
						'debug':			false,
						'onComplete':		function () {
						
							aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");					
							// pick students who conferenced Assignment in current day
							aStudentsToRetain = _.pluck(_.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId}), "StudentID");
							aRejectedIds = _.difference(aConferenceListOfIds, aStudentsToRetain);				
							
							oCCIncludedData = _.filter(oSelf.model.StudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) > -1); 
							});
							
							oStudentDataFiltered = _.filter(oStudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) == -1); 
							});
							
							// remaining no. of students to add
							iMaxNum = oSelf.iNumOfStudents - _.size(oCCIncludedData);
							
							if (iMaxNum > 0) {
								// Try for students which have not been conferenced within the current week
								if (oSelf.allConferencedStudentList.length > 0) {
									aStudentListOfIds = _.pluck(oStudentDataFiltered, "UserID");
									for (var i=0; i < oSelf.allConferencedStudentList.length; i++) {
										iDayNumber = (oSelf.allConferencedStudentList[i].ConferenceLessonName.split(','))[1].replace('Lesson','').trim();
										iWeekNumber = iDayNumber/5;
										iWeekNumber = (iWeekNumber > Math.floor(iWeekNumber)) ? Math.floor(iWeekNumber + 1) : iWeekNumber;
										if (iWeekNumber == oSelf.currentWeek) {
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIds) == -1) {
												aRejectedIds.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
										else {
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIdsOtherWeek) == -1) {
												aRejectedIdsOtherWeek.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
									}						
								}
													
								// Pick students with low writing  score from last week	& current week				
								iLastWeek  = (oSelf.currentWeek-1) < 0 ? 1 : (oSelf.currentWeek-1);					
								aWeekRange.push(iLastWeek);					
								
								if (iLastWeek != oSelf.currentWeek) {
									aWeekRange.push(oSelf.currentWeek);
								}					
								aMasterScoredDataCurrentWeek = (_.filter(oSelf.aMasterScoredData, function(obj){ 
									return ($.inArray(obj.WeekNumber, aWeekRange) > -1); 
								}));					
								
								oFilteredData = [];
								if (aMasterScoredDataLastWeek.length || aMasterScoredDataCurrentWeek.length) {
									iDataBenchmark = oSelf.getMinimumMarks(writingBenchmarkIndex);
									// Pick students with low writing  score from last week
									for (var i=0; i < aMasterScoredDataLastWeek.length; i++) {					
										if (
											aMasterScoredDataLastWeek[i].ItemSubType == 'paragraph' || 
											aMasterScoredDataLastWeek[i].ItemSubType == 'essay' || 
											aMasterScoredDataLastWeek[i].ItemSubType == 'dailyassignment'
										) {
											dStudentPercentage = (aMasterScoredDataLastWeek[i].FinalScore / aMasterScoredDataLastWeek[i].ItemMaxScore) * 100;
											if (dStudentPercentage < Object.keys(iDataBenchmark)[0]) {
												if ($.inArray(aMasterScoredDataLastWeek[i].StudentId, aLowScoredStudentData) == -1) {
													aLowScoredStudentData.push(aMasterScoredDataLastWeek[i].StudentId);
													oData = (_.where(oStudentDataFiltered, {"UserID" : aMasterScoredDataLastWeek[i].StudentId}))[0];
													if (oData) {
														oFilteredData.push(oData);
													}
												}
											}						
										}
									}						
									// if count is less, then Pick students with low writing score from current week
									if (_.size(oFilteredData) < iMaxNum) {
										for (var i=0; i < aMasterScoredDataCurrentWeek.length; i++) {					
											if (
												aMasterScoredDataCurrentWeek[i].ItemSubType == 'paragraph' || 
												aMasterScoredDataCurrentWeek[i].ItemSubType == 'essay' || 
												aMasterScoredDataCurrentWeek[i].ItemSubType == 'dailyassignment'
											) {
												dStudentPercentage = (aMasterScoredDataCurrentWeek[i].FinalScore / aMasterScoredDataCurrentWeek[i].ItemMaxScore) * 100;
												if (dStudentPercentage < Object.keys(iDataBenchmark)[0]) {
													if ($.inArray(aMasterScoredDataCurrentWeek[i].StudentId, aLowScoredStudentData) == -1) {
														aLowScoredStudentData.push(aMasterScoredDataCurrentWeek[i].StudentId);
														oData = (_.where(oStudentDataFiltered, {"UserID" : aMasterScoredDataCurrentWeek[i].StudentId}))[0];
														if (oData) {
															oFilteredData.push(oData);
														}
													}
												}						
											}
										}							
									}
								}
								else {
									oFilteredData = oStudentDataFiltered;
								}
								
								iCount = _.size(_.uniq(oFilteredData));
								// if count is less, then include remaining students with least conferencing within current week
								if (iCount < iMaxNum) {
									aRemainingConferencedData = _.reject(oStudentDataFiltered, function(obj) { 
											return ($.inArray(obj.UserID, aLowScoredStudentData) > -1); 
									});							
									
									for (var i=0; i < aRemainingConferencedData.length; i++) {
										// include if not conferenced in current week or other week i.e if not rejected
										if (
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIds) == -1 && 
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIdsOtherWeek) == -1
										) {
											oFilteredData.push(aRemainingConferencedData[i]);
										}
										if (iMaxNum == _.size(_.uniq(oFilteredData))) {
											break;
										}							
									}
									// if count is still less then include rejected (conferenced) data of other week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {
											// first check that it is not conferenced in current week then include
											if ($.inArray(aRejectedIdsOtherWeek[i], aRejectedIds) == -1) {
												oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIdsOtherWeek[i]})[0];
												if (oData) {
													oFilteredData.push(oData);
												}
												if (iMaxNum == _.size(_.uniq(oFilteredData))) {
													break;
												}
											}
										}
									}
									// if count is still less then include rejected (conferenced) data of current week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIds.length; i++) {
											oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIds[i]})[0];
											if (oData) {
												oFilteredData.push(oData);
											}
											if (iMaxNum == _.size(_.uniq(oFilteredData))) {
												break;
											}
										}
									}
								}
								else if (iCount > iMaxNum) {
									// if count is more, then reject students conferenced within current week
									for (var i=0; i < aRejectedIds.length; i++) {							
										oFilteredData = _.reject(oFilteredData, function(obj) { 
											return (obj.UserID == aRejectedIds[i]); 
										});
										if (iMaxNum == _.size(_.uniq(oFilteredData))) {
											break;
										}							
									}
									// if count is still more, then reject students conferenced in other week as well
									if (_.size(oFilteredData) > iMaxNum) {
										// if count is more, then reject students conferenced in other week
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {							
											oFilteredData = _.reject(oFilteredData, function(obj) { 
												return (obj.UserID == aRejectedIdsOtherWeek[i]); 
											});
											if (iMaxNum == _.size(_.uniq(oFilteredData))) {
												break;
											}							
										}
									}
								}
							}
							else {
								bNoLimit = true;
							}							
							
							oFilteredData = _.uniq(oFilteredData);							
							oStudentListToDisplay = oCCIncludedData;
							
							for (var i=0; i < oFilteredData.length; i++) {
								oStudentListToDisplay.push(oFilteredData[i]);
							}
							oStudentListToDisplay = _.sortBy(oStudentListToDisplay, "UserDisplayName");										
							fRenderStudentList();							
						}
					});			
					
				}
				
				// get list of all conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_ASSIGNMENT], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_STRATEGY], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_INDIVIDUALS], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterSubsequentStud4Assignment
				}];			
				
				oSelf.allConferencedStudentList = [];
				oSelf.nativeCallWrapper(oNativeRequest);
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_STRATEGY) {
				/* 	i) Students with low IR score from last week, if no scores are available then consider the current week
					ii) The student that has not been conferenced within the current week need to be picked */
				var fFilterSubsequentStud4Strategy = function () {
					var aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						oFilteredData = {},
						iDayNumber = null,
						iWeekNumber = null,
						dStudentPercentage = 0,
						iDataBenchmark = null,
						aLowScoredStudentData = [],
						iLastWeek = null,
						aMasterScoredDataLastWeek = [],
						aWeekRange = [],
						oData = {},
						aRejectedIdsOtherWeek = [],
						aStudentsToRetain = [],
						aConferenceListOfIds = [],
						oCCIncludedData = [],
						oStudentDataFiltered = {};
						
					// pick students who conferenced Strategy in current day
					objconferenceListStudentData = null;
					$.nativeCall({
						'method':			'GetListOfConferenceStudentData',
						'inputParams':		[CONFERENCE_TYPES.c_s_STRATEGY],
						'globalResource':	'objconferenceListStudentData',
						'interval':			500,
						'breakAfter':		125000,
						'debug':			false,
						'onComplete':		function () {
							aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");					
							// pick students who conferenced Strategy in current day
							aStudentsToRetain = _.pluck(_.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId}), "StudentID");
							aRejectedIds = _.difference(aConferenceListOfIds, aStudentsToRetain);				
							
							oCCIncludedData = _.filter(oSelf.model.StudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) > -1); 
							});
							
							oStudentDataFiltered = _.filter(oStudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) == -1); 
							});
							
							// remaining no. of students to add
							iMaxNum = oSelf.iNumOfStudents - _.size(oCCIncludedData);
							
							if (iMaxNum > 0) {
								// Try for students which have not been conferenced within the current week
								if (oSelf.allConferencedStudentList.length > 0) {
									aStudentListOfIds = _.pluck(oStudentDataFiltered, "UserID");
									for (var i=0; i < oSelf.allConferencedStudentList.length; i++) {
										iDayNumber = (oSelf.allConferencedStudentList[i].ConferenceLessonName.split(','))[1].replace('Lesson','').trim();
										iWeekNumber = iDayNumber/5;
										iWeekNumber = (iWeekNumber > Math.floor(iWeekNumber)) ? Math.floor(iWeekNumber + 1) : iWeekNumber;
										if (iWeekNumber == oSelf.currentWeek) {
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIds) == -1) {
												aRejectedIds.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
										else {
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIdsOtherWeek) == -1) {
												aRejectedIdsOtherWeek.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
									}						
								}					
								
								// Pick students with low writing  score from last week	& current week				
								iLastWeek  = (oSelf.currentWeek-1) < 0 ? 1 : (oSelf.currentWeek-1);
								aWeekRange.push(iLastWeek);					
								
								if (iLastWeek != oSelf.currentWeek) {
									aWeekRange.push(oSelf.currentWeek);
								}					
								aMasterScoredDataCurrentWeek = (_.filter(oSelf.aMasterScoredData, function(obj){ 
									return ($.inArray(obj.WeekNumber, aWeekRange) > -1); 
								}));					
								
								oFilteredData = [];
								if (aMasterScoredDataLastWeek.length || aMasterScoredDataCurrentWeek.length) {
									iDataBenchmark = oSelf.getMinimumMarks(writingBenchmarkIndex);
									// Pick students with low writing  score from last week
									for (var i=0; i < aMasterScoredDataLastWeek.length; i++) {					
										if (aMasterScoredDataLastWeek[i].ItemSubType == 'iwt') {
											dStudentPercentage = (aMasterScoredDataLastWeek[i].FinalScore / aMasterScoredDataLastWeek[i].ItemMaxScore) * 100;
											if (dStudentPercentage < Object.keys(iDataBenchmark)[0]) {
												if ($.inArray(aMasterScoredDataLastWeek[i].StudentId, aLowScoredStudentData) == -1) {
													aLowScoredStudentData.push(aMasterScoredDataLastWeek[i].StudentId);
													oData = (_.where(oStudentDataFiltered, {"UserID" : aMasterScoredDataLastWeek[i].StudentId}))[0];
													if (oData) {
														oFilteredData.push(oData);
													}
												}
											}						
										}
									}						
									// if count is less, then Pick students with low writing score from current week
									if (_.size(oFilteredData) < iMaxNum) {
										for (var i=0; i < aMasterScoredDataCurrentWeek.length; i++) {					
											if (aMasterScoredDataCurrentWeek[i].ItemSubType == 'iwt') {
												dStudentPercentage = (aMasterScoredDataCurrentWeek[i].FinalScore / aMasterScoredDataCurrentWeek[i].ItemMaxScore) * 100;
												if (dStudentPercentage < Object.keys(iDataBenchmark)[0]) {
													if ($.inArray(aMasterScoredDataCurrentWeek[i].StudentId, aLowScoredStudentData) == -1) {
														aLowScoredStudentData.push(aMasterScoredDataCurrentWeek[i].StudentId);
														oData = (_.where(oStudentDataFiltered, {"UserID" : aMasterScoredDataCurrentWeek[i].StudentId}))[0];
														if (oData) {
															oFilteredData.push(oData);
														}
													}
												}						
											}
										}							
									}
								}
								else {
									oFilteredData = oStudentDataFiltered;
								}
								iCount = _.size(_.uniq(oFilteredData));
								// if count is less, then include remaining students with least conferencing within current week
								if (iCount < iMaxNum) {
									aRemainingConferencedData = _.reject(oStudentDataFiltered, function(obj) { 
											return ($.inArray(obj.UserID, aLowScoredStudentData) > -1); 
									});							
									
									for (var i=0; i < aRemainingConferencedData.length; i++) {
										// include if not conferenced in current week or other week i.e if not rejected
										if (
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIds) == -1 && 
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIdsOtherWeek) == -1
										) {
											oFilteredData.push(aRemainingConferencedData[i]);
										}
										if (iMaxNum == _.size(_.uniq(oFilteredData))) {
											break;
										}							
									}
									// if count is still less then include rejected (conferenced) data of other week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {
											// first check that it is not conferenced in current week then include
											if ($.inArray(aRejectedIdsOtherWeek[i], aRejectedIds) == -1) {
												oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIdsOtherWeek[i]})[0];
												if (oData) {
													oFilteredData.push(oData);
												}
												if (iMaxNum == _.size(_.uniq(oFilteredData))) {
													break;
												}
											}
										}
									}
									// if count is still less then include rejected (conferenced) data of current week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIds.length; i++) {								
											oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIds[i]})[0];
											if (oData) {
												oFilteredData.push(oData);
											}
											if (iMaxNum == _.size(_.uniq(oFilteredData))) {
												break;
											}								
										}
									}
								}
								else if (iCount > iMaxNum) {
									// if count is more, then reject students conferenced within current week
									for (var i=0; i < aRejectedIds.length; i++) {							
										oFilteredData = _.reject(oFilteredData, function(obj) { 
											return (obj.UserID == aRejectedIds[i]); 
										});
										if (iMaxNum == _.size(_.uniq(oFilteredData))) {
											break;
										}							
									}
									// if count is still more, then reject students conferenced in other week as well
									if (_.size(oFilteredData) > iMaxNum) {
										// if count is more, then reject students conferenced in other week
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {							
											oFilteredData = _.reject(oFilteredData, function(obj) { 
												return (obj.UserID == aRejectedIdsOtherWeek[i]); 
											});
											if (iMaxNum == _.size(_.uniq(oFilteredData))) {
												break;
											}							
										}
									}
								}								
							}
							else {
								bNoLimit = true;
							}
							
							oFilteredData = _.uniq(oFilteredData);							
							oStudentListToDisplay = oCCIncludedData;
							
							for (var i=0; i < oFilteredData.length; i++) {
								oStudentListToDisplay.push(oFilteredData[i]);
							}
							oStudentListToDisplay = _.sortBy(oStudentListToDisplay, "UserDisplayName");										
							fRenderStudentList();
						}
					});	
					
				}
				
				// get list of all conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_ASSIGNMENT], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_STRATEGY], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_INDIVIDUALS], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterSubsequentStud4Strategy
				}];			
				
				oSelf.allConferencedStudentList = [];
				oSelf.nativeCallWrapper(oNativeRequest);
			}
			else if (sConferenceType == CONFERENCE_TYPES.c_s_INDIVIDUALS) {
				/* 	i) Students with most pending assignment from last 2 week (including current week)
					ii) The student that has not been conferenced within the current week need to be picked */
				var fFilterSubsequentStud4Individual = function () {
					var aStudentListOfIds = [],
						aRejectedIds = [],
						iCount = 0,
						oFilteredData = {},						
						iDayNumber = null,
						iWeekNumber = null,
						oFilteredConferencedData = {},
						iLastWeek = null,
						aMasterScoredDataLastWeek = [],
						aCountData = [],
						oPendingData = [],
						aPendingStudentData = [],
						oData = {},
						aRejectedIdsOtherWeek = [],
						aWeekRange = [],
						aStudentsToRetain = [],
						aConferenceListOfIds = [],
						oCCIncludedData = [],
						oStudentDataFiltered = {};
			
					// pick students who conferenced Strategy in current day
					objconferenceListStudentData = null;
					$.nativeCall({
						'method':			'GetListOfConferenceStudentData',
						'inputParams':		[CONFERENCE_TYPES.c_s_INDIVIDUALS],
						'globalResource':	'objconferenceListStudentData',
						'interval':			500,
						'breakAfter':		125000,
						'debug':			false,
						'onComplete':		function () {
							aConferenceListOfIds = _.pluck(objconferenceListStudentData.Content, "StudentID");					
							// pick students who conferenced Strategy in current day
							aStudentsToRetain = _.pluck(_.where(objconferenceListStudentData.Content, {"ItemID" : oSelf.sLessonId}), "StudentID");
							aRejectedIds = _.difference(aConferenceListOfIds, aStudentsToRetain);				
							
							oCCIncludedData = _.filter(oSelf.model.StudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) > -1); 
							});
							
							oStudentDataFiltered = _.filter(oStudentData, function(obj){ 
								return ($.inArray(obj.UserID, aStudentsToRetain) == -1); 
							});
							
							// remaining no. of students to add
							iMaxNum = oSelf.iNumOfStudents - _.size(oCCIncludedData);
							
							if (iMaxNum > 0) {
								// Try for students which have not been conferenced within the current week
								if (oSelf.allConferencedStudentList.length > 0) {
									aStudentListOfIds = _.pluck(oStudentDataFiltered, "UserID");
									for (var i=0; i < oSelf.allConferencedStudentList.length; i++) {
										iDayNumber = (oSelf.allConferencedStudentList[i].ConferenceLessonName.split(','))[1].replace('Lesson','').trim();
										iWeekNumber = iDayNumber/5;
										iWeekNumber = (iWeekNumber > Math.floor(iWeekNumber)) ? Math.floor(iWeekNumber + 1) : iWeekNumber;
										if (iWeekNumber == oSelf.currentWeek) {
											// Current week conferenced student Ids to be rejected
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIds) == -1) {
												aRejectedIds.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
										else {
											if ($.inArray(oSelf.allConferencedStudentList[i].StudentID, aRejectedIdsOtherWeek) == -1) {
												aRejectedIdsOtherWeek.push(oSelf.allConferencedStudentList[i].StudentID);
											}
										}
									}						
								}					
								
								// Pick Students with pending assignment from last 2 week (including current week)				
								iLast2Week  = (oSelf.currentWeek-2) < 0 ? 1 : (oSelf.currentWeek-2);
								iLastWeek  = (oSelf.currentWeek-1) < 0 ? 1 : (oSelf.currentWeek-1);
								aWeekRange.push(iLast2Week); 
								
								if (iLast2Week != iLastWeek) {
									aWeekRange.push(iLastWeek);
								}
								if (iLastWeek != oSelf.currentWeek) {
									aWeekRange.push(oSelf.currentWeek);
								}
								
								aMasterInprogressDataLastWeek = (_.filter(oSelf.aMasterInprogressData, function(obj){ 
									return ($.inArray(obj.WeekNumber, aWeekRange) > -1); 
								}));
								
								oFilteredData = [];
								oPendingData = [];
								if (aMasterInprogressDataLastWeek.length) {						
									// Pick Students with most pending assignment
									for (var i=0; i < aMasterInprogressDataLastWeek.length; i++) {							
										aCountData[aMasterInprogressDataLastWeek[i].StudentId] = {
											"Count" : (aCountData[aMasterInprogressDataLastWeek[i].StudentId] ? 
															aCountData[aMasterInprogressDataLastWeek[i].StudentId].Count : 0) + 1,
											"StudentID" : aMasterInprogressDataLastWeek[i].StudentId
										}							
									}
									aCountData = aCountData.sort(function(a, b){return b.Count-a.Count});
									$.each(aCountData, function(key, val) {
										// note: length of array is incorrect hence need this check
										if (typeof val == "undefined") {
											return false;
										}
										oData = _.where(oStudentDataFiltered, {"UserID" : val.StudentID})[0];
										if (oData) {
											oFilteredData.push(oData); 
										}
										if (iMaxNum == _.size(oFilteredData)) {
											return false;
										}
									});						
								}
								else {						
									oFilteredData = oStudentDataFiltered;						
								}				
								
								iCount = _.size(oFilteredData);
								// if count is less, then include remaining students with least conferencing within current week
								if (iCount < iMaxNum) {
									aRemainingConferencedData = _.reject(oStudentDataFiltered, function(obj) { 
											return ($.inArray(obj.UserID, aPendingStudentData) > -1); 
									});							
									
									for (var i=0; i < aRemainingConferencedData.length; i++) {
										// include if not conferenced in current week or other week i.e if not rejected
										if (
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIds) == -1 && 
											$.inArray(aRemainingConferencedData[i].UserID, aRejectedIdsOtherWeek) == -1
										) {
											oFilteredData.push(aRemainingConferencedData[i]);
										}
										if (iMaxNum == _.size(oFilteredData)) {
											break;
										}							
									}
									// if count is still less then include rejected (conferenced) data of other week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {
											// first check that it is not conferenced in current week then include
											if ($.inArray(aRejectedIdsOtherWeek[i], aRejectedIds) == -1) {
												oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIdsOtherWeek[i]})[0];
												if (oData) {
													oFilteredData.push(oData);
												}
												if (iMaxNum == _.size(oFilteredData)) {
													break;
												}
											}
										}
									}
									// if count is still less then include rejected (conferenced) data of current week as well
									iCount = _.size(oFilteredData);
									if (iCount < iMaxNum) {
										for (var i=0; i < aRejectedIds.length; i++) {								
											oData = _.where(aRemainingConferencedData, {"UserID" : aRejectedIds[i]})[0];
											if (oData) {
												oFilteredData.push(oData);
											}
											if (iMaxNum == _.size(oFilteredData)) {
												break;
											}								
										}
									}
								}
								else if (iCount > iMaxNum) {
									// if count is more, then reject students conferenced within current week
									for (var i=0; i < aRejectedIds.length; i++) {							
										oFilteredData = _.reject(oFilteredData, function(obj) { 
											return (obj.UserID == aRejectedIds[i]); 
										});
										if (iMaxNum == _.size(oFilteredData)) {
											break;
										}							
									}
									// if count is still more, then reject students conferenced in other week as well
									if (_.size(oFilteredData) > iMaxNum) {
										// if count is more, then reject students conferenced in other week
										for (var i=0; i < aRejectedIdsOtherWeek.length; i++) {							
											oFilteredData = _.reject(oFilteredData, function(obj) { 
												return (obj.UserID == aRejectedIdsOtherWeek[i]); 
											});
											if (iMaxNum == _.size(oFilteredData)) {
												break;
											}							
										}
									}
								}
							}
							else {
								bNoLimit = true;
							}
							
							oFilteredData = _.uniq(oFilteredData);							
							oStudentListToDisplay = oCCIncludedData;
							
							for (var i=0; i < oFilteredData.length; i++) {
								oStudentListToDisplay.push(oFilteredData[i]);
							}
							oStudentListToDisplay = _.sortBy(oStudentListToDisplay, "UserDisplayName");										
							fRenderStudentList();
						}
					});
				}
				
				// get list of all conference data
				oNativeRequest = [{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_TTR], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_CLASSROOM_CONVERSATION], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_ASSIGNMENT], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_STRATEGY], 
					'response': 'objconferenceListStudentData',
					'callback': null
				},
				{
					'serviceName': 'GetListOfConferenceStudentData', 
					'params': [CONFERENCE_TYPES.c_s_INDIVIDUALS], 
					'response': 'objconferenceListStudentData',
					'callback': fFilterSubsequentStud4Individual
				}];			
				
				oSelf.allConferencedStudentList = [];
				oSelf.nativeCallWrapper(oNativeRequest);
			}
		}
	}
	catch (e) {
		
	}			
}

/**
 * Get Minimum Marks
 * @method getMinimumMarks
 * @param {String} benchmarkindex 
 * @return 
 */
ConferenceView.prototype.getMinimumMarks = function(benchmarkindex) {

	var aTempArr = benchmarkindex.toString().split("_"), 	
		iDataBenchmark = "",
		idx1 = null,
		idx2 = null,
		idx3 = null;
 
	if (aTempArr.length == 3) {
		idx1 = aTempArr[0]; 
		idx2 = aTempArr[1]; 
		idx3 = aTempArr[2];
		iDataBenchmark = LessonView.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark;
	} 
	else if (aTempArr.length == 2) {
		idx1 = aTempArr[0]; 
		idx2 = aTempArr[1];
		iDataBenchmark = LessonView.model.performanceInfoData.groups[idx1].subgroup[idx2].benchmark;
	} 
	else {
		idx1 = aTempArr[0];
		iDataBenchmark = LessonView.model.performanceInfoData.groups[idx1].benchmark;
	}
	
	return iDataBenchmark;
};

/**
 * Bind Events for Student List
 * @method bindStudentListEvents
 * @param {Object} oData
 * @return 
 */
ConferenceView.prototype.bindStudentListEvents = function (oData) {
	var oSelf = this;
	
	// Student List Edit Button Click
	$('#'+oSelf.sSlideId+' [id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_EDIT_BTN+'_]').off("click tap").on("click tap", function () {
		oSelf.editStudentList(oData);
    });
	
	// Student Icon Click
	$(".student_box").off("click tap").on("click tap", function () {
		oSelf.gotoConferenceForm.call(this, oSelf);
	});    
	
	/* Refresh student list */
	$('#'+oSelf.sSlideId+' [id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_REFRESH_BTN+'_]').off("click tap").on("click tap", function(){
		if ($(this).attr("disabled")) {
			return;
		}
		$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_REFRESH_BTN+'_]').attr("disabled","disabled");
		LessonView.aConferenceTypes = [{"slideId": oSelf.sSlideId, "conferenceType": oSelf.sConferenceType}];
		LessonView.initConference();
	});
}

/**
 * Edit Student List 
 * @method editStudentList
 * @param {Object} oData 
 * @return 
 */
ConferenceView.prototype.editStudentList = function (oData) {
	var oSelf = this,
		aStudentLiList = [],		
		oStudentData =  _.sortBy(_.where(oSelf.model.StudentData, {"UserInLiveSession" : true, "UserRole" : "S"}), "UserDisplayName");	
	
	$('#'+oSelf.sSlideId+' .student_box').each(function() {		
		if ($('#'+oSelf.sSlideId+' #'+$(this).attr('student_id')).is(":visible")) {
			aStudentLiList.push($(this).attr('student_id'));
	   }
	});	
	
	$("#" +LESSON.c_s_STUDENTLIST_POPUP_AREA).empty().html(
		_.template($("#studentlistPopupTemplate").html(),
			{
				'StudentData': oStudentData,
				'data' : oData,
				'studentselectedlist' : aStudentLiList
			}
		));
		
	$("." + LESSON.c_s_MAIN_WRAPPER_CLASS).append('<div class="'+LESSON.c_s_OVERLAY_CLASS+'"></div>');
	
	// student select click event
	$('.tooltip_wrap_language ul li').off("click tap").on("click tap", function(){
		var sStudentId = $(this).attr('student_id'),
			sUserName = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			sItemdisplayName = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			sConferenceType = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK,
			sStudentStr = GENERAL.c_s_SPECIAL_CHARACTERS_BLANK;
			
		$('#'+oSelf.sSlideId+' #' + sStudentId).toggle();
		$(this).toggleClass('active');
		
		if ($(this).hasClass('active')) {			
			if ($('#'+oSelf.sSlideId+' #'+$(this).attr('student_id')).is(":visible") == false && $('#'+oSelf.sSlideId+' .student_view_box:visible').length < oSelf.iMaxStudents) {				
				sUserName   = ($(this).text().replace(/<\/?span[^>]*>/g,""));
				sItemdisplayName = $('#'+oSelf.sSlideId+' .student_box').eq(0).attr('itemdisplayname');
				sConferenceType =  $('#'+oSelf.sSlideId+' .student_box').eq(0).attr('conference-type');					
				sStudentStr = '<div id="'+$(this).attr('student_id')+'" class="student_view_box">\
								<div current_cur_reading_level="2" current_cur_reading_bookid="" lesson_id="'+LessonView.model.LessonData.lessionId+'" itemdisplayname="'+sItemdisplayName+'" student_id="'+$(this).attr('student_id')+'" student_name="'+encodeURIComponent(sUserName)+'" conference-type="'+sConferenceType+'" class="student_box">\
								<img src="media/student_img3.png" alt=""></div>\
								<div class="student_view_name">'+sUserName+'</div>\
								</div>\
								<div class="clear"></div>';
					
				$("#"+oSelf.sSlideId+" .student_grid_view_inner .clear").remove();
				$("#"+oSelf.sSlideId+" .student_grid_view_inner").append(sStudentStr);				
				
				$("#"+oSelf.sSlideId+" .student_box").off("click tap").on("click tap", function () {
					oSelf.gotoConferenceForm.call(this, oSelf);
				});
			}
		}
		else {
			if ($('#'+oSelf.sSlideId +' #'+$(this).attr('student_id')).is(":visible")) {
				$('#'+oSelf.sSlideId +' #'+$(this).attr('student_id')).hide();
			}
		}		 
		
	});	
	
	// student list cancel button click event	
	$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_CANCEL_BTN+'_]').off("click tap").on("click tap", function(){			
		var cancelpart = $(this).attr('id').split("_");		
		$("#"+oSelf.sSlideId+" .student_box").each(function(){
			if ($.inArray($(this).attr('student_id'),aStudentLiList) == -1) { 
				$(this).parent().hide();
			}else{
				$(this).parent().show();	
			}
		});			
		
		$("#" +LESSON.c_s_CONFERENCE_STUDENTLIST+"_"+cancelpart[1]+"_"+cancelpart[2]).hide();
		$('.'+ LESSON.c_s_OVERLAY_CLASS).remove();
	});	
	
	// student list save button click event	
	$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_SAVE_BTN+'_]').off("click tap").on("click tap", function() {
		var cancelpart = $(this).attr('id').split("_");
		aStudentLiList.length = 0;			
		
		$("#" +LESSON.c_s_CONFERENCE_STUDENTLIST+"_"+cancelpart[1]+"_"+cancelpart[2]).hide();			
		$('.'+ LESSON.c_s_OVERLAY_CLASS).remove();
	});	
}

/**
 * Open Conference Form 
 * @method gotoConferenceForm
 * @return 
 */
ConferenceView.prototype.gotoConferenceForm = function (oSelf) {	
	var conference_type = $(this).attr('conference-type'),
		student_name    = $(this).attr('student_name'),
		student_id      = $(this).attr('student_id'),
		item_display_name = $(this).attr('itemdisplayname'),
		lesson_id = $(this).attr('lesson_id'),
		current_reading_bookid = $(this).attr('current_cur_reading_bookid'),
		current_reading_level = $(this).attr('current_cur_reading_level'),
		current_unit_no = objLessonJsonData.unitNumber,
		current_week_no = objLessonJsonData.weekNumber,
		sIframeUrl = "conference.html?";
		
	current_reading_bookid = ((typeof current_reading_bookid == 'object' && _.size(current_reading_bookid) == 0) || 
								(current_reading_bookid && current_reading_bookid.length == 0)) ? '' : current_reading_bookid; 			
	sIframeUrl += 	LESSON.c_s_POPUP_STUDENT_NAME + '=' + student_name + '&' +
				LESSON.c_s_POPUP_STUDENT_ID + '=' + student_id + '&' +
				LESSON.c_s_POPUP_ITEMDISPLAY_NAME + '=' + item_display_name + '&' +
				LESSON.c_s_POPUP_CONFERENCE_TYPE + '=' + conference_type+ '&' +
				LESSON.c_s_POPUP_LESSON_ID + '=' + lesson_id + '&' +
				LESSON.c_s_POPUP_CURRENT_READING_ID + '=' + current_reading_bookid+ '&' +
				LESSON.c_s_POPUP_CURRENT_LEVEL + '=' + current_reading_level+ '&' +
				LESSON.c_s_POPUP_UNIT_NO + '=' + current_unit_no+ '&' +
				LESSON.c_s_POPUP_WEEK_NO + '=' + current_week_no+ '&' +
				LESSON.c_s_UNIT_WEEK_DETAILS + '=' + oSelf.sUnitsWeeksDetails;
	
	if(objLessonJsonData.hasOwnProperty('serviceVersion') && objLessonJsonData.serviceVersion == "v2"){
		sIframeUrl +=	'&' +LESSON.c_s_POPUP_SERVICE_VERSION + '=' + objLessonJsonData.serviceVersion;
	}
	
	if ( oPlatform.isDevice()) {
		ShowWebView(sIframeUrl);
	}
	else {

		$('#' + LESSON.c_s_VIEW_CONFERENCE_AREA).find('iframe').attr('src',sIframeUrl).load(function() {
		$('#' + LESSON.c_s_VIEW_CONFERENCE_AREA).show();
		LessonView.resize();
		});
	}
	HideNativeBottomBar(true);   
}

/**
 * Native Call Wrapper
 * @method nativeCallWrapper
 * @param {Array} aServiceNames 
 * @param {Array} aParams
 * @param {Object} oResponse
 * @param {Function} fCallback
 * @return 
 */
ConferenceView.prototype.nativeCallWrapper = function (oRequest) {
	var oSelf = this;
	
	$.nativeCall({
		'method':			oRequest[0]['serviceName'],
		'inputParams':		oRequest[0]['params'],
		'globalResource':	oRequest[0]['response'],
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			if (oRequest[0]['callback'] == null) {				
				_.each(objconferenceListStudentData.Content, function (value, key) {
					oSelf.allConferencedStudentList.push(value);
				});				
				oSelf.nativeCallWrapper(oRequest.slice(1,oRequest.length));
			}
			else {
				oRequest[0]['callback'].call();
			}
		}
	});
}