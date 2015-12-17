/**
 * 构建 Expedition 对象
 * @param {Object} id canvas对象id
 */
Expedition = window.Expedition = window.$ = function(id){
    return new Expedition.fn.init(id);
};


/**
 * Expedition.canvas对象
 * _event : [{type 
 *            id  id为空时 为全局的事件
 *            func
 *            canvasId  对应的底层canvas的id
 *           }]所有事件都存在这里
 * _canvas  : '' 当前的canvas元素
 * _context : ''当前的上下文 
 * 其他的就是canvas对象id对应的object 
 *      其中包括
 *          id :
 *          _canvas  :  ''  对应的canvas元素
 *          _context :  ''  对应的上下文
 *          _x       :  int 位置x的变化值
 *          _y       :  int 位置y的变化值
 *          _loop : [{
 *                          id  操作的id
 *                          type  操作类型
 *                          pre 前一次操作的id
 *                          loop  循环的函数
 *                          moveFlag 是否运动 0 运动 1 暂停 2 删除
 *                      }]
 *          _otherLoop : 背景视频循环等
 *          _gradient : 渐变属性
 *          _event   : [{type : 'onclick',
 *                       func : function,  
 *                       eventIndex : ''  事件处理的优先级
 *                       isEventTransparent : true 是否是事件透明的 true 允许事件传递
 *                       fireEvent(x,y)  用来判断传入的坐标x，y能不能触发事件 是否触发事件的函数  返回true时触发
 *                       unit 精确单位
 *                      }]   事件 
 *          _queue : true 是否在队列中
 *          _queueList : [{moveId,params}]队列数组
 */
Expedition.canvas = Expedition.canvas || {};

Expedition.canvas._event = [];


/**
 * Expedition.fn
 * 
 */
Expedition.fn = {
    /**
     * 初始化
     * 
     * @param {Object} id
     */
    init : function(id){
        
        if (id) {
            this.id = id;
            if (id in Expedition.canvas) {
                //如果id已经存在，返回对应的canvas对象
            }   
            else {
                //id不存在，创建相应id的canvas对象并加入Expedition.canvas中
                Expedition.canvas[id] = this;
                //初始化事件
                Expedition.canvas[id]._event = [];
                
                //先对应当前canvas标签
                Expedition.canvas[id]._canvas = Expedition.canvas._canvas;
                Expedition.fn.paint._newCanvas(id);
            }
            return Expedition.canvas[id];
        }
        
        return this;
    },
    
    /**
     * 销毁对象
     */
    dispose : function(){
        var id = this.id;
        
        if(id in Expedition.canvas){
            //删除掉运动
            $(id).cancelMove();
            $(id).hide();
            setTimeout(function(){
                //停止所有相关的循环
                var loop = Expedition.canvas[id]._loop,
                    otherLoop = Expedition.canvas[id]._otherLoop;
                if(loop){
                    for(var i = 0; i < loop.length ; i++){
                        if(loop[i].loop){
                            clearInterval(loop[i].loop);
                        }
                    }
                }
                if(otherLoop){
                    for(k in otherLoop){
                        if(otherLoop[k]){
                            clearInterval(otherLoop[k]);
                        }
                    }
                }
                //删除对应的canvas标签
                if ($().g('canvasId' + id)) {
                    Expedition.fn.dom.remove('canvasId' + id);
                }
                
                //删除事件
                Expedition.fn._lib.array.remove(Expedition.canvas._event,function(item){
                    return item.id == id;
                })
                
                //删除掉Expedition.canvas中的对象
                if(id in Expedition.canvas){
                    
                    delete Expedition.canvas[id];
                }
            },50);
        }
    },
    
    /**
     * 显示对象
     */
    show : function(){
        var id = this.id,
            canvas = Expedition.fn.paint._getNewCanvas(this.id);
        
        if(id){
            Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
            if (Expedition.canvas[id]._loop.length > 0) {
                canvas = $().g(Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length - 1].id);
                if (canvas) {
                    $().setStyle(canvas, 'display', 'block');
                }
            }
            else {
                if (canvas) {
                    $().setStyle(canvas, 'display', 'block');
                }
            }
            
            //添加isHide标识
            Expedition.canvas[id].isHide = false;
        }
        
        return this;
    },
    
    /**
     * 隐藏对象
     */
    hide : function(){
        var id = this.id,
            canvas = Expedition.fn.paint._getNewCanvas(this.id);
        
        if(id){
            Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
            if (Expedition.canvas[id]._loop.length > 0) {
                canvas = $().g(Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length - 1].id);
                if (canvas) {
                    $().setStyle(canvas, 'display', 'none');
                }
            }
            else {
                if (canvas) {
                    $().setStyle(canvas, 'display', 'none');
                }
            }
            
            //添加isHide标识
            Expedition.canvas[id].isHide = true;
        }
        
        return this;
    }
};

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
};

/**
 * Expedition.fn.dom
 * @author yangji01
 * version: 1.0
 */

/**
 * 声明Expedition.dom包
 */
Expedition.fn.dom = Expedition.fn.dom || {};

/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFilter = Expedition.fn.dom._styleFilter || [];


/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFilter[Expedition.fn.dom._styleFilter.length] = {
    get: function (key, value) {
        if (/color/i.test(key) && value.indexOf("rgb(") != -1) {
            var array = value.split(",");

            value = "#";
            for (var i = 0, color; color = array[i]; i++ ) {
                color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                
                if(color.length == 1){
                    value += "0" + color;
                }else{
                    value += color;
                }
            }

            value = value.toUpperCase();
        }

        return value;
    }
};

/**
 * 为获取和设置样式的过滤器
 */
Expedition.fn.dom._styleFilter.filter = function (key, value, method) {
    var filters = Expedition.fn.dom._styleFilter, 
        item;
        
    for (var i = 0; item = filters[i]; i++) {
        if (item = item[method]) {
            value = item(key, value);
        }
    }

    return value;
};

/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFilter[Expedition.fn.dom._styleFilter.length] = {
    set: function (key, value) {
        if (value.constructor == Number 
            && !/zIndex|fontWeight|opacity|zoom|lineHeight/i.test(key)){
            value = value + "px";
        }

        return value;
    }
};

/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFixer = Expedition.fn.dom._styleFixer || {};



/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFixer.display = Expedition.fn.browser.ie && Expedition.fn.browser.ie < 8 ? { 
    set: function (element, value) {
        element = element.style;
        if (value == 'inline-block') {
            element.display = 'inline';
            element.zoom = 1;
        } else {
            element.display = value;
        }
    }
} : Expedition.fn.browser.firefox && Expedition.fn.browser.firefox < 3 ? {
    set: function (element, value) {
        element.style.display = value == 'inline-block' ? '-moz-inline-box' : value;
    }
} : null;

/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFixer["float"] = Expedition.fn.browser.ie ? "styleFloat" : "cssFloat";

/**
 * 提供给setStyle与getStyle使用
 */
Expedition.fn.dom._styleFixer.opacity = Expedition.fn.browser.ie ? {
    get: function (element) {
        var item = element.style.filter;
        item && item.indexOf("opacity=") >= 0 ? (parseFloat(item.match(/opacity=([^)]*)/)[1]) / 100) + "" 
        : "1";
    },

    set: function (element, value) {
        var style = element.style;
        
        style.filter = (style.filter || "").replace(/alpha\([^\)]*\)/gi, "") + (value == 1 ? "" 
        : "alpha(opacity=" + value * 100 + ")");
        // IE filters only apply to elements with "layout."
        style.zoom = 1;
    }
} : null;

/**
 * 提供给setStyle与getStyle使用，在做textOverflow时会向element对象中添加,_baiduOverflow, _baiduHTML两个属性保存原始的innerHTML信息
 */
Expedition.fn.dom._styleFixer.textOverflow = (function () {
    var fontSizeCache = {};

    function pop(list) {
        var o = list.length;
        if (o > 0) {
            o = list[o - 1];
            list.length--;
        } else {
            o = null;
        }
        return o;
    }

    function setText(element, text) {
        element[Expedition.fn.browser.firefox ? "textContent" : "innerText"] = text;
    }

    function count(element, width, ellipsis) {
        /* 计算cache的名称 */
        var o = Expedition.fn.browser.ie ? element.currentStyle || element.style : getComputedStyle(element, null),
            fontWeight = o.fontWeight,
            cacheName =
                "font-family:" + o.fontFamily + ";font-size:" + o.fontSize
                + ";word-spacing:" + o.wordSpacing + ";font-weight:" + ((parseInt(fontWeight) || 0) == 401 ?
                 700 : fontWeight)
                + ";font-style:" + o.fontStyle + ";font-variant:" + o.fontVariant,
            cache = fontSizeCache[cacheName];

        if (!cache) {
            o = element.appendChild(document.createElement("div"));

            o.style.cssText = "float:left;" + cacheName;
            cache = fontSizeCache[cacheName] = [];

            /* 计算ASCII字符的宽度cache */
            for (i = 0; i < 256; i++) {
                i == 32 ? (o.innerHTML = "&nbsp;") : setText(o, String.fromCharCode(i));
                cache[i] = o.offsetWidth;
            }

            /* 计算非ASCII字符的宽度、字符间距、省略号的宽度 */
            setText(o, "一");
            cache[256] = o.offsetWidth;
            setText(o, "一一");
            cache[257] = o.offsetWidth - cache[256] * 2;
            cache[258] = cache[".".charCodeAt(0)] * 3 + cache[257] * 3;

            element.removeChild(o);
        }

        for (
            /* wordWidth是每个字符或子节点计算之前的宽度序列 */
            var node = element.firstChild, charWidth = cache[256], wordSpacing = cache[257], ellipsisWidth = cache[258],
                wordWidth = [], ellipsis = ellipsis ? ellipsisWidth : 0;
            node;
            node = node.nextSibling
        ) {
            if (width < ellipsis) {
                element.removeChild(node);
            }
            else if (node.nodeType == 3) {
                for (var i = 0, text = node.nodeValue, length = text.length; i < length; i++) {
                    o = text.charCodeAt(i);
                    /* 计算增加字符后剩余的长度 */
                    wordWidth[wordWidth.length] = [width, node, i];
                    width -= (i ? wordSpacing : 0) + (o < 256 ? cache[o] : charWidth);
                    if (width < ellipsis) {
                        break;
                    }
                }
            }
            else {
                o = node.tagName;
                if (o == "IMG" || o == "TABLE") {
                    /* 特殊元素直接删除 */
                    o = node;
                    node = node.previousSibling;
                    element.removeChild(o);
                }
                else {
                    wordWidth[wordWidth.length] = [width, node];
                    width -= node.offsetWidth;
                }
            }
        }

        if (width < ellipsis) {
            /* 过滤直到能得到大于省略号宽度的位置 */
            while (o = pop(wordWidth)) {
                width = o[0];
                node = o[1];
                o = o[2];
                if (node.nodeType == 3) {
                    if (width >= ellipsisWidth) {
                        node.nodeValue = node.nodeValue.substring(0, o) + "...";
                        return true;
                    }
                    else if (!o) {
                        element.removeChild(node);
                    }
                }
                else if (count(node, width, true)) {
                    return true;
                }
                else {
                    element.removeChild(node);
                }
            }

            /* 能显示的宽度小于省略号的宽度，直接不显示 */
            element.innerHTML = "";
        }
    }

    return {
        get: function (element, style) {
            var browser = Expedition.fn.browser;
            return (browser.opera ? style.OTextOverflow : browser.firefox ? element._baiduOverflow: style.textOverflow) || "clip";
        },

        set: function (element, value) {
            var browser = Expedition.fn.browser;
            if (element.tagName == "TD" || element.tagName == "TH" || browser.firefox) {
                element._baiduHTML && (element.innerHTML = element._baiduHTML);

                if (value == "ellipsis") {
                    element._baiduHTML = element.innerHTML;
                    var o = document.createElement("div"), width = element.appendChild(o).offsetWidth;
                    element.removeChild(o);
                    count(element, width);
                }
                else {
                    element._baiduHTML = "";
                }
            }

            o = element.style;
            browser.opera ? (o.OTextOverflow = value) : browser.firefox ? (element._baiduOverflow = value) : (o.textOverflow = value);
        }
    };
})();

/**
 * 从文档中获取指定的DOM元素
 * 
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
 */
Expedition.fn.dom.g = function (id) {
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};

// 声明快捷方法
Expedition.fn.g = Expedition.fn.G = Expedition.fn.dom.g;

/**
 * 提供给setAttr与getAttr方法作名称转换使用
 * ie6,7下class要转换成className
 */

Expedition.fn.dom._NAME_ATTRS = (function () {
    var result = {
        'cellpadding': 'cellPadding',
        'cellspacing': 'cellSpacing',
        'colspan': 'colSpan',
        'rowspan': 'rowSpan',
        'valign': 'vAlign',
        'usemap': 'useMap',
        'frameborder': 'frameBorder'
    };
    
    if (Expedition.fn.browser.ie < 8) {
        result['for'] = 'htmlFor';
        result['class'] = 'className';
    } else {
        result['htmlFor'] = 'for';
        result['className'] = 'class';
    }
    
    return result;
})();

/**
 * 设置DOM元素的属性值
 * 获取元素属性使用getAttr方法
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     属性名称
 * @param {string}             value   属性值
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.setAttr = function (element, key, value) {
    element = Expedition.fn.dom.g(element);

    if ('style' == key){
        element.style.cssText = value;
    } else {
        key = Expedition.fn.dom._NAME_ATTRS[key] || key;
        element.setAttribute(key, value);
    }

    return element;
};

// 声明快捷方法
Expedition.fn.setAttr = Expedition.fn.dom.setAttr;

/**
 * 批量设置DOM元素的属性值
 * 获取元素属性使用getAttr方法
 * 
 * @param {HTMLElement|string} element    目标元素或目标元素的id
 * @param {Object}             attributes 属性集合
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.setAttrs = function (element, attributes) {
    element = Expedition.fn.dom.g(element);

    for (var key in attributes) {
        Expedition.fn.dom.setAttr(element, key, attributes[key]);
    }

    return element;
};

// 声明快捷方法
Expedition.fn.setAttrs = Expedition.fn.dom.setAttrs;

/**
 * 获取DOM元素指定的属性值
 * 设置元素属性使用setAttr方法
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     属性名称
 * @return {string} DOM元素的属性值，不存在的属性返回null
 */
Expedition.fn.dom.getAttr = function (element, key) {
    element = Expedition.fn.dom.g(element);

    if ('style' == key){
        return element.style.cssText;
    }

    key = Expedition.fn.dom._NAME_ATTRS[key] || key;
    return element.getAttribute(key);
};

// 声明快捷方法
Expedition.fn.getAttr = Expedition.fn.dom.getAttr;

/**
 * 从目标元素指定的方向搜索元素
 *
 * @param {HTMLElement|string} element   目标元素或目标元素的id
 * @param {string}             direction 遍历的方向名称，取值为previousSibling,nextSibling
 * @param {string}             start     遍历的开始位置，取值为firstChild,lastChild,previousSibling,nextSibling
 * @return {HTMLElement} 搜索到的元素，如果没有找到，返回 null
 */
Expedition.fn.dom._matchNode = function (element, direction, start) {
    element = Expedition.fn.dom.g(element);

    for (var node = element[start]; node; node = node[direction]) {
        if (node.nodeType == 1) {
            return node;
        }
    }

    return null;
};

/**
 * 获取目标元素之前的一个元素节点
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 之前的元素节点，如果没有找到，返回 null
 */
Expedition.fn.dom.prev = function (element) {
    return Expedition.fn.dom._matchNode(element, 'previousSibling', 'previousSibling');
};

Expedition.fn.string = Expedition.fn.string || {};

(function () {
    var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
    
    /**
     * 删除目标字符串两端的空白字符
     * 
     * @param {string} source 目标字符串
     * @return {string} 删除两端空白字符后的字符串
     */
    Expedition.fn.string.trim = function (source) {
        return String(source)
                .replace(trimer, "");
    };
})();

// 声明快捷方法
Expedition.fn.trim = Expedition.fn.string.trim;

/**
 * 添加目标元素的className
 * 使用者应保证提供的className合法性，不应包含不合法字符
 * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html
 * 
 * @param {HTMLElement|string} element   目标元素或目标元素的id
 * @param {string}             className 要添加的class。允许同时添加多个class，中间使用空白符分隔
 * @return {string} 被操作的DOM元素
 */
Expedition.fn.dom.addClass = function (element, className) {
    element = Expedition.fn.dom.g(element);

    var trim = Expedition.fn.string.trim,
        classes = trim(className).split(/\s+/), 
        len = classes.length;
    className = element.className.split(/\s+/).join(" ");

    while (len--) {
        (new RegExp("(^| )" + classes[len] + "( |\x24)")).test(className)
            && classes.splice(len, 1);
    }

    element.className = trim(className + ' ' + classes.join(" "));
    return element;
};

// 声明快捷方法
Expedition.fn.addClass = Expedition.fn.dom.addClass;

/**
 * 判断一个DOM元素或一个字符串内是否存在指定的className
 * @static
 * 
 * @param {HTMLElement|string}  element   目标元素或目标元素的id
 * @param {String}        className 要判断的class，可以是多个className用空格拼接
 * 
 * @return {Boolean}            如果要寻找的classname有一个或多个不在元素的className中，返回false
 */

Expedition.fn.dom.hasClass = function (element, className) {
    element = Expedition.fn.dom.g(element);
    var classArray = Expedition.fn.string.trim(className).split(/\s+/), 
        len = classArray.length;

    className = element.className.split(/\s+/).join(" ");

    while (len--) {
        if(!(new RegExp("(^| )" + classArray[len] + "( |\x24)")).test(className)){
            return false;
        }
    }
    return true;
};

/**
 * 判断一个元素是否包含另一个元素
 * 
 * @param {HTMLElement|string} container 包含的元素或元素的id
 * @param {HTMLElement|string} contained 被包含的元素或元素的id
 * @return {boolean} contained元素是否被包含于container元素的DOM节点上
 */
Expedition.fn.dom.contains = function (container, contained) {

    var g = Expedition.fn.dom.g;
    container = g(container);
    contained = g(contained);

    //fixme: 无法处理文本节点的情况(IE)
    return container.contains
        ? container != contained && container.contains(contained)
        : !!(container.compareDocumentPosition(contained) & 16);
};

/**
 * 获取目标元素所属的document对象
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLDocument} element所属的document对象
 */
Expedition.fn.dom.getDocument = function (element) {
    element = Expedition.fn.dom.g(element);
    return element.nodeType == 9 ? element : element.ownerDocument || element.document;
};

/**
 * 移除目标元素的className
 * 使用者应保证提供的className合法性，不应包含不合法字符
 * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html
 * 
 * @param {HTMLElement|string} element   目标元素或目标元素的id
 * @param {string}             className 要移除的class，允许同时移除多个class，中间使用空白符分隔
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.removeClass = function (element, className) {
    element = Expedition.fn.dom.g(element);
    var trim = Expedition.fn.string.trim;
    
    element.className =
        trim(element.className.split(/\s+/).join("  ")
                .replace(
                    new RegExp("(^| )(" 
                        + trim(className).split(/\s+/).join("|") 
                        + ")( |\x24)", "g"), 
                    " ")
                .replace(/\s+/g, ' '));

    return element;
};

// 声明快捷方法
Expedition.fn.removeClass = Expedition.fn.dom.removeClass;

/**
 * 获取目标元素的直接子元素列表
 * 
 * @param {HTMLElement|String} element 目标元素或目标元素的id
 * @return {Array} DOM元素列表
 */
Expedition.fn.dom.children = function (element) {
    element = Expedition.fn.dom.g(element);

    for (var children = [], tmpEl = element.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
        if (tmpEl.nodeType == 1) {
            children.push(tmpEl);
        }
    }
    
    return children;    
};

/**
 * 将目标字符串进行驼峰化处理
 * todo:考虑以后去掉下划线支持？
 * 
 * @param {string} source 目标字符串
 * @return {string} 驼峰化处理后的字符串
 */
Expedition.fn.string.toCamelCase = function (source) {
    //提前判断，提高getStyle等的效率
    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        return source;
    }
    return source.replace(/[-_][^-_]/g, function (match) {
        return match.charAt(1).toUpperCase();
    });
};

/**
 * 设置DOM元素的样式值
 * 
 * @param {HTMLElement|string}  element 目标元素或目标元素的id
 * @param {string}              key     要设置的样式名
 * @param {string}              value   要设置的样式值
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.setStyle = function (element, key, value) {
    var dom = Expedition.fn.dom, fixer;
    
    // 放弃了对firefox 0.9的opacity的支持
    element = dom.g(element);
    key = Expedition.fn.string.toCamelCase(key);

    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'set');
    }

    fixer = dom._styleFixer[key];
    (fixer && fixer.set) ? fixer.set(element, value) : (element.style[fixer || key] = value);

    return element;
};

// 声明快捷方法
Expedition.fn.setStyle = Expedition.fn.dom.setStyle;

/**
 * 批量设置DOM元素的样式值
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Object}             styles  要设置的样式集合
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.setStyles = function (element, styles) {
    element = Expedition.fn.dom.g(element);

    for (var key in styles) {
        Expedition.fn.dom.setStyle(element, key, styles[key]);
    }

    return element;
};

// 声明快捷方法
Expedition.fn.setStyles = Expedition.fn.dom.setStyles;

/**
 * 通过className获取元素
 * 不保证返回数组中DOM节点的顺序和文档中DOM节点的顺序一致。
 * 
 * @param {string}             className        需要搜索的class，只能指定单一的class，如果为空字符串或者纯空白的字符串，返回null
 * @param {HTMLElement|string} element optional 从这个节点开始搜索，没有的话，默认是document
 * @param {string}             tagName optional 指定要获取元素的标签名，如果没有值或者值为空字符串或者纯空白的字符串，表示不限制
 * @return {Array} 结果的数组，如果没有结果，数组的长度为0，或者是className参数错误，返回null。
 */
Expedition.fn.dom.q = function (className, element, tagName) {
    var result = [], 
    trim = Expedition.fn.string.trim, 
    len, i, elements, node;

    if (!(className = trim(className))) {
        return null;
    }
    
    // 初始化element参数
    if ('undefined' == typeof element) {
        element = document;
    } else {
        element = Expedition.fn.dom.g(element);
        if (!element) {
            return result;
        }
    }
    
    // 初始化tagName参数
    tagName && (tagName = trim(tagName).toUpperCase());
    
    // 查询元素
    if (element.getElementsByClassName) {
        elements = element.getElementsByClassName(className); 
        len = elements.length;
        for (i = 0; i < len; i++) {
            node = elements[i];
            if (tagName && node.tagName != tagName) {
                continue;
            }
            result[result.length] = node;
        }
    } else {
        className = new RegExp(
                        "(^|\\s)" 
                        + Expedition.fn.string.escapeReg(className)
                        + "(\\s|\x24)");
        elements = tagName 
                    ? element.getElementsByTagName(tagName) 
                    : (element.all || element.getElementsByTagName("*"));
        len = elements.length;
        for (i = 0; i < len; i++) {
            node = elements[i];
            className.test(node.className) && (result[result.length] = node);
        }
    }

    return result;
};

// 声明快捷方法
Expedition.fn.q = Expedition.fn.Q = Expedition.fn.dom.q;

/**
 * 获取DOM元素的样式值
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             key     要获取的样式名
 * @return {string} 要获取的样式值
 */
Expedition.fn.dom.getStyle = function (element, key) {
    var dom = Expedition.fn.dom;

    element = dom.g(element);
    key = Expedition.fn.string.toCamelCase(key);

    var value = element.style[key];
    
    // 在取不到值的时候，用fixer进行修正
    if (!value) {
        var fixer = dom._styleFixer[key],
            /* 在IE下，Element没有在文档树上时，没有currentStyle属性 */
            style = element.currentStyle || (Expedition.fn.browser.ie ? element.style : getComputedStyle(element, null));
            
        if ('string' == typeof fixer) {
            value = style[fixer];
        } else if (fixer && fixer.get) {
            value = fixer.get(element, style);
        } else {
            value = style[key];
        }
    }
    
    /* 检查结果过滤器 */
    if (fixer = dom._styleFilter) {
        value = fixer.filter(key, value, 'get');
    }

    return value;
};

