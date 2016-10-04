/**
 * Parent AssignmentInstructorView
 * @returns void
 */
function AssignmentInstructorView () {};

AssignmentInstructorView.model = null;
AssignmentInstructorView.isPageLoaded = 0;
AssignmentInstructorView.ActiveTab = 'assignment';
AssignmentInstructorView.lastGradeBookContent = null;
AssignmentInstructorView.lastStudentContent   = null;
AssignmentInstructorView.refreshStatus   = true;
AssignmentInstructorView.refreshInterval = 0;
AssignmentInstructorView.updateRefreshedContent = true;
AssignmentInstructorView.oJsonKeys = null;

AssignmentInstructorView.init = function (model) {        
    AssignmentInstructorView.model = model;
    AssignmentInstructorView.render();
    AssignmentInstructorView.bindEvent();    
};

AssignmentInstructorView.render = function () {
    
};

AssignmentInstructorView.bindEvent = function () {
    
    $(".tabbing button").off('click').on('click', function () {
	
       if(!$(this).hasClass('active')) {
           
           if($(".qs_ans").hasClass('sprite')) {
               return false;
           }
		   // reset few data
		   AssignmentInstructorView.resetDataAfterView();
		   AssignmentContainerView.resetHeaderBox();
           
           $(".tabbing button").removeClass('active');
           $(this).addClass('active');
           AssignmentInstructorView.ActiveTab = $(this).attr('data-text');
           objAssignmentListJsonData	=	null;
           objGradeBookV2JsonData		=	0;
           
            var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
            $("#loaderContainer").html(loaderImg).addClass('loaderContainer');
            $("#loaderContainer").show();
            $(".loaderContainerOverlay").show();
           // var unitNum =   objInstructorState == null ? 1 : objInstructorState.lastUnit;
		   unitNum	=	objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['U'];
           GetAssignmentListInfo(unitNum);
           assignmentListCheck(false);
           var weekNum	=	'';
            var dataFilter = {UnitNumber: unitNum};
           if(AssignmentInstructorView.ActiveTab === 'assignment') {
				weekNum =   objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['L'];;//objInstructorState == null ? 1 : objInstructorState.lastLesson;
               dataFilter["WeekNumber"] =   weekNum;
           }
			AssignmentInstructorView.saveInstructorState(unitNum, weekNum);
           AssignmentInstructorView.checkGradeBookAttemptDataLoaded(dataFilter, true)
       }
       
             
    });
    
    // Active Selection
    $("#activateSelection").off('click').on('click', function () {       
        var isActive    =   0;
        $(".bodySliderContainer .statusText").each(function () {
            if($(this).attr('data-text') == '') {
                isActive = 1;
                return false;
            }
        });
        
        if(isActive === 0) {            
            return false;
        }     

		if($(this).parent('.actionButton').hasClass('deactivate')) {
			return false;
		}
        
        AssignmentInstructorView.refreshStatus  =   false;
        $(".tabbing").addClass('deactivate');
        $(".select").addClass('deactivate');
		
		// if(AssignmentInstructorView.ActiveTab == 'grade') {			
			// AssignmentContainerView.resetHeaderBox();
		// }
		
		if($(".select").find(".dp_select_bg_option").is(':visible')) {
            $(".select").find(".dp_select_bg_option").slideUp(100);
        }
        
        $(".headerSliderWrapper .qs_ans").each(function () {
            _itemId =   $(this).attr('data-item');            
            if($(".bodySliderContainer .qs_ans[data-item="+_itemId+"][class*='noDisplay']").length == $(".bodySliderContainer .qs_ans[data-item="+_itemId+"]").length) {               
               $(this).addClass('noDisplay')
            }
        });
        
//        $(".qs_ans:not(.noDisplay)").addClass('sprite');
        $(".qs_ans[data-itemtype!='iwt'][data-auto-send!='true']:not(.noDisplay)").addClass('sprite');
        $(this).text(ASSIGNMENT_INSTRUCTOR.c_i_SELECT_ACTIVE_BUTTON);
        $("#sendOrCancelSelection").text(ASSIGNMENT_INSTRUCTOR.c_i_CANCEL_BUTTON);        
        //  Send Selected
        if($(this).hasClass('active')) {
            
            var studItems = new Array();  
            var studItemsRef = new Array();  
            var assignObj = {};
            var objData =   '';
            var objInteractiveR =   [];            
            
            $(".table_container_assignment .qs_ans.active").each(function () {
                objData =   $(this).data();
                studItems.push({"ItemID" : objData.item, "StudentIDs" : $.trim(objData.student), AssignToWholeClass:false});    
                studItemsRef.push({"ItemID" : objData.item, "StudentIDs" : $.trim(objData.student), AssignToWholeClass:false});    
            });
            
            //  To Get Selected Items For Interactive Reading
            $(".qs_ans[class*='sprite'][data-headertype='iwt']").each(function () {
                if($(this).hasClass('active')) {                    
                    objInteractiveR.push($(this).attr('item-level'));
                }
            });
            
            //  Unique Array
            $.unique(objInteractiveR);                        
            
            //  Loop Through Array To Find Same Level Data
//            for (objInteractiveRKey in objInteractiveR) {
//                $(".table_container_assignment .qs_ans[data-itemtype='iwt'][student-level='"+objInteractiveR[objInteractiveRKey]+"']").each(function () {
//                    if($(this).prev().attr('data-text') == '') {
//                        objData =   $(this).data();
//                        studItems.push({"itemId" : objData.item, "studentId" : objData.student, type: "IR"});                        
//                    }
//                });
//            }

            if(objInteractiveR.length) {
                $(".table_container_assignment .qs_ans[data-itemtype='iwt']").each(function () {
                    if($(this).attr('header-level') == $(this).attr('student-level') && $(this).prev().is(':empty')) { //  $(this).prev().attr('data-text') == ''
                        objData =   $(this).data();                        
                        studItems.push({"ItemID" : objData.item, "StudentIDs" : $.trim(objData.student), AssignToWholeClass:false});                        
                        studItemsRef.push({"ItemID" : objData.item, "StudentIDs" : $.trim(objData.student), type: "IR", AssignToWholeClass:false});                        
                    }
                });
            }            
            
            if(studItemsRef.length == 0) {
                $('#sendOrCancelSelection').trigger('click');                
                return false;
            }            
			
			var aStudItems	=	[];
			var aItemIds	=	_.uniq(_.pluck(studItems, 'ItemID'));
			var iTotStudent =	$(".assignment_slider_wrapper2").length;
			var iItemAssignedTo = 0;
			
			for(var iItemCnt = 0; iItemCnt < aItemIds.length; iItemCnt++) {
				aItemAssignedTo	=	_.where(studItems, {ItemID: aItemIds[iItemCnt]});
				iItemAssignedTo =	(typeof aItemAssignedTo == 'undefined' || aItemAssignedTo.length == 0) ? 0 : aItemAssignedTo.length;
				if(iItemAssignedTo == iTotStudent) {
					aStudItems.push({ItemID: aItemIds[iItemCnt], StudentIDs: '', AssignToWholeClass: true});
					
				} else {
					var oAssign	=	{};
					var sStudentIdsKey = '';
					oAssign["ItemID"]	=	aItemIds[iItemCnt];
					for(var aItemAssignedToKey = 0 ; aItemAssignedToKey < iItemAssignedTo; aItemAssignedToKey++) {
						sStudentIdsKey += $.trim(aItemAssignedTo[aItemAssignedToKey].StudentIDs) + ',';
					}
					sStudentIdsKey = sStudentIdsKey.substring(0, sStudentIdsKey.length - 1);
					oAssign["StudentIDs"]	=	sStudentIdsKey;
					oAssign["AssignToWholeClass"]	=	false;
					aStudItems.push(oAssign);					
				}
			}
			
			/* ILIT-985: auto send word reading */
			if($(".headerSliderContainer .qs_ans[data-headertype='iwt'].active").length) {				
				$(".headerSliderContainer .qs_ans[data-headertype='frs']").each(function () {
					var sStudIds = '';
					$(".table_container_assignment .qs_ans[data-item='"+$(this).attr('data-item')+"'][data-auto-send='true']").each(function () {						
						sStudIds += $.trim($(this).attr('data-student')) + ',';
					});
					aStudItems.push({ItemID: $(this).attr('data-item'), StudentIDs: sStudIds, AssignToWholeClass: false});
				});
			}						
            
			assignObj = {"studentItems": aStudItems};  
			//console.log(JSON.stringify(assignObj));
            var data  = (JSON.stringify(assignObj)).replace(/"/g, '\\"');     
            AssignmentInstructorView.updateRefreshedContent = false;
            //Native Call
            AssignGradeableItem(data);
			ShowLoader();
            AssignmentContainerView.updateAssignStatus({"studentItems": studItemsRef});                        
        }        
    });
    
    // Cancel Selction
    $("#sendOrCancelSelection").off('click').on('click', function () {       
       
       if($(this).text() ===  ASSIGNMENT_INSTRUCTOR.c_i_CANCEL_BUTTON) {           
           $(".qs_ans").removeClass('sprite active');
           $("#activateSelection").text(ASSIGNMENT_INSTRUCTOR.c_i_SELECT_BUTTON).removeClass('active');
           
           if(AssignmentInstructorView.ActiveTab == 'assignment') {
                $(this).text(ASSIGNMENT_INSTRUCTOR.c_i_SEND_ALL); 
           }
           AssignmentInstructorView.refreshStatus = true;
           $(".tabbing").removeClass('deactivate');
           $(".select").removeClass('deactivate');
       } else {           
           
           var isActive    =   0;
           $(".bodySliderContainer .statusText").each(function () {
               if($(this).attr('data-text') == '' && $.trim($(this).html()) != '-') {
                   isActive = 1;
                   return false;
               }
           });

           if(isActive === 0) {                   
               return false;
           }
           
           var sTitle   =    'Send All';
//           var sMessage   =    'Are you sure you want to assign all the '+AssignmentInstructorView.ActiveTab+' to the the class?';
           var sMessage   =    'Send all  '+AssignmentInstructorView.ActiveTab+' to the class?';
           var confirmTemplate =   _.template($("#confirmationTemplate").html());
           $("body").append(confirmTemplate);
           
           $('#dialog').attr('title', sTitle).html(sMessage).dialog({
                autoOpen:	true,
                resizable: 	false,
                draggable:	true,
                height: 275,
                width: 450,
                modal: true,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'gray',
                        click: function () {
                            $(this).dialog('destroy').remove();
                        }
                    },
                    {
                        text: 'Confirm',                        
                        click: function () {
                            //$(".table_container_assignment .qs_ans").addClass('active sprite');
                            $(".table_container_assignment").find(".statusText[data-text='']").next(".qs_ans[data-itemtype!='iwt'][data-extrapractice!='Yes']").addClass('active sprite');
                            
                            //For IR                           
                            $(".qs_ans[data-headertype='iwt'][data-extrapractice!='Yes']").addClass('sprite active');                            
                            
                            $("#activateSelection").addClass('active').trigger('click');
                            $(this).dialog('destroy').remove();
                        }
                    }
                ],
                open: function () {
                    $('.ui-dialog').addClass('Ilit_alert_box');
                }
           });
           
//           $(this).text(ASSIGNMENT_INSTRUCTOR.c_i_CANCEL_BUTTON); 
            AssignmentInstructorView.refreshStatus = true;
       }       
    });
    
    $(".qs_ans").off('click tap').on('click tap', function (event) {   
        
		if ($(this).hasClass("disabled")) {
			return;
		}
		
        if($(this).hasClass('sprite')) {  
            
            if($("#itemBubble").length) {
                $("#itemBubble").remove();
            }

            if($("#catInfoBubble").length) {
                $("#catInfoBubble").remove();
            }
            
            var objData =   $(this).data();

            if($(event.target).parents('.headerSliderContainer').length) {  //  For Column Selection                
                if($(this).hasClass('active')) {                
                    $(this).removeClass('active');
                    $("div[data-item="+objData.item+"]").removeClass('active');
                    
                    //  For Interactive Reading
                    if($(this).attr('data-headertype') === 'iwt') {
                        $(".qs_ans[data-headertype='iwt']").removeClass('active');
                    }
                } else {                
                    $(this).addClass('active');
                    $(".qs_ans[data-item="+objData.item+"][class*='sprite']:not('.disabled')").addClass('active');
                    
                    //  For Interactive Reading
                    if($(this).attr('data-headertype') === 'iwt') {
                        $(".qs_ans[data-headertype='iwt']").addClass('active');
                    }
                }
            } else {    //  For Cell Selection
                if($(this).hasClass('active')) {
                   $(this).removeClass('active');
                   //   Un-select column header automatically
                   $(".headerSliderContainer").find(".qs_ans[data-item="+objData.item+"]").removeClass('active');
                } else {                
                    $(this).addClass('active');                
                    // Check if all cell in a column selected manually, select the column header automatically                
                    if($(".bodySliderContainer").find(".qs_ans.sprite[data-item="+objData.item+"]").length == $(".bodySliderContainer").find(".qs_ans.active[data-item="+objData.item+"]").length) {
                        $(".headerSliderContainer").find(".qs_ans[data-item="+objData.item+"]").addClass('active');
                    }
                }
            }
        } else {
            $(this).parents('.slider_boxes_ct').trigger('click');
        }
                
        if($(".qs_ans").hasClass('active')) {            
            $("#activateSelection").addClass('active');     
        } else {
            $("#activateSelection").removeClass('active');
        }                        
        return false;
    });
};

AssignmentInstructorView.headerView = function (objDefaultSelection) {
    
    var arrUnit         =   _.uniq(_.pluck(AssignmentInstructorView.model.AssignmentData, 'UnitNumber'));
    var arrLessonSet    =   _.uniq(_.pluck(AssignmentInstructorView.model.AssignmentData, 'WeekNumber'));        
    
    var defaultSelection    =   (typeof objDefaultSelection == 'undefined') ? null : objDefaultSelection;    
    
    $("header").html(_.template($("#headerAssignment").html(), {
        arrUnit: objUnitDetails,//arrUnit,
        arrLessonSet: arrLessonSet.sort(function (a, b) {return a - b}),
		UnitWeekDetails:	getSortedUnitWeekDetails(JSON.parse(objUnitDetails.unitsWeeksDetails)),
        defaultSelection: defaultSelection,
        activeTab: AssignmentInstructorView.ActiveTab,
        objInstructorState: objInstructorState
    }));
    
    //  Filter Data Based On Search
    AssignmentInstructorView.filterData();
    
};

AssignmentInstructorView.checkGradeBookAttemptDataLoaded = function (dataFilter, isViewChanged) {
	
	if(objGradeBookV2JsonData != 0) {		
		objGradeBookJsonData = 0;
		//var aItemAttemptIds = _.pluck(objGradeBookV2JsonData.Content, 'IAID');					
		var aItemAttemptIds = _.map(objGradeBookV2JsonData.Content.GradeBookData, function (obj) {
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});	
		GetGradebookAttemptData(aItemAttemptIds);
		setTimeout(function () {
			AssignmentInstructorView.checkDataLoaded(dataFilter, isViewChanged);
		}, 0);		
	} else {
		setTimeout(function () {
			AssignmentInstructorView.checkGradeBookAttemptDataLoaded(dataFilter, isViewChanged);
		}, 200);
	}	
}

AssignmentInstructorView.checkDataLoaded = function (dataFilter, isViewChanged) {
    
    if(objGradeBookJsonData != 0) {
        //if(objGradeBookJsonData.Status == "200" || objGradeBookJsonData.Status == "500") {            
            //AssignmentInstructorView.model["GradeData"] = (objGradeBookJsonData == null) ? null : objGradeBookJsonData.Content;   
            
			if (objGradeBookJsonData == null) {
				var GradeData =	null;
			}
			else {
				var GradeData		=	[];				
				if(objPlatform.isBrowser()) {
					GradeData	=	objGradeBookJsonData.Content;
				} else {
					for(var GradeDataKey = 0; GradeDataKey < objGradeBookJsonData.Content.length; GradeDataKey++) {
						if(typeof objGradeBookJsonData.Content[GradeDataKey] == "string") {
							GradeData.push(JSON.parse(objGradeBookJsonData.Content[GradeDataKey]));
						} else {
							GradeData.push(objGradeBookJsonData.Content[GradeDataKey]);
						}
					}
				}
			}
			
			AssignmentInstructorView.model["GradeData"] = GradeData;
			
			
            if(isViewChanged === true) {                 
                 if(AssignmentInstructorView.ActiveTab == 'grade') {
                    AssignmentInstructorView.model["AssignmentData"] = _.where(objAssignmentListJsonData.Content, {ItemType: 'assessment', ItemSubType: AssignmentInstructorView.ActiveTab}); 
                 } else {
                    AssignmentInstructorView.model["AssignmentData"] = _.where(objAssignmentListJsonData.Content, {ItemType: AssignmentInstructorView.ActiveTab});
                 }
//                 AssignmentContainerView.init(AssignmentInstructorView.model);
            } else {
                if(AssignmentInstructorView.ActiveTab == 'grade') {
                    AssignmentInstructorView.model["AssignmentData"]  = _.where(objAssignmentListJsonData.Content, {ItemType: 'assessment', ItemSubType: AssignmentInstructorView.ActiveTab});
                } else {
                    AssignmentInstructorView.model["AssignmentData"]  = _.where(objAssignmentListJsonData.Content, {ItemType: AssignmentInstructorView.ActiveTab});                
                }
            }
            
            //dhinta
            var arrAssignmentExists = _.where(AssignmentInstructorView.model.AssignmentData, dataFilter);                            
            AssignmentInstructorView.plotView(dataFilter);
            if(arrAssignmentExists.length >= 0) { 
                AssignmentInstructorView.headerView(dataFilter);
                AssignmentInstructorView.bindEvent();
                AssignmentContainerView.displayBubble();
            }
            
            
            objAssignmentListJsonData   =   null;
            objGradeBookJsonData   =   0;
            
			var gradeBtnImg = (AssignmentInstructorView.ActiveTab === 'grade') ? 'media/grade.png' : 'media/grade_inactive.png';
			$(".gradeBtn img").attr("src", gradeBtnImg);
			
			var lastSelectedUnit  =  $("#headingText").attr("data-lastunit") ? $("#headingText").attr("data-lastunit") : dataFilter.UnitNumber;
			$("#selectedUnit").attr('data-id', lastSelectedUnit);
			$("#selectedUnit").text("Unit "+lastSelectedUnit);
		
            if(AssignmentInstructorView.ActiveTab == 'assessment' || AssignmentInstructorView.ActiveTab == 'grade') {
                $('#selectedLesson').hide();
                $("#sendOrCancelSelection").html('Cancel');
            } else {
                var lastSelectedWeek  =  $("#headingText").attr("data-lastlesson") ? $("#headingText").attr("data-lastlesson") : parseInt(dataFilter.WeekNumber);
				$("#selectedLesson").attr('data-id', lastSelectedWeek);
				$("#selectedLesson").text("Lessons " + ((lastSelectedWeek * 5) - 4) + "-" + (lastSelectedWeek * 5));
				$('#selectedLesson').show();
            }
            
        //}
    } else {
        setTimeout(function () {
            AssignmentInstructorView.checkDataLoaded(dataFilter, isViewChanged);
        }, 400);
    }
};

