/**
 * Instructor View Lesson JS
 * @class LessonView
 * @module Lesson
 * @constructor
 */
function LessonView () {};

/**
@property model
*/
LessonView.model = null;
/**
@property mySwiper
*/
LessonView.mySwiper = {};
/**
@property myPopupSwiper
*/
LessonView.myPopupSwiper = {};
/**
@property bookPages
*/
LessonView.bookPages = null;
/**
@property book_slide
*/
LessonView.book_slide = '';
/**
@property book_audio
*/
LessonView.book_audio = '';
/**
@property book_stop_page
*/
LessonView.book_stop_page = {};
/**
@property slide_viewed
*/
LessonView.slide_viewed = {};
/**
@property lessonId
*/
LessonView.lessonId = '';
/**
@property currentSlide
*/
LessonView.currentSlide = '';
/**
@property disableOnPreview
*/
LessonView.disableOnPreview = '';
/**
@property rataSlide
*/
LessonView.rataSlide = {};
/**
@property conferenceLessons
*/
LessonView.conferenceLessons = [];
/**
@property slideHeight
*/
LessonView.slideHeight = 0;
/**
@property slideWidth
*/
LessonView.slideWidth = 0;
/**
@property SetBroadcastRataFlag
*/
LessonView.SetBroadcastRataFlag = false;
/**
@property SetBroadcastActionType
*/
LessonView.SetBroadcastActionType = '';
/**
@property dataSlideCount
*/
LessonView.dataSlideCount = 0;

/**
@property oAttemptInfo
*/
LessonView.oAttemptInfo = null;

/**
@property agradebookData
*/
LessonView.agradebookData = [];

/**
@property sConferenceType
*/
LessonView.sConferenceType = '';

/**
 * Initialize Lesson Model
 * @method init
 * @param {object} model
 * @return 
 */
LessonView.init = function (model) {
    LessonView.model = model;
	LessonView.disableOnPreview = (objLessonJsonData.previewLesson == "1")?'disableOnPreview':'';
    LessonView.render();
    LessonView.bindEvent();
};

/**
 * Render the Lesson View
 * @method render
 * @return 
 */
LessonView.render = function () {
	/*  for WTW */
	var CUR_LESSON_TAB = '';
	switch(objLessonJsonData.productType){
		case GENERAL.c_s_PROD_TYPE_MYELD:
		case GENERAL.c_s_PROD_TYPE_ILIT:
			CUR_LESSON_TAB = LESSON_TAB_VIEW;
		break;
		
		case GENERAL.c_s_PROD_TYPE_WTW:
			CUR_LESSON_TAB = LESSON_TAB_VIEW_WTW;
		break;
		
		default:
			CUR_LESSON_TAB = LESSON_TAB_VIEW;
	} 
	
    LessonView.lessonId = LessonView.model.LessonData.lessionId;	
    var json_tabs = (typeof LessonView.model.LessonData.activities != 'undefined') ? _.keys(LessonView.model.LessonData.activities) : '';   
    /* put the main template in the main container */ 
	
	var aTabTypes = _.pluck(CUR_LESSON_TAB, "c_s_TABTYPE");
		
	 /* retrieve the first tab slides to display them */
	var tab_type = _.first(_.intersection(aTabTypes, json_tabs));
	
	var tab = _.where(CUR_LESSON_TAB, {"c_s_TABTYPE" : tab_type});
	var tab_name = (typeof tab[0] != 'undefined') ? tab[0].c_s_TABNAME : '';
	var tab_type = (typeof tab[0] != 'undefined') ? tab[0].c_s_TABTYPE : '';		
	var iTabIndex = (typeof tab[0] != 'undefined') ? parseInt(tab[0].c_s_TABORDER) : 1;	
	
	Application.mainContainer.html(_.template($("#mainTemplate").html(), {
        "json" : LessonView.model.LessonData, 
        "tabs": CUR_LESSON_TAB,
        "json_tabs": json_tabs,
		"iTabIndex": iTabIndex
    }));
	
	$("#main_container .container_space h2").text(tab_name);

	if (typeof LessonView.model.LessonData.activities != 'undefined') {
		LessonView.updatedRightView(tab_type);
		LessonView.resize();
		
		/* note: SetGoogleAnalytic() param - VERBID */
		SetGoogleAnalytic(tab[0].c_s_VERBID, LessonView.lessonId);
	}
	else {
		LessonView._alert({
						divId:		'dialog-message',
						message:	LESSON.c_s_NO_ACTIVITIES
					});
	}	
	
};

/**
 * Bind Events for Left Tabs
 * @method bindEvent
 * @return 
 */
LessonView.bindEvent = function(){
	
    /* tab click event*/
    $("#main_container .nav_tabs li a").off("click").on("click",function(event){
        if($(this).parent().hasClass('active')){
            return false;
        }
        //event.preventDefault();       
                        
        LessonView.animateContent($(this).attr('id'),$(this).data('type'),$(this).parent().attr('class'));
            
        $(".nav_tabs li").removeClass('active');
        $(this).parent().addClass('active');
        
        $(".container_space h2").fadeOut('fast', function(){
            $(this).text($("#main_container .nav_tabs li.active a").text());
            $(this).fadeIn('fast');
                
          // setTimeout(function(){
            videojs.options.flash.swf = "media/video-js.swf";
            $('.video-js').each(function(){
                var video_id = $(this).attr('id');
                videojs(video_id).ready(function(){
                    myplayer=this;
                    myplayer.load(function(){                    
                        $('.video_container.page_container_video').css({'height':'235px','width':'420px'});
                        $('.video-js').css({'height':'235px','width':'420px'});
                        $('.video-js .vjs-tech').css({'height':'100%','width':'100%'});
                    }); 
                }); 
				/*{"controls":true, "preload": false, "autoplay": false,"techOrder": ["html5","flash"]}
				videojs(video_id, {"controls":true, "preload": false, "autoplay": false,"techOrder": ["html5","flash"]}); */
            })
              
          // },1000);
        });
		
		/* note: SetGoogleAnalytic() params - VERBID */
		SetGoogleAnalytic($(this).data('verbid'), LessonView.lessonId);
		
    });

	$("#resize-button").off("click").on("click", function() {
		setTimeout(function(){
			LessonView.resize();
			LessonView.swiperResize();
		}, 100);				
	});
    	
};

/**
 * Poll Tool Tip
 * Not in Use
 * @method bindPollTooltip
 * @return 
 */
LessonView.bindPollTooltip = function(){
	$("#create_poll").off("click tap").on("click tap", function(){		
		PollView.init();
	});
};

/**
 * Message Alert
 * @method alertMessage
 * @param {String} msg 
 * @return 
 */
LessonView.alertMessage = function(msg){
    $( "#dialog-message" ).html(msg);
                $( "#dialog-message" ).dialog({
                        resizable: false,
                        draggable: false,
                        modal: true
                        
                });
                
     $(document).off('click tap').on('click tap', '.ui-dialog-titlebar-close', function () {     
        $('.theme_content').css('overflow', 'auto');
        $('.natural_box_space').css('overflow', 'auto');
    });
};

/**
 * on tab click change the background with animation
 * @method animateContent
 * @param {String} tabid //Not Used
 * @param {String} tabtype
 * @param {String} bgclass
 * @return 
 */
LessonView.animateContent = function(tabid,tabtype,bgclass){
	$('.backgound_images.first').attr('class','backgound_images '+bgclass+' first');
    $("#slide_content").animate({
        opacity: 0.5
    }, 'fast', function(){
        LessonView.updatedRightView(tabtype);
        $(this).animate({opacity: 1},'300');
    });
};

/**
 * on tab click Update the content on right panel 
 * @method updatedRightView
 * @param {String} tabtype 
 * @return 
 */
LessonView.updatedRightView = function(tabtype){	
	var slide_count = _.size(LessonView.model.LessonData.activities[tabtype].slides);
	var show_pagination = (slide_count == 1) ? 'hidden' : 'block';
    $("#slide_content").html('<div class="swiper-container swiper-nested1 swiper-n1"><div class="swiper-wrapper"></div></div><div class="pagination" style="visibility:'+ show_pagination +'"></div>');            
    LessonView.getData(LessonView.model.LessonData.activities[tabtype].slides, tabtype);
};

/**
 * bind events for buttons in right container 
 * @method bindInnerEvent
 * @return 
 */