// 声明快捷方法
Expedition.fn.getStyle = Expedition.fn.dom.getStyle;

/*
 * 获取目标元素元素相对于整个文档左上角的位置
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {Object} 
 *   {
 *       left:xx,//{integer} 页面距离页面左上角的水平偏移量
 *       top:xx //{integer} 页面距离页面坐上角的垂直偏移量
 *   }
 */
Expedition.fn.dom.getPosition = function (element) {
    var doc = Expedition.fn.dom.getDocument(element), 
        browser = Expedition.fn.browser,
        getStyle = Expedition.fn.dom.getStyle;

    element = Expedition.fn.dom.g(element);

    // Gecko browsers normally use getBoxObjectFor to calculate the position.
    // When invoked for an element with an implicit absolute position though it
    // can be off by one. Therefor the recursive implementation is used in those
    // (relatively rare) cases.
    var BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 && 
                                 doc.getBoxObjectFor &&
                                 getStyle(element, 'position') == 'absolute' &&
                                 (element.style.top === '' || element.style.left === '');

    // NOTE(arv): If element is hidden (display none or disconnected or any the
    // ancestors are hidden) we get (0,0) by default but we still do the
    // accumulation of scroll position.

    var pos = {"left":0,"top":0};

    var viewportElement = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement;
    
    if(element == viewportElement){
        // viewport is always at 0,0 as that defined the coordinate system for this
        // function - this avoids special case checks in the code below
        return pos;
    }

    var parent = null;
    var box, htmlDom, htmlBorderLeftW, htmlBorderTopW;

    if(element.getBoundingClientRect){ 
        // IE and Gecko 1.9+
        //当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
        //考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
        box = element.getBoundingClientRect();

        pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
        
        // IE adds the HTML element's border, by default it is medium which is 2px
        // IE 6 and 7 quirks mode the border width is overwritable by the following css html { border: 0; }
        // IE 7 standards mode, the border is always 2px
        // This border/offset is typically represented by the clientLeft and clientTop properties
        // However, in IE6 and 7 quirks mode the clientLeft and clientTop properties are not updated when overwriting it via CSS
        // Therefore this method will be off by 2px in IE while in quirksmode
        pos.left -= doc.documentElement.clientLeft;
        pos.top  -= doc.documentElement.clientTop;
        
        htmlDom = doc.body;
        // Use getStyle(element, 'border-left-width'), not element.style.borderLeftWidth,
        // Because both "html{border:none;}" and "body{border:none;}" make BODY's border width to 0, 
        // so, only computedStyle can be trusted.
        htmlBorderLeftW = parseInt(getStyle(htmlDom, 'border-left-width'));
        htmlBorderTopW = parseInt(getStyle(htmlDom, 'border-top-width'));
        if(browser.ie && !browser.isStrict){
            pos.left -= isNaN(htmlBorderLeftW) ? 2 : htmlBorderLeftW;
            pos.top  -= isNaN(htmlBorderTopW) ? 2 : htmlBorderTopW;
        }
    } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT/* && !goog.style.BUGGY_CAMINO_*/){ // gecko
        // Gecko ignores the scroll values for ancestors, up to 1.9.  See:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
        // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

        box = doc.getBoxObjectFor(element);
        var vpBox = doc.getBoxObjectFor(viewportElement);
        pos.left = box.screenX - vpBox.screenX;
        pos.top  = box.screenY - vpBox.screenY;
    } else { // safari/opera
        parent = element;

        do {
            pos.left += parent.offsetLeft;
            pos.top  += parent.offsetTop;
      
            // In Safari when hit a position fixed element the rest of the offsets
            // are not correct.
            if (browser.isWebkit > 0 && getStyle(parent, 'position') == 'fixed') {
                pos.left += doc.body.scrollLeft;
                pos.top  += doc.body.scrollTop;
                break;
            }
            
            parent = parent.offsetParent;
        } while (parent && parent != element);

        // opera & (safari absolute) incorrectly account for body offsetTop
        if(browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, 'position') == 'absolute')){
            pos.top  -= doc.body.offsetTop;
        }

        // accumulate the scroll positions for everything but the body element
        parent = element.offsetParent;
        while (parent && parent != doc.body) {
            pos.left -= parent.scrollLeft;
            // see https://bugs.opera.com/show_bug.cgi?id=249965
            if (!b.opera || parent.tagName != 'TR') {
                pos.top -= parent.scrollTop;
            }
            parent = parent.offsetParent;
        }
    }

    return pos;
};

/**
 * 检查两个元素是否相交
 * 
 * @param {HTMLElement|string} element1 要检查的元素或要检查的元素id
 * @param {HTMLElement|string} element2 要检查的元素或要检查的元素id
 * @return {boolean} 是否相交
 */
Expedition.fn.dom.intersect = function (element1, element2) {
    var g = Expedition.fn.dom.g, 
        getPosition = Expedition.fn.dom.getPosition, 
        max = Math.max, 
        min = Math.min;

    element1 = g(element1);
    element2 = g(element2);

    var pos1 = getPosition(element1),
        pos2 = getPosition(element2);

    return max(pos1.left, pos2.left) <= min(pos1.left + element1.offsetWidth, pos2.left + element2.offsetWidth)
        && max(pos1.top, pos2.top) <= min(pos1.top + element1.offsetHeight, pos2.top + element2.offsetHeight);
};

/**
 * 获取目标元素的最后一个子元素节点
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 最后一个子元素，如果没有找到，返回 null
 */
Expedition.fn.dom.last = function (element) {
    return Expedition.fn.dom._matchNode(element, 'previousSibling', 'lastChild');
};

/**
 * 使函数在页面加载完毕时调用
 * 
 * @param {Function} callback 页面加载完时的回调函数
 */
Expedition.fn.dom.ready = function () {
    var isReady = false,
        readyBound = false,
        readyList = [];

    function ready() {
        if (!isReady) {
            isReady = true;
            for (var i = 0, j = readyList.length; i < j; i++) {
                    readyList[i]();
            }
        }
    }

    function bindReady() {
        if (readyBound) {
            return;
        }
        readyBound = true;

        var doc = document, w = window, opera = Expedition.fn.browser.opera;

        // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
        if (doc.addEventListener && !opera) {
            // Use the handy event callback
            doc.addEventListener("DOMContentLoaded", opera ? function () {
                if (isReady) {
                    return;
                }
                for (var i = 0; i < doc.styleSheets.length; i++) {
                    if (doc.styleSheets[i].disabled) {
                        setTimeout( arguments.callee, 0 );
                        return;
                    }
                }
                // and execute any waiting functions
                ready();
            } : ready, false);
        } else if (Expedition.fn.browser.ie && w == top) {
            // If IE is used and is not in a frame
            // Continually check to see if the doc is ready
            (function () {
                if (isReady) {
                    return;
                }

                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    doc.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                // and execute any waiting functions
                ready();
            })();
        } else if (Expedition.fn.browser.safari) {
            var numStyles;
            (function () {
                if (isReady) {
                    return;
                }
                if (doc.readyState != "loaded" && doc.readyState != "complete") {
                    setTimeout( arguments.callee, 0 );
                    return;
                }
                if (numStyles === undefined) {
                    numStyles = 0;
                    var s1 = doc.getElementsByTagName('style');
                    var s2 = doc.getElementsByTagName('link');
                    if (s1) {
                        numStyles += s1.length;
                    }
                    if (s2) {
                        for (var i = 0, j = s2.length; i < j; i ++) {
                            if (s2[i].getAttribute("rel") == "stylesheet") {
                                numStyles ++;
                            }
                        }
                    }
                }
                // numStyles = jQuery("style, link[rel=stylesheet]").length;
                if (doc.styleSheets.length != numStyles) {
                    setTimeout(arguments.callee, 0);
                    return;
                }
                // and execute any waiting functions
                ready();
            })();
        }

        // A fallback to window.onload, that will always work
        w.attachEvent ? w.attachEvent("onload", ready) : w.addEventListener("load", ready, false);
    }

    return function (callback) {
        bindReady();
        isReady ? callback() : (readyList[readyList.length] = callback);
    };
}();

/**
 * 获取目标元素指定标签名的最近的祖先元素
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string}             tagName 祖先元素的标签名
 * @return {HTMLElement} 祖先元素，如果找不到返回null
 */
Expedition.fn.dom.getAncestorByTag = function (element, tagName) {
    element = Expedition.fn.dom.g(element);
    tagName = tagName.toUpperCase();

    while ((element = element.parentNode) && element.nodeType == 1) {
        if (element.tagName == tagName) {
            return element;
        }
    }

    return null;
};

/**
 * 获取目标元素所属的window对象
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {Window} element所属的window对象
 */
Expedition.fn.dom.getWindow = function (element) {
    element = Expedition.fn.dom.g(element);
    var doc = Expedition.fn.dom.getDocument(element);
    
    // 没有考虑版本低于safari2的情况
    // @see goog/dom/dom.js#goog.dom.DomHelper.prototype.getWindow
    return doc.parentWindow || doc.defaultView || null;
};

/**
 * 获取目标元素指定class的最近的祖先元素
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {Function}           method  判断祖先元素条件的函数
 * @return {HTMLElement} 祖先元素，如果找不到返回null
 */
Expedition.fn.dom.getAncestorBy = function (element, method) {
    element = Expedition.fn.dom.g(element);

    while ((element = element.parentNode) && element.nodeType == 1) {
        if (method(element)) {
            return element;
        }
    }

    return null;
};

/**
 * 隐藏目标元素
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.hide = function (element) {
    element = Expedition.fn.dom.g(element);
    element.style.display = "none";

    return element;
};

/**
 * 获取目标元素之后的一个元素节点
 *
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 之后的元素节点，如果没有找到，返回 null
 */
Expedition.fn.dom.next = function (element) {
    return Expedition.fn.dom._matchNode(element, 'nextSibling', 'nextSibling');
};

/**
 * 显示目标元素
 * 存在的问题是：如果在CSS中定义的样式是display:none
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.show = function (element) {
    element = Expedition.fn.dom.g(element);
    element.style.display = "";

    return element;
};


/**
 * 改变目标元素的显示/隐藏状态
 * 存在的问题是：如果在CSS中定义的样式是display:none
 * 
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @return {HTMLElement} 被操作的DOM元素
 */
Expedition.fn.dom.toggle = function (element) {
    element = Expedition.fn.dom.g(element);
    element.style.display = element.style.display == "none" ? "" : "none";

    return element;
};

/**
 * 从文档中获取指定的DOM元素
 * **内部方法**
 * 
 * @param {string|HTMLElement} id 元素的id或DOM元素
 * @return {HTMLElement} DOM元素，如果不存在，返回null，如果参数不合法，直接返回参数
 */
Expedition.fn.dom._g = function (id) {
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    }
    return id;
};

// 声明快捷方法
Expedition.fn._g = Expedition.fn.dom._g;

/**
 * 将目标元素添加到基准元素之后
 * 
 * @param {HTMLElement|string} newElement   被添加的目标元素
 * @param {HTMLElement|string} existElement 基准元素
 * @return {HTMLElement} 被添加的DOM元素
 */
Expedition.fn.dom.insertAfter = function (newElement, existElement) {
    var g, existParent;
    g = Expedition.fn.dom._g;
    newElement = g(newElement);
    existElement = g(existElement);
    existParent = existElement.parentNode;
    
    if (existParent) {
        existParent.insertBefore(newElement, existElement.nextSibling);
    }
    return newElement;
};

/**
 * 获取目标元素的第一个子元素节点
 *
 * @param {HTMLElement|String} element 目标元素或目标元素的id
 * @return {HTMLElement} 第一个子元素，如果没有找到，返回 null
 */
Expedition.fn.dom.first = function (element) {
    return Expedition.fn.dom._matchNode(element, 'nextSibling', 'firstChild');
};

/**
 * 将目标元素添加到基准元素之前
 * 
 * @param {HTMLElement|string} newElement   被添加的目标元素
 * @param {HTMLElement|string} existElement 基准元素
 * @return {HTMLElement} 被添加的DOM元素
 */
Expedition.fn.dom.insertBefore = function (newElement, existElement) {
    var g, existParent;
    g = Expedition.fn.dom._g;
    newElement = g(newElement);
    existElement = g(existElement);
    existParent = existElement.parentNode;

    if (existParent) {
        existParent.insertBefore(newElement, existElement);
    }

    return newElement;
};

/**
 * 获取目标元素所属的window对象
 * 如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
 *
 * @param {HTMLElement|string} element  目标元素或目标元素的id
 * @param {string}             position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string}             html     要插入的html
 */
Expedition.fn.dom.insertHTML = function (element, position, html) {
    element = Expedition.fn.dom.g(element);

    if (element.insertAdjacentHTML) {
        element.insertAdjacentHTML(position, html);
    } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        var range = element.ownerDocument.createRange();
        range.setStartBefore(element);
        var fragment = range.createContextualFragment(html),
            parent = element.parentNode, tmpEl;
        switch (position.toUpperCase()) {
            case 'BEFOREBEGIN':
                parent.insertBefore(fragment, element);
                break;
            case 'AFTERBEGIN':
                element.insertBefore(fragment, element.firstChild);
                break;
            case 'BEFOREEND':
                element.appendChild(fragment);
                break;
            case 'AFTEREND':
                (tmpEl = element.nextSibling) ? parent.insertBefore(fragment, tmpEl) : parent.appendChild(fragment);
        }
    }
    return element;
};

Expedition.fn.insertHTML = Expedition.fn.dom.insertHTML;

/**
 * 从DOM树上移除目标元素
 * 
 * @param {Element|String} element 必需，目标元素或目标元素的id
 * @return {Element} 被操作的DOM元素
 */
Expedition.fn.dom.remove = function (element) {
    element = Expedition.fn.dom.g(element);

    //去掉了对ie下的特殊处理：创建一个div，appendChild，然后div.innerHTML = ""
    (tmpEl = element.parentNode) && tmpEl.removeChild(element);
};

/**
 * 获取目标元素指定class的最近的祖先元素
 * 使用者应保证提供的className合法性，不应包含不合法字符
 * className合法字符参考：http://www.w3.org/TR/CSS2/syndata.html
 *
 * @param {HTMLElement|string} element   目标元素或目标元素的id
 * @param {string}             className 祖先元素的class，只支持单个class
 * @return {HTMLElement} 祖先元素，如果找不到返回null
 */
Expedition.fn.dom.getAncestorByClass = function (element, className) {
    element = Expedition.fn.dom.g(element);
    className = new RegExp("(^|\\s)" + Expedition.fn.string.trim(className) + "(\\s|\x24)");

    while ((element = element.parentNode) && element.nodeType == 1) {
        if (className.test(element.className)) {
            return element;
        }
    }

    return null;
};



/**
 * Expedition lib
 * @author yangji01
 * version: 1.0
 */

/**
 * 声明Expedition.fn._lib包
 */
Expedition.fn._lib = Expedition.fn._lib || {};

/**
 * 构造直线方程 y = ax + b
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
Expedition.fn._lib._makeLine = function(x1, y1, x2, y2){
    var a = 0,
        b = 0;
        
    if( x1 === x2){
        //y = b;
        return {
            a : x1,
            b : 0
        }
    }else{
        a = (y1 - y2 + 0.0) / (x1 - x2);
        b = y1 - a * x1;
        
        return {
            a : a,
            b : b
        }
    }
}

/**
 * 寻找两条直线的交点坐标
 * @param {Object} a1
 * @param {Object} b1
 * @param {Object} a2
 * @param {Object} b2
 */
Expedition.fn._lib._findPoint = function(a1, b1, a2, b2){
    var x = 0,
        y = 0;
        
    if(a1 === a2){
        //两直线平行  没有交点
        return false;
    }else{
        x = (b2 - b1 + 0.0) / (a1 - a2);
        y = a1 * x + b1;
        
        return {
            x : x,
            y : y
        }
    }
}

/**
 * 判断点相对线的位置
 * @param {Object} x
 * @param {Object} y
 * @param {Object} a
 * @param {Object} b
 */
Expedition.fn._lib._judgePoint = function(x, y, a, b){
    return y - ( a * x +b );
}

/**
 * Expedition.fn.object包
 */
Expedition.fn.object = Expedition.fn.object || {};

/**
 * 将源对象的所有属性拷贝到目标对象中
 * 
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 目标对象
 */
Expedition.fn.object.extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }
    
    return target;
};

// 声明快捷方法
Expedition.fn.extend = Expedition.fn.object.extend;

/**
 * 循环遍历object中的每一个元素
 * 
 * @param {Array}    source   需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数
 * @return {Array} 遍历的数组
 */
Expedition.fn.object.each = function (source, iterator) {
    var returnValue, key, item; 
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);
        
                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

/**
 * 获取目标对象的键名列表
 * 
 * @param {Object} source 目标对象
 * @return {Array} 键名列表
 */
Expedition.fn.object.keys = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = k;
        }
    }
    return result;
};

/**
 * 获取目标对象的值列表
 * 
 * @param {Object} source 目标对象
 * @return {Array} 值列表
 */
Expedition.fn.object.values = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = source[k];
        }
    }
    return result;
};

/**
 * 对一个object进行深度拷贝
 * 
 * @param {Any} source 需要进行拷贝的对象
 * @return {Any} 拷贝后的新对象
 */

Expedition.fn.object.clone  = (function(buildInObject){
    return function (source) {
        var result = source, i, len;
        if (!source
            || source instanceof Number
            || source instanceof String
            || source instanceof Boolean) {
            return result;
        } else if (source instanceof Array) {
            result = [];
            var resultLen = 0;
            for (i = 0, len = source.length; i < len; i++) {
                result[resultLen++] = Expedition.fn.object.clone(source[i]);
            }
        } else if ('object' == typeof source) {
            if(buildInObject[Object.prototype.toString.call(source)]){
                return result;
            }
            result = {};
            for (i in source) {
                if (source.hasOwnProperty(i)) {
                    result[i] = Expedition.fn.object.clone(source[i]);
                }
            }
        }
        return result;
    };
})({
    // buildInObject, 用于处理无法遍历Date等对象的问题
    '[object Function]': 1,
    '[object RegExp]'  : 1,
    '[object Date]'    : 1,
    '[object Error]'   : 1 
});

//定义坐标工具
Expedition.fn._lib.vector = Expedition.fn._lib.vector || {};

/**
 * 计算坐标的旋转量
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} angle 选择角度
 */
Expedition.fn._lib.vector.rotate = function(x,y,angle){
    var angle = Expedition.fn._lib.rad(angle),
        x1 = Math.cos(angle) * x - Math.sin(angle) * y;
        y1 = Math.sin(angle) * x + Math.cos(angle) * y;

    return {
        x : x1,
        y : y1
    }
}

/**
 * 复制坐标
 * 
 * @param {Object} x
 * @param {Object} y
 */
Expedition.fn._lib.vector.clone = function(x,y){
    return {
        x : x,
        y : y
    }
}

/**
 * 按比例增长
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} rate
 */
Expedition.fn._lib.vector.mult = function(x,y,rate){
    return {
        x : x*rate,
        y : y*rate
    }
}

/**
 * 矢量和
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
Expedition.fn._lib.vector.add = function(x1,y1,x2,y2){
    return {
        x : x1 + x2,
        y : y1 + y2
    }
}

/**
 * 计算矢量长度
 * 
 * @param {Object} x
 * @param {Object} y
 */
Expedition.fn._lib.length = function(x,y){
    return Math.sqrt(x * x + y * y);
}

/**
 * 定义 random
 */
Expedition.fn._lib.random = Expedition.fn._lib.random || {};

/**
 * 随机生成 min 到 max的数据数
 * 
 * @param {Object} min
 * @param {Object} max
 */
Expedition.fn._lib.random.randomNum = function(min,max){
    return Math.random() * (max - min) + min;
}

/**
 * 随机生成min到max的整数
 * 
 * @param {Object} min
 * @param {Object} max
 */
Expedition.fn._lib.random.randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机生成颜色和透明度
 * 
 * @param {Object} min
 * @param {Object} max
 */
Expedition.fn._lib.random.randomRgba = function(min,max,a){
    var red = Expedition.fn._lib.random.randomInt(min,max),
        green = Expedition.fn._lib.random.randomInt(min,max),
        blue = Expedition.fn._lib.random.randomInt(min,max);
    
    return Expedition.fn._lib.rgba(red,green,blue,a);
}

/**
 * 颜色
 * @param {Object} r
 * @param {Object} g
 * @param {Object} b
 * @param {Object} a
 */
Expedition.fn._lib.rgba = function(r,g,b,a){
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

/**
 * 弧度
 * 
 * @param {Object} angle
 */
Expedition.fn._lib.rad = function(angle){
    return Math.PI / 180 *angle;
}


Expedition.fn._lib.array = Expedition.fn._lib.array || {};

/**
 * 移除数组中的项
 * 
 * @param {Array}        source    需要移除项的数组
 * @param {Any|Function} condition 要移除的项或移除匹配函数
 */
Expedition.fn._lib.array.remove = function (source, condition) {
    var len = source.length,
        iterator = condition;
    
    if ('function' != typeof condition) {
        iterator = function (item) {
            return condition === item;
        };
    }
    
    while (len--) {
        if (true === iterator.call(source, source[len], len)) {
            source.splice(len, 1);
        }
    }
};

/**
 * 从数组中寻找符合条件的第一个数组元素
 * 
 * @param {Array}    source   需要查找的数组
 * @param {Function} iterator 对每个数组元素进行查找的函数
 * @return {Any|null} 符合条件的第一个数组元素，找不到时返回null
 */
Expedition.fn._lib.array.find = function (source, iterator) {
    var item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            if (true === iterator.call(source, item, i)) {
                return item;
            }
        }
    }
    
    return null;
};

/**
 * 移除数组中指定位置的项
 * @param {Object} source
 * @param {Object} index
 */
Expedition.fn._lib.array.removeAt = function (source, index) {
    return source.splice(index, 1)[0];
};

/**
 * 遍历数组中所有元素
 * 
 * @param {Array}    source   需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数
 * @return {Array} 遍历的数组
 */
