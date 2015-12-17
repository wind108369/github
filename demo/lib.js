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
