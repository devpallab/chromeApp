var relativePath= "";
var keyvalData= null;
var lessonInfoData= "";
var assignmentData= "";
var contextInfoData= "";
var bookPageContentData= "";
var bookFileContentData= "";
var SERVICEBASEURL = window.top.SERVICEBASEURL;
var TOKENID =  window.top.TOKENID;
var siteBaseUrl = '';
var clientPKTId = 'ilit';
var clientPKTPwrd = 'tkptili';
var transacPKTId = 'c17a43e1-46a6-11e1-a0cd-c82a1416fe11';
var studPKTId = '123XYZ';
var promptPKTId = 'prompt123';
var promptPKTType = 'narrative';
var instructionalPKTLevel = 'L12';
var adminRole = window.top.ADMINROLE;
var instRole = 'i';
var studRole = 's';
var CURRENTUSERROLE = getSessionStorageItem("userRole");
var APPTYPE = window.top.APPTYPE;
var INDEXEDDBSUPPORT = window.top.INDEXEDDBSUPPORT;
var INSTRDBNAME = window.top.INSTRDBNAME;
var STUDNTDBNAME = window.top.STUDNTDBNAME;
var CLASSID = window.top.CLASSID;
var USERID = window.top.USERID;
var CACHEDSTATUSINSTRUCTORKEYNAME = window.top.CACHEDSTATUSINSTRUCTORKEYNAME;
var CACHEDSTATUSSTUDENTKEYNAME = window.top.CACHEDSTATUSSTUDENTKEYNAME;
var ATTEMPTDATACACHESTATUS = {
	INSTR: '',
	STUDNT: ''
};
var ALLOWFORCSR = $.inArray(CURRENTUSERROLE,adminRole) != -1; //condition for service to work for Class Summary Report
var DENYFORCSR = $.inArray(CURRENTUSERROLE,adminRole) == -1; //condition for service to not work for Class Summary Report


// Grade id
var gradeId = "";

// Planner Object Data
var objPlannerData = null;

// Planner Json Data
var objPlannerJsonData = null

// Lesson Object Data
var objLessonData = null;

// Lesson Json Data
var objLessonJsonData = null;

// Library Object Data
var objLibraryData = null;

// Library Json Data
var objLibraryJsonData = null;

// Ebook Json Data
var objEbookJsonData = null;

// Assignment TOC Json data. Used in GetAssignmentTOCInfoCallback() method
var objAssignmentTOCJsonData = null;

// Assignment Slides Json data. Used in GetAssignmentSlidesInfoCallback() method
var objAssignmentSlidesJsonData = null;
// Assignment Slides Object data.
var objAssignmentSlidesData = null;

// Student List Object data.
var objStudentListJsonData = null;

// Assignment List Object data
var objAssignmentListJsonData = null;

// Grade Book object
var objGradeBookJsonData = 0;

var pobjAssignGradeableItemData = null;

var studentAttemptData = null;

var objStudentAttemptDataResponse = 0;

//  Unit Details
var objUnitDetails = null;

//  Assign To Class Response
var objAssignGradeableItemResponse  =   null

// Withdraw Assignment Response
var objWithdrawAssignmentResponse   =   null;

// Notebook Response
var objNoteBookData = null;

// Portfolio Resources Object Data
var objResourceData = null;

// Portfolio Resources Json Data
var objResourceJsonData = null

// MessageList Response
var objMessageJsonData = null;

var objScoreForGradeableItem = null;

var objReAssignGradableItem = null;

// time interval variable for updating survey result for instructor
var timeIntervalSurveyResult = 5000;

// time interval object for updating survey result for instructor
var objTimeInterval = null;

var objBroadcastJsonData = null;

// Assignment Group Json data. Used in GetAssignmentGroupInfoCallback() method / For Performance Tab
var objPerformanceInfoJsonData = null;

// Assignment Group Json data. 
var objPerformanceInfoData = null;

// Conference Student Json data. 
var objconferenceStudentData = null;

// Library Progress Json data. 
var objlibraryProgressData = null;

// Conference Studentlist Json Data.

var objconferenceListStudentData = null;

var objCurrentBookForStudent = null;

var objUserLevel        =   null;

var objsurveyResultData = null;

var objCurrentUnitDetails = null;

var objCurrentRATABook = null;

// Library Progress JSON data for whole Class
var objLibraryProgressForClass = 0;

// Library Progress Details JSON data for whole Class
var objLibraryProgressDetailForClass = 0;

// Save Library Progress Response
var objSaveLibraryProgressResponse = null;

//	GetGradeBookForInstructorV2 Return JSON
var objGradeBookV2JsonData = 0;

// Scribble broadcast object
var objScribbleDetails = null;

// Library Progress Summary
var objLibraryProgressSummary = null;

// Oral Fluency Audio Record Response
var objRecordAudioDataResponse = null;
// Oral Fluency Play Pause Response
var objPlayPauseAudioResponse = null;
// Oral Fluency Play Pause Response
var objSaveAudioResponse = null;
// Oral Fluency Reservation Response
var objOralfluencyReservationResponse = null;
// Oral Fluency Submit Score Response
var objOralfluencySubmitScoreResponse = null;
// Check Mic Enabled or Disabled
var objMicStatusResponse = null;
// Skill Taxonomy JSON data for Skill Report
var objSkillTaxonomyInformation = 0;

// Skill Based Report JSON Data By WeekRange for Skill Report
var objSkillBasedReportDataByWeekRange = 0;

//	Total Word Count For Student
var oIWTTotalWordCount	=	0;

//	Get Settings Data
var objSettingsData = null;

//	Calendar Settings Save Response
var objSaveClassCalendarSettingsResponse	= null;

//	Class Settings Save Response
var objSaveClassSettingsResponse	= null;


// Oral Fluency PKT score for Instructor Scoring
var objOralfluencyGetScoreData = 0;

// User Level of whole class from GetClassUserLevel service
var objGetClassUserLevel = 0;

// Notes Saved Response
var objNotesJsonData = null;

/**
* Following variavles used for GetUserSettings() & SaveUserSettings() webservice
*/
var objGetUserSettingsResponse = null,
	objSaveUserSettingsResponse = null;

// Following variable used for storing GetAppInfo
var objAppVersionInfo = null;

// Noteinfo response

var objNoteInfoData = null;

// objGradebookAttemptDataForStudent response
var objGradebookAttemptDataForStudent =  null;

// Poll Update Response
var objUpdatePollResponse = null;

// Poll GetPollList Response
var objGetPollListResponse = null;

// Poll SetSurvey Response
var objPollSurveyResponse = null;

// Buzz Student Json data. 
var objBuzzData = null;
// Buzz Student Json data. 
var objBuzzListData = null;
// Buzz Student Json data. 
var objPollListData = null;
// Buzz Student Json data. 
var objPollInfoData = null;
//current week Json data
var objCurrentWeekJsonData = null;
//  Check and Assign To Gradable Item Response
var objCheckAssignAutoScoreGradeableItemsResponse = null;
// Set Current Week For Class Response
var objSetCurrentWeekForClassResponse = null;
// Set interest inventory data
var objSaveInterestInventoryResponse = null,
	objGetInterestInventoryResponse = null;

// Set Book Review Feedback data
var objGetBookReviewFeedbackData = 0,
	objSaveBookReviewFeedbackData = 0;

// set Skill mapping json data	
var objGetItemSkillMappingData	= null;

// Library Reserve List	
var objReserveListData	= null;

// Library Recomendation List	
var objrecommendationListData	= null;

// Library Reserve Unreserve Response
var objReserveUnreserveResponse	= null;

// user feedback for all books json data
var objGetUserFeedbackforAllBooksData = null;

// use for review tab
var isBookCompleted = false;
var totalBooksCompleted = 0;	

// use for device time stamp
var objGetCurrentDeviceTimestamp = null;

// use for product detail
var objProductDetailJsonData = null;

function GetRelativePath(type) {    	
	var params = "{\"method\":\"GetRelativePath\",\"type\":\""+type+"\"}";
//	NativeBridge.call("JSToNativeCommunication", params, GetRelativePathCallback);
        callNativeBridge("JSToNativeCommunication", params, GetRelativePathCallback);
}


function GetRelativePathCallback(path) {
	if(path) relativePath= path;
	else relativePath = null;
}


function GetData(key) {
	
	var params = "{\"method\":\"GetData\",\"key\":\""+key+"\"}";
	var value= "";
        callNativeBridge("JSToNativeCommunication", params, GetDataCallback);
//	NativeBridge.call("JSToNativeCommunication", params, function (response) {                      
//			document.body.innerHTML+="<br>"+response;
//			if (onSuccess)
//				onSuccess();
//				value= response.val;
//			});
}

function GetDataCallback(dataStr) {
	keyvalData= dataStr;
}

function SaveData(key, value) {	
	var params = "{\"method\":\"SaveData\",\"key\":\""+key+"\",\"value\":\""+value+"\"}";	
        callNativeBridge("JSToNativeCommunication", params, SaveDataCallback);
//	NativeBridge.call("JSToNativeCommunication", params, function (response) {                      
//			document.body.innerHTML+="<br>"+response;
//			if (onSuccess)
//				onSuccess();
//			});
}

function SaveDataCallback() {
    
}

function SetSurvey(lessonid, qId, action, questionInfo, surveyType) {
	var surveyType	= typeof surveyType == "undefined" ? "LessonSurvey"  : surveyType;
	
    var params = "{\"method\":\"SetSurvey\",\"lessonid\":\""+lessonid+"\", \"qid\":\""+qId+"\",\"action\":\""+action+"\", \"questionInfo\":\""+questionInfo+"\", \"surveyType\":\""+surveyType+"\"}";
	
    callNativeBridge("JSToNativeCommunication", params, SetSurveyCallback);
}

function SetSurveyCallback(response) {
    document.body.innerHTML+="<br>"+response;
    if (onSuccess) {
        onSuccess();
    }
}

function SetSurveyForStudent(qId, action, questionInfo, userRespNo, surveyType) {	
    var params = "{\"method\":\"SetSurvey\",\"userResponseNo\":\""+userRespNo+"\", \"qid\":\""+qId+"\",\"action\":\""+action+"\", \"questionInfo\":"+questionInfo+",\"surveyType\":\""+surveyType+"\"}";	
    callNativeBridge("JSToNativeCommunication", params, SetSurveyCallback);
}

function SetProjectSlide(type, action, mediaId, questionInfo, pmediaFullURL, pmediaActionType) {
	
	var mediaFullURL   = typeof pmediaFullURL == "undefined" ? ''  : pmediaFullURL;
	var mediaActionType = typeof pmediaActionType == "undefined" ? ''  : pmediaActionType;

    var params = "{\"method\":\"SetProjectSlide\",\"type\":\""+type+"\",\"action\":\""+action+"\",\"mediaid\":\""+mediaId+"\", \"questionInfo\":\""+questionInfo+"\", \"mediaFullURL\":\""+mediaFullURL+"\", \"mediaActionType\":\""+mediaActionType+"\"}";
	
    callNativeBridge("JSToNativeCommunication", params, SetProjectSlideCallback);
}

function SetProjectSlideCallback(response) {
	if (typeof LessonView != 'undefined') {
		LessonView.SetBroadcastRata();          
	}
}

function SetExpandImage(mediaId) {	
    var params = "{\"method\":\"SetExpandImage\",\"mediaid\":\""+mediaId+"\"}";	
    callNativeBridge("JSToNativeCommunication", params, SetExpandImageCallback);	
}

function SetExpandImageCallback(response) {
    document.body.innerHTML+="<br>"+response;
    if (onSuccess) {
        onSuccess();
    }
}

function GetContextInfo() {
	var params = "{\"method\":\"GetContextInfo\"}";
	NativeBridge.call("JSToNativeCommunication", params, function (response) {                      
			document.body.innerHTML+="<br>"+response;
			if (onSuccess)
				onSuccess();
			});
}

function GetContextInfoCallback(contextInfoStr) {
	contextInfoData = contextInfoStr;
}

function GetBookPageContent(pageId, bookId) {
	var params = "{\"method\":\"GetBookPageContent\",\"pageid\":\""+pageId+"\",\"bookid\":\""+bookId+"\"}";
        callNativeBridge("JSToNativeCommunication", params, GetBookPageContentCallback);    
//    $.ajax({
//        type: "POST",
//        url: "../native.php?pageId="+pageId+"&bookId="+bookId,        
//        success: function(response) {            
//           bookPageContentData = response;
//        }
//    });
}

function GetBookPageContentCallback(bookPageContentStr, isEncrypted) {
                
        if(isEncrypted == 1) {
            bookPageContentStr = unescape(bookPageContentStr);
        }        
        
	if(bookPageContentStr) bookPageContentData = bookPageContentStr;
        else bookPageContentData = null;
         
}

function GetBookFileContent(pageId, bookId) {
    var params = "{\"method\":\"GetBookFileContent\",\"pageid\":\""+pageId+"\",\"bookid\":\""+bookId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetBookFileContentCallback);
    
//    $.ajax({
//        type: "POST",
//        url: "../native.php?pageId="+pageId+"&bookId="+bookId,        
//        success: function(response) {            
//           bookFileContentData = response;           
//        }
//    });
}

function GetBookFileContentCallback(bookFileContentStr, isEncrypted) {
    
    if(isEncrypted == 1) {
        bookFileContentStr = unescape(bookFileContentStr);
    }
    
    if(bookFileContentStr) bookFileContentData = bookFileContentStr;
    else bookFileContentData = null;
    
    if(bookFileContentStr) bookFileContentData = bookFileContentStr;
    else bookFileContentData = null;
}

function showStudentResponse(data){
	if (typeof LessonView != 'undefined') {
		LessonView.updateResponse(data);
	}
	else {
		objPollSurveyResponse = data;
		ConnectView.viewType.sendPollView.updateResponse();
	}
}

/**
 * Function to change the project and broadcast button caption
 * type: project/broadcast
 */
function resetPBCaption(type){
    LessonView.resetProjectBroadcast(type);
}

function setProcessPKT(type , studentResponse, readingId, paragraphType){

	var paragraphType   = typeof paragraphType == "undefined" ? ''  : paragraphType;
	var contentType = (type == "paragraph" && paragraphType == '') ? "introduction" : paragraphType;
	if (type == "paragraph" && paragraphType == '') {
		var callbackName = 'paragraph';
	}
	else if (type == "paragraph" && paragraphType != '') {
		var callbackName = 'essay';
	}
	else {
		var callbackName = '';
	}
	
   studentResponse = replaceChars(studentResponse);
   var params = "{\"method\":\"setProcessPKT\",\"type\":\""+type+"\",\"studentResponse\":\""+studentResponse+"\",\"readingId\":\""+readingId+"\",\"paragraphType\":\""+contentType+"\",\"callbackName\":\""+callbackName+"\"}";
   
   try {
	JSON.parse(params);
   }
   catch (oException) {
		var data = "Unusual Text!";
		if(type == "paragraph" && paragraphType != ''){
			essayPKTCallback(data);        
	   }
	   else if(type == "essayScore"){
			essayScorePKTCallback(data);        
	   }
	   else if(type == "paragraph" && paragraphType == ''){
		   paragraphPKTCallback(data);        
	   } 
	   else if(type == "summaryScore"){
		   summaryPKTCallback(data);        
	   }
	   else if(type == "SummaryFeedbackRequest"){
		   SummaryFeedbackPKTCallback(data);        
	   }
   }
   
   if(type == "paragraph" && paragraphType != ''){
        callNativeBridge("JSToNativeCommunication", params, essayPKTCallback); 

   }
   else if(type == "essayScore"){
        callNativeBridge("JSToNativeCommunication", params, essayScorePKTCallback);        
   }
   else if(type == "paragraph" && paragraphType == ''){
       callNativeBridge("JSToNativeCommunication", params, paragraphPKTCallback);        
   } 
   else if(type == "summaryScore"){
       callNativeBridge("JSToNativeCommunication", params, summaryPKTCallback);        
   }
   else if(type == "SummaryFeedbackRequest"){
       callNativeBridge("JSToNativeCommunication", params, SummaryFeedbackPKTCallback);        
   }
}

function essayPKTCallback(data){
    EssayView.essayPKTCallback(data);
}

function essayScorePKTCallback(data){
    EssayView.essayScorePKTCallback(data);
}

function paragraphPKTCallback(data){
	ParagraphView.paragraphPKTCallback(data);
}

function summaryPKTCallback(data){
    IwtsSummaryView.summaryPKTCallback(data);
}

function SummaryFeedbackPKTCallback(data){
    IwtsSummaryView.SummaryFeedbackPKTCallback(data);
}

function GetGradeInfo() {
    var params = "{\"method\":\"GetGradeInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradeInfoCallback);
}

function GetGradeInfoCallback (pgradeId) {
    if(pgradeId) gradeId = parseInt(pgradeId.replace('grade', ''));
    else gradeId = null;
}

function GetPlannerInfo() {
    var params = "{\"method\":\"GetPlannerInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetPlannerInfoCallback);
}

function GetPlannerInfoCallback (pobjPlannerJsonData) {    
    
    if(pobjPlannerJsonData !== null) objPlannerJsonData = $.parseJSON(pobjPlannerJsonData);
    else objPlannerJsonData = null;
}

function LaunchGradeItem (unitNumber, weekNumber, itemId, itemType, previewLesson, rataBookId, teachFrom) {
    var params = "{\"method\":\"LaunchGradeItem\",\"unitNumber\":\""+unitNumber+"\",\"weekNumber\":\""+weekNumber+"\",\"itemId\":\""+itemId+"\",\"itemType\":\""+itemType+"\",\"previewLesson\":\""+previewLesson+"\",\"rataBookId\":\""+rataBookId+"\",\"teachFrom\":\""+teachFrom+"\"}";
	
    callNativeBridge("JSToNativeCommunication", params, LaunchGradeItemCallback);
}

function LaunchGradeItemCallback () {
    //Do Nothing
}

function GetLessonInfo() {
    var params = "{\"method\":\"GetLessonInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetLessonInfoCallback);
}

function GetLessonInfoCallback(pobjLessonJsonData) {
    if (pobjLessonJsonData !== null) {
		objLessonJsonData = JSON.parse(pobjLessonJsonData);
		objLessonJsonData["UnitsWeeksDetails"] = getSessionStorageItem('unitsWeeksDetails');
	}
    else {
		objLessonJsonData = null;
	}
}

function GetLibraryInfo() {	
    var params = "{\"method\":\"GetLibraryInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetLibraryInfoCallback);
}

function GetLibraryInfoCallback (pobjLibraryJsonData) {
		
    if(pobjLibraryJsonData !== null) objLibraryJsonData = JSON.parse(pobjLibraryJsonData);
    else objLibraryJsonData = null;    
}

function GetEbookInfo(pbookId, isBroadCast) {
    var isBroadCast   = typeof isBroadCast == "undefined" ? false  : isBroadCast;
    var params = "{\"method\":\"GetEbookInfo\",\"bookId\":\""+pbookId+"\",\"isBroadCast\":"+isBroadCast+"}";    
    callNativeBridge("JSToNativeCommunication", params, GetEbookInfoCallback);
}

function GetEbookInfoCallback (pobjEbookJsonData) {
        
    if(pobjEbookJsonData !== null) objEbookJsonData = JSON.parse(pobjEbookJsonData);
    else objEbookJsonData = null;    
}

/* 
* GetAssignmentTOCInfo () : Send request to Native for getting Assignment TOC JSON
* Param - void
*/
function GetAssignmentTOCInfo() {
    var params = "{\"method\":\"GetAssignmentTOCInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetAssignmentTOCInfoCallback);
}
/* 
* GetAssignmentTOCInfoCallback () : Callback method for receving response from Native and assigning "Assignment TOC" content to a variable 
* Param - pobjAssignmentTOCJsonData: json
*/
function GetAssignmentTOCInfoCallback(pobjAssignmentTOCJsonData) {    
    try {
		pobjAssignmentTOCJsonData = SpecialCharToCode(pobjAssignmentTOCJsonData, false);
	    if(pobjAssignmentTOCJsonData !== null) objAssignmentTOCJsonData = JSON.parse(pobjAssignmentTOCJsonData);
	    else objAssignmentTOCJsonData = null;
	}
	catch (oException) {		
		return;
	}
}

/* 
* GetAppProductDetailsInfo () : Send request to Native for getting Product details
* Param - void
*/
function GetAppProductDetailsInfo() {
    var params = "{\"method\":\"GetAppProductDetailsInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetAppProductDetailsInfoCallback);
}
/* 
* GetAppProductDetailsInfoCallback () : Callback method for receving response from Native and assigning "Assignment TOC" content to a variable 
* Param - pobjAssignmentTOCJsonData: json
*/
function GetAppProductDetailsInfoCallback(pobjProductDetailJsonData) {    
	if (pobjProductDetailJsonData !== null) objProductDetailJsonData = JSON.parse(pobjProductDetailJsonData);
	else objProductDetailJsonData = null;
}

/* 
* GetAssignmentSlidesInfo () : Send request to Native for getting Assignment Slides JSON
* Param - itemId: Id of a particular assignment/assessment
* Param - itemType: Specify Type whether it's assignment/assessment
*/
function GetAssignmentSlidesInfo(itemId, itemType) {
    var params = "{\"method\":\"GetAssignmentSlidesInfo\",\"itemId\":\""+itemId+"\",\"itemType\":\""+itemType+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetAssignmentSlidesInfoCallback);
}
/* 
* GetAssignmentSlidesInfoCallback () : Callback method for receving response from Native and assigning "Assignment Slides" content to a variable
* Param - pobjAssignmentSlidesJsonData: json
*/
function GetAssignmentSlidesInfoCallback(pobjAssignmentSlidesJsonData) {    
    
    if(pobjAssignmentSlidesJsonData !== null) objAssignmentSlidesJsonData = JSON.parse(pobjAssignmentSlidesJsonData);
    else objAssignmentSlidesJsonData = null;	
}

/* 
* GetStudentListInfo () : for calling GetRosterForClass web service 
* Param - none
* callback - GetStudentListInfoCallback()
*/
function GetStudentListInfo() {
    var params = "{\"method\":\"GetStudentListInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetStudentListInfoCallback);
}

/* 
* GetStudentListInfoCallback () : callback to GetStudentListInfo()
* Param - student list json
*/
function GetStudentListInfoCallback(pobjStudentListJsonData) {    
    
    if(pobjStudentListJsonData !== null) objStudentListJsonData = JSON.parse(pobjStudentListJsonData);
    else objStudentListJsonData = null;
}

/* 
* GetAssignmentListInfo () : for calling GetGradableItemForInstructor web service 
* Param - psUnitNumber
* Param - psWeekNumber  **NOTE: param added at the time of iLit20 development**
* callback - GetAssignmentListInfoCallback()
*/
function GetAssignmentListInfo(psUnitNumber, psWeekNumber) {
    var unitNumber  = (typeof psUnitNumber == "undefined") ? ''  : psUnitNumber,
		weekNumber 	= parseInt(psWeekNumber) || '';
    var params = "{\"method\":\"GetAssignmentListInfo\",\"unitNumber\":\""+unitNumber+"\",\"weekNumber\":\""+weekNumber+"\"}";
	callNativeBridge("JSToNativeCommunication", params, GetAssignmentListInfoCallback);
}

/* 
* GetAssignmentListInfoCallback () : callback to GetAssignmentListInfo()
* Param - assignment list json
*/
function GetAssignmentListInfoCallback(pobjAssignmentListJsonData) {    
    if(pobjAssignmentListJsonData !== null) objAssignmentListJsonData = JSON.parse(pobjAssignmentListJsonData);
    else objAssignmentListJsonData = null;
}

/**
 * GetGradeBookInfo () : for calling GetGradebook web service 
 * @param {String} sFilterType
 * @param {String} sValue
 * @param {Boolean} bisFullClass
 * @param {Object} objStudIds
 * @returns {undefined}
 * callback - GetGradeBookInfoCallback()
 */

function GetGradeBookInfo(sFilterType, sValue, bisFullClass, objStudIds) {    
    var params = "{\"method\":\"GetGradeBookInfo\",\"filterType\":\""+sFilterType+"\",\"csvvalue\":\""+sValue+"\",\"isFullClass\":\""+bisFullClass+"\",\"studIds\":\""+objStudIds+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradeBookInfoCallback);
}

/* 
* GetGradeBookInfoCallback () : callback to GetGradeBookInfo()
* Param - assignment status json
*/
function GetGradeBookInfoCallback(pobjGradeBookJsonData) {    
    
    if(pobjGradeBookJsonData !== null) objGradeBookJsonData = JSON.parse(pobjGradeBookJsonData);
    else objGradeBookJsonData = null;
}

/* 
* AssignGradeableItem () : for calling AssignGradableItem web service 
* Param - json string of student assignment combination
* callback - AssignGradeableItemCallback()
*/
function AssignGradeableItem(assignObj) {  
    
    var params = "{\"method\":\"AssignGradeableItem\",\"assignInfo\":\""+assignObj+"\"}";
    callNativeBridge("JSToNativeCommunication", params, AssignGradeableItemCallback);
}

/* 
* AssignGradeableItemCallback () : callback to AssignGradeableItem()
* Param - string "success"
*/
function AssignGradeableItemCallback(pobjAssignGradeableItemResponse) {    
    
    objAssignGradeableItemResponse  =   JSON.parse(pobjAssignGradeableItemResponse);
//    AssignmentGridView.AssignGradeableCallback(JSON.parse(data));

}

/* setAttemptGradeableItem() - AttemptGradeableItem web service call from student assignment 
* param: none
* callback : AttemptGradeableItemCallback()
*/
function setAttemptGradeableItem(type,itemId,data){
   var params = "{\"method\":\"setAttemptGradeableItem\",\"itemId\":\""+itemId+"\",\"data\":\""+data+"\",\"type\":\""+type+"\"}";   
   
	if(type == 'summary')
	{
		callNativeBridge("JSToNativeCommunication", params, AttemptGradeableItemCallback);
	}
	else if(type == 'paragraph')
	{
		callNativeBridge("JSToNativeCommunication", params, ParaAttemptGradeableItemCallback);
	}
}

/* AttemptGradeableItemCallback() : callback function of setAttemptGradeableItem();
* param : none
*/
function AttemptGradeableItemCallback(){
    TypeInView.AttemptGradeableItemCallback();
}

/* ParaAttemptGradeableItemCallback() : callback function of setAttemptGradeableItem();
* param : none
*/
function ParaAttemptGradeableItemCallback(){
    ParagraphView.AttemptGradeableItemCallback();
}

/* onPageLoadComplete() -  
* param: none
* callback : onPageLoadCompleteCallback()
*/
function onPageLoadComplete(type){
   var params = "{\"method\":\"onPageLoadComplete\",\"type\":\""+type+"\"}";   
   callNativeBridge("JSToNativeCommunication", params, onPageLoadCompleteCallback);
}

