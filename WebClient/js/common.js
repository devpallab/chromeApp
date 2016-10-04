// COMMON.JS

/** 
	myEld implementation 
	valid product type values can be either 'myeld' or 'ilit' or 'wtw' 
*/
var PRODTYPE = 'ilit'; 

var PRODTYPE_CONSTANT = {
	"c_s_PROD_TYPE_MYELD": "myeld",
	"c_s_PROD_TYPE_ILIT": "ilit",
	"c_s_PROD_TYPE_WTW": "wtw",
};

// *************************************** CONSTANT / COMMON VARIABLES DEFINED / DECLARATION STARTS HERE ****************************************
// SERVICE API PATH
//var SERVICEBASEURL = 'http://52.11.144.110/WebAPI/';
var SERVICEBASEURL = 'https://iseriesqa-bts2016.learningmate.com/WEBAPI/';
// GOOGLE ANALYTICS TRACKING ID
var GTRACKID = 'UA-64909673-1';
// TYPE OF THE APP
var APPTYPE = 'webclient';
// CURRENT VERSION OF THE APP
var APPVERNUM = '6.0.20';
// VARIABLE SET TO INDICATE ON WHICH SERVER IT IS DEPLOYED
var deploymentServer = '';
if(SERVICEBASEURL === 'http://52.11.144.110/WebAPI/') {
	deploymentServer = 'D';
} else if(SERVICEBASEURL === 'https://iseriesqa-bts2016.learningmate.com/WEBAPI/') {
	deploymentServer = 'Q';
} else if(SERVICEBASEURL === 'http://54.241.251.5/WEBAPI/') {
	deploymentServer = 'S';
} else if(SERVICEBASEURL === 'http://52.8.114.39/WEBAPI/') {
	deploymentServer = 'P';
}
// STORES TOKEN ID
var TOKENID = '';
// INDICATES THE CURRENT TAB
var CURRENTTAB = 0;
// INDICATES PRODUCTGRADE ID OF THE CURRENT LOGIN
var PRODGRDID = '';
// INDICATES CLASSID OF THE CURRENT LOGIN
var CLASSID = '';
// INDICATES USERID OF THE CURRENT LOGIN
var USERID = '';
// INDICATES CURRENT USER ROLE
var USERROLE = '';
// INDICATES STUDENT ROLE
var STUDROLE = 's';
// INDICATES ARRAY OF ADMIN ROLES WHICH ARE ALLOWED FOR CLASS SUMMARY REPORT
var ADMINROLE = ['sa','pa','da','sca'];
// SETINTERVAL VARIABLE FOR SETBULKLOG
var SETBULKLOGINTERVAL = null;
// STORES LOGS GENERATED TO BE SEND IN SETBULKLOG SERVICE
var logArr = [];
// TIME INTERVAL FOR LOGS TO BE SEND TO SERVER THROUGH SETBULKLOG SERVICE
var SETBULKLOGTIMER = 60000;
// CURRENT EVENT TIMESTAMP, TIMESTAMP FOR LOGIN EVENT, LOGIN VERB ID, START TIME AND END TIME OF THE EVENT
var currEventTimeStamp,loginCurrEventTimeStamp,loginVerbVal, startTime, endTime;
// TO STORE DATA RECIEVED FROM GRADE_ITEMS.JS
var objGradeItemsData = null;
// FLAG TO START CHECKING FOR INTERNET CONNECTION
var internetCheckIntervalStart = true;
// TO STORE THE INSTANCE OF INTERNET CHECK INTERVAL
var internetCheckInterval = null;
// STORES INTERNTE CHECK DURATION
var internetCheckIntervalTimer = 60000;
// FLAG TO START CHECKING FOR INTERNET CONNECTION FOR AUDIO UPLOAD 
var internetCheckUAIntervalStart = true;
// TO STORE THE INSTANCE OF INTERNET CHECK INTERVAL FOR AUDIO UPLOAD 
var internetCheckUAInterval = null;
// STORES INTERNTE CHECK DURATION FOR AUDIO UPLOAD 
var internetCheckUAIntervalTimer = 300000;
// STORES DATA RECIEVED FROM GETLIBRARYPROGRESS SERVICE CALL MADE FOR PDF
var getLibProgObj = {};
// STORES BOOKINFO WHEN PDF BOOK IS OPENED OR BROADCASTED
var bookInfoPDFObj = {};
//SAVES PROGRESS OF PAGE FONT-SIZE, PAGE NO.
var objLibraryProgress = '';
//WORD COUNT PER PAGE, TIME IN SECS TO INCREMENT COUNT, CLEAR TIME OUT VARIABLE, BOOK READING COMPLETE FLAG
var wordsPerPage = 150, wordCountTime = 30, wordCountTime4ilit20 = 60, wordCountTimeOut, bookReadEnd= false;
// STORES TOTAL WORDS READ BY THE USER
var totalWordsRead = 0;
// STORES ACTUAL TOTAL WORDS IN BOOK PROVIDED BY CMS
var totalWordInBook = 0;
// STORES WORDS COUNT FOR EACH COMBINATION OF UNIT AND WEEK
var WordCountObj={};
// STORES TEMP DATA FOR WEEK WISE COUNT WHEN PDF BOOK IS OPEN
var weekWiseWordCount = 0;
// STORES TEMP DATA FOR WEEK WISE COUNT WHEN PDF BOOK IS OPEN
var _Browser = {
	isSafari : /^((?!chrome).)*safari/i.test(navigator.userAgent)
};
// STORES GLOBAL PRODUCT CODE RECIEVED FROM AFTER SELECTING A CLASS
var PRODUCTCODE = '';
// STORES PRODUCT CODE OF ILIT THAT NEEDS TO BE USED FOR CONDITIONAL CHECKING
var PRODCODETOBECHECKED = 'ilit';
// ARRAY TO STORE ASSIGNMENT / ASSESSMENT TYPE OF ITEMS
var ASSIGNMENTITEMARR = [];
// ARRAY TO STORE ASSIGNMENT / ASSESSMENT TYPE OF ITEMS
var ASSIGNMENTITEMJSONSERVCIDs = {};
// JSON OBJECT TO USED TO SAVE TOC MAPPING (SERVICE ITEM IDs TO CMS ITEM IDs)
var SERVCIDsTOCMSIDsMAPPING = {};
// JSON OBJECT TO USED TO SAVE TOC MAPPING (CMS ITEM IDs TO SERVICE ITEM IDs)
var CMSIDsTOSERVCIDsMAPPING = {};
// FLAG FOR SUPPORT OF INDEXEDDB BY THE RUNNING BROWSER
var INDEXEDDBSUPPORT;
if(!window.indexedDB) {
	alert('Your browser does not support a stable version of IndexedDB. No caching done. App might not work properly.');
	INDEXEDDBSUPPORT = false;
} else {
	INDEXEDDBSUPPORT = true;
};
// NAME FOR OBJECT STORE OF INSTRUCTOR USER ATTEMPT TABLE
var INSTRDBNAME = 'UAI_I';
// NAME FOR OBJECT STORE OF STUDENT USER ATTEMPT TABLE
var STUDNTDBNAME = 'UAI_S';
// KEY NAME AGAINST WHICH MAX CACHED STATUS VALUE IS STORED FOR INSTRUCTOR
var CACHEDSTATUSINSTRUCTORKEYNAME = '';
// KEY NAME AGAINST WHICH MAX CACHED STATUS VALUE IS STORED FOR STUDENT
var CACHEDSTATUSSTUDENTKEYNAME = '';
// AUDIO PLAY OBJECT FOR ORAL FLUENCY
var AUDIOPLAYOBJ = null;
// OBJECT THAT STORES EVENT THAT WE RECORD AND SEND TO BULKLOG AND GOOGLE ANALYTICS
var EVENTJSON = {"T-PTO":{"event":"Teacher - Planner","action":"Viewed Planner","label":"Viewed Planner"},"T-LTO":{"event":"Teacher - Lessons","action":"Viewed Lesson","label":"Viewed Lesson"},"T-LTO-TTR":{"event":"Teacher - Lessons - Time to Read","action":"Viewed Lesson: TTR","label":"Viewed Lesson: TTR  "},"T-LTO-TTR-C":{"event":"Teacher - Lessons - Time to Read - Conferencing","action":"Viewed Lesson: TTR- Student Conf","label":"Viewed Lesson: TTR- Student Conf"},"T-LTO-VO":{"event":"Teacher - Lessons - Vocabulary","action":"Viewed Lesson: Vocab","label":"Viewed Lesson: Vocab"},"T-LTO-RT":{"event":"Teacher - Lessons - RATA","action":"Viewed Lesson: RATA","label":"Viewed Lesson: RATA"},"T-LTO-CC":{"event":"Teacher - Lessons - Classroom Conversation","action":"Viewed Lesson: Classroom Conversations","label":"Viewed Lesson: Classroom Conversations"},"T-LTO-WG":{"event":"Teacher - Lessons - Whole Group","action":"Viewed Lesson: Whole Group","label":"Viewed Lesson: Whole Group"},"T-LTO-WT":{"event":"Teacher - Lessons - Work Time","action":"Viewed Lesson: Work Time","label":"Viewed Lesson: Work Time"},"T-LTO-WT-C":{"event":"Teacher - Lessons - Work Time - Conferencing","action":"Viewed Lesson: Work Time- Student Conf","label":"Viewed Lesson: Work Time- Student Conf"},"T-LTO-WU":{"event":"Teacher - Lessons - Wrap Up","action":"Viewed Lesson: Wrap Up","label":"Viewed Lesson: Wrap Up"},"T-ATO":{"event":"Teacher - Assignments","action":"Viewed Assignment Dashboard","label":"Viewed Assignment Dashboard"},"T-PRTO":{"event":"Teacher - Performance","action":"Viewed Performance Dashboard","label":"Viewed Performance Dashboard"},"T-MTO":{"event":"Teacher - Messages","action":"Viewed Messages","label":"Viewed Messages"},"T-LBTO":{"event":"Teacher - Library","action":"Viewed Library (T)","label":"Viewed Library (T)"},"S-LBTO":{"event":"Student - Library","action":"Viewed Library (S)","label":"Viewed Library (S)"},"S-NTO":{"event":"Student - Notebook (tab)","action":"Viewed Notebook","label":"Viewed Notebook"},"S-NTO-TMP":{"event":"Student - Notebook (actual Notebook Thumbprint)","action":"Accessed Notebook","label":"Accessed Notebook"},"S-NTO-JO":{"event":"Student - Notebook - Journal","action":"Viewed NB: Journal","label":"Viewed NB: Journal"},"S-NTO-WBO":{"event":"Student - Notebook - Word Bank","action":"Viewed NB: Word Bank","label":"Viewed NB: Word Bank"},"S-NTO-CNO":{"event":"Student - Notebook - Class Notes","action":"Viewed NB: Class Notes","label":"Viewed NB: Class Notes"},"S-NTO-PO":{"event":"Student - Notebook - Portfolio","action":"Viewed NB: Portfolios","label":"Viewed NB: Portfolios"},"S-ATO":{"event":"Student - Assignments","action":"Viewed List of Assignments","label":"Viewed List of Assignments"},"THS-TTS":{"event":"TextHelp Services - Text-to-Speech","action":"Used TH: Text to Speech","label":"Used TH: Text to Speech"},"THS-TR":{"event":"TextHelp Services - Translation","action":"Used TH: Translation","label":"Used TH: Translation"},"THS-PD":{"event":"TextHelp Services - Picture Dictionary","action":"Used TH: Pictionary","label":"Used TH: Pictionary"},"THS-D":{"event":"TextHelp Services - Dictionary","action":"Used TH: Dictionary","label":"Used TH: Dictionary"},"T-LTO-PE-P":{"event":"Teacher - Lessons - Print","action":"Printed / Emailed Lesson","label":"Printed / Emailed Lesson"},"T-LTO-PE-E":{"event":"Teacher - Lessons - Email","action":"Printed / Emailed Lesson","label":"Printed / Emailed Lesson"},"T-MO-A":{"event":"Teacher - Messages - Alerts","action":"Viewed Alerts","label":"Viewed Alerts"},"T-MO-AU":{"event":"Teacher - Messages - App Updates","action":"Viewed Messages","label":"Viewed Messages"},"T-MO-N":{"event":"Teacher - Messages - Notes","action":"Viewed Notes","label":"Viewed Notes"},"T-CCO":{"event":"Teacher - Custom Content","action":"Viewed Custom Content","label":"Viewed Custom Content"},"T-SS-AH":{"event":"Teacher - AdHoc Surverys - Sent","action":"Sent AdHoc Survey","label":"Sent AdHoc Survey"},"T-SS":{"event":"Teacher - Surverys - Sent","action":"Sent Survey","label":"Sent Survey"},"T-SB":{"event":"Teacher - Broadcast Presentation Screens","action":"Broadcasted Media","label":"Broadcasted Media"},"T-LTO-MS":{"event":"Teacher - Lessons - Scribble Functionality","action":"Expanded Media","label":"Expanded Media"},"S-ATO-IR-O":{"event":"Assignment - IR - Accessed","action":"Assignment - IR - Accessed","label":"IR Opened"},"S-ATO-IR-F":{"event":"Assignment - IR - Page Forward","action":"Assignment - IR - Page Forward","label":"IR Page Forward"},"S-ATO-IR-B":{"event":"Assignment - IR - Page Backward","action":"Assignment - IR - Page Backward","label":"IR Page Backward"},"S-ATO-IR-AS":{"event":"Assignment - IR - Audio Started","action":"Assignment - IR - Audio Started","label":"IR Audio Started"},"S-ATO-IR-AP":{"event":"Assignment - IR - Audio Stopped","action":"Assignment - IR - Audio Stopped","label":"IR Audio Stopped"},"S-ATO-IR-Q":{"event":"Assignment - IR - Assessment Question accessed","action":"Assignment - IR - Assessment Question accessed","label":"IR Assessment Question accessed"},"S-ATO-IR-DND-SEL":{"event":"Assignment - IR -  Drag n Drop answer selected","action":"Assignment - IR -  Drag n Drop answer selected","label":"IR Drag n Drop answer selected"},"S-ATO-IR-DND-SUB":{"event":"Assignment - IR - Drag n Drop answer submitted","action":"Assignment - IR - Drag n Drop answer submitted","label":"IR Drag n Drop answer submitted"},"S-ATO-IR-HL-SEL":{"event":"Assignment - IR - Highlight answer selected","action":"Assignment - IR - Highlight answer selected","label":"IR Highlight answer selected"},"S-ATO-IR-HL-SUB":{"event":"Assignment - IR - Highlight answer submitted","action":"Assignment - IR - Highlight answer submitted","label":"IR Highlight answer submitted"},"S-ATO-IR-SW-SUB":{"event":"Assignment - IR - Summary Writing submitted","action":"Assignment - IR - Summary Writing submitted","label":"IR Summary Writing submitted"},"S-ATO-IR-SW-FB-REC":{"event":"Assignment - IR - Summary Writing Feedback received","action":"Assignment - IR - Summary Writing Feedback received","label":"IR Summary Writing Feedback received"},"S-ATO-IR-SW-FB-REC-O":{"event":"Assignment - IR - Summary Writing Feedback opened","action":"Assignment - IR - Summary Writing Feedback opened","label":"IR Summary Writing Feedback opened"},"S-ATO-IR-T-SUB":{"event":"Assignment - IR - Text Submitted For Scoring","action":"Assignment - IR - Text Submitted For Scoring","label":"IR Text Submitted For Scoring"},"S-ATO-IR-CRTL-SUB":{"event":"Assignment - IR - Critical Reading Submitted","action":"Assignment - IR - Critical Reading Submitted","label":"IR Critical Reading Submitted"},"S-ATO-IR-CLO":{"event":"Assignment - IR - Assignment Closed","action":"Assignment - IR - Assignment Closed","label":"IR Assignment Closed"}};