AssignmentInstructorView.alterGrid4ClassAverage = function () { // IPP-5056
	var oSelf = this,
		aRowCls = ['even', 'odd'];
	
	if ($('#contentArea .table_container_assignment > .assignment_slider_wrapper2') === 0) { return; }
	// if ($('#contentArea .table_container_assignment > .assignment_slider_wrapper2').filter(':last').hasClass('class-average') !== false) { return; }
	
	switch (oSelf.ActiveTab) {
		case 'grade':
			var aStudentCells = $('.studentCell'),
				dClassAverage = 0.0,
				oStudentRow = null,
				oStatusCell = null,
				oInfoCell = null,
				sStatus = '',
				dTotalGLE = 0.,
				dGLEScore = 0.,
				sGLEScore = '',
				sFirstScoreEntry = '',
				bHasVariesEntries = false,
				sAvgGLE = '',
				iScoredEntries = 0,
				sClsAvgStyleInfo = 'border-right:3px solid #48C3D8 !important',
				sClsAvgRowStyleInfo = '', // IPP-5096 | width:908px;
				aStudentRows = $('#contentArea .table_container_assignment > .assignment_slider_wrapper2'),
				oLastRow = aStudentRows.filter(':last'),
				oPreviousCell = null;
			// debugger;
			for (var iI = 0; iI < aStudentCells.length; iI++) {
				oStudentRow = $(aStudentCells[iI]).parent().parent();
				if (oStudentRow.hasClass('class-average')) {
					continue;
				}
				oStatusCell = oStudentRow.find('.bodySliderWrapper .gray_col');
				oInfoCell = oStatusCell.next('.qs_ans');
				
				sStatus = $.trim(oStatusCell.text()).toLowerCase();
				if (['sent', 'in progress'].indexOf(sStatus) === -1) {
					sGLEScore = $.trim(oStatusCell.text());
					dGLEScore = getActualValue(sGLEScore);
					
					if (!isNaN(dGLEScore)) {
						dTotalGLE += dGLEScore;
						iScoredEntries++;
						
						if (sFirstScoreEntry !== '') {
							if (sFirstScoreEntry !== sGLEScore) {
								bHasVariesEntries = true;
							}
						}
						else {
							sFirstScoreEntry = sGLEScore;
						}
					}
				}
			}
			sAvgGLE = sFirstScoreEntry;
			if (bHasVariesEntries !== false) {
				sAvgGLE = (dTotalGLE / iScoredEntries).toFixed(1);
			}
			if (oLastRow.hasClass('class-average') === false) {
				oPreviousCell = oLastRow.find('.slider_boxes_ct').filter('.mar_none');
				sClsAvgStyleInfo = (oPreviousCell.attr('style') || 'border:0px none !important;');
				sClsAvgRowStyleInfo = (oLastRow.find('.bodySliderWrapper').attr('style') || 'width:100%;');
				
				$('#contentArea .table_container_assignment').append('<div class="assignment_slider_wrapper2 class-average grade ' + aRowCls[($('#contentArea .table_container_assignment > .assignment_slider_wrapper2').length % 2)] + '">\
					<div class="slider_wrapper_inr">\
						<div class="unit_lesson_set left studentCell">\
							<div class="table_inner_box">\
								Class Average\
							</div>\
							<div class="clear"></div>\
						</div>\
						<div class="bodySliderWrapper" style="' + sClsAvgRowStyleInfo + '">\
							<div class="bodySliderContainer">\
								<div class="slider_container_wrapper">\
									<div class="slider_container_wrapper_inner" style="left:0px;">\
										<div class="slider_boxes_cnt grade_cnt ">\
											<div class="slider_boxes_ct mar_none" style="' + sClsAvgStyleInfo + '">\
												<div class="table_inner_box_out">' + sAvgGLE + '</div>\
												<div class="clear"></div>\
											</div>\
											<div class="clear"></div>\
										</div>\
										<div class="slider_boxes_cnt grade_cnt last_box"> <div class="clear"></div> </div>\
									</div>\
									<div class="clear"></div>\
								</div>\
							</div>\
						</div>\
						<div class="clear"></div>\
					</div>\
					<div class="clear"></div>\
				</div>');
			}
			else {
				$('#contentArea .table_container_assignment > .assignment_slider_wrapper2')
					.filter('.class-average')
						.find('.table_inner_box_out')
							.text(sAvgGLE);
			}
		break;
	}
};

AssignmentInstructorView.filterData = function () {    
    
    // Toggle Open/Close Unit And Lesson Set Dropdown
    $(".select").off('click tap').on('click tap', function (event) {
        
        if($(".qs_ans").hasClass('sprite')) {
            return false;
        }
        
        $(".select").find(".dp_select_bg_option").slideUp();
        if(!$(this).find(".dp_select_bg_option").is(':visible')) {
            $(this).find(".dp_select_bg_option").slideDown();
        }
        AssignmentContainerView.removeBubble();
        event.stopPropagation();
    });
    
    // Select Particular Unit/Lesson Set
    $(".dp_select_option").off('click tap').on('click tap', function () {		
		// reset few data
		AssignmentInstructorView.resetDataAfterView();
        // Filter Data            
		if(AssignmentInstructorView.isPageLoaded == 0 && objInstructorState != null && objInstructorState['ADB']['ACTTAB'] != 'assignment') {
				AssignmentInstructorView.ActiveTab = objInstructorState['ADB']['ACTTAB'];
		}
		
		AssignmentContainerView.resetHeaderBox();
	
		var objData         =   $(this).data();
		var assignmentData  =   AssignmentInstructorView.model.AssignmentData;                
		if(objData.type     === "lessonset" && $('#selectedLesson').is(':visible')) {   //  After Select Lesson set              
            
			AssignmentInstructorView.updateRefreshedContent	=	true;
			// AssignmentInstructorView.lastGradeBookContent   =   objGradeBookJsonData;
            // objGradeBookJsonData    = 0;
            // objStudentListJsonData  = 0;
			// objGradeBookV2JsonData	= 0;
            // GetStudentListInfo();
            // AssignmentContainerView.refreshStudentData(false);
			
            dataFilter      =   {WeekNumber: objData.id, UnitNumber:  $("#selectedUnit").data().id};
            $(this).parent().siblings(".select_bg").attr({'data-id': objData.id});
            
            AssignmentInstructorView.plotView(dataFilter);
            
        } else {    //  After Select Unit            
            if(AssignmentInstructorView.ActiveTab == 'assessment' || AssignmentInstructorView.ActiveTab == 'grade') {	
				// _unitNum		=	(objInstructorState == null) ? objData.id : objInstructorState.lastUnit;
				_unitNum		=	objData.id;				
                dataFilter      =   {UnitNumber: _unitNum};
            } else {
                // _WeekNumber     =   objInstructorState == null ? 1 : objInstructorState.lastLesson;
				//_WeekNumber     =   AssignmentInstructorView.isPageLoaded == 0 ? (objInstructorState == null ? 1 : objInstructorState.lastLesson) : 1;
				_WeekNumber     =   AssignmentInstructorView.isPageLoaded == 0 ? objInstructorState['ADB']['POS'][ABBREVIATION[AssignmentInstructorView.ActiveTab]]['L'] : 1;
                dataFilter      =   {WeekNumber:  _WeekNumber, UnitNumber: objData.id};   /*$("#selectedLesson").data().id*/                
            }
            
            $(this).parent().siblings(".select_bg").attr({'data-id': objData.id});            
                        
            var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
            $("#loaderContainer").html(loaderImg).addClass('loaderContainer');
            $("#loaderContainer").show();
            $(".loaderContainerOverlay").show();                        
            
            if(AssignmentInstructorView.isPageLoaded === 1) {  					
                objAssignmentListJsonData   =   null;
				objGradeBookV2JsonData		=	0;
                GetAssignmentListInfo(dataFilter.UnitNumber);
                assignmentListCheck(false, dataFilter);
                //AssignmentInstructorView.checkDataLoaded(dataFilter, false);				
				AssignmentInstructorView.checkGradeBookAttemptDataLoaded(dataFilter, false);
            } else {        				
                AssignmentInstructorView.isPageLoaded = 1;
				if(objInstructorState != null && objInstructorState['ADB']['ACTTAB'] != 'assignment') {					
					AssignmentInstructorView.checkDataLoaded(dataFilter, false);
				} else {
					AssignmentInstructorView.plotView(dataFilter);
				}
            }                    
        };                
                
        $(this).parent().siblings(".select_bg").text($(this).html()); 
        $(this).parents('.dp_select_bg_option').slideUp();                
        return false;
    });
    
    // Hide Unit/Lesson Set Dropdown On Document Click
    $("#contentArea").off('mousedown').on('mousedown', function (event) {                    
        $(".select").find(".dp_select_bg_option").slideUp();            
//        if (!$(event.target).is('.select') && $(".select").find(".dp_select_bg_option").is(':visible')) {                       
//            $(".select").find(".dp_select_bg_option").slideUp();            
//        }
    });
};


AssignmentInstructorView.plotView    =   function (dataFilter) {
    	
    var assignmentData  =   AssignmentInstructorView.model.AssignmentData;                
//    AssignmentContainerView.model.AssignmentData = _.where(AssignmentInstructorView.model.AssignmentData, dataFilter);    
    var tempAssignmentData = _.where(AssignmentInstructorView.model.AssignmentData, dataFilter);    
    if(tempAssignmentData.length == 0) {        
        var _lastSelectedLesson =   $("#selectedLesson").text();        
        var sTitle = "No data found",
        sSubMessage = (AssignmentInstructorView.ActiveTab == 'assignment') ? 
						((parseInt(dataFilter.WeekNumber) * 5) - 4) + "-" + (parseInt(dataFilter.WeekNumber) * 5) : dataFilter.UnitNumber,
        sMessage = 'No Record Found For ' + sSubMessage;                
        var confirmTemplate =   _.template($("#confirmationTemplate").html());
        $("body").append(confirmTemplate);
        
        $('#dialog').attr('title', sTitle).html(sMessage).dialog({
            autoOpen:	true,
            resizable: 	false,
            draggable:	true,
            height: 275,
            width: 450,
            modal: true,
            buttons: {
                "Ok": function () {                          
                    $(this).dialog('destroy').remove();
                    if(AssignmentInstructorView.ActiveTab == 'assignment') {
                        $("#selectedLesson").text(_lastSelectedLesson);
                        var arrLastSelectedLesson   =   _lastSelectedLesson.split("-");
                        var dataId  =   parseInt(arrLastSelectedLesson[1]) / 5;
                        $("#selectedLesson").attr('data-id', dataId);                                                                        
                    }
                    
                    $(".loaderContainerOverlay").removeAttr('style');
                    $("#loaderContainer").html('').hide();
                    $("#loaderContainer").removeClass('loaderContainer');
                                        
                    var lastSelectedUnit  =  $("#headingText").attr("data-lastunit") ? $("#headingText").attr("data-lastunit") : dataFilter.UnitNumber;
                    var lastSelectedWeek  =  $("#headingText").attr("data-lastlesson") ? $("#headingText").attr("data-lastlesson") : parseInt(dataFilter.WeekNumber);					                   
                    
                    $("#selectedUnit").attr('data-id', lastSelectedUnit);
                    $("#selectedLesson").attr('data-id', lastSelectedWeek);
                    
                    $("#selectedUnit").text("Unit "+lastSelectedUnit);
					$("#selectedLesson").text("Lessons " + ((lastSelectedWeek * 5) - 4) + "-" + (lastSelectedWeek * 5))
					                   
                    AssignmentInstructorView.saveInstructorState(parseInt(lastSelectedUnit), lastSelectedWeek);
					                  
                }
            },
            open: function () {
                $('.ui-dialog').addClass('Ilit_alert_box');
            }
		});
        
       // return false;
    }

    AssignmentContainerView.model.AssignmentData    =   tempAssignmentData;
    $("#sendOrCancelSelection").text(ASSIGNMENT_INSTRUCTOR.c_i_CANCEL_BUTTON);  
    clearInterval(AssignmentInstructorView.refreshInterval);
    AssignmentContainerView.render();    
    //  Set Header Banner
		var _html   =   'Unit ' + dataFilter.UnitNumber;
	
    weekNum =   '';
    if(AssignmentInstructorView.ActiveTab === 'assignment') {
        weekNum    =   parseInt(dataFilter.WeekNumber);
//        _html +=    CHARACTERS.c_s_BREAK + "<strong>Lesson Set </strong>" + dataFilter.WeekNumber;
		  _html +=    CHARACTERS.c_s_BREAK + "<strong>Lessons </strong>" + ((weekNum * 5) - 4) + "-" + (weekNum * 5);
			
        
    }
    
    $("#headingText").html(_html);
    $("#headingText").attr("data-lastunit", dataFilter.UnitNumber);
    $("#headingText").attr("data-lastlesson", weekNum);

    AssignmentInstructorView.model.AssignmentData   =   assignmentData;
    
    $(".loaderContainerOverlay").removeAttr('style');
    $("#loaderContainer").html('').hide();
    $("#loaderContainer").removeClass('loaderContainer');    
    AssignmentInstructorView.saveInstructorState(dataFilter.UnitNumber, weekNum);
    return false;
};

/**
 * 
 * @method resetDataAfterView
 * reset data that was set before view assignment 
 * @returns {undefined}
 */
AssignmentInstructorView.resetDataAfterView = function () {
	AssignmentContainerView.iActivePagingIndex = 0;
}

/**
 * 
 * @param {String} plastSelectedUnit
 * @param {String} pweekNum
 * @returns {undefined}
 */
AssignmentInstructorView.saveInstructorState    =   function (plastSelectedUnit, pweekNum) {
    
    var oSelf = this,
		instructorLoadingState  =  'instructorLoadingState',
		activeTab       		=  AssignmentInstructorView.ActiveTab;
		
    var lastUnit        =  plastSelectedUnit;
    var lastLesson      =  '';
	
	objInstructorState['ADB']['POS'][ABBREVIATION[activeTab]]['U'] = plastSelectedUnit;
	objInstructorState['ADB']['ACTTAB'] = activeTab;
	
	if (activeTab === 'assignment') {
		objInstructorState['ADB']['POS'][ABBREVIATION[activeTab]]['L'] = pweekNum;
	}
	
	var sInstructorLoadingState = encodeURIComponent(JSON.stringify(objInstructorState));
    
	if(
		'userSettingEnabled' in objUnitDetails && 
		objUnitDetails['userSettingEnabled'] === "1"
	){
		SaveUserSettings(sInstructorLoadingState);
	}
	else {
		SaveData("instructorLoadingState", sInstructorLoadingState);
	}
};

/**
 * Main Assignment Container
 * @returns Void
 */
function AssignmentContainerView(){};

AssignmentContainerView.init = function (model) {  
        
    dataModel   =   {AssignmentData: null, StudentList: null, GradeData: null};
    
    if(AssignmentInstructorView.ActiveTab == 'grade') {
        dataModel.AssignmentData=   _.where(model.AssignmentData, {ItemType: 'assessment', ItemSubType: AssignmentInstructorView.ActiveTab});
    } else {
        dataModel.AssignmentData=   _.where(model.AssignmentData, {ItemType: AssignmentInstructorView.ActiveTab});        
    }
	
	if((typeof objUnitDetails.serviceVersion != "undefined" && objUnitDetails.serviceVersion !=null) || objPlatform.isBrowser() == true) {
		AssignmentInstructorView.oJsonKeys		=	ASSIGNMENT_KEYS.V2;
	} else {
		AssignmentInstructorView.oJsonKeys		=	ASSIGNMENT_KEYS.PREV2;
	}
	
    dataModel.GradeData     =   model.GradeData;
    dataModel.StudentList   =   model.StudentList;        
    AssignmentContainerView.model   =   dataModel;		
    AssignmentInstructorView.init(dataModel);    
    AssignmentInstructorView.headerView();        
        
};

