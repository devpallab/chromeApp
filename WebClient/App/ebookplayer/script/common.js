var book = {
	"orderList" : []
};

var dimension = {
	"portrait" : {"width" : 0,"height" : 0},
	"landscape" : {"width" : 0,"height" : 0}
};

var eBookEnvironment = {
	"currLandScapePageNo" : 0,
	"currPortraitPageNo" : 0,
	"maxLandScapePageNo" : 0,
	"maxPortraitPageNo" : 0,
	"isCurrModePortrait" : false
}

var fontResize = {
	"8" : {
		"cssPath" : "f8",
		"isDefault" : false
	},
	"14" : {
		"cssPath" : "f14",
		"isDefault" : true
	},
	"20" : {
		"cssPath" : "f20",
		"isDefault" : false
	}
}

var excludeChapList = ['cover','title','ded','ded1','copy','toc'], chapterStartIndex = -1;
var objScroll = {cursorcolor:"#000000",autohidemode:false,cursorborderradius:'0px',horizrailenabled:false};

var isShowingTOC = false;
var dblClick = false, tmpObj, firstClick = false;				//REPLICATE DOUBLE CLICK ON TOUCH DEVICE
var wordSelectionTimeOut;
var tmpScroll = false, tmpTouchStarted = false;

var objLibraryProgress = '';									//SAVES VALUE FOR STATE OF PAGE FONT-SIZE, PAGE NO.
var wordsPerPage = 150, wordCountTime = 30, wordCountTime4ilit20 = 10, wordCountTimeOut;	//WORD COUNT PER PAGE, TIME IN SECS TO INCREMENT COUNT, CLEAR TIME OUT VARIABLE
var totalWordsRead = 0;
var isFirstLoad = true;										//FLAG TO DISPLAY PAGE FOR FIRST TIME FIRST LOAD
var rootFolderPath_ios = "";										// for correct root folder path for ios; this is temporary solution
var isCorrectRootfolderpath=true;
var WordCountObj={};
var weekWiseWordCount = 0;
var timeSpentPerPage = 0;
var TOT_TIME_SPENT = 0;
var WEEKLY_TIME_SPENT = 0;
var maxTimePerPage = 60000; // 1 min

