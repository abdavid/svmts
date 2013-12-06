///<reference path='../interfaces/IKernel.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    var Kernel = __Kernel__;

    /**
    * Tensor Product combination of Kernels.
    */
    var Tensor = (function (_super) {
        __extends(Tensor, _super);
        /**
        * @param kernels
        */
        function Tensor(kernels) {
            _super.call(this);

            this._kernels = kernels;
        }
        /**
        * @param x
        * @param y
        * @returns {number}
        */
        Tensor.prototype.run = function (x, y) {
            var product = 1.0;
            for (var i = 0; i < this._kernels.length; i++) {
                product *= this._kernels[i].run(x, y);
            }

            return product;
        };
        return Tensor;
    })(Kernel.Base);
    exports.Tensor = Tensor;
});
//# sourceMappingURL=Tensor.js.map
