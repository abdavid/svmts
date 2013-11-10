var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var LinearKernel = (function (_super) {
            __extends(LinearKernel, _super);
            function LinearKernel(constant) {
                if (typeof constant === "undefined") { constant = 1; }
                _super.call(this);
                this.properties = {
                    constant: {
                        type: 'number',
                        value: 0
                    }
                };

                this.properties.constant.value = constant;
            }
            LinearKernel.prototype.run = function (x, y) {
                var sum = this.properties.constant.value;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return sum;
            };

            LinearKernel.prototype.distance = function (x, y) {
                return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
            };
            return LinearKernel;
        })(Kernels.BaseKernel);
        Kernels.LinearKernel = LinearKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LinearKernel.js.map
