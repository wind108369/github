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
