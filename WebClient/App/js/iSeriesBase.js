// JavaScript

window.$_GET = function (sParam) {
    var oVar = {},
		sQueryString = (document.location? document.location.search: '') || (window.location? window.location.search: ''),
		oRegex = new RegExp('.+\=.+', '');
		
	if (sQueryString) {
		sQueryString = sQueryString.replace(/^\?*/, '')
								   .replace(/\&{2,}/, '&');
		var aQueryStringParts = sQueryString.split('&');
		for (var iIdx = 0; iIdx < aQueryStringParts.length; iIdx++) {
			if (aQueryStringParts[iIdx].match(oRegex)) {
				aQueryParamChunks = aQueryStringParts[iIdx].split('=');
				sValue = aQueryParamChunks.last();
				if (
					sValue == 'undefined' ||
					sValue == 'null'
				) {
					continue;
				}
				oVar[aQueryParamChunks.first()] = sValue;
			}
		}
	}
    if (typeof sParam == 'undefined' || sParam == null) {
		return oVar;
    }
    if (sParam in oVar) {
		return oVar[sParam];
    }
    return '';
};

function ISeriesBase (poConfig) {
	if (typeof this.init === 'function') {
		this.init();
	}
}

ISeriesBase.prototype.render = function () {};
ISeriesBase.prototype.resize = function () {};
ISeriesBase.prototype._confirm = function (oConfig) {
	var oSelf = this,
		sDivId = 'dialog',
		sTitle = jQuery('title').text(),
		sMessage = 'Are you sure ?',
		sYesLabel = 'Yes',
		sNoLabel = 'No';
	
	if ('title' in oConfig) { sTitle = oConfig['title']; }
	if ('yesLabel' in oConfig) { sYesLabel = oConfig['yesLabel']; }
	if ('noLabel' in oConfig) { sNoLabel = oConfig['noLabel']; }
	if ('message' in oConfig) { sMessage = oConfig['message']; }
	if ('divId' in oConfig) {
		if (jQuery('#' + oConfig['divId']).length > 0) {
			sDivId = oConfig['divId'];
		}
	}
	if (!('yes' in oConfig)) {
		oConfig['yes'] = function () {
			jQuery('#' + sDivId).dialog('close');
		};
	}
	else if (typeof oConfig['yes'] != 'function') {
		oConfig['yes'] = function () {
			jQuery('#' + sDivId).dialog('close');
		};
	}
	if (!('no' in oConfig)) {
		oConfig['no'] = function () {
			jQuery('#' + sDivId).dialog('close');
		};
	}
	else if (typeof oConfig['no'] != 'function') {
		oConfig['no'] = function () {
			jQuery('#' + sDivId).dialog('close');
		};
	}
	
	oButtonConfig = {};
	oButtonConfig[sYesLabel] = function () {
		oConfig['yes'].call(jQuery('#' + sDivId).get(0));
		jQuery(this).dialog('close');
	}
	oButtonConfig[sNoLabel] = function () {
		oConfig['no'].call(jQuery('#' + sDivId).get(0));
		jQuery(this).dialog('close');
	};
	
	try { jQuery('#' + sDivId).dialog("destroy"); } catch (e) { }
	jQuery('#' + sDivId)
		.attr('title', sTitle)
		.html(sMessage)
		.dialog({
			autoOpen:	true,
			resizable: 	false,
			draggable:	true,
			height:		175,
			width:		450,
			modal: 		true,
			buttons:	oButtonConfig,
			open:		function (event, ui) {
				jQuery('#' + sDivId).parent('.ui-dialog').addClass('Ilit_alert_box');
			}
		});
};
ISeriesBase.prototype._alert = function (mixConfig, fOkCallback) {
   	var oSelf = this,
		oConfig = mixConfig,
		sDivId = ((oConfig['divId'] !== undefined)? oConfig['divId']: 'dialog'),
		sTitle = jQuery('title').text(),
		sMessage = ' ',
		oButtonConfig = {
			"Ok":	function () {
				if (typeof fOkCallback == 'function') {
					fOkCallback.call();
				}
				jQuery('#' + sDivId).dialog('close');
			}
		};
	
	if (oConfig['title'] !== undefined) { sTitle = oConfig['title'] || sTitle; }
	if (oConfig['message'] !== undefined) {
		sMessage = oConfig['message'];
	}
	else if (typeof oConfig === 'string') {
		sMessage = oConfig + '';
	}
	if (oConfig['divId'] !== undefined) {
		if (jQuery('#' + oConfig['divId']).length > 0) {
			sDivId = oConfig['divId'];
		}
	}
	
	try { jQuery('#' + sDivId).dialog("destroy"); } catch (e) { }
	jQuery('#' + sDivId)
		.attr('title', sTitle)
		.html(sMessage)
		.dialog({
			autoOpen:	true,
			resizable: 	false,
			draggable:	true,
			height:		175,
			width:		450,
			modal: 		true,
			buttons:	oButtonConfig,
			open:		function (event, ui) {
				jQuery('#' + sDivId)
					.parent('.ui-dialog')
						.addClass('Ilit_alert_box');
			}
		});
};
ISeriesBase.prototype.bindHeaderSlider = function (pSliderDiv,pTotalWeeks, pSwipeIndex, pPrevArrow, pNextArrow, pChildDiv,fCallback) {
	var oSelf = this;	
	$("." + pSliderDiv).slick({
			slidesToShow: (pTotalWeeks >= 9) ? 9 : 3, // 3,
			slidesToScroll: 5,
			asNavFor: '',
			infinite: (pTotalWeeks > 9) ? true : false,
			dots: false,
			centerMode: true,
			focusOnSelect: true,
			arrows : (pTotalWeeks > 9) ? true  : false,
			prevArrow: $("." + pPrevArrow),
			nextArrow: $("." + pNextArrow),
			// centerPadding: '80px', //
			variableWidth: true,
			draggable: false,
			speed: 1200
		});
		$("." +pChildDiv).css("width","76px");
		if (pTotalWeeks < 10 ) {
			$("." + pPrevArrow).hide();
			$("." + pNextArrow).hide();
		}else{
			$("." + pPrevArrow).show();
			$("." + pNextArrow).show();
		}
		$("." + pSliderDiv).slick('slickGoTo', (pSwipeIndex - 1));
		
		$("." + pSliderDiv).on('afterChange', function(event, slick, currentSlide, nextSlide){
		$("." + pChildDiv).removeClass("weekselected");
		$("." +pChildDiv+"[data-weekid='" + (currentSlide+1) + "']").addClass("weekselected");
		if(typeof fCallback === 'function'){
			fCallback.call(currentSlide,oSelf);
		}
	});

};
String.prototype.toJSObject = function () {
	var oSelf = this;
	oSelf = oSelf.replace(/\’/g, '&#39;')
				 .replace(/\'/g, '&#39;')
				 .replace(/\n/g, '\\n')
				 .replace(/\“/g, '&#34;')
				 .replace(/\”/g, '&#34;');
				 
	/*
		.replace(/\"/g, '"')
		.replace(/\\\\/g, '\\')
	*/
				 
	try {
		var oObject = JSON.parse(oSelf);
		return oObject;
	}
	catch (oException) {
		
	}
	return {};
};
String.prototype.camelize = function () {
	var oSelf = this;
	var iLastChar = '';
	var sResultant = '';
	for (var i = 0; i < oSelf.length; i++) {
		if (i == 0) {
			sResultant = sResultant + oSelf.charAt(i).toUpperCase();
			iLastChar = oSelf.charCodeAt(i);
			continue;
		}
		var iAscii = oSelf.charCodeAt(i);
		var cChar = oSelf.charAt(i);
		if (
			(iAscii >= 65 && iAscii <= 90) ||	// Uppercase
			(iAscii >= 97 && iAscii <= 122)		// Lowercase
		) {
			if (!(
				(iLastChar >= 65 && iLastChar <= 90) ||	// Uppercase
				(iLastChar >= 97 && iLastChar <= 122)	// Lowercase
			)) {
				sResultant = sResultant + cChar.toUpperCase();
			}
			else {
				sResultant = sResultant + cChar;
			}
		}
		iLastChar = iAscii;
	}
	return sResultant;
};
String.prototype.trim = function (cChar) {
	var oSelf = this;
	cChar = (typeof cChar == 'undefined'? '\\s': cChar);
	var oRegex = new RegExp('^' + cChar + '+|' + cChar + '+$', 'g');
	return oSelf.replace(oRegex, '');
};
String.prototype.endsWith = function (sPattern, bIgnoreCase) {
	var oSelf = this;
	if (
		typeof sPattern == 'undefined' ||
		sPattern == null ||
		this.length < sPattern.length
	) {
		return false;
	}
	if (typeof bIgnoreCase != 'boolean') {
		bIgnoreCase = false;
	}
	for (var iPIdx = sPattern.length - 1, iSIdx = this.length - 1; iPIdx >= 0; iPIdx--) {
		var cChar4mP = sPattern.charAt(iPIdx),
			cChar4mS = this.charAt(iSIdx--);
		if (bIgnoreCase === true) {
			cChar4mP = cChar4mP.toUpperCase();
			cChar4mS = cChar4mS.toUpperCase();
		}
		if (cChar4mP != cChar4mS) {
			return false;
		}
	}
	return true;
};
String.prototype.startsWith = function (sPattern, bIgnoreCase) {
	var oSelf = this;
	if (
		typeof sPattern == 'undefined' ||
		sPattern == null ||
		this.length < sPattern.length
	) {
		return false;
	}
	if (typeof bIgnoreCase != 'boolean') {
		bIgnoreCase = false;
	}
	for (var iPIdx = 0, iSIdx = 0; iPIdx < sPattern.length; iPIdx++) {
		var cChar4mP = sPattern.charAt(iPIdx),
			cChar4mS = this.charAt(iSIdx++);
		if (bIgnoreCase === true) {
			cChar4mP = cChar4mP.toUpperCase();
			cChar4mS = cChar4mS.toUpperCase();
		}
		if (cChar4mP != cChar4mS) {
			return false;
		}
	}
	return true;
};
String.prototype.pluralize = function () {
	var sWord = this.trim();
		aRules = [
			{match:	/(m)an$/gi,					replace: '$1en'},
			{match:	/(pe)rson$/gi,				replace: '$1ople'},
			{match:	/(child)$/gi,				replace: '$1ren'},
			{match:	/^(ox)$/gi,					replace: '$1en'},
			{match:	/(ax|test)is$/gi,			replace: '$1es'},
			{match:	/(octop|vir)us$/gi,			replace: '$1i'},
			{match:	/(alias|status)$/gi,		replace: '$1es'},
			{match:	/(bu)s$/gi,					replace: '$1ses'},
			{match:	/(buffal|tomat|potat)o$/gi,	replace: '$1oes'},
			{match:	/([ti])um$/gi,				replace: '$1a'},
			{match:	/sis$/gi,					replace: 'ses'},
			{match:	/(?:([^f])fe|([lr])f)$/gi,	replace: '$1$2ves'},
			{match:	/(hive)$/gi,				replace: '$1s'},
			{match:	/([^aeiouy]|qu)y$/gi,		replace: '$1ies'},
			{match:	/(x|ch|ss|sh|zz)$/gi,		replace: '$1es'},
			{match:	/(matr|vert|ind)ix|ex$/gi,	replace: '$1ices'},
			{match:	/([m|l])ouse$/gi,			replace: '$1ice'},
			{match:	/(quiz)$/gi,				replace: '$1zes'},
			{match:	/s$/gi,						replace: 's'},
			{match:	/$/gi,						replace: 's'}
		];
	
	for (var iIndex = 0; iIndex < aRules.length; iIndex++) {
		var oRule = aRules[iIndex],
			oFind = oRule.match,
			sReplaceWith = oRule.replace;
			
		if (sWord.match(oFind)) {
			return sWord.replace(oFind, sReplaceWith);
		}
	}
	return sWord;
};
String.prototype.reverse = function () {
	return this.split('').reverse().join('');
};
// JavaScript counterpart for PHP strip_tags
String.prototype.stripTags = function (sInput, sAllowed) {
	sAllowed = (((sAllowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	// making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var oTags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		oCommentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return sInput.replace(oCommentsAndPhpTags, '').replace(oTags, function($0, $1) {
		return sAllowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
};
/**
 * Pads a string with given string
 * @method render
 * @param {String} psPadWith [Optional, default '']
 * @param {Number} piPadLength [Optional, default 0]
 * @param {Number} piPadWhere [-1: left, 1: right, Optional, default: -1]
 * @return {String}
 */
String.prototype.pad = function (psPadWith, piPadLength, piPadWhere) {
	var iPadLength = parseInt(piPadLength) || 0,
		iPadWhere = parseInt(piPadWhere) || -1,
		sResultant = this.slice(0);
	
	if (typeof psPadWith !== 'string') { psPadWith = ''; }
	if (iPadLength < 0) { iPadLength = 0; }
	if ([1, -1].indexOf(iPadWhere) === -1) { iPadWhere = -1; }
	
	for (var iI = iPadLength; iI > -1; iI--) {
		sResultant = (
			iPadWhere < 0?
			psPadWith + sResultant:
			sResultant + psPadWith
		);
	}
	
	return sResultant;
};

Array.prototype.first = function () {
	if (this.length) {
		return this[0];
	}
	return false;
};

Array.prototype.fetch = function (iIndex) {
	if (this.length > iIndex) {
		return this[iIndex];
	}
	return false;
};

Array.prototype.last = function () {
	if (this.length) {
		return this[this.length - 1];
	}
	return false;
};

Array.prototype.randomize = function () {
	var iArrayLength = this.length,
		aResultant = [],
		aIndexes = [],
		iRandomIndex = 0;
	
	for (var iIndex = 0; iIndex < iArrayLength; iIndex++) {
		do {
			iRandomIndex = oUtility.getRandomNumberBetween(0, iArrayLength - 1);
		} while (aIndexes.indexOf(iRandomIndex) > -1);
		aResultant.push(this.fetch(iRandomIndex));
		aIndexes.push(iRandomIndex);
	}
	
	return aResultant;
};

window.objectKeys = function (oObject) {
	var aKeys = new Array ();
	for (var i in oObject) {
		if (typeof oObject[i] != 'function') {
			aKeys.push(i);
		}
	}
	return aKeys;
};

window.isObjectEmpty = function (oObject) {
	return (objectKeys(oObject).length == 0);
};

jQuery.fn.extend({
	filterByData:	function (sProp, sValue) {
		return this.filter(function() {
			return jQuery(this).data(sProp) == sValue;
		});
	}
});

jQuery.monitor = function (oConfig) {
	var oSettings =	{},
		iInterval = 100, // in miliseconds
		fCondition = function () {
			jQuery.noop();
			return true;
		},
		fCallback = function () {
			jQuery.noop();
		},
		iIteration = 0,
		oParams = {};
		
	oSettings = jQuery.extend(true, oSettings, oConfig);
	if ('interval' in oSettings) {
		iInterval = oSettings['interval'];
	}
	if ('if' in oSettings && typeof oSettings['if'] == 'function') {
		fCondition = oSettings['if'];
	}
	if ('then' in oSettings && typeof oSettings['then'] == 'function') {
		fCallback = oSettings['then'];
	}
	if (typeof oSettings['params'] == 'object') {
		oParams = jQuery.extend({}, oParams, oSettings['params']);
	}
	var fRepeat = function (fCondition, iInterval, fCallback, oParams) {
		iIteration++;
		if (fCondition() == false) {
			if (typeof oConfig['breakAfter'] == 'number') {
				if (parseInt(oConfig['breakAfter']) > 0) {
					if (iIteration * iInterval >= oConfig['breakAfter']) {
						if (typeof oConfig['errorCallback'] == 'function') {
							oConfig['errorCallback'].call(oSettings, fCallback, oParams);
						}
						return;
					}
				}
			}
			if (typeof oConfig['stopAfter'] == 'number') {
				if (parseInt(oConfig['stopAfter']) > 0) {
					if (iIteration * iInterval >= oConfig['stopAfter']) {
						if (typeof oConfig['errorCallback'] == 'function') {
							oConfig['errorCallback'].call(oSettings, fCallback, oParams);
						}
						return;
					}
				}
			}
			setTimeout(function () {
				fRepeat(fCondition, iInterval, fCallback, oParams);
			}, iInterval);
		}
		else {
			fCallback(oParams);
		}
	};
	if (typeof oConfig['beforeStart'] == 'function') {
		oConfig['beforeStart'].call();
	}
	fRepeat(fCondition, iInterval, fCallback, oParams);
};

//JQUERY PLUGIN TO SELECT TEXT MODIFIED TO SET BACKGROUND
jQuery.fn.selectText = function(){
	var doc = document
		, element = this[0]
		, range, selection
	;
	$('.highlight').removeClass('highlight');
	$(element).addClass('highlight');
	
	try {
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
	} catch (e) { /* console.log(e); */ }
};

window.ALERT = function (sMessage) {
	var oDiv = jQuery('<div/>'),
		sTitle = jQuery('title').text();
		
	sMessage = String(sMessage);
	if (
		!('sAlertDivId' in window) ||
		typeof window['sAlertDivId'] == 'undefined' ||
		window['sAlertDivId'] == null
	) {
		do {
			window['sAlertDivId'] = 'dialog-' + oUtility.getRandomNumber(4);
		} while (jQuery('#' + window['sAlertDivId']).length > 0);
	}
	oDiv.attr('id', window['sAlertDivId']);
	jQuery('body').append(oDiv);
	jQuery('#' + window['sAlertDivId'])
		.attr('id', window['sAlertDivId'])
		.attr('title', sTitle)
		.html(sMessage)
		.dialog({
			autoOpen:	true,
			resizable: 	false,
			draggable:	true,
			height:		'auto',
			width:		450,
			modal: 		true,
			position:	{ my:"center center", at:"center center" },
			open:		function (event, ui) {
				jQuery('#' + window['sAlertDivId']).css({
					'max-height':	250,
					'overflow-y':	'auto'
				})
				jQuery('#' + window['sAlertDivId'])
					.parent('.ui-dialog')
						.addClass('Ilit_alert_box')
						.css({
							zIndex: 		5000,
							'font-size':	'12px'
						})
							.prev('.ui-widget-overlay')
								.css({zIndex: 4999});
				jQuery('#' + window['sAlertDivId'])
					.parent('.ui-dialog')
						.find('.ui-button')
							.css({
								'font-size':		'12px',
								'text-transform':	'uppercase'
							});
							
				jQuery('#' + window['sAlertDivId']).dialog('option', 'buttons', [
					{
						text: "Ok",
						click: function() {
							$(this).dialog("close"); 
						}
					}
				]);
			}
		});
};

var oUtility = new (function () {
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
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6})$/;
				if (!sRegex.test(oConfig['background-color']) && oConfig['background-color'] != 'none') {
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
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6}|none|transparent)$/;
				if (!sRegex.test(oConfig['foreground-color'])) {
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
			for (var sProp in oConfig['box-style']) {
				if (sProp == 'height') {
					dHeight = oConfig['box-style'][sProp].replace('px', '');
					dTop = Math.ceil(($(window).height() - parseFloat(dHeight)) / 2);
					continue;
				}
				if (sProp == 'width') {
					dWidth = oConfig['box-style'][sProp].replace('px', '');
					dLeft = Math.ceil(($(window).width() - parseFloat(dWidth)) / 2);
					continue;
				}
				sBoxStyle = sBoxStyle + (sBoxStyle.length > 0? ' ': '') + sProp + ':' + oConfig['box-style'][sProp] + ';'
			}
			if (typeof oConfig['box-style']['background'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + ';';
			}
			if (typeof oConfig['box-style']['border-radius'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' border-radius:20px;';
			}
		}
		else {
			sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + '; border-radius:20px;';
		}
		
		oConfig['background-color'] = oConfig['background-color'].replace('#', '');
		
		jQuery('.custom-loader').remove();
		for (var sProp in oStyleInfo) {
			sStyle = (sStyle.length? ' ': '') + sStyle + sProp + ':' + oStyleInfo[sProp] + ';';
		}
		sStyle = sStyle + ' opacity:' + oConfig['opacity'] + '; filter:alpha(opacity=' + (oConfig['opacity'] * 100) + ');';
               jQuery('body').append(
			'<div class="custom-loader" id="' + sLoaderId + '" style="background-color:#' + oConfig['background-color'] + '; ' + sStyle + '"></div>\
			<div style="text-align:center; color:#000; z-index:' + (oStyleInfo['z-index'] + 1) + '; position:fixed; left:' + dLeft + 'px; top:' + dTop + 'px; width:' + dWidth + 'px; height:' + dHeight + 'px; line-height:' + dHeight + 'px;' + sBoxStyle + '" id="' + sLoaderId + '-content">\
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
        this.showCustomLoader = function (oConfig,obj) {
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
				'height':		'310px',
				'width':		jQuery(window).width() + 'px',
				'position':		'absolute',
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
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6})$/;
				if (!sRegex.test(oConfig['background-color']) && oConfig['background-color'] != 'none') {
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
				var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6}|none|transparent)$/;
				if (!sRegex.test(oConfig['foreground-color'])) {
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
			for (var sProp in oConfig['box-style']) {
				if (sProp == 'height') {
					dHeight = oConfig['box-style'][sProp].replace('px', '');
					dTop = Math.ceil((310 - parseFloat(dHeight)) / 2);
					continue;
				}
				if (sProp == 'width') {
					dWidth = oConfig['box-style'][sProp].replace('px', '');
					dLeft = Math.ceil(($(window).width() - parseFloat(dWidth)) / 2);
					continue;
				}
				sBoxStyle = sBoxStyle + (sBoxStyle.length > 0? ' ': '') + sProp + ':' + oConfig['box-style'][sProp] + ';'
			}
			if (typeof oConfig['box-style']['background'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + ';';
			}
			if (typeof oConfig['box-style']['border-radius'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' border-radius:20px;';
			}
		}
		else {
			sBoxStyle = sBoxStyle + ' background-color:#' + oConfig['foreground-color'] + '; border-radius:20px;';
		}
		
		oConfig['background-color'] = oConfig['background-color'].replace('#', '');
		
		jQuery('.custom-loader').remove();
		for (var sProp in oStyleInfo) {
			sStyle = (sStyle.length? ' ': '') + sStyle + sProp + ':' + oStyleInfo[sProp] + ';';
		}
		sStyle = sStyle + ' opacity:' + oConfig['opacity'] + '; filter:alpha(opacity=' + (oConfig['opacity'] * 100) + ');';
                  var object;
                if (typeof obj !== 'undefined') {object = obj;}
                    else{object = 'body';}
		
		jQuery(object).append(
			'<div class="custom-loader" id="' + sLoaderId + '" style="background-color:#' + oConfig['background-color'] + '; ' + sStyle + '"></div>\
			<div style="text-align:center; color:#000; z-index:' + (oStyleInfo['z-index'] + 1) + '; position:absolute; left:' + dLeft + 'px; top:90px; width:' + dWidth + 'px; height:75px; line-height:' + dHeight + 'px;' + sBoxStyle + '" id="' + sLoaderId + '-Content" class="custom-loaderImg">\
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
					oSelf.hideCustomLoader();
				})
		}
		return false;
	};
	this.isLoaderShown = function () {
		return bLoaderShown;
	};
	this.hideLoader = function () {
		if (jQuery('#' + sLoaderId).length > 0) {
			jQuery('#' + sLoaderId).fadeOut('fast', function () {
				jQuery(this).remove();
				jQuery('#' + sLoaderId + '-content').remove();
			});
			bLoaderShown = false;
		}
	};
        this.hideCustomLoader = function () {
		if (jQuery('#' + sLoaderId).length > 0) {
			jQuery('#' + sLoaderId).fadeOut('fast', function () {
				jQuery(this).remove();
				jQuery('#' + sLoaderId + '-Content').remove();
			});
			bLoaderShown = false;
		}
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
			alert(sResultantString);
			var oObject = eval('(' + sResultantString + ')');
			return oObject;
		}
		catch (oException) {
			alert(oException);
		}
		return null;
	};
	this.requireOnce = function (sFile, fCallback) {
		var oSelf = this;
		
		if (jQuery('script[src$="' + sFile + '"]').length) {
			if (typeof fCallback == 'function') {
				fCallback.call();
			}
			return;
		}
		
		var oScript = document.createElement('script');
		oScript.setAttribute('type', 'text/javascript');
		oScript.setAttribute('src', sFile);
		oScript.onload = function () {
			fCallback.call();
		};
		document.getElementsByTagName('head')[0].appendChild(oScript);
	};
	this.unblockElement = function (poConfig) {
		if (jQuery('' + poConfig['section']).length == 0) {
			throw "Element not found !!!";
			return false;
		}
		var oBlockedElement = jQuery('' + poConfig['section']),
			oCustomBlocker = jQuery('' + poConfig['section']).find('.custom-blocker'),
			sBlockerID = oCustomBlocker.prop('id');
		
		oBlockedElement.css('position', 'relative');
		jQuery('#' + sBlockerID).remove();
		jQuery('#' + sBlockerID + '-content').remove();
	};
	this.blockElement = function (poConfig) {
		if (jQuery('' + poConfig['section']).length == 0) {
			throw "Element not found !!!";
			return false;
		}
		poConfig['blocker'] = 'custom-blocker-' + this.getRandomNumber(4);
		var oStyleInfo = {
				'height':		jQuery('' + poConfig['section']).height() + 'px',
				'width':		jQuery('' + poConfig['section']).width() + 'px',
				'position':		'absolute',
				'z-index':		9999,
				'display':		'none',
				'left':			'0px',
				'top':			'0px',
				'text-align':	'center'
			},
			sStyle = '',
			dHeight = 100,
			dWidth = 150,
			dTop = Math.ceil((jQuery('' + poConfig['section']).height() - dHeight) / 2),
			dLeft = Math.ceil((jQuery('' + poConfig['section']).width() - dWidth) / 2),
			sBoxStyle = '',
			sBlockerID = poConfig['blocker'];
			
		poConfig = jQuery.extend({
			'message': 			'Loading. Please wait&hellip;',
			'background-color':	'CDCDCD',
			'foreground-color':	'CDCDCD',
			'click-to-hide':	true
		}, poConfig);
		
		if (typeof poConfig['message'] == 'undefined' || poConfig['message'] == null) { poConfig['message'] = 'Loading. Please wait&hellip;'; }
		if (typeof poConfig['background-color'] == 'undefined' || poConfig['background-color'] == null) {
			poConfig['background-color'] = 'CDCDCD';
		}
		else {
			var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6})$/;
			if (!sRegex.test(poConfig['background-color']) && poConfig['background-color'] != 'none') {
				poConfig['background-color'] = 'CDCDCD';
			}
		}
		
		if (typeof poConfig['foreground-color'] == 'undefined' || poConfig['foreground-color'] == null) {
			poConfig['foreground-color'] = poConfig['background-color'];
		}
		else {
			var sRegex = /^#{0,}([A-F0-9a-f]{3,3}|[A-F0-9a-f]{6,6}|none|transparent)$/;
			if (!sRegex.test(poConfig['foreground-color'])) {
				poConfig['foreground-color'] = poConfig['background-color'];
			}
		}
		
		if (typeof poConfig['click-to-hide'] !== 'boolean') { poConfig['click-to-hide'] = true; }
		if (typeof poConfig['opacity'] !== 'number') { poConfig['opacity'] = 0.3; }
		else if (parseFloat(poConfig['opacity']) < 0 || parseFloat(poConfig['opacity']) > 1) { poConfig['opacity'] = 0.3; }
		
		if (typeof poConfig['box-style'] === 'object') {
			for (var sProp in poConfig['box-style']) {
				if (sProp == 'height') {
					dHeight = poConfig['box-style'][sProp].replace('px', '');
					dTop = Math.ceil((jQuery('' + poConfig['section']).height() - parseFloat(dHeight)) / 2);
					continue;
				}
				if (sProp == 'width') {
					dWidth = poConfig['box-style'][sProp].replace('px', '');
					dLeft = Math.ceil((jQuery('' + poConfig['section']).width() - parseFloat(dWidth)) / 2);
					continue;
				}
				sBoxStyle = sBoxStyle + (sBoxStyle.length > 0? ' ': '') + sProp + ':' + poConfig['box-style'][sProp] + ';'
			}
			if (typeof poConfig['box-style']['background'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' background-color:#' + poConfig['foreground-color'] + ';';
			}
			if (typeof poConfig['box-style']['border-radius'] == 'undefined') {
				sBoxStyle = sBoxStyle + ' border-radius:20px;';
			}
		}
		else {
			sBoxStyle = sBoxStyle + ' background-color:#' + poConfig['foreground-color'] + '; border-radius:20px;';
		}
		
		poConfig['background-color'] = poConfig['background-color'].replace('#', '');
		
		oSelf.unblockElement(poConfig);
		for (var sProp in oStyleInfo) { sStyle = (sStyle.length? ' ': '') + sStyle + sProp + ':' + oStyleInfo[sProp] + ';'; }
		sStyle = sStyle + ' opacity:' + poConfig['opacity'] + '; filter:alpha(opacity=' + (poConfig['opacity'] * 100) + ');';
		jQuery('' + poConfig['section']).append(
			'<div class="custom-blocker" id="' + sBlockerID + '" style="background-color:#' + poConfig['background-color'] + '; ' + sStyle + '"></div>\
			<div style="text-align:center; color:#000; z-index:' + (oStyleInfo['z-index'] + 1) + '; position:absolute; left:' + dLeft + 'px; top:' + dTop + 'px; width:' + dWidth + 'px; height:' + dHeight + 'px; line-height:' + dHeight + 'px;' + sBoxStyle + '" id="' + sBlockerID + '-content">\
				' + poConfig['message'] + '\
			</div>'
		);
		jQuery('#' + sBlockerID).show();
		if (typeof poConfig['after-load'] == 'function') { poConfig['after-load'].call(oSelf); }
		
		if (poConfig['click-to-hide']) {
			jQuery('#' + sBlockerID)
				.off('click tap')
				.on('click tap', function () {
					oSelf.unblockElement(poConfig);
				})
		}
		return false;
	};
})();