AssignmentContainerView.model = null;
AssignmentContainerView.totBoxDisplay   =   0;
AssignmentContainerView.SlideStartIndex   =   0;
AssignmentContainerView.actualSliderViewerWidth   =   0;

AssignmentContainerView.render = function (pbStatus) {

	var oContainerView = this,
		aGradeData = [],
		iCurrentUnit = parseInt($("#selectedUnit").attr('data-id'));
		
	AssignmentContainerView.oGradeDataPerStudent = {}; // declare an object to store BOY scores
	
	// oBOYGradeList is declared in the helper file & contains BOY assignment info
    $("#contentArea").html(_.template($("#bodyAssignment").html(), {
        "data" : oContainerView.model,
        "activeTab": AssignmentInstructorView.ActiveTab,
		"currentUnit": iCurrentUnit,
		"gradeList": oBOYGradeList || []
    }));    
    
	oContainerView.resize ();    
    oContainerView.displayBubble();
	oContainerView.toggleGleView();
    oContainerView.bindEvent();
    oContainerView.textOverflowControl();
    
    AssignmentInstructorView.bindEvent();
    
    if(typeof pbStatus == 'undefined' || pbStatus != false)
    $("#sendOrCancelSelection").trigger('click');    
    
    AssignmentInstructorView.restructuredIR();
	if (AssignmentInstructorView.ActiveTab == 'grade') { // IPP-5056
		setTimeout(function () {
			AssignmentInstructorView.alterGrid4ClassAverage();
		}, 300);
	}
    
    window.onresize =   function () {
        oContainerView.resize();
        oContainerView.resizeHeight();
    };
    oContainerView.resizeHeight();
        
    //  Refresh GetgradeBook Call
	AssignmentInstructorView.refreshStatus = true;
    AssignmentInstructorView.refreshInterval = setInterval(oContainerView.refreshData, 10000);    
};



AssignmentContainerView.renderClassAverage = function () {

	var oContainerView = this;
	
	$(".table_container_assignment .assignment_slider_wrapper2:last").after(
		_.template(
			$("#classAverageTemplate").html(), {
				"data" : oContainerView.model,
				"activeTab": AssignmentInstructorView.ActiveTab
			}
		)
	);
	
};



AssignmentContainerView.refreshData    =   function (callingMode) {
	
	callingMode = (typeof callingMode == "undefined") ? 0  : callingMode;
	
	if(AssignmentInstructorView.refreshStatus) {
		AssignmentInstructorView.lastGradeBookContent   =   objGradeBookJsonData;
		objGradeBookJsonData    = 0;
		objGradeBookV2JsonData	= 0;
		if (callingMode == 0){
			objStudentListJsonData  = 0;
			GetStudentListInfo();
		}
		AssignmentContainerView.refreshStudentData(true);
	}
};

/**
 * Bind Events
 * @returns {undefined}
 */
AssignmentContainerView.bindEvent = function () {    
    AssignmentContainerView.studentFeaturesView();    
};

/**
 * Student App View: Student Notebook
 * @returns {undefined}
 */
AssignmentContainerView.studentFeaturesView =   function () {
    
    $(".studentCell").off('click tap').on('click tap', function () {       
       if(typeof objUnitDetails.currentVersion != 'undefined') {
	   
		   var studentName  =   $(this).find(".studentName").text();
           var studentid  =   $(this).find(".studentName").data().id;
           
           if($("#catInfoBubble").length) {
                $("#catInfoBubble").remove();
           }
		   
		   //	If Already Opend Close the Notebook Info Popup		   		   
		   if($(".viewNoteBook").length) {				
				var _studentIDForVisibleNoteBookOption = $(".viewNoteBook").attr('data-student');
				$("#itemBubble").remove();				
				if(studentid == _studentIDForVisibleNoteBookOption) {					
					return false;
				}
		   }
		   
           if($("#itemBubble").length) {                
                $("#itemBubble").remove();                
           }
		   		   
		   
		   if(AssignmentInstructorView.refreshStatus == false) {
				return false;
			}
           
           var top     = $(this).offset().top + 38;
           var left    = $(this).offset().left - 75;           
           
            var $buttonObj  = {
                "0" : {
                    class: "viewNoteBook",
                    text: "View Notebook"//ASSIGNMENT_INSTRUCTOR.c_i_VIEW_BUTTON
                }
            };
            
            var $html   =   _.template($("#infoBubble").html(),{
                "title" : studentName,
				"readingLevel" : 0,
                "itemId": null,
                "itemAttemptId": null,
                "studentId": studentid,
                "buttonObj" : $buttonObj
            }); 
            
            $('body').append($html);       
			
			var ViewPortHeight   =   document.documentElement.clientHeight;
			var tooltipHeight   =   $('.lesson_tooltip').height();
			
			if(top + $(this).height() + tooltipHeight > ViewPortHeight) {
				$('#itemBubble').addClass('btm_tooltip');
				top =   top - $(this).height() - tooltipHeight;
			}
            
            $("#itemBubble").css({
                'position' : 'absolute',
                'left' : "10px",
                'top' : top + "px",
                'opacity': 1
            });
            
            $(".lesson_tooltip").css({
                'width': '200px'
            });
            
            $(".Tooltip_title_wrap").css({
                'text-align': 'center',
                'word-wrap': 'break-word'
            });
            AssignmentContainerView.openStudentNoteBook();
            return false;
       }       
    });
};

/**
 * Open Student Notebook
 * @returns {undefined}
 */
AssignmentContainerView.openStudentNoteBook =   function () {
    
    $(".viewNoteBook").off('tap click').on('tap click', function (event) { 
        event.stopPropagation();		

        var sIframeUrl = 'notebook.html?'  + POPUP_VIEW.c_s_QUERY_PARAM_MODE + '=' + POPUP_VIEW.c_s_MODE_INSTRUCTOR + '&' + POPUP_VIEW.c_s_QUERY_PARAM_ACTION + '=' + POPUP_VIEW.c_s_ACTION_VIEW + '&' + POPUP_VIEW.c_s_QUERY_PARAM_STUDENT_ID + '=' + $(this).attr('data-student');
        if ( objPlatform.isDevice()) {
            ShowWebView(sIframeUrl);
        } else {
            $('#viewNotebookPopupArea').find('iframe').attr('src',sIframeUrl).load(function() {
                $('#viewNotebookPopupArea').show();
            });
        }
        
        if($("#itemBubble").length) {                
            $("#itemBubble").remove();                
        }

        $('html, body').css({
            'overflow': 'hidden',
            'height': '100%'
        });        
        
    });
};

/**
 * Calculation onResize Instructor View
 * @returns {undefined}
 */
AssignmentContainerView.resize = function() {    
    //  Resize Slider Box
    var wrapperInnerPadding     =   parseInt($(".slider_wrapper_inr").css('padding-left')) + parseInt($(".slider_wrapper_inr").css('padding-right'));
    var wrapperInnerWidth       =   $(".slider_wrapper_inr").width() + wrapperInnerPadding; //parseInt($(".slider_wrapper_inr").css('padding-left')) + parseInt($(".slider_wrapper_inr").css('padding-right'));
    var leftTextWidth           =   $(".unit_lesson_set").width();
    var sliderPadding           =   parseInt($(".slider_container_wrapper").css('padding-left')) + parseInt($(".slider_container_wrapper").css('padding-right'));
    var itemBoxTotWidth         =   parseInt($(".slider_boxes_ct").width()) + parseInt($(".slider_boxes_ct").css('padding-left')) + parseInt($(".slider_boxes_ct").css('padding-right'));
	var adjustWidth 			= 0;
    
//    var numItemBox              =   Math.floor(parseInt($(".headerSliderWrapper").width())/parseInt($(".slider_boxes_ct").width()));
    var availableSliderWidth    =   wrapperInnerWidth - leftTextWidth;
//    var availableSliderWidthNoPadding    =   availableSliderWidth - sliderPadding - (numItemBox * 1);    
    var availableSliderWidthNoPadding    =   availableSliderWidth - sliderPadding - 7;
        
    var numItemBox              =   Math.floor(availableSliderWidthNoPadding/itemBoxTotWidth);
    var totItemBox              =   $(".headerSliderContainer .slider_boxes_ct").length;    
    var numPages                =   Math.ceil(totItemBox / numItemBox);
    var paginationHtml          =   '<span class="slider_switch"></span>';//$('.pagination_for_slider').html();
    
    AssignmentContainerView.totBoxDisplay   =   numItemBox;
    AssignmentContainerView.SlideStartIndex =   0;
    
    if(numPages > 1) {
        $(".pagination_for_slider").html('');   //  Added
        for(var cnt = 1; cnt <= numPages; cnt++) {
            $(".pagination_for_slider").append(paginationHtml);
        }		
		if (AssignmentContainerView.iActivePagingIndex) {
			$('.slider_switch:eq('+AssignmentContainerView.iActivePagingIndex+')').addClass('active');
		}
		else {
			$('.slider_switch:first').addClass('active');
		}
    } else {    //  Else Added
        $(".pagination_for_slider").html('');
    }
    
    var numLastBox  =   0;
    $(".slider_boxes_ct").each(function (index) {        
        if(index + 1 <= AssignmentContainerView.totBoxDisplay && $(".slider_boxes_ct:eq("+index+")").length) {
            if($(".slider_boxes_ct:eq("+index+")").hasClass('lastBox')) {
                ++numLastBox;
            }
        } else {
            return false;
        }                
    });    
    
    lastItemBoxWidth            =   availableSliderWidthNoPadding - (availableSliderWidthNoPadding/numItemBox);
    
   /* var totalItemBoxWidth       =   $(".headerSliderWrapper .slider_boxes_ct").length * itemBoxTotWidth + $(".headerSliderWrapper .slider_boxes_ct").length + 4;
   var cnt                     =   Math.ceil(totalItemBoxWidth/parseInt($(".headerSliderWrapper").width()));     */
    calculatedWidth =   numItemBox * itemBoxTotWidth + numItemBox * 1;
    AssignmentContainerView.actualSliderViewerWidth =   calculatedWidth;
    calculatedWidth =   calculatedWidth + numLastBox * 2;
    
    $(".headerSliderWrapper").width(calculatedWidth - 2);
    $(".bodySliderWrapper").width(calculatedWidth - 2);
	
	/* adjust left panel width in case of space problem */
	if (calculatedWidth + wrapperInnerPadding > availableSliderWidthNoPadding) {
		adjustWidth = leftTextWidth - ((calculatedWidth + wrapperInnerPadding) - availableSliderWidthNoPadding);
		$(".unit_lesson_set").css({"width": adjustWidth+"px"});
		$(".unit_lesson_set.studentCell").css({"width": (adjustWidth+50)+"px"});
	}      
	  
    AssignmentContainerView.initSwiper();   
//    alert(availableSliderWidthNoPadding);

    AssignmentContainerView.changePagination();
};

/**
 * Initiate Swiper Control
 * @param {String} psSlideType
 * @returns {undefined}
 */
AssignmentContainerView.initSwiper = function(psSlideType){
    sSlideType  =   typeof psSlideType == "undefined" ? '' : psSlideType;
    
    var numPage     =   $(".slider_switch").length;
    
    if(numPage > 1 && $(".slider_switch.active").index() < numPage - 1) {
        $("#nextPagingBtn").show();
    } else if (numPage <= 1) {    //  Else Part Added
        $("#nextPagingBtn").hide();
        $("#prevPagingBtn").hide();
        $(".slider_container_wrapper_inner").css({left: '0px'});
    }
    
    $("#nextPagingBtn").off('click').on('click', function () {       
        
        var calculatedLeft = AssignmentContainerView.calculateSlideDistance();
        if(sSlideType == 'q') {
            $(".slider_container_wrapper_inner").css({left: "-=" + calculatedLeft + 'px'});
        } else {
            $(".slider_container_wrapper_inner").animate({left: "-=" + calculatedLeft + 'px'}, 400);
        }
        
        AssignmentContainerView.updatePagination (numPage, 'next');   
        
        AssignmentContainerView.SlideStartIndex =   AssignmentContainerView.SlideStartIndex + AssignmentContainerView.totBoxDisplay;
        AssignmentContainerView.updateSliderSize('next');
    });
    
    $("#prevPagingBtn").off('click').on('click', function () {
        
       
        AssignmentContainerView.updatePagination (numPage, 'prev');     
        
        AssignmentContainerView.SlideStartIndex =   AssignmentContainerView.SlideStartIndex - AssignmentContainerView.totBoxDisplay;
        AssignmentContainerView.updateSliderSize('prev');
        
        var calculatedLeft = AssignmentContainerView.calculateSlideDistance();
        if(sSlideType == 'q') {
            $(".slider_container_wrapper_inner").css({left: "+=" + calculatedLeft + 'px'});
        } else {
            $(".slider_container_wrapper_inner").animate({left: "+=" + calculatedLeft + 'px'}, 400);
        }        
        
    });
};

/**
 * 
 * @param {String} psType
 * @returns {undefined}
 */
AssignmentContainerView.updateSliderSize = function (psType) {
	var numLastBox  =   0;
    var startIndex  = 0;
	var adjustWidth = 0;
	
	//  Resize Slider Box
    var wrapperInnerPadding     =   parseInt($(".slider_wrapper_inr").css('padding-left')) + parseInt($(".slider_wrapper_inr").css('padding-right'));
    var wrapperInnerWidth       =   $(".slider_wrapper_inr").width() + wrapperInnerPadding; 
    var leftTextWidth           =   $(".unit_lesson_set").width();
    var sliderPadding           =   parseInt($(".slider_container_wrapper").css('padding-left')) + parseInt($(".slider_container_wrapper").css('padding-right')); 
    var availableSliderWidth    =   wrapperInnerWidth - leftTextWidth;  
    var availableSliderWidthNoPadding    =   availableSliderWidth - sliderPadding - 7;
	
	
    $(".slider_boxes_ct").each(function (index) { 
        startIndex = index + AssignmentContainerView.SlideStartIndex;        
        if(startIndex < (AssignmentContainerView.SlideStartIndex + AssignmentContainerView.totBoxDisplay) && $(".slider_boxes_ct:eq("+index+")").length) {
            newIndex = index + AssignmentContainerView.SlideStartIndex;
            if($(".slider_boxes_ct:eq("+newIndex+")").hasClass('lastBox')) {
                ++numLastBox;
            }
        } else {
            return false;
        }                
    });         
    
    calculatedWidth =   AssignmentContainerView.actualSliderViewerWidth;
    calculatedWidth =   calculatedWidth + numLastBox * 2;
    
    $(".headerSliderWrapper").width(calculatedWidth - 2);
    $(".bodySliderWrapper").width(calculatedWidth - 2);
	
	/* adjust left panel width in case of space problem */
	if (calculatedWidth + wrapperInnerPadding > availableSliderWidthNoPadding) {
		adjustWidth = leftTextWidth - ((calculatedWidth + wrapperInnerPadding) - availableSliderWidthNoPadding);
		$(".unit_lesson_set").css({"width": adjustWidth+"px"});
		$(".unit_lesson_set.studentCell").css({"width": (adjustWidth+50)+"px"});
	}
	else if (calculatedWidth + wrapperInnerPadding < availableSliderWidthNoPadding) {
		adjustWidth = leftTextWidth + (availableSliderWidthNoPadding - (calculatedWidth + wrapperInnerPadding));
		$(".unit_lesson_set").css({"width": adjustWidth+"px"});
		$(".unit_lesson_set.studentCell").css({"width": (adjustWidth+50)+"px"});
	}	
};	

AssignmentContainerView.updatePagination = function (numPage, swipe) {
    
    var activePagingIndex = $(".slider_switch.active").index();
    
    if(swipe === 'next') {  //  Next Page
        if(numPage > 1) {
            $("#prevPagingBtn").show();          
            activePagingIndex++;
            $(".slider_switch").removeClass('active');
            $(".slider_switch:eq("+activePagingIndex+")").addClass('active');
        }
                
        if(activePagingIndex === (numPage - 1)) {
            $("#nextPagingBtn").hide();
        }
    } else {    //  Previous Page
        if(numPage > 1) {
            $("#nextPagingBtn").show();
            activePagingIndex--;
            $(".slider_switch").removeClass('active');
            $(".slider_switch:eq("+activePagingIndex+")").addClass('active');
        }
        
        if(activePagingIndex === 0) {
            $("#prevPagingBtn").hide();
        }
    }
};

AssignmentContainerView.changePagination = function () {
    $(".slider_switch").off('click').on('click', function () {    
        if($(this).hasClass('active')) {
            return false;
        }
        
        var currentActiveIndex  =   $(".slider_switch.active").index();
        var clickedIndex        =   $(this).index();
        
        AssignmentContainerView.initSwiper('q');
        
        if(currentActiveIndex > clickedIndex) {
//            2 > 0
            for(; currentActiveIndex > clickedIndex; currentActiveIndex--) {
                // Change Slide Effect from .css to .animate
                if(currentActiveIndex - 1 == clickedIndex) {
                    AssignmentContainerView.initSwiper();
                }
                $("#prevPagingBtn").trigger('click');
            }
        } else {    
//            2 < 3
            for(; currentActiveIndex < clickedIndex; currentActiveIndex++) {
                // Change Slide Effect from .css to .animate
                if(currentActiveIndex + 1 == clickedIndex) {
                    AssignmentContainerView.initSwiper();
                }
                $("#nextPagingBtn").trigger('click');
            }
        }        
    });
};

