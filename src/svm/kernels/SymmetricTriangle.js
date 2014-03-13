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
    * Symmetric Triangle Kernel.
    */
    var SymmetricTriangle = (function (_super) {
        __extends(SymmetricTriangle, _super);
        /**
        * @param gamma
        */
        function SymmetricTriangle(gamma) {
            if (typeof gamma === "undefined") { gamma = 1.0; }
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
        Object.defineProperty(SymmetricTriangle.prototype, "gamma", {
            /**
            * @returns {number}
            */
            get: function () {
                return this._gamma;
            },
            /**
            * @param value
            */
            set: function (value) {
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
        SymmetricTriangle.prototype.run = function (x, y) {
            var norm = 0.0, d;
            for (var i = 0; i < x.length; i++) {
                d = x[i] - y[i];
                norm += d * d;
            }

            var z = 1.0 - this.gamma * Math.sqrt(norm);

            return (z > 0) ? z : 0;
        };
        return SymmetricTriangle;
    })(Kernel.Base);
    exports.SymmetricTriangle = SymmetricTriangle;
});
//# sourceMappingURL=SymmetricTriangle.js.map
