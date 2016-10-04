/*
* Instructor Message View
*/

function InstructorMessageView () {}

InstructorMessageView.model = null;
InstructorMessageView.activeTab = null;
InstructorMessageView.tabIdentifier = [{"containerId": MESSAGE_INSTRUCTOR.c_s_ALERT_MESSAGE_CONTAINER_ID,"method": "renderAlertMessage"},{"containerId": MESSAGE_INSTRUCTOR.c_s_APP_MESSAGE_CONTAINER_ID,"method": "renderAppMessage"},{"containerId": MESSAGE_INSTRUCTOR.c_s_DYK_MESSAGE_CONTAINER_ID,"method": "renderDykMessage"},{"containerId": MESSAGE_INSTRUCTOR.c_s_NOTES_MESSAGE_CONTAINER_ID,"method": "renderNoteMessage"}];
InstructorMessageView._alert = ISeriesBase.prototype._alert;

InstructorMessageView.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.render(oSelf);
}

InstructorMessageView.render = function (oSelf) {
	$("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_CONTAINER_ID).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_TEMPLATE_ID).html(),{
		"data":oSelf.model
	}));
	
	oSelf.renderAlertMessage();
	oSelf.renderAppMessage();
	oSelf.renderDykMessage();
	oSelf.renderNoteMessage();
}

InstructorMessageView.renderAlertMessage = function () {
	var oSelf = this;
	$("#" + MESSAGE_INSTRUCTOR.c_s_ALERT_MESSAGE_CONTAINER_ID).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_LIST_TEMPLATE_ID).html(),{
		"data": _.where(oSelf.model, {MessageType: MESSAGE_INSTRUCTOR.c_s_MESSAGE_ALERT_TYPE}),
		"msgType": MESSAGE_INSTRUCTOR.c_s_MESSAGE_ALERT_TYPE
	}));
	oSelf.bindEvent();
	oSelf.resize();
	
	SetGoogleAnalytic(MESSAGE_INSTRUCTOR.c_s_MESSAGE_ALERT_VERBID);
}

InstructorMessageView.renderAppMessage = function () {
	var oSelf = this;
	$("#" + MESSAGE_INSTRUCTOR.c_s_APP_MESSAGE_CONTAINER_ID).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_LIST_TEMPLATE_ID).html(),{
		"data":_.where(oSelf.model, {MessageType: MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE}),
		"msgType": MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_TYPE
	}));
	oSelf.bindEvent();
	oSelf.resize();
}

InstructorMessageView.renderDykMessage = function () {
	var oSelf = this;
	$("#" + MESSAGE_INSTRUCTOR.c_s_DYK_MESSAGE_CONTAINER_ID).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_LIST_TEMPLATE_ID).html(),{
		"data":_.where(oSelf.model, {MessageType: MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE}),
		"msgType": MESSAGE_INSTRUCTOR.c_s_MESSAGE_DYK_TYPE
	}));
	oSelf.bindEvent();
	oSelf.resize();
}

InstructorMessageView.renderNoteMessage = function () {
	var oSelf = this;
	$("#" + MESSAGE_INSTRUCTOR.c_s_NOTES_MESSAGE_CONTAINER_ID).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_LIST_TEMPLATE_ID).html(),{
		"data":_.where(oSelf.model, {MessageType: MESSAGE_INSTRUCTOR.c_s_MESSAGE_NOTES_TYPE}),
		"msgType": MESSAGE_INSTRUCTOR.c_s_MESSAGE_NOTES_TYPE
	}));
	oSelf.bindEvent();
	oSelf.resize();
}


InstructorMessageView.bindEvent = function () {
	var oSelf = this;
	$("#"+MESSAGE_INSTRUCTOR.c_s_MESSAGE_TABS).tabs({
		hide: {effect: "fade", duration: 100},
		show: {effect: "fade", duration: 100},
		activate: function(event, ui){
			var selector = ui.newPanel.selector.replace('#',''),
				verbid = null;
			
			switch (selector) {
				case MESSAGE_INSTRUCTOR.c_s_ALERT_MESSAGE_CONTAINER_ID:
					verbid = MESSAGE_INSTRUCTOR.c_s_MESSAGE_ALERT_VERBID;
					break;
				case MESSAGE_INSTRUCTOR.c_s_APP_MESSAGE_CONTAINER_ID:
					verbid = MESSAGE_INSTRUCTOR.c_s_MESSAGE_APP_VERBID;
					break;
				case MESSAGE_INSTRUCTOR.c_s_NOTES_MESSAGE_CONTAINER_ID:
					verbid = MESSAGE_INSTRUCTOR.c_s_MESSAGE_NOTES_VERBID;
					break;
				default:
					break;
			};
			
			if (verbid != null) {				
				SetGoogleAnalytic(verbid);
			}
		}
	});
	oSelf.bindEventForMessageList(oSelf);
}

