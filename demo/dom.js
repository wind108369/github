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



