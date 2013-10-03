var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Kernels) {
        var TStudentKernel = (function (_super) {
            __extends(TStudentKernel, _super);
            function TStudentKernel(degree) {
                if (typeof degree === "undefined") { degree = 1; }
                _super.call(this, [
                    {
                        name: 'degree',
                        value: degree
                    }
                ]);
            }
            TStudentKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }
                norm = Math.sqrt(norm);

                return 1.0 / (1.0 + Math.pow(norm, this.getKernelProperty('degree')));
            };
            return TStudentKernel;
        })(Kernels.BaseKernel);
        Kernels.TStudentKernel = TStudentKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=TStudentKernel.js.map
