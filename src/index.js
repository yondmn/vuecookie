;(function () {
	
	/**
	 * 
	 * 计算有效期
	 * 
	 * @param {any} expiresStr 有效期数字或字符串
	 */
	function calcExpires (expiresStr) {
		var Years = /^\d+Y$/, Months = /^\d+M$/, Days = /^\d+D$/, hours = /^\d+h$/, minutes = /^\d+m$/, seconds = /^\d+s$/;
		// culc time unit
		var time = new Date(), timeUnit = 0;
		expiresStr = expiresStr === undefined ? '1D' :
			+expiresStr + '' == expiresStr ? expiresStr + 'D' : expiresStr;

		switch (expiresStr) {
			case Years.test(expiresStr):
				timeUnit = 864e+5 * 365;
				break;
			case Months.test(expiresStr):
				timeUnit = 864e+5 * 30;
				break;
			case Days.test(expiresStr):
				timeUnit = 864e+5;
				break;
			case hours.test(expiresStr):
				timeUnit = 3600000;
				break;
			case minutes.test(expiresStr):
				timeUnit = 60000;
				break;
			case seconds.test(expiresStr):
				timeUnit = 1000;
				break;
			default:
				throw new Error('expires type error!');
		}
		expiresStr = expiresStr.replace(/[YMDhms]/, '') * 1;
		time.setMilliseconds(time.getMilliseconds + expiresStr * timeUnit);

		return time;
	}
	
	function extend () {
		return Object.assign.apply({}, arguments);
	}
	
	var defaultOptions = {expires: 1};

	var VueCookie = {
		install: function (Vue) {
			Vue.prototype.$cookie = this;
			Vue.cookie = this;
		},
		set: function (key, value, expires) {
			// 纯数字或数字字符串单位默认为天
			if (typeof expires === 'number' || typeof expires === 'string') {
				expires = calcExpires(expires);
			} else {
				throw new Error('expires must be number or string type!');
			}

			// value to json
			var result = JSON.stringify(value);
			if (/[\{\[]/.test(result)) {
				value = result;
			}

			value = encodeURIComponent(String(value))
				.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
		},
		get: function (key) {

		},
		delete: function (key, options) {

		}
	};

	if (typeof exports === 'object') {
		module.exports = VueCookie;
	} else if (typeof define === 'function' && define.amd) {
		define([], function () {
			return VueCookie;
		});
	} else (window.Vue) {
		window.VueCookie = VueCookie;
		Vue.use(VueCookie);
	}
})();