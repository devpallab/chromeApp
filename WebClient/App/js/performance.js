/**
 *  performance.js - JavaScript document
 *  (c) 2014-2015 iLit. All rights reserved.
 *
 * @author LearningMate Solutions Private Limited 
 * @version 
 * @license 
 */
 
// Declare PerformanceView object 
function PerformanceView () {}

// PerformanceView Properties
PerformanceView.model = null;
PerformanceView.viewMode = null;
PerformanceView.prevViewMode = null;
PerformanceView.subMode = null;
PerformanceView.idxBenchmark = null;

PerformanceView.fromUnitNo = 1;
PerformanceView.toUnitNo = 1;
PerformanceView.defaultGraphTypeId = 0;
PerformanceView.fromWeekNo = null;
PerformanceView.toWeekNo = null;
PerformanceView.selectedStudents = {};
PerformanceView.slider_min_val = null;
PerformanceView.slider_max_val = null;

PerformanceView.xAxistitle = null;
PerformanceView.xAxisMax = null;
PerformanceView.xAxisMin = null;
PerformanceView.xAxisTickInterval = null;

PerformanceView.yAxistitle = null;
PerformanceView.yAxisMax = null;
PerformanceView.yAxisMin = null;
PerformanceView.yAxisTickInterval = null;

PerformanceView._alert = ISeriesBase.prototype._alert;

/**
* @method: init 
* @uses: for initialize the object
* @return void;
*/
PerformanceView.init = function (model) {
	var oSelf = this;
	oSelf.viewMode = PERFORMANCE.c_s_MODE_LINE_GRAPH;
	oSelf.leftPanelData = {};
    oSelf.model = model;
	
	oSelf.model.unitDetails.curUnitNumber = (
												typeof oSelf.model.unitDetails.curUnitNumber == "undefined" || 
												isNaN(parseInt(oSelf.model.unitDetails.curUnitNumber)) || 
												oSelf.model.unitDetails.curUnitNumber == "0" || 
												oSelf.model.unitDetails.curUnitNumber == 0
											) ? 1 : oSelf.model.unitDetails.curUnitNumber;
	
	oSelf.model.unitDetails.curWeekNumber = (
												typeof oSelf.model.unitDetails.curWeekNumber == "undefined" || 
												isNaN(parseInt(oSelf.model.unitDetails.curWeekNumber)) || 
												oSelf.model.unitDetails.curWeekNumber == "0" || 
												oSelf.model.unitDetails.curWeekNumber == 0 
											) ? 1 : oSelf.model.unitDetails.curWeekNumber;
	
	if (isSkillReportVisible(objPerformanceInfoJsonData.currentVersion, PERFORMANCE.c_s_APP_VER_SBR, objPerformanceInfoJsonData.appPlatform)) {
		for(var iKey = 0; iKey < oSelf.model.gradeBookData.length; iKey++) {
			if(typeof oSelf.model.gradeBookData[iKey] == "string") {
				oSelf.model.gradeBookData[iKey] = JSON.parse(oSelf.model.gradeBookData[iKey]);
			}
		}
	}
	
	oSelf.performanceTabHandler = new (function () {
		
		// import data using GetGradeBookForInstructorV2 web service			
		this.importGradebookForInstructorV2 = function (fCallBack) {
			if (typeof fCallBack != 'function') {
				fCallBack = jQuery.noop;
			}
			
			var $this = this;
				
			// Fetch Data from Server Afresh
			objGradeBookV2JsonData = 0;
			oUtility.showLoader({
				opacity:			0.4,
				'click-to-hide': 	false,
				'message':    		'<img src="media/loader.gif" />',
				'foreground-color':	'none',
				'box-style':		{
					'height':			'80px',
					'width':			'80px'
				}
			});
			
			GetGradebookForInstructorV2("Unit", "all", false, null);
			$this.checkGradebookForInstructorV2(fCallBack);
			// End Fetch Data from Server Afresh
		};
		
		// checking response of GetGradeBookForInstructorV2 web service
		this.checkGradebookForInstructorV2 = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objGradeBookV2JsonData == 0) {
					$this.checkGradebookForInstructorV2(fCallBack);
				}
				else {
					try {
						if (objGradeBookV2JsonData.Status == "200" || objGradeBookV2JsonData.Status == 200) {
							$this.importGradeBookAttemptData(fCallBack);
						}
						else {
							throw(objGradeBookV2JsonData.Error);
						}
					}
					catch (err){
						if (err.ErrorCode != "U1065") {
							PerformanceView._alert({
								divId:		'dialog-message',
								message:	err.ErrorUserDescription
							});
						}
					}
				}
			}, 1000);
		};
		
		// import data using GetGradeBookAttemptdata web service
		this.importGradeBookAttemptData = function (fCallBack) {
			if (typeof fCallBack != 'function') {
				fCallBack = jQuery.noop;
			}
			
			var $this = this,
				aItemAttemptIds = _.map(objGradeBookV2JsonData.Content.GradeBookData, function (obj) {
					return {
						IAID: obj.IAID,
						ARID: obj.ARID
					};
				});;
				
			// Fetch Data from Server Afresh
			objGradeBookJsonData = 0;
			GetGradebookAttemptData(aItemAttemptIds);
			$this.checkGradeBookAttemptData(fCallBack);
			// End Fetch Data from Server Afresh
		};
		
		// checking response of GetGradeBookAttemptdata web service
		this.checkGradeBookAttemptData = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objGradeBookJsonData == 0) {
					$this.checkGradeBookAttemptData(fCallBack);
				}
				else {
					oSelf.model.gradeBookData  = objGradeBookJsonData.Content;
					
					for(var iKey = 0; iKey < oSelf.model.gradeBookData.length; iKey++) {
						if(typeof oSelf.model.gradeBookData[iKey] == "string") {
							oSelf.model.gradeBookData[iKey] = JSON.parse(oSelf.model.gradeBookData[iKey]);
						}
					}
					
					$this.importGetClassUserLevel(fCallBack);
				}
			}, 1000);
		};
		
		
		// import data using GetClassUserLevel web service	
		this.importGetClassUserLevel = function (fCallBack) {
			if (typeof fCallBack != 'function') {
				fCallBack = jQuery.noop;
			}
			var $this = this;
				
			objGetClassUserLevel = 0;
			GetClassUserLevel();
			$this.checkGetClassUserLevel(fCallBack);
		};
		
		// checking response of GetClassUserDetails web service
		this.checkGetClassUserLevel = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objGetClassUserLevel == 0) {
					$this.checkGetClassUserLevel(fCallBack);
				}
				else {
					try {
						if (objGetClassUserLevel.Status == "200" || objGetClassUserLevel.Status == 200) {
							oSelf.model.classUserLevelDetails = objGetClassUserLevel.Content;
							
							$this.importGetLibraryProgressData(fCallBack);
						}
						else {
							throw(objGetClassUserLevel.Error);
						}
					}
					catch (err) {
						if (err.ErrorCode != "U1065") {
							PerformanceView._alert({
								divId:		'dialog-message',
								message:	err.ErrorUserDescription
							});
						}
					}
				}
			}, 1000);
		};
	
		// import data using GetLibraryProgressDetailForClass web service	
		this.importGetLibraryProgressData = function (fCallBack) {
			var $this = this;
			objLibraryProgressDetailForClass = 0;
			GetLibraryProgressDetailForClass();
			$this.checkGetLibraryProgressData(fCallBack);
		};
		
		// checking response of GetLibraryProgressDetailForClass web service
		this.checkGetLibraryProgressData = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objLibraryProgressDetailForClass == 0) {
					$this.checkGetLibraryProgressData(fCallBack);
				}
				else {
					try {
						if (objLibraryProgressDetailForClass.Status == "200" || objLibraryProgressDetailForClass.Status == 200) {
							
							oSelf.model.classLibraryProgressData  = objLibraryProgressDetailForClass.Content;
							// following checking for backward compatibility 
							// i.e. if current app version is greater than 3.1.6 or using web client 
							// then Skill Based Report functionality will be available otherwise not
							if (
								isSkillReportVisible(
									oSelf.model.unitDetails.currentVersion,
									PERFORMANCE.c_s_APP_VER_SBR,
									oSelf.model.unitDetails.appPlatform
								)
							) {
								$this.importGetSkillBasedReportDataByWeekRange(fCallBack);
							}
							else{
								oUtility.hideLoader();
								fCallBack.call(oSelf);
							}
						}
						else {
							throw (objLibraryProgressDetailForClass.Error);
						}
					}
					catch (err){
						if (err.ErrorCode != "U1065") {
							PerformanceView._alert({
								divId:		'dialog-message',
								message:	err.ErrorUserDescription
							});
						}
					}
				}
			}, 1000);
		};
		
		// import data using GetSkillTaxonomyInformation web service
		this.importSkillTaxonomyData = function (fCallBack) {
			if (typeof fCallBack != 'function') {
				fCallBack = jQuery.noop;
			}
			var $this = this;
			
			GetSkillTaxonomyInformation();
			$this.checkSkillTaxonomyData(fCallBack);
		};
		
		// checking response of GetSkillTaxonomyInformation web service
		this.checkSkillTaxonomyData = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objSkillTaxonomyInformation == 0) {
					$this.checkSkillTaxonomyData(fCallBack);
				}
				else {
					try {
						if (objSkillTaxonomyInformation.Status == "200" || objSkillTaxonomyInformation.Status == 200) {
							oSelf.model.skillTaxonomyInfo = objSkillTaxonomyInformation.Content;
							$this.importGetSkillBasedReportDataByWeekRange(fCallBack);
						}
						else {
							throw(objSkillTaxonomyInformation.Error);
						}
					}
					catch (err){
						if (err.ErrorCode != "U1065") {
							PerformanceView._alert({
								divId:		'dialog-message',
								message:	err.ErrorUserDescription
							});
						}
					}
				}
			}, 1000);
		};
		
		// import data using GetSkillBasedReportDataByWeekRange web service	
		this.importGetSkillBasedReportDataByWeekRange = function (fCallBack) {
			if (typeof fCallBack != 'function') {
				fCallBack = jQuery.noop;
			}
			var $this = this;
				
			objSkillBasedReportDataByWeekRange = 0;
			GetSkillBasedReportDataByWeekRange();
			$this.checkGetSkillBasedReportDataByWeekRange(fCallBack);
		};
		
		// checking response of GetSkillBasedReportDataByWeekRange web service
		this.checkGetSkillBasedReportDataByWeekRange = function (fCallBack) {
			var $this = this;
			setTimeout(function () {
				if (objSkillBasedReportDataByWeekRange == 0) {
					$this.checkGetSkillBasedReportDataByWeekRange(fCallBack);
				}
				else {
					try {
						if (objSkillBasedReportDataByWeekRange.Status == "200" || objSkillBasedReportDataByWeekRange.Status == 200) {
							oSelf.model.skillBasedReportDataByWeekRange = objSkillBasedReportDataByWeekRange.Content;
							
							oUtility.hideLoader();
							fCallBack.call(oSelf);
						}
						else {
							throw(objSkillBasedReportDataByWeekRange.Error);
						}
					}
					catch (err) {
						if (err.ErrorCode != "U1065") {
							PerformanceView._alert({
								divId:		'dialog-message',
								message:	err.ErrorUserDescription
							});
						}
					}
				}
			}, 1000);
		};
	
	})();
	
	oSelf.lineGraphAndDetailViewHandler = new (function () {
		var aMasterData = [],
			aFilters = {};
		// prepare master data object
		this.prepareData = function () { // Method 2 & 3
			aMasterData = [];
			// Prepare Master data from GradeBook JSON
			if (oSelf.model.gradeBookData != null) {
				for (var iIdx = 0; iIdx < oSelf.model.gradeBookData.length; iIdx++) {
					var oItem = oSelf.model.gradeBookData[iIdx];
					if (oItem['ICS'] != PERFORMANCE.c_i_SCORED_STATUS) {
						continue;
					}
					
					var sStudentId = oItem['SID'],
						oData = {
							'StudentId':				sStudentId,
							'StudentName':				oSelf.selectedStudents[sStudentId],
							'ItemID':					oItem['IID'],
							'ItemAttemptID':			oItem['IAID'],
							'FinalScore':				oItem['FS'],
							'ItemMaxScore':				oItem['IMS'],
							'ItemAttemptSummary': 		oItem['IAS'],
							'InstructorScoreRubric': 	oItem['ISR'],
							'PKTOralFluencyScore': 		oItem['OFR']
						},
						aAssignmentData = _.where(oSelf.model['assignmentListData'], {ItemID: oItem['IID']});
					
					if (aAssignmentData.length > 0) {
						oAssignmentData 		= aAssignmentData.first();
						oData['ItemName'] 		= oAssignmentData['ItemName'];
						oData['ItemSubject'] 	= oAssignmentData['ItemSubject'];
						oData['ItemSubType'] 	= oAssignmentData['ItemSubType'];
						oData['UnitNumber'] 	= oAssignmentData['UnitNumber'];
						oData['WeekNumber'] 	= oAssignmentData['WeekNumber'];
						oData['ItemType'] 		= oAssignmentData['ItemType'];
						oData['ExtraPractice'] 	= oAssignmentData['ExtraPractice'];
						oData['WordCount'] 		= (oAssignmentData['ItemSubType'] == 'iwt') ? 900 : 0;
						
						// Start: following code block for Weekly Reading Check. 
						// generate unit number & week number from assessment name 
						// like 1.20 Weekly Reading Check so unit number is 1, week number is 4, & lesson number is 20
						if (oAssignmentData['ItemSubType'] == 'wrc') {
							var aAssessmentName = oAssignmentData['ItemName'].split(" "),
								aAssessmentUnitWeek = aAssessmentName[0].split("."),
								iAssessmentWeek = (Math.round(aAssessmentUnitWeek[1]) > 0) ? Math.round(aAssessmentUnitWeek[1])/5 : 1;
							oData['WeekNumber'] = iAssessmentWeek;
						}
						// End: following code block for Weekly Reading Check
						
						// Subject Search Key
						switch (oAssignmentData['ItemSubType']) {
							case 'iwt':
							case 'wrc':
							case 'paragraph':
							case 'essay':
							case 'word_slam':
							case 'unitbenchmark':
								oData['SubjectSearchKey'] = oAssignmentData['ItemSubType'];
								break;
							case 'studyplan':
							case 'phonictextbasedslide':
							case 'extendedphonic':
							case 'studyplan':
								oData['SubjectSearchKey'] = oAssignmentData['ItemSubject'];
								break;
						}
						aMasterData.push(oData);
					}
				}
			}

			// End: Prepare Master data from GradeBook JSON
			
			// Prepare Master data from GetLibraryProgressDetailForClass JSON
			if (oSelf.model.classLibraryProgressData != 0) {
				for (var iIdx = 0; iIdx < oSelf.model.classLibraryProgressData.length; iIdx++) {
					var oItem = oSelf.model.classLibraryProgressData[iIdx];
					if (
						typeof oItem['ProgressDataDetails'] == 'undefined' || 
						oItem['ProgressDataDetails'] == '' ||  
						oItem['ProgressDataDetails'] == null 
					) {
						continue;
					}
					
					var sStudentId = oItem['StudentID'],
						oProgressDataDetails = JSON.parse(oItem['ProgressDataDetails']);
					
					
					var oProgressDataWordCount = (typeof oProgressDataDetails.WordCountObj == 'string') ? JSON.parse(oProgressDataDetails.WordCountObj) : oProgressDataDetails.WordCountObj;
					
					$.each(oProgressDataWordCount, function (unitKey, wordVal) {
						
						var aInfo = unitKey.split("."),
							oDataUnitNumber = (isNaN(parseInt(aInfo[0]))) ? oSelf.model.unitDetails.curUnitNumber : aInfo[0], 
							oDataWeekNumber = (isNaN(parseInt(aInfo[1]))) ? oSelf.model.unitDetails.curWeekNumber : aInfo[1],
							oData = {
								'StudentId':				sStudentId,
								'StudentName':				oSelf.selectedStudents[sStudentId],
								'ItemID':					oItem['ItemID'],
								'FinalScore':				0,
								'ItemMaxScore':				0,
								'ItemAttemptSummary': 		'',
								'InstructorScoreRubric': 	'',
								'ItemName': 				'',
								'ItemSubType': 				aInfo[2],
								'UnitNumber': 				parseInt(oDataUnitNumber),
								'WeekNumber':				parseInt(oDataWeekNumber),
								'ItemType':					'word_count',
								'WordCount':				parseInt(wordVal)
							};

						// Subject Search Key
						switch (aInfo[2]) {
							case 'RATA':
								oData['ItemSubject'] = "word_count_rata";
								oData['SubjectSearchKey'] = "word_count_rata";
								break;
							default: //case 'TTR':								
								oData['ItemSubject'] = "word_count_ttr";
								oData['SubjectSearchKey'] = "word_count_ttr";
								break;
						}
						// End Subject Search Key
						aMasterData.push(oData);
					});
				}
			}

			// End: Prepare master data from GetLibraryProgressDetailForClass JSON
						
			// Prepare Master data from GetClassUserDetails JSON
			if (oSelf.model.classUserLevelDetails != 0) {
				for (var iIdx = 0; iIdx < oSelf.model.classUserLevelDetails.length; iIdx++) {
					var oItem = oSelf.model.classUserLevelDetails[iIdx];
					if (
						typeof oItem['UserLexileLevelDetails'] == 'undefined' || 
						oItem['UserLexileLevelDetails'] == '' ||  
						oItem['UserLexileLevelDetails'] == null 
					) {
						continue;
					}
					
					var sStudentId = oItem['StudentId'],
						aUserLexileLevelDetails = (typeof oItem['UserLexileLevelDetails'] == 'string') ? JSON.parse(decodeURIComponent(oItem['UserLexileLevelDetails'])) : oItem['UserLexileLevelDetails'];
					
					//console.log("aUserLexileLevelDetails: " + aUserLexileLevelDetails.length);
					$.each(aUserLexileLevelDetails, function (iKey, oVal) {
						var iDataUnitNumber = (typeof oVal["UN"] != "undefined") ? oVal["UN"] : oVal["U"], 
							iDataWeekNumber = (typeof oVal["W"] != "undefined") ? oVal["W"] : 1, 
							iDataLexileLevel = (typeof oVal["LL"] != "undefined") ? oVal["LL"] : oVal["L"],  
							oData = {
								'StudentId':				sStudentId,
								'StudentName':				oSelf.selectedStudents[sStudentId],
								'ItemID':					'',
								'FinalScore':				0,
								'lexileLevel':				parseInt(iDataLexileLevel),
								'ItemMaxScore':				0,
								'ItemAttemptSummary': 		'',
								'InstructorScoreRubric': 	'',
								'ItemName': 				'',
								'ItemSubType': 				'',
								'ExtraPractice': 			'No', 
								'UnitNumber': 				parseInt(iDataUnitNumber),
								'WeekNumber':				parseInt(iDataWeekNumber),
								'ItemType':					'reading_level',
								'WordCount':				'',
								'ItemSubject': 				'reading_level',
								'SubjectSearchKey': 		'reading_level'
							};
						aMasterData.push(oData);
					}); 
				}
			}
			else {
				return;
			}
			// End: Prepare master data from GetClassUserDetails JSON
		};
		
		// prepareFilters: for preparing filter object
		this.prepareFilters = function () {
			var iLessonsPerWeek = 5;
			// Student Filters
			aFilters['StudentId'] = [];
			jQuery('#' + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li.active').each(function () {
				aFilters['StudentId'].push(jQuery(this).data('student-id'));
			});
			// End Student Filters
			
			// Subject Filters
			aFilters['ItemSubject'] = [];
			var sSubject = jQuery('.menuclass li.active:last > a').data('pgraph-type');
			
			aFilters['ItemSubject'].push(sSubject);
			
			for (sTopic in oSelf.leftPanelData) {
				var oItem = oSelf.leftPanelData[sTopic];
				if (oItem.parent == sSubject) {
					// check duplicate, if not found then push ItemSubject
					if (aFilters['ItemSubject'].indexOf(sTopic) == -1) {
						aFilters['ItemSubject'].push(sTopic);
					}
				}
			}
			
			// Following If block for Oral Fluency
			if (
				sSubject == PERFORMANCE.c_s_WCPM || 
				sSubject == PERFORMANCE.c_s_ORAL_FLUENCY
			) {
				aFilters['ItemSubject'].push("pktof");
			}
			
						
			// Following If block for IWTHighlight, IWTDnD, Read Critically
			if (
				sSubject == PERFORMANCE.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE || 
				sSubject == PERFORMANCE.c_s_LBL_IWT_SUMMARY_SLIDE ||  
				sSubject == PERFORMANCE.c_s_LBL_IWT_TEXTANSWER_SLIDE
			) {
				aFilters['ItemSubject'].push(oSelf.leftPanelData[sSubject].parent);
			}
			// End Subject Filters
			
			oSelf.xAxistitle = PERFORMANCE.c_s_LABEL_LESSONS;
			
			// Unit & Week Filters 
				// IPP-4027 
			var aSliderEnds = $("#" + PERFORMANCE.c_s_SLIDER).slider("values"),
				iSliderMin = parseInt(aSliderEnds.first()),
				iSliderMax = parseInt(aSliderEnds.last()),
				oUnitWeekDetails = $GLOBALS.get('UnitWeekDetails'),
				iUnitFrom = oUnitWeekDetails.getUnit4mWeeks(iSliderMin),
				iUnitTo = oUnitWeekDetails.getUnit4mWeeks(iSliderMax),
				iWeekFrom4mSlider = parseInt($('#lessonId_' + iSliderMin).data('week-number')),
				iWeekTo4mSlider = parseInt($('#lessonId_' + iSliderMax).data('week-number')),
				iWeekFrom = oUnitWeekDetails.getCumulativeWeeks(iUnitFrom, iWeekFrom4mSlider);
				iWeekTo = oUnitWeekDetails.getCumulativeWeeks(iUnitTo, iWeekTo4mSlider);
			
			aFilters['UnitNumber'] = _.range(iUnitFrom, iUnitTo + 1, 1);
			aFilters['WeekNumber'] = [iWeekFrom4mSlider, iWeekTo4mSlider];
				// End IPP-4027 
			// End Unit & Week Filters 
			
			if (sSubject == 'unitbenchmark') {
				delete aFilters['WeekNumber'];
			}
			
			// IPP-4027 
			oSelf.xAxisMin = iLessonsPerWeek * iWeekFrom;
			oSelf.xAxisMax = iLessonsPerWeek * iWeekTo;
			oSelf.xAxisTickInterval = iLessonsPerWeek;
			// End IPP-4027 
			
			if (sSubject == 'unitbenchmark') {
				oSelf.xAxistitle = PERFORMANCE.c_s_LABEL_UNITS;
				oSelf.xAxisMin = (iUnitFrom == 1)? 0: iUnitFrom; // 1
				oSelf.xAxisMax = iUnitTo;
				oSelf.xAxisTickInterval = 1;
			}
			
			// Dynamic Y-Axis
			oSelf.yAxistitle = PERFORMANCE.c_s_LABEL_MARKS;
			oSelf.yAxisMin = 0;
			oSelf.yAxisMax = 100;
			oSelf.yAxisTickInterval = 10;
			
			// Y-Axis iteration should be different for Word Count
			if ([PERFORMANCE.c_s_LBL_WORD_COUNT, PERFORMANCE.c_s_LBL_WORD_COUNT_IR, PERFORMANCE.c_s_LBL_WORD_COUNT_RATA, PERFORMANCE.c_s_LBL_WORD_COUNT_TTR].indexOf(sSubject) != -1) {
				oSelf.yAxistitle = PERFORMANCE.c_s_LABEL_WORD_COUNT;
				oSelf.yAxisMin = 0;
				oSelf.yAxisMax = oSelf.model.performanceInfoData.goalWordCount[iUnitTo][iWeekTo];
				oSelf.yAxisTickInterval = 15000;
			}
			
			// Y-Axis iteration should be different for Reading Level
			if (sSubject == PERFORMANCE.c_s_LBL_READING_LEVEL) {
				oSelf.yAxistitle = PERFORMANCE.c_s_LBL_READING_LEVEL_YAXIS_TXT;
				oSelf.yAxisMin = 0;
				oSelf.yAxisMax = oSelf.model.performanceInfoData.gradeLexileConstant.yAxisMax;
				oSelf.yAxisTickInterval = 1;
			}
			// End: Dynamic Y-Axis
			
			// Y-Axis iteration should be different for Oral Fluency
			if ([PERFORMANCE.c_s_ORAL_FLUENCY, PERFORMANCE.c_s_WCPM].indexOf(sSubject) !== -1) {
				sSubject = PERFORMANCE.c_s_WCPM;
				oSelf.yAxistitle = oSelf.model.performanceInfoData.oralFluencyConstant[sSubject].yAxisTxtLebel;
				oSelf.yAxisMin = 0;
				oSelf.yAxisMax = oSelf.model.performanceInfoData.oralFluencyConstant[sSubject].yAxisMax;
				oSelf.yAxisTickInterval = 25;
			}
			// End: Dynamic Y-Axis
		};
		
		// method for filtering data
		this.getFilteredData = function () { // Method 4
			this.prepareFilters();
			this.prepareData();
			var aData = aMasterData;
			for (var sFilter in aFilters) {
				if (sFilter == 'WeekNumber') {
					var aUnitRange = aFilters['UnitNumber'],
						aWeekRange = [];
					
					// Filter by Week
					if (aUnitRange.length == 1) { // Same Unit
						aWeekRange = _.range(aFilters['WeekNumber'].first(), aFilters['WeekNumber'].last() + 1, 1);
						aData = oUtility.filterByRange(aData, aWeekRange, 'WeekNumber');
					}
					else {
						var aUnitRangeData = [];
						$.each(aUnitRange, function(iIdx, iUnitNumber) {
							// Start: getting unit wise week range
							var iStartWeek = (iIdx == 0) ? aFilters['WeekNumber'].first() : 1,
								iEndWeek = (iIdx == aUnitRange.length - 1) ? aFilters['WeekNumber'].last() : parseInt($GLOBALS.get('UnitWeekDetails').getWeeks4Unit(iUnitNumber));
							aWeekRange = _.range(iStartWeek, iEndWeek + 1, 1);
							// End: getting unit wise week range
							var aUnitSpecificAllData = _.where(aData, {'UnitNumber': iUnitNumber});
							var aUnitSpecificSelectedData = oUtility.filterByRange(aUnitSpecificAllData, aWeekRange, 'WeekNumber');
							
							aUnitRangeData = $.merge(aUnitRangeData, aUnitSpecificSelectedData);
						});
						aData = aUnitRangeData;
					}
					// End Filter by Week
				}
				else if (sFilter == 'ItemSubject') {
					var aFilterParams = [ 'ItemSubType', 'ItemSubject' ],
						aFilteredData = [],
						aFData = [],
						aTempFilter = [];
					for (var iSubIdx = 0; iSubIdx < aFilterParams.length; iSubIdx++) {
						aTempFilter = [];
						for(iTempIdx = 0; iTempIdx < aFilters[sFilter].length; iTempIdx++) {
							aTempFilter.push(aFilters[sFilter][iTempIdx].endsWith("count_ir") ? "iwt" : aFilters[sFilter][iTempIdx])
						}
						aFilteredData = $.merge(aFilteredData, oUtility.filterByRange(aData, aTempFilter, aFilterParams[iSubIdx]));
					}
					aData = aFilteredData;
				}
				else {
					aData = oUtility.filterByRange(aData, aFilters[sFilter], sFilter);
				}
			}
			return aData;
		};
		
		this.getFilter = function (sFilterOption) {
			this.prepareFilters();
			if (typeof aFilters[sFilterOption] != 'undefined') {
				return aFilters[sFilterOption];
			}
			return [];
		};
	})();
	
	oSelf.viewDecider();
};