Expedition.fn._lib.array.each = function (source, iterator) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            returnValue = iterator.call(source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

Expedition.fn._lib.vector3d = Expedition.fn._lib.vector3d || {};

/**
 * 3d坐标中绕x轴旋转
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} z
 * @param {Object} a  角度
 */
Expedition.fn._lib.vector3d.rotateX = function(x,y,z,a){
    return {
        x: x,
        y: y * Math.cos(a) - z * Math.sin(a),
        z: y * Math.sin(a) + z * Math.cos(a)
    };
};

/**
 * 3d坐标中绕y轴旋转
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} z
 * @param {Object} a  角度
 */
Expedition.fn._lib.vector3d.rotateY = function(x,y,z,a){
    return {
        x: x * Math.cos(a) + z * Math.sin(a),
        y: y,
        z: z * Math.cos(a) - x * Math.sin(a)
    };
};

/**
 * 3d坐标中绕z轴旋转
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} z
 * @param {Object} a  角度
 */
Expedition.fn._lib.vector3d.rotateZ = function(x,y,z,a){
    return {
        x: x * Math.cos(a) - y * Math.sin(a),
        y: x * Math.sin(a) + y * Math.cos(a),
        z: z
    };
};

/*
 * 球面坐标系转直角坐标系
 * 
 * @param {Number} a 仰角
 * @param {Number} b 转角
 * @param {Number} r 半径
 * @param {Number} rr 偏移量
 */
Expedition.fn._lib.vector3d.spherical = function(a, b, r , delta){
    var delta = delta || 0;
    
    return {
        x: r * Math.sin(a) * Math.cos(b + delta),
        y: r * Math.sin(a) * Math.sin(b + delta),
        z: r * Math.cos(a)
    };
};

/**
 * 将3d坐标转化为2d坐标  现在以（0,0,1000）为观察点  TODO:这里以后可以做升级
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} z
 * @param {Object} ax
 * @param {Object} ay
 * @param {Object} az
 */
Expedition.fn._lib.vector3d.transform2d = function(x,y,z,ax,ay,az){
    var v1 = Expedition.fn._lib.vector3d.rotateX(x, y, z, ax),//绕X轴旋转
        v2 = Expedition.fn._lib.vector3d.rotateY(v1.x, v1.y, v1.z, ay),//绕Y轴旋转
        v3 = Expedition.fn._lib.vector3d.rotateZ(v2.x, v2.y, v2.z, az),//绕Z轴旋转
        h = 1- v3.z / 1000.0;//观察点
        
    return {
        x : v3.x / h,
        y : v3.y / h
    }
}

/**
 * Expedition.paint
 * @author yangji
 * version: 1.0
 * date 2012.1.10
 */

/**
 * 声明Expedition.fn.paint包
 */
Expedition.fn.paint = Expedition.fn.paint || {};

/**
 * 为Expedition.canvas对象设置
 * 
 * @param {Object} id
 * @param {Object} width
 * @param {Object} height
 */
Expedition.fn.paint.canvas = function(id, width, height){
    if (this.id) {
        Expedition.canvas[this.id]._canvas = document.getElementById(id);
    }
    //当前画布
    Expedition.canvas._canvas = document.getElementById(id);
    if (width || height) {
        this.size(width, height);
    }

    Expedition.fn.paint._newCanvas(this.id);
    
    return this;
};

/**
 * 获取canvas 的 z-index 的私有方法
 * 
 * @param {Object} node
 */
Expedition.fn.paint._getZIndex = function(node){
    while(node){
        if(node == document){
            return 1;
        }
        if(Expedition.fn.dom.getStyle(node,'z-index') && Expedition.fn.dom.getStyle(node,'z-index') != 'auto'){
            return Expedition.fn.dom.getStyle(node,'z-index');
        }
        node = node.parentNode;
    }
};

/**
 * 新canvas对象 对象id为  canvasId+对象id   event层id为eventCanvasId + 底层canvas标签的id
 * 
 * @param {Object} id
 */
Expedition.fn.paint._newCanvas = function(id){
    var canvas = Expedition.fn.paint._getCanvas(id),
        id = id ? 'canvasId' + id : false,
        node,
        pos,
        canvasId,//底层标签id
        eventNode,
        index;
    
    //没有添加新canvas
    if (id) {
        if (!$().g(id)) {
            node = document.createElement('canvas');
            node.setAttribute('id', id);
        }
        else {
            node = $().g(id);
        }
        if(canvas){
            canvasId = Expedition.fn.dom.getAttr(canvas,'id');
            Expedition.fn.dom.insertAfter(node,canvas);
            pos = Expedition.fn.dom.getPosition(canvas);
            index = Expedition.fn.paint._getZIndex(canvas);
            //位置
            Expedition.fn.dom.setStyles(node,{
                position : 'absolute',
                left : pos.left + 'px',
                top : pos.top + 'px',
                'z-index' : index + 1
            })
            //设置index属性
            Expedition.fn.dom.setAttr(node,'index',1);
            
            //大小
            if (node.width != canvas.width || node.height != canvas.height) {
                node.width = canvas.width;
                node.height = canvas.height;
            }
            //设置基础canvas
            node.setAttribute('BaseCanvas', canvasId);
        }
    }
    if(canvas){
        //新建event层
        canvasId = Expedition.fn.dom.getAttr(canvas,'id');
        pos = Expedition.fn.dom.getPosition(canvas);
        index = Expedition.fn.paint._getZIndex(canvas);
        if (!$().g('eventCanvasId' + canvasId)) {
            eventNode = document.createElement('canvas');
            eventNode.setAttribute('id', 'eventCanvasId' + canvasId);
            Expedition.fn.event._addEventHandle(eventNode);
            
            eventNode.setAttribute('BaseCanvas', canvasId);
        }else{
            eventNode = $().g('eventCanvasId' + canvasId);
        }
        Expedition.fn.dom.insertAfter(eventNode,canvas);
        //位置
        Expedition.fn.dom.setStyles(eventNode,{
            position : 'absolute',
            left : pos.left + 'px',
            top : pos.top + 'px',
            'z-index' : index + 10000
        })
        //设置index属性
        Expedition.fn.dom.setAttr(eventNode,'index',10000);
        //设置对应的canvas
        Expedition.fn.dom.setAttr(eventNode,'canvasId',canvasId);
        
        //大小
        eventNode.width = canvas.width;
        eventNode.height = canvas.height;
        
    }
};

/**
 * 设置新建的canvas的z-index event层为10000
 * 
 * @param {Object} index
 */
Expedition.fn.paint.setIndex = function(newIndex){
    var canvas = Expedition.fn.paint._getCanvas(this.id),
        newCanvas = Expedition.fn.paint._getNewCanvas(this.id),
        index = Expedition.fn.paint._getZIndex(canvas);
    
    //必须小于event层的高度
    if(newIndex >= 10000){
        newIndex = 9999;
    }
    if(newIndex){
        Expedition.fn.dom.setStyle(newCanvas,'z-index',index + newIndex);
        //设置index属性
        Expedition.fn.dom.setAttr(newCanvas,'index',newIndex);
    }
        
    return this;
};

/**
 * 获取新建canvas的index  相对于canvas标签的上下位置
 */
Expedition.fn.paint.getIndex = function(){
    var newCanvas = Expedition.fn.paint._getNewCanvas(this.id),
        index = Expedition.fn.dom.getAttr(newCanvas,'index');
        
    return index;
};

/**
 * 获取新建的canvas
 * 
 * @param {Object} id
 */
Expedition.fn.paint._getNewCanvas = function(id){
    var id = id ? 'canvasId' + id : false,
        canvas;
    
    //没有传入id 返回当前的canvas    
    if(!id){
        canvas = Expedition.canvas._canvas;
    }else{
        canvas = $().g(id);
    }
    
    return canvas;
}

/**
 * 获取canvas
 * 
 * @param {Object} id
 */
Expedition.fn.paint._getCanvas = function(id){
    var canvas ;
    
    if(id){
        canvas = Expedition.canvas[id]._canvas;
    }else{
        canvas = Expedition.canvas._canvas;
    }
    
    return canvas;
};

/**
 * 设置canvas的宽度、高度
 * 
 * @param {Object} width
 * @param {Object} height
 */
Expedition.fn.paint.size = function(width, height){
    var canvas = Expedition.fn.paint._getCanvas(this.id),
        canvasId = canvas.getAttribute('id'),
        allCanvas = document.getElementsByTagName('canvas'),
        len = allCanvas.length,
        baseCanvas,
        pos;
    
    canvas.width = width;
    canvas.height = height;
    
    pos = Expedition.fn.dom.getPosition(canvas);
    for(var i = 0 ; i < len ; i ++ ){
        baseCanvas = allCanvas[i].getAttribute('BaseCanvas');
        if(baseCanvas == canvasId && (allCanvas[i].width != canvas.width || allCanvas[i].heigth != canvas.height)){
            allCanvas[i].width = canvas.width;
            allCanvas[i].height = canvas.height;
            $().setStyles(allCanvas[i],{
                left : pos.left + 'px',
                top : pos.top + 'px'
            })
        }
    }   
    
    return this;
};

/**
 * 设置上下文
 * 
 * @param {Object} type
 */
Expedition.fn.paint.context =function(type){
    var canvas = Expedition.fn.paint._getNewCanvas(this.id);
    
    Expedition.canvas[this.id]._context = canvas.getContext(type);
    // 当前上下文type
    Expedition.canvas._context = Expedition.canvas._canvas.getContext(type);

    return this;
};

/**
 * 获取context的私有方法
 * 
 * @param {Object} id
 */
Expedition.fn.paint._getContext = function(id){
    var context = null,
        canvas;
    
    if(id){
        //如果为canvas对象
        if (Expedition.canvas[id]._context) {
            context = Expedition.canvas[id]._context;
        }else{
            canvas = Expedition.fn.paint._getNewCanvas(id);
            context = canvas.getContext('2d');
        }
    }else if(Expedition.canvas._context){
        //当前的上下文type
        context = Expedition.canvas._context;
    }else{
        //默认情况下为2d
        context = Expedition.canvas._canvas.getContext('2d');
    }
    
    return context;
};

/**
 * 设置context
 * 
 * @param {Object} id
 * @param {Object} param
 */
Expedition.fn.paint._setContext = function(id,param){
    var context = Expedition.fn.paint._getContext(id);  
    
    if(param){
        //线条颜色
        if(param.strokeStyle){
            context.strokeStyle = param.strokeStyle;
        }
        //线条宽度
        if(param.linewidth){
            context.linewidth = param.linewidth;
        }
        //线条两头样式  有三个值 butt round square
        if(param.lineCap ){
            if (param.lineCap == 'butt' || param.lineCap == 'round' || param.lineCap == 'square') {
                context.lineCap = param.lineCap;
            }
        }
        //线条拐点样式  三个值   miter round bevel 
        if(param.lineJoin){
            if(param.lineJoin == 'miter' || param.lineJoin == 'round' || param.lineJoin == 'bevel'){
                context.lineJoin = param.lineJoin;
            }
        }
        //线条连接处的斜率
        if(param.miterLimit){
            context.miterLimit = param.miterLimit;
        }
        //填充样式
        if(param.fillStyle){
            context.fillStyle = param.fillStyle;
        }
        //模糊等级
        if(param.shadowBlur){
            context.shadowBlur = param.shadowBlur;
        }
        //阴影颜色
        if(param.shadowColor){
            context.shadowColor = param.shadowColor;
        }
        //阴影X轴偏移
        if(param.shadowOffsetX){
            context.shadowOffsetX = param.shadowOffsetX;
        }
        //阴影Y轴偏移
        if(param.shadowOffsetY){
            context.shadowOffsetY = param.shadowOffsetY;
        }
    }
    
    return this;
}

/**
 * 线
 * 
 * @param {Object} beginX
 * @param {Object} beginY
 * @param {Object} endX
 * @param {Object} endY
 * @param {Object} param 不是必须的
 */
Expedition.fn.paint.line = function(beginX,beginY,endX,endY,param){
    var context = Expedition.fn.paint._getContext(this.id); 
    
    context.beginPath();
    context.moveTo(beginX,beginY);
    
    Expedition.fn.paint._setContext(this.id,param);
    
    context.lineTo(endX,endY);
    context.stroke();
    context.closePath();
        
    return this;
};

/**
 * 矩形边框
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} param
 */
Expedition.fn.paint.rect = function(X,Y,width,height,param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.beginPath();
    context.moveTo(X,Y);
    
    Expedition.fn.paint._setContext(this.id,param);
    context.strokeRect(X,Y,width,height);
    
    if(param){
        if(param.fillStyle){
            context.fillRect(X,Y,width,height);
        }
    }
    
    context.closePath();
        
    return this;
};

/**
 * 清空区域
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} param
 */
Expedition.fn.paint.clearRect = function(X,Y,width,height,param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    Expedition.fn.paint._setContext(this.id,param);
    
    context.clearRect(X,Y,width,height);
        
    return this;
};

/**
 * 填充区域
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} param
 */
Expedition.fn.paint.fillRect = function(X,Y,width,height,param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    Expedition.fn.paint._setContext(this.id,param);
    
    context.fillRect(X,Y,width,height);
        
    return this;
};

/**
 * 矩形区域描边
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} param
 */
Expedition.fn.paint.strokeRect = function(X,Y,width,height,param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    Expedition.fn.paint._setContext(this.id,param);
    
    context.strokeRect(X,Y,width,height);
        
    return this;
};

/**
 * 圆 圆弧
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} radius
 * @param {Object} startAngle
 * @param {Object} endAngle
 * @param {Object} anticlockwise
 * @param {Object} param
 */
Expedition.fn.paint.arc = function(X,Y,radius,startAngle,endAngle,anticlockwise,param){
    var context = Expedition.fn.paint._getContext(this.id);
        
    Expedition.fn.paint._setContext(this.id,param);
    context.beginPath();
    context.arc(X,Y,radius,startAngle,endAngle,anticlockwise);
    context.stroke();
    
    if(param){
        if(param.fillStyle){
            context.fill();
        }
    }
    
    return this;
};

/**
 * 外旋轮线
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} a
 * @param {Object} b
 * @param {Object} c
 * @param {Object} param
 */
Expedition.fn.paint.epitrochoid = function(X,Y,a,b,c,param){
    var x1,
        y1,
        x2,
        y2,
        a = a + 0.0,
        b = b + 0.0,
        c = c + 0.0,
        intA = parseInt(a),
        intB = parseInt(b),
        temp = 0,
        i = 1,
        theta,
        context = Expedition.fn.paint._getContext(this.id);
    
    //保存状态  函数结束是弹出状态  防止translate对全局的影响
    context.save();
    context.translate(X,Y);
    context.beginPath();
    
    Expedition.fn.paint._setContext(this.id,param);
    
    x1 = (a + b)* Math.cos(0) - c * Math.cos(0);
    y1 = (a + b)* Math.sin(0) - c * Math.sin(0);
    
    context.moveTo(x1,y1);
    
    //计算结束时的i
    do{
        temp++;
    }while((intB * temp)%(intA + intB) != 0);
    
    do {
        if (i > (intB * temp)/(intA + intB) * 360) break;
        theta = Math.PI / 180 * i;
        x2 = (a + b)* Math.cos(theta) - c * Math.cos((a / b + 1)* theta);
        y2 = (a + b)* Math.sin(theta) - c * Math.sin((a / b + 1)* theta);
        context.lineTo(x2,y2);
        i++;
    } while (x1 != x2 || y1 != y2);
    
    context.stroke();
    context.restore();
    
    return this;
};

/**
 * 内旋轮线
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} a
 * @param {Object} b
 * @param {Object} c
 * @param {Object} param
 */
Expedition.fn.paint.hypotrochoid = function(X,Y,a,b,c,param){
    var x1,
        y1,
        x2,
        y2,
        a = a + 0.0,
        b = b + 0.0,
        c = c + 0.0,
        intA = parseInt(a),
        intB = parseInt(b),
        temp = 0,
        i = 1,
        theta,
        context = Expedition.fn.paint._getContext(this.id);
    
    //保存状态  函数结束是弹出状态  防止translate对全局的影响
    context.save();
    context.translate(X,Y);
    context.beginPath();
    
    Expedition.fn.paint._setContext(this.id,param);
    
    x1 = (a - b)* Math.cos(0) + c * Math.cos(0);
    y1 = (a - b)* Math.sin(0) - c * Math.sin(0);
    
    context.moveTo(x1,y1);
    
    //计算结束时的i
    do{
        temp++;
    }while((intB * temp)%(intA - intB) != 0);
    
    do {
        if (i> (intB * temp)/(intA - intB)*360) break;
        theta = Math.PI / 180 * i;
        x2 = (a - b)* Math.cos(theta) + c * Math.cos((a / b - 1)* theta);
        y2 = (a - b)* Math.sin(theta) - c * Math.sin((a / b - 1)* theta);
        context.lineTo(x2,y2);
        i++;
    } while (x1 != x2 || y1 != y2);
    
    context.stroke();
    context.restore();
    
    return this;
};

/**
 * 外摆线
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} n
 * @param {Object} size
 */
Expedition.fn.paint.epicycloid = function(X,Y,n,size){
    var x1,
        y1,
        x2,
        y2,
        i = 1,
        theta,
        size = size || 50,
        context = Expedition.fn.paint._getContext(this.id);
    
    //保存状态  函数结束是弹出状态  防止translate对全局的影响
    context.save();
    context.translate(X,Y);
    context.beginPath();
    
    x1 = size * (Math.cos(0) + 1 / n * Math.cos(0));
    y1 = size * (Math.sin(0) +1 / n * Math.sin(0));
    
    context.moveTo(x1,y1);
    
    do {
        if (i>360) break;
        theta =Math.PI / 180 * i ;
        x2 = size * (Math.cos(theta) + 1 / n * Math.cos(n * theta));
        y2 = size * (Math.sin(theta) + 1 / n * Math.sin(n * theta));
        context.lineTo(x2,y2);
        i++;
    } while(x1 != x2 || y1 != y2);
    
    context.stroke();
    context.restore();
    
    return this;
};

/**
 * 内摆线
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} n
 * @param {Object} size
 */
Expedition.fn.paint.hypocycloid = function(X,Y,n,size){
    var x1,
        y1,
        x2,
        y2,
        i = 1,
        theta,
        size = size || 50,
        context = Expedition.fn.paint._getContext(this.id);
    
    //保存状态  函数结束是弹出状态  防止translate对全局的影响
    context.save();
    context.translate(X,Y);
    context.beginPath();
    
    x1 = size * ( Math.cos(0) + 1 / n * Math.cos(0));
    y1 = size * ( Math.sin(0) - 1 / n * Math.sin(0));
    
    context.moveTo(x1,y1);
    
    do {
        if (i>360) break;
        theta = Math.PI / 180 * i;
        x2 = size * ( Math.cos(theta) + 1 / n * Math.cos(n * theta));
        y2 = size * ( Math.sin(theta) - 1 / n * Math.sin(n * theta));
        context.lineTo(x2,y2);
        i++;
    } while (x1 != x2 || y1 != y2);
    
    context.stroke();
    context.restore();
    
    return this;
};

/**
 * 保存上下文状态
 */
Expedition.fn.paint.save = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.save();

    return this;
};

/**
 * 弹出上下文状态
 */
Expedition.fn.paint.restore = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.restore();

    return this;
};

/**
 * 转换
 * 
 * @param {Object} X
 * @param {Object} Y
 */
Expedition.fn.paint.translate = function(X,Y){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.translate(X,Y);

    return this;
};

/**
 * beginPath
 */
Expedition.fn.paint.beginPath = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.beginPath();

    return this;
};

/**
 * closePath
 */
Expedition.fn.paint.closePath = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.closePath();

    return this;
};

/**
 * 路径填充
 */
Expedition.fn.paint.fill = function(param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    Expedition.fn.paint._setContext(this.id,param);
    context.fill();

    return this;
};

/**
 * 路径描边
 */
Expedition.fn.paint.stroke = function(param){
    var context = Expedition.fn.paint._getContext(this.id);
    
    Expedition.fn.paint._setContext(this.id,param);
    context.stroke();

    return this;
};

/**
 * 路径裁剪
 */
Expedition.fn.paint.clip = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.clip();

    return this;
};

/**
 * 移动到某点
 * 
 * @param {Object} X
 * @param {Object} Y
 */
Expedition.fn.paint.moveTo = function(X,Y){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.moveTo(X,Y);

    return this;
};

/**
 * 画一条线到某一点
 * 
 * @param {Object} X
 * @param {Object} Y
 */
Expedition.fn.paint.lineTo = function(X,Y){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.lineTo(X,Y);

    return this;
};

/**
 * 最短圆弧
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} endX
 * @param {Object} endY
 * @param {Object} radius
 */
Expedition.fn.paint.arcTo = function(X,Y,endX,endY,radius){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.arcTo(X,Y,endX,endY,radius);

    return this;
};

/**
 * 三次方贝塞尔曲线
 * 
 * @param {Object} X1
 * @param {Object} Y1
 * @param {Object} X2
 * @param {Object} Y2
 * @param {Object} endX
 * @param {Object} endY
 */
Expedition.fn.paint.bezierCurveTo = function(X1,Y1,X2,Y2,endX,endY){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.bezierCurveTo(X1,Y1,X2,Y2,endX,endY);

    return this;
};

/**
 * 二次方贝塞尔曲线
 * 
 * @param {Object} X
 * @param {Object} Y
 * @param {Object} endX
 * @param {Object} endY
 */
Expedition.fn.paint.quadraticCurveTo = function(X,Y,endX,endY){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.quadraticCurveTo(X,Y,endX,endY);

    return this;
};

/**
 * 点是否在路径上
 * 
 * @param {Object} X
 * @param {Object} Y
 */
Expedition.fn.paint.isPointInPath = function(X,Y){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.isPointInPath(X,Y);
};

/**
 * 自定义曲线 格式为y = func(x)
 * 
 * @param {Object} func
 * @param {Object} startX
 * @param {Object} endX
 */
Expedition.fn.paint.customCurves = function(func,startX,endX){
    var id = this.id,
        tempY,
        delta = 1,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        width = canvas.width,
        context = Expedition.fn.paint._getContext(id);
    
    if(typeof(func) == 'function'){
        tempY = func(startX);
        
        context.save();
        context.moveTo(startX, tempY);
        if(startX > endX){
            delta = -1;
            if(startX > width){
                startX = width;
            }
        }else if(startX < endX){
            if(startX < 0){
                startX = 0;
            }
        }else{
            return this;
        }
        
        while(startX != endX || startX > width || startX < 0){
            startX += delta;
            tempY = func(startX);
            context.lineTo(startX,tempY);
        }
        
        context.stroke();
        context.restore();
    }
    
    return this;
}


/**
 * Expedition.render
 * @author yangji01
 * version: 1.0
 */

/**
 * 定义Expedition.fn.render
 */
Expedition.fn.render = Expedition.fn.render || {};

/**
 * 获取描边样式
 */
Expedition.fn.render.getStrokeStyle = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.strokeStyle;
};

/**
 * 设置描边样式
 * 
 * @param {Object} strokeStyle
 */
Expedition.fn.render.setStrokeStyle = function(strokeStyle){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.strokeStyle = strokeStyle;
    
    return this;
}

/**
 * 获取线条宽度
 */
Expedition.fn.render.getLineWidth = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.lineWidth;
}

/**
 * 设置线条宽度
 * 
 * @param {Object} lineWidth
 */
Expedition.fn.render.setLineWidth = function(lineWidth){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.lineWidth = lineWidth;
    
    return this;
}

/**
 * 获取线条头样式
 */
Expedition.fn.render.getLineCap = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.lineCap;
}

/**
 * 设置线条头样式
 * 
 * @param {Object} lineCap
 */
Expedition.fn.render.setLineCap = function(lineCap){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.lineCap = lineCap;
    
    return this;
}

/**
 * 获取线条拐点样式
 */
Expedition.fn.render.getLineJoin = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.lineJoin;
}

/**
 * 设置线条拐点样式
 * 
 * @param {Object} lineJoin
 */
Expedition.fn.render.setLineJoin = function(lineJoin){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.lineJoin = lineJoin;
    
    return this;
}

/**
 * 获取线条拐点处斜率
 */
Expedition.fn.render.getMiterLimit = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.miterLimit;
}

/**
 * 设置线条拐点处斜率
 * 
 * @param {Object} miterLimit
 */
Expedition.fn.render.setMiterLimit = function(miterLimit){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.miterLimit = miterLimit;
    
    return this;
}

/**
 * 获取填充样式
 */
Expedition.fn.render.getFillStyle = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.fillStyle;
}

/**
 * 设置填充样式
 * 
 * @param {Object} fillStyle
 */
Expedition.fn.render.setFillStyle = function(fillStyle){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.fillStyle = fillStyle;
    
    return this;
}

/**
 * 获取阴影模糊程度
 */
Expedition.fn.render.getShadowBlur = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.shadowBlur;
}

/**
 * 设置阴影模糊程度
 * 
 * @param {Object} shadowBlur
 */
Expedition.fn.render.setShadowBlur = function(shadowBlur){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.shadowBlur = shadowBlur;
    
    return this;
}

/**
 * 获取阴影颜色
 */
Expedition.fn.render.getShadowColor = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.shadowColor;
}