InstructorMessageView.bindEventForMessageList = function () {
	var oSelf = this;
	$(".mail_row_list > li").off("click").on("click", function() {
		var msgId = $(this).attr("message-id");
		oSelf.activeTab = $("#"+MESSAGE_INSTRUCTOR.c_s_MESSAGE_TABS).tabs( "option", "active" );
		var data = _.where(oSelf.model, {MessageID: msgId});
		InstructorMessageDetailView.init(data);
	});
}

InstructorMessageView.resize = function () {
	var window_height = $(window).height(),
		dashboard_instructor_padding = parseInt($(".dashboard_instructor").css("padding-top")) + parseInt($(".dashboard_instructor").css("padding-bottom")) + parseInt($(".dashboard_instructor").css("border-top-width")),
		message_container_margin = parseInt($("#messageContainer").css("margin-top")) + parseInt($("#messageContainer").css("margin-bottom")),
		header_tabs_height = $(".ui-tabs-nav").height(),
		ui_tabs_panel_padding = parseInt($(".ui-tabs-panel").css("padding-top")) + parseInt($(".ui-tabs-panel").css("padding-bottom")),
		actual_height = window_height - (dashboard_instructor_padding + message_container_margin + header_tabs_height + ui_tabs_panel_padding);
	
	$(".tabs_inner_container").height(actual_height);
}


InstructorMessageDetailView = {
	'model': null,
	'tabMethod': null,
	'container': null
}

InstructorMessageDetailView.init = function (model) {
	var oSelf = this;
	oSelf.model = model;
	oSelf.container = InstructorMessageView.tabIdentifier[InstructorMessageView.activeTab].containerId;
	oSelf.render (oSelf);
}

InstructorMessageDetailView.render = function (oSelf) {
	$("#" + oSelf.container).html(_.template($("#" + MESSAGE_INSTRUCTOR.c_s_MESSAGE_DETAIL_TEMPLATE_ID).html(),{
		"data":oSelf.model,
		"activeTabIdx":InstructorMessageView.activeTab
	}));
	oSelf.bindEvent(oSelf);
	oSelf.resize(oSelf);
}

InstructorMessageDetailView.bindEvent = function (oSelf) {
	$("#" + oSelf.container).find("."+ MESSAGE_INSTRUCTOR.c_s_MESSAGE_CLOSE_BUTTON).off("click").on("click", function() {
		var keyIdx = $(this).attr("active-index");
		oSelf.tabMethod = InstructorMessageView.tabIdentifier[keyIdx].method;
		InstructorMessageView[InstructorMessageDetailView.tabMethod]();
		InstructorMessageView.bindEventForMessageList();
		InstructorMessageView.resize();
	});
}


InstructorMessageDetailView.resize = function () {
	var window_height = $(window).height(),
		dashboard_instructor_padding = parseInt($(".dashboard_instructor").css("padding-top")) + parseInt($(".dashboard_instructor").css("padding-bottom")) + parseInt($(".dashboard_instructor").css("border-top-width")),
		message_container_margin = parseInt($("#messageContainer").css("margin-top")) + parseInt($("#messageContainer").css("margin-bottom")),
		header_tabs_height = $(".ui-tabs-nav").height(),
		ui_tabs_panel_padding = parseInt($("#" + InstructorMessageDetailView.container).css("padding-top")) + parseInt($("#" + InstructorMessageDetailView.container).css("padding-bottom")),
		message_container_header_height = $("#" + InstructorMessageDetailView.container).find(".content_msg_bx").outerHeight(),
		message_container_body_padding = parseInt($("#" + InstructorMessageDetailView.container).find(".message_content").css("padding-top")) + parseInt($("#" + InstructorMessageDetailView.container).find(".message_content").css("padding-bottom")),
		actual_height = window_height - (dashboard_instructor_padding + message_container_margin + header_tabs_height + ui_tabs_panel_padding + message_container_header_height + message_container_body_padding );
	
	$("#" + InstructorMessageDetailView.container).find(".message_content").height(actual_height);
}

/*
*
* Method for calling webservice at the showing detail view of the new message
* Need to update database i.e. message status has been changed from new to already read.
*
*/
InstructorMessageDetailView.updateMessageStatus = function () { }