function init(){
	var objSent, tmpStr = '';
		
	showLoader();

	$('.header_inner.ebook .middle').html('<div>' + bookTitle + '</div>');

	//SET PAGE VALUE
	setOrientation();

	//SORT CONTENT AND ASSIGN IT TO OBJECT 'BOOK'
	calculatePageOrder();

	//CALCULATE START INDEX
	chapterStartIndex = 0;
	for (var i=0;i<book.orderList.length;i++)
	{
		var isMatchFound = false;
		for (var j=0;j<excludeChapList.length;j++)
		{
			if ((book.orderList[i].name).toLowerCase() == excludeChapList[j].toLowerCase())
			{
				chapterStartIndex = i + 1;
				j = excludeChapList.length;
				isMatchFound = true;
			}
		}
		if (!isMatchFound)
			i = book.orderList.length
	}

	//CALCULATE PAGES AND ASSIGN PAGE NUMBERS TO SENTENCES & SET WORDS PER PAGE
	setPageInfo();

	try
	{
		if ((objLibraryProgress != '') && (objLibraryProgress.chapNo != -1) && (objLibraryProgress.sentNo != -1))
		{
			eBookEnvironment.currLandScapePageNo = book.orderList[objLibraryProgress.chapNo].sentences[objLibraryProgress.sentNo].landScapePageNo;
		}	
	}
	catch (e){}

	window.onresize = function(){
		setOrientation();
	};

	window.addEventListener("orientationchange", setOrientation);
	
	$("body").on('click', function() {
		$("#menuFontResize").hide();
		$('#btnFontResize').removeClass('active');
		$("#menuLanguage").hide();
		$('#btnLanguage').removeClass('active');
	});

	$('#btnTOC').on('click',function(){
		generateTOC();
		var tempVal = "1-1";
		$(".ui-slider-handle").html(tempVal);/**/
		$( "#slider-range-min" ).slider('value',1);
	});

	$('#btnFontResize').on('click',function(event){
		if ($('#menuFontResize').is(":visible")) {
			$("#menuFontResize").hide();
			$(this).removeClass('active');
		} else {
			$("#menuFontResize").show();
			$(this).addClass('active');
		}

		$("#menuLanguage").hide();
		$('#btnLanguage').removeClass('active');
		event.stopPropagation();
	});

	$('.zooms').on('click',function(){
		showLoader();
		$('#btnFontResize').trigger('click');
		$rw_stopSpeech();
		$('.zooms.active').removeClass('active');
		$(this).addClass('active');
		setTimeout(function(){
			loadCSS($('.zooms.active').attr('cssPath'), afterCSSLoad);
		},500);
	});

	$('#btnLanguage').on('click',function(event){
		if ($('#menuLanguage').is(":visible")){
			$("#menuLanguage").hide();
			$(this).removeClass('active');
		} else {
			$("#menuLanguage").show();
			$(this).addClass('active');
		}
		$("#menuFontResize").hide();
		$('#btnFontResize').removeClass('active');
		event.stopPropagation();
	});

	$('.tooltip_wrap_language li').on('click', function(){
		$('.tooltip_wrap_language li.active').removeClass('active');
		$(this).addClass('active');
		eba_translate_target = $(this).attr('lang');
		$rw_setTranslateTarget(eba_translate_target);
	});

	//PREVENT DEFAULT SCROLL ON IPAD EXCEPT FOR NOTES POPUP AND TRANSLATE LANGUAGE POPUP
	document.ontouchmove  = function(e){ 
	  e = e || window.event;
	  var _targetElem = e.target || e.srcElement;
	  if (_targetElem.id == "txtAreaListNote" || _targetElem.parentNode.parentNode.id == 'languagesList' || $('#rwDict').css('visibility') != 'hidden' || $('#rwTrans').css('visibility') != 'hidden') {
		return true;
	   }
	  e.preventDefault(); 
	}
	
	Hammer($('.ebook_container_block')).on('doubletap',function(event){
		event.preventDefault();
		event.stopPropagation();

		$('.ebook_container_block').attr('style','');

		$('.highlight').removeClass('highlight');
		$('#textToHelpMenu').hide();
		$('#textToHelpMenu .textToHelpMenuButtons,#textToHelpMenu .sep').hide();

		if($(event.target).parents('.s').length) {
			clearTimeout(wordSelectionTimeOut);
			setTimeout(function () {
			    //if (isWinRT) {
			        $('.highlight').removeClass('highlight');
			        $(event.target).parents('.s').addClass('highlight');

			        $('#msTextHelp').html($('.highlight').text());
			        $('#msTextHelp').selectText();

			        $(event.target).parents('.s').addClass('highlight');
			    //} else
			    //    $(event.target).parents('.s').selectText();

				$('#tthSpeak, #tthNotesSep, #tthNotes, #tthCopySep, #tthCopy, #tthTransSep, #tthTrans').show();
				var offset = $(event.target).parents('.s').offset();
				var objWid = $(event.target).parents('.s').width();
				setPosTextHelp(offset,objWid);
			},300);			
			dblClick = true;
		}
		return false;
	});

	Hammer($('.ebook_container_block')).on('tap',function(event){
		event.preventDefault();
		event.stopPropagation();

		$('.ebook_container_block').attr('style','');

		$('.highlight').removeClass('highlight');
		$('#textToHelpMenu').hide();
		$('#textToHelpMenu .textToHelpMenuButtons,#textToHelpMenu .sep').hide();
		
		if($(event.target).attr("class") == 'w' || $(event.target).parents('.w').length) {
			tmpObj = $(event.target);
			wordSelectionTimeOut = setTimeout(function(){
			    if (!dblClick) {
			        //if (isWinRT) {
			            $('.highlight').removeClass('highlight');
			            tmpObj.addClass('highlight');

			            $('#msTextHelp').html($('.highlight').text());
			            $('#msTextHelp').selectText();

			            tmpObj.addClass('highlight');
			        //} else
					//    tmpObj.selectText();
					$('#textToHelpMenu .textToHelpMenuButtons,#textToHelpMenu .sep').show();
					$('#textToHelpMenu').css('left',0).css('top',0).show();
					var offset = $(tmpObj).offset();
					var objWid = $(tmpObj).width();
					setPosTextHelp(offset,objWid);
				}
				tmpTxt = '';
				dblClick = false;
			},400);
		}
	});

	$( "#slider-range-min" ).slider({
		range: "min",
		value: 0,
		min: 1,
		max:  eBookEnvironment.maxLandScapePageNo,
		slide: function( event, ui ) {			
			/* Time spent per page */			
			var timeSpent = timeSpentPerPage ? Date.now() - timeSpentPerPage : 0;			
			TOT_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;			
			WEEKLY_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;			
			timeSpentPerPage = 0;
			
			var tempVal = '<div id="pageNoBallon" style="position:absolute;top:-3.5em;border-radius: 12px;left:0px;background:#000;"><div style="height:35px;line-height:35px;white-space:nowrap;padding:0 7px;color:#FFF;">' + ui.value+ '-' + (ui.value+1) + ' of ' + eBookEnvironment.maxLandScapePageNo + '</div><div style="border-left: 5px solid transparent;border-right: 5px solid transparent;border-top: 5px solid #000000;bottom: -5px;height: 0;left: 0;margin-left: auto;margin-right: auto;position: absolute;right: 0;width: 0;"></div></div>' + ui.value+ '-' + (ui.value+1) + '';
			$(".ui-slider-handle").html(tempVal);
			$('#pageNoBallon').css('left',($('.ui-slider-handle').width() / 2) - ($('#pageNoBallon').width() / 2) );			
		},
		stop: function( event, ui ){
			eBookEnvironment.currLandScapePageNo = parseInt(ui.value);
			if (eBookEnvironment.currLandScapePageNo % 2 == 0) eBookEnvironment.currLandScapePageNo--;
			displayPage(eBookEnvironment.currLandScapePageNo, true);
			var tempVal = '' + eBookEnvironment.currLandScapePageNo + '-' + (eBookEnvironment.currLandScapePageNo+1) + '';
			$(".ui-slider-handle").html(tempVal);
		}
	});
	$( "#amount" ).val( "1-" + $( "#slider-range-min" ).slider( "value" ) );
	var tempVal = ""+"1-" + $( "#slider-range-min" ).slider( "value" ) +"";
	$(".ui-slider-handle").html(tempVal);/**/

	//COVER AND TOC
	if (eBookEnvironment.currLandScapePageNo == 0)
		generateTOC();
	else {
		displayPage(eBookEnvironment.currLandScapePageNo, true);
		$( "#slider-range-min" ).slider('value',eBookEnvironment.currLandScapePageNo);
		var tmp = (eBookEnvironment.currLandScapePageNo % 2 == 0? eBookEnvironment.currLandScapePageNo - 1 : eBookEnvironment.currLandScapePageNo);
		var tempVal = tmp+ "-" + (tmp+1);
		$(".ui-slider-handle").html(tempVal);
	}
	//COVER AND TOC END

	$('.ebook_container_block').hammer({ drag_lock_to_axis: true }).off("dragstart").on("dragstart", function(event) {
		/* Time spent per page */		
		var timeSpent = timeSpentPerPage ? Date.now() - timeSpentPerPage : 0;		
		TOT_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;		
		WEEKLY_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;		
		timeSpentPerPage = 0;
	});
	
	$('.ebook_container_block').hammer({ drag_lock_to_axis: true }).off("dragend").on("dragend", function(event) {
		//$('.ebook_container_block').off('dragend');
		if (event.gesture.direction == Hammer.DIRECTION_RIGHT){
			if (eBookEnvironment.currLandScapePageNo != -1) {
				eBookEnvironment.currLandScapePageNo -= 2;
				displayPage(eBookEnvironment.currLandScapePageNo, true);
			}
		} else if (event.gesture.direction == Hammer.DIRECTION_LEFT) {
			if (eBookEnvironment.currLandScapePageNo + 1 < eBookEnvironment.maxLandScapePageNo) {
				eBookEnvironment.currLandScapePageNo += 2
				displayPage(eBookEnvironment.currLandScapePageNo, true);
			}
		}
		$( "#slider-range-min" ).slider('value',eBookEnvironment.currLandScapePageNo);
		var tmp = (eBookEnvironment.currLandScapePageNo % 2 == 0? eBookEnvironment.currLandScapePageNo - 1 : eBookEnvironment.currLandScapePageNo);
		var tempVal;
		if (eBookEnvironment.currLandScapePageNo == -1)
			tempVal = "1-1";
		else
			tempVal = "" + tmp+ "-" + (tmp+1) + "";
		$(".ui-slider-handle").html(tempVal);/**/
	});

	if (isFirstLoad) {
		onPageLoadComplete("Ebook");
		isFirstLoad = false;
	}

	hideLoader();
	generateNotes();
}

