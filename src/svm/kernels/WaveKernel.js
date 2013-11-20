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
        var WaveKernel = (function (_super) {
            __extends(WaveKernel, _super);
            function WaveKernel() {
                _super.call(this);
                _super.prototype.initialize.call(this, {
                    sigma: {
                        type: 'number',
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
            WaveKernel.prototype.run = function (x, y) {
                var norm = 0.0;
                for (var i = 0; i < x.length; i++) {
                    var d = x[i] - y[i];
                    norm += d * d;
                }

                if (this.sigma == 0 || norm == 0) {
                    return 0;
                } else {
                    return (this.sigma / norm) * Math.sin(norm / this.sigma);
                }
            };
            return WaveKernel;
        })(Kernels.BaseKernel);
        Kernels.WaveKernel = WaveKernel;
    })(SVM.Kernels || (SVM.Kernels = {}));
    var Kernels = SVM.Kernels;
})(SVM || (SVM = {}));
//# sourceMappingURL=WaveKernel.js.map