/* onPageLoadCompleteCallback() : callback function of onPageLoadComplete();
* param : none
*/
function onPageLoadCompleteCallback(){
    // nothing happens
}

/* GetAttemptData() - GetAttemptDataForGradeableItem web service call for student assignment 
* param: none
* callback : GetAttemptDataCallback()
*/
function GetAttemptDataForGradeableItem(itemId, studentId, itemAttemptId) {
	if (
		typeof studentId == 'undefined' ||
		studentId == null
	) {
		studentId = '';
	}
	itemAttemptId = (typeof itemAttemptId == 'undefined' || itemAttemptId == null) ? '' : itemAttemptId;
	var params = "{\"method\":\"GetAttemptDataForGradeableItem\",\"itemId\":\""+itemId+"\",\"itemAttemptId\":\""+itemAttemptId+"\",\"studentId\":\""+studentId+"\"}";   
	callNativeBridge("JSToNativeCommunication", params, GetAttemptDataCallback);
}

/* GetAttemptDataCallback() : callback function of setAttemptGradeableItem();
* param : none
*/
function GetAttemptDataCallback(data) {	
    data = data.replace(/\’/g, '&#39;');
    data = data.replace(/\'/g, '&#39;');
    data = data.replace(/\n/g, '\\n');
    data = data.replace(/\�/g, '&#34;');
    data = data.replace(/\�/g, '&#34;');
	
    studentAttemptData = JSON.parse(data);
}

/* SetAttemptData() - SaveAttemptDataForGradeableItem web service call for student assignment 
* param: none
* callback : 
*/
function SetAttemptData(itemId, studentAttemptData, studentAttemptSummary, systemScore, finalScore, itemComplete, itemAttemptId, pComment, pStudentiD, pIsStudentScored, pMaxScore, pOralFluencyData) {     
   
   var comment   = typeof pComment == "undefined" ? ''  : pComment;
   var studentId = typeof pStudentiD == "undefined" ? ''  : pStudentiD;   
   var isStudentScored = typeof pIsStudentScored == "undefined" ? ''  : pIsStudentScored; 
   var maxScore = typeof pMaxScore == "undefined" ? ''  : pMaxScore;
   var oralFluencyData = typeof pOralFluencyData == "undefined" ? ''  : pOralFluencyData;
   
   // var params = "{\"method\":\"SaveAttemptDataForGradeableItem\",\"itemId\":\""+itemId+"\",\"studentAttemptData\":\""+studentAttemptData+"\",\"systemScore\":\""+systemScore+"\",\"finalScore\":\""+finalScore+"\",\"itemComplete\":\""+itemComplete+"\"}";   
   var paramsJson = {"method":"SaveAttemptDataForGradeableItem","itemId":itemId,"studentAttemptData":studentAttemptData,"StudentAttemptSummary":studentAttemptSummary,"systemScore":systemScore,"finalScore":finalScore,"itemComplete":itemComplete,"itemAttemptId":itemAttemptId,"comment":comment,"studentId":studentId, "isStudentScored":isStudentScored, "maxScore":maxScore, "oralFluencyData":oralFluencyData};
   
   var params = JSON.stringify(paramsJson);	
   callNativeBridge("JSToNativeCommunication", params, SetAttemptDataCallback);
}

/* SetAttemptDataCallback() 
* param : none
*/
function SetAttemptDataCallback (pobjStudentAttemptDataResponse) {
	objStudentAttemptDataResponse = JSON.parse(pobjStudentAttemptDataResponse);
}

/**
 * Update and Store Display State of Library
 * @param {String} psView 
 */
//function updateLibraryView(psView) {
//    var params = "{\"method\":\"updateLibraryView\",\"view\":\""+psView+"\"}";return false;
//    callNativeBridge("JSToNativeCommunication", params, updateLibraryViewCallback);    
//}
//
///**
// * Do Nothing 
// */
//function updateLibraryViewCallback () {
//    //  Do Nothing
//}


/**
 * Update and Store Display State of Library
 * @param {String} psView 
 */
//function updateLibraryView(psView) {
//    var params = "{\"method\":\"updateLibraryView\",\"view\":\""+psView+"\"}";return false;
//    callNativeBridge("JSToNativeCommunication", params, updateLibraryViewCallback);    
//}
//
///**
// * Do Nothing 
// */
//function updateLibraryViewCallback () {
//    //  Do Nothing
//}

/**
 * Get Unit Details
 */
function GetUnitDetails() {
    var params = "{\"method\":\"GetUnitDetails\"}";
    callNativeBridge("JSToNativeCommunication", params, GetUnitDetailsCallback);
};

/**
 * 
 * @param {Object} pobjUnitDetails
 */
function GetUnitDetailsCallback(pobjUnitDetails) {
    if(pobjUnitDetails !== null) objUnitDetails = JSON.parse(pobjUnitDetails);
    else objUnitDetails = null;
};

/**
 * Withdraw Assignment
 * @param {Object} pobjAssignment
 * @returns None
 */
function RemoveGradeableItem(pobjAssignment) {
    var params = "{\"method\":\"RemoveGradeableItem\",\"assignInfo\":\""+JSON.stringify(pobjAssignment).replace(/"/g, '\\"')+"\"}";
    callNativeBridge("JSToNativeCommunication", params, RemoveGradeableItemCallback);
}

function RemoveGradeableItemCallback(pobjWithdrawAssignmentResponse) {
    objWithdrawAssignmentResponse  =   JSON.parse(pobjWithdrawAssignmentResponse);
}

/**
* Get Notebook List
**/


function GetNotelist(noteType,noteRefId) {
	
	var noteRefId   = typeof noteRefId == "undefined" ? ''  : noteRefId;
	var noteType = noteType.toLowerCase();
    var params = "{\"method\":\"GetNotelist\",\"noteType\":\""+noteType+"\",\"noteRefId\":\""+noteRefId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetNotelistCallback);
}

function GetNotelistCallback(pobjNoteBookData) {
	if(pobjNoteBookData !== null) {
		pobjNoteBookData = pobjNoteBookData.replace(/\’/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\'/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\n/g, '&#10;');
		pobjNoteBookData = pobjNoteBookData.replace(/\t/g, '&nbsp;');
		pobjNoteBookData = pobjNoteBookData.replace(/\“/g, '&#34;');
		pobjNoteBookData = pobjNoteBookData.replace(/\”/g, '&#34;');
		objNoteBookData = JSON.parse(pobjNoteBookData);
	}else {
		objNoteBookData = null;
	}
	try {getNoteListDraw();} catch (e){}
}

/**
* Save Note
**/

function SaveNote(noteId ,noteType,noteTitle,noteText,noteRefId, refUnitNumber, callerType, refOtherData, shortNoteText) {
	var callerType = (typeof callerType === "undefined") ? "" : callerType; 
	var noteId   =  (noteId == null || typeof noteId == "undefined") ? ''  : noteId;
	var noteRefId   =  (noteRefId == null || typeof noteRefId == "undefined") ? ''  : noteRefId;
	var refOtherData   =  (refOtherData == null || typeof refOtherData == "undefined") ? ''  : refOtherData;
	var noteType = noteType.toLowerCase();
	
    var params = "{\"method\":\"SaveNote\",\"noteId\":\""+noteId+"\",\"noteType\":\""+noteType+"\",\"noteTitle\":\""+noteTitle+"\",\"noteText\":\""+noteText+"\",\"noteRefId\":\""+noteRefId+"\",\"refUnitNumber\":\""+refUnitNumber+"\",\"callerType\":\""+callerType+"\",\"refOtherData\":\""+refOtherData+"\", \"ShortNoteText\":\"" + (shortNoteText || '') + "\"}";
    callNativeBridge("JSToNativeCommunication", params, GetSaveNoteCallback);
}

/* function GetSaveNoteCallback(pobjNotebookJsonData){
	NotebookTabsView.saveDataCallback(pobjNotebookJsonData);
} */
function GetSaveNoteCallback(pobjNotebookJsonData, callerType){	
    var callerType = (typeof callerType === "undefined") ? "" : callerType;
	
	objNotesJsonData = JSON.parse(pobjNotebookJsonData);
	
	try {
		if(callerType != ""){
			if(callerType === "ebook") {
				generateNotes();
			}
		}
		else {
			NotebookTabsView.saveDataCallback(pobjNotebookJsonData);
		}
	}
	catch (e) { 
		// may be called from student daily assignment.
	}
}

/**
* Delete Note
**/

function DeleteNote(noteId) {
    var params = "{\"method\":\"DeleteNote\",\"noteId\":\""+noteId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetDeleteNoteCallback);
}

function GetDeleteNoteCallback(pobjNotebookJsonData){
	NotebookTabsView.deleteDataCallback(pobjNotebookJsonData);
}

/**
* Get Message List For Instructor
**/
function GetMessageList(){
	var params = "{\"method\":\"GetMessageList\"}";
    callNativeBridge("JSToNativeCommunication", params, GetMessageListCallback);
}

function GetMessageListCallback(pobjMessageJsonData){
	if(pobjMessageJsonData !== null) objMessageJsonData = JSON.parse(pobjMessageJsonData);
    else objMessageJsonData = null;
}

/**
 * 
 * @param {String} itemId
 * @param {String} studentId
 * @param {String} totScore
 * @param {Integer} instructorScored
 * @param {String} scoreComment
 * @param {Number} wordCount
 * @param {String} instructorScoreRubric
 * @param {String} pKTOralFluencyResults
 * 
 */
function SetScoreForGradeableItem(itemId, itemAttemptId, studentId, totScore, instructorScored, scoreComment, wordCount, instructorScoreRubric, pKTOralFluencyResults) {
   pKTOralFluencyResults = (typeof pKTOralFluencyResults == "undefined") ? "" : pKTOralFluencyResults;
   var paramsJson = {
						"method":"SetScoreForGradeableItem",
						"itemId":itemId,
						"itemAttemptId":itemAttemptId,
						"studentId":studentId,
						"instScoreData":instructorScored,
						"finalScore":totScore,
						"comment":scoreComment,
						"wordCount":wordCount,
						"InstructorScoreRubric":instructorScoreRubric,
						"PKTOralFluencyResults":pKTOralFluencyResults
					};
   
   var params = JSON.stringify(paramsJson);	
   callNativeBridge("JSToNativeCommunication", params, SetScoreForGradeableItemCallback);      
}

/**
 * 
 * @param {Object} pobjScoreForGradeableItem
 * @returns {undefined}
 */
function SetScoreForGradeableItemCallback(pobjScoreForGradeableItem) {
    if(pobjScoreForGradeableItem != null) objScoreForGradeableItem = JSON.parse(pobjScoreForGradeableItem);
    else objScoreForGradeableItem = null;
};

/**
 * 
 * @param {String} pitemId
 * @param {String} pStudentiD
 * @param {String} pComment
 * @param {String} pPKTOralFluencyResults
 * @returns {undefined}
 */
function ReAssignGradableItem(pitemId, pitemAttemptId, pStudentiD, pComment, pPKTOralFluencyResults) {
   var paramsJson = {"method":"ReAssignGradableItem","itemId":pitemId,"itemAttemptId":pitemAttemptId,"studentId":pStudentiD,"comment": pComment,"PKTOralFluencyResults":pPKTOralFluencyResults};	
   var params = JSON.stringify(paramsJson);
   callNativeBridge("JSToNativeCommunication", params, ReAssignGradableItemCallback);
};

/**
 * 
 * @param {Object} pobjReAssignGradableItem
 * @returns {undefined}
 */
function ReAssignGradableItemCallback(pobjReAssignGradableItem) {
    if(pobjReAssignGradableItem != null) objReAssignGradableItem = JSON.parse(pobjReAssignGradableItem);
    else objReAssignGradableItem = null;
}

function HasKitkat() {
    var paramsJson = {"method":"HasKitkat"};      
    var params = JSON.stringify(paramsJson); 
    callNativeBridge("JSToNativeCommunication", params, HasKitkatCallback); 
}

function HasKitkatCallback(isKitkat) {
    IS_KITKAT = isKitkat;
}

/*
* GetGradeBook () :
*/

function GetGradeBook(unit_no) {
    var params = "{\"method\":\"GetGradeBook\",\"Unit_Number\":\""+unit_no+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradeBookCallback);
}

/* 
* GetGradeBookCallback () : callback to GetGradeBook()
* 
*/
function GetGradeBookCallback(pobjGradeBookJsonData) {
    if(pobjGradeBookJsonData !== null) objNoteBookData = JSON.parse(pobjGradeBookJsonData);
    else objNoteBookData = null;
}


/**
* GetResoruce method
* Uses: to get the resouce json file & media path
**/
function GetResourceInfo() {
    var params = "{\"method\":\"GetResourceInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetResourceInfoCallback);
}
/**
* GetResourceInfoCallback method
* Uses: Callback method of GetResourceInfo
**/
function GetResourceInfoCallback (pobjResourceJsonData) {
    if(pobjResourceJsonData !== null) objResourceJsonData = $.parseJSON(pobjResourceJsonData);
    else objResourceJsonData = null;
}

/**
* HideBottomBarForNotebook
* Uses: to show/hide the bottom bar for Notebook module.
**/
function HideNativeBottomBar (status) {
	var params = "{\"method\":\"HideNativeBottomBar\",\"status\":"+status+"}";
	callNativeBridge("JSToNativeCommunication", params);
}

/**
* SetBroadcastSlide method
* Uses: to send media path to start/stop broadcast
**/
function SetBroadcastSlide(type, action, mediaId, pquestionInfo, pmediaFullURL, pmediaActionType) {

	var questionInfo = typeof pquestionInfo == "undefined" ? ''  : pquestionInfo;
	var mediaFullURL   = typeof pmediaFullURL == "undefined" ? ''  : pmediaFullURL;
	var mediaActionType = typeof pmediaActionType == "undefined" ? ''  : pmediaActionType;

    var params = "{\"method\":\"SetBroadcastSlide\",\"type\":\""+type+"\",\"action\":\""+action+"\",\"mediaid\":\""+mediaId+"\",\"questionInfo\":\""+questionInfo+"\",\"mediaFullURL\":\""+mediaFullURL+"\",\"mediaActionType\":\""+mediaActionType+"\"}";	
	
    callNativeBridge("JSToNativeCommunication", params, SetBroadcastSlideCallback);
}

/**
* SetBroadcastSlideCallback method
* Uses: callback method of SetBroadcastSlide() 
**/
function SetBroadcastSlideCallback(response) {
    document.body.innerHTML+="<br>"+response;
    if (onSuccess) {
        onSuccess();
    }            
}

/**
* GetBroadcastInfo method
* Uses: to get the resouce json file & media path for broadcast
**/
function GetBroadcastInfo() {
    var params = "{\"method\":\"GetBroadcastInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetBroadcastInfoCallback);
}

/**
* GetBroadcastInfoCallback method
* Uses: callback method of GetBroadcastInfo() 
**/
function GetBroadcastInfoCallback(pobjBroadcastJsonData) {  
    
    if(pobjBroadcastJsonData !== null) objBroadcastJsonData = JSON.parse(pobjBroadcastJsonData);
    else objBroadcastJsonData = null;
}

/**
* GetPerformanceInfo Method
* Uses: To get the Total Units, Total Weeks, Total Lessons, Current Unit, Current Week, PerformanceInfo.js path ( contains Assignment Grouping & Benchmark Constans) for Performance Tab
*/
function GetPerformanceInfo() {
    var params = "{\"method\":\"GetPerformanceInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetPerformanceInfoCallback);
}

/**
* GetPerformanceInfoCallback method
* Uses: callback method of GetPerformanceInfo() 
**/
function GetPerformanceInfoCallback (pobjPerformanceInfoJsonData) {
    if(pobjPerformanceInfoJsonData !== null) objPerformanceInfoJsonData = JSON.parse(pobjPerformanceInfoJsonData);
    else objPerformanceInfoJsonData = null;
}

/*
* GetGradebookForStudent () :
*/

function GetGradebookForStudent() {
    var params = "{\"method\":\"GetGradebookForStudent\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradebookForStudentCallback);
}

/* 
* GetGradebookForStudentCallback () : callback to GetGradebookForStudent()
* 
*/
function GetGradebookForStudentCallback(pobjGradeBookJsonData) {
    if(pobjGradeBookJsonData !== null) objNoteBookData = JSON.parse(pobjGradeBookJsonData);
    else objNoteBookData = null;
}

/* 
* SetGoogleAnalytic () : call Google Analytic for various events
* 
*/
function SetGoogleAnalytic(verbid, itemId) {
	var itemId = typeof itemId == "undefined" ? ''  : itemId;
	var params = "{\"method\":\"SetGoogleAnalytic\",\"verbid\":\""+verbid+"\",\"itemId\":\""+itemId+"\"}";
	
    callNativeBridge("JSToNativeCommunication", params, SetGoogleAnalyticCallback);
}

/* 
* SetGoogleAnalyticCallback () : callback to SetGoogleAnalytic()
* 
*/
function SetGoogleAnalyticCallback() {
    
}
/*
* GetListOfConferenceStudentData () : 
*
*/
function GetListOfConferenceStudentData(conferenceType, studentId) {

    var conferenceType   = typeof conferenceType == "undefined" ? ''  : conferenceType;	
    var studentId   = typeof studentId == "undefined" ? ''  : studentId;	
    var params = "{\"method\":\"GetListOfConferenceStudentData\",\"conferenceType\":\""+conferenceType+"\",\"studentId\":\""+studentId+"\"}";	
    callNativeBridge("JSToNativeCommunication", params, GetListOfConferenceStudentDataCallback);
}

/*
* GetListOfConferenceStudentDataCallback () : 
*
*/
function GetListOfConferenceStudentDataCallback(pobjconferenceListStudentData) {
	if(pobjconferenceListStudentData !== null) {
		objconferenceListStudentData = JSON.parse(pobjconferenceListStudentData);
	}
	else objconferenceListStudentData = null;
}

/*
* GetConferenceStudentData () :
*
*/
function GetConferenceStudentData(conferenceType, studentId,itemId) {

	var conferenceType   = typeof conferenceType == "undefined" ? ''  : conferenceType;
	var studentId   = typeof studentId == "undefined" ? ''  : studentId;
	var itemId   = typeof itemId == "undefined" ? ''  : itemId;
	//var conferenceType   = typeof conferenceType == "undefined" ? ''  : conferenceType;
	var params = "{\"method\":\"GetConferenceStudentData\",\"conferenceType\":\""+conferenceType+"\",\"studentId\":\""+studentId+"\",\"itemId\":\""+itemId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetConferenceStudentDataCallback);
}

/*
* GetConferenceStudentDataCallback () :
*
*/
function GetConferenceStudentDataCallback(pobjconferenceStudentData) {
	if(pobjconferenceStudentData !== null){
		objconferenceStudentData = JSON.parse(pobjconferenceStudentData);
	}
	else{
		objconferenceStudentData = null;
	}
}


/*
* SaveConferenceStudentData () :
*
*/
function SaveConferenceStudentData(studentId,itemId,finalScore,conferenceData,conferenceType,conferenceTitle) {

    var studentId   = typeof studentId == "undefined" ? ''  : studentId;
    var itemId   = typeof itemId == "undefined" ? ''  : itemId;
    var finalScore   = typeof finalScore == "undefined" ? ''  : finalScore;
    var conferenceData   = typeof conferenceData == "undefined" ? ''  : conferenceData;
    var conferenceType   = typeof conferenceType == "undefined" ? ''  : conferenceType;
    var conferenceTitle   = typeof conferenceTitle == "undefined" ? ''  : conferenceTitle;
    var paramsJson = {"method":"SaveConferenceStudentData","studentId":studentId,"itemId":itemId,"finalScore":finalScore,"conferenceData":conferenceData,"conferenceType":conferenceType,"conferenceTitle":conferenceTitle};
	var params = JSON.stringify(paramsJson);
    
	callNativeBridge("JSToNativeCommunication", params, SaveConferenceStudentDataCallback);
}
/*
* SaveConferenceStudentDataCallback () :
*
*/
function SaveConferenceStudentDataCallback(pobjconferenceStudentData) {
	if(pobjconferenceStudentData !== null){
		objconferenceStudentData = JSON.parse(pobjconferenceStudentData);
	}
	else{
		objconferenceStudentData = null;
	}
}

/*
 * GetLibraryProgressSummary () :
 * @method GetLibraryProgressSummary
 * @param {Object} pobjLibraryProgress
 * @return 
*/
function GetLibraryProgressSummary(studentID) {
	var studentID  = typeof studentID == "undefined" ? ''  : studentID;
	var params = "{\"method\":\"GetLibraryProgressSummary\",\"studentID\":\""+studentID+"\"}";	
    callNativeBridge("JSToNativeCommunication", params, GetLibraryProgressSummaryCallback);
}

/**
 * Library Progress Callback :: From Native
 * @method GetLibraryProgressSummaryCallback
 * @param {Object} pobjLibraryProgressSummary
 * @return 
 */
function GetLibraryProgressSummaryCallback(pobjLibraryProgressSummary) {       
    if (pobjLibraryProgressSummary !== null) {
		objLibraryProgressSummary = JSON.parse(pobjLibraryProgressSummary); // used in conference		
	}
    else {
		objLibraryProgressSummary = null;
	}
	
	if (typeof LibraryCarouselView != 'undefined') {
		LibraryCarouselView.libraryProgressSummary = objLibraryProgressSummary;
	}
};

/*
* GetLibraryProgress () :
*
*/

function GetLibraryProgress(studentId, itemId) {
	var studentId   = typeof studentId == "undefined" ? ''  : studentId;
    var itemId   = typeof itemId == "undefined" ? ''  : itemId;
	var params = "{\"method\":\"GetLibraryProgress\",\"studentId\":\""+studentId+"\",\"itemId\":\""+itemId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetLibraryProgressCallback);
}


/*
* SaveLibraryProgress () :
*
*/

function SaveLibraryProgress(studentId, itemId, progressDataSummary, progressDataDetails, numberOfWordsRead, isBroadcast, totTimeSpentInSec, bookLexileLevel) {

	var studentId   = typeof studentId == "undefined" ? ''  : studentId;
    var itemId   = typeof itemId == "undefined" ? ''  : itemId;
    var bookLexileLevel   = typeof bookLexileLevel == "undefined" ? ''  : bookLexileLevel;
    var progressDataSummary   = typeof progressDataSummary == "undefined" ? ''  : progressDataSummary;
    var progressDataDetails   = typeof progressDataDetails == "undefined" ? ''  : progressDataDetails;
    var numberOfWordsRead   = typeof numberOfWordsRead == "undefined" ? ''  : numberOfWordsRead;
    var totTimeSpentInSec   = typeof totTimeSpentInSec == "undefined" ? ''  : totTimeSpentInSec;
    var isBroadcast   		= typeof isBroadcast == "undefined" ? ''  : isBroadcast; // 'isBroadcast' is added so that windows can detect whether 'savelibrary' call has been triggered from broadcasted window or main window (of eBook)
	
	var params = "{\"method\":\"SaveLibraryProgress\",\"studentId\":\""+studentId+"\",\"itemId\":\""+itemId+"\",\"bookLexileLevel\":\""+bookLexileLevel+"\",\"progressDataSummary\":\""+progressDataSummary+"\",\"progressDataDetails\":\""+progressDataDetails+"\",\"numberOfWordsRead\":\""+numberOfWordsRead+"\",\"isBroadcast\":"+isBroadcast+",\"totNumberOfSecondsSpent\":\""+totTimeSpentInSec+"\"}";
	callNativeBridge("JSToNativeCommunication", params, GetSaveLibraryProgressCallback);	
}

/*
* GetSaveLibraryProgressCallback () :
*
*/
function GetSaveLibraryProgressCallback(pobjlibraryProgressData) {
	/* done for auto book read */
	if (pobjlibraryProgressData !== null) {
		objSaveLibraryProgressResponse = JSON.parse(pobjlibraryProgressData);
	}
	else{
		objSaveLibraryProgressResponse = null;
	}
	
//	LessonConferenceView.saveLibraryDataCallback(pobjlibraryProgressData);
}

/**
 * Get Current Read Book For Student
 * @param {String} psStudentId Student Id
 */

function GetCurrentBookForStudent (psStudentId) {
    var sStudentId = psStudentId || '';
    var params = "{\"method\":\"GetCurrentBookForStudent\",\"StudentId\":\""+sStudentId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetCurrentBookForStudentCallback);
}

/**
 * Get Current Read Book For Student Callback
 * @param {Object} pobjCurrentBookForStudent Student Current read Book
 */
function GetCurrentBookForStudentCallback(pobjCurrentBookForStudent) {
    if(pobjCurrentBookForStudent !== null) objCurrentBookForStudent = JSON.parse(pobjCurrentBookForStudent);
    else objCurrentBookForStudent = null;    
}

/**
 * Set Current Read Book Id
 * @param {String} psBookId
 * @returns {undefined}
 */
function SetCurrentBookForStudent(psBookId) {
    var params = "{\"method\":\"SetCurrentBookForStudent\",\"ItemID\":\""+psBookId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, SetCurrentBookForStudentCallback);
}

/**
 * Set Current Read Book Id Callback
 * @returns {undefined}
 */
function SetCurrentBookForStudentCallback () {
    
}

/**
 * Get User Level
 * @returns {undefined}
 */
function GetUserLevel(pStudentId) {
	var sStudentId = pStudentId || "";
	params = "{\"method\":\"GetUserLevel\",\"studentId\":\""+sStudentId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetUserLevelCallback);
}

/**
 * Get User Level Callback
 * @param {type} pobjUserLevel
 * @returns {undefined}
 */
function GetUserLevelCallback(pobjUserLevel) {
    if(pobjUserLevel !== null) objUserLevel = JSON.parse(pobjUserLevel);
    else objUserLevel = null;    
}

/**
 * Set User Level
 * @param {String} psStudentId
 * @param {Number} piLexileLevel
 * @param {Number} piReadingLevel
 * @returns {undefined}
 */
function SetUserLevel(psStudentId, piLexileLevel, piReadingLevel, pUserReadingLevelDetails, pUserLexileLevelDetails) {
    var paramsJson = {"method":"SetUserLevel","StudentID":psStudentId,"LexileLevel":piLexileLevel,"ReadingLevel":piReadingLevel,"UserReadingLevelDetails":pUserReadingLevelDetails,"UserLexileLevelDetails":pUserLexileLevelDetails};
	var params = JSON.stringify(paramsJson);
    callNativeBridge("JSToNativeCommunication", params, SetUserLevelCallback);
};

/**
 * Set User Level callback
 * @returns {undefined}
 */
function SetUserLevelCallback() {
    
}

/**
 * GetGradebookForInstructorV2 () : for calling GetGradebook web service 
 * @param {String} sFilterType
 * @param {String} sValue
 * @param {Boolean} bisFullClass
 * @param {Object} objStudIds
 * @returns {undefined}
 * callback - GetGradebookForInstructorV2Callback()
 */