/**
* @method: viewDecider 
* @uses: for deciding what to be shown
* @return void;
*/
PerformanceView.viewDecider = function () {
	var oSelf = this;
	
	switch (oSelf.viewMode) {
		case PERFORMANCE.c_s_MODE_SKILL_REPORT:
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_LINE_GRAPH + "']").removeClass('active');
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_DETAILED_VIEW + "']").addClass('inactive disabled_tab').removeClass('active');
			if (objSkillTaxonomyInformation == 0) {
				oSelf.performanceTabHandler.importSkillTaxonomyData(function () {
					oSelf.initSkillReport();
				});
			}
			else {
				oSelf.initSkillReport();
			}
		break;
		default:
			if (
				oSelf.prevViewMode != PERFORMANCE.c_s_MODE_SKILL_REPORT && 
				oSelf.prevViewMode != null 
			) {
				oSelf.renderRightPanel();
			}
			else {
				oSelf.populateLeftPanelData();
				oSelf.render();
			}
		break;
	}
};

/**
* @method: getLeftPanelData 
* @uses: for populating left panel
* @return void;
*/
PerformanceView.populateLeftPanelData = function (aGroups, sParent) {
	var oSelf = this;
	if (typeof aGroups == 'undefined') {
		aGroups = (
			(
				'groups' in oSelf.model.performanceInfoData &&
				typeof oSelf.model.performanceInfoData['groups'] != 'undefined' &&
				oSelf.model.performanceInfoData['groups'] instanceof Array
			)?
			oSelf.model.performanceInfoData['groups']:
			[]
		);
	}
	if (typeof sParent == 'undefined') {
		sParent = null;
	}
		
	for (var iIdx = 0; iIdx < aGroups.length; iIdx++) {
		oSelf.leftPanelData[aGroups[iIdx]['type']] = {
			title:	aGroups[iIdx]['title'],
			id:		aGroups[iIdx]['id'],
			parent:	sParent
		};
		if (
			typeof aGroups[iIdx].subgroup != 'undefined' &&
			aGroups[iIdx].subgroup instanceof Array
		) {
			oSelf.populateLeftPanelData(aGroups[iIdx].subgroup, aGroups[iIdx]['type']);
		}
	}
};

/**
* @method: render 
* @uses: for populating HTML
* @return void;
*/
PerformanceView.render = function () {
	var oSelf = this;
	oSelf.renderLeftPanel();
	oSelf.bindEvents();
};

/**
* @method: renderLeftPanel 
* @uses: generates html for left panel
* @return void;
*/
PerformanceView.renderLeftPanel = function () {
	var oSelf = this;
	$("#" + PERFORMANCE.c_s_CONTAINER_LEFT_PANEL).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_LEFT_PANEL).html(), {
				'studentData': oSelf.model.studentListData
			}
		)
	);
	
	$("#" + PERFORMANCE.c_s_CONTAINER_MAIN_DROPDOWN).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_LINE_GRAPH_TYPE_DROPDOWN).html(), {
				'performanceData': oSelf.model.performanceInfoData
			}
		)
	);
	oSelf.resize();
	oSelf.bindEvents4LeftPanel();
};

/**
* @method: renderRightPanel 
* @uses: generates html for right panel based on view mode
* @return void;
*/
PerformanceView.renderRightPanel = function () {
	var oSelf = this;
	
	switch (oSelf.viewMode) {
		case PERFORMANCE.c_s_MODE_PIE_CHART:
			break;
		case PERFORMANCE.c_s_MODE_DETAILED_VIEW:
			oSelf.renderDetailView();
			oSelf.renderSlider();
			break;
		default:			
			oSelf.renderLineGraph();
			oSelf.renderSlider();
			break;
	}
};

/**
* @method: renderSlider 
* @uses: generates html for Bottom Slider
* @return void;
*/
PerformanceView.renderSlider = function () {	
	var oSelf = this;

	// for warning tab: no need to show the slider
	if(oSelf.subMode == PERFORMANCE.c_s_WARNING_MODE) {
		return false;
	}
	
	var iMaxUnit = $GLOBALS.get('UnitWeekDetails').getMaxUnit(),
		iTotalWeeks = $GLOBALS.get('UnitWeekDetails').getTotalWeeks(),
		dAvailableWidth = 700,
		dWidthPerWeek = Math.floor(dAvailableWidth / iTotalWeeks),
		oWeeksPerUnit = $GLOBALS.get('UnitWeekDetails').getWeeksPerUnit();
	
	$("#" + PERFORMANCE.c_s_CONTAINER_SLIDER).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_SLIDER).html(),
			{
				'unitData':		oSelf.model.unitDetails,
				'constUnit':	iMaxUnit,
				'width':		dWidthPerWeek,
				'weeksPerUnit':	oWeeksPerUnit
			}
		)
	);
	
	// Place Unit Numbers Properly
	$('div[id^="unitId_"] > span').each(function () {
		var dWidth = $(this).width(),
			dParentsWidth = $(this).parent().width(),
			dLeft = ((dParentsWidth - dWidth) / 2);
		
		$(this).css('left', dLeft + 'px');
	});
	// End: Place Unit Numbers Properly
	
	$("#" + PERFORMANCE.c_s_CONTAINER_SLIDER).show();
	oSelf.bindEvents4Slider();
	oSelf.effectOnSliderChange();
};

