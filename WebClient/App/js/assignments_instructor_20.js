/**
 * Parent AssignmentInstructor
 * @returns void
 */
function AssignmentInstructor () {
	this.model = null;
	this.oGridDataModel = {};	
	this.oGridDataModelExtraPractice = {};	
	this.iCountExtraPractice = 0;	
	this.CONSTANTS = {
		"c_s_TOTAL_WEEKS": 30,
		"c_s_TOTAL_STUDENTS": 10,
		"c_i_UNIT_NO": 1,
		"c_i_GRID_COLUMS": 3,
		"c_i_GRID_COLUMS_READING": 6,
		"c_i_GRID_COLUMS_SUMMARY": 8,
		"c_s_TAB_ASSIGNMENT": "assignments",
		"c_s_TAB_GRADE": "grade",
		"c_s_TAB_SUMMARY": "summary",
		"c_s_TAB_READING": "reading",
		"c_s_TAB_GRADING_PERIOD": "grading-period",
		"c_s_GRADE_BOY": "boy",		
		"c_s_NO_DATA_FOUND": "No Data Found",
		"c_s_EXTRA_PRACTICE_CATG": "Extra Practice",
		"c_s_READING_HEADER": ['Current Lexile','Avg. Lexile Books Read','Difference','Avg. Words Per Minute','Recommended Books','Notes'],
		"c_s_SUMMARY_HEADER": ['Student Name','Lexile Level','IR Level','Initial IR Placement (GLE)','Average IR Level (GLE)','Reading Progress (GLE)','Assignments','Book Reviews','Words Read'],
		"c_s_GRADING_HEADER": ['Reading Level','Reading Comprehension','Phonics','Foundational Reading','Writing'],
		"c_s_TAB_READING_NOTES_JS": "js/progress_reading_notes.js",
		"c_s_PERFORMANCE_INFO_JS": "js/performance_info_20.js",
		"c_s_NO_BOOKS_RECOMMENDED": "Check back tomorrow for recommended books.",
		"c_s_NO_BOOKS_READ": "No Books Read!",
		"c_i_IWT_WORD_COUNT": 900,
		"c_i_AUTO_REFRESH_TIMEOUT": 20000
	};	
	this.oAssignmentCategories = {					
		'frs':					'Word Reader',
		'iwt':					'Interactive Reader',
		'wrc':					'Reading Checks',
		'phonictextbasedslide':	'Word Study Readers',
		'pluralnouns':			'Word Study Practice',
		'digraphs':				'Word Study Practice',
		'word_families':		'Word Study Practice',
		'syllables':			'Word Study Practice',
		'word_sort':			'Word Study Practice',
		'rotatinglists':		'Word Study Practice'
	};
	this.oCategotyOrder = {					
		'Interactive Reader': '1',
		'Reading Check': '2',
		'Word Study Practice': '3',
		'Word Study Reader': '4',
		'Library Response Prompt': '5',
		'Library Response Prompts': '5',
		'Word Reading': '6'
	};	
	this.oCategotyArrayOrderWise = [					
		'Interactive Reader',
		'Reading Check',
		'Word Study Practice',
		'Word Study Reader',
		'Library Response Prompt',		
		'Word Reading'
	];
	this.oGradeOrder = {					
		'boy': '1',
		'moy': '2',
		'eoy': '3'
	};
	this.oCategoryMapping = {					
		'wordstudypractice':	'Word Study Practice',
		'wordstudyreader':		'Word Study Reader',
		'libraryresponseprompt':'Library Response Prompt',
		'wordreading':			'Word Reading',
		'wrc':					'Reading Check'
	};
	this.oGradeCodeMapping = {
		'gk': 'gbp',
		'g1': 'gbp',
		'g2': 'gbp',
		'g3': 'gbe',
		'g4': 'gbe',
		'g5': 'gbe',
		'g6': 'gbm',
		'g7': 'gbm',
		'g8': 'gbm',
		'g9': 'gbh',
		'g10': 'gbh',
		'g11': 'gbh',
		'g12': 'gbh'
	};
	this.arrGleConst  =  {
	  "gbe": {
		"week-range-1": {"gle9": 1.3,"gle8": 2,"gle7": 2.5,"gle6": 4.7,"gle5": 6.2,"gle4": 7.7,"gle3": 8.9,"gle2": 9.9,"gle1": 10.3},
		"week-range-2": {"gle9": 1.4,"gle8": 2.5,"gle7": 3,"gle6": 5.5,"gle5": 7,"gle4": 8.3,"gle3": 9.7,"gle2": 10.3,"gle1": 10.7},
		"week-range-3": {"gle9": 2,"gle8": 3,"gle7": 3.4,"gle6": 6.2,"gle5": 7.7,"gle4": 9.1,"gle3": 9.9,"gle2": 10.7,"gle1": 11.4},
		"week-range-4": {"gle9": 2,"gle8": 3.4,"gle7": 3.8,"gle6": 6.2,"gle5": 8.1,"gle4": 9.9,"gle3": 10.3,"gle2": 11.4,"gle1": 11.6},
		"week-range-5": {"gle9": 2.5,"gle8": 3.7,"gle7": 4.4,"gle6": 7,"gle5": 8.3,"gle4": 10.3,"gle3": 11.4,"gle2": 11.7,"gle1": 12},
		"week-range-6": {"gle9": 3,"gle8": 4.4,"gle7": 4.5,"gle6": 7.7,"gle5": 9.1,"gle4": 10.9,"gle3": 11.6,"gle2": 12,"gle1": 12.4}
	  },
	  "gbm": {
		"week-range-1": {"gle9": 1.3,"gle8": 2,"gle7": 2.5,"gle6": 4.7,"gle5": 6.2,"gle4": 7,"gle3": 7.7,"gle2": 9.9,"gle1": 11.4},
		"week-range-2": {"gle9": 1.4,"gle8": 2.5,"gle7": 3,"gle6": 5.5,"gle5": 7,"gle4": 7.7,"gle3": 8.1,"gle2": 10.3,"gle1": 11.6},
		"week-range-3": {"gle9": 2,"gle8": 3,"gle7": 3.4,"gle6": 6.2,"gle5": 7.7,"gle4": 8.3,"gle3": 8.9,"gle2": 11.4,"gle1": 12},
		"week-range-4": {"gle9": 2,"gle8": 3.4,"gle7": 3.8,"gle6": 6.2,"gle5": 8.1,"gle4": 8.9,"gle3": 10.9,"gle2": 11.7,"gle1": 12.4},
		"week-range-5": {"gle9": 2.5,"gle8": 3.7,"gle7": 4.4,"gle6": 7,"gle5": 8.3,"gle4": 9.7,"gle3": 10.3,"gle2": 12,"gle1": 12.6},
		"week-range-6": {"gle9": 3,"gle8": 4.4,"gle7": 4.5,"gle6": 7.7,"gle5": 9.1,"gle4": 10.3,"gle3": 10.9,"gle2": 12.4,"gle1": 13}
	  },
	  "gbh": {
		"week-range-1": {"gle9": 1.3,"gle8": 2,"gle7": 2.5,"gle6": 4.7,"gle5": 6.2,"gle4": 7.7,"gle3": 8.8,"gle2": 10.3,"gle1": 11.4},
		"week-range-2": {"gle9": 1.4,"gle8": 2.5,"gle7": 3,"gle6": 5.5,"gle5": 7,"gle4": 8.1,"gle3": 9.3,"gle2": 10.9,"gle1": 11.6},
		"week-range-3": {"gle9": 2,"gle8": 3,"gle7": 3.4,"gle6": 6.2,"gle5": 7.7,"gle4": 8.3,"gle3": 8.9,"gle2": 11.4,"gle1": 12},
		"week-range-4": {"gle9": 2,"gle8": 3.4,"gle7": 3.8,"gle6": 6.2,"gle5": 8.1,"gle4": 9.5,"gle3": 10.7,"gle2": 11.6,"gle1": 12.4},
		"week-range-5": {"gle9": 2.5,"gle8": 3.7,"gle7": 4.4,"gle6": 7,"gle5": 8.3,"gle4": 8.9,"gle3": 11.4,"gle2": 12,"gle1": 12.6},
		"week-range-6": {"gle9": 3,"gle8": 4.4,"gle7": 4.5,"gle6": 7.7,"gle5": 9.1,"gle4": 10.9,"gle3": 11.6,"gle2": 12.4,"gle1": 13}
	  }
	};
	this.aStudentIDs = [];
	this.allStudentLexile = [];
	this.assignmentList = {};
	this.currentWeek = 1;
	this.unitDetail = null;
	this.mySwiper = null;
	this.oAttemptInfo = null;
	this.iSlideVisible = 1;
	this.iSlideCount = 0;
	this.aCatgHeader = [];
	this.aStudentGLE = [];
	this.sActiveTab = this.CONSTANTS.c_s_TAB_ASSIGNMENT;
	this.bPageLaunched = true;
	this.bAutoRefresh = false;
	
	this.init();
}
AssignmentInstructor.prototype = new ISeriesBase();

AssignmentInstructor.prototype.init = function () {
	var oSelf = this,
		oLoaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>',
		bLoadMainTemplate = true;
		
	/*== show loader ==*/
	$('body').css('background-color','#FFFFFF');
	$("#main_container").css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(oLoaderImg);	
	
	oSelf.getData(false);
}

/**
 * Get Data From Service
 * @method getData
 * @param bReloadGrid
 * @returns void
 */