AssignmentContainerView.calculateSlideDistance = function () {
    
   /* var itemBoxWidth    = parseInt($(".slider_boxes_ct").width()) + parseInt($(".slider_boxes_ct").css('padding-left')) + parseInt($(".slider_boxes_ct").css('padding-right'));
   var numItem         = Math.floor(parseInt($(".headerSliderWrapper").width())/ itemBoxWidth); */
    var calculatedLeft  = parseInt($(".headerSliderWrapper").width()); //itemBoxWidth * numItem;
    return calculatedLeft;
};

AssignmentContainerView.displayBubble = function () {
    
    $(".headerSliderWrapper .slider_boxes_ct").off('click tap').on('click tap', function () {
		
		//	If GLE Score Matrix is open
		if($("#detailGradeInfoContainer").length) {			
			return false;
		}
        
        if($("#catInfoBubble").length) {
            $("#catInfoBubble").remove();
        }
        if($("#itemBubble").length) {
            var $bubbleItemId   =   $("#itemBubble").data().item;
            $("#itemBubble").remove();
            if($bubbleItemId == $(this).find(".qs_ans").data().item) {
                return false;
            }
        }
        
        if($(this).find(".qs_ans").hasClass('sprite')) {
            $(this).find(".qs_ans").trigger('click');
            return false;
        }
        
        if($(".qs_ans").hasClass('sprite')) {
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
        
        var buttonObj   =   null;
        var sAssignmentSubType  =   $(".headerSliderContainer .qs_ans[data-item='"+itemId+"']").attr('data-headertype');
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
        
       /* if(isSendToClass && sAssignmentSubType == 'iwt') {
           // Do Nothing
       }
       else if(isSendToClass && sAssignmentSubType == 'studyplan') {            
           buttonObj["3"] = {
               class: "SendToClass studyPlanHeaderBubble",
               text: ASSIGNMENT_INSTRUCTOR.c_i_SEND_CLASS_BUTTON
           };
       }
       else if(isSendToClass && sAssignmentSubType != 'studyplan') {
           buttonObj["1"] = {
               class: "SendToClass",
               text: ASSIGNMENT_INSTRUCTOR.c_i_SEND_CLASS_BUTTON
           };
       } */
        
        var $html   =   _.template($("#infoBubble").html(),{
            "title" : title,      
            "readingLevel" : (sAssignmentSubType == 'iwt') ? readingLevel : 0,
            "itemId": itemId,
            "itemAttemptId": itemAttemptId,
            "studentId": "",
            "buttonObj" : buttonObj
        });
        
        $('body').append($html);        
        
        var ViewPortWidth   =   document.documentElement.clientWidth;
        var tooltipWidth    =   $('.lesson_tooltip').width();
        
        if(left + $(this).width() + tooltipWidth > ViewPortWidth) {
            left =   left - (tooltipWidth / 2) + 30;
            $(".lesson_toolls").find(".page_arrow").css({'left': '+=' + ((tooltipWidth / 2) - 30) + 'px'});
        }        

        $("#itemBubble").css({
           'position' : 'absolute',
           'left' : left + "px",           
           'opacity': 1,
           'top' : top + "px"
        });
        
        if(maxKeys  >=  3) {            
            $(".Tooltip_menu_wrap_inn li").css({'padding': '5px 2px'});
        }
        
        AssignmentContainerView.sendToClass(itemId);
        AssignmentContainerView.withDrawAssignment('column');
        AssignmentContainerView.viewAssignment('column');
        return false;
    });
    
    $(".bodySliderContainer .slider_boxes_ct").off('click tap').on('click tap', function (event) {
		if($("#catInfoBubble").length) {
            $("#catInfoBubble").remove();
        }
        
        if($("#itemBubble").length) {
            var $bubbleItemId   =   $("#itemBubble").data().item;
            var $bubbleStudentId   =   $("#itemBubble").data().student;            
            $("#itemBubble").remove();                            
            if($bubbleItemId == $(this).find(".qs_ans").data().item && $bubbleStudentId == $(this).find(".qs_ans").data().student) {
                return false;
            }
        }
        		
        //  Check If Sprite Is Displaying, Then make It Active And Stop Execution Further
        if($(this).find(".qs_ans").hasClass('sprite')) {
            $(this).find(".qs_ans").trigger('click');
            return false;
        }
		
        // If Sprite is displaying dont show any info bubble
        if($(".qs_ans").hasClass('sprite')) {
            return false;
        }
        
        var sCurrentStatus  =   $(this).find(".statusText").attr('data-text');
		// sCurrentStatus = ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT;
        // If Status Not Sent Then Do Not Open Any Bubble 
        if(sCurrentStatus === '') {
            return false;
        }                        
        
        var objItem =   $(this).find(".qs_ans").data();
        var itemId  =   objItem.item;
        var itemAttemptId  =   objItem.itemattemptid;
		
        if(sCurrentStatus != ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT) {            
            sCurrentStatus  =   sCurrentStatus.split(" ")[0];   //  To Remove The Reassign Number Within Bracket
        }
        
        //  Status = Scored
        if ($(this).find(".qs_ans").attr('data-finalscore') != 0) {
            AssignmentContainerView.infoBubble($(this), objItem, 'scored');
            AssignmentContainerView.withDrawAssignment('cell');
            AssignmentContainerView.viewAssignment('cell');
            return false;
        }
        
        // If Status == Sent || Status == In Progress , Display Bubble
        if (
			sCurrentStatus == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT || 
			sCurrentStatus == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT
		) {
            AssignmentContainerView.infoBubble($(this), objItem, sCurrentStatus);
            AssignmentContainerView.withDrawAssignment('cell');
            AssignmentContainerView.viewAssignment('cell');
            return false;
        }
		
        //  Open Score Popup, If Status is Score
        if (sCurrentStatus === ASSIGNMENT_INSTRUCTOR.c_s_SENT_COMPLETED_TXT) {              
              if($(this).find(".qs_ans").data().finalscore != 0) {
                  return false;
              }              
              
              var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';

              $("#loaderContainer").html(loaderImg).addClass('loaderContainer');
              $("#loaderContainer").show();
              $(".loaderContainerOverlay").show();
       
			studentAttemptData	=	null;
			objAssignmentSlidesJsonData = null;
            GetAttemptDataForGradeableItem(objItem.item, objItem.student, objItem.itemattemptid);
            AssignmentScoreView.getItemDataResponse(objItem.item, objItem.itemattemptid, objItem.student);
			//AssignmentScoreView.init(objItem.item, objItem.student);
            return false;
        }
        
        //  Status = Scored && Final Score == 0
		// var _sScoreHtml     =   $(this).find(".qs_ans").prev().html();
		// var _arrScoreHtml   =   _sScoreHtml.split("/");
		
        if($(this).find(".qs_ans").attr('data-finalscore') == 0) {
            AssignmentContainerView.infoBubble($(this), objItem, 'scored');
            AssignmentContainerView.withDrawAssignment('cell');
            AssignmentContainerView.viewAssignment('cell');
            return false;
        }
        event.stopPropagation();
    });
    
    $(".slider_boxes_title").off('click tap').on('click tap', function () {
        
        AssignmentContainerView.removeBubble();        
        
        if($(".qs_ans").hasClass('sprite')) {
            return false;
        }                
        
        var top     = $(this).offset().top;
        var left    = $(this).offset().left - 75;                        
        
        var objAssignmentCategoryIndex  =   (AssignmentInstructorView.ActiveTab == "assignment") ? 0 : ((AssignmentInstructorView.ActiveTab == "grade") ? 2 : 1);        
        var title   = $(this).data().title;
        var objData = _.where(objAssignmentCategory.content[objAssignmentCategoryIndex], {name: title});        
        
        var $html   =   _.template($("#categoryDetailsBubble").html(),{
            "data" : objData[0]
        });
        
        $('body').append($html);   
        
        var ViewPortWidth    =   document.documentElement.clientWidth;
        var tooltipWidth    =   $('.lesson_tooltip').width(); 
        
        if(left + $(this).width() + tooltipWidth > ViewPortWidth) {
            left =   left - (tooltipWidth / 2) + 30;
            $(".lesson_toolls").find(".page_arrow").css({'left': '+=' + ((tooltipWidth / 2) - 30) + 'px'})
        }
        
        $("#catInfoBubble").css({
           'position' : 'absolute',
           'left' : left + "px",
           'top' : top + "px",
           'opacity': 1
        });
        
        return false;
        
    });
    
    $(document).off('click tap').on('click tap', function (event) {        
        AssignmentContainerView.removeBubble();
        
        /* if(
			!$(event.target).parents('#itemBubble').length && 
			!$(event.target).parents('.headerSliderContainer .slider_boxes_ct').length
		) {
            $("#itemBubble").remove();
        }
        
        if(
			!$(event.target).parents('#catInfoBubble').length && 
			$(event.target).attr('class') != 'slider_boxes_title'
		) {
            $("#catInfoBubble").remove();
        } */
    });        
    
    $(".table_container_assignment").scroll(function() {
        AssignmentContainerView.removeBubble();
    });
    
    
};

/**
 *	Open GLE Score Popup
 */
AssignmentContainerView.toggleGleView = function () {
		
	$(".toggleGleView").off('click').on('click', function (event) {
		
		if(AssignmentInstructorView.refreshStatus == false) {
			return false;
		}
		
		AssignmentContainerView.removeBubble();
	
		event.stopPropagation();
	
		if($("#detailGradeInfoContainer").length) {	// When Collapse
			// $(this).text('E');		
			//$(this).removeClass('active');
			AssignmentContainerView.resetHeaderBox();
			return false;
		}
		
		$(".actionButton").addClass('deactivate');
		$(".assignment_slider_wrapper2 .unit_lesson_set").css({background: "none"});
		$(".assignment_slider_wrapper2.odd .unit_lesson_set").css({background: "#dcf7fa"});
		
		$(this).next('.totGle').css({opacity: 0});
		$(this).addClass('active');
		
		var itemID		=	$(this).siblings('.qs_ans').attr('data-item');
		var arrElem 	= 	$(".table_container_assignment .assignment_slider_wrapper2").not('.class-average'); // IPP-5025
		var aData		=	[];
		var oGradeData	=	AssignmentContainerView.model.GradeData;	
		
		var GradeData		=	[];
		if(objPlatform.isBrowser()) {
			GradeData	=	oGradeData;
		} else {
			for(var GradeDataKey = 0; GradeDataKey < oGradeData.length; GradeDataKey++) {
				//GradeData.push(JSON.parse(objGradeBookJsonData.Content[GradeDataKey]));
				if(typeof oGradeData[GradeDataKey] == "string") {
					GradeData.push(JSON.parse(oGradeData[GradeDataKey]));
				} else {
					GradeData.push(oGradeData[GradeDataKey]);
				}
			}			
		}
			
		var aData	=	[];
		for(var key = 0;  key < arrElem.length; key++) {
			objFilteredData		=	_.where(GradeData, {SID: $(arrElem[key]).find(".studentName").data().id.toString(), IID: itemID});	
			
			var oStudentData	=	(objFilteredData.length == 0) ? '' : objFilteredData[0].IAS;
			oStudentData		=	(oStudentData == '' || oStudentData == null) ? '' : JSON.parse(decodeURIComponent(oStudentData));
			
			var oStatus			=	$(".bodySliderWrapper").find(".qs_ans[data-student='"+$(arrElem[key]).find(".studentName").data().id+"'][data-item='"+itemID+"']").prev('.statusText');
			
			if($.trim(oStatus.text()) == '' || $.trim(oStatus.text()) == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT || $.trim(oStatus.text()) == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT) {
				oStudentData	=	'';
			}
			aData.push(oStudentData);	
		}
				
		
		var $html   =   _.template($("#detailGradeInfo").html(),{data : aData});
		var $htmlHeader   =   _.template($("#detailGradeInfoHeader").html(),{});
		//left: 246px; top: 175px;
		$('.table_container_assignment').prepend($html);
		$('body').append($htmlHeader);
		
		var _topHeader	=	$(".assignment_slider_wrapper").height() + $("header").height() - 50;		
		var _top    =   '0';	//$(".assignment_slider_wrapper").height() + $("header").height() - 52;        
		var _left   =   $(".assignment_slider_wrapper2 .unit_lesson_set").width() + (0 * ($(".slider_boxes_cnt").width() + parseInt($(".slider_boxes_cnt").css('padding-left')) + parseInt($(".slider_boxes_cnt").css('padding-right'))));
		
		$("#detailGradeInfoContainer").css({
		   top: _top,
		   left:_left,
		   opacity:1
		});
		
		$("#detailGradeInfoContainerHeader").css({
		   top: _topHeader,
		   left:_left,
		   opacity:1
		});
		
		$(".slider_boxes_title:eq(0)").width($("#detailGradeInfoContainer").width() - parseInt($(".slider_boxes_title:eq(0)").css('padding-left')) - parseInt($(".slider_boxes_title:eq(0)").css('padding-right')));
		$(".slider_boxes_ct:eq(0)").width($("#detailGradeInfoContainer").width() - parseInt($(".slider_boxes_ct:eq(0)").css('padding-left')) - parseInt($(".slider_boxes_ct:eq(0)").css('padding-right')));
		$(".headerSliderWrapper").css({'overflow': 'visible'});
		$(".headerSliderContainer").css({'width': '100%'});
		$(".qst_content").css({'height': '40px'});
	});
};

AssignmentContainerView.resetHeaderBox	=	function () {	
	
	$(".toggleGleView").removeClass('active');
	$(".toggleGleView").next('.totGle').css({opacity: 1});
	$(".actionButton").removeClass('deactivate');
	if($("#detailGradeInfoContainer").length) {
		$("#detailGradeInfoContainer").remove();
	}
	
	if($("#detailGradeInfoContainerHeader").length) {
		$("#detailGradeInfoContainerHeader").remove();
	}
		
	$(".slider_boxes_title:eq(0)").removeAttr('style');
	$(".slider_boxes_ct:eq(0)").removeAttr('style');
	$(".headerSliderWrapper").css({'overflow': 'hidden'});
	$(".headerSliderContainer").removeAttr('style');
	$(".qst_content").css({'height': '54px'});
	
	$(".assignment_slider_wrapper2 .unit_lesson_set").removeAttr('style');
	$(".assignment_slider_wrapper2.odd .unit_lesson_set").removeAttr('style');
};

AssignmentContainerView.removeBubble = function () {
    
    if($("#itemBubble").length) {
        $("#itemBubble").remove();
    }

    if($("#catInfoBubble").length) {
        $("#catInfoBubble").remove();
    }
};

/**
 * 
 * @param {String} psItemId
 * @returns {undefined}
 */
AssignmentContainerView.sendToClass   =   function (psItemId) {
    
    $(".SendToClass").off('click').on('click', function () {
        
        var iCountCell   =   0;
        var studItems = new Array();  
        var studItemsRef = new Array();  
        var assignObj = {};
        var objInteractiveR =   [];
		var sStudentIds	=	'';
                
        //  For IR
        if($(".headerSliderContainer").find(".qs_ans[data-item='"+psItemId+"']").attr('data-headertype') == 'iwt') {
            $(".qs_ans[data-headertype='iwt']").addClass('sprite active');                
            $("#activateSelection").addClass('active').trigger('click');
        }
        
        //  For Non IR
		var AssignToWholeClass = $(".qs_ans[data-item='"+psItemId+"'][data-itemtype='frs'].disabled").length ? false : true; // if any auto send frs is there
        $(".bodySliderContainer").find(".qs_ans[data-item='"+psItemId+"'][data-itemtype!='iwt']:not('.disabled')").each(function () {
			var objData =   $(this).data();			
            if($(this).prev('.statusText').attr('data-text')  ==  '' && $(this).prev('.statusText').text() == '') {				
				sStudentIds+=	$.trim(objData.student) + ',';
                //studItems.push({"ItemID" : objData.item, "StudentIDs" : $.trim(objData.student), AssignToWholeClass:false});    
                $(this).addClass('noDisplay');
                iCountCell++;
            } else {
				AssignToWholeClass = false;
			}
        });                
        
        if(iCountCell > 0) {
		
			sStudentIds	=	(AssignToWholeClass == true) ? '' : sStudentIds;
			sStudentIds	=	(sStudentIds == '') ? '' : sStudentIds.substring(0, sStudentIds.length-1);
			studItems.push({"ItemID" : psItemId, "StudentIDs" : sStudentIds, AssignToWholeClass:AssignToWholeClass});
			
            assignObj = {"studentItems": studItems};
            var data  = (JSON.stringify(assignObj)).replace(/"/g, '\\"');
            objAssignGradeableItemResponse  =   null;
            AssignmentInstructorView.updateRefreshedContent = false;
            //Native Call
            AssignGradeableItem(data);
			ShowLoader();
            AssignmentContainerView.updateColumnStatus(psItemId);
        }        
    });
};

AssignmentContainerView.updateColumnStatus = function (psItemId) { 

	if(objAssignGradeableItemResponse == null) {
		setTimeout(function () {
			AssignmentContainerView.updateColumnStatus(psItemId);
		}, 200)
	} else {
		HideLoader();
		var oNewElem	=	{};
		$(".bodySliderContainer").find(".qs_ans[data-item='"+psItemId+"']:not('.disabled')").each(function () {			
			
			if($(this).prev('.statusText').data().text  ==  '' && $(this).prev('.statusText').text() == '') {
				
				oNewElem	=	{};
				oNewElem[AssignmentInstructorView.oJsonKeys['IID']]	=	psItemId;
				oNewElem[AssignmentInstructorView.oJsonKeys['SID']]	=	$(this).attr('data-student');
				oNewElem[AssignmentInstructorView.oJsonKeys['IAID']]	=	'-1';	//	This has to be delete after get the 10 sec interval getGradeBookAttemptData With original status
				oNewElem[AssignmentInstructorView.oJsonKeys['ICS']]	=	ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS;
				AssignmentContainerView.model.GradeData.push(oNewElem);				
			
				$(this).prev('.statusText').addClass('gray_col').text(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT);        
				$(this).prev('.statusText').attr({'data-text': ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT});
			}
		});       
		objAssignGradeableItemResponse  =   null;
		setTimeout(function () {
			AssignmentInstructorView.updateRefreshedContent = true;
		}, 10000);
	}    
};

/**
 * View Assignment
 * @param {String} psType Cell||Column
 * @returns {undefined}
 */
AssignmentContainerView.viewAssignment  =   function (psType) {
    
    var sType   =   psType;
    $(".viewButt").off('click').on('click', function () {
		var oData = $(this).data(),
			sCompletionStatus = '',
			sAssignmentType = (AssignmentInstructorView.ActiveTab == 'grade')? 'assessment': AssignmentInstructorView.ActiveTab,
			sAssignmentSubType = $(".bodySliderContainer .qs_ans[data-student='" + oData.student + "'][data-item='" + oData.item + "']").data('itemtype'),
			sItemName = $(".headerSliderContainer .slider_boxes_ct").find(".qs_ans[data-item='" + oData.item +"']").parent().siblings(".qst_content").data("title"),
			sSubTypeMode = '',
			dFinalScore = (parseFloat(oData['finalscore']) || 0);
			
		var sKeyMaxScore = AssignmentInstructorView.oJsonKeys['IMS'],
			sKeyItemId = AssignmentInstructorView.oJsonKeys['IID'],
			sKeyStudentId = AssignmentInstructorView.oJsonKeys['SID'],
			sKeyCompletionStatus = AssignmentInstructorView.oJsonKeys['ICS'];
			
		AssignmentContainerView.iActivePagingIndex = $(".slider_switch.active").index();	
			
		sAssignmentSubType = (
			(
				typeof sAssignmentSubType == 'undefined' ||
				sAssignmentSubType == null
			)?
			$(".headerSliderContainer .qs_ans[data-item='" + oData.item + "']").data('headertype'):
			sAssignmentSubType
		);
		
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
			'&' + POPUP_VIEW.c_s_QUERY_PARAM_ASSIGNMENT_SUB_TYPE + '=' + sAssignmentSubType.trim();
			
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
				GradeData	=	AssignmentContainerView.model.GradeData;
			} else {
				for(var GradeDataKey = 0; GradeDataKey < AssignmentContainerView.model.GradeData.length; GradeDataKey++) {
					if(typeof AssignmentContainerView.model.GradeData[GradeDataKey] == "string") {
						GradeData.push(JSON.parse(AssignmentContainerView.model.GradeData[GradeDataKey]));
					} else {
						GradeData.push(AssignmentContainerView.model.GradeData[GradeDataKey]);
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
			AssignmentInstructorView.refreshStatus = true;
			AssignmentContainerView.removeBubble();
			return false;
		}
		//  If Webclient            
		var $html = _.template($("#viewAssignment").html());
		$("#scorePopupArea").css({'width': '100%', 'height': '100%', 'overflow' : 'hidden'});
		$("#contentArea").hide();
		$("header").hide();
		$("#scorePopupArea").show().html($html);            
		$("#viewAssignmentFrame").attr('src', sURL).load(function () {
			AssignmentContainerView.manageIFrame();
		});
		AssignmentInstructorView.refreshStatus = false;
    });
};

/**
 * Manage Iframe Features And Resize
 * @returns {undefined}
 */

AssignmentContainerView.manageIFrame = function () {
    
    var objIframe   =   $('#viewAssignmentFrame').contents();    
    objIframe.find("#assignmentPrev").off('click').on('click', function (event) {
       event.preventDefault();
       $("#viewAssignmentFrame").attr('src', '');
       $("#scorePopupArea").css({'width': '', 'height': '', 'overflow' : ''});
       $("#contentArea").show();
       $("header").show();
       $("#scorePopupArea").html('').hide();       
       AssignmentInstructorView.refreshStatus = true;	   
	   /* AssignmentContainerView.resize ();    */
	   AssignmentContainerView.updateSliderSize();
       return false;
    });
};

/**
 * 
 * @param {String} psType
 * @returns {undefined}
 */
AssignmentContainerView.withDrawAssignment = function (psType) {
    
    var sType   =   psType;
    $(".withdrawStudeanAssignment").off('click').on('click', function (event) {        
        var itemId  =   $(this).data().item;
        var studentId   = '';
        var itemAttepmtId = '';
		var sStatus = $(this).data('status'); // IPP-365
		var sDisplayStatus = ' that is ' + sStatus; // IPP-365
		var oCell = null,
			sAssignmentType = (AssignmentInstructorView.ActiveTab == 'grade')? 'assessment': AssignmentInstructorView.ActiveTab,
			sVerb = 'may';
		
        switch (sType) {
            case 'cell':
                if (sStatus !== ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT.toLowerCase()) { // IPP-365
					oCell = $(this);
					if (sStatus === 'scored') {
						sVerb = 'may';
						sDisplayStatus = '';
					}
					ShowConfirm(
						'Warning',
						'Withdrawing this ' + sAssignmentType + ' ' + sVerb + ' cause the loss of data for student' + sDisplayStatus + '.',
						function () {
							studentId = oCell.data().student;
							itemAttepmtId = oCell.data().itemattemptid;
							itemId = oCell.data().item;
							if ($(".headerSliderContainer .qs_ans[data-item='"+itemId+"']").hasClass('noDisplay')) {
							   $(".headerSliderContainer .qs_ans[data-item='"+itemId+"']").removeClass('noDisplay') 
							}
							
							var objResult = {"ItemID":itemId, "StudentIDs":studentId, "ItemAttemptIds": itemAttepmtId, UnassignToWholeClass: false};
							AssignmentInstructorView.updateRefreshedContent = false;
							RemoveGradeableItem(objResult);
							ShowLoader();
							AssignmentContainerView.withdrawAssignStatus(objResult);
						}
					);
					return;
				}
				studentId = $(this).data().student;
				itemAttepmtId = $(this).data().itemattemptid;
                itemId = $(this).data().item;
                if ($(".headerSliderContainer .qs_ans[data-item='"+itemId+"']").hasClass('noDisplay')) {
                   $(".headerSliderContainer .qs_ans[data-item='"+itemId+"']").removeClass('noDisplay') 
                }
			break;
            default:
                $(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"']").each(function () {
                    studentId.push($(this).data().student);
					itemAttepmtId.push($(this).data().itemattemptid);
                });
			break;
        }
        
        var objResult = {"ItemID":itemId, "StudentIDs":studentId, "ItemAttemptIds": itemAttepmtId, UnassignToWholeClass: false};
        AssignmentInstructorView.updateRefreshedContent = false;
        RemoveGradeableItem(objResult);
		ShowLoader();
        AssignmentContainerView.withdrawAssignStatus(objResult);
    });
    
    $(".WithdrawFromClass").off('click').on('click', function () {
        var itemId  =   $(this).data().item;
        var isInProgress    =   0;
        $(".bodySliderWrapper .qs_ans[data-item='"+itemId+"']").each(function () {
           if($(this).prev().attr('data-text')  ==  ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT) {
               isInProgress++;
               return false;
           }
        });
        
        if(isInProgress) {
            
           // var sTitle = "Withdraw "+AssignmentInstructorView.ActiveTab;
		   // var sMessage   =    'One or more '+AssignmentInstructorView.ActiveTab+' are in <b>In progress</b>. Do you really want to continue?';
		   /*==== IPP-365: Prashant's Input ====*/
           var sTitle = 'Warning';
		   var sAssignmentType = (AssignmentInstructorView.ActiveTab == 'grade')? 'assessment': AssignmentInstructorView.ActiveTab;
           var sMessage = 'Withdrawing this ' + sAssignmentType + ' may cause the loss of data for students that are in-progress.';
		   /*== End IPP-365: Prashant's Input ==*/
           var confirmTemplate =   _.template($("#confirmationTemplate").html());
           $("body").append(confirmTemplate);
           
           $('#dialog').attr('title', sTitle).html(sMessage).dialog({
                autoOpen:	true,
                resizable: 	false,
                draggable:	true,				
                height: 275,
                width: 450,				
                modal: true,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'gray',
                        click: function () {
                            $(this).dialog('destroy').remove();
                        }
                    },
                    {
                        text: 'Confirm',                        
                        click: function () {
                            AssignmentContainerView.WithdrawFromClass(itemId);
                            $(this).dialog('destroy').remove();
                            return false;
                        }
                    }
                ],
                open: function () {
                    $('.ui-dialog').addClass('Ilit_alert_box');
                }
           });
        } else {
            AssignmentContainerView.WithdrawFromClass(itemId);
        }
    });
};

/**
 * Withdraw Assignment/Assessment [Sent & In Progress] From Entire Column
 * @param {String} psItemId Item Id
 * @returns {undefined}
 */
AssignmentContainerView.WithdrawFromClass = function (psItemId) {
    
    var arrStudent  =   '',
		aItemAttemptId = '';
    $(".bodySliderWrapper .qs_ans[data-item='"+psItemId+"']").each(function () {
        if($(this).prev().attr('data-text') == ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT || $(this).prev().attr('data-text') == ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT) {
            arrStudent += $(this).attr('data-student') + ",";
            aItemAttemptId += $(this).attr('data-itemattemptid') + ",";
        }        
    });
    
    arrStudent  =   arrStudent.slice(0, -1);
    aItemAttemptId  =   aItemAttemptId.slice(0, -1);
    
    var objResult   =   {"ItemID":psItemId, "StudentIDs":arrStudent, "ItemAttemptIds":aItemAttemptId, UnassignToWholeClass: false};
    AssignmentInstructorView.updateRefreshedContent = false;
	RemoveGradeableItem(objResult);
	ShowLoader ();
    AssignmentContainerView.withdrawAssignStatus(objResult);
    
    if($(".headerSliderContainer .qs_ans[data-item='"+psItemId+"']").hasClass('noDisplay')) {
        $(".headerSliderContainer .qs_ans[data-item='"+psItemId+"']").removeClass('noDisplay') 
    }
        
};

AssignmentContainerView.textOverflowControl = function() {
    var originalText,headingText,originalHeight,targetText,heightLimit=51;
	var textLimit = (AssignmentInstructorView.ActiveTab == 'grade') ? 60 : 24; // GLE

    $('.slider_boxes_ct').has('.qst_content').each(function(){  
        
        originalText = $(this).children('.qst_content').text();
        originalHeight = $(this).children('.qst_content').height();
        $(this).children('.qst_content').css('display','block');        

        if(originalText.length>textLimit || originalHeight >= heightLimit){
            targetText = originalText.substr(0,textLimit);
			targetText = (originalText.length <= textLimit) ? targetText : targetText + '...';
            $(this).children('.qst_content:first').text(targetText);
        }

    });
    
    $('.slider_boxes_title').each(function() {      
        
        var widthLimit = 110,textLimit = 10;
        
        var originalText = $(this).data().title;
        var divWidth = $(this).width();
        
        var textWidth   =   $(this).find("span").width();        

        if(originalText.length>textLimit){
            
            if(textWidth >= divWidth) {
                targetText = originalText.substr(0,textLimit)+'...';
                $(this).text(targetText);
            }    
        }
    });
};

AssignmentContainerView.updateAssignStatus = function (passignObj) { 
	
	if(objAssignGradeableItemResponse == null) {
		setTimeout(function () {
			AssignmentContainerView.updateAssignStatus (passignObj);
		}, 200)
	} else {
		
		HideLoader();				
		var aMainData	=	passignObj.studentItems;				
		var oNewElem	=	{};
		
		for(var iKey =0; iKey < aMainData.length; iKey++) {
			oNewElem	=	{};
			oNewElem[AssignmentInstructorView.oJsonKeys['IID']]	=	aMainData[iKey].ItemID;
			oNewElem[AssignmentInstructorView.oJsonKeys['SID']]	=	aMainData[iKey].StudentIDs;
			oNewElem[AssignmentInstructorView.oJsonKeys['IAID']]	=	'-1';	//	This has to be delete after get the 10 sec interval getGradeBookAttemptData With original status
			oNewElem[AssignmentInstructorView.oJsonKeys['ICS']]	=	ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS;
			AssignmentContainerView.model.GradeData.push(oNewElem);				
		}		
		
		//  For IR
		var arrIR   =   _.where(passignObj.studentItems, {type: 'IR'});		
		if(arrIR.length) {       
			
			for(key in arrIR) {								
				$(".table_container_assignment .qs_ans[data-itemtype='iwt'][data-student='"+arrIR[key].StudentIDs+"'][data-item='"+arrIR[key].ItemID+"']").prev().addClass('gray_col').text(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT).attr('data-text', ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT);
			}
		}	
		
		$(".table_container_assignment .qs_ans.active").prev().addClass('gray_col').text(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT).attr('data-text', ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT);
		
		$(".qs_ans.active").parent().removeClass('nopointer');
		
		$(".qs_ans.active").addClass('noDisplay');
		$(".qs_ans.active").removeClass('active sprite');
	//    $(".qs_ans").addClass('noDisplay');
		$("#sendOrCancelSelection").trigger('click');    
		
		AssignmentInstructorView.refreshStatus  =   true;				
		
		//AssignmentContainerView.refreshGradeBookData();
		objAssignGradeableItemResponse	=	null;
		
		// Start: Code commented due to IPP-4614 
		// Following Code block also added
		/* setTimeout(function () {
			AssignmentInstructorView.updateRefreshedContent = true;
		}, 10000); */
		AssignmentInstructorView.updateRefreshedContent = true;
		AssignmentInstructorView.refreshStatus = true;
		//clearInterval(AssignmentInstructorView.refreshInterval);
		AssignmentContainerView.refreshData();
		// End: Code commented due to IPP-4614 
	}    
};

AssignmentContainerView.withdrawAssignStatus = function (pobjResult) {    
	
	if(objWithdrawAssignmentResponse != null) {		
		HideLoader ();
		AssignmentInstructorView.lastGradeBookContent   =   objGradeBookJsonData;	
		//	objGradeBookJsonData    = 0;		
		//	GetGradeBookInfo("Unit", $("#selectedUnit").attr('data-id'), false, null);  		
		var itemId      =   pobjResult.ItemID;
		var strStudent  =   pobjResult.StudentIDs;
		
		if (typeof strStudent == "number") {
			var studentarr  = [];
			studentarr.push(strStudent);
		}
		else {
			var studentarr = strStudent.split(",");
		}
		
		for(var cnt = 0; cnt < studentarr.length; cnt++) {
			
			$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentarr[cnt]+"']").prev(".statusText").attr('data-text', '').html('');            
			$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentarr[cnt]+"']").removeClass('noDisplay');
			
			$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentarr[cnt]+"']").parent().addClass('nopointer');
			
			AssignmentContainerView.model.GradeData 	= _.reject(AssignmentContainerView.model.GradeData, function(obj){ 
																return (obj.IID == itemId && obj.SID == studentarr[cnt]) 
															});
		}
		objWithdrawAssignmentResponse	=	null;
		setTimeout(function () { // IPP-5056
			AssignmentInstructorView.alterGrid4ClassAverage();
		}, 300);
		//AssignmentContainerView.refreshGradeBookData();
		
		setTimeout(function () {
			AssignmentInstructorView.updateRefreshedContent = true;
		}, 10000);
	} else {
		setTimeout(function () {
			AssignmentContainerView.withdrawAssignStatus(pobjResult)
		}, 200);
	}
};