var ILIT20PREFIX = 'ilit20';

var CMSMSG_CONTENT_UPDATED = "Content Updated.";

// **************************************** CONSTANT / COMMON VARIABLES DEFINED / DECLARATION ENDS HERE *****************************************



// ************************************************ COMMON FUNCTIONS DEFINED / DECLARATION STARTS HERE **********************************


$(window).resize(function() {
	if($('.pdfReaderOverlay').is(':visible')) {
		resizePDFReaderFrame();
	}
});

$(document).ready(function(){
	var preloads = [
		'media/avtar_hover.png',
		'media/contd.png',
		'media/contd_green.png',
		'media/student_img3.png',
		'media/ajax_loader_gray_512.gif'
	]; // ARRAY OF IMAGES TO BE PRELOADED BEFORE LOGIN

	$(preloads).each(function(){
		$('<img/>')[0].src = this;
	}); //PRELOADING REQUIRED IMAGES BEFORE LOGIN

});

// FUNCTION TO RESIZE PDF READER FRAME
function resizePDFReaderFrame()
{
	var winH = $(window).height();
	var topBarH = $('.pdfReaderOverlay .topBar').height();
	var pdfReaderH = winH - topBarH - 11;
	$('.pdfReaderWrapper').animate({ 'height' : pdfReaderH + 'px' }, 50);
	$('#pdfReaderFrame').animate({ 'height' : pdfReaderH + 'px' }, 50);
	return false;
}

