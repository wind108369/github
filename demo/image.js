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
 * 		image,dx,dy    图片  目标地址的坐标
 * 		image,dx,dy,dw,dh  图片  目标地址的坐标 及 宽高
 * 		image,sx,sy,sw,sh,dx,dy,dw,dh  图片  源地址的坐标 及 宽高  目标地址的坐标及宽高
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
 * 		sw,sh 宽高
 * 		imageData imageData对象
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
