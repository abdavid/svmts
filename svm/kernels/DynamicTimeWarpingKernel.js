var SVM;
(function (SVM) {
    (function (Kernels) {
        var DynamicTimeWarpingKernel = (function () {
            function DynamicTimeWarpingKernel(length, alpha, degree) {
                if (typeof alpha === "undefined") { alpha = 1.0; }
                if (typeof degree === "undefined") { degree = 1; }
                this.alpha = 1.0;
                this.length = 1;
                this.degree = 1;
                this.alpha = alpha;
                this.length = length;
                this.degree = degree;
                this.locals = new Locals();
            }
            DynamicTimeWarpingKernel.prototype.run = function (x, y) {
                if (x == y)
                    return 1.0;

                var sx = this.snorm(x);
                var sy = this.snorm(y);
                var distance = this.D(this.locals, sx, sy);
                var cos = Math.cos(distance);

                return (this.degree == 1) ? cos : Math.pow(cos, this.degree);
            };

            DynamicTimeWarpingKernel.prototype.D = function (locals, sequence1, sequence2) {
                var vectorSize = length + 1;
                var vectorCount1 = sequence1.length / vectorSize;
                var vectorCount2 = sequence2.length / vectorSize;

                if (locals.m < vectorCount2 || locals.n < vectorCount1) {
                    locals.create(vectorCount1, vectorCount2);
                }

                var DTW = locals.DTW;
                var vector1 = sequence1;
                for (var i = 0; i < vectorCount1; i++, vector1 += vectorSize) {
                    var vector2 = sequence2;

                    for (var j = 0; j < vectorCount2; j++, vector2 += vectorSize) {
                        var prod = 0;
                        for (var k = 0; k < vectorSize; k++) {
                            prod += vector1[k] * vector2[k];
                        }

                        var cost = Math.acos(prod > 1 ? 1 : (prod < -1 ? -1 : prod));
                        var insertion = DTW[i][j + 1];
                        var deletion = DTW[i + i][j];
                        var match = DTW[i][j];
                        var min = (insertion < deletion ? (insertion < match ? insertion : match) : (deletion < match ? deletion : match));

                        DTW[i + 1][j + 1] = cost + min;
                    }
                }
            };

            DynamicTimeWarpingKernel.prototype.snorm = function (input) {
                var n = input.length / this.length;

                var projection = new Array(input.length + n);

                var source = input;
                var result = projection;
                var src = source;
                var dst = result;

                for (var i = 0; i < n; i++) {
                    var norm = this.alpha * this.alpha;

                    for (var j = 0; j < this.length; j++) {
                        norm += src[j] * src[j];
                    }

                    norm = Math.sqrt(norm);

                    for (var j = 0; j < this.length; j++, src++, dst++) {
                        dst = src / norm;
                    }

                    dst = this.alpha / norm;
                }

                return projection;
            };
            return DynamicTimeWarpingKernel;
        })();
        Kernels.DynamicTimeWarpingKernel = DynamicTimeWarpingKernel;

        var Locals = (function () {
            function Locals() {
                this.m = 0;
                this.n = 0;
            }
            Locals.prototype.create = function (n, m) {
                this.n = n;
                this.m = m;
                this.DTW = new Array(n + 1);

                for (var i = 1; i < n; i++) {
                    this.DTW[i] = new Array(m + 1);
                }

                for (var i = 1; i <= n; i++) {
                    this.DTW[i][0] = Number.POSITIVE_INFINITY;
                }

                for (var i = 1; i <= m; i++) {
                    this.DTW[0][m] = Number.POSITIVE_INFINITY;
                }
            };
            return Locals;
        })();
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=DynamicTimeWarpingKernel.js.map