var oPlatform = {
    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isIOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isWindows: function() {
		//return navigator.userAgent.match(/Windows(?=WebView)/i);
		return navigator.userAgent.match(/Windows.*WebView/i);
    },
	isBrowser: function () {
		return !this.isDevice();
    },
    isDevice: function() {
		return (this.isAndroid() || this.isBlackBerry() || this.isIOS() || this.isWindows());
    }
};

var oDragAndDrop = new (function () {
	var oDragOptions = {
			appendTo: "body",
			revertDuration: 100,
			containment: 'window',
			refreshPositions: false,
			revert: 'invalid',
			zIndex: 99999,
			scroll: true,
			helper: function() {
				var oClone = $(this).clone(true);
				return oClone;
			}
		},
		oDropOptions = {
			accept:		'.draggable_box',
			tolerance:	'pointer'
		};
	
	this.imposeDraggable = function (mixElement, oDragOpts, fStopCallback) {
		var aElements = null;
		if (typeof mixElement == 'string') {
			if (jQuery('' + mixElement).length > 0) {
				aElements = $('' + mixElement);
			}
		}
		else if (
			mixElement instanceof jQuery &&
			typeof mixElement.jquery == 'string'
		) {
			aElements = mixElement;
		}
		
		if (typeof oDragOpts != 'object') {
			oDragOpts = {};
		}
		
		if (typeof fStopCallback != 'function') {
			fStopCallback = jQuery.noop;
		}
		
		if (aElements != null) {
			oDragOptions = {
				appendTo: "body",
				revertDuration: 100,
				refreshPositions: false,
				revert: 'invalid',
				zIndex: 99999,
				scroll: true,
				helper: function() {
					var oClone = $(this).clone(true);
					return oClone;
				}
			};
			oDragOpts['stop'] = fStopCallback;
			oDragOptions = jQuery.extend(true, oDragOptions, oDragOpts);
			try { aElements.draggable('destroy') } catch (oException) {}
			aElements.draggable(oDragOptions);
		}
	};
	
	this.imposeDroppable = function (mixElement, oDropOpts, fDropCallback) {
		var aElements = null;
		if (typeof mixElement == 'string') {
			if (jQuery('' + mixElement).length > 0) {
				aElements = $('' + mixElement);
			}
		}
		else if (
			mixElement instanceof jQuery &&
			typeof mixElement.jquery == 'string'
		) {
			aElements = mixElement;
		}
		
		if (typeof oDropOpts != 'object') {
			oDropOpts = {};
		}
		
		if (typeof fDropCallback != 'function') {
			fDropCallback = jQuery.noop;
		}
		
		if (aElements != null) {
			oDropOptions = {
				accept:		'.draggable_box',
				tolerance:	'pointer'
			};
			oDropOpts['drop'] = fDropCallback;
			oDropOptions = jQuery.extend(true, oDropOptions, oDropOpts);
			try { aElements.droppable('destroy') } catch (oException) {}
			aElements.droppable(oDropOptions);
		}
	};
	
	this.removeDraggable = function (mixElements) {
		var aElements = null;
		if (typeof mixElements == 'string') {
			if (jQuery('' + mixElements).length > 0) {
				aElements = $('' + mixElements);
			}
		}
		else if (
			mixElements instanceof jQuery &&
			typeof mixElements.jquery == 'string'
		) {
			aElements = mixElements;
		}
		
		if (aElements != null) {
			try {
				for (var iIndex = 0; iIndex < aElements.length; iIndex++) {
					try {
						aElements.eq(iIndex).draggable('destroy');
					}
					catch (oExp) {}
				}
				return true;
			}
			catch (oException) {
				return false;
			}
		}
		return false;
	};
	
	this.removeDroppable = function (mixElements) {
		var aElements = null;
		if (typeof mixElements == 'string') {
			if (jQuery('' + mixElements).length > 0) {
				aElements = $('' + mixElements);
			}
		}
		else if (
			mixElements instanceof jQuery &&
			typeof mixElements.jquery == 'string'
		) {
			aElements = mixElements;
		}
		
		if (aElements != null) {
			try {
				aElements.droppable('destroy');
				return true;
			}
			catch (oException) {
				return false;
			}
		}
		return false;
	};
})();