LessonView.bindInnerEvent = function(){
    /* start survey click event */	
    $('.start_survey').off("click tap").on("click tap",function(){	
		if(LessonView.disableOnPreview != ''){ return false;}
        
        LessonView.currentSlide = $('.swiper-slide-visible').attr('id'); 
		LessonView.dataSlideCount = $('.swiper-slide-visible').attr('data-slidecount');
		LessonView.slideHeight = $('.swiper-slide').height();
		LessonView.slideWidth = $('.swiper-slide').width();
        var start_survey_box = $('.swiper-slide-active .survey_box').attr('id');
        var end_survey_box = start_survey_box.replace('_send_survey','_end_survey');
        
        $('#'+start_survey_box).hide();
        $('#'+end_survey_box).show(); 
        var clone_survey = $('#'+end_survey_box).clone();
        $(clone_survey).addClass('end_survey_box');
        $('#slide_content').append(clone_survey);
        $('.swiper-container').hide();
        $('.bs_example_tabs').hide(); 
        $('.pagination').hide();
		
		$('.end_survey_box .bar_graph_cont').each(function() {			
			$(this).find('div').css({'width':'0px'});			
		});	
        
        LessonView.initTooltip();
        LessonView.bindEndSurvey();         
		
        var content = $('.end_survey_box .title_bg').text();
        var json_val = '{"survey":{"content":"<p>'+content+'</p>","answers":[';
        
        var cnt=0
        $('.end_survey_box .question_part li .ansdiv').each(function(){
            cnt++;            
            json_val += '{"answer_text_html":"'+$(this).text()+'","is_correct":false,"additional_information_html":"<p></p>"}';
            
            if(cnt < $('.end_survey_box .question_part li .ansdiv').length)
            {
                json_val += ',';
            }
        });
        
        json_val += '],"question_id":"'+$(this).data('quesid')+'"}}';
        
        json_val = json_val.replace(/"/g,"\\\"");
        
                
        SetSurvey(LessonView.lessonId, $(this).data('quesid'), 'Start',json_val);
		
		SetGoogleAnalytic($(this).data('verbid'), LessonView.lessonId);
		
		var avl_height = $('.content_space').height() - $('.end_survey_box').height() + 50;
		HideNativeBottomBar(true);
		setTimeout(function(){
			LessonView.resize();
		},500);		
		
		var actual_height = $('.end_survey_box .natural_box_space').height();
		$('.end_survey_box .natural_box_space').height(actual_height + avl_height);
        
    });   
       
     /* read book button click event */
    $('.read_book_bttn').off("click tap").on("click tap",function(){
		
		if (_.size(LessonView.bookPages) == 0) {
			return;
		}		
        $('.theme_content').css('overflow','hidden');
		DisableNativeBottomBar('true');
        $("#popup_container").empty().html(_.template($("#popupTemplate").html())).css('display','block');  
        
        /* put the slider template in the main template container */
        $("#pages_slider").empty().html(_.template($("#subSliderTemplate").html(),{"slides" : LessonView.bookPages, "mediaFolder" : $(this).data('media'), "parent_slide" : $(this).data('slide')}));
        
       LessonView.initPopupSwiper();
       LessonView.bindPopupEvent();
       setTimeout(function(){
        $('.md-modal .pagination').fadeIn('slow');
        LessonView.popupResize();
       },100);
		
		if (LessonView.disableOnPreview == '') {
			var broadcastRata = true;
			LessonView.setRataProjection(LESSON.c_s_PROJECT_START,'',broadcastRata);	
		}		
    });
    
    /* back to text button click */
    $('.back_txt_bttn').off("click tap").on("click tap",function(){
		if (_.size(LessonView.bookPages) == 0) {
			return;
		}
        $('.theme_content').css('overflow','hidden');
        $('.natural_box_space').css('overflow','hidden');
        DisableNativeBottomBar('true');
        $("#popup_container").empty().html(_.template($("#popupTemplate").html())).css('display','block');        
        /* put the slider template in the main template container */
        $("#pages_slider").empty().html(_.template($("#subSliderTemplate").html(),{"slides" : LessonView.bookPages, "mediaFolder" : $(this).data('media'), "parent_slide" : $(this).data('slide')}));
		
		var stop_key = $(this).attr('data-ratastartpoint');
		
		var parent_slide = $('.swiper-nested2 .swiper-slide[data-pageID="'+stop_key+'"]');
		var swipetopage = parent_slide.data('slidenum') - 1;        
         
       LessonView.initPopupSwiper();
       
       /* swipe to the last page where stop button was clicked */
       setTimeout(function(){           
        LessonView.myPopupSwiper.swipeTo(swipetopage, 100, false);
		if (LessonView.disableOnPreview == '') {
			var broadcastRata = true;
			LessonView.setRataProjection(LESSON.c_s_PROJECT_START,'',broadcastRata);
		}
       },200);
       
       LessonView.bindPopupEvent();
       setTimeout(function(){
        $('.md-modal .pagination').fadeIn('slow');
        LessonView.popupResize();
       },100);
        
    });
    
    /* project survey button click event */
    $('.start_project').off("click tap").on("click tap",function(){
		if(LessonView.disableOnPreview != ''){ return false;}
		
        if($(this).text() == 'Stop Project')
        {
            var action = LESSON.c_s_PROJECT_STOP;
            $(this).text('Project').removeClass('active');
        }
        else
        {
            var action = LESSON.c_s_PROJECT_START;
            $(this).text('Stop Project').addClass('active');
			
			$('.swiper-slide:not(.swiper-slide-visible) button.start_project').text('Project').removeClass('active');
			$('.swiper-slide:not(.swiper-slide-visible) button.project').text('Project').removeClass('active');
        }
        
        var content = $('.swiper-container .swiper-slide-active .survey_box .title_bg').html();
		content = content.replace(/"/g,"\\\"");
		
        var json_val = '{"survey":{"content":"<p>'+content+'</p>","answers":[';
        
        var cnt=0;		
        $('.swiper-container .swiper-slide-active .survey_box .question_part li .ansdiv').each(function(){
            cnt++;
			var ansTxt = $(this).html();
			ansTxt = ansTxt.replace(/"/g,"\\\"");
            json_val += '{"answer_text_html":"'+ansTxt+'","is_correct":false,"additional_information_html":"<p></p>"}';
            
            if(cnt < $('.swiper-container .swiper-slide-active .survey_box .question_part li .ansdiv').length)
            {
                json_val += ',';
            }
        });
        
        json_val += '],"question_id":"'+$(this).data('quesid')+'"}}';        
		
        //json_val = json_val.replace(/"/g,"\\\"");		
        
        LessonView.SetBroadcastRataFlag = false;
        SetProjectSlide('Survey', action, $(this).data('quesid'), encodeURIComponent(json_val));
		if (action == LESSON.c_s_PROJECT_START) {
			SetGoogleAnalytic(LESSON.c_s_PROJECT_START_VERBID, LessonView.lessonId);
		}
    });
            
    /* project image/video button click event */
    $('.project').off("click tap").on("click tap",function(){        
        if(LessonView.disableOnPreview != ''){ return false;}
		
        if($(this).text() == 'Stop Project') {
            var action = LESSON.c_s_PROJECT_STOP;            
			$(this).text('Project').removeClass('active');
			$(this).parent().parent().removeClass('active');
        }
        else {
            var action = LESSON.c_s_PROJECT_START;            
			$(this).text('Stop Project').addClass('active');
			$(this).parent().parent().addClass('active');
			
			$('.swiper-slide:not(.swiper-slide-visible) button.project').text('Project').removeClass('active');
			$('.swiper-slide:not(.swiper-slide-visible) button.start_project').text('Project').removeClass('active');
        }
		
        if(navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) {            
            var data_url = $(this).data('url');
        }
        else {            
            var data_url = $(this).data('url').replace(/\\/g, '\\\\'); 
        }
		
		LessonView.SetBroadcastRataFlag = false;
        SetProjectSlide($(this).data('type'), action, data_url,'');
		if (action == LESSON.c_s_PROJECT_START) {
			SetGoogleAnalytic(LESSON.c_s_PROJECT_START_VERBID, LessonView.lessonId);
		}
    });
	
	/* broadcast image button click event */
    $('.broadcast').off("click tap").on("click tap",function(){        
        if(LessonView.disableOnPreview != ''){ return false;}
		
        if($(this).text() == 'Stop Broadcast') {
            var action = 'Stop';            
			$(this).text('Broadcast').removeClass('active');
			$(this).parent().parent().removeClass('active');
        }
        else {
            var action = 'Start';            
			$(this).text('Stop Broadcast').addClass('active');
			$(this).parent().parent().addClass('active');
			
			$('.swiper-slide:not(.swiper-slide-visible) button.broadcast').text('Broadcast').removeClass('active');
        } 
        if(navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) {            
            var data_url = $(this).data('url');
        }
        else {            
            var data_url = $(this).data('url').replace(/\\/g, '\\\\'); 
        }
        SetBroadcastSlide($(this).data('type'), action, data_url);		
		
		if (action == 'Start') {
			SetGoogleAnalytic($(this).data('verbid'), LessonView.lessonId);
		}		
    });
        
    /* expand button click event */
    $('.expand').off("click tap").on("click tap",function(){
		if(LessonView.disableOnPreview != ''){ return false;}
		
        //$('.project').text('Project');
		if(navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) {            
            var data_url = $(this).data('url');
        }
        else
        {   
			if(navigator.userAgent.toLowerCase().indexOf("webview")>0)
			{
				var data_url = $(this).data('url').replace(/\\/g, '\\\\');
			}else{
				var data_url = $(this).data('url');
			}
        }
		SetExpandImage(data_url,$(this).data('type'));		
		
		SetGoogleAnalytic($(this).data('verbid'), LessonView.lessonId);
    });
    
};

/**
 * send RATA for projection
 * @method setRataProjection
 * @param {String} ActionType 
 * @param {String} MediaActionType
 * @param {String} broadcastRata
 * @return 
 */
LessonView.setRataProjection = function(ActionType, MediaActionType, broadcastRata){
	var ProjectItemType = LESSON.c_s_PROJECT_TEXTNAUDIO;	
	var slideId = $('.swiper-nested2 .swiper-slide-visible').data('slidenum');
	var QuestionInformation = JSON.stringify(LessonView.rataSlide[slideId].slide);	
	//QuestionInformation = QuestionInformation.replace(/"/g,"\\\""); 
	
	var audio_path = (typeof LessonView.rataSlide[slideId].audio_path != 'undefined' && 
	LessonView.rataSlide[slideId].audio_path != null) ? LessonView.rataSlide[slideId].audio_path : '';
	if(navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Android/i)) 
	{            
		var MediaID = audio_path;
	}
	else
	{           
		var MediaID = audio_path.replace(/\\/g, '\\\\'); 
	}
	var MediaFullURL = LessonView.rataSlide[slideId].audio_name;
	
	LessonView.SetBroadcastRataFlag = broadcastRata; 
	LessonView.SetBroadcastActionType = ActionType; 
	
	$('.swiper-slide:not(.swiper-slide-visible) button.start_project').text('Project').removeClass('active');
	$('.swiper-slide:not(.swiper-slide-visible) button.project').text('Project').removeClass('active');	
	SetProjectSlide(ProjectItemType, ActionType, MediaID, encodeURIComponent(QuestionInformation), MediaFullURL, MediaActionType);
};

/**
 * Broadcast RATA 
 * @method SetBroadcastRata
 * @return 
 */
LessonView.SetBroadcastRata = function() {	
	if (LessonView.SetBroadcastRataFlag == true) {
		var MediaType = LESSON.c_s_BROADCAST_EBOOK;
		var MediaID = LessonView.rataBookID;
		var QuestionInformation = '';
		var MediaActionType = '';
		var LibraryData = LessonView.model.LibraryData;
		var objBook = _.where(LibraryData.bookset[0], {book_id: LessonView.rataBookID})[0];
		var book_type = (objBook.book_type == 'R') ? "rata" : "time_to_read";
		var ActionType = LessonView.SetBroadcastActionType;
		var wordCount = (typeof objBook.word_count != 'undefined' && objBook.word_count != null && objBook.word_count != '') ? objBook.word_count : 0;
		var no_of_page = (typeof objBook.no_of_page != 'undefined' && objBook.no_of_page != null && objBook.no_of_page != '') ? objBook.no_of_page : 0;
		
		var MediaFullURL = "player.html#"+MediaID+"|||"+objBook.book_title+"|||"+book_type+"|||"+wordCount+"|||broadcast|||"+objBook.file_type+"|||"+no_of_page;		
		
		SetBroadcastSlide(MediaType, ActionType, MediaID, QuestionInformation, MediaFullURL, MediaActionType);
		$('.swiper-slide:not(.swiper-slide-visible) button.broadcast').text('Broadcast').removeClass('active');
			
		if (ActionType == 'Start') {
			SetGoogleAnalytic(LESSON.c_s_BROADACAST_SENT_VERBID, LessonView.lessonId);
		}
	}
};

/**
 * Bind Event for Elements in End Survey Screen 
 * @method bindEndSurvey
 * @return 
 */
LessonView.bindEndSurvey = function(){
    /* end survey click event */
    $('.end_survey_box .end_survey').off("click tap").on("click tap",function(){
        LessonView.currentSlide = '';
        var end_survey_box  = $('.end_survey_box').attr('id');
        var start_survey_box = end_survey_box.replace('_end_survey','_send_survey'); 
				
        $('.end_survey_box').remove();        
        $('#'+end_survey_box).hide();
		$('#'+start_survey_box).show();
        
		$('.bs_example_tabs').show();
		$('.pagination').show();
        $('.swiper-container').show();
        //$('.swiper-slide').height(LessonView.slideHeight);
		//$('.swiper-slide').width(LessonView.slideWidth);
        LessonView.resetResponse();
        
       var content = $('.swiper-slide-active .title_bg').text();
        var json_val = '{"survey":{"content":"<p>'+content+'</p>","answers":[';
        
        var cnt=0
        $('.swiper-slide-active .question_part li .ansdiv').each(function(){
            cnt++;
            
            json_val += '{"answer_text_html":"'+$(this).text()+'","is_correct":false,"additional_information_html":"<p></p>"}';
            
            if(cnt < $('.swiper-slide-active .question_part li .ansdiv').length)
            {
                json_val += ',';
            }
            
        });
        
        json_val += '],"question_id":"'+$(this).data('quesid')+'"}}';        
        json_val = json_val.replace(/"/g,"\\\"");       
        
        SetSurvey(LessonView.lessonId, $(this).data('quesid'), 'Stop',json_val);
		SetGoogleAnalytic(LESSON.c_s_SURVEY_FINISHED_VERBID, LessonView.lessonId);		
		HideNativeBottomBar(false);	
		
		setTimeout(function(){
			LessonView.resize();
			LessonView.swiperResize();
		},100);
    });
};