AssignmentInstructor.prototype.getData = function (bReloadGrid) {
	var oSelf = this,		
		fScheduleCheck = function () {
			if (
				objStudentListJsonData && 
				objAssignmentListJsonData &&				 
				objGradeBookV2JsonData && 
				objGradeBookJsonData && 
				objCurrentWeekJsonData && 
				objUnitDetails && 
				objSettingsData && 
				objGetUserSettingsResponse && 
				objLibraryJsonData && 
				(
					(oSelf.sActiveTab != oSelf.CONSTANTS.c_s_TAB_READING && oSelf.sActiveTab != oSelf.CONSTANTS.c_s_TAB_SUMMARY) ||
					(						 
						 objLibraryProgressDetailForClass && 						 
						 (
							(oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY && objGetClassUserLevel) ||
							oSelf.sActiveTab != oSelf.CONSTANTS.c_s_TAB_SUMMARY
						 )
					)					
				)
			) {
				/* if auto mode then get current week from GetUsetSettings */
				if (objSettingsData.Content.AssignmentSendingMode && !bReloadGrid) {
					try {
						var oSettingsData = JSON.parse(decodeURIComponent(objGetUserSettingsResponse.Content.PersonalSettings));
						oSelf.currentWeek = oSettingsData['ORT']['POS']['ASGMT']['W'] || 1;
					}
					catch (e) {
						oSelf.currentWeek = 1;
					}
				}			
				oSelf.prepareToRender(bReloadGrid);
			}
			else {
				setTimeout(fScheduleCheck, 100);
			}
		};
		
	if (!bReloadGrid) {
		// get unit details
		$.nativeCall({
			'method':			'GetUnitDetails',
			'globalResource':	'objUnitDetails',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'checkSuccess':		function (poServiceResponse) {
				return ((parseInt(poServiceResponse.totalUnits) || -1) !== -1);
			},
			'onComplete':		function () {
				// process data			
			}
		});
	
		// get class settings
		$.nativeCall({
			'method':			'GetClassSettings',
			'globalResource':	'objSettingsData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'onComplete':		function () {
				// process data			
			}
		});
		
		// get user settings
		$.nativeCall({
			'method':			'GetUserSettings',
			'globalResource':	'objGetUserSettingsResponse',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'onComplete':		function () {
				// process data	
				oSelf.currentWeek = objCurrentWeekJsonData.Content.WeekNo || 1;
			}
		});
		
		// get current week
		$.nativeCall({
			'method':			'GetCurrentWeekForClass',
			'globalResource':	'objCurrentWeekJsonData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'onComplete':		function () {		
				// process data				
				oSelf.currentWeek = objCurrentWeekJsonData.Content.WeekNo || 1;
			}
		});
		
		// get student list
		$.nativeCall({
			'method':			'GetStudentListInfo',
			'globalResource':	'objStudentListJsonData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'onComplete':		function () {		
				// process data							
			}
		});
		
		$.nativeCall({
			'method':			'GetAssignmentListInfo',
			'inputParams': 		[oSelf.CONSTANTS.c_i_UNIT_NO],
			'globalResource':	'objAssignmentListJsonData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,		
			'onComplete':		function () {
				// process data
			}
		});
		
		$.nativeCall({
			'method': 'GetLibraryInfo',			
			'globalResource': 'objLibraryJsonData',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,
			'checkSuccess':		function (poServiceResponse) {
				return (typeof poServiceResponse.jsPath != "undefined");
			},			
			'onComplete': function () {				
				loadJS(objLibraryJsonData.jsPath, $.noop);
			}
		});	
	}
	else {
		if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING || oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {
			// get library progress detail
			$.nativeCall({
				'method':			'GetLibraryProgressDetailForClass',
				'globalResource':	'objLibraryProgressDetailForClass',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,		
				'onComplete':		function () {
					// process data
				}
			});		
			

			if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {
				$.nativeCall({
					'method': 'GetClassUserLevel',			
					'globalResource': 'objGetClassUserLevel',
					'interval':			500,
					'breakAfter':		125000,
					'debug':			false,
					'onComplete': function () {				
						// process data
					}
				});
			}
		}
	
		oSelf.bPageLaunched = false;
	}
	
	// get assignment list assigned to students
	$.nativeCall({
		'method':			'GetGradebookForInstructorV2',
		'inputParams': 		["Unit", oSelf.CONSTANTS.c_i_UNIT_NO, false, null],
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
AssignmentInstructor.prototype.checkForAlldAttemptIds = function (oData) {
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
AssignmentInstructor.prototype.checkForUpdatedAttemptIds = function (oData) {
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
		} else if (revId != aItemAttemptIds[i].ARID) {	//	Exists but Updated					
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
AssignmentInstructor.prototype.getGradebookAttemptData = function (aItemAttemptIds) {
	var oSelf = this;
	
	$.nativeCall({
		'method':			'GetGradebookAttemptData',
		'inputParams':		[aItemAttemptIds],
		'globalResource':	'objGradeBookJsonData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,		
		'onComplete':		function () {
			// process data			
		}
	});	
}

/**
 * After Render Process
 * @method afterRenderProcess 
 * @return 
 */
AssignmentInstructor.prototype.afterRenderProcess = function () {
	var oSelf = this;
	
	oSelf.bAutoRefresh = false;
}

/**
 * Reset Auto Refresh Interval
 * @method resetAutoRefreshInterval 
 * @return 
 */
AssignmentInstructor.prototype.resetAutoRefreshInterval = function () {
	var oSelf = this;
	
	oSelf.oAutoRefreshInterval = setInterval(function () {			
		oSelf.autoRefresh();
	}, oSelf.CONSTANTS.c_i_AUTO_REFRESH_TIMEOUT);
}

/**
 * Auto Refresh
 * @method autoRefresh 
 * @return 
 */
AssignmentInstructor.prototype.autoRefresh = function () {
	var oSelf = this,
		bReloadGrid = true,
		fScheduleCheck = function () {
			if (					 
				objGradeBookV2JsonData && 
				objGradeBookJsonData && 				
				(
					oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT || 
					oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE || 
					(
						(oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING || oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) &&
						(						 
							 objLibraryProgressDetailForClass && 						 
							 (
								(oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY && objGetClassUserLevel) ||
								oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING
							 )
						)
					)
				)
			) {				
				oSelf.bAutoRefresh = true;
				// wait till header transition ends in 1sec
				setTimeout(function() {
					oSelf.sLeft = $(".table-column2 .slide-item").css("left");
					oSelf.prepareToRender(bReloadGrid);
				}, 1000);
			}
			else {
				setTimeout(fScheduleCheck, 100);
			}
		};			
	
	// freeze screen while autorefresh
	oUtility.showLoader({
		'message': '',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0
	});
				
	//objGradeBookV2JsonData = null;
	// get assignment list assigned to students
	$.nativeCall({
		'method':			'GetGradebookForInstructorV2',
		'inputParams': 		["Unit", oSelf.CONSTANTS.c_i_UNIT_NO, false, null],
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
	
	if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING || oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {
		//objLibraryProgressDetailForClass = null;
		// get library progress detail
		$.nativeCall({
			'method':			'GetLibraryProgressDetailForClass',
			'globalResource':	'objLibraryProgressDetailForClass',
			'interval':			500,
			'breakAfter':		125000,
			'debug':			false,		
			'onComplete':		function () {
				// process data
			}
		});		
		

		if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {
			//objGetClassUserLevel = null;
			$.nativeCall({
				'method': 'GetClassUserLevel',			
				'globalResource': 'objGetClassUserLevel',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,
				'onComplete': function () {				
					// process data
				}
			});
		}
	}
	
	fScheduleCheck();
}

/**
 * Process before rendering data
 * @method prepareToRender 
 * @return 
 */
AssignmentInstructor.prototype.prepareToRender = function (bReloadGrid) {
	var oSelf = this;
	
	if (!bReloadGrid) {
		/*== hide loader ==*/			
		$("#main_container").removeAttr('style');
		$("#main_container").html(GENERAL.c_s_SPECIAL_CHARACTERS_BLANK);
		$('body').css('background-color','#E0E1E1');
		/* ILIT-871 */
		setTimeout(function(){
			$(".slick-slider").css("visibility","visible");
		},1200);
		/* ILIT-871 */
	}
	
	oSelf.model = {
		"GetAssignmentListInfo": _.sortBy(objAssignmentListJsonData.Content, "ItemSubType"),
		"GetGradebookForInstructorV2": objGradeBookV2JsonData.Content,
		"GetGradebookAttemptData": objGradeBookJsonData.Content,
		"objUnitDetails": objUnitDetails,
		"GetClassSettings": objSettingsData.Content
	}

	if (!bReloadGrid) {
		oSelf.render();
	}
	
	oSelf.prepareDataModel();	
}

/**
 * Render the Outer Template & Week Slider
 * @method render 
 * @return 
 */
AssignmentInstructor.prototype.render = function () {
	var oSelf = this;	
	
	$("#main_container").html(
		_.template($("#mainTemplate").html())
	);		
	
	$("#dashboard-weeks").html(
		_.template($("#dashboard-header").html(),{"iWeeks": oSelf.model["objUnitDetails"]['totalWeeks'], 
			"iCurrentWeek": oSelf.currentWeek, 
			"oCalendarJson": oSelf.model["GetClassSettings"]['AcademicCalendarJSON'] ? JSON.parse(decodeURIComponent(oSelf.model["GetClassSettings"]['AcademicCalendarJSON'])) : {}
		})
	);

	oSelf.initSlick();	
	//oSelf.initSwiper();		
}

/**
 * Initialize Week Slick Carousel
 * @method initSlick 
 * @return 
 */
AssignmentInstructor.prototype.initSlick = function () {
	var oSelf = this,
		iSwipeIndex = oSelf.currentWeek;
		oSelf.bindHeaderSlider("swiper-slide", oSelf.model["objUnitDetails"]['totalWeeks'], iSwipeIndex,"left_arrow","right_arrow","week-no", oSelf.setWeek );
}

/**
 * Process before rendering data for All Tabs, Mainly Assignment & Grade Tabs
 * @method prepareDataModel 
 * @return 
 */
AssignmentInstructor.prototype.prepareDataModel = function () {
	var oSelf = this,
		model = oSelf.model;
		aStudentList = _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [],
		aStudentAssignmentList = [],
		assignmentTile = [],
		oModel = {},
		oModelExtraPractice = {},
		oModelGrade = {},
		iWeekNumber = -1, 
		sCategory = '', 
		sReadingLevel = '',
		iCurrentWeek = 1,
		iPage = 0,
		sItemName = '',	
		sItemSubject = '',
		sDisplayTextStatus = '',
		sStatus = '',
		iWeek = 0,
		oAttemptData = {},
		fFinalScoreStatus = 0,
		sItemAttemptSummary = '',
		sExtraPractice = "No",
		bShowExtraAssignment = false,
		oSummary = {},
		aExtraAssignmentCount = [],
		iIWTTotWordCount = [];		
	
	oSelf.aExtraAssignmentPerStud = [];
	oSelf.aCatgHeader = [];
	oSelf.aSentExtraPractices = [];
	oSelf.aSentCoreAssignments = [];
	oSelf.aStudentGLE = [];
	oSelf.oAssignmentCompleted = {};
	oSelf.oAssignmentInComplete = {};	
	
	/* Iterate each assignment list */
	for (var iI = 0; iI < model['GetAssignmentListInfo'].length; iI++) {
		iWeekNumber = parseInt(model['GetAssignmentListInfo'][iI].WeekNumber).toString();
		sItemID = model['GetAssignmentListInfo'][iI].ItemID;		
		sItemName = model['GetAssignmentListInfo'][iI].ItemName;
		sItemSubject = model['GetAssignmentListInfo'][iI].ItemSubject;		
		sItemType = model['GetAssignmentListInfo'][iI].ItemType;		
		sItemSubType = model['GetAssignmentListInfo'][iI].ItemSubType;		
		sExtraPractice = model['GetAssignmentListInfo'][iI].ExtraPractice || "No";		
		sTargetGradeCode = model['GetAssignmentListInfo'][iI].TargetGradeCode || "";
		sExtraPracticeCatg = oSelf.CONSTANTS.c_s_EXTRA_PRACTICE_CATG;
		sCategory = (
			(
				(model['GetAssignmentListInfo'][iI].ItemCategory ? oSelf.oCategoryMapping[model['GetAssignmentListInfo'][iI].ItemCategory] : "") ||
				oSelf.oAssignmentCategories[model['GetAssignmentListInfo'][iI].ItemSubType]
			) ||
			model['GetAssignmentListInfo'][iI].ItemSubType
		);
		sReadingLevel = parseInt(model['GetAssignmentListInfo'][iI].ReadingLevel) || '';
		
		if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT) {
			if (typeof oModel[iWeekNumber] === 'undefined') { oModel[iWeekNumber] = {}; }				
		}
		
		/* Column Heads Plotting - Set Assignment Category */
		if (sCategory != ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT) {							
			if (typeof oSelf.aCatgHeader[iWeekNumber] == 'undefined') { oSelf.aCatgHeader[iWeekNumber] = []; }
			if ($.inArray(sCategory, _.pluck(oSelf.aCatgHeader[iWeekNumber], "catg")) == -1 && sExtraPractice == "No") {
				oSelf.aCatgHeader[iWeekNumber].push({"catg":sCategory, "order":oSelf.oCategotyOrder[sCategory]}); 
			}			
		}
		if (sCategory == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE) {			
			if ($.inArray(sItemName+'||'+sItemID+'||'+sItemSubType+'||'+sTargetGradeCode+'||'+sItemSubject, oSelf.aCatgHeader) == -1) { 
				oSelf.aCatgHeader.push(sItemName+'||'+sItemID+'||'+sItemSubType+'||'+sTargetGradeCode+'||'+sItemSubject); 
			}
		}		
		
		/* Iterate each student list */
		for (var iJ = 0; iJ < aStudentList.length; iJ++) {
			/* Fetch Attempt Data for given student assignment combination */
			oAttemptData = _.where(model['GetGradebookAttemptData'], {"SID": aStudentList[iJ].UserID, "IID" : sItemID});
			
			sStatus = oAttemptData.length ? oAttemptData[0]['ICS'] : '';
			iWeek = oAttemptData.length ? oAttemptData[0]['WN'] : '0';
			
			/* Define empty array oModel for given student & category */
			if (sCategory != ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT) {
				// for normal assignments
				if (typeof oModel[iWeekNumber][aStudentList[iJ].UserID] === 'undefined') { oModel[iWeekNumber][aStudentList[iJ].UserID] = {}; }				
				if (typeof oModel[iWeekNumber][aStudentList[iJ].UserID][sCategory] === 'undefined' && sExtraPractice == "No") { 
					oModel[iWeekNumber][aStudentList[iJ].UserID][sCategory] = []; 
				}
				// for extra practice assignments
				if (typeof oModelExtraPractice[iWeek] === 'undefined') { oModelExtraPractice[iWeek] = {}; }
				if (typeof oModelExtraPractice[iWeek][aStudentList[iJ].UserID] === 'undefined') { oModelExtraPractice[iWeek][aStudentList[iJ].UserID] = {}; }
				if (typeof oModelExtraPractice[iWeek][aStudentList[iJ].UserID][sExtraPracticeCatg] === 'undefined' && sExtraPractice == "Yes") { 
					oModelExtraPractice[iWeek][aStudentList[iJ].UserID][sExtraPracticeCatg] = [];					
				}				
			}
			else if (sCategory == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE) {
				if (typeof oModel[aStudentList[iJ].UserID] === 'undefined') { oModel[aStudentList[iJ].UserID] = {}; }				
				if (typeof oModel[aStudentList[iJ].UserID][sCategory] === 'undefined') { oModel[aStudentList[iJ].UserID][sCategory] = []; }				
			}			
			
			/* Track all Assignments that are sent to atleast one student */
			if ($.inArray(sItemID, oSelf.aSentExtraPractices) == -1 && sExtraPractice == "Yes" && sStatus) {
				oSelf.aSentExtraPractices.push(sItemID);
			}
			else if ($.inArray(sItemID, oSelf.aSentCoreAssignments) == -1 && sExtraPractice == "No" && sStatus) {
				oSelf.aSentCoreAssignments.push(sItemID);
			}

			// set display text for status
			sDisplayTextStatus = '';
			if (sStatus == ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS) {
				sDisplayTextStatus   = ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT;					
			}
			else if (sStatus == ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {
				fFinalScoreStatus   =  oAttemptData[0]['FS'];
				if (sItemSubType == "dailyassignment" || sItemSubType == "iwt") {
					sDisplayTextStatus   =   fFinalScoreStatus + "/" + oAttemptData[0]['IMS'];
					
					/* STORE STUDENT'S IWT WORD COUNT */
					if (typeof iIWTTotWordCount[aStudentList[iJ].UserID] == "undefined") { iIWTTotWordCount[aStudentList[iJ].UserID] = 0; }
					iIWTTotWordCount[aStudentList[iJ].UserID]   +=   oSelf.CONSTANTS.c_i_IWT_WORD_COUNT;
				} 
				else if (sCategory == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE) {
					try {
						sItemAttemptSummary =  	decodeURIComponent(oAttemptData[0]['IAS']);
						oSummary         	= 	($.trim(sItemAttemptSummary) == "") ? null : JSON.parse(sItemAttemptSummary);
						sDisplayTextStatus  =   (oSummary == null) ? oAttemptData[0]['FS'] : oSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT];
					}
					catch (exp) {
						sDisplayTextStatus	=   (typeof oSummary[ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT] == "undefined") ? oAttemptData[0]['FS'] : oSummary[ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT];
					}						
					sDisplayTextStatus		=   sDisplayTextStatus.toString().replace("<", "&lt;").replace(">", "&gt;");
					
					/* STORE STUDENT'S GLE */
					if (model['GetAssignmentListInfo'][iI].ItemSubject == oSelf.CONSTANTS.c_s_GRADE_BOY) {
						oSelf.aStudentGLE[aStudentList[iJ].UserID] = sDisplayTextStatus;
					}
				}
				else if (sItemSubType == "nsa") {						
					sDisplayTextStatus =   ASSIGNMENT_INSTRUCTOR.c_s_FINISHED_STATUS;						
				}
				else if (
					sItemSubType == "phonictextbasedslide" || 
					sItemSubType == "extendedphonic" || 
					sItemSubType == "frs"  
				) {						
					if (sItemSubject == "pktof") {
						sDisplayTextStatus   =   fFinalScoreStatus + "/100";
					}
					else {
						sDisplayTextStatus   = fFinalScoreStatus + "/" + oAttemptData[0]['IMS'];
					}
				}
				else {
					sDisplayTextStatus   =   fFinalScoreStatus + "/" + oAttemptData[0]['IMS'];
				}
			}
			else if (sStatus == ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS) {				
				fFinalScoreStatus   = oAttemptData[0]['FS'];
				if (sItemSubType == "studyplan" || sItemSubType == "assessment") {						
					sDisplayTextStatus   =   fFinalScoreStatus + "/" + oAttemptData[0]['IMS'];						
				}
				else if (
					(sItemSubType == "phonictextbasedslide" || 
					sItemSubType == "extendedphonic" || 
					sItemSubType == "frs") && 
					sItemSubject == "pktof" && 
					objSettingsData.Content.AcceptOralFluencyScore == '0'
				) {					
					sDisplayTextStatus   =  ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT;										
				}
				else {
					fFinalScoreStatus   =   0;
					sDisplayTextStatus   =   ASSIGNMENT_INSTRUCTOR.c_s_SENT_COMPLETED_TXT;						
				}
			}
			else if (sStatus == ASSIGNMENT_INSTRUCTOR.c_i_PROGRESS_STATUS  || sStatus == "in+progress") {
				sDisplayTextStatus = ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT;									
			}
			else if (sStatus == ASSIGNMENT_INSTRUCTOR.c_s_DELETED_STATUS) {					
				sDisplayTextStatus   =   "";					
			}

			/* track completed assignments for SUMMARY tab */
			if (typeof oSelf.oAssignmentCompleted[aStudentList[iJ].UserID] == "undefined") { oSelf.oAssignmentCompleted[aStudentList[iJ].UserID] = 0; }
			if (typeof oSelf.oAssignmentInComplete[aStudentList[iJ].UserID] == "undefined") { oSelf.oAssignmentInComplete[aStudentList[iJ].UserID] = 0; }
			if (
				sDisplayTextStatus != ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT && 
				sDisplayTextStatus != ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT && 
				sDisplayTextStatus != ""
			) {				
				oSelf.oAssignmentCompleted[aStudentList[iJ].UserID]++;
			}
			else if (
				sDisplayTextStatus == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT || 
				sDisplayTextStatus == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT
			) {				
				oSelf.oAssignmentInComplete[aStudentList[iJ].UserID]++;
			}
			
			/* FOR GRADE DATA */
			if (sCategory == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE) {				
				oModel[aStudentList[iJ].UserID][sCategory].push({
					'SID':			aStudentList[iJ].UserID,
					'ARL':			sReadingLevel,
					'IID':			sItemID,
					'IAID':			oAttemptData.length ? oAttemptData[0]['IAID'] : '',
					'FS':			oAttemptData.length ? oAttemptData[0]['FS'] : '',
					'ITYPE':		sItemType,
					'ISUBTYPE':		sItemSubType,
					'CTG':			sCategory,
					'ITEM-NAME':	sItemName,
					'STATUS':		sDisplayTextStatus,
					'targetGradeCode':	sTargetGradeCode,
					'ITEM-SUBJECT':	oSelf.oGradeOrder[sItemSubject]
				});				
			}
			/* FOR ASSIGNMENT DATA */
			else if (sCategory != ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT) {
				if (sExtraPractice == "No") {
					oModel[iWeekNumber][aStudentList[iJ].UserID][sCategory].push({
						'SID':				aStudentList[iJ].UserID,
						'ARL':				sReadingLevel,
						'IID':				sItemID,
						'IAID':				oAttemptData.length ? oAttemptData[0]['IAID'] : '',
						'FS':				oAttemptData.length ? oAttemptData[0]['FS'] : '',
						'ITYPE':			sItemType,
						'ISUBTYPE':			sItemSubType,
						'CTG':				sCategory,
						'ITEM-NAME':		sItemName,
						'STATUS':			sDisplayTextStatus,
						'REASSIGN-COUNT':	oAttemptData.length ? oAttemptData[0]['RAC'] : 0						
					});
				}
				else {					
					oModelExtraPractice[iWeek][aStudentList[iJ].UserID][sExtraPracticeCatg].push({
						'SID':				aStudentList[iJ].UserID,
						'ARL':				sReadingLevel,
						'IID':				sItemID,
						'IAID':				oAttemptData.length ? oAttemptData[0]['IAID'] : '',
						'FS':				oAttemptData.length ? oAttemptData[0]['FS'] : '',
						'ITYPE':			sItemType,
						'ISUBTYPE':			sItemSubType,
						'CTG':				sCategory,
						'ITEM-NAME':		sItemName,
						'STATUS':			sDisplayTextStatus,
						'REASSIGN-COUNT':	oAttemptData.length ? oAttemptData[0]['RAC'] : 0
					});
					
					// Track how many extra assignments per week					
					if (typeof aExtraAssignmentCount[iWeek] == 'undefined') { aExtraAssignmentCount[iWeek] = []; }
					
					// Track how many extra assignments per week & per student
					if (typeof oSelf.aExtraAssignmentPerStud[iWeek] == 'undefined') { oSelf.aExtraAssignmentPerStud[iWeek] = []; }
					if (typeof oSelf.aExtraAssignmentPerStud[iWeek][aStudentList[iJ].UserID] == 'undefined') { 
						oSelf.aExtraAssignmentPerStud[iWeek][aStudentList[iJ].UserID] = []; 
					}
					
					if (sDisplayTextStatus != "") { 
						if ($.inArray(sItemID, aExtraAssignmentCount[iWeek]) == -1) { 
							aExtraAssignmentCount[iWeek].push(sItemID); 
						}
						if ($.inArray(sItemID, oSelf.aExtraAssignmentPerStud[iWeek][aStudentList[iJ].UserID]) == -1) { 
							oSelf.aExtraAssignmentPerStud[iWeek][aStudentList[iJ].UserID].push(sItemID); 
						}
					}					
					
					// Track if any extra assignment is assigned
					if (sDisplayTextStatus != "") {
						bShowExtraAssignment = true;
					}
				}
			}			
		}		
	}	
	
	// If in Assignment Tab & bShowExtraAssignment is true then add Extra Assignment to category header array for each week	
	if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT && bShowExtraAssignment) {
		_.each(oSelf.aExtraAssignmentPerStud, function (aStud, kWeek) {
			aCountExtraPractice = [];
			if (kWeek) {
				// find max number of Extra Assignments assigned for this week
				_.each(aStud, function(aItem,k) {					
					aCountExtraPractice.push(aItem.length);					
				});
				// add all extra practice columns for this week
				for (var i = 0; i < _.max(aCountExtraPractice); i++) {
					if (typeof oSelf.aCatgHeader[kWeek] == 'undefined') {
						oSelf.aCatgHeader[kWeek] = [];
					}					
					oSelf.aCatgHeader[kWeek].push({"catg":sExtraPracticeCatg, "order":_.size(oSelf.oCategotyOrder)+1});
				}
			}
		});
	}	
		
	/* check active tab & call corresponding method */
	if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING) {
		if (typeof objNotes != 'undefined' && objNotes) {
			oSelf.prepareReadingData();
		}
		else {
			loadJS(oSelf.CONSTANTS.c_s_TAB_READING_NOTES_JS, function () {
				oSelf.prepareReadingData();
			});
		}
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {
		if (typeof objPerformanceInfoData != 'undefined' && objPerformanceInfoData) {
			oSelf.prepareSummaryData();
		}
		else {
			loadJS(oSelf.CONSTANTS.c_s_PERFORMANCE_INFO_JS, function () {
				oSelf.prepareSummaryData();
			});
		}
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADING_PERIOD) {
		oSelf.prepareGradingData();
	}
	else {	
		oSelf.oGridDataModel = oModel;	
		
		/* Reject Extra Practices Which are not Sent to any student */
		_.each(oModelExtraPractice, function (oAssignmentList, iWeek) {
			_.each(oAssignmentList, function (oExtraAssignment, key) {
				_.each(oExtraAssignment, function (oAssignments, catg) {
					oModelExtraPractice[iWeek][key][catg] = _.reject(oAssignments, function(obj){ return $.inArray(obj['IID'], oSelf.aSentExtraPractices) == -1; });	
				});
			});
		});
		
		oSelf.oGridDataModelExtraPractice = oModelExtraPractice;	
			
		oSelf.renderGrid();
	}
};


/**
 * Process before rendering data for Summary Tabs
 * @method prepareSummaryData 
 * @return 
 */
AssignmentInstructor.prototype.prepareSummaryData = function () {
	var oSelf = this,
		model = oSelf.model,
		aModel = [],
		aStudentList = _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [],
		iTotBooksReviewed = 0,
		iBooksRead = 0,
		iBooksCompleted = 0,
		iTotWordCount = 0,
		iBooksReviewOutstanding = 0,
		oModel = {},
		iCurrentWeekRange = Math.ceil(oSelf.currentWeek / 5),
		sGradeCode = objUnitDetails.gradeCode || "gbe",
		iUserLexileLevel = 0,		
		iUserReadingLevel = 0,
		oLibraryProgress = {},
		oLibraryProgressAll = {},
		aWeeks = [],
		aULL = [],
		iAvgGLE = 0,
		iInitialGLE = 0,
		iInitialReadingGLE = objPerformanceInfoData.WeekLexileGLEMap[sGradeCode].gleInfo,
		oUserLexileLevelDetails = {},
		oAttemptData = {},
		sStatus = ''
		sDisplayTextStatus = '';		
		
	oSelf.aCatgHeader = oSelf.CONSTANTS.c_s_SUMMARY_HEADER;	
	
	/* Iterate each student list */
	for (var iJ = 0; iJ < aStudentList.length; iJ++) {
		iUserLexileLevel = aStudentList[iJ].UserCurrentLexileLevel;
		iUserReadingLevel = aStudentList[iJ].UserCurrentReadingLevel;
		oLibraryProgress = _.where(objLibraryProgressDetailForClass.Content, {"StudentID":aStudentList[iJ].UserID, "BookCompleted":true});
		oLibraryProgressAll = _.where(objLibraryProgressDetailForClass.Content, {"StudentID":aStudentList[iJ].UserID});		
		
		iBooksCompleted = _.size(oLibraryProgress);
		iBooksRead = _.size(oLibraryProgressAll);
		
		/* Iterate Books Read */
		iTotBooksReviewed = 0;
		iTotWordCount = 0;
		for (var iK = 0; iK < iBooksRead; iK++) {
			iTotBooksReviewed += (oLibraryProgressAll[iK]["BookReviewCompleted"] && oLibraryProgressAll[iK]["BookCompleted"]) ? 1 : 0;
			iTotWordCount += parseInt(oLibraryProgressAll[iK]["WordCount"]);
		}
		iBooksReviewOutstanding = iBooksCompleted - iTotBooksReviewed;
		
		/* Initial Reading Level (GLE) & Avg. Readig Level (GLE) */
		oUserLexileLevelDetails = _.where(objGetClassUserLevel.Content, {"StudentId": aStudentList[iJ].UserID});
		aULL = _.sortBy(JSON.parse(decodeURIComponent(oUserLexileLevelDetails[0].UserLexileLevelDetails)), "W");
		iInitialGLE = 0;
		iAvgGLE = 0;				
		/* Iterate User Lexile Level for all weeks and fetch its mapping GLE from JSON */
		for (var iL = 0; iL < aULL.length; iL++) {
			$.each (iInitialReadingGLE, function (id, val) {
				aWeeks = id.split("-");				
				if (parseFloat(aULL[iL]['W']) >= parseFloat(aWeeks[0]) && parseFloat(aULL[iL]['W']) <= parseFloat(aWeeks[1])){
					iInitialGLE = aULL[iL]['W'] == 1 && !isNaN(val[aULL[iL]['L']]['GLE']) ? parseFloat(val[aULL[iL]['L']]['GLE']) : iInitialGLE;
					iAvgGLE += val[aULL[iL]['L']]['GLE'] && !isNaN(val[aULL[iL]['L']]['GLE']) ? parseFloat(val[aULL[iL]['L']]['GLE']) : 0;					
				}				
			});			
		}
		iAvgGLE = aULL.length ? (iAvgGLE/aULL.length).toFixed(1) : 0;	

		iTotWordCount += iIWTTotWordCount[aStudentList[iJ].UserID] ? iIWTTotWordCount[aStudentList[iJ].UserID] : 0;
		
		oModel[aStudentList[iJ].UserID] = [
			aStudentList[iJ].UserDisplayName,
			aStudentList[iJ].UserCurrentLexileLevel,
			aStudentList[iJ].UserCurrentReadingLevel,					
			aStudentList[iJ].UserCurrentLexileLevel ? iInitialGLE : '',
			aStudentList[iJ].UserCurrentLexileLevel ? iAvgGLE : '',			
			aStudentList[iJ].UserCurrentLexileLevel ? (iAvgGLE - iInitialGLE).toFixed(1) : '',
			oSelf.oAssignmentCompleted[aStudentList[iJ].UserID]+'||'+oSelf.oAssignmentInComplete[aStudentList[iJ].UserID],
			iTotBooksReviewed+'||'+iBooksReviewOutstanding,
			iTotWordCount.format(0, 3)
		];		
	}
	
	oSelf.oGridDataModel = oModel;
	oSelf.renderGrid();
}

/**
 * Process before rendering data for Reading Tabs
 * @method prepareReadingData 
 * @return 
 */
AssignmentInstructor.prototype.prepareReadingData = function () {
	var oSelf = this,
		model = oSelf.model,
		oModel = {},
		iBooksCompleted = 0,
		iBooksReadAll = 0,
		iTotLexileLevel = 0,
		iAvgLexileLevel = 0,
		iUserLexileLevel = 0,
		iTotTimeSpent = 0,
		iTotWordCount = 0,		
		sTargetGradeCode = objUnitDetails.targetGradeCode,
		aStudentList = _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [],
		iBaseLineWPM = objNotes['avg-wpm'][sTargetGradeCode]['base-line-wpm'],
		iWPMVariation = objNotes['avg-wpm'][sTargetGradeCode]['wpm-variance'],		 
		oWPMComments = objNotes['avg-wpm'][sTargetGradeCode]['comments'],
		iLexileVariation = objNotes['avg-lexile']['lexile-variance'],
		oLexileComments = objNotes['avg-lexile']['comments'],
		sComment = "",		
		oLibraryProgressCompleted = {},
		oLibraryProgressAll = {};		
	
	oSelf.oBooksCompletedIDs = {};		
	oSelf.aCatgHeader = oSelf.CONSTANTS.c_s_READING_HEADER;		
	
	/* Iterate each student list */
	for (var iJ = 0; iJ < aStudentList.length; iJ++) {	
		iUserLexileLevel = aStudentList[iJ].UserCurrentLexileLevel;
		oLibraryProgressAll = _.where(objLibraryProgressDetailForClass.Content, {"StudentID":aStudentList[iJ].UserID});		
		
		iBooksReadAll = _.size(oLibraryProgressAll);
		
		/* Iterate Books Read */
		iTotLexileLevel = 0;
		iTotTimeSpent = 0;
		iTotWordCount = 0;
		iBooksCompleted = 0;
		if (typeof oSelf.oBooksCompletedIDs[aStudentList[iJ].UserID] == "undefined") { oSelf.oBooksCompletedIDs[aStudentList[iJ].UserID] = []; }
		for (var iK = 0; iK < iBooksReadAll; iK++) {
			iTotLexileLevel += oLibraryProgressAll[iK]["BookCompleted"] ? parseInt(oLibraryProgressAll[iK]["ItemLexileLevel"]) : 0; /*completed books lexile*/					
			iBooksCompleted += oLibraryProgressAll[iK]["BookCompleted"] ? 1 : 0;
			if (oLibraryProgressAll[iK]["BookCompleted"]) {
				oSelf.oBooksCompletedIDs[aStudentList[iJ].UserID].push(oLibraryProgressAll[iK]["ItemID"]);					
			}
			iTotTimeSpent += parseInt(oLibraryProgressAll[iK]["TimeSpent"]);			
			iTotWordCount += parseInt(oLibraryProgressAll[iK]["WordCount"]);
		}		
		
		iAvgLexileLevel = (iBooksCompleted && !isNaN(iTotLexileLevel) && !isNaN(iBooksCompleted)) ? Math.round(iTotLexileLevel/iBooksCompleted) : 0;
		iAvgWrodsPerMin = (iBooksReadAll && !isNaN(iTotWordCount) && !isNaN(iTotTimeSpent) && iTotTimeSpent) ? Math.round(iTotWordCount/(iTotTimeSpent/60)) : 0;
		
		/* automated comments */
		sComment = "";		
		if (iAvgWrodsPerMin) {
			/* Avg. WPM comments */
			if (iAvgWrodsPerMin < iBaseLineWPM - iWPMVariation) {
				sComment = oWPMComments['below-variance'];
			}
			else if (iAvgWrodsPerMin > iBaseLineWPM + iWPMVariation) {
				sComment = oWPMComments['above-variance'];
			}
			else {
				sComment = oWPMComments['within-variance'] || "";
			}
		}		
		if (iAvgLexileLevel) {
			/* Avg. Lexile comments */
			if (iAvgLexileLevel < iUserLexileLevel - iLexileVariation) {				
				sComment += sComment ? ", "+oLexileComments['below-variance'] : oLexileComments['below-variance'];
			}
			else if (iAvgLexileLevel > iUserLexileLevel + iLexileVariation) {
				sComment += sComment ? ", "+oLexileComments['above-variance'] : oLexileComments['above-variance'];
			}
			else {
				sComment += sComment ? ", "+oLexileComments['within-variance'] || "" : oLexileComments['within-variance'] || "";
			}
		}
		
		if (typeof oModel[aStudentList[iJ].UserID] == 'undefined') {oModel[aStudentList[iJ].UserID] = [];}
		
		iLexileDelta = iBooksCompleted ? Math.round(iAvgLexileLevel - iUserLexileLevel).format(0, 3) : "";
		
		oModel[aStudentList[iJ].UserID].push([			
			iBooksCompleted,
			iUserLexileLevel,
			iAvgLexileLevel.format(0, 3),
			iLexileDelta,
			iAvgWrodsPerMin.format(0, 3),
			'view',
			sComment			
		]);	
	}		
	oSelf.oGridDataModel = oModel;	
	oSelf.renderGrid();
}

/**
 * Process before rendering data for Grading Period Tabs
 * @method prepareGradingData 
 * @return 
 */
AssignmentInstructor.prototype.prepareGradingData = function () {
	var oSelf = this,
		model = oSelf.model,
		oModel = {},				
		sTargetGradeCode = objUnitDetails.targetGradeCode,
		aStudentList = _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [];		
		
	oSelf.aCatgHeader = oSelf.CONSTANTS.c_s_GRADING_HEADER;		
	
	/* Iterate each student list */
	for (var iJ = 0; iJ < aStudentList.length; iJ++) {			
		
		if (typeof oModel[aStudentList[iJ].UserID] == 'undefined') {oModel[aStudentList[iJ].UserID] = [];}
		
		oModel[aStudentList[iJ].UserID].push([			
			1,			
			2,
			3,
			4,
			5			
		]);	
	}	
	
	oSelf.oGridDataModel = oModel;	
	oSelf.renderGrid();
}


/**
 * Render Assignment & Grade Grid
 * @method renderGrid 
 * @return 
 */
AssignmentInstructor.prototype.renderGrid = function () {
	var oSelf = this,
		currentWeek = null;	
	
	if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT) {
		if (!oSelf.bAutoRefresh) {
			$("#dashboard-grid").html(
				_.template($("#dashboard-content").html(), 
					{
						"data": oSelf.oGridDataModel[oSelf.currentWeek] || {},					 
						"dataExtraPractice": oSelf.oGridDataModelExtraPractice[oSelf.currentWeek] || {},					 
						"iCountExtraPractice": oSelf.aExtraAssignmentPerStud[oSelf.currentWeek] || {},					 
						"dataHeader":oSelf.aCatgHeader[oSelf.currentWeek] /* oSelf.oAssignmentCategories */, 
						"dataCategoryOrder": oSelf.oCategotyArrayOrderWise, 
						"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
						"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS,
						"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
					})
			);
		}
		$("#assignment-data-grid").html(
			_.template($("#dashboard-content-data").html(), 
				{
					"sLeftSlidePx": oSelf.sLeft ? oSelf.sLeft : "0px",
					"iTotCols": $("#iTotCols").val(),
					"iHeaderCatCnt": $("#iHeaderCatCnt").val(),
					"data": oSelf.oGridDataModel[oSelf.currentWeek] || {},					 
					"dataExtraPractice": oSelf.oGridDataModelExtraPractice[oSelf.currentWeek] || {},					 
					"iCountExtraPractice": oSelf.aExtraAssignmentPerStud[oSelf.currentWeek] || {},					 
					"dataHeader":oSelf.aCatgHeader[oSelf.currentWeek] /* oSelf.oAssignmentCategories */, 
					"dataCategoryOrder": oSelf.oCategotyArrayOrderWise, 
					"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
					"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS,
					"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
				})
		);
		// in case of withdraw assignment
		if (oSelf.bAutoRefresh) {
			oUtility.hideLoader(); 
		}		
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE) {
		if (!oSelf.bAutoRefresh) {
			$("#dashboard-grid").html(
				_.template($("#dashboard-grade").html(), 
					{
						"data": oSelf.oGridDataModel || {},					 
						"dataHeader": oSelf.aCatgHeader, 
						"dataCategoryOrder": oSelf.oGradeOrder,
						"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
						"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS,
						"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
					})
			);
		}
		if (!$(".table-slider-with").hasClass("gle-view")) {
			$("#grade-data-grid").html(
				_.template($("#dashboard-grade-data").html(), 
					{
						"iTotCols": $("#iTotCols").val(),
						"iHeaderCatCnt": $("#iHeaderCatCnt").val(),
						"data": oSelf.oGridDataModel || {},					 
						"dataHeader": oSelf.aCatgHeader, 
						"dataCategoryOrder": oSelf.oGradeOrder,
						"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
						"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS,
						"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
					})
			);
		}
		else {
			oSelf.toggleGleView.call($(".grade-expand.expanded"), oSelf);
		}
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) {		
		if (!oSelf.bAutoRefresh) {
			$("#dashboard-grid").html(
				_.template($("#dashboard-summary").html(), 
					{
						"data": oSelf.oGridDataModel || {},					 
						"dataHeader":oSelf.aCatgHeader, 
						"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
						"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS_SUMMARY,
						"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
					})
			);		
		}
		$("#summary-data-grid").html(
			_.template($("#dashboard-summary-data").html(), 
				{
					"data": oSelf.oGridDataModel || {},					 
					"dataHeader":oSelf.aCatgHeader, 
					"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
					"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS_SUMMARY,
					"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
				})
		);
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_READING) {
		/* Load outer frame only on autorefresh */
		if (!oSelf.bAutoRefresh) {
			$("#dashboard-grid").html(
				_.template($("#dashboard-reading").html(), 
					{
						"data": oSelf.oGridDataModel || {},					 
						"dataHeader":oSelf.aCatgHeader || {}, 
						"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
						"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS_READING,
						"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
					})
			);
		}		
		$("#reading-data-grid").html(
			_.template($("#dashboard-reading-data").html(), 
				{
					"iHeaderCatCnt": $("#iHeaderCatCntReading").val(),
					"data": oSelf.oGridDataModel || {},					 
					"dataHeader":oSelf.aCatgHeader || {}, 
					"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
					"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS_READING,
					"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
				})
		);
		
	}
	else if (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADING_PERIOD) {
		$("#dashboard-grid").html(
			_.template($("#dashboard-grading").html(), 
				{					
					"data": oSelf.oGridDataModel || {},					 
					"dataHeader":oSelf.aCatgHeader || {}, 
					"aStudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [], 
					"gridCols": oSelf.CONSTANTS.c_i_GRID_COLUMS_READING,
					"sNoData": oSelf.CONSTANTS.c_s_NO_DATA_FOUND
				})
		);
	}	
	
	oUtility.hideLoader();
	
	// if no data mssg found then show background color
	if ($(".msg-container").length) {
		$(".table-slider-with").addClass("no-data");
	}

	// number of slides in grid
	oSelf.iSlideCount = Math.ceil($(".table-column2 .table-row-header .paddingtitle").length / oSelf.CONSTANTS.c_i_GRID_COLUMS);		
			
	oSelf.bindEvents();	
	oSelf.resize();	
	
	if (oSelf.bAutoRefresh == true) {
		oSelf.bAutoRefresh = false;
	}
	else {
		oSelf.oAutoRefreshInterval = setInterval(function () {			
			oSelf.autoRefresh();
		}, oSelf.CONSTANTS.c_i_AUTO_REFRESH_TIMEOUT);	
	}
}

/**
 * Initialize Week Swiper 
 * @method initSwiper 
 * @return 
 */
AssignmentInstructor.prototype.initSwiper = function () {
	var oSelf = this;
	
	oSelf.mySwiper = $('.swiper-container').swiper({
		height: 'auto', 
		noSwiping: true,
		queueEndCallbacks:true,
		onSlideChangeEnd: function(swiper) {
			oSelf.pagingButtonShowHide(swiper.activeIndex, swiper.slides.length);
		}
	});	
	
	oSelf.resizeSwiper();
	oSelf.pagingButtonShowHide(oSelf.mySwiper.activeIndex, oSelf.mySwiper.slides.length);
}

/**
 * Resize Week Swiper
 * @method resizeSwiper 
 * @return 
 */
AssignmentInstructor.prototype.resizeSwiper = function () {
	var _iRestrictedHeight = 105;
	
	$('.swiper-wrapper').css('height' , _iRestrictedHeight + 'px');
	$('.swiper-slide').css('height' , _iRestrictedHeight + 'px');
}

/**
 * Manage Previous/Next Buttons of Week Swiper
 * @method pagingButtonShowHide 
 * @return 
 */
AssignmentInstructor.prototype.pagingButtonShowHide = function (currentIdx, sliderLength) {
	var oSelf = this,
		counter = parseInt(currentIdx) + 1;
	
	if (sliderLength == 1) {
		$('#prevPagingBtn').hide();
		$('#nextPagingBtn').hide();
	}
	else {
		if (counter == 1) {
			$('#prevPagingBtn').hide();
			$('#nextPagingBtn').show();
		}
		else if (counter >= sliderLength) { 
			$('#nextPagingBtn').hide();
			$('#prevPagingBtn').show();
		}
		else { 
			$('#prevPagingBtn').show();
			$('#nextPagingBtn').show();
		}
	}
};

/**
 * Bind Events to Elements
 * @method bindEvents 
 * @return 
 */
AssignmentInstructor.prototype.bindEvents = function () {
	var oSelf = this;			
	
	/* // Week Slider
	$(".week-no").off('click').on('click', function () {		
		oSelf.setWeek.call(this, oSelf);
	}); */
	
	/* $("#prevPagingBtn").off('click').on('click', function () {
		//oSelf.mySwiper.swipePrev();
		//oSelf.setWeek.call($(".wee-no .slick-current"), oSelf);
	});
	
	$("#nextPagingBtn").off('click').on('click', function () {
		//oSelf.mySwiper.swipeNext();
	}); */

	// Tab Click
	$(".table-slider-tabs li a").off('click').on('click', function () {		
		oSelf.setView.call(this, oSelf);
	});

	// Grid Slider Next Prev
	$(".slide-pagination .right-sl").off('click').on('click', function () {
		oSelf.swipeNextGrid.call(this, oSelf);
	});
	
	$(".slide-pagination .left-sl").off('click').on('click', function () {
		oSelf.swipePrevGrid.call(this, oSelf);
	});
	
	// Assignment Grid Cell Click
	$(".assignment-grid .table-column2 .partname-qty").off('click').on('click', function () {
		oSelf.openScorePopup.call(this, oSelf);		
		oSelf.showTooltipOnStatusClick.call(this, oSelf);		
	});
	
	$(".assignment-grid .table-column2 .partname").off('click tap').on('click tap', function () {       
        oSelf.showTooltipOnTitleClick.call(this, oSelf);        
    });	
	
	// Grade Grid Cell Click
	$(".grade-grid .table-column2 .partname100").off('click tap').on('click tap', function () {				
		oSelf.showTooltipOnStatusClick.call(this, oSelf);		
	});
	
	$(".grade-grid .table-column2 .gradeTitle").off('click tap').on('click tap', function () {       
        oSelf.showTooltipOnTitleClick.call(this, oSelf);        
    });	
	
	// Grade - GLE View Expand
	$(".grade-expand").off('click').on('click', function () {
		$(".grade-expand").removeClass("expanded");
		$(this).addClass("expanded");
		oSelf.toggleGleView.call(this, oSelf);
	});
	
	// Recommended View click
	$(".view-recommended").off('click').on('click', function () {
		oSelf.showRecommendedPopup.call(this, oSelf);
	});
	
	// Reading - Books Read click
	$(".books-read").off('click').on('click', function () {
		oSelf.showBooksReadPopup.call(this, oSelf);
	});
	
	// Student Cell Click
	$(".table-column .student-title").off('click tap').on('click tap', function () {       
        oSelf.showTooltipOnStudentClick.call(this, oSelf);        
    });
	
	$(".summary-grid .student-title").off('click tap').on('click tap', function () {       
        oSelf.showTooltipOnStudentClick.call(this, oSelf);        
    });
	
	$(document).off('click tap').on('click tap', function (event) {	
		
		if (
			$(event.target).hasClass("partname50") || 
			$(event.target).hasClass("gradeTitle") || 
			$(event.target).hasClass("grade-title-txt") || 
			$(event.target).hasClass("partname100") || 
			$(event.target).hasClass("item-name") || 
			$(event.target).hasClass("student-title")
		) {
			event.stopPropagation();
		}
		else {
			oSelf.removeBubble();  
		}
    });
};

/**
 * Open Recommended Pop up
 * @method showRecommendedPopup 
 * @return 
 */
AssignmentInstructor.prototype.showRecommendedPopup = function (oSelf) {
	var sSID = $(this).attr("data-SID"),
		oBookInfo = {},
		oData = {},
		aBookData = [],
		fCallback = function () {						
			oData = objrecommendationListData.Content;			
			var i = 0;
			_.each (oData, function (data, k) {								
				oBookInfo = _.where(objBookList.bookset[0], {"book_id": data["CMSItemID"]});
				if (oBookInfo.length) {
					i++;
					if (i > 5) { return; }
					aBookData.push(oBookInfo[0]);
				}
			});
			
			$("#PopupArea").html(_.template($("#recommendedTemplate").html(), {
				"data": aBookData,
				"sTitle": "Recommended Books",
				"noBooksMsg": oSelf.CONSTANTS.c_s_NO_BOOKS_RECOMMENDED
			}));
			
			/* bind popup */
			$("#recommendedPopUpCloseBtn").off("click").on("click", function () {				
				$("#PopupArea").html('');
			});
			$(".book-cover-slide").off("click").on("click", function () {
				$(".book-cover-slide").removeClass("active");
				$(this).addClass("active");
				var oBookDetl = _.where(objBookList.bookset[0], {"book_id": $(this).attr("data-book-id")});
				$("#recommended-book-detail").html(_.template($("#bookTemplate").html(), {
					"data": oBookDetl[0]
				}));
			});
			
			oUtility.hideLoader();			
		},
		fSchedueCheck = function () {
			if (typeof objBookList != "undefined" && objBookList != null) {
				fCallback();
			}
			else {
				setTimeout(fSchedueCheck, 500);
			}
		};	
	
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0.5
	});
	objrecommendationListData = null;
	$.nativeCall({
		'method': 'GetRecommendedBooks',
		'inputParams':	[sSID],
		'globalResource': 'objrecommendationListData',		
		'onComplete': function () {
			setTimeout(fSchedueCheck, 500);
		}
	});
        	
}

/**
 * Open Books Read Pop up
 * @method showBooksReadPopup 
 * @return 
 */
AssignmentInstructor.prototype.showBooksReadPopup = function (oSelf) {
	var sSID = $(this).attr("data-SID"),
		oBookInfo = {},
		oData = {},
		aBookData = [];		
	
	oSelf.iRecommendPopSlideVisible = 1;
	
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0.5
	});
	
	oData = oSelf.oBooksCompletedIDs[sSID];			
	var i = 0;
	_.each (oData, function (data, k) {								
		oBookInfo = _.where(objBookList.bookset[0], {"book_id": data});
		if (oBookInfo.length) {
			i++;
			//if (i > 5) { return; }
			aBookData.push(oBookInfo[0]);
		}
	});
	
	$("#PopupArea").html(_.template($("#recommendedTemplate").html(), {
		"data": aBookData,
		"sTitle": "Books Read",
		"noBooksMsg": oSelf.CONSTANTS.c_s_NO_BOOKS_READ
	}));
	
	/* bind popup */
	$("#recommendedPopUpCloseBtn").off("click").on("click", function () {				
		$("#PopupArea").html('');
	});
	$("#prevRecommendBtn").off("click").on("click", function () {				
		oSelf.swipePrevRecommend.call(this, oSelf);
	});
	$("#nextRecommendBtn").off("click").on("click", function () {				
		oSelf.swipeNextRecommend.call(this, oSelf);
	});
	$(".book-cover-slide").off("click").on("click", function () {
		$(".book-cover-slide").removeClass("active");
		$(this).addClass("active");
		var oBookDetl = _.where(objBookList.bookset[0], {"book_id": $(this).attr("data-book-id")});
		$("#recommended-book-detail").html(_.template($("#bookTemplate").html(), {
			"data": oBookDetl[0]
		}));
	});
	
	oUtility.hideLoader();	        	
}

