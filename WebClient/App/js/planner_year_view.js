/**
 * plannerYearView.js - JavaScript document
 * Created for implementing Planner Year View functionality
 * (c) 2015-2016 iLit. All rights reserved.
 * @author LearningMate Solutions Private Limited 
 * @version 
 * @license 
 */

function PlannerYearView () {}

// PlannerYearView properties
PlannerYearView.model = null;
PlannerYearView.showAlertMessageFlag = false;
PlannerYearView.showAlertMessageCount = 0;
PlannerYearView.filterMsgData = null;
PlannerYearView._alert = ISeriesBase.prototype._alert;
PlannerYearView.viewMode = "";
PlannerYearView.oCurVal = null;
PlannerYearView.bOnLoad = false;



/**
* @method: init 
* @uses: for initialize the object
* @return void;
*/
PlannerYearView.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.viewMode = "lesson";/* (
						objPlannerJsonData.viewType != null || 
						typeof objPlannerJsonData.viewType != 'undefined' || 
						objPlannerJsonData.viewType.toLowerCase() == 'week'
					) ? "lesson" : "unit" */
	
	oSelf.oUtility = new (function () {	
		this.set =  function(name, value) {
			if (oSelf.oCurVal == null) {
				oSelf.oCurVal = {};
			}
			oSelf.oCurVal[name] = value;
		};
		this.get = function(name) {
			return (
						(
							oSelf.oCurVal == null || 
							oSelf.oCurVal[name] == null
						) ? 0 : (
									isNaN(oSelf.oCurVal[name]) ? oSelf.oCurVal[name] : parseInt(oSelf.oCurVal[name])
								)
						);
		};
		this.getValues4LaunchGradeItem = function (oSelf) {
			var oData = {};
			if (oSelf.viewMode == 'lesson') {			
				var iUnitIndex = oSelf.oUtility.get("unit"),
					iWeekIndex = oSelf.oUtility.get("week"),
					oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
					aSortedWeekData = _.sortBy(oSortedUnitData[iUnitIndex].week, function(obj){return parseInt(obj.weekOrderNumber);}),
					aSortedItemData = _.sortBy(
										_.reject(aSortedWeekData[iWeekIndex].item, function(num){
											return num.itemType == "assignment"; 
										}), function(obj){return parseInt(obj.itemNumber);}
									),
					lessonData = aSortedItemData[oSelf.oUtility.get(oSelf.viewMode)],
					iUnitNumber = oSortedUnitData[iUnitIndex].unitNumber,
					iWeekNumber = aSortedWeekData[iWeekIndex].weekNumber,
					sItemId = lessonData.itemID,
					oRataBookData = _.where(oSelf.model.gradeItemsData.item, {"itemID": sItemId}),
					sRataBookId = oRataBookData[0].lessonratabookitemID,
					steachFrom = "lesson";
			}
			
			else if (oSelf.viewMode == 'sllesson') {
				
				var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
					aSLIdx = oSelf.oUtility.get(oSelf.viewMode).split("_"),
					oItemData = {},
					iUnitNumber = "",
					iWeekNumber = "";
					
				$.each(oSortedUnitData, function (uIdx, uVal) {
					var oSortedWeekData = _.sortBy(uVal.week,  function(obj){return parseInt(obj.weekOrderNumber)});
					$.each(oSortedWeekData, function (wIdx, wVal) {
						if (
							wVal.supplementaryLessonType == aSLIdx[1]
						){	
							$.each(wVal.item, function(iIdx, iVal){	
								if (
									wIdx == parseInt(aSLIdx[2]) && 
									iIdx == parseInt(aSLIdx[3]) && 
									iVal.itemSubType == "sl"
								) {
									iUnitNumber = uVal.unitNumber;
									oItemData = iVal;
									iWeekNumber = wVal.weekNumber;
								}
							});
						}
					});
				});	
				
				var sItemId = oItemData.itemID,
					oRataBookData = _.where(oSelf.model.gradeItemsData.item, {"itemID": sItemId}),
					sRataBookId = oRataBookData[0].lessonratabookitemID,
					steachFrom = aSLIdx[1];
			}
			else {
				var aSortedGradeData = _.sortBy(oSelf.model.assessmentData, function(obj){return parseInt(obj.itemOrderNumber);}),
					oGradeData = aSortedGradeData[oSelf.oUtility.get(oSelf.viewMode)],
					iUnitNumber = oGradeData.unitNumber,
					iWeekNumber = oGradeData.weekNumber,
					sItemId = oGradeData.lessonID,
					sRataBookId = oGradeData.lessonratabookitemID,
					steachFrom = "grade";
			}
			
			oData.unitNumber = iUnitNumber;
			oData.weekNumber = iWeekNumber;
			oData.itemId = sItemId;
			oData.rataBookId = sRataBookId;
			oData.teachFrom = steachFrom;
			
			return oData;
		};
		this.appVersionIsGreater = function (aAppCurVer, aMsgVer) {
			var bFound = false,
				sAppVer = new String(),
				sMsgVer = new String(),
				iLoopCounter = (aMsgVer.length > aAppCurVer.length) ? aMsgVer.length : aAppCurVer.length;
			
			for (var iCnt = 0; iCnt < iLoopCounter; iCnt++) {
				sAppVer += (isNaN(parseInt(aAppCurVer[iCnt])) && (typeof aAppCurVer[iCnt] == "undefined")) ? '0' : aAppCurVer[iCnt].toString();
				sMsgVer += (isNaN(parseInt(aMsgVer[iCnt])) && (typeof aMsgVer[iCnt] == "undefined")) ? '0' : aMsgVer[iCnt].toString();
			}
			
			if(parseInt(sMsgVer) > parseInt(sAppVer)) {
				bFound= true;
			}
			
			return bFound;
		};
		this.getSortedUnitData = function (unitData, isSupplemental) {
			return	_.sortBy(
				_.filter(unitData, 
					function(obj) { 
						return obj.isSupplementaryUnit == isSupplemental; 
					}
				), 
				function(obj) {
					return parseInt(obj.unitOrderNumber);
				}
			);
		};
	})();
	
	// Start: IPP-3650
	try{
		for (var iIdx = 0; iIdx < Object.keys(oSelf.model.plannerData).length; iIdx++) {
			if(!_.has(oSelf.model.plannerData[iIdx], "isSupplementaryUnit") ) {
				throw (GENERAL.c_s_DATA_STRUCTURE_NOT_UPDATED);
			}
		};
	}
	catch(err){
		PlannerYearView._alert({
			divId:		'dialog-message',
			title:		'Alert!',
			message:	err
		});
		return;
	}
	// End of IPP-3650
	
	
	if (
		oSelf.model.itemID != '' && 
		oSelf.model.unitNumber != '' && 
		oSelf.model.weekNumber != ''
	) {
		var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
			curUnit = $.map(oSortedUnitData, function(obj, index) {
							if(obj.unitNumber == oSelf.model.unitNumber) {
								return index;
							}
						});	
		
		// Set true for first time loading if record exist
		oSelf.bOnLoad = true;
		
		if (Object.keys(curUnit).length > 0) {
			
			oSelf.viewMode = "unit";
			oSelf.oUtility.set("unit", curUnit[0]);
			var curUnitIdx = curUnit[0],
				aSortedWeekData = _.sortBy(oSortedUnitData[curUnitIdx].week, function(obj){return parseInt(obj.weekOrderNumber);}),
				curWeek = $.map(aSortedWeekData, function(obj, index) {
								if(obj.weekNumber == oSelf.model.weekNumber) {
									return index;
								}
							});
				
			if (Object.keys(curWeek).length > 0) {
			
				oSelf.viewMode = "week";
				oSelf.oUtility.set("week", curWeek[0]);
				var curWeekIdx = curWeek[0],
					aSortedItemData = _.sortBy(
							_.reject(aSortedWeekData[curWeekIdx].item, function(num){
								return num.itemType == "assignment"; 
							}), function(obj){return parseInt(obj.itemNumber);}
						),
					curItem = $.map(aSortedItemData, function(obj, index) {
								if(obj.itemID == oSelf.model.itemID) {
									return index;
								}
							});
				if (Object.keys(curItem).length > 0) {
					oSelf.viewMode = "lesson";
					oSelf.oUtility.set("lesson", curItem[0]);
				}
			}
		}
	}
	
	
	var sAppCurVersion = oSelf.model.currentVersion,
		aAppCurVersion = sAppCurVersion.split(".");
	
	if (
		!oSelf.showAlertMessageFlag && 
		oSelf.model.messageData != null && 
		oSelf.model.messageData.length > 0
	) {
		oSelf.filterMsgData  = _.sortBy(
									_.filter(oSelf.model.messageData, 
										function(msg) {
											var sMsgVersion = (typeof msg.AppVersion != "undefined" && msg.AppVersion != null) ? msg.AppVersion : "" ,
												aMsgVersion = sMsgVersion.split(".");
											// AppUpdate will not be shown in web client
											if (oSelf.model.appPlatform != MESSAGE_INSTRUCTOR.c_s_MESSAGE_WEBCLIENT_TYPE) {
												return (
													(
														msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE && 
														(
															// for getting AppUpdate messages
															oSelf.oUtility.appVersionIsGreater(aAppCurVersion, aMsgVersion) || 
															(
																// following code for only where GetMessageList does not return AppVersion key [Occurs only on windows 3.1.3 & 3.1.4 build. IPP - 2658 and IPP - 2560]
																(sAppCurVersion.length == 0) && (sMsgVersion.length == 0)
															)
														)
													) || 
													// for filtering DidYouKnow messages
													msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE
												);
											}
											// for WebClient: only DidYouKnow messages will show
											else {
												return (msg.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE);
											}
										}
									), 
									function(msg){
										return msg.MessageType
									}
								);
	}
	
	if(oSelf.filterMsgData != null){
		// checking if AppUpdate messages are available
		if(
			_.find(oSelf.filterMsgData, function(rec) {
					return rec.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE;
				}
			)
		){
			// rejecting DidYouKnow messages when AppUpdate messages are present
			oSelf.filterMsgData = _.reject(oSelf.filterMsgData, function(rec){ return rec.MessageType == MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE});
		}
		else{
			// After suffling only pick one DidYouKnow message when showing only DidYouKnow alert
			var oSuffledMsg = _.shuffle(oSelf.filterMsgData);
			oSelf.filterMsgData = new Object;
			for (var oVal in oSuffledMsg) {
				if (oSuffledMsg.hasOwnProperty(oVal) && typeof(oVal) !== 'function') {
					oSelf.filterMsgData[oVal] = oSuffledMsg[oVal];
					break;
				}
			}
		}
	}
	
	oSelf.oUtility.set("bNavRenderFlag", 1);
		
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		aButtonData = {};
	
	$.each(oSortedUnitData, function(uIdx, uVal){
		var iLessonLength = 0;
		if(uVal.week != null){
			$.each(uVal.week, function (wIdx, wVal) {
				if(wVal.item != null){
					var itemArr = _.sortBy(
									_.reject(wVal.item, function(num){ 
										return num.itemType == "assignment"; 
									}), function(obj){return parseInt(obj.itemNumber);});
					iLessonLength += itemArr.length;
				}
			});
		}
		
		aButtonData[uIdx] = {};
		aButtonData[uIdx].unitNumber = uVal.unitNumber;
		aButtonData[uIdx].dropDownTxt = "Unit " + uVal.unitNumber;
		aButtonData[uIdx].sLessonClass = (iLessonLength > 0) ? "" : "noLessonClass";
	});
	
	$("#unitDropDown").html(
		_.template($("#dropDownTemplate").html(), {
			"data" : aButtonData,
			"dropDownType": "unit"
		})
	);
	$("#unitDropDown").show();
	
	if (oSelf.viewMode == "week" || oSelf.viewMode == "lesson"){
		
		var iSelectedUnit = oSelf.oUtility.get("unit"),
			sUnitDropdownHtml = $("#unitDropDown").find("div.dp_select_option[data-idx='unit_"+iSelectedUnit+"']").text();
		
		$("#unitDropDown").find(".select_bg").attr('data-idx', 'unit_'+iSelectedUnit);
		$("#unitDropDown").find(".select_bg").html(sUnitDropdownHtml + '<span class="caret"></span>');
		
		var aSortedWeekData = _.sortBy(oSortedUnitData[iSelectedUnit].week, function(obj){return parseInt(obj.weekOrderNumber);}),
			iUnitNumber = oSortedUnitData[iSelectedUnit].unitNumber,
			aButtonData = {};
		
		$.each(aSortedWeekData, function(wIdx, wVal){
			var iLessonLength = 0;
			if(wVal.item != null){
				var aSortedItem = _.sortBy(_.reject(wVal.item, function(num){ return num.itemType == "assignment"; }), function(obj){return parseInt(obj.itemNumber);});
				iLessonLength = aSortedItem.length;
				
				if(iLessonLength > 0){
					var firstItemNumber = _.first(aSortedItem),
						lastItemNumber = _.last(aSortedItem),
						// IPP-3795
						sDropDownTxt = "Lessons " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"])) + " - " +(((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(lastItemNumber["itemNumber"]));
						//((wIdx*5) + parseInt(firstItemNumber["itemNumber"])) + " - " + ((wIdx*5)+parseInt(lastItemNumber["itemNumber"]));
				}
				aButtonData[iSelectedUnit + "_" + wIdx] = {};
				aButtonData[iSelectedUnit + "_" + wIdx].dropDownTxt = sDropDownTxt;
				aButtonData[iSelectedUnit + "_" + wIdx].sLessonClass = (iLessonLength > 0) ? "" : "noLessonClass";
			}
		});
		
		$("#weekDropDown").html(
			_.template($("#dropDownTemplate").html(), {
				"data" : aButtonData,
				"dropDownType": "week"
			})
		);
		$("#weekDropDown").show();
	}
	
	// Code for where JSON contains no Supplemental Lessons
	var oSortedSLUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes");
	if(!Object.keys(oSortedSLUnitData).length){
		$("#btnSupplemenatlLesson").css({"color":"#666", "cursor":"default","line-height":"19px"});
		$("#btnSupplemenatlLesson").attr('disabled','disabled');
	}
	
	// Code for where JSON contains no Grade
	if(!Object.keys(oSelf.model.assessmentData).length){
		$("#btnGrade").css({"opacity":"0.3", "cursor":"default"});
		$("#btnGrade").attr('disabled','disabled');
	}
	
	oSelf.bindDropDowns(oSelf);
	oSelf.viewDecider(oSelf);
};