/**
 * Bind Event for Elements in RATA Popup 
 * @method bindPopupEvent
 * @return 
 */
LessonView.bindPopupEvent = function(){   
     
    setTimeout(function(){
        $('#popupAudio').attr('src',$(".md-modal .swiper-slide-visible .jp-play").parent().data('audio'));      
        $('#popupAudio')[0].pause();
     },500);
    
    $('.stopbttn').mousedown(function(){
        $(this).addClass('active');
    });
    
    $('.stopbttn').bind( "touchstart", function(){
        $(this).addClass('active');
        var obj = $(this);
        setTimeout(function(){            
            obj.removeClass('active');            
        },500);
    });     
   
        
    $('.stopbttn').off('click tap ' + sWindowsEventType).on('click tap ' + sWindowsEventType,function(){		
        $('.theme_content').css('overflow','auto');
        $('.natural_box_space').css('overflow','auto');
        DisableNativeBottomBar('false');
		
        //$(this).addClass('active');
        $('.md-modal .pagination').hide();
        //$("#jpId").jPlayer("pause");
        $('#popupAudio')[0].pause();        
        
		var stop_key = $(this).data('stoppointkey');                
        $('#popup_container').fadeOut('100', function(){
			var parent_slide = $('.swiper-nested1 .swiper-slide[data-slide-key="'+stop_key+'"]');
			var slidetopage = parent_slide.data('slidecount') - 1;			
			LessonView.mySwiper.swipeTo(slidetopage, 100, false);
        });
        
		if (LessonView.disableOnPreview == '') {
			var broadcastRata = true;
			LessonView.setRataProjection(LESSON.c_s_PROJECT_STOP, LESSON.c_s_MEDIA_ACTION_TYPE_STOP, broadcastRata);
		}
    });

    
    
    $('.jp-play').off('click tap').on('click tap', function(){
        $(this).hide();
        $(this).next().show();        
        $('#popupAudio')[0].play();
		if (LessonView.disableOnPreview == '') {
			var broadcastRata = false;
			LessonView.setRataProjection(LESSON.c_s_PROJECT_START, LESSON.c_s_MEDIA_ACTION_TYPE_PLAY, broadcastRata);
		}
    });
    
    $('.jp-pause').off('click tap').on('click tap',function(){
        $(this).hide();
        $(this).prev().addClass('replay').show();        
        $('#popupAudio')[0].pause();
		if (LessonView.disableOnPreview == '') {
			var broadcastRata = false;
			LessonView.setRataProjection(LESSON.c_s_PROJECT_START, LESSON.c_s_MEDIA_ACTION_TYPE_PAUSE, broadcastRata);
		}
    });
	
	/* ILIT-974 */
	//pause audio once played 
	$('#popupAudio')[0].addEventListener('ended',function() { 
			$(this).hide();
			$(this).prev().addClass('replay').show();        
			$('#popupAudio')[0].pause();
			if (LessonView.disableOnPreview == '') {
				var broadcastRata = false;
				LessonView.setRataProjection(LESSON.c_s_PROJECT_START, LESSON.c_s_MEDIA_ACTION_TYPE_PAUSE, broadcastRata);
			}
	},false);
	
};

/** 
 * Retrieve Data from JSON 
 * @method getData
 * @param : {Object} slideModelData
 * @param : {String} currentTab 
 * @return  
 */
LessonView.getData = function(slideModelData, currentTab){
     
    var cnt = 0,
		isConferencing = 0,
		innerHTML = "";
		
	LessonView.aConferenceTypes = [];	
	LessonView.sConferenceType = '';	
	$.each(slideModelData, function(j,data){        
        cnt++;
		var slide_id = "slide_" + j;                 
		if (data.metadata != null && data.metadata !== undefined && data.metadata.length !=0) {
                                   
        var obj = _.where(data.metadata, {
            "key" : "type"
        });
        var type = obj[0].keyValue;
        	
		var objTitle = _.where(data.metadata, {
			"key" : "page_title"
		});
		var page_title = (objTitle.length)?objTitle[0].keyValue:'';
		
		var objSlideId = _.where(data.metadata, {
			"key" : "_id"
		});
		var slide_key_id = (objSlideId.length)?objSlideId[0].keyValue:'';

		var objConference = _.where(data.metadata, {
			"key" : "conference_type"
		});
		conference_type = (objConference.length)?objConference[0].keyValue:'';
		
		if (conference_type != '') {
			LessonView.aConferenceTypes.push({"slideId": slide_id, "conferenceType": conference_type});
			if (isConferencing != 1) {
				isConferencing =1;
			}
		}
			
		if(type == 'textslide' || type == 'bookslide'){
				 
			var objDesc = _.where(data.metadata, {
				"key" : "text_html"
			});
			var description = (objDesc.length)?objDesc[0].keyValue:'';
		}else if(type == 'projectorslide'){
			var objDesc = _.where(data.metadata, {
				"key" : "above_text_html"
			});
			var description = (objDesc.length)?objDesc[0].keyValue:'';
		}else if(type == 'pollslide'){
			var objDesc = _.where(data.metadata, {
				"key" : "instruction"
			});
			var description = (objDesc.length)?objDesc[0].keyValue:'';
		}
		
		var objDescBelow = _.where(data.metadata, {
			"key" : "instructor_text_below"
		});		
		var below_description = (objDescBelow.length)?objDescBelow[0].keyValue:'';		

		var icons = new Array(); 
		var i=0;		
		
		$.each(LESSON.c_s_ICONS, function(key,lbl){
			var label = (oPlatform.isBrowser()) ? lbl.replace('.png','1x.png') : lbl;
			var objTip = _.where(data.metadata, {
				"key" : key
			}); 
			if(objTip.length)
			{
				i++;
				var bigFont = (key == 'app_tip')?'bigFont':''
				icons[i] = {
					"label":label, 
					"text":objTip[0].keyValue, 
					"bigFont":bigFont
				};
			}
		
		}); 
		
		var bttns = new Array(); 
		var i=0;
		$.each(LESSON.c_s_BUTTONS, function(key,text){       
			var objBttn = _.where(data.metadata, {
				"key" : key
			}); 
			var objBttnTxt = _.where(data.metadata, {
				"key" : text
			});
			if(objBttn.length && objBttnTxt.length)
			{
				i++;
				bttns[i] = {
					"label":objBttn[0].keyValue, 
					"text":objBttnTxt[0].keyValue
					};
			}    
			if (bttns.length == 5) {
				return false;
			}
		});
		
		var objImage = _.where(data.metadata, {
			"key" : "image"
		});
		var images = new Array();
		if(_.size(objImage) > 0){
			$.each(objImage, function(key, img){        
				images[key] = (objImage.length)?img.keyValue:''; 
			});  
		}
		var objProImg = _.where(data.metadata, {
			"key" : "projector_image"
		});
		var proj_image = (objProImg.length)?objProImg[0].keyValue:'';
		//var proj_image = (objImage.length)?objImage[0].keyValue:'';
		
		var objVideo = _.where(data.metadata, {
			"key" : "video"
		});
		var videos = new Array();
		if(_.size(objVideo) > 0){
			$.each(objVideo, function(key, video){        
				videos[key] = (objVideo.length)?video.keyValue:''; 
			});
		}
		var objMediaFldr = _.where(data.metadata, {
			"key" : "_id"
		});
		var mediaFolder = (objMediaFldr.length)?objMediaFldr[0].keyValue:''; 
		
		var objWord = _.where(data.metadata, {
			"key" : "word"
		});
		var word = (objWord.length)?objWord[0].keyValue:'';
		
		var objQuestion = _.where(data.metadata, {
			"key" : "questions"
		});
		var questions = (objQuestion.length) ? objQuestion[0].keyValue: '';   
		
		var objRataCoverName = _.where(data.metadata, {
			"key" : "rata_cover_name"
		});
		var rataCoverImg = (objRataCoverName.length) ? objRataCoverName[0].keyValue: '';
		
		var objRataStartPoint = _.where(data.metadata, {
			"key" : "rata_start_point"
		});
		var rataStartPoint = (objRataStartPoint.length) ? objRataStartPoint[0].keyValue: '';
		
		var objRataBookID = _.where(data.metadata, {
			"key" : "rata_book"
		});
		var rataBookID = (objRataBookID.length) ? objRataBookID[0].keyValue: '';
		
		var objSiNote = _.where(data.metadata, {
			"key" : "si_note"
		});
		var siNote = (objSiNote.length) ? objSiNote[0].keyValue: '';
			
		
		if(rataCoverImg == 'rata_cover_image')
		{        
		   /* retrieve the book templates slides */
		   var pages = {};
		   if (typeof LessonView.model.LessonData.activities[currentTab].passages != 'undefined') {		   
				$.each(LessonView.model.LessonData.activities[currentTab].passages, function(j,page){					
					pages[j] = [];
					var objBeforeStop = _.where(page.metadata, {
						"key" : "before_stop_point_text"
					});
					var before_stop_point_text = (objBeforeStop.length) ? objBeforeStop[0].keyValue: '';
					
					var objAfterStop = _.where(page.metadata, {
						"key" : "after_stop_point_text"
					});
					var after_stop_point_text = (objAfterStop.length) ? objAfterStop[0].keyValue: '';            
					
					var objAudio = _.where(page.metadata, {
						"key" : "audio_file"
					});
					var audio_file = (objAudio.length) ? objAudio[0].keyValue: '';
					
					var objStopPoint = _.where(page.metadata, {
						"key" : "stop_point"
					});
					var stop_point_key = (objStopPoint.length) ? objStopPoint[0].keyValue: '';
					
					var objPageID = _.where(page.metadata, {
						"key" : "_id"
					});
					var page_ID = (objPageID.length) ? objPageID[0].keyValue: '';
					
					pages[j] = {
						"before_stop_point_text" : before_stop_point_text,
						"audio_file" : audio_file,
						"after_stop_point_text" : after_stop_point_text,
						"stop_point_key" : stop_point_key,
						"page_ID" : page_ID
					};
						
				}); 
			}
			LessonView.bookPages = pages;			
			LessonView.rataBookID = rataBookID;			
		}
		
		var result = {
			"page_title" : page_title, 
			"description" : description, 
			"below_description" : below_description,
			"icons" : icons, 
			"bttns" : bttns, 
			"images" : images, 
			"proj_image" : proj_image, 
			"videos" : videos, 
			"mediaFolder" : mediaFolder, 
			"word" : word, 
			"questions" : questions,
			"currentTab" : currentTab,
			"slide_id" : slide_id,
			"rataCoverImg" : rataCoverImg,
			"rataStartPoint" : rataStartPoint,
			"rataBookID" : rataBookID,
			"siNote" : siNote,
            "lessonId" : LessonView.lessonId,
			"conference_type" : conference_type
		};
		
		LessonView.sConferenceType = (conference_type != '') ? conference_type : LessonView.sConferenceType;
		
		innerHTML += '<div class="swiper-slide" id="'+slide_id+'" data-slide-key="'+slide_key_id+'" data-slidecount="'+cnt+'"><div class="swiper-padding-right swiper-padding-left">';
		
		type = (type == "bookslide") ? 'textslide' : type;
		innerHTML += _.template($("#"+type+"Template").html(), {
			data: result,itemDisplayName : LessonView.model.LessonData.itemDisplayName
		})
		innerHTML += '</div></div>';
		}
    });
	$("#slide_content .swiper-nested1 .swiper-wrapper").append(innerHTML);
	$.when(LessonView.getData).done(LessonView.bindInnerEvent, LessonView.initSwiper,LessonView.resize);
	
	// IPP - 3686
	if(
		isConferencing == 1 && 
		(
			objLessonJsonData.lessonType == "lesson" || 
			typeof objLessonJsonData.lessonType == "undefined" || 
			objLessonJsonData.lessonType == "undefined"
		)
	){
		// first time on tab change show loader in all slides
		var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"></div>';
		$('.studentlist').css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(loaderImg);
		
		LessonView.initConference();		
	}
};

