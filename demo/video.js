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
 * 		video,dx,dy    视频  目标地址的坐标
 * 		video,dx,dy,dw,dh  视频  目标地址的坐标 及 宽高
 * 		video,sx,sy,sw,sh,dx,dy,dw,dh  视频  源地址的坐标 及 宽高  目标地址的坐标及宽高
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
 * 		video,dx,dy    视频  目标地址的坐标
 * 		video,dx,dy,dw,dh  视频  目标地址的坐标 及 宽高
 * 		video,sx,sy,sw,sh,dx,dy,dw,dh  视频  源地址的坐标 及 宽高  目标地址的坐标及宽高
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

