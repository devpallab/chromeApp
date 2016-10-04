/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function resize () {
    try {
        var window_width = $(window).width();
        var window_height = $(window).height();
        var header_height = $("header").length == 0 ? 0 : $("header").height();
        var loader = $(".ui-loader").height();
        var actual_height = window_height - header_height - loader;
        $("section").height(actual_height);
    } catch (e) {
        alert("Within resize: " + e.message);
    }
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

function escapeHtml(string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
}

/**
* loadJS method
* @param path : Source path for JS file
* @param callback : callback method which executes after loading of JS file
* @return void;
*/
function loadJS (path, callback) {
	var scriptBooklist;
	scriptBooklist = document.createElement('script');
	scriptBooklist.type = "text/javascript";
	scriptBooklist.src = path;
	if (typeof callback == 'function') {
		scriptBooklist.onload = callback;
	}
	window.document.head.appendChild(scriptBooklist);
}

function loadCheck (flag, callback) {
    try {
        if (flag != null && eval(flag) != "") {
            callback();
        } else {
            setTimeout(function () {
                loadCheck(flag, callback);
            }, 100);
        }
    } catch (excp) {
        setTimeout(function () {
            loadCheck(flag, callback);
        }, 100);
    }
}

/* function addNativeBridge () {        

	if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) {           
		//$("#nativebridge").attr("src", "js/NativeBridge.js");
		loadJS('js/NativeBridge.js')
	} else {            
		//do nothing
	}
} */


/*
 *
 * param: string text
 * return: string text with words wrapped with span
 *
 */
function returnDraggableTxt(val, sClassName){
	var sClassName = typeof sClassName != "undefined" ? sClassName : "draggable_word";
	var sTagName = typeof sClassName != "undefined" ? "z" : "span";
	
    var tagRE = /([^<]*)(<(?:\"[^\"]*\"|'[^']*'|[^>'\"]*)*>)([^<]*)/g,
        match,
        result = [],
        i = 0;

    while(match = tagRE.exec(val)) {
        var text1 = match[1].split(/\s+/),
            len1 = text1.length;

        var text2 = match[3].split(/\s+/),
            len2 = text2.length;

        var l=0;
        var r=0;
        var s='';
        var wrd='';
        var wrd1='';
        var wrd2='';
        for(var tIdx = 0; tIdx < len1; tIdx++ )
        {
            /* trim word */
            s = text1[tIdx];
            if($.inArray( s, GENERAL.c_a_SPECIAL_WORDS ) == -1)
            {         
                l=0; 
                r=s.length -1;

                while(l < s.length && $.inArray( s[l], GENERAL.c_a_SPECIAL_CHARACTERS ) > -1 )
                { l++; }
                while(r > l && $.inArray( s[r], GENERAL.c_a_SPECIAL_CHARACTERS ) > -1)
                { r-=1; }

                wrd =  s.substring(l, r+1);
                wrd1 = (l > 0)?s.substring(0, l-1):'';
                wrd2 = (r < s.length -1)?s.substring(r+2, s.length -1):'';
            }
            else
            {
                wrd = s;
				wrd1 = '';
				wrd2 = '';
            }
            
            result[i++] = wrd1+'<'+sTagName+' class="'+sClassName+'">' + wrd.trim('ì').trim('î') + '</'+sTagName+'>'+wrd2;
        }

        result[i++] = match[2];

        for(var tIdx = 0; tIdx < len2; tIdx++ )
        {
            /* trim word */
            s = text2[tIdx];
            if($.inArray( s, GENERAL.c_a_SPECIAL_WORDS ) == -1)
            {         
                l=0; 
                r=s.length -1;

                while(l < s.length && $.inArray( s[l], GENERAL.c_a_SPECIAL_CHARACTERS ) > -1 )
                { l++; }
                while(r > l && $.inArray( s[r], GENERAL.c_a_SPECIAL_CHARACTERS ) > -1)
                { r-=1; }

                wrd =  s.substring(l, r+1);                
                wrd1 = (l > 0)?s.substring(0, l-1):'';
                wrd2 = (r < s.length -1)?s.substring(r+2, s.length -1):'';                
            }
            else
            {				
                wrd = s;
				wrd1 = '';
				wrd2 = '';
            }
			var sActualWord = wrd,
				aLeadingMatches,
				aTrailingMatches;
			
			sActualWord = wrd;
			aLeadingMatches = [];
			aTrailingMatches = [];
			
            result[i++] = wrd1 +
			(
				(
					(aLeadingMatches = sActualWord.match(/^(ì|ë)([.,\?!]*)/)) &&
					(aLeadingMatches.length > 0)
				)?
				(console.log(aLeadingMatches), (aLeadingMatches[1] + aLeadingMatches[2])):
				''
			) +
			'<'+sTagName+' class="'+sClassName+'">' +
				wrd.replace(/^(ì|ë)([.,\?!]*)/, '').replace(/([.,\?!]*)(î|í)$/, '') +
			'</'+sTagName+'>' +
			(
				(
					(aTrailingMatches = sActualWord.match(/([.,\?!]*)(î|í)$/)) &&
					(aTrailingMatches.length > 0)
				)?
				(console.log(aTrailingMatches), (aTrailingMatches[1] + aTrailingMatches[2])):
				''
			) +
			wrd2;    
        }
    }

    return(result.join(' '));
}


/*
 *
 * param: string text
 * return: string text with words wrapped with span
 *
 */
function returnWordSelectionTxt(val){
    
    var tagRE = /([^<]*)(<(?:\"[^\"]*\"|'[^']*'|[^>'\"]*)*>)([^<]*)/g,
        match,
        result = [],
        i = 0;

    while(match = tagRE.exec(val)) {
        var text1 = match[1].split(/\s+/),
            len1 = text1.length;

        var text2 = match[3].split(/\s+/),
            len2 = text2.length;
        //var re = new RegExp('(.|\\"||:,|!|\\\\?)', 'ig');
        for(var tIdx = 0; tIdx < len1; tIdx++ ) 
            //var temp_word_val = text1[tIdx].split(re).join('<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false"></span>');
            //console.log(temp_word_val);
            result[i++] = abc(text1[tIdx]);
                //'<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+text1[tIdx]+'</span>'
                //abc(text1[tIdx]);
            

        result[i++] = match[2];

        for(var tIdx = 0; tIdx < len2; tIdx++ ) 
            result[i++] = abc(text2[tIdx]);
                //'<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+text2[tIdx]+'</span>'
                //abc(text2[tIdx]);
            
    }

    return(result.join('<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false"> </span>'));
}


function abc(val){    
    if(val.indexOf(",")>-1){
        val = '<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+val.split(",")[0]+'</span>,';
    }else if(val.indexOf(".")>-1){
        val = '<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+val.split(".")[0]+'</span>.';
    }else if(val.indexOf("!")>-1){
        val = '<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+val.split("!")[0]+'</span>!';
    }else{
        val = '<span class="select_word" ontouchmove="IWTHighlightSlide.startSelection(this);" ontouchstart="IWTHighlightSlide.startSelection(this); return false;" onclick="IWTHighlightSlide.startSelection(this); return false;" contenteditable="false">'+val+'</span>';
    }
    return val;
}


/*
 *
 * param: string text
 * return: string text with words wrapped with span
 *
 */
function returnSentenceSelectionTxt(val, sClassName){
	var sClassName = typeof sClassName != 'undefined' ? sClassName : "";
	
	val = val.replace(/<em>/g, '[[em]]')
			.replace(/<\/em>/g, '[[/em]]')
			.replace(/<strong>/g, '[[strong]]')
			.replace(/<\/strong>/g, '[[/strong]]')
			.replace(/<span>/g, '')
			.replace(/<\/span>/g, '')
			.replace(/&quot;/g, '"');
	
	// innerRegX = /(\.|!|\?)+('|"|&quot;)*\s*/g, 
	
    var tagRE = /([^<]*)(<(?:\"[^\"]*\"|'[^']*'|[^>'\"]*)*>)([^<]*)/g,
		innerRegX = /[\.|\!|\?|\.\"|\!\"|\?\"|\.\'|\!\'|\?\'|\.\&#8220;|\?\&#8220;|\!\&#8220;|\.\&#8221;|\?\&#8221;|\!\&#8221;]\s(?=[A-Z0-9\'\"\&#8220;\8221;])/g, 
        matchStr, result = [], i = 0, cc=0;
	
    while(matchStr = tagRE.exec(val)) {

		var text1 = matchStr[1].replace(innerRegX, "||").split("||"),
			text1_trail = matchStr[1].match(innerRegX),
			len1 = text1.length;
			
		var text2 = matchStr[3].replace(innerRegX, "||").split("||"), 
			text2_trail = matchStr[3].match(innerRegX), 
			len2 = text2.length;
		
		for(var tIdx = 0; tIdx < len1; tIdx++ ) {
		
			var trailChar = "";
			if (
				text1_trail != null && 
				text1_trail.length > 0
			) {
				trailChar = (typeof text1_trail[tIdx] != 'undefined') ? text1_trail[tIdx] : '';
			}
			
			if (sClassName) {
				result[i++] = ' <z class="'+sClassName+'">' + text1[tIdx]  + trailChar + '</z>';  
			}
			else {
				result[i++] = ' <span class="select_sentence seqClass'+cc+'" data-seq="seqClass'+cc+'" onclick="IWTHighlightSlide.startSentenceSelection(this); return false;" contenteditable="false">' + text1[tIdx]  + trailChar + '</span>';
			}
			cc++;
		}

		result[i++] = matchStr[2];

		for(var tIdx = 0; tIdx < len2; tIdx++ ) {
			
			var trailChar = "";
			if(
				text2_trail != null && 
				text2_trail.length > 0
			){
				trailChar = (typeof text2_trail[tIdx] != 'undefined') ? text2_trail[tIdx] : '';
			}
		
			if (sClassName) {
				result[i++] = ' <z class="'+sClassName+'">' + text2[tIdx]  + trailChar + '</z>';  
			}
			else {
				result[i++] = ' <span class="select_sentence seqClass'+cc+'" data-seq="seqClass'+cc+'" onclick="IWTHighlightSlide.startSentenceSelection(this); return false;" contenteditable="false">' + text2[tIdx]  + trailChar + '</span>';
			}
			cc++;
		}
	}
	
	var retVal = result.join('');
	
	retVal = retVal.replace(/\[\[em\]\]/g,'<em>')
				.replace(/\[\[\/em\]\]/g, '</em>')
				.replace(/\[\[strong\]\]/g, '<strong>')
				.replace(/\[\[\/strong\]\]/g, '</strong>')
				.replace(/\[\[span\]\]/g, '')
				.replace(/\[\[\/span\]\]/g, '');
			 
    return retVal;
}

/*
 * param: string text
 * return: text after removing all html tags
*/
function stripHtmlTagsFromString(strInputCode){
	str = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
	str = str.replace(/(\r\n|\n|\r)/gm,"");
	str = str.replace(/\s\s\s+/g, ' ');
	return str.trim();
}

/*
 * param: string text, start offset, end offset
 * return: text of a particular length
*/
function getParticularString(strInputCode, startLimit, endLimit){
	return strInputCode.substr(startLimit, endLimit);
}

/**
 * Add Loader
 */
function addLoader(elem) {
    //  For Showing Loader
    var loaderImg = '<div style=" font-size: 13px;"><img src="media/loader.gif" style="margin-bottom: 15px;"><br />LOADING</div>';
    $(elem).css({'text-align':'center', 'top' : '45%', 'left': '50%', 'position' : 'absolute'}).html(loaderImg);
}

/**
 * Remove Loader
 */
function removeLoader(elem) {
    $(elem).removeAttr('style');
    $(elem).css({'opacity' : '0'});
    $(elem).html('');
}

/**
 * Number Formatting
 */
Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};

/**
 * Highlight Words by index
 */
function highlightWords(elem,data){
	var txt = elem.split('');
	
	$(data).each(function(k,val){		
		txt[val.startIndex] = val.prependStr + txt[val.startIndex];
		txt[val.endIndex] = txt[val.endIndex] + val.appendStr;
	});	
	return txt.join('');
}

/**
* convert special characters to code
*/
function SpecialCharToCode(para,inputData)
{	 
	para = para.replace(/\‚Äò/g, '&#39;');
	para = para.replace(/\‚Äô/g, '&#39;');
	para = para.replace(/\'/g, '&#39;');
	para = para.replace(/\n/g, '\\n');
	para = para.replace(/\‚Äú/g, '&#34;');
	para = para.replace(/\‚Äù/g, '&#34;');
	if(inputData == true){
		para = para.replace(/\"/g, '&#34;');
	}
	
	return para;
}

/**
* convert code to special characters
*/
function CodeToSpecialChar(para)
{
	para = para.replace(/\\n/g,'\n');
	para = para.replace(/&#39;/g,"'");	
	para = para.replace(/&#34;/g,'"');
	
	return para;
}

/**
* convert special quotes to normal
*/
function replaceChars(para)
{	
	para = para.replace(/\‚Äô/g, "'");
	para = para.replace(/\‚Äò/g, "'");	
	para = para.replace(/\n/g, " ");
	para = para.replace(/<br>/g," ");	
	para = para.replace(/<br \/>/g," ");
	para = para.replace(/\‚Äú/g, "\\\"");
	para = para.replace(/\‚Äù/g, "\\\"");	
	//para = para.replace(/\\/g, "\\\\");	
	return para;
}

/**
 * Append br tag for PKT
 */
function appendBrTag(data,elem){
	var brtxt = '';	
	var data = data.replace(/<br>/g,"\n").replace(/<br \/>/g,"\n");
	var paraelem = data.split("");
	idx  = data.indexOf(elem) + elem.length -1;	
		
	for (i = idx+1; i< data.length; i++) {		
		if (paraelem[i] == "\n") {			
			brtxt += '<br />';
		}
		else if (paraelem[i] == " ") {			
			brtxt += " ";
		}
		else {
			return brtxt;
		}
	}
	return brtxt;
}

/**
* extract text between two text
*/
function extractText(strToParse, strStart, strFinish){	
	if(strToParse.match(strStart + "(.*?)" + strFinish))
	{
		return strToParse.match(strStart + "(.*?)" + strFinish)[1];  
	}
	return '';
}

var sWindowsEventType = '';
if (window.navigator.pointerEnabled) {
	//sWindowsEventType = "pointerdown";
}
else if (window.navigator.msPointerEnabled) {
    //sWindowsEventType = "MSPointerDown";
}

var oBase64 = new (function () {
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	this.encode = function (input) {
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				 enc3 = enc4 = 64;
			}
			else if (isNaN(chr3)) {
				enc4 = 64;
			}
			
			output = output +
					 keyStr.charAt(enc1) +
					 keyStr.charAt(enc2) +
					 keyStr.charAt(enc3) +
					 keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);

		return output;
	}

	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			alert("There were invalid base64 characters in the input text.\n" +
				"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
				"Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
			
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		
		return unescape(output);
	}
})();

String.prototype.specialChar2ASCII = function () {
	var oRegex = /[^A-Za-z0-9\s\-]/g,
		mixMatches = null,
		sResult = this,
		cChar = '',
		iIndex = -1;
	
	if ((mixMatches = this.match(oRegex)) !== null) {
		for (var iIdx = 0; iIdx < mixMatches.length; iIdx++) {
			cChar = mixMatches[iIdx];
			
			iIndex = sResult.indexOf(cChar);
			if (iIndex > -1) {
				sResult = sResult.substr(0, iIndex) + '--' + cChar.charCodeAt(0) + '--' + sResult.substr(iIndex + cChar.length);
			}
		}
	}
	return sResult;
};

window.ASCII2SpecialChar = function (sString) {
	var sResult = sString,
		oRegex = /\-{2,2}[0-9]+\-{2,2}/g,
		mixMatches = null,
		sReplaceString = '',
		sReplaceWith = '',
		cChar = '';
	
	if ((mixMatches = sString.match(oRegex)) !== null) {
		for (var iIdx = 0; iIdx < mixMatches.length; iIdx++) {
			cChar = mixMatches[iIdx];
			sReplaceString = mixMatches[iIdx];
			sReplaceWith = String.fromCharCode(parseInt(sReplaceString.replace(/\-/g, '')));
			
			sResult = sResult.replace(sReplaceString, sReplaceWith);
		}
	}
	return sResult;
};

window.encodePKTSlideScore = function (oPKTResponse) {
	var oRegex = /[^A-Za-z\-_]/g,
		oReplica = {};
	
	if (typeof oPKTResponse != 'object') {
		return oPKTResponse;
	}
	if (oPKTResponse instanceof Array) {
		oReplica = [];
		for (var iIndex = 0; iIndex < oPKTResponse.length; iIndex++) {
			if (typeof oPKTResponse[iIndex] == 'string') {
				if (oPKTResponse[iIndex].match(oRegex)) {
					oReplica[iIndex] = encodeURIComponent(oPKTResponse[iIndex]);
				}
				else {
					oReplica[iIndex] = oPKTResponse[iIndex];
				}
			}
			else if (typeof oPKTResponse[iIndex] == 'object') {
				oReplica[iIndex] = window.encodePKTSlideScore(oPKTResponse[iIndex]);
			}
			else {
				oReplica[iIndex] = oPKTResponse[iIndex];
			}
		}
		return oReplica;
	}
	for (var sKey in oPKTResponse) {
		if (typeof oPKTResponse[sKey] == 'function') {
			continue;
		}
		if (typeof oPKTResponse[sKey] == 'string') {
			if (oPKTResponse[sKey].match(oRegex)) {
				oReplica[sKey] = encodeURIComponent(oPKTResponse[sKey]);
			}
			else {
				oReplica[sKey] = oPKTResponse[sKey];
			}
		}
		else if (typeof oPKTResponse[sKey] == 'object') {
			oReplica[sKey] = window.encodePKTSlideScore(oPKTResponse[sKey]);
		}
		else {
			oReplica[sKey] = oPKTResponse[sKey];
		}
	}
	return oReplica;
};
window.decodePKTSlideScore = function (oPKTResponse) {
	var oRegex = /[^A-Za-z\-_]/g,
		oReplica = {};
	if (typeof oPKTResponse != 'object') {
		return oPKTResponse;
	}
	if (oPKTResponse instanceof Array) {
		oReplica = [];
		for (var iIndex = 0; iIndex < oPKTResponse.length; iIndex++) {
			if (typeof oPKTResponse[iIndex] == 'string') {
				oReplica[iIndex] = decodeURIComponent(oPKTResponse[iIndex]);
			}
			else if (typeof oPKTResponse[iIndex] == 'object') {
				oReplica[iIndex] = window.decodePKTSlideScore(oPKTResponse[iIndex]);
			}
			else {
				oReplica[iIndex] = oPKTResponse[iIndex];
			}
		}
		return oReplica;
	}
	for (var sKey in oPKTResponse) {
		if (typeof oPKTResponse[sKey] == 'function') {
			continue;
		}
		if (typeof oPKTResponse[sKey] == 'string') {
			oReplica[sKey] = decodeURIComponent(oPKTResponse[sKey]);
		}
		else if (typeof oPKTResponse[sKey] == 'object') {
			oReplica[sKey] = window.decodePKTSlideScore(oPKTResponse[sKey]);
		}
		else {
			oReplica[sKey] = oPKTResponse[sKey];
		}
	}
	return oReplica;
};

window.replicate = function (oObject) {
	var oResult = {};
	
	if (oObject instanceof Array) {
		oResult = [];
		for (var iIndex = 0; iIndex < oObject.length; iIndex++) {
			var mixElement = (
				(typeof oObject[iIndex] == 'object')?
				replicate(oObject[iIndex]):
				oObject[iIndex]
			);
			oResult.push(mixElement);
		}
		return oResult;
	}
	
	for (var sKey in oObject) {
		if (typeof oObject[sKey] == 'function') {
			continue;
		}
		oResult[sKey] = (
			(typeof oObject[sKey] == 'object')?
			replicate(oObject[sKey]):
			oObject[sKey]
		);
	}
	return oResult;
};

var SINGLETON = new (function () {
	var oVariables = {},
		fCloneObject = function (mixObject) {
			if (typeof mixObject != 'object') {
				return mixObject;
			}
			
			if (mixObject == null) {
				return null;
			}
			
			if (mixObject instanceof Array) {
				var aClone = [];
				for (var iIndex = 0; iIndex < mixObject.length; iIndex++) {
					aClone.push(mixObject[iIndex]);
				}
				return aClone;
			}
			
			var oClone = {};
			for (var sKey in mixObject) {
				if (typeof mixObject[sKey] == 'object') {
					oClone[sKey] = fCloneObject(mixObject[sKey]);
					continue;
				}
				oClone[sKey] = mixObject[sKey];
			}
			return oClone;
		};
	
	this.create = function (sVariable, mixValue) {
		if (
			typeof sVariable != 'string' ||
			sVariable.length == 0
		) {
			return false;
		}
		
		if (typeof mixValue == 'undefined') {
			mixValue = null;
		}
		
		if (typeof oVariables[sVariable] == 'undefined') {
			oVariables[sVariable] = fCloneObject(mixValue);
		}
		return true;
	};
	
	this.get = function (sVariable) {		
		if (this.create(sVariable)) {
			if (oVariables[sVariable] != null) {
				if (typeof oVariables[sVariable]['mettreValeur'] != 'function') {
					oVariables[sVariable]['mettreValeur'] = fCloneObject;
				}
			}
			return oVariables[sVariable];
		}
	};
	
	this.set = function (sVariable, mixValue) {
		if (typeof oVariables[sVariable] != 'undefined') {
			oVariables[sVariable] = fCloneObject(mixValue);
			return true;
		}
		return false;
	};
})();

String.prototype.htmlEntities = function () {
	var oSpecialCharList = {
			"ñ":	"&#8211;",
			"ó":	"&#8212;",
			"°":	"&#161;",
			"ø":	"&#191;",
			"\"":	"&#34;",
			"ì":	"&#8220;",
			"î":	"&#8221;",
			"'":	"&#39;",
			"ë":	"&#8216;",
			"í":	"&#8217;",
			"´":	"&#171;",
			"ª":	"&#187;",
			"&":	"&#38;",
			"¢":	"&#162;",
			"©":	"&#169;",
			"˜":	"&#247;",
			">":	"&#62;",
			"<":	"&#60;",
			"µ":	"&#181;",
			"∑":	"&#183;",
			"∂":	"&#182;",
			"±":	"&#177;",
			"Ä":	"&#8364;",
			"£":	"&#163;",
			"Æ":	"&#174;",
			"ß":	"&#167;",
			"ô":	"&#153;",
			"•":	"&#165;",
			"∞":	"&#176;",
			"·":	"&#225;",
			"¡":	"&#193;",
			"‡":	"&#224;",
			"¿":	"&#192;",
			"‚":	"&#226;",
			"¬":	"&#194;",
			"Â":	"&#229;",
			"≈":	"&#197;",
			"„":	"&#227;",
			"√":	"&#195;",
			"‰":	"&#228;",
			"ƒ":	"&#196;",
			"Ê":	"&#230;",
			"∆":	"&#198;",
			"Á":	"&#231;",
			"«":	"&#199;",
			"È":	"&#233;",
			"…":	"&#201;",
			"Ë":	"&#232;",
			"»":	"&#200;",
			"Í":	"&#234;",
			" ":	"&#202;",
			"Î":	"&#235;",
			"À":	"&#203;",
			"Ì":	"&#237;",
			"Õ":	"&#205;",
			"Ï":	"&#236;",
			"Ã":	"&#204;",
			"Ó":	"&#238;",
			"Œ":	"&#206;",
			"Ô":	"&#239;",
			"œ":	"&#207;",
			"Ò":	"&#241;",
			"—":	"&#209;",
			"Û":	"&#243;",
			"”":	"&#211;",
			"Ú":	"&#242;",
			"“":	"&#210;",
			"Ù":	"&#244;",
			"‘":	"&#212;",
			"¯":	"&#248;",
			"ÿ":	"&#216;",
			"ı":	"&#245;",
			"’":	"&#213;",
			"ˆ":	"&#246;",
			"÷":	"&#214;",
			"ﬂ":	"&#223;",
			"˙":	"&#250;",
			"⁄":	"&#218;",
			"˘":	"&#249;",
			"Ÿ":	"&#217;",
			"˚":	"&#251;",
			"€":	"&#219;",
			"¸":	"&#252;",
			"‹":	"&#220;",
			"ˇ":	"&#255;",
			"¥":	"&#180;",
			"`":	"&#96;"
		},
		sHtml = this,
		sResult = '',
		cChar = '';
	
	for (var iI = 0; iI < sHtml.length; iI++) {
		cChar = sHtml.charAt(iI);
		
		if (
			typeof oSpecialCharList[cChar] != 'undefined' &&
			typeof oSpecialCharList[cChar] == 'string'
		) {			
			sResult += oSpecialCharList[cChar];
			continue;
		}
		
		sResult += cChar;
	}
	
	return sResult;
};

String.prototype.htmlEntitiesDecode = function () {
	var sResult = '',
		sHtml = this,
		cChar = '',
		sSpecialChar = '',
		bSpChar = false;
		oSpecialCharList = {
			'&#8211;':	'ñ',
			'&ndash;':	'ñ',
			
			'&#8212;':	'ó',
			'&mdash;':	'ó',
			
			'&#161;':	'°',
			'&iexcl;':	'°',
			
			'&#191;':	'ø',
			'&iquest;':	'ø',
			
			'&#34;':	'"',
			'&quot;':	'"',
			
			'&#8220;':	'ì',
			'&ldquo;':	'ì',
			
			'&#8221;':	'î',
			'&rdquo;':	'î',
			
			'&#39;':	'\'',
			
			'&#8216;':	'ë',
			'&lsquo;':	'ë',
			
			'&#8217;':	'í',
			'&rsquo;':	'í',
			
			'&#171;':	'´',
			'&laquo;':	'´',
			
			'&#187;':	'ª',
			'&raquo;':	'ª',
			
			'&#38;':	'&',
			'&amp;':	'&',
			
			'&#162;':	'¢',
			'&cent;':	'¢',
			
			'&#169;':	'©',
			'&copy;':	'©',
			
			'&#247;':	'˜',
			'&divide;':	'˜',
			
			'&#62;':	'>',
			'&gt;':		'>',
			
			'&#60;':	'<',
			'&lt;':		'<',
			
			'&#181;':	'µ',
			'&micro;':	'µ',
			
			'&#183;':	'∑',
			'&middot;':	'∑',
			
			'&#182;':	'∂',
			'&para;':	'∂',
			
			'&#177;':	'±',
			'&plusmn;':	'±',
			
			'&#8364;':	'Ä',
			'&euro;':	'Ä',
			
			'&#163;':	'£',
			'&pound;':	'£',
			
			'&#174;':	'Æ',
			'&reg;':	'Æ',
			
			'&#167;':	'ß',
			'&sect;':	'ß',
			
			'&#153;':	'ô',
			'&trade;':	'ô',
			
			'&#165;':	'•',
			'&yen;':	'•',
			
			'&#176;':	'∞',
			'&deg;':	'∞',
			
			'&#225;':	'·',
			'&aacute;':	'·',
			'&#193;':	'¡',
			'&Aacute;':	'¡',
			
			'&#224;':	'‡',
			'&agrave;':	'‡',
			'&#192;':	'¿',
			'&Agrave;':	'¿',
			
			'&#226;':	'‚',
			'&acirc;':	'‚',
			'&#194;':	'¬',
			'&Acirc;':	'¬',
			
			'&#229;':	'Â',
			'&aring;':	'Â',
			'&#197;':	'≈',
			'&Aring;':	'≈',
			
			'&#227;':	'„',
			'&atilde;':	'„',
			'&#195;':	'√',
			'&Atilde;':	'√',
			
			'&#228;':	'‰',
			'&auml;':	'‰',
			'&#196;':	'ƒ',
			'&Auml;':	'ƒ',
			
			'&#230;':	'Ê',
			'&aelig;':	'Ê',
			'&#198;':	'∆',
			'&AElig;':	'∆',
			
			'&#231;':	'Á',
			'&ccedil;':	'Á',
			'&#199;':	'«',
			'&Ccedil;':	'«',
			
			'&#233;':	'È',
			'&eacute;':	'È',
			'&#201;':	'…',
			'&Eacute;':	'…',
			
			'&#232;':	'Ë',
			'&egrave;':	'Ë',
			'&#200;':	'»',
			'&Egrave;':	'»',
			
			'&#234;':	'Í',
			'&ecirc;':	'Í',
			'&#202;':	' ',
			'&Ecirc;':	' ',
			
			'&#235;':	'Î',
			'&euml;':	'Î',
			'&#203;':	'À',
			'&Euml;':	'À',
			
			'&#237;':	'Ì',
			'&iacute;':	'Ì',
			'&#205;':	'Õ',
			'&Iacute;':	'Õ',
			
			'&#236;':	'Ï',
			'&igrave;':	'Ï',
			'&#204;':	'Ã',
			'&Igrave;':	'Ã',
			
			'&#238;':	'Ó',
			'&icirc;':	'Ó',
			'&#206;':	'Œ',
			'&Icirc;':	'Œ',
			
			'&#239;':	'Ô',
			'&iuml;':	'Ô',
			'&#207;':	'œ',
			'&Iuml;':	'œ',
			
			'&#241;':	'Ò',
			'&ntilde;':	'Ò',
			'&#209;':	'—',
			'&Ntilde;':	'—',
			
			'&#243;':	'Û',
			'&oacute;':	'Û',
			'&#211;':	'”',
			'&Oacute;':	'”',
			
			'&#242;':	'Ú',
			'&ograve;':	'Ú',
			'&#210;':	'“',
			'&Ograve;':	'“',
			
			'&#244;':	'Ù',
			'&ocirc;':	'Ù',
			'&#212;':	'‘',
			'&Ocirc;':	'‘',
			
			'&#248;':	'¯',
			'&oslash;':	'¯',
			'&#216;':	'ÿ',
			'&Oslash;':	'ÿ',
			
			'&#245;':	'ı',
			'&otilde;':	'ı',
			'&#213;':	'’',
			'&Otilde;':	'’',
			
			'&#246;':	'ˆ',
			'&ouml;':	'ˆ',
			'&#214;':	'÷',
			'&Ouml;':	'÷',
			
			'&#223;':	'ﬂ',
			'&szlig;':	'ﬂ',
			
			'&#250;':	'˙',
			'&uacute;':	'˙',
			'&#218;':	'⁄',
			'&Uacute;':	'⁄',
			
			'&#249;':	'˘',
			'&ugrave;':	'˘',
			'&#217;':	'Ÿ',
			'&Ugrave;':	'Ÿ',
			
			'&#251;':	'˚',
			'&ucirc;':	'˚',
			'&#219;':	'€',
			'&Ucirc;':	'€',
			
			'&#252;':	'¸',
			'&uuml;':	'¸',
			'&#220;':	'‹',
			'&Uuml;':	'‹',
			
			'&#255;':	'ˇ',
			'&yuml;':	'ˇ',
			
			'&#180;':	'¥',
			'&#96;':	'`'
		};
		
	for (var iI = 0; iI < sHtml.length; iI++) {
		cChar = sHtml.charAt(iI);
			
		if (cChar == '&') {
			if (bSpChar === true) {
				sResult += sSpecialChar;
			}
			sSpecialChar = '&';
			bSpChar = true;
		}
		else if (cChar == ';') {
			sSpecialChar += ';';
			if (
				typeof oSpecialCharList[sSpecialChar] != 'undefined' &&
				typeof oSpecialCharList[sSpecialChar] == 'string'
			) {
				sResult += oSpecialCharList[sSpecialChar];
				bSpChar = false;
			}
		}
		else {
			if (bSpChar !== true) {
				sResult += cChar;
			}
			else {
				sSpecialChar += cChar;
			}
		}
	}
	
	return sResult;
};

// Grade Assessment: Logic
oGradeAssessmentScoringLogic = {
	"0":	function (oItemAttemptSummary) {
		var sPrefix = 'grade-assessment',
			sTotalTestKey = ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST,
			sGEKey = ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT;
		
		if (sTotalTestKey.match(new RegExp('^' + sPrefix + '-'))) {
			; // Do nothing, we have what we need
		}
		else {
			var aTTKeyChunks = sTotalTestKey.split('-');
			aTTKeyChunks.splice(0, 1, sPrefix);
			sTotalTestKey = aTTKeyChunks.join('-');
		}
		
		if (sGEKey.match(new RegExp('^' + sPrefix + '-'))) {
			; // Do nothing, we have what we need
		}
		else {
			var aGEKeyChunks = sGEKey.split('-');
			aGEKeyChunks.splice(0, 1, sPrefix);
			sGEKey = aGEKeyChunks.join('-');
		}
		
		if (
			typeof oItemAttemptSummary[sTotalTestKey] == 'undefined' ||
			oItemAttemptSummary[sTotalTestKey] == null
		) {
			if (typeof oItemAttemptSummary[sGEKey] == 'undefined') {
				return null;
			}
			
			return oItemAttemptSummary[sGEKey];
		}
		
		if (typeof oItemAttemptSummary[sTotalTestKey][sGEKey] == 'undefined') {
			return null;
		}
		return oItemAttemptSummary[sTotalTestKey][sGEKey];
	},
	"1":	function (oItemAttemptSummary) {
		var sPrefix = 'ga',
			sTotalTestKey = ASSIGNMENTS.c_s_ASSESSMENT_TOTAL_TEST,
			sGEKey = ASSIGNMENTS.c_s_ASSESSMENT_GRADE_EQUIVALENT;
		
		if (sTotalTestKey.match(new RegExp('^' + sPrefix + '-'))) {
			; // Do nothing, we have what we need
		}
		else {
			var aTTKeyChunks = sTotalTestKey.split('-');
			aTTKeyChunks.splice(0, 1, sPrefix);
			sTotalTestKey = aTTKeyChunks.join('-');
		}
		
		if (sGEKey.match(new RegExp('^' + sPrefix + '-'))) {
			; // Do nothing, we have what we need
		}
		else {
			var aGEKeyChunks = sGEKey.split('-');
			aGEKeyChunks.splice(0, 1, sPrefix);
			sGEKey = aGEKeyChunks.join('-');
		}
		
		if (
			typeof oItemAttemptSummary[sTotalTestKey] == 'undefined' ||
			oItemAttemptSummary[sTotalTestKey] == null
		) {
			if (typeof oItemAttemptSummary[sGEKey] == 'undefined') {
				return null;
			}
			
			return oItemAttemptSummary[sGEKey];
		}
		
		if (typeof oItemAttemptSummary[sTotalTestKey][sGEKey] == 'undefined') {
			return null;
		}
		return oItemAttemptSummary[sTotalTestKey][sGEKey];
	}
};

window.isIOS = function (piVersion) {
	if (
		typeof navigator.platform != 'undefined' &&
		navigator.platform == 'iPad'
	) {
		var osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion),	
			iVerMajor = osVersion[1],
			iVerMinor = osVersion[2],
			iVerTrivial = (osVersion[3] | 0);
		osVersion = iVerMajor + '.' + iVerMinor + '.' + iVerTrivial;
		if (typeof piVersion == 'number') {
			return (parseInt(iVerMajor) == parseInt(piVersion));
		}
		return true;
	}
	return false;
};

window.geIOS = function (piVersion) {
	var iVersion = parseInt(piVersion) || 0;
	if (
		typeof navigator.platform != 'undefined' &&
		navigator.platform == 'iPad'
	) {
		var osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion),	
			iVerMajor = osVersion[1],
			iVerMinor = osVersion[2],
			iVerTrivial = (osVersion[3] | 0);
		osVersion = iVerMajor + '.' + iVerMinor + '.' + iVerTrivial;
		return (parseInt(iVerMajor) >= iVersion);
	}
	return false;
};

var oUtil = new (function () {
	var oSelf = this,
		sLoaderId = null,
		bLoaderShown = false;
	this.getRandomNumberBetween = function (iNumberFrom, iNumberTo) {
		return Math.floor(Math.random() * (iNumberTo - iNumberFrom + 1) + iNumberFrom);
	};
	this.getRandomNumber = function (iDigits) {
		var iRandom = 0;
		if (
			typeof iDigits == 'undefined' ||
			iDigits == null
		) {
			iDigits = 1;
		}
		do {
			iRandom = Math.round(Math.random() * Math.pow(10, iDigits));
		} while (iRandom < Math.pow(10, iDigits - 1));
		return iRandom;
	};
	this.showPopUp = function (oConfig) {
		this.showLoader(oConfig);
	};
	this.showLoader = function (oConfig) {
		if (bLoaderShown) {
			return false;
		}
		if (
			typeof sLoaderId == 'undefined' ||
			sLoaderId == null
		) {
			sLoaderId = 'custom-loader-' + this.getRandomNumber(4);
		}
		var oStyleInfo = {
				'height':		jQuery(window).height() + 'px',
				'width':		jQuery(window).width() + 'px',
				'position':		'fixed',
				'z-index':		9999,
				'display':		'none',
				'left':			'0px',
				'top':			'0px',
				'text-align':	'center'
			},
			sStyle = '',
			dHeight = 150,
			dWidth = 350,
			dTop = Math.ceil(($(window).height() - dHeight) / 2),
			dLeft = Math.ceil(($(window).width() - dWidth) / 2),
			sBoxStyle = '';
			
		if (
			typeof oConfig	== 'undefined' ||
			oConfig == null
		) {
			oConfig = {
				'message': 			'Loading. Please wait&hellip;',
				'background-color':	'CDCDCD',
				'foreground-color':	'CDCDCD',
				'click-to-hide':	true
			};
		}
		else {
			if (
				typeof oConfig['message'] == 'undefined' ||
				oConfig['message'] == null
			) {
				oConfig['message'] = 'Loading. Please wait&hellip;';
			}
			if (
				typeof oConfig['background-color'] == 'undefined' ||
				oConfig['background-color'] == null
			) {
				oConfig['background-color'] = 'CDCDCD';
			}
			else {
				var oRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6})$/;
				if (!oRegex.test(oConfig['background-color']) && oConfig['background-color'] != 'none') {
					oConfig['background-color'] = 'CDCDCD';
				}
			}
			
			if (
				typeof oConfig['foreground-color'] == 'undefined' ||
				oConfig['foreground-color'] == null
			) {
				oConfig['foreground-color'] = oConfig['background-color'];
			}
			else {
				var oRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6}|none|transparent)$/;
				if (!oRegex.test(oConfig['foreground-color'])) {
					oConfig['foreground-color'] = oConfig['background-color'];
				}
			}
			
			if (typeof oConfig['click-to-hide'] != 'boolean') {
				oConfig['click-to-hide'] = true;
			}
			if (typeof oConfig['opacity'] != 'number') {
				oConfig['opacity'] = 0.3;
			}
			else if (parseFloat(oConfig['opacity']) < 0 || parseFloat(oConfig['opacity']) > 1) {
				oConfig['opacity'] = 0.3;
			}
		}
		
		if (typeof oConfig['box-style'] == 'object') {
			oConfig['box-style']['line-height'] = parseInt(oConfig['box-style']['line-height']);
			if (isNaN(oConfig['box-style']['line-height'])) {
				oConfig['box-style']['line-height'] = dHeight + 'px';
			}
			else {
				oConfig['box-style']['line-height'] += 'px';
			}
			if (typeof oConfig['box-style']['text-align'] !== 'string') {
				oConfig['box-style']['text-align'] = 'center';
			}
			for (var sProp in oConfig['box-style']) {
				if (sProp == 'height') {
					dHeight = oConfig['box-style'][sProp].toString().replace('px', '');
					dTop = Math.ceil(($(window).height() - parseFloat(dHeight)) / 2);
					continue;
				}
				if (sProp == 'width') {
					dWidth = oConfig['box-style'][sProp].toString().replace('px', '');
					dLeft = Math.ceil(($(window).width() - parseFloat(dWidth)) / 2);
					continue;
				}
				sBoxStyle = sBoxStyle + (sBoxStyle.length > 0? ' ': '') + sProp + ':' + oConfig['box-style'][sProp] + ';'
			}
			if (typeof oConfig['box-style']['background'] == 'undefined') {
				oConfig['foreground-color'] = oConfig['foreground-color'].replace('#', '');
				sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + ';';
			}
			if (typeof oConfig['box-style']['border-radius'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' border-radius:20px;';
			}
		}
		else {
			oConfig['foreground-color'] = oConfig['foreground-color'].replace('#', '');
			sBoxStyle = sBoxStyle +
				' background-color:#' + oConfig['foreground-color'] + ';' +
				' border-radius:20px;' + 
				' text-align:center;';
		}
		
		oConfig['background-color'] = oConfig['background-color'].replace('#', '');
		
		jQuery('.custom-loader').remove();
		for (var sProp in oStyleInfo) {
			sStyle = (sStyle.length? ' ': '') + sStyle + sProp + ':' + oStyleInfo[sProp] + ';';
		}
		sStyle = sStyle + ' opacity:' + oConfig['opacity'] + '; filter:alpha(opacity=' + (oConfig['opacity'] * 100) + ');';
		jQuery('body').append(
			'<div class="custom-loader" id="' + sLoaderId + '" style="background-color:#' + oConfig['background-color'] + '; ' + sStyle + '"></div>\
			<div style="color:#000; z-index:' + (oStyleInfo['z-index'] + 1) + '; position:fixed; left:' + dLeft + 'px; top:' + dTop + 'px; width:' + dWidth + 'px; height:' + dHeight + 'px;' + sBoxStyle + '" id="' + sLoaderId + '-content">\
				' + oConfig['message'] + '\
			</div>'
		);
		jQuery('#' + sLoaderId).show();
		if (typeof oConfig['after-load'] == 'function') {
			oConfig['after-load'].call(oSelf);
		}
		bLoaderShown = true;
		if (oConfig['click-to-hide']) {
			jQuery('#' + sLoaderId)
				.off('click tap')
				.on('click tap', function () {
					oSelf.hideLoader();
				})
		}
		return false;
	};
	this.isLoaderShown = function () {
		return bLoaderShown;
	};
	this.hidePopUp = function () {
		this.hideLoader();
	};
	this.hideLoader = function () {
		if (jQuery('#' + sLoaderId).length > 0) {
			jQuery('#' + sLoaderId).fadeOut('fast', function () {
				jQuery(this).remove();
				jQuery('#' + sLoaderId + '-content').remove();
			});
			bLoaderShown = false;
		}
		// ILIT-1101
		if (jQuery('#' + sLoaderId + '-content').length > 0) {
			jQuery('#' + sLoaderId + '-content').fadeOut('fast', function () {
				jQuery(this).remove();
				jQuery('#' + sLoaderId + '-content').remove();
			});
			bLoaderShown = false;
		}
		// ILIT-1101
	};
	this.getLoaderID = function () {
		return sLoaderId;
	};
	this.isChrome = function () {
		if (navigator.userAgent.toLowerCase().match(/chrom(e|ium)/)) {
			return true;
		}
		return false;
	};
	this.isSafari = function () {
		return (navigator.userAgent.toLowerCase().indexOf('safari') != -1);
	};
	this.isWebkit = function () {
		return (this.isSafari() || this.isChrome());
	};
	this.filterByRange = function (aDataStore, aRange, sKey) {
		var aResultData = [];
		try {
			for (var iIdx = 0; iIdx < aRange.length; iIdx++) {
				for (var iJdx = 0; iJdx < aDataStore.length; iJdx++) {
					var oItem = aDataStore[iJdx],
						sItemKey = oItem[sKey];
					if (typeof aRange[iIdx] == 'string') {
						aRange[iIdx] = aRange[iIdx].toLowerCase();
					}
					if (typeof sItemKey == 'string') {
						sItemKey = sItemKey.toLowerCase();
					}
					if (aRange[iIdx] == sItemKey) {
						aResultData.push(oItem);
					}
				}
			}
			return aResultData;
		}
		catch (oException) {
			
		}
		return aDataStore;
	};
	this.printf = function () {
		var aParams = Array.prototype.slice.call(arguments);
		switch (aParams.length) {
			case 0:
				return '';
			case 1:
				return aParams[0];
			default:
				var sSubject = aParams[0],
					sResultant = '';
					
				if (typeof sSubject != 'string') {
					return '';
				}
				
				for (var i = 0, iReplaceIndex = 1; i < sSubject.length; i++) {
					var cChar = sSubject.charAt(i);
					if (cChar == '%') {
						if ((i + 1) < sSubject.length) {
							var cNextChar = sSubject.charAt(i + 1);
							switch (cNextChar) {
								case 'd':
								case 'D':
									try {
										var iParam = parseInt(aParams[iReplaceIndex]);
										if (!isNaN(iParam)) {
											sResultant += iParam.toString();
											iReplaceIndex++;
										}
										else {
											sResultant += cChar + cNextChar;
										}
										
									}
									catch (oException) {
										sResultant += cChar + cNextChar;
									}
									i++;
									continue;
								case 'f':
								case 'F':
									try {
										var fParam = parseFloat(aParams[iReplaceIndex]);
										if (!isNaN(iParam)) {
											sResultant += fParam.toFixed(2);
											iReplaceIndex++;
										}
										else {
											sResultant += cChar + cNextChar;
										}
									}
									catch (oException) {
										sResultant += cChar + cNextChar;
									}
									i++;
									continue;
								case 's':
								case 'S':
									try {
										var sParam = aParams[iReplaceIndex];
										sResultant += sParam;
										iReplaceIndex++;
									}
									catch (oException) {
										sResultant += cChar + cNextChar;
									}
									i++;
									continue;
								default:
									sResultant += cChar + cNextChar;
							}
							continue;
						}
					}
					sResultant += cChar;
				}
		}
		return sResultant;
	};
	this.encodeJSON = function (oObject) {
		var sEncodedString = '';
		if (
			!isObjectEmpty(oObject) &&
			!(oObject instanceof Array)
		) {
			sEncodedString += '<OPENBRACE>';
		}
		if (oObject instanceof Array) {
			sEncodedString += '<OPENSQUAREBRACKET>';
			for (var iIndex = 0; iIndex < oObject.length; iIndex++) {
				var mixElement = oObject[iIndex];
				if (typeof mixElement == 'function') {
					continue;
				}
				
				sEncodedString += (iIndex > 0? ',': '');
				if (typeof mixElement == 'object') {
					sEncodedString += this.encodeJSON(mixElement);
					continue;
				}
				switch (typeof mixElement) {
					case 'object':
						sEncodedString += this.encodeJSON(mixElement);
						break;
					case 'number':
					case 'boolean':
						sEncodedString += mixElement.toString();
						break;
					case 'string':
						sEncodedString += '<QUOTE>' + mixElement.replace(/\\r/g, '') + '<UNQUOTE>';
						break;
					case 'undefined':
						sEncodedString += 'undefined';
						break;
				}
			}
			sEncodedString += '<CLOSESQUAREBRACKET>';
		}
		else if (oObject == null) {
			sEncodedString += 'null';
		}
		else {
			var bFirstIndex = true;
			for (var sKey in oObject) {
				var mixElement = oObject[sKey];
				if (typeof mixElement == 'function') {
					continue;
				}
				sEncodedString += (bFirstIndex === true? '': ',') + '<QUOTE>' + sKey + '<UNQUOTE>:';
				switch (typeof mixElement) {
					case 'object':
						sEncodedString += this.encodeJSON(mixElement);
						break;
					case 'number':
					case 'boolean':
						sEncodedString += mixElement.toString();
						break;
					case 'string':
						sEncodedString += '<QUOTE>' + mixElement.replace(/\\r/g, '').replace('"', '\\"') + '<UNQUOTE>';
						break;
					case 'undefined':
						sEncodedString += 'undefined';
						break;
				}
				bFirstIndex = false;
			}
		}
		if (
			!isObjectEmpty(oObject) &&
			!(oObject instanceof Array)
		) {
			sEncodedString += '<CLOSEBRACE>';
		}
		return sEncodedString;
	};
	this.toJSON = function (sEncodedString) {
		var sResultantString = '';
		sResultantString = sEncodedString
								.replace(/<OPENBRACE>/g, '{')
								.replace(/<CLOSEBRACE>/g, '}')
								.replace(/<OPENSQUAREBRACKET>/g, '[')
								.replace(/<CLOSESQUAREBRACKET>/g, ']')
								.replace(/<QUOTE>/g, '"')
								.replace(/<UNQUOTE>/g, '"');
		
		try {
			var oObject = eval('(' + sResultantString + ')');
			return oObject;
		}
		catch (oException) {
			alert(oException);
		}
		return null;
	};
})();

function inSort (pA, paSortBy) {
	var iI, iJ, oElem = null, iSI, b2Continue = false;
	
	for (iI = 1; iI < pA.length; iI++) {
		oElem = $.extend({}, pA[iI]);
		
		for (iJ = iI - 1; iJ > -1; iJ--) {
			for (iSI = 0; iSI < paSortBy.length; iSI++) {
				b2Continue = false;
				if (pA[iJ][paSortBy[iSI]] > oElem[paSortBy[iSI]]) {
					pA[iJ + 1] = $.extend({}, pA[iJ]);
					b2Continue = true;
					break;
				}
				else if (pA[iJ][paSortBy[iSI]] == oElem[paSortBy[iSI]]) {
					continue;
				}
				break;
			}
			
			if (b2Continue === true) {
				continue;
			}
			break;
		}
		iJ++;
		pA[iJ] = $.extend({}, oElem);
	}
	
	return pA;
}

/*
 * Search a value in Object and returns the object node where found
 * @method searchValue
 * @param {Object} oList
 * @param {String} sSearchValue
 * @param {String} sSearchKey
 * @return: {Object} oResult
*/
function searchValue(oList, sSearchValue, sSearchKey) {
	var oVal = _.pluck(oList, sSearchKey) || [],
		oResult = {};
	
	$.each(oVal, function(k,v){			
			if (_.isObject(v)) {				
				if (_.contains(v, sSearchValue)) {										
					oResult = oList[k];					
				}
			}
			else {
				if (v == sSearchValue) {
					oResult = oList[k];									
				}
			}			
	});	
	return oResult;
};

jQuery.nativeCall = function (poConfig) {
	var oConfig = jQuery.extend({}, poConfig),
		iInterval = 500,
		iTimeOut = -1,
		iTotalWaitTime = 0,
		iWaitUntil = -1;
		
	if (oConfig['debug'] === true) {
		/* console.log("typeof window[oConfig['method']]: " + (typeof window[oConfig['method']]));
		console.log("typeof oConfig['globalResource']: " + (typeof oConfig['globalResource']));
		console.log(window[oConfig['globalResource']]); */
	}
	
	if (typeof window[oConfig['method']] != 'function' || typeof oConfig['globalResource'] !== 'string') {
		throw "Invalid request !!!";
		return;
	}
	
	if (typeof oConfig['beforeSend'] != 'function') { oConfig['beforeSend'] = jQuery.noop; }
	if (typeof oConfig['onComplete'] != 'function') { oConfig['onComplete'] = jQuery.noop; }
	if (typeof oConfig['onError'] != 'function') { oConfig['onError'] = jQuery.noop; }
	if (typeof oConfig['checkSuccess'] != 'function') {
		oConfig['checkSuccess'] = function (poServiceResponse) {
			return ((parseInt(poServiceResponse.Status) || 0) === 200);
		};
	}
	if (!(oConfig['inputParams'] instanceof Array)) { oConfig['inputParams'] = []; }
	if (isNaN(iInterval = parseInt(oConfig['interval'])) || !(iInterval > 0 && iInterval <= 500)) { iInterval = 500; }
	if (oConfig['emptyValue'] === undefined) { oConfig['emptyValue'] = null; }
	if (oConfig['debug'] !== true) { oConfig['debug'] = false; }
	if (isNaN(iWaitUntil = parseInt(oConfig['breakAfter'])) || iWaitUntil < iInterval) { iWaitUntil = -1; }
	if (oConfig['data'] === undefined) { oConfig['data'] = null; }
	
	oConfig['beforeSend']();
	window[oConfig['globalResource']] = oConfig['emptyValue'];
	window[oConfig['method']].apply(window, oConfig['inputParams']);
	if (iTimeOut > -1) {
		window.clearInterval(iTimeOut);
	}
	iTimeOut = setInterval(function () {
		if (oConfig['debug'] === true) {
			/* console.log(
				'(\n\twindow[oConfig[\'globalResource\']<<' + oConfig['globalResource'] + '>>]' + 
				'\n\t!==\n\toConfig[\'emptyValue\']<<' + JSON.stringify(oConfig['emptyValue']) + '>>\n)\t: ' +
				(window[oConfig['globalResource']] !== oConfig['emptyValue'])
			); */
		}
		iTotalWaitTime += iInterval;
		
		if (iWaitUntil > -1) {
			if (window[oConfig['globalResource']] === oConfig['emptyValue']) {
				if (iTotalWaitTime >= iWaitUntil) {
					if (oConfig['debug'] === true) {
						/* console.log(
							'(\n\tiTotalWaitTime<<' + iTotalWaitTime + '>>' + 
							'\n\t!==\n\tiWaitUntil<<' + iWaitUntil + '>>\n)\t: ' +
							(iTotalWaitTime >= iWaitUntil)
						); */
					}
					try {
						oConfig['onError'](oConfig['emptyValue'], undefined, oConfig['data']);
						window.clearInterval(iTimeOut);
					}
					catch (oException) {
						if (oConfig['debug'] === true) {
							//console.log('' + oException);
						}
						window.clearInterval(iTimeOut);
					}
					return;
				}
			}
		}
		
		if (window[oConfig['globalResource']] !== oConfig['emptyValue']) {
			try {
				if (oConfig['checkSuccess'](window[oConfig['globalResource']]) !== true) {
					oConfig['onError'](window[oConfig['globalResource']], undefined, oConfig['data']);
					window.clearInterval(iTimeOut);
					return;
				}
				oConfig['onComplete'](window[oConfig['globalResource']], oConfig['data']);
			}
			catch (oException) {
				try {
					oConfig['onError'](window[oConfig['globalResource']], oException, oConfig['data']);
				}
				catch (oCaughtException) {
					if (oConfig['debug'] === true) {
						console.log('Exception:\t' + JSON.stringify(oCaughtException.stack));
					}
				}
			}
			window.clearInterval(iTimeOut);
		}
	}, iInterval);
};

function fetchGradeCode (psGradeCode, psGradePrefix) {
	var aMatches = [],
		iGradeId = -1;
		
	if (psGradePrefix === undefined) {
		psGradePrefix = 'gr';
	}
		
	if (aMatches = psGradeCode.match(/^[a-z]*([0-9]+)$/)) {
		if (!isNaN(iGradeId = parseInt(aMatches[1]))) {
			return psGradePrefix + iGradeId;
		}
	}
	
	return '';
}

//SET POSITION FOR TEXT HELP MENU
function setPosTextHelp (offset,objWid) {
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
}