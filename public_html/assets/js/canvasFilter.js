(function () {
//https://www.html5rocks.com/en/tutorials/canvas/imagefilters/


    window.canvasFilter = {};
    canvasFilter.objects = {};
    canvasFilter.range = null;
    canvasFilter.objects.canvas = null;

    canvasFilter.mouse = {
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        down: false
    };  

    canvasFilter.fx = {
        filter: null,
        filterOption: null,
        src: null
    };

    canvasFilter.image = {};
    canvasFilter.styles = {};
    canvasFilter.filters = {};
    canvasFilter.ctx = null;
    canvasFilter.init = function (cfg) {
        this.objects.canvas = helper.q(cfg.canvas);        
        this.objects.canvas.width = cfg.width;
        this.objects.canvas.height = cfg.height;
        this.objects.canvas.style.width = cfg.width + 'px';
        this.objects.canvas.style.height = cfg.height + 'px';
        this.range=helper.q('[data-filter="range"]');
        this.ctx = this.objects.canvas.getContext('2d');
//        this.ctx.translate(-0.5, -0.5);
        this.initMouse();
    };

    canvasFilter.initMouse = function () {
        canvasFilter.objects.canvas.addEventListener('mousemove', canvasFilter.setMousePosition);
        canvasFilter.objects.canvas.addEventListener('mousemove', canvasFilter.paint);
        canvasFilter.objects.canvas.addEventListener('mousedown', canvasFilter.setMouseDown);
        canvasFilter.objects.canvas.addEventListener('mouseup', canvasFilter.setMouseUp);
        canvasFilter.range.addEventListener('change', canvasFilter.setMouseDimensions);
    };

    canvasFilter.setMouseDown = function () {
        canvasFilter.mouse.down = true;
    };

    canvasFilter.setMouseUp = function () {
        canvasFilter.mouse.down = false;
    };
    

    canvasFilter.setMousePosition = function (e) {
        canvasFilter.mouse.x = e.offsetX;
        canvasFilter.mouse.y = e.offsetY;
    };
    canvasFilter.setMouseDimensions = function(){
        var val=this.range.value;
        this.mouse.h = val;
        this.mouse.w = val;
    }

    canvasFilter.setFx = function () {
        if (canvasFilter.fx.src !== null) {
            canvasFilter.fx.src.classList.remove('active');
        }
        canvasFilter.fx.filter = this.getAttribute('data-filter');
        canvasFilter.fx.filterOption = this.getAttribute('data-filter-option');
        canvasFilter.fx.src = this;

        canvasFilter.fx.src.classList.add('active');
    };

    canvasFilter.setBtnActive = function () {
        var el = helper.q('.active');
        if (el !== null) {
            el.classList.remove('active');
        }
        this.classList.add('active');
    };

    canvasFilter.paint = function () {
        var imgData, x, y;
        var cf = canvasFilter;
        var m = cf.mouse;
        var fx = cf.fx;
        if (fx.filter === null || cf.mouse.down === false)
            return false;
        //Berechnung Mauszeiger in der Mitte der Pinselfläche
        x = m.x - m.w / 2;
        y = m.y - m.h / 2;

        imgData = cf.getPixel(x, y, m.w, m.h);//canvasFilter.mouse
        imgData = cf.filters[fx.filter](imgData, fx.filterOption);//canvasFilter.fx
        cf.setPixel(imgData, x, y);//canvasFilter.mouse
    };

    canvasFilter.filters.reset = function () {
        canvasFilter.ctx.drawImage(canvasFilter.image, 0, 0);
    };

    canvasFilter.filters.brightness = function (arg, opt) {
        var i, max;
        opt = parseInt(opt);
        for (i = 0, max = arg.data.length; i < max; i += 4) {
            arg.data[i] += opt;
            arg.data[i + 1] += opt;
            arg.data[i + 2] += opt;
        }
        return arg;
    };

    canvasFilter.filters.noise = function (arg) {
        var i, max, factor = 2, rand;
        for (i = 0, max = arg.data.length; i < max; i += 4) {
            rand = (0.5 - Math.random() * factor);
            arg.data[i] += rand;
            arg.data[i + 1] += rand;
            arg.data[i + 2] += rand;
        }
        return arg;
    };

    canvasFilter.filters.sepia = function (arg) {
        var i, max, r, g, b;
        for (i = 0, max = arg.data.length; i < max; i += 4) {

            r = arg.data[i];
            g = arg.data[i + 1];
            b = arg.data[i + 2];

            arg.data[i] = r * 0.393 + g * 0.769 + b * 0.189;
            arg.data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
            arg.data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
        }
        return arg;
    };

    canvasFilter.filters.invert = function (arg) {
        var i, max;
        for (i = 0, max = arg.data.length; i < max; i += 4) {
            arg.data[i] = 255 - arg.data[i];
            arg.data[i + 1] = 255 - arg.data[i + 1];
            arg.data[i + 2] = 255 - arg.data[i + 2];
        }
        return arg;
    };

    canvasFilter.filters.grey = function (imgData) {
        var i, max, r, g, b, grey;
        for (i = 0, max = imgData.data.length; i < max; i += 4) {
            r = imgData.data[i];
            g = imgData.data[i + 1];
            b = imgData.data[i + 2];
            grey = (r + g + b) / 3;
            imgData.data[i] = grey;
            imgData.data[i + 1] = grey;
            imgData.data[i + 2] = grey;
        }
        return imgData;
    };

    canvasFilter.filters.luma = function (arg) {
        var i, max, luma;
        for (i = 0, max = arg.data.length; i < max; i += 4) {

            luma = 0.2126 * arg.data[i] + 0.7152 * arg.data[i + 1] + 0.0722 * arg.data[i + 2];

            arg.data[i] = luma;
            arg.data[i + 1] = luma;
            arg.data[i + 2] = luma;
        }
        return arg;
    };

    canvasFilter.setImage = function (path, x, y) {
        var _this = this; // _ = this    $ = this
        this.image = new Image();
        this.image.src = path;
        this.image.onload = function () {
            _this.ctx.drawImage(_this.image, x, y);
        };
    };
    canvasFilter.getPixel = function (x, y, w, h) {
        return this.ctx.getImageData(x, y, w, h);
    };
    canvasFilter.setPixel = function (imgData, x, y) {
        this.ctx.putImageData(imgData, x, y);
    };
})();