/**
* @method: renderLineGraph 
* @uses: generates html for Line Graph
* @return void;
*/
PerformanceView.renderLineGraph = function () {
	var oSelf = this;
	if (oSelf.subMode != null) {
		// warning
		oSelf.renderWarning();		
	}
	else {
		$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).empty().html(
			_.template(
				$("#" + PERFORMANCE.c_s_TEMPLATE_RIGHT_PANEL_HEADER).html(),
				{
					'benchmarkIndex':oSelf.idxBenchmark,
					'data': oSelf.model
				}
			)
		);
		
		$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).removeClass("performanceDetailView");
		
		$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).empty().html(
			_.template(
				$("#" + PERFORMANCE.c_s_TEMPLATE_LINE_GRAPH).html(),
				{
					'benchmarkIndex':oSelf.idxBenchmark,
					'data': oSelf.model
				}
			)
		);
		oSelf.bindEvents4RightPanel();			
	}
};

/**
* @method: bindEvents 
* @uses: bind events for common element
* @return void;
*/
PerformanceView.bindEvents = function () {
	var oSelf = this;
	// binding click events for top buttons
	$("." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).off("click").on("click", function () {
		var sGraphType = jQuery('.menuclass li.active:last > a').data('pgraph-type');
		if (
			oSelf.viewMode === PERFORMANCE.c_s_MODE_SKILL_REPORT && 
			$(this).data("view-mode") === PERFORMANCE.c_s_MODE_DETAILED_VIEW
		){
			return false;
		}
		
		if (
			oSelf.subMode === PERFORMANCE.c_s_WARNING_MODE || 
			(
				(
					sGraphType === PERFORMANCE.c_s_LBL_WORD_COUNT || 
					sGraphType === PERFORMANCE.c_s_LBL_WORD_COUNT_IR || 
					sGraphType === PERFORMANCE.c_s_LBL_WORD_COUNT_RATA || 
					sGraphType === PERFORMANCE.c_s_LBL_WORD_COUNT_TTR || 
					sGraphType === PERFORMANCE.c_s_LBL_READING_LEVEL || 
					sGraphType === PERFORMANCE.c_s_ORAL_FLUENCY || 
					sGraphType === PERFORMANCE.c_s_WCPM
					
				) && 
				$(this).data("view-mode") === PERFORMANCE.c_s_MODE_DETAILED_VIEW
			)
		) {
			return false;
		}
		
		oUtility.showLoader({
			opacity:			0.4,
			'click-to-hide': 	false,
			'message':    		'<img src="media/loader.gif" />',
			'foreground-color':	'none',
			'box-style':		{
				'height':			'80px',
				'width':			'80px'
			}
		});
		
		$('.' + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).removeClass("disabled_tab");
		
		oSelf.prevViewMode = oSelf.viewMode;
		oSelf.viewMode = $(this).data("view-mode");
		
		// Start: Unit filter selected in Assignment & Detailed view should be retained when user navigates between them. Slider filter should be reset to default whenever user clicks the Skill tab. 
		if(
			(
				oSelf.prevViewMode == PERFORMANCE.c_s_MODE_SKILL_REPORT && 
				oSelf.viewMode != PERFORMANCE.c_s_MODE_SKILL_REPORT
			) || 
			(
				oSelf.prevViewMode != PERFORMANCE.c_s_MODE_SKILL_REPORT && 
				oSelf.viewMode == PERFORMANCE.c_s_MODE_SKILL_REPORT
			)
		) {
			oSelf.slider_min_val = null;
			oSelf.slider_max_val = null;
		}
		// End: Unit filter selected in Assignment & Detailed view should be retained when user navigates between them. Slider filter should be reset to default whenever user clicks the Skill tab. 
		
		$("." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).removeClass("active");
		$(this).addClass("active");
		oSelf.viewDecider();
	});
	
	// binding click events for performance tab description button 
	$("#" + PERFORMANCE.c_s_BTN_TAB_DESC).off("click").on("click", function (e) {
		e.stopPropagation();
		
		if($("#skillInfoBubble").length) {
			$("#skillInfoBubble").remove();
		}
		
		
		if ($("#" + PERFORMANCE.c_s_PERFORMANCE_INFO_BUBBLE).length) {
			$("#" + PERFORMANCE.c_s_PERFORMANCE_INFO_BUBBLE).remove();
		}
		else {
			var html = _.template($("#" + PERFORMANCE.c_s_TEMPLATE_PERFORMANCE_INFO_BUBBLE).html(),{
				'infoTxt': oSelf.model.performanceInfoData.infotext
			});
			
			$('body').append(html);
			
			var top = $(this).offset().top + 10;
			
			$(".lesson_toolls").find(".page_arrow").css({'right':7+'px'});
			$("#" + PERFORMANCE.c_s_PERFORMANCE_INFO_BUBBLE).css({
			   'position' : 'absolute',
			   'right' : 272 + "px",
			   'opacity': 1,
			   'top' : top + "px"
			});
		}
	});
	
	// binding click events on refresh button to fetch the updated data
	$("#" + PERFORMANCE.c_s_BTN_TAB_REFRESH).off("click").on("click", function () {
		
		if (oSelf.subMode == PERFORMANCE.c_s_WARNING_MODE) {
			return false;
		}
		
		objGradeBookV2JsonData = 0;
		objGradeBookJsonData = 0;
		objLibraryProgressDetailForClass = 0;
		objSkillBasedReportDataByWeekRange = 0;
		objGetClassUserLevel = 0;
				
		oSelf.performanceTabHandler.importGradebookForInstructorV2(function () {
			oSelf.effectOnSliderChange();
		});
	});
};

/**
* @method: bindEvents4LeftPanel 
* @uses: bind events for left panel element
* @return void;
*/
PerformanceView.bindEvents4LeftPanel = function () {
	var oSelf = this;
	
	// bind click event for showing the student drop-down list
	$("#" + PERFORMANCE.c_s_BTN_DISP_STUD_LIST).off("click").on("click", function (e) { 
		//e.stopPropagation();
		if (oSelf.subMode == PERFORMANCE.c_s_WARNING_MODE) {
			return false;
		}
		
		// for showing selection based on previous filter
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find("li").removeClass("active");
		for (var sId in oSelf.selectedStudents){
			$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find("li[data-student-id='" + sId + "']").addClass("active");
		}
		
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).show("blind", "down", 500);
	});
		
	// bind events for cancel button
	$("#" + PERFORMANCE.c_s_ID_BTN_CANCEL).off("click").on("click", function () {
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).hide("blind", "up", 500);
	});
	
	// bind events for filter button
	$("#" + PERFORMANCE.c_s_ID_BTN_FILTER).off("click").on("click", function () {
		if($("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li.active').length > 0){
			oSelf.effectOnSliderChange();
			$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).hide("blind", "up", 500);
		}
		else{
			PerformanceView._alert({
				divId:		'dialog-message',
				message:	PERFORMANCE.c_s_NO_STUDENT_SELECT_TXT
			});
			return false;
		}
	});
	
	// bind events for Select All lnik
	$("#" + PERFORMANCE.c_s_ID_LINK_SELECT_ALL).off("click").on("click", function () {
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li').addClass("active");
	});
	
	// bind events for De-select All lnik
	$("#" + PERFORMANCE.c_s_ID_LINK_DESELECT_ALL).off("click").on("click", function () {
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li').removeClass("active");
	});
	
	
	// bind click event for "All Students" option
	/* $("#" + PERFORMANCE.c_s_BTN_ALL_STUD).off("click").on("click", function () {
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li').addClass("active");
	}); */
	
	// bind click event for each student record
	$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li').off("click").on("click", function () {
		if (oSelf.subMode == PERFORMANCE.c_s_WARNING_MODE) {
			return false;
		}
		($(this).hasClass('active')) ? $(this).removeClass('active') : $(this).addClass('active');
	});

	// bind click event for performance group data
	$('.menuclass li ul').slideUp();
	$('.menuclass li a').off("click").on("click", function () {
		oSelf.subMode = null;
		oSelf.idxBenchmark = $(this).data("benchmark");
		
		$('#' + PERFORMANCE.c_s_WARNING_TAB).removeClass("active");
		$('.' + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).parent().removeClass("inactive");
		$("#" + PERFORMANCE.c_s_BTN_TAB_REFRESH).removeClass("inactive");
				
		if ($(this).parents('.parentclass').size() == 0) {
			$('ul ul').slideUp(400);
			$('.menuclass li').removeClass("active");
		}
		if ($(this).siblings('ul').is(":visible")) {
			$('.menuclass li ul li').removeClass("active");
		}
		else {
			$(this).parent().siblings().removeClass("active");
			$(this).parent().siblings().children().removeClass("active");
			$(this).parent().siblings().children().next("ul").slideUp();
		}
		
		$(this).siblings('ul').slideDown(400);
		$(this).parent().addClass("active");
		
		var sGraphType = $(this).data('pgraph-type');
		
		// Start: detailed view will not allowed for word count & reading level
		if (
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_IR || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_RATA || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_TTR || 
			sGraphType == PERFORMANCE.c_s_LBL_READING_LEVEL || 
			sGraphType == PERFORMANCE.c_s_ORAL_FLUENCY || 
			sGraphType == PERFORMANCE.c_s_WCPM
		){
			
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_LINE_GRAPH + "']").addClass('active');
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_DETAILED_VIEW + "']").addClass('inactive disabled_tab').removeClass('active');
			
			oSelf.viewMode = PERFORMANCE.c_s_MODE_LINE_GRAPH;
		}else{
			$('.' + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).removeClass("disabled_tab");
		}
		// End: detailed view will not allowed for word count
		
		oSelf.renderRightPanel();
	});
	
	//	Warning Clicked
	$('#' + PERFORMANCE.c_s_WARNING_TAB).off("click").on("click", function () {		
		$('.menuclass li ul').slideUp();
		$('.menuclass li').removeClass("active");
		$(this).addClass("active");
		$('.' + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).parent().addClass("inactive");
		$("#" + PERFORMANCE.c_s_BTN_TAB_REFRESH).addClass("inactive");
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).hide();
		
		oSelf.subMode = PERFORMANCE.c_s_WARNING_MODE;
		oSelf.renderLineGraph();
	});
	
	setTimeout(function () {
		// Start - Code for Warning Counter
		var objWarning = oSelf.prepareStudentWarningModel(oSelf);
		var iNumWarning = Object.keys(objWarning).length;
		$(".warnings_student").html(iNumWarning);
		// End - Code for Warning Counter
		
		$("#" + PERFORMANCE.c_s_ID_LINK_SELECT_ALL).click();
		
		// Show Graph with Default Options
		oSelf.idxBenchmark = $('.menuclass li a').eq(oSelf.defaultGraphTypeId).data("benchmark");
		
		$('.menuclass li a').eq(oSelf.defaultGraphTypeId).siblings('ul').slideDown(400);
		$('.menuclass li a').eq(oSelf.defaultGraphTypeId).parent().siblings().removeClass("active");
		$('.menuclass li a').eq(oSelf.defaultGraphTypeId).parent().siblings().children().removeClass("active");
		$('.menuclass li a').eq(oSelf.defaultGraphTypeId).parent().addClass("active");
		
		
		
		var sGraphType = jQuery('.menuclass li.active:last > a').data('pgraph-type');
		if (	
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_IR || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_RATA || 
			sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_TTR || 
			sGraphType == PERFORMANCE.c_s_LBL_READING_LEVEL
		) {
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_LINE_GRAPH + "']").addClass('active');
			$("button." + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS + "[data-view-mode='" + PERFORMANCE.c_s_MODE_DETAILED_VIEW + "']").addClass('inactive disabled_tab').removeClass('active');
		}
		
		oSelf.renderRightPanel();
		// End Show Graph with Default Options
		
	}, 1000);
	
};

/**
* @method: bindEvents4RightPanel 
* @uses: bind events for right panel element
* @return void;
*/
PerformanceView.bindEvents4RightPanel = function () {
	var oSelf = this;
	
	// Right Panel Benchmark binding event
	$("." + PERFORMANCE.c_s_CONTAINER_BENCHMARK).off("click").on("click", function () {
		var obj = $(this);
		setTimeout(function(){
			var leftPos = obj.position().left - 15;
			var topPos = obj.position().top - 2;
			$(".tabs_arrow").show();
			$(".tabs_arrow").css({'left':leftPos});
			$(".tabs_arrow").animate({"top": topPos + "px"}, 300);
		}, 500);
	});
	
	// Right Panel Benchmark Suggestion binding event
	$("." + PERFORMANCE.c_s_CONTAINER_BENCHMARK).find(".suggestion").off("click").on("click", function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(this).next(".suggestion_content").hide("blind", "up", 500);
		}
		else {
			$(this).addClass("active");
			$(this).next(".suggestion_content").show("blind", "down", 500);
		}
		var obj = $(this).parent().closest("." + PERFORMANCE.c_s_CONTAINER_BENCHMARK);
		setTimeout(function(){
			var leftPos = obj.position().left - 15;
			var topPos = obj.position().top - 2;
			$(".tabs_arrow").show();
			$(".tabs_arrow").css({'left':leftPos});
			$(".tabs_arrow").animate({"top": topPos + "px"}, 300);
		}, 500);
	});
		
	// bind slide up down for detail view
	$('.mainmenuclass :not(li.viewdetails) ul').slideUp();
	$('.mainmenuclass li').not('.viewdetails').off('click').on("click", function (oEvent) {
		$(this).children().filter('ul').slideToggle(400);
		$(this).find('.actionshowview_inner').first().toggleClass('active');
		oEvent.stopPropagation();
	}); 
	
	// bind student details view 
    $(".viewdetails").off('click').on('click', function (oEvent) {
		var itemId      		= $(this).attr('data-itemid');
		var itemAttemptId      	= $(this).attr('data-itemattemptid');
		var itemName    		= $(this).attr('data-itemname');
		var itemType    		= $(this).attr('data-itemtype');
		var itemSubType 		= $(this).attr('data-itemsubtype');
		var itemAttemptSummary  = $(this).attr('data-itemattemptsummary');
		var studentId   		= $(this).attr('data-studentid');
		var sSubTypeMode        = '';
		if(itemSubType    == 'studyplan') {
			sSubTypeMode = ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE;
			var arrItemAttemptSummary = decodeURIComponent(itemAttemptSummary).trim('"').split("/");
			if (arrItemAttemptSummary.length > 1){
				sSubTypeMode         =   ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE;
			}
		}
		
		var sURL = 'assignment.html?'
			+ POPUP_VIEW.c_s_QUERY_PARAM_MODE + '=' + POPUP_VIEW.c_s_MODE_INSTRUCTOR + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_ID + '=' + itemId + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ITEM_ATTEMPT_ID + '=' + itemAttemptId + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_HEADER_TITLE + '=' + escape(itemName) + '&' 
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS + '=' + ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS + '&' 
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_TYPE + '=' + itemType + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_SUB_TYPE + '=' + itemSubType +
			(
				(sSubTypeMode.length > 0)?
				'&' + POPUP_VIEW.c_s_QUERY_PARAM_STUDYPLAN_SUB_TYPE + '=' + sSubTypeMode:
				''
			) + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_VIEW + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID + '=' + studentId;
			
		//sURL = 'assignment.html'; // Ad-hoc step
		
		// Start: Solved Issue IPP-3328
		$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).hide("blind", "up", 500);
		// End: Solved Issue IPP-3328
		
		if ( objPlatform.isDevice()) {
			ShowWebView(sURL);
		}
		else {
			$('#' + PERFORMANCE.c_s_NOTEBOOK_VIEW_ASSIGNMENT_AREA).find('iframe').attr('src', sURL).load(function() {
				$('#' + PERFORMANCE.c_s_NOTEBOOK_VIEW_ASSIGNMENT_AREA).show();
				// back to Performance
				$(this).contents().find("#assignmentPrev").off('click').on("click tap", function(){ 
					$('#' + PERFORMANCE.c_s_NOTEBOOK_VIEW_ASSIGNMENT_AREA).find('iframe').attr('src','');
					setTimeout( function() {
						$('#' + PERFORMANCE.c_s_NOTEBOOK_VIEW_ASSIGNMENT_AREA).hide();
						$("#" + PERFORMANCE.c_s_NOTEBOOK_VIEW_ASSIGNMENT_AREA).css({'width': '', 'height': '', 'overflow' : ''});
					}, 100);
				});
			});
		}
		oEvent.stopPropagation();
	});
};

