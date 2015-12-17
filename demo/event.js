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
 * 					eventIndex  事件优先级
 * 					isEventTransparent  事件是否传递 默认可以传递
 * 					fireEvent   是否触发事件的函数  返回true时触发
 * 					isFireMove  触发事件的位置是否移动 针对 fireEvent函数存在时有效
 * 					unit 精确单位
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
	
	func3 =	function(e){
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