PlannerYearView.viewDecider = function (oSelf) {
	switch (oSelf.viewMode) {
		case "unit":
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderUnitNavButtons(oSelf);
			}
			oSelf.renderUnitContent(oSelf);
		break;
		case "week":
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderWeekNavButtons(oSelf);
			}
			oSelf.renderWeekContent(oSelf);
		break;
		case "lesson":
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderLessonNavButtons(oSelf);
			}
			oSelf.renderLessonContent(oSelf);
		break;
		
		case "slweek":
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderSLWeekNavButtons(oSelf);
			}
			else{
				oSelf.renderSLWeekContent(oSelf);
			}
		break;
		case "sllesson":
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderSLLessonNavButtons(oSelf);
			}
			oSelf.renderSLLessonContent(oSelf);
		break;
		default:
			if (oSelf.oUtility.get("bNavRenderFlag") == 1) {
				oSelf.renderGradeNavButtons(oSelf);
			}
			oSelf.renderGradeContent(oSelf);
	}
	
	if (objMessageJsonData.canShow === true) {
		oSelf.showAlertMessage ();
	}
};

PlannerYearView.renderUnitNavButtons = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		aButtonData = {};
	
	$.each(oSortedUnitData, function(uIdx, uVal){
		var iLessonLength = 0;
		
		if(uVal.week != null){
			var aSortedWeekData = _.sortBy(uVal.week, function(obj) {
									return parseInt(obj.weekOrderNumber);
								}),
				iFirstLesson = false,
				iLastLesson = false,
				sBottomTxt = "";
			
			$.each(aSortedWeekData, function (wIdx, wVal) {
				if(wVal.item != null){
					var itemArr = _.sortBy(
									_.reject(wVal.item, function(num){ 
										return num.itemType == "assignment"; 
									}), function(obj){
										return parseInt(obj.itemNumber);
									}
								);
						
					if(!iFirstLesson){
						iFirstLesson = (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(_.first(itemArr)["itemNumber"]));
						
					}
					iLastLesson = (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(_.last(itemArr)["itemNumber"]));
						
					iLessonLength += itemArr.length;
				}
			});
			
			if(!iLastLesson){
				sBottomTxt = "Lesson " + iFirstLesson;
			} 
			else{
				sBottomTxt = PLANNER.c_s_LESSONS_TXT + " " + iFirstLesson + " - " + iLastLesson;
			}
		}
		
		aButtonData[uIdx] = {};
		aButtonData[uIdx].unitNumber = uVal.unitNumber;
		aButtonData[uIdx].topText = "Unit " + uVal.unitNumber;
		aButtonData[uIdx].bottomText = (iLessonLength > 0) ? sBottomTxt : "No Lessons";
		aButtonData[uIdx].sActiveClass = (uIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" : "";
		aButtonData[uIdx].sLessonClass = (iLessonLength > 0) ? "" : "noLessonClass";
		aButtonData[uIdx].dropDownTxt = "Unit " + uVal.unitNumber;
		aButtonData[uIdx].elemId = "unit_" + uIdx;
	});
	
	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : aButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	var curUnitIdx = oSelf.oUtility.get(oSelf.viewMode),
		elemId = oSelf.viewMode + "_" + curUnitIdx,
		iSwiperSlideIdx = $("#" + elemId).parent().parent().index(),
		sSwipeIdxObj =  'swipe' + oSelf.viewMode;
		oSelf.oUtility.set(sSwipeIdxObj, iSwiperSlideIdx);
	
	$("#" + elemId).addClass("active");
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
};

