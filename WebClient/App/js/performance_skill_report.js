PerformanceView.idxParentSkill = null;
PerformanceView.skillGroupTitle = null;
PerformanceView.skillGroupIndex = null;
PerformanceView.finalSkillBasedData = null;

PerformanceView.initSkillReport = function() {
	var oSelf = this;
	oSelf.skillReportHandler = new (function () {
		var aMasterData = [],
			aFilters = {};
		
		// prepare master data object
		this.prepareMasterData = function () { // Method 2 & 3
			aMasterData = [];
			// Prepare Master data from GradeBook JSON
			if (oSelf.model.skillBasedReportDataByWeekRange != 0) {
				for (var iIdx = 0; iIdx < oSelf.model.skillBasedReportDataByWeekRange.length; iIdx++) {
					
					var oItem = oSelf.model.skillBasedReportDataByWeekRange[iIdx];
										
					var sStudentId = oItem['StudentID'],
						oData = {
							'StudentId':		sStudentId,
							'StudentName':		oSelf.selectedStudents[sStudentId],
							'ItemID':			oItem['AssessmentID'],
							'SkillID':			oItem['SkillID'],
							'UnitNumber': 		oItem['UnitNumber'],
							'WeekNumber': 		oItem['WeekNumber'],
							'SkillScore':		oItem['SkillObtainedScore'],
							'IRS':				oItem['IRS'],
							'SkillMaxScore':	oItem['AssessmentSkillMaxScore'],
							'SearchKey':		(oItem['UnitNumber'] + '.' + (parseInt(oItem['WeekNumber']) * 5))
						},
						aAssignmentData 	= _.where(oSelf.model['assignmentListData'], {ItemID: oItem['AssessmentID']});

					if (aAssignmentData.length > 0) {
						oAssignmentData 		= aAssignmentData.first();
						oData['ItemName'] 		= oAssignmentData['ItemName'];
						oData['ItemType'] 		= oAssignmentData['ItemType'];
						oData['ItemSubType'] 	= oAssignmentData['ItemSubType'];
						oData['ItemMaxScore'] 	= oAssignmentData['MaxScore'];
						
						// Start: following code block for Weekly Reading Check. 
						// generate unit number & week number from assessment name 
						// like 1.20 Weekly Reading Check so unit number is 1, week number is 4, & lesson number is 20
						if ( oAssignmentData['ItemSubType'] == 'wrc'){
							var aAssessmentName 	= oAssignmentData['ItemName'].split(" "),
								aAssessmentUnitWeek = aAssessmentName[0].split("."),
								iAssessmentWeek 	= (Math.round(aAssessmentUnitWeek[1]) > 0) ? Math.round(aAssessmentUnitWeek[1])/5 : 1;
							oData['WeekNumber'] = iAssessmentWeek;
							oData['SearchKey'] = aAssessmentName[0];
						}
						// End: following code block for Weekly Reading Check
						
						// Start: following code block for UnitBenchmark
						if ( oAssignmentData['ItemSubType'] == 'unitbenchmark'){
							oData['WeekNumber'] 	= 5;
							//benchmark assessment is always available for last week of each unit i.e. lesson 25
							oData['SearchKey'] 	= oItem['UnitNumber']+'.25';  
						}
						// End: following code block for UnitBenchmark
					}
					aMasterData.push(oData);
				}
			}
			else {
				return;
			}
			// End: Prepare Master data from GradeBook JSON
		};
		
		// prepareFilters: for preparing filter object
		this.prepareFilters = function () {
			// Student Filters
			aFilters['StudentId'] = [];
			jQuery('#' + PERFORMANCE.c_s_CONTAINER_STUDENT_LIST + ' li.active').each(function () {
				aFilters['StudentId'].push(jQuery(this).data('student-id'));
			});
			// End Student Filters
			
			// Unit & Week Filters 
				// IPP-4027 
			var iLessonsPerWeek = 5,
				aSliderEnds = $("#" + PERFORMANCE.c_s_SLIDER).slider("values"),
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
			
			oSelf.xAxistitle = PERFORMANCE.c_s_LABEL_LESSONS;
			oSelf.xAxisMin = iLessonsPerWeek * iWeekFrom;
			oSelf.xAxisMax = iLessonsPerWeek * iWeekTo;
			oSelf.xAxisTickInterval = iLessonsPerWeek;
			
			/* // Unit Filters 
			var aSliderEnds = $("#" + PERFORMANCE.c_s_SLIDER).slider("values"),
				iUnitFrom = Math.ceil(aSliderEnds.first() / 6),
				iUnitTo =  Math.ceil(aSliderEnds.last() / 6); // 6: found by inspection.
			aFilters['UnitNumber'] = _.range(iUnitFrom, iUnitTo + 1, 1);
			// End Unit Filters
			
			// Week Filters
			var iWeekFrom = (aSliderEnds.first() - 1) % 6,
				iWeekTo =  (aSliderEnds.last() - 1) % 6; // 6: found by inspection.
			aFilters['WeekNumber'] = [iWeekFrom, iWeekTo];
			
			// End Week Filters 
			
			//Formula to generate Lesson from Unit & Week is following
			//Lesson = 25 * ( Unit - 1 ) + ( Week * 5 )			
			oSelf.xAxistitle = PERFORMANCE.c_s_LABEL_LESSONS;
			oSelf.xAxisMin = 25 * ( iUnitFrom - 1 ) + ( iWeekFrom * 5 );
			oSelf.xAxisMax = 25 * ( iUnitTo - 1 ) + ( iWeekTo * 5 );
			oSelf.xAxisTickInterval = parseInt(5);*/
		};
		
		// method for filtering data
		this.getFilteredData = function () { // Method 4
			this.prepareFilters();
			this.prepareMasterData();
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
				else {
					aData = oUtility.filterByRange(aData, aFilters[sFilter], sFilter);
				}
			}
			//console.log(JSON.stringify(aData));
			return aData;
		};
		
		// method for generating data from skill based report header
		this.getHeaderData = function () {
			var aHeaderData 	= [],
				iCnt 			= 0,
				iLessonsPerWeek	= 5,
				
				aSliderEnds = $("#" + PERFORMANCE.c_s_SLIDER).slider("values"),
				iSliderMin = parseInt(aSliderEnds.first()),
				iSliderMax = parseInt(aSliderEnds.last()),
				
				oUnitWeekDetails = $GLOBALS.get('UnitWeekDetails'),
				iUnitFrom = oUnitWeekDetails.getUnit4mWeeks(iSliderMin),
				iUnitTo = oUnitWeekDetails.getUnit4mWeeks(iSliderMax),
				
				iWeekFrom4mSlider = parseInt($('#lessonId_' + iSliderMin).data('week-number')),
				iWeekTo4mSlider = parseInt($('#lessonId_' + iSliderMax).data('week-number'));
			
			for (var iUnit = iUnitFrom; iUnit <= iUnitTo; iUnit++) {
			
				var iWeekFrom = (iUnit === iUnitFrom) ? 1 : iWeekFrom4mSlider,
					iWeekTo = (iUnit === iUnitTo) ? iWeekTo4mSlider : oUnitWeekDetails.getWeeks4Unit(iUnit);

				for(; iWeekFrom <= iWeekTo; iWeekFrom++) {
					aHeaderData[iCnt] = {};
					aHeaderData[iCnt].fIdx = iUnit + '.' + ((iWeekFrom * iLessonsPerWeek) - 4);
					aHeaderData[iCnt].lIdx = iUnit + '.' + (iWeekFrom * iLessonsPerWeek);
					iCnt++;
				}
			}
			
			return aHeaderData;
		};
		
		// method for generating colour code based on skill score
		this.getColourCode = function (skillMark) {
			var aColourMarker = oSelf.model.performanceInfoData.skill.colour,
				sColourCode = '';
			for(var sColour in aColourMarker){
				if(typeof sColour != 'undefined' && aColourMarker.hasOwnProperty(sColour)) {
					var aColourIdx = sColour.split("-");
					if(skillMark >= parseInt(aColourIdx[0]) && skillMark <= parseInt(aColourIdx[1])) {
						sColourCode = aColourMarker[sColour];
					}
				}
			}
			return sColourCode;
		};
	})();
	oSelf.renderSkillReport();
};

