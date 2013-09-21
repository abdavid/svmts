var RendererDraw;
(function (RendererDraw) {
    RendererDraw[RendererDraw["init"] = 1] = "init";
    RendererDraw[RendererDraw["drawn"] = 2] = "drawn";
    RendererDraw[RendererDraw["redraw"] = 3] = "redraw";
})(RendererDraw || (RendererDraw = {}));

var SVM;
(function (SVM) {
    (function (Renderer) {
        var engine = (function () {
            function engine(options) {
                var noop = function () {
                };

                this.canvas = options.canvas;
                this.ctx = options.canvas.getContext('2d');
                this.width = options.width;
                this.height = options.height;

                if (this.ctx) {
                    this.ctx.canvas.width = this.width;
                    this.ctx.canvas.height = this.height;
                }

                this.keyUp = options.keyUp || noop;
                this.keyDown = options.keyDown || noop;
                this.mouseClick = options.mouseClick || noop;
                this.update = options.update || false;
                this.draw = options.draw || false;
                this.drawOnce = options.drawOnce || RendererDraw.redraw;

                var date = new Date();
                this.lastRedraw = date.getTime();

                this.canvas.style.position = 'absolute';
                this.canvas.style.left = '0px';
                this.canvas.style.top = '0px';

                this.initEvents();
            }
            engine.prototype.render = function () {
                var _this = this;
                window.requestAnimationFrame(function () {
                    return _this.tick();
                });
            };

            engine.prototype.drawBubble = function (x, y, w, h, radius) {
                var r = x + w, b = y + h;

                this.ctx.beginPath();
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(x + radius, y);
                this.ctx.lineTo(x + radius / 2, y - 10);
                this.ctx.lineTo(x + radius * 2, y);
                this.ctx.lineTo(r - radius, y);
                this.ctx.quadraticCurveTo(r, y, r, y + radius);
                this.ctx.lineTo(r, y + h - radius);
                this.ctx.quadraticCurveTo(r, b, r - radius, b);
                this.ctx.lineTo(x + radius, b);
                this.ctx.quadraticCurveTo(x, b, x, b - radius);
                this.ctx.lineTo(x, y + radius);
                this.ctx.quadraticCurveTo(x, y, x + radius, y);
                this.ctx.stroke();
            };

            engine.prototype.drawRect = function (x, y, w, h) {
                this.ctx.beginPath();
                this.ctx.rect(x, y, w, h);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            };

            engine.prototype.drawCircle = function (x, y, r) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            };

            engine.prototype.eventClick = function (e) {
                var x, y;

                if (e.pageX || e.pageY) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }

                x -= this.canvas.offsetLeft;
                y -= this.canvas.offsetTop;

                this.mouseClick(x, y, e.shiftKey);
            };

            engine.prototype.randi = function (s, e) {
                return Math.floor(Math.random() * (e - s) + s);
            };

            engine.prototype.randf = function (s, e) {
                return Math.random() * (e - s) + s;
            };

            engine.prototype.randn = function (mean, variance) {
                var V1, V2, S, X;
                do {
                    var U1 = Math.random();
                    var U2 = Math.random();
                    V1 = 2 * U1 - 1;
                    V2 = 2 * U2 - 1;
                    S = V1 * V1 + V2 * V2;
                } while(S > 1);
                X = Math.sqrt(-2 * Math.log(S) / S) * V1;
                X = mean + Math.sqrt(variance) * X;
                return X;
            };

            engine.prototype.eventKeyUp = function (e) {
                var keycode = ('which' in e) ? e.which : e.keyCode;
                this.keyUp(keycode);
            };

            engine.prototype.eventKeyDown = function (e) {
                var keycode = ('which' in e) ? e.which : e.keyCode;
                this.keyDown(keycode);
            };

            engine.prototype.initEvents = function () {
                var _this = this;
                this.canvas.addEventListener('click', function (event) {
                    return _this.eventClick;
                }, false);
                document.addEventListener('keyup', function (event) {
                    return _this.eventKeyUp;
                }, true);
                document.addEventListener('keydown', function (event) {
                    return _this.eventKeyDown;
                }, true);
            };

            engine.prototype.tick = function () {
                var _this = this;
                var delta = (new Date().getTime() - this.lastRedraw) / 1000;

                this.lastRedraw = new Date().getTime();

                if (this.drawOnce === RendererDraw.init || this.drawOnce === RendererDraw.redraw) {
                    window.requestAnimationFrame(function () {
                        return _this.tick();
                    });

                    if (this.drawOnce === RendererDraw.init) {
                        this.drawOnce = RendererDraw.drawn;
                    }
                }

                SVM.Renderer.engine.FPS = 1 / delta;

                if (this.update) {
                    this.update.call(this);
                }

                if (this.draw) {
                    this.draw.call(this);
                }
            };
            return engine;
        })();
        Renderer.engine = engine;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Renderer.js.map
