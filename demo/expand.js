/**
 * Expedition.expand
 * @author yangji01
 * date 2012.3.26
 */

Expedition.fn.expand = function(name,func){
	Expedition.fn.init.prototype[name] = func;
};