// FUNCTION TO SHOW PDF EBOOK READER
function launchPDFReader(bookInfoStr) {
	if(bookInfoStr != '') {
		bookInfoPDFObj = JSON.parse(bookInfoStr);
		var bookID = bookInfoPDFObj.bookID;
		var bookNamePDF = bookInfoPDFObj.bookName;
		var pdfPath = bookInfoPDFObj.bookPath;
		resizePDFReaderFrame();
		$('.pdfReaderOverlay').show();
		$('.pdfReaderOverlay .topBar .middle').html(bookNamePDF);
		$('.pdfReaderOverlay .pdfReaderWrapper #pdfReaderFrame').attr('src' , pdfPath);
		setPDFReaderVariables(bookInfoPDFObj);
	}
}

// INITIALIZING AND ASSIGNING VALUES TO VARIABLE AND CALLING GETLIBRARYPROGRESS SERVICE BEFORE OPENING PDF READER
function setPDFReaderVariables(bkInfoObj) {
	totalWordsRead = 0,	totalWordInBook = 0, totalPages = 0, weekWiseWordCount = 0; totTimeSpentPdf = 0, timeSpentPerPagePdf = 0, weeklyTimeSpentPdf = 0;
	totalWordInBook = bkInfoObj.wordCount;
	totalPages = bkInfoObj.bookNumPage;
	wordsPerPage = ((totalWordInBook==0 || totalPages==0) ? totalWordInBook : Math.round(totalWordInBook/totalPages));
	GetLibProgress(bkInfoObj.bookID);
	return false;
}

// GETLIBRARYPROGRESS SERVICE CALL
function GetLibProgress(bookId) {
	var userID = getSessionStorageItem("userID");
	var classID = getSessionStorageItem("classID");
	var productGradeID = getSessionStorageItem('productGradeID');
	var studentID = userID;
	var itemID = (bookId == '') ? '' : CMSIDsTOSERVCIDsMAPPING[bookId];
	var postObj = {
		TokenID: TOKENID,
		DeviceTimeStamp: getCurrentTimestamp(),
		CallerUserID: userID,
		CallerClassID: classID,
		StudentID: studentID,
		ItemID: itemID
	};
	var url = SERVICEBASEURL + "GetLibraryProgress";
	AjaxCall(url, "POST", postObj, GetLibProgressCallback);
}

