	/* getSnapshotDataService service */
	myApp.service('getSnapshotDataService', function($rootScope,UnitWeekInfo){
		var oSelf = {
		getPlateformCheck:function(){
			objPlatform = oPlatform;
					if(objPlatform.isIOS()) {
						loadJS('js/NativeBridge.js', GetPerformanceInfo);
					}
					else {
						GetPerformanceInfo();
					}
					
					if(oPlatform.isAndroid ()){
						$("html").css({"-webkit-overflow-scrolling": "touch"});
					}
					oSelf.performanceInfoCheck();
		},
		performanceInfoCheck : function(){
				if (objPerformanceInfoJsonData != null) { 
					var sPerformanceInfoJsPath = 'js/Performance_info_20.js';
					// Feed in Unit, Week Details 
					$GLOBALS.set('UnitWeekDetails', new UnitWeekInfo(
						parseInt(objPerformanceInfoJsonData.totalUnits) || 0,
						JSON.parse(objPerformanceInfoJsonData.unitsWeeksDetails))
					);
					// End Feed in Unit, Week Details
					loadJS(sPerformanceInfoJsPath, oSelf.performanceInfoJsLoaded);
				}
				else {
					setTimeout(oSelf.performanceInfoCheck, 500);
				}
			},

			performanceInfoJsLoaded :  function () {
				if (objPerformanceInfoData != null) {
					GetStudentListInfo();
					setTimeout(oSelf.scheduleCheck, 200);
				}
				else {
					setTimeout(function() {
						oSelf.performanceInfoCheck();
					}, 500);
				}
			},
			scheduleCheck : function() {
						if (objStudentListJsonData != null) {
							try{
								if (objStudentListJsonData.Status == "200" || objStudentListJsonData.Status == 200) {
									if (objStudentListJsonData.Content.length > 0) {
										var studId = [],
											studentId = "";
										for(i=0; i < objStudentListJsonData.Content.length-1; i++) {
											if(objStudentListJsonData.Content[i].UserRole == "S") {
												studId.push(objStudentListJsonData.Content[i].UserID);
											}
										};
										studentId = studId.join(",");
										GetLibraryProgressDetailForClass();
										setTimeout(function() {
											oSelf.libraryProgressCheck();
										}, 200);
									}
									else{
										throw({"ErrorCode":"","ErrorUserDescription":"No student exist in this class."});
									}
								} else {
									throw(objStudentListJsonData.Error);
								}
							}
							catch (err){
								if (err.ErrorCode != "U1065") {
									$scopeView._alert({
										divId:		'dialog-message',
										title:		'Alert!',
										message:	err.ErrorUserDescription
									});
								}
							}
						} else {
							setTimeout(oSelf.scheduleCheck, 100);
						}
			},
			libraryProgressCheck : function() {
						if (objLibraryProgressDetailForClass != 0) {
							
							try{ 
								if (objLibraryProgressDetailForClass.Status == "200" || objLibraryProgressDetailForClass.Status == 200) {
									var unitRange = _.range(1, parseInt(objPerformanceInfoJsonData.totalUnits) + 1, 1);
									GetAssignmentListInfo(unitRange);
									setTimeout(function() {
										oSelf.assignmentListCheck();
									}, 200);
								} else {
									throw(objLibraryProgressDetailForClass.Error);
								}
							}
							catch (err){
								if (err.ErrorCode != "U1065") { alert(err.ErrorUserDescription);
									/* PerformanceView._alert({
										divId:		'dialog-message',
										title:		'Alert!',
										message:	err.ErrorUserDescription
									}); */
								}
							}
						} else {
							setTimeout(libraryProgressCheck, 200);
						}
			},
			assignmentListCheck : function() {
						if (objAssignmentListJsonData != null) {
						
							try {
								if (objAssignmentListJsonData.Status == "200" || objAssignmentListJsonData.Status == 200) {						
									GetGradebookForInstructorV2("Unit", "all", false, null);
									setTimeout(oSelf.gradeBookInstructorV2Check, 200);							
								}
								else {
									throw(objAssignmentListJsonData.Error);
								}	
							} 
							catch (err) {
								if (err.ErrorCode != "U1065") {
									$scopeView._alert({
										divId:		'dialog-message',
										title:		'Alert!',
										message:	err.ErrorUserDescription
									});
								}
							}
						} else {
							setTimeout(function() {
								oSelf.assignmentListCheck();
							}, 500);
						}
			},
			gradeBookInstructorV2Check : function() {
						if (objGradeBookV2JsonData != 0) {
							try {
								if (objGradeBookV2JsonData.Status == "200" || objGradeBookV2JsonData.Status == 200) {
									var aItemAttemptIds = _.map(objGradeBookV2JsonData.Content.GradeBookData, function (obj) {
																return {
																	IAID: obj.IAID,
																	ARID: obj.ARID
																};
															});
									GetGradebookAttemptData(aItemAttemptIds);
									setTimeout(oSelf.gradebookAttemptDataCheck, 200);
								}
								else{
									throw(objGradeBookV2JsonData.Error);
								}
							}
							catch(err){
								if (err.ErrorCode != "U1065") {
									$scopeView._alert({
										divId:		'dialog-message',
										title:		'Alert!',
										message:	err.ErrorUserDescription
									});
								}
							}
						} else {
							setTimeout(oSelf.gradeBookInstructorV2Check, 100);
						}
			},
			gradebookAttemptDataCheck : function() {
					if (objGradeBookJsonData != 0) {
						//GetClassUserLevel();
						GetClassSettings();
						//setTimeout(classUserLevelCheck, 200);	
						setTimeout(oSelf.getClassSettingsDataCheck, 1000);	
						//alert(1);
					} else {
						setTimeout(oSelf.gradebookAttemptDataCheck, 100);
						//setTimeout(gradebookAttemptDataCheck, 100);
					}
			},
			getClassSettingsDataCheck : function() { 
				if (objSettingsData != 0) { 
					GetClassUserLevel();
					setTimeout(oSelf.classUserLevelCheck, 1000);	
				} else {
					setTimeout(oSelf.getClassSettingsDataCheck, 1000);
				}
			},
			classUserLevelCheck : function() {
				if (objGetClassUserLevel != 0) {
					try {
						if (objGetClassUserLevel.Status == "200" || objGetClassUserLevel.Status == 200) {
							GetCurrentWeekForClass();
							setTimeout(oSelf.currentWeekCheck, 100);	
						}
						else{
							throw(objGetClassUserLevel.Error);
						}
					}
					catch(err){
						if (err.ErrorCode != "U1065") {
							$scopeView._alert({
								divId:		'dialog-message',
								title:		'Alert!',
								message:	err.ErrorUserDescription
							});
						}
					}
				} else {
					setTimeout(oSelf.classUserLevelCheck, 100);
				}
			},
			currentWeekCheck  : function() {
				if(objCurrentWeekJsonData != null){
					try {   
							if (objCurrentWeekJsonData.Status == "200" || objCurrentWeekJsonData.Status == 200) {
								onPageLoadComplete(VIEWTYPE.c_s_TEACHER_SNAPSHOT);
								 $rootScope.$broadcast('dataComplete',oSelf);
								}
							else{
								throw(objCurrentWeekJsonData.Error);
							}
						}
						catch(err){
							if (err.ErrorCode != "U1065") {
								$scopeView._alert({
									divId:		'dialog-message',
									title:		'Alert!',
									message:	err.ErrorUserDescription
								});
							}
						}
				}else {
					setTimeout(oSelf.currentWeekCheck, 100);
				}
			}
		}
		return oSelf;	
	});
	/* getSnapshotDataService service */

	/* SnapshotCtrl controller */
	myApp.controller('SnapshotCtrl', function ($scope,$rootScope, $route, $location,$timeout, getSnapshotDataService, UnitWeekInfo) {
	
	// define constants
	$scope.CONSTANTS = {
		"c_s_LEXILE_LEVEL_TITLE": "Lexile Level",
		"c_s_ORAL_FLUENCY_TITLE": "Oral Fluency",
		"c_s_TIME_SPENT_READING_TITLE": "Time Spent Reading",
		"c_s_READING_COMPREHENSION_TITLE": "Reading Comp.",
		"c_s_GLE_TITLE": "Gle",
		"c_s_BOOK_READ_TITLE": "Books Read",
		"c_s_PROJECT_TXT": "Project",
		"c_s_AT_A_GLANCE_TXT": "At a Glance",
		"c_s_ALL_PARENTS_TXT": "All Parents",
		"c_s_DROPPABLE_CONTAINER":".text-center",
		"c_s_DRAGGABLE_TEXT_CONTAINER":".snap-graph-dgotext",
		"c_s_VIEWTYPE" : "teacher_snapshot",
		"c_s_GRAPFH_LINE_COLOR": [ '#3366cc', '#444444','#cc33cc'],
		"c_s_LBL_READING_LEVEL_YAXIS_TXT": "Level",
		"c_s_LBL_GLE_YAXIS_TXT": "Gle",
		"c_s_PERFORMANCE_INFO_JS_PATH" : 'js/$scope_info_20.js',
		"c_s_LABEL_MARKS" : 'Percentage Score',
		"c_s_LABEL_TIME_SPENT_MARKS" : 'Time spent Reading',
		"c_s_LABEL_BOOKS_READ_MARKS" : 'Books Read',
		"c_s_LABEL_GLE_MARKS" : 'Gle',
		"c_s_LBL_READING_COMPREHENSION": "reading_comp",
		"c_s_LBL_IWT" : "iwt",
		"c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE" : "iwthighlightslide_iwtdndslide",
		"c_s_READING_CHECKPOINT_MAX_SCORE": 2,
		"c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT": 100,
		"c_s_SUMMARY_WRITING_MAX_SCORE": 100,
		"c_s_READING_CHECKPOINT_MAX_PERCENT": 100,
		"c_s_LBL_IWT_SUMMARY_SLIDE": "iwtsummaryslide",
		"c_s_LBL_IWT_TEXTANSWER_SLIDE": "iwttextanswerslide",
		"c_s_WCPM": "wcpm",
		"c_s_SCORED_STATUS": 'scored',
		"c_s_ORAL_FLUENCY": "oral_fluency"
	};

	$scope.idxBenchmark = null;
	$scope.xAxistitle = "Weeks";
	$scope.xAxisMax = null;
	$scope.xAxisMin = null;
	$scope.xAxisTickInterval = null;

	$scope.yAxistitle = null;
	$scope.yAxisMax = null;
	$scope.yAxisMin = null;
	$scope.yAxisTickInterval = null;
	$scope.currentWeekNo = null;

	$scope.GleChartOptions = {};
	$scope.LexileChartOptions = {};
	$scope.ReadingCompChartOptions = {};
	$scope.TimeSpendChartOptions = {};
	$scope.BookReadChartOptions = {};
	$scope.OralFluencyChartOptions = {};
	$scope.oLebelConfig = {};
	$scope.aPlotLines = [];
	$scope.studentDataPoints = ['Gle','currentLexileLevel','currentReadingLevel','StarCount','period%'];
	$scope.isModalVisible = false;
	$scope.iLessonsPerWeek = 5;
	$scope.graphIndex = [5,6];

	$scope.aTooltip = [];	
	$('.max-width-1024').hide();
	
	/* end of constants */
	
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
	
	getSnapshotDataService.getPlateformCheck();
	
	$rootScope.$on('dataComplete', function(evt,data) {
	
		$scope.unitDetails = objPerformanceInfoJsonData;
		$scope.performanceInfoData = objPerformanceInfoData;
		$scope.studentListData = objStudentListJsonData.Content;
		$scope.assignmentListData = objAssignmentListJsonData.Content;
		$scope.gradeBookData = (objGradeBookJsonData == 0) ? 0 : objGradeBookJsonData.Content;
		$scope.classLibraryProgressData = (objLibraryProgressDetailForClass == 0) ? 0 : objLibraryProgressDetailForClass.Content;
		$scope.classUserLevelDetails = (objGetClassUserLevel == 0) ? 0 : objGetClassUserLevel.Content;
		$scope.classSettingDetails = (objSettingsData == 0) ? 0 : objSettingsData.Content;
		$scope.currentWeekNo = (objCurrentWeekJsonData == 0) ? 1 : objCurrentWeekJsonData.Content.WeekNo;
		$scope.getAllStudents();
		$scope.prepareGraphData();
		
		$timeout(function(){
			$scope.$broadcast('displayGraph');
			$('.max-width-1024').show();
			oUtility.hideLoader();
		}, 500);
		
	 });

	var aMasterData = [],
	aFilters = {};
	$scope.getAllStudents = function(){
		$scope.selectedStudents = {};
		var dataMarker = $scope.studentDataPoints[$scope.classSettingDetails.StudentDataSnapshot];
		
		for(var iIdx = 0; iIdx < $scope.studentListData.length; iIdx++){
			if( $scope.studentListData[iIdx].UserRole == "S"){
				$scope.selectedStudents[ $scope.studentListData[iIdx].UserID] = {};
				
				$scope.selectedStudents[ $scope.studentListData[iIdx].UserID] = 
				{	
					'name' : $scope.studentListData[iIdx].UserDisplayName,
					'currentReadingBookId' : $scope.studentListData[iIdx].UserCurrentReadingBookID,
					'currentReadingLevel' :   $scope.studentListData[iIdx].UserCurrentReadingLevel,
					'currentLexileLevel' :   $scope.studentListData[iIdx].UserCurrentLexileLevel,
					'StarCount' :   $scope.studentListData[iIdx].UserStarCount,
					'Gle' : $scope.calculateGLE(parseInt($scope.studentListData[iIdx].UserCurrentLexileLevel),$scope.currentWeekNo),
					'DataPointValue' : ((dataMarker == 'Gle') ? $scope.calculateGLE(parseInt($scope.studentListData[iIdx].UserCurrentLexileLevel),$scope.currentWeekNo) : ((dataMarker == 'currentReadingLevel') ? $scope.studentListData[iIdx].UserCurrentReadingLevel : ((dataMarker == 'currentLexileLevel') ? $scope.studentListData[iIdx].UserCurrentLexileLevel  : ((dataMarker == 'StarCount') ? $scope.studentListData[iIdx].UserStarCount : "" ) ) ))

				};
				
			}
		}
		
	};

	$scope.prepareGraphData = function () { // Method 2 & 3
			aMasterData = [];
			// Prepare Master data from GradeBook JSON
		
			if ($scope.gradeBookData != null) {
				for (var iIdx = 0; iIdx < $scope.gradeBookData.length; iIdx++) {
					var oItem = $scope.gradeBookData[iIdx];
					if (oItem['ICS'] != $scope.CONSTANTS.c_s_SCORED_STATUS) {
						continue;
					}
					
					var sStudentId = oItem['SID'],
						oData = {
							'StudentId':				sStudentId,
							'StudentName':				$scope.selectedStudents[sStudentId]['name'],
							'ItemID':					oItem['IID'],
							'ItemAttemptID':			oItem['IAID'],
							'FinalScore':				oItem['FS'],
							'ItemMaxScore':				oItem['IMS'],
							'ItemAttemptSummary': 		oItem['IAS'],
							'InstructorScoreRubric': 	oItem['ISR'],
							'PKTOralFluencyScore': 		oItem['OFR']
						},
						aAssignmentData = _.where($scope.assignmentListData, {ItemID: oItem['IID']});
						
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
						oData['ItemCategory'] 		= oAssignmentData['ItemCategory'];
						
						// Start: following code block for Weekly Reading Check. 
						// generate unit number & week number from assessment name 
						// like 1.20 Weekly Reading Check so unit number is 1, week number is 4, & lesson number is 20
						/* if (oAssignmentData['ItemSubType'] == 'wrc') { */
						   if (oAssignmentData['ItemCategory'] == 'wrc') {						
							var aAssessmentName = oAssignmentData['ItemName'].split(" "),
								aAssessmentUnitWeek = aAssessmentName[0].split("."),
								iAssessmentWeek = (Math.round(aAssessmentUnitWeek[1]) > 0) ? Math.round(aAssessmentUnitWeek[1])/5 : 1;
							oData['WeekNumber'] = iAssessmentWeek;
						}
						// End: following code block for Weekly Reading Check
						
						// Subject Search Key
						/* switch (oAssignmentData['ItemSubType']) { */
						switch (oAssignmentData['ItemCategory']) {
							case 'iwt':
							case 'wrc':
							case 'paragraph':
							case 'libraryresponseprompt':
							case "wordstudypractice":
							case "wordreading":
							case "wordstudyreader":
							/* case 'essay': */
							case 'word_slam':
							case 'unitbenchmark':
								//oData['SubjectSearchKey'] = oAssignmentData['ItemSubType'];
								oData['SubjectSearchKey'] = oAssignmentData['ItemCategory'];
								break;
							case 'studyplan':
								oData['SubjectSearchKey'] = oAssignmentData['ItemSubject'];
								break;
						}
						/* if(oData['ItemCategory'] == "wordreading"){
							var check4doublevalue = _.where(aMasterData,{'SubjectSearchKey' : "wordreading","WeekNumber" : oAssignmentData['WeekNumber'] ,"StudentId" :sStudentId });
							if(check4doublevalue.length == 0) {
							 aMasterData.push(oData);	
							}
						}else{ */
							aMasterData.push(oData);
						/* } */
					}
				}
			}
			
			// End: Prepare Master data from GradeBook JSON
			
			// Prepare Master data from GetLibraryProgressDetailForClass JSON
			
			if ($scope.classLibraryProgressData != 0) {
				for (var iIdx = 0; iIdx < $scope.classLibraryProgressData.length; iIdx++) {
					var oItem =$scope.classLibraryProgressData[iIdx];
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
							wordVal = wordVal.toString();
							getWeek = (oItem['BookCompletedDate'] != "" ) ? $scope.calculateWeek(objPerformanceInfoJsonData.classStartDate, oItem['BookCompletedDate']) : "";
							oData = {
								'StudentId':				sStudentId,
								'StudentName':				$scope.selectedStudents[sStudentId]['name'],
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
								'WordCount':				parseInt(wordVal.split("|")[0]),
								'TimeCount':				( typeof wordVal.split("|")[1] === "undefined" ) ? 10 : 300/* parseInt(wordVal.split("|")[1]) */,
								'BookCompleted' : 			oItem['BookCompleted'],
								'BookCompletedWeek' : 		getWeek,
								'BookComplete' : 			(oItem['BookCompleted'] == true) ? 1 : 0
								
							};

						// Subject Search Key
						//console.log(aInfo[2]);
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
			if ($scope.classUserLevelDetails != 0) {
				for (var iIdx = 0; iIdx < $scope.classUserLevelDetails.length; iIdx++) {
					var oItem = $scope.classUserLevelDetails[iIdx];
					//console.log(oItem);
					if (
						typeof oItem['UserLexileLevelDetails'] == 'undefined' || 
						oItem['UserLexileLevelDetails'] == '' ||  
						oItem['UserLexileLevelDetails'] == null 
					) {
						continue;
					}
					
					var sStudentId = oItem['StudentId'],
						aUserLexileLevelDetails = (typeof oItem['UserLexileLevelDetails'] == 'string') ? JSON.parse(decodeURIComponent(oItem['UserLexileLevelDetails'])) : oItem['UserLexileLevelDetails'],
						aUserReadingLevelDetails = (typeof oItem['UserReadingLevelDetails'] == 'string') ? JSON.parse(decodeURIComponent(oItem['UserReadingLevelDetails'])) : oItem['UserReadingLevelDetails'];
					//console.log(aUserLexileLevelDetails);
					//console.log(aUserReadingLevelDetails);
					
					//console.log("aUserLexileLevelDetails: " + aUserLexileLevelDetails.length);
					$.each(aUserLexileLevelDetails, function (iKey, oVal) {
						//console.log(oVal);
						var iDataUnitNumber = (typeof oVal["UN"] != "undefined") ? oVal["UN"] : oVal["U"], 
							iDataWeekNumber = (typeof oVal["W"] != "undefined") ? oVal["W"] : 1, 
							iDataLexileLevel = (typeof oVal["LL"] != "undefined") ? oVal["LL"] : oVal["L"],  
							iDataReadingLevel = (typeof aUserReadingLevelDetails[0]["RL"] != "undefined") ? aUserReadingLevelDetails[0]["RL"] : oVal["R"],  
							oData = {
								'StudentId':				sStudentId,
								'StudentName':				$scope.selectedStudents[sStudentId]['name'],
								'ItemID':					'',
								'FinalScore':				0,
								'lexileLevel':				parseInt(iDataLexileLevel),
								'readingLevel':				parseInt(iDataReadingLevel),
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
			// get Writing Data
			$scope.writingData = _.where(aMasterData, {SubjectSearchKey: "libraryresponseprompt"});
			
			// get foundational reading data
			$scope.fdReadData = _.where(aMasterData, {SubjectSearchKey: "wordreading"});
			
			// get phonics data
			$scope.wsrData = _.where(aMasterData, {SubjectSearchKey: "wordstudypractice"});
			
			$scope.wspData = _.where(aMasterData, {SubjectSearchKey: "wordstudyreader"});
			
			
			// prepare data for GLE
			var gleData = _.where(aMasterData, {SubjectSearchKey: "reading_level"});
			$scope.getGleGraphData(gleData);
			
			// prepare data for lexile 
			$scope.getLexileGraphData(gleData);
			
			// prepare data for Reading Comprehension
			var readingCompData = _.where(aMasterData, {SubjectSearchKey: "iwt"});
			$scope.getReadingCompGraphData(readingCompData);
			
			//prepare data for book read
			var readingBookData = _.where(aMasterData, {SubjectSearchKey: "word_count_ttr"});
			$scope.getBookReadData(readingBookData);
			
			//console.log(readingBookData);
			//prepare data for time spent
			$scope.getTimeSpentData(readingBookData);
			
			
			// prepare data for oral fluency
			var oralFluencyData = _.where(aMasterData, {ItemSubject: "pktof"});
			//console.log(aMasterData);
			$scope.getOralFluencyData(oralFluencyData);
			//console.log(gleData);
			//console.log(readingCompData);
			
			
		};
	$scope.getBookReadData = function (aDataset) {
		
		aGraphPlottingSeries = [];
		$scope.idxBenchmark = 2;
		$scope.oLebelConfig = {
			enabled: true,
			formatter: function () {				
				return this.value;
			}
		};
		$scope.readingBookCompletedData = aDataset;
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		// y axis values
		$scope.yAxisMin = 0;
		$scope.yAxisMax = 50;
		$scope.yAxisTickInterval = 10;
		$scope.yAxistitle = $scope.CONSTANTS.c_s_LABEL_BOOKS_READ_MARKS;
		
		
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_BOOK_READ_TITLE;
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
		var oRecord = aDataset[iIdx],
			sParameter = oRecord['SubjectSearchKey'],
			iJdx = 0;
		for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
			if (aGraphPlottingSeries[iJdx].name == sParameter) {

				if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']] != "undefined") {
					if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']][oRecord['StudentId']] != "undefined") {
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']][oRecord['StudentId']] += oRecord['BookComplete'];
						break;
					} 
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']][oRecord['StudentId']] = oRecord['BookComplete'];
					break;
				}
				if(
					typeof oRecord['BookComplete'] != "undefined" &&  
					parseInt(oRecord['BookComplete']) > 0
				){
					// checking if data value is greater than 0
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']] = {};
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']][oRecord['StudentId']] =  parseInt(oRecord['BookComplete']);
				}
				break;
			}
		}
		if (iJdx == aGraphPlottingSeries.length) {
			if(
				typeof oRecord['BookComplete'] != "undefined" &&  
				parseInt(oRecord['BookComplete']) > 0
			){
				// checking if data value is greater than 0
				aGraphPlottingSeries.push({
					name:	sParameter,
					data:	{}
				});
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']] = {};
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['BookCompletedWeek']][oRecord['StudentId']] =  oRecord['BookComplete'];
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
			
			$scope.yAxisMax = (iPrevWordCount > $scope.yAxisMax) ? (iPrevWordCount+10) : $scope.yAxisMax;
			// Formula to generate Lesson from Unit & Week is following 
			// Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )
			
			var dataObj = {},
				yValue = iPrevWordCount,
				iUnit = parseInt(sUW.split('-').first()),
				iWeek = parseInt(sUW.split('-').last()),
				
				xValue = $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) * $scope.iLessonsPerWeek;
			
			dataObj.y = yValue;
			dataObj.x = xValue;
			
			aData.push(dataObj); 
		}
		
		aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_BOOK_READ_TITLE;
		aGraphPlottingSeries[iIdx].data = aData;
		aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
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
				xValue = jIdx,
				markerColorCode = $scope.markerColor(yValue);
			objPrevVal = yValue;
			dataObj.y = yValue[0].y;
			dataObj.x = xValue;
			dataObj.color = markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */;
			dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
			dataObj.lineWidth = 2;
			dataObj.marker = {
				symbol:'circle',
				radius:4,
				lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
				lineWidth:2,
				states:{
					hover:{
						enabled:true,
						fillColor: markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					},
					select:{
						enabled:true,
						fillColor: markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					}
				}
			};
			aData.push(dataObj);
		}
		aGraphPlottingSeries[iIdx].data = aData;
	});

	$scope.aTooltip = {
		shared: false,
		useHTML: true,
		valueDecimals: 0,
		formatter: function () {
			return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +this.point.y+ '</td></tr></table>';
		}		
	},
	$scope.aPlotLines = [];

	//console.log(aGraphPlottingSeries);
	$scope.BookReadChartOptions = $scope.plotGraph();
	};

	$scope.getTimeSpentData = function (aDataset) {
		aGraphPlottingSeries = [];
		
		$scope.idxBenchmark = 2;
		$scope.oLebelConfig = {
			enabled: true,
			formatter: function () {				
				return this.value;
			}
		};
		
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		// y axis values
		$scope.yAxisMin = 0;
		$scope.yAxisMax = 12;
		$scope.yAxisTickInterval = 1;
		$scope.yAxistitle = $scope.CONSTANTS.c_s_LABEL_TIME_SPENT_MARKS;
		
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_TIME_SPENT_READING_TITLE;
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
		var oRecord = aDataset[iIdx],
			sParameter = oRecord['SubjectSearchKey'],
			iJdx = 0;
		for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
			if (aGraphPlottingSeries[iJdx].name == sParameter) {

				if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] != "undefined") {
					if (typeof aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] != "undefined") {
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] += oRecord['TimeCount'];
						break;
					} 
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] = oRecord['TimeCount'];
					break;
				}
				if(
					typeof oRecord['TimeCount'] != "undefined" &&  
					parseInt(oRecord['TimeCount']) > 0
				){
					// checking if data value is greater than 0
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {};
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] =  parseInt(oRecord['TimeCount']);
				}
				break;
			}
		}
		if (iJdx == aGraphPlottingSeries.length) {
			if(
				typeof oRecord['TimeCount'] != "undefined"/*  &&  
				parseInt(oRecord['TimeCount']) > 0 */
				
			){
				// checking if data value is greater than 0
				aGraphPlottingSeries.push({
					name:	sParameter,
					data:	{}
				});
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {};
				aGraphPlottingSeries[aGraphPlottingSeries.length - 1].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']][oRecord['StudentId']] =  oRecord['TimeCount'];
			}
		}
	}
	for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
		var aData = [],
			iPrevTImeCount = 0;
			
		for (var sUW in aGraphPlottingSeries[iIdx].data) {
			var iTimeCount = 0,
				iEntries = 0;
			
			$.each(aGraphPlottingSeries[iIdx].data[sUW], function (iCnt, iVal){
				iTimeCount += Math.round(iVal);
				iEntries++;
			});
			
			iPrevTImeCount += Math.round(iTimeCount / iEntries);
			
			// Formula to generate Lesson from Unit & Week is following 
			// Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )
			$scope.yAxisMax = ((iPrevTImeCount/3600) > $scope.yAxisMax) ? ((iPrevTImeCount/3600) + 1) :  $scope.yAxisMax
			var dataObj = {},
				yValue = iPrevTImeCount/3600,
				iUnit = parseInt(sUW.split('-').first()),
				iWeek = parseInt(sUW.split('-').last()),
				
				xValue = $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) * $scope.iLessonsPerWeek;
			
			dataObj.y = yValue;
			dataObj.x = xValue;
			
			aData.push(dataObj); 
		}
		
		aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_TIME_SPENT_READING_TITLE;
		aGraphPlottingSeries[iIdx].data = aData;
		aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx];
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
				xValue = jIdx,
				markerColorCode = $scope.markerColor(yValue);
				objPrevVal = yValue;
				dataObj.y = yValue[0].y;
				dataObj.x = xValue;
				dataObj.color = markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */;
				dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
				dataObj.lineWidth = 2;
				dataObj.marker = {
					symbol:'circle',
					radius:4,
					lineColor: $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
					lineWidth:2,
					states:{
						hover:{
							enabled:true,
							fillColor: markerColorCode/* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */,
							lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
						},
						select:{
							enabled:true,
							fillColor: markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */,
							lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
						}
					}
				};
			aData.push(dataObj);
		}
		aGraphPlottingSeries[iIdx].data = aData;
	});

	$scope.aTooltip = {
		shared: false,
		useHTML: true,
		formatter: function () {
		return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +$scope.gettimeSpent(this.point.y*3600)+ '</td></tr></table>';
		},
		valueDecimals: 0
	},
	$scope.aPlotLines = [];

	//console.log("time count");
	//console.log(aGraphPlottingSeries);
	$scope.TimeSpendChartOptions = $scope.plotGraph();
	};

	$scope.getOralFluencyData = function (aDataset) {
		aGraphPlottingSeries = [];
		$scope.idxBenchmark = 6;
		
		$scope.oLebelConfig = {
			enabled: true,
			formatter: function () {
				return this.value;
			}
		};
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		sSubject = $scope.CONSTANTS.c_s_WCPM;
		$scope.yAxistitle = $scope.performanceInfoData.oralFluencyConstant[sSubject].yAxisTxtLebel;
		$scope.yAxisMin = 0;
		$scope.yAxisMax =$scope.performanceInfoData.oralFluencyConstant[sSubject].yAxisMax;
		$scope.yAxisTickInterval = 25;
		//console.log(aDataset);
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_ORAL_FLUENCY_TITLE;
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
		var oRecord = aDataset[iIdx],
			//sParameter = oRecord['SubjectSearchKey'],
			sParameter = $scope.CONSTANTS.c_s_ORAL_FLUENCY,
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
			//console.log(aGraphPlottingSeries[iIdx].data[sUW].marks);
			// Marker Colour
			var aUnitWeekDataChunks = sUW.split('-'),
				iUnit = parseInt(aUnitWeekDataChunks.first()),
				iWeek = parseInt(aUnitWeekDataChunks.last()),
				dataObj = {},
				yValue = Math.round(parseFloat(aGraphPlottingSeries[iIdx].data[sUW].marks) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries)),
				xValue = ($scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek))
				, markerColorCode = $scope.markerColor(yValue);
			
			dataObj.color = markerColorCode;
			dataObj.y = yValue;
			dataObj.x = xValue;
			dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
			dataObj.lineWidth = 2;
			dataObj.marker = {
				symbol:'circle',
				radius:4,
				lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
				lineWidth:2,
				states:{
					hover:{
						enabled:true,
						fillColor: markerColorCode/*  $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] */ /* markerColorCode */,
						lineColor: $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					},
					select:{
						enabled:true,
						fillColor: markerColorCode /* $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[iIdx] *//* markerColorCode */,
						lineColor: $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					}
				}
			};
			aData.push(dataObj); 
		}
		aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_ORAL_FLUENCY_TITLE;
		
		aGraphPlottingSeries[iIdx].data = aData;
		aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
		}

		$scope.aTooltip = {
		shared: false,
		useHTML: true,
		valueDecimals: 0,
		formatter: function () {
			return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +this.point.y+ '</td></tr></table>';
		}
		
		},
		$scope.aPlotLines = []; /* */
		$scope.OralFluencyChartOptions = $scope.plotGraph();
	}
	//data for GLE graph
	$scope.getGleGraphData =  function(aDataset){

		
		$scope.idxBenchmark = 0;
		aGraphPlottingSeries = [];
		
		$scope.oLebelConfig = {
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
		
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		// y axis values
		
		$scope.yAxistitle = $scope.CONSTANTS.c_s_LBL_GLE_YAXIS_TXT;
		$scope.yAxisMin = 0;
		$scope.yAxisMax = $scope.performanceInfoData.gradeLexileConstant.yAxisMax;
		$scope.yAxisTickInterval = 1;
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_GLE_TITLE;
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				sParameter = oRecord['SubjectSearchKey'],
				iJdx = 0;
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {
					if (aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]) {
						//console.log(parseInt(oRecord['lexileLevel'])+ "" + oRecord['readingLevel']);
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['lexileLevel'] += $scope.calculateGLE(parseInt(oRecord['lexileLevel']),oRecord['WeekNumber']);
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['entries']++;
						break;
					}
					// aGraphPlottingSeries.length - 1
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'lexileLevel':	$scope.calculateGLE(parseInt(oRecord['lexileLevel']),oRecord['WeekNumber']),
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
						'lexileLevel':	$scope.calculateGLE(parseInt(oRecord['lexileLevel']),oRecord['WeekNumber']),
						'entries':	1
					};
				}
			}
		}
		
			for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
				var aData = []
				for (var sUW in aGraphPlottingSeries[iIdx].data) {
					var fAvgGLELevel = $scope.round(
											parseFloat(aGraphPlottingSeries[iIdx].data[sUW].lexileLevel) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries), 10
										);
					if(isNaN(fAvgGLELevel) == false) {
					var dataObj = {},
						yValue = fAvgGLELevel,
						iUnit = parseInt(sUW.split('-').first()),
						iWeek = parseInt(sUW.split('-').last()),
						
						xValue = xValue = (
							(sParameter.toLowerCase() == 'unitbenchmark')?
							iUnit: 
							$scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek)
						),
						markerColorCode = $scope.markerColor(yValue);
					
					// Marker Colour
					dataObj.color = markerColorCode;
					dataObj.y = yValue;
					dataObj.x = xValue;
					dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
					dataObj.lineWidth = 2;
					dataObj.marker = {
						symbol:'circle',
						radius:4,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
						lineWidth:2,
						states:{
							hover:{
								enabled:true,
								fillColor:markerColorCode,
								lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
							},
							select:{
								enabled:true,
								fillColor:markerColorCode,
								lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
							}
						}
					};
					
					aData.push(dataObj);
					}				
				}
				
				aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_GLE_TITLE;
				aGraphPlottingSeries[iIdx].data = aData;
				aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
			}
			
			$scope.aTooltip = {
				shared: false,
				useHTML: true,
				valueDecimals: 0,
				formatter: function () {
					if (this.y > 13) {
						return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+$scope.performanceInfoData.gradeLexileConstant.yAxisMaxLebel+ '</td></tr></table>';
					}
					return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +this.point.y+ '</td></tr></table>';
					
				}
			};
			$scope.aPlotLines = [];
			//console.log(aGraphPlottingSeries);
			$scope.GleChartOptions = $scope.plotGraph();
	}

	//data for Lexile graph
	$scope.getLexileGraphData =  function(aDataset){

		
		$scope.idxBenchmark = 0;
		aGraphPlottingSeries = [];
		
		$scope.oLebelConfig = {
			enabled: true,
			formatter: function () {
				return this.value;
			}
		};
		
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		// y axis values
		
		$scope.yAxistitle = $scope.CONSTANTS.c_s_LBL_READING_LEVEL_YAXIS_TXT;
		$scope.yAxisMin = 0;
		$scope.yAxisMax = 1300;
		$scope.yAxisTickInterval = 100;
		
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_LEXILE_LEVEL_TITLE;
		
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			var oRecord = aDataset[iIdx],
				sParameter = oRecord['SubjectSearchKey'],
				iJdx = 0;
			for (iJdx = 0; iJdx < aGraphPlottingSeries.length; iJdx++) {
				if (aGraphPlottingSeries[iJdx].name == sParameter) {
					if (aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]) {
						//console.log(parseInt(oRecord['lexileLevel'])+ "" + oRecord['readingLevel']);
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['lexileLevel'] += parseInt(oRecord['lexileLevel']);
						aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']]['entries']++;
						break;
					}
					// aGraphPlottingSeries.length - 1
					aGraphPlottingSeries[iJdx].data[oRecord['UnitNumber'] + '-' + oRecord['WeekNumber']] = {
						'lexileLevel':	parseInt(oRecord['lexileLevel']),
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
						'lexileLevel':	parseInt(oRecord['lexileLevel']),
						'entries':	1
					};
				}
			}
		}
		
			for (var iIdx = 0; iIdx < aGraphPlottingSeries.length; iIdx++) {
				var aData = []
				for (var sUW in aGraphPlottingSeries[iIdx].data) {
					var fAvgLexileLevel = $scope.round(
											parseFloat(aGraphPlottingSeries[iIdx].data[sUW].lexileLevel) / parseFloat(aGraphPlottingSeries[iIdx].data[sUW].entries), 10
										);
					if(isNaN(fAvgLexileLevel) == false) {
					var dataObj = {},
						yValue = fAvgLexileLevel,
						iUnit = parseInt(sUW.split('-').first()),
						iWeek = parseInt(sUW.split('-').last()),
						xValue = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek),
						markerColorCode = $scope.markerColor(yValue);
					// Marker Colour
					dataObj.color = markerColorCode;
					dataObj.y = yValue;
					dataObj.x = xValue;
					dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
					dataObj.lineWidth = 2;
					dataObj.marker = {
						symbol:'circle',
						radius:4,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
						lineWidth:2,
						states:{
							hover:{
								enabled:true,
								fillColor:markerColorCode,
								lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
							},
							select:{
								enabled:true,
								fillColor:markerColorCode,
								lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
							}
						}
					};
					
					aData.push(dataObj);
					}				
				}
				
				aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_LEXILE_LEVEL_TITLE;
				aGraphPlottingSeries[iIdx].data = aData;
				aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
			}
			
			
			$scope.aTooltip = {
				shared: false,
				useHTML: true,
				valueDecimals: 0,
				formatter: function () {
					return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +this.point.y+ '</td></tr></table>';
				}
			};
			$scope.aPlotLines = [];
			
			$scope.LexileChartOptions = $scope.plotGraph();
			
	}

	//data for Reading Comprehension graph

	$scope.getReadingCompGraphData =  function(aDataset){
		aDataset = $scope.iwtScore($scope.CONSTANTS.c_s_LBL_READING_COMPREHENSION, aDataset);
		$scope.readingCompRubricData = aDataset;
		
		$scope.idxBenchmark = 1;
		aGraphPlottingSeries = [],
		$scope.oLebelConfig = {
			enabled: true,
			formatter: function () {
				return this.value;
			}
		};
		$scope.sGraphHeaderTitle = $scope.CONSTANTS.c_s_READING_COMPREHENSION_TITLE;
		benchMarkData = $scope.filter();
		// x axis values
		$scope.xAxisMin = $scope.iLessonsPerWeek * 1;
		$scope.xAxisMax = $scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getTotalWeeks();
		$scope.xAxisTickInterval = $scope.iLessonsPerWeek;
		
		// y axis values
		 $scope.yAxistitle = $scope.CONSTANTS.c_s_LABEL_MARKS;
		 $scope.yAxisMin = 0;
		 $scope.yAxisMax = 100;
		 $scope.yAxisTickInterval = 10;
		
		aDataset = _.reject(
			aDataset,
			function (rec) {
				return rec.ExtraPractice == "Yes"
			}
		);

	for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
		var oRecord = aDataset[iIdx],
			sParameter = oRecord['SubjectSearchKey'],
			iJdx = 0;
			// modification for ilit20
			if (
				oRecord.ItemSubType == "phonictextbasedslide" || 
				oRecord.ItemSubType == "extendedphonic" || 
				oRecord.ItemSubType == "frs"  
			) {						
				if (oRecord.ItemSubject == "pktof") {
					oRecord.ItemMaxScore = 100;
				}
			}
			// modification for ilit20
			
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
					$scope.iLessonsPerWeek * $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit, iWeek) // IPP-4027
					// ((25*(parseFloat(sUW.split('-').first()) -1)) + (parseFloat(sUW.split('-').last())*5))
				),
				markerColorCode = $scope.markerColor(yValue);
			
			dataObj.color = markerColorCode;
			dataObj.y = yValue;
			dataObj.x = xValue;
			dataObj.lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
			dataObj.lineWidth = 2;
			dataObj.marker = {
				symbol:'circle',
				radius:4,
				lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0],
				lineWidth:2,
				states:{
					hover:{
						enabled:true,
						fillColor:markerColorCode,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					},
					select:{
						enabled:true,
						fillColor:markerColorCode,
						lineColor:$scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0]
					}
				}
			};
			aData.push(dataObj); 
		}
		
		aGraphPlottingSeries[iIdx].name = $scope.CONSTANTS.c_s_READING_COMPREHENSION_TITLE;
		aGraphPlottingSeries[iIdx].data = aData;
		aGraphPlottingSeries[iIdx].lineColor = $scope.CONSTANTS.c_s_GRAPFH_LINE_COLOR[0];
	}


	$scope.aTooltip = {
		shared: false,
		useHTML: true,
		formatter: function () {
					return '<small><strong>WEEK '+this.point.x/$scope.iLessonsPerWeek+'</strong></small><table><tr><td style="color: {'+this.series.color+'}">'+this.series.name+' : ' +this.point.y+ '%</td></tr></table>';
		},
		valueDecimals: 0	
		
	},
	/* $scope.aPlotLines = [{
		color: 'red',
		width: 2,
		value: benchMarkData.minValue,
		label: {
			text: '',
			align: 'right',
			x: -10,
			y: 16
		}            
	}]; */

	//console.log(aGraphPlottingSeries);
	$scope.ReadingCompChartOptions = $scope.plotGraph();
		
	}

	// Following code block for rubric scoring of Reading Comprehension, IR, IWTHighlight, IWTDnD, Read Critically
	$scope.iwtScore = function (sGraphType, aDataset) {
		for (var iIdx = 0; iIdx < aDataset.length; iIdx++) {
			if (aDataset[iIdx].ItemSubType == $scope.CONSTANTS.c_s_LBL_IWT) {
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
						case $scope.CONSTANTS.c_s_LBL_IWT_HIGHTLIGHT_DND_SLIDE:
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
									nMaxScore += sCount * $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_SCORE;
								}
								if(objItemAttemptSummary.iwtdndslide != 'undefined'){
									var sCount = 0;
									for(var sSlide in objItemAttemptSummary.iwtdndslide) {
										if (objItemAttemptSummary.iwtdndslide.hasOwnProperty(sSlide)) {
											nFinalScore += parseFloat(objItemAttemptSummary.iwtdndslide[sSlide]);
											sCount++;
										}
									}
									nMaxScore += sCount * $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_SCORE;
								} 
								nFinalScore = Math.round((nFinalScore/nMaxScore)*100);
							}
														
							aDataset[iIdx].FinalScore = nFinalScore;
							aDataset[iIdx].ItemMaxScore = $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_PERCENT;
							break;
						
						case $scope.c_s_LBL_IWT_SUMMARY_SLIDE:
							// following IF block for latest version
							if(typeof objItemAttemptSummary.scoresummary != 'undefined'){
								var oScoresummary = JSON.parse(objItemAttemptSummary.scoresummary);
								if(typeof oScoresummary.percentile != 'undefined') {
									if(typeof oScoresummary.percentile['summary'] != 'undefined'){
										nFinalScore = parseFloat(oScoresummary.percentile['summary']);
									}
									nMaxScore = $scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
								}
							}
							// following IF block for previous version
							else if(typeof objItemAttemptSummary.percentile != 'undefined'){
								// For summary feedback slide
								if(typeof objItemAttemptSummary.percentile['summary'] != 'undefined'){
									nFinalScore = parseFloat(objItemAttemptSummary.percentile['summary']);
								}
								nMaxScore = $scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
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
									nMaxScore += sCount*$scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
								}
							}
							
							aDataset[iIdx].FinalScore = nFinalScore;
							aDataset[iIdx].ItemMaxScore = nMaxScore;
							break;
						
						case $scope.CONSTANTS.c_s_LBL_IWT_TEXTANSWER_SLIDE:
							// for Read Critically: getting data from objInstructorScoreRubric
							nFinalScore = (objInstructorScoreRubric.rubricScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricScorePercent) : 0;
							nMaxScore = (objInstructorScoreRubric.rubricMaxScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricMaxScorePercent) : $scope.CONSTANTS.c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT;
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
										nMaxScore += $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_PERCENT;
									}
									// For summary feedback slide
									if(typeof oScoresummary.percentile['summary'] != 'undefined'){
										nFinalScore += parseFloat(oScoresummary.percentile['summary']);
										nMaxScore += $scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
									}
								}
							}
							// following IF block for previous version
							else if(typeof objItemAttemptSummary.percentile != 'undefined'){
								// For reading checkpoint [i.e. highlight & dnd slides] slides
								if(typeof objItemAttemptSummary.percentile['reading-checkpoint'] != 'undefined'){
									nFinalScore += parseFloat(objItemAttemptSummary.percentile['reading-checkpoint']);
									nMaxScore += $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_PERCENT;
								}
								// For summary feedback slide
								if(typeof objItemAttemptSummary.percentile.summary != 'undefined'){
									nFinalScore += parseFloat(objItemAttemptSummary.percentile['summary']);
									nMaxScore += $scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
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
									nTempMaxScore += sCount * $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_SCORE;
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
									nTempMaxScore += sCount * $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_SCORE;
								}
								nFinalScore += Math.round((nTempFinalScore/nTempMaxScore)*100);
								nMaxScore += $scope.CONSTANTS.c_s_READING_CHECKPOINT_MAX_PERCENT;
								
								// For summaryfeedback slide
								if(typeof objItemAttemptSummary.iwtsummaryslide != 'undefined'){
									var sCount = 0;
									for(var sSlide in objItemAttemptSummary.iwtsummaryslide) {
										if (objItemAttemptSummary.iwtsummaryslide.hasOwnProperty(sSlide)) {
											nFinalScore += this.point4Scale(objItemAttemptSummary.iwtsummaryslide[sSlide]);
											sCount++;
										}
									}
									nMaxScore += sCount*$scope.CONSTANTS.c_s_SUMMARY_WRITING_MAX_SCORE;
								}
							}
							
							// For read critically slide
							if(	typeof objSettingsData.Content.ShowCriticalResponse != "undefined" && 
								objSettingsData.Content.ShowCriticalResponse== 1) {
							   //  will consider when Critical Response on in Setting tab
								nFinalScore += (objInstructorScoreRubric.rubricScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricScorePercent) : 0;
								nMaxScore += (objInstructorScoreRubric.rubricMaxScorePercent != null) ? parseFloat(objInstructorScoreRubric.rubricMaxScorePercent) : $scope.CONSTANTS.c_s_INSTRUCTOR_RUBRIC_MAX_PERCENT;
							}
							aDataset[iIdx].FinalScore = nFinalScore;
							aDataset[iIdx].ItemMaxScore = nMaxScore;
							break;
					}
				}
			}
		}
		return aDataset;
	};

	// method used for getting the marker colours based on benchMark
	$scope.calculateGLE = function (score, cWeekNumber) {
		var bMarkdata = $scope.performanceInfoData.lexileGLEData,
			iScoreGLE = "",
			oSelectedWeekValue ="";
			//cWeek = cWeekNumber;
			var bMarkdata2 = $scope.performanceInfoData.WeekLexileGLEMap[$scope.unitDetails.gradeId].gleInfo;
			$.each(bMarkdata2, function (id, val) {
				var maxMinweek = id.split("-");
				if(parseFloat(maxMinweek[0]) <= parseFloat(cWeekNumber) && typeof maxMinweek[1] == "undefined"){
					oSelectedWeekValue = val[score];
				}else {
					if (parseFloat(cWeekNumber) >= parseFloat(maxMinweek[0]) && parseFloat(cWeekNumber) <= parseFloat(maxMinweek[1])){
						oSelectedWeekValue = val[score];
						//console.log(oSelectedWeekValue);
					}
				}
			});
			
			iScoreGLE = (typeof oSelectedWeekValue !== "undefined") ? oSelectedWeekValue.GLE : "";
			
		return iScoreGLE;
	};

	$scope.round = function (value, exp) {
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

	$scope.markerColor = function (marks) {
		var bMarkdata = $scope.filter (),
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
		colorCode = "#FFFF00";
		return colorCode;
	};
	$scope.filter = function () {
	var tempArr = $scope.idxBenchmark.toString(),
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
				dataNotes = $scope.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].Notes.LineGraph,
				// minValue: used this to show the minimum benchmark line in graph
				minValue = Object.keys($scope.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark)[0];
				benchMark = $scope.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark;
				headerTitle = $scope.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].title;
			break;
		case 2:
			var idx1 = tempArr[0], 
				idx2 = tempArr[1],
				dataNotes = $scope.performanceInfoData.groups[idx1].subgroup[idx2].Notes.LineGraph,
				// minValue: used this to show the minimum benchmark line in graph
				minValue = Object.keys($scope.performanceInfoData.groups[idx1].subgroup[idx2].benchmark)[0];
				benchMark = $scope.performanceInfoData.groups[idx1].subgroup[idx2].benchmark;
				headerTitle = $scope.performanceInfoData.groups[idx1].subgroup[idx2].title;
			break;
		case 1:
			var idx1 = tempArr[0],
				dataNotes = $scope.performanceInfoData.groups[idx1].Notes.LineGraph,
				// minValue: used this to show the minimum benchmark line in graph
				minValue = Object.keys($scope.performanceInfoData.groups[idx1].benchmark)[0];
				benchMark = $scope.performanceInfoData.groups[idx1].benchmark;
				headerTitle = $scope.performanceInfoData.groups[idx1].title;
			break;
		default:
	}
	objReturn = {"dataNotes":dataNotes,"minValue":minValue,"benchMark":benchMark,"headerTitle":headerTitle};
	return objReturn;
	};	
	$scope.plotGraph = function() {

	var options = {
		chart: {renderTo: 'chart',type: 'line'},
		title: {
			text: $scope.sGraphHeaderTitle
		},
		legend: {
			enabled: false,
		},
		xAxis: {
			title: 			{
				text: $scope.xAxistitle
			},
			min:			$scope.xAxisMin,
			max:			$scope.xAxisMax,
			tickInterval:	$scope.xAxisTickInterval,
			/* showFirstLabel: false, */
			offset:			10,
			labels:			{
				rotation: -45,
				enabled: true,
				formatter: function () {
					
					/* if ($scope.xAxistitle != PERFORMANCE.c_s_LABEL_UNITS) { */
						var iWeeks = parseInt(this.value / $scope.iLessonsPerWeek),
							iUnit = $GLOBALS.get('UnitWeekDetails').getUnit4mWeeks(iWeeks),
							iRemainingWeeks = iWeeks - $GLOBALS.get('UnitWeekDetails').getCumulativeWeeks(iUnit),
							iLesson = $scope.iLessonsPerWeek * iRemainingWeeks,
							bIsInnerMarker = (
								this.isLast === false &&
								this.isFirst === false
							);
						/* if (iLesson !== $scope.iLessonsPerWeek && bIsInnerMarker) {
							return '';
						} */
						
						//return '<span' + (bIsInnerMarker? ' style="color:red;"': '') + '>' + iUnit + '.' + iLesson + '</span>';
						return '<span' + (bIsInnerMarker? ' style="color:red;"': '') + '>' + iLesson/5 + '</span>';
					/* } */
					return this.value;
				},
				step: 1
			}
		},
		yAxis: {
			title: {
				text: $scope.yAxistitle
			},
			min:			$scope.yAxisMin,
			max:			$scope.yAxisMax,
			tickInterval:	$scope.yAxisTickInterval,
			plotLines: $scope.aPlotLines,
			offset: 5,
			labels: $scope.oLebelConfig
		},
		tooltip: $scope.aTooltip,
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
		return options;
		//$scope.GleChartOptions = options;
		//console.log($scope.GleChartOptions);
	}

	$scope.showDetailPopup = function(id) {
		$scope.isModalVisible = true;
		$scope.selectedStudent = $scope.selectedStudents[id];
		var getsReadCompData =  _.where($scope.readingCompRubricData, {StudentId:id}),
			getsBookReadData =  _.where($scope.readingBookCompletedData, {StudentId:id , BookCompleted : true}),
			getsToAssinments =  _.where($scope.gradeBookData, {SID:id ,ICS : "assigned" , ICS : "in progress"}),
			getsWritingAssignments =  _.where($scope.writingData, {StudentId:id}),
			getsFRAssignments =  _.where($scope.fdReadData, {StudentId:id}),
			getsWsrAssignments =  _.where($scope.wsrData, {StudentId:id}),
			getsWspAssignments =  _.where($scope.wspData, {StudentId:id}),
			readingCompCounter = 0,
			readingCompAvg = 0,
			bookCompletedCounter = 0,
			writingAvg = 0,
			writingCounter = 0,
			foundationReadingAvg = 0,
			foundationReadingCounter = 0,
			wordStudyPracticeAvg = 0,
			wordStudyPracticeCounter = 0,
			wordStudyReaderAvg = 0,
			wordStudyReaderCounter = 0;
			
			
		// Reading Comprehension
		for(var iIdx = 0; iIdx < getsReadCompData.length ; iIdx++){
			readingCompAvg += Math.round((getsReadCompData[iIdx].FinalScore/getsReadCompData[iIdx].ItemMaxScore)*100);
			readingCompCounter++;
		}
		getsReadComp =  (readingCompCounter != 0) ? (readingCompAvg / readingCompCounter)+"%" : "";
		$scope.selectedStudent['readingComp'] = getsReadComp;
		
		// Book Completed
		for(var iIdx = 0; iIdx < getsBookReadData.length ; iIdx++){
			bookCompletedCounter ++;
		}
		$scope.selectedStudent['bookCompleted'] = bookCompletedCounter;
		
		// Period calculation
		
		for(var iIdx = 0; iIdx < getsWritingAssignments.length ; iIdx++){
			writingAvg += Math.round((getsWritingAssignments[iIdx].FinalScore/getsWritingAssignments[iIdx].ItemMaxScore)*100);
			writingCounter++;
		}
		getsWritingData = (writingCounter != 0) ? (writingAvg / writingCounter) : 0;
		("Wrting : "+ getsWritingData);
		for(var iIdx = 0; iIdx < getsFRAssignments.length ; iIdx++){
			
			if (getsFRAssignments[iIdx].ItemSubject == "pktof") {
				getsFRAssignments[iIdx].ItemMaxScore = 100;
			}
			foundationReadingAvg += Math.round((getsFRAssignments[iIdx].FinalScore/getsFRAssignments[iIdx].ItemMaxScore)*100);
			foundationReadingCounter++;
		}
		getsFoundationRData = (foundationReadingCounter != 0) ? (foundationReadingAvg / foundationReadingCounter) : 0;
		("Foundation R : "+ getsFoundationRData);
		for(var iIdx = 0; iIdx < getsWsrAssignments.length ; iIdx++){
			wordStudyPracticeAvg += Math.round((getsWsrAssignments[iIdx].FinalScore/getsWsrAssignments[iIdx].ItemMaxScore)*100);
			wordStudyPracticeCounter++;
		}
		getsWsrData = (wordStudyPracticeCounter != 0) ? (wordStudyPracticeAvg / wordStudyPracticeCounter) : 0;
		("WSR : "+ getsWsrData);
		for(var iIdx = 0; iIdx < getsWspAssignments.length ; iIdx++){
			wordStudyReaderAvg += Math.round((getsWspAssignments[iIdx].FinalScore/getsWspAssignments[iIdx].ItemMaxScore)*100);
			wordStudyPracticeCounter++;
		}
		getsWspData = (wordStudyReaderCounter != 0) ? (wordStudyReaderAvg / wordStudyReaderCounter) : 0;
		("WSp : "+ getsWspData);
		getsPhonicsData = (getsWsrData + getsWspData) / 2;
		
		
		$scope.selectedStudent['period'] = (((getsReadComp != "") ? parseInt(getsReadComp) : 0 ) + getsWritingData + getsFoundationRData+getsPhonicsData) / 4; 
		("phonics : "+ (getsReadComp+getsWritingData+getsFoundationRData+getsPhonicsData));
		
		
		// toal open assignments 
		$scope.selectedStudent['openAssignments'] = getsToAssinments.length; 
		//console.log($scope.gradeBookData);
	}
	$scope.hideDetailPopup = function () {
		$scope.isModalVisible = false;
	};
	$scope.calculateWeek = function(sDate1,sDate2) {
		/* var sDate1 = classStartDate;					
		var sDate2 = objGetCurrentDeviceTimestamp.currentDeviceTimestamp; */
		//var sDate2 = "2016-05-25 09:02:29";
		var d1 = new Date(sDate1).getTime();
		var d2 = new Date(sDate2).getTime();

		var daysPassed = ((((d2-d1)/1000)/60)/60)/24;
		currentWeek = Math.ceil(daysPassed/7);
		return currentWeek;
		
	}
	$scope.gettimeSpent = function(iSec){
		// multiply by 1000 because Date() requires miliseconds
		var date = new Date(iSec * 1000),
			hh = date.getUTCHours(),
			mm = date.getUTCMinutes(),
			ss = date.getSeconds(),
			time;
		// If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
		// if (hh > 12) {hh = hh % 12;}
		// These lines ensure you have two-digits
		if (hh < 10) {hh = "0"+hh;}
		if (mm < 10) {mm = "0"+mm;}
		if (ss < 10) {ss = "0"+ss;}
		// This formats your string to HH:MM:SS
		time = hh+"h "+mm+"m " +ss +" s";
		return time;
	}

	});
	
	/* SnapshotCtrl controller */
	/* UnitWeekInfo factory*/
	myApp.factory('UnitWeekInfo', function () {
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
		return UnitWeekInfo;
	
	});
	/* UnitWeekInfo factory*/
	/* resize Directive */
	myApp.directive('resize', function ($window) {
		return function (scope, element) {
			var w = angular.element($window);
			var changeHeight = function() {element.css('height', ((w.height()/2)-35) + 'px' );}; 	
				w.bind('resize', function () {        
				  changeHeight();   // when window size gets changed
				  scope.$apply();	
			});  
			changeHeight(); // when page loads          
		}
	});
	/* resize Directive */