AssignmentContainerView.resizeHeight =  function () {    
    // For Body Height
    var calculatedHeight = $(".wrapper").height() - $("header").height() - $(".slider_wrapper_inr").height() - parseInt($(".slider_wrapper_inr").css('padding-top')) - 2;
    var parentHeight	 = (objPlatform.isBrowser()) ? parent.$(".iframeWrap").height() : $(document).height();
    var domGap           =  parentHeight - $('body').height();
    
    calculatedHeight    =   calculatedHeight + domGap;
    $(".table_container_assignment").height(calculatedHeight);
	
	if(objPlatform.isBrowser()) {		
		setTimeout(function () {
			if(AssignmentInstructorView.ActiveTab == 'grade') {	
				calculatedHeight	=	calculatedHeight - 1;
			}
			else{
				//calculatedHeight	=	parseInt($(".headerSliderWrapper").height()) + calculatedHeight - 1; // commented on 22nd July, 2016 due to height issue
				calculatedHeight	=	calculatedHeight - 1; 
			}
			$(".table_container_assignment").height(calculatedHeight);
		}, 0);
	}
};

/**
 *
 * Refresh Student List 
 * @param {Boolean} isAutoRefreshed - To check if auto refresh happening
 */
AssignmentContainerView.refreshStudentData   = function (isAutoRefreshed) {
    
    if(!AssignmentInstructorView.updateRefreshedContent) {        
        return false;
    }
	try {
		if(objStudentListJsonData != 0) {
			if( objStudentListJsonData.Content.length > 0 ) {   
				//GetGradeBookInfo("Unit", $("#selectedUnit").attr('data-id'), false, null);            
				GetGradebookForInstructorV2("Unit", $("#selectedUnit").attr('data-id'), false, null);
				AssignmentContainerView.model.StudentList	=	objStudentListJsonData.Content;
				for(var key in objStudentListJsonData.Content) {
					
					_studentId      =   objStudentListJsonData.Content[key].UserID;
					_studentLevel   =   objStudentListJsonData.Content[key].UserCurrentReadingLevel;
									
					$(".bodySliderWrapper .qs_ans[data-student='"+_studentId+"']").attr("student-level", _studentLevel);
					$obj            =   $(".bodySliderWrapper .qs_ans[data-student='"+_studentId+"'][data-itemtype='iwt']");
					
					$obj.each(function () {										
						if($(this).attr('header-level') != $(this).attr('student-level')) {
							if($(this).prev().is(':empty')) {
								$(this).prev().addClass('gray_col').text("-");
							}
						}
						else if($(this).attr('header-level') == $(this).attr('student-level')) {                    
							if($(this).prev().text() == '-') {
								$(this).prev().text("");
							}
						} 
					});                
				}
				AssignmentInstructorView.restructuredIR();
				//AssignmentContainerView.refreshGradeBookData();
				AssignmentContainerView.refreshGradeBookAttemptData(isAutoRefreshed);
				if (AssignmentInstructorView.ActiveTab == 'grade') { // IPP-5056
					AssignmentInstructorView.alterGrid4ClassAverage();
				}
			}
		} else {        
			setTimeout(function () {
				AssignmentContainerView.refreshStudentData(isAutoRefreshed);
			}, 400);
		}
	} catch (e) {
	//	Do Nothing
	}
};