/**
* @method: renderSkillReport 
* @uses: for populating HTML of Skill Report
* @return void;
*/
PerformanceView.renderSkillReport = function () {
	var oSelf = this;
	oSelf.renderSkillReportLeftPanel();
	oSelf.bindEvents();
};

/**
* @method: renderSkillReportLeftPanel 
* @uses: generates html for left panel of Skill Report
* @return void;
*/
PerformanceView.renderSkillReportLeftPanel = function () {
	var oSelf = this;
		
	$("#" + PERFORMANCE.c_s_CONTAINER_MAIN_DROPDOWN).empty().html(
		_.template(
			$("#" + PERFORMANCE.c_s_TEMPLATE_SKILL_DROPDOWN).html(), {
				'skillGroupData': oSelf.model.performanceInfoData.skill.groups
			}
		)
	);
	
	oSelf.resize();
	oSelf.bindEvents4SkillReportLeftPanel();
};

/**
* @method: bindEvents4SkillReportLeftPanel 
* @uses: bind various events for left panel of Skill Report
* @return void;
*/
PerformanceView.bindEvents4SkillReportLeftPanel = function () {
	var oSelf = this;
	
	$('.menuclass li a').off("click").on("click", function () {
		oSelf.subMode = null;
		
		$('#' + PERFORMANCE.c_s_WARNING_TAB).removeClass("active");
		$('.' + PERFORMANCE.c_s_BTN_TOP_MENU_CLASS).parent().removeClass("inactive");
		$("#" + PERFORMANCE.c_s_BTN_TAB_REFRESH).removeClass("inactive");
		
		$('.menuclass li').removeClass("active");
		$(this).parent().addClass("active");
		
		oSelf.idxParentSkill = $(this).data("parent-skill-id");
		oSelf.skillGroupTitle = $(this).text();
		oSelf.skillGroupIndex = $(this).data("skill-group-idx");
		
		oSelf.renderSkillReportRightPanel();
	});
	

	setTimeout(function () {
		$("#" + PERFORMANCE.c_s_ID_LINK_SELECT_ALL).click();
		// Show Graph with Default Options
		oSelf.idxParentSkill = $('.menuclass li a').eq(0).data("parent-skill-id");
		oSelf.skillGroupTitle = $('.menuclass li a').eq(0).text();
		oSelf.skillGroupIndex = $('.menuclass li a').eq(0).data("skill-group-idx");
		$('.menuclass li').removeClass("active");
		$('.menuclass li').eq(0).addClass("active");
		oSelf.renderSkillReportRightPanel();
		// End Show Graph with Default Options
	}, 1000);
};

