;(function () {
	/**
	 * 
	 * 计算有效期
	 * 
	 * @param {any} expiresStr 有效期数字或字符串
	 */
	function calcExpires (expiresStr) {
		var Years = /^\d+Y$/, Months = /^\d+M$/, Days = /^[-\d]+D$/, hours = /^\d+h$/, minutes = /^\d+m$/, seconds = /^\d+s$/;
		// culc time unit
		var time = new Date(), timeUnit = 0;
		expiresStr = expiresStr === undefined ? '1D' :
			+expiresStr + '' == expiresStr ? expiresStr + 'D' : expiresStr;

		switch (true) {
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
		time.setMilliseconds(time.getMilliseconds() + expiresStr * timeUnit);

		return time.toGMTString();
	}
	
	function extend () {
		return Object.assign.apply({}, arguments);
	}
	
	var defaultOptions = {path: '/', expires: 1};

	var VueCookie = {
		install: function (Vue) {
			Vue.prototype.$cookie = this;
			Vue.cookie = this;
		},
		set: function (key, value, options) {
			options = extend(defaultOptions, options);
			var expires = options.expires;
			// 纯数字或数字字符串单位默认为天
			if (typeof expires === 'number' || typeof expires === 'string') {
				options.expires = calcExpires(expires);
			} else {
				throw new Error('expires must be number or string type!');
			}

			// value 转换为 json
			var result = JSON.stringify(value);
			if (/[\{\[]/.test(result)) {
				value = result;
			}
			
			// 特殊字符转换
			value = encodeURIComponent(String(value))
				.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
			
			var tempStr = '';
			// 遍历属性
			for (var val in options) {
				if (!options[val]) continue;
				tempStr += '; ' + val + '=' + options[val];
			}

			document.cookie = key + '=' + value + tempStr;
			return document.cookie;
		},
		get: function (key) {
			var cookiesArray = document.cookie ? document.cookie.split('; ') : Array.prototype,
				i = 0,
				len = cookiesArray.length,
				item = [],
				value,
				tempKey;

			for (i; i < len; i++) {
				item = cookiesArray[i].split('=');
				tempKey = decodeURIComponent(item[0]);
				if (tempKey === key) {
					value = decodeURIComponent(item[1]);
					if (/[\{\[]/.test(value)) {
						value = JSON.parse(value);
					}
				}
			}

			return value;
		},
		delete: function (key) {
			this.set.call(this, key, '', {expires: -1});
		}
	};

	if (typeof exports === 'object') {
		module.exports = VueCookie;
	} else if (typeof define === 'function' && define.amd) {
		define([], function () {
			return VueCookie;
		});
	} else if (window.Vue) {
		window.VueCookie = VueCookie;
		Vue.use(VueCookie);
	}
})();