function GetGradebookForInstructorV2 (sFilterType, sValue, bisFullClass, objStudIds) {	
	var params = "{\"method\":\"GetGradebookForInstructorV2\",\"unitNumber\":\""+sValue+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradebookForInstructorV2Callback);
}

/* 
* GetGradebookForInstructorV2Callback () : callback to GetGradebookForInstructorV2()
* @param: {Object} pobjGradeBookV2JsonData
*/
function GetGradebookForInstructorV2Callback(pobjGradeBookV2JsonData) {	
	if(pobjGradeBookV2JsonData !== null) objGradeBookV2JsonData = JSON.parse(pobjGradeBookV2JsonData);
    else objGradeBookV2JsonData = null;
}

/**
 * GetGradebookAttemptData () : for calling GetGradebookAttemptData web service 
 * @param {Array} paIAID
 * @returns {undefined}
 * callback - GetGradebookAttemptDataCallback()
 */
 
 function GetGradebookAttemptData (paIAID) {	
	var aIAID	=	paIAID;//paIAID.join();
	//var params = "{\"method\":\"GetGradebookAttemptData\",\"attemptIdInfo\":\""+aIAID+"\"}";
	var params  = JSON.stringify({method: 'GetGradebookAttemptData',attemptIdInfo: aIAID});
    callNativeBridge("JSToNativeCommunication", params, GetGradebookAttemptDataCallback);
 }
 
/* 
 * GetGradebookAttemptDataCallback () : callback to GetGradebookAttemptData()
 * @param: {Object} pobjGradeBookJsonData
 */
 function GetGradebookAttemptDataCallback (pobjGradeBookJsonData) {
	var oResponse = (objPlatform.isBrowser()) ? pobjGradeBookJsonData : decodeURIComponent(pobjGradeBookJsonData);
	if(pobjGradeBookJsonData !== null) objGradeBookJsonData = JSON.parse(oResponse);
    else objGradeBookJsonData = null;
 }
/**
 * GetIWTTotalWordCount () : for calling GetIWTTotalWordCount web service * 
 * @returns {undefined}
 * callback - GetIWTTotalWordCountCallback()
 */	
function GetIWTTotalWordCount () {
	var params  = JSON.stringify({method: 'GetIWTTotalWordCount'});
    callNativeBridge("JSToNativeCommunication", params, GetIWTTotalWordCountCallback);
}

/**
 * GetIWTTotalWordCountCallback () : callback to GetIWTTotalWordCount()
 * @param: {Object} poIWTTotalWordCount
 */
function GetIWTTotalWordCountCallback (poIWTTotalWordCount) {
	if(poIWTTotalWordCount !== null) oIWTTotalWordCount = JSON.parse(poIWTTotalWordCount);
    else oIWTTotalWordCount = null;
}
//CHECK IF THE DEVICE IS WINRT
function fnIsWinRT() {
    var paramsJson = { "method": "fnIsWinRT" };
    var params = JSON.stringify(paramsJson);
    callNativeBridge("JSToNativeCommunication", params, fnIsWinRTCallback);
}

function fnIsWinRTCallback(flag) {
    isWinRT = flag;
}

/**
 * Lunch PDF in Ereader
 * @param {String} sBookId Book Id
 * @param {String} sBookTitle Book Title
 * @param {String} sBookType Book Type - RATA|Time To Read
 * @param {Integer} iBookNumPage Book Page Number
 * @param {Int} iWordCount Number Of Words
 */
function GetPDFInfo(sBookId, sBookTitle, sBookType, iWordCount, iBookNumPage, context, bookLexileLevel) {
	var context   = typeof context == "undefined" ? ''  : context;
	var bookLexileLevel   = typeof bookLexileLevel == "undefined" ? ''  : bookLexileLevel;
    var params = "{\"method\":\"GetPDFInfo\",\"BookID\":\""+sBookId+"\",\"BookTitle\":\""+sBookTitle+"\",\"BookType\":\""+sBookType+"\",\"WordCount\":\""+iWordCount+"\",\"BookNumPage\":\""+iBookNumPage+"\",\"context\":\""+context+"\",\"bookLexileLevel\":\""+bookLexileLevel+"\"}";    
    callNativeBridge("JSToNativeCommunication", params, SetCurrentBookForStudentCallback);
}



/* 
* ShowWebView () : for calling native method to show the webview as Iframe.
* Param - method name and url to use the webview in JSOn format
*/
function ShowWebView(sIframeUrl) {
    var params = "{\"method\":\"ShowWebView\",\"pageUrl\":\""+sIframeUrl+"\"}";
    callNativeBridge("JSToNativeCommunication", params);
}

/* 
* CloseWebView () : for calling native method to show the webview as Iframe.
* Param - method name in JSON format
*/
function CloseWebView() {
    var params = "{\"method\":\"CloseWebView\"}";
    callNativeBridge("JSToNativeCommunication", params);
}

/* 
* GetSurveyResult () : for calling native method to get survey result.
* Param - method name in JSON format
*/
function GetSurveyResult(questionId) {
    var params = "{\"method\":\"GetSurveyResult\",\"questionId\":\""+questionId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetSurveyResultCallback);
}

/**
 * Get Survey Result Callback
 * @param {type} pobjsurveyResultData
 * @returns {undefined}
 */
function GetSurveyResultCallback(pobjsurveyResultData) {
    if(pobjsurveyResultData !== null) objsurveyResultData = JSON.parse(pobjsurveyResultData);
    else objsurveyResultData = null;    
}

/**
* HideEbookBroadcast () : for calling native method to hide broadcasted ebook.
* Param - method name in JSON format
 */
function HideEbookBroadcast() {
   var params = "{\"method\":\"HideEbookBroadcast\"}";
    callNativeBridge("JSToNativeCommunication", params);
}

//FUNCTION TO STOP TEXTHELP SPEAK
function stopTextHelpSpeak(){
	try { $rw_stopSpeech();	}catch (e){}
}

/**
* DisableNativeBottomBar () : for calling native method to hide bottom bar.
* Param - true/false flag
 */
function DisableNativeBottomBar(flag) {
   var params = "{\"method\":\"disableNativeBottomBar\",\"status\":\""+flag+"\"}";
    callNativeBridge("JSToNativeCommunication", params);
}

/**
* @method: GetUserSettings 
* @param none
* @uses: To get the personal data of an user. 
* @return void;
*/
function GetUserSettings() {       
	var params = "{\"method\":\"GetUserSettings\"}";
	callNativeBridge("JSToNativeCommunication", params, GetUserSettingsCallback);
}

/**
* @method: GetUserSettingsCallback 
* @param {string} response from native
* @uses:  callback method of GetUserSettings
* @return void;
*/
function GetUserSettingsCallback (sGetUserSettingsResponse) {
	objGetUserSettingsResponse = JSON.parse(sGetUserSettingsResponse);
}

/**
* @method: SaveUserSettings 
* @param {object} JSON data for PersonalSettings field
* @uses: To save the personal data of an user. 
* @return void;
*/
function SaveUserSettings(personalSettings) {       
	var paramsJson = {"method":"SaveUserSettings","personalSettings":personalSettings},
		params = JSON.stringify(paramsJson);
	callNativeBridge("JSToNativeCommunication", params, SaveUserSettingsCallback);
}

/**
* @method: SaveUserSettingsCallback 
* @param {string} response from native
* @uses:  callback method of SaveUserSettings
* @return void;
*/
function SaveUserSettingsCallback (sSaveUserSettingsResponse) {
	objSaveUserSettingsResponse = JSON.parse(sSaveUserSettingsResponse);
}

/**
* @method: GetUnitWeekDetails 
* @param none
* @uses: To get the current unitNumber & current weekNumber for notebook functionality from native. 
* @return void;
*/
function GetUnitWeekDetails() {
    var params = "{\"method\":\"GetUnitWeekDetails\"}";
    callNativeBridge("JSToNativeCommunication", params, GetUnitWeekDetailsCallback);
};

/**
* @method: GetUnitWeekDetailsCallback 
* @param {string} response from native
* @uses:  callback method of GetUnitWeekDetails
* @return void;
*/
function GetUnitWeekDetailsCallback(pobjCurrentUnitDetails) {
    if(pobjCurrentUnitDetails !== null) objCurrentUnitDetails = JSON.parse(pobjCurrentUnitDetails);
    else objCurrentUnitDetails = null;
};

/**
* @method: GetCurrentRATACallback 
* @param {string} response from native
* @uses: To get the current RATA book data. Basically callback method
* @return void;
*/
function GetCurrentRATACallback(pobjCurrentRATABook) {
    if(pobjCurrentRATABook !== null) objCurrentRATABook = JSON.parse(pobjCurrentRATABook);
    else objCurrentRATABook = null;
}

/**
* @method: GetLibraryProgressForClass 
* @param {string} itemId
* @uses: To get the Library Progress Data for Performance Tab
* @return void;
*/
function GetLibraryProgressForClass(itemId) {
	var itemId   = (typeof itemId == "undefined") ? ''  : itemId;
    var params = "{\"method\":\"GetLibraryProgressForClass\",\"itemId\":\""+itemId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetLibraryProgressForClassCallback);
}

/**
* @method GetLibraryProgressForClassCallback 
* @param {string} response from native
* @uses callback method of GetLibraryProgressForClass() 
* @return void;
*/
function GetLibraryProgressForClassCallback (pobjLibraryProgressForClass) {
    if(pobjLibraryProgressForClass !== null) objLibraryProgressForClass = JSON.parse(pobjLibraryProgressForClass);
    else objLibraryProgressForClass = null;
}
/**
* @method: GetLibraryProgressDetailForClass 
* @param {string} itemId
* @uses: To get the Library Progress Data for Performance Tab
* @return void;
*/
function GetLibraryProgressDetailForClass() {
    var params = "{\"method\":\"GetLibraryProgressDetailForClass\"}";
    callNativeBridge("JSToNativeCommunication", params, GetLibraryProgressDetailForClassCallback);
}

/**
* @method GetLibraryProgressDetailForClassCallback 
* @param {string} response from native
* @uses callback method of GetLibraryProgressDetailForClass() 
* @return void;
*/
function GetLibraryProgressDetailForClassCallback (pobjLibraryProgressDetailForClass) {
    if(pobjLibraryProgressDetailForClass !== null) objLibraryProgressDetailForClass = JSON.parse(pobjLibraryProgressDetailForClass);
    else objLibraryProgressDetailForClass = null;
}

/**
* @method: GetAppInfo
* @param none
* @uses: To get the Current App version & App platform
* @return void;
*/
function GetAppInfo() {
	var params = "{\"method\":\"GetAppInfo\"}";
    callNativeBridge("JSToNativeCommunication", params, GetAppInfoCallback);
}

/**
* @method GetAppInfoCallback 
* @param {string} response from native
* @uses callback method of GetAppInfo() 
* @return void;
*/
function GetAppInfoCallback(pobjAppVersionInfo) {
	if(pobjAppVersionInfo !== null) objAppVersionInfo = JSON.parse(pobjAppVersionInfo);
	else objAppVersionInfo = null;
}

/**
* Get Notebook List For Instructor
**/


function GetNotelistForInstructor(noteType,noteRefId,studentid) {
	var noteRefId   = noteRefId == null ? ''  : noteRefId;
	var studentid	= typeof studentid == "undefined" ? ''  : studentid;
	var noteType = noteType.toLowerCase();
    var params = "{\"method\":\"GetNotelistForInstructor\",\"noteType\":\""+noteType+"\",\"noteRefId\":\""+noteRefId+"\",\"studentid\":\""+studentid+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetNotelistForInstructorCallback);
}
/**
* Get Notebook List For Instructor Callback
**/
function GetNotelistForInstructorCallback(pobjNoteBookData) {
	if(pobjNoteBookData !== null) {
		pobjNoteBookData = pobjNoteBookData.replace(/\’/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\'/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\n/g, '&#10;');
		pobjNoteBookData = pobjNoteBookData.replace(/\t/g, '&nbsp;');
		pobjNoteBookData = pobjNoteBookData.replace(/\“/g, '&#34;');
		pobjNoteBookData = pobjNoteBookData.replace(/\”/g, '&#34;');
		objNoteBookData = JSON.parse(pobjNoteBookData);
	}else {
		objNoteBookData = null;
	}
	try {getNoteListDraw();} catch (e){}
}

function GetScribbleData(scribbleIDs) {
    var params = "{\"method\":\"GetScribbleData\", \"scribbleIDs\":\""+scribbleIDs+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetScribbleDataCallback);
}

function GetScribbleDataCallback(pobjScribbleData) {
    //alert(pobjScribbleData);
	try {
		objScribbleDetails = JSON.parse(decodeURIComponent(pobjScribbleData));				
	} catch (error) {
		alert(error.message);
	}
	//console.log(objScribbleDetails);
}

/**
* @method: GetSkillTaxonomyInformation 
* @param void
* @uses: To get the Skills information for Skill Based Report
* @return void;
*/
function GetSkillTaxonomyInformation() {
    var params = "{\"method\":\"GetSkillTaxonomyInformation\"}";
    callNativeBridge("JSToNativeCommunication", params, GetSkillTaxonomyInformationCallback);
}

/**
* @method GetSkillTaxonomyInformationCallback 
* @param {string} response from native
* @uses callback method of GetSkillTaxonomyInformation() 
* @return void;
*/
function GetSkillTaxonomyInformationCallback (pobjSkillTaxonomyInformation) {
    if(pobjSkillTaxonomyInformation !== null) objSkillTaxonomyInformation = JSON.parse(decodeURIComponent(pobjSkillTaxonomyInformation.replace(/\+/g, '%20')));
    else objSkillTaxonomyInformation = 0;
}

/**
* @method: GetSkillBasedReportDataByWeekRange 
* @param {integer} startUnit
* @param {integer} startUnitWeek
* @param {integer} endUnit 
* @param {integer} endUnitWeek
* @uses: To get the Skills information for Skill Based Report
* @return void;
*/
function GetSkillBasedReportDataByWeekRange() {
    var params = "{\"method\":\"GetSkillBasedReportDataByWeekRange\"}";
    callNativeBridge("JSToNativeCommunication", params, GetSkillBasedReportDataByWeekRangeCallback);
}

/**
* @method GetSkillBasedReportDataByWeekRangeCallback 
* @param {string} response from native
* @uses callback method of GetSkillBasedReportDataByWeekRange() 
* @return void;
*/
function GetSkillBasedReportDataByWeekRangeCallback (pobjSkillBasedReportDataByWeekRange) {
    if (pobjSkillBasedReportDataByWeekRange !== null) {
		objSkillBasedReportDataByWeekRange = JSON.parse(decodeURIComponent(pobjSkillBasedReportDataByWeekRange.replace(/\+/g, '%20')));
	}
    else {
		objSkillBasedReportDataByWeekRange = 0;
	}
}


/**
* Get Notebook List version 2
**/


function GetNotelistV2(noteType,noteRefId) {
	
	var noteRefId   = typeof noteRefId == "undefined" ? ''  : noteRefId;
	var noteType = noteType.toLowerCase();
    var params = "{\"method\":\"GetNotelistV2\",\"noteType\":\""+noteType+"\",\"noteRefId\":\""+noteRefId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetNotelistV2Callback);
}