/**
 * Swipe to Next Page in Recommend or Books Read Popup
 * @method swipeNextRecommend
 * @return 
 */
AssignmentInstructor.prototype.swipeNextRecommend = function (oSelf) {
	var fSlideWidth = $(".toprecommended_shorting").width(),
		iSlideVisible = oSelf.iRecommendPopSlideVisible,
		iSlideCount = $(".recommended-pop .book-cover-slide").length ? Math.ceil($(".recommended-pop .book-cover-slide").length/5) : 1;
		
	if ($(this).hasClass('disabled')) {
		return;
	}

	oSelf.iRecommendPopSlideVisible++;
	$(".Popup_student_inner").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show prev button
	$('#prevRecommendBtn').removeClass("disabled").show();

	// hide next button if on last slide
	if (oSelf.iRecommendPopSlideVisible == iSlideCount) {		
		$('#nextRecommendBtn').addClass("disabled").hide();
	}	
}

/**
 * Swipe to Next Page in Recommend or Books Read Popup
 * @method swipePrevRecommend
 * @return 
 */
AssignmentInstructor.prototype.swipePrevRecommend = function (oSelf) {
	var fSlideWidth = $(".toprecommended_shorting").width(),
		iSlideVisible = oSelf.iRecommendPopSlideVisible - 2;
		
	if ($(this).hasClass('disabled')) {
		return;
	}
	
	oSelf.iRecommendPopSlideVisible--;
	$(".Popup_student_inner").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show next button
	$('#nextRecommendBtn').removeClass("disabled").show();
	
	// hide prev button if on first slide
	if (oSelf.iRecommendPopSlideVisible == 1) {		
		$('#prevRecommendBtn').addClass("disabled").hide();
	}	
}

/**
 * Open View Tooltip on Assignment Title Click
 * @method showTooltipOnTitleClick 
 * @return 
 */
AssignmentInstructor.prototype.showTooltipOnTitleClick = function (oSelf) {	
	var	sTitle = $(this).attr("data-title") || $(this).attr("data-item-name") || "",
		sItemId = $(this).attr("data-IID") || $(this).attr("data-itemID"),
		sStudentId = $(this).attr("data-SID"),
		sItemAttemptId = $(this).attr("data-IAID"),		
		sAssignmentSubType = $(this).attr("data-ISUBTYPE"),
		readingLevel = 0,
		fTop  = $(this).offset().top + 15,
		fLeft = $(this).offset().left + $(this).width()/2,
		$html = null,
		buttonObj = null;	
	
	if (sTitle == "") {
		oSelf.removeBubble();
		return;
	}	

	/* if($("#catInfoBubble").length) {
		$("#catInfoBubble").remove();
	} */
	if ($("#itemBubble").length) {
		var $bubbleItemId   =   $("#itemBubble").attr('data-item');
		var $bubbleStudId   =   $("#itemBubble").attr('data-student');
		$("#itemBubble").remove();
		if ($bubbleItemId == sItemId && $bubbleStudId == sStudentId) {
			return false;
		}
	}
	
	/*
	if ($(this).find(".qs_ans").hasClass('sprite')) {
		$(this).find(".qs_ans").trigger('click');
		return false;
	}
	
	if ($(".qs_ans").hasClass('sprite')) {
		return false;
	}
	
	var top     = $(this).offset().top + 50;
	var left    = $(this).offset().left - 75;
	
	var numbering   	= $(this).find(".qs_num").text();
	var title       	= $(this).find(".qst_content").data().title;
	var readingLevel  	= $(this).find(".qs_ans").attr("item-level");
	var itemId      	= $(this).find(".qs_ans").data().item;
	var itemAttemptId   = $(this).find(".qs_ans").data().itemattemptid;
	var isSendToClass   =   false;
	var isSentToClass   =   false;
	*/	
	
	if(sAssignmentSubType == 'studyplan') {
		buttonObj = {
			"0" : {
				class: "viewButt studyPlanHeaderBubble",
				text: "Pre"
			},
			"1" : {
				class: "viewButt studyPlanHeaderBubble",
				text: "Practice"
			},
			"2" : {
				class: "viewButt studyPlanHeaderBubble",
				text: "Post"
			}
		}
	} else {
		buttonObj   = {
			"0" : {
				class: "viewButt",
				text: ASSIGNMENT_INSTRUCTOR.c_i_VIEW_BUTTON
			}   
		};
	}        
	
	/*
	$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"']").each(function () {            
		if($(this).prev('.statusText').attr('data-text')  ==  '') {
			isSendToClass   =   true;                                
		}
		
		if($(this).prev('.statusText').attr('data-text')  !=  '' && $(this).prev('.statusText').attr('data-text') != ASSIGNMENT_INSTRUCTOR.c_s_SCORE_ASSIGNMENT_TXT && $(this).attr('data-finalscore') == 0) {
			isSentToClass   =   true;                                
		}
	});
			
	var maxKeys =   parseInt(Math.max.apply(Math, Object.keys(buttonObj)));                
	
	//  For "Send To Class" Button For Entire Column
	if(isSendToClass) {
		buttonObj[++maxKeys] = {
			class: "SendToClass",
			text: ASSIGNMENT_INSTRUCTOR.c_i_SEND_CLASS_BUTTON
		};           
	}
	
	//  For "Withdraw" Button For Entire Column
	if(isSentToClass) {
		buttonObj[++maxKeys] = {
			class: "WithdrawFromClass",
			text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
		};         
	}                        
	
   */
	
	$html   =   _.template($("#infoBubble").html(),{
		"title" : sTitle,      
		"readingLevel" : (sAssignmentSubType == 'iwt') ? readingLevel : 0,
		"itemId": sItemId,
		"itemAttemptId": sItemAttemptId,
		"studentId": "",
		"buttonObj" : buttonObj
	});
	
	$('body').append($html);        
	
	var ViewPortWidth   =   document.documentElement.clientWidth;
	var ViewPortHeight  =   document.documentElement.clientHeight;
	var tooltipWidth    =   $('.lesson_tooltip').width();
	var tooltipHeight    =   $('.lesson_tooltip').height();
	
	// Update Top For Bottom Pointed Tooltip
    if (fTop + $(this).height() + tooltipHeight > ViewPortHeight) {
        $('#itemBubble').addClass('btm_tooltip');
        fTop =   fTop - $(this).height() - tooltipHeight;
    } 
	if (fLeft + $(this).width() + tooltipWidth > ViewPortWidth) {
		fLeft =   fLeft - (tooltipWidth / 2) + 30;
		$(".lesson_toolls").find(".page_arrow").css({'left': '+=' + ((tooltipWidth / 2) - 30) + 'px'});
	} 	

	$("#itemBubble").css({
	   'position' : 'absolute',
	   'left' : fLeft + "px",           
	   'opacity': 1,
	   'top' : fTop + "px"
	});
	
	/* if(maxKeys  >=  3) {            
		$(".Tooltip_menu_wrap_inn li").css({'padding': '5px 2px'});
	} */
	
	//AssignmentContainerView.sendToClass(itemId);
	//AssignmentContainerView.withDrawAssignment('column');
	oSelf.viewAssignment('column',$(this));
	return false;
}

/**
 * Open View Tooltip on Student Click
 * @method showTooltipOnStudentClick 
 * @return 
 */