/**
 * Initiate Conference 
 * @method getStudentRelatedData
 * @return 
 */
LessonView.initConference = function() {
	var sUnitsWeeksDetails = (objLessonJsonData.UnitsWeeksDetails) ? objLessonJsonData.UnitsWeeksDetails : "";
	
	LessonView.sConferenceType = LessonView.aConferenceTypes[0].conferenceType;
	LessonView.sSlideId = LessonView.aConferenceTypes[0].slideId;
	
	// on refresh or for next slide data loading show loader in that particular slide only
	var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"></div>';
	$('#' + LessonView.sSlideId + ' .studentlist').css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(loaderImg);	
	
	var oConference = new ConferenceView(LessonView.model, sUnitsWeeksDetails);
	oConference.init();
}

/**
 * Retrieve Student Data 
 * @method getStudentRelatedData
 * @return 
 */
LessonView.getStudentRelatedData = function(){
	var oSelf = this;
	var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"></div>';
	$('.studentlist').css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(loaderImg);
	
	/* objPerformanceInfoJsonData = {
		rootFolderPath:'/path/to/curricullam',
		gradeId:8,
		mediaPath:'',
		jsPath:'assignment-content/ilit/curriculum/gr8/performance_info.js'
	}; */
	GetStudentListInfo();
	setTimeout(function() {
		oSelf.scheduleStudentDataCheck();
	}, 200);
	//oSelf.scheduleStudentDataCheck();
};

/**
 * Get Student List
 * @method scheduleStudentDataCheck
 * @return 
 */
LessonView.scheduleStudentDataCheck = function() {
    
	if (objStudentListJsonData != null) {
		if (objStudentListJsonData.Status == "200") {
			//GetListOfConferenceStudentData(objLessonJsonData.itemId);
			GetListOfConferenceStudentData(LessonView.sConferenceType);
			setTimeout(function() {
			LessonView.studentConferenceListDataCheck();
			}, 200);
	} else {
		if (objStudentListJsonData.Error.ErrorCode != 'U1065') {
			//alert(objStudentListJsonData.Error.ErrorUserDescription);
		}
	}
	} else {
		setTimeout(LessonView.scheduleStudentDataCheck, 100);
	}
};
				
/**
 * Get  Student ConferenceList Data from GetConferenceStudentData
 * @method studentConferenceListDataCheck
 * @return 
 */
LessonView.studentConferenceListDataCheck = function() {
	if (objconferenceListStudentData != null) {
	    try{
			if(parseInt(objconferenceListStudentData.Status) == 200){
				GetAssignmentListInfo(objLessonJsonData.unitNumber);
				setTimeout(function() {
						LessonView.assignmentListCheck();
					}, 200);
			}
			else {
				throw(objconferenceListStudentData.Error);
			}
		}catch(exp){
				if (exp.ErrorCode != "U1065") {
					LessonView._alert({
						divId:		'dialog-message',
						message:	exp.ErrorUserDescription
					});
				}
		}
	} 
	else {
		setTimeout(function() {
		LessonView.studentConferenceListDataCheck();
		}, 500);
	}
};
				
/**
 * Get Assignment List from GetGradableItemForInstructor
 * @method assignmentListCheck
 * @return 
 */
LessonView.assignmentListCheck = function() {
	
	if (objAssignmentListJsonData != null) {
		try{
			if (objAssignmentListJsonData.Status == "200") {
				if(objLessonJsonData.hasOwnProperty('serviceVersion') && objLessonJsonData.serviceVersion == "v2"){
					GetGradebookForInstructorV2("Unit", objLessonJsonData.unitNumber, false, null);
					setTimeout(function() {
						LessonView.gradeBookAttemtDataCheck();
					}, 200);
				}else{
					GetGradeBookInfo("Unit", objLessonJsonData.unitNumber, true);
					setTimeout(function() {
						LessonView.gradeBookCheck();
					}, 200);
				}
			}
			else {
				throw(objconferenceListStudentData.Error);
			}
		}
		catch(exp){
				if (exp.ErrorCode != "U1065") {
					LessonView._alert({
						divId:		'dialog-message',
						message:	exp.ErrorUserDescription
					});
				}
		
		}
	} 
	else {
		setTimeout(function() {
			LessonView.assignmentListCheck();
		}, 500);
	}
};

/**
 * Get Assigned AttemtData List
 * @method gradeBookAttemtDataCheck
 * @return 
 */
 
 LessonView.gradeBookAttemtDataCheck = function() {
	var oSelf = this;
	if (objGradeBookV2JsonData != 0) { 
			try {
				if(parseInt(objGradeBookV2JsonData.Status) == 200){ 
					if(LessonView.oAttemptInfo ==  null){
						LessonView.checkForAlldAttemptIds(objGradeBookV2JsonData.Content);
						//alert(333);
					}else{
						LessonView.checkForUpdatedAttemptIds(objGradeBookV2JsonData.Content);	
					} 
					setTimeout( function() {
						//alert(111);
						if(objGradeBookJsonData != 0) {
							//console.log(objGradeBookV2JsonData);
							if(oPlatform.isWindows()) {
								var finalData = [];
								for(var iIdx = 0; iIdx < objGradeBookJsonData.Content.length; iIdx++) {
									var oItem = objGradeBookJsonData.Content[iIdx];
									finalData.push(JSON.parse(oItem));
								}
								objGradeBookJsonData.Content = finalData;
							}
							
							try {
									aMasterData = [];
									for (var iIdx = 0; iIdx < objGradeBookJsonData.Content.length; iIdx++) {

										var oItem = objGradeBookJsonData.Content[iIdx];
										var oData = {},
											sAttemptData = _.where(objGradeBookJsonData.Content, {IAID: oItem['IAID']});
											if (sAttemptData.length > 0) {
												oAttemptData = sAttemptData.first();
												oData['StudentId'] =		oAttemptData['SID'];
												oData['AssignedItemID'] =		oItem['IID'];
												oData['ItemDisplayName'] =		oAttemptData['IDN'];
												oData['ItemSubject'] =	null;
												oData['ItemUnitNumber'] =	oAttemptData['IUN'];
												oData['ItemWeekNumber'] =	oAttemptData['IWN'];
												oData['ItemLessonNumber'] =	oAttemptData['ILN'];
												oData['ItemCompletionStatus'] =	oAttemptData['ICS'];
												oData['ItemAttemptDataSummary'] =	oAttemptData['IADS'];
												oData['FinalScore'] =	oAttemptData['FS'];
												oData['SystemScore'] =	oAttemptData['SS'];
												oData['InstructorScoreData'] =	oAttemptData['IS'];
												oData['ItemMaxScore'] =	oAttemptData['IMS'];
												oData['ReAssignCount'] =	oAttemptData['RAC'];
												oData['Comment'] =	oAttemptData['Cmt'];
												oData['ItemType'] =	oAttemptData['IT'];
												oData['ItemSubType'] =	oAttemptData['IST'];
												LessonView.agradebookData.push(oData);
												
											}
									}
								//}
							}
							catch(exp){
						
							}
						}
					},2000);
					LessonView.gradeBookCheck();
					
				} else {
					//throw(objNoteBookData.Error.ErrorUserDescription);
				}
			}catch(exp){}
			
			}else {
					setTimeout(LessonView.gradeBookAttemtDataCheck, 100);
			}
};
		
/**
 * Get Assigned Assignment List
 * @method gradeBookCheck
 * @return 
 */
LessonView.gradeBookCheck = function() {
	if (objGradeBookJsonData != 0) {
		loadJS("js/"+fetchGradeCode(objLessonJsonData.gradeId)+"_performance_info.js", LessonView.performanceInfoJsLoaded);
		/* GetPerformanceInfo();
		setTimeout(function() {
			LessonView.performanceInfoCheck();
		}, 200); */
	}
	else {
		setTimeout(LessonView.gradeBookCheck, 100);
	}
};
				
/**
 * Get Assignment Group Js File Path
 * @method performanceInfoCheck
 * @return 
 
LessonView.performanceInfoCheck = function() { 
	if (objPerformanceInfoJsonData != null) {
		loadJS(objPerformanceInfoJsonData.jsPath, LessonView.performanceInfoJsLoaded);
	}
	else {
		setTimeout(LessonView.performanceInfoCheck, 500);
	}
};*/
				
/**
 * Check Assignment Group Js Content loaded or not 
 * @method performanceInfoJsLoaded NO MORE IN USE. CHECK IN lesson-conference.js
 * @return 
 */
