// JavaScript
function PageTemplate (poConfig) {
	poConfig = (
		(typeof poConfig !== 'object')?
		{}:
		poConfig
	) || {};

	var oSelf = this,
		layouts = {
			'1-column':			[
				'header',
				'content',
				'footer'
			],
			'2columns-left':	[
				'header',
				'content',
				'footer',
				'left'
			],
			'2columns-right':	[
				'header',
				'content',
				'footer',
				'right'
			],
			'3-columns':		[
				'header',
				'footer',
				'content',
				'left',
				'right'
			],
			'pop-up':			[
				'pop-up'
			]
		},
		layout = (
			(layouts[poConfig['layout']] !== undefined)?
			poConfig['layout']:
			'1-column'
		),
		oContainer = $(poConfig['container'] || '#wrapper'),
		oMainTemplate = $(poConfig['template'] || '#container'),
		dWindowHeight = (
			isIOS()?
			(
				geIOS(8)?
				(parseFloat(screen.availHeight) - (parent.APPTYPE == 'webclient'? 90: 30)): // 90 / 30: Found by inspection
				(
					Math.max(parseFloat(window.outerHeight), parseFloat($(window).height())) ||
					(parseFloat(screen.availHeight) - (parent.APPTYPE == 'webclient'? 90: 30))
				)
			):
			parseFloat($(window).height())
		),
		sModuleName = poConfig['title'] || 'Demo Page',
		sDemoImage = poConfig['demo-image'] || 'setup.png',
		oModel = {},
		oConfig = (poConfig || {}),
		bIsModelLoaded = false,
		oTemplateConfig = (poConfig['template-config'] || {}),
		aResizeConfig = (poConfig['resize-config'] || []),
		oUserData = {},
		oPreloadConfig = null;
	
	this.getLayout = function () { return JSON.parse('{ "' + layout + '": ' + JSON.stringify(layouts[layout]) + ' }'); };
	this.getModelConfig = function () { return oConfig['model-config'] || null; };
	this.getContainer = function () { return oContainer; };
	this.getWindowHeight = function () { return dWindowHeight; };
	this.getModuleName = function () { return sModuleName; };
	this.getMainTemplate = function () { return oMainTemplate; };
	this.getDemoImageName = function () { return sDemoImage; }
	this.getUserData = function (psKey) { return (oUserData[psKey] || oUserData); };
	this.getModelPart = function (psPart) {
		var sPart = psPart || '',
			aValidParts = layouts[layout].slice(0);
		
		if (aValidParts.indexOf(sPart) === -1) { return {}; }
		return JSON.parse(JSON.stringify(oModel[sPart] || {})) || {};
	};
	this.getModel = function (psPart) {
		var oModelPart = this.getModelPart(psPart);
		
		if (psPart === 'pre-load') { return JSON.parse(JSON.stringify(oModel['pre-load'])); }
		if ($.isEmptyObject(oModelPart)) {
			oModelPart = JSON.parse(JSON.stringify(oModel));
			delete oModelPart['pre-load'];
		}
		return oModelPart;
	};
	this.getIsModelLoaded = function () {
		return bIsModelLoaded;
	};
	this.getOnPageLoadComplete = function () {
		if (typeof oConfig['onPageLoadComplete'] === 'function') {
			return oConfig['onPageLoadComplete'];
		}
		return $.noop;
	};
	this.getOnInit = function () {
		if (typeof oConfig['onInit'] === 'function') {
			return oConfig['onInit'];
		}
		return $.noop;
	};
	this.getPreLoader = function () {
		if (typeof oConfig['pre-load'] === 'object') { return oConfig['pre-load']; }
		if (typeof oConfig['preLoad'] === 'object') { return oConfig['preLoad']; }
		return null;
	};
	this.getPreLoadData = function () {
		if (typeof oModel['pre-load'] === 'object') { return oModel['pre-load']; }
		return null;
	};
	
	this.setUserData = function (poUserData) {
		if (!$.isPlainObject(poUserData)) { poUserData = {}; }
		$.extend(oUserData, poUserData);
	};
	this.setModel = function (psPart, poModel) {
		if (
			$.isPlainObject(poModel) !== true &&
			$.isArray(poModel) !== true
		) {
			return oModel;
		}
		oModel[psPart] = poModel;
		return oModel;
	};
	this.setIsModelLoaded = function (pbIsModelLoaded) {
		bIsModelLoaded = (
			(typeof pbIsModelLoaded !== 'boolean')?
			pbIsModelLoaded:
			bIsModelLoaded
		);
	};
	
	this.getContainer = function () { return oContainer; };
	this.getWindowHeight = function () { return dWindowHeight; };
	this.getModuleName = function () { return sModuleName; };
	this.getMainTemplate = function () { return oMainTemplate; };
	this.getDemoImageName = function () { return sDemoImage; };
	this.getTemplateConfig = function () {
		var aLayout = layouts[layout];
		for (var iI = 0; iI < aLayout.length; iI++) {
			if ($('#' + oTemplateConfig[aLayout[iI]]).length === 0) {
				oTemplateConfig[aLayout[iI]] = aLayout[iI];
			}
		}
		return $.extend({}, oTemplateConfig);
	};
	this.getResizeConfig = function () {
		var aResizeCfg = aResizeConfig;
		return (
			$.isEmptyObject(aResizeConfig)?
			[]:
			aResizeCfg
		);
	};
	
	this.getOnInit().call(this);
	if (oPlatform.isIOS()) {
		loadJS('js/NativeBridge.js', function () {
			if ((oPreloadConfig = oSelf.getPreLoader()) !== null) {
				oSelf._nativeCall4ModelPart(
					oPreloadConfig,
					function (poResultant) {
						if (typeof oPreloadConfig['preProcess'] === 'function') {
							poResultant = oPreloadConfig['preProcess'].call(oSelf, poResultant);
						}
						oSelf.setModel('pre-load', poResultant);
						oSelf.init.call(oSelf);
					},
					{}, 0
				);
				return;
			}
			oSelf.init();
		});
	}
	else {
		if ((oPreloadConfig = oSelf.getPreLoader()) !== null) {
			oSelf._nativeCall4ModelPart(
				oPreloadConfig,
				function (poResultant) {
					if (typeof oPreloadConfig['preProcess'] === 'function') {
						poResultant = oPreloadConfig['preProcess'].call(oSelf, poResultant);
					}
					oSelf.setModel('pre-load', poResultant);
					oSelf.init.call(oSelf);
				},
				{}, 0
			);
			return;
		}
		else {
			this.init();
		}
	}
}