/**
* Get Notebook List Callback
**/
function GetNotelistV2Callback(pobjNoteBookData) {
	if(pobjNoteBookData !== null) {
		pobjNoteBookData = pobjNoteBookData.replace(/\’/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\'/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\n/g, '&#10;');
		pobjNoteBookData = pobjNoteBookData.replace(/\t/g, '&nbsp;');
		pobjNoteBookData = pobjNoteBookData.replace(/\“/g, '&#34;');
		pobjNoteBookData = pobjNoteBookData.replace(/\”/g, '&#34;');
		objNoteBookData = JSON.parse(pobjNoteBookData);
	}else {
		objNoteBookData = null;
	}
	try {getNoteListDraw();} catch (e){}
}

/**
* Get Notebook List For Instructor version 2
**/
function GetNotelistForInstructorV2(noteType,noteRefId,studentid) {
	var noteRefId   = noteRefId == null ? ''  : noteRefId;
	var studentid	= typeof studentid == "undefined" ? ''  : studentid;
	var noteType = noteType.toLowerCase();
    var params = "{\"method\":\"GetNotelistForInstructorV2\",\"noteType\":\""+noteType+"\",\"noteRefId\":\""+noteRefId+"\",\"studentid\":\""+studentid+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetNotelistForInstructorV2Callback);
}
/**
* Get Notebook List For Instructor Callback
**/
function GetNotelistForInstructorV2Callback(pobjNoteBookData) {
	if(pobjNoteBookData !== null) {
		pobjNoteBookData = pobjNoteBookData.replace(/\’/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\'/g, '&#39;');
		pobjNoteBookData = pobjNoteBookData.replace(/\n/g, '&#10;');
		pobjNoteBookData = pobjNoteBookData.replace(/\t/g, '&nbsp;');
		pobjNoteBookData = pobjNoteBookData.replace(/\“/g, '&#34;');
		pobjNoteBookData = pobjNoteBookData.replace(/\”/g, '&#34;');
		objNoteBookData = JSON.parse(pobjNoteBookData);
	}else {
		objNoteBookData = null;
	}
	try {getNoteListDraw();} catch (e){}
}
/**
* Get Note Info
**/


function GetNoteInfo(noteID) {
	var noteID   = typeof noteID == "undefined" ? ''  : noteID;
    var params = "{\"method\":\"GetNoteInfo\",\"noteID\":\""+noteID+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetNoteInfoCallback);
}
/**
* Get Note Info callback
**/
function GetNoteInfoCallback(pobjNoteInfoData) { 
	if(pobjNoteInfoData !== null) {
		pobjNoteInfoData = pobjNoteInfoData.replace(/\’/g, '&#39;');
		pobjNoteInfoData = pobjNoteInfoData.replace(/\'/g, '&#39;');
		pobjNoteInfoData = pobjNoteInfoData.replace(/\n/g, '&#10;');
		pobjNoteInfoData = pobjNoteInfoData.replace(/\t/g, '&nbsp;');
		pobjNoteInfoData = pobjNoteInfoData.replace(/\“/g, '&#34;');
		pobjNoteInfoData = pobjNoteInfoData.replace(/\”/g, '&#34;');
		objNoteInfoData = JSON.parse(pobjNoteInfoData);
	}else {
		objNoteInfoData = null;
	}
	try {showNotesContent();} catch (e){}
}

/*
* GetGradebookForStudentV2 () :
*/

function GetGradebookForStudentV2() {
    var params = "{\"method\":\"GetGradebookForStudentV2\"}";
    callNativeBridge("JSToNativeCommunication", params, GetGradebookForStudentV2Callback);
}

/* 
* GetGradebookForStudentV2Callback () : callback to GetGradebookForStudentV2()
* 
*/
function GetGradebookForStudentV2Callback(pobjGradeBookJsonData) {
    if(pobjGradeBookJsonData !== null) objNoteBookData = JSON.parse(pobjGradeBookJsonData);
    else objNoteBookData = null;
}

/*
* GetGradebookAttemptDataForStudApp () :
*/

function GetGradebookAttemptDataForStudApp(paIAID) {
	var aIAID	=	paIAID;
	var params  = JSON.stringify({method: 'GetGradebookAttemptDataForStudApp',attemptIdInfo: aIAID});
    callNativeBridge("JSToNativeCommunication", params, GetGradebookAttemptDataForStudAppCallback);
}

/* 
* GetGradebookAttemptDataForStudAppCallback () : callback to GetGradebookAttemptDataForStudApp()
* 
*/
function GetGradebookAttemptDataForStudAppCallback(pobjGradebookAttemptDataForStudent) {
	var oResponse = (oPlatform.isBrowser()) ? pobjGradebookAttemptDataForStudent : decodeURIComponent(pobjGradebookAttemptDataForStudent.replace(/\+/g, '%20'));
	if(pobjGradebookAttemptDataForStudent !== null) {
		objGradebookAttemptDataForStudent = JSON.parse(oResponse);
	}
    else objGradebookAttemptDataForStudent = null;
	
}
/* RecordStopAudio() - start / stop recording audio for Oral Fluency 
* param: action
* callback : 
*/
function RecordStopAudio(action, assignmentId, questionId) {
	var paramsJson = {"method":"RecordStopAudio","action":action,"assignmentId":assignmentId,"questionId":questionId};
	var params = JSON.stringify(paramsJson);
	objRecordAudioDataResponse = null;
	
	callNativeBridge("JSToNativeCommunication", params, RecordStopAudioCallback);
}
/* RecordandStopAudioCallback() 
* param : none
*/
function RecordStopAudioCallback(pobjRecordAudioDataResponse) {	
	objRecordAudioDataResponse = JSON.parse(pobjRecordAudioDataResponse);	
}
/* PlayPauseAudio() - play / pause audio 
* param: action
* callback : 
*/
function PlayPauseAudio(action, assignmentId, questionId) {
	var paramsJson = {"method":"PlayPauseAudio","action":action,"assignmentId":assignmentId,"questionId":questionId};
	var params = JSON.stringify(paramsJson);
	objPlayPauseAudioResponse = null;
	callNativeBridge("JSToNativeCommunication", params, PlayPauseAudioCallback);
}
/* PlayPauseAudioCallback() 
* param : none
*/
function PlayPauseAudioCallback (pobjPlayPauseAudioResponse) {
	if (pobjPlayPauseAudioResponse !== null) {
		objPlayPauseAudioResponse = JSON.parse(pobjPlayPauseAudioResponse);	
	}
}
/* SaveAudio() - save audio for Oral Fluency 
* param: 
* callback : 
*/
function SaveAudio(assignmentId, questionId) {      
	var paramsJson = {"method":"SaveAudio","assignmentId":assignmentId,"questionId":questionId};	
	var params = JSON.stringify(paramsJson);
	objSaveAudioResponse = null;
	
	callNativeBridge("JSToNativeCommunication", params, SaveAudioCallback);
}
/* SaveAudioCallback() 
* param : none
*/
function SaveAudioCallback (pobjSaveAudioResponse) {	
	if (pobjSaveAudioResponse !== null) {
		objSaveAudioResponse = JSON.parse(pobjSaveAudioResponse);	
	}
}
/* OralfluencyReservation() - get pkt id for Oral Fluency 
* param: 
* callback : 
*/
function OralfluencyReservation() {      
	var paramsJson = {"method":"OralfluencyReservation"};	
	var params = JSON.stringify(paramsJson);
	objOralfluencyReservationResponse = null;
	
	callNativeBridge("JSToNativeCommunication", params, OralfluencyReservationCallback);
}
/* OralfluencyReservationCallback() 
* param : none
*/
function OralfluencyReservationCallback (pobjOralfluencyReservationResponse) {	
	if (pobjOralfluencyReservationResponse !== null) {
		objOralfluencyReservationResponse = JSON.parse(pobjOralfluencyReservationResponse);	
	}
}
/* OralfluencySubmitScoreRequest() - get pkt id for Oral Fluency 
* param: 
* callback : 
*/
function OralfluencySubmitScoreRequest(sPromptId, sAudioFileName, sAudioPath, sTestInstanceId) {      
	var paramsJson = {"method":"OralfluencySubmitScoreRequest","itemId":sPromptId,"itemType":"AUDIO_WAV","testInstanceId":sTestInstanceId,"contentName":	sAudioFileName,	"contentURL":	sAudioPath};	
	var params = JSON.stringify(paramsJson);
	objOralfluencySubmitScoreResponse = null;
	
	callNativeBridge("JSToNativeCommunication", params, OralfluencySubmitScoreRequestCallback);
}
/* OralfluencySubmitScoreRequestCallback() 
* param : none
*/
function OralfluencySubmitScoreRequestCallback (pobjOralfluencySubmitScoreResponse) {	
	if (pobjOralfluencySubmitScoreResponse !== null) {
		objOralfluencySubmitScoreResponse = JSON.parse(pobjOralfluencySubmitScoreResponse);	
	}
}
/* CheckMicStatus() - check if mic enabled 
* param: none
* callback : 
*/
function CheckMicStatus() {
	var paramsJson = {"method":"CheckMicStatus"};
	var params = JSON.stringify(paramsJson);
	objMicStatusResponse = null;
		
	callNativeBridge("JSToNativeCommunication", params, CheckMicStatusCallback);
}
/* CheckMicStatusCallback() 
* param : none
*/
function CheckMicStatusCallback(pobjMicStatusResponse) {	
	objMicStatusResponse = JSON.parse(pobjMicStatusResponse);	
}


/**
* @method: OralfluencyGetScoreData 
* @param {string} testInstanceId
* @uses: To get the Oral Fluency PKT score
* @return void;
*/
function OralfluencyGetScoreData(testInstanceId) {
    var params = "{\"method\":\"OralfluencyGetScoreData\",\"testInstanceId\":\""+testInstanceId+"\"}";
    callNativeBridge("JSToNativeCommunication", params, OralfluencyGetScoreDataCallback);
}

/**
* @method OralfluencyGetScoreDataCallback 
* @param {string} response from native
* @uses callback method of OralfluencyGetScoreData() 
* @return void;
*/
function OralfluencyGetScoreDataCallback (pobjOralfluencyGetScoreData) {
    if (pobjOralfluencyGetScoreData !== null) {
		objOralfluencyGetScoreData = JSON.parse(pobjOralfluencyGetScoreData);
	}
    else {
		objOralfluencyGetScoreData = 0;
	}
}

/**
* @method: GetClassUserLevel
* @param none
* @uses: To get the whole class User Level details
* @return void;
*/
function GetClassUserLevel() {
    var params = "{\"method\":\"GetClassUserLevel\"}";
    callNativeBridge("JSToNativeCommunication", params, GetClassUserLevelCallback);
}

/**
* @method GetClassUserLevelCallback 
* @param {string} response from native
* @uses callback method of GetClassUserLevel() 
* @return void;
*/
function GetClassUserLevelCallback (pobjGetClassUserLevel) {
    if (pobjGetClassUserLevel !== null) {
		objGetClassUserLevel = JSON.parse(pobjGetClassUserLevel);
	}
    else {
		objGetClassUserLevel = 0;
	}
}

/**
* @method UpdatePoll 
* @param {Number} PollID
* @param {String} PollTitle
* @param {String} PollQuestion
* @param {String} PollChoices (Stringified Object)
* @param {Number} DeletePoll
* @uses callback method UpdatePollCallback() 
* @return void;
*/
function UpdatePoll(PollID, PollTitle, PollQuestion, PollChoices, DeletePoll) {
	DeletePoll = (([0, 1].indexOf(DeletePoll) === -1)? 0: DeletePoll);
	var paramsJson = {
		"method":"UpdatePoll",
		"PollID":PollID,
		"PollTitle":PollTitle,
		"PollQuestion":PollQuestion,
		"PollChoices":PollChoices,
		"DeletePoll":DeletePoll
	};
	var params = JSON.stringify(paramsJson);
	callNativeBridge("JSToNativeCommunication", params, UpdatePollCallback);
}

/**
* @method UpdatePollCallback
* @param {String} pobjUpdatePollResponse (Stringified Object) 
* @return void;
*/
function UpdatePollCallback (pobjUpdatePollResponse) {	
	if (pobjUpdatePollResponse !== null) {
		objUpdatePollResponse = JSON.parse(pobjUpdatePollResponse);	
	}
}

/**
* @method SetBuzzComment 
* @param {Number} pnResetforWholeClass (1/ 0)
* @param {Number} pnIsCommentForClass (1/ 0)
* @param {String} psSelectedStudentIds
* @param {Number} pdRatingScore
* @param {String} psBuzzCommentData (Stringified Object)
* @uses callback method SetBuzzCommentCallback() 
* @return void;
*/
function SetBuzzComment(
	piResetforWholeClass,
	piIsCommentForClass,
	piSelectedStudentId,
	pdRatingScore,
	psBuzzCommentData
) {
	var oParameters = {
		'method':				'SetBuzzComment',
		'ResetCmtForClass':		([0, 1].indexOf(parseInt(piResetforWholeClass)) === -1? 0: piResetforWholeClass),
		'IsCommentForClass':	([0, 1].indexOf(parseInt(piIsCommentForClass)) === -1? 0: piIsCommentForClass),
		'StudentID':			(parseInt(piSelectedStudentId) || ''),
		'StarCount':			(parseFloat(pdRatingScore) || 0.0),
		'CMTForBuzz':			(typeof psBuzzCommentData !== 'string'? '': psBuzzCommentData)
	};
    
	callNativeBridge("JSToNativeCommunication", JSON.stringify(oParameters), SetBuzzCommentCallback);
}

/**
* @method SetBuzzCommentCallback 
* @param {String} pobjBuzzData (Stringified Object | Response from the Services)
* @return {undefined}
*/
function SetBuzzCommentCallback(pobjBuzzData) {
	if (pobjBuzzData !== null) {
		objBuzzData = JSON.parse(pobjBuzzData);
	}
	else {
		objBuzzData = null;
	}
}

/**
* @method GetBuzzCmtDetails
* @uses callback method GetBuzzCmtDetailsCallback() 
* @return {undefined}
*/
function GetBuzzCmtDetails () {
	var oParameters = {
		'method':	'GetBuzzCmtDetails'
	};
    
	callNativeBridge("JSToNativeCommunication", JSON.stringify(oParameters), GetBuzzCmtDetailsCallback);
}

/**
* @method GetBuzzCmtDetailsCallback 
* @param {String} pobjBuzzListData (Stringified Object | Response from the Services)
* @return {undefined}
*/
function GetBuzzCmtDetailsCallback(pobjBuzzListData) {
	if (pobjBuzzListData !== null){
		objBuzzListData = JSON.parse(pobjBuzzListData);
	}
	else{
		objBuzzListData = null;
	}
}

/**
* @method GetPollList
* @uses callback method GetPollListCallback() 
* @return {undefined}
*/
function GetPollList () {
	var oParameters = {
		'method':	'GetPollList'
	};
    
	callNativeBridge("JSToNativeCommunication", JSON.stringify(oParameters), GetPollListCallback);
}

/**
* @method GetPollListCallback 
* @param {String} pobjPollListData (Stringified Object | Response from the Services)
* @return {undefined}
*/
function GetPollListCallback(pobjPollListData) {
	if (pobjPollListData !== null){
		objPollListData = JSON.parse(pobjPollListData);
	}
	else{
		objPollListData = null;
	}
}

/**
* @method GetPollInfo
* @param {Number} piPollId
* @uses callback method GetPollInfoCallback() 
* @return {undefined}
*/
function GetPollInfo (piPollId) {
	var oParameters = {
		'method':	'GetPollInfo',
		'PollID':	(parseInt(piPollId) || -1)
	};
    
	callNativeBridge("JSToNativeCommunication", JSON.stringify(oParameters), GetPollInfoCallback);
}

/**
* @method GetPollInfoCallback 
* @param {String} pobjPollInfoData (Stringified Object | Response from the Services)
* @return {undefined}
*/
function GetPollInfoCallback (pobjPollInfoData) {
	if (pobjPollInfoData !== null){
		objPollInfoData = JSON.parse(pobjPollInfoData);
	}
	else{
		objPollInfoData = null;
	}
}

/**
* @method CloseConnectWindow 
* @return {undefined}
*/
function CloseConnectWindow () {
	var dollar = top.$,
		parentWindow = window.parent;
	
	setTimeout(function () {
		dollar('.connectWrapper').fadeOut('fast', function () {
			dollar('.wrapper').show();
			try {
				top.resize();
			}
			catch (oException) {
				alert(oException);
				parentWindow.resize();
			}
			dollar('#connectFrame').attr('src', 'about:blank');
		});
	}, 10);
}

/**
* @method CloseReviewWindow 
* @return {undefined}
*/
function CloseReviewWindow () {
	var dollar = top.$,
		parentWindow = window.parent;
	
	setTimeout(function () {
		dollar('.bookReviewWrapper').fadeOut('fast', function () {
			dollar('.wrapper').show();
			try {
				top.resize();
			}
			catch (oException) {
				alert(oException);
				parentWindow.resize();
			}
			dollar('#bookReviewFrame').attr('src', 'about:blank');
		});
	}, 10);
}

/**
 * @method GetClassSettings
 * @uses callback method GetClassSettingsCallback() 
 * @return {undefined}
 */
function GetClassSettings () {
	var oParameters = {
		'method':	'GetClassSettings'
	};
    
	callNativeBridge("JSToNativeCommunication", JSON.stringify(oParameters), GetClassSettingsCallback);
}

/**
 * @method GetClassSettingsCallback 
 * @param {String} pobjSettingsData (Stringified Object | Response from the Services)
 * @return {undefined}
 */
function GetClassSettingsCallback(pobjSettingsData) {
	if (pobjSettingsData !== null) {
		objSettingsData = JSON.parse(pobjSettingsData);
	}
	else{
		objSettingsData = null;
	}
}

/**
 * @method: SaveClassSettings() - SaveClassSettings web service call
 * @param: sASM,
 * @param: sAOFS,
 * @param: sSCR,
 * @param: sCGN,
 * @param: sSDS,
 * @param: sPS,
 * @param: saveGlobally
 * @uses: SaveClassSettingsCallback
 */
function SaveClassSettings(sASM, sAOFS, sSCR, sCGN, sSDS, sPS, sALRS, sANERS, saveGlobally) {
    var paramsJson = {
		"method":"SaveClassSettings",
		"sASM":sASM,
		"sAOFS":sAOFS,
		"sSCR":sSCR,
		"sCGN":sCGN,
		"sSDS":sSDS,
		"sPS":sPS,
		"sALRS":sALRS,
		"sANERS":sANERS,
		"saveGlobally":saveGlobally
	};
   
   var params = JSON.stringify(paramsJson);	
   callNativeBridge("JSToNativeCommunication", params, SaveClassSettingsCallback);
}

/**
 * SaveClassSettingsCallback() 
 * @param: pobjSaveClassSettingsResponse (Stringified JSON | Response from Services)
 */
function SaveClassSettingsCallback (pobjSaveClassSettingsResponse) {
	objSaveClassSettingsResponse = JSON.parse(pobjSaveClassSettingsResponse);
}

/**
 * @method: SaveClassCalendarSettings() - SaveClassCalendarSettings web service call
 * @param: sACJ,
 * @param: saveGlobally
 * @uses: SaveClassCalendarSettingsCallback
 */
function SaveClassCalendarSettings(sACJ, saveGlobally) {
    var paramsJson = {
		"method":		"SaveClassCalendarSettings",
		"sACJ":			sACJ,
		"saveGlobally":	saveGlobally
	};
   
   var params = JSON.stringify(paramsJson);	
   callNativeBridge("JSToNativeCommunication", params, SaveClassCalendarSettingsCallback);
}

/**
 * SaveClassCalendarSettingsCallback() 
 * @param: pobjSaveClassCalendarSettingsResponse (Stringified JSON | Response from Services)
 */
function SaveClassCalendarSettingsCallback (pobjSaveClassCalendarSettingsResponse) {
	objSaveClassCalendarSettingsResponse = JSON.parse(pobjSaveClassCalendarSettingsResponse);
}
/* 
* GetCurrentWeekForClass () : for calling GetCurrentWeekForClass web service 
* Param - none
* callback - GetCurrentWeekForClassCallback()
*/
function GetCurrentWeekForClass() {
    var params = "{\"method\":\"GetCurrentWeekForClass\"}";
    callNativeBridge("JSToNativeCommunication", params, GetCurrentWeekForClassCallback);
}

/* 
* GetCurrentWeekForClassCallback () : callback to GetCurrentWeekForClass()
* Param - current week json
*/
function GetCurrentWeekForClassCallback(pobjCurrentWeekJsonData) {    
    
    if(pobjCurrentWeekJsonData !== null) objCurrentWeekJsonData = JSON.parse(pobjCurrentWeekJsonData);
    else objCurrentWeekJsonData = null;

}

/** 
 * CheckAssignAutoScoreGradeableItems() : for calling CheckAssignAutoScoreGradeableItems web service
 * @param {Object} assignObj
 * @returns {undefined}
 * callback - CheckAssignAutoScoreGradeableItemsCallback()
 */
function CheckAssignAutoScoreGradeableItems(poAssignObj) {
	var params = JSON.stringify({ 
		"method": "CheckAssignAutoScoreGradeableItems"
	});
    callNativeBridge("JSToNativeCommunication", params, CheckAssignAutoScoreGradeableItemsCallback);
}

/** 
 * CheckAssignAutoScoreGradeableItemsCallback() : callback to CheckAssignAutoScoreGradeableItems()
 * @param {String} objCheckAssignAutoScoreGradeableItemsResponse (Stringified Object)
 */
function CheckAssignAutoScoreGradeableItemsCallback (pobjCheckAssignAutoScoreGradeableItemsResponse) {
    objCheckAssignAutoScoreGradeableItemsResponse = JSON.parse(pobjCheckAssignAutoScoreGradeableItemsResponse);
}
/** 
 * SetCurrentWeekForClass() : for calling SetCurrentWeekForClass web service
 * @param {Object} assignObj
 * @returns {undefined}
 * callback - GetGradeBookInfoCallback()
 */
function SetCurrentWeekForClass(piWeekNo) {
	var params = JSON.stringify({ 
		"method": "SetCurrentWeekForClass",
		"WeekNo": piWeekNo
	});
    callNativeBridge("JSToNativeCommunication", params, SetCurrentWeekForClassCallback);
}

/** 
 * SetCurrentWeekForClassCallback() : callback to SetCurrentWeekForClass()
 * @param {String} objCheckAndAssignGradeableItemResponse (Stringified Object)
 */
function SetCurrentWeekForClassCallback (pobjSetCurrentWeekForClassResponse) {
    objSetCurrentWeekForClassResponse = JSON.parse(pobjSetCurrentWeekForClassResponse);
}
/** 
 * SaveInterestInventory() : for calling SaveInterestInventory web service
 * @param {Object} poSurveyResponseJSON
 * @param {Object} poStudenInterestInventoryJSON
 * @returns {undefined}
 * callback - SaveInterestInventoryCallback()
 */
function SaveInterestInventory(poSurveyResponseJSON, poStudenInterestInventoryJSON, psInventoryTerm) {
	var params = JSON.stringify({ 
		"method": "SaveInterestInventory",
		"SurveyResponseJSON": poSurveyResponseJSON,
		"StudenInterestInventoryJSON": poStudenInterestInventoryJSON,
		"InventoryTerm" : psInventoryTerm
	});
    callNativeBridge("JSToNativeCommunication", params, SaveInterestInventoryCallback);
}

/** 
 * SaveInterestInventoryCallback() : callback to SaveInterestInventory()
 * @param {String} objSaveInterestInventoryResponse (Stringified Object)
 */
function SaveInterestInventoryCallback (pobjSaveInterestInventoryResponse) {
    objSaveInterestInventoryResponse = JSON.parse(pobjSaveInterestInventoryResponse);
	}
	
/** 
 * GetInterestInventory() : for calling GetInterestInventory web service
 * @param {Object} poSurveyResponseJSON
 * @param {Object} poStudenInterestInventoryJSON
 * @returns {undefined}
 * callback - SaveInterestInventoryCallback()
 */
function GetInterestInventory(studentID) {
	var params = JSON.stringify({ 
		"method": "GetInterestInventory",
		"studentID": studentID
	});
    callNativeBridge("JSToNativeCommunication", params, GetInterestInventoryCallback);
}

/** 
 * GetInterestInventoryCallback() : callback to GetInterestInventory()
 * @param {String} objSaveInterestInventoryResponse (Stringified Object)
 */
function GetInterestInventoryCallback (pobjGetInterestInventoryResponse) {
    objGetInterestInventoryResponse = JSON.parse(pobjGetInterestInventoryResponse);
}

/**
* @method: GetBookReviewFeedback 
* @param {Array} ItemIDs
* @uses: To get the book review feedbacks
* @return void;
*/
function GetBookReviewFeedback(ItemIDs, studentID) {
	var studentID   = typeof studentID == "undefined" ? ''  : studentID;
	
    var params = JSON.stringify({
		"method":	"GetBookReviewFeedback",
		"ItemIDs":	ItemIDs.toString(),
		"studentID": studentID
	});
    callNativeBridge("JSToNativeCommunication", params, GetBookReviewFeedbackCallback);
}

/**
* @method GetBookReviewFeedbackCallback 
* @param {string} response from native
* @uses callback method of GetBookReviewFeedback() 
* @return void;
*/
function GetBookReviewFeedbackCallback (pobjGetBookReviewFeedbackData) {
    if (pobjGetBookReviewFeedbackData !== null) {
		objGetBookReviewFeedbackData = JSON.parse(pobjGetBookReviewFeedbackData);
	}
    else {
		objGetBookReviewFeedbackData = 0;
	}
}


/**
* @method: SaveBookReviewFeedback 
* @param {string} ItemID
* @param {number} Rating
* @param {string} Comments
* @param {string} CSVFeedbackTags
* @uses: To save the book review feedback
* @return void;
*/
function SaveBookReviewFeedback(ItemID, Rating, Comments, CSVFeedbackTags) {
    var params = JSON.stringify({
		"method":"SaveBookReviewFeedback",
		"BookID": ItemID,
		"Rating": Rating,
		"Comments": Comments,
		"CSVFeedbackTags": CSVFeedbackTags
	});
    callNativeBridge("JSToNativeCommunication", params, SaveBookReviewFeedbackCallback);
}

/**
* @method SaveBookReviewFeedbackCallback 
* @param {string} response from native
* @uses callback method of SaveBookReviewFeedback() 
* @return void;
*/
function SaveBookReviewFeedbackCallback (pobjSaveBookReviewFeedbackData) {
    if (pobjSaveBookReviewFeedbackData !== null) {
		objSaveBookReviewFeedbackData = JSON.parse(pobjSaveBookReviewFeedbackData);
	}
    else {
		objSaveBookReviewFeedbackData = 0;
	}
}

/**
* @method: GetItemSkillMapping
* @uses: To get skill mappind data
* @return void;
*/
function GetItemSkillMapping() {
	var params = JSON.stringify({
		'method':	'GetItemSkillMapping'
	});
	callNativeBridge("JSToNativeCommunication", params, GetItemSkillMappingCallback);
}

/**
* @method GetItemSkillMappingCallback 
* @param {string} response from native
* @uses callback method of GetItemSkillMapping() 
* @return void;
*/
function GetItemSkillMappingCallback(pobjGetItemSkillMappingData) {
	if(pobjGetItemSkillMappingData !== null) objGetItemSkillMappingData = JSON.parse(pobjGetItemSkillMappingData);
    else objGetItemSkillMappingData = null;
}


/**
* @method: GetListOfReservedBooks
* @uses: 
* @return void;
*/
function GetListOfReservedBooks() {
    var params = "{\"method\":\"GetListOfReservedBooks\"}";
    callNativeBridge("JSToNativeCommunication", params, GetListOfReservedBooksCallback);
}

function GetListOfReservedBooksCallback (pobjReserveListData) {    
    if(pobjReserveListData !== null) objReserveListData = JSON.parse(pobjReserveListData);
    else objReserveListData = null;    
}

function ReserveOrUnreserveBook(sItemID, sAction) {
     var params = "{\"method\":\"ReserveOrUnreserveBook\",\"itemID\":\""+sItemID+"\",\"action\":"+sAction+"}";
    callNativeBridge("JSToNativeCommunication", params, ReserveOrUnreserveBookCallback);
}

function ReserveOrUnreserveBookCallback (pobjReserveUnreserveResponse) {        
    if(pobjReserveUnreserveResponse !== null) objReserveUnreserveResponse = JSON.parse(pobjReserveUnreserveResponse);
    else objReserveUnreserveResponse = null;    
}

/**
* @method: GetUserFeedbackforAllBooks
* @uses: To get user feedback for all Books
* @return void;
*/
function GetUserFeedbackforAllBooks() {	
     var params = "{\"method\":\"GetUserFeedbackforAllBooks\"}";
    callNativeBridge("JSToNativeCommunication", params, GetUserFeedbackforAllBooksCallback);
}

/**
* @method GetUserFeedbackforAllBooksCallback 
* @param {string} response from native
* @uses callback method of GetUserFeedbackforAllBooks() 
* @return void;
*/
function GetUserFeedbackforAllBooksCallback (pobjGetUserFeedbackforAllBooksResponse) {
     if(pobjGetUserFeedbackforAllBooksResponse !== null) objGetUserFeedbackforAllBooksData = JSON.parse(pobjGetUserFeedbackforAllBooksResponse);
    else objGetUserFeedbackforAllBooksData = null;    
}

/**
* @method: GetUserFeedbackforAllBooks
* @uses: To get user feedback for all Books
* @return void;
*/
function GetRecommendedBooks(studentID) {	
	var studentID   = typeof studentID == "undefined" ? ''  : studentID;
    var params = "{\"method\":\"GetRecommendedBooks\",\"studentID\":\""+studentID+"\"}";
    callNativeBridge("JSToNativeCommunication", params, GetRecommendedBooksCallback);
}

/**
* @method GetUserFeedbackforAllBooksCallback 
* @param {string} response from native
* @uses callback method of GetUserFeedbackforAllBooks() 
* @return void;
*/
function GetRecommendedBooksCallback (pobjGetRecommendedBooksResponse) {
     if(pobjGetRecommendedBooksResponse !== null) objrecommendationListData = JSON.parse(pobjGetRecommendedBooksResponse);
    else objrecommendationListData = null;    
}

/**
* @method: getCurrentDeviceTimestamp
* @uses: To get device time stamp
* @return void;
*/

function getCurrentDeviceTimestamp() {	
    var params = "{\"method\":\"getCurrentDeviceTimestamp\"}";
    callNativeBridge("JSToNativeCommunication", params, getCurrentDeviceTimestampCallback);
}

/**
* @method GetCurrentDeviceTimestampCallback 
* @param {string} response from native
* @uses callback method of getCurrentDeviceTimestamp() 
* @return void;
*/
function getCurrentDeviceTimestampCallback (poobjGetCurrentDeviceTimestampResponse) {
     if(poobjGetCurrentDeviceTimestampResponse !== null) objGetCurrentDeviceTimestamp = (typeof poobjGetCurrentDeviceTimestampResponse === 'string' || poobjGetCurrentDeviceTimestampResponse instanceof String) ? JSON.parse(poobjGetCurrentDeviceTimestampResponse) : poobjGetCurrentDeviceTimestampResponse;
    else objGetCurrentDeviceTimestamp = null;    
}

/********************************* WEBCLIENT CODE STARTS HERE ***************************************************/
function sp_GetPlannerInfo() {
	var contentBaseURL = getSessionStorageItem('contentBaseURL');
	var gradeCode = getSessionStorageItem('gradeCode');
	var gradePath = getSessionStorageItem('gradePath');
	var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	if(getSessionStorageItem("lessonInfoData") != null) {
		var lessonData = JSON.parse(getSessionStorageItem("lessonInfoData"));
		var jsonString = '{' + 
			'"rootFolderPath" : "' + contentBaseURL + '",' + 
			'"gradeId" : "' + gradeCode + '",' + 
			'"targetGradeCode" : "' + targetGradeCode + '",' + 
			'"jsPath" : "' + gradePath + 'grade_info_detail.js",' + 
			'"itemID" : "' + lessonData.itemId + '",' + 
			'"unitNumber" : "' + lessonData.unitNumber + '",' + 
			'"weekNumber" : "' + lessonData.weekNumber + '",' + 
			'"viewType" : "week",' + 
			'"tocJsPath" : "' + gradePath + 'grade_items.js' + '",' + 
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '"' + 
			'}';
	} else {
		var jsonString = '{' + 
			'"rootFolderPath" : "' + contentBaseURL + '",' + 
			'"gradeId" : "' + gradeCode + '",' + 
			'"targetGradeCode" : "' + targetGradeCode + '",' + 
			'"jsPath" : "' + gradePath + 'grade_info_detail.js",' + 
			'"itemID" : "",' + 
			'"unitNumber" : "",' + 
			'"weekNumber" : "",' + 
			'"viewType" : "week",' + 
			'"tocJsPath" : "' + gradePath + 'grade_items.js' + '",' + 
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '"' +
		'}';
	}
	GetPlannerInfoCallback(jsonString);
}

function sp_GetLessonInfo() {
	var userID = getSessionStorageItem("userID").trim();
	var classID = getSessionStorageItem("classID").trim();
	var contentBaseURL = getSessionStorageItem('contentBaseURL');
	var gradeCode = getSessionStorageItem('gradeCode');
	var gradePath = getSessionStorageItem('gradePath');
	var libraryPath = getSessionStorageItem('libraryPath');
	var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	enableLessonButton();
	if(getSessionStorageItem('lessonInfoData') != 'null' && getSessionStorageItem('previewLessonInfoData') == null) {
		var lessonInfoJson = JSON.parse(getSessionStorageItem("lessonInfoData"));
		var itemID = lessonInfoJson.itemId;
		var lessonBackupInfoData = getSessionStorageItem('lessonBackupInfoData');
		var rataBookID   = typeof lessonInfoJson.rataBookId == "undefined" ? ''  : lessonInfoJson.rataBookId;
		var teachFrom = String(lessonInfoJson.teachFrom).toLowerCase();
		var postObj2 = {};
		if(DENYFORCSR && lessonBackupInfoData == null) {
			if(lessonInfoJson.previewLesson == '0') {
				var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					ItemID: getServiceItemID(itemID)
				};
				var url = SERVICEBASEURL + "SetCurrentLessonForClass";
				AjaxCall(url, "POST", postObj, sp_SetCurrentLessonForClass);
				if(rataBookID != '') {
					postObj2 = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						ItemID: getServiceItemID(rataBookID)
					};
					var url = SERVICEBASEURL + "AssignBookForClass";
					AjaxCall(url, "POST", postObj2, sp_AssignBookForClass);
				}
			}
		} else {
			if(rataBookID != '' && teachFrom == 'supplementalrata' && DENYFORCSR) {
				postObj2 = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					ItemID: getServiceItemID(rataBookID)
				};
				var url = SERVICEBASEURL + "AssignBookForClass";
				AjaxCall(url, "POST", postObj2, sp_AssignBookForClass);
			} else if(teachFrom != 'lesson' && getSessionStorageItem("lessonBackupInfoData") != 'null' && getSessionStorageItem("lessonBackupInfoData") != null && DENYFORCSR) {
				var mailLessonRATABook = JSON.parse(getSessionStorageItem("lessonBackupInfoData")).rataBookId;
				mailLessonRATABook = typeof mailLessonRATABook == "undefined" ? ''  : mailLessonRATABook;
				if(mailLessonRATABook != '') {
					postObj2 = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						ItemID: getServiceItemID(mailLessonRATABook)
					};
					var url = SERVICEBASEURL + "AssignBookForClass";
					AjaxCall(url, "POST", postObj2, sp_AssignBookForClass);
				}
			}
		}
		var jsonString = '{ "rootFolderPath" : "' + contentBaseURL + '", "gradeId" : "' + gradeCode + '", "targetGradeCode" : "' + targetGradeCode + '", "itemId" : "' + itemID + '", "mediaPath" : "' + gradePath + itemID + '/media/", "videoPath" : "' + gradePath + itemID + '/media/", "jsPath" : "' + gradePath + itemID + '/' + itemID + '.js' + '", "previewLesson" : "' + lessonInfoJson.previewLesson + '", "unitNumber" : "' + lessonInfoJson.unitNumber + '", "weekNumber" : "' + lessonInfoJson.weekNumber + '", "jsPathLibrary" : "' + libraryPath + gradeCode + '_library.js", "currentVersion":"' + window.top.APPVERNUM + '","appPlatform":"' + window.top.APPTYPE + '", "serviceVersion" : "v2", "lessonType" : "'+ teachFrom +'", "isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '", "isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '", "productType" : "' + getSessionStorageItem("productType") + '" }';
		GetLessonInfoCallback(jsonString);
	} else {
		var previewLessonInfoData = JSON.parse(getSessionStorageItem("previewLessonInfoData"));
		var itemID = previewLessonInfoData.itemId;
		var jsonString = '{ "rootFolderPath" : "' + contentBaseURL + '", "gradeId" : "' + gradeCode + '", "targetGradeCode" : "' + targetGradeCode + '", "itemId" : "' + itemID + '", "mediaPath" : "' + gradePath + itemID + '/media/", "videoPath" : "' + gradePath + itemID + '/media/", "jsPath" : "' + gradePath + itemID + '/' + itemID + '.js' + '", "previewLesson" : "' + previewLessonInfoData.previewLesson + '", "unitNumber" : "' + previewLessonInfoData.unitNumber + '", "weekNumber" : "' + previewLessonInfoData.weekNumber + '", "jsPathLibrary" : "' + libraryPath + gradeCode + '_library.js", "currentVersion":"' + window.top.APPVERNUM + '","appPlatform":"' + window.top.APPTYPE + '", "serviceVersion" : "v2", "lessonType" : "'+ teachFrom +'", "isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '", "isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '", "productType" : "' + getSessionStorageItem("productType") + '" }';
		GetLessonInfoCallback(jsonString);
	}
}

function sp_SetCurrentLessonForClass(data) {
	if(data != null) {
		data = JSON.parse(data);
		if(data.Status != '200') {
			alert(data.Error.ErrorUserDescription);
		}
	}
}

function sp_AssignBookForClass(data) {
	if(data != null) {
		data = JSON.parse(data);
		if(data.Status != '200') {
			alert(data.Error.ErrorUserDescription);
		}
	}
}