/**
* @method: renderSkillReportRightPanel 
* @uses: generates html for right panel of Skill Report
* @return void;
*/
PerformanceView.renderSkillReportRightPanel = function () {
	var oSelf = this;
	oUtility.hideLoader();
	
	if (oSelf.subMode != null) {
		// warning
		oSelf.renderWarning();		
	}
	else {
		$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_HEADER).empty().html(
			_.template(
				$("#" + PERFORMANCE.c_s_TEMPLATE_SKILL_REPORT_RIGHT_PANEL_HEADER).html(),
				{
					'headerTitle':oSelf.skillGroupTitle
				}
			)
		);
		
		$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).removeClass("performanceDetailView");
		oSelf.renderSlider();
	}
};

/**
* @method: renderSkillReportContent 
* @uses: generates html for report content
* @return void;
*/
PerformanceView.renderSkillReportContent = function () {
	var oSelf = this,
		o4PointRubric = {
			'0':	55,
			'1':	60,
			'2':	75,
			'3':	88,
			'4':	100
		},
		/* o6PointRubric = {
			'0':	55,
			'1':	60,
			'2':	70,
			'3':	75,
			'4':	85,
			'5':	92,
			'6':	100
		}, */
		oFinalSkillBasedData 	= {},
		oSubSkillRecords		= [],
		aSubSkillRecords		= oSelf.model.performanceInfoData.skill.groups[oSelf.skillGroupIndex].Skill,
		aSkillIds 				= oSelf.idxParentSkill.split(','),
		aFilterSkillData 		= oSelf.skillReportHandler.getFilteredData(),
		aHeaderRecords 			= oSelf.skillReportHandler.getHeaderData(oSelf.xAxisMin, oSelf.xAxisMax),
		oSuperSkillRecord 		= _.where(oSelf.model.skillTaxonomyInfo, {SkillID: oSelf.idxParentSkill.toString()}),
		iCountHeader 			= Object.keys(aHeaderRecords).length,
		iIteration 				= 0;
	
	// Start: code block for formatting data for plotting based on design
	iIteration += (parseInt(iCountHeader/10) > 0) ? (parseInt(iCountHeader/10)) : 0;
	iIteration += ((iCountHeader%10) > 0) ? 1 : 0;
	
	for(var iIterate = 0; iIterate < iIteration; iIterate++){
		oFinalSkillBasedData[iIterate] = {};
		
		for (var sSkillIdx in aSubSkillRecords) {
			if(aSubSkillRecords.hasOwnProperty(sSkillIdx) && (typeof aSubSkillRecords[sSkillIdx]['SubSkillID'] != 'undefined')){
				var sSubSkillIDs = aSubSkillRecords[sSkillIdx].SubSkillID,
					aSubSkillIDs = sSubSkillIDs.split(",");
					
				if(typeof oFinalSkillBasedData[iIterate][sSkillIdx] == "undefined") {
					oFinalSkillBasedData[iIterate][sSkillIdx] = {};
					oFinalSkillBasedData[iIterate][sSkillIdx]["Title"] = aSubSkillRecords[sSkillIdx].Title;
					oFinalSkillBasedData[iIterate][sSkillIdx]["Results"] = {};
					
					for(var iIndex = (iIterate * 10); iIndex < (10 + (10 * iIterate)); iIndex++){
					
						if((typeof aHeaderRecords[iIndex] != 'undefined') && aHeaderRecords.hasOwnProperty(iIndex)){
						
							var sUnitLesson = aHeaderRecords[iIndex].lIdx,
								fSkillScore = -1,
								fSkillMaxScore = -1;
								
							if (typeof oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson] == "undefined") {
								oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson] = {};
								oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'] = {};
							}
							
							if(aSubSkillIDs.length > 0){
								
								for (var iSkill = 0; iSkill < aSubSkillIDs.length; iSkill++) {
									var sSubSkillId = aSubSkillIDs[iSkill];
									
									for(var sFilter in aFilterSkillData){
										if(
											(typeof aFilterSkillData[sFilter] != 'undefined') && aFilterSkillData.hasOwnProperty(sFilter)
										){
											if(
												sUnitLesson == aFilterSkillData[sFilter].SearchKey && 
												sSubSkillId == aFilterSkillData[sFilter].SkillID
											){
												var sItemID 			= aFilterSkillData[sFilter].ItemID,
													sStudentId 			= aFilterSkillData[sFilter].StudentId,
													nSkillObtainedScore = aFilterSkillData[sFilter].SkillScore,
													nIRS 				= aFilterSkillData[sFilter].IRS,
													nSkillMaxScore 		= aFilterSkillData[sFilter].SkillMaxScore
													sItemName 			= aFilterSkillData[sFilter].ItemName,
													sItemType 			= aFilterSkillData[sFilter].ItemType,
													sItemSubType 	 	= aFilterSkillData[sFilter].ItemSubType;
													
													
												fSkillScore = (fSkillScore == -1) ? 0 : parseFloat(fSkillScore);
												fSkillMaxScore = (fSkillMaxScore == -1) ? 0 : parseFloat(fSkillMaxScore);
												
												// for skills [ 'Summarize' ]
												if (sSubSkillId == 'f1d74032e2b64e5ebf233f07b33e8ea5') {
													nSkillObtainedScore = o4PointRubric[Math.round(nSkillObtainedScore).toString()];
													nSkillMaxScore = 100.00;
													fSkillScore += nSkillObtainedScore;
													fSkillMaxScore += nSkillMaxScore;
												}
												// for skills [
													//'evaluate',
													// 'Narrative Writing',
													// 'Explanatory/Informative Writing',
													// 'Argumentative Writing',
													// 'Opinion'
												//]
												else if (
														sSubSkillId == "b102231d0b6844e3898edf372f64cec7" || 
														sSubSkillId == 'dd9f882b41024b39a9c26dbb337ed023' || 
														sSubSkillId == 'daf8a31d3652425fa38c0aecb4569ef4' || 
														sSubSkillId == 'a246f8b54ead4629ac5e182eb5176900' || 
														sSubSkillId == 'a6d0d4f25cfc4ab49f8f577f3cf923e6'
												) {
													if (
														$.inArray(
															sItemSubType,
															[
																ASSIGNMENTS.c_s_ASSIGNMENT_ESSAY,
																ASSIGNMENTS.c_s_ASSIGNMENT_PARAGRAPH,
																ASSIGNMENTS.c_s_ASSIGNMENT_IWTS
															]
														) != -1
													) {
														nSkillObtainedScore = isNaN(nIRS) ? 0 : parseFloat(nIRS);
														nSkillMaxScore = 100.00;
														fSkillScore += nSkillObtainedScore;
														fSkillMaxScore += nSkillMaxScore;
													}
													else {
														nScoreObtained = isNaN(nSkillObtainedScore) ? 0 : parseFloat(nSkillObtainedScore);
														nMaxScore = isNaN(nSkillMaxScore) ? 0 : parseFloat(nSkillMaxScore);
														
														if (nMaxScore > 0) {
															nScoreObtained = ((nScoreObtained / nMaxScore) * 100);
															nMaxScore = 100;
														}
														
														fSkillScore += nScoreObtained;
														fSkillMaxScore += nMaxScore;
													}
												}
												// for others
												else {
													nScoreObtained = isNaN(nSkillObtainedScore) ? 0 : parseFloat(nSkillObtainedScore);
													nMaxScore = isNaN(nSkillMaxScore) ? 0 : parseFloat(nSkillMaxScore);
													
													if (nMaxScore > 0) {
														nScoreObtained = ((nScoreObtained / nMaxScore) * 100);
														nMaxScore = 100;
													}
													
													fSkillScore += nScoreObtained;
													fSkillMaxScore += nMaxScore;
												}
												//Checking ItemID exist or not
												if(typeof oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID] != 'undefined'){
													if(typeof oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId] == 'undefined'){
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId] = [];
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0] = {};
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['SkillScore'] = nSkillObtainedScore;
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['SkillMaxScore'] = nSkillMaxScore;
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['IRS'] = nIRS;
													}
													else {
														var tempStudArr = {};
														tempStudArr['SkillScore'] = nSkillObtainedScore;
														tempStudArr['SkillMaxScore'] = nSkillMaxScore;
														tempStudArr['IRS'] = nIRS;
													
														oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId].push(tempStudArr)
													
													}
												}
												else{
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID] = {};
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['ItemName'] = sItemName;
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['ItemType'] = sItemType;
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['ItemSubType'] = sItemSubType;
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'] = {};
													
													
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId] = [];
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0] = {};
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['SkillScore'] = nSkillObtainedScore;
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['SkillMaxScore'] = nSkillMaxScore;
													oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['Records'][sItemID]['StudInfo'][sStudentId][0]['IRS'] = nIRS;
												}
											}
										}
									}
															
									var avgSkillScore = (fSkillScore == -1) ? -1 : ( (fSkillScore == 0) ? 0 : Math.round((fSkillScore/fSkillMaxScore)*100) );

									oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['avgSkillScore'] = avgSkillScore;
									oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['colourCode'] = (avgSkillScore == -1) ? "#FFFFFF" : oSelf.skillReportHandler.getColourCode(avgSkillScore);
								}
							} 
							else {
								oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['avgSkillScore'] = 0;
								oFinalSkillBasedData[iIterate][sSkillIdx]["Results"][sUnitLesson]['colourCode'] = "#FFFFFF";
							}
						}
					}	
				}
			}
		}
	}
	
	//console.log(JSON.stringify(oFinalSkillBasedData));
	
	oSelf.finalSkillBasedData = oFinalSkillBasedData;
	// End: code block for formatting data for plotting based on design

	$("#" + PERFORMANCE.c_s_CONTAINER_RIGHT_PANEL_INNER).empty().html(
		_.template($("#" + PERFORMANCE.c_s_TEMPLATE_PERFORMANCE_SKILL_REPORT).html(), 
			{
				'skillGroupTitle': oSelf.skillGroupTitle, 
				'headerRecords': aHeaderRecords,
				'SkillGroupIndex': oSelf.skillGroupIndex,
				'skillRecords': aSubSkillRecords,
				'finalSkillBasedData': oFinalSkillBasedData
			}
		)
	);
	
	// Start: width calculation for skill header boxes based on slider length. maximum no of allowed boxes for single page is 10.
	var skillBodyWidth 			= $(".skill-body").width(),
		skillBodyMerginLeft    	= $(".skill-body").css("marginLeft"),
		skillBodyMerginRight    = $(".skill-body").css("marginRight"),
		skillBodyLeftPanelWidth = $(".skill-content-left").width(),
		skillContainerWidth 	= skillBodyWidth  - (parseInt(skillBodyMerginLeft) + parseInt(skillBodyMerginRight)),
		skillBodyRightPanelWidth = skillContainerWidth - skillBodyLeftPanelWidth,
		colWidthArr = [],tableCounter = 0;
		
		$(".skill-content").css({"width" : skillBodyWidth + "px"});
	    $(".skill-content-left").css({"width" : skillBodyLeftPanelWidth + "px"});
	
	for(var i=0; i<aHeaderRecords.length; i=i+10){
		var reminder = aHeaderRecords.length - i;
		if((reminder %10 == 0) || (reminder > 10) ){
			colWidthArr.push(Math.round(skillBodyRightPanelWidth / 10) - 12);
			$("#skill_container_"+tableCounter).css({'width':((Math.round(skillBodyRightPanelWidth / 10) )*10) + 'px'});
		}else{
			colWidthArr.push(Math.round(skillBodyRightPanelWidth / (aHeaderRecords.length % 10)) - 12);
			$("#skill_container_"+tableCounter).css({'width':(Math.round(skillBodyRightPanelWidth / (aHeaderRecords.length % 10))*reminder) + 'px'});
		}
		tableCounter++;
	}
	for(var i=0;i<colWidthArr.length;i++){
		$("#skill_header_"+(i+1)).find(".skill-unit").css('width', colWidthArr[i]);
		$("#skill_container_"+i).find(".skill-box").css('width', colWidthArr[i]);
	}
	// End: width calculation for skill header boxes based on slider length. maximum no of allowed boxes for single page is 10.
	
	oSelf.bindEvents4SkillReportRightPanel();
	oSelf.bindSkilltoolTipView();
	oSelf.resize();
};