PageTemplate.prototype = new ISeriesBase();
PageTemplate.prototype.loadPart = function (sPart) {
	var oTemplateConfig = this.getTemplateConfig(),
		aModel = this.getModel(sPart);
	
	if ($('#' + oTemplateConfig[sPart]).length == 0) { return ' &nbsp; '; }
	try {
		return _.template(
			$('#' + oTemplateConfig[sPart]).html(),
			{
				'data':			(aModel || []),
				'CONSTANTS':	(this.CONSTANTS || {}),
				'$tpl':			{ 'loadPart':	_.template },
				'_':			{},
				'$util':		$.extend({}, _, { 'template': $.noop }),
				'$default':		(this.getPreLoadData() || {})
			}
		);
	}
	catch (oException) {
		return oException.toString()
	}
};
PageTemplate.prototype.loadModel = function (pfCallBack, iPartIndex) {
	if (this.getIsModelLoaded() === true) { return; }
	
	var oSelf = this,
		aModelConfig = this.getModelConfig() || [];
		
	if (typeof pfCallBack !== 'function') { pfCallBack = $.noop; }
	if (aModelConfig.length === 0) {
		pfCallBack.call(oSelf);
		oSelf.getOnPageLoadComplete().call(oSelf);
		return;
	}
	iPartIndex = parseInt(iPartIndex) || 0;
	oModelConfig = aModelConfig[iPartIndex];
	if (oModelConfig['part'] === undefined) { oModelConfig['part'] = 'main'; }
	if (typeof oModelConfig['debug'] !== 'boolean') { oModelConfig['debug'] = false; }
	if (
		typeof oModelConfig['method'] === 'string' &&
		typeof oModelConfig['globalResource'] === 'string'
	) {
		if (typeof oModelConfig['checkSuccess'] !== 'function') {
			oModelConfig['checkSuccess'] = function (poServiceResponse) {
				return ((parseInt(poServiceResponse.Status) || 0) === 200);
			};
		}
		$.nativeCall({
			'method':			oModelConfig['method'],
			'globalResource':	oModelConfig['globalResource'],
			'inputParams':		(
				(typeof oModelConfig['inputParams'] === 'function')?
				oModelConfig['inputParams'].call(oSelf, {}):
				(oModelConfig['inputParams'] || [])
			),
			'debug':			oModelConfig['debug'],
			'interval':			500,
			'breakAfter':		12500,
			'checkSuccess':		oModelConfig['checkSuccess'],
			'onComplete':		function (poServiceResponse) {
				var aModel = (
					oModelConfig['key'] !== undefined?
					poServiceResponse[oModelConfig['key']]:
					poServiceResponse
				);
				if (oModelConfig['filter'] !== undefined && oModelConfig['filter'] !== null) {
					var aMdl = [],
						bMatchFound = true;
					
					for (var iI = 0; iI < aModel.length; iI++) {
						bMatchFound = true;
						for (var sKey in oModelConfig['filter']) {
							if (aModel[iI][sKey] != oModelConfig['filter'][sKey]) {
								bMatchFound = false;
								break;
							}
						}
						if (bMatchFound === true) {
							if ($.isPlainObject(oModelConfig['preProcess'])) {
								for (var sField in oModelConfig['preProcess']) {
									if (typeof oModelConfig['preProcess'][sField] === 'function') {
										aModel[iI][sField] = oModelConfig['preProcess'][sField].call(oSelf, aModel[iI]);
									}
								}
							}
							aMdl.push(aModel[iI]);
						}
					}
					aModel = aMdl;
				}
				oSelf.setModel(oModelConfig['part'], aModel);
				if (iPartIndex == (aModelConfig.length - 1)) {
					oSelf.setIsModelLoaded(true);
					pfCallBack.call(oSelf);
					oSelf.getOnPageLoadComplete().call(oSelf);
					return;
				}
				oSelf.loadModel(pfCallBack, iPartIndex + 1);
			},
			'onError':			function (poServiceResponse) {
				oSelf.setModel(oModelConfig['part'], {});
				if (iPartIndex == (aModelConfig.length - 1)) {
					oSelf.setIsModelLoaded(true);
					pfCallBack.call(oSelf);
					oSelf.getOnPageLoadComplete().call(oSelf);
					return;
				}
				oSelf.loadModel(pfCallBack, iPartIndex + 1);
			}
		});
	}
	else if ($.isArray(oModelConfig['methods'])) {
		oSelf._nativeCall4ModelPart(
			oModelConfig['methods'],
			function (poResultant) {
				if (typeof oModelConfig['preProcess'] === 'function') {
					poResultant = oModelConfig['preProcess'].call(oSelf, poResultant);
				}
				oSelf.setModel(oModelConfig['part'], poResultant);
				if (iPartIndex == (aModelConfig.length - 1)) {
					oSelf.setIsModelLoaded(true);
					pfCallBack.call(oSelf);
					oSelf.getOnPageLoadComplete().call(oSelf);
					return;
				}
				oSelf.loadModel(pfCallBack, iPartIndex + 1);
			},
			{}, 0
		);
	}
	else if (typeof oModelConfig['data'] === 'object') {
		oSelf.setModel(oModelConfig['part'], oModelConfig['data']);
		if (iPartIndex == (aModelConfig.length - 1)) {
			oSelf.setIsModelLoaded(true);
			pfCallBack.call(oSelf);
			oSelf.getOnPageLoadComplete().call(oSelf);
			return;
		}
		oSelf.loadModel(pfCallBack, iPartIndex + 1);
	}
	else if (typeof oModelConfig['data'] === 'function') {
		oSelf.setModel(oModelConfig['part'], oModelConfig['data'].call(oSelf, oSelf.getPreLoadData(), oSelf.getModel()));
		if (iPartIndex == (aModelConfig.length - 1)) {
			oSelf.setIsModelLoaded(true);
			pfCallBack.call(oSelf);
			oSelf.getOnPageLoadComplete().call(oSelf);
			return;
		}
		oSelf.loadModel(pfCallBack, iPartIndex + 1);
	}
};
PageTemplate.prototype._nativeCall4ModelPart = function (paModelParts, pfCallBack, poResultant, piPartIndex) {
	var oSelf = this,
		aModelConfig = paModelParts,
		oModelConfig = {},
		mixInputParams = [];
	
	iPartIndex = parseInt(piPartIndex) || 0;
	oModelConfig = aModelConfig[iPartIndex];
	
	if (oModelConfig === undefined) {
		console.log(JSON.stringify(paModelParts) + '\n' + iPartIndex);
	}
	if (typeof oModelConfig['debug'] !== 'boolean') { oModelConfig['debug'] = false; }
	
	if (
		typeof oModelConfig['method'] === 'string' &&
		typeof oModelConfig['globalResource'] === 'string'
	) {
		if (typeof oModelConfig['checkSuccess'] !== 'function') {
			oModelConfig['checkSuccess'] = function (poServiceResponse) {
				return ((parseInt(poServiceResponse.Status) || 0) === 200);
			};
		}
		
		if (typeof oModelConfig['inputParams'] === 'function') {
			mixInputParams = oModelConfig['inputParams'].call(oSelf, poResultant);
		}
		else if (oModelConfig['inputParams'] !== undefined && oModelConfig['inputParams'] !== null) {
			mixInputParams = oModelConfig['inputParams'];
		}
		else {
			mixInputParams = undefined;
		}
		
		$.nativeCall({
			'method':			oModelConfig['method'],
			'globalResource':	oModelConfig['globalResource'],
			'inputParams':		[mixInputParams],
			'debug':			oModelConfig['debug'],
			'interval':			500,
			'breakAfter':		12500,
			'checkSuccess':		oModelConfig['checkSuccess'],
			'onComplete':		function (poServiceResponse) {
				var aModel = (
					oModelConfig['key'] !== undefined?
					poServiceResponse[oModelConfig['key']]:
					poServiceResponse
				);
				if (oModelConfig['filter'] !== undefined && oModelConfig['filter'] !== null) {
					var aMdl = [],
						bMatchFound = true;
					
					for (var iI = 0; iI < aModel.length; iI++) {
						bMatchFound = true;
						for (var sKey in oModelConfig['filter']) {
							if (aModel[iI][sKey] != oModelConfig['filter'][sKey]) {
								bMatchFound = false;
								break;
							}
						}
						if (bMatchFound === true) {
							if ($.isPlainObject(oModelConfig['preProcess'])) {
								for (var sField in oModelConfig['preProcess']) {
									if (typeof oModelConfig['preProcess'][sField] === 'function') {
										aModel[iI][sField] = oModelConfig['preProcess'][sField].call(oSelf, aModel[iI]);
									}
								}
							}
							aMdl.push(aModel[iI]);
						}
					}
					aModel = aMdl;
				}
				poResultant[oModelConfig['method']] = aModel;
				if (iPartIndex == (aModelConfig.length - 1)) {
					pfCallBack.call(oSelf, poResultant);
					return;
				}
				oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
			},
			'onError':			function (poServiceResponse, oException, oData) {
				poResultant[oModelConfig['method']] = {};
				if (iPartIndex == (aModelConfig.length - 1)) {
					pfCallBack.call(oSelf, poResultant);
					return;
				}
				oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
			}
		});
	}
	else if (typeof oModelConfig['data'] === 'object') {
		poResultant[oModelConfig['key']] = oModelConfig['data'];
		if (iPartIndex == (aModelConfig.length - 1)) {
			pfCallBack.call(oSelf, poResultant);
			return;
		}
		oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
	}
	else if (typeof oModelConfig['data'] === 'function') {
		poResultant[oModelConfig['key'] || 'data'] = oModelConfig['data'].call(oSelf, oSelf.getPreLoadData(), oSelf.getModel());
		if (iPartIndex == (aModelConfig.length - 1)) {
			pfCallBack.call(oSelf, poResultant);
			return;
		}
		oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
	}
	else if (['function', 'string'].indexOf(typeof oModelConfig['source']) !== -1) {
		if (typeof oModelConfig['depends'] !== 'string') {
			poResultant[oModelConfig['key'] || 'jsSource'] = null;
			if (iPartIndex == (aModelConfig.length - 1)) {
				pfCallBack.call(oSelf, poResultant);
				return;
			}
			oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
		}
		else {
			loadJS(
				(
					typeof oModelConfig['source'] === 'function'?
					oModelConfig['source'].call(this, poResultant[oModelConfig['depends']]):
					oModelConfig['source']
				),
				function () {
					poResultant[oModelConfig['key'] || 'jsSource'] = (
						(typeof oModelConfig['onLoad'] === 'function')?
						oModelConfig['onLoad'].call(this, window[oModelConfig['globalResource']]):
						(
							typeof oModelConfig['load'] === 'function'?
							oModelConfig['load'].call(this, window[oModelConfig['globalResource']]):
							window[oModelConfig['globalResource']]
						)
					);
					if (iPartIndex == (aModelConfig.length - 1)) {
						pfCallBack.call(oSelf, poResultant);
						return;
					}
					oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
				}
			);
		}
	}
	else {
		if (iPartIndex == (aModelConfig.length - 1)) {
			pfCallBack.call(oSelf, poResultant);
			return;
		}
		oSelf._nativeCall4ModelPart(paModelParts, pfCallBack, poResultant, piPartIndex + 1);
	}
};
PageTemplate.prototype.init = function () {
	var oSelf = this;
	
	this.loadModel(function () {
		this.render();
		this.resize();
		setTimeout(function () {
			if (typeof oSelf.bindEvents === 'function') {
				oSelf.bindEvents.call(oSelf);
			}
		}, 150);
	});
};
PageTemplate.prototype.render = function () {
	var sTemplateHtml = this.getMainTemplate().html(),
		oTemplateVars = {},
		oLayout = this.getLayout(),
		aLayout = [];
	
	for (var sLayout in oLayout) {
		aLayout = oLayout[sLayout];
		for (var iI = 0; iI < aLayout.length; iI++) {
			oTemplateVars[aLayout[iI]] = this.loadPart(aLayout[iI]);
		}
	}
	this.getContainer().html(
		_.template(
			sTemplateHtml,
			oTemplateVars
		)
	);
};
PageTemplate.prototype.resize = function () {
	var oSelf = this,
		oContainer = this.getContainer(),
		dHeight = (this.getWindowHeight() - 25),
		oLayout = new (function (paHeightConfig) {
			var aLayout = paHeightConfig,
				dDefaultBaseHeight = 0;
			
			this.setHeight = function (aElements, sBaseSelector, dBaseHeight) {
				if (typeof dBaseHeight != 'number') {
					var oTemplateConfig = oSelf.getTemplateConfig(),
						oHeader = $('#' + oTemplateConfig['header']),
						dScreenHeight = document.documentElement.clientHeight,
						dHeaderHeight = (
							oHeader.height() +
							parseFloat(oHeader.css('padding-top').replace('px', '')) +
							parseFloat(oHeader.css('padding-bottom').replace('px', ''))
						),
						dDirectionBarHeight = 0;
					
					dBaseHeight = dScreenHeight - dHeaderHeight - dDirectionBarHeight;
					if (dDefaultBaseHeight > 0) {
						dBaseHeight = dDefaultBaseHeight;
					}
				}
				if (typeof aElements == 'undefined') { aElements = aLayout; }
				if (typeof sBaseSelector == 'undefined') { sBaseSelector = ''; }
				else { sBaseSelector += ' '; }
				
				for (var iIndex = 0; iIndex < aElements.length; iIndex++) {
					var oItem = aElements[iIndex],
						sElementSelector = '' + sBaseSelector + oItem.selector,
						oElement = $(sElementSelector).eq(0),
						mixFormula = (
							(typeof oItem.formula == 'function')?
							oItem.formula(oElement.get(0), dBaseHeight, sElementSelector):
							oItem.formula
						),
						dHeight = 0,
						aMatches = null,
						dSubtrahend = 0;
						
					if (typeof mixFormula == 'number') {
						dHeight = mixFormula;
						dSubtrahend = 0;
					}
					else if (typeof mixFormula == 'string') {
						if (aMatches = mixFormula.match(/(.*)%$/)) {
							if (aMatches.length == 2) {
								dHeightPercent = parseFloat(aMatches[1]);
								dHeight = parseFloat((dBaseHeight * dHeightPercent / 100).toFixed(2));
								if ($('' + sBaseSelector.trim()).length > 0) {
									dSubtrahend = (
										parseFloat($('' + sBaseSelector.trim()).css('padding-top').replace('px', '')) +
										parseFloat($('' + sBaseSelector.trim()).css('padding-bottom').replace('px', ''))
									);
								}
								dSubtrahend += (
									parseFloat(oElement.css('padding-top').replace('px')) +
									parseFloat(oElement.css('padding-bottom').replace('px')) +
									parseFloat(oElement.css('margin-top').replace('px')) +
									parseFloat(oElement.css('margin-bottom').replace('px'))
								);
								if (!oElement.parent().is('' + sBaseSelector.trim())) {
									dSubtrahend += (
										parseFloat(oElement.parent().css('padding-top').replace('px')) +
										parseFloat(oElement.parent().css('padding-bottom').replace('px'))
									);
								}
							}
						}
						else if (aMatches = mixFormula.match(/(.*)px$/)) {
							if (aMatches.length == 2) {
								dHeight = parseFloat(aMatches[1]);
								dSubtrahend = 0;
							}
						}
					}
					
					if (dHeight) {
						var dHeight2Apply = (dHeight - dSubtrahend).toFixed(2);
						dHeight = dHeight2Apply;
						oElement.css('height', dHeight2Apply + 'px');
						if ($(sElementSelector).length > 1) {
							$(sElementSelector).not(oElement).css('height', dHeight2Apply + 'px');
						}
					}
					else {
						dHeight = dBaseHeight;
					}
					if (
						typeof oItem.kids != 'undefined' &&
						oItem.kids instanceof Array
					) {
						this.setHeight(oItem.kids, sBaseSelector + oItem.selector, parseFloat(dHeight));
					}
				}
			};
			this.setBaseHeight = function (dBaseHeight) {
				if (typeof dBaseHeight != 'number') {
					return false;
				}
				else if (dBaseHeight <= 0) {
					return false;
				}
				dDefaultBaseHeight = dBaseHeight;
			};
		})(this.getResizeConfig());
	
	oContainer.css({
		'max-height':	dHeight + 'px',
		'overflow':		'auto'
	});
	
	oLayout.setBaseHeight(dHeight - 50); // 50: found by inspection
	oLayout.setHeight();
};