function sp_SetProjectSlide(data)
{
	var returnData = {};
	if (data != null) {        
        data = JSON.parse(data);
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();

		if(data.action.toString() == 'Start')
		{
			setSessionStorageItem("projectedData", JSON.stringify(data));
			setSessionStorageItem('projectionStatus', 'Start');
			trackLog('SetProjectSlide'); // tracking projection log
		}
		if(data.action.toString() == 'Stop') {
			setSessionStorageItem('projectionStatus', 'Stop');
		}
			
		if(data.type.toLowerCase().trim() == 'image') {
			var mediaName = data.mediaid.toString().split('/');
			mediaName = mediaName[mediaName.length - 1];
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: data.type.trim(),
				MediaID: mediaName.trim(),
				MediaFullURL: mediaName.trim(),
				MediaActionType: 'NA',
				QuestionInformation: data.questionInfo.trim(),
			}
		}
		else if(data.type.toLowerCase().trim() == 'video') {
			var mediaName = data.mediaid.toString().split('/');
			mediaName = mediaName[mediaName.length - 1];
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: data.type.trim(),
				MediaID: mediaName.trim(),
				MediaFullURL: mediaName.trim(),
				MediaActionType: 'NA',
				QuestionInformation: data.questionInfo.trim(),
			}
		}
		else if(data.type.toLowerCase().trim() == 'survey') {
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: 'Question',
				MediaID: data.mediaid.trim(),
				MediaFullURL: "",
				MediaActionType: 'NA',
				QuestionInformation: data.questionInfo.trim(),
			}
		}
		else if(data.type.toLowerCase().trim() == 'TextNAudio'.toLowerCase()) {
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: data.type.trim(),
				MediaID: data.mediaid.trim(),
				MediaFullURL: data.mediaFullURL.trim(),
				MediaActionType: data.mediaActionType.trim(),
				QuestionInformation: data.questionInfo.trim(),
			}
		}
		else if(data.type.toLowerCase().trim() == 'buzz') { // IPP-4099
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: 'Buzz',
				MediaID: data.mediaid.trim(),
				MediaFullURL: "",
				MediaActionType: 'NA',
				QuestionInformation: data.questionInfo.trim(),
			}
		}
		else if(data.type.toLowerCase().trim() == 'adhocpoll') { // IPP-4099
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				ProjectItemType: data.type.trim(),
				MediaID: data.mediaid.trim(),
				MediaFullURL: "",
				MediaActionType: 'NA',
				QuestionInformation: data.questionInfo.trim(),
			}
		}
	}
	return returnData;
}

function sp_SetProjection(data)
{
	if(data != null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			window.top.changeIndicatorStatus('project');
		}
		SetProjectSlideCallback(data);
		checkSuccess(JSON.stringify(data));
	}
}

function sp_SetBroadcastSlide(data)
{
	var returnData = {};
	if (data != null) {
        data = JSON.parse(data);
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		
		if (data.type.toString().toLowerCase() !== 'buzz') { // IPP-4099
			if (data.action.toString() == 'Start') {
				setSessionStorageItem('broadcastData', JSON.stringify(data));
				setSessionStorageItem('broadcastStatus', 'Start');
				setSessionStorageItem('verbID', '');
			}
			else if(data.action.toString() == 'Stop') {
				setSessionStorageItem('broadcastStatus', 'Stop');
			}
		}
			
		if(data.type.toLowerCase().trim() == 'image') {
			var mediaName = data.mediaid.toString().split('/');
			mediaName = mediaName[mediaName.length - 1];
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				MediaType: data.type.trim(),                        
				MediaID: mediaName,
				MediaFullURL: mediaName,
				/* ScribbleData: "", */
				MediaActionType: "NA",
				QuestionInformation: ""
			}
		}
		else if(data.type.toLowerCase().trim() == 'video') {
			var mediaName = data.mediaid.toString().split('/');
			mediaName = mediaName[mediaName.length - 1];
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				MediaType: data.type.trim(),
				MediaID: mediaName,
				MediaFullURL: mediaName,
				/* ScribbleData: "", */
				MediaActionType: "NA",
				QuestionInformation: ""
			}
		}
		else if(data.type.toLowerCase().trim() == 'survey') {
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				MediaType: data.type.trim(),
				MediaID: mediaName,
				MediaFullURL: mediaName,
				/* ScribbleData: "", */
				MediaActionType: "NA",
				QuestionInformation: ""
			}
		}
		else if(data.type.toLowerCase().trim() == 'ebook') {
			var bookType = data.mediaFullURL.split('|||')[5];
			var mediaName = data.mediaid.trim();
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				MediaType: data.type.trim(),
				MediaID: mediaName,
				MediaFullURL: data.mediaFullURL.trim(),
				// ScribbleData: "",
				MediaActionType: "NA",
				QuestionInformation: data.questionInfo.trim()
			}
		}
		else if(data.type.toLowerCase().trim() == 'buzz') { // IPP-4099
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ActionType: data.action.trim(),
				MediaType: data.type.trim(),
				MediaID: mediaName,
				MediaFullURL: data.mediaFullURL.trim(),
				// ScribbleData: "",
				MediaActionType: "NA",
				QuestionInformation: data.questionInfo.trim()
			}
		}
	}
	return returnData;
}

function sp_SetBroadcast(data)
{
	if(data != null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			window.top.changeIndicatorStatus('broadcast');
		}
		checkSuccess(JSON.stringify(data));
	}
}

function sp_SetSurvey(data)
{
	var returnData = {};
	if (data != null) {        
        data = JSON.parse(data);
		var classID = getSessionStorageItem("classID").trim();
		var userID = getSessionStorageItem("userID").trim();
		var userType = CURRENTUSERROLE;
		var action = data.action.trim();
		var quesId = data.qid.trim();
		var quesInfo = data.questionInfo;
		var userResItemNo = "";
		var surveyType = (data.surveyType != "") ? data.surveyType : "LessonSurvey";
		
		if(action.toLowerCase() == 'Start'.toLowerCase()) {
			trackLog('surveyStarted'); // tracking survey log
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerClassID: classID,
				CallerUserID: userID,                       
				UserType: userType,
				SurveyType: surveyType,
				ActionType: action,
				QuestionID: quesId,
				QuestionInfo: quesInfo,
				UserResponseItemNo: userResItemNo

			};
			startUpdatingSurveyResult(quesId);
		}
		else if(action.toLowerCase() == 'Stop'.toLowerCase()) {
			trackLog('surveyFinished'); // tracking survey log
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerClassID: classID,
				CallerUserID: userID,                       
				UserType: userType,
				SurveyType: surveyType,
				ActionType: action,
				QuestionID: quesId,
				QuestionInfo: quesInfo,
				UserResponseItemNo: userResItemNo
			};
			stopUpdatingSurveyResult();
		}
		else if(action.toLowerCase() == 'Attempt'.toLowerCase()) {
			trackLog('surveyAttempted'); // tracking survey log
			userResItemNo = data.userResponseNo.trim();
			returnData = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerClassID: classID,
				CallerUserID: userID,                       
				UserType: userType,
				SurveyType: surveyType,
				ActionType: action,
				QuestionID: quesId,
				QuestionInfo: quesInfo,
				UserResponseItemNo: userResItemNo
			};
		}
	}
	return returnData;
}

function startUpdatingSurveyResult(qid) {
	var classID = getSessionStorageItem("classID").trim();
	var userID = getSessionStorageItem("userID").trim();
	var quId = qid;
	var postObj = {
			TokenID: TOKENID,
            DeviceTimeStamp: getCurTimeStamp(),
			CallerClassID: userID,
			CallerClassID: classID,
			QuestonID: qid
		};
	var url = SERVICEBASEURL + "GetSurveyResult";
	objTimeInterval = window.setInterval(function() {
		AjaxCall(url, "POST", postObj, showStudentResponse);
	}, timeIntervalSurveyResult);

}

function stopUpdatingSurveyResult() {
	window.clearInterval(objTimeInterval); 
}

function sp_GetLibraryInfo(data) {
	var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	var contentBaseURL = getSessionStorageItem('contentBaseURL');
	var gradeCode = getSessionStorageItem('gradeCode');
	var libraryPath = getSessionStorageItem('libraryPath');
	var libraryBasePath = getSessionStorageItem('libraryBookPath');
	var gradePath = getSessionStorageItem('gradePath');
	if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
		var jsonString = '{' +
			'"rootFolderPath" : "' + contentBaseURL + '",' +
			'"gradeId" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"mediaPath" : "' + libraryPath + 'media/",' +
			'"jsPath" : "' + libraryPath + gradeCode + '_library.js",' +
			'"viewType" : "teacher",' +
			'"gradeItemjsPath" : "' + gradePath + 'grade_items.js' + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '"' +
		'}';
	} else if(CURRENTUSERROLE == studRole) {
		var jsonString = '{' +
			'"rootFolderPath" : "' + contentBaseURL + '",' +
			'"gradeId" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"mediaPath" : "' + libraryPath + 'media/",' +
			'"jsPath" : "' + libraryPath + gradeCode + '_library.js",' +
			'"viewType" : "student",' +
			'"gradeItemjsPath" : "' + gradePath + 'grade_items.js",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '"' +
		'}';
	}
	GetLibraryInfoCallback(jsonString);
}

function sp_GetEbookInfo() {
	var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	var contentBaseURL = getSessionStorageItem('contentBaseURL');
	var libraryPath = getSessionStorageItem('libraryPath');
	var libraryBookPath = getSessionStorageItem('libraryBookPath');
	var bookId = getSessionStorageItem("BookID") + "/";
	var jsonString = '';
	if(CURRENTUSERROLE == studRole) {
		var classStatusJson = JSON.parse(window.top.CLASSSTATUSOBJ);
		var currentUnit = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonUnit;
		var currentWeek = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonWeek;
		var currentRataBookId = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : ((classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID == '') ? '' : getCMSItemID(classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID));
		jsonString = '{' +
			'"rootFolderPath" : "' + libraryBookPath + '",' +
			'"bookPath" : "' + libraryBookPath + bookId + '",' +
			'"currentUnit" : "' + currentUnit + '",' +
			'"currentWeek" : "' + currentWeek + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"currentRataBookId" : "' + currentRataBookId + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '"' +
		'}';
	} else if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
		var lessonInfoJson = getSessionStorageItem("lessonInfoData");
		var currentRataBookId = '';
		if(lessonInfoJson != null) {
			lessonInfoJson = JSON.parse(lessonInfoJson);
			var currentUnit = lessonInfoJson.unitNumber;
			var currentWeek = lessonInfoJson.weekNumber;
			jsonString = '{' +
				'"rootFolderPath" : "' + libraryBookPath + '",' +
				'"bookPath" : "' + libraryBookPath + bookId + '",' +
				'"currentUnit" : "' + currentUnit + '",' +
				'"currentWeek" : "' + currentWeek + '",' +
				'"targetGradeCode" : "' + targetGradeCode + '",' +
				'"currentRataBookId" : "' + currentRataBookId + '",' +
				'"currentVersion":"' + window.top.APPVERNUM + '",' +
				'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
				'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
				'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
				'"appPlatform":"' + window.top.APPTYPE + '"' +
			'}';
		} else {
			jsonString = '{' +
				'"rootFolderPath" : "' + libraryBookPath + '",' +
				'"bookPath" : "' + libraryBookPath + bookId + '",' +
				'"currentUnit" : "",' +
				'"currentWeek" : "",' +
				'"targetGradeCode" : "' + targetGradeCode + '",' +
				'"currentRataBookId" : "' + currentRataBookId + '",' +
				'"currentVersion":"' + window.top.APPVERNUM + '",' +
				'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
				'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
				'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
				'"appPlatform":"' + window.top.APPTYPE + '"' +
			'}';
		}
	}
	GetEbookInfoCallback(jsonString);
}

function sp_GetLibraryProgressSummary(data) {
	var jsonObj = JSON.parse(data);
	var itemID = '';
	if(jsonObj.Status == '200') {
		for(var i = 0; i < jsonObj.Content.BookItemIDs.length; i++) {
			itemID = getCMSItemID(jsonObj.Content.BookItemIDs[i]);
			if(itemID == undefined) {
				jsonObj.Content.BookItemIDs.splice(i,1);
				i--;
			} else {
				jsonObj.Content.BookItemIDs[i] = itemID;
			}
		}
		for(var i = 0, aCompletedBookIDs = (jsonObj.Content.BookCompletedItemIDs || []); i < aCompletedBookIDs.length; i++) {
			itemID = getCMSItemID(jsonObj.Content.BookCompletedItemIDs[i]);
			if(itemID == undefined) {
				jsonObj.Content.BookCompletedItemIDs.splice(i,1);
				i--;
			} else {
				jsonObj.Content.BookCompletedItemIDs[i] = itemID;
			}
		}
		// update footer review tab
		//isBookCompleted = (top.isiLit20() == true) ? true : false;
		isBookCompleted = true;
		if(isBookCompleted && jsonObj.Content.BookCompletedItemIDs.length > 0){ // ILIT-234
				totalBooksCompleted = jsonObj.Content.TotalBooksCompleted,
				bookCompltedIds = jsonObj.Content.BookCompletedItemIDs.join(",");
				GetBookReviewFeedback(bookCompltedIds);
			}
		
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	
	GetLibraryProgressSummaryCallback(JSON.stringify(jsonObj));
}

function sp_GetAssignmentSlidesInfo(data) {
	if (data != null) {
		var bIsILIT20 = top.isiLit20();
		var targetGradeCode = (
			bIsILIT20 === true?
			getSessionStorageItem("targetGradeCode"):
			""
		); 
		var contentBaseURL = getSessionStorageItem("contentBaseURL");
		var gradeCode = getSessionStorageItem("gradeCode");
		var libraryPath = getSessionStorageItem('libraryPath');
		var assignmentPath = getSessionStorageItem("assignmentPath");
		var assignId = data.itemId.trim();
		setSessionStorageItem("StudentAssignID", assignId);
		var jsPath = assignmentPath + assignId + "/" + assignId + ".js";
		var jsonString = '{' +
			'"rootFolderPath" : "' + contentBaseURL + '",' +
			'"gradeId" : "' + 
			(
				(bIsILIT20 === true)?
				getSessionStorageItem("targetGradeCode"):
				gradeCode
			) + '",' + 
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"mediaPath" : "' + assignmentPath + assignId + "/" + 'media/",' +
			'"videoPath" : "' + assignmentPath + assignId + "/" + 'media/",' +
			'"jsPath" : "' + jsPath + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"libraryJSPath" : "' + libraryPath + gradeCode + '_library.js"' +
		'}';
		GetAssignmentSlidesInfoCallback(jsonString);
    }
}

function sp_SaveAttemptDataForGradeableItem(data) {
	var returnData = {};
	if (data != null) {
		data = JSON.parse(data);
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		//var itemID = getServiceItemID(data.itemId.trim());
		var itemCompleted = data.itemComplete ? true : false;
		returnData = {
			TokenID: TOKENID,
            DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			//ItemID: itemID,
			StudentAttemptData: JSON.stringify(data.studentAttemptData),
			StudentAttemptSummary: data.StudentAttemptSummary,
			SystemScore: data.systemScore,
			FinalScore: data.finalScore,
			ItemCompleted: itemCompleted.toString(),
			IAID: data.itemAttemptId.trim(),
			IsStudentScored:data.isStudentScored.toString(), 
			MaxScore:data.maxScore, 
			OralFluencyData:data.oralFluencyData
		};
    }
	return returnData;
}

function sp_setProcessPKT(data, callBkMethod) {
	var postObj = {};
	var url = '';
	if (data != null) {
		var type = data.type.trim().toLowerCase();
		var studentResponse = data.studentResponse;
		if(type == 'essayFeedback'.toLowerCase()) {
			postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				prologue: {
					clientId: clientPKTId.trim(),
					clientPassword: clientPKTPwrd.trim(),
					transactionId: transacPKTId.trim(),
					studentId: studPKTId.trim()
				},
				instructionalLevel: instructionalPKTLevel.trim(),
				essay: studentResponse.trim()
			};
			url = SERVICEBASEURL + "essayFeedbackRequest";
		} else if(type == 'essayScore'.toLowerCase()) {
			postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				prologue: {
					clientId: clientPKTId.trim(),
					clientPassword: clientPKTPwrd.trim(),
					transactionId: transacPKTId.trim(),
					studentId: studPKTId.trim()
				},
				promptId: data.readingId.trim(),
				essay: studentResponse.trim()
			};
			url = SERVICEBASEURL + "essayScoreRequest";
		} else if(type == 'paragraph'.toLowerCase()) {
			postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				prologue: {
					clientId: clientPKTId.trim(),
					clientPassword: clientPKTPwrd.trim(),
					transactionId: transacPKTId.trim(),
					studentId: studPKTId.trim()
				},
				promptId: data.readingId.trim(),
				promptType: promptPKTType.trim(),
				instructionalLevel: instructionalPKTLevel.trim(),
				paragraphType: data.paragraphType.trim(),
				paragraph: studentResponse.trim()

			};
			url = SERVICEBASEURL + "paragraphfeedbackRequest";
		} else if(type == 'summaryScore'.toLowerCase()) {
			postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				prologue: {
					clientId: clientPKTId.trim(),
					clientPassword: clientPKTPwrd.trim(),
					transactionId: transacPKTId.trim(),
					studentId: studPKTId.trim()
				},
				readingId: data.readingId.trim(),
				summary: studentResponse.trim()
			};
			url = SERVICEBASEURL + "scoreSummaryRequest";
		} else if(type == 'SummaryFeedbackRequest'.toLowerCase()) {
			postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				prologue: {
					clientId: clientPKTId.trim(),
					clientPassword: clientPKTPwrd.trim(),
					transactionId: transacPKTId.trim(),
					studentId: studPKTId.trim()
				},
				readingId: data.readingId.trim(),
				summary: studentResponse.trim()
			};
			url = SERVICEBASEURL + "summaryFeedbackRequest";
		}
    }
	AjaxCall(url, "POST", postObj, callBkMethod);
	return false;
}

function sp_SetScoreForGradeableItem(data, callBkMethod) {
	var returnData = {};
	if (data != null) {        
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		var itemID = data.itemId.trim();
		var itemCompleted = data.itemComplete ? true : false;
		returnData = {
			TokenID: TOKENID,
            DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			InstructorScore: data.instScoreData,
			InstructorScoreRubric: data.InstructorScoreRubric,
			WordCount: data.wordCount,
			FinalScore: data.finalScore,
			Comments: data.comment,
			IAID: data.itemAttemptId.trim(),
			PKTOralFluencyResults: data.PKTOralFluencyResults
		};
    }
	return returnData;
}

function sp_GetUnitDetails() {
	 var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	var gradeCode = getSessionStorageItem("gradeCode");
	
	if(CURRENTUSERROLE == studRole)
	{
		var jsonString = '{' +
			'"TotalUnits" : "' + getSessionStorageItem('totalUnits')  + '",' +
			'"TotalWeeksWithInGrade" : "' + getSessionStorageItem('totalWeeksWithInGrade') + '",' +
			'"TotalLessonsWithInGrade" : "' + getSessionStorageItem('totalLessonsWithInGrade') + '",' +
			'"gradeCode" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"serviceVersion" : "v2",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"userSettingEnabled":"1"' +
		'}';
		var jsonData = JSON.parse(jsonString);
		jsonString = {
			"Error" : "null",
			"Status" : "200",
			"Content" : jsonData
		};
		jsonString = JSON.stringify(jsonString);
	}
	else
	{
		var jsonString = '{' +
			'"totalUnits" : "' + getSessionStorageItem('totalUnits')  + '",' +
			'"totalWeeks" : "' + getSessionStorageItem('totalWeeksWithInGrade') + '",' +
			'"totalLessons" : "' + getSessionStorageItem('totalLessonsWithInGrade') + '",' +
			'"unitsWeeksDetails" : "' + getSessionStorageItem('unitsWeeksDetails') + '",' +
			'"gradeCode" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"serviceVersion" : "v2",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"gradeItemsInfoJSPath":"' + getSessionStorageItem('gradeItemsInfoJsPath') + '",' +
			'"userSettingEnabled":"1"' +
		'}';
	}
	GetUnitDetailsCallback(jsonString);
}


function sp_GetGradeableItemsForInstructor(data) {
	if(data != null) {
		var bIsILIT20 = top.isiLit20(),
			gradeableItemsArr = [],
			gradeableItemsNumCount = 0,
			returnGradeableItemObj = {},
			unitNum = (
				bIsILIT20 === true?
				'1':
				data.unitNumber
			),
			weekNum = data.weekNumber,
			tmpGradeableArr = getAssignmentTOCArray(),
			sTargetGradeCode = getSessionStorageItem("targetGradeCode");
		
		for(var i = 0; i < tmpGradeableArr.length; i++) {
			if (bIsILIT20 === true) {
				if (
					unitNum.indexOf(tmpGradeableArr[i].unitNumber) > -1 &&
					tmpGradeableArr[i].itemSubType === 'grade' &&
					tmpGradeableArr[i].targetGradeCode !== sTargetGradeCode
				) {
					continue;
				}
				gradeableItemsArr[gradeableItemsNumCount] = {
					UnitNumber : +(tmpGradeableArr[i].unitNumber),
					WeekNumber : +(tmpGradeableArr[i].weekNumber),
					ItemID : tmpGradeableArr[i].itemID,
					ItemName : tmpGradeableArr[i].itemDisplayName,
					ItemCategory : tmpGradeableArr[i].category || '',
					ItemType : tmpGradeableArr[i].itemType,
					ItemSubType : tmpGradeableArr[i].itemSubType,
					ItemSubject : (tmpGradeableArr[i].subject == '') ? null : tmpGradeableArr[i].subject,
					ReadingLevel : tmpGradeableArr[i].level,
					MaxScore : tmpGradeableArr[i].maxScore,
					ExtraPractice : (tmpGradeableArr[i].isExtraPractice == 1) ? 'Yes' : 'No',
					TargetGradeCode: (
						tmpGradeableArr[i].itemSubType === 'grade'?
						tmpGradeableArr[i].targetGradeCode:
						''
					)
				};
				gradeableItemsNumCount++;
			}
			else {
				if(unitNum.indexOf(tmpGradeableArr[i].unitNumber) > -1) {
					gradeableItemsArr[gradeableItemsNumCount] = {
						UnitNumber : +(tmpGradeableArr[i].unitNumber),
						WeekNumber : +(tmpGradeableArr[i].weekNumber),
						ItemID : tmpGradeableArr[i].itemID,
						ItemName : tmpGradeableArr[i].itemDisplayName,
						ItemType : tmpGradeableArr[i].itemType,
						ItemSubType : tmpGradeableArr[i].itemSubType,
						ItemSubject : (tmpGradeableArr[i].subject == '') ? null : tmpGradeableArr[i].subject,
						ReadingLevel : tmpGradeableArr[i].level,
						MaxScore : tmpGradeableArr[i].maxScore,
						ExtraPractice : (tmpGradeableArr[i].isExtraPractice == 1) ? 'Yes' : 'No'
					};
					gradeableItemsNumCount++;
				}
			}
		}
		var jsonString = JSON.stringify({
			Status : "200",
			Error : null,
			Content : gradeableItemsArr
		});
		GetAssignmentListInfoCallback(jsonString);
	}
	


}

function call_GetGradebookForInstructor(cacheID) {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	cacheID = (cacheID == undefined) ? '' : cacheID;
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurTimeStamp(),
		CallerUserID: userID,
		CallerClassID: classID,
		DataRangeType: (cacheID == '') ? 'Full' : 'Delta',
		MaxAttemptRevisionID: cacheID
	};
	var url = SERVICEBASEURL + "GetGradebookForInstructor";
	AjaxCall(url, "POST", postObj, sp_GetGradebookForInstructorV2);
	ATTEMPTDATACACHESTATUS.INSTR = '';
}

function sp_GetGradebookForInstructorV2(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		ATTEMPTDATACACHESTATUS.INSTR = jsonObj.Content.MaxRevisionNumber;
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetGradebookForInstructorV2Callback(data);
}

function checkAttemptDataForInstructor(attemptIDArr,cachedJSON) {
	var serviceCallArr = [], serviceCallCount = 0, cachedDataArr = [], cachedDataCount = 0, tmpVal;
	for(var i = 0; i < attemptIDArr.length; i++) {
		tmpVal = cachedJSON[attemptIDArr[i].IAID];
		if(tmpVal != undefined) {
			if(attemptIDArr[i].ARID == tmpVal.ARID) {
			cachedDataArr[cachedDataCount] = tmpVal;
			cachedDataArr[cachedDataCount].IID = getCMSItemID(tmpVal.IID);
			cachedDataCount++;
			} else {
				serviceCallArr[serviceCallCount] = {
					IAID : attemptIDArr[i].IAID,
					ARID : attemptIDArr[i].ARID
				};
				serviceCallCount++;
			}
		} else {
			serviceCallArr[serviceCallCount] = {
					IAID : attemptIDArr[i].IAID,
					ARID : attemptIDArr[i].ARID
				};
				serviceCallCount++;
		}
	}
	
	if(serviceCallArr.length > 0) {
		call_GetGradebookAttemptData(serviceCallArr);
	} else {
		if(attemptIDArr.length == 0) {
			cachedDataArr = [], cachedDataCount = 0;
			for (var key in cachedJSON) {
			  if (cachedJSON.hasOwnProperty(key)) {
				cachedDataArr[cachedDataCount] = cachedJSON[key];
				cachedDataArr[cachedDataCount].IID = getCMSItemID(cachedDataArr[cachedDataCount].IID);
				cachedDataCount++;
			  }
			}
		}
		var tmpObj = {
			Status : '200',
			Error : null,
			Content : cachedDataArr
		};
		GetGradebookAttemptDataCallback(JSON.stringify(tmpObj));
	}
	return false;
}

function call_GetGradebookAttemptData(attemptArr) {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var attemptIdInfo = '';
	for(var i = 0; i < attemptArr.length; i++) {
		if(i == (attemptArr.length - 1)) {
			attemptIdInfo+= attemptArr[i].IAID;
		} else {
			attemptIdInfo+= attemptArr[i].IAID + ',';
		}
	}
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurTimeStamp(),
		CallerUserID: userID,
		CallerClassID: classID,
		DataRangeType: 'Delta',
		Item_Attempt_IDs: attemptIdInfo
	};
	var url = SERVICEBASEURL + "GetGradebookAttemptData";
	AjaxCall(url, "POST", postObj, sp_GetGradebookAttemptData);
}

function sp_GetGradebookAttemptData(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		if(INDEXEDDBSUPPORT) {
			addUpdateAttemptData(jsonObj, fetchCachedAttemptDataForInstructor);
		} else {
			editGetGradebookAttemptData(jsonObj);
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	return false;
}

function editGetGradebookAttemptData(dataObj) {
	var tmpVal;
	for(var i = 0; i < dataObj.Content.length; i++) {
		tmpVal = dataObj.Content[i];
		dataObj.Content[i].IID = getCMSItemID(tmpVal.IID);
	}
	GetGradebookAttemptDataCallback(JSON.stringify(dataObj));
}
//******************************************************************************************
function call_GetGradebookForStudent(cacheID) {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	cacheID = (cacheID == undefined) ? '' : cacheID;
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurTimeStamp(),
		CallerUserID: userID,
		CallerClassID: classID,
		DataRangeType: (cacheID == '') ? 'Full' : 'Delta',
		MaxAttemptRevisionID: cacheID
	};
	var url = SERVICEBASEURL + "GetGradebookForStudent";
	AjaxCall(url, "POST", postObj, checkGradebookDataForStudent);
	ATTEMPTDATACACHESTATUS.STUDNT = '';
}