LessonView.performanceInfoJsLoaded =  function () {  
	if (objPerformanceInfoData != null) {
		LessonView.model.StudentData = objStudentListJsonData.Content;
		LessonView.model.conferenceListStudentData = objconferenceListStudentData;
		LessonView.model.assignmentListData = objAssignmentListJsonData.Content;
		if(objLessonJsonData.hasOwnProperty('serviceVersion') && objLessonJsonData.serviceVersion == "v2"){
			LessonView.model.gradeBookData = (LessonView.agradebookData.length == 0) ? 0: LessonView.agradebookData;
		}else{
			LessonView.model.gradeBookData = (objGradeBookJsonData == 0) ? 0: objGradeBookJsonData.Content;
		}
		LessonView.model.performanceInfoData =  objPerformanceInfoData;
		LessonView.model.LibraryData = objBookList;
		
		writingBenchmarkIndex = "";
		iwtBenchmarkIndex = "";
	
		LessonView.filterScoredData();
	
		// get Benchmarks data
		if( LessonView.model.performanceInfoData.groups != null && LessonView.model.performanceInfoData.groups != undefined) {
			var performanceGroupData = _.sortBy(LessonView.model.performanceInfoData.groups, "displayOrder");
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
		LessonView.prepareStudentList();
	} 
};

/**
 * Prepare Student List 
 * @method prepareStudentList NO MORE IN USE. CHECK IN lesson-conference.js
 * @return 
 */
LessonView.prepareStudentList = function () { 
	studentData = LessonView.model.StudentData;
	
	if(LessonView.model.conferenceListStudentData.Content == null){
		studentData.sort(function() {return 0.5 - Math.random()});
	}
	$('.studentlist').each(function(){
		var studentlistarea = $(this).attr('id');
		var conference_type = $(this).attr('conference_type');
		//conferencing should only include students that are logged in
		//if(conference_type == "time_to_read") {
			studentData = _.where(studentData, {"UserInLiveSession" : true});
		//}		
		
		if(LessonView.model.conferenceListStudentData.Content != null && conference_type == "classroom_conversations") {			
			studentData = LessonView.filterLeastConferenceData(studentData);
		}
		
		if(conference_type !=''){
			LessonView.filterConferenceData(LessonView.lessonId,conference_type);
			if(conference_type == 'assignment'){
				// No repetition from previous conference in current week (should be shown on tht particluar lesson)
				if($.inArray(LessonView.lessonId, LessonView.conferenceLessons) == -1){
					$.each(filterStudentList,function(i,studentId){
						studentData = _.without(studentData, _.findWhere(studentData, {UserID: studentId}));
					});
				}
				// show students who has low writing scores
				if(filtersmallGroupStudentList.length != 0) {
					studentData =_.filter(studentData, function(a){
						return _.find(filtersmallGroupStudentList, function(b){
						return b === a.UserID;
						});
					});
				}
			}
			if(conference_type == 'strategy'){
				// show students who has low iwt marks
				if(filterReadingStragyStudentList.length != 0) {
					studentData =_.filter(studentData, function(a){			
						return _.find(filterReadingStragyStudentList, function(b){
						return b === a.UserID;
						});
					});
				}
			}
			if(conference_type == 'individuals'){
				// show students with most pending assignments in last 2 weeks
				if(filterIndividualStudentList.length != 0) {
					studentData =_.filter(studentData, function(a){			
						return _.find(filterIndividualStudentList, function(b){
						return b === a.UserID;
						});
					});
				}
			}
		}
		data = { 
			'slide_id' : $(this).attr('slide_id'),
			'conference_type': conference_type,
			'lessonId' : $(this).attr('lessonId')
		};
		itemDisplayName = $(this).attr('itemdisplayname');
		
		$("#" + studentlistarea).css({'text-align':'', 'top' : '', 'left': ''});
		$("#" + studentlistarea).empty().html(_.template($("#studentlistTemplate").html(),
		{
			"StudentData" : studentData,
			'data' : data, 
			'itemdisplayname' :  
			itemDisplayName
		}
		));
		LessonView.bindStudentListEvents(data);
	});
	
};

/**
 * Get Minimum Marks
 * @method getMinimumMarks
 * @param {String} benchmarkindex 
 * @return 
 */
LessonView.getMinimumMarks = function(benchmarkindex) {

	var tempArr = benchmarkindex.toString().split("_"); 	
	dataBenchmark = "";
	if(tempArr.length == 3) {
		var idx1 = tempArr[0], 
			idx2 = tempArr[1], 
			idx3 = tempArr[2];
		dataBenchmark = LessonView.model.performanceInfoData.groups[idx1].subgroup[idx2].subgroup[idx3].benchmark;
	} else if(tempArr.length == 2) {
		var idx1 = tempArr[0], 
			idx2 = tempArr[1];
		dataBenchmark = LessonView.model.performanceInfoData.groups[idx1].subgroup[idx2].benchmark;
	} else {
		var idx1 = tempArr[0];
		dataBenchmark = LessonView.model.performanceInfoData.groups[idx1].benchmark;
	}
};

/**
 * Filter Conference Data
 * @method filterConferenceData NO MORE IN USE. CHECK IN lesson-conference.js
 * @param {String} lessonId 
 * @param {String} ConferenceType
 * @return 
 */
LessonView.filterConferenceData = function(lessonId,ConferenceType){
	var aConfData = [],
		iWeekNumber = '';
	
	filterStudentList = [];
	filterReadingStragyStudentList = [];
	filtersmallGroupStudentList = [];
	filterIndividualStudentList = [];
	LessonView.conferenceLessons = [];
	if(LessonView.model.conferenceListStudentData.Content != null){ 
		try{				
					
				var filterLessonData =  LessonView.model.conferenceListStudentData.Content;
				$.each(filterLessonData,function(i,data){
				  // 1. time to read
				   if((ConferenceType !='') && (ConferenceType == LESSON_TAB_VIEW[0].c_s_TABTYPE)){
						filterData = data;
						if(!(_.isEmpty(filterData))){
							if($.inArray(filterData.studentId, filterStudentList) == -1){
								filterStudentList.push(filterData.studentId);
							}
						}
					}
					// 2. Daily assignment small group
					else if((ConferenceType !='') && (ConferenceType == 'assignment')){				        
				        filterData = data;												
						if (!(_.isEmpty(filterData))) {							
							// No repetition from previous conference in current week							
							aConfData = filterData.ConferenceLessonName.split(',');
							iWeekNumber = aConfData[1].replace('Lesson','').trim();							
							
							if (iWeekNumber == objLessonJsonData.weekNumber){
								filterStudentList.push(filterData.studentId);
								if($.inArray(data.ItemID, LessonView.conferenceLessons) == -1){
									LessonView.conferenceLessons.push(data.ItemID);
								}
							}
						}
						
						// find student who low writing scores from last week
						aWeekRange = [];
						firstWeek = (objLessonJsonData.weekNumber-2) < 0 ? 1 :  (objLessonJsonData.weekNumber-2);
						lastWeek  = (objLessonJsonData.weekNumber-1) < 0 ? 1 :  (objLessonJsonData.weekNumber-1);
						aWeekRange = _.range(firstWeek, lastWeek);
							
						aMasterScoredData = oUtility.filterByRange(aMasterScoredData, aWeekRange, 'WeekNumber');	
						
						$.each(aMasterScoredData,function(i,v){
									if(typeof v.ItemSubType != 'undefined' && ((v.ItemSubType == 'paragraph') || (v.ItemSubType == 'essay'))){
										studentPercentage = (v.FinalScore/v.ItemMaxScore)*100;
										LessonView.getMinimumMarks(writingBenchmarkIndex);
										if(studentPercentage < Object.keys(dataBenchmark)[0]){				
											filtersmallGroupStudentList.push(v.StudentId);
										}
									}
							});
					}
					
					// 3.Reading Strategy whole group
					else if((ConferenceType !='') && (ConferenceType == 'strategy')){
				        filterData = data;						
						if(!(_.isEmpty(filterData))){
							// find Low IWT scores student from last week
							$.each(aMasterScoredData,function(i,v){ 
									if(typeof v.ItemSubType != 'undefined' && v.ItemSubType == 'iwt'){
										studentPercentage = (v.FinalScore/v.ItemMaxScore)*100;
										LessonView.getMinimumMarks(iwtBenchmarkIndex);
										if(studentPercentage < Object.keys(dataBenchmark)[0]){				
											filterReadingStragyStudentList.push(v.StudentId);
										}
									}
							});							
						}
					}
					// 4. Conferencing with individuals
					else if((ConferenceType !='') && (ConferenceType == 'individuals')){				        
				        filterData = data;						
						if(!(_.isEmpty(filterData))){
						    // No repetition from previous conference in current week
							aConfData = filterData.ConferenceLessonName.split(',');
							iWeekNumber = aConfData[1].replace('Lesson','').trim();
							
							if(iWeekNumber == objLessonJsonData.weekNumber){								
								filterStudentList.push(filterData.studentId);
							}
							// find student with most pending assignments in last 2 weeks
							aWeekRange = [];
							firstWeek = (objLessonJsonData.weekNumber-2) < 0 ? 1 :  (objLessonJsonData.weekNumber-2);
							lastWeek  = (objLessonJsonData.weekNumber-1) < 0 ? 1 :  (objLessonJsonData.weekNumber-1);
							
						    aWeekRange = _.range(firstWeek, lastWeek, 1);
							
							aMasterInprogressData = oUtility.filterByRange(aMasterInprogressData, aWeekRange, 'WeekNumber');
							$.each(aMasterInprogressData,function(i,v){
								filterIndividualStudentList.push(v.StudentId);
							});							
						}
					}					
				});
				
			}catch(e){
				//filterStudentList =[];
		}	
	}
};


/**
 * Filter Students Who are least Conferenced
 * @method filterLeastConferenceData NO MORE IN USE. CHECK IN lesson-conference.js
 * @return 
 */
LessonView.filterLeastConferenceData = function(studentData){
	var filterStudentId = [],
		oNewStudentData = [];	
	
	studentData = _.where(studentData, {"UserRole" : "S"});
	
	if(LessonView.model.conferenceListStudentData.Content != null){ 
		try{
					
				var filterLessonData =  LessonView.model.conferenceListStudentData.Content;
					filterStudentId = _.pluck(filterLessonData, 'studentId');
					
				/* $.each(filterLessonData,function(i,data){
					filterData = JSON.parse(data.ConferenceData);					
					// 1. time to read				   
					 if(!(_.isEmpty(filterData.time_to_read))){						    
						filterStudentId.push(filterData.time_to_read.studentId);							
					} 					
					// 2. Daily assignment small group					
					if(!(_.isEmpty(filterData.assignment))){
						filterStudentId.push(filterData.assignment.studentId);
					}					
					// 3.Reading Strategy whole group					
					if(!(_.isEmpty(filterData.strategy))){	
						filterStudentId.push(filterData.strategy.studentId);						
					}					
					// 4. Conferencing with individuals
					if(!(_.isEmpty(filterData.individuals))){
						filterStudentId.push(filterData.individuals.studentId);											
					}					
					// 5. Conferencing with classroom_conversations
					if(!(_.isEmpty(filterData.classroom_conversations))){
						filterStudentId.push(filterData.classroom_conversations.studentId);												
					}
				});*/				
				
				filterStudentId = filterStudentId.sort();
				var preVal = null,
					cnt = 0,
					oStudentData = {},
					i = 0;	
				
				/* count students conference and make a list of students & their conference count */
				$.each(filterStudentId, function(key,val){					
					preVal = (preVal == null)? val: preVal;
					if (preVal == val) {						
						cnt++;
					}
					
					// reached end
					if (key >= filterStudentId.length - 1) {						
						oStudentData[i] = {"studentId" : preVal, "count" : cnt};						
						
						// previous value doesn't match
						if (preVal != val) {
							oStudentData[++i] = {"studentId" : val, "count" : 1};
						}
					}
					// previous value doesn't match
					else if (preVal != val) {						
						oStudentData[i] = {"studentId" : preVal, "count" : cnt};						
						i++;
						preVal = val;
						cnt = 1;
					}
				});	
				
				/* search if any student who has not conferenced even once, then add him to the list as well */
				for (var j=0; j < studentData.length; j++) {				
					if($.inArray(studentData[j].UserID, filterStudentId) == -1){
						i = _.size(oStudentData);
						oStudentData[i] = {"studentId" : studentData[j].UserID, "count" : 0};
						i++;
					}					
				}
				
				// sort by least count value
				oStudentData = _.sortBy(oStudentData, 'count');								
				
				/* filter student who are online */
				$.each(oStudentData, function(key,val){
					studID = (_.where(studentData, {"UserID" : val.studentId}))[0];
					if (typeof studID !== 'undefined') {
						oNewStudentData.push(studID);
					}
				});				
				
				return oNewStudentData;
				
			}catch(e){
				return studentData;
				//filterStudentId =[];
		}	
	}
};

/*
*  checkForAlldAttemptIds : Used for getting all attempt id and revision ids
*  NO MORE IN USE. CHECK IN lesson-conference.js
*/
LessonView.checkForAlldAttemptIds = function(oData){	
	var aItemAttemptIds = [];
	
	aItemAttemptIds = _.map(oData.GradeBookData, function (obj) {			
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});
	LessonView.oAttemptInfo = aItemAttemptIds;	
	GetGradebookAttemptData(aItemAttemptIds);	
}
/*
*  checkForUpdatedAttemptIds : Used for checking if any attempt id added or its revision id changed or not
*	NO MORE IN USE. CHECK IN lesson-conference.js
*/
LessonView.checkForUpdatedAttemptIds = function(oData){
	var oSelf = this,	
		aItemAttemptIds = [],
		aFilteredAttemptIds	= [];
	
	aItemAttemptIds = _.map(oData.GradeBookData, function (obj) {			
			return {
				IAID: obj.IAID,
				ARID: obj.ARID
			};
		});		 
	
	
	for(var i = 0; i < aItemAttemptIds.length; i++) {		
			
		var aRevId	=	_.where(LessonView.oAttemptInfo, {IAID: aItemAttemptIds[i].IAID});				
		var revId	=	(aRevId.length == 0) ? '' : aRevId[0].ARID;
		
		if(revId === '') {	//	New Entry					
			LessonView.oAttemptInfo.push(aItemAttemptIds[i]);
			if (typeof aItemAttemptIds[i] != 'undefined' && aItemAttemptIds[i] != '' && _.size(aItemAttemptIds[i]) != 0) {
				aFilteredAttemptIds.push(aItemAttemptIds[i]);
			}
		} else if(revId != aItemAttemptIds[i].ARID) {	//	Exists but Updated					
			if (typeof aItemAttemptIds[i] != 'undefined' && aItemAttemptIds[i] != '' && _.size(aItemAttemptIds[i]) != 0) {
				aFilteredAttemptIds.push(aItemAttemptIds[i]);	
			}
			LessonView.oAttemptInfo = _.reject(LessonView.oAttemptInfo, function(obj){ return obj.IAID == aItemAttemptIds[i].IAID; });					
			LessonView.oAttemptInfo.push(aItemAttemptIds[i]);					
		}
	}
	
	// native call	
	GetGradebookAttemptData(aFilteredAttemptIds);	
}


/**
 * Bind Events for Student List
 * @method bindStudentListEvents NO MORE IN USE. CHECK IN lesson-conference.js
 * @param {String} data  
 * @return 
 */
LessonView.bindStudentListEvents = function(data){
	studentlilist = [];
	$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_EDIT_BTN+'_]').off("click tap").on("click tap", function(){
		//var editpart = $(this).attr('id').split("_");
		//$("#" +LESSON.c_s_CONFERENCE_STUDENTLIST+"_"+editpart[1]+"_"+editpart[2]).show();
		//$("." + LESSON.c_s_MAIN_WRAPPER_CLASS).append('<div class="'+LESSON.c_s_OVERLAY_CLASS+'"></div>');
		
		$('.student_box').each(function(){
			if ($("#"+$(this).attr('student_id')).is(":visible")){
				studentlilist.push($(this).attr('student_id'));
		   }
		});
		$("#" +LESSON.c_s_STUDENTLIST_POPUP_AREA).empty().html(
			_.template($("#studentlistPopupTemplate").html(),
				{
					'StudentData': studentData,
					'data' : data,
					'studentselectedlist' : studentlilist
				}
			)
		);
		$("." + LESSON.c_s_MAIN_WRAPPER_CLASS).append('<div class="'+LESSON.c_s_OVERLAY_CLASS+'"></div>');
		
		/* student select click event */
		$('.tooltip_wrap_language ul li').off("click tap").on("click tap", function(){
			var studentId = $(this).attr('student_id');
			$("#" + studentId).toggle();
			$(this).toggleClass('active');
			if($(this).hasClass('active')){ 
			      if ($("#"+$(this).attr('student_id')).is(":visible") == false) {
						var userName   = ($(this).text().replace(/<\/?span[^>]*>/g,""));
						var itemdisplayName = $('.student_box').eq(0).attr('itemdisplayname');
						var conferenceType =  $('.student_box').eq(0).attr('conference-type');
						var studentStr = '<div id="'+$(this).attr('student_id')+'" class="student_view_box">';
						studentStr     += '<div current_cur_reading_level="2" current_cur_reading_bookid="" lesson_id="'+LessonView.model.LessonData.lessionId+'" itemdisplayname="'+itemdisplayName+'" student_id="'+$(this).attr('student_id')+'" student_name="'+encodeURIComponent(userName)+'" conference-type="'+conferenceType+'" class="student_box">';
						studentStr     += '<img src="media/student_img3.png" alt=""></div>';
					    studentStr     +='<div class="student_view_name">'+userName+'</div>';
				        studentStr     +='</div>';
						$(".student_grid_view_inner").append(studentStr);
				}
			}
			LessonView.gotoConferenceForm();
		});
		
		/* student select click event */
		
		/* student list cancel button click event */
	
		$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_CANCEL_BTN+'_]').off("click tap").on("click tap", function(){
			//$(".student_view_box").show();
			$(".student_box").each(function(){
				if($.inArray($(this).attr('student_id'),studentlilist)==-1){ 
					$(this).parent().hide();
				}else{
					$(this).parent().show();	
				}
			});
			//if($.inArray(idx.UserID, studentselectedlist)!==-1){
			var cancelpart = $(this).attr('id').split("_");
			$("#" +LESSON.c_s_CONFERENCE_STUDENTLIST+"_"+cancelpart[1]+"_"+cancelpart[2]).hide();
			$('.'+ LESSON.c_s_OVERLAY_CLASS).remove();
		});
		/* student list edit button click event */
		
		/* student list save button click event */
	
		$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_SAVE_BTN+'_]').off("click tap").on("click tap", function(){
			studentlilist.length = 0;
			/* $('.tooltip_wrap_language ul li').each(function(){
				if($(this).hasClass('active')){
					studentlilist.push($(this).attr('student_id'));
				}	
				}); */
			var cancelpart = $(this).attr('id').split("_");
			$("#" +LESSON.c_s_CONFERENCE_STUDENTLIST+"_"+cancelpart[1]+"_"+cancelpart[2]).hide();
			
			$('.'+ LESSON.c_s_OVERLAY_CLASS).remove();
		});
		/* student list save button click event */
		
    });
    /* student thumbnail click event */
		LessonView.gotoConferenceForm();
		
    /* student thumbnail click event */
	
	/* Refresh student list */
		$('[id^='+LESSON.c_s_CONFERENCE_STUDENTLIST_REFRESH_BTN+'_]').off("click tap").on("click tap", function(){
			//GetStudentListInfo();
			// edited on 05.08.2014
			LessonView.getStudentRelatedData();			
		});
	
	/*Refresh student list */	
};