AssignmentInstructor.prototype.showTooltipOnStudentClick = function (oSelf) {	
	var	sStudentId = $(this).attr("data-SID"),
		sStudentName = $(this).text(),
		fTop  = $(this).offset().top + 5,
		fLeft = ($(this).offset().left + $(this).width()/2) + 50,
		$html = null,
		buttonObj = null;
		
	if ($("#itemBubble").length) {		
		var $bubbleStudId   =   $("#itemBubble").attr('data-student');
		$("#itemBubble").remove();
		if ($bubbleStudId == sStudentId) {
			return false;
		}
	}
	
	buttonObj   = {
		"0" : {
			class: "viewButt",
			text: "View Inventory"
		},
		"1" : {
			class: "viewButt",
			text: "View Reviews"
		}
	};	
	
	$html   =   _.template($("#infoBubble").html(),{
		"title" : sStudentName,      
		"readingLevel" : 0,
		"itemId": "",
		"itemAttemptId": "",
		"studentId": sStudentId,
		"buttonObj" : buttonObj
	});
	
	$('body').append($html);        
	
	var ViewPortWidth   =   document.documentElement.clientWidth;
	var ViewPortHeight  =   document.documentElement.clientHeight;
	var tooltipWidth    =   $('.lesson_tooltip').width();
	var tooltipHeight    =   $('.lesson_tooltip').height();
	
	// Update Top For Bottom Pointed Tooltip
    if (fTop + $(this).height() + tooltipHeight > ViewPortHeight) {
        $('#itemBubble').addClass('btm_tooltip');
        fTop =   fTop - $(this).height() - tooltipHeight;
    } 
	if (fLeft + $(this).width() + tooltipWidth > ViewPortWidth) {
		fLeft =   fLeft - (tooltipWidth / 2) + 30;
		$(".lesson_toolls").find(".page_arrow").css({'left': '+=' + ((tooltipWidth / 2) - 30) + 'px'});
	} 	
	else {
		$(".lesson_toolls").find(".page_arrow").css({'left': '-=' + (tooltipWidth / 4) + 'px'});
	}

	$("#itemBubble").css({
	   'position' : 'absolute',
	   'left' : fLeft + "px",           
	   'opacity': 1,
	   'top' : fTop + "px"
	});	
	
	/* bind events */
	$(".viewButt").off('click').on('click', function () {
		oSelf.openInventoryOrReviews.call(this, oSelf);
	});
	
	return false;
}


/**
 * Open View Tooltip on Assignment Status Click
 * @method showTooltipOnStatusClick 
 * @return 
 */
AssignmentInstructor.prototype.showTooltipOnStatusClick = function (oSelf) {
	var	sTitle = $(this).attr("data-title") || $(this).attr("data-item-name") || "",
		sItemId = $(this).attr("data-IID") || $(this).attr("data-itemID") || $(this).attr("data-item"),
		sStudentId = $(this).attr("data-SID") || $(this).attr("data-student"),
		sFinalScore = $(this).attr("data-FS"),
		sItemAttemptId = $(this).attr("data-IAID"),
		sCurrentStatus = $.trim($(this).text()),
		sAssignmentSubType = $(this).attr("data-ISUBTYPE"),
		readingLevel = 0,
		fTop  = $(this).offset().top + 15,
		fLeft = $(this).offset().left + $(this).width()/2,
		$html = null,
		buttonObj = null,
		objItem = {
			"extrapractice": "No",
			"finalscore": sFinalScore,
			"item": sItemId,
			"itemattemptid": sItemAttemptId,
			"itemtype": sAssignmentSubType,
			"reassign": "",
			"student": sStudentId
		};	
		
	if ((sTitle == "" && sItemId == "") || sCurrentStatus == "") {
		oSelf.removeBubble();
		return;
	}
	
	//  Do not show info bubble if status is Score
	if (sCurrentStatus === ASSIGNMENT_INSTRUCTOR.c_s_SENT_COMPLETED_TXT) {              
		if(sFinalScore == 0) {
		  return;
		}	  
	}
	
	/* if($("#catInfoBubble").length) {
		$("#catInfoBubble").remove();
	} */
	
	if($("#itemBubble").length) {
		var $bubbleItemId   =   $("#itemBubble").attr('data-item');
		var $bubbleStudId   =   $("#itemBubble").attr('data-student');            
		$("#itemBubble").remove();                            
		if ($bubbleItemId == sItemId && $bubbleStudId == sStudentId) {
			return false;
		}
	}
			
	//  Check If Sprite Is Displaying, Then make It Active And Stop Execution Further
	/* if($(this).find(".qs_ans").hasClass('sprite')) {
		$(this).find(".qs_ans").trigger('click');
		return false;
	} */
	
	// If Sprite is displaying dont show any info bubble
	/* if($(".qs_ans").hasClass('sprite')) {
		return false;
	} */
		   
	
	if(sCurrentStatus != ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT) {            
		sCurrentStatus  =   sCurrentStatus.split(" ")[0];   //  To Remove The Reassign Number Within Bracket
	}
	
	//  Status = Scored
	if (sFinalScore != 0) {
		oSelf.infoBubble($(this), objItem, 'scored');
		//oSelf.withDrawAssignment('cell');
		oSelf.viewAssignment('cell', $(this));
		return false;
	}
	
	// If Status == Sent || Status == In Progress , Display Bubble
	if (
		sCurrentStatus == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT || 
		sCurrentStatus == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT
	) {
		oSelf.infoBubble($(this), objItem, sCurrentStatus);
		oSelf.withDrawAssignment('cell');
		oSelf.viewAssignment('cell', $(this));
		return false;
	}
	
	
	
	//  Status = Scored && Final Score == 0
	if (sFinalScore == 0) {
		oSelf.infoBubble($(this), objItem, 'scored');
		//oSelf.withDrawAssignment('cell');
		oSelf.viewAssignment('cell', $(this));
		return false;
	}
	event.stopPropagation();
}


/**
 * $(this) Object
 * @param {Object} $obj
 * @param {Object} objItem
 * @param {String} psStatus
 * @returns {undefined}
 */
AssignmentInstructor.prototype.infoBubble = function ($obj, objItem, psStatus) {
    var oSelf = this,
		sStatus = psStatus || '',
		itemId  =   objItem.item,
		top     = $obj.offset().top + 15,
		left    = $obj.offset().left + $obj.width()/2,
		coreAssignment = $obj.attr('data-core'),
		objData = _.where(oSelf.model["GetAssignmentListInfo"], {ItemID: itemId}),
		$buttonObj  = {
			"0" : {
				class: "viewButt",
				text: ASSIGNMENT_INSTRUCTOR.c_i_VIEW_BUTTON
			} ,
			"1" : {
				class: "withdrawStudeanAssignment",
				text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
			} 
		};
    
    if (sStatus  ==  'scored' && (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT || oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE)) {
        delete $buttonObj["1"];
    }
	
	if (sStatus  ==  ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT) {
		// no withdraw option for now instead add view option
		/* var $buttonObj  = {
			"0" : {
				class: "withdrawStudeanAssignment",
				text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
			}
		}; */
		var $buttonObj  = {
			"0" : {
				class: "viewButt",
				text: ASSIGNMENT_INSTRUCTOR.c_i_VIEW_BUTTON
			} ,
			"1" : {
				class: "withdrawStudeanAssignment",
				text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
			} 
		};
	}
	
	if (coreAssignment == "true") {
		delete $buttonObj["1"];
	}
	
    var $html = _.template($("#infoBubble").html(),{
        "title":		objData[0].ItemName,
		"readingLevel": 0,
        "itemId":		itemId,
        "itemAttemptId": objItem.itemattemptid,
        "studentId":	objItem.student,
		"finalScore":	objItem.finalscore,
        "buttonObj":	$buttonObj,
		"status":		(sStatus || '').toLowerCase()
    }); 

    $('body').append($html);  

    var ViewPortHeight   =   document.documentElement.clientHeight;
    var ViewPortWidth    =   document.documentElement.clientWidth;

    var tooltipHeight   =   $('.lesson_tooltip').height();
    var tooltipWidth    =   $('.lesson_tooltip').width();                        

    // Update Top For Bottom Pointed Tooltip
    if (top + $obj.height() + tooltipHeight > ViewPortHeight) {
        $('#itemBubble').addClass('btm_tooltip');
        top = top - $obj.height() - tooltipHeight;
    }

    //  Update Left For Extreme Left Tooltip
    if (left + $obj.width() + tooltipWidth > ViewPortWidth) {
        left = left - (tooltipWidth / 2) + 30;
        $(".lesson_toolls").find(".page_arrow").css({'left': '+=' + ((tooltipWidth / 2) - 30) + 'px'});
    }        

    $("#itemBubble").css({
       'position' : 'absolute',
       'left' : left + "px",
       'top' : top + "px",
       'opacity': 1
    });
    return;
};


/**
 * Withdraw Assignment
 * @param {Object} pobjResult Cell||Column
 * @returns {undefined}
 */
AssignmentInstructor.prototype.withDrawAssignment = function (psType) {
    var oSelf = this,
		sType   =   psType,
		fCallback = function (pobjResult) {	
			var itemId      =   pobjResult.ItemID,
				strStudent  =   pobjResult.StudentIDs,
				studentarr  = [];
			
			if (typeof strStudent == "number") {
				studentarr.push(strStudent);
			}
			else {
				studentarr = strStudent.split(",");
			}			
			oSelf.autoRefresh();			
			objWithdrawAssignmentResponse = null;			
		};
	
    $(".withdrawStudeanAssignment").off('click').on('click', function (event) {        
        var itemId  =   $(this).attr('data-item'),
			studentId   = '',
			itemAttepmtId = '',
			sStatus = $(this).attr('data-status'), // IPP-365
			sDisplayStatus = ' that is ' + sStatus, // IPP-365			
			sAssignmentType = (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE)? 'assessment': 'assignment',
			sVerb = 'may';
		
        switch (sType) {
            case 'cell':
				studentId = $(this).attr('data-student');
				itemAttepmtId = $(this).attr('data-itemattemptid');
                itemId = $(this).attr('data-item');
                if (sStatus !== ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT.toLowerCase()) { // IPP-365					
					if (sStatus === 'scored') {
						sVerb = 'may';
						sDisplayStatus = '';
					}
					ShowConfirm(
						'Warning',
						'Withdrawing this ' + sAssignmentType + ' ' + sVerb + ' cause the loss of data for student' + sDisplayStatus + '.',
						function () {							
							var objResult = {"ItemID":itemId, "StudentIDs":studentId, "ItemAttemptIds": itemAttepmtId, UnassignToWholeClass: false};
							//AssignmentInstructorView.updateRefreshedContent = false;							
							oUtility.showLoader({
								'message': '<img src="media/loader.gif" alt="" />',
								'background-color': '#fff',
								'click-to-hide': false,
								'opacity': 0.5
							});
							
							$.nativeCall({
								'method': 'RemoveGradeableItem',
								'inputParams':	[objResult],
								'globalResource': 'objWithdrawAssignmentResponse',		
								'onComplete': function () {
									fCallback(objResult);
								}
							});
						}
					);
					return;
				}                
			break;
            default:
                /* $(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"']").each(function () {
                    studentId.push($(this).data().student);
					itemAttepmtId.push($(this).data().itemattemptid);
                }); */
			break;
        }
        
        var objResult = {"ItemID":itemId, "StudentIDs":studentId, "ItemAttemptIds": itemAttepmtId, UnassignToWholeClass: false};
        //AssignmentInstructorView.updateRefreshedContent = false;        
		oUtility.showLoader({
			'message': '<img src="media/loader.gif" alt="" />',
			'background-color': '#fff',
			'click-to-hide': false,
			'opacity': 0.5
		});
        $.nativeCall({
			'method': 'RemoveGradeableItem',
			'inputParams':	[objResult],
			'globalResource': 'objWithdrawAssignmentResponse',		
			'onComplete': function () {
				fCallback(objResult);
			}
		});
    });    
};

/**
 * View Assignment
 * @param {String} psType Cell||Column
 * @returns {undefined}
 */
AssignmentInstructor.prototype.viewAssignment  =   function (psType, oCell) {    
    var oSelf = this,
		sType = psType;
	
    $(".viewButt").off('click').on('click', function () {
		var oData = $(this).data(),
			sCompletionStatus = '',
			sAssignmentType = (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE)? 'assessment': 'assignment',
			sAssignmentSubType = oCell.attr('data-ISUBTYPE'),
			sItemName = oCell.attr('data-title') || $(oCell).attr("data-item-name"),
			sSubTypeMode = '',
			dFinalScore = (parseFloat(oData['finalscore']) || 0),			
			sKeyMaxScore = 'IMS',
			sKeyItemId = 'IID',
			sKeyStudentId = 'SID',
			sKeyCompletionStatus = 'ICS',
			sTargetGradeCode = oCell.attr('data-targetGradeCode') || "";
			
		oSelf.removeBubble();
			
		/* sAssignmentSubType = (
			(
				typeof sAssignmentSubType == 'undefined' ||
				sAssignmentSubType == null
			)?
			$(".headerSliderContainer .qs_ans[data-item='" + oData.item + "']").data('headertype'):
			sAssignmentSubType
		); */
		
		sItemName = encodeURIComponent(sItemName.specialChar2ASCII());
       
		if (sAssignmentSubType == 'studyplan') {
			var objStudyPlanTypes = {
				"Pre": ASSIGNMENTS.c_s_ASSIGNMENT_PRETEST_TYPE,
				"Practice": ASSIGNMENTS.c_s_ASSIGNMENT_PRACTICE_TYPE,
				"Post": ASSIGNMENTS.c_s_ASSIGNMENT_POSTTEST_TYPE
			};
			sSubTypeMode = objStudyPlanTypes[$.trim($(this).text())];
		}
       
		var sURL = 'assignment.html?' + POPUP_VIEW.c_s_QUERY_PARAM_MODE + '=' + POPUP_VIEW.c_s_MODE_INSTRUCTOR +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_ID + '=' + oData.item.trim() +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ITEM_ATTEMPT_ID + '=' + oData.itemattemptid.trim() +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_HEADER_TITLE + '=' + sItemName +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_TYPE + '=' + sAssignmentType.trim() +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_SUB_TYPE + '=' + sAssignmentSubType.trim() +
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_TARGET_GRADE_CODE + '=' + sTargetGradeCode.trim();
			
					
		if (sType === 'column') {               
            sURL += '&' + POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_PLAY +
					'&' + POPUP_VIEW.c_s_QUERY_PARAM_STUDYPLAN_SUB_TYPE + '=' + sSubTypeMode;                        
		}
		else {
			var oSearchFilter = {};
			oSearchFilter[sKeyItemId] = oData.item;
			oSearchFilter[sKeyStudentId] = oData.student.toString();
			
			var GradeData		=	[];
			if(objPlatform.isBrowser()) {
				GradeData	=	oSelf.model["GetGradebookAttemptData"];
			} else {
				for(var GradeDataKey = 0; GradeDataKey < oSelf.model["GetGradebookAttemptData"].length; GradeDataKey++) {
					if(typeof oSelf.model["GetGradebookAttemptData"][GradeDataKey] == "string") {
						GradeData.push(JSON.parse(oSelf.model["GetGradebookAttemptData"][GradeDataKey]));
					} else {
						GradeData.push(oSelf.model["GetGradebookAttemptData"][GradeDataKey]);
					}
				}
			}	
			
			var oItemStatus = _.where(GradeData, oSearchFilter)[0];
			sCompletionStatus = (
				(typeof oItemStatus == 'undefined')?
				'assigned':
				escape(oItemStatus[sKeyCompletionStatus])
			);
			
			dMaxScore = parseFloat(oItemStatus[sKeyMaxScore]);
            
			sURL += '&' + POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_VIEW +
					'&' + POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID + '=' + oData.student +
					'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_COMPLETION_STATUS + '=' + sCompletionStatus;
		}
       
		if (objPlatform.isDevice()) { //  If Device           
            HideNativeBottomBar(true);
            ShowWebView(sURL);       
			//AssignmentInstructorView.refreshStatus = true;
			oSelf.removeBubble();
			return false;
		}
		//  If Webclient            
		var $html = _.template($("#viewAssignment").html());		
		$("#main_container").hide();
		$("#loaderContainer").hide();
		$("#loaderContainerOverlay").hide();
		$("#dialog-message").hide();	
		setTimeout(function(){
			$("#scorePopupArea").css({'width': '100%', 'height': $(window).height()+'px', 'overflow' : 'hidden'});		
			$("#scorePopupArea").show().html($html);            
			$("#viewAssignmentFrame").attr('src', sURL).load(function () {
				oSelf.manageIFrame();
			});
		}, 1000);
		//AssignmentInstructorView.refreshStatus = false;
    });
};

/**
 * Open Inventory Or Reviews Pop up
 * @param {Object} this
 * @returns {undefined}
 */
AssignmentInstructor.prototype.openInventoryOrReviews = function (oSelf) {
	if ($(this).text().match(/Inventory/)) {		
		$inventoryPop = new InventoryPopup({"studentID" : $(this).attr("data-student"), "studentName" : $(".Tooltip_title_wrap").text()}, oSelf); 
	}
	else {
		$reviewPop = new ReviewPopup({"studentID" : $(this).attr("data-student"), "studentName" : $(".Tooltip_title_wrap").text()});		
	}
}

/**
 * Manage Iframe Features And Resize
 * @method manageIFrame
 * @returns {undefined}
 */

AssignmentInstructor.prototype.manageIFrame = function () {
    
    var objIframe   =   $('#viewAssignmentFrame').contents();    
    objIframe.find("#assignmentPrev").off('click').on('click', function (event) {
       event.preventDefault();
       $("#viewAssignmentFrame").attr('src', '');
       $("#scorePopupArea").css({'width': '', 'height': '', 'overflow' : ''});
       $("#main_container").show();
       $("header").show();
       $("#scorePopupArea").html('').hide();       
       //AssignmentInstructorView.refreshStatus = true;
	   oSelf.resize ();
       return false;
    });
};

/**
 * Remove Tooltip
 * @method removeBubble 
 * @return 
 */
AssignmentInstructor.prototype.removeBubble = function () {
    
    if($("#itemBubble").length) {
        $("#itemBubble").remove();
    }

    if($("#catInfoBubble").length) {
        $("#catInfoBubble").remove();
    }
};

/**
 * Resize Page
 * @method resize 
 * @return 
 */
AssignmentInstructor.prototype.resize = function () {
	var oSelf = this,		
		oLeftCol = $(".table-column2 .table-row:eq(0) .partname"),
		oRightCol = $(".table-column2 .table-row:eq(0) .partname-qty"),
		oTitleCol = $(".table-column2 .table-row-header .paddingtitle"),
		oGridContainer = (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) ? $(".summary-grid .divtable-body") : $(".table-content-wrapper"),
		oGridTitleBar = (oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY) ? $(".divTableRow.divtableheader") : $(".table-title-bar .paddingtitle"),
		oWeekContainer = $(".organize-main-container"),
		oTabContainer = $(".table-slider-tabs"),
		oNativeBarHeight = 55,
		fRowWidth = 0,
		fMarginRight = 0,		
		iRCol = 0,
		fTableSlider = $(".table-slider-with"),
		fSliderPagination = $(".slide-pagination"),
		fTotWidth = fTableSlider.width() + fSliderPagination.width(),
		fWindowHeight = $(window).height(),
		iGridCols = oSelf.sActiveTab == (
			oSelf.CONSTANTS.c_s_TAB_READING ? 
			oSelf.CONSTANTS.c_i_GRID_COLUMS_READING : 
			(
				oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_SUMMARY ? 
				c_i_GRID_COLUMS_SUMMARY : 
				oSelf.CONSTANTS.c_i_GRID_COLUMS
			)
		), 
		fMaxHeight = fWindowHeight - 
							(oWeekContainer.outerHeight() + 
							oTabContainer.outerHeight() + 
							oGridTitleBar.outerHeight() + 
							 oNativeBarHeight);	
		
	// Set Grid Max Height
	oGridContainer.css({"max-height":  fMaxHeight+'px'});
	
	// Set Grid Width
	oTitleCol.each(function() {
		iRCol++;
		fMarginRight = (iRCol == oTitleCol.length || iRCol % iGridCols == 0) ? 0 : 2;
		fRowWidth += $(this).outerWidth() + fMarginRight;
	});
	
	if (!(oSelf.bAutoRefresh && oSelf.sActiveTab == oSelf.CONSTANTS.c_s_TAB_GRADE)) {
		$(".table-column2 .table-row").css({"width": fRowWidth+'px'});	
		$(".table-column2 .table-row-header").css({"width": fRowWidth+'px'});	
		$(".slide-container").css({"width": fRowWidth+'px'});
	}
	
	// Show Vertical Scroll Area When Needed
	if (!oSelf.bAutoRefresh /* && $(".table-column2 .table-content").height() > $(".table-content-wrapper").height() */) {
		fTableSlider.css({"width": fTotWidth+'px'});
		$(".slide-pagination").show();
	}	
}

/**
 * Triggered On New Week Selection 
 * @method setWeek 
 * @return 
 */
AssignmentInstructor.prototype.setWeek = function (oSelf) {
	var bReloadGrid = true,
		iWeekSelected = this,
		sColor = $(".week-no.slick-current").css("color");
		
	oSelf.sLeft = 0; // so that grid render from first slide
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0.5
	});
			
	/* $(".week-no").removeClass("weekselected");
	$(this).addClass("weekselected"); */
	
	oSelf.currentWeek = isNaN(iWeekSelected)? $(iWeekSelected).attr("data-week") : iWeekSelected + 1;
	
	$(".view_organize_carausal").css({"border-bottom":"8px solid "+sColor});
	$(".table-slider-tabs li a.active").css({"background-color":sColor});
	oSelf.refreshData();		
	oSelf.getData(bReloadGrid);	
}

/**
 * Set View On Tab Click
 * @method setView 
 * @return 
 */
AssignmentInstructor.prototype.setView = function (oSelf) {
	var bReloadGrid = true,
		sColor = $(".week-no.slick-current").css("color");
	
	oSelf.removeBubble();
	
	if ($(this).hasClass("disabled") || $(this).hasClass("active")) {
		return;
	}
	
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0.5
	});

	$(".table-slider-tabs li a").removeClass("active").css({"background":"transparent"});
	$(this).addClass("active").css({"background-color":sColor});;
	
	switch ($(this).attr("data-view")) {
		case "assignments":
			oSelf.sActiveTab = oSelf.CONSTANTS.c_s_TAB_ASSIGNMENT;
			oSelf.refreshData();
			oSelf.getData(bReloadGrid);			
			break;
		
		case "grade":
			oSelf.sActiveTab = oSelf.CONSTANTS.c_s_TAB_GRADE;
			oSelf.refreshData();
			oSelf.getData(bReloadGrid);			
			break;
			
		case "summary":
			oSelf.sActiveTab = oSelf.CONSTANTS.c_s_TAB_SUMMARY;
			oSelf.refreshData();
			oSelf.getData(bReloadGrid);						
			break; 
			
		case "reading-entry":
			oSelf.sActiveTab = oSelf.CONSTANTS.c_s_TAB_READING;
			oSelf.refreshData();
			oSelf.getData(bReloadGrid);			
			break;
			
		case "grading-period":
			oSelf.sActiveTab = oSelf.CONSTANTS.c_s_TAB_GRADING_PERIOD;
			oSelf.refreshData();
			oSelf.getData(bReloadGrid);			
			break;
	}	
}