/**
 * 设置阴影颜色
 * 
 * @param {Object} shadowColor
 */
Expedition.fn.render.setShadowColor = function(shadowColor){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.shadowColor = shadowColor;
    
    return this;
}

/**
 * 获取阴影在x轴方向上的偏移
 */
Expedition.fn.render.getShadowOffsetX = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.shadowOffsetX;
}

/**
 * 设置阴影在x轴方向上的偏移
 * 
 * @param {Object} shadowOffsetX
 */
Expedition.fn.render.setShadowOffsetX = function(shadowOffsetX){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.shadowOffsetX = shadowOffsetX;
    
    return this;
}

/**
 * 获取阴影在y轴上的偏移
 */
Expedition.fn.render.getShadowOffsetY = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.shadowOffsetY;
}

/**
 * 设置阴影在y轴上的偏移
 * 
 * @param {Object} lineCap
 */
Expedition.fn.render.setShadowOffsetY = function(lineCap){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.setShadowOffsetY = setShadowOffsetY;
    
    return this;
}

/**
 * 获取阴影的属性
 */
Expedition.fn.render.getShadow = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return {
        shadowBlur : context.shadowBlur,
        shadowColor : context.shadowColor,
        shadowOffsetX :  context.shadowOffsetX,
        shadowOffsetY : context.shadowOffsetY
    };
}

/**
 * 设置阴影的属性
 * 
 * @param {Object} shadow
 */
Expedition.fn.render.setShadow = function(shadow){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.shadowBlur = shadow.shadowBlur;
    context.shadowColor = shadow.shadowColor;
    context.shadowOffsetX = shadow.shadowOffsetX;
    context.shadowOffsetY = shadow.shadowOffsetY;
    
    return this;
}

/**
 * 获取合成属性
 */
Expedition.fn.render.getCompositeOperation = function(){
    var context = Expedition.fn.paint._getContext(this.id);
    
    return context.globalCompositeOperation;
}

/**
 * 设置合成属性
 * 
 * @param {Object} globalCompositeOperation
 */
Expedition.fn.render.setCompositeOperation = function(globalCompositeOperation){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.globalCompositeOperation = globalCompositeOperation;
    
    return this;
}

/**
 * 角度偏转
 * 
 * @param {Object} angle
 */
Expedition.fn.render.rotate = function(angle){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.rotate(angle);
    
    return this;
}

/**
 * 缩放
 * 
 * @param {Object} xRate
 * @param {Object} yRate
 */
Expedition.fn.render.scale = function(xRate,yRate){
    var context = Expedition.fn.paint._getContext(this.id);
    
    context.scale(xRate,yRate);
    
    return this;
}

/**
 * 创建线性渐变
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
Expedition.fn.render.createLinearGradient = function(x1,y1,x2,y2){
    var context = Expedition.fn.paint._getContext(this.id);
    
    //将创建的渐变变量存在_gradient中
    this._gradient = context.createLinearGradient(x1,y1,x2,y2);
    
    return this;
}

/**
 * 创建放射性渐变
 * 
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} r1
 * @param {Object} x2
 * @param {Object} y2
 * @param {Object} r2
 */
Expedition.fn.render.createRadialGradient = function(x1,y1,r1,x2,y2,r2){
    var context = Expedition.fn.paint._getContext(this.id);
    
    //将创建的渐变变量存在_gradient中
    this._gradient = context.createRadialGradient(x1,y1,r1,x2,y2,r2);

    return this;
}

/**
 * 渐变标志点
 * 
 * @param {Object} point
 * @param {Object} color
 */
Expedition.fn.render.addColorStop = function(point,color){
    
    if(this._gradient){
        this._gradient.addColorStop(point,color);
    }
    
    return this;
}

/**
 * 获取渐变变量
 */
Expedition.fn.render.getGradient = function(){
    return this._gradient;
}

/**
 * 生成随机颜色
 * 
 * @param {Object} min
 * @param {Object} max
 * @param {Object} a
 */
Expedition.fn.render.randomRgba = function(min,max,a){
    return Expedition.fn._lib.random.randomRgba(min,max,a);
}

/**
 * 画桃心
 * 
 * @param {Object} x 桃心中间上边的x坐标
 * @param {Object} y
 * @param {Object} size 桃心中间线段的长度  默认为80
 * @param {Object} fillStyle 填充样式 默认为红色
 */
Expedition.fn.render.heart = function(x,y,size,fillStyle){
    var context = Expedition.fn.paint._getContext(this.id),
        scale;
    
    //保存状态  函数结束时弹出状态  防止对全局的影响
    context.save();
    context.translate(x,y);
    
    //设置大小
    if(size){
        scale = size / 80.0;
        context.scale(scale,scale);
    }
    
    
    
    //开始画 逆时针方向
    context.beginPath();
    context.bezierCurveTo(0,-3,-5,-15,-25,-15);
    context.bezierCurveTo(-55,-15,-53,22.5,-53,15);
    context.bezierCurveTo(-55,40,-35,62,0,80);
    context.bezierCurveTo(35,62,55,40,53,15);
    context.bezierCurveTo(53,15,55,-15,25,-15);
    context.bezierCurveTo(10,-15,0,-3,0,0);
    context.closePath();
    context.restore();
    
    //设置填充样式
    context.save();
    if(fillStyle){
        context.fillStyle = fillStyle;
    }else{
        context.fillStyle = 'rgba(255,0,0,1)';
    }
    context.fill();
    context.restore();
    
    return this;
}

/**
 * 花
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} params 参数集合
 *      petal 数组 花瓣，如果指定直接将它绘制
 *      petalNum 花瓣数量 没有时为6到15的随机数
 *      petalColor 花瓣颜色 没有时随机指定
 *      isColorSame 花瓣颜色是否一样
 *      isShapeSame 花瓣形状是否一样
 *      petalMaxLength 花瓣的最大长度  默认是 30
 *      petalMinLength 花瓣的最小长度  默认 10
 *      gap 花瓣线条之间的间隙  0.1到1
 *      speed 花瓣成长的速度 
 *      startAngle 花瓣开始的角度
 *      shapevar1 花瓣形状参数
 *      shapevar2 花瓣形状参数
 */
Expedition.fn.render.flower = function(x,y,params){
    var context = Expedition.fn.paint._getContext(this.id),
        params = params || {},
        petal = params.petal,
        petalNum = params.petalNum,
        petalColor = params.petalColor,
        isColorSame = params.isColorSame == false ? false : true,
        isShapeSame = params.isShapeSame,
        petalMaxLength = params.petalMaxLength || 20,
        petalMinLength = params.petalMinLength || 10,
        petalMaxAngle = params.petalMaxAngle,
        petalMinAngle = params.petalMinAngle,
        gap,
        speed = params.speed || 0,
        color,
        petalLength,
        angle,
        shapevar1,
        shapevar2,
        startAngle = params.startAngle || 0,
        tempAngle = startAngle;//目前的角度
    
    context.save();
    
    //设置位置变化值
    this._x = 0;
    this._y = 0;
    
    //如果已经定义了花瓣
    if(petal){
        var len = petal.length;
        
        for(i = 0; i < len ; i++){
            petal[i].render();
        }
        return;
    }
    
    //没有指定花瓣数量时 给一个随机数
    if(!petalNum){
        petalNum = Expedition.fn._lib.random.randomInt(6,15);
    }
    
    for(i = 0 ; i < petalNum ; i++){
        //设置颜色
        if(petalColor){
            color = petalColor;
        }else if(!isColorSame || ! color){
            color = Expedition.fn._lib.random.randomRgba(0,255,0.5);
        }
        
        angle = 360 / petalNum;
        
        //如果花瓣长度一样
        if(isShapeSame){
            if(!petalLength){
                petalLength = Expedition.fn._lib.random.randomNum(petalMinLength,petalMaxLength);
            }
        }else{
            petalLength = Expedition.fn._lib.random.randomNum(petalMinLength,petalMaxLength);
        }
        //如果定义了花瓣线条间隙
        if(params.gap){
            gap = params.gap;
        }else{
            gap = Expedition.fn._lib.random.randomNum(0.1,1);
        }
        
        //如果定义了花瓣的形状参数
        if(params.shapevar1){
            shapevar1 = params.shapevar1;
        }else if(!isShapeSame || !shapevar1){
            shapevar1 = Expedition.fn._lib.random.randomNum(0.1,3);
        }
        if(params.shapevar2){
            shapevar2 = params.shapevar2;
        }else if(!isShapeSame || !shapevar2){
            shapevar2 = Expedition.fn._lib.random.randomNum(0.1,3);
        }
        
        //生成花瓣
        new Expedition.fn.render.petal(x, y, {
            petalColor : color,
            petalLength : petalLength,
            petalAngle : angle,
            startAngle : tempAngle,
            shapevar1 : shapevar1,
            shapevar2 : shapevar2,
            gap : gap,
            speed : speed,
            id : this.id
        })._render();
        //绘制花瓣
        
        tempAngle += angle;
        
    }
    
    context.restore();
    return this;
}

/**
 * 花瓣
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} params 参数集合
 *      petalColor 花瓣颜色 没有时随机指定
 *      petalLength 花瓣长度
 *      petalAngle 花瓣角度 
 *      startAngle 花瓣开始的角度
 *      shapevar1 花瓣形状参数
 *      shapevar2 花瓣形状参数
 *      gap    线条之间的间隙
 *      speed 花瓣成长的速度 
 *      curveX1 三次方贝塞尔曲线x1  可选
 *      curveY1 三次方贝塞尔曲线y1  可选
 *      curveX2 三次方贝塞尔曲线x2  可选
 *      curveY2 三次方贝塞尔曲线y2  可选
 *      id 
 */
Expedition.fn.render.petal = function(x,y,params){
    var params = params || {};
    this.x = x;
    this.y = y;
    this.petalColor = params.petalColor;
    this.petalLength = params.petalLength;
    this.petalLen = 1; //已画的花瓣长度
    this.petalAngle = params.petalAngle;
    this.gap = params.gap;
    this.startAngle = params.startAngle || 0;
    this.shapevar1 = params.shapevar1;
    this.shapevar2 = params.shapevar2;
    this.curveX1 = params.curveX1;
    this.curveY1 = params.curveY1;
    this.curveX2 = params.curveX2;
    this.curveY2 = params.curveY2;
    this.speed = params.speed;
    this.id = params.id;
    
    return this;
}

Expedition.fn.render.petal.prototype = {
    /**
     * 绘制花瓣中的线条
     */
    _paint : function(){
        var context = Expedition.fn.paint._getContext(this.id),
            vector1 = Expedition.fn._lib.vector.rotate(0 ,this.petalLen ,this.startAngle),
            vector2 = Expedition.fn._lib.vector.rotate(vector1.x ,vector1.y ,this.petalAngle),
            vector3 = Expedition.fn._lib.vector.mult(vector1.x ,vector1.y, this.shapevar1),
            vector4 = Expedition.fn._lib.vector.mult(vector2.x, vector2.y, this.shapevar2);
        //console.log(vector1);console.log(vector2);console.log(vector3);console.log(vector4);
        context.save();
        context.beginPath();
        context.moveTo(vector1.x,vector1.y);
        
        context.strokeStyle = this.petalColor;
        
        //如果已经指定了绘制的三次方贝塞尔曲线参数 就直接绘制
        if(this.curveX1 && this.curveY1 && this.curveX2 && this. curveY2){
            context.bezierCurveTo(this.curveX1,this.curveY1,this.curveX2,this.curveY2,this.x,this.y);
            context.closePath();
            context.stroke();
            context.restore();
            return;
        }
        context.bezierCurveTo(vector3.x, vector3.y, vector4.x, vector4.y, vector2.x, vector2.y);
        context.stroke();
        context.restore();
        return;
    },

    /**
     * 绘制花瓣
     */
    _render : function(){
        /*r (; this.petalLen < this.petalLength;) {
            this.petalLen += this.gap;
            this._paint();
        }*/
        if(this.petalLen < this.petalLength){
            
            var me = this,
                id = this.id,
                context = Expedition.fn.paint._getContext(id);
            setTimeout(function(){
                context.save();
                context.translate(me.x + Expedition.canvas[id]._x,me.y + Expedition.canvas[id]._y);
                me.petalLen += me.gap;
                me._paint();
                context.restore();
                me._render();
            },me.speed);
        }
        return;
    }
};

/**
 * 3d球
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} r
 * @param {Object} roll
 * @param {Object} draggable
 * @param {Object} speed 弧度
 */
Expedition.fn.render.ball = function(x,y,r,roll,draggable,speed){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        speed = speed || Math.PI / 200,
        rx = Math.PI / 3,
        ry = 0,
        rz = 0,
        rr = 0,
        x0,
        y0,
        roll = roll || false,
        draggable = draggable == false ? false : true,
        loop,
        _x = 0,
        _y = 0;
    
    //设置位置变化值
    this._x = 0;
    this._y = 0;
        
    Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
    
    if(roll == true || roll == 'r' || roll == 'R'){
        loop = setInterval(function(){
            rr += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
        },25);
    }else if(roll == 'x' || roll == 'X'){
        loop = setInterval(function(){
            rx += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
        },25);
    }else if(roll == 'y' || roll == 'Y'){
        loop = setInterval(function(){
            ry += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
        },25);
    }else if(roll == 'z' || roll == 'Z'){
        loop = setInterval(function(){
            rz += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
        },25);
    }
    this._otherLoop = this._otherLoop || {};
    this._otherLoop.ballLoop = loop;
    
    if(draggable){
        $(id).addEvent('onmousedown',function(event){
                x0 = Expedition.fn.event.getPageX(event);
                y0 = Expedition.fn.event.getPageY(event);
        
            var func = function(e) {
                var x1 = Expedition.fn.event.getPageX(e),
                    y1 = Expedition.fn.event.getPageY(e);
                rx = rx + (y0 - y1) * (Math.PI / (2 * r));
                ry = ry - (x0 - x1) * (Math.PI / (2 * r));
                
                x0 = x1;
                y0 = y1;
                _x = Expedition.canvas[id]._x;
                _y = Expedition.canvas[id]._y;
                Expedition.fn.render._drawBall(id, x + _x, y + _y, r, rx, ry, rz, rr);
            };
            Expedition.fn.on(document,'onmousemove',func);
            Expedition.fn.on(document,'onmouseup',function(e) {
                Expedition.fn.un(document,'onmousemove',func);
            });
        },{
            fireEvent : function(tempX,tempY){
                return (tempX - x)*(tempX - x) + (tempY - y)* (tempY - y) <= r*r;
            },
            isFireMove : true
        });
    }
    return this;
};

/**
 * 停止转动
 */
Expedition.fn.render.stopBallLoop = function(){
    var loop = this._otherLoop;
    if(loop && loop.ballLoop){
        clearInterval(loop.ballLoop);
    }
    return this;
};

/**
 * 画球
 * 
 * @param {Object} context
 * @param {Object} x
 * @param {Object} y
 * @param {Object} r
 * @param {Object} rx
 * @param {Object} ry
 * @param {Object} rz
 * @param {Object} rr
 */
Expedition.fn.render._drawBall = function(id, x, y, r, rx, ry, rz, rr){
    var x = x || 0,
        y = y || 0,
        r = r || 100,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;

    context.save();
    context.clearRect(0 , 0, width, height);
    context.beginPath();
    context.translate(x,y);
    
    //纬线
    for (var i = 0; i <= Math.PI; i += Math.PI / 8) {
        //移至纬线起点
        var v3d1 = Expedition.fn._lib.vector3d.spherical(i, 0, r , rr),
            startCircle = Expedition.fn._lib.vector3d.transform2d(v3d1.x, v3d1.y, v3d1.z, rx, ry, rz);
        context.moveTo(startCircle.x, startCircle.y);
        
        for (var j = 0; j <= 2 * Math.PI; j += Math.PI / 200) {
            var v3d2 = Expedition.fn._lib.vector3d.spherical(i, j, r, rr),
                v2d = Expedition.fn._lib.vector3d.transform2d(v3d2.x, v3d2.y, v3d2.z, rx, ry, rz);
            context.lineTo(v2d.x, v2d.y);
        }
    }
    
    //经线
    for (var j = 0; j <= 2 * Math.PI; j += Math.PI / 4) {
        //移至北极
        var v3d1 = Expedition.fn._lib.vector3d.spherical(0, 0, r, rr),
            startCircle = Expedition.fn._lib.vector3d.transform2d(v3d1.x, v3d1.y, v3d1.z, rx, ry, rz);
            
        context.moveTo(startCircle.x, startCircle.y);
        
        for (var i = 0; i <= Math.PI; i += Math.PI / 200) {
            var v3d2 = Expedition.fn._lib.vector3d.spherical(i, j, r, rr),
                v2d = Expedition.fn._lib.vector3d.transform2d(v3d2.x, v3d2.y, v3d2.z, rx, ry, rz);
                
            context.lineTo(v2d.x, v2d.y);
        }
    }
    
    context.stroke();
    context.restore();
};

/**
 * 3d块
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} m 长
 * @param {Object} n 宽
 * @param {Object} h 高
 * @param {Object} roll
 * @param {Object} draggable
 * @param {Object} speed
 */
Expedition.fn.render.cube = function(x,y,m,n,h,roll,draggable,speed){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        speed = speed || Math.PI / 200,
        rx = Math.PI / 3,
        ry = 0,
        rz = 0,
        x0,
        y0,
        roll = roll || false,
        draggable = draggable == false ? false : true,
        loop,
        max = m > n ? m : n,
        max = max > h ? max : h,
        _x = 0,
        _y = 0;
    
    //设置位置变化值
    this._x = 0;
    this._y = 0;
    
    Expedition.fn.render._drawCube(id, x + _x, y + _y, m,n,h, rx, ry, rz);
    
    if(roll == true || roll == 'x' || roll == 'X'){
        loop = setInterval(function(){
            rx += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawCube(id, x + _x, y + _y, m,n,h, rx, ry, rz);
        },25);
    }else if(roll == 'y' || roll == 'Y'){
        loop = setInterval(function(){
            ry += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawCube(id, x + _x, y + _y, m,n,h, rx, ry, rz);
        },25);
    }else if(roll == 'z' || roll == 'Z'){
        loop = setInterval(function(){
            rz += speed;
            _x = Expedition.canvas[id]._x;
            _y = Expedition.canvas[id]._y;
            Expedition.fn.render._drawCube(id, x + _x, y + _y, m,n,h, rx, ry, rz);
        },25);
    }
    this._otherLoop = this._otherLoop || {};
    this._otherLoop.cubeLoop = loop;
    
    if(draggable){
        $(id).addEvent('onmousedown',function(event){
                x0 = Expedition.fn.event.getPageX(event);
                y0 = Expedition.fn.event.getPageY(event);
            
            var fun = function(e) {
                var x1 = Expedition.fn.event.getPageX(e),
                    y1 = Expedition.fn.event.getPageY(e);
                    
                rx = rx + (y0 - y1) * (Math.PI / m);
                ry = ry - (x0 - x1) * (Math.PI / h);
                x0 = x1;
                y0 = y1;
                
                _x = Expedition.canvas[id]._x;
                _y = Expedition.canvas[id]._y;
                Expedition.fn.render._drawCube(id, x + _x, y + _y, m,n,h, rx, ry, rz);
            };
            Expedition.fn.on(document,'onmousemove',fun);
            Expedition.fn.on(document,'onmouseup',function(e) {
                Expedition.fn.un(document,'onmousemove',fun);
            });
        },{
            fireEvent : function(tempX,tempY){
                return (tempX - x)*(tempX - x) + (tempY - y)* (tempY - y) <= max * max / 4;
            },
            isFireMove : true
        });
    }
    
    return this;
};

/**
 * 停止转动
 */
Expedition.fn.render.stopCubeLoop = function(){
    var loop = this._otherLoop;
    if(loop && loop.cubeLoop){
        clearInterval(loop.cubeLoop);
    }
    return this;
};

/**
 * 开始画
 * 
 * @param {Object} context
 * @param {Object} x
 * @param {Object} y
 * @param {Object} m
 * @param {Object} n
 * @param {Object} h
 * @param {Object} rx
 * @param {Object} ry
 * @param {Object} rz
 */
Expedition.fn.render._drawCube = function(id,x,y,m,n,h,rx,ry,rz){
    var func = Expedition.fn._lib.vector3d.transform2d,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;
        
    context.save();
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.translate(x,y);
    
    context.moveTo(func(-m / 2, -h / 2, -n / 2,rx,ry,rz).x, func(-m / 2, -h / 2, -n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, -h / 2, -n / 2,rx,ry,rz).x, func(m / 2, -h / 2, -n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, h / 2, -n / 2,rx,ry,rz).x, func(m / 2, h / 2, -n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, h / 2, -n / 2,rx,ry,rz).x, func(-m / 2, h / 2, -n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, -h / 2, -n / 2,rx,ry,rz).x, func(-m / 2, -h / 2, -n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, -h / 2, n / 2,rx,ry,rz).x, func(-m / 2, -h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, -h / 2, n / 2,rx,ry,rz).x, func(m / 2, -h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, h / 2, n / 2,rx,ry,rz).x, func(m / 2, h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, h / 2, n / 2,rx,ry,rz).x, func(-m / 2, h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, -h / 2, n / 2,rx,ry,rz).x, func(-m / 2, -h / 2, n / 2,rx,ry,rz).y);
    context.moveTo(func(m / 2, -h / 2, n / 2,rx,ry,rz).x, func(m / 2, -h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, -h / 2, -n / 2,rx,ry,rz).x, func(m / 2, -h / 2, -n / 2,rx,ry,rz).y);
    context.moveTo(func(m / 2, h / 2, n / 2,rx,ry,rz).x, func(m / 2, h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(m / 2, h / 2, -n / 2,rx,ry,rz).x, func(m / 2, h / 2, -n / 2,rx,ry,rz).y);
    context.moveTo(func(-m / 2, h / 2, n / 2,rx,ry,rz).x, func(-m / 2, h / 2, n / 2,rx,ry,rz).y);
    context.lineTo(func(-m / 2, h / 2, -n / 2,rx,ry,rz).x, func(-m / 2, h / 2, -n / 2,rx,ry,rz).y);
    
    context.stroke();
    context.restore();
};

/**
 * 燃烧
 * 
 * @param {Object} size
 * @param {Object} speed
 * @param {Object} replace 是否替换原来的痕迹
 * @param {Object} flag 对未画部分处理
 */
Expedition.fn.render.burn = function(size,speed,replace,flag){
    var id = this.id,
        loop,
        context = Expedition.fn.paint._getContext(id),
        canvas = Expedition.fn.paint._getNewCanvas(id),
        width = canvas.width,
        height = canvas.height,
        flame = [],
        image = context.getImageData(0,0,width,height),
        imageBase = context.getImageData(0,0,width,height),
        imageFlame = context.createImageData(width,height),
        len = width * height * 4,
        size = size || 100,
        delta = 255.0 / size,
        speed = speed || 50,
        speedValue,
        func;
    
     for(var i = 0; i < 64; i++){
        flame[i]       = [i * 4, 0,     0];
        flame[i + 64]  = [255,   i * 4, 0];
        flame[i + 128] = [255,   255,   i * 4];
        flame[i + 192] = [255,   255,   255];
     };
     
     if(speed && !isNaN(Number(speed)) && speed.toString().match(/^\s+$/) === null){
         speedValue = speed;
      } else {
         switch(speed){
         case "fast":
            speedValue =  25; break;  
         case "slow":
            speedValue = 100; break;  
         default:
         case "normal":
            speedValue =  50; break;
         }
      }
      
     func = function(){
        for (var i = 0; i < len; i += 4) {
            if (imageBase.data[i] != 0 || imageBase.data[i + 1] != 0 || imageBase.data[i + 2] != 0 || imageBase.data[i + 3] != 0) {
                if (!flag) {
                    imageFlame.data[i] = Math.floor(Math.random() * 255);
                }
            }else if(flag){
                imageFlame.data[i] = Math.floor(Math.random() * 255);
            }
        }
        
        for (var i = 0; i < len - width * 4; i += 4) {
            var l = imageFlame.data[((i % (width * 4) == 0) ? i + (width * 4) : i) - 4];
            var r = imageFlame.data[((i % (width * 4) == (width * 4) - 4) ? i - (width * 4) : i) + 4];
            var b = imageFlame.data[i + (width * 4)];
            var avg = Math.floor((l + r + b + b) / 4);
            
            if (avg > 0) {
                avg -= delta;
            }
            
            if (avg < 0) {
                avg = 0;
            }
            
            imageFlame.data[i] = avg;
        }
        
        for (var i = 0; i < len; i += 4) {
            if (imageFlame.data[i] != 0) {
                var c = imageFlame.data[i];
                var a = (1 - (3 * c) / 255);
                
                if (a < 0) {
                    a = 0;
                }
                
                if (a > 255) {
                    a = 255;
                }
                
                image.data[i] = Math.min(255, flame[c][0] + Math.floor(255 * a));
                image.data[i + 1] = Math.min(255, flame[c][1] + Math.floor(255 * a));
                image.data[i + 2] = Math.min(255, flame[c][2] + Math.floor(255 * a));
                image.data[i + 3] = Math.max(255, Math.min(3 * c, 255));
                
            }
        
            if (!replace && (imageBase.data[i] != 0 || imageBase.data[i + 1] != 0 || imageBase.data[i + 2] != 0 || imageBase.data[i + 3] != 0)) {
                image.data[i] = imageBase.data[i];
                image.data[i + 1] = imageBase.data[i + 1];
                image.data[i + 2] = imageBase.data[i + 2];
                image.data[i + 3] = imageBase.data[i + 3];
            }
        }
        
        context.putImageData(image, 0, 0);
     }
     
     loop = setInterval(func,speedValue);
     
     this._otherLoop = this._otherLoop || {};
     this._otherLoop.burnLoop = {
        loop : loop,
        imageBase : imageBase
     }
     
     return this;
};

/**
 * 停止燃烧
 */
Expedition.fn.render.stopBurn = function(){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id),
        canvas = Expedition.fn.paint._getNewCanvas(id),
        width = canvas.width,
        height = canvas.height,
        otherLoop = this._otherLoop;
    
    if(otherLoop && otherLoop.burnLoop){
        clearInterval(otherLoop.burnLoop.loop);
        context.clearRect(0,0,width,height);
        context.putImageData(otherLoop.burnLoop.imageBase,0,0);
    }
    
    return this;
}