var oSortable = new (function () {
	var oSortOptions = {
		
	};
	
	this.imposeSortable = function (mixElements, oSortOpts, fStopCallback) {
		var aElements = null;
		if (typeof mixElements == 'string') {
			if (jQuery('' + mixElements).length > 0) {
				aElements = jQuery('' + mixElements);
			}
		}
		else if (
			mixElements instanceof jQuery &&
			typeof mixElements.jquery == 'string'
		) {
			aElements = mixElements;
		}
		
		if (typeof oSortOpts != 'object') {
			oSortOpts = {};
		}
		
		if (typeof fStopCallback != 'function') {
			fStopCallback = jQuery.noop;
		}
		
		if (aElements != null) {
			oSortOptions = jQuery.extend(true, oSortOptions, oSortOpts);
			oSortOptions['stop'] = fStopCallback;
			aElements.sortable(oSortOptions);
		}
	};
	
	this.removeSortable = function (mixElements) {
		var aElements = null;
		if (typeof mixElements == 'string') {
			if (jQuery('' + mixElements).length > 0) {
				aElements = jQuery('' + mixElements);
			}
		}
		else if (
			mixElements instanceof jQuery &&
			typeof mixElements.jquery == 'string'
		) {
			aElements = mixElements;
		}
		
		if (aElements != null) {
			try {
				aElements.sortable('destroy');
				return true;
			}
			catch (oException) {
				return false;
			}
		}
		return false;
	}
})();