/**
* @method: bindEvents4Slider 
* @uses: bind events for bottom Slider
* @return void;
*/
PerformanceView.bindEvents4Slider = function () {
	var oSelf = this,
		slider_point_values = [];
	
	/*==== IPP-4027 ====*/
	/* $('.' + PERFORMANCE.c_s_UNIT_SCALE_CLASS).each(function () {
		slider_point_values.push( $(this).data('numValue') );
		$(this).find('.stick').each(function () {
			slider_point_values.push( $(this).data('numValue') );
		});
	}); */
	/*== End IPP-4027 ==*/
	
	// var total = slider_point_values.length, // IPP-4027
	var sGraphType = (
			($('.menuclass li.active').length > 0)?
			$('.menuclass li.active:last > a').data('pgraph-type'):
			$('.menuclass li a').eq(oSelf.defaultGraphTypeId).data('pgraph-type')
		),
		total = $GLOBALS.get('UnitWeekDetails').getTotalWeeks(),
		min_val = null,
		max_val = null,
		total_units = oSelf.model.unitDetails.totalUnits;
		//total_units = 1;
		
	var notallowed = {1: true, 7: true, 13: true, 19: true, 25: true, 31: true};
	notallowed = {}; // IPP-4027
	
	var iTempLimitUnit = parseInt(oSelf.model.performanceInfoData.gradeLexileConstant.xAxisMax),
		iTempLimitWeek = parseInt($GLOBALS.get('UnitWeekDetails').getWeeks4Unit(iTempLimitUnit)),
		iTempLimitSlider = $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iTempLimitUnit, iTempLimitWeek);
	
	if (oSelf.slider_min_val == null) {
		min_val = 2;
		min_val = 1; // IPP-4027
		
		var curUnitNumber = oSelf.model.unitDetails.curUnitNumber, 
			curWeekNumber = oSelf.model.unitDetails.curWeekNumber;
							
		max_val = 1 + ((parseInt(curUnitNumber) - 1) * 5) + ((parseInt(curUnitNumber)-1)*1) + parseInt(curWeekNumber);
		if (
			(curUnitNumber == 1) && 
			(curWeekNumber == 1)
		){
			max_val = 3;
			max_val = 2; // IPP-4027
		}
    }
	else {
		min_val = oSelf.slider_min_val;
		max_val = oSelf.slider_max_val;
	}
	
	// following if block only for reading level
	if (
		sGraphType == PERFORMANCE.c_s_LBL_READING_LEVEL && 
		oSelf.slider_min_val != undefined && 
		oSelf.slider_max_val != undefined  
	) {
		min_val = (oSelf.slider_min_val >= iTempLimitSlider) ? 1 : oSelf.slider_min_val;
		max_val = (oSelf.slider_max_val >= iTempLimitSlider) ? iTempLimitSlider : oSelf.slider_max_val;
	}
	
	$("#" + PERFORMANCE.c_s_SLIDER).slider({
		range: true,
		min: 1,
		max: total,
		values: [ min_val, max_val ],
		slide: function( event, ui ) {
			
			if (notallowed[ui.value]) {
				$("#" + PERFORMANCE.c_s_SLIDER).slider("values")[1] = ui.value;
				return false;
			}
			if (ui.values[0] == ui.values[1]) {
				return false;
			}
			if (ui.value > (total_units * 6)) {
				return false;
			}
			
			if (sGraphType == PERFORMANCE.c_s_LBL_READING_LEVEL) {
				// following for strict to predefined unit when option is "Reading Level"
				
				if(ui.value > iTempLimitSlider) {
					return false;
				}
			}
		},
		stop: function(event, ui) {
			oSelf.effectOnSliderChange();
		},
		create : function(event,ui) {
			$('#slider-range.ui-slider-horizontal .ui-slider-handle').css({'margin-left': '0'});
		}
	});
	
	var handle = $("#" + PERFORMANCE.c_s_SLIDER +' .ui-slider-handle');
    handle.eq(1).addClass('last-handle');       
	
};

/**
* @method: resize 
* @uses: resizing the document
* @return void;
*/
PerformanceView.resize = function () {
	var oSelf = this,
		window_height = $(window).height();
	
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
		// for IOS7 only
		$('html').addClass('ipad ios7');
		window_height = $("body").height();
	}
	
	var header_height = $("header").height(),
		performance_wrap_height = window_height - header_height;
		
	$('.performance_wrap').css({ 'height':	performance_wrap_height + 'px' });
	$('.perf_wrap_content').css({ 'height':	performance_wrap_height + 'px' });
	
	// Start: Left Panel Height Calculation
	var performance_left_wrap_height = (
			performance_wrap_height - (
				parseInt($(".performance_left_wrap").css("padding-bottom")) +
				parseInt($(".performance_left_wrap").css("border-top-width"))
			)
		);
	$(".performance_left_wrap").css({"height":performance_left_wrap_height+"px"});
	
	var list_wrap_title_height = (
			$(".list_wrap_title").height() +
			parseInt($(".list_wrap_title").css("padding-top")) +
			parseInt($(".list_wrap_title").css("padding-bottom"))
		),
		warningTab_height = (
			$('#' + PERFORMANCE.c_s_WARNING_TAB).height() +
			parseInt($('#' + PERFORMANCE.c_s_WARNING_TAB).css("padding-top")) +
			parseInt($('#' + PERFORMANCE.c_s_WARNING_TAB).css("padding-bottom"))
		),
		list_navigation_height = performance_left_wrap_height - (list_wrap_title_height + warningTab_height),
		containerStudentList_height = performance_left_wrap_height - list_wrap_title_height;
	
	// Main Left Panel Menu Height
	$(".list_navigation").css({"height":list_navigation_height+"px"});
	// Left Panel Student List Height
	$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).css({"overflow":"auto","max-height":containerStudentList_height});
	
	// End: Left Panel Height Calculation
	
	// Start: Right Panel Height Calculation
	var perf_wrap_content_inner_height = performance_wrap_height - parseInt($(".perf_wrap_content_inner").css("padding-bottom"));
	$(".perf_wrap_content_inner").css({"height":perf_wrap_content_inner_height+"px"});
	
	var containerRightPanelHeader_height = $("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).height() + parseInt($("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).css("margin-bottom")) + parseInt($("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).css("margin-top")); 
	
	var performance_content_area_height = perf_wrap_content_inner_height - containerRightPanelHeader_height;
	$(".performance_content_area").css({"height":performance_content_area_height+"px"});
	
	var slider_height = 0;
	if ($("#" + PERFORMANCE.c_s_CONTAINER_SLIDER).css("display") == "block") {
		slider_height = $("#" + PERFORMANCE.c_s_CONTAINER_SLIDER).height() + parseInt($("#" + PERFORMANCE.c_s_CONTAINER_SLIDER).css("border-top-width"));
	}
	
	var containerRightPanelInner_height =  performance_content_area_height - slider_height;
	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).css({"height":containerRightPanelInner_height+"px"});
	

	if (PerformanceView.viewMode == PERFORMANCE.c_s_MODE_LINE_GRAPH && PerformanceView.subMode == null) {
		$(".chart_tabs").css({"height":containerRightPanelInner_height+"px"});
		$("#" + PERFORMANCE.c_s_CONTAINER_CHART).css({"height":containerRightPanelInner_height+"px"});
		$(".chart_tabs_listing").css({"height":containerRightPanelInner_height+"px"});
		
		var performance_note_content_height = 0;
		if($(".performance_note_content").is(":visible")) {
			performance_note_content_height = parseInt($(".performance_note_content").css("max-height")) + parseInt($(".performance_note_content").css("padding-top")) + parseInt($(".performance_note_content").css("padding-bottom")) + 5;
		}
		var chart_tabs_listing_inner_padding = parseInt($(".chart_tabs_listing_inner").css("padding-top")),
			chart_tabs_listing_inner_height = containerRightPanelInner_height - (performance_note_content_height + chart_tabs_listing_inner_padding);
		$(".chart_tabs_listing_inner").css({"height": chart_tabs_listing_inner_height,"overflow":"auto"});
	}
	else if(PerformanceView.viewMode == PERFORMANCE.c_s_MODE_LINE_GRAPH && PerformanceView.subMode != null){
		$(".assignments_container").css({"height":containerRightPanelInner_height,"overflow":"auto"});
	}
	else if(PerformanceView.viewMode == PERFORMANCE.c_s_MODE_DETAILED_VIEW){
		$(".assignments_container").css({"height":containerRightPanelInner_height,"overflow":"auto"});
	}
	else if(PerformanceView.viewMode == PERFORMANCE.c_s_MODE_SKILL_REPORT) {
		
		$('.skill-wrapper').css({"height":containerRightPanelInner_height+"px"});
		
		var skillHeadingHight = $(".skill-heading").height()+ parseInt($(".skill-heading").css("padding-top")) + parseInt($(".skill-heading").css("padding-bottom")) + 1,
			skillBodyHeight   = containerRightPanelInner_height - skillHeadingHight;
		

		var skillUnitHeaderHeight = $(".skill-unit").height()+ parseInt($(".skill-unit").css("padding-top")) + parseInt($(".skill-unit").css("padding-bottom")) + 15,
			skillContainHeight = skillBodyHeight - skillUnitHeaderHeight;
		$(".skill-content").css({"height":skillContainHeight});
		
		// Start: resize skill boxes based on sub skill content length 
		var subSkillMaxHeight = -1,
			elemLength = $("div.sub-skill-title").length;
		for(var i=0; i < elemLength; i++){
			var tempElemObj = $("div.sub-skill-title").eq(i);
			if(typeof tempElemObj != "undefined"){
				subSkillMaxHeight = (subSkillMaxHeight > tempElemObj.height()) ? subSkillMaxHeight : tempElemObj.height();
			}
		}
		
		$('div.sub-skill-title').css({"height":subSkillMaxHeight+"px"});
		$("div.skill-box").css({"height":subSkillMaxHeight+"px"});
		// End: resize skill boxes based on sub skill content length 
	}
	
	// End: Right Panel Height Calculation
};