//SET POSITION FOR TEXT HELP MENU
// shifted to util.js
/* function setPosTextHelp(offset,objWid){
	var calLeft = (offset.left + (objWid / 2)) - ($('#textToHelpMenu').width() / 2);
	$('#textToHelpMenu .arrow-down').css('right',0).css('left',0);
	if(calLeft < 0) {
		calLeft = 20;
		$('#textToHelpMenu .arrow-down').css('right','auto').css('left',offset.left + (objWid / 2) - 25);
	} else if(calLeft + $('#textToHelpMenu').width() > $(window).width()){
		var rightDiff = (calLeft + $('#textToHelpMenu').width()) - $(window).width();
		calLeft -= (rightDiff + 20);
		$('#textToHelpMenu .arrow-down').css('right','auto').css('left',($('#textToHelpMenu').width() / 2) + rightDiff + 15 );
	}
	$('#textToHelpMenu').css('left',calLeft).css('top',offset.top-45).show(); 
} */

//SET ORIENTATION
function setOrientation(){
	var winWid = $(window).width(), winHgt = $(window).height();
	$('#viewArea').height(winHgt - 52 - 78 - 46);						//52-Header, 78-Footer, 55-Padding
	var pageWrapHeight = $('#viewArea').height() - (($('.ebook_container_block.left_ebook').width() * 0.02) + ($('.ebook_content_block_middle').width() * 0.02) + ($('#leftPageWrap').width() * 0.02) + 36);
	$('#leftPageWrap, #rightPageWrap, #rightPageWrapTOC').css('max-height',pageWrapHeight).css('height',pageWrapHeight - $('.audio_block').outerHeight());
	$('#rightPageWrapTOC').css('overflow','hidden');	
	$('#tocList, #notesList').css('max-height',$('#leftPageWrap').height() - 140).css('height',$('#leftPageWrap').height() - 140);					//TOC WRAPPER
	if (winWid > winHgt){
		eBookEnvironment.isCurrModePortrait = false;
		//displayPage(eBookEnvironment.currLandScapePageNo, false);
	} else {
		eBookEnvironment.isCurrModePortrait = true;
		//displayPage(eBookEnvironment.currPortraitPageNo, false);
	}
	//$('#indexWrap').hide();
}

//CALCULATE PAGE POSITION ORDER FOR ALL CHAPTERS
function calculatePageOrder(){
	var tmpNo = 0;
	
	//GET DATA IN ORDERLIST ARRAY
	for (var a in content.Toc) { 
		book.orderList.splice(tmpNo,0,{
			"name" : a,
			"order" : parseInt(content.Toc[a].order),
			"title" : content.Toc[a].title,
			"visibility" : content.Toc[a].visibility,
			"sentences" : []
		});
	}

	//SET ORDER OF CHAPTER NUMBER BY SORTING
	sortResults('order', true, book.orderList,'INT');
}

