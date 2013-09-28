var SVM;
(function (SVM) {
    (function (Renderer) {
        var Canvas = (function () {
            function Canvas(teacher) {
                this.canvas = document.createElement('canvas');
                this.canvas.height = SVM.Renderer.getHeight();
                this.canvas.width = SVM.Renderer.getWidth();

                document.body.appendChild(this.canvas);

                this.context = this.canvas.getContext('2d');

                this.teacher = teacher;
            }
            Canvas.prototype.render = function () {
                this.clearCanvas();

                var resultsA = [], resultsB = [];
                for (var x = 0.0; x <= SVM.Renderer.getWidth(); x += SVM.Renderer.getDensity()) {
                    for (var y = 0.0; y <= SVM.Renderer.getHeight(); y += SVM.Renderer.getDensity()) {
                        var vector = [
                            (x - SVM.Renderer.getWidth() / 2) / SVM.Renderer.getScale(),
                            (y - SVM.Renderer.getHeight() / 2) / SVM.Renderer.getScale()
                        ], decision = this.teacher.machine.compute(vector);

                        if (decision > 0) {
                            resultsA.push(vector);
                        } else {
                            resultsB.push(vector);
                        }
                    }
                }

                this.drawBackground(resultsA, 'rgb(150,250,150)').drawBackground(resultsB, 'rgb(250,150,150)').drawDataPoints().drawAxis().drawStatus();

                return this;
            };

            Canvas.prototype.drawBackground = function (matrix, color) {
                var _this = this;
                matrix.forEach(function (V, i) {
                    _this.context.fillStyle = color;

                    _this.drawRect(V[0] * SVM.Renderer.getScale() + (SVM.Renderer.getWidth() / 2), V[1] * SVM.Renderer.getScale() + (SVM.Renderer.getHeight() / 2), 2 + SVM.Renderer.getDensity(), 2 + SVM.Renderer.getDensity());
                });

                return this;
            };

            Canvas.prototype.drawAxis = function () {
                this.context.beginPath();
                this.context.strokeStyle = 'rgb(50,50,50)';
                this.context.lineWidth = 1;
                this.context.moveTo(0, SVM.Renderer.getHeight() / 2);
                this.context.lineTo(SVM.Renderer.getWidth(), SVM.Renderer.getHeight() / 2);
                this.context.moveTo(SVM.Renderer.getWidth() / 2, 0);
                this.context.lineTo(SVM.Renderer.getWidth() / 2, SVM.Renderer.getHeight());
                this.context.stroke();

                return this;
            };

            Canvas.prototype.drawDataPoints = function () {
                this.context.strokeStyle = 'rgb(0,0,0)';

                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.outputs[i] == 1) {
                        this.context.fillStyle = 'rgb(100,200,100)';
                    } else {
                        this.context.fillStyle = 'rgb(200,100,100)';
                    }

                    if (this.teacher.alphaA[i] > 1e-2 || this.teacher.alphaB[i] > 1e-2) {
                        this.context.lineWidth = 3;
                    } else {
                        this.context.lineWidth = 1;
                    }

                    var posX = this.teacher.inputs[i][0] * SVM.Renderer.getScale() + (SVM.Renderer.getWidth() / 2), posY = this.teacher.inputs[i][1] * SVM.Renderer.getScale() + (SVM.Renderer.getHeight() / 2), radius = Math.floor(3 + (this.teacher.alphaA[i] + this.teacher.alphaB[i]) * 5.0 / this.teacher.getComplexity());

                    this.drawCircle(posX, posY, radius);
                }

                return this;
            };

            Canvas.prototype.drawMargin = function () {
                var xs = [-5, 5], ys = [0, 0];

                ys[0] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                ys[1] = (-this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);

                this.context.fillStyle = 'rgb(0,0,0)';
                this.context.lineWidth = 1;
                this.context.beginPath();

                this.context.moveTo(xs[0], ys[0]);
                this.context.lineTo(xs[1], ys[1]);

                this.context.moveTo(xs[0], (ys[0] - 1.0 / this.teacher.machine.getWeight(1)));
                this.context.lineTo(xs[1], (ys[1] - 1.0 / this.teacher.machine.getWeight(1)));

                this.context.moveTo(xs[0], (ys[0] + 1.0 / this.teacher.machine.getWeight(1)));
                this.context.lineTo(xs[1], (ys[1] + 1.0 / this.teacher.machine.getWeight(1)));
                this.context.stroke();

                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.alphaA[i] < 1e-2 || this.teacher.alphaB[i] < 1e-2) {
                        continue;
                    }

                    if (this.teacher.outputs[i] == 1) {
                        ys[0] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                        ys[1] = (1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                    } else {
                        ys[0] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[0]) / this.teacher.machine.getWeight(1);
                        ys[1] = (-1 - this.teacher.biasLower - this.teacher.machine.getWeight(0) * xs[1]) / this.teacher.machine.getWeight(1);
                    }

                    var u = (this.teacher.inputs[i][0] - xs[0]) * (xs[1] - xs[0]) + (this.teacher.inputs[i][1] - ys[0]) * (ys[1] - ys[0]) / ((xs[0] - xs[1]) * (xs[0] - xs[1]) + (ys[0] - ys[1]) * (ys[0] - ys[1])), xi = xs[0] + u * (xs[1] - xs[0]), yi = ys[0] + u * (ys[1] - ys[0]), mX = this.teacher.inputs[i][0], mY = this.teacher.inputs[i][1];

                    this.context.moveTo(mX, mY);
                    this.context.lineTo(xi, yi);
                }

                this.context.stroke();

                return this;
            };

            Canvas.prototype.drawStatus = function () {
                this.context.fillStyle = 'rgb(0,0,0)';

                var numsupp = 0;
                for (var i = 0; i < this.teacher.inputs.length; i++) {
                    if (this.teacher.alphaA[i] > 1e-5 || this.teacher.alphaB[i] > 1e-5) {
                        numsupp++;
                    }
                }

                this.context.fillText("Number of support vectors: " + numsupp + " / " + this.teacher.inputs.length, 10, SVM.Renderer.getHeight() - 50);

                if (this.teacher.kernel instanceof SVM.Kernels.GaussianKernel) {
                    this.context.fillText("Using Rbf kernel with sigma = " + this.teacher.kernel.sigma().toPrecision(2), 10, SVM.Renderer.getHeight() - 70);
                } else {
                    this.context.fillText("Using " + this.teacher.kernel.constructor.name, 10, SVM.Renderer.getHeight() - 70);
                }

                this.context.fillText("C = " + this.teacher.getComplexity().toPrecision(2), 10, SVM.Renderer.getHeight() - 90);

                return this;
            };

            Canvas.prototype.drawBubble = function (x, y, w, h, radius) {
                var r = x + w, b = y + h;

                this.context.beginPath();
                this.context.strokeStyle = "black";
                this.context.lineWidth = 2;
                this.context.moveTo(x + radius, y);
                this.context.lineTo(x + radius / 2, y - 10);
                this.context.lineTo(x + radius * 2, y);
                this.context.lineTo(r - radius, y);
                this.context.quadraticCurveTo(r, y, r, y + radius);
                this.context.lineTo(r, y + h - radius);
                this.context.quadraticCurveTo(r, b, r - radius, b);
                this.context.lineTo(x + radius, b);
                this.context.quadraticCurveTo(x, b, x, b - radius);
                this.context.lineTo(x, y + radius);
                this.context.quadraticCurveTo(x, y, x + radius, y);
                this.context.stroke();

                return this;
            };

            Canvas.prototype.drawRect = function (x, y, w, h, stroke) {
                if (typeof stroke === "undefined") { stroke = false; }
                this.context.beginPath();
                this.context.rect(x, y, w, h);
                this.context.closePath();
                this.context.fill();

                if (stroke) {
                    this.context.stroke();
                }

                return this;
            };

            Canvas.prototype.drawCircle = function (x, y, r) {
                this.context.beginPath();
                this.context.arc(x, y, r, 0, Math.PI * 2, true);
                this.context.closePath();
                this.context.stroke();
                this.context.fill();

                return this;
            };

            Canvas.prototype.clearCanvas = function () {
                this.context.clearRect(0, 0, SVM.Renderer.getWidth(), SVM.Renderer.getHeight());

                return this;
            };
            return Canvas;
        })();
        Renderer.Canvas = Canvas;
    })(SVM.Renderer || (SVM.Renderer = {}));
    var Renderer = SVM.Renderer;
})(SVM || (SVM = {}));
//# sourceMappingURL=Canvas.js.map