/**
 * Reset garbage data before rendering with new week  
 * @method refreshData 
 * @return 
 */
AssignmentInstructor.prototype.refreshData = function () {
	var oSelf = this;
	
	oSelf.iSlideVisible = 1;
	oSelf.iSlideCount = 0;
	oSelf.bAutoRefresh = false;
	clearInterval(oSelf.oAutoRefreshInterval);
}

/**
 * Swipe to Next Page  
 * @method swipeNextGrid 
 * @return 
 */
AssignmentInstructor.prototype.swipeNextGrid = function (oSelf) {
	var fSlideWidth = $(".slide-item").width(),
		iSlideVisible = oSelf.iSlideVisible;
		
	if ($(this).hasClass('disabled')) {
		return;
	}

	oSelf.iSlideVisible++;
	$(".slide-item").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show prev button
	$('.left-sl').removeClass("disabled");

	// hide next button if on last slide
	if (oSelf.iSlideVisible == oSelf.iSlideCount) {		
		$('.right-sl').addClass("disabled");
	}	
}

/**
 * Swipe to Previous Page  
 * @method swipePrevGrid 
 * @return 
 */
AssignmentInstructor.prototype.swipePrevGrid = function (oSelf) {
	var fSlideWidth = $(".slide-item").width(),
		iSlideVisible = oSelf.iSlideVisible - 2;
		
	if ($(this).hasClass('disabled')) {
		return;
	}
	
	oSelf.iSlideVisible--;
	$(".slide-item").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show next button
	$('.right-sl').removeClass("disabled");
	
	// hide prev button if on first slide
	if (oSelf.iSlideVisible == 1) {		
		$('.left-sl').addClass("disabled");
	}	
}

/**
 * Initialize Score Popup View
 * @method openScorePopup 
 * @return 
 */
AssignmentInstructor.prototype.openScorePopup = function (oSelf) {
	var model = {
			"SID": $(this).attr("data-SID"),
			"IAID": $(this).attr("data-IAID"),
			"IID": $(this).attr("data-IID"),
			"ITYPE": $(this).attr("data-ITYPE"),
			"AssignmentListInfo": oSelf.model["GetAssignmentListInfo"],
			"AttemptData": oSelf.model["GetGradebookAttemptData"],
			"StudentList": _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [],
			"CurrentWeek": oSelf.currentWeek || 1,
			"oGradeCodeMapping": oSelf.oGradeCodeMapping,
			"fCallback": function () {
				oSelf.refreshData();
				oSelf.getData();
			}
		},
		sCurrentStatus = $(this).text();	
			
	if ($.trim(sCurrentStatus) === ASSIGNMENT_INSTRUCTOR.c_s_SENT_COMPLETED_TXT) {
		if ($(this).attr("data-FS") != 0) {
			return false;
		}
		$assignmentScore = new AssignmentScoreView(model);		
	}	
}


/**
 * Grade - Toggle GLE View  
 * @method toggleGleView 
 * @return 
 */
AssignmentInstructor.prototype.toggleGleView = function (oSelf) {
	var model = oSelf.model,
		sItemID = $(this).closest(".gradeTitle").attr("data-itemID"),
		sItemName = $(this).closest(".gradeTitle").attr("data-item-name"),
		aStudentList = _.where(objStudentListJsonData.Content, {"UserRole":"S"}) || [],		
		aSortedStudList = _.sortBy(aStudentList, function(obj){return parseInt(obj.UserID);}),
		oAttemptData = {},
		aData =	[],
		oItemAttemptSummary = {},
		sStatus = '',
		oHtml = null,
		oHtmlHeader = null;

	oSelf.removeBubble();
	
	$(".table-slider-with").addClass("gle-view");	
		
	for (var key = 0;  key < aSortedStudList.length; key++) {
		oAttemptData		=	_.where(model['GetGradebookAttemptData'], {"SID": aSortedStudList[key]['UserID'], "IID": sItemID});
		oItemAttemptSummary	=	(oAttemptData.length == 0) ? '' : oAttemptData[0]['IAS'];
		oItemAttemptSummary	=	(oItemAttemptSummary == '' || oItemAttemptSummary == null) ? '' : JSON.parse(decodeURIComponent(oItemAttemptSummary));
		
		sStatus				=	(
			(oAttemptData.length && oAttemptData[0]['ICS'] == LESSON.c_i_SCORED_STATUS) ? 
			LESSON.c_i_SCORED_STATUS :
			$(".table-column2").find(".partname[data-student='"+aSortedStudList[key]['UserID']+"'][data-item='"+sItemID+"']").text()
		);
		
		if ($.trim(sStatus) == '' || $.trim(sStatus) == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT || $.trim(sStatus) == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT) {
			oItemAttemptSummary	=	'';
		}
		aData.push(oItemAttemptSummary);	
	}	
	
	if (!oSelf.bAutoRefresh) {
		$(".table-title-bar .table-column2 .slide-item .status-header").hide();
		$(".table-content-wrapper .table-column2 .status-grid").hide();
		
		$(".table-title-bar .table-column2 .slide-item").append(
			_.template($("#gle-header").html(), {'gridCols': oSelf.CONSTANTS.c_i_GRID_COLUMS, 'sItemName': sItemName})
		);
	}
	else {
		$(".table-content-wrapper .table-column2 .slide-item .gleview-grid").remove();
	}
	
	$(".table-content-wrapper .table-column2 .slide-item").append(
		_.template($("#gle-grid").html(), {'aStudentList': aSortedStudList, 'aData': aData})
	);
	
	oSelf.bindGleEvents();
	if (event) { event.stopPropagation(); }
}

/**
 * Grade - Bind GLE Grid Events  
 * @method bindGleEvents 
 * @return 
 */
AssignmentInstructor.prototype.bindGleEvents = function () {
	var oSelf = this;
	
	$(".grade-collapse").off('click').on('click', function () {
		oSelf.collapseGrid.call(this, oSelf);
	});	
}

/**
 * Grade - Collapse GLE Grid View  
 * @method collapseGrid 
 * @return 
 */
AssignmentInstructor.prototype.collapseGrid = function (oSelf) {
	$(".table-slider-with").removeClass("gle-view");
	
	$(".table-title-bar .table-column2 .gleview-header").remove();
	$(".table-content-wrapper .table-column2 .gleview-grid").remove();
	
	$(".table-title-bar .table-column2 .slide-item .status-header").show();
	$(".table-content-wrapper .table-column2 .status-grid").show();
}

/**
 * Assignment Score Pupup View  
 * @method AssignmentScoreView 
 * @return 
 */
function AssignmentScoreView (model) {
	this.model = model;
	
	this.init();
}

AssignmentScoreView.prototype.init = function () {
	var oSelf = this;		
		
	ShowLoader();		
	oSelf.getScoreData();
}

/**
 * Score Pupup - Get Student Attempt Data & Assignment JSON Data
 * @method getScoreData 
 * @return 
 */
AssignmentScoreView.prototype.getScoreData = function () {
	var oSelf = this,
		oNativeRequest = {};	
	
	// get data from GetAttemptDataForGradeableItem & GetAssignmentSlidesInfo services
	oNativeRequest = [{
		'serviceName': 'GetAttemptDataForGradeableItem', 
		'params': [oSelf.model['IID'], oSelf.model['SID'], oSelf.model['IAID']], 
		'response': 'studentAttemptData',
		'checkSuccess': null,
		'callback': null
	},
	{
		'serviceName': 'GetAssignmentSlidesInfo', 
		'params': [oSelf.model['IID'], oSelf.model['ITYPE']], 
		'response': 'objAssignmentSlidesJsonData',
		'checkSuccess':		function (oResponse) {
			return (oResponse && oResponse.jsPath != '');
		},
		'callback': oSelf.prepareRender
	}];	
	
	oSelf.nativeCallWrapper(oNativeRequest);
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
AssignmentScoreView.prototype.nativeCallWrapper = function (oRequest) {
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
			if (oRequest[0]['callback'] == null) {
				oSelf.nativeCallWrapper(oRequest.slice(1,oRequest.length));
			}
			else {				
				oRequest[0]['callback'].call(this, oSelf);
			}
		}
	});
}

/**
 * Score Pupup - Render View
 * @method render 
 * @return 
 */
AssignmentScoreView.prototype.prepareRender = function (oSelf) {	
	
	loadJS(objAssignmentSlidesJsonData.jsPath, function () {
		oSelf.model['studentAttemptData'] = studentAttemptData;
		oSelf.model['objAssignmentData'] = objAssignmentData;
		
		oSelf.render();
	});
}

/**
 * Score Pupup - Render View
 * @method render 
 * @return 
 */
AssignmentScoreView.prototype.render = function () {	
	var oSelf 			= this,
		objModel 		= oSelf.prepareModel(),
		scoreTemplate 	= _.template($("#scoreTemplate").html(), {objModel: objModel});		
	
	$("#main_container").hide();
    $("#scorePopupArea").html(scoreTemplate);
	$(".score-modal").width($("#contentArea").width());
    
	$("#contentArea").hide();
	oSelf.resize();
	
	$("#scorePopupArea").show();
	
    HideLoader();
        
	oSelf.resize();
	window.onresize = function () {
        oSelf.resize();
    };
    
    //  Rubric Max Score Plotting
    if (objModel.assignmentType == "dailyassignment" || objModel.assignmentType == "iwt") {
        if ($(".circle_area_container .circle_page").length) {
            var maxRubric   =   0;
            $("li.param").each(function () {
                maxRubric  +=   parseInt($(this).find(".circle_page:last").attr('data-value'));
            });
            $("#maxRubric").html(maxRubric);
        }
    } else {
        $(".updateRubric-content").remove();
    }
	  
    oSelf.bind(objModel); // IPP-5024
	
	if (
		objModel.assignmentType == "phonictextbasedslide" || 
		objModel.assignmentType == "extendedphonic" || 
		objModel.assignmentType == "frs"
	) {
		oSelf.bindAudio();

		$('.grading_page_btn_box button').eq(0).attr("disabled", true).addClass("disabled");
		$('#acceptScore').attr("disabled", true).addClass("disabled");
		
		oSelf.callOralFluencyGetScoreData(objModel);
	};
	
    //AssignmentInstructorView.refreshStatus = false;
}

/**
 * Prepare Data Model For Score View 
 * @returns {undefined}
 */