/**
 * Open Conference Form 
 * @method gotoConferenceForm NO MORE IN USE. CHECK IN lesson-conference.js
 * @return 
 */
LessonView.gotoConferenceForm = function(){
	$(".student_box").off("click tap").on("click tap", function(){
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
											current_reading_bookid.length == 0) ? '' : current_reading_bookid; 			
				sIframeUrl += 	LESSON.c_s_POPUP_STUDENT_NAME + '=' + student_name + '&' +
							LESSON.c_s_POPUP_STUDENT_ID + '=' + student_id + '&' +
							LESSON.c_s_POPUP_ITEMDISPLAY_NAME + '=' + item_display_name + '&' +
							LESSON.c_s_POPUP_CONFERENCE_TYPE + '=' + conference_type+ '&' +
							LESSON.c_s_POPUP_LESSON_ID + '=' + lesson_id + '&' +
							LESSON.c_s_POPUP_CURRENT_READING_ID + '=' + current_reading_bookid+ '&' +
							LESSON.c_s_POPUP_CURRENT_LEVEL + '=' + current_reading_level+ '&' +
							LESSON.c_s_POPUP_UNIT_NO + '=' + current_unit_no+ '&' +
							LESSON.c_s_POPUP_WEEK_NO + '=' + current_week_no;
				
				if(objLessonJsonData.hasOwnProperty('serviceVersion') && objLessonJsonData.serviceVersion == "v2"){
					sIframeUrl +=	'&' +LESSON.c_s_POPUP_SERVICE_VERSION + '=' + objLessonJsonData.serviceVersion;
				}
			
			if ( oPlatform.isDevice()) {
				ShowWebView(sIframeUrl);
			}else{

				$('#' + LESSON.c_s_VIEW_CONFERENCE_AREA).find('iframe').attr('src',sIframeUrl).load(function() {
				$('#' + LESSON.c_s_VIEW_CONFERENCE_AREA).show();
				LessonView.resize();
				});
			}
			HideNativeBottomBar(true);		
		   });
};
/* bind gotoConferenceForm */

/**
 * Initiate Swiper Slide 
 * @method initSwiper
 * @return 
 */
LessonView.initSwiper = function(){
	LessonView.mySwiper = new Swiper('.swiper-nested1',{
		pagination: ".pagination",
		paginationClickable: true,
		scrollbar: {
				container : '.swiper-scrollbar',
				draggable : true,
				hide: true,
			},
		onImagesReady: function () {
			
			var _iWindowHeight   = parseInt($(window).height(), 10);
			var _iContentAreaTop = parseInt($('.content_space').offset().top, 10);
			var _iTotPadding     = 44;
			var _iRestrictedHeight   = (_iWindowHeight - _iContentAreaTop) - _iTotPadding - 10;                
				
			$('.swiper-wrapper').css('height' , _iRestrictedHeight + 'px');
			$('.swiper-slide').css('height' , _iRestrictedHeight + 'px');
			LessonView.mySwiper.reInit();
			
                        LessonView.initTooltip();
			
		},
		
		onFirstInit: function () {			
			LessonView.swiperResize();			
		},
		// to fix error b.onInit is not a function
		onInit: function() {			
		},
		onTouchStart: function() {
			$("div[data-tooltip]").tooltipster('hide');
			$("button[data-tooltip]").tooltipster('hide');
			$("a[data-tooltip]").tooltipster('hide');
			$("img[data-tooltip]").tooltipster('hide');
		},
		onTouchMove: function () {},
		onTouchEnd: function () {},
		onSlideChangeStart: function () {
			$("div[data-tooltip]").tooltipster('hide');
			$("button[data-tooltip]").tooltipster('hide');
			$("a[data-tooltip]").tooltipster('hide');
			$("img[data-tooltip]").tooltipster('hide');
			
			$('.video-js').each(function(){
				var video_id = $(this).attr('id');
							  
				videojs(video_id).ready(function(){
					myplayer=this;
					myplayer.pause(); 
					});
			});
			
			/*$('.project').text('Project').removeClass('active');
			$('.project').parent().parent().removeClass('active');
			$('.start_project').text('Project');*/
			
		},
		onSlideChangeEnd: function () {
			var active_tab = $('#navtabs li.active a').attr('id');
			LessonView.slide_viewed[active_tab] = {"slide" : $('.swiper-slide-visible').data('slidecount')};
			//LessonView.resize();
		}
	});
};

