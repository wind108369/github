/**
 * Expedition _browser
 * @author: yangji
 * version: 1.0
 */

/**
 * 声明Expedition.fn._browser包
 */
Expedition.fn._browser = Expedition.fn._browser || {};

/**
 * 获取浏览器信息
 */
Expedition.fn._browser.getBrowser = function(){
	return{
		isGecko : Expedition.fn._browser.isGecko  || false,
		isStrict : Expedition.fn._browser.isStrict || false,
		safari : Expedition.fn._browser.safari || false,
		opera : Expedition.fn._browser.opera || false,
		chrome : Expedition.fn._browser.chrome || false,
		ie : Expedition.fn._browser.ie || false,
		maxthon : Expedition.fn._browser.maxthon || false,
		isWebkit : Expedition.fn._browser.isWebkit || false,
		firefox : Expedition.fn._browser.firefox || false,
		isCanvasSupport : Expedition.fn.isCanvasSupport()
	}
};

//快捷方法
Expedition.fn.browser = Expedition.fn._browser.getBrowser;

/**
 * 判断是否为isGecko
 */
Expedition.fn.isGecko = function(){
	return Expedition.fn._browser.isGecko;
}

/**
 * 判断是否为标准模式
 */
Expedition.fn.isStrict = function(){
	return Expedition.fn._browser.isStrict;
}

/**
 * 判断是否为safari浏览器
 */
Expedition.fn.safari = function(){
	return Expedition.fn._browser.safari;
}

/**
 * 判断是否为opera浏览器
 */
Expedition.fn.opera = function(){
	return Expedition.fn._browser.opera;
}

/**
 * 判断是否为chrome浏览器
 */
Expedition.fn.chrome = function(){
	return Expedition.fn._browser.chrome;
}

/**
 * 判断是否为ie浏览器
 */
Expedition.fn.ie = function(){
	return Expedition.fn._browser.ie;
}

/**
 * 判断是否为maxthon浏览器
 */
Expedition.fn.maxthon = function(){
	return Expedition.fn._browser.maxthon;
}

/**
 * 判断是否为isWebkit
 */
Expedition.fn.isWebkit = function(){
	return Expedition.fn._browser.isWebkit;
}

/**
 * 判断是否为firefox浏览器
 */
Expedition.fn.firefox = function(){
	return Expedition.fn._browser.firefox;
}

/**
 * 判断是否支持canvas
 * ie 9
 * chrome 1.0
 * firefox 1.5
 * opera 9.0
 * safari 1.3
 */
Expedition.fn._browser.isCanvasSupport = function(){
	if(Expedition.fn._browser.ie >= 9){
		return true;
	}
		
	if(Expedition.fn._browser.chrome >= 1.0){
		return true;
	}
	
	if(Expedition.fn._browser.firefox >= 1.5){
		return true;
	}
		
	if(Expedition.fn._browser.opera >= 9.0){
		return true;
	}
	
	if(Expedition.fn._browser.safari >= 1.3){
		return true;
	}
	
	return false;
}

/**
 * 判断是否为isGecko
 */
Expedition.fn._browser.isGecko = 
	/gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);

/**
 * 判断是否为标准模式
 */
Expedition.fn._browser.isStrict = document.compatMode == "CSS1Compat";

/**
 * 判断是否为safari浏览器
 */
if ((/(\d+\.\d)(\.\d)?\s+safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent))) {
    Expedition.fn._browser.safari = parseFloat(RegExp['\x241']);
}

/**
 * 判断是否为opera浏览器
 */
if (/opera\/(\d+\.\d)/i.test(navigator.userAgent)) {
    Expedition.fn._browser.opera = parseFloat(RegExp['\x241']);
}

/**
 * 判断是否为chrome浏览器
 */
if (/chrome\/(\d+\.\d)/i.test(navigator.userAgent)) {
    Expedition.fn._browser.chrome = parseFloat(RegExp['\x241']);
}

/**
 * 判断是否为ie浏览器
 */
if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
    Expedition.fn._browser.ie = document.documentMode || parseFloat(RegExp['\x241']);
}

/**
 * 判断是否为maxthon浏览器
 */
try {
    if (/(\d+\.\d)/.test(external.max_version)) {
        Expedition.fn._browser.maxthon = parseFloat(RegExp['\x241']);
    }
} catch (e) {}

/**
 * 判断是否为isWebkit
 */
Expedition.fn._browser.isWebkit = /webkit/i.test(navigator.userAgent);

/**
 * 判断是否为firefox浏览器
 */
if (/firefox\/(\d+\.\d)/i.test(navigator.userAgent)) {
    Expedition.fn._browser.firefox = parseFloat(RegExp['\x241']);
}