/**
 * Expedition.text
 * @author yangji01
 * date 2012.3.26
 */

Expedition.fn.text = Expedition.fn.text || {};

/**
 * 获取font值
 */
Expedition.fn.text.getFont = function(){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
    return context.font;
};

/**
 * 设置font
 * 
 * @param {Object} value
 */
Expedition.fn.text.setFont = function(value){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
        if(typeof(value) == 'number'){
            value = value + 'px sans-serif';
        }
        context.font = value;
        
        return this;
};

/**
 * 获取textAlign值
 */
Expedition.fn.text.getTextAlign = function(){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
    return context.textAlign;
};

/**
 * 设置textAlign
 * 
 * @param {Object} value
 */
Expedition.fn.text.setTextAlign = function(value){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
        context.textAlign = value;
        
        return this;
};

/**
 * 获取textBaseline值
 */
Expedition.fn.text.getTextBaseline = function(){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
    return context.textBaseline;
};

/**
 * 设置textBaseline
 * 
 * @param {Object} value
 */
Expedition.fn.text.setTextBaseline = function(value){
    var id = this.id;
        context = Expedition.fn.paint._getContext(id);
        
        context.textBaseline = value;
        
        return this;
};

/**
 * 填充文字
 * 
 * @param {Object} text
 * @param {Object} x
 * @param {Object} y
 * @param {Object} maxWidth
 */
Expedition.fn.text.fillText = function(text,x,y,maxWidth){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id);
        
    if(maxWidth){
        context.fillText(text,x,y,maxWidth);
    }else{
        context.fillText(text,x,y);
    }
    
    return this;
};

/**
 * 文字描边
 * 
 * @param {Object} text
 * @param {Object} x
 * @param {Object} y
 * @param {Object} maxWidth
 */
Expedition.fn.text.strokeText = function(text,x,y,maxWidth){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id);
        
    if(maxWidth){
        context.strokeText(text,x,y,maxWidth);
    }else{
        context.strokeText(text,x,y);
    }
    
    return this;
};

/**
 * 测量文字
 * 
 * @param {Object} text
 */
Expedition.fn.text.measureText = function(text){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id);
        
    return context.measureText(text);
};

/**
 * 一个字一个字的写
 * 
 * @param {Object} text
 * @param {Object} time 间隔的时间 单位是微秒
 * @param {Object} x
 * @param {Object} y
 * @param {Object} maxWidth
 * @param {Object} type
 * @param {Object} gap 行间距
 * @param {Object} callback 回调函数
 */
Expedition.fn.text.write = function(text,time,x,y,maxWidth,type,gap,callback){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id),
        tempX = x,
        tempY = y,
        i = 0,
        loop,
        func,
        word,
        size = parseInt(context.font),
        gap = gap || 0;
    
    
    func = function(){
        context.save();
        $(id).setFont(size);
        if(i < text.length){
            word = text.charAt(i);
            if(tempX + context.measureText(word).width <= maxWidth + x){
                
            }else{
                tempX = x;
                tempY += size + gap;
            }
            
            if(type == 'stroke'){
                context.strokeText(word,tempX,tempY);
            }else if(type == 'fill'){
                context.fillText(word,tempX,tempY);
            }else{
                context.fillText(word,tempX,tempY);
                context.strokeText(word,tempX,tempY);
            }
            
            tempX += context.measureText(word).width;
        }else{
            clearInterval(loop);
        }
        
        i++;
        
        if(i == text.length){
            if(typeof(callback) == 'function'){
                callback();
            }
        }
        context.restore();
    };
    
    loop = setInterval(func,time);
    
    return this;
};


/**
 * Expedition.move
 * @author yangji01
 * date 2012.3.26
 */

Expedition.fn.move = Expedition.fn.move || {};

/**
 * 添加运动操作
 * 
 * @param {Object} params  时间和路程是结束条件
 *      包括 x  x轴差量
 *          y   y轴差量
 *          time 时间   
 *          speed 速度
 *          distance 路程
 *          acc 加速度  不在这里用  上层函数可以将它写在speed function中
 *          callback 运动结束时回调函数
 */
Expedition.fn.move._addMoveHandle = function(id,moveId,pre,params){
    var x = params.x || 0,
        y = params.y || 0,
        time = params.time,
        speed = params.speed,
        rate,
        distance = params.distance,
        moveFlag = params.moveFlag,
        callback = params.callback,
        _loop = Expedition.canvas[id]._loop || [],
        moveLoop,
        canvas = $().g(pre),
        index = Expedition.fn.paint._getZIndex(canvas),
        width = canvas.width,
        height = canvas.height,
        context = canvas.getContext('2d'),
        imageData,
        moveContext,
        baseCanvas = canvas.getAttribute('BaseCanvas'),
        pos = Expedition.fn.dom.getPosition(baseCanvas),
        node = document.createElement('canvas'),
        idString = 'moveCanvasId' + moveId,
        func,
        flag = true,
        valueX,
        valueY,
        tempX = 0,
        tempY = 0,
        tempTime = 0,
        tempSpeed,
        tempLoop,
        tempCanvas = document.createElement('canvas'),
        tempContext,
        tempFlag = moveFlag,
        firstContext = Expedition.fn.paint._getContext(id),
        queueFlag = params.queueFlag,
        dragX = 0,
        dragY = 0;
    
    //新建canvas
    if (!$().g(idString)) {
        node.setAttribute('BaseCanvas', baseCanvas);
        node.setAttribute('id', idString);
        Expedition.fn.dom.insertAfter(node, canvas);
        
        $().setStyles(node, {
            position: 'absolute',
            left: pos.left + 'px',
            top: pos.top + 'px',
            'z-index' : index + 1
        });
        
        node.width = width;
        node.height = height;
    }
    
    //新建canvas  在多次运动中改变最初的canvas状态
    if (!$().g('temp' + idString)) {
        tempCanvas.setAttribute('BaseCanvas', baseCanvas);
        tempCanvas.setAttribute('id', 'temp' + idString);
        Expedition.fn.dom.insertAfter(tempCanvas, canvas);
        
        $().setStyles(tempCanvas, {
            position: 'absolute',
            left: pos.left + 'px',
            top: pos.top + 'px',
            display: 'none'
        });
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempContext = tempCanvas.getContext('2d');
    }
    
    //隐藏原来的canvas
    $().setStyle(canvas,'display','none');
    
    moveContext = node.getContext('2d');
    
    func = function(){
        //如果有运动改变 重新拿前一个canvas元素  因为它可能会变
        _loop = Expedition.canvas[id]._loop || []
        for(var i = 0; i < _loop.length;i++){
            if(_loop[i].id == idString){
                tempLoop = _loop[i];
            }
        }
        if(tempLoop){
            tempFlag = tempLoop.moveFlag;
            dragX = tempLoop.dragX || 0;
            dragY = tempLoop.dragY || 0;
        }
        
        //运动时间改变
        tempTime += 25;
        
        if (tempFlag === 0) {
            //计算x的值
            if (typeof(x) == 'number') {
                valueX = x;
            }
            else if (typeof(x) == 'function') {
                valueX = x(tempTime,tempX,tempY);
            }
            else {
                valueX = 0;
            }
            
            //计算y的值
            if (typeof(y) == 'number') {
                valueY = y;
            }
            else if (typeof(y) == 'function') {
                valueY = y(tempTime,tempX,tempY);
            }
            else {
                valueY = 0;
            }
            
            //计算速度
            if (typeof(speed) == 'number') {
                tempSpeed = speed;
            }
            else if (typeof(speed) == 'function') {
                tempSpeed = speed(tempTime,tempX,tempY);
            }
            else {
                rate = 1;
            }
            
            moveContext.clearRect(0, 0, width, height);
            if (rate) {
                tempX += valueX;
                tempY += valueY;
                //偏移量运动时随时改变
                tempLoop.x += valueX;
                tempLoop.y += valueY;
            }
            else {
                tempX += Math.cos(Math.atan((valueY + 0.0) / valueX)) * tempSpeed;
                tempY += Math.sin(Math.atan((valueY + 0.0) / valueX)) * tempSpeed;
                tempLoop.x += Math.cos(Math.atan((valueY + 0.0) / valueX)) * tempSpeed + dragX;
                tempLoop.y += Math.sin(Math.atan((valueY + 0.0) / valueX)) * tempSpeed + dragY;
            }
            
            if (tempLoop) {
                pre = tempLoop.pre;
            }
            canvas = $().g(pre);
            context = canvas.getContext('2d');
            
            imageData = context.getImageData(0, 0, width, height);
            moveContext.putImageData(imageData, tempX + dragX, tempY + dragY);
            
            tempContext.clearRect(0, 0, width, height);
            imageData = firstContext.getImageData(0, 0, width, height);
            tempContext.putImageData(imageData, tempX + dragX, tempY + dragY);
            
            //时间到了
            if (time && tempTime >= time) {
                flag = false;
            }
            
            //终点到了
            if (distance && tempX * tempX + tempY * tempY >= distance * distance) {
                flag = false;
            }
            
            if (flag) {
                setTimeout(func, 25);
            }
            else {
                //原始canvas的偏移量 运动结束时改变
                Expedition.canvas[id]._x += tempX + dragX;
                Expedition.canvas[id]._y += tempY + dragY;

                //将新建的canvas的像素画回去 并将它删掉
                imageData = tempContext.getImageData(0, 0, width, height);
                
                firstContext.clearRect(0, 0, width, height);
                firstContext.putImageData(imageData, 0, 0);
                //添加延时  在运动停止时没有跳动
                setTimeout(function(){
                    setTimeout(function(){
                        Expedition.fn.dom.remove(tempCanvas);
                        Expedition.fn.dom.remove(node);
                        },25);
                    
                    if (_loop[_loop.length - 1].id == idString) {
                        $().setStyle(canvas, 'display', 'block');
                    }

                    Expedition.fn._lib.array.remove(_loop, function(item){
                        return item.id == idString;
                    });
                    
                    //如果是队列中的运动
                    if(queueFlag){
                        Expedition.fn._lib.array.removeAt(Expedition.canvas[id]._queueList,0);
                        
                        if(Expedition.canvas[id]._queueList.length > 0){
                            $(id).addMove(Expedition.canvas[id]._queueList[0].moveId,Expedition.canvas[id]._queueList[0].params);
                        }
                    }
                }, 25);
                
                if (_loop[_loop.length - 1].id != idString) {
                    for(var i = 0;i < _loop.length; i ++){
                        if(_loop[i].pre == idString){
                            _loop[i].pre = pre;
                        }
                    }
                }
                
                //回调函数
                if(typeof(callback) == 'function'){
                    callback(tempTime,tempX,tempY);
                }
            }
        }else if(tempFlag === 1){
            tempTime -= 25;
            setTimeout(func, 25);
        }else{
            Expedition.canvas[id]._x += tempX + dragX;
            Expedition.canvas[id]._y += tempY + dragY;
            imageData = tempContext.getImageData(0, 0, width, height);
                
            firstContext.clearRect(0, 0, width, height);
            firstContext.putImageData(imageData, 0, 0);
            //添加延时  在运动停止时没有跳动
            setTimeout(function(){
                setTimeout(function(){
                    Expedition.fn.dom.remove(tempCanvas);
                    Expedition.fn.dom.remove(node);
                    },25);
                
                if (_loop[_loop.length - 1].id == idString) {
                    $().setStyle(canvas, 'display', 'block');
                }

                Expedition.fn._lib.array.remove(_loop, function(item){
                    return item.id == idString;
                });
                
                //如果是队列中的运动
                if(queueFlag){
                    Expedition.fn._lib.array.removeAt(Expedition.canvas[id]._queueList,0);
                    
                    if(Expedition.canvas[id]._queueList.length > 0){
                        $(id).addMove(Expedition.canvas[id]._queueList[0].moveId,Expedition.canvas[id]._queueList[0].params);
                    }
                }
            }, 25);
            
            if (_loop[_loop.length - 1].id != idString) {
                for(var i = 0;i < _loop.length; i ++){
                    if(_loop[i].pre == idString){
                        _loop[i].pre = pre;
                    }
                }
            }
            
            //回调函数
            if(typeof(callback) == 'function'){
                callback(tempTime,tempX,tempY);
            }
        }
    }
    
    moveLoop = setTimeout(func,25);
    
    Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length] = {
        id : idString,
        pre : pre,
        moveLoop : moveLoop,
        moveFlag : 0,//moveFlag
        currentTheta : 0,//当前的角度
        x : 0,
        y : 0
    }   
};

/**
 * 添加运动
 * 
 * @param {Object} moveId
 * @param {Object} params
 *          在params中添加一个queueFlag标识是否队列中的运动该运行
 */
Expedition.fn.move.addMove = function(moveId,params){
    var id = this.id,
        pre,
        _loop = this._loop || [],
        tempMoveId,
        tempParams
        queue = this._queue;
        
    if (typeof(moveId) == 'object') {
        tempMoveId = Math.random();
        tempParams = moveId;
    }
    else {
        tempMoveId = moveId;
        tempParams = params;
    }
    
    if (queue && !tempParams.queueFlag) {
        this._queueList = this._queueList || [];
        
        tempParams.queueFlag = true;
        this._queueList[this._queueList.length] = {
            moveId : tempMoveId,
            params : tempParams
        };
        
        if(this._queueList.length == 1){
            $(id).addMove(tempMoveId,tempParams);
        }
    }
    else {
        if (_loop.length > 0) {
            pre = _loop[_loop.length - 1].id;
        }
        else {
            pre = 'canvasId' + id;
        }
        
        Expedition.fn.move._addMoveHandle(id, tempMoveId, pre, tempParams);
    }
    
    return this;
};

/**
 * 暂停运动
 * 
 * @param {Object} moveId
 */
Expedition.fn.move.pauseMove = function(moveId){
    var id = this.id,
        _loop = this._loop || [],
        len = _loop.length;
        
    for(var i = 0; i < len ; i++){
        if(moveId && this._loop[i].id == 'moveCanvasId' + moveId){
            this._loop[i].moveFlag = 1;
            return this;
        }else{
            this._loop[i].moveFlag = 1;
        }
    }
    
    return this;
};

/**
 * 启动运动
 * 
 * @param {Object} moveId
 */
Expedition.fn.move.runMove = function(moveId){
    var id = this.id,
        _loop = this._loop || [],
        len = _loop.length;
        
    for(var i = 0; i < len ; i++){
        if(moveId && this._loop[i].id == 'moveCanvasId' + moveId){
            this._loop[i].moveFlag = 0;
            return this;
        }else{
            this._loop[i].moveFlag = 0;
        }
    }
    
    return this;
};

/**
 * 删除运动
 * 
 * @param {Object} moveId
 */
Expedition.fn.move.cancelMove = function(moveId){
    var id = this.id,
        _loop = this._loop || [],
        len = _loop.length;
        
    for(var i = 0; i < len ; i++){
        if(moveId && this._loop[i].id == 'moveCanvasId' + moveId){
            this._loop[i].moveFlag = 2;
            return this;
        }else if(!moveId){
            this._loop[i].moveFlag = 2;
        }
    }
    
    //清空队列
    this._queueList = [];
    
    return this;
};

/**
 * 匀速直线运动
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括 x  x轴差量
 *          y   y轴差量
 *          time 时间   
 *          speed 速度
 *          distance 路程
 */
Expedition.fn.move.uniLinMotion = function(moveId,params){
    var id = this.id;
    
    $(id).addMove(moveId,params);
    
    return this;
};

/**
 * 加速直线运动
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括 x  x轴差量
 *          y   y轴差量
 *          time 时间   
 *          speed 速度
 *          distance 路程
 *          acc 加速度
 */
Expedition.fn.move.accLinMotion = function(moveId,params){
    var id = this.id,
        params = params || {},
        acc,
        speed,
        tempSpeed,
        tempMoveId,
        tempParams;
    
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    }
    
    acc = tempParams.acc || 0;
    speed = tempParams.speed || 0;
        
    //匀加速
    if(typeof(acc) == 'number'){
        if(typeof(speed) == 'number'){
            tempSpeed = function(time){
                return speed + time * acc / 25;
            }
        }else if(typeof(speed) == 'function'){
            tempSpeed = function(time,tempX,tempY){
                return speed(time,tempX,tempY) + time * acc / 25;
            }
        }
    }else if(typeof(acc) == 'function'){
        //变加速
        if(typeof(speed) == 'number'){
            tempSpeed = function(time,tempX,tempY){
                return speed + time * acc(time,tempX,tempY) / 25;
            }
        }else if(typeof(speed) == 'function'){
            tempSpeed = function(time,tempX,tempY){
                return speed(time,tempX,tempY) + time * acc(time,tempX,tempY) / 25;
            }
        }
    };
    
    tempParams.speed = tempSpeed;
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * 圆周运动
 * 
 * @param {Object} moveId
 * 
 * params包括以下参数
 * time  时间
 * @param {Object} r    半径
 * @param {Object} delta    角度增量
 * @param {Object} theta    初始角度
 */
Expedition.fn.move.cirMotion = function(moveId,params){
    var id = this.id,
        time,
        r,
        delta,
        theta,
        a,//圆心坐标
        b,
        tempMoveId,
        tempParams,
        loopItem,
        currentTheta;
    
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    }
    
    tempParams = tempParams || {};
    time = tempParams.time;
    r = tempParams.r || 20;
    delta = tempParams.delta || Math.PI / 180;
    theta = (tempParams.theta || 0) * Math.PI / 180;
    a = - r * Math.sin(theta);//圆心坐标
    b = r * Math.cos(theta);
        
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime,tempX,tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return r * Math.sin(theta + currentTheta) - tempX;
        };
        
        tempParams.y = function(tempTime,tempX,tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return r * Math.cos(theta + currentTheta) - tempY;
        }
    }
    else {
        tempParams.x = function(tempTime,tempX,tempY){
            return r * Math.sin(theta + tempTime * delta * Math.PI / 180 / 25) - tempX;
        };
        tempParams.y = function(tempTime,tempX,tempY){
            return r * Math.cos(theta + tempTime * delta * Math.PI / 180 / 25) - tempY;
        }
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * 抛物线轨迹 y = a ( x - b ) 2 + c
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括a，b，c三个参数
 *      还有delta  增量
 *      time 时间
 */
Expedition.fn.move.parMotion = function(moveId,params){
    var id = this.id,
        a,
        b,
        c,
        delta,
        tempMoveId,
        tempParams;
        
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    a = tempParams.a || 1;
    b = tempParams.b || 0;
    c = tempParams.c || 0;
    delta = tempParams.delta || 1;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime,tempX,tempY){
            return   delta(tempTime,tempX,tempY);
        };
        
        tempParams.y = function(tempTime,tempX,tempY){
            return a * (tempX + delta(tempTime,tempX,tempY) - b)*( tempX + delta(tempTime,tempX,tempY) - b) + c -tempY;
        }
    }
    else {
        tempParams.x = function(tempTime,tempX,tempY){
            return delta;
        };
        tempParams.y = function(tempTime,tempX,tempY){
            return a * (tempX + delta - b)*(tempX + delta - b) + c -tempY;
        }
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * sin轨迹 y=a * sin(x-b)
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括time
 *          a
 *          b
 *          delta
 *          rate x与弧度的比
 */
Expedition.fn.move.sinMotion = function(moveId,params){
    var id = this.id,
        delta,
        a,
        b,
        rate,
        tempMoveId,
        tempParams;
    
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    a = tempParams.a || 100;
    b = tempParams.b || 0;
    delta = tempParams.delta || 1;
    rate = tempParams.rate || 1;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime,tempX,tempY){
            return   delta(tempTime,tempX,tempY);
        };
        
        tempParams.y = function(tempTime,tempX,tempY){
            return a * Math.sin((tempX  + delta(tempTime,tempX,tempY) - b) * Math.PI / 180 * rate) -tempY;
        }
    }
    else {
        tempParams.x = function(tempTime,tempX,tempY){
            return delta;
        };
        tempParams.y = function(tempTime,tempX,tempY){
            return a * Math.sin((tempX  + delta - b) * Math.PI / 180 * rate) -tempY;
        }
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * 内旋轮线轨迹
 *      theta = tempTime * Math.PI / 180 /25 * delta;
 *      x = (a - b)* Math.cos(theta) + c * Math.cos((a / b - 1)* theta)
 *      y = (a - b)* Math.sin(theta) - c * Math.sin((a / b - 1)* theta)
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括a
 *          b
 *          c
 *          time
 *          delta 可以决定运动的方向
 *          theta 起始角度
 */
Expedition.fn.move.hypMotion = function(moveId,params){
    var id = this.id,
        a,
        b,
        c,
        delta,
        theta,
        tempMoveId,
        tempParams,
        currentTheta,
        loopItem;
        
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    a = tempParams.a;
    b = tempParams.b;
    c = tempParams.c;
    delta = tempParams.delta || 1;
    theta = (tempParams.theta || 0) * Math.PI / 180;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return (a - b) * Math.cos(theta + currentTheta) + c * Math.cos((a / b - 1) * (theta + currentTheta)) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return (a - b) * Math.sin(theta + currentTheta) - c * Math.sin((a / b - 1) * (theta + currentTheta)) - tempY;
        };
    }else{
        tempParams.x = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return (a - b) * Math.cos(theta + currentTheta) + c * Math.cos((a / b - 1) * (theta + currentTheta)) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return (a - b) * Math.sin(theta + currentTheta) - c * Math.sin((a / b - 1) * (theta + currentTheta)) - tempY;
        };
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 *外旋轮线轨迹
 *      theta = tempTime * Math.PI / 180 /25 * delta;
 *      x = (a + b)* Math.cos(theta) - c * Math.cos((a / b + 1)* theta);
 *      y = (a + b)* Math.sin(theta) - c * Math.sin((a / b + 1)* theta);
 * 
 * @param {Object} moveId
 * @param {Object} params
 *      包括a
 *          b
 *          c
 *          time
 *          delta
 */
