var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /**
    * Created by davidatborresen on 9/3/13.
    */
    ///<reference path='../interfaces/IKernel.ts' />
    ///<reference path='./BaseKernel.ts' />
    (function (Kernels) {
        /**
        * Generalized Histogram Intersection Kernel.
        *
        * The Generalized Histogram Intersection kernel is built based on the
        * Histogram Intersection Kernel for image classification but applies
        * in a much larger variety of contexts (Boughorbel, 2005).
        */
        var HistogramIntersectionKernel = (function (_super) {
            __extends(HistogramIntersectionKernel, _super);
            function HistogramIntersectionKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    alpha: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    },
                    beta: {
                        type: PropertyType.NUMBER,
                        value: 1,
                        writable: true
                    }
                });
            }
            /**
            * @param x
            * @param y
            * @returns {number}
            */
            HistogramIntersectionKernel.prototype.run = function (x, y) {
                var sum = 0.0;
                for (var i = 0; i < x.length; i++) {
                    sum += Math.min(Math.pow(Math.abs(x[i]), this.alpha), Math.pow(Math.abs(y[i]), this.beta));
                }

                return sum;
            };
            return HistogramIntersectionKernel;
        })(Kernels.BaseKernel);
        Kernels.HistogramIntersectionKernel = HistogramIntersectionKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=HistogramIntersectionKernel.js.map
