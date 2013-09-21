var SVM;
(function (SVM) {
    (function (Kernels) {
        var LinearKernel = (function () {
            function LinearKernel(constant) {
                if (typeof constant === "undefined") { constant = 1; }
                this.constant = constant;
            }
            LinearKernel.prototype.run = function (x, y) {
                var sum = this.constant;

                for (var i = 0; i < x.length; i++) {
                    sum += x[i] * y[i];
                }

                return sum;
            };

            LinearKernel.prototype.distance = function (x, y) {
                return this.run(x, x) + this.run(y, y) - 2.0 * this.run(x, y);
            };
            return LinearKernel;
        })();
        Kernels.LinearKernel = LinearKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=LinearKernel.js.map
