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