//SET PAGE DETAILS
function setPageInfo(){
	var objSent, pageNo = 1, currHeight = 0, tmpObj;
	var screenH = window.screen.height, screenW = window.screen.width, diff = 0;

	dimension.landscape.width = $('#leftPageWrap').width();
	dimension.landscape.height = $('#leftPageWrap').height();
	//LOGIC FOR PORTRAIT VIEW IS IN FILES ON ARISTOTLE
	
	if ($('#dummyText').length <= 0) 
		$('body').append('<div id="dummyText" class="Book_Notes_content" style="position:absolute;top:84px;left:136px;border:1px solid;overflow:auto;"></div>');
	else
		$('#dummyText').show();

	$('#leftPageWrap, #rightPageWrap').html('');

	//LANDSCAPE MODE
	$('#dummyText').width(dimension.landscape.width).css('max-height',dimension.landscape.height).height(dimension.landscape.height);
	currHeight = dimension.landscape.height;

	//if ios, then call GetResourceInfo for correct rootfolderpath

    rootfolderpath = objEbookJsonData.rootFolderPath.split("/");
	if(navigator.userAgent.match(/iPhone|iPad|iPod/i) && rootfolderpath.length <= 1)
    {
        isCorrectRootfolderpath = false;
        GetResourceInfo();
    }

	for (var i=chapterStartIndex;i<book.orderList.length;i++) {
		book.orderList[i].sentences = [];
		objSent = content.Pages[book.orderList[i].name].sentences;
		for (var j=0;j<objSent.length;j++) {
		
			$('#dummyText').append((objSent[j].media_info != "" ? '<p>' : '') + objSent[j].sentence_text + (objSent[j].media_info != "" ? '</p>' : ''));

			//CHECK IF MEDIA FITS IN AVAILABLE AREA ELSE RESIZE
			if (objSent[j].media_info != "") {
				var objId = objSent[j].media_info.id;
				tmpObj = resizeImage(objSent[j].media_info.width, objSent[j].media_info.height, dimension.landscape.width, dimension.landscape.height)
				//$('#' + objId).parents("p:first").width(tmpObj.width).height(tmpObj.height).attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
				if(!isCorrectRootfolderpath)
                {   var str = objResourceJsonData.jsPath.split("curriculum")[0];
					rootFolderPath_ios = str+"library/";
					$('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',rootFolderPath_ios + $('#' + objId).attr('src'));
				}	
				else
                    $('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
			}

			if (parseInt($("#dummyText")[0].scrollHeight) <= parseInt(currHeight)) {
				book.orderList[i].sentences.push({
					"sentenceNo" : j,
					"landScapePageNo" : pageNo
				});
			} else {
				$('#dummyText').html(objSent[j].sentence_text);

				//CHECK IF MEDIA FITS IN AVAILABLE AREA ELSE RESIZE
				if (objSent[j].media_info != "") {
					var objId = objSent[j].media_info.id;
					tmpObj = resizeImage(objSent[j].media_info.width, objSent[j].media_info.height, dimension.landscape.width, dimension.landscape.height)
					//$('#' + objId).parents("p:first").width(tmpObj.width).height(tmpObj.height).attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
					if(!isCorrectRootfolderpath)
						$('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',rootFolderPath_ios + $('#' + objId).attr('src'));
					else
						$('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
				}

				pageNo++;
				book.orderList[i].sentences.push({
					"sentenceNo" : j,
					"landScapePageNo" : pageNo
				});
			}
		}
		pageNo++;
		$('#dummyText').html('');
	}
	eBookEnvironment.maxLandScapePageNo = --pageNo;	
	wordsPerPage = ((totalWordInBook==0 || eBookEnvironment.maxLandScapePageNo==0) ? 150 : Math.round(totalWordInBook/eBookEnvironment.maxLandScapePageNo));
	
	$('#dummyText').html('').hide();
}

//GENERATE TOC
function generateTOC(){
	var tmpStr = '';
	
	if (wordCountTimeOut != -1) clearTimeout(wordCountTimeOut);	
	
	$('#imgNotes').hide();

	if (content.Pages['cover'] != undefined)
	{
		objSent = content.Pages['cover'].sentences[0];
		$('#leftPageWrap').html('<div style="text-align:center">' + objSent.sentence_text + '</div>');
		var objId = objSent.media_info.id;
		tmpObj = resizeImage(objSent.media_info.width, objSent.media_info.height, dimension.landscape.width, dimension.landscape.height)
		if(!isCorrectRootfolderpath)
			$('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',rootFolderPath_ios + $('#' + objId).attr('src'));
		else
			$('#' + objId).width(tmpObj.width).height(tmpObj.height).attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
	}
	else
		$('#leftPageWrap').html("");
		
	$('#textToHelpMenu, #rwPictureDictionary, #rwDict, #rwTrans').hide();

	if ($('#rightPageWrapTOC').html() == "")
	{
		tmpStr = '<div class="ebook_text_content"> <div class="center"> <div class="notetab"> <button class="left button8 active" id="btnTOCList">Table of Contents</button><button class="left button8" id="btnNotesList">Book Notes</button> </div> </div> <div class="notes_content_bl" id="notesListWrapper" style="display:none;"> <div class="notes_heading">Book Notes</div> <div class="Book_Notes_content" id="notesList" style="overflow:auto;"> <div class="Book_Notes_rule_bg Book_Notes_toc"> <div class="toc_name_row"> <ol class="ebook_list" id="notesOrderedList"><li style="list-style:none;">Loading...</li></ol> </div> <div class="clear"></div> </div> <div class="clear"></div> </div> <div class="clear"></div> </div> <div class="notes_content_bl" id="tocListWrapper"> <div class="notes_heading"> Table of Contents </div> <div class="Book_Notes_content" id="tocList" style="overflow:auto;"> <div class="Book_Notes_rule_bg Book_Notes_toc"> <div class="toc_name_row"> <ol class="ebook_list" id="tocOrderedList"></ol> </div> <div class="clear"></div> </div> <div class="clear"></div> </div> <div class="clear"></div> </div> <div class="clear"></div> </div> <div class="clear"></div>';
		$('#rightPageWrapTOC').html(tmpStr);
		
		

		$('.notetab button').on('click',function(){
			if ($(this).hasClass('active')) return;
			
			$('.notetab button').removeClass('active');
			$(this).addClass('active');
			if ($(this).attr('id') == 'btnTOCList'){
				$('#notesListWrapper').hide();
				$('#tocListWrapper').show();
				$('#tocList').getNiceScroll().show();
				$('#tocList').getNiceScroll().resize();
			} else if ($(this).attr('id') == 'btnNotesList'){
				$(window).trigger('resize');
				$('#notesListWrapper').show();
				$('#tocListWrapper').hide();
				$('#notesList').getNiceScroll().show();
				$('#notesList').getNiceScroll().resize();
			}
			refreshScroll();
		});

		$('#tocList').niceScroll(objScroll);
		$('#btnNotesList').trigger('click');
		$('#notesList').niceScroll(objScroll);
		$('#btnTOCList').trigger('click');

		var setScroll = function(i) {
			if($(i).length>0)
			$(i).niceScroll().updateScrollBar();
		} 

		$('#notesList').getNiceScroll().remove();
		setScroll('#notesList');
	}
		
	$('#rightPageWrapTOC').show();
	$('#rightPageWrap').hide();

	setOrientation();

	tmpStr = '';
	for (var i=chapterStartIndex;i<book.orderList.length;i++) {
		if (book.orderList[i].visibility == 1)
			tmpStr += '<li class="chapterWrap" pgNo="' + book.orderList[i].sentences[0][(eBookEnvironment.isCurrModePortrait ? "portraitPageNo" : "landScapePageNo")] + '"><a href="javascript:void(0);">' + book.orderList[i].title + '</a></li>'
	}
	$('#tocOrderedList').html(tmpStr);
	
	$('.chapterWrap').on('click touchend',function(){
		if (tmpScroll) return;
		eBookEnvironment.currLandScapePageNo = parseInt($(this).attr('pgNo'));
		if (eBookEnvironment.currLandScapePageNo % 2 == 0) eBookEnvironment.currLandScapePageNo--;
		displayPage(eBookEnvironment.currLandScapePageNo, true);
		$( "#slider-range-min" ).slider('value',eBookEnvironment.currLandScapePageNo);
		var tmp = (eBookEnvironment.currLandScapePageNo % 2 == 0? eBookEnvironment.currLandScapePageNo - 1 : eBookEnvironment.currLandScapePageNo);
		var tempVal = "" + tmp+ "-" + (tmp+1) + "";
		$(".ui-slider-handle").html(tempVal);/**/
	});

	setOrientation();
	$('#tocList').on('touchstart',function(){
		tmpTouchStarted = true;
	});
	$('#tocList').on('touchend',function(){
		tmpTouchStarted = false;
	});
	$('#tocList').on('scroll',function(event){
		event.preventDefault();
		event.stopPropagation();
		tmpScroll = true;
		setTimeout(function a(){
			if (tmpTouchStarted)
			{
				setTimeout(a,500);
				return;
			}
			tmpScroll=false;
		},500);
	});
		
	isShowingTOC = true;
	generateNotes();

	$('#tocList').getNiceScroll().show();
	$('#tocList').getNiceScroll().resize();
	eBookEnvironment.currLandScapePageNo = -1;
	setTimeout(function(){
		$(window).trigger('resize');
	},0);
	//$('.ebook_container_block').hammer({ drag_lock_to_axis: true }).off("dragend")
}

//GENERATE NOTES
function generateNotes(){
 	hideLoader();
	GetNotelist('journal',bookid);
}

function getNoteListDraw(){
	var tmpStr = '';
	for (var i=0, obj;i<objNoteBookData.Content.Data.length;i++) {
		obj = JSON.parse(objNoteBookData.Content.Data[i].RefOtherData);
		//tmpStr += '<li chapNo="' + obj.chapNo + '" sentNo="' + obj.sentNo + '"><div class="notesLeftText">' + (i+1) + '.&nbsp;' + decodeURIComponent(objNoteBookData.Content[i].NoteText.replace(/<br>/gi, " ")) + '</div></li.
		if(objNoteBookData.Content.Data[i].ShortNoteText == null)
			objNoteBookData.Content.Data[i].ShortNoteText= '';
		tmpStr += '<li chapNo="' + obj.chapNo + '" sentNo="' + obj.sentNo + '"><div class="notesLeftText">' + (i+1) + '.&nbsp;' + decodeURIComponent(objNoteBookData.Content.Data[i].ShortNoteText.replace(/<br>/gi, " ")) + '</div></li>';
		
		book.orderList[obj.chapNo].sentences[obj.sentNo].hasBookNote = true;
		if (book.orderList[obj.chapNo].sentences[obj.sentNo].NoteID == undefined)
		{
			book.orderList[obj.chapNo].sentences[obj.sentNo].NoteID = [];
		}
		if (jQuery.inArray( objNoteBookData.Content.Data[i].NoteID , book.orderList[obj.chapNo].sentences[obj.sentNo].NoteID) == -1){
			book.orderList[obj.chapNo].sentences[obj.sentNo].NoteID.push(objNoteBookData.Content.Data[i].NoteID);
		}		
		if (((book.orderList[obj.chapNo].sentences[obj.sentNo].landScapePageNo == eBookEnvironment.currLandScapePageNo) || (book.orderList[obj.chapNo].sentences[obj.sentNo].landScapePageNo == eBookEnvironment.currLandScapePageNo + 1)) && !isShowingTOC)
			$('#imgNotes').show();
		
		
	}
	//tmpStr = '<li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard</li> <li>dummy text ever since the 1500s, when an unknown printer took a galley of type</li> <li>and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li>';
	$('#notesOrderedList').html(tmpStr);

	$('#notesOrderedList li').off('click').on('click',function(){
		eBookEnvironment.currLandScapePageNo = book.orderList[$(this).attr('chapNo')].sentences[$(this).attr('sentNo')].landScapePageNo;
		eBookEnvironment.currLandScapePageNo = (eBookEnvironment.currLandScapePageNo % 2 == 0? eBookEnvironment.currLandScapePageNo - 1 : eBookEnvironment.currLandScapePageNo);
		displayPage(eBookEnvironment.currLandScapePageNo, true);
		$( "#slider-range-min" ).slider('value',eBookEnvironment.currLandScapePageNo);
		var tmp = eBookEnvironment.currLandScapePageNo;
		var tempVal = "" + tmp+ "-" + (tmp+1) + "";
		$(".ui-slider-handle").html(tempVal);
	});
}

//DISPLAY PAGE
function displayPage(pageNo){
	/*
		VALUE FOR UPDATECOUNTERPAGENO
		TRUE	-	SHOULD UPDATE PAGE NUMBER FOR COUNTER PAGE VIEW TYPE I.E. CURRENT PORTRAIT VIEW NUMBER FOR LANDSCAPE VIEW AND VICE VERSA
		FALSE	-	SHOULD NOT UPDATE PAGE NUMBER FOR COUNTER PAGE VIEW TYPE I.E. CURRENT PORTRAIT VIEW NUMBER FOR LANDSCAPE VIEW AND VICE VERSA
	*/
	var pageDrawn = 0;

	if (pageNo == -1)
	{
		generateTOC();
		return;
	}

	$('#leftPageWrap, #rightPageWrap').html('').show();
	$('#rightPageWrapTOC').hide();
	$('#textToHelpMenu, #rwPictureDictionary, #rwDict, #rwTrans').hide();
	$('#imgNotes').hide();
	try{$rw_stopSpeech()} catch (e){}
	
	if (wordCountTimeOut != -1) clearTimeout(wordCountTimeOut);	
	
	for (var i=chapterStartIndex;i<book.orderList.length;i++) {
		for (var j=0;j<book.orderList[i].sentences.length;j++) {
			if(book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo) {
				$('#leftPageWrap').append(content.Pages[book.orderList[i].name].sentences[j].sentence_text);
				eBookEnvironment.currPortraitPageNo = book.orderList[i].sentences[j].portraitPageNo;
				pageDrawn = 1;
				$('#leftPageWrap').removeClass('t3 t2 t1 t0');
				FitTextInPage($('#leftPageWrap'));

				//CHECK IF PAGE HAS NOTES THEN SHOW NOTESICON
				if (book.orderList[i].sentences[j].hasBookNote)
					$('#imgNotes').show();
			}
			if(book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo + 1) {
				$('#rightPageWrap').append(content.Pages[book.orderList[i].name].sentences[j].sentence_text);
				pageDrawn = 2;
				$('#rightPageWrap').removeClass('t3 t2 t1 t0');
				FitTextInPage($('#rightPageWrap'));
				
				//CHECK IF PAGE HAS NOTES THEN SHOW NOTESICON
				if (book.orderList[i].sentences[j].hasBookNote)
					$('#imgNotes').show();
			}
			
			//CHECK IF MEDIA FITS IN AVAILABLE AREA ELSE RESIZE
			if((book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo) || (book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo + 1)) {
				objSent = content.Pages[book.orderList[i].name].sentences;
				if (objSent[j].media_info != "") {
					var objId = objSent[j].media_info.id;
					tmpObj = resizeImage(objSent[j].media_info.width, objSent[j].media_info.height, dimension.landscape.width, dimension.landscape.height)
					if(!isCorrectRootfolderpath)
						$('#' + objId).width(tmpObj.width).height(tmpObj.height).css('display','block').attr('src',rootFolderPath_ios + $('#' + objId).attr('src'));
					else
						$('#' + objId).width(tmpObj.width).height(tmpObj.height).attr('src',objEbookJsonData.rootFolderPath + $('#' + objId).attr('src'));
				}
			}
		}
		if (pageDrawn == 2) i = book.orderList.length;
	}
	//$('#divPageNo').html(eBookEnvironment.currLandScapePageNo + ' / ' + eBookEnvironment.maxLandScapePageNo);

	isShowingTOC = false;
	refreshScroll();

	//if (productCode.match(/^ilit20/)) {
		/* 10 seconds time limit added */
		wordCountTimeOut = setTimeout(function(){
			totalWordsRead += wordsPerPage * 2;
			weekWiseWordCount += wordsPerPage * 2;	
			
			if (totalWordsRead >= (dBookCompletePercent/100) * totalWordInBook) {
				totalWordsRead = totalWordInBook;
				weekWiseWordCount = totalWordInBook;
				bookReadEnd = true;
			}
			wordCountTimeOut = -1;
		},wordCountTime4ilit20 * 1000);
	//}
	/* else {
		wordCountTimeOut = setTimeout(function(){
			totalWordsRead += wordsPerPage * 2;
			weekWiseWordCount += wordsPerPage * 2;			
			
			if (totalWordsRead >= (dBookCompletePercent/100) * totalWordInBook) {
				totalWordsRead = totalWordInBook;
				weekWiseWordCount = totalWordInBook;
				bookReadEnd = true;
			}
			wordCountTimeOut = -1;
		},wordCountTime * 1000);
	}
 */
	timeSpentPerPage = Date.now();	
	
	//Disable default behaviour of anchor tag in sentences
	if($('#leftPageWrap .s a, #rightPageWrap .s a').length > 0)
		$('#leftPageWrap .s a, #rightPageWrap .s a').addClass('anchorDisable').bind("click", function(e){ e.preventDefault(); });
}

//FUNCTION TO RESET THE FONT SIZE OF THE PAGE TEXT TO FIT WITHIN THE CONTAINER
function FitTextInPage(pgObj){
	var maxHeight = pgObj.css('max-height').split("p")[0];
	var currentHeight = pgObj.contents().height();
	if(currentHeight > maxHeight){
		if($('body').hasClass('t3')){
			pgObj.addClass('t2');
			if(pgObj.contents().height() > maxHeight){
				pgObj.removeClass('t2').addClass('t1');
				if(pgObj.contents().height() > maxHeight)
					pgObj.removeClass('t1').addClass('t0');	
			}
		}	
		else if($('body').hasClass('t2')){
			pgObj.addClass('t1');
			if(pgObj.contents().height() > maxHeight){
				pgObj.removeClass('t1').addClass('t0');
			}
		}
		else
			pgObj.addClass('t0');
	}
	else
		pgObj.removeClass('t3 t2 t1 t0');
	
}

//FUNCTION TO RESIZE IMAGE TO FIT WITHIN THE CONTAINER
function resizeImage(imgW, imgH, contW, contH){
	var state = 0;				// 1 - IMAGE WIDTH IS GREATER THEN CONTAINER WIDTH, 2 - IMAGE HEIGHT IS GREATER THEN CONTAINER HEIGHT, 3 - IMAGE WIDTH AND HEIGHT ARE GREATER THEN CONTAINER WIDTH AND HEIGHT
	var calW = imgW, calH = imgH;

	if (imgW > contW)
		state = 1;
	if (imgH > contH)
		state = 2;
	if (imgW > contW)
		state = 3;

	switch (state)
	{
		case 1:
			calW = contW;
			calH = imgH * contW / imgW;
			break;
		case 2:
			calH = contH;
			calW = imgW * contH / imgH;
			break;
		case 3:
			calH = contH;
			calW = imgW * contH / imgH;
			break;
	}
	return {"width":calW,"height":calH};
}

//FUNCTION TO LOAD CSS
function loadCSS( path, fn, scope ) {
   $('body').attr('class',path);
   fn.call(window);
}

//AFTER CSS IS LOADED
function afterCSSLoad(){
	hideLoader();
	var currSentenceNo = {
		"portrait" : {
			"chapterNo" : 0,
			"sentenceNo" : 0
		},
		"landscape" : {
			"chapterNo" : 0,
			"sentenceNo" : 0
		}
	}

	for (var i=chapterStartIndex;i<book.orderList.length;i++) {
		for (var j=0;j<book.orderList[i].sentences.length;j++) {
			if(book.orderList[i].sentences[j].portraitPageNo == eBookEnvironment.currPortraitPageNo) {
				currSentenceNo.portrait.chapterNo = i;
				currSentenceNo.portrait.sentenceNo = j;
			}
			if(book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo) {
				currSentenceNo.landscape.chapterNo = i;
				currSentenceNo.landscape.sentenceNo = j;
			}
			if (currSentenceNo.portrait.chapterNo != 0 && currSentenceNo.landscape.chapterNo != 0) {
				j = book.orderList[i].sentences.length;
			}
		}
	}

	setPageInfo();
	
	
	if (eBookEnvironment.isCurrModePortrait){
		if (currSentenceNo.portrait.chapterNo != 0)
			eBookEnvironment.currPortraitPageNo = book.orderList[currSentenceNo.portrait.chapterNo].sentences[currSentenceNo.portrait.sentenceNo].portraitPageNo;
	} else {
		if (currSentenceNo.landscape.chapterNo != 0) {
			eBookEnvironment.currLandScapePageNo = book.orderList[currSentenceNo.landscape.chapterNo].sentences[currSentenceNo.landscape.sentenceNo].landScapePageNo;
		}
	}

	if (!isShowingTOC)
	{
		if (eBookEnvironment.currLandScapePageNo % 2 == 0) eBookEnvironment.currLandScapePageNo--;
		displayPage(eBookEnvironment.currLandScapePageNo, true);
		$( "#slider-range-min" ).slider("option", "max",eBookEnvironment.maxLandScapePageNo);
		$( "#slider-range-min" ).slider("value", eBookEnvironment.currLandScapePageNo);
		
		var tempVal = "" + eBookEnvironment.currLandScapePageNo + "-" + (eBookEnvironment.currLandScapePageNo+1) + "";
		$(".ui-slider-handle").html(tempVal);
		getNoteListDraw(); 
	} else {
		generateTOC();
	}
}

//SORT JSON
function sortResults(prop, asc, arr, type) {
	/*
		VALUE FOR TYPE
		DATE		-	FOR DATETIME
		INT			-	FOR NUMBER
		STR			-	FOR STRING (DEFAULT)
	*/
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    arr = arr.sort(function(a, b) {
		switch (type)
		{
			case 'DATE':
				c = new Date(a[prop]);
				d = new Date(b[prop]);
				return (asc ? (c - d) : (d - c));
				break;
			case 'INT':
				c = parseInt(a[prop]);
				d = parseInt(b[prop]);
				return (asc ? (c - d) : (d - c));
				break;
			case 'STR':
				c = (a[prop]).toLowerCase();
				d = (b[prop]).toLowerCase();
				break;
		}
		
		if (isSafari || $.browser.msie)
		{
			if (c == d)
				return 0;
			if (c > d)
				return (asc ? 1 : -1);
			if (c < d)
				return (asc ? -1 : 1);
		} else {
			if (asc) 
				return (c > d);
			else 
				return (d > c)
		}
    });
    //return arr;
}

//SHOW LOADER
function showLoader(){
	$('#popup-overlay3').show();
	$('#loaderWrap').show();
}

//HIDE LOADER
function hideLoader(){
	$('#popup-overlay3').hide();
	$('#loaderWrap').hide();
}

//JQUERY PLUGIN TO SELECT TEXT MODIFIED TO SET BACKGROUND
// shifted to iSerieseBase.js
/* jQuery.fn.selectText = function(){
	var doc = document
		, element = this[0]
		, range, selection
	;
	$('.highlight').removeClass('highlight');
	$(element).addClass('highlight');
	
	if (doc.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();        
		range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}; */

//REFRESH NICESCROLL
function refreshScroll(){
	try
	{
		for (var i=0;i<$.nicescroll.length;i++)
		{
			$.nicescroll[i].onResize();
		}
	}
	catch (e){}
}

//SHOW ADD NOTES 
function showAddNotes(){
	$('#overlay, #notesModal').show();
}

//HIDE ADD NOTES 
function hideAddNotes(){
	$('#overlay, #notesModal').hide();
}

//CREATE NOTES
function createNote(e){
	e.preventDefault();
	$('#txtAreaCreateNote').show();
	$('#txtAreaListNote').hide();
	$('#btnSaveNote').show();
	showAddNotes();
	$('#txtAreaCreateNote').attr("autofocus","autofocus").focus().val($('.Book_Notes_content .highlight').text());
}

//FUNCTION TO SAVE NOTES
function saveNewNotes(){
	var parentID = '#rightPageWrap', sentIndex = -1, chapNo = -1, sentNo = -1, objNotes, currPageNo = eBookEnvironment.currLandScapePageNo + 1;
	hideAddNotes();
	if ($('.highlight').parents("#leftPageWrap").length > 0) {
		parentID = '#leftPageWrap';
		currPageNo--;
	}

	if ($('.highlight').hasClass('s'))
		sentIndex = $(parentID + " .s").index($(parentID + ' .highlight'));
	else
		sentIndex = $(parentID + " .s").index($(parentID + ' .highlight').parents('.s'));

	for (var i=chapterStartIndex, sentCount=-1;i<book.orderList.length;i++) {
		for (var j=0;j<book.orderList[i].sentences.length;j++) {
			if(book.orderList[i].sentences[j].landScapePageNo == currPageNo) {
				sentCount++;
				if (sentCount == sentIndex){
					chapNo = i;
					sentNo = j;
					j = book.orderList[i].sentences.length;
				}
			}
		}
		if (chapNo != -1) i = book.orderList.length;
	}
	
	objNotes = '{\\"chapNo\\":'+chapNo+',\\"sentNo\\":'+sentNo+'}';
	var shortNoteText = $('#txtAreaCreateNote').val().replace(/\n/gi, "<br>").substr(0, 50);
 
	showLoader();
    
	//ILIT- 664
	var currentUnit = (objEbookJsonData.currentUnit == '' ? 1 : objEbookJsonData.currentUnit );
	
    SaveNote("", 'journal', encodeURIComponent(bookTitle), encodeURIComponent($('#txtAreaCreateNote').val().replace(/\n/gi, "<br>")), bookid, currentUnit, 'ebook',objNotes,encodeURIComponent(shortNoteText));
	//generateNotes();
}

//DELETE NOTES
function deleteNotes(){
	//DeleteNote(noteId)
}

//LIST NOTES
function listNotes(){
	var tmpStr = '';
	for (var i=chapterStartIndex;i<book.orderList.length;i++) {
		for (var j=0;j<book.orderList[i].sentences.length;j++) {
			if((book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo) || (book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo + 1)) {
				if (book.orderList[i].sentences[j].hasBookNote != undefined)
				{
					for (var k=0;k<objNoteBookData.Content.Data.length;k++) {
						for (var l=0;l<book.orderList[i].sentences[j].NoteID.length;l++ )
						{
							if (objNoteBookData.Content.Data[k].NoteID == book.orderList[i].sentences[j].NoteID[l])
							{
								GetNoteInfo(objNoteBookData.Content.Data[k].NoteID);
								//tmpStr += decodeURIComponent(objNoteBookData.Content[k].NoteText) + '<br><br>';
							}	
						}											
					}
				} 
			}
		}
	}

	/* $('#txtAreaCreateNote').hide();
	$('#txtAreaListNote').html(tmpStr).show();
	$('#btnSaveNote').hide();
	showAddNotes(); */
}

function showNotesContent(){
	var tempStr='';
	tempStr += decodeURIComponent(objNoteInfoData.Content.NoteText) + '<br><br>';
	$('#txtAreaCreateNote').hide();
	$('#txtAreaListNote').html(tempStr).show();
	$('#btnSaveNote').hide();
	showAddNotes();
}

//FUNCTION TO SAVE TEXT TO CLIPBOARD
function copyText(){
	SaveData('clipboardText',$('.Book_Notes_content .highlight').text());
}

//GET LIBRARY PROGRESS CALL BACK
function GetLibraryProgressCallback(pobjlibraryProgressData) {	
	pobjlibraryProgressData = JSON.parse(pobjlibraryProgressData);
	if (pobjlibraryProgressData.Status == 200)
	{
		if (pobjlibraryProgressData.Content.length > 0) {
			if(pobjlibraryProgressData.Content[0].ProgressDataDetails!= "")
			{
				objLibraryProgress = JSON.parse(pobjlibraryProgressData.Content[0].ProgressDataDetails);
				$('body').attr('class',objLibraryProgress['font-size']);
				$('.zooms.active').removeClass('active');
				$('.zooms[cssPath="' + objLibraryProgress['font-size'] + '"]').addClass('active');
				//eBookEnvironment.currLandScapePageNo = objLibraryProgress.pageNo;
				if(objLibraryProgress.WordCountObj != null && objLibraryProgress.WordCountObj != 'undefined')
					WordCountObj = objLibraryProgress.WordCountObj; 
				else
					WordCountObj={};
			}
			totalWordsRead = !isNaN(pobjlibraryProgressData.Content[0].TotalNumberOfWordsRead) ? pobjlibraryProgressData.Content[0].TotalNumberOfWordsRead : 0;

			if (totalWordInBook * (dBookCompletePercent/100) <= totalWordsRead) {
				bookReadEnd = true;
			}
			
			TOT_TIME_SPENT += pobjlibraryProgressData.Content[0].TotalNumberOfSecondsSpent ? pobjlibraryProgressData.Content[0].TotalNumberOfSecondsSpent * 1000 : 0;
			
			
			/* find current week time spent */
			var fCallback  = function (currentWeek) {
				var bookType = (bookid == objEbookJsonData.currentRataBookId ? 'RATA' : 'Time To Read' );
				var currentBookType = (bookType == 'Time To Read' ? 'TTR' : 'RATA' );
				var currentUnit = (objEbookJsonData.currentUnit == '' ? 1 : objEbookJsonData.currentUnit );
				var currentWeek = currentWeek ? currentWeek : (objEbookJsonData.currentWeek == '' ? 1 : objEbookJsonData.currentWeek);
				var regex = new RegExp(currentUnit+'\.'+currentWeek+'\.'+currentBookType);
				$.each(WordCountObj, function (k, val) {				
					if (k.match(regex) && typeof val == "string" && val.match(/\d*\|\d*/)) {
						WEEKLY_TIME_SPENT += parseInt(val.split("|")[1]) * 1000; 
					}
				});
			}
			if (productCode.match(/^ilit20/)) {
				getCurrentWeek(fCallback);		
			}
			else {	
				fCallback('');				
			}			
		}
	}

	// if totalWordInBook or totalPages is 0 then wordsPerPage will be 150 else calculated value
	//wordsPerPage = ((totalWordInBook==0 || eBookEnvironment.maxLandScapePageNo==0) ? 150 : Math.round(totalWordInBook/eBookEnvironment.maxLandScapePageNo));
	
	init();
	/* TexthelpSpeechStreamToolbar.addToolbar(); */
	 TexthelpSpeechStream.addToolbar("Tablet", "1");
}

//SAVE LIBRARY DATA
function setLibraryProgress(){
	if ($('button.sld_lft').hasClass('disabled')) return;
	
	var fCallback = function (currentWeek) {
		var chapNo = -1, sentNo = -1, objLibraryDetails;
		for (var i=chapterStartIndex;i<book.orderList.length;i++) {
			for (var j=0;j<book.orderList[i].sentences.length;j++) {
				if(book.orderList[i].sentences[j].landScapePageNo == eBookEnvironment.currLandScapePageNo) {
					chapNo = i;
					sentNo = j;
					j = book.orderList[i].sentences.length;
				}
			}
			if (chapNo != -1) i = book.orderList.length;
		}
		bookType = (bookid == objEbookJsonData.currentRataBookId ? 'RATA' : 'Time To Read' );
		var currentBookType = (bookType == 'Time To Read' ? 'TTR' : 'RATA' );
		var currentUnit = (objEbookJsonData.currentUnit == '' ? 1 : objEbookJsonData.currentUnit );
		var currentWeek = currentWeek ? currentWeek : (objEbookJsonData.currentWeek == '' ? 1 : objEbookJsonData.currentWeek );
		
		// total time spent per book
		var timeSpent = timeSpentPerPage ? Date.now() - timeSpentPerPage : 0;	
		TOT_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;	
		WEEKLY_TIME_SPENT += timeSpent > maxTimePerPage ? maxTimePerPage : timeSpent;	
		timeSpentPerPage = 0;		
		var totTimeSpentInSec = Math.round(TOT_TIME_SPENT/1000); // convert to seconds
		var weekWiseTimeSpent = Math.round(WEEKLY_TIME_SPENT/1000); // convert to seconds
		
		// total word count & time spent per week
		var isMatchingFound = false;
		if(currentUnit!=0 && currentWeek!=0){
			if(WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType] != undefined) {
				weekWiseWordCount+= parseInt(WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType]);
			}
			if(weekWiseWordCount > totalWordInBook) 
				weekWiseWordCount = totalWordInBook;
			
			WordCountObj[currentUnit+'.'+currentWeek+'.'+currentBookType] = weekWiseWordCount+"|"+weekWiseTimeSpent;
		}
		else
			WordCountObj={};
			
		var _finalArr = [];
		_finalArr[0]=JSON.stringify(WordCountObj).replace(/"/g, '\\"');
		
		/* mark as book complete if 70% read */
		if (totalWordsRead >= totalWordInBook * (dBookCompletePercent/100)) {
			bookReadEnd = true;
		}			
		
		objLibraryProgress = '{\\"bookType\\":\\"' + bookType + '\\",\\"mode\\":\\"landscape\\",\\"chapNo\\":'+chapNo+',\\"sentNo\\":'+sentNo+',\\"font-size\\":\\"'+$('body').attr('class')+'\\"'+ ',\\"WordCountObj\\":' + _finalArr+'}';
		objLibraryDetails  = '{\\"bookType\\":\\"' + bookType + '\\",\\"totalWords\\":' + totalWordInBook + ',\\"bookCompleted\\":' + bookReadEnd + ',\\"currentUnit\\":' + currentUnit +  ',\\"currentWeek\\":' + currentWeek +'}';
		
		objSaveLibraryProgressResponse = null; // response from SaveLibraryProgress will be stored here
		SaveLibraryProgress(undefined,bookid,objLibraryDetails,objLibraryProgress,totalWordsRead,isBroadcast,totTimeSpentInSec,bookLexileLevel); // 'isBroadcast' is added so that windows can detect whether 'savelibrary' call has been triggered from broadcasted window or main window (of eBook)
		
		setTimeout(function () {
			checkSave();
		}, 400);
		
		
		var pdfReaderFrameSrc = window.top.$('.pdfReaderOverlay .pdfReaderWrapper #pdfReaderFrame').attr("src"),
			broadcastFrameSrc = window.top.$('.broadcastOverlay .broadcastWrapper #broadcastFrame').attr("src");
			
		if (objEbookJsonData.appPlatform==null && objEbookJsonData.currentVersion ==null && source=='broadcast'){
			HideEbookBroadcast();
		}
		//ILIT-1082
		else if (
			source=='broadcast' && 
			pdfReaderFrameSrc.length > 0 &&
			broadcastFrameSrc.length > 0
		){
			HideEbookBroadcast();
		}
		else{
			showLoader();
		}
	}
	
	/* calculate current week */
	if (productCode.match(/^ilit20/)) {
		getCurrentWeek(fCallback);		
	}
	else {		
		fCallback('');
	}	
}

function getCurrentWeek(fCallback) {
	$.nativeCall({
			'method': 'getCurrentDeviceTimestamp',
			'globalResource': 'objGetCurrentDeviceTimestamp',
			'checkSuccess': function (oResponse) {
				return oResponse != null;
			},
			'onComplete': function () {
				var currentWeek = 1;
				if (classStartDate) {
					var sDate1 = classStartDate;					
					var sDate2 = objGetCurrentDeviceTimestamp.currentDeviceTimestamp;
					//var sDate2 = "2016-06-14 09:02:29";
					var d1 = new Date(sDate1).getTime();
					var d2 = new Date(sDate2).getTime();
					
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
		});
}

function checkSave() {	
	if (objSaveLibraryProgressResponse != null) {		
		try {			
			if (oPlatform.isDevice()) {
				CloseWebView()
			}			
			redirectFromEbook();			
		} catch(e) {
		}
	}
	else {
		setTimeout(function () {
			checkSave();
		}, 400);
	}
}

function redirectFromEbook(){	
    hideLoader();
    if (source=='broadcast') {
		HideEbookBroadcast();
	} else if(source=='assignment' || source=='notebook'){
		//HideNativeBottomBar(false);
		window.location.href='../'+context;
	}
	else {
		window.location.href='../library.html';
	}
}

//CALLBACK ON START OF READ OF TEXT HELP 
function textRead_speechStartedCallback(){
	var objID = '#rightAudioStop';
	if ($('.highlight').parents("#leftPageWrap").length > 0)
		objID = '#leftAudioStop';
	$(objID).css('visibility', 'visible');
}

//CALLBACK ON STOP OF READ OF TEXT HELP 
function textRead_completedCallback(){
	$('.audio_block').css('visibility', 'hidden');
}

function playText() {
    $('#tempID').removeAttr('id')
    $('.Book_Notes_content .highlight').attr('id', 'tempID');
    $rw_speakById('tempID');
}

//DISABLE BUTTON ON BROADCAST END
function onBroadcastEnd(){
	$('button.sld_lft').removeClass('disabled');
}

//ENABLE BUTTON ON BROADCAST START
function onBroadcastStart(){
	$('button.sld_lft').addClass('disabled');
}