// CALLBACK FUNCTION FOR GETLIBRARYPROGRESS SERVICE CALL
function GetLibProgressCallback(data) {	
	if(data != null) {	
		getLibProgObj = JSON.parse(data);
		if (getLibProgObj.Status == 200)
		{
			if (getLibProgObj.Content.length > 0) {
				if(getLibProgObj.Content[0].ProgressDataDetails!= "")
				{
					objLibraryProgress = JSON.parse(getLibProgObj.Content[0].ProgressDataDetails);
					if(objLibraryProgress.WordCountObj != null && objLibraryProgress.WordCountObj != 'undefined')
						WordCountObj = objLibraryProgress.WordCountObj; 
					else
						WordCountObj={};
				}
				totalWordsRead =  !isNaN(getLibProgObj.Content[0].TotalNumberOfWordsRead) ? getLibProgObj.Content[0].TotalNumberOfWordsRead : 0;

				if (totalWordInBook <= totalWordsRead) {
					bookReadEnd = true;
				}
				
				totTimeSpentPdf += getLibProgObj.Content[0].TotalNumberOfSecondsSpent ? getLibProgObj.Content[0].TotalNumberOfSecondsSpent * 1000 : 0;				
				
				/* find current week time spent */
				var fCallback  = function (currentWeek) {
					var bookID = getSessionStorageItem("BookID");
					var bookType = (bookID == bookInfoPDFObj.currentRataBookId ? 'RATA' : 'Time To Read' );
					var currentBookType = (bookType == 'Time To Read' ? 'TTR' : 'RATA' );
					var currentUnit = (bookInfoPDFObj.currentUnit == '' ? 1 : bookInfoPDFObj.currentUnit );
					var currentWeek = currentWeek ? currentWeek : (bookInfoPDFObj.currentWeek == '' ? 1 : bookInfoPDFObj.currentWeek);
					var regex = new RegExp(currentUnit+'\.'+currentWeek+'\.'+currentBookType);
					$.each(WordCountObj, function (k, val) {				
						if (k.match(regex) && typeof val == "string" && val.match(/\d*\|\d*/)) {
							weeklyTimeSpentPdf += parseInt(val.split("|")[1]) * 1000; 
						}
					});
				}
				if (isiLit20()) {
					getCurrentWeek(fCallback);		
				}
				else {	
					fCallback('');				
				}	
			}
		}

		// IF TOTALWORDINBOOK OR TOTALPAGES IS 0 THEN WORDSPERPAGE WILL BE 150 ELSE CALCULATED VALUE
		//wordsPerPage = ((totalWordInBook==0 || totalPages==0) ? 150 : Math.round(totalWordInBook/totalPages));
		
		/* wordCountTime = isiLit20() ? wordCountTime4ilit20 : wordCountTime;
		wordCountTime = (isiLit20() && totalPages == 0) ? 0 : wordCountTime; */
		
		wordCountTime = wordCountTime4ilit20;
		wordCountTime = totalPages == 0 ? 0 : wordCountTime;
		
		timeSpentPerPagePdf = Date.now();
		
		clearInterval(wordCountTimeOut);
		wordCountTimeOut = setInterval(function(){
			totalWordsRead += wordsPerPage;
			weekWiseWordCount += wordsPerPage;			
			if (totalWordsRead > totalWordInBook) {
				totalWordsRead = totalWordInBook;				
				bookReadEnd = true;
			}
		},wordCountTime * 1000);
	}
}

// SAVELIBRARYPROGRESS SERVICE CALL FOR PDF
function saveLibProgress(bookObj) {
	var fCallback = function (currentWeek) {
		var userRole = getSessionStorageItem('userRole');
		if(!$.isEmptyObject(bookObj) && $.inArray(USERROLE,ADMINROLE) == -1) {
			var bookInfoObj = bookObj;
			var chapNo = -1, sentNo = -1, objLibraryDetails;
			var userID = getSessionStorageItem("userID");
			var bookID = getSessionStorageItem("BookID");
			bookType = (bookID == bookInfoObj.currentRataBookId ? 'RATA' : 'Time To Read' );
			var currentBookType = (bookType == 'Time To Read' ? 'TTR' : 'RATA' );
			var currentUnit = (bookInfoObj.currentUnit == '' ? 1 : bookInfoObj.currentUnit );
			var currentWeek = currentWeek ? currentWeek : (bookInfoObj.currentWeek == '' ? 1 : bookInfoObj.currentWeek );
			var isBroadCastSaveLib = bookInfoObj.isBroadCast;
			var totTimeSpentInSec = 60; // in seconds
			var bookLexileLevel = bookInfoObj.bookLexileLevel ? bookInfoObj.bookLexileLevel : 0; // in seconds	

			// total time spent per pdf
			var timeSpent = timeSpentPerPagePdf ? Date.now() - timeSpentPerPagePdf : 0;	
			totTimeSpentPdf += timeSpent;	
			weeklyTimeSpentPdf += timeSpent;	
			timeSpentPerPagePdf = 0;		
			totTimeSpentInSec = Math.round(totTimeSpentPdf/1000); // convert to seconds
			var weekWiseTimeSpent = Math.round(weeklyTimeSpentPdf/1000); // convert to seconds
			
			if(currentUnit!=0 && currentWeek!=0){
				if(WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType] != undefined) {
					weekWiseWordCount+= parseInt(WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType]);
				}
				if(weekWiseWordCount > totalWordInBook) 
					weekWiseWordCount = totalWordInBook;
				
				WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType] = weekWiseWordCount+'|'+weekWiseTimeSpent;
			}
			else
				WordCountObj={};
				
			var _finalArr = [];
			_finalArr[0]=JSON.stringify(WordCountObj).replace(/"/g, '\\"');

			objLibraryProgress = '{\\"bookType\\":\\"' + bookType + '\\",\\"mode\\":\\"landscape\\",\\"chapNo\\":0,\\"sentNo\\":0,\\"font-size\\":\\"\\"'+ ',\\"WordCountObj\\":' + _finalArr+'}';
			objLibraryDetails  = '{\\"bookType\\":\\"' + bookType + '\\",\\"totalWords\\":' + totalWordInBook + ',\\"bookCompleted\\":' + bookReadEnd + ',\\"currentUnit\\":' + currentUnit +  ',\\"currentWeek\\":' + currentWeek +'}';
			
			try {
					window.frames["wrapperFrame"].SaveLibraryProgress(userID, bookID, objLibraryDetails, objLibraryProgress, totalWordsRead, isBroadCastSaveLib,  totTimeSpentInSec, bookLexileLevel);
			} catch(e) {
				console.log(e.message);
			}
		} else {
			console.log("Object Empty! Please check with Support Team!");
		}
		getLibProgObj = {};
		WordCountObj = {};
		clearInterval(wordCountTimeOut);
	}
	
	// ILIT-657: unset previous pdf session 
	sessionStorage.removeItem('PdfBroadcastJson');
	
	/* calculate current week */
	if (isiLit20()) {
		getCurrentWeek(fCallback);					
	}
	else {		
		fCallback('');
	}
}

function getCurrentWeek(fCallback) {
	var currentWeek = 1;
	var classStartDate = getSessionStorageItem('ClassStartDate');
	if (classStartDate) {
		var sDate1 = classStartDate;
		var sDate2 = getDeviceCurrentTimestamp();
		//var sDate2 = "2016-06-17 09:02:29";			
		var d1 = new Date(sDate1).getTime();
		var d2 = new Date(sDate2.currentDeviceTimestamp).getTime();		
		
		var daysPassed = ((((d2-d1)/1000)/60)/60)/24;
		currentWeek = Math.ceil(daysPassed/7);
	}
	if (typeof fCallback == "function") {
		fCallback(currentWeek);
	}
	else {
		return currentWeek;
	}		
}

// FILL DETAILS ON INFO POPUP AT BOTTOM RIGHT CORNER OF THE APP
function setInfoBubbleDetails() {
	$('#infoToolTip #deployServer').html(deploymentServer);
	$('#infoToolTip #appVerNum').html(APPVERNUM);
	$('#infoToolTip .className').text(getSessionStorageItem('className'));
	// $('#infoToolTip .productCode').text(getSessionStorageItem('productDisplayCode')); // IPP-4466
	$('#infoToolTip .gradeName').text(getSessionStorageItem('gradeDisplayName'));
	$('#infoToolTip .userName').text(getSessionStorageItem('userName'));
}

