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
    * The spherical kernel comes from a statistics perspective. It is an example
    * of an isotropic stationary kernel and is positive definite in R^3.
    */
    var Spherical = (function (_super) {
        __extends(Spherical, _super);
        /**
        * @param sigma
        */
        function Spherical(sigma) {
            if (typeof sigma === "undefined") { sigma = 1.0; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'sigma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.sigma = sigma;
        }
        Object.defineProperty(Spherical.prototype, "sigma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._sigma;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._sigma = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        Spherical.prototype.run = function (x, y) {
            var norm = 0.0;
            for (var i = 0; i < x.length; i++) {
                var d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            if (norm >= this.sigma) {
                return 0;
            } else {
                norm = norm / this.sigma;
                return 1.0 - 1.5 * norm + 0.5 * norm * norm * norm;
            }
        };
        return Spherical;
    })(Kernel.Base);
    exports.Spherical = Spherical;
});
//# sourceMappingURL=Spherical.js.map