/**
* @method: bindEvents4SkillReportRightPanel 
* @uses: bind various events for right panel of Skill Report
* @return void;
*/
PerformanceView.bindEvents4SkillReportRightPanel = function () {
	var oSelf = this,
	    nextprevbtnClick = 0,
		aHeaderRecords = oSelf.skillReportHandler.getHeaderData(oSelf.xAxisMin, oSelf.xAxisMax),
		counter = 0,totalwidth,indCwidth;
		
	$('#btnNextSkillReport').hide();
	$('#btnPrevSkillReport').hide();
	
	$('#btnNextSkillReport').off("click").on("click", function () {
		$('#btnPrevSkillReport').show();
		counter = $("div[id^='skill_header_']").filter(':visible').index();
		nextprevbtnClick = 1;

		$("div[id^='skill_header_']").hide();
		$("div[id^='skill_container_']").hide();
		$("div[id^='skill_header_']").eq(counter).show();
		$("div[id^='skill_container_']").eq(counter).show();
		counter = $("div[id^='skill_header_']").filter(':visible').index();
		if($("#skill_header_" + (counter+1)).length == 0) {
				$('#btnNextSkillReport').hide();
		}
		$(".skill-content").scrollTop(0);
		
	});
	
	$('#btnPrevSkillReport').off("click").on("click", function () {
		$('#btnNextSkillReport').show();
		var counter = $("div[id^='skill_header_']").filter(':visible').index();
		nextprevbtnClick = 1;
		$("div[id^='skill_header_']").hide();
		$("div[id^='skill_container_']").hide();
		$("div[id^='skill_header_']").eq(counter - 2).show();
		$("div[id^='skill_container_']").eq(counter - 2).show();
		counter = $("div[id^='skill_header_']").filter(':visible').index();
		if($("#skill_header_" + (counter-1)).length == 0) {
			$('#btnPrevSkillReport').hide();
		}
		$(".skill-content").scrollTop(0);
		
	});
	
	if(nextprevbtnClick == 0) {	
		$("div[id^='skill_header_']").hide();
		$("div[id^='skill_container_']").hide();
		$("div[id^='skill_header_']").eq(counter).show();
		$("div[id^='skill_container_']").eq(counter).show();
	}
	if(aHeaderRecords.length > 10 ) {
		$('#btnNextSkillReport').show();
	}
	
};

