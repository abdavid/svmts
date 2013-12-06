/**
* Created by davidatborresen on 9/3/13.
*/
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
    * @class Cauchy
    *
    * @summary
    * The Cauchy kernel comes from the Cauchy distribution (Basak, 2008). It is a
    * long-tailed kernel and can be used to give long-range influence and sensitivity
    * over the high dimension space.
    */
    var Cauchy = (function (_super) {
        __extends(Cauchy, _super);
        /**
        * @param sigma
        */
        function Cauchy(sigma) {
            if (typeof sigma === "undefined") { sigma = 1; }
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
        Object.defineProperty(Cauchy.prototype, "sigma", {
            get: function () {
                return this._sigma;
            },
            set: function (value) {
                this._sigma = value;
            },
            enumerable: true,
            configurable: true
        });


        Cauchy.prototype.run = function (x, y) {
            if (x == y) {
                return 1.0;
            }

            var norm = 0.0;
            for (var i = 0; i < x.length; i++) {
                var d = x[i] - y[i];
                norm += d * d;
            }

            return (1.0 / (1.0 + norm / this.sigma));
        };
        return Cauchy;
    })(Kernel.Base);
    exports.Cauchy = Cauchy;
});
//# sourceMappingURL=Cauchy.js.map
