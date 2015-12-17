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
 * 		包括 x  x轴差量
 * 			y	y轴差量
 * 			time 时间   
 * 			speed 速度
 * 			distance 路程
 * 			acc 加速度  不在这里用  上层函数可以将它写在speed function中
 * 			callback 运动结束时回调函数
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
 * 			在params中添加一个queueFlag标识是否队列中的运动该运行
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
 * 		包括 x  x轴差量
 * 			y	y轴差量
 * 			time 时间   
 * 			speed 速度
 * 			distance 路程
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
 * 		包括 x  x轴差量
 * 			y	y轴差量
 * 			time 时间   
 * 			speed 速度
 * 			distance 路程
 * 			acc 加速度
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
 * @param {Object} r	半径
 * @param {Object} delta	角度增量
 * @param {Object} theta	初始角度
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
 * 		包括a，b，c三个参数
 * 		还有delta  增量
 * 		time 时间
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
 * 		包括time
 * 			a
 * 			b
 * 			delta
 * 			rate x与弧度的比
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
 * 		theta = tempTime * Math.PI / 180 /25 * delta;
 * 		x = (a - b)* Math.cos(theta) + c * Math.cos((a / b - 1)* theta)
 * 		y = (a - b)* Math.sin(theta) - c * Math.sin((a / b - 1)* theta)
 * 
 * @param {Object} moveId
 * @param {Object} params
 * 		包括a
 * 			b
 * 			c
 * 			time
 * 			delta 可以决定运动的方向
 * 			theta 起始角度
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
 * 		theta = tempTime * Math.PI / 180 /25 * delta;
 * 		x = (a + b)* Math.cos(theta) - c * Math.cos((a / b + 1)* theta);
 * 		y = (a + b)* Math.sin(theta) - c * Math.sin((a / b + 1)* theta);
 * 
 * @param {Object} moveId
 * @param {Object} params
 * 		包括a
 * 			b
 * 			c
 * 			time
 * 			delta
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
 * 		包括n
 * 			size
 * 			delta
 * 			time
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
 * 		包括n
 * 			size
 * 			delta
 * 			time
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