Expedition.fn.move.epiMotion = function(moveId,params){
    var id = this.id,
        a,
        b,
        c,
        delta,
        theta,
        tempMoveId,
        tempParams,
        currentTheta,
        loopItem;
        
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    a = tempParams.a;
    b = tempParams.b;
    c = tempParams.c;
    delta = tempParams.delta || 1;
    theta = (tempParams.theta || 0) * Math.PI / 180;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return (a + b) * Math.cos(theta + currentTheta) - c * Math.cos((a / b + 1) * (theta + currentTheta)) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return (a + b) * Math.sin(theta + currentTheta) - c * Math.sin((a / b + 1) * (theta + currentTheta)) - tempY;
        };
    }
    else {
        tempParams.x = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return (a + b) * Math.cos(theta + currentTheta) - c * Math.cos((a / b + 1) * (theta + currentTheta)) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return (a + b) * Math.sin(theta + currentTheta) - c * Math.sin((a / b + 1) * (theta + currentTheta)) - tempY;
        };
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * 内摆线轨迹
 *  
 * @param {Object} moveId
 * @param {Object} params
 *      包括n
 *          size
 *          delta
 *          time
 */
Expedition.fn.move.htpocycMotion = function(moveId,params){
    var id = this.id,
        n,
        delta,
        size,
        theta,
        tempMoveId,
        tempParams,
        currentTheta,
        loopItem;
        
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    n = tempParams.n;
    size = tempParams.size || 50;
    delta = tempParams.delta || 1;
    theta = (tempParams.theta || 0) * Math.PI / 180;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return size * (Math.cos(theta + currentTheta) + 1 / n * Math.cos(n * (theta + currentTheta))) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return size * (Math.sin(theta + currentTheta) - 1 / n * Math.sin(n * (theta + currentTheta))) - tempY;
        };
    }
    else {
        tempParams.x = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return size * (Math.cos(theta + currentTheta) + 1 / n * Math.cos(n * (theta + currentTheta))) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return size * (Math.sin(theta + currentTheta) - 1 / n * Math.sin(n * (theta + currentTheta))) - tempY;
        };
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * 外摆线轨迹
 *  
 * @param {Object} moveId
 * @param {Object} params
 *      包括n
 *          size
 *          delta
 *          time
 */
Expedition.fn.move.epicycMotion = function(moveId,params){
    var id = this.id,
        n,
        delta,
        size,
        theta,
        tempMoveId,
        tempParams,
        currentTheta,
        loopItem;
        
    if(typeof(moveId) == 'object'){
        tempMoveId = Math.random();
        tempParams = moveId;
    }else{
        tempMoveId = moveId;
        tempParams = params;
    };
    
    n = tempParams.n;
    size = tempParams.size || 50;
    delta = tempParams.delta || 1;
    theta = (tempParams.theta || 0) * Math.PI / 180;
    
    if (typeof(delta) == 'function') {
        tempParams.x = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return size * (Math.cos(theta + currentTheta) + 1 / n * Math.cos(n * (theta + currentTheta))) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            loopItem = Expedition.fn._lib.array.find(Expedition.canvas[id]._loop,function(item){
                if(item.id == 'moveCanvasId' + moveId){
                    item.currentTheta += delta(tempTime,tempX,tempY) * Math.PI / 180;
                    return true;
                }
            });
            currentTheta = loopItem.currentTheta;
            
            return size * (Math.sin(theta + currentTheta) + 1 / n * Math.sin(n * (theta + currentTheta))) - tempY;
        };
    }
    else {
        tempParams.x = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return size * (Math.cos(theta + currentTheta) + 1 / n * Math.cos(n * (theta + currentTheta))) - tempX;
        };
        
        tempParams.y = function(tempTime, tempX, tempY){
            currentTheta = tempTime * Math.PI / 180 / 25 * delta;
            return size * (Math.sin(theta + currentTheta) + 1 / n * Math.sin(n * (theta + currentTheta))) - tempY;
        };
    }
    
    $(id).addMove(tempMoveId,tempParams);
    
    return this;
};

/**
 * Expedition.image
 * @author yangji01
 * version: 1.0
 */

/**
 * 定义Expedition.fn.image
 */
Expedition.fn.image = Expedition.fn.image || {};

/**
 * 加载图片
 * 
 * 参数有三种形式
 *      image,dx,dy    图片  目标地址的坐标
 *      image,dx,dy,dw,dh  图片  目标地址的坐标 及 宽高
 *      image,sx,sy,sw,sh,dx,dy,dw,dh  图片  源地址的坐标 及 宽高  目标地址的坐标及宽高
 * 
 * @param {Object} image
 */
