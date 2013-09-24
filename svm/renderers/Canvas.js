var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Renderer) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(options) {
                var canvas = document.createElement('canvas');

                options = _.extend(options, {
                    draw: this.onDraw,
                    canvas: canvas
                });

                _super.call(this, options);

                $('body').append(canvas);

                this.hasDrawn = false;
                this.scaleFactor = options.scaleFactor || 50.0;
                this.density = options.density || 4.0;

                this.ctx.clearRect(0, 0, this.width, this.height);
            }
            Canvas.prototype.onDraw = function () {
                if (this.hasDrawn) {
                    return;
                }

                this.hasDrawn = true;
            };

            Canvas.prototype.drawBackground = function (matrix, colour) {
                if (typeof colour === "undefined") { colour = 'rgb(250,150,150)'; }
                var _this = this;
                this.ctx.fillStyle = colour;

                matrix.forEach(function (V) {
                    _this.ctx.fillRect(V[0], V[1], _this.density + 2, _this.density + 2);
                });

                return this;
            };

            Canvas.prototype.drawAxis = function () {
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'rgb(50,50,50)';
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(0, this.height / 2);
                this.ctx.lineTo(this.width, this.height / 2);
                this.ctx.moveTo(this.width / 2, 0);
                this.ctx.lineTo(this.width / 2, this.height);
                this.ctx.stroke();
                return this;
            };

            Canvas.prototype.drawDataPoints = function (smo) {
                this.ctx.strokeStyle = 'rgb(0,0,0)';

                for (var i = 0; i < smo.inputs.length; i++) {
                    if (smo.outputs[i] == 1) {
                        this.ctx.fillStyle = 'rgb(100,200,100)';
                    } else {
                        this.ctx.fillStyle = 'rgb(200,100,100)';
                    }

                    if (smo.alphaA[i] > 1e-2 || smo.alphaB[i] > 1e-2) {
                        this.ctx.lineWidth = 3;
                    } else {
                        this.ctx.lineWidth = 1;
                    }

                    var posX = smo.inputs[i][0] * this.scaleFactor + (this.width / 2), posY = smo.inputs[i][1] * this.scaleFactor + (this.height / 2), radius = Math.floor(3 + smo.alphaA[i] * 5.0 / smo.getComplexity());

                    this.drawCircle(posX, posY, radius);
                }

                return this;
            };

            Canvas.prototype.drawDecisionBoundaryAndMarginLines = function (smo) {
                var xs = [-5, 5];
                var ys = [0, 0];
                ys[0] = (-smo.biasLower - smo.machine.getWeight(0) * xs[0]) / smo.machine.getWeight(1);
                ys[1] = (-smo.biasLower - smo.machine.getWeight(0) * xs[1]) / smo.machine.getWeight(1);

                this.ctx.fillStyle = 'rgb(0,0,0)';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();

                this.ctx.moveTo(xs[0], ys[0]);
                this.ctx.lineTo(xs[1], ys[1]);

                this.ctx.moveTo(xs[0], (ys[0] - 1.0 / smo.machine.getWeight(1)));
                this.ctx.lineTo(xs[1], (ys[1] - 1.0 / smo.machine.getWeight(1)));

                this.ctx.moveTo(xs[0], (ys[0] + 1.0 / smo.machine.getWeight(1)));
                this.ctx.lineTo(xs[1], (ys[1] + 1.0 / smo.machine.getWeight(1)));
                this.ctx.stroke();

                for (var i = 0; i < smo.inputs.length; i++) {
                    if (smo.alphaA[i] < 1e-2 || smo.alphaB[i] < 1e-2) {
                        continue;
                    }

                    if (smo.outputs[i] == 1) {
                        ys[0] = (1 - smo.biasLower - smo.machine.getWeight(0) * xs[0]) / smo.machine.getWeight(1);
                        ys[1] = (1 - smo.biasLower - smo.machine.getWeight(0) * xs[1]) / smo.machine.getWeight(1);
                    } else {
                        ys[0] = (-1 - smo.biasLower - smo.machine.getWeight(0) * xs[0]) / smo.machine.getWeight(1);
                        ys[1] = (-1 - smo.biasLower - smo.machine.getWeight(0) * xs[1]) / smo.machine.getWeight(1);
                    }

                    var u = (smo.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (smo.inputs[i][1] - ys[0]) * (ys[1] - ys[0]) / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1])), xi = xs[0] + u * (xs[1] - xs[0]), yi = ys[0] + u * (ys[1] - ys[0]), mX = smo.inputs[i][0], mY = smo.inputs[i][1], lX = xi, lY = yi;

                    this.ctx.moveTo(mX, mY);

                    this.ctx.lineTo(lX, lY);
                }

                this.ctx.stroke();
                return this;
            };

            Canvas.prototype.drawStatus = function (smo) {
                this.ctx.fillStyle = 'rgb(0,0,0)';

                var numsupp = 0;
                for (var i = 0; i < smo.inputs.length; i++) {
                    if (smo.alphaA[i] > 1e-5 || smo.alphaB[i] > 1e-5) {
                        numsupp++;
                    }
                }

                this.ctx.fillText("Number of support vectors: " + numsupp + " / " + smo.inputs.length, 10, this.height - 50);

                if (smo.kernel instanceof SVM.Kernels.GaussianKernel) {
                    this.ctx.fillText("Using Rbf kernel with sigma = " + smo.kernel.sigma().toPrecision(2), 10, this.height - 70);
                } else {
                    this.ctx.fillText("Using " + smo.kernel.constructor.name, 10, this.height - 70);
                }

                this.ctx.fillText("C = " + smo.getComplexity().toPrecision(2), 10, this.height - 90);

                return this;
            };

            Canvas.prototype.render = function () {
                _super.prototype.render.call(this);

                return this;
            };
            return Canvas;
        })(SVM.Renderer.Engine);
        Renderer.Canvas = Canvas;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Canvas.js.map
