///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    var Kernel = __Kernel__;

    /**
    * Squared Sinc Kernel.
    */
    var SquaredSinc = (function (_super) {
        __extends(SquaredSinc, _super);
        /**
        * @param gamma
        */
        function SquaredSinc(gamma) {
            if (typeof gamma === "undefined") { gamma = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'gamma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.gamma = gamma;
        }
        Object.defineProperty(SquaredSinc.prototype, "gamma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._gamma;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._gamma = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        SquaredSinc.prototype.run = function (x, y) {
            var norm = 0.0, d;
            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            var num = this.gamma * Math.sqrt(norm);
            var den = this.gamma * this.gamma * norm;

            return Math.sin(num) / den;
        };
        return SquaredSinc;
    })(Kernel.Base);
    exports.SquaredSinc = SquaredSinc;
});
//# sourceMappingURL=SquaredSinc.js.map
