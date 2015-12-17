/**
 * Expedition.queue
 * @author yangji01
 * version: 1.0
 * date: 2012.4.9
 */

Expedition.fn.queue = Expedition.fn.queue || {};

/**
 * 启用队列
 */
Expedition.fn.queue.startQueue = function(){
	this._queue = true;
	
	return this;
};

/**
 * 停止队列
 */
Expedition.fn.queue.stopQueue = function(){
	this._queue = false;
	
	return this;
}
