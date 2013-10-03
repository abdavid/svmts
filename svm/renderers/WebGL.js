var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Renderer) {
        var WebGL = (function (_super) {
            __extends(WebGL, _super);
            function WebGL(options) {
                console.time('CanvasRenderer::finished');

                options = _.extend(options, {
                    draw: this.onDraw
                });

                this.ss = options.ss || 45;
                this.density = options.density || 4.0;
                this.smo = options.smo;
                this.hasDrawn = false;

                _super.call(this, options);

                console.timeEnd('CanvasRenderer::finished');
            }
            WebGL.prototype.onDraw = function () {
                if (this.hasDrawn) {
                    return;
                }

                this.drawDecisionBackground();
                this.drawAxis();
                this.drawDataPoints();
                this.drawStatus();

                this.hasDrawn = true;
            };

            WebGL.prototype.drawDecisionBackground = function () {
                for (var x = 0.0; x <= this.width; x += this.density) {
                    for (var y = 0.0; y <= this.height; y += this.density) {
                        var vector = [
                            (x - this.width / 2) / this.ss,
                            (y - this.height / 2) / this.ss
                        ], decision = this.smo.machine.compute(vector);

                        if (decision > 0) {
                            this.ctx.fillStyle = 'rgb(150,250,150)';
                        } else {
                            this.ctx.fillStyle = 'rgb(250,150,150)';
                        }

                        this.ctx.fillRect(x - this.density / 2 - 1, y - this.density - 1, this.density + 2, this.density + 2);
                    }
                }
            };

            WebGL.prototype.drawAxis = function () {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgb(50,50,50)';
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(0, this.height / 2);
                this.ctx.lineTo(this.width, this.height / 2);
                this.ctx.moveTo(this.width / 2, 0);
                this.ctx.lineTo(this.width / 2, this.height);
                this.ctx.stroke();
            };

            WebGL.prototype.drawDataPoints = function () {
                this.ctx.strokeStyle = 'rgb(0,0,0)';

                for (var i = 0; i < this.smo.inputs.length; i++) {
                    if (this.smo.outputs[i] == 1) {
                        this.ctx.fillStyle = 'rgb(100,200,100)';
                    } else {
                        this.ctx.fillStyle = 'rgb(200,100,100)';
                    }

                    if (this.smo.alphaA[i] > 1e-2 || this.smo.alphaB[i] > 1e-2) {
                        this.ctx.lineWidth = 3;
                    } else {
                        this.ctx.lineWidth = 1;
                    }

                    var posX = this.smo.inputs[i][0] * this.ss + this.width / 2, posY = this.smo.inputs[i][1] * this.ss + this.height / 2, radius = Math.floor(3 + this.smo.alphaA[i] * 5.0 / this.smo.getComplexity());

                    this.drawCircle(posX, posY, radius);
                }

                if (this.smo.kernel instanceof LinearKernel) {
                    var xs = [-5, 5];
                    var ys = [0, 0];
                    ys[0] = (-this.smo.biasLower - this.smo.machine.weights[0] * xs[0]) / this.smo.machine.weights[1];
                    ys[1] = (-this.smo.biasLower - this.smo.machine.weights[0] * xs[1]) / this.smo.machine.weights[1];

                    this.ctx.fillStyle = 'rgb(0,0,0)';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();

                    this.ctx.moveTo(xs[0] * this.ss + this.width / 2, ys[0] * this.ss + this.height / 2);
                    this.ctx.lineTo(xs[1] * this.ss + this.width / 2, ys[1] * this.ss + this.height / 2);

                    this.ctx.moveTo(xs[0] * this.ss + this.width / 2, (ys[0] - 1.0 / this.smo.machine.weights[1]) * this.ss + this.height / 2);
                    this.ctx.lineTo(xs[1] * this.ss + this.width / 2, (ys[1] - 1.0 / this.smo.machine.weights[1]) * this.ss + this.height / 2);

                    this.ctx.moveTo(xs[0] * this.ss + this.width / 2, (ys[0] + 1.0 / this.smo.machine.weights[1]) * this.ss + this.height / 2);
                    this.ctx.lineTo(xs[1] * this.ss + this.width / 2, (ys[1] + 1.0 / this.smo.machine.weights[1]) * this.ss + this.height / 2);
                    this.ctx.stroke();

                    for (var i = 0; i < this.smo.inputs.length; i++) {
                        if (this.smo.alphaA[i] < 1e-2 || this.smo.alphaB[i] < 1e-2) {
                            continue;
                        }

                        if (this.smo.outputs[i] == 1) {
                            ys[0] = (1 - this.smo.biasLower - this.smo.machine.weights[0] * xs[0]) / this.smo.machine.weights[1];
                            ys[1] = (1 - this.smo.biasLower - this.smo.machine.weights[0] * xs[1]) / this.smo.machine.weights[1];
                        } else {
                            ys[0] = (-1 - this.smo.biasLower - this.smo.machine.weights[0] * xs[0]) / this.smo.machine.weights[1];
                            ys[1] = (-1 - this.smo.biasLower - this.smo.machine.weights[0] * xs[1]) / this.smo.machine.weights[1];
                        }

                        var u = (this.smo.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (this.smo.inputs[i][1] - ys[0]) * (ys[1] - ys[0]) / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1])), xi = xs[0] + u * (xs[1] - xs[0]), yi = ys[0] + u * (ys[1] - ys[0]), mX = this.smo.inputs[i][0] * this.ss + this.width / 2, mY = this.smo.inputs[i][1] * this.ss + this.height / 2, lX = xi * this.ss + this.width / 2, lY = yi * this.ss + this.height / 2;

                        this.ctx.moveTo(mX, mY);

                        this.ctx.lineTo(lX, lY);
                    }

                    this.ctx.stroke();
                }
            };

            WebGL.prototype.drawStatus = function () {
                this.ctx.fillStyle = 'rgb(0,0,0)';

                var numsupp = 0;
                for (var i = 0; i < this.smo.inputs.length; i++) {
                    if (this.smo.alphaA[i] > 1e-5 || this.smo.alphaB[i] > 1e-5) {
                        numsupp++;
                    }
                }

                this.ctx.fillText("Number of support vectors: " + numsupp + " / " + this.smo.inputs.length, 10, this.height - 50);

                if (this.smo.kernel instanceof GaussianKernel) {
                    this.ctx.fillText("Using Rbf kernel with _sigma = " + this.smo.kernel.sigma().toPrecision(2), 10, this.height - 70);
                } else {
                    this.ctx.fillText("Using " + this.smo.kernel.constructor.name, 10, this.height - 70);
                }

                this.ctx.fillText("C = " + this.smo.getComplexity().toPrecision(2), 10, this.height - 90);
            };
            return WebGL;
        })(SVM.Renderer.Engine);
        Renderer.WebGL = WebGL;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=WebGL.js.map