var Point = function () {
	var aParams = Array.prototype.slice.call(arguments),
		x = null, y = null,
		sMode = 'PRODUCTION';
	if (
		typeof aParams == 'undefined' ||
		!(aParams instanceof Array) ||
			aParams.length == 0 ||
			aParams.length > 2
	) {
		return null;
	}
	
	if (typeof aParams[0] == 'object') {
		if (aParams[0] instanceof Point) {
			x = aParams[0].getX();
			y = aParams[0].getY();
		}
		else if (aParams[0] instanceof Array) {
			switch (aParams[0].length) {
				case 1:
				case '1':
					var coord = parseFloat(aParams[0].first());
					if (!isNaN(coord)) {
						x = y = coord;
					}
					break;
				case 2:
				case '2':
					var coord1 = parseFloat(aParams[0].first()),
						coord2 = parseFloat(aParams[0].last());
					if (!isNaN(coord1)) {
						x = coord1;
					}
					if (!isNaN(coord2)) {
						y = coord2;
					}
					break;
				default:
					if (aParams[0].length > 2) {
						var coord1 = parseFloat(aParams[0].first()),
							coord2 = parseFloat(aParams[0].last());
						if (!isNaN(coord1)) {
							x = coord1;
						}
						if (!isNaN(coord2)) {
							y = coord2;
						}
					}
					break;
			}
		}
		else {
			if (
				(aParams[0].hasOwnProperty('X') || aParams[0].hasOwnProperty('x')) &&
				(aParams[0].hasOwnProperty('Y') || aParams[0].hasOwnProperty('y'))
			) {
				x = aParams[0][aParams[0].hasOwnProperty('X') ? 'X': 'x'];
				y = aParams[0][aParams[0].hasOwnProperty('Y') ? 'Y': 'y'];
			}
			else {				
				var aCoords = jQuery.map(aParams[0], function(dCoord, index) {
					return [dCoord];
				});
				var oTempPoint = new Point(aCoords);
				x = oTempPoint.getX();
				y = oTempPoint.getY();
				delete oTempPoint;
			}
		}
	}
	else if (typeof aParams[0] == 'number') {
		x = aParams[0];
		if (typeof aParams[1] == 'number') {
			y = aParams[1];
		}
		else {
			x = y;
		}
	}
	console.log('X: ' + x + ', Y: ' + y);
	
	this.getX = function () {
		return x;
	};
	
	this.getY = function () {
		if (y == null) {
			y = x;
		}
		return y;
	};
	
	this.isBoundedBy = function (mixElement) {
		var oElement;
		if (
			mixElement instanceof jQuery &&
			typeof mixElement.jquery == 'string'
		) {
			oElement = mixElement;
		}
		else {
			oElement = jQuery(mixElement);
		}
		
		var oTopLeft = new Point(oElement.offset()),
			dWidth = (
				oElement.width() +
				parseFloat(oElement.css('padding-left').replace('px', '')) +
				parseFloat(oElement.css('padding-right').replace('px', '')) +
				parseFloat(oElement.css('margin-left').replace('px', '')) +
				parseFloat(oElement.css('margin-right').replace('px', '')) +
				parseFloat(oElement.css('border-left-width').replace('px', '')) +
				parseFloat(oElement.css('border-right-width').replace('px', ''))
			),
			dHeight = (
				oElement.height() +
				parseFloat(oElement.css('padding-top').replace('px', '')) +
				parseFloat(oElement.css('padding-bottom').replace('px', '')) +
				parseFloat(oElement.css('margin-top').replace('px', '')) +
				parseFloat(oElement.css('margin-bottom').replace('px', '')) +
				parseFloat(oElement.css('border-top-width').replace('px', '')) +
				parseFloat(oElement.css('border-bottom-width').replace('px', ''))
			),
			oTopRight = new Point(oTopLeft.getX() + dWidth, oTopLeft.getY()),
			oBottomLeft = new Point(oTopLeft.getX(), oTopLeft.getY() + dHeight),
			oBottomRight = new Point(oTopLeft.getX() + dWidth, oTopLeft.getY() + dHeight);
		
		return (
			this.isToTheRightOf(oTopLeft) &&
			this.isToTheLeftOf(oTopRight) &&
			this.isAbove(oBottomRight) &&
			this.isBelow(oTopRight)
		);
	};
	
	this.isToTheLeftOf = function (oPoint) {
		var bReturnValue = (x <= oPoint.getX());
		if (sMode == 'DEBUG') {
			console.log('(' + this.getX() + ', ' + this.getY() + ').isToTheLeftOf((' + oPoint.getX() + ', ' + oPoint.getY() + ')): ' + bReturnValue);
		}
		return bReturnValue;
	};
	
	this.isToTheRightOf = function (oPoint) {
		var bReturnValue = (x >= oPoint.getX());
		if (sMode == 'DEBUG') {
			console.log('(' + this.getX() + ', ' + this.getY() + ').isToTheRightOf((' + oPoint.getX() + ', ' + oPoint.getY() + ')): ' + bReturnValue);
		}
		return bReturnValue;
	};
	
	this.isAbove = function (oPoint) {
		var bReturnValue = (y <= oPoint.getY());
		if (sMode == 'DEBUG') {
			console.log('(' + this.getX() + ', ' + this.getY() + ').isAbove((' + oPoint.getX() + ', ' + oPoint.getY() + ')): ' + bReturnValue);
		}
		return bReturnValue;
	};
	
	this.isBelow = function (oPoint) {
		var bReturnValue = (y >= oPoint.getY());
		if (sMode == 'DEBUG') {
			console.log('(' + this.getX() + ', ' + this.getY() + ').isBelow((' + oPoint.getX() + ', ' + oPoint.getY() + ')): ' + bReturnValue);
		}
		return bReturnValue;
	};
	
	this.coinsidesVerticallyWith = function (oPoint) {
		return (y == oPoint.getY());
	};
	
	this.coinsidesHorizontallyWith = function (oPoint) {
		return (x == oPoint.getX());
	};
	
	this.setMode = function (sNewMode) {
		sNewMode = sNewMode.toUpperCase();
		if (
			sNewMode == 'PRODUCTION' ||
			sNewMode == 'DEBUG'
		) {
			sMode = sNewMode;
		}
	};
};

window.formatNumber = function (number, iDecimalPlaces) {
	if (typeof iDecimalPlaces != 'number' || iDecimalPlaces < 0) {
		iDecimalPlaces = 1;
	}
    return Math.round(number);
};