function checkGradebookDataForStudent(data) {
	var jsonObj = JSON.parse(data),
		currentTabIndex = getSessionStorageItem('currentTabIndex'),
		bIsiLit20 = top.isiLit20(),
		NOTEBOOKTABINDEX = '2',
		ASSIGNMENTTABINDEX = '3';
	
	/* if (bIsiLit20 === true) {
		NOTEBOOKTABINDEX = '2';
		ASSIGNMENTTABINDEX = '3';
	} */
	if(jsonObj.Status == '200') {
		ATTEMPTDATACACHESTATUS.STUDNT = jsonObj.Content.MaxRevisionNumber;		
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	
	if(currentTabIndex ==  NOTEBOOKTABINDEX) {
		GetGradebookForStudentV2Callback(data);
	} else if(currentTabIndex ==  ASSIGNMENTTABINDEX) {
		if(INDEXEDDBSUPPORT) {
			fetchCachedAttemptDataForStudApp(jsonObj.Content.GradeBookData,checkAttemptDataForStudent);
		} else {
			call_GetGradebookAttemptDataForStudApp(jsonObj.Content.GradeBookData);
		}
	}
}

function checkAttemptDataForStudent(attemptIDArr,cachedJSON) {
	var serviceCallArr = [], serviceCallCount = 0, cachedDataArr = [], cachedDataCount = 0, tmpVal,
		bIsiLit20 = top.isiLit20(),
		NOTEBOOKTABINDEX = '2',
		ASSIGNMENTTABINDEX = '3';
	
	DASHBOARDTABINDEX = '';// removed for now
	/* if (bIsiLit20 === true) {
		NOTEBOOKTABINDEX = '2';
		ASSIGNMENTTABINDEX = '3';
		
	} */
	for(var i = 0; i < attemptIDArr.length; i++) {
		tmpVal = cachedJSON[attemptIDArr[i].IAID];
		if(tmpVal != undefined) {
			if(attemptIDArr[i].ARID == tmpVal.ARID) {
			cachedDataArr[cachedDataCount] = tmpVal;
			cachedDataArr[cachedDataCount].IID = getCMSItemID(tmpVal.IID);
			cachedDataCount++;
			} else {
				serviceCallArr[serviceCallCount] = {
					IAID : attemptIDArr[i].IAID,
					ARID : attemptIDArr[i].ARID
				};
				serviceCallCount++;
			}
		} else {
			serviceCallArr[serviceCallCount] = {
					IAID : attemptIDArr[i].IAID,
					ARID : attemptIDArr[i].ARID
				};
				serviceCallCount++;
		}
	}
	
	if(serviceCallArr.length > 0) {
		call_GetGradebookAttemptDataForStudApp(serviceCallArr);
	} else {
		var currentTabIndex = getSessionStorageItem('currentTabIndex');
		if(attemptIDArr.length == 0) {
			cachedDataArr = [], cachedDataCount = 0;
			for (var key in cachedJSON) {
			  if (cachedJSON.hasOwnProperty(key)) {
				cachedDataArr[cachedDataCount] = cachedJSON[key];
				cachedDataArr[cachedDataCount].IID = getCMSItemID(cachedDataArr[cachedDataCount].IID);
				cachedDataCount++;
			  }
			}
		}
		var tmpObj = {
			Status : '200',
			Error : null,
			Content : cachedDataArr
		};
		if(currentTabIndex ==  NOTEBOOKTABINDEX) {
			GetGradebookAttemptDataForStudAppCallback(JSON.stringify(tmpObj));
		} else if(currentTabIndex ==  ASSIGNMENTTABINDEX) {
			sp_GetAssignmentTOCInfo(JSON.stringify(tmpObj));
		}		
	}
	return false;
}

function call_GetGradebookAttemptDataForStudApp(attemptArr) {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var attemptIdInfo = '';
	for(var i = 0; i < attemptArr.length; i++) {
		if(i == (attemptArr.length - 1)) {
			attemptIdInfo+= attemptArr[i].IAID;
		} else {
			attemptIdInfo+= attemptArr[i].IAID + ',';
		}
	}
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurTimeStamp(),
		CallerUserID: userID,
		CallerClassID: classID,
		DataRangeType: 'Delta',
		Item_Attempt_IDs: attemptIdInfo
	};
	var url = SERVICEBASEURL + "GetGradebookAttemptDataForStudApp";
	AjaxCall(url, "POST", postObj, sp_GetGradebookAttemptDataForStudApp);
}