/**
* @method: plotGraph 
* @uses: for plotting the Line Graph using highcharts
* @return void;
*/
PerformanceView.plotGraph = function() {
	var oSelf = this,
		sGraphType = (
			($('.menuclass li.active').length > 0)?
			$('.menuclass li.active:last > a').data('pgraph-type'):
			$('.menuclass li a').eq(oSelf.defaultGraphTypeId).data('pgraph-type')
		),
		aDataset = oSelf.lineGraphAndDetailViewHandler.getFilteredData(),
		aGraphPlottingSeries = [],
		sGraphHeaderTitle = oSelf.leftPanelData[sGraphType].title,
		aCategories = [];
	
	oSelf.resize();
	
	// Class for controlling the benchMark 
	oSelf.manageBenchMark = new (function () {
		// filter method : used for filter benchmark title, content, & line colour 
		this.filter = function () {
			var tempArr = oSelf.idxBenchmark.toString().split("_"),
				benchMark = "",
				dataNotes = [],
				minValue = "",
				headerTitle = "",
				objReturn = {};
				
			switch(tempArr.length) {
				case 3:
					var idx1 = tempArr[0], 
						idx2 = tempArr[1], 
						idx3 = tempArr[2],
						dataNotes = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].Notes.LineGraph,
						// minValue: used this to show the minimum benchmark line in graph
						minValue = Object.keys(oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark)[0];
						benchMark = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark;
						headerTitle = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].title;
					break;
				case 2:
					var idx1 = tempArr[0], 
						idx2 = tempArr[1],
						dataNotes = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].Notes.LineGraph,
						// minValue: used this to show the minimum benchmark line in graph
						minValue = Object.keys(oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].benchmark)[0];
						benchMark = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].benchmark;
						headerTitle = oSelf.model.performanceInfoData.groups[idx1].subgroup[idx2].title;
					break;
				case 1:
					var idx1 = tempArr[0],
						dataNotes = oSelf.model.performanceInfoData.groups[idx1].Notes.LineGraph,
						// minValue: used this to show the minimum benchmark line in graph
						minValue = Object.keys(oSelf.model.performanceInfoData.groups[idx1].benchmark)[0];
						benchMark = oSelf.model.performanceInfoData.groups[idx1].benchmark;
						headerTitle = oSelf.model.performanceInfoData.groups[idx1].title;
					break;
				default:
			}
			objReturn = {"dataNotes":dataNotes,"minValue":minValue,"benchMark":benchMark,"headerTitle":headerTitle};
			return objReturn;
		};
		
		// method used for getting the marker colours based on benchMark
		this.markerColor = function (marks) {
			var bMarkdata = this.filter (),
				colorCode = "";
			$.each(bMarkdata.benchMark, function (id, val) {
				var maxMinValue = id.split("-");
				
				if(parseFloat(maxMinValue[0]) > parseFloat(marks) && typeof maxMinValue[1] == "undefined"){
					colorCode = val.colorCode;
				}
				else {
					if (parseFloat(marks) >= parseFloat(maxMinValue[0]) && parseFloat(marks) <= parseFloat(maxMinValue[1])){
						colorCode = val.colorCode;
					}
				}
			});
			return colorCode;
		};
		
		// method used for getting the marker colours based on benchMark
		this.calculateGLE = function (score) {
			var bMarkdata = oSelf.model.performanceInfoData.lexileGLEData,
				iScoreGLE = "";
			$.each(bMarkdata, function (id, val) {
				var maxMinValue = id.split("-");
				
				if(parseFloat(maxMinValue[0]) <= parseFloat(score) && typeof maxMinValue[1] == "undefined"){
					iScoreGLE = val.GLE;
				}
				else {
					if (parseFloat(score) >= parseFloat(maxMinValue[0]) && parseFloat(score) <= parseFloat(maxMinValue[1])){
						iScoreGLE = val.GLE;
					}
				}
			});
			return iScoreGLE;
		};
		
		this.round = function (value, exp) {
			if (typeof exp === 'undefined' || +exp === 0) {
				return Math.round(value);
			}
			value = +value;
			exp  = +exp;

			if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
				return NaN;
			}
			// Shift
			value = value.toString().split('e');
			value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

			// Shift back
			value = value.toString().split('e');
			return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
		};
		
	})();
	
	// method for verifying rubric scored
	oSelf.verifyRubric = new (function () {
		
		// Following code block for rubric scoring of Reading Comprehension, IR, IWTHighlight, IWTDnD, Read Critically
		this.iwtScore = function (sGraphType, aDataset) {
			for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
				if (aDataset[iIdx].ItemSubType == PERFORMANCE.c_s_LBL_IWT) {
					var nFinalScore = 0,
						nMaxScore = 0;
					//console.log(aDataset[iIdx]);
					var objItemAttemptSummary = (aDataset[iIdx].ItemAttemptSummary.length > 0) ? JSON.parse(decodeURIComponent(aDataset[iIdx].ItemAttemptSummary.replace(/(\\r|\\n|\s*)/g, ''))) : '';
					
					var objInstructorScoreRubric = ($.trim(aDataset[iIdx].InstructorScoreRubric).length > 0) ? JSON.parse(decodeURIComponent(aDataset[iIdx].InstructorScoreRubric.replace(/(\\r|\\n|\s*)/g, ''))) : '';
					if(
						typeof objItemAttemptSummary == 'object' || 
						objItemAttemptSummary != null 
					) {
						switch (sGraphType) {
							case PERFORMANCE.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE:
								if(typeof objItemAttemptSummary.scoresummary != 'undefined'){
									var oScoresummary = JSON.parse(objItemAttemptSummary.scoresummary);
									if(typeof oScoresummary.percentile != 'undefined') {
										if(typeof oScoresummary.percentile['reading-checkpoint'] != 'undefined'){
											nFinalScore = parseFloat(oScoresummary.percentile['reading-checkpoint']);
										}
									}
								}
								else if(typeof objItemAttemptSummary.percentile != 'undefined'){
									//alert(objItemAttemptSummary.percentile['reading-checkpoint']);
									// For reading checkpoint [i.e. highlight & dnd slides] slides
									if(typeof objItemAttemptSummary.percentile['reading-checkpoint'] != 'undefined'){
										nFinalScore = parseFloat(objItemAttemptSummary.percentile['reading-checkpoint']);
									}
								} 
								// following ELSE block for initial version
								else {
									if(objItemAttemptSummary.iwthighlightslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwthighlightslide) {
											 if (objItemAttemptSummary.iwthighlightslide.hasOwnProperty(sSlide)) {
												nFinalScore += parseFloat(objItemAttemptSummary.iwthighlightslide[sSlide]);
												sCount++;
											}
										}
										nMaxScore += sCount * PERFORMANCE.c_s_READING_CHECKPOINT_MAX_SCORE;
									}
									if(objItemAttemptSummary.iwtdndslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwtdndslide) {
											if (objItemAttemptSummary.iwtdndslide.hasOwnProperty(sSlide)) {
												nFinalScore += parseFloat(objItemAttemptSummary.iwtdndslide[sSlide]);
												sCount++;
											}
										}
										nMaxScore += sCount * PERFORMANCE.c_s_READING_CHECKPOINT_MAX_SCORE;
									} 
									nFinalScore = Math.round((nFinalScore/nMaxScore)*100);
								}
															
								aDataset[iIdx].FinalScore = nFinalScore;
								aDataset[iIdx].ItemMaxScore = PERFORMANCE.c_s_READING_CHECKPOINT_MAX_PERCENT;
								break;
							
							case PERFORMANCE.c_s_LBL_IWT_SUMMARY_SLIDE:
								// following IF block for latest version
								if(typeof objItemAttemptSummary.scoresummary != 'undefined'){
									var oScoresummary = JSON.parse(objItemAttemptSummary.scoresummary);
									if(typeof oScoresummary.percentile != 'undefined') {
										if(typeof oScoresummary.percentile['summary'] != 'undefined'){
											nFinalScore = parseFloat(oScoresummary.percentile['summary']);
										}
										nMaxScore = PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
									}
								}
								// following IF block for previous version
								else if(typeof objItemAttemptSummary.percentile != 'undefined'){
									// For summary feedback slide
									if(typeof objItemAttemptSummary.percentile['summary'] != 'undefined'){
										nFinalScore = parseFloat(objItemAttemptSummary.percentile['summary']);
									}
									nMaxScore = PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
								} 
								// following ELSE block for initial version
								else {
									if(typeof objItemAttemptSummary.iwtsummaryslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwtsummaryslide) {
											if (objItemAttemptSummary.iwtsummaryslide.hasOwnProperty(sSlide)) {
												nFinalScore += this.point4Scale(objItemAttemptSummary.iwtsummaryslide[sSlide]);
												sCount++;
											}
										}
										nMaxScore += sCount*PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
									}
								}
								
								aDataset[iIdx].FinalScore = nFinalScore;
								aDataset[iIdx].ItemMaxScore = nMaxScore;
								break;
							
							case PERFORMANCE.c_s_LBL_IWT_TEXTANSWER_SLIDE:
								// for Read Critically: getting data from objInstructorScoreRubric
								nFinalScore = (objInstructorScoreRubric.rubricScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricScorePercent) : 0;
								nMaxScore = (objInstructorScoreRubric.rubricMaxScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricMaxScorePercent) : PERFORMANCE.c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT;
								aDataset[iIdx].FinalScore = nFinalScore;
								aDataset[iIdx].ItemMaxScore = nMaxScore;
								break;
							
							default:
								// following IF block for latest version
								if(typeof objItemAttemptSummary.scoresummary != 'undefined'){
									var oScoresummary = JSON.parse(objItemAttemptSummary.scoresummary);
									if(typeof oScoresummary.percentile != 'undefined') {										
										if(typeof oScoresummary.percentile['reading-checkpoint'] != 'undefined'){
											nFinalScore += parseFloat(oScoresummary.percentile['reading-checkpoint']);
											nMaxScore += PERFORMANCE.c_s_READING_CHECKPOINT_MAX_PERCENT;
										}
										// For summary feedback slide
										if(typeof oScoresummary.percentile['summary'] != 'undefined'){
											nFinalScore += parseFloat(oScoresummary.percentile['summary']);
											nMaxScore += PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
										}
									}
								}
								// following IF block for previous version
								else if(typeof objItemAttemptSummary.percentile != 'undefined'){
									// For reading checkpoint [i.e. highlight & dnd slides] slides
									if(typeof objItemAttemptSummary.percentile['reading-checkpoint'] != 'undefined'){
										nFinalScore += parseFloat(objItemAttemptSummary.percentile['reading-checkpoint']);
										nMaxScore += PERFORMANCE.c_s_READING_CHECKPOINT_MAX_PERCENT;
									}
									// For summary feedback slide
									if(typeof objItemAttemptSummary.percentile.summary != 'undefined'){
										nFinalScore += parseFloat(objItemAttemptSummary.percentile['summary']);
										nMaxScore += PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
									}
								} 
								// following ELSE block for initial version
								else {
									var nTempFinalScore = 0,
										nTempMaxScore = 0;
									// For highlight slide
									if(typeof objItemAttemptSummary.iwthighlightslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwthighlightslide) {
											 if (objItemAttemptSummary.iwthighlightslide.hasOwnProperty(sSlide)) {
												nTempFinalScore += parseFloat(objItemAttemptSummary.iwthighlightslide[sSlide]);
												sCount++;
											}
										}
										nTempMaxScore += sCount * PERFORMANCE.c_s_READING_CHECKPOINT_MAX_SCORE;
									}
									// For dnd slide
									if(typeof objItemAttemptSummary.iwtdndslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwtdndslide) {
											if (objItemAttemptSummary.iwtdndslide.hasOwnProperty(sSlide)) {
												nTempFinalScore += parseFloat(objItemAttemptSummary.iwtdndslide[sSlide]);
												sCount++;
											}
										}
										nTempMaxScore += sCount * PERFORMANCE.c_s_READING_CHECKPOINT_MAX_SCORE;
									}
									nFinalScore += Math.round((nTempFinalScore/nTempMaxScore)*100);
									nMaxScore += PERFORMANCE.c_s_READING_CHECKPOINT_MAX_PERCENT;
									
									// For summaryfeedback slide
									if(typeof objItemAttemptSummary.iwtsummaryslide != 'undefined'){
										var sCount = 0;
										for(var sSlide in objItemAttemptSummary.iwtsummaryslide) {
											if (objItemAttemptSummary.iwtsummaryslide.hasOwnProperty(sSlide)) {
												nFinalScore += this.point4Scale(objItemAttemptSummary.iwtsummaryslide[sSlide]);
												sCount++;
											}
										}
										nMaxScore += sCount*PERFORMANCE.c_s_SUMMARY_WRITING_MAX_SCORE;
									}
								}
								
								// For read critically slide
								nFinalScore += (objInstructorScoreRubric.rubricScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricScorePercent) : 0;
								nMaxScore += (objInstructorScoreRubric.rubricMaxScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricMaxScorePercent) : PERFORMANCE.c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT;
								
								aDataset[iIdx].FinalScore = nFinalScore;
								aDataset[iIdx].ItemMaxScore = nMaxScore;
								break;
						}
					}
				}
			}
			
			return aDataset;
		};
		
		// Following code block for rubric scoring of Paragraph and Essay
		this.writingScore = function (sGraphType, aDataset) {
			//alert("aDataset.length: "+aDataset.length);
			for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
				var nFinalScore = 0,
					nMaxScore = 0;
					
				var objInstructorScoreRubric = ($.trim(aDataset[iIdx].InstructorScoreRubric).length > 0) ? JSON.parse(decodeURIComponent(aDataset[iIdx].InstructorScoreRubric.replace(/(\\r|\\n|\s*)/g, ''))) : '';
				
				//console.log('objInstructorScoreRubric: '+objInstructorScoreRubric);
				nFinalScore = (typeof objInstructorScoreRubric.rubricScorePercent != "undefined") ? parseFloat(objInstructorScoreRubric.rubricScorePercent) : 0;
				nMaxScore = (typeof objInstructorScoreRubric.rubricMaxScorePercent != "undefined") ? parseFloat(objInstructorScoreRubric.rubricMaxScorePercent) : PERFORMANCE.c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT;
				
				aDataset[iIdx].FinalScore = nFinalScore;
				aDataset[iIdx].ItemMaxScore = nMaxScore;
			}
			//console.log('aDataset: '+JSON.stringify(aDataset));
			return aDataset;
		};
	})();
	
	var noteContent = "",
		totalStudents = $("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li').length,
		selectedStudents = $("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li.active').length,
		benchMarkData = oSelf.manageBenchMark.filter(),
		iLessonsPerWeek = 5;
	
	// Following code block for rubric scoring of Reading Comprehension, IR, IWTHighlight, IWTDnD, Read Critically
	if (
		sGraphType == PERFORMANCE.c_s_LBL_READING_COMPREHENSION || 
		sGraphType == PERFORMANCE.c_s_LBL_IWT || 
		sGraphType == PERFORMANCE.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE || 
		sGraphType == PERFORMANCE.c_s_LBL_IWT_SUMMARY_SLIDE ||  
		sGraphType == PERFORMANCE.c_s_LBL_IWT_TEXTANSWER_SLIDE
	) {
		aDataset = oSelf.verifyRubric.iwtScore(sGraphType, aDataset);
	}
	// End: Code block for IWTHighlight, IWTDnD, Read Critically

	// Following code block for rubric scoring of Paragraph and Essay
	if(
		sGraphType == PERFORMANCE.c_s_LBL_WRITING || 
		sGraphType == PERFORMANCE.c_s_LBL_PARAGRAPH || 
		sGraphType == PERFORMANCE.c_s_LBL_ESSAY 
	) {
		aDataset = oSelf.verifyRubric.writingScore(sGraphType, aDataset);
	}
	// End: Code block for Paragraph and Essay
	
	// Following IF block for generating graph data for word count only
	if ( 
		sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT || 
		sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_IR || 
		sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_RATA || 
		sGraphType == PERFORMANCE.c_s_LBL_WORD_COUNT_TTR
	) {
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				sParameter = oRecord['SubjectSearchKey'],
				iJdx = 0;
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {

					if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] != "undefined") {
						if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] != "undefined") {
							aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] += oRecord['WordCount'];
							break;
						} 
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] = oRecord['WordCount'];
						break;
					}
					if(
						typeof oRecord['WordCount'] != "undefined" &&  
						parseInt(oRecord['WordCount']) > 0
					){
						// checking if data value is greater than 0
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {};
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] =  parseInt(oRecord['WordCount']);
					}
					break;
				}
			}
			if (iJdx == aGraphPlottingSeries.length) {
				if(
					typeof oRecord['WordCount'] != "undefined" &&  
					parseInt(oRecord['WordCount']) > 0
				){
					// checking if data value is greater than 0
					aGraphPlottingSeries.push({
						name:	sParameter,
						data:	{}
					});
					aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {};
					aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] =  oRecord['WordCount'];
				}
			}
		}
	
		for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
			var aData = [],
				iPrevWordCount = 0;
				
			for (var sUW in aGraphPlottingSeries[iIdx].data) {
				var iWordCount = 0,
					iEntries = 0;
				
				$.each(aGraphPlottingSeries[iIdx].data[sUW], function (iCnt, iVal){
					iWordCount += Math.round(iVal);
					iEntries++;
				});
				
				iPrevWordCount += Math.round(iWordCount / iEntries);
				
				// Formula to generate Lesson from Unit & Week is following 
				// Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )
				
				var dataObj = {},
					yValue = iPrevWordCount,
					iUnit = parseInt(sUW.split('-').first()),
					iWeek = parseInt(sUW.split('-').last()),
					iLessonsPerWeek = 5,
					xValue = $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) * iLessonsPerWeek;
				
				dataObj.y = yValue;
				dataObj.x = xValue;
				
				aData.push(dataObj); 
			}
			
			aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[aGraphPlottingSeries[iIdx].name].title;
			aGraphPlottingSeries[iIdx].data = aData;
			aGraphPlottingSeries[iIdx].lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
		}
		
		$.each(aGraphPlottingSeries, function(iIdx, arrType) {
			var objMaxVal = _.max(arrType.data, function(xMax){ return xMax.x; }),
				objMinVal = _.min(arrType.data, function(xMin){ return xMin.x; }),
				objPrevVal = objMinVal,
				maxVal = objMaxVal.x,
				minVal = objMinVal.x,
				aData = [];
			
			for(jIdx = minVal; jIdx <= maxVal; jIdx += 5) {
				var dataObj = {},
					yValueObj = _.where(arrType.data, {x:jIdx}),
					yValue = (yValueObj.length > 0) ? yValueObj : objPrevVal,
					xValue = jIdx;
				
				objPrevVal = yValue;
				dataObj.y = yValue[0].y;
				dataObj.x = xValue;
				dataObj.color = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
				dataObj.lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
				dataObj.lineWidth = 2;
				dataObj.marker = {
					symbol:'circle',
					radius:4,
					lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
					lineWidth:2,
					states:{
						hover:{
							enabled:true,
							fillColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						},
						select:{
							enabled:true,
							fillColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						}
					}
				};
				aData.push(dataObj);
			}
			aGraphPlottingSeries[iIdx].data = aData;
		});
		
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_FOR_NOTE_BENCHMARK).hide();
		
		var aTooltip = {
			shared: false,
			useHTML: true,
			headerFormat: '<small>{series.name}</small><table>',
			pointFormat: '<tr><td style="color: {series.color}">{point.y}</td></tr>',
			footerFormat: '</table>',
			valueDecimals: 0			
		},
		aPlotLines = [];
	}
	else if (sGraphType == PERFORMANCE.c_s_LBL_READING_LEVEL) {
		//console.log(JSON.stringify(aDataset));
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				sParameter = oRecord['SubjectSearchKey'],
				iJdx = 0;
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {
					
					
					if (aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]) {
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['lexileLevel'] += oSelf.manageBenchMark.calculateGLE(parseInt(oRecord['lexileLevel']));
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['entries']++;
						break;
					}
					// aGraphPlottingSeries.length - 1
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'lexileLevel':	oSelf.manageBenchMark.calculateGLE(parseInt(oRecord['lexileLevel'])),
						'entries':	1
					};
					break;
				}
			}
			if (iJdx == aGraphPlottingSeries.length) {
				if(
					typeof oRecord['lexileLevel'] != "undefined" &&  
					parseInt(oRecord['lexileLevel']) > 0
				){
					// checking if data value is greater than 0
					aGraphPlottingSeries.push({
						name:	sParameter,
						data:	{}
					});
					aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'lexileLevel':	oSelf.manageBenchMark.calculateGLE(parseInt(oRecord['lexileLevel'])),
						'entries':	1
					};
				}
			}
		}
		
		for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
			var aData = []
			for (var sUW in aGraphPlottingSeries[iIdx].data) {
				var fAvgGLELevel = oSelf.manageBenchMark.round(
										parseFloat(aGraphPlottingSeries[iIdx].data[sUW].lexileLevel) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries), 10
									);
				
				var dataObj = {},
					yValue = fAvgGLELevel,
					iUnit = parseInt(sUW.split('-').first()),
					iWeek = parseInt(sUW.split('-').last()),
					iLessonsPerWeek = 5,
					xValue = xValue = (
						(sParameter.toLowerCase() == 'unitbenchmark')?
						iUnit: 
						iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) // IPP-4027
					),
					markerColorCode = oSelf.manageBenchMark.markerColor(yValue);
				
				// Marker Colour
				dataObj.color = markerColorCode;
				dataObj.y = yValue;
				dataObj.x = xValue;
				dataObj.lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
				dataObj.lineWidth = 2;
				dataObj.marker = {
					symbol:'circle',
					radius:4,
					lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
					lineWidth:2,
					states:{
						hover:{
							enabled:true,
							fillColor:markerColorCode,
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						},
						select:{
							enabled:true,
							fillColor:markerColorCode,
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						}
					}
				};
				
				aData.push(dataObj); 
			}
			
			aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[aGraphPlottingSeries[iIdx].name].title;
			aGraphPlottingSeries[iIdx].data = aData;
			aGraphPlottingSeries[iIdx].lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
		}
		
		
		// Start: for plotting benchmark line of reading level graph
		var dataObj = {};
		dataObj.name = "Benchmark";
		dataObj.lineColor = "#7E7E7E";
		dataObj.enableMouseTracking = false;
		dataObj.dashStyle = "ShortDash";
		dataObj.data = [];
		dataObj.data[0] = {"y":oSelf.model.performanceInfoData.gradeLexileConstant.dotLineStartPoint,"x":oSelf.xAxisMin,"marker":{"enabled":false}};
		dataObj.data[1] = {"y":oSelf.model.performanceInfoData.gradeLexileConstant.dotLineEndPoint,"x":oSelf.xAxisMax,"marker":{"enabled":false}};
		
		aGraphPlottingSeries.push(dataObj);
		// End: for plotting benchmark line of reading level graph
		
		var aTooltip = {
			shared: false,
			useHTML: true,
			valueDecimals: 0,
			formatter: function () {
				if (this.y > 13) {
					return '<small>'+this.series.name+'</small><table><tr><td style="color: {'+this.series.color+'}">'+oSelf.model.performanceInfoData.gradeLexileConstant.yAxisMaxLebel+'</td></tr></table>';
				}
				return '<small>'+this.series.name+'</small><table><tr><td style="color: {'+this.series.color+'}">'+this.point.y+'</td></tr></table>';
			}
		};
		aPlotLines = [];
	}	
	
	else if (
		sGraphType == PERFORMANCE.c_s_ORAL_FLUENCY || 
		sGraphType == PERFORMANCE.c_s_WCPM 
	) {
		aDataset = _.reject(
			aDataset,
			function (rec) {
				return (rec.ItemSubject != "pktof");
			}
		);
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				//sParameter = oRecord['SubjectSearchKey'],
				sParameter = sGraphType,
				oPKTOralFluencyScore = (oRecord['PKTOralFluencyScore'].length > 0) ? JSON.parse(decodeURIComponent(oRecord['PKTOralFluencyScore'])) : [],
				iPKTScore = 0,
				iJdx = 0;
			
			for (var iPKT = 0; iPKT < oPKTOralFluencyScore.length; iPKT++ ) {
				iPKTScore += parseInt(oPKTOralFluencyScore[iPKT]['WCPM']);
			}
			var iPKTScoreAvg = Math.round(iPKTScore/iPKT);
			
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {
					
					if (aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]) {
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['marks'] += iPKTScoreAvg;
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['entries']++;
						break;
					}
					// aGraphPlottingSeries.length - 1
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'marks':	iPKTScoreAvg,
						'entries':	1
					};
					break;
				}
			}
			if (iJdx == aGraphPlottingSeries.length) {
				aGraphPlottingSeries.push({
					name:	sParameter,
					data:	{}
				});
				
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
					'marks':	iPKTScoreAvg,
					'entries':	1
				};
			}
		}

		for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
			var aData = [];
			for (var sUW in aGraphPlottingSeries[iIdx].data) {
				// Formula to generate Lesson from Unit & Week is following
				// Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )
				
				// Marker Colour
				var aUnitWeekDataChunks = sUW.split('-'),
					iUnit = parseInt(aUnitWeekDataChunks.first()),
					iWeek = parseInt(aUnitWeekDataChunks.last()),
					dataObj = {},
					yValue = Math.round(parseFloat(aGraphPlottingSeries[iIdx].data[sUW].marks) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries)),
					xValue = (iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek))
					/* , markerColorCode = oSelf.manageBenchMark.markerColor(yValue) */;
				
				/* dataObj.color = markerColorCode; */
				dataObj.y = yValue;
				dataObj.x = xValue;
				dataObj.lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
				dataObj.lineWidth = 2;
				dataObj.marker = {
					symbol:'circle',
					radius:4,
					lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
					lineWidth:2,
					states:{
						hover:{
							enabled:true,
							fillColor: PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx] /* markerColorCode */,
							lineColor: PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						},
						select:{
							enabled:true,
							fillColor: PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]/* markerColorCode */,
							lineColor: PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						}
					}
				};
				aData.push(dataObj); 
			}
			aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[aGraphPlottingSeries[iIdx].name].title;
			if(
				sGraphType == PERFORMANCE.c_s_ORAL_FLUENCY || 
				sGraphType == PERFORMANCE.c_s_WCPM
			) {
				aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[sGraphType].title;
			}
			aGraphPlottingSeries[iIdx].data = aData;
			aGraphPlottingSeries[iIdx].lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
		}
		
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_FOR_NOTE_BENCHMARK).hide();
		
		var aTooltip = {
			shared: false,
			useHTML: true,
			headerFormat: '<small>{series.name}</small><table>',
			pointFormat: '<tr><td style="color: {series.color}">{point.y} </td></tr>',
			footerFormat: '</table>',
			valueDecimals: 0			
		},
		aPlotLines = []; /* */
		
		
	}
	else {
		// ELSE block for generating graph data for all types except word count & reading level
		
		// Extra Practice assignment/assessment not eligible for plotting graph and detail view
		aDataset = _.reject(
			aDataset,
			function (rec) {
				return (rec.ExtraPractice == "Yes");
			}
		);
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				sParameter = oRecord['SubjectSearchKey'],
				iJdx = 0;
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {
					if(oRecord.ItemMaxScore == 0){
						oRecord.ItemMaxScore = 1;
					}
					if (aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]) {
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['marks'] += (
							Math.round((oRecord.FinalScore / oRecord.ItemMaxScore) * 100)
						);
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['entries']++;
						break;
					}
					// aGraphPlottingSeries.length - 1
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'marks':	Math.round((oRecord.FinalScore / oRecord.ItemMaxScore) * 100),
						'entries':	1
					};
					break;
				}
			}
			if (iJdx == aGraphPlottingSeries.length) {
				aGraphPlottingSeries.push({
					name:	sParameter,
					data:	{}
				});
				if(oRecord.ItemMaxScore == 0){
					oRecord.ItemMaxScore = 1;
				}
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
					'marks':	Math.round((oRecord.FinalScore / oRecord.ItemMaxScore) * 100),
					'entries':	1
				};
			}
		}
		
		for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
			var aData = [];
			for (var sUW in aGraphPlottingSeries[iIdx].data) {
				// Formula to generate Lesson from Unit & Week is following
				// Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )
				
				// Marker Colour
				var aUnitWeekDataChunks = sUW.split('-'),
					iUnit = parseInt(aUnitWeekDataChunks.first()),
					iWeek = parseInt(aUnitWeekDataChunks.last()),
					dataObj = {},
					yValue = Math.round(parseFloat(aGraphPlottingSeries[iIdx].data[sUW].marks) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries)),
					xValue = (
						(sParameter.toLowerCase() == 'unitbenchmark')?
						iUnit: 
						iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) // IPP-4027
					),
					markerColorCode = oSelf.manageBenchMark.markerColor(yValue);
				
				dataObj.color = markerColorCode;
				dataObj.y = yValue;
				dataObj.x = xValue;
				dataObj.lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
				dataObj.lineWidth = 2;
				dataObj.marker = {
					symbol:'circle',
					radius:4,
					lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx],
					lineWidth:2,
					states:{
						hover:{
							enabled:true,
							fillColor:markerColorCode,
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						},
						select:{
							enabled:true,
							fillColor:markerColorCode,
							lineColor:PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx]
						}
					}
				};
				aData.push(dataObj); 
			}
			aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[aGraphPlottingSeries[iIdx].name].title;
			if(
				sGraphType == PERFORMANCE.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE || 
				sGraphType == PERFORMANCE.c_s_LBL_IWT_SUMMARY_SLIDE || 
				sGraphType == PERFORMANCE.c_s_LBL_IWT_TEXTANSWER_SLIDE
			) {
				aGraphPlottingSeries[iIdx].name = oSelf.leftPanelData[sGraphType].title;
			}
			aGraphPlottingSeries[iIdx].data = aData;
			aGraphPlottingSeries[iIdx].lineColor = PERFORMANCE.c_a_GRAPFH_LINE_COLOR[iIdx];
		}
		
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_FOR_NOTE_BENCHMARK).show();
		
		var aTooltip = {
			shared: false,
			useHTML: true,
			headerFormat: '<small>{series.name}</small><table>',
			pointFormat: '<tr><td style="color: {series.color}">{point.y}% </td></tr>',
			footerFormat: '</table>',
			valueDecimals: 0			
		},
		aPlotLines = [{
			color: 'red',
			width: 2,
			value: benchMarkData.minValue,
			label: {
				text: '',
				align: 'right',
				x: -10,
				y: 16
			}            
		}];
	}
	
	// Start: Code snippet for Notes
	if(aGraphPlottingSeries.length == 0) {
		if ( totalStudents == selectedStudents){
			noteContent = benchMarkData.dataNotes.LGClassNoData;
		} 
		else {
			noteContent = benchMarkData.dataNotes.LGStudNoData;
		}
	}
	else {
		if ( totalStudents == selectedStudents){
			noteContent = benchMarkData.dataNotes.LGClassNote;
		}
		else {
			noteContent = benchMarkData.dataNotes.LGStudNote;
		}
	}
	
	if (noteContent != "") {
		$("#"  + PERFORMANCE.c_s_PERFORMANCE_NOTE_CONTENT).empty().html('<p><strong>Note: </strong>' + noteContent + '</p>');
		$("#"  + PERFORMANCE.c_s_PERFORMANCE_NOTE_CONTENT).show("blind", "up", 1500);
	}
	// End: Code snippet for Notes
	
	var oLebelConfig = {
			enabled: true,
	};
	
	if (oSelf.yAxistitle == PERFORMANCE.c_s_LBL_READING_LEVEL_YAXIS_TXT) {
		oLebelConfig = {
			enabled: true,
			formatter: function () {				
				if(this.value > 13){
					return '13+';
				}
				if(this.value == 0){
					return 'K';
				}
				return this.value;
			}
		};
	}
	
	var options = {
		chart: {renderTo: 'chart',type: 'line'},
		title: {
			text: sGraphHeaderTitle
		},
		legend: {
			enabled: false,
		},
		xAxis: {
			title: 			{
				text: oSelf.xAxistitle
			},
			min:			oSelf.xAxisMin,
			max:			oSelf.xAxisMax,
			tickInterval:	oSelf.xAxisTickInterval,
			/* showFirstLabel: false, */
			offset:			10,
			labels:			{
				rotation: -45,
				enabled: true,
				formatter: function () {
					var iLessonsPerWeek = 5;
					if (oSelf.xAxistitle != PERFORMANCE.c_s_LABEL_UNITS) {
						var iWeeks = parseInt(this.value / iLessonsPerWeek),
							iUnit = $GLOBALS.get('UnitWeekDetails').getUnit4mWeeks(iWeeks),
							iRemainingWeeks = iWeeks - $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit),
							iLesson = iLessonsPerWeek * iRemainingWeeks,
							bIsInnerMarker = (
								this.isLast === false &&
								this.isFirst === false
							);
						
						if (iLesson !== iLessonsPerWeek && bIsInnerMarker) {
							return '';
						}
						
						return '<span' + (bIsInnerMarker? ' style="color:red;"': '') + '>' + iUnit + '.' + iLesson + '</span>';
					}
					return this.value;
				}
			}
		},
		yAxis: {
			title: {
				text: oSelf.yAxistitle
			},
			min:			oSelf.yAxisMin,
			max:			oSelf.yAxisMax,
			tickInterval:	oSelf.yAxisTickInterval,
			plotLines: aPlotLines,
			offset: 5,
			labels: oLebelConfig
		},
		tooltip: aTooltip,
		series: (aGraphPlottingSeries.length > 0) ? aGraphPlottingSeries : [[0,0]],
		credits: {
			enabled: false
		},
		navigation: {
            buttonOptions: {
                enabled: false
            }
        },
	};
	
	$("#" + PERFORMANCE.c_s_CONTAINER_CHART).highcharts(options);
	
	oUtility.hideLoader();
	oSelf.resize();
};