Expedition.fn.image.drawImage = function(image){
    var dx,dy,dw,dh,sx,sy,sw,sh,
        args = arguments,
        len = args.length,
        id = this.id,
        context = Expedition.fn.paint._getContext(id);
    
    if(len == 3){
        dx = args[1];
        dy = args[2];
        context.drawImage(image,dx,dy);
    }else if(len == 5){
        dx = args[1];
        dy = args[2];
        dw = args[3];
        dh = args[4];
        context.drawImage(image,dx,dy,dw,dh);
    }else if(len == 9){
        sx = args[1];
        sy = args[2];
        sw = args[3];
        sh = args[4];
        dx = args[5];
        dy = args[6];
        dw = args[7];
        dh = args[8];
        context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    
    return this;
};

/**
 * 建立imageData对象
 * 参数有两种形式
 *      sw,sh 宽高
 *      imageData imageData对象
 * 
 * @param {Object} args
 */
Expedition.fn.image.createImageData = function(args){
    var args = arguments,
        len = args.length,
        id = this.id,
        context = Expedition.fn.paint._getContext(id);
    
    if(len == 1){
        return context.createImageData(args[0]);
    }else if(len == 2){
        return context.createImageData(args[0],args[1]);
    }
};

/**
 * 获取像素值
 * 
 * @param {Object} sx
 * @param {Object} sy
 * @param {Object} sw
 * @param {Object} sh
 */
Expedition.fn.image.getImageData = function(sx,sy,sw,sh){
    var id = this.id,
        context = Expedition.fn.paint._getContext(id);
    
    return context.getImageData(sx,sy,sw,sh);
};

/**
 * 将像素绘制到画布上
 *    参数有两种形式
 *    imagedata,dx,dy
 *    imagedata,dx,dy,dirtyX,dirtyY,dirtyW,dirtyH
 * 
 * @param {Object} args
 */
Expedition.fn.image.putImageData = function(imageData,dx,dy,dirtyX,dirtyY,dirtyW,dirtyH){
    var args = arguments,
        len = args.length,
        id = this.id,
        context = Expedition.fn.paint._getContext(id),
        imageData,dx,dy,dirtyX,dirtyY,dirtyW,dirtyH;
    
    if(len == 3){
        context.putImageData(imageData,dx,dy);
    }else if(len == 7){
        context.putImageData(imageData,dx,dy,dirtyX,dirtyY,dirtyW,dirtyH);
    }
    
    return this;
};

/**
 * 反色处理
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageAntiColor = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i] = 255 - data[i];
                data[i+1] = 255 - data[i+1];
                data[i+2] = 255 - data[i+2];
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 像素化处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imagePixelate = function(unit,x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        rows = h / unit,//行号
        cols = w / unit,//列号
        imageData = context.getImageData(x,y,w,h),
        data = imageData.data,
        len = data.length;
        
        context.save();
        context.translate(x,y);
        for(var i = 0 ; i < cols ; i++){
            for(var j =0 ; j < rows ; j++){
                var tempX = j * unit + unit / 2,
                    tempY = i * unit + unit /2,
                    position = Math.floor(tempY) * imageData.width * 4 + Math.floor(tempX) *4,
                    red = data[position],
                    green = data[position + 1],
                    blue = data[position + 2];
                    
                context.save();
                context.fillStyle = Expedition.fn._lib.rgba(red,green,blue,1);
                context.fillRect(tempX - unit /2 , tempY - unit/2 , unit, unit);
                context.restore();
            }
        }
        
        context.restore();
        
        return this;
};

/**
 * 像素粒子化处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imagePixelParticle = function(unit,x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        rows = h / unit,//行号
        cols = w / unit,//列号
        imageData = context.getImageData(x,y,w,h),
        data = imageData.data,
        len = data.length;
        
        context.save();
        context.translate(x,y);
        context.clearRect(x,y,w,h);
        
        for(var i = 0 ; i < cols ; i++){
            for(var j =0 ; j < rows ; j++){
                var tempX = j * unit + unit / 2,
                    tempY = i * unit + unit /2,
                    position = Math.floor(tempY) * imageData.width * 4 + Math.floor(tempX) *4,
                    red = data[position],
                    green = data[position + 1],
                    blue = data[position + 2];
                    
                context.save();
                context.fillStyle = Expedition.fn._lib.rgba(red,green,blue,1);
                context.beginPath();
                context.arc(tempX , tempY , unit / 2, 0 , Math.PI * 2 , false);
                context.closePath();
                context.fill();
                context.restore();
            }
        }
        context.restore();
        
        return this;
};

/**
 * 图片灰度处理
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageGrey = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len,
        average;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            average = (data[i] + data[i+1] + data[i+2])/3;
            data[i] = average;
            data[i+1] = average;
            data[i+2] = average;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                average = (data[i] + data[i+1] + data[i+2])/3;
                data[i] = average;
                data[i+1] = average;
                data[i+2] = average;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 图片马赛克处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageMosaics = function(unit,x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        rows = h / unit,//行号
        cols = w / unit;//列号
        
        context.save();
        context.translate(x,y);
        
        for(var i = 0 ; i < rows ; i++){
            for(var j =0 ; j < cols ; j++){
                var tempX = j * unit + unit / 2,
                    tempY = i * unit + unit /2;
                    
                context.save();
                context.fillStyle = Expedition.fn._lib.random.randomRgba(0,255,1);
                context.fillRect(tempX - unit /2 , tempY - unit/2 , unit, unit);
                context.restore();
            }
        }
        context.restore();
        
        return this;
};

/**
 * 红光滤镜  只让红光透过
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageFilterRed = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i+1] = 0;
            data[i+2] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i+1] = 0;
                data[i+2] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 绿光滤镜  只让绿光透过
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageFilterGreen = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i] = 0;
            data[i+2] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i] = 0;
                data[i+2] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 蓝光滤镜  只让蓝光透过
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageFilterBlue = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i+1] = 0;
            data[i] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i+1] = 0;
                data[i] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 挡住红光
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageBlockRed = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 挡住绿光
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageBlockGreen = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i+1] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i + 1] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 挡住蓝光
 * 
 * @param {Object} x 可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageBlockBlue = function(x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i+2] = 0;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i + 2] = 0;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 透明度处理
 * 
 * @param {Object} a  默认为完全透明
 * @param {Object} x  可以是function，用来决定是否触发处理，这是忽略后面的值
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.image.imageTransparent = function(a,x,y,w,h){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = Expedition.fn.paint._getContext(id),
        a = a || 0,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        imageData,
        data,
        len;
    
    if(typeof(x) == 'number'){
        imageData = context.getImageData(x,y,w,h);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            data[i+3] = a;
        }
        context.putImageData(imageData,x,y);
    }else if(typeof(x) == 'function'){
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
        data = imageData.data;
        len = data.length;
        for(var i = 0 ; i < len ; i += 4){
            var tempX = i / 4 % canvas.width,
                tempY = i / 4 / canvas.width;
            
            if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                data[i + 3] = a;
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    return this;
};

/**
 * 设置背景图片
 * 
 * @param {Object} image
 */
Expedition.fn.image.backgroundImage = function(image){
    var id = this.id,
        canvas = Expedition.canvas[id]._canvas,//对应canvas
        canvasId = $().getAttr(canvas,'id'),
        node,
        context,
        pos = Expedition.fn.dom.getPosition(canvas),
        index = Expedition.fn.paint._getZIndex(canvas),
        backGroundId = 'backGroundCanvasId' + canvasId,
        args = arguments,
        len = args.length;
    
    //如果不存在  新建一个
    if(!$().g(backGroundId)){
        node = document.createElement('canvas');
        //设置位置
        Expedition.fn.dom.setStyles(node,{
            position : 'absolute',
            left : pos.left + 'px',
            top : pos.top + 'px',
            'z-index' : index == 0 ? 0 : index - 1
        });
        
        //设置大小
        node.width = canvas.width;
        node.height = canvas.height;
        
        node.setAttribute('BaseCanvas', canvasId);
        
        //设置index属性
        Expedition.fn.dom.setAttr(node,'index',index - 1);
        Expedition.fn.dom.setAttr(node,'id',backGroundId);
        //添加到canvas的前面
        Expedition.fn.dom.insertBefore(node,canvas);    
    }
    
    context = $().g(backGroundId).getContext('2d');
    if(len == 3){
        dx = args[1];
        dy = args[2];
        context.drawImage(image,dx,dy);
    }else if(len == 5){
        dx = args[1];
        dy = args[2];
        dw = args[3];
        dh = args[4];
        context.drawImage(image,dx,dy,dw,dh);
    }else if(len == 9){
        sx = args[1];
        sy = args[2];
        sw = args[3];
        sh = args[4];
        dx = args[5];
        dy = args[6];
        dw = args[7];
        dh = args[8];
        context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    
    return this;
};

/**
 * 关闭背景图片
 */
Expedition.fn.image.closeBackgroundImage = function(){
    var id = this.id,
        canvas = Expedition.fn.paint._getCanvas(id),
        canvasId = $().getAttr(canvas,'id'),
        backGroundId = 'backGroundCanvasId' + canvasId;
    
    if($().g(backGroundId)){
        Expedition.fn.dom.remove($().g(backGroundId));
    }
    
    return this;
};

/**
 * 图片印章处理
 * 
 * @param {Object} id
 * @param {Object} target
 * @param {Object} image
 * @param {Object} flag
 */
Expedition.fn.image._drawStampHandle = function(id,target,image,flag){
    var canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        targetCanvas,
        targetContext,
        width = canvas.width,
        height = canvas.height,
        imageData1,
        imageData2,
        sx,sy,sw,sh,
        dx = 0,
        dy = 0,
        dw = width,
        dh = height,
        args = arguments,
        len = args.length;
    
    if(len == 6){
        dx = args[4];
        dy = args[5];
        context.drawImage(image,dx,dy);
    }else if(len == 8){
        dx = args[4];
        dy = args[5];
        dw = args[6];
        dh = args[7];
        context.drawImage(image,dx,dy,dw,dh);
    }else if(len == 12){
        sx = args[4];
        sy = args[5];
        sw = args[6];
        sh = args[7];
        dx = args[8];
        dy = args[9];
        dw = args[10];
        dh = args[11];
        context.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    
    imageData1 = context.getImageData(dx,dy,dw,dh);
    
    if(typeof(target) == 'function'){
        for(var y = dy; y < dh ; y++){
            for(var x = dx ; x < dw ; x++){
                var tempX = x - dx,
                    tempY = y - dy,
                    position = Math.floor((tempY * dw + tempX) * 4);
                    
                if(target(x,y) != flag){
                    imageData1.data[position] = 0;
                    imageData1.data[position + 1] = 0;
                    imageData1.data[position + 2] = 0;
                    imageData1.data[position + 3] = 0;
                }
            }
        }
    }else {
        targetCanvas = Expedition.fn.paint._getNewCanvas(target);
        targetContext = targetCanvas.getContext('2d');
        imageData2 = targetContext.getImageData(dx,dy,dw,dh);
        
        for(var y = dy; y < dh ; y++){
            for(var x = dx ; x < dw ; x++){
                var tempX = x - dx,
                    tempY = y - dy,
                    position = Math.floor((tempY * dw + tempX) * 4),
                    tempFlag = false;
                
                if(imageData2.data[position] != 0 || imageData2.data[position +1] != 0 
                    || imageData2.data[position + 2] != 0 || imageData2.data[position + 3] != 0){
                    tempFlag = true;
                }   
                if(tempFlag != flag){
                    imageData1.data[position] = 0;
                    imageData1.data[position + 1] = 0;
                    imageData1.data[position + 2] = 0;
                    imageData1.data[position + 3] = 0;
                }
            }
        }
    }
    
    context.clearRect(dx,dy,dw,dh);
    context.putImageData(imageData1,dx,dy);
};

/**
 * 镶嵌
 * 
 * @param {Object} target
 * @param {Object} image
 */
Expedition.fn.image.drawInside = function(target,image){
    var sx,sy,sw,sh,dx,dy,dw,dh,
        id = this.id || false,
        args = arguments,
        len = args.length;
        
    if(len == 4){
        dx = args[2];
        dy = args[3];
        Expedition.fn.image._drawStampHandle(id,target,image,true,dx,dy);
    }else if(len == 6){
        dx = args[2];
        dy = args[3];
        dw = args[4];
        dh = args[5];
        Expedition.fn.image._drawStampHandle(id,target,image,true,dx,dy,dw,dh);
    }else if(len == 10){
        sx = args[2];
        sy = args[3];
        sw = args[4];
        sh = args[5];
        dx = args[6];
        dy = args[7];
        dw = args[8];
        dh = args[9];
        Expedition.fn.image._drawStampHandle(id,target,image,true,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    
    return this;
};

/**
 * 镂空
 * 
 * @param {Object} target
 * @param {Object} image
 */
Expedition.fn.image.drawOutside = function(target,image){
    var sx,sy,sw,sh,dx,dy,dw,dh,
        id = this.id || false,
        args = arguments,
        len = args.length;
        
    if(len == 4){
        dx = args[2];
        dy = args[3];
        Expedition.fn.image._drawStampHandle(id,target,image,false,dx,dy);
    }else if(len == 6){
        dx = args[2];
        dy = args[3];
        dw = args[4];
        dh = args[5];
        Expedition.fn.image._drawStampHandle(id,target,image,false,dx,dy,dw,dh);
    }else if(len == 10){
        sx = args[2];
        sy = args[3];
        sw = args[4];
        sh = args[5];
        dx = args[6];
        dy = args[7];
        dw = args[8];
        dh = args[9];
        Expedition.fn.image._drawStampHandle(id,target,image,false,sx,sy,sw,sh,dx,dy,dw,dh);
    }
    
    return this;
}

/**
 * Expedition.video
 * @author yangji01
 * version: 1.0
 */

/**
 * 定义Expedition.fn.video
 */
Expedition.fn.video = Expedition.fn.video || {};

/**
 * 将视频画到canvas上
 *  参数有三种形式
 *  
 *      video,dx,dy    视频  目标地址的坐标
 *      video,dx,dy,dw,dh  视频  目标地址的坐标 及 宽高
 *      video,sx,sy,sw,sh,dx,dy,dw,dh  视频  源地址的坐标 及 宽高  目标地址的坐标及宽高
 * 
 * @param {Object} video
 * @param {Object} args
 */
Expedition.fn.video.drawVideo = function(video,dx,dy,dw,dh,sx,sy,sw,sh){
    var id = this.id,
        canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        loop,
        args = arguments,
        canvasId,
        len = args.length;
    
    loop = setInterval(function(){
        if(len == 3){
            context.drawImage(video,dx,dy);
        }else if(len == 5){
            context.drawImage(video,dx,dy,dw,dh);
        }else if(len == 9){
            context.drawImage(video,dx,dy,dw,dh,sx,sy,sw,sh);
        }
    },40);  
    
    //先将已存的操作清空  再将循环操作存起来
    if(this._loop){
        for(var i = 0 ; i < this._loop.length ; i++){
            if(this._loop[i].loop ){
                clearInterval(this._loop[i].loop);
            }
            if(this._loop[i].id != 'canvasId' + id){
                //如果不等于对象的id 则表示是视频操作  将对于的canvas删掉
                Expedition.fn.dom.remove($().g(this._loop[i].id));
            }
        }
    }
    this._loop = [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'video',
        id : 'canvasId' + id
    };
    
    if(!id){
        canvasId = $().getAttr(canvas,'id');
        $().setAttr(canvas,'BaseCanvas',canvasId);
    }
    return this;
};

/**
 * 暂停视频
 */
Expedition.fn.video.stopVideo = function(){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop || [],
        loop = _loop[0].loop;
    
    if(loop){
        clearInterval(loop);
    }
    
    return this;
};

/**
 * 生成操作canvas
 * 
 * @param {Object} id
 * @param {Object} type
 */
Expedition.fn.video._videoHandlerCanvas = function(pre,id){
    var node = document.createElement('canvas'),
        canvas = $().g(pre),
        pos,
        index,
        baseCanvas = canvas.getAttribute('BaseCanvas');
        
    if(canvas){
        node.setAttribute('id',id);
        node.setAttribute('BaseCanvas',baseCanvas);
        
        pos = Expedition.fn.dom.getPosition(canvas);
        index = Expedition.fn.paint._getZIndex(canvas);
        Expedition.fn.dom.insertAfter(node,canvas);
        //位置
        Expedition.fn.dom.setStyles(node,{
            position : 'absolute',
            left : pos.left + 'px',
            top : pos.top + 'px',
            'z-index' : index
        })
        
        //大小
        node.width = canvas.width;
        node.height = canvas.height;
        
    }
    
    return node;
};

/**
 * 生成idNum
 * 
 * @param {Object} me
 * @param {Object} type
 */
Expedition.fn.video._makeVideoIdNum = function(me,type){
    var _loop = me._loop,
        len = _loop.length,
        idString = 'handlerCanvasId' + type;
    
    while(len--){
        if(_loop[len].type == type){
            return parseInt(_loop[len].id.replace(idString,'')) + 1;
        }
    }
    return 1;
};

/**
 * 反色处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoAntiColor = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdAntiColor',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'AntiColor');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i] = 255 - data[i];
                    data[i+1] = 255 - data[i+1];
                    data[i+2] = 255 - data[i+2];
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'AntiColor',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止反色操作
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoAntiColor = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdAntiColor';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'AntiColor'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'AntiColor';
        });
    }
    
    return this;
};

/**
 * 像素化处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoPixelate = function(unit,x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdPixelate',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'Pixelate');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            //用于复制原来的样子
            
            var rows = w / unit,
                cols = h / unit,
                imageData1 = preContext.getImageData(x,y,w,h),
                data1 = imageData1.data;
                //用于操作
            handlerContext.putImageData(imageData,0,0);
            handlerContext.save();
            handlerContext.translate(x,y);
            
            for(var i = 0 ; i < cols ; i++){
                for(var j =0 ; j < rows ; j++){
                    var tempX = j * unit + unit / 2,
                        tempY = i * unit + unit /2,
                        position = Math.floor(tempY) * imageData1.width * 4 + Math.floor(tempX) *4,
                        red = data1[position],
                        green = data1[position + 1],
                        blue = data1[position + 2];
                        
                    handlerContext.save();
                    handlerContext.fillStyle = Expedition.fn._lib.rgba(red,green,blue,1);
                    handlerContext.fillRect(tempX - unit /2 , tempY - unit/2 , unit, unit);
                    handlerContext.restore();
                }
            }
            handlerContext.restore();
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'Pixelate',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止像素化处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoPixelate = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdPixelate';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'Pixelate'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'Pixelate';
        });
    }
    
    return this;
};

/**
 * 设置背景视频
 *  参数有三种形式
 *  
 *      video,dx,dy    视频  目标地址的坐标
 *      video,dx,dy,dw,dh  视频  目标地址的坐标 及 宽高
 *      video,sx,sy,sw,sh,dx,dy,dw,dh  视频  源地址的坐标 及 宽高  目标地址的坐标及宽高
 * 
 * @param {Object} video
 * @param {Object} args
 */
Expedition.fn.video.backgroundVideo = function(video,dx,dy,dw,dh,sx,sy,sw,sh){
    var id = this.id,
        canvas = Expedition.fn.paint._getCanvas(id),
        canvasId = $().getAttr(canvas,'id'),
        context,
        loop,
        node,
        pos = Expedition.fn.dom.getPosition(canvas),
        index = Expedition.fn.paint._getZIndex(canvas),
        args = arguments,
        len = args.length,
        backGroundId = 'backGroundVideoCanvasId' + canvasId;
    
    //如果不存在  新建一个
    if(!$().g(backGroundId)){
        node = document.createElement('canvas')
        //设置位置
        Expedition.fn.dom.setStyles(node,{
            position : 'absolute',
            left : pos.left + 'px',
            top : pos.top + 'px',
            'z-index' : index - 1
        });
        
        //设置大小
        node.width = canvas.width;
        node.height = canvas.height;
        
        node.setAttribute('BaseCanvas', canvasId);
        
        //设置index属性
        Expedition.fn.dom.setAttr(node,'index',index - 1);
        Expedition.fn.dom.setAttr(node,'id',backGroundId);
        Expedition.fn.dom.setAttr(node,'loop',loop);
        //添加到canvas的前面
        Expedition.fn.dom.insertBefore(node,canvas);    
    }
    
    context = $().g(backGroundId).getContext('2d');
    loop = setInterval(function(){
        if(len == 3){
            context.drawImage(video,dx,dy);
        }else if(len == 5){
            context.drawImage(video,dx,dy,dw,dh);
        }else if(len == 9){
            context.drawImage(video,dx,dy,dw,dh,sx,sy,sw,sh);
        }
    },40);  
    
    this._otherLoop = this._otherLoop || {};
    this._otherLoop.backgroundLoop = loop;
    
    return this;
};

/**
 * 关闭背景视频
 */
Expedition.fn.video.closeBackgroundVideo = function(){
    var id = this.id,
        canvas = Expedition.fn.paint._getCanvas(id),
        canvasId = $().getAttr(canvas,'id'),
        backGroundId = 'backGroundVideoCanvasId' + canvasId,
        loop = this._otherLoop;
    
    if($().g(backGroundId)){
        if(loop && loop.backgroundLoop){
            clearInterval(loop.backgroundLoop);
        }
        Expedition.fn.dom.remove($().g(backGroundId));
    }
    
    return this;
};

/**
 * 灰度处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoGrey = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdGrey',
        average,
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'Grey');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    average = (data[i] + data[i+1] + data[i+2])/3;
                    data[i] = average;
                    data[i+1] = average;
                    data[i+2] = average;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    average = (data[i] + data[i+1] + data[i+2])/3;
                    data[i] = average;
                    data[i+1] = average;
                    data[i+2] = average;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'Grey',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止灰度操作
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoGrey = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdGrey';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'Grey'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'Grey';
        });
    }
    
    return this;
};


/**
 * 像素粒子化处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoPixelParticle = function(unit,x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdPixelParticle',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'PixelParticle');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            //用于复制原来的样子
            
            var rows = w / unit,
                cols = h / unit,
                imageData1 = preContext.getImageData(x,y,w,h),
                data1 = imageData1.data;
                //用于操作
            handlerContext.putImageData(imageData,0,0);
            handlerContext.clearRect(x,y,w,h);
            handlerContext.save();
            handlerContext.translate(x,y);
        
            for(var i = 0 ; i < cols ; i++){
                for(var j =0 ; j < rows ; j++){
                    var tempX = j * unit + unit / 2,
                        tempY = i * unit + unit /2,
                        position = Math.floor(tempY) * imageData1.width * 4 + Math.floor(tempX) *4,
                        red = data1[position],
                        green = data1[position + 1],
                        blue = data1[position + 2];
                        
                    handlerContext.save();
                    handlerContext.fillStyle = Expedition.fn._lib.rgba(red,green,blue,1);
                    handlerContext.beginPath();
                    handlerContext.arc(tempX , tempY , unit / 2, 0 , Math.PI * 2 , false);
                    handlerContext.closePath();
                    handlerContext.fill();
                    handlerContext.restore();
                }
            }
            handlerContext.restore();
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'PixelParticle',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止像素粒子化处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoPixelParticle = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdPixelParticle';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'PixelParticle'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'PixelParticle';
        });
    }
    
    return this;
};

/**
 * 红色滤光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoFilterRed = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdFilterRed',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'FilterRed');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i+1] = 0;
                    data[i+2] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i+1] = 0;
                    data[i+2] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'FilterRed',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止红色滤光处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoFilterRed = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdFilterRed';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'FilterRed'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'FilterRed';
        });
    }
    
    return this;
};

/**
 * 绿色滤光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoFilterGreen = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdFilterGreen',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'FilterGreen');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i] = 0;
                    data[i+2] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i] = 0;
                    data[i+2] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'FilterGreen',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止绿色滤光处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoFilterGreen = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdFilterGreen';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'FilterGreen'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'FilterGreen';
        });
    }
    
    return this;
};

/**
 * 蓝色滤光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoFilterBlue = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdFilterBlue',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'FilterBlue');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i+1] = 0;
                    data[i] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i+1] = 0;
                    data[i] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'FilterBlue',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止蓝色滤光操作
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoFilterBlue = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdFilterBlue';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'FilterBlue'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'FilterBlue';
        });
    }
    
    return this;
};

/**
 * 马赛克处理
 * 
 * @param {Object} unit
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoMosaics = function(unit,x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        unit = unit || 10,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdMosaics',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'Mosaics');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            //用于复制原来的样子
            
            var rows = w / unit,
                cols = h / unit,
                imageData1 = preContext.getImageData(x,y,w,h),
                data1 = imageData1.data;
                //用于操作
            handlerContext.putImageData(imageData,0,0);
            handlerContext.clearRect(x,y,w,h);
            handlerContext.save();
            handlerContext.translate(x,y);
        
            for(var i = 0 ; i < rows ; i++){
                for(var j =0 ; j < cols ; j++){
                    var tempX = j * unit + unit / 2,
                        tempY = i * unit + unit /2,
                        position = Math.floor(tempY) * imageData1.width * 4 + Math.floor(tempX) *4,
                        red = data1[position],
                        green = data1[position + 1],
                        blue = data1[position + 2];
                        
                    handlerContext.save();
                    handlerContext.fillStyle = Expedition.fn._lib.random.randomRgba(0,255,1);
                    handlerContext.fillRect(tempX - unit /2 , tempY - unit/2 , unit, unit);
                    handlerContext.restore();
                }
            }
            handlerContext.restore();
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'Mosaics',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止马赛克处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoMosaics = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdMosaics';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'Mosaics'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'Mosaics';
        });
    }
    
    return this;
};

/**
 * 遮蔽红光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoBlockRed = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdBlockRed',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'BlockRed');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'BlockRed',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止遮蔽红光处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoBlockRed = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdBlockRed';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'BlockRed'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'BlockRed';
        });
    }
    
    return this;
};

/**
 * 遮蔽绿光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoBlockGreen = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdBlockGreen',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'BlockGreen');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i + 1] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i + 1] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'BlockGreen',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止遮蔽绿光处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoBlockGreen = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdBlockGreen';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'BlockGreen'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'BlockGreen';
        });
    }
    
    return this;
};

/**
 * 遮蔽蓝光处理
 * 
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoBlockBlue = function(x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdBlockBlue',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'BlockBlue');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i + 1] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i + 1] = 0;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'BlockBlue',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止遮蔽蓝光处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoBlockBlue = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdBlockBlue';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'BlockBlue'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'BlockBlue';
        });
    }
    
    return this;
};

/**
 * 透明处理
 * 
 * @param {Object} a
 * @param {Object} x
 * @param {Object} y
 * @param {Object} w
 * @param {Object} h
 */
Expedition.fn.video.videoTransparent = function(a,x,y,w,h){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        loopLen = _loop.length,
        preId = _loop[loopLen -1].id,
        preCanvas = $().g(preId),//上次操作的canvas
        preContext = preCanvas.getContext('2d'),
        canvas = Expedition.fn.paint._getCanvas(id),
        a = a || 0,
        x = x || 0,
        y = y || 0,
        w = w || canvas.width,
        h = h || canvas.height,
        handlerCanvas,  //此次操作的canvas
        handlerContext,
        imageData,
        data,
        len,
        loop,
        idString = 'handlerCanvasIdTransparent',
        tempNum = Expedition.fn.video._makeVideoIdNum(this,'Transparent');//生成id用
    
    handlerCanvas = Expedition.fn.video._videoHandlerCanvas(preId , idString + tempNum);
    handlerContext = handlerCanvas.getContext('2d');
    
    //将前一次操作canvas隐藏
    Expedition.fn.dom.setStyle(preCanvas,'display','none');
    
    //循环处理  
    var loopHandler = function(){
        //如果前一次操作有改变 就需要改变preContext
        var tempLoop = Expedition.canvas[id]._loop;
        for(var j = 0; j < tempLoop.length; j++){
            if(tempLoop[j].id == idString + tempNum){
                preContext = $().g(tempLoop[j].pre).getContext('2d');
            }
        }
        
        if(typeof(x) == 'number'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                if (tempX >= x && tempX <= x + w && tempY >= y && tempY <= y + h) {
                    data[i+3] = a;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }else if(typeof(x) == 'function'){
            imageData = preContext.getImageData(0,0,canvas.width,canvas.height);
            data = imageData.data;
            len = data.length;
            for(var i = 0 ; i < len ; i += 4){
                var tempX = i / 4 % canvas.width,
                    tempY = i / 4 / canvas.width;
                
                if (x(tempX, tempY,data[i],data[i+1],data[i+2],data[i+3])) {
                    data[i+3] = a;
                }
            }
            handlerContext.putImageData(imageData,0,0);
        }
    };
    
    loop = setInterval(loopHandler,40);
    
    //将操作存起来 
    this._loop = this._loop || [];
    this._loop[this._loop.length] = {
        loop : loop,
        type : 'Transparent',
        id : idString + tempNum,
        pre : preId
    };
    
    return this;
};

/**
 * 停止透明处理
 * 
 * @param {Object} num  第几个操作
 */
Expedition.fn.video.stopVideoTransparent = function(num){
    var id = this.id,
        _loop = Expedition.canvas[id]._loop,
        display,
        len = _loop.length,
        preId,
        idString = 'handlerCanvasIdTransparent';
    
    //指定第几个操作
    if(num){
        for(var i = 0; i < len ; i ++){
            if(_loop[i].id == idString + num){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.id == idString + num;
        });
        
    }else{
        //全部删除
        for(var i = 0; i < len ; i ++){
            if(_loop[i].type == 'Transparent'){
                
                preId = _loop[i].pre;
                
                //先停止循环操作
                clearInterval(_loop[i].loop);
                
                //如果是最后一个 那么这个时候它是显示的 需要将前一个显示
                if(i == len - 1 ){
                    display = Expedition.fn.dom.getStyle($().g(_loop[i].id),'display');
                    Expedition.fn.dom.setStyle($().g(preId),'display',display);
                }else{
                    //不是最后一个  那么下一个的pre就需要改变
                    _loop[i + 1].pre = preId;
                }
                
                //删除dom节点
                Expedition.fn.dom.remove($().g(_loop[i].id));
            }
        }
        
        Expedition.fn._lib.array.remove(_loop,function(item){
            return item.type == 'Transparent';
        });
    }
    
    return this;
};

/**
 * Expedition.expand
 * @author yangji01
 * date 2012.3.26
 */

Expedition.fn.expand = function(name,func){
    Expedition.fn.init.prototype[name] = func;
};

/**
 * Expedition.queue
 * @author yangji01
 * version: 1.0
 * date: 2012.4.9
 */

Expedition.fn.queue = Expedition.fn.queue || {};

/**
 * 启用队列
 */
Expedition.fn.queue.startQueue = function(){
    this._queue = true;
    
    return this;
};

/**
 * 停止队列
 */
Expedition.fn.queue.stopQueue = function(){
    this._queue = false;
    
    return this;
}

/**
 * Expedition.event
 * @author yangji01
 * version: 1.0
 */

/**
 * 声明Expedition.fn.event包
 */
Expedition.fn.event = Expedition.fn.event || {};

/**
 * 注册事件
 * 
 * @param {Object} event
 * @param {Object} func
 * @param {Object} params 可选参数 包括
 *                  eventIndex  事件优先级
 *                  isEventTransparent  事件是否传递 默认可以传递
 *                  fireEvent   是否触发事件的函数  返回true时触发
 *                  isFireMove  触发事件的位置是否移动 针对 fireEvent函数存在时有效
 *                  unit 精确单位
 */
Expedition.fn.event._addEvent = function(event, func,params){
    var params = params || {},
        eventIndex = params.eventIndex || 0,
        isEventTransparent = params.isEventTransparent == false ? false : true,
        fireEvent = params.fireEvent,
        isFireMove = params.isFireMove,
        unit = params.unit,
        canvas = Expedition.fn.paint._getCanvas(this.id),
        canvasId = Expedition.fn.dom.getAttr(canvas,'id'),
        event = 'on' + event.replace(/^on/i, '');
        
    if(this.id ){
        if(!Expedition.canvas[this.id]._event){
            Expedition.canvas[this.id]._event = [];
        }
        //将事件添加到对应id的事件变量中
        Expedition.canvas[this.id]._event[Expedition.canvas[this.id]._event.length] = {
            type : event,
            func : func,
            eventIndex : eventIndex,
            isEventTransparent : isEventTransparent,
            fireEvent : fireEvent,
            isFireMove : isFireMove,
            unit : unit
        }
        
    }
    //将事件添加到全局的事件数组中
    Expedition.canvas._event[Expedition.canvas._event.length] = {
        type : event,
        func : func,
        id : this.id,
        canvasId : canvasId,
        eventIndex : eventIndex,
        isEventTransparent : isEventTransparent,
        fireEvent : fireEvent,
        isFireMove : isFireMove,
        unit : unit
    }
    
    return this;
};

/**
 * 注销事件
 * 
 * @param {Object} event
 * @param {Object} func
 */
Expedition.fn.event._removeEvent = function(event,func){
    var id = this.id,
        event = 'on' + event.replace(/^on/i, '');
    
    if(id){
        //在对象中删除事件
        Expedition.fn._lib.array.remove(Expedition.canvas[id]._event,function(item){
            return item.type == event && ( item.func == func || !func);
        });
        //在全局变量中删除事件
        Expedition.fn._lib.array.remove(Expedition.canvas._event,function(item){
            return item.type == event && ( item.func == func || !func) && item.id == id;
        })
    }else{
        //在全局变量中删除事件
        Expedition.fn._lib.array.remove(Expedition.canvas._event,function(item){
            return item.type == event && ( item.func == func || !func);
        })
    }
    
    return this;
};

/**
 * 单击事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.click = function(func,params){
    this.addEvent('onclick',func,params);
    
    return this;
};

/**
 * 双击事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.dblclick = function(func,params){
    this.addEvent('ondblclick',func,params);
    
    return this;
};

/**
 * 右击事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.contextmenu = function(func,params){
    this.addEvent('oncontextmenu',func,params);
    
    return this;
};

/**
 * 鼠标按下事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.mousedown = function(func,params){
    this.addEvent('onmousedown',func,params);
    
    return this;
};

/**
 * 鼠标移动事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.mousemove = function(func,params){
    this.addEvent('onmousemove',func,params);
    
    return this;
};

/**
 * 鼠标悬停事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.mouseover = function(func,params){
    this.addEvent('onmouseover',func,params);
    
    return this;
};

/**
 * 鼠标弹起事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.mouseup = function(func,params){
    this.addEvent('onmouseup',func,params);
    
    return this;
};

/**
 * 键盘按下事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.keydown = function(func,params){
    this.addEvent('onkeydown',func,params);
    
    return this;
};

/**
 * 键盘输入事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.keypress = function(func,params){
    this.addEvent('onkeypress',func,params);
    
    return this;
};

/**
 * 键盘弹起事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.keyup = function(func,params){
    this.addEvent('onkeyup',func,params);
    
    return this;
};

/**
 * 触屏开始事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.touchstart = function(func,params){
    this.addEvent('ontouchstart',func,params);
    
    return this;
};

/**
 * 触屏移动事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.touchmove = function(func,params){
    this.addEvent('ontouchmove',func,params);
    
    return this;
};

/**
 * 触屏结束事件
 * 
 * @param {Object} func
 * @param {Object} params
 */
Expedition.fn.event.touchend = function(func,params){
    this.addEvent('ontouchend',func,params);
    
    return this;
};

/**
 * 添加事件操作
 * 
 * @param {Object} node
 */
Expedition.fn.event._addEventHandle = function(node){
    if(node){
        Expedition.fn.event.on(node, 'click', Expedition.fn.event._clickHandle);
        Expedition.fn.event.on(node, 'dblclick', Expedition.fn.event._dblclickHandle);
        Expedition.fn.event.on(node, 'contextmenu', Expedition.fn.event._contextmenuHandle);
        Expedition.fn.event.on(node, 'mousedown', Expedition.fn.event._mousedownHandle);
        Expedition.fn.event.on(node, 'mousemove', Expedition.fn.event._mousemoveHandle);
        Expedition.fn.event.on(node, 'mouseover', Expedition.fn.event._mouseoverHandle);
        Expedition.fn.event.on(node, 'mouseout', Expedition.fn.event._mouseoutHandle);
        Expedition.fn.event.on(node, 'mouseup', Expedition.fn.event._mouseupHandle);
        Expedition.fn.event.on(document, 'keydown', Expedition.fn.event._keydownHandle);
        Expedition.fn.event.on(document, 'keypress', Expedition.fn.event._keypressHandle);
        Expedition.fn.event.on(document, 'keyup', Expedition.fn.event._keyupHandle);
        Expedition.fn.event.on(node, 'touchstart', Expedition.fn.event._touchstartHandle);
        Expedition.fn.event.on(node, 'touchmove', Expedition.fn.event._touchmoveHandle);
        Expedition.fn.event.on(node, 'touchend', Expedition.fn.event._touchendHandle);
    }
};

/**
 * 判断（x，y）坐标是否在对象中，就是判断该点的像素是否改变 这里取以该点为中心的 unit为长宽的矩形
 * 
 * @param {Object} id
 * @param {Object} x
 * @param {Object} y
 * @param {Object} unit 精确到多少 默认1个像素
 */
Expedition.fn.event._isInObject = function(id,x,y,unit){
    var canvas = Expedition.fn.paint._getNewCanvas(id),
        context = canvas.getContext('2d'),
        pixel ,
        len,
        unit = unit;
    
    Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
    //如果在对象处在运动状态，那么久需要拿运动对于的canvas
    if(Expedition.canvas[id]._loop.length > 0){
        canvas = $().g(Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].id);
        context = canvas.getContext('2d');
    }
    
    if (unit) {
        pixel = context.getImageData(x - unit / 2,y - unit / 2,unit,unit);
    }
    else {
        pixel = context.getImageData(x,y,1,1)
    }

    len = pixel.data.length;
    
    for(var i = 0 ; i < len ; i++){
        if(pixel.data[i] != 0){
            return true;
        }
    }
    return false;
};

/**
 * 事件优先级处理函数
 * 
 * @param {Object} sortArray
 * @param {Object} x
 * @param {Object} y
 */
Expedition.fn.event._eventPriority = function(sortArray,e){
    var index,
        transparentFlag = true;
    
    if(sortArray.length == 0){
        return;
    }
    
    index = sortArray[0].eventIndex;
        
    //事件优先级处理
    sortArray = sortArray.sort(function(a,b){
        var indexA = a.eventIndex || 0,
            indexB = b.eventIndex || 0;
        return indexB - indexA;
    })
    for(var i = 0; i < sortArray.length; i++){
        if(sortArray[i].eventIndex < index && transparentFlag == false){
            return;
        }else{
            sortArray[i].func(e);
        }
        if(sortArray[i].isEventTransparent == false){
            transparentFlag = false;
        }
        index = sortArray[i].eventIndex;
    }
};

/**
 * 单击事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._clickHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onclick' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)
            ){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
            //运行func 传入坐标
            if(flag){
                //eventArray[i].func(e);
                sortArray[sortArray.length] = eventArray[i];
            }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 双击事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._dblclickHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'ondblclick' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 右击事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._contextmenuHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'oncontextmenu' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 鼠标按下事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._mousedownHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onmousedown' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            for (var j = 0; j < Expedition.canvas[id]._loop.length; j++) {
                                tempX += Expedition.canvas[id]._loop[j].x;
                                tempY += Expedition.canvas[id]._loop[j].y;
                            }
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX - Expedition.canvas[id]._x, y - tempY - Expedition.canvas[id]._y);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 鼠标移动事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._mousemoveHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if((eventArray[i].type == 'onmousemove' || eventArray[i].type == 'onmouseover' || eventArray[i].type == 'onmouseout')
         && eventArray[i].canvasId == canvasId){
            if(eventArray[i].id){
                //如果是对象
                if((eventArray[i].type == 'onmousemove' || eventArray[i].type == 'onmouseover') && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id) ){
                    //定义了事件区域
                    if(eventArray[i].fireEvent){
                        if (!eventArray[i].isFireMove) {
                            flag = eventArray[i].fireEvent(x, y);
                        }else {
                            var tempX = 0,
                                tempY = 0,
                            id = eventArray[i].id;
                                
                            Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
        
                            //如果对象处在运动状态
                            if(Expedition.canvas[id]._loop.length > 0){
                                tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                                tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                            }
                            
                            flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                        }
                    }else{
                        //没定义事件区域，就判断该点的像素
                        flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                    }
                }else if(eventArray[i].type == 'onmouseout' && 
                        (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
                    //定义了事件区域
                    if(eventArray[i].fireEvent){
                        if (!eventArray[i].isFireMove) {
                            flag = eventArray[i].fireEvent(x, y);
                        }else {
                            var tempX = 0,
                                tempY = 0,
                                id = eventArray[i].id;
                                
                            Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
        
                            //如果对象处在运动状态
                            if(Expedition.canvas[id]._loop.length > 0){
                                tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                                tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                            }
                            
                            flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                        }
                    }else{
                        //没定义事件区域，就判断该点的像素
                        flag = !Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                    }
                }
            //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
                
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 鼠标进入事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._mouseoverHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onmouseover' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(!eventArray[i].id){
                //全局事件  直接运行func
                flag = true;
            }
            
            //运行func 传入坐标
            if(flag){
                //eventArray[i].fune,y);
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 鼠标离开事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._mouseoutHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onmouseout' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(!eventArray[i].id){
                //全局事件  直接运行func
                flag = true;
            }
            
            //运行func 传入坐标
            if(flag){
                //eventArray[i].func(e);
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 鼠标弹起事件事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._mouseupHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onmouseup' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 触屏开始事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._touchstartHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'ontouchstart' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 触屏移动事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._touchmoveHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'ontouchmove' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 触屏结束事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._touchendHandle = function(e){
    var object = Expedition.canvas,
        eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        sortArray = [],
        target = Expedition.fn.event.getTarget(e),
        canvasId = Expedition.fn.dom.getAttr(target,'canvasId'),
        pageX = Expedition.fn.event.getPageX(e),
        pageY = Expedition.fn.event.getPageY(e),
        canvasLeft = $().g(canvasId).offsetLeft,
        canvasTop = $().g(canvasId).offsetTop,
        x = pageX - canvasLeft,
        y = pageY - canvasTop,
        flag = false;//事件是否触发
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'ontouchend' && eventArray[i].canvasId == canvasId && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            if(eventArray[i].id){
                //如果是对象
                //定义了事件区域
                if(eventArray[i].fireEvent){
                    if (!eventArray[i].isFireMove) {
                        flag = eventArray[i].fireEvent(x, y);
                    }else {
                        var tempX = 0,
                            tempY = 0,
                            id = eventArray[i].id;
                            
                        Expedition.canvas[id]._loop = Expedition.canvas[id]._loop || [];
    
                        //如果对象处在运动状态
                        if(Expedition.canvas[id]._loop.length > 0){
                            tempX = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].x;
                            tempY = Expedition.canvas[id]._loop[Expedition.canvas[id]._loop.length -1].y;
                        }
                        
                        flag = eventArray[i].fireEvent(x - tempX, y - tempY);
                    }
                }else{
                    //没定义事件区域，就判断该点的像素
                    flag = Expedition.fn.event._isInObject(eventArray[i].id,x,y,eventArray[i].unit);
                }
                //运行func 传入坐标
                if(flag){
                    //eventArray[i].func(e);
                    sortArray[sortArray.length] = eventArray[i];
                }
            }else{
                //全局事件  直接运行func
                sortArray[sortArray.length] = eventArray[i];
            }
        }
    }
    Expedition.fn.event._eventPriority(sortArray,e);
};

/**
 * 键盘按下事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._keydownHandle = function(e){
    var eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        target = Expedition.fn.event.getTarget(e);
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onkeydown' && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            eventArray[i].func(target);
        }
    }
};

/**
 * 键盘输入事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._keypressHandle = function(e){
    var eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        target = Expedition.fn.event.getTarget(e);
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onkeypress' && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            eventArray[i].func(target);
        }
    }
};

/**
 * 键盘弹起事件操作处理函数
 * 
 * @param {Object} e
 */
Expedition.fn.event._keyupHandle = function(e){
    var eventArray = Expedition.canvas._event,//全局evnet数组
        len = eventArray.length,
        eventList,//对象中的事件数组
        eventLen,
        target = Expedition.fn.event.getTarget(e);
        
    for(var i = 0; i < len; i++){
        //判断触发事件的eventcanvas 是否与注册事件的canvas对应
        if(eventArray[i].type == 'onkeyup' && 
            (eventArray[i].id && !Expedition.canvas[eventArray[i].id].isHide || ! eventArray[i].id)){
            eventArray[i].func(target);
        }
    }
};

/**
 * 拖拽
 * 
 * @param {Object} isAble
 * @param {Object} params
 */
Expedition.fn.event.draggable = function(isAble,params){
    var id = this.id,
        _loop = this._loop || [],
        canvas,
        context,
        width,
        height,
        _isAble = true,
        tempParams = params || {},
        func1,
        func2,
        func3,
        x,
        y,
        imageData;
    
    func2 = function(e){
        var tempX = Expedition.fn.event.getPageX(e),
            tempY = Expedition.fn.event.getPageY(e);
            
        if (_loop.length > 0) {
            _loop[_loop.length - 1].dragX = _loop[_loop.length - 1].dragX || 0;
            _loop[_loop.length - 1].dragY = _loop[_loop.length - 1].dragY || 0;
            
            _loop[_loop.length - 1].dragX += tempX - x;
            _loop[_loop.length - 1].dragY += tempY - y;
        }
        else {
            canvas = Expedition.fn.paint._getNewCanvas(id);
            context = canvas.getContext('2d');
            width = canvas.width;
            height = canvas.height;
        
            imageData = context.getImageData(0,0,width,height);
            context.clearRect(0,0,width,height);
            context.putImageData(imageData,tempX - x, tempY - y);
            
            //设置位置变化值
            Expedition.canvas[id]._x += tempX;
            Expedition.canvas[id]._y += tempY;
        }
        x = tempX;
        y = tempY;
    };
    
    func3 = function(e){
        Expedition.fn.un(document,'onmousemove',func2);
    };
    
    func1 = function(e){
            x = Expedition.fn.event.getPageX(e);
            y = Expedition.fn.event.getPageY(e);
        
        Expedition.fn.on(document,'onmousemove',func2);
        Expedition.fn.on(document,'onmouseup',func3);
    };
    
    if(typeof(flag) == 'object'){
        tempParams = isAble;
    }else if(isAble === false){
        _isAble = false;
    }
    
    if(_isAble){
        $(id).mousedown(func1,tempParams);
    }else{
        $(id).removeEvent('mousedown');
        Expedition.fn.un(document,'onmouseup',func3);
    }
    
    return this;
};

/**
 * 外面事件*******
 */


/**
 * 获取鼠标事件的鼠标x坐标
 * 
 * @param {Event} event 事件对象
 * @return {number} 鼠标事件的鼠标x坐标
 */
Expedition.fn.event.getPageX = function (event) {
    var result = event.pageX,
        doc = document;
    if (!result && result !== 0) {
        result = (event.clientX || 0) 
                    + (doc.documentElement.scrollLeft 
                        || doc.body.scrollLeft);
    }
    
    return result;
};

/**
 * 获取鼠标事件的鼠标y坐标
 * 
 * @param {Event} event 事件对象
 * @return {number} 鼠标事件的鼠标y坐标
 */
Expedition.fn.event.getPageY = function (event) {
    var result = event.pageY,
        doc = document;
    if (!result && result !== 0) {
        result = (event.clientY || 0) 
                    + (doc.documentElement.scrollTop 
                        || doc.body.scrollTop);
    }
    
    return result;
};

/**
 * 停止事件的传播
 * 
 * @param {Event} event 事件对象
 */
Expedition.fn.event.stopPropagation = function (event) {
   if (event.stopPropagation) {
       event.stopPropagation();
   } else {
       event.cancelBubble = true;
   }
};

/**
 * 阻止事件的默认行为
 * 
 * @param {Event} event 事件对象
 */
Expedition.fn.event.preventDefault = function (event) {
   if (event.preventDefault) {
       event.preventDefault();
   } else {
       event.returnValue = false;
   }
};

/**
 * 停止事件
 * 
 * @param {Event} event 事件对象
 */
Expedition.fn.event.stop = function (event) {
    var e = Expedition.fn.dom.event;
    e.stopPropagation(event);
    e.preventDefault(event);
};

/**
 * 获取事件的触发元素
 * 
 * @param {Event} event 事件对象
 * @return {HTMLElement} 事件的触发元素
 */
Expedition.fn.event.getTarget = function (event) {
    return event.target || event.srcElement;
};

/**
 * 事件对象构造器
 * 监听框架中事件时需要传入框架window对象
 * 
 * @param {Event}   event        事件对象
 * @param {Window}  win optional 窗口对象，默认为window
 */
Expedition.fn.event.EventArg = function (event, win) {
    win = win || window;
    event = event || win.event;
    var doc = win.document;
    
    this.target = event.target || event.srcElement;
    this.keyCode = event.which || event.keyCode;
    for (var k in event) {
        var item = event[k];
        // 避免拷贝preventDefault等事件对象方法
        if ('function' != typeof item) {
            this[k] = item;
        }
    }
    
    if (!this.pageX && this.pageX !== 0) {
        this.pageX = (event.clientX || 0) 
                        + (doc.documentElement.scrollLeft 
                            || doc.body.scrollLeft);
        this.pageY = (event.clientY || 0) 
                        + (doc.documentElement.scrollTop 
                            || doc.body.scrollTop);
    }
    this._event = event;
};

/**
 * 阻止事件的默认行为
 */
Expedition.fn.event.EventArg.prototype.preventDefault = function () {
    if (this._event.preventDefault) {
        this._event.preventDefault();
    } else {
        this._event.returnValue = false;
    }
    
    return this;
};

/**
 * 停止事件的传播
 */
Expedition.fn.event.EventArg.prototype.stopPropagation = function () {
    if (this._event.stopPropagation) {
        this._event.stopPropagation();
    } else {
        this._event.cancelBubble = true;
    }
    
    return this;
};

/**
 * 停止事件
 */
Expedition.fn.event.EventArg.prototype.stop = function () {
    return this.stopPropagation().preventDefault();
};

/**
 * 卸载所有事件监听器
 * @private
 */
Expedition.fn.event._unload = function () {
    var lis = Expedition.fn.event._listeners,
        len = lis.length,
        standard = !!window.removeEventListener,
        item, el;
        
    while (len--) {
        item = lis[len];

        if(item[1] == 'unload'){
            continue;
        }
        el = item[0];
        if (el.removeEventListener) {
            el.removeEventListener(item[1], item[3], false);
        } else if (el.detachEvent){
            el.detachEvent('on' + item[1], item[3]);
        }
    }
    
    if (standard) {
        window.removeEventListener('unload', Expedition.fn.event._unload, false);
    } else {
        window.detachEvent('onunload', Expedition.fn.event._unload);
    }
};

// 在页面卸载的时候，将所有事件监听器移除
if (window.attachEvent) {
    window.attachEvent('onunload', Expedition.fn.event._unload);
} else {
    window.addEventListener('unload', Expedition.fn.event._unload, false);
}

/**
 * 事件监听器的存储表
 * @private
 */
Expedition.fn.event._listeners = Expedition.fn.event._listeners || [];


/**
 * 为目标元素添加事件监听器
 * 
 * @param {HTMLElement|string|window} element  目标元素或目标元素id
 * @param {string}                    type     事件类型
 * @param {Function}                  listener 事件监听器
 * @return {HTMLElement} 目标元素
 */
Expedition.fn.event.on = function (element, type, listener) {
    type = type.replace(/^on/i, '');
    element = Expedition.fn.dom._g(element);

    var fn = function (ev) {
            // 1. 这里不支持EventArgument,  原因是跨frame的时间挂载
            // 2. element是为了修正this
            listener.call(element, ev);
        },
        lis = Expedition.fn.event._listeners;
    
    // 将监听器存储到数组中
    lis[lis.length] = [element, type, listener, fn];
    
    // 事件监听器挂载
    if (element.addEventListener) {
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, fn);
    } 
    
    return element;
};

// 声明快捷方法
Expedition.fn.on = Expedition.fn.event.on;

/**
 * 获取扩展的事件对象
 * 
 * @param {Event}  event 原生事件对象
 * @param {window} win   窗体对象
 * @return {EventArg} 扩展的事件对象
 */
Expedition.fn.event.get = function (event, win) {
    return new Expedition.fn.event.EventArg(event, win);
};

/**
 * 为目标元素移除事件监听器
 * 
 * @param {HTMLElement|string|window} element  目标元素或目标元素id
 * @param {string}                    type     事件类型
 * @param {Function}                  listener 事件监听器
 * @return {HTMLElement} 目标元素
 */
Expedition.fn.event.un = function (element, type, listener) {
    element = Expedition.fn.dom._g(element);
    type = type.replace(/^on/i, '');
    
    var lis = Expedition.fn.event._listeners, 
        len = lis.length,
        isRemoveAll = !listener,
        item;
    
    while (len--) {
        item = lis[len];
        
        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if (item[1] === type
            && item[0] === element
            && (isRemoveAll || item[2] === listener)) {
            if (element.removeEventListener) {
                element.removeEventListener(type, item[3], false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + type, item[3]);
            }
            lis.splice(len, 1);
        }
    }
    
    return element;
};

// 声明快捷方法
Expedition.fn.un = Expedition.fn.event.un;

/**
 * 获取键盘事件的键值
 * 
 * @param {Event} event 事件对象
 * @return {number} 键盘事件的键值
 */
Expedition.fn.event.getKeyCode = function (event) {
    return event.which || event.keyCode;
};
///////////////////

//注册onresize事件
Expedition.fn.on(window,'onresize',function(){
    /*for(var id in Expedition.canvas){
        Expedition.fn.paint._newCanvas(id);
    }*/
    var canvas = document.getElementsByTagName('canvas'),
        len = canvas.length,
        baseCanvas,
        pos;
    
    for(var i = 0; i < len ; i++){
        baseCanvas = canvas[i].getAttribute('BaseCanvas');
        if (baseCanvas) {
            pos = Expedition.fn.dom.getPosition($().g(baseCanvas));
            
            $().setStyles(canvas[i], {
                left: pos.left + 'px',
                top: pos.top + 'px'
            });
        }
    }
});


/**
 * @author yangji01
 */

/**
 * 将方法加入到Expedition.fn.init.prototype中
 */

Expedition.fn.init.prototype ={
    dispose : Expedition.fn.dispose,
    show : Expedition.fn.show,
    hide : Expedition.fn.hide,
    setIndex : Expedition.fn.paint.setIndex ,
    
    //dom 相关
    dom : Expedition.fn.dom,
    g : Expedition.fn.g,
    setAttr : Expedition.fn.setAttr,
    setAttrs : Expedition.fn.setAttrs,
    getAttr : Expedition.fn.getAttr,
    trim : Expedition.fn.trim,
    addClass : Expedition.fn.addClass,
    removeClass : Expedition.fn.removeClass,
    setStyle : Expedition.fn.setStyle,
    setStyles : Expedition.fn.setStyles,
    q : Expedition.fn.q,
    getStyle : Expedition.fn.getStyle,
    inserHTML : Expedition.fn.inserHTML,
    
    //dom event
    on : Expedition.fn.event.on,
    un : Expedition.fn.event.un,
    
    //object 处理
    extend : Expedition.fn.object.extend,
    each : Expedition.fn.object.each,
    keys : Expedition.fn.object.keys,
    values : Expedition.fn.object.values,
    clone : Expedition.fn.object.clone,
    
    //浏览器判断
    browser: Expedition.fn._browser.getBrowser,
    isCanvasSupport : Expedition.fn._browser.isCanvasSupport,
    
    //canvas context
    canvas : Expedition.fn.paint.canvas,
    size : Expedition.fn.paint.size,
    context : Expedition.fn.paint.context,
    setContext : Expedition.fn.paint._setContext,
    
    line : Expedition.fn.paint.line,
    rect : Expedition.fn.paint.rect,
    clearRect : Expedition.fn.paint.clearRect,
    fillRect : Expedition.fn.paint.fillRect,
    strokeRect : Expedition.fn.paint.strokeRect,
    
    arc : Expedition.fn.paint.arc,
    hypotrochoid : Expedition.fn.paint.hypotrochoid,
    epitrochoid : Expedition.fn.paint.epitrochoid,
    epicycloid : Expedition.fn.paint.epicycloid,
    hypocycloid : Expedition.fn.paint.hypocycloid,
    
    save : Expedition.fn.paint.save,
    restore : Expedition.fn.paint.restore,
    translate : Expedition.fn.paint.translate,
    
    //路径相关
    beginPath : Expedition.fn.paint.beginPath,
    closePath : Expedition.fn.paint.closePath,
    fill : Expedition.fn.paint.fill,
    stroke : Expedition.fn.paint.stroke,
    clip : Expedition.fn.paint.clip,
    
    moveTo : Expedition.fn.paint.moveTo,
    lineTo : Expedition.fn.paint.lineTo,
    arcTo : Expedition.fn.paint.arcTo,
    bezierCurveTo : Expedition.fn.paint.bezierCurveTo,
    quadraticCurveTo : Expedition.fn.paint.quadraticCurveTo,
    
    customCurves : Expedition.fn.paint.customCurves,
    
    isPointInPath : Expedition.fn.paint.isPointInPath,
    
    //事件添加
    addEvent : Expedition.fn.event._addEvent,
    removeEvent : Expedition.fn.event._removeEvent,
    
    dblclick : Expedition.fn.event.dblclick,
    click : Expedition.fn.event.click,
    contextmenu : Expedition.fn.event.contextmenu,
    mousedown : Expedition.fn.event.mousedown,
    mousemove : Expedition.fn.event.mousemove,
    mouseover : Expedition.fn.event.mouseover,
    mouseup : Expedition.fn.event.mouseup,
    
    keydown : Expedition.fn.event.keydown,
    keypress : Expedition.fn.event.keypress,
    keyup : Expedition.fn.event.keyup,
    touchstart : Expedition.fn.event.touchstart,
    touchmove : Expedition.fn.event.touchmove,
    touchend : Expedition.fn.event.touchend,
    
    draggable : Expedition.fn.event.draggable,
    //是否在对象中
    isInObject : Expedition.fn.event._isInObject,
    
    //坐标转换
    spherical : Expedition.fn._lib.vector3d.spherical,
    transform2d : Expedition.fn._lib.vector3d.transform2d,
    
    //特殊处理
    heart : Expedition.fn.render.heart,
    flower : Expedition.fn.render.flower,
    ball : Expedition.fn.render.ball,
    stopBallLoop : Expedition.fn.render.stopBallLoop,
    cube : Expedition.fn.render.cube,
    stopCubeLoop : Expedition.fn.render.stopCubeLoop,
    
    //燃烧
    burn : Expedition.fn.render.burn,
    stopBurn : Expedition.fn.render.stopBurn,
    
    //图形处理
    getStrokeStyle : Expedition.fn.render.getStrokeStyle,
    setStrokeStyle : Expedition.fn.render.setStrokeStyle,
    getLineWidth : Expedition.fn.render.getLineWidth,
    setLineWidth : Expedition.fn.render.setLineWidth,
    getLineCap : Expedition.fn.render.getLineCap,
    setLineCap : Expedition.fn.render.setLineCap,
    getLineJoin : Expedition.fn.render.getLineJoin,
    
    setLineJoin : Expedition.fn.render.setLineJoin,
    getMiterLimit : Expedition.fn.render.getMiterLimit,
    setMiterLimit : Expedition.fn.render.setMiterLimit,
    getFillStyle : Expedition.fn.render.getFillStyle,
    setFillStyle : Expedition.fn.render.setFillStyle,
    getShadowBlur : Expedition.fn.render.getShadowBlur,
    
    setShadowBlur : Expedition.fn.render.setShadowBlur,
    getShadowColor : Expedition.fn.render.getShadowColor,
    setShadowColor : Expedition.fn.render.setShadowColor,
    getShadowOffsetX : Expedition.fn.render.getShadowOffsetX,
    setShadowOffsetX : Expedition.fn.render.setShadowOffsetX,
    
    getShadowOffsetY : Expedition.fn.render.getShadowOffsetY,
    setShadowOffsetY : Expedition.fn.render.setShadowOffsetY,
    getShadow : Expedition.fn.render.getShadow,
    setShadow : Expedition.fn.render.setShadow,
    getCompositeOperation : Expedition.fn.render.getCompositeOperation,
    setCompositeOperation : Expedition.fn.render.setCompositeOperation,
    
    rotate : Expedition.fn.render.rotate,
    scale : Expedition.fn.render.scale,
    createLinearGradient : Expedition.fn.render.createLinearGradient,
    createRadialGradient : Expedition.fn.render.createRadialGradient,
    addColorStop : Expedition.fn.render.addColorStop,
    getGradient : Expedition.fn.render.getGradient,
    randomRgba : Expedition.fn.render.randomRgba,
    
    //图片处理
    drawImage : Expedition.fn.image.drawImage,
    
    createImageData : Expedition.fn.image.createImageData,
    getImageData : Expedition.fn.image.getImageData,
    putImageData : Expedition.fn.image.putImageData,
    
    imageAntiColor : Expedition.fn.image.imageAntiColor,
    imagePixelate : Expedition.fn.image.imagePixelate,
    imagePixelParticle : Expedition.fn.image.imagePixelParticle,
    imageGrey : Expedition.fn.image.imageGrey,
    imageMosaics : Expedition.fn.image.imageMosaics,
    
    imageFilterRed : Expedition.fn.image.imageFilterRed,
    imageFilterGreen : Expedition.fn.image.imageFilterGreen,
    imageFilterBlue : Expedition.fn.image.imageFilterBlue,
    
    imageBlockRed : Expedition.fn.image.imageBlockRed,
    imageBlockGreen : Expedition.fn.image.imageBlockGreen,
    imageBlockBlue : Expedition.fn.image.imageBlockBlue,
    
    imageTransparent : Expedition.fn.image.imageTransparent,
    
    backgroundImage : Expedition.fn.image.backgroundImage,
    closeBackgroundImage : Expedition.fn.image.closeBackgroundImage,
    drawInside : Expedition.fn.image.drawInside,
    drawOutside : Expedition.fn.image.drawOutside,
    
    //视频处理
    drawVideo : Expedition.fn.video.drawVideo,
    stopVideo : Expedition.fn.video.stopVideo,
    
    videoAntiColor : Expedition.fn.video.videoAntiColor,
    stopVideoAntiColor : Expedition.fn.video.stopVideoAntiColor,
    
    videoGrey : Expedition.fn.video.videoGrey,
    stopVideoGrey : Expedition.fn.video.stopVideoGrey,
    
    videoFilterRed : Expedition.fn.video.videoFilterRed,
    stopVideoFilterRed : Expedition.fn.video.stopVideoFilterRed,
    
    videoFilterGreen : Expedition.fn.video.videoFilterGreen,
    stopVideoFilterGreen : Expedition.fn.video.stopVideoFilterGreen,
    
    videoFilterBlue : Expedition.fn.video.videoFilterBlue,
    stopVideoFilterBlue : Expedition.fn.video.stopVideoFilterBlue,
    
    videoBlockRed : Expedition.fn.video.videoBlockRed,
    stopVideoBlockRed : Expedition.fn.video.stopVideoBlockRed,
    
    videoBlockGreen : Expedition.fn.video.videoBlockGreen,
    stopVideoBlockGreen : Expedition.fn.video.stopVideoBlockGreen,
    
    videoBlockBlue : Expedition.fn.video.videoBlockBlue,
    stopVideoBlockBlue : Expedition.fn.video.stopVideoBlockBlue,
    
    videoTransparent : Expedition.fn.video.videoTransparent,
    stopVideoTransparent : Expedition.fn.video.stopVideoTransparent,
    
    videoPixelate : Expedition.fn.video.videoPixelate,
    stopVideoPixelate : Expedition.fn.video.stopVideoPixelate,
    
    videoPixelParticle : Expedition.fn.video.videoPixelParticle,
    stopVideoPixelParticle : Expedition.fn.video.stopVideoPixelParticle,
    
    videoMosaics : Expedition.fn.video.videoMosaics,
    stopVideoMosaics : Expedition.fn.video.stopVideoMosaics,
    
    backgroundVideo : Expedition.fn.video.backgroundVideo,
    closeBackgroundVideo : Expedition.fn.video.closeBackgroundVideo,
    
    //文字处理
    getFont : Expedition.fn.text.getFont,
    setFont : Expedition.fn.text.setFont,
    getTextAlign : Expedition.fn.text.getTextAlign,
    setTextAlign : Expedition.fn.text.setTextAlign,
    getTextBaseline : Expedition.fn.text.getTextBaseline,
    setTextBaseline : Expedition.fn.text.setTextBaseline,
    
    fillText : Expedition.fn.text.fillText,
    strokeText : Expedition.fn.text.strokeText,
    measureText : Expedition.fn.text.measureText,
    
    write : Expedition.fn.text.write,
    //运动
    addMove : Expedition.fn.move.addMove,
    pauseMove : Expedition.fn.move.pauseMove,
    runMove : Expedition.fn.move.runMove,
    cancelMove : Expedition.fn.move.cancelMove,
    
    uniLinMotion : Expedition.fn.move.uniLinMotion,
    accLinMotion : Expedition.fn.move.accLinMotion,
    cirMotion : Expedition.fn.move.cirMotion,
    parMotion : Expedition.fn.move.parMotion,
    sinMotion : Expedition.fn.move.sinMotion,
    
    hypMotion : Expedition.fn.move.hypMotion,
    epiMotion : Expedition.fn.move.epiMotion,
    htpocycMotion : Expedition.fn.move.htpocycMotion,
    epicycMotion : Expedition.fn.move.epicycMotion,
    
    //队列
    startQueue : Expedition.fn.queue.startQueue,
    stopQueue : Expedition.fn.queue.stopQueue,
    
    //对外接口
    expand : Expedition.fn.expand
};