function sp_GetGradebookAttemptDataForStudApp(data) {
	var jsonObj = JSON.parse(data),
		bIsiLit20 = top.isiLit20(),
		NOTEBOOKTABINDEX = '2',
		ASSIGNMENTTABINDEX = '3';
	
	/* if (bIsiLit20 === true) {
		NOTEBOOKTABINDEX = '2';
		ASSIGNMENTTABINDEX = '3';
	} */
	if(jsonObj.Status == '200') {
		if(INDEXEDDBSUPPORT) {
			addUpdateAttemptDataForStudent(jsonObj, fetchCachedAttemptDataForStudApp);
		} else {
			var currentTabIndex = getSessionStorageItem('currentTabIndex');
			if(currentTabIndex == NOTEBOOKTABINDEX) {
				addGradeableDataInStudentAttemptData(jsonObj);
			} else if(currentTabIndex == ASSIGNMENTTABINDEX) {
				sp_GetAssignmentTOCInfo(JSON.stringify(jsonObj));
			}
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
		return false;
	}
	return false;
}

function sp_GetAssignmentTOCInfo(data) {
	var jsonObj = JSON.parse(data);
	var contentArr = jsonObj.Content;
	var tocInfoJSON = {
		Status: '200',
		Error: null,
		Content: [],
		classStartDate : getSessionStorageItem('ClassStartDate')
	};
	var val, tocCount = 0, gradeItemInfo;
	for(var i = 0; i < contentArr.length; i++) {
		val = contentArr[i];
		if(val.ICS == "assigned" || val.ICS == "in progress") {
			if(INDEXEDDBSUPPORT) {
				tocInfoJSON.Content[tocCount] = {
					ItemID: val.CMSID,
					ItemType: val.IT,
					ItemSubType: val.IST,
					ItemName: val.IDN,
					ItemState: val.ICS,
					ItemSystemScore: val.SS,
					ItemComment: val.Cmt,
					ReassignCount: val.RAC,
					ItemProgressSummary: val.IADS,
					ItemAttemptID: val.IAID,
					ItemAssignedDate: val.IAD,
					ProductCode: getSessionStorageItem("productCode")
				}
			} else {
				gradeItemInfo = getAssignmentTOCInfoByServcID(contentArr[i].AIID)
				tocInfoJSON.Content[tocCount] = {
					ItemID: gradeItemInfo.itemID,
					ItemType: val.IT,
					ItemSubType: val.IST,
					ItemName: gradeItemInfo.itemDisplayName,
					ItemState: val.ICS,
					ItemSystemScore: val.SS,
					ItemComment: val.Cmt,
					ReassignCount: val.RAC,
					ItemProgressSummary: val.IADS,
					ItemAttemptID: val.IAID,
					ItemAssignedDate: val.IAD,
					ProductCode: getSessionStorageItem("productCode")
				}
			}
			tocCount++;
		}
	}
	GetAssignmentTOCInfoCallback(JSON.stringify(tocInfoJSON));
}

function addGradeableDataInStudentAttemptData(dataObj) {
	var contentArr = dataObj.Content, tocVal;
	for(var i =0; i < contentArr.length; i++) {
		tocVal = getAssignmentTOCInfoByServcID(contentArr[i].AIID);
		if(tocVal != undefined) {
			contentArr[i].IDN = tocVal.itemDisplayName;
			contentArr[i].ISU = (tocVal.subject == '') ? 'none' : tocVal.subject;
			contentArr[i].IUN = +(tocVal.unitNumber);
			contentArr[i].IWN = +(tocVal.weekNumber);
			contentArr[i].ILN = +(tocVal.dayNumber);
			contentArr[i].CMSID = tocVal.itemID;
		} else {
			console.log('Attempt not found in TOC for ' + contentArr[i].AIID);
		}
	}
	dataObj.Content = contentArr;
	GetGradebookAttemptDataForStudAppCallback(JSON.stringify(dataObj));
}

function sp_GetMessageList(data) {
	if (data != null) {
		var jsonString = data;
		if(getSessionStorageItem('msgPopupShown') == null) {
			var jsonObj = JSON.parse(jsonString);
			jsonObj.canShow = true;
			jsonString = JSON.stringify(jsonObj);
			setSessionStorageItem('msgPopupShown', true)
		}
		GetMessageListCallback(jsonString);
    }
}

function sp_GetAppInfo() {
	var jsonString = '{"currentVersion":"' + window.top.APPVERNUM + '","appPlatform":"' + window.top.APPTYPE + '"}';
	GetAppInfoCallback(jsonString);
}

function sp_GetNotelist(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		var contentArr = jsonObj.Content.Data;
		var NRefID = '';
		for(var i = 0; i < contentArr.length; i++) {
			NRefID = getCMSItemID(contentArr[i].NoteRefID);
			contentArr[i].NoteRefID = (NRefID == undefined) ? contentArr[i].NoteRefID : NRefID;
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetNotelistCallback(JSON.stringify(jsonObj));
}

function sp_GetNotelistV2(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		var contentArr = jsonObj.Content.Data;
		var NRefID = '';
		for(var i = 0; i < contentArr.length; i++) {
			NRefID = getCMSItemID(contentArr[i].NoteRefID);
			contentArr[i].NoteRefID = (NRefID == undefined) ? contentArr[i].NoteRefID : NRefID;
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetNotelistV2Callback(JSON.stringify(jsonObj));
}

function sp_GetNoteInfo(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		var NRefID = getCMSItemID(jsonObj.Content.NoteRefID);
		jsonObj.Content.NoteRefID = (NRefID == undefined) ? jsonObj.Content.NoteRefID : NRefID;
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetNoteInfoCallback(JSON.stringify(jsonObj));
}

function sp_GetNotelistForInstructor(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		var contentArr = jsonObj.Content.Data;
		var NRefID = '';
		for(var i = 0; i < contentArr.length; i++) {
			NRefID = getCMSItemID(contentArr[i].NoteRefID);
			contentArr[i].NoteRefID = (NRefID == undefined) ? contentArr[i].NoteRefID : NRefID;
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetNotelistForInstructorCallback(JSON.stringify(jsonObj));
}

function sp_GetNotelistForInstructorV2(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		var contentArr = jsonObj.Content.Data;
		var NRefID = '';
		for(var i = 0; i < contentArr.length; i++) {
			NRefID = getCMSItemID(contentArr[i].NoteRefID);
			contentArr[i].NoteRefID = (NRefID == undefined) ? contentArr[i].NoteRefID : NRefID;
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetNotelistForInstructorV2Callback(JSON.stringify(jsonObj));
}

// for saving notes
function sp_SaveNote(data) {
	var returnData = {};
	if (data != null) {
		var jsonObj = JSON.parse(data);
		var noteObj = new Object;
		var noteRefID = '';
		if(jsonObj.callerType.toLowerCase().trim() == 'ebook') {
			noteRefID = getServiceItemID(jsonObj.noteRefId);
		} else {
			noteRefID = (jsonObj.noteRefId == '0' || jsonObj.noteRefId == '') ? jsonObj.noteRefId : getServiceItemID(jsonObj.noteRefId);
		}
		noteObj.TokenID = TOKENID;
		noteObj.DeviceTimeStamp = getCurTimeStamp();
		noteObj.CallerUserID = getSessionStorageItem("userID");
		noteObj.CallerClassID = getSessionStorageItem("classID");
		noteObj.ShortNoteText = jsonObj.ShortNoteText;
		noteObj.NoteID = jsonObj.noteId;
		noteObj.NoteType = jsonObj.noteType;
		noteObj.NoteTitle = jsonObj.noteTitle;
		noteObj.NoteText  = jsonObj.noteText;
		noteObj.NoteRefID = noteRefID;
		noteObj.RefUnitNumber = jsonObj.refUnitNumber;
		noteObj.RefOtherData = jsonObj.refOtherData;
		
		returnData = noteObj;
	}
	return returnData;
}

function sp_GetListOfConferenceStudentData(data) {
	var jsonObj = JSON.parse(data);
	var itemID = '';
	if(jsonObj.Status == '200') {
		for(var i = 0; i < jsonObj.Content.length; i++) {
			itemID = getCMSItemID(jsonObj.Content[i].ItemID);
			if(itemID == undefined) {
				jsonObj.Content.splice(i,1);
				i--;
			} else {
				jsonObj.Content[i].ItemID = itemID;
			}
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetListOfConferenceStudentDataCallback(JSON.stringify(jsonObj));
}

function sp_GetConferenceStudentData(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		if(jsonObj.Content.ItemID != null) {
			jsonObj.Content.ItemID = getCMSItemID(jsonObj.Content.ItemID);
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetConferenceStudentDataCallback(JSON.stringify(jsonObj));
}

function sp_AssignGradeableItem(data) {
	var returnData = {};
	if (data != null) {
        data = JSON.parse(data);
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		var studentItems = data.studentItems;
		for(var i =0; i < studentItems.length; i++) {
			studentItems[i].ItemID = getServiceItemID(studentItems[i].ItemID);
		}
		studentItems = JSON.stringify(studentItems);
		returnData = {
			TokenID: TOKENID,
			DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			StudentItemsJsonArray: studentItems
		};
	}
	return returnData;
}

function sp_SetCurrentWeekForClass(data) {
	var returnData = {};
	if (data != null) {
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		
		returnData = {
			TokenID: TOKENID,
			DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			WeekNo: data.WeekNo
		};
	}
	return returnData;
}

function sp_CheckAssignAutoScoreGradeableItems () {
	var userID = getSessionStorageItem("userID").trim(),
		classID = getSessionStorageItem("classID").trim();
	
	return {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurTimeStamp(),
		CallerUserID: userID,
		CallerClassID: classID
	};
}

function sp_RemoveGradeableItem(data) {
	var returnData = {};
	if (data != null) {        
        data = JSON.parse(data);
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		returnData = {
			TokenID: TOKENID,
            DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			IAIDs: data.ItemAttemptIds
		};
	}
	return returnData;
}

function sp_ReAssignGradableItem(data) {
	var returnData = {};
	if (data != null) {
		var userID = getSessionStorageItem("userID").trim();
		var classID = getSessionStorageItem("classID").trim();
		returnData = {
			TokenID: TOKENID,
            DeviceTimeStamp: getCurTimeStamp(),
			CallerUserID: userID,
			CallerClassID: classID,
			Comment: data.comment,
			IAID: data.itemAttemptId.trim(),
			PKTOralFluencyResults: data.PKTOralFluencyResults
		};
	}
	return returnData;
}

function sp_GetLibraryProgress(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		if(jsonObj.Content.length) {
			jsonObj.Content[0].ItemID = getCMSItemID(jsonObj.Content[0].ItemID);
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetLibraryProgressCallback(JSON.stringify(jsonObj));
}

function sp_GetLibraryProgressDetailForClass(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		for(var i = 0; i < jsonObj.Content.length; i++) {
			itemID = getCMSItemID(jsonObj.Content[i].ItemID);
			if(itemID == undefined) {
				jsonObj.Content.splice(i,1);
				i--;
			} else {
				jsonObj.Content[i].ItemID = itemID;
			}
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetLibraryProgressDetailForClassCallback(JSON.stringify(jsonObj));
}

function sp_GetCurrentBookForStudent(data) {
	if (data != null) {        
		var jsonObj = JSON.parse(data);
		if(jsonObj.Status == '200') {
			var rBkID = getCMSItemID(jsonObj.Content.Ratabook_ItemID);
			var cBkID = getCMSItemID(jsonObj.Content.mycurrent_book_item_Id);
			jsonObj.Content.Ratabook_ItemID = (rBkID == undefined) ? '' : rBkID;
			jsonObj.Content.mycurrent_book_item_Id = (cBkID == undefined) ? '' : cBkID;
		} else {
			alert(jsonObj.Error.ErrorUserDescription);
		}
		GetCurrentBookForStudentCallback(JSON.stringify(jsonObj));

    }
}

function sp_GetPerformanceInfo() {
	var targetGradeCode = (
		top.isiLit20() === true?
		getSessionStorageItem("targetGradeCode"):
		""
	); 
	var contentBaseURL = getSessionStorageItem('contentBaseURL');
	var gradeCode = getSessionStorageItem('gradeCode');
	var gradePath = getSessionStorageItem('gradePath');
	var lessonInfoJson = JSON.parse(getSessionStorageItem("lessonInfoData"));
	if(lessonInfoJson == null) {
		var jsonString = '{' +
			'"rootFolderPath" : "' + contentBaseURL + '",' +
			'"gradeId" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"totalUnits" : "' + getSessionStorageItem('totalUnits')  + '",' +
			'"totalWeeks" : "' + getSessionStorageItem('totalWeeksWithInGrade') + '",' +
			'"totalLessons" : "' + getSessionStorageItem('totalLessonsWithInGrade') + '",' +
			'"unitsWeeksDetails" : "' + getSessionStorageItem('unitsWeeksDetails') + '",' +
			'"curUnitNumber" : "1",' +
			'"curWeekNumber" : "1",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '"' +
		'}';
	} else {
		var jsonString = '{' +
			'"rootFolderPath" : "' + contentBaseURL + '",' +
			'"gradeId" : "' + gradeCode + '",' +
			'"targetGradeCode" : "' + targetGradeCode + '",' +
			'"totalUnits" : "' + getSessionStorageItem('totalUnits')  + '",' +
			'"totalWeeks" : "' + getSessionStorageItem('totalWeeksWithInGrade') + '",' +
			'"totalLessons" : "' + getSessionStorageItem('totalLessonsWithInGrade') + '",' +
			'"unitsWeeksDetails" : "' + getSessionStorageItem('unitsWeeksDetails') + '",' +
			'"curUnitNumber" : "' + lessonInfoJson.unitNumber + '",' +
			'"curWeekNumber" : "' + lessonInfoJson.weekNumber + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"isAutoReadBook" : "' + getSessionStorageItem("IsAutoReadBook") + '",' +
			'"isAutoCompleteGradeAssessment" : "' + getSessionStorageItem("IsAutoCompleteGradeAssessment") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '"' +
		'}';
	}
	GetPerformanceInfoCallback(jsonString);
}

function sp_GetSkillBasedReportDataByWeekRange(data) {
	var jsonObj = JSON.parse(data);
	if(jsonObj.Status == '200') {
		for(var i = 0; i < jsonObj.Content.length; i++) {
			itemID = getCMSItemID(jsonObj.Content[i].AssessmentID);
			if(itemID == undefined) {
				jsonObj.Content.splice(i,1);
				i--;
			} else {
				jsonObj.Content[i].AssessmentID = itemID;
			}
		}
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetSkillBasedReportDataByWeekRangeCallback(encodeURIComponent(JSON.stringify(jsonObj)));
}

function sp_GetSkillTaxonomyInformation(data) {
	GetSkillTaxonomyInformationCallback(encodeURIComponent(data));
}

function sp_GetUnitWeekDetails() {
	var jsonString = '';
	if(CURRENTUSERROLE == studRole) {
		var classStatusJson = JSON.parse(window.top.CLASSSTATUSOBJ);
		var currentUnit = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonUnit;
		var currentWeek = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonWeek;
		var currentLesson = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : ((classStatusJson.Content.ClassCurrentActivities.CurrentLessonID == '') ? '' : getCMSItemID(classStatusJson.Content.ClassCurrentActivities.CurrentLessonID));
		jsonString = '{' +
			'"currentUnit" : "' + currentUnit + '",' +
			'"currentWeek" : "' + currentWeek + '",' +
			'"currentLesson" : "' + currentLesson + '",' +
			'"currentVersion":"' + window.top.APPVERNUM + '",' +
			'"appPlatform":"' + window.top.APPTYPE + '",' +
			'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
			'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
			'"serviceVersion" : "v2"' +
		'}';
	} else if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
		var lessonInfoJson = getSessionStorageItem("lessonInfoData");
		if(lessonInfoJson != null) {
			lessonInfoJson = JSON.parse(lessonInfoJson);
			var currentUnit = lessonInfoJson.unitNumber;
			var currentWeek = lessonInfoJson.weekNumber;
			var currentLesson = lessonInfoJson.itemId;
			jsonString = '{' +
				'"currentUnit" : "' + currentUnit + '",' +
				'"currentWeek" : "' + currentWeek + '",' +
				'"currentLesson" : "' + currentLesson + '",' +
				'"currentVersion":"' + window.top.APPVERNUM + '",' +
				'"appPlatform":"' + window.top.APPTYPE + '",' +
				'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
				'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
				'"serviceVersion" : "v2"' +
			'}';
		} else {
			jsonString = '{' +
				'"currentUnit" : "",' +
				'"currentWeek" : "",' +
				'"currentLesson" : "",' +
				'"currentVersion":"' + window.top.APPVERNUM + '",' +
				'"appPlatform":"' + window.top.APPTYPE + '",' +
				'"productCode" : "' + getSessionStorageItem("productCode") + '",' +
				'"classStartDate":"' + getSessionStorageItem('ClassStartDate') + '",' +
				'"serviceVersion" : "v2"' +
			'}';
		}
	}
	GetUnitWeekDetailsCallback(jsonString);
}

function sp_GetScribbleData(data) {
	if (data != null) {
		var jsonString = data;
		GetScribbleDataCallback(jsonString);
    }
}

function sp_GetBookReviewFeedback (psItemIDs) {
	var aItemIDs = (
			psItemIDs.length?
			psItemIDs.split(','):
			[]
		),
		aServiceItemIDs = [],
		sServiceItemID = '';
	
	for (var iI = 0; iI < aItemIDs.length; iI++) {
		if (sServiceItemID = getServiceItemID(aItemIDs[iI])) {
			aServiceItemIDs.push(sServiceItemID);
		}
	}
	
	return aServiceItemIDs.join(',');
}

function sp_GetBookReviewFeedbackResponse (psServiceResponse) {
	var oServiceResponse = JSON.parse(psServiceResponse),
		sCMSItemID = '';
	
	for (var iI = 0, aReviewData = ((oServiceResponse || {}).Content || []); iI < aReviewData.length; iI++) {
		if (sCMSItemID = getCMSItemID(oServiceResponse['Content'][iI].ItemID)) {
			oServiceResponse['Content'][iI].ItemID = sCMSItemID;
			continue;
		}
		oServiceResponse['Content'].splice(iI, 1);
		iI--;
	}
	
	reviewedbooks = oServiceResponse['Content'] ? oServiceResponse['Content'].length : 0;
	unreviewedBooks = totalBooksCompleted - reviewedbooks;
	
	if(unreviewedBooks != 0){
		parent.$("#footer-btn-cont").find("button:eq(0)").find(".unreviewed").html(unreviewedBooks);
		parent.$("#footer-btn-cont").find("button:eq(0)").find(".unreviewed").show();	
	}else{
		parent.$("#footer-btn-cont").find("button:eq(0)").find(".unreviewed").html("");
		parent.$("#footer-btn-cont").find("button:eq(0)").find(".unreviewed").hide();	
	}
	
	return JSON.stringify(oServiceResponse);
}

function sp_SaveBookReviewFeedback (psBookID) {
	var sServiceItemID = '';
	if (sServiceItemID = getServiceItemID(psBookID)) {
		return sServiceItemID;
	}
	return '';
}

function sp_GetItemSkillMapping (psGetItemSkillMappingResponse) {
	
	try {
		var oGetItemSkillMappingResponse = JSON.parse(psGetItemSkillMappingResponse),	
			error = oGetItemSkillMappingResponse.Error,
			content = oGetItemSkillMappingResponse.Content,
			status	= oGetItemSkillMappingResponse.Status,
			sCMSItemID = '';
	}
	catch(oException){
		return psGetItemSkillMappingResponse;
	}
	
	if(status == '200')
	{
		for(iI=0; iI<oGetItemSkillMappingResponse.Content.length; iI++){
		
			if (sCMSItemID = getCMSItemID(oGetItemSkillMappingResponse.Content[iI].ItemID)) {
				 oGetItemSkillMappingResponse.Content[iI].ItemID = sCMSItemID;
			}
		}
		return JSON.stringify(oGetItemSkillMappingResponse);
	}
	else{
		return psGetItemSkillMappingResponse;
	}
}

function sp_GetListOfReservedBooks (data) {
        var jsonObj = JSON.parse(data);
	var itemID = '';
	if(jsonObj.Status == '200') {
		for(var i = 0; i < jsonObj.Content.length; i++) {
			itemID = getCMSItemID(jsonObj.Content[i]);
			if(itemID == undefined) {
				jsonObj.Content.splice(i,1);
				i--;
			} else {
				jsonObj.Content[i] = itemID;
			}
		}		
	} else {
		alert(jsonObj.Error.ErrorUserDescription);
	}
	GetListOfReservedBooksCallback(JSON.stringify(jsonObj));
}

function sp_ReserveOrUnreserveBook (data) {	
	ReserveOrUnreserveBookCallback(data);
}
function sp_GetUserFeedbackforAllBooks (data) {	
	GetUserFeedbackforAllBooksCallback(data);
}
function sp_GetRecommendedBooks (data) {	
	GetRecommendedBooksCallback(data);
}
function sp_GetCurrentDeviceTimestamp () {
    var currentDateTIme = window.top.getDeviceCurrentTimestamp();
	getCurrentDeviceTimestampCallback(currentDateTIme);
}


function callNativeBridge(sTypeNativeMethod, params, callBackMethod) {
	var parameters = JSON.parse(params);
	switch(parameters.method) {
	    case 'GetPlannerInfo':
	        sp_GetPlannerInfo();
	        break;
	    case 'LaunchGradeItem':
	        if(parameters.previewLesson == '0') {
				var lessonInfoData = params;
				var teachFrom = parameters.teachFrom.toString().trim();
				if(teachFrom != "lesson") {
					setSessionStorageItem('lessonBackupInfoData', getSessionStorageItem('lessonInfoData'));
				}
				setSessionStorageItem('lessonInfoData', lessonInfoData);
				removeSessionStorageItem('previewLessonInfoData');
			} else {
				var previewLessonInfoData = params;
				setSessionStorageItem('previewLessonInfoData', previewLessonInfoData);
			}
	        window.parent.activateLessonTab();
	        window.location.href = siteBaseUrl+'Lesson.html';
	        break;
	    case 'GetLessonInfo':
			setSessionStorageItem("verbID", "IL"); //to log data
			setSessionStorageItem("currentTab", "lessons");
			//removeSessionStorageItem('previewLessonInfoData');
			sp_GetLessonInfo();
	        break;
	    case 'SetProjectSlide':
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_SetProjectSlide(JSON.stringify(parameters));
				var url = SERVICEBASEURL + "SetProjection";
				AjaxCall(url, "POST", postObj, sp_SetProjection);
			}
	        break;
	    case 'SetSurvey':
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_SetSurvey(JSON.stringify(parameters));
				var url = SERVICEBASEURL + "SetSurvey";
				AjaxCall(url, "POST", postObj, checkSuccess);
			}
	        break;
	    case 'SetBroadcastSlide':
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_SetBroadcastSlide(JSON.stringify(parameters));
				if(!$.isEmptyObject(postObj)) {
					var url = SERVICEBASEURL + "SetBroadcast";
					AjaxCall(url, "POST", postObj, sp_SetBroadcast);
				}
			}
	        break;
	    case 'SetExpandImage':
			if(parameters.mediaid != null && parameters.mediaid != undefined) {
				window.top.showExpandOverlay(parameters.mediaid.trim());
			} else {
				alert('Image URL Empty');
			}
	        break;
	    case 'GetLibraryInfo':
	        //to log data (here it is done specially for library view when you return from ebook player, so due to this when you click on library tab from bottom bar few milliseconds will be logged less in the total time taken to load/show library view)
			if(CURRENTUSERROLE == studRole) {
				setSessionStorageItem("verbID", "S-LBTO"); // to log data
			} else {
				setSessionStorageItem("verbID", "T-LBTO"); //to log data
			}
			var currEventTimeStamp = getCurTimeStamp();
			setSessionStorageItem("eventStartTime", window.top.getTimeInMs());
			setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
		
			HideNativeBottomBar(false);
			sp_GetLibraryInfo();
			removeSessionStorageItem("BookID");
	        break;
		case 'GetEbookInfo':
			HideNativeBottomBar(true);
			setSessionStorageItem('BookID', $.trim(parameters.bookId));
			trackLog('GetEbookInfo');
			sp_GetEbookInfo();
			break;
		case 'GetPDFInfo' :
			var bookID = parameters.BookID.trim();
			var bookName = parameters.BookTitle.trim();
			var bookType = parameters.BookType.trim();
			var wordCount = parseInt(parameters.WordCount);
			var bookNumPage = parseInt(parameters.BookNumPage);
			setSessionStorageItem('BookID', bookID);
			var libraryPath = getSessionStorageItem(
				/* "library" + ((top.isiLit20() === true)? "Book": "") + "Path" */
				"libraryBookPath" /* ILIT-303 */
			);
			var bookPath = libraryPath + bookID + '/' + bookID + '.pdf';
			var context = parameters.context;
			var bookLexileLevel = parameters.bookLexileLevel;
			var currentRataBookId = '';
			var jsonString = '';
			if(CURRENTUSERROLE == studRole) {
				var classStatusJson = JSON.parse(window.top.CLASSSTATUSOBJ);
				var currentUnit = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonUnit;
				var currentWeek = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : classStatusJson.Content.ClassCurrentActivities.CurrentLessonWeek;
				currentRataBookId = (classStatusJson.Content.ClassCurrentActivities == null) ? '' : ((classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID == '') ? '' : getCMSItemID(classStatusJson.Content.ClassCurrentActivities.CurrentRATABookID));
				jsonString = '{ "bookID" : "' + bookID + '", "bookPath" : "' + bookPath + '", "bookName" : "' + bookName + '", "bookType" : "' + bookType + '", "wordCount" : ' + wordCount + ', "bookNumPage" : ' + bookNumPage + ', "currentUnit" : "' + currentUnit + '", "currentWeek" : "' + currentWeek + '", "currentRataBookId" : "' + currentRataBookId + '", "context" : "' + context + '", "bookLexileLevel" : "' + bookLexileLevel + '" }';
			} else if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
				var lessonInfoJson = getSessionStorageItem("lessonInfoData");
				if(lessonInfoJson != null) {
					lessonInfoJson = JSON.parse(lessonInfoJson);
					var currentUnit = lessonInfoJson.unitNumber;
					var currentWeek = lessonInfoJson.weekNumber;
					jsonString = '{ "bookID" : "' + bookID + '", "bookPath" : "' + bookPath + '", "bookName" : "' + bookName + '", "bookType" : "' + bookType + '", "wordCount" : ' + wordCount + ', "bookNumPage" : ' + bookNumPage + ', "currentUnit" : "' + currentUnit + '", "currentWeek" : "' + currentWeek + '", "currentRataBookId" : "' + currentRataBookId + '", "context" : "' + context + '", "bookLexileLevel" : "' + bookLexileLevel + '" }';
				} else {
					jsonString = '{ "bookID" : "' + bookID + '", "bookPath" : "' + bookPath + '", "bookName" : "' + bookName + '", "bookType" : "' + bookType + '", "wordCount" : ' + wordCount + ', "bookNumPage" : ' + bookNumPage + ', "currentUnit" : "", "currentWeek" : "", "currentRataBookId" : "' + currentRataBookId + '", "context" : "' + context + '", "bookLexileLevel" : "' + bookLexileLevel + '" }';
				}
			}
			window.top.launchPDFReader(jsonString);
			var currEventTimeStamp = getCurTimeStamp();
			checkForGoogleEvents('Ebook');
			window.top.createLog('IL', 0, currEventTimeStamp);
			break;
		case 'GetIWTTotalWordCount':
			var userID = getSessionStorageItem("userID");
	        var classID = getSessionStorageItem("classID");
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID
			};
	        var url = SERVICEBASEURL + "GetIWTTotalWordCount";
	        AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'GetLibraryProgressSummary':
			var userID = (parameters.studentID.trim() == '') ? getSessionStorageItem("userID") : parameters.studentID.trim();
	        var classID = getSessionStorageItem("classID");
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID
			};
	        var url = SERVICEBASEURL + "GetLibraryProgressSummary";
	        AjaxCall(url, "POST", postObj, sp_GetLibraryProgressSummary);
			break;
		case 'GetAssignmentTOCInfo':
			callNativeBridge("JSToNativeCommunication", JSON.stringify({ method: "GetGradebookForStudentV2" }), checkGradebookDataForStudent);
			if(getSessionStorageItem("currentTab") != 'notebooks') {
				HideNativeBottomBar(false);
			}
			break;
		case 'GetAssignmentSlidesInfo':
			if(CURRENTUSERROLE == studRole) {
				HideNativeBottomBar(true);
			} else {
				//HideNativeBottomBar(false);
			}
			trackLog('GetAssignmentSlidesInfo');
	        sp_GetAssignmentSlidesInfo(parameters);
			break;
		case 'GetAppProductDetailsInfo':
			var productCode = getSessionStorageItem("productCode");
			var productType = getSessionStorageItem("productType") || "";
			var deploymentServer = getSessionStorageItem("deploymentServer") || "";
			var postObj = {
				"productCode": 	productCode,		
				"productType": 	productType,
				"environment":	deploymentServer
			}
			GetAppProductDetailsInfoCallback(JSON.stringify(postObj));
			break;
		case 'GetAttemptDataForGradeableItem':
			var userID = getSessionStorageItem("userID");
	        var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					IAID: parameters.itemAttemptId.trim()					
				};
	        var url = SERVICEBASEURL + "GetAttemptDataForGradeableItem";
	        AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'SaveAttemptDataForGradeableItem':
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_SaveAttemptDataForGradeableItem(JSON.stringify(parameters));
				var url = SERVICEBASEURL + "SaveAttemptDataForGradeableItem";
				AjaxCall(
					url,
					"POST",
					postObj,
					function (poSaveAttemptDataResponse) {
						var bIsILit20 = top.isiLit20();
						
						if (bIsILit20 === true) {
							if (postObj["ItemCompleted"] === 'true') {
								AjaxCall(
									SERVICEBASEURL + "CheckAssignAutoScoreGradeableItems",
									"POST",
									{
										TokenID: TOKENID,
										DeviceTimeStamp: getCurTimeStamp(),
										CallerUserID: getSessionStorageItem("userID").trim(),
										CallerClassID: getSessionStorageItem("classID").trim()
									},
									function () {
										SetAttemptDataCallback.call(window, poSaveAttemptDataResponse);
									}
								)
								return;
							}
						}
						SetAttemptDataCallback(poSaveAttemptDataResponse);
					}
				);
			}
			break;
		case 'setProcessPKT':
			if(DENYFORCSR) {
				sp_setProcessPKT(parameters, callBackMethod);
			}
			break;
		case 'SetScoreForGradeableItem':
			if(DENYFORCSR) {
				var postObj ={};
				postObj = sp_SetScoreForGradeableItem(parameters);
				var url = SERVICEBASEURL + "SetScoreForGradeableItem";
				AjaxCall(url, "POST", postObj, callBackMethod);
			}
			break;
		case 'GetUnitDetails':
				sp_GetUnitDetails();
			break;
		case 'GetStudentListInfo':
			var jsonData = window.top.setRosterVariableForClientNativeJS();
			callBackMethod(jsonData);
			break;
		case 'GetUnitWeekDetails':
			sp_GetUnitWeekDetails();
			break;
		case 'GetAssignmentListInfo':
			if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
				sp_GetGradeableItemsForInstructor(parameters);
			}
			break;
		case 'GetGradebookForInstructorV2':
			checkIndexedCacheStatus(CACHEDSTATUSINSTRUCTORKEYNAME, call_GetGradebookForInstructor);
			break;
		case 'GetGradebookAttemptData':
			if(INDEXEDDBSUPPORT) {
				fetchCachedAttemptDataForInstructor(parameters.attemptIdInfo,checkAttemptDataForInstructor);
			} else {
				call_GetGradebookAttemptData(parameters.attemptIdInfo);
			}
			break;
		case 'GetGradebookForStudentV2':
			checkIndexedCacheStatus(CACHEDSTATUSSTUDENTKEYNAME, call_GetGradebookForStudent);
			break;
		case 'GetGradebookAttemptDataForStudApp':
			if(INDEXEDDBSUPPORT) {
				fetchCachedAttemptDataForStudApp(parameters.attemptIdInfo,checkAttemptDataForStudent);
			} else {
				call_GetGradebookAttemptDataForStudApp(parameters.attemptIdInfo);
			}
			break;
		case 'AssignGradeableItem':
			if(DENYFORCSR) {	
				var postObj = {};
				postObj = sp_AssignGradeableItem(parameters.assignInfo);
				var url = SERVICEBASEURL + "AssignGradeableItem";
				AjaxCall(url, "POST", postObj, AssignGradeableItemCallback);
			}
			break;
		case 'CheckAssignAutoScoreGradeableItems':
			if(DENYFORCSR) {	
				var postObj = {};
				postObj = sp_CheckAssignAutoScoreGradeableItems();
				var url = SERVICEBASEURL + "CheckAssignAutoScoreGradeableItems";
				AjaxCall(url, "POST", postObj, CheckAssignAutoScoreGradeableItemsCallback);
			}
			break;
		case 'SetCurrentWeekForClass':
			if(DENYFORCSR) {	
				var postObj = {};
				postObj = sp_SetCurrentWeekForClass(parameters);
				var url = SERVICEBASEURL + "SetCurrentWeekForClass";
				AjaxCall(url, "POST", postObj, SetCurrentWeekForClassCallback);
			}
			break;
		case 'RemoveGradeableItem':
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_RemoveGradeableItem(parameters.assignInfo);
				var url = SERVICEBASEURL + "RemoveGradeableItem";
				AjaxCall(url, "POST", postObj, RemoveGradeableItemCallback);
			}
			break;
		case 'ReAssignGradableItem':
			if(DENYFORCSR) {	
				var postObj = {};
				postObj = sp_ReAssignGradableItem(parameters);
				var url = SERVICEBASEURL + "ReAssignGradeableItem";
				AjaxCall(url, "POST", postObj, callBackMethod);
			}
			break;
		case 'GetData':
			// for getting data
			//console.log(parameters);
			var value = getSessionStorageItem(parameters.key);
			value = (value == null) ? '' : value;
			callBackMethod(value);
			break;
		case 'SaveData':
			// for saving data
			//console.log(parameters);
			if(DENYFORCSR) {
				setSessionStorageItem(parameters.key, parameters.value);
			}
			break;
		case 'onPageLoadComplete':
			if(DENYFORCSR) {
				// for sending log
				var endTime = window.top.getTimeInMs();
				var verbVal = endTime- getSessionStorageItem("eventStartTime");
				var eventTimeStamp = getSessionStorageItem("eventTimeStamp");
				var verbID = getSessionStorageItem("verbID");
				window.top.createLog(verbID, verbVal, eventTimeStamp);
				checkForGoogleEvents(parameters.type);
				if (
					parameters.type == "Assignment_Instructor" || 
					parameters.type == "Organizer" || 
					parameters.type == "Assignment"
				) {
					var postObj = {};
					postObj = sp_CheckAssignAutoScoreGradeableItems();
					var url = SERVICEBASEURL + "CheckAssignAutoScoreGradeableItems";
					AjaxCall(url, "POST", postObj, CheckAssignAutoScoreGradeableItemsCallback);
				}
			}
			break;
		case 'HasKitkat':
			// for android devices. Not for web client. Do nothing
			break;
		case 'GetMessageList': 
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var productCode = getSessionStorageItem("productCode");	
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					ProductCode: productCode,
					AppType: APPTYPE
				};
			var url = SERVICEBASEURL + "GetMessageList";
	        AjaxCall(url, "POST", postObj, sp_GetMessageList);
			break;
		case 'GetAppInfo': 
			sp_GetAppInfo();
			break;
		case 'HideNativeBottomBar': // for hiding/showing footer
			if(!window.top.broadcastEbookVisible) {
				var _status = parameters.status;
				window.top.hideShowBottomBar(_status);
			}
			break;
		case 'disableNativeBottomBar': // for hiding/showing footer
			var _flag = parameters.status;
			window.top.disableNavButtons(eval(_flag));
			break;
		case 'GetNotelist' :  // for notebook tab
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID"); 
			var noteType = parameters.noteType;
			var noteRefId = (parameters.noteRefId == '') ? '' : getServiceItemID(parameters.noteRefId);
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					NoteType: noteType,
					NoteRefID: noteRefId,
					DataRangeType: 'Full',
					MaxAttemptRevisionID: ''
				};
			var url = SERVICEBASEURL + "GetNotelist";
			AjaxCall(url, "POST", postObj, sp_GetNotelist);
			break;
		case 'GetNotelistV2' :  // for notebook tab
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID"); 
			var noteType = parameters.noteType;
			var noteRefId = (parameters.noteRefId == '') ? '' : getServiceItemID(parameters.noteRefId);;
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					NoteType: noteType,
					NoteRefID: noteRefId,
					DataRangeType: 'Full',
					MaxAttemptRevisionID: ''
				};
			var url = SERVICEBASEURL + "GetNotelist";
			AjaxCall(url, "POST", postObj, sp_GetNotelistV2);
			break;
		case 'GetNoteInfo' :  // for notebook tab
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID"); 
			var noteID = parameters.noteID;
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					NoteID: noteID
				};
			var url = SERVICEBASEURL + "GetNoteInfo";
			AjaxCall(url, "POST", postObj, sp_GetNoteInfo);
			break;
		case 'GetNotelistForInstructor' :  // for instructor notebook link
			var userID = parameters.studentid;
			var classID = getSessionStorageItem("classID"); 
			var noteType = parameters.noteType;
			var noteRefId = (parameters.noteRefId == '') ? '' : getServiceItemID(parameters.noteRefId);
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					NoteType: noteType,
					NoteRefID: noteRefId,
					DataRangeType: 'Full',
					MaxAttemptRevisionID: ''
				};
			var url = SERVICEBASEURL + "GetNotelist";
			AjaxCall(url, "POST", postObj, sp_GetNotelistForInstructor);
			break;
		case 'GetNotelistForInstructorV2' :  // for instructor notebook link
			var userID = parameters.studentid;
			var classID = getSessionStorageItem("classID"); 
			var noteType = parameters.noteType;
			var noteRefId = (parameters.noteRefId == '') ? '' : getServiceItemID(parameters.noteRefId);
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					NoteType: noteType,
					NoteRefID: noteRefId,
					DataRangeType: 'Full',
					MaxAttemptRevisionID: ''
				};
			var url = SERVICEBASEURL + "GetNotelist";
			AjaxCall(url, "POST", postObj, sp_GetNotelistForInstructorV2);
			break;
		case 'SaveNote' : // for saving notes
			if(DENYFORCSR) {
				var postObj = {};
				postObj = sp_SaveNote(JSON.stringify(parameters));
				var url = SERVICEBASEURL + "SaveNote";
				var jsonString = AjaxCallSync(url, "POST", postObj, "");
				GetSaveNoteCallback(jsonString,parameters.callerType);
			}
			break;
		case 'DeleteNote' : // for deleting notes
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var noteID = parameters.noteId;
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						NoteID: noteID
					};
				var url = SERVICEBASEURL + "DeleteNote";
				AjaxCall(url, "POST", postObj, callBackMethod);
			}
			break;
		case 'GetGradebookForStudent':
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID
			};
			var url = SERVICEBASEURL + "GetGradebookForStudent";
			AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'GetResourceInfo': // for resources under portfolios (in notebook tab - student)
			var gradePath = getSessionStorageItem('gradePath');
			var resourceJsonObj = {
				"mediaPath" :  gradePath +"projection/",
				"jsPath" : gradePath + "grade_resources.js"
			};
			resourceJsonString = JSON.stringify(resourceJsonObj);
			GetResourceInfoCallback(resourceJsonString);
			break;
		case 'SetGoogleAnalytic': // to log google analytics
			if(DENYFORCSR) {
				var jsonObj = window.top.EVENTJSON[parameters.verbid.trim()]
				if(jsonObj != undefined) {
					var category = jsonObj['event'];
					var action = jsonObj.action;
					var label = '';
					var activityID = '';
					var currentTab = getSessionStorageItem("currentTab");
					if(currentTab.toLowerCase() == 'lessons') {
						if(getSessionStorageItem("previewLessonInfoData")!= null) {
							var previewLessonInfoJson = JSON.parse(getSessionStorageItem("previewLessonInfoData"));
							activityID = previewLessonInfoJson.itemId.trim();
						} else if(getSessionStorageItem("lessonInfoData")!= null) {
							var lessonInfoJson = JSON.parse(getSessionStorageItem("lessonInfoData"));
							activityID = lessonInfoJson.itemId.trim();
						}
						label = window.top.getItemName(activityID);
					} else if(currentTab.toLowerCase() == 'library') {
						if(getSessionStorageItem("BookID")!= null) {
							activityID = getSessionStorageItem("BookID");
						}
						label = window.top.getItemName(activityID);
					} else if(currentTab.toLowerCase() == 'assignments') {
						if(getSessionStorageItem("StudentAssignID")!= null) {
							activityID = getSessionStorageItem("StudentAssignID");
						}
						label = window.top.getItemName(activityID);
					} else {
						label = 'UserID:'+USERID;
					}
					window.top.sendGoogleEvents(category,action,label);
					var curEvtTimeStamp = getCurTimeStamp();
					window.top.createLog(parameters.verbid.trim(), 0, curEvtTimeStamp, (parameters.itemId || ''));
				} else {
					console.log('VerbID not found!');
				}
			}
			break;
		case 'GetListOfConferenceStudentData' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					StudentID: parameters.studentId,
					ConfType: parameters.conferenceType
				};
			var url = SERVICEBASEURL + "GetListOfConferenceStudentData";
			AjaxCall(url, "POST", postObj, sp_GetListOfConferenceStudentData);
			break;
		case 'GetConferenceStudentData' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var itemID = getServiceItemID(parameters.itemId.trim());
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					StudentID: parameters.studentId,
					ItemID: itemID,
					ConfType: parameters.conferenceType
				};
			var url = SERVICEBASEURL + "GetConferenceStudentData";
			AjaxCall(url, "POST", postObj, sp_GetConferenceStudentData);
			break;
		case 'SaveConferenceStudentData' :
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var itemID = getServiceItemID(parameters.itemId.trim());
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						StudentID: parameters.studentId,
						ItemID: itemID,
						FinalScore: parameters.finalScore,
						ConferenceData: parameters.conferenceData,
						ConferenceTitle: parameters.conferenceTitle,
						ConfType: parameters.conferenceType
					};
				var url = SERVICEBASEURL + "SaveConferenceStudentData";
				AjaxCall(url, "POST", postObj, checkSuccess);
			}
			break;
		case 'GetLibraryProgress' : 
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var studentID = (parameters.studentId.trim() == '') ? userID : parameters.studentId.trim();
			var itemID = getServiceItemID(parameters.itemId.trim());
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				StudentID: studentID,
				ItemID: itemID
			};
			var url = SERVICEBASEURL + "GetLibraryProgress";
			AjaxCall(url, "POST", postObj, sp_GetLibraryProgress);
			break;
		case 'SaveLibraryProgress' : 
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var studentID = userID;
				var itemID = getServiceItemID(parameters.itemId.trim());
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						StudentID: studentID,
						ItemID: itemID,
						BookLexileLevel: parameters.bookLexileLevel,
						ProgressDataSummary: parameters.progressDataSummary.trim(),
						ProgressDataDetails: parameters.progressDataDetails.trim(),
						TotalNumberOfWordsRead: parameters.numberOfWordsRead,
						TotalNumberOfSecondsSpent: parameters.totNumberOfSecondsSpent
					};
					
				var url = SERVICEBASEURL + "SaveLibraryProgress";
				var winTopDocObj = $(window.top.document);
				/** modifcation for native bar review tab count **/
				isBookCompleted = JSON.parse(parameters.progressDataSummary.trim()).bookCompleted;
				if(isBookCompleted){
					GetLibraryProgressSummary();
				}
				/** modifcation for native bar review tab count **/
				if(winTopDocObj.find('#pdfReaderFrame').is(':visible') || winTopDocObj.find('#broadcastBackBtn').is(':visible')) {
					AjaxCallSync(url, "POST", postObj, checkSuccess);
				} else {
					AjaxCallSync(url, "POST", postObj, GetSaveLibraryProgressCallback);
				}
				
				
			}
			break;
		case 'GetLibraryProgressDetailForClass' : 
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID
			};
			var url = SERVICEBASEURL + "GetLibraryProgressDetailForClass";
			AjaxCallSync(url, "POST", postObj, sp_GetLibraryProgressDetailForClass);
			break;
		case 'GetCurrentBookForStudent' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var studentID = userID;
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerClassID: classID,
					StudentID: studentID
				};
			var url = SERVICEBASEURL + "GetCurrentBookForStudent";
			AjaxCall(url, "POST", postObj, sp_GetCurrentBookForStudent);
			break;
		case 'SetCurrentBookForStudent' :
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var studentID = userID;
				var itemID = getServiceItemID(parameters.ItemID.trim());
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						StudentID: studentID,
						ItemID: itemID
					};
				var url = SERVICEBASEURL + "SetCurrentBookForStudent";
				AjaxCall(url, "POST", postObj, checkSuccess);
			}
			break;
		case 'SetUserLevel' :
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var studentID = parameters.StudentID.trim();
				var lexileLevel = parameters.LexileLevel;
				var readingLevel = parameters.ReadingLevel;
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						StudentID: studentID,
						LexileLevel: lexileLevel,
						ReadingLevel: readingLevel,
						UserLexileLevelDetails: parameters.UserLexileLevelDetails,
						UserReadingLevelDetails: parameters.UserReadingLevelDetails
					};
				var url = SERVICEBASEURL + "SetUserLevel";
				if (top.isiLit20() === true) {
					AjaxCall(
						url,
						"POST",
						postObj,
						function (poSetUserLevelResponse) {
							AjaxCall(
								SERVICEBASEURL + "CheckAssignAutoScoreGradeableItems",
								"POST",
								{
									TokenID: TOKENID,
									DeviceTimeStamp: getCurTimeStamp(),
									CallerUserID: getSessionStorageItem("userID").trim(),
									CallerClassID: getSessionStorageItem("classID").trim()
								},
								function () {
									checkSuccess.call(window, poSetUserLevelResponse);
								}
							)
						}
					);
				}
				else {
					AjaxCall(url, "POST", postObj, checkSuccess);
				}
			}
			break;
		case 'GetUserLevel' :
			var userID = '';
			if(CURRENTUSERROLE == instRole || ALLOWFORCSR) {
				userID = parameters.studentId.trim();
			} else if(CURRENTUSERROLE == studRole) {
				userID = getSessionStorageItem("userID");
			}
			var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
			var url = SERVICEBASEURL + "GetUserLevel";
			AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'GetClassUserLevel' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
			var url = SERVICEBASEURL + "GetClassUserLevel";
			AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'GetPerformanceInfo' :
			sp_GetPerformanceInfo();
			break;
		case 'GetSkillBasedReportDataByWeekRange' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
			var url = SERVICEBASEURL + "GetskillbasedreportdatabyWeekRange";
			AjaxCall(url, "POST", postObj, sp_GetSkillBasedReportDataByWeekRange);
			break;
		case 'GetSkillTaxonomyInformation' :
			var userID = getSessionStorageItem("userID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID
				};
			var url = SERVICEBASEURL + "GetSkillTaxonomyInformation";
			AjaxCall(url, "POST", postObj, sp_GetSkillTaxonomyInformation);
			break;
		case 'HideEbookBroadcast' :
			window.top.broadcastEbookID = '';
			window.top.broadcastEbookVisible = false;
			window.top.closeBroadcast();
			break;
		case 'GetScribbleData' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var scribbleIDs = parameters.scribbleIDs;
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					ScribbleIDsCSV: scribbleIDs
				};
			var url = SERVICEBASEURL + "GetScribbleData";
			AjaxCall(url, "POST", postObj, sp_GetScribbleData);
			break;
		case 'CheckMicStatus' :
			window.top.initAudioRecorder(callBackMethod);
			break;
		case 'RecordStopAudio' :
			window.top.recordStopAudioAction(parameters.action.trim().toLowerCase(),callBackMethod);
			break;
		case 'PlayPauseAudio' :
			window.top.playPauseAudioAction(parameters.action.trim().toLowerCase(),callBackMethod);
			break;
		case 'SaveAudio' :
			if(DENYFORCSR) {
				window.top.SaveAudio(parameters,callBackMethod);
			}
			break;
		case 'OralfluencyReservation' :
			if(DENYFORCSR) {	
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID
					};
				var url = SERVICEBASEURL + "OralfluencyReservation";
				AjaxCall(url, "POST", postObj, callBackMethod);
			}
			break;
		case 'OralfluencySubmitScoreRequest' :
			if(DENYFORCSR) {
				var userID = getSessionStorageItem("userID");
				var classID = getSessionStorageItem("classID");
				var postObj = {
						TokenID: TOKENID,
						DeviceTimeStamp: getCurTimeStamp(),
						CallerUserID: userID,
						CallerClassID: classID,
						TestInstanceId: parameters.testInstanceId,
						ItemType: parameters.itemType,
						ItemId: parameters.itemId,
						ContentName: parameters.contentName,
						ContentURL: parameters.contentURL
					};
				var url = SERVICEBASEURL + "OralfluencySubmitScoreRequest";
				AjaxCall(url, "POST", postObj, callBackMethod);
			}
			break;
		case 'OralfluencyGetScoreData' :
			var userID = getSessionStorageItem("userID");
			var classID = getSessionStorageItem("classID");
			var postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID,
					TestInstanceId: parameters.testInstanceId
				};
			var url = SERVICEBASEURL + "OralfluencyGetScoreData";
			AjaxCall(url, "POST", postObj, callBackMethod);
			break;
		case 'ShowWebView' :
			// not for webclient
			break;
		case 'CloseWebView' :
			// not for webclient
			break;
		case 'fnIsWinRT' :
			// not for webclient
			break;
		case 'SetBuzzComment':	// IPP-4099
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID");
			delete parameters['method'];
			var postObj = $.extend({
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				}, parameters);
				
			var url = SERVICEBASEURL + "SetBuzzComment";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetBuzzCmtDetails':	// IPP-4099
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
				
			var url = SERVICEBASEURL + "GetBuzzCmtDetails";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetPollList':	// IPP-4099
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID: TOKENID,
					DeviceTimeStamp: getCurTimeStamp(),
					CallerUserID: userID,
					CallerClassID: classID
				};
				
			var url = SERVICEBASEURL + "GetPollList";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetPollInfo':	// IPP-4099
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		userID,
					CallerClassID:		classID,
					PollID:				parameters['PollID']
				};
				
			var url = SERVICEBASEURL + "GetPollInfo";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'UpdatePoll':	// IPP-4099
			delete parameters['method'];
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = $.extend({
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		userID,
					CallerClassID:		classID
				}, parameters);
				
			var url = SERVICEBASEURL + "UpdatePoll";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetUserSettings':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		userID,
					CallerClassID:		classID
				};
				
			var url = SERVICEBASEURL + "GetUserSettings";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'SaveUserSettings':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		userID,
					CallerClassID:		classID,
					PersonalSettings:	(parameters['personalSettings'] || '%7B%7D')
				};
				
			var url = SERVICEBASEURL + "SaveUserSettings";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'SaveClassSettings':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID,
					SaveSettingsToAllNewClasses:	parameters['saveGlobally'],
					AssignmentSendingMode:			parameters['sASM'],
					AcceptOralFluencyScore:			parameters['sAOFS'],
					ShowCriticalResponse:			parameters['sSCR'],
					ClassGraphSnapshot:				parameters['sCGN'],
					StudentDataSnapshot:			parameters['sSDS'],
					ProjectSnapshot:				parameters['sPS'],
					AcceptLibraryResponseScore:		parameters['sALRS'],
					AcceptNarrativeEssayResponseScore:parameters['sANERS'],
					AvatarLibrary:					(parameters['sAL'] || '')
				};
			
			var url = SERVICEBASEURL + "SaveClassSettings";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetClassSettings':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID
				};
			
			var url = SERVICEBASEURL + "GetClassSettings";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'SaveClassCalendarSettings':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID,
					SaveSettingsToAllNewClasses:	parameters['saveGlobally'],
					AcademicCalendarJSON:			parameters['sACJ']
				};
			
			var url = SERVICEBASEURL + "SaveClassCalendarSettings";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetCurrentWeekForClass':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID
				};
			var url = SERVICEBASEURL + "GetCurrentWeekForClass";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'SaveInterestInventory':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID,
					SurveyResponse:					parameters["SurveyResponseJSON"],
					StudenInterestInventory:		parameters["StudenInterestInventoryJSON"],
					InventoryTerm:					parameters["InventoryTerm"]
				};
			var url = SERVICEBASEURL + "SaveInterestInventory";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetInterestInventory':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID,
					StudentID:						parameters["studentID"]
				};
			var url = SERVICEBASEURL + "GetInterestInventory";
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetBookReviewFeedback':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				postObj = {
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		parameters["studentID"] ? parameters["studentID"] : userID,
					CallerClassID:		classID,
					StudentID:			parameters["studentID"] ? parameters["studentID"] : userID,
					ItemIDs:			sp_GetBookReviewFeedback(parameters["ItemIDs"])
				},
				url = SERVICEBASEURL + "GetBookReviewFeedback";
			
			AjaxCall(
				url,
				"POST",
				postObj,
				function (psGetBookReviewFeedbackResponse) {
					callBackMethod.call(window, sp_GetBookReviewFeedbackResponse(psGetBookReviewFeedbackResponse));
				}
			);
		break;
		case 'SaveBookReviewFeedback':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				iBookID = sp_SaveBookReviewFeedback(parameters["BookID"]),
				postObj = {
					TokenID:			TOKENID,
					DeviceTimeStamp:	getCurTimeStamp(),
					CallerUserID:		userID,
					CallerClassID:		classID,
					ItemID:				iBookID,
					Rating:				parameters["Rating"],
					Comments:			parameters["Comments"],
					CSVFeebackTags:		parameters["CSVFeedbackTags"]
				},
				url = SERVICEBASEURL + "SaveBookReviewFeedback";
			
			if (iBookID === '') {
				callBackMethod.call(
					window,
					JSON.stringify({
						"Status": "500",
						"Error": {
							"ErrorTechDescription": "Invalid Book ID",
							"ErrorUserDescription": "Invalid Book ID"
						},
						"Content": null
					})
				);
				break;
			}
			/** modification for native bar review tab count **/
				isBookCompleted = true;
				GetLibraryProgressSummary();
			/** modification for native bar review tab count **/
			AjaxCall(url, "POST", postObj, callBackMethod);
		break;
		case 'GetItemSkillMapping':
			var userID = getSessionStorageItem("userID"),
				classID = getSessionStorageItem("classID"),
				ProductGradeID = getSessionStorageItem("productGradeID")
				postObj = {
					TokenID:						TOKENID,
					DeviceTimeStamp:				getCurTimeStamp(),
					CallerUserID:					userID,
					CallerClassID:					classID,
					ProductGradeID:					ProductGradeID
				};
			var url = SERVICEBASEURL + "GetItemSkillMapping";
			AjaxCall(
				url,
				"POST",
				postObj,
				function (psGetItemSkillMappingResponse) {
					callBackMethod.call(window, sp_GetItemSkillMapping(psGetItemSkillMappingResponse));
				}
			);
		break;
		case 'GetListOfReservedBooks':			
			var userID = getSessionStorageItem("userID").trim();
			var classID = getSessionStorageItem("classID").trim();	
			
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID			
			};
			var url = SERVICEBASEURL + "GetListOfReservedBooks";
			AjaxCall(url, "POST", postObj, sp_GetListOfReservedBooks);
	    break;
		case 'ReserveOrUnreserveBook':			
			var userID = getSessionStorageItem("userID").trim();
			var classID = getSessionStorageItem("classID").trim();	
			
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID,
				ItemID: getServiceItemID(parameters["itemID"]),
				Action: parameters["action"],
			};
			var url = SERVICEBASEURL + "ReserveOrUnreserveBook";
			AjaxCall(url, "POST", postObj, sp_ReserveOrUnreserveBook);
	    break;
		case 'GetUserFeedbackforAllBooks':			
			var userID = getSessionStorageItem("userID").trim();
			var classID = getSessionStorageItem("classID").trim();	
			
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				CallerClassID: classID
			};
			var url = SERVICEBASEURL + "GetUserFeedbackforAllBooks";
			AjaxCall(url, "POST", postObj, sp_GetUserFeedbackforAllBooks);
	    break;
            case 'GetRecommendedBooks':			
			var userID = getSessionStorageItem("userID").trim();
			var classID = getSessionStorageItem("classID").trim();
			var studID = parameters["studentID"];
			
			var postObj = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurTimeStamp(),
				CallerUserID: userID,
				StudentID: studID ? studID : userID,
				CallerClassID: classID
			};
			var url = SERVICEBASEURL + "GetRecommendedBooks";
			AjaxCall(url, "POST", postObj, sp_GetRecommendedBooks);
			
			case 'getCurrentDeviceTimestamp':	
				sp_GetCurrentDeviceTimestamp();
			
	    break;
		default:
			alert('Method: ' + parameters.method + ' not found!');
			console.log('Method: ' + parameters.method + ' not found!');
		break;
	}
}