/**
* @method: getAllSelectedStudents 
* @uses: for getting selected student from student list
* @return void;
*/
PerformanceView.getAllSelectedStudents = function(){
	var oSelf = this;
	// select checked students only
	oSelf.selectedStudents = {};
	$("#" + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li.active').each(function(i) {
		oSelf.selectedStudents[$(this).data('student-id')] = $(this).find('.middle').html();
	});
}

/**
* @method: effectOnSliderChange 
* @uses: to retrieve and control the data after changing the slider position
* @return void;
*/
PerformanceView.effectOnSliderChange = function () {		 
	var oSelf = this,
		oUnitWeekInfo = {
			fromUnitNo:	-1,
			fromWeekNo:	-1,
			toUnitNo:	-1,
			toWeekNo:	-1
		},
		bFound = false,
		iMinValue = 2,
		iMaxValue = 7;
	
	// get selected students
	oSelf.getAllSelectedStudents();

	// Note Content is not available for few options that's why initially hiding note container 
	$('#'  + PERFORMANCE.c_s_PERFORMANCE_NOTE_CONTENT).hide();
	
	// selection of from_unit
	oSelf.slider_min_val = $("#" + PERFORMANCE.c_s_SLIDER).slider("values")[0];
	oSelf.slider_max_val = $("#" + PERFORMANCE.c_s_SLIDER).slider("values")[1];
	
	/*==== IPP-4027 ====*/
	// From Unit & Week:
	oUnitWeekInfo.fromUnitNo = $GLOBALS.get('UnitWeekDetails').getUnit4mWeeks(oSelf.slider_min_val);
	oUnitWeekInfo.fromWeekNo = $('#lessonId_' + oSelf.slider_min_val).data('week-number');
	
	// To Unit & Week:
	oUnitWeekInfo.toUnitNo = $GLOBALS.get('UnitWeekDetails').getUnit4mWeeks(oSelf.slider_max_val);
	oUnitWeekInfo.toWeekNo = $('#lessonId_' + oSelf.slider_max_val).data('week-number');
	
	oSelf.fromUnitNo = oUnitWeekInfo.fromUnitNo;
	oSelf.fromWeekNo = oUnitWeekInfo.fromWeekNo;
	oSelf.toUnitNo = oUnitWeekInfo.toUnitNo;
	oSelf.toWeekNo = oUnitWeekInfo.toWeekNo;
	/*== End IPP-4027 ==*/
	
	// populate data 
	var unit_selection_txt = '',
		activeStudentLiObj = $('#' + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li.active'),
		studentLiObj= $('#' + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST).find('li');
		
	unit_selection_txt = oUtility.printf(
		PERFORMANCE.c_s_TXT_UNIT + ' %d.%d - %d.%d',
		oSelf.fromUnitNo,
		oSelf.fromWeekNo,
		oSelf.toUnitNo,
		oSelf.toWeekNo
	);
	
	if (studentLiObj.size() == activeStudentLiObj.size()) {
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_SUB_HEADER).empty().html(PERFORMANCE.c_s_TXT_ALL_STUDENT+' | '+unit_selection_txt);
		$("#" + PERFORMANCE.c_s_BTN_ALL_STUD).empty().html(PERFORMANCE.c_s_TXT_ALL_STUDENT);
	}
	else if ((studentLiObj.size() > activeStudentLiObj.size()) && (activeStudentLiObj.size() > 1)) {
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_SUB_HEADER).empty().html(PERFORMANCE.c_s_TXT_PARTIAL_STUDENT+' | '+unit_selection_txt);
		$("#" + PERFORMANCE.c_s_BTN_ALL_STUD).empty().html(PERFORMANCE.c_s_TXT_PARTIAL_STUDENT);
	}
	else {
		$("#" + PERFORMANCE.c_s_RIGHT_PANEL_SUB_HEADER).empty().html(activeStudentLiObj.find('.middle').html()+' | '+unit_selection_txt);
		$("#" + PERFORMANCE.c_s_BTN_ALL_STUD).empty().html(activeStudentLiObj.find('.middle').html());
	}

	switch (oSelf.viewMode) {
		case PERFORMANCE.c_s_MODE_PIE_CHART:
			break;
		case PERFORMANCE.c_s_MODE_DETAILED_VIEW:
			oSelf.renderData4DetailedView();
			break;
		case PERFORMANCE.c_s_MODE_SKILL_REPORT:
			oSelf.renderSkillReportContent();
			break;
		default:
			oSelf.plotGraph();
			break;
	}
};