PlannerYearView.renderUnitContent = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no");
	$("#innerContentArea").html(
		_.template(
			$("#unitContentTemplate").html(), {
				"unitData" : oSortedUnitData[oSelf.oUtility.get(oSelf.viewMode)]
			}
		)
	);
	
	$("#teachButton").hide();
	$("#weekDropDown").hide();
	$("#unitDropDown").show();
	
	$("#main_container").addClass("without_tech_button");
	oSelf.resize();
};

PlannerYearView.renderWeekNavButtons = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		aButtonData = {};
	
	$.each(oSortedUnitData, function(uIdx, uVal){
		
		var aSortedWeekData = _.sortBy(oSortedUnitData[uIdx].week, function(obj) {
									return parseInt(obj.weekOrderNumber);
								}),
			iUnitNumber = uVal.unitNumber;
		
		$.each(aSortedWeekData, function(wIdx, wVal){
			var iLessonLength = 0;
			if(wVal.item != null){
				var aSortedItem = _.sortBy(
										_.reject(wVal.item, function(num) { 
											return num.itemType == "assignment"; 
										}
									), function(obj) {
										return parseInt(obj.itemNumber);
								});
								
				iLessonLength = aSortedItem.length;
								
				if(iLessonLength > 0){
					
					if(iLessonLength == 1){
						var firstItemNumber = _.first(aSortedItem),
							sLessonDesc = "Lesson " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"])),
							sDropDownTxt = "Lesson " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"]));
					}
					else {
						var firstItemNumber = _.first(aSortedItem),
							lastItemNumber = _.last(aSortedItem),
							sLessonDesc = PLANNER.c_s_LESSONS_TXT + " " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"])) + " - " +(((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(lastItemNumber["itemNumber"])),
							// IPP-3795
							sDropDownTxt = "Lessons " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"])) + " - " +(((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(lastItemNumber["itemNumber"]));
							//((wIdx*5) + parseInt(firstItemNumber["itemNumber"])) + " - " + ((wIdx*5)+parseInt(lastItemNumber["itemNumber"]));
					}
				}
				else{
					var sLessonDesc = "No Lessons";
				}
				
				aButtonData[uIdx + "_" + wIdx] = {};
				aButtonData[uIdx + "_" + wIdx].unitNumber = iUnitNumber;
				aButtonData[uIdx + "_" + wIdx].unitIndex = uIdx;
				aButtonData[uIdx + "_" + wIdx].topText = PLANNER.c_s_WEEK_TXT + " " + wVal.weekNumber;
				aButtonData[uIdx + "_" + wIdx].bottomText = (iLessonLength > 0) ?  sLessonDesc : "";
				aButtonData[uIdx + "_" + wIdx].sActiveClass = (wIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" : "";
				aButtonData[uIdx + "_" + wIdx].sLessonClass = (iLessonLength > 0) ? "" : "noLessonClass";
				aButtonData[uIdx + "_" + wIdx].dropDownTxt = sLessonDesc;
				aButtonData[uIdx + "_" + wIdx].elemId = "week_" + uIdx + "_" + wIdx;
			}
			
		});
	});
	
	//console.log(JSON.stringify(aButtonData));
	
	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : aButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	var curUnitIdx = oSelf.oUtility.get("unit"),
		curWeekIdx = oSelf.oUtility.get(oSelf.viewMode),
		elemId = oSelf.viewMode + "_" + curUnitIdx + "_" + curWeekIdx,
		iSwiperSlideIdx = $("#" + elemId).parent().parent().index(),
		sSwipeIdxObj =  'swipe' + oSelf.viewMode;
		oSelf.oUtility.set(sSwipeIdxObj, iSwiperSlideIdx);	
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
};

