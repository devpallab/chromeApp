/* custome.js */
var g_caching = false;
var g_loading = false;

var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || (navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/BlackBerry/i)) ? true : false );



$(document).ready(function(){
	if(iOS == true) $("body").addClass("nothover");
	
        $("#tocBtn").on("click", function () {
            if ($(this).hasClass("active")) $(this).removeClass("active");
            else $(this).addClass("active");
            toggleTOC();
        });
        $("#backBtn").on("click", function () {
            location.href = Books.c_s_LIBRARY_URL;
        });
        $("#tocmainheader").on("click", function () {
            Book.tocview.loadtocpage();
        });
        resize();
        $(".ui-loader").hide();
        $(".ui-page").css({
            "min-height": "",
            "max-height": $(window).height() + "px"
        });
	
});

window.onorientationchange = function(){
	resize();
}

$(window).resize(function(){
	resize();
});



function resize(){
    try {
        var window_width = $(window).width();
        var window_height = $(window).height();
        var header_height = $("header").height();
        $(".bookBoxWrap_out").height(window_height - (header_height));
        //Set Player Height
        $("#epubViewerWrapper").height($(".bookBoxWrap_out").height() - (parseInt($(".bookBoxWrap").css("padding-top")) + parseInt($(".navigationArrow").height()) +  (parseInt($(".navigationArrow").css('margin-top')) * 2) + parseInt($(".bookBoxWrap").css("padding-bottom")) + 52));
        $(".toc_tooltip .toc_tooltip_middle").height($("#epubViewerWrapper").height() - 50);
    } catch (e) {
        alert("Within resize: " + e.message);
    }
}

function toggleTOC () {
    if ($("#tocBtn").hasClass("active")) {
        $(".toc_tooltip").slideDown(500);
    } else{
        $(".toc_tooltip").slideUp(500);
    }
}

function displayFrame () {
	//Animation
	$('#bookViewer').stop().fadeTo("slow", 1);
}

function resolveURL (url, base_url) {
  var doc      = document
    , old_base = doc.getElementsByTagName('base')[0]
    , old_href = old_base && old_base.href
    , doc_head = doc.head || doc.getElementsByTagName('head')[0]
    , our_base = old_base || doc_head.appendChild(doc.createElement('base'))
    , resolver = doc.createElement('a')
    , resolved_url
    ;
  our_base.href = base_url;
  resolver.href = url;
  resolved_url  = resolver.href; // browser magic at work here

  if (old_base) old_base.href = old_href;
  else doc_head.removeChild(our_base);
  return resolved_url;
}

function loadJS (path) {
    var scriptBooklist;
    scriptBooklist = document.createElement('script');
    scriptBooklist.type = "text/javascript";
    scriptBooklist.src = path;
    window.document.head.appendChild(scriptBooklist);
}

function addNativeBridge () {        

 if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {           
  //$("#nativebridge").attr("src", "js/NativeBridge.js");
  loadJS('../js/NativeBridge.js')
 } else {            
        $("#nativebridge").remove();
 }
}