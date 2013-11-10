var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var SplineKernel = (function (_super) {
            __extends(SplineKernel, _super);
            function SplineKernel() {
                _super.apply(this, arguments);
            }
            SplineKernel.prototype.run = function (x, y) {
                var k = 1;
                for (var i = 0; i < x.length; i++) {
                    var min = Math.min(x[i], y[i]);
                    var xy = x[i] * y[i];

                    k *= 1.0 + xy + xy * min - ((x[i] + y[i]) / 2.0) * min * min + (min * min * min) / 3.0;
                }

                return k;
            };
            return SplineKernel;
        })(Kernels.BaseKernel);
        Kernels.SplineKernel = SplineKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=SplineKernel.js.map
