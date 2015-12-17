/**
 * Expediton
 * @author yangji01
 * version: 1.0
 */
document.write('<script type="text/javascript" src="browser.js"></script>');
document.write('<script type="text/javascript" src="dom.js"></script>');
document.write('<script type="text/javascript" src="lib.js"></script>');
document.write('<script type="text/javascript" src="paint.js"></script>');
document.write('<script type="text/javascript" src="render.js"></script>');
document.write('<script type="text/javascript" src="text.js"></script>');
document.write('<script type="text/javascript" src="move.js"></script>');
document.write('<script type="text/javascript" src="image.js"></script>');
document.write('<script type="text/javascript" src="video.js"></script>');
document.write('<script type="text/javascript" src="expand.js"></script>');
document.write('<script type="text/javascript" src="queue.js"></script>');
document.write('<script type="text/javascript" src="event.js"></script>');
document.write('<script type="text/javascript" src="func.js"></script>');
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
 * 			  id  id为空时 为全局的事件
 *            func
 *            canvasId  对应的底层canvas的id
 *			 }]所有事件都存在这里
 * _canvas  : '' 当前的canvas元素
 * _context : ''当前的上下文 
 * 其他的就是canvas对象id对应的object 
 * 		其中包括
 * 			id :
 * 			_canvas  :  ''  对应的canvas元素
 * 			_context :  ''  对应的上下文
 * 			_x       :  int 位置x的变化值
 * 			_y       :  int 位置y的变化值
 * 			_loop : [{
 * 							id  操作的id
 * 							type  操作类型
 * 							pre 前一次操作的id
 * 							loop  循环的函数
 * 							moveFlag 是否运动 0 运动 1 暂停 2 删除
 * 						}]
 * 			_otherLoop : 背景视频循环等
 * 			_gradient : 渐变属性
 * 			_event   : [{type : 'onclick',
 * 						 func : function,  
 * 						 eventIndex : ''  事件处理的优先级
 * 						 isEventTransparent : true 是否是事件透明的 true 允许事件传递
 * 						 fireEvent(x,y)  用来判断传入的坐标x，y能不能触发事件 是否触发事件的函数  返回true时触发
 * 						 unit 精确单位
 * 						}]   事件 
 * 			_queue : true 是否在队列中
 * 			_queueList : [{moveId,params}]队列数组
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

