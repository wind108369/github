/**
 * @author yangji01
 */

/**
 * 将方法加入到Expedition.fn.init.prototype中
 */

Expedition.fn.init.prototype ={
	dispose : Expedition.fn.dispose,
	show : Expedition.fn.show,
	hide : Expedition.fn.hide,
	setIndex : Expedition.fn.paint.setIndex ,
	
	//dom 相关
	dom : Expedition.fn.dom,
	g : Expedition.fn.g,
	setAttr : Expedition.fn.setAttr,
	setAttrs : Expedition.fn.setAttrs,
	getAttr : Expedition.fn.getAttr,
	trim : Expedition.fn.trim,
	addClass : Expedition.fn.addClass,
	removeClass : Expedition.fn.removeClass,
	setStyle : Expedition.fn.setStyle,
	setStyles : Expedition.fn.setStyles,
	q : Expedition.fn.q,
	getStyle : Expedition.fn.getStyle,
	inserHTML : Expedition.fn.inserHTML,
	
	//dom event
	on : Expedition.fn.event.on,
	un : Expedition.fn.event.un,
	
	//object 处理
	extend : Expedition.fn.object.extend,
	each : Expedition.fn.object.each,
	keys : Expedition.fn.object.keys,
	values : Expedition.fn.object.values,
	clone : Expedition.fn.object.clone,
	
	//浏览器判断
	browser: Expedition.fn._browser.getBrowser,
	isCanvasSupport : Expedition.fn._browser.isCanvasSupport,
	
	//canvas context
	canvas : Expedition.fn.paint.canvas,
	size : Expedition.fn.paint.size,
	context : Expedition.fn.paint.context,
	setContext : Expedition.fn.paint._setContext,
	
	line : Expedition.fn.paint.line,
	rect : Expedition.fn.paint.rect,
	clearRect : Expedition.fn.paint.clearRect,
	fillRect : Expedition.fn.paint.fillRect,
	strokeRect : Expedition.fn.paint.strokeRect,
	
	arc : Expedition.fn.paint.arc,
	hypotrochoid : Expedition.fn.paint.hypotrochoid,
	epitrochoid : Expedition.fn.paint.epitrochoid,
	epicycloid : Expedition.fn.paint.epicycloid,
	hypocycloid : Expedition.fn.paint.hypocycloid,
	
	save : Expedition.fn.paint.save,
	restore : Expedition.fn.paint.restore,
	translate : Expedition.fn.paint.translate,
	
	//路径相关
	beginPath : Expedition.fn.paint.beginPath,
	closePath : Expedition.fn.paint.closePath,
	fill : Expedition.fn.paint.fill,
	stroke : Expedition.fn.paint.stroke,
	clip : Expedition.fn.paint.clip,
	
	moveTo : Expedition.fn.paint.moveTo,
	lineTo : Expedition.fn.paint.lineTo,
	arcTo : Expedition.fn.paint.arcTo,
	bezierCurveTo : Expedition.fn.paint.bezierCurveTo,
	quadraticCurveTo : Expedition.fn.paint.quadraticCurveTo,
	
	customCurves : Expedition.fn.paint.customCurves,
	
	isPointInPath : Expedition.fn.paint.isPointInPath,
	
	//事件添加
	addEvent : Expedition.fn.event._addEvent,
	removeEvent : Expedition.fn.event._removeEvent,
	
	dblclick : Expedition.fn.event.dblclick,
	click : Expedition.fn.event.click,
	contextmenu : Expedition.fn.event.contextmenu,
	mousedown : Expedition.fn.event.mousedown,
	mousemove : Expedition.fn.event.mousemove,
	mouseover : Expedition.fn.event.mouseover,
	mouseup : Expedition.fn.event.mouseup,
	
	keydown : Expedition.fn.event.keydown,
	keypress : Expedition.fn.event.keypress,
	keyup : Expedition.fn.event.keyup,
	touchstart : Expedition.fn.event.touchstart,
	touchmove : Expedition.fn.event.touchmove,
	touchend : Expedition.fn.event.touchend,
	
	draggable : Expedition.fn.event.draggable,
	//是否在对象中
	isInObject : Expedition.fn.event._isInObject,
	
	//坐标转换
	spherical : Expedition.fn._lib.vector3d.spherical,
	transform2d : Expedition.fn._lib.vector3d.transform2d,
	
	//特殊处理
	heart : Expedition.fn.render.heart,
	flower : Expedition.fn.render.flower,
	ball : Expedition.fn.render.ball,
	stopBallLoop : Expedition.fn.render.stopBallLoop,
	cube : Expedition.fn.render.cube,
	stopCubeLoop : Expedition.fn.render.stopCubeLoop,
	
	//燃烧
	burn : Expedition.fn.render.burn,
	stopBurn : Expedition.fn.render.stopBurn,
	
	//图形处理
	getStrokeStyle : Expedition.fn.render.getStrokeStyle,
	setStrokeStyle : Expedition.fn.render.setStrokeStyle,
	getLineWidth : Expedition.fn.render.getLineWidth,
	setLineWidth : Expedition.fn.render.setLineWidth,
	getLineCap : Expedition.fn.render.getLineCap,
	setLineCap : Expedition.fn.render.setLineCap,
	getLineJoin : Expedition.fn.render.getLineJoin,
	
	setLineJoin : Expedition.fn.render.setLineJoin,
	getMiterLimit : Expedition.fn.render.getMiterLimit,
	setMiterLimit : Expedition.fn.render.setMiterLimit,
	getFillStyle : Expedition.fn.render.getFillStyle,
	setFillStyle : Expedition.fn.render.setFillStyle,
	getShadowBlur : Expedition.fn.render.getShadowBlur,
	
	setShadowBlur : Expedition.fn.render.setShadowBlur,
	getShadowColor : Expedition.fn.render.getShadowColor,
	setShadowColor : Expedition.fn.render.setShadowColor,
	getShadowOffsetX : Expedition.fn.render.getShadowOffsetX,
	setShadowOffsetX : Expedition.fn.render.setShadowOffsetX,
	
	getShadowOffsetY : Expedition.fn.render.getShadowOffsetY,
	setShadowOffsetY : Expedition.fn.render.setShadowOffsetY,
	getShadow : Expedition.fn.render.getShadow,
	setShadow : Expedition.fn.render.setShadow,
	getCompositeOperation : Expedition.fn.render.getCompositeOperation,
	setCompositeOperation : Expedition.fn.render.setCompositeOperation,
	
	rotate : Expedition.fn.render.rotate,
	scale : Expedition.fn.render.scale,
	createLinearGradient : Expedition.fn.render.createLinearGradient,
	createRadialGradient : Expedition.fn.render.createRadialGradient,
	addColorStop : Expedition.fn.render.addColorStop,
	getGradient : Expedition.fn.render.getGradient,
	randomRgba : Expedition.fn.render.randomRgba,
	
	//图片处理
	drawImage : Expedition.fn.image.drawImage,
	
	createImageData : Expedition.fn.image.createImageData,
	getImageData : Expedition.fn.image.getImageData,
	putImageData : Expedition.fn.image.putImageData,
	
	imageAntiColor : Expedition.fn.image.imageAntiColor,
	imagePixelate : Expedition.fn.image.imagePixelate,
	imagePixelParticle : Expedition.fn.image.imagePixelParticle,
	imageGrey : Expedition.fn.image.imageGrey,
	imageMosaics : Expedition.fn.image.imageMosaics,
	
	imageFilterRed : Expedition.fn.image.imageFilterRed,
	imageFilterGreen : Expedition.fn.image.imageFilterGreen,
	imageFilterBlue : Expedition.fn.image.imageFilterBlue,
	
	imageBlockRed : Expedition.fn.image.imageBlockRed,
	imageBlockGreen : Expedition.fn.image.imageBlockGreen,
	imageBlockBlue : Expedition.fn.image.imageBlockBlue,
	
	imageTransparent : Expedition.fn.image.imageTransparent,
	
	backgroundImage : Expedition.fn.image.backgroundImage,
	closeBackgroundImage : Expedition.fn.image.closeBackgroundImage,
	drawInside : Expedition.fn.image.drawInside,
	drawOutside : Expedition.fn.image.drawOutside,
	
	//视频处理
	drawVideo : Expedition.fn.video.drawVideo,
	stopVideo : Expedition.fn.video.stopVideo,
	
	videoAntiColor : Expedition.fn.video.videoAntiColor,
	stopVideoAntiColor : Expedition.fn.video.stopVideoAntiColor,
	
	videoGrey : Expedition.fn.video.videoGrey,
	stopVideoGrey : Expedition.fn.video.stopVideoGrey,
	
	videoFilterRed : Expedition.fn.video.videoFilterRed,
	stopVideoFilterRed : Expedition.fn.video.stopVideoFilterRed,
	
	videoFilterGreen : Expedition.fn.video.videoFilterGreen,
	stopVideoFilterGreen : Expedition.fn.video.stopVideoFilterGreen,
	
	videoFilterBlue : Expedition.fn.video.videoFilterBlue,
	stopVideoFilterBlue : Expedition.fn.video.stopVideoFilterBlue,
	
	videoBlockRed : Expedition.fn.video.videoBlockRed,
	stopVideoBlockRed : Expedition.fn.video.stopVideoBlockRed,
	
	videoBlockGreen : Expedition.fn.video.videoBlockGreen,
	stopVideoBlockGreen : Expedition.fn.video.stopVideoBlockGreen,
	
	videoBlockBlue : Expedition.fn.video.videoBlockBlue,
	stopVideoBlockBlue : Expedition.fn.video.stopVideoBlockBlue,
	
	videoTransparent : Expedition.fn.video.videoTransparent,
	stopVideoTransparent : Expedition.fn.video.stopVideoTransparent,
	
	videoPixelate : Expedition.fn.video.videoPixelate,
	stopVideoPixelate : Expedition.fn.video.stopVideoPixelate,
	
	videoPixelParticle : Expedition.fn.video.videoPixelParticle,
	stopVideoPixelParticle : Expedition.fn.video.stopVideoPixelParticle,
	
	videoMosaics : Expedition.fn.video.videoMosaics,
	stopVideoMosaics : Expedition.fn.video.stopVideoMosaics,
	
	backgroundVideo : Expedition.fn.video.backgroundVideo,
	closeBackgroundVideo : Expedition.fn.video.closeBackgroundVideo,
	
	//文字处理
	getFont : Expedition.fn.text.getFont,
	setFont : Expedition.fn.text.setFont,
	getTextAlign : Expedition.fn.text.getTextAlign,
	setTextAlign : Expedition.fn.text.setTextAlign,
	getTextBaseline : Expedition.fn.text.getTextBaseline,
	setTextBaseline : Expedition.fn.text.setTextBaseline,
	
	fillText : Expedition.fn.text.fillText,
	strokeText : Expedition.fn.text.strokeText,
	measureText : Expedition.fn.text.measureText,
	
	write : Expedition.fn.text.write,
	//运动
	addMove : Expedition.fn.move.addMove,
	pauseMove : Expedition.fn.move.pauseMove,
	runMove : Expedition.fn.move.runMove,
	cancelMove : Expedition.fn.move.cancelMove,
	
	uniLinMotion : Expedition.fn.move.uniLinMotion,
	accLinMotion : Expedition.fn.move.accLinMotion,
	cirMotion : Expedition.fn.move.cirMotion,
	parMotion : Expedition.fn.move.parMotion,
	sinMotion : Expedition.fn.move.sinMotion,
	
	hypMotion : Expedition.fn.move.hypMotion,
	epiMotion : Expedition.fn.move.epiMotion,
	htpocycMotion : Expedition.fn.move.htpocycMotion,
	epicycMotion : Expedition.fn.move.epicycMotion,
	
	//队列
	startQueue : Expedition.fn.queue.startQueue,
	stopQueue : Expedition.fn.queue.stopQueue,
	
	//对外接口
	expand : Expedition.fn.expand
};