/**
 * @author yangji01
 */
/**
 * @author yangji01
 */
(function($){
    function Vector(x, y){
        this.x = x;
        this.y = y;
    };
    Vector.prototype = {
        rotate: function(theta){
            var x = this.x;
            var y = this.y;
            this.x = Math.cos(theta) * x - Math.sin(theta) * y;
            this.y = Math.sin(theta) * x + Math.cos(theta) * y;
            return this;
        },
        mult: function(f){
            this.x *= f;
            this.y *= f;
            return this;
        },
        clone: function(){
            return new Vector(this.x, this.y);
        },
        length: function(){
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        subtract: function(v){
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        set: function(x, y){
            this.x = x;
            this.y = y;
            return this;
        }
    };
    function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom){
        this.stretchA = stretchA;
        this.stretchB = stretchB;
        this.startAngle = startAngle;
        this.angle = angle;
        this.bloom = bloom;
        this.growFactor = growFactor;
        this.r = 1;
        this.isfinished = false;
        //this.tanAngleA = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
        //this.tanAngleB = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
    }
    Petal.prototype = {
        draw: function(){
            var ctx = this.bloom.garden.ctx;
            var v1, v2, v3, v4;
            v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
            v2 = v1.clone().rotate(Garden.degrad(this.angle));
            v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
            v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
            ctx.strokeStyle = this.bloom.c;
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
            ctx.stroke();
        },
        render: function(){
            if (this.r <=
            this.bloom.r) {
                this.r += this.growFactor; // / 10;
                this.draw();
            }
            else {
                this.isfinished = true;
            }
        }
    }
    function Bloom(p, r, c, pc, garden){
        this.p = p;
        this.r = r;
        this.c = c;
        this.pc = pc;
        this.petals = [];
        this.garden = garden;
        this.init();
        this.garden.addBloom(this);
    }
    Bloom.prototype = {
        draw: function(){
            var p, isfinished = true;
            this.garden.ctx.save();
            this.garden.ctx.translate(this.p.x, this.p.y);
            for (var i = 0; i <
            this.petals.length; i++) {
                p = this.petals[i];
                p.render();
                isfinished *= p.isfinished;
            }
            this.garden.ctx.restore();
            if (isfinished == true) {
                this.garden.removeBloom(this);
            }
        },
        init: function(){
            var angle = 360 / this.pc;
            var startAngle = Garden.randomInt(0, 90);
            for (var i = 0; i <
            this.pc; i++) {
                this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), startAngle + i * angle, angle, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this));
            }
        }
    }
    function Garden(ctx, element){
        this.blooms = [];
        this.element = element;
        this.ctx = ctx;
    }
    Garden.prototype = {
        render: function(){
            for (var i = 0; i <
            this.blooms.length; i++) {
                this.blooms[i].draw();
            }
        },
        addBloom: function(b){
            this.blooms.push(b);
        },
        removeBloom: function(b){
            var bloom;
            for (var i = 0; i <
            this.blooms.length; i++) {
                bloom = this.blooms[i];
                if (bloom === b) {
                    this.blooms.splice(i, 1);
                    return this;
                }
            }
        },
        createRandomBloom: function(x, y){
            this.createBloom(x, y, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max));
        },
        createBloom: function(x, y, r, c, pc){
            new Bloom(new Vector(x, y), r, c, pc, this);
        },
        clear: function(){
            this.blooms = [];
            this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        }
    }
    Garden.options = {
        petalCount: {
            min: 5,
            max: 15
        },
        petalStretch: {
            min: 0.1,
            max: 3
        },
        growFactor: {
            min: 0.1,
            max: 1
        },
        bloomRadius: {
            min: 5,
            max: 20
        },
        density: 10,
        growSpeed: 1000 / 60,
        color: {
            min: 0,
            max: 255,
            opacity: 0.5
        },
        tanAngle: 90
    };
    Garden.random = function(min, max){
        return Math.random() * (max - min) + min;
    };
    Garden.randomInt = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Garden.circle = 2 * Math.PI;
    Garden.degrad = function(angle){
        return Garden.circle / 360 * angle;
    };
    Garden.raddeg = function(angle){
        return angle / Garden.circle * 360;
    };
    Garden.rgba = function(r, g, b, a){
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    };
    Garden.randomrgba = function(min, max, a){
        return Garden.rgba(Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), Math.round(Garden.random(min, max)), a);
    };
    Garden.previewColor = "rgba(127,127,127,0.4)";
    $(function(){
        function renderPreview(caller){
            clearInterval(previewInterval);
            previewInterval = setInterval(function(){
                preview.render();
            }, 1);
            preview.clear();
            var $caller = $(caller);
            var id = $caller.attr("id");
            $previewArea.css({
                top: 50,
                left: $caller.position().left - 40
            }, 100).fadeIn("slow");
        }
        function previewBloomRadius(){
            $lblPreview.html("Size [left: min, right: max]");
            preview.createBloom(80, 100, Garden.options.bloomRadius.min, Garden.previewColor, Garden.options.petalCount.min);
            preview.createBloom(220, 100, Garden.options.bloomRadius.max, Garden.previewColor, Garden.options.petalCount.max);
        }
        function previewPetalCount(){
            $lblPreview.text("Petals [left: min, right: max]");
            preview.createBloom(80, 100, 30, Garden.previewColor, Garden.options.petalCount.min);
            preview.createBloom(220, 100, 30, Garden.previewColor, Garden.options.petalCount.max);
        }
        function previewPetalStretch(){
            $lblPreview.text("Bezier stretch factor");
            preview.createBloom(80, 100, 30, Garden.previewColor, Garden.options.petalCount.min);
            preview.createBloom(220, 100, 30, Garden.previewColor, Garden.options.petalCount.max);
        }
        function previewColor(){
            $lblPreview.text("Color variability");
            for (var i = 1; i <
            5; i++) {
                for (var j = 1; j <
                4; j++) {
                    preview.createBloom(i * 60, j * 50, 20, Garden.randomrgba(Garden.options.color.min, Garden.options.color.max, Garden.options.color.opacity), Garden.random(Garden.options.petalCount.min, Garden.options.petalCount.max));
                }
            }
        }
        function onChangeBloomRadius(v, caller){
            saveValues("bloomRadius", v);
            renderPreview(caller);
            previewBloomRadius();
        }
        function onChangePetalCount(v, caller){
            saveValues("petalCount", v);
            renderPreview(caller);
            previewPetalCount();
        }
        function onChangePetalStretch(v, caller){
            saveValues("petalStretch", v);
            renderPreview(caller);
            previewPetalStretch();
        }
        function onChangeColor(v, caller){
            saveValues("color", v);
            renderPreview(caller);
            previewColor();
        }
        function saveValues(name, values){
            Garden.options[name].min = values[0];
            Garden.options[name].max = values[1];
        }
        // variables
        var mousePressed = false, lastPos = new Vector(0, 0), actualPos = new Vector(0, 0), $window = $(window), $lblPreview = $("#lblPreview");
        // garden
        var gardenCtx, gardenCanvas, $garden, garden, previewInterval;
        // preview
        var previewCtx, previewCanvas, $preview, preview, $previewArea;
        // saveCanvas
        var saveCtx, saveCanvas;
        // setup save
        saveCanvas = $("#save")[0];
        saveCanvas.width = $window.width();
        saveCanvas.height = $window.height();
        saveCtx = saveCanvas.getContext("2d");
        saveCtx.globalCompositeOperation = "lighter";
        // setup garden
        $garden = $("#garden");
        gardenCanvas = $garden[0];
        gardenCanvas.width = $window.width();
        gardenCanvas.height = $window.height() - 20;
        gardenCtx = gardenCanvas.getContext("2d");
        gardenCtx.globalCompositeOperation = "lighter";
        garden = new Garden(gardenCtx, gardenCanvas);
        // setup preview
        $preview = $("#preview");
        $previewArea = $("#previewArea");
        previewCanvas = $preview[0];
        previewCtx = previewCanvas.getContext("2d");
        previewCtx.globalCompositeOperation = "lighter";
        preview = new Garden(previewCtx, previewCanvas);
        // renderLoop
        setInterval(function(){
            garden.render();
        }, Garden.options.growSpeed);
        // sliders
        $("#sliderBloomRadius").slider({
            range: true,
            min: 3,
            max: 40,
            values: [5, 20],
            start: function(e, ui){
                onChangeBloomRadius(ui.values, this);
            },
            slide: function(e, ui){
                onChangeBloomRadius(ui.values, this);
            }
        });
        $("#sliderPetalCount").slider({
            range: true,
            min: 3,
            max: 25,
            values: [5, 15],
            start: function(e, ui){
                onChangePetalCount(ui.values, this);
            },
            slide: function(e, ui){
                onChangePetalCount(ui.values, this);
            }
        });
        $("#sliderPetalStretch").slider({
            range: true,
            min: 0.2,
            max: 5,
            values: [0.1, 3],
            start: function(e, ui){
                onChangePetalStretch(ui.values, this);
            },
            slide: function(e, ui){
                onChangePetalStretch(ui.values, this);
            }
        });
        $("#sliderColor").slider({
            range: true,
            min: 0,
            max: 255,
            values: [0, 255],
            start: function(e, ui){
                onChangeColor(ui.values, this);
            },
            slide: function(e, ui){
                onChangeColor(ui.values, this);
            }
        });
        // events
        $garden.bind("mouseover", function(e){
            clearInterval(previewInterval);
            $previewArea.fadeOut("slow");
        });
        //$(".label").bind("mouseover", function (e) {
        // clearInterval(previewInterval);
        // $previewArea.fadeOut("slow");
        //});
        $garden.bind("mousedown", function(e){
            e.preventDefault();
            var x = e.clientX;
            var y = e.clientY - 30;
            mousePressed = true;
            garden.createRandomBloom(x, y);
        });
        $garden.bind("mouseup", function(e){
            mousePressed = false;
        });
        $garden.bind("mousemove", function(e){
            var x = e.clientX;
            var y = e.clientY - 30;
            var l = actualPos.set(x, y).subtract(lastPos).length();
            if (mousePressed && l > (Garden.options.bloomRadius.max)) {
                garden.createRandomBloom(x, y);
                lastPos.set(x, y);
            }
        });
        $("#btnClear").click(function(e){
            garden.clear();
        });
        $("#btnSave").click(function(e){
            saveCtx.fillStyle = '#000000';
            saveCtx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
            saveCtx.drawImage(gardenCanvas, 0, 0);
            window.open(saveCanvas.toDataURL('image/png'), 'FlowerPowerImage');
        });
        // Welcome screen
        $("#welcomeScreen").css({
            top: $window.height() - 100,
            left: $window.width() / 2 - 300
        }).fadeIn("slow");
        $("body").bind("click", function(e){
            $("#welcomeScreen").fadeOut("slow");
            $(this).unbind("click");
        });
        // About
        $("#btnAbout").toggle(function(e){
            $("#aboutScreen").css({
                width: $("#configArea div.label:first").width() - 20,
                left: 10,
                top: 25
            }).fadeIn("slow");
        }, function(e){
            $("#aboutScreen").fadeOut("slow");
        });
    });
})(jQuery);