// FUNCTION TO INITALIZE AUDIO TAG INTO AN VARIABLE TO BE USED TO PLAY ORAL FLUENCY RECORDED AUDIO
function initAudioPlayingObject() {
	if(!AUDIOPLAYOBJ) {
		AUDIOPLAYOBJ = {};
		AUDIOPLAYOBJ.aObj = document.createElement("AUDIO");
	}
}

// FUNCTION TO INITIALIZE AND START AUDIO RECORD
function recordStopAudioAction(actionAud,cb) {
	try {
		var audioRAction = actionAud;
		var callbackObj = {};
		AUDIOPLAYOBJ.data = '';
		window.clearInterval(AUDIOPLAYOBJ.playIntervalObj);
		if(audioRAction == 'start') {
			// start recording
			if (!audioRecorder) {
				//alert('Microphone access not found. Please allow browser to access microphone and try recording again.');
				callbackObj.recordingStatus = 'denied';
				cb(JSON.stringify(callbackObj));
				//initAudioRecorder();
				return;
			}
			audioRecorder.clear();
			audioRecorder.record();
			startRecordTimer(cb);
			//callbackObj.recordingStatus = 'started';
		} else if(audioRAction == 'stop') {
			// stop recording
			if (!audioRecorder) {
				//alert('Microphone access not found. Please allow browser to access microphone and try recording again.');
				//initAudioRecorder();
				return;
			}
			audioRecorder.stop();
			audioRecorder.getBuffers( gotBuffers );	
			callbackObj.recordingStatus = 'stopped';
			window.clearTimeout(AUDIOPLAYOBJ.recordTimeoutObj);
			cb(JSON.stringify(callbackObj));
		}
	} catch(e) {
		alert(e.message);
	}
}

function startRecordTimer(callbk) {
	AUDIOPLAYOBJ.recordTimeoutObj = window.setTimeout(function() {
		audioRecorder.stop();
		audioRecorder.getBuffers( gotBuffers );	
		callbk(JSON.stringify({ recordingStatus: 'autostopped' }));
		console.log('record stopped at 30 sec');
	}, 120000); // 30000, as per discussion
}

// FUNCTION TO PLAY AND PAUSE ORAL FLUENCY RECORDED AUDIO
function playPauseAudioAction(actionPlayAud,cb) {
	try {
		var audioPAction = actionPlayAud;
		var callbackObj = {};
		if(audioPAction == 'play') {
			AUDIOPLAYOBJ.aObj.play();
			//callbackObj.playingStatus = 'playing';
			isAudioPlayingCompleted(cb);
			//AUDIOPLAYOBJ.cb = cb;
		} else if(audioPAction == 'pause') {
			AUDIOPLAYOBJ.aObj.pause();
			callbackObj.playingStatus = 'paused';
			window.clearInterval(AUDIOPLAYOBJ.playIntervalObj);
			cb(JSON.stringify(callbackObj));
		}
	} catch(e) {
		alert(e.message);
	}
}

// FUNCTION TO CHECK IF AUDIO PLAYING COMPLETED
function isAudioPlayingCompleted(callbk) {
	var audioEnded = false;
	AUDIOPLAYOBJ.playIntervalObj = window.setInterval(function() {
		if(audioEnded) {
			window.clearInterval(AUDIOPLAYOBJ.playIntervalObj);
			callbk(JSON.stringify({ playingStatus : 'finished' }));
			return false;
		} else {
			audioEnded = AUDIOPLAYOBJ.aObj.ended;
		}
	}, 1000);
}

// FUNCTION TO UPLOAD FILES TO SERVER
function SaveAudio(paramsObj,cb) {
	var fileName = CLASSID + '_' + USERID + '_' + CMSIDsTOSERVCIDsMAPPING[paramsObj.assignmentId] + '_' + paramsObj.questionId + '.wav';
	var extraHeaderParameters = {
		"Content-Location": fileName
	};
	var url = SERVICEBASEURL + "UploadAudioFile";
	AjaxCallForAudioUpload(url, "POST", AUDIOPLAYOBJ.data, extraHeaderParameters, cb);
	checkUAInternetConnection();
}

// FUNCTION TO GET VALUES FROM SESSIONSTORAGE OF THE KEYS PASSED AS PARAMS
function getSessionStorageItem(itemName) {
	var itemVal = sessionStorage.getItem(itemName);
    return itemVal;
}

// FUNCTION TO SET VALUES IN SESSIONSTORAGE AGAINST THE KEYS PASSED IN PARAMS
function setSessionStorageItem(itemName, itemVal) {
	sessionStorage.setItem(itemName, itemVal);
}

// REMOVE THE KEY VALUES PAIR FROM SESSIONSTORAGE WITH KEYNAME AS PARAM
function removeSessionStorageItem(itemName) {
	sessionStorage.removeItem(itemName);
}

// FUNCTION TO CLEAR SESSIONSTORAGE OF ITS KEY VALUE PAIRS
function clearSessionStorage() {
	sessionStorage.clear();
}

// FUNCTION TO GET VALUES FROM LOCALSTORAGE OF THE KEYS PASSED AS PARAMS
function getLocalStorageItem(itemName) {
	var itemVal = localStorage.getItem(itemName);
    return itemVal;
}

// FUNCTION TO SET VALUES IN LOCALSTORAGE AGAINST THE KEYS PASSED IN PARAMS
function setLocalStorageItem(itemName, itemVal) {
	localStorage.setItem(itemName, itemVal);
}

// REMOVE THE KEY VALUES PAIR FROM LOCALSTORAGE WITH KEYNAME AS PARAM
function removeLocalStorageItem(itemName) {
	localStorage.removeItem(itemName);
}

// FUNCTION TO CLEAR LOCALSTORAGE OF ITS KEY VALUE PAIRS
function clearLocalStorage() {
	localStorage.clear();
}