/**
 * Resize Swiper height 
 * @method swiperResize
 * @return 
 */
LessonView.swiperResize = function() {
	var _iWindowHeight   = parseInt($(window).height(), 10);
	var _iContentAreaTop = parseInt($('.content_space').offset().top, 10);
	var _iTotPadding     = 44;
	var _iRestrictedHeight   = (_iWindowHeight - _iContentAreaTop) - _iTotPadding - 10;
	
	$('.swiper-wrapper').css('height' , _iRestrictedHeight + 'px');
	$('.swiper-slide').css('height' , _iRestrictedHeight + 'px');
	//LessonView.mySwiper.reInit();
	
	LessonView.initTooltip();
};

/**
 * Bind Tooltip 
 * @method initTooltip
 * @return 
 */
LessonView.initTooltip = function(){
    $("div[data-tooltip]").tooltipster(LESSON.c_obj_TOOLTIP_SETTINGS);
    $("div[data-tooltip]").off("click tap").on("click tap", LessonView.tooltipClick);
    $("button[data-tooltip]").tooltipster(LESSON.c_obj_TOOLTIP_SETTINGS);
    $("button[data-tooltip]").off("click tap").on("click tap", LessonView.tooltipClick);
    $("a[data-tooltip]").tooltipster(LESSON.c_obj_TOOLTIP_SETTINGS);
    $("a[data-tooltip]").off("click tap").on("click tap", LessonView.tooltipClick);
	$("img[data-tooltip]").tooltipster(LESSON.c_obj_TOOLTIP_SETTINGS);
    $("img[data-tooltip]").off("click tap").on("click tap", LessonView.tooltipClick);
};


/**
 * Initiate Swiper Slide in RATA Popup
 * @method initPopupSwiper
 * @return 
 */
LessonView.initPopupSwiper = function(){    
        LessonView.myPopupSwiper = new Swiper('.swiper-nested2',{
        pagination: ".md-modal .pagination",
        paginationClickable: true,
        watchActiveIndex: true,
        paginationActiveClass:'popupHighlightClass',
        
        onSlideChangeStart: function () {            
            $('#popupAudio')[0].pause();
            $(".jp-play").removeClass('replay').show();
            $(".jp-pause").hide();
            $('.stopbttn').removeClass('active');
        },
        onSlideChangeEnd: function () {
            $('#popupAudio').attr('src',$(".md-modal .swiper-slide-visible .jp-play").parent().data('audio'));
            $('#popupAudio')[0].pause();
			if (LessonView.disableOnPreview == '') {
				var broadcastRata = false;
				LessonView.setRataProjection(LESSON.c_s_PROJECT_START,'',broadcastRata);	
			}
        }
    });    
};

/**
 * Bind Event for Tooltip 
 * @method tooltipClick
 * @return 
 */
LessonView.tooltipClick = function () {
    
    var content = "";
    
    content = $(this).attr("data-tooltip");    
    $('.tooltipster-base').remove();
    
    if ($(this).attr("data-tooltipvisible") == null || $(this).attr("data-tooltipvisible") == "false") {
        
        $("div[data-tooltip]").not(this).attr("data-tooltipvisible", "false").tooltipster('hide');
        $("button[data-tooltip]").not(this).attr("data-tooltipvisible", "false").tooltipster('hide');
        $("a[data-tooltip]").not(this).attr("data-tooltipvisible", "false").tooltipster('hide');        
        $("img[data-tooltip]").not(this).attr("data-tooltipvisible", "false").tooltipster('hide');        
        
        $(this).tooltipster('update', content);        
        $(this).attr("data-tooltipvisible", "true");
        $(this).tooltipster('show');  
         
        setTimeout(LessonView.tooltipSlide.bind(this),200);        
        
    } else {		       
        $(this).tooltipster('hide');
        $(this).attr("data-tooltipvisible", "false");
    }

};

LessonView.tooltipSlide = function(){	
	var left = parseInt($('.tooltipster-fade-show').css('left')) - 10;
	$('.tooltipster-fade-show').css('left',left);	
	var pos_left = (typeof $(this).position() != 'undefined') ? parseInt($(this).position().left) : 0;
	var parent_pos_left = (typeof $('.tooltipster-fade-show').position() != 'undefined') ? parseInt($('.tooltipster-fade-show').position().left) : 0;
	var tooltip_width = (typeof $('.tooltipster-fade-show').width() != 'undefined') ? $('.tooltipster-fade-show').width()/2 : 0;
	var leftIndex = parent_pos_left - pos_left + tooltip_width;
	
	//$('.tooltipster-arrow').css({'left':'0px', "width": 0});
	//$('.tooltipster-arrow span').css({'left':leftIndex, "width": 0});	
}

/**
 * Resize RATA Popup 
 * @method popupResize
 * @return 
 */
LessonView.popupResize = function () {    
    $('.md-modal').height($('.content_space').height() + 70);
    $('.md-modal .swiper-wrapper').height($('.content_space').height() + 50);
    $('.md-modal .swiper-slide').height($('.content_space').height() + 50);
	$('.md-modal .swiper-slide .book_content').height($('.content_space').height()).css('overflow-y','auto');
    
};

/**
 * Resize Entire Screen 
 * @method resize
 * @return 
 */
LessonView.resize = function () {
	
	var window_height = $(window).height();
		
	var container_space_padding = parseInt($('.container_space').css('padding-top')) + parseInt($('.container_space').css('padding-bottom'));
	
	// left column height
	$('.bs_example_tabs').height($('.container_space').height() + parseInt($('.container_space').css('padding-bottom')) + 17);
	
	// left column tabs height
	var nav_tabs_height =  $('.bs_example_tabs').height() - (parseInt($('.container_space').css('padding-top')) + $('.menu_tabs').height() -30)
	$('.nav_tabs').height(nav_tabs_height);
	
	// main container height
	var content_space_pad = parseInt($('.content_space').css('padding-top')) + parseInt($('.content_space').css('padding-bottom'));
	var page_title_height = $('.container_space h2').height();
	var actual_height = window_height - (container_space_padding + content_space_pad + page_title_height);
	$('.content_space').height(actual_height);
	
          
	// slides content height & width
	$('.swiper-slide').each(function(){
		var swiper_id = $(this).attr('id');            
		//theme_content and nautural_box_space height 
		var title_elem = ($('#'+swiper_id+' .survey_box').length) ? $('#'+swiper_id+' .survey_box > h3') : $('#'+swiper_id+' .swiper-padding-right > h3');
		var title_height = title_elem.height() + parseInt(title_elem.css('margin-top'));
		
		var theme_content_height = $('#'+swiper_id+' .theme_content').height() + parseInt($('#'+swiper_id+' .theme_content').css('padding-top')) + parseInt($('#'+swiper_id+' .theme_content').css('padding-bottom')) + parseInt($('#'+swiper_id+' .theme_content').css('margin-bottom'));
		
		$('#'+swiper_id+' .theme_content').css('height',$('#'+swiper_id+' .theme_content').height())

		var area_btn_height = 0;            
		if($('#'+swiper_id+' .area_btn').length){
			var area_h3_height = 0;
			if($('#'+swiper_id+' .area_btn h3').length){
				area_h3_height = parseInt($('#'+swiper_id+' .area_btn h3').css('margin-top')) + parseInt($('#'+swiper_id+' .area_btn h3').css('margin-bottom'));
			}
			area_btn_height = $('#'+swiper_id+' .area_btn').height() + area_h3_height + 10;
		}


		var input_bttn_height = 0;
		if($('#'+swiper_id+' input.button7').length){
			input_bttn_height = $('#'+swiper_id+' input.button7').height()+ parseInt($('#'+swiper_id+' input.button7').css('padding-top')) + parseInt($('#'+swiper_id+' input.button7').css('padding-bottom'));            
		}

		var natural_box_height = 0;
		if($('#'+swiper_id+' .natural_box_space').length){
			natural_box_height = parseInt($('#'+swiper_id+' .natural_box_space').css('margin-top')) + parseInt($('#'+swiper_id+' .natural_box_space').css('margin-bottom'));            
		}
		
		var bttn_box_space = ($('#'+swiper_id+' .buttonBox button').length) ? $('#'+swiper_id+' .buttonBox button').height() : 0;
		
		var pagination = $('.pagination').height();
		
		var boxheight = $('.content_space').height() - (title_height + theme_content_height + area_btn_height +  input_bttn_height + natural_box_height + bttn_box_space + pagination);	
		
		var book_height = 0;		
		if($('#'+swiper_id+' .natural_box_space').length)
		{		
			// if survey screen reset height
			if ($('#'+swiper_id+' .survey_box').length > 0 && 
				($('#'+swiper_id+' .question_box_space').length > 0)
			) {				
				boxheight = boxheight + bttn_box_space - 10;
			}
			else {
				boxheight = boxheight - 25;
			}
			$('#'+swiper_id+' .natural_box_space').css('height',boxheight+'px');
			
		}
		else if($('#'+swiper_id+' .bookContainer').length)
		{
			$('#'+swiper_id+' .img_boxeas_box img').load(function(){
								
				book_height = $('#'+swiper_id+' .bookContainer').height();			
				
				// remaining space in box
				boxheight = $('.content_space').height() - (title_height + book_height + area_btn_height + pagination + parseInt($('#'+swiper_id+' .theme_content').css('padding-top')) + parseInt($('#'+swiper_id+' .theme_content').css('padding-bottom')) + parseInt($('#'+swiper_id+' .theme_content').css('margin-bottom')) + 7);
				
				var minHeight = 20;
				if (boxheight < minHeight) {
					book_height = book_height - (minHeight - boxheight);
					boxheight  = minHeight;
					$('#'+swiper_id+' .bookContainer').css({"height":book_height,"overflow-y":"auto"});					
				}
				
				$('#'+swiper_id+' .theme_content').css('max-height',boxheight+'px');
			});
		}
		else if($('#'+swiper_id+' .video_container').length)
		{							
			video_height = $('#'+swiper_id+' .video_container').height();		
			
			boxheight = $('.content_space').height() - (title_height + video_height + pagination + parseInt($('#'+swiper_id+' .theme_content').css('padding-top')) + parseInt($('#'+swiper_id+' .theme_content').css('padding-bottom')) + parseInt($('#'+swiper_id+' .theme_content').css('margin-bottom')) + 7);				
			
			if($('#'+swiper_id+' .buttonBox').length > 0)
			{					
				boxheight = boxheight - 60;
			}
			if($('#'+swiper_id+' .area_btn .button7').length > 0)
			{					
				boxheight = boxheight - 60;
			}			
			
			var minHeight = 20;
			if (boxheight < minHeight) {
				video_height = video_height - (minHeight - boxheight) + 20;
				boxheight  = minHeight;
				$('#'+swiper_id+' .video_wrapper_div').css({"height":video_height,"overflow-y":"auto"});				
			}			
			
			$('#'+swiper_id+' .theme_content').css('max-height',boxheight+'px');
			
			var space = $('.content_space').height() - (title_height + boxheight + pagination + parseInt($('#'+swiper_id+' .theme_content').css('padding-top')) + parseInt($('#'+swiper_id+' .theme_content').css('padding-bottom')) + parseInt($('#'+swiper_id+' .theme_content').css('margin-bottom')) + $('#'+swiper_id+' .buttonBox').height() + $('#'+swiper_id+' .area_btn').height());	
			
			if ($('#'+swiper_id+' .video_wrapper_div').height() > space) {				
				$('#'+swiper_id+' .video_wrapper_div').css({"height":space,"overflow-y":"auto"});
			}
			
		}
		else if(($('#'+swiper_id+' .theme_content').height() < parseInt($('.theme_content').css('max-height'))) || 
				($('#'+swiper_id+' .natural_box_space').length == 0 && $('#'+swiper_id+' .video_container').length == 0 && 
				$('#'+swiper_id+' .bookContainer').length == 0))	
		
		{			
			boxheight = boxheight + $('#'+swiper_id+' .theme_content').height();
			if($('#'+swiper_id+' .buttonBox').length > 0)
			{
				boxheight = boxheight - $('#'+swiper_id+' .buttonBox').height() - 20;
			}
			
			if($('#'+swiper_id+' .right_container').length > 0)
			{				
				boxheight = boxheight + area_btn_height;
			}
			
            $('#'+swiper_id+' .theme_content').css({'max-height':boxheight+'px', 'height':'auto'});
		}
		
	});
	if($("#" + LESSON.c_s_VIEW_CONFERENCE_AREA).is(":visible")){
		$(".bs_example_tabs").hide();
		$(".container_space").hide();
		//$("#" + LESSON.c_s_VIEW_CONFERENCE_AREA).height($('.bs_example_tabs').height()+10);
	
		$("#" + LESSON.c_s_VIEW_CONFERENCE_AREA).css('height',$(window).height()+'px');
		$('#' + LESSON.c_s_VIEW_CONFERENCE_AREA).find('iframe').css('height',($(window).height()-5)+'px');
		$("#" + LESSON.c_s_VIEW_CONFERENCE_AREA).css('background','#0591e8');
	}
	
};