AssignmentScoreView.prototype.prepareModel    =   function () {	
    var oSelf = this,
		objDataModel = {},    
		_systemScore = null,
		_displayText = null,
		_prompt = null,
		_studentResponse = null, 
		_rubric = null, 
		_rubricSelection = null, 
		_overAllScore = null;
    
    objDataModel.itemId                 =   oSelf.model['IID'];
    objDataModel.itemAttemptId          =   oSelf.model['IAID'];
    objDataModel.studentId              =   oSelf.model['SID'];
	objDataModel.objAssignmentData      =   oSelf.model['objAssignmentData'];
	objDataModel.studentAttemptData     =   oSelf.model['studentAttemptData'];
    objDataModel.assignmentType         =   oSelf.model['objAssignmentData']['assignmentType'];    
    _systemScore                        =   oSelf.digJson(oSelf.model['studentAttemptData'], 'SystemScore');  
    objDataModel.systemScore            =   (_systemScore != null && _systemScore > 0) ? _systemScore : null;    
    objDataModel.showScore              =   true;    
    
    switch (objDataModel.objAssignmentData.assignmentType) {
        case 'iwt':            
            objDataModel.showScore      =   false;
            _displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
			var arrKeys					=	Object.keys(objDataModel.objAssignmentData.slides).map(function(item) { return parseInt(item, 10);});
			var _KeyLength  			=   arrKeys.sort(function (a, b) {return a - b}).pop();
            objDataModel.prompt         =   objDataModel.objAssignmentData.slides[_KeyLength].question;
            var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');
            studentResponse             =   typeof studentResponse == "string" ? studentResponse.replace(/\n/g, '\\n') : studentResponse;
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);            
            var objSlides               =   (objStudentResponse == null) ? null : oSelf.digJson(objStudentResponse, 'itemSlides');              
            var slide                   =   (objSlides  ==   null )? null : objSlides[Object.keys(objDataModel.objAssignmentData.slides).length - 1];            
            _studentResponse            =   oSelf.digJson(slide, 'answer');  
            objDataModel.studentResponse=   (_studentResponse == null) ? '' : '<p>' + decodeURIComponent(_studentResponse).replace(/\n/g, '<br />') + '</p>';//objDataModel.studentAttemptData.slides[Object.keys(objDataModel.objAssignmentData.slides).length].answer;
            var _keys                   =   Object.keys(objDataModel.objAssignmentData.slides).map(function(item) { return parseInt(item, 10);});            
            var _length                 =   _keys.sort(function (a, b) {return a - b}).pop();
            _rubric                     =   objDataModel.objAssignmentData.slides[_length].rubric;//objDataModel.objAssignmentData.slides[Object.keys(objDataModel.objAssignmentData.slides).length].rubric;                        
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   oSelf.digJson(objDataModel.studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;;
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : _overAllScore;
            break;
        case 'paragraph':             
            _displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            _prompt                     =   oSelf.digJson(objDataModel.objAssignmentData, 'prompt');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;
            var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');   
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);            
            _studentResponse            =   oSelf.digJson(objStudentResponse, 'para');//(objStudentResponse == null)? null : oSelf.digJson(objStudentResponse, 'paragraph');
            objDataModel.studentResponse=   (_studentResponse == null) ? null : '<p>' + decodeURIComponent(_studentResponse).replace(/\n/g, '<br />') + '</p>';            
            _rubric                     =   oSelf.digJson(objDataModel.objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   oSelf.digJson(objDataModel.studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
            break;
        case 'essay': 
            _displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            _prompt                     =   oSelf.digJson(objDataModel.objAssignmentData, 'prompt');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;
            var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');   
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);  
            var intro                   =   oSelf.digJson(objStudentResponse, 'intro');
            var body                    =   oSelf.digJson(objStudentResponse, 'body');
            var conclusion              =   oSelf.digJson(objStudentResponse, 'conclusion');
            _studentResponse            =   intro   ==  null ? '' : '<p>'+decodeURIComponent(intro).replace(/\n/g, '<br />')+'</p>';
            _studentResponse           +=   body    ==  null ? '' : '<p>'+decodeURIComponent(body).replace(/\n/g, '<br />')+'</p>';
            _studentResponse           +=   conclusion    ==  null ? '' : '<p>'+decodeURIComponent(conclusion).replace(/\n/g, '<br />')+'</p>';
            objDataModel.studentResponse=   _studentResponse;
            objDataModel.studentResponse=   objDataModel.studentResponse.replace(/\’/g, '&#39;').replace(/\'/g, '&#39;').replace(/\“/g, '&#34;').replace(/\”/g, '&#34;');
            _rubric                     =   oSelf.digJson(objDataModel.objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
             _rubricSelection            =   oSelf.digJson(objStudentResponse, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
            break;
        case 'dailyassignment': 
            objDataModel.showScore      =   false;
            _displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   _displayText == null ? '' :_displayText; 
            _prompt                     =   oSelf.digJson(objDataModel.objAssignmentData, 'teacher_text');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;      
            var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n').replace(/\\\\/g, '\\');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);                        
            _studentResponse            =   oSelf.digJson(objStudentResponse, 'answer');                        
//            _studentResponse            =   oSelf.digJson(objDataModel.studentAttemptData, 'answer');
            if(_studentResponse ==  null) {
                objDataModel.studentResponse=   '';
            } else {
                var _studentResponseHTML    =   '';
                var _iCountAns              =   1;
                for(var key in _studentResponse) {
                    _studentResponseHTML   +=   '<p>'+ (_iCountAns++) + '. ' +decodeURIComponent(_studentResponse[key].ans).replace(/\n/g, '<br />')+'</p>'; 
                }
                objDataModel.studentResponse=   _studentResponseHTML;
            }
            objDataModel.studentResponse=   (objDataModel.studentResponse == '') ? '' : objDataModel.studentResponse.replace(/\’/g, '&#39;').replace(/\'/g, '&#39;').replace(/\“/g, '&#34;').replace(/\”/g, '&#34;');
            _rubric                     =   oSelf.digJson(objDataModel.objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   oSelf.digJson(objDataModel.studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;   //(typeof studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits == "undefined") ? null : studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits;
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : _overAllScore;  //(typeof studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.overallScore == "undefined") ? null : studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.overallScore;
            break;
			
		case 'phonictextbasedslide': 
		case 'extendedphonic': 
			_displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
			
            var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
			
            var objStudentResponse      =   (studentResponse == null) ? null : (
												(typeof studentResponse != 'object') ? JSON.parse(studentResponse) : studentResponse
											);
            _studentResponse            =   oSelf.digJson(objStudentResponse, 'oralFluencyData');
			_studentResponse 			=   (_studentResponse == null) ? null : (
												(typeof _studentResponse != 'object') ? JSON.parse(decodeURIComponent(_studentResponse)) : _studentResponse
											);
            objDataModel.studentResponse=   _studentResponse;
            
            objDataModel.rubric         =   null;
            
            objDataModel.rubricSelection=   null;
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
			var _PKTOralFluencyScore 		= 	null;
			objDataModel.PKTOralFluencyScore = _PKTOralFluencyScore;
			break;
		
		case 'frs': 
			_displayText                =   oSelf.digJson(objDataModel.objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            
			var studentResponse         =   oSelf.digJson(objDataModel.studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            
			var objStudentResponse      =   (studentResponse == null) ? null : (
													(typeof studentResponse != 'object') ? JSON.parse(studentResponse) : studentResponse
											);
            _studentResponse            =   oSelf.digJson(objStudentResponse, 'oralFluencyData');
			_studentResponse 			=   (_studentResponse == null) ? null : (
												(typeof _studentResponse != 'object') ? JSON.parse(decodeURIComponent(_studentResponse)) : _studentResponse
											);
			objDataModel.studentResponse= (_studentResponse == null) ? null : _.groupBy(_studentResponse, function(obj) {return obj.parts});
            
            objDataModel.rubric         =   null;
            objDataModel.rubricSelection=   null;
			
            _overAllScore               =   oSelf.digJson(objDataModel.studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
			
			var _PKTOralFluencyScore 	= 	oSelf.digJson(objDataModel.studentAttemptData, 'PKTOralFluencyScore');
			_PKTOralFluencyScore 		= 	(_PKTOralFluencyScore == null) ? null : JSON.parse(decodeURIComponent(_PKTOralFluencyScore));
			objDataModel.PKTOralFluencyScore = (_PKTOralFluencyScore == null) ? null : _PKTOralFluencyScore;
			
			break;
		
        case 'default':
            //  Do Nothing
            break;
        
    };    
    return objDataModel;
};

/**
 * Search field from JSON
 * @param {Object} objJson
 * @param {String} keyName
 * @returns {Object} ObjResult
 */
AssignmentScoreView.prototype.digJson = function (objJson, keyName) {
    
    var returnValue = null;
    
    if (typeof objJson == 'undefined' || objJson == null) {        
       return returnValue;
    }
    if (typeof objJson != 'object') {
       return returnValue;
    }
    
    if (keyName in objJson) {
       return objJson[keyName];
    }
    
    if(objJson instanceof Array) {
        for (var key = 0; key < objJson.length; key++) {
           if ((returnValue = this.digJson(objJson[key], keyName)) != null) {
               return returnValue;
           }
        }
    } else {    
        for (var key in objJson) {
           if ((returnValue = this.digJson(objJson[key], keyName)) != null) {
               return returnValue;
           }
        }
    }
    return returnValue;
};

/**
 * Prepare Data to pass in OralfluencyGetScoreData Service Call
 * @param {Object} objModel
 * @returns {Void}
 */
AssignmentScoreView.prototype.callOralFluencyGetScoreData = function (objModel) {
	var oScore = this,
		aPktData = [];
	oScore.oPKTScore = {};

	if (
		objModel.PKTOralFluencyScore != null && 
		objModel.assignmentType == "frs"
	) {
		$('[id^="pkt_"]').each(function() {
			var aSplitId = $(this).attr("id").split("_"),
				sPromptId = $(this).data("prompt-id"),
				oTempData = {},
				oMatchRecord = _.where(objModel.PKTOralFluencyScore, {QID: aSplitId[1]});
			
			if(
				oMatchRecord[0].AC != -1 && 
				oMatchRecord[0].WCPM != -1 && 
				oMatchRecord[0].WC != -1 && 
				oMatchRecord[0].EX != -1 				
			){
				// Not to call OralFluencyGetScoreData, where score data already present
				oScore.oPKTScore[aSplitId[1]] = {};
				oScore.oPKTScore[aSplitId[1]]['pktData'] = {};
				oScore.oPKTScore[aSplitId[1]]['pktData'] = oMatchRecord[0];
				oScore.oPKTScore[aSplitId[1]]['pktData']['testInstanceId'] = aSplitId[2];
				oScore.oPKTScore[aSplitId[1]]['pktStatus'] = "SCORE";
				oScore.oPKTScore[aSplitId[1]]['pktVerified'] = 1;
				oScore.performActionWithPKTResponse(oScore.oPKTScore[aSplitId[1]]["pktData"], objModel.assignmentType, aSplitId[1]);
			}
			else{
				// Not to call OralFluencyGetScoreData, for single PKT where prompt-id is  PEARSON
				if (sPromptId == 'PEARSON'){
					console.log("If Prompt: "+aSplitId[1]);
					var oMatchRecord = [];
					oMatchRecord[0] = {};
					oMatchRecord[0].AC = 100;
					oMatchRecord[0].WCPM = 100;
					oMatchRecord[0].WC = 0;
					oMatchRecord[0].EX = 4;
					
					oScore.oPKTScore[aSplitId[1]] = {};
					oScore.oPKTScore[aSplitId[1]]['pktData'] = {};
					oScore.oPKTScore[aSplitId[1]]['pktData'] = oMatchRecord[0];
					oScore.oPKTScore[aSplitId[1]]['pktData']['testInstanceId'] = aSplitId[2];
					oScore.oPKTScore[aSplitId[1]]['pktStatus'] = "SCORE";
					oScore.oPKTScore[aSplitId[1]]['pktVerified'] = 1;
					oScore.performActionWithPKTResponse(oScore.oPKTScore[aSplitId[1]]["pktData"], objModel.assignmentType, aSplitId[1]);
				}
				else{
					// Data generated for calling of OralFluencyGetScoreData, for multiple PKTs
					oTempData.questionId = aSplitId[1];
					oTempData.pktId = aSplitId[2];
					aPktData.push(oTempData);

					oScore.oPKTScore[aSplitId[1]] = {};
					oScore.oPKTScore[aSplitId[1]]["pktData"] = {};
					oScore.oPKTScore[aSplitId[1]]["pktStatus"] = "NOSCORE";
					oScore.oPKTScore[aSplitId[1]]["pktVerified"] = 0;
				}
			}
		});
	}
	else {
		$('[id^="pkt_"]').each(function() {		
			var aSplitId = $(this).attr("id").split("_"),
				sPromptId = $(this).data("prompt-id"),
				oTempData = {};
				
			if (sPromptId == 'PEARSON') {
				// Not to call OralFluencyGetScoreData, for single PKT where prompt-id is  PEARSON
				var oMatchRecord = [];
				oMatchRecord[0] = {};
				oMatchRecord[0].AC = 100;
				oMatchRecord[0].WCPM = 100;
				oMatchRecord[0].WC = 0;
				oMatchRecord[0].EX = 4;
				
				oScore.oPKTScore[aSplitId[1]] = {};
				oScore.oPKTScore[aSplitId[1]]['pktData'] = {};
				oScore.oPKTScore[aSplitId[1]]['pktData'] = oMatchRecord[0];
				oScore.oPKTScore[aSplitId[1]]['pktData']['testInstanceId'] = aSplitId[2];
				oScore.oPKTScore[aSplitId[1]]['pktStatus'] = "SCORE";
				oScore.oPKTScore[aSplitId[1]]['pktVerified'] = 1;
				oScore.performActionWithPKTResponse(oScore.oPKTScore[aSplitId[1]]["pktData"], objModel.assignmentType, aSplitId[1]);
			}
			else {
				// Data generated for calling of OralFluencyGetScoreData, for single PKT
				oTempData.questionId = aSplitId[1];
				oTempData.pktId = aSplitId[2];			
				aPktData.push(oTempData);
				
				oScore.oPKTScore[aSplitId[1]] = {};
				oScore.oPKTScore[aSplitId[1]]["pktData"] = {};
				oScore.oPKTScore[aSplitId[1]]["pktStatus"] = "NOSCORE";
				oScore.oPKTScore[aSplitId[1]]["pktVerified"] = 0;
			}
		});
	}

	if (aPktData.length){
		oScore.multipleOralFluencyGetScoreData(objModel.assignmentType, aPktData);
	}
};

/**
 * Call Service OralfluencyGetScoreData
 * @param {String} assignmentType
 * @param {Array} aPktData
 * @param {String} piQuestionIndex
 * @returns {Object} ObjResult
 */
AssignmentScoreView.prototype.multipleOralFluencyGetScoreData = function(assignmentType, aPktData, piQuestionIndex) {
	var oScore = this;
	if (piQuestionIndex === undefined) {
		piQuestionIndex = 0;
	}
	$.nativeCall({
		'method':			'OralfluencyGetScoreData',
		'globalResource':	'objOralfluencyGetScoreData',
		'emptyValue':		0,
		'inputParams':		[aPktData[piQuestionIndex].pktId],
		'interval':			500,
		'checkSuccess':		function (poOralfluencyGetScoreResponse) {
			var sResponseStatus = (((objOralfluencyGetScoreData || {}).responseHeader || {}).status || '');
			return (sResponseStatus === "SUCCESS");
		},
		'onComplete':		function (poOralfluencyGetScoreResponse) {
			oScore.checkOralFluencyGetScoreData(assignmentType, aPktData[piQuestionIndex].questionId);
			if (piQuestionIndex < (aPktData.length - 1) ) {
				oScore.multipleOralFluencyGetScoreData(assignmentType, aPktData, piQuestionIndex + 1);
			}
		},
		'onError':			function (poOralfluencyGetScoreResponse) {
			if (piQuestionIndex < (aPktData.length - 1) ) {
				oScore.multipleOralFluencyGetScoreData(assignmentType, aPktData, piQuestionIndex + 1);
			}
		}
	});
};

AssignmentScoreView.prototype.checkOralFluencyGetScoreData = function(assignmentType, questionId) {
	var oScore = this;
	try{
		if (objOralfluencyGetScoreData.responseHeader.status == "SUCCESS") {
			oScore.oPKTScore[questionId]["pktData"] = objOralfluencyGetScoreData;
			oScore.performActionWithPKTResponse(oScore.oPKTScore[questionId]["pktData"], assignmentType, questionId);
		} else {
			throw(objOralfluencyGetScoreData.responseHeader.status);
		}
	}
	catch (err){
		var scoreHtml = ASSIGNMENT_INSTRUCTOR_SCORE.c_s_OFPKT_AUDIO_ERROR_PROCESS_MSG;
		$("#pkt_" + questionId + "_" + pktResponse.testInstanceId).html(scoreHtml);
		oScore.oPKTScore[questionId]["pktStatus"] = "ERROR";
		
		if ($(".oralFluencyLoader").length == 0) {
			oScore.buttonVisibility4OralFluency ();
		}
	}
};

AssignmentScoreView.prototype.performActionWithPKTResponse = function (pktResponse, assignmentType, questionId) {
	
	var oScore = this,
		scoreHtml = "";
	
	if(
		pktResponse.testInstanceState == "MACHINE_SCORING_IN_PROGRESS"
	) {
		scoreHtml = ASSIGNMENT_INSTRUCTOR_SCORE.c_s_OFPKT_SCORE_WAITING_MSG;
		$("#pkt_" + questionId + "_" + pktResponse.testInstanceId).html(scoreHtml);
		oScore.oPKTScore[questionId]["pktStatus"] = "NOSCORE";
	}
	else if(
		pktResponse.testInstanceState == "SCORED" || 
		oScore.oPKTScore[questionId]["pktVerified"] == 1
	) {
		var objScoreData = (oScore.oPKTScore[questionId]["pktVerified"]) ? pktResponse : pktResponse.scoreData.scoreDataItemList;
		
		scoreHtml = _.template($("#oralFluencyPKTScoreTemplate").html(), {
			objScoreData: objScoreData,
			assignmentType: assignmentType,
			questionId: questionId,
			pktVerified: oScore.oPKTScore[questionId]["pktVerified"]
		});
		
		$("#pkt_" + questionId + "_" + pktResponse.testInstanceId).html(scoreHtml);
		oScore.oPKTScore[questionId]["pktStatus"] = "SCORE";
	}
	else{
		scoreHtml = ASSIGNMENT_INSTRUCTOR_SCORE.c_s_OFPKT_AUDIO_ERROR_PROCESS_MSG;
		$("#pkt_" + questionId + "_" + pktResponse.testInstanceId).html(scoreHtml);
		oScore.oPKTScore[questionId]["pktStatus"] = "ERROR";
	}
	
	if(assignmentType != "frs") {
		oScore.buttonVisibility4OralFluency(assignmentType);
	}
	else{
		//console.log("length: " + $("input:radio[name='radio_"+questionId+"']").length);
		if($("input:radio[name='radio_"+questionId+"']").length){
			$.when(oScore.bindRadioButton(questionId)).then($("input:radio[name='radio_"+questionId+"']:checked").click());
		}
		else {
			oScore.buttonVisibility4OralFluency(assignmentType);
		}
	}
};

AssignmentScoreView.prototype.buttonVisibility4OralFluency = function (assignmentType) {
	var oScore = this,
		aAllow = [],
		aNeutral = [],
		aDeny = [];
	
	for( var oKey in oScore.oPKTScore){
		if (typeof oScore.oPKTScore[oKey] != "undefined"){
			switch(oScore.oPKTScore[oKey].pktStatus){
				case "SCORE":
				case "APPROVE":
					aAllow.push(1);
					break;
				case "ERROR":
				case "REASSIGN":
					aDeny.push(1);
					break;
				default:
					aNeutral.push(1);
			}
		}
	}
	
	if(aNeutral.length){
		$('.grading_page_btn_box button').eq(0).attr("disabled", true).addClass("disabled");
		$('#acceptScore').attr("disabled", true).addClass("disabled");
	}
	else{
		//console.log('Object.keys(oScore.oPKTScore).length == aDeny.length: '+Object.keys(oScore.oPKTScore).length +' == '+ aDeny.length);
		if(Object.keys(oScore.oPKTScore).length == aAllow.length) {
			if (assignmentType == "frs"){
				$('.grading_page_btn_box button').eq(0).attr("disabled", true).addClass("disabled");
			}
			else {
				$('.grading_page_btn_box button').eq(0).attr("disabled", false).removeClass("disabled");
			}
			$('#acceptScore').attr("disabled", false).removeClass("disabled");
		}
		else {
			if(
				Object.keys(oScore.oPKTScore).length == aDeny.length || 
				Object.keys(oScore.oPKTScore).length == (aDeny.length + aAllow.length)
			) {
				if (assignmentType == "frs"){
					$('#acceptScore').attr("disabled", true).addClass("disabled");
				}
				$('.grading_page_btn_box button').eq(0).attr("disabled", false).removeClass("disabled");
			}
		}
	}
};

AssignmentScoreView.prototype.bindRadioButton = function(questionId) {
	var oScore = this;
	$("input:radio[name='radio_"+questionId+"']").off("click").on("click", function(){
		//alert("bind event fired");
		var qId = $(this).data("question"),
			assignmentType = $(this).data("assignmenttype"),
			sVal = $(this).val();
		oScore.oPKTScore[qId].pktStatus = (sVal == 'APPROVE') ? "SCORE" : "ERROR";
		oScore.buttonVisibility4OralFluency(assignmentType);
	});
}

/**
 * Bind Events with Adio uttons on Score Popup 
 * @returns {Void} 
 */
AssignmentScoreView.prototype.bindAudio = function() {
	$(".audioButton").off("click").on("click", function () {
		if($(this).hasClass("play")) {
			$('#audioPlayer')[0].pause();
			$(".audioButton").removeClass("play");
			$(".audioButton").attr("src","media/speaker-on.png");
		}
		else {
			$('#audioPlayer')[0].pause();
			$(".audioButton").removeClass("play");
			$(".audioButton").attr("src","media/speaker-on.png");
			
			$(this).attr("src","media/speaker-off.png");
			$(this).addClass("play");
			$('#audioPlayer').attr('src', $(this).attr("data-audiopath"));
			
			$('#audioPlayer')[0].play();
		}
	});
	
	$('#audioPlayer').on('ended', function() {
		$(".audioButton").removeClass("play");
		$(".audioButton").attr("src","media/speaker-on.png");
	});
};

/**
 * Resize Score Popup
 * method: resize
 * @returns {void} 
 */
AssignmentScoreView.prototype.resize = function () {  
    
    var scoreTemplateHeight =   document.documentElement.clientHeight - $(".score-modal .header").height() - parseFloat($("#scoreContentWrapper").css('padding-top')) - parseFloat($("#scoreContentWrapper").css('padding-top'));    
    $("#scoreContentWrapper").height(scoreTemplateHeight);
    
    $(".grading_page_container_lft .grading_page_content").css({'min-height': (parseInt(scoreTemplateHeight) - 40) + 'px', 'max-height': (parseInt(scoreTemplateHeight) - 40) + 'px'});
    
    var calculateLeftPanelHeight   =   parseInt($(".grading_page_container_lft .grading_page_content").css('min-height')) + parseInt($(".grading_page_container_lft").css('padding-top')) + parseInt($(".grading_page_container_lft").css('padding-bottom'));
    $(".grading_page_container_rght").height(calculateLeftPanelHeight);        
    
    $(".studentResponse").width(parseInt($(".grading_page_container_lft.left").width()) - parseInt($(".grading_page_container_lft.left").css('padding-left')) - parseInt($(".grading_page_container_lft.left").css('padding-right')) - 5);
//    $("#scorePopupArea").css({'position': 'fixed'});
    $("body").css({'overflow': 'hidden'});    
    
};

/**
 * Bind proper functions
 * method: bind
 * @returns {void} 
 */
AssignmentScoreView.prototype.bind    =   function (poModel) { // IPP-5024
	var oSelf = this,
		sAssignmentType = poModel.assignmentType;
	
    oSelf.closeScoreTemplate();
    oSelf.manageBoxes(sAssignmentType);
    oSelf.manageScore();
    oSelf.reScore();
    oSelf.focusCommentBox();
	
	/*==== IPP-5024 ====*/
	if (["paragraph", "essay"].indexOf(sAssignmentType) !== -1) {
		var fGetShowScoringGuide = function (poQuestions, piIndex) {
				var sHtml = '<div style="height:350px; overflow-x:hidden; overflow-y:auto; padding:15px;">',
					iIndex = (parseInt(piIndex) || 0),
					oPopUpConfig = {};
				
				for (var iI  in poQuestions) {
					sHtml += '\n\t<p id="hash-' + iI + '">' + poQuestions[iI].text + '</p>';
					for (var iJ in poQuestions[iI].choices) {
						if (iJ == 1) {
							sHtml += '\n\t<strong><u>Scoring Guide</u></strong>';
						}
						sHtml += '\n\t<p>' + iJ + '. ' + poQuestions[iI].choices[iJ].text + '</p>';
					}
					sHtml += '\n<p>&nbsp;</p>';
				}
				sHtml += '\n</div>';
				sHtml += '<div style="background: none repeat scroll 0 0 #FFFFFF; box-shadow:3px -2px 4px 0px rgba(0,0,0,0.4); -moz-box-shadow: 3px -2px 4px 0px rgba(0,0,0,0.4); -webkit-box-shadow: 3px -2px 4px 0px rgba(0,0,0,0.4); height:50px; padding:15px 15px 0 0;">'
					+ '<button class="btn button7 right" type="button" onclick="oUtil.hidePopUp();"> Close </button>'
				+ '</div>';
				
				oPopUpConfig = {
					'click-to-hide': 	false,
					'message':    		sHtml,
					'background-color':	'#FFFFFF',
					'opacity':			0.2,
					'box-style':		{
						'background':		'#FFFFFF',
						'opacity':			1,
						'user-select':		'none',
						'-moz-user-select':	'none',
						'width':			690,
						'height':			450,
						'line-height':		20,
						'border-radius':	'5px',
						'box-shadow':		'5px 5px 12px #888888',
						'text-align':		'left',
						'border':			'2px solid #808080',
						'font-size':		'15px'
					}
				};
				
				if (iIndex > 0) {
					oPopUpConfig = $.extend(
						{},
						oPopUpConfig,
						{
							'after-load':			function () {
								$('#' + this.getLoaderID() + '-content > div').animate({
									'scrollTop':	($('#hash-' + iIndex).position().top - 5) // 5: found by inspection
								}, GENERAL['c_s_DEFAULT_ANIMATE_TIME']);
							}
						}
					);
				}
				
				return function () {
					if ($.trim(sHtml).length > 0) {
						oUtil.showPopUp(oPopUpConfig);
					}
				}
			};
		
		$('#btnShowRubricCriteria')
			.off('click tap')
			.on('click tap', fGetShowScoringGuide((poModel.rubric || {}).questions || {}));
		$('.scoring-guide-info').each(function () {
			$(this)
				.off('click tap')
				.on('click tap', fGetShowScoringGuide(((poModel.rubric || {}).questions || {}), $(this).data('scoring-guide-id')));
		});
	}
	/*== End IPP-5024 ==*/
};


/**
 * Bind Events on Right Panel Circle Score Click 
 * method manageScore
 * @returns {undefined}
 */
AssignmentScoreView.prototype.closeScoreTemplate  =   function () {
    var oSelf = this;
	
    $("#btnCloseModal").off('click tap').on('click tap', function () {                        
        $("#scorePopupArea").html('').hide();
        $("body").css({'overflow':'auto'});
        /* $("#contentArea").show(); */
		$("#main_container").show();
		//oSelf.model['fCallback']();
        //AssignmentInstructorView.refreshStatus = true;
    });    
};


/**
 * Bind Events on Right Panel Button Click 
 * method manageBoxes
 * @returns {undefined}
 */
AssignmentScoreView.prototype.manageBoxes   =   function () {
    
    //  Show Circle Score Boxes of Right Panel on Button Click
    $('.grading_page_btn_box button').off('click tap').on('click tap', function () {
        var iIndex  =   $(this).attr('data-index');
		
        if (!$('.grading_page_container_rght .grading_page_pop_box').eq(iIndex).is(':visible')) {
            $('.grading_page_container_rght .grading_page_pop_box').not(':eq(' + iIndex + ')').hide();
            var oRequiredTab = $('.grading_page_container_rght .grading_page_pop_box').eq(iIndex);
            
            if(oRequiredTab.text()) {                
                oRequiredTab.css({
                    'top'       : oRequiredTab.parent().height().toString() + 'px',
                    'position'  : 'absolute',
                    'background': '#FFFFFF',
                    'width'     : $('.grading_page_container_rght').width(),
                    'height'     : '100%'
                }).show();
                oRequiredTab.animate({
                    'top':	'0px'
                }, 950, function () { // IPP-5024
					var dRubricLabelHeight = (parseFloat($('#da-rubric-label').height()) || 0),
						dSubtrhend = (
							157 + (
								(parseFloat($('#rubric-header-cont').height()) || 0) +
								(
									$('#rubric-header-cont').length > 0?
									(
										(parseFloat($('#rubric-header-cont').css('padding-top').replace('px', '')) || 0) +
										(parseFloat($('#rubric-header-cont').css('padding-bottom').replace('px', '')) || 0)
									):
									0
								)
							)
						);
					var main = $(".grading_score_pop_box").height() - (dSubtrhend + dRubricLabelHeight);
					$("#scoreBoxScroll").height(main);
                });
            }
        }
    });
    
    //  Hide Circle Score Boxes of Right Panel
    $('.light_box_close').off('click tap').on('click tap', function () {
        
        var oRequiredTab = $(this).parent().parent();
        oRequiredTab.animate({
            'top':	'+=' + oRequiredTab.parent().height() + 'px'
        }, 750, function () {
            oRequiredTab.hide();
            $("#comments").val('');
        });
        
        
    });
};


/**
 * Bind Events on Right Panel Circle Score Click 
 * method manageScore
 * @returns {undefined}
 */
AssignmentScoreView.prototype.manageScore     =   function () {

    $('.circle_area_container .circle_page').off('click tap').on('click tap', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        $(this).parent().parent().find('.circle_page').not($(this)).removeClass('active'); // IPP-5092
        $(this).addClass('active');
        
        if($(".updateRubric-content").length) {
            var totScore = 0;
            $(".circle_page").each(function () {	
                if($(this).hasClass('active')) {
                    totScore += parseInt($(this).attr('data-value'));
                }
            });
            $("#calculateRubric").html(totScore);
        }        
    });
};

/**
 * Bind Events on Right Panel Button Click 
 * @returns {undefined}
 */
AssignmentScoreView.prototype.reScore =   function () {
    var oSelf = this;
	
    $("#btnReassign").off('click').on('click', function () {
		var itemId              =   $("#scoreContainer").data().item;
        var itemAttemptId       =   $("#scoreContainer").data().itemattemptid;
        var studentId           =   $("#scoreContainer").data().student;
        var itemType           	=   $("#scoreContainer").data().itemtype;	
        var comment             =   encodeURIComponent($("#comments").val().replace(/\'/g, '&#39;').replace(/\"/g, '&#34;'));		
        var bReAssignStatus     =   true;
        var sCompletionStatus   =   ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS;                        
        
		if (
			itemType == "phonictextbasedslide" || 
			itemType == "extendedphonic" || 
			itemType == "frs" 
		) {
			var aPKTOralFluencyResults = [];
			$.each(oSelf.oPKTScore, function (Idx,Val) {
				var oPKTResponse = {};
				oPKTResponse["QID"] = Idx;
				
				if (itemType == "frs" ) {
					if (Val.pktStatus == "SCORE") {
						if (Val.pktVerified == 1) {
							oPKTResponse["AC"] = Val.pktData.AC;
							oPKTResponse["WCPM"] = Val.pktData.WCPM;
							oPKTResponse["WC"] = Val.pktData.WC;
							oPKTResponse["EX"] = Val.pktData.EX;
						}
						else{
							oPKTResponse["AC"] = Val.pktData.scoreData.scoreDataItemList[0].scoreValue;
							oPKTResponse["WCPM"] = Val.pktData.scoreData.scoreDataItemList[1].scoreValue;
							oPKTResponse["WC"] = Val.pktData.scoreData.scoreDataItemList[2].scoreValue;
							oPKTResponse["EX"] = Val.pktData.scoreData.scoreDataItemList[3].scoreValue;
						}
					}
					else if (Val.pktStatus == "ERROR") {
						oPKTResponse["AC"] = -1;
						oPKTResponse["WCPM"] = -1;
						oPKTResponse["WC"] = -1;
						oPKTResponse["EX"] = -1;
					}
					else {
						//
					}
				}
				else {
					// for single pkt where checkboxes not available
					oPKTResponse["AC"] = -1;
					oPKTResponse["WCPM"] = -1;
					oPKTResponse["WC"] = -1;
					oPKTResponse["EX"] = -1;
				}
				aPKTOralFluencyResults.push(oPKTResponse);
			});
			
			var sPKTOralFluencyResults = encodeURIComponent(JSON.stringify(aPKTOralFluencyResults));
		}
		else {
			var sPKTOralFluencyResults = "";
		}
		
		
        //AssignmentInstructorView.updateRefreshedContent = false;        
		
        ReAssignGradableItem(itemId, itemAttemptId, studentId, comment, sPKTOralFluencyResults);
		ShowLoader();
		
		var ReAssignInterval	=	setInterval (function () {
			if(objReAssignGradableItem != null) {
				var countReassign   =   $("#dashboard-grid").find(".partname-qty[data-iid='"+itemId+"'][data-sid='"+studentId+"']").attr("data-reassign");
				if(countReassign != '') {
					countReassign   =   parseInt(countReassign);
					countReassign++;
				} else {
					countReassign   =   1;
				}
				
				/* $(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").attr('data-text', ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT).html(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT + ' (' + countReassign + ')');
				$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").attr('data-reassign',countReassign); */
				
				$("#dashboard-grid").find(".partname-qty[data-iid='"+itemId+"'][data-sid='"+studentId+"']").attr('data-reassign', countReassign).html(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT + ' (' + countReassign + ')').removeClass("red-lbl");
				
				$("#btnCloseModal").trigger('click');
				
				objReAssignGradableItem	=	null;
				clearInterval(ReAssignInterval);
				//AssignmentInstructorView.updateRefreshedContent = true;
				//AssignmentInstructorView.refreshStatus = true;				
				//AssignmentContainerView.refreshData();
				HideLoader();
				// End: Code commented due to IPP-4614 i.e. Status change display issue when IR is reassigned - Breaks functionality.
			}
		}, 300);
        
    });
    
	// Submit Score Button Click
    $("#btnScore").off('click').on('click', function () {              
        
        var isAllSelected   =   1;
        $("li.param .circle_area_container").each(function () {
            if(!$(this).find(".circle_page.active").length) {
                isAllSelected   =   0;
            }
        });
        
        if(isAllSelected === 0) {
            
            var noSelectionMsgTemplate =   _.template($("#confirmationTemplate").html());
            $("body").append(noSelectionMsgTemplate);
            
            var sNoSelectionTitle   =   'Please select all rubric';
            var sNoSelectionMessage =   'Please select all rubric to submit score';
            $('#dialog').attr('title', sNoSelectionTitle).html(sNoSelectionMessage).dialog({
                autoOpen:	true,
                resizable: 	false,
                draggable:	true,
                height: 275,
                width: 500,
                modal: true,
                buttons: {
                    "Ok": function () { 
                        $(this).dialog('destroy').remove();
                    }
                },
                open: function () {
                    $('.ui-dialog').addClass('Ilit_alert_box');
                }
            });
            
            return false;
        }
        
        var itemId          =   $("#scoreContainer").data().item.toString();
        var itemAttemptId   =   $("#scoreContainer").data().itemattemptid.toString();
        var studentId       =   $("#scoreContainer").data().student.toString();
        var _mainObj        =   oSelf.digJson(studentAttemptData, 'traits');
        var mainObj         =   (_mainObj == null) ? null:  _mainObj; //studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits;
        var objTrait        =   (typeof mainObj == "undefined") ? null : mainObj;
        
        var arrRubric4Matrix=   {4:100, 3:88, 2:75, 1:60, 0:55};
        var arrRubric6Matrix=   {6:100, 5:92, 4:85, 3:75, 2:70, 1:60};
        
        var objTraitLen     =   (objTrait == null) ? 0 : objTrait.length;
        var objResultTrait  =   [];
        var score           =   0;        
        var totScore        =   0;
//        var outOf           =   parseInt($(".param:last").find(".circle_page").length) * (objTraitLen + 1); //  +1 For Overall
        var outOf           =   parseInt($(".param:last").find(".circle_page").not('.scoring-guide-info').length); //  +1 For Overall | IPP-5025
        var systemScore     =   studentAttemptData.Content[0].SystemScore;
        var scoreComment    =   $.trim($("#commentScore").val()).replace(/\'/g, '&#39;');
        var _overAllScore   =    $(".param.last").find(".circle_page.active").attr('data-value');
        var overAllScore    =   (typeof _overAllScore == 'undefined' || _overAllScore == null || _overAllScore == '') ? systemScore : _overAllScore;  
        
        var questionLength  =   parseInt($("li.param").length);
        
        for(var i=0; i < questionLength; i++) {
            score             = $("li.param:eq("+i+")").find(".circle_page.active").attr('data-value');                     
            totScore         += typeof score == "undefined" ? 0 : parseInt(score);
        }                   
                
        totScore   =   isNaN(totScore) ? 0 : totScore;
        
        
        if(objAssignmentData.assignmentType == "dailyassignment") {
            totScore   =   totScore;
            outOf      =   $(".param").find(".circle_page").length;
        }
        else if(objAssignmentData.assignmentType == "iwt") {
            _iwtSystemScore    =   (systemScore == null) ? 0 : systemScore;
            _iwtLastSlide      =   ($("li.param:last").find(".circle_page.active").attr('data-value') != null) ? $("li.param:last").find(".circle_page.active").attr('data-value') : 0;
            totScore           =    totScore    //  _iwtSystemScore + 
            outOf              =    $(".param").find(".circle_page").length;
        } else {
            totScore   =   overAllScore;
            outOf      =   outOf;
        }                        
        		
        var sTitle = "You scored this assignment " + totScore + " out of " + outOf,
        sMessage = 'Is this the score you would like to submit?';                
        var confirmTemplate =   _.template($("#confirmationTemplate").html());
        $("body").append(confirmTemplate);
        
        $('#dialog').attr('title', sTitle).html(sMessage).dialog({
            autoOpen:	true,
            resizable: 	false,
            draggable:	true,
            height: 275,
            width: 500,
            modal: true,
            buttons: {
                "Yes": function () {
					
					var instructorScored = totScore;					
                    var objItemDetails  =   _.where(oSelf.model.AssignmentListInfo, {ItemID: itemId})[0];
                    var sItemType       =   objItemDetails.ItemType;
                    var sItemSubType    =   objItemDetails.ItemSubType;
                    var totScorePercentage = 0;
                    var rubricTotScore  =   0;
                    
                    var wordCount             = 0;
                    var InstructorScoreRubric = '';
                    var rubricMaxScore        = $(".param").find(".circle_page").length;                    
					
					var osearchFilter=	{};
					osearchFilter['IID']	=	itemId.toString();
					osearchFilter['SID']	=	studentId.toString();
					
					var aTempGradeData	=	[];
					if(!objPlatform.isAndroid() && !objPlatform.isWindows()) {
						aTempGradeData	=	oSelf.model['AttemptData'];
					} else {
						for(var GradeDataKey = 0; GradeDataKey < oSelf.model['AttemptData'].length; GradeDataKey++) {
							if(typeof oSelf.model['AttemptData'][GradeDataKey] == "string") {
								aTempGradeData.push(JSON.parse(oSelf.model['AttemptData'][GradeDataKey]));
							} else {
								aTempGradeData.push(oSelf.model['AttemptData'][GradeDataKey]);
							}
						}								
					}
					oSelf.model['AttemptData']	=	aTempGradeData;
					
                    var objGradeBookDetails=  _.where(oSelf.model['AttemptData'], osearchFilter)[0];					
                    var objStudentDetails   = _.where(oSelf.model['StudentList'], {UserID: studentId})[0];					
                    
                    if(objAssignmentData.assignmentType == "iwt") {
                        rubricTotScore  =   totScore;
                        totScore = totScore + parseFloat(_iwtSystemScore);                                                
                    }                                        
                   
                    if (objGradeBookDetails['IAS'] != '' && objGradeBookDetails['IAS'] != null) {						
                        var objItemAttemptSummary = JSON.parse(decodeURIComponent(objGradeBookDetails['IAS']));
                        
                        if(objItemDetails.ItemSubType == 'iwt') {
                            var sReadingCheckpoint    = (typeof objItemAttemptSummary[PERCENTILE.c_s_PERCENTILE] != 'undefined') ? objItemAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_READING_CHECKPOINT] : 0
                            var sSummaryIwt           = (typeof objItemAttemptSummary[PERCENTILE.c_s_PERCENTILE] != 'undefined') ? objItemAttemptSummary[PERCENTILE.c_s_PERCENTILE][PERCENTILE.c_s_SUMMARY] : 0;  
                            var _dataTotalVal         = 0;
                            $(".circle_page.active").each(function () {
                                _dataVal    =   $(this).attr('data-value');                                
                                _dataTotalVal += arrRubric4Matrix[_dataVal];
                            });
                            var sReadCriticallyIwt     =   _dataTotalVal / 4;
                            var totIRScorePercentage   =   (parseFloat(sReadingCheckpoint) + parseFloat(sSummaryIwt) + parseFloat(sReadCriticallyIwt))/3;
                            totScorePercentage         =   totIRScorePercentage.toFixed(0);               
                            
                            wordCount             = 900;                        
                            InstructorScoreRubric = {
                                'rubricMaxScore'    :   rubricMaxScore,
                                'rubricScore'       :   rubricTotScore,
                                'rubricMaxScorePercent' :   100,
                                'rubricScorePercent':   sReadCriticallyIwt
                            };
                        }						
                    }
                    
                    if (objItemDetails.ItemSubType == 'paragraph') {                        
                        var sSummaryOverall        =   $(".param.last").find(".circle_page.active").attr('data-value');                        
                        totScorePercentage         =   parseFloat(arrRubric4Matrix[sSummaryOverall]);
                        totScorePercentage         =   totScorePercentage.toFixed(0);      
                                                
                        InstructorScoreRubric = {
                            'rubricMaxScore'    :   4,
                            'rubricScore'       :   sSummaryOverall,
                            'rubricMaxScorePercent' :   100,
                            'rubricScorePercent':   totScorePercentage
                        };
                    }
                    
                    if(objItemDetails.ItemSubType == 'essay') {                        
                        var sEssayOverall        =   $(".param.last").find(".circle_page.active").attr('data-value');                        
                        totScorePercentage       =   parseFloat(arrRubric6Matrix[sEssayOverall]);   
                        totScorePercentage       =   totScorePercentage.toFixed(0);  
                        
                        InstructorScoreRubric = {
                            'rubricMaxScore'    :   6,
                            'rubricScore'       :   sEssayOverall,
                            'rubricMaxScorePercent' :   100,
                            'rubricScorePercent':   totScorePercentage
                        };
                    }						
                    
                    InstructorScoreRubricStr    =   JSON.stringify(InstructorScoreRubric);
                    InstructorScoreRubricStr    =   encodeURIComponent(InstructorScoreRubricStr);                    
                    //AssignmentInstructorView.updateRefreshedContent = false;                    
                    SetScoreForGradeableItem(itemId, itemAttemptId, studentId, totScore, instructorScored, scoreComment, wordCount, InstructorScoreRubricStr);
					ShowLoader();
					$(".loaderContainerOverlay").css({
						'z-index' : '101'
					});
					$("#loaderContainer").css({
						'z-index' : '102'
					});
					var $this = $(this);
					
					var ScoreInterval = setInterval (function () {
						if (objScoreForGradeableItem != null) {
							
							/*	Update Status in Model Grade Data Until The Next GetGradeBookAttemptData get Called		*/
							//	Fetch Updated Element
							var oGradeScoredData	=	_.where(oSelf.model['AttemptData'], osearchFilter)[0];
							//	Remove It From Main Data Model
							oSelf.model['AttemptData'] 	= _.reject(oSelf.model['AttemptData'], function(obj){ 
																return (obj.IID == itemId && obj.SID == studentId) 
															});							
							//	Change the value manually of Updated Element
							oGradeScoredData['ICS']	=	'scored';
							oGradeScoredData['FS']	=	totScore;							
							oSelf.model['AttemptData'].push(oGradeScoredData);
							
							$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").attr('data-text', totScore);
							displayTotscore       = 0;
							try {
								displayTotscore   =   totScore + "/" + objGradeBookDetails['IMS'];
							} catch (exp) {
								console.log('No objGradeBookDetails For ', {ItemID: itemId, StudentID: studentId});
							}							
							
							//  Calculate Lexile Level For Student
							if (
								objItemDetails.ItemSubType == 'iwt' && 
								objItemDetails.ExtraPractice == 'No' 
							) {								
								GetUserLevel(studentId);
								oSelf.calculateLexileLevel(
									itemId, 
									studentId, 
									totScore, 
									objStudentDetails.UserCurrentReadingLevel, 
									objGradeBookDetails['IMS'], 
									totScorePercentage, 
									function (iLexileLevel) {										
										$("#dashboard-grid").find(".partname-qty[data-iid='"+itemId+"'][data-sid='"+studentId+"']").html(displayTotscore).removeClass("red-lbl");
										$("#dashboard-grid").find(".partname-qty[data-lexile='true'][data-sid='"+studentId+"']").html(iLexileLevel);
										$("#btnCloseModal").trigger('click');
										$('#dialog').dialog('destroy').remove();
										//AssignmentInstructorView.updateRefreshedContent = true;      
										//AssignmentInstructorView.refreshStatus = true;
										objScoreForGradeableItem = null;
										
										//clearInterval(AssignmentInstructorView.refreshInterval);
										//AssignmentContainerView.refreshData("AfetrLexileLevelCalculation");
										
										HideLoader();										
									}
								);
								clearInterval(ScoreInterval);
								return;
							}
							
							$("#dashboard-grid").find(".partname-qty[data-iid='"+itemId+"'][data-sid='"+studentId+"']").html(displayTotscore).removeClass("red-lbl");							
							$("#btnCloseModal").trigger('click');
							$this.dialog('destroy').remove();
							
							/* setTimeout(function () {
								AssignmentInstructorView.updateRefreshedContent = true;      
							}, 12000); */
							
							objScoreForGradeableItem	=	null;
							clearInterval(ScoreInterval);
							HideLoader();
						}
					}, 300);					
                },
                "No": function () {
                    $(this).dialog('destroy').remove();
//                    $(this).dialog('close');
                }
            },
            open: function () {
                $('.ui-dialog').addClass('Ilit_alert_box');
            }
	});
    });
    
    $("#acceptScore").off('click').on('click', function () {        
        
        var itemId          =   $("#scoreContainer").data().item;
        var itemAttemptId   =   $("#scoreContainer").data().itemattemptid;
        var studentId       =   $("#scoreContainer").data().student;
		var itemType        =   $("#scoreContainer").data().itemtype;
		
        var _mainObj        =   oSelf.digJson(studentAttemptData, 'traits');
        var mainObj         =   (_mainObj == null) ? null:  _mainObj; //studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits;
        var objTrait        =   (typeof mainObj == "undefined") ? null : mainObj; 
        
        var arrRubric4Matrix=   {4:100, 3:88, 2:75, 1:60, 0:55};
        var arrRubric6Matrix=   {6:100, 5:92, 4:85, 3:75, 2:70, 1:60};		
        var objItemDetails  =   _.where(oSelf.model['AssignmentListInfo'], {ItemID: itemId})[0];
		
		if (
			itemType == "phonictextbasedslide" || 
			itemType == "extendedphonic" ||  
			itemType == "frs" 
		) {
			var maxScore 	= parseFloat(objItemDetails.MaxScore),
				systemScore = parseFloat(oSelf.digJson(studentAttemptData, 'SystemScore')),
				iScore 		= ((systemScore/maxScore) * 100),
				iAccuracy 	= 0,
				iCnt 		= 0,
				outOf		= 100,
				aPKTOralFluencyResults = [];
				
				$.each(oSelf.oPKTScore, function (Idx,Val) {
					iAccuracy += (Val.pktVerified == 1) ? parseFloat(Val.pktData.AC) : parseFloat(Val.pktData.scoreData.scoreDataItemList[0].scoreValue);
					iCnt++;
					
					var oPKTResponse = {};
					oPKTResponse["QID"] = Idx;
					
					if (Val.pktVerified == 1) {
						oPKTResponse["AC"] = Val.pktData.AC;
						oPKTResponse["WCPM"] = Val.pktData.WCPM;
						oPKTResponse["WC"] = Val.pktData.WC;
						oPKTResponse["EX"] = Val.pktData.EX;
					}
					else{
						oPKTResponse["AC"] = Val.pktData.scoreData.scoreDataItemList[0].scoreValue;
						oPKTResponse["WCPM"] = Val.pktData.scoreData.scoreDataItemList[1].scoreValue;
						oPKTResponse["WC"] = Val.pktData.scoreData.scoreDataItemList[2].scoreValue;
						oPKTResponse["EX"] = Val.pktData.scoreData.scoreDataItemList[3].scoreValue;
					}
					aPKTOralFluencyResults.push(oPKTResponse);
				});
				var sPKTOralFluencyResults = encodeURIComponent(JSON.stringify(aPKTOralFluencyResults)),
					avgAccuracy = (iAccuracy/iCnt);
				totScore = Math.round((iScore + avgAccuracy) / 2);
				var sTitle = "The accuracy of the Oral Fluency is " + Math.round(avgAccuracy) + "%.";
		}
		else{
			var sPKTOralFluencyResults = "";
			totScore            =    oSelf.digJson(studentAttemptData, 'SystemScore');
			var outOf           =   parseInt($(".param:last").find(".circle_page").not('.scoring-guide-info').length); // IPP-5025
			var sTitle = "You scored this assignment " + parseInt(totScore) + " out of " + outOf;
        }		
		
        var sMessage = 'Is this the score that you would like to submit?';        
        var confirmTemplate =   _.template($("#confirmationTemplate").html());
        $("body").append(confirmTemplate);
        $('#dialog').attr('title', sTitle).html(sMessage).dialog({
            autoOpen:	true,
            resizable: 	false,
            draggable:	true,
            height: 275,
            width: 500,
            modal: true,
            buttons: {
                "Yes": function () {					
					var aTempGradeData	=	[];
					if(!objPlatform.isAndroid() && !objPlatform.isWindows()) {
						aTempGradeData	=	oSelf.model['AttemptData'];
					} else {
						for(var GradeDataKey = 0; GradeDataKey < oSelf.model['AttemptData'].length; GradeDataKey++) {
							if(typeof oSelf.model['AttemptData'][GradeDataKey] == "string") {
								aTempGradeData.push(JSON.parse(oSelf.model['AttemptData'][GradeDataKey]));
							} else {
								aTempGradeData.push(oSelf.model['AttemptData'][GradeDataKey]);
							}
						}								
					}
					oSelf.model['AttemptData']	=	aTempGradeData;
					
					var osearchFilter=	{};
					osearchFilter['IID']	=	itemId.toString();
					osearchFilter['SID']	=	studentId.toString();
                    var objGradeBookDetails = _.where(oSelf.model['AttemptData'], osearchFilter)[0];     
                    var totScorePercentage = 0;
                    var wordCount   =   0;
                    var InstructorScoreRubric = '';
                    
                    if(objItemDetails.ItemSubType == 'paragraph') {
                        var sSummaryOverall        =   parseInt(totScore);
                        totScorePercentage         =   parseFloat(arrRubric4Matrix[sSummaryOverall]);           
                        totScorePercentage         =   totScorePercentage.toFixed(0);
                        
                        InstructorScoreRubric = {
                            'rubricMaxScore'    :   4,
                            'rubricScore'       :   sSummaryOverall,
                            'rubricMaxScorePercent' :   100,
                            'rubricScorePercent':   totScorePercentage
                        };
                    }
                    
                    if(objItemDetails.ItemSubType == 'essay') {                           
                        var sEssayOverall        =   parseInt(totScore);
                        totScorePercentage       =   parseFloat(arrRubric6Matrix[sEssayOverall]);                          
                        totScorePercentage       =   totScorePercentage.toFixed(0);
                        
                        InstructorScoreRubric = {
                            'rubricMaxScore'    :   6,
                            'rubricScore'       :   sEssayOverall,
                            'rubricMaxScorePercent' :   100,
                            'rubricScorePercent':   totScorePercentage
                        };
                    }                 
                    
                    InstructorScoreRubricStr    =   JSON.stringify(InstructorScoreRubric);
                    InstructorScoreRubricStr    =   encodeURIComponent(InstructorScoreRubricStr);
                    
                    //AssignmentInstructorView.updateRefreshedContent = false;
                    
					if (
						itemType == "phonictextbasedslide" || 
						itemType == "extendedphonic" ||  
						itemType == "frs" 
					) {
						var instScoreData = 0;
					}
					else {
						var instScoreData = totScore;
						totScore    =   parseInt(totScore);
					}
                    
					
                    SetScoreForGradeableItem(itemId, itemAttemptId, studentId, totScore, instScoreData, '', wordCount, InstructorScoreRubricStr, sPKTOralFluencyResults);
					
					
					var $this = $(this);
					ShowLoader();
					$(".loaderContainerOverlay").css({
						'z-index' : '101'
					});
					$("#loaderContainer").css({
						'z-index' : '102'
					});
					var AcceptScoreInterval = setInterval(function () {
					
						if(objScoreForGradeableItem != null) {
							try {
								if (
									itemType == "phonictextbasedslide" || 
									itemType == "extendedphonic" ||  
									itemType == "frs" 
								) {
									displayTotscore   =   totScore + "/100";
								}
								else {
									displayTotscore   =   totScore + "/" + objGradeBookDetails['IMS'];
								}
							} catch (exp) {
								if (
									itemType == "phonictextbasedslide" || 
									itemType == "extendedphonic" ||  
									itemType == "frs" 
								) {
									displayTotscore   =   totScore + "/100";
								}
								else{
									displayTotscore   =   totScore;
								}
							}
							
							/*	Update Status in Model Grade Data Until The Next GetGradeBookAttemptData get Called		*/
							//	Fetch Updated Element
							var oGradeScoredData	=	_.where(oSelf.model['AttemptData'], osearchFilter)[0];
							//	Remove It From Main Data Model
							oSelf.model['AttemptData'] 	= _.reject(oSelf.model['AttemptData'], function(obj){ 
																return (obj.IID == itemId && obj.SID == studentId) 
															});							
							//	Change the value manually of Updated Element
							oGradeScoredData['ICS']	=	'scored';
							oGradeScoredData['FS']	=	totScore;							
							oSelf.model['AttemptData'].push(oGradeScoredData);
							
							
							$("#dashboard-grid").find(".partname-qty[data-iid='"+itemId+"'][data-sid='"+studentId+"']").attr('data-text', displayTotscore).html(displayTotscore).removeClass("red-lbl");							
							$("#btnCloseModal").trigger('click');
							$this.dialog('destroy').remove();		

							/* setTimeout(function () {
								AssignmentInstructorView.updateRefreshedContent = true;      
							}, 12000); */
							
							objScoreForGradeableItem	=	null;
							clearInterval(AcceptScoreInterval);
							HideLoader();
						}
						
					}, 300);                    
                },
                "No": function () {
                    $(this).dialog('destroy').remove();
                }
            },
            open: function () {
                $('.ui-dialog').addClass('Ilit_alert_box');
            }
	});
        
    });
};


/**
 * Scroll To Box Bottom on Focus of Comment Textarea
 * @returns {undefined}
 */
AssignmentScoreView.prototype.focusCommentBox =   function () {
    $("#comments, #commentScore").off('focus').on('focus', function () {                
        $("#scoreBoxScroll").animate({ scrollTop: $("#scoreBoxScroll")[0].scrollHeight }, 400);            
    });
};

/**
 * Calculate Student Lexile Level
 * @param {String} psItemId
 * @param {String} psStudentId
 * @param {Number} piTotScore
 * @param {Number} piStudentLexileLevel
 * @param {Number} piItemMaxScore
 * @param {Number} totScorePercentage
 * @param {Function} fCallBack
 * @returns {boolean} true
 */
AssignmentScoreView.prototype.calculateLexileLevel = function (psItemId, psStudentId, piTotScore, piStudentLexileLevel, piItemMaxScore, totScorePercentage, fCallback){
	var oSelf = this;	
	
	//	Checking For Current Settings
    if(objUserLevel != null) {		
        var oUserLevelData = objUserLevel.Content,
			aUserReadingLevelDetails = [],
			aUserLexileLevelDetails = [],
			aRLDetails = [],
			aLLDetails = [],
			sGradeCode = objUnitDetails.gradeCode || "gbe",		
			iLexileConst = 0,
			iCurrentWeekRange = Math.ceil(oSelf.model['CurrentWeek'] / 5),
			iCurReadingLevel = piStudentLexileLevel;
			
		if (sGradeCode.match(/\d/)) {
			sGradeCode = oSelf.model.oGradeCodeMapping[sGradeCode];
		}

		//	No student scored Yet
		if (
			[undefined, null, ''].indexOf(oUserLevelData.UserReadingLevelDetails) === -1
		){
			aUserReadingLevelDetails = JSON.parse(decodeURIComponent(oUserLevelData.UserReadingLevelDetails));
			
			for (var iI = 0; iI < aUserReadingLevelDetails.length; iI++) {
				var iUnit = parseInt(aUserReadingLevelDetails[iI]['UN']) || 0,
				iRL = parseInt(aUserReadingLevelDetails[iI]['RL']) || 5;

				if (iUnit !== 0) {
					aRLDetails.push({
						'UN': iUnit,
						'RL': iRL
					});
				}
			}
			aUserReadingLevelDetails = aRLDetails;
		}
		
		if (
			[undefined, null, ''].indexOf(oUserLevelData.UserLexileLevelDetails) === -1
		){
			aUserLexileLevelDetails = JSON.parse(decodeURIComponent(oUserLevelData.UserLexileLevelDetails));
			
			
			for (var iI = 0; iI < aUserLexileLevelDetails.length; iI++) {
			
				var iUnit = parseInt(aUserLexileLevelDetails[iI]['U'] || aUserLexileLevelDetails[iI]['UN']) || -1,
					iWeek = parseInt(aUserLexileLevelDetails[iI]['W']) || oSelf.model['CurrentWeek'],
					iLL = parseInt(aUserLexileLevelDetails[iI]['L'] || aUserLexileLevelDetails[iI]['LL']) || -5;

				if (iUnit !== -1 && iLL !== -5) {
					aLLDetails.push({
						'U': iUnit,
						'W': iWeek,
						'L': iLL
					});
				}
			}
			// sorting based on unit number & week number
			aUserLexileLevelDetails = _.sortBy(
				aLLDetails,
				function (oLLDetails) {
					return [oLLDetails['U'], oLLDetails['W']];
				}
			);
		}
		
		//	Get Reading Level from student List Info
        try {
			var objStudent      = _.where(oSelf.model['StudentList'], {UserID: psStudentId}),
			iCurReadingLevel 	= objStudent[0].UserCurrentReadingLevel;
        }
		catch(exp) {
            iCurReadingLevel = piStudentLexileLevel;
        }

		//	Get Assignment Max Score
		try {
			var osearchFilter=	{};
			osearchFilter['IID'] = psItemId.toString();
			osearchFilter['SID'] = psStudentId.toString();
				
            var objItem 		= _.where(oSelf.model['AttemptData'], osearchFilter),
				iItemMaxScore 	= objItem[0]['IMS'];
        }
		catch(exp) {
            var iItemMaxScore	= piItemMaxScore;
        }

		//	Get Current Week and Unit
        try {
            var objAssignment   =   _.where(oSelf.model['AssignmentListInfo'], {ItemID: psItemId}),
				iCurrentWeek    =   objAssignment[0].WeekNumber,
				iCurrentUnit    =   objAssignment[0].UnitNumber;
        }
		catch(exp) {
			var iCurrentUnit    =   1,
				iCurrentWeek    =   oSelf.model['CurrentWeek'];
        }
    
        var iFinalScore 		= piTotScore,
			fPercentageScore 	= totScorePercentage;

        var iReadingLevel = 0,
			iLexileLevel  = 0;

		//	Calculate Reading Level
        if(iCurReadingLevel  ==  1) {
			// When current Reading Level reach @ highest level i.e. 1
			// If IR scoring < 65% then reduce the Reading Level, Otherwise remain same i.e. scoring in between 65%-79% or greater than 80%
            if(fPercentageScore < 65) {
                iReadingLevel   =   2;
            }
			else {
                iReadingLevel   =   1;
            }
        }  else if (iCurReadingLevel  ==  9) {
			// When current Reading Level reach @ lowest level i.e. 9
			// If IR scoring >= 80% then increase the Reading Level, Otherwise remain same i.e. scoring in between 65%-79% or less than 65%
			if(fPercentageScore >= 80) {
                iReadingLevel   =   8;
            }
			else {
			    iReadingLevel   =   9;
            } 
        } else {
			// When current Reading Level belongs from 2 to 8
			// If IR scoring >= 80% then increase the Reading Level
			// If IR scoring >= 65% & <=79% then remain same
			// If IR scoring < 65% then decrease the Reading Level
            if(fPercentageScore < 65) {
                iReadingLevel   =   iCurReadingLevel + 1;
            }
			else if(fPercentageScore >= 65 && fPercentageScore <= 79) {
                iReadingLevel   =   iCurReadingLevel;
            }
			else if(fPercentageScore >= 80) {
                iReadingLevel   =   iCurReadingLevel - 1;
            }
        } 
		
		//	Lexile Matrix
		var arrLexileConst  =   {
		  "gbe": {
			"week-range-1": {"level9": 150,"level8": 350,"level7": 450,"level6": 690,"level5": 800,"level4": 900,"level3": 975,"level2": 1020,"level1": 1040},
			"week-range-2": {"level9": 200,"level8": 450,"level7": 550,"level6": 750,"level5": 850,"level4": 940,"level3": 1010,"level2": 1040,"level1": 1060},
			"week-range-3": {"level9": 350,"level8": 550,"level7": 600,"level6": 800,"level5": 900,"level4": 980,"level3": 1020,"level2": 1060,"level1": 1100},
			"week-range-4": {"level9": 350,"level8": 600,"level7": 630,"level6": 800,"level5": 930,"level4": 1020,"level3": 1040,"level2": 1100,"level1": 1125},
			"week-range-5": {"level9": 450,"level8": 620,"level7": 675,"level6": 850,"level5": 940,"level4": 1040,"level3": 1100,"level2": 1130,"level1": 1150},
			"week-range-6": {"level9": 550,"level8": 675,"level7": 680,"level6": 900,"level5": 980,"level4": 1070,"level3": 1120,"level2": 1150,"level1": 1180}
		  },
		  "gbm": {
			"week-range-1": {"level9": 150,"level8": 350,"level7": 450,"level6": 690,"level5": 800,"level4": 850,"level3": 900,"level2": 1020,"level1": 1100},
			"week-range-2": {"level9": 200,"level8": 450,"level7": 550,"level6": 750,"level5": 850,"level4": 900,"level3": 930,"level2": 1040,"level1": 1125},
			"week-range-3": {"level9": 350,"level8": 550,"level7": 600,"level6": 800,"level5": 900,"level4": 940,"level3": 970,"level2": 1100,"level1": 1150},
			"week-range-4": {"level9": 350,"level8": 600,"level7": 630,"level6": 800,"level5": 930,"level4": 970,"level3": 1070,"level2": 1130,"level1": 1180},
			"week-range-5": {"level9": 450,"level8": 620,"level7": 675,"level6": 850,"level5": 940,"level4": 1010,"level3": 1040,"level2": 1150,"level1": 1200},
			"week-range-6": {"level9": 550,"level8": 675,"level7": 680,"level6": 900,"level5": 980,"level4": 1040,"level3": 1070,"level2": 1175,"level1": 1230}
		  },
		  "gbh": {
			"week-range-1": {"level9": 150,"level8": 350,"level7": 450,"level6": 690,"level5": 800,"level4": 900,"level3": 960,"level2": 1040,"level1": 1100},
			"week-range-2": {"level9": 200,"level8": 450,"level7": 550,"level6": 750,"level5": 850,"level4": 930,"level3": 990,"level2": 1070,"level1": 1125},
			"week-range-3": {"level9": 350,"level8": 550,"level7": 600,"level6": 800,"level5": 900,"level4": 970,"level3": 1040,"level2": 1100,"level1": 1150},
			"week-range-4": {"level9": 350,"level8": 600,"level7": 630,"level6": 800,"level5": 930,"level4": 1000,"level3": 1060,"level2": 1120,"level1": 1180},
			"week-range-5": {"level9": 450,"level8": 620,"level7": 675,"level6": 850,"level5": 940,"level4": 1040,"level3": 1100,"level2": 1150,"level1": 1200},
			"week-range-6": {"level9": 550,"level8": 675,"level7": 680,"level6": 900,"level5": 980,"level4": 1070,"level3": 1120,"level2": 1180,"level1": 1230}
		  }
		};
		
		
		//	Fetch Lexile Based On "Grade" & "Week" & "Reading Level"		
        iLexileConst     = arrLexileConst[sGradeCode]["week-range-"+iCurrentWeekRange]["level"+iReadingLevel];
        var bLexileMove  = false,
			iLexileLevel = 0,
			iRetrieveLexileIdx = -1,
			iRetrieveReadingIdx = -1;
        
		var aRetrieveReadingIdx = $.map(aUserReadingLevelDetails, function(obj, index) {
										if(parseInt(obj.UN) == iCurrentUnit) {
											return index;
										}
									});
		
		var aRetrieveLexileIdx = $.map(aUserLexileLevelDetails, function(obj, index) {
										if(parseInt(obj.U) == iCurrentUnit) {
											return index;
										}
									});

		iRetrieveReadingIdx = (aRetrieveReadingIdx.length > 0) ? aRetrieveReadingIdx[0] : -1;
		iRetrieveLexileIdx = (aRetrieveLexileIdx.length > 0) ? aRetrieveLexileIdx[aRetrieveLexileIdx.length-1] : -1;
		
		//	Student has default Reading Level && Reading Level calculation not yet done
		if (iRetrieveLexileIdx != -1) {
			var _currUnit    = aUserLexileLevelDetails[iRetrieveLexileIdx]["U"],
				_currReading = iCurReadingLevel;
			
			if(iReadingLevel == 1) {
				if(_currReading == 1 && _currUnit == iCurrentUnit) {
					bLexileMove =   true;
				}
			} else if(iReadingLevel == 9) {
				if(_currReading == 9 && _currUnit == iCurrentUnit) {
					bLexileMove =   true;
				}
			}
		}
            
        //  Calculate Lexile (+25 -25 logic)
        /* if(iReadingLevel == 1) {
            if(bLexileMove) {                
                iLexileLevel = parseInt(aUserLexileLevelDetails[iRetrieveLexileIdx]["L"]) + 25;
            } else {
                iLexileLevel = iLexileConst;
            }
        } 
		else if(iReadingLevel ==  9) {
            if(bLexileMove) {                
                iLexileLevel = parseInt(aUserLexileLevelDetails[iRetrieveLexileIdx]["L"]) - 25;
				if(iLexileLevel < 0) {
					iLexileLevel = 0;
				}
            } else {
                iLexileLevel = iLexileConst;
            }
        }
		else { */
            iLexileLevel = iLexileConst;
        /* } */
        
		if(iRetrieveReadingIdx != -1) {
			aUserReadingLevelDetails[iRetrieveReadingIdx].RL = iReadingLevel
		}
		else {
			oUserReadingLevelDetails = {"UN":iCurrentUnit,"RL":iReadingLevel};
			aUserReadingLevelDetails.push(oUserReadingLevelDetails);
		}
		
		
		var aRetrieveUpdatedLexileIdx = $.map(aUserLexileLevelDetails, function(obj, index) {
											if(parseInt(obj.U) == iCurrentUnit && parseInt(obj.W) == iCurrentWeek) {
												return index;
											}
										}),
			iRetrieveUpdatedLexileIdx = (aRetrieveUpdatedLexileIdx.length > 0) ? aRetrieveUpdatedLexileIdx[0] : -1;
		
		if(iRetrieveUpdatedLexileIdx != -1) {
			aUserLexileLevelDetails[iRetrieveUpdatedLexileIdx].L = iLexileLevel;
		}
		else {
			oUserLexileLevelDetails = {"U":iCurrentUnit,"W":iCurrentWeek,"L":iLexileLevel};
			aUserLexileLevelDetails.push(oUserLexileLevelDetails);
		}
		
		var sUserReadingLevelDetails = encodeURIComponent(JSON.stringify(aUserReadingLevelDetails)),
			sUserLexileLevelDetails = encodeURIComponent(JSON.stringify(aUserLexileLevelDetails));
		
		// Set Level
        SetUserLevel(psStudentId, iLexileLevel, iReadingLevel, sUserReadingLevelDetails, sUserLexileLevelDetails);    
		
		//	Free UserLevel Variable
		objUserLevel = null;
		
		var iObjStudIdx = $.map(oSelf.model['StudentList'], function(obj, index) {
							if(parseInt(obj.UserID) == psStudentId) {
								return index;
							}
						});
		
		oSelf.model['StudentList'][iObjStudIdx].UserCurrentReadingLevel = iReadingLevel;
		oSelf.model['StudentList'][iObjStudIdx].UserCurrentLexileLevel = iLexileLevel;
		
		fCallback(iLexileLevel);
        return;
    } else {        
        setTimeout(function () {
            oSelf.calculateLexileLevel(psItemId, psStudentId, piTotScore, piStudentLexileLevel, piItemMaxScore, totScorePercentage, fCallback);
        }, 1000);
    }    
};

 
/**
 * Class InventoryPopup
 * @returns void
 */
function InventoryPopup (oData, oParent) {	
	this.model = oData;
	this.oParent = oParent;
	this.CONSTANTS = {
		"c_s_TABS" : ["Initial", "Mid Year", "End of Year"],
		"c_s_TABS_CODE" : ["BOY", "MOY", "EOY"]
	};
	
	this.init();
}


InventoryPopup.prototype.init = function () { 
	var oSelf = this;	
	
	DisableNativeBottomBar(true);
	clearInterval(oSelf.oParent.oAutoRefreshInterval);
	oSelf.getData();
}

InventoryPopup.prototype.getData = function () {
	var oSelf = this;
	
	// get assignment list assigned to students
	$.nativeCall({
		'method':			'GetInterestInventory',
		'inputParams': 		[oSelf.model.studentID],
		'globalResource':	'objGetInterestInventoryResponse',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			oSelf.model.inventoryResponse = objGetInterestInventoryResponse.Content;
			oSelf.model.inventoryQuestions = LIBRARY.c_o_INTEREST_INVENTORY_DATA;
			
			oSelf.render();
			oSelf.bindEvents();
			oSelf.resize();										
		}
	});		
}

InventoryPopup.prototype.render = function () {
	var oSelf = this;
	
	$("#PopupArea").html(_.template($("#popupTemplate").html(), {
		"sClass": "inventory",
		"CONSTANTS": oSelf.CONSTANTS
	}));
	$("#popupContent").html(_.template($("#inventoryTemplate").html(), {
		"data": oSelf.model,
		"CONSTANTS": oSelf.CONSTANTS
	}));	
}

InventoryPopup.prototype.bindEvents = function () {
	var oSelf = this;
	
	// Done Click
	$("#bttnCloseInventory").off('click').on('click', function () {
		$("#PopupArea").html('');
		DisableNativeBottomBar(false);
		oSelf.oParent.resetAutoRefreshInterval();
	});
	
	// Tab Click
	$(".inventory-wrapper .table-slider-tabs li a").off('click').on('click', function () {
		var idx = $(this).attr("data-view");		
		$(".inventory-wrapper .table-slider-tabs li a").removeClass("active");
		$(this).addClass("active");
		$(".inventory-question-box").hide();
		$("#question-answers"+idx).show();
		event.stopPropagation(); 
	});
}

InventoryPopup.prototype.resize = function () {
	var iWrapperHeight = parseInt($(".md-modal.inventory").innerHeight()),
		iHeaderHeight = parseInt($(".md-modal header").outerHeight()),
		iTabHeight = parseInt($(".md-modal .table-slider-tabscont").outerHeight());		
	
	$(".inventory-question-box").css({"height": iWrapperHeight - (iHeaderHeight + iTabHeight) + 'px'});
}

/*******************/
/**
 * Class ReviewPopup
 * @returns void
 */
function ReviewPopup (oData) {	
	this.model = oData;
	this.StarRatings = {
		"1":"Did not like it",
		"2":"It was okay",
		"3":"Liked it",
		"4":"Really liked it",
		"5":"It was awesome"
	};
	this.PredefinedCommentCodes = {
		"C1":	"It sucked",
		"C2":	"I liked it",
		"C3":	"I didn't like it",
		"C4":	"I learned a lot",
		"C5":	"It was too hard to read",
		"C6":	"I didn't understand it",
		"C7":	"It was exciting",
		"C8":	"It was boring",
		"C9":	"I liked the setting",
		"C10":	"I liked the characters",
		"C11":	"I related to the characters",
		"C12":	"It was funny",
		"C13":	"It was sad",
		"C14":	"It was scary",
		"C15":	"It was suspenseful",
		"C16":	"It changed my point of view",	
		"C17":	"It changed my views",
		"C18":	"I couldn't put it down",
		"C19":	"I couldn't get into it",
		"C20":	"I couldn't relate to the characters",
		"C21":	"It inspired me",															
		"C22":	"It captured my imagination",
		"C23":	"I enjoyed author's style",										
		"C24":	"Thought about when not reading it",
		"C25":	"It was so exciting",
		"C26":	"It was so boring"
	};
	this.iSlideVisible = 1;
	
	this.init();
}


ReviewPopup.prototype.init = function () { 
	var oSelf = this;	
	
	oUtility.showLoader({
		'message': '<img src="media/loader.gif" alt="" />',
		'background-color': '#fff',
		'click-to-hide': false,
		'opacity': 0.5
	});
	DisableNativeBottomBar(true);
	oSelf.getData();
}

ReviewPopup.prototype.getData = function () {
	var oSelf = this,
		aItemIds = [],
		fCheckReview = function () {
			if (objGetBookReviewFeedbackData) {
				fCallback();
			}
			else {
				setTimeout(fCheckReview, 200);
			}
		}
		fCallback = function () {
			// get books reviewed by student
			objGetBookReviewFeedbackData = 0;
			$.nativeCall({
				'method':			'GetBookReviewFeedback',
				'inputParams': 		[aItemIds, oSelf.model.studentID],
				'globalResource':	'objGetBookReviewFeedbackData',
				'interval':			500,
				'breakAfter':		125000,
				'debug':			false,				
				'onComplete': function () {				
					oSelf.model.reviewData = objGetBookReviewFeedbackData.Content;
					oSelf.model.bookDetail = objBookList.bookset[0];				
					oSelf.iSlideCount = objGetBookReviewFeedbackData.Content.length ? Math.ceil(objGetBookReviewFeedbackData.Content.length/6) : 1;					
					oSelf.render();
					oSelf.bindEvents();
					oSelf.resize();										
				}
			});
		}
	
	objLibraryProgressSummary = null;
	objGetBookReviewFeedbackData = 0;
	// get completed book list
	$.nativeCall({
		'method':			'GetLibraryProgressSummary',
		'inputParams': 		[oSelf.model.studentID],
		'globalResource':	'objLibraryProgressSummary',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function () {
			aItemIds = objLibraryProgressSummary.Content ? objLibraryProgressSummary.Content.BookCompletedItemIDs : [];	
			
			/* no GetBookReviewFeedback call if no books reviewed */
			if (aItemIds.length == 0) {
				oSelf.model.reviewData = [];
				oSelf.model.bookDetail = [];				
				oSelf.iSlideCount = 1;					
				oSelf.render();
				oSelf.bindEvents();
				oSelf.resize();	
			}			
			else if (objPlatform.isBrowser()) {
				setTimeout(fCheckReview, 200); // note: GetBookReviewFeedback is called in background, so need to wait for its response
			}			
			else {
				fCallback();
			}
		}
	});
	
}

ReviewPopup.prototype.render = function () {
	var oSelf = this;
	
	$("#PopupArea").html(_.template($("#popupTemplate").html(), {
		"sClass": "review",
		"CONSTANTS": oSelf.CONSTANTS
	}));
	$("#popupContent").html(_.template($("#bookReviewTemplate").html(), {
		"data": oSelf.model,
		"CONSTANTS": oSelf.CONSTANTS,
		"StarRatings": oSelf.StarRatings,
		"PredefinedCommentCodes": oSelf.PredefinedCommentCodes
	}));

	oUtility.hideLoader();
}

ReviewPopup.prototype.bindEvents = function () {
	var oSelf = this;
	
	// Done Click
	$("#bttnCloseReview").off('click').on('click', function () {
		$("#PopupArea").html('');
		DisableNativeBottomBar(false);
	});	
	
	// Next Button
	$("#nextPagingBtnRev").off('click').on('click', function () {		
		oSelf.swipeNext.call(this, oSelf);
	});
	
	// Prev Button
	$("#prevPagingBtnRev").off('click').on('click', function () {
		oSelf.swipePrev.call(this, oSelf);
	});	
	
	// Book Click
	$(".book-cover-slide").off("click").on("click", function () {
		$(".book-cover-slide").removeClass("active");
		$(this).addClass("active");
		var oBookDetl = _.where(objBookList.bookset[0], {"book_id": $(this).attr("data-book-id")});
		var oBookReview = _.where(oSelf.model.reviewData, {"ItemID": $(this).attr("data-book-id")});
		$("#review-book-detail").html(_.template($("#bookReviewDetailTemplate").html(), {
			"data": oBookDetl[0],
			"reviewData": oBookReview[0],
			"StarRatings": oSelf.StarRatings,
			"PredefinedCommentCodes": oSelf.PredefinedCommentCodes
		}));
	});	
}

/**
 * Swipe to Next Page  
 * @method swipeNext
 * @return 
 */
ReviewPopup.prototype.swipeNext = function (oSelf) {
	var fSlideWidth = $(".wrapper-book-div").width(),
		iSlideVisible = oSelf.iSlideVisible;
		
	if ($(this).hasClass('disabled')) {
		return;
	}

	oSelf.iSlideVisible++;
	$(".Popup_student_inner").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show prev button
	$('#prevPagingBtnRev').removeClass("disabled").show();

	// hide next button if on last slide
	if (oSelf.iSlideVisible == oSelf.iSlideCount) {		
		$('#nextPagingBtnRev').addClass("disabled").hide();
	}	
}

/**
 * Swipe to Previous Page  
 * @method swipePrev 
 * @return 
 */
ReviewPopup.prototype.swipePrev = function (oSelf) {
	var fSlideWidth = $(".wrapper-book-div").width(),
		iSlideVisible = oSelf.iSlideVisible - 2;
		
	if ($(this).hasClass('disabled')) {
		return;
	}
	
	oSelf.iSlideVisible--;
	$(".Popup_student_inner").css({"left": -(fSlideWidth * iSlideVisible)+'px'});
	
	// show next button
	$('#nextPagingBtnRev').removeClass("disabled").show();
	
	// hide prev button if on first slide
	if (oSelf.iSlideVisible == 1) {		
		$('#prevPagingBtnRev').addClass("disabled").hide();
	}	
}

ReviewPopup.prototype.resize = function () {
	var iWrapperHeight = parseInt($(".md-modal.review").innerHeight()),		
		iHeaderHeight = parseInt($(".md-modal.review .modal-head").outerHeight()),
		iBookListHeight = parseInt($(".review-book-list").outerHeight());		
	
	$(".review-wrapper .modal-block").css({"height": iWrapperHeight - (iHeaderHeight + iBookListHeight + 10) + 'px'});
}

 
/**
 * Show Loader
 * @returns {undefined}
 */
function ShowLoader () {
	var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
	$("#loaderContainer").html(loaderImg).addClass('loaderContainer');
	$("#loaderContainer").show();
	$(".loaderContainerOverlay").show();
}

/**
 * Hide Loader
 * @returns {undefined}
 */
function HideLoader () {
	$(".loaderContainerOverlay").removeAttr('style');
    $("#loaderContainer").html('').hide();
    $("#loaderContainer").removeClass('loaderContainer');    
}