AssignmentContainerView.refreshGradeBookAttemptData = function (isAutoRefreshed) {	
	if(objGradeBookV2JsonData != 0) {		
		//var aItemAttemptIds = _.pluck(objGradeBookV2JsonData.Content, 'IAID');					
		var aItemAttemptIds = _.map(objGradeBookV2JsonData.Content.GradeBookData, function (obj) {
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});	
		
		var aFilteredAttemptIds	=	[];
		
		if(isAutoRefreshed) {
			for(var i = 0; i < aItemAttemptIds.length; i++) {		
				
				var aRevId	=	_.where(oAttemptInfo, {IAID: aItemAttemptIds[i].IAID});				
				var revId	=	(aRevId.length == 0) ? '' : aRevId[0].ARID;
				
				if(revId === '') {	//	New Entry					
					oAttemptInfo.push(aItemAttemptIds[i]);
					aFilteredAttemptIds.push(aItemAttemptIds[i]);
				} else if(revId != aItemAttemptIds[i].ARID) {	//	Exists but Updated					
					aFilteredAttemptIds.push(aItemAttemptIds[i]);					
					oAttemptInfo = _.reject(oAttemptInfo, function(obj){ return obj.IAID == aItemAttemptIds[i].IAID; });					
					oAttemptInfo.push(aItemAttemptIds[i]);					
				}
			}
		}
		
		//	Call for Lesson change
		if(!isAutoRefreshed) {
			GetGradebookAttemptData(aItemAttemptIds);
			setTimeout(AssignmentContainerView.refreshGradeBookData, 0);
			return false;
		}
		
		//	Call for Auto refresh
		if(aFilteredAttemptIds.length) {
			GetGradebookAttemptData(aFilteredAttemptIds);
			setTimeout(AssignmentContainerView.refreshGradeBookData, 0);
		}

	} else {
		setTimeout(function () {
			AssignmentContainerView.refreshGradeBookAttemptData(isAutoRefreshed);
		}, 200);
	}
};

AssignmentContainerView.refreshGradeBookData = function () {
    if(objGradeBookJsonData != 0) {		
		
		var GradeData		=	[];
		if(objPlatform.isBrowser()) {
			GradeData	=	objGradeBookJsonData.Content;
		} else {
			for(var GradeDataKey = 0; GradeDataKey < objGradeBookJsonData.Content.length; GradeDataKey++) {
				//GradeData.push(JSON.parse(objGradeBookJsonData.Content[GradeDataKey]));
				if(typeof objGradeBookJsonData.Content[GradeDataKey] == "string") {
					GradeData.push(JSON.parse(objGradeBookJsonData.Content[GradeDataKey]));
				} else {
					GradeData.push(objGradeBookJsonData.Content[GradeDataKey]);
				}
			}			
		}		
		
		for(var key in GradeData) {
			var oElement	=	GradeData[key];
			var oSearchFilter	=	{};
			oSearchFilter[AssignmentInstructorView.oJsonKeys['IAID']]	=	oElement.IAID;
			var aFilter		=	_.where(AssignmentContainerView.model.GradeData, oSearchFilter);
			
			if(aFilter.length == 0) {	//	New Entry				
				AssignmentContainerView.model.GradeData	=	_.reject(AssignmentContainerView.model.GradeData, function (obj) {
					return obj.IAID == "-1";
				});				
				AssignmentContainerView.model.GradeData.push(oElement);				
			} else {	// Update Entry
				AssignmentContainerView.model.GradeData = _.reject(AssignmentContainerView.model.GradeData, function(obj){ 
																	return obj.IAID == oElement.IAID; 
																});	
				AssignmentContainerView.model.GradeData.push(oElement);
			}
		}		
		
        $(".bodySliderContainer .qs_ans").each(function () {
            
            _sDataItemId    =   $(this).data().item;
            _sDataStudId    =   $(this).data().student;
			
			var osearchFilter=	{};
			osearchFilter[AssignmentInstructorView.oJsonKeys['IID']]	=	_sDataItemId.toString();
			osearchFilter[AssignmentInstructorView.oJsonKeys['SID']]	=	_sDataStudId.toString();
                        
            _arrData        =   _.where(GradeData, osearchFilter);                        
            
            if(!_arrData.length) {
                return;
            }                        
            
            _dataFinalScore =   (_arrData[0][AssignmentInstructorView.oJsonKeys['FS']] == null) ? 0 : _arrData[0][AssignmentInstructorView.oJsonKeys['FS']];
            _dataText       =   _arrData[0][AssignmentInstructorView.oJsonKeys['ICS']];
            _dataDisplayText=   _arrData[0][AssignmentInstructorView.oJsonKeys['ICS']];

			var _dataItemAttemptId = _arrData[0][AssignmentInstructorView.oJsonKeys['IAID']];
                        
            if(_dataText != '') {
                _reAssignCnt = (_arrData[0][AssignmentInstructorView.oJsonKeys['RAC']] == 0 || _arrData[0][AssignmentInstructorView.oJsonKeys['RAC']] == null) ? '' : _arrData[0][AssignmentInstructorView.oJsonKeys['RAC']];
            }
                        
            if(_dataText == ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS) {  //  Sent
                _dataText    = ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT;
                _dataText   += (_reAssignCnt == '') ? '' : ' (' + _reAssignCnt + ')' ;
                _dataDisplayText   =   _dataText;                
            }
            else if(_dataText == ASSIGNMENT_INSTRUCTOR.c_i_SCORED_STATUS) {    //  Scored                                
                _dataFinalScore   = _arrData[0][AssignmentInstructorView.oJsonKeys['FS']];
                _dataText = _dataFinalScore;
                				
                _itemSubType    =   _.where(AssignmentContainerView.model.AssignmentData, {ItemID: _arrData[0][AssignmentInstructorView.oJsonKeys['IID']]})[0].ItemSubType;
                _itemSubject    =   _.where(AssignmentContainerView.model.AssignmentData, {ItemID: _arrData[0][AssignmentInstructorView.oJsonKeys['IID']]})[0].ItemSubject;
                
                if(_itemSubType == 'dailyassignment' || _itemSubType == 'iwt') {                                            
                    _dataDisplayText   =   _dataFinalScore + "/" + _arrData[0][AssignmentInstructorView.oJsonKeys['IMS']];
                    //((100 * _dataFinalScore)/objStatus[0].ItemMaxScore).toFixed(0) + "%";
                }
				else if(_itemSubType == 'nsa') {
					_dataDisplayText   =   '<strong class="classGreen" style="color: green;">' + ASSIGNMENT_INSTRUCTOR.c_s_FINISHED_STATUS + '</span>';
				}
				else if (_itemSubType == ASSIGNMENTS.c_s_ASSESSMENT_SUBTYPE_GRADE) {
                    try {
                        var _ItemAttemptSummary =   decodeURIComponent(_arrData[0][AssignmentInstructorView.oJsonKeys['IAS']])
                        var _objSummary         =   $.trim(_ItemAttemptSummary) == '' ? null : JSON.parse(_ItemAttemptSummary);
						_dataDisplayText        =   (_objSummary == null) ? _arrData[0][AssignmentInstructorView.oJsonKeys['FS']] : _objSummary[ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST][ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT];                        
                    } catch (exp) {
                        _dataDisplayText        =   (typeof _objSummary[ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT] == "undefined") ? _arrData[0][AssignmentInstructorView.oJsonKeys['FS']] : _objSummary[ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT];
                    }
					_dataDisplayText        =   _dataDisplayText.toString().replace('<', '&lt;').replace('>', '&gt;');
                    _dataText               =   _dataDisplayText.toString().replace('&lt;', '<').replace('&gt;', '>');
                } 
				else if(
						_itemSubType == "phonictextbasedslide" || 
						_itemSubType == "extendedphonic" || 
						_itemSubType == "frs"  
				) {
					//_dataDisplayText   =   _dataFinalScore + "/100";
					if(_itemSubject == "pktof"){
						_dataDisplayText   =   _dataFinalScore + "/100";
					}
					else {
						_dataDisplayText   = _dataFinalScore + "/" + _arrData[0][AssignmentInstructorView.oJsonKeys['IMS']];
					}
				}
				else {                        
                    _dataDisplayText   =   _dataFinalScore + "/" + _arrData[0][AssignmentInstructorView.oJsonKeys['IMS']];
                }                                 
            }
            else if(_dataText == ASSIGNMENT_INSTRUCTOR.c_i_COMPLETE_STATUS) {    //   Completed
                
                _itemType           =   _arrData[0].ItemType				
				_itemSubType        =   _.where(AssignmentContainerView.model.AssignmentData, {ItemID: _arrData[0][AssignmentInstructorView.oJsonKeys['IID']]})[0].ItemSubType;

                _dataFinalScore   =   _arrData[0][AssignmentInstructorView.oJsonKeys['FS']];                       

                if(_itemSubType == "studyplan" || _itemType == "assessment") {                        
                    _dataText         = _dataFinalScore;
                    _dataDisplayText =   _dataText + "/" + _arrData[0][AssignmentInstructorView.oJsonKeys['IMS']];                    
                } else {                    
                    _dataFinalScore   =   0;
                    _dataText          = ASSIGNMENT_INSTRUCTOR.c_s_SENT_COMPLETED_TXT;
                    _dataDisplayText   =   '<strong class="classRed">' + _dataText + '</strong>';                    
                }
            }
            else if(_dataText == ASSIGNMENT_INSTRUCTOR.c_i_PROGRESS_STATUS || _dataText == 'in+progress') {   // In Progress                    
                _dataText = ASSIGNMENT_INSTRUCTOR.c_s_PROGRESS_ASSIGNMENT_TXT;
                _dataDisplayText   =   _dataText;                            
            }
			else if(_dataText == ASSIGNMENT_INSTRUCTOR.c_s_DELETED_STATUS) {
				_dataText = "";
				_dataDisplayText   =   "";
			}
            
            _dataFinalScore   =   (_dataFinalScore == null) ? 0 : _dataFinalScore;  

			$(this).attr('data-finalscore', _dataFinalScore);
			$(this).data('itemattemptid', _dataItemAttemptId);
			$(this).prev().attr('data-text', _dataText);
			$(this).prev().html(_dataDisplayText);
			if($(this).prev().text() != '') {
				$(this).prev().addClass('gray_col');
			}
            
			if(
				/* _dataText == ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS ||  */
				_dataText == ASSIGNMENT_INSTRUCTOR.c_s_DELETED_STATUS 
			) {
				$(this).parent().addClass("nopointer");
			}
        });
        AssignmentInstructorView.restructuredIR();
		if (AssignmentInstructorView.ActiveTab == 'grade') { // IPP-5056
			AssignmentInstructorView.alterGrid4ClassAverage();
		}
        return false;             
    } else {
        setTimeout(function () {
            AssignmentContainerView.refreshGradeBookData();
        }, 400);
    }
};

/**
 * $(this) Object
 * @param {Object} $obj
 * @param {Object} objItem
 * @param {String} psStatus
 * @returns {undefined}
 */