/**
 * Reflect Graph on Survey Screen 
 * @method updateResponse
 * @param {Object} myval
 * @return 
 */
LessonView.updateResponse = function(myval){    
    
    var arrOptions = ['a', 'b', 'c', 'd' ,'e', 'f', 'g', 'h' ,'i', 'j', 'k', 'l'];
    
    if(typeof myval == "undefined" || myval == '') {
        
		var myval = {"Status":"200","Error":null,"Content":[{"UserID":"327f1ff7-4812-4ad0-a0ec-86b1f80b998a","UserResponseItemNo":"a"}]};
        
    }
    
    var jsonVal = typeof myval === "object" ? myval : JSON.parse(myval); 
    var objData = jsonVal.Content;

    var slide = LessonView.currentSlide;    
    var resultArr = [];
    for(key in arrOptions) {
        
		if(parseInt(key) >=0 && parseInt(key) <= (arrOptions.length - 1)) {
			var resp = (arrOptions[key]).toUpperCase();
			var val = $('#'+slide+'_'+resp).text();
			
			var objResult   =   _.where(objData, {UserResponseItemNo: arrOptions[key]});
			resultArr.push({'val' : objResult.length, 'id' : slide+'_'+resp});   
			
			$('.end_survey_box').find('#'+slide+'_'+resp).text(objResult.length);   
		}
    }
	
	var max_val = _.max(_.pluck(resultArr, 'val'));
	
	if(max_val > 0)
	{
		$.each(resultArr, function(id,obj){
			
			if(obj.val == max_val)
			{
				 $('.end_survey_box').find('#bar_'+obj.id).animate({'width':"100%"},100);
				 $('.end_survey_box .message').html('<div class="message_content">'+unescape($('.end_survey_box').find('#info_'+obj.id).val())+'</div>').addClass('message_active');
			}
			else
			{
				var percent = obj.val/max_val * 100;
				$('.end_survey_box').find('#bar_'+obj.id).animate({'width':percent+"%"},100);
			}
		}); 
	}
    
};

/**
 * Filter Scored Data 
 * @method filterScoredData
 * @return 
 */
LessonView.filterScoredData = function () { 
		aMasterScoredData = [];
		var oSelf = this;
		if (LessonView.model.gradeBookData != null) {
			for (var iIdx = 0; iIdx < oSelf.model.gradeBookData.length; iIdx++) {
				var oItem = oSelf.model.gradeBookData[iIdx];
				if (oItem['ItemCompletionStatus'] != LESSON.c_i_SCORED_STATUS) {
					continue;
				}
				// find gradebook students from student list
				findStudent = _.find(oSelf.model.StudentData, function(item) {
					return item.UserID == oItem['StudentID']; 
				});
				if(typeof findStudent !='undefined'){
					var sStudentId = oItem['StudentID'],
						oData = {
							'StudentId':	sStudentId,
							'ItemID':		oItem['ItemID'],
							'FinalScore':	oItem['FinalScore'],
							'ItemMaxScore':	oItem['ItemMaxScore']
						},
						aAssignmentData = _.where(oSelf.model['assignmentListData'], {ItemID: oItem['ItemID']});
						
					if (aAssignmentData.length > 0) {
						oAssignmentData = aAssignmentData.first();
						oData['UnitNumber'] =	oAssignmentData['UnitNumber'];
						oData['WeekNumber'] =	oAssignmentData['WeekNumber'];
						oData['ItemType'] =	oAssignmentData['ItemType'];
						
						oData['ItemSubType'] =	oAssignmentData['ItemSubType'];
						aMasterScoredData.push(oData);
					}
				}	
			}
			
		}
		
	LessonView.filterInProgressData();
};

/**
 * Filter In Progress Data 
 * @method filterInProgressData
 * @return 
 */
LessonView.filterInProgressData = function () { 
		aMasterInprogressData = [];
		var oSelf = this;
		if (LessonView.model.gradeBookData != null) {
			for (var iIdx = 0; iIdx < oSelf.model.gradeBookData.length; iIdx++) {
				var oItem = oSelf.model.gradeBookData[iIdx];
				if ((oItem['ItemCompletionStatus'] != LESSON.c_i_ASSIGN_STATUS) || (oItem['ItemCompletionStatus'] != LESSON.c_i_PROGRESS_STATUS)) {
					continue;
				}
				// find gradebook students from student list
				findStudent = _.find(oSelf.model.StudentData, function(item) {
					return item.UserID == oItem['StudentID']; 
				});
				if(typeof findStudent !='undefined'){
					var sStudentId = oItem['StudentID'],
						oData = {
							'StudentId':	sStudentId,
							'ItemID':		oItem['ItemID'],
							'FinalScore':	oItem['FinalScore'],
							'ItemMaxScore':	oItem['ItemMaxScore']
						},
						aAssignmentData = _.where(oSelf.model['assignmentListData'], {ItemID: oItem['ItemID']});
					if (aAssignmentData.length > 0) {
						oAssignmentData = aAssignmentData.first();
						oData['UnitNumber'] =	oAssignmentData['UnitNumber'];
						oData['WeekNumber'] =	oAssignmentData['WeekNumber'];
						oData['ItemType'] =	oAssignmentData['ItemType'];
						oData['ItemSubType'] =	oAssignmentData['ItemSubType'];
						aMasterInprogressData.push(oData);
					}
				}	
			}
		}
};

/**
 * Reset Status of Project/Broadcast Buttons
 * @method resetProjectBroadcast
 * @param {String} type
 * @return 
 */
LessonView.resetProjectBroadcast = function(type) {	
	if (type == 'project') {
		$('.swiper-slide button.start_project').text('Project').removeClass('active');
		$('.swiper-slide button.start_project').parent().parent().removeClass('active');
		$('.swiper-slide button.project').text('Project').removeClass('active');
		$('.swiper-slide button.project').parent().parent().removeClass('active');
	}
	else if (type == 'broadcast')
	{
		$('.swiper-slide button.broadcast').text('Broadcast').removeClass('active');
		$('.swiper-slide button.broadcast').parent().parent().removeClass('active');		
	}
};

/**
 * Reset Survey Graph 
 * @method resetResponse
 * @return 
 */
LessonView.resetResponse = function(){     
    var slide = LessonView.currentSlide;  
    $('.end_survey_box').find('#'+slide+' .no_box').text('0');    
};

LessonView._alert   =  ISeriesBase.prototype._alert ;

/*
/**
 * Lesson Poll Template 
 * Not in Use
 * @method PollView
 * @return 
 *
function PollView () {}

PollView.model = null;

/**
 * Initialize Poll Template 
 * Not in Use
 * @method init 
 * @return 
 *
PollView.init = function(){
	//PollView.model = model;
	PollView.render();	
	//PollView.bindEvent();
}

/**
 * Render Poll Template 
 * @method render
 * @return 
 *
PollView.render = function(){
	  
	Application.mainContainer.html(_.template($("#pollTemplate").html()));
	
	PollView.resize();
	PollView.bindEvent();
}

/**
 * Bind Events of Poll Template
 * @method bindEvent
 * @return 
 *
PollView.bindEvent = function(){
	$('.options_num').off('click tap').on('click tap', function(){
		$('.options_num').removeClass('active');
		$(this).addClass('active');
		
		if($(this).data('val') == 2)
		{
			$('.poll_options_cont .text_box_area')
		}
	});
}

/**
 * Resize Poll Template 
 * @method resize
 * @return 
 *
PollView.resize = function(){
	var window_height = $(window).height();
	
	var bottom_bar = $('.edit_box_title.lssn_contr').height();
	var margin_height = parseInt($('.container_space').css('padding-top')) * 2;
	var container_padding = parseInt($('.content_space.lesson_enhancement').css('padding-top')) * 2;
	
	var container_height = window_height - bottom_bar - margin_height - container_padding;
	$('.content_space.lesson_enhancement').css('height',container_height+'px');
	
	var blue_heading = $('.lesson_enhancement .blue_heading').height() 
						+ parseInt($('.lesson_enhancement .blue_heading').css('margin-bottom'));
						
	var question_heading = $('.lesson_enhancement .middle.margin_btm').height() 
							+ parseInt($('.lesson_enhancement .middle.margin_btm').css('margin-bottom'));
							
	var question_body = $('.lesson_enhancement .text_box_area.lesson_qstn').height() 
						+ parseInt($('.lesson_enhancement .text_box_area.lesson_qstn').css('margin-bottom'));
						
	var option_heading = $('.lesson_enhancement .title_name.option').height() 
						+ parseInt($('.lesson_enhancement .title_name.option').css('margin-bottom'));
	
	var options_body_height = container_height - (blue_heading + question_heading + question_body + option_heading + 20);
	$('.lesson_enhancement .poll_options_cont').css('height',options_body_height+'px');
}
*/	