PlannerYearView.renderWeekContent = function (oSelf) {
	
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		iUnitNumber = oSortedUnitData[oSelf.oUtility.get("unit")].unitNumber,
		aSortedWeekData = _.sortBy(oSortedUnitData[oSelf.oUtility.get("unit")].week, function(obj) {
									return parseInt(obj.weekOrderNumber);
						}),
		iWeekNumber = aSortedWeekData[oSelf.oUtility.get(oSelf.viewMode)].weekNumber,
		aSortedItemData = _.sortBy(
							_.reject(aSortedWeekData[oSelf.oUtility.get(oSelf.viewMode)].item, function(num){ 
								return num.itemType == "assignment"; 
							}), 
							function(obj) {
									return parseInt(obj.itemNumber);
						});

	$("#innerContentArea").html(
		_.template(
			$("#weekContentTemplate").html(), {
				"weekData" : aSortedItemData,
				"weekNumber":iWeekNumber,
				"unitNumber": iUnitNumber
			}
		)
	);
	
	var iSelectedUnit = oSelf.oUtility.get("unit"),
		sUnitDropdownHtml = $("#unitDropDown").find("div.dp_select_option[data-idx='unit_"+iSelectedUnit+"']").text();
	
	$("#unitDropDown").find(".select_bg").attr('data-idx', 'unit_'+iSelectedUnit);
	$("#unitDropDown").find(".select_bg").html(sUnitDropdownHtml + '<span class="caret"></span>');
	
	var aSortedWeekData = _.sortBy(oSortedUnitData[iSelectedUnit].week, function(obj){return parseInt(obj.weekOrderNumber);}),
		iUnitNumber = oSortedUnitData[iSelectedUnit].unitNumber,
		aButtonData = {};
	
	$.each(aSortedWeekData, function(wIdx, wVal){
		var iLessonLength = 0;
		if(wVal.item != null){
			var aSortedItem = _.sortBy(_.reject(wVal.item, function(num){ return num.itemType == "assignment"; }), function(obj){return parseInt(obj.itemNumber);});
			iLessonLength = aSortedItem.length;
			
			if(iLessonLength > 0){
				var firstItemNumber = _.first(aSortedItem),
					lastItemNumber = _.last(aSortedItem),
					// IPP-3795
					sDropDownTxt = "Lessons " + (((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(firstItemNumber["itemNumber"])) + " - " +(((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(lastItemNumber["itemNumber"]));
					
					//((wIdx*5) + parseInt(firstItemNumber["itemNumber"])) + " - " + ((wIdx*5)+parseInt(lastItemNumber["itemNumber"]));
			}
			
			aButtonData[iSelectedUnit + "_" + wIdx] = {};
			aButtonData[iSelectedUnit + "_" + wIdx].dropDownTxt = sDropDownTxt;
			aButtonData[iSelectedUnit + "_" + wIdx].sLessonClass = (iLessonLength > 0) ? "" : "noLessonClass";
		}
	});
	
	$("#weekDropDown").html(
		_.template($("#dropDownTemplate").html(), {
			"data" : aButtonData,
			"dropDownType": "week"
		})
	);
	
	oSelf.bindDropDowns(oSelf);
	$("#teachButton").hide();
	$("#weekDropDown").show();
	$("#main_container").addClass("without_tech_button");
	oSelf.resize();
}

PlannerYearView.renderLessonNavButtons = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		aSortedWeekData = _.sortBy(oSortedUnitData[oSelf.oUtility.get("unit")].week, function(obj){return parseInt(obj.weekOrderNumber);}),
		iUnitIdx = oSelf.oUtility.get("unit"),
		iUnitNumber = oSortedUnitData[[oSelf.oUtility.get("unit")]].unitNumber,
		aButtonData = {};
	
	$.each(aSortedWeekData, function(wIdx, wVal){
		var iLessonLength = 0;
		if(wVal.item != null){
			var aSortedItem = _.sortBy(_.reject(wVal.item, function(num){ return num.itemType == "assignment"; }), function(obj){return parseInt(obj.itemNumber);});
			iLessonLength = aSortedItem.length;
			
			if(iLessonLength > 0){
				$.each(aSortedItem, function (iIdx,iVal) {
					if(iVal.itemType == "lesson"){								
						aButtonData[wIdx + "_" + iIdx] = {};
						aButtonData[wIdx + "_" + iIdx].unitNumber = iUnitNumber;
						aButtonData[wIdx + "_" + iIdx].weekNumber = wVal.weekNumber;
						aButtonData[wIdx + "_" + iIdx].topText = iUnitNumber + "." +(((parseInt(wVal.weekNumber) - 1) * 5) +parseInt(iVal.itemNumber));
						aButtonData[wIdx + "_" + iIdx].bottomText = iVal.itemDisplayName;
						aButtonData[wIdx + "_" + iIdx].sActiveClass = (iIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" : "";
						aButtonData[wIdx + "_" + iIdx].sLessonClass = "";//(iLessonLength > 0) ? "" : "noLessonClass";
						aButtonData[wIdx + "_" + iIdx].elemId = "lesson_" + iUnitIdx + "_" + wIdx + "_" + iIdx;
					}
				});
			}
		}
	});
	
	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : aButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	var curUnitIdx = oSelf.oUtility.get("unit"),
		curWeekIdx = oSelf.oUtility.get("week"),
		curLessonIdx = oSelf.oUtility.get(oSelf.viewMode),
		elemId = oSelf.viewMode + "_" + curUnitIdx + "_" + curWeekIdx + "_" + curLessonIdx,
		iSwiperSlideIdx = $("#" + elemId).parent().parent().index(),
		sSwipeIdxObj =  'swipe' + oSelf.viewMode;
		oSelf.oUtility.set(sSwipeIdxObj, iSwiperSlideIdx);
	
	$("#" + elemId).addClass("active");
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
};

PlannerYearView.renderLessonContent = function (oSelf) {
	
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "no"),
		aSortedWeekData = _.sortBy(oSortedUnitData[oSelf.oUtility.get("unit")].week, function(obj){return parseInt(obj.weekOrderNumber);}),
		aSortedItemData = _.sortBy(
							_.reject(aSortedWeekData[oSelf.oUtility.get("week")].item, function(num){
								return num.itemType == "assignment"; 
							}), function(obj){return parseInt(obj.itemNumber);}
						),
		lessonData = aSortedItemData[oSelf.oUtility.get(oSelf.viewMode)].metadata;

	$("#innerContentArea").html(
		_.template(
			$("#lessonContentTemplate").html(), {
				"lessonData" : lessonData
			}
		)
	);
	
	var iSelectedUnit = oSelf.oUtility.get("unit"),
		iSelectedWeek = oSelf.oUtility.get("week"),
		sWeekDropdownHtml = $("#weekDropDown").find("div.dp_select_option[data-idx='week_"+iSelectedUnit+"_"+iSelectedWeek+"']").text();
	$("#weekDropDown").find(".select_bg").attr('data-idx', 'week_'+iSelectedUnit+'_'+iSelectedWeek);
	$("#weekDropDown").find(".select_bg").html(sWeekDropdownHtml + '<span class="caret"></span>');

	$("#teachButton").show();
	$("#btnViewGrade").hide();
	$("#main_container").removeClass("without_tech_button");
	oSelf.bindLessonButtons(oSelf);
	oSelf.resize();
};

PlannerYearView.renderGradeNavButtons = function (oSelf) {
	var aSortedGradeData = _.sortBy(oSelf.model.assessmentData, function(obj){return parseInt(obj.itemOrderNumber);}),
		aButtonData = {};
	
	$.each(aSortedGradeData, function(gIdx, gVal){
		aButtonData[gIdx] = {};
		aButtonData[gIdx].unitNumber = "";
		aButtonData[gIdx].topText = gVal.itemDisplayName;
		aButtonData[gIdx].bottomText = "";
		aButtonData[gIdx].sActiveClass = (gIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" : "";
		aButtonData[gIdx].sLessonClass = "";
		aButtonData[gIdx].elemId = "grade_" + gIdx;
	});
	
	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : aButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
};

PlannerYearView.renderGradeContent = function (oSelf) {
	
	var aSortedGradeData = _.sortBy(oSelf.model.assessmentData, function(obj){
								return parseInt(obj.itemOrderNumber);
						});

	$("#innerContentArea").html(
		_.template(
			$("#gradeContentTemplate").html(), {
				"gradeData" : aSortedGradeData[oSelf.oUtility.get(oSelf.viewMode)]
			}
		)
	);
	
	$("#btnViewGrade").show();
	$("#teachButton").show();
	$("#unitDropDown").hide();
	$("#weekDropDown").hide();
	$("#main_container").removeClass("without_tech_button");
	oSelf.bindLessonButtons(oSelf);
	oSelf.resize();
};

PlannerYearView.renderSLWeekNavButtons = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
		aTempSLWeekType = [],
		oButtonData = {},
		oDropdownData = {};
	
	$.each(oSortedUnitData, function(uIdx, uVal){
		
		var aSortedWeekData = _.sortBy(
								_.reject(oSortedUnitData[uIdx].week, 
									function (obj) {
										return obj.supplementaryLessonType == 'grade'
									}
								), 
								function(obj) {
									return parseInt(obj.weekOrderNumber);
								}
							),
			iUnitNumber = uVal.unitNumber;
		
		$.each(aSortedWeekData, function(wIdx, wVal){
			if (
				$.inArray( wVal.supplementaryLessonType, aTempSLWeekType ) == -1
			) {
				aTempSLWeekType.push(wVal.supplementaryLessonType);
				var iLessonLength = 0;
				if(wVal.item != null){
					var aSortedItem = _.sortBy(
										_.filter(wVal.item, function(num) { 
											return num.itemSubType == "sl"; 
										}
									), function(obj) {
										return parseInt(obj.itemNumber);
								});
								
					iLessonLength = aSortedItem.length;
				}
				
				oButtonData[uIdx + "_" + wIdx] = {};
				oButtonData[uIdx + "_" + wIdx].unitNumber = iUnitNumber;
				oButtonData[uIdx + "_" + wIdx].unitIndex = uIdx;
				oButtonData[uIdx + "_" + wIdx].topText = PLANNER.c_a_SL_TYPE_TXT[wVal.supplementaryLessonType];
				oButtonData[uIdx + "_" + wIdx].bottomText = "";
				oButtonData[uIdx + "_" + wIdx].sActiveClass = /* (wIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" :  */"";
				oButtonData[uIdx + "_" + wIdx].sLessonClass =  "";
				oButtonData[uIdx + "_" + wIdx].elemId = "slweek_" + wVal.supplementaryLessonType;
				
				oDropdownData[wVal.supplementaryLessonType] = {};
				oDropdownData[wVal.supplementaryLessonType].dropDownTxt = PLANNER.c_a_SL_TYPE_TXT[wVal.supplementaryLessonType];
			}
		});
	});
	
	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : oButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	$("#weekDropDown").html(
		_.template($("#dropDownTemplate").html(), {
			"data" : oDropdownData,
			"dropDownType": "slweek"
		})
	);
	
	$("#unitDropDown").hide();
	$("#weekDropDown").addClass("SLWeekDropdown");
	oSelf.oUtility.set(oSelf.viewMode, aTempSLWeekType[0]);
	
	var curWeekIdx = oSelf.oUtility.get(oSelf.viewMode),
		elemId = oSelf.viewMode + "_" + curWeekIdx,
		iSwiperSlideIdx = $("#" + elemId).parent().parent().index(),
		sSwipeIdxObj =  'swipe' + oSelf.viewMode;
		
	$("#" + elemId).addClass("active");
	
	oSelf.oUtility.set(sSwipeIdxObj, iSwiperSlideIdx);
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
	oSelf.bindDropDowns(oSelf);
	oSelf.renderSLWeekContent(oSelf);
};

PlannerYearView.renderSLWeekContent = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
		sSLWeekType = oSelf.oUtility.get(oSelf.viewMode),
		oFilteredWeekData = [];
	
	$.each(oSortedUnitData, function (uIdx, uVal) {
		var oSortedWeekData = _.sortBy(uVal.week,  function(obj){return parseInt(obj.weekOrderNumber)});
		$.each(oSortedWeekData, function (wIdx, wVal) {
			if (
				wVal.supplementaryLessonType == sSLWeekType
			){
				oFilteredWeekData.push(wVal);
			}
		});
	});
	
	$("#innerContentArea").html(
		_.template(
			$("#sLessonWeekContentTemplate").html(), {
				"weekData" : oFilteredWeekData
			}
		)
	);
	
	$("#innerContentArea").find(".unitView").last().css({"border-bottom":"none"});
	
	$("#teachButton").hide();
	$("#weekDropDown").show();
	$("#main_container").addClass("without_tech_button");
	oSelf.resize();
};

PlannerYearView.renderSLLessonNavButtons = function (oSelf) {
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
		aSLIdx = oSelf.oUtility.get(oSelf.viewMode).split("_"),
		sSLWeekType = oSelf.oUtility.get("slweek"),
		aButtonData = {},
		cnt = 0;
	
	$.each(oSortedUnitData, function (uIdx, uVal) {
		var oSortedWeekData = _.sortBy(uVal.week,  function(obj){return parseInt(obj.weekOrderNumber)});
		$.each(oSortedWeekData, function (wIdx, wVal) {
			if (
				wVal.supplementaryLessonType == aSLIdx[1]
			){
				$.each(wVal.item, function(iIdx, iVal){	
					if (iVal.itemSubType == "sl") {
						cnt++;
						aButtonData[wIdx + "_" + iIdx] = {};
						aButtonData[wIdx + "_" + iIdx].orderNumber = cnt;
						aButtonData[wIdx + "_" + iIdx].weekNumber = wVal.weekNumber;
						aButtonData[wIdx + "_" + iIdx].topText = iVal.itemDisplayName;
						aButtonData[wIdx + "_" + iIdx].bottomText = "";
						aButtonData[wIdx + "_" + iIdx].sActiveClass = /* (iIdx == oSelf.oUtility.get(oSelf.viewMode)) ? "active" : */ "";
						aButtonData[wIdx + "_" + iIdx].sLessonClass = "";//(iLessonLength > 0) ? "" : "noLessonClass";
						aButtonData[wIdx + "_" + iIdx].elemId = "sllesson_"+ aSLIdx[1] + "_" + wIdx + "_" + iIdx;
					}
				});
			}
		});
	});

	$("#navButtonArea").html(
		_.template($("#navButtonTemplate").html(), {
			"data" : aButtonData,
			"viewMode": oSelf.viewMode
		})
	);
	
	var elemId = $(".swiper-slide").first().find("a").first().attr("id"),
		iSwiperSlideIdx = $("#" + elemId).parent().parent().index(),
		sSwipeIdxObj =  'swipe' + oSelf.viewMode;
		oSelf.oUtility.set(sSwipeIdxObj, iSwiperSlideIdx);
	
	oSelf.oUtility.set(oSelf.viewMode, elemId);
	$("#" + elemId).addClass("active");
	
	oSelf.bindEvents(oSelf);
	oSelf.bindNavButtons(oSelf);
};

PlannerYearView.renderSLLessonContent = function (oSelf) {
	
	var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
		aSLIdx = oSelf.oUtility.get(oSelf.viewMode).split("_"),
		oSortedWeekData = {},
		lessonData = "",
		overviewTitle = "";
	
	$.each(oSortedUnitData, function (uIdx, uVal) {
		var oSortedWeekData = _.sortBy(uVal.week,  function(obj){return parseInt(obj.weekOrderNumber)});
		$.each(oSortedWeekData, function (wIdx, wVal) {
			if (
				wVal.supplementaryLessonType == aSLIdx[1]
			){	
				$.each(wVal.item, function(iIdx, iVal) {
					if (
						wIdx == parseInt(aSLIdx[2]) && 
						iIdx == parseInt(aSLIdx[3]) && 
						iVal.itemSubType == "sl"
					) {
						lessonData = iVal.metadata;
						overviewTitle = iVal.itemDisplayName;
					}
				});
			}
		});
	});
	
	$("#innerContentArea").html(
		_.template(
			$("#sLessonLessonContentTemplate").html(), {
				"lessonData" : lessonData,
				"sLessonType": aSLIdx[1],
				"overviewTitle": overviewTitle
			}
		)
	);
	
	var iSelectedWeek = oSelf.oUtility.get("slweek"),
		sWeekDropdownHtml = $("#weekDropDown").find("div.dp_select_option[data-idx='slweek_"+iSelectedWeek+"']").text();
	$("#weekDropDown").find(".select_bg").attr('data-idx', 'slweek_'+iSelectedWeek);
	$("#weekDropDown").find(".select_bg").html(sWeekDropdownHtml + '<span class="caret"></span>');

	
	if (aSLIdx[1] == "routinecards") {
		$("#main_container").addClass("without_tech_button");
		$("#teachButton").hide();
	}
	else{
		$("#main_container").removeClass("without_tech_button");
		$("#teachButton").show();
	}
	$("#btnViewGrade").hide();
	oSelf.bindLessonButtons(oSelf);
	oSelf.resize();
};

PlannerYearView.bindNavButtons = function (oSelf) {
	$(".navButton").off('click').on('click', function(event){
            
		var dataValue = $(this).attr('id'),
			tempArr = dataValue.split("_");
		
		if($(this).hasClass("active")){
			if($(this).hasClass("noLessonClass")){
				return false;
				//oSelf.alertPopUp("<p>"+PLANNER.c_s_LESSON_NOT_FOUND_TXT+"</p>");
			}else{
				oSelf.oUtility.set("bNavRenderFlag", 1);
				switch(tempArr[0]){
					case "unit":
						oSelf.viewMode = "week";
						oSelf.oUtility.set("week", 0);
					break;
					case "week":
						oSelf.viewMode = "lesson";
						oSelf.oUtility.set("lesson", 0);
					break;
					case "slweek":
						oSelf.viewMode = "sllesson";
						oSelf.oUtility.set("sllesson", "sllesson_" + tempArr[1] + "_0_0");
					break;
					default:
						return false;
				}
				oSelf.viewDecider(oSelf);
			}
		}else{
			$(".navButton").removeClass("active");
			$(this).addClass("active");
			
			switch(tempArr[0]){
				case "unit":
					oSelf.oUtility.set(oSelf.viewMode, tempArr[1])
				break;
				case "week":
					oSelf.oUtility.set(oSelf.viewMode, tempArr[2])
				break;
				case "lesson":
					oSelf.oUtility.set(oSelf.viewMode, tempArr[3])
				break;
				case "sllesson":
					oSelf.oUtility.set(oSelf.viewMode, dataValue)
				break;
				default:
					oSelf.oUtility.set(oSelf.viewMode, tempArr[1])
			}
			
			oSelf.oUtility.set("bNavRenderFlag", 0);
			oSelf.viewDecider(oSelf);
			oSelf.setIndexPositionWithButtonActive(oSelf);
		}
	});
};

PlannerYearView.bindDropDowns = function (oSelf) {
	$(".select").off('click').on('click', function (event) {    
		$(".select").find(".dp_select_bg_option").slideUp();
		if(!$(this).find(".dp_select_bg_option").is(':visible')) {
			$(this).find(".dp_select_bg_option").slideDown();
		}
		event.stopPropagation();
	});
	
	$(".dp_select_option").off('click').on('click', function () {
		
		if($(this).hasClass("noLessonClass")){
			$(this).parents('.dp_select_bg_option').slideUp();
			return false;
		}
		
		var sSelectedVal = $(this).data('idx'),
			aSelectedVal = sSelectedVal.split("_");
		
		$(this).parent().siblings(".select_bg").attr('data-idx', sSelectedVal);
		$(this).parent().siblings(".select_bg").html($(this).html() + '<span class="caret"></span>');
        $(this).parents('.dp_select_bg_option').slideUp();
		
		
		if(aSelectedVal[0] == "unit") {
			if (aSelectedVal[1] == "all") {
				oSelf.viewMode = "unit";
				oSelf.oUtility.set(oSelf.viewMode, 0);
			}
			else{
				oSelf.viewMode = "week";
				oSelf.oUtility.set("unit", parseInt(aSelectedVal[1]));
				oSelf.oUtility.set("week", 0);
			}
		}
		
		else if(aSelectedVal[0] == "slweek") {
			if (aSelectedVal[1] == "all") {
				oSelf.viewMode = "slweek";
				oSelf.oUtility.set(oSelf.viewMode, 0);
			}
			else{
				oSelf.viewMode = "sllesson";
				oSelf.oUtility.set("slweek", aSelectedVal[1]);
				oSelf.oUtility.set("sllesson", "sllesson_"+ aSelectedVal[1] +"_0_0");
			}
		}
		else {
			if (aSelectedVal[1] == "all") {
				oSelf.viewMode = "week";
				oSelf.oUtility.set(oSelf.viewMode, 0);
			}
			else{
				oSelf.viewMode = "lesson";
				oSelf.oUtility.set("week", parseInt(aSelectedVal[2]));
				oSelf.oUtility.set(oSelf.viewMode, 0);
			}
		}
		
		oSelf.oUtility.set("bNavRenderFlag", 1);
		oSelf.viewDecider(oSelf);
		
		return false;
    });
};

PlannerYearView.bindEvents = function (oSelf) {
	
	// Start coding for button will not be treated as table cell where there is 1 button
	$.each($(".swiper-slide"), function(){
		var iRecLen = $(this).find("a").length;
		if(iRecLen == 1){
			$(this).css({"display":"block"});
			$(this).find(".lesson_button_row").css({"display":"block","margin":"0 auto","max-width":"500px", "text-align":"center", "padding-top": "10px"});
			$(this).find("a").css({"display":"inline-block", "width":"136px"});
		}
		if(iRecLen > 1 && iRecLen < 4){
			$(this).find(".lesson_button_row").css({"border-spacing":"inherit", "display":"block","margin":"0 auto","max-width":"600px", "text-align":"center"});
			$(this).find("a").css({"display":"inline-block", "width":"136px"});
		}
	});
	// End coding for button will not be treated as table cell where there is 1 button
	
	var sSwipeIdxObj =  'swipe' + oSelf.viewMode,
		iSwipeIndex = parseInt(oSelf.oUtility.get(sSwipeIdxObj)),
		mySwiper = $('.swiper-container').swiper({
			height: 'auto', 
			noSwiping: true,
			/* onInit: function (swiper) {
				oSelf.setIndexPositionWithButtonActive(oSelf);
				oSelf.pagingButtonShowHide(swiper.activeIndex, swiper.slides.length);
			}, */
			queueEndCallbacks:true,
			onSlideChangeEnd: function(swiper) {
				if (
					parseInt(swiper.previousIndex) > parseInt(swiper.activeIndex)
				) {
					var fetchIdx = parseInt(oSelf.oUtility.get(sSwipeIdxObj)) - 1;
				}
				else {
					var fetchIdx = parseInt(oSelf.oUtility.get(sSwipeIdxObj)) + 1;
				}
				
				oSelf.oUtility.set(sSwipeIdxObj, fetchIdx);
				oSelf.oUtility.set("bNavRenderFlag", 0);
				
				if (!oSelf.bOnLoad){
					$(".swiper-slide").find("a").removeClass("active");
					$(".swiper-slide-active").find("a").first().addClass("active");
				} else {
					oSelf.bOnLoad = false;
				}
				
				oSelf.pagingButtonShowHide(swiper.activeIndex, swiper.slides.length);
				
				var sSelectedVal = $(".swiper-slide-active").find("a.active").attr("id"),
					aSelectedVal = (sSelectedVal) ? sSelectedVal.split("_") : []; // fix for 'split of undefined' console error
				
				if(aSelectedVal.length > 0){
					switch(aSelectedVal[0]){
						case "unit":
							oSelf.oUtility.set("unit", aSelectedVal[1]);
						break;
						case "week":
							oSelf.oUtility.set("unit", aSelectedVal[1]);
							oSelf.oUtility.set("week", aSelectedVal[2]);
						break;
						case "lesson":
							oSelf.oUtility.set("unit", aSelectedVal[1]);
							oSelf.oUtility.set("week", aSelectedVal[2]);
							oSelf.oUtility.set("lesson", aSelectedVal[3]);
						break;
						case "sllesson":
							oSelf.oUtility.set(oSelf.viewMode, sSelectedVal);
						break;
						default:
							oSelf.oUtility.set("grade", aSelectedVal[1]);
					}
					
					oSelf.viewMode = aSelectedVal[0];
				}
				
				oSelf.viewDecider(oSelf);
				oSelf.setIndexPositionWithButtonActive(oSelf);
			}
		
		});
	
	mySwiper.swipeTo(iSwipeIndex, 200);
	$(".swiper-wrapper").height("auto");
	$(".swiper-wrapper").children().height("auto");
	oSelf.setIndexPositionWithButtonActive(oSelf);
	oSelf.pagingButtonShowHide(mySwiper.activeIndex, mySwiper.slides.length);
	
	$("#prevPagingBtn").off('click').on('click', function () {
		mySwiper.swipePrev();
	});
	
	$("#nextPagingBtn").off('click').on('click', function () {
		mySwiper.swipeNext();
	});
	
	$("#btnUnit").off('click').on('click', function(){
        if($(this).hasClass("active")){
			return false;
		}else{
			$(this).addClass("active");
			$("#main_container").removeClass("grade_container");
			$('#btnSupplemenatlLesson').removeClass("active");
			$('#btnGrade').removeClass("gradeActive active");
			oSelf.viewMode = "lesson";
			oSelf.oUtility.set("unit", 0);
			oSelf.oUtility.set("week", 0);
			oSelf.oUtility.set("lesson", 0);
			oSelf.oUtility.set("bNavRenderFlag", 1);
			
			$("#unitDropDown").find(".select_bg").attr('data-idx', 'unit_all');
			$("#unitDropDown").find(".select_bg").html("All Units" + '<span class="caret"></span>');
			$("#weekDropDown").removeClass("SLWeekDropdown");
			oSelf.init(oSelf.model);
		}
    });

	$("#btnSupplemenatlLesson").off('click').on('click', function () {
		if($(this).hasClass("active")){
			return false;
		}else{
		
			/* var oSortedUnitData = oSelf.oUtility.getSortedUnitData(oSelf.model.plannerData, "yes"),
				oSortedUnitDataLen = Object.keys(oSortedUnitData).length; */

			// only one Supplemental Lesson type Unit allowed for a grade
			/* if (oSortedUnitDataLen != 1) {
				return false;
			} */
			
			$(this).addClass("active");
			
			$("#main_container").removeClass("grade_container");
			$('#btnUnit').removeClass("active");
			$('#btnGrade').removeClass("gradeActive active");
			
			oSelf.viewMode = "slweek";
			oSelf.oUtility.set("bNavRenderFlag", 1);
			$("#unitDropDown").hide();
			oSelf.viewDecider(oSelf);
		}
	});
	
    $("#btnGrade").off('click').on('click', function() {
		if($(this).hasClass("gradeActive")){
			return false;
		}else{ 
			$(this).addClass("gradeActive active");
			$("#main_container").addClass("grade_container");
			$('#btnUnit').removeClass("active");
			$('#btnSupplemenatlLesson').removeClass("active");
			oSelf.oUtility.set("grade", 0);
			oSelf.oUtility.set("bNavRenderFlag", 1);
			oSelf.viewMode = "grade";
			oSelf.viewDecider(oSelf);
		}
    });

 };

PlannerYearView.bindLessonButtons = function (oSelf) {
	$("#btnTech, #btnPreview").off("click").on("click", function(){
		var iPreviewFlag = $(this).data("preview-flag"),
			oData = oSelf.oUtility.getValues4LaunchGradeItem(oSelf);
		// preview flag set to 0 or 1
		LaunchGradeItem(oData.unitNumber, oData.weekNumber, oData.itemId, "lesson", iPreviewFlag, oData.rataBookId, oData.teachFrom);  
	});
	
	$("#btnEmail").off("click").on("click", function(){
		//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
	});
	$("#btnPrint").off("click").on("click", function(){
		//PlannerView.alertPopUp("<p>"+GENERAL.c_s_UNDER_CONSTRUCTION_TXT+"</p>");
	});
	
	$("#btnViewGrade").off('click').on('click', function (oEvent) {
	
		var aSortedGradeData 	= _.sortBy(oSelf.model.assessmentData, function(obj){return parseInt(obj.itemOrderNumber);}),
			oGradeData 			= aSortedGradeData[oSelf.oUtility.get(oSelf.viewMode)],
			itemId      		= oGradeData.gradeAssignmentID,
			itemName    		= oGradeData.itemDisplayName,
			itemType    		= 'assessment',
			itemSubType 		= 'grade',
			itemAttemptSummary  = '',
			studentId   		= '',
			sSubTypeMode        = '';
		
		
		var sURL = 'assignment.html?'
			+ POPUP_VIEW.c_s_QUERY_PARAM_MODE + '=' + POPUP_VIEW.c_s_MODE_INSTRUCTOR + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_ID + '=' + itemId + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_HEADER_TITLE + '=' + escape(itemName) + '&' 
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_TYPE + '=' + itemType + '&'
			+ POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_SUB_TYPE + '=' + itemSubType + '&' 
			+ POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_PLAY;
			
		//sURL = 'assignment.html'; // Ad-hoc step
		
		if (oPlatform.isDevice()) {
			ShowWebView(sURL);
		}
		else {
			$('#viewAssignmentPopupArea').find('iframe').attr('src', sURL).load(function() {
				$('#viewAssignmentPopupArea').show();
				// back to Performance
				$(this).contents().find("#assignmentPrev").off('click').on("click tap", function(){ 
					$('#viewAssignmentPopupArea').find('iframe').attr('src','');
					setTimeout( function() {
						$('#viewAssignmentPopupArea').hide();
						$("#viewAssignmentPopupArea").css({'width': '', 'height': '', 'overflow' : ''});
					}, 100);
				});
			});
		}
	});
};
 
PlannerYearView.pagingButtonShowHide = function (currentIdx, sliderLength) {
	var oSelf = this,
		counter = parseInt(currentIdx)+1;
	
	if ( sliderLength == 1){
		$('#prevPagingBtn').hide();
		$('#nextPagingBtn').hide();
	}
	else{
		if(counter == 1){
			$('#prevPagingBtn').hide();
			$('#nextPagingBtn').show();
		}
		else if(counter >= sliderLength){ 
			$('#nextPagingBtn').hide();
			$('#prevPagingBtn').show();
		}
		else{ 
			$('#prevPagingBtn').show();
			$('#nextPagingBtn').show();
		}
	}
};

PlannerYearView.setIndexPositionWithButtonActive = function (oSelf){
	var btnObj = $(".swiper-slide-active").find("a.active");
	var btnPos = 0;
	try { btnPos = btnObj.position().left; } catch(e){} // fix for 'left of undefined' console issue. 
	var pos = btnPos + 10 + parseInt(btnObj.css("margin-right")) + (btnObj.width()  + parseInt(btnObj.css("padding-left")) + parseInt(btnObj.css("padding-right")))/2;
	$(".dash_lesson_container .page_arrow").animate({"left" : pos + "px"}, 300);
};

PlannerYearView.resize = function () {
	var oSelf = this;
	
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
		$('html').addClass('ipad ios7');
		var window_height = $("body").height();
	}
	else{
		var window_height = $(window).height();
	}
	
	$('.main-bg-images').height(window_height);
	$('.swiper-container').css({"height":"auto"});
	$('.swiper-wrapper').css({"height":"auto"});
	$('.swiper-slide').css({"height":"auto"});
	
	var header = $("header").outerHeight(),
		footer = $("footer").outerHeight(),
		section_padding = parseInt($("#main_container").css("padding-top")) + parseInt($("#main_container").css("padding-bottom")),
		navButtonArea_height = $("#navButtonArea").outerHeight() + parseInt($("#navButtonArea").css("margin-bottom")),
		teachButton_height = ($("#teachButton:visible").outerHeight() == null) ? 0 : $("#teachButton:visible").outerHeight(),
		dash_lesson_container_padding = parseInt($(".dash_lesson_container").css("padding-top")) + parseInt($(".dash_lesson_container").css("padding-bottom")),
		innerContentArea_padding = parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom")),
		actual_height = window_height - (header + footer + section_padding + teachButton_height + navButtonArea_height + dash_lesson_container_padding + innerContentArea_padding + 5);
	
	if(oSelf.viewMode == "week" || oSelf.viewMode == "slweek" ||  oSelf.viewMode == "grade"){
		$("#innerContentArea").height(actual_height);
	}
	else{
		$("#innerContentArea").css({"height":"auto"});
		if (
			oSelf.viewMode == "sllesson"
		){
			var aSLIdx = oSelf.oUtility.get(oSelf.viewMode).split("_");
			if (aSLIdx[1] == "routinecards") {
				$("#innerContentArea").height(actual_height);
			}
		}
		
		var actual_right_inner_height = actual_height - (parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom")))  + parseInt($("#weekviewLeftContent").css("margin-bottom"));
		
		$("#weekviewMiddleContent").height(actual_right_inner_height);
		
		var actual_left_inner_height = actual_height - (parseInt($("#innerContentArea").css("padding-top")) + parseInt($("#innerContentArea").css("padding-bottom")) + $("#weekviewLeftContent").children("h3").outerHeight()+ parseInt($("#weekviewLeftContent").children("h3").css("margin-bottom"))+$("#weekviewLeftButtonContent").outerHeight()) - parseInt($("#weekviewLeftContent").css("margin-bottom")) - 5;		
		
		$("#weekviewLeftInnerContent").height(actual_left_inner_height);
	}

	$(".ui-dialog:visible").position({
		my: "center",
		at: "center",
		of: window	
	});
};

PlannerYearView.showAlertMessage = function () {
	var oSelf = this,
		filterMsgData = null;

	if(oSelf.filterMsgData != null){
		$.each(oSelf.filterMsgData, function (idx, val) {
			if(oSelf.showAlertMessageCount == idx){
				filterMsgData = val;
			}
		});
		
		if (filterMsgData != null) {
			$("#messagePopUp").html(
				_.template(
					$("#messagePopUpTemplate").html(), {
						'msgdata':filterMsgData
					}
				)
			);
			$("#messagePopUp").show();
			$("#innerContentArea").css({"overflow":"hidden"});
			oSelf.showAlertMessageFlag = true;
			oSelf.showAlertMessageCount++;
			oSelf.bindEvent4PopUpCloseBtn();
		}
	}
};

PlannerYearView.bindEvent4PopUpCloseBtn = function () {
	var oSelf = this;
	$("#messagePopUpCloseBtn").off("click").on("click", function () {
		$("#messagePopUp").empty();
		$("#messagePopUp").hide();
		$("#innerContentArea").css({"overflow":"auto"});
		oSelf.showAlertMessage();
	});
};