AssignmentContainerView.infoBubble = function ($obj, objItem, psStatus) {
    var sStatus = psStatus || '';
    var itemId  =   objItem.item;
    var top     = $obj.offset().top + 50;
    var left    = (AssignmentInstructorView.ActiveTab == 'grade')? $obj.offset().left - 25 : $obj.offset().left - 75;

    var objData     = _.where(AssignmentInstructorView.model.AssignmentData, {ItemID: itemId});
    var $buttonObj  = {
        "0" : {
            class: "viewButt",
            text: ASSIGNMENT_INSTRUCTOR.c_i_VIEW_BUTTON
        },
        "1" : {
            class: "withdrawStudeanAssignment",
            text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
        }
    };
    
    if(sStatus  ==  'scored' && AssignmentInstructorView.ActiveTab == 'assignment') {
        delete $buttonObj["1"];
    }
	
	if(sStatus  ==  ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT) {
		var $buttonObj  = {
			"0" : {
				class: "withdrawStudeanAssignment",
				text: ASSIGNMENT_INSTRUCTOR.c_i_WITHDRAW_BUTTON
			}
		};
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
    if(top + $obj.height() + tooltipHeight > ViewPortHeight) {
        $('#itemBubble').addClass('btm_tooltip');
        top =   top - $obj.height() - tooltipHeight;
    }

    //  Update Left For Extreme Left Tooltip
    if(left + $obj.width() + tooltipWidth > ViewPortWidth) {
        left =   left - (tooltipWidth / 2) + 30;
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

AssignmentInstructorView.restructuredIR =   function () {
    
    var arrStudent  =   [];
    
    $(".bodySliderContainer .qs_ans[data-itemtype='iwt']").each(function () {
        if($(this).attr('header-level') != $(this).attr('student-level')) {
            if($(this).prev().is(':empty')) {
                $(this).prev().addClass('gray_col').text("-");
            }
            arrStudent.push($(this).attr('data-student'));
        }
    });
    
    if(arrStudent.length) {        
        $.unique(arrStudent);
        for(var key = 0; key < arrStudent.length; key++) {            			
            flag	=	1;
            $(".bodySliderContainer .qs_ans[data-itemtype='iwt'][data-student='"+arrStudent[key]+"']").each(function () {
                    if($(this).prev().attr('data-text') != '' && flag) {
                            flag	=	0;
                            $(".bodySliderContainer .qs_ans[data-itemtype='iwt'][data-student='"+arrStudent[key]+"'][data-item!='"+$(this).attr('data-item')+"'][data-finalscore='0']").prev().addClass('gray_col').text("-");				
                    }
            });
        }
    }
    
};


//  #####################################   Score Popup    #####################################

function AssignmentScoreView () {};

AssignmentScoreView.bPKTScoreStatus = false;
AssignmentScoreView.oPKTScore = null;

/**
 * Get Item Object
 * @param {String} psItemId    Item Id
 * @param {String} psStudentId Student Id
 * @returns {None}
 */
AssignmentScoreView.getItemDataResponse =   function (psItemId, psItemAttemptId, psStudentId) {
    if(studentAttemptData !== null) {
		//studentAttemptData  =   JSON.parse(decodeURI(studentAttemptData).replace(/(\\r|\\n|\s*)/g, ''));
        if(studentAttemptData.Status    ==  200) {
            var sItemType   =   AssignmentScoreView.digJson(studentAttemptData, 'itemType');  //studentAttemptData.Content[0].StudentAttemptData.itemType;            
            GetAssignmentSlidesInfo(psItemId, sItemType);
            AssignmentScoreView.getItemDetailsResponse(psItemId, psItemAttemptId, sItemType, psStudentId);
        }
    } else {
        setTimeout(function () {
            AssignmentScoreView.getItemDataResponse(psItemId, psItemAttemptId, psStudentId);
        }, 500);
    }
};

/**
 * Get File Path Details & Load Js File
 * @param {String} psItemId     Item Id
 * @param {String} psItemType   Item Type
 * @param {String} psStudentId  Student Id
 * @returns {undefined}
 */
AssignmentScoreView.getItemDetailsResponse  =   function (psItemId, psItemAttemptId, psItemType, psStudentId) {
    // objAssignmentSlidesJsonData =   {jsPath: 'assignment-content/ilit/curriculum/gr8/ee8990604ed04081af15ae45c9b50e2d/ee8990604ed04081af15ae45c9b50e2d.js'};    
    if(objAssignmentSlidesJsonData !== null) {        
        // loadJS(objAssignmentSlidesJsonData.jsPath);
		loadJS(objAssignmentSlidesJsonData.jsPath, function () {
			AssignmentScoreView.init(psItemId, psItemAttemptId, psStudentId);
		});
        // setTimeout(function () {
            // AssignmentScoreView.init(psItemId, psStudentId);
        // }, 300);
    } else {
        setTimeout(function () {
            AssignmentScoreView.getItemDetailsResponse(psItemId, psItemAttemptId, psItemType, psStudentId);
        }, 500);
    }
};

/**
 * 
 * @param {String} psItemId
 * @param {String} psStudentId
 * @returns {None}
 */
AssignmentScoreView.init = function (psItemId, psItemAttemptId, psStudentId) {

    var oScore 			= this,
		objModel 		= oScore.prepareModel(psItemId, psItemAttemptId, psStudentId),
		scoreTemplate 	= _.template($("#scoreTemplate").html(), {objModel: objModel});
		
    $("#scorePopupArea").html(scoreTemplate);
	$(".score-modal").width($("#contentArea").width());
    
	$("#contentArea").hide();
	oScore.resize();
	
	$("#scorePopupArea").show();
	
    $(".loaderContainerOverlay").removeAttr('style');
    $("#loaderContainer").html('').hide();
    $("#loaderContainer").removeClass('loaderContainer');
        
	oScore.resize();
	window.onresize = function () {
        oScore.resize();
    };
    
    //  Rubric Max Score Plotting
    if(objModel.assignmentType == "dailyassignment" || objModel.assignmentType == "iwt") {
        if($(".circle_area_container .circle_page").length) {
            var maxRubric   =   0;
            $("li.param").each(function () {
                maxRubric  +=   parseInt($(this).find(".circle_page:last").attr('data-value'));
            });
            $("#maxRubric").html(maxRubric);
        }
    } else {
        $(".updateRubric-content").remove();
    }
	  
    oScore.bind(objModel); // IPP-5024
	
	if(
		objModel.assignmentType == "phonictextbasedslide" || 
		objModel.assignmentType == "extendedphonic" || 
		objModel.assignmentType == "frs"
	) {
		oScore.bindAudio();

		$('.grading_page_btn_box button').eq(0).attr("disabled", true).addClass("disabled");
		$('#acceptScore').attr("disabled", true).addClass("disabled");
		
		oScore.callOralFluencyGetScoreData(objModel);
	};
	
    AssignmentInstructorView.refreshStatus = false;
};

AssignmentScoreView.callOralFluencyGetScoreData = function (objModel) {
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

AssignmentScoreView.multipleOralFluencyGetScoreData = function(assignmentType, aPktData, piQuestionIndex) {
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

AssignmentScoreView.checkOralFluencyGetScoreData = function(assignmentType, questionId) {
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

AssignmentScoreView.performActionWithPKTResponse = function (pktResponse, assignmentType, questionId) {
	
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

AssignmentScoreView.buttonVisibility4OralFluency = function (assignmentType) {
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

AssignmentScoreView.bindRadioButton = function(questionId) {
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

AssignmentScoreView.bindAudio = function() {
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


AssignmentScoreView.resize = function () {
    
//    var calculateLeftPanelHeight   =   parseInt($(".grading_page_container_lft").height()) + parseInt($(".grading_page_container_lft").css('padding-top')) + parseInt($(".grading_page_container_lft").css('padding-bottom'));
//    $(".grading_page_container_rght").height(calculateLeftPanelHeight);
//    
//    var scoreTemplateHeight =   document.documentElement.clientHeight - $(".score-modal .header").height() - parseFloat($("#scoreContentWrapper").css('padding-top')) - parseFloat($("#scoreContentWrapper").css('padding-top'));    
//    $("#scoreContentWrapper").height(scoreTemplateHeight);
//    
//    $(".studentResponse").width(parseInt($(".grading_page_container_lft.left").width()) - parseInt($(".grading_page_container_lft.left").css('padding-left')) - parseInt($(".grading_page_container_lft.left").css('padding-right')));
    
    
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
 * Prepare Data Model For Score View
 * @param {String} psItemId
 * @param {String} psStudentId
 * @returns {undefined}
 */
AssignmentScoreView.prepareModel    =   function (psItemId, psItemAttemptId, psStudentId) {
    
    var objDataModel    =   {};
    
    var _systemScore, _displayText, _prompt, _studentResponse, _rubric, _rubricSelection, _overAllScore = null;
    
    objDataModel.itemId                 =   psItemId;
    objDataModel.itemAttemptId          =   psItemAttemptId;
    objDataModel.studentId              =   psStudentId;
    objDataModel.assignmentType         =   objAssignmentData.assignmentType;
    _systemScore                        =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');  
    objDataModel.systemScore            =   (_systemScore != null && _systemScore > 0) ? _systemScore : null;    
    objDataModel.showScore              =   true;    
    
    switch (objAssignmentData.assignmentType) {
        case 'iwt':            
            objDataModel.showScore      =   false;
            _displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
			var arrKeys					=	Object.keys(objAssignmentData.slides).map(function(item) { return parseInt(item, 10);});
			var _KeyLength  			=   arrKeys.sort(function (a, b) {return a - b}).pop();
            objDataModel.prompt         =   objAssignmentData.slides[_KeyLength].question;
            var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);            
            var objSlides               =   (objStudentResponse == null) ? null : AssignmentScoreView.digJson(objStudentResponse, 'itemSlides');              
            var slide                   =   (objSlides  ==   null )? null : objSlides[Object.keys(objAssignmentData.slides).length - 1];            
            _studentResponse            =   AssignmentScoreView.digJson(slide, 'answer');  
            objDataModel.studentResponse=   (_studentResponse == null) ? '' : '<p>' + decodeURIComponent(_studentResponse).replace(/\n/g, '<br />') + '</p>';//studentAttemptData.slides[Object.keys(objAssignmentData.slides).length].answer;
            var _keys                   =   Object.keys(objAssignmentData.slides).map(function(item) { return parseInt(item, 10);});            
            var _length                 =   _keys.sort(function (a, b) {return a - b}).pop();
            _rubric                     =   objAssignmentData.slides[_length].rubric;//objAssignmentData.slides[Object.keys(objAssignmentData.slides).length].rubric;                        
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   AssignmentScoreView.digJson(studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;;
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : _overAllScore;
            break;
        case 'paragraph':             
            _displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            _prompt                     =   AssignmentScoreView.digJson(objAssignmentData, 'prompt');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;
            var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');   
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);            
            _studentResponse            =   AssignmentScoreView.digJson(objStudentResponse, 'para');//(objStudentResponse == null)? null : AssignmentScoreView.digJson(objStudentResponse, 'paragraph');
            objDataModel.studentResponse=   (_studentResponse == null) ? null : '<p>' + decodeURIComponent(_studentResponse).replace(/\n/g, '<br />') + '</p>';            
            _rubric                     =   AssignmentScoreView.digJson(objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   AssignmentScoreView.digJson(studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
            break;
        case 'essay': 
            _displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            _prompt                     =   AssignmentScoreView.digJson(objAssignmentData, 'prompt');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;
            var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');   
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);  
            var intro                   =   AssignmentScoreView.digJson(objStudentResponse, 'intro');
            var body                    =   AssignmentScoreView.digJson(objStudentResponse, 'body');
            var conclusion              =   AssignmentScoreView.digJson(objStudentResponse, 'conclusion');
            _studentResponse            =   intro   ==  null ? '' : '<p>'+decodeURIComponent(intro).replace(/\n/g, '<br />')+'</p>';
            _studentResponse           +=   body    ==  null ? '' : '<p>'+decodeURIComponent(body).replace(/\n/g, '<br />')+'</p>';
            _studentResponse           +=   conclusion    ==  null ? '' : '<p>'+decodeURIComponent(conclusion).replace(/\n/g, '<br />')+'</p>';
            objDataModel.studentResponse=   _studentResponse;
            objDataModel.studentResponse=   objDataModel.studentResponse.replace(/\’/g, '&#39;').replace(/\'/g, '&#39;').replace(/\“/g, '&#34;').replace(/\”/g, '&#34;');
            _rubric                     =   AssignmentScoreView.digJson(objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
             _rubricSelection            =   AssignmentScoreView.digJson(objStudentResponse, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
            break;
        case 'dailyassignment': 
            objDataModel.showScore      =   false;
            _displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   _displayText == null ? '' :_displayText; 
            _prompt                     =   AssignmentScoreView.digJson(objAssignmentData, 'teacher_text');
            objDataModel.prompt         =   _prompt == null ? '' : _prompt;      
            var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n').replace(/\\\\/g, '\\');
            var objStudentResponse      =   (typeof studentResponse != 'object' && studentResponse == null) ? null : JSON.parse(studentResponse);                        
            _studentResponse            =   AssignmentScoreView.digJson(objStudentResponse, 'answer');                        
//            _studentResponse            =   AssignmentScoreView.digJson(studentAttemptData, 'answer');
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
            _rubric                     =   AssignmentScoreView.digJson(objAssignmentData, 'rubric');
            objDataModel.rubric         =   (_rubric == null) ? null : _rubric;
            _rubricSelection            =   AssignmentScoreView.digJson(studentAttemptData, 'traits');
            objDataModel.rubricSelection=   (_rubricSelection == null) ? null : _rubricSelection;   //(typeof studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits == "undefined") ? null : studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits;
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : _overAllScore;  //(typeof studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.overallScore == "undefined") ? null : studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.overallScore;
            break;
			
		case 'phonictextbasedslide': 
		case 'extendedphonic': 
			_displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
			
            var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
			
            var objStudentResponse      =   (studentResponse == null) ? null : (
												(typeof studentResponse != 'object') ? JSON.parse(studentResponse) : studentResponse
											);
            _studentResponse            =   AssignmentScoreView.digJson(objStudentResponse, 'oralFluencyData');
			_studentResponse 			=   (_studentResponse == null) ? null : (
												(typeof _studentResponse != 'object') ? JSON.parse(decodeURIComponent(_studentResponse)) : _studentResponse
											);
            objDataModel.studentResponse=   _studentResponse;
            
            objDataModel.rubric         =   null;
            
            objDataModel.rubricSelection=   null;
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
			var _PKTOralFluencyScore 		= 	null;
			objDataModel.PKTOralFluencyScore = _PKTOralFluencyScore;
			break;
		
		case 'frs': 
			_displayText                =   AssignmentScoreView.digJson(objAssignmentData, 'displayText');
            objDataModel.displayText    =   (_displayText == null) ? '' : _displayText;
            
			var studentResponse         =   AssignmentScoreView.digJson(studentAttemptData, 'StudentAttemptData');
            studentResponse             =   studentResponse.replace(/\n/g, '\\n');
            
			var objStudentResponse      =   (studentResponse == null) ? null : (
													(typeof studentResponse != 'object') ? JSON.parse(studentResponse) : studentResponse
											);
            _studentResponse            =   AssignmentScoreView.digJson(objStudentResponse, 'oralFluencyData');
			_studentResponse 			=   (_studentResponse == null) ? null : (
												(typeof _studentResponse != 'object') ? JSON.parse(decodeURIComponent(_studentResponse)) : _studentResponse
											);
			objDataModel.studentResponse= (_studentResponse == null) ? null : _.groupBy(_studentResponse, function(obj) {return obj.parts});
            
            objDataModel.rubric         =   null;
            objDataModel.rubricSelection=   null;
			
            _overAllScore               =   AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
            objDataModel.overAllScore   =   (_overAllScore == null) ? null : parseInt(_overAllScore);
			
			var _PKTOralFluencyScore 	= 	AssignmentScoreView.digJson(studentAttemptData, 'PKTOralFluencyScore');
			_PKTOralFluencyScore 		= 	(_PKTOralFluencyScore == null) ? null : JSON.parse(decodeURIComponent(_PKTOralFluencyScore));
			objDataModel.PKTOralFluencyScore = (_PKTOralFluencyScore == null) ? null : _PKTOralFluencyScore;
			
			break;
		
        case 'default':
            //  Do Nothing
            break;
        
    };    
    return objDataModel;
};

AssignmentScoreView.bind    =   function (poModel) { // IPP-5024
	var oScore = this,
		sAssignmentType = poModel.assignmentType;
	
    oScore.closeScoreTemplate();
    oScore.manageBoxes(sAssignmentType);
    oScore.manageScore();
    oScore.reScore();
    oScore.focusCommentBox();
	
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

AssignmentScoreView.closeScoreTemplate  =   function () {
    
    $("#btnCloseModal").off('click tap').on('click tap', function () {                        
        $("#scorePopupArea").html('').hide();
        $("body").css({'overflow':'auto'});
        $("#contentArea").show();                        
        AssignmentInstructorView.refreshStatus = true;
    });    
};

AssignmentScoreView.manageBoxes   =   function () {
    
    //  Show Boxes
    $('.grading_page_btn_box button').off('click tap').on('click tap', function () {
        var iIndex  =   $(this).index();
		
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
    
    //  Hide Boxes
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

AssignmentScoreView.manageScore     =   function () {

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

AssignmentScoreView.reScore =   function () {
    
    $("#btnReassign").off('click').on('click', function () {        
        
		//console.log(AssignmentScoreView.aPKTScore);
		
		var itemId              =   $("#scoreContainer").data().item;
        var itemAttemptId       =   $("#scoreContainer").data().itemattemptid;
        var studentId           =   $("#scoreContainer").data().student;
        var itemType           	=   $("#scoreContainer").data().itemtype;
		
		// var comment             =   $("#comments").val().replace(/\'/g, '&#39;');
        var comment             =   encodeURIComponent($("#comments").val().replace(/\'/g, '&#39;').replace(/\"/g, '&#34;'));
		
        var bReAssignStatus     =   true;
        var sCompletionStatus   =   ASSIGNMENT_INSTRUCTOR.c_i_ASSIGN_STATUS;                        
        
		if (
			itemType == "phonictextbasedslide" || 
			itemType == "extendedphonic" || 
			itemType == "frs" 
		) {
			var aPKTOralFluencyResults = [];
			$.each(AssignmentScoreView.oPKTScore, function (Idx,Val) {
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
		
		/* Start: Commented by Somnath De @ the time of developing Oral Fluency PKT */
        // var objResponse         =   studentAttemptData.Content[0];
        // objResponse.StudentAttemptData.reAssignedStatus  =   bReAssignStatus;
        // objResponse.CompletionStatus    =   sCompletionStatus;
        // objResponse.Comment     =   comment;
        
        // var systemScore         =   typeof objResponse.SystemScore == 'undefined' ? 0 : objResponse.SystemScore;
        // var finaleScore         =   typeof objResponse.FinalScore  == 'undefined' ? 0 : objResponse.FinalScore;
        /* End: Commented by Somnath De @ the time of developing Oral Fluency PKT */
		
        AssignmentInstructorView.updateRefreshedContent = false;
        
		// SetAttemptData(itemId, objResponse, systemScore, finaleScore, sCompletionStatus, comment, studentId, serviceCall);
        ReAssignGradableItem(itemId, itemAttemptId, studentId, comment, sPKTOralFluencyResults);
		ShowLoader();
		
		var ReAssignInterval	=	setInterval (function () {
			if(objReAssignGradableItem != null) {
				var countReassign   =   $(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").data().reassign;
				if(countReassign != '') {
					countReassign   =   parseInt(countReassign);
					countReassign++;
				} else {
					countReassign   =   1;
				}
				
				$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").attr('data-text', ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT).html(ASSIGNMENT_INSTRUCTOR.c_s_SENT_ASSIGNMENT_TXT + ' (' + countReassign + ')');
				$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").attr('data-reassign',countReassign);
				$("#btnCloseModal").trigger('click');
				
				
				// Start: Code commented due to IPP-4614 i.e. Status change display issue when IR is reassigned - Breaks functionality.
				// Following Code block also added
				
				/* setTimeout(function () {
					AssignmentInstructorView.updateRefreshedContent = true;      
				}, 12000); 
				
				objReAssignGradableItem	=	null;
				clearInterval(ReAssignInterval);
				HideLoader(); */
				
				objReAssignGradableItem	=	null;
				clearInterval(ReAssignInterval);
				AssignmentInstructorView.updateRefreshedContent = true;
				AssignmentInstructorView.refreshStatus = true;
				//clearInterval(AssignmentInstructorView.refreshInterval);
				AssignmentContainerView.refreshData();
				HideLoader();
				// End: Code commented due to IPP-4614 i.e. Status change display issue when IR is reassigned - Breaks functionality.
			}
		}, 300);
        
    });
    
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
        var _mainObj        =   AssignmentScoreView.digJson(studentAttemptData, 'traits');
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
                    var objItemDetails  =   _.where(AssignmentInstructorView.model.AssignmentData, {ItemID: itemId})[0];
                    var sItemType       =   objItemDetails.ItemType;
                    var sItemSubType    =   objItemDetails.ItemSubType;
                    var totScorePercentage = 0;
                    var rubricTotScore  =   0;
                    
                    var wordCount             = 0;
                    var InstructorScoreRubric = '';
                    var rubricMaxScore        = $(".param").find(".circle_page").length;                    
					
					var osearchFilter=	{};
					osearchFilter[AssignmentInstructorView.oJsonKeys['IID']]	=	itemId.toString();
					osearchFilter[AssignmentInstructorView.oJsonKeys['SID']]	=	studentId.toString();
					
					var aTempGradeData	=	[];
					if(!objPlatform.isAndroid() && !objPlatform.isWindows()) {
						aTempGradeData	=	AssignmentInstructorView.model.GradeData;
					} else {
						for(var GradeDataKey = 0; GradeDataKey < AssignmentInstructorView.model.GradeData.length; GradeDataKey++) {
							if(typeof AssignmentInstructorView.model.GradeData[GradeDataKey] == "string") {
								aTempGradeData.push(JSON.parse(AssignmentInstructorView.model.GradeData[GradeDataKey]));
							} else {
								aTempGradeData.push(AssignmentInstructorView.model.GradeData[GradeDataKey]);
							}
						}								
					}
					AssignmentInstructorView.model.GradeData	=	aTempGradeData;
					
                    var objGradeBookDetails=  _.where(AssignmentInstructorView.model.GradeData, osearchFilter)[0];					
                    var objStudentDetails   = _.where(AssignmentInstructorView.model.StudentList, {UserID: studentId})[0];					
                    
                    if(objAssignmentData.assignmentType == "iwt") {
                        rubricTotScore  =   totScore;
                        totScore = totScore + parseFloat(_iwtSystemScore);                                                
                    }                                        
                    
                    if(objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IAS']] != '' && objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IAS']] != null) {						
                        var objItemAttemptSummary = JSON.parse(decodeURIComponent(objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IAS']]));
                        
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
                    
                    if(objItemDetails.ItemSubType == 'paragraph') {                        
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
                    AssignmentInstructorView.updateRefreshedContent = false;                    
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
						if(objScoreForGradeableItem != null) {
							
							/*	Update Status in Model Grade Data Until The Next GetGradeBookAttemptData get Called		*/
							//	Fetch Updated Element
							var oGradeScoredData	=	_.where(AssignmentContainerView.model.GradeData, osearchFilter)[0];
							//	Remove It From Main Data Model
							AssignmentContainerView.model.GradeData 	= _.reject(AssignmentContainerView.model.GradeData, function(obj){ 
																return (obj.IID == itemId && obj.SID == studentId) 
															});							
							//	Change the value manually of Updated Element
							oGradeScoredData['ICS']	=	'scored';
							oGradeScoredData['FS']	=	totScore;							
							AssignmentContainerView.model.GradeData.push(oGradeScoredData);							
							/*	-----------------------------------------------------------------------------------		*/
							
							$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").attr('data-text', totScore);
							displayTotscore       = 0;
							try {
								displayTotscore   =   totScore + "/" + objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IMS']];
							} catch (exp) {
								console.log('No objGradeBookDetails For ', {ItemID: itemId, StudentID: studentId});
							}
							
							AssignmentInstructorView.lastGradeBookContent   =   objGradeBookJsonData;
							AssignmentInstructorView.lastStudentContent     =   objStudentListJsonData;
							
							//  Calculate Lexile Level For Student
							if(
								objItemDetails.ItemSubType == 'iwt' && 
								objItemDetails.ExtraPractice == 'No' 
							) {
								//GetUserSettings();
								GetUserLevel(studentId);
								AssignmentScoreView.calculateLexileLevel(
									itemId, 
									studentId, 
									totScore, 
									objStudentDetails.UserCurrentReadingLevel, 
									objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IMS']], 
									totScorePercentage, 
									function () {
										$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").html(displayTotscore);
										$("#btnCloseModal").trigger('click');
										$('#dialog').dialog('destroy').remove();
										AssignmentInstructorView.updateRefreshedContent = true;      
										AssignmentInstructorView.refreshStatus = true;
										objScoreForGradeableItem = null;
										
										//clearInterval(AssignmentInstructorView.refreshInterval);
										AssignmentContainerView.refreshData("AfetrLexileLevelCalculation");
										
										HideLoader();
									}
								);
								clearInterval(ScoreInterval);
								return;
							}
							
							$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").html(displayTotscore);
							$("#btnCloseModal").trigger('click');
							$this.dialog('destroy').remove();
							
							setTimeout(function () {
								AssignmentInstructorView.updateRefreshedContent = true;      
							}, 12000);
							
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
		var itemType           	=   $("#scoreContainer").data().itemtype;
		
        var _mainObj        =   AssignmentScoreView.digJson(studentAttemptData, 'traits');
        var mainObj         =   (_mainObj == null) ? null:  _mainObj; //studentAttemptData.Content[0].StudentAttemptData.itemSlides[0].slideScore.essayScore.traits;
        var objTrait        =   (typeof mainObj == "undefined") ? null : mainObj; 
        
        var arrRubric4Matrix=   {4:100, 3:88, 2:75, 1:60, 0:55};
        var arrRubric6Matrix=   {6:100, 5:92, 4:85, 3:75, 2:70, 1:60};
		
        var objItemDetails      =   _.where(AssignmentInstructorView.model.AssignmentData, {ItemID: itemId})[0];
		
		if (
			itemType == "phonictextbasedslide" || 
			itemType == "extendedphonic" ||  
			itemType == "frs" 
		) {
			var maxScore 	= parseFloat(objItemDetails.MaxScore),
				systemScore = parseFloat(AssignmentScoreView.digJson(studentAttemptData, 'SystemScore')),
				iScore 		= ((systemScore/maxScore) * 100),
				iAccuracy 	= 0,
				iCnt 		= 0,
				outOf		= 100,
				aPKTOralFluencyResults = [];
				//if (Val.pktStatus == "SCORE") {
				$.each(AssignmentScoreView.oPKTScore, function (Idx,Val) {
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
			totScore            =    AssignmentScoreView.digJson(studentAttemptData, 'SystemScore');
			var outOf           =   parseInt($(".param:last").find(".circle_page").not('.scoring-guide-info').length); // IPP-5025
			var sTitle = "You scored this assignment " + parseInt(totScore) + " out of " + outOf;
        }
		
		//var sTitle = "You scored this assignment " + parseInt(totScore) + " out of " + outOf,
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
                    //var objItemDetails      =   _.where(AssignmentInstructorView.model.AssignmentData, {ItemID: itemId})[0];
					
					var aTempGradeData	=	[];
					if(!objPlatform.isAndroid() && !objPlatform.isWindows()) {
						aTempGradeData	=	AssignmentInstructorView.model.GradeData;
					} else {
						for(var GradeDataKey = 0; GradeDataKey < AssignmentInstructorView.model.GradeData.length; GradeDataKey++) {
							if(typeof AssignmentInstructorView.model.GradeData[GradeDataKey] == "string") {
								aTempGradeData.push(JSON.parse(AssignmentInstructorView.model.GradeData[GradeDataKey]));
							} else {
								aTempGradeData.push(AssignmentInstructorView.model.GradeData[GradeDataKey]);
							}
						}								
					}
					AssignmentInstructorView.model.GradeData	=	aTempGradeData;
					
					var osearchFilter=	{};
					osearchFilter[AssignmentInstructorView.oJsonKeys['IID']]	=	itemId.toString();
					osearchFilter[AssignmentInstructorView.oJsonKeys['SID']]	=	studentId.toString();
                    var objGradeBookDetails = _.where(AssignmentInstructorView.model.GradeData, osearchFilter)[0];     
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
                    
                    AssignmentInstructorView.updateRefreshedContent = false;
                    
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
									displayTotscore   =   totScore + "/" + objGradeBookDetails[AssignmentInstructorView.oJsonKeys['IMS']];
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
							var oGradeScoredData	=	_.where(AssignmentContainerView.model.GradeData, osearchFilter)[0];
							//	Remove It From Main Data Model
							AssignmentContainerView.model.GradeData 	= _.reject(AssignmentContainerView.model.GradeData, function(obj){ 
																return (obj.IID == itemId && obj.SID == studentId) 
															});							
							//	Change the value manually of Updated Element
							oGradeScoredData['ICS']	=	'scored';
							oGradeScoredData['FS']	=	totScore;							
							AssignmentContainerView.model.GradeData.push(oGradeScoredData);							
							/*	-----------------------------------------------------------------------------------		*/
							
							
							$(".bodySliderContainer").find(".qs_ans[data-item='"+itemId+"'][data-student='"+studentId+"']").prev(".statusText").attr('data-text', displayTotscore).html(displayTotscore);
							$("#btnCloseModal").trigger('click');
							$this.dialog('destroy').remove();
		//                    $(this).dialog('close');

							setTimeout(function () {
								AssignmentInstructorView.updateRefreshedContent = true;      
							}, 12000);
							
							objScoreForGradeableItem	=	null;
							clearInterval(AcceptScoreInterval);
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
};

/**
 * Scroll To Box Bottom on Focus of Comment Textarea
 * @returns {undefined}
 */
AssignmentScoreView.focusCommentBox =   function () {
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
AssignmentScoreView.calculateLexileLevel = function (psItemId, psStudentId, piTotScore, piStudentLexileLevel, piItemMaxScore, totScorePercentage, fCallback){
    
	//	Checking For Current Settings
    if(objUserLevel != null) {
		//	Which contains students last Status
        var oUserLevelData = objUserLevel.Content,
			aUserReadingLevelDetails = [],
			aUserLexileLevelDetails = [],
			aRLDetails = [],
			aLLDetails = [];

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
					iWeek = parseInt(aUserLexileLevelDetails[iI]['W']) || 1,
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
		
		//	Get Reading Level
        try{
            var objStudent       = _.where(AssignmentInstructorView.lastStudentContent.Content, {UserID: psStudentId}),
				iCurReadingLevel = objStudent[0].UserCurrentReadingLevel;
        }
		catch(exp) {
            var iCurReadingLevel = piStudentLexileLevel;
        }

		//	Get Assignment Max Score
		try{
			var osearchFilter=	{};
			osearchFilter[AssignmentInstructorView.oJsonKeys['IID']] = psItemId.toString();
			osearchFilter[AssignmentInstructorView.oJsonKeys['SID']] = psStudentId.toString();
				
            var objItem 		= _.where(AssignmentInstructorView.lastGradeBookContent.Content, osearchFilter),
				iItemMaxScore 	= objItem[0][AssignmentInstructorView.oJsonKeys['IMS']];
        }
		catch(exp) {
            var iItemMaxScore	= piItemMaxScore;
        }

		//	Get Current Week and Unit
        try {
            var objAssignment   =   _.where(objAssignmentListJsonData.Content, {ItemID: psItemId}),
				iCurrentWeek    =   objAssignment[0].WeekNumber,
				iCurrentUnit    =   objAssignment[0].UnitNumber;
        }
		catch(exp) {
			var iCurrentUnit    =   $("#selectedUnit").attr('data-id'),
				iCurrentWeek    =   $("#selectedLesson").attr('data-id');
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
    
        //  Lexile Level
        var sGradeCode	  = fetchGradeCode(objUnitDetails.gradeCode);
        var iLexileConst  = 0;
        
		//	Lexile Matrix
		var arrLexileConst  =   {
		  "gr4": {
			"unit1": {"level1": 980,"level2": 900,"level3": 800,"level4": 750,"level5": 690,"level6": 550,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1020,"level2": 930,"level3": 850,"level4": 800,"level5": 750,"level6": 600,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1040,"level2": 970,"level3": 900,"level4": 850,"level5": 800,"level6": 680,"level7": 600,"level8": 550,"level9": 350},
			"unit4": {"level1": 1070,"level2": 1000,"level3": 930,"level4": 900,"level5": 850,"level6": 750,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 900,"level6": 800,"level7": 750,"level8": 630,"level9": 550},
			"unit6": {"level1": 1130,"level2": 1060,"level3": 1020,"level4": 1000,"level5": 950,"level6": 850,"level7": 800,"level8": 700,"level9": 600}
		  },
		  "gr5": {
			"unit1": {"level1": 980,"level2": 900,"level3": 800,"level4": 750,"level5": 690,"level6": 550,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1020,"level2": 930,"level3": 850,"level4": 800,"level5": 750,"level6": 600,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1040,"level2": 970,"level3": 900,"level4": 850,"level5": 800,"level6": 680,"level7": 600,"level8": 550,"level9": 350},
			"unit4": {"level1": 1070,"level2": 1000,"level3": 930,"level4": 900,"level5": 850,"level6": 750,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 900,"level6": 800,"level7": 750,"level8": 630,"level9": 550},
			"unit6": {"level1": 1130,"level2": 1060,"level3": 1000,"level4": 950,"level5": 900,"level6": 850,"level7": 800,"level8": 700,"level9": 600}
		  },
		  "gr6": {
			"unit1": {"level1": 980,"level2": 900,"level3": 800,"level4": 750,"level5": 690,"level6": 550,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1020,"level2": 930,"level3": 850,"level4": 800,"level5": 750,"level6": 600,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1040,"level2": 970,"level3": 900,"level4": 850,"level5": 800,"level6": 680,"level7": 600,"level8": 550,"level9": 350},
			"unit4": {"level1": 1070,"level2": 1000,"level3": 930,"level4": 900,"level5": 850,"level6": 750,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 900,"level6": 800,"level7": 750,"level8": 630,"level9": 550},
			"unit6": {"level1": 1150,"level2": 1060,"level3": 1050,"level4": 1020,"level5": 980,"level6": 850,"level7": 800,"level8": 700,"level9": 600}
		  },
		  "gr7": {
			"unit1": {"level1": 980,"level2": 900,"level3": 800,"level4": 750,"level5": 690,"level6": 550,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1020,"level2": 930,"level3": 850,"level4": 800,"level5": 750,"level6": 600,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1040,"level2": 970,"level3": 900,"level4": 850,"level5": 800,"level6": 680,"level7": 600,"level8": 550,"level9": 350},
			"unit4": {"level1": 1070,"level2": 1000,"level3": 930,"level4": 900,"level5": 850,"level6": 750,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 900,"level6": 800,"level7": 750,"level8": 630,"level9": 550},
			"unit6": {"level1": 1130,"level2": 1060,"level3": 1000,"level4": 950,"level5": 900,"level6": 850,"level7": 800,"level8": 750,"level9": 600}
		  },
		  "gr8": {"unit1": {"level1": 980,"level2": 900,"level3": 800,"level4": 750,"level5": 690,"level6": 550,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1020,"level2": 930,"level3": 850,"level4": 800,"level5": 750,"level6": 600,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1040,"level2": 970,"level3": 900,"level4": 850,"level5": 800,"level6": 680,"level7": 600,"level8": 550,"level9": 350},
			"unit4": {"level1": 1070,"level2": 1000,"level3": 930,"level4": 900,"level5": 850,"level6": 750,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 900,"level6": 800,"level7": 750,"level8": 630,"level9": 550},
			"unit6": {"level1": 1130,"level2": 1080,"level3": 1010,"level4": 980,"level5": 950,"level6": 850,"level7": 800,"level8": 680,"level9": 600}
		  },
		  "gr9": {
			"unit1": {"level1": 1020,"level2": 960,"level3": 900,"level4": 850,"level5": 750,"level6": 600,"level7": 450,"level8": 350,"level9": 100},
			"unit2": {"level1": 1040,"level2": 990,"level3": 940,"level4": 900,"level5": 800,"level6": 680,"level7": 550,"level8": 450,"level9": 200},
			"unit3": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 940,"level5": 850,"level6": 750,"level7": 620,"level8": 550,"level9": 350},
			"unit4": {"level1": 1130,"level2": 1060,"level3": 1010,"level4": 970,"level5": 900,"level6": 800,"level7": 670,"level8": 600,"level9": 450},
			"unit5": {"level1": 1150,"level2": 1100,"level3": 1040,"level4": 1020,"level5": 940,"level6": 850,"level7": 750,"level8": 620,"level9": 550},
			"unit6": {"level1": 1180,"level2": 1120,"level3": 1060,"level4": 1040,"level5": 980,"level6": 900,"level7": 800,"level8": 670,"level9": 600}
		  },
		  "gr10": {
			"unit1": {"level1": 1100,"level2": 1040,"level3": 970,"level4": 900,"level5": 800,"level6": 670,"level7": 550,"level8": 350,"level9": 100},
			"unit2": {"level1": 1130,"level2": 1070,"level3": 1010,"level4": 930,"level5": 850,"level6": 750,"level7": 600,"level8": 450,"level9": 200},
			"unit3": {"level1": 1150,"level2": 1100,"level3": 1040,"level4": 970,"level5": 900,"level6": 800,"level7": 680,"level8": 550,"level9": 350},
			"unit4": {"level1": 1180,"level2": 1120,"level3": 1060,"level4": 1000,"level5": 940,"level6": 850,"level7": 750,"level8": 620,"level9": 450},
			"unit5": {"level1": 1200,"level2": 1150,"level3": 1100,"level4": 1040,"level5": 970,"level6": 900,"level7": 800,"level8": 680,"level9": 550},
			"unit6": {"level1": 1230,"level2": 1180,"level3": 1120,"level4": 1070,"level5": 1020,"level6": 940,"level7": 850,"level8": 690,"level9": 600}
		  }
		};
		
		//	Fetch Lexile Based On "Grade" & "Unit" & "Reading Level"
        iLexileConst     = (arrLexileConst[sGradeCode] || arrLexileConst["gr4"])["unit"+iCurrentUnit]["level"+iReadingLevel];
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
            
        //  Calculate Lexile 
        if(iReadingLevel == 1) {
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
		else {
            iLexileLevel = iLexileConst;
        }
        
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
		
		var iObjStudIdx = $.map(objStudentListJsonData.Content, function(obj, index) {
							if(parseInt(obj.UserID) == psStudentId) {
								return index;
							}
						});
		
		objStudentListJsonData.Content[iObjStudIdx].UserCurrentReadingLevel = iReadingLevel;
		objStudentListJsonData.Content[iObjStudIdx].UserCurrentLexileLevel = iLexileLevel;
		
		fCallback();
        return;
    } else {        
        setTimeout(function () {
            AssignmentScoreView.calculateLexileLevel(psItemId, psStudentId, piTotScore, piStudentLexileLevel, piItemMaxScore, totScorePercentage, fCallback);
        }, 1000);
    }    
};

/**
 * 
 * @param {Object} objJson
 * @param {Integer} iLevel
 * @returns {Object} ObjResult
 */
AssignmentScoreView.digJson = function (objJson, keyName) {
    
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

function ShowLoader () {
	var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
	$("#loaderContainer").html(loaderImg).addClass('loaderContainer');
	$("#loaderContainer").show();
	$(".loaderContainerOverlay").show();
}

function HideLoader () {
	$(".loaderContainerOverlay").removeAttr('style');
    $("#loaderContainer").html('').hide();
    $("#loaderContainer").removeClass('loaderContainer');    
}