// GENERIC AJAX ASYNC FUNCTION CALL
function AjaxCall(DestinationUrl, MethodType, Data, CallBack, ServiceName) {
    var DTO;	
	
    if (MethodType === "GET" || MethodType === "DELETE") {
        DTO = null;
    }
    else { DTO = JSON.stringify(Data); }

	try {
		var oPostJson = {
			url: DestinationUrl,
			cache: false,
			type: MethodType,
			contentType: 'application/json; charset=utf-8',
			data: DTO,
			success: function (data) {
				var dataJSON = JSON.parse(data);
				if(dataJSON.Status == '500' && dataJSON.Error.ErrorCode == 'U1065') {
					window.clearTimeout(internetCheckInterval);
					forceToLoginOnInValidToken();
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
				if (typeof ServiceName != 'undefined' && 
				(
					ServiceName == "GetClassStatus" ||
					ServiceName == "GetRosterForClass"
				)) {
					if (CallBack && (typeof CallBack == "function")) {
						CallBack("Error");
					}
				}
			}
		};
		
		// add timeout
		if (typeof ServiceName != 'undefined' && 
			(
				ServiceName == "GetClassStatus" ||
				ServiceName == "GetRosterForClass"
			)) {
			oPostJson.timeout = 20000;		
		}
		
		$.ajax(oPostJson);
	} catch(e) {}

    return DTO;
}

function AjaxCallForAudioUpload(DestinationUrl, MethodType, Data, Headers, CallBack) {
    var DTO;
    if (MethodType === "GET" || MethodType === "DELETE") {
        DTO = null;
    }
    else { DTO = Data; }
	
    try {
		$.ajax({
			url: DestinationUrl,
			cache: false,
			type: MethodType,
			processData: false,
			headers: Headers,
			contentType: 'application/json; charset=utf-8',
			data: DTO,
			success: function (data) {
				internetCheckUAIntervalStart = true;
				var dataJSON = JSON.parse(data);
				if(dataJSON.Status == '500' && dataJSON.Error.ErrorCode == 'U1065') {
					forceToLoginOnInValidToken();
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

// FUNCTION TO FORCEFULLY REDIRECT TO LOGIN PAGE WHEN RECEIVED INVALID TOKEN ERROR CODE U1065
function forceToLoginOnInValidToken() {
	clearInterval(SETBULKLOGINTERVAL);
	CallSetbulkLog();
	clearSessionStorage();
	alert('Oops! Someone has logged into another device with your account. You will now be logged off!');
	window.location.reload(true);
}

// FOR GETTING CURRENT TIME IN MILLISECONDS
function getTimeInMs() {
	return (new Date().getTime());
}

// FUNCTION TO GET CURRENT TIME STAMP
function getCurrentTimestamp() {
	var d = new Date();
	var date = d.getDate();
	if(date < 10) { date = '0' + date };
	var month = parseInt(d.getMonth() + 1);
	if(month < 10) { month = '0' + month };
	var currentTimestamp = date + '-' + month + '-' +  + d.getFullYear() + ' ' + d.toString().split(' ')[4];
	return currentTimestamp;
}

// FOR CREATING USER ACTIVITY LOG AND SENDING THIS LOG TO SETBULKLOG SERVICE
function createLog(vID, vVal, eventTimeStamp) {

	var activityID = "";
	var currenTabName = '';
	if(getSessionStorageItem("currentTab") != null ) {
		currenTabName = getSessionStorageItem("currentTab").toString().trim();
	}
	
	if(vID != "LO") {
		if(currenTabName == "lessons" && getSessionStorageItem("lessonInfoData")!= null)
		{
			var lessonInfoJson = JSON.parse(getSessionStorageItem("lessonInfoData"));
			activityID = lessonInfoJson.itemId;
		}
		
		if(currenTabName == "library" && getSessionStorageItem("BookID") != null) {
			activityID = getSessionStorageItem("BookID");
		}
	}
	
	if(vID == "IL") {
		if((currenTabName == "assignments" || currenTabName == "notebooks") && getSessionStorageItem("StudentAssignID") != null) {
			activityID = getSessionStorageItem("StudentAssignID");
		}
	}
	
	if(vID == "CS")
	{
		var loginObj = new Object;
		var AppZipVerNum = getLocalStorageItem("AppZipRevisionNo") == null ? 1 : getLocalStorageItem("AppZipRevisionNo");
		loginObj.VerbValue = loginVerbVal;
		loginObj.ActivityID = activityID;
		loginObj.EventTimeStamp = loginCurrEventTimeStamp;
		loginObj.CallerUserID = getSessionStorageItem("userID");
		loginObj.EventType = getSessionStorageItem("eventType");
		loginObj.VerbID  = "LI";
		loginObj.CallerClassID = getSessionStorageItem("classID");
		loginObj.OtherKeysAndValues  = 'AppVersionNo:' + APPVERNUM + ', AppZipRevisionNo:' + AppZipVerNum;
		logArr.push(loginObj);
	}
	
	var userRole = getSessionStorageItem("userRole");
	if(vID == "CS" && userRole.toLowerCase() == STUDROLE) {
		// DO NOTHING, NO LOG OF CLASS STARTED TO BE SEND FOR STUDENT
	} else {
		var logObj = new Object;
		logObj.VerbValue = vVal;
		logObj.ActivityID = activityID;
		logObj.EventTimeStamp = eventTimeStamp;
		logObj.CallerUserID = getSessionStorageItem("userID");
		logObj.EventType = getSessionStorageItem("eventType");
		logObj.VerbID  = vID;
		logObj.CallerClassID = getSessionStorageItem("classID");
		logObj.OtherKeysAndValues  = "";
		logArr.push(logObj);
	}
	
	if(vID == "LO" && SETBULKLOGINTERVAL)
	{
		sendGoogleEvents('Logout','Logout','UserID:'+USERID);
		clearInterval(SETBULKLOGINTERVAL);
		CallSetbulkLog();
	}
	else
	{
		if(SETBULKLOGINTERVAL== null)
			SETBULKLOGINTERVAL = setInterval(CallSetbulkLog, SETBULKLOGTIMER);	// sending this log every minute
	}

}

// FUNCTION TO CALL SETBULKLOG SERVICE
function CallSetbulkLog() {
	if($.inArray(USERROLE,ADMINROLE) == -1) {
		if(logArr.length > 0)
		{
			var bulkLog = {
				TokenID: TOKENID,
				DeviceTimeStamp: getCurrentTimestamp(),
				CallerAppType: APPTYPE,
				LogDetails: JSON.stringify(logArr)
			};
			var url = SERVICEBASEURL + "SetBulkLog";
			AjaxCall(url, "POST", bulkLog, sp_GetSetbulkLog);
		}
	}	
}

// CALLBACK FOR SETBULKLOG SERVICE CALL
function sp_GetSetbulkLog(data) {
	if(data !=null) {
		data = JSON.parse(data);
		if(data.Status == '200') {
			logArr = [];
		} else {
			alert(data.Error.ErrorUserDescription);
		}
	}
}

// FOR CREATING TRACKER OBJECT
function createGoogleTrackerObject(_webPropertyID, _str) {
	
	if(_webPropertyID != undefined)
	{
		if(_str != undefined)
			ga('create', _webPropertyID,'auto');
		else
			ga('create', _webPropertyID, _str);
		
		ga('send', 'pageview');
		ga('send', 'screenview', {'screenName': 'DEFAULT'});
	}
}

// FOR SENDING EVENTS TO GOOGLE ANALYTICS FOR EVENT TRACKING
function sendGoogleEvents(_category, _action, _label, _value) {
	if(_category == null)
		ga('send', 'event');
	else if(_category != null && _action == null)
		ga('send', 'event', _category);
	else if(_category != null && _action != null && _label ==null)
		ga('send', 'event', _category, _action);
	else if(_category != null && _action != null && _label!= null && _value == null)
		ga('send', 'event', _category, _action, _label);
	else
		ga('send', 'event', _category, _action, _label, _value);
		
}

// FUNCTION TO HIDE/SHOW BOTTOM BAR. PASSING TRUE HIDES THE BAR, PASSING FALSE SHOWS THE BAR
function hideShowBottomBar(flag)
{
	if(flag) {
		if($('footer').is(':visible')) {
			$('footer').hide();
		}
	} else {
		if($('footer').is(':hidden')) {
			$('footer').show();
		}
	}
	resize();
}

// FUNCTION TO DISABLE/ENABLE BOTTOM BAR. PASSING TRUE DISABLES THE BAR, PASSING FALSE ENABLES THE BAR
function disableNavButtons(flag) {
	if(flag) {
		$('.footer_in_overlay').show();
	} else {
		$('.footer_in_overlay').hide();
	}
}

// FUNCTION TO MAP SERVICES ITEM IDs TO CMS ITEM IDs
function mapCMSIDsToTOCIDs(mapJson) {
	var alertFlag = true;
	if(objGradeItemsData != null) {
		var objGradeItems = (objGradeItemsData == null || typeof objGradeItemsData == "undefined") ? ''  : objGradeItemsData.item;
		if(objGradeItems != '' && objGradeItems.length > 0) {
			for(var i = 0; i < objGradeItems.length; i++) {
				objGradeItems[i].servcItemID = (mapJson[objGradeItems[i].itemID] == undefined) ? ((alertFlag) ? function() {alert(CMSMSG_CONTENT_UPDATED);alertFlag = false;console.log(CMSMSG_CONTENT_UPDATED+' ServiceItemID: ' + mapJson[objGradeItems[i].itemID] + ' ------- CMSItemID: ' + objGradeItems[i].itemID);}() : console.log(CMSMSG_CONTENT_UPDATED+' ServiceItemID: ' + mapJson[objGradeItems[i].itemID] + ' ------- CMSItemID: ' + objGradeItems[i].itemID) ) : mapJson[objGradeItems[i].itemID];
			}
		} else {
			clearInterval(SETBULKLOGINTERVAL);
			CallSetbulkLog();
			clearSessionStorage();
			window.location.reload(true);
			alert('No TOC Items found in the file. Please check.');
		}
	} else {
		alert(CMSMSG_CONTENT_UPDATED);
	}
	return false;
}

// FUNCTION TO CREATE AN ARRAY OF ASSIGNMENT / ASSESSMENT TYPE OF ITEMS FROM GRADE_ITEMS.JS
function createAssignmentArray() {
	var assignArrNum = 0;
	if(objGradeItemsData != null) {
		var objGradeItems = (objGradeItemsData == null || typeof objGradeItemsData == "undefined") ? ''  : objGradeItemsData.item;
		if(objGradeItems != '') {
			for(var assignNum = 0; assignNum < objGradeItems.length; assignNum++) {
				if(objGradeItems[assignNum].itemType == "assignment" || objGradeItems[assignNum].itemType == "assessment") {
					ASSIGNMENTITEMARR[assignArrNum] = objGradeItems[assignNum];
					ASSIGNMENTITEMJSONSERVCIDs[CMSIDsTOSERVCIDsMAPPING[objGradeItems[assignNum].itemID]] = objGradeItems[assignNum];
					assignArrNum++;
				}
			}
		}
	} else {
		console.log('No Assignment / Assessment found!');
	}
	return false;
}

// FUNCTION FIND ENTIRE INFO , IN JSON FORMAT, OF AN ITEM FROM GRADE ITEMS JS FILE
function getItemInfo(itemID) {
	var itemInfo = {};
	if(itemID != '') {
		if(objGradeItemsData != null) {
			var objGradeItems = (objGradeItemsData == null || typeof objGradeItemsData == "undefined") ? ''  : objGradeItemsData.item;
			if(objGradeItems != '' && itemID != '') {
				for(var i = 0; i < objGradeItems.length; i++) {
					if(objGradeItems[i].itemID == itemID) {
						itemInfo = objGradeItems[i];
						break;
					}
				}
			}
		} else {
			//itemInfo = 'itemInfo Not Found!itemID:'+itemID;
		}
	} else {
		console.log('No itemID sent! No record found!');
	}
	return itemInfo;
}

// FUNCTION FIND ITEMNAME OF AN ITEM FROM GRADE ITEMS JS FILE
function getItemName(itemID) {
	var itemName = '';
	var itemInfoJson = {};
	if(itemID != '') {
		itemInfoJson = getItemInfo(itemID);
		itemName = itemInfoJson.itemDisplayName ? itemInfoJson.itemDisplayName.trim() : "";
	} else {
		console.log('No itemID sent! No record found!');
	}
	return itemName;
}

// FUNCTION FIND IF ITEM BELONGS TO SAME GRADE FROM ITEMS JS FILE
function getItemSameGradeInfo(itemID) {
	var itemSameGradeFlag = false;
	var itemInfoJson = getItemInfo(itemID);
	itemSameGradeFlag = Boolean(itemInfoJson.isSameGrade);
	return itemSameGradeFlag;
}

// FUNCTION TO HANDLE NO INTERNET CONNECTION ERROR
function checkInternetConnection() {
	if(internetCheckIntervalStart) {
		internetCheckIntervalStart = false;
		window.clearTimeout(internetCheckInterval);
		if($('#connectStatus').hasClass('inactive')) { $('#connectStatus').removeClass('inactive').addClass('active'); }
		internetCheckInterval = window.setTimeout(function() { noInternetFound(); }, internetCheckIntervalTimer);
	}
}

// FUNCTION TO HANDLE NO INTERNET CONNECTION ERROR FOR UPLOADAUDIO CALL
function checkUAInternetConnection() {
	if(internetCheckUAIntervalStart) {
		internetCheckUAIntervalStart = false;
		window.clearTimeout(internetCheckUAInterval);
		internetCheckUAInterval = window.setTimeout(function() { noInternetFound(); }, internetCheckUAIntervalTimer);
	}
}

// FUNCTION TO PROCESS AN UI MESSAGE WHEN DURATION FOR INTERNET CHECKING IS DONE
function noInternetFound() {
	$('.continue_button .loader.login').hide();
	$('#connectStatus').removeClass('active').addClass('inactive');
	alert('Please check your internet connection and try again.');
	internetCheckIntervalStart = true;
}

// FUNCTION TO PROCESS AN UI MESSAGE WHEN DURATION FOR INTERNET CHECKING IS DONE
function noInternetFoundUA() {
	alert('Please check your internet connection and try again.');
	internetCheckUAInterval = true;
	window.frames["wrapperFrame"].SaveAudioCallback(JSON.stringify({}));
}

// FUNCTION TO CLEAR WINDOW TIMEOUT FUNCTION, PASSING INSTANCE OF THAT TIMEOUT AS PARAM
function clearTimeoutFunc(timerVariable) {
	window.clearTimeout(timerVariable);
}

// FUNCTION TO CREATE REQUIRED INDEXED DBs
function createIndexedDB() {
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB', 1);
			idbReq.onupgradeneeded = function(evt) {
				//console.log('onupgradeneeded called');
				var idbResult = evt.target.result;
				var idbObjStoreUAI_I = idbResult.createObjectStore(INSTRDBNAME);
				var idbObjStoreUAI_S = idbResult.createObjectStore(STUDNTDBNAME);
				idbObjStoreUAI_I.createIndex("CLID","CLID", { unique: false });
				var idbObjStoreCS = idbResult.createObjectStore('CS');
				idbObjStoreUAI_S.createIndex("ICS","ICS", { unique: false });
				idbObjStoreUAI_S.createIndex("SID","SID", { unique: false });
				idbObjStoreUAI_S.createIndex("AIID","AIID", { unique: false });
				idbObjStoreUAI_S.createIndex("CLID","CLID", { unique: false });
			};
			idbReq.onsuccess = function(evt) {
				var idbResult = evt.target.result;
				//console.log('success called');
				idbResult.close();
				var objectStoreLength = idbResult.objectStoreNames.length;
				if(objectStoreLength != 3) {
					deleteIndexedDB(createIndexedDB);
				} else {
					if(USERROLE == 'i') {
						clearCachedData(INSTRDBNAME);
					} else {
						clearCachedData(STUDNTDBNAME);
					}
				}
			};
			idbReq.onerror = function(evt) {
				checkIndexdedDBErrors('Error while creating db: ' , evt);
			};
		} catch (e) {
			alert(e.message);
		}
	}
}

// FUNCTION TO CREATE REQUIRED INDEXED DBs
function clearCachedData(objecStore,callBackFunc) {
	if(INDEXEDDBSUPPORT) {
		try {
			var idbReq = window.indexedDB.open('cacheDB');
			var objectArr = ['CS'];
			var csKeyName = '';
			var compareKeyName = '';
			var compareWith = '';
			switch(objecStore) {
				case INSTRDBNAME:
					objectArr.push(INSTRDBNAME);
					csKeyName = CACHEDSTATUSINSTRUCTORKEYNAME;
					compareKeyName = 'CLID';
					compareWith = CLASSID;
					break;
				case STUDNTDBNAME:
					objectArr.push(STUDNTDBNAME);
					csKeyName = CACHEDSTATUSSTUDENTKEYNAME;
					compareKeyName = 'SID';
					compareWith = USERID;
					break;
				default:
					alert('Cache Object Store ' + objecStore + ' not found while clear cache data.');
					return false;
					break;
			}
			idbReq.onsuccess = function(evtDBReq) {
				var dbClearCacheReq = evtDBReq.target.result;
				var txClearCacheTrans = dbClearCacheReq.transaction(objectArr, 'readwrite');
				txClearCacheTrans.oncomplete = function(evtTX) {
					if(typeof callBackFunc === 'function') {
						callBackFunc();
					} else {
						//console.log('Cached data Cleared. Callback not found. Please check.');						
					}
				};
				txClearCacheTrans.onerror = function(evtTX) {
					checkIndexdedDBErrors('Error while creating transaction for clearing cache data : ' , evtTX);
				};
				// to delete record from cache status object store
				var csObjectStore = txClearCacheTrans.objectStore(objectArr[0]);
				csObjectStore.delete(csKeyName).onsuccess = function(evtCSRow) {
					//console.log('Record ' + csKeyName + ' deleted.');
				};
				csObjectStore.delete(csKeyName).onerror = function(evtCSRow) {
					checkIndexdedDBErrors('Error while deleting record ' + csKeyName + ' from cache status object store: ' , evtCSRow);
				};
				// to delete record from attempt cache data object store
				var adObjectStore = txClearCacheTrans.objectStore(objectArr[1]);
				adObjectStore.openCursor().onsuccess = function(evtADCursor) {
					var cursorResult = evtADCursor.target.result;
					if(cursorResult) {
						if(cursorResult.value[compareKeyName] === compareWith) {
							cursorResult.delete();
						}
						cursorResult.continue();
					} else {
						//console.log('All records iterated.');
					}
				};
				adObjectStore.onerror = function(evtADCursor) {
					checkIndexdedDBErrors('Error while fetching objecstore for clearing cache data : ' , evtADCursor);
				};
			};
			idbReq.onerror = function(evtDBReq) {
				checkIndexdedDBErrors('Error while creating request for clearing cache data : ' , evtDBReq);
			};
		} catch (e) {
			alert(e.message);
		}
	}
	return false;
}

function deleteIndexedDB(callbackFunc) {
	try {
		var delDBReq = window.indexedDB.deleteDatabase('cacheDB');
		delDBReq.onsuccess = function(evtSDel) {
			//console.log('DB deleted.');
			callbackFunc();
		};
		delDBReq.onerror = function(evtEDel) {
			checkIndexdedDBErrors('Error while deleting DB : ' , evtEDel);
		};
		delDBReq.onblocked = function(evtBDel) {
			checkIndexdedDBErrors('DB is blocked. Cannot delete DB. : ' , evtBDel);
		};
	} catch (e) {
		alert(e.message);
	}
}

// FUNCTION TO CHECK DIFFERENT ERROR VALUES OF INDEXEDDB AND ACT ACCORDINGLY
function checkIndexdedDBErrors(errorMsg,errorEvt) {
	var errorName = errorEvt.target.error.name.toLowerCase();
	if(errorName == 'InvalidStateError'.toLowerCase()) {
		window.clearInterval(SETBULKLOGINTERVAL);
		window.clearInterval(ROSTERINTERVALOBJ);
		CallSetbulkLog();
		alert('Caching of data is not allowed by your browser settings. Please allow the app to use caching data and login again.');
		clearSessionStorage();
		window.location.reload(true);
	} else {
		alert(errorMsg + errorEvt.target.error.message);
	}
}

function isiLit20 () {
	return strStartsWith((getSessionStorageItem("productCode") || ''), ILIT20PREFIX, true);
}

function strStartsWith (sSubject, sPattern, bIgnoreCase) {
	if (typeof sSubject == 'undefined' || sSubject == null || sSubject.length < 1) { return false; }
	if (typeof sPattern == 'undefined' || sPattern == null || sSubject.length < sPattern.length) { return false; }
	if (typeof bIgnoreCase != 'boolean') { bIgnoreCase = false; }
	for (var iPIdx = 0, iSIdx = 0; iPIdx < sPattern.length; iPIdx++) {
		var cChar4mP = sPattern.charAt(iPIdx),
			cChar4mS = sSubject.charAt(iSIdx++);
		if (bIgnoreCase === true) {
			cChar4mP = cChar4mP.toUpperCase();
			cChar4mS = cChar4mS.toUpperCase();
		}
		if (cChar4mP != cChar4mS) {
			return false;
		}
	}
	return true;
}
function getDeviceCurrentTimestamp() {
	var d = new Date();
	var date = d.getDate();
	if(date < 10) { date = '0' + date };
	var month = parseInt(d.getMonth() + 1);
	if(month < 10) { month = '0' + month };
	//var currentTimestamp = date + '-' + month + '-' +  + d.getFullYear() + ' ' + d.toString().split(' ')[4];
	var currentTimestamp = d.getFullYear() + '-' + month + '-'  + date   + ' ' + d.toString().split(' ')[4];
	return {"currentDeviceTimestamp": currentTimestamp};
}
// ************************************************ common functions defined / declaration ends here **********************************