/**
* @method: renderDetailView 
* @uses: render header content for Detail View Tab
* @return void;
*/
PerformanceView.renderDetailView = function () {
	var oSelf = this;
	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_RIGHT_PANEL_HEADER).html(),
			{
				'benchmarkIndex':oSelf.idxBenchmark,
				'data': oSelf.model
			}
		)
	);	
};

/**
* @method: renderData4DetailedView 
* @uses: render html for Detail View Tab
* @return void;
*/
PerformanceView.renderData4DetailedView = function () {
	var oSelf = this;

	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).addClass("performanceDetailView");
	
	// View details updated code.
	var bMarkdata = oSelf.manageBenchMark.filter(),
		dataBenchmark = bMarkdata.benchMark,
		headerTitle = bMarkdata.headerTitle,
		aMasterData = oSelf.lineGraphAndDetailViewHandler.getFilteredData(),
		parentAvgScore = 0,
		totalRecords = 0,
		objDetail = {},
		sGraphType = (
			($('.menuclass li.active').length > 0)?
			$('.menuclass li.active:last > a').data('pgraph-type'):
			$('.menuclass li a').eq(oSelf.defaultGraphTypeId).data('pgraph-type')
		);
	
	if($.isEmptyObject( aMasterData ) == false){
		// Extra Practice assignment/assessment not eligible for plotting graph and detail view
		aDataset = _.reject(
			aMasterData,
			function(rec) {
				return rec.ExtraPractice == "Yes"
			}
		);
		var groupDetailView = _.groupBy(aDataset, "SubjectSearchKey");
		objDetail.parentTitle = headerTitle;
		objDetail.childElements = {};
		
		$.each(groupDetailView, function (subType, studentData) {
			objDetail.childElements[subType] = {};
			objDetail.childElements[subType].title = PerformanceView.leftPanelData[(subType == "studyplan")? studentData.SubjectSearchKey: subType].title;
			objDetail.childElements[subType].benchMarkColor = {};
			
			var totalAvgScore = 0,
				sortedStudentData = _.sortBy(studentData, "FinalScore");
			
			$.each(sortedStudentData, function (idx, valx) {
				var tempObj 					= {},
					tempArr 					= [];
				
				tempObj.ItemID 					= valx.ItemID;
				tempObj.ItemAttemptID 			= valx.ItemAttemptID;
				tempObj.ItemName 				= valx.ItemName;
				tempObj.ItemSubType 			= valx.ItemSubType;
				tempObj.ItemType 				= valx.ItemType;
				tempObj.ItemAttemptSummary 		= valx.ItemAttemptSummary;
				tempObj.UnitNumber 				= valx.UnitNumber;
				tempObj.WeekNumber 				= valx.WeekNumber;
				tempObj.SubjectSearchKey 		= valx.SubjectSearchKey;
				tempObj.InstructorScoreRubric 	= valx.InstructorScoreRubric;
				tempObj.FinalScore 				= valx.FinalScore;
				tempObj.orgFinalScore 			= valx.FinalScore;
				tempObj.ItemMaxScore 			= valx.ItemMaxScore;
				tempObj.OrgItemMaxScore 		= valx.ItemMaxScore;

				// Start: Following code block for rubric scoring of Reading Comprehension, IR, IWTHighlight, IWTDnD, Read Critically
				if(
					sGraphType == PERFORMANCE.c_s_LBL_READING_COMPREHENSION || 
					sGraphType == PERFORMANCE.c_s_LBL_IWT || 
					sGraphType == PERFORMANCE.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE || 
					sGraphType == PERFORMANCE.c_s_LBL_IWT_SUMMARY_SLIDE ||  
					sGraphType == PERFORMANCE.c_s_LBL_IWT_TEXTANSWER_SLIDE
				) {
					tempArr.push(valx);
					var tempDataset = oSelf.verifyRubric.iwtScore(sGraphType, tempArr);
					tempObj.FinalScore 			= tempDataset[0].FinalScore;
					tempObj.ItemMaxScore 		= (tempDataset[0].ItemMaxScore <= 0) ? 1 : tempDataset[0].ItemMaxScore;
				}
				// End: Code block for IWTHighlight, IWTDnD, Read Critically
				
				// Start: Following code block for rubric scoring of Paragraph and Essay				
				if(
					sGraphType == PERFORMANCE.c_s_LBL_WRITING || 
					sGraphType == PERFORMANCE.c_s_LBL_PARAGRAPH || 
					sGraphType == PERFORMANCE.c_s_LBL_ESSAY 
				) {
					tempArr.push(valx);
					var tempDataset = oSelf.verifyRubric.writingScore(sGraphType, tempArr);
					tempObj.FinalScore 			= tempDataset[0].FinalScore;
					tempObj.ItemMaxScore 		= (tempDataset[0].ItemMaxScore <= 0) ? 1 : tempDataset[0].ItemMaxScore;
				}
				// End: Code block for Paragraph and Essay
				
				$.each(dataBenchmark, function (id, val) {
					var studentPercent =  ((tempObj.FinalScore/tempObj.ItemMaxScore) * 100);
					maxMinValue = id.split("-");
					
					if(parseFloat(maxMinValue[0]) > Math.round(studentPercent) && typeof maxMinValue[1] == "undefined"){
						
						if(typeof objDetail.childElements[subType].benchMarkColor[id] == "undefined"){
							objDetail.childElements[subType].benchMarkColor[id] = {};
							objDetail.childElements[subType].benchMarkColor[id].colorCode = val.colorCode;
							objDetail.childElements[subType].benchMarkColor[id].title = val.title;
							objDetail.childElements[subType].benchMarkColor[id].studentCounter = 0;
							objDetail.childElements[subType].benchMarkColor[id].studentDetails = {};
						}
						
						if(
							(typeof objDetail.childElements[subType].benchMarkColor[id].studentDetails != "undefined") && 
							(valx.StudentId in objDetail.childElements[subType].benchMarkColor[id].studentDetails)
						){
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment.push(tempObj);
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].percentage += studentPercent;
						}
						else {	
							objDetail.childElements[subType].benchMarkColor[id].studentCounter++;
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId] = {};
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].studentName = valx.StudentName;
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].percentage = studentPercent;
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment = new Array();
							objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment.push(tempObj);
						}
					}
					else {
						if (Math.round(studentPercent) >= parseFloat(maxMinValue[0]) && Math.round(studentPercent) <= parseFloat(maxMinValue[1])){
							if(typeof objDetail.childElements[subType].benchMarkColor[id] == "undefined"){
								objDetail.childElements[subType].benchMarkColor[id] = {};
								objDetail.childElements[subType].benchMarkColor[id].colorCode = val.colorCode;
								objDetail.childElements[subType].benchMarkColor[id].title = val.title;
								objDetail.childElements[subType].benchMarkColor[id].studentCounter = 0;
								objDetail.childElements[subType].benchMarkColor[id].studentDetails = {};
							}
							
							if(
								(typeof objDetail.childElements[subType].benchMarkColor[id].studentDetails != "undefined") && 
								(valx.StudentId in objDetail.childElements[subType].benchMarkColor[id].studentDetails)
							){
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment.push(tempObj);
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].percentage += studentPercent;
							}
							else {
								objDetail.childElements[subType].benchMarkColor[id].studentCounter++;
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId] = {};
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].studentName = valx.StudentName;
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].percentage = studentPercent;
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment = new Array();
								objDetail.childElements[subType].benchMarkColor[id].studentDetails[valx.StudentId].assignment.push(tempObj);
							}
						}
					}
					
				});
				
				totalAvgScore += Math.round((tempObj.FinalScore/tempObj.ItemMaxScore)*100);
			});
			parentAvgScore += totalAvgScore;
			totalRecords += Object.keys(studentData).length;
			objDetail.childElements[subType].avgScore = Math.round(totalAvgScore/Object.keys(studentData).length);
		});
		
		objDetail.avgScore = Math.round(parentAvgScore/totalRecords);
	}
	
	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_PERFORMANCE_DETAIL_VIEW).html(),
			{
				'data': objDetail
			}
		)
	);
	
	oSelf.bindEvents4RightPanel();
	oUtility.hideLoader();
	oSelf.resize();
};

/**
 * Plot Warning View
 * 
 */
PerformanceView.renderWarning = function () {
	var oSelf = this;
	
	if (isSkillReportVisible(objPerformanceInfoJsonData.currentVersion, PERFORMANCE.c_s_APP_VER_SBR, objPerformanceInfoJsonData.appPlatform)) {
		var objTeacherWarningModel = _.where(oSelf.model.gradeBookData, {ICS: ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS});
	}
	else {
		var objTeacherWarningModel = _.where(oSelf.model.gradeBookData, {ItemCompletionStatus: ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS});
	}
	
	var objStudentWarningModel	=	oSelf.prepareStudentWarningModel(oSelf);	
	
	// Render Header
	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_RIGHT_PANEL_HEADER).html(),
			{
				'benchmarkIndex':oSelf.idxBenchmark,
				'data': oSelf.model
			}
		)
	);
	
	//	Set Header Data	
	var objMaxUnitNumber = _.max(PerformanceView.model.assignmentListData, function(obj){ return obj.UnitNumber; });
	var objMinUnitNumber = _.min(PerformanceView.model.assignmentListData, function(obj){ return obj.UnitNumber; });
	
	$(".title_wrap").text(PERFORMANCE.c_s_TXT_WARNINGS);	
	$('#' + PERFORMANCE.c_s_RIGHT_PANEL_SUB_HEADER)
		.empty()
		.html(PERFORMANCE.c_s_TXT_DISPLAY + objPerformanceInfoJsonData.curUnitNumber); //  objMinUnitNumber.UnitNumber
	// PERFORMANCE.c_s_TXT_DISPLAY + objMinUnitNumber.UnitNumber + " – " + objMaxUnitNumber.UnitNumber	
	
	//	Remove Slider if Any
	if ($("#"+PERFORMANCE.c_s_CONTAINER_SLIDER).length) {
		$("#"+PERFORMANCE.c_s_CONTAINER_SLIDER).hide();
	}	
	
	// Render Body
	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER)
		.removeClass('performanceDetailView')
		.empty()
		.html(
			_.template(
				$("#" + PERFORMANCE.c_s_TEMPLATE_WARNING).html(),
				{
					'benchmarkIndex':oSelf.idxBenchmark,
					'data': oSelf.model,
					'objTeacherWarningModel': objTeacherWarningModel,
					'objStudentWarningModel': objStudentWarningModel,
					'objTeacherWarning': PerformanceView.model.performanceInfoData.teacherwarnings
				}
			)
		);
	//	Bind Event For Warning
	oSelf.bindWarningEvent();
	oSelf.resize();	
 };
 
/**
 * Event Binding For Warning
 * 
 */
 PerformanceView.bindWarningEvent = function () {
	var oSelf = this;
	$(".actionshowview")
		.off("click")
		.on("click", function () {
			$(this).toggleClass('active');
		});
};
 
/**
  *	Prepare Student Model
  * @param {oSelf} Object
  */
PerformanceView.prepareStudentWarningModel = function (oSelf) {
	var objMainData	=	{
		"0" : {
			"Vocabulary" : {
				"0" : "studyplan",
				"1" : "word_slam"
			}
		},
		"1" : {
			"Spelling" : {
				"0" : "studyplan"				
			}
		},
		"2" : {
			"Grammar" : {
				"0" : "studyplan"				
			}
		},
		"3" : {
			"Writing" : {
				"0" : "paragraph",
				"1" : "essay"		
			}
		},
		"4" : {
			"Benchmark" : {
				"0" : "unitbenchmark"				
			}
		}
	};
	
	var objMainDataLen = Object.keys(objMainData).length,
		arrFilteredStudent = [],
		objFilterData = [],
		arrCompletedStudentList = _.where(oSelf.model.gradeBookData, {ItemCompletionStatus: ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS});
		
	if (isSkillReportVisible(objPerformanceInfoJsonData.currentVersion, PERFORMANCE.c_s_APP_VER_SBR, objPerformanceInfoJsonData.appPlatform)) {
		arrCompletedStudentList = _.where(oSelf.model.gradeBookData, {ICS: ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS});
	}
	
	// console.log(arrCompletedStudentList); 
	// console.log("---------------------"); 
	var arrItems	=	[];
	
	for(var i = 0; i < objMainDataLen; i++) {
		objSub		=	objMainData[i];
		sSubject	=	Object.keys(objSub)[0];
		objChild	=	{};
		for(var key in objSub) {
			objChild	=	objSub[key];
			objFilterData[i]	=	{ItemSubject: sSubject, ItemSubType: objChild};
		}				
	}
	//	 console.log(objFilterData); return false;
	var count = 0;
	for(var objKey in objFilterData) {		
		var objSubFilterData	=	objFilterData[objKey];
		if(typeof objSubFilterData.ItemSubType != 'undefined') {
			objSubType	=	objSubFilterData.ItemSubType;
			for(var key in objSubType) {				
				if(objSubType[key] == 'studyplan') {	
					arrItems	=	[];
					arrItems.push(_.pluck(_.where(objAssignmentListJsonData.Content, {ItemSubType: objSubType[key], ItemSubject: objSubFilterData.ItemSubject}), 'ItemID'));
					if(typeof arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject] == "undefined") {
						arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject]	=	[];
					}
					
					count = 0;
					for(var cnt = 0; cnt < arrItems[0].length; cnt++) {			
						//	Search Through Student List
						objData	=	_.filter(arrCompletedStudentList, function(obj) { 
										if( obj.ItemID == arrItems[0][cnt]) { return obj }										
									});						
						if(objData.length != 0) {
							// arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject][count++] = objData[0];
							for(var iObjCnt = 0; iObjCnt < objData.length;  iObjCnt++) {								
								arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject][count++]	=	objData[iObjCnt];
							}
						}
					}						
				} else {
					arrItems	=	[];
					arrItems.push(_.pluck(_.where(objAssignmentListJsonData.Content, {ItemSubType:objSubType[key]}), 'ItemID'))				
					if(typeof arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject] == "undefined") {
						arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject]	=	[];
					}
					
					count = 0;
					for(var cnt = 0; cnt < arrItems[0].length; cnt++) {	
						//	Search Through Student List						
						objData	=	_.filter(arrCompletedStudentList, function(obj) { 
										if( obj.ItemID == arrItems[0][cnt]) { return obj; }
									});
						if(objData.length != 0) {
							// arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject][count++]	=	objData[0];
							for(var iObjCnt = 0; iObjCnt < objData.length;  iObjCnt++) {								
								arrFilteredStudent[objSubType[key]+"_"+objSubFilterData.ItemSubject][count++]	=	objData[iObjCnt];
							}
						}						
					}						
				}					
			}
		}		
	}
	
	var objResultModel	=	{};
	var cnt = 0;