/**
* @method: bindSkilltoolTipView 
* @uses: bind score and skill names of Skill Report
* @return void;
*/
PerformanceView.bindSkilltoolTipView =   function () {
	
	var oSelf = this;
	
	if($("#skillInfoBubble").length) {
		$("#skillInfoBubble").remove();
	}
	
	$(".skill-content").scroll(function() {
		$("#skillInfoBubble").remove();
	});
	
	$(".showSkillToolTip").off('click tap').on('click tap', function (e) {
		$("#skillInfoBubble").remove();
		
		if($("#" + PERFORMANCE.c_s_PERFORMANCE_INFO_BUBBLE).length) {
			$("#" + PERFORMANCE.c_s_PERFORMANCE_INFO_BUBBLE).remove();
		}
		
		e.stopPropagation();
		
		var popUpHtml 		= "",
			top     		= $(this).offset().top + ($(this).height()/2),
			sInfoIdx 		= $(this).data("info-idx"),
			aInfoIdx 		= sInfoIdx.split("|"),
			oInfoContent 	= (aInfoIdx[0] == 'assignment') ? 
								oSelf.finalSkillBasedData[aInfoIdx[1]][aInfoIdx[2]]["Results"][aInfoIdx[3]]['Records'] : 
								oSelf.model.performanceInfoData.skill.groups[aInfoIdx[1]].Skill[aInfoIdx[2]].Description;
		
		if(oInfoContent != "") {
			popUpHtml   = _.template($("#infoBubble").html(),{
							'popupType' : aInfoIdx[0],
							'infoContent': oInfoContent
						});
			
			$('body').append(popUpHtml);

			var ViewPortHeight 	= $('.skill-wrapper').height(),
				tooltipHeight 	= $('.sbr_tooltip').height();
				
			if(top + $(this).height() + tooltipHeight > ViewPortHeight) {
				$('#skillInfoBubble').addClass('btm_tooltip');
				top = top - $(this).height() - tooltipHeight;
			}
			
			
			// Start: Solved IPP-3408
			var boxOffsetLeft = $(this).offset().left,
				infoBubbleWidth = $('.sbr_tooltip').width(),
				sbrContainerMaxRightPos = $(".skill-content-right").offset().left + $(".skill-content-right").width(),
				arrowOffsetLeft = 0;
			
			if ((boxOffsetLeft + infoBubbleWidth) > sbrContainerMaxRightPos) {

				arrowOffsetLeft = Math.abs((boxOffsetLeft - (sbrContainerMaxRightPos - infoBubbleWidth)));
				
				$('#skillInfoBubble').find(".page_arrow").css({
					'left':  arrowOffsetLeft +'px'
				});
				
				$("#skillInfoBubble").css({
					'position' : 'absolute',
					'left':  (sbrContainerMaxRightPos - infoBubbleWidth) + 'px',
					'top' : top + "px",
					'opacity': 1
				});
			}
			else{
				$('#skillInfoBubble').find(".page_arrow").css({					
					'left' : "10px",
				});
				
				$("#skillInfoBubble").css({
					'position' : 'absolute',
					'left' : boxOffsetLeft+"px",
					'top' : top + "px",
					'opacity': 1
				});
			}
			// End: Solved IPP-3408
		}
	});
};