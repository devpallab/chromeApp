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
						if (typeof oConfig['breakAfterCallback'] == 'function') {
							oConfig['breakAfterCallback'](oParams);
						}
						else if (typeof oConfig['stopAfterCallback'] == 'function') {
							oConfig['stopAfterCallback'](oParams);
						}
						return;
					}
				}
			}
			if (typeof oConfig['stopAfter'] == 'number') {
				if (parseInt(oConfig['stopAfter']) > 0) {
					if (iIteration * iInterval >= oConfig['stopAfter']) {
						if (typeof oConfig['breakAfterCallback'] == 'function') {
							oConfig['breakAfterCallback'](oParams);
						}
						else if (typeof oConfig['stopAfterCallback'] == 'function') {
							oConfig['stopAfterCallback'](oParams);
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