// for tracking log
function trackLog(ev) {

	switch(ev)
	{
		case 'SetProjectSlide' 			: setSessionStorageItem("verbID", "AP");
										break;
		case 'surveyAttempted' 			: setSessionStorageItem("verbID", "S-SA");
										break;
		case 'surveyFinished' 			: setSessionStorageItem("verbID", "T-SF");
										break;
		case 'GetEbookInfo'				: setSessionStorageItem("verbID", "IL");
										break;
		case 'GetAssignmentSlidesInfo'	: setSessionStorageItem("verbID", "IL");
										break;						
	}
	
	var currEventTimeStamp = getCurTimeStamp();
	setSessionStorageItem("eventStartTime", window.top.getTimeInMs());
	setSessionStorageItem("eventTimeStamp", currEventTimeStamp);
}

// setting category, action and labels of the events and send those events to Google Analytics
function checkForGoogleEvents(_tabType) {
	var _action, _category = '';
	var userRoleFlag = (CURRENTUSERROLE == instRole);
	var _label = 'UserID:'+USERID;
	var activityID = '';
	switch(_tabType)
	{
		case 'Planner': 
			_category = 'Teacher - Planner';
			_action = 'Viewed Planner';
			break;
		case 'Lesson':
			_category = _action = 'ItemLaunched';
			if(getSessionStorageItem("previewLessonInfoData")!= null) {
				var previewLessonInfoJson = JSON.parse(getSessionStorageItem("previewLessonInfoData"));
				activityID = previewLessonInfoJson.itemId.trim();
			} else if(getSessionStorageItem("lessonInfoData")!= null) {
				var lessonInfoJson = JSON.parse(getSessionStorageItem("lessonInfoData"));
				activityID = lessonInfoJson.itemId.trim();
			}
			var _labelIL = 'Lesson:-' + window.top.getItemName(activityID);
			window.top.sendGoogleEvents(_category,_action,_labelIL);
			_category = 'Teacher - Lessons';
			_action = 'Viewed Lesson';
			_label = _labelIL;
			break;
		case 'Assignment_Instructor':
			_category = 'Teacher - Assignments';
			_action = 'Viewed Assignment Dashboard';
			break;
		case 'Library':
			if(userRoleFlag) {
				_category = 'Teacher - Library';
				_action = 'Viewed Library (T)';
			} else {
				_category = 'Student - Library';
				_action = 'Viewed Library (S)';
			}
			break;
		case 'Instructor_Message':
			_category = 'Teacher - Messages';
			_action = 'Viewed Messages';
			break;
		case 'Assignment':
			_category = 'Student - Assignments';
			_action = 'Viewed List of Assignments';
			break;
		case 'Ebook':
			_category = _action = 'ItemLaunched';
			if(getSessionStorageItem("BookID")!= null)
			{
				activityID = getSessionStorageItem("BookID");
			}
			_label = 'Book:-' + window.top.getItemName(activityID);
			break;
		case 'AssignmentSlide':
			_category = _action = 'ItemLaunched';
			if(getSessionStorageItem("StudentAssignID") != null) {
				activityID = getSessionStorageItem("StudentAssignID");
			}
			_label = 'Assignment:-' + window.top.getItemName(activityID);
			break;
	}
	window.top.sendGoogleEvents(_category,_action,_label);
}

function getCurTimeStamp() {
	return window.top.getCurrentTimestamp();
}

function AjaxCall(DestinationUrl, MethodType, Data, CallBack) {
    var DTO;
    if (MethodType === "GET" || MethodType === "DELETE") {
        DTO = null;
    }
    else { DTO = JSON.stringify(Data); }
	//console.log(DestinationUrl);
	try {
		$.ajax({
			url: DestinationUrl,
			cache: false,
			type: MethodType,
			contentType: 'application/json; charset=utf-8',
			data: DTO,
			success: function (data) {
				var dataJSON = JSON.parse(data);
				if(dataJSON.Status == '500' && dataJSON.Error.ErrorCode == 'U1065') {
					window.top.forceToLoginOnInValidToken();
					return false;
				} else {
					if (CallBack && (typeof CallBack == "function")) {
						CallBack(data);
					}
					else { DTO = data; }
				}
			},
			error: function (err, txtStatus, errorThrown) {
				console.log("Error! " + errorThrown);
			}
		});
	} catch(e) {}

    return DTO;
}

function AjaxCallSync(DestinationUrl, MethodType, Data, CallBack) {
    var DTO;
    if (MethodType === "GET" || MethodType === "DELETE") {
        DTO = null;
    }
    else { DTO = JSON.stringify(Data); }
	//console.log(DestinationUrl);
    try {
		$.ajax({
			url: DestinationUrl,
			async: false,
			cache: false,
			type: MethodType,
			contentType: 'application/json; charset=utf-8',
			data: DTO,
			success: function (data) {
				var dataJSON = JSON.parse(data);
				if(dataJSON.Status == '500' && dataJSON.Error.ErrorCode == 'U1065') {
					window.top.forceToLoginOnInValidToken();
					return false;
				} else {
					if (CallBack && (typeof CallBack == "function")) {
						CallBack(data);
					}
					else { DTO = data; }
				}
			},
			error: function (err, txtStatus, errorThrown) {
				console.log("Error! " + errorThrown);
			}
		});
	} catch(e) {}

    return DTO;
}


function getSessionStorageItem(itemName) {
	var itemVal = sessionStorage.getItem(itemName);
    return itemVal;
}
function setSessionStorageItem(itemName, itemVal) {
	sessionStorage.setItem(itemName, itemVal);
}
function removeSessionStorageItem(itemName, itemVal) {
	sessionStorage.removeItem(itemName);
}
function enableLessonButton() {
   //setSessionStorageItem("enableLesson", true);
   window.top.checkLessonButton();
}
function setSBUrl(sbUrl, bUrl) {
    SERVICEBASEURL = sbUrl; /* */
    siteBaseUrl = bUrl; /* */
}

function checkSuccess(response) {
	if(response != null) {
		var data = JSON.parse(response);
		var error = data.Error;
		var content = data.Content;
		if(error == null && content != null && data.Status == '200')
		{
			//its a success
			//console.log(response);
			var verbID = getSessionStorageItem("verbID");
			if(verbID == "AP" || verbID == 'T-SS' || verbID == 'S-SA' || verbID == 'T-SF')
			{
				//var endTime = window.top.getTimeInMs();
				//var verbVal = endTime- getSessionStorageItem("eventStartTime");
				var eventTimeStamp = getSessionStorageItem("eventTimeStamp");
				
				if(verbID == 'AP' && getSessionStorageItem('projectionStatus')=='Start')
					window.top.createLog(verbID, 0, eventTimeStamp);
				
				if(verbID == 'T-SS' || verbID == 'S-SA' || verbID == 'T-SF')
					window.top.createLog(verbID, 0, eventTimeStamp);
			}
		}
		else if(error != null && content == null)
		{
			alert(error.ErrorUserDescription);
		}
	}
}

function getServiceItemID(key) {
	return window.top.CMSIDsTOSERVCIDsMAPPING[key];
}

function getCMSItemID(key) {
	return window.top.SERVCIDsTOCMSIDsMAPPING[key];
}

function getAssignmentTOCInfoByServcID(key) {
	return window.top.ASSIGNMENTITEMJSONSERVCIDs[key];
}

function getAssignmentTOCArray() {
	return window.top.ASSIGNMENTITEMARR;
}

function checkIndexedCacheStatus(cacheTable,callbackFunc) {
	var cacheStatus = '';
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB');
			switch(cacheTable) {
				case CACHEDSTATUSINSTRUCTORKEYNAME:
					idbReq.onsuccess = function(evt) {
						var idbResult = evt.target.result;
						var idbObjStoreCSTransc = idbResult.transaction(['CS'],'readwrite');
						idbObjStoreCSTransc.oncomplete = function(evtTrans) {
							//alert('fetching done');
							callbackFunc(cacheStatus);
						};
						idbObjStoreCSTransc.onerror = function(evtTrans) {
							alert('Error while fetching cache status : ' + evtTrans.target.error.message);
						};
						var cacheObjStore = idbObjStoreCSTransc.objectStore('CS');
						var getCachedValueReq = cacheObjStore.get(CACHEDSTATUSINSTRUCTORKEYNAME);
						getCachedValueReq.onsuccess = function(evtCOSR) {
							cacheStatus = evtCOSR.target.result;
						};
					};
					idbReq.onerror = function(evt) {
						alert('Error while checking cache status: ' + evt.target.error.message);
					};
					break;
				case CACHEDSTATUSSTUDENTKEYNAME:
					idbReq.onsuccess = function(evt) {
						var idbResult = evt.target.result;
						var idbObjStoreCSTransc = idbResult.transaction(['CS'],'readwrite');
						idbObjStoreCSTransc.oncomplete = function(evtTrans) {
							//alert('fetching done');
							callbackFunc(cacheStatus);
						};
						idbObjStoreCSTransc.onerror = function(evtTrans) {
							alert('Error while fetching cache status : ' + evtTrans.target.error.message);
						};
						var cacheObjStore = idbObjStoreCSTransc.objectStore('CS');
						var getCachedValueReq = cacheObjStore.get(CACHEDSTATUSSTUDENTKEYNAME);
						getCachedValueReq.onsuccess = function(evtCOSR) {
							cacheStatus = evtCOSR.target.result;
						};
					};
					idbReq.onerror = function(evt) {
						alert('Error while checking cache status: ' + evt.target.error.message);
					};
					break;
				default:
					alert('Cache Status entry for ' + cacheTable + ' not found. Please check.');
			}
		} catch(e) {
			alert(e.message);
		}
	} else {
		callbackFunc(cacheStatus);
	}
	return false;
}

function addUpdateCacheStatus(cacheTable,cacheVal) {
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB');
			switch(cacheTable) {
				case CACHEDSTATUSINSTRUCTORKEYNAME:
					idbReq.onsuccess = function(evt) {
						var idbResult = evt.target.result;
						var idbObjStoreCSTransc = idbResult.transaction(['CS'],'readwrite');
						idbObjStoreCSTransc.oncomplete = function(evtTrans) {
							//console.log('cache val saved done');
						};
						idbObjStoreCSTransc.onerror = function(evtTrans) {
							alert('Error while fetching cache status : ' + evtTrans.target.error.message);
						};
						var cacheObjStore = idbObjStoreCSTransc.objectStore('CS');
						cacheObjStore.put(cacheVal,CACHEDSTATUSINSTRUCTORKEYNAME);
					};
					idbReq.onerror = function(evt) {
						alert('Error while checking cache status: ' + evt.target.error.message);
					};
					break;
				case CACHEDSTATUSSTUDENTKEYNAME:
					idbReq.onsuccess = function(evt) {
						var idbResult = evt.target.result;
						var idbObjStoreCSTransc = idbResult.transaction(['CS'],'readwrite');
						idbObjStoreCSTransc.oncomplete = function(evtTrans) {
							//console.log('cache val saved done');
						};
						idbObjStoreCSTransc.onerror = function(evtTrans) {
							alert('Error while fetching cache status : ' + evtTrans.target.error.message);
						};
						var cacheObjStore = idbObjStoreCSTransc.objectStore('CS');
						cacheObjStore.put(cacheVal,CACHEDSTATUSSTUDENTKEYNAME);
					};
					idbReq.onerror = function(evt) {
						alert('Error while checking cache status: ' + evt.target.error.message);
					};
					break;
				default:
					alert('Cache Status entry for ' + cacheTable + ' not found. Please check.');
			}
		} catch(e) {
			alert(e.message);
		}
	}
	return false;
}

function fetchCachedAttemptDataForInstructor(attemptDataArr,dataCallBackFunc) {
	if(INDEXEDDBSUPPORT) {
		try {
			var cachedDataJSON = {};
			var idbReq = window.indexedDB.open('cacheDB');
			idbReq.onsuccess = function(evt) {
				var idbResult = evt.target.result;
				var idbObjStoreCSTransc = idbResult.transaction([INSTRDBNAME],'readwrite');
				idbObjStoreCSTransc.oncomplete = function(evtTrans) {
					//console.log('fetchCachedAttemptDataForInstructor: cached data fetched');
				};
				idbObjStoreCSTransc.onerror = function(evtTrans) {
					alert('Error while fetching cache status : ' + evtTrans.target.error.message);
				};
				var cacheObjStore = idbObjStoreCSTransc.objectStore(INSTRDBNAME);
				var getObjStoreReq = cacheObjStore.openCursor();
				getObjStoreReq.onsuccess = function(evtCursor) {
				  var cursor = evtCursor.target.result;
				  if(cursor) {
					var value = cursor.value;
					if(value.CLID === CLASSID) {
						cachedDataJSON[value.IAID] = value;
					}
					cursor.continue();
				  } else {
					// no more results
					dataCallBackFunc(attemptDataArr,cachedDataJSON);
				  }
				}
				getObjStoreReq.onerror = function(evtCursor) {
					alert('Error while fetching data: ' + evtCursor.target.error.message);
				};
			};
			idbReq.onerror = function(evt) {
				alert('Error while opening DB: ' + evt.target.error.message);
			};
		} catch(e) {
			alert(e.message);
		}
	} else {
		alert('IndexedDB not supported. Please check.');
	}
	return false;
}

function addUpdateAttemptData(attemptDataJSON,callbackFunc) {
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB');
			var attemptDataArr = attemptDataJSON.Content;
			idbReq.onsuccess = function(evt) {
				var idbResult = evt.target.result;
				var idbObjStoreCSTransc = idbResult.transaction([INSTRDBNAME],'readwrite');
				idbObjStoreCSTransc.oncomplete = function(evtTrans) {
					callbackFunc([],checkAttemptDataForInstructor);
					addUpdateCacheStatus(CACHEDSTATUSINSTRUCTORKEYNAME,ATTEMPTDATACACHESTATUS.INSTR);
					//console.log('add / update attempt data done');
				};
				idbObjStoreCSTransc.onerror = function(evtTrans) {
					alert('Error while fetching cache status : ' + evtTrans.target.error.message);
				};
				var cacheObjStore = idbObjStoreCSTransc.objectStore(INSTRDBNAME);
				var classID = getSessionStorageItem('classID');
				for(var i = 0; i < attemptDataArr.length; i++) {
					attemptDataArr[i].CLID = classID;
					cacheObjStore.put(attemptDataArr[i],attemptDataArr[i].IAID);
				}
			};
			idbReq.onerror = function(evt) {
				alert('Error while checking cache status: ' + evt.target.error.message);
			};
		} catch(e) {
			alert(e.message);
		}
	}
	return false;
}

function fetchCachedAttemptDataForStudApp(attemptDataArr,dataCallBackFunc) {
	if(INDEXEDDBSUPPORT) {
		try {
			var cachedDataJSON = {};
			var idbReq = window.indexedDB.open('cacheDB');
			idbReq.onsuccess = function(evt) {
				var idbResult = evt.target.result;
				var idbObjStoreCSTransc = idbResult.transaction([STUDNTDBNAME],'readwrite');
				idbObjStoreCSTransc.oncomplete = function(evtTrans) {
					//console.log('fetchCachedAttemptDataForStudApp: cached data fetched');
				};
				idbObjStoreCSTransc.onerror = function(evtTrans) {
					alert('Error while fetching cache status : ' + evtTrans.target.error.message);
				};
				var cacheObjStore = idbObjStoreCSTransc.objectStore(STUDNTDBNAME);
				var getObjStoreReq = cacheObjStore.openCursor();
				getObjStoreReq.onsuccess = function(evtCursor) {
				  var cursor = evtCursor.target.result;
				  if(cursor) {
					var value = cursor.value;
					if(value.SID === USERID) {
						cachedDataJSON[value.IAID] = value;
					}
					cursor.continue();
				  } else {
					// no more results
					dataCallBackFunc(attemptDataArr,cachedDataJSON);
				  }
				}
				getObjStoreReq.onerror = function(evtCursor) {
					alert('Error while fetching data: ' + evtCursor.target.error.message);
				};
			};
			idbReq.onerror = function(evt) {
				alert('Error while opening DB: ' + evt.target.error.message);
			};
		} catch(e) {
			alert(e.message);
		}
	} else {
		alert('IndexedDB not supported. Please check.');
	}
	return false;
}

function addUpdateAttemptDataForStudent(attemptDataJSON,callbackFunc) {
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB');
			var attemptDataArr = attemptDataJSON.Content;
			idbReq.onsuccess = function(evt) {
				var idbResult = evt.target.result;
				var idbObjStoreCSTransc = idbResult.transaction([STUDNTDBNAME],'readwrite');
				idbObjStoreCSTransc.oncomplete = function(evtTrans) {
					callbackFunc([],checkAttemptDataForStudent);
					addUpdateCacheStatus(CACHEDSTATUSSTUDENTKEYNAME,ATTEMPTDATACACHESTATUS.STUDNT);
					//console.log('add / update attempt data done');
				};
				idbObjStoreCSTransc.onerror = function(evtTrans) {
					alert('Error while fetching cache status : ' + evtTrans.target.error.message);
				};
				var cacheObjStore = idbObjStoreCSTransc.objectStore(STUDNTDBNAME);
				var classID = getSessionStorageItem('classID');
				var assignmentTCOVal;
				for(var i = 0; i < attemptDataArr.length; i++) {
					assignmentTCOVal = getAssignmentTOCInfoByServcID(attemptDataArr[i].AIID);
					if(assignmentTCOVal != undefined) {
						attemptDataArr[i].IDN = assignmentTCOVal.itemDisplayName;
						attemptDataArr[i].ISU = (assignmentTCOVal.subject == '') ? 'none' : assignmentTCOVal.subject;
						attemptDataArr[i].IUN = +(assignmentTCOVal.unitNumber);
						attemptDataArr[i].IWN = +(assignmentTCOVal.weekNumber);
						attemptDataArr[i].ILN = +(assignmentTCOVal.dayNumber);
						attemptDataArr[i].CMSID = assignmentTCOVal.itemID;
						attemptDataArr[i].CLID = classID;
						cacheObjStore.put(attemptDataArr[i],attemptDataArr[i].IAID);
					} else {
						console.log('Attempt not found in TOC for ' + attemptDataArr[i].IAID);
					}
				}
			};
			idbReq.onerror = function(evt) {
				alert('Error while checking cache status: ' + evt.target.error.message);
			};
		} catch(e) {
			alert(e.message);
		}
	}
	return false;
}
/**
 *
 * WebClient related code ends here
 *
 */