//	 console.log("----------------");
//	 console.log(arrFilteredStudent); return false;
	for(var key in arrFilteredStudent) {
		if (arrFilteredStudent[key].length) {			
			arrFilterSub = arrFilteredStudent[key];			
			if (typeof arrFilterSub != 'undefined' && typeof arrFilterSub == "object") {					
				for (var countKey = 0; countKey < arrFilterSub.length; countKey++) {
					arrSendData	=	[];
					arrSendData.push(arrFilterSub[countKey]);
					objResultModel[cnt++]	=	oSelf.calculateStudentPercentage(oSelf, key, arrSendData);	
				}
			}			
		}
	}
	
	var objModel =	{},
		arrParent = {
			"vocab" : "Vocabulary",
			"language_arts":	"Spelling", 
			"language_arts1":	"Grammar",
			"writing":	"Writing",
			"unitbenchmark":	"Benchmark"
		},
		cnt = 0,
		arrUniqStudentId = oSelf.getUniqueValue(objResultModel, 'StudentId');
	
	for (var key in arrParent) {
		_parentKey	=	arrParent[key];
		_objParentFilter	=	_.where(objResultModel, {parentType: _parentKey});		
		var avgPercentage	=	0;				
		
		if (_objParentFilter.length) {
			groups = _.where(PerformanceView.model.performanceInfoData.groups, {type: key});
			
			for (var keyUniqeStudId in arrUniqStudentId) {
				_objSubParentFilter	=	_.where(_objParentFilter, {StudentId: arrUniqStudentId[keyUniqeStudId]});
				if (_objSubParentFilter.length) {
					// console.log(_objSubParentFilter);
					for (var j = 0; j < _objSubParentFilter.length; j++) {						
						avgPercentage	+=	_objSubParentFilter[j].calculatedPercentage;										
					}
					avgPercentage	=	(avgPercentage/j).toFixed(0);
					benchMark = {};
					if (groups.length) {
						benchMark = groups[0].benchmark;
					}
					
					objWarnings = oSelf.getStudentWarningDetails(benchMark, avgPercentage);			
					sWarningTitle = objWarnings.sWarningTitle;
					sWarningMsg = objWarnings.sWarningMsg;	
					j--;			
					
					if(sWarningTitle != null && sWarningMsg != null) {
						var studentArr = _.where(objStudentListJsonData.Content, {UserID: _objSubParentFilter[j].StudentId});
						
						objModel[cnt]	=	{
							"type"			: _objSubParentFilter[j].parentType,
							"StudentId"		: _objSubParentFilter[j].StudentId,
							"StudentName"	: (studentArr.length) ? studentArr[0].UserDisplayName : "",
							"avgPercentage"	: avgPercentage,
							"sWarningTitle" : sWarningTitle,
							"sWarningMsg"	: sWarningMsg
						}
						cnt++;
					}
					avgPercentage	=	0;	
				}							
			}
		}
	}	
	return objModel;
 };
 
  /**
  *	Calculate Student Number
  * @param {Object} oSelf
  * @param {String} sParentType
  * @param {Object} objModel
  */
 PerformanceView.calculateStudentPercentage	=	function (oSelf, sParentType, objData) {
 
	// console.log(sParentType, objData);return false;
 	
	if(typeof objData == "object") {
		var objModel	=	{};
                var lastIndex   =       sParentType.lastIndexOf("_");
		var arrParents	=	[sParentType.substring(0, lastIndex), sParentType.substring(lastIndex+1)];//sParentType.split("_");console.log(sParentType);                
		var sSubject	=	arrParents[1];
		var sItemType	=	arrParents[0];
		
		var calculatedPercentage	=	0;
		var groups					=	null;
		var benchMark				=	null;	
		var	objWarnings				=	null;
		var sWarningTitle			=	null;
		var sWarningMsg				=	null;	
                
		switch (sSubject) {
                    case "Vocabulary":
                        cnt	=	0;
                        for(var key = 0; key < objData.length; key++) {		
                            if(typeof objData[key] != "undefined") {
                                var studentArr = _.where(objStudentListJsonData.Content, {UserID: objData[key].StudentID});	
                                if(sItemType == "studyplan") {
                                    calculatedPercentage	+=	(parseInt(objData[key].FinalScore) / (parseInt(objData[key].ItemMaxScore)) * 100);
                                    objModel["parentType"]	 =	"Vocabulary";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";						
                                }

                                if(sItemType == "word_slam") {
                                    calculatedPercentage	+=	(parseInt(objData[key].FinalScore) / (parseInt(objData[key].ItemMaxScore)) * 100);
                                    objModel["parentType"]	 =	"Vocabulary";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";						
                                }
                                cnt++;
                            }
                        }
                        calculatedPercentage	=	calculatedPercentage/cnt;
                        objModel["calculatedPercentage"]	 =	calculatedPercentage;
                        break;
                    case "Spelling":
                        cnt	=	0;
                        for(var key = 0; key < objData.length; key++) {	
                            if(typeof objData[key] != "undefined") {
                                var studentArr = _.where(objStudentListJsonData.Content, {UserID: objData[key].StudentID});					
                                if(sItemType == "studyplan") {
                                    calculatedPercentage	+=	(parseInt(objData[key].FinalScore) / (parseInt(objData[key].ItemMaxScore)) * 100);
                                    objModel["parentType"]	 =	"Spelling";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";						
                                }
                                cnt++;
                            }
                        }
                        calculatedPercentage	=	calculatedPercentage/cnt;
                        objModel["calculatedPercentage"]	 =	calculatedPercentage;
                        break;
                    case "Grammar":
                        cnt	=	0;
                        for(var key = 0; key < objData.length; key++) {	
                            if(typeof objData[key] != "undefined") {
                                var studentArr = _.where(objStudentListJsonData.Content, {UserID: objData[key].StudentID});					
                                if(sItemType == "studyplan") {
                                    calculatedPercentage	+=	(parseInt(objData[key].FinalScore) / (parseInt(objData[key].ItemMaxScore)) * 100);
                                    objModel["parentType"]	 =	"Grammar";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";						
                                }
                                cnt++;
                            }
                        }
                        calculatedPercentage	=	calculatedPercentage/cnt;
                        objModel["calculatedPercentage"]	 =	calculatedPercentage;
                        break;
                    case "Writing":
                        cnt	=	0;
                        for(var key = 0; key < objData.length; key++) {
                            if(typeof objData[key] != "undefined") {
                                var studentArr = _.where(objStudentListJsonData.Content, {UserID: objData[key].StudentID});					
                                if(sItemType == "paragraph") {
                                    calculatedPercentage	+=	((parseInt(objData[key].FinalScore) / 4) * 100);
                                    objModel["parentType"]	 =	"Writing";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";
                                }

                                if(sItemType == "essay") {
                                    calculatedPercentage	+=	((parseInt(objData[key].FinalScore) / 6) * 100);
                                    objModel["parentType"]	 =	"Writing";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";
                                }						
                                cnt++;	
                            }			
                        }
                        calculatedPercentage	=	calculatedPercentage/cnt;
                        objModel["calculatedPercentage"]	 =	calculatedPercentage;		
                        break;
                    case "Benchmark":
                        cnt	=	0;
                        for(var key = 0; key < objData.length; key++) {	
                            if(typeof objData[key] != "undefined") {                            
                                var studentArr = _.where(objStudentListJsonData.Content, {UserID: objData[key].StudentID});					 
                                if(sItemType == "unitbenchmark") {
                                    calculatedPercentage	+=	((parseInt(objData[key].FinalScore) / objData[key].ItemMaxScore) * 100);
                                    objModel["parentType"]	 =	"Benchmark";
                                    objModel["type"]		 =	sItemType;
                                    objModel["ItemID"]		 =	objData[key].ItemID;
                                    objModel["StudentId"]	 =	objData[key].StudentID;
                                    objModel["StudentName"]	 =	(studentArr.length) ? studentArr[0].UserDisplayName : "";
                                }
                                cnt++;
                            }
                        }
                        calculatedPercentage	=	calculatedPercentage/cnt;
                        objModel["calculatedPercentage"]	 =	calculatedPercentage;
                        break;
                    case "default":
                        //	Do Nothing
		}
		
		return objModel;
	}	
 };
 
 /**
  *	Calculate Warning Formulas
  * @param {Object} benchMark  
  * @param {Int} calculatedPercentage
  * @return {Object} objWarning
  */
 PerformanceView.getStudentWarningDetails	=	function (benchMark, calculatedPercentage) {
	
	var objWarning 	= null;
	var sWarningTitle	=	null;
	var	sWarningMsg	= null;	
	
	for(var key in benchMark) {					
		_benchMarkKey	=	key.split("-");
		if(_benchMarkKey.length == 1) {
			if(calculatedPercentage < parseInt(_benchMarkKey[0])) {						
				sWarningTitle	=	benchMark[key].warnings.lowscore.title;
				sWarningMsg		=	benchMark[key].warnings.lowscore.message;
			}
		}
		
		// if(_benchMarkKey.length > 1) {
			// if(calculatedPercentage >= parseInt(_benchMarkKey[0]) && calculatedPercentage <= parseInt(_benchMarkKey[1])) {				
				// sWarningTitle	=	benchMark[key].warnings.lowscore.title;
				// sWarningMsg		=	benchMark[key].warnings.lowscore.message;
			// }
		// }
	}
	
	objWarning = {
		"sWarningTitle":	sWarningTitle,
		"sWarningMsg":	sWarningMsg		
	}
		
	return objWarning;
 };
 
 /**
  *	Get Unique value From a Array of Json Object
  * @param {Object} pobjData  
  * @param {String} psKeyName
  * @return {Object} objResult
  */
 PerformanceView.getUniqueValue = function (pobjData, psKeyName) {	
 
	var lookup = {};
	var items = pobjData;
	var objResult = [];
	
	for (var item, i = 0; item = items[i++];) {
	  var key = item[psKeyName];
	  if (!(key in lookup)) {
		lookup[key] = 1;
		objResult.push(key);
	  }
	}
	
	return objResult;
}

/**
  *	Method for checking current version is greater than older version not
  * @param {String} sAppCurVer  
  * @param {String} sAppOldVer
  * @return {boolean} bFound
*/
var isSkillReportVisible = function (sAppCurVer, sAppOldVer, sAppPlatform) {
	if(typeof sAppCurVer =='undefined') {
		return false;	
	}
	var bFound = false,
		sCurVer = new String(),
		sOldVer = new String(),
		aAppCurVer = sAppCurVer.split("."),
		aAppOldVer = sAppOldVer.split("."),
		iLoopCounter = (aAppOldVer.length > aAppCurVer.length) ? aAppOldVer.length : aAppCurVer.length;
	
	if(
		typeof sAppPlatform != "undefined" && 
		sAppPlatform == "webclient"
	){
		bFound= true;
		return bFound;
	}
	
	
	for (var iCnt = 0; iCnt < iLoopCounter; iCnt++) {
		sCurVer += (isNaN(parseInt(aAppCurVer[iCnt])) && (typeof aAppCurVer[iCnt] == "undefined")) ? '0' : aAppCurVer[iCnt].toString();
		sOldVer += (isNaN(parseInt(aAppOldVer[iCnt])) && (typeof aAppOldVer[iCnt] == "undefined")) ? '0' : aAppOldVer[iCnt].toString();
	}
	
	if(parseInt(sOldVer) < parseInt(sCurVer)) {
		bFound= true;
	}
	
	return bFound;
};

function UnitWeekInfo (piMaxUnits, paData) {
	this.import4mDB(piMaxUnits, paData);
}

UnitWeekInfo.prototype = new Array();
// UnitWeekInfo.prototype.contructor = UnitWeekInfo;
UnitWeekInfo.prototype.toString = function () {
	var str = '[';
	
	for (var iI = 0; iI < this.length; iI++) {
		str += ((str.length > 1? ',\n    ': '\n    ') + JSON.stringify(this[iI]));
	}
	str += '\n]';
	
	return str;
};

UnitWeekInfo.prototype.import4mDB = function (piMaxUnits, paData) {
	var aUnitWeekDetails = paData;
	for (var iI = 0; iI < aUnitWeekDetails.length; iI++) {
		var iJ = 0,
			iUnit = parseInt(aUnitWeekDetails[iI].first()),
			iWeeks = parseInt(aUnitWeekDetails[iI].last());
		
		if (
			(iUnit <= 0) ||
			(
				piMaxUnits > 0 &&
				iUnit > piMaxUnits	// IPP-4191: beyond the range of max units
			)
		) {
			continue;
		}
		
		for (iJ = 0; iJ < this.length; iJ++) {
			if (this[iJ].unit > iUnit) {
				break;
			}
		}
		
		if (iJ == this.length) {
			this.push({
				'unit':		iUnit,
				'weeks':	iWeeks
			});
			continue;
		}
		
		this.splice(iJ, 0, { 'unit': iUnit, 'weeks': iWeeks });
	}
};

UnitWeekInfo.prototype.getMaxUnit = function () {
	var iMaxUnit = -1;
	
	for (var iI = 0; iI < this.length; iI++) {
		if (iMaxUnit < this[iI].unit) {
			iMaxUnit = this[iI].unit;
		}
	}
	
	return iMaxUnit;
};

UnitWeekInfo.prototype.getMinUnit = function () {
	var iMinUnit = 9007199254740992;
	
	for (var iI = 0; iI < this.length; iI++) {
		if (iMinUnit > this[iI].unit) {
			iMinUnit = this[iI].unit;
		}
	}
	
	return (
		(iMinUnit === 9007199254740992)?
		-1:
		iMinUnit
	);
};

UnitWeekInfo.prototype.getWeeks4Unit = function (piUnit) {
	for (var iI = 0; iI < this.length; iI++) {
		if (this[iI].unit === piUnit) {
			return this[iI].weeks;
		}
	}
	
	return -1;
};

UnitWeekInfo.prototype.getWeeksPerUnit = function () {
	var oData = {};
	
	for (var iI = 0; iI < this.length; iI++) {
		oData[this[iI].unit.toString()] = this[iI].weeks.toString();
	}
	
	return oData;
};

UnitWeekInfo.prototype.getTotalWeeks = function () {
	var iTotalWeeks = 0;
	
	for (var iI = 0; iI < this.length; iI++) {
		iTotalWeeks += this[iI].weeks;
	}
	
	return iTotalWeeks;
};

UnitWeekInfo.prototype.getUnit4mWeeks = function (piWeek, pbDebug) {
	var iMinWeek, iMaxWeek, iUnit;
	
	if (typeof pbDebug !== 'boolean') {
		pbDebug = false;
	}
	
	if (pbDebug === true) {
		console.log('=================================================\nParam: ' + piWeek);
		console.log(this.toString());
	}
	
	for (var iI = 0; iI < this.length; iI++) {
		iUnit = this[iI].unit;
		if (iMinWeek === undefined) {
			iMinWeek = 0;
		}
		else {
			iMinWeek = iMaxWeek;
		}
		iMaxWeek = iMinWeek + this[iI].weeks;
		if (pbDebug === true) {
			console.log(iMinWeek + ' <= ' + piWeek + ' => ' + (iMinWeek <= piWeek) + ' && ' + piWeek + ' <= ' + iMaxWeek + ' => ' + (piWeek <= iMaxWeek));
		}
		if (iMinWeek <= piWeek && piWeek <= iMaxWeek) {
			if (pbDebug === true) {
				console.log('Return Value: ' + iUnit + '\n=================================================');
			}
			return iUnit;
		}
	}
	if (pbDebug === true) {
		console.log('Return Value: ' + iUnit + '\n=================================================');
	}
	return iUnit;
};

UnitWeekInfo.prototype.getCumulativeWeeks = function (piUnit, piWeek, pbDebug) {
	if (typeof pbDebug !== 'boolean') {
		pbDebug = false;
	}
	
	if (pbDebug === true) {
		console.log('=================================================');
		console.log('Unit: ' + piUnit + ', Week: ' + piWeek);
	}
	
	var iWeeks = (isNaN(piWeek = parseInt(piWeek))? 0: piWeek);
	piUnit = (isNaN(piUnit = parseInt(piUnit))? 1: piUnit);
	for (var iI = 0; iI < this.length; iI++) {
		if (pbDebug === true) {
			console.log(piUnit + ' <= ' + this[iI].unit + ' => ' + (piUnit <= this[iI].unit));
		}
		if (piUnit <= this[iI].unit) {
			break;
		}
		if (pbDebug === true) {
			console.log(iWeeks + ' += ' + this[iI].weeks + ' => ' + (iWeeks + this[iI].weeks));
		}
		iWeeks += this[iI].weeks;
	}
	if (pbDebug === true) {
		console.log('Return Value: ' + iWeeks + '\n=================================================');
	}
	return iWeeks;
};