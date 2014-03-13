///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, Kernel) {
    /**
    * Infinite Spline Kernel function.
    */
    var Spline = (function (_super) {
        __extends(Spline, _super);
        function Spline() {
            _super.call(this);
        }
        /**
        * @param x
        * @param y
        * @returns {number}
        */
        Spline.prototype.run = function (x, y) {
            var k = 1;
            for (var i = 0; i < x.length; i++) {
                var min = Math.min(x[i], y[i]);
                var xy = x[i] * y[i];

                k *= 1.0 + xy + xy * min - ((x[i] + y[i]) / 2.0) * min * min + (min * min * min) / 3.0;
            }

            return k;
        };
        return Spline;
    })(Kernel.Base);
    exports.Spline = Spline;
});
//# sourceMappingURL=Spline.js.map
