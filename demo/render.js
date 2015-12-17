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
 * 		petal 数组 花瓣，如果指定直接将它绘制
 * 		petalNum 花瓣数量 没有时为6到15的随机数
 * 		petalColor 花瓣颜色 没有时随机指定
 * 		isColorSame 花瓣颜色是否一样
 * 		isShapeSame 花瓣形状是否一样
 * 		petalMaxLength 花瓣的最大长度  默认是 30
 * 		petalMinLength 花瓣的最小长度  默认 10
 * 		gap 花瓣线条之间的间隙  0.1到1
 * 		speed 花瓣成长的速度 
 * 		startAngle 花瓣开始的角度
 * 		shapevar1 花瓣形状参数
 * 		shapevar2 花瓣形状参数
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
 * 		petalColor 花瓣颜色 没有时随机指定
 * 		petalLength 花瓣长度
 * 		petalAngle 花瓣角度 
 * 		startAngle 花瓣开始的角度
 * 		shapevar1 花瓣形状参数
 * 		shapevar2 花瓣形状参数
 * 		gap    线条之间的间隙
 * 		speed 花瓣成长的速度 
 * 		curveX1 三次方贝塞尔曲线x1  可选
 * 		curveY1 三次方贝塞尔曲线y1  可选
 * 		curveX2 三次方贝塞尔曲线x2  可选
 * 		curveY2 三次方贝塞尔曲线y2  可选
 * 		id 
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
