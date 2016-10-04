
/**
 * Student View View StudnetConnect JS
 * @class StudentConnectView
 * @module StudentConnectView
 * @constructor
 */

var StudentConnectView = function (model) {
	this.model = model;
};

/**
 * Initialize StudentConnectView
 * @method init 
 * @return 
 */
StudentConnectView.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.render();
	oSelf.bindEvents();
}

/**
 * render StudentConnectView
 * @method render 
 * @return 
 */
StudentConnectView.render = function (){
	var oSelf = this;
	
    // render main template
	$("#studentConnectWrapper").empty().html(
		_.template($("#studentConnectTemplate").html(),
			{}
		)
	);
	// render comment list and star
	oSelf.renderComments();
	oSelf.resize();
}

/**
* @method: bindEvents
* @uses: for binding events to the dom elements
* @return void;
*/

StudentConnectView.bindEvents = function (){
	var oSelf = this;
    //bind refresh button

    $("#"+STUDENT_CONNECT.c_s_CONNECT_REFRESH).off("click tap").on("click tap", function () {
	
		$.nativeCall({
		'method':			'GetBuzzCmtDetails',
		//'inputParams':		[sPollId, sTitle, sQuestion, sAnswers, bDeletePoll],
		'globalResource':	'objBuzzListData',
		'interval':			500,
		'breakAfter':		125000,
		'debug':			false,
		'onComplete':		function (pobjBuzzListData) {
			oSelf.model.studentBuzzData = pobjBuzzListData.Content;
			oSelf.renderComments();
		}
		});	
	
	});
}
/**
* @method: resize
* @uses: for resizing
* @return void;
*/
StudentConnectView.resize = function (){
	
	var window_height = $(window).height();	
	var main_wrapper_padding = parseInt($('.main_wrapper').css('padding-top')) + parseInt($('.main_wrapper').css('padding-bottom'));
	//main container height
	var main_wrapper_pad = parseInt($('.main_wrapper').css('padding-top')) + parseInt($('.main_wrapper').css('padding-bottom'));
	var actual_height = window_height - (main_wrapper_padding +main_wrapper_pad);
	$('.main_wrapper').height(actual_height);
	$("#connectStudent").height(actual_height);
	$(".buzz_container").height(actual_height);
}

/**
 * render comments and star
 * @method comments 
 * @return 
 */
StudentConnectView.renderComments = function (){ 
	var oSelf = this;
	noOfStars = 0,
	studentCmt = oSelf.model.studentBuzzData;
	//console.log(oSelf.model.studentBuzzData);
	studentCmt = studentCmt.reverse();
	
	
	$("#cmtView").empty().html(
		_.template($("#studentCmtTemplate").html(),
			{
				'buzzList' : studentCmt,
				'buzzCommentNotes' : oSelf.model.buzzNotes,
				'noOfStars' : noOfStars
			}
		)
	);
	studentCmt = studentCmt.reverse();
	
	for (var i=studentCmt.length-1;i>=0; i--){
		//console.log(studentCmt[i].IsSysCmt);
		if (studentCmt[i].IsSysCmt === 1) { break; }
		noOfStars +=studentCmt[i].StarCountForCMT;
	}
	
	$("#starview").empty().html(
		_.template($("#studentStarTemplate").html(),
			{
				'noOfStars' : noOfStars
